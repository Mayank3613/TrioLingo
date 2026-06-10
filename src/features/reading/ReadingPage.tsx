import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookMarked,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Trophy,
  BookOpen,
  Clock,
} from 'lucide-react';
import { READING_DATA, READING_BY_LEVEL, type ReadingPassage } from '../../data/readingData';
import { useUserStore } from '../../stores/userStore';

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#3b82f6', N3: '#f97316', N2: '#a855f7', N1: '#ef4444',
};

export default function ReadingPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [activePassage, setActivePassage] = useState<ReadingPassage | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const addXP = useUserStore(s => s.addXP);

  const filteredPassages = selectedLevel === 'All' ? READING_DATA : READING_BY_LEVEL[selectedLevel as keyof typeof READING_BY_LEVEL] || [];

  const startReading = (passage: ReadingPassage) => {
    setActivePassage(passage);
    setShowTranslation(false);
    setQuizMode(false);
    setAnswers(new Array(passage.questions.length).fill(null));
    setShowResults(false);
  };

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const submitQuiz = () => {
    if (!activePassage) return;
    setShowResults(true);
    const correct = activePassage.questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
    addXP(correct * 15);
    setCompletedIds(prev => new Set(prev).add(activePassage.id));
  };

  const correctCount = activePassage?.questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0) || 0;

  // ── Passage List ──────────────────────────────────────────
  if (!activePassage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            <BookMarked className="inline mr-3 mb-1" size={28} />
            Reading
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Graded passages with comprehension questions</p>
        </div>

        {/* Level filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'N5', 'N4', 'N3', 'N2', 'N1'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{
                background: selectedLevel === level ? 'var(--gradient-primary)' : 'var(--bg-hover)',
                color: selectedLevel === level ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Passage grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPassages.map((passage, i) => {
            const isComplete = completedIds.has(passage.id);
            const color = LEVEL_COLORS[passage.jlptLevel] || '#6b7280';
            return (
              <motion.button
                key={passage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                onClick={() => startReading(passage)}
                className="p-5 rounded-xl text-left transition-all cursor-pointer relative overflow-hidden group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
              >
                {isComplete && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
                    {passage.jlptLevel}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {passage.topic}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                  {passage.title}
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}>
                  {passage.titleJp}
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="flex items-center gap-1"><BookOpen size={11} /> ~{passage.wordCount} chars</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {passage.questions.length} questions</span>
                </div>
                <ChevronRight
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--text-tertiary)' }}
                />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ── Active Reading ────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-3xl mx-auto"
    >
      {/* Back button */}
      <button
        onClick={() => setActivePassage(null)}
        className="flex items-center gap-1.5 text-sm mb-6 cursor-pointer"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <ArrowLeft size={16} /> Back to passages
      </button>

      {/* Passage header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${LEVEL_COLORS[activePassage.jlptLevel]}20`, color: LEVEL_COLORS[activePassage.jlptLevel] }}>
            {activePassage.jlptLevel}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{activePassage.topic}</span>
        </div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {activePassage.title}
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}>
          {activePassage.titleJp}
        </p>
      </div>

      {/* Passage text */}
      <div className="rounded-xl p-6 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        <div
          className="text-lg leading-relaxed"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)', lineHeight: 2 }}
        >
          {activePassage.passage}
        </div>
      </div>

      {/* Translation toggle */}
      <button
        onClick={() => setShowTranslation(!showTranslation)}
        className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg mb-6 cursor-pointer transition-colors"
        style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
      >
        {showTranslation ? <EyeOff size={14} /> : <Eye size={14} />}
        {showTranslation ? 'Hide' : 'Show'} Translation
      </button>

      <AnimatePresence>
        {showTranslation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl p-5 mb-6 overflow-hidden"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-primary)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {activePassage.translation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comprehension quiz */}
      {!quizMode ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setQuizMode(true)}
          className="w-full py-3.5 rounded-xl font-medium text-white cursor-pointer"
          style={{ background: 'var(--gradient-primary)' }}
        >
          Start Comprehension Quiz ({activePassage.questions.length} questions)
        </motion.button>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Comprehension Questions
          </h3>

          {activePassage.questions.map((q, qi) => (
            <motion.div
              key={qi}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.1 }}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
            >
              <p className="font-medium mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                {qi + 1}. {q.question}
              </p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                {q.questionEn}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrectOpt = oi === q.correctIndex;
                  let bg = 'var(--bg-hover)';
                  let border = 'transparent';
                  let color = 'var(--text-primary)';

                  if (showResults) {
                    if (isCorrectOpt) {
                      bg = '#22c55e15'; border = '#22c55e'; color = '#22c55e';
                    } else if (isSelected) {
                      bg = '#ef444415'; border = '#ef4444'; color = '#ef4444';
                    }
                  } else if (isSelected) {
                    bg = 'var(--bg-tertiary)';
                    border = 'var(--accent-primary)';
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => !showResults && handleAnswer(qi, oi)}
                      disabled={showResults}
                      className="w-full p-3 rounded-lg text-left text-sm font-medium flex items-center gap-2 cursor-pointer transition-all"
                      style={{ background: bg, border: `1.5px solid ${border}`, color }}
                    >
                      <span style={{ fontFamily: opt.match(/[\u3000-\u9fff]/) ? 'var(--font-japanese)' : 'inherit' }}>
                        {opt}
                      </span>
                      {showResults && isCorrectOpt && <CheckCircle2 size={14} className="ml-auto" />}
                      {showResults && isSelected && !isCorrectOpt && <XCircle size={14} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {!showResults ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submitQuiz}
              disabled={answers.some(a => a === null)}
              className="w-full py-3.5 rounded-xl font-medium text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Submit Answers
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-6 text-center"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
            >
              <Trophy size={32} className="mx-auto mb-2" style={{ color: '#f59e0b' }} />
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {correctCount} / {activePassage.questions.length} Correct
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                +{correctCount * 15} XP earned
              </p>
              <button
                onClick={() => setActivePassage(null)}
                className="px-6 py-2.5 rounded-xl font-medium cursor-pointer"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
              >
                Back to Passages
              </button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
