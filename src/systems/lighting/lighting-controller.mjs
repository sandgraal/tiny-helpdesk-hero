/**
 * Tracks ambient lighting state driven by empathy ratio and low-power mode.
 */

import { clamp, lerp } from '../../util/index.mjs';

const defaultColors = {
  warm: { r: 255, g: 214, b: 102 },
  cool: { r: 64, g: 102, b: 142 },
  glow: { r: 255, g: 244, b: 224 },
};

const dayKeyframes = [
  {
    stop: 0,
    sky: { r: 32, g: 58, b: 108 },
    window: { r: 255, g: 222, b: 186 },
    horizon: { r: 182, g: 214, b: 255 },
  },
  {
    stop: 0.35,
    sky: { r: 56, g: 96, b: 176 },
    window: { r: 255, g: 245, b: 210 },
    horizon: { r: 168, g: 206, b: 255 },
  },
  {
    stop: 0.7,
    sky: { r: 38, g: 72, b: 132 },
    window: { r: 244, g: 212, b: 180 },
    horizon: { r: 142, g: 188, b: 248 },
  },
  {
    stop: 1,
    sky: { r: 20, g: 34, b: 74 },
    window: { r: 226, g: 176, b: 148 },
    horizon: { r: 120, g: 160, b: 220 },
  },
];

export function createLightingController({ colors = defaultColors } = {}) {
  let ratio = 0;
  let lowPower = false;
  let progress = 0;

  function update({
    empathyScore = 0,
    callCount = 0,
    currentIndex = 0,
    lowPowerMode = false,
  } = {}) {
    ratio = callCount > 0 ? clamp(empathyScore / callCount, 0, 1) : 0;
    progress = callCount > 0 ? clamp(currentIndex / callCount, 0, 1) : 0;
    lowPower = Boolean(lowPowerMode);
  }

  function mixColor(a, b, t) {
    if (!a) {
      return b;
    }
    if (!b) {
      return a;
    }
    return {
      r: Math.round(lerp(a.r, b.r, t)),
      g: Math.round(lerp(a.g, b.g, t)),
      b: Math.round(lerp(a.b, b.b, t)),
    };
  }

  function sampleDayKeyframes(value) {
    if (!Array.isArray(dayKeyframes) || dayKeyframes.length === 0) {
      return {
        from: null,
        to: null,
        t: 0,
      };
    }

    const clamped = clamp(value, 0, 1);
    for (let i = 0; i < dayKeyframes.length - 1; i += 1) {
      const current = dayKeyframes[i];
      const next = dayKeyframes[i + 1];
      if (clamped >= current.stop && clamped <= next.stop) {
        const span = next.stop - current.stop || 1;
        const localT = (clamped - current.stop) / span;
        return {
          from: current,
          to: next,
          t: clamp(localT, 0, 1),
        };
      }
    }

    if (clamped <= dayKeyframes[0].stop) {
      return { from: dayKeyframes[0], to: dayKeyframes[0], t: 0 };
    }
    const last = dayKeyframes[dayKeyframes.length - 1];
    return { from: last, to: last, t: 0 };
  }

  function computeDayState(value) {
    const { from, to, t } = sampleDayKeyframes(value);
    if (!from || !to) {
      return {
        progress: value,
      };
    }

    const sky = mixColor(from.sky, to.sky, t);
    const windowColor = mixColor(from.window, to.window, t);
    const horizon = mixColor(from.horizon ?? from.sky, to.horizon ?? to.sky, t);
    const duskIntensity = clamp(value, 0, 1);
    const eveningBoost = clamp(value - 0.6, 0, 0.4) / 0.4;
    const middayLift = 1 - Math.abs(value - 0.5) * 2;

    return {
      progress: value,
      sky: {
        color: sky,
        alpha: lowPower ? 0.08 + eveningBoost * 0.05 : 0.14 + eveningBoost * 0.18,
      },
      window: {
        color: windowColor,
        alpha: lowPower ? 0.22 + duskIntensity * 0.08 : 0.3 + duskIntensity * 0.18,
      },
      haze: {
        color: horizon,
        alpha: lowPower ? 0.04 + middayLift * 0.05 : 0.08 + middayLift * 0.1,
      },
    };
  }

  function getAmbientLayers() {
    const coolRatio = 1 - ratio;
    const warmAlpha = lowPower ? 0.05 + ratio * 0.12 : 0.1 + ratio * 0.32;
    const coolAlpha = lowPower ? 0.04 + coolRatio * 0.1 : 0.08 + coolRatio * 0.24;
    const glowAlpha = lowPower ? ratio * 0.06 : 0.12 + ratio * 0.3;

    return {
      ratio,
      lowPower,
      day: computeDayState(progress),
      layers: [
        { color: colors.cool, alpha: coolAlpha },
        { color: colors.warm, alpha: warmAlpha },
      ],
      glow: { color: colors.glow, alpha: glowAlpha },
    };
  }

  return {
    update,
    getAmbientLayers,
  };
}

export default createLightingController;
