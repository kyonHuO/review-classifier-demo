/* Nagiport introduction. Visual vocabulary: the supplied 15-second Motion Reel.
   No model inference, network requests, or external animation dependencies. */
(() => {
  'use strict';
  const root = document.querySelector('.nagi-reel');
  if (!root) return;
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;
  const stage = root.querySelector('.nagi-reel-stage');
  const toggle = root.querySelector('[data-reel-toggle]');
  const restart = root.querySelector('[data-reel-restart]');
  const seek = root.querySelector('input');
  const clock = root.querySelector('output');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const W = 960, H = 540, duration = 15;
  const blue = '#2b3dff', white = '#eff1fe', black = '#070711';
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
  let time = 0, wanted = !motion.matches, visible = !('IntersectionObserver' in window);
  let frame = null, previous = null, pageActive = true;

  function text(value, x, y, size, color = white, align = 'left') {
    ctx.fillStyle = color;
    ctx.font = `900 ${size}px Arial, sans-serif`;
    ctx.textAlign = align;
    ctx.fillText(value, x, y);
  }
  function line(x, y, endX, endY, color, width = 1) {
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(endX, endY); ctx.stroke();
  }
  function dot(x, y, radius, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  function polygonRadius(sides, angle) {
    const step = Math.PI * 2 / sides;
    const local = ((angle + step / 2) % step + step) % step - step / 2;
    return 174 * Math.cos(Math.PI / sides) / Math.cos(local);
  }
  function morph(t) {
    const shapes = [4, 0, 3, 0];
    const phase = Math.min(2, Math.floor(t));
    const progress = ease(t - phase);
    ctx.save(); ctx.translate(480, 270); ctx.rotate(t * .45);
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const a = i / 180 * Math.PI * 2;
      const radius = kind => kind ? polygonRadius(kind, a) : 156;
      const r = mix(radius(shapes[phase]), radius(shapes[phase + 1]), progress);
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fillStyle = blue; ctx.fill(); ctx.restore();
    text('ORGANIZE', 480, 480, 25, blue, 'center');
  }
  function particles(t) {
    const progress = ease(t / 2.4);
    for (let row = 0; row < 8; row++) for (let col = 0; col < 28; col++) {
      const a = col / 28 * Math.PI * 2, b = row / 8 * Math.PI * 2;
      const r = 145 + 60 * Math.cos(b);
      const x = r * Math.cos(a), y = r * Math.sin(a), z = 60 * Math.sin(b);
      const yy = y * Math.cos(t * .5) - z * Math.sin(t * .5);
      const depth = y * Math.sin(t * .5) + z * Math.cos(t * .5);
      const perspective = 700 / (700 + depth);
      const px = mix((col - 13.5) * 25, x * perspective, progress);
      const py = mix((row - 3.5) * 35, yy * perspective, progress);
      ctx.globalAlpha = clamp(.65 - depth / 500, .25, 1);
      dot(480 + px, 270 + py, 2.6 * perspective, white);
    }
    ctx.globalAlpha = 1;
    text('VOICE TO VIEW', 480, 480, 25, white, 'center');
  }
  function render() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(box.width * dpr));
    const height = Math.max(1, Math.round(box.height * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    ctx.setTransform(width / W, 0, 0, height / H, 0, 0);
    const pale = time >= 5 && time < 8;
    ctx.fillStyle = pale ? white : time >= 2.5 && time < 11 || time >= 13 ? blue : black;
    ctx.fillRect(0, 0, W, H);
    const ink = pale ? blue : white;
    if (time < 2.5) {
      const p = ease(time / 1.1);
      text('NAGIPORT', 480, 295, 110 + 8 * p, white, 'center');
      line(85, 330, 85 + 790 * p, 330, blue, 5);
      text('VOICE TO VIEW', 480, 385, 24, white, 'center');
    } else if (time < 5) {
      const word = 'NAGIPORT';
      for (let i = 0; i < word.length; i++) {
        const a = -Math.PI / 2 + i / word.length * Math.PI * 2 + (time - 2.5) * .14;
        ctx.save(); ctx.translate(480 + Math.cos(a) * 157, 270 + Math.sin(a) * 157);
        ctx.rotate(a + Math.PI / 2); text(word[i], 0, 20, 64, white, 'center'); ctx.restore();
      }
      text('CSV', 480, 288, 42, white, 'center');
    } else if (time < 8) {
      line(80, 270, 880, 270, '#cbd0fc'); line(480, 80, 480, 460, '#cbd0fc');
      morph(time - 5);
    } else if (time < 11) {
      particles(time - 8);
    } else if (time < 13) {
      const labels = ['INPUT', 'CLASSIFY', 'REVIEW'];
      labels.forEach((label, i) => {
        const p = ease((time - 11 - i * .3) / .5);
        ctx.globalAlpha = .25 + .75 * p;
        const x = 95 + i * 285;
        text(`0${i + 1}`, x, 235, 75, blue);
        text(label, x, 295, 31);
        line(x, 330, x + 200 * p, 330, white, 3);
      });
      ctx.globalAlpha = 1;
      text('CSV → LABEL → CSV', 480, 420, 26, white, 'center');
    } else {
      text('NAGIPORT', 480, 290, 118, white, 'center');
      text('MANY VOICES. A CLEARER VIEW.', 480, 355, 25, white, 'center');
    }
    text('NAGIPORT / MOTION REEL', 36, 40, 15, ink);
    text('15 SEC', 924, 40, 15, ink, 'right');
    line(36, 504, 924, 504, pale ? '#cbd0fc' : '#7880cd');
    line(36, 504, 36 + 888 * time / duration, 504, ink, 3);
  }
  function isPlaying() { return wanted && visible && !document.hidden && pageActive; }
  function updateUI() {
    const label = isPlaying() ? '一時停止' : '再生';
    toggle.textContent = label;
    toggle.setAttribute('aria-label', `紹介映像を${label}`);
    seek.value = String(time);
    clock.textContent = `00:${String(Math.floor(time)).padStart(2, '0')} / 00:15`;
  }
  function tick(now) {
    frame = null;
    if (!isPlaying()) return;
    if (previous !== null) time = Math.min(duration, time + (now - previous) / 1000);
    previous = now;
    if (time >= duration) wanted = false;
    render(); updateUI();
    if (isPlaying()) frame = requestAnimationFrame(tick);
    else previous = null;
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previous = null;
    render(); updateUI();
    if (isPlaying()) frame = requestAnimationFrame(tick);
  }
  function playPause() {
    wanted = !wanted;
    if (wanted && time >= duration) time = 0;
    sync();
  }
  toggle.addEventListener('click', playPause);
  restart.addEventListener('click', () => { time = 0; wanted = true; sync(); });
  seek.addEventListener('input', () => { time = clamp(Number(seek.value), 0, duration); wanted = false; sync(); });
  // Keyboard shortcuts belong only to the focused canvas stage. Native controls stay native.
  stage.addEventListener('keydown', event => {
    if (event.target !== stage || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.code === 'Space') { event.preventDefault(); if (!event.repeat) playPause(); return; }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.code)) return;
    event.preventDefault(); wanted = false;
    time = event.code === 'Home' ? 0 : event.code === 'End' ? duration : clamp(time + (event.code === 'ArrowRight' ? 1 : -1), 0, duration);
    sync();
  });
  motion.addEventListener('change', () => { if (motion.matches) { wanted = false; sync(); } });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => { pageActive = false; sync(); });
  window.addEventListener('pageshow', () => { pageActive = true; sync(); });
  window.addEventListener('resize', render);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting; sync();
    }, { threshold: 0 }).observe(stage);
  }
  root.querySelector('.nagi-reel-controls').hidden = false;
  sync();
  root.dataset.ready = '';
})();
