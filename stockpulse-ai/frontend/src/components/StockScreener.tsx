import React, { useState } from 'react';
import { StockQuote, PredictionData } from '../types';
import SignalBadge from './signals/SignalBadge';
import ConfidenceBar from './signals/ConfidenceBar';
import { SlidersHorizontal } from 'lucide-react';

interface StockScreenerProps {
  stocks: StockQuote[];
  predictionsMap: Record<string, PredictionData>;
  onSelectTicker: (ticker: string) => void;
}

const StockScreener: React.FC<StockScreenerProps> = ({
  stocks,
  predictionsMap,
  onSelectTicker,
}) => {
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'UP' | 'DOWN'>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'confidence' | 'price' | 'change'>('confidence');

  const filtered = stocks.filter((s) => {
    const pred = predictionsMap[s.ticker];
    if (signalFilter !== 'ALL') {
      if (!pred || pred.prediction !== signalFilter) return false;
    }
    if (pred && (pred.confidence * 100) < minConfidence) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const predA = predictionsMap[a.ticker]?.confidence || 0;
    const predB = predictionsMap[b.ticker]?.confidence || 0;
    const priceA = Number(a.price);
    const priceB = Number(b.price);
    const changeA = Number(a.change_percent);
    const changeB = Number(b.change_percent);

    if (sortBy === 'confidence') return predB - predA;
    if (sortBy === 'price') return priceB - priceA;
    if (sortBy === 'change') return changeB - changeA;
    return 0;
  });

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#202630]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#38BDF8]" />
          <div>
            <h3 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
              QUANTITATIVE STOCK SCREENER
            </h3>
            <p className="text-[10px] text-[#8B95A5]">Signal & Confidence Filter Engine</p>
          </div>
        </div>

        <span className="text-[11px] text-[#38BDF8] bg-[#0D1117] border border-[#202630] px-2.5 py-1 rounded">
          {sorted.length} Securities Matched
        </span>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0D1117] p-3 rounded border border-[#202630]">
        <div>
          <label className="text-[#8B95A5] text-[10px] block mb-1 font-sans">MODEL SIGNAL</label>
          <div className="flex bg-[#11161D] p-1 rounded border border-[#202630]">
            {(['ALL', 'UP', 'DOWN'] as const).map((sig) => (
              <button
                key={sig}
                onClick={() => setSignalFilter(sig)}
                className={`flex-1 py-0.5 rounded text-center font-bold transition-colors ${
                  signalFilter === sig ? 'bg-[#2563EB] text-white' : 'text-[#8B95A5] hover:text-[#E6EAF0]'
                }`}
              >
                {sig === 'UP' ? 'BULLISH' : sig === 'DOWN' ? 'BEARISH' : 'ALL'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[#8B95A5] text-[10px] mb-1 font-sans">
            <span>MIN CONFIDENCE</span>
            <span className="text-[#38BDF8] font-bold">{minConfidence}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={90}
            step={5}
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-full accent-[#38BDF8] bg-[#11161D] rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[#8B95A5] text-[10px] block mb-1 font-sans">SORT BY</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-[#11161D] border border-[#202630] rounded px-2.5 py-1 text-xs text-[#E6EAF0] focus:outline-none"
          >
            <option value="confidence">Highest Confidence</option>
            <option value="change">Top % Change</option>
            <option value="price">Highest Price</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="term-table">
          <thead>
            <tr>
              <th>SECURITY</th>
              <th>PRICE</th>
              <th>CHANGE</th>
              <th>SIGNAL</th>
              <th>CONFIDENCE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((st) => {
              const pred = predictionsMap[st.ticker];
              const price = Number(st.price);
              const changePct = Number(st.change_percent);
              const isUp = changePct >= 0;

              return (
                <tr
                  key={st.ticker}
                  onClick={() => onSelectTicker(st.ticker)}
                  className="cursor-pointer"
                >
                  <td className="font-bold text-[#E6EAF0]">{st.ticker}</td>
                  <td className="text-[#E6EAF0]">${price.toFixed(2)}</td>
                  <td className={`font-semibold ${isUp ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {isUp ? '+' : ''}{changePct.toFixed(2)}%
                  </td>
                  <td>
                    <SignalBadge signal={pred?.prediction || 'BULLISH'} />
                  </td>
                  <td>
                    <ConfidenceBar confidence={pred?.confidence || 0.75} />
                  </td>
                  <td>
                    <button className="px-2.5 py-0.5 bg-[#2563EB] hover:bg-[#3B82F6] text-white rounded text-[11px] font-bold transition-colors">
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockScreener;
