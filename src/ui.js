/**
 * UI helpers for Tiny Helpdesk Hero.
 * TODO:
 *  - Extract layout constants into responsive helpers.
 *  - Animate buttons, indicators, and empathy meter states.
 *  - Support modular components for future screen transitions.
 */

const layout = {
  marginTop: 220,
  buttonHeight: 60,
  buttonSpacing: 15,
  horizontalPadding: 40,
  maxButtonWidth: 700,
};

export function getOptionIndexFromClick(call, pointer, canvasSize) {
  if (!call || !pointer || pointer.x === undefined) {
    return -1;
  }

  const buttonWidth = Math.min(canvasSize.x - layout.horizontalPadding * 2, layout.maxButtonWidth);
  for (let i = 0; i < call.options.length; i += 1) {
    const x = (canvasSize.x - buttonWidth) / 2;
    const y = layout.marginTop + i * (layout.buttonHeight + layout.buttonSpacing);

    if (
      pointer.x >= x &&
      pointer.x <= x + buttonWidth &&
      pointer.y >= y &&
      pointer.y <= y + layout.buttonHeight
    ) {
      return i;
    }
  }

  return -1;
}

export function renderCallScreen({ call, empathyScore, callIndex, callCount, ended }) {
  // Background gradient color (drawn as single rect)
  drawRectScreen(
    vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
    vec2(mainCanvasSize.x, mainCanvasSize.y),
    '#051923',
  );

  if (!ended && call) {
    drawTextScreen(
      `Call ${callIndex + 1} of ${callCount}`,
      vec2(mainCanvasSize.x / 2, 40),
      26,
      '#00e0ff',
      1,
      '#001f3f',
      2,
      0,
      'center',
    );

    drawTextScreen(
      call.message,
      vec2(mainCanvasSize.x / 2, 100),
      20,
      '#ffffff',
      1,
      '#000000',
      1,
      0,
      'center',
    );

    const buttonWidth = Math.min(mainCanvasSize.x - layout.horizontalPadding * 2, layout.maxButtonWidth);
    for (let i = 0; i < call.options.length; i += 1) {
      const y = layout.marginTop + i * (layout.buttonHeight + layout.buttonSpacing);
      const x = (mainCanvasSize.x - buttonWidth) / 2;
      const bgColor = '#76c893';

      drawRectScreen(
        vec2(x + buttonWidth / 2, y + layout.buttonHeight / 2),
        vec2(buttonWidth, layout.buttonHeight),
        bgColor,
      );
      drawTextScreen(
        call.options[i].text,
        vec2(x + buttonWidth / 2, y + layout.buttonHeight / 2 + 6),
        18,
        '#051923',
        0,
        null,
        1,
        0,
        'center',
      );
    }

    drawTextScreen(
      `Empathy Score: ${empathyScore}`,
      vec2(mainCanvasSize.x - 20, mainCanvasSize.y - 20),
      18,
      '#FFB703',
      0,
      null,
      1,
      0,
      'right',
    );
  } else {
    drawTextScreen(
      'All calls resolved!',
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 - 40),
      32,
      '#00ff88',
      1,
      '#001f3f',
      2,
      0,
      'center',
    );
    drawTextScreen(
      `Final Empathy Score: ${empathyScore} / ${callCount}`,
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 + 10),
      24,
      '#ffffff',
      0,
      '#000000',
      1,
      0,
      'center',
    );
    drawTextScreen(
      'Refresh to play again or add more calls!',
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 + 50),
      16,
      '#aaaaaa',
      0,
      null,
      1,
      0,
      'center',
    );
  }
}

export function resetLayout() {
  // TODO: When the UI becomes animated, expose hooks to reset tween states here.
}

export const uiLayout = layout;
