/* Progressive enhancement: Nagiport's own 7.4-second opening. No storage or network. */
(() => {
  'use strict';
  const intro = document.querySelector('.nagi-intro');
  if (!intro) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = performance.getEntriesByType('navigation')[0];
  if (motion.matches || location.hash || window.scrollY > 8 || navigation?.type === 'back_forward' || !('inert' in HTMLElement.prototype)) return;
  const pause = intro.querySelector('[data-intro-pause]');
  const skip = intro.querySelector('[data-intro-skip]');
  if (!pause || !skip) return;
  const controller = new AbortController();
  const { signal } = controller;
  const duration = 7400;
  const background = Array.from(document.body.children)
    .filter(el => el !== intro && !['SCRIPT', 'STYLE'].includes(el.tagName))
    .map(el => ({ el, inert: el.inert }));
  const overflow = document.body.style.getPropertyValue('overflow');
  const overflowPriority = document.body.style.getPropertyPriority('overflow');
  let elapsed = 0, previous = null, frame = null, ending = false, finished = false;
  let manuallyPaused = false, cleanupTimer = null, touchY = null;

  function cancelFrame() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previous = null;
  }
  function restore() {
    if (finished) return;
    finished = true;
    cancelFrame(); clearTimeout(cleanupTimer);
    controller.abort();
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
    ending = true; cancelFrame();
    intro.getAnimations({ subtree: true }).forEach(animation => animation.play());
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
    if (ending || finished || manuallyPaused || document.hidden) { previous = null; return; }
    if (previous !== null) elapsed += Math.max(0, now - previous);
    previous = now;
    const scene = elapsed < 1600 ? 0 : elapsed < 3400 ? 1 : elapsed < 5400 ? 2 : 3;
    intro.dataset.scene = String(scene);
    intro.style.setProperty('--intro-progress', String(Math.min(1, elapsed / duration)));
    if (elapsed >= duration) finish();
    else frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelFrame();
    if (ending || finished) return;
    const paused = manuallyPaused || document.hidden;
    intro.toggleAttribute('data-paused', paused);
    intro.dataset.state = paused ? 'paused' : 'playing';
    pause.textContent = manuallyPaused ? '再生' : '一時停止';
    pause.setAttribute('aria-label', manuallyPaused ? 'オープニングを再生' : 'オープニングを一時停止');
    intro.getAnimations({ subtree: true }).forEach(animation => paused ? animation.pause() : animation.play());
    if (!paused) frame = requestAnimationFrame(tick);
  }
  try {
    skip.addEventListener('click', () => finish(), { signal });
    pause.addEventListener('click', () => { manuallyPaused = !manuallyPaused; sync(); }, { signal });
    intro.addEventListener('wheel', event => {
      if (event.deltaY > 0 && !event.ctrlKey) finish();
    }, { passive: true, signal });
    intro.addEventListener('touchstart', event => {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    }, { passive: true, signal });
    intro.addEventListener('touchmove', event => {
      if (touchY !== null && event.touches.length === 1 && touchY - event.touches[0].clientY > 24) finish();
    }, { passive: true, signal });
    intro.addEventListener('touchend', () => { touchY = null; }, { passive: true, signal });
    document.addEventListener('keydown', event => {
      if (ending || finished || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'Tab') {
        const active = document.activeElement;
        if (event.shiftKey && (active === pause || !intro.contains(active))) { event.preventDefault(); skip.focus(); }
        else if (!event.shiftKey && (active === skip || !intro.contains(active))) { event.preventDefault(); pause.focus(); }
        return;
      }
      if (['Escape', 'ArrowDown', 'PageDown'].includes(event.key) ||
          ((event.key === ' ' || event.key === 'Enter') && event.target !== pause && event.target !== skip)) {
        event.preventDefault(); finish();
      }
    }, { signal });
    document.addEventListener('focusin', event => {
      if (!ending && !finished && !intro.contains(event.target)) skip.focus({ preventScroll: true });
    }, { signal });
    document.addEventListener('visibilitychange', sync, { signal });
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
