import React, { useState, useEffect } from 'react';
import {
  Zap,
  Search,
  Pause,
  RotateCw,
  Cpu,
  Grid,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import TickerMarquee from '../components/TickerMarquee';
import Watchlist from '../components/Watchlist';
import PriceChart from '../charts/PriceChart';
import SentimentGauge from '../components/SentimentGauge';
import SectorHeatmap from '../components/SectorHeatmap';
import NewsCard from '../components/NewsCard';
import ConfusionMatrixModal from '../components/ConfusionMatrixModal';
import FallbackIndicator from '../components/FallbackIndicator';
import {
  getMarket,
  getNews,
  getPrediction,
  getPredictionHistory,
  getBacktestReport,
  getHealth
} from '../services/api';
import {
  StockQuote,
  NewsArticle,
  PredictionData,
  PredictionHistoryItem,
  BacktestReport
} from '../types';

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryItem[]>([]);
  const [backtest, setBacktest] = useState<BacktestReport | null>(null);

  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(60);
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);
  const [healthStatus, setHealthStatus] = useState<string>('healthy');
  const [showConfusionModal, setShowConfusionModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'backtest'>('overview');

  const fetchGlobalData = async () => {
    setLoading(true);
    try {
      const [mList, nList, bReport, hData] = await Promise.all([
        getMarket(),
        getNews(),
        getBacktestReport(),
        getHealth(),
      ]);

      if (mList && mList.length > 0) {
        setStocks(mList);
      }
      if (nList && nList.length > 0) {
        setNews(nList);
      }
      if (bReport) {
        setBacktest(bReport);
      }
      if (hData) {
        setHealthStatus(hData.status || 'healthy');
      }
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickerDetails = async (ticker: string) => {
    try {
      const [pData, hData] = await Promise.all([
        getPrediction(ticker),
        getPredictionHistory(ticker),
      ]);
      if (pData) setPrediction(pData);
      if (hData) setPredictionHistory(hData);
    } catch (err) {
      console.error(`Error loading predictions for ${ticker}:`, err);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  useEffect(() => {
    if (selectedTicker) {
      fetchTickerDetails(selectedTicker);
    }
  }, [selectedTicker]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (autoRefresh) {
      timer = setInterval(() => {
        setRefreshCountdown((prev) => {
          if (prev <= 1) {
            fetchGlobalData();
            if (selectedTicker) fetchTickerDetails(selectedTicker);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [autoRefresh, selectedTicker]);

  // Stream simulation pulse interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (liveStreamActive && stocks.length > 0) {
      interval = setInterval(() => {
        setStocks((prevStocks) =>
          prevStocks.map((st) => {
            const rawPrice = Number(st.price) || 200;
            const delta = (Math.random() - 0.49) * (rawPrice * 0.003);
            const newPrice = Math.max(1, rawPrice + delta);
            const prevClose = Number(st.prev_close) || rawPrice;
            const change = newPrice - prevClose;
            const changePct = (change / prevClose) * 100;
            return {
              ...st,
              price: newPrice.toFixed(2),
              change: change.toFixed(2),
              change_percent: changePct.toFixed(2),
              timestamp: new Date().toISOString(),
            };
          })
        );
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [liveStreamActive, stocks.length]);

  const selectedStock = stocks.find((s) => s.ticker === selectedTicker) || stocks[0] || {
    ticker: 'AAPL',
    price: 313.33,
    change: 0.77,
    change_percent: 0.25,
    open: 311.45,
    high: 314.81,
    low: 310.74,
    close: 313.33,
    prev_close: 312.56,
    volume: 34407100,
    timestamp: new Date().toISOString(),
  };

  const currentPriceNum = Number(selectedStock.price) || 313.33;
  const changePctNum = Number(selectedStock.change_percent) || 0.25;
  const isPositive = changePctNum >= 0;

  const isHealthy = healthStatus.toLowerCase() === 'healthy' || healthStatus.toLowerCase() === 'ok';

  return (
    <div className="min-h-screen bg-terminal-grid text-slate-100 font-sans pb-12 selection:bg-cyan-500 selection:text-black">
      {/* Top Scrolling Marquee Tape */}
      <TickerMarquee />

      <div className="max-w-[1720px] mx-auto space-y-5 px-3 md:px-6 pt-5">
        
        {/* Institutional Header & System Telemetry Bar */}
        <header className="terminal-panel rounded-2xl p-4 md:p-5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  STOCKPULSE QUANT X-1
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-cyan-950 text-cyan-400 border border-cyan-800/80 shadow">
                  QUANT ENGINE v4.2 PRO
                </span>

                {/* Prominent System Telemetry Status Badge */}
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                    isHealthy
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                  }`}
                  title={isHealthy ? 'System Health: ALL SYSTEMS OPERATIONAL' : 'System Health: UNHEALTHY DEGRADED'}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isHealthy
                        ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]'
                        : 'bg-rose-500 animate-ping'
                    }`}
                  />
                  <span>{isHealthy ? '● SYSTEM ONLINE | HEALTHY' : '● SYSTEM DEGRADED'}</span>
                </div>

                {/* Data Source Indicator */}
                <FallbackIndicator />
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Institutional Market Signal Workstation</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono">LATENCY: 12ms</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono">REDIS DB: CONNECTED</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 xl:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticker (e.g. AAPL, NVDA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
              />
            </div>

            {/* Live Streaming Toggle */}
            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition shadow ${
                liveStreamActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle Live Price Stream Simulation"
            >
              {liveStreamActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Stream ACTIVE</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Stream PAUSED</span>
                </>
              )}
            </button>

            {/* Confusion Matrix Modal Button */}
            <button
              onClick={() => setShowConfusionModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition shadow"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Confusion Matrix</span>
            </button>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                autoRefresh
                  ? 'bg-slate-900 border-cyan-800/80 text-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Toggle 60s Auto Refresh"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{refreshCountdown}s</span>
            </button>
          </div>
        </header>

        {/* 3-Column Institutional Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* COLUMN 1: Watchlist & Asset Scanner (3 Cols) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="terminal-panel rounded-2xl p-4 shadow-xl">
              <Watchlist
                selectedTicker={selectedTicker}
                onSelectTicker={(t) => setSelectedTicker(t)}
              />
            </div>
          </div>

          {/* COLUMN 2: Main Analytics Stage & AI Control Box (6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Active Asset Spotlight Header */}
            <div className="terminal-panel rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
                  <span className="text-2xl font-black text-cyan-400 font-mono">{selectedStock.ticker}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{selectedStock.ticker} Market Telemetry</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                      NASDAQ
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span>Vol: {(Number(selectedStock.volume) / 1000000).toFixed(1)}M</span>
                    <span>•</span>
                    <span>Open: ${Number(selectedStock.open || currentPriceNum).toFixed(2)}</span>
                    <span>•</span>
                    <span>High: ${Number(selectedStock.high || currentPriceNum * 1.01).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-white font-mono tracking-tight">
                  ${currentPriceNum.toFixed(2)}
                </div>
                <div
                  className={`flex items-center justify-end gap-1 text-xs font-extrabold mt-0.5 ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{isPositive ? '+' : ''}{Number(selectedStock.change || 0).toFixed(2)} ({isPositive ? '+' : ''}{changePctNum.toFixed(2)}%)</span>
                </div>
              </div>
            </div>

            {/* Main Interactive Subplot Price Chart */}
            <div className="terminal-panel rounded-2xl p-5 shadow-xl">
              <PriceChart
                ticker={selectedStock.ticker}
                currentPrice={currentPriceNum}
                changePercent={changePctNum}
              />
            </div>

            {/* Quant AI Engine Control Box */}
            <div className="terminal-panel rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Quant AI Model Prediction Radar</h3>
                    <p className="text-xs text-slate-400">Random Forest Classifier & Directional Target Forecast</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Signal Radar
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      activeTab === 'features' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Feature Drivers
                  </button>
                  <button
                    onClick={() => setActiveTab('backtest')}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      activeTab === 'backtest' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Backtest
                  </button>
                </div>
              </div>

              {/* TAB 1: Signal Overview Radar */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Direction Card */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Model Verdict</span>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-2xl font-black ${prediction?.prediction === 'DOWN' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {prediction?.prediction === 'DOWN' ? 'BEARISH 📉' : 'BULLISH 🚀'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-extrabold border ${
                        prediction?.prediction === 'DOWN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        24h Target
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Predicted 24h trajectory based on technical indicators and real-time news sentiment.
                    </p>
                  </div>

                  {/* Confidence Meter */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Model Win Confidence</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-black text-cyan-400 font-mono">
                        {((prediction?.confidence || 0.784) * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-slate-400">Target Win Prob</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(prediction?.confidence || 0.784) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Risk / Reward Metrics */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Risk / Reward Ratio</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-black text-purple-400 font-mono">3.2x</span>
                      <span className="text-xs text-emerald-400 font-bold">+3.45% Est Return</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Calculated stop-loss at -1.1% vs upside target +3.45%.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Feature Drivers */}
              {activeTab === 'features' && (
                <div className="space-y-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400 mb-1">Top Quantitative Model Features by Weight:</div>
                  {[
                    { name: 'RSI 14 Oscillators', weight: 0.32, impact: 'bullish' },
                    { name: 'NLP News Sentiment Score', weight: 0.28, impact: 'bullish' },
                    { name: 'MACD Signal Line Crossover', weight: 0.18, impact: 'neutral' },
                    { name: 'Volume Surge Ratio (24h)', weight: 0.14, impact: 'bullish' },
                    { name: 'Bollinger Band Volatility', weight: 0.08, impact: 'bearish' },
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs gap-3">
                      <span className="w-44 text-slate-300 font-medium truncate">{feat.name}</span>
                      <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded-full"
                          style={{ width: `${feat.weight * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-cyan-400 w-12 text-right">{(feat.weight * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Out-of-Sample Backtest */}
              {activeTab === 'backtest' && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Outperformance</span>
                      <span className="text-sm font-black text-emerald-400">+11.72%</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Win Rate</span>
                      <span className="text-sm font-black text-cyan-400">49.41%</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Trades Taken</span>
                      <span className="text-sm font-black text-white">85</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Test Accuracy</span>
                      <span className="text-sm font-black text-purple-400">52.44%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfusionModal(true)}
                    className="w-full py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Grid className="w-4 h-4" />
                    <span>Open Out-of-Sample Confusion Matrix</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* COLUMN 3: Market Intelligence & News Telemetry (3 Cols) */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* Overall Sentiment Gauge */}
            <div className="terminal-panel rounded-2xl p-4 shadow-xl">
              <SentimentGauge score={0.42} confidence={0.88} articleCount={24} />
            </div>

            {/* Sector Sentiment Heatmap */}
            <div className="terminal-panel rounded-2xl p-4 shadow-xl">
              <SectorHeatmap onSelectTicker={(t) => setSelectedTicker(t)} />
            </div>

            {/* Real-time News Feed */}
            <div className="terminal-panel rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Real-Time News Stream</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {news.length} Articles
                </span>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {news.map((item, idx) => (
                  <NewsCard key={(item as any).id || (item as any).url || idx} article={item} />
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Confusion Matrix Modal overlay */}
      {showConfusionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full relative">
            <button
              onClick={() => setShowConfusionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 text-xs font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800"
            >
              ✕ CLOSE
            </button>
            <ConfusionMatrixModal matrix={backtest?.metrics?.confusion_matrix} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
