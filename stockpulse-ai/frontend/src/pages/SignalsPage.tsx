import React, { useState, useEffect } from 'react';
import SignalMonitor from '../components/market/SignalMonitor';
import { getMarket } from '../services/api';
import { StockQuote } from '../types';
import { Filter, Search } from 'lucide-react';

const SignalsPage: React.FC = () => {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [filterSignal, setFilterSignal] = useState<'ALL' | 'BULLISH' | 'BEARISH' | 'NEUTRAL'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getMarket().then((s) => setStocks(s));
  }, []);

  const filtered = stocks.filter((s) => {
    const matchesSearch = s.ticker.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px', width: '100%' }}>
      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#11161D',
          border: '1px solid #202630',
          borderRadius: '4px',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
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
            MARKETS & SIGNAL RADAR
          </h2>
          <p
            style={{
              fontSize: '11px',
              color: '#4E5766',
              fontFamily: 'JetBrains Mono, monospace',
              marginTop: '4px',
              marginBottom: 0,
            }}
          >
            Real-Time NLP & Quantitative Machine Learning Signal Workspace
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search style={{ width: '14px', height: '14px', color: '#8B95A5', position: 'absolute', left: '10px' }} />
            <input
              type="text"
              placeholder="Filter symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: '32px',
                paddingRight: '12px',
                paddingTop: '6px',
                paddingBottom: '6px',
                backgroundColor: '#0D1117',
                border: '1px solid #202630',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#E6EAF0',
                outline: 'none',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#0D1117',
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid #202630',
              fontSize: '11px',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <Filter style={{ width: '12px', height: '12px', color: '#8B95A5', marginLeft: '4px', marginRight: '4px' }} />
            {(['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL'] as const).map((sig) => (
              <button
                key={sig}
                onClick={() => setFilterSignal(sig)}
                style={{
                  padding: '2px 8px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: filterSignal === sig ? '#2563EB' : 'transparent',
                  color: filterSignal === sig ? '#FFFFFF' : '#8B95A5',
                  fontWeight: filterSignal === sig ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                {sig}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SignalMonitor stocks={filtered} />
    </div>
  );
};

export default SignalsPage;
