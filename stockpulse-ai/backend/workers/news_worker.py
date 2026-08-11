import json
from database.client import redis_client
from services.news_service import fetch_latest_news

def run_news_worker():
    """
    Ingests financial news from MarketAux API via news_service,
    normalizes payloads, and publishes events to Redis Stream 'stream:news_events'.
    """
    try:
        articles = fetch_latest_news()
        ingested_count = 0

        for article in articles:
            # Format payload dictionary for Redis Stream
            payload = {
                "id": str(article.get("id", "")),
                "tickers": json.dumps(article.get("tickers", [article.get("ticker", "AAPL")])),
                "ticker": str(article.get("ticker", "AAPL")),
                "headline": str(article.get("headline", "")),
                "summary": str(article.get("summary", "")),
                "source": str(article.get("source", "MarketAux")),
                "timestamp": str(article.get("timestamp", "")),
                "url": str(article.get("url", "#")),
                "event": str(article.get("event", "General"))
            }

            # Step 5 - Publish to Redis Stream 'stream:news_events'
            redis_client.xadd("stream:news_events", payload, maxlen=500)
            ingested_count += 1

        print(f"[NewsWorker] Published {ingested_count} news events to Redis Stream 'stream:news_events'.")
        return ingested_count
    except Exception as e:
        print(f"[NewsWorker] Error during news ingestion: {e}")
        return 0

if __name__ == "__main__":
    run_news_worker()
