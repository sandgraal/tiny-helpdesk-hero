/**
 * Placeholder hero drawing utilities.
 */

import { drawRoundedRect, drawEllipse, hsl } from './draw-utils.mjs';
import { getImage } from './image-loader.mjs';

const heroBaseResource = getImage('assets/hero-base.svg');
const heroCelebrateResource = getImage('assets/hero-celebrate.svg');
let loggedFallback = false;

export function drawHero(ctx, deskTopY, width, propsState) {
  if (!ctx) {
    return;
  }
  const posture = propsState?.heroPosture ?? 0.5;
  const celebration = propsState?.heroCelebration ?? 0;
  const baseX = Math.round(width * 0.45);
  const baseY = deskTopY - 6;
  const torsoHeight = 68;
  const torsoWidth = 46;
  const lean = (posture - 0.5) * 12;
  const raise = celebration * 12;

  ctx.save();
  ctx.translate(baseX + lean, baseY - torsoHeight - raise);

  const celebrateReady = heroCelebrateResource.ready && heroCelebrateResource.image;
  const baseReady = heroBaseResource.ready && heroBaseResource.image;
  const sprite = celebration > 0.3 && celebrateReady
    ? heroCelebrateResource.image
    : baseReady
      ? heroBaseResource.image
      : null;

  if (sprite) {
    const spriteWidth = sprite.width;
    const spriteHeight = sprite.height;
    const scale = torsoHeight / spriteHeight;
    const drawWidth = spriteWidth * scale;
    const drawHeight = spriteHeight * scale;
    ctx.drawImage(sprite, -drawWidth / 2, -drawHeight + 12, drawWidth, drawHeight);
    ctx.restore();
    return;
  }

  if (!loggedFallback) {
    console.info('[TinyHelpdeskHero] rendering fallback hero silhouette');
    loggedFallback = true;
  }

  // Torso
  ctx.fillStyle = '#253B6E';
  drawRoundedRect(ctx, -torsoWidth / 2, 0, torsoWidth, torsoHeight, 14);
  ctx.fill();

  // Arms
  ctx.fillStyle = '#1E2F57';
  drawRoundedRect(ctx, -torsoWidth / 2 - 10, 12, 12, torsoHeight - 16, 6);
  drawRoundedRect(ctx, torsoWidth / 2 - 2, 12 - raise * 0.5, 12, torsoHeight - 16 + raise, 6);
  ctx.fill();

  // Head
  ctx.fillStyle = '#F5D6C6';
  drawEllipse(ctx, 0, -20, 18, 18);
  ctx.fill();
  ctx.fillStyle = '#2C1F54';
  drawEllipse(ctx, 0, -20, 18, 18 * 0.6);
  ctx.fill();

  // Headphones
  ctx.fillStyle = '#13172B';
  drawRoundedRect(ctx, -20, -26, 40, 12, 6);
  ctx.fill();

  // Face glow to mirror empathy
  const hue = 180 + (propsState?.ledHue ?? 0) * 0.2;
  ctx.fillStyle = hsl(hue % 360, 65, 60);
  drawEllipse(ctx, -6, -18, 5, 3);
  drawEllipse(ctx, 6, -18, 5, 3);
  ctx.fill();

  ctx.restore();
}

export default {
  drawHero,
};
