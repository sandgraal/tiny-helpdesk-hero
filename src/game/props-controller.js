/**
 * Tracks prop states (mug, notes, LEDs) based on empathy ratio with low-power support.
 */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function createPropsController() {
  let state = {
    mugTemperature: 0,
    noteFlutter: 0,
    ledHue: 180,
    lowPower: false,
  };

  function update({ empathyScore = 0, callCount = 0, lowPowerMode = false } = {}) {
    const ratio = callCount > 0 ? clamp(empathyScore / callCount, 0, 1) : 0;
    state = {
      mugTemperature: lowPowerMode ? ratio * 0.3 : ratio,
      noteFlutter: lowPowerMode ? ratio * 0.2 : ratio * 0.8,
      ledHue: 180 + ratio * 120,
      lowPower: Boolean(lowPowerMode),
    };
  }

  function getState() {
    return { ...state };
  }

  return {
    update,
    getState,
  };
}

export default createPropsController;
