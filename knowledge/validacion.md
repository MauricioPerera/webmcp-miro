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
