/**
 * Runtime toggles for visual features such as low-power mode.
 */

const listeners = new Set();

const state = {
  lowPower: false,
};

function notify() {
  for (const listener of listeners) {
    try {
      listener({ ...state });
    } catch (error) {
      console.warn('[Settings] listener failed', error);
    }
  }
}

export function setLowPower(enabled) {
  const flag = Boolean(enabled);
  if (state.lowPower === flag) {
    return;
  }
  state.lowPower = flag;
  notify();
}

export function getSettings() {
  return { ...state };
}

export function subscribe(listener) {
  if (typeof listener !== 'function') {
    return () => {};
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export default {
  setLowPower,
  getSettings,
  subscribe,
};
