import test from 'node:test';
import assert from 'node:assert/strict';

import {
  compareBoundsToBlockout,
  createBoundsSummary,
  formatBoundsSummaries,
} from '../src/game/model-bounds-report.mjs';

const deskFootprint = {
  surfaceSize: { width: 1.2, depth: 0.7 },
};

const sampleBounds = {
  min: [-0.6, 0, -0.35],
  max: [0.6, 1, 0.35],
  size: [1.2, 1, 0.7],
  center: [0, 0.5, 0],
  diagonal: Math.sqrt(1.2 ** 2 + 1 ** 2 + 0.7 ** 2),
};

const sampleStats = {
  nodeCount: 4,
  meshInstanceCount: 5,
  primitiveCount: 6,
  vertexCount: 2400,
  triangleCount: 1200,
};

test('compareBoundsToBlockout returns deltas against desk footprint', () => {
  const deltas = compareBoundsToBlockout(sampleBounds, { deskFootprint });
  assert.deepEqual(deltas.widthDelta, 0);
  assert.deepEqual(deltas.depthDelta, 0);
});

test('createBoundsSummary captures errors when missing bounds', () => {
  const summary = createBoundsSummary({ filePath: 'missing.glb' });
  assert.equal(summary.error, 'No mesh primitives were found in the requested scene.');
});

test('createBoundsSummary normalizes bounds payload and stats', () => {
  const summary = createBoundsSummary(
    { filePath: 'desk.glb', scene: 1, bounds: sampleBounds, stats: sampleStats },
    { deskFootprint },
  );
  assert.equal(summary.filePath, 'desk.glb');
  assert.equal(summary.scene, 1);
  assert.deepEqual(summary.bounds.min, sampleBounds.min);
  assert.ok(summary.blockout);
  assert.equal(summary.blockout.widthDelta, 0);
  assert.deepEqual(summary.stats, sampleStats);
});

test('formatBoundsSummaries outputs text by default', () => {
  const summary = createBoundsSummary({ filePath: 'desk.glb', bounds: sampleBounds, stats: sampleStats }, { deskFootprint });
  const output = formatBoundsSummaries([summary]);
  assert.match(output, /Scene bounds for desk\.glb/);
  assert.match(output, /Width Δ: 0\.0000m/);
  assert.match(output, /Triangles \(instanced\): 1200/);
});

test('formatBoundsSummaries supports markdown', () => {
  const summary = createBoundsSummary({ filePath: 'desk.glb', bounds: sampleBounds, stats: sampleStats }, { deskFootprint });
  const output = formatBoundsSummaries([summary], { format: 'markdown' });
  assert.match(output, /\| Metric \| Value \|/);
  assert.match(output, /desk\.glb/);
  assert.match(output, /Triangles \(instanced\)/);
});

test('formatBoundsSummaries serializes json when requested', () => {
  const summary = createBoundsSummary({ filePath: 'desk.glb', bounds: sampleBounds, stats: sampleStats }, { deskFootprint });
  const output = formatBoundsSummaries([summary], { format: 'json' });
  const parsed = JSON.parse(output);
  assert.equal(parsed[0].filePath, 'desk.glb');
  assert.equal(parsed[0].bounds.size[0], sampleBounds.size[0]);
  assert.equal(parsed[0].stats.vertexCount, sampleStats.vertexCount);
});

test('formatBoundsSummaries throws for non-array input', () => {
  assert.throws(() => formatBoundsSummaries(null), /Summaries must be an array/);
});
