/**
 * Grammar data — types and re-exports.
 * Raw data lives in /public/data/grammar.json (loaded at runtime by dataService).
 */
import grammarJson from '../../public/data/grammar.json';

export interface GrammarPoint {
  id: number;
  pattern: string;
  meaning: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  formation: string;
  explanation: string;
  examples: { jp: string; en: string }[];
  notes: string;
}

export const GRAMMAR_DATA: GrammarPoint[] = grammarJson as GrammarPoint[];

export const GRAMMAR_BY_LEVEL = {
  N5: GRAMMAR_DATA.filter(g => g.jlptLevel === 'N5'),
  N4: GRAMMAR_DATA.filter(g => g.jlptLevel === 'N4'),
  N3: GRAMMAR_DATA.filter(g => g.jlptLevel === 'N3'),
  N2: GRAMMAR_DATA.filter(g => g.jlptLevel === 'N2'),
  N1: GRAMMAR_DATA.filter(g => g.jlptLevel === 'N1'),
};
