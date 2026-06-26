import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {

  Search,
  Volume2,
  Plus,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useVocabByLevel } from '../../services/dataService';
import { useFSRSStore } from '../../stores/fsrsStore';

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const POS_FILTERS = ['All', 'Verb', 'Adjective', 'Noun', 'Adverb', 'Expression'];

export function VocabularyPage() {
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [posFilter, setPosFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { addCard, isCardAdded } = useFSRSStore();

  const { data: levelWords = [], isLoading, isError } = useVocabByLevel(selectedLevel);

  const filtered = useMemo(() => {
    return levelWords.filter((w) => {
      if (posFilter !== 'All' && w.partOfSpeech !== posFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          w.word.includes(q) ||
          w.reading.includes(q) ||
          w.meaning.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [levelWords, posFilter, search]);

  const addedCount = levelWords.filter(w => isCardAdded('vocab', w.id)).length;

  if (isLoading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--border-primary)', borderTopColor: 'transparent' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading vocabulary...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-red-500">Failed to load vocabulary data.</p>
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
          Vocabulary
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Master essential Japanese words · 単語
        </p>
      </motion.div>

      {/* JLPT Level Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-4"
      >
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {[
          { label: 'Total', value: levelWords.length, color: 'var(--text-primary)' },
          { label: 'In Deck', value: addedCount, color: '#6366f1' },
          { label: 'Showing', value: filtered.length, color: 'var(--text-tertiary)' },
        ].map((s) => (
          <div
            key={s.label}
            className="card-premium p-3 text-center overflow-hidden"
          >
            <div className="text-xl font-bold truncate" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] truncate" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search + POS Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 mb-5"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <input
            type="text"
            placeholder="Search words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <div className="flex gap-1.5 items-center flex-wrap">
          <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
          {POS_FILTERS.map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
              style={{
                background: posFilter === pos ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                color: posFilter === pos ? 'white' : 'var(--text-secondary)',
              }}
            >
              {pos}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
        <ProgressBar
          value={addedCount}
          max={levelWords.length}
          label={`${selectedLevel} Progress`}
          showPercentage
          gradient="var(--gradient-success)"
          className="mb-5"
        />
      </motion.div>

      {/* Word Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-3"
        >
          <span className="text-5xl">🔍</span>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No words match your search</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((word, i) => {
            const isExpanded = expandedId === word.id;
            const isAdded = isCardAdded('vocab', word.id);
            return (
              <motion.div
                key={word.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.05 * i, 0.5) }}
                className="rounded-xl overflow-hidden cursor-pointer transition-shadow"
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${isAdded ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-primary)'}`,
                  boxShadow: isExpanded ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                }}
                onClick={() => setExpandedId(isExpanded ? null : word.id)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                        {word.word}
                      </div>
                      <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-japanese)' }}>
                        {word.reading}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {isAdded && (
                        <Badge variant="success">added</Badge>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                        {word.partOfSpeech}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-primary)' }}>
                    {word.meaning}
                  </p>
                  <div className="flex items-center justify-end mt-1">
                    {isExpanded ? (
                      <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} />
                    ) : (
                      <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pb-4 pt-2 border-t"
                        style={{ borderColor: 'var(--border-secondary)' }}
                      >
                        <div className="mb-3">
                          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            Example
                          </div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-japanese)' }}>
                            {word.exampleJp}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {word.exampleEn}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Volume2 size={12} /> Play Audio
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white cursor-pointer"
                            style={{
                              background: isAdded ? '#22c55e' : 'var(--gradient-primary)',
                              opacity: isAdded ? 0.8 : 1,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAdded) addCard('vocab', word.id);
                            }}
                          >
                            {isAdded ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add to Flashcards</>}
                          </button>
                        </div>
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
