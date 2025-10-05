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

const {
  engineInit,
  setShowSplashScreen,
  mouseWasPressed,
  mousePosScreen,
  mainCanvasSize,
} = globalThis;

let empathyScore = 0;
let ended = false;
const soundClick = createUIClickSound();

function restartGame() {
  resetCalls();
  resetLayout();
  stopAllAudio();
  empathyScore = 0;
  ended = false;
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
  setShowSplashScreen(false);
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

  if (mouseWasPressed(0)) {
    const pointer = mousePosScreen;
    const optionIndex = getOptionIndexFromClick(currentCall, pointer, mainCanvasSize);
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

  renderCallScreen({
    call,
    empathyScore,
    callIndex,
    callCount,
    ended: ended || isDeckComplete(),
  });
}

function gameUpdatePost() {}
function gameRenderPost() {}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
