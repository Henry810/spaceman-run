import { drawDinoSkin, type SkinState } from '../art/skinLayers';
import { SPRITE_SCALE } from '../art/sprites';
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

    // clouds
    ctx.fillStyle = world.night ? 'rgba(180,200,220,0.25)' : 'rgba(255,255,255,0.55)';
    for (const c of world.clouds) {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w * 0.5, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(c.x + c.w * 0.3, c.y - 4, c.w * 0.35, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // ground — Chrome-like 1px line + speckles
    ctx.fillStyle = world.night ? '#4a6a58' : '#5a4a32';
    ctx.fillRect(0, GROUND_Y, GAME_W, 2);

    ctx.fillStyle = world.night ? '#3d5a48' : '#8b6b3d';
    ctx.fillRect(0, GROUND_Y + 2, GAME_W, GAME_H - GROUND_Y - 2);

    ctx.fillStyle = world.night ? '#4a6a58' : '#6e5230';
    for (let x = -world.groundOffset; x < GAME_W; x += 24) {
      ctx.fillRect(x, GROUND_Y + 8, 8, 1);
      if ((x / 24) % 3 === 0) ctx.fillRect(x + 14, GROUND_Y + 14, 2, 2);
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
    ctx.font = '16px "Fusion Pixel 12px Proportional SC", "Press Start 2P", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`HI ${String(high).padStart(5, '0')}`, GAME_W - 14, 24);
    ctx.fillText(String(score).padStart(5, '0'), GAME_W - 14, 46);
    ctx.textAlign = 'left';
    ctx.fillText(`DNA ${dnaMult}`, 14, 24);
    if (shields > 0) ctx.fillText(`SHD ${shields}`, 14, 46);
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
