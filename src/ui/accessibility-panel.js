/**
 * Wires DOM controls to accessibility settings.
 */

import { subscribe as settingsSubscribe, setLowPower, getSettings } from '../game/settings.js';

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

  lowPowerInput?.addEventListener('change', (event) => {
    setLowPower(event.target.checked);
  });

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
    lowPowerInput?.removeEventListener('change', setLowPower);
  };
}

