import unittest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.feature_service import get_cached_or_live_features
from services.prediction_service import load_prediction_model, predict_stock_movement
from ml.backtest import run_historical_backtest

class TestMachineLearningEngine(unittest.TestCase):

    def test_01_load_prediction_model(self):
        """Verifies Random Forest binary and metadata load cleanly"""
        model, metadata = load_prediction_model("rf_v1")
        self.assertIsNotNone(model)
        self.assertIsInstance(metadata, dict)
        self.assertIn("version", metadata)
        self.assertIn("features", metadata)

    def test_02_feature_vector_generation(self):
        """Verifies feature service outputs Day 3 feature vector"""
        feats = get_cached_or_live_features("AAPL")
        self.assertIsInstance(feats, dict)
        self.assertIn("ticker", feats)
        self.assertIn("rsi_14", feats)
        self.assertIn("macd_hist", feats)
        self.assertIn("sentiment_avg", feats)

    def test_03_prediction_inference(self):
        """Verifies prediction engine inference and probability constraints"""
        feats = get_cached_or_live_features("NVDA")
        pred = predict_stock_movement(feats, version="rf_v1")
        
        self.assertEqual(pred["ticker"], "NVDA")
        self.assertIn(pred["prediction"], ["UP", "DOWN"])
        self.assertGreaterEqual(pred["probability_up"], 0.0)
        self.assertLessEqual(pred["probability_up"], 1.0)
        self.assertGreaterEqual(pred["probability_down"], 0.0)
        self.assertLessEqual(pred["probability_down"], 1.0)
        
        # Check probability sum equals 1.0
        self.assertAlmostEqual(pred["probability_up"] + pred["probability_down"], 1.0, places=2)
        
        # Verify explainability signals format
        self.assertIn("top_signals", pred)
        self.assertIsInstance(pred["top_signals"], list)

    def test_04_backtest_execution(self):
        """Verifies out-of-sample backtesting strategy engine"""
        report = run_historical_backtest()
        self.assertIn("metrics", report)
        self.assertIn("trading_simulation", report)
        
        metrics = report["metrics"]
        self.assertGreaterEqual(metrics["accuracy"], 0.0)
        self.assertLessEqual(metrics["accuracy"], 1.0)
        self.assertGreaterEqual(metrics["f1_score"], 0.0)
        self.assertLessEqual(metrics["f1_score"], 1.0)

if __name__ == "__main__":
    unittest.main()
