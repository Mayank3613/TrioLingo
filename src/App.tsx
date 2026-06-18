import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import NotFoundPage from './components/NotFoundPage';

/* ——— React Query Client ——— */
const queryClient = new QueryClient();

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

/* ——— Error-boundary-wrapped lazy route helper ——— */
function withErrorBoundary(Component: React.LazyExoticComponent<React.ComponentType<unknown>>) {
  return (
    <RouteErrorBoundary>
      <Component />
    </RouteErrorBoundary>
  );
}

/* ——— App Root ——— */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="vocabulary" element={withErrorBoundary(VocabularyPage)} />
            <Route path="kanji" element={withErrorBoundary(KanjiPage)} />
            <Route path="grammar" element={withErrorBoundary(GrammarPage)} />
            <Route path="reading" element={withErrorBoundary(ReadingPage)} />
            <Route path="listening" element={withErrorBoundary(ListeningPage)} />
            <Route path="speaking" element={withErrorBoundary(SpeakingPage)} />
            <Route path="writing" element={withErrorBoundary(WritingPage)} />
            <Route path="flashcards" element={withErrorBoundary(FlashcardsPage)} />
            <Route path="quiz" element={withErrorBoundary(QuizPage)} />
            <Route path="mock-exam" element={withErrorBoundary(MockExamPage)} />
            <Route path="career" element={withErrorBoundary(CareerPage)} />
            <Route path="mini-games" element={withErrorBoundary(MiniGamesPage)} />
            <Route path="ai-tutor" element={withErrorBoundary(AITutorPage)} />
            <Route path="achievements" element={withErrorBoundary(AchievementsPage)} />
            <Route path="analytics" element={withErrorBoundary(AnalyticsPage)} />
            <Route path="search" element={withErrorBoundary(SearchPage)} />
            <Route path="settings" element={withErrorBoundary(SettingsPage)} />
            <Route path="profile" element={withErrorBoundary(ProfilePage)} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </QueryClientProvider>
  );
}
