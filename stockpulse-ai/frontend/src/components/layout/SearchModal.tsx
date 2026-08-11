import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { DEFAULT_STOCKS } from '../../services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          const btn = document.querySelector('button[title="search-trigger"]');
          if (btn) (btn as HTMLButtonElement).click();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStocks = DEFAULT_STOCKS.filter(
    (s) =>
      s.ticker.toLowerCase().includes(query.toLowerCase()) ||
      s.price.toString().includes(query)
  );

  const handleSelect = (ticker: string) => {
    navigate(`/markets/${ticker}`);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#0D1117',
          border: '1px solid #202630',
          borderRadius: '6px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Input Header Bar */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #202630',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#0D1117',
          }}
        >
          <Search style={{ width: '16px', height: '16px', color: '#8B95A5' }} />
          <input
            type="text"
            autoFocus
            placeholder="Type security symbol (e.g. AAPL, NVDA, TSLA)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#E6EAF0',
              fontSize: '13px',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          />
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#8B95A5',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '3px',
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Search Results List */}
        <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px 0' }}>
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock) => {
              const isPos = !stock.change_percent.toString().startsWith('-');
              return (
                <div
                  key={stock.ticker}
                  onClick={() => handleSelect(stock.ticker)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderBottom: '1px solid #161C24',
                    cursor: 'pointer',
                    backgroundColor: '#0D1117',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#11161D')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0D1117')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        backgroundColor: '#161C24',
                        border: '1px solid #202630',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '12px',
                        color: '#E6EAF0',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {stock.ticker.slice(0, 3)}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '12px', color: '#E6EAF0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{stock.ticker}</span>
                        <span style={{ fontSize: '10px', color: '#8B95A5', fontWeight: 400, fontFamily: 'Geist, Inter, sans-serif' }}>EQUITY</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8B95A5', fontFamily: 'JetBrains Mono, monospace' }}>
                        Vol: {(Number(stock.volume) / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#E6EAF0' }}>${stock.price}</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 600, color: isPos ? '#10B981' : '#EF4444' }}>
                        {isPos ? '+' : ''}{stock.change_percent}%
                      </div>
                    </div>
                    <ArrowRight style={{ width: '14px', height: '14px', color: '#8B95A5' }} />
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: '12px', color: '#8B95A5', fontFamily: 'JetBrains Mono, monospace' }}>
              No matching securities found for "{query}"
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#080A0D',
            borderTop: '1px solid #202630',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#8B95A5',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <span>Press ESC to close</span>
          <span>Select ticker to view research</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
