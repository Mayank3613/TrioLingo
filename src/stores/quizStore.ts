import { create } from 'zustand';
import { VOCAB_DATA, type VocabWord } from '../data/vocabData';
import { KANJI_DATA, type KanjiEntry } from '../data/kanjiData';
import { GRAMMAR_DATA, type GrammarPoint } from '../data/grammarData';

export type QuestionType = 'multiple-choice' | 'type-answer' | 'reading-match';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  promptJp?: string;
  options?: string[];
  correctAnswer: string;
  correctIndex?: number;
  category: 'vocab' | 'kanji' | 'grammar';
  jlptLevel: string;
  explanation?: string;
}

export interface QuizResult {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizState {
  isActive: boolean;
  questions: QuizQuestion[];
  currentIndex: number;
  results: QuizResult[];
  startTime: number | null;

  questionCount: number;
  selectedLevel: string;
  selectedCategories: ('vocab' | 'kanji' | 'grammar')[];
  selectedTypes: QuestionType[];

  startQuiz: (questions: QuizQuestion[]) => void;
  answerQuestion: (answer: string, timeSpent: number) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
  setSettings: (settings: Partial<Pick<QuizState, 'questionCount' | 'selectedLevel' | 'selectedCategories' | 'selectedTypes'>>) => void;

  getScore: () => number;
  getAccuracy: () => number;
  isComplete: () => boolean;
  getCurrentQuestion: () => QuizQuestion | null;
}

// ── Question generators ──────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function generateVocabMC(word: VocabWord, allWords: VocabWord[]): QuizQuestion {
  const distractors = shuffle(
    allWords.filter(w => w.id !== word.id && w.jlptLevel === word.jlptLevel)
  ).slice(0, 3).map(w => w.meaning);

  const options = shuffle([word.meaning, ...distractors]);
  return {
    id: `vocab-mc-${word.id}`,
    type: 'multiple-choice',
    prompt: `What does 「${word.word}」 mean?`,
    promptJp: word.word,
    options,
    correctAnswer: word.meaning,
    correctIndex: options.indexOf(word.meaning),
    category: 'vocab',
    jlptLevel: word.jlptLevel,
    explanation: `${word.word} (${word.reading}) means "${word.meaning}". Example: ${word.exampleJp}`,
  };
}

function generateVocabReading(word: VocabWord, allWords: VocabWord[]): QuizQuestion {
  const distractors = shuffle(
    allWords.filter(w => w.id !== word.id && w.jlptLevel === word.jlptLevel)
  ).slice(0, 3).map(w => w.reading);

  const options = shuffle([word.reading, ...distractors]);
  return {
    id: `vocab-read-${word.id}`,
    type: 'multiple-choice',
    prompt: `How do you read 「${word.word}」?`,
    promptJp: word.word,
    options,
    correctAnswer: word.reading,
    correctIndex: options.indexOf(word.reading),
    category: 'vocab',
    jlptLevel: word.jlptLevel,
    explanation: `${word.word} is read as ${word.reading} and means "${word.meaning}".`,
  };
}

function generateKanjiMC(kanji: KanjiEntry, allKanji: KanjiEntry[]): QuizQuestion {
  const distractors = shuffle(
    allKanji.filter(k => k.id !== kanji.id && k.jlptLevel === kanji.jlptLevel)
  ).slice(0, 3).map(k => k.meaning);

  const options = shuffle([kanji.meaning, ...distractors]);
  return {
    id: `kanji-mc-${kanji.id}`,
    type: 'multiple-choice',
    prompt: `What does the kanji 「${kanji.character}」 mean?`,
    promptJp: kanji.character,
    options,
    correctAnswer: kanji.meaning,
    correctIndex: options.indexOf(kanji.meaning),
    category: 'kanji',
    jlptLevel: kanji.jlptLevel,
    explanation: `${kanji.character}: ${kanji.meaning}. On: ${kanji.onyomi}, Kun: ${kanji.kunyomi}`,
  };
}

function generateKanjiReading(kanji: KanjiEntry, allKanji: KanjiEntry[]): QuizQuestion {
  const correctReading = kanji.onyomi.split('、')[0] || kanji.kunyomi.split('、')[0];
  const distractors = shuffle(
    allKanji.filter(k => k.id !== kanji.id && k.jlptLevel === kanji.jlptLevel)
  ).slice(0, 3).map(k => k.onyomi.split('、')[0] || k.kunyomi.split('、')[0]);

  const options = shuffle([correctReading, ...distractors]);
  return {
    id: `kanji-read-${kanji.id}`,
    type: 'multiple-choice',
    prompt: `What is the on'yomi reading of 「${kanji.character}」?`,
    promptJp: kanji.character,
    options,
    correctAnswer: correctReading,
    correctIndex: options.indexOf(correctReading),
    category: 'kanji',
    jlptLevel: kanji.jlptLevel,
    explanation: `${kanji.character}: On'yomi: ${kanji.onyomi}, Kun'yomi: ${kanji.kunyomi}`,
  };
}

