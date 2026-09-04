import { renderDinoPreview } from '../art/skinLayers';
import { formatMultiplier } from '../meta/currency';
import type { SaveData } from '../meta/save';
import { isMuted, playSfx, toggleMute, unlockAudio } from '../audio/sfx';
import { showOverlay } from './Hud';

let menuSpaceHandler: ((e: KeyboardEvent) => void) | null = null;

export function disposeMenuKeys(): void {
  if (!menuSpaceHandler) return;
  window.removeEventListener('keydown', menuSpaceHandler);
  menuSpaceHandler = null;
}

export function renderMenu(
  root: HTMLElement,
  save: SaveData,
  handlers: {
    onPlay: () => void;
    onTree: () => void;
    onLooks: () => void;
    onReset: () => void;
  },
): void {
  root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen screen-menu';

  const brand = document.createElement('h1');
  brand.className = 'brand';
  brand.textContent = '太空人快跑';

  const tag = document.createElement('p');
  tag.className = 'tagline';
  tag.textContent = '798 爬宠概念馆联动小游戏 · 带一条龙去探索';

  const preview = document.createElement('canvas');
  preview.className = 'hero-dino';
  let frame = 0;
  const paint = () => {
    renderDinoPreview(
      preview,
      {
        unlockedNodes: save.unlockedNodes,
        equippedOverlay: save.equippedOverlay,
      },
      frame % 2 === 0 ? 'runA' : 'runB',
    );
  };
  paint();
  const anim = window.setInterval(() => {
    frame += 1;
    paint();
  }, 180);
  preview.dataset.animId = String(anim);
  preview.style.width = 'min(176px, 42vw)';
  preview.style.height = 'auto';

  const stats = document.createElement('div');
  stats.className = 'stats-bar';
  stats.innerHTML = `
    <div class="stat"><strong>DNA</strong><span>${save.dna}</span></div>
    <div class="stat"><strong>HI</strong><span>${save.highScore}</span></div>
    <div class="stat"><strong>倍率</strong><span>${formatMultiplier(save.unlockedNodes)}</span></div>
  `;

  const actions = document.createElement('div');
  actions.className = 'menu-actions';

  const play = btn('出发探索', 'primary', () => {
    unlockAudio();
    playSfx('ui');
    handlers.onPlay();
  });
  const tree = btn('进化舱', '', () => {
    unlockAudio();
    playSfx('ui');
    handlers.onTree();
  });
  const looks = btn('图鉴与成就', '', () => {
    unlockAudio();
    playSfx('ui');
    handlers.onLooks();
  });
  const mute = btn(isMuted() ? '音效：关' : '音效：开', 'ghost', () => {
    unlockAudio();
    const nowMuted = toggleMute();
    mute.textContent = nowMuted ? '音效：关' : '音效：开';
    if (!nowMuted) playSfx('ui');
  });
  const reset = btn('重置游戏进度', 'ghost', () => confirmReset(handlers.onReset));
  actions.append(play, tree, looks, mute, reset);

  const credit = document.createElement('p');
  credit.className = 'brand-credit';
  credit.textContent = '太空人爬宠俱乐部出品';

  screen.append(brand, tag, preview, stats, actions, credit);
  root.append(screen);

  disposeMenuKeys();
  menuSpaceHandler = (e: KeyboardEvent) => {
    if (e.code !== 'Space') return;
    if (e.repeat) return;
    if (document.querySelector('.modal-overlay')) return;
    e.preventDefault();
    unlockAudio();
    playSfx('ui');
    handlers.onPlay();
  };
  window.addEventListener('keydown', menuSpaceHandler);
}

function btn(label: string, cls: string, onClick: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = `btn ${cls}`.trim();
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

function confirmReset(onReset: () => void): void {
  const card = document.createElement('div');
  card.className = 'modal-card';
  card.innerHTML = `
    <h3>重置进度</h3>
    <p>将清空 DNA、进化舱、成就与最高分。此操作无法撤销。</p>
  `;
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  const cancel = document.createElement('button');
  cancel.className = 'btn ghost';
  cancel.textContent = '取消';
  const ok = document.createElement('button');
  ok.className = 'btn primary';
  ok.textContent = '确定重置';
  actions.append(cancel, ok);
  card.append(actions);

  const overlay = showOverlay(card);
  cancel.addEventListener('click', () => overlay.remove());
  ok.addEventListener('click', () => {
    overlay.remove();
    onReset();
  });
}
