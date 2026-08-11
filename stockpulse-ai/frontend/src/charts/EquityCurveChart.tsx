import React from 'react';
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
import { BacktestReport } from '../types';

interface EquityCurveChartProps {
  backtest: BacktestReport | null;
}

const EquityCurveChart: React.FC<EquityCurveChartProps> = () => {
  const data = [
    { date: 'Jan 25', strategy: 10000, benchmark: 10000 },
    { date: 'Mar 25', strategy: 10320, benchmark: 10150 },
    { date: 'May 25', strategy: 10580, benchmark: 10300 },
    { date: 'Jul 25', strategy: 10840, benchmark: 10450 },
    { date: 'Sep 25', strategy: 10790, benchmark: 10380 },
    { date: 'Nov 25', strategy: 11150, benchmark: 10620 },
    { date: 'Jan 26', strategy: 11380, benchmark: 10800 },
    { date: 'Mar 26', strategy: 11290, benchmark: 10720 },
    { date: 'May 26', strategy: 11620, benchmark: 10980 },
    { date: 'Jul 26', strategy: 11750, benchmark: 11120 },
    { date: 'Aug 26', strategy: 11842, benchmark: 11231 },
  ];

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[#202630] pb-2">
        <h4 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
          CUMULATIVE PORTFOLIO EQUITY CURVE ($)
        </h4>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-[#10B981]">Strategy +18.42%</span>
          <span className="text-[#38BDF8]">Benchmark +12.31%</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#202630" vertical={false} />
            <XAxis dataKey="date" stroke="#8B95A5" fontSize={10} tickLine={false} axisLine={{ stroke: '#202630' }} />
            <YAxis domain={[9500, 12500]} stroke="#8B95A5" fontSize={10} tickLine={false} axisLine={{ stroke: '#202630' }} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1117', borderColor: '#202630', borderRadius: '4px', fontSize: '11px', color: '#E6EAF0' }}
              formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
            />
            <Legend verticalAlign="top" align="right" height={24} formatter={(val) => <span className="text-[11px] text-[#8B95A5]">{val}</span>} />
            <Line type="monotone" dataKey="strategy" stroke="#10B981" strokeWidth={2} dot={false} name="Strategy ($)" />
            <Line type="monotone" dataKey="benchmark" stroke="#38BDF8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Benchmark ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquityCurveChart;
