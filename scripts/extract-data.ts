// Data extraction script - reads TS data files and writes JSON
// Run with: npx tsx scripts/extract-data.ts

import { writeFileSync, mkdirSync } from 'fs';
import { VOCAB_DATA } from '../src/data/vocabData';
import { KANJI_DATA } from '../src/data/kanjiData';
import { GRAMMAR_DATA } from '../src/data/grammarData';
import { READING_DATA } from '../src/data/readingData';

mkdirSync('public/data', { recursive: true });

writeFileSync('public/data/vocab.json', JSON.stringify(VOCAB_DATA, null, 2));
console.log(`✅ vocab.json: ${VOCAB_DATA.length} entries`);

writeFileSync('public/data/kanji.json', JSON.stringify(KANJI_DATA, null, 2));
console.log(`✅ kanji.json: ${KANJI_DATA.length} entries`);

writeFileSync('public/data/grammar.json', JSON.stringify(GRAMMAR_DATA, null, 2));
console.log(`✅ grammar.json: ${GRAMMAR_DATA.length} entries`);

writeFileSync('public/data/reading.json', JSON.stringify(READING_DATA, null, 2));
console.log(`✅ reading.json: ${READING_DATA.length} entries`);

console.log('\n🎉 All data extracted successfully!');
