import type { RuntimeBonuses } from '../meta/evolutionTree';
import type { DinoPose } from '../art/skinLayers';
import {
  DINO_DUCK,
  DINO_DUCK_B,
  DINO_DUCK_W,
  DINO_H,
  DINO_JUMP,
  DINO_RUN_A,
  DINO_RUN_B,
  DINO_W,
  SPRITE_SCALE,
  lastSolidRow,
} from '../art/sprites';
import { GROUND_Y } from './World';
import type { Input } from './Input';

const BASE_JUMP_WINDUP = 0.08;
const BASE_DUCK_WINDUP = 0.06;
/** Peak clears tall cactus (~88px) with ~20px margin; not floaty */
const BASE_JUMP_FORCE = -600;
const GRAVITY = 1678;
/** Faster fall after apex if jump is released — hang time only, same peak height */
const FALL_RELEASE_MUL = 2.2;
const FALL_HOLD_MUL = 0.82;
const BASE_LAND_RECOVERY = 0.07;
const SCALE = SPRITE_SCALE;

export type PlayerPhase =
  | 'run'
  | 'jumpWindup'
  | 'air'
  | 'duckWindup'
  | 'duck'
  | 'landRecovery';

export class Player {
  x = 80;
  y = GROUND_Y;
  vy = 0;
  phase: PlayerPhase = 'run';
  windupTimer = 0;
  landTimer = 0;
  animTime = 0;
  jumpsUsed = 0;
  shieldLeft = 0;
  iframeTimer = 0;
  ducking = false;
  private bonuses: RuntimeBonuses;

  constructor(bonuses: RuntimeBonuses) {
    this.bonuses = bonuses;
    this.shieldLeft = bonuses.shieldCharges;
  }

  reset(bonuses: RuntimeBonuses): void {
    this.bonuses = bonuses;
    this.x = 80;
    this.y = GROUND_Y;
    this.vy = 0;
    this.phase = 'run';
    this.windupTimer = 0;
    this.landTimer = 0;
    this.animTime = 0;
    this.jumpsUsed = 0;
    this.shieldLeft = bonuses.shieldCharges;
    this.iframeTimer = 0;
    this.ducking = false;
  }

  get pose(): DinoPose {
    if (this.phase === 'jumpWindup') return 'windup';
    if (this.phase === 'duck' || this.phase === 'duckWindup') return 'duck';
    if (this.phase === 'air') return 'jump';
    return this.animTime % 0.2 < 0.1 ? 'runA' : 'runB';
  }

  get poseGrid() {
    if (this.phase === 'duck' || this.phase === 'duckWindup') {
      return this.animTime % 0.2 < 0.1 ? DINO_DUCK : DINO_DUCK_B;
    }
    if (this.phase === 'air' || this.phase === 'jumpWindup') return DINO_JUMP;
    return this.animTime % 0.2 < 0.1 ? DINO_RUN_A : DINO_RUN_B;
  }

  get drawHeight(): number {
    // Duck shares Chrome's 47-tall cell so feet/shield stay plant-aligned.
    if (this.ducking || this.phase === 'duck' || this.phase === 'duckWindup') {
      return DINO_H * SCALE;
    }
    return (lastSolidRow(this.poseGrid) + 1) * SCALE;
  }

  get drawWidth(): number {
    if (this.ducking || this.phase === 'duck' || this.phase === 'duckWindup') {
      return DINO_DUCK_W * SCALE;
    }
    return DINO_W * SCALE;
  }

  /**
   * Duck hitbox matches local Google Dino: CollisionBox(1, 18, 55, 25).
   * Shield still follows solid pixel bounds of the official silhouette.
   */
  get hitbox(): { x: number; y: number; w: number; h: number } {
    const shrink = this.bonuses.hitboxShrink;
    const ducking =
      this.ducking || this.phase === 'duck' || this.phase === 'duckWindup';
    const gridH = ducking ? DINO_H : lastSolidRow(this.poseGrid) + 1;
    if (ducking) {
      // Slightly tighter than Chrome (1,18,55,25) so low pteros clear when ducked
      const box = { x: 1, y: 20, w: 55, h: 23 };
      return {
        x: this.x + box.x * SCALE + shrink,
        y: this.y - gridH * SCALE + box.y * SCALE + shrink,
        w: Math.max(SCALE, box.w * SCALE - shrink * 2),
        h: Math.max(SCALE, box.h * SCALE - shrink * 2),
      };
    }
    const box = { x: 12, y: 6, w: 20, h: 28 };
    return {
      x: this.x + box.x * SCALE + shrink,
      y: this.y - gridH * SCALE + box.y * SCALE + shrink,
      w: Math.max(SCALE, box.w * SCALE - shrink * 2),
      h: Math.max(SCALE, box.h * SCALE - shrink * 2),
    };
  }

