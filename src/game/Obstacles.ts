import {
  CACTUS_S,
  CACTUS_TALL,
  CACTUS_X2,
  CACTUS_X3,
  CACTUS_X4,
  CAVE_ARCH,
  GATE_LINTEL_ROWS,
  MUSEUM_GATE,
  PTERO_A,
  PTERO_B,
  SPRITE_SCALE,
  drawGrid,
  gridBounds,
  gridSize,
  lastSolidRow,
  plantY,
  type PixelGrid,
} from '../art/sprites';
import { GAME_W, GROUND_Y } from './World';

/** Inset from solid pixel bounds (sprite grid units → × SPRITE_SCALE). */
type BoxInset = { x: number; top: number; bottom: number };

/**
 * Cactus: trunk+arms solid bounds, then shrink so a clear jump doesn't false-hit.
 * Top inset is intentional foot clearance.
 */
const CACTUS_INSET: BoxInset = { x: 3, top: 3, bottom: 1 };

/**
 * Ptero: ignore empty padding via gridBounds, then shrink wings/beak tips.
 * Bottom inset keeps low birds clear of a ducked hitbox.
 */
const PTERO_INSET: BoxInset = { x: 8, top: 5, bottom: 6 };

export type ObstacleKind =
  | 'cactusS'
  | 'cactusT'
  | 'cactusX2'
  | 'cactusX3'
  | 'cactusX4'
  | 'ptero'
  | 'museumDoor'
  | 'caveArch';

export interface Obstacle {
  kind: ObstacleKind;
  x: number;
  y: number;
  grid: PixelGrid;
  w: number;
  h: number;
  /** Only for pteros — used by spawn pairing */
  pteroBand?: 'low' | 'mid' | 'high';
}

const PIXEL = SPRITE_SCALE;

/** Ground obstacles that usually need a jump */
function isJumpGround(kind: ObstacleKind): boolean {
  return (
    kind === 'cactusT' ||
    kind === 'cactusX2' ||
    kind === 'cactusX3' ||
    kind === 'cactusX4'
  );
}

function isWideGround(kind: ObstacleKind): boolean {
  return kind === 'cactusX3' || kind === 'cactusX4';
}

function isGate(kind: ObstacleKind): boolean {
  return kind === 'museumDoor' || kind === 'caveArch';
}

/** Min clear space (px) between previous right edge and next left edge. */
function minGapPx(
  prev: ObstacleKind | 'empty' | null,
  next: ObstacleKind | 'empty',
  speed: number,
): number {
  if (next === 'empty') {
    return Math.max(122, speed * 0.422);
  }
  // ~one high jump of travel + land recovery
  let gap = Math.max(136, speed * 0.503);
  if (prev === 'empty' || prev == null) {
    gap *= 0.9;
  } else {
    if (isJumpGround(prev)) gap *= 1.14;
    if (isWideGround(prev)) gap *= 1.18;
    if (isGate(prev)) gap *= 1.1;
  }
  if (isJumpGround(next)) gap *= 1.05;
  if (isWideGround(next)) gap *= 1.08;
  if (isGate(next)) gap *= 1.06;
  if (next === 'ptero') gap *= 0.92;
  return gap;
}

function gridFor(kind: ObstacleKind): PixelGrid {
  switch (kind) {
    case 'cactusT':
      return CACTUS_TALL;
    case 'cactusX2':
      return CACTUS_X2;
    case 'cactusX3':
      return CACTUS_X3;
    case 'cactusX4':
      return CACTUS_X4;
    case 'ptero':
      return PTERO_A;
    case 'museumDoor':
      return MUSEUM_GATE;
    case 'caveArch':
      return CAVE_ARCH;
    default:
      return CACTUS_S;
  }
}

