/**
 * Vocabulary data — types and re-exports.
 * Raw data lives in /public/data/vocab.json (loaded at runtime by dataService).
 * This file provides synchronous imports for backward compatibility via Vite JSON import.
 */
import vocabJson from '../../public/data/vocab.json';

export interface VocabWord {
  id: number;
  word: string;
  reading: string;
  meaning: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  partOfSpeech: 'Verb' | 'Noun' | 'Adjective' | 'Adverb' | 'Particle' | 'Expression';
  exampleJp: string;
  exampleEn: string;
}

export const VOCAB_DATA: VocabWord[] = vocabJson as VocabWord[];

export const VOCAB_BY_LEVEL = {
  N5: VOCAB_DATA.filter(w => w.jlptLevel === 'N5'),
  N4: VOCAB_DATA.filter(w => w.jlptLevel === 'N4'),
  N3: VOCAB_DATA.filter(w => w.jlptLevel === 'N3'),
  N2: VOCAB_DATA.filter(w => w.jlptLevel === 'N2'),
  N1: VOCAB_DATA.filter(w => w.jlptLevel === 'N1'),
};
