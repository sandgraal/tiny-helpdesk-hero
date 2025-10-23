import { appendFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const LOG_DIR = resolve(ROOT, 'ai', 'logs');
const LOG_FILE = resolve(LOG_DIR, 'agent-runs.log');

async function ensureLogDir() {
  await mkdir(LOG_DIR, { recursive: true });
}

function buildLogEntry(args) {
  const payload = Object.fromEntries(
    args
      .map((segment) => segment.split('='))
      .filter(([key, value]) => key && value)
  );

  return {
    timestamp: new Date().toISOString(),
    ...payload
  };
}

async function main() {
  await ensureLogDir();
  const args = process.argv.slice(2);
  const entry = buildLogEntry(args);
  await appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`, 'utf8');
  console.log(`Logged agent run details to ${LOG_FILE}`);
}

main().catch((error) => {
  console.error(`Failed to log agent run: ${error.message}`);
  process.exitCode = 1;
});
