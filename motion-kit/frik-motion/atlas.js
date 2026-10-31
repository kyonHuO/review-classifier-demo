/* Nagiport Motion Atlas. No network calls, storage, or external dependencies. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = media.matches;
  let userOverride = false;
  let frame = 0;
  let playing = false;
  let playhead = 1200;
  let previousTime = 0;
  let inView = true;
  let hasPlayed = false;
  const DURATION = 12000;
  const reel = $('#reel');
  const scrub = $('#scrub');
  let sourceAnimations = [];
  const sceneCopy = [
    ['CLARITY IN MOTION', 'まず、伝わる。'],
    ['CONTINUITY IN MOTION', 'そっと、つながる。'],
    ['EXPRESSION IN MOTION', '触れると、応える。']
  ];

  function collectAnimations() {
    sourceAnimations = $$('.figma-shape').flatMap(el => el.getAnimations());
    sourceAnimations.forEach(animation => animation.pause());
  }

  function drawReel() {
    // Preserve all exported Figma tracks on one 12-second timeline.
    // The source is looping; the accessible player deliberately stops after one pass.
    sourceAnimations.forEach(animation => { animation.currentTime = Math.min(playhead, DURATION - 0.01); });
    const scene = Math.min(2, Math.floor(playhead / 4000));
    reel.dataset.scene = scene;
    $('#scene-counter').textContent = `0${scene + 1} / 03`;
    $('#reel-index').textContent = `0${scene + 1}`;
    $('#reel-kicker').textContent = sceneCopy[scene][0];
    $('#reel-title').textContent = sceneCopy[scene][1];
    const seconds = Math.floor(playhead / 1000);
    const timeText = `00:${String(seconds).padStart(2, '0')}`;
    if ($('#time').textContent !== timeText) $('#time').textContent = timeText;
    scrub.value = String(playhead / 1000);
    scrub.setAttribute('aria-valuetext', `${(playhead / 1000).toFixed(1)}秒 / 12秒`);
    $$('[data-seek]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.seek) / 4 === scene)));
  }

  function setTransport() {
    $('#play-icon').textContent = playing ? 'Ⅱ' : '▶';
    $('#play-label').textContent = playing ? '一時停止' : '再生';
    $('#play').setAttribute('aria-label', playing ? 'モーションを一時停止' : 'モーションを再生');
  }

  function pause(message) {
    playing = false;
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    setTransport();
    if (message) $('#playback-status').textContent = message;
  }

  function tick(now) {
    if (!playing) return;
    if (previousTime) playhead = Math.min(DURATION, playhead + now - previousTime);
    previousTime = now;
    drawReel();
    if (playhead >= DURATION) return pause('再生終了。もう一度見るには ↺');
    frame = requestAnimationFrame(tick);
  }

  function play(fromStart = false) {
    if (reduce) {
      $('#playback-status').textContent = '動きを抑えています。シーンボタンで静止表示を選べます';
      return;
    }
    if (!inView || document.hidden) return;
    if (fromStart || !hasPlayed || playhead >= DURATION) playhead = 0;
    hasPlayed = true;
    playing = true;
    previousTime = 0;
    cancelAnimationFrame(frame);
    setTransport();
    $('#playback-status').textContent = '12秒のリールを再生中';
    frame = requestAnimationFrame(tick);
  }

  $('#play').addEventListener('click', () => playing ? pause('一時停止中') : play());
  $('#replay').addEventListener('click', () => {
    pause();
    playhead = 0;
    drawReel();
    play(true);
  });
  scrub.addEventListener('input', () => {
    pause('再生位置を変更しました');
    hasPlayed = true;
    playhead = Number(scrub.value) * 1000;
    drawReel();
  });
  $$('[data-seek]').forEach(button => button.addEventListener('click', () => {
    pause(reduce ? '静止表示でシーンを選択中' : 'シーンを選択しました。再生で続きを見る');
    hasPlayed = true;
    // Jump to the beginning of each phase; exported spring motion begins 0.4 s later.
    playhead = Number(button.dataset.seek) * 1000;
    drawReel();
  }));

  function applyPreference() {
    document.documentElement.classList.toggle('reduced-motion', reduce);
    document.documentElement.classList.toggle('motion-override', userOverride);
    $('#motion-toggle').setAttribute('aria-pressed', String(reduce));
    $('#motion-label').textContent = reduce ? '動きを抑えています' : '動きを抑える';
    if (reduce) {
      pause('動きを抑えています。シーンを静止表示で比較できます');
      document.getAnimations().forEach(animation => animation.cancel());
      sourceAnimations = [];
    } else {
      collectAnimations();
      drawReel();
      $('#playback-status').textContent = '再生して、3つの表情を見る';
    }
  }
  $('#motion-toggle').addEventListener('click', () => {
    userOverride = true;
    reduce = !reduce;
    applyPreference();
  });
  media.addEventListener('change', event => {
    if (!userOverride) {
      reduce = event.matches;
      applyPreference();
    }
  });
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (!inView && playing) pause('画面外のため一時停止しました');
  }, { threshold: 0.1 }).observe(reel);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (playing) pause('別タブに移動したため一時停止しました');
      document.getAnimations().filter(a => !sourceAnimations.includes(a)).forEach(a => a.finish());
    }
  });

  const modes = {
    clear: { title: ['次の一歩が、', '見える。'], description: '強いコントラストと素直な整列。動きは短く控えめにし、何を選び、何が変わったかを明確にします。', principle: 'HIERARCHY & FOCUS', shape: '直線・小さな角丸', motion: '短いフェード', value: '情報の優先順位', duration: 180, easing: 'cubic-bezier(.2,0,0,1)' },
    calm: { title: ['流れの中で、', 'つながる。'], description: 'やわらかな輪郭と落ち着いた余白。カードの開閉がなめらかにつながり、視線の行き先をそっと案内します。', principle: 'CONTINUITY & CONTROL', shape: 'やわらかな角丸', motion: 'なめらかな移動', value: '操作と結果の連続性', duration: 420, easing: 'cubic-bezier(.22,.68,0,1.02)' },
    expressive: { title: ['小さな操作に、', '表情を。'], description: '大胆な輪郭と軽やかな反応。選択や完了に小さな弾みを添え、操作が届いた手ごたえをつくります。', principle: 'RESPONSE & CHARACTER', shape: '大きな丸み・鮮やかな色', motion: '弾力のある応答', value: '触れた手ごたえ', duration: 560, easing: 'cubic-bezier(.25,1.45,.35,1)' }
  };
  let mode = 'clear';
  const modeButtons = $$('[data-mode][role="tab"]');
  function animateChange(element, kind = 'enter') {
    if (reduce || document.hidden) return;
    element.getAnimations().forEach(animation => animation.cancel());
    const settings = modes[mode];
    const frames = mode === 'clear'
      ? [{ opacity: 0.35 }, { opacity: 1 }]
      : mode === 'calm'
        ? [{ opacity: 0.5, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }]
        : [{ opacity: 0.5, transform: `scale(${kind === 'complete' ? .93 : .96}) translateY(5px)` }, { opacity: 1, transform: 'scale(1) translateY(0)' }];
    element.animate(frames, { duration: settings.duration, easing: settings.easing });
  }
  function changeMode(next) {
    mode = next;
    const settings = modes[next];
    modeButtons.forEach(button => {
      const active = button.dataset.mode === next;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $('#mode-panel').dataset.mode = next;
    $('#mode-panel').setAttribute('aria-labelledby', `tab-${next}`);
    const title = $('#mode-title');
    title.replaceChildren(document.createTextNode(settings.title[0]), document.createElement('br'), document.createTextNode(settings.title[1]));
    $('#mode-description').textContent = settings.description;
    $('#mode-principle').textContent = settings.principle;
    $('#spec-shape').textContent = settings.shape;
    $('#spec-motion').textContent = settings.motion;
    $('#spec-value').textContent = settings.value;
    animateChange($('#demo-app'));
  }
  modeButtons.forEach((button, index) => {
    button.addEventListener('click', () => changeMode(button.dataset.mode));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % modeButtons.length;
      if (event.key === 'ArrowLeft') next = (index + modeButtons.length - 1) % modeButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = modeButtons.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        changeMode(modeButtons[next].dataset.mode);
        modeButtons[next].focus();
      }
    });
  });

  const tasks = [
    { id: 'layout', title: '余白のリズムを整える', subtitle: 'DESIGN / LAYOUT', icon: '▤', description: '見出しと本文の間隔をそろえて、読み進める順序をわかりやすくします。' },
    { id: 'motion', title: '切り替えの動きを確かめる', subtitle: 'MOTION / TRANSITION', icon: '↗', description: 'モードを切り替え、開閉の動きやボタンの手ごたえを比べてみましょう。' },
    { id: 'focus', title: 'キーボードでたどってみる', subtitle: 'ACCESSIBILITY / FOCUS', icon: '⊞', description: 'Tabで移動し、EnterまたはSpaceで操作できます。モードは左右の矢印キーでも選べます。' }
  ];
  let done = new Set();
  let opened = null;
  let filter = 'all';
  let lastCompleted = null;
  // Build once; state changes preserve button nodes and keyboard focus.
  const list = $('#task-list');
  tasks.forEach(task => {
    const card = document.createElement('article');
    card.className = 'task-card';
    card.id = `card-${task.id}`;
    const toggle = document.createElement('button');
    toggle.className = 'task-button';
    toggle.type = 'button';
    toggle.id = `task-${task.id}`;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', `detail-${task.id}`);
    const icon = document.createElement('span'); icon.className = 'task-icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = task.icon;
    const label = document.createElement('span'); label.className = 'task-label'; label.textContent = task.title;
    const subtitle = document.createElement('span'); subtitle.className = 'task-subtitle'; subtitle.textContent = task.subtitle; label.append(subtitle);
    const arrow = document.createElement('span'); arrow.className = 'task-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
    toggle.append(icon, label, arrow);
    const detail = document.createElement('div'); detail.className = 'task-detail'; detail.id = `detail-${task.id}`; detail.hidden = true;
    const description = document.createElement('p'); description.textContent = task.description;
    const complete = document.createElement('button'); complete.type = 'button'; complete.className = 'complete-button'; complete.textContent = '確認済みにする';
    complete.setAttribute('aria-label', `${task.title}を確認済みにする`);
    detail.append(description, complete); card.append(toggle, detail); list.append(card);
    toggle.addEventListener('click', () => {
      opened = opened === task.id ? null : task.id;
      updateTasks();
      if (opened) animateChange(detail);
    });
    complete.addEventListener('click', () => {
      done.add(task.id); lastCompleted = task.id;
      // Move focus before disabling the just-activated button.
      toggle.focus();
      updateTasks();
      $('#demo-status').textContent = `「${task.title}」を確認済みにしました`;
      animateChange(card, 'complete');
    });
  });
  function updateTasks() {
    tasks.forEach(task => {
      const card = $(`#card-${task.id}`);
      const isDone = done.has(task.id);
      const isOpen = opened === task.id;
      card.hidden = filter === 'done' && !isDone;
      card.classList.toggle('is-open', isOpen);
      card.classList.toggle('is-done', isDone);
      $('.task-button', card).setAttribute('aria-expanded', String(isOpen));
      $('.task-detail', card).hidden = !isOpen;
      $('.task-icon', card).textContent = isDone ? '✓' : task.icon;
      $('.task-subtitle', card).textContent = isDone ? '確認済み / CHECKED' : task.subtitle;
      const complete = $('.complete-button', card);
      complete.textContent = isDone ? '✓ 確認済み' : '確認済みにする';
      complete.disabled = isDone;
    });
    $('#done-count').textContent = done.size;
    $('#empty-state').hidden = filter !== 'done' || done.size > 0;
    $('#undo').hidden = lastCompleted === null;
    $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  }
  function changeFilter(next) {
    filter = next;
    opened = null;
    updateTasks();
    $('#demo-status').textContent = next === 'all' ? 'すべてのアイデアを表示しています' : `確認済みのアイデアは${done.size}件です`;
    animateChange(list);
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => changeFilter(button.dataset.filter)));
  $('#show-all').addEventListener('click', () => { changeFilter('all'); $('#filter-all').focus(); });
  $('#undo').addEventListener('click', () => {
    if (!lastCompleted) return;
    const task = tasks.find(item => item.id === lastCompleted);
    done.delete(lastCompleted);
    lastCompleted = null;
    $('#filter-all').focus();
    changeFilter('all');
    $('#demo-status').textContent = `「${task.title}」を未確認に戻しました`;
  });
  $('#reset').addEventListener('click', () => {
    done.clear(); opened = null; lastCompleted = null; filter = 'all';
    updateTasks();
    $('#demo-status').textContent = 'サンプルを最初の状態に戻しました';
  });
  applyPreference();
  drawReel();
  updateTasks();
})();
