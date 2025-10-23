import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import {
  parseFileArg,
  parseBudgetArg,
  parseArgs,
  main as runAnalyzer,
} from '../scripts/analyze-gltf-bounds.mjs';

const textEncoder = new TextEncoder();

function padChunk(data, padByte = 0x20) {
  const padding = (4 - (data.length % 4)) % 4;
  if (padding === 0) {
    return data;
  }
  const padded = new Uint8Array(data.length + padding);
  padded.set(data, 0);
  padded.fill(padByte, data.length);
  return padded;
}

function createGlb(json, binary = new Uint8Array()) {
  const jsonBytes = padChunk(textEncoder.encode(JSON.stringify(json)));
  const binBytes = padChunk(binary, 0);
  const totalLength = 12 + 8 + jsonBytes.length + 8 + binBytes.length;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  const MAGIC = 0x46546c67;
  const VERSION = 2;
  const CHUNK_JSON = 0x4e4f534a;
  const CHUNK_BIN = 0x004e4942;

  view.setUint32(0, MAGIC, true);
  view.setUint32(4, VERSION, true);
  view.setUint32(8, totalLength, true);

  let offset = 12;
  view.setUint32(offset, jsonBytes.length, true);
  view.setUint32(offset + 4, CHUNK_JSON, true);
  new Uint8Array(arrayBuffer, offset + 8, jsonBytes.length).set(jsonBytes);
  offset += 8 + jsonBytes.length;

  view.setUint32(offset, binBytes.length, true);
  view.setUint32(offset + 4, CHUNK_BIN, true);
  new Uint8Array(arrayBuffer, offset + 8, binBytes.length).set(binBytes);

  return arrayBuffer;
}

function createTriangleGlb() {
  const positions = new Float32Array([
    0, 0, 0,
    1, 0, 0,
    0, 1, 0,
  ]);
  const indices = new Uint16Array([0, 1, 2]);
  const binary = new Uint8Array(positions.byteLength + indices.byteLength);
  binary.set(new Uint8Array(positions.buffer), 0);
  binary.set(new Uint8Array(indices.buffer), positions.byteLength);

  const json = {
    asset: { version: '2.0' },
    buffers: [{ byteLength: binary.length }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: positions.byteLength },
      { buffer: 0, byteOffset: positions.byteLength, byteLength: indices.byteLength },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 3,
        type: 'VEC3',
        min: [0, 0, 0],
        max: [1, 1, 0],
      },
      {
        bufferView: 1,
        componentType: 5123,
        count: 3,
        type: 'SCALAR',
      },
    ],
    meshes: [
      {
        primitives: [
          {
            attributes: { POSITION: 0 },
            indices: 1,
            mode: 4,
          },
        ],
      },
    ],
    nodes: [{ mesh: 0 }],
    scenes: [{ nodes: [0] }],
    scene: 0,
  };

  return new Uint8Array(createGlb(json, binary));
}

test('parseFileArg handles scene override suffix', () => {
  const parsed = parseFileArg('desk.glb@2');
  assert.deepEqual(parsed, { filePath: 'desk.glb', scene: 2 });
});

test('parseFileArg rejects invalid scene suffix', () => {
  assert.throws(() => parseFileArg('desk.glb@nope'), /Invalid scene override/);
});

test('parseBudgetArg normalizes aliases', () => {
  const parsed = parseBudgetArg('triangles=1234');
  assert.equal(parsed.key, 'triangleCount');
  assert.equal(parsed.budget, 1234);
});

test('parseArgs collects files, formats, and budgets', () => {
  const parsed = parseArgs([
    'desk.glb@1',
    '--scene',
    '3',
    '--format',
    'markdown',
    '--output',
    'report.md',
    '--budget',
    'vertices=8000',
  ]);
  assert.equal(parsed.scene, 3);
  assert.equal(parsed.format, 'markdown');
  assert.equal(parsed.output, 'report.md');
  assert.deepEqual(parsed.files, [{ filePath: 'desk.glb', scene: 1 }]);
  assert.equal(parsed.statBudgets.vertexCount, 8000);
});

