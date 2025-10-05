/**
 * Smoke tests for early systems.
 */

import assert from 'node:assert/strict';
import { createConversationSystem } from '../src/systems/conversation.js';
import { placeholderCalls } from '../src/content/calls.js';

const conversation = createConversationSystem({ calls: placeholderCalls });

assert.equal(conversation.getCallCount(), placeholderCalls.length, 'Conversation should load placeholder calls.');

const firstCall = conversation.getCurrentCall();
assert.ok(firstCall && firstCall.options.length > 0, 'First call should have options.');

const { empathyScore } = conversation.getState();
assert.equal(empathyScore, 0, 'Initial empathy score should be zero.');

const result = conversation.chooseOption(0);
assert.ok(result.advanced, 'Selecting an option should advance the conversation.');
assert.ok(typeof result.correct === 'boolean', 'Result correctness should be boolean.');

assert.equal(conversation.getState().currentIndex, 1, 'Conversation should move to the next call.');

console.log('Smoke tests passed.');
