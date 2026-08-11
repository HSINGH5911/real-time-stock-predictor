import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const BACKTEST_CURVE = [
  { date: 'Jan 25', strategy: 10000, benchmark: 10000 },
  { date: 'Mar 25', strategy: 10320, benchmark: 10150 },
  { date: 'May 25', strategy: 10580, benchmark: 10300 },
  { date: 'Jul 25', strategy: 10840, benchmark: 10450 },
  { date: 'Sep 25', strategy: 10790, benchmark: 10380 },
  { date: 'Nov 25', strategy: 11150, benchmark: 10620 },
  { date: 'Jan 26', strategy: 11380, benchmark: 10800 },
  { date: 'Mar 26', strategy: 11290, benchmark: 10720 },
  { date: 'May 26', strategy: 11620, benchmark: 10980 },
  { date: 'Jul 26', strategy: 11750, benchmark: 11120 },
  { date: 'Aug 26', strategy: 11842, benchmark: 11231 },
];

const BacktestsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px', width: '100%' }}>
      {/* Header parameters */}
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
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <div>
          <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', margin: 0 }}>
            QUANTITATIVE RESEARCH BACKTEST
          </h2>
          <p style={{ fontSize: '11px', color: '#4E5766', marginTop: '4px', marginBottom: 0 }}>
            Out-of-Sample Historical Simulation & Performance Evaluation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#8B95A5', display: 'block', fontSize: '10px' }}>STRATEGY</span>
            <span style={{ color: '#E6EAF0', fontWeight: 700 }}>MarketPulse RF v1.2</span>
          </div>
          <div>
            <span style={{ color: '#8B95A5', display: 'block', fontSize: '10px' }}>PERIOD</span>
            <span style={{ color: '#E6EAF0', fontWeight: 700 }}>Jan 2025 — Aug 2026</span>
          </div>
          <div>
            <span style={{ color: '#8B95A5', display: 'block', fontSize: '10px' }}>UNIVERSE</span>
            <span style={{ color: '#E6EAF0', fontWeight: 700 }}>S&P 500 Index</span>
          </div>
        </div>
      </div>

      {/* Return Metrics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif' }}>STRATEGY RETURN</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>+18.42%</div>
          <span style={{ fontSize: '11px', color: '#8B95A5' }}>$10,000 → $11,842</span>
        </div>

        <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif' }}>BENCHMARK (S&P 500)</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#38BDF8' }}>+12.31%</div>
          <span style={{ fontSize: '11px', color: '#8B95A5' }}>$10,000 → $11,231</span>
        </div>

        <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif' }}>ALPHA (OUTPERFORMANCE)</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#3B82F6' }}>+6.11%</div>
          <span style={{ fontSize: '11px', color: '#10B981' }}>Net Excess Alpha</span>
        </div>
      </div>

      {/* Cumulative Return Chart */}
      <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #202630', paddingBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif' }}>
            CUMULATIVE PORTFOLIO VALUE ($)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} /> Strategy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }} /> Benchmark
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={BACKTEST_CURVE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#202630" vertical={false} />
              <XAxis dataKey="date" stroke="#8B95A5" fontSize={10} tickLine={false} axisLine={{ stroke: '#202630' }} />
              <YAxis domain={[9500, 12500]} stroke="#8B95A5" fontSize={10} tickLine={false} axisLine={{ stroke: '#202630' }} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D1117', borderColor: '#202630', borderRadius: '4px', fontSize: '11px', color: '#E6EAF0' }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              />
              <Line type="monotone" dataKey="strategy" stroke="#10B981" strokeWidth={2} dot={false} name="Strategy" />
              <Line type="monotone" dataKey="benchmark" stroke="#38BDF8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Benchmark" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Backtest Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
          <span style={{ fontSize: '10px', color: '#8B95A5', display: 'block', textTransform: 'uppercase' }}>Sharpe Ratio</span>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#E6EAF0', marginTop: '4px' }}>1.21</div>
        </div>
        <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
          <span style={{ fontSize: '10px', color: '#8B95A5', display: 'block', textTransform: 'uppercase' }}>Max Drawdown</span>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444', marginTop: '4px' }}>-8.4%</div>
        </div>
        <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
          <span style={{ fontSize: '10px', color: '#8B95A5', display: 'block', textTransform: 'uppercase' }}>Win Rate</span>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>62.7%</div>
        </div>
        <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
          <span style={{ fontSize: '10px', color: '#8B95A5', display: 'block', textTransform: 'uppercase' }}>Trades Executed</span>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#E6EAF0', marginTop: '4px' }}>184</div>
        </div>
      </div>
    </div>
  );
};

export default BacktestsPage;
