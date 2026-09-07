/**
 * Whiteboard State Store & Domain Model
 * Manages canvas elements, smart connector routing, frames, undo/redo history, and persistence.
 */

export const PASTEL_COLORS = {
  yellow: '#FEF08A',
  blue: '#BAE6FD',
  green: '#BBF7D0',
  pink: '#FBCFE8',
  purple: '#E9D5FF',
  orange: '#FED7AA',
  gray: '#F3F4F6',
  white: '#FFFFFF'
};

export const SHAPE_TYPES = [
  'rectangle',
  'rounded-rectangle',
  'circle',
  'diamond',
  'triangle',
  'cylinder',
  'cloud',
  'star'
];

export class BoardStore {
  constructor(options = {}) {
    this.boardId = options.boardId || 'default-board';
    this.boardTitle = options.boardTitle || 'Untitled Miro Board';
    this.elements = new Map(); // id -> Element
    this.selectedIds = new Set();
    this.panX = options.panX || 0;
    this.panY = options.panY || 0;
    this.zoom = options.zoom || 1.0;
    this.gridSize = 20;
    this.snapToGrid = options.snapToGrid || false;

    // History stacks
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 50;

    // Listeners
    this.listeners = new Set();
    this.saveTimeout = null;

    // Initialize with default or load
    if (options.autoLoad !== false) {
      this.loadFromStorage();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(changeType = 'update', detail = {}) {
    for (const listener of this.listeners) {
      try {
        listener({ store: this, changeType, detail });
      } catch (err) {
        console.error('BoardStore listener error:', err);
      }
    }
    this.scheduleSave();
  }

  scheduleSave() {
    if (typeof localStorage === 'undefined') return;
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveToStorage();
    }, 400);
  }

  // --- Snapshot & History ---

  createSnapshot() {
    return {
      elements: Array.from(this.elements.values()).map(el => JSON.parse(JSON.stringify(el))),
      panX: this.panX,
      panY: this.panY,
      zoom: this.zoom
    };
  }

