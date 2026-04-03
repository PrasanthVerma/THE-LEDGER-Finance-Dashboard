import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import { RoleProvider } from './context/RoleContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import Analytics from './pages/Analytics';
import Assets from './pages/Assets';
import Settings from './pages/Settings';

function AppLayout() {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  return (
    <div className="flex min-h-screen bg-(--surface-base) text-(--text-primary) transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FinanceProvider>
          <RoleProvider>
            <AppLayout />
          </RoleProvider>
        </FinanceProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
