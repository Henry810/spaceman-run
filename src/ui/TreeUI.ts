import {
  BRANCH_META,
  EVOLUTION_NODES,
  canUnlock,
  getNode,
  type BranchId,
} from '../meta/evolutionTree';
import type { SaveData } from '../meta/save';
import { writeSave } from '../meta/save';
import { showOverlay, showToast } from './Hud';

const BRANCHES: BranchId[] = ['agi', 'arm', 'per', 'gene', 'apex'];

export function renderTree(
  root: HTMLElement,
  save: SaveData,
  onBack: () => void,
  onChanged: (save: SaveData) => void,
): void {
  root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen screen-tree';

  const header = document.createElement('div');
  header.className = 'panel-header tree-header';
  header.innerHTML = `<h2>进化舱</h2>`;

  const toolbar = document.createElement('div');
  toolbar.className = 'tree-toolbar';
  const chip = document.createElement('div');
  chip.className = 'dna-chip dna-chip-lg';
  chip.textContent = `DNA ${save.dna}`;
  const watchAd = document.createElement('button');
  watchAd.className = 'btn tree-ad-btn';
  watchAd.textContent = '看广告 +200';
  watchAd.addEventListener('click', () => {
    watchAd.disabled = true;
    cheatAd.disabled = true;
    playFakeAd(5, 200, () => {
      save.dna += 200;
      writeSave(save);
      onChanged(save);
      renderTree(root, save, onBack, onChanged);
      showToast('+200 DNA');
    });
  });
  const cheatAd = document.createElement('button');
  cheatAd.className = 'btn tree-ad-btn tree-ad-cheat';
  cheatAd.textContent = '作弊广告 +20000';
  cheatAd.title = '观看 30 秒广告领取 20000 DNA';
  cheatAd.addEventListener('click', () => {
    watchAd.disabled = true;
    cheatAd.disabled = true;
    playFakeAd(30, 20000, () => {
      save.dna += 20000;
      writeSave(save);
      onChanged(save);
      renderTree(root, save, onBack, onChanged);
      showToast('+20000 DNA');
    });
  });
  toolbar.append(chip, watchAd, cheatAd);

  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '返回';
  back.addEventListener('click', onBack);
  header.append(toolbar, back);

  const layout = document.createElement('div');
  layout.className = 'tree-layout';

  const detail = document.createElement('div');
  detail.className = 'node-detail';
  detail.innerHTML = `<p>选择节点查看详情。同系需按顺序解锁。</p>`;

  for (const branch of BRANCHES) {
    const col = document.createElement('div');
    col.className = 'branch-col';
    const meta = BRANCH_META[branch];
    const title = document.createElement('h3');
    title.className = 'branch-title';
    title.style.color = meta.accent;
    title.textContent = meta.name;
    col.append(title);

    const list = document.createElement('div');
    list.className = 'node-list';

    const nodes = EVOLUTION_NODES.filter((n) => n.branch === branch).sort(
      (a, b) => a.order - b.order,
    );

    for (const node of nodes) {
      const owned = save.unlockedNodes.includes(node.id);
      const affordable = canUnlock(node.id, save.unlockedNodes, save.dna);
      const locked = !owned && !node.requires.every((r) => save.unlockedNodes.includes(r));

      const card = document.createElement('button');
      card.className = 'node-card';
      if (owned) card.classList.add('owned');
      else if (affordable) card.classList.add('affordable');
      else card.classList.add('locked');

      card.innerHTML = `
        <span class="name">${node.name}</span>
        <span class="cost">${owned ? '已解锁' : `${node.cost}`}</span>
      `;

      card.addEventListener('click', () => {
        detail.innerHTML = `
          <strong style="color:${meta.accent}">${node.name}</strong>
          <p>${node.description}</p>
          <p>费用：${node.cost} DNA ${owned ? '· 已拥有' : locked ? '· 需要前置' : ''}</p>
        `;

        if (!owned && affordable) {
          const buy = document.createElement('button');
          buy.className = 'btn primary';
          buy.textContent = '解锁';
          buy.addEventListener('click', () => {
            if (!canUnlock(node.id, save.unlockedNodes, save.dna)) return;
            save.dna -= node.cost;
            save.unlockedNodes.push(node.id);
            writeSave(save);
            onChanged(save);
            renderTree(root, save, onBack, onChanged);
          });
          detail.append(buy);
        }
      });

      list.append(card);
    }

    col.append(list);
    layout.append(col);
  }

  screen.append(header, layout, detail);
  root.append(screen);
}

export function tryUnlockNode(save: SaveData, nodeId: string): boolean {
  const node = getNode(nodeId);
  if (!node || !canUnlock(nodeId, save.unlockedNodes, save.dna)) return false;
  save.dna -= node.cost;
  save.unlockedNodes.push(nodeId);
  writeSave(save);
  return true;
}

function playFakeAd(
  seconds: number,
  reward: number,
  onDone: () => void,
): void {
  const card = document.createElement('div');
  card.className = 'modal-card';
  card.innerHTML = `
    <div class="ad-kicker">${reward >= 20000 ? '作弊广告占位' : '广告占位'}</div>
    <h3>太空人爬宠俱乐部</h3>
    <p>798 · 零距离邂逅爬行动物。冷血动物并不冷血——来馆里摸摸鳞片、听听科普。</p>
    <div class="ad-timer">${seconds}</div>
  `;
  const close = document.createElement('button');
  close.className = 'btn primary';
  close.disabled = true;
  close.textContent = `关闭 (${seconds})`;
  card.append(close);

  const overlay = showOverlay(card);
  const timerEl = card.querySelector('.ad-timer')!;
  let left = seconds;
  const tick = window.setInterval(() => {
    left -= 1;
    timerEl.textContent = String(Math.max(0, left));
    if (left > 0) {
      close.textContent = `关闭 (${left})`;
      return;
    }
    clearInterval(tick);
    close.disabled = false;
    close.textContent = `关闭并领取 ${reward} DNA`;
  }, 1000);

  close.addEventListener('click', () => {
    if (close.disabled) return;
    clearInterval(tick);
    overlay.remove();
    onDone();
  });
}
