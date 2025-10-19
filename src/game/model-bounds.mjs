/**
 * Computes world-space bounding boxes for GLTF scenes using parsed GLB data.
 * The implementation focuses on position attributes to verify that imported
 * hero/desk assets adhere to the milestone 2.6 blockout metrics.
 */

import { parseGLB } from './gltf-loader.mjs';

const IDENTITY_MATRIX = Object.freeze([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]);

const COMPONENT_BYTE_SIZE = {
  5120: 1, // BYTE
  5121: 1, // UNSIGNED_BYTE
  5122: 2, // SHORT
  5123: 2, // UNSIGNED_SHORT
  5125: 4, // UNSIGNED_INT
  5126: 4, // FLOAT
};

const COMPONENT_READERS = {
  5120: (view, offset) => view.getInt8(offset),
  5121: (view, offset) => view.getUint8(offset),
  5122: (view, offset, littleEndian) => view.getInt16(offset, littleEndian),
  5123: (view, offset, littleEndian) => view.getUint16(offset, littleEndian),
  5125: (view, offset, littleEndian) => view.getUint32(offset, littleEndian),
  5126: (view, offset, littleEndian) => view.getFloat32(offset, littleEndian),
};

const COMPONENT_NORMALIZED_DENOMINATORS = {
  5120: 127,
  5121: 255,
  5122: 32767,
  5123: 65535,
  5125: 4294967295,
  5126: 1,
};

const TYPE_COMPONENT_COUNT = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

const LITTLE_ENDIAN = true;

function cloneMatrix(source) {
  return source.slice();
}

function multiplyMatrices(a, b) {
  const out = new Array(16);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      out[col + row * 4] =
        a[row * 4 + 0] * b[col + 0] +
        a[row * 4 + 1] * b[col + 4] +
        a[row * 4 + 2] * b[col + 8] +
        a[row * 4 + 3] * b[col + 12];
    }
  }
  return out;
}

function composeMatrix({ translation = [0, 0, 0], rotation = [0, 0, 0, 1], scale = [1, 1, 1], matrix }) {
  if (Array.isArray(matrix) && matrix.length === 16) {
    return matrix.slice();
  }

  const [tx, ty, tz] = translation;
  const [qx, qy, qz, qw] = rotation;
  const [sx, sy, sz] = scale;

  const x2 = qx + qx;
  const y2 = qy + qy;
  const z2 = qz + qz;

  const xx = qx * x2;
  const yy = qy * y2;
  const zz = qz * z2;
  const xy = qx * y2;
  const xz = qx * z2;
  const yz = qy * z2;
  const wx = qw * x2;
  const wy = qw * y2;
  const wz = qw * z2;

  return [
    (1 - (yy + zz)) * sx,
    (xy + wz) * sx,
    (xz - wy) * sx,
    0,
    (xy - wz) * sy,
    (1 - (xx + zz)) * sy,
    (yz + wx) * sy,
    0,
    (xz + wy) * sz,
    (yz - wx) * sz,
    (1 - (xx + yy)) * sz,
    0,
    tx,
    ty,
    tz,
    1,
  ];
}

function transformPoint(matrix, point) {
  const [x, y, z] = point;
  return [
    matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
    matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
    matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14],
  ];
}

function mergeBounds(target, source) {
  if (!source) {
    return target;
  }
  if (!target) {
    return {
      min: source.min.slice(),
      max: source.max.slice(),
    };
  }
  for (let i = 0; i < 3; i += 1) {
    target.min[i] = Math.min(target.min[i], source.min[i]);
    target.max[i] = Math.max(target.max[i], source.max[i]);
  }
  return target;
}

function accessorComponentCount(type) {
  const count = TYPE_COMPONENT_COUNT[type];
  if (!count) {
    throw new Error(`Unsupported accessor type: ${type}`);
  }
  return count;
}

