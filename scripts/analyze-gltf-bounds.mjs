#!/usr/bin/env node

import { readFile as readFileFromFs, writeFile as writeFileToFs } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

import { parseGLB } from '../src/game/gltf-loader.mjs';
import { computeSceneAnalysis } from '../src/game/model-bounds.mjs';
import {
  createBoundsSummary,
  formatBoundsSummaries,
} from '../src/game/model-bounds-report.mjs';

function printUsage(log = console.log) {
  log('Usage: npm run analyze:gltf -- <path[@scene]> [...more] [options]');
  log('       node scripts/analyze-gltf-bounds.mjs <path[@scene]> [...more] [options]');
  log('Options:');
  log('  --scene <index>      Scene index to analyze (applies when @scene is not provided)');
  log('  --format <mode>      Output mode: text (default), markdown, json');
  log('  --json               Shortcut for --format json');
  log('  --markdown           Shortcut for --format markdown');
  log('  --output <file>      Write the report to a file in addition to stdout');
  log('  --budget <key=value> Enforce a numeric budget for a stat (triangles, vertices, etc.)');
  log('  --help               Show this message');
}

export async function readGlb(path) {
  const resolved = resolve(path);
  const file = await readFileFromFs(resolved);
  const arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
  return parseGLB(arrayBuffer);
}

export function parseFileArg(arg) {
  if (!arg) {
    return null;
  }
  const atIndex = arg.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === arg.length - 1) {
    return { filePath: arg };
  }
  const filePath = arg.slice(0, atIndex);
  const sceneValue = arg.slice(atIndex + 1);
  const scene = Number.parseInt(sceneValue, 10);
  if (Number.isNaN(scene)) {
    throw new Error(`Invalid scene override for ${arg}`);
  }
  return { filePath, scene };
}

export const BUDGET_ALIASES = Object.freeze({
  triangles: 'triangleCount',
  triangle: 'triangleCount',
  verts: 'vertexCount',
  vertices: 'vertexCount',
  vertex: 'vertexCount',
  primitives: 'primitiveCount',
  primitive: 'primitiveCount',
  nodes: 'nodeCount',
  node: 'nodeCount',
  meshes: 'meshInstanceCount',
  meshinstances: 'meshInstanceCount',
  mesh: 'meshInstanceCount',
});

export function normalizeBudgetKey(key) {
  const normalized = key?.toLowerCase();
  if (!normalized) {
    return null;
  }
  return BUDGET_ALIASES[normalized] ?? key;
}

export function parseBudgetArg(value) {
  if (!value || !value.includes('=')) {
    throw new Error('Budget must be provided as key=value.');
  }
  const [rawKey, rawBudget] = value.split('=', 2);
  const key = normalizeBudgetKey(rawKey);
  if (!key) {
    throw new Error(`Invalid budget key: ${rawKey}`);
  }
  const budget = Number.parseFloat(rawBudget);
  if (!Number.isFinite(budget)) {
    throw new Error(`Invalid budget value for ${rawKey}: ${rawBudget}`);
  }
  return { key, budget };
}

export function parseArgs(args) {
  const files = [];
  let scene;
  let format;
  let output;
  const statBudgets = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--scene') {
      const value = args[i + 1];
      if (value === undefined) {
        throw new Error('Missing value for --scene');
      }
      scene = Number.parseInt(value, 10);
      if (Number.isNaN(scene)) {
        throw new Error(`Invalid scene index: ${value}`);
      }
      i += 1;
    } else if (arg === '--format') {
      const value = args[i + 1];
      if (!value) {
        throw new Error('Missing value for --format');
      }
      format = value.toLowerCase();
      i += 1;
    } else if (arg === '--json') {
      format = 'json';
    } else if (arg === '--markdown') {
      format = 'markdown';
    } else if (arg === '--output') {
      output = args[i + 1];
      if (!output) {
        throw new Error('Missing value for --output');
      }
      i += 1;
    } else if (arg === '--budget') {
      const value = args[i + 1];
      if (!value) {
        throw new Error('Missing value for --budget');
      }
      const budget = parseBudgetArg(value);
      statBudgets[budget.key] = budget.budget;
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      return { help: true };
    } else {
      files.push(parseFileArg(arg));
    }
  }
  return { files, scene, format, output, statBudgets };
}

export async function main(argv, io = {}) {
  const {
    log = console.log,
    error = console.error,
    readGlbFn = readGlb,
    writeFileFn = writeFileToFs,
    setExitCode = (code) => {
      if (typeof code === 'number' && code > 0) {
        process.exitCode = code;
      }
    },
  } = io;
  const args = argv.slice(2);
  if (args.length === 0) {
    printUsage(log);
    setExitCode(1);
    return { summaries: [], report: '' };
  }

  let parsed;
  try {
    parsed = parseArgs(args);
  } catch (error) {
    error(error.message);
    printUsage(log);
    setExitCode(1);
    return { summaries: [], report: '' };
  }

  if (parsed.help) {
    printUsage(log);
    return { summaries: [], report: '' };
  }

  const { files = [] } = parsed;
  if (!files.length) {
    printUsage(log);
    setExitCode(1);
    return { summaries: [], report: '' };
  }

  const summaries = [];

  for (const file of files) {
    if (!file?.filePath) {
      summaries.push(
        createBoundsSummary({ filePath: String(file?.filePath ?? 'unknown'), error: 'Invalid file path.' }),
      );
      setExitCode(1);
      continue;
    }
    const sceneIndex = file.scene ?? parsed.scene;
    try {
      const gltf = await readGlbFn(file.filePath);
      const analysis = computeSceneAnalysis(gltf, { scene: sceneIndex });
      const summary = createBoundsSummary(
        {
          filePath: resolve(file.filePath),
          scene: sceneIndex,
          bounds: analysis.bounds,
          stats: analysis.stats,
        },
        { statBudgets: parsed.statBudgets },
      );
      summaries.push(summary);
      if (summary?.warnings?.length) {
        setExitCode(1);
      }
    } catch (error) {
      summaries.push(createBoundsSummary({ filePath: resolve(file.filePath), scene: sceneIndex, error }));
      setExitCode(1);
    }
  }

  const report = formatBoundsSummaries(summaries, { format: parsed.format });
  if (report) {
    log(report);
  }

  if (parsed.output) {
    const outputPath = resolve(parsed.output);
    const resolvedReport = report ? `${report}\n` : '\n';
    await writeFileFn(outputPath, resolvedReport);
  }
  return { summaries, report };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main(process.argv, {
    log: console.log,
    error: console.error,
    setExitCode: (code) => {
      if (typeof code === 'number' && code > 0) {
        process.exitCode = code;
      }
    },
  });
}

export default main;
