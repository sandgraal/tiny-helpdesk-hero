import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const CONTEXT_PATH = resolve(ROOT, '.chatgpt-context.yml');
const SITE_CONFIG_PATH = resolve(ROOT, 'ai', 'site-config.json');

function parseProjectNameFromYaml(yaml) {
  for (const rawLine of yaml.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const match = line.match(/^project_name:\s*(.+)$/i);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

async function loadSiteConfig() {
  const raw = await readFile(SITE_CONFIG_PATH, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Unable to parse ai/site-config.json: ${error.message}`);
  }
}

async function main() {
  const [contextContent, siteConfig] = await Promise.all([
    readFile(CONTEXT_PATH, 'utf8'),
    loadSiteConfig()
  ]);

  const contextProjectName = parseProjectNameFromYaml(contextContent);
  const siteProjectName = siteConfig.project_name ?? null;

  if (!contextProjectName) {
    throw new Error('Missing project_name entry in .chatgpt-context.yml');
  }

  if (!siteProjectName) {
    throw new Error('Missing project_name entry in ai/site-config.json');
  }

  if (contextProjectName !== siteProjectName) {
    throw new Error(
      `Project name mismatch between context (${contextProjectName}) and site config (${siteProjectName})`
    );
  }

  console.log(`✅ Loaded project metadata for ${siteProjectName}`);

  if (siteConfig.tagline) {
    console.log(`Tagline: ${siteConfig.tagline}`);
  }

  if (siteConfig.description) {
    console.log(`Description: ${siteConfig.description}`);
  }

  if (siteConfig.content_overview) {
    console.log('\nContent overview:');
    for (const [key, value] of Object.entries(siteConfig.content_overview)) {
      console.log(`  • ${key}: ${value}`);
    }
  }

  if (siteConfig.commands) {
    console.log('\nAvailable commands:');
    for (const [key, value] of Object.entries(siteConfig.commands)) {
      console.log(`  • ${key}: ${value}`);
    }
  }

  if (siteConfig.links) {
    console.log('\nHelpful links:');
    for (const [key, value] of Object.entries(siteConfig.links)) {
      console.log(`  • ${key}: ${value}`);
    }
  }
}

main().catch((error) => {
  console.error(`❌ AI bootstrap failed: ${error.message}`);
  process.exitCode = 1;
});
