/**
 * Reading data type definitions.
 * Raw data lives in /public/data/reading.json (loaded at runtime by dataService).
 */

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
