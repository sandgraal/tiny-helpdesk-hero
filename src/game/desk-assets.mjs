/**
 * Draws the desk scene using milestone 2.6 art assets with graceful fallbacks.
 */

import { drawRoundedRect, drawEllipse, hsl } from './draw-utils.mjs';
import { drawHero } from './hero-assets.mjs';
import { getImage } from './image-loader.mjs';
import { imageManifest } from './asset-manifest.mjs';
import { fitMonitorFrameToCanvas } from './blockout-metrics.mjs';

const assets = {
  wall: getImage(imageManifest.backgroundWall),
  window: getImage(imageManifest.backgroundWindow),
  silhouettes: getImage(imageManifest.backgroundSilhouettes),
  walkerFront: getImage(imageManifest.ambientCoworkerFront),
  walkerBack: getImage(imageManifest.ambientCoworkerBack),
  deskSurface: getImage(imageManifest.deskSurface),
  monitorFrame: getImage(imageManifest.monitorFrame),
  monitorScanlines: getImage(imageManifest.monitorScanlines),
  monitorBloom: getImage(imageManifest.monitorBloom),
  callIndicator: getImage(imageManifest.callIndicator),
  propMug: getImage(imageManifest.propMug),
  propNotes: getImage(imageManifest.propStickyNotes),
  propFigurine: getImage(imageManifest.propFigurine),
  propKeyboard: getImage(imageManifest.propKeyboardStrip),
  propChair: getImage(imageManifest.propChair),
  propLamp: getImage(imageManifest.propLamp),
  particlesSuccess: getImage(imageManifest.particlesSuccess),
  particlesFailure: getImage(imageManifest.particlesFailure),
  screenStatic: getImage(imageManifest.screenStatic),
};

function colorToRgba(color, alpha = 1) {
  if (!color) {
    return null;
  }
  const { r = 0, g = 0, b = 0 } = color;
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
}

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

function drawAmbientWalkers(ctx, width, deskTopY, { lowPower, dayProgress = 0.5 }) {
  if (!ctx?.save || lowPower) {
    return;
  }
  const time = nowSeconds();
  const drift = Math.sin(time * 0.6) * 18;
  const bob = Math.sin(time * 0.8) * 6;

  const duskBoost = Math.max(0, (dayProgress - 0.6) / 0.4);
  const middayEase = 1 - Math.min(1, Math.abs(dayProgress - 0.5) * 2);
  const backAlpha = 0.22 + duskBoost * 0.18;
  const frontAlpha = 0.2 + duskBoost * 0.24;
  const middayDimming = middayEase * 0.12;

  const backOpacity = Math.max(0.12, backAlpha - middayDimming * 0.5);
  const frontOpacity = Math.max(0.1, frontAlpha - middayDimming);

  const backTargetWidth = width * 0.18;
  drawProp(
    ctx,
    assets.walkerBack,
    width * 0.2 + drift * 0.3,
    deskTopY - 60 + bob * 0.5,
    backTargetWidth,
    { alpha: backOpacity },
  );
  drawProp(
    ctx,
    assets.walkerBack,
    width * 0.78 - drift * 0.2,
    deskTopY - 48 - bob * 0.3,
    backTargetWidth * 0.8,
    { alpha: backOpacity * 0.8 },
  );

  const frontTargetWidth = width * 0.16;
  drawProp(
    ctx,
    assets.walkerFront,
    width * 0.32 + drift,
    deskTopY - 24 + bob,
    frontTargetWidth,
    { alpha: frontOpacity },
  );
  drawProp(
    ctx,
    assets.walkerFront,
    width * 0.68 - drift * 0.6,
    deskTopY - 12 - bob,
    frontTargetWidth * 0.9,
    { alpha: frontOpacity * 0.85 },
  );
}

