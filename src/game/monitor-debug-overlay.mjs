/**
 * Renders monitor safe-area diagnostics on top of the desk scene.
 * Helps artists and engineers confirm that the 3D monitor bezel
 * continues to respect the documented readability envelope.
 */

import { clamp } from '../util/index.mjs';
import { monitorFrameSpec } from './blockout-metrics.mjs';

function hasContextAbilities(context) {
  return Boolean(
    context
    && typeof context.save === 'function'
    && typeof context.restore === 'function'
    && typeof context.fillRect === 'function'
    && typeof context.strokeRect === 'function'
  );
}

function drawInfoPanel(context, safeArea, readability, designSize) {
  if (typeof context.fillText !== 'function') {
    return;
  }

  const panelPadding = 8;
  const panelHeight = 44;
  const maxPanelWidth = clamp(safeArea.width - panelPadding * 2, 220, 420);
  const panelX = safeArea.x + panelPadding;
  const panelY = safeArea.y + panelPadding;
  const scalePercent = (readability?.scale ?? 0) * 100;
  const pxPerUnit = readability?.pixelsPerUiUnit ?? 0;
  const readable = readability?.isReadable;
  const designWidth = designSize?.width ?? monitorFrameSpec.safeArea.width;
  const designHeight = designSize?.height ?? monitorFrameSpec.safeArea.height;
  const summary = readable ? 'Readable' : 'Below thresholds';
  const detailLine = `Safe ${Math.round(safeArea.width)}×${Math.round(safeArea.height)}px · Design ${designWidth}×${designHeight}`;
  const scaleLine = `Scale ${scalePercent.toFixed(1)}% · ${pxPerUnit.toFixed(2)} px/UI · ${summary}`;

  context.save();
  context.globalAlpha = 0.85;
  context.fillStyle = 'rgba(5, 17, 32, 0.82)';
  context.fillRect(panelX, panelY, maxPanelWidth, panelHeight);
  context.globalAlpha = 1;
  context.fillStyle = '#E6F5FF';
  context.font = '12px "Segoe UI", sans-serif';
  context.textBaseline = 'top';
  context.fillText(detailLine, panelX + 10, panelY + 10);
  context.fillText(scaleLine, panelX + 10, panelY + 26);
  context.restore();
}

function drawGrid(context, safeArea) {
  if (typeof context.beginPath !== 'function' || typeof context.moveTo !== 'function' || typeof context.lineTo !== 'function') {
    return;
  }

  const thirdsX = [safeArea.x + safeArea.width / 3, safeArea.x + (safeArea.width * 2) / 3];
  const thirdsY = [safeArea.y + safeArea.height / 3, safeArea.y + (safeArea.height * 2) / 3];

  context.save();
  context.globalAlpha = 0.6;
  context.strokeStyle = 'rgba(140, 220, 255, 0.55)';
  context.lineWidth = 1;
  if (typeof context.setLineDash === 'function') {
    context.setLineDash([4, 6]);
  }

  context.beginPath();
  thirdsX.forEach((x) => {
    context.moveTo(x, safeArea.y);
    context.lineTo(x, safeArea.y + safeArea.height);
  });
  thirdsY.forEach((y) => {
    context.moveTo(safeArea.x, y);
    context.lineTo(safeArea.x + safeArea.width, y);
  });
  context.stroke();
  context.restore();
}

function drawPointer(context, safeArea, scale, pointer) {
  if (!pointer || typeof context.beginPath !== 'function' || typeof context.arc !== 'function') {
    return;
  }
  const px = safeArea.x + pointer.x * scale;
  const py = safeArea.y + pointer.y * scale;

  context.save();
  context.beginPath();
  context.globalAlpha = 0.9;
  context.fillStyle = 'rgba(255, 255, 255, 0.92)';
  context.strokeStyle = 'rgba(0, 160, 255, 0.9)';
  context.lineWidth = 1.5;
  context.arc(px, py, 6, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  if (typeof context.fillText === 'function') {
    const label = `(${Math.round(pointer.x)}, ${Math.round(pointer.y)})`;
    context.font = '11px "Segoe UI", sans-serif';
    context.textBaseline = 'top';
    context.fillStyle = '#011120';
    context.fillText(label, px + 10, py + 8);
  }
  context.restore();
}

export function drawMonitorDebugOverlay(context, {
  layout,
  readability,
  pointer,
  designSafeArea = monitorFrameSpec.safeArea,
  showGrid = true,
  showInfoPanel = true,
} = {}) {
  const effectiveLayout = layout ?? readability ?? null;
  const safeArea = effectiveLayout?.safeArea;
  const frame = effectiveLayout?.frame;
  const scale = effectiveLayout?.scale;

  if (!hasContextAbilities(context) || !safeArea || !frame || !scale) {
    return;
  }

  context.save();
  try {
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 0.6;
    context.fillStyle = 'rgba(0, 200, 255, 0.1)';
    context.fillRect(safeArea.x, safeArea.y, safeArea.width, safeArea.height);

    context.globalAlpha = 1;
    context.strokeStyle = 'rgba(0, 200, 255, 0.75)';
    context.lineWidth = 2;
    if (typeof context.setLineDash === 'function') {
      context.setLineDash([6, 6]);
    }
    context.strokeRect(safeArea.x + 0.5, safeArea.y + 0.5, safeArea.width - 1, safeArea.height - 1);

    if (frame) {
      if (typeof context.setLineDash === 'function') {
        context.setLineDash([]);
      }
      context.strokeStyle = 'rgba(0, 132, 255, 0.55)';
      context.lineWidth = 1.5;
      context.strokeRect(frame.x + 0.5, frame.y + 0.5, frame.width - 1, frame.height - 1);
    }

    if (showGrid) {
      drawGrid(context, safeArea);
    }

    if (pointer) {
      drawPointer(context, safeArea, scale, pointer);
    }

    if (showInfoPanel) {
      drawInfoPanel(context, safeArea, readability ?? effectiveLayout, designSafeArea);
    }
  } finally {
    if (typeof context.setLineDash === 'function') {
      context.setLineDash([]);
    }
    context.restore();
  }
}

export default {
  drawMonitorDebugOverlay,
};
