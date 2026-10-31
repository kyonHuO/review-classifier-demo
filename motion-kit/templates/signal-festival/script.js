"use strict";
// Local demonstration only: no submission, checkout, tracking or persistence.
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const menu = $(".menu"),
  nav = $(".site-nav");
function closeMenu() {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    menu.focus();
  }
});
matchMedia("(min-width:641px)").addEventListener("change", closeMenu);
const dialog = $("dialog");
let opener;
$$("[data-demo]").forEach((b) =>
  b.addEventListener("click", () => {
    opener = b;
    $("#demo-title").textContent = b.dataset.demo;
    $(".status", dialog).textContent = "";
    dialog.showModal();
  }),
);
function closeDialog() {
  dialog.close();
  opener?.focus();
}
$(".close", dialog).addEventListener("click", closeDialog);
dialog.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeDialog();
});
$("[data-confirm]", dialog).addEventListener("click", () => {
  $(".status", dialog).textContent =
    "デモ操作を確認しました。送信・予約・注文・決済は発生していません。";
});
function selectButton(button, selector) {
  $$(selector).forEach((b) =>
    b.setAttribute("aria-pressed", String(b === button)),
  );
}
// Brief action feedback only. Never starts an automatic or perpetual animation.
function feedback(element) {
  if (!element.animate) return;
  element.animate([{ opacity: 0.55 }, { opacity: 1 }], {
    duration: reduce.matches ? 120 : 180,
    easing: "ease-out",
  });
}
reduce.addEventListener("change", () => {
  if (reduce.matches && document.getAnimations)
    document.getAnimations().forEach((a) => a.cancel());
});

function randomSeed(seed = 71) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function canvasScene(selector, draw) {
  const c = $(selector);
  if (!c) return () => {};
  let ctx;
  try {
    ctx = c.getContext("2d");
  } catch (e) {
    return () => {};
  }
  if (!ctx) return () => {};
  let queued = false;
  function render() {
    queued = false;
    const r = c.parentElement.getBoundingClientRect(),
      dpr = Math.min(devicePixelRatio || 1, 1.5);
    if (!r.width || !r.height) return;
    c.width = Math.round(r.width * dpr);
    c.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, r.width, r.height);
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  }
  if ("ResizeObserver" in window)
    new ResizeObserver(schedule).observe(c.parentElement);
  else window.addEventListener("resize", schedule);
  schedule();
  return render;
}

let frequency = 120;
const paintWave = canvasScene("#waveform", (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
  const x = w * 0.5,
    y = h * 0.5,
    r = Math.min(w, h) * 0.43;
  for (let j = 0; j < 46; j++) {
    ctx.beginPath();
    for (let i = 0; i <= 500; i++) {
      const a = (i / 500) * Math.PI * 2;
      const rad =
        r * (0.55 + j * 0.009) +
        Math.sin(a * (frequency / 24) + j * 0.15) * r * 0.07 +
        Math.sin(a * 3 + j * 0.06) * r * 0.06;
      const px = x + Math.cos(a) * rad,
        py = y + Math.sin(a) * rad * 0.85;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = j % 5 === 0 ? "#f3ff9a99" : "#f3ff9a33";
    ctx.lineWidth = j % 5 === 0 ? 1 : 0.6;
    ctx.stroke();
  }
  ctx.strokeStyle = "#f3ff9a44";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x - r - 20, y);
  ctx.lineTo(x + r + 20, y);
  ctx.moveTo(x, y - r);
  ctx.lineTo(x, y + r);
  ctx.stroke();
});
$("#frequency").addEventListener("input", (e) => {
  frequency = Number(e.target.value);
  $("#frequency-output").textContent = frequency;
  paintWave();
});
const days = {
  one: [
    [
      "11:00",
      "境界をひらくデザイン",
      "形になる前のアイデアを、どこから拾う？",
      "水野 なつ / デザイナー",
      "Main",
    ],
    [
      "13:30",
      "音のない場所を聴く",
      "環境と身体の、まだ知らない関係。",
      "田辺 凪 / サウンドアーティスト",
      "Main",
    ],
    [
      "15:00",
      "つくる道具を、つくる",
      "プロトタイプから始める、新しい手触り。",
      "小野 海 / クリエイティブエンジニア",
      "Lab",
    ],
    [
      "17:00",
      "交差点のセッション",
      "今日出会った問いを、持ち寄って。",
      "登壇者によるクロストーク",
      "Main",
    ],
  ],
  two: [
    [
      "11:00",
      "見えないもののかたち",
      "データの向こうにある、私たちの感覚。",
      "瀬戸 玲 / ビジュアルアーティスト",
      "Main",
    ],
    [
      "13:30",
      "街の余白で遊ぶ",
      "場所に隠れた可能性を、ひらく。",
      "原 みち / 空間デザイナー",
      "Lab",
    ],
    [
      "15:00",
      "まだない楽器を鳴らす",
      "素材とコードで、音の入り口を探す。",
      "石井 楽 / 楽器作家",
      "Lab",
    ],
    [
      "17:00",
      "次の周波数へ",
      "2日間の問いを、明日につなぐ。",
      "クロージングセッション",
      "Main",
    ],
  ],
};
function showDay(key) {
  $("#program-list").replaceChildren(
    ...days[key].map(([time, title, desc, speaker, stage]) => {
      const a = document.createElement("article");
      a.className = "program-row";
      const t = document.createElement("time");
      t.textContent = time;
      const box = document.createElement("div"),
        heading = document.createElement("h3"),
        p = document.createElement("p");
      heading.textContent = title;
      p.textContent = desc;
      box.append(heading, p);
      const sp = document.createElement("span");
      sp.className = "speaker";
      sp.textContent = speaker;
      const st = document.createElement("span");
      st.className = "stage-name";
      st.textContent = stage;
      a.append(t, box, sp, st);
      return a;
    }),
  );
  $("#day-status").textContent =
    key === "one" ? "Day 1 / 境界をひらく" : "Day 2 / 次の周波数へ";
}
$$("[data-day]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-day]");
    showDay(b.dataset.day);
    feedback($("#program-list"));
  }),
);
showDay("one");
