/**
 * Helpers for formatting GLB bounds analysis output for docs and tooling.
 */

import { deskFootprint as defaultDeskFootprint } from './blockout-metrics.mjs';

/**
 * Computes the delta between a set of bounds and the milestone 2.6 desk footprint.
 * @param {{ min:number[], max:number[], size:number[], center:number[], diagonal:number }} bounds
 * @param {{ deskFootprint?: { surfaceSize: { width: number, depth: number } } }} [options]
 */
export function compareBoundsToBlockout(bounds, { deskFootprint = defaultDeskFootprint } = {}) {
  if (!bounds || !deskFootprint?.surfaceSize) {
    return null;
  }
  const { width, depth } = deskFootprint.surfaceSize;
  return {
    widthDelta: bounds.size[0] - width,
    depthDelta: bounds.size[2] - depth,
  };
}

/**
 * Returns a normalized summary object for a GLB bounds analysis entry.
 * @param {{ filePath: string, scene?: number, bounds?: object, error?: Error | string }} entry
 * @param {{ deskFootprint?: object }} [options]
 */
export function createBoundsSummary(entry, { deskFootprint = defaultDeskFootprint } = {}) {
  const summary = {
    filePath: entry.filePath,
    scene: entry.scene,
  };

  if (entry.error) {
    return { ...summary, error: typeof entry.error === 'string' ? entry.error : entry.error.message };
  }
  if (!entry.bounds) {
    return { ...summary, error: 'No mesh primitives were found in the requested scene.' };
  }

  const { bounds } = entry;
  return {
    ...summary,
    bounds: {
      min: bounds.min,
      max: bounds.max,
      size: bounds.size,
      center: bounds.center,
      diagonal: bounds.diagonal,
    },
    blockout: compareBoundsToBlockout(bounds, { deskFootprint }),
  };
}

function formatVector(vector, precision = 4) {
  return `[${vector.map((value) => value.toFixed(precision)).join(', ')}]`;
}

function formatTextSummary(summary) {
  const header = `Scene bounds for ${summary.filePath}${summary.scene !== undefined ? ` (scene ${summary.scene})` : ''}`;
  if (summary.error) {
    return `${header}\n  Error: ${summary.error}`;
  }
  const { bounds, blockout } = summary;
  const lines = [
    header,
    `  Min:     ${formatVector(bounds.min)}`,
    `  Max:     ${formatVector(bounds.max)}`,
    `  Size:    ${formatVector(bounds.size)}`,
    `  Center:  ${formatVector(bounds.center)}`,
    `  Diagonal: ${bounds.diagonal.toFixed(4)}m`,
  ];
  if (blockout) {
    lines.push('  -- Blockout desk deltas --');
    lines.push(`  Width Δ: ${blockout.widthDelta.toFixed(4)}m`);
    lines.push(`  Depth Δ: ${blockout.depthDelta.toFixed(4)}m`);
  }
  return lines.join('\n');
}

function formatMarkdownSummary(summary) {
  const title = summary.filePath.replace(/\\+/g, '/');
  const heading = summary.scene !== undefined ? `### ${title} (scene ${summary.scene})` : `### ${title}`;
  if (summary.error) {
    return `${heading}\n\n- ❌ **Error:** ${summary.error}`;
  }
  const { bounds, blockout } = summary;
  const lines = [
    heading,
    '',
    '| Metric | Value |',
    '| --- | --- |',
    `| Min | ${formatVector(bounds.min)} |`,
    `| Max | ${formatVector(bounds.max)} |`,
    `| Size | ${formatVector(bounds.size)} |`,
    `| Center | ${formatVector(bounds.center)} |`,
    `| Diagonal | ${bounds.diagonal.toFixed(4)}m |`,
  ];
  if (blockout) {
    lines.push(`| Width Δ vs. blockout | ${blockout.widthDelta.toFixed(4)}m |`);
    lines.push(`| Depth Δ vs. blockout | ${blockout.depthDelta.toFixed(4)}m |`);
  }
  return lines.join('\n');
}

/**
 * Formats bounds summaries according to the requested output mode.
 * @param {Array<object>} summaries
 * @param {{ format?: 'text' | 'markdown' | 'json' }} [options]
 */
export function formatBoundsSummaries(summaries, { format = 'text' } = {}) {
  if (!Array.isArray(summaries)) {
    throw new Error('Summaries must be an array.');
  }
  switch (format) {
    case 'json':
      return JSON.stringify(summaries, null, 2);
    case 'markdown':
      return summaries.map((summary) => formatMarkdownSummary(summary)).join('\n\n');
    case 'text':
    default:
      return summaries.map((summary) => formatTextSummary(summary)).join('\n\n');
  }
}

export default {
  compareBoundsToBlockout,
  createBoundsSummary,
  formatBoundsSummaries,
};
