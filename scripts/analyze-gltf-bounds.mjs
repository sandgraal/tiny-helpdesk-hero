#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

import { parseGLB } from '../src/game/gltf-loader.mjs';
import { computeSceneAnalysis } from '../src/game/model-bounds.mjs';
import {
  createBoundsSummary,
  formatBoundsSummaries,
} from '../src/game/model-bounds-report.mjs';

function printUsage() {
  console.log('Usage: npm run analyze:gltf -- <path[@scene]> [...more] [options]');
  console.log('       node scripts/analyze-gltf-bounds.mjs <path[@scene]> [...more] [options]');
  console.log('Options:');
  console.log('  --scene <index>      Scene index to analyze (applies when @scene is not provided)');
  console.log('  --format <mode>      Output mode: text (default), markdown, json');
  console.log('  --json               Shortcut for --format json');
  console.log('  --markdown           Shortcut for --format markdown');
  console.log('  --output <file>      Write the report to a file in addition to stdout');
  console.log('  --help               Show this message');
}

async function readGlb(path) {
  const resolved = resolve(path);
  const file = await readFile(resolved);
  const arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
  return parseGLB(arrayBuffer);
}

function parseFileArg(arg) {
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

function parseArgs(args) {
  const files = [];
  let scene;
  let format;
  let output;
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
    } else if (arg === '--help' || arg === '-h') {
      return { help: true };
    } else {
      files.push(parseFileArg(arg));
    }
  }
  return { files, scene, format, output };
}

async function main(argv) {
  const args = argv.slice(2);
  if (args.length === 0) {
    printUsage();
    process.exitCode = 1;
    return;
  }

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

  const { files = [] } = parsed;
  if (!files.length) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const summaries = [];

  for (const file of files) {
    if (!file?.filePath) {
      summaries.push(createBoundsSummary({ filePath: String(file?.filePath ?? 'unknown'), error: 'Invalid file path.' }));
      continue;
    }
    const sceneIndex = file.scene ?? parsed.scene;
    try {
      const gltf = await readGlb(file.filePath);
      const analysis = computeSceneAnalysis(gltf, { scene: sceneIndex });
      summaries.push(
        createBoundsSummary({
          filePath: resolve(file.filePath),
          scene: sceneIndex,
          bounds: analysis.bounds,
          stats: analysis.stats,
        }),
      );
    } catch (error) {
      summaries.push(createBoundsSummary({ filePath: resolve(file.filePath), scene: sceneIndex, error }));
      process.exitCode = 1;
    }
  }

  const report = formatBoundsSummaries(summaries, { format: parsed.format });
  if (report) {
    console.log(report);
  }

  if (parsed.output) {
    await writeFile(resolve(parsed.output), `${report}\n`);
  }
}

await main(process.argv);
