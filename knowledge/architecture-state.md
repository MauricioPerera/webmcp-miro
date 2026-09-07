---
type: 'Architecture'
title: 'Modelo de Estado y Persistencia'
description: 'Almacen reactivo de elementos, pila de deshacer/rehacer y persistencia en localStorage/IndexedDB.'
tags: ['architecture', 'state', 'persistence']
---

# Modelo de Estado y Persistencia

El estado global de la pizarra esta encapsulado en la clase `BoardStore`, que proporciona mutacion predecible, notificacion reactiva a observadores y persistencia local sin depender de ningun servidor.

## 1. Estructura de Elementos

Cada elemento posee un identificador unico, tipo, posicion en el mundo y capas (`zIndex`). Los tipos soportados son:
- **`sticky`:** Notas adhesivas con colores pastel Miro (`#FEF08A`, `#BAE6FD`, etc.), texto envolvente y edicion en linea.
- **`shape`:** Figuras geometricas (rectangulo, circulo, diamante, cilindro, nube, estrella) con relleno y trazo configurables.
- **`connector`:** Flechas inteligentes con anclaje magnetico dinamico a los bordes de figuras fuente y destino.
- **`frame`:** Contenedores de agrupacion logica que arrastran de forma sincronizada los elementos contenidos.
- **`text`:** Tipografia flotante transparente.
- **`draw`:** Trazos a mano alzada vectoriales generados mediante herramienta de lapiz o resaltador.

## 2. Pila de Historial (Undo / Redo)

El almacen gestiona dos pilas (`undoStack` y `redoStack`) con un limite de 50 instantaneas profundas. Cada accion de modificacion, adicion, eliminacion o duplicacion registra una instantanea inmutable antes de aplicarse.

## 3. Persistencia Client-Side

El estado se sincroniza automaticamente con `localStorage` bajo claves identificadas por el ID de la pizarra (`miro_board_<id>`). Esto asegura que recargar la pagina o cerrar la pestana preserve inmediatamente el trabajo del usuario.

Relacionado con la interfaz de herramientas en [architecture-webmcp.md](architecture-webmcp.md) y renderizado en [architecture-canvas.md](architecture-canvas.md).
