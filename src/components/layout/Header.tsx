import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bell, Search, Sparkles, Menu } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useSidebarStore } from '../../stores/sidebarStore';
import { useIsMobile } from '../../hooks/useIsMobile';

const PAGE_TITLES: Record<string, { title: string; titleJp: string; icon?: string }> = {
  '/': { title: 'Dashboard', titleJp: 'ダッシュボード', icon: '🏠' },
  '/vocabulary': { title: 'Vocabulary', titleJp: '語彙', icon: '📚' },
  '/kanji': { title: 'Kanji', titleJp: '漢字', icon: '✍️' },
  '/grammar': { title: 'Grammar', titleJp: '文法', icon: '📖' },
  '/reading': { title: 'Reading', titleJp: '読解', icon: '📰' },
  '/listening': { title: 'Listening', titleJp: '聴解', icon: '🎧' },
  '/speaking': { title: 'Speaking', titleJp: '会話', icon: '🎙️' },
  '/writing': { title: 'Writing', titleJp: '書写', icon: '✏️' },
  '/flashcards': { title: 'Flashcards', titleJp: 'フラッシュカード', icon: '🃏' },
  '/quiz': { title: 'Quiz', titleJp: 'クイズ', icon: '⚡' },
  '/mock-exam': { title: 'Mock Exam', titleJp: '模擬試験', icon: '🎓' },
  '/career': { title: 'Career Mode', titleJp: 'キャリアモード', icon: '🗺️' },
  '/mini-games': { title: 'Mini Games', titleJp: 'ミニゲーム', icon: '🎮' },
  '/ai-tutor': { title: 'AI Tutor', titleJp: 'AI先生', icon: '🤖' },
  '/achievements': { title: 'Achievements', titleJp: '実績', icon: '🏆' },
  '/analytics': { title: 'Analytics', titleJp: '分析', icon: '📊' },
  '/search': { title: 'Search', titleJp: '検索', icon: '🔍' },
  '/settings': { title: 'Settings', titleJp: '設定', icon: '⚙️' },
  '/profile': { title: 'Profile', titleJp: 'プロフィール', icon: '👤' },
};

export function Header() {
  const location = useLocation();
  const profile = useUserStore((s) => s.profile);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);
  const isMobile = useIsMobile();

  const page = useMemo(() => {
    return PAGE_TITLES[location.pathname] ?? { title: 'TrioLingo++', titleJp: '' };
  }, [location.pathname]);

  return (
    <header
      className="flex items-center justify-between px-6 h-14 flex-shrink-0 relative z-20"
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-primary)',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Left — Page Title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {isMobile && (
          <button
            onClick={() => setCollapsed(false)}
            className="p-1.5 -ml-2 mr-1 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>
        )}
        <motion.h2
          key={page.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-lg font-extrabold tracking-tight text-white"
        >
          {page.title}
        </motion.h2>
        {page.titleJp && (
          <motion.span
            key={page.titleJp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="text-[12px] font-medium px-1 py-0.5 rounded-full"
            style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-japanese)',
              background: 'transparent',
            }}
          >
            {page.titleJp}
          </motion.span>
        )}
      </div>

      {/* Right — Stats & Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Streak */}
        <div className="stat-pill">
          <span className="animate-streak inline-block origin-bottom">🔥</span>
          <span className="tabular-nums">{profile.currentStreak}</span>
        </div>

        {/* XP */}
        <div className="stat-pill" style={{ boxShadow: 'var(--shadow-glow)' }}>
          <Sparkles size={13} className="text-amber-400" />
          <span className="tabular-nums">{profile.totalXP.toLocaleString()}</span>
        </div>

        {/* Coins */}
        <div className="stat-pill">
          <span className="text-xs">🪙</span>
          <span className="tabular-nums">{profile.coins.toLocaleString()}</span>
        </div>

        {/* Divider */}
        <div
          className="w-px h-5 mx-1.5"
          style={{ background: 'var(--border-primary)' }}
        />

        {/* Search Bar Trigger */}
        <Link
          to="/search"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all duration-150"
          style={{
            background: 'var(--bg-hover)',
            color: 'var(--text-tertiary)',
            border: '1px solid var(--border-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-focus)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.color = 'var(--text-tertiary)';
          }}
          aria-label="Search (⌘K)"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search</span>
          <kbd
            className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ml-2"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            ⌘K
          </kbd>
        </Link>

        {/* Notifications */}
        <IconButton ariaLabel="Notifications" badge>
          <Bell size={16} />
        </IconButton>

        {/* Avatar */}
        <Link
          to="/profile"
          className="ml-1 w-8 h-8 rounded-full flex items-center justify-center text-base cursor-pointer transition-all duration-200 hover:scale-110 ring-2 ring-transparent hover:ring-[var(--accent-primary)]"
          style={{
            background: 'var(--gradient-primary)',
          }}
          aria-label="Profile"
        >
          {profile.avatarEmoji}
        </Link>
      </div>
    </header>
  );
}

/* ——— Small helper components ——— */

function IconButton({
  children,
  ariaLabel,
  badge,
  path,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  badge?: boolean;
  path?: string;
}) {
  const Wrapper = path ? Link : 'button';
  const wrapperProps = path ? { to: path } : {};

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
    >
      {/* @ts-ignore */}
      <Wrapper
        {...wrapperProps}
        className="relative w-8 h-8 flex items-center justify-center rounded-xl transition-colors duration-150 cursor-pointer"
        style={{ color: 'var(--text-secondary)' }}
        aria-label={ariaLabel}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = 'var(--bg-hover)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {children}
        {badge && (
          <span
            className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full ring-2"
            style={{
              background: '#ef4444',
            }}
          />
        )}
      </Wrapper>
    </motion.div>
  );
}
