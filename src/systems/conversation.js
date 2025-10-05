/**
 * Conversation engine MVP.
 * Assembles a deck of calls, tracks empathy score, and reports progress.
 */

import { generateCallDeck } from '../content/calls.js';

const defaultRandom = () => Math.random();

function shuffleOptions(options, randomFn = defaultRandom) {
  const copy = options.map((option) => ({ ...option }));
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck({ calls, seeds, random } = {}) {
  const source = Array.isArray(calls) && calls.length
    ? calls
    : generateCallDeck({ seeds });

  return source.map((call) => ({
    ...call,
    options: shuffleOptions(call.options ?? [], random),
  }));
}

export function createConversationSystem({ calls, seeds, random = defaultRandom } = {}) {
  let baseCalls = calls;
  let seedAssignments = seeds;
  let deck = createDeck({ calls: baseCalls, seeds: seedAssignments, random });
  let currentIndex = 0;
  let empathyScore = 0;

  function ensureDeck() {
    if (!deck.length) {
      deck = createDeck({ calls: baseCalls, seeds: seedAssignments, random });
    }
  }

  function getCurrentCall() {
    ensureDeck();
    return deck[currentIndex] ?? null;
  }

  function getCallCount() {
    ensureDeck();
    return deck.length;
  }

  function getState() {
    ensureDeck();
    return {
      empathyScore,
      currentIndex,
      callCount: getCallCount(),
      isComplete: currentIndex >= deck.length,
    };
  }

  function chooseOption(optionIndex) {
    ensureDeck();
    const call = getCurrentCall();
    if (!call || !Array.isArray(call.options)) {
      return { advanced: false, correct: false, call: null };
    }

    const option = call.options[optionIndex];
    const correct = Boolean(option?.correct);
    if (correct) {
      empathyScore += 1;
    }

    currentIndex += 1;

    return {
      advanced: true,
      correct,
      call,
      nextCall: getCurrentCall(),
      empathyScore,
    };
  }

  function reset({ calls: newCalls, seeds: newSeeds } = {}) {
    if (newCalls) {
      baseCalls = newCalls;
    }
    if (newSeeds) {
      seedAssignments = newSeeds;
    }
    deck = createDeck({ calls: baseCalls, seeds: seedAssignments, random });
    currentIndex = 0;
    empathyScore = 0;
  }

  return {
    getCurrentCall,
    getCallCount,
    getState,
    chooseOption,
    reset,
  };
}
