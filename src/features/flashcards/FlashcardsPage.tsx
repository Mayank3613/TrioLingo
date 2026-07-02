import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
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
import { useVocabData, useKanjiData, useGrammarData } from '../../services/dataService';
import type { VocabWord } from '../../data/vocabData';
import type { KanjiEntry } from '../../data/kanjiData';
import type { GrammarPoint } from '../../data/grammarData';
import { Rating } from 'ts-fsrs';

function getCardContent(
  card: StudyCard,
  vocabData: VocabWord[],
  kanjiData: KanjiEntry[],
  grammarData: GrammarPoint[]
) {
  if (card.type === 'vocab') {
    const word = vocabData.find(w => w.id === card.contentId);
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
    const kanji = kanjiData.find(k => k.id === card.contentId);
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
    const grammar = grammarData.find(g => g.id === card.contentId);
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

  const vocabQuery = useVocabData();
  const kanjiQuery = useKanjiData();
  const grammarQuery = useGrammarData();

  const vocabData = vocabQuery.data || [];
  const kanjiData = kanjiQuery.data || [];
  const grammarData = grammarQuery.data || [];

  const isLoading = vocabQuery.isLoading || kanjiQuery.isLoading || grammarQuery.isLoading;
  const isError = vocabQuery.isError || kanjiQuery.isError || grammarQuery.isError;

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

  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--border-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading flashcards...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-red-500">Failed to load flashcard study data.</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Please check your network connection and try again.</p>
        </div>
      </div>
    );
  }

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
  const content = currentCard ? getCardContent(currentCard, vocabData, kanjiData, grammarData) : null;
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
            className="card-premium p-8 text-center"
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
                className="btn-primary px-6 py-2.5"
              >
                Review More
              </button>
            </div>
          </motion.div>
        ) : (
          // Pre-session
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  className="card-premium p-5 text-center"
                >
                  <stat.icon size={24} className="mx-auto mb-2" style={{ color: stat.color }} />
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Card limit */}
            <div className="card-premium p-5 mb-6">
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
              className="btn-primary w-full py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {totalCards === 0
                ? 'Add cards from Vocabulary, Kanji, or Grammar pages'
                : `Start Review (${Math.min(dueCount + newCount, cardLimit)} cards)`
              }
            </motion.button>

            {totalCards === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-8 rounded-2xl text-center border-2 border-dashed"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  background: 'var(--bg-card)'
                }}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-mesh"
                >
                  <BookOpen size={32} style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Your Deck is Empty
                </h3>
                <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
                  To start studying, visit the Vocabulary, Kanji, or Grammar pages and click the "Add to Flashcards" button on any item.
                </p>
                <div className="flex justify-center gap-3">
                  <div className="stat-pill">📚 Vocabulary</div>
                  <div className="stat-pill">✍️ Kanji</div>
                  <div className="stat-pill">📖 Grammar</div>
                </div>
              </motion.div>
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
      className="p-6 max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start"
    >
      <div className="flex-1 w-full max-w-2xl mx-auto">
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

        {/* Progress bar (Segmented Dashes) */}
        <div className="flex gap-1.5 mb-8">
          {sessionCards.map((_, idx) => (
            <div
              key={idx}
              className="h-1.5 flex-1 rounded-full transition-colors duration-300"
              style={{
                background: idx < currentIdx 
                  ? 'var(--gradient-primary)' 
                  : idx === currentIdx 
                    ? 'var(--accent-primary)' 
                    : 'var(--bg-tertiary)'
              }}
            />
          ))}
        </div>

        {/* Card (3D Stacked Glassmorphic) */}
        {content && (
          <div className="perspective-[1200px] mb-12 relative">
            {/* Background stacked layers for 3D effect */}
            <div 
              className="absolute inset-0 rounded-2xl scale-[0.9] translate-y-6 opacity-30 blur-sm pointer-events-none"
              style={{ background: content.color }}
            />
            <div 
              className="absolute inset-0 rounded-2xl scale-[0.95] translate-y-3 opacity-60 pointer-events-none backdrop-blur-md"
              style={{ background: 'var(--bg-card)', border: `1px solid ${content.color}40` }}
            />
            
            <motion.div
              className="relative w-full cursor-pointer z-10"
              style={{ minHeight: 340, transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center backdrop-blur-xl"
                style={{
                  background: 'rgba(20, 25, 35, 0.45)', // translucent dark
                  border: `1px solid rgba(255, 255, 255, 0.1)`,
                  backfaceVisibility: 'hidden',
                  boxShadow: `inset 0 0 60px ${content.color}20, 0 10px 40px rgba(0,0,0,0.5)`, // inner glowing shadow
                }}
              >
                <div className="text-xs font-medium mb-6 px-4 py-1.5 rounded-full backdrop-blur-md" style={{ background: `${content.color}15`, color: content.color, border: `1px solid ${content.color}30` }}>
                  {content.detail}
                </div>
                <div
                  className="text-7xl font-bold mb-6 tracking-wide drop-shadow-2xl"
                  style={{ color: '#fff', fontFamily: 'var(--font-japanese)' }}
                >
                  {content.front}
                </div>
                {showHint ? (
                  <div className="text-xl" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}>
                    {content.frontSub}
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowHint(true); }}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl cursor-pointer transition-colors backdrop-blur-md hover:bg-white/10"
                    style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <Eye size={14} /> Show hint
                  </button>
                )}
                <div className="absolute bottom-6 text-xs uppercase tracking-widest font-semibold opacity-60" style={{ color: 'var(--text-tertiary)' }}>
                  Tap to flip
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center backdrop-blur-xl"
                style={{
                  background: 'rgba(20, 25, 35, 0.45)', // translucent dark
                  border: `1px solid rgba(255, 255, 255, 0.1)`,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  boxShadow: `inset 0 0 60px ${content.color}20, 0 10px 40px rgba(0,0,0,0.5)`, // inner glowing shadow
                }}
              >
                <div className="text-xs font-medium mb-4 px-4 py-1.5 rounded-full backdrop-blur-md" style={{ background: `${content.color}15`, color: content.color, border: `1px solid ${content.color}30` }}>
                  Answer
                </div>
                <div className="text-4xl font-bold mb-3 text-center drop-shadow-md" style={{ color: '#fff' }}>
                  {content.back}
                </div>
                <div className="text-xl mb-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}>
                  {content.frontSub}
                </div>
                {content.example && (
                  <div className="text-center w-full mt-2 p-4 rounded-xl backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="text-base mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                      {content.example}
                    </div>
                    {content.exampleEn && (
                      <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {content.exampleEn}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Rating buttons (Glowing neon borders on dark background) */}
        <div className="h-[90px]">
          <AnimatePresence>
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {RATINGS.map((r) => (
                  <motion.button
                    key={r.label}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${r.color}60, inset 0 0 10px ${r.color}30` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRating(r.rating as Rating.Again | Rating.Hard | Rating.Good | Rating.Easy)}
                    className="py-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 relative overflow-hidden group"
                    style={{ 
                      background: 'var(--bg-primary)',
                      color: r.color, 
                      border: `1px solid ${r.color}`,
                      boxShadow: `0 0 12px ${r.color}40, inset 0 0 6px ${r.color}20`,
                      textShadow: `0 0 8px ${r.color}90`
                    }}
                  >
                    <r.icon size={22} className="drop-shadow-md" />
                    <span className="tracking-wide">{r.label}</span>
                    {/* Key hint */}
                    <div className="absolute top-2 right-2.5 opacity-40 text-[10px] font-mono group-hover:opacity-100 transition-opacity">
                      {r.key}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Session Stats Panel */}
      <div className="w-full lg:w-72 mt-8 lg:mt-0 shrink-0">
        <div className="sticky top-24 card-premium p-6 rounded-2xl backdrop-blur-xl border border-white/5" style={{ background: 'rgba(20, 25, 35, 0.4)' }}>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <Trophy size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Session Stats</h3>
          </div>
          
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Correct</span>
              <span className="text-lg font-bold text-green-400">{sessionResults.correct}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total</span>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{sessionResults.total}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Accuracy</span>
              <span className="text-lg font-bold" style={{ color: 'var(--accent-secondary)' }}>
                {sessionResults.total > 0 ? Math.round((sessionResults.correct / sessionResults.total) * 100) : 0}%
              </span>
            </div>
            
            <div className="pt-5 border-t border-white/10 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>XP Earned</span>
                <span className="text-xl font-bold flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                  <Zap size={18} className="fill-current" />
                  {sessionResults.correct * 5}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
