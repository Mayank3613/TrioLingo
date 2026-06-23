import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useUserStore, getLevelTitle } from '../../stores/userStore';
import { useStudyStore } from '../../stores/studyStore';
import { useFSRSStore } from '../../stores/fsrsStore';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import {
  Flame,
  Star,
  Clock,
  BookOpen,
  Play,
  Layers,
  Zap,
  PenTool,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

/* ──────────── Animated XP Ring ──────────── */
function XPRing({ current, max, level }: { current: number; max: number; level: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(current / max, 1) : 0;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        {/* track */}
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        {/* glow layer */}
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#xpGradWhite)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: 'blur(5px)', opacity: 0.6 }}
        />
        {/* progress */}
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#xpGradWhite)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="xpGradWhite" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
          </linearGradient>
        </defs>
      </svg>
      {/* center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{level}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
          Level
        </span>
      </div>
    </div>
  );
}

/* ──────────── Stat Card ──────────── */
function StatCard({
  icon,
  label,
  value,
  suffix,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="p-5 rounded-xl border border-[var(--color-border)] hover:border-slate-500/30 transition-all duration-200"
      style={{
        background: 'var(--color-bg-card)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </div>
          <div className="text-xl font-extrabold flex items-baseline gap-1 mt-0.5 text-white">
            {value}
            {suffix && (
              <span className="text-xs font-semibold text-slate-400 ml-0.5">
                {suffix}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────── Quick-Action Card ──────────── */
function ActionCard({
  icon,
  title,
  subtitle,
  gradient,
  delay,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  delay: number;
  onClick?: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-2xl p-4 text-left text-white cursor-pointer w-full overflow-hidden relative"
      style={{ background: gradient, boxShadow: 'var(--shadow-lg)' }}
      onClick={onClick}
    >
      {/* Shimmer sweep overlay */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />

      <div className="relative z-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 bg-white/20 flex-shrink-0">
          {icon}
        </div>
        <div className="text-sm font-bold truncate">{title}</div>
        <div className="text-[11px] opacity-80 mt-0.5 truncate">{subtitle}</div>
      </div>
    </motion.button>
  );
}

/* ──────────── Time-ago helper ──────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ──────────── RADAR DATA ──────────── */
const RADAR_DATA = [
  { skill: 'Vocabulary', value: 65, fullMark: 100 },
  { skill: 'Kanji', value: 45, fullMark: 100 },
  { skill: 'Grammar', value: 70, fullMark: 100 },
  { skill: 'Reading', value: 55, fullMark: 100 },
  { skill: 'Listening', value: 40, fullMark: 100 },
  { skill: 'Speaking', value: 30, fullMark: 100 },
];

/* ──────────── DASHBOARD ──────────── */
export default function Dashboard() {
  const { profile } = useUserStore();
  const { dailyGoals, recentActivity, lessonsAvailable } = useStudyStore();
  const fsrs = useFSRSStore();
  const navigate = useNavigate();

  const [barWidth, setBarWidth] = React.useState(0);
  const [animatedGoals, setAnimatedGoals] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setBarWidth(Math.min((profile.currentXP / profile.xpToNextLevel) * 100, 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [profile.currentXP, profile.xpToNextLevel]);

  React.useEffect(() => {
    const timers = dailyGoals.map((goal, idx) => {
      return setTimeout(() => {
        setAnimatedGoals(prev => ({
          ...prev,
          [goal.id]: Math.min((goal.current / goal.target) * 100, 100)
        }));
      }, (idx + 1) * 100);
    });
    return () => timers.forEach(clearTimeout);
  }, [dailyGoals]);

  const reviewsDue = fsrs.getDueCount() + fsrs.getNewCards().length;
  const completedGoals = dailyGoals.filter((g) => g.current >= g.target).length;
  const dailyPct = dailyGoals.length > 0 ? Math.round((completedGoals / dailyGoals.length) * 100) : 0;

  React.useEffect(() => {
    if (dailyPct === 100) {
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.8 },
          colors: ['#6366f1', '#ec4899', '#22c55e', '#fbbf24']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.8 },
          colors: ['#6366f1', '#ec4899', '#22c55e', '#fbbf24']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [dailyPct]);

  return (
    <div className="p-6 overflow-y-auto h-full pb-20 space-y-5">
      {/* ── Hero Welcome ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4c1d95, #7c3aed, #a855f7)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Shimmer sweep overlay */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>

        <div className="relative z-10 flex-shrink-0">
          <XPRing current={profile.currentXP} max={profile.xpToNextLevel} level={profile.currentLevel} />
        </div>

        <div className="text-white relative z-10 min-w-0 flex-1">
          <motion.h1
            className="text-2xl font-black text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back, {profile.displayName || 'New Student'}! 👋
          </motion.h1>
          <motion.p
            className="text-purple-200/80 text-sm mt-1 font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            おかえりなさい · {profile.displayName || 'New Student'}
          </motion.p>

          {/* Level Progress Indicator */}
          <motion.div
            className="mt-3 max-w-[240px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex justify-between text-[10px] text-white/85 font-semibold mb-1 uppercase tracking-wider">
              <span>Next Level Progress</span>
              <span>{Math.round(barWidth)}%</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mt-4 flex items-center gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10 text-xs font-semibold">
              <span>⭐ {profile.currentXP} / {profile.xpToNextLevel} XP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 border border-white/10 text-xs font-semibold">
              <span>📈 {profile.totalXP} Total XP</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Flame size={20} className="text-orange-500 fill-orange-500" />}
          label="Study Streak"
          value={profile.currentStreak}
          suffix="days"
          delay={0.15}
        />
        <StatCard
          icon={<Sparkles size={20} className="text-amber-400" />}
          label="XP Today"
          value={profile.currentXP}
          delay={0.2}
        />
        <StatCard
          icon={<Clock size={20} className="text-rose-400" />}
          label="Reviews Due"
          value={reviewsDue}
          delay={0.25}
        />
        <StatCard
          icon={<BookOpen size={20} className="text-emerald-400" />}
          label="Lessons Available"
          value={lessonsAvailable}
          delay={0.3}
        />
      </div>

      {/* ── Two-Column: Daily Goals + Radar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Goals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  Daily Goals
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  今日の目標
                </p>
              </div>
              
              {/* SVG Circular Badge */}
              <div className="relative w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[var(--color-accent-purple)]"
                    strokeDasharray={`${dailyPct}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                  {dailyPct}%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {dailyGoals.map((goal, i) => {
                const done = goal.current >= goal.target;
                const percent = animatedGoals[goal.id] || 0;
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex flex-col gap-2 pb-3 border-b border-[var(--color-border)] last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{
                          background: done ? 'var(--gradient-success)' : 'rgba(255,255,255,0.04)',
                        }}
                      >
                        {done ? <CheckCircle2 size={16} className="text-white" /> : goal.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-sm font-medium truncate"
                            style={{
                              color: done ? 'var(--color-text-muted)' : '#ffffff',
                              textDecoration: done ? 'line-through' : 'none',
                            }}
                          >
                            {goal.title}
                          </span>
                          <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                            {goal.current}/{goal.target}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-white/5 mt-1.5">
                          <div 
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${percent}%`,
                              background: done ? 'var(--gradient-success)' : 'var(--gradient-primary)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* JLPT Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card padding="lg">
            <h2 className="text-base font-bold mb-1 text-white">
              JLPT {profile.currentJLPTLevel} Readiness
            </h2>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
              スキル分析
            </p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                  { skill: 'Vocabulary', value: Math.min(100, Math.max(15, Math.round((profile.vocabularyMastered / 400) * 100))), fullMark: 100 },
                  { skill: 'Kanji', value: Math.min(100, Math.max(10, Math.round((profile.kanjiMastered / 100) * 100))), fullMark: 100 },
                  { skill: 'Grammar', value: Math.min(100, Math.max(20, Math.round((profile.grammarCompleted / 100) * 100))), fullMark: 100 },
                  { skill: 'Reading', value: Math.min(100, Math.max(25, Math.round(((profile.careerProgress ? Object.values(profile.careerProgress).reduce((a, b) => a + b, 0) : 0) / 40) * 100))), fullMark: 100 },
                  { skill: 'Listening', value: Math.min(100, Math.max(15, Math.round((profile.totalStudyMinutes / 120) * 100))), fullMark: 100 },
                  { skill: 'Speaking', value: Math.min(100, Math.max(10, Math.round((profile.totalXP / 2000) * 100))), fullMark: 100 },
                ]}>
                  <PolarGrid stroke="rgba(255,255,255,0.15)" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 500 }}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#7c3aed"
                    fill="#7c3aed"
                    fillOpacity={0.3}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#7c3aed', strokeWidth: 1.5, stroke: 'var(--color-bg-card)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* 6 skill progress bars in 2 columns (3 each) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-5 pt-4 border-t border-[var(--color-border)]">
              {[
                { skill: 'Vocabulary', value: Math.min(100, Math.max(15, Math.round((profile.vocabularyMastered / 400) * 100))) },
                { skill: 'Kanji', value: Math.min(100, Math.max(10, Math.round((profile.kanjiMastered / 100) * 100))) },
                { skill: 'Grammar', value: Math.min(100, Math.max(20, Math.round((profile.grammarCompleted / 100) * 100))) },
                { skill: 'Reading', value: Math.min(100, Math.max(25, Math.round(((profile.careerProgress ? Object.values(profile.careerProgress).reduce((a, b) => a + b, 0) : 0) / 40) * 100))) },
                { skill: 'Listening', value: Math.min(100, Math.max(15, Math.round((profile.totalStudyMinutes / 120) * 100))) },
                { skill: 'Speaking', value: Math.min(100, Math.max(10, Math.round((profile.totalXP / 2000) * 100))) },
              ].map((item) => (
                <div key={item.skill} className="flex flex-col min-w-0">
                  <div className="flex justify-between items-center text-[11px] font-semibold">
                    <span className="text-slate-400">
                      {item.skill}
                    </span>
                    <span className="text-white">
                      {item.value}%
                    </span>
                  </div>
                  {/* progress micro-bar */}
                  <div className="w-full bg-slate-800/80 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-[#7c3aed] h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <motion.h2
          className="text-base font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Quick Actions
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionCard
            icon={<Play size={20} />}
            title="Continue Lesson"
            subtitle="JLPT N5 · Verbs"
            gradient="var(--gradient-primary)"
            delay={0.55}
            onClick={() => navigate('/vocabulary')}
          />
          <ActionCard
            icon={<Layers size={20} />}
            title="Review Flashcards"
            subtitle={`${reviewsDue} cards due`}
            gradient="var(--gradient-accent)"
            delay={0.6}
            onClick={() => navigate('/flashcards')}
          />
          <ActionCard
            icon={<Zap size={20} />}
            title="Take a Quiz"
            subtitle="5 min quick quiz"
            gradient="var(--gradient-success)"
            delay={0.65}
            onClick={() => navigate('/quiz')}
          />
          <ActionCard
            icon={<PenTool size={20} />}
            title="Practice Kanji"
            subtitle="Stroke order drill"
            gradient="var(--gradient-xp)"
            delay={0.7}
            onClick={() => navigate('/kanji')}
          />
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <Card padding="lg">
          <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.slice(0, 6).map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 py-2 border-b last:border-b-0 px-2 -mx-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors duration-150"
                style={{ borderColor: 'var(--border-secondary)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  {act.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {act.title}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {act.description}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {act.xpEarned > 0 && <Badge variant="xp">+{act.xpEarned} XP</Badge>}
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {timeAgo(act.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
