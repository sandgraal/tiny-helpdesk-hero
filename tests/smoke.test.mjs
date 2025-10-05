/**
 * Smoke tests for early systems.
 */

import assert from 'node:assert/strict';
import { createConversationSystem } from '../src/systems/conversation.js';
import { createUISystem } from '../src/systems/ui.js';
import { placeholderCalls } from '../src/content/calls.js';
import { createPulseState } from '../src/systems/animation/tween.js';
import { createAudioSystem } from '../src/systems/audio.js';

const conversation = createConversationSystem({ calls: placeholderCalls });

assert.equal(conversation.getCallCount(), placeholderCalls.length, 'Conversation should load placeholder calls.');

const firstCall = conversation.getCurrentCall();
assert.ok(firstCall, 'First call should exist.');
assert.ok(firstCall.persona?.name, 'Persona should include a name.');
assert.ok(firstCall.options.length === 3, 'Each call should present three options.');
assert.ok(firstCall.options.some((option) => option.correct), 'At least one option must be correct.');

const { empathyScore } = conversation.getState();
assert.equal(empathyScore, 0, 'Initial empathy score should be zero.');

const result = conversation.chooseOption(0);
assert.ok(result.advanced, 'Selecting an option should advance the conversation.');
assert.ok(typeof result.correct === 'boolean', 'Result correctness should be boolean.');

assert.equal(conversation.getState().currentIndex, 1, 'Conversation should move to the next call.');

// Complete remaining calls to validate state transitions
const totalCalls = conversation.getCallCount();
for (let i = 1; i < totalCalls; i += 1) {
  conversation.chooseOption(0);
}
const finalState = conversation.getState();
assert.ok(finalState.isComplete, 'Conversation should report completion after final call.');

conversation.reset();
const resetCall = conversation.getCurrentCall();
assert.ok(resetCall, 'Call should exist after reset.');
const resetState = conversation.getState();
assert.equal(resetState.currentIndex, 0, 'Reset should return to the first call.');
assert.equal(resetState.empathyScore, 0, 'Reset should clear empathy score.');

// UI hit detection smoke test
globalThis.mainCanvasSize = { x: 800, y: 600 };
globalThis.drawRectScreen = () => {};
globalThis.drawTextScreen = () => {};
globalThis.vec2 = (x, y) => ({ x, y });

const ui = createUISystem();
const pointerFirst = { x: 400, y: 250 };
assert.equal(ui.getOptionIndexAtPoint(pointerFirst), 0, 'Pointer near first option should map to index 0.');
const pointerThird = { x: 400, y: 402 };
assert.equal(ui.getOptionIndexAtPoint(pointerThird), 2, 'Pointer near third option should map to index 2.');
const pointerOutside = { x: 120, y: 50 };
assert.equal(ui.getOptionIndexAtPoint(pointerOutside), -1, 'Pointer outside buttons should return -1.');

console.log('Smoke tests passed.');

// Animation utility smoke test
const pulse = createPulseState({ duration: 0.5 });
pulse.update(0.1);
assert.equal(pulse.getValue(), 0, 'Pulse should be zero before trigger.');
pulse.trigger();
pulse.update(0.1);
assert(pulse.getValue() > 0, 'Pulse value should increase after trigger.');
pulse.update(0.6);
assert(pulse.getValue() <= 0.01, 'Pulse value should decay over time.');

// Audio system persona motif smoke
const originalSound = globalThis.Sound;
delete globalThis.Sound; // ensure graceful no-op without LittleJS
const audioSystem = createAudioSystem();
audioSystem.playPersonaMotif('overwhelmed-designer');
audioSystem.playPersonaMotif('unknown-persona');
globalThis.Sound = originalSound;
