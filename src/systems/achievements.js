import { achievementDefinitions } from '../content/achievements.js';

function createShiftStats(callCount = 0) {
  return {
    callCount,
    totalCorrect: 0,
    totalIncorrect: 0,
    correctStreak: 0,
    bestStreak: 0,
    consecutiveMisses: 0,
    maxConsecutiveMisses: 0,
    hadIncorrect: false,
    encounteredTwists: new Set(),
  };
}

function getIdFromRef(value) {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  return value.id ?? null;
}

export function createAchievementSystem({ definitions = achievementDefinitions } = {}) {
  const catalog = definitions.map((entry) => ({ ...entry }));
  const unlocked = new Map();
  const state = {
    totalShifts: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    bestStreakEver: 0,
    lastUnlockedBatch: [],
  };

  let shiftStats = createShiftStats();

  function startShift({ callCount } = {}) {
    shiftStats = createShiftStats(callCount ?? 0);
    state.lastUnlockedBatch = [];
  }

  function recordSelection(result) {
    if (!shiftStats) {
      startShift();
    }
    const twistId = getIdFromRef(result?.call?.twist);
    if (twistId) {
      shiftStats.encounteredTwists.add(twistId);
    }

    if (result?.correct) {
      shiftStats.totalCorrect += 1;
      shiftStats.correctStreak += 1;
      shiftStats.bestStreak = Math.max(shiftStats.bestStreak, shiftStats.correctStreak);
      shiftStats.consecutiveMisses = 0;
    } else {
      shiftStats.totalIncorrect += 1;
      shiftStats.hadIncorrect = true;
      shiftStats.correctStreak = 0;
      shiftStats.consecutiveMisses += 1;
      shiftStats.maxConsecutiveMisses = Math.max(
        shiftStats.maxConsecutiveMisses,
        shiftStats.consecutiveMisses,
      );
    }
  }

  function unlock(id) {
    if (unlocked.has(id)) {
      return false;
    }
    const definition = catalog.find((entry) => entry.id === id);
    if (!definition) {
      return false;
    }
    unlocked.set(id, { unlockedAt: Date.now() });
    state.lastUnlockedBatch.push(id);
    return true;
  }

  function evaluateShift({ empathyScore = 0, callCount = 0 }) {
    const unlocks = [];
    if (unlock('first-shift')) {
      unlocks.push('first-shift');
    }
    if (callCount > 0 && empathyScore === callCount && shiftStats.totalIncorrect === 0) {
      if (unlock('perfect-shift')) {
        unlocks.push('perfect-shift');
      }
    }
    if ((shiftStats.bestStreak ?? 0) >= 3) {
      if (unlock('hot-streak')) {
        unlocks.push('hot-streak');
      }
    }
    if (shiftStats.encounteredTwists.has('meta-humor')) {
      if (unlock('meta-moment')) {
        unlocks.push('meta-moment');
      }
    }
    if (shiftStats.hadIncorrect && empathyScore >= Math.ceil(callCount / 2)) {
      if (unlock('comeback-kid')) {
        unlocks.push('comeback-kid');
      }
    }
    if ((shiftStats.maxConsecutiveMisses ?? 0) >= 2 && empathyScore > 0) {
      if (unlock('resilient-rep')) {
        unlocks.push('resilient-rep');
      }
    }
    return unlocks;
  }

  function completeShift({ empathyScore = 0, callCount = 0 } = {}) {
    state.totalShifts += 1;
    state.totalCorrect += shiftStats.totalCorrect;
    state.totalIncorrect += shiftStats.totalIncorrect;
    state.bestStreakEver = Math.max(state.bestStreakEver, shiftStats.bestStreak);

    state.lastUnlockedBatch = [];
    const newlyUnlocked = evaluateShift({ empathyScore, callCount });
    const unlockSet = new Set(state.lastUnlockedBatch);
    state.lastUnlockedBatch = Array.from(unlockSet);

    shiftStats = createShiftStats();
    return newlyUnlocked;
  }

  function getState() {
    return {
      total: catalog.length,
      unlockedCount: unlocked.size,
      entries: catalog.map((entry) => ({
        ...entry,
        unlocked: unlocked.has(entry.id),
        unlockedAt: unlocked.get(entry.id)?.unlockedAt ?? null,
      })),
      recentUnlocks: state.lastUnlockedBatch.slice(),
    };
  }

  function getUnlockedIds() {
    return new Set(unlocked.keys());
  }

  return {
    startShift,
    recordSelection,
    completeShift,
    getState,
    getUnlockedIds,
  };
}

