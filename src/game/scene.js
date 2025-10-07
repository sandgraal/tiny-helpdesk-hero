/**
 * Desk scene renderer.
 * Applies empathy-driven ambient tints and monitor glow before/after blitting the UI texture.
 */

const WARM_COLOR = { r: 255, g: 214, b: 102 };
const COOL_COLOR = { r: 64, g: 102, b: 142 };
const GLOW_COLOR = { r: 255, g: 244, b: 224 };

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toRgba({ r, g, b }, alpha) {
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

function computeLighting({ renderState, lowPower }) {
  const empathyScore = renderState?.empathyScore ?? 0;
  const callCount = renderState?.callCount ?? 0;
  const ratio = callCount > 0 ? clamp(empathyScore / callCount, 0, 1) : 0;
  const cool = 1 - ratio;

  const warmAlpha = lowPower ? 0.05 + ratio * 0.12 : 0.1 + ratio * 0.32;
  const coolAlpha = lowPower ? 0.04 + cool * 0.1 : 0.08 + cool * 0.24;
  const glowAlpha = lowPower ? ratio * 0.06 : 0.12 + ratio * 0.3;

  return {
    ratio,
    warmAlpha,
    coolAlpha,
    glowAlpha,
  };
}

export function createDeskScene({ monitorDisplay, camera }) {
  function render({ context, canvasSize, renderState }) {
    if (!context || !monitorDisplay) {
      return;
    }
    const { width = 640, height = 360 } = canvasSize ?? {};
    const cameraState = camera?.getState?.();
    const offset = cameraState?.offset ?? { x: 0, y: 0 };
    const lowPower = cameraState?.lowPower ?? false;
    const lighting = computeLighting({ renderState, lowPower });

    if (context.save) {
      context.save();
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = toRgba(COOL_COLOR, lighting.coolAlpha);
      context.fillRect(0, 0, width, height);
      context.fillStyle = toRgba(WARM_COLOR, lighting.warmAlpha);
      context.fillRect(0, 0, width, height);
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

    if (!lowPower && lighting.glowAlpha > 0 && context.save) {
      context.save();
      context.globalCompositeOperation = 'lighter';
      const inset = Math.round(Math.min(width, height) * 0.05);
      context.fillStyle = toRgba(GLOW_COLOR, lighting.glowAlpha);
      context.fillRect(inset, inset, width - inset * 2, height - inset * 2);
      context.restore();
    }
  }

  return {
    render,
  };
}

export default createDeskScene;
