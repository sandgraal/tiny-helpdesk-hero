import test from 'node:test';
import assert from 'node:assert/strict';

import { drawMonitorFrame } from '../src/game/desk-assets.mjs';

test('drawMonitorFrame reuses provided layout metadata', () => {
  const layout = {
    frame: { x: 12, y: 24, width: 220, height: 160 },
    safeArea: { x: 30, y: 48, width: 180, height: 120 },
    scale: 0.42,
  };

  const result = drawMonitorFrame(null, 800, 600, { layout });

  assert.equal(result.x, layout.safeArea.x);
  assert.equal(result.y, layout.safeArea.y);
  assert.equal(result.width, layout.safeArea.width);
  assert.equal(result.height, layout.safeArea.height);
  assert.equal(result.scale, layout.scale);
  assert.deepEqual(result.frame, layout.frame);
});
