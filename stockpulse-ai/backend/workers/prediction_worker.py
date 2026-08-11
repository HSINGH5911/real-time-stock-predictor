import time
import os
import sys
from typing import List, Optional

# Add backend directory to sys.path if not present
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.feature_service import get_cached_or_live_features
from services.prediction_service import predict_stock_movement, get_prediction_history_from_redis

from services.market_service import DEFAULT_TICKERS

def run_prediction_worker_once(tickers: Optional[List[str]] = None) -> List[dict]:
    """
    Executes a single prediction cycle across target tickers:
    - Fetches cached or live feature vectors from Redis / Feature Pipeline
    - Runs Random Forest model prediction service
    - Saves current prediction to prediction:{TICKER} hash and appends to prediction_history:{TICKER} list
    """
    if tickers is None:
        tickers = DEFAULT_TICKERS

    results = []
    print(f"[PredictionWorker] Running prediction cycle for tickers: {', '.join(tickers)}")

    for ticker in tickers:
        try:
            feats = get_cached_or_live_features(ticker)
            pred_res = predict_stock_movement(feats)
            results.append(pred_res)
            print(
                f"[PredictionWorker] Successfully updated {ticker} -> "
                f"Prediction: {pred_res['prediction']} | "
                f"Confidence: {pred_res['confidence']*100:.1f}% (UP: {pred_res['probability_up']*100:.1f}%, DOWN: {pred_res['probability_down']*100:.1f}%) | "
                f"Version: {pred_res['model_version']}"
            )
        except Exception as e:
            print(f"[PredictionWorker] Error processing prediction for {ticker}: {e}")

    return results

def start_prediction_worker_loop(interval_seconds: int = 1800, tickers: Optional[List[str]] = None):
    """
    Continuous background loop for prediction worker.
    Default interval: 30 minutes (1800 seconds).
    """
    print(f"[PredictionWorker] Starting background worker loop (refresh every {interval_seconds}s)...")
    while True:
        try:
            run_prediction_worker_once(tickers)
        except Exception as e:
            print(f"[PredictionWorker] Exception in main loop iteration: {e}")
        time.sleep(interval_seconds)

if __name__ == "__main__":
    run_prediction_worker_once()

