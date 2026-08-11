# StockPulse AI — System Architecture & Data Flow

StockPulse AI is an end-to-end real-time financial market intelligence platform. It combines real-time data ingestion, NLP sentiment analysis, technical indicator extraction, Random Forest machine learning models, and an interactive React dashboard.

## System Architecture Diagram

```
                         ┌──────────────┐
                         │  News APIs   │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │ News Worker  │
                         └──────┬───────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Custom Redis  │
                       │   In-Memory DB  │
                       │                 │
                       │ Streams         │
                       │ Hashes          │
                       │ Lists           │
                       │ Sorted Sets     │
                       └────────┬────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
                 ▼                             ▼
         Sentiment Worker              Market Worker
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                       Feature Engineering
                                │
                                ▼
                       Random Forest / ML
                                │
                     ┌──────────┴──────────┐
                     │                     │
                     ▼                     ▼
                Predictions          Backtesting
                     │
                     ▼
             FastAPI REST Backend
                     │
                     ▼
              React Dashboard
```

## Data Ingestion & Storage Architecture

1. **Custom Redis Database Engine**: Built in Python supporting key-value storage, RESP protocol parsing, RDB persistence, Hashes (`HSET`/`HGETALL`), Lists (`LPUSH`/`LRANGE`), and Streams (`XADD`/`XRANGE`).
2. **News Pipeline**: `news_worker.py` fetches live headlines from MarketAux API and appends raw events to Redis Stream `news_stream`.
3. **Sentiment Pipeline**: `sentiment_worker.py` consumes stream events, evaluates sentiment with ProsusAI FinBERT transformer, calculates rolling sentiment averages per ticker, and saves to Redis hash `stock:{TICKER}`.
4. **Market Pipeline**: `market_worker.py` fetches real-time quotes (price, open, high, low, close, volume) and updates Redis hashes.
5. **Feature Engine**: Combines market quotes, technical indicators (RSI 14, MACD, Volatility 20, SMA 20 ratio), NLP sentiment aggregates, and financial event flags into 18-dimensional feature vectors.
6. **ML Inference & Backtest**: Random Forest Classifier outputs movement predictions (`UP`/`DOWN`), confidence %, probability breakdown (`probability_up`, `probability_down`), and top signal explanations.
7. **FastAPI & React**: Clean REST endpoints query custom Redis cache; React TypeScript frontend renders interactive charts, sentiment gauges, news feeds, prediction cards, and watchlist.
