---
type: 'Architecture'
title: 'Especificacion e Integracion FastWebMCP'
description: 'Exposicion de capacidades de la pizarra para agentes de IA mediante el estandar WebMCP y FastWebMCP.'
tags: ['architecture', 'webmcp', 'ai-agent']
---

# Especificacion e Integracion FastWebMCP

La aplicacion implementa el estandar **WebMCP** mediante la libreria cliente **FastWebMCP** (inspirada en la especificacion de [https://mauricioperera.github.io/fastwebmcp/](https://mauricioperera.github.io/fastwebmcp/) y [https://webmcp.com](https://webmcp.com)).

## 1. Deteccion y Registro de Herramientas

Cuando un navegador compatible con WebMCP (como Chrome con el origin trial de `document.modelContext`) visita la pagina:
1. `supportsWebMcp()` detecta la presencia de `document.modelContext.registerTool`.
2. Las herramientas definidas se registran formalmente en el contexto del modelo con sus nombres, descripciones y JSON Schemas normalizados.
3. En navegadores estandar sin soporte nativo, `FastWebMCP` almacena las herramientas en un registro global `__WEBMCP_REGISTRY__` y activa la consola simuladora de agentes descrita en [architecture-ui.md](architecture-ui.md).

## 2. Herramientas Publicadas para Agentes

- **`whiteboard_create_sticky_note`**: Creacion de notas con texto, color y coordenadas.
- **`whiteboard_create_shape`**: Generacion de figuras geometricas con etiquetas.
- **`whiteboard_create_connector`**: Vinculacion de figuras mediante flechas inteligentes.
- **`whiteboard_create_frame`**: Creacion de marcos y contenedores de diseno.
- **`whiteboard_generate_diagram`**: Sintesis automatica de diagramas completos (kanban, flowchart, mindmap, architecture).
- **`whiteboard_get_board_state`**: Lectura completa de la escena y metadatos.
- **`whiteboard_update_elements`**: Modificacion atomica de propiedades.
- **`whiteboard_delete_elements`**: Eliminacion de elementos por ID.
- **`whiteboard_clear_board`**: Reinicio total de la pizarra.
- **`whiteboard_zoom_to_fit`**: Ajuste automatico del viewport a todo el contenido.

Ver implementacion de mutaciones en [architecture-state.md](architecture-state.md).
