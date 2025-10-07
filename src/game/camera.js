/**
 * Camera state manager for the over-the-shoulder desk scene.
 * Handles parallax offsets driven by pointer movement and low-power toggles.
 */

const DEFAULT_PARALLAX = { x: 4, y: 2 };

export function createCameraState({
  parallax = DEFAULT_PARALLAX,
} = {}) {
  const strength = {
    x: Number.isFinite(parallax.x) ? parallax.x : DEFAULT_PARALLAX.x,
    y: Number.isFinite(parallax.y) ? parallax.y : DEFAULT_PARALLAX.y,
  };

  let offset = { x: 0, y: 0 };
  let lowPower = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function update({ pointer, canvasSize } = {}) {
    if (lowPower) {
      offset = { x: 0, y: 0 };
      return;
    }
    const width = canvasSize?.width ?? 0;
    const height = canvasSize?.height ?? 0;
    if (!pointer || !width || !height) {
      offset = { x: 0, y: 0 };
      return;
    }

    const normX = clamp(pointer.x / width, 0, 1) * 2 - 1; // -1 .. 1
    const normY = clamp(pointer.y / height, 0, 1) * 2 - 1;

    offset = {
      x: clamp(normX * strength.x, -strength.x, strength.x),
      y: clamp(normY * strength.y, -strength.y, strength.y),
    };
  }

  function setLowPower(flag) {
    lowPower = Boolean(flag);
    if (lowPower) {
      offset = { x: 0, y: 0 };
    }
  }

  function getState() {
    return {
      offset: { ...offset },
      lowPower,
      parallax: { ...strength },
    };
  }

  return {
    update,
    setLowPower,
    getState,
  };
}

export default createCameraState;
