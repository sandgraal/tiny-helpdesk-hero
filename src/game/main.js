/**
 * Integrates systems into a LittleJS-friendly lifecycle.
 */

import { createConversationSystem } from '../systems/conversation.js';
import { createUISystem } from '../systems/ui.js';
import { createAudioSystem } from '../systems/audio.js';
import { placeholderCalls } from '../content/calls.js';

function createGameState() {
  const conversation = createConversationSystem({ calls: placeholderCalls });
  const ui = createUISystem();
  const audio = createAudioSystem();

  return {
    conversation,
    ui,
    audio,
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
    };
  }

  function restartShift() {
    gameState.conversation.reset();
    gameState.audio.stopAll();
    gameState.audio.startHoldLoop();
    gameState.audio.updateEmpathyLevel(0, gameState.conversation.getCallCount());
    gameState.lastSelection = null;
  }

  function handleInput(delta) {
    const { mouseWasPressed, mousePosScreen } = globalThis;
    if (!mouseWasPressed?.(0)) {
      const call = computeRenderState().call;
      gameState.ui.update(delta, mousePosScreen, call);
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
    gameState.audio.playClick(pointer);
    gameState.audio.playOutcome(gameState.lastSelection.correct);

    const postState = gameState.conversation.getState();
    gameState.audio.updateEmpathyLevel(postState.empathyScore, postState.callCount);
    if (postState.isComplete) {
      gameState.audio.stopHoldLoop();
    }
  }

  function render() {
    const renderState = computeRenderState();
    gameState.ui.render(renderState);
  }

  return {
    init() {
      globalThis.setShowSplashScreen?.(false);
      restartShift();
    },
    update() {
      const delta = globalThis.timeDelta ?? globalThis.frameTime ?? 1 / 60;
      handleInput(delta);
    },
    render,
    renderPost() {},
    updatePost() {},
  };
}
