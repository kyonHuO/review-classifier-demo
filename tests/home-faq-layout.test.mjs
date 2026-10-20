import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../nagi-reel.css', import.meta.url), 'utf8');
test('single-column home overrides cyclic percentage row gaps', () => {
  const rule = css.match(/\.home-single-hero\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(rule, /row-gap:\s*0(?:px)?\s*;/);
});
test('homepage FAQ retains four native questions and answers without pricing section', () => {
  const faq = html.match(/<section[^>]*aria-labelledby="home-faq"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(faq, /<h2 id="home-faq">よくある質問<\/h2>/);
  assert.equal((faq.match(/<details>/g) ?? []).length, 4);
  assert.equal((faq.match(/<summary>/g) ?? []).length, 4);
  assert.equal((faq.match(/<p>/g) ?? []).length, 4);
  assert.doesNotMatch(html, /id="home-pricing"|aria-labelledby="home-pricing"|料金の目安/);
});
test('homepage uses the FAQ layout stylesheet version', () => {
  assert.match(html, /nagi-reel\.css\?v=faq-layout-20261020/);
});
