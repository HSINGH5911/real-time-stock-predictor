import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional

EVENT_KEYWORDS = {
    "earnings_flag": ["earnings", "q1", "q2", "q3", "q4", "revenue beat", "eps", "quarterly results"],
    "product_launch_flag": ["launch", "announces new", "unveils", "iphone", "gpu", "chip", "product line"],
    "ceo_change_flag": ["ceo", "cfo", "resigns", "stepping down", "appoints", "chief executive"],
    "merger_flag": ["acquisition", "buyout", "merger", "acquires", "takeover"],
    "dividend_flag": ["dividend", "stock split", "share buyback", "repurchase"]
}


def calculate_rsi(series: pd.Series, window: int = 14) -> pd.Series:
    """Calculates Relative Strength Index (RSI - 14 period)."""

    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))

    return rsi.fillna(50.0)  # Neutral fallback for initial window


def calculate_sma(series: pd.Series, window: int = 20) -> pd.Series:
    """Calculates Simple Moving Average (SMA20)."""

    return series.rolling(window=window).mean().bfill()


def calculate_macd(series: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9) -> Dict[str, pd.Series]:
    """Calculates MACD Line, Signal Line, and MACD Histogram."""

    ema_fast = series.ewm(span=fast, adjust=False).mean()
    ema_slow = series.ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line

    return {
        "macd_line": macd_line,
        "signal_line": signal_line,
        "histogram": histogram
    }


def calculate_volatility(series: pd.Series, window: int = 20) -> pd.Series:
    """Calculates 20-day annualized historical price volatility."""

    returns = series.pct_change()
    volatility = returns.rolling(window=window).std() * np.sqrt(252) * 100

    return volatility.fillna(0.0)


def aggregate_news_features(articles: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Aggregates FinBERT sentiment scores across news articles into scalar features:
    Average Sentiment, Positive Ratio, Negative Ratio, Article Count.
    """

    if not articles:

        return {
            "sentiment_avg": 0.0,
            "positive_ratio": 0.0,
            "negative_ratio": 0.0,
            "article_count": 0
        }

    scores = []
    positive_count = 0
    negative_count = 0

    for item in articles:
        # Extract sentiment score (-1.0 to +1.0)
        score = item.get("sentiment_score") or item.get("sentiment", 0.0)

        if isinstance(score, (int, float)):
            scores.append(float(score))
            if score > 0.15:
                positive_count += 1
            elif score < -0.15:
                negative_count += 1

    total = len(articles)

    if total == 0 or len(scores) == 0:

        return {
            "sentiment_avg": 0.0,
            "positive_ratio": 0.0,
            "negative_ratio": 0.0,
            "article_count": 0
        }

    return {
        "sentiment_avg": round(float(np.mean(scores)), 4),
        "positive_ratio": round(positive_count / total, 4),
        "negative_ratio": round(negative_count / total, 4),
        "article_count": total
    }


def extract_event_flags(articles: List[Dict[str, Any]]) -> Dict[str, int]:
    """Scans article headlines and summaries to detect corporate events as binary flags (1 or 0)."""

    flags = {flag: 0 for flag in EVENT_KEYWORDS}
    
    for article in articles:
        text = (article.get("headline", "") + " " + article.get("summary", "")).lower()
        for flag_name, keywords in EVENT_KEYWORDS.items():

            if any(kw in text for kw in keywords):
                flags[flag_name] = 1

    return flags


def build_feature_dataframe(df_prices: pd.DataFrame, news_by_date: Optional[Dict[str, List[Dict[str, Any]]]] = None) -> pd.DataFrame:
    """
    Takes historical price DataFrame with columns: ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
    Computes all technical indicators, joins sentiment & event flags, cleans NaNs, and computes target labels.
    """
    df = df_prices.copy()

    if 'Close' not in df.columns:
        raise ValueError("DataFrame must contain 'Close' price column.")

    df['RSI_14'] = calculate_rsi(df['Close'], window=14)
    df['SMA_20'] = calculate_sma(df['Close'], window=20)
    df['Price_SMA_Ratio'] = (df['Close'] / df['SMA_20']).round(4)
    
    macd_dict = calculate_macd(df['Close'])
    df['MACD_Line'] = macd_dict['macd_line'].round(4)
    df['MACD_Signal'] = macd_dict['signal_line'].round(4)
    df['MACD_Hist'] = macd_dict['histogram'].round(4)
    
    df['Volatility_20'] = calculate_volatility(df['Close'], window=20).round(4)

    # Default News & Event Feature columns
    df['Sentiment_Avg'] = 0.0
    df['Positive_Ratio'] = 0.0
    df['Negative_Ratio'] = 0.0
    df['Article_Count'] = 0

    for flag_name in EVENT_KEYWORDS:
        df[flag_name] = 0

    # Populate news features if provided
    if news_by_date:
        for idx, row in df.iterrows():
            date_str = str(row.get('Date', ''))[:10]

            if date_str in news_by_date:
                articles = news_by_date[date_str]
                news_feats = aggregate_news_features(articles)
                event_feats = extract_event_flags(articles)

                df.at[idx, 'Sentiment_Avg'] = news_feats['sentiment_avg']
                df.at[idx, 'Positive_Ratio'] = news_feats['positive_ratio']
                df.at[idx, 'Negative_Ratio'] = news_feats['negative_ratio']
                df.at[idx, 'Article_Count'] = news_feats['article_count']
                for flag_name, val in event_feats.items():
                    df.at[idx, flag_name] = val

    # Clean NaNs
    df = df.ffill().bfill().fillna(0.0)

    # Compute Target Label for Supervised Learning: 1 if Next Day Close > Today Close else 0
    df['Next_Close'] = df['Close'].shift(-1)
    df['Price_Change_Pct'] = ((df['Next_Close'] - df['Close']) / df['Close'] * 100).round(4)
    df['Label'] = np.where(df['Next_Close'] > df['Close'], 1, 0)
    
    # Drop the final row because Next_Close is unknown
    df_cleaned = df.iloc[:-1].copy()

    return df_cleaned
