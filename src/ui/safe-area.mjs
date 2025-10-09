/**
 * Keeps CSS variables in sync with the current visual viewport.
 * Helps UI chrome (accessibility panel) avoid browser chrome in landscape/mobile layouts.
 */

const TOP_VAR = '--thh-viewport-offset-top';
const BOTTOM_VAR = '--thh-viewport-offset-bottom';

function roundPixels(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

function computeBottomInset(viewport, layoutHeight) {
  if (!viewport) {
    return 0;
  }
  const height = Number.isFinite(layoutHeight) ? layoutHeight : viewport.height + viewport.offsetTop;
  const inset = height - viewport.height - viewport.offsetTop;
  return roundPixels(inset);
}

export function initSafeAreaWatcher(doc = globalThis.document) {
  const root = doc?.documentElement;
  const viewport = globalThis.visualViewport;

  if (!root || !viewport || typeof viewport.addEventListener !== 'function') {
    return () => {};
  }

  const update = () => {
    const topInset = roundPixels(viewport.offsetTop || 0);
    const bottomInset = computeBottomInset(viewport, globalThis.innerHeight);
    root.style.setProperty(TOP_VAR, `${topInset}px`);
    root.style.setProperty(BOTTOM_VAR, `${bottomInset}px`);
  };

  update();

  viewport.addEventListener('resize', update);
  viewport.addEventListener('scroll', update);
  globalThis.addEventListener?.('orientationchange', update);

  return () => {
    viewport.removeEventListener('resize', update);
    viewport.removeEventListener('scroll', update);
    globalThis.removeEventListener?.('orientationchange', update);
  };
}

export default {
  initSafeAreaWatcher,
};
