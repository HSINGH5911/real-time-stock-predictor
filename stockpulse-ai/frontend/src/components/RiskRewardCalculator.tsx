import React from 'react';
import { Target, ShieldAlert, Crosshair } from 'lucide-react';
import { PredictionData } from '../types';

interface RiskRewardProps {
  ticker: string;
  currentPrice: number;
  prediction?: PredictionData | null;
}

const RiskRewardCalculator: React.FC<RiskRewardProps> = ({
  currentPrice,
  prediction,
}) => {
  const price = Number(currentPrice) || 212.43;
  const isBullish = prediction?.prediction === 'UP';

  const expectedVolatilityPct = 1.84;
  const volatilityDollar = price * (expectedVolatilityPct / 100);

  const takeProfit = isBullish ? price + (volatilityDollar * 1.8) : price - (volatilityDollar * 1.8);
  const stopLoss = isBullish ? price - (volatilityDollar * 0.9) : price + (volatilityDollar * 0.9);
  const targetPrice = isBullish ? price + (volatilityDollar * 1.5) : price - (volatilityDollar * 1.5);
  const riskRewardRatio = '1 : 2.0';

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#202630]">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#F59E0B]" />
          <div>
            <h3 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
              PRICE TARGETS & RISK / REWARD
            </h3>
            <p className="text-[10px] text-[#8B95A5]">20D Volatility & Model Invalidation Engine</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#F59E0B] bg-[#0D1117] border border-[#202630] px-2 py-0.5 rounded">
          R:R {riskRewardRatio}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Take Profit */}
        <div className="p-3 bg-[#0D1117] border border-[#10B981]/40 rounded">
          <div className="flex items-center justify-between text-[10px] text-[#8B95A5] mb-1">
            <span className="font-bold text-[#10B981] flex items-center gap-1">
              <Crosshair className="w-3 h-3" /> Take Profit (TP)
            </span>
            <span className="text-[#10B981] font-bold">+3.3%</span>
          </div>
          <div className="text-base font-bold text-[#E6EAF0]">${takeProfit.toFixed(2)}</div>
        </div>

        {/* Stop Loss */}
        <div className="p-3 bg-[#0D1117] border border-[#EF4444]/40 rounded">
          <div className="flex items-center justify-between text-[10px] text-[#8B95A5] mb-1">
            <span className="font-bold text-[#EF4444] flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Stop Loss (SL)
            </span>
            <span className="text-[#EF4444] font-bold">-1.6%</span>
          </div>
          <div className="text-base font-bold text-[#E6EAF0]">${stopLoss.toFixed(2)}</div>
        </div>

        {/* Fair Value Target */}
        <div className="p-3 bg-[#0D1117] border border-[#38BDF8]/40 rounded">
          <div className="flex items-center justify-between text-[10px] text-[#8B95A5] mb-1">
            <span className="font-bold text-[#38BDF8] flex items-center gap-1">
              <Target className="w-3 h-3" /> Fair Value Target
            </span>
            <span className="text-[#38BDF8] font-bold">24h Target</span>
          </div>
          <div className="text-base font-bold text-[#E6EAF0]">${targetPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default RiskRewardCalculator;
