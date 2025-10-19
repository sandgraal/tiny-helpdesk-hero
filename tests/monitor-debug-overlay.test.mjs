import test from 'node:test';
import assert from 'node:assert/strict';

import { drawMonitorDebugOverlay } from '../src/game/monitor-debug-overlay.mjs';

function createStubContext() {
  const calls = [];
  return {
    calls,
    save() {
      calls.push(['save']);
    },
    restore() {
      calls.push(['restore']);
    },
    fillRect(x, y, width, height) {
      calls.push(['fillRect', x, y, width, height]);
    },
    strokeRect(x, y, width, height) {
      calls.push(['strokeRect', x, y, width, height]);
    },
    beginPath() {
      calls.push(['beginPath']);
    },
    moveTo(x, y) {
      calls.push(['moveTo', x, y]);
    },
    lineTo(x, y) {
      calls.push(['lineTo', x, y]);
    },
    stroke() {
      calls.push(['stroke']);
    },
    setLineDash(pattern) {
      calls.push(['setLineDash', Array.isArray(pattern) ? [...pattern] : pattern]);
    },
    arc(x, y, radius) {
      calls.push(['arc', x, y, radius]);
    },
    fill() {
      calls.push(['fill']);
    },
    fillText(text, x, y) {
      calls.push(['fillText', text, x, y]);
    },
    font: '',
    textBaseline: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    globalAlpha: 1,
    globalCompositeOperation: '',
  };
}

test('drawMonitorDebugOverlay returns early without context abilities', () => {
  const result = drawMonitorDebugOverlay(null, {});
  assert.equal(result, undefined);
});

test('drawMonitorDebugOverlay paints safe area, frame, and info panel', () => {
  const context = createStubContext();
  const layout = {
    safeArea: { x: 100, y: 60, width: 470, height: 300 },
    frame: { x: 90, y: 40, width: 500, height: 340 },
    scale: 0.5,
    pixelsPerUiUnit: 0.5,
    isReadable: true,
  };

  drawMonitorDebugOverlay(context, {
    layout,
    readability: { ...layout },
  });

  const safeFill = context.calls.find((call) => call[0] === 'fillRect'
    && call[1] === layout.safeArea.x
    && call[2] === layout.safeArea.y
    && call[3] === layout.safeArea.width
    && call[4] === layout.safeArea.height);
  assert.ok(safeFill, 'safe area fill rect was drawn');

  const safeStroke = context.calls.find((call) => call[0] === 'strokeRect'
    && Math.round(call[1]) === Math.round(layout.safeArea.x + 0.5));
  assert.ok(safeStroke, 'safe area stroke rect was drawn');

  const frameStroke = context.calls.find((call) => call[0] === 'strokeRect'
    && Math.round(call[1]) === Math.round(layout.frame.x + 0.5)
    && Math.round(call[2]) === Math.round(layout.frame.y + 0.5)
    && Math.round(call[3]) === Math.round(layout.frame.width - 1));
  assert.ok(frameStroke, 'frame stroke rect was drawn');

  const infoText = context.calls.filter((call) => call[0] === 'fillText');
  assert.equal(infoText.length >= 2, true);
});

test('drawMonitorDebugOverlay renders pointer marker when provided', () => {
  const context = createStubContext();
  const layout = {
    safeArea: { x: 80, y: 40, width: 188, height: 120 },
    frame: { x: 60, y: 20, width: 228, height: 160 },
    scale: 0.2,
    pixelsPerUiUnit: 0.2,
    isReadable: false,
  };
  const pointer = { x: 120, y: 80 };

  drawMonitorDebugOverlay(context, {
    layout,
    readability: { ...layout },
    pointer,
  });

  const arcCall = context.calls.find((call) => call[0] === 'arc');
  assert.ok(arcCall, 'pointer arc was drawn');
  const [, px, py] = arcCall;
  assert.equal(Math.round(px), Math.round(layout.safeArea.x + pointer.x * layout.scale));
  assert.equal(Math.round(py), Math.round(layout.safeArea.y + pointer.y * layout.scale));
});
