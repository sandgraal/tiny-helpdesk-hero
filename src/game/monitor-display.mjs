/**
 * Creates an off-screen canvas used to project the UI inside the hero's monitor.
 * Handles device-pixel scaling, resize logic, and blitting the texture to a target context.
 */

function createCanvas(width, height, dpr) {
  const scaledWidth = Math.max(1, Math.round(width * dpr));
  const scaledHeight = Math.max(1, Math.round(height * dpr));

  if (typeof globalThis.OffscreenCanvas === 'function') {
    const offscreen = new globalThis.OffscreenCanvas(scaledWidth, scaledHeight);
    return { canvas: offscreen, context: offscreen.getContext('2d') };
  }

  const doc = globalThis.document;
  if (doc?.createElement) {
    const canvas = doc.createElement('canvas');
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    return { canvas, context: canvas.getContext('2d') };
  }

  return { canvas: null, context: null };
}

function configureContext(context, dpr) {
  if (!context) {
    return;
  }
  if (typeof context.resetTransform === 'function') {
    context.resetTransform();
  }
  if (dpr !== 1 && typeof context.scale === 'function') {
    context.scale(dpr, dpr);
  }
}

export function createMonitorDisplay({
  width = 640,
  height = 360,
  devicePixelRatio = globalThis.devicePixelRatio || 1,
} = {}) {
  const dpr = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  let logicalWidth = width;
  let logicalHeight = height;

  const internal = createCanvas(logicalWidth, logicalHeight, dpr);
  let { canvas, context } = internal;

  configureContext(context, dpr);

  function resize(nextWidth, nextHeight) {
    if (!canvas || !context) {
      logicalWidth = nextWidth ?? logicalWidth;
      logicalHeight = nextHeight ?? logicalHeight;
      return;
    }

    logicalWidth = Math.max(1, Math.round(nextWidth ?? logicalWidth));
    logicalHeight = Math.max(1, Math.round(nextHeight ?? logicalHeight));

    const scaledWidth = Math.max(1, Math.round(logicalWidth * dpr));
    const scaledHeight = Math.max(1, Math.round(logicalHeight * dpr));

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    configureContext(context, dpr);
  }

  function clear(color = null) {
    if (!context) {
      return;
    }
    context.clearRect(0, 0, logicalWidth, logicalHeight);
    if (color) {
      const previous = context.fillStyle;
      context.fillStyle = color;
      context.fillRect(0, 0, logicalWidth, logicalHeight);
      context.fillStyle = previous;
    }
  }

  function drawTo(targetContext, {
    dx = 0,
    dy = 0,
    dWidth = logicalWidth,
    dHeight = logicalHeight,
  } = {}) {
    if (!targetContext || !canvas) {
      return;
    }
    try {
      targetContext.drawImage(canvas, dx, dy, dWidth, dHeight);
    } catch (error) {
      console.warn('[MonitorDisplay] Failed to draw monitor texture', error);
    }
  }

  function getContext() {
    return context;
  }

  function getCanvas() {
    return canvas;
  }

  function setContextTransform(transform) {
    if (!context || typeof context.setTransform !== 'function') {
      return;
    }
    context.setTransform(transform.a ?? 1, transform.b ?? 0, transform.c ?? 0, transform.d ?? 1, transform.e ?? 0, transform.f ?? 0);
  }

  return {
    resize,
    clear,
    drawTo,
    getContext,
    getCanvas,
    setContextTransform,
    getSize() {
      return { width: logicalWidth, height: logicalHeight, devicePixelRatio: dpr };
    },
  };
}

export default createMonitorDisplay;
