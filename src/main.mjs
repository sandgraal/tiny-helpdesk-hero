/**
 * Entry point for Tiny Helpdesk Hero.
 * Boots the LittleJS engine once globals are available.
 */

import { createGameLifecycle } from './game/main.mjs';
import { initAccessibilityPanel } from './ui/accessibility-panel.mjs';
import { imageSources } from './game/asset-manifest.mjs';
import { syncWithTextureInfos } from './game/image-loader.mjs';
import { initSafeAreaWatcher } from './ui/safe-area.mjs';
import { createToastManager } from './ui/toast.mjs';
import { setMonitorDebugOverlay, getSettings } from './game/settings.mjs';
import { createDebugOverlay } from './ui/debug-overlay.mjs';

const MONITOR_DEBUG_STORAGE_KEY = 'TinyHelpdeskHero.monitorDebugOverlay';
const DEBUG_OVERLAY_STORAGE_KEY = 'TinyHelpdeskHero.debugOverlay';

function parseBooleanFlag(raw) {
  if (raw === null || raw === undefined) {
    return true;
  }
  const normalized = String(raw).trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  if (['1', 'true', 'yes', 'on', 'enable'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'off', 'disable'].includes(normalized)) {
    return false;
  }
  return null;
}

function applyMonitorDebugOverlay(enabled, reason = 'bootstrap', { toastManager } = {}) {
  const target = Boolean(enabled);
  const current = getSettings().monitorDebugOverlay;
  if (current === target) {
    return false;
  }
  setMonitorDebugOverlay(target);
  try {
    globalThis.localStorage?.setItem(MONITOR_DEBUG_STORAGE_KEY, target ? '1' : '0');
  } catch (error) {
    console.warn('[TinyHelpdeskHero] Failed to persist monitor overlay flag', error);
  }
  console.info(`[TinyHelpdeskHero][Debug] Monitor overlay ${target ? 'enabled' : 'disabled'} (${reason})`);
  if (reason === 'keyboard' && typeof toastManager?.show === 'function') {
    toastManager.show(`Monitor debug overlay ${target ? 'enabled' : 'disabled'}.`, {
      tone: 'info',
      duration: 3200,
    });
  }
  return true;
}

function initMonitorDebugControls({ toastManager } = {}) {
  try {
    const stored = globalThis.localStorage?.getItem(MONITOR_DEBUG_STORAGE_KEY);
    if (stored === '1') {
      applyMonitorDebugOverlay(true, 'storage', { toastManager });
    } else if (stored === '0') {
      applyMonitorDebugOverlay(false, 'storage', { toastManager });
    }
  } catch (error) {
    console.warn('[TinyHelpdeskHero] Unable to access localStorage for monitor overlay', error);
  }

  if (typeof URLSearchParams === 'function') {
    const search = globalThis.location?.search ?? '';
    if (search) {
      const params = new URLSearchParams(search);
      const keys = ['monitorDebugOverlay', 'monitorDebug', 'monitorOverlay'];
      for (const key of keys) {
        if (params.has(key)) {
          const parsed = parseBooleanFlag(params.get(key));
          if (parsed !== null) {
            applyMonitorDebugOverlay(parsed, 'query', { toastManager });
          }
          break;
        }
      }
    }
  }

  const handleKeyDown = (event) => {
    if (event.repeat) {
      return;
    }
    const key = event.key;
    if (key === 'F9') {
      event.preventDefault();
      const current = getSettings().monitorDebugOverlay;
      applyMonitorDebugOverlay(!current, 'keyboard', { toastManager });
      return;
    }
    if (key && (key.toLowerCase?.() === 'm') && event.altKey && event.shiftKey) {
      event.preventDefault();
      const current = getSettings().monitorDebugOverlay;
      applyMonitorDebugOverlay(!current, 'keyboard', { toastManager });
    }
  };

  globalThis.addEventListener?.('keydown', handleKeyDown);

  return () => {
    globalThis.removeEventListener?.('keydown', handleKeyDown);
  };
}

