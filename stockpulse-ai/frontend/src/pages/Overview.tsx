import React, { useState, useEffect } from 'react';
import MarketOverview from '../components/market/MarketOverview';
import SignalMonitor from '../components/market/SignalMonitor';
import MarketIntelligence from '../components/market/MarketIntelligence';
import PriceChart from '../components/charts/PriceChart';
import NewsFeed from '../components/news/NewsFeed';
import { getMarket, getNews, getPrediction } from '../services/api';
import { StockQuote, NewsArticle, PredictionData } from '../types';

const Overview: React.FC = () => {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);

  useEffect(() => {
    const loadOverviewData = async () => {
      const [mList, nList] = await Promise.all([getMarket(), getNews()]);
      if (mList && mList.length > 0) setStocks(mList);
      if (nList && nList.length > 0) setNews(nList);
    };
    loadOverviewData();
  }, []);

  useEffect(() => {
    if (selectedTicker) {
      getPrediction(selectedTicker).then((p) => {
        if (p) setPrediction(p);
      });
    }
  }, [selectedTicker]);

  const selectedStock = stocks.find((s) => s.ticker === selectedTicker) || stocks[0] || {
    ticker: 'AAPL',
    price: 212.43,
    change: 3.01,
    change_percent: 1.42,
    open: 209.42,
    high: 213.80,
    low: 208.90,
    close: 212.43,
    prev_close: 209.42,
    volume: 42100000,
    timestamp: new Date().toISOString(),
  };

  const priceNum = Number(selectedStock.price) || 212.43;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      {/* Section 1: Market Overview */}
      <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <MarketOverview stocks={stocks} />
      </div>

      {/* Section 2: Interactive Security Focus Switcher Bar */}
      <div
        style={{
          backgroundColor: '#11161D',
          border: '1px solid #202630',
          borderRadius: '4px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#8B95A5',
              textTransform: 'uppercase',
              fontFamily: 'Geist, Inter, sans-serif',
            }}
          >
            ACTIVE SECURITY FOCUS SWITCHER
          </span>
          <span style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace' }}>
            Selected: {selectedTicker}
          </span>
        </div>

        {/* Ticker Selector Chips Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
          {stocks.map((st) => {
            const isSelected = st.ticker === selectedTicker;
            const changePct = Number(st.change_percent);
            const isPos = changePct >= 0;

            return (
              <button
                key={st.ticker}
                onClick={() => setSelectedTicker(st.ticker)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: isSelected ? '1px solid #2563EB' : '1px solid #202630',
                  backgroundColor: isSelected ? '#0D1117' : 'transparent',
                  color: isSelected ? '#FFFFFF' : '#8B95A5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontWeight: 700, color: isSelected ? '#FFFFFF' : '#E6EAF0' }}>{st.ticker}</span>
                <span style={{ fontSize: '10px', color: isSelected ? '#38BDF8' : '#8B95A5' }}>${Number(st.price).toFixed(2)}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: isPos ? '#10B981' : '#EF4444' }}>
                  {isPos ? '+' : ''}{changePct.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Signal Monitor Table */}
      <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'auto' }}>
        <SignalMonitor
          stocks={stocks}
          selectedTicker={selectedTicker}
          onSelectTicker={(t) => setSelectedTicker(t)}
        />
      </div>

      {/* Section 4 & 5: Sub-grid: Interactive Market Chart & Market Intelligence Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px', width: '100%', maxWidth: '100%' }}>
        <div style={{ minWidth: 0, maxWidth: '100%', overflowX: 'hidden' }}>
          <PriceChart ticker={selectedTicker} currentPrice={priceNum} />
        </div>
        <div style={{ minWidth: 0, maxWidth: '100%', overflowX: 'hidden' }}>
          <MarketIntelligence selectedStock={selectedStock as any} prediction={prediction} articles={news} />
        </div>
      </div>

      {/* Section 6: News Flow Feed */}
      <div style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
        <NewsFeed articles={news} showDistribution={true} />
      </div>
    </div>
  );
};

export default Overview;
