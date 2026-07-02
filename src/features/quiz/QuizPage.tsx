import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Target,
  BookOpen,
  PenTool,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  useQuizStore,
  generateQuizQuestions,
} from '../../stores/quizStore';
import { useUserStore } from '../../stores/userStore';
import { useStudyStore } from '../../stores/studyStore';
import { useVocabData, useKanjiData, useGrammarData } from '../../services/dataService';

const LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1', 'All'];
const CATEGORY_OPTIONS: { key: 'vocab' | 'kanji' | 'grammar'; label: string; icon: typeof BookOpen }[] = [
  { key: 'vocab', label: 'Vocabulary', icon: BookOpen },
  { key: 'kanji', label: 'Kanji', icon: PenTool },
  { key: 'grammar', label: 'Grammar', icon: FileText },
];
const COUNT_OPTIONS = [5, 10, 15, 20];

export default function QuizPage() {
  const quiz = useQuizStore();
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

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = quiz.getCurrentQuestion();

  const handleStartQuiz = useCallback(() => {
    const questions = generateQuizQuestions(
      quiz.questionCount,
      quiz.selectedLevel,
      quiz.selectedCategories,
      quiz.selectedTypes,
      vocabData,
      kanjiData,
      grammarData
    );
    if (questions.length > 0) {
      quiz.startQuiz(questions);
      setQuestionStartTime(Date.now());
    }
  }, [quiz, vocabData, kanjiData, grammarData]);

  const handleAnswer = useCallback((answer: string) => {
    if (showFeedback) return;
    const timeSpent = Date.now() - questionStartTime;
    setSelectedAnswer(answer);
    quiz.answerQuestion(answer, timeSpent);
    setShowFeedback(true);
  }, [showFeedback, questionStartTime, quiz]);

  const handleNext = useCallback(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTypedAnswer('');
    quiz.nextQuestion();
    setQuestionStartTime(Date.now());

    if (quiz.currentIndex + 1 >= quiz.questions.length) {
      const xp = quiz.getScore() * 10;
      addXP(xp);
      addActivity({
        type: 'quiz',
        title: 'Quiz Completed',
        description: `Score: ${quiz.getScore()}/${quiz.questions.length}`,
        xpEarned: xp,
        icon: '⚡',
      });
      quiz.endQuiz();
    }
  }, [quiz, addXP, addActivity]);

  const handleSubmitTyped = useCallback(() => {
    if (typedAnswer.trim()) {
      handleAnswer(typedAnswer.trim());
    }
  }, [typedAnswer, handleAnswer]);

  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--border-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading quiz data...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-red-500">Failed to load quiz study data.</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Please check your network connection and try again.</p>
        </div>
      </div>
    );
  }

  // ── Setup Screen ──────────────────────────────────────────
  if (!quiz.isActive && quiz.results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 max-w-3xl mx-auto space-y-6"
      >

        <div className="space-y-6">
          {/* JLPT Level */}
          <div className="card-premium p-5">
            <label className="text-sm font-medium mb-3 block" style={{ color: 'var(--text-secondary)' }}>
              JLPT Level
            </label>
            <div className="flex flex-wrap gap-2">
              {LEVEL_OPTIONS.map(level => (
                <button
                  key={level}
                  onClick={() => quiz.setSettings({ selectedLevel: level })}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: quiz.selectedLevel === level ? 'var(--gradient-primary)' : 'var(--bg-hover)',
                    color: quiz.selectedLevel === level ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="card-premium p-5">
            <label className="text-sm font-medium mb-3 block" style={{ color: 'var(--text-secondary)' }}>
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(cat => {
                const isSelected = quiz.selectedCategories.includes(cat.key);
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      const next = isSelected
                        ? quiz.selectedCategories.filter(c => c !== cat.key)
                        : [...quiz.selectedCategories, cat.key];
                      if (next.length > 0) quiz.setSettings({ selectedCategories: next });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: isSelected ? 'var(--gradient-primary)' : 'var(--bg-hover)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    <cat.icon size={14} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question count */}
          <div className="card-premium p-5">
            <label className="text-sm font-medium mb-3 block" style={{ color: 'var(--text-secondary)' }}>
              Number of Questions
            </label>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => quiz.setSettings({ questionCount: n })}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: quiz.questionCount === n ? 'var(--gradient-primary)' : 'var(--bg-hover)',
                    color: quiz.questionCount === n ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartQuiz}
            className="w-full py-4 rounded-xl text-white font-semibold text-lg cursor-pointer"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Start Quiz
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── Results Screen ────────────────────────────────────────
  if (!quiz.isActive && quiz.results.length > 0) {
    const score = quiz.results.filter(r => r.isCorrect).length;
    const total = quiz.results.length;
    const accuracy = Math.round((score / total) * 100);
    const xpEarned = score * 10;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 max-w-3xl mx-auto"
      >
        <motion.div
          className="card-premium p-8 text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
            className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: accuracy >= 70 ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            <Trophy size={40} className="text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {accuracy >= 90 ? 'Perfect!' : accuracy >= 70 ? 'Great Job!' : accuracy >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            You scored {score} out of {total}
          </p>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: 'var(--accent-primary)' }}>{accuracy}%</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold" style={{ color: 'var(--accent-secondary)' }}>+{xpEarned}</div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>XP Earned</div>
            </div>
          </div>

          {/* Result breakdown */}
          <div className="space-y-2 mb-8 text-left max-w-md mx-auto">
            {quiz.questions.map((q, i) => {
              const result = quiz.results[i];
              return (
                <div
                  key={q.id}
                  className="flex items-center gap-3 p-3 rounded-lg text-sm"
                  style={{ background: 'var(--bg-hover)' }}
                >
                  {result?.isCorrect ? (
                    <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
                  ) : (
                    <XCircle size={16} style={{ color: '#ef4444' }} />
                  )}
                  <span className="flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
                    {q.promptJp || q.prompt}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {q.correctAnswer}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => quiz.resetQuiz()}
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer flex items-center gap-2"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
            >
              <RotateCcw size={16} /> New Quiz
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ── Active Quiz ───────────────────────────────────────────
  if (!currentQuestion) return null;

  const lastResult = showFeedback ? quiz.results[quiz.results.length - 1] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { quiz.endQuiz(); }}
          className="flex items-center gap-1.5 text-sm cursor-pointer"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft size={16} /> Exit
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
            {currentQuestion.jlptLevel}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {quiz.currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full mb-8 overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--gradient-primary)' }}
          animate={{ width: `${((quiz.currentIndex) / quiz.questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-premium p-6 mb-6">
            <div className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
              <Target size={12} />
              {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)} · {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 'Type Answer'}
            </div>
            {currentQuestion.promptJp && (
              <div
                className="text-4xl font-bold mb-3 text-center"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}
              >
                {currentQuestion.promptJp}
              </div>
            )}
            <div className="text-lg text-center" style={{ color: 'var(--text-secondary)' }}>
              {currentQuestion.prompt}
            </div>
          </div>

          {/* Multiple choice options */}
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                let bg = 'var(--bg-card)';
                let borderColor = 'var(--border-primary)';
                let textColor = 'var(--text-primary)';

                if (showFeedback) {
                  if (isCorrect) {
                    bg = '#22c55e15';
                    borderColor = '#22c55e';
                    textColor = '#22c55e';
                  } else if (isSelected && !isCorrect) {
                    bg = '#ef444415';
                    borderColor = '#ef4444';
                    textColor = '#ef4444';
                  }
                } else if (isSelected) {
                  bg = 'var(--bg-hover)';
                  borderColor = 'var(--accent-primary)';
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!showFeedback ? { scale: 1.01 } : {}}
                    whileTap={!showFeedback ? { scale: 0.99 } : {}}
                    onClick={() => !showFeedback && handleAnswer(option)}
                    className="w-full p-4 rounded-xl text-left font-medium transition-all duration-200 cursor-pointer flex items-center gap-3"
                    style={{ background: bg, border: `1.5px solid ${borderColor}`, color: textColor }}
                    disabled={showFeedback}
                  >
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: showFeedback && isCorrect ? '#22c55e' : 'var(--bg-hover)', color: showFeedback && isCorrect ? '#fff' : 'var(--text-tertiary)' }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ fontFamily: option.match(/[\u3000-\u9fff]/) ? 'var(--font-japanese)' : 'inherit' }}>
                      {option}
                    </span>
                    {showFeedback && isCorrect && <CheckCircle2 size={18} className="ml-auto" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle size={18} className="ml-auto" />}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Type answer */}
          {currentQuestion.type === 'type-answer' && (
            <div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={typedAnswer}
                  onChange={e => setTypedAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmitTyped()}
                  disabled={showFeedback}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSubmitTyped}
                  disabled={showFeedback || !typedAnswer.trim()}
                  className="px-6 py-3 rounded-xl font-medium text-white cursor-pointer disabled:opacity-40"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  Check
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: lastResult?.isCorrect ? '#22c55e10' : '#ef444410',
                    border: `1px solid ${lastResult?.isCorrect ? '#22c55e30' : '#ef444430'}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {lastResult?.isCorrect ? (
                      <><CheckCircle2 size={18} style={{ color: '#22c55e' }} /> <span className="font-semibold" style={{ color: '#22c55e' }}>Correct! +10 XP</span></>
                    ) : (
                      <><XCircle size={18} style={{ color: '#ef4444' }} /> <span className="font-semibold" style={{ color: '#ef4444' }}>Incorrect</span></>
                    )}
                  </div>
                  {currentQuestion.explanation && (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  {quiz.currentIndex + 1 >= quiz.questions.length ? 'See Results' : 'Next Question'}
                  <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
