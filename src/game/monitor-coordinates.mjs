/**
 * Utilities for translating pointer coordinates from the LittleJS screen canvas
 * into the milestone 2.6 monitor safe-area design space.
 */

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeRect(rect) {
  if (!rect) {
    return null;
  }
  const { x, y, width, height } = rect;
  if ([x, y, width, height].every(isFiniteNumber) && width >= 0 && height >= 0) {
    return { x, y, width, height };
  }
  return null;
}

function normalizeScale(scale) {
  if (!isFiniteNumber(scale) || scale <= 0) {
    return null;
  }
  return scale;
}

export function mapScreenPointToMonitor(point, layout) {
  const safeArea = normalizeRect(layout?.safeArea);
  const scale = normalizeScale(layout?.scale ?? 1);
  if (!safeArea || !scale) {
    return null;
  }

  const x = isFiniteNumber(point?.x) ? point.x : null;
  const y = isFiniteNumber(point?.y) ? point.y : null;
  if (x === null || y === null) {
    return null;
  }

  const localX = x - safeArea.x;
  const localY = y - safeArea.y;
  if (localX < 0 || localY < 0 || localX > safeArea.width || localY > safeArea.height) {
    return null;
  }

  const invScale = 1 / scale;
  return {
    x: localX * invScale,
    y: localY * invScale,
  };
}

export function createMonitorCoordinateMapper(layoutProvider) {
  const getLayout = typeof layoutProvider === 'function'
    ? layoutProvider
    : () => layoutProvider;

  return function map(point) {
    const layout = getLayout?.();
    return mapScreenPointToMonitor(point, layout);
  };
}

export default {
  mapScreenPointToMonitor,
  createMonitorCoordinateMapper,
};
