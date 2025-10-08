/**
 * Desk scene renderer.
 * Applies empathy-driven ambient tints and monitor glow before/after blitting the UI texture.
 */

import { drawDesk, drawMonitorFrame, applyMonitorOverlays, drawStaticOverlay } from './desk-assets.mjs';

function toRgba({ r, g, b }, alpha) {
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

export function createDeskScene({ monitorDisplay, camera, lighting, props }) {
  function render({ context, canvasSize, renderState, settings }) {
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
    const postProcessingEnabled = !lowPower && (settings?.postProcessing ?? true);
    const lastSelection = propsState.lastSelection ?? null;
    const failureIntensity = propsState.failureIntensity ?? 0;

    context.clearRect(0, 0, width, height);

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
    drawDesk(context, width, height, propsState, {
      cameraOffset: offset,
      lighting: lightingState,
      renderState,
    });

    if (context.save) {
      context.save();
      if (context.translate && (offset.x !== 0 || offset.y !== 0)) {
        context.translate(offset.x * 0.4, offset.y * 0.4);
      }
      if (postProcessingEnabled && typeof context.filter === 'string') {
        context.filter = 'contrast(1.05) saturate(1.08) brightness(1.02)';
      }
      monitorDisplay.drawTo(context, {
        dx: frame?.x ?? 0,
        dy: frame?.y ?? 0,
        dWidth: frame?.width ?? width,
        dHeight: frame?.height ?? height,
      });
      context.restore();
    } else {
      monitorDisplay.drawTo(context, {
        dx: frame?.x ?? 0,
        dy: frame?.y ?? 0,
        dWidth: frame?.width ?? width,
        dHeight: frame?.height ?? height,
      });
    }

    // Bloom overlays now handled inside desk assets during monitor pass.

    applyMonitorOverlays(context, frame, propsState, {
      lighting: lightingState,
      renderState,
      settings,
    });

    drawStaticOverlay(context, width, height, failureIntensity);
  }

  return {
    render,
  };
}

export default createDeskScene;
