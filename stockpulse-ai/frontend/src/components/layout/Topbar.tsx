import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Clock } from 'lucide-react';
import FallbackIndicator from '../FallbackIndicator';

interface TopbarProps {
  onOpenSearch: () => void;
  onRefresh?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onOpenSearch, onRefresh }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [secondsAgo, setSecondsAgo] = useState<number>(12);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      setTimeStr(`${formatted} ET`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setSecondsAgo(0);
    if (onRefresh) onRefresh();
  };

  return (
    <header
      className="h-14 bg-[#080A0D] border-b border-[#202630] px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 select-none"
      style={{
        height: '56px',
        backgroundColor: '#080A0D',
        borderBottom: '1px solid #202630',
        paddingLeft: '24px',
        paddingRight: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        userSelect: 'none',
        width: '100%',
      }}
    >
      {/* Left: Global Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          id="search-trigger"
          title="search-trigger"
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-[#0D1117] hover:bg-[#11161D] border border-[#202630] rounded text-xs text-[#8B95A5] w-64 md:w-80 transition-colors text-left"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            backgroundColor: '#0D1117',
            border: '1px solid #202630',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#8B95A5',
            width: '320px',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <Search style={{ width: '14px', height: '14px', color: '#8B95A5' }} />
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Search securities (e.g. AAPL, NVDA)...
          </span>
          <kbd
            style={{
              padding: '2px 6px',
              fontSize: '10px',
              backgroundColor: '#161C24',
              color: '#8B95A5',
              border: '1px solid #202630',
              borderRadius: '3px',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Live Market State & Telemetry */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '12px',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {/* Data Source & System State */}
        <FallbackIndicator />

        {/* Live Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E6EAF0' }}>
          <Clock style={{ width: '14px', height: '14px', color: '#8B95A5' }} />
          <span>{timeStr || '09:33:42 ET'}</span>
        </div>

        {/* Last Update */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B95A5', fontSize: '11px' }}>
          <span>Last update: {secondsAgo}s ago</span>
          <button
            onClick={handleManualRefresh}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#8B95A5',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
            title="Refresh market state"
          >
            <RefreshCw style={{ width: '12px', height: '12px' }} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
