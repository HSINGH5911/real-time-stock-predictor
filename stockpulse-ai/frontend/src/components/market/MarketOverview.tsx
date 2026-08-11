import React from 'react';
import { StockQuote } from '../../types';

export interface MarketIndex {
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const DEFAULT_INDICES: MarketIndex[] = [
  { symbol: 'SPX', name: 'S&P 500', value: '5,982.21', change: '+0.82%', isPositive: true },
  { symbol: 'NDX', name: 'NASDAQ', value: '19,842.12', change: '+1.14%', isPositive: true },
  { symbol: 'DJI', name: 'DOW JONES', value: '44,102.31', change: '+0.31%', isPositive: true },
  { symbol: 'VIX', name: 'VIX', value: '14.82', change: '-4.21%', isPositive: false },
];

interface MarketOverviewProps {
  indices?: MarketIndex[];
  stocks?: StockQuote[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ indices, stocks }) => {
  const displayIndices: MarketIndex[] = React.useMemo(() => {
    if (indices && indices.length > 0) return indices;

    if (stocks && stocks.length > 0) {
      const avgChange = stocks.reduce((acc, s) => acc + Number(s.change_percent || 0), 0) / stocks.length;
      const isPos = avgChange >= 0;
      const changeStr = `${isPos ? '+' : ''}${avgChange.toFixed(2)}%`;

      return [
        { symbol: 'SPX', name: 'S&P 500', value: '5,982.21', change: changeStr, isPositive: isPos },
        { symbol: 'NDX', name: 'NASDAQ', value: '19,842.12', change: `+${(avgChange * 1.2).toFixed(2)}%`, isPositive: true },
        { symbol: 'DJI', name: 'DOW JONES', value: '44,102.31', change: `+${(avgChange * 0.6).toFixed(2)}%`, isPositive: true },
        { symbol: 'VIX', name: 'VIX', value: '14.82', change: '-4.21%', isPositive: false },
      ];
    }

    return DEFAULT_INDICES;
  }, [indices, stocks]);

  return (
    <div style={{ width: '100%' }}>
      {/* Title Header with MARKET OVERVIEW and Benchmark Indices on separate lines with spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#8B95A5',
            textTransform: 'uppercase',
            fontFamily: 'Geist, Inter, sans-serif',
          }}
        >
          MARKET OVERVIEW
        </span>
        <span
          style={{
            fontSize: '10px',
            color: '#4E5766',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          Benchmark Indices
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {displayIndices.map((idx) => {
          const colorClass = idx.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]';
          return (
            <div
              key={idx.symbol}
              className="p-2.5 bg-[#0D1117] border border-[#202630] rounded flex flex-col justify-between hover:border-[#3B82F6]/40 transition-colors"
              style={{
                padding: '10px 12px',
                backgroundColor: '#0D1117',
                border: '1px solid #202630',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#8B95A5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'Geist, Inter, sans-serif',
                }}
              >
                {idx.name}
              </div>
              <div
                style={{
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '8px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#E6EAF0' }}>{idx.value}</span>
                <span className={colorClass} style={{ fontSize: '12px', fontWeight: 600 }}>
                  {idx.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketOverview;
