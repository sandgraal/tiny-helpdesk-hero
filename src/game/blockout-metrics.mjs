/**
 * Blockout metrics for the milestone 2.6 hero desk scene.
 *
 * The measurements mirror the Blender greybox used for the 3D handoff so
 * engineers and artists are referencing the same coordinate space.  Units are
 * expressed in meters inside the DCC file; monitor frame data is expressed in
 * pixels because it corresponds to the LittleJS render texture.
 */

export const blockoutCamera = Object.freeze({
  /** Field-of-view captured from the Blender greybox camera. */
  fovDegrees: 36,
  /** Camera pivot (in meters) relative to the hero root. */
  pivot: Object.freeze({ x: -0.62, y: 1.58, z: 3.42 }),
  /** Look-at target anchored to the center of the monitor bezel. */
  target: Object.freeze({ x: 0.04, y: 1.32, z: 0 }),
  /** Camera up vector for reference in external tools. */
  up: Object.freeze({ x: 0, y: 1, z: 0 }),
  /** Matching sensor size used to replicate the framing in LittleJS. */
  filmAperture: Object.freeze({ width: 0.825, height: 0.464 }),
});

export const deskFootprint = Object.freeze({
  /** Bounding box of the desk surface used for collision/proxy exports. */
  surfaceSize: Object.freeze({ width: 1.82, depth: 0.92 }),
  /** Hero chair placement ensures shoulder framing aligns with the concept art. */
  heroSeat: Object.freeze({ x: -0.38, y: 0.61, z: -0.46 }),
  /** Monitor stand origin so cables/props can be aligned during retopo. */
  monitorOrigin: Object.freeze({ x: 0, y: 0.97, z: -0.08 }),
  /** Desk lamp and mug reference points for animation pivots. */
  props: Object.freeze({
    lamp: { x: 0.62, y: 1.03, z: -0.34 },
    mug: { x: -0.44, y: 0.99, z: -0.28 },
    notes: { x: 0.34, y: 1.01, z: -0.18 },
  }),
});

export const monitorFrameSpec = Object.freeze({
  /** Pixel dimensions of the physical frame texture. */
  totalSize: Object.freeze({ width: 1100, height: 760 }),
  /** Safe-area inset within the frame reserved for the LittleJS render texture. */
  safeInset: Object.freeze({ x: 80, y: 80 }),
  /** Safe-area dimensions derived from the inset. */
  safeArea: Object.freeze({ x: 80, y: 80, width: 940, height: 600 }),
  /** Canvas anchoring percentages measured from the greybox capture. */
  canvasAnchor: Object.freeze({ top: 0.08, widthCoverage: 0.86, heightCoverage: 0.72 }),
});

/**
 * Computes the monitor frame rectangle within the given canvas size.
 * Returns both the full frame bounds and the inner safe area so callers can
 * blit the LittleJS UI without re-implementing the math.
 */
export function fitMonitorFrameToCanvas(canvasWidth, canvasHeight, options = {}) {
  const coverage = {
    width: options.widthCoverage ?? monitorFrameSpec.canvasAnchor.widthCoverage,
    height: options.heightCoverage ?? monitorFrameSpec.canvasAnchor.heightCoverage,
    top: options.top ?? monitorFrameSpec.canvasAnchor.top,
  };

  const total = monitorFrameSpec.totalSize;
  const targetWidth = canvasWidth * coverage.width;
  const targetHeight = canvasHeight * coverage.height;
  const scale = Math.min(targetWidth / total.width, targetHeight / total.height);
  const frameWidth = Math.round(total.width * scale);
  const frameHeight = Math.round(total.height * scale);
  const frameX = Math.round((canvasWidth - frameWidth) / 2);
  const frameY = Math.round(canvasHeight * coverage.top);

  const safe = monitorFrameSpec.safeArea;
  const safeArea = {
    x: frameX + Math.round(safe.x * scale),
    y: frameY + Math.round(safe.y * scale),
    width: Math.round(safe.width * scale),
    height: Math.round(safe.height * scale),
  };

  return {
    frame: { x: frameX, y: frameY, width: frameWidth, height: frameHeight },
    safeArea,
    scale,
  };
}

/**
 * Estimates whether the monitor safe area remains readable for a given canvas
 * size.  Returns both the scaled safe-area bounds and boolean flags that can be
 * surfaced in tooling or QA dashboards.
 */
export function evaluateMonitorReadability(canvasWidth, canvasHeight, thresholds = {}, options = {}) {
  const minimums = {
    width: thresholds.minWidth ?? 640,
    height: thresholds.minHeight ?? 360,
  };
  const { layout, ...coverage } = options ?? {};
  const layoutResult = layout ?? fitMonitorFrameToCanvas(canvasWidth, canvasHeight, coverage);
  const safeArea = layoutResult.safeArea ?? { width: 0, height: 0 };
  const meetsWidth = safeArea.width >= minimums.width;
  const meetsHeight = safeArea.height >= minimums.height;

  return {
    ...layoutResult,
    meetsWidth,
    meetsHeight,
    isReadable: meetsWidth && meetsHeight,
    pixelsPerUiUnit: safeArea.width / monitorFrameSpec.safeArea.width,
  };
}

export default {
  blockoutCamera,
  deskFootprint,
  monitorFrameSpec,
  fitMonitorFrameToCanvas,
  evaluateMonitorReadability,
};
