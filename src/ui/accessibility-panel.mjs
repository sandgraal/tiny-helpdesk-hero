/**
 * Wires DOM controls to accessibility settings.
 */

import {
  subscribe as settingsSubscribe,
  setLowPower,
  setPostProcessing,
  getSettings,
} from '../game/settings.mjs';
import { imageManifest } from '../game/asset-manifest.mjs';

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
  let postProcessingToggle = panel.querySelector('[data-post-processing-toggle]');
  let hapticsToggle = panel.querySelector('[data-haptics-toggle]');
  let contrastSystemButton = panel.querySelector('[data-contrast-follow]');

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

  if (!postProcessingToggle) {
    postProcessingToggle = doc.createElement('label');
    postProcessingToggle.dataset.postProcessingToggle = 'true';
    postProcessingToggle.style.display = 'flex';
    postProcessingToggle.style.flexDirection = 'row';
    postProcessingToggle.style.alignItems = 'center';
    postProcessingToggle.style.gap = '6px';
    postProcessingToggle.style.fontWeight = '600';
    postProcessingToggle.textContent = 'Monitor filter';

    const toggle = doc.createElement('input');
    toggle.type = 'checkbox';
    toggle.dataset.postProcessingToggleInput = 'true';
    toggle.style.accentColor = '#6EE7FF';
    toggle.checked = true;
    postProcessingToggle.appendChild(toggle);
    panel.appendChild(postProcessingToggle);
  }

  const postProcessingInput = postProcessingToggle.querySelector('[data-post-processing-toggle-input]')
    ?? postProcessingToggle.querySelector('input[type="checkbox"]');

  if (!hapticsToggle) {
    hapticsToggle = doc.createElement('label');
    hapticsToggle.dataset.hapticsToggle = 'true';
    hapticsToggle.style.display = 'flex';
    hapticsToggle.style.flexDirection = 'row';
    hapticsToggle.style.alignItems = 'center';
    hapticsToggle.style.gap = '6px';
    hapticsToggle.style.fontWeight = '600';
    hapticsToggle.textContent = 'Haptics';

    const toggle = doc.createElement('input');
    toggle.type = 'checkbox';
    toggle.dataset.hapticsToggleInput = 'true';
    toggle.style.accentColor = '#FF9F1C';
    toggle.checked = true;
    hapticsToggle.appendChild(toggle);
    panel.appendChild(hapticsToggle);
  }

  const hapticsInput = hapticsToggle.querySelector('[data-haptics-toggle-input]')
    ?? hapticsToggle.querySelector('input[type="checkbox"]');

  if (!contrastSystemButton) {
    contrastSystemButton = doc.createElement('button');
    contrastSystemButton.type = 'button';
    contrastSystemButton.dataset.contrastFollow = 'true';
    contrastSystemButton.textContent = 'Use system contrast';
    contrastSystemButton.className = 'accessibility-panel__action';
    panel.appendChild(contrastSystemButton);
  }

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
    const settingsState = typeof getSettings === 'function' ? getSettings() : {};
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
      contrastCheckbox.title = state.followSystemContrast
        ? 'Following system contrast preference'
        : 'Manual contrast override';
    }
    if (lowPowerInput) {
      lowPowerInput.checked = Boolean(settingsState?.lowPower);
    }
    if (postProcessingInput) {
      postProcessingInput.checked = Boolean(settingsState?.postProcessing);
    }
    if (hapticsInput) {
      hapticsInput.checked = state.hapticsEnabled !== false;
    }
    if (contrastSystemButton) {
      const following = Boolean(state.followSystemContrast);
      contrastSystemButton.disabled = following;
      contrastSystemButton.title = following
        ? 'Following system contrast preference'
        : 'Return to system contrast';
    }
  }

  ensureIcon(fontScaleSelect?.parentElement, { src: imageManifest.iconTextScale, alt: '' });
  ensureIcon(dyslexiaCheckbox?.parentElement, { glyph: '📘' });
  ensureIcon(contrastCheckbox?.parentElement, { glyph: '🔆' });
  ensureIcon(lowPowerToggle, { glyph: '💡' });
  ensureIcon(postProcessingToggle, { glyph: '🖥️' });
  ensureIcon(hapticsToggle, { glyph: '📳' });

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

  const handleHapticsChange = (event) => {
    accessibility.setHapticsEnabled?.(event.target.checked);
  };
  hapticsInput?.addEventListener('change', handleHapticsChange);

  const handleContrastSystemClick = (event) => {
    event.preventDefault();
    accessibility.resetHighContrastToSystem?.();
  };
  contrastSystemButton?.addEventListener('click', handleContrastSystemClick);

  const handleLowPowerChange = (event) => {
    setLowPower(event.target.checked);
  };
  lowPowerInput?.addEventListener('change', handleLowPowerChange);

  const handlePostProcessingChange = (event) => {
    setPostProcessing(event.target.checked);
  };
  postProcessingInput?.addEventListener('change', handlePostProcessingChange);

  const unsubscribeAccessibility = accessibility.subscribe?.((state) => {
    applyState(state);
  }) ?? (() => {});

  const unsubscribeLowPower = settingsSubscribe((state) => {
    if (lowPowerInput) {
      lowPowerInput.checked = Boolean(state.lowPower);
    }
    if (postProcessingInput) {
      postProcessingInput.checked = Boolean(state.postProcessing);
    }
  });

  return () => {
    unsubscribeLowPower();
    unsubscribeAccessibility();
    lowPowerInput?.removeEventListener('change', handleLowPowerChange);
    postProcessingInput?.removeEventListener('change', handlePostProcessingChange);
    hapticsInput?.removeEventListener('change', handleHapticsChange);
    contrastSystemButton?.removeEventListener('click', handleContrastSystemClick);
  };
}
