import test from 'node:test';
import assert from 'node:assert/strict';

import { createAccessibilitySettings } from '../src/systems/accessibility.mjs';

function createDocumentStub() {
  const styles = new Map();
  return {
    documentElement: {
      style: {
        setProperty(name, value) {
          styles.set(name, value);
        },
        getPropertyValue(name) {
          return styles.get(name);
        },
      },
    },
  };
}

function createStorageStub() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

function installMatchMedia(initialMatches = {}) {
  const registry = new Map();

  function ensureEntry(query) {
    if (registry.has(query)) {
      return registry.get(query);
    }
    const listeners = new Set();
    const entry = {
      matches: Boolean(initialMatches[query]),
      listeners,
    };
    const api = {
      media: query,
      get matches() {
        return entry.matches;
      },
      addEventListener(type, listener) {
        if (type === 'change' && typeof listener === 'function') {
          listeners.add(listener);
        }
      },
      removeEventListener(type, listener) {
        if (type === 'change' && typeof listener === 'function') {
          listeners.delete(listener);
        }
      },
      addListener(listener) {
        if (typeof listener === 'function') {
          listeners.add(listener);
        }
      },
      removeListener(listener) {
        if (typeof listener === 'function') {
          listeners.delete(listener);
        }
      },
    };
    registry.set(query, { entry, api });
    return registry.get(query);
  }

  function dispatch(query, value) {
    const record = ensureEntry(query);
    record.entry.matches = Boolean(value);
    record.entry.listeners.forEach((listener) => {
      try {
        listener({ matches: record.entry.matches, media: query });
      } catch (error) {
        // Ignore listener failures during tests.
      }
    });
  }

  const stub = (query) => ensureEntry(query).api;
  stub.set = dispatch;
  return stub;
}

test('follows system contrast preference by default', (t) => {
  const previousDocument = globalThis.document;
  const previousMatchMedia = globalThis.matchMedia;
  const storage = createStorageStub();
  const doc = createDocumentStub();
  globalThis.document = doc;
  const matchMediaStub = installMatchMedia({ '(forced-colors: active)': true });
  globalThis.matchMedia = matchMediaStub;

  let settings;
  t.after(() => {
    settings?.dispose?.();
    globalThis.document = previousDocument;
    globalThis.matchMedia = previousMatchMedia;
  });

  settings = createAccessibilitySettings({ storage });

  const state = settings.getState();
  assert.equal(state.highContrast, true);
  assert.equal(state.followSystemContrast, true);

  matchMediaStub.set('(forced-colors: active)', false);

  const updated = settings.getState();
  assert.equal(updated.highContrast, false);
  assert.equal(updated.followSystemContrast, true);
});

test('manual contrast override and reset to system preference', (t) => {
  const previousDocument = globalThis.document;
  const previousMatchMedia = globalThis.matchMedia;
  const storage = createStorageStub();
  const doc = createDocumentStub();
  globalThis.document = doc;
  const matchMediaStub = installMatchMedia({ '(forced-colors: active)': true });
  globalThis.matchMedia = matchMediaStub;

  let settings;
  t.after(() => {
    settings?.dispose?.();
    globalThis.document = previousDocument;
    globalThis.matchMedia = previousMatchMedia;
  });

  settings = createAccessibilitySettings({ storage });
  settings.setHighContrast(false);

  let state = settings.getState();
  assert.equal(state.highContrast, false);
  assert.equal(state.followSystemContrast, false);

  matchMediaStub.set('(forced-colors: active)', false);
  state = settings.getState();
  assert.equal(state.highContrast, false, 'system changes do not apply while manual override active');

  settings.resetHighContrastToSystem();
  state = settings.getState();
  assert.equal(state.highContrast, false);
  assert.equal(state.followSystemContrast, true);

  matchMediaStub.set('(forced-colors: active)', true);
  state = settings.getState();
  assert.equal(state.highContrast, true, 'system updates apply after reset');
});

test('haptics preference persists', (t) => {
  const previousDocument = globalThis.document;
  const storage = createStorageStub();
  const doc = createDocumentStub();
  globalThis.document = doc;
  let settings;

  t.after(() => {
    settings?.dispose?.();
    globalThis.document = previousDocument;
  });

  settings = createAccessibilitySettings({ storage });
  assert.equal(settings.isHapticsEnabled(), true);

  settings.setHapticsEnabled(false);
  assert.equal(settings.isHapticsEnabled(), false);

  const stored = JSON.parse(storage.getItem('tiny-helpdesk-hero/accessibility'));
  assert.equal(stored.hapticsEnabled, false);
});
