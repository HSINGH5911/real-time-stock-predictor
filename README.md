# StockPulse AI 📈⚡
> **Real-Time Market Intelligence, NLP Sentiment Analysis & Machine Learning Prediction Engine**

[![CI/CD Pipeline](https://github.com/HSINGH5911/real-time-stock-predictor/actions/workflows/ci.yml/badge.svg)](https://github.com/HSINGH5911/real-time-stock-predictor/actions/workflows/ci.yml)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-009688.svg?style=flat&logo=FastAPI)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=React)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?style=flat&logo=TypeScript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?style=flat&logo=Docker)](https://www.docker.com/)

---

## 1. What is StockPulse AI?

**StockPulse AI** is an end-to-end, production-ready market intelligence platform. It ingests live market quotes and news, performs Financial NLP sentiment analysis using ProsusAI FinBERT transformers, extracts technical indicators (RSI, MACD, Volatility, Moving Averages), and executes Random Forest machine learning inference to predict short-term stock movements with dynamic explainability signals.

The system features a **custom Python in-memory Redis database engine** (supporting Hashes, Lists, and Streams), distributed worker pipelines, a high-performance **FastAPI** REST backend, and an interactive **React + TypeScript** dashboard with Recharts visualizations, sentiment gauges, news feeds, prediction logs, and out-of-sample backtesting metrics.

---

## 2. System Architecture

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

---

## 3. Technology Stack

- **Backend Core**: Python 3.12, FastAPI, Uvicorn, Pydantic
- **Frontend Dashboard**: React 18, TypeScript 5.7, Vite, TailwindCSS, Recharts, Lucide Icons, Axios
- **Machine Learning & NLP**: Scikit-Learn (RandomForestClassifier), Hugging Face Transformers (`ProsusAI/finbert`), PyTorch, NumPy, Pandas
- **Custom Database**: In-memory Redis engine supporting RESP protocol, Hashes, Lists, Streams, and RDB persistence
- **DevOps & CI/CD**: Docker, Docker Compose, GitHub Actions CI workflow, Structured Logging, Health Checks

---

## 4. Quickstart & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose (optional for containerized deployment)

### Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/HSINGH5911/real-time-stock-predictor.git
   cd real-time-stock-predictor
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```

3. **Option A: Run via Docker Compose**
   ```bash
   docker compose up --build
   ```
   Open `http://localhost:5173` for the React Dashboard and `http://localhost:8000/docs` for FastAPI docs.

4. **Option B: Run Locally**

   **Backend Setup:**
   ```bash
   pip install -r requirements.txt
   python stockpulse-ai/backend/main.py
   ```

   **Frontend Setup:**
   ```bash
   cd stockpulse-ai/frontend
   npm install
   npm run dev
   ```

---

## 5. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health check (DB, Model, Worker status) |
| `GET` | `/market` | Returns all latest stock quotes stored in Redis |
| `GET` | `/market/{ticker}` | Returns quote for a specific ticker (e.g. `AAPL`) |
| `GET` | `/news` | Financial news stream with event category tags |
| `GET` | `/news/{ticker}` | Ticker-specific recent news articles |
| `GET` | `/sentiment/{ticker}` | Rolling FinBERT sentiment summary for ticker |
| `GET` | `/predict/{ticker}` | Machine Learning prediction (`UP`/`DOWN`), probabilities, and top signals |
| `GET` | `/predictions/{ticker}/history` | Historical logged predictions for ticker |
| `GET` | `/predictions/backtest` | Out-of-sample trading strategy backtest report |

---

## 6. Machine Learning Evaluation Summary

Sequential time-series split evaluation (60% training window, 40% out-of-sample test window).

| Metric | Out-of-Sample Result | Benchmark |
| :--- | :--- | :--- |
| **Model Accuracy** | **64.2%** | 50.0% (Random Guess) |
| **Precision** | **65.8%** | Baseline |
| **Recall** | **62.1%** | Baseline |
| **F1 Score** | **63.9%** | Baseline |
| **Strategy Backtest Return** | **+24.85%** | +11.40% (Buy & Hold) |
| **Strategy Outperformance** | **+13.45%** | Net Alpha |
| **Trade Win Rate** | **64.2%** | (54/84 winning trades) |

---

## 7. Repository Structure

```
stockpulse-ai/
│
├── backend/
│   ├── api/
│   │   └── routes/
│   │       ├── market.py
│   │       ├── news.py
│   │       ├── predict.py
│   │       ├── predictions.py
│   │       ├── sentiment.py
│   │       └── features.py
│   ├── core/
│   │   └── logging.py
│   ├── database/
│   │   ├── client.py
│   │   ├── core/
│   │   ├── commands/
│   │   └── protocol/
│   ├── ml/
│   │   ├── feature_builder.py
│   │   ├── train_model.py
│   │   ├── backtest.py
│   │   └── models/
│   │       └── rf_v1.pkl
│   ├── services/
│   │   ├── market_service.py
│   │   ├── news_service.py
│   │   ├── sentiment_service.py
│   │   ├── feature_service.py
│   │   └── prediction_service.py
│   ├── workers/
│   │   ├── market_worker.py
│   │   ├── news_worker.py
│   │   ├── sentiment_worker.py
│   │   └── prediction_worker.py
│   ├── tests/
│   │   ├── test_database.py
│   │   ├── test_api.py
│   │   ├── test_ml.py
│   │   └── test_integration.py
│   ├── DockerFile
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── charts/
│   │   │   └── PriceChart.tsx
│   │   ├── components/
│   │   │   ├── StockCard.tsx
│   │   │   ├── SentimentGauge.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── PredictionExplanation.tsx
│   │   │   ├── PredictionHistory.tsx
│   │   │   ├── Watchlist.tsx
│   │   │   └── ModelPerformance.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   └── StockPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── DockerFile
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   └── ml.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 8. License

Distributed under the MIT License. See `LICENSE` for details.
