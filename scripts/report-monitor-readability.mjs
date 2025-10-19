#!/usr/bin/env node
import { fitMonitorFrameToCanvas, evaluateMonitorReadability } from '../src/game/blockout-metrics.mjs';

const BREAKPOINTS = [
  { width: 1280, height: 720 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 960, height: 540 },
  { width: 854, height: 480 },
];

function formatRow(values) {
  return `| ${values.join(' | ')} |`;
}

function report() {
  const header = formatRow(['Canvas', 'Safe Area', 'Scale', 'Readable', 'Notes']);
  const separator = formatRow(['---', '---', '---', '---', '---']);
  const rows = BREAKPOINTS.map(({ width, height }) => {
    const layout = fitMonitorFrameToCanvas(width, height);
    const readability = evaluateMonitorReadability(width, height, {}, { layout });
    const safe = readability.safeArea ?? { width: 0, height: 0 };
    const safeLabel = `${safe.width}×${safe.height}`;
    const canvasLabel = `${width}×${height}`;
    const scaleLabel = readability.scale ? readability.scale.toFixed(3) : '—';
    const readable = readability.isReadable ? '✅' : '⚠️';
    const notes = [];
    if (!readability.meetsWidth) {
      notes.push('width < min');
    }
    if (!readability.meetsHeight) {
      notes.push('height < min');
    }
    if (readability.pixelsPerUiUnit && readability.pixelsPerUiUnit < 1) {
      notes.push(`<1 px/ui (${readability.pixelsPerUiUnit.toFixed(2)})`);
    }
    if (!notes.length) {
      notes.push('within blockout targets');
    }
    return formatRow([canvasLabel, safeLabel, scaleLabel, readable, notes.join(', ')]);
  });

  return [header, separator, ...rows].join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(report());
}

export default report;
