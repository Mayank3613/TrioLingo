import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from '../ui/ScrollToTop';
import { ToastContainer } from '../ui/ToastContainer';
import { useSidebarStore } from '../../stores/sidebarStore';
import { useUserStore } from '../../stores/userStore';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

function LevelUpEffect() {
  const currentLevel = useUserStore(s => s.profile.currentLevel);
  const prevLevel = useRef(currentLevel);

  useEffect(() => {
    if (currentLevel > prevLevel.current) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#ec4899', '#f59e0b', '#22c55e']
      });
    }
    prevLevel.current = currentLevel;
  }, [currentLevel]);

  return null;
}

export function MainLayout() {
  const location = useLocation();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const isMobile = useIsMobile();
  const sidebarWidth = isMobile ? 0 : (collapsed ? 72 : 240);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcuts
  useKeyboardShortcuts();

  // Scroll to top on route change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      <LevelUpEffect />
      <Sidebar />

      <div
        ref={scrollRef}
        className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden relative transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-mesh"
        style={{ marginLeft: sidebarWidth, scrollBehavior: 'smooth' }}
      >
        <Header />

        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full min-h-[calc(100vh-3.5rem)]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      <ScrollToTop containerRef={scrollRef} />
      <ToastContainer />
    </div>
  );
}

export default MainLayout;
