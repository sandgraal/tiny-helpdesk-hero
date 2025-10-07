import test from 'node:test';
import assert from 'node:assert/strict';

import { createAudioSystem } from '../src/systems/audio.js';

function withPatchedGlobals(patches, fn) {
  const originals = {};
  for (const [key, value] of Object.entries(patches)) {
    originals[key] = key in globalThis ? globalThis[key] : undefined;
    if (value === undefined) {
      delete globalThis[key];
    } else {
      globalThis[key] = value;
    }
  }
  try {
    return fn();
  } finally {
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete globalThis[key];
      } else {
        globalThis[key] = value;
      }
    }
  }
}

test('audio system no-ops gracefully without LittleJS Sound', { concurrency: false }, () => {
  withPatchedGlobals({ Sound: undefined }, () => {
    const audio = createAudioSystem();
    audio.playClick();
    audio.playOutcome(true);
    audio.playPersonaMotif('overwhelmed-designer');
    audio.startHoldLoop();
    audio.updateEmpathyLevel(2, 4);
    audio.stopHoldLoop();
    audio.stopAll();
  });
});

test('audio system caches sounds and updates empathy volume', { concurrency: false }, () => {
  const createdInstances = [];
  const playEvents = [];
  let lastLoopHandle;

  function createHandle(loop, event) {
    const handle = {
      playing: loop,
      volume: null,
      stopped: false,
      setVolume(value) {
        this.volume = value;
        event.volume = value;
      },
      stop() {
        this.stopped = true;
        event.stopped = true;
      },
    };
    if (loop) {
      lastLoopHandle = handle;
    }
    return handle;
  }

  class FakeSound {
    constructor(params) {
      this.params = params;
      createdInstances.push(this);
    }

    play(position, volume, pitch, _unused, loop) {
      const event = { position, volume, pitch, loop, instance: this };
      playEvents.push(event);
      return createHandle(loop, event);
    }
  }

  withPatchedGlobals({ Sound: FakeSound }, () => {
    const audio = createAudioSystem();

    audio.startHoldLoop();
    assert.ok(lastLoopHandle, 'Hold loop should start when Sound exists.');
    audio.startHoldLoop();
    const loopEvents = playEvents.filter((event) => event.loop === true);
    assert.equal(loopEvents.length, 1, 'Hold loop should not restart while already playing.');

    audio.updateEmpathyLevel(2, 4);
    assert.ok(Math.abs(lastLoopHandle.volume - 0.275) < 1e-6, 'Hold loop volume adjusts with empathy.');

    audio.playOutcome(true);
    audio.playOutcome(false);
    const pitches = playEvents
      .filter((event) => event.loop !== true) // include click + outcome + motifs
      .map((event) => event.pitch)
      .filter((pitch) => typeof pitch === 'number');
    assert.ok(pitches.includes(1.05), 'Success cue pitch applied.');
    assert.ok(pitches.includes(0.9), 'Failure cue pitch applied.');

    audio.playPersonaMotif('overwhelmed-designer');
    audio.playPersonaMotif('overwhelmed-designer');
    const motifCount = createdInstances.filter((instance) => Array.isArray(instance.params) && instance.params.length > 0).length;
    assert.ok(motifCount >= 4, 'Persona motif presets seeded.');

    const eventsBeforeChime = playEvents.length;
    audio.playAchievementChime();
    const chimeEvents = playEvents.slice(eventsBeforeChime);
    assert.ok(chimeEvents.length >= 1, 'Achievement chime should trigger playback.');

    audio.stopHoldLoop();
    assert.ok(lastLoopHandle.stopped, 'Hold loop stops cleanly.');
    audio.stopAll();
  });
});

test('audio system ignores unknown persona motifs gracefully', { concurrency: false }, () => {
  const playEvents = [];
  const warnings = [];

  class FakeSound {
    constructor(params) {
      this.params = params;
    }

    play(position, volume, pitch, _unused, loop) {
      const event = { position, volume, pitch, loop, instance: this };
      playEvents.push(event);
      return {
        playing: loop,
        stop() {},
        setVolume() {},
      };
    }
  }

  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));
  try {
    withPatchedGlobals({ Sound: FakeSound }, () => {
      const audio = createAudioSystem();
      audio.playPersonaMotif('nonexistent-persona');
      assert.equal(playEvents.length, 0, 'Unknown persona should not trigger playback.');
      audio.playPersonaMotif('');
      assert.equal(playEvents.length, 0, 'Empty persona id should be ignored.');
    });
  } finally {
    console.warn = originalWarn;
  }
  assert.ok(warnings.some((message) => message.includes('Missing persona motif preset')));
});
