import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Flame,
  BookOpen,
  PenTool,
  Star,
  Calendar,
  TrendingUp,
  Edit3,
  Check,
} from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useFSRSStore } from '../../stores/fsrsStore';

const EMOJI_OPTIONS = ['🎌', '🗾', '🌸', '⛩️', '🎎', '🎏', '🎋', '🎑', '🐉', '🏯', '🗻', '🌊', '🍣', '🍱', '🍵', '🎓', '🦊', '🐱', '🐶', '🦉'];

export default function ProfilePage() {
  const profile = useUserStore(s => s.profile);
  const updateProfile = useUserStore(s => s.updateProfile);
  const fsrsStore = useFSRSStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const totalCards = fsrsStore.getTotalCards();
  const masteredCards = fsrsStore.getMasteredCount();
  const vocabCards = fsrsStore.getCardsByType('vocab').length;
  const kanjiCards = fsrsStore.getCardsByType('kanji').length;
  const grammarCards = fsrsStore.getCardsByType('grammar').length;

  const xpPercent = profile.xpToNextLevel > 0
    ? Math.round((profile.currentXP / profile.xpToNextLevel) * 100)
    : 0;

  // Generate heatmap data (last 16 weeks = 112 days)
  const heatmapData = useMemo(() => {
    const days: { date: string; intensity: number }[] = [];
    const today = new Date();
    for (let i = 111; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      // Simulate activity based on streak/random
      const intensity = Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0;
      days.push({ date: dateStr, intensity });
    }
    return days;
  }, []);

  const heatmapColors = ['var(--bg-tertiary)', '#22c55e30', '#22c55e50', '#22c55e80', '#22c55e'];

  const saveName = () => {
    if (nameInput.trim()) {
      updateProfile({ displayName: nameInput.trim() });
    }
    setEditingName(false);
  };

  const stats = [
    { label: 'Total XP', value: profile.totalXP.toLocaleString(), icon: Star, color: '#f59e0b' },
    { label: 'Current Streak', value: `${profile.currentStreak} days`, icon: Flame, color: '#ef4444' },
    { label: 'Best Streak', value: `${profile.currentStreak} days`, icon: TrendingUp, color: '#8b5cf6' },
    { label: 'Cards in Deck', value: totalCards, icon: BookOpen, color: '#3b82f6' },
    { label: 'Mastered', value: masteredCards, icon: Trophy, color: '#22c55e' },
    { label: 'Coins', value: profile.coins, icon: Star, color: '#f97316' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 mb-6 relative overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
      >
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'var(--gradient-primary)' }} />

        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl cursor-pointer"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {profile.avatarEmoji}
            </motion.button>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-24 left-0 z-50 rounded-xl p-3 grid grid-cols-5 gap-1.5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-lg)' }}
              >
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => { updateProfile({ avatarEmoji: emoji }); setShowEmojiPicker(false); }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl cursor-pointer transition-transform hover:scale-110"
                    style={{ background: profile.avatarEmoji === emoji ? 'var(--bg-hover)' : 'transparent' }}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    className="text-xl font-bold px-2 py-1 rounded-lg outline-none"
                    style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}
                    autoFocus
                  />
                  <button onClick={saveName} className="cursor-pointer" style={{ color: '#22c55e' }}>
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {profile.displayName}
                  </h1>
                  <button onClick={() => { setNameInput(profile.displayName); setEditingName(true); }} className="cursor-pointer" style={{ color: 'var(--text-tertiary)' }}>
                    <Edit3 size={14} />
                  </button>
                </>
              )}
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              {profile.title} · Level {profile.currentLevel}
            </p>

            {/* XP Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--gradient-xp)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                {profile.currentXP} / {profile.xpToNextLevel} XP
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl p-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
          >
            <stat.icon size={20} className="mb-2" style={{ color: stat.color }} />
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Study Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl p-5 mb-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Study Activity</h3>
        </div>
        <div className="flex gap-[3px] flex-wrap">
          {heatmapData.map((day, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm transition-colors"
              style={{ background: heatmapColors[day.intensity] }}
              title={`${day.date}: ${day.intensity > 0 ? `${day.intensity} sessions` : 'No activity'}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Less</span>
          {heatmapColors.map((color, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: color }} />
          ))}
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>More</span>
        </div>
      </motion.div>

      {/* Card Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Flashcard Breakdown
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Vocabulary', count: vocabCards, color: '#3b82f6', icon: BookOpen },
            { label: 'Kanji', count: kanjiCards, color: '#a855f7', icon: PenTool },
            { label: 'Grammar', count: grammarCards, color: '#22c55e', icon: PenTool },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon size={16} style={{ color: item.color }} />
              <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.count}</span>
              <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: item.color,
                    width: `${totalCards > 0 ? (item.count / totalCards) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
