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

function createEmptySummary() {
  return {
    sampleCount: 0,
    duration: { average: 0, min: 0, max: 0 },
    delta: { average: 0, min: 0, max: 0 },
  };
}

function snapshotBucket(bucket) {
  if (!bucket) {
    return createEmptySummary();
  }
  return {
    sampleCount: bucket.durations.length,
    duration: summarize(bucket.durations),
    delta: summarize(bucket.deltas),
  };
}

function cloneSummary(summary) {
  if (!summary) {
    return createEmptySummary();
  }
  return {
    sampleCount: summary.sampleCount ?? 0,
    duration: {
      average: summary.duration?.average ?? 0,
      min: summary.duration?.min ?? 0,
      max: summary.duration?.max ?? 0,
    },
    delta: {
      average: summary.delta?.average ?? 0,
      min: summary.delta?.min ?? 0,
      max: summary.delta?.max ?? 0,
    },
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
  let lastFrame = {
    duration: 0,
    delta: 0,
    fps: 0,
    lowPower: false,
  };
  const summaries = {
    standard: createEmptySummary(),
    lowPower: createEmptySummary(),
  };

  function markFrameStart() {
    frameStart = now();
  }

  function recordSample({ lowPower = false, delta = 0, duration = 0 }) {
    const bucketKey = lowPower ? 'lowPower' : 'standard';
    const bucket = buckets[bucketKey];
    if (!bucket) {
      return;
    }
    bucket.durations.push(duration);
    bucket.deltas.push(delta);
    lastFrame = {
      duration,
      delta,
      fps: duration > 0 ? 1000 / duration : 0,
      lowPower: Boolean(lowPower),
    };
    const snapshot = snapshotBucket(bucket);
    summaries[bucketKey] = snapshot;
    if (bucket.durations.length >= sampleSize) {
      const label = lowPower ? 'low-power' : 'standard';
      console.info(
        `${logLabel} ${label} ${sampleSize}f avg ${snapshot.duration.average.toFixed(2)}ms ` +
          `(min ${snapshot.duration.min.toFixed(2)} / max ${snapshot.duration.max.toFixed(2)}), ` +
          `game dt avg ${(snapshot.delta.average * 1000).toFixed(2)}ms`,
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

  function getStats() {
    return {
      lastFrame: { ...lastFrame },
      sampleSize,
      standard: cloneSummary(summaries.standard),
      lowPower: cloneSummary(summaries.lowPower),
    };
  }

  return {
    markFrameStart,
    markFrameEnd,
    getStats,
  };
}

export default createPerformanceMonitor;
