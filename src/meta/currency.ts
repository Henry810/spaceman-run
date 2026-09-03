import { totalDnaMultiplier } from './evolutionTree';

const BASE_RATE = 0.1;

export function scoreToDna(score: number, unlockedNodes: string[]): number {
  const mult = totalDnaMultiplier(unlockedNodes);
  return Math.max(0, Math.floor(score * BASE_RATE * mult));
}

export function formatMultiplier(unlockedNodes: string[]): string {
  const m = totalDnaMultiplier(unlockedNodes);
  return `×${m.toFixed(2)}`;
}
