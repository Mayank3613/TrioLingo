import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  RotateCcw,
  Volume2,
  ChevronRight,
  Trophy,
  Star,
  Zap,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { VOCAB_DATA } from '../../data/vocabData';

/* ── Types ────────────────────────────────────────────────────── */
interface SpeakingExercise {
  id: number;
  japanese: string;
  reading: string;
  english: string;
  jlptLevel: string;
  type: 'word' | 'phrase';
}

/* ── Data ─────────────────────────────────────────────────────── */
const COMMON_PHRASES: SpeakingExercise[] = [
  { id: 1001, japanese: 'おはようございます', reading: 'ohayou gozaimasu', english: 'Good morning', jlptLevel: 'N5', type: 'phrase' },
  { id: 1002, japanese: 'こんにちは', reading: 'konnichiwa', english: 'Hello / Good afternoon', jlptLevel: 'N5', type: 'phrase' },
  { id: 1003, japanese: 'こんばんは', reading: 'konbanwa', english: 'Good evening', jlptLevel: 'N5', type: 'phrase' },
  { id: 1004, japanese: 'ありがとうございます', reading: 'arigatou gozaimasu', english: 'Thank you very much', jlptLevel: 'N5', type: 'phrase' },
  { id: 1005, japanese: 'すみません', reading: 'sumimasen', english: 'Excuse me / I\'m sorry', jlptLevel: 'N5', type: 'phrase' },
  { id: 1006, japanese: 'お元気ですか', reading: 'ogenki desu ka', english: 'How are you?', jlptLevel: 'N5', type: 'phrase' },
  { id: 1007, japanese: 'はじめまして', reading: 'hajimemashite', english: 'Nice to meet you', jlptLevel: 'N5', type: 'phrase' },
  { id: 1008, japanese: 'よろしくお願いします', reading: 'yoroshiku onegaishimasu', english: 'Please take care of me', jlptLevel: 'N5', type: 'phrase' },
  { id: 1009, japanese: 'いただきます', reading: 'itadakimasu', english: 'Let\'s eat (before meals)', jlptLevel: 'N5', type: 'phrase' },
  { id: 1010, japanese: 'ごちそうさまでした', reading: 'gochisousama deshita', english: 'Thank you for the meal', jlptLevel: 'N5', type: 'phrase' },
  { id: 1011, japanese: 'お疲れ様でした', reading: 'otsukaresama deshita', english: 'Good work today', jlptLevel: 'N4', type: 'phrase' },
  { id: 1012, japanese: '気をつけてください', reading: 'ki wo tsukete kudasai', english: 'Please be careful', jlptLevel: 'N4', type: 'phrase' },
  { id: 1013, japanese: 'もう一度お願いします', reading: 'mou ichido onegaishimasu', english: 'One more time please', jlptLevel: 'N4', type: 'phrase' },
  { id: 1014, japanese: 'ゆっくり話してください', reading: 'yukkuri hanashite kudasai', english: 'Please speak slowly', jlptLevel: 'N4', type: 'phrase' },
  { id: 1015, japanese: '意味がわかりません', reading: 'imi ga wakarimasen', english: 'I don\'t understand the meaning', jlptLevel: 'N4', type: 'phrase' },
];

function generateExercises(level: string): SpeakingExercise[] {
  const phrases = level === 'All' ? COMMON_PHRASES : COMMON_PHRASES.filter((p) => p.jlptLevel === level);
  const vocabWords = (level === 'All' ? VOCAB_DATA : VOCAB_DATA.filter((w) => w.jlptLevel === level))
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map((w) => ({
      id: w.id,
      japanese: w.word,
      reading: w.reading,
      english: w.meaning,
      jlptLevel: w.jlptLevel,
      type: 'word' as const,
    }));

  return [...phrases, ...vocabWords].sort(() => Math.random() - 0.5).slice(0, 10);
}

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

type Screen = 'setup' | 'practice' | 'results';

