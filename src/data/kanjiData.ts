/**
 * Kanji data type definitions.
 * Raw data lives in /public/data/kanji.json (loaded at runtime by dataService).
 */

export interface KanjiEntry {
  id: number;
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  strokeCount: number;
  examples: string[];
}
