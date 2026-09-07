import test from 'node:test';
import assert from 'node:assert/strict';
import { BoardStore } from '../src/board-store.js';

test('BoardStore - Undo and Redo stack management', () => {
  const store = new BoardStore({ autoLoad: false });

  // Initial empty
  assert.equal(store.elements.size, 0);

  // Add 1st element
  const e1 = store.addElement({ type: 'sticky', text: 'First' });
  assert.equal(store.elements.size, 1);
  assert.equal(store.undoStack.length, 1);

  // Add 2nd element
  const e2 = store.addElement({ type: 'sticky', text: 'Second' });
  assert.equal(store.elements.size, 2);
  assert.equal(store.undoStack.length, 2);

  // Undo 2nd element
  const undone = store.undo();
  assert.ok(undone);
  assert.equal(store.elements.size, 1);
  assert.equal(store.elements.has(e2.id), false);
  assert.equal(store.elements.has(e1.id), true);

  // Redo 2nd element
  const redone = store.redo();
  assert.ok(redone);
  assert.equal(store.elements.size, 2);
  assert.equal(store.elements.has(e2.id), true);

  // Undo both
  store.undo();
  store.undo();
  assert.equal(store.elements.size, 0);

  // Further undo returns false
  assert.equal(store.undo(), false);
});

test('BoardStore - JSON Export and Import roundtrip', () => {
  const store = new BoardStore({ autoLoad: false, boardTitle: 'Production Flow' });
  store.addElement({ type: 'shape', shapeType: 'rectangle', text: 'Ingress' }, false);
  store.addElement({ type: 'shape', shapeType: 'circle', text: 'Core' }, false);

  const jsonStr = store.exportToJSON();
  assert.ok(typeof jsonStr === 'string');

  const newStore = new BoardStore({ autoLoad: false });
  const success = newStore.importFromJSON(jsonStr);

  assert.ok(success);
  assert.equal(newStore.boardTitle, 'Production Flow');
  assert.equal(newStore.elements.size, 2);
});
