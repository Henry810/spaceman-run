import { scoreToDna, formatMultiplier } from '../meta/currency';
import { computeBonuses } from '../meta/evolutionTree';
import type { SaveData } from '../meta/save';
import { evaluateAchievements, type RunStats } from '../meta/achievements';
import { writeSave } from '../meta/save';
import type { SkinState } from '../art/skinLayers';
import { Input } from './Input';
import { Player } from './Player';
import { ObstacleManager, aabb, obstacleHitboxes } from './Obstacles';
import { World } from './World';
import { Renderer } from './Renderer';
import { playSfx, unlockAudio } from '../audio/sfx';

export type GameResult = {
  score: number;
  dna: number;
  newAchievements: string[];
  save: SaveData;
};

/** HUD meters → world.distance (score = distance / 10). */
const METER = 10;
const WARP_IFRAME_SEC = 1.35;
const BOLT_W = 22;
const BOLT_H = 8;
const BOLT_SPEED = 720;

type WarpState = {
  startDistance: number;
  targetDistance: number;
  /** After warp ends, still call endRun (death dash). */
  endsInDeath: boolean;
};

type Bolt = { x: number; y: number };

export class Game {
  private world = new World();
  private player: Player;
  private obstacles = new ObstacleManager();
  private input: Input;
  private raf = 0;
  private last = 0;
  private running = false;
  private over = false;
  private result: GameResult | null = null;
  private dashLeft = 0;
  private hitNight = false;
  private shieldUsed = false;
  private lastScoreChime = 0;
  private bonuses;
  private skin: SkinState;
  private onDone: (r: GameResult) => void;
  private renderer: Renderer;
  private save: SaveData;
  private warp: WarpState | null = null;
  private deathWarpUsed = false;
  private bolts: Bolt[] = [];
  private boltCd = 0;

  constructor(
    renderer: Renderer,
    save: SaveData,
    onDone: (r: GameResult) => void,
  ) {
    this.renderer = renderer;
    this.save = save;
    this.bonuses = computeBonuses(save.unlockedNodes);
    this.player = new Player(this.bonuses);
    this.skin = {
      unlockedNodes: save.unlockedNodes,
      equippedOverlay: save.equippedOverlay,
    };
    this.input = new Input(renderer.canvas.parentElement ?? renderer.canvas);
    this.onDone = onDone;

    if (this.bonuses.startWarpMeters > 0) {
      this.beginWarp(this.bonuses.startWarpMeters * METER, false, false);
      this.dashLeft = 0;
    } else {
      this.dashLeft = this.bonuses.startDashMs / 1000;
    }
    this.boltCd =
      this.bonuses.boltIntervalSec > 0 ? this.bonuses.boltIntervalSec * 0.35 : 0;
  }

  start(): void {
    unlockAudio();
    if (this.warp) playSfx('warp');
    this.running = true;
    this.over = false;
    this.lastScoreChime = 0;
    this.last = performance.now();
    this.loop(this.last);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.input.dispose();
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;

    if (!this.over) {
      this.update(dt);
      this.draw();
    } else {
      this.draw();
      if (this.input.confirmPressed || this.input.jumpPressed) {
        this.finish();
        return;
      }
    }

    this.input.endFrame();
    this.raf = requestAnimationFrame(this.loop);
  };

  private beginWarp(
    targetDistance: number,
    endsInDeath: boolean,
    playSound = true,
  ): void {
    const start = this.world.distance;
    this.warp = {
      startDistance: start,
      targetDistance: Math.max(start + 80, targetDistance),
      endsInDeath,
    };
    this.obstacles.clearAll();
    if (!endsInDeath) this.obstacles.skipIntro();
    this.bolts = [];
    if (playSound) playSfx('warp');
  }

  private warpBoost(): number {
    if (!this.warp) return 0;
    const span = Math.max(1, this.warp.targetDistance - this.warp.startDistance);
    const t = Math.min(
      1,
      Math.max(0, (this.world.distance - this.warp.startDistance) / span),
    );
    // Ultra-fast at start, ease down near the target meter.
    const ease = (1 - t) * (1 - t);
    return 180 + 980 * ease;
  }

  private finishWarp(): void {
    if (!this.warp) return;
    const death = this.warp.endsInDeath;
    this.warp = null;
    this.player.iframeTimer = Math.max(this.player.iframeTimer, WARP_IFRAME_SEC);
    if (death) {
      this.endRun();
    } else {
      playSfx('warpEnd');
      this.obstacles.skipIntro();
    }
  }

