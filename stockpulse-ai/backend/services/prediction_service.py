import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

try:
    from database.client import RedisClient
except ImportError:
    RedisClient = None

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "ml", "models"))
METADATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "ml", "models", "metadata"))

# Cache dictionaries for loaded models & metadata by version
_models_cache: Dict[str, Any] = {}
_metadata_cache: Dict[str, Any] = {}

DEFAULT_MODEL_VERSION = "rf_v1"

def load_prediction_model(version: str = DEFAULT_MODEL_VERSION):
    """
    Loads the trained model binary and metadata for the given version.
    Supports models stored in backend/ml/models/rf_v1.pkl with metadata in backend/ml/models/metadata/rf_v1.json.
    """
    global _models_cache, _metadata_cache

    if version in _models_cache and version in _metadata_cache:
        return _models_cache[version], _metadata_cache[version]

    model_path = os.path.join(MODELS_DIR, f"{version}.pkl")
    metadata_path = os.path.join(METADATA_DIR, f"{version}.json")

    # Fallbacks for legacy paths if versioned path is missing
    if not os.path.exists(model_path):
        legacy_model = os.path.abspath(os.path.join(BASE_DIR, "..", "ml", "random_forest.pkl"))
        if os.path.exists(legacy_model):
            model_path = legacy_model

    if not os.path.exists(metadata_path):
        legacy_meta = os.path.abspath(os.path.join(BASE_DIR, "..", "ml", "model_metadata.json"))
        if os.path.exists(legacy_meta):
            metadata_path = legacy_meta

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model binary for '{version}' not found at {model_path}. Run train_model.py first.")

    # Load model binary
    try:
        model = joblib.load(model_path)
    except Exception:
        import pickle
        with open(model_path, "rb") as f:
            model = pickle.load(f)

    # Load metadata JSON
    metadata = {}
    if os.path.exists(metadata_path):
        with open(metadata_path, "r") as f:
            metadata = json.load(f)

    _models_cache[version] = model
    _metadata_cache[version] = metadata

    return model, metadata

def generate_explainability_signals(feature_vector: Dict[str, Any], feature_importances: Dict[str, float]) -> List[Dict[str, Any]]:
    """
    Generates dynamic, human-interpretable top market signals by combining
    global feature importance with live feature values.
    """
    signals = []

    # 1. Sentiment Signal
    sentiment = float(feature_vector.get("sentiment_avg", 0.0))
    if sentiment > 0.15:
        signals.append({
            "feature": "Sentiment",
            "signal": f"Positive market sentiment (+{sentiment:.2f})",
            "type": "bullish",
            "importance": feature_importances.get("Sentiment_Avg", 0.10)
        })
    elif sentiment < -0.15:
        signals.append({
            "feature": "Sentiment",
            "signal": f"Negative market sentiment ({sentiment:.2f})",
            "type": "bearish",
            "importance": feature_importances.get("Sentiment_Avg", 0.10)
        })

    # 2. RSI Signal
    rsi = float(feature_vector.get("rsi_14", 50.0))
    if rsi > 65:
        signals.append({
            "feature": "RSI",
            "signal": f"Overbought momentum (RSI: {rsi:.1f})",
            "type": "bearish",
            "importance": feature_importances.get("RSI_14", 0.12)
        })
    elif rsi < 35:
        signals.append({
            "feature": "RSI",
            "signal": f"Oversold bounce potential (RSI: {rsi:.1f})",
            "type": "bullish",
            "importance": feature_importances.get("RSI_14", 0.12)
        })
    else:
        signals.append({
            "feature": "RSI",
            "signal": f"Neutral RSI momentum ({rsi:.1f})",
            "type": "neutral",
            "importance": feature_importances.get("RSI_14", 0.12)
        })

    # 3. MACD Signal
    macd_hist = float(feature_vector.get("macd_hist", 0.0))
    if macd_hist > 0:
        signals.append({
            "feature": "MACD",
            "signal": "Bullish MACD histogram crossover",
            "type": "bullish",
            "importance": feature_importances.get("MACD_Hist", 0.10)
        })
    else:
        signals.append({
            "feature": "MACD",
            "signal": "Bearish MACD histogram crossover",
            "type": "bearish",
            "importance": feature_importances.get("MACD_Hist", 0.10)
        })

    # 4. Volume Signal
    vol = float(feature_vector.get("volume", 0))
    if vol > 30000000:
        signals.append({
            "feature": "Volume",
            "signal": f"High institutional volume ({vol/1e6:.1f}M shares)",
            "type": "bullish" if macd_hist > 0 else "neutral",
            "importance": feature_importances.get("Volume", 0.16)
        })

    # 5. Price SMA Ratio
    price_sma = float(feature_vector.get("price_sma_ratio", 1.0))
    if price_sma > 1.02:
        signals.append({
            "feature": "SMA Trend",
            "signal": "Trading above 20-day Simple Moving Average",
            "type": "bullish",
            "importance": feature_importances.get("Price_SMA_Ratio", 0.11)
        })
    elif price_sma < 0.98:
        signals.append({
            "feature": "SMA Trend",
            "signal": "Trading below 20-day Simple Moving Average",
            "type": "bearish",
            "importance": feature_importances.get("Price_SMA_Ratio", 0.11)
        })

    # Sort signals by importance descending
    signals.sort(key=lambda x: x["importance"], reverse=True)
    return signals[:5]

