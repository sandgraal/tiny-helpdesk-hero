/**
 * Desk scene renderer.
 * Applies empathy-driven ambient tints and monitor glow before/after blitting the UI texture.
 */

function toRgba({ r, g, b }, alpha) {
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

export function createDeskScene({ monitorDisplay, camera, lighting }) {
  function render({ context, canvasSize }) {
    if (!context || !monitorDisplay) {
      return;
    }
    const { width = 640, height = 360 } = canvasSize ?? {};
    const cameraState = camera?.getState?.() ?? {};
    const lightingState = lighting?.getAmbientLayers?.() ?? {};
    const offset = cameraState.offset ?? { x: 0, y: 0 };
    const layers = lightingState.layers ?? [];
    const glow = lightingState.glow;
    const lowPower = cameraState.lowPower ?? false;

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

    context.save?.();
    if (context.translate && (offset.x !== 0 || offset.y !== 0)) {
      context.translate(offset.x, offset.y);
    }
    monitorDisplay.drawTo(context, {
      dx: 0,
      dy: 0,
      dWidth: width,
      dHeight: height,
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
  }

  return {
    render,
  };
}

export default createDeskScene;
