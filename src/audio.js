/**
 * Audio helpers for Tiny Helpdesk Hero.
 * TODO:
 *  - Replace synthesized placeholders with layered soundscapes.
 *  - Route cues through a mixer so empathy state can filter audio.
 *  - Add hold music loops and persona-specific motifs.
 */

export function createUIClickSound() {
  const { Sound } = globalThis;
  if (!Sound) {
    return null;
  }
  return new Sound([1, 0.5]);
}

export function playUIClick(sound, position) {
  if (!sound || !sound.play) {
    return;
  }
  sound.play(position);
}

export function stopAllAudio() {
  // TODO: implement when we have multiple sound layers to manage.
}
