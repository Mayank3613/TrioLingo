/**
 * Kanji data — types and re-exports.
 * Raw data lives in /public/data/kanji.json (loaded at runtime by dataService).
 */
import kanjiJson from '../../public/data/kanji.json';

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

export const KANJI_DATA: KanjiEntry[] = kanjiJson as KanjiEntry[];

export const KANJI_BY_LEVEL = {
  N5: KANJI_DATA.filter(k => k.jlptLevel === 'N5'),
  N4: KANJI_DATA.filter(k => k.jlptLevel === 'N4'),
  N3: KANJI_DATA.filter(k => k.jlptLevel === 'N3'),
  N2: KANJI_DATA.filter(k => k.jlptLevel === 'N2'),
  N1: KANJI_DATA.filter(k => k.jlptLevel === 'N1'),
};
