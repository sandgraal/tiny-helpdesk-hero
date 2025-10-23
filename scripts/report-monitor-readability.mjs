#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import process from 'node:process';

import { fitMonitorFrameToCanvas, evaluateMonitorReadability } from '../src/game/blockout-metrics.mjs';

export const DEFAULT_BREAKPOINTS = Object.freeze([
  { width: 1280, height: 720 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 960, height: 540 },
  { width: 854, height: 480 },
]);

const DIMENSION_SEPARATOR = '×';

function formatDimensions({ width, height }) {
  return `${width}${DIMENSION_SEPARATOR}${height}`;
}

function describeNotes(readability) {
  const notes = [];
  if (!readability?.meetsWidth) {
    notes.push('width < min');
  }
  if (!readability?.meetsHeight) {
    notes.push('height < min');
  }
  if (Number.isFinite(readability?.pixelsPerUiUnit) && readability.pixelsPerUiUnit < 1) {
    notes.push(`<1 px/ui (${readability.pixelsPerUiUnit.toFixed(2)})`);
  }
  if (!notes.length) {
    notes.push('within blockout targets');
  }
  return notes;
}

export function generateReadabilityEntry(width, height) {
  const layout = fitMonitorFrameToCanvas(width, height);
  const readability = evaluateMonitorReadability(width, height, {}, { layout });
  const safeArea = readability.safeArea ?? layout.safeArea ?? { width: 0, height: 0 };
  const scale = readability.scale ?? layout.scale ?? null;
  return {
    canvas: {
      width,
      height,
      label: formatDimensions({ width, height }),
    },
    safeArea: {
      width: Math.round(safeArea.width),
      height: Math.round(safeArea.height),
      label: formatDimensions({
        width: Math.round(safeArea.width),
        height: Math.round(safeArea.height),
      }),
    },
    scale,
    isReadable: Boolean(readability.isReadable),
    meetsWidth: Boolean(readability.meetsWidth),
    meetsHeight: Boolean(readability.meetsHeight),
    pixelsPerUiUnit: readability.pixelsPerUiUnit ?? null,
    notes: describeNotes(readability),
  };
}

export function generateReadabilityEntries(breakpoints = DEFAULT_BREAKPOINTS) {
  return breakpoints.map(({ width, height }) => generateReadabilityEntry(width, height));
}

function formatRow(values) {
  return `| ${values.join(' | ')} |`;
}

function formatMarkdown(entries) {
  const header = formatRow(['Canvas', 'Safe Area', 'Scale', 'Readable', 'Notes']);
  const separator = formatRow(['---', '---', '---', '---', '---']);
  const rows = entries.map((entry) => {
    const scaleLabel = Number.isFinite(entry.scale) ? entry.scale.toFixed(3) : '—';
    const readableLabel = entry.isReadable ? '✅' : '⚠️';
    return formatRow([
      entry.canvas.label,
      entry.safeArea.label,
      scaleLabel,
      readableLabel,
      entry.notes.join(', '),
    ]);
  });
  return [header, separator, ...rows].join('\n');
}

function formatText(entries) {
  return entries
    .map((entry) => {
      const scaleLabel = Number.isFinite(entry.scale) ? entry.scale.toFixed(3) : '—';
      const status = entry.isReadable ? 'readable' : 'warning';
      return [
        entry.canvas.label,
        `safe ${entry.safeArea.label}`,
        `scale ${scaleLabel}`,
        status,
        entry.notes.join(', '),
      ].join(' — ');
    })
    .join('\n');
}

function formatJson(entries) {
  return JSON.stringify(
    entries.map((entry) => ({
      canvas: {
        width: entry.canvas.width,
        height: entry.canvas.height,
      },
      safeArea: {
        width: entry.safeArea.width,
        height: entry.safeArea.height,
      },
      scale: entry.scale,
      isReadable: entry.isReadable,
      meetsWidth: entry.meetsWidth,
      meetsHeight: entry.meetsHeight,
      pixelsPerUiUnit: entry.pixelsPerUiUnit,
      notes: entry.notes,
    })),
    null,
    2,
  );
}

export function formatReport(entries, { format = 'markdown' } = {}) {
  const normalized = format?.toLowerCase?.();
  if (normalized === 'json') {
    return formatJson(entries);
  }
  if (normalized === 'text' || normalized === 'plain') {
    return formatText(entries);
  }
  return formatMarkdown(entries);
}

export function parseSize(value) {
  if (typeof value !== 'string') {
    throw new Error('Size must be a string in the form <width>x<height>.');
  }
  const normalized = value.toLowerCase().replace('×', 'x').replace(/\s+/g, '');
  const [widthStr, heightStr] = normalized.split('x');
  const width = Number.parseInt(widthStr, 10);
  const height = Number.parseInt(heightStr, 10);
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error(`Invalid size value: ${value}`);
  }
  return { width, height };
}

function printUsage() {
  console.log('Usage: npm run report:monitor -- [options]');
  console.log('       node scripts/report-monitor-readability.mjs [options]');
  console.log('Options:');
  console.log('  --size <WxH>           Add a canvas size to evaluate (repeatable)');
  console.log('  --include-defaults     Include the default breakpoint set in addition to custom sizes');
  console.log('  --format <mode>        Output format: markdown (default), text, json');
  console.log('  --json                 Shortcut for --format json');
  console.log('  --text                 Shortcut for --format text');
  console.log('  --markdown             Shortcut for --format markdown');
  console.log('  --output <file>        Write the report to a file');
  console.log('  --help                 Show this message');
}

export function parseArgs(argv = []) {
  const result = {
    sizes: [],
    includeDefaults: false,
    format: 'markdown',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--size') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error('Missing value for --size');
      }
      result.sizes.push(parseSize(value));
      i += 1;
    } else if (arg === '--include-defaults') {
      result.includeDefaults = true;
    } else if (arg === '--format') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error('Missing value for --format');
      }
      result.format = value;
      i += 1;
    } else if (arg === '--json') {
      result.format = 'json';
    } else if (arg === '--text') {
      result.format = 'text';
    } else if (arg === '--markdown') {
      result.format = 'markdown';
    } else if (arg === '--output') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error('Missing value for --output');
      }
      result.output = value;
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return result;
}

export function buildBreakpointList({ sizes = [], includeDefaults = false } = {}) {
  if (sizes.length === 0) {
    return [...DEFAULT_BREAKPOINTS];
  }
  if (includeDefaults) {
    return [...DEFAULT_BREAKPOINTS, ...sizes];
  }
  return [...sizes];
}

async function main(argv) {
  const args = argv.slice(2);
  let parsed;
  try {
    parsed = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (parsed.help) {
    printUsage();
    return;
  }

  const breakpoints = buildBreakpointList(parsed);
  const entries = generateReadabilityEntries(breakpoints);
  const report = formatReport(entries, { format: parsed.format });

  if (report) {
    console.log(report);
  }

  if (parsed.output) {
    const resolvedReport = report ? `${report}\n` : '';
    await writeFile(parsed.output, resolvedReport);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main(process.argv);
}

export default function report(options = {}) {
  const breakpoints = buildBreakpointList(options);
  const entries = generateReadabilityEntries(breakpoints);
  return formatReport(entries, { format: options.format });
}
