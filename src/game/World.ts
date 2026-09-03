export const GAME_W = 960;
export const GAME_H = 300;
export const GROUND_Y = 248;

export class World {
  distance = 0;
  speed = 280;
  elapsed = 0;
  night = false;
  clouds: { x: number; y: number; w: number }[] = [];
  groundOffset = 0;

  constructor() {
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: Math.random() * GAME_W,
        y: 20 + Math.random() * 60,
        w: 30 + Math.random() * 50,
      });
    }
  }

  reset(): void {
    this.distance = 0;
    this.speed = 280;
    this.elapsed = 0;
    this.night = false;
    this.groundOffset = 0;
  }

  update(dt: number, dashBoost = 0): void {
    this.elapsed += dt;
    const base = 280 + Math.min(220, this.distance * 0.012);
    this.speed = base + dashBoost;
    this.distance += this.speed * dt;
    this.groundOffset = (this.groundOffset + this.speed * dt) % 24;
    // Night cycles every ~45s of run time after score-ish distance
    this.night = Math.floor(this.distance / 3500) % 2 === 1;

    for (const c of this.clouds) {
      c.x -= this.speed * 0.15 * dt;
      if (c.x + c.w < 0) {
        c.x = GAME_W + Math.random() * 80;
        c.y = 20 + Math.random() * 60;
      }
    }
  }

  get score(): number {
    return Math.floor(this.distance / 10);
  }
}
