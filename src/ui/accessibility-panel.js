/**
 * Wires DOM controls to accessibility settings.
 */

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

  accessibility.subscribe?.((state) => {
    applyState(state);
  });
}

