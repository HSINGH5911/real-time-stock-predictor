import json
import time
from database.client import redis_client
from services.sentiment_service import analyze, update_stock_sentiment, save_enriched_article

STREAM_KEY = "stream:news_events"

def run_sentiment_worker_once(limit=20) -> int:
    """
    Step 5: Consumes news events from Redis Stream 'stream:news_events',
    runs FinBERT sentiment scoring, enriches data with events, updates running sentiment
    in Redis Hash 'stock:{TICKER}', and pushes to Redis List 'recent_news:{TICKER}'.
    """
    processed_count = 0
    try:
        # Step 5 - XREAD stream:news_events
        stream_data = redis_client.xread({STREAM_KEY: "0"}, count=limit)
        if not stream_data:
            return 0

        for key, entries in stream_data:
            for entry_id, fields in entries:
                if not isinstance(fields, dict):
                    continue

                headline = fields.get("headline", "")
                summary = fields.get("summary", "")
                source = fields.get("source", "MarketAux")
                timestamp = fields.get("timestamp", "")
                url = fields.get("url", "#")
                event_type = fields.get("event", "General")

                # Parse tickers array or fallback
                raw_tickers = fields.get("tickers", "[]")
                try:
                    tickers = json.loads(raw_tickers)
                except Exception:
                    tickers = [fields.get("ticker", "AAPL")]

                if not tickers:
                    tickers = [fields.get("ticker", "AAPL")]

                # Step 2 & 4 - Run FinBERT Sentiment Analysis
                try:
                    s_res = analyze(headline, summary)
                except Exception as e:

                    # Step 15 - Error handling fallback
                    print(f"[SentimentWorker] [ERROR] Model inference failed for article '{headline}': {e}. Using neutral fallback.")
                    s_res = {
                        "label": "neutral",
                        "score": 0.00,
                        "confidence": 0.50,
                        "breakdown": {"positive": 0.0, "negative": 0.0, "neutral": 1.0}
                    }

                # Step 8 - Fan-out & store under each matched ticker
                for ticker in tickers:
                    ticker = ticker.upper()

                    # Step 6 & 7 - Update Redis Hash running sentiment
                    update_stock_sentiment(ticker, s_res["score"], s_res["confidence"])

                    # Step 9 - Construct normalized enriched article object
                    enriched_article = {
                        "id": str(entry_id),
                        "ticker": ticker,
                        "headline": headline,
                        "summary": summary,
                        "source": source,
                        "timestamp": timestamp,
                        "url": url,
                        "sentiment": s_res["label"],
                        "score": s_res["score"],
                        "confidence": s_res["confidence"],
                        "event": event_type
                    }

                    # Step 6 - Save to recent_news:{TICKER} list
                    save_enriched_article(ticker, enriched_article)
                    processed_count += 1

                # Step 16 - Structured Logging
                print(f"[INFO] Processed article id={entry_id} | Ticker={tickers} | Headline='{headline[:40]}...' | Sentiment={s_res['label']} ({s_res['score']}) | Event={event_type}")

    except Exception as e:
        print(f"[SentimentWorker] Error processing stream: {e}")

    return processed_count

def start_worker_daemon():
    """
    Runs the sentiment worker in a continuous background loop.
    """
    print("[SentimentWorker] Starting continuous worker loop...")
    while True:
        try:
            count = run_sentiment_worker_once(limit=10)
            if count == 0:
                time.sleep(2)
        except Exception as e:
            print(f"[SentimentWorker] Daemon loop error: {e}. Retrying in 2s...")
            time.sleep(2)

if __name__ == "__main__":
    start_worker_daemon()