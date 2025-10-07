/**
 * Desk scene renderer.
 * Applies empathy-driven ambient tints and monitor glow before/after blitting the UI texture.
 */

import { drawDesk, drawMonitorFrame } from './desk-assets.js';

function toRgba({ r, g, b }, alpha) {
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

function drawStaticOverlay(context, width, height, intensity) {
  if (!context?.save || intensity <= 0) {
    return;
  }
  const clamped = Math.min(Math.max(intensity, 0), 0.6);
  context.save();
  context.globalAlpha = clamped;
  for (let y = 0; y < height; y += 4) {
    const value = Math.floor(160 + Math.random() * 80);
    context.fillStyle = `rgba(${value}, ${value}, ${value}, 0.35)`;
    context.fillRect(0, y, width, 2);
  }
  context.restore();
}

export function createDeskScene({ monitorDisplay, camera, lighting, props }) {
  function render({ context, canvasSize }) {
    if (!context || !monitorDisplay) {
      return;
    }
    const { width = 640, height = 360 } = canvasSize ?? {};
    const cameraState = camera?.getState?.() ?? {};
    const lightingState = lighting?.getAmbientLayers?.() ?? {};
    const propsState = props?.getState?.() ?? {};
    const offset = cameraState.offset ?? { x: 0, y: 0 };
    const layers = lightingState.layers ?? [];
    const glow = lightingState.glow;
    const lowPower = cameraState.lowPower ?? false;
    const lastSelection = propsState.lastSelection ?? null;
    const failureIntensity = propsState.failureIntensity ?? 0;

    if (context.save) {
      context.save();
      context.globalCompositeOperation = 'source-over';
      layers.forEach((layer) => {
        if (!layer || !layer.color || !layer.alpha) {
          return;
        }
        context.fillStyle = toRgba(layer.color, layer.alpha);
        context.fillRect(0, 0, width, height);
      });
      context.restore();
    }

    const frame = drawMonitorFrame(context, width, height);
    drawDesk(context, width, height, propsState);

    context.save?.();
    if (context.translate && (offset.x !== 0 || offset.y !== 0)) {
      context.translate(offset.x * 0.4, offset.y * 0.4);
    }
    monitorDisplay.drawTo(context, {
      dx: frame?.x ?? 0,
      dy: frame?.y ?? 0,
      dWidth: frame?.width ?? width,
      dHeight: frame?.height ?? height,
    });
    context.restore?.();

    if (!lowPower && glow?.alpha > 0 && context.save) {
      context.save();
      context.globalCompositeOperation = 'lighter';
      const inset = Math.round(Math.min(width, height) * 0.05);
      context.fillStyle = toRgba(glow.color ?? { r: 255, g: 255, b: 255 }, glow.alpha);
      context.fillRect(inset, inset, width - inset * 2, height - inset * 2);
      context.restore();
    }

    drawStaticOverlay(context, width, height, failureIntensity);
  }

  return {
    render,
  };
}

export default createDeskScene;
