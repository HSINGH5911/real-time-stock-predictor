import unittest
import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

class TestFastAPIEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_01_health_check(self):
        """GET /health returns healthy status and system checks"""
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("status", data)
        self.assertIn("database", data)
        self.assertIn("model", data)
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["database"], "connected")
        self.assertEqual(data["model"], "loaded")

    def test_02_get_market_quotes(self):
        """GET /market returns stock quote list"""
        res = self.client.get("/market")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("data", data)
        self.assertGreater(len(data["data"]), 0)

    def test_03_get_specific_stock(self):
        """GET /market/AAPL returns quote object for AAPL"""
        res = self.client.get("/market/AAPL")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["ticker"], "AAPL")
        self.assertIn("data", data)

    def test_04_get_news(self):
        """GET /news returns financial news stream"""
        res = self.client.get("/news")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("data", data)

    def test_05_get_prediction_aapl(self):
        """GET /predict/AAPL returns direction, probability_up, probability_down, and explainability signals"""
        res = self.client.get("/predict/AAPL")
        self.assertEqual(res.status_code, 200)
        json_resp = res.json()
        self.assertEqual(json_resp["status"], "success")
        data = json_resp["data"]
        self.assertEqual(data["ticker"], "AAPL")
        self.assertIn(data["prediction"], ["UP", "DOWN"])
        self.assertGreaterEqual(data["probability_up"], 0.0)
        self.assertLessEqual(data["probability_up"], 1.0)
        self.assertGreaterEqual(data["probability_down"], 0.0)
        self.assertLessEqual(data["probability_down"], 1.0)
        self.assertIn("top_signals", data)

    def test_06_prediction_history(self):
        """GET /predictions/AAPL/history returns recorded history array"""
        res = self.client.get("/predictions/AAPL/history")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["ticker"], "AAPL")
        self.assertIn("data", data)

    def test_07_backtest_report(self):
        """GET /predictions/backtest returns backtest metrics and strategy performance"""
        res = self.client.get("/predictions/backtest")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("metrics", data)
        self.assertIn("trading_simulation", data)

if __name__ == "__main__":
    unittest.main()
