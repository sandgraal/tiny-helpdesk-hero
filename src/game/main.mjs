/**
 * Integrates systems into a LittleJS-friendly lifecycle.
 */

import { createConversationSystem } from '../systems/conversation.mjs';
import { createUISystem } from '../systems/ui.mjs';
import { createAudioSystem } from '../systems/audio.mjs';
import { placeholderCalls } from '../content/calls.mjs';
import { achievementDefinitions } from '../content/achievements.mjs';
import { createAchievementSystem } from '../systems/achievements.mjs';
import { createAccessibilitySettings } from '../systems/accessibility.mjs';
import { createMonitorDisplay } from './monitor-display.mjs';
import { createDeskScene } from './scene.mjs';
import { createCameraState } from './camera.mjs';
import { createLightingController } from '../systems/lighting/lighting-controller.mjs';
import { createPropsController } from './props-controller.mjs';
import { subscribe as subscribeSettings, getSettings } from './settings.mjs';
import { createPerformanceMonitor } from './performance-monitor.mjs';
import { monitorFrameSpec, fitMonitorFrameToCanvas, evaluateMonitorReadability } from './blockout-metrics.mjs';
import { mapScreenPointToMonitor } from './monitor-coordinates.mjs';

function triggerHaptic(pattern, warningLabel = 'Haptic trigger failed', { isAllowed } = {}) {
  if (typeof isAllowed === 'function') {
    try {
      if (!isAllowed()) {
        return;
      }
    } catch (error) {
      console.warn('[GameLifecycle] Haptic allow check failed', error);
      return;
    }
  }
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

function createGameState(options = {}) {
  const conversation = createConversationSystem({ calls: placeholderCalls });
  const accessibility = createAccessibilitySettings({
    storage: options.accessibilityStorage,
    onSystemContrastApplied: options.onSystemContrastApplied,
  });
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

export function createGameLifecycle(options = {}) {
  const gameState = createGameState(options);
  let lastDelta = 1 / 60;
  const performanceMonitor = createPerformanceMonitor();
  const monitorDesignSize = {
    width: monitorFrameSpec.safeArea.width,
    height: monitorFrameSpec.safeArea.height,
  };
  const monitorDisplay = createMonitorDisplay({
    width: monitorDesignSize.width,
    height: monitorDesignSize.height,
    devicePixelRatio: globalThis.devicePixelRatio ?? 1,
  });
  const cameraState = createCameraState();
  const lightingController = createLightingController();
  const propsController = createPropsController();
  let lastFrameSettings = getSettings();
  let lastMonitorLayout = fitMonitorFrameToCanvas(
    monitorDesignSize.width,
    monitorDesignSize.height,
  );
  let lastReadability = null;
  const deskScene = createDeskScene({
    monitorDisplay,
    camera: cameraState,
    lighting: lightingController,
    props: propsController,
  });
  subscribeSettings(({ lowPower }) => {
    cameraState.setLowPower(lowPower);
  });

  function withMonitorCanvasSize(callback) {
    const hadSize = Object.prototype.hasOwnProperty.call(globalThis, 'mainCanvasSize');
    const previousSize = hadSize ? globalThis.mainCanvasSize : null;
    globalThis.mainCanvasSize = {
      x: monitorDesignSize.width,
      y: monitorDesignSize.height,
    };
    try {
      return callback();
    } finally {
      if (hadSize) {
        globalThis.mainCanvasSize = previousSize;
      } else {
        delete globalThis.mainCanvasSize;
      }
    }
  }

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

  function applySelection(renderState, optionIndex, pointerInfo, delta) {
    if (!renderState.hasCalls || renderState.isComplete) {
      return;
    }
    const call = renderState.call;
    if (!call || optionIndex < 0 || optionIndex >= call.options.length) {
      return;
    }

    gameState.lastSelection = gameState.conversation.chooseOption(optionIndex);
    gameState.achievements.recordSelection(gameState.lastSelection);
    gameState.audio.playClick(pointerInfo?.screen ?? null);
    gameState.audio.playOutcome(gameState.lastSelection.correct);
    gameState.ui.notifySelection(gameState.lastSelection);
    if (!gameState.lastSelection.correct) {
      triggerHaptic([35, 55], 'Selection haptic failed', {
        isAllowed: () => gameState.accessibility.isHapticsEnabled?.() !== false,
      });
    }

    const postState = gameState.conversation.getState();
    const nextCall = gameState.conversation.getCurrentCall();
    propsController.update({
      empathyScore: postState.empathyScore,
      callCount: postState.callCount,
      lowPowerMode: getSettings().lowPower,
      lastSelection: gameState.lastSelection,
    });

    if (nextCall?.persona?.id) {
      gameState.audio.playPersonaMotif(nextCall.persona.id);
    }

    withMonitorCanvasSize(() => {
      gameState.ui.update(delta, pointerInfo?.monitor ?? null, nextCall);
    });
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
        triggerHaptic([20, 30, 20], 'Achievement haptic failed', {
          isAllowed: () => gameState.accessibility.isHapticsEnabled?.() !== false,
        });
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

  function handleInput(delta, settings) {
    const { mouseWasPressed, mousePosScreen } = globalThis;
    const canvasSize = getMainCanvasSize();
    lastMonitorLayout = fitMonitorFrameToCanvas(canvasSize.width, canvasSize.height);
    const pointerScreen = mousePosScreen ?? null;
    const pointerMonitor = mapScreenPointToMonitor(pointerScreen, lastMonitorLayout);

    if (!mouseWasPressed?.(0)) {
      const currentState = computeRenderState();
      bindKeyboardHandlers(currentState);
      withMonitorCanvasSize(() => {
        gameState.ui.update(delta, pointerMonitor, currentState.call);
      });
      cameraState.update({ pointer: pointerScreen, canvasSize });
      lightingController.update({
        empathyScore: currentState.empathyScore,
        callCount: currentState.callCount,
        lowPowerMode: settings.lowPower,
      });
      propsController.update({
        empathyScore: currentState.empathyScore,
        callCount: currentState.callCount,
        lowPowerMode: settings.lowPower,
        lastSelection: currentState.lastSelection,
      });
      return;
    }

    const renderState = computeRenderState();
    bindKeyboardHandlers(renderState);

    withMonitorCanvasSize(() => {
      gameState.ui.update(delta, pointerMonitor, renderState.call);
    });
    cameraState.update({ pointer: pointerScreen, canvasSize });
    lightingController.update({
      empathyScore: renderState.empathyScore,
      callCount: renderState.callCount,
      lowPowerMode: settings.lowPower,
    });
    propsController.update({
      empathyScore: renderState.empathyScore,
      callCount: renderState.callCount,
      lowPowerMode: settings.lowPower,
      lastSelection: renderState.lastSelection,
    });

    if (!renderState.hasCalls) {
      return;
    }

    if (renderState.isComplete) {
      restartShift();
      gameState.audio.playClick();
      bindKeyboardHandlers(computeRenderState());
      return;
    }

    const optionIndex = withMonitorCanvasSize(() => (
      gameState.ui.getOptionIndexAtPoint(pointerMonitor)
    ));
    const pointerInfo = { screen: pointerScreen, monitor: pointerMonitor };
    applySelection(renderState, optionIndex, pointerInfo, delta);
  }

  function render() {
    const renderState = computeRenderState();
    if (!renderState.logged) {
      console.log('[TinyHelpdeskHero] render tick', renderState.callCount, renderState.empathyScore);
      renderState.logged = true;
    }
    const settings = getSettings();
    lastFrameSettings = settings;
    const originalOverlay = globalThis.overlayContext;
    const monitorContext = monitorDisplay.getContext();
    const monitorCanvas = monitorDisplay.getCanvas();
    const { width: canvasWidth, height: canvasHeight } = getMainCanvasSize();
    const monitorLayout = fitMonitorFrameToCanvas(canvasWidth, canvasHeight);
    lastMonitorLayout = monitorLayout;
    const readability = evaluateMonitorReadability(
      canvasWidth,
      canvasHeight,
      {},
      { layout: monitorLayout },
    );
    if (!readability.isReadable && (!lastReadability || lastReadability.isReadable)) {
      console.warn(
        '[TinyHelpdeskHero][Monitor] Safe area below readability threshold',
        `${Math.round(readability.safeArea?.width ?? 0)}x${Math.round(readability.safeArea?.height ?? 0)}`,
      );
    } else if (readability.isReadable && lastReadability && !lastReadability.isReadable) {
      console.info(
        '[TinyHelpdeskHero][Monitor] Safe area readability restored',
        `${Math.round(readability.safeArea?.width ?? 0)}x${Math.round(readability.safeArea?.height ?? 0)}`,
      );
    }
    lastReadability = readability;

    if (monitorContext && monitorCanvas) {
      withMonitorCanvasSize(() => {
        monitorDisplay.resize(monitorDesignSize.width, monitorDesignSize.height);
        monitorDisplay.clear('#071629');

        globalThis.overlayContext = monitorContext;
        try {
          gameState.ui.render(renderState);
        } finally {
          globalThis.overlayContext = originalOverlay;
        }
      });

      const targetContext = originalOverlay
        ?? globalThis.overlayContext
        ?? globalThis.mainContext
        ?? monitorContext;

      deskScene.render({
        context: targetContext,
        canvasSize: { width: canvasWidth, height: canvasHeight },
        renderState,
        settings,
        monitorLayout,
      });
    } else {
      withMonitorCanvasSize(() => {
        gameState.ui.render(renderState);
      });
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
      performanceMonitor.markFrameStart();
      const delta = globalThis.timeDelta ?? globalThis.frameTime ?? 1 / 60;
      lastDelta = delta;
      const settings = getSettings();
      lastFrameSettings = settings;
      handleInput(delta, settings);
    },
    render,
    renderPost() {
      performanceMonitor.markFrameEnd({
        lowPower: Boolean(lastFrameSettings.lowPower),
        delta: lastDelta,
      });
    },
    updatePost() {},
    accessibility: gameState.accessibility,
  };
}
