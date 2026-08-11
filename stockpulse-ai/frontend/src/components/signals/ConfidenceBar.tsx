import React from 'react';

interface ConfidenceBarProps {
  confidence: number; // 0 to 1 or 0 to 100
  showPercent?: boolean;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence, showPercent = true }) => {
  const pct = confidence > 1 ? Math.min(100, Math.max(0, confidence)) : Math.min(100, Math.max(0, confidence * 100));
  const roundedPct = Math.round(pct);

  // Generate analytical block indicator (e.g., █ filled, ░ empty out of 10 blocks)
  const totalBlocks = 12;
  const filledBlocks = Math.round((roundedPct / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;

  const filledStr = '█'.repeat(filledBlocks);
  const emptyStr = '░'.repeat(emptyBlocks);

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs">
      {showPercent && <span className="font-bold text-[#E6EAF0] w-9">{roundedPct}%</span>}
      <span className="text-[10px] tracking-tighter text-[#3B82F6]" title={`${roundedPct}% Confidence`}>
        <span className="text-[#38BDF8]">{filledStr}</span>
        <span className="text-[#202630]">{emptyStr}</span>
      </span>
    </div>
  );
};

export default ConfidenceBar;
