'use strict';

// Humorous call list with messages and options
const calls = [
  {
    message: "Caller: My desktop icons are so small I need a microscope! What do I do?",
    options: [
      { text: "Guide them to press Ctrl + Plus to zoom in", correct: true },
      { text: "Suggest buying a bigger monitor", correct: false },
      { text: "Tell them to restart their computer", correct: false }
    ]
  },
  {
    message: "Caller: The text on my screen is miniature. I swear it shrunk overnight!",
    options: [
      { text: "Explain how to adjust display scaling settings", correct: true },
      { text: "Advise them to squint harder", correct: false },
      { text: "Tell them it’s a virus and they’re doomed", correct: false }
    ]
  },
  {
    message: "Caller: The USB port is too small for my cable — can you please enlarge it?",
    options: [
      { text: "Suggest flipping the cable and gently inserting it", correct: true },
      { text: "Recommend using a hammer to widen the port", correct: false },
      { text: "Tell them to call a carpenter", correct: false }
    ]
  },
  {
    message: "Caller: My AI assistant refuses to talk to me because I’m not empathetic enough.",
    options: [
      { text: "Advise them to ask nicely and schedule a feelings check", correct: true },
      { text: "Suggest reinstalling the operating system", correct: false },
      { text: "Tell them to unplug it and plug it back in", correct: false }
    ]
  },
  {
    message: "Caller: The cat gif on my desktop has stopped looping and it’s ruining my day.",
    options: [
      { text: "Explain how to refresh or reopen the GIF", correct: true },
      { text: "Suggest tapping the monitor gently", correct: false },
      { text: "Tell them it’s a sign they should adopt a real cat", correct: false }
    ]
  },
  {
    message: "Caller: The volume slider is tiny and I can’t grab it.",
    options: [
      { text: "Use keyboard arrow keys to adjust the volume", correct: true },
      { text: "Recommend using tweezers", correct: false },
      { text: "Tell them to yell louder at the computer", correct: false }
    ]
  }
];

let currentIndex = 0;
let empathyScore = 0;
let ended = false;

// Simple click sound for feedback
const soundClick = new Sound([1, 0.5]);

function nextCall() {
  currentIndex++;
  if (currentIndex >= calls.length) {
    ended = true;
  }
}

function gameInit() {
  setShowSplashScreen(false);
}

function gameUpdate() {
  if (ended) return;
  if (mouseWasPressed(0)) {
    const m = mousePosScreen;
    if (!m.x) return;
    const call = calls[currentIndex];
    const marginTop = 220;
    const buttonHeight = 60;
    const buttonSpacing = 15;
    const buttonWidth = Math.min(mainCanvasSize.x - 80, 700);
    for (let i = 0; i < call.options.length; i++) {
      const y = marginTop + i * (buttonHeight + buttonSpacing);
      const x = (mainCanvasSize.x - buttonWidth) / 2;
      if (m.x >= x && m.x <= x + buttonWidth && m.y >= y && m.y <= y + buttonHeight) {
        soundClick.play(m);
        if (call.options[i].correct) {
          empathyScore++;
        }
        nextCall();
        break;
      }
    }
  }
}

function gameRender() {
  // Background gradient color (drawn as single rect)
  drawRectScreen(vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2), vec2(mainCanvasSize.x, mainCanvasSize.y), '#051923');
  if (!ended) {
    const call = calls[currentIndex];
    drawTextScreen('Call ' + (currentIndex + 1) + ' of ' + calls.length, vec2(mainCanvasSize.x / 2, 40), 26, '#00e0ff', 1, '#001f3f', 2, 0, 'center');
    drawTextScreen(call.message, vec2(mainCanvasSize.x / 2, 100), 20, '#ffffff', 1, '#000000', 1, 0, 'center');

    const marginTop = 220;
    const buttonHeight = 60;
    const buttonSpacing = 15;
    const buttonWidth = Math.min(mainCanvasSize.x - 80, 700);
    for (let i = 0; i < call.options.length; i++) {
      const y = marginTop + i * (buttonHeight + buttonSpacing);
      const x = (mainCanvasSize.x - buttonWidth) / 2;
      const bgColor = '#76c893';
      drawRectScreen(vec2(x + buttonWidth / 2, y + buttonHeight / 2), vec2(buttonWidth, buttonHeight), bgColor);
      drawTextScreen(call.options[i].text, vec2(x + buttonWidth / 2, y + buttonHeight / 2 + 6), 18, '#051923', 0, null, 1, 0, 'center');
    }

    drawTextScreen('Empathy Score: ' + empathyScore, vec2(mainCanvasSize.x - 20, mainCanvasSize.y - 20), 18, '#FFB703', 0, null, 1, 0, 'right');
  } else {
    drawTextScreen('All calls resolved!', vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 - 40), 32, '#00ff88', 1, '#001f3f', 2, 0, 'center');
    drawTextScreen('Final Empathy Score: ' + empathyScore + ' / ' + calls.length, vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 + 10), 24, '#ffffff', 0, '#000000', 1, 0, 'center');
    drawTextScreen('Refresh to play again or add more calls!', vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 + 50), 16, '#aaaaaa', 0, null, 1, 0, 'center');
  }
}

function gameUpdatePost() {}
function gameRenderPost() {}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
