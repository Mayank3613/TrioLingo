import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  RotateCcw,
  Zap,
  CheckCircle2,
  XCircle,
  BookOpen,
  Trophy,
  ArrowLeft,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useFSRSStore, type StudyCard } from '../../stores/fsrsStore';
import { useUserStore } from '../../stores/userStore';
import { useStudyStore } from '../../stores/studyStore';
import { VOCAB_DATA } from '../../data/vocabData';
import { KANJI_DATA } from '../../data/kanjiData';
import { GRAMMAR_DATA } from '../../data/grammarData';
import { Rating } from 'ts-fsrs';

function getCardContent(card: StudyCard) {
  if (card.type === 'vocab') {
    const word = VOCAB_DATA.find(w => w.id === card.contentId);
    if (!word) return null;
    return {
      front: word.word,
      frontSub: word.reading,
      back: word.meaning,
      detail: `${word.partOfSpeech} · ${word.jlptLevel}`,
      example: word.exampleJp,
      exampleEn: word.exampleEn,
      color: 'var(--accent-primary)',
    };
  }
  if (card.type === 'kanji') {
    const kanji = KANJI_DATA.find(k => k.id === card.contentId);
    if (!kanji) return null;
    return {
      front: kanji.character,
      frontSub: `${kanji.onyomi} / ${kanji.kunyomi}`,
      back: kanji.meaning,
      detail: `${kanji.strokeCount} strokes · ${kanji.jlptLevel}`,
      example: kanji.examples[0] || '',
      exampleEn: '',
      color: 'var(--accent-secondary)',
    };
  }
  if (card.type === 'grammar') {
    const grammar = GRAMMAR_DATA.find(g => g.id === card.contentId);
    if (!grammar) return null;
    return {
      front: grammar.pattern,
      frontSub: grammar.formation,
      back: grammar.meaning,
      detail: grammar.jlptLevel,
      example: grammar.examples[0]?.jp || '',
      exampleEn: grammar.examples[0]?.en || '',
      color: 'var(--accent-tertiary)',
    };
  }
  return null;
}

const RATINGS = [
  { rating: Rating.Again, label: 'Again', color: '#ef4444', icon: XCircle, key: '1' },
  { rating: Rating.Hard, label: 'Hard', color: '#f97316', icon: RotateCcw, key: '2' },
  { rating: Rating.Good, label: 'Good', color: '#22c55e', icon: CheckCircle2, key: '3' },
  { rating: Rating.Easy, label: 'Easy', color: '#3b82f6', icon: Sparkles, key: '4' },
];

