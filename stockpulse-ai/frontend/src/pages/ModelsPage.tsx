import React, { useState } from 'react';

interface ModelRegistryItem {
  id: string;
  name: string;
  version: string;
  type: string;
  status: 'ACTIVE' | 'ARCHIVED';
  accuracy: string;
  precision: string;
  recall: string;
  f1: string;
  trainingRows: string;
  features: number;
  lastTrained: string;
}

const MODELS: ModelRegistryItem[] = [
  {
    id: 'market_rf_v12',
    name: 'MarketRF',
    version: 'v1.2',
    type: 'Random Forest Classifier',
    status: 'ACTIVE',
    accuracy: '64.8%',
    precision: '67.2%',
    recall: '61.3%',
    f1: '64.1%',
    trainingRows: '42,812',
    features: 17,
    lastTrained: 'Aug 10, 2026',
  },
  {
    id: 'market_rf_v11',
    name: 'MarketRF',
    version: 'v1.1',
    type: 'Random Forest Classifier',
    status: 'ARCHIVED',
    accuracy: '61.2%',
    precision: '63.4%',
    recall: '58.9%',
    f1: '61.0%',
    trainingRows: '34,200',
    features: 12,
    lastTrained: 'Jul 15, 2026',
  },
  {
    id: 'sentiment_finbert_v20',
    name: 'Sentiment',
    version: 'v2.0',
    type: 'FinBERT NLP Encoder',
    status: 'ACTIVE',
    accuracy: '88.4%',
    precision: '89.1%',
    recall: '87.6%',
    f1: '88.3%',
    trainingRows: '124,500',
    features: 768,
    lastTrained: 'Aug 08, 2026',
  },
];

const ModelsPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelRegistryItem>(MODELS[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px', width: '100%' }}>
      {/* Header */}
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
          MODEL REGISTRY & RESEARCH
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
          Production Machine Learning Classification Models & Performance Telemetry
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', width: '100%' }}>
        {/* Left: Model Registry Table */}
        <div
          style={{
            backgroundColor: '#11161D',
            border: '1px solid #202630',
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
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
            MODEL REGISTRY
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="term-table">
              <thead>
                <tr>
                  <th>MODEL</th>
                  <th>VERSION</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {MODELS.map((model) => {
                  const isSelected = selectedModel.id === model.id;
                  const isActive = model.status === 'ACTIVE';
                  return (
                    <tr
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#161C24] border-l-2 border-[#2563EB]' : ''
                      }`}
                    >
                      <td className="font-mono font-bold text-[#E6EAF0]">{model.name}</td>
                      <td className="font-mono text-[#8B95A5]">{model.version}</td>
                      <td className="font-mono text-[#E6EAF0]">{model.type}</td>
                      <td>
                        {isActive ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, color: '#10B981' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                            <span>ACTIVE</span>
                          </span>
                        ) : (
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#8B95A5' }}>Archived</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Model Detail Card */}
        <div
          style={{
            backgroundColor: '#11161D',
            border: '1px solid #202630',
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontFamily: 'JetBrains Mono, monospace',
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
            MODEL: {selectedModel.name} {selectedModel.version}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#8B95A5', display: 'block' }}>Accuracy</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#10B981' }}>{selectedModel.accuracy}</span>
            </div>
            <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#8B95A5', display: 'block' }}>Precision</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8' }}>{selectedModel.precision}</span>
            </div>
            <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#8B95A5', display: 'block' }}>Recall</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#E6EAF0' }}>{selectedModel.recall}</span>
            </div>
            <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
              <span style={{ fontSize: '10px', color: '#8B95A5', display: 'block' }}>F1 Score</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#3B82F6' }}>{selectedModel.f1}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #202630', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8B95A5' }}>Training Rows</span>
              <span style={{ color: '#E6EAF0' }}>{selectedModel.trainingRows}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8B95A5' }}>Features</span>
              <span style={{ color: '#E6EAF0' }}>{selectedModel.features}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#8B95A5' }}>Last Trained</span>
              <span style={{ color: '#E6EAF0' }}>{selectedModel.lastTrained}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;
