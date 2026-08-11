import React from 'react';

interface TechnicalSignalsProps {
  rsi?: number;
  macd?: number;
  volume?: string;
  volatility?: number;
}

const TechnicalSignals: React.FC<TechnicalSignalsProps> = ({
  rsi = 63.4,
  macd = 1.42,
  volume = '42.1M',
  volatility = 2.14,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#11161D',
        border: '1px solid #202630',
        borderRadius: '4px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#8B95A5',
          textTransform: 'uppercase',
          fontFamily: 'Geist, Inter, sans-serif',
          borderBottom: '1px solid #202630',
          paddingBottom: '8px',
        }}
      >
        TECHNICAL SIGNALS
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
        {/* RSI */}
        <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 600 }}>RSI (14)</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#E6EAF0' }}>{rsi}</div>
          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Moderately Bullish</div>
        </div>

        {/* MACD */}
        <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 600 }}>MACD</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#E6EAF0' }}>+{macd}</div>
          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Bullish Divergence</div>
        </div>

        {/* VOLUME */}
        <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 600 }}>VOLUME</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#E6EAF0' }}>{volume}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 600 }}>Above Average</div>
        </div>

        {/* VOLATILITY */}
        <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 600 }}>VOLATILITY (10D)</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#E6EAF0' }}>{volatility}%</div>
          <div style={{ fontSize: '11px', color: '#8B95A5', fontWeight: 600 }}>Moderate</div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSignals;
