import React from 'react';
import { LayoutGrid, TrendingUp, TrendingDown } from 'lucide-react';

interface SectorItem {
  name: string;
  ticker: string;
  changePct: number;
  marketCap: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

const SECTORS: SectorItem[] = [
  { name: 'Semiconductors', ticker: 'NVDA', changePct: 2.31, marketCap: '$3.15T', sentiment: 'bullish' },
  { name: 'Big Tech & Cloud', ticker: 'MSFT', changePct: 0.44, marketCap: '$3.32T', sentiment: 'bullish' },
  { name: 'Consumer Hardware', ticker: 'AAPL', changePct: 1.42, marketCap: '$3.44T', sentiment: 'bullish' },
  { name: 'EV & Clean Energy', ticker: 'TSLA', changePct: -1.92, marketCap: '$695B', sentiment: 'bearish' },
  { name: 'E-Commerce & AWS', ticker: 'AMZN', changePct: 0.81, marketCap: '$1.88T', sentiment: 'bullish' },
  { name: 'AI Search & Media', ticker: 'GOOGL', changePct: 0.71, marketCap: '$2.08T', sentiment: 'bullish' },
  { name: 'Social Platforms', ticker: 'META', changePct: 1.38, marketCap: '$1.24T', sentiment: 'bullish' },
  { name: 'Chips & Hardware', ticker: 'AMD', changePct: -1.42, marketCap: '$230B', sentiment: 'bearish' },
];

interface SectorHeatmapProps {
  onSelectTicker?: (ticker: string) => void;
}

const SectorHeatmap: React.FC<SectorHeatmapProps> = ({ onSelectTicker }) => {
  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-3 font-mono">
      <div className="flex items-center justify-between pb-2 border-b border-[#202630]">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-[#38BDF8]" />
          <div>
            <h3 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
              SECTOR HEATMAP
            </h3>
            <p className="text-[10px] text-[#8B95A5]">Key Sector Performance Matrix</p>
          </div>
        </div>

        <span className="text-[11px] text-[#8B95A5]">8 Sectors</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SECTORS.map((sec) => {
          const isUp = sec.changePct >= 0;
          const textColor = isUp ? 'text-[#10B981]' : 'text-[#EF4444]';

          return (
            <div
              key={sec.ticker}
              onClick={() => onSelectTicker && onSelectTicker(sec.ticker)}
              className="p-3 rounded border border-[#202630] bg-[#0D1117] hover:border-[#38BDF8] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-[#8B95A5] block font-sans truncate">
                    {sec.name}
                  </span>
                  <h4 className="text-sm font-bold text-[#E6EAF0] mt-0.5">
                    {sec.ticker}
                  </h4>
                </div>

                <span className={`text-[11px] font-bold flex items-center gap-0.5 ${textColor}`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isUp ? '+' : ''}{sec.changePct.toFixed(2)}%
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-[#8B95A5] pt-1.5 border-t border-[#202630]">
                <span>Cap: {sec.marketCap}</span>
                <span className="uppercase">{sec.sentiment}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorHeatmap;
