import React, { useState, useEffect } from 'react';
import { Database, AlertTriangle, CheckCircle2, RefreshCw, Info } from 'lucide-react';
import { subscribeFallbackStatus, getFallbackStatusDetails, getHealth } from '../services/api';

interface FallbackIndicatorProps {
  compact?: boolean;
}

const FallbackIndicator: React.FC<FallbackIndicatorProps> = ({ compact = false }) => {
  const [status, setStatus] = useState(getFallbackStatusDetails());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeFallbackStatus((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsubscribe();
  }, []);

  const handleTestConnection = async () => {
    setChecking(true);
    try {
      await getHealth();
    } catch (e) {
      console.warn("Health check failed:", e);
    } finally {
      setChecking(false);
    }
  };

  const isFallback = status.isFallback;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border transition-all ${
          isFallback
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
        }`}
        title={isFallback ? "Fallback Mock Data Active (API Unreachable)" : "Connected to Live Backend API"}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isFallback ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
          }`}
        />
        <span>{isFallback ? 'FALLBACK DATA' : 'LIVE API'}</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-xs font-mono select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow ${
          isFallback
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.25)] animate-pulse'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
        }`}
        title="Click to view Data Source Telemetry Details"
      >
        {isFallback ? (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span>{isFallback ? '⚠️ FALLBACK MOCK DATA' : '● LIVE BACKEND API'}</span>
      </button>

      {/* Interactive Popover Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-50 text-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Database className={`w-4 h-4 ${isFallback ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span className="font-bold text-white text-xs uppercase tracking-wider">Data Source Telemetry</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Status:</span>
              <span className={`font-bold px-2 py-0.5 rounded border ${
                isFallback ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                {isFallback ? 'Fallback Mock Mode' : 'Live FastAPI Stream'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Backend Endpoint:</span>
              <span className="text-cyan-400 font-mono">http://localhost:8000</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Telemetry Check:</span>
              <span className="text-slate-300 font-mono">
                {status.lastUpdated ? new Date(status.lastUpdated).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              {isFallback ? (
                <span>
                  The dashboard is currently serving local mock fallback telemetry because the live backend API is unreachable or rate-limited.
                </span>
              ) : (
                <span>
                  Connected to real-time FastAPI server & in-memory Redis database.
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={checking}
            className="w-full py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking API Connection...' : 'Re-test Backend Connection'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FallbackIndicator;
