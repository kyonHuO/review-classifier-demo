/* Progressive enhancement: Nagiport's own 7.4-second opening. No storage or network. */
(() => {
  'use strict';
  const intro = document.querySelector('.nagi-intro');
  if (!intro) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = performance.getEntriesByType('navigation')[0];
  if (motion.matches || location.hash || window.scrollY > 8 || navigation?.type === 'back_forward' || !('inert' in HTMLElement.prototype)) return;
  const skip = intro.querySelector('[data-intro-skip]');
  if (!skip) return;
  const controller = new AbortController();
  const { signal } = controller;
  const duration = 7400, holdDelay = 250, moveTolerance = 12, swipeDistance = 32;
  const background = Array.from(document.body.children)
    .filter(el => el !== intro && !['SCRIPT', 'STYLE'].includes(el.tagName))
    .map(el => ({ el, inert: el.inert }));
  const overflow = document.body.style.getPropertyValue('overflow');
  const overflowPriority = document.body.style.getPropertyPriority('overflow');
  const pointers = new Map();
  let elapsed = 0, previous = null, frame = null, ending = false, finished = false;
  let pointerPaused = false, spacePaused = false, cleanupTimer = null, holdTimer = null;
  let gesture = null, multiPointer = false, suppressPointerClick = false;

  function cancelFrame() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previous = null;
  }
  function cancelHold() {
    clearTimeout(holdTimer); holdTimer = null;
    pointerPaused = false;
  }
  function releaseCapture(owner, id) {
    try { if (owner.hasPointerCapture?.(id)) owner.releasePointerCapture(id); } catch { /* Already released by the browser. */ }
  }
  function clearInputs() {
    cancelHold(); spacePaused = false; gesture = null; multiPointer = false;
    const captures = [...pointers]; pointers.clear();
    captures.forEach(([id, owner]) => releaseCapture(owner, id));
  }
  function restore() {
    if (finished) return;
    finished = true;
    cancelFrame(); clearTimeout(cleanupTimer);
    controller.abort(); clearInputs();
    background.forEach(({ el, inert }) => { el.inert = inert; });
    if (overflow) document.body.style.setProperty('overflow', overflow, overflowPriority);
    else document.body.style.removeProperty('overflow');
    document.body.classList.remove('nagi-intro-open');
    const hadFocus = intro.contains(document.activeElement);
    intro.hidden = true;
    intro.dataset.state = 'complete';
    if (hadFocus) {
      const destination = document.getElementById('main');
      if (destination) {
        const oldTabindex = destination.getAttribute('tabindex');
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
        destination.addEventListener('blur', () => {
          if (oldTabindex === null) destination.removeAttribute('tabindex');
          else destination.setAttribute('tabindex', oldTabindex);
        }, { once: true });
      }
    }
    document.dispatchEvent(new Event('nagi:intro-finished'));
  }
  function finish(immediate = false) {
    if (finished) return;
    if (immediate) { ending = true; restore(); return; }
    if (ending) return;
    ending = true; cancelFrame(); clearInputs();
    intro.getAnimations({ subtree: true }).forEach(animation => animation.play());
    intro.toggleAttribute('data-paused', false);
    intro.dataset.state = 'leaving';
    intro.dataset.leaving = '';
    // Keep background inert and scroll locked until the exit has actually ended.
    intro.addEventListener('transitionend', event => {
      if (event.target === intro && event.propertyName === 'transform') restore();
    }, { signal });
    cleanupTimer = setTimeout(restore, 1000);
  }
  function tick(now) {
    frame = null;
    if (ending || finished || pointerPaused || spacePaused || document.hidden) { previous = null; return; }
    if (previous !== null) elapsed += Math.max(0, now - previous);
    previous = now;
    const scene = elapsed < 1600 ? 0 : elapsed < 3400 ? 1 : elapsed < 5400 ? 2 : 3;
    intro.dataset.scene = String(scene);
    if (elapsed >= duration) finish();
    else frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelFrame();
    if (ending || finished) return;
    const paused = pointerPaused || spacePaused || document.hidden;
    intro.toggleAttribute('data-paused', paused);
    intro.dataset.state = paused ? 'paused' : 'playing';
    intro.getAnimations({ subtree: true }).forEach(animation => paused ? animation.pause() : animation.play());
    if (!paused) frame = requestAnimationFrame(tick);
  }
  function pointerDown(event) {
    if (ending || finished || document.hidden || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (pointers.has(event.pointerId)) return;
    if (pointers.size === 0) suppressPointerClick = false;
    // Capturing on the arrow itself preserves its ordinary short-click behavior.
    const owner = skip.contains(event.target) ? skip : intro;
    pointers.set(event.pointerId, owner);
    try { owner.setPointerCapture?.(event.pointerId); } catch { /* Document listeners still observe release. */ }
    if (pointers.size > 1 || event.isPrimary === false) {
      multiPointer = true; suppressPointerClick = true; gesture = null;
      cancelHold(); sync(); return;
    }
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    holdTimer = setTimeout(() => {
      holdTimer = null;
      if (!gesture || gesture.moved || multiPointer || ending || finished || document.hidden) return;
      pointerPaused = true; suppressPointerClick = true; sync();
    }, holdDelay);
  }
  function pointerMove(event) {
    if (!gesture || event.pointerId !== gesture.id || multiPointer || ending || finished) return;
    const dx = event.clientX - gesture.x, up = gesture.y - event.clientY;
    if (up >= swipeDistance && up > Math.abs(dx)) {
      suppressPointerClick = true; finish(); return;
    }
    if (!gesture.moved && Math.hypot(dx, up) > moveTolerance) {
      gesture.moved = true; suppressPointerClick = true;
      const wasPaused = pointerPaused; cancelHold();
      if (wasPaused) sync();
    }
  }
  function pointerEnd(event) {
    if (!pointers.has(event.pointerId)) return;
    const owner = pointers.get(event.pointerId);
    pointers.delete(event.pointerId);
    if (gesture?.id === event.pointerId) {
      gesture = null;
      const wasPaused = pointerPaused; cancelHold();
      if (event.type !== 'pointerup') suppressPointerClick = true;
      if (wasPaused) sync();
    }
    if (pointers.size === 0) multiPointer = false;
    releaseCapture(owner, event.pointerId);
  }
  try {
    skip.addEventListener('click', event => {
      if (event.detail > 0 && suppressPointerClick) { event.preventDefault(); return; }
      finish();
    }, { signal });
    intro.addEventListener('pointerdown', pointerDown, { signal });
    document.addEventListener('pointermove', pointerMove, { passive: true, signal });
    document.addEventListener('pointerup', pointerEnd, { signal });
    document.addEventListener('pointercancel', pointerEnd, { signal });
    intro.addEventListener('lostpointercapture', pointerEnd, { signal });
    intro.addEventListener('contextmenu', event => event.preventDefault(), { signal });
    intro.addEventListener('dragstart', event => event.preventDefault(), { signal });
    intro.addEventListener('wheel', event => {
      if (event.deltaY > 0 && !event.ctrlKey) finish();
    }, { passive: true, signal });
    document.addEventListener('keydown', event => {
      if (ending || finished || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'Tab') {
        event.preventDefault(); skip.focus({ preventScroll: true }); return;
      }
      if (event.key === ' ') {
        event.preventDefault();
        if (!spacePaused) { spacePaused = true; sync(); }
        return;
      }
      if (['Enter', 'Escape', 'ArrowDown', 'PageDown'].includes(event.key)) {
        event.preventDefault(); finish();
      }
    }, { signal });
    document.addEventListener('keyup', event => {
      if (event.key !== ' ' || !spacePaused) return;
      event.preventDefault(); spacePaused = false; sync();
    }, { signal });
    document.addEventListener('focusin', event => {
      if (!ending && !finished && !intro.contains(event.target)) skip.focus({ preventScroll: true });
    }, { signal });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInputs();
      sync();
    }, { signal });
    window.addEventListener('blur', () => { clearInputs(); sync(); }, { signal });
    motion.addEventListener('change', () => { if (motion.matches) finish(true); }, { signal });
    window.addEventListener('hashchange', () => finish(true), { signal });
    window.addEventListener('pagehide', () => finish(true), { signal });
    background.forEach(({ el }) => { el.inert = true; });
    document.body.style.setProperty('overflow', 'hidden');
    document.body.classList.add('nagi-intro-open');
    intro.hidden = false;
    intro.dataset.scene = '0';
    sync();
    skip.focus({ preventScroll: true });
  } catch {
    // If enhancement is unavailable, the ordinary page must remain usable.
    restore();
  }
})();
