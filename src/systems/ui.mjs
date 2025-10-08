import { createHoverState, createPulseState } from './animation/tween.mjs';
import { getImage } from '../game/image-loader.mjs';
import { imageManifest } from '../game/asset-manifest.mjs';
import { getPalette, motion } from '../ui/theme.mjs';

const optionSprites = {
  base: getImage(imageManifest.uiOptionDefault),
  hover: getImage(imageManifest.uiOptionHover),
  active: getImage(imageManifest.uiOptionActive),
  disabled: getImage(imageManifest.uiOptionDisabled),
};

const empathyMeterAssets = {
  base: getImage(imageManifest.empathyMeterBase),
  fill: getImage(imageManifest.empathyMeterFill),
  glow: getImage(imageManifest.empathyMeterGlow),
};

const achievementBadges = [
  getImage(imageManifest.achievementBadge01),
  getImage(imageManifest.achievementBadge02),
  getImage(imageManifest.achievementBadge03),
  getImage(imageManifest.achievementBadge04),
  getImage(imageManifest.achievementBadge05),
  getImage(imageManifest.achievementBadge06),
];

const iconCollapse = getImage(imageManifest.iconCollapse);
const iconExpand = getImage(imageManifest.iconExpand);
const iconRestart = getImage(imageManifest.iconRestart);

function isReady(resource) {
  return Boolean(resource?.ready && resource.image);
}

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

  const drawImage = (image, dx, dy, width, height, alpha = 1) => {
    if (!context || !image || typeof context.drawImage !== 'function') {
      return;
    }
    const drawWidth = Number.isFinite(width) && width > 0 ? width : image.width;
    const drawHeight = Number.isFinite(height) && height > 0 ? height : image.height;
    context.save?.();
    if (alpha !== 1) {
      context.globalAlpha = alpha;
    }
    context.drawImage(image, dx, dy, drawWidth, drawHeight);
    context.restore?.();
  };

  const drawImageCentered = (image, center, width, height, alpha = 1) => {
    if (!center) {
      return;
    }
    const drawWidth = Number.isFinite(width) && width > 0 ? width : image?.width;
    const drawHeight = Number.isFinite(height) && height > 0 ? height : image?.height;
    if (!drawWidth || !drawHeight) {
      return;
    }
    const x = (center.x ?? 0) - drawWidth / 2;
    const y = (center.y ?? 0) - drawHeight / 2;
    drawImage(image, x, y, drawWidth, drawHeight, alpha);
  };

  const layout = getLayoutForSize(mainCanvasSize);
  layout.fontScale *= overrides.fontScale ?? 1;
  layout.highContrast = Boolean(overrides.highContrast);

  const palette = getPalette(layout.highContrast);

  return {
    drawRectScreen,
    drawTextScreen,
    drawImage,
    drawImageCentered,
    mainCanvasSize,
    vec2,
    layout,
    palette,
    context,
  };
}

