/**
 * Unified storage adapter for Zustand persistence.
 * - Tauri desktop: reads/writes JSON files via @tauri-apps/plugin-fs to $APPDATA
 * - Web browser: falls back to standard localStorage
 *
 * Uses Zustand v5's createJSONStorage() with a custom StateStorage-compatible object.
 */
import { createJSONStorage } from 'zustand/middleware';

/* ——— Environment Detection ——— */

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

/* ——— Tauri FS Helpers (lazy-imported to avoid errors on web) ——— */

async function tauriRead(filename: string): Promise<string | null> {
  try {
    const { readTextFile, BaseDirectory } = await import('@tauri-apps/plugin-fs');
    return await readTextFile(filename, { baseDir: BaseDirectory.AppData });
  } catch (e: unknown) {
    // File doesn't exist yet (fresh install) — not an error
    if (e instanceof Error && (e.message.includes('No such file') || e.message.includes('not found'))) {
      return null;
    }
    console.warn(`[tauriStorage] read error for ${filename}:`, e);
    return null;
  }
}

async function tauriWrite(filename: string, data: string): Promise<void> {
  try {
    const { writeTextFile, mkdir, BaseDirectory } = await import('@tauri-apps/plugin-fs');
    // Ensure the AppData directory exists
    try {
      await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
    } catch {
      // Directory may already exist — safe to ignore
    }
    await writeTextFile(filename, data, { baseDir: BaseDirectory.AppData });
  } catch (e) {
    console.error(`[tauriStorage] write error for ${filename}:`, e);
  }
}

async function tauriRemove(filename: string): Promise<void> {
  try {
    const { remove, BaseDirectory } = await import('@tauri-apps/plugin-fs');
    await remove(filename, { baseDir: BaseDirectory.AppData });
  } catch {
    // File may not exist — safe to ignore
  }
}

/* ——— One-Time Migration: localStorage → Tauri FS ——— */

const MIGRATION_KEY = 'triolingo-fs-migrated';

async function migrateIfNeeded(name: string): Promise<void> {
  if (!isTauri()) return;

  const migrationFlag = `${MIGRATION_KEY}-${name}`;
  if (localStorage.getItem(migrationFlag)) return;

  // Check if localStorage has data but FS does not
  const localData = localStorage.getItem(name);
  if (localData) {
    const fsData = await tauriRead(`${name}.json`);
    if (!fsData) {
      console.log(`[tauriStorage] Migrating "${name}" from localStorage to filesystem...`);
      await tauriWrite(`${name}.json`, localData);
    }
  }

  // Mark migration as done (in localStorage so we don't check again)
  localStorage.setItem(migrationFlag, 'true');
}

/* ——— Custom Storage Backend ——— */

const storageBackend = {
  getItem: async (name: string): Promise<string | null> => {
    if (isTauri()) {
      await migrateIfNeeded(name);
      return tauriRead(`${name}.json`);
    }
    return localStorage.getItem(name);
  },

  setItem: async (name: string, value: string): Promise<void> => {
    if (isTauri()) {
      await tauriWrite(`${name}.json`, value);
      return;
    }
    localStorage.setItem(name, value);
  },

  removeItem: async (name: string): Promise<void> => {
    if (isTauri()) {
      await tauriRemove(`${name}.json`);
      return;
    }
    localStorage.removeItem(name);
  },
};

/* ——— Export as Zustand-compatible storage ——— */

export const tauriStorage = createJSONStorage(() => storageBackend);
