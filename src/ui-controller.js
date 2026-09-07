/**
 * UI Controller for Miro Whiteboard
 * Coordinates toolbar interactions, floating context bars, minimap, modals, and WebMCP agent simulator.
 */

import { PASTEL_COLORS, SHAPE_TYPES } from './board-store.js';
import { getRegisteredTools, invokeTool, supportsWebMcp } from './fastwebmcp.js';

export class UIController {
  constructor(engine, store) {
    this.engine = engine;
    this.store = store;

    this.initDOM();
    this.bindToolbar();
    this.bindContextBar();
    this.bindZoomControls();
    this.bindMinimap();
    this.bindModals();
    this.bindWebMcpConsole();

    // Re-render UI overlays when store changes
    this.store.subscribe(({ changeType }) => {
      this.updateZoomDisplay();
      this.updateContextBar();
      this.updateMinimap();
      if (changeType === 'select') {
        this.updateContextBar();
      }
    });

    window.addEventListener('whiteboard:tool-changed', (e) => {
      this.highlightActiveTool(e.detail.tool);
    });

    // Update WebMCP readiness badge
    this.updateWebMcpBadge();
  }

  initDOM() {
    this.toolbar = document.getElementById('primary-toolbar');
    this.contextBar = document.getElementById('context-toolbar');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapViewport = document.getElementById('minimap-viewport');
    this.zoomPercentLabel = document.getElementById('zoom-percentage');
    this.webmcpBadge = document.getElementById('webmcp-status-badge');
    this.webmcpDrawer = document.getElementById('webmcp-drawer');
  }

