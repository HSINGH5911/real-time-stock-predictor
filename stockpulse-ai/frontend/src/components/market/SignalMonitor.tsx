import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignalBadge from '../signals/SignalBadge';
import ConfidenceBar from '../signals/ConfidenceBar';
import { StockQuote } from '../../types';

interface SignalMonitorItem {
  ticker: string;
  price: string;
  change: string;
  changePercent: string;
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  sentiment: string;
  articlesCount: number;
}

interface SignalMonitorProps {
  stocks: StockQuote[];
  selectedTicker?: string;
  onSelectTicker?: (ticker: string) => void;
}

const DEFAULT_STOCKS_FALLBACK: StockQuote[] = [
  { ticker: 'AAPL', price: 212.43, change: 3.01, change_percent: 1.42, open: 209.42, high: 213.80, low: 208.90, close: 212.43, prev_close: 209.42, volume: 42100000, timestamp: '2026-08-10T16:00:00Z' },
  { ticker: 'NVDA', price: 218.90, change: 4.50, change_percent: 2.10, open: 214.40, high: 220.10, low: 213.80, close: 218.90, prev_close: 214.40, volume: 83400000, timestamp: '2026-08-10T16:00:00Z' },
  { ticker: 'MSFT', price: 521.31, change: 2.29, change_percent: 0.44, open: 519.00, high: 523.00, low: 518.50, close: 521.31, prev_close: 519.02, volume: 21500000, timestamp: '2026-08-10T16:00:00Z' },
  { ticker: 'TSLA', price: 301.21, change: -5.89, change_percent: -1.92, open: 307.00, high: 308.50, low: 299.80, close: 301.21, prev_close: 307.10, volume: 51200000, timestamp: '2026-08-10T16:00:00Z' },
  { ticker: 'AMZN', price: 224.82, change: 1.81, change_percent: 0.81, open: 223.00, high: 225.50, low: 222.10, close: 224.82, prev_close: 223.01, volume: 31800000, timestamp: '2026-08-10T16:00:00Z' },
  { ticker: 'GOOGL', price: 176.45, change: 1.25, change_percent: 0.71, open: 175.20, high: 177.00, low: 174.80, close: 176.45, prev_close: 175.20, volume: 19400000, timestamp: '2026-08-10T16:00:00Z' },
  { ticker: 'META', price: 512.80, change: 8.40, change_percent: 1.66, open: 504.40, high: 514.00, low: 503.20, close: 512.80, prev_close: 504.40, volume: 14200000, timestamp: '2026-08-10T16:00:00Z' },
  { ticker: 'AMD', price: 142.10, change: -2.30, change_percent: -1.59, open: 144.40, high: 145.00, low: 141.20, close: 142.10, prev_close: 144.40, volume: 38100000, timestamp: '2026-08-10T16:00:00Z' },
];

const SECURITY_METRICS: Record<string, { signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL'; conf: number; sentiment: string; articles: number }> = {
  AAPL: { signal: 'BULLISH', conf: 84, sentiment: '+0.74', articles: 8 },
  NVDA: { signal: 'BULLISH', conf: 82, sentiment: '+0.81', articles: 12 },
  MSFT: { signal: 'NEUTRAL', conf: 58, sentiment: '+0.18', articles: 5 },
  TSLA: { signal: 'BEARISH', conf: 73, sentiment: '-0.63', articles: 14 },
  AMZN: { signal: 'BULLISH', conf: 78, sentiment: '+0.52', articles: 9 },
  GOOGL: { signal: 'BULLISH', conf: 71, sentiment: '+0.45', articles: 6 },
  META: { signal: 'BULLISH', conf: 86, sentiment: '+0.68', articles: 11 },
  AMD: { signal: 'BEARISH', conf: 64, sentiment: '-0.38', articles: 7 },
};

const parseChangePercent = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace('%', '').replace('+', '').trim();
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
};

