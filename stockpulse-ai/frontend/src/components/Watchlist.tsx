import React, { useState, useEffect } from 'react';
import { Star, Plus, X } from 'lucide-react';

interface WatchlistProps {
  onSelectTicker: (ticker: string) => void;
  selectedTicker: string;
  onFilterWatchlistOnly?: (active: boolean) => void;
  isFilterActive?: boolean;
}

const DEFAULT_WATCHLIST = [
  'AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN',
  'META', 'TSLA', 'BRK-B', 'AVGO', 'LLY',
  'WMT', 'JPM', 'V', 'UNH', 'XOM',
  'ORCL', 'MA', 'COST', 'HD', 'PG'
];

const Watchlist: React.FC<WatchlistProps> = ({
  onSelectTicker,
  selectedTicker,
  onFilterWatchlistOnly,
  isFilterActive = false,
}) => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stockpulse_watchlist');
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  const [inputTicker, setInputTicker] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('stockpulse_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage:', e);
    }
  }, [watchlist]);

  const addTicker = () => {
    if (!inputTicker) return;
    const clean = inputTicker.trim().toUpperCase();
    if (clean && !watchlist.includes(clean)) {
      setWatchlist([...watchlist, clean]);
    }
    setInputTicker('');
  };

  const removeTicker = (e: React.MouseEvent, ticker: string) => {
    e.stopPropagation();
    setWatchlist(watchlist.filter((t) => t !== ticker));
  };

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#202630]">
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
          <h4 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">WATCHLIST</h4>
          <span className="text-[11px] text-[#8B95A5] font-mono">({watchlist.length})</span>
        </div>

        {onFilterWatchlistOnly && (
          <button
            onClick={() => onFilterWatchlistOnly(!isFilterActive)}
            className={`text-[11px] px-2 py-0.5 rounded border font-mono transition-colors ${
              isFilterActive
                ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40 font-bold'
                : 'bg-[#0D1117] text-[#8B95A5] border-[#202630] hover:text-[#E6EAF0]'
            }`}
          >
            {isFilterActive ? 'Filter Active' : 'Filter Watchlist'}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {watchlist.map((ticker) => {
          const isSelected = ticker === selectedTicker;
          return (
            <button
              key={ticker}
              onClick={() => onSelectTicker(ticker)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-bold transition-colors ${
                isSelected
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-[#0D1117] text-[#E6EAF0] border-[#202630] hover:border-[#38BDF8] hover:text-white'
              }`}
            >
              <span>{ticker}</span>
              <span
                onClick={(e) => removeTicker(e, ticker)}
                className="hover:text-[#EF4444] transition-colors p-0.5"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-[#202630] flex items-center gap-2">
        <input
          type="text"
          value={inputTicker}
          onChange={(e) => setInputTicker(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTicker()}
          placeholder="Add ticker (e.g. META)..."
          className="flex-1 bg-[#0D1117] border border-[#202630] rounded px-3 py-1 text-xs text-[#E6EAF0] font-mono placeholder-[#8B95A5] focus:outline-none focus:border-[#38BDF8]"
        />
        <button
          onClick={addTicker}
          className="px-3 py-1 bg-[#2563EB] hover:bg-[#3B82F6] text-white rounded text-xs font-mono font-bold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
    </div>
  );
};

export default Watchlist;
