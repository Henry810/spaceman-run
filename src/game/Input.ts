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
  private startTime = 0;
  private duckedThisGesture = false;
  /** True until we know this gesture is a swipe-duck or a jump. */
  private gestureOpen = false;
  private touchJumpActive = false;
  private jumpArmTimer = 0;
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
    this.clearJumpArmTimer();
    this.clearDuckReleaseTimer();
  }

  endFrame(): void {
    this.jumpPressed = false;
    this.duckPressed = false;
  }

  private blockScroll = (e: TouchEvent): void => {
    e.preventDefault();
  };

  private clearJumpArmTimer(): void {
    if (this.jumpArmTimer) {
      window.clearTimeout(this.jumpArmTimer);
      this.jumpArmTimer = 0;
    }
  }

  private clearDuckReleaseTimer(): void {
    if (this.duckReleaseTimer) {
      window.clearTimeout(this.duckReleaseTimer);
      this.duckReleaseTimer = 0;
    }
  }

  private fireJump(hold: boolean): void {
    this.gestureOpen = false;
    this.clearJumpArmTimer();
    this.jumpHeld = true;
    this.touchJumpActive = hold;
    if (!this.jumpLatch) {
      this.jumpPressed = true;
      this.jumpLatch = true;
    }
    if (!hold) {
      window.setTimeout(() => {
        this.jumpHeld = false;
        this.jumpLatch = false;
        this.touchJumpActive = false;
      }, 0);
    }
  }

  private startDuck(): void {
    this.clearJumpArmTimer();
    this.clearDuckReleaseTimer();
    this.gestureOpen = false;
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
    this.clearJumpArmTimer();
    this.clearDuckReleaseTimer();
    this.pointerId = e.pointerId;
    this.startY = e.clientY;
    this.startX = e.clientX;
    this.startTime = performance.now();
    this.duckedThisGesture = false;
    this.gestureOpen = true;
    this.touchJumpActive = false;
    this.duckHeld = false;
    this.duckLatch = false;
    this.target.setPointerCapture?.(e.pointerId);

    // Arm jump shortly after press if this isn't a swipe-duck.
    this.jumpArmTimer = window.setTimeout(() => {
      this.jumpArmTimer = 0;
      if (this.gestureOpen && !this.duckedThisGesture) {
        this.fireJump(true);
      }
    }, 45);
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (this.pointerId !== e.pointerId) return;
    e.preventDefault();
    const dy = e.clientY - this.startY;
    const dx = e.clientX - this.startX;
    if (!this.duckedThisGesture && dy > 12 && dy >= Math.abs(dx) * 0.4) {
      this.startDuck();
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.pointerId !== e.pointerId) return;
    e.preventDefault();
    const dy = e.clientY - this.startY;
    const dx = e.clientX - this.startX;
    const elapsed = performance.now() - this.startTime;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (!this.duckedThisGesture && dy > 12 && dy >= absDx * 0.4) {
      this.startDuck();
    }

    if (this.duckedThisGesture) {
      this.duckHeld = true;
      this.clearDuckReleaseTimer();
      this.duckReleaseTimer = window.setTimeout(() => {
        this.duckHeld = false;
        this.duckLatch = false;
        this.duckReleaseTimer = 0;
      }, 340);
    } else if (this.touchJumpActive) {
      this.jumpHeld = false;
      this.jumpLatch = false;
      this.touchJumpActive = false;
    } else if (
      this.gestureOpen &&
      absDx < 20 &&
      absDy < 20 &&
      elapsed < 360
    ) {
      // Quick tap released before jump-arm timer — still jump.
      this.fireJump(false);
    }

    this.clearJumpArmTimer();
    this.gestureOpen = false;
    this.pointerId = null;
    this.duckedThisGesture = false;
    try {
      this.target.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  };
}
