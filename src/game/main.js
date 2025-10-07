/**
 * Integrates systems into a LittleJS-friendly lifecycle.
 */

import { createConversationSystem } from '../systems/conversation.js';
import { createUISystem } from '../systems/ui.js';
import { createAudioSystem } from '../systems/audio.js';
import { placeholderCalls } from '../content/calls.js';
import { achievementDefinitions } from '../content/achievements.js';
import { createAchievementSystem } from '../systems/achievements.js';
import { createAccessibilitySettings } from '../systems/accessibility.js';
import { createMonitorDisplay } from './monitor-display.js';

function triggerHaptic(pattern, warningLabel = 'Haptic trigger failed') {
  const vibrate = globalThis.navigator?.vibrate;
  if (typeof vibrate !== 'function') {
    return;
  }

  let normalizedPattern = pattern;
  if (typeof normalizedPattern === 'number') {
    normalizedPattern = [normalizedPattern];
  }
  if (!Array.isArray(normalizedPattern) || normalizedPattern.length === 0) {
    return;
  }

  try {
    const motionQuery = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (motionQuery?.matches) {
      return;
    }
  } catch (error) {
    console.warn('[GameLifecycle] Haptic media query failed', error);
  }

  try {
    vibrate(normalizedPattern);
  } catch (error) {
    console.warn(`[GameLifecycle] ${warningLabel}`, error);
  }
}

function createGameState() {
  const conversation = createConversationSystem({ calls: placeholderCalls });
  const accessibility = createAccessibilitySettings();
  const ui = createUISystem({ accessibility });
  const audio = createAudioSystem();
  const achievements = createAchievementSystem({ definitions: achievementDefinitions });

  return {
    conversation,
    ui,
    audio,
    achievements,
    accessibility,
    lastSelection: null,
  };
}

