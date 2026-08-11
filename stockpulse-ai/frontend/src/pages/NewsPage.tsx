import React, { useState, useEffect } from 'react';
import NewsFeed from '../components/news/NewsFeed';
import { getNews } from '../services/api';
import { NewsArticle } from '../types';
import { Search } from 'lucide-react';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getNews().then((n) => setNews(n));
  }, []);

  const filtered = news.filter(
    (item) =>
      item.headline.toLowerCase().includes(search.toLowerCase()) ||
      item.ticker.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-[#11161D] border border-[#202630] rounded p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold text-[#8B95A5] uppercase tracking-wider font-sans">
            NEWS INTELLIGENCE
          </h2>
          <p className="text-[11px] text-[#8B95A5] font-mono mt-0.5">
            Real-Time Financial NLP Sentiment Processing Engine
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8B95A5] absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search news by ticker or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1 bg-[#0D1117] border border-[#202630] rounded text-xs font-mono text-[#E6EAF0] focus:outline-none w-64 md:w-80"
          />
        </div>
      </div>

      {/* Main News Feed */}
      <NewsFeed articles={filtered} showDistribution={true} />
    </div>
  );
};

export default NewsPage;
