import colors from './constants/colors';
import config from './config';
import dom from './dom';
import IUnit from './models/unit';
import CharType from './models/charType';

// DOM references
const detailsElement = document.getElementById('details');

const direction = {
  left: 0,
  up: 1,
  right: 2,
  down: 3,
};

const viewportLayers = [];
const viewportLayersMap: any = {};
const cursor = { x: 0, y: 0 };

const weightedGrassPool = [
  { char: '░', color: colors.green, weight: .80 },
  { char: '▒', color: colors.green, weight: .15 },
  { char: '▓', color: colors.green, weight: .05 },
];

let bgGrid = initGrid(() => ({ tile: getRandomItem(weightedGrassPool) }));
let unitGrid = initGrid();

function drawTile(layer, x, y, tile) {
  if (!tile || !tile.char) { return; }
  layer.context.fillStyle = tile.color || config.defaultDrawColor;
  layer.context.fillText(tile.char, x * config.pixelsPerTileX, y * config.pixelsPerTileY);
}

function drawCursor() {
  wipeContext(viewportLayersMap.cursor.context);
  viewportLayersMap.cursor.context.fillStyle = colors.white;
  viewportLayersMap.cursor.context.fillText('O', cursor.x * config.pixelsPerTileX, cursor.y * config.pixelsPerTileY);
}

function getTileInfo(x, y) {
  return {
    bg: bgGrid[x][y],
    unit: unitGrid[x][y],
  };
}

function moveCursor(directionDelta) {
  switch (directionDelta) {
    case direction.left: {
      if (cursor.x <= 0) { break; }
      cursor.x -= 1;
      break;
    }
    case direction.up: {
      if (cursor.y <= 0) { break; }
      cursor.y -= 1;
      break;
    }
    case direction.right: {
      if (cursor.x >= config.dimensions.columns - 1) { break; }
      cursor.x += 1;
      break;
    }
    case direction.down: {
      if (cursor.y >= config.dimensions.rows - 1) { break; }
      cursor.y += 1;
      break;
    }
  }

  updateDetails();
  drawCursor();
}

function updateDetails() {
  const tileInfo = getTileInfo(cursor.x, cursor.y);
  detailsElement.innerText = JSON.stringify(tileInfo);
}

function wipeContext(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function drawGrid(grid, layer) {
  for (let c = 0; c < config.dimensions.columns; c++) {
    for (let r = 0; r < config.dimensions.rows; r++) {
      if (!grid[c][r] || !grid[c][r].tile) { continue; }
      drawTile(layer, c, r, grid[c][r].tile);
    }
  }
}

function getRandomItem(weightedPool) {
  const roll = Math.random();
  let currentThreshold = 0;
  let foundItem;

  weightedPool.some(item => {
    currentThreshold += item.weight;
    if (roll < currentThreshold) {
      foundItem = item;
      return true;
    }
  });

  // Safeguard mainly for JS float imprecision, or poorly configured pools
  return foundItem || weightedPool[0];
}

function initGrid(initFn?) {
  const grid = [];

  for (let c = 0; c < config.dimensions.columns; c++) {
    grid.push([]);
    for (let r = 0; r < config.dimensions.rows; r++) {
      grid[c].push(initFn ? initFn() : undefined);
    }
  }

  return grid;
}

function createLayers(layerIDs, viewportLayers, viewportLayersMap, pixelRatio) {
  const layers = [];
  const viewport = document.getElementById('grids');

  layerIDs.forEach(id => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const layer = { canvas, context };

    viewport.appendChild(canvas);
    canvas.id = `${id}Canvas`;
    dom.setCanvasDimensions(pixelRatio, canvas, context);
    viewportLayers.push(layer);
    viewportLayersMap[id] = viewportLayers[viewportLayers.length - 1];
    
    // Generic layer styling
    viewportLayersMap[id].context.font = `${config.fontsize}px monospace`;
    viewportLayersMap[id].context.textBaseline = 'top';
  });
}

dom.ready(() => {
  const pixelRatio = dom.getPixelRatio();

  // Key bindings
  document.onkeypress = (e) => {
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case 37: { moveCursor(direction.left); break; }
      case 38: { moveCursor(direction.up); break; }
      case 39: { moveCursor(direction.right); break; }
      case 40: { moveCursor(direction.down); break; }
    }
  };

  // Viewport Layers are rendered in order
  const layerIDs = ['bg', 'units', 'cursor'];
  createLayers(layerIDs, viewportLayers, viewportLayersMap, pixelRatio);

  drawGrid(bgGrid, viewportLayersMap.bg);

  const player: IUnit = {
    name: 'Rob',
    hp: 10,
    maxHp: 10,
    ap: 0,
    apPerRound: 25,
    tile: { char: '@', color: 'red' },
    position: { x: 2, y: 6 },
  };
  unitGrid[2][6] = player;
  drawGrid(unitGrid, viewportLayersMap.units);

  drawCursor();
});
