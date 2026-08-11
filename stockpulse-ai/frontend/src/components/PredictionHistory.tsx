import React from 'react';
import SignalBadge from './signals/SignalBadge';

interface PredictionHistoryItem {
  date?: string;
  prediction: string;
  actual?: string;
  isCorrect?: boolean;
}

interface PredictionHistoryProps {
  ticker: string;
  history?: PredictionHistoryItem[];
}

const DEFAULT_ITEMS: PredictionHistoryItem[] = [
  { date: 'Aug 09', prediction: 'BULLISH', actual: 'BULLISH', isCorrect: true },
  { date: 'Aug 08', prediction: 'BULLISH', actual: 'BULLISH', isCorrect: true },
  { date: 'Aug 07', prediction: 'BEARISH', actual: 'BULLISH', isCorrect: false },
  { date: 'Aug 06', prediction: 'BULLISH', actual: 'BULLISH', isCorrect: true },
  { date: 'Aug 05', prediction: 'NEUTRAL', actual: 'NEUTRAL', isCorrect: true },
];

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ ticker }) => {
  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[#202630] pb-2">
        <h4 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
          MODEL PERFORMANCE — {ticker}
        </h4>
        <div className="flex items-center gap-4 text-xs">
          <span>7D Accuracy: <strong className="text-[#10B981]">71.4%</strong></span>
          <span>30D Accuracy: <strong className="text-[#38BDF8]">64.8%</strong></span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="term-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>PREDICTION</th>
              <th>ACTUAL</th>
              <th>RESULT</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_ITEMS.map((item, idx) => (
              <tr key={idx}>
                <td className="text-[#8B95A5]">{item.date}</td>
                <td><SignalBadge signal={item.prediction} /></td>
                <td><SignalBadge signal={item.actual || 'BULLISH'} /></td>
                <td>
                  {item.isCorrect ? (
                    <span className="text-[#10B981] font-bold">✓</span>
                  ) : (
                    <span className="text-[#EF4444] font-bold">✕</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionHistory;
