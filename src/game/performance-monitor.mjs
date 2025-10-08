/**
 * Simple frame timing monitor that reports average frame cost for standard vs. low-power rendering.
 */

function now() {
  if (typeof globalThis.performance?.now === 'function') {
    return globalThis.performance.now();
  }
  return Date.now();
}

function createBucket() {
  return {
    durations: [],
    deltas: [],
  };
}

function summarize(samples) {
  if (!samples.length) {
    return { average: 0, min: 0, max: 0 };
  }
  let min = Number.POSITIVE_INFINITY;
  let max = 0;
  let total = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const value = samples[i];
    if (!Number.isFinite(value)) {
      continue;
    }
    min = Math.min(min, value);
    max = Math.max(max, value);
    total += value;
  }
  const average = samples.length ? total / samples.length : 0;
  return {
    average,
    min,
    max,
  };
}

export function createPerformanceMonitor({
  sampleSize = 120,
  logLabel = '[TinyHelpdeskHero][Perf]',
} = {}) {
  let frameStart = null;
  const buckets = {
    standard: createBucket(),
    lowPower: createBucket(),
  };

  function markFrameStart() {
    frameStart = now();
  }

  function recordSample({ lowPower = false, delta = 0, duration = 0 }) {
    const bucket = lowPower ? buckets.lowPower : buckets.standard;
    if (!bucket) {
      return;
    }
    bucket.durations.push(duration);
    bucket.deltas.push(delta);
    if (bucket.durations.length >= sampleSize) {
      const durationStats = summarize(bucket.durations);
      const deltaStats = summarize(bucket.deltas);
      const label = lowPower ? 'low-power' : 'standard';
      console.info(
        `${logLabel} ${label} ${sampleSize}f avg ${durationStats.average.toFixed(2)}ms ` +
        `(min ${durationStats.min.toFixed(2)} / max ${durationStats.max.toFixed(2)}), ` +
        `game dt avg ${(deltaStats.average * 1000).toFixed(2)}ms`,
      );
      bucket.durations = [];
      bucket.deltas = [];
    }
  }

  function markFrameEnd({ lowPower = false, delta = 0 } = {}) {
    if (frameStart === null) {
      return;
    }
    const duration = Math.max(0, now() - frameStart);
    recordSample({ lowPower, delta, duration });
    frameStart = null;
  }

  return {
    markFrameStart,
    markFrameEnd,
  };
}

export default createPerformanceMonitor;
