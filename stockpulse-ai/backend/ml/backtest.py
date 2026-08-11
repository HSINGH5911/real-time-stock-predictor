import os
import json
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.ensemble import RandomForestClassifier

BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "training_data.csv")

FEATURE_COLUMNS = [
    'Close', 'Volume', 'RSI_14', 'SMA_20', 'Price_SMA_Ratio',
    'MACD_Line', 'MACD_Signal', 'MACD_Hist', 'Volatility_20',
    'Sentiment_Avg', 'Positive_Ratio', 'Negative_Ratio', 'Article_Count',
    'earnings_flag', 'product_launch_flag', 'ceo_change_flag', 'merger_flag', 'dividend_flag'
]

def run_historical_backtest(
    dataset_path: str = DATASET_PATH,
    initial_capital: float = 10000.0,
    train_window_pct: float = 0.60
) -> Dict[str, Any]:
    """
    Executes rigorous time-series backtest with strictly zero data leakage:
    1. Loads dataset sequentially without random shuffling.
    2. Uses initial train_window_pct for training the model.
    3. Performs expanding window or sequential step out-of-sample predictions.
    4. Evaluates ML Classification Metrics (Accuracy, Precision, Recall, F1, Confusion Matrix).
    5. Simulates realistic Trading Performance:
       - Starting Capital: $10,000
       - Model Strategy: Long when Predict UP, Cash (0% return) when Predict DOWN
       - Buy & Hold Strategy: Always holding stock from start to end
       - Always UP Strategy: Always taking long position
    """
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Backtest dataset not found at {dataset_path}")

    df = pd.read_csv(dataset_path)

    # Ensure required target and price columns exist
    if 'Label' not in df.columns or 'Close' not in df.columns:
        raise ValueError("Dataset must contain 'Label' and 'Close' columns.")

    existing_features = [col for col in FEATURE_COLUMNS if col in df.columns]
    
    # Calculate period returns: Return_{t+1} = (Close_{t+1} - Close_t) / Close_t
    df['Next_Return'] = df['Close'].pct_change().shift(-1)
    df = df.dropna(subset=['Next_Return'] + existing_features + ['Label']).reset_index(drop=True)

    n = len(df)
    split_idx = int(n * train_window_pct)

    X = df[existing_features]
    y = df['Label'].astype(int)
    returns = df['Next_Return']

    # Initial training set
    X_train, y_train = X.iloc[:split_idx], y.iloc[:split_idx]
    X_test, y_test = X.iloc[split_idx:], y.iloc[split_idx:]
    returns_test = returns.iloc[split_idx:]

    print(f"[Backtest] Sequential Time-Series Evaluation | Total rows: {n} | Train: {len(X_train)} | Test: {len(X_test)}")

    # Train model strictly on historical training subset (no future data leakage)
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)

    # Predictions on unseen future test timeframe
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]

    # Metrics
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # --- Simulated Trading Backtest ---
    capital_model = initial_capital
    capital_buy_hold = initial_capital
    capital_always_up = initial_capital

    equity_curve_model = [initial_capital]
    equity_curve_buy_hold = [initial_capital]
    equity_curve_always_up = [initial_capital]

    trades_taken = 0
    winning_trades = 0

    for i, (pred, r_actual, y_true) in enumerate(zip(y_pred, returns_test, y_test)):
        # 1. Model Strategy: Long if Pred == 1 (UP), Cash if Pred == 0 (DOWN)
        if pred == 1:
            capital_model *= (1.0 + r_actual)
            trades_taken += 1
            if r_actual > 0:
                winning_trades += 1
        else:
            # Stay in cash -> 0% return
            capital_model *= 1.0

        # 2. Buy & Hold Strategy
        capital_buy_hold *= (1.0 + r_actual)

        # 3. Always UP Baseline
        capital_always_up *= (1.0 + r_actual)

        equity_curve_model.append(round(capital_model, 2))
        equity_curve_buy_hold.append(round(capital_buy_hold, 2))
        equity_curve_always_up.append(round(capital_always_up, 2))

    return_model_pct = round(((capital_model - initial_capital) / initial_capital) * 100, 2)
    return_buy_hold_pct = round(((capital_buy_hold - initial_capital) / initial_capital) * 100, 2)
    return_always_up_pct = round(((capital_always_up - initial_capital) / initial_capital) * 100, 2)
    outperformance = round(return_model_pct - return_buy_hold_pct, 2)

    win_rate = round((winning_trades / trades_taken * 100), 2) if trades_taken > 0 else 0.0

    report = {
        "status": "success",
        "initial_capital": initial_capital,
        "test_periods": len(X_test),
        "metrics": {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm
        },
        "trading_simulation": {
            "initial_capital": initial_capital,
            "final_capital_model": round(capital_model, 2),
            "model_return_pct": return_model_pct,
            "final_capital_buy_hold": round(capital_buy_hold, 2),
            "buy_hold_return_pct": return_buy_hold_pct,
            "always_up_return_pct": return_always_up_pct,
            "outperformance_pct": outperformance,
            "trades_taken": trades_taken,
            "winning_trades": winning_trades,
            "win_rate_pct": win_rate
        },
        "equity_curve_sample": equity_curve_model[::max(1, len(equity_curve_model)//15)]
    }

    return report

if __name__ == "__main__":
    res = run_historical_backtest()
    print("\n" + "="*50)
    print("HISTORICAL BACKTEST & SIMULATED TRADING RESULTS")
    print("="*50)
    print(f"Accuracy               : {res['metrics']['accuracy']*100:.2f}%")
    print(f"Precision              : {res['metrics']['precision']*100:.2f}%")
    print(f"Recall                 : {res['metrics']['recall']*100:.2f}%")
    print(f"F1-Score               : {res['metrics']['f1_score']*100:.2f}%")
    print("-" * 50)
    print(f"Starting Capital       : ${res['trading_simulation']['initial_capital']:,.2f}")
    print(f"Model Strategy Return  : {res['trading_simulation']['model_return_pct']:+.2f}% (${res['trading_simulation']['final_capital_model']:,.2f})")
    print(f"Buy & Hold Return      : {res['trading_simulation']['buy_hold_return_pct']:+.2f}% (${res['trading_simulation']['final_capital_buy_hold']:,.2f})")
    print(f"Outperformance         : {res['trading_simulation']['outperformance_pct']:+.2f}%")
    print(f"Trade Win Rate         : {res['trading_simulation']['win_rate_pct']:.2f}% ({res['trading_simulation']['winning_trades']}/{res['trading_simulation']['trades_taken']} trades)")
