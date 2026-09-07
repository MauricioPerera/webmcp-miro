import test from 'node:test';
import assert from 'node:assert/strict';
import { BoardStore } from '../src/board-store.js';
import { defineTool, registerTool, getRegisteredTools, invokeTool, validateSchema } from '../src/fastwebmcp.js';
import { registerBoardWebMcpTools } from '../src/webmcp-board-tools.js';

test('FastWebMCP - Schema validation unit check', () => {
  const schema = {
    type: 'object',
    properties: {
      text: { type: 'string' },
      count: { type: 'number' }
    },
    required: ['text']
  };

  assert.equal(validateSchema(schema, { text: 'hello', count: 5 }).valid, true);
  assert.equal(validateSchema(schema, { count: 5 }).valid, false);
  assert.equal(validateSchema(schema, { text: 123 }).valid, false);
});

test('FastWebMCP - Tool registration and execution', async () => {
  registerTool({
    name: 'test_calc_area',
    title: 'Calculate Area',
    description: 'Calculates rectangle area',
    inputSchema: {
      type: 'object',
      properties: {
        width: { type: 'number' },
        height: { type: 'number' }
      },
      required: ['width', 'height']
    },
    execute: async ({ width, height }) => ({ area: width * height })
  });

  const res = await invokeTool('test_calc_area', { width: 10, height: 20 });
  assert.equal(res.area, 200);

  await assert.rejects(async () => {
    await invokeTool('test_calc_area', { width: 10 }); // Missing height
  }, /input validation failed/);
});

test('Whiteboard WebMCP Tools - Register and invoke board tools', async () => {
  const store = new BoardStore({ autoLoad: false });
  registerBoardWebMcpTools(store);

  // 1. Create sticky note via WebMCP
  const noteRes = await invokeTool('whiteboard_create_sticky_note', {
    text: 'Note via WebMCP',
    color: 'blue'
  });
  assert.ok(noteRes.success);
  assert.ok(noteRes.id);
  assert.equal(store.elements.size, 1);

  // 2. Create shape via WebMCP
  const shapeRes = await invokeTool('whiteboard_create_shape', {
    shapeType: 'diamond',
    text: 'Decision'
  });
  assert.ok(shapeRes.success);
  assert.equal(store.elements.size, 2);

  // 3. Connect them via WebMCP
  const connRes = await invokeTool('whiteboard_create_connector', {
    fromId: noteRes.id,
    toId: shapeRes.id,
    style: 'curved'
  });
  assert.ok(connRes.success);
  assert.equal(store.elements.size, 3);

  // 4. Generate Kanban diagram via WebMCP
  store.clearBoard();
  const diagramRes = await invokeTool('whiteboard_generate_diagram', {
    diagramType: 'kanban'
  });
  assert.ok(diagramRes.success);
  // 3 frames + notes
  assert.ok(store.elements.size >= 3);

  // 5. Query board state via WebMCP
  const stateRes = await invokeTool('whiteboard_get_board_state', {});
  assert.equal(stateRes.totalElements, store.elements.size);
});
