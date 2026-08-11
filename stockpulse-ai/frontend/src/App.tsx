import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import SearchModal from './components/layout/SearchModal';

import Overview from './pages/Overview';
import StockDetail from './pages/StockDetail';
import SignalsPage from './pages/SignalsPage';
import NewsPage from './pages/NewsPage';
import ModelsPage from './pages/ModelsPage';
import BacktestsPage from './pages/BacktestsPage';
import FeaturesPage from './pages/FeaturesPage';
import InfrastructurePage from './pages/InfrastructurePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  return (
    <Router>
      <div
        className="flex min-h-screen bg-[#080A0D] text-[#E6EAF0] selection:bg-[#2563EB] selection:text-white"
        style={{
          display: 'flex',
          flexDirection: 'row',
          minHeight: '100vh',
          backgroundColor: '#080A0D',
          color: '#E6EAF0',
          width: '100vw',
          maxWidth: '100vw',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Fixed Left Vertical Sidebar (250px) */}
        <Sidebar />

        {/* Main Content Area: dynamically constrained to remaining width */}
        <div
          className="flex-1 flex flex-col min-w-0"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            maxWidth: 'calc(100vw - 250px)',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Bar */}
          <Topbar onOpenSearch={() => setIsSearchOpen(true)} />

          {/* Page Body Viewport */}
          <main
            className="flex-1 p-4 md:p-6 overflow-y-auto w-full"
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              overflowX: 'hidden',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/markets" element={<Overview />} />
              <Route path="/markets/:ticker" element={<StockDetail />} />
              <Route path="/signals" element={<SignalsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/research/models" element={<ModelsPage />} />
              <Route path="/research/backtests" element={<BacktestsPage />} />
              <Route path="/research/features" element={<FeaturesPage />} />
              <Route path="/system" element={<InfrastructurePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Interactive Global Search Modal */}
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
