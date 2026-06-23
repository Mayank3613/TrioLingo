import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarStore } from '../../stores/sidebarStore';

export function MainLayout() {
  const location = useLocation();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const sidebarWidth = collapsed ? 72 : 260;

  const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;
  const [showWebBanner, setShowWebBanner] = useState(!isTauri);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area — pushed right by sidebar */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Sticky browser showcase banner */}
        <AnimatePresence>
          {showWebBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-between gap-4 px-4 py-2 text-xs font-semibold border-b shrink-0 transition-all"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🌐</span>
                <span>
                  <strong>Web Showcase Mode</strong> — This is a browser preview of the <strong>TrioLingo++</strong> desktop app. Install the native desktop application for offline speech synthesis, automatic filesystem backups, and maximum performance.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (typeof localStorage !== 'undefined') {
                      localStorage.removeItem('entered_preview');
                    }
                    window.location.reload();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border hover:opacity-90 active:scale-98 transition-all cursor-pointer"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  🖥️ View Showcase
                </button>
                <a
                  href="https://github.com/Mayank3613/TrioLingo/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-white font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer hover:opacity-90 active:scale-98"
                  style={{
                    background: 'var(--gradient-primary)',
                  }}
                >
                  📥 Download Desktop App
                </a>
                <button
                  onClick={() => setShowWebBanner(false)}
                  className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Header />

        {/* Scrollable content with mesh background */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden bg-mesh relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.998 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
