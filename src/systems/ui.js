import { createHoverState, createPulseState } from './animation/tween.js';

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
  const fallbackVec2 = (x = 0, y = 0) => ({ x, y });
  const vec2 = typeof globalThis.vec2 === 'function' ? globalThis.vec2 : fallbackVec2;

  const canvas = globalThis.mainCanvas
    ?? globalThis.document?.getElementById?.('mainCanvas')
    ?? globalThis.document?.querySelector?.('canvas');
  const context = globalThis.overlayContext ?? globalThis.mainContext ?? canvas?.getContext?.('2d');

  const mainCanvasSize = (globalThis.mainCanvasSize?.x && globalThis.mainCanvasSize?.y)
    ? globalThis.mainCanvasSize
    : (canvas ? vec2(canvas.width, canvas.height) : vec2(1280, 720));

  const drawRectScreen = (center, size, color = '#ffffff') => {
    if (!context || !center || !size) {
      return;
    }
    const width = size.x ?? 0;
    const height = size.y ?? 0;
    const x = (center.x ?? 0) - width / 2;
    const y = (center.y ?? 0) - height / 2;
    context.save?.();
    context.globalAlpha = 1;
    context.fillStyle = color;
    context.fillRect?.(x, y, width, height);
    context.restore?.();
  };

  const drawTextScreen = (
    text,
    position,
    size = 16,
    color = '#ffffff',
    lineWidth = 0,
    lineColor = '#000000',
    alpha = 1,
    angle = 0,
    align = 'left',
  ) => {
    if (!context || !position) {
      return;
    }
    const x = position.x ?? 0;
    const y = position.y ?? 0;
    context.save?.();
    context.translate?.(x, y);
    if (angle) {
      context.rotate?.(angle);
    }
    context.font = `${size}px sans-serif`;
    context.textAlign = align ?? 'left';
    context.textBaseline = 'middle';
    context.globalAlpha = alpha ?? 1;
    if (lineWidth && lineColor) {
      context.lineWidth = lineWidth;
      context.strokeStyle = lineColor || '#000000';
      context.strokeText?.(text, 0, 0);
    }
    context.fillStyle = color;
    context.fillText?.(text, 0, 0);
    context.restore?.();
  };

  return { drawRectScreen, drawTextScreen, mainCanvasSize, vec2 };
}

