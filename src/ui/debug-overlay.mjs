/**
 * Lightweight debug overlay rendered inside the canvas stack.
 * Surfaces frame timing stats and keyboard shortcut hints.
 */

const DEFAULT_STATE = {
  timeScale: 1,
  baseDelta: null,
  performance: null,
  lowPower: false,
  monitorDebug: false,
  instructions: [],
};

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function formatMs(value) {
  return `${toNumber(value, 0).toFixed(2)}ms`;
}

function cloneInstructions(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  return list.filter((item) => typeof item === 'string' && item.trim().length > 0);
}

export function createDebugOverlay({ container } = {}) {
  const doc = globalThis.document;
  let visible = false;
  let pendingState = { ...DEFAULT_STATE };

  if (!doc?.createElement) {
    return {
      update(state = {}) {
        pendingState = { ...pendingState, ...state };
      },
      setVisible(flag) {
        const target = Boolean(flag);
        const changed = visible !== target;
        visible = target;
        return changed;
      },
      toggle() {
        return this.setVisible(!visible);
      },
      isVisible() {
        return visible;
      },
      dispose() {},
    };
  }

  const host = container && typeof container.appendChild === 'function'
    ? container
    : doc.body ?? null;

  if (!host?.appendChild) {
    return {
      update(state = {}) {
        pendingState = { ...pendingState, ...state };
      },
      setVisible(flag) {
        const target = Boolean(flag);
        const changed = visible !== target;
        visible = target;
        return changed;
      },
      toggle() {
        return this.setVisible(!visible);
      },
      isVisible() {
        return visible;
      },
      dispose() {},
    };
  }

  const section = doc.createElement('section');
  section.className = 'debug-overlay';
  section.hidden = true;
  section.setAttribute('role', 'status');
  section.setAttribute('aria-live', 'polite');

  const header = doc.createElement('header');
  header.className = 'debug-overlay__header';

  const title = doc.createElement('span');
  title.className = 'debug-overlay__title';
  title.textContent = 'Debug';

  const status = doc.createElement('span');
  status.className = 'debug-overlay__status';
  status.textContent = '×1.00';

  header.append(title, status);
  section.appendChild(header);

  const metrics = doc.createElement('pre');
  metrics.className = 'debug-overlay__metrics';
  metrics.textContent = '';
  section.appendChild(metrics);

  const shortcutsTitle = doc.createElement('div');
  shortcutsTitle.className = 'debug-overlay__section-title';
  shortcutsTitle.textContent = 'Shortcuts';
  section.appendChild(shortcutsTitle);

  const instructionsList = doc.createElement('ul');
  instructionsList.className = 'debug-overlay__instructions';
  section.appendChild(instructionsList);

  host.appendChild(section);

  let lastInstructionsKey = '';

  function render() {
    const {
      timeScale,
      baseDelta,
      performance,
      lowPower,
      monitorDebug,
      instructions,
    } = pendingState;

    const scaleValue = Number.isFinite(timeScale) ? timeScale : 1;
    const paused = scaleValue === 0;
    status.textContent = `×${scaleValue.toFixed(2)}${paused ? ' (paused)' : ''}`;

    const lines = [];
    const frame = performance?.lastFrame ?? null;
    if (frame) {
      const frameDuration = toNumber(frame.duration, 0);
      const frameFps = frameDuration > 0 ? (1000 / frameDuration) : frame.fps ?? 0;
      lines.push(`frame   : ${frameDuration.toFixed(2)}ms (${frameFps.toFixed(1)} fps)`);
      const deltaMs = toNumber(frame.delta, 0) * 1000;
      const baseMs = baseDelta == null ? '--' : `${(toNumber(baseDelta, 0) * 1000).toFixed(2)}ms`;
      lines.push(`delta   : ${deltaMs.toFixed(2)}ms (base ${baseMs})`);
      const flags = [];
      if (frame.lowPower) {
        flags.push('frame low-power');
      }
      if (lowPower) {
        flags.push('settings low-power');
      }
      if (monitorDebug) {
        flags.push('monitor debug');
      }
      if (flags.length) {
        lines.push(`flags   : ${flags.join(' | ')}`);
      }
    } else {
      lines.push('frame   : --');
      lines.push('delta   : --');
    }

    const standard = performance?.standard ?? null;
    if (standard) {
      const avg = formatMs(standard.duration?.average ?? 0);
      const min = formatMs(standard.duration?.min ?? 0);
      const max = formatMs(standard.duration?.max ?? 0);
      const dtAvg = formatMs((standard.delta?.average ?? 0) * 1000);
      lines.push(`standard: ${avg} (min ${min} / max ${max}) dt ${dtAvg} [n=${standard.sampleCount ?? 0}]`);
    }
    const low = performance?.lowPower ?? null;
    if (low) {
      const avg = formatMs(low.duration?.average ?? 0);
      const min = formatMs(low.duration?.min ?? 0);
      const max = formatMs(low.duration?.max ?? 0);
      const dtAvg = formatMs((low.delta?.average ?? 0) * 1000);
      lines.push(`low-power: ${avg} (min ${min} / max ${max}) dt ${dtAvg} [n=${low.sampleCount ?? 0}]`);
    }

    metrics.textContent = lines.join('\n');

    const normalizedInstructions = cloneInstructions(instructions);
    const key = normalizedInstructions.join('\n');
    if (key === lastInstructionsKey) {
      return;
    }
    lastInstructionsKey = key;

    instructionsList.replaceChildren();
    if (!normalizedInstructions.length) {
      shortcutsTitle.hidden = true;
      instructionsList.hidden = true;
      return;
    }

    shortcutsTitle.hidden = false;
    instructionsList.hidden = false;

    for (let i = 0; i < normalizedInstructions.length; i += 1) {
      const item = doc.createElement('li');
      item.textContent = normalizedInstructions[i];
      instructionsList.appendChild(item);
    }
  }

  return {
    update(state = {}) {
      pendingState = {
        timeScale: Number.isFinite(state.timeScale) ? state.timeScale : pendingState.timeScale,
        baseDelta: state.baseDelta ?? pendingState.baseDelta,
        performance: state.performance ?? pendingState.performance,
        lowPower: Boolean(state.lowPower ?? pendingState.lowPower),
        monitorDebug: Boolean(state.monitorDebug ?? pendingState.monitorDebug),
        instructions: cloneInstructions(state.instructions ?? pendingState.instructions),
      };
      if (visible) {
        render();
      }
    },
    setVisible(flag) {
      const target = Boolean(flag);
      if (visible === target) {
        return false;
      }
      visible = target;
      section.hidden = !visible;
      if (visible) {
        render();
      }
      return true;
    },
    toggle() {
      return this.setVisible(!visible);
    },
    isVisible() {
      return visible;
    },
    dispose() {
      if (section.parentNode) {
        section.parentNode.removeChild(section);
      }
    },
  };
}

export default createDebugOverlay;
