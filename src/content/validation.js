/**
 * Content validation helpers.
 * Returns issue objects so callers can aggregate or throw as needed.
 */

export class ContentValidationError extends Error {
  constructor(issues) {
    super(`Content validation failed with ${issues.length} issue(s).`);
    this.name = 'ContentValidationError';
    this.issues = issues;
  }
}

function pushIssue(issues, { message, path }) {
  issues.push({ message, path });
}

function ensureNonEmptyString(value, path, issues) {
  if (typeof value !== 'string') {
    pushIssue(issues, { message: 'must be a string', path });
    return;
  }
  if (!value.trim()) {
    pushIssue(issues, { message: 'must not be blank', path });
  }
}

export function validatePersonas(personaList, issues = []) {
  const seenIds = new Set();
  personaList.forEach((persona, index) => {
    const basePath = `personas[${index}]`;
    if (!persona || typeof persona !== 'object') {
      pushIssue(issues, { message: 'must be an object', path: basePath });
      return;
    }

    ensureNonEmptyString(persona.id, `${basePath}.id`, issues);
    if (persona.id && seenIds.has(persona.id)) {
      pushIssue(issues, { message: 'id must be unique', path: `${basePath}.id` });
    }
    if (persona.id) {
      seenIds.add(persona.id);
    }

    ensureNonEmptyString(persona.name, `${basePath}.name`, issues);
    ensureNonEmptyString(persona.mood, `${basePath}.mood`, issues);
    ensureNonEmptyString(persona.opener, `${basePath}.opener`, issues);
    ensureNonEmptyString(persona.empathyWin, `${basePath}.empathyWin`, issues);
    ensureNonEmptyString(persona.empathyFail, `${basePath}.empathyFail`, issues);
  });

  return issues;
}

export function validateProblems(problemList, issues = []) {
  const seenIds = new Set();
  problemList.forEach((problem, index) => {
    const basePath = `problems[${index}]`;
    if (!problem || typeof problem !== 'object') {
      pushIssue(issues, { message: 'must be an object', path: basePath });
      return;
    }

    ensureNonEmptyString(problem.id, `${basePath}.id`, issues);
    if (problem.id && seenIds.has(problem.id)) {
      pushIssue(issues, { message: 'id must be unique', path: `${basePath}.id` });
    }
    if (problem.id) {
      seenIds.add(problem.id);
    }

    ensureNonEmptyString(problem.summary, `${basePath}.summary`, issues);
    ensureNonEmptyString(problem.guidance, `${basePath}.guidance`, issues);
    ensureNonEmptyString(problem.empathyWin, `${basePath}.empathyWin`, issues);
    ensureNonEmptyString(problem.empathyFail, `${basePath}.empathyFail`, issues);

    const incorrectPath = `${basePath}.incorrect`;
    if (!Array.isArray(problem.incorrect)) {
      pushIssue(issues, { message: 'must be an array with at least two items', path: incorrectPath });
    } else {
      if (problem.incorrect.length < 2) {
        pushIssue(issues, { message: 'must include at least two entries', path: incorrectPath });
      }
      problem.incorrect.forEach((option, optionIndex) => {
        ensureNonEmptyString(option, `${incorrectPath}[${optionIndex}]`, issues);
      });
    }
  });

  return issues;
}

export function validateTwists(twistList, issues = []) {
  const seenIds = new Set();
  twistList.forEach((twist, index) => {
    const basePath = `twists[${index}]`;
    if (!twist || typeof twist !== 'object') {
      pushIssue(issues, { message: 'must be an object', path: basePath });
      return;
    }

    ensureNonEmptyString(twist.id, `${basePath}.id`, issues);
    if (twist.id && seenIds.has(twist.id)) {
      pushIssue(issues, { message: 'id must be unique', path: `${basePath}.id` });
    }
    if (twist.id) {
      seenIds.add(twist.id);
    }

    ensureNonEmptyString(twist.promptModifier, `${basePath}.promptModifier`, issues);

    if (Object.prototype.hasOwnProperty.call(twist, 'empathyBoost')) {
      ensureNonEmptyString(twist.empathyBoost, `${basePath}.empathyBoost`, issues);
    }
  });

  return issues;
}

export function validateSeeds(seedAssignments, { personas = [], problems = [], twists = [] } = {}, issues = []) {
  const personaIds = new Set(personas.map((persona) => persona?.id).filter(Boolean));
  const problemIds = new Set(problems.map((problem) => problem?.id).filter(Boolean));
  const twistIds = new Set(twists.map((twist) => twist?.id).filter(Boolean));

  (seedAssignments ?? []).forEach((seed, index) => {
    const basePath = `seeds[${index}]`;
    if (!seed || typeof seed !== 'object') {
      pushIssue(issues, { message: 'must be an object', path: basePath });
      return;
    }

    const personaId = typeof seed.persona === 'string' ? seed.persona : seed.persona?.id;
    if (!personaId || !personaIds.has(personaId)) {
      pushIssue(issues, { message: `persona id ${personaId ?? 'undefined'} not found`, path: `${basePath}.persona` });
    }

    const problemId = typeof seed.problem === 'string' ? seed.problem : seed.problem?.id;
    if (!problemId || !problemIds.has(problemId)) {
      pushIssue(issues, { message: `problem id ${problemId ?? 'undefined'} not found`, path: `${basePath}.problem` });
    }

    if (seed.twist !== undefined && seed.twist !== null) {
      const twistId = typeof seed.twist === 'string' ? seed.twist : seed.twist?.id;
      if (!twistId || !twistIds.has(twistId)) {
        pushIssue(issues, { message: `twist id ${twistId ?? 'undefined'} not found`, path: `${basePath}.twist` });
      }
    }
  });

  return issues;
}

export function validateAllContent({ personas, problems, twists, seeds }) {
  const issues = [];
  validatePersonas(personas ?? [], issues);
  validateProblems(problems ?? [], issues);
  validateTwists(twists ?? [], issues);
  if (seeds) {
    validateSeeds(seeds, { personas, problems, twists }, issues);
  }
  return issues;
}

export function assertContentValid(allContent) {
  const issues = validateAllContent(allContent);
  if (issues.length) {
    throw new ContentValidationError(issues);
  }
  return true;
}

export function formatContentIssues(issues) {
  return issues.map((issue) => `${issue.path}: ${issue.message}`);
}
