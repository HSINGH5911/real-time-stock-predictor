import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Radio,
  Newspaper,
  Cpu,
  LineChart,
  SlidersHorizontal,
  Server,
  Settings,
  ShieldCheck
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navGroups = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Overview', path: '/', icon: LayoutDashboard },
        { label: 'Markets', path: '/markets', icon: TrendingUp },
        { label: 'Signals', path: '/signals', icon: Radio },
        { label: 'News', path: '/news', icon: Newspaper },
      ]
    },
    {
      title: 'RESEARCH',
      items: [
        { label: 'Models', path: '/research/models', icon: Cpu },
        { label: 'Backtesting', path: '/research/backtests', icon: LineChart },
        { label: 'Features', path: '/research/features', icon: SlidersHorizontal },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Infrastructure', path: '/system', icon: Server },
        { label: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside
      className="w-60 xl:w-64 bg-[#080A0D] border-r border-[#202630] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none"
      style={{
        width: '250px',
        minWidth: '250px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        backgroundColor: '#080A0D',
        borderRight: '1px solid #202630',
        zIndex: 30,
        userSelect: 'none',
      }}
    >
      <div>
        {/* Brand Header */}
        <div
          className="h-14 px-5 border-b border-[#202630] flex items-center gap-3"
          style={{
            height: '56px',
            paddingLeft: '20px',
            paddingRight: '20px',
            borderBottom: '1px solid #202630',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            className="w-7 h-7 bg-[#2563EB] rounded flex items-center justify-center text-white font-mono font-bold text-sm"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: '#2563EB',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            S
          </div>
          <div>
            <span
              className="font-bold text-sm tracking-wider text-[#E6EAF0]"
              style={{
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.05em',
                color: '#E6EAF0',
                fontFamily: 'Geist, Inter, sans-serif',
              }}
            >
              STOCKPULSE
            </span>
            <span
              className="text-[10px] block text-[#8B95A5] leading-none font-mono mt-0.5"
              style={{
                fontSize: '10px',
                display: 'block',
                color: '#8B95A5',
                fontFamily: 'JetBrains Mono, monospace',
                marginTop: '2px',
              }}
            >
            </span>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav
          className="p-3 space-y-6 overflow-y-auto"
          style={{
            padding: '12px',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {navGroups.map((group) => (
            <div key={group.title} style={{ marginBottom: '20px' }}>
              <div
                className="px-3 text-[10px] font-semibold text-[#8B95A5] tracking-widest uppercase mb-2"
                style={{
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#8B95A5',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                {group.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {group.items.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? 'bg-[#11161D] text-[#E6EAF0] border-l-2 border-[#2563EB]'
                          : 'text-[#8B95A5] hover:text-[#E6EAF0] hover:bg-[#0D1117]'
                      }`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        backgroundColor: active ? '#11161D' : 'transparent',
                        color: active ? '#E6EAF0' : '#8B95A5',
                        borderLeft: active ? '3px solid #2563EB' : '3px solid transparent',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon
                        className={`w-4 h-4 ${active ? 'text-[#38BDF8]' : 'text-[#8B95A5]'}`}
                        style={{
                          width: '16px',
                          height: '16px',
                          color: active ? '#38BDF8' : '#8B95A5',
                        }}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* System Status Footer */}
      <div
        className="p-3.5 border-t border-[#202630] bg-[#0D1117]"
        style={{
          padding: '14px',
          borderTop: '1px solid #202630',
          backgroundColor: '#0D1117',
        }}
      >
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[#11161D] border border-[#202630] text-xs"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            borderRadius: '4px',
            backgroundColor: '#11161D',
            border: '1px solid #202630',
            fontSize: '12px',
          }}
        >
          <span
            className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse-fast"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          <span
            className="font-mono text-[11px] text-[#E6EAF0] font-medium"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#E6EAF0',
              fontWeight: 500,
            }}
          >
            All Systems OK
          </span>
          <ShieldCheck
            className="w-3.5 h-3.5 text-[#10B981] ml-auto"
            style={{
              width: '14px',
              height: '14px',
              color: '#10B981',
              marginLeft: 'auto',
            }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
