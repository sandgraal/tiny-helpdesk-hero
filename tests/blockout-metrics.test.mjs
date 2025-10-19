import test from 'node:test';
import assert from 'node:assert/strict';

import {
  fitMonitorFrameToCanvas,
  evaluateMonitorReadability,
  monitorFrameSpec,
} from '../src/game/blockout-metrics.mjs';

test('fitMonitorFrameToCanvas matches expected safe-area scale for 1280x720', () => {
  const layout = fitMonitorFrameToCanvas(1280, 720);
  assert.equal(layout.frame.width, 750);
  assert.equal(layout.frame.height, 518);
  assert.equal(layout.safeArea.width, 641);
  assert.equal(layout.safeArea.height, 409);
  assert.equal(layout.scale > 0, true);
});

test('evaluateMonitorReadability flags small canvases', () => {
  const readable = evaluateMonitorReadability(1280, 720);
  assert.equal(readable.isReadable, true);
  assert.ok(readable.meetsWidth);
  assert.ok(readable.meetsHeight);
  assert.ok(readable.pixelsPerUiUnit > 0.65);

  const tiny = evaluateMonitorReadability(960, 540);
  assert.equal(tiny.isReadable, false);
  assert.equal(tiny.meetsWidth, false);
  assert.ok(tiny.safeArea.width < readable.safeArea.width);
});

test('monitorFrameSpec safe area stays aligned with inset values', () => {
  const inset = monitorFrameSpec.safeInset;
  const safe = monitorFrameSpec.safeArea;
  assert.equal(safe.x, inset.x);
  assert.equal(safe.y, inset.y);
  assert.equal(safe.width, monitorFrameSpec.totalSize.width - inset.x * 2);
  assert.equal(safe.height, monitorFrameSpec.totalSize.height - inset.y * 2);
});

test('evaluateMonitorReadability can reuse a provided layout', () => {
  const layout = fitMonitorFrameToCanvas(1920, 1080);
  const result = evaluateMonitorReadability(1920, 1080, {}, { layout });
  assert.equal(result.frame.width, layout.frame.width);
  assert.equal(result.safeArea.height, layout.safeArea.height);
  assert.equal(result.scale, layout.scale);
  assert.ok(result.meetsWidth);
});