function readAccessorValues(gltf, accessorIndex) {
  const accessor = gltf.json.accessors?.[accessorIndex];
  if (!accessor) {
    throw new Error(`Accessor ${accessorIndex} not found.`);
  }
  const componentCount = accessorComponentCount(accessor.type);
  const componentSize = COMPONENT_BYTE_SIZE[accessor.componentType];
  if (!componentSize) {
    throw new Error(`Unsupported component type ${accessor.componentType}.`);
  }

  const bufferView = gltf.json.bufferViews?.[accessor.bufferView];
  if (!bufferView) {
    throw new Error(`Buffer view ${accessor.bufferView} not found for accessor ${accessorIndex}.`);
  }
  const buffer = gltf.buffers?.[bufferView.buffer];
  if (!(buffer instanceof ArrayBuffer)) {
    throw new Error(`Buffer ${bufferView.buffer} missing for accessor ${accessorIndex}.`);
  }

  const byteOffset = (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const stride = bufferView.byteStride ?? componentSize * componentCount;
  const values = new Float32Array(accessor.count * componentCount);
  const view = new DataView(buffer);
  const reader = COMPONENT_READERS[accessor.componentType];
  const denominator = accessor.normalized ? COMPONENT_NORMALIZED_DENOMINATORS[accessor.componentType] : 1;

  for (let index = 0; index < accessor.count; index += 1) {
    let offset = byteOffset + index * stride;
    for (let component = 0; component < componentCount; component += 1) {
      let value = reader(view, offset, LITTLE_ENDIAN);
      if (accessor.normalized && denominator > 1) {
        if (accessor.componentType === 5120 || accessor.componentType === 5122) {
          value = Math.max(value / denominator, -1);
        } else {
          value /= denominator;
        }
      }
      values[index * componentCount + component] = value;
      offset += componentSize;
    }
  }

  return values;
}

function accessorBounds(gltf, accessorIndex) {
  const accessor = gltf.json.accessors?.[accessorIndex];
  if (!accessor) {
    throw new Error(`Accessor ${accessorIndex} not found.`);
  }

  if (Array.isArray(accessor.min) && Array.isArray(accessor.max)) {
    return {
      min: accessor.min.slice(0, 3),
      max: accessor.max.slice(0, 3),
    };
  }

  const values = readAccessorValues(gltf, accessorIndex);
  const componentCount = accessorComponentCount(accessor.type);
  const min = new Array(componentCount).fill(Number.POSITIVE_INFINITY);
  const max = new Array(componentCount).fill(Number.NEGATIVE_INFINITY);
  for (let i = 0; i < values.length; i += componentCount) {
    for (let c = 0; c < componentCount; c += 1) {
      const value = values[i + c];
      if (value < min[c]) {
        min[c] = value;
      }
      if (value > max[c]) {
        max[c] = value;
      }
    }
  }
  return { min, max };
}

function primitiveBounds(gltf, primitive) {
  const positionAccessorIndex = primitive?.attributes?.POSITION;
  if (typeof positionAccessorIndex !== 'number') {
    return null;
  }
  const bounds = accessorBounds(gltf, positionAccessorIndex);
  if (!bounds) {
    return null;
  }
  return {
    min: bounds.min.slice(0, 3),
    max: bounds.max.slice(0, 3),
  };
}

function transformBounds(matrix, bounds) {
  if (!bounds) {
    return null;
  }
  const corners = [
    [bounds.min[0], bounds.min[1], bounds.min[2]],
    [bounds.min[0], bounds.min[1], bounds.max[2]],
    [bounds.min[0], bounds.max[1], bounds.min[2]],
    [bounds.min[0], bounds.max[1], bounds.max[2]],
    [bounds.max[0], bounds.min[1], bounds.min[2]],
    [bounds.max[0], bounds.min[1], bounds.max[2]],
    [bounds.max[0], bounds.max[1], bounds.min[2]],
    [bounds.max[0], bounds.max[1], bounds.max[2]],
  ];
  const transformed = corners.map((point) => transformPoint(matrix, point));
  const min = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
  const max = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
  for (const point of transformed) {
    for (let i = 0; i < 3; i += 1) {
      min[i] = Math.min(min[i], point[i]);
      max[i] = Math.max(max[i], point[i]);
    }
  }
  return { min, max };
}

function traverseNodeBounds(gltf, nodeIndex, parentMatrix, accumulator) {
  const node = gltf.json.nodes?.[nodeIndex];
  if (!node) {
    return accumulator;
  }
  const localMatrix = composeMatrix(node);
  const worldMatrix = parentMatrix ? multiplyMatrices(parentMatrix, localMatrix) : localMatrix;

  if (typeof node.mesh === 'number') {
    const mesh = gltf.json.meshes?.[node.mesh];
    if (mesh?.primitives) {
      for (const primitive of mesh.primitives) {
        const localBounds = primitiveBounds(gltf, primitive);
        const worldBounds = transformBounds(worldMatrix, localBounds);
        accumulator = mergeBounds(accumulator, worldBounds);
      }
    }
  }

  if (Array.isArray(node.children)) {
    for (const childIndex of node.children) {
      accumulator = traverseNodeBounds(gltf, childIndex, worldMatrix, accumulator);
    }
  }
  return accumulator;
}

function finalizeBounds(bounds) {
  if (!bounds) {
    return null;
  }
  const size = [
    bounds.max[0] - bounds.min[0],
    bounds.max[1] - bounds.min[1],
    bounds.max[2] - bounds.min[2],
  ];
  const center = [
    bounds.min[0] + size[0] / 2,
    bounds.min[1] + size[1] / 2,
    bounds.min[2] + size[2] / 2,
  ];
  const diagonal = Math.hypot(size[0], size[1], size[2]);
  return {
    min: bounds.min,
    max: bounds.max,
    size,
    center,
    diagonal,
  };
}

/**
 * Computes the world-space bounding box for the specified scene. Accepts either
 * a parsed GLB structure or a raw ArrayBuffer (which will be parsed lazily).
 */
export function computeSceneBounds(gltfOrBuffer, options = {}) {
  const gltf = gltfOrBuffer instanceof ArrayBuffer ? parseGLB(gltfOrBuffer) : gltfOrBuffer;
  if (!gltf?.json) {
    throw new Error('computeSceneBounds expected parsed GLB data.');
  }
  const sceneIndex = options.scene ?? gltf.json.scene ?? 0;
  const scene = gltf.json.scenes?.[sceneIndex];
  if (!scene) {
    throw new Error(`Scene index ${sceneIndex} not found in GLTF.`);
  }
  let bounds = null;
  if (Array.isArray(scene.nodes)) {
    for (const nodeIndex of scene.nodes) {
      bounds = traverseNodeBounds(gltf, nodeIndex, cloneMatrix(IDENTITY_MATRIX), bounds);
    }
  }
  return finalizeBounds(bounds);
}

export default {
  computeSceneBounds,
};
