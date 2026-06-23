import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tauriStorage } from '../services/tauriStorage';

export type ThemeId = 'light' | 'dark' | 'premium-dark' | 'amoled' | 'sakura' | 'cyber-tokyo' | 'traditional';

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  nameJp: string;
  icon: string;
  unlocked: boolean;
  requiredLevel?: number;
}

export const THEMES: ThemeInfo[] = [
  { id: 'premium-dark', name: 'Premium Dark', nameJp: 'プレミアムダーク', icon: '✨', unlocked: true },
  { id: 'light', name: 'Light', nameJp: 'ライト', icon: '☀️', unlocked: true },
  { id: 'dark', name: 'Dark', nameJp: 'ダーク', icon: '🌙', unlocked: true },
  { id: 'amoled', name: 'AMOLED', nameJp: 'アモレッド', icon: '⚫', unlocked: true },
  { id: 'sakura', name: 'Sakura', nameJp: '桜', icon: '🌸', unlocked: false, requiredLevel: 10 },
  { id: 'cyber-tokyo', name: 'Cyber Tokyo', nameJp: 'サイバー東京', icon: '🏙️', unlocked: false, requiredLevel: 25 },
  { id: 'traditional', name: 'Traditional', nameJp: '和風', icon: '🏯', unlocked: false, requiredLevel: 40 },
];

interface ThemeState {
  currentTheme: ThemeId;
  unlockedThemes: ThemeId[];
  setTheme: (theme: ThemeId) => void;
  unlockTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: 'premium-dark',
      unlockedThemes: ['light', 'dark', 'premium-dark', 'amoled'],
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ currentTheme: theme });
      },
      unlockTheme: (theme) =>
        set((state) => ({
          unlockedThemes: state.unlockedThemes.includes(theme)
            ? state.unlockedThemes
            : [...state.unlockedThemes, theme],
        })),
    }),
    {
      name: 'triolingo-theme',
      storage: tauriStorage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.currentTheme);
        }
      },
    }
  )
);
