import { createHoverState, createPulseState } from './animation/tween.js';

/**
 * UI system for the greybox build.
 * Renders calls, options, and empathy score using LittleJS screen-space helpers.
 */

function getLayoutForSize(mainCanvasSize) {
  const width = mainCanvasSize?.x ?? 1280;

  if (width <= 480) {
    return {
      canvasPadding: 16,
      optionHeight: 48,
      optionGap: 10,
      headerY: 32,
      personaY: 58,
      promptY: 108,
      optionStartY: 188,
      fontScale: 0.85,
      achievementsPosition: 'bottom',
      achievementsMaxVisible: 2,
    };
  }

  if (width <= 900) {
    return {
      canvasPadding: 24,
      optionHeight: 54,
      optionGap: 12,
      headerY: 40,
      personaY: 78,
      promptY: 140,
      optionStartY: 216,
      fontScale: 0.92,
      achievementsPosition: 'right',
      achievementsMaxVisible: 3,
    };
  }

  return {
    canvasPadding: 40,
    optionHeight: 60,
    optionGap: 16,
    headerY: 48,
    personaY: 96,
    promptY: 156,
    optionStartY: 240,
    fontScale: 1,
    achievementsPosition: 'right',
    achievementsMaxVisible: 3,
  };
}

function getLittleJS(overrides = {}) {
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
    const fontFamily = overrides.fontFamily
      ?? (overrides.dyslexiaFriendly
        ? "Atkinson Hyperlegible, OpenDyslexic, 'Segoe UI', sans-serif"
        : "'Segoe UI', sans-serif");
    context.font = `${size}px ${fontFamily}`;
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

  const layout = getLayoutForSize(mainCanvasSize);
  layout.fontScale *= overrides.fontScale ?? 1;
  layout.highContrast = Boolean(overrides.highContrast);

  return {
    drawRectScreen,
    drawTextScreen,
    mainCanvasSize,
    vec2,
    layout,
  };
}