function makeObstacle(kind: ObstacleKind, x: number): Obstacle {
  const grid = gridFor(kind);
  const { w } = gridSize(grid);
  const solidH = lastSolidRow(grid) + 1;
  let y: number;
  let pteroBand: Obstacle['pteroBand'];
  if (kind === 'ptero') {
    const band = Math.random();
    // Low: hits standing, clears duck. Mid/high: jump hazards.
    if (band < 0.34) {
      y = GROUND_Y - 67 * PIXEL;
      pteroBand = 'low';
    } else if (band < 0.67) {
      y = GROUND_Y - 86 * PIXEL;
      pteroBand = 'mid';
    } else {
      y = GROUND_Y - 102 * PIXEL;
      pteroBand = 'high';
    }
  } else {
    y = plantY(GROUND_Y, grid, PIXEL);
  }
  return { kind, x, y, grid, w: w * PIXEL, h: solidH * PIXEL, pteroBand };
}

function solidHitbox(
  o: Obstacle,
  inset: BoxInset,
): { x: number; y: number; w: number; h: number } {
  const b = gridBounds(o.grid);
  const x = o.x + (b.x + inset.x) * PIXEL;
  const y = o.y + (b.y + inset.top) * PIXEL;
  const w = Math.max(PIXEL, (b.w - inset.x * 2) * PIXEL);
  const h = Math.max(PIXEL, (b.h - inset.top - inset.bottom) * PIXEL);
  return { x, y, w, h };
}

/**
 * Per-kind hitboxes (canvas px). Gates: lintel only — pillars can't work
 * with fixed player X. Cactus/ptero: solid bounds + explicit insets.
 */
export function obstacleHitboxes(
  o: Obstacle,
): { x: number; y: number; w: number; h: number }[] {
  if (o.kind === 'museumDoor' || o.kind === 'caveArch') {
    const lintelH = GATE_LINTEL_ROWS * PIXEL;
    const inset = PIXEL;
    return [
      {
        x: o.x + inset,
        y: o.y + inset,
        w: o.w - inset * 2,
        h: lintelH - inset,
      },
    ];
  }
  if (o.kind === 'ptero') {
    return [solidHitbox(o, PTERO_INSET)];
  }
  // All cactus variants (single / tall / clusters)
  return [solidHitbox(o, CACTUS_INSET)];
}

export class ObstacleManager {
  list: Obstacle[] = [];
  private spawnTimer = 0.9;
  private previewQueue: { kind: ObstacleKind; in: number } | null = null;
  /** Fixed opening lesson: single short → arch → double short → empty */
  private introIndex = 0;
  private lastKind: ObstacleKind | 'empty' | null = null;
  private lastPteroBand: Obstacle['pteroBand'];
  /** After wide clusters, force one empty beat */
  private pendingEmpty = false;

  reset(): void {
    this.list = [];
    this.spawnTimer = 0.9;
    this.previewQueue = null;
    this.introIndex = 0;
    this.lastKind = null;
    this.lastPteroBand = undefined;
    this.pendingEmpty = false;
  }

  /** Drop pending preview spawn (used during warp dashes). */
  clearPreview(): void {
    this.previewQueue = null;
    this.spawnTimer = 0.85;
  }

  /** Skip hardcoded intro beats (after open-run warp past that segment). */
  skipIntro(): void {
    this.introIndex = INTRO_BEATS.length;
    this.lastKind = 'empty';
    this.lastPteroBand = undefined;
    this.pendingEmpty = false;
    this.spawnTimer = 0.6;
    this.previewQueue = null;
  }

