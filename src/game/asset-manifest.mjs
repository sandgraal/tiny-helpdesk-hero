/**
 * Central list of image assets used by the game.
 * Provides a single source for both LittleJS texture preloading and
 * our Canvas2D image loader modules.
 */

import { registerManifestPaths } from './image-loader.mjs';

export const imageManifest = {
  // Backgrounds
  backgroundWall: 'assets/background/background-wall.svg',
  backgroundWindow: 'assets/background/background-window.svg',
  backgroundSilhouettes: 'assets/background/background-silhouettes.svg',
  ambientCoworkerFront: 'assets/background/ambient-coworker-front.svg',
  ambientCoworkerBack: 'assets/background/ambient-coworker-back.svg',

  // Desk props and scene dressing
  deskSurface: 'assets/desk-surface.svg',
  monitorFrame: 'assets/ui/monitor-frame.svg',
  monitorScanlines: 'assets/ui/monitor-scanlines.svg',
  monitorBloom: 'assets/ui/monitor-bloom.svg',
  callIndicator: 'assets/ui/incoming-call-indicator.svg',
  propMug: 'assets/props/prop-mug.svg',
  propStickyNotes: 'assets/props/prop-sticky-notes.svg',
  propFigurine: 'assets/props/prop-figurine.svg',
  propKeyboardStrip: 'assets/props/prop-keyboard-strip.svg',
  propChair: 'assets/props/prop-chair.svg',
  propLamp: 'assets/props/prop-lamp.svg',

  // Hero sprites
  heroIdle: 'assets/hero/hero-idle.svg',
  heroTyping: 'assets/hero/hero-typing.svg',
  heroStretch: 'assets/hero/hero-stretch.svg',
  heroLean: 'assets/hero/hero-lean.svg',
  heroNod: 'assets/hero/hero-nod.svg',
  heroCelebrate: 'assets/hero/hero-celebrate.svg',

  // UI chrome
  uiOptionDefault: 'assets/ui/ui-option-default.svg',
  uiOptionHover: 'assets/ui/ui-option-hover.svg',
  uiOptionActive: 'assets/ui/ui-option-active.svg',
  uiOptionDisabled: 'assets/ui/ui-option-disabled.svg',
  empathyMeterBase: 'assets/ui/empathy-meter-base.svg',
  empathyMeterFill: 'assets/ui/empathy-meter-fill.svg',
  empathyMeterGlow: 'assets/ui/empathy-meter-glow.svg',
  achievementBadge01: 'assets/ui/achievement-badge-01.svg',
  achievementBadge02: 'assets/ui/achievement-badge-02.svg',
  achievementBadge03: 'assets/ui/achievement-badge-03.svg',
  achievementBadge04: 'assets/ui/achievement-badge-04.svg',
  achievementBadge05: 'assets/ui/achievement-badge-05.svg',
  achievementBadge06: 'assets/ui/achievement-badge-06.svg',

  // Icons
  iconCollapse: 'assets/icons/icon-collapse.svg',
  iconExpand: 'assets/icons/icon-expand.svg',
  iconRestart: 'assets/icons/icon-restart.svg',
  iconTextScale: 'assets/icons/icon-text-scale.svg',

  // Effects
  particlesSuccess: 'assets/effects/particles-success.svg',
  particlesFailure: 'assets/effects/particles-failure.svg',
  screenStatic: 'assets/effects/screen-static.svg',
};

export const imageSources = Object.values(imageManifest);

registerManifestPaths(imageSources);

export default {
  imageManifest,
  imageSources,
};
