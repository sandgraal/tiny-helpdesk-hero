import test from 'node:test';
import assert from 'node:assert/strict';

import { initSafeAreaWatcher } from '../src/ui/safe-area.mjs';

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

function createViewportStub({ offsetTop = 0, height = 0 } = {}) {
  const listeners = new Map();
  const removals = [];
  return {
    offsetTop,
    height,
    listeners,
    removals,
    addEventListener(type, handler) {
      if (typeof handler === 'function') {
        listeners.set(type, handler);
      }
    },
    removeEventListener(type, handler) {
      removals.push({ type, handler });
      if (listeners.get(type) === handler) {
        listeners.delete(type);
      }
    },
    dispatch(type) {
      const handler = listeners.get(type);
      if (typeof handler === 'function') {
        handler();
      }
    },
  };
}

test('safe-area watcher syncs CSS variables with visual viewport', (t) => {
  const previousDocument = globalThis.document;
  const previousViewport = globalThis.visualViewport;
  const previousInnerHeight = globalThis.innerHeight;
  const previousAddEvent = globalThis.addEventListener;
  const previousRemoveEvent = globalThis.removeEventListener;

  const doc = createDocumentStub();
  const viewport = createViewportStub({ offsetTop: 12.3, height: 580 });
  const orientation = new Map();
  const orientationRemovals = [];

  globalThis.document = doc;
  globalThis.visualViewport = viewport;
  globalThis.innerHeight = 640;
  globalThis.addEventListener = (type, handler) => {
    if (typeof handler === 'function') {
      orientation.set(type, handler);
    }
  };
  globalThis.removeEventListener = (type, handler) => {
    orientationRemovals.push({ type, handler });
    if (orientation.get(type) === handler) {
      orientation.delete(type);
    }
  };
  let cleanupCalled = false;
  const cleanup = initSafeAreaWatcher(doc);

  t.after(() => {
    if (!cleanupCalled) {
      cleanup?.();
    }
    globalThis.document = previousDocument;
    globalThis.visualViewport = previousViewport;
    globalThis.innerHeight = previousInnerHeight;
    globalThis.addEventListener = previousAddEvent;
    globalThis.removeEventListener = previousRemoveEvent;
  });

  assert.equal(
    doc.documentElement.style.getPropertyValue('--thh-viewport-offset-top'),
    '12px',
    'top inset rounds to nearest pixel',
  );
  assert.equal(
    doc.documentElement.style.getPropertyValue('--thh-viewport-offset-bottom'),
    '48px',
    'bottom inset computed from innerHeight',
  );

  viewport.offsetTop = 10.4;
  viewport.height = 600;
  globalThis.innerHeight = 660;
  viewport.dispatch('resize');

  assert.equal(
    doc.documentElement.style.getPropertyValue('--thh-viewport-offset-top'),
    '10px',
    'resize updates top inset',
  );
  assert.equal(
    doc.documentElement.style.getPropertyValue('--thh-viewport-offset-bottom'),
    '50px',
    'resize updates bottom inset',
  );

  const orientationHandler = orientation.get('orientationchange');
  assert.equal(typeof orientationHandler, 'function', 'orientation listener registered');
  orientationHandler?.();

  assert.equal(
    doc.documentElement.style.getPropertyValue('--thh-viewport-offset-top'),
    '10px',
    'orientation handler uses same updater',
  );

  cleanup();
  cleanupCalled = true;

  assert.deepEqual(
    viewport.removals.map(({ type }) => type).sort(),
    ['resize', 'scroll'],
    'cleanup detaches viewport listeners',
  );
  assert.ok(
    orientationRemovals.some((entry) => entry.type === 'orientationchange' && entry.handler === orientationHandler),
    'cleanup detaches orientation listener',
  );
});

test('safe-area watcher is a no-op without visual viewport support', (t) => {
  const previousDocument = globalThis.document;
  const previousViewport = globalThis.visualViewport;

  const doc = createDocumentStub();
  globalThis.document = doc;
  globalThis.visualViewport = null;

  t.after(() => {
    globalThis.document = previousDocument;
    globalThis.visualViewport = previousViewport;
  });

  const cleanup = initSafeAreaWatcher(doc);
  assert.equal(typeof cleanup, 'function', 'returns cleanup function even when inactive');
  cleanup();

  assert.equal(
    doc.documentElement.style.getPropertyValue('--thh-viewport-offset-top'),
    undefined,
    'no CSS variables set',
  );
});
