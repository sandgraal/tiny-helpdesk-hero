/**
 * Wires DOM controls to accessibility settings.
 */

import { subscribe as settingsSubscribe, setLowPower, getSettings } from '../game/settings.mjs';

export function initAccessibilityPanel(accessibility) {
  if (!accessibility) {
    return;
  }

  const doc = globalThis.document;
  if (!doc) {
    return;
  }

  const panel = doc.querySelector('[data-accessibility-panel]');
  if (!panel) {
    return;
  }

  const fontScaleSelect = panel.querySelector('[data-accessibility-font-scale]');
  const dyslexiaCheckbox = panel.querySelector('[data-accessibility-dyslexia]');
  const contrastCheckbox = panel.querySelector('[data-accessibility-contrast]');
  let lowPowerToggle = panel.querySelector('[data-low-power-toggle]');

  if (!lowPowerToggle) {
    lowPowerToggle = doc.createElement('label');
    lowPowerToggle.dataset.lowPowerToggle = 'true';
    lowPowerToggle.style.display = 'flex';
    lowPowerToggle.style.flexDirection = 'row';
    lowPowerToggle.style.alignItems = 'center';
    lowPowerToggle.style.gap = '6px';
    lowPowerToggle.style.fontWeight = '600';
    lowPowerToggle.textContent = 'Low Power';

    const toggle = doc.createElement('input');
    toggle.type = 'checkbox';
    toggle.dataset.lowPowerToggleInput = 'true';
    toggle.style.accentColor = '#FFD166';
    lowPowerToggle.appendChild(toggle);
    panel.appendChild(lowPowerToggle);
  }

  const lowPowerInput = lowPowerToggle.querySelector('[data-low-power-toggle-input]')
    ?? lowPowerToggle.querySelector('input[type="checkbox"]');

  function ensureIcon(label, { src, glyph, alt } = {}) {
    if (!label) {
      return;
    }
    let icon = label.querySelector('[data-accessibility-icon]');
    if (!icon) {
      icon = doc.createElement('span');
      icon.dataset.accessibilityIcon = 'true';
      icon.setAttribute('aria-hidden', 'true');
      icon.style.display = 'inline-flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.marginRight = '6px';
      icon.style.width = '20px';
      icon.style.height = '20px';
      label.style.display = 'flex';
      label.style.flexDirection = 'row';
      label.style.alignItems = 'center';
      label.insertBefore(icon, label.firstChild);
    }
    icon.textContent = '';
    icon.innerHTML = '';
    if (src) {
      const image = doc.createElement('img');
      image.src = src;
      image.alt = alt ?? '';
      image.style.width = '20px';
      image.style.height = '20px';
      icon.appendChild(image);
    } else if (glyph) {
      icon.textContent = glyph;
    }
  }

  function applyState(state) {
    if (fontScaleSelect) {
      const scaleOption = Array.from(fontScaleSelect.options).find(
        (option) => Number(option.value) === Number(state.fontScale),
      );
      if (scaleOption) {
        fontScaleSelect.value = scaleOption.value;
      }
    }
    if (dyslexiaCheckbox) {
      dyslexiaCheckbox.checked = Boolean(state.dyslexiaFriendly);
    }
    if (contrastCheckbox) {
      contrastCheckbox.checked = Boolean(state.highContrast);
    }
    if (lowPowerInput) {
      lowPowerInput.checked = Boolean(getSettings().lowPower);
    }
  }

  ensureIcon(fontScaleSelect?.parentElement, { src: 'assets/icons/icon-text-scale.svg', alt: '' });
  ensureIcon(dyslexiaCheckbox?.parentElement, { glyph: '📘' });
  ensureIcon(contrastCheckbox?.parentElement, { glyph: '🔆' });
  ensureIcon(lowPowerToggle, { glyph: '💡' });

  const initialState = accessibility.getState?.() ?? {};
  applyState(initialState);

  fontScaleSelect?.addEventListener('change', (event) => {
    accessibility.setFontScale?.(event.target.value);
  });

  dyslexiaCheckbox?.addEventListener('change', (event) => {
    accessibility.setDyslexiaFriendly?.(event.target.checked);
  });

  contrastCheckbox?.addEventListener('change', (event) => {
    accessibility.setHighContrast?.(event.target.checked);
  });

  const handleLowPowerChange = (event) => {
    setLowPower(event.target.checked);
  };
  lowPowerInput?.addEventListener('change', handleLowPowerChange);

  accessibility.subscribe?.((state) => {
    applyState(state);
  });

  const unsubscribeLowPower = settingsSubscribe((state) => {
    if (lowPowerInput) {
      lowPowerInput.checked = Boolean(state.lowPower);
    }
  });

  return () => {
    unsubscribeLowPower();
    lowPowerInput?.removeEventListener('change', handleLowPowerChange);
  };
}
