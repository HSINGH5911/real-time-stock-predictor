import unittest
import json
import os
import sys

# Ensure backend root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.sentiment_service import analyze, update_stock_sentiment, save_enriched_article
from services.news_service import fetch_latest_news, extract_tickers, detect_event
from database.client import redis_client
from workers.news_worker import run_news_worker
from workers.sentiment_worker import run_sentiment_worker_once


class TestDay2Pipeline(unittest.TestCase):

    def test_01_marketaux_api_key_works(self):
        """Verifies MarketAux API key fetches live data"""
        articles = fetch_latest_news()
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        first = articles[0]
        self.assertIn("headline", first)
        self.assertIn("summary", first)
        self.assertIn("event", first)
        print(f"[TEST] MarketAux Key Active: Fetched {len(articles)} articles.")

    def test_02_ticker_extraction(self):
        """Verifies Step 8 Ticker Extraction"""
        raw1 = {"title": "Apple partners with Nvidia for AI MacBooks", "snippet": "AAPL and NVDA joint event."}
        tickers1 = extract_tickers(raw1)
        self.assertIn("AAPL", tickers1)
        self.assertIn("NVDA", tickers1)

    def test_03_event_detection(self):
        """Verifies Step 10 Event Detection"""
        e1 = detect_event("Tesla reports record quarterly earnings and profit")
        e2 = detect_event("Google launches Gemini 2.0 AI model")
        self.assertEqual(e1, "Earnings")
        self.assertEqual(e2, "AI")

    def test_04_finbert_sentiment_scoring(self):
        """Verifies FinBERT model scoring and score normalization [-1.0, +1.0]"""
        res_pos = analyze("Apple beats quarterly earnings expectations with record revenue")
        res_neg = analyze("Tesla misses delivery targets as supply delays mount")
        
        self.assertEqual(res_pos["label"], "positive")
        self.assertGreater(res_pos["score"], 0.5)
        
        self.assertEqual(res_neg["label"], "negative")
        self.assertLess(res_neg["score"], -0.5)

    def test_05_end_to_end_worker_pipeline(self):
        """Verifies full Redis Stream -> Worker -> FinBERT -> Redis Hash & List pipeline"""
        # 1. Run news worker
        n_count = run_news_worker()
        self.assertGreater(n_count, 0)
        
        # 2. Run sentiment worker
        s_count = run_sentiment_worker_once(limit=10)
        self.assertGreater(s_count, 0)
        
        # 3. Verify Redis stream and ticker data
        stream_len = redis_client.xlen("stream:news_events")
        self.assertGreaterEqual(stream_len, n_count)
        
        # Check stock:NVDA or stock:AAPL
        nvda_hash = redis_client.hgetall("stock:NVDA")
        if nvda_hash:
            self.assertIn("sentiment", nvda_hash)
            self.assertIn("article_count", nvda_hash)
            print(f"[TEST] Redis stock:NVDA Hash verified: {nvda_hash}")


if __name__ == "__main__":
    unittest.main()
