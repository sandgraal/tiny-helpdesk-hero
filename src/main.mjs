/**
 * Entry point for Tiny Helpdesk Hero.
 * Boots the LittleJS engine once globals are available.
 */

import { createGameLifecycle } from './game/main.js';
import { initAccessibilityPanel } from './ui/accessibility-panel.js';

function startEngine(lifecycle) {
  const { engineInit } = globalThis;
  if (typeof engineInit !== 'function') {
    return false;
  }
  engineInit(
    lifecycle.init,
    lifecycle.update,
    lifecycle.updatePost,
    lifecycle.render,
    lifecycle.renderPost,
  );
  return true;
}

function bootstrap() {
  const lifecycle = createGameLifecycle();
  initAccessibilityPanel(lifecycle.accessibility);

  function attemptStart() {
    if (!startEngine(lifecycle)) {
      globalThis.setTimeout?.(attemptStart, 0);
    }
  }

  attemptStart();
}

bootstrap();
