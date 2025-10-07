/**
 * Accessibility settings manager.
 * Handles text scaling, font toggle, and high-contrast mode with persistence.
 */

const STORAGE_KEY = 'tiny-helpdesk-hero/accessibility';

const defaultState = {
  fontScale: 1,
  dyslexiaFriendly: false,
  highContrast: false,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeFontScale(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return defaultState.fontScale;
  }
  return clamp(Number.parseFloat(numeric.toFixed(2)), 0.75, 1.75);
}

function loadState(storage) {
  try {
    if (!storage) {
      return { ...defaultState };
    }
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaultState };
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      fontScale: sanitizeFontScale(parsed.fontScale ?? defaultState.fontScale),
      dyslexiaFriendly: Boolean(parsed.dyslexiaFriendly),
      highContrast: Boolean(parsed.highContrast),
    };
  } catch (error) {
    console.warn('[Accessibility] Failed to load settings', error);
    return { ...defaultState };
  }
}

function persistState(storage, state) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[Accessibility] Failed to persist settings', error);
  }
}

function applyDocumentTheme(state) {
  const root = globalThis.document?.documentElement;
  if (!root) {
    return;
  }
  const fontFamily = state.dyslexiaFriendly
    ? "'Atkinson Hyperlegible', 'OpenDyslexic', 'Segoe UI', sans-serif"
    : "'Segoe UI', sans-serif";
  root.style.setProperty('--thh-font-family', fontFamily);
  root.style.setProperty('--thh-font-scale', String(state.fontScale));
  root.style.setProperty('--thh-bg-color', state.highContrast ? '#000000' : '#071629');
  root.style.setProperty('--thh-text-color', state.highContrast ? '#FFFFFF' : '#FFFFFF');
  root.style.setProperty('--thh-panel-bg', state.highContrast ? 'rgba(0, 0, 0, 0.9)' : 'rgba(7, 22, 41, 0.85)');
  root.style.setProperty('--thh-panel-border', state.highContrast ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.16)');
}

export function createAccessibilitySettings({ storage = globalThis.localStorage } = {}) {
  let state = loadState(storage);
  const listeners = new Set();

  function notify() {
    applyDocumentTheme(state);
    listeners.forEach((listener) => {
      try {
        listener(getState());
      } catch (error) {
        console.warn('[Accessibility] Listener failed', error);
      }
    });
  }

  function update(partial) {
    state = {
      ...state,
      ...partial,
    };
    persistState(storage, state);
    notify();
  }

  function setFontScale(nextScale) {
    update({ fontScale: sanitizeFontScale(nextScale) });
  }

  function setDyslexiaFriendly(flag) {
    update({ dyslexiaFriendly: Boolean(flag) });
  }

  function setHighContrast(flag) {
    update({ highContrast: Boolean(flag) });
  }

  function getState() {
    return { ...state };
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      return () => {};
    }
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  // initialize document styles
  applyDocumentTheme(state);

  return {
    setFontScale,
    setDyslexiaFriendly,
    setHighContrast,
    getState,
    subscribe,
  };
}
