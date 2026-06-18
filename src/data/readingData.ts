/**
 * Reading data — types and re-exports.
 * Raw data lives in /public/data/reading.json (loaded at runtime by dataService).
 */
import readingJson from '../../public/data/reading.json';

export interface ReadingPassage {
  id: number;
  title: string;
  titleJp: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  topic: string;
  passage: string;
  translation: string;
  questions: {
    question: string;
    questionEn: string;
    options: string[];
    correctIndex: number;
  }[];
  wordCount: number;
}

export const READING_DATA: ReadingPassage[] = readingJson as ReadingPassage[];

export const READING_BY_LEVEL = {
  N5: READING_DATA.filter(r => r.jlptLevel === 'N5'),
  N4: READING_DATA.filter(r => r.jlptLevel === 'N4'),
  N3: READING_DATA.filter(r => r.jlptLevel === 'N3'),
  N2: READING_DATA.filter(r => r.jlptLevel === 'N2'),
  N1: READING_DATA.filter(r => r.jlptLevel === 'N1'),
};
