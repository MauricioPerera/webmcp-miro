/**
 * WebMCP Board Tools Registry
 * Defines and registers the whiteboard's agent tools using FastWebMCP.
 * Complies with the WebMCP specification (https://mauricioperera.github.io/fastwebmcp/ & webmcp.com).
 */

import { registerTool } from './fastwebmcp.js';
import { PASTEL_COLORS } from './board-store.js';

/**
 * Registers all whiteboard WebMCP capabilities for AI agents.
 * @param {import('./board-store.js').BoardStore} store
 */
export function registerBoardWebMcpTools(store) {
  // 1. Create Sticky Note
  registerTool({
    name: 'whiteboard_create_sticky_note',
    title: 'Create Sticky Note',
    description: 'Creates a Miro-style colored sticky note on the canvas at given coordinates.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Content text for the sticky note' },
        color: { type: 'string', description: 'Hex color or pastel name (yellow, blue, green, pink, purple, orange)' },
        x: { type: 'number', description: 'X world coordinate' },
        y: { type: 'number', description: 'Y world coordinate' },
        width: { type: 'number', description: 'Width in pixels (default 180)' },
        height: { type: 'number', description: 'Height in pixels (default 180)' }
      },
      required: ['text']
    },
    execute: async (input) => {
      let resolvedColor = input.color;
      if (resolvedColor && PASTEL_COLORS[resolvedColor.toLowerCase()]) {
        resolvedColor = PASTEL_COLORS[resolvedColor.toLowerCase()];
      }
      const elem = store.addElement({
        type: 'sticky',
        text: input.text,
        color: resolvedColor || PASTEL_COLORS.yellow,
        x: input.x ?? (100 + Math.random() * 200),
        y: input.y ?? (100 + Math.random() * 200),
        width: input.width ?? 180,
        height: input.height ?? 180
      });
      return { success: true, id: elem.id, message: `Sticky note created at (${elem.x}, ${elem.y})` };
    }
  });

  // 2. Create Shape
  registerTool({
    name: 'whiteboard_create_shape',
    title: 'Create Shape',
    description: 'Creates a diagram shape (rectangle, rounded-rectangle, circle, diamond, triangle, cylinder, cloud, star) with text label.',
    inputSchema: {
      type: 'object',
      properties: {
        shapeType: {
          type: 'string',
          enum: ['rectangle', 'rounded-rectangle', 'circle', 'diamond', 'triangle', 'cylinder', 'cloud', 'star'],
          description: 'Type of geometry shape'
        },
        text: { type: 'string', description: 'Label text inside shape' },
        x: { type: 'number', description: 'X world coordinate' },
        y: { type: 'number', description: 'Y world coordinate' },
        width: { type: 'number', description: 'Width of shape' },
        height: { type: 'number', description: 'Height of shape' },
        fillColor: { type: 'string', description: 'Fill background color (hex)' },
        strokeColor: { type: 'string', description: 'Border stroke color (hex)' }
      },
      required: ['shapeType']
    },
    execute: async (input) => {
      const elem = store.addElement({
        type: 'shape',
        shapeType: input.shapeType,
        text: input.text || '',
        x: input.x ?? 150,
        y: input.y ?? 150,
        width: input.width ?? 160,
        height: input.height ?? 100,
        fillColor: input.fillColor ?? '#FFFFFF',
        strokeColor: input.strokeColor ?? '#1E293B'
      });
      return { success: true, id: elem.id, message: `Shape "${input.shapeType}" created with ID ${elem.id}` };
    }
  });

  // 3. Create Connector
  registerTool({
    name: 'whiteboard_create_connector',
    title: 'Create Connector Arrow',
    description: 'Connects two shapes or notes with a smart arrow that tracks their positions.',
    inputSchema: {
      type: 'object',
      properties: {
        fromId: { type: 'string', description: 'Source element ID' },
        toId: { type: 'string', description: 'Target element ID' },
        label: { type: 'string', description: 'Optional text label on connector' },
        style: { type: 'string', enum: ['straight', 'orthogonal', 'curved'], description: 'Line routing style' }
      },
      required: ['fromId', 'toId']
    },
    execute: async (input) => {
      if (!store.elements.has(input.fromId)) {
        throw new Error(`Source element "${input.fromId}" does not exist on board`);
      }
      if (!store.elements.has(input.toId)) {
        throw new Error(`Target element "${input.toId}" does not exist on board`);
      }
      const elem = store.addElement({
        type: 'connector',
        fromId: input.fromId,
        toId: input.toId,
        label: input.label || '',
        style: input.style || 'curved'
      });
      return { success: true, id: elem.id, message: `Connected ${input.fromId} -> ${input.toId}` };
    }
  });

  // 4. Create Frame
  registerTool({
    name: 'whiteboard_create_frame',
    title: 'Create Frame / Container',
    description: 'Creates a named bounding frame container to group elements on the canvas.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Frame title header' },
        x: { type: 'number', description: 'X world coordinate' },
        y: { type: 'number', description: 'Y world coordinate' },
        width: { type: 'number', description: 'Width of frame' },
        height: { type: 'number', description: 'Height of frame' }
      },
      required: ['title']
    },
    execute: async (input) => {
      const elem = store.addElement({
        type: 'frame',
        title: input.title,
        x: input.x ?? 80,
        y: input.y ?? 80,
        width: input.width ?? 500,
        height: input.height ?? 380
      });
      return { success: true, id: elem.id, message: `Frame "${input.title}" created` };
    }
  });

  // 5. Generate Diagram (High level AI builder)
  registerTool({
    name: 'whiteboard_generate_diagram',
    title: 'Generate Complete Diagram',
    description: 'Generates a complete flowchart, kanban board, mindmap, or cloud architecture diagram on the whiteboard in one step.',
    inputSchema: {
      type: 'object',
      properties: {
        diagramType: {
          type: 'string',
          enum: ['kanban', 'flowchart', 'mindmap', 'architecture'],
          description: 'Type of diagram to generate'
        },
        title: { type: 'string', description: 'Title or topic of the diagram' }
      },
      required: ['diagramType']
    },
    execute: async (input) => {
      store.pushSnapshot();
      const originX = 100;
      const originY = 100;

      if (input.diagramType === 'kanban') {
        const columns = [
          { title: 'To Do', color: '#FEF08A', notes: ['User Research', 'Draft Architecture', 'UI Mockups'] },
          { title: 'In Progress', color: '#BAE6FD', notes: ['Implement FastWebMCP', 'Canvas Engine'] },
          { title: 'Done', color: '#BBF7D0', notes: ['Project Setup', 'Contract Verification'] }
        ];

        columns.forEach((col, idx) => {
          const fx = originX + idx * 260;
          const frame = store.addElement({
            type: 'frame',
            title: col.title,
            x: fx,
            y: originY,
            width: 240,
            height: 480
          }, false);

          col.notes.forEach((noteText, nIdx) => {
            store.addElement({
              type: 'sticky',
              text: noteText,
              color: col.color,
              x: fx + 25,
              y: originY + 40 + nIdx * 120,
              width: 190,
              height: 100
            }, false);
          });
        });
      } else if (input.diagramType === 'flowchart') {
        const steps = [
          { type: 'rounded-rectangle', text: 'Start Process', color: '#BBF7D0' },
          { type: 'rectangle', text: 'Analyze Request', color: '#FFFFFF' },
          { type: 'diamond', text: 'Valid Schema?', color: '#FED7AA' },
          { type: 'rectangle', text: 'Execute WebMCP Tool', color: '#BAE6FD' },
          { type: 'rounded-rectangle', text: 'Render Result', color: '#BBF7D0' }
        ];

        let prevId = null;
        steps.forEach((step, idx) => {
          const el = store.addElement({
            type: 'shape',
            shapeType: step.type,
            text: step.text,
            fillColor: step.color,
            x: originX + idx * 200,
            y: originY + 100,
            width: 150,
            height: 80
          }, false);

          if (prevId) {
            store.addElement({
              type: 'connector',
              fromId: prevId,
              toId: el.id,
              style: 'orthogonal'
            }, false);
          }
          prevId = el.id;
        });
      } else if (input.diagramType === 'mindmap') {
        const root = store.addElement({
          type: 'shape',
          shapeType: 'rounded-rectangle',
          text: input.title || 'Central Concept',
          fillColor: '#3B82F6',
          textColor: '#FFFFFF',
          x: originX + 300,
          y: originY + 200,
          width: 180,
          height: 90
        }, false);

        const branches = ['Frontend (Tailwind)', 'HTMX Transitions', 'FastWebMCP Runtime', 'KDD Validation', 'GitHub Pages'];
        branches.forEach((bText, idx) => {
          const angle = (idx * Math.PI * 2) / branches.length;
          const bx = originX + 300 + Math.cos(angle) * 260;
          const by = originY + 200 + Math.sin(angle) * 180;

          const child = store.addElement({
            type: 'sticky',
            text: bText,
            color: PASTEL_COLORS[Object.keys(PASTEL_COLORS)[idx % 6]],
            x: bx,
            y: by,
            width: 150,
            height: 80
          }, false);

          store.addElement({
            type: 'connector',
            fromId: root.id,
            toId: child.id,
            style: 'curved'
          }, false);
        });
      } else if (input.diagramType === 'architecture') {
        const client = store.addElement({ type: 'shape', shapeType: 'rounded-rectangle', text: 'Client Browser (WebMCP)', x: originX, y: originY + 100, width: 170, height: 80 }, false);
        const gateway = store.addElement({ type: 'shape', shapeType: 'diamond', text: 'FastWebMCP Bridge', x: originX + 240, y: originY + 90, width: 160, height: 100 }, false);
        const engine = store.addElement({ type: 'shape', shapeType: 'rectangle', text: 'Canvas & Board Store', x: originX + 480, y: originY + 100, width: 170, height: 80 }, false);
        const db = store.addElement({ type: 'shape', shapeType: 'cylinder', text: 'IndexedDB / LocalStorage', x: originX + 720, y: originY + 90, width: 150, height: 100 }, false);

        store.addElement({ type: 'connector', fromId: client.id, toId: gateway.id, label: 'Tool Spec', style: 'orthogonal' }, false);
        store.addElement({ type: 'connector', fromId: gateway.id, toId: engine.id, label: 'Mutate State', style: 'orthogonal' }, false);
        store.addElement({ type: 'connector', fromId: engine.id, toId: db.id, label: 'Auto-save', style: 'orthogonal' }, false);
      }

      store.zoomToFit(1200, 800);
      store.notify('diagram_generated');
      return { success: true, message: `Diagram "${input.diagramType}" created with ${store.elements.size} elements.` };
    }
  });

  // 6. Get Board State
  registerTool({
    name: 'whiteboard_get_board_state',
    title: 'Get Board State',
    description: 'Retrieves the complete state, element IDs, types, labels, and statistics of the whiteboard.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      const elements = Array.from(store.elements.values()).map(el => ({
        id: el.id,
        type: el.type,
        text: el.text || el.title || el.label || '',
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height
      }));
      return {
        boardId: store.boardId,
        boardTitle: store.boardTitle,
        totalElements: store.elements.size,
        zoom: store.zoom,
        elements
      };
    }
  });

  // 7. Update Elements
  registerTool({
    name: 'whiteboard_update_elements',
    title: 'Update Element Properties',
    description: 'Updates properties (text, color, coordinates) of existing whiteboard elements.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID of element to update' },
        text: { type: 'string', description: 'New text content' },
        color: { type: 'string', description: 'New color' },
        x: { type: 'number', description: 'New X position' },
        y: { type: 'number', description: 'New Y position' }
      },
      required: ['id']
    },
    execute: async (input) => {
      const updates = {};
      if (input.text !== undefined) updates.text = input.text;
      if (input.color !== undefined) updates.color = input.color;
      if (input.x !== undefined) updates.x = input.x;
      if (input.y !== undefined) updates.y = input.y;

      const updated = store.updateElement(input.id, updates, true);
      if (!updated) throw new Error(`Element "${input.id}" not found`);
      return { success: true, updated };
    }
  });

  // 8. Delete Elements
  registerTool({
    name: 'whiteboard_delete_elements',
    title: 'Delete Elements',
    description: 'Removes elements from the board by their IDs.',
    inputSchema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of element IDs to delete'
        }
      },
      required: ['ids']
    },
    execute: async (input) => {
      store.removeElements(input.ids, true);
      return { success: true, deletedCount: input.ids.length };
    }
  });

  // 9. Clear Board
  registerTool({
    name: 'whiteboard_clear_board',
    title: 'Clear Whiteboard',
    description: 'Wipes all content from the whiteboard.',
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
      store.clearBoard();
      return { success: true, message: 'Whiteboard cleared' };
    }
  });

  // 10. Zoom to Fit
  registerTool({
    name: 'whiteboard_zoom_to_fit',
    title: 'Zoom to Fit All Elements',
    description: 'Adjusts zoom and pan to fit all content comfortably within the viewport.',
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
      store.zoomToFit(1200, 800);
      return { success: true, zoom: store.zoom };
    }
  });
}