  update(
    dt: number,
    speed: number,
    distance: number,
    showPreview: boolean,
    previewLead = 0.55,
    allowSpawn = true,
  ): void {
    if (allowSpawn) {
      this.spawnTimer -= dt;

      if (this.previewQueue) {
        this.previewQueue.in -= dt;
        if (this.previewQueue.in <= 0) {
          this.pushSpawn(this.previewQueue.kind, speed);
          this.previewQueue = null;
        }
      }

      if (this.spawnTimer <= 0 && !this.previewQueue) {
        if (this.introIndex < INTRO_BEATS.length) {
          const beat = INTRO_BEATS[this.introIndex++];
          if (beat === 'empty') {
            this.spawnTimer = 1.45;
            this.lastKind = 'empty';
            this.lastPteroBand = undefined;
          } else {
            const o = makeObstacle(beat, GAME_W + 10);
            this.list.push(o);
            this.lastKind = beat;
            this.lastPteroBand = o.pteroBand;
            this.spawnTimer =
              beat === 'caveArch' ? 1.35 : beat === 'cactusX2' ? 1.25 : 1.15;
          }
        } else if (this.pendingEmpty) {
          this.pendingEmpty = false;
          this.scheduleEmpty(speed);
        } else {
          const kind = this.pickKind(distance);
          if (showPreview) {
            // Hold spawn until preview resolves; gap starts after real spawn.
            this.spawnTimer = 999;
            this.previewQueue = { kind, in: previewLead };
          } else {
            this.pushSpawn(kind, speed);
          }
        }
      }
    }

    for (const o of this.list) {
      o.x -= speed * dt;
      if (o.kind === 'ptero') {
        o.grid = Math.floor(distance / 80) % 2 === 0 ? PTERO_A : PTERO_B;
      }
    }
    this.list = this.list.filter((o) => o.x + o.w > -20);
  }

  clearAll(): void {
    this.list = [];
    this.previewQueue = null;
  }

  private scheduleEmpty(speed: number): void {
    const gap = minGapPx(this.lastKind, 'empty', speed);
    this.spawnTimer = gap / Math.max(1, speed);
    this.lastKind = 'empty';
    this.lastPteroBand = undefined;
  }

  private pushSpawn(kind: ObstacleKind, speed: number): void {
    const o = makeObstacle(kind, GAME_W + 10);
    this.list.push(o);
    const gap = minGapPx(this.lastKind, kind, speed);
    this.spawnTimer = gap / Math.max(1, speed);
    this.lastKind = kind;
    this.lastPteroBand = o.pteroBand;
    if (isWideGround(kind)) this.pendingEmpty = true;
  }

  private pickKind(distance: number): ObstacleKind {
    const prev = this.lastKind;
    const prevLowPtero = prev === 'ptero' && this.lastPteroBand === 'low';
    const prevJump = prev != null && prev !== 'empty' && isJumpGround(prev);

    // After a jump-ground hazard, prefer breathers / high birds / short cactus.
    if (prevJump || prevLowPtero) {
      const roll = Math.random();
      if (roll < 0.35) return 'cactusS';
      if (distance > 1400 && roll < 0.7) return 'ptero';
      if (distance > 900 && roll < 0.85) {
        return Math.random() < 0.5 ? 'museumDoor' : 'caveArch';
      }
      // Soft fallback: short cactus rather than another tall cluster
      return 'cactusS';
    }

    const r = Math.random();
    if (distance > 900 && r < 0.14) {
      return Math.random() < 0.5 ? 'museumDoor' : 'caveArch';
    }
    if (distance > 1400 && r < 0.28) return 'ptero';

    const g = Math.random();
    // Don't stack wide clusters back-to-back (pendingEmpty also guards).
    if (distance > 5000 && g < 0.12 && prev !== 'cactusX4' && prev !== 'cactusX3') {
      return 'cactusX4';
    }
    if (distance > 2500 && g < 0.22 && prev !== 'cactusX3' && prev !== 'cactusX4') {
      return 'cactusX3';
    }
    if (g < 0.28) return 'cactusX2';
    if (g < 0.55) return 'cactusT';
    return 'cactusS';
  }

  draw(ctx: CanvasRenderingContext2D, showPreview: boolean): void {
    for (const o of this.list) {
      drawGrid(ctx, o.grid, o.x, o.y, PIXEL);
    }
    if (showPreview && this.previewQueue) {
      const ghost = makeObstacle(this.previewQueue.kind, GAME_W - 40);
      drawGrid(ctx, ghost.grid, ghost.x, ghost.y, PIXEL, 0.35);
    }
  }
}

const INTRO_BEATS: Array<ObstacleKind | 'empty'> = [
  'cactusS',
  'caveArch',
  'cactusX2',
  'empty',
];

export function aabb(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}
