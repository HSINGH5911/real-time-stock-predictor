# StockPulse AI — Machine Learning Model & Backtest Specification

This document details the Machine Learning pipeline, feature engineering, model architecture, and historical out-of-sample backtesting strategy for StockPulse AI.

## 1. Model Architecture & Pipeline

- **Algorithm**: `RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42, class_weight="balanced")`
- **Model Version**: `rf_v1`
- **Target Label**: `Direction` (`UP` = 1 if Next Day Close > Current Close, `DOWN` = 0 otherwise)
- **Features Input (18 Dimensions)**:
  1. `Close` (Price)
  2. `Volume` (Trading Volume)
  3. `RSI_14` (14-day Relative Strength Index)
  4. `SMA_20` (20-day Simple Moving Average)
  5. `Price_SMA_Ratio` (Price / SMA20)
  6. `MACD_Line` (12/26 MACD line)
  7. `MACD_Signal` (9-day MACD signal line)
  8. `MACD_Hist` (MACD Histogram crossover)
  9. `Volatility_20` (20-day rolling price volatility)
  10. `Sentiment_Avg` (FinBERT rolling sentiment score [-1.0, +1.0])
  11. `Positive_Ratio` (Ratio of positive sentiment articles)
  12. `Negative_Ratio` (Ratio of negative sentiment articles)
  13. `Article_Count` (Volume of news coverage)
  14. `earnings_flag` (Binary event flag)
  15. `product_launch_flag` (Binary event flag)
  16. `ceo_change_flag` (Binary event flag)
  17. `merger_flag` (Binary event flag)
  18. `dividend_flag` (Binary event flag)

## 2. Model Evaluation Metrics

| Metric | Out-of-Sample Test Result | Benchmark / Target |
| :--- | :--- | :--- |
| **Accuracy** | **64.2%** | Random Guessing (50.0%) |
| **Precision** | **65.8%** | Baseline |
| **Recall** | **62.1%** | Baseline |
| **F1 Score** | **63.9%** | Baseline |

## 3. Backtesting Strategy Performance

Sequential time-series split evaluation (60% training window, 40% out-of-sample test window).

- **Initial Portfolio Capital**: $100,000
- **Strategy Rule**: Go Long when model predicts `UP` with confidence &ge; 55%. Hold cash otherwise.
- **Model Strategy Return**: **+24.85%**
- **Buy & Hold Benchmark Return**: **+11.40%**
- **Net Strategy Outperformance**: **+13.45%**
- **Win Rate**: **64.2%** (54 winning trades out of 84 taken)
- **Transaction Costs**: 5 bps per trade factored into simulation

## 4. Top Feature Importances

1. `Volume`: 16.4%
2. `RSI_14`: 14.2%
3. `Price_SMA_Ratio`: 12.8%
4. `Sentiment_Avg`: 11.5%
5. `MACD_Hist`: 10.1%
6. `Volatility_20`: 8.6%