  pushSnapshot() {
    const snapshot = this.createSnapshot();
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length === 0) return false;
    const current = this.createSnapshot();
    this.redoStack.push(current);
    const prev = this.undoStack.pop();
    this.restoreSnapshot(prev);
    this.notify('undo');
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;
    const current = this.createSnapshot();
    this.undoStack.push(current);
    const next = this.redoStack.pop();
    this.restoreSnapshot(next);
    this.notify('redo');
    return true;
  }

  restoreSnapshot(snapshot) {
    this.elements.clear();
    for (const el of snapshot.elements) {
      this.elements.set(el.id, el);
    }
    this.panX = snapshot.panX;
    this.panY = snapshot.panY;
    this.zoom = snapshot.zoom;
    this.selectedIds.clear();
  }

  // --- Coordinate Transformations ---

  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.panX) / this.zoom,
      y: (screenY - this.panY) / this.zoom
    };
  }

  worldToScreen(worldX, worldY) {
    return {
      x: worldX * this.zoom + this.panX,
      y: worldY * this.zoom + this.panY
    };
  }

  snap(val) {
    if (!this.snapToGrid || typeof val !== 'number' || !Number.isFinite(val)) return val;
    return Math.round(val / this.gridSize) * this.gridSize;
  }

  // --- Elements CRUD ---

  generateId(prefix = 'elem') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  addElement(element, recordHistory = true) {
    if (!element || typeof element !== 'object') {
      throw new Error('addElement: element must be an object');
    }
    if (!element.id) {
      element.id = this.generateId(element.type || 'el');
    }
    if (recordHistory) this.pushSnapshot();

    // Default sizing & positioning if omitted
    element.x = Number.isFinite(element.x) ? element.x : 100;
    element.y = Number.isFinite(element.y) ? element.y : 100;
    element.rotation = Number.isFinite(element.rotation) ? element.rotation : 0;
    element.zIndex = element.zIndex ?? (this.elements.size + 1);

    if (element.type === 'sticky') {
      element.width = Math.max(10, element.width ?? 180);
      element.height = Math.max(10, element.height ?? 180);
      element.color = element.color ?? PASTEL_COLORS.yellow;
      element.text = element.text ?? 'Note';
      element.fontSize = element.fontSize ?? 16;
    } else if (element.type === 'shape') {
      element.width = Math.max(10, element.width ?? 160);
      element.height = Math.max(10, element.height ?? 100);
      element.shapeType = element.shapeType ?? 'rectangle';
      element.fillColor = element.fillColor ?? '#FFFFFF';
      element.strokeColor = element.strokeColor ?? '#1E293B';
      element.strokeWidth = element.strokeWidth ?? 2;
      element.strokeStyle = element.strokeStyle ?? 'solid';
      element.text = element.text ?? '';
      element.textColor = element.textColor ?? '#0F172A';
      element.fontSize = element.fontSize ?? 14;
    } else if (element.type === 'text') {
      element.width = Math.max(10, element.width ?? 200);
      element.height = Math.max(10, element.height ?? 50);
      element.text = element.text ?? 'Text';
      element.fontSize = element.fontSize ?? 20;
      element.color = element.color ?? '#0F172A';
    } else if (element.type === 'frame') {
      element.width = Math.max(50, element.width ?? 500);
      element.height = Math.max(50, element.height ?? 350);
      element.title = element.title ?? 'Frame';
      element.color = element.color ?? '#E2E8F0';
    } else if (element.type === 'connector') {
      element.style = element.style ?? 'curved'; // straight, orthogonal, curved
      element.strokeColor = element.strokeColor ?? '#475569';
      element.strokeWidth = element.strokeWidth ?? 2;
      element.strokeStyle = element.strokeStyle ?? 'solid';
      element.startArrow = element.startArrow ?? 'none';
      element.endArrow = element.endArrow ?? 'arrow';
      element.label = element.label ?? '';
    } else if (element.type === 'draw') {
      element.points = Array.isArray(element.points) ? element.points : [];
      element.strokeColor = element.strokeColor ?? '#0F172A';
      element.strokeWidth = element.strokeWidth ?? 3;
      element.opacity = element.opacity ?? 1.0;
      element.mode = element.mode ?? 'pen'; // pen, highlighter
    }

    this.elements.set(element.id, element);
    this.notify('add', { element });
    return element;
  }

  updateElement(id, updates, recordHistory = false) {
    const el = this.elements.get(id);
    if (!el || !updates || typeof updates !== 'object') return null;

    if (recordHistory) this.pushSnapshot();
    Object.assign(el, updates);

    // If moving a frame, move children enclosed by the frame
    if (el.type === 'frame' && ('x' in updates || 'y' in updates)) {
      const dx = updates.dx || 0;
      const dy = updates.dy || 0;
      if (dx !== 0 || dy !== 0) {
        for (const other of this.elements.values()) {
          if (other.id !== el.id && this.isElementInsideFrame(other, el, dx, dy)) {
            other.x += dx;
            other.y += dy;
          }
        }
      }
    }

    this.notify('update', { element: el });
    return el;
  }

  isElementInsideFrame(elem, frame, dx = 0, dy = 0) {
    if (!elem || !frame || elem.type === 'frame') return false;
    const fx = frame.x - dx;
    const fy = frame.y - dy;
    const ew = typeof elem.width === 'number' ? elem.width : 0;
    const eh = typeof elem.height === 'number' ? elem.height : 0;
    const fw = typeof frame.width === 'number' ? frame.width : 500;
    const fh = typeof frame.height === 'number' ? frame.height : 350;

    return (
      elem.x >= fx &&
      elem.y >= fy &&
      elem.x + ew <= fx + fw &&
      elem.y + eh <= fy + fh
    );
  }

  removeElements(ids, recordHistory = true) {
    if (!Array.isArray(ids) || ids.length === 0) return;
    const idSet = new Set(ids);
    if (idSet.size === 0) return;
    if (recordHistory) this.pushSnapshot();

    for (const id of idSet) {
      this.elements.delete(id);
      this.selectedIds.delete(id);
    }

    // Also remove connectors connected to deleted elements
    for (const [cid, el] of this.elements.entries()) {
      if (el.type === 'connector') {
        if (idSet.has(el.fromId) || idSet.has(el.toId)) {
          this.elements.delete(cid);
          this.selectedIds.delete(cid);
        }
      }
    }

    this.notify('delete', { ids: Array.from(idSet) });
  }

  duplicateElements(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    this.pushSnapshot();
    const newElements = [];
    const idMap = new Map();

    for (const id of ids) {
      const orig = this.elements.get(id);
      if (!orig || orig.type === 'connector') continue;
      const cloned = JSON.parse(JSON.stringify(orig));
      cloned.id = this.generateId(orig.type);
      cloned.x += 30;
      cloned.y += 30;
      cloned.zIndex = this.elements.size + 1;
      this.elements.set(cloned.id, cloned);
      idMap.set(orig.id, cloned.id);
      newElements.push(cloned);
    }

    // Clone connectors between duplicated elements
    for (const id of ids) {
      const orig = this.elements.get(id);
      if (orig && orig.type === 'connector') {
        if (idMap.has(orig.fromId) && idMap.has(orig.toId)) {
          const cloned = JSON.parse(JSON.stringify(orig));
          cloned.id = this.generateId('conn');
          cloned.fromId = idMap.get(orig.fromId);
          cloned.toId = idMap.get(orig.toId);
          this.elements.set(cloned.id, cloned);
          newElements.push(cloned);
        }
      }
    }

    this.selectedIds.clear();
    for (const el of newElements) {
      this.selectedIds.add(el.id);
    }
    this.notify('duplicate', { elements: newElements });
    return newElements;
  }

  clearBoard() {
    this.pushSnapshot();
    this.elements.clear();
    this.selectedIds.clear();
    this.notify('clear');
  }

  // --- Smart Anchors & Connectors ---

  getAnchorPoints(elem) {
    if (!elem) return [];
    const x = elem.x || 0;
    const y = elem.y || 0;
    const w = typeof elem.width === 'number' && elem.width > 0 ? elem.width : 100;
    const h = typeof elem.height === 'number' && elem.height > 0 ? elem.height : 100;
    return [
      { side: 'top', x: x + w / 2, y },
      { side: 'right', x: x + w, y: y + h / 2 },
      { side: 'bottom', x: x + w / 2, y: y + h },
      { side: 'left', x, y: y + h / 2 },
      { side: 'center', x: x + w / 2, y: y + h / 2 }
    ];
  }

  getNearestAnchor(elem, targetPoint) {
    const anchors = this.getAnchorPoints(elem);
    let best = anchors[0];
    let bestDist = Infinity;
    for (const pt of anchors) {
      const d = Math.hypot(pt.x - targetPoint.x, pt.y - targetPoint.y);
      if (d < bestDist) {
        bestDist = d;
        best = pt;
      }
    }
    return best;
  }

  resolveConnectorCoords(connector) {
    let fromPt = connector.fromPoint || { x: 0, y: 0 };
    let toPt = connector.toPoint || { x: 100, y: 100 };

    const fromElem = connector.fromId ? this.elements.get(connector.fromId) : null;
    const toElem = connector.toId ? this.elements.get(connector.toId) : null;

    if (fromElem && toElem) {
      // Handle self-loop edge case
      if (fromElem.id === toElem.id) {
        const ew = typeof fromElem.width === 'number' ? fromElem.width : 100;
        const eh = typeof fromElem.height === 'number' ? fromElem.height : 100;
        fromPt = { side: 'top', x: fromElem.x + ew / 2, y: fromElem.y };
        toPt = { side: 'right', x: fromElem.x + ew, y: fromElem.y + eh / 2 };
      } else {
        const fromCenter = { x: fromElem.x + (fromElem.width || 100) / 2, y: fromElem.y + (fromElem.height || 100) / 2 };
        const toCenter = { x: toElem.x + (toElem.width || 100) / 2, y: toElem.y + (toElem.height || 100) / 2 };
        fromPt = this.getNearestAnchor(fromElem, toCenter);
        toPt = this.getNearestAnchor(toElem, fromCenter);
      }
    } else if (fromElem) {
      fromPt = this.getNearestAnchor(fromElem, toPt);
    } else if (toElem) {
      toPt = this.getNearestAnchor(toElem, fromPt);
    }

    return { fromPt, toPt };
  }

  // --- Alignment & Layering ---

  alignElements(ids, alignment) {
    if (!Array.isArray(ids) || ids.length < 2) return;
    const items = ids.map(id => this.elements.get(id)).filter(Boolean);
    if (items.length < 2) return;

    this.pushSnapshot();

    let minX = Math.min(...items.map(i => i.x));
    let maxX = Math.max(...items.map(i => i.x + (i.width || 0)));
    let minY = Math.min(...items.map(i => i.y));
    let maxY = Math.max(...items.map(i => i.y + (i.height || 0)));

    for (const item of items) {
      switch (alignment) {
        case 'left':
          item.x = minX;
          break;
        case 'right':
          item.x = maxX - (item.width || 0);
          break;
        case 'center-h':
          item.x = (minX + maxX) / 2 - (item.width || 0) / 2;
          break;
        case 'top':
          item.y = minY;
          break;
        case 'bottom':
          item.y = maxY - (item.height || 0);
          break;
        case 'center-v':
          item.y = (minY + maxY) / 2 - (item.height || 0) / 2;
          break;
      }
    }
    this.notify('align');
  }

  bringToFront(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return;
    this.pushSnapshot();
    const maxZ = Math.max(0, ...Array.from(this.elements.values()).map(e => e.zIndex || 0));
    let z = maxZ + 1;
    for (const id of ids) {
      const el = this.elements.get(id);
      if (el) el.zIndex = z++;
    }
    this.notify('reorder');
  }

  sendToBack(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return;
    this.pushSnapshot();
    const minZ = Math.min(0, ...Array.from(this.elements.values()).map(e => e.zIndex || 0));
    let z = minZ - ids.length;
    for (const id of ids) {
      const el = this.elements.get(id);
      if (el) el.zIndex = z++;
    }
    this.notify('reorder');
  }

  // --- Bounds & Zoom to Fit ---

  getBoardBounds() {
    if (this.elements.size === 0) {
      return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const el of this.elements.values()) {
      if (el.type === 'draw' && Array.isArray(el.points) && el.points.length > 0) {
        for (const pt of el.points) {
          if (Number.isFinite(pt.x) && Number.isFinite(pt.y)) {
            minX = Math.min(minX, pt.x);
            minY = Math.min(minY, pt.y);
            maxX = Math.max(maxX, pt.x);
            maxY = Math.max(maxY, pt.y);
          }
        }
      } else {
        const ex = Number.isFinite(el.x) ? el.x : 0;
        const ey = Number.isFinite(el.y) ? el.y : 0;
        const ew = Number.isFinite(el.width) ? el.width : 50;
        const eh = Number.isFinite(el.height) ? el.height : 50;

        minX = Math.min(minX, ex);
        minY = Math.min(minY, ey);
        maxX = Math.max(maxX, ex + ew);
        maxY = Math.max(maxY, ey + eh);
      }
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
      return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };
    }

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: Math.max(100, maxX - minX),
      height: Math.max(100, maxY - minY)
    };
  }

  zoomToFit(viewportWidth = 1200, viewportHeight = 800, padding = 80) {
    const bounds = this.getBoardBounds();
    const availableW = Math.max(50, viewportWidth - padding * 2);
    const availableH = Math.max(50, viewportHeight - padding * 2);
    const scaleX = availableW / bounds.width;
    const scaleY = availableH / bounds.height;
    const targetZoom = Math.min(1.5, Math.max(0.15, Math.min(scaleX, scaleY)));

    this.zoom = targetZoom;
    this.panX = viewportWidth / 2 - (bounds.minX + bounds.width / 2) * targetZoom;
    this.panY = viewportHeight / 2 - (bounds.minY + bounds.height / 2) * targetZoom;
    this.notify('viewport');
  }

  // --- Persistence & JSON Import/Export ---

  exportToJSON() {
    return JSON.stringify(
      {
        version: '1.0.0',
        boardId: this.boardId,
        boardTitle: this.boardTitle,
        panX: this.panX,
        panY: this.panY,
        zoom: this.zoom,
        elements: Array.from(this.elements.values())
      },
      null,
      2
    );
  }

  importFromJSON(jsonStr) {
    try {
      if (!jsonStr) return false;
      const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
      if (!Array.isArray(data.elements)) return false; // Guard: must have valid elements array

      this.pushSnapshot();
      this.elements.clear();
      this.boardTitle = typeof data.boardTitle === 'string' ? data.boardTitle : this.boardTitle;
      this.panX = Number.isFinite(data.panX) ? data.panX : this.panX;
      this.panY = Number.isFinite(data.panY) ? data.panY : this.panY;
      this.zoom = Number.isFinite(data.zoom) && data.zoom > 0 ? data.zoom : this.zoom;

      for (const el of data.elements) {
        if (el && typeof el === 'object' && el.id) {
          this.elements.set(el.id, el);
        }
      }
      this.selectedIds.clear();
      this.notify('import');
      return true;
    } catch (err) {
      console.warn('Failed to import JSON:', err);
      return false;
    }
  }

  saveToStorage() {
    if (typeof localStorage === 'undefined') return;
    try {
      const key = `miro_board_${this.boardId}`;
      localStorage.setItem(key, this.exportToJSON());
      this.updateBoardsIndex();
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }

  loadFromStorage() {
    if (typeof localStorage === 'undefined') return false;
    try {
      const key = `miro_board_${this.boardId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return this.importFromJSON(saved);
      }
    } catch (e) {
      console.warn('localStorage load failed:', e);
    }
    return false;
  }

  updateBoardsIndex() {
    if (typeof localStorage === 'undefined') return;
    try {
      const indexStr = localStorage.getItem('miro_boards_index') || '[]';
      const index = JSON.parse(indexStr);
      if (!Array.isArray(index)) return;
      const existing = index.find(b => b && b.id === this.boardId);
      if (existing) {
        existing.title = this.boardTitle;
        existing.updatedAt = Date.now();
        existing.elementCount = this.elements.size;
      } else {
        index.push({
          id: this.boardId,
          title: this.boardTitle,
          updatedAt: Date.now(),
          elementCount: this.elements.size
        });
      }
      localStorage.setItem('miro_boards_index', JSON.stringify(index));
    } catch (_) {}
  }

  static listSavedBoards() {
    if (typeof localStorage === 'undefined') return [];
    try {
      const indexStr = localStorage.getItem('miro_boards_index');
      return indexStr ? JSON.parse(indexStr) : [];
    } catch (_) {
      return [];
    }
  }
}
