import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Headphones,
  Play,
  Pause,
  Volume2,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useVocabData } from '../../services/dataService';
import type { VocabWord } from '../../data/vocabData';

/* ── Types ────────────────────────────────────────────────────── */
interface ListeningExercise {
  id: number;
  japanese: string;
  reading: string;
  english: string;
  jlptLevel: string;
  type: 'word' | 'sentence';
}

/* ── Data generator ───────────────────────────────────────────── */
function generateExercises(level: string, vocabData: VocabWord[]): ListeningExercise[] {
  const filtered = level === 'All' ? vocabData : vocabData.filter((w) => w.jlptLevel === level);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  const exercises: ListeningExercise[] = [];
  for (const w of shuffled.slice(0, 15)) {
    // Word exercise
    exercises.push({
      id: w.id * 10,
      japanese: w.word,
      reading: w.reading,
      english: w.meaning,
      jlptLevel: w.jlptLevel,
      type: 'word',
    });
    // Sentence exercise
    exercises.push({
      id: w.id * 10 + 1,
      japanese: w.exampleJp,
      reading: '',
      english: w.exampleEn,
      jlptLevel: w.jlptLevel,
      type: 'sentence',
    });
  }
  return exercises.sort(() => Math.random() - 0.5).slice(0, 10);
}

/* ── Speed options ────────────────────────────────────────────── */
const SPEEDS = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1.0 },
  { label: '1.25x', value: 1.25 },
];

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

type Screen = 'setup' | 'practice' | 'results';