function applyDayTint(ctx, width, height, dayState = {}) {
  if (!ctx?.save) {
    return;
  }

  const { sky, window: windowTint, haze } = dayState;

  if (sky?.color && sky.alpha > 0) {
    const fill = colorToRgba(sky.color, 1);
    if (fill) {
      ctx.save();
      ctx.globalAlpha = sky.alpha;
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  if (haze?.color && haze.alpha > 0) {
    ctx.save();
    const gradient = ctx.createLinearGradient(0, height * 0.12, 0, height * 0.6);
    gradient.addColorStop(0, colorToRgba(haze.color, 0));
    gradient.addColorStop(1, colorToRgba(haze.color, 1));
    ctx.globalAlpha = haze.alpha;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height * 0.08, width, height * 0.6);
    ctx.restore();
  }

  if (windowTint?.color && windowTint.alpha > 0) {
    const fill = colorToRgba(windowTint.color, 1);
    if (fill) {
      ctx.save();
      ctx.globalAlpha = windowTint.alpha;
      ctx.globalCompositeOperation = 'lighter';
      const windowHeight = height * 0.5;
      ctx.fillStyle = fill;
      ctx.fillRect(0, height * 0.05, width, windowHeight);
      ctx.restore();
    }
  }
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

export function drawMonitorFrame(ctx, width, height, options = {}) {
  const { layout, ...coverage } = options ?? {};
  const layoutResult = layout ?? fitMonitorFrameToCanvas(width, height, coverage);

  if (!ctx?.save || !ctx?.drawImage) {
    return {
      ...layoutResult.safeArea,
      scale: layoutResult.scale,
      frame: layoutResult.frame,
    };
  }

  const { frame } = layoutResult;
  if (isReady(assets.monitorFrame)) {
    ctx.drawImage(assets.monitorFrame.image, frame.x, frame.y, frame.width, frame.height);
  } else {
    ctx.save();
    ctx.fillStyle = '#0B1220';
    const cornerRadius = Math.round(32 * layout.scale);
    drawRoundedRect(ctx, frame.x, frame.y, frame.width, frame.height, cornerRadius);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = Math.max(2, 6 * layout.scale);
    ctx.stroke();
    ctx.restore();
  }

  return {
    ...layoutResult.safeArea,
    scale: layoutResult.scale,
    frame: layoutResult.frame,
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
  const dayState = lighting.day ?? {};
  const dayProgress = dayState.progress ?? 0;
  const middayBoost = 1 - Math.min(1, Math.abs(dayProgress - 0.5) * 2);

  const windowAlphaBase = lighting.lowPower ? 0.35 : 0.55;
  const windowAlpha = windowAlphaBase + middayBoost * (lighting.lowPower ? 0.04 : 0.12);
  const silhouetteBase = lighting.lowPower ? 0.25 : 0.48;
  const eveningOffset = Math.max(0, dayProgress - 0.6) / 0.4;
  const silhouetteAlpha = Math.max(0.12, silhouetteBase - middayBoost * 0.18 + eveningOffset * 0.2);

  drawFullscreen(ctx, assets.wall, width, height, { offsetX: cameraOffset.x * -0.3, offsetY: cameraOffset.y * -0.2 });
  drawFullscreen(ctx, assets.window, width, height * 0.8, {
    offsetX: cameraOffset.x * -0.5,
    offsetY: cameraOffset.y * -0.4,
    scaleMultiplier: 1.02,
    alpha: windowAlpha,
  });
  drawFullscreen(ctx, assets.silhouettes, width, height, {
    offsetX: cameraOffset.x * -0.6,
    offsetY: cameraOffset.y * -0.5,
    alpha: silhouetteAlpha,
  });

  applyDayTint(ctx, width, height, dayState);

  const deskTopY = drawDeskSurface(ctx, width, height);
  drawAmbientWalkers(ctx, width, deskTopY, { lowPower: propsState.lowPower, dayProgress });

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
  const glow = lighting.glow;

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

  if (!lowPower && glow?.alpha > 0 && typeof ctx.createRadialGradient === 'function') {
    const centerX = frameRect.x + frameRect.width / 2;
    const centerY = frameRect.y + frameRect.height / 2;
    const innerRadius = Math.max(frameRect.width, frameRect.height) * 0.18;
    const outerRadius = Math.max(frameRect.width, frameRect.height) * 0.72;
    const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
    gradient.addColorStop(0, colorToRgba(glow.color ?? { r: 255, g: 255, b: 255 }, Math.min(1, glow.alpha * 1.4)));
    gradient.addColorStop(0.35, colorToRgba(glow.color ?? { r: 255, g: 255, b: 255 }, glow.alpha));
    gradient.addColorStop(1, colorToRgba(glow.color ?? { r: 255, g: 255, b: 255 }, 0));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 1;
    ctx.fillRect(frameRect.x - outerRadius * 0.1, frameRect.y - outerRadius * 0.1, frameRect.width + outerRadius * 0.2, frameRect.height + outerRadius * 0.2);
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
  ctx.globalAlpha = Math.min(0.45, alpha * 0.7);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export default {
  drawDesk,
  drawMonitorFrame,
  applyMonitorOverlays,
  drawStaticOverlay,
};
