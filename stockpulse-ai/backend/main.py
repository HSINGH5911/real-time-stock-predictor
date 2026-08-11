import sys
import os
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add backend root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.logging import logger
from api.routes.market import router as market_router
from api.routes.news import router as news_router
from api.routes.sentiment import router as sentiment_router
from api.routes.features import router as features_router
from api.routes.predict import router as predict_router
from api.routes.predictions import router as predictions_router

from database.client import redis_client
from services.prediction_service import load_prediction_model
from workers.market_worker import run_market_worker
from workers.news_worker import run_news_worker
from workers.sentiment_worker import run_sentiment_worker_once
from workers.prediction_worker import run_prediction_worker_once

import asyncio

def _init_workers():
    logger.info("[StockPulse AI] Initializing background pipeline workers...")
    try:
        run_market_worker()
        run_news_worker()
        run_sentiment_worker_once()
        run_prediction_worker_once()
        logger.info("[StockPulse AI] Workers executed successfully.")
    except Exception as e:
        logger.warning(f"[StockPulse AI] Worker initialization warning: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run initial pipeline workers in background thread so API starts immediately
    asyncio.create_task(asyncio.to_thread(_init_workers))
    yield
    logger.info("[StockPulse AI] Shutting down application backend.")

app = FastAPI(
    title="StockPulse AI Backend API",
    description="Real-Time Market Intelligence & NLP Sentiment Prediction Engine",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(market_router)
app.include_router(news_router)
app.include_router(sentiment_router)
app.include_router(features_router)
app.include_router(predict_router)
app.include_router(predictions_router)

@app.get("/")
def home():
    return {
        "status": "running",
        "service": "StockPulse AI Backend",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/health")
def health():
    """
    Day 7 Health Check Endpoint:
    Checks database connection status, ML model availability, and system parameters.
    """
    db_status = "disconnected"
    try:
        redis_client.set("health_check", "ok")
        val = redis_client.get("health_check")
        if val == "ok":
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    model_status = "unloaded"
    try:
        model, metadata = load_prediction_model("rf_v1")
        if model is not None:
            model_status = "loaded"
    except Exception as e:
        model_status = f"error: {str(e)}"

    is_healthy = db_status == "connected" and model_status == "loaded"

    return {
        "status": "healthy" if is_healthy else "degraded",
        "database": db_status,
        "model": model_status,
        "service": "StockPulse AI Backend",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