function generateGrammarMC(point: GrammarPoint, allGrammar: GrammarPoint[]): QuizQuestion {
  const distractors = shuffle(
    allGrammar.filter(g => g.id !== point.id && g.jlptLevel === point.jlptLevel)
  ).slice(0, 3).map(g => g.meaning);

  const options = shuffle([point.meaning, ...distractors]);
  return {
    id: `grammar-mc-${point.id}`,
    type: 'multiple-choice',
    prompt: `What does the grammar pattern 「${point.pattern}」 mean?`,
    promptJp: point.pattern,
    options,
    correctAnswer: point.meaning,
    correctIndex: options.indexOf(point.meaning),
    category: 'grammar',
    jlptLevel: point.jlptLevel,
    explanation: `${point.pattern}: ${point.meaning}. ${point.explanation}`,
  };
}

function generateTypeAnswer(word: VocabWord): QuizQuestion {
  return {
    id: `vocab-type-${word.id}`,
    type: 'type-answer',
    prompt: `Type the meaning of 「${word.word}」 (${word.reading})`,
    promptJp: word.word,
    correctAnswer: word.meaning.toLowerCase().split(',')[0].trim(),
    category: 'vocab',
    jlptLevel: word.jlptLevel,
    explanation: `${word.word} (${word.reading}) means "${word.meaning}".`,
  };
}

export function generateQuizQuestions(
  count: number,
  level: string,
  categories: ('vocab' | 'kanji' | 'grammar')[],
  types: QuestionType[]
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  const filteredVocab = level === 'All' ? VOCAB_DATA : VOCAB_DATA.filter(w => w.jlptLevel === level);
  const filteredKanji = level === 'All' ? KANJI_DATA : KANJI_DATA.filter(k => k.jlptLevel === level);
  const filteredGrammar = level === 'All' ? GRAMMAR_DATA : GRAMMAR_DATA.filter(g => g.jlptLevel === level);

  const generators: (() => QuizQuestion | null)[] = [];

  if (categories.includes('vocab') && filteredVocab.length >= 4) {
    const vocabPool = pickRandom(filteredVocab, Math.min(count, filteredVocab.length));
    for (const word of vocabPool) {
      if (types.includes('multiple-choice')) {
        generators.push(() => generateVocabMC(word, filteredVocab));
        generators.push(() => generateVocabReading(word, filteredVocab));
      }
      if (types.includes('type-answer')) {
        generators.push(() => generateTypeAnswer(word));
      }
    }
  }

  if (categories.includes('kanji') && filteredKanji.length >= 4) {
    const kanjiPool = pickRandom(filteredKanji, Math.min(count, filteredKanji.length));
    for (const kanji of kanjiPool) {
      if (types.includes('multiple-choice')) {
        generators.push(() => generateKanjiMC(kanji, filteredKanji));
        generators.push(() => generateKanjiReading(kanji, filteredKanji));
      }
    }
  }

  if (categories.includes('grammar') && filteredGrammar.length >= 4) {
    const grammarPool = pickRandom(filteredGrammar, Math.min(count, filteredGrammar.length));
    for (const point of grammarPool) {
      if (types.includes('multiple-choice')) {
        generators.push(() => generateGrammarMC(point, filteredGrammar));
      }
    }
  }

  const shuffledGenerators = shuffle(generators);
  for (const gen of shuffledGenerators) {
    if (questions.length >= count) break;
    const q = gen();
    if (q && !questions.find(existing => existing.id === q.id)) {
      questions.push(q);
    }
  }

  return questions.slice(0, count);
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  isActive: false,
  questions: [],
  currentIndex: 0,
  results: [],
  startTime: null,

  questionCount: 10,
  selectedLevel: 'N5',
  selectedCategories: ['vocab', 'kanji', 'grammar'],
  selectedTypes: ['multiple-choice'],

  startQuiz: (questions) => {
    set({
      isActive: true,
      questions,
      currentIndex: 0,
      results: [],
      startTime: Date.now(),
    });
  },

  answerQuestion: (answer, timeSpent) => {
    const { questions, currentIndex, results } = get();
    const question = questions[currentIndex];
    if (!question) return;

    const isCorrect =
      question.type === 'type-answer'
        ? answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
        : answer === question.correctAnswer;

    set({
      results: [...results, {
        questionId: question.id,
        userAnswer: answer,
        isCorrect,
        timeSpent,
      }],
    });
  },

  nextQuestion: () => {
    set(state => ({ currentIndex: state.currentIndex + 1 }));
  },

  endQuiz: () => {
    set({ isActive: false });
  },

  resetQuiz: () => {
    set({
      isActive: false,
      questions: [],
      currentIndex: 0,
      results: [],
      startTime: null,
    });
  },

  setSettings: (settings) => {
    set(settings);
  },

  getScore: () => {
    return get().results.filter(r => r.isCorrect).length;
  },

  getAccuracy: () => {
    const { results } = get();
    if (results.length === 0) return 0;
    return Math.round((results.filter(r => r.isCorrect).length / results.length) * 100);
  },

  isComplete: () => {
    const { currentIndex, questions, results } = get();
    return results.length === questions.length && questions.length > 0 && currentIndex >= questions.length;
  },

  getCurrentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] || null;
  },
}));
