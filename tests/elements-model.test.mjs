import test from 'node:test';
import assert from 'node:assert/strict';
import { BoardStore, PASTEL_COLORS } from '../src/board-store.js';

test('BoardStore - Elements CRUD and defaults', () => {
  const store = new BoardStore({ autoLoad: false });

  const sticky = store.addElement({ type: 'sticky', text: 'Task 1' });
  assert.ok(sticky.id);
  assert.equal(sticky.color, PASTEL_COLORS.yellow);
  assert.equal(sticky.width, 180);
  assert.equal(sticky.height, 180);

  const shape = store.addElement({ type: 'shape', shapeType: 'circle', text: 'API' });
  assert.equal(shape.shapeType, 'circle');
  assert.equal(shape.text, 'API');

  // Update
  store.updateElement(sticky.id, { text: 'Updated Task', color: PASTEL_COLORS.blue });
  assert.equal(store.elements.get(sticky.id).text, 'Updated Task');
  assert.equal(store.elements.get(sticky.id).color, PASTEL_COLORS.blue);
});

test('BoardStore - Smart Connector endpoints resolution and tracking', () => {
  const store = new BoardStore({ autoLoad: false });

  const shape1 = store.addElement({ type: 'shape', x: 100, y: 100, width: 100, height: 100 }, false);
  const shape2 = store.addElement({ type: 'shape', x: 400, y: 100, width: 100, height: 100 }, false);

  const conn = store.addElement({
    type: 'connector',
    fromId: shape1.id,
    toId: shape2.id,
    style: 'curved'
  }, false);

  const coords = store.resolveConnectorCoords(conn);
  // Shape1 is to the left of Shape2, so Shape1 right anchor (200, 150) connects to Shape2 left anchor (400, 150)
  assert.equal(coords.fromPt.x, 200);
  assert.equal(coords.fromPt.y, 150);
  assert.equal(coords.toPt.x, 400);
  assert.equal(coords.toPt.y, 150);

  // Move shape1 down
  store.updateElement(shape1.id, { x: 400, y: 400 });
  const updatedCoords = store.resolveConnectorCoords(conn);
  // Now Shape1 (y: 400-500) is below Shape2 (y: 100-200), so Shape1 top connects to Shape2 bottom
  assert.equal(updatedCoords.fromPt.x, 450);
  assert.equal(updatedCoords.fromPt.y, 400);
  assert.equal(updatedCoords.toPt.x, 450);
  assert.equal(updatedCoords.toPt.y, 200);
});

test('BoardStore - Cascade connector deletion when connected element is removed', () => {
  const store = new BoardStore({ autoLoad: false });
  const s1 = store.addElement({ type: 'shape' }, false);
  const s2 = store.addElement({ type: 'shape' }, false);
  const conn = store.addElement({ type: 'connector', fromId: s1.id, toId: s2.id }, false);

  assert.equal(store.elements.size, 3);
  store.removeElements([s1.id]);
  assert.equal(store.elements.has(s1.id), false);
  assert.equal(store.elements.has(conn.id), false);
  assert.equal(store.elements.has(s2.id), true);
});

test('BoardStore - Frame movement propagates to enclosed elements', () => {
  const store = new BoardStore({ autoLoad: false });
  const frame = store.addElement({ type: 'frame', x: 100, y: 100, width: 500, height: 400 }, false);
  const sticky = store.addElement({ type: 'sticky', x: 150, y: 150, width: 100, height: 100 }, false);

  // Move frame by dx: +50, dy: +50
  store.updateElement(frame.id, { x: 150, y: 150, dx: 50, dy: 50 });
  assert.equal(store.elements.get(frame.id).x, 150);
  assert.equal(store.elements.get(sticky.id).x, 200);
  assert.equal(store.elements.get(sticky.id).y, 200);
});
