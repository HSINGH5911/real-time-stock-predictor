import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface SentimentDistributionProps {
  positivePct?: number;
  neutralPct?: number;
  negativePct?: number;
  totalArticles?: number;
}

const SentimentDistributionChart: React.FC<SentimentDistributionProps> = ({
  positivePct = 75,
  neutralPct = 17,
  negativePct = 8,
  totalArticles = 24,
}) => {
  const data = [
    { name: 'Bullish (Positive)', value: positivePct, color: '#10B981' },
    { name: 'Neutral', value: neutralPct, color: '#3B82F6' },
    { name: 'Bearish (Negative)', value: negativePct, color: '#EF4444' },
  ];

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#202630]">
        <h4 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
          FINBERT SENTIMENT SHARE
        </h4>
        <span className="text-[11px] text-[#8B95A5]">{totalArticles} Articles Ingested</span>
      </div>

      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0D1117" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1117',
                borderColor: '#202630',
                borderRadius: '4px',
                color: '#E6EAF0',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
              formatter={(val: any) => [`${val}%`, 'Share']}
            />
            <Legend
              verticalAlign="bottom"
              height={30}
              iconType="circle"
              formatter={(value) => <span className="text-[11px] text-[#8B95A5]">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-7">
          <span className="text-base font-bold text-[#E6EAF0] block">{positivePct}%</span>
          <span className="text-[9px] text-[#10B981] font-bold uppercase block">Bullish</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentDistributionChart;
