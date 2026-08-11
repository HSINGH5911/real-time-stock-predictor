import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Layers } from 'lucide-react';

const AVAILABLE_TICKERS = [
  'AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN',
  'META', 'TSLA', 'BRK-B', 'AVGO', 'LLY',
  'WMT', 'JPM', 'V', 'UNH', 'XOM',
  'ORCL', 'MA', 'COST', 'HD', 'PG'
];

const TICKER_COLORS: Record<string, string> = {
  AAPL: '#38BDF8',
  NVDA: '#10B981',
  MSFT: '#3B82F6',
  GOOGL: '#F59E0B',
  AMZN: '#8B5CF6',
  META: '#EC4899',
  TSLA: '#EF4444',
  'BRK-B': '#6366F1',
  AVGO: '#14B8A6',
  LLY: '#F97316',
  WMT: '#84CC16',
  JPM: '#06B6D4',
  V: '#A855F7',
  UNH: '#10B981',
  XOM: '#EAB308',
  ORCL: '#F43F5E',
  MA: '#64748B',
  COST: '#38BDF8',
  HD: '#FB923C',
  PG: '#818CF8'
};

const StockComparerChart: React.FC = () => {
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['AAPL', 'NVDA', 'TSLA']);

  const generateComparisonData = () => {
    const dates = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
    return dates.map((d, idx) => {
      const point: Record<string, any> = { date: d };
      selectedTickers.forEach((t) => {
        let baseChange = 0;
        if (t === 'NVDA') baseChange = (idx * 2.8) + (idx % 2 === 0 ? 1.5 : -0.8);
        else if (t === 'AAPL') baseChange = (idx * 0.9) + (idx % 3 === 0 ? 0.8 : -0.4);
        else if (t === 'TSLA') baseChange = (idx * 1.8) - (idx % 2 === 1 ? 2.1 : -1.2);
        else if (t === 'MSFT') baseChange = (idx * 1.2) + (idx % 2 === 0 ? 0.4 : -0.2);
        else baseChange = (idx * 1.4) + (idx % 3 === 1 ? 1.1 : -0.6);

        point[t] = Math.round(baseChange * 100) / 100;
      });
      return point;
    });
  };

  const toggleTicker = (ticker: string) => {
    if (selectedTickers.includes(ticker)) {
      if (selectedTickers.length > 1) {
        setSelectedTickers(selectedTickers.filter((t) => t !== ticker));
      }
    } else {
      setSelectedTickers([...selectedTickers, ticker]);
    }
  };

  const chartData = generateComparisonData();

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[#202630] pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
            MULTI-ASSET RETURN COMPARISON
          </h3>
        </div>

        {/* Ticker chips */}
        <div className="flex items-center gap-1.5">
          {AVAILABLE_TICKERS.map((ticker) => {
            const isSelected = selectedTickers.includes(ticker);
            const color = TICKER_COLORS[ticker] || '#38BDF8';
            return (
              <button
                key={ticker}
                onClick={() => toggleTicker(ticker)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                  isSelected ? 'bg-[#0D1117] text-[#E6EAF0]' : 'bg-transparent text-[#8B95A5] border-transparent'
                }`}
                style={{ borderColor: isSelected ? color : 'transparent' }}
              >
                {ticker}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#202630" vertical={false} />
            <XAxis dataKey="date" stroke="#8B95A5" fontSize={10} tickLine={false} axisLine={{ stroke: '#202630' }} />
            <YAxis stroke="#8B95A5" fontSize={10} tickLine={false} axisLine={{ stroke: '#202630' }} tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1117', borderColor: '#202630', borderRadius: '4px', fontSize: '11px', color: '#E6EAF0' }}
              formatter={(val: any, name: any) => [`${val > 0 ? '+' : ''}${val}%`, name]}
            />
            <Legend verticalAlign="top" align="right" height={24} formatter={(val) => <span className="text-[11px] text-[#8B95A5]">{val}</span>} />

            {selectedTickers.map((ticker) => (
              <Line
                key={ticker}
                type="monotone"
                dataKey={ticker}
                stroke={TICKER_COLORS[ticker] || '#38BDF8'}
                strokeWidth={1.75}
                dot={false}
                name={`${ticker} %`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockComparerChart;
