/**
 * Entry point for Tiny Helpdesk Hero.
 * TODO: wire LittleJS lifecycle (init/update/render) once systems are implemented.
 */

import { createGameLifecycle } from './game/main.js';

function bootstrap() {
  const lifecycle = createGameLifecycle();
  if (!lifecycle) {
    console.info('[TinyHelpdeskHero] Game lifecycle not initialized yet.');
    return;
  }

  // TODO: call littlejs.engineInit with lifecycle callbacks when ready.
  console.info('[TinyHelpdeskHero] Placeholder bootstrap executed.', lifecycle);
}

bootstrap();
