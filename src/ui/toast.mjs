/**
 * Lightweight toast notification manager.
 */

function resolveDocument(container) {
  if (container?.ownerDocument) {
    return container.ownerDocument;
  }
  return globalThis.document;
}

export function createToastManager({ container, defaultDuration = 5000, announce } = {}) {
  if (!container) {
    return {
      show: () => () => {},
      dispose: () => {},
    };
  }
  const doc = resolveDocument(container);
  if (!doc?.createElement) {
    return {
      show: () => () => {},
      dispose: () => {},
    };
  }

  const activeToasts = new Set();
  const timers = new Map();

  function removeToast(toast) {
    if (!toast) {
      return;
    }
    const timer = timers.get(toast);
    if (timer !== undefined) {
      globalThis.clearTimeout?.(timer);
      timers.delete(toast);
    }
    if (toast.parentNode === container) {
      container.removeChild(toast);
    }
    activeToasts.delete(toast);
  }

  function createToastElement(message, tone) {
    const toast = doc.createElement('div');
    toast.className = tone ? `toast toast--${tone}` : 'toast';
    toast.setAttribute('role', 'status');
    toast.dataset.toast = 'true';
    toast.textContent = message;
    return toast;
  }

  function show(message, { duration, tone } = {}) {
    if (!message) {
      return () => {};
    }
    const toast = createToastElement(String(message), tone);
    container.appendChild(toast);
    activeToasts.add(toast);
    if (typeof announce === 'function') {
      try {
        announce(String(message));
      } catch (error) {
        console.warn('[ToastManager] announce failed', error);
      }
    }
    let timeout = defaultDuration;
    if (Number.isFinite(duration)) {
      timeout = duration;
    } else if (!Number.isFinite(timeout)) {
      timeout = 0;
    }
    if (Number.isFinite(timeout) && timeout > 0) {
      const timer = globalThis.setTimeout?.(() => {
        removeToast(toast);
      }, timeout);
      if (timer !== undefined) {
        timers.set(toast, timer);
      }
    }
    return () => {
      removeToast(toast);
    };
  }

  function dispose() {
    activeToasts.forEach((toast) => {
      removeToast(toast);
    });
    activeToasts.clear();
    timers.clear();
  }

  return {
    show,
    dispose,
  };
}

export default {
  createToastManager,
};