  update(dt: number, input: Input): void {
    this.animTime += dt;
    if (this.iframeTimer > 0) this.iframeTimer -= dt;

    if (this.phase === 'landRecovery') {
      this.landTimer -= dt;
      if (input.duckPressed || input.duckHeld) {
        this.landTimer = 0;
        this.beginDuck(true);
        return;
      }
      if (input.jumpPressed) {
        this.landTimer = 0;
        this.phase = 'run';
        this.beginJump();
        return;
      }
      if (this.landTimer <= 0) this.phase = 'run';
      return;
    }

    if (this.phase === 'jumpWindup') {
      // Swipe/zone duck can cancel a pending jump.
      if (input.duckPressed || input.duckHeld) {
        this.windupTimer = 0;
        this.beginDuck(true);
        return;
      }
      this.windupTimer -= dt;
      if (this.windupTimer <= 0) this.launchJump();
      return;
    }

    if (this.phase === 'duckWindup') {
      this.windupTimer -= dt;
      if (this.windupTimer <= 0) {
        this.phase = 'duck';
        this.ducking = true;
      }
      return;
    }

    const onGround = this.y >= GROUND_Y - 0.5 && this.vy >= 0;

    if (this.phase === 'duck') {
      if (!input.duckHeld) {
        this.ducking = false;
        this.phase = 'run';
      }
      if (input.jumpPressed) this.beginJump();
      return;
    }

    if (onGround && this.phase === 'air') {
      this.y = GROUND_Y;
      this.vy = 0;
      this.jumpsUsed = 0;
      const recovery = BASE_LAND_RECOVERY * this.bonuses.landRecoveryMul;
      if (recovery > 0.01) {
        this.phase = 'landRecovery';
        this.landTimer = recovery;
      } else {
        this.phase = 'run';
      }
    }

    // Handle air (incl. double jump) BEFORE ground jump start, so a near-instant
    // first jump cannot consume jumpPressed for the double jump in the same frame.
    if (this.phase === 'air') {
      if (
        input.jumpPressed &&
        this.bonuses.doubleJump &&
        this.jumpsUsed === 1
      ) {
        this.launchJump(true);
      }
      if (this.bonuses.airDrift > 0) {
        if (input.leftHeld) this.x -= this.bonuses.airDrift * dt;
        if (input.rightHeld) this.x += this.bonuses.airDrift * dt;
        this.x = Math.max(40, Math.min(140, this.x));
      }

      const rising = this.vy < 0;
      let g = GRAVITY;
      if (!rising) {
        g = input.jumpHeld ? GRAVITY * FALL_HOLD_MUL : GRAVITY * FALL_RELEASE_MUL;
      }
      this.vy += g * dt;
      this.y += this.vy * dt;
      if (this.y > GROUND_Y) {
        this.y = GROUND_Y;
        this.vy = 0;
      }
      return;
    }

    if (this.phase === 'run') {
      if (input.jumpPressed) this.beginJump();
      else if (input.duckPressed || input.duckHeld) this.beginDuck();
    }
  }

  private beginJump(): void {
    if (this.phase === 'air') return;
    const windup = BASE_JUMP_WINDUP * this.bonuses.jumpWindupMul;
    this.ducking = false;
    if (windup < 0.02) {
      this.launchJump();
    } else {
      this.phase = 'jumpWindup';
      this.windupTimer = windup;
    }
  }

  private beginDuck(fromCancel = false): void {
    if (this.phase === 'air') return;
    if (
      !fromCancel &&
      this.phase !== 'run' &&
      this.phase !== 'landRecovery'
    ) {
      return;
    }
    const windup = BASE_DUCK_WINDUP * this.bonuses.duckWindupMul;
    this.jumpsUsed = 0;
    this.vy = 0;
    if (windup < 0.02) {
      this.phase = 'duck';
      this.ducking = true;
    } else {
      this.phase = 'duckWindup';
      this.windupTimer = windup;
    }
  }

  private launchJump(isDouble = false): void {
    this.phase = 'air';
    this.ducking = false;
    this.vy = BASE_JUMP_FORCE * this.bonuses.jumpForceMul;
    if (isDouble) this.vy *= 0.92;
    this.jumpsUsed = isDouble ? 2 : 1;
  }

  /** Returns true if absorbed by shield */
  tryHit(): 'dead' | 'shield' | 'iframe' {
    if (this.iframeTimer > 0) return 'iframe';
    if (this.shieldLeft > 0) {
      this.shieldLeft -= 1;
      this.iframeTimer = Math.max(0.6, this.bonuses.iframeMs / 1000);
      return 'shield';
    }
    return 'dead';
  }
}
