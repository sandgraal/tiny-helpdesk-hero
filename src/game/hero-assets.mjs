/**
 * Hero drawing utilities backed by milestone 2.6 sprite art.
 * Falls back to procedural silhouette if assets are still loading.
 */

import { drawRoundedRect, drawEllipse, hsl } from './draw-utils.mjs';
import { getImage } from './image-loader.mjs';
import { imageManifest } from './asset-manifest.mjs';

const heroSprites = {
  idle: getImage(imageManifest.heroIdle),
  typing: getImage(imageManifest.heroTyping),
  stretch: getImage(imageManifest.heroStretch),
  lean: getImage(imageManifest.heroLean),
  nod: getImage(imageManifest.heroNod),
  celebrate: getImage(imageManifest.heroCelebrate),
};

let loggedFallback = false;

function isReady(resource) {
  return Boolean(resource?.ready && resource.image);
}

function selectHeroSprite(propsState) {
  const celebration = propsState?.heroCelebration ?? 0;
  const posture = propsState?.heroPosture ?? 0.5;
  const flutter = propsState?.noteFlutter ?? 0;
  const incorrect = propsState?.lastSelection?.correct === false;

  if (celebration > 0.55 && isReady(heroSprites.celebrate)) {
    return heroSprites.celebrate;
  }
  if (flutter > 0.68 && isReady(heroSprites.typing)) {
    return heroSprites.typing;
  }
  if (posture > 0.78 && isReady(heroSprites.stretch)) {
    return heroSprites.stretch;
  }
  if ((incorrect || posture < 0.42) && isReady(heroSprites.lean)) {
    return heroSprites.lean;
  }
  if (posture > 0.6 && isReady(heroSprites.nod)) {
    return heroSprites.nod;
  }
  if (isReady(heroSprites.idle)) {
    return heroSprites.idle;
  }
  return null;
}

function drawSprite(ctx, spriteResource, deskTopY, width, propsState) {
  const sprite = spriteResource?.image;
  if (!sprite) {
    return false;
  }
  const targetHeight = Math.round((propsState?.lowPower ? 0.9 : 1) * (width * 0.26));
  const scale = targetHeight / sprite.height;
  const drawWidth = sprite.width * scale;
  const drawHeight = sprite.height * scale;
  const baseX = Math.round(width * 0.46);
  const posture = propsState?.heroPosture ?? 0.5;
  const leanOffset = (posture - 0.5) * 18;
  const celebrationLift = (propsState?.heroCelebration ?? 0) * 18;
  ctx.save();
  ctx.translate(baseX + leanOffset, deskTopY - drawHeight + celebrationLift - 12);
  ctx.drawImage(sprite, -drawWidth / 2, 0, drawWidth, drawHeight);
  ctx.restore();
  return true;
}

export function drawHero(ctx, deskTopY, width, propsState = {}) {
  if (!ctx) {
    return;
  }
  const spriteResource = selectHeroSprite(propsState);
  if (spriteResource && drawSprite(ctx, spriteResource, deskTopY, width, propsState)) {
    return;
  }

  if (!loggedFallback) {
    console.info('[TinyHelpdeskHero] rendering fallback hero silhouette');
    loggedFallback = true;
  }

  const posture = propsState?.heroPosture ?? 0.5;
  const lean = (posture - 0.5) * 12;
  const raise = (propsState?.heroCelebration ?? 0) * 12;
  const baseX = Math.round(width * 0.46) + lean;
  const baseY = deskTopY - 8 - raise;
  const torsoHeight = 84;
  const torsoWidth = 52;

  ctx.save();
  ctx.translate(baseX, baseY - torsoHeight);

  ctx.fillStyle = '#233d6d';
  drawRoundedRect(ctx, -torsoWidth / 2, 0, torsoWidth, torsoHeight, 18);
  ctx.fill();

  ctx.fillStyle = '#1b2f54';
  drawRoundedRect(ctx, -torsoWidth / 2 - 14, 16, 18, torsoHeight - 20, 8);
  drawRoundedRect(ctx, torsoWidth / 2 - 4, 16 - raise * 0.4, 18, torsoHeight - 20 + raise, 8);
  ctx.fill();

  ctx.fillStyle = '#f3d4b4';
  drawEllipse(ctx, 0, -26, 22, 24);
  ctx.fill();
  ctx.fillStyle = '#2c1f4d';
  drawEllipse(ctx, 0, -28, 24, 16);
  ctx.fill();

  ctx.fillStyle = '#12192d';
  drawRoundedRect(ctx, -30, -34, 60, 18, 9);
  ctx.fill();

  ctx.fillStyle = hsl(((propsState?.ledHue ?? 180) % 360), 70, 60);
  drawEllipse(ctx, -10, -20, 6, 4);
  drawEllipse(ctx, 10, -20, 6, 4);
  ctx.fill();

  ctx.restore();
}

export default {
  drawHero,
};
