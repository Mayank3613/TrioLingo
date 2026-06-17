<p align="center">
  <img src="https://img.shields.io/badge/🎌-TrioLingo++-6366f1?style=for-the-badge&labelColor=0f172a" alt="TrioLingo++" height="40"/>
</p>

<h1 align="center">TrioLingo++</h1>
<h3 align="center">🇯🇵 The Ultimate Japanese Language Learning & JLPT Preparation Platform</h3>

<p align="center">
  <em>Master Japanese from absolute beginner to JLPT N1 — beautifully.</em>
  <br />
  🚀 <strong><a href="https://triolingolang.netlify.app">Live Web App Demo</a></strong>
</p>


<p align="center">
  <img src="https://img.shields.io/badge/Tauri-2.0-blue?style=flat-square&logo=tauri&logoColor=white" alt="Tauri 2"/>
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind v4"/>
  <img src="https://img.shields.io/badge/Platform-Win%20%7C%20Mac%20%7C%20Linux-brightgreen?style=flat-square" alt="Cross Platform"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License"/>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-themes">Themes</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## ✨ What is TrioLingo++?

**TrioLingo++** is a production-grade, cross-platform desktop application that combines the best of **Duolingo's** gamification, **Anki's** spaced repetition, and professional **JLPT preparation** platforms into a single, gorgeous, offline-first experience.

Whether you're learning your first hiragana or grinding for the N1 exam, TrioLingo++ provides a structured, engaging, and addictive learning journey through the Japanese language.

> 🎯 **Mission:** Create the most comprehensive, beautiful, and effective JLPT preparation app available.

---

## 🚀 Features

### 📚 Core Learning Modules
| Module | Description | Status |
|--------|-------------|--------|
| **Vocabulary** | 400+ words with JLPT N5→N1 filtering, FSRS flashcard integration | ✅ Built |
| **Kanji** | 300 kanji with On/Kun readings, stroke count, examples, FSRS integration | ✅ Built |
| **Grammar** | 100 grammar points with formations, examples, notes, FSRS integration | ✅ Built |
| **Reading** | 15 graded passages (N5–N1) with comprehension quizzes & translation toggle | ✅ Built |
| **Listening** | TTS-powered audio exercises with dictation mode, speed controls, JLPT levels | ✅ Built |
| **Speaking** | Pronunciation practice with Web Speech API, self-rating, session results | ✅ Built |
| **Writing** | Canvas stroke practice for hiragana (46), katakana (46), kanji (20) with undo | ✅ Built |

### 🧠 Study Tools
- **🃏 Flashcards** — ✅ FSRS-powered spaced repetition with 3D card flip, rating buttons (Again/Hard/Good/Easy), session stats
- **⚡ Quick Quizzes** — ✅ Adaptive quizzes with multiple-choice & type-answer, JLPT level/category selection, results breakdown
- **👤 Profile** — ✅ Editable avatar, XP progress, study heatmap (16 weeks), flashcard category breakdown
- **🎓 Mock Exams** — ✅ Full JLPT simulation with 30 timed questions across vocab/kanji/grammar sections, animated score reveal, pass/fail with confetti
- **🤖 AI Tutor** — ✅ Simulated chat interface with 6 conversation topics, typing indicators, guided dialogue with XP rewards
- **📊 Analytics** — ✅ Study analytics dashboard with XP chart, category pie chart, JLPT progress bars, GitHub-style heatmap
- **🔍 Search** — ✅ Unified search across all data sets with category filters, type-specific result cards, debounced filtering
- **🎮 Mini Games** — ✅ 3 playable games: Word Match, Kanji Memory, Speed Type

### 🎮 Gamification & Engagement
- **🔥 Streak System** — Daily study streaks with flame animations
- **⭐ XP & Leveling** — Earn XP for every activity, level up with titles
- **🪙 Coin Economy** — Earn coins to unlock premium themes and content
- **🏆 24+ Achievements** — Across 7 categories including hidden achievements
- **🗺️ Career Mode** — ✅ Story-driven learning path with 5 chapters (N5→N1), scenario lists, level-gated progression

