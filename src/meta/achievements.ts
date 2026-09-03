import type { SaveData } from './save';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  /** Overlay skin id unlocked */
  overlayId: string;
  check: (save: SaveData, run?: RunStats) => boolean;
}

export interface RunStats {
  score: number;
  distance: number;
  wasNight: boolean;
  shieldUsed: boolean;
  dnaEarned: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'score_500',
    name: '短途巡游',
    description: '单局得分达到 500',
    overlayId: 'gold_base',
    check: (_s, run) => (run?.score ?? 0) >= 500 || _s.highScore >= 500,
  },
  {
    id: 'score_1500',
    name: '戈壁造景',
    description: '单局得分达到 1500',
    overlayId: 'ember_base',
    check: (_s, run) => (run?.score ?? 0) >= 1500 || _s.highScore >= 1500,
  },
  {
    id: 'distance_10k',
    name: '迁徙线',
    description: '累计奔跑距离 10000',
    overlayId: 'trail_base',
    check: (s) => s.totalDistance >= 10000,
  },
  {
    id: 'shield_first',
    name: '鳞甲共鸣',
    description: '首次用护盾挡住碰撞',
    overlayId: 'iron_base',
    check: (s) => s.stats.shieldBlocks >= 1,
  },
  {
    id: 'night_runner',
    name: '夜间观察',
    description: '在夜间阶段存活并结束一局',
    overlayId: 'night_base',
    check: (s, run) => s.stats.nightRuns >= 1 || Boolean(run?.wasNight),
  },
  {
    id: 'dna_200',
    name: '生命富矿',
    description: '单局获得 200 DNA',
    overlayId: 'helix_base',
    check: (s, run) =>
      (run?.dnaEarned ?? 0) >= 200 || s.stats.bestSingleDna >= 200,
  },
  {
    id: 'games_20',
    name: '执着的爪痕',
    description: '累计奔跑 20 局',
    overlayId: 'scar_base',
    check: (s) => s.stats.gamesPlayed >= 20,
  },
];

export function evaluateAchievements(
  save: SaveData,
  run?: RunStats,
): string[] {
  const newly: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (save.unlockedAchievements.includes(a.id)) continue;
    if (a.check(save, run)) newly.push(a.id);
  }
  return newly;
}

export function getOverlayForAchievement(id: string): string | null {
  return ACHIEVEMENTS.find((a) => a.id === id)?.overlayId ?? null;
}
