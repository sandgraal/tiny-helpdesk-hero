import test from 'node:test';
import assert from 'node:assert/strict';

import { createLightingController } from '../src/systems/lighting/lighting-controller.mjs';

test('lighting controller reports day/night progress and sky intensifies over time', () => {
  const lighting = createLightingController();

  lighting.update({ empathyScore: 0, callCount: 10, currentIndex: 1, lowPowerMode: false });
  const morning = lighting.getAmbientLayers();

  lighting.update({ empathyScore: 0, callCount: 10, currentIndex: 8, lowPowerMode: false });
  const evening = lighting.getAmbientLayers();

  assert.ok(morning.day.progress < evening.day.progress, 'progress should advance as calls resolve');
  assert.ok(evening.day.sky.alpha > morning.day.sky.alpha, 'sky overlay should strengthen toward evening');
  assert.ok(evening.day.window.alpha >= morning.day.window.alpha, 'window glow should stay steady or brighten toward evening');
});

test('low power mode dampens day overlays', () => {
  const lighting = createLightingController();

  lighting.update({ empathyScore: 5, callCount: 10, currentIndex: 5, lowPowerMode: false });
  const regular = lighting.getAmbientLayers();

  lighting.update({ empathyScore: 5, callCount: 10, currentIndex: 5, lowPowerMode: true });
  const reduced = lighting.getAmbientLayers();

  assert.ok(regular.day.sky.alpha > reduced.day.sky.alpha, 'sky alpha should drop in low power mode');
  assert.ok(regular.day.window.alpha > reduced.day.window.alpha, 'window alpha should drop in low power mode');
});
