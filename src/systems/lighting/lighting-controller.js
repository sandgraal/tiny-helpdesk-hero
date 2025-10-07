/**
 * Tracks ambient lighting state driven by empathy ratio and low-power mode.
 */

const defaultColors = {
  warm: { r: 255, g: 214, b: 102 },
  cool: { r: 64, g: 102, b: 142 },
  glow: { r: 255, g: 244, b: 224 },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function createLightingController({ colors = defaultColors } = {}) {
  let ratio = 0;
  let lowPower = false;

  function update({ empathyScore = 0, callCount = 0, lowPowerMode = false } = {}) {
    ratio = callCount > 0 ? clamp(empathyScore / callCount, 0, 1) : 0;
    lowPower = Boolean(lowPowerMode);
  }

  function getAmbientLayers() {
    const coolRatio = 1 - ratio;
    const warmAlpha = lowPower ? 0.05 + ratio * 0.12 : 0.1 + ratio * 0.32;
    const coolAlpha = lowPower ? 0.04 + coolRatio * 0.1 : 0.08 + coolRatio * 0.24;
    const glowAlpha = lowPower ? ratio * 0.06 : 0.12 + ratio * 0.3;

    return {
      ratio,
      lowPower,
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
