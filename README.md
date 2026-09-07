# Miro KDD Whiteboard (100% Client-Side with WebMCP)

A 100% functional, client-side Miro clone whiteboard designed for immediate deployment to **GitHub Pages** (pure static frontend with zero backend server dependencies).

Engineered following **Knowledge-Driven Development (KDD)**, styled with **Tailwind CSS**, enhanced with **HTMX**, and supercharged with **FastWebMCP & WebMCP** (`document.modelContext`) for AI agent automation.

---

## 🌟 Key Features

### 1. Canvas & Miro Aesthetics
- **Infinite 2D Canvas:** Smooth pan (middle-click, space+drag, hand tool) and cursor-centered zoom (0.15x to 4.0x).
- **Dot Grid Background:** Subtle, responsive dot grid with optional magnetic grid snapping (`snapToGrid`).
- **Minimap Radar:** Interactive floating minimap preview in bottom-right corner with draggable viewport window.
- **Floating Context Bar:** Context-sensitive styling bar anchored directly above active selections.

### 2. Whiteboard Elements
- **Sticky Notes:** 6 pastel tones (`#FEF08A`, `#BAE6FD`, `#BBF7D0`, `#FBCFE8`, `#E9D5FF`, `#FED7AA`), auto text-wrapping, double-click inline editing.
- **Smart Connectors / Arrows:** Curved, orthogonal (Manhattan routing), and straight arrows that automatically track and follow connected shapes when moved or resized!
- **Diagram Shapes:** Rectangle, Rounded Rectangle, Circle, Decision Diamond, Triangle, Database Cylinder, Cloud, and Star with custom fill, stroke, and labels.
- **Grouping Frames:** Visual container frames that synchronously drag and organize nested elements.
- **Freehand Pen & Highlighter:** Smooth Bézier interpolated strokes with highlighter opacity mode and eraser.

### 3. FastWebMCP & WebMCP Standard
- Compliant with the WebMCP emerging standard ([webmcp.com](https://webmcp.com)) and FastWebMCP specification ([mauricioperera.github.io/fastwebmcp](https://mauricioperera.github.io/fastwebmcp/)).
- Automatically detects native browser WebMCP (`document.modelContext.registerTool`) with graceful fallback.
- **Exposed AI Agent Tools:**
  - `whiteboard_create_sticky_note`: Add sticky notes with pastel colors and coordinates.
  - `whiteboard_create_shape`: Create geometric and database shapes with text labels.
  - `whiteboard_create_connector`: Connect elements with dynamic smart arrows.
  - `whiteboard_create_frame`: Create grouping containers.
  - `whiteboard_generate_diagram`: Generate complete flowcharts, kanban boards, mindmaps, or cloud architectures in a single step!
  - `whiteboard_get_board_state`: Query total elements, viewport, and structure.
  - `whiteboard_update_elements`: Atomically update element positions, colors, or text.
  - `whiteboard_delete_elements`: Remove elements.
  - `whiteboard_clear_board`: Clear the canvas.
  - `whiteboard_zoom_to_fit`: Center and frame all items.
- **Built-in WebMCP AI Console:** Right-side drawer allowing manual testing of tools, inspecting JSON schemas, running quick prompts, and viewing agent execution results.

### 4. 1-Click Templates
- **Kanban Board:** 3 columns (To Do, In Progress, Done) with pastel sticky notes.
- **Flowchart:** Process steps with decision diamond and orthogonal arrows.
- **Mind Map:** Central concept with radiating branches and curved connectors.
- **System Architecture:** Client -> WebMCP Gateway -> Canvas Engine -> LocalStorage.

### 5. Persistence & Export
- **Auto-save:** Persistent state in `localStorage` and `IndexedDB`.
- **Export Formats:** PNG (high-DPI), SVG (vector), and JSON.
- **Import:** Full board restore from JSON backups.

---

## 🧠 Knowledge-Driven Development (KDD)

This project strictly follows the **KDD** methodology combining **OKF** (knowledge nodes with YAML frontmatter) and **CCDD** (deterministic task contracts with frozen test oracles):

- `knowledge/`: OKF knowledge base linking architecture and concept documents.
  - `index.md`: Catalog root and reachability graph.
  - `architecture-canvas.md`: Viewport math, transforms, and dot grid.
  - `architecture-state.md`: Data store, elements schema, and undo/redo history.
  - `architecture-webmcp.md`: WebMCP registration and tool definitions.
  - `architecture-ui.md`: Tailwind CSS layout and HTMX integration.
  - `validacion.md`: Quality gates and validation protocol.
- `knowledge/contracts/`: CCDD task contracts with sealed `tests_sha256` hashes, `touch_only` boundaries, and explicit sections (`## Intent`, `## Interface`, `## Invariants`, `## Examples`, `## Do / Don't`, `## Tests`, `## Constraints`).
- `scripts/`: Deterministic Python validation scripts (`validate_okf.py`, `validate_contracts.py`).
- `tests/`: Automated unit tests runnable with Node.js native test runner (`node --test tests/*.test.mjs`).

---

## 🚀 Running Locally

You can serve the static site locally with any static HTTP server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js / npx
npx serve .
```

Open `http://localhost:8080` in any modern browser.

---

## 🧪 Verification & Quality Gates

Run all automated unit tests and KDD validation gates:

```bash
# 1. Run Node.js test suite
npm test

# 2. Validate OKF knowledge base
npm run validate:okf

# 3. Validate CCDD task contracts
npm run validate:contracts

# 4. Run all quality gates in one command
npm run validate
```

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial miro kdd whiteboard"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In your repository settings on GitHub, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/validate.yml` will automatically validate all KDD contracts and deploy your whiteboard to `https://<your-username>.github.io/<repo-name>/`.
