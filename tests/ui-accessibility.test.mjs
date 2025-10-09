import test from 'node:test';
import assert from 'node:assert/strict';

import { getPalette } from '../src/ui/theme.mjs';

const DEFAULT_FALLBACK = { r: 0, g: 0, b: 0 };
const COLORBLIND_MATRICES = {
  protanopia: [
    [0.56667, 0.43333, 0],
    [0.55833, 0.44167, 0],
    [0, 0.24167, 0.75833],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.43333, 0.56667],
    [0, 0.475, 0.525],
  ],
};

const RGBA_REGEX = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i;

function parseColorString(value) {
  const input = (value ?? '').toString().trim();
  if (!input) {
    throw new Error('Color value is required');
  }
  if (input.startsWith('#')) {
    let hex = input.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((digit) => digit + digit).join('');
    }
    const int = Number.parseInt(hex, 16);
    return {
      r: (int >> 16) & 0xff,
      g: (int >> 8) & 0xff,
      b: int & 0xff,
      alpha: 1,
    };
  }
  const rgbaMatch = input.match(RGBA_REGEX);
  if (rgbaMatch) {
    return {
      r: Number.parseFloat(rgbaMatch[1]),
      g: Number.parseFloat(rgbaMatch[2]),
      b: Number.parseFloat(rgbaMatch[3]),
      alpha: rgbaMatch[4] !== undefined ? Number.parseFloat(rgbaMatch[4]) : 1,
    };
  }
  throw new Error(`Unsupported color format: ${value}`);
}

function toOpaqueRGB(color, fallback = DEFAULT_FALLBACK) {
  if (typeof color === 'object' && color && Number.isFinite(color.r) && Number.isFinite(color.g) && Number.isFinite(color.b)) {
    return {
      r: Math.round(color.r),
      g: Math.round(color.g),
      b: Math.round(color.b),
    };
  }
  const parsed = parseColorString(color);
  if (!(parsed.alpha < 1)) {
    return {
      r: Math.round(parsed.r),
      g: Math.round(parsed.g),
      b: Math.round(parsed.b),
    };
  }
  const base = typeof fallback === 'string' ? toOpaqueRGB(fallback, DEFAULT_FALLBACK) : (fallback ?? DEFAULT_FALLBACK);
  const alpha = Math.max(0, Math.min(1, parsed.alpha));
  return {
    r: Math.round(parsed.r * alpha + base.r * (1 - alpha)),
    g: Math.round(parsed.g * alpha + base.g * (1 - alpha)),
    b: Math.round(parsed.b * alpha + base.b * (1 - alpha)),
  };
}

