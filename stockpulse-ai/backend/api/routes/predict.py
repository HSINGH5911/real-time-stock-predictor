from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from services.feature_service import get_cached_or_live_features
from services.prediction_service import (
    predict_stock_movement,
    get_prediction_history_from_redis,
    load_prediction_model
)
from ml.backtest import run_historical_backtest

try:
    from database.client import RedisClient
except ImportError:
    RedisClient = None

router = APIRouter(prefix="", tags=["predict"])

@router.get("/predict/{ticker}")
def get_prediction(ticker: str, version: Optional[str] = "rf_v1"):
    """
    GET /predict/{ticker}
    Returns current prediction, confidence, probability breakdown, model versioning, and top explainability signals.
    """
    ticker = ticker.upper()
    try:
        # Compute/fetch live prediction object via PredictionService
        feats = get_cached_or_live_features(ticker)
        res = predict_stock_movement(feats, version=version)
        return {
            "status": "success",
            "data": res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating prediction for {ticker}: {str(e)}")

@router.get("/predictions/{ticker}/history")
def get_prediction_history(ticker: str, limit: int = Query(20, ge=1, le=100)):
    """
    GET /predictions/{ticker}/history
    Returns historical predictions recorded for a given ticker.
    """
    ticker = ticker.upper()
    try:
        history = get_prediction_history_from_redis(ticker, limit=limit)
        return {
            "status": "success",
            "ticker": ticker,
            "count": len(history),
            "data": history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching prediction history for {ticker}: {str(e)}")

@router.get("/predictions/backtest")
def get_backtest_report():
    """
    GET /predictions/backtest
    Executes historical out-of-sample backtesting and simulated trading strategy performance.
    """
    try:
        report = run_historical_backtest()
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running backtest engine: {str(e)}")

