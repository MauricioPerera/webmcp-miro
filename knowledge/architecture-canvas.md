---
type: 'Architecture'
title: 'Arquitectura del Canvas y Transformaciones'
description: 'Motor de renderizado 2D de alta resolucion con pan infinito, zoom centrado y cuadricula Miro.'
tags: ['architecture', 'canvas', 'rendering']
---

# Arquitectura del Canvas y Transformaciones

El motor de canvas de Miro KDD implementa una superficie bidimensional infinita renderizada mediante la API Canvas 2D de HTML5 con escalado automatico para pantallas de alta densidad (Retina / High-DPI).

## 1. Transformaciones de Coordenadas

El sistema divide el espacio en dos marcos de referencia:
- **Espacio de Pantalla (Screen Coordinates):** Pixeles fisicos del viewport del navegador relativos al elemento `<canvas>`.
- **Espacio del Mundo (World Coordinates):** Coordenadas absolutas e independientes del zoom o desplazamiento, donde habitan los elementos de la pizarra.

Las formulas de transformacion implementadas en [architecture-state.md](architecture-state.md) son:
- `screenToWorld(sx, sy) = ((sx - panX) / zoom, (sy - panY) / zoom)`
- `worldToScreen(wx, wy) = (wx * zoom + panX, wy * zoom + panY)`

## 2. Cuadricula de Puntos (Dot Grid)

La cuadricula recrea la estetica de Miro mediante puntos discretos (`ctx.arc`) renderizados con separacion base de 24 pixeles escalada por el factor de zoom actual. Para preservar la legibilidad:
- Cuando `zoom < 0.5`, la opacidad de los puntos decrece progresivamente.
- Se implementa ajuste magnetico opcional (`snapToGrid`) para alinear figuras en incrementos fijos.

## 3. Hit-Testing y Deteccion de Manijas

El motor evalua interacciones en orden inverso al `zIndex`:
- Las figuras y notas adhesivas se comprueban mediante cajas delimitadoras (`x, y, width, height`).
- Los conectores se detectan evaluando la distancia perpendicular minima del cursor al segmento o curva.
- Las manijas de redimensionamiento (8 puntos perifericos) y la manija de rotacion (situada a -20px sobre el centro superior) poseen un radio de tolerancia ajustado al zoom.
