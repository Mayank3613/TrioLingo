import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';

/* ——— Eagerly loaded ——— */
import Dashboard from './features/dashboard/Dashboard';

/* ——— Real pages (lazy) ——— */
const VocabularyPage = React.lazy(() =>
  import('./features/vocabulary/VocabularyPage').then((m) => ({ default: m.VocabularyPage }))
);
const KanjiPage = React.lazy(() =>
  import('./features/kanji/KanjiPage').then((m) => ({ default: m.KanjiPage }))
);
const GrammarPage = React.lazy(() =>
  import('./features/grammar/GrammarPage').then((m) => ({ default: m.GrammarPage }))
);
const SettingsPage = React.lazy(() =>
  import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const AchievementsPage = React.lazy(() =>
  import('./features/achievements/AchievementsPage').then((m) => ({ default: m.AchievementsPage }))
);


/* ——— Lazy-wrapped pages ——— */
const ReadingPage = React.lazy(() =>
  import('./features/reading/ReadingPage')
);
const ListeningPage = React.lazy(() =>
  import('./features/listening/ListeningPage').then((m) => ({ default: m.ListeningPage }))
);
const SpeakingPage = React.lazy(() =>
  import('./features/speaking/SpeakingPage').then((m) => ({ default: m.SpeakingPage }))
);
const WritingPage = React.lazy(() =>
  import('./features/writing/WritingPage').then((m) => ({ default: m.WritingPage }))
);
const FlashcardsPage = React.lazy(() =>
  import('./features/flashcards/FlashcardsPage')
);
const QuizPage = React.lazy(() =>
  import('./features/quiz/QuizPage')
);
const MockExamPage = React.lazy(() =>
  import('./features/mock-exam/MockExamPage').then((m) => ({ default: m.MockExamPage }))
);
const CareerPage = React.lazy(() =>
  import('./features/career/CareerPage').then((m) => ({ default: m.CareerPage }))
);
const MiniGamesPage = React.lazy(() =>
  import('./features/mini-games/MiniGamesPage').then((m) => ({ default: m.MiniGamesPage }))
);
const AITutorPage = React.lazy(() =>
  import('./features/ai-tutor/AITutorPage').then((m) => ({ default: m.AITutorPage }))
);
const AnalyticsPage = React.lazy(() =>
  import('./features/analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);
const SearchPage = React.lazy(() =>
  import('./features/search/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const ProfilePage = React.lazy(() =>
  import('./features/profile/ProfilePage')
);

/* ——— Loading fallback ——— */
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--border-primary)', borderTopColor: 'transparent' }}
        />
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Loading...</span>
      </div>
    </div>
  );
}

/* ——— App Root ——— */
export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="kanji" element={<KanjiPage />} />
          <Route path="grammar" element={<GrammarPage />} />
          <Route path="reading" element={<ReadingPage />} />
          <Route path="listening" element={<ListeningPage />} />
          <Route path="speaking" element={<SpeakingPage />} />
          <Route path="writing" element={<WritingPage />} />
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="mock-exam" element={<MockExamPage />} />
          <Route path="career" element={<CareerPage />} />
          <Route path="mini-games" element={<MiniGamesPage />} />
          <Route path="ai-tutor" element={<AITutorPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
