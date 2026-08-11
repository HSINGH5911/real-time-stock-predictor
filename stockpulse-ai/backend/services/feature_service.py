import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional

try:
    import yfinance as yf
except ImportError:
    yf = None

try:
    from database.client import RedisClient
except ImportError:
    RedisClient = None

from ml.feature_builder import (
    calculate_rsi,
    calculate_sma,
    calculate_macd,
    calculate_volatility,
    aggregate_news_features,
    extract_event_flags
)
from services.news_service import fetch_latest_news
from services.market_service import fetch_stock_quote

def compute_live_feature_vector(ticker: str) -> Dict[str, Any]:
    """
    Computes live feature vector for a target ticker combining:
    - Live Market Quote (Price, Volume)
    - Technical Indicators (RSI, SMA20, MACD, Volatility) via 30-day historical window
    - Aggregated FinBERT Sentiment (Average Sentiment, Positive/Negative Ratios, Count)
    - Binary Corporate Event Flags
    """
    ticker = ticker.upper()
    quote = fetch_stock_quote(ticker)
    news = fetch_latest_news([ticker])

    # 1. Technical Indicators via historical prices
    rsi_val, sma_val, macd_hist_val, vol_val = 50.0, quote.get("price", 0.0), 0.0, 0.015
    price = quote.get("price", 200.0)

    def _calc_tech():
        nonlocal rsi_val, sma_val, macd_hist_val, vol_val
        if yf is None:
            return
        hist = yf.Ticker(ticker).history(period="1mo")
        if not hist.empty and len(hist) >= 5:
            closes = hist["Close"]
            rsi_val = round(float(calculate_rsi(closes, 14).iloc[-1]), 2)
            sma_20 = float(calculate_sma(closes, 20).iloc[-1])
            sma_val = round(sma_20, 2)
            macd_dict = calculate_macd(closes)
            macd_hist_val = round(float(macd_dict["histogram"].iloc[-1]), 4)
            vol_val = round(float(calculate_volatility(closes, 20).iloc[-1]), 4)

    try:
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_calc_tech)
            future.result(timeout=1.5)
    except Exception as e:
        print(f"[FeatureService] Technical calculation warning for {ticker}: {e}")

    price_sma_ratio = round(price / sma_val, 4) if sma_val > 0 else 1.0

    # 2. News & Event aggregation
    news_feats = aggregate_news_features(news)
    event_feats = extract_event_flags(news)

    # 3. Combine into unified Feature Vector
    feature_vector = {
        "ticker": ticker,
        "price": price,
        "volume": quote.get("volume", 40000000),
        "rsi_14": rsi_val,
        "sma_20": sma_val,
        "price_sma_ratio": price_sma_ratio,
        "macd_hist": macd_hist_val,
        "volatility_20": vol_val,
        "sentiment_avg": news_feats["sentiment_avg"],
        "positive_ratio": news_feats["positive_ratio"],
        "negative_ratio": news_feats["negative_ratio"],
        "article_count": news_feats["article_count"],
        "earnings_flag": event_feats["earnings_flag"],
        "product_launch_flag": event_feats["product_launch_flag"],
        "ceo_change_flag": event_feats["ceo_change_flag"],
        "merger_flag": event_feats["merger_flag"],
        "dividend_flag": event_feats["dividend_flag"],
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    # 4. Cache in Redis under features:{TICKER} (Step 9)
    try:
        if RedisClient is not None:
            r = RedisClient()
            for k, v in feature_vector.items():
                r.hset(f"features:{ticker}", k, str(v))
            print(f"[FeatureService] Cached feature vector in Redis under features:{ticker}")
    except Exception as e:
        print(f"[FeatureService] Redis caching warning: {e}")

    return feature_vector

def get_cached_or_live_features(ticker: str) -> Dict[str, Any]:
    """Retrieves features from Redis cache (features:{TICKER}) or computes live if missing."""
    ticker = ticker.upper()
    try:
        if RedisClient is not None:
            r = RedisClient()
            cached = r.hgetall(f"features:{ticker}")
            if cached:
                # Convert numeric string fields back to floats/ints
                parsed = {}
                for k, v in cached.items():
                    if k in ["price", "rsi_14", "sma_20", "price_sma_ratio", "macd_hist", "volatility_20", "sentiment_avg", "positive_ratio", "negative_ratio"]:
                        parsed[k] = float(v)
                    elif k in ["volume", "article_count", "earnings_flag", "product_launch_flag", "ceo_change_flag", "merger_flag", "dividend_flag"]:
                        parsed[k] = int(v)
                    else:
                        parsed[k] = v
                return parsed
    except Exception as e:
        print(f"[FeatureService] Redis cache lookup failed: {e}")

    return compute_live_feature_vector(ticker)
