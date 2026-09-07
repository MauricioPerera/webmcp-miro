---
type: 'Task Contract'
title: 'Implementar Historial de Deshacer/Rehacer y Persistencia'
description: 'Gestion de pila de instantaneas inmutables y serializacion/deserializacion JSON.'
tags: ['ccdd', 'history', 'persistence']

task: history_persistence_json
intent: "Implementar pila de instantaneas para undo/redo e importacion/exportacion en formato JSON."
target: src/board-store.js
signature: "pushSnapshot(), undo(), redo(), exportToJSON(), importFromJSON(jsonStr)"
test_command: "node --test tests/history-persistence.test.mjs"
budget:
  lines_max: 600
  cyclomatic_max: 12
forbids: ['eval', 'child_process']
tests: tests/history-persistence.test.mjs
tests_sha256: b1533bcab3449f35f86acc298cf4a04a71b35ebc09ecb1d42c754e91a8ca6425
touch_only: ['src/board-store.js']
deps_allowed: []
---

# Contrato: Historial de Deshacer/Rehacer y Persistencia

## Intent
Proveer recuperacion deterministica del estado de la pizarra ante operaciones de edicion (deshacer/rehacer) y permitir la serializacion/deserializacion en JSON para respaldos o intercambio con agentes segun [architecture-state.md](../architecture-state.md).

## Interface
- `pushSnapshot(): void`
- `undo(): boolean`
- `redo(): boolean`
- `exportToJSON(): string`
- `importFromJSON(jsonStr: string | Object): boolean`

## Invariants
- El tamano maximo del historial de instantaneas nunca supera `maxHistory` (50 estados).
- `exportToJSON()` emite una cadena JSON valida conforme a la estructura serializable de la pizarra.

## Examples
- Tras anadir 2 elementos, invocar `undo()` reduce el conteo a 1 elemento y mueve la instantanea a `redoStack`.
- `importFromJSON(exportToJSON())` restablece con exactitud todos los elementos, dimensiones y coordenadas del tablero.

## Do / Don't
- **DO:** Clonar profundamente cada elemento al registrar una instantanea inmutable.
- **DON'T:** Mutar instantaneas previamente apiladas en el historial.

## Tests
El oraculo de pruebas esta sellado en `tests/history-persistence.test.mjs` y se ejecuta con:
`node --test tests/history-persistence.test.mjs`

## Constraints
- La pila de historial no debe exceder de 50 instantaneas para evitar consumo excesivo de memoria.
- `undo()` sobre una pila vacia debe retornar `false` de forma segura sin lanzar excepcion.
- PARAR y reportar si un intento de deserializacion JSON corrompe la coleccion de elementos en memoria.
