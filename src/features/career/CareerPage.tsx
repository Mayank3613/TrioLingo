import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  ChevronDown,
  ChevronUp,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  MapPin,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useUserStore } from '../../stores/userStore';

interface Chapter {
  id: number;
  title: string;
  titleJp: string;
  level: string;
  description: string;
  lessons: number;
  completedLessons: number;
  icon: string;
  color: string;
  scenarios: string[];
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Arrival in Tokyo',
    titleJp: '東京到着',
    level: 'N5',
    description: 'Your first day in Japan. Learn to navigate airports, trains, and introduce yourself.',
    lessons: 8,
    completedLessons: 0,
    icon: '✈️',
    color: '#22c55e',
    scenarios: ['Airport Arrival', 'Hotel Check-in', 'Convenience Store', 'Train Station', 'Self Introduction', 'Asking Directions', 'Restaurant Order', 'Phone Setup'],
  },
  {
    id: 2,
    title: 'Daily Life',
    titleJp: '日常生活',
    level: 'N4',
    description: 'Settle into Japanese daily life. Shopping, cooking, and making friends.',
    lessons: 8,
    completedLessons: 0,
    icon: '🏠',
    color: '#3b82f6',
    scenarios: ['Grocery Shopping', 'Cooking Japanese Food', 'Meeting Neighbors', 'Post Office', 'Doctor Visit', 'Weekend Plans', 'Birthday Party', 'Weather Talk'],
  },
  {
    id: 3,
    title: 'Work & Culture',
    titleJp: '仕事と文化',
    level: 'N3',
    description: 'Start working in Japan. Navigate office culture and explore traditions.',
    lessons: 8,
    completedLessons: 0,
    icon: '🏯',
    color: '#f59e0b',
    scenarios: ['Job Interview', 'First Day at Office', 'Business Email', 'Team Meeting', 'Shrine Visit', 'Tea Ceremony', 'Company Party', 'Project Presentation'],
  },
  {
    id: 4,
    title: 'Advanced Society',
    titleJp: '社会探求',
    level: 'N2',
    description: 'Engage with Japanese media, news, and deeper cultural discussions.',
    lessons: 8,
    completedLessons: 0,
    icon: '📰',
    color: '#8b5cf6',
    scenarios: ['Reading News', 'TV Discussion', 'University Lecture', 'Political Debate', 'Book Club', 'Art Gallery', 'Environmental Talk', 'Legal Document'],
  },
  {
    id: 5,
    title: 'Mastery',
    titleJp: '匠の道',
    level: 'N1',
    description: 'Master nuanced Japanese. Academic writing, literature, and professional expertise.',
    lessons: 8,
    completedLessons: 0,
    icon: '🏆',
    color: '#ef4444',
    scenarios: ['Academic Paper', 'Literary Analysis', 'Business Negotiation', 'Speech Writing', 'Translation Work', 'Research Presentation', 'Cultural Essay', 'Final Challenge'],
  },
];

const LEVEL_REQUIREMENTS: Record<number, number> = {
  1: 1,
  2: 10,
  3: 20,
  4: 30,
  5: 40,
};

function getActiveChapterIndex(userLevel: number): number {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (userLevel >= LEVEL_REQUIREMENTS[CHAPTERS[i].id]) {
      return i;
    }
  }
  return 0;
}

