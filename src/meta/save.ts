export interface SaveData {
  dna: number;
  highScore: number;
  totalDistance: number;
  unlockedNodes: string[];
  unlockedAchievements: string[];
  equippedOverlay: string | null;
  stats: {
    shieldBlocks: number;
    nightRuns: number;
    gamesPlayed: number;
    bestSingleDna: number;
  };
}

const SAVE_KEY = 'dina-run-save-v1';

export const DEFAULT_SAVE: SaveData = {
  dna: 0,
  highScore: 0,
  totalDistance: 0,
  unlockedNodes: [],
  unlockedAchievements: [],
  equippedOverlay: null,
  stats: {
    shieldBlocks: 0,
    nightRuns: 0,
    gamesPlayed: 0,
    bestSingleDna: 0,
  },
};

function cloneSave(data: SaveData): SaveData {
  return JSON.parse(JSON.stringify(data)) as SaveData;
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return cloneSave(DEFAULT_SAVE);
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      ...cloneSave(DEFAULT_SAVE),
      ...parsed,
      stats: {
        ...DEFAULT_SAVE.stats,
        ...(parsed.stats ?? {}),
      },
      unlockedNodes: parsed.unlockedNodes ?? [],
      unlockedAchievements: parsed.unlockedAchievements ?? [],
    };
  } catch {
    return cloneSave(DEFAULT_SAVE);
  }
}

export function writeSave(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // file:// / WeChat WebView may block storage — keep running in-memory
  }
}

export function resetSave(): SaveData {
  const fresh = cloneSave(DEFAULT_SAVE);
  writeSave(fresh);
  return fresh;
}