function initDebugUtilities(lifecycle, { toastManager, container } = {}) {
  const overlay = createDebugOverlay({ container });
  const debugApi = lifecycle?.debug ?? null;
  let disposed = false;
  let rafHandle = null;
  let timeoutHandle = null;

  function clearScheduled() {
    if (rafHandle !== null && typeof globalThis.cancelAnimationFrame === 'function') {
      globalThis.cancelAnimationFrame(rafHandle);
    }
    if (timeoutHandle !== null && typeof globalThis.clearTimeout === 'function') {
      globalThis.clearTimeout(timeoutHandle);
    }
    rafHandle = null;
    timeoutHandle = null;
  }

  function scheduleTick(callback) {
    if (disposed) {
      return;
    }
    if (typeof globalThis.requestAnimationFrame === 'function') {
      rafHandle = globalThis.requestAnimationFrame(callback);
    } else if (typeof globalThis.setTimeout === 'function') {
      timeoutHandle = globalThis.setTimeout(callback, 250);
    }
  }

  function announceOverlayChange(enabled, reason = 'programmatic') {
    console.info(`[TinyHelpdeskHero][Debug] Overlay ${enabled ? 'enabled' : 'disabled'} (${reason})`);
    if (reason === 'keyboard' && typeof toastManager?.show === 'function') {
      toastManager.show(`Debug overlay ${enabled ? 'enabled' : 'disabled'}.`, {
        tone: 'info',
        duration: 2600,
      });
    }
  }

  function applyOverlayVisibility(enabled, reason = 'programmatic') {
    if (!overlay?.setVisible) {
      return;
    }
    const changed = overlay.setVisible(enabled);
    if (!changed) {
      return;
    }
    try {
      globalThis.localStorage?.setItem(DEBUG_OVERLAY_STORAGE_KEY, enabled ? '1' : '0');
    } catch (error) {
      console.warn('[TinyHelpdeskHero] Failed to persist debug overlay flag', error);
    }
    announceOverlayChange(enabled, reason);
  }

  function announceTimeScale(scale, reason = 'programmatic') {
    if (scale === undefined || scale === null) {
      return;
    }
    const numeric = Number(scale);
    if (!Number.isFinite(numeric)) {
      return;
    }
    const message = numeric === 0
      ? 'Time scale paused.'
      : `Time scale set to ×${numeric.toFixed(2)}.`;
    console.info(`[TinyHelpdeskHero][Debug] ${message} (${reason})`);
    if (reason === 'keyboard' && typeof toastManager?.show === 'function') {
      toastManager.show(message, { tone: 'info', duration: 2600 });
    }
  }

  const instructions = [
    'F8 — Toggle debug overlay',
    'Alt+Shift+[ — Slow time (−0.25×)',
    'Alt+Shift+] — Speed time (+0.25×)',
    'Alt+Shift+\\ — Reset time',
    'Alt+Shift+P — Pause or resume time',
  ];

  function tick() {
    if (disposed) {
      return;
    }
    const stats = debugApi?.getPerformanceStats?.() ?? null;
    overlay?.update?.({
      timeScale: debugApi?.getTimeScale?.(),
      baseDelta: debugApi?.getBaseDelta?.(),
      performance: stats,
      lowPower: getSettings().lowPower,
      monitorDebug: getSettings().monitorDebugOverlay,
      instructions,
    });
    scheduleTick(tick);
  }

  function handleKeyDown(event) {
    if (event.repeat) {
      return;
    }
    const key = event.key;
    if (key === 'F8') {
      event.preventDefault();
      const next = !overlay?.isVisible?.();
      applyOverlayVisibility(next, 'keyboard');
      return;
    }
    if (!event.altKey || !event.shiftKey) {
      return;
    }
    if (key === '[') {
      event.preventDefault();
      const scale = debugApi?.nudgeTimeScale?.(-0.25);
      announceTimeScale(scale, 'keyboard');
      return;
    }
    if (key === ']') {
      event.preventDefault();
      const scale = debugApi?.nudgeTimeScale?.(0.25);
      announceTimeScale(scale, 'keyboard');
      return;
    }
    if (key === '\\' || key === '|') {
      event.preventDefault();
      const scale = debugApi?.resetTimeScale?.();
      announceTimeScale(scale, 'keyboard');
      return;
    }
    if (key === 'p' || key === 'P') {
      event.preventDefault();
      const scale = debugApi?.togglePause?.();
      announceTimeScale(scale, 'keyboard');
    }
  }

  globalThis.addEventListener?.('keydown', handleKeyDown);

  if (typeof debugApi?.getTimeScale === 'function') {
    announceTimeScale(debugApi.getTimeScale(), 'bootstrap');
  }

  try {
    const stored = globalThis.localStorage?.getItem(DEBUG_OVERLAY_STORAGE_KEY);
    if (stored === '1') {
      applyOverlayVisibility(true, 'storage');
    } else if (stored === '0') {
      applyOverlayVisibility(false, 'storage');
    }
  } catch (error) {
    console.warn('[TinyHelpdeskHero] Unable to access localStorage for debug overlay', error);
  }

  if (typeof URLSearchParams === 'function') {
    const search = globalThis.location?.search ?? '';
    if (search) {
      const params = new URLSearchParams(search);
      if (params.has('debugOverlay')) {
        const parsed = parseBooleanFlag(params.get('debugOverlay'));
        if (parsed !== null) {
          applyOverlayVisibility(parsed, 'query');
        }
      }
    }
  }

  overlay?.update?.({ instructions });
  tick();

  return () => {
    disposed = true;
    clearScheduled();
    globalThis.removeEventListener?.('keydown', handleKeyDown);
    overlay?.dispose?.();
  };
}

