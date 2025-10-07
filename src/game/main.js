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
      gameState.ui.update(delta, mousePosScreen, currentState.call);
      return;
    }

    const renderState = computeRenderState();

    gameState.ui.update(delta, mousePosScreen, renderState.call);

    if (!renderState.hasCalls) {
      return;
    }

    if (renderState.isComplete) {
      restartShift();
      gameState.audio.playClick();
      return;
    }

    const pointer = mousePosScreen;
    const optionIndex = gameState.ui.getOptionIndexAtPoint(pointer);
    const call = renderState.call;

    if (!call || optionIndex < 0 || optionIndex >= call.options.length) {
      return;
    }

    gameState.lastSelection = gameState.conversation.chooseOption(optionIndex);
    gameState.achievements.recordSelection(gameState.lastSelection);
    gameState.audio.playClick(pointer);
    gameState.audio.playOutcome(gameState.lastSelection.correct);
    gameState.ui.notifySelection(gameState.lastSelection);

    const postState = gameState.conversation.getState();
    const nextCall = gameState.conversation.getCurrentCall();
    if (gameState.lastSelection.nextCall?.persona?.id) {
      gameState.audio.playPersonaMotif(gameState.lastSelection.nextCall.persona.id);
    }
    gameState.ui.update(delta, mousePosScreen, nextCall);
    gameState.audio.updateEmpathyLevel(postState.empathyScore, postState.callCount);
    if (postState.isComplete) {
      gameState.audio.stopHoldLoop();
      const unlocks = gameState.achievements.completeShift({
        empathyScore: postState.empathyScore,
        callCount: postState.callCount,
      });
      if (Array.isArray(unlocks) && unlocks.length) {
        gameState.ui.notifyAchievements(unlocks);
      }
    }
  }

  function render() {
    const renderState = computeRenderState();
    gameState.ui.render(renderState);
  }

  return {
    init() {
      globalThis.setShowSplashScreen?.(false);
      const loading = globalThis.document?.querySelector('.loading-state');
      loading?.remove();
      restartShift();
    },
    update() {
      const delta = globalThis.timeDelta ?? globalThis.frameTime ?? 1 / 60;
      handleInput(delta);
    },
    render,
    renderPost() {},
    updatePost() {},
    accessibility: gameState.accessibility,
  };
}
