import test from 'node:test';
import assert from 'node:assert/strict';

import { createAchievementSystem } from '../src/systems/achievements.mjs';
import { achievementDefinitions } from '../src/content/achievements.mjs';

function createSystem() {
  return createAchievementSystem({ definitions: achievementDefinitions });
}

test('achievements unlock on shift completion milestones', () => {
  const system = createSystem();
  system.startShift({ callCount: 4 });
  // simulate three correct answers in a row
  for (let i = 0; i < 3; i += 1) {
    system.recordSelection({ correct: true, call: { twist: null } });
  }
  // final correct to secure perfect shift
  system.recordSelection({ correct: true, call: { twist: null } });
  const unlocks = system.completeShift({ empathyScore: 4, callCount: 4 });
  assert.ok(unlocks.includes('first-shift'));
  assert.ok(unlocks.includes('perfect-shift'));
  assert.ok(unlocks.includes('hot-streak'));

  const unlockedIds = system.getUnlockedIds();
  assert.ok(unlockedIds.has('first-shift'));
  assert.ok(unlockedIds.has('perfect-shift'));
  assert.ok(unlockedIds.has('hot-streak'));
});

test('meta and comeback achievements require specific conditions', () => {
  const system = createSystem();
  system.startShift({ callCount: 4 });
  system.recordSelection({ correct: false, call: { twist: { id: 'shrinking-moon' } } });
  system.recordSelection({ correct: true, call: { twist: { id: 'meta-humor' } } });
  system.recordSelection({ correct: true, call: { twist: null } });
  system.recordSelection({ correct: true, call: { twist: null } });
  const unlocks = system.completeShift({ empathyScore: 3, callCount: 4 });
  assert.ok(unlocks.includes('first-shift'));
  assert.ok(unlocks.includes('meta-moment'));
  assert.ok(unlocks.includes('comeback-kid'));
});

test('resilient rep unlocks after double misses with recovery', () => {
  const system = createSystem();
  system.startShift({ callCount: 4 });
  system.recordSelection({ correct: false, call: { twist: null } });
  system.recordSelection({ correct: false, call: { twist: null } });
  system.recordSelection({ correct: true, call: { twist: null } });
  system.recordSelection({ correct: true, call: { twist: null } });
  const unlocks = system.completeShift({ empathyScore: 2, callCount: 4 });
  assert.ok(unlocks.includes('first-shift'));
  assert.ok(unlocks.includes('resilient-rep'));
});

