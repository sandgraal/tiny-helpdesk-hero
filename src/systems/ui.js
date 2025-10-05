/**
 * UI system for the greybox build.
 * Renders calls, options, and empathy score using LittleJS screen-space helpers.
 */

const layout = {
  canvasPadding: 40,
  optionHeight: 60,
  optionGap: 16,
  headerY: 48,
  personaY: 96,
  promptY: 156,
  optionStartY: 240,
};

function getLittleJS() {
  const {
    drawRectScreen,
    drawTextScreen,
    mainCanvasSize,
    vec2,
  } = globalThis;
  return { drawRectScreen, drawTextScreen, mainCanvasSize, vec2 };
}

export function createUISystem() {
  function renderBackground() {
    const { drawRectScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawRectScreen || !vec2 || !mainCanvasSize) {
      return;
    }
    drawRectScreen(
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
      vec2(mainCanvasSize.x, mainCanvasSize.y),
      '#0A2239',
    );
  }

  function renderHeader({ callIndex, callCount }) {
    const { drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize) {
      return;
    }
    drawTextScreen(
      `Call ${callIndex + 1} of ${callCount}`,
      vec2(mainCanvasSize.x / 2, layout.headerY),
      26,
      '#7FDBFF',
      1,
      '#001F3F',
      2,
      0,
      'center',
    );
  }

  function renderPrompt(call) {
    const { drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !call) {
      return;
    }
    drawTextScreen(
      call.prompt,
      vec2(mainCanvasSize.x / 2, layout.promptY),
      20,
      '#FFFFFF',
      1,
      '#000000',
      1,
      0,
      'center',
    );
  }

  function renderOptions(call) {
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawRectScreen || !drawTextScreen || !vec2 || !mainCanvasSize || !call) {
      return;
    }

    const optionWidth = Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 720);
    call.options.forEach((option, index) => {
      const x = (mainCanvasSize.x - optionWidth) / 2;
      const y = layout.optionStartY + index * (layout.optionHeight + layout.optionGap);
      const center = vec2(x + optionWidth / 2, y + layout.optionHeight / 2);

      drawRectScreen(center, vec2(optionWidth, layout.optionHeight), '#1B98E0');
      drawTextScreen(
        option.text,
        vec2(center.x, center.y + 6),
        18,
        '#041C32',
        0,
        null,
        1,
        0,
        'center',
      );
    });
  }

  function renderPersonaDetails(call) {
    const { drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !call?.persona) {
      return;
    }

    const personaLine = `${call.persona.name} (${call.persona.mood})`;
    drawTextScreen(
      personaLine,
      vec2(mainCanvasSize.x / 2, layout.personaY),
      18,
      '#FFE45E',
      0,
      null,
      1,
      0,
      'center',
    );

    if (call.twist?.promptModifier) {
      drawTextScreen(
        call.twist.promptModifier,
        vec2(mainCanvasSize.x / 2, layout.personaY + 26),
        16,
        '#B8E1FF',
        0,
        null,
        1,
        0,
        'center',
      );
    }
  }

  function renderEmpathyScore(score) {
    const { drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize) {
      return;
    }

    drawTextScreen(
      `Empathy: ${score}`,
      vec2(mainCanvasSize.x - layout.canvasPadding, mainCanvasSize.y - layout.canvasPadding),
      18,
      '#F5EE9E',
      0,
      null,
      1,
      0,
      'right',
    );
  }

  function renderCompletion({ empathyScore, callCount }) {
    const { drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize) {
      return;
    }

    drawTextScreen(
      'Shift complete!',
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 - 24),
      32,
      '#4CE0D2',
      1,
      '#001F3F',
      2,
      0,
      'center',
    );
    drawTextScreen(
      `Empathy Score: ${empathyScore} / ${callCount}`,
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 + 16),
      22,
      '#FFFFFF',
      0,
      '#000000',
      1,
      0,
      'center',
    );
  }

  function renderEmptyState() {
    const { drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize) {
      return;
    }
    drawTextScreen(
      'No calls in queue. Add content in src/content/calls.js.',
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
      18,
      '#FFFFFF',
      0,
      '#000000',
      1,
      0,
      'center',
    );
  }

  function render(state) {
    renderBackground();
    if (!state.hasCalls) {
      renderEmptyState();
      return;
    }

    if (state.isComplete) {
      renderCompletion(state);
      return;
    }

    renderHeader(state);
    renderPersonaDetails(state.call);
    renderPrompt(state.call);
    renderOptions(state.call);
    renderEmpathyScore(state.empathyScore);
  }

  function getOptionIndexAtPoint(pointer) {
    const { mainCanvasSize } = getLittleJS();
    if (!mainCanvasSize || !pointer) {
      return -1;
    }

    const optionWidth = Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 720);
    const startX = (mainCanvasSize.x - optionWidth) / 2;

    const withinX = pointer.x >= startX && pointer.x <= startX + optionWidth;
    if (!withinX) {
      return -1;
    }

    const relativeY = pointer.y - layout.optionStartY;
    if (relativeY < 0) {
      return -1;
    }

    const span = layout.optionHeight + layout.optionGap;
    const index = Math.floor(relativeY / span);
    const withinHeight = relativeY % span <= layout.optionHeight;
    return withinHeight ? index : -1;
  }

  return {
    render,
    getOptionIndexAtPoint,
  };
}
