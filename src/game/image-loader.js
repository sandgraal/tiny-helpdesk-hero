const cache = new Map();

function createResource(path) {
  if (typeof globalThis.Image !== 'function') {
    return { ready: false, image: null };
  }
  const image = new Image();
  image.decoding = 'async';
  const resource = { ready: false, image };
  image.onload = () => {
    resource.ready = true;
  };
  image.onerror = () => {
    resource.error = true;
  };
  image.src = path;
  return resource;
}

export function getImage(relativePath) {
  if (!relativePath) {
    return { ready: false, image: null, error: true };
  }
  try {
    const resolved = new URL(relativePath, import.meta.url).href;
    if (cache.has(resolved)) {
      return cache.get(resolved);
    }
    const resource = createResource(resolved);
    cache.set(resolved, resource);
    return resource;
  } catch (error) {
    console.warn('[ImageLoader] Failed to resolve asset', relativePath, error);
    return { ready: false, image: null, error: true };
  }
}

export default {
  getImage,
};
