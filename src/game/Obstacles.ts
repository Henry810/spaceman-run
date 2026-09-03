import {
  CACTUS_S,
  CACTUS_TALL,
  CACTUS_X2,
  CACTUS_X3,
  CACTUS_X4,
  PTERO_A,
  PTERO_B,
  SPRITE_SCALE,
  drawGrid,
  gridSize,
  lastSolidRow,
  plantY,
  type PixelGrid,
} from '../art/sprites';
import { GAME_W, GROUND_Y } from './World';

export type ObstacleKind =
  | 'cactusS'
  | 'cactusT'
  | 'cactusX2'
  | 'cactusX3'
  | 'cactusX4'
  | 'ptero';

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
    if (band < 0.34) y = GROUND_Y - 52;
    else if (band < 0.67) y = GROUND_Y - 72;
    else y = GROUND_Y - 92;
  } else {
    y = plantY(GROUND_Y, grid, PIXEL);
  }
  return { kind, x, y, grid, w: w * PIXEL, h: solidH * PIXEL };
}

export class ObstacleManager {
  list: Obstacle[] = [];
  private spawnTimer = 1.2;
  private previewQueue: { kind: ObstacleKind; in: number } | null = null;

  reset(): void {
    this.list = [];
    this.spawnTimer = 1.2;
    this.previewQueue = null;
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
      const kind = this.pickKind(distance);
      const widthFactor =
        kind === 'cactusX4' ? 1.4 : kind === 'cactusX3' ? 1.25 : kind === 'cactusX2' ? 1.12 : 1;
      const gap =
        (1.05 + Math.random() * 0.85 - Math.min(0.35, distance / 22000)) * widthFactor;
      this.spawnTimer = Math.max(0.75, gap);

      if (showPreview) {
        this.previewQueue = { kind, in: previewLead };
      } else {
        this.list.push(makeObstacle(kind, GAME_W + 10));
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
    if (distance > 1400 && r < 0.22) return 'ptero';

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
