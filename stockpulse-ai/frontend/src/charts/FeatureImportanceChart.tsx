import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';

interface FeatureImportanceProps {
  featureMap?: Record<string, number>;
}

const DEFAULT_FEATURES = [
  { feature: 'FinBERT Sentiment Score', weight: 31 },
  { feature: 'Volume Acceleration Ratio', weight: 24 },
  { feature: 'RSI-14 Momentum', weight: 18 },
  { feature: 'MACD Signal Divergence', weight: 14 },
  { feature: '10-Day Historical Volatility', weight: 9 },
  { feature: '24h News Article Volume', weight: 4 },
];

const COLORS = ['#10B981', '#38BDF8', '#3B82F6', '#38BDF8', '#8B95A5', '#4E5766'];

const FeatureImportanceChart: React.FC<FeatureImportanceProps> = ({ featureMap }) => {
  const chartData = featureMap
    ? Object.entries(featureMap).map(([k, v]) => ({
        feature: k,
        weight: Math.round(v * 100),
      }))
    : DEFAULT_FEATURES;

  return (
    <div className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#202630]">
        <h4 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
          FEATURE IMPORTANCE WEIGHTS (%)
        </h4>
        <span className="text-[11px] text-[#38BDF8]">Gini Impurity Reduction</span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 20, left: 140, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#202630" horizontal={false} />
            <XAxis type="number" stroke="#8B95A5" fontSize={10} tickFormatter={(v) => `${v}%`} axisLine={{ stroke: '#202630' }} />
            <YAxis type="category" dataKey="feature" stroke="#E6EAF0" fontSize={10} tickLine={false} width={135} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D1117', borderColor: '#202630', borderRadius: '4px', fontSize: '11px', color: '#E6EAF0' }}
              formatter={(val: any) => [`${val}%`, 'Weight']}
            />
            <Bar dataKey="weight" radius={[0, 3, 3, 0]} barSize={14}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeatureImportanceChart;
