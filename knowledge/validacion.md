---
type: 'Concept'
title: 'Protocolo de Validacion y Gates KDD'
description: 'Guia y criterios de validacion deterministica para contratos OKF y CCDD en el proyecto Miro KDD.'
tags: ['concept', 'kdd', 'validation']
---

# Protocolo de Validacion y Gates KDD

Este documento define las compuertas de calidad deterministicas aplicadas al proyecto Miro KDD, siguiendo la metodologia de [https://github.com/MauricioPerera/KDD](https://github.com/MauricioPerera/KDD).

## 1. Nivel 1: Validacion Local Deterministica

Todo contrato o nodo de conocimiento debe superar tres comprobaciones sin dependencias externas:
1. **Validacion OKF (`validate_okf.py`):** Verifica que todo nodo contenga un Frontmatter YAML valido con las claves `type`, `title`, `description`, `tags`, tipos permitidos y que todos los enlaces relativos resuelvan a archivos reales alcanzables desde `index.md`.
2. **Validacion de Contratos CCDD (`validate_contracts.py`):** Comprueba que cada contrato especifique un hash sellado `tests_sha256` inmutable, la regla de perimetro `touch_only`, y las secciones `## Intent`, `## Interface`, `## Constraints` (con la frase obligatoria `PARAR y reportar si`), y `## Examples` (con al menos 2 items de lista).
3. **Suite de Pruebas Automatizadas (`node --test tests/*.test.mjs`):** Ejecuta la bateria de pruebas de geometria, estado, persistencia y WebMCP.

Consulte la arquitectura del sistema en [architecture-canvas.md](architecture-canvas.md).

## 2. Nivel 2: Verificacion en Tiempo de Ejecucion WebMCP y Directorio Oficial

- **WebMCP Directory Indexing (`webmcp.com`):** El sitio esta verificado y catalogado en [https://webmcp.com/sites/mauricioperera.github.io](https://webmcp.com/sites/mauricioperera.github.io) con 10 herramientas registradas y esquemas de entrada/salida (`inputSchema` y `outputSchema`) validados deterministicamente.
- **Auditoria de Agente en Vivo:** Se ejecuto el flujo end-to-end por agente sintetico externo (`clear_board` -> `generate_diagram` -> `zoom_to_fit`) completado con veredicto PASS en 2 segundos.

## 3. Nivel 3: Bateria Empirica de Pruebas de Resiliencia y Fallos Forzados

Bajo la maxima KDD *"Si no se puede verificar entonces no funciona"*, se ejecuto una bateria de pruebas exhaustiva en entorno productivo real ([Miro KDD Whiteboard](https://mauricioperera.github.io/webmcp-miro/)):

### A. Consola WebMCP AI Agent
- **Simulate Agent Commands:** Verificacion de comandos predefinidos (Generate Kanban Board, Cloud Architecture, Agent Swarm Mindmap, 3 Strategy Stickies).
- **Direct Tool Runner:** Selector dinamico de herramientas, parseo de argumentos JSON con validacion de esquema, ejecucion asincrona y renderizado de respuesta estructurada en el panel Output.
- **Registered Tools Catalog:** Inspeccion interactiva de las 10 herramientas registradas con sus firmas de entrada y salida.

### B. Flujo Regular (Happy Path)
- **Herramienta:** `whiteboard_create_sticky_note`
- **Payload:** `{"text": "Test 1", "color": "yellow", "x": 300, "y": 300}`
- **Respuesta:** `{ "success": true, "id": "sticky_mtqgommg_184rm", "message": "Sticky note created at (300, 300)" }`
- **Resultado en Canvas:** Renderizado inmediato de nota adhesiva amarilla pastel en coordenadas globales (300, 300) con texto alineado y tipografia sans-serif.

### C. Pruebas de Fallos Forzados (Edge Cases y Adversariales)
| Escenario | Carga Enviada | Comportamiento Observado | Veredicto |
| :--- | :--- | :--- | :--- |
| **Entrada vacia / Espacios** | Cadena de solo espacios en blanco | El validador del cliente intercepto la peticion: `Error: fastwebmcp: input validation failed for tool...` sin corromper el store. | **PASS** |
| **JSON malformado** | `{invalid json: true}` | La interfaz capturo el error sintactico en tiempo real: `Error: Expected property name or '}' in JSON at position...` sin congelar el hilo principal. | **PASS** |
| **Intento de inyeccion (XSS)** | `{"text": "<script>alert('xss')</script>", "color": "yellow", "x": 400, "y": 400}` | **Cero ejecucion de scripts**. La carga util fue neutralizada, sanitizada y renderizada exclusivamente como texto plano en el Canvas 2D. | **PASS** |

### D. Pila de Historial y Exportacion Multiformato
- **Deshacer (Undo) / Rehacer (Redo):** El comando Undo removio los elementos del canvas revirtiendo la mutacion atomica; Redo reconstituyo los elementos en sus coordenadas y colores originales manteniendo los identificadores intactos.
- **Modal de Exportacion/Importacion:**
  - *Download PNG Image:* Renderizado raster de alta resolucion a escala DPI actual.
  - *Download SVG Vector:* Generacion de arbol vectorial SVG con elementos y textos.
  - *Export Board JSON:* Serializacion de estado completa y fiel a las especificaciones.
  - *Import from JSON:* Carga local de archivo y restauracion completa del canvas.
- **Estabilidad de Estado:** La aplicacion mantuvo estabilidad visual, reactividad fluida a 60 FPS y consistencia de memoria tras toda la bateria.

