export function showToast(message: string, ms = 2800): void {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

export function showOverlay(card: HTMLElement): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.append(card);
  document.body.append(overlay);
  return overlay;
}
