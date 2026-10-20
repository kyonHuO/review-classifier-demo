import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const css = read('light.css').replace(/\/\*[\s\S]*?\*\//g, '');
const luminance = hex => {
  const c = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
};
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
const colorFor = selector => {
  const rule = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)].find(([, selectors]) => selectors.trim() === selector);
  assert.ok(rule, `Explicit light-theme override required for ${selector}`);
  const color = rule[2].match(/(?:^|;)\s*color:\s*(#[a-f\d]{6})\s*;/i);
  assert.ok(color, `Explicit foreground required for ${selector}`);
  return color[1];
};

for (const [selector, background] of [
  ['body.light .use-case-card h3', '#19171f'],
  ['body.light .use-case-card > p', '#19171f'],
  ['body.light .use-case-card .case-example p', '#19171f'],
  ['body.light .mail-label-list li', '#201b27'],
]) {
  test(`${selector} meets 4.5:1 for normal-sized text`, () => {
    assert.ok(contrast(colorFor(selector), background) >= 4.5);
  });
}

test('unchanged dark-card accents also meet 4.5:1', () => {
  for (const foreground of ['#ab8bc7', '#8f809e', '#b89ad0']) {
    assert.ok(contrast(foreground, '#19171f') >= 4.5);
  }
});

test('demo uses a versioned contrast stylesheet', () => {
  assert.match(read('demo.html'), /href="light\.css\?v=contrast-20261020a"/);
});

test('home removes only the duplicate pricing section and retains FAQ pricing', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /(?:id|aria-labelledby)="home-price"/);
  assert.match(html, /<summary>料金はいくらですか？<\/summary>/);
  assert.match(html, /<h2 id="home-faq">よくある質問<\/h2>/);
  assert.match(html, /<h2 id="home-cta">用途についての事前相談<\/h2>/);
  assert.match(read('estimate.html'), /<section id="pricing">/);
});
