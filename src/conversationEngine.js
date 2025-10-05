/**
 * Lightweight conversation engine responsible for call sequencing.
 * TODO:
 *  - Expand the call database with absurd, empathy-first scenarios.
 *  - Replace the static array with modular generation (persona + problem + twist).
 *  - Track player choices so future calls react to empathy history.
 */

const callDeck = [
  {
    message: "Caller: My desktop icons are so small I need a microscope! What do I do?",
    options: [
      { text: "Guide them to press Ctrl + Plus to zoom in", correct: true },
      { text: "Suggest buying a bigger monitor", correct: false },
      { text: "Tell them to restart their computer", correct: false },
    ],
  },
  {
    message: "Caller: The text on my screen is miniature. I swear it shrunk overnight!",
    options: [
      { text: "Explain how to adjust display scaling settings", correct: true },
      { text: "Advise them to squint harder", correct: false },
      { text: "Tell them it’s a virus and they’re doomed", correct: false },
    ],
  },
  {
    message: "Caller: The USB port is too small for my cable — can you please enlarge it?",
    options: [
      { text: "Suggest flipping the cable and gently inserting it", correct: true },
      { text: "Recommend using a hammer to widen the port", correct: false },
      { text: "Tell them to call a carpenter", correct: false },
    ],
  },
  {
    message: "Caller: My AI assistant refuses to talk to me because I’m not empathetic enough.",
    options: [
      { text: "Advise them to ask nicely and schedule a feelings check", correct: true },
      { text: "Suggest reinstalling the operating system", correct: false },
      { text: "Tell them to unplug it and plug it back in", correct: false },
    ],
  },
  {
    message: "Caller: The cat gif on my desktop has stopped looping and it’s ruining my day.",
    options: [
      { text: "Explain how to refresh or reopen the GIF", correct: true },
      { text: "Suggest tapping the monitor gently", correct: false },
      { text: "Tell them it’s a sign they should adopt a real cat", correct: false },
    ],
  },
  {
    message: "Caller: The volume slider is tiny and I can’t grab it.",
    options: [
      { text: "Use keyboard arrow keys to adjust the volume", correct: true },
      { text: "Recommend using tweezers", correct: false },
      { text: "Tell them to yell louder at the computer", correct: false },
    ],
  },
];

let currentIndex = 0;

export function getCallCount() {
  return callDeck.length;
}

export function getCurrentCall() {
  return callDeck[currentIndex] ?? null;
}

export function advanceCall() {
  currentIndex += 1;
  return getCurrentCall();
}

export function getCurrentIndex() {
  return currentIndex;
}

export function isDeckComplete() {
  return currentIndex >= callDeck.length;
}

export function resetCalls() {
  currentIndex = 0;
}

export { callDeck as calls };
