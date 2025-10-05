/**
 * Conversation engine scaffolding.
 * TODO: build modular call sequencing with empathy scoring.
 */

export function createConversationSystem({ calls }) {
  return {
    getNextCall() {
      // TODO: implement retrieval logic.
      return calls?.[0] ?? null;
    },
    reset() {
      // TODO: reset internal state.
    },
  };
}
