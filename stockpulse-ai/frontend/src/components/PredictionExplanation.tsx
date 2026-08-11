import React from 'react';
import { PredictionData, ExplainabilitySignal } from '../types';

interface PredictionExplanationProps {
  prediction: PredictionData | null;
  ticker: string;
}

const PredictionExplanation: React.FC<PredictionExplanationProps> = ({ prediction, ticker }) => {
  if (!prediction) {
    return (
      <div className="bg-[#11161D] border border-[#202630] rounded p-4 text-center text-xs text-[#8B95A5] font-mono">
        Loading prediction model telemetry...
      </div>
    );
  }

  const isBullish = prediction.prediction === 'UP';
  const signals: ExplainabilitySignal[] = prediction.top_signals || [
    { feature: 'Sentiment', signal: 'Positive Earnings & NLP Sentiment (+0.74)', type: 'bullish', importance: 0.31 },
    { feature: 'Volume', signal: 'Volume acceleration (+18.2% vs 20d avg)', type: 'bullish', importance: 0.24 },
    { feature: 'RSI', signal: 'RSI 14 momentum expansion (63.4)', type: 'bullish', importance: 0.18 },
    { feature: 'MACD', signal: 'MACD positive signal line divergence (+1.42)', type: 'bullish', importance: 0.14 },
    { feature: 'Volatility', signal: 'Moderate annualized 10-day volatility (2.14%)', type: 'bullish', importance: 0.09 },
  ];

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#202630]">
        <div>
          <h4 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
            KEY MODEL DRIVERS — {ticker}
          </h4>
          <p className="text-[10px] text-[#8B95A5]">Model Signal: {isBullish ? 'BULLISH' : 'BEARISH'}</p>
        </div>
        <span className="text-[11px] text-[#38BDF8]">
          Model: {prediction.model_version || 'rf_v1.2'}
        </span>
      </div>

      <div className="space-y-1.5">
        {signals.map((sig, idx) => {
          const isPos = sig.type === 'bullish';
          const isNeg = sig.type === 'bearish';
          const textColor = isPos ? 'text-[#10B981]' : isNeg ? 'text-[#EF4444]' : 'text-[#8B95A5]';

          return (
            <div
              key={idx}
              className="p-2.5 bg-[#0D1117] border border-[#202630] rounded flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`font-bold ${textColor}`}>
                  {isPos ? '+' : isNeg ? '-' : '—'}
                </span>
                <span className="text-[#E6EAF0]">{sig.signal}</span>
              </div>

              {sig.importance > 0 && (
                <span className="text-[10px] text-[#8B95A5] bg-[#161C24] px-1.5 py-0.5 rounded">
                  {Math.round(sig.importance * 100)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionExplanation;
