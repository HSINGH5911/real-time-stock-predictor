import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  changePct: number;
}

const TICKER_ITEMS: TickerItem[] = [
  { symbol: 'S&P 500', name: 'SPX', price: '5,982.21', changePct: 0.82 },
  { symbol: 'NASDAQ', name: 'IXIC', price: '19,842.12', changePct: 1.14 },
  { symbol: 'DOW JONES', name: 'DJI', price: '44,102.31', changePct: 0.31 },
  { symbol: 'NVDA', name: 'NVIDIA', price: '218.90', changePct: 2.10 },
  { symbol: 'AAPL', name: 'Apple', price: '212.43', changePct: 1.42 },
  { symbol: 'TSLA', name: 'Tesla', price: '301.21', changePct: -1.92 },
  { symbol: 'MSFT', name: 'Microsoft', price: '521.31', changePct: 0.44 },
  { symbol: 'VIX', name: 'Volatility', price: '14.82', changePct: -4.21 },
];

const TickerMarquee: React.FC = () => {
  const itemsDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full bg-[#080A0D] border-b border-[#202630] overflow-hidden py-1.5 select-none font-mono text-xs">
      <div className="animate-marquee gap-8">
        {itemsDouble.map((item, idx) => {
          const isUp = item.changePct >= 0;
          return (
            <div key={idx} className="flex items-center gap-2 flex-shrink-0">
              <span className="font-bold text-[#E6EAF0]">{item.symbol}</span>
              <span className="text-[#8B95A5]">${item.price}</span>
              <span
                className={`inline-flex items-center gap-0.5 font-bold text-[11px] ${
                  isUp ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              >
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isUp ? '+' : ''}{item.changePct.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TickerMarquee;
