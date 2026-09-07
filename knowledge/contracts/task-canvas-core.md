---
type: 'Task Contract'
title: 'Implementar Geometria del Canvas y Viewport'
description: 'Transformacion de coordenadas pantalla-mundo, ajuste de cuadricula y calculo de limites.'
tags: ['ccdd', 'canvas', 'geometry']

task: canvas_core_geometry
intent: "Implementar transformaciones matematicas de pan/zoom, snapping y limites del canvas."
target: src/board-store.js
signature: "screenToWorld(screenX, screenY), worldToScreen(worldX, worldY), snap(val)"
test_command: "node --test tests/canvas-core.test.mjs"
budget:
  lines_max: 600
  cyclomatic_max: 12
forbids: ['eval', 'child_process']
tests: tests/canvas-core.test.mjs
tests_sha256: c4c8f9ca0611a5fe98419ebbb5dfaf595726bed7c233e7ac1f86157c97231c23
touch_only: ['src/board-store.js']
deps_allowed: []
---

# Contrato: Geometria del Canvas y Viewport

## Intent
Asegurar que las funciones de transformacion de coordenadas, ajuste a cuadricula y calculo de limites en [architecture-canvas.md](../architecture-canvas.md) y [architecture-state.md](../architecture-state.md) sean deterministicas y precisas bajo cualquier nivel de escala y desplazamiento.

## Interface
- `screenToWorld(screenX: number, screenY: number): { x: number, y: number }`
- `worldToScreen(worldX: number, worldY: number): { x: number, y: number }`
- `snap(val: number): number`
- `getBoardBounds(): { minX: number, minY: number, maxX: number, maxY: number, width: number, height: number }`

## Invariants
- La funcion `worldToScreen(screenToWorld(x, y))` debe converger a las coordenadas iniciales con margen de error infinitesimal.
- El factor de escala `zoom` se mantiene siempre en el rango positivo `[0.1, 5.0]`.

## Examples
- `screenToWorld(300, 250)` con `panX=100, panY=50, zoom=2.0` devuelve `{ x: 100, y: 100 }`.
- `snap(12)` con `gridSize=20` y `snapToGrid=true` devuelve `20`.

## Do / Don't
- **DO:** Emplear calculos algebraicos cerrados para garantizar alto rendimiento a 60 FPS.
- **DON'T:** Modificar el estado del canvas directamente desde metodos de transformacion de coordenadas.

## Tests
El oraculo de pruebas esta sellado en `tests/canvas-core.test.mjs` y se ejecuta con:
`node --test tests/canvas-core.test.mjs`

## Constraints
- Todas las operaciones deben ser funciones puras o metodos sobre coordenadas numericas finitas.
- PARAR y reportar si se detectan valores `NaN` o infinitos durante las conversiones matriciales.
