/**
 * conversationEngine.js
 *
 * Handles the call database and functions for generating calls.
 * TODO:
 *  - Expand the call database with a wide range of absurd IT issues and small-talk scenarios.
 *  - Implement modular generation that assembles a call from persona, problem, and twist components.
 *  - Add branching dialogue logic that can schedule follow-up calls.
 *  - Track player choices for self-referential humour and adaptive difficulty.
 */

// Example call database; this will be expanded
export const calls = [
  {
    persona: "Retiree",
    issue: "Icons are too small",
    options: [
      { text: "Guide them to increase display scaling", correct: true },
      { text: "Tell them to buy a magnifying glass", correct: false },
    ],
  },
];

// Index of the current call
let currentIndex = 0;

/**
 * Returns the next call object.
 * If modular generation is implemented, this function will assemble a call dynamically.
 */
export function getNextCall() {
  if (currentIndex < calls.length) {
    return calls[currentIndex++];
  }
  // TODO: generate random call here
  return null;
}

/**
 * Resets the call index (useful for restarts).
 */
export function resetCalls() {
  currentIndex = 0;
}
