/**
 * CanvasEngine - 2D Rendering and Interaction Engine for Whiteboard
 * Handles high-DPI canvas rendering, infinite pan/zoom, Miro-style dot grid,
 * shapes, stickies, connectors, freehand paths, and selection/transform handles.
 */

export class CanvasEngine {
  constructor(canvas, store) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.store = store;

    // Viewport dimensions
    this.width = canvas.clientWidth || 1200;
    this.height = canvas.clientHeight || 800;
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    // Active tool state
    this.currentTool = 'select'; // 'select', 'hand', 'sticky', 'shape', 'text', 'connector', 'pen', 'highlighter', 'eraser', 'frame'
    this.activeShapeType = 'rectangle';
    this.activeStickyColor = '#FEF08A';
    this.activeStrokeColor = '#1E293B';
    this.activeFillColor = '#FFFFFF';
    this.activePenWidth = 3;

    // Interaction states
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragElementsStart = new Map(); // id -> { x, y }

    this.isResizing = false;
    this.resizeHandle = null; // 'nw', 'ne', 'se', 'sw', 'n', 'e', 's', 'w', 'rot'
    this.resizeInitialElem = null;

    this.isMarquee = false;
    this.marqueeStart = { x: 0, y: 0 };
    this.marqueeCurrent = { x: 0, y: 0 };

    this.activeDrawStroke = null;
    this.activeConnectorDraft = null;

    this.hoverAnchor = null;
    this.editingElementId = null;

    this.setupCanvas();
    this.attachEvents();

    // Store subscription
    this.unsubscribeStore = store.subscribe(() => {
      this.requestRender();
    });

