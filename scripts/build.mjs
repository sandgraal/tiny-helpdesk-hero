#!/usr/bin/env node
/**
 * Simple build step that stages static assets for GitHub Pages.
 */

import { mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const distDir = join(root, 'dist');

async function ensureDist() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
}

async function copyStatic() {
  await cp(join(root, 'public'), distDir, { recursive: true });
  await cp(join(root, 'src'), join(distDir, 'src'), { recursive: true });
}

async function copyNoJekyll() {
  const source = join(root, '.nojekyll');
  try {
    await cp(source, join(distDir, '.nojekyll'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeFile(join(distDir, '.nojekyll'), '');
      return;
    }
    throw error;
  }
}

async function main() {
  await ensureDist();
  await copyStatic();
  await copyNoJekyll();
  console.log(`dist prepared at ${distDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
