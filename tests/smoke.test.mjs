import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCall, generateCallDeck, placeholderCalls, personas, problems, twists, defaultCallSeeds } from '../src/content/calls.mjs';
import { createConversationSystem } from '../src/systems/conversation.mjs';
import { createUISystem } from '../src/systems/ui.mjs';
import { createHoverState, createPulseState } from '../src/systems/animation/tween.mjs';

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

test('generateCallDeck produces complete, distinct calls', () => {
  const deck = generateCallDeck();
  assert.equal(deck.length, defaultCallSeeds.length, 'Deck should include each seeded scenario.');
  const ids = new Set(deck.map((call) => call.id));
  assert.equal(ids.size, deck.length, 'Call ids should be unique.');
  deck.forEach((call) => {
    assert.ok(call.persona?.id, 'Each call has a persona.');
    assert.ok(call.problem?.id, 'Each call has a problem.');
    assert.equal(call.options.length, 3, 'Each call exposes three options.');
    assert.ok(call.options.some((option) => option.correct), 'At least one option is correct.');
  });
});

test('buildCall composes empathy outcomes with twists', () => {
  const persona = personas[0];
  const problem = problems[0];
  const twist = twists.find((entry) => entry.id === 'micro-coffee');
  const call = buildCall({ persona, problem, twist });
  assert.ok(call.prompt.includes(persona.opener), 'Prompt includes persona opener.');
  assert.ok(call.prompt.includes(problem.summary), 'Prompt includes problem summary.');
  assert.ok(call.empathyWin.includes(problem.empathyWin), 'Empathy win carries problem guidance.');
  assert.ok(call.empathyWin.includes(twist.empathyBoost), 'Empathy win layers twist boost.');
});

test('conversation system tracks empathy and reset flow', { concurrency: false }, () => {
  const randomStub = () => 0; // deterministic option order
  const system = createConversationSystem({ calls: placeholderCalls, random: randomStub });
  assert.equal(system.getCallCount(), placeholderCalls.length, 'Call count matches placeholder deck.');
  let state = system.getState();
  assert.equal(state.currentIndex, 0);
  assert.equal(state.empathyScore, 0);

  const firstCall = system.getCurrentCall();
  const correctIndex = firstCall.options.findIndex((option) => option.correct);
  const firstResult = system.chooseOption(correctIndex);
  assert.ok(firstResult.correct, 'Choosing the correct option increments empathy.');
  state = system.getState();
  assert.equal(state.empathyScore, 1, 'Empathy increments on correct selection.');
  assert.equal(state.currentIndex, 1, 'Index advances after selection.');

  for (let i = 1; i < system.getCallCount(); i += 1) {
    system.chooseOption(1);
  }
  state = system.getState();
  assert.equal(state.isComplete, true, 'System reports completion at end of deck.');

  system.reset();
  state = system.getState();
  assert.equal(state.currentIndex, 0, 'Reset returns to start of deck.');
  assert.equal(state.empathyScore, 0, 'Reset clears empathy score.');
});

test('UI system maps pointer coordinates to option indices', { concurrency: false }, () => {
  return withPatchedGlobals({
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
      getElementById() { return null; },
      querySelector() { return null; },
    },
  }, () => {
    const ui = createUISystem();
    const pointerFirst = { x: 400, y: 250 };
    assert.equal(ui.getOptionIndexAtPoint(pointerFirst), 0, 'Pointer near first option maps to 0.');
    const pointerSecond = { x: 400, y: 305 };
    assert.equal(ui.getOptionIndexAtPoint(pointerSecond), 1, 'Pointer near second option maps to 1.');
    const pointerOutside = { x: 100, y: 100 };
    assert.equal(ui.getOptionIndexAtPoint(pointerOutside), -1, 'Pointer outside returns -1.');

    const call = {
      options: [
        { id: 'a', text: 'A', correct: true },
        { id: 'b', text: 'B', correct: false },
        { id: 'c', text: 'C', correct: false },
      ],
    };

    ui.update(0.16, pointerFirst, call);
    ui.render({
      hasCalls: true,
      isComplete: false,
      empathyScore: 0,
      callCount: call.options.length,
      currentIndex: 0,
      call,
      lastSelection: null,
    });

    ui.update(0.16, null, { options: [] });
    ui.render({ hasCalls: false });
  });
});

test('animation helpers respect reduced motion preferences', { concurrency: false }, () => {
  return withPatchedGlobals({
    matchMedia: (query) => ({ matches: query === '(prefers-reduced-motion: reduce)' }),
  }, () => {
    const hover = createHoverState({ duration: 0.5 });
    hover.setActive(true);
    hover.update(0.1);
    assert.equal(hover.getValue(), 1, 'Hover snaps active when motion reduced.');
    hover.setActive(false);
    hover.update(0.1);
    assert.equal(hover.getValue(), 0, 'Hover snaps inactive when motion reduced.');

    const pulse = createPulseState({ duration: 0.5 });
    pulse.trigger();
    pulse.update(0.1);
    assert.equal(pulse.getValue(), 0, 'Pulse stays inactive when motion reduced.');
  });
});