export default function FlashcardsPage() {
  const { getReviewableCards, getDueCount, getNewCards, getTotalCards, reviewCard } = useFSRSStore();
  const addXP = useUserStore(s => s.addXP);
  const addActivity = useStudyStore(s => s.addActivity);

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCards, setSessionCards] = useState<StudyCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [cardLimit, setCardLimit] = useState(20);

  const dueCount = getDueCount();
  const newCount = getNewCards().length;
  const totalCards = getTotalCards();

  const startSession = useCallback(() => {
    const cards = getReviewableCards(cardLimit);
    if (cards.length === 0) return;
    setSessionCards(cards);
    setCurrentIdx(0);
    setIsFlipped(false);
    setShowHint(false);
    setSessionResults({ correct: 0, total: 0 });
    setSessionComplete(false);
    setSessionActive(true);
  }, [getReviewableCards, cardLimit]);

  const handleRating = useCallback((rating: Rating.Again | Rating.Hard | Rating.Good | Rating.Easy) => {
    const card = sessionCards[currentIdx];
    if (!card) return;

    reviewCard(card.id, rating);
    const isCorrect = rating >= Rating.Good;

    setSessionResults(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (isCorrect) {
      addXP(5);
    }

    const next = currentIdx + 1;
    if (next >= sessionCards.length) {
      setSessionComplete(true);
      addActivity({
        type: 'review',
        title: 'Flashcard Review',
        description: `Reviewed ${sessionCards.length} cards`,
        xpEarned: sessionResults.correct * 5 + (isCorrect ? 5 : 0),
        icon: '🃏',
      });
    } else {
      setCurrentIdx(next);
      setIsFlipped(false);
      setShowHint(false);
    }
  }, [sessionCards, currentIdx, reviewCard, addXP, addActivity, sessionResults]);

  const currentCard = sessionActive ? sessionCards[currentIdx] : null;
  const content = currentCard ? getCardContent(currentCard) : null;
  const progress = sessionCards.length > 0 ? ((currentIdx) / sessionCards.length) * 100 : 0;

  // ── Pre-session screen ────────────────────────────────────
  if (!sessionActive || sessionComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-3xl mx-auto"
      >
        {sessionComplete ? (
          // Session Complete
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="rounded-2xl p-8 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Trophy size={36} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Session Complete!
            </h2>
            <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
              {sessionResults.correct} / {sessionResults.total} correct
              {' '}({sessionResults.total > 0 ? Math.round((sessionResults.correct / sessionResults.total) * 100) : 0}%)
            </p>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  +{sessionResults.correct * 5}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>XP Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: 'var(--accent-secondary)' }}>
                  {sessionResults.total}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Cards Reviewed</div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSessionComplete(false); setSessionActive(false); }}
                className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
              >
                Back to Overview
              </button>
              <button
                onClick={startSession}
                className="px-6 py-2.5 rounded-xl font-medium text-white transition-all duration-200 cursor-pointer"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Review More
              </button>
            </div>
          </motion.div>
        ) : (
          // Pre-session
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                <Layers className="inline mr-3 mb-1" size={28} />
                Flashcards
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Review your cards with spaced repetition
              </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Due Now', value: dueCount, icon: Zap, color: '#f97316' },
                { label: 'New Cards', value: newCount, icon: Sparkles, color: '#3b82f6' },
                { label: 'Total Cards', value: totalCards, icon: BookOpen, color: '#8b5cf6' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl p-5 text-center"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}
                >
                  <stat.icon size={24} className="mx-auto mb-2" style={{ color: stat.color }} />
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Card limit */}
            <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <label className="text-sm font-medium mb-3 block" style={{ color: 'var(--text-secondary)' }}>
                Cards per session
              </label>
              <div className="flex gap-2">
                {[10, 20, 30, 50].map(n => (
                  <button
                    key={n}
                    onClick={() => setCardLimit(n)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: cardLimit === n ? 'var(--gradient-primary)' : 'var(--bg-hover)',
                      color: cardLimit === n ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startSession}
              disabled={totalCards === 0}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {totalCards === 0
                ? 'Add cards from Vocabulary, Kanji, or Grammar pages'
                : `Start Review (${Math.min(dueCount + newCount, cardLimit)} cards)`
              }
            </motion.button>

            {totalCards === 0 && (
              <p className="text-center mt-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                💡 Visit the Vocabulary, Kanji, or Grammar pages and click "Add to Flashcards" to build your deck.
              </p>
            )}
          </>
        )}
      </motion.div>
    );
  }

  // ── Active session ────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSessionActive(false)}
          className="flex items-center gap-1.5 text-sm cursor-pointer"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft size={16} /> Exit
        </button>
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {currentIdx + 1} / {sessionCards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full mb-8 overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--gradient-primary)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Card */}
      {content && (
        <div className="perspective-[1200px] mb-8">
          <motion.div
            className="relative w-full cursor-pointer"
            style={{ minHeight: 320, transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center"
              style={{
                background: 'var(--bg-card)',
                border: `2px solid ${content.color}`,
                backfaceVisibility: 'hidden',
                boxShadow: `0 0 40px ${content.color}15`,
              }}
            >
              <div className="text-xs font-medium mb-4 px-3 py-1 rounded-full" style={{ background: `${content.color}20`, color: content.color }}>
                {content.detail}
              </div>
              <div
                className="text-5xl font-bold mb-4"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}
              >
                {content.front}
              </div>
              {showHint ? (
                <div className="text-lg" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}>
                  {content.frontSub}
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowHint(true); }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                  style={{ color: 'var(--text-tertiary)', background: 'var(--bg-hover)' }}
                >
                  <Eye size={12} /> Show hint
                </button>
              )}
              <div className="absolute bottom-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Tap to flip
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center"
              style={{
                background: 'var(--bg-card)',
                border: `2px solid ${content.color}`,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                boxShadow: `0 0 40px ${content.color}15`,
              }}
            >
              <div className="text-xs font-medium mb-4 px-3 py-1 rounded-full" style={{ background: `${content.color}20`, color: content.color }}>
                Answer
              </div>
              <div className="text-3xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
                {content.back}
              </div>
              <div className="text-lg mb-4" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}>
                {content.frontSub}
              </div>
              {content.example && (
                <div className="text-center mt-2 p-3 rounded-lg" style={{ background: 'var(--bg-hover)' }}>
                  <div className="text-sm mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                    {content.example}
                  </div>
                  {content.exampleEn && (
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {content.exampleEn}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Rating buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-4 gap-3"
          >
            {RATINGS.map((r) => (
              <motion.button
                key={r.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRating(r.rating as Rating.Again | Rating.Hard | Rating.Good | Rating.Easy)}
                className="py-3 rounded-xl font-medium text-sm flex flex-col items-center gap-1.5 cursor-pointer transition-colors"
                style={{ background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}30` }}
              >
                <r.icon size={18} />
                {r.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
