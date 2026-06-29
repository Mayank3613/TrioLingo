import { motion } from 'motion/react';

export function PageLoader() {
  return (
    <div
      className="flex items-center justify-center h-full min-h-[400px]"
      style={{ color: 'var(--text-tertiary)' }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Pulsing Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white animate-pulse-glow"
          style={{ background: 'var(--gradient-hero)' }}
        >
          T
        </div>

        {/* Bouncing Dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent-primary)' }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <span className="text-xs font-medium tracking-widest uppercase">
          Loading...
        </span>
      </div>
    </div>
  );
}

export default PageLoader;
