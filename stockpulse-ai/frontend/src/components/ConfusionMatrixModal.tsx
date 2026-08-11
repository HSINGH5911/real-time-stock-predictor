import React from 'react';
import { Grid } from 'lucide-react';

interface ConfusionMatrixProps {
  matrix?: number[][];
}

const ConfusionMatrixVisualizer: React.FC<ConfusionMatrixProps> = ({
  matrix = [
    [142, 68],
    [66, 104],
  ],
}) => {
  const tn = matrix[0][0]; // True Negative
  const fp = matrix[0][1]; // False Positive
  const fn = matrix[1][0]; // False Negative
  const tp = matrix[1][1]; // True Positive

  const total = tn + fp + fn + tp;
  const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 64.8;

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-[#202630]">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-[#38BDF8]" />
          <div>
            <h3 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
              CONFUSION MATRIX
            </h3>
            <p className="text-[10px] text-[#8B95A5]">Holdout Test Set Classification Counts</p>
          </div>
        </div>

        <span className="text-[11px] text-[#38BDF8] bg-[#0D1117] border border-[#202630] px-2.5 py-1 rounded">
          N = {total} Instances
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center text-xs">
        {/* True Positive */}
        <div className="p-3 bg-[#0D1117] border border-[#10B981]/40 rounded">
          <span className="text-[10px] font-bold text-[#10B981] uppercase block">True Positive (TP)</span>
          <div className="text-2xl font-bold text-[#10B981] mt-1">{tp}</div>
          <p className="text-[10px] text-[#8B95A5] mt-1">Predicted UP & Upward</p>
        </div>

        {/* False Positive */}
        <div className="p-3 bg-[#0D1117] border border-[#EF4444]/40 rounded">
          <span className="text-[10px] font-bold text-[#EF4444] uppercase block">False Positive (FP)</span>
          <div className="text-2xl font-bold text-[#EF4444] mt-1">{fp}</div>
          <p className="text-[10px] text-[#8B95A5] mt-1">Predicted UP & Downward</p>
        </div>

        {/* False Negative */}
        <div className="p-3 bg-[#0D1117] border border-[#EF4444]/40 rounded">
          <span className="text-[10px] font-bold text-[#EF4444] uppercase block">False Negative (FN)</span>
          <div className="text-2xl font-bold text-[#EF4444] mt-1">{fn}</div>
          <p className="text-[10px] text-[#8B95A5] mt-1">Predicted DOWN & Upward</p>
        </div>

        {/* True Negative */}
        <div className="p-3 bg-[#0D1117] border border-[#10B981]/40 rounded">
          <span className="text-[10px] font-bold text-[#10B981] uppercase block">True Negative (TN)</span>
          <div className="text-2xl font-bold text-[#10B981] mt-1">{tn}</div>
          <p className="text-[10px] text-[#8B95A5] mt-1">Predicted DOWN & Downward</p>
        </div>
      </div>

      <div className="pt-2 border-t border-[#202630] flex items-center justify-between text-xs text-[#8B95A5]">
        <span>Overall Classification Accuracy:</span>
        <strong className="text-[#10B981] font-bold">{accuracy.toFixed(1)}% Correct</strong>
      </div>
    </div>
  );
};

export default ConfusionMatrixVisualizer;
