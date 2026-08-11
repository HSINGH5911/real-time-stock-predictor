import os
import pandas as pd
import numpy as np

try:
    import yfinance as yf
except ImportError:
    yf = None

try:
    from .feature_builder import build_feature_dataframe
except ImportError:
    from feature_builder import build_feature_dataframe

try:
    from services.market_service import DEFAULT_TICKERS
except ImportError:
    DEFAULT_TICKERS = [
        "AAPL", "NVDA", "MSFT", "GOOGL", "AMZN",
        "META", "TSLA", "BRK-B", "AVGO", "LLY",
        "WMT", "JPM", "V", "UNH", "XOM",
        "ORCL", "MA", "COST", "HD", "PG"
    ]
DATASET_PATH = os.path.join(os.path.dirname(__file__), "training_data.csv")

def generate_historical_dataset(tickers: list = None, period: str = "6mo") -> pd.DataFrame:
    """
    Downloads historical daily prices using yfinance for each ticker,
    runs the Feature Builder to compute RSI, MACD, SMA, Volatility, Labels,
    combines all ticker datasets, and exports to training_data.csv.
    """
    if tickers is None:
        tickers = DEFAULT_TICKERS

    all_features = []

    for ticker in tickers:
        print(f"[DatasetGenerator] Processing ticker: {ticker}...")

        try:
            if yf is not None:
                stock_data = yf.Ticker(ticker)
                hist = stock_data.history(period=period)

                if hist.empty:
                    print(f"[DatasetGenerator] Warning: No historical data returned for {ticker}")
                    continue
                hist = hist.reset_index()
                hist['Ticker'] = ticker

            else:
                # Fallback synthetic price history for testing environments
                print(f"[DatasetGenerator] yfinance unavailable. Generating synthetic market data for {ticker}...")
                dates = pd.date_range(end=pd.Timestamp.now(), periods=120, freq='B')
                np.random.seed(42 + hash(ticker) % 1000)
                base_price = 150.0 + np.random.randn() * 50
                returns = np.random.normal(0.0005, 0.02, size=len(dates))
                price_path = base_price * np.exp(np.cumsum(returns))
                
                hist = pd.DataFrame({
                    'Date': dates,
                    'Open': price_path * 0.995,
                    'High': price_path * 1.01,
                    'Low': price_path * 0.985,
                    'Close': price_path,
                    'Volume': np.random.randint(10000000, 50000000, size=len(dates)),
                    'Ticker': ticker
                })

            # Run Feature Builder
            df_featured = build_feature_dataframe(hist)
            df_featured['Ticker'] = ticker
            all_features.append(df_featured)

        except Exception as e:
            print(f"[DatasetGenerator] Error generating dataset for {ticker}: {e}")

    if not all_features:
        print("[DatasetGenerator] Error: No features were generated.")
        return pd.DataFrame()

    full_dataset = pd.concat(all_features, ignore_index=True)

    # Reorder columns cleanly
    feature_cols = [
        'Ticker', 'Date', 'Close', 'Volume', 'RSI_14', 'SMA_20', 'Price_SMA_Ratio',
        'MACD_Line', 'MACD_Signal', 'MACD_Hist', 'Volatility_20',
        'Sentiment_Avg', 'Positive_Ratio', 'Negative_Ratio', 'Article_Count',
        'earnings_flag', 'product_launch_flag', 'ceo_change_flag', 'merger_flag', 'dividend_flag',
        'Price_Change_Pct', 'Label'
    ]
    
    # 1. Deduplicate by Ticker & Date
    full_dataset = full_dataset.drop_duplicates(subset=['Ticker', 'Date']).copy()

    # 2. Outlier Sanity Checks: Enforce RSI boundary [0, 100]
    if 'RSI_14' in full_dataset.columns:
        full_dataset['RSI_14'] = full_dataset['RSI_14'].clip(0.0, 100.0)

    # 3. Handle NaNs with forward/backward fill + fallback zero
    full_dataset = full_dataset.ffill().bfill().fillna(0.0)

    # 4. Strict Type Casting
    float_cols = ['Close', 'RSI_14', 'SMA_20', 'Price_SMA_Ratio', 'MACD_Line', 'MACD_Signal', 'MACD_Hist', 'Volatility_20', 'Sentiment_Avg', 'Positive_Ratio', 'Negative_Ratio', 'Price_Change_Pct']
    int_cols = ['Volume', 'Article_Count', 'earnings_flag', 'product_launch_flag', 'ceo_change_flag', 'merger_flag', 'dividend_flag', 'Label']
    for c in float_cols:
        if c in full_dataset.columns:
            full_dataset[c] = full_dataset[c].astype(float).round(4)
    for c in int_cols:
        if c in full_dataset.columns:
            full_dataset[c] = full_dataset[c].astype(int)

    # Save to CSV
    full_dataset.to_csv(DATASET_PATH, index=False)
    print(f"[DatasetGenerator] Successfully generated & validated dataset with {len(full_dataset)} rows saved to: {DATASET_PATH}")
    
    return full_dataset

if __name__ == "__main__":
    generate_historical_dataset()
