import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { VocabWord } from '../data/vocabData';
import type { KanjiEntry } from '../data/kanjiData';
import type { GrammarPoint } from '../data/grammarData';
import type { ReadingPassage } from '../data/readingData';

// In-memory cache shared across React Query instances
const dataCache = new Map<string, unknown>();

async function loadData<T>(filename: string): Promise<T> {
  const cached = dataCache.get(filename);
  if (cached) return cached as T;

  const response = await fetch(`/data/${filename}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load data: ${filename} (HTTP ${response.status})`);
  }

  const data: T = await response.json();
  dataCache.set(filename, data);
  return data;
}

// Default query options for data that rarely changes
const dataQueryOptions = {
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  retry: 2,
} as const;

/* ——— React Query Hooks ——— */

export function useVocabData(): UseQueryResult<VocabWord[]> {
  return useQuery({
    queryKey: ['data', 'vocab'],
    queryFn: () => loadData<VocabWord[]>('vocab'),
    ...dataQueryOptions,
  });
}

export function useKanjiData(): UseQueryResult<KanjiEntry[]> {
  return useQuery({
    queryKey: ['data', 'kanji'],
    queryFn: () => loadData<KanjiEntry[]>('kanji'),
    ...dataQueryOptions,
  });
}

export function useGrammarData(): UseQueryResult<GrammarPoint[]> {
  return useQuery({
    queryKey: ['data', 'grammar'],
    queryFn: () => loadData<GrammarPoint[]>('grammar'),
    ...dataQueryOptions,
  });
}

export function useReadingData(): UseQueryResult<ReadingPassage[]> {
  return useQuery({
    queryKey: ['data', 'reading'],
    queryFn: () => loadData<ReadingPassage[]>('reading'),
    ...dataQueryOptions,
  });
}

/* ——— Filtered hooks ——— */

export function useVocabByLevel(level?: string): UseQueryResult<VocabWord[]> {
  const query = useVocabData();
  return {
    ...query,
    data: level ? query.data?.filter(w => w.jlptLevel === level) : query.data,
  } as UseQueryResult<VocabWord[]>;
}

export function useKanjiByLevel(level?: string): UseQueryResult<KanjiEntry[]> {
  const query = useKanjiData();
  return {
    ...query,
    data: level ? query.data?.filter(k => k.jlptLevel === level) : query.data,
  } as UseQueryResult<KanjiEntry[]>;
}

export function useGrammarByLevel(level?: string): UseQueryResult<GrammarPoint[]> {
  const query = useGrammarData();
  return {
    ...query,
    data: level ? query.data?.filter(g => g.jlptLevel === level) : query.data,
  } as UseQueryResult<GrammarPoint[]>;
}

/* ——— Imperative loaders (for stores/non-React contexts) ——— */

export async function fetchVocabData(): Promise<VocabWord[]> {
  return loadData<VocabWord[]>('vocab');
}

export async function fetchKanjiData(): Promise<KanjiEntry[]> {
  return loadData<KanjiEntry[]>('kanji');
}

export async function fetchGrammarData(): Promise<GrammarPoint[]> {
  return loadData<GrammarPoint[]>('grammar');
}

export async function fetchReadingData(): Promise<ReadingPassage[]> {
  return loadData<ReadingPassage[]>('reading');
}
