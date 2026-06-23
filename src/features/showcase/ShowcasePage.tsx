import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Play,
  Sparkles,
  BookOpen,
  Layers,
  Zap,
  PenTool,
  CheckCircle2,
  Flame,
  Award,
  Shield,
  Cpu,
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  TrendingUp,
  MessageSquareCode
} from 'lucide-react';

interface ShowcasePageProps {
  onEnterApp: () => void;
}

export function ShowcasePage({ onEnterApp }: ShowcasePageProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const screenshots = [
    {
      url: '/screenshots/dashboard.png',
      title: 'Adaptive Dashboard',
      description: 'XP progress ring, streak tracker, JLPT readiness radar, and personalized study goals.'
    },
    {
      url: '/screenshots/flashcards.png',
      title: 'FSRS Spaced Repetition',
      description: 'State-of-the-art Anki-style review engine with 3D card flips and precise ratings.'
    },
    {
      url: '/screenshots/themes.png',
      title: '6 Premium Themes',
      description: 'Unlock visual styles like Sakura, Cyber Tokyo, and Traditional as you level up.'
    }
  ];

  const coreModules = [
    { name: 'Vocabulary', desc: '400+ curated words with JLPT levels and detailed meanings.', icon: <BookOpen className="text-indigo-400" /> },
    { name: 'Kanji', desc: '300 kanji characters with readings, stroke count, and examples.', icon: <Layers className="text-pink-400" /> },
    { name: 'Grammar', desc: '100 key grammar points with formations, explanations, and notes.', icon: <Zap className="text-yellow-400" /> },
    { name: 'Reading', desc: '15 graded passages with English translations and comprehension quizzes.', icon: <CheckCircle2 className="text-emerald-400" /> },
    { name: 'Listening', desc: 'Dictation mode with TTS control, speech speeds, and JLPT levels.', icon: <Sparkles className="text-blue-400" /> },
    { name: 'Speaking', desc: 'Pronunciation checker using Web Speech API with native feedback.', icon: <Play className="text-violet-400" /> },
    { name: 'Writing', desc: 'Interactive HTML5 stroke drawing canvas for Kana and 100+ N5 Kanji.', icon: <PenTool className="text-rose-400" /> }
  ];

  const tools = [
    { name: 'Flashcard Sessions', desc: 'Review vocabulary, kanji, and grammar with the SuperMemo FSRS scheduler.', icon: <Layers /> },
    { name: 'Mock JLPT Exams', desc: 'Full-length timed exam simulations with detailed score breakdowns.', icon: <Award /> },
    { name: 'Story Career Mode', desc: 'Progress through a 5-chapter visual narrative of arriving and working in Tokyo.', icon: <Shield /> },
    { name: 'AI Tutor Sensei', desc: 'Practice situational roleplays powered by Gemini 2.0 Flash integration.', icon: <MessageSquareCode /> },
    { name: 'Study Analytics', desc: 'Heatmaps, charts, and progress metrics tracking your language gains.', icon: <TrendingUp /> },
    { name: 'Mini Games Hub', desc: 'Gamify your vocabulary with Word Match, Kanji Memory, and Speed Type.', icon: <Gamepad2 /> }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col font-sans relative overflow-x-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #0f172a, #020617)',
      }}
    >
      {/* Background Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-pink-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />

      {/* Header / Nav */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎌</span>
          <span className="text-xl font-black bg-gradient-to-r from-indigo-400 via-pink-400 to-rose-400 bg-clip-text text-transparent tracking-tight">
            TrioLingo++
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Mayank3613/TrioLingo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            GitHub <ExternalLink size={14} />
          </a>
          <button
            onClick={onEnterApp}
            className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            Launch Web App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center">
        {/* Release Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-bold mb-6 tracking-wide flex items-center gap-1.5"
        >
          <Sparkles size={12} className="animate-pulse" /> Triolingo++ v1.0.0 is Live
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.1]"
        >
          Master Japanese. <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            Beautifully.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base sm:text-xl text-slate-400 max-w-2xl mt-6 leading-relaxed"
        >
          The ultimate desktop language app. Spaced repetition flashcards, interactive kana/kanji writing, mock JLPT exams, and Gemini AI-powered tutor sessions wrapped in a high-fidelity glassmorphic interface.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
        >
          <a
            href="https://github.com/Mayank3613/TrioLingo/releases/download/v1.0.0/TrioLingo++_1.0.0_aarch64.dmg"
            className="flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto cursor-pointer"
          >
            <Download size={18} /> Download macOS App (Apple Silicon)
          </a>
          <button
            onClick={onEnterApp}
            className="flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto cursor-pointer"
          >
            Try Web Demo <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Tech Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-12 text-slate-500 text-xs font-semibold uppercase tracking-wider"
        >
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1"><Cpu size={12} /> Tauri 2.0</span>
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">React 19</span>
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">TypeScript 5.8</span>
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">Tailwind v4</span>
          <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">Offline SQLite</span>
        </motion.div>
      </section>

      {/* Screenshot Section / Carousel */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          {/* Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSlide}
                src={screenshots[activeSlide].url}
                alt={screenshots[activeSlide].title}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Info bar */}
          <div className="p-5 border-t border-white/5 bg-slate-900/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-base">{screenshots[activeSlide].title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{screenshots[activeSlide].description}</p>
            </div>
            <div className="flex gap-1.5 self-center shrink-0">
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    i === activeSlide ? 'bg-indigo-400 w-5' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">7 Core Learning Modules</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">TrioLingo++ supports all critical language skills needed to achieve JLPT proficiency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreModules.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-5 rounded-2xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/60 hover:border-white/10 transition-all flex items-start gap-4"
            >
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                {m.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-base">{m.name}</h3>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Study Tools & Gamification */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">Gamification & Study Tools</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">Combining Anki efficiency with Duolingo engagement mechanics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-2xl border border-white/5 bg-slate-950/40 hover:bg-slate-950/80 hover:border-white/15 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                {t.icon}
              </div>
              <h3 className="font-bold text-slate-200 text-base">{t.name}</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Design Philosophy & Premium UX */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              A premium study experience, not another spreadsheet app.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
              Inspired by the design quality of Notion, Linear, and Arc Browser, TrioLingo++ focuses on visual elegance. Japanese text uses high-readability fonts, transitions are spring-loaded for fluid responsiveness, and dashboard aesthetics shift based on unlockable themes.
            </p>
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                <span className="text-slate-300 text-sm font-semibold">Adaptive Japanese-first typography (Noto Sans JP)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                <span className="text-slate-300 text-sm font-semibold">Delightful micro-animations and level-up celebrations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                <span className="text-slate-300 text-sm font-semibold">Theme-adaptive gauges, charts, and interactive feeds</span>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 relative overflow-hidden backdrop-blur-xl flex flex-col justify-center min-h-[300px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl pointer-events-none" />
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Flame className="text-orange-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Active Study Streak</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Stay motivated with flame animations and streak milestones.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="text-yellow-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">24+ Unlocks & Achievements</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Collect badge achievements and coins across 7 different learning categories.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-indigo-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm">Gated Chapters</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Chapters represent JLPT levels (N5→N1) and lock until scenarios are solved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Download CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 pt-8 text-center flex flex-col items-center">
        <div className="p-10 sm:p-14 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/40 to-slate-950/40 relative overflow-hidden backdrop-blur-2xl w-full">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full filter blur-[60px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-600/10 rounded-full filter blur-[60px]" />

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">Master Japanese natively.</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed">
            Install the native application for the fully featured offline experience, backup management, and system-level speech capabilities.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/Mayank3613/TrioLingo/releases/download/v1.0.0/TrioLingo++_1.0.0_aarch64.dmg"
              className="flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl bg-white text-slate-950 shadow-md hover:bg-slate-100 active:scale-[0.98] transition-all w-full sm:w-auto cursor-pointer text-sm"
            >
              <Download size={16} /> Download macOS App
            </a>
            <button
              onClick={onEnterApp}
              className="flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 active:scale-[0.98] transition-all w-full sm:w-auto cursor-pointer text-sm"
            >
              Open Web Preview
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 border-t border-white/5 text-center text-xs text-slate-500">
        <p>© 2026 TrioLingo++. Licensed under MIT. Built with 💜 for Japanese learners.</p>
        <p className="mt-2 text-slate-600 font-medium">日本語を楽しく学ぼう！</p>
      </footer>
    </div>
  );
}

export default ShowcasePage;
