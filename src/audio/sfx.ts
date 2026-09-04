/** Procedural SFX via Web Audio — no asset files, works in share/singlefile builds. */

type SfxId = 'jump' | 'hit' | 'score' | 'shield' | 'ui';

const MUTE_KEY = 'dina-run-mute-v1';

let ctx: AudioContext | null = null;
let muted = false;

try {
  muted = localStorage.getItem(MUTE_KEY) === '1';
} catch {
  muted = false;
}

function getCtx(): AudioContext | null {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

/** Call from any user gesture so mobile browsers allow playback. */
export function unlockAudio(): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    /* ignore */
  }
  if (!muted) unlockAudio();
}

export function toggleMute(): boolean {
  setMuted(!muted);
  return muted;
}

function envGain(
  c: AudioContext,
  t0: number,
  peak: number,
  attack: number,
  release: number,
): GainNode {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + release);
  return g;
}

function playJump(c: AudioContext): void {
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(380, t0);
  osc.frequency.exponentialRampToValueAtTime(620, t0 + 0.08);
  const g = envGain(c, t0, 0.08, 0.008, 0.1);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + 0.12);
}

function playHit(c: AudioContext): void {
  const t0 = c.currentTime;
  const dur = 0.28;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * (1 - t) * (1 - t);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, t0);
  filter.frequency.exponentialRampToValueAtTime(180, t0 + dur);
  const g = envGain(c, t0, 0.22, 0.005, 0.25);
  src.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  src.start(t0);

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, t0);
  osc.frequency.exponentialRampToValueAtTime(55, t0 + 0.2);
  const og = envGain(c, t0, 0.1, 0.005, 0.2);
  osc.connect(og);
  og.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + 0.22);
}

function playScore(c: AudioContext): void {
  const t0 = c.currentTime;
  const beep = (freq: number, when: number) => {
    const osc = c.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, when);
    const g = envGain(c, when, 0.06, 0.005, 0.08);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(when);
    osc.stop(when + 0.1);
  };
  beep(660, t0);
  beep(880, t0 + 0.09);
}

function playShield(c: AudioContext): void {
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, t0);
  osc.frequency.exponentialRampToValueAtTime(240, t0 + 0.16);
  const g = envGain(c, t0, 0.12, 0.005, 0.16);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + 0.18);
}

function playUi(c: AudioContext): void {
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, t0);
  const g = envGain(c, t0, 0.05, 0.004, 0.05);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + 0.06);
}

export function playSfx(id: SfxId): void {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  try {
    switch (id) {
      case 'jump':
        playJump(c);
        break;
      case 'hit':
        playHit(c);
        break;
      case 'score':
        playScore(c);
        break;
      case 'shield':
        playShield(c);
        break;
      case 'ui':
        playUi(c);
        break;
    }
  } catch {
    /* autoplay / closed context */
  }
}
