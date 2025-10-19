import test from 'node:test';
import assert from 'node:assert/strict';

import { createUISystem } from '../src/systems/ui.mjs';

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

test('keyboard navigation keeps achievements timer capped at 0.75s', () => {
  return withPatchedGlobals({
    mainCanvasSize: { x: 360, y: 640 },
    vec2: (x = 0, y = 0) => ({ x, y }),
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
      getElementById() {
        return null;
      },
      querySelector() {
        return null;
      },
    },
  }, () => {
    const ui = createUISystem();
    const call = {
      id: 'call-1',
      options: [
        { id: 'a', text: 'A', correct: true },
        { id: 'b', text: 'B', correct: false },
      ],
    };

    ui.update(0.016, null, call);
    ui.update(0.25, null, call);

    const state = ui.getAchievementPanelState();
    assert.equal(state.achievementVisible, true, 'Panel stays visible while navigating with keyboard.');
    assert.equal(state.achievementTimer, 0.75, 'Keyboard activity clamps timer to 0.75 seconds.');
  });
});

test('achievements auto-hide shortly after keyboard focus clears', () => {
  return withPatchedGlobals({
    mainCanvasSize: { x: 360, y: 640 },
    vec2: (x = 0, y = 0) => ({ x, y }),
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
      getElementById() {
        return null;
      },
      querySelector() {
        return null;
      },
    },
  }, () => {
    const ui = createUISystem();
    const call = {
      id: 'call-1',
      options: [
        { id: 'a', text: 'A', correct: true },
        { id: 'b', text: 'B', correct: false },
      ],
    };

    ui.update(0.016, null, call);
    ui.update(0.25, null, call);

    // Clear keyboard focus by removing options from the call state.
    ui.update(0.25, null, { id: 'call-2', options: [] });
    ui.update(0.6, null, { id: 'call-2', options: [] });

    const state = ui.getAchievementPanelState();
    assert.equal(state.achievementVisible, false, 'Panel hides once keyboard focus is cleared.');
    assert.equal(state.achievementTimer, 0, 'Timer expires after 0.75 seconds without focus.');
  });
});
