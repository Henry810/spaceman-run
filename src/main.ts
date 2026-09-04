import '@fontsource/fusion-pixel-12px-proportional-sc/400.css';
import './styles.css';
import { loadSave, resetSave, type SaveData } from './meta/save';
import { ACHIEVEMENTS } from './meta/achievements';
import { renderMenu, disposeMenuKeys } from './ui/Menu';
import { renderTree } from './ui/TreeUI';
import { renderLooks } from './ui/LooksUI';
import { showToast } from './ui/Hud';
import { createGameCanvas } from './game/Renderer';
import { Game } from './game/Game';
import { unlockAudio } from './audio/sfx';

type Screen = 'menu' | 'play' | 'tree' | 'looks';

const appEl = document.querySelector<HTMLDivElement>('#app');
if (!appEl) {
  document.body.textContent = '页面结构异常：找不到 #app';
  throw new Error('missing #app');
}
const app: HTMLDivElement = appEl;

let save: SaveData = loadSave();
let currentGame: Game | null = null;

function setPlayLock(active: boolean): void {
  document.documentElement.classList.toggle('play-active', active);
  if (active) {
    const orient = screen.orientation as ScreenOrientation & {
      lock?: (o: string) => Promise<void>;
    };
    void orient.lock?.('landscape').catch(() => {
      /* browsers often require fullscreen; layout still adapts */
    });
  } else {
    const orient = screen.orientation as ScreenOrientation & {
      unlock?: () => void;
    };
    try {
      orient.unlock?.();
    } catch {
      /* ignore */
    }
  }
}

function go(screen: Screen): void {
  disposeMenuKeys();
  setPlayLock(false);
  if (currentGame) {
    currentGame.stop();
    currentGame = null;
  }
  // clear menu preview timers
  app.querySelectorAll('canvas.hero-dino').forEach((c) => {
    const id = (c as HTMLCanvasElement).dataset.animId;
    if (id) clearInterval(Number(id));
  });
  app.innerHTML = '';

  if (screen === 'menu') {
    renderMenu(app, save, {
      onPlay: () => go('play'),
      onTree: () => go('tree'),
      onLooks: () => go('looks'),
      onReset: () => {
        save = resetSave();
        showToast('进度已重置');
        go('menu');
      },
    });
    return;
  }

  if (screen === 'tree') {
    renderTree(
      app,
      save,
      () => go('menu'),
      (s) => {
        save = s;
      },
    );
    return;
  }

  if (screen === 'looks') {
    renderLooks(
      app,
      save,
      () => go('menu'),
      (s) => {
        save = s;
      },
    );
    return;
  }

  // play
  setPlayLock(true);
  const wrap = document.createElement('div');
  wrap.className = 'screen game-wrap';
  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `<h2>探索中</h2>`;
  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '返回舱门';
  back.addEventListener('click', () => go('menu'));
  header.append(back);

  const canvasHost = document.createElement('div');
  canvasHost.className = 'canvas-host';
  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent =
    '空格短按小跳、按住高跳 · ↓ 蹲 · 触屏上方点按跳跃、下方点按/下滑下蹲';

  wrap.append(header, canvasHost, hint);
  app.append(wrap);

  const { canvas, renderer } = createGameCanvas(canvasHost);
  const onResize = () => renderer.resize();
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  currentGame = new Game(renderer, save, (result) => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    save = result.save;
    if (result.newAchievements.length) {
      const names = result.newAchievements
        .map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name ?? id)
        .join('、');
      showToast(`成就解锁：${names}`);
    }
    go('menu');
  });
  currentGame.start();

  // keep reference so abandon works
  void canvas;
}

try {
  const unlockOnce = () => unlockAudio();
  window.addEventListener('pointerdown', unlockOnce, { once: true });
  window.addEventListener('keydown', unlockOnce, { once: true });
  go('menu');
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  app.innerHTML = `<p style="padding:24px;color:#f5f0d8;text-align:center;line-height:1.6">加载失败：${msg}<br/>请用 Chrome / Edge / Safari 打开，不要用微信内置预览。</p>`;
}
