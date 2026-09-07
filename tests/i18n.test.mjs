import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUPPORTED_LANGS,
  DEFAULT_LANG,
  TRANSLATIONS,
  t,
  getLanguage,
  setLanguage,
  applyTranslations
} from '../src/i18n.js';

test('i18n - Supported languages and defaults', () => {
  assert.deepEqual(SUPPORTED_LANGS, ['es', 'en', 'pt']);
  assert.equal(DEFAULT_LANG, 'es');
  assert.ok(TRANSLATIONS.es);
  assert.ok(TRANSLATIONS.en);
  assert.ok(TRANSLATIONS.pt);
});

test('i18n - Strict key parity across all languages', () => {
  const esKeys = Object.keys(TRANSLATIONS.es).sort();
  const enKeys = Object.keys(TRANSLATIONS.en).sort();
  const ptKeys = Object.keys(TRANSLATIONS.pt).sort();

  // All languages must have the exact same set of translation keys
  assert.deepEqual(enKeys, esKeys, 'English translation keys must match Spanish keys exactly');
  assert.deepEqual(ptKeys, esKeys, 'Portuguese translation keys must match Spanish keys exactly');

  // Every translation value must be a non-empty string
  for (const lang of SUPPORTED_LANGS) {
    for (const [key, value] of Object.entries(TRANSLATIONS[lang])) {
      assert.equal(typeof value, 'string', `${lang}.${key} must be a string`);
      assert.ok(value.trim().length > 0, `${lang}.${key} must not be empty`);
    }
  }
});

test('i18n - Translation lookup and fallback', () => {
  // Direct translation lookups
  assert.equal(t('nav.home', 'es'), 'Inicio');
  assert.equal(t('nav.home', 'en'), 'Home');
  assert.equal(t('nav.home', 'pt'), 'Início');

  assert.equal(t('nav.openApp', 'es'), 'Abrir Pizarra');
  assert.equal(t('nav.openApp', 'en'), 'Open Board');
  assert.equal(t('nav.openApp', 'pt'), 'Abrir Quadro');

  // Fallback for non-existent key
  assert.equal(t('unknown.key.foo', 'es'), 'unknown.key.foo');

  // Fallback for unsupported language code
  assert.equal(t('nav.home', 'de'), 'Inicio');
});

test('i18n - DOM element translation application (mocked DOM)', () => {
  // Simple mock element
  class MockElement {
    constructor(attrs = {}) {
      this.attrs = attrs;
      this.textContent = '';
    }
    getAttribute(name) {
      return this.attrs[name] || null;
    }
    setAttribute(name, val) {
      this.attrs[name] = val;
    }
  }

  const elText = new MockElement({ 'data-i18n': 'nav.features' });
  const elTitle = new MockElement({ 'data-i18n-title': 'toolbar.undo' });
  const elPlaceholder = new MockElement({ 'data-i18n-placeholder': 'app.defaultTitle' });

  const mockRoot = {
    querySelectorAll(selector) {
      if (selector === '[data-i18n]') return [elText];
      if (selector === '[data-i18n-title]') return [elTitle];
      if (selector === '[data-i18n-placeholder]') return [elPlaceholder];
      return [];
    }
  };

  applyTranslations(mockRoot, 'en');
  assert.equal(elText.textContent, 'Features');
  assert.equal(elPlaceholder.attrs['placeholder'], 'Brainstorm & Architecture Board');

  applyTranslations(mockRoot, 'pt');
  assert.equal(elText.textContent, 'Recursos');
  assert.equal(elPlaceholder.attrs['placeholder'], 'Quadro de Ideias e Arquitetura');
});
