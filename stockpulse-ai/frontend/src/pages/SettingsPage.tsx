import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('sp_live_9482938491823941');
  const [refreshInterval, setRefreshInterval] = useState<number>(5);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(60);
  const [theme] = useState<string>('Institutional Terminal Dark');

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
          SYSTEM SETTINGS & CONFIGURATION
        </h2>
        <p style={{ fontSize: '11px', color: '#4E5766', marginTop: '4px', marginBottom: 0 }}>
          Terminal Parameters, API Tokens, and Data Ingestion Thresholds
        </p>
      </div>

      <div style={{ backgroundColor: '#11161D', border: '1px solid #202630', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
        {/* API Key */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 700 }}>
            API SERVICE KEY
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              backgroundColor: '#0D1117',
              border: '1px solid #202630',
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#E6EAF0',
              outline: 'none',
              width: '100%',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          />
        </div>

        {/* Refresh Interval */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 700 }}>
            POLLING INTERVAL (SECONDS)
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            style={{
              backgroundColor: '#0D1117',
              border: '1px solid #202630',
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#E6EAF0',
              outline: 'none',
              width: '100%',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <option value={1}>1 second (Real-Time)</option>
            <option value={5}>5 seconds (Standard)</option>
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
          </select>
        </div>

        {/* Confidence Threshold */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <label style={{ color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 700 }}>
              MINIMUM SIGNAL CONFIDENCE THRESHOLD
            </label>
            <span style={{ color: '#38BDF8', fontWeight: 700 }}>{confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={90}
            step={5}
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            style={{
              backgroundColor: '#0D1117',
              accentColor: '#38BDF8',
              cursor: 'pointer',
              width: '100%',
            }}
          />
        </div>

        {/* Theme Preset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: '#8B95A5', textTransform: 'uppercase', fontFamily: 'Geist, Inter, sans-serif', fontWeight: 700 }}>
            TERMINAL DESIGN THEME
          </label>
          <div
            style={{
              backgroundColor: '#0D1117',
              border: '1px solid #202630',
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#E6EAF0',
            }}
          >
            {theme}
          </div>
        </div>

        <button
          style={{
            marginTop: '8px',
            padding: '10px 16px',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            alignSelf: 'flex-start',
            transition: 'background-color 0.15s ease',
          }}
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
