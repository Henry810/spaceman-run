import { EVOLUTION_NODES } from '../meta/evolutionTree';
import {
  DINO_DUCK,
  DINO_DUCK_B,
  DINO_H,
  DINO_JUMP,
  DINO_RUN_A,
  DINO_RUN_B,
  DINO_W,
  OVERLAY_REMAPS,
  SCAR_MARKS,
  SCAR_MARKS_DUCK,
  SKIN_PARTS,
  SKIN_PARTS_DUCK,
  SPRITE_SCALE,
  type PixelGrid,
  drawGrid,
  gridBounds,
} from './sprites';

export type DinoPose = 'runA' | 'runB' | 'jump' | 'duck' | 'windup';

export interface SkinState {
  unlockedNodes: string[];
  equippedOverlay: string | null;
}

function basePose(pose: DinoPose, frame: number): PixelGrid {
  switch (pose) {
    case 'duck':
      return frame % 2 === 0 ? DINO_DUCK : DINO_DUCK_B;
    case 'jump':
    case 'windup':
      return DINO_JUMP;
    case 'runB':
      return DINO_RUN_B;
    case 'runA':
    default:
      return frame % 2 === 0 ? DINO_RUN_A : DINO_RUN_B;
  }
}

export function getUnlockedSkinParts(unlockedNodes: string[]): string[] {
  return EVOLUTION_NODES.filter((n) => unlockedNodes.includes(n.id)).map(
    (n) => n.skinPart,
  );
}

export function drawDinoSkin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  pose: DinoPose,
  frame: number,
  skin: SkinState,
  options?: { flash?: boolean; shield?: boolean; grid?: PixelGrid },
): void {
  const remap =
    skin.equippedOverlay && OVERLAY_REMAPS[skin.equippedOverlay]
      ? OVERLAY_REMAPS[skin.equippedOverlay]
      : undefined;

  const body = options?.grid ?? basePose(pose, frame);
  drawGrid(ctx, body, x, y, scale, 1, remap);

  const isDuck = pose === 'duck';
  const partAtlas = isDuck ? SKIN_PARTS_DUCK : SKIN_PARTS;
  for (const part of getUnlockedSkinParts(skin.unlockedNodes)) {
    const grid = partAtlas[part];
    if (grid) drawGrid(ctx, grid, x, y, scale);
  }
  if (skin.equippedOverlay === 'scar_base') {
    drawGrid(ctx, isDuck ? SCAR_MARKS_DUCK : SCAR_MARKS, x, y, scale);
  }

  if (options?.shield || options?.flash) {
    const b = gridBounds(body);
    const bx = x + b.x * scale;
    const by = y + b.y * scale;
    const bw = b.w * scale;
    const bh = b.h * scale;
    if (options.shield) {
      ctx.strokeStyle = 'rgba(224, 144, 72, 0.9)';
      ctx.lineWidth = 2;
      // Exact solid AABB — inset was clipping the duck snout
      ctx.strokeRect(bx + 0.5, by + 0.5, Math.max(1, bw - 1), Math.max(1, bh - 1));
    }
    if (options.flash) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(bx, by, bw, bh);
    }
  }
}

function unionGridBounds(grids: PixelGrid[]): ReturnType<typeof gridBounds> {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const grid of grids) {
    const b = gridBounds(grid);
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.w - 1);
    maxY = Math.max(maxY, b.y + b.h - 1);
  }
  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: DINO_W, h: DINO_H };
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

export function renderDinoPreview(
  canvas: HTMLCanvasElement,
  skin: SkinState,
  pose: DinoPose = 'runA',
): void {
  const body = basePose(pose, 0);
  const layers: PixelGrid[] = [body];
  const partAtlas = pose === 'duck' ? SKIN_PARTS_DUCK : SKIN_PARTS;
  for (const part of getUnlockedSkinParts(skin.unlockedNodes)) {
    const grid = partAtlas[part];
    if (grid) layers.push(grid);
  }
  if (skin.equippedOverlay === 'scar_base') {
    layers.push(pose === 'duck' ? SCAR_MARKS_DUCK : SCAR_MARKS);
  }
  const b = unionGridBounds(layers);
  const pad = 5;
  const scale = 4;
  const w = (b.w + pad * 2) * scale;
  const h = (b.h + pad * 2) * scale;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);
  drawDinoSkin(
    ctx,
    (pad - b.x) * scale,
    (pad - b.y) * scale,
    scale,
    pose,
    0,
    skin,
  );
}

export { DINO_H, DINO_W, SPRITE_SCALE };
