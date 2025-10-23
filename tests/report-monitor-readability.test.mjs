import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_BREAKPOINTS,
  buildBreakpointList,
  formatReport,
  generateReadabilityEntry,
  generateReadabilityEntries,
  parseArgs,
  parseSize,
} from '../scripts/report-monitor-readability.mjs';

test('generateReadabilityEntry captures safe area and notes', () => {
  const entry = generateReadabilityEntry(1280, 720);
  assert.equal(entry.canvas.label, '1280×720');
  assert.equal(entry.safeArea.width, 641);
  assert.equal(entry.safeArea.height, 409);
  assert.equal(entry.safeArea.label, '641×409');
  assert.equal(entry.isReadable, true);
  assert.equal(entry.meetsWidth, true);
  assert.equal(entry.meetsHeight, true);
  assert.ok(entry.notes.includes('<1 px/ui (0.68)'));
  assert.ok(entry.scale > 0.68 && entry.scale < 0.69);
});

test('formatReport outputs markdown by default', () => {
  const entries = generateReadabilityEntries([{ width: 1280, height: 720 }]);
  const report = formatReport(entries);
  assert.match(report, /\| Canvas \| Safe Area \| Scale \| Readable \| Notes \|/);
  assert.match(report, /\| 1280×720 \| 641×409 \| 0\.682 \| ✅ \| <1 px\/ui \(0\.68\) \|/);
});

test('formatReport supports json output', () => {
  const entries = generateReadabilityEntries([{ width: 1600, height: 900 }]);
  const json = formatReport(entries, { format: 'json' });
  const parsed = JSON.parse(json);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].canvas.width, 1600);
  assert.equal(parsed[0].safeArea.height, 512);
  assert.deepEqual(parsed[0].notes, ['<1 px/ui (0.85)']);
});

test('parseSize accepts multiple separators', () => {
  assert.deepEqual(parseSize('3440x1440'), { width: 3440, height: 1440 });
  assert.deepEqual(parseSize('1024×768'), { width: 1024, height: 768 });
  assert.deepEqual(parseSize(' 800 X 600 '), { width: 800, height: 600 });
});

test('buildBreakpointList merges defaults when requested', () => {
  const breakpoints = buildBreakpointList({
    sizes: [{ width: 800, height: 600 }],
    includeDefaults: true,
  });
  assert.equal(breakpoints.length, DEFAULT_BREAKPOINTS.length + 1);
  assert.ok(breakpoints.some((bp) => bp.width === 800 && bp.height === 600));
});

test('parseArgs collects sizes and format flags', () => {
  const parsed = parseArgs([
    '--size', '1440x900',
    '--size', '3440×1440',
    '--text',
    '--output', 'report.md',
    '--include-defaults',
  ]);
  assert.equal(parsed.format, 'text');
  assert.equal(parsed.output, 'report.md');
  assert.equal(parsed.includeDefaults, true);
  assert.equal(parsed.sizes.length, 2);
  assert.deepEqual(parsed.sizes[0], { width: 1440, height: 900 });
  assert.deepEqual(parsed.sizes[1], { width: 3440, height: 1440 });
});

test('parseArgs rejects unknown flags', () => {
  assert.throws(() => parseArgs(['--unknown']));
});

