import test from 'node:test';
import assert from 'node:assert/strict';

import { createGameLifecycle } from '../src/game/main.mjs';
import { placeholderCalls } from '../src/content/calls.mjs';

function withPatchedGlobals(patches, fn) {
  const originals = {};
  for (const [key, value] of Object.entries(patches)) {
    originals[key] = key in globalThis ? globalThis[key] : undefined;
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
      if (value === undefined) {
        delete globalThis[key];
      } else {
        globalThis[key] = value;
      }
    }
  }
}

test('game lifecycle integrates systems and audio cues', { concurrency: false }, () => {
  const audioEvents = [];
  const loadingNode = {
    removed: false,
    remove() {
      this.removed = true;
    },
  };

  class FakeSound {
    constructor(params) {
      this.params = params;
    }

    play(position, volume, pitch, _unused, loop) {
      const event = {
        position,
        volume,
        pitch,
        loop,
        instance: this,
        stopped: false,
      };
      audioEvents.push(event);
      return {
        playing: loop,
        setVolume(value) {
          event.volume = value;
        },
        stop() {
          event.stopped = true;
        },
      };
    }
  }

  withPatchedGlobals({
    mainCanvasSize: { x: 800, y: 600 },
    vec2: (x, y) => ({ x, y }),
    overlayContext: {
      save() {},
      restore() {},
      fillRect() {},
      translate() {},
      rotate() {},
      strokeText() {},
      fillText() {},
    },
    document: {
      querySelector(selector) {
        return selector === '.loading-state' ? loadingNode : null;
      },
      getElementById() { return null; },
    },
    setShowSplashScreen: () => {},
    mouseWasPressed: () => false,
    mousePosScreen: { x: 400, y: 260 },
    timeDelta: 1 / 60,
    Sound: FakeSound,
  }, () => {
    const lifecycle = createGameLifecycle();
    const originalRandom = Math.random;
    Math.random = () => 0;
    try {
      lifecycle.init();
      assert.ok(loadingNode.removed, 'Loading indicator should be removed on init.');
      const holdLoop = audioEvents.find((event) => event.loop === true);
      assert.ok(holdLoop, 'Hold loop should start during init.');
      assert.ok(holdLoop.volume >= 0.15 && holdLoop.volume <= 0.4, 'Hold loop volume initialized within expected range.');

      const initialEvents = audioEvents.length;
      globalThis.mouseWasPressed = () => true;
      for (let i = 0; i < placeholderCalls.length; i += 1) {
        lifecycle.update();
      }
      assert.ok(audioEvents.length > initialEvents, 'Selecting options should trigger additional audio cues.');

      assert.ok(holdLoop.stopped, 'Hold loop should stop when shift completes.');

      globalThis.mouseWasPressed = () => false;
      lifecycle.render();
    } finally {
      Math.random = originalRandom;
    }
  });
});

