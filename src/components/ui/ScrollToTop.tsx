import { useState, useEffect, RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function ScrollToTop({ containerRef }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      setVisible(el.scrollTop > 300);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={scrollToTop}
          className="fixed z-30 flex items-center justify-center cursor-pointer"
          style={{
            bottom: 24,
            right: 24,
            width: 44,
            height: 44,
            borderRadius: '9999px',
            background: 'var(--accent-primary)',
            color: '#fff',
            boxShadow: 'var(--shadow-lg)',
            border: 'none',
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
