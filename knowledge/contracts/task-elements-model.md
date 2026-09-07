---
type: 'Task Contract'
title: 'Implementar Modelo de Elementos y Conectores'
description: 'Gestion de figuras, notas adhesivas, resolucion de conectores dinamicos y marcos.'
tags: ['ccdd', 'elements', 'connectors']

task: elements_model_connectors
intent: "Gestionar creacion, actualizacion, anclaje dinamico de flechas y propagacion en marcos."
target: src/board-store.js
signature: "addElement(element), updateElement(id, updates), resolveConnectorCoords(connector)"
test_command: "node --test tests/elements-model.test.mjs"
budget:
  lines_max: 600
  cyclomatic_max: 12
forbids: ['eval', 'child_process']
tests: tests/elements-model.test.mjs
tests_sha256: e7ed566f8125b6b17c6f7087d16863a218887345baa1d52dff1f06bf3b7d1e8f
touch_only: ['src/board-store.js']
deps_allowed: []
---

# Contrato: Modelo de Elementos y Conectores

## Intent
Garantizar la correcta instanciacion y mutacion de figuras, notas adhesivas, anclajes de conectores inteligentes y contenedores de marco segun la arquitectura descrita en [architecture-state.md](../architecture-state.md).

## Interface
- `addElement(element: Object): Object`
- `updateElement(id: string, updates: Object): Object`
- `removeElements(ids: string[]): void`
- `resolveConnectorCoords(connector: Object): { fromPt: Point, toPt: Point }`

## Invariants
- Todo elemento registrado en la coleccion de la pizarra debe poseer un `id` unico y no vacio.
- La eliminacion de una figura fuente o destino elimina automaticamente sus conectores dependientes.

## Examples
- `addElement({ type: 'sticky', text: 'Nota' })` crea un elemento con `id`, dimensiones predeterminadas de 180x180 y color amarillo pastel.
- `resolveConnectorCoords(conn)` actualiza automaticamente los puntos de origen y destino cuando las figuras vinculadas cambian de posicion.

## Do / Don't
- **DO:** Recalcular dinamicamente los puntos de anclaje minimizando la distancia euclediana entre cajas.
- **DON'T:** Almacenar referencias circulares directas en memoria para facilitar serializacion JSON.

## Tests
El oraculo de pruebas esta sellado en `tests/elements-model.test.mjs` y se ejecuta con:
`node --test tests/elements-model.test.mjs`

## Constraints
- Al eliminar un elemento de la pizarra, cualquier conector que estuviera enganchado a dicho elemento debe eliminarse en cascada.
- Al mover un marco (`frame`), los elementos que se encuentren dentro de su perimetro espacial deben desplazarse en la misma distancia delta.
- PARAR y reportar si un conector intenta enlazar identificadores inexistentes sin puntos de contingencia.