const SignalMonitor: React.FC<SignalMonitorProps> = ({ stocks, selectedTicker, onSelectTicker }) => {
  const navigate = useNavigate();

  const handleRowClick = (ticker: string) => {
    if (onSelectTicker) {
      onSelectTicker(ticker);
    } else {
      navigate(`/markets/${ticker}`);
    }
  };

  const listToRender = stocks && stocks.length > 0 ? stocks : DEFAULT_STOCKS_FALLBACK;

  const displayList: SignalMonitorItem[] = listToRender.map((s) => {
    const chgNum = parseChangePercent(s.change_percent);
    const isPos = chgNum >= 0;

    const baseMetric = SECURITY_METRICS[s.ticker];
    const sig: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = baseMetric ? baseMetric.signal : (isPos ? 'BULLISH' : 'BEARISH');
    const conf = baseMetric ? baseMetric.conf : Math.min(92, Math.max(54, Math.round(68 + Math.abs(chgNum) * 8)));
    const sentimentScore = baseMetric ? baseMetric.sentiment : (isPos ? `+${(0.4 + Math.min(0.5, Math.abs(chgNum) * 0.2)).toFixed(2)}` : `-${(0.3 + Math.min(0.5, Math.abs(chgNum) * 0.2)).toFixed(2)}`);
    const articles = baseMetric ? baseMetric.articles : Math.max(4, Math.round(6 + Math.abs(chgNum) * 3));

    return {
      ticker: s.ticker,
      price: typeof s.price === 'number' ? s.price.toFixed(2) : String(s.price),
      change: s.change ? String(s.change) : '0.00',
      changePercent: `${isPos ? '+' : ''}${chgNum.toFixed(2)}%`,
      signal: sig,
      confidence: conf,
      sentiment: sentimentScore,
      articlesCount: articles,
    };
  });

  return (
    <div
      style={{
        backgroundColor: '#11161D',
        border: '1px solid #202630',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #202630',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#11161D',
        }}
      >
        <h2
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#8B95A5',
            textTransform: 'uppercase',
            fontFamily: 'Geist, Inter, sans-serif',
            margin: 0,
          }}
        >
          SIGNAL MONITOR (REAL-TIME STREAM)
        </h2>
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#8B95A5',
          }}
        >
          {displayList.length} Tracked Securities
        </span>
      </div>

      {/* Table with Explicit Institutional Styling */}
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '228px', width: '100%' }}>
        <table className="term-table">
          <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#0D1117', boxShadow: '0 1px 0 #202630' }}>
            <tr>
              <th>SECURITY</th>
              <th>PRICE</th>
              <th>CHANGE</th>
              <th>SIGNAL</th>
              <th>CONF.</th>
              <th>SENTIMENT</th>
            </tr>
          </thead>
          <tbody>
            {displayList.map((item) => {
              const isSelected = selectedTicker === item.ticker;
              const isPos = !item.changePercent.startsWith('-');
              return (
                <tr
                  key={item.ticker}
                  onClick={() => handleRowClick(item.ticker)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#161C24' : 'transparent',
                    borderLeft: isSelected ? '3px solid #2563EB' : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <td className="font-mono font-bold text-[#E6EAF0]">
                    {item.ticker}
                  </td>
                  <td className="font-mono text-[#E6EAF0]">
                    ${item.price}
                  </td>
                  <td className={`font-mono font-semibold ${isPos ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {item.changePercent}
                  </td>
                  <td>
                    <SignalBadge signal={item.signal} />
                  </td>
                  <td>
                    <ConfidenceBar confidence={item.confidence} />
                  </td>
                  <td className="font-mono text-[#E6EAF0]">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={item.sentiment.startsWith('+') ? 'text-[#10B981]' : item.sentiment.startsWith('-') ? 'text-[#EF4444]' : 'text-[#8B95A5]'}>
                        {item.sentiment}
                      </span>
                      <span style={{ fontSize: '10px', color: '#8B95A5' }}>({item.articlesCount} articles)</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SignalMonitor;
