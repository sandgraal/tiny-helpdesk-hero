/**
 * Tracks prop states (mug, notes, LEDs) based on empathy ratio with low-power support.
 */

import { clamp } from '../util/index.mjs';

export function createPropsController() {
  let state = {
    mugTemperature: 0,
    noteFlutter: 0,
    ledHue: 180,
    lowPower: false,
    failureIntensity: 0,
    lastSelection: null,
    heroPosture: 0.5,
    heroCelebration: 0,
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
      heroPosture: lowPowerMode ? 0.4 + ratio * 0.4 : 0.3 + ratio * 0.6,
      heroCelebration: !lowPowerMode && lastSelection?.correct ? clamp(state.heroCelebration + 0.25, 0, 1) : Math.max(0, state.heroCelebration - 0.12),
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
