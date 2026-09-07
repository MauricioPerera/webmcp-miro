import test from 'node:test';
import assert from 'node:assert/strict';
import { BoardStore } from '../src/board-store.js';

test('BoardStore - Coordinate conversion (screenToWorld and worldToScreen)', () => {
  const store = new BoardStore({ autoLoad: false, panX: 100, panY: 50, zoom: 2.0 });

  // Screen point (300, 250) -> World point: (300 - 100) / 2 = 100, (250 - 50) / 2 = 100
  const world = store.screenToWorld(300, 250);
  assert.equal(world.x, 100);
  assert.equal(world.y, 100);

  // World point (100, 100) -> Screen point: 100 * 2 + 100 = 300, 100 * 2 + 50 = 250
  const screen = store.worldToScreen(world.x, world.y);
  assert.equal(screen.x, 300);
  assert.equal(screen.y, 250);
});

test('BoardStore - Grid snapping when enabled', () => {
  const store = new BoardStore({ autoLoad: false, snapToGrid: true });
  store.gridSize = 20;

  assert.equal(store.snap(12), 20);
  assert.equal(store.snap(8), 0);
  assert.equal(store.snap(29), 20);
  assert.equal(store.snap(31), 40);

  store.snapToGrid = false;
  assert.equal(store.snap(12), 12);
});

test('BoardStore - getBoardBounds and zoomToFit calculations', () => {
  const store = new BoardStore({ autoLoad: false });
  store.addElement({ type: 'sticky', x: 100, y: 100, width: 200, height: 200 }, false);
  store.addElement({ type: 'sticky', x: 500, y: 400, width: 200, height: 200 }, false);

  const bounds = store.getBoardBounds();
  assert.equal(bounds.minX, 100);
  assert.equal(bounds.minY, 100);
  assert.equal(bounds.maxX, 700);
  assert.equal(bounds.maxY, 600);
  assert.equal(bounds.width, 600);
  assert.equal(bounds.height, 500);

  store.zoomToFit(1200, 800, 50);
  assert.ok(store.zoom > 0 && store.zoom <= 1.5);
});
