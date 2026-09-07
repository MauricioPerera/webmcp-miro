---
type: 'Task Contract'
title: 'Bateria de Pruebas Adversarias y Casos Extremos'
description: 'Pruebas de forzado de fallos, ataques a esquemas JSON, límites de memoria y resiliencia de herramientas.'
tags: ['ccdd', 'adversarial', 'stress-testing', 'resilience']

task: adversarial_stress_resilience
intent: "Forzar fallos deliberados en FastWebMCP, BoardStore y WebMCP tools para garantizar resiliencia total."
target: src/board-store.js
signature: "importFromJSON(jsonStr), addElement(element), defineTool(spec)"
test_command: "node --test tests/adversarial-stress.test.mjs"
budget:
  lines_max: 600
  cyclomatic_max: 12
forbids: ['eval', 'child_process']
tests: tests/adversarial-stress.test.mjs
tests_sha256: 0133cfc7ffd2b88f886180ea9cfe69a70feeee75924d5a46633c52c55fa24c6f
touch_only: ['src/board-store.js']
deps_allowed: []
---

# Contrato: Bateria de Pruebas Adversarias y Casos Extremos

## Intent
Verificar la resiliencia y el manejo seguro de excepciones ante entradas corruptas, valores fuera de rango, nombres de herramientas ilegales y cargas masivas segun [architecture-state.md](../architecture-state.md) y [architecture-webmcp.md](../architecture-webmcp.md).

## Interface
- `defineTool(spec: Object): DefinedTool` (validaciones de caracteres, longitudes y tipos)
- `validateSchema(schema: Object, data: any): { valid: boolean, errors: string[] }`
- `importFromJSON(jsonStr: any): boolean` (rechazo sin corrupcion de memoria)
- `addElement(element: Object): Object` (acotado de coordenadas y dimensiones)

## Invariants
- Ante cualquier carga util JSON rota o no conforme, el almacén no debe vaciar ni alterar el estado previamente existente en memoria.
- Las herramientas de WebMCP deben rechazar tipos incompatibles (`string` por `number`, `NaN`, `Infinity`, enumeraciones invalidas) antes de delegar la ejecucion al manejador.
- La pila de historial no supera los 50 estados independientemente del numero de mutaciones sucesivas.

## Examples
- `importFromJSON('{ "elements": "string_not_array" }')` retorna `false` y protege los elementos actuales en el tablero.
- `defineTool({ name: 'tool with spaces', description: 'd', execute: () => {} })` lanza excepcion por caracteres no permitidos.

## Do / Don't
- **DO:** Validar y sanear datos antes de mutar colecciones internas.
- **DON'T:** Confiar ciegamente en entradas externas o suponer que el cliente envia datos formateados.

## Tests
El oraculo de pruebas adversarias esta sellado en `tests/adversarial-stress.test.mjs` y se ejecuta con:
`node --test tests/adversarial-stress.test.mjs`

## Constraints
- Todo error producido por el navegador o por datos corruptos debe ser capturado de forma deterministica sin bloquear el hilo principal.
- PARAR y reportar si una excepcion no controlada desestabiliza el motor o corrompe la persistencia local.
