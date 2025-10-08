/**
 * Draws the desk scene using milestone 2.6 art assets with graceful fallbacks.
 */

import { drawRoundedRect, drawEllipse, hsl } from './draw-utils.mjs';
import { drawHero } from './hero-assets.mjs';
import { getImage } from './image-loader.mjs';

const assets = {
  wall: getImage('assets/background/background-wall.svg'),
  window: getImage('assets/background/background-window.svg'),
  silhouettes: getImage('assets/background/background-silhouettes.svg'),
  walkerFront: getImage('assets/background/ambient-coworker-front.svg'),
  walkerBack: getImage('assets/background/ambient-coworker-back.svg'),
  deskSurface: getImage('assets/desk-surface.svg'),
  monitorFrame: getImage('assets/ui/monitor-frame.svg'),
  monitorScanlines: getImage('assets/ui/monitor-scanlines.svg'),
  monitorBloom: getImage('assets/ui/monitor-bloom.svg'),
  callIndicator: getImage('assets/ui/incoming-call-indicator.svg'),
  propMug: getImage('assets/props/prop-mug.svg'),
  propNotes: getImage('assets/props/prop-sticky-notes.svg'),
  propFigurine: getImage('assets/props/prop-figurine.svg'),
  propKeyboard: getImage('assets/props/prop-keyboard-strip.svg'),
  propChair: getImage('assets/props/prop-chair.svg'),
  propLamp: getImage('assets/props/prop-lamp.svg'),
  particlesSuccess: getImage('assets/effects/particles-success.svg'),
  particlesFailure: getImage('assets/effects/particles-failure.svg'),
  screenStatic: getImage('assets/effects/screen-static.svg'),
};

const MONITOR_TOTAL = { width: 1100, height: 760 };
const MONITOR_INNER = { x: 80, y: 80, width: 940, height: 600 };

function isReady(resource) {
  return Boolean(resource?.ready && resource.image);
}

function nowSeconds() {
  if (typeof globalThis.performance?.now === 'function') {
    return globalThis.performance.now() / 1000;
  }
  return Date.now() / 1000;
}

function drawFullscreen(ctx, resource, width, height, {
  offsetX = 0,
  offsetY = 0,
  scaleMultiplier = 1,
  alpha = 1,
} = {}) {
  if (!ctx?.save || !isReady(resource)) {
    return false;
  }
  const img = resource.image;
  const scale = Math.max(width / img.width, height / img.height) * scaleMultiplier;
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const dx = (width - drawWidth) / 2 + offsetX;
  const dy = (height - drawHeight) / 2 + offsetY;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  ctx.restore();
  return true;
}

function drawStripFrame(ctx, resource, frameCount, timeSeconds, dx, dy, dWidth, dHeight, {
  fps = 7,
  alpha = 1,
  blend = 'lighter',
} = {}) {
  if (!ctx?.save || !isReady(resource) || frameCount <= 0) {
    return false;
  }
  const img = resource.image;
  const frameWidth = img.width / frameCount;
  const frameHeight = img.height;
  if (!frameWidth || !frameHeight) {
    return false;
  }
  const frame = Math.floor((timeSeconds * fps) % frameCount);
  ctx.save();
  ctx.globalAlpha = alpha;
  if (blend) {
    ctx.globalCompositeOperation = blend;
  }
  ctx.drawImage(
    img,
    frame * frameWidth,
    0,
    frameWidth,
    frameHeight,
    dx,
    dy,
    dWidth ?? frameWidth,
    dHeight ?? frameHeight,
  );
  ctx.restore();
  return true;
}

function drawProp(ctx, resource, centerX, baselineY, targetWidth, {
  rotation = 0,
  alpha = 1,
} = {}) {
  if (!ctx?.save || !isReady(resource) || !targetWidth) {
    return null;
  }
  const img = resource.image;
  const scale = targetWidth / img.width;
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, baselineY);
  if (rotation) {
    ctx.rotate(rotation);
  }
  ctx.drawImage(img, -drawWidth / 2, -drawHeight, drawWidth, drawHeight);
  ctx.restore();
  if (rotation !== 0) {
    return null;
  }
  return {
    x: centerX - drawWidth / 2,
    y: baselineY - drawHeight,
    width: drawWidth,
    height: drawHeight,
  };
}

