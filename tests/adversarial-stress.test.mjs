import test from 'node:test';
import assert from 'node:assert/strict';
import { BoardStore, PASTEL_COLORS } from '../src/board-store.js';
import { defineTool, registerTool, invokeTool, validateSchema, supportsWebMcp } from '../src/fastwebmcp.js';
import { registerBoardWebMcpTools } from '../src/webmcp-board-tools.js';

// =========================================================================
// 1. FastWebMCP Negative & Adversarial Tests
// =========================================================================

test('FastWebMCP Adversarial - defineTool rejects invalid definitions', () => {
  // Spec not an object
  assert.throws(() => defineTool(null), /spec must be an object/);
  assert.throws(() => defineTool(undefined), /spec must be an object/);
  assert.throws(() => defineTool('tool_name'), /spec must be an object/);

  // Empty or non-string name
  assert.throws(() => defineTool({ name: '', description: 'd', execute: () => {} }), /non-empty string/);
  assert.throws(() => defineTool({ name: 123, description: 'd', execute: () => {} }), /non-empty string/);

  // Invalid characters in name
  assert.throws(() => defineTool({ name: 'tool with spaces', description: 'd', execute: () => {} }), /1-128 characters/);
  assert.throws(() => defineTool({ name: 'tool@home', description: 'd', execute: () => {} }), /1-128 characters/);
  assert.throws(() => defineTool({ name: 'tool/path', description: 'd', execute: () => {} }), /1-128 characters/);
  assert.throws(() => defineTool({ name: 'tool#1', description: 'd', execute: () => {} }), /1-128 characters/);
  assert.throws(() => defineTool({ name: 'tool🔥', description: 'd', execute: () => {} }), /1-128 characters/);

  // Name too long (>128 chars)
  const longName = 'a'.repeat(129);
  assert.throws(() => defineTool({ name: longName, description: 'd', execute: () => {} }), /1-128 characters/);

  // Invalid description
  assert.throws(() => defineTool({ name: 'valid_name', description: '', execute: () => {} }), /description must be a non-empty string/);
  assert.throws(() => defineTool({ name: 'valid_name', description: null, execute: () => {} }), /description must be a non-empty string/);

  // Execute not a function
  assert.throws(() => defineTool({ name: 'valid_name', description: 'desc', execute: null }), /execute must be a function/);
  assert.throws(() => defineTool({ name: 'valid_name', description: 'desc', execute: 'fn' }), /execute must be a function/);
});

test('FastWebMCP Adversarial - validateSchema forces type and boundary failures', () => {
  const schema = {
    type: 'object',
    properties: {
      str: { type: 'string', enum: ['alpha', 'beta'] },
      num: { type: 'number', minimum: 0, maximum: 100 },
      int: { type: 'integer' },
      bool: { type: 'boolean' },
      arr: { type: 'array', items: { type: 'string' } }
    },
    required: ['str', 'num']
  };

  // Missing required
  assert.equal(validateSchema(schema, {}).valid, false);
  assert.equal(validateSchema(schema, { str: 'alpha' }).valid, false);
  assert.equal(validateSchema(schema, null).valid, false);
  assert.equal(validateSchema(schema, [1, 2]).valid, false);
  assert.equal(validateSchema(schema, 'not an object').valid, false);

  // Enum violation
  assert.equal(validateSchema(schema, { str: 'gamma', num: 50 }).valid, false);

  // Number boundary and float/integer violations
  assert.equal(validateSchema(schema, { str: 'alpha', num: -1 }).valid, false);
  assert.equal(validateSchema(schema, { str: 'alpha', num: 101 }).valid, false);
  assert.equal(validateSchema(schema, { str: 'alpha', num: 50, int: 3.14 }).valid, false);
  assert.equal(validateSchema(schema, { str: 'alpha', num: NaN }).valid, false);
  assert.equal(validateSchema(schema, { str: 'alpha', num: Infinity }).valid, false);
  assert.equal(validateSchema(schema, { str: 'alpha', num: -Infinity }).valid, false);

  // Boolean and Array item violation
  assert.equal(validateSchema(schema, { str: 'alpha', num: 50, bool: 'true' }).valid, false);
  assert.equal(validateSchema(schema, { str: 'alpha', num: 50, arr: [123] }).valid, false);

  // Valid payload
  assert.equal(validateSchema(schema, { str: 'beta', num: 50, int: 42, bool: true, arr: ['ok'] }).valid, true);
});

