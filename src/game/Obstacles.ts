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

/**
 * Fixed on-screen clear space (px) between obstacles.
 * Density stays constant for the whole run; higher world speed only shortens
 * reaction time (world speed itself is capped in World.update).
 */
const GAP_BASE_PX = 320;
const GAP_EMPTY_PX = 320;

function minGapPx(
  prev: ObstacleKind | 'empty' | null,
  next: ObstacleKind | 'empty',
  _speed: number,
): number {
  if (next === 'empty') return GAP_EMPTY_PX;

  let gap = GAP_BASE_PX;
  // Tiny kind tweaks only — avoid stacking into late-game deserts.
  if (prev === 'empty' || prev == null) {
    gap *= 0.95;
  } else {
    if (isJumpGround(prev)) gap *= 1.06;
    if (isWideGround(prev)) gap *= 1.08;
    if (isGate(prev)) gap *= 1.05;
  }
  if (isJumpGround(next)) gap *= 1.03;
  if (isWideGround(next)) gap *= 1.05;
  if (isGate(next)) gap *= 1.03;
  if (next === 'ptero') gap *= 0.97;
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
  /** Next obstacle already chosen for the current gap countdown. */
  private pendingKind: ObstacleKind | null = null;
  /** Fixed opening lesson: single short → arch → double short → empty */
  private introIndex = 0;
  private lastKind: ObstacleKind | 'empty' | null = null;
  private lastPteroBand: Obstacle['pteroBand'];

  reset(): void {
    this.list = [];
    this.spawnTimer = 0.9;
    this.previewQueue = null;
    this.pendingKind = null;
    this.introIndex = 0;
    this.lastKind = null;
    this.lastPteroBand = undefined;
  }

  /** Drop pending preview spawn (used during warp dashes). */
  clearPreview(): void {
    this.previewQueue = null;
    this.pendingKind = null;
    this.spawnTimer = 0.85;
  }

  /** Skip hardcoded intro beats (after open-run warp past that segment). */
  skipIntro(): void {
    this.introIndex = INTRO_BEATS.length;
    this.lastKind = 'empty';
    this.lastPteroBand = undefined;
    this.spawnTimer = 0.6;
    this.previewQueue = null;
    this.pendingKind = null;
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
        if (this.previewQueue.in < 0) this.previewQueue.in = 0;
      }

      if (this.spawnTimer <= 0) {
        if (this.pendingKind) {
          this.spawnNow(this.pendingKind, speed, distance, showPreview, previewLead);
        } else if (this.introIndex < INTRO_BEATS.length) {
          const beat = INTRO_BEATS[this.introIndex++];
          if (beat === 'empty') {
            this.lastKind = 'empty';
            this.lastPteroBand = undefined;
            this.armNextGap(speed, distance, showPreview, previewLead, GAP_EMPTY_PX);
          } else {
            this.list.push(makeObstacle(beat, GAME_W + 10));
            this.lastKind = beat;
            this.lastPteroBand = undefined;
            const gap = minGapPx(
              this.introIndex === 1 ? null : INTRO_BEATS[this.introIndex - 2],
              beat,
              speed,
            );
            this.armNextGap(speed, distance, showPreview, previewLead, gap);
          }
        } else {
          // First post-intro pick (or after clear): choose and arm a gap.
          this.armNextGap(speed, distance, showPreview, previewLead);
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
    this.pendingKind = null;
  }

  /** Place obstacle, then start exactly one gap countdown to the following one. */
  private spawnNow(
    kind: ObstacleKind,
    speed: number,
    distance: number,
    showPreview: boolean,
    previewLead: number,
  ): void {
    const o = makeObstacle(kind, GAME_W + 10);
    this.list.push(o);
    this.lastKind = kind;
    this.lastPteroBand = o.pteroBand;
    this.pendingKind = null;
    this.previewQueue = null;
    this.armNextGap(speed, distance, showPreview, previewLead);
  }

  /**
   * Pick the upcoming obstacle and wait minGapPx/speed once.
   * Preview runs inside that same window (does not stack extra delay).
   */
  private armNextGap(
    speed: number,
    distance: number,
    showPreview: boolean,
    previewLead: number,
    fixedGapPx?: number,
  ): void {
    const kind = this.pickKind(distance);
    const gap = fixedGapPx ?? minGapPx(this.lastKind, kind, speed);
    const wait = gap / Math.max(1, speed);
    this.pendingKind = kind;
    if (showPreview) {
      this.previewQueue = {
        kind,
        in: Math.min(previewLead, wait * 0.9),
      };
    } else {
      this.previewQueue = null;
    }
    this.spawnTimer = wait;
  }

  private pickKind(distance: number): ObstacleKind {
    const prev = this.lastKind;
    const prevLowPtero = prev === 'ptero' && this.lastPteroBand === 'low';
    const prevJump = prev != null && prev !== 'empty' && isJumpGround(prev);

    // After a jump-ground hazard, prefer soft follow-ups (same gap size).
    if (prevJump || prevLowPtero) {
      const roll = Math.random();
      if (roll < 0.45) return 'cactusS';
      if (distance > 1400 && roll < 0.75) return 'ptero';
      if (distance > 900 && roll < 0.9) {
        return Math.random() < 0.5 ? 'museumDoor' : 'caveArch';
      }
      return 'cactusS';
    }

    const r = Math.random();
    if (distance > 900 && r < 0.14) {
      return Math.random() < 0.5 ? 'museumDoor' : 'caveArch';
    }
    if (distance > 1400 && r < 0.28) return 'ptero';

    const g = Math.random();
    if (distance > 5000 && g < 0.1 && prev !== 'cactusX4' && prev !== 'cactusX3') {
      return 'cactusX4';
    }
    if (distance > 2500 && g < 0.18 && prev !== 'cactusX3' && prev !== 'cactusX4') {
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
