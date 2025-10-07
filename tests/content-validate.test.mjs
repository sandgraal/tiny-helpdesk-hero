import test from 'node:test';
import assert from 'node:assert/strict';

import { personas, problems, twists, defaultCallSeeds } from '../src/content/calls.js';
import {
  assertContentValid,
  ContentValidationError,
  validatePersonas,
  validateProblems,
  validateTwists,
  validateSeeds,
} from '../src/content/validation.js';

function createDefaultSeeds() {
  return defaultCallSeeds.map((seed) => ({ ...seed }));
}

test('content dataset passes validation', () => {
  assert.doesNotThrow(() => assertContentValid({ personas, problems, twists, seeds: createDefaultSeeds() }));
});

test('validatePersonas surfaces duplicate ids', () => {
  const sample = [...personas, { ...personas[0] }];
  const issues = validatePersonas(sample, []);
  const duplicateIssue = issues.find((issue) => issue.path.endsWith('.id') && issue.message.includes('unique'));
  assert.ok(duplicateIssue, 'Duplicate persona id should be reported.');
});

test('validateProblems catches missing incorrect options', () => {
  const sample = [{ ...problems[0], incorrect: ['only-one'] }];
  const issues = validateProblems(sample, []);
  const missingOptions = issues.find((issue) => issue.path.endsWith('.incorrect') && issue.message.includes('at least two'));
  assert.ok(missingOptions, 'Problem with too few incorrect options should be flagged.');
});

test('validateTwists enforces non-empty empathy boost', () => {
  const sample = [{ ...twists[0], empathyBoost: '' }];
  const issues = validateTwists(sample, []);
  const badBoost = issues.find((issue) => issue.path.endsWith('.empathyBoost'));
  assert.ok(badBoost, 'Blank empathy boost should be reported.');
});

test('validateSeeds catches missing references', () => {
  const seeds = [
    { persona: { id: 'unknown-persona' }, problem: problems[0], twist: null },
    { persona: personas[0], problem: 'missing-problem', twist: twists[0] },
    { persona: personas[0], problem: problems[0], twist: 'ghost-twist' },
  ];
  const issues = validateSeeds(seeds, { personas, problems, twists }, []);
  assert.equal(issues.length, 3, 'Each unknown reference should produce an issue.');
  assert.ok(issues.some((issue) => issue.path.endsWith('.persona')));
  assert.ok(issues.some((issue) => issue.path.endsWith('.problem')));
  assert.ok(issues.some((issue) => issue.path.endsWith('.twist')));
});

test('validateSeeds allows string identifiers', () => {
  const seeds = createDefaultSeeds().map((seed) => ({
    persona: typeof seed.persona === 'string' ? seed.persona : seed.persona?.id,
    problem: typeof seed.problem === 'string' ? seed.problem : seed.problem?.id,
    twist: seed.twist === null || seed.twist === undefined
      ? null
      : (typeof seed.twist === 'string' ? seed.twist : seed.twist?.id),
  }));
  const issues = validateSeeds(seeds, { personas, problems, twists }, []);
  assert.equal(issues.length, 0, 'String-based seeds should validate.');
});

test('assertContentValid throws with aggregated issues', () => {
  const badPersona = [{ ...personas[0], id: '' }];
  let caught;
  try {
    assertContentValid({ personas: badPersona, problems, twists });
  } catch (error) {
    caught = error;
  }
  assert.ok(caught instanceof ContentValidationError, 'ContentValidationError should be thrown.');
  assert.ok(caught?.issues?.length > 0, 'Thrown error includes issue list.');
});
