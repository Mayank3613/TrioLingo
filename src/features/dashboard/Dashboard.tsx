import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useUserStore } from '../../stores/userStore';
import { useStudyStore } from '../../stores/studyStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Flame,
  Clock,
  BookOpen,
  Layers,
  Zap,
  CheckCircle2,
  Map,
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
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#34d399" />
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
      className="p-5 rounded-xl transition-all duration-200 card-premium"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            {label}
          </div>
          <div className="text-xl font-extrabold flex items-baseline gap-1 mt-0.5" style={{ color: 'var(--text-primary)' }}>
            {value}
            {suffix && (
              <span className="text-xs font-semibold ml-0.5" style={{ color: 'var(--text-tertiary)' }}>
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
  glowColor,
  delay,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  glowColor: string;
  delay: number;
  onClick?: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.02, y: -2, boxShadow: `0 8px 32px ${glowColor}` }}
      whileTap={{ scale: 0.97 }}
      className="rounded-3xl p-6 text-left text-white cursor-pointer w-full overflow-hidden relative transition-all duration-200"
      style={{ background: gradient }}
      onClick={onClick}
    >
      {/* Shimmer sweep overlay */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/20 flex-shrink-0 shadow-lg" style={{ backdropFilter: 'blur(10px)' }}>
          {icon}
        </div>
        <div className="text-lg font-bold truncate tracking-tight">{title}</div>
        <div className="text-xs opacity-80 mt-1 truncate" style={{ fontFamily: 'var(--font-japanese)' }}>{subtitle}</div>
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



/* ──────────── DASHBOARD ──────────── */
export default function Dashboard() {
  const { profile } = useUserStore();
  const { dailyGoals, recentActivity } = useStudyStore();
  const navigate = useNavigate();

  const [animatedGoals, setAnimatedGoals] = React.useState<Record<string, number>>({});

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

  const completedGoals = dailyGoals.filter((g) => g.current >= g.target).length;
  const dailyPct = dailyGoals.length > 0 ? Math.round((completedGoals / dailyGoals.length) * 100) : 0;

  const welcomeActivity = {
    id: 'welcome-mascot',
    type: 'lesson' as const,
    title: 'Welcome to TrioLingo++',
    description: 'Master Japanese with your owl companion 🦉',
    xpEarned: 0,
    timestamp: new Date().toISOString(),
    icon: '🦉',
  };

  const activitiesToRender = [welcomeActivity, ...recentActivity.filter(a => a.id !== '1')].slice(0, 6);

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
    <div className="p-6 pb-20 space-y-6">
      
      {/* ── TOP ROW: Welcome Card + Radar Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden h-[340px]"
          style={{
            background: 'var(--gradient-hero)',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white/80" style={{ fontFamily: 'var(--font-japanese)' }}>ようこそ!</h2>
            <h1 className="text-3xl font-extrabold text-white mt-1 tracking-tight leading-snug">
              Welcome back, {profile.displayName || 'Kenji'}!
            </h1>
            
            <div className="flex items-center gap-8 mt-10">
              <div className="flex flex-col items-center">
                <XPRing current={profile.currentXP} max={profile.xpToNextLevel} level={profile.currentLevel} />
                <span className="text-xs font-semibold text-white/70 mt-3 uppercase tracking-wider">Current XP</span>
              </div>
              
              <div className="flex flex-col items-center justify-center">
                <Flame size={48} className="text-orange-500 fill-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse" />
                <span className="text-4xl font-black text-white mt-2">{profile.currentStreak}</span>
                <span className="text-xs font-semibold text-white/70 mt-1 uppercase tracking-wider">Day Streak</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* JLPT Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-3xl p-6 flex flex-col h-[340px] items-center justify-center relative card-premium"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
              { skill: 'Vocabulary\n語彙', value: Math.min(100, Math.max(15, Math.round((profile.vocabularyMastered / 400) * 100))), fullMark: 100 },
              { skill: 'Kanji\n漢字', value: Math.min(100, Math.max(10, Math.round((profile.kanjiMastered / 100) * 100))), fullMark: 100 },
              { skill: 'Grammar\n文法', value: Math.min(100, Math.max(20, Math.round((profile.grammarCompleted / 100) * 100))), fullMark: 100 },
              { skill: 'Reading\n読解', value: Math.min(100, Math.max(25, Math.round(((profile.careerProgress ? Object.values(profile.careerProgress).reduce((a, b) => a + b, 0) : 0) / 40) * 100))), fullMark: 100 },
              { skill: 'Listening\n聴解', value: Math.min(100, Math.max(15, Math.round((profile.totalStudyMinutes / 120) * 100))), fullMark: 100 },
              { skill: 'Speaking\n発話', value: Math.min(100, Math.max(10, Math.round((profile.totalXP / 2000) * 100))), fullMark: 100 },
            ]}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="skill"
                tick={({ x, y, payload }) => {
                  const lines = payload.value.split('\n');
                  return (
                    <text x={x} y={y} textAnchor="middle" fill="var(--color-text-secondary)" fontSize={12} fontWeight={500}>
                      <tspan x={x} dy={0}>{lines[0]}</tspan>
                      <tspan x={x} dy={16} fill="var(--color-text-muted)" fontSize={11}>{lines[1]}</tspan>
                    </text>
                  );
                }}
              />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#38bdf8"
                fill="url(#radarGradient)"
                fillOpacity={0.6}
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
              />
              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── MIDDLE ROW: Quick Actions ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          icon={<Zap size={24} className="text-white fill-white/20" />}
          title="Start Quick Quiz"
          subtitle="クイッククイズ"
          gradient="linear-gradient(135deg, #34d399, #10b981, #059669)"
          glowColor="rgba(16, 185, 129, 0.4)"
          delay={0.4}
          onClick={() => navigate('/quiz')}
        />
        <ActionCard
          icon={<Layers size={24} className="text-white fill-white/20" />}
          title="Review Flashcards"
          subtitle="単語帳"
          gradient="linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb)"
          glowColor="rgba(59, 130, 246, 0.4)"
          delay={0.5}
          onClick={() => navigate('/flashcards')}
        />
        <ActionCard
          icon={<Map size={24} className="text-white fill-white/20" />}
          title="Explore Career Mode"
          subtitle="キャリアモード"
          gradient="linear-gradient(135deg, #c084fc, #a855f7, #7e22ce)"
          glowColor="rgba(168, 85, 247, 0.4)"
          delay={0.6}
          onClick={() => navigate('/career')}
        />
      </div>

      {/* ── BOTTOM ROW: Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<BookOpen size={28} className="text-orange-400 fill-orange-400/20" />}
          label="Words Learned"
          value={profile.vocabularyMastered || 1250}
          suffix="WORDS"
          delay={0.7}
        />
        <StatCard
          icon={<CheckCircle2 size={28} className="text-yellow-400 fill-yellow-400/20" />}
          label="Accuracy"
          value="88%"
          suffix="ACCURACY"
          delay={0.8}
        />
        <StatCard
          icon={<Clock size={28} className="text-cyan-400 fill-cyan-400/20" />}
          label="Time Studied"
          value={Math.round(profile.totalStudyMinutes / 60) || 120}
          suffix="HOURS"
          delay={0.9}
        />
      </div>

      {/* ── EXTRA ROW: Daily Goals & Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12 pt-8" style={{ borderTop: '1px solid var(--border-primary)' }}>
        <Card padding="lg">
          <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Daily Goals</h2>
          <div className="space-y-4">
            {dailyGoals.map((goal) => {
              const done = goal.current >= goal.target;
              const percent = animatedGoals[goal.id] || 0;
              return (
                <div key={goal.id} className="flex flex-col gap-2 pb-3 border-b border-[var(--color-border)] last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: done ? 'var(--gradient-success)' : 'rgba(255,255,255,0.04)' }}>
                      {done ? <CheckCircle2 size={16} className="text-white" /> : goal.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate" style={{ color: done ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>
                          {goal.title}
                        </span>
                        <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>{goal.current}/{goal.target}</span>
                      </div>
                      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${percent}%`, background: done ? 'var(--gradient-success)' : 'var(--gradient-primary)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-base font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>
          <div className="space-y-3">
            {activitiesToRender.map((act) => (
              <div key={act.id} className="flex items-center gap-3.5 p-3 rounded-xl transition-all duration-150 card-premium">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-secondary)' }}>
                  {act.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{act.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{act.description}</div>
                </div>
                <div className="flex items-center gap-2.5">
                  {act.xpEarned > 0 && <Badge variant="xp">+{act.xpEarned} XP</Badge>}
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>{act.id === 'welcome-mascot' ? 'Just now' : timeAgo(act.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