export function createUISystem({ accessibility } = {}) {
  const hoverStates = new Map();
  const empathyPulse = createPulseState({ duration: 0.6 });
  const callPulse = createPulseState({ duration: 0.5 });
  const achievementPulse = createPulseState({ duration: 0.8 });
  const panelState = {
    autoHideInitialized: false,
    achievementTimer: 0,
    achievementVisible: true,
    touchInteractionTimer: 0,
  };
  let accessibilityState = accessibility?.getState?.() ?? {
    fontScale: 1,
    dyslexiaFriendly: false,
    highContrast: false,
  };

  accessibility?.subscribe?.((next) => {
    accessibilityState = {
      fontScale: next.fontScale ?? 1,
      dyslexiaFriendly: Boolean(next.dyslexiaFriendly),
      highContrast: Boolean(next.highContrast),
    };
  });

  function useLittleJS() {
    const dyslexiaStack = '"Atkinson Hyperlegible", "OpenDyslexic", "Segoe UI", sans-serif';
    const defaultStack = '"Segoe UI", sans-serif';
    return getLittleJS({
      fontScale: accessibilityState.fontScale,
      dyslexiaFriendly: accessibilityState.dyslexiaFriendly,
      highContrast: accessibilityState.highContrast,
      fontFamily: accessibilityState.dyslexiaFriendly ? dyslexiaStack : defaultStack,
    });
  }

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
    const { drawRectScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawRectScreen || !vec2 || !mainCanvasSize || !layout) {
      return;
    }
    const bgColor = layout.highContrast ? '#000000' : '#0A2239';
    drawRectScreen(
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
      vec2(mainCanvasSize.x, mainCanvasSize.y),
      bgColor,
    );
  }

  function renderHeader({ currentIndex, callCount }) {
    const { drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout) {
      return;
    }
    const pulseOffset = callPulse.getValue() * 6;
    const safeIndex = Number.isFinite(currentIndex) ? currentIndex : 0;
    const safeCount = Number.isFinite(callCount) ? callCount : 0;
    drawTextScreen(
      `Call ${safeIndex + 1} of ${safeCount}`,
      vec2(mainCanvasSize.x / 2, layout.headerY - pulseOffset),
      Math.round(26 * layout.fontScale),
      layout.highContrast ? '#FFD166' : '#7FDBFF',
      1,
      layout.highContrast ? '#000000' : '#001F3F',
      2,
      0,
      'center',
    );
  }

  function renderPrompt(call) {
    const { drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout || !call) {
      return;
    }
    const pulseOffset = callPulse.getValue() * 12;
    drawTextScreen(
      call.prompt,
      vec2(mainCanvasSize.x / 2, layout.promptY - pulseOffset),
      Math.round(20 * layout.fontScale),
      layout.highContrast ? '#FFFFFF' : '#FFFFFF',
      1,
      layout.highContrast ? '#000000' : '#000000',
      1,
      0,
      'center',
    );
  }

  function renderOptions(call) {
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawRectScreen || !drawTextScreen || !vec2 || !mainCanvasSize || !layout || !call) {
      return;
    }

    const optionWidth = Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 720);
    call.options.forEach((option, index) => {
      const x = (mainCanvasSize.x - optionWidth) / 2;
      const y = layout.optionStartY + index * (layout.optionHeight + layout.optionGap);
      const center = vec2(x + optionWidth / 2, y + layout.optionHeight / 2);
      const hoverValue = ensureHoverState(getOptionKey(option, index)).getValue();
      const bgColor = layout.highContrast
        ? hoverValue > 0.01 ? '#FFFFFF' : '#CCCCCC'
        : hoverValue > 0.01 ? '#56CCF2' : '#1B98E0';
      const textYOffset = 6 - hoverValue * 4;

      drawRectScreen(center, vec2(optionWidth, layout.optionHeight), bgColor);
      drawTextScreen(
        option.text,
        vec2(center.x, center.y + textYOffset),
        Math.round(18 * layout.fontScale),
        layout.highContrast ? '#000000' : '#041C32',
        0,
        null,
        1,
        0,
        'center',
      );
    });
  }

  function renderPersonaDetails(call) {
    const { drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout || !call?.persona) {
      return;
    }

    const personaLine = `${call.persona.name} (${call.persona.mood})`;
    drawTextScreen(
      personaLine,
      vec2(mainCanvasSize.x / 2, layout.personaY),
      Math.round(18 * layout.fontScale),
      layout.highContrast ? '#FFD166' : '#FFE45E',
      0,
      null,
      1,
      0,
      'center',
    );

    if (call.twist?.promptModifier) {
      drawTextScreen(
        call.twist.promptModifier,
        vec2(mainCanvasSize.x / 2, layout.personaY + 26 * layout.fontScale),
        Math.round(16 * layout.fontScale),
        layout.highContrast ? '#FFFFFF' : '#B8E1FF',
        0,
        null,
        1,
        0,
        'center',
      );
    }
  }

  function renderEmpathyScore(score) {
    const { drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout) {
      return;
    }

    drawTextScreen(
      `Empathy: ${score}`,
      vec2(mainCanvasSize.x - layout.canvasPadding, mainCanvasSize.y - layout.canvasPadding - 40 * layout.fontScale),
      Math.round(18 * layout.fontScale),
      layout.highContrast ? '#FFD166' : '#F5EE9E',
      0,
      null,
      1,
      0,
      'right',
    );
  }

  function renderEmpathyMeter({ empathyScore, callCount }) {
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawRectScreen || !vec2 || !mainCanvasSize || !layout) {
      return;
    }

    const ratio = callCount > 0 ? Math.min(Math.max(empathyScore / callCount, 0), 1) : 0;
    const baseWidth = layout.achievementsPosition === 'bottom' ? mainCanvasSize.x - layout.canvasPadding * 2 : 220;
    const baseHeight = 16;
    const x = layout.canvasPadding + baseWidth / 2;
    const y = mainCanvasSize.y - layout.canvasPadding - baseHeight / 2;
    const pulse = empathyPulse.getValue();
    const fillWidth = Math.max(4, ratio * baseWidth);

    drawRectScreen(vec2(x, y), vec2(baseWidth, baseHeight), layout.highContrast ? '#FFFFFF' : '#0F4C75');
    drawRectScreen(
      vec2(x - baseWidth / 2 + fillWidth / 2, y),
      vec2(fillWidth, baseHeight - 4),
      layout.highContrast
        ? (pulse > 0.01 ? '#FFD166' : '#F7B801')
        : (pulse > 0.01 ? '#65FFDA' : '#4CC9F0'),
    );

    drawTextScreen(
      `${Math.round(ratio * 100)}%`,
      vec2(x, y - 20),
      Math.round(16 * layout.fontScale),
      layout.highContrast ? '#FFFFFF' : '#E9F1F7',
      0,
      null,
      1,
      0,
      'center',
    );
  }

  function renderQueueIndicator({ callCount, currentIndex, isComplete }) {
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawRectScreen || !vec2 || !mainCanvasSize || !layout) {
      return;
    }
    const safeIndex = Number.isFinite(currentIndex) ? currentIndex : 0;
    const safeCount = Number.isFinite(callCount) ? callCount : 0;
    const remaining = isComplete ? 0 : Math.max(safeCount - safeIndex - 1, 0);
    const width = layout.achievementsPosition === 'bottom' ? 180 : 160;
    const height = 28;
    const x = mainCanvasSize.x - layout.canvasPadding - width / 2;
    const y = layout.headerY + 16;
    const pulse = callPulse.getValue();
    const frameColor = layout.highContrast ? '#FFFFFF' : '#1F1F3B';
    const bg = pulse > 0.01 ? '#FFD166' : '#F7B801';

    drawRectScreen(vec2(x, y), vec2(width, height), frameColor);
    drawRectScreen(vec2(x, y), vec2(width - 6, height - 6), layout.highContrast ? '#000000' : bg);
    drawTextScreen(
      remaining > 0 ? `${remaining} in queue` : isComplete ? 'Queue clear' : 'Last caller',
      vec2(x, y + 4),
      Math.round(16 * layout.fontScale),
      layout.highContrast ? '#FFFFFF' : '#091540',
      0,
      null,
      1,
      0,
      'center',
    );
  }

  function renderCompletion({ empathyScore, callCount }) {
    const { drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout) {
      return;
    }

    drawTextScreen(
      'Shift complete!',
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 - 24),
      Math.round(32 * layout.fontScale),
      layout.highContrast ? '#FFFFFF' : '#4CE0D2',
      1,
      '#001F3F',
      2,
      0,
      'center',
    );
    drawTextScreen(
      `Empathy Score: ${empathyScore} / ${callCount}`,
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 + 16),
      Math.round(22 * layout.fontScale),
      layout.highContrast ? '#FFFFFF' : '#FFFFFF',
      0,
      '#000000',
      1,
      0,
      'center',
    );
  }

  function renderEmptyState() {
    const { drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout) {
      return;
    }
    drawTextScreen(
      'No calls in queue. Add content in src/content/calls.js.',
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
      Math.round(18 * layout.fontScale),
      layout.highContrast ? '#FFFFFF' : '#FFFFFF',
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
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize, layout } = useLittleJS();
    if (!drawRectScreen || !drawTextScreen || !vec2 || !mainCanvasSize || !layout) {
      return;
    }

    const panelWidth = layout.achievementsPosition === 'bottom'
      ? Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 360)
      : Math.min(340, Math.max(260, mainCanvasSize.x * 0.28));
    const entries = achievementsState.entries ?? [];
    const visible = entries.slice(0, layout.achievementsMaxVisible ?? 3);
    if (!visible.length) {
      return;
    }

    const shouldAutoHide = layout.achievementsPosition === 'bottom';
    if (shouldAutoHide && !panelState.achievementVisible) {
      return;
    }

    const panelHeight = 64 + visible.length * 44;
    const centerX = layout.achievementsPosition === 'bottom'
      ? mainCanvasSize.x / 2
      : mainCanvasSize.x - layout.canvasPadding - panelWidth / 2;
    const centerY = layout.achievementsPosition === 'bottom'
      ? mainCanvasSize.y - layout.canvasPadding - panelHeight / 2
      : layout.canvasPadding + panelHeight / 2;
    const accent = achievementPulse.getValue();
    const headerColor = layout.highContrast
      ? (accent > 0 ? '#FFFFFF' : '#FFD166')
      : (accent > 0 ? '#FFD166' : '#7FDBFF');
    const headerAlpha = 0.9 + accent * 0.1;

    drawRectScreen(
      vec2(centerX, centerY),
      vec2(panelWidth, panelHeight),
      layout.highContrast ? '#000000' : '#0D1E30',
    );

    drawTextScreen(
      `Achievements ${achievementsState.unlockedCount}/${achievementsState.total}`,
      vec2(centerX, centerY - panelHeight / 2 + 26),
      Math.round(18 * layout.fontScale),
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
      const titleColor = layout.highContrast
        ? (fresh ? '#FFFFFF' : unlocked ? '#FFD166' : '#CCCCCC')
        : (fresh ? '#FFD166' : unlocked ? '#4CE0D2' : '#7A8BA3');
      const bodyColor = layout.highContrast
        ? (unlocked ? '#FFFFFF' : '#CCCCCC')
        : (unlocked ? '#D8F3FF' : '#7A8BA3');
      const alpha = fresh ? 1 : unlocked ? 0.95 : 0.8;
      const bullet = unlocked ? '✓' : '•';

      drawTextScreen(
        `${bullet} ${entry.title}`,
        vec2(contentLeft, rowY),
        Math.round(16 * layout.fontScale),
        titleColor,
        0,
        layout.highContrast ? '#000000' : '#001F3F',
        alpha,
        0,
        'left',
      );

      drawTextScreen(
        entry.description,
        vec2(contentLeft + 8, rowY + 18),
        Math.max(11, Math.round(12 * layout.fontScale)),
        bodyColor,
        0,
        layout.highContrast ? '#000000' : '#001F3F',
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
    const { mainCanvasSize, layout } = useLittleJS();
    if (!mainCanvasSize || !layout || !pointer) {
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
    if (withinHeight) {
      panelState.touchInteractionTimer = 3;
      panelState.achievementVisible = true;
      return index;
    }
    return -1;
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

    const { layout } = useLittleJS();
    if (layout.achievementsPosition === 'bottom') {
      if (!panelState.autoHideInitialized) {
        panelState.achievementVisible = true;
        panelState.achievementTimer = 5;
        panelState.autoHideInitialized = true;
      } else {
        if (panelState.touchInteractionTimer > 0) {
          panelState.touchInteractionTimer = Math.max(0, panelState.touchInteractionTimer - delta);
        }

        if (panelState.touchInteractionTimer > 0) {
          panelState.achievementVisible = true;
          panelState.achievementTimer = 4;
        }

        if (panelState.achievementTimer > 0) {
          panelState.achievementTimer = Math.max(0, panelState.achievementTimer - delta);
        }

        if (panelState.achievementTimer === 0 && panelState.touchInteractionTimer === 0) {
          panelState.achievementVisible = false;
        }
      }
    } else {
      panelState.achievementVisible = true;
      panelState.achievementTimer = 0;
    }
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
      const { layout } = useLittleJS();
      if (layout.achievementsPosition === 'bottom') {
        panelState.achievementVisible = true;
        panelState.achievementTimer = 6;
      }
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