/* ── Component ────────────────────────────────────────────────── */
export function ListeningPage() {
  const { data: vocabData = [], isLoading, isError } = useVocabData();

  const [screen, setScreen] = useState<Screen>('setup');
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; exercise: ListeningExercise }[]>([]);
  const [mode, setMode] = useState<'listen' | 'dictation'>('listen');
  const [hasJpVoice, setHasJpVoice] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0;

  /* ── TTS ─────────────────────────────────────────────────────── */
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ja-JP';
    utt.rate = speed;
    utt.onstart = () => setIsPlaying(true);
    utt.onend = () => setIsPlaying(false);
    utt.onerror = () => setIsPlaying(false);
    synthRef.current = utt;

    // Try to find a Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find((v) => v.lang.startsWith('ja'));
    if (jpVoice) utt.voice = jpVoice;

    window.speechSynthesis.speak(utt);
  }, [speed]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  // Load voices and check for Japanese voice availability
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setHasJpVoice(false);
      return;
    }

    const checkJpVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const hasJp = voices.some((v) => v.lang.toLowerCase().startsWith('ja'));
      setHasJpVoice(hasJp);
    };

    checkJpVoice();
    
    window.speechSynthesis.addEventListener('voiceschanged', checkJpVoice);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', checkJpVoice);
  }, []);

  /* ── Actions ─────────────────────────────────────────────────── */
  const startSession = () => {
    const ex = generateExercises(selectedLevel, vocabData);
    setExercises(ex);
    setCurrentIndex(0);
    setResults([]);
    setShowAnswer(false);
    setSubmitted(false);
    setUserInput('');
    setScreen('practice');
  };

  const handleSubmitDictation = () => {
    if (!currentExercise || submitted) return;
    const isCorrect = userInput.trim().toLowerCase() === currentExercise.english.toLowerCase().split(',')[0].trim();
    setResults((r) => [...r, { correct: isCorrect, exercise: currentExercise }]);
    setSubmitted(true);
    setShowAnswer(true);
  };

  const handleReveal = () => {
    if (!submitted) {
      setResults((r) => [...r, { correct: true, exercise: currentExercise }]);
      setSubmitted(true);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    stopSpeaking();
    if (currentIndex + 1 >= exercises.length) {
      setScreen('results');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setShowAnswer(false);
    setSubmitted(false);
    setUserInput('');
  };

  const correctCount = results.filter((r) => r.correct).length;
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  /* ── Setup Screen ────────────────────────────────────────────── */
  if (screen === 'setup') {
    if (isLoading) {
      return (
        <div className="p-6 h-full flex items-center justify-center animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--border-primary)', borderTopColor: 'transparent' }}
            />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading listening data...</span>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="font-semibold text-red-500">Failed to load listening practice assets.</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Please check your network connection and try again.</p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Headphones size={36} color="white" />
            </motion.div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Listening Practice
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0' }}>聴解練習</p>
          </div>

          {/* TTS voice check warning */}
          {!hasJpVoice && (
            <Card padding="md" style={{ border: '1px solid var(--border-warning, #f59e0b)', background: 'var(--bg-warning, rgba(245, 158, 11, 0.05))', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>🔊</span>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#d97706' }}>Japanese Voice Not Detected</h4>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    To ensure high-quality listening practice, please install or enable a Japanese text-to-speech voice in your device settings (e.g., Siri, Google Japanese, or Microsoft Language Pack).
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* JLPT Level */}
          <Card padding="lg" hover={false}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>JLPT Level</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {LEVELS.map((lv) => (
                <motion.button
                  key={lv} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLevel(lv)}
                  style={{
                    padding: '0.5rem 1.25rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                    background: selectedLevel === lv ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                    color: selectedLevel === lv ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {lv}
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Mode */}
          <Card padding="lg" hover={false} style={{ marginTop: '1rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Practice Mode</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {(['listen', 'dictation'] as const).map((m) => (
                <motion.button
                  key={m} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid',
                    borderColor: mode === m ? 'var(--accent-primary)' : 'var(--border-primary)',
                    background: mode === m ? 'var(--accent-primary)10' : 'var(--bg-secondary)',
                    cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                    {m === 'listen' ? '👂' : '✍️'}
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {m === 'listen' ? 'Listen & Reveal' : 'Dictation'}
                  </div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {m === 'listen' ? 'Listen then see the answer' : 'Type what you hear'}
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Speed */}
          <Card padding="lg" hover={false} style={{ marginTop: '1rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Playback Speed</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {SPEEDS.map((s) => (
                <motion.button
                  key={s.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSpeed(s.value)}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '8px', border: '2px solid',
                    borderColor: speed === s.value ? 'var(--accent-primary)' : 'var(--border-primary)',
                    background: speed === s.value ? 'var(--accent-primary)' : 'transparent',
                    color: speed === s.value ? 'white' : 'var(--text-secondary)',
                    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  }}
                >
                  {s.label}
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Info */}
          <Card padding="md" hover={false} style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <Volume2 size={16} />
              <span>10 exercises per session · Uses your device's Japanese TTS voice</span>
            </div>
          </Card>

          {/* Start */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginTop: '1.5rem' }}>
            <button
              onClick={startSession}
              style={{
                width: '100%', padding: '1rem', border: 'none', borderRadius: '12px', cursor: 'pointer',
                background: 'var(--gradient-primary)', color: 'white',
                fontWeight: 700, fontSize: '1rem',
              }}
            >
              Start Listening 🎧
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* ── Results Screen ──────────────────────────────────────────── */
  if (screen === 'results') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              style={{ fontSize: '4rem', marginBottom: '1rem' }}
            >
              {accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}
            </motion.div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Session Complete!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>お疲れ様でした！</p>
          </div>

          <Card padding="lg" hover={false}>
            {/* Score circle */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
                background: `conic-gradient(var(--accent-primary) ${accuracy * 3.6}deg, var(--bg-tertiary) 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{accuracy}%</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Accuracy</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{correctCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Correct</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{results.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{correctCount * 5}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>XP Earned</div>
              </div>
            </div>
          </Card>

          {/* Review */}
          <Card padding="md" hover={false} style={{ marginTop: '1rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Review</p>
            {results.map((r, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.5rem 0', borderBottom: i < results.length - 1 ? '1px solid var(--border-primary)' : 'none',
                }}
              >
                {r.correct ? <CheckCircle2 size={16} color="#22c55e" /> : <XCircle size={16} color="#ef4444" />}
                <span style={{ fontFamily: '"Noto Sans JP", sans-serif', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {r.exercise.japanese}
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginLeft: 'auto' }}>
                  {r.exercise.english}
                </span>
              </motion.div>
            ))}
          </Card>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setScreen('setup'); stopSpeaking(); }}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: '10px', border: '2px solid var(--border-primary)',
                background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              New Session
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={startSession}
              style={{
                flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none',
                background: 'var(--gradient-primary)', color: 'white', fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Zap size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Practice Screen ─────────────────────────────────────────── */
  return (
    <div style={{ padding: '2rem', maxWidth: '650px', margin: '0 auto' }}>
      {/* TTS voice check warning */}
      {!hasJpVoice && (
        <Card padding="md" style={{ border: '1px solid var(--border-warning, #f59e0b)', background: 'var(--bg-warning, rgba(245, 158, 11, 0.05))', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.25rem' }}>🔊</span>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#d97706' }}>Japanese Voice Not Detected</h4>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Please install or enable a Japanese text-to-speech voice in your device settings to hear standard pronunciation.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Top bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="primary">{selectedLevel}</Badge>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {currentIndex + 1} / {exercises.length}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSpeed(s.value)}
                style={{
                  padding: '0.25rem 0.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  fontSize: '0.7rem', fontWeight: 600,
                  background: speed === s.value ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: speed === s.value ? 'white' : 'var(--text-tertiary)',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <ProgressBar value={progress} max={100} />
      </motion.div>

      {/* Exercise card */}
      <AnimatePresence mode="wait">
        {currentExercise && (
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="lg" hover={false} style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              {/* Type badge */}
              <Badge variant={currentExercise.type === 'word' ? 'primary' : 'warning'} style={{ marginBottom: '1.5rem' }}>
                {currentExercise.type === 'word' ? '単語 Word' : '文 Sentence'}
              </Badge>

              {/* Play button */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => isPlaying ? stopSpeaking() : speak(currentExercise.japanese)}
                style={{
                  width: 100, height: 100, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: isPlaying ? 'var(--gradient-accent)' : 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
                }}
              >
                {isPlaying ? <Pause size={36} color="white" /> : <Play size={36} color="white" style={{ marginLeft: 4 }} />}
              </motion.button>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                Tap to {isPlaying ? 'pause' : 'play'}
              </p>

              {/* Answer area */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-secondary)',
                      marginBottom: '1rem',
                    }}>
                      <p style={{
                        fontFamily: '"Noto Sans JP", sans-serif', fontSize: currentExercise.type === 'word' ? '2rem' : '1.25rem',
                        fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem',
                      }}>
                        {currentExercise.japanese}
                      </p>
                      {currentExercise.reading && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>
                          {currentExercise.reading}
                        </p>
                      )}
                      <p style={{ color: 'var(--accent-primary)', fontWeight: 600, margin: 0 }}>
                        {currentExercise.english}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dictation input */}
              {mode === 'dictation' && !showAnswer && (
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    ref={inputRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitDictation()}
                    placeholder="Type the meaning in English..."
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '1rem',
                      border: '2px solid var(--border-primary)', background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                    }}
                    autoFocus
                  />
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                {!showAnswer && mode === 'listen' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleReveal}
                    style={{
                      padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                      fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}
                  >
                    <Eye size={18} /> Reveal Answer
                  </motion.button>
                )}

                {!showAnswer && mode === 'dictation' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitDictation}
                    disabled={!userInput.trim()}
                    style={{
                      padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: userInput.trim() ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                      color: userInput.trim() ? 'white' : 'var(--text-tertiary)',
                      fontWeight: 600,
                    }}
                  >
                    Check Answer
                  </motion.button>
                )}

                {showAnswer && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    style={{
                      padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: 'var(--gradient-primary)', color: 'white',
                      fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}
                  >
                    {currentIndex + 1 >= exercises.length ? (
                      <><Trophy size={18} /> See Results</>
                    ) : (
                      <><ChevronRight size={18} /> Next</>
                    )}
                  </motion.button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quit button */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          onClick={() => { stopSpeaking(); setScreen('setup'); }}
          style={{
            background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer',
            fontSize: '0.85rem', textDecoration: 'underline',
          }}
        >
          End Session
        </button>
      </div>
    </div>
  );
}

export default ListeningPage;
