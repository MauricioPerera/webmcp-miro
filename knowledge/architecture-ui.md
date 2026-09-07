---
type: 'Architecture'
title: 'Arquitectura de Interfaz de Usuario y Tailwind CSS'
description: 'Diseno visual inspirado en Miro, transiciones declarativas con HTMX y componentes modales.'
tags: ['architecture', 'ui', 'tailwind', 'htmx']
---

# Arquitectura de Interfaz de Usuario y Tailwind CSS

La interfaz de usuario recrea con precision los patrones de diseno de Miro mediante un diseno flotante y minimalista implementado con **Tailwind CSS** y reactividad con **HTMX**.

## 1. Disposicion Visual (Layout)

- **Barra Superior (Top Bar):** Muestra el titulo editable de la pizarra, botones de deshacer/rehacer, insignia de estado WebMCP y accesos directos a plantillas, consola de agente y exportacion.
- **Dock Lateral Izquierdo (Floating Toolbar):** Selector vertical de herramientas (Seleccionar, Mano, Nota, Figuras, Texto, Conector, Lapiz, Resaltador, Borrador, Marco).
- **Barra de Contexto Flotante:** Se ancla dinamicamente sobre los elementos seleccionados para proporcionar opciones rapidas de paleta de color, orden de capas y duplicacion/borrado.
- **Minimapa Radar y Controles de Zoom:** Widget flotante en la esquina inferior derecha con navegacion interactiva por arrastre.
- **Cajon Lateral WebMCP:** Panel desplegable derecho para inspeccionar esquemas JSON y ejecutar comandos de agente en tiempo real.

## 2. Integracion de HTMX en Despliegue Estatico

En entornos 100% estaticos (como GitHub Pages), HTMX gestiona la apertura de modales, el cambio de pestanas de inspeccion y la hidratacion declarativa de eventos (`hx-on:*`) sin requerir frameworks pesados ni bundles complejos.

Referencia al motor de renderizado en [architecture-canvas.md](architecture-canvas.md) y a las herramientas en [architecture-webmcp.md](architecture-webmcp.md).
