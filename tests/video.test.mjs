import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../home-video.js', import.meta.url), 'utf8');
class Events {
  listeners = new Map();
  addEventListener(name, fn) { const set = this.listeners.get(name) || []; set.push(fn); this.listeners.set(name, set); }
  emit(name) { for (const fn of this.listeners.get(name) || []) fn(); }
}
class Video extends Events {
  paused = true;
  muted = false;
  plays = 0;
  constructor(auto) { super(); this.auto = auto; }
  hasAttribute(name) { return name === 'data-auto-play' && this.auto; }
  play() { this.paused = false; this.plays++; this.emit('play'); return Promise.resolve(); }
  pause() { this.paused = true; this.emit('pause'); }
}
function setup({ reduce = false, saveData = false, observer = true } = {}) {
  const review = new Video(true), mail = new Video(false);
  const motion = Object.assign(new Events(), { matches: reduce });
  const connection = Object.assign(new Events(), { saveData });
  const window = Object.assign(new Events(), { matchMedia: () => motion });
  const document = Object.assign(new Events(), { hidden: false, querySelectorAll: () => [review, mail] });
  const callbacks = new Map();
  class Observer { constructor(callback) { this.callback = callback; } observe(video) { callbacks.set(video, this.callback); } }
  if (observer) window.IntersectionObserver = Observer;
  const context = { window, document, navigator: { connection }, IntersectionObserver: Observer };
  vm.runInNewContext(source, context);
  const visible = (video, value) => callbacks.get(video)([{ isIntersecting: value, intersectionRatio: value ? 1 : 0 }]);
  return { review, mail, motion, connection, window, document, visible };
}
test('only the explicitly marked review video may autoplay', () => {
  const s = setup(); s.visible(s.review, true); s.visible(s.mail, true);
  assert.equal(s.review.paused, false); assert.equal(s.mail.paused, true);
  assert.equal(s.mail.plays, 0); assert.equal(s.review.muted, true); assert.equal(s.mail.muted, true);
});
test('manual mail play works and manual pause survives visibility changes', () => {
  const s = setup(); s.visible(s.mail, true); s.mail.play(); s.mail.pause();
  s.visible(s.mail, false); s.visible(s.mail, true);
  assert.equal(s.mail.paused, true);
});
test('a playing mail video pauses out of view and resumes when visible', () => {
  const s = setup(); s.visible(s.mail, true); s.mail.play();
  s.visible(s.mail, false); assert.equal(s.mail.paused, true);
  s.visible(s.mail, true); assert.equal(s.mail.paused, false);
});
for (const option of [{ reduce: true }, { saveData: true }]) {
  test(`preferences prevent automatic playback: ${JSON.stringify(option)}`, () => {
    const s = setup(option); s.visible(s.review, true); s.visible(s.mail, true);
    assert.equal(s.review.plays, 0); assert.equal(s.mail.plays, 0);
    s.mail.play(); assert.equal(s.mail.paused, false);
  });
}
test('page hide pauses videos and restored page respects manual pause', () => {
  const s = setup(); s.visible(s.review, true); s.visible(s.mail, true); s.mail.play(); s.mail.pause();
  s.window.emit('pagehide'); assert.equal(s.review.paused, true);
  s.window.emit('pageshow'); assert.equal(s.review.paused, false); assert.equal(s.mail.paused, true);
});
test('hidden document pauses all playing videos', () => {
  const s = setup(); s.visible(s.review, true); s.visible(s.mail, true); s.mail.play();
  s.document.hidden = true; s.document.emit('visibilitychange');
  assert.equal(s.review.paused, true); assert.equal(s.mail.paused, true);
});
test('without IntersectionObserver, mail still requires explicit play', () => {
  const s = setup({ observer: false }); assert.equal(s.review.paused, false); assert.equal(s.mail.paused, true);
});
