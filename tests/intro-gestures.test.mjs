import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

// These DOM/scheduler doubles run the production IIFE, without launching a browser.
const source = readFileSync(new URL('../nagi-reel.js', import.meta.url), 'utf8');
class Events {
  listeners = new Map();
  addEventListener(type, callback, options = {}) {
    if (options.signal?.aborted) return;
    const listener = { callback, options };
    const entries = this.listeners.get(type) || [];
    entries.push(listener); this.listeners.set(type, entries);
    options.signal?.addEventListener('abort', () => this.removeEventListener(type, callback), { once: true });
  }
  removeEventListener(type, callback) {
    this.listeners.set(type, (this.listeners.get(type) || []).filter(item => item.callback !== callback));
  }
  emit(type, properties = {}) {
    const event = { type, target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...properties };
    for (const { callback, options } of [...(this.listeners.get(type) || [])]) {
      if (options.signal?.aborted) continue;
      if (options.once) this.removeEventListener(type, callback);
      callback(event);
    }
    return event;
  }
  dispatchEvent(event) { this.emit(event.type); }
  get listenerCount() { return [...this.listeners.values()].reduce((sum, items) => sum + items.length, 0); }
}
class Style {
  values = new Map();
  setProperty(name, value, priority = '') { this.values.set(name, [String(value), priority]); }
  getPropertyValue(name) { return this.values.get(name)?.[0] || ''; }
  getPropertyPriority(name) { return this.values.get(name)?.[1] || ''; }
  removeProperty(name) { this.values.delete(name); }
}
class Element extends Events {
  constructor(tagName, document) {
    super(); Object.assign(this, { tagName, document, children: [], dataset: {}, attributes: new Map(), style: new Style(), captures: new Set(), hidden: false });
  }
  contains(element) { return element === this || this.children.some(child => child.contains(element)); }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  removeAttribute(name) { this.attributes.delete(name); }
  toggleAttribute(name, force) { if (force) this.setAttribute(name, ''); else this.removeAttribute(name); }
  hasAttribute(name) { return this.attributes.has(name); }
  focus() { this.document.activeElement = this; }
  setPointerCapture(id) { this.captures.add(id); }
  hasPointerCapture(id) { return this.captures.has(id); }
  releasePointerCapture(id) { this.captures.delete(id); this.emit('lostpointercapture', { pointerId: id }); }
}
Element.prototype.inert = false;
class AbortControllerMock {
  signal = Object.assign(new Events(), { aborted: false });
  abort() { this.signal.aborted = true; this.signal.emit('abort'); }
}
function setup({ reduced = false, hash = '', scrollY = 0, navigationType = 'navigate', inert = true, overflow = '', animationError = false, skipPresent = true } = {}) {
  const document = Object.assign(new Events(), { hidden: false });
  const body = new Element('BODY', document), intro = new Element('SECTION', document);
  const skip = new Element('BUTTON', document), art = new Element('DIV', document), main = new Element('MAIN', document);
  const header = new Element('HEADER', document), alreadyInert = new Element('ASIDE', document);
  alreadyInert.inert = true;
  intro.hidden = true;
  intro.children = [art, skip];
  body.children = [intro, header, main, alreadyInert, new Element('SCRIPT', document)];
  const classes = new Set();
  body.classList = { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) };
  if (overflow) body.style.setProperty('overflow', overflow, 'important');
  document.body = body;
  document.activeElement = header;
  document.querySelector = selector => selector === '.nagi-intro' ? intro : null;
  document.getElementById = id => id === 'main' ? main : null;
  intro.querySelector = selector => selector === '[data-intro-skip]' && skipPresent ? skip : null;
  const animation = { state: 'running', pause() { this.state = 'paused'; }, play() { this.state = 'running'; } };
  intro.getAnimations = () => { if (animationError) throw new Error('Unsupported animation API'); return [animation]; };
  const motion = Object.assign(new Events(), { matches: reduced });
  const window = Object.assign(new Events(), { scrollY, matchMedia: () => motion });
  const frames = new Map(), timers = new Map();
  let now = 0, nextId = 0, finishedEvents = 0;
  document.addEventListener('nagi:intro-finished', () => finishedEvents++);
  vm.runInNewContext(source, {
    window, document, location: { hash }, performance: { getEntriesByType: () => [{ type: navigationType }], now: () => now },
    HTMLElement: inert ? Element : class {}, AbortController: AbortControllerMock, Event: class { constructor(type) { this.type = type; } },
    requestAnimationFrame: callback => { frames.set(++nextId, callback); return nextId; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: (callback, delay) => { timers.set(++nextId, { callback, at: now + delay }); return nextId; },
    clearTimeout: id => timers.delete(id)
  });
  function advance(ms) {
    const until = now + ms;
    while (true) {
      const entry = [...timers.entries()].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!entry) break;
      const [id, timer] = entry; now = timer.at; timers.delete(id); timer.callback();
    }
    now = until;
  }
  function frame(ms = 16) {
    advance(ms);
    const callbacks = [...frames.values()]; frames.clear();
    callbacks.forEach(callback => callback(now));
  }
  function pointer(type, properties = {}) {
    const target = properties.target || art;
    const event = intro.emit(type, { target, pointerId: 1, pointerType: 'touch', isPrimary: true, button: 0, clientX: 100, clientY: 200, ...properties });
    if (type !== 'lostpointercapture') document.emit(type, event);
    return event;
  }
  function key(type, key, properties = {}) { return document.emit(type, { key, code: key === ' ' ? 'Space' : key, target: document.activeElement, ...properties }); }
  function endTransition() { intro.emit('transitionend', { propertyName: 'transform' }); }
  return { document, body, intro, skip, art, main, header, alreadyInert, animation, motion, window, frames, timers, advance, frame, pointer, key, endTransition, finishedEvents: () => finishedEvents };
}
function assertPlaying(s) { assert.equal(s.intro.dataset.state, 'playing'); assert.equal(s.frames.size, 1); assert.equal(s.animation.state, 'running'); }
function assertPaused(s) { assert.equal(s.intro.dataset.state, 'paused'); assert.equal(s.frames.size, 0); assert.equal(s.animation.state, 'paused'); }
function assertComplete(s) {
  assert.equal(s.intro.hidden, true); assert.equal(s.intro.dataset.state, 'complete');
  assert.equal(s.frames.size, 0); assert.equal(s.timers.size, 0);
  assert.equal(s.intro.listenerCount, 0); assert.equal(s.skip.listenerCount, 0);
  assert.equal(s.window.listenerCount, 0); assert.equal(s.motion.listenerCount, 0);
  assert.equal(s.document.listenerCount, 1); // Only the test's completion observer remains.
  assert.equal(s.header.inert, false); assert.equal(s.main.inert, false); assert.equal(s.alreadyInert.inert, true);
  assert.equal(s.body.classList.contains('nagi-intro-open'), false);
  assert.equal(s.intro.captures.size, 0); assert.equal(s.skip.captures.size, 0);
  assert.equal(s.finishedEvents(), 1);
}

