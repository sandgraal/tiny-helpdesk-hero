import test from 'node:test';
import assert from 'node:assert/strict';

import { parseGLB } from '../src/game/gltf-loader.mjs';
import { computeSceneBounds, computeSceneAnalysis } from '../src/game/model-bounds.mjs';

const MAGIC = 0x46546c67;
const VERSION = 2;
const CHUNK_JSON = 0x4e4f534a;
const CHUNK_BIN = 0x004e4942;
const SQRT_HALF = Math.SQRT1_2;

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

function createStridedBuffer(vertexCount, stride, positions) {
  const buffer = new ArrayBuffer(vertexCount * stride);
  const view = new DataView(buffer);
  for (let i = 0; i < vertexCount; i += 1) {
    const base = i * stride;
    const [x, y, z] = positions[i];
    view.setFloat32(base, x, true);
    view.setFloat32(base + 4, y, true);
    view.setFloat32(base + 8, z, true);
    // Fill the remaining stride with deterministic data.
    view.setUint32(base + 12, i + 1, true);
  }
  return new Uint8Array(buffer);
}

function createTestGlb() {
  const cubePositions = new Float32Array([
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
  ]);
  const cubeBytes = new Uint8Array(cubePositions.buffer);

  const stridedPositions = [
    [-2, -0.5, -0.5],
    [2, -0.5, -0.5],
    [2, 0.5, 0.5],
    [-2, 0.5, 0.5],
  ];
  const stride = 32;
  const stridedBytes = createStridedBuffer(stridedPositions.length, stride, stridedPositions);

  const cubeIndices = new Uint16Array([
    0, 1, 2, 0, 2, 3, // back
    4, 6, 5, 4, 7, 6, // front
    0, 4, 5, 0, 5, 1, // bottom
    1, 5, 6, 1, 6, 2, // right
    2, 6, 7, 2, 7, 3, // top
    3, 7, 4, 3, 4, 0, // left
  ]);
  const quadIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);

  const cubeIndexBytes = new Uint8Array(cubeIndices.buffer);
  const quadIndexBytes = new Uint8Array(quadIndices.buffer);

  const cubeByteLength = cubeBytes.length;
  const stridedOffset = cubeByteLength;
  const cubeIndexOffset = stridedOffset + stridedBytes.length;
  const quadIndexOffset = cubeIndexOffset + cubeIndexBytes.length;
  const totalByteLength = quadIndexOffset + quadIndexBytes.length;
  const binary = new Uint8Array(totalByteLength);
  binary.set(cubeBytes, 0);
  binary.set(stridedBytes, stridedOffset);
  binary.set(cubeIndexBytes, cubeIndexOffset);
  binary.set(quadIndexBytes, quadIndexOffset);

  const json = {
    asset: { version: '2.0' },
    buffers: [{ byteLength: binary.length }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: cubeByteLength },
      { buffer: 0, byteOffset: stridedOffset, byteLength: stridedBytes.length, byteStride: stride },
      { buffer: 0, byteOffset: cubeIndexOffset, byteLength: cubeIndexBytes.length, target: 34963 },
      { buffer: 0, byteOffset: quadIndexOffset, byteLength: quadIndexBytes.length, target: 34963 },
    ],
    accessors: [
      { bufferView: 0, componentType: 5126, count: cubePositions.length / 3, type: 'VEC3', min: [-0.5, -0.5, -0.5], max: [0.5, 0.5, 0.5] },
      { bufferView: 1, componentType: 5126, count: stridedPositions.length, type: 'VEC3' },
      { bufferView: 2, componentType: 5123, count: cubeIndices.length, type: 'SCALAR' },
      { bufferView: 3, componentType: 5123, count: quadIndices.length, type: 'SCALAR' },
    ],
    meshes: [
      { primitives: [{ attributes: { POSITION: 0 }, indices: 2 }] },
      { primitives: [{ attributes: { POSITION: 1 }, indices: 3 }] },
    ],
    nodes: [
      { mesh: 0, translation: [0, 0, 0] },
      { mesh: 0, translation: [2.4, 0.2, -0.4] },
      { mesh: 1, translation: [1, 0, 0], rotation: [0, 0, SQRT_HALF, SQRT_HALF] },
    ],
    scenes: [
      { nodes: [0, 1, 2] },
      { nodes: [2] },
      { nodes: [] },
    ],
    scene: 0,
  };

  const jsonBytes = padChunk(textEncoder.encode(JSON.stringify(json)));
  const binBytes = padChunk(binary, 0);
  const totalLength = 12 + 8 + jsonBytes.length + 8 + binBytes.length;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);
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