export function CareerPage() {
  const { profile } = useUserStore();
  const [expandedChapter, setExpandedChapter] = React.useState<number | null>(null);

  const userLevel = profile.currentLevel;
  const activeIndex = getActiveChapterIndex(userLevel);

  const totalLessons = CHAPTERS.reduce((sum, ch) => sum + ch.lessons, 0);
  const totalCompleted = CHAPTERS.reduce((sum, ch) => sum + ch.completedLessons, 0);
  const estimatedHours = Math.ceil((totalLessons - totalCompleted) * 15 / 60);

  const isUnlocked = (chapter: Chapter) => userLevel >= LEVEL_REQUIREMENTS[chapter.id];

  const getButtonState = (chapter: Chapter, index: number) => {
    if (!isUnlocked(chapter)) return 'locked' as const;
    if (chapter.completedLessons >= chapter.lessons) return 'completed' as const;
    if (chapter.completedLessons > 0) return 'continue' as const;
    if (index <= activeIndex) return 'start' as const;
    return 'start' as const;
  };

  const toggleExpand = (chapterId: number) => {
    setExpandedChapter(prev => (prev === chapterId ? null : chapterId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto overflow-y-auto h-full pb-24">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Career Mode
            </h1>
            <p
              className="text-base mt-1"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}
            >
              キャリアモード
            </p>
          </div>
          <Badge variant="primary" size="md">
            <BookOpen size={14} />
            Chapter {Math.min(activeIndex + 1, CHAPTERS.length)} / {CHAPTERS.length}
          </Badge>
        </div>
      </motion.div>

      {/* Progress Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="rounded-2xl p-5 mb-10"
        style={{
          background: 'var(--gradient-primary)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/80 text-sm font-medium">Your Journey</div>
            <div className="text-white text-2xl font-bold mt-1">
              {totalCompleted} <span className="text-base font-normal text-white/60">/ {totalLessons} lessons</span>
            </div>
          </div>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <MapPin size={24} color="white" />
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Learning Path Timeline */}
      <div className="relative">
        {/* Central vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block"
          style={{ background: 'var(--border-primary)' }}
        />
        {/* Mobile left line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-0.5 md:hidden"
          style={{ background: 'var(--border-primary)' }}
        />

        {CHAPTERS.map((chapter, index) => {
          const unlocked = isUnlocked(chapter);
          const buttonState = getButtonState(chapter, index);
          const isLeft = index % 2 === 0;
          const isExpanded = expandedChapter === chapter.id;

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + index * 0.12,
                duration: 0.5,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={unlocked ? { scale: 1.02 } : undefined}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline node — desktop centered */}
              <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10 hidden md:flex">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-4 shadow-md"
                  style={{
                    borderColor: unlocked ? chapter.color : 'var(--border-primary)',
                    background: unlocked ? chapter.color : 'var(--bg-tertiary)',
                    boxShadow: unlocked ? `0 0 12px ${chapter.color}40` : 'var(--shadow-sm)',
                  }}
                >
                  {unlocked ? (
                    <span className="text-white font-bold text-sm">{chapter.id}</span>
                  ) : (
                    <Lock size={16} style={{ color: 'var(--text-tertiary)' }} />
                  )}
                </div>
              </div>

              {/* Timeline node — mobile left */}
              <div className="absolute left-6 -translate-x-1/2 top-6 z-10 md:hidden">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-[3px] shadow-sm"
                  style={{
                    borderColor: unlocked ? chapter.color : 'var(--border-primary)',
                    background: unlocked ? chapter.color : 'var(--bg-tertiary)',
                  }}
                >
                  {unlocked ? (
                    <span className="text-white font-bold text-xs">{chapter.id}</span>
                  ) : (
                    <Lock size={12} style={{ color: 'var(--text-tertiary)' }} />
                  )}
                </div>
              </div>

              {/* Chapter Card */}
              <div
                className={`
                  md:w-[calc(50%-40px)]
                  ${isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'}
                  ml-14 md:ml-auto
                `}
                style={{
                  ...(!isLeft && { marginLeft: undefined }),
                }}
              >
                <Card
                  hover={unlocked}
                  padding="none"
                  className="overflow-hidden"
                >
                  <div style={{ opacity: unlocked ? 1 : 0.5 }}>
                    {/* Color top bar */}
                    <div className="h-1.5" style={{ background: chapter.color }} />

                    <div className="p-5">
                      {/* Top row: icon + badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                            style={{
                              background: `${chapter.color}15`,
                              border: `2px solid ${chapter.color}30`,
                            }}
                          >
                            {chapter.icon}
                          </div>
                          <div>
                            <Badge
                              variant="default"
                              size="sm"
                              className="mb-1"
                            >
                              Chapter {chapter.id}
                            </Badge>
                            <h3
                              className="text-lg font-bold leading-tight"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {chapter.title}
                            </h3>
                            <span
                              className="text-sm"
                              style={{
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-japanese)',
                              }}
                            >
                              {chapter.titleJp}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={unlocked ? 'primary' : 'default'}
                          size="sm"
                        >
                          {chapter.level}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm mt-3 leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {chapter.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <ProgressBar
                          value={chapter.completedLessons}
                          max={chapter.lessons}
                          label={`${chapter.completedLessons} / ${chapter.lessons} lessons`}
                          showPercentage
                          size="sm"
                          gradient={`linear-gradient(135deg, ${chapter.color}, ${chapter.color}cc)`}
                        />
                      </div>

                      {/* Expand scenarios button */}
                      <button
                        onClick={() => toggleExpand(chapter.id)}
                        className="flex items-center gap-1.5 mt-3 text-sm font-medium transition-colors cursor-pointer"
                        style={{ color: chapter.color }}
                        disabled={!unlocked}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isExpanded ? 'Hide' : 'View'} Scenarios
                      </button>

                      {/* Expandable scenario list */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div
                              className="mt-3 rounded-xl p-3 grid grid-cols-1 gap-1.5"
                              style={{ background: 'var(--bg-tertiary)' }}
                            >
                              {chapter.scenarios.map((scenario, sIndex) => {
                                const isCompleted = sIndex < chapter.completedLessons;
                                return (
                                  <motion.div
                                    key={scenario}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: sIndex * 0.04 }}
                                    className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg"
                                    style={{
                                      background: isCompleted ? `${chapter.color}10` : 'transparent',
                                    }}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2
                                        size={16}
                                        style={{ color: chapter.color, flexShrink: 0 }}
                                      />
                                    ) : (
                                      <Circle
                                        size={16}
                                        style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
                                      />
                                    )}
                                    <span
                                      className="text-sm"
                                      style={{
                                        color: isCompleted
                                          ? 'var(--text-primary)'
                                          : 'var(--text-secondary)',
                                        fontWeight: isCompleted ? 600 : 400,
                                      }}
                                    >
                                      {sIndex + 1}. {scenario}
                                    </span>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Button */}
                      <div className="mt-4">
                        {buttonState === 'locked' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled
                            leftIcon={<Lock size={14} />}
                          >
                            Locked — Level {LEVEL_REQUIREMENTS[chapter.id]} required
                          </Button>
                        ) : buttonState === 'completed' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<CheckCircle2 size={14} />}
                          >
                            Completed ✨
                          </Button>
                        ) : buttonState === 'continue' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Play size={14} />}
                          >
                            Continue
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Play size={14} />}
                            style={{
                              background: `linear-gradient(135deg, ${chapter.color}, ${chapter.color}dd)`,
                            }}
                          >
                            Start Chapter
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Total Progress
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalCompleted} / {totalLessons}{' '}
                <span
                  className="text-sm font-normal"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  lessons
                </span>
              </div>
            </div>
          </div>
          <ProgressBar
            value={totalCompleted}
            max={totalLessons}
            size="sm"
            className="mt-3"
            showPercentage
          />
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <Clock size={20} style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Estimated Time
              </div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {estimatedHours}{' '}
                <span
                  className="text-sm font-normal"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  hours remaining
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            ~15 min per lesson · {totalLessons - totalCompleted} lessons left
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default CareerPage;
