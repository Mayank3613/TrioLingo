import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PenTool,
  RotateCcw,
  Eraser,
  ChevronRight,
  ArrowLeft,
  Flame,
  Target,
  CheckCircle2,
  Grid3X3,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const HIRAGANA_CHARS: { char: string; romaji: string }[] = [
  { char: 'あ', romaji: 'a' },
  { char: 'い', romaji: 'i' },
  { char: 'う', romaji: 'u' },
  { char: 'え', romaji: 'e' },
  { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' },
  { char: 'き', romaji: 'ki' },
  { char: 'く', romaji: 'ku' },
  { char: 'け', romaji: 'ke' },
  { char: 'こ', romaji: 'ko' },
  { char: 'さ', romaji: 'sa' },
  { char: 'し', romaji: 'shi' },
  { char: 'す', romaji: 'su' },
  { char: 'せ', romaji: 'se' },
  { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' },
  { char: 'ち', romaji: 'chi' },
  { char: 'つ', romaji: 'tsu' },
  { char: 'て', romaji: 'te' },
  { char: 'と', romaji: 'to' },
  { char: 'な', romaji: 'na' },
  { char: 'に', romaji: 'ni' },
  { char: 'ぬ', romaji: 'nu' },
  { char: 'ね', romaji: 'ne' },
  { char: 'の', romaji: 'no' },
  { char: 'は', romaji: 'ha' },
  { char: 'ひ', romaji: 'hi' },
  { char: 'ふ', romaji: 'fu' },
  { char: 'へ', romaji: 'he' },
  { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' },
  { char: 'み', romaji: 'mi' },
  { char: 'む', romaji: 'mu' },
  { char: 'め', romaji: 'me' },
  { char: 'も', romaji: 'mo' },
  { char: 'や', romaji: 'ya' },
  { char: 'ゆ', romaji: 'yu' },
  { char: 'よ', romaji: 'yo' },
  { char: 'ら', romaji: 'ra' },
  { char: 'り', romaji: 'ri' },
  { char: 'る', romaji: 'ru' },
  { char: 'れ', romaji: 're' },
  { char: 'ろ', romaji: 'ro' },
  { char: 'わ', romaji: 'wa' },
  { char: 'を', romaji: 'wo' },
  { char: 'ん', romaji: 'n' },
];

const KATAKANA_CHARS: { char: string; romaji: string }[] = [
  { char: 'ア', romaji: 'a' },
  { char: 'イ', romaji: 'i' },
  { char: 'ウ', romaji: 'u' },
  { char: 'エ', romaji: 'e' },
  { char: 'オ', romaji: 'o' },
  { char: 'カ', romaji: 'ka' },
  { char: 'キ', romaji: 'ki' },
  { char: 'ク', romaji: 'ku' },
  { char: 'ケ', romaji: 'ke' },
  { char: 'コ', romaji: 'ko' },
  { char: 'サ', romaji: 'sa' },
  { char: 'シ', romaji: 'shi' },
  { char: 'ス', romaji: 'su' },
  { char: 'セ', romaji: 'se' },
  { char: 'ソ', romaji: 'so' },
  { char: 'タ', romaji: 'ta' },
  { char: 'チ', romaji: 'chi' },
  { char: 'ツ', romaji: 'tsu' },
  { char: 'テ', romaji: 'te' },
  { char: 'ト', romaji: 'to' },
  { char: 'ナ', romaji: 'na' },
  { char: 'ニ', romaji: 'ni' },
  { char: 'ヌ', romaji: 'nu' },
  { char: 'ネ', romaji: 'ne' },
  { char: 'ノ', romaji: 'no' },
  { char: 'ハ', romaji: 'ha' },
  { char: 'ヒ', romaji: 'hi' },
  { char: 'フ', romaji: 'fu' },
  { char: 'ヘ', romaji: 'he' },
  { char: 'ホ', romaji: 'ho' },
  { char: 'マ', romaji: 'ma' },
  { char: 'ミ', romaji: 'mi' },
  { char: 'ム', romaji: 'mu' },
  { char: 'メ', romaji: 'me' },
  { char: 'モ', romaji: 'mo' },
  { char: 'ヤ', romaji: 'ya' },
  { char: 'ユ', romaji: 'yu' },
  { char: 'ヨ', romaji: 'yo' },
  { char: 'ラ', romaji: 'ra' },
  { char: 'リ', romaji: 'ri' },
  { char: 'ル', romaji: 'ru' },
  { char: 'レ', romaji: 're' },
  { char: 'ロ', romaji: 'ro' },
  { char: 'ワ', romaji: 'wa' },
  { char: 'ヲ', romaji: 'wo' },
  { char: 'ン', romaji: 'n' },
];

const KANJI_CHARS: { char: string; romaji: string }[] = [
  { char: '一', romaji: 'one' },
  { char: '二', romaji: 'two' },
  { char: '三', romaji: 'three' },
  { char: '四', romaji: 'four' },
  { char: '五', romaji: 'five' },
  { char: '六', romaji: 'six' },
  { char: '七', romaji: 'seven' },
  { char: '八', romaji: 'eight' },
  { char: '九', romaji: 'nine' },
  { char: '十', romaji: 'ten' },
  { char: '百', romaji: 'hundred' },
  { char: '千', romaji: 'thousand' },
  { char: '万', romaji: 'ten thousand' },
  { char: '円', romaji: 'yen, circle' },
  { char: '日', romaji: 'day, sun' },
  { char: '月', romaji: 'month, moon' },
  { char: '火', romaji: 'fire' },
  { char: '水', romaji: 'water' },
  { char: '木', romaji: 'tree, wood' },
  { char: '金', romaji: 'gold, money' },
  { char: '土', romaji: 'earth, soil' },
  { char: '山', romaji: 'mountain' },
  { char: '川', romaji: 'river' },
  { char: '田', romaji: 'rice field' },
  { char: '人', romaji: 'person' },
  { char: '口', romaji: 'mouth' },
  { char: '目', romaji: 'eye' },
  { char: '耳', romaji: 'ear' },
  { char: '手', romaji: 'hand' },
  { char: '足', romaji: 'foot, leg' },
  { char: '力', romaji: 'power, strength' },
  { char: '女', romaji: 'woman, female' },
  { char: '男', romaji: 'man, male' },
  { char: '子', romaji: 'child' },
  { char: '先', romaji: 'before, ahead' },
  { char: '生', romaji: 'life, birth' },
  { char: '学', romaji: 'study, learning' },
  { char: '校', romaji: 'school' },
  { char: '年', romaji: 'year' },
  { char: '何', romaji: 'what' },
  { char: '本', romaji: 'book, origin' },
  { char: '気', romaji: 'spirit, energy' },
  { char: '電', romaji: 'electricity' },
  { char: '車', romaji: 'car, vehicle' },
  { char: '東', romaji: 'east' },
  { char: '西', romaji: 'west' },
  { char: '南', romaji: 'south' },
  { char: '北', romaji: 'north' },
  { char: '国', romaji: 'country' },
  { char: '語', romaji: 'language, word' },
  { char: '食', romaji: 'eat, food' },
  { char: '飲', romaji: 'drink' },
  { char: '行', romaji: 'go, conduct' },
  { char: '来', romaji: 'come' },
  { char: '見', romaji: 'see, look' },
  { char: '聞', romaji: 'hear, listen' },
  { char: '読', romaji: 'read' },
  { char: '書', romaji: 'write' },
  { char: '話', romaji: 'talk, speak' },
  { char: '出', romaji: 'go out, exit' },
  { char: '入', romaji: 'enter, insert' },
  { char: '立', romaji: 'stand' },
  { char: '休', romaji: 'rest' },
  { char: '買', romaji: 'buy' },
  { char: '花', romaji: 'flower' },
  { char: '天', romaji: 'sky, heaven' },
  { char: '雨', romaji: 'rain' },
  { char: '白', romaji: 'white' },
  { char: '時', romaji: 'time, hour' },
  { char: '分', romaji: 'minute, part' },
  { char: '半', romaji: 'half' },
  { char: '毎', romaji: 'every' },
  { char: '今', romaji: 'now, current' },
  { char: '新', romaji: 'new' },
  { char: '古', romaji: 'old' },
  { char: '長', romaji: 'long, leader' },
  { char: '高', romaji: 'tall, expensive' },
  { char: '安', romaji: 'cheap, safe' },
  { char: '多', romaji: 'many, much' },
  { char: '少', romaji: 'few, little' },
  { char: '早', romaji: 'early, fast' },
  { char: '名', romaji: 'name' },
  { char: '前', romaji: 'before, front' },
  { char: '後', romaji: 'after, behind' },
  { char: '外', romaji: 'outside' },
  { char: '間', romaji: 'between, interval' },
  { char: '右', romaji: 'right' },
  { char: '左', romaji: 'left' },
  { char: '大', romaji: 'big, large' },
  { char: '小', romaji: 'small, little' },
  { char: '中', romaji: 'middle, inside' },
  { char: '友', romaji: 'friend' },
  { char: '父', romaji: 'father' },
  { char: '母', romaji: 'mother' },
  { char: '空', romaji: 'sky, empty' },
  { char: '森', romaji: 'forest' },
  { char: '林', romaji: 'woods' },
  { char: '犬', romaji: 'dog' },
  { char: '会', romaji: 'meet, society' },
  { char: '社', romaji: 'company' }
];

type TabId = 'hiragana' | 'katakana' | 'kanji';

interface Tab {
  id: TabId;
  label: string;
  japanese: string;
  chars: { char: string; romaji: string }[];
}

const TABS: Tab[] = [
  { id: 'hiragana', label: 'Hiragana', japanese: 'ひらがな', chars: HIRAGANA_CHARS },
  { id: 'katakana', label: 'Katakana', japanese: 'カタカナ', chars: KATAKANA_CHARS },
  { id: 'kanji', label: 'Kanji', japanese: '漢字', chars: KANJI_CHARS },
];

type Point = { x: number; y: number };

// ---------------------------------------------------------------------------
// Drawing Canvas
// ---------------------------------------------------------------------------

function DrawingCanvas({
  strokes,
  setStrokes,
}: {
  strokes: Point[][];
  setStrokes: React.Dispatch<React.SetStateAction<Point[][]>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Point[]>([]);

  const getStrokeColor = useCallback(() => {
    if (typeof window === 'undefined') return '#000';
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--text-primary')
      .trim() || '#000';
  }, []);

  const getGridColor = useCallback(() => {
    if (typeof window === 'undefined') return 'rgba(0,0,0,0.06)';
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--border-primary')
      .trim() || 'rgba(0,0,0,0.06)';
  }, []);

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;
      const gridColor = getGridColor();

      ctx.save();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.35;

      const step = 30;
      for (let x = step; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = step; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // cross guides
      ctx.globalAlpha = 0.18;
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    },
    [getGridColor],
  );

  const redraw = useCallback(
    (extraStroke?: Point[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx);

      const color = getStrokeColor();
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const allStrokes = extraStroke ? [...strokes, extraStroke] : strokes;
      for (const stroke of allStrokes) {
        if (stroke.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    },
    [strokes, drawGrid, getStrokeColor],
  );

  // initial draw & redraw when strokes change
  useEffect(() => {
    redraw();
  }, [redraw]);

  const getPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const pos = getPos(e);
    currentStrokeRef.current = [pos];
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pos = getPos(e);
    currentStrokeRef.current.push(pos);
    redraw(currentStrokeRef.current);
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (currentStrokeRef.current.length > 0) {
      setStrokes((prev) => [...prev, currentStrokeRef.current]);
      currentStrokeRef.current = [];
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{
        width: 300,
        height: 300,
        borderRadius: 'var(--radius-xl, 16px)',
        border: '2px solid var(--border-primary)',
        background: 'var(--bg-card)',
        cursor: 'crosshair',
        touchAction: 'none',
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export function WritingPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hiragana');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [practicedToday, setPracticedToday] = useState<Set<string>>(new Set());
  const [streak] = useState(3);
  const [completionMap, setCompletionMap] = useState<Record<TabId, Set<string>>>({
    hiragana: new Set(),
    katakana: new Set(),
    kanji: new Set(),
  });

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const chars = currentTab.chars;
  const selectedChar = selectedIndex !== null ? chars[selectedIndex] : null;

  // Track practiced characters
  const markPracticed = useCallback(
    (char: string) => {
      setPracticedToday((prev) => new Set(prev).add(char));
      setCompletionMap((prev) => {
        const next = { ...prev };
        next[activeTab] = new Set(prev[activeTab]).add(char);
        return next;
      });
    },
    [activeTab],
  );

  const handleSelectChar = (idx: number) => {
    setSelectedIndex(idx);
    setStrokes([]);
  };

  const handleClear = () => setStrokes([]);

  const handleUndo = () => setStrokes((prev) => prev.slice(0, -1));

  const handleNext = () => {
    if (selectedChar) markPracticed(selectedChar.char);
    if (selectedIndex !== null && selectedIndex < chars.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setStrokes([]);
    }
  };

  const handleBackToGrid = () => {
    if (selectedChar) markPracticed(selectedChar.char);
    setSelectedIndex(null);
    setStrokes([]);
  };

  const completionPct = (tabId: TabId) => {
    const tab = TABS.find((t) => t.id === tabId)!;
    const done = completionMap[tabId].size;
    return tab.chars.length > 0 ? Math.round((done / tab.chars.length) * 100) : 0;
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-6"
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg, 12px)',
            background: 'var(--gradient-primary)',
          }}
        >
          <PenTool size={24} color="white" />
        </div>
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Writing Practice
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Master stroke order through repetition
          </p>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
      >
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Practiced Today
              </p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {practicedToday.size}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <Flame size={18} style={{ color: '#f59e0b' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Streak
              </p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {streak} days
              </p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <Target size={18} style={{ color: 'var(--accent-secondary)' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {currentTab.label}
              </p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {completionPct(activeTab)}%
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex gap-2 mb-6"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedIndex(null);
                setStrokes([]);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              style={{
                background: isActive ? 'var(--gradient-primary)' : 'var(--bg-card)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: isActive ? 'none' : '1px solid var(--border-primary)',
                boxShadow: isActive ? 'var(--shadow-md)' : 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-japanese)' }}>{tab.japanese}</span>
              <span className="ml-1 hidden sm:inline">({tab.label})</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Completion bar for active tab */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <ProgressBar
          value={completionMap[activeTab].size}
          max={chars.length}
          label={`${currentTab.label} progress`}
          showPercentage
          size="sm"
          gradient="var(--gradient-primary)"
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedIndex === null ? (
          /* ---- Character Grid ---- */
          <motion.div
            key={`grid-${activeTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {/* Disclaimer notice card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card padding="md" style={{ background: 'var(--bg-tertiary)', border: '1px dashed var(--border-primary)' }}>
                <div className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">✍️</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Writing Practice Scope
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      This section covers all <strong>46 Hiragana</strong>, <strong>46 Katakana</strong>, and all <strong>100 basic JLPT N5 Kanji</strong> (expanded from 20) to master fundamental stroke orders and build muscle memory. To study higher-level JLPT N4–N1 kanji and vocabulary, please check the main <strong>Kanji</strong>, <strong>Vocabulary</strong>, and <strong>Quiz</strong> sections.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div
              className="grid gap-2.5"
              style={{
                gridTemplateColumns: 'repeat(5, 1fr)',
              }}
            >
              {chars.map((item, idx) => {
                const practiced = completionMap[activeTab].has(item.char);
                return (
                  <motion.div
                    key={item.char}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.02,
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <Card
                      hover
                      padding="sm"
                      onClick={() => handleSelectChar(idx)}
                      className="flex flex-col items-center justify-center relative"
                    >
                      {practiced && (
                        <div
                          className="absolute top-1 right-1"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          <CheckCircle2 size={12} />
                        </div>
                      )}
                      <span
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: 'var(--font-japanese)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.char}
                      </span>
                      <span
                        className="text-[10px] mt-0.5"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {item.romaji}
                      </span>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ---- Practice Mode ---- */
          <motion.div
            key={`practice-${activeTab}-${selectedIndex}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center"
          >
            {/* Back button */}
            <div className="w-full mb-4">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft size={16} />}
                onClick={handleBackToGrid}
              >
                Back to Grid
              </Button>
            </div>

            {/* Reference character */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center mb-4"
            >
              <span
                style={{
                  fontSize: '6rem',
                  fontFamily: 'var(--font-japanese)',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                }}
              >
                {selectedChar?.char}
              </span>
              <Badge variant="primary" size="md" className="mt-2">
                {selectedChar?.romaji}
              </Badge>
            </motion.div>

            {/* Progress indicator */}
            <div
              className="flex items-center gap-2 mb-4 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Grid3X3 size={14} />
              <span>
                {selectedIndex + 1} / {chars.length}
              </span>
            </div>

            {/* Canvas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card padding="md" className="flex flex-col items-center">
                <DrawingCanvas strokes={strokes} setStrokes={setStrokes} />

                {/* Action buttons */}
                <div className="flex gap-3 mt-4 w-full justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Eraser size={15} />}
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<RotateCcw size={15} />}
                    onClick={handleUndo}
                    disabled={strokes.length === 0}
                  >
                    Undo
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ChevronRight size={15} />}
                    onClick={handleNext}
                    disabled={selectedIndex >= chars.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Mini progress bar */}
            <div className="w-full max-w-xs mt-6">
              <ProgressBar
                value={selectedIndex + 1}
                max={chars.length}
                label="Practice progress"
                showPercentage
                size="sm"
                gradient="var(--gradient-success)"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default WritingPage;
