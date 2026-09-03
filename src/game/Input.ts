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
  private pointerId: number | null = null;
  private startY = 0;
  private startX = 0;
  private duckedThisGesture = false;

  constructor(target: HTMLElement) {
    this.target = target;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    target.addEventListener('pointerdown', this.onPointerDown);
    target.addEventListener('pointermove', this.onPointerMove);
    target.addEventListener('pointerup', this.onPointerUp);
    target.addEventListener('pointercancel', this.onPointerUp);
    target.addEventListener('pointerleave', this.onPointerUp);
    // Non-passive: block browser scroll / pull-to-refresh while playing
    target.addEventListener('touchstart', this.blockScroll, { passive: false });
    target.addEventListener('touchmove', this.blockScroll, { passive: false });
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.target.removeEventListener('pointerdown', this.onPointerDown);
    this.target.removeEventListener('pointermove', this.onPointerMove);
    this.target.removeEventListener('pointerup', this.onPointerUp);
    this.target.removeEventListener('pointercancel', this.onPointerUp);
    this.target.removeEventListener('pointerleave', this.onPointerUp);
    this.target.removeEventListener('touchstart', this.blockScroll);
    this.target.removeEventListener('touchmove', this.blockScroll);
  }

  /** Call once per frame after reading edge presses */
  endFrame(): void {
    this.jumpPressed = false;
    this.duckPressed = false;
  }

  private blockScroll = (e: TouchEvent): void => {
    e.preventDefault();
  };

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

  private onPointerDown = (e: PointerEvent): void => {
    e.preventDefault();
    this.pointerId = e.pointerId;
    this.startY = e.clientY;
    this.startX = e.clientX;
    this.duckedThisGesture = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    this.jumpHeld = true;
    this.duckHeld = false;
    if (!this.jumpLatch) {
      this.jumpPressed = true;
      this.jumpLatch = true;
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (this.pointerId !== e.pointerId) return;
    e.preventDefault();
    const dy = e.clientY - this.startY;
    const dx = e.clientX - this.startX;
    // Swipe down to duck (ignore mostly-horizontal pans)
    if (!this.duckedThisGesture && dy > 28 && dy > Math.abs(dx) * 0.85) {
      this.duckedThisGesture = true;
      this.jumpHeld = false;
      this.jumpLatch = false;
      this.duckHeld = true;
      if (!this.duckLatch) {
        this.duckPressed = true;
        this.duckLatch = true;
      }
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.pointerId !== e.pointerId) return;
    e.preventDefault();
    const dy = e.clientY - this.startY;
    const dx = e.clientX - this.startX;
    this.jumpHeld = false;
    this.jumpLatch = false;
    if (
      !this.duckedThisGesture &&
      dy > 28 &&
      dy > Math.abs(dx) * 0.85
    ) {
      this.duckPressed = true;
      this.duckHeld = true;
      this.duckLatch = true;
      window.setTimeout(() => {
        this.duckHeld = false;
        this.duckLatch = false;
      }, 220);
    } else {
      this.duckHeld = false;
      this.duckLatch = false;
    }
    this.pointerId = null;
    this.duckedThisGesture = false;
  };
}
