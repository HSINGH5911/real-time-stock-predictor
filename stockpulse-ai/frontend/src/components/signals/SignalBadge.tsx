import React from 'react';

interface SignalBadgeProps {
  signal: 'UP' | 'DOWN' | 'BULLISH' | 'BEARISH' | 'NEUTRAL' | string;
  size?: 'sm' | 'md';
}

const SignalBadge: React.FC<SignalBadgeProps> = ({ signal, size = 'md' }) => {
  const norm = String(signal).toUpperCase();
  const isBullish = norm === 'UP' || norm === 'BULLISH';
  const isBearish = norm === 'DOWN' || norm === 'BEARISH';

  if (isBullish) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono font-bold tracking-tight text-[#10B981] ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
        <span>▲</span>
        <span>BULLISH</span>
      </span>
    );
  }

  if (isBearish) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono font-bold tracking-tight text-[#EF4444] ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
        <span>▼</span>
        <span>BEARISH</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-mono font-medium tracking-tight text-[#8B95A5] ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
      <span>─</span>
      <span>NEUTRAL</span>
    </span>
  );
};

export default SignalBadge;
