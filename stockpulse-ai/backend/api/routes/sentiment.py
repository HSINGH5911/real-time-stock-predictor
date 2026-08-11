from fastapi import APIRouter, HTTPException
from database.client import redis_client
from services.news_service import DEFAULT_SYMBOLS

router = APIRouter(prefix="/sentiment", tags=["Sentiment Intelligence"])

@router.get("")
@router.get("/")
def get_all_sentiments():
    """
    Step 11: Returns current running sentiment summaries for all tracked stock tickers.
    """
    results = []
    for ticker in DEFAULT_SYMBOLS:
        hash_data = redis_client.hgetall(f"stock:{ticker}") or {}
        if hash_data:
            results.append({
                "ticker": ticker,
                "sentiment": float(hash_data.get("sentiment", 0.0)),
                "confidence": float(hash_data.get("confidence", 0.0)),
                "article_count": int(hash_data.get("article_count", 0)),
                "last_updated": hash_data.get("last_updated", "")
            })
    return {"count": len(results), "data": results}


@router.get("/{ticker}")
def get_sentiment_for_ticker(ticker: str):
    """
    Step 11: Returns sentiment summary for a specific stock ticker.
    """
    ticker = ticker.upper()
    hash_data = redis_client.hgetall(f"stock:{ticker}") or {}
    
    if not hash_data:
        raise HTTPException(status_code=404, detail=f"No sentiment data found for ticker {ticker}")
        
    return {
        "ticker": ticker,
        "sentiment": float(hash_data.get("sentiment", 0.0)),
        "confidence": float(hash_data.get("confidence", 0.0)),
        "article_count": int(hash_data.get("article_count", 0)),
        "last_updated": hash_data.get("last_updated", "")
    }
