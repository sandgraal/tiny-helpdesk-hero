/**
 * Desk scene renderer placeholder.
 * Currently blits the monitor display texture to the main context so future
 * over-the-shoulder composition can slot in without touching the lifecycle.
 */

export function createDeskScene({ monitorDisplay, camera }) {
  function render({ context, canvasSize }) {
    if (!context || !monitorDisplay) {
      return;
    }
    const { width = 640, height = 360 } = canvasSize ?? {};
    const cameraState = camera?.getState?.();
    const offset = cameraState?.offset ?? { x: 0, y: 0 };

    context.save?.();
    if (context.translate && (offset.x !== 0 || offset.y !== 0)) {
      context.translate(offset.x, offset.y);
    }
    monitorDisplay.drawTo(context, {
      dx: 0,
      dy: 0,
      dWidth: width,
      dHeight: height,
    });
    context.restore?.();
  }

  return {
    render,
  };
}

export default createDeskScene;
