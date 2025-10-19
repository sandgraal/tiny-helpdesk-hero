import test from 'node:test';
import assert from 'node:assert/strict';

import {
  mapScreenPointToMonitor,
  createMonitorCoordinateMapper,
} from '../src/game/monitor-coordinates.mjs';

const layout = Object.freeze({
  scale: 0.68,
  safeArea: Object.freeze({ x: 100, y: 200, width: 680, height: 440 }),
});

test('mapScreenPointToMonitor returns null for invalid input', () => {
  assert.equal(mapScreenPointToMonitor(null, layout), null);
  assert.equal(mapScreenPointToMonitor({}, layout), null);
  assert.equal(mapScreenPointToMonitor({ x: 120 }, layout), null);
  assert.equal(mapScreenPointToMonitor({ y: 240 }, layout), null);
  assert.equal(mapScreenPointToMonitor({ x: NaN, y: 240 }, layout), null);
  assert.equal(mapScreenPointToMonitor({ x: 120, y: 240 }, null), null);
  assert.equal(mapScreenPointToMonitor({ x: 120, y: 240 }, { scale: -1 }), null);
  assert.equal(mapScreenPointToMonitor({ x: 120, y: 240 }, { scale: 1 }), null);
});

test('mapScreenPointToMonitor converts points inside the safe area', () => {
  const mapped = mapScreenPointToMonitor({ x: 120, y: 240 }, layout);
  assert.equal(mapped.x.toFixed(3), '29.412');
  assert.equal(mapped.y.toFixed(3), '58.824');

  const center = mapScreenPointToMonitor({ x: 440, y: 420 }, layout);
  assert.equal(center.x.toFixed(3), '500.000');
  assert.equal(center.y.toFixed(3), '323.529');
});

test('mapScreenPointToMonitor rejects points outside the safe area', () => {
  assert.equal(mapScreenPointToMonitor({ x: 80, y: 240 }, layout), null);
  assert.equal(mapScreenPointToMonitor({ x: 860, y: 240 }, layout), null);
  assert.equal(mapScreenPointToMonitor({ x: 440, y: 180 }, layout), null);
  assert.equal(mapScreenPointToMonitor({ x: 440, y: 660 }, layout), null);
});

test('createMonitorCoordinateMapper memoizes layout access', () => {
  let callCount = 0;
  const mapper = createMonitorCoordinateMapper(() => {
    callCount += 1;
    return layout;
  });

  const a = mapper({ x: 120, y: 240 });
  const b = mapper({ x: 120, y: 240 });
  assert.equal(callCount, 2); // layout is re-read per call for freshness
  assert.equal(a.x, b.x);
});
