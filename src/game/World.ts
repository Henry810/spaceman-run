export const GAME_W = 960;
export const GAME_H = 300;
export const GROUND_Y = 248;

/** Chrome Cloud.config scaled ~2× for our canvas */
const CLOUD_W = 46 * 2;
const MAX_CLOUDS = 6;
const MIN_CLOUD_GAP = 100 * 2;
const MAX_CLOUD_GAP = 400 * 2;
/** Sky band from top (Chrome 30–71 on 150px → ~40–120 here) */
const MIN_SKY = 40;
const MAX_SKY = 120;
const BG_CLOUD_SPEED = 0.2;

/** Distance per day/night half-cycle */
const NIGHT_SEGMENT = 3500;
/** Seconds to blend day ↔ night */
const TWILIGHT_SEC = 2.8;

export class World {
  distance = 0;
  speed = 280;
  elapsed = 0;
  /** True when past twilight midpoint — used for gameplay/achievements */
  night = false;
  /** 0 = full day, 1 = full night (smooth for rendering) */
  nightFactor = 0;
  clouds: { x: number; y: number; gap: number }[] = [];
  groundOffset = 0;

  constructor() {
    this.seedClouds();
  }

  private seedClouds(): void {
    this.clouds = [];
    let x = 60;
    for (let i = 0; i < 3; i++) {
      this.clouds.push({
        x,
        y: MIN_SKY + Math.random() * (MAX_SKY - MIN_SKY),
        gap: MIN_CLOUD_GAP + Math.random() * (MAX_CLOUD_GAP - MIN_CLOUD_GAP),
      });
      x +=
        CLOUD_W + MIN_CLOUD_GAP + Math.random() * (MAX_CLOUD_GAP - MIN_CLOUD_GAP);
    }
  }

  reset(): void {
    this.distance = 0;
    this.speed = 280;
    this.elapsed = 0;
    this.night = false;
    this.nightFactor = 0;
    this.groundOffset = 0;
    this.seedClouds();
  }

  update(dt: number, dashBoost = 0): void {
    this.elapsed += dt;
    const base = 280 + Math.min(220, this.distance * 0.012);
    this.speed = base + dashBoost;
    this.distance += this.speed * dt;
    this.groundOffset = (this.groundOffset + this.speed * dt) % 24;

    const wantNight = Math.floor(this.distance / NIGHT_SEGMENT) % 2 === 1;
    const target = wantNight ? 1 : 0;
    const step = dt / TWILIGHT_SEC;
    if (this.nightFactor < target) {
      this.nightFactor = Math.min(target, this.nightFactor + step);
    } else if (this.nightFactor > target) {
      this.nightFactor = Math.max(target, this.nightFactor - step);
    }
    this.night = this.nightFactor > 0.5;

    const drift = this.speed * BG_CLOUD_SPEED * dt;
    for (const c of this.clouds) {
      c.x -= drift;
    }
    this.clouds = this.clouds.filter((c) => c.x + CLOUD_W > -10);

    const last = this.clouds[this.clouds.length - 1];
    const need =
      this.clouds.length < MAX_CLOUDS && (!last || GAME_W - last.x > last.gap);
    if (need) {
      this.clouds.push({
        x: GAME_W + Math.random() * 40,
        y: MIN_SKY + Math.random() * (MAX_SKY - MIN_SKY),
        gap: MIN_CLOUD_GAP + Math.random() * (MAX_CLOUD_GAP - MIN_CLOUD_GAP),
      });
    }
  }

  get score(): number {
    return Math.floor(this.distance / 10);
  }
}