function drawAmbientWalkers(ctx, width, deskTopY, { lowPower }) {
  if (!ctx?.save || lowPower) {
    return;
  }
  const time = nowSeconds();
  const drift = Math.sin(time * 0.6) * 18;
  const bob = Math.sin(time * 0.8) * 6;

  const backTargetWidth = width * 0.18;
  drawProp(
    ctx,
    assets.walkerBack,
    width * 0.2 + drift * 0.3,
    deskTopY - 60 + bob * 0.5,
    backTargetWidth,
    { alpha: 0.35 },
  );
  drawProp(
    ctx,
    assets.walkerBack,
    width * 0.78 - drift * 0.2,
    deskTopY - 48 - bob * 0.3,
    backTargetWidth * 0.8,
    { alpha: 0.28 },
  );

  const frontTargetWidth = width * 0.16;
  drawProp(
    ctx,
    assets.walkerFront,
    width * 0.32 + drift,
    deskTopY - 24 + bob,
    frontTargetWidth,
    { alpha: 0.32 },
  );
  drawProp(
    ctx,
    assets.walkerFront,
    width * 0.68 - drift * 0.6,
    deskTopY - 12 - bob,
    frontTargetWidth * 0.9,
    { alpha: 0.28 },
  );
}

function drawDeskSurface(ctx, width, height) {
  const defaultDeskHeight = Math.round(height * 0.34);
  const deskTopY = height - defaultDeskHeight;
  if (!ctx?.save) {
    return deskTopY;
  }
  if (isReady(assets.deskSurface)) {
    const img = assets.deskSurface.image;
    const scale = width / img.width;
    const drawHeight = img.height * scale;
    const dy = height - drawHeight;
    ctx.drawImage(img, 0, dy, width, drawHeight);
    return height - defaultDeskHeight;
  }
  ctx.fillStyle = '#223454';
  ctx.fillRect(0, deskTopY, width, defaultDeskHeight);
  ctx.fillStyle = '#2c416a';
  ctx.fillRect(0, deskTopY - 12, width, 12);
  ctx.fillStyle = '#1b283f';
  ctx.fillRect(0, deskTopY + defaultDeskHeight - 20, width, 20);
  return deskTopY;
}

export function drawMonitorFrame(ctx, width, height) {
  if (!ctx?.save) {
    return {
      x: Math.round(width * 0.1),
      y: Math.round(height * 0.16),
      width: Math.round(width * 0.8),
      height: Math.round(height * 0.6),
      scale: 1,
    };
  }

  const scale = Math.min((width * 0.86) / MONITOR_TOTAL.width, (height * 0.72) / MONITOR_TOTAL.height);
  const drawWidth = MONITOR_TOTAL.width * scale;
  const drawHeight = MONITOR_TOTAL.height * scale;
  const drawX = Math.round((width - drawWidth) / 2);
  const drawY = Math.round(height * 0.08);

  if (isReady(assets.monitorFrame)) {
    ctx.drawImage(assets.monitorFrame.image, drawX, drawY, drawWidth, drawHeight);
  } else {
    ctx.save();
    ctx.fillStyle = '#0B1220';
    drawRoundedRect(ctx, drawX, drawY, drawWidth, drawHeight, Math.round(32 * scale));
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = Math.max(2, 6 * scale);
    ctx.stroke();
    ctx.restore();
  }

  return {
    x: drawX + Math.round(MONITOR_INNER.x * scale),
    y: drawY + Math.round(MONITOR_INNER.y * scale),
    width: Math.round(MONITOR_INNER.width * scale),
    height: Math.round(MONITOR_INNER.height * scale),
    scale,
    frame: { x: drawX, y: drawY, width: drawWidth, height: drawHeight },
  };
}

