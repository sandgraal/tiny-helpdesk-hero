/**
 * Accessibility settings manager.
 * Handles text scaling, font toggle, high-contrast mode (with system detection),
 * haptics preference, and persistence.
 */

const STORAGE_KEY = 'tiny-helpdesk-hero/accessibility';
const CONTRAST_MEDIA_QUERIES = [
  '(forced-colors: active)',
  '(prefers-contrast: more)',
  '(prefers-contrast: high)',
];

const defaultState = {
  fontScale: 1,
  dyslexiaFriendly: false,
  highContrast: false,
  followSystemContrast: true,
  hapticsEnabled: true,
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

function readSystemHighContrastPreference() {
  if (typeof globalThis.matchMedia !== 'function') {
    return false;
  }
  try {
    return CONTRAST_MEDIA_QUERIES.some((query) => {
      const media = globalThis.matchMedia(query);
      return Boolean(media?.matches);
    });
  } catch (error) {
    console.warn('[Accessibility] Failed to evaluate system contrast preference', error);
    return false;
  }
}

function attachContrastListeners(callback) {
  if (typeof callback !== 'function' || typeof globalThis.matchMedia !== 'function') {
    return () => {};
  }
  const removers = [];
  CONTRAST_MEDIA_QUERIES.forEach((query) => {
    try {
      const media = globalThis.matchMedia(query);
      if (!media) {
        return;
      }
      const handler = () => {
        callback(readSystemHighContrastPreference());
      };
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handler);
        removers.push(() => media.removeEventListener('change', handler));
      } else if (typeof media.addListener === 'function') {
        media.addListener(handler);
        removers.push(() => media.removeListener(handler));
      }
    } catch (error) {
      console.warn('[Accessibility] Failed to observe contrast media query', error);
    }
  });
  return () => {
    removers.forEach((remove) => {
      try {
        remove();
      } catch (error) {
        console.warn('[Accessibility] Failed to detach contrast listener', error);
      }
    });
  };
}

function loadState(storage, systemHighContrast) {
  try {
    if (!storage) {
      return {
        ...defaultState,
        highContrast: Boolean(systemHighContrast),
      };
    }
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        ...defaultState,
        highContrast: Boolean(systemHighContrast),
      };
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      fontScale: sanitizeFontScale(parsed.fontScale ?? defaultState.fontScale),
      dyslexiaFriendly: Boolean(parsed.dyslexiaFriendly),
      highContrast: parsed.highContrast !== undefined
        ? Boolean(parsed.highContrast)
        : Boolean(systemHighContrast),
      followSystemContrast: parsed.followSystemContrast !== undefined
        ? Boolean(parsed.followSystemContrast)
        : false,
      hapticsEnabled: parsed.hapticsEnabled !== undefined
        ? Boolean(parsed.hapticsEnabled)
        : defaultState.hapticsEnabled,
    };
  } catch (error) {
    console.warn('[Accessibility] Failed to load settings', error);
    return {
      ...defaultState,
      highContrast: Boolean(systemHighContrast),
    };
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
  root.style.setProperty('--thh-text-color', '#FFFFFF');
  root.style.setProperty('--thh-panel-bg', state.highContrast ? 'rgba(0, 0, 0, 0.9)' : 'rgba(7, 22, 41, 0.85)');
  root.style.setProperty('--thh-panel-border', state.highContrast ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.16)');
}

export function createAccessibilitySettings({ storage = globalThis.localStorage } = {}) {
  let systemHighContrast = readSystemHighContrastPreference();
  let state = loadState(storage, systemHighContrast);
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

  function applySystemContrast(nextValue) {
    systemHighContrast = Boolean(nextValue);
    if (!state.followSystemContrast) {
      return;
    }
    if (state.highContrast === systemHighContrast) {
      return;
    }
    state = {
      ...state,
      highContrast: systemHighContrast,
    };
    persistState(storage, state);
    notify();
  }

  const detachContrastListeners = attachContrastListeners(applySystemContrast);

  function setFontScale(nextScale) {
    update({ fontScale: sanitizeFontScale(nextScale) });
  }

  function setDyslexiaFriendly(flag) {
    update({ dyslexiaFriendly: Boolean(flag) });
  }

  function setHighContrast(flag) {
    update({
      highContrast: Boolean(flag),
      followSystemContrast: false,
    });
  }

  function resetHighContrastToSystem() {
    state = {
      ...state,
      followSystemContrast: true,
      highContrast: Boolean(systemHighContrast),
    };
    persistState(storage, state);
    notify();
  }

  function setHapticsEnabled(flag) {
    update({ hapticsEnabled: Boolean(flag) });
  }

  function getState() {
    return { ...state };
  }

  function isHapticsEnabled() {
    return Boolean(state.hapticsEnabled);
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      return () => {};
    }
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function dispose() {
    detachContrastListeners();
    listeners.clear();
  }

  // initialize document styles
  applyDocumentTheme(state);

  return {
    setFontScale,
    setDyslexiaFriendly,
    setHighContrast,
    resetHighContrastToSystem,
    setHapticsEnabled,
    isHapticsEnabled,
    getState,
    subscribe,
    dispose,
  };
}

export default {
  createAccessibilitySettings,
};
