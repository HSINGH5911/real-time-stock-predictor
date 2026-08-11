import React from 'react';
import SignalBadge from '../signals/SignalBadge';
import { PredictionData } from '../../types';

interface ModelAnalysisProps {
  prediction?: PredictionData | null;
}

const DEFAULT_CONTRIBUTORS = [
  { name: 'Sentiment', pct: 31, color: '#10B981' },
  { name: 'Volume', pct: 24, color: '#38BDF8' },
  { name: 'RSI', pct: 18, color: '#3B82F6' },
  { name: 'MACD', pct: 14, color: '#38BDF8' },
  { name: 'Volatility', pct: 9, color: '#8B95A5' },
  { name: 'News Volume', pct: 4, color: '#4E5766' },
];

const ModelAnalysis: React.FC<ModelAnalysisProps> = ({ prediction }) => {
  const signal = prediction?.prediction || 'BULLISH';
  const probability = prediction?.confidence ? (prediction.confidence * 100).toFixed(1) : '84.2';

  return (
    <div
      style={{
        backgroundColor: '#11161D',
        border: '1px solid #202630',
        borderRadius: '4px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {/* Title */}
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
        MODEL ANALYSIS
      </div>

      {/* Overview stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#8B95A5' }}>Signal</span>
          <SignalBadge signal={signal} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#8B95A5' }}>Probability</span>
          <span style={{ fontWeight: 700, color: '#E6EAF0' }}>{probability}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#8B95A5' }}>Predicted Horizon</span>
          <span style={{ color: '#E6EAF0' }}>Next Trading Session</span>
        </div>
      </div>

      {/* Signal Contributors Bar breakdown */}
      <div style={{ borderTop: '1px solid #202630', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#8B95A5',
            textTransform: 'uppercase',
            fontFamily: 'Geist, Inter, sans-serif',
          }}
        >
          SIGNAL CONTRIBUTORS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          {DEFAULT_CONTRIBUTORS.map((c) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '90px', color: '#8B95A5', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.name}
              </span>
              <div style={{ flex: 1, backgroundColor: '#0D1117', height: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '2px',
                    width: `${c.pct}%`,
                    backgroundColor: c.color,
                  }}
                />
              </div>
              <span style={{ width: '36px', textAlign: 'right', fontWeight: 700, color: '#E6EAF0', fontSize: '11px' }}>
                {c.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelAnalysis;
