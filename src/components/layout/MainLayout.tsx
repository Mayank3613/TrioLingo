import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarStore } from '../../stores/sidebarStore';

export function MainLayout() {
  const location = useLocation();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area — pushed right by sidebar */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ marginLeft: sidebarWidth }}
      >

        <Header />

        {/* Scrollable content with mesh background */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden bg-mesh relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
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
