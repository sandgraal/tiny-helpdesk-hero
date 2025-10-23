import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseFileArg,
  normalizeBudgetKey,
  parseBudgetArg,
  parseArgs,
  formatAnalysisSummary,
} from '../scripts/analyze-gltf-bounds.mjs';

test('parseFileArg handles optional scene overrides', () => {
  assert.deepEqual(parseFileArg('desk.glb'), { filePath: 'desk.glb' });
  assert.deepEqual(parseFileArg('desk.glb@2'), { filePath: 'desk.glb', scene: 2 });
  assert.throws(() => parseFileArg('desk.glb@not-a-number'));
});

test('normalizeBudgetKey resolves known aliases and preserves custom keys', () => {
  assert.equal(normalizeBudgetKey('triangles'), 'triangleCount');
  assert.equal(normalizeBudgetKey('Meshes'), 'meshInstanceCount');
  assert.equal(normalizeBudgetKey('customStat'), 'customStat');
});

test('parseBudgetArg enforces key=value pairs with numeric budgets', () => {
  assert.deepEqual(parseBudgetArg('triangles=12000'), { key: 'triangleCount', budget: 12000 });
  assert.deepEqual(parseBudgetArg('vertexCount=6400.5'), { key: 'vertexCount', budget: 6400.5 });
  assert.throws(() => parseBudgetArg('invalid'));
  assert.throws(() => parseBudgetArg('triangles='));
});

test('parseArgs collects files, scene defaults, and budgets', () => {
  const parsed = parseArgs([
    '--scene', '1',
    '--format', 'Markdown',
    '--budget', 'triangles=12000',
    '--budget', 'vertices=6000',
    'desk.glb@3',
    'hero.glb',
  ]);
  assert.equal(parsed.scene, 1);
  assert.equal(parsed.format, 'markdown');
  assert.deepEqual(parsed.statBudgets, { triangleCount: 12000, vertexCount: 6000 });
  assert.equal(parsed.files.length, 2);
  assert.deepEqual(parsed.files[0], { filePath: 'desk.glb', scene: 3 });
  assert.deepEqual(parsed.files[1], { filePath: 'hero.glb' });
});

test('parseArgs returns help flag when requested', () => {
  const parsed = parseArgs(['--help']);
  assert.equal(parsed.help, true);
});

test('formatAnalysisSummary reports passes, warnings, and errors', () => {
  const summary = formatAnalysisSummary([
    { filePath: 'desk.glb', warnings: [{ stat: 'triangleCount' }] },
    { filePath: 'hero.glb', error: 'Failed to parse' },
    { filePath: 'prop.glb' },
  ]);
  assert.equal(summary, 'Summary: 3 files analyzed — 1 pass — 1 warning — 1 error');
});

test('formatAnalysisSummary returns empty string for empty input', () => {
  assert.equal(formatAnalysisSummary([]), '');
  assert.equal(formatAnalysisSummary(null), '');
});