  private update(dt: number): void {
    if (this.dashLeft > 0) this.dashLeft -= dt;
    const dash = this.warp ? this.warpBoost() : this.dashLeft > 0 ? 120 : 0;
    this.world.update(dt, dash);
    if (this.world.night) this.hitNight = true;

    if (this.warp && this.world.distance >= this.warp.targetDistance) {
      this.world.distance = this.warp.targetDistance;
      this.finishWarp();
      if (this.over) return;
    }
    if (this.over) return;

    // Death warp: still "dead" — no player control, only coast.
    if (!(this.warp?.endsInDeath)) {
      this.player.update(dt, this.input);
    } else {
      this.player.animTime += dt;
      if (this.player.iframeTimer > 0) this.player.iframeTimer -= dt;
    }

    const score = this.world.score;
    const bucket = Math.floor(score / 100);
    if (bucket > 0 && bucket > this.lastScoreChime) {
      this.lastScoreChime = bucket;
      playSfx('score');
    }

    const warping = this.warp != null;
    if (warping) {
      this.obstacles.clearAll();
    }

    this.obstacles.update(
      dt,
      this.world.speed,
      this.world.distance,
      this.bonuses.obstaclePreview,
      this.save.unlockedNodes.includes('per_6')
        ? 1.0
        : this.save.unlockedNodes.includes('per_5')
          ? 0.85
          : 0.55,
      !warping,
    );

    if (!warping && !this.warp?.endsInDeath) {
      this.updateBolts(dt);
    }

    if (warping) return;

    const ph = this.player.hitbox;
    for (let i = 0; i < this.obstacles.list.length; i++) {
      const o = this.obstacles.list[i];
      const boxes = obstacleHitboxes(o);
      if (!boxes.some((oh) => aabb(ph, oh))) continue;
      const outcome = this.player.tryHit();
      if (outcome === 'shield') {
        this.shieldUsed = true;
        this.obstacles.list.splice(i, 1);
        playSfx('shield');
        break;
      }
      if (outcome === 'dead') {
        if (
          this.bonuses.deathWarpMeters > 0 &&
          !this.deathWarpUsed
        ) {
          this.deathWarpUsed = true;
          playSfx('hit');
          this.beginWarp(
            this.world.distance + this.bonuses.deathWarpMeters * METER,
            true,
          );
          this.player.iframeTimer = 999;
          break;
        }
        this.endRun();
        break;
      }
    }
  }

  private updateBolts(dt: number): void {
    if (this.bonuses.boltIntervalSec <= 0) return;

    this.boltCd -= dt;
    if (this.boltCd <= 0) {
      this.boltCd = this.bonuses.boltIntervalSec;
      const hb = this.player.hitbox;
      this.bolts.push({
        x: hb.x + hb.w,
        y: hb.y + hb.h * 0.35,
      });
      playSfx('bolt');
    }

    for (const b of this.bolts) {
      b.x += BOLT_SPEED * dt;
    }

    const next: Bolt[] = [];
    for (const b of this.bolts) {
      if (b.x > 980) continue;
      const box = { x: b.x, y: b.y, w: BOLT_W, h: BOLT_H };
      let hit = false;
      let bestI = -1;
      let bestX = Infinity;
      for (let i = 0; i < this.obstacles.list.length; i++) {
        const o = this.obstacles.list[i];
        if (o.x + o.w < b.x) continue;
        const boxes = obstacleHitboxes(o);
        if (!boxes.some((oh) => aabb(box, oh))) continue;
        if (o.x < bestX) {
          bestX = o.x;
          bestI = i;
        }
      }
      if (bestI >= 0) {
        this.obstacles.list.splice(bestI, 1);
        playSfx('boltHit');
        hit = true;
      }
      if (!hit) next.push(b);
    }
    this.bolts = next;
  }

  private endRun(): void {
    this.over = true;
    this.warp = null;
    this.bolts = [];
    if (!this.deathWarpUsed) playSfx('hit');
    const score = this.world.score;
    const dna = scoreToDna(score, this.save.unlockedNodes);

    this.save.stats.gamesPlayed += 1;
    this.save.totalDistance += Math.floor(this.world.distance);
    if (score > this.save.highScore) this.save.highScore = score;
    if (this.shieldUsed) this.save.stats.shieldBlocks += 1;
    if (this.hitNight) this.save.stats.nightRuns += 1;
    if (dna > this.save.stats.bestSingleDna) {
      this.save.stats.bestSingleDna = dna;
    }
    this.save.dna += dna;

    const run: RunStats = {
      score,
      distance: this.world.distance,
      wasNight: this.hitNight,
      shieldUsed: this.shieldUsed,
      dnaEarned: dna,
    };
    const newly = evaluateAchievements(this.save, run);
    for (const id of newly) {
      if (!this.save.unlockedAchievements.includes(id)) {
        this.save.unlockedAchievements.push(id);
      }
    }
    writeSave(this.save);

    this.result = { score, dna, newAchievements: newly, save: this.save };
  }

  private finish(): void {
    if (!this.result) return;
    this.stop();
    this.onDone(this.result);
  }

  private draw(): void {
    this.renderer.clear(this.world, this.bonuses.nightVision);
    this.obstacles.draw(this.renderer.ctx, this.bonuses.obstaclePreview);
    this.drawBolts();
    this.renderer.drawPlayer(this.player, this.skin);
    this.renderer.drawHud(
      this.world.score,
      this.save.highScore,
      formatMultiplier(this.save.unlockedNodes),
      this.player.shieldLeft,
      this.world.night,
    );
    if (this.over && this.result) {
      this.renderer.drawGameOver(this.result.score, this.result.dna);
    }
  }

  private drawBolts(): void {
    if (this.bolts.length === 0) return;
    const ctx = this.renderer.ctx;
    for (const b of this.bolts) {
      ctx.fillStyle = '#ffe066';
      ctx.fillRect(b.x, b.y, BOLT_W, BOLT_H);
      ctx.fillStyle = '#fff8c8';
      ctx.fillRect(b.x + 4, b.y + 2, BOLT_W - 8, 3);
      ctx.fillStyle = '#c45a20';
      ctx.fillRect(b.x + BOLT_W - 4, b.y - 1, 6, BOLT_H + 2);
    }
  }
}
