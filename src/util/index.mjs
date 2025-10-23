/**
 * Shared utility helpers live here.
 * Provides math, randomization, and accessibility helpers used across systems.
 */

function normalizeNumber(value, fallback = 0) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return fallback;
  }
  if (numeric === Number.POSITIVE_INFINITY) {
    return Number.POSITIVE_INFINITY;
  }
  if (numeric === Number.NEGATIVE_INFINITY) {
    return Number.NEGATIVE_INFINITY;
  }
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function clamp(value, min = 0, max = 1) {
  const a = normalizeNumber(min, 0);
  const b = normalizeNumber(max, 1);
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  const numericValue = normalizeNumber(value, lower);
  if (numericValue === Number.POSITIVE_INFINITY) {
    return upper;
  }
  if (numericValue === Number.NEGATIVE_INFINITY) {
    return lower;
  }
  const clamped = Math.min(Math.max(numericValue, lower), upper);
  return Number.isNaN(clamped) ? lower : clamped;
}

export function lerp(start, end, t) {
  const amount = clamp(t, 0, 1);
  return start + (end - start) * amount;
}

export function inverseLerp(start, end, value) {
  const range = end - start;
  if (range === 0) {
    return 0;
  }
  return clamp((value - start) / range, 0, 1);
}

export function remap(value, inMin, inMax, outMin, outMax) {
  const t = inverseLerp(inMin, inMax, value);
  return lerp(outMin, outMax, t);
}

export function smoothstep(edge0, edge1, x) {
  const t = inverseLerp(edge0, edge1, x);
  return t * t * (3 - 2 * t);
}

function normalizedRandom(rng = Math.random) {
  if (typeof rng !== 'function') {
    return Math.random();
  }
  const sample = normalizeNumber(rng(), Math.random());
  if (!Number.isFinite(sample)) {
    return Math.random();
  }
  return clamp(sample, 0, 0.999999999999);
}

export function randomFloat(min = 0, max = 1, rng = Math.random) {
  const lower = normalizeNumber(min, 0);
  const upper = normalizeNumber(max, 1);
  const a = Math.min(lower, upper);
  const b = Math.max(lower, upper);
  const sample = normalizedRandom(rng);
  return a + (b - a) * sample;
}

export function randomInt(min = 0, max = 1, rng = Math.random) {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  if (!Number.isFinite(lower) || !Number.isFinite(upper)) {
    return 0;
  }
  if (upper <= lower) {
    return lower;
  }
  const sample = normalizedRandom(rng);
  return Math.floor(sample * (upper - lower + 1)) + lower;
}

export function sample(array, rng = Math.random) {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  const index = randomInt(0, array.length - 1, rng);
  return array[index];
}

export function weightedRandom(entries, rng = Math.random) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return null;
  }
  const normalized = entries
    .map((entry) => {
      if (!entry) {
        return null;
      }
      if (Array.isArray(entry)) {
        const [value, weight] = entry;
        return { value, weight: Number(weight) };
      }
      if (typeof entry === 'object') {
        const weight = Number(entry.weight);
        return { value: entry.value ?? entry.item ?? entry, weight };
      }
      return { value: entry, weight: 1 };
    })
    .filter((entry) => Number.isFinite(entry?.weight) && entry.weight > 0);

  if (!normalized.length) {
    return null;
  }

  const totalWeight = normalized.reduce((acc, entry) => acc + entry.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }

  const target = randomFloat(0, totalWeight, rng);
  let cumulative = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    cumulative += normalized[i].weight;
    if (target <= cumulative) {
      return normalized[i].value;
    }
  }
  return normalized[normalized.length - 1].value;
}

export function shuffle(array, rng = Math.random) {
  if (!Array.isArray(array)) {
    return [];
  }
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i, rng);
    if (j !== i) {
      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
  }
  return result;
}

function evaluateMediaQuery(query, matchMedia) {
  if (typeof matchMedia !== 'function' || !query) {
    return null;
  }
  try {
    const media = matchMedia(query);
    if (!media || typeof media.matches !== 'boolean') {
      return null;
    }
    return media.matches;
  } catch (error) {
    console.warn('[TinyHelpdeskHero][Util] Failed to evaluate media query', query, error);
    return null;
  }
}

export function prefersReducedMotion({ matchMedia = globalThis.matchMedia } = {}) {
  const result = evaluateMediaQuery('(prefers-reduced-motion: reduce)', matchMedia);
  if (result === null) {
    return null;
  }
  return result;
}

const DEFAULT_CONTRAST_QUERIES = [
  '(forced-colors: active)',
  '(prefers-contrast: more)',
  '(prefers-contrast: high)',
];

export function prefersHighContrast({
  matchMedia = globalThis.matchMedia,
  queries = DEFAULT_CONTRAST_QUERIES,
} = {}) {
  const list = Array.isArray(queries) && queries.length ? queries : DEFAULT_CONTRAST_QUERIES;
  let evaluated = false;
  for (let i = 0; i < list.length; i += 1) {
    const result = evaluateMediaQuery(list[i], matchMedia);
    if (result === true) {
      return true;
    }
    if (result !== null) {
      evaluated = true;
    }
  }
  return evaluated ? false : null;
}

export function prefersDarkScheme({ matchMedia = globalThis.matchMedia } = {}) {
  const result = evaluateMediaQuery('(prefers-color-scheme: dark)', matchMedia);
  if (result === null) {
    return null;
  }
  return result;
}

export function observeMediaQueries(queries, handler, { matchMedia = globalThis.matchMedia } = {}) {
  if (typeof handler !== 'function') {
    return () => {};
  }
  const list = Array.isArray(queries) ? queries : [queries];
  if (!list.length || typeof matchMedia !== 'function') {
    return () => {};
  }
  const removers = [];
  list.forEach((query) => {
    if (!query) {
      return;
    }
    try {
      const media = matchMedia(query);
      if (!media) {
        return;
      }
      const listener = () => {
        handler({ query, matches: Boolean(media.matches) });
      };
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', listener);
        removers.push(() => media.removeEventListener('change', listener));
      } else if (typeof media.addListener === 'function') {
        media.addListener(listener);
        removers.push(() => media.removeListener(listener));
      }
    } catch (error) {
      console.warn('[TinyHelpdeskHero][Util] Failed to observe media query', query, error);
    }
  });
  return () => {
    removers.forEach((remove) => {
      try {
        remove();
      } catch (error) {
        console.warn('[TinyHelpdeskHero][Util] Failed to remove media query listener', error);
      }
    });
  };
}

export function noop() {}

export default {
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
  noop,
};
