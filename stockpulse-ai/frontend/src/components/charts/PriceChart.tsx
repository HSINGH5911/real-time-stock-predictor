import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface PriceChartProps {
  ticker: string;
  currentPrice: number;
  changePercent?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ ticker, currentPrice }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '3M' | '6M' | '1Y'>('1D');
  const [showPrediction, setShowPrediction] = useState<boolean>(true);
  const [predictionColor, setPredictionColor] = useState<string>('#A855F7'); // Electric Violet
  const [sma20, setSma20] = useState<boolean>(true);
  const [sma50, setSma50] = useState<boolean>(false);
  const [bollinger, setBollinger] = useState<boolean>(false);

  const priceVal = (typeof currentPrice === 'number' && !isNaN(currentPrice) && currentPrice > 0) ? currentPrice : 218.90;

  const chartData = useMemo(() => {
    const basePrice = priceVal;
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();

    // Deterministic ticker seed so each stock has a unique chart pattern
    let seed = 0;
    for (let i = 0; i < ticker.length; i++) {
      seed = (seed << 5) - seed + ticker.charCodeAt(i);
      seed |= 0;
    }
    seed = Math.abs(seed);

    // Stock-specific waveform factors
    const freq1 = 1 + (seed % 3) * 0.7;
    const freq2 = 2 + ((seed >> 2) % 4) * 0.8;
    const phase = ((seed % 100) / 100) * Math.PI * 2;
    const volMult = 0.012 + ((seed % 15) / 1000);
    const trendDir = (seed % 2 === 0 ? 1 : -1) * 0.015;

    let pointsCount = 16;
    let labels: string[] = [];
    let currentTimeIndex = 14;

    if (timeframe === '1D') {
      pointsCount = 16;
      const startMins = 9 * 60 + 30; // 09:30 AM
      const endMins = 16 * 60;       // 04:00 PM
      const nowMins = now.getHours() * 60 + now.getMinutes();

      labels = [];
      currentTimeIndex = 0;

      for (let i = 0; i < pointsCount; i++) {
        const currentMins = startMins + Math.round((i / (pointsCount - 1)) * (endMins - startMins));
        const h = Math.floor(currentMins / 60);
        const m = currentMins % 60;
        labels.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);

        if (currentMins <= nowMins || i === 0) {
          currentTimeIndex = i;
        }
      }
      if (nowMins >= endMins) currentTimeIndex = pointsCount - 1;
      if (nowMins <= startMins) currentTimeIndex = Math.floor(pointsCount * 0.75); // Realistic active trading progress (~14:30)
    } else if (timeframe === '5D') {
      pointsCount = 6;
      labels = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (5 - i));
        return `${MONTH_NAMES[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}`;
      });
      currentTimeIndex = 4;
    } else if (timeframe === '1M') {
      pointsCount = 12;
      labels = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - Math.round((10 - i) * 3));
        return `${MONTH_NAMES[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}`;
      });
      currentTimeIndex = 10;
    } else if (timeframe === '3M') {
      pointsCount = 14;
      labels = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - Math.round((12 - i) * 7.5));
        return `${MONTH_NAMES[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}`;
      });
      currentTimeIndex = 12;
    } else if (timeframe === '6M') {
      pointsCount = 14;
      labels = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - Math.round((12 - i) * 15));
        return `${MONTH_NAMES[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}`;
      });
      currentTimeIndex = 12;
    } else {
      // 1Y
      pointsCount = 14;
      labels = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(now);
        d.setMonth(now.getMonth() - (12 - i));
        return `${MONTH_NAMES[d.getMonth()]} '${d.getFullYear().toString().slice(2)}`;
      });
      currentTimeIndex = 12;
    }

    const result = [];

    for (let i = 0; i < pointsCount; i++) {
      const isPastOrPresent = i <= currentTimeIndex;
      const progress = currentTimeIndex > 0 ? i / currentTimeIndex : 1;

      // Dynamic unique wave dynamics per ticker
      const wave1 = Math.sin(progress * Math.PI * 2 * freq1 + phase) * volMult;
      const wave2 = Math.cos(progress * Math.PI * 3 * freq2 - phase) * (volMult * 0.5);
      const wave3 = Math.sin(progress * Math.PI * 5 + seed) * (volMult * 0.25);
      const trend = (progress - 1) * trendDir;

      let ptPrice = basePrice * (1 + trend + wave1 + wave2 + wave3);
      if (i === currentTimeIndex) {
        ptPrice = basePrice; // Ensure latest historical point matches exact live price
      }

      const predProgress = i > currentTimeIndex ? (i - currentTimeIndex) / (pointsCount - 1 - currentTimeIndex || 1) : 0;
      const predDelta = (seed % 2 === 0 ? 1 : -1) * (0.008 + predProgress * 0.015);
      const predVal = isPastOrPresent
        ? ptPrice * (1 + wave3 * 0.5)
        : basePrice * (1 + predDelta + Math.sin(predProgress * Math.PI) * 0.005);

      const activeRefPrice = isPastOrPresent ? ptPrice : predVal;
      const sma20Val = activeRefPrice * (1 - 0.004 * ((seed % 3) + 1));
      const sma50Val = activeRefPrice * (1 - 0.011 * ((seed % 4) + 1));
      const bbUpper = activeRefPrice * 1.018;
      const bbLower = activeRefPrice * 0.982;

      result.push({
        time: labels[i] || `T+${i}`,
        // Historical price ONLY exists up to current time
        price: isPastOrPresent ? Number(ptPrice.toFixed(2)) : null,
        modelPred: Number(predVal.toFixed(2)),
        sma20: isPastOrPresent ? Number(sma20Val.toFixed(2)) : null,
        sma50: isPastOrPresent ? Number(sma50Val.toFixed(2)) : null,
        bbUpper: Number(bbUpper.toFixed(2)),
        bbLower: Number(bbLower.toFixed(2)),
        isFuture: !isPastOrPresent,
      });
    }

    return result;
  }, [ticker, priceVal, timeframe]);

  const validPrices = useMemo(() => chartData.map((d) => (d.price !== null ? d.price : d.modelPred)), [chartData]);
  const minPrice = useMemo(() => Math.floor(Math.min(...validPrices, ...chartData.map((d) => d.modelPred)) * 0.98), [chartData, validPrices]);
  const maxPrice = useMemo(() => Math.ceil(Math.max(...validPrices, ...chartData.map((d) => d.modelPred)) * 1.02), [chartData, validPrices]);

  return (
    <div
      className="bg-[#11161D] border border-[#202630] rounded p-4 space-y-4 font-mono text-xs"
      style={{
        backgroundColor: '#11161D',
        border: '1px solid #202630',
        borderRadius: '4px',
        padding: '16px',
        width: '100%',
      }}
    >
      {/* Header bar & controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #202630',
          paddingBottom: '12px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 700, fontSize: '12px', color: '#E6EAF0' }}>
            PRICE CHART — {ticker}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>
            ${priceVal.toFixed(2)}
          </span>
        </div>

        {/* Timeframe Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#0D1117',
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid #202630',
            fontSize: '11px',
          }}
        >
          {(['1D', '5D', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '2px 8px',
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: timeframe === tf ? '#2563EB' : 'transparent',
                color: timeframe === tf ? '#FFFFFF' : '#8B95A5',
                fontWeight: timeframe === tf ? 700 : 500,
                transition: 'all 0.15s ease',
              }}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Technical Indicator & Prediction Checkboxes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#8B95A5', fontSize: '12px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showPrediction}
              onChange={(e) => setShowPrediction(e.target.checked)}
              style={{ accentColor: predictionColor }}
            />
            <span style={{ color: showPrediction ? predictionColor : '#8B95A5', fontWeight: 700 }}>
              Prediction
            </span>
            <input
              type="color"
              value={predictionColor}
              onChange={(e) => setPredictionColor(e.target.value)}
              style={{
                width: '16px',
                height: '16px',
                border: 'none',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                padding: 0,
              }}
              title="Change Prediction Line Color"
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={sma20}
              onChange={(e) => setSma20(e.target.checked)}
              style={{ accentColor: '#38BDF8' }}
            />
            <span>SMA20</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={sma50}
              onChange={(e) => setSma50(e.target.checked)}
              style={{ accentColor: '#F59E0B' }}
            />
            <span>SMA50</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={bollinger}
              onChange={(e) => setBollinger(e.target.checked)}
              style={{ accentColor: '#8B95A5' }}
            />
            <span>Bollinger</span>
          </label>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height: '300px', minHeight: '300px', paddingTop: '8px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#202630" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#8B95A5"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#202630' }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#8B95A5"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#202630' }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1117',
                borderColor: '#202630',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#E6EAF0',
                fontFamily: 'JetBrains Mono, monospace',
              }}
              formatter={(val: any, name: any) => [
                val !== null && val !== undefined ? `$${Number(val).toFixed(2)}` : 'N/A (Future)',
                name === 'modelPred' ? 'ML Prediction' : name
              ]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#38BDF8"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              activeDot={{ r: 4, stroke: '#38BDF8', strokeWidth: 2, fill: '#0D1117' }}
              name="Price"
            />
            {showPrediction && (
              <Line
                type="monotone"
                dataKey="modelPred"
                stroke={predictionColor}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4, stroke: predictionColor, strokeWidth: 2, fill: '#0D1117' }}
                name="ML Prediction"
              />
            )}
            {sma20 && (
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#3B82F6"
                strokeDasharray="3 3"
                strokeWidth={1}
                dot={false}
                name="SMA20"
              />
            )}
            {sma50 && (
              <Line
                type="monotone"
                dataKey="sma50"
                stroke="#F59E0B"
                strokeDasharray="3 3"
                strokeWidth={1}
                dot={false}
                name="SMA50"
              />
            )}
            {bollinger && (
              <>
                <Line
                  type="monotone"
                  dataKey="bbUpper"
                  stroke="#4E5766"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  dot={false}
                  name="Upper Band"
                />
                <Line
                  type="monotone"
                  dataKey="bbLower"
                  stroke="#4E5766"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  dot={false}
                  name="Lower Band"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
