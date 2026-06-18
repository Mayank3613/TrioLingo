/**
 * Grammar data type definitions.
 * Raw data lives in /public/data/grammar.json (loaded at runtime by dataService).
 */

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
