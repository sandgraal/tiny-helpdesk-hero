import {
  advanceCall,
  getCallCount,
  getCurrentCall,
  getCurrentIndex,
  isDeckComplete,
  resetCalls,
} from './conversationEngine.js';
import { getOptionIndexFromClick, renderCallScreen, resetLayout } from './ui.js';
import { createUIClickSound, playUIClick, stopAllAudio } from './audio.js';

let empathyScore = 0;
let ended = false;
let soundClick = null;

function restartGame() {
  resetCalls();
  resetLayout();
  stopAllAudio();
  empathyScore = 0;
  ended = false;
  if (!soundClick) {
    soundClick = createUIClickSound();
  }
}

function progressAfterSelection(option, pointer) {
  if (option?.correct) {
    empathyScore += 1;
  }
  playUIClick(soundClick, pointer);

  const nextCall = advanceCall();
  if (!nextCall) {
    ended = true;
  }
}

function gameInit() {
  globalThis.setShowSplashScreen?.(false);
  restartGame();
}

function gameUpdate() {
  if (ended) {
    return;
  }

  const currentCall = getCurrentCall();
  if (!currentCall) {
    ended = true;
    return;
  }

  if (globalThis.mouseWasPressed?.(0)) {
    const pointer = globalThis.mousePosScreen;
    const canvasSize = globalThis.mainCanvasSize;
    const optionIndex = getOptionIndexFromClick(currentCall, pointer, canvasSize);
    if (optionIndex === -1) {
      return;
    }

    const selectedOption = currentCall.options[optionIndex];
    progressAfterSelection(selectedOption, pointer);
  }
}

function gameRender() {
  const call = getCurrentCall();
  const callCount = getCallCount();
  const callIndex = Math.min(getCurrentIndex(), Math.max(0, callCount - 1));
  const canvasSize = globalThis.mainCanvasSize;

  renderCallScreen({
    call,
    empathyScore,
    callIndex,
    callCount,
    ended: ended || isDeckComplete(),
    canvasSize,
  });
}

function gameUpdatePost() {}
function gameRenderPost() {}

let engineStarted = false;
function bootstrapLittleJS() {
  if (engineStarted) {
    return;
  }

  if (typeof globalThis.engineInit === 'function') {
    engineStarted = true;
    globalThis.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
    return;
  }

  globalThis.setTimeout?.(bootstrapLittleJS, 0);
}

bootstrapLittleJS();
