import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Heart,
  User,
  Globe,
  Star
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const ICONS = [MessageCircle, Heart, User, Globe, Star];
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useKanjiByLevel } from '../../services/dataService';
import { useFSRSStore } from '../../stores/fsrsStore';

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export function KanjiPage() {
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { addCard, isCardAdded } = useFSRSStore();

  const { data: levelKanji = [], isLoading, isError } = useKanjiByLevel(selectedLevel);

  const filtered = useMemo(() => {
    if (!search) return levelKanji;
    const q = search.toLowerCase();
    return levelKanji.filter(
      (k) =>
        k.character.includes(q) ||
        k.meaning.toLowerCase().includes(q) ||
        k.onyomi.includes(q) ||
        k.kunyomi.includes(q)
    );
  }, [levelKanji, search]);

  const addedCount = levelKanji.filter((k) => isCardAdded('kanji', k.id)).length;

  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--border-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading kanji...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-red-500">Failed to load kanji data.</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Please check your network connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Kanji
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Master Japanese characters · 漢字
        </p>
      </motion.div>

      {/* JLPT Level Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-4">
        {JLPT_LEVELS.map((lv) => (
          <button
            key={lv}
            onClick={() => setSelectedLevel(lv)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: selectedLevel === lv ? 'var(--gradient-primary)' : 'var(--bg-card)',
              color: selectedLevel === lv ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${selectedLevel === lv ? 'transparent' : 'var(--border-primary)'}`,
              boxShadow: selectedLevel === lv ? 'var(--shadow-md)' : 'none',
            }}
          >
            {lv}
          </button>
        ))}
      </motion.div>

      {/* Stats Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total', value: levelKanji.length, color: 'var(--text-primary)' },
          { label: 'In Deck', value: addedCount, color: '#a855f7' },
          { label: 'Showing', value: filtered.length, color: 'var(--text-tertiary)' },
        ].map((s) => (
          <div key={s.label} className="card-premium p-3 text-center overflow-hidden">
            <div className="text-xl font-bold truncate" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search by kanji, reading, or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
          />
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
        <ProgressBar value={addedCount} max={levelKanji.length} label={`${selectedLevel} Progress`} showPercentage gradient="var(--gradient-success)" className="mb-5" />
      </motion.div>

      {/* Kanji Grid */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-5xl">🔍</span>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No kanji match your search</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((kanji, i) => {
            const isExpanded = expandedId === kanji.id;
            const isAdded = isCardAdded('kanji', kanji.id);
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={kanji.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.03 * i, 0.5) }}
                className="rounded-2xl overflow-hidden cursor-pointer transition-shadow"
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${isAdded ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-primary)'}`,
                  boxShadow: isExpanded 
                    ? 'var(--shadow-lg), var(--shadow-glow)' 
                    : 'var(--shadow-card), var(--shadow-inset)',
                }}
                onClick={() => setExpandedId(isExpanded ? null : kanji.id)}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Left Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-primary)' }}>
                    <Icon size={20} />
                  </div>
                  
                  {/* Stacked Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                      {kanji.character}
                    </div>
                    <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      {kanji.meaning}
                    </div>
                  </div>

                  {/* Right Actions / Info */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {isAdded && (
                      <Badge variant="success">added</Badge>
                    )}
                    {isExpanded ? (
                      <ChevronUp size={16} style={{ color: 'var(--text-tertiary)' }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: 'var(--text-tertiary)' }} />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-2 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
                        <div className="space-y-2 mb-3">
                          <div>
                            <div className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>On'yomi</div>
                            <div className="text-xs font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                              {kanji.onyomi || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>Kun'yomi</div>
                            <div className="text-xs font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                              {kanji.kunyomi || '—'}
                            </div>
                          </div>
                          {kanji.examples.length > 0 && (
                            <div>
                              <div className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>Examples</div>
                              {kanji.examples.slice(0, 3).map((ex, j) => (
                                <div key={j} className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}>
                                  {ex}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white cursor-pointer"
                          style={{ background: isAdded ? '#22c55e' : 'var(--gradient-primary)', opacity: isAdded ? 0.8 : 1 }}
                          onClick={(e) => { e.stopPropagation(); if (!isAdded) addCard('kanji', kanji.id); }}
                        >
                          {isAdded ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add to Flashcards</>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
