---
type: 'Task Contract'
title: 'Implementar Registro de Herramientas WebMCP'
description: 'Validacion de esquemas, registro FastWebMCP y ejecucion de herramientas para agentes de IA.'
tags: ['ccdd', 'webmcp', 'fastwebmcp']

task: webmcp_tools_registration
intent: "Definir y registrar herramientas WebMCP con validacion estricta y ejecucion sobre la pizarra."
target: src/fastwebmcp.js
signature: "defineTool(spec), registerTool(spec), invokeTool(name, input), validateSchema(schema, data)"
test_command: "node --test tests/webmcp-tools.test.mjs"
budget:
  lines_max: 600
  cyclomatic_max: 12
forbids: ['eval', 'child_process']
tests: tests/webmcp-tools.test.mjs
tests_sha256: 3c3a546b34cc34d3d8a63ba5c7e6a4f6046f93bdecc9431aeada51bb0afaaf64
touch_only: ['src/fastwebmcp.js']
deps_allowed: []
---

# Contrato: Registro de Herramientas WebMCP

## Intent
Asegurar que las herramientas declaradas para agentes cumplan rigurosamente con la especificacion WebMCP segun [architecture-webmcp.md](../architecture-webmcp.md), validando tipos, restricciones y valores requeridos antes de ejecutar cambios sobre la pizarra.

## Interface
- `defineTool(spec: ToolSpec): DefinedTool`
- `registerTool(spec: ToolSpec): boolean`
- `invokeTool(name: string, input: Object): Promise<any>`
- `validateSchema(schema: Object, data: any): { valid: boolean, errors: string[] }`

## Invariants
- Los nombres de herramientas cumplen estrictamente la expresion regular `^[A-Za-z0-9_.-]{1,128}$`.
- Las llamadas a `invokeTool` rechazan cualquier carga util que incumpla el `inputSchema`.

## Examples
- `validateSchema({ type: 'object', required: ['text'] }, { text: 'hola' })` retorna `{ valid: true, errors: [] }`.
- `invokeTool('whiteboard_create_sticky_note', { text: 'Nota' })` crea exitosamente la nota y devuelve su ID asignado.

## Do / Don't
- **DO:** Ofrecer advertencias tempranas si el nombre de una herramienta supera la recomendacion de 30 caracteres de Chrome WebMCP.
- **DON'T:** Ejecutar logica de negocio sin validar primero los argumentos de entrada.

## Tests
El oraculo de pruebas esta sellado en `tests/webmcp-tools.test.mjs` y se ejecuta con:
`node --test tests/webmcp-tools.test.mjs`

## Constraints
- Los nombres de herramientas deben tener entre 1 y 128 caracteres del conjunto `[A-Za-z0-9_.-]`.
- Antes de invocar la funcion `execute`, los argumentos recibidos deben validarse contra el `inputSchema` asociado.
- PARAR y reportar si una entrada no conforme al esquema es ejecutada por el manejador de la herramienta.
