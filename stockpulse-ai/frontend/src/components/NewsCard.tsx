import React from 'react';
import { NewsArticle } from '../types';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const sentimentScore = (article as any).sentiment_score ?? 0.74;
  const scoreStr = sentimentScore > 0 ? `+${sentimentScore.toFixed(2)}` : sentimentScore.toFixed(2);
  const isPos = sentimentScore >= 0;

  return (
    <a
      href={article.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        padding: '14px',
        backgroundColor: '#0D1117',
        border: '1px solid #202630',
        borderRadius: '4px',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Primary Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <h5
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#E6EAF0',
            lineHeight: '1.4',
            margin: 0,
            fontFamily: 'Geist, Inter, sans-serif',
          }}
        >
          {article.headline}
        </h5>
        <ExternalLink style={{ width: '14px', height: '14px', color: '#8B95A5', flexShrink: 0, marginTop: '2px' }} />
      </div>

      {article.summary && (
        <p
          style={{
            fontSize: '11px',
            color: '#8B95A5',
            marginTop: '6px',
            marginBottom: 0,
            lineHeight: '1.5',
            fontFamily: 'Geist, Inter, sans-serif',
          }}
        >
          {article.summary}
        </p>
      )}

      {/* Secondary Source & Sentiment */}
      <div
        style={{
          marginTop: '10px',
          paddingTop: '8px',
          borderTop: '1px solid #202630',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
          color: '#8B95A5',
        }}
      >
        <span>
          {article.source} · {article.timestamp || '2h ago'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#8B95A5', fontFamily: 'Geist, Inter, sans-serif' }}>SENTIMENT</span>
          <span style={{ fontWeight: 700, color: isPos ? '#10B981' : '#EF4444' }}>
            {scoreStr}
          </span>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