function ensureOverlayCanvas() {
  const doc = globalThis.document;
  if (!doc) {
    return;
  }
  const mainCanvas = globalThis.mainCanvas ?? doc.getElementById('mainCanvas');
  const overlayCanvas = doc.getElementById('overlayCanvas');
  if (!overlayCanvas || !mainCanvas) {
    return;
  }
  const overlayContext = overlayCanvas.getContext('2d');
  const syncSize = () => {
    overlayCanvas.width = mainCanvas.width;
    overlayCanvas.height = mainCanvas.height;
    overlayCanvas.style.width = mainCanvas.style.width || `${mainCanvas.width}px`;
    overlayCanvas.style.height = mainCanvas.style.height || `${mainCanvas.height}px`;
  };
  syncSize();
  globalThis.overlayCanvas = overlayCanvas;
  globalThis.overlayContext = overlayContext;
  globalThis.addEventListener?.('resize', syncSize);
  globalThis.addEventListener?.('orientationchange', syncSize);
}

function startEngine(lifecycle) {
  const { engineInit } = globalThis;
  console.log('[TinyHelpdeskHero] engineInit type:', typeof engineInit);
  if (typeof engineInit !== 'function') {
    return false;
  }
  const initResult = engineInit(
    lifecycle.init,
    lifecycle.update,
    lifecycle.updatePost,
    lifecycle.render,
    lifecycle.renderPost,
    imageSources,
  );
  if (initResult?.finally) {
    initResult.finally(() => {
      syncWithTextureInfos();
    });
  } else if (initResult?.then) {
    initResult.then(() => {
      syncWithTextureInfos();
    });
  } else {
    syncWithTextureInfos();
  }
  return true;
}

function bootstrap() {
  const doc = globalThis.document;
  const toastRegion = doc?.querySelector?.('[data-toast-region]');
  const toastManager = createToastManager({
    container: toastRegion,
  });
  const announcedContrastStates = new Set();
  const disposeMonitorDebug = initMonitorDebugControls({ toastManager });
  const canvasStack = doc?.querySelector?.('[data-canvas-stack]');

  const lifecycle = createGameLifecycle({
    onSystemContrastApplied: (event) => {
      if (typeof toastManager.show !== 'function') {
        return;
      }
      const key = event?.highContrast ? 'high' : 'default';
      if (announcedContrastStates.has(key)) {
        return;
      }
      const message = event?.highContrast
        ? 'System preference enabled high contrast mode.'
        : 'System preference restored default contrast.';
      toastManager.show(`${message} You can override this in the accessibility panel.`, {
        tone: 'info',
      });
      announcedContrastStates.add(key);
    },
  });
  initAccessibilityPanel(lifecycle.accessibility);
  initSafeAreaWatcher();
  ensureOverlayCanvas();
  const disposeDebugOverlay = initDebugUtilities(lifecycle, {
    toastManager,
    container: canvasStack,
  });

  function attemptStart() {
    if (!startEngine(lifecycle)) {
      globalThis.setTimeout?.(attemptStart, 0);
    }
  }

  attemptStart();

  globalThis.addEventListener?.('beforeunload', () => {
    disposeMonitorDebug();
    disposeDebugOverlay?.();
  });
}

bootstrap();
