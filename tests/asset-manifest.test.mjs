import test from 'node:test';
import assert from 'node:assert/strict';
import { access, opendir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname } from 'node:path';

import { imageManifest, imageSources } from '../src/game/asset-manifest.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const publicDir = join(repoRoot, 'public');

async function ensureExists(relativePath) {
  const target = join(publicDir, relativePath);
  await access(target);
}

async function *walkSvg(dir) {
  const handle = await opendir(dir);
  for await (const dirent of handle) {
    const entryPath = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield * walkSvg(entryPath);
      continue;
    }
    if (extname(dirent.name).toLowerCase() === '.svg') {
      yield entryPath;
    }
  }
}

test('image manifest entries exist on disk', async () => {
  const missing = [];
  await Promise.all(Object.entries(imageManifest).map(async ([key, relativePath]) => {
    try {
      await ensureExists(relativePath);
    } catch (error) {
      missing.push(`${key}:${relativePath}`);
    }
  }));

  assert.equal(missing.length, 0, `Missing image assets: ${missing.join(', ')}`);
});

test('imageSources exports unique manifest values', () => {
  const unique = new Set(imageSources);
  assert.equal(unique.size, imageSources.length, 'imageSources contains duplicate entries');
});

test('SVG assets avoid <text> nodes (enforce outlined lettering)', async () => {
  const offenders = [];
  for await (const svgPath of walkSvg(join(publicDir, 'assets'))) {
    const contents = await readFile(svgPath, 'utf8');
    if (contents.includes('allow-text')) {
      continue;
    }
    if (contents.includes('<text')) {
      offenders.push(svgPath.replace(`${repoRoot}/`, ''));
    }
  }

  assert.equal(offenders.length, 0, `SVGs still using <text>: ${offenders.join(', ')}`);
});