/* ── Component ────────────────────────────────────────────────── */
export function SpeakingPage() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [exercises, setExercises] = useState<SpeakingExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [selfRating, setSelfRating] = useState<number | null>(null);
  const [results, setResults] = useState<{ exercise: SpeakingExercise; rating: number }[]>([]);
  const recognitionRef = useRef<any>(null);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0;

  /* ── TTS ─────────────────────────────────────────────────────── */
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ja-JP';
    utt.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find((v) => v.lang.startsWith('ja'));
    if (jpVoice) utt.voice = jpVoice;
    window.speechSynthesis.speak(utt);
  }, []);

  /* ── Speech Recognition ─────────────────────────────────────── */
  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: just show self-rating if no speech recognition
      setIsRecording(false);
      setShowFeedback(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setIsRecording(false);
      setShowFeedback(true);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setShowFeedback(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setTranscript('');
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    setShowFeedback(true);
  }, []);

  /* ── Actions ─────────────────────────────────────────────────── */
  const startSession = () => {
    setExercises(generateExercises(selectedLevel));
    setCurrentIndex(0);
    setResults([]);
    setShowFeedback(false);
    setSelfRating(null);
    setTranscript('');
    setScreen('practice');
  };

  const handleRate = (rating: number) => {
    if (!currentExercise) return;
    setSelfRating(rating);
    setResults((r) => [...r, { exercise: currentExercise, rating }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= exercises.length) {
      setScreen('results');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setShowFeedback(false);
    setSelfRating(null);
    setTranscript('');
  };

  const avgRating = results.length > 0 ? results.reduce((s, r) => s + r.rating, 0) / results.length : 0;
  const xpEarned = results.reduce((s, r) => s + r.rating * 5, 0);

  /* ── Render Stars ────────────────────────────────────────────── */
  const renderStars = (count: number, selected: number | null, onSelect?: (n: number) => void) => (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
      {Array.from({ length: count }, (_, i) => (
        <motion.button
          key={i}
          whileHover={onSelect ? { scale: 1.2 } : undefined}
          whileTap={onSelect ? { scale: 0.9 } : undefined}
          onClick={() => onSelect?.(i + 1)}
          style={{
            background: 'none', border: 'none', cursor: onSelect ? 'pointer' : 'default', padding: '0.25rem',
          }}
        >
          <Star
            size={28}
            fill={selected !== null && i < selected ? '#f59e0b' : 'transparent'}
            color={selected !== null && i < selected ? '#f59e0b' : 'var(--text-tertiary)'}
          />
        </motion.button>
      ))}
    </div>
  );

  /* ── Setup Screen ────────────────────────────────────────────── */
  if (screen === 'setup') {
    return (
      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
                background: 'var(--gradient-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Mic size={36} color="white" />
            </motion.div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Speaking Practice
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0' }}>会話練習</p>
          </div>

          {/* Level selector */}
          <Card padding="lg" hover={false}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>JLPT Level</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {LEVELS.map((lv) => (
                <motion.button
                  key={lv} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLevel(lv)}
                  style={{
                    padding: '0.5rem 1.25rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.875rem',
                    background: selectedLevel === lv ? 'var(--gradient-accent)' : 'var(--bg-tertiary)',
                    color: selectedLevel === lv ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {lv}
                </motion.button>
              ))}
            </div>
          </Card>

          {/* How it works */}
          <Card padding="lg" hover={false} style={{ marginTop: '1rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>How It Works</p>
            {[
              { step: '1', text: 'Listen to the reference pronunciation', icon: '🔊' },
              { step: '2', text: 'Record yourself saying the word/phrase', icon: '🎙️' },
              { step: '3', text: 'Rate your own pronunciation', icon: '⭐' },
            ].map((item, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.5rem 0',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.text}</span>
              </motion.div>
            ))}
          </Card>

          {/* Mic info */}
          <Card padding="md" hover={false} style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <Mic size={16} />
              <span>10 exercises per session · Speech recognition + self-assessment</span>
            </div>
          </Card>

          {/* Start */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginTop: '1.5rem' }}>
            <button
              onClick={startSession}
              style={{
                width: '100%', padding: '1rem', border: 'none', borderRadius: '12px', cursor: 'pointer',
                background: 'var(--gradient-accent)', color: 'white',
                fontWeight: 700, fontSize: '1rem',
              }}
            >
              Start Speaking 🎙️
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
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              style={{ fontSize: '4rem', marginBottom: '1rem' }}
            >
              {avgRating >= 4 ? '🌟' : avgRating >= 3 ? '👏' : '💪'}
            </motion.div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Session Complete!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>お疲れ様でした！</p>
          </div>

          <Card padding="lg" hover={false}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Average Rating</p>
              {renderStars(5, Math.round(avgRating))}
              <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem' }}>
                {avgRating.toFixed(1)} / 5.0
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{results.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Exercises</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{xpEarned}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>XP Earned</div>
              </div>
            </div>
          </Card>

          {/* Review */}
          <Card padding="md" hover={false} style={{ marginTop: '1rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Review</p>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.5rem 0', borderBottom: i < results.length - 1 ? '1px solid var(--border-primary)' : 'none',
                }}
              >
                <div>
                  <span style={{ fontFamily: '"Noto Sans JP", sans-serif', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {r.exercise.japanese}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                    {r.exercise.english}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} size={12} fill={j < r.rating ? '#f59e0b' : 'transparent'} color={j < r.rating ? '#f59e0b' : 'var(--text-tertiary)'} />
                  ))}
                </div>
              </div>
            ))}
          </Card>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setScreen('setup')}
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
                background: 'var(--gradient-accent)', color: 'white', fontWeight: 600, cursor: 'pointer',
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
      {/* Top bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="primary">{selectedLevel}</Badge>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {currentIndex + 1} / {exercises.length}
            </span>
          </div>
          <Badge variant={currentExercise?.type === 'phrase' ? 'warning' : 'default'}>
            {currentExercise?.type === 'phrase' ? 'フレーズ Phrase' : '単語 Word'}
          </Badge>
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
              {/* Japanese text */}
              <p style={{
                fontFamily: '"Noto Sans JP", sans-serif', fontSize: currentExercise.type === 'word' ? '2.5rem' : '1.5rem',
                fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem',
              }}>
                {currentExercise.japanese}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 0.25rem' }}>
                {currentExercise.reading}
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
                {currentExercise.english}
              </p>

              {/* Listen button */}
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => speak(currentExercise.japanese)}
                style={{
                  padding: '0.5rem 1.5rem', borderRadius: '9999px', border: '2px solid var(--accent-primary)',
                  background: 'transparent', color: 'var(--accent-primary)',
                  fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <Volume2 size={18} /> Listen First
              </motion.button>

              {/* Record button */}
              {!showFeedback && (
                <div>
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={isRecording ? stopRecording : startRecording}
                    style={{
                      width: 100, height: 100, borderRadius: '50%', border: 'none', cursor: 'pointer',
                      background: isRecording ? '#ef4444' : 'var(--gradient-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1rem',
                      boxShadow: isRecording ? '0 0 0 8px rgba(239,68,68,0.2)' : '0 8px 30px rgba(139,92,246,0.3)',
                      animation: isRecording ? 'pulse 1.5s ease-in-out infinite' : 'none',
                    }}
                  >
                    {isRecording ? <MicOff size={36} color="white" /> : <Mic size={36} color="white" />}
                  </motion.button>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                    {isRecording ? 'Tap to stop recording...' : 'Tap to record your pronunciation'}
                  </p>
                  {/* Skip button */}
                  <button
                    onClick={() => setShowFeedback(true)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer',
                      fontSize: '0.8rem', marginTop: '0.75rem', textDecoration: 'underline',
                    }}
                  >
                    Skip recording, just rate yourself
                  </button>
                </div>
              )}

              {/* Feedback + Self-rating */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {transcript && (
                      <div style={{
                        padding: '0.75rem 1rem', borderRadius: '10px', background: 'var(--bg-secondary)',
                        marginBottom: '1rem',
                      }}>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', margin: '0 0 0.25rem' }}>
                          What we heard:
                        </p>
                        <p style={{
                          fontFamily: '"Noto Sans JP", sans-serif', color: 'var(--text-primary)',
                          fontSize: '1.1rem', fontWeight: 600, margin: 0,
                        }}>
                          {transcript}
                        </p>
                      </div>
                    )}

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                      Rate your pronunciation:
                    </p>
                    {renderStars(5, selfRating, handleRate)}

                    {selfRating !== null && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1rem' }}>
                        <p style={{
                          color: selfRating >= 4 ? '#22c55e' : selfRating >= 3 ? '#f59e0b' : '#ef4444',
                          fontWeight: 600, fontSize: '0.9rem',
                        }}>
                          {selfRating >= 4 ? 'Excellent! 素晴らしい！' : selfRating >= 3 ? 'Good effort! がんばって！' : 'Keep practicing! 練習しましょう！'}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {selfRating !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  style={{
                    padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: 'var(--gradient-primary)', color: 'white',
                    fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    marginTop: '1rem',
                  }}
                >
                  {currentIndex + 1 >= exercises.length ? (
                    <><Trophy size={18} /> See Results</>
                  ) : (
                    <><ChevronRight size={18} /> Next</>
                  )}
                </motion.button>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End session */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          onClick={() => setScreen('setup')}
          style={{
            background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer',
            fontSize: '0.85rem', textDecoration: 'underline',
          }}
        >
          End Session
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 8px rgba(239,68,68,0.2); }
          50% { box-shadow: 0 0 0 16px rgba(239,68,68,0.1); }
        }
      `}</style>
    </div>
  );
}

export default SpeakingPage;