test('FastWebMCP Adversarial - invokeTool error propagation and missing tool handling', async () => {
  // Non-existent tool
  await assert.rejects(async () => {
    await invokeTool('non_existent_tool_xyz', {});
  }, /not found in registry/);

  // Tool whose execute throws an unexpected error
  registerTool({
    name: 'failing_tool',
    description: 'Always throws',
    execute: async () => {
      throw new Error('Database disk full');
    }
  });

  await assert.rejects(async () => {
    await invokeTool('failing_tool', {});
  }, /Database disk full/);
});

test('FastWebMCP Adversarial - Native modelContext throwing error is safely caught', () => {
  // Mock global document with a broken registerTool
  const originalDoc = globalThis.document;
  globalThis.document = {
    modelContext: {
      registerTool: () => {
        throw new Error('Chrome WebMCP sandbox denial');
      }
    }
  };

  assert.equal(supportsWebMcp(), true);

  // Register should catch native failure and log warning without crashing
  const registered = registerTool({
    name: 'safe_test_tool',
    description: 'Safe tool',
    execute: async () => 'ok'
  });

  assert.equal(registered, true);

  // Clean up mock
  globalThis.document = originalDoc;
});

// =========================================================================
// 2. BoardStore Boundary, Stress & Integrity Tests
// =========================================================================

test('BoardStore Adversarial - addElement input sanity and clamping', () => {
  const store = new BoardStore({ autoLoad: false });

  assert.throws(() => store.addElement(null), /must be an object/);
  assert.throws(() => store.addElement(undefined), /must be an object/);

  // Clamping extreme or negative values
  const sticky = store.addElement({
    type: 'sticky',
    x: NaN,
    y: Infinity,
    width: -50,
    height: 0
  });

  assert.equal(sticky.x, 100); // Reset to default
  assert.equal(sticky.y, 100);
  assert.equal(sticky.width, 10); // Clamped to minimum 10px
  assert.equal(sticky.height, 10);
});

test('BoardStore Adversarial - History stack limit & redo invalidation stress', () => {
  const store = new BoardStore({ autoLoad: false });
  store.maxHistory = 50;

  // Push 120 elements sequentially
  for (let i = 0; i < 120; i++) {
    store.addElement({ type: 'sticky', text: `Item ${i}` });
  }

  assert.equal(store.elements.size, 120);
  // Undo stack must strictly not exceed maxHistory (50)
  assert.equal(store.undoStack.length, 50);

  // Redo stack invalidation: undo 3 times
  store.undo();
  store.undo();
  store.undo();
  assert.equal(store.redoStack.length, 3);

  // Adding a new element must destroy future redo states (standard branching behavior)
  store.addElement({ type: 'shape', text: 'Branching Element' });
  assert.equal(store.redoStack.length, 0);
  assert.equal(store.redo(), false); // Redo cannot proceed
});

test('BoardStore Adversarial - Edge case connector connections (Self-loop & Missing IDs)', () => {
  const store = new BoardStore({ autoLoad: false });
  const shape = store.addElement({ type: 'shape', x: 200, y: 200, width: 100, height: 100 }, false);

  // 1. Self loop: element connecting to itself
  const selfLoop = store.addElement({
    type: 'connector',
    fromId: shape.id,
    toId: shape.id
  }, false);

  const selfCoords = store.resolveConnectorCoords(selfLoop);
  // Must NOT produce overlapping identical points
  assert.notEqual(selfCoords.fromPt.x, selfCoords.toPt.x);
  assert.equal(selfCoords.fromPt.side, 'top');
  assert.equal(selfCoords.toPt.side, 'right');

  // 2. Connector pointing to non-existent ID
  const dangling = store.addElement({
    type: 'connector',
    fromId: 'missing_id_1',
    toId: 'missing_id_2',
    fromPoint: { x: 50, y: 50 },
    toPoint: { x: 150, y: 150 }
  }, false);

  const danglingCoords = store.resolveConnectorCoords(dangling);
  assert.equal(danglingCoords.fromPt.x, 50);
  assert.equal(danglingCoords.toPt.x, 150);
});

test('BoardStore Adversarial - Cascade connector cleanup with 10 attached lines', () => {
  const store = new BoardStore({ autoLoad: false });
  const centerNode = store.addElement({ type: 'shape', text: 'Hub' }, false);

  for (let i = 0; i < 10; i++) {
    const satellite = store.addElement({ type: 'sticky', text: `Node ${i}` }, false);
    store.addElement({ type: 'connector', fromId: centerNode.id, toId: satellite.id }, false);
  }

  // 1 hub + 10 satellites + 10 connectors = 21 elements
  assert.equal(store.elements.size, 21);

  // Deleting the central hub must automatically prune all 10 connectors!
  store.removeElements([centerNode.id]);
  assert.equal(store.elements.size, 10);
  for (const el of store.elements.values()) {
    assert.equal(el.type, 'sticky');
  }
});

