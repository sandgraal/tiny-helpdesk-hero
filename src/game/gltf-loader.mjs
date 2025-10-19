/**
 * Minimal GLB (glTF 2.0 binary) loader used by milestone 2.6 tooling.
 *
 * The parser intentionally focuses on the subset of the specification we need
 * for asset verification: JSON and binary chunk extraction with no external
 * buffer or image resolution.  The resulting object mirrors the structure used
 * by the high-poly validation scripts so both browser and Node environments can
 * share the same implementation.
 */

const GLB_MAGIC = 0x46546c67; // 'glTF'
const GLB_VERSION_SUPPORTED = 2;
const CHUNK_TYPE_JSON = 0x4e4f534a; // 'JSON'
const CHUNK_TYPE_BIN = 0x004e4942; // 'BIN\0'

const textDecoder = new TextDecoder();

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function alignPaddedLength(length) {
  const remainder = length % 4;
  return remainder === 0 ? length : length + (4 - remainder);
}

/**
 * Parses the provided GLB (glTF binary) ArrayBuffer and returns the embedded
 * JSON description and binary buffer chunks.
 */
export function parseGLB(arrayBuffer) {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    throw new TypeError('parseGLB expects an ArrayBuffer.');
  }

  const view = new DataView(arrayBuffer);
  assert(view.byteLength >= 12, 'GLB buffer too small to contain header.');

  const magic = view.getUint32(0, true);
  assert(magic === GLB_MAGIC, 'Invalid GLB magic header.');

  const version = view.getUint32(4, true);
  assert(
    version === GLB_VERSION_SUPPORTED,
    `Unsupported GLB version ${version}; expected ${GLB_VERSION_SUPPORTED}.`,
  );

  const fileLength = view.getUint32(8, true);
  assert(fileLength === view.byteLength, 'GLB length mismatch.');

  let offset = 12;
  let json = null;
  const buffers = [];

  while (offset + 8 <= view.byteLength) {
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    offset += 8;

    assert(offset + chunkLength <= view.byteLength, 'GLB chunk length exceeds buffer.');

    const chunkData = arrayBuffer.slice(offset, offset + chunkLength);
    offset += alignPaddedLength(chunkLength);

    if (chunkType === CHUNK_TYPE_JSON) {
      const jsonText = textDecoder.decode(chunkData);
      json = JSON.parse(jsonText.trimEnd());
    } else if (chunkType === CHUNK_TYPE_BIN) {
      buffers.push(chunkData);
    }
  }

  assert(json, 'GLB file did not contain a JSON chunk.');

  return {
    version,
    json,
    buffers,
  };
}

/**
 * Fetches a GLB from a URL (browser or Node with fetch available) and returns
 * the parsed structure.
 */
export async function loadGLB(url, fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required to load GLB data.');
  }
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch GLB: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return parseGLB(arrayBuffer);
}

export default {
  parseGLB,
  loadGLB,
};
