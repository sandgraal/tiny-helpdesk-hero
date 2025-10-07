/**
 * Shared drawing helpers for desk scene overlays.
 */

export function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (!ctx) {
    return;
  }
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawEllipse(ctx, x, y, radiusX, radiusY) {
  if (!ctx?.ellipse) {
    return;
  }
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.closePath();
}

export function hsl(h, s, l) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

drawRoundedRect.defaultRadius = 12;
