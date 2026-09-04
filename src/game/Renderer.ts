import { drawDinoSkin, type SkinState } from '../art/skinLayers';
import { CLOUD, SPRITE_SCALE, drawGrid } from '../art/sprites';
import type { Player } from './Player';
import type { World } from './World';
import { GAME_H, GAME_W, GROUND_Y } from './World';

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    ctx.imageSmoothingEnabled = false;
  }

  resize(): void {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const pad = 12;
    const availW = Math.max(240, rect.width - pad);
    const availH = Math.max(140, rect.height - pad);
    const scale = Math.min(availW / GAME_W, availH / GAME_H);
    this.canvas.style.width = `${Math.floor(GAME_W * scale)}px`;
    this.canvas.style.height = `${Math.floor(GAME_H * scale)}px`;
    this.canvas.width = GAME_W;
    this.canvas.height = GAME_H;
    this.ctx.imageSmoothingEnabled = false;
  }

  clear(world: World, nightVision: boolean): void {
    const ctx = this.ctx;
    if (world.night) {
      const dark = nightVision ? 0.35 : 0.55;
      const g = ctx.createLinearGradient(0, 0, 0, GAME_H);
      g.addColorStop(0, `rgba(12, 22, 40, ${0.95})`);
      g.addColorStop(1, `rgba(28, 42, 38, ${0.98})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, GAME_W, GAME_H);
      ctx.fillStyle = `rgba(0,0,0,${dark})`;
      ctx.fillRect(0, 0, GAME_W, GAME_H);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, GAME_H);
      g.addColorStop(0, '#7ec8d4');
      g.addColorStop(0.55, '#e8c99a');
      g.addColorStop(1, '#c4a06a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, GAME_W, GAME_H);
    }

    // Chrome-style outline clouds (46×14 @ SPRITE_SCALE)
    const cloudRemap = world.night ? { u: '#6a7888' } : undefined;
    for (const c of world.clouds) {
      drawGrid(
        ctx,
        CLOUD,
        Math.floor(c.x),
        Math.floor(c.y),
        SPRITE_SCALE,
        1,
        cloudRemap,
      );
    }

    // Ground: solid fill + world-stable speckles (no flicker while scrolling)
    const line = world.night ? '#2a3a30' : '#2a2218';
    const dirt = world.night ? '#1e2e28' : '#6b5230';
    const dirtHi = world.night ? '#354840' : '#7a6238';
    const dirtLo = world.night ? '#18241e' : '#5a4828';
    ctx.fillStyle = line;
    ctx.fillRect(0, GROUND_Y, GAME_W, 3);

    ctx.fillStyle = dirt;
    ctx.fillRect(0, GROUND_Y + 3, GAME_W, GAME_H - GROUND_Y - 3);

    // Integer world scroll + screen offset so speckles slide, not pop/flicker
    const step = 8;
    const scroll = Math.floor(world.groundOffset);
    const origin = -((scroll % step) + step) % step;
    for (let sx = origin; sx < GAME_W; sx += step) {
      const wx = sx + scroll;
      const drawX = Math.floor(sx);
      for (let y = GROUND_Y + 8; y < GAME_H; y += step) {
        const n =
          (Math.imul(wx + 17, 374761393) ^ Math.imul(y + 31, 668265263)) >>> 0;
        if (n % 11 === 0) {
          ctx.fillStyle = dirtHi;
          ctx.fillRect(drawX, y, 2, 2);
        } else if (n % 17 === 0) {
          ctx.fillStyle = dirtLo;
          ctx.fillRect(drawX + 2, y + 2, 2, 2);
        }
      }
      if (((wx / step) | 0) % 4 === 0) {
        ctx.fillStyle = line;
        ctx.fillRect(drawX, GROUND_Y + 11, 5, 2);
      }
    }
  }

  drawPlayer(player: Player, skin: SkinState): void {
    const drawY = player.y - player.drawHeight;
    drawDinoSkin(this.ctx, player.x, drawY, SPRITE_SCALE, player.pose, 0, skin, {
      flash: player.iframeTimer > 0 && Math.floor(player.iframeTimer * 20) % 2 === 0,
      shield: player.shieldLeft > 0,
      grid: player.poseGrid,
    });
  }

  drawHud(
    score: number,
    high: number,
    dnaMult: string,
    shields: number,
    night: boolean,
  ): void {
    const ctx = this.ctx;
    ctx.fillStyle = night ? '#f5f0d8' : '#1a2e28';
    ctx.font =
      '20px "Fusion Pixel 12px Proportional SC", "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`HI ${String(high).padStart(5, '0')}`, GAME_W - 14, 28);
    ctx.fillText(String(score).padStart(5, '0'), GAME_W - 14, 54);
    ctx.textAlign = 'left';
    ctx.fillText(`DNA ${dnaMult}`, 14, 28);
    if (shields > 0) ctx.fillText(`SHD ${shields}`, 14, 54);
  }

  drawGameOver(score: number, dna: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(20, 30, 28, 0.55)';
    ctx.fillRect(0, 0, GAME_W, GAME_H);
    ctx.fillStyle = '#f5f0d8';
    ctx.font = '22px "Press Start 2P", "Fusion Pixel 12px Proportional SC", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', GAME_W / 2, GAME_H / 2 - 36);
    ctx.font = '14px "Fusion Pixel 12px Proportional SC", "Press Start 2P", monospace';
    ctx.fillText(`SCORE ${score}`, GAME_W / 2, GAME_H / 2);
    ctx.fillText(`+${dna} DNA`, GAME_W / 2, GAME_H / 2 + 24);
    ctx.font = '12px "Fusion Pixel 12px Proportional SC", "Press Start 2P", monospace';
    ctx.fillStyle = '#7dffc4';
    ctx.fillText('来馆里摸摸真的爬宠 · 冷血动物并不冷血', GAME_W / 2, GAME_H / 2 + 52);
    ctx.fillStyle = '#f5f0d8';
    ctx.fillText('点击或空格返回', GAME_W / 2, GAME_H / 2 + 76);
  }
}

export function createGameCanvas(parent: HTMLElement): {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
} {
  const canvas = document.createElement('canvas');
  canvas.width = GAME_W;
  canvas.height = GAME_H;
  canvas.className = 'game-canvas';
  parent.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  const renderer = new Renderer(canvas, ctx);
  renderer.resize();
  return { canvas, renderer };
}
