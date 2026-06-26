import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Check,

} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useGrammarByLevel } from '../../services/dataService';
import { useFSRSStore } from '../../stores/fsrsStore';

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export function GrammarPage() {
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { addCard, isCardAdded } = useFSRSStore();

  const { data: levelGrammar = [], isLoading, isError } = useGrammarByLevel(selectedLevel);

  const filtered = useMemo(() => {
    if (!search) return levelGrammar;
    const q = search.toLowerCase();
    return levelGrammar.filter(
      (g) =>
        g.pattern.includes(q) ||
        g.meaning.toLowerCase().includes(q) ||
        g.formation.toLowerCase().includes(q)
    );
  }, [levelGrammar, search]);

  const addedCount = levelGrammar.filter((g) => isCardAdded('grammar', g.id)).length;

  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--border-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading grammar...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-red-500">Failed to load grammar data.</p>
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
          Grammar
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Master Japanese grammar patterns · 文法
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total', value: levelGrammar.length, color: 'var(--text-primary)' },
          { label: 'In Deck', value: addedCount, color: '#22c55e' },
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
            placeholder="Search by pattern or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
          />
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
        <ProgressBar value={addedCount} max={levelGrammar.length} label={`${selectedLevel} Progress`} showPercentage gradient="var(--gradient-success)" className="mb-5" />
      </motion.div>

      {/* Grammar List */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-5xl">🔍</span>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No grammar points match your search</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((grammar, i) => {
            const isExpanded = expandedId === grammar.id;
            const isAdded = isCardAdded('grammar', grammar.id);
            return (
              <motion.div
                key={grammar.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.04 * i, 0.5) }}
                className="rounded-xl overflow-hidden cursor-pointer transition-shadow"
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${isAdded ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-primary)'}`,
                  boxShadow: isExpanded ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                }}
                onClick={() => setExpandedId(isExpanded ? null : grammar.id)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                        {grammar.pattern}
                      </div>
                      <div className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                        {grammar.meaning}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        {grammar.formation}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {isAdded && <Badge variant="success">added</Badge>}
                      {isExpanded ? (
                        <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
                      )}
                    </div>
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
                      <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
                        {/* Explanation */}
                        <div className="mb-3">
                          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            Explanation
                          </div>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {grammar.explanation}
                          </p>
                        </div>

                        {/* Examples */}
                        <div className="mb-3">
                          <div className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>
                            Examples
                          </div>
                          <div className="space-y-2">
                            {grammar.examples.map((ex, j) => (
                              <div key={j} className="rounded-lg p-2.5" style={{ background: 'var(--bg-hover)' }}>
                                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                                  {ex.jp}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                  {ex.en}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        {grammar.notes && (
                          <div className="mb-3 p-2.5 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                            <div className="text-xs font-semibold mb-0.5" style={{ color: '#3b82f6' }}>Note</div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {grammar.notes}
                            </p>
                          </div>
                        )}

                        {/* Add button */}
                        <button
                          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white cursor-pointer w-full"
                          style={{ background: isAdded ? '#22c55e' : 'var(--gradient-primary)', opacity: isAdded ? 0.8 : 1 }}
                          onClick={(e) => { e.stopPropagation(); if (!isAdded) addCard('grammar', grammar.id); }}
                        >
                          {isAdded ? <><Check size={12} /> Added to Flashcards</> : <><Plus size={12} /> Add to Flashcards</>}
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
