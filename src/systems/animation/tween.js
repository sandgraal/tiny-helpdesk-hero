/**
 * Simple easing utilities for UI transitions that respect reduced-motion preferences.
 */

function shouldReduceMotion() {
  const { matchMedia } = globalThis;
  return Boolean(matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

export function easeOutCubic(t) {
  const clamped = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - clamped, 3);
}

export function createHoverState({ duration = 0.2 } = {}) {
  let elapsed = 0;
  let active = false;

  function update(delta) {
    if (shouldReduceMotion()) {
      elapsed = active ? duration : 0;
      return;
    }
    if (active) {
      elapsed = Math.min(duration, elapsed + delta);
    } else {
      elapsed = Math.max(0, elapsed - delta);
    }
  }

  function setActive(flag) {
    active = Boolean(flag);
  }

  function getValue() {
    return easeOutCubic(duration === 0 ? (active ? 1 : 0) : elapsed / duration);
  }

  return {
    update,
    setActive,
    getValue,
  };
}