def predict_stock_movement(feature_vector: Dict[str, Any], version: str = DEFAULT_MODEL_VERSION) -> Dict[str, Any]:
    """
    Standardized prediction engine method.
    - Loads versioned model
    - Formats feature input DataFrame
    - Calculates predict_proba()
    - Returns prediction label, confidence, probability breakdown, and explainability signals
    - Automatically persists prediction to Redis (current hash & history list)
    """
    model, metadata = load_prediction_model(version)

    features = metadata.get("features", [
        'Close', 'Volume', 'RSI_14', 'SMA_20', 'Price_SMA_Ratio',
        'MACD_Line', 'MACD_Signal', 'MACD_Hist', 'Volatility_20',
        'Sentiment_Avg', 'Positive_Ratio', 'Negative_Ratio', 'Article_Count',
        'earnings_flag', 'product_launch_flag', 'ceo_change_flag', 'merger_flag', 'dividend_flag'
    ])

    # Map keys from feature_vector handling upper/lowercase
    input_dict = {}
    for feat in features:
        val = feature_vector.get(feat, feature_vector.get(feat.lower(), 0.0))
        try:
            input_dict[feat] = float(val)
        except (ValueError, TypeError):
            input_dict[feat] = 0.0

    df_input = pd.DataFrame([input_dict])[features]

    # Model Inference
    probs = model.predict_proba(df_input)[0]
    prob_down = round(float(probs[0]), 4)
    prob_up = round(float(probs[1]), 4)

    prediction_label = "UP" if prob_up >= prob_down else "DOWN"
    confidence = round(max(prob_up, prob_down), 4)

    timestamp = feature_vector.get("updated_at", datetime.now(timezone.utc).isoformat())
    ticker = feature_vector.get("ticker", "UNKNOWN").upper()
    feat_importances = metadata.get("feature_importances", {})

    signals = generate_explainability_signals(feature_vector, feat_importances)

    prediction_result = {
        "ticker": ticker,
        "prediction": prediction_label,
        "confidence": confidence,
        "probability_up": prob_up,
        "probability_down": prob_down,
        "model": metadata.get("model", "RandomForestClassifier"),
        "model_version": metadata.get("version", version),
        "timestamp": timestamp,
        "feature_importances": feat_importances,
        "top_signals": signals
    }

    # Store in Redis DB (current prediction & append to history)
    save_prediction_to_redis(prediction_result)

    return prediction_result

def save_prediction_to_redis(pred: Dict[str, Any]):
    """Persists current prediction hash and appends to prediction history list in Redis."""
    if RedisClient is None:
        return

    try:
        r = RedisClient()
        ticker = pred["ticker"]
        current_key = f"prediction:{ticker}"
        history_key = f"prediction_history:{ticker}"

        # 1. Update current prediction Hash
        hash_data = {
            "ticker": ticker,
            "prediction": pred["prediction"],
            "confidence": str(pred["confidence"]),
            "probability_up": str(pred["probability_up"]),
            "probability_down": str(pred["probability_down"]),
            "model": pred["model"],
            "model_version": pred["model_version"],
            "timestamp": str(pred["timestamp"])
        }
        for k, v in hash_data.items():
            r.hset(current_key, k, v)

        # 2. Push to prediction_history List (keep latest 50 entries)
        history_entry = json.dumps({
            "prediction": pred["prediction"],
            "confidence": pred["confidence"],
            "probability_up": pred["probability_up"],
            "probability_down": pred["probability_down"],
            "model_version": pred["model_version"],
            "timestamp": pred["timestamp"]
        })
        r.lpush(history_key, history_entry)
        r.ltrim(history_key, 0, 49)

    except Exception as e:
        print(f"[PredictionService] Redis persistence warning for {pred.get('ticker')}: {e}")

def get_prediction_history_from_redis(ticker: str, limit: int = 20) -> List[Dict[str, Any]]:
    """Retrieves recent prediction history entries for a ticker from Redis list."""
    ticker = ticker.upper()
    history = []
    if RedisClient is None:
        return history

    try:
        r = RedisClient()
        raw_items = r.lrange(f"prediction_history:{ticker}", 0, limit - 1)
        for item in raw_items:
            try:
                if isinstance(item, str):
                    history.append(json.loads(item))
                elif isinstance(item, dict):
                    history.append(item)
            except Exception:
                continue
    except Exception as e:
        print(f"[PredictionService] Error fetching history for {ticker}: {e}")

    return history

