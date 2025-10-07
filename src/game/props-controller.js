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
    failureIntensity: 0,
    lastSelection: null,
  };

  function update({ empathyScore = 0, callCount = 0, lowPowerMode = false, lastSelection = null } = {}) {
    const ratio = callCount > 0 ? clamp(empathyScore / callCount, 0, 1) : 0;
    const incorrect = lastSelection?.correct === false;
    const failureBase = incorrect ? 0.45 : Math.max(0, 0.25 - ratio * 0.2);
    const failureIntensity = lowPowerMode ? failureBase * 0.4 : failureBase;

    state = {
      mugTemperature: lowPowerMode ? ratio * 0.3 : ratio,
      noteFlutter: lowPowerMode ? ratio * 0.2 : ratio * 0.8,
      ledHue: 180 + ratio * 120,
      lowPower: Boolean(lowPowerMode),
      failureIntensity,
      lastSelection: lastSelection ? { correct: Boolean(lastSelection.correct) } : null,
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
