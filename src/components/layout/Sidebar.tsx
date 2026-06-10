import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  FileText,
  BookMarked,
  Headphones,
  Mic,
  Edit3,
  Layers,
  Zap,
  GraduationCap,
  Map,
  Gamepad2,
  Bot,
  Trophy,
  BarChart3,
  Search as SearchIcon,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Flame,
} from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useSidebarStore } from '../../stores/sidebarStore';

interface NavItem {
  label: string;
  labelJp?: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
}

interface NavSection {
  title?: string;
  titleJp?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Learn',
    titleJp: '学ぶ',
    items: [
      { label: 'Dashboard', labelJp: 'ダッシュボード', icon: LayoutDashboard, path: '/' },
      { label: 'Vocabulary', labelJp: '語彙', icon: BookOpen, path: '/vocabulary' },
      { label: 'Kanji', labelJp: '漢字', icon: PenTool, path: '/kanji' },
      { label: 'Grammar', labelJp: '文法', icon: FileText, path: '/grammar' },
      { label: 'Reading', labelJp: '読解', icon: BookMarked, path: '/reading' },
      { label: 'Listening', labelJp: '聴解', icon: Headphones, path: '/listening' },
      { label: 'Speaking', labelJp: '会話', icon: Mic, path: '/speaking' },
      { label: 'Writing', labelJp: '書写', icon: Edit3, path: '/writing' },
    ],
  },
  {
    title: 'Practice',
    titleJp: '練習',
    items: [
      { label: 'Flashcards', labelJp: 'フラッシュカード', icon: Layers, path: '/flashcards' },
      { label: 'Quiz', labelJp: 'クイズ', icon: Zap, path: '/quiz' },
      { label: 'Mock Exam', labelJp: '模擬試験', icon: GraduationCap, path: '/mock-exam' },
    ],
  },
  {
    title: 'Explore',
    titleJp: '探索',
    items: [
      { label: 'Career Mode', labelJp: 'キャリアモード', icon: Map, path: '/career' },
      { label: 'Mini Games', labelJp: 'ミニゲーム', icon: Gamepad2, path: '/mini-games' },
      { label: 'AI Tutor', labelJp: 'AI先生', icon: Bot, path: '/ai-tutor' },
    ],
  },
  {
    title: 'Progress',
    titleJp: '進捗',
    items: [
      { label: 'Achievements', labelJp: '実績', icon: Trophy, path: '/achievements' },
      { label: 'Analytics', labelJp: '分析', icon: BarChart3, path: '/analytics' },
      { label: 'Search', labelJp: '検索', icon: SearchIcon, path: '/search' },
    ],
  },
];

const BOTTOM_NAV: NavItem = {
  label: 'Settings',
  labelJp: '設定',
  icon: Settings,
  path: '/settings',
};

export function Sidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const location = useLocation();
  const profile = useUserStore((s) => s.profile);

  const sidebarWidth = collapsed ? 72 : 260;
  const xpPercent = profile.xpToNextLevel > 0
    ? Math.round((profile.currentXP / profile.xpToNextLevel) * 100)
    : 0;

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen z-40 flex flex-col select-none"
      style={{
        background: 'var(--gradient-sidebar)',
        borderRight: '1px solid var(--border-primary)',
      }}
      animate={{ width: sidebarWidth }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 min-h-[60px]">
        <motion.div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black text-white relative overflow-hidden"
          style={{ background: 'var(--gradient-hero)' }}
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">T</span>
          <div className="absolute inset-0 animate-shimmer" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1
                className="text-base font-extrabold leading-tight tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                TrioLingo<span className="text-gradient-primary">++</span>
              </h1>
              <span
                className="text-[10px] tracking-widest"
                style={{
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-japanese)',
                }}
              >
                トリオリンゴ
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User XP Card */}
      <div className="px-3 pb-3 pt-1">
        <Link
          to="/profile"
          className="rounded-xl p-2.5 flex items-center gap-2.5 transition-all duration-200 relative overflow-hidden group"
          style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Subtle gradient shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.02))' }}
          />
          <motion.div
            className="flex-shrink-0 text-xl w-9 h-9 flex items-center justify-center rounded-lg relative z-10"
            style={{ background: 'var(--bg-tertiary)' }}
            whileHover={{ scale: 1.1 }}
          >
            {profile.avatarEmoji}
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 overflow-hidden min-w-0 relative z-10"
              >
                <p
                  className="text-xs font-bold truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {profile.displayName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Lv.{profile.currentLevel}
                  </span>
                  <div className="flex items-center gap-1">
                    <Flame size={9} className="text-orange-400" />
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                      {profile.currentStreak}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--bg-tertiary)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'var(--gradient-xp)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-medium tabular-nums flex-shrink-0"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {profile.currentXP}/{profile.xpToNextLevel}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 pb-2">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {/* Section divider with label */}
            {si > 0 && (
              <div className="mt-3 mb-1.5 px-2">
                <AnimatePresence>
                  {!collapsed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {section.title}
                      </span>
                      <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
                    </motion.div>
                  ) : (
                    <div className="h-px" style={{ background: 'var(--border-primary)' }} />
                  )}
                </AnimatePresence>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <SidebarLink
                    key={item.path}
                    item={item}
                    isActive={isActive}
                    collapsed={collapsed}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div
        className="px-2.5 pb-2"
        style={{ borderTop: '1px solid var(--border-primary)' }}
      >
        <div className="pt-2">
          <SidebarLink
            item={BOTTOM_NAV}
            isActive={location.pathname === BOTTOM_NAV.path}
            collapsed={collapsed}
          />
        </div>

        {/* Collapse Toggle */}
        <motion.button
          onClick={() => toggle()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-2 mt-1 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {collapsed ? (
            <ChevronsRight size={16} />
          ) : (
            <>
              <ChevronsLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}

/* ——— Individual Nav Link ——— */

function SidebarLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className="relative flex items-center gap-2.5 rounded-xl transition-all duration-150 group"
      style={{
        padding: collapsed ? '9px 0' : '8px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: isActive ? undefined : 'transparent',
        color: isActive ? '#fff' : 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* Active background with glow */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
          style={{ background: '#fff', marginLeft: '-3px' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      <span className="relative z-10 flex-shrink-0">
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      </span>

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.12 }}
            className="relative z-10 text-[13px] font-medium whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {item.badge && !collapsed && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative z-10 ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--gradient-accent)',
            color: '#fff',
          }}
        >
          {item.badge}
        </motion.span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div
          className="absolute left-full ml-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-primary)',
          }}
        >
          {item.label}
          {item.labelJp && (
            <span className="block text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-japanese)' }}>
              {item.labelJp}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