test('computeSceneBounds aggregates transformed nodes', () => {
  const glbBuffer = createTestGlb();
  const gltf = parseGLB(glbBuffer);
  const bounds = computeSceneBounds(gltf);
  assert.deepEqual(bounds.min.map((v) => Number(v.toFixed(6))), [-0.5, -2, -0.9]);
  assert.deepEqual(bounds.max.map((v) => Number(v.toFixed(6))), [2.9, 2, 0.5]);
  assert.deepEqual(bounds.size.map((v) => Number(v.toFixed(6))), [3.4, 4, 1.4]);
  assert.deepEqual(bounds.center.map((v) => Number(v.toFixed(6))), [1.2, 0, -0.2]);
  assert.ok(Math.abs(bounds.diagonal - Math.hypot(3.4, 4, 1.4)) < 1e-6);
});

test('computeSceneBounds respects explicit scene selection', () => {
  const glbBuffer = createTestGlb();
  const gltf = parseGLB(glbBuffer);
  const bounds = computeSceneBounds(gltf, { scene: 1 });
  assert.deepEqual(bounds.min.map((v) => Number(v.toFixed(6))), [0.5, -2, -0.5]);
  assert.deepEqual(bounds.max.map((v) => Number(v.toFixed(6))), [1.5, 2, 0.5]);
});

test('computeSceneBounds returns null when a scene has no geometry', () => {
  const glbBuffer = createTestGlb();
  const gltf = parseGLB(glbBuffer);
  const bounds = computeSceneBounds(gltf, { scene: 2 });
  assert.equal(bounds, null);
});

test('computeSceneBounds accepts raw ArrayBuffer input', () => {
  const glbBuffer = createTestGlb();
  const bounds = computeSceneBounds(glbBuffer, { scene: 1 });
  assert.deepEqual(bounds.min.map((v) => Number(v.toFixed(6))), [0.5, -2, -0.5]);
});

test('computeSceneAnalysis includes geometry stats for the default scene', () => {
  const glbBuffer = createTestGlb();
  const gltf = parseGLB(glbBuffer);
  const analysis = computeSceneAnalysis(gltf);
  assert.equal(analysis.stats.nodeCount, 3);
  assert.equal(analysis.stats.meshInstanceCount, 3);
  assert.equal(analysis.stats.primitiveCount, 3);
  assert.equal(analysis.stats.vertexCount, 20);
  assert.equal(analysis.stats.triangleCount, 26);
  assert.ok(analysis.bounds);
});

test('computeSceneAnalysis respects alternate scenes when reporting stats', () => {
  const glbBuffer = createTestGlb();
  const gltf = parseGLB(glbBuffer);
  const analysis = computeSceneAnalysis(gltf, { scene: 1 });
  assert.equal(analysis.stats.nodeCount, 1);
  assert.equal(analysis.stats.meshInstanceCount, 1);
  assert.equal(analysis.stats.primitiveCount, 1);
  assert.equal(analysis.stats.vertexCount, 4);
  assert.equal(analysis.stats.triangleCount, 2);
  assert.ok(analysis.bounds);
});

test('computeSceneAnalysis returns zeroed stats when a scene has no geometry', () => {
  const glbBuffer = createTestGlb();
  const gltf = parseGLB(glbBuffer);
  const analysis = computeSceneAnalysis(gltf, { scene: 2 });
  assert.equal(analysis.bounds, null);
  assert.deepEqual(analysis.stats, {
    nodeCount: 0,
    meshInstanceCount: 0,
    primitiveCount: 0,
    vertexCount: 0,
    triangleCount: 0,
  });
});
