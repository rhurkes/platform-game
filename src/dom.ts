import config from './config';

function ready(fn) {
  if ((<any>document).attachEvent ? document.readyState === "complete"
      : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function getPixelRatio() {
  const ratioCanvas = document.createElement('canvas');
  const context = <any>ratioCanvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const bsr = context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;

  return dpr / bsr;
}

function setCanvasDimensions(ratio, canvas, context) {
  const width = config.pixelsPerTileX * config.dimensions.columns;
  const height = config.pixelsPerTileY * config.dimensions.rows;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  // Set the CSS height to be the same as the width to get square tiles when using fillText
  canvas.style.height = `${width}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

export default {
  ready,
  getPixelRatio,
  setCanvasDimensions,
};