export function createUISystem() {
  const hoverStates = new Map();
  const empathyPulse = createPulseState({ duration: 0.6 });
  const callPulse = createPulseState({ duration: 0.5 });
  const achievementPulse = createPulseState({ duration: 0.8 });

  function getOptionKey(option, index) {
    return option?.id ?? `option-${index}`;
  }

  function ensureHoverState(optionKey) {
    let state = hoverStates.get(optionKey);
    if (!state) {
      state = createHoverState({ duration: 0.18 });
      hoverStates.set(optionKey, state);
    }
    return state;
  }

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

  function renderHeader({ currentIndex, callCount }) {
    const { drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize) {
      return;
    }
    const pulseOffset = callPulse.getValue() * 6;
    const safeIndex = Number.isFinite(currentIndex) ? currentIndex : 0;
    const safeCount = Number.isFinite(callCount) ? callCount : 0;
    drawTextScreen(
      `Call ${safeIndex + 1} of ${safeCount}`,
      vec2(mainCanvasSize.x / 2, layout.headerY - pulseOffset),
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
    const pulseOffset = callPulse.getValue() * 12;
    drawTextScreen(
      call.prompt,
      vec2(mainCanvasSize.x / 2, layout.promptY - pulseOffset),
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
      const hoverValue = ensureHoverState(getOptionKey(option, index)).getValue();
      const bgColor = hoverValue > 0.01 ? '#56CCF2' : '#1B98E0';
      const textYOffset = 6 - hoverValue * 4;

      drawRectScreen(center, vec2(optionWidth, layout.optionHeight), bgColor);
      drawTextScreen(
        option.text,
        vec2(center.x, center.y + textYOffset),
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
      vec2(mainCanvasSize.x - layout.canvasPadding, mainCanvasSize.y - layout.canvasPadding - 40),
      18,
      '#F5EE9E',
      0,
      null,
      1,
      0,
      'right',
    );
  }

  function renderEmpathyMeter({ empathyScore, callCount }) {
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawRectScreen || !vec2 || !mainCanvasSize) {
      return;
    }

    const ratio = callCount > 0 ? Math.min(Math.max(empathyScore / callCount, 0), 1) : 0;
    const baseWidth = 220;
    const baseHeight = 16;
    const x = layout.canvasPadding + baseWidth / 2;
    const y = mainCanvasSize.y - layout.canvasPadding - baseHeight / 2;
    const pulse = empathyPulse.getValue();
    const fillWidth = Math.max(4, ratio * baseWidth);

    drawRectScreen(vec2(x, y), vec2(baseWidth, baseHeight), '#0F4C75');
    drawRectScreen(
      vec2(x - baseWidth / 2 + fillWidth / 2, y),
      vec2(fillWidth, baseHeight - 4),
      pulse > 0.01 ? '#65FFDA' : '#4CC9F0',
    );

    drawTextScreen(
      `${Math.round(ratio * 100)}%`,
      vec2(x, y - 20),
      16,
      '#E9F1F7',
      0,
      null,
      1,
      0,
      'center',
    );
  }

  function renderQueueIndicator({ callCount, currentIndex, isComplete }) {
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawRectScreen || !vec2 || !mainCanvasSize) {
      return;
    }
    const safeIndex = Number.isFinite(currentIndex) ? currentIndex : 0;
    const safeCount = Number.isFinite(callCount) ? callCount : 0;
    const remaining = isComplete ? 0 : Math.max(safeCount - safeIndex - 1, 0);
    const width = 160;
    const height = 28;
    const x = mainCanvasSize.x - layout.canvasPadding - width / 2;
    const y = layout.headerY + 16;
    const pulse = callPulse.getValue();
    const bg = pulse > 0.01 ? '#FFD166' : '#F7B801';

    drawRectScreen(vec2(x, y), vec2(width, height), '#1F1F3B');
    drawRectScreen(vec2(x, y), vec2(width - 6, height - 6), bg);
    drawTextScreen(
      remaining > 0 ? `${remaining} in queue` : isComplete ? 'Queue clear' : 'Last caller',
      vec2(x, y + 4),
      16,
      '#091540',
      0,
      null,
      1,
      0,
      'center',
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

  function renderAchievements(achievementsState) {
    if (!achievementsState) {
      return;
    }
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize } = getLittleJS();
    if (!drawRectScreen || !drawTextScreen || !vec2 || !mainCanvasSize) {
      return;
    }

    const panelWidth = Math.min(340, Math.max(260, mainCanvasSize.x * 0.28));
    const entries = achievementsState.entries ?? [];
    const visible = entries.slice(0, 3);
    if (!visible.length) {
      return;
    }

    const panelHeight = 64 + visible.length * 44;
    const centerX = mainCanvasSize.x - layout.canvasPadding - panelWidth / 2;
    const centerY = layout.canvasPadding + panelHeight / 2;
    const accent = achievementPulse.getValue();
    const headerColor = accent > 0 ? '#FFD166' : '#7FDBFF';
    const headerAlpha = 0.9 + accent * 0.1;

    drawRectScreen(
      vec2(centerX, centerY),
      vec2(panelWidth, panelHeight),
      '#0D1E30',
    );

    drawTextScreen(
      `Achievements ${achievementsState.unlockedCount}/${achievementsState.total}`,
      vec2(centerX, centerY - panelHeight / 2 + 26),
      18,
      headerColor,
      0,
      '#001F3F',
      headerAlpha,
      0,
      'center',
    );

    const recentSet = new Set(achievementsState.recentUnlocks ?? []);
    const contentLeft = centerX - panelWidth / 2 + 24;
    let rowY = centerY - panelHeight / 2 + 58;

    visible.forEach((entry) => {
      const unlocked = entry.unlocked;
      const fresh = recentSet.has(entry.id);
      const titleColor = fresh ? '#FFD166' : unlocked ? '#4CE0D2' : '#7A8BA3';
      const bodyColor = unlocked ? '#D8F3FF' : '#7A8BA3';
      const alpha = fresh ? 1 : unlocked ? 0.95 : 0.8;
      const bullet = unlocked ? '✓' : '•';

      drawTextScreen(
        `${bullet} ${entry.title}`,
        vec2(contentLeft, rowY),
        16,
        titleColor,
        0,
        '#001F3F',
        alpha,
        0,
        'left',
      );

      drawTextScreen(
        entry.description,
        vec2(contentLeft + 8, rowY + 18),
        12,
        bodyColor,
        0,
        '#001F3F',
        alpha,
        0,
        'left',
      );

      rowY += 44;
    });
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
    renderEmpathyMeter(state);
    renderQueueIndicator(state);
    renderAchievements(state.achievements);
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

  function update(delta = 0, pointer, call) {
    const hoveredIndex = pointer ? getOptionIndexAtPoint(pointer) : -1;
    const validHovered = call && hoveredIndex >= 0 && hoveredIndex < call.options.length ? hoveredIndex : -1;

    if (call?.options) {
      call.options.forEach((option, index) => {
        const state = ensureHoverState(getOptionKey(option, index));
        state.setActive(index === validHovered);
        state.update(delta);
      });

      const currentKeys = new Set(call.options.map((option, index) => getOptionKey(option, index)));
      hoverStates.forEach((_, key) => {
        if (!currentKeys.has(key)) {
          hoverStates.delete(key);
        }
      });
    } else {
      hoverStates.clear();
    }

    empathyPulse.update(delta);
    callPulse.update(delta);
    achievementPulse.update(delta);
  }

  function notifySelection(result) {
    if (result?.correct) {
      empathyPulse.trigger();
    }
    if (result?.nextCall) {
      callPulse.trigger();
    }
  }

  function notifyAchievements(unlocks) {
    if (Array.isArray(unlocks) && unlocks.length) {
      achievementPulse.trigger();
    }
  }

  return {
    render,
    update,
    getOptionIndexAtPoint,
    notifySelection,
    notifyAchievements,
  };
}