test('the arrow is sufficient to initialize the opening, lock its background, and take focus', () => {
  const s = setup(); assertPlaying(s); assert.equal(s.intro.hidden, false);
  assert.equal(s.document.activeElement, s.skip); assert.equal(s.main.inert, true);
  assert.equal(s.body.style.getPropertyValue('overflow'), 'hidden');
});
for (const pointerType of ['touch', 'mouse', 'pen']) {
  test(`${pointerType}: a 250 ms hold pauses only while pressed and short taps do not exit`, () => {
    const s = setup(); s.frame();
    s.pointer('pointerdown', { pointerType }); s.advance(249); assertPlaying(s);
    s.advance(1); assertPaused(s); s.frame(5000); assertPaused(s);
    s.pointer('pointerup', { pointerType }); assertPlaying(s);
    s.pointer('pointerdown', { pointerType }); s.advance(100); s.pointer('pointerup', { pointerType });
    assertPlaying(s); assert.equal(s.timers.size, 0);
  });
}
test('the arrow click exits, while a long hold on the arrow suppresses its generated click', () => {
  const s = setup(); s.pointer('pointerdown', { target: s.skip }); s.advance(250);
  assertPaused(s); assert.equal(s.skip.captures.has(1), true);
  s.pointer('pointerup', { target: s.skip });
  s.skip.emit('click', { detail: 1, pointerId: 1 }); assertPlaying(s);
  s.pointer('pointerdown', { target: s.skip }); s.pointer('pointerup', { target: s.skip });
  s.skip.emit('click', { detail: 1, pointerId: 1 }); assert.equal(s.intro.dataset.state, 'leaving');
  s.endTransition(); assertComplete(s);
});
test('upward swipe exits and cleans the hold timer before it can fire', () => {
  const s = setup(); s.pointer('pointerdown'); s.pointer('pointermove', { clientY: 150 });
  assert.equal(s.intro.dataset.state, 'leaving');
  s.advance(300); assert.equal(s.intro.dataset.state, 'leaving');
  s.endTransition(); assertComplete(s);
});
test('horizontal or downward movement cancels long press without exiting', () => {
  for (const movement of [{ clientX: 150 }, { clientY: 250 }, { clientX: 170, clientY: 150 }]) {
    const s = setup(); s.pointer('pointerdown'); s.pointer('pointermove', movement);
    s.advance(300); assertPlaying(s); s.pointer('pointerup', movement); assertPlaying(s);
  }
});
test('movement after a held pause releases it and an upward swipe can still exit', () => {
  const s = setup(); s.pointer('pointerdown'); s.advance(250); assertPaused(s);
  s.pointer('pointermove', { clientX: 120 }); assertPlaying(s);
  s.pointer('pointermove', { clientY: 140 }); assert.equal(s.intro.dataset.state, 'leaving');
  s.endTransition(); assertComplete(s);
});
for (const event of ['pointercancel', 'lostpointercapture']) {
  test(`${event} cancels pending or active holds without leaving playback stuck`, () => {
    for (const wait of [100, 250]) {
      const s = setup(); s.pointer('pointerdown'); s.advance(wait); s.pointer(event);
      s.advance(300); assertPlaying(s); assert.equal(s.timers.size, 0);
    }
  });
}
test('multi-touch cancels hold and swipe until all pointers are released', () => {
  const s = setup(); s.pointer('pointerdown'); s.advance(250); assertPaused(s);
  s.pointer('pointerdown', { pointerId: 2, isPrimary: false }); assertPlaying(s);
  s.pointer('pointermove', { clientY: 100 }); s.advance(300); assertPlaying(s);
  s.pointer('pointerup', { pointerId: 2, isPrimary: false });
  s.pointer('pointermove', { clientY: 80 }); assertPlaying(s);
  s.pointer('pointerup'); s.pointer('pointerdown'); s.advance(250); assertPaused(s);
  s.pointer('pointerup'); assertPlaying(s);
});
test('non-left mouse buttons and nonprimary orphan touch do not start a hold', () => {
  for (const properties of [{ pointerType: 'mouse', button: 2 }, { isPrimary: false }]) {
    const s = setup(); s.pointer('pointerdown', properties); s.advance(500); assertPlaying(s);
  }
});
test('Space pauses while down, ignores repeats, and resumes on keyup without skipping the focused arrow', () => {
  const s = setup(); const down = s.key('keydown', ' '); assert.equal(down.defaultPrevented, true); assertPaused(s);
  s.key('keydown', ' ', { repeat: true }); assertPaused(s);
  const up = s.key('keyup', ' '); assert.equal(up.defaultPrevented, true); assertPlaying(s);
});
test('releasing one input does not resume while another pause input is still held', () => {
  const s = setup(); s.pointer('pointerdown'); s.advance(250); s.key('keydown', ' ');
  s.pointer('pointerup'); assertPaused(s); s.key('keyup', ' '); assertPlaying(s);
});
for (const key of ['Enter', 'Escape', 'ArrowDown', 'PageDown']) {
  test(`${key} enters the page from the focused arrow`, () => {
    const s = setup(); assert.equal(s.key('keydown', key).defaultPrevented, true);
    assert.equal(s.intro.dataset.state, 'leaving'); s.endTransition(); assertComplete(s);
    assert.equal(s.document.activeElement, s.main);
    assert.equal(s.main.getAttribute('tabindex'), '-1'); s.main.emit('blur'); assert.equal(s.main.getAttribute('tabindex'), null);
  });
}
test('Tab and Shift+Tab stay on the single arrow, and outside focus is redirected', () => {
  const s = setup();
  for (const shiftKey of [false, true]) {
    assert.equal(s.key('keydown', 'Tab', { shiftKey }).defaultPrevented, true);
    assert.equal(s.document.activeElement, s.skip);
  }
  s.header.focus(); s.document.emit('focusin', { target: s.header }); assert.equal(s.document.activeElement, s.skip);
});
test('visibility changes stop all animation work and discard stale pressed inputs', () => {
  const s = setup(); s.pointer('pointerdown'); s.advance(100); s.key('keydown', ' ');
  s.document.hidden = true; s.document.emit('visibilitychange'); assertPaused(s);
  s.advance(8000); assertPaused(s); assert.equal(s.timers.size, 0);
  s.document.hidden = false; s.document.emit('visibilitychange'); assertPlaying(s);
});
test('window blur clears a hold and Space so a missed release cannot leave a permanent pause', () => {
  const s = setup(); s.pointer('pointerdown'); s.advance(250); s.key('keydown', ' ');
  s.window.emit('blur'); assertPlaying(s); assert.equal(s.timers.size, 0);
});
test('elapsed playback excludes hold and hidden time and ends after 7.4 visible playing seconds', () => {
  const s = setup(); s.frame(0); s.frame(1500); assert.equal(s.intro.dataset.scene, '0');
  s.key('keydown', ' '); s.advance(9000); s.key('keyup', ' ');
  s.frame(0); s.frame(100); assert.equal(s.intro.dataset.scene, '1');
  s.document.hidden = true; s.document.emit('visibilitychange'); s.advance(9000);
  s.document.hidden = false; s.document.emit('visibilitychange'); s.frame(0); s.frame(1800);
  assert.equal(s.intro.dataset.scene, '2'); s.frame(2000); assert.equal(s.intro.dataset.scene, '3');
  s.frame(2000); assert.equal(s.intro.dataset.state, 'leaving'); s.endTransition(); assertComplete(s);
});
test('downward wheel exits but zoom and upward wheel are ignored', () => {
  const s = setup(); s.intro.emit('wheel', { deltaY: -20 }); s.intro.emit('wheel', { deltaY: 20, ctrlKey: true }); assertPlaying(s);
  s.intro.emit('wheel', { deltaY: 20 }); assert.equal(s.intro.dataset.state, 'leaving'); s.endTransition(); assertComplete(s);
});
test('finish restores an existing overflow priority and uses a fallback if transitionend is absent', () => {
  const s = setup({ overflow: 'clip' }); s.skip.emit('click'); s.advance(1000); assertComplete(s);
  assert.equal(s.body.style.getPropertyValue('overflow'), 'clip'); assert.equal(s.body.style.getPropertyPriority('overflow'), 'important');
});
for (const event of ['hashchange', 'pagehide']) {
  test(`${event} restores immediately, cancels hold and listeners, and emits completion once`, () => {
    const s = setup(); s.pointer('pointerdown'); s.window.emit(event); assertComplete(s);
    s.advance(10000); s.window.emit(event); assert.equal(s.finishedEvents(), 1);
  });
}
test('switching to reduced motion restores the page immediately', () => {
  const s = setup(); s.motion.matches = true; s.motion.emit('change'); assertComplete(s);
});
for (const option of [{ reduced: true }, { hash: '#main' }, { scrollY: 100 }, { navigationType: 'back_forward' }, { inert: false }, { skipPresent: false }]) {
  test(`initial fallback leaves the ordinary page untouched: ${JSON.stringify(option)}`, () => {
    const s = setup(option); assert.equal(s.intro.hidden, true); assert.equal(s.frames.size, 0);
    assert.equal(s.timers.size, 0); assert.equal(s.main.inert, false); assert.equal(s.document.activeElement, s.header);
    assert.equal(s.body.style.getPropertyValue('overflow'), '');
  });
}
test('initial animation API failure restores the usable page and cleans everything', () => {
  const s = setup({ animationError: true }); assertComplete(s);
});
test('the gesture surface keeps pointer control and the arrow keeps a 52 px target plus a visible focus ring', () => {
  const css = readFileSync(new URL('../nagi-reel.css', import.meta.url), 'utf8');
  assert.match(css, /touch-action:\s*none/);
  assert.match(css, /min-width:\s*52px/); assert.match(css, /min-height:\s*52px/);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px/);
  assert.doesNotMatch(css, /\.nagi-intro-(?:top|bottom|progress|actions)\b/);
});
