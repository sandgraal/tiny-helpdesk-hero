/**
 * Audio system MVP.
 * Wraps LittleJS Sound helper so we can trigger simple cues.
 */

function createClickSound() {
  const { Sound } = globalThis;
  if (typeof Sound !== 'function') {
    return null;
  }

  // Simple chime (frequency, length, volume, etc.)
  return new Sound([1.02, , 273.7, , , 0.17, , , , , , 0.02, , 0.5, , 0.13, , , 0.05]);
}

export function createAudioSystem() {
  let clickSound = createClickSound();

  function ensureSound() {
    if (!clickSound) {
      clickSound = createClickSound();
    }
  }

  function playClick(position) {
    ensureSound();
    if (!clickSound || typeof clickSound.play !== 'function') {
      return;
    }
    clickSound.play(position ?? globalThis.cameraPos ?? globalThis.vec2?.());
  }

  function stopAll() {
    // Placeholder: LittleJS Sound objects do not expose stopAll by default.
  }

  return {
    playClick,
    stopAll,
  };
}