### 🎨 6 Premium Themes
| Theme | Vibe | Unlock |
|-------|------|--------|
| ☀️ **Light** | Clean & minimal | Default |
| 🌙 **Dark** | Sleek slate-blue | Default |
| ⚫ **AMOLED** | Pure black with neon glows | Default |
| 🌸 **Sakura** | Pink cherry blossom aesthetic | Level 10 |
| 🏙️ **Cyber Tokyo** | Neon green cyberpunk | Level 25 |
| 🏯 **Traditional** | Warm earth tones & gold | Level 40 |

### 💎 UI/UX Excellence
- **Glassmorphism** effects and gradient accents
- **Spring-based animations** (Motion/Framer Motion)
- **Collapsible sidebar** with smooth 260→72px transition
- **Page transitions** with AnimatePresence
- **JLPT Readiness Radar Chart** with per-skill micro-progress bars
- **Shimmer overlays** on hero banners and action cards
- **Confetti celebration** when daily goals are completed
- **Level progress indicator** in hero welcome card
- **Theme-adaptive** colors — charts, rings, and cards match active theme
- **Responsive layouts** that feel premium on every screen size

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Runtime** | [Tauri 2](https://tauri.app) | Native performance, tiny bundle (~5MB), cross-platform |
| **Frontend** | [React 19](https://react.dev) | Component architecture, ecosystem |
| **Language** | [TypeScript 5.8](https://typescriptlang.org) | Type safety, DX |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Utility-first, `@theme` system |
| **State** | [Zustand](https://zustand.docs.pmnd.rs) | Lightweight, persisted stores |
| **Animation** | [Motion](https://motion.dev) | Spring physics, layout animations |
| **Charts** | [Recharts](https://recharts.org) | Radar chart, analytics |
| **Icons** | [Lucide React](https://lucide.dev) | Beautiful, consistent icons |
| **Backend** | Rust + SQLite | Offline-first, fast queries |
| **SRS** | [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | State-of-the-art spaced repetition |

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Rust** (install via [rustup](https://rustup.rs))
- **MSVC Build Tools** (Windows) or **Xcode** (macOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mayank3613/TrioLingo-.git
cd TrioLingo-

# Install dependencies
npm install

# Run in browser (frontend only)
npm run dev
# → Opens at http://localhost:1420

# Run as desktop app (Tauri)
npm run tauri dev
# → First build compiles Rust (~3-5 min), then instant
```

### Build for Production

```bash
# Create distributable desktop app
npm run tauri build
# → Outputs installer in src-tauri/target/release/bundle/
```

---

## 📁 Project Structure

```
TrioLingo++/
├── src/
│   ├── main.tsx                          # React entry point
│   ├── App.tsx                           # Router (19 routes, code-split)
│   ├── index.css                         # Design system + 6 themes
│   │
│   ├── data/                             # Curated Japanese language datasets
│   │   ├── vocabData.ts                  # 400+ words across JLPT N5–N1
│   │   ├── kanjiData.ts                  # 300 kanji with readings & examples
│   │   ├── grammarData.ts                # 100 grammar points with explanations
│   │   └── readingData.ts                # 15 graded passages with comprehension Qs
│   │
│   ├── stores/                           # Zustand state management
│   │   ├── themeStore.ts                 # Theme switching + level-gated unlocks
│   │   ├── userStore.ts                  # XP, leveling, streaks, profile
│   │   ├── studyStore.ts                 # Daily goals, activity feed
│   │   ├── sidebarStore.ts               # Sidebar collapse state
│   │   ├── fsrsStore.ts                  # FSRS spaced repetition engine
│   │   └── quizStore.ts                  # Quiz session & question generation
│   │
│   ├── components/
│   │   ├── ui/                           # Reusable component library
│   │   │   ├── Button.tsx                # 4 variants, 3 sizes, loading state
│   │   │   ├── Card.tsx                  # Glassmorphic with hover lift
│   │   │   ├── ProgressBar.tsx           # Animated gradient fill
│   │   │   ├── Badge.tsx                 # 7 variants (XP, coin, success...)
│   │   │   ├── Modal.tsx                 # Spring animation + backdrop
│   │   │   ├── Input.tsx                 # Label, error, icon support
│   │   │   └── Tooltip.tsx               # 4-directional, animated
│   │   │
│   │   └── layout/
│   │       ├── Sidebar.tsx               # Collapsible nav + XP display
│   │       ├── Header.tsx                # Dynamic title + streak/XP/coins
│   │       └── MainLayout.tsx            # Responsive shell + transitions
│   │
│   └── features/
│       ├── dashboard/Dashboard.tsx        # XP ring, stats, radar, confetti, shimmer
│       ├── vocabulary/VocabularyPage.tsx   # Word grid + search + FSRS integration
│       ├── kanji/KanjiPage.tsx            # Kanji grid + detail + flashcard add
│       ├── grammar/GrammarPage.tsx        # Expandable grammar cards + FSRS
│       ├── reading/ReadingPage.tsx        # Graded passages + comprehension quiz
│       ├── flashcards/FlashcardsPage.tsx  # 3D flip cards + FSRS review session
│       ├── quiz/QuizPage.tsx             # Adaptive quiz engine + results
│       ├── profile/ProfilePage.tsx        # Avatar, heatmap, stats, categories
│       ├── settings/SettingsPage.tsx       # Theme selector + preferences
│       └── achievements/AchievementsPage.tsx # 24+ achievements across 7 categories
│
├── src-tauri/                            # Tauri 2 Rust backend
│   ├── tauri.conf.json                   # App config
│   ├── Cargo.toml                        # Rust dependencies
│   └── src/                              # Rust source
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🗺️ Roadmap

### Phase 1 — Foundation & UI Shell ✅
- [x] Tauri 2 + React 19 + TypeScript scaffold
- [x] Design system with 6 themes
- [x] Component library (7 components)
- [x] Dashboard with XP ring, stats, radar chart
- [x] Vocabulary, Kanji, Grammar pages
- [x] Settings with live theme switching
- [x] Achievements system (24+ achievements)
- [x] Animated sidebar + page transitions

### Phase 2 — Data & Study Engine ✅
- [x] Curated data sets: 400+ vocab, 300 kanji, 100 grammar, 15 reading passages
- [x] FSRS spaced repetition engine (ts-fsrs + Zustand persist)
- [x] Quiz engine with multiple-choice & type-answer question generation
- [x] Reading passages with comprehension quizzes
- [x] Flashcard review sessions with 3D flip animation & FSRS rating
- [x] Profile page with study heatmap, stats grid, avatar picker

### Phase 3 — UI Polish & Premium Experience ✅
- [x] Theme-adaptive dashboard (XP ring, radar, action cards, stat icons)
- [x] Shimmer overlays and confetti celebration effects
- [x] Level progress indicator in hero card
- [x] Micro-progress skill breakdown grid under radar chart
- [x] Interactive recent activity feed with hover animations
- [x] TypeScript strict cleanup across all components

### Phase 4 — Interactive Learning ✅
- [x] Analytics dashboard with study trends, XP chart, category breakdown, heatmap
- [x] Unified search page across vocab, kanji, grammar, reading
- [x] Mock JLPT exam simulator with timed sections and score breakdown
- [x] Mini Games hub: Word Match, Kanji Memory, Speed Type
- [x] Listening practice with TTS, speed controls, and dictation mode
- [x] Speaking practice with speech recognition and self-assessment
- [x] Writing practice with canvas stroke drawing and undo

### Phase 5 — AI & Story Features ✅
- [x] AI Tutor chat interface with 6 guided conversation topics
- [x] Career Mode with 5 story chapters (N5→N1) and scenario progression

### Phase 6 — Social & Export (Next)
- [ ] Detailed retention analytics and learning curves
- [ ] Export/import study data
- [ ] Leaderboards
- [ ] Cloud sync between devices

---

## 🎨 Design Philosophy

TrioLingo++ follows a design philosophy inspired by **Notion**, **Linear**, **Arc Browser**, and **Duolingo**:

- **Premium feel** — No generic defaults. Curated color palettes, custom gradients, micro-animations
- **Japanese-first typography** — Noto Sans JP for all Japanese text, Inter for UI
- **Glassmorphism** — Frosted glass effects with backdrop blur
- **Motion-driven** — Spring physics for natural, delightful interactions
- **Theme as reward** — Premium themes unlock as you level up, incentivizing study

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **JMdict/EDICT** — Japanese-Multilingual Dictionary (CC BY-SA 4.0)
- **KANJIDIC2** — Kanji Dictionary (CC BY-SA 4.0)
- **Tauri** — For making beautiful desktop apps possible with web tech
- **Open SRS Community** — For the FSRS spaced repetition algorithm

---

<p align="center">
  <strong>Built with 💜 for Japanese learners everywhere</strong>
  <br/>
  <em>日本語を楽しく学ぼう！</em>
</p>