test('BoardStore Adversarial - Malformed JSON Import Attacks', () => {
  const store = new BoardStore({ autoLoad: false });
  store.addElement({ type: 'sticky', text: 'Safe Content' }, false);

  // Attack with invalid inputs
  assert.equal(store.importFromJSON(''), false);
  assert.equal(store.importFromJSON(null), false);
  assert.equal(store.importFromJSON(undefined), false);
  assert.equal(store.importFromJSON(42), false);
  assert.equal(store.importFromJSON('{ broken: json }'), false);
  assert.equal(store.importFromJSON('{ "elements": "string_not_array" }'), false);

  // State should not have been corrupted by failed imports
  assert.equal(store.elements.size, 1);

  // Import with null/invalid entries inside elements array
  const corruptedBatch = JSON.stringify({
    boardTitle: 'Filtered Board',
    elements: [
      null,
      undefined,
      'invalid item',
      { missing_id: true },
      { id: 'valid_1', type: 'sticky', text: 'Survived', x: 50, y: 50 }
    ]
  });

  const success = store.importFromJSON(corruptedBatch);
  assert.equal(success, true);
  assert.equal(store.elements.size, 1);
  assert.equal(store.elements.get('valid_1').text, 'Survived');
});

test('BoardStore Stress Test - 1,000 elements mass instantiation, bounds and serialization', () => {
  const store = new BoardStore({ autoLoad: false });

  const startTime = Date.now();
  for (let i = 0; i < 1000; i++) {
    store.addElement({
      type: 'shape',
      shapeType: 'rectangle',
      text: `Item ${i}`,
      x: (i % 50) * 120,
      y: Math.floor(i / 50) * 120,
      width: 100,
      height: 80
    }, false);
  }

  assert.equal(store.elements.size, 1000);

  // Bounds calculation
  const bounds = store.getBoardBounds();
  assert.ok(bounds.width > 5000);
  assert.ok(bounds.height > 2000);

  // Zoom to fit
  store.zoomToFit(1200, 800);
  assert.ok(store.zoom > 0);
  assert.ok(Number.isFinite(store.panX));
  assert.ok(Number.isFinite(store.panY));

  // Export JSON
  const jsonStr = store.exportToJSON();
  assert.ok(jsonStr.length > 50000);

  // Import roundtrip
  const roundtripStore = new BoardStore({ autoLoad: false });
  assert.equal(roundtripStore.importFromJSON(jsonStr), true);
  assert.equal(roundtripStore.elements.size, 1000);

  const duration = Date.now() - startTime;
  // Should easily complete in under 500ms
  assert.ok(duration < 500, `Duration was ${duration}ms`);
});

// =========================================================================
// 3. WebMCP Board Tools Adversarial Suite
// =========================================================================

test('WebMCP Board Tools Adversarial - Negative invocations and validation catches', async () => {
  const store = new BoardStore({ autoLoad: false });
  registerBoardWebMcpTools(store);

  // Missing required 'text' in sticky note
  await assert.rejects(async () => {
    await invokeTool('whiteboard_create_sticky_note', { color: 'blue' });
  }, /Missing required property "text"/);

  // Invalid shapeType (enum check)
  await assert.rejects(async () => {
    await invokeTool('whiteboard_create_shape', { shapeType: 'hexagonal_star' });
  }, /Value "hexagonal_star" not in enum/);

  // Connecting non-existent elements
  await assert.rejects(async () => {
    await invokeTool('whiteboard_create_connector', { fromId: 'non_existent_1', toId: 'non_existent_2' });
  }, /Source element "non_existent_1" does not exist on board/);

  // Updating non-existent element ID
  await assert.rejects(async () => {
    await invokeTool('whiteboard_update_elements', { id: 'ghost_element', text: 'New Text' });
  }, /Element "ghost_element" not found/);

  // Invalid diagramType
  await assert.rejects(async () => {
    await invokeTool('whiteboard_generate_diagram', { diagramType: 'quantum_circuit' });
  }, /Value "quantum_circuit" not in enum/);

  // Zoom to fit on empty board (must not fail or produce NaN)
  store.clearBoard();
  const zoomRes = await invokeTool('whiteboard_zoom_to_fit', {});
  assert.ok(zoomRes.success);
  assert.ok(Number.isFinite(zoomRes.zoom));

  // Query empty board state
  const stateRes = await invokeTool('whiteboard_get_board_state', {});
  assert.equal(stateRes.totalElements, 0);
  assert.deepEqual(stateRes.elements, []);
});