  bindToolbar() {
    if (!this.toolbar) return;

    this.toolbar.querySelectorAll('[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        this.engine.setTool(tool);

        // Open sub-menu if sticky or shape
        if (tool === 'sticky') {
          this.toggleSubmenu('sticky-colors-menu');
        } else if (tool === 'shape') {
          this.toggleSubmenu('shapes-menu');
        } else {
          this.closeAllSubmenus();
        }
      });
    });

    // Color pickers in sticky submenu
    document.querySelectorAll('[data-sticky-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const color = btn.getAttribute('data-sticky-color');
        this.engine.activeStickyColor = color;
        this.engine.setTool('sticky');
        this.closeAllSubmenus();
      });
    });

    // Shape pickers in shapes submenu
    document.querySelectorAll('[data-shape-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const shapeType = btn.getAttribute('data-shape-type');
        this.engine.activeShapeType = shapeType;
        this.engine.setTool('shape');
        this.closeAllSubmenus();
      });
    });

    // Close menus on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#primary-toolbar')) {
        this.closeAllSubmenus();
      }
    });
  }

  toggleSubmenu(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const isHidden = el.classList.contains('hidden');
    this.closeAllSubmenus();
    if (isHidden) el.classList.remove('hidden');
  }

  closeAllSubmenus() {
    document.querySelectorAll('.toolbar-submenu').forEach(el => el.classList.add('hidden'));
  }

  highlightActiveTool(tool) {
    if (!this.toolbar) return;
    this.toolbar.querySelectorAll('[data-tool]').forEach(btn => {
      if (btn.getAttribute('data-tool') === tool) {
        btn.classList.add('bg-blue-600', 'text-white');
        btn.classList.remove('text-slate-700', 'hover:bg-slate-100', 'dark:text-slate-200', 'dark:hover:bg-slate-700');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('text-slate-700', 'hover:bg-slate-100', 'dark:text-slate-200', 'dark:hover:bg-slate-700');
      }
    });
  }

  // --- Context Toolbar ---

  bindContextBar() {
    if (!this.contextBar) return;

    // Delete
    document.getElementById('ctx-delete')?.addEventListener('click', () => {
      if (this.store.selectedIds.size > 0) {
        this.store.removeElements(Array.from(this.store.selectedIds));
      }
    });

    // Duplicate
    document.getElementById('ctx-duplicate')?.addEventListener('click', () => {
      this.store.duplicateElements(Array.from(this.store.selectedIds));
    });

    // Layer forward / backward
    document.getElementById('ctx-bring-front')?.addEventListener('click', () => {
      this.store.bringToFront(Array.from(this.store.selectedIds));
    });
    document.getElementById('ctx-send-back')?.addEventListener('click', () => {
      this.store.sendToBack(Array.from(this.store.selectedIds));
    });

    // Color swatches
    this.contextBar.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        for (const id of this.store.selectedIds) {
          const el = this.store.elements.get(id);
          if (el.type === 'sticky') this.store.updateElement(id, { color }, true);
          else if (el.type === 'shape') this.store.updateElement(id, { fillColor: color }, true);
        }
      });
    });
  }

  updateContextBar() {
    if (!this.contextBar) return;
    if (this.store.selectedIds.size === 0) {
      this.contextBar.classList.add('hidden');
      return;
    }

    // Anchor floating bar above first selected element
    const firstId = Array.from(this.store.selectedIds)[0];
    const el = this.store.elements.get(firstId);
    if (!el) {
      this.contextBar.classList.add('hidden');
      return;
    }

    const screenPos = this.store.worldToScreen(el.x, el.y);
    const canvasRect = this.engine.canvas.getBoundingClientRect();

    const barX = Math.max(10, Math.min(window.innerWidth - 350, canvasRect.left + screenPos.x + (el.width * this.store.zoom) / 2 - 150));
    const barY = Math.max(60, canvasRect.top + screenPos.y - 50);

    this.contextBar.style.left = `${barX}px`;
    this.contextBar.style.top = `${barY}px`;
    this.contextBar.classList.remove('hidden');
  }

  // --- Zoom Controls ---

  bindZoomControls() {
    document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
      this.store.zoom = Math.min(4.0, this.store.zoom * 1.2);
      this.store.notify('viewport');
    });

    document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
      this.store.zoom = Math.max(0.15, this.store.zoom / 1.2);
      this.store.notify('viewport');
    });

    document.getElementById('zoom-reset-btn')?.addEventListener('click', () => {
      this.store.zoom = 1.0;
      this.store.panX = 0;
      this.store.panY = 0;
      this.store.notify('viewport');
    });

    document.getElementById('zoom-fit-btn')?.addEventListener('click', () => {
      this.store.zoomToFit(this.engine.width, this.engine.height);
    });

    document.getElementById('undo-btn')?.addEventListener('click', () => this.store.undo());
    document.getElementById('redo-btn')?.addEventListener('click', () => this.store.redo());
  }

  updateZoomDisplay() {
    if (this.zoomPercentLabel) {
      this.zoomPercentLabel.textContent = `${Math.round(this.store.zoom * 100)}%`;
    }
  }

  // --- Minimap ---

  bindMinimap() {
    if (!this.minimapCanvas) return;
    this.minimapCtx = this.minimapCanvas.getContext('2d');

    const toggleBtn = document.getElementById('toggle-minimap-btn');
    const container = document.getElementById('minimap-container');
    toggleBtn?.addEventListener('click', () => {
      container?.classList.toggle('hidden');
    });

    // Click on minimap to navigate
    this.minimapCanvas.addEventListener('click', (e) => {
      const rect = this.minimapCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const bounds = this.store.getBoardBounds();
      const scale = Math.min(this.minimapCanvas.width / (bounds.width + 400), this.minimapCanvas.height / (bounds.height + 400));

      const worldX = bounds.minX - 200 + clickX / scale;
      const worldY = bounds.minY - 200 + clickY / scale;

      this.store.panX = this.engine.width / 2 - worldX * this.store.zoom;
      this.store.panY = this.engine.height / 2 - worldY * this.store.zoom;
      this.store.notify('viewport');
    });
  }

  updateMinimap() {
    if (!this.minimapCtx || document.getElementById('minimap-container')?.classList.contains('hidden')) return;

    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;

    ctx.clearRect(0, 0, w, h);
    const bounds = this.store.getBoardBounds();
    const margin = 200;
    const worldW = bounds.width + margin * 2;
    const worldH = bounds.height + margin * 2;
    const scale = Math.min(w / worldW, h / worldH);

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-bounds.minX + margin, -bounds.minY + margin);

    // Draw elements
    for (const el of this.store.elements.values()) {
      ctx.fillStyle = el.color || el.fillColor || '#94A3B8';
      ctx.fillRect(el.x, el.y, el.width || 40, el.height || 40);
    }

    // Draw viewport rectangle
    const vpWorldLeft = -this.store.panX / this.store.zoom;
    const vpWorldTop = -this.store.panY / this.store.zoom;
    const vpWorldW = this.engine.width / this.store.zoom;
    const vpWorldH = this.engine.height / this.store.zoom;

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3 / scale;
    ctx.strokeRect(vpWorldLeft, vpWorldTop, vpWorldW, vpWorldH);

    ctx.restore();
  }

  // --- Modals (Templates, Export, Help) ---

  bindModals() {
    // Templates Modal
    document.getElementById('templates-btn')?.addEventListener('click', () => {
      document.getElementById('templates-modal')?.classList.remove('hidden');
    });

    document.querySelectorAll('[data-template]').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-template');
        invokeTool('whiteboard_generate_diagram', { diagramType: type });
        document.getElementById('templates-modal')?.classList.add('hidden');
      });
    });

    // Export Modal
    document.getElementById('export-menu-btn')?.addEventListener('click', () => {
      document.getElementById('export-modal')?.classList.remove('hidden');
    });

    // Export PNG
    document.getElementById('export-png-btn')?.addEventListener('click', () => {
      this.exportImage('png');
    });

    // Export SVG
    document.getElementById('export-svg-btn')?.addEventListener('click', () => {
      this.exportSVG();
    });

    // Export JSON
    document.getElementById('export-json-btn')?.addEventListener('click', () => {
      const json = this.store.exportToJSON();
      const blob = new Blob([json], { type: 'application/json' });
      this.downloadBlob(blob, `${this.store.boardTitle.replace(/\s+/g, '_')}.json`);
    });

    // Import JSON
    const importInput = document.getElementById('import-json-input');
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.store.importFromJSON(evt.target.result);
        document.getElementById('export-modal')?.classList.add('hidden');
      };
      reader.readAsText(file);
    });

    // Generic Modal Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-container')?.classList.add('hidden');
      });
    });
  }

  exportImage(format = 'png') {
    const bounds = this.store.getBoardBounds();
    const pad = 40;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = bounds.width + pad * 2;
    exportCanvas.height = bounds.height + pad * 2;
    const expCtx = exportCanvas.getContext('2d');

    // White background
    expCtx.fillStyle = '#FFFFFF';
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Translate to bounds
    expCtx.translate(-bounds.minX + pad, -bounds.minY + pad);

    // Render elements onto exportCanvas
    const engineBackupCtx = this.engine.ctx;
    this.engine.ctx = expCtx;

    for (const el of this.store.elements.values()) {
      if (el.type === 'frame') this.engine.renderFrame(expCtx, el);
      else if (el.type === 'connector') this.engine.renderConnector(expCtx, el);
      else if (el.type === 'shape') this.engine.renderShape(expCtx, el);
      else if (el.type === 'sticky') this.engine.renderSticky(expCtx, el);
      else if (el.type === 'text') this.engine.renderText(expCtx, el);
      else if (el.type === 'draw') this.engine.renderDraw(expCtx, el);
    }

    this.engine.ctx = engineBackupCtx;

    exportCanvas.toBlob((blob) => {
      this.downloadBlob(blob, `${this.store.boardTitle}.png`);
      document.getElementById('export-modal')?.classList.add('hidden');
    });
  }

  exportSVG() {
    const bounds = this.store.getBoardBounds();
    const pad = 40;
    const svgW = bounds.width + pad * 2;
    const svgH = bounds.height + pad * 2;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">\n`;
    svg += `<rect width="100%" height="100%" fill="#F8FAFC"/>\n`;
    svg += `<g transform="translate(${-bounds.minX + pad}, ${-bounds.minY + pad})">\n`;

    for (const el of this.store.elements.values()) {
      if (el.type === 'sticky') {
        svg += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="6" fill="${el.color}" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.1))"/>\n`;
        svg += `<text x="${el.x + 16}" y="${el.y + 30}" font-family="sans-serif" font-size="14" fill="#0F172A">${this.escapeXml(el.text || '')}</text>\n`;
      } else if (el.type === 'shape') {
        svg += `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="6" fill="${el.fillColor}" stroke="${el.strokeColor}" stroke-width="${el.strokeWidth || 2}"/>\n`;
        if (el.text) {
          svg += `<text x="${el.x + el.width / 2}" y="${el.y + el.height / 2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="14" fill="${el.textColor || '#0F172A'}">${this.escapeXml(el.text)}</text>\n`;
        }
      }
    }
    svg += `</g>\n</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    this.downloadBlob(blob, `${this.store.boardTitle}.svg`);
    document.getElementById('export-modal')?.classList.add('hidden');
  }

  escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- WebMCP Console & Agent Simulator ---

  updateWebMcpBadge() {
    if (!this.webmcpBadge) return;
    const isSupported = supportsWebMcp();
    if (isSupported) {
      this.webmcpBadge.innerHTML = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>WebMCP Native Active</span>`;
    } else {
      this.webmcpBadge.innerHTML = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"><span class="w-2 h-2 rounded-full bg-blue-500"></span>WebMCP Fallback Ready</span>`;
    }
  }

  bindWebMcpConsole() {
    const triggerBtn = document.getElementById('open-webmcp-console-btn');
    triggerBtn?.addEventListener('click', () => {
      this.webmcpDrawer?.classList.toggle('translate-x-full');
      this.populateWebMcpToolsList();
    });

    document.getElementById('close-webmcp-drawer')?.addEventListener('click', () => {
      this.webmcpDrawer?.classList.add('translate-x-full');
    });

    // Execute tool manually from inspector
    document.getElementById('webmcp-run-tool-btn')?.addEventListener('click', async () => {
      const select = document.getElementById('webmcp-tool-select');
      const inputArea = document.getElementById('webmcp-tool-input');
      const resultArea = document.getElementById('webmcp-tool-result');

      const toolName = select?.value;
      if (!toolName) return;

      try {
        let args = {};
        if (inputArea?.value.trim()) {
          args = JSON.parse(inputArea.value);
        }
        const result = await invokeTool(toolName, args);
        if (resultArea) {
          resultArea.textContent = JSON.stringify(result, null, 2);
          resultArea.className = 'p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded overflow-x-auto';
        }
      } catch (err) {
        if (resultArea) {
          resultArea.textContent = `Error: ${err.message}`;
          resultArea.className = 'p-3 bg-slate-900 text-rose-400 font-mono text-xs rounded overflow-x-auto';
        }
      }
    });

    // Quick AI Agent Prompts
    document.querySelectorAll('[data-agent-prompt]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const prompt = btn.getAttribute('data-agent-prompt');
        btn.disabled = true;
        btn.classList.add('opacity-50');

        if (prompt === 'kanban') {
          await invokeTool('whiteboard_generate_diagram', { diagramType: 'kanban' });
        } else if (prompt === 'architecture') {
          await invokeTool('whiteboard_generate_diagram', { diagramType: 'architecture' });
        } else if (prompt === 'mindmap') {
          await invokeTool('whiteboard_generate_diagram', { diagramType: 'mindmap', title: 'Agent Swarm Mindmap' });
        } else if (prompt === 'sticky_trio') {
          await invokeTool('whiteboard_create_sticky_note', { text: 'Key Insight 1: FastWebMCP connects models directly to browser state', color: 'yellow', x: 200, y: 150 });
          await invokeTool('whiteboard_create_sticky_note', { text: 'Key Insight 2: Pure client-side static hosting is blisteringly fast', color: 'blue', x: 420, y: 150 });
          await invokeTool('whiteboard_create_sticky_note', { text: 'Key Insight 3: KDD contracts keep agent implementation disciplined', color: 'green', x: 640, y: 150 });
          await invokeTool('whiteboard_zoom_to_fit', {});
        }

        btn.disabled = false;
        btn.classList.remove('opacity-50');
      });
    });
  }

  populateWebMcpToolsList() {
    const select = document.getElementById('webmcp-tool-select');
    const listContainer = document.getElementById('webmcp-tools-list');
    const tools = getRegisteredTools();

    if (select) {
      select.innerHTML = '';
      tools.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.name;
        opt.textContent = `${t.title || t.name}`;
        select.appendChild(opt);
      });

      select.addEventListener('change', () => {
        const selected = tools.find(t => t.name === select.value);
        const inputArea = document.getElementById('webmcp-tool-input');
        if (inputArea && selected) {
          // Generate sample input from schema
          const sample = {};
          if (selected.inputSchema?.properties) {
            for (const [k, v] of Object.entries(selected.inputSchema.properties)) {
              sample[k] = v.enum ? v.enum[0] : v.type === 'number' ? 100 : v.type === 'array' ? [] : `Sample ${k}`;
            }
          }
          inputArea.value = JSON.stringify(sample, null, 2);
        }
      });
      select.dispatchEvent(new Event('change'));
    }

    if (listContainer) {
      listContainer.innerHTML = tools.map(t => `
        <div class="p-2.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">${t.name}</span>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider">Tool</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">${t.description}</p>
        </div>
      `).join('');
    }
  }
}
