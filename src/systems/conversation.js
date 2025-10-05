/**
 * Conversation engine MVP.
 * Handles sequencing through provided calls, tracking empathy score, and reporting progress.
 */

export function createConversationSystem({ calls = [] } = {}) {
  const deck = Array.isArray(calls) ? calls.slice() : [];
  let currentIndex = 0;
  let empathyScore = 0;

  function getCurrentCall() {
    return deck[currentIndex] ?? null;
  }

  function getCallCount() {
    return deck.length;
  }

  function getState() {
    return {
      empathyScore,
      currentIndex,
      callCount: getCallCount(),
      isComplete: currentIndex >= deck.length,
    };
  }

  function chooseOption(optionIndex) {
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

  function reset() {
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
