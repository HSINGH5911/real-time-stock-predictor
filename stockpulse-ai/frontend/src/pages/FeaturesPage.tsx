import React from 'react';

const FEATURES_LIST = [
  { name: 'RSI_14', category: 'Oscillator', description: 'Relative Strength Index calculated over 14 trading periods.', importance: '32%' },
  { name: 'SENTIMENT_3D_AVG', category: 'NLP Sentiment', description: '3-day exponentially weighted news sentiment average.', importance: '31%' },
  { name: 'VOLUME_ACCELERATION', category: 'Volume', description: 'Ratio of 24h trading volume to 20-day simple moving average.', importance: '24%' },
  { name: 'MACD_SIGNAL_DIVERGENCE', category: 'Momentum', description: 'Difference between MACD line and 9-day signal line.', importance: '14%' },
  { name: 'VOLATILITY_10D', category: 'Risk', description: '10-day historical annualized return volatility.', importance: '9%' },
  { name: 'NEWS_VOLUME_24H', category: 'NLP Sentiment', description: 'Total count of news articles ingested in 24 hours.', importance: '4%' },
];

const FeaturesPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px', width: '100%' }}>
      <div
        style={{
          backgroundColor: '#11161D',
          border: '1px solid #202630',
          borderRadius: '4px',
          padding: '16px',
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
          FEATURE ENGINEERING STORE (DAY 3)
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
          Quantitative Feature Extraction Pipeline & Model Contribution Weights
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#11161D',
          border: '1px solid #202630',
          borderRadius: '4px',
          padding: '16px',
          overflowX: 'auto',
        }}
      >
        <table className="term-table">
          <thead>
            <tr>
              <th>FEATURE SYMBOL</th>
              <th>CATEGORY</th>
              <th>DESCRIPTION</th>
              <th>MODEL WEIGHT</th>
            </tr>
          </thead>
          <tbody>
            {FEATURES_LIST.map((feat) => (
              <tr key={feat.name}>
                <td className="font-mono font-bold text-[#E6EAF0]">{feat.name}</td>
                <td className="font-mono text-[#38BDF8]">{feat.category}</td>
                <td className="text-[#8B95A5]">{feat.description}</td>
                <td className="font-mono font-bold text-[#10B981]">{feat.importance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeaturesPage;
