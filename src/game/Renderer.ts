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
    const t = clamp01(world.nightFactor);
    const daySky = ['#7ec8d4', '#e8c99a', '#c4a06a'] as const;
    const nightSky = ['#0c1628', '#1c2a26', '#1a2420'] as const;
    const g = ctx.createLinearGradient(0, 0, 0, GAME_H);
    g.addColorStop(0, lerpHex(daySky[0], nightSky[0], t));
    g.addColorStop(0.55, lerpHex(daySky[1], nightSky[1], t));
    g.addColorStop(1, lerpHex(daySky[2], nightSky[2], t));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Night veil ramps with twilight (night vision softens the peak)
    if (t > 0.02) {
      const peak = nightVision ? 0.35 : 0.55;
      ctx.fillStyle = `rgba(0,0,0,${peak * t})`;
      ctx.fillRect(0, 0, GAME_W, GAME_H);
    }

    // Chrome-style outline clouds (46×14 @ SPRITE_SCALE)
    const cloudDay = '#e8ecec';
    const cloudNight = '#6a7888';
    const cloudRemap = { u: lerpHex(cloudDay, cloudNight, t) };
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
    const line = lerpHex('#2a2218', '#2a3a30', t);
    const dirt = lerpHex('#6b5230', '#1e2e28', t);
    const dirtHi = lerpHex('#7a6238', '#354840', t);
    const dirtLo = lerpHex('#5a4828', '#18241e', t);
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

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function lerpHex(a: string, b: string, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
