import test from 'node:test';
import assert from 'node:assert/strict';

import { createPerformanceMonitor } from '../src/game/performance-monitor.mjs';

test('performance monitor captures frame timing summaries', () => {
  const originalPerformance = globalThis.performance;
  const nowState = { value: 0 };
  globalThis.performance = {
    now() {
      return nowState.value;
    },
  };

  try {
    const monitor = createPerformanceMonitor({ sampleSize: 2, logLabel: '[Test]' });

    monitor.markFrameStart();
    nowState.value = 10;
    monitor.markFrameEnd({ lowPower: false, delta: 0.01 });

    let stats = monitor.getStats();
    assert.equal(stats.lastFrame.duration, 10);
    assert.equal(stats.lastFrame.lowPower, false);
    assert.equal(stats.standard.sampleCount, 1);
    assert.equal(stats.lowPower.sampleCount, 0);

    monitor.markFrameStart();
    nowState.value += 20;
    monitor.markFrameEnd({ lowPower: true, delta: 0.03 });

    stats = monitor.getStats();
    assert.equal(stats.lastFrame.lowPower, true);
    assert.equal(stats.lowPower.sampleCount, 1);
    assert.ok(stats.lowPower.duration.max >= 20);

    monitor.markFrameStart();
    nowState.value += 30;
    monitor.markFrameEnd({ lowPower: false, delta: 0.05 });

    stats = monitor.getStats();
    assert.equal(stats.standard.sampleCount, 2);
    assert.ok(stats.standard.duration.max >= 30);
    assert.ok(stats.lastFrame.fps > 0);
  } finally {
    globalThis.performance = originalPerformance;
  }
});