export function createUISystem({ accessibility } = {}) {
  const hoverStates = new Map();
  const empathyPulse = createPulseState({ duration: motion.empathyPulse });
  const callPulse = createPulseState({ duration: motion.callPulse });
  const achievementPulse = createPulseState({ duration: motion.achievementPulse });
  const panelState = {
    autoHideInitialized: false,
    achievementTimer: 0,
    achievementVisible: true,
    touchInteractionTimer: 0,
    collapseBounds: null,
  };
  const achievementTiming = {
    initial: 5,
    touchExtend: 4,
    keyboardMax: 1.5,
    toggle: 4,
    unlock: 6,
  };
  let keyboardFocusIndex = -1;
  let keyboardOptionsLength = 0;
  let keyboardSelectHandler = null;
  let keyboardRestartHandler = null;
  let keyboardStubAvailable = false;
  let lastCallId = null;

  function getFocusCount() {
    return keyboardOptionsLength + (keyboardStubAvailable ? 1 : 0);
  }

  function focusNext(step) {
    const total = getFocusCount();
    if (total <= 0) {
      keyboardFocusIndex = -1;
      return;
    }
    if (keyboardFocusIndex < 0) {
      keyboardFocusIndex = step > 0 ? 0 : total - 1;
      return;
    }
    keyboardFocusIndex = (keyboardFocusIndex + step + total) % total;
  }

  const handleKeyboardEvent = (event) => {
    if (!keyboardSelectHandler && !keyboardRestartHandler) {
      return;
    }
    const target = event.target;
    if (target && typeof target.closest === 'function' && target.closest('[data-accessibility-panel]')) {
      return;
    }
    if (event.altKey || event.metaKey || event.ctrlKey) {
      return;
    }
    const total = getFocusCount();
    const hasOptions = total > 0;

    switch (event.key) {
      case 'Tab':
        if (hasOptions) {
          event.preventDefault();
          focusNext(event.shiftKey ? -1 : 1);
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        if (hasOptions) {
          event.preventDefault();
          focusNext(-1);
        }
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        if (hasOptions) {
          event.preventDefault();
          focusNext(1);
        }
        break;
      case 'Home':
        if (hasOptions) {
          event.preventDefault();
          keyboardFocusIndex = 0;
        }
        break;
      case 'End':
        if (hasOptions) {
          event.preventDefault();
          keyboardFocusIndex = total - 1;
        }
        break;
      case 'Enter':
      case ' ':
        if (hasOptions) {
          event.preventDefault();
          if (keyboardStubAvailable && keyboardFocusIndex === keyboardOptionsLength) {
            toggleAchievementsVisibility();
          } else if (keyboardFocusIndex >= 0) {
            keyboardSelectHandler?.(keyboardFocusIndex);
          }
        } else if (keyboardRestartHandler) {
          event.preventDefault();
          keyboardRestartHandler();
        }
        break;
      default:
        break;
    }
  };

  globalThis.addEventListener?.('keydown', handleKeyboardEvent);

  function setKeyboardSelectHandler(handler) {
    keyboardSelectHandler = handler;
  }

  function setKeyboardRestartHandler(handler) {
    keyboardRestartHandler = handler;
  }

  const empathyHintState = {
    visible: false,
    cooldown: 0,
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
      state = createHoverState({ duration: motion.hover });
      hoverStates.set(optionKey, state);
    }
    return state;
  }

  function renderBackground() {
    const { drawRectScreen, vec2, mainCanvasSize, layout, palette } = useLittleJS();
    if (!drawRectScreen || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }
    const bgColor = palette.background;
    drawRectScreen(
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
      vec2(mainCanvasSize.x, mainCanvasSize.y),
      bgColor,
    );
  }

  function renderHeader({ currentIndex, callCount }) {
    const { drawTextScreen, vec2, mainCanvasSize, layout, palette } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }
    const pulseOffset = callPulse.getValue() * 6;
    const safeIndex = Number.isFinite(currentIndex) ? currentIndex : 0;
    const safeCount = Number.isFinite(callCount) ? callCount : 0;
    drawTextScreen(
      `Call ${safeIndex + 1} of ${safeCount}`,
      vec2(mainCanvasSize.x / 2, layout.headerY - pulseOffset),
      Math.round(26 * layout.fontScale),
      palette.headerAccent,
      1,
      palette.headerOutline,
      2,
      0,
      'center',
    );
  }

  function renderPrompt(call) {
    const { drawTextScreen, vec2, mainCanvasSize, layout, palette } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout || !palette || !call) {
      return;
    }
    const pulseOffset = callPulse.getValue() * 12;
    drawTextScreen(
      call.prompt,
      vec2(mainCanvasSize.x / 2, layout.promptY - pulseOffset),
      Math.round(20 * layout.fontScale),
      palette.textPrimary,
      1,
      palette.promptOutline,
      1,
      0,
      'center',
    );
  }

  function renderOptions(state) {
    const {
      drawRectScreen,
      drawTextScreen,
      drawImage,
      vec2,
      mainCanvasSize,
      layout,
      palette,
    } = useLittleJS();
    const call = state?.call;
    if (!drawRectScreen || !drawTextScreen || !drawImage || !vec2 || !mainCanvasSize || !layout || !palette || !call) {
      return;
    }

    const optionWidth = Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 720);
    call.options.forEach((option, index) => {
      const x = (mainCanvasSize.x - optionWidth) / 2;
      const y = layout.optionStartY + index * (layout.optionHeight + layout.optionGap);
      const center = vec2(x + optionWidth / 2, y + layout.optionHeight / 2);
      const hover = ensureHoverState(getOptionKey(option, index)).getValue();
      const isFocused = keyboardFocusIndex === index;
      const disabled = Boolean(option?.disabled);
      const baseSprite = !layout.highContrast
        ? (isFocused && isReady(optionSprites.active))
          ? optionSprites.active
          : (hover > 0.02 && isReady(optionSprites.hover))
            ? optionSprites.hover
            : (disabled && isReady(optionSprites.disabled))
              ? optionSprites.disabled
              : isReady(optionSprites.base)
                ? optionSprites.base
                : null
        : null;

      if (isFocused) {
        drawRectScreen(center, vec2(optionWidth + 18, layout.optionHeight + 18), palette.focusOutline);
      }

      if (layout.highContrast || !baseSprite) {
        const baseColor = disabled ? palette.optionDisabled : palette.optionBase;
        const hoverColor = disabled ? palette.optionDisabled : palette.optionHover;
        const fillColor = isFocused ? palette.optionActive : hover > 0.01 ? hoverColor : baseColor;
        drawRectScreen(center, vec2(optionWidth, layout.optionHeight), fillColor);
      } else {
        const image = baseSprite.image;
        const cardTargetWidth = optionWidth + Math.round(layout.canvasPadding * 0.6);
        const cardTargetHeight = layout.optionHeight + 36;
        const scale = Math.min(cardTargetWidth / image.width, cardTargetHeight / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const dx = x + (optionWidth - drawWidth) / 2;
        const dy = y - (drawHeight - layout.optionHeight) / 2 - hover * 6;
        drawImage(image, dx, dy, drawWidth, drawHeight, 1);
      }

      const textColor = disabled ? palette.optionDisabledText : palette.optionText;
      const textYOffset = -hover * 4;
      drawTextScreen(
        option.text,
        vec2(center.x, center.y + textYOffset),
        Math.round(18 * layout.fontScale),
        textColor,
        0,
        null,
        1,
        0,
        'center',
      );
    });
  }

  function renderPersonaDetails(call) {
    const { drawTextScreen, vec2, mainCanvasSize, layout, palette } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout || !palette || !call?.persona) {
      return;
    }

    const personaLine = `${call.persona.name} (${call.persona.mood})`;
    drawTextScreen(
      personaLine,
      vec2(mainCanvasSize.x / 2, layout.personaY),
      Math.round(18 * layout.fontScale),
      palette.personaAccent,
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
        palette.textMuted,
        0,
        null,
        1,
        0,
        'center',
      );
    }
  }

  function renderEmpathyScore(score) {
    const { drawTextScreen, vec2, mainCanvasSize, layout, palette } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }

    drawTextScreen(
      `Empathy: ${score}`,
      vec2(mainCanvasSize.x - layout.canvasPadding, mainCanvasSize.y - layout.canvasPadding - 40 * layout.fontScale),
      Math.round(18 * layout.fontScale),
      palette.personaSupport,
      0,
      null,
      1,
      0,
      'right',
    );
  }

  function renderEmpathyMeter({ empathyScore, callCount }) {
    const {
      drawRectScreen,
      drawTextScreen,
      drawImage,
      vec2,
      mainCanvasSize,
      layout,
      palette,
      context,
    } = useLittleJS();
    if (!drawRectScreen || !drawTextScreen || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }

    const ratio = callCount > 0 ? Math.min(Math.max(empathyScore / callCount, 0), 1) : 0;
    const displayPercent = Math.round(ratio * 100);
    const alignBottom = layout.achievementsPosition === 'bottom';
    const targetWidth = alignBottom
      ? Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 520)
      : Math.min(320, mainCanvasSize.x * 0.32);
    const useSprite = !layout.highContrast && isReady(empathyMeterAssets.base);
    const pulse = empathyPulse.getValue();

    if (useSprite) {
      const baseImg = empathyMeterAssets.base.image;
      const scale = targetWidth / baseImg.width;
      const baseWidth = baseImg.width * scale;
      const baseHeight = baseImg.height * scale;
      const baseX = alignBottom
        ? Math.round((mainCanvasSize.x - baseWidth) / 2)
        : Math.round(mainCanvasSize.x - layout.canvasPadding - baseWidth);
      const baseY = Math.round(mainCanvasSize.y - layout.canvasPadding - baseHeight);
      drawImage(baseImg, baseX, baseY, baseWidth, baseHeight, 1);

      if (context && isReady(empathyMeterAssets.fill)) {
        const fillImg = empathyMeterAssets.fill.image;
        const fillX = baseX + Math.round(40 * scale);
        const fillY = baseY + Math.round(46 * scale);
        const maxFillWidth = fillImg.width * scale;
        const currentFillWidth = Math.max(6 * scale, maxFillWidth * ratio);
        const srcWidth = Math.max(1, fillImg.width * ratio);
        context.save?.();
        context.globalAlpha = 0.85;
        context.drawImage(
          fillImg,
          0,
          0,
          srcWidth,
          fillImg.height,
          fillX,
          fillY,
          currentFillWidth,
          fillImg.height * scale,
        );
        context.restore?.();
      }

      if (isReady(empathyMeterAssets.glow)) {
        const glowImg = empathyMeterAssets.glow.image;
        const glowAlpha = Math.min(0.6, 0.35 + pulse * 0.4);
        drawImage(
          glowImg,
          baseX + Math.round((baseWidth - glowImg.width * scale) / 2),
          baseY + Math.round((baseHeight - glowImg.height * scale) / 2),
          glowImg.width * scale,
          glowImg.height * scale,
          glowAlpha,
        );
      }

      drawTextScreen(
        `${displayPercent}%`,
        vec2(baseX + baseWidth / 2, baseY + baseHeight * 0.3),
        Math.round(18 * layout.fontScale),
        palette.textOverlay,
        0,
        null,
        1,
        0,
        'center',
      );
    } else {
      const baseWidth = targetWidth;
      const baseHeight = Math.max(18, Math.round(16 * layout.fontScale));
      const x = alignBottom ? layout.canvasPadding + baseWidth / 2 : mainCanvasSize.x - layout.canvasPadding - baseWidth / 2;
      const y = mainCanvasSize.y - layout.canvasPadding - baseHeight / 2;
      const fillWidth = Math.max(4, ratio * baseWidth);

      drawRectScreen(vec2(x, y), vec2(baseWidth, baseHeight), palette.backgroundMuted);
      drawRectScreen(
        vec2(x - baseWidth / 2 + fillWidth / 2, y),
        vec2(fillWidth, baseHeight - 4),
        pulse > 0.01 ? palette.achievementFresh : palette.achievementPulse,
      );

      drawTextScreen(
        `${displayPercent}%`,
        vec2(x, y - baseHeight),
        Math.round(16 * layout.fontScale),
        palette.textOverlay,
        0,
        null,
        1,
        0,
        'center',
      );
    }
  }

  function renderQueueIndicator({ callCount, currentIndex, isComplete }) {
    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize, layout, palette } = useLittleJS();
    if (!drawRectScreen || !vec2 || !mainCanvasSize || !layout || !palette) {
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
    const frameColor = palette.frame;
    const bg = pulse > 0.01 ? palette.achievementActive : palette.achievementBadgeBg;

    drawRectScreen(vec2(x, y), vec2(width, height), frameColor);
    drawRectScreen(vec2(x, y), vec2(width - 6, height - 6), layout.highContrast ? palette.background : bg);
    drawTextScreen(
      remaining > 0 ? `${remaining} in queue` : isComplete ? 'Queue clear' : 'Last caller',
      vec2(x, y + 4),
      Math.round(16 * layout.fontScale),
      layout.highContrast ? palette.textPrimary : palette.stubText,
      0,
      null,
      1,
      0,
      'center',
    );
  }

  function renderEmpathyHint(state) {
    const safeCount = Math.max(1, state.callCount ?? 0);
    const ratio = safeCount > 0 ? state.empathyScore / safeCount : 0;
    if (state.isComplete || !state.call || safeCount < 2) {
      empathyHintState.visible = false;
      return;
    }

    if (ratio < 0.5 && empathyHintState.cooldown === 0) {
      empathyHintState.visible = true;
    } else if (ratio >= 0.5) {
      empathyHintState.visible = false;
    }

    if (!empathyHintState.visible) {
      return;
    }

    const { drawRectScreen, drawTextScreen, vec2, mainCanvasSize, layout, palette } = useLittleJS();
    if (!drawRectScreen || !drawTextScreen || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }

    const panelWidth = Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 540);
    const panelHeight = 68;
    const offsetFromBottom = layout.achievementsPosition === 'bottom' ? 120 : 80;
    const centerX = mainCanvasSize.x / 2;
    const centerY = mainCanvasSize.y - layout.canvasPadding - offsetFromBottom;
    const bgColor = palette.panelOverlay;
    const borderColor = palette.panelBorder;
    const textColor = palette.textOverlay;

    drawRectScreen(vec2(centerX, centerY), vec2(panelWidth, panelHeight), bgColor);
    drawRectScreen(vec2(centerX, centerY), vec2(panelWidth, panelHeight), borderColor);

    const hintText = 'Tip: Match their vibe—empathetic replies boost score.';
    drawTextScreen(
      hintText,
      vec2(centerX, centerY),
      Math.max(14, Math.round(16 * layout.fontScale)),
      textColor,
      0,
      null,
      1,
      0,
      'center',
    );
  }

  function renderCompletion({ empathyScore, callCount }) {
    const {
      drawTextScreen,
      drawImage,
      vec2,
      mainCanvasSize,
      layout,
      palette,
    } = useLittleJS();
    if (!drawTextScreen || !drawImage || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }

    drawTextScreen(
      'Shift complete!',
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 - 24),
      Math.round(32 * layout.fontScale),
      palette.scoreboardAccent,
      1,
      palette.scoreboardOutline,
      2,
      0,
      'center',
    );
    drawTextScreen(
      `Empathy Score: ${empathyScore} / ${callCount}`,
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2 + 16),
      Math.round(22 * layout.fontScale),
      palette.scoreboardText,
      0,
      palette.promptOutline,
      1,
      0,
      'center',
    );

    if (!layout.highContrast && isReady(iconRestart)) {
      const iconSize = Math.round(48 * layout.fontScale);
      const iconX = mainCanvasSize.x / 2 - iconSize / 2;
      const iconY = mainCanvasSize.y / 2 + 40;
      drawImage(iconRestart.image, iconX, iconY, iconSize, iconSize, 0.85);
      drawTextScreen(
        'Click to start a new shift',
        vec2(mainCanvasSize.x / 2, iconY + iconSize + 18),
        Math.round(14 * layout.fontScale),
        palette.stubCollapsedText,
        0,
        null,
        1,
        0,
        'center',
      );
    }
  }

  function renderEmptyState() {
    const { drawTextScreen, vec2, mainCanvasSize, layout, palette } = useLittleJS();
    if (!drawTextScreen || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }
    drawTextScreen(
      'No calls in queue. Add content in src/content/calls.js.',
      vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
      Math.round(18 * layout.fontScale),
      palette.textPrimary,
      0,
      palette.promptOutline,
      1,
      0,
      'center',
    );
  }

  function renderAchievements(achievementsState) {
    const {
      drawRectScreen,
      drawTextScreen,
      drawImage,
      vec2,
      mainCanvasSize,
      layout,
      palette,
    } = useLittleJS();
    if (!drawRectScreen || !drawTextScreen || !drawImage || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }

    panelState.collapseBounds = null;

    if (!achievementsState) {
      if (layout.achievementsPosition === 'bottom') {
        renderCollapsedAchievementsStub();
      }
      return;
    }

    const entries = achievementsState.entries ?? [];
    const visible = entries.slice(0, layout.achievementsMaxVisible ?? 3);
    if (!visible.length) {
      if (layout.achievementsPosition === 'bottom') {
        renderCollapsedAchievementsStub();
      }
      return;
    }

    const shouldAutoHide = layout.achievementsPosition === 'bottom';
    if (shouldAutoHide && !panelState.achievementVisible) {
      renderCollapsedAchievementsStub();
      return;
    }

    const panelWidth = shouldAutoHide
      ? Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 360)
      : Math.min(360, Math.max(260, mainCanvasSize.x * 0.28));
    const badgeRowHeight = Math.max(44, Math.round(40 * layout.fontScale));
    const panelHeight = 64 + visible.length * badgeRowHeight;
    const centerX = layout.achievementsPosition === 'bottom'
      ? mainCanvasSize.x / 2
      : mainCanvasSize.x - layout.canvasPadding - panelWidth / 2;
    const centerY = layout.achievementsPosition === 'bottom'
      ? mainCanvasSize.y - layout.canvasPadding - panelHeight / 2
      : layout.canvasPadding + panelHeight / 2;
    const accent = achievementPulse.getValue();
    const headerColor = accent > 0 ? palette.achievementActive : palette.headerAccent;
    const headerAlpha = 0.9 + accent * 0.1;

    drawRectScreen(
      vec2(centerX, centerY),
      vec2(panelWidth, panelHeight),
      palette.panel,
    );

    drawTextScreen(
      `Achievements ${achievementsState.unlockedCount}/${achievementsState.total}`,
      vec2(centerX, centerY - panelHeight / 2 + 26),
      Math.round(18 * layout.fontScale),
      headerColor,
      0,
      palette.headerOutline,
      headerAlpha,
      0,
      'center',
    );

    const recentSet = new Set(achievementsState.recentUnlocks ?? []);
    const badgeSize = Math.round(34 * layout.fontScale);
    const badgeLeft = centerX - panelWidth / 2 + 24;
    const contentLeft = badgeLeft + badgeSize + 12;
    let rowY = centerY - panelHeight / 2 + 60;

    visible.forEach((entry, index) => {
      const unlocked = entry.unlocked;
      const fresh = recentSet.has(entry.id);
      const titleColor = fresh
        ? palette.achievementActive
        : unlocked
          ? palette.scoreboardAccent
          : palette.stubCollapsedInactive;
      const bodyColor = unlocked ? palette.stubCollapsedText : palette.stubCollapsedInactive;
      const alpha = fresh ? 1 : unlocked ? 0.95 : 0.8;
      const badge = achievementBadges[index % achievementBadges.length];
      const badgeTop = rowY - badgeSize * 0.8;
      const badgeAlpha = fresh ? 1 : unlocked ? 0.85 : 0.5;

      if (!layout.highContrast && isReady(badge)) {
        drawImage(badge.image, badgeLeft, badgeTop, badgeSize, badgeSize, badgeAlpha);
      } else {
        const badgeCenter = vec2(badgeLeft + badgeSize / 2, badgeTop + badgeSize / 2);
        const badgeColor = fresh
          ? palette.achievementActive
          : unlocked
            ? palette.headerAccent
            : palette.stubCollapsedInactive;
        drawRectScreen(badgeCenter, vec2(badgeSize * 0.8, badgeSize * 0.8), badgeColor);
        drawRectScreen(badgeCenter, vec2(badgeSize * 0.45, badgeSize * 0.45), palette.stubBg ?? '#0D1E30');
      }

      drawTextScreen(
        entry.title,
        vec2(contentLeft, rowY),
        Math.round(16 * layout.fontScale),
        titleColor,
        0,
        palette.headerOutline,
        alpha,
        0,
        'left',
      );

      drawTextScreen(
        entry.description,
        vec2(contentLeft, rowY + 18),
        Math.max(11, Math.round(12 * layout.fontScale)),
        bodyColor,
        0,
        palette.headerOutline,
        alpha,
        0,
        'left',
      );

      rowY += badgeRowHeight;
    });

    if (shouldAutoHide) {
      const buttonSize = Math.round(36 * layout.fontScale);
      const buttonLeft = centerX + panelWidth / 2 - buttonSize - 16;
      const buttonTop = centerY - panelHeight / 2 + 16;
      if (!layout.highContrast && isReady(iconCollapse)) {
        drawImage(iconCollapse.image, buttonLeft, buttonTop, buttonSize, buttonSize, 0.9);
      } else {
        const buttonCenter = vec2(buttonLeft + buttonSize / 2, buttonTop + buttonSize / 2);
        drawRectScreen(buttonCenter, vec2(buttonSize, buttonSize), palette.headerAccent);
        drawTextScreen('×', buttonCenter, Math.round(22 * layout.fontScale), palette.stubBg, 0, null, 1, 0, 'center');
      }
      panelState.collapseBounds = {
        left: buttonLeft,
        right: buttonLeft + buttonSize,
        top: buttonTop,
        bottom: buttonTop + buttonSize,
      };
    }
  }

  function renderCollapsedAchievementsStub() {
    const {
      drawRectScreen,
      drawTextScreen,
      drawImage,
      vec2,
      mainCanvasSize,
      layout,
      palette,
    } = useLittleJS();
    if (!drawRectScreen || !drawTextScreen || !drawImage || !vec2 || !mainCanvasSize || !layout || !palette) {
      return;
    }
    const stubWidth = Math.min(mainCanvasSize.x - layout.canvasPadding * 2, 260);
    const stubHeight = Math.max(48, Math.round(44 * layout.fontScale));
    const centerX = mainCanvasSize.x / 2;
    const centerY = mainCanvasSize.y - layout.canvasPadding - stubHeight / 2;
    const bgColor = palette.panelOverlay;
    const textColor = palette.stubCollapsedText;

    if (keyboardStubAvailable && keyboardFocusIndex === keyboardOptionsLength) {
      drawRectScreen(vec2(centerX, centerY), vec2(stubWidth + 12, stubHeight + 12), palette.focusOutline);
    }
    drawRectScreen(vec2(centerX, centerY), vec2(stubWidth, stubHeight), bgColor);

    const iconSize = Math.round(28 * layout.fontScale);
    const iconLeft = centerX - stubWidth / 2 + 16;
    const iconTop = centerY - iconSize / 2;
    if (!layout.highContrast && isReady(iconExpand)) {
      drawImage(iconExpand.image, iconLeft, iconTop, iconSize, iconSize, 0.9);
    } else {
      drawRectScreen(vec2(iconLeft + iconSize / 2, centerY), vec2(iconSize, iconSize), palette.headerAccent);
      drawTextScreen('+', vec2(iconLeft + iconSize / 2, centerY), Math.round(18 * layout.fontScale), palette.stubBg, 0, null, 1, 0, 'center');
    }

    drawTextScreen(
      'Achievements',
      vec2(iconLeft + iconSize + 12, centerY),
      Math.round(16 * layout.fontScale),
      textColor,
      0,
      null,
      1,
      0,
      'left',
    );

    panelState.collapseBounds = {
      left: centerX - stubWidth / 2,
      right: centerX + stubWidth / 2,
      top: centerY - stubHeight / 2,
      bottom: centerY + stubHeight / 2,
    };
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
    renderOptions(state);
    renderEmpathyScore(state.empathyScore);
    renderEmpathyMeter(state);
    renderQueueIndicator(state);
    renderEmpathyHint(state);
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
    let pointerConsumed = false;
    if (pointer) {
      const { layout } = useLittleJS();
      if (layout.achievementsPosition === 'bottom' && panelState.collapseBounds) {
        const { left, right, top, bottom } = panelState.collapseBounds;
        if (pointer.x >= left && pointer.x <= right && pointer.y >= top && pointer.y <= bottom) {
          toggleAchievementsVisibility();
          pointerConsumed = true;
        }
      }
    }

    const hoveredIndex = pointer && !pointerConsumed ? getOptionIndexAtPoint(pointer) : -1;
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

    const optionsLength = Array.isArray(call?.options) ? call.options.length : 0;
    keyboardOptionsLength = optionsLength;
    if (call?.id !== lastCallId) {
      lastCallId = call?.id ?? null;
      keyboardFocusIndex = optionsLength > 0 ? 0 : -1;
    }
    if (optionsLength === 0) {
      keyboardFocusIndex = -1;
    } else if (keyboardFocusIndex >= optionsLength) {
      keyboardFocusIndex = optionsLength - 1;
    }
    if (!pointerConsumed && pointer && validHovered >= 0) {
      keyboardFocusIndex = validHovered;
    }

    empathyPulse.update(delta);
    callPulse.update(delta);
    achievementPulse.update(delta);

    const { layout } = useLittleJS();
    if (layout.achievementsPosition === 'bottom') {
      if (!panelState.autoHideInitialized) {
        panelState.achievementVisible = true;
        panelState.achievementTimer = achievementTiming.initial;
        panelState.autoHideInitialized = true;
      } else {
        if (panelState.touchInteractionTimer > 0) {
          panelState.touchInteractionTimer = Math.max(0, panelState.touchInteractionTimer - delta);
        }

        if (panelState.touchInteractionTimer > 0) {
          panelState.achievementVisible = true;
          panelState.achievementTimer = achievementTiming.touchExtend;
        }

        if (panelState.achievementTimer > 0) {
          panelState.achievementTimer = Math.max(0, panelState.achievementTimer - delta);
        }

        if (keyboardFocusIndex >= 0 && keyboardOptionsLength > 0 && !pointerConsumed) {
          panelState.achievementVisible = true;
          panelState.achievementTimer = Math.min(
            panelState.achievementTimer + delta,
            achievementTiming.keyboardMax,
          );
        }

        if (panelState.achievementTimer === 0 && panelState.touchInteractionTimer === 0) {
          panelState.achievementVisible = false;
        }
      }
    } else {
      panelState.achievementVisible = true;
      panelState.achievementTimer = 0;
      panelState.touchInteractionTimer = 0;
    }

    keyboardStubAvailable = layout.achievementsPosition === 'bottom' && !panelState.achievementVisible;

    if (empathyHintState.cooldown > 0) {
      empathyHintState.cooldown = Math.max(0, empathyHintState.cooldown - delta);
    }
  }

  function toggleAchievementsVisibility() {
    const { layout } = useLittleJS();
    const nextVisible = !panelState.achievementVisible;
    panelState.achievementVisible = nextVisible;
    panelState.touchInteractionTimer = 0;
    panelState.achievementTimer = nextVisible ? achievementTiming.toggle : 0;
    panelState.autoHideInitialized = true;
    keyboardStubAvailable = layout.achievementsPosition === 'bottom' && !nextVisible;
    if (nextVisible) {
      keyboardFocusIndex = keyboardOptionsLength > 0 ? Math.min(keyboardFocusIndex, keyboardOptionsLength - 1) : -1;
    } else {
      const total = getFocusCount();
      keyboardFocusIndex = total > 0 ? total - 1 : -1;
    }
  }

  function notifySelection(result) {
    if (result?.correct) {
      empathyPulse.trigger();
      empathyHintState.visible = false;
      empathyHintState.cooldown = 4;
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
        panelState.achievementTimer = achievementTiming.unlock;
      }
    }
  }

  return {
    render,
    update,
    getOptionIndexAtPoint,
    notifySelection,
    notifyAchievements,
    setKeyboardSelectHandler,
  };
}
