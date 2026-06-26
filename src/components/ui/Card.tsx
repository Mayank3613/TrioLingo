import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({
  children,
  className,
  hover = false,
  gradient = false,
  padding = 'md',
  onClick,
  style,
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const gradientStyle = gradient
    ? {
        borderTop: '3px solid transparent',
        borderImage: 'var(--gradient-primary) 1',
        borderImageSlice: '1 1 0 0',
      }
    : {};

  return (
    <motion.div
      className={clsx(
        'card-premium rounded-2xl transition-all duration-200',
        paddingClasses[padding],
        onClick && 'cursor-pointer',
        className,
        hover && 'hover:scale-[1.02] hover:shadow-xl'
      )}
      style={{ ...gradientStyle, ...style }}
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-xl)' } : undefined}
      transition={hover ? { type: 'spring' as const, stiffness: 300, damping: 20 } : undefined}
    >
      {children}
    </motion.div>
  );
}
