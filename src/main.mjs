/**
 * Entry point for Tiny Helpdesk Hero.
 * Boots the LittleJS engine once globals are available.
 */

import { createGameLifecycle } from './game/main.mjs';
import { initAccessibilityPanel } from './ui/accessibility-panel.mjs';
import { imageSources } from './game/asset-manifest.mjs';
import { syncWithTextureInfos } from './game/image-loader.mjs';
import { initSafeAreaWatcher } from './ui/safe-area.mjs';

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
  const lifecycle = createGameLifecycle();
  initAccessibilityPanel(lifecycle.accessibility);
  initSafeAreaWatcher();
  ensureOverlayCanvas();

  function attemptStart() {
    if (!startEngine(lifecycle)) {
      globalThis.setTimeout?.(attemptStart, 0);
    }
  }

  attemptStart();
}

bootstrap();