function srgbToLinear(channel) {
  const c = channel / 255;
  if (c <= 0.04045) {
    return c / 12.92;
  }
  return ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(value) {
  const v = Math.max(0, Math.min(1, value));
  if (v <= 0.0031308) {
    return v * 12.92;
  }
  return 1.055 * (v ** (1 / 2.4)) - 0.055;
}

function relativeLuminance({ r, g, b }) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(foreground, background) {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const [lighter, darker] = fg > bg ? [fg, bg] : [bg, fg];
  return (lighter + 0.05) / (darker + 0.05);
}

function simulateVision(rgb, type) {
  if (!type) {
    return rgb;
  }
  const matrix = COLORBLIND_MATRICES[type];
  if (!matrix) {
    return rgb;
  }
  const lr = srgbToLinear(rgb.r);
  const lg = srgbToLinear(rgb.g);
  const lb = srgbToLinear(rgb.b);
  const transformed = [
    matrix[0][0] * lr + matrix[0][1] * lg + matrix[0][2] * lb,
    matrix[1][0] * lr + matrix[1][1] * lg + matrix[1][2] * lb,
    matrix[2][0] * lr + matrix[2][1] * lg + matrix[2][2] * lb,
  ];
  return {
    r: Math.round(linearToSrgb(transformed[0]) * 255),
    g: Math.round(linearToSrgb(transformed[1]) * 255),
    b: Math.round(linearToSrgb(transformed[2]) * 255),
  };
}

test('base palette maintains AA contrast thresholds', () => {
  const palette = getPalette(false);
  const combos = [
    { label: 'textPrimary on background', fg: palette.textPrimary, bg: palette.background, minimum: 4.5 },
    { label: 'textPrimary on backgroundAlt', fg: palette.textPrimary, bg: palette.backgroundAlt, minimum: 4.5 },
    { label: 'textPrimary on panel overlay', fg: palette.textPrimary, bg: palette.panelOverlay, fallback: palette.background, minimum: 4.5 },
    { label: 'textPrimary on stubBg', fg: palette.textPrimary, bg: palette.stubBg, minimum: 4.5 },
    { label: 'textMuted on background', fg: palette.textMuted, bg: palette.background, minimum: 4.5 },
    { label: 'textMuted on panel', fg: palette.textMuted, bg: palette.panel, fallback: palette.background, minimum: 4.5 },
    { label: 'stubText on stubBg', fg: palette.stubText, bg: palette.stubBg, minimum: 4.5 },
    { label: 'stubCollapsedText on stubCollapsedBg', fg: palette.stubCollapsedText, bg: palette.stubCollapsedBg, minimum: 4.5 },
    { label: 'scoreboardText on stubBg', fg: palette.scoreboardText, bg: palette.stubBg, minimum: 4.5 },
    { label: 'scoreboardHeading on stubBg', fg: palette.scoreboardHeading, bg: palette.stubBg, minimum: 4.5 },
    { label: 'optionText on optionBase', fg: palette.optionText, bg: palette.optionBase, minimum: 4.5 },
    { label: 'optionText on optionHover', fg: palette.optionText, bg: palette.optionHover, minimum: 4.5 },
    { label: 'optionText on optionActive', fg: palette.optionText, bg: palette.optionActive, minimum: 4.5 },
    { label: 'optionDisabledText on optionDisabled', fg: palette.optionDisabledText, bg: palette.optionDisabled, minimum: 3 },
  ];

  combos.forEach(({ label, fg, bg, fallback, minimum }) => {
    const background = toOpaqueRGB(bg, fallback ?? palette.background);
    const foreground = toOpaqueRGB(fg, background);
    const ratio = contrastRatio(foreground, background);
    assert.ok(
      ratio >= minimum,
      `${label} expected contrast ≥ ${minimum.toFixed(2)}, got ${ratio.toFixed(2)}`,
    );
  });
});

test('high contrast palette preserves readability', () => {
  const palette = getPalette(true);
  const combos = [
    { label: 'textPrimary on background', fg: palette.textPrimary, bg: palette.background, minimum: 7 },
    { label: 'textPrimary on panel', fg: palette.textPrimary, bg: palette.panel, fallback: palette.background, minimum: 7 },
    { label: 'optionText on optionBase', fg: palette.optionText, bg: palette.optionBase, minimum: 7 },
    { label: 'optionText on optionHover', fg: palette.optionText, bg: palette.optionHover, minimum: 7 },
    { label: 'optionText on optionActive', fg: palette.optionText, bg: palette.optionActive, minimum: 7 },
  ];

  combos.forEach(({ label, fg, bg, fallback, minimum }) => {
    const background = toOpaqueRGB(bg, fallback ?? palette.background);
    const foreground = toOpaqueRGB(fg, background);
    const ratio = contrastRatio(foreground, background);
    assert.ok(
      ratio >= minimum,
      `${label} expected contrast ≥ ${minimum.toFixed(2)}, got ${ratio.toFixed(2)}`,
    );
  });
});

test('key accents remain legible across colorblind simulations', () => {
  const palette = getPalette(false);
  const overlays = [
    { label: 'optionText vs optionBase', fg: palette.optionText, bg: palette.optionBase, minimum: 3 },
    { label: 'optionText vs optionHover', fg: palette.optionText, bg: palette.optionHover, minimum: 3 },
    { label: 'optionText vs optionActive', fg: palette.optionText, bg: palette.optionActive, minimum: 3 },
    { label: 'personaAccent vs background', fg: palette.personaAccent, bg: palette.background, minimum: 3 },
  ];

  overlays.forEach(({ label, fg, bg, minimum }) => {
    const baseBackground = toOpaqueRGB(bg, palette.background);
    const baseForeground = toOpaqueRGB(fg, baseBackground);
    ['protanopia', 'deuteranopia', 'tritanopia'].forEach((mode) => {
      const simulatedBackground = simulateVision(baseBackground, mode);
      const simulatedForeground = simulateVision(baseForeground, mode);
      const ratio = contrastRatio(simulatedForeground, simulatedBackground);
      assert.ok(
        ratio >= minimum,
        `${label} expected contrast ≥ ${minimum.toFixed(2)} under ${mode}, got ${ratio.toFixed(2)}`,
      );
    });
  });
});
