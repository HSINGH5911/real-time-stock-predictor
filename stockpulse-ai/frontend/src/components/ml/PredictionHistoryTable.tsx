import React from 'react';

interface PredictionHistoryItem {
  date: string;
  prediction: string;
  actual: string;
  isCorrect: boolean;
}

interface PredictionHistoryTableProps {
  ticker: string;
}

const DEFAULT_HISTORY: PredictionHistoryItem[] = [
  { date: 'Aug 09', prediction: '▲ UP', actual: '▲ UP', isCorrect: true },
  { date: 'Aug 08', prediction: '▲ UP', actual: '▲ UP', isCorrect: true },
  { date: 'Aug 07', prediction: '▼ DOWN', actual: '▲ UP', isCorrect: false },
  { date: 'Aug 06', prediction: '▲ UP', actual: '▲ UP', isCorrect: true },
  { date: 'Aug 05', prediction: '─ NEUTRAL', actual: '─ FLAT', isCorrect: true },
  { date: 'Aug 04', prediction: '▲ UP', actual: '▲ UP', isCorrect: true },
  { date: 'Aug 03', prediction: '▼ DOWN', actual: '▼ DOWN', isCorrect: true },
];

const PredictionHistoryTable: React.FC<PredictionHistoryTableProps> = ({ ticker }) => {
  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#202630] pb-2">
        <h3 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
          MODEL PERFORMANCE — {ticker}
        </h3>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="text-[#8B95A5]">7D Accuracy: <span className="text-[#10B981]">71.4%</span></span>
          <span className="text-[#8B95A5]">30D Accuracy: <span className="text-[#38BDF8]">64.8%</span></span>
        </div>
      </div>

      {/* Table */}
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
            {DEFAULT_HISTORY.map((row, idx) => (
              <tr key={idx}>
                <td className="text-[#8B95A5]">{row.date}</td>
                <td className={`font-bold ${row.prediction.includes('UP') ? 'text-[#10B981]' : row.prediction.includes('DOWN') ? 'text-[#EF4444]' : 'text-[#8B95A5]'}`}>
                  {row.prediction}
                </td>
                <td className={`font-bold ${row.actual.includes('UP') ? 'text-[#10B981]' : row.actual.includes('DOWN') ? 'text-[#EF4444]' : 'text-[#8B95A5]'}`}>
                  {row.actual}
                </td>
                <td>
                  {row.isCorrect ? (
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

export default PredictionHistoryTable;
