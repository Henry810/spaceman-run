export class Input {
  jumpHeld = false;
  duckHeld = false;
  leftHeld = false;
  rightHeld = false;
  jumpPressed = false;
  duckPressed = false;

  private jumpLatch = false;
  private duckLatch = false;
  private target: HTMLElement;

  constructor(target: HTMLElement) {
    this.target = target;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    target.addEventListener('pointerdown', this.onPointerDown);
    target.addEventListener('pointerup', this.onPointerUp);
    target.addEventListener('pointercancel', this.onPointerUp);
    target.addEventListener('pointerleave', this.onPointerUp);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.target.removeEventListener('pointerdown', this.onPointerDown);
    this.target.removeEventListener('pointerup', this.onPointerUp);
    this.target.removeEventListener('pointercancel', this.onPointerUp);
    this.target.removeEventListener('pointerleave', this.onPointerUp);
  }

  /** Call once per frame after reading edge presses */
  endFrame(): void {
    this.jumpPressed = false;
    this.duckPressed = false;
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.repeat) return;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      this.jumpHeld = true;
      if (!this.jumpLatch) {
        this.jumpPressed = true;
        this.jumpLatch = true;
      }
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      e.preventDefault();
      this.duckHeld = true;
      if (!this.duckLatch) {
        this.duckPressed = true;
        this.duckLatch = true;
      }
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.leftHeld = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') this.rightHeld = true;
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.jumpHeld = false;
      this.jumpLatch = false;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      this.duckHeld = false;
      this.duckLatch = false;
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.leftHeld = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') this.rightHeld = false;
  };

  private pointerId: number | null = null;
  private startY = 0;

  private onPointerDown = (e: PointerEvent): void => {
    this.pointerId = e.pointerId;
    this.startY = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    this.jumpHeld = true;
    if (!this.jumpLatch) {
      this.jumpPressed = true;
      this.jumpLatch = true;
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.pointerId !== e.pointerId) return;
    const dy = e.clientY - this.startY;
    this.jumpHeld = false;
    this.jumpLatch = false;
    if (dy > 40) {
      this.duckPressed = true;
      this.duckHeld = true;
      setTimeout(() => {
        this.duckHeld = false;
      }, 200);
    }
    this.pointerId = null;
  };
}
