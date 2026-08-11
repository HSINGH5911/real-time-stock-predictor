from fastapi import APIRouter, HTTPException
from services.feature_service import get_cached_or_live_features, compute_live_feature_vector

router = APIRouter(prefix="/api/v1/features", tags=["features"])

@router.get("/{ticker}")
def get_features(ticker: str):
    """
    Returns the Day 3 feature vector for a ticker (cached in Redis under features:{TICKER}).
    Includes Price, RSI, MACD, Volatility, Sentiment Aggregates, and Event Flags.
    """
    try:
        vector = get_cached_or_live_features(ticker)
        return {"status": "success", "data": vector}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{ticker}/recalculate")
def recalculate_features(ticker: str):
    """Forces fresh re-computation and Redis caching of the feature vector."""
    try:
        vector = compute_live_feature_vector(ticker)
        return {"status": "success", "message": f"Features recalculated for {ticker}", "data": vector}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
