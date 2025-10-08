import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getImage,
  registerManifestPaths,
  syncWithTextureInfos,
  __resetImageLoaderForTests,
} from '../src/game/image-loader.mjs';

function installImageStub(counter) {
  class ImageStub {
    constructor() {
      counter.count += 1;
      this.decoding = 'async';
      this.onload = null;
      this.onerror = null;
      this._src = '';
    }

    set src(value) {
      this._src = value;
      if (typeof this.onload === 'function') {
        this.onload();
      }
    }

    get src() {
      return this._src;
    }
  }

  globalThis.Image = ImageStub;
}

test.beforeEach(() => {
  __resetImageLoaderForTests();
  delete globalThis.textureInfos;
  delete globalThis.document;
  delete globalThis.Image;
});

test.afterEach(() => {
  __resetImageLoaderForTests();
  delete globalThis.textureInfos;
  delete globalThis.document;
  delete globalThis.Image;
});

test('manifest images defer DOM loading and hydrate from LittleJS textures', () => {
  const counter = { count: 0 };
  installImageStub(counter);

  globalThis.document = { baseURI: 'https://example.com/game/' };
  const manifestPath = 'assets/hero/hero-idle.svg';
  registerManifestPaths([manifestPath]);

  const resource = getImage(manifestPath);
  assert.equal(counter.count, 0, 'manifest image should not eager-load via DOM');
  assert.equal(resource.ready, false);
  assert.equal(resource.image, null);

  const resolved = 'https://example.com/game/assets/hero/hero-idle.svg';
  const hydratedImage = {
    src: resolved,
    complete: true,
    naturalWidth: 128,
    naturalHeight: 128,
  };
  globalThis.textureInfos = [{ image: hydratedImage }];

  syncWithTextureInfos();

  assert.equal(resource.ready, true);
  assert.equal(resource.image, hydratedImage);
});

test('non-manifest images still load via DOM Image', () => {
  const counter = { count: 0 };
  installImageStub(counter);

  const resource = getImage('assets/misc/untracked.svg');
  assert.equal(counter.count, 1, 'non-manifest image should use DOM loading');
  assert.ok(resource.image, 'resource should retain DOM image instance');
});

test('subsequent calls reuse hydrated texture info resources', () => {
  const manifestPath = 'assets/ui/ui-option-default.svg';
  globalThis.document = { baseURI: 'https://example.com/game/' };
  registerManifestPaths([manifestPath]);

  const firstResource = getImage(manifestPath);
  const resolved = 'https://example.com/game/assets/ui/ui-option-default.svg';
  const hydratedImage = {
    src: resolved,
    complete: true,
    naturalWidth: 64,
    naturalHeight: 32,
  };
  globalThis.textureInfos = [{ image: hydratedImage }];
  syncWithTextureInfos();

  assert.equal(firstResource.ready, true);
  assert.equal(firstResource.image, hydratedImage);

  const counter = { count: 0 };
  installImageStub(counter);
  const secondResource = getImage(manifestPath);
  assert.equal(counter.count, 0, 'hydrated manifest image should not trigger DOM loading');
  assert.equal(secondResource.image, hydratedImage);
  assert.equal(secondResource.ready, true);
});
