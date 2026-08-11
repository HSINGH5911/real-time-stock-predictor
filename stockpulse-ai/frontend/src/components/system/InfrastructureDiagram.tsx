import React from 'react';
import { Database, Server, Cpu, Radio, ShieldCheck, ArrowRight } from 'lucide-react';

const InfrastructureDiagram: React.FC = () => {
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
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #202630', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', margin: 0 }}>
            REDIS PIPELINE ARCHITECTURE
          </h3>
          <p style={{ fontSize: '11px', color: '#4E5766', fontFamily: 'JetBrains Mono, monospace', marginTop: '4px', marginBottom: 0 }}>
            Custom High-Throughput Memory Database Pipeline
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#10B981', backgroundColor: '#0D1117', padding: '4px 10px', borderRadius: '4px', border: '1px solid #202630' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span>PIPELINE OPERATIONAL</span>
        </div>
      </div>

      {/* Visual Pipeline Flow Chart */}
      <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '16px', overflowX: 'auto', maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '600px', gap: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
          {/* Step 1: News API */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', width: '110px', textAlign: 'center' }}>
            <Radio style={{ width: '18px', height: '18px', color: '#38BDF8', marginBottom: '6px' }} />
            <span style={{ fontWeight: 700, color: '#E6EAF0' }}>NEWS API</span>
            <span style={{ fontSize: '10px', color: '#8B95A5', marginTop: '4px' }}>Ingestion Stream</span>
          </div>

          <ArrowRight style={{ width: '16px', height: '16px', color: '#202630', flexShrink: 0 }} />

          {/* Step 2: News Stream / Redis */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', width: '110px', textAlign: 'center' }}>
            <Database style={{ width: '18px', height: '18px', color: '#3B82F6', marginBottom: '6px' }} />
            <span style={{ fontWeight: 700, color: '#E6EAF0' }}>NEWS STREAM</span>
            <span style={{ fontSize: '10px', color: '#8B95A5', marginTop: '4px' }}>Redis Storage</span>
          </div>

          <ArrowRight style={{ width: '16px', height: '16px', color: '#202630', flexShrink: 0 }} />

          {/* Step 3: Sentiment Worker */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', width: '110px', textAlign: 'center' }}>
            <Server style={{ width: '18px', height: '18px', color: '#F59E0B', marginBottom: '6px' }} />
            <span style={{ fontWeight: 700, color: '#E6EAF0' }}>SENTIMENT</span>
            <span style={{ fontSize: '10px', color: '#8B95A5', marginTop: '4px' }}>FinBERT NLP</span>
          </div>

          <ArrowRight style={{ width: '16px', height: '16px', color: '#202630', flexShrink: 0 }} />

          {/* Step 4: Feature Engine */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', width: '110px', textAlign: 'center' }}>
            <Cpu style={{ width: '18px', height: '18px', color: '#38BDF8', marginBottom: '6px' }} />
            <span style={{ fontWeight: 700, color: '#E6EAF0' }}>FEATURES</span>
            <span style={{ fontSize: '10px', color: '#8B95A5', marginTop: '4px' }}>Feature Store</span>
          </div>

          <ArrowRight style={{ width: '16px', height: '16px', color: '#202630', flexShrink: 0 }} />

          {/* Step 5: Prediction Engine */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px', backgroundColor: '#11161D', border: '1px solid #10B981', borderRadius: '4px', width: '110px', textAlign: 'center' }}>
            <ShieldCheck style={{ width: '18px', height: '18px', color: '#10B981', marginBottom: '6px' }} />
            <span style={{ fontWeight: 700, color: '#E6EAF0' }}>PREDICT</span>
            <span style={{ fontSize: '10px', color: '#10B981', marginTop: '4px' }}>Random Forest</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureDiagram;
