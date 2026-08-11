import React from 'react';

interface SentimentGaugeProps {
  score: number;
  confidence?: number;
  articleCount?: number;
}

const SentimentGauge: React.FC<SentimentGaugeProps> = ({
  score,
  confidence = 0.88,
  articleCount = 24,
}) => {
  const normalizedPct = Math.min(Math.max(((score + 1) / 2) * 100, 0), 100);

  let label = 'NEUTRAL';
  let badgeColor = 'text-[#8B95A5]';

  if (score > 0.15) {
    label = 'BULLISH';
    badgeColor = 'text-[#10B981]';
  } else if (score < -0.15) {
    label = 'BEARISH';
    badgeColor = 'text-[#EF4444]';
  }

  const positivePct = Math.round(normalizedPct);
  const negativePct = Math.round(Math.max(100 - positivePct - 22, 10));
  const neutralPct = 100 - positivePct - negativePct;

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#202630]">
        <div>
          <h4 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
            NLP SENTIMENT INDEX
          </h4>
          <p className="text-[10px] text-[#8B95A5]">FinBERT Transformer Output</p>
        </div>
        <span className={`text-xs font-bold ${badgeColor}`}>
          {label} ({score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)})
        </span>
      </div>

      {/* Track & Pointer */}
      <div className="space-y-2 pt-2">
        <div className="relative pt-5">
          <div
            className="absolute top-0 transition-all duration-300 transform -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${normalizedPct}%` }}
          >
            <span className="text-[10px] font-bold text-[#E6EAF0] bg-[#0D1117] px-1.5 py-0.5 rounded border border-[#202630]">
              {score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}
            </span>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#38BDF8]" />
          </div>

          <div className="h-2.5 w-full bg-[#0D1117] rounded overflow-hidden p-0.5 border border-[#202630] flex">
            <div className="h-full w-1/3 bg-[#EF4444]" />
            <div className="h-full w-1/3 bg-[#3B82F6]" />
            <div className="h-full w-1/3 bg-[#10B981]" />
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-[#8B95A5]">
          <span className="text-[#EF4444]">Bearish (-1.0)</span>
          <span className="text-[#3B82F6]">Neutral (0.0)</span>
          <span className="text-[#10B981]">Bullish (+1.0)</span>
        </div>
      </div>

      {/* Distribution Breakdown */}
      <div className="bg-[#0D1117] border border-[#202630] rounded p-3 space-y-1.5 text-xs">
        <div className="flex justify-between text-[10px] text-[#8B95A5] uppercase font-sans font-semibold">
          <span>SENTIMENT BREAKDOWN</span>
          <span>{articleCount} ARTICLES</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#10B981]">Positive</span>
          <span className="font-bold text-[#E6EAF0]">{positivePct}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#3B82F6]">Neutral</span>
          <span className="font-bold text-[#E6EAF0]">{neutralPct}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#EF4444]">Negative</span>
          <span className="font-bold text-[#E6EAF0]">{negativePct}%</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentGauge;
