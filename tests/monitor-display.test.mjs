import test from 'node:test';
import assert from 'node:assert/strict';

import { createMonitorDisplay } from '../src/game/monitor-display.js';

function withPatchedGlobals(patches, fn) {
  const sentinel = Symbol('missing');
  const originals = {};
  for (const [key, value] of Object.entries(patches)) {
    originals[key] = Object.prototype.hasOwnProperty.call(globalThis, key)
      ? globalThis[key]
      : sentinel;
    if (value === undefined) {
      delete globalThis[key];
    } else {
      globalThis[key] = value;
    }
  }
  try {
    return fn();
  } finally {
    for (const [key, value] of Object.entries(originals)) {
      if (value === sentinel) {
        delete globalThis[key];
      } else {
        globalThis[key] = value;
      }
    }
  }
}

test('createMonitorDisplay returns noop helpers when canvas unsupported', () => {
  const monitor = withPatchedGlobals({
    OffscreenCanvas: undefined,
    document: undefined,
  }, () => createMonitorDisplay({ width: 320, height: 240 }));

  assert.equal(monitor.getContext(), null);
  assert.equal(monitor.getCanvas(), null);
  assert.deepEqual(monitor.getSize(), { width: 320, height: 240, devicePixelRatio: 1 });
  assert.doesNotThrow(() => monitor.clear());
  assert.doesNotThrow(() => monitor.drawTo(null));
});

test('createMonitorDisplay manages scaling and drawTo', () => {
  const fakeCtx = {
    commands: [],
    scale(x, y) {
      this.commands.push(['scale', x, y]);
    },
    clearRect(x, y, w, h) {
      this.commands.push(['clear', x, y, w, h]);
    },
    fillStyle: '#000000',
    fillRect(x, y, w, h) {
      this.commands.push(['fill', x, y, w, h]);
    },
    setTransform() {},
    resetTransform() {},
  };

  const canvas = {
    width: 0,
    height: 0,
    getContext() {
      return fakeCtx;
    },
  };

  const monitor = withPatchedGlobals({
    OffscreenCanvas: undefined,
    devicePixelRatio: 2,
    document: {
      createElement() {
        return canvas;
      },
    },
  }, () => createMonitorDisplay({ width: 100, height: 50, devicePixelRatio: 2 }));

  assert.equal(canvas.width, 200);
  assert.equal(canvas.height, 100);
  monitor.clear('#000000');
  assert.deepEqual(fakeCtx.commands.at(-1), ['fill', 0, 0, 100, 50]);

  const target = {
    calls: [],
    drawImage(...args) {
      this.calls.push(args);
    },
  };
  monitor.drawTo(target, { dx: 10, dy: 20, dWidth: 100, dHeight: 50 });
  assert.equal(target.calls.length, 1);
  assert.equal(target.calls[0][1], 10);

  monitor.resize(160, 90);
  assert.equal(canvas.width, 320);
  assert.equal(canvas.height, 180);
  const size = monitor.getSize();
  assert.equal(size.width, 160);
  assert.equal(size.height, 90);
});
