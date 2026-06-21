# Changelog

All notable changes to **TrioLingo++** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-06-21

### 🎉 Initial Public Release

The culmination of 5 development phases — TrioLingo++ ships as a fully-featured, cross-platform JLPT preparation desktop app.

### Added

#### Phase 1 — Foundation & UI Shell
- Tauri 2 + React 19 + TypeScript scaffold
- Design system with 6 unlockable themes (Light, Dark, AMOLED, Sakura, Cyber Tokyo, Traditional)
- Reusable component library: Card, Badge, Button, ProgressBar, Modal, Tooltip, Toggle
- Dashboard with animated XP ring, daily streak counter, JLPT readiness radar chart, shimmer overlays
- Collapsible sidebar with smooth 260→72px transitions and page-level animations
- Achievements system with 24+ achievements across 7 categories (including hidden)
- Settings page with live theme switching, sound toggles, study preferences

#### Phase 2 — Data & Study Engine
- Curated data sets: 400+ vocabulary, 300 kanji, 100 grammar points, 15 reading passages
- FSRS spaced repetition engine (ts-fsrs) with Zustand-persisted card state
- Quiz engine with multiple-choice and type-answer question generation
- Reading passages with comprehension quizzes and translation toggles
- Flashcard review sessions with 3D card flip animation and FSRS rating (Again/Hard/Good/Easy)
- Profile page with 16-week study heatmap, stats grid, and avatar picker

#### Phase 3 — UI Polish & Premium Experience
- Theme-adaptive dashboard: XP ring, radar chart, action cards, stat icons all respond to active theme
- Shimmer overlays on hero banners and action cards
- Level progress indicator with confetti celebration on level-up
- Micro-progress skill breakdown grid under radar chart
- Interactive recent activity feed with hover animations
- TypeScript strict-mode cleanup across all components

#### Phase 4 — Interactive Learning
- Analytics dashboard with study trends (XP chart), category pie chart, JLPT progress bars, GitHub-style heatmap
- Unified search across vocab, kanji, grammar, and reading with category filters
- Mock JLPT exam simulator with 30 timed questions across vocab/kanji/grammar sections, animated score reveal, pass/fail with confetti
- Mini Games hub: Word Match (単語マッチ), Kanji Memory (漢字メモリー), Speed Type (スピードタイプ)
- Listening practice with TTS, speed controls, and dictation mode
- Speaking practice with Web Speech API recognition and self-assessment
- Writing practice with HTML5 Canvas stroke drawing, undo, and character grids

#### Phase 5 — AI & Story Features
- AI Tutor with dual mode: Demo (6 scripted conversation topics) and Live AI (Gemini 2.0 Flash integration)
- Career Mode with 5 story chapters (N5→N1): Arrival in Tokyo, Daily Life, Work & Culture, Advanced Society, Mastery
- Scenario-based roleplay challenges with bilingual dialogues and JLPT-level quizzes

### Architecture & Quality
- Route-level `<ErrorBoundary>` wrappers on all 18 lazy-loaded routes
- Native filesystem persistence via Tauri FS plugin (with localStorage fallback for web)
- Runtime JSON data loading via React Query (moved from hardcoded TypeScript arrays)
- Real Gemini LLM integration for AI Tutor (user-provided API key)
- GitHub Actions CI workflow for build and typecheck verification

### Retention & Gamification
- FSRS "due cards" badge on sidebar with notification dot in collapsed mode
- Expanded writing practice: 46 hiragana + 46 katakana + 100 N5 kanji (up from 20)
- Career Mode gated by chapter completion (not XP farming)
- TTS voice detection with fallback warning banners on Listening/Speaking pages
- Blurred locked-theme previews with padlock overlay and level-requirement tooltips
- Web showcase banner with "Download Desktop App" CTA for Netlify visitors

---

## [Unreleased]

### Planned (Phase 6 — Social & Export)
- Detailed retention analytics and learning curves
- Export/import study data
- Leaderboards
- Cloud sync between devices