test('main generates a summary for valid GLB input', async (t) => {
  const tempDir = await mkdtemp(join(tmpdir(), 'thh-analyze-'));
  t.after(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  const glbPath = join(tempDir, 'triangle.glb');
  await writeFile(glbPath, createTriangleGlb());

  const logs = [];
  const errors = [];
  const exitCodes = [];

  const result = await runAnalyzer(['node', 'analyze', glbPath], {
    log: (value) => logs.push(value),
    error: (value) => errors.push(value),
    setExitCode: (code) => exitCodes.push(code),
  });

  assert.equal(errors.length, 0);
  assert.equal(exitCodes.length, 0);
  assert.ok(logs[0]?.includes('Scene bounds for'));
  assert.equal(result.summaries.length, 1);
  assert.equal(result.summaries[0].stats.triangleCount, 1);
});

test('main flags budget overruns and surfaces warnings', async (t) => {
  const tempDir = await mkdtemp(join(tmpdir(), 'thh-analyze-budget-'));
  t.after(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  const glbPath = join(tempDir, 'triangle.glb');
  await writeFile(glbPath, createTriangleGlb());

  const logs = [];
  const exitCodes = [];

  const result = await runAnalyzer([
    'node',
    'analyze',
    glbPath,
    '--budget',
    'triangles=0',
    '--format',
    'markdown',
  ], {
    log: (value) => logs.push(value),
    error: () => {},
    setExitCode: (code) => exitCodes.push(code),
  });

  assert.ok(exitCodes.includes(1));
  assert.equal(result.summaries[0].warnings?.length ?? 0, 1);
  assert.ok(logs[0]?.includes('Triangles (instanced)'));
});

const sampleBounds = {
  min: [0, 0, 0],
  max: [1, 1, 1],
  size: [1, 1, 1],
  center: [0.5, 0.5, 0.5],
  diagonal: Math.sqrt(3),
};

function createAnalysis(statsOverrides = {}) {
  return {
    bounds: { ...sampleBounds },
    stats: {
      nodeCount: 1,
      meshInstanceCount: 1,
      primitiveCount: 1,
      vertexCount: 1,
      triangleCount: 1,
      ...statsOverrides,
    },
  };
}

test('main appends roll-up summary for text output', async () => {
  const logs = [];
  let exitCode = 0;
  const analyses = new Map([
    ['pass.glb', createAnalysis({ triangleCount: 80 })],
    ['warn.glb', createAnalysis({ triangleCount: 150 })],
  ]);

  const argv = [
    'node',
    'scripts/analyze-gltf-bounds.mjs',
    'pass.glb',
    'warn.glb',
    'error.glb',
    '--budget',
    'triangles=100',
  ];

  const { report } = await runAnalyzer(argv, {
    log: (message) => logs.push(message),
    error: () => {},
    readGlbFn: async (filePath) => {
      if (filePath === 'error.glb') {
        throw new Error('Boom');
      }
      return { filePath };
    },
    analyzeSceneFn: (gltf) => analyses.get(gltf.filePath),
    setExitCode: (code) => {
      exitCode = code;
    },
  });

  assert.equal(exitCode, 1);
  assert.equal(logs.length, 1);
  const output = logs[0];
  assert.equal(report, output);
  assert.match(output, new RegExp(`Scene bounds for ${resolve('pass.glb')}`));
  assert.match(output, new RegExp(`Scene bounds for ${resolve('warn.glb')}`));
  assert.match(output, /Error: Boom/);
  assert.match(output, /✅ 1 pass/);
  assert.match(output, /⚠️ 1 warning/);
  assert.match(output, /❌ 1 error/);
});

test('main skips roll-up summary for markdown output', async () => {
  const logs = [];
  const argv = ['node', 'scripts/analyze-gltf-bounds.mjs', 'pass.glb', '--format', 'markdown'];

  const { report } = await runAnalyzer(argv, {
    log: (message) => logs.push(message),
    error: () => {},
    readGlbFn: async (filePath) => ({ filePath }),
    analyzeSceneFn: () => createAnalysis({ triangleCount: 40 }),
    setExitCode: () => {},
  });

  assert.equal(logs.length, 1);
  const output = logs[0];
  assert.equal(report, output);
  assert.ok(output.startsWith('### '));
  assert.ok(!output.includes('Roll-up:'));
});
