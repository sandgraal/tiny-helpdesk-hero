/**
 * Renders a simple low-power toggle overlay using DOM elements.
 */

import { subscribe, getSettings, setLowPower } from '../game/settings.js';

export function initLowPowerToggle() {
  const doc = globalThis.document;
  if (!doc) {
    return () => {};
  }
  let container = doc.querySelector('[data-low-power-toggle]');
  if (!container) {
    container = doc.createElement('button');
    container.type = 'button';
    container.dataset.lowPowerToggle = 'true';
    container.setAttribute('aria-pressed', 'false');
    container.textContent = 'Low Power: Off';
    container.style.position = 'absolute';
    container.style.bottom = '16px';
    container.style.right = '16px';
    container.style.padding = '8px 12px';
    container.style.background = '#0D1E30';
    container.style.border = '1px solid rgba(255, 255, 255, 0.24)';
    container.style.borderRadius = '8px';
    container.style.color = '#FFFFFF';
    container.style.font = '14px "Segoe UI", sans-serif';
    doc.body?.appendChild(container);
  }

  function render(state) {
    const active = Boolean(state.lowPower);
    container.textContent = active ? 'Low Power: On' : 'Low Power: Off';
    container.setAttribute('aria-pressed', active ? 'true' : 'false');
  }

  const unsubscribe = subscribe(render);
  render(getSettings());

  const handler = () => {
    const next = !getSettings().lowPower;
    setLowPower(next);
  };
  container.addEventListener('click', handler);

  return () => {
    unsubscribe();
    container.removeEventListener('click', handler);
  };
}

export default initLowPowerToggle;
