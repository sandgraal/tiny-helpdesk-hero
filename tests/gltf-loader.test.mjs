import test from 'node:test';
import assert from 'node:assert/strict';

import { parseGLB } from '../src/game/gltf-loader.mjs';

const MAGIC = 0x46546c67;
const VERSION = 2;
const CHUNK_JSON = 0x4e4f534a;
const CHUNK_BIN = 0x004e4942;

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

test('parseGLB returns json and buffers for valid GLB', () => {
  const json = {
    asset: { version: '2.0' },
    buffers: [{ byteLength: 12 }],
  };
  const binary = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const glb = createGlb(json, binary);
  const parsed = parseGLB(glb);
  assert.equal(parsed.version, 2);
  assert.deepEqual(parsed.json.asset.version, '2.0');
  assert.equal(parsed.buffers.length, 1);
  assert.equal(parsed.buffers[0].byteLength, binary.length);
});

test('parseGLB throws when header is invalid', () => {
  const buffer = new ArrayBuffer(24);
  const view = new DataView(buffer);
  view.setUint32(0, 0x12345678, true);
  view.setUint32(4, VERSION, true);
  view.setUint32(8, 24, true);
  assert.throws(() => parseGLB(buffer), /Invalid GLB magic/);
});

test('parseGLB throws when JSON chunk is missing', () => {
  const arrayBuffer = new ArrayBuffer(20);
  const view = new DataView(arrayBuffer);
  view.setUint32(0, MAGIC, true);
  view.setUint32(4, VERSION, true);
  view.setUint32(8, 20, true);
  assert.throws(() => parseGLB(arrayBuffer), /JSON chunk/);
});
