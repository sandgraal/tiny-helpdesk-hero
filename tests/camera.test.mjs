import test from 'node:test';
import assert from 'node:assert/strict';

import { createCameraState } from '../src/game/camera.mjs';

test('camera offsets respond to pointer position', () => {
  const camera = createCameraState({ parallax: { x: 4, y: 2 } });
  camera.update({ pointer: { x: 960, y: 540 }, canvasSize: { width: 1280, height: 720 } });
  let state = camera.getState();
  assert.ok(state.offset.x > 0);
  assert.ok(state.offset.y > 0);

  camera.update({ pointer: { x: 0, y: 0 }, canvasSize: { width: 1280, height: 720 } });
  state = camera.getState();
  assert.ok(state.offset.x < 0);
  assert.ok(state.offset.y < 0);

  camera.setLowPower(true);
  camera.update({ pointer: { x: 1280, y: 720 }, canvasSize: { width: 1280, height: 720 } });
  state = camera.getState();
  assert.equal(state.offset.x, 0);
  assert.equal(state.offset.y, 0);
  assert.equal(state.lowPower, true);
});
