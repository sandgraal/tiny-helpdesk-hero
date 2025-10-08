/**
 * Placeholder drawer for desk props; will be replaced by sprite art.
 */

import { drawRoundedRect, drawEllipse, hsl } from './draw-utils.mjs';
import { drawHero } from './hero-assets.mjs';
import { getImage } from './image-loader.mjs';

const deskBackground = getImage('assets/desk-placeholder.svg');
const monitorFrameImage = getImage('assets/monitor-frame.svg');

export function drawDesk(ctx, width, height, propsState) {
  if (!ctx) {
    return;
  }

  const deskHeight = Math.round(height * 0.28);
  const deskTopY = height - deskHeight;

  ctx.save();
  if (deskBackground.ready && deskBackground.image) {
    ctx.drawImage(deskBackground.image, 0, deskTopY - Math.round(deskBackground.image.height * 0.5), width, Math.round(deskBackground.image.height * 0.5 + deskHeight));
  } else {
    ctx.fillStyle = '#1F1F3B';
    ctx.fillRect(0, deskTopY, width, deskHeight);
    ctx.fillStyle = '#152238';
    ctx.fillRect(0, deskTopY - 6, width, 6);
  }

  const mugTemp = propsState?.mugTemperature ?? 0;
  const mugX = Math.round(width * 0.3);
  const mugY = deskTopY - 12;
  ctx.fillStyle = '#2D3A55';
  drawRoundedRect(ctx, mugX - 10, mugY - 22, 20, 32, 6);
  ctx.fill();
  ctx.fillStyle = hsl(20 + 20 * mugTemp, 70, 50);
  ctx.fillRect(mugX - 8, mugY - 18, 16, 18);

  const notesFlutter = propsState?.noteFlutter ?? 0;
  const noteAngle = (notesFlutter - 0.5) * 0.2;
  ctx.translate(width * 0.6, deskTopY - 18);
  ctx.rotate(noteAngle);
  ctx.fillStyle = '#F6E27F';
  drawRoundedRect(ctx, -18, -18, 36, 36, 4);
  ctx.fill();
  ctx.restore();

  ctx.save();
  const glowHue = propsState?.ledHue ?? 180;
  const stripWidth = Math.round(width * 0.6);
  const stripX = Math.round(width * 0.2);
  const stripY = deskTopY - 8;
  const gradient = ctx.createLinearGradient(stripX, stripY, stripX + stripWidth, stripY);
  gradient.addColorStop(0, hsl(glowHue - 20, 70, 55));
  gradient.addColorStop(1, hsl(glowHue + 20, 70, 55));
  ctx.fillStyle = gradient;
  drawRoundedRect(ctx, stripX, stripY, stripWidth, 6, 3);
  ctx.fill();
  ctx.restore();

  drawHero(ctx, deskTopY, width, propsState);

  return {
    deskTopY,
  };
}

export function drawMonitorFrame(ctx, width, height) {
  if (!ctx?.save) {
    return;
  }
  const frameWidth = Math.round(width * 0.82);
  const frameHeight = Math.round(height * 0.62);
  const frameX = Math.round((width - frameWidth) / 2);
  const frameY = Math.round(height * 0.14);

  ctx.save();
  if (monitorFrameImage.ready && monitorFrameImage.image) {
    ctx.drawImage(monitorFrameImage.image, frameX - 16, frameY - 16, frameWidth + 32, frameHeight + 32);
  } else {
    drawRoundedRect(ctx, frameX, frameY, frameWidth, frameHeight, 18);
    ctx.fillStyle = '#0B1220';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  drawRoundedRect(ctx, frameX + 8, frameY + 8, frameWidth - 16, frameHeight - 16, 12);
  ctx.clip();
  ctx.restore();

  return {
    x: frameX + 12,
    y: frameY + 12,
    width: frameWidth - 24,
    height: frameHeight - 24,
  };
}

export default {
  drawDesk,
  drawMonitorFrame,
};
