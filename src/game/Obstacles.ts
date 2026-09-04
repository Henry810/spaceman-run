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
 * Body core only — wide wing AABB was unfair.
 */
const PTERO_INSET: BoxInset = { x: 8, top: 5, bottom: 4 };

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
}

const PIXEL = SPRITE_SCALE;

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
  if (kind === 'ptero') {
    const band = Math.random();
    // Scaled for SPRITE_SCALE=2 — low band forces duck
    if (band < 0.34) y = GROUND_Y - 58 * PIXEL;
    else if (band < 0.67) y = GROUND_Y - 78 * PIXEL;
    else y = GROUND_Y - 98 * PIXEL;
  } else {
    y = plantY(GROUND_Y, grid, PIXEL);
  }
  return { kind, x, y, grid, w: w * PIXEL, h: solidH * PIXEL };
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

  reset(): void {
    this.list = [];
    this.spawnTimer = 0.9;
    this.previewQueue = null;
    this.introIndex = 0;
  }

  update(
    dt: number,
    speed: number,
    distance: number,
    showPreview: boolean,
    previewLead = 0.55,
  ): void {
    this.spawnTimer -= dt;

    if (this.previewQueue) {
      this.previewQueue.in -= dt;
      if (this.previewQueue.in <= 0) {
        this.list.push(makeObstacle(this.previewQueue.kind, GAME_W + 10));
        this.previewQueue = null;
      }
    }

    if (this.spawnTimer <= 0 && !this.previewQueue) {
      if (this.introIndex < INTRO_BEATS.length) {
        const beat = INTRO_BEATS[this.introIndex++];
        if (beat === 'empty') {
          this.spawnTimer = 1.45;
        } else {
          this.list.push(makeObstacle(beat, GAME_W + 10));
          this.spawnTimer =
            beat === 'caveArch' ? 1.35 : beat === 'cactusX2' ? 1.25 : 1.15;
        }
      } else {
        const kind = this.pickKind(distance);
        const widthFactor =
          kind === 'cactusX4'
            ? 1.35
            : kind === 'cactusX3'
              ? 1.2
              : kind === 'cactusX2'
                ? 1.1
                : kind === 'museumDoor' || kind === 'caveArch'
                  ? 1.15
                  : 1;
        const gap =
          (0.88 + Math.random() * 0.72 - Math.min(0.4, distance / 20000)) *
          widthFactor;
        this.spawnTimer = Math.max(0.55, gap);

        if (showPreview) {
          this.previewQueue = { kind, in: previewLead };
        } else {
          this.list.push(makeObstacle(kind, GAME_W + 10));
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

  private pickKind(distance: number): ObstacleKind {
    const r = Math.random();
    if (distance > 900 && r < 0.14) {
      return Math.random() < 0.5 ? 'museumDoor' : 'caveArch';
    }
    if (distance > 1400 && r < 0.28) return 'ptero';

    const g = Math.random();
    if (distance > 5000 && g < 0.12) return 'cactusX4';
    if (distance > 2500 && g < 0.22) return 'cactusX3';
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
