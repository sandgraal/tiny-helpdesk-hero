import { personas, problems, twists, defaultCallSeeds } from '../src/content/calls.mjs';
import { assertContentValid, formatContentIssues, ContentValidationError } from '../src/content/validation.mjs';

try {
  assertContentValid({ personas, problems, twists, seeds: defaultCallSeeds });
  console.log('Content validation passed.');
} catch (error) {
  if (error instanceof ContentValidationError) {
    console.error('Content validation failed:');
    formatContentIssues(error.issues).forEach((line) => console.error(` - ${line}`));
    process.exitCode = 1;
  } else {
    throw error;
  }
}
