import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clamp,
  lerp,
  inverseLerp,
  remap,
  smoothstep,
  randomFloat,
  randomInt,
  sample,
  weightedRandom,
  shuffle,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkScheme,
  observeMediaQueries,
} from '../src/util/index.mjs';

function createDeterministicRng(sequence) {
  let index = 0;
  return () => {
    const value = sequence[index % sequence.length];
    index += 1;
    return value;
  };
}

test('clamp bounds numbers and swaps reversed limits', () => {
  assert.equal(clamp(1.5, 0, 1), 1);
  assert.equal(clamp(-0.5, 0, 1), 0);
  assert.equal(clamp(0.5, 1, 0), 0.5);
  assert.equal(clamp(Number.NaN, 0, 2), 0);
  assert.equal(clamp(Number.POSITIVE_INFINITY, 0, 2), 2);
  assert.equal(clamp(Number.NEGATIVE_INFINITY, 0, 2), 0);
});

test('lerp and inverseLerp convert between ranges', () => {
  assert.equal(lerp(0, 10, 0.5), 5);
  assert.equal(inverseLerp(0, 10, 5), 0.5);
  assert.equal(inverseLerp(5, 5, 5), 0);
});

test('remap and smoothstep apply easing across ranges', () => {
  assert.equal(remap(5, 0, 10, 10, 20), 15);
  const eased = smoothstep(0, 1, 0.5);
  assert.ok(eased > 0.4 && eased < 0.6);
});

test('random helpers respect deterministic rng input', () => {
  const rng = createDeterministicRng([0.25, 0.75]);
  assert.equal(randomFloat(10, 20, rng), 12.5);
  assert.equal(randomFloat(10, 20, rng), 17.5);
  const rngInt = createDeterministicRng([0.1, 0.9]);
  assert.equal(randomInt(1, 3, rngInt), 1);
  assert.equal(randomInt(1, 3, rngInt), 3);
});

test('sample and shuffle produce expected outputs with seeded rng', () => {
  const rng = createDeterministicRng([0.9, 0.2, 0.7]);
  assert.equal(sample(['a', 'b', 'c'], rng), 'c');
  const shuffled = shuffle([1, 2, 3, 4], rng);
  assert.deepEqual(shuffled, [4, 2, 3, 1]);
});

test('weightedRandom picks items based on weights', () => {
  const rng = createDeterministicRng([0.05, 0.95]);
  const entries = [
    { value: 'low', weight: 1 },
    { value: 'mid', weight: 2 },
    { value: 'high', weight: 1 },
  ];
  assert.equal(weightedRandom(entries, rng), 'low');
  assert.equal(weightedRandom(entries, rng), 'high');
});

function createMatchMediaStub(map) {
  const records = new Map();
  return Object.assign((query) => {
    if (!records.has(query)) {
      const entry = {
        matches: Boolean(map.get(query)),
        listeners: [],
        addEventListener(event, handler) {
          if (event === 'change') {
            this.listeners.push(handler);
          }
        },
        removeEventListener(event, handler) {
          if (event === 'change') {
            this.listeners = this.listeners.filter((fn) => fn !== handler);
          }
        },
        addListener(handler) {
          this.listeners.push(handler);
        },
        removeListener(handler) {
          this.listeners = this.listeners.filter((fn) => fn !== handler);
        },
        trigger(matches = this.matches) {
          this.matches = matches;
          this.listeners.forEach((listener) => listener({ matches }));
        },
      };
      records.set(query, entry);
    }
    return records.get(query);
  }, { records });
}

test('prefersReducedMotion consults injected matchMedia', () => {
  const matchMedia = createMatchMediaStub(new Map([
    ['(prefers-reduced-motion: reduce)', true],
  ]));
  assert.equal(prefersReducedMotion({ matchMedia }), true);
  const matchMediaFalse = createMatchMediaStub(new Map([
    ['(prefers-reduced-motion: reduce)', false],
  ]));
  assert.equal(prefersReducedMotion({ matchMedia: matchMediaFalse }), false);
});

test('prefersHighContrast aggregates multiple queries', () => {
  const matchMedia = createMatchMediaStub(new Map([
    ['(forced-colors: active)', false],
    ['(prefers-contrast: more)', true],
  ]));
  assert.equal(prefersHighContrast({ matchMedia }), true);
  const matchMediaNone = createMatchMediaStub(new Map([
    ['(forced-colors: active)', false],
    ['(prefers-contrast: more)', false],
  ]));
  assert.equal(prefersHighContrast({ matchMedia: matchMediaNone }), false);
});

test('prefersDarkScheme returns null when unsupported', () => {
  assert.equal(prefersDarkScheme({ matchMedia: undefined }), null);
  const matchMedia = createMatchMediaStub(new Map([
    ['(prefers-color-scheme: dark)', true],
  ]));
  assert.equal(prefersDarkScheme({ matchMedia }), true);
});

test('observeMediaQueries wires listeners and cleanup', () => {
  const matchMedia = createMatchMediaStub(new Map([
    ['(prefers-contrast: more)', false],
  ]));
  let callCount = 0;
  const cleanup = observeMediaQueries('(prefers-contrast: more)', () => {
    callCount += 1;
  }, { matchMedia });
  const record = matchMedia.records.get('(prefers-contrast: more)');
  assert.ok(record);
  record.trigger(true);
  assert.equal(callCount, 1);
  cleanup();
  record.trigger(false);
  assert.equal(callCount, 1);
});
