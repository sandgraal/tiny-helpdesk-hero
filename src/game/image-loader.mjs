const cache = new Map();
const manifestRelativePaths = new Set();
const manifestResolvedPaths = new Set();

function getBaseURL() {
  if (globalThis.document?.baseURI) {
    return globalThis.document.baseURI;
  }
  if (globalThis.location) {
    const { origin, pathname } = globalThis.location;
    return `${origin}${pathname.replace(/[^/]*$/, '')}`;
  }
  return import.meta.url;
}

function resolvePath(relativePath) {
  return new URL(relativePath, getBaseURL()).href;
}

function normalizePath(path) {
  if (!path) {
    return null;
  }
  try {
    return resolvePath(path);
  } catch (error) {
    return path;
  }
}

function isImageReady(image) {
  if (!image) {
    return false;
  }
  if (typeof image.complete === 'boolean' && !image.complete) {
    return false;
  }
  if (typeof image.naturalWidth === 'number') {
    return image.naturalWidth > 0 || image.naturalHeight > 0;
  }
  if (typeof image.width === 'number' && typeof image.height === 'number') {
    return image.width > 0 && image.height > 0;
  }
  return true;
}

function getTextureInfos() {
  if (Array.isArray(globalThis.textureInfos)) {
    return globalThis.textureInfos;
  }
  try {
    if (Array.isArray(textureInfos)) {
      return textureInfos;
    }
  } catch (error) {
    // Ignore reference errors when LittleJS globals are not available yet.
  }
  return undefined;
}

function findTextureInfo(resolved) {
  const infos = getTextureInfos();
  if (!Array.isArray(infos) || !infos.length) {
    return null;
  }
  for (const info of infos) {
    const image = info?.image;
    if (!image) {
      continue;
    }
    const candidate = image.currentSrc || image.src;
    if (!candidate) {
      continue;
    }
    const normalized = normalizePath(candidate);
    if (normalized === resolved) {
      return { textureInfo: info, image };
    }
  }
  return null;
}

function adoptTexture(resource, resolved) {
  const match = findTextureInfo(resolved);
  if (!match) {
    return false;
  }
  const { image, textureInfo } = match;
  if (resource.image !== image) {
    resource.image = image;
  }
  resource.ready = isImageReady(image);
  resource.textureInfo = textureInfo;
  resource.awaitingTexture = false;
  return true;
}

function createDomImageResource(resolved) {
  if (typeof globalThis.Image !== 'function') {
    return { ready: false, image: null };
  }
  const image = new globalThis.Image();
  image.decoding = 'async';
  const resource = { ready: false, image };
  image.onload = () => {
    resource.ready = true;
  };
  image.onerror = () => {
    resource.error = true;
  };
  image.src = resolved;
  return resource;
}

function createPlaceholderResource() {
  return { ready: false, image: null, awaitingTexture: true };
}

function rememberResolvedPath(resolved) {
  if (!resolved) {
    return;
  }
  manifestResolvedPaths.add(resolved);
}

export function registerManifestPaths(paths = []) {
  for (const path of paths) {
    if (typeof path !== 'string' || !path) {
      continue;
    }
    manifestRelativePaths.add(path);
    try {
      rememberResolvedPath(resolvePath(path));
    } catch (error) {
      // Ignore paths that cannot be resolved yet (e.g., during tests without DOM).
    }
  }
}

export function syncWithTextureInfos() {
  for (const [resolved, resource] of cache.entries()) {
    if (!resource) {
      continue;
    }
    if (resource.awaitingTexture || manifestResolvedPaths.has(resolved)) {
      adoptTexture(resource, resolved);
    }
  }
}

export function __resetImageLoaderForTests() {
  cache.clear();
  manifestRelativePaths.clear();
  manifestResolvedPaths.clear();
}

export function getImage(relativePath) {
  if (!relativePath) {
    return { ready: false, image: null, error: true };
  }
  try {
    const resolved = resolvePath(relativePath);
    let resource = cache.get(resolved);
    if (resource) {
      adoptTexture(resource, resolved);
      return resource;
    }

    const preferTexture = manifestRelativePaths.has(relativePath) || manifestResolvedPaths.has(resolved);
    if (preferTexture) {
      rememberResolvedPath(resolved);
    }
    resource = preferTexture ? createPlaceholderResource() : createDomImageResource(resolved);
    cache.set(resolved, resource);

    if (preferTexture) {
      adoptTexture(resource, resolved);
    }

    return resource;
  } catch (error) {
    console.warn('[ImageLoader] Failed to resolve asset', relativePath, error);
    return { ready: false, image: null, error: true };
  }
}

export default {
  getImage,
  registerManifestPaths,
  syncWithTextureInfos,
};
