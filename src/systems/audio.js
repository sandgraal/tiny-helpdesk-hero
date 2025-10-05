/**
 * Audio system MVP.
 * Wraps LittleJS Sound helper so we can trigger UI cues and background loops.
 */

function canUseSound() {
  return typeof globalThis.Sound === 'function';
}

function createSound(params) {
  if (!canUseSound()) {
    return null;
  }
  return new globalThis.Sound(params);
}

function playSound(sound, { position, volume = 1, pitch = 1, loop = false } = {}) {
  if (!sound || typeof sound.play !== 'function') {
    return null;
  }
  try {
    return sound.play(position, volume, pitch, 0, loop);
  } catch (error) {
    console.warn('[AudioSystem] Failed to play sound', error);
    return null;
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createClickSound() {
  return createSound([1.02, , 273.7, , , 0.17, , , , , , 0.02, , 0.5, , 0.13, , , 0.05]);
}

function createSuccessCue() {
  return createSound([1.1, 0, 440, 0.01, 0.08, 0.22, 1.5, 0.2, 0.01, 0.1, , , 0.03, , 0.2]);
}

function createFailCue() {
  return createSound([0.6, 0.1, 180, 0.02, 0.18, 0.3, -1.2, 4.5, , , , , , 0.4, , 0.6]);
}

function createHoldMusic() {
  return createSound([1, 0, 220, 0.2, 0.8, 1.2, 0.1, 0.4, 0.05, 0.2, , , , 0.5, , 0.4]);
}

export function createAudioSystem() {
  let clickSound = createClickSound();
  let successCue = createSuccessCue();
  let failCue = createFailCue();
  let holdMusic = createHoldMusic();
  let holdSource = null;

  function ensureSounds() {
    if (!clickSound) {
      clickSound = createClickSound();
    }
    if (!successCue) {
      successCue = createSuccessCue();
    }
    if (!failCue) {
      failCue = createFailCue();
    }
    if (!holdMusic) {
      holdMusic = createHoldMusic();
    }
  }

  function playClick(position) {
    ensureSounds();
    playSound(clickSound, { position });
  }

  function playOutcome(correct) {
    ensureSounds();
    playSound(correct ? successCue : failCue, { volume: correct ? 0.8 : 0.6, pitch: correct ? 1.05 : 0.9 });
  }

  function startHoldLoop() {
    ensureSounds();
    if (!holdMusic) {
      return;
    }
    if (holdSource && holdSource.playing) {
      return;
    }
    holdSource = playSound(holdMusic, { volume: 0.25, loop: true });
  }

  function stopHoldLoop() {
    if (holdSource && typeof holdSource.stop === 'function') {
      holdSource.stop();
    }
    holdSource = null;
  }

  function updateEmpathyLevel(current, total) {
    if (!holdSource) {
      return;
    }
    const ratio = total > 0 ? clamp(current / total, 0, 1) : 0;
    const targetVolume = 0.15 + ratio * 0.25;
    if (typeof holdSource.setVolume === 'function') {
      holdSource.setVolume(targetVolume);
    } else if ('volume' in holdSource) {
      holdSource.volume = targetVolume;
    } else if ('gain' in holdSource) {
      holdSource.gain = targetVolume;
    }
  }

  function stopAll() {
    stopHoldLoop();
  }

  return {
    playClick,
    playOutcome,
    startHoldLoop,
    stopHoldLoop,
    updateEmpathyLevel,
    stopAll,
  };
}
