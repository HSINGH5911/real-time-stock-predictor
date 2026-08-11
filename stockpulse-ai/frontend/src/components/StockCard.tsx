import React, { useState } from 'react';
import { StockQuote, PredictionData } from '../types';
import SignalBadge from './signals/SignalBadge';
import ConfidenceBar from './signals/ConfidenceBar';
import { Star } from 'lucide-react';

interface StockCardProps {
  stock: StockQuote;
  prediction?: PredictionData | null;
  isSelected?: boolean;
  onSelect?: (ticker: string) => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (e: React.MouseEvent, ticker: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({
  stock,
  prediction,
  isSelected = false,
  onSelect,
  isWatchlisted = false,
  onToggleWatchlist,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const price = typeof stock.price === 'number' ? stock.price : parseFloat(stock.price || '0');
  const change = typeof stock.change === 'number' ? stock.change : parseFloat(stock.change || '0');
  const changePercent = typeof stock.change_percent === 'number' ? stock.change_percent : parseFloat(stock.change_percent || '0');
  const isPositive = change >= 0;

  const base = price;
  const isUp = isPositive;
  const chartPoints = [
    { time: '09:30 AM', price: Math.round((base * 0.988) * 100) / 100 },
    { time: '10:45 AM', price: Math.round((base * 0.993) * 100) / 100 },
    { time: '12:00 PM', price: Math.round((base * (isUp ? 0.991 : 1.008)) * 100) / 100 },
    { time: '01:30 PM', price: Math.round((base * (isUp ? 1.005 : 0.994)) * 100) / 100 },
    { time: '03:00 PM', price: Math.round((base * (isUp ? 1.009 : 0.991)) * 100) / 100 },
    { time: '04:00 PM', price: Math.round(base * 100) / 100 },
  ];

  const prices = chartPoints.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const midPrice = Math.round(((maxPrice + minPrice) / 2) * 100) / 100;
  const priceRange = maxPrice - minPrice || 1;

  const viewWidth = 280;
  const viewHeight = 80;
  const marginLeft = 44;
  const marginBottom = 16;
  const marginTop = 8;
  const marginRight = 8;

  const chartW = viewWidth - marginLeft - marginRight;
  const chartH = viewHeight - marginTop - marginBottom;

  const getX = (idx: number) => marginLeft + (idx / (chartPoints.length - 1)) * chartW;
  const getY = (val: number) => (marginTop + chartH) - ((val - minPrice) / priceRange) * chartH;

  const polylinePoints = chartPoints.map((p, idx) => `${getX(idx)},${getY(p.price)}`).join(' ');

  const confidencePct = prediction ? Math.round(prediction.confidence * 100) : 75;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <div
      onClick={() => onSelect && onSelect(stock.ticker)}
      className={`p-3.5 rounded border transition-colors cursor-pointer select-none font-mono ${
        isSelected
          ? 'bg-[#161C24] border-[#2563EB] border-l-4'
          : 'bg-[#11161D] border-[#202630] hover:border-[#38BDF8]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#202630]">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-[#E6EAF0]">{stock.ticker}</span>
          <SignalBadge signal={prediction?.prediction || (isPositive ? 'BULLISH' : 'BEARISH')} size="sm" />
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleWatchlist && (
            <button
              onClick={(e) => onToggleWatchlist(e, stock.ticker)}
              className="p-1 text-[#8B95A5] hover:text-[#F59E0B] transition-colors"
            >
              <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-[#F59E0B] text-[#F59E0B]' : ''}`} />
            </button>
          )}
          <ConfidenceBar confidence={confidencePct} showPercent={true} />
        </div>
      </div>

      {/* Quote Summary */}
      <div className="mt-2.5 flex items-baseline justify-between">
        <div>
          <div className="text-lg font-bold text-[#E6EAF0]">
            ${price.toFixed(2)}
          </div>
          <div className={`text-xs font-semibold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </div>
        </div>

        <div className="text-right text-[10px] text-[#8B95A5]">
          <div>H: <strong className="text-[#10B981]">${maxPrice.toFixed(2)}</strong></div>
          <div>L: <strong className="text-[#EF4444]">${minPrice.toFixed(2)}</strong></div>
        </div>
      </div>

      {/* SVG Price Chart */}
      <div className="mt-3 bg-[#0D1117] p-2 rounded border border-[#202630]">
        {hoveredIdx !== null && (
          <div className="text-[10px] text-[#38BDF8] font-bold text-center mb-1">
            {chartPoints[hoveredIdx].time}: ${chartPoints[hoveredIdx].price.toFixed(2)}
          </div>
        )}

        <div className="w-full h-20 relative">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
            <line x1={marginLeft} y1={getY(maxPrice)} x2={viewWidth - marginRight} y2={getY(maxPrice)} stroke="#202630" strokeDasharray="2 2" />
            <line x1={marginLeft} y1={getY(midPrice)} x2={viewWidth - marginRight} y2={getY(midPrice)} stroke="#202630" strokeDasharray="2 2" />
            <line x1={marginLeft} y1={getY(minPrice)} x2={viewWidth - marginRight} y2={getY(minPrice)} stroke="#202630" strokeDasharray="2 2" />

            <text x={marginLeft - 4} y={getY(maxPrice) + 3} fill="#10B981" fontSize="8" textAnchor="end" fontFamily="monospace">
              ${maxPrice.toFixed(2)}
            </text>
            <text x={marginLeft - 4} y={getY(midPrice) + 3} fill="#8B95A5" fontSize="8" textAnchor="end" fontFamily="monospace">
              ${midPrice.toFixed(2)}
            </text>
            <text x={marginLeft - 4} y={getY(minPrice) + 3} fill="#EF4444" fontSize="8" textAnchor="end" fontFamily="monospace">
              ${minPrice.toFixed(2)}
            </text>

            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />

            {chartPoints.map((p, idx) => {
              const xPos = getX(idx);
              return (
                <circle
                  key={idx}
                  cx={xPos}
                  cy={getY(p.price)}
                  r={hoveredIdx === idx ? 4 : 2}
                  fill={hoveredIdx === idx ? '#FFF' : strokeColor}
                  stroke={strokeColor}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
