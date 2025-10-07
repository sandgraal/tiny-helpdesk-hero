/**
 * Desk scene renderer placeholder.
 * Currently blits the monitor display texture to the main context so future
 * over-the-shoulder composition can slot in without touching the lifecycle.
 */

export function createDeskScene({ monitorDisplay }) {
  function render({ context, canvasSize }) {
    if (!context || !monitorDisplay) {
      return;
    }
    const { width = 640, height = 360 } = canvasSize ?? {};
    monitorDisplay.drawTo(context, {
      dx: 0,
      dy: 0,
      dWidth: width,
      dHeight: height,
    });
  }

  return {
    render,
  };
}

export default createDeskScene;
