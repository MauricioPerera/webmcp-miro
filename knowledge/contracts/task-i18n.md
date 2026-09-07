---
type: 'Task Contract'
title: 'Implementar Modulo de Internacionalizacion i18n'
description: 'Soporte completo client-side para Espanol, Ingles y Portugues con paridad estricta de claves.'
tags: ['ccdd', 'i18n', 'translation', 'ui']

task: i18n_support
intent: "Proveer traduccion dinamica y reactiva para espanol, ingles y portugues sin dependencias externas."
target: src/i18n.js
signature: "getLanguage(), setLanguage(lang), t(key, lang), applyTranslations(root, lang), initI18n()"
test_command: "node --test tests/i18n.test.mjs"
budget:
  lines_max: 700
  cyclomatic_max: 10
forbids: ['eval', 'child_process']
tests: tests/i18n.test.mjs
tests_sha256: 0092fcc3f7d4d9ecdddb154d051276bd6864e9020bd3cce84aa169ab07b35377
touch_only: ['src/i18n.js']
deps_allowed: []
---

# Contrato: Modulo de Internacionalizacion i18n

## Intent
Asegurar que la interfaz de la aplicacion y la landing page puedan operar indistintamente en Espanol (`es`), Ingles (`en`) y Portugues (`pt`), garantizando paridad total de cadenas y persistencia local sin recargas de pagina segun [i18n.md](../i18n.md).

## Interface
- `getLanguage(): string`
- `setLanguage(lang: string): void`
- `t(key: string, lang?: string): string`
- `applyTranslations(root?: Element|Document, lang?: string): void`
- `initI18n(): void`

## Invariants
- Solo se admiten como idiomas oficiales `'es'`, `'en'` y `'pt'`.
- El idioma por defecto ante cualquier discrepancia es `'es'`.
- Todos los diccionarios de traduccion deben mantener un 100% de paridad en sus claves registradas.

## Examples
- `t('nav.home', 'es')` retorna `'Inicio'`.
- `t('nav.home', 'en')` retorna `'Home'`.
- `t('nav.home', 'pt')` retorna `'Início'`.

## Do / Don't
- **DO:** Sanitizar y verificar que las traducciones no introduzcan fragmentos ejecutables no deseados.
- **DON'T:** Invocar APIs remotas o de terceros para realizar traducciones en tiempo de ejecucion.

## Tests
El oraculo de pruebas esta sellado en `tests/i18n.test.mjs` y se ejecuta con:
`node --test tests/i18n.test.mjs`

## Constraints
- Todas las cadenas mostradas al usuario deben poder resolverse mediante una clave `data-i18n`.
- La persistencia debe realizarse en `localStorage` bajo la clave `webmcp_miro_lang`.
- PARAR y reportar si una clave de traduccion existe en un idioma pero falta en cualquiera de los otros soportados.
