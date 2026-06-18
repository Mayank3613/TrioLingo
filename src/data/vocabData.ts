/**
 * Vocabulary data type definitions.
 * Raw data lives in /public/data/vocab.json (loaded at runtime by dataService).
 */

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
