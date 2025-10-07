import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCall, generateCallDeck, personas, problems } from '../src/content/calls.js';
import { createConversationSystem } from '../src/systems/conversation.js';
import { createHoverState, createPulseState } from '../src/systems/animation/tween.js';

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

test('generateCallDeck keeps calls when twist data missing', () => {
  const seeds = [
    { persona: personas[0], problem: problems[0], twist: null },
  ];
  const deck = generateCallDeck({ seeds });
  assert.equal(deck.length, 1, 'Missing twist should not drop the call.');
  assert.equal(deck[0].twist, null, 'Twist remains null when not provided.');
});

test('generateCallDeck drops invalid seed assignments', () => {
  const seeds = [
    { persona: personas[0], problem: null },
    null,
    { persona: null, problem: problems[0] },
  ];
  const deck = generateCallDeck({ seeds });
  assert.equal(deck.length, 0, 'Invalid seed entries should be filtered out.');
});

test('buildCall tolerates twists with missing modifiers', () => {
  const bareTwist = { id: 'bare-twist' };
  const call = buildCall({ persona: personas[0], problem: problems[0], twist: bareTwist });
  assert.equal(call.twist.id, bareTwist.id, 'Twist id is preserved.');
  assert.notEqual(call.twist, bareTwist, 'Twist object is cloned before use.');
  assert.equal(call.empathyWin, problems[0].empathyWin, 'Empathy win falls back to problem text.');
  assert.ok(!call.prompt.includes('undefined'), 'Prompt stays readable without twist text.');
});

test('buildCall strips invalid empathy boost values', () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => {
    warnings.push(args.join(' '));
  };
  try {
    const emptyBoostTwist = { id: 'empty-boost', empathyBoost: '   ' };
    const callWithEmpty = buildCall({ persona: personas[0], problem: problems[0], twist: emptyBoostTwist });
    assert.equal(callWithEmpty.empathyWin, problems[0].empathyWin, 'Empty boost falls back to problem text.');
    assert.ok(!('empathyBoost' in callWithEmpty.twist), 'Empty empathy boost is removed from twist.');

    const nonStringTwist = { id: 'number-boost', empathyBoost: 123 }; // invalid type
    const callWithNumber = buildCall({ persona: personas[1], problem: problems[1], twist: nonStringTwist });
    assert.equal(callWithNumber.empathyWin, problems[1].empathyWin, 'Non-string boost falls back to problem text.');
    assert.ok(!('empathyBoost' in callWithNumber.twist), 'Non-string empathy boost is removed from twist.');
  } finally {
    console.warn = originalWarn;
  }

  assert.equal(warnings.length, 2, 'Invalid boosts emit warnings.');
  assert.ok(warnings.every((entry) => entry.includes('empathyBoost')), 'Warnings mention empathy boost issues.');
});

test('buildCall trims empathy boost text', () => {
  const twist = { id: 'trim-boost', empathyBoost: '  extra empathy  ' };
  const call = buildCall({ persona: personas[2], problem: problems[2], twist });
  assert.equal(call.twist.empathyBoost, 'extra empathy', 'Stored boost text is trimmed.');
  assert.ok(call.empathyWin.endsWith('extra empathy'), 'Empathy win string includes trimmed boost.');
});

test('buildCall returns null when persona or problem missing', () => {
  const personaOnly = buildCall({ persona: personas[0], problem: null });
  assert.equal(personaOnly, null);
  const problemOnly = buildCall({ persona: null, problem: problems[0] });
  assert.equal(problemOnly, null);
});

test('conversation system handles invalid option index without scoring', { concurrency: false }, () => {
  const baseCall = buildCall({ persona: personas[0], problem: problems[0] });
  const call = { ...baseCall, options: baseCall.options.map((option) => ({ ...option, correct: option.correct })) };
  const system = createConversationSystem({ calls: [call] });
  const result = system.chooseOption(999);
  assert.equal(result.correct, false, 'Out-of-range selection should not be correct.');
  const state = system.getState();
  assert.equal(state.empathyScore, 0, 'Empathy should remain unchanged.');
  assert.equal(state.isComplete, true, 'Single invalid selection advances to completion.');
});

test('conversation system tolerates calls with no options', { concurrency: false }, () => {
  const call = {
    id: 'malformed-call',
    persona: personas[0],
    problem: problems[0],
    options: [],
    prompt: 'Broken call definition.',
  };
  const system = createConversationSystem({ calls: [call] });
  const result = system.chooseOption(0);
  assert.equal(result.correct, false, 'Missing option should resolve as incorrect.');
  const state = system.getState();
  assert.equal(state.empathyScore, 0, 'Empathy remains zero for malformed calls.');
  assert.equal(state.isComplete, true, 'Engine advances even when options missing.');
});

test('animation easing progresses and decays when reduced motion disabled', () => {
  withPatchedGlobals({
    matchMedia: () => ({ matches: false }),
  }, () => {
    const pulse = createPulseState({ duration: 0.5 });
    pulse.trigger();
    pulse.update(0.1);
    const immediateValue = pulse.getValue();
    assert.ok(immediateValue > 0 && immediateValue < 1, 'Pulse ramps up between 0 and 1.');
    pulse.update(0.5);
    assert.equal(pulse.getValue(), 0, 'Pulse decays to zero after duration.');

    const hover = createHoverState({ duration: 0.3 });
    hover.setActive(true);
    hover.update(0.1);
    const rising = hover.getValue();
    assert.ok(rising > 0 && rising < 1, 'Hover animates smoothly when active.');
    hover.setActive(false);
    hover.update(0.1);
    assert.ok(hover.getValue() < rising, 'Hover value decreases after deactivation.');
  });
});