export function createGameLifecycle() {
  const gameState = createGameState();
  let lastDelta = 1 / 60;
  const monitorDisplay = createMonitorDisplay({
    width: globalThis.mainCanvasSize?.x ?? 640,
    height: globalThis.mainCanvasSize?.y ?? 360,
    devicePixelRatio: globalThis.devicePixelRatio ?? 1,
  });

  function getMainCanvasSize() {
    const size = globalThis.mainCanvasSize;
    if (size?.x && size?.y) {
      return { width: size.x, height: size.y };
    }
    const canvas = globalThis.mainCanvas
      ?? globalThis.document?.getElementById?.('mainCanvas');
    if (canvas) {
      return { width: canvas.width ?? 640, height: canvas.height ?? 360 };
    }
    return { width: 640, height: 360 };
  }

  function bindKeyboardHandlers(renderState) {
    if (renderState.isComplete) {
      gameState.ui.setKeyboardSelectHandler?.(() => {});
      gameState.ui.setKeyboardRestartHandler?.(() => {
        gameState.audio.playClick();
        restartShift();
      });
    } else {
      gameState.ui.setKeyboardRestartHandler?.(null);
      gameState.ui.setKeyboardSelectHandler?.((optionIndex) => {
        const latestState = computeRenderState();
        applySelection(latestState, optionIndex, null, lastDelta);
      });
    }
  }

  function computeRenderState() {
    const conversation = gameState.conversation;
    const state = conversation.getState();
    const call = conversation.getCurrentCall();

    return {
      ...state,
      hasCalls: conversation.getCallCount() > 0,
      call,
      lastSelection: gameState.lastSelection,
      achievements: gameState.achievements.getState(),
      accessibility: gameState.accessibility.getState(),
    };
  }

  function applySelection(renderState, optionIndex, pointerPosition, delta) {
    if (!renderState.hasCalls || renderState.isComplete) {
      return;
    }
    const call = renderState.call;
    if (!call || optionIndex < 0 || optionIndex >= call.options.length) {
      return;
    }

    gameState.lastSelection = gameState.conversation.chooseOption(optionIndex);
    gameState.achievements.recordSelection(gameState.lastSelection);
    gameState.audio.playClick(pointerPosition);
    gameState.audio.playOutcome(gameState.lastSelection.correct);
    gameState.ui.notifySelection(gameState.lastSelection);
    if (!gameState.lastSelection.correct) {
      triggerHaptic([35, 55]);
    }

    const postState = gameState.conversation.getState();
    const nextCall = gameState.conversation.getCurrentCall();

    if (nextCall?.persona?.id) {
      gameState.audio.playPersonaMotif(nextCall.persona.id);
    }

    gameState.ui.update(delta, pointerPosition ?? null, nextCall);
    gameState.audio.updateEmpathyLevel(postState.empathyScore, postState.callCount);

    if (postState.isComplete) {
      gameState.audio.stopHoldLoop();
      const unlocks = gameState.achievements.completeShift({
        empathyScore: postState.empathyScore,
        callCount: postState.callCount,
      });
      if (Array.isArray(unlocks) && unlocks.length) {
        gameState.ui.notifyAchievements(unlocks);
        gameState.audio.playAchievementChime?.();
        triggerHaptic([20, 30, 20], 'Achievement haptic failed');
      }
    }
  }

  function restartShift() {
    gameState.conversation.reset();
    gameState.audio.stopAll();
    gameState.audio.startHoldLoop();
    gameState.audio.updateEmpathyLevel(0, gameState.conversation.getCallCount());
    gameState.achievements.startShift({ callCount: gameState.conversation.getCallCount() });
    const firstCall = gameState.conversation.getCurrentCall();
    if (firstCall?.persona?.id) {
      gameState.audio.playPersonaMotif(firstCall.persona.id);
    }
    gameState.lastSelection = null;
  }

  function handleInput(delta) {
    const { mouseWasPressed, mousePosScreen } = globalThis;
    if (!mouseWasPressed?.(0)) {
      const currentState = computeRenderState();
      bindKeyboardHandlers(currentState);
      gameState.ui.update(delta, mousePosScreen, currentState.call);
      return;
    }

    const renderState = computeRenderState();
    bindKeyboardHandlers(renderState);

    gameState.ui.update(delta, mousePosScreen, renderState.call);

    if (!renderState.hasCalls) {
      return;
    }

    if (renderState.isComplete) {
      restartShift();
      gameState.audio.playClick();
      bindKeyboardHandlers(computeRenderState());
      return;
    }

    const pointer = mousePosScreen;
    const optionIndex = gameState.ui.getOptionIndexAtPoint(pointer);
    applySelection(renderState, optionIndex, pointer, delta);
  }

  function render() {
    const renderState = computeRenderState();
    const originalOverlay = globalThis.overlayContext;
    const monitorContext = monitorDisplay.getContext();
    const monitorCanvas = monitorDisplay.getCanvas();
    const { width: canvasWidth, height: canvasHeight } = getMainCanvasSize();

    if (monitorContext && monitorCanvas) {
      monitorDisplay.resize(canvasWidth, canvasHeight);
      monitorDisplay.clear('#071629');

      globalThis.overlayContext = monitorContext;
      try {
        gameState.ui.render(renderState);
      } finally {
        globalThis.overlayContext = originalOverlay;
      }

      const targetContext = originalOverlay
        ?? globalThis.overlayContext
        ?? globalThis.mainContext
        ?? monitorContext;

      monitorDisplay.drawTo(targetContext, {
        dx: 0,
        dy: 0,
        dWidth: canvasWidth,
        dHeight: canvasHeight,
      });
    } else {
      gameState.ui.render(renderState);
    }
  }

  return {
    init() {
      globalThis.setShowSplashScreen?.(false);
      const loading = globalThis.document?.querySelector('.loading-state');
      loading?.remove();
      restartShift();
      bindKeyboardHandlers(computeRenderState());
    },
    update() {
      const delta = globalThis.timeDelta ?? globalThis.frameTime ?? 1 / 60;
      lastDelta = delta;
      handleInput(delta);
    },
    render,
    renderPost() {},
    updatePost() {},
    accessibility: gameState.accessibility,
  };
}