    this.renderRequested = false;
    this.requestRender();
  }

  setupCanvas() {
    this.resize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.width = parent ? parent.clientWidth : window.innerWidth;
    this.height = parent ? parent.clientHeight : window.innerHeight;
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.requestRender();
  }

  requestRender() {
    if (this.renderRequested) return;
    this.renderRequested = true;
    requestAnimationFrame(() => {
      this.renderRequested = false;
      this.render();
    });
  }

  // --- Rendering Loop ---

  render() {
    const ctx = this.ctx;
    const { panX, panY, zoom } = this.store;

    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw background dot grid
    this.renderGrid(ctx, panX, panY, zoom);

    // Apply viewport transform for canvas world
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Sort elements by zIndex
    const sorted = Array.from(this.store.elements.values()).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    // 1. Render Frames first (background containers)
    for (const el of sorted) {
      if (el.type === 'frame') this.renderFrame(ctx, el);
    }

    // 2. Render Connectors behind shapes
    for (const el of sorted) {
      if (el.type === 'connector') this.renderConnector(ctx, el);
    }
    if (this.activeConnectorDraft) {
      this.renderConnector(ctx, this.activeConnectorDraft, true);
    }

    // 3. Render Shapes, Stickies, Text, and Pen Strokes
    for (const el of sorted) {
      if (el.type === 'shape') this.renderShape(ctx, el);
      else if (el.type === 'sticky') this.renderSticky(ctx, el);
      else if (el.type === 'text') this.renderText(ctx, el);
      else if (el.type === 'draw') this.renderDraw(ctx, el);
    }

    // 4. Render Active Freehand Drawing in progress
    if (this.activeDrawStroke) {
      this.renderDraw(ctx, this.activeDrawStroke);
    }

    // 5. Render Selection Outlines & Handles
    this.renderSelection(ctx);

    // 6. Render Marquee Box
    if (this.isMarquee) {
      this.renderMarquee(ctx);
    }

    // 7. Render Hover Anchors
    if (this.hoverAnchor && (this.currentTool === 'connector' || this.activeConnectorDraft)) {
      this.renderAnchor(ctx, this.hoverAnchor);
    }

    ctx.restore();
  }

  // --- Grid ---

  renderGrid(ctx, panX, panY, zoom) {
    const baseGrid = 24;
    const scaledGrid = baseGrid * zoom;

    // Fade out dots if too dense or too sparse
    let alpha = 0.25;
    if (scaledGrid < 12) alpha = 0.1;
    if (scaledGrid < 6) return;

    ctx.save();
    ctx.fillStyle = `rgba(100, 116, 139, ${alpha})`;

    const startX = panX % scaledGrid;
    const startY = panY % scaledGrid;
    const dotRadius = zoom > 1.2 ? 1.5 : 1.0;

    for (let x = startX; x < this.width; x += scaledGrid) {
      for (let y = startY; y < this.height; y += scaledGrid) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // --- Render Elements ---

  renderFrame(ctx, el) {
    ctx.save();
    ctx.translate(el.x, el.y);
    ctx.rotate((el.rotation || 0) * Math.PI / 180);

    // Background tint
    ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
    ctx.fillRect(0, 0, el.width, el.height);

    // Border
    ctx.strokeStyle = el.color || '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(0, 0, el.width, el.height);
    ctx.setLineDash([]);

    // Title Banner Tag
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 13px Inter, system-ui, sans-serif';
    ctx.fillText(el.title || 'Frame', 4, -8);

    ctx.restore();
  }

  renderSticky(ctx, el) {
    ctx.save();
    ctx.translate(el.x, el.y);
    ctx.rotate((el.rotation || 0) * Math.PI / 180);

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    // Body
    ctx.fillStyle = el.color || '#FEF08A';
    this.drawRoundedRectPath(ctx, 0, 0, el.width, el.height, 4);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Border highlight
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text content
    if (el.id !== this.editingElementId) {
      ctx.fillStyle = '#1E293B';
      ctx.font = `${el.fontSize || 16}px Inter, system-ui, sans-serif`;
      this.renderWrappedText(ctx, el.text || '', 16, 24, el.width - 32, (el.fontSize || 16) * 1.3);
    }

    ctx.restore();
  }

  renderShape(ctx, el) {
    ctx.save();
    ctx.translate(el.x, el.y);
    ctx.rotate((el.rotation || 0) * Math.PI / 180);

    ctx.fillStyle = el.fillColor || '#FFFFFF';
    ctx.strokeStyle = el.strokeColor || '#1E293B';
    ctx.lineWidth = el.strokeWidth || 2;
    if (el.strokeStyle === 'dashed') ctx.setLineDash([6, 4]);

    const w = el.width;
    const h = el.height;

    ctx.beginPath();
    switch (el.shapeType) {
      case 'circle':
        ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        break;
      case 'diamond':
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w, h / 2);
        ctx.lineTo(w / 2, h);
        ctx.lineTo(0, h / 2);
        ctx.closePath();
        break;
      case 'triangle':
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        break;
      case 'rounded-rectangle':
        this.drawRoundedRectPath(ctx, 0, 0, w, h, 10);
        break;
      case 'cylinder':
        this.drawCylinderPath(ctx, w, h);
        break;
      case 'cloud':
        this.drawCloudPath(ctx, w, h);
        break;
      case 'star':
        this.drawStarPath(ctx, w, h);
        break;
      case 'rectangle':
      default:
        ctx.rect(0, 0, w, h);
        break;
    }

    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Shape label text
    if (el.text && el.id !== this.editingElementId) {
      ctx.fillStyle = el.textColor || '#0F172A';
      ctx.font = `${el.fontSize || 14}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.text, w / 2, h / 2);
    }

    ctx.restore();
  }

  renderText(ctx, el) {
    if (el.id === this.editingElementId) return;
    ctx.save();
    ctx.translate(el.x, el.y);
    ctx.rotate((el.rotation || 0) * Math.PI / 180);

    ctx.fillStyle = el.color || '#0F172A';
    ctx.font = `${el.fontSize || 20}px Inter, system-ui, sans-serif`;
    this.renderWrappedText(ctx, el.text || '', 0, (el.fontSize || 20), el.width || 300, (el.fontSize || 20) * 1.3);

    ctx.restore();
  }

  renderConnector(ctx, el, isDraft = false) {
    const { fromPt, toPt } = this.store.resolveConnectorCoords(el);

    ctx.save();
    ctx.strokeStyle = isDraft ? '#3B82F6' : el.strokeColor || '#475569';
    ctx.lineWidth = el.strokeWidth || 2;
    if (isDraft || el.strokeStyle === 'dashed') ctx.setLineDash([6, 4]);

    ctx.beginPath();
    ctx.moveTo(fromPt.x, fromPt.y);

    let midX = (fromPt.x + toPt.x) / 2;
    let midY = (fromPt.y + toPt.y) / 2;

    if (el.style === 'orthogonal') {
      const dx = toPt.x - fromPt.x;
      const dy = toPt.y - fromPt.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        ctx.lineTo(fromPt.x + dx / 2, fromPt.y);
        ctx.lineTo(fromPt.x + dx / 2, toPt.y);
      } else {
        ctx.lineTo(fromPt.x, fromPt.y + dy / 2);
        ctx.lineTo(toPt.x, fromPt.y + dy / 2);
      }
      ctx.lineTo(toPt.x, toPt.y);
    } else if (el.style === 'curved') {
      const curvature = 0.35;
      const dx = toPt.x - fromPt.x;
      const dy = toPt.y - fromPt.y;
      const cx1 = fromPt.x + dx * curvature;
      const cy1 = fromPt.y;
      const cx2 = toPt.x - dx * curvature;
      const cy2 = toPt.y;
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, toPt.x, toPt.y);
      midX = (fromPt.x + 3 * cx1 + 3 * cx2 + toPt.x) / 8;
      midY = (fromPt.y + 3 * cy1 + 3 * cy2 + toPt.y) / 8;
    } else {
      ctx.lineTo(toPt.x, toPt.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw End Arrowhead
    if (el.endArrow !== 'none') {
      const angle = Math.atan2(toPt.y - fromPt.y, toPt.x - fromPt.x);
      this.drawArrowHead(ctx, toPt.x, toPt.y, angle, el.strokeColor || '#475569');
    }

    // Connector Label
    if (el.label) {
      ctx.font = '12px Inter, system-ui, sans-serif';
      const textWidth = ctx.measureText(el.label).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(midX - textWidth / 2 - 4, midY - 10, textWidth + 8, 20);
      ctx.fillStyle = '#1E293B';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.label, midX, midY);
    }

    ctx.restore();
  }

  drawArrowHead(ctx, x, y, angle, color) {
    const headLen = 12;
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-headLen, -headLen / 2.5);
    ctx.lineTo(-headLen + 2, 0);
    ctx.lineTo(-headLen, headLen / 2.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  renderDraw(ctx, el) {
    if (!el.points || el.points.length < 2) return;
    ctx.save();
    ctx.strokeStyle = el.strokeColor || '#0F172A';
    ctx.lineWidth = el.strokeWidth || 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = el.opacity ?? (el.mode === 'highlighter' ? 0.35 : 1.0);

    ctx.beginPath();
    ctx.moveTo(el.points[0].x, el.points[0].y);
    for (let i = 1; i < el.points.length; i++) {
      ctx.lineTo(el.points[i].x, el.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- Selection & Handles ---

  renderSelection(ctx) {
    if (this.store.selectedIds.size === 0) return;

    ctx.save();
    for (const id of this.store.selectedIds) {
      const el = this.store.elements.get(id);
      if (!el || el.type === 'connector') continue;

      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.rotate((el.rotation || 0) * Math.PI / 180);

      // Bounding Box
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-2, -2, el.width + 4, el.height + 4);

      // Resize Handles
      const handles = [
        { id: 'nw', x: -2, y: -2 },
        { id: 'ne', x: el.width + 2, y: -2 },
        { id: 'se', x: el.width + 2, y: el.height + 2 },
        { id: 'sw', x: -2, y: el.height + 2 },
        { id: 'n', x: el.width / 2, y: -2 },
        { id: 's', x: el.width / 2, y: el.height + 2 },
        { id: 'w', x: -2, y: el.height / 2 },
        { id: 'e', x: el.width + 2, y: el.height / 2 }
      ];

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 1.5;
      for (const h of handles) {
        ctx.beginPath();
        ctx.arc(h.x, h.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Rotation Handle
      const rotY = -22;
      ctx.beginPath();
      ctx.moveTo(el.width / 2, -2);
      ctx.lineTo(el.width / 2, rotY);
      ctx.strokeStyle = '#3B82F6';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(el.width / 2, rotY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
    ctx.restore();
  }

  renderMarquee(ctx) {
    const x = Math.min(this.marqueeStart.x, this.marqueeCurrent.x);
    const y = Math.min(this.marqueeStart.y, this.marqueeCurrent.y);
    const w = Math.abs(this.marqueeCurrent.x - this.marqueeStart.x);
    const h = Math.abs(this.marqueeCurrent.y - this.marqueeStart.y);

    ctx.save();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  renderAnchor(ctx, anchor) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // --- Geometry Utilities ---

  drawRoundedRectPath(ctx, x, y, w, h, r = 8) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  drawCylinderPath(ctx, w, h) {
    const ry = Math.min(h * 0.15, 20);
    ctx.moveTo(0, ry);
    ctx.ellipse(w / 2, ry, w / 2, ry, 0, Math.PI, 0);
    ctx.lineTo(w, h - ry);
    ctx.ellipse(w / 2, h - ry, w / 2, ry, 0, 0, Math.PI);
    ctx.lineTo(0, ry);
    ctx.closePath();
  }

  drawCloudPath(ctx, w, h) {
    ctx.moveTo(w * 0.2, h * 0.7);
    ctx.bezierCurveTo(0, h * 0.7, 0, h * 0.4, w * 0.2, h * 0.35);
    ctx.bezierCurveTo(w * 0.1, h * 0.1, w * 0.4, 0, w * 0.5, h * 0.2);
    ctx.bezierCurveTo(w * 0.6, 0, w * 0.9, h * 0.1, w * 0.8, h * 0.35);
    ctx.bezierCurveTo(w, h * 0.4, w, h * 0.7, w * 0.8, h * 0.7);
    ctx.closePath();
  }

  drawStarPath(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(cx, cy);
    const innerR = outerR / 2.2;
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  renderWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  }

  // --- Hit Testing ---

  hitTest(worldX, worldY) {
    // Reverse loop to check top elements first
    const sorted = Array.from(this.store.elements.values()).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

    for (const el of sorted) {
      if (el.type === 'draw') continue; // Draw strokes select by bounding rect or handled separately
      if (el.type === 'connector') {
        const { fromPt, toPt } = this.store.resolveConnectorCoords(el);
        const dist = this.distToSegment({ x: worldX, y: worldY }, fromPt, toPt);
        if (dist < 10) return el;
        continue;
      }

      if (
        worldX >= el.x &&
        worldX <= el.x + el.width &&
        worldY >= el.y &&
        worldY <= el.y + el.height
      ) {
        return el;
      }
    }
    return null;
  }

  distToSegment(p, v, w) {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  hitTestHandle(screenX, screenY, el) {
    if (!el || el.type === 'connector') return null;
    const world = this.store.screenToWorld(screenX, screenY);
    const rad = 10 / this.store.zoom;

    const handles = [
      { id: 'nw', x: el.x, y: el.y },
      { id: 'ne', x: el.x + el.width, y: el.y },
      { id: 'se', x: el.x + el.width, y: el.y + el.height },
      { id: 'sw', x: el.x, y: el.y + el.height },
      { id: 'n', x: el.x + el.width / 2, y: el.y },
      { id: 's', x: el.x + el.width / 2, y: el.y + el.height },
      { id: 'w', x: el.x, y: el.y + el.height / 2 },
      { id: 'e', x: el.x + el.width, y: el.y + el.height / 2 },
      { id: 'rot', x: el.x + el.width / 2, y: el.y - 20 }
    ];

    for (const h of handles) {
      if (Math.hypot(world.x - h.x, world.y - h.y) <= rad) {
        return h.id;
      }
    }
    return null;
  }

  // --- User Interaction Events ---

  attachEvents() {
    const c = this.canvas;

    c.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    c.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    c.addEventListener('pointermove', (e) => this.onPointerMove(e));
    c.addEventListener('pointerup', (e) => this.onPointerUp(e));
    c.addEventListener('dblclick', (e) => this.onDoubleClick(e));

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  onWheel(e) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const mouseScreenX = e.clientX - this.canvas.getBoundingClientRect().left;
      const mouseScreenY = e.clientY - this.canvas.getBoundingClientRect().top;

      const mouseWorldBefore = this.store.screenToWorld(mouseScreenX, mouseScreenY);
      const newZoom = Math.min(4.0, Math.max(0.15, this.store.zoom * zoomFactor));

      this.store.zoom = newZoom;
      this.store.panX = mouseScreenX - mouseWorldBefore.x * newZoom;
      this.store.panY = mouseScreenY - mouseWorldBefore.y * newZoom;
      this.store.notify('viewport');
    } else {
      // Pan
      this.store.panX -= e.deltaX;
      this.store.panY -= e.deltaY;
      this.store.notify('viewport');
    }
  }

  onPointerDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = this.store.screenToWorld(screenX, screenY);

    // Pan with middle mouse, spacebar down, or hand tool
    if (e.button === 1 || this.currentTool === 'hand' || e.spaceKey) {
      this.isPanning = true;
      this.panStart = { x: screenX - this.store.panX, y: screenY - this.store.panY };
      this.canvas.style.cursor = 'grabbing';
      return;
    }

    if (e.button !== 0) return;

    // Check resize handles if single element selected
    if (this.store.selectedIds.size === 1) {
      const selectedId = Array.from(this.store.selectedIds)[0];
      const selectedElem = this.store.elements.get(selectedId);
      const handle = this.hitTestHandle(screenX, screenY, selectedElem);
      if (handle) {
        this.isResizing = true;
        this.resizeHandle = handle;
        this.resizeInitialElem = JSON.parse(JSON.stringify(selectedElem));
        this.dragStart = { x: world.x, y: world.y };
        return;
      }
    }

    // Tool creation branches
    if (this.currentTool === 'sticky') {
      const el = this.store.addElement({
        type: 'sticky',
        x: this.store.snap(world.x - 90),
        y: this.store.snap(world.y - 90),
        color: this.activeStickyColor,
        text: 'Sticky Note'
      });
      this.store.selectedIds.clear();
      this.store.selectedIds.add(el.id);
      this.setTool('select');
      this.openInlineEditor(el);
      return;
    }

    if (this.currentTool === 'shape') {
      const el = this.store.addElement({
        type: 'shape',
        shapeType: this.activeShapeType,
        x: this.store.snap(world.x - 80),
        y: this.store.snap(world.y - 50),
        fillColor: this.activeFillColor,
        strokeColor: this.activeStrokeColor
      });
      this.store.selectedIds.clear();
      this.store.selectedIds.add(el.id);
      this.setTool('select');
      return;
    }

    if (this.currentTool === 'text') {
      const el = this.store.addElement({
        type: 'text',
        x: this.store.snap(world.x),
        y: this.store.snap(world.y),
        text: 'Type something...'
      });
      this.store.selectedIds.clear();
      this.store.selectedIds.add(el.id);
      this.setTool('select');
      this.openInlineEditor(el);
      return;
    }

    if (this.currentTool === 'frame') {
      const el = this.store.addElement({
        type: 'frame',
        x: this.store.snap(world.x - 250),
        y: this.store.snap(world.y - 175),
        title: 'New Section'
      });
      this.store.selectedIds.clear();
      this.store.selectedIds.add(el.id);
      this.setTool('select');
      return;
    }

    if (this.currentTool === 'pen' || this.currentTool === 'highlighter') {
      this.activeDrawStroke = {
        type: 'draw',
        points: [{ x: world.x, y: world.y }],
        strokeColor: this.activeStrokeColor,
        strokeWidth: this.currentTool === 'highlighter' ? 14 : this.activePenWidth,
        mode: this.currentTool
      };
      return;
    }

    if (this.currentTool === 'eraser') {
      const hit = this.hitTest(world.x, world.y);
      if (hit) this.store.removeElements([hit.id]);
      return;
    }

    if (this.currentTool === 'connector') {
      const hit = this.hitTest(world.x, world.y);
      const startPt = hit ? this.store.getNearestAnchor(hit, world) : world;
      this.activeConnectorDraft = {
        type: 'connector',
        fromId: hit ? hit.id : null,
        fromPoint: startPt,
        toPoint: world,
        strokeColor: this.activeStrokeColor
      };
      return;
    }

    // Default 'select' tool
    const hit = this.hitTest(world.x, world.y);
    if (hit) {
      if (e.shiftKey) {
        if (this.store.selectedIds.has(hit.id)) {
          this.store.selectedIds.delete(hit.id);
        } else {
          this.store.selectedIds.add(hit.id);
        }
      } else {
        if (!this.store.selectedIds.has(hit.id)) {
          this.store.selectedIds.clear();
          this.store.selectedIds.add(hit.id);
        }
      }

      this.isDragging = true;
      this.dragStart = { x: world.x, y: world.y };
      this.dragElementsStart.clear();
      for (const id of this.store.selectedIds) {
        const el = this.store.elements.get(id);
        if (el) {
          this.dragElementsStart.set(id, { x: el.x, y: el.y });
        }
      }
      this.store.pushSnapshot();
    } else {
      // Clicked on empty space -> start marquee selection
      if (!e.shiftKey) {
        this.store.selectedIds.clear();
      }
      this.isMarquee = true;
      this.marqueeStart = { x: world.x, y: world.y };
      this.marqueeCurrent = { x: world.x, y: world.y };
    }

    this.requestRender();
  }

  onPointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = this.store.screenToWorld(screenX, screenY);

    if (this.isPanning) {
      this.store.panX = screenX - this.panStart.x;
      this.store.panY = screenY - this.panStart.y;
      this.store.notify('viewport');
      return;
    }

    if (this.isResizing && this.resizeInitialElem) {
      const dx = world.x - this.dragStart.x;
      const dy = world.y - this.dragStart.y;
      const init = this.resizeInitialElem;
      const el = this.store.elements.get(init.id);
      if (!el) return;

      if (this.resizeHandle === 'rot') {
        const cx = init.x + init.width / 2;
        const cy = init.y + init.height / 2;
        const angle = Math.atan2(world.y - cy, world.x - cx) * (180 / Math.PI) + 90;
        el.rotation = Math.round(angle);
      } else {
        let newX = init.x;
        let newY = init.y;
        let newW = init.width;
        let newH = init.height;

        if (this.resizeHandle.includes('e')) newW = Math.max(30, init.width + dx);
        if (this.resizeHandle.includes('s')) newH = Math.max(30, init.height + dy);
        if (this.resizeHandle.includes('w')) {
          const w = Math.max(30, init.width - dx);
          newX = init.x + (init.width - w);
          newW = w;
        }
        if (this.resizeHandle.includes('n')) {
          const h = Math.max(30, init.height - dy);
          newY = init.y + (init.height - h);
          newH = h;
        }

        el.x = newX;
        el.y = newY;
        el.width = newW;
        el.height = newH;
      }
      this.store.notify('update', { element: el });
      return;
    }

    if (this.isDragging) {
      const dx = world.x - this.dragStart.x;
      const dy = world.y - this.dragStart.y;
      for (const [id, startPos] of this.dragElementsStart) {
        const el = this.store.elements.get(id);
        if (el) {
          el.x = this.store.snap(startPos.x + dx);
          el.y = this.store.snap(startPos.y + dy);
        }
      }
      this.store.notify('update');
      return;
    }

    if (this.isMarquee) {
      this.marqueeCurrent = { x: world.x, y: world.y };
      const minX = Math.min(this.marqueeStart.x, this.marqueeCurrent.x);
      const maxX = Math.max(this.marqueeStart.x, this.marqueeCurrent.x);
      const minY = Math.min(this.marqueeStart.y, this.marqueeCurrent.y);
      const maxY = Math.max(this.marqueeStart.y, this.marqueeCurrent.y);

      for (const el of this.store.elements.values()) {
        if (el.type === 'connector') continue;
        if (
          el.x < maxX &&
          el.x + el.width > minX &&
          el.y < maxY &&
          el.y + el.height > minY
        ) {
          this.store.selectedIds.add(el.id);
        }
      }
      this.requestRender();
      return;
    }

    if (this.activeDrawStroke) {
      this.activeDrawStroke.points.push({ x: world.x, y: world.y });
      this.requestRender();
      return;
    }

    if (this.activeConnectorDraft) {
      const hit = this.hitTest(world.x, world.y);
      if (hit && hit.id !== this.activeConnectorDraft.fromId) {
        this.hoverAnchor = this.store.getNearestAnchor(hit, world);
        this.activeConnectorDraft.toPoint = this.hoverAnchor;
      } else {
        this.hoverAnchor = null;
        this.activeConnectorDraft.toPoint = world;
      }
      this.requestRender();
      return;
    }

    // Hover cursor updates
    if (this.currentTool === 'select' && this.store.selectedIds.size === 1) {
      const selectedId = Array.from(this.store.selectedIds)[0];
      const selectedElem = this.store.elements.get(selectedId);
      const handle = this.hitTestHandle(screenX, screenY, selectedElem);
      if (handle) {
        this.canvas.style.cursor = `${handle}-resize`;
        return;
      }
    }

    if (this.currentTool === 'hand') {
      this.canvas.style.cursor = 'grab';
    } else if (this.currentTool === 'pen' || this.currentTool === 'highlighter') {
      this.canvas.style.cursor = 'crosshair';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  onPointerUp(e) {
    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.style.cursor = this.currentTool === 'hand' ? 'grab' : 'default';
    }

    if (this.isResizing) {
      this.isResizing = false;
      this.resizeHandle = null;
      this.resizeInitialElem = null;
    }

    if (this.isDragging) {
      this.isDragging = false;
      this.dragElementsStart.clear();
    }

    if (this.isMarquee) {
      this.isMarquee = false;
      this.store.notify('select');
    }

    if (this.activeDrawStroke) {
      this.store.addElement(this.activeDrawStroke);
      this.activeDrawStroke = null;
    }

    if (this.activeConnectorDraft) {
      const rect = this.canvas.getBoundingClientRect();
      const world = this.store.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      const hit = this.hitTest(world.x, world.y);

      if (hit && hit.id !== this.activeConnectorDraft.fromId) {
        this.store.addElement({
          type: 'connector',
          fromId: this.activeConnectorDraft.fromId,
          toId: hit.id,
          style: 'curved'
        });
      }
      this.activeConnectorDraft = null;
      this.hoverAnchor = null;
      this.setTool('select');
    }

    this.requestRender();
  }

  onDoubleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const world = this.store.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const hit = this.hitTest(world.x, world.y);

    if (hit && (hit.type === 'sticky' || hit.type === 'text' || hit.type === 'shape')) {
      this.openInlineEditor(hit);
    }
  }

  openInlineEditor(el) {
    this.editingElementId = el.id;
    this.requestRender();

    const screen = this.store.worldToScreen(el.x, el.y);
    const textarea = document.createElement('textarea');
    textarea.className = 'fixed z-50 p-2 border-2 border-blue-500 rounded bg-white shadow-xl outline-none font-sans text-slate-900 resize-none';
    textarea.style.left = `${this.canvas.getBoundingClientRect().left + screen.x}px`;
    textarea.style.top = `${this.canvas.getBoundingClientRect().top + screen.y}px`;
    textarea.style.width = `${el.width * this.store.zoom}px`;
    textarea.style.height = `${el.height * this.store.zoom}px`;
    textarea.style.fontSize = `${(el.fontSize || 16) * this.store.zoom}px`;
    textarea.value = el.text || '';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const finish = () => {
      el.text = textarea.value;
      this.editingElementId = null;
      if (document.body.contains(textarea)) {
        document.body.removeChild(textarea);
      }
      this.store.notify('update', { element: el });
      this.requestRender();
    };

    textarea.addEventListener('blur', finish);
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
        finish();
      }
    });
  }

  onKeyDown(e) {
    // Ignore key commands if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.store.selectedIds.size > 0) {
        this.store.removeElements(Array.from(this.store.selectedIds));
      }
    } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      if (e.shiftKey) {
        this.store.redo();
      } else {
        this.store.undo();
      }
    } else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
      this.store.redo();
    } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.store.duplicateElements(Array.from(this.store.selectedIds));
    } else if (e.key === 'v') {
      this.setTool('select');
    } else if (e.key === 'h') {
      this.setTool('hand');
    } else if (e.key === 's') {
      this.setTool('sticky');
    } else if (e.key === 'r') {
      this.setTool('shape');
    } else if (e.key === 't') {
      this.setTool('text');
    } else if (e.key === 'c') {
      this.setTool('connector');
    } else if (e.key === 'p') {
      this.setTool('pen');
    } else if (e.key === '0') {
      this.store.zoomToFit(this.width, this.height);
    }
  }

  setTool(tool) {
    this.currentTool = tool;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('whiteboard:tool-changed', { detail: { tool } }));
    }
    this.requestRender();
  }
}
