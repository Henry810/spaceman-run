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
  private touchJumpActive = false;
  private zoneDuck = false;
  private duckReleaseTimer = 0;

  constructor(target: HTMLElement) {
    this.target = target;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    target.addEventListener('pointerdown', this.onPointerDown);
    target.addEventListener('pointermove', this.onPointerMove);
    target.addEventListener('pointerup', this.onPointerUp);
    target.addEventListener('pointercancel', this.onPointerUp);
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
    this.target.removeEventListener('touchstart', this.blockScroll);
    this.target.removeEventListener('touchmove', this.blockScroll);
    this.clearDuckReleaseTimer();
  }

  endFrame(): void {
    this.jumpPressed = false;
    this.duckPressed = false;
  }

  private blockScroll = (e: TouchEvent): void => {
    e.preventDefault();
  };

  private clearDuckReleaseTimer(): void {
    if (this.duckReleaseTimer) {
      window.clearTimeout(this.duckReleaseTimer);
      this.duckReleaseTimer = 0;
    }
  }

  private startDuck(): void {
    this.clearDuckReleaseTimer();
    this.duckedThisGesture = true;
    this.touchJumpActive = false;
    this.jumpHeld = false;
    this.jumpLatch = false;
    this.duckHeld = true;
    if (!this.duckLatch) {
      this.duckPressed = true;
      this.duckLatch = true;
    }
  }

  private fireJump(): void {
    this.jumpHeld = true;
    this.touchJumpActive = true;
    if (!this.jumpLatch) {
      this.jumpPressed = true;
      this.jumpLatch = true;
    }
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

  private onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    this.clearDuckReleaseTimer();
    this.pointerId = e.pointerId;
    this.startY = e.clientY;
    this.startX = e.clientX;
    this.duckedThisGesture = false;
    this.touchJumpActive = false;
    this.target.setPointerCapture?.(e.pointerId);

    const rect = this.target.getBoundingClientRect();
    const relY = rect.height > 0 ? (e.clientY - rect.top) / rect.height : 0.5;
    // Lower ~40% of the playfield: tap/hold to duck (reliable on phones).
    if (relY >= 0.58) {
      this.zoneDuck = true;
      this.startDuck();
      return;
    }

    this.zoneDuck = false;
    this.duckHeld = false;
    this.duckLatch = false;
    // Upper area: jump immediately; swipe-down can still cancel into duck.
    this.fireJump();
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (this.pointerId !== e.pointerId) return;
    e.preventDefault();
    if (this.zoneDuck || this.duckedThisGesture) return;
    const dy = e.clientY - this.startY;
    const dx = e.clientX - this.startX;
    // Swipe down from jump zone → cancel jump into duck
    if (dy > 10 && dy >= Math.abs(dx) * 0.35) {
      this.startDuck();
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.pointerId !== e.pointerId) return;
    e.preventDefault();
    const dy = e.clientY - this.startY;
    const dx = e.clientX - this.startX;

    if (
      !this.zoneDuck &&
      !this.duckedThisGesture &&
      dy > 10 &&
      dy >= Math.abs(dx) * 0.35
    ) {
      this.startDuck();
    }

    if (this.duckedThisGesture || this.zoneDuck) {
      this.duckHeld = true;
      this.clearDuckReleaseTimer();
      this.duckReleaseTimer = window.setTimeout(() => {
        this.duckHeld = false;
        this.duckLatch = false;
        this.duckReleaseTimer = 0;
      }, 380);
    } else if (this.touchJumpActive) {
      this.jumpHeld = false;
      this.jumpLatch = false;
      this.touchJumpActive = false;
    }

    this.zoneDuck = false;
    this.pointerId = null;
    this.duckedThisGesture = false;
    try {
      this.target.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  };
}
