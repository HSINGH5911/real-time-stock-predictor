import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SignalBadge from '../components/signals/SignalBadge';
import ConfidenceBar from '../components/signals/ConfidenceBar';
import PriceChart from '../components/charts/PriceChart';
import TechnicalSignals from '../components/ml/TechnicalSignals';
import ModelAnalysis from '../components/ml/ModelAnalysis';
import NewsFeed from '../components/news/NewsFeed';
import PredictionHistoryTable from '../components/ml/PredictionHistoryTable';
import { getStock, getNews, getPrediction } from '../services/api';
import { StockQuote, NewsArticle, PredictionData } from '../types';

const StockDetail: React.FC = () => {
  const { ticker: rawTicker } = useParams<{ ticker: string }>();
  const ticker = (rawTicker || 'AAPL').toUpperCase();

  const [stock, setStock] = useState<StockQuote | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const [sData, nData, pData] = await Promise.all([
        getStock(ticker),
        getNews(ticker),
        getPrediction(ticker),
      ]);
      if (sData) setStock(sData);
      if (nData) setNews(nData);
      if (pData) setPrediction(pData);
    };
    fetchDetails();
  }, [ticker]);

  const currentPrice = Number(stock?.price) || 212.43;
  const changeVal = stock?.change ? String(stock.change) : '+3.01';
  const changePct = stock?.change_percent ? String(stock.change_percent) : '+1.42';
  const isPos = !changePct.startsWith('-');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#11161D',
          border: '1px solid #202630',
          borderRadius: '4px',
          padding: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          maxWidth: '100%',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#E6EAF0', fontFamily: 'JetBrains Mono, monospace' }}>{ticker}</span>
            <span style={{ fontSize: '12px', color: '#8B95A5', fontFamily: 'Geist, Inter, sans-serif' }}>
              {ticker === 'AAPL' ? 'Apple Inc.' : ticker === 'NVDA' ? 'NVIDIA Corporation' : ticker === 'MSFT' ? 'Microsoft Corporation' : ticker === 'TSLA' ? 'Tesla Inc.' : 'Equity Asset'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#E6EAF0' }}>${currentPrice.toFixed(2)}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: isPos ? '#10B981' : '#EF4444' }}>
              {changeVal} ({changePct}%)
            </span>
          </div>
        </div>

        {/* Model Signal Badge & Target Horizon */}
        <div
          style={{
            backgroundColor: '#0D1117',
            border: '1px solid #202630',
            borderRadius: '4px',
            padding: '12px 16px',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#8B95A5',
              textTransform: 'uppercase',
              fontFamily: 'Geist, Inter, sans-serif',
            }}
          >
            MODEL SIGNAL
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <SignalBadge signal={prediction?.prediction || 'BULLISH'} />
            <ConfidenceBar confidence={prediction?.confidence || 0.842} />
          </div>
          <div style={{ fontSize: '10px', color: '#4E5766' }}>
            Predicted direction · Next trading session
          </div>
        </div>
      </div>

      {/* Main Stock Chart */}
      <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <PriceChart ticker={ticker} currentPrice={currentPrice} />
      </div>

      {/* Technical Signal Panel */}
      <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <TechnicalSignals />
      </div>

      {/* Grid: Model Analysis & Sentiment News Flow */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px', width: '100%', maxWidth: '100%' }}>
        <div style={{ minWidth: 0, maxWidth: '100%' }}>
          <ModelAnalysis prediction={prediction} />
        </div>
        <div style={{ minWidth: 0, maxWidth: '100%' }}>
          <NewsFeed articles={news} showDistribution={true} />
        </div>
      </div>

      {/* Prediction History Table */}
      <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'auto' }}>
        <PredictionHistoryTable ticker={ticker} />
      </div>
    </div>
  );
};

export default StockDetail;
