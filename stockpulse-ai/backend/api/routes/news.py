import json
from fastapi import APIRouter, HTTPException
from database.client import redis_client
from workers.news_worker import run_news_worker

router = APIRouter(prefix="/news", tags=["Financial News"])

@router.get("")
@router.get("/")
def get_all_news():
    """
    Returns financial news articles from Redis Stream 'news_stream'.
    """
    stream_entries = redis_client.xrange("stream:news_events", count=20)
    articles = []

    for entry_id, fields in stream_entries:
        if isinstance(fields, dict):
            articles.append(fields)

    # If stream is empty, trigger news worker to populate
    if not articles:
        run_news_worker()
        stream_entries = redis_client.xrange("stream:news_events", count=20)
        for entry_id, fields in stream_entries:
            if isinstance(fields, dict):
                articles.append(fields)

    return {"count": len(articles), "data": articles}

@router.get("/{ticker}")
def get_news_for_ticker(ticker: str):
    ticker = ticker.upper()
    json_list = redis_client.lrange(f"recent_news:{ticker}", 0, 10)
    articles = []
    for item in json_list:
        try:
            articles.append(json.loads(item))
        except Exception:
            pass

    return {"ticker": ticker, "count": len(articles), "data": articles}
