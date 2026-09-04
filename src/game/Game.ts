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

export type GameResult = {
  score: number;
  dna: number;
  newAchievements: string[];
  save: SaveData;
};

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
  private bonuses;
  private skin: SkinState;
  private onDone: (r: GameResult) => void;
  private renderer: Renderer;
  private save: SaveData;

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
    this.dashLeft = this.bonuses.startDashMs / 1000;
  }

  start(): void {
    this.running = true;
    this.over = false;
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

  private update(dt: number): void {
    if (this.dashLeft > 0) this.dashLeft -= dt;
    const dash = this.dashLeft > 0 ? 120 : 0;
    this.world.update(dt, dash);
    if (this.world.night) this.hitNight = true;

    this.player.update(dt, this.input);
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
    );

    const ph = this.player.hitbox;
    for (let i = 0; i < this.obstacles.list.length; i++) {
      const o = this.obstacles.list[i];
      const boxes = obstacleHitboxes(o);
      if (!boxes.some((oh) => aabb(ph, oh))) continue;
      const outcome = this.player.tryHit();
      if (outcome === 'shield') {
        this.shieldUsed = true;
        this.obstacles.list.splice(i, 1);
        break;
      }
      if (outcome === 'dead') {
        this.endRun();
        break;
      }
    }
  }

  private endRun(): void {
    this.over = true;
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
}
