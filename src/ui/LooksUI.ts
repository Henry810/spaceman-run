import { ACHIEVEMENTS, getOverlayForAchievement } from '../meta/achievements';
import { renderDinoPreview } from '../art/skinLayers';
import { OVERLAY_REMAPS } from '../art/sprites';
import type { SaveData } from '../meta/save';
import { writeSave } from '../meta/save';

const OVERLAY_LABEL: Record<string, string> = {
  gold_base: '金色',
  night_base: '夜蓝',
  iron_base: '铁灰',
  ember_base: '熔岩橙',
  helix_base: '螺旋粉',
  trail_base: '迁徙绿',
  scar_base: '伤痕褐',
};

export function renderLooks(
  root: HTMLElement,
  save: SaveData,
  onBack: () => void,
  onChanged: (save: SaveData) => void,
): void {
  root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen screen-looks';

  const header = document.createElement('div');
  header.className = 'panel-header';
  header.innerHTML = `<h2>图鉴与成就</h2>`;
  const back = document.createElement('button');
  back.className = 'btn ghost';
  back.textContent = '返回';
  back.addEventListener('click', onBack);
  header.append(back);

  const grid = document.createElement('div');
  grid.className = 'looks-grid';

  const previewBox = document.createElement('div');
  previewBox.className = 'preview-box';
  const stage = document.createElement('div');
  stage.className = 'preview-stage';
  const canvas = document.createElement('canvas');
  stage.append(canvas);
  const label = document.createElement('div');
  label.className = 'hint';
  label.textContent = save.equippedOverlay
    ? `装备：${OVERLAY_LABEL[save.equippedOverlay] ?? save.equippedOverlay}`
    : '默认翠绿';
  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn ghost';
  clearBtn.textContent = '卸下限定底层';
  clearBtn.addEventListener('click', () => {
    save.equippedOverlay = null;
    writeSave(save);
    onChanged(save);
    renderLooks(root, save, onBack, onChanged);
  });
  previewBox.append(stage, label, clearBtn);

  const refreshPreview = () => {
    renderDinoPreview(canvas, {
      unlockedNodes: save.unlockedNodes,
      equippedOverlay: save.equippedOverlay,
    });
    canvas.style.width = '78%';
    canvas.style.height = 'auto';
  };
  refreshPreview();

  const list = document.createElement('div');
  list.className = 'ach-list';

  for (const a of ACHIEVEMENTS) {
    const unlocked = save.unlockedAchievements.includes(a.id);
    const overlay = a.overlayId;
    const equipped = save.equippedOverlay === overlay;
    const remap = OVERLAY_REMAPS[overlay];

    const card = document.createElement('div');
    card.className = 'ach-card';
    if (!unlocked) card.classList.add('locked');
    if (equipped) card.classList.add('equipped');

    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    if (remap?.g && remap?.G && remap?.s) {
      swatch.style.background = `linear-gradient(135deg, ${remap.s} 0%, ${remap.g} 45%, ${remap.G} 100%)`;
    }

    const text = document.createElement('div');
    text.className = 'ach-text';
    text.innerHTML = `<h3>${a.name}</h3><p>${a.description}${unlocked ? ` · ${OVERLAY_LABEL[overlay] ?? ''}` : ' · 未解锁'}</p>`;

    const action = document.createElement('button');
    action.className = 'btn ach-action';
    if (!unlocked) {
      action.textContent = '锁定';
      action.disabled = true;
    } else if (equipped) {
      action.textContent = '装备中';
      action.classList.add('primary');
      action.addEventListener('click', () => {
        save.equippedOverlay = null;
        writeSave(save);
        onChanged(save);
        renderLooks(root, save, onBack, onChanged);
      });
    } else {
      action.textContent = '切换';
      action.classList.add('primary');
      action.addEventListener('click', () => {
        const id = getOverlayForAchievement(a.id);
        if (!id) return;
        save.equippedOverlay = id;
        writeSave(save);
        onChanged(save);
        renderLooks(root, save, onBack, onChanged);
      });
    }

    card.append(swatch, text, action);
    list.append(card);
  }

  grid.append(previewBox, list);
  screen.append(header, grid);
  root.append(screen);
}
