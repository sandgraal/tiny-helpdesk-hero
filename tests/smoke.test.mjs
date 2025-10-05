/**
 * Smoke tests for early systems.
 */

import assert from 'node:assert/strict';
import { createConversationSystem } from '../src/systems/conversation.js';
import { placeholderCalls } from '../src/content/calls.js';

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

conversation.reset();
const resetCall = conversation.getCurrentCall();
assert.ok(resetCall, 'Call should exist after reset.');
const resetState = conversation.getState();
assert.equal(resetState.currentIndex, 0, 'Reset should return to the first call.');
assert.equal(resetState.empathyScore, 0, 'Reset should clear empathy score.');

console.log('Smoke tests passed.');