export function drawDesk(ctx, width, height, propsState = {}, environment = {}) {
  if (!ctx) {
    return { deskTopY: height - Math.round(height * 0.34) };
  }

  const cameraOffset = environment.cameraOffset ?? { x: 0, y: 0 };
  const lighting = environment.lighting ?? {};
  const renderState = environment.renderState ?? {};
  const time = nowSeconds();

  drawFullscreen(ctx, assets.wall, width, height, { offsetX: cameraOffset.x * -0.3, offsetY: cameraOffset.y * -0.2 });
  drawFullscreen(ctx, assets.window, width, height * 0.8, { offsetX: cameraOffset.x * -0.5, offsetY: cameraOffset.y * -0.4, scaleMultiplier: 1.02, alpha: lighting.lowPower ? 0.4 : 0.65 });
  drawFullscreen(ctx, assets.silhouettes, width, height, { offsetX: cameraOffset.x * -0.6, offsetY: cameraOffset.y * -0.5, alpha: lighting.lowPower ? 0.32 : 0.5 });

  const deskTopY = drawDeskSurface(ctx, width, height);
  drawAmbientWalkers(ctx, width, deskTopY, { lowPower: propsState.lowPower });

  const heroBaseline = deskTopY + 6;
  const heroCenterX = width * 0.46 + cameraOffset.x * 0.08;

  drawProp(ctx, assets.propChair, heroCenterX - width * 0.12, heroBaseline + 12, width * 0.32, { alpha: 0.82 });

  drawHero(ctx, heroBaseline, width, propsState);

  const lampRect = drawProp(ctx, assets.propLamp, width * 0.72 + cameraOffset.x * 0.06, deskTopY - 20, width * 0.22, {
    alpha: 0.8 + (lighting.ratio ?? 0) * 0.1,
  });

  const keyboardRect = drawProp(ctx, assets.propKeyboard, heroCenterX + width * 0.04, deskTopY + 28, width * 0.48, { alpha: 0.92 });

  const mugRect = drawProp(ctx, assets.propMug, heroCenterX - width * 0.1, deskTopY + 10, width * 0.12, {
    alpha: 0.88 + (propsState.mugTemperature ?? 0) * 0.08,
  });

  const notesFlutter = (propsState.noteFlutter ?? 0.5) - 0.5;
  drawProp(ctx, assets.propNotes, heroCenterX + width * 0.24, deskTopY + 18, width * 0.16, {
    rotation: notesFlutter * 0.25,
    alpha: 0.88,
  });

  drawProp(ctx, assets.propFigurine, heroCenterX + width * 0.32, deskTopY + 6, width * 0.14, {
    alpha: 0.82 + (lighting.ratio ?? 0) * 0.12,
  });

  const celebration = propsState.heroCelebration ?? 0;
  const failureIntensity = propsState.failureIntensity ?? 0;

  if (!propsState.lowPower && celebration > 0.3) {
    drawStripFrame(
      ctx,
      assets.particlesSuccess,
      4,
      time,
      heroCenterX - width * 0.08,
      deskTopY - width * 0.12,
      width * 0.18,
      width * 0.08,
      { alpha: 0.7 + celebration * 0.2 },
    );
  }

  if (!propsState.lowPower && failureIntensity > 0.1) {
    drawStripFrame(
      ctx,
      assets.particlesFailure,
      4,
      time * 0.8,
      heroCenterX + width * 0.18,
      deskTopY - width * 0.02,
      width * 0.16,
      width * 0.06,
      { alpha: Math.min(0.6, 0.25 + failureIntensity * 0.8), blend: 'screen' },
    );
  }

  if (keyboardRect && ctx.save) {
    const hue = propsState.ledHue ?? (lighting.ratio ?? 0) * 120 + 180;
    const gradient = ctx.createLinearGradient(keyboardRect.x, keyboardRect.y, keyboardRect.x + keyboardRect.width, keyboardRect.y);
    gradient.addColorStop(0, hsl((hue - 40) % 360, 80, 58));
    gradient.addColorStop(1, hsl((hue + 30) % 360, 78, 62));
    ctx.save();
    ctx.globalAlpha = propsState.lowPower ? 0.18 : 0.45;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.fillRect(
      keyboardRect.x + keyboardRect.width * 0.08,
      keyboardRect.y + keyboardRect.height * 0.4,
      keyboardRect.width * 0.84,
      keyboardRect.height * 0.38,
    );
    ctx.restore();
  }

  if (mugRect && ctx.save) {
    const warmth = Math.min(Math.max(propsState.mugTemperature ?? 0, 0), 1);
    ctx.save();
    ctx.globalAlpha = 0.3 + warmth * 0.4;
    ctx.fillStyle = hsl(18 + warmth * 42, 72, 56);
    ctx.fillRect(
      mugRect.x + mugRect.width * 0.2,
      mugRect.y + mugRect.height * 0.32,
      mugRect.width * 0.6,
      mugRect.height * 0.48,
    );
    ctx.restore();
  }

  if (lampRect && ctx.save) {
    const intensity = propsState.lowPower ? 0.35 : 0.55 + (lighting.ratio ?? 0) * 0.25;
    ctx.save();
    ctx.globalAlpha = intensity;
    ctx.globalCompositeOperation = 'lighter';
    const radius = lampRect.width * 0.6;
    const gradient = ctx.createRadialGradient(
      lampRect.x + lampRect.width / 2,
      lampRect.y + lampRect.height * 0.2,
      radius * 0.2,
      lampRect.x + lampRect.width / 2,
      lampRect.y + lampRect.height * 0.2,
      radius,
    );
    gradient.addColorStop(0, 'rgba(255, 209, 102, 0.75)');
    gradient.addColorStop(1, 'rgba(124, 240, 217, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(lampRect.x - radius, lampRect.y - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  return { deskTopY };
}

export function applyMonitorOverlays(ctx, frameRect, propsState = {}, environment = {}) {
  if (!ctx?.save || !frameRect) {
    return;
  }
  const lowPower = propsState.lowPower ?? environment.lowPower ?? false;
  const lighting = environment.lighting ?? {};
  const renderState = environment.renderState ?? {};
  const time = nowSeconds();

  if (!lowPower && isReady(assets.monitorBloom)) {
    ctx.save();
    ctx.globalAlpha = 0.25 + (lighting.ratio ?? 0) * 0.35;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(
      assets.monitorBloom.image,
      frameRect.x,
      frameRect.y,
      frameRect.width,
      frameRect.height,
    );
    ctx.restore();
  }

  if (!lowPower && isReady(assets.monitorScanlines)) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.drawImage(
      assets.monitorScanlines.image,
      frameRect.x,
      frameRect.y,
      frameRect.width,
      frameRect.height,
    );
    ctx.restore();
  }

  const showCallIndicator = Boolean(renderState.call && !renderState.isComplete);
  if (showCallIndicator && isReady(assets.callIndicator)) {
    const pulse = 0.6 + Math.max(0, Math.sin(time * 4)) * 0.4;
    const indicatorSize = Math.min(frameRect.width, frameRect.height) * 0.12;
    const dx = frameRect.x + frameRect.width - indicatorSize * 0.68;
    const dy = frameRect.y + indicatorSize * 0.25;
    ctx.save();
    ctx.globalAlpha = lowPower ? 0.4 : pulse;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(assets.callIndicator.image, dx, dy, indicatorSize, indicatorSize);
    ctx.restore();
  }
}

export function drawStaticOverlay(ctx, width, height, intensity) {
  if (!ctx?.save || intensity <= 0) {
    return;
  }
  const time = nowSeconds();
  const alpha = Math.min(0.75, intensity * 1.1);
  if (drawStripFrame(
    ctx,
    assets.screenStatic,
    4,
    time,
    0,
    0,
    width,
    height,
    { fps: 9, alpha, blend: 'screen' },
  )) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = alpha * 0.6;
  for (let y = 0; y < height; y += 4) {
    const value = Math.floor(160 + Math.random() * 80);
    ctx.fillStyle = `rgba(${value}, ${value}, ${value}, 0.4)`;
    ctx.fillRect(0, y, width, 2);
  }
  ctx.restore();
}

export default {
  drawDesk,
  drawMonitorFrame,
  applyMonitorOverlays,
  drawStaticOverlay,
};
