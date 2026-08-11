export interface StockQuote {
  ticker: string;
  price: string | number;
  open: string | number;
  high: string | number;
  low: string | number;
  close: string | number;
  prev_close: string | number;
  change: string | number;
  change_percent: string | number;
  volume: string | number;
  timestamp: string;
}

export interface NewsArticle {
  ticker: string;
  headline: string;
  summary: string;
  source: string;
  timestamp: string;
  url: string;
}

export interface ExplainabilitySignal {
  feature: string;
  signal: string;
  type: 'bullish' | 'bearish' | 'neutral';
  importance: number;
}

export interface PredictionData {
  ticker: string;
  prediction: 'UP' | 'DOWN';
  confidence: number;
  probability_up: number;
  probability_down: number;
  model: string;
  model_version: string;
  timestamp: string;
  feature_importances?: Record<string, number>;
  top_signals?: ExplainabilitySignal[];
}

export interface PredictionHistoryItem {
  prediction: 'UP' | 'DOWN';
  confidence: number;
  probability_up: number;
  probability_down: number;
  model_version: string;
  timestamp: string;
}

export interface BacktestReport {
  status: string;
  initial_capital: number;
  test_periods: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confusion_matrix: number[][];
  };
  trading_simulation: {
    initial_capital: number;
    final_capital_model: number;
    model_return_pct: number;
    final_capital_buy_hold: number;
    buy_hold_return_pct: number;
    always_up_return_pct: number;
    outperformance_pct: number;
    trades_taken: number;
    winning_trades: number;
    win_rate_pct: number;
  };
  equity_curve_sample: number[];
}

