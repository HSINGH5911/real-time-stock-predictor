import React from 'react';
import InfrastructureDiagram from '../components/system/InfrastructureDiagram';

const InfrastructurePage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px', width: '100%', fontFamily: 'JetBrains Mono, monospace' }}>
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
          SYSTEM & INFRASTRUCTURE TELEMETRY
        </h2>
        <p style={{ fontSize: '11px', color: '#4E5766', marginTop: '4px', marginBottom: 0 }}>
          Custom Redis Database Memory Engine & Pipeline Workers Status
        </p>
      </div>

      {/* Section 1: System Status Grid */}
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
          SYSTEM STATUS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { name: 'API SERVER', status: 'ONLINE' },
            { name: 'REDIS DATABASE', status: 'ONLINE' },
            { name: 'NEWS WORKER', status: 'ONLINE' },
            { name: 'MARKET WORKER', status: 'ONLINE' },
            { name: 'ML WORKER', status: 'ONLINE' },
          ].map((srv) => (
            <div key={srv.name} style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: '#8B95A5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{srv.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#10B981' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span>● {srv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 & 3: Database Stats & Workers Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', width: '100%' }}>
        {/* Database Telemetry */}
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
            CUSTOM REDIS-STYLE DATABASE
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
              <span style={{ color: '#8B95A5', fontSize: '10px', display: 'block' }}>Keys Stored</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#E6EAF0' }}>24,812</span>
            </div>
            <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
              <span style={{ color: '#8B95A5', fontSize: '10px', display: 'block' }}>Memory Consumption</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8' }}>142 MB</span>
            </div>
            <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
              <span style={{ color: '#8B95A5', fontSize: '10px', display: 'block' }}>Commands / sec</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#10B981' }}>312</span>
            </div>
            <div style={{ backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '12px' }}>
              <span style={{ color: '#8B95A5', fontSize: '10px', display: 'block' }}>Connected Clients</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#E6EAF0' }}>8</span>
            </div>
          </div>
        </div>

        {/* Worker Processes */}
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
            BACKGROUND PIPELINE WORKERS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            {[
              { name: 'NEWS INGESTION WORKER', status: 'RUNNING' },
              { name: 'MARKET INGESTION WORKER', status: 'RUNNING' },
              { name: 'SENTIMENT NLP WORKER', status: 'RUNNING' },
              { name: 'PREDICTION ENGINE WORKER', status: 'RUNNING' },
            ].map((wrk) => (
              <div key={wrk.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0D1117', border: '1px solid #202630', borderRadius: '4px', padding: '10px 12px' }}>
                <span style={{ color: '#E6EAF0' }}>{wrk.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '11px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  ● {wrk.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Database Pipeline Visualization */}
      <InfrastructureDiagram />
    </div>
  );
};

export default InfrastructurePage;
