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

let experiment = "shape",
  seed = 7;
const titles = {
  shape: "形を重ねる",
  color: "色の関係を見つける",
  layout: "余白を並べる",
};
const drawArt = canvasScene("#artwork", (ctx, w, h) => {
  const rnd = randomSeed(seed * 1423),
    palette = ["#2345d4", "#f7af48", "#ed6547", "#99b7db", "#263fa3"];
  ctx.fillStyle = "#f5f7f1";
  ctx.fillRect(0, 0, w, h);
  if (experiment === "shape") {
    for (let i = 0; i < 8; i++) {
      const x = w * (0.2 + rnd() * 0.6),
        y = h * (0.15 + rnd() * 0.7),
        r = w * (0.12 + rnd() * 0.2);
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.translate(x, y);
      ctx.rotate(rnd() * Math.PI);
      ctx.fillStyle = palette[i % palette.length];
      if (i % 3 === 0) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
      } else if (i % 3 === 1) {
        ctx.fillRect(-r, -r, r * 1.5, r * 1.5);
      } else {
        ctx.beginPath();
        ctx.moveTo(-r, r);
        ctx.lineTo(0, -r);
        ctx.lineTo(r, r);
        ctx.fill();
      }
      ctx.restore();
    }
  } else if (experiment === "color") {
    const gap = 8,
      cols = 4,
      rows = 5,
      sw = (w - gap * 5) / 4,
      sh = (h - gap * 6) / 5;
    for (let i = 0; i < 20; i++) {
      const col = i % 4,
        row = Math.floor(i / 4);
      ctx.fillStyle = palette[Math.floor(rnd() * palette.length)];
      ctx.fillRect(gap + col * (sw + gap), gap + row * (sh + gap), sw, sh);
      ctx.fillStyle = palette[(i + seed) % palette.length];
      ctx.beginPath();
      ctx.arc(
        gap + col * (sw + gap) + sw / 2,
        gap + row * (sh + gap) + sh / 2,
        Math.min(sw, sh) * 0.24,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  } else {
    ctx.fillStyle = "#2345d4";
    ctx.fillRect(w * 0.1, h * 0.08, w * 0.15, h * 0.7);
    ctx.fillStyle = "#f7af48";
    ctx.beginPath();
    ctx.arc(w * (0.45 + rnd() * 0.2), h * 0.35, w * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ed6547";
    ctx.fillRect(w * 0.35, h * 0.66, w * 0.55, h * 0.15);
    ctx.strokeStyle = "#2345d4";
    ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.33, h * (0.15 + i * 0.045));
      ctx.lineTo(w * 0.89, h * (0.15 + i * 0.045));
      ctx.stroke();
    }
  }
});
function studyStatus() {
  $("#experiment-label").textContent = titles[experiment];
  $("#seed-label").textContent = "Study #" + String(seed).padStart(2, "0");
  $("#art-status").textContent =
    titles[experiment] + " / " + $("#seed-label").textContent;
}
$$("[data-experiment]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-experiment]");
    experiment = b.dataset.experiment;
    drawArt();
    studyStatus();
  }),
);
$("#new-study").addEventListener("click", () => {
  seed++;
  drawArt();
  studyStatus();
});
const classes = {
  start: [
    "見る目を、つくる。",
    "身近な風景やものから、色、形、構図を発見する4週間。観察ノートと小さな作品をつくります。",
    "¥24,000",
    [
      ["Week 1", "観察ノートをひらく"],
      ["Week 2", "形を拾い集める"],
      ["Week 3", "色と構図を試す"],
      ["Week 4", "作品にして、話す"],
    ],
  ],
  practice: [
    "自分の表現を、深める。",
    "テーマをひとつ決めて、試作と講評を重ねる8週間。連作を編集し、ポートフォリオにまとめます。",
    "¥48,000",
    [
      ["Week 1–2", "テーマを見つける"],
      ["Week 3–4", "実験と試作を重ねる"],
      ["Week 5–6", "連作を編集する"],
      ["Week 7–8", "発表し、振り返る"],
    ],
  ],
};
function showClass(key) {
  const c = classes[key];
  ["#class-title", "#class-description", "#class-price"].forEach(
    (s, i) => ($(s).textContent = c[i]),
  );
  $("#week-list").replaceChildren(
    ...c[3].map(([week, title]) => {
      const li = document.createElement("li"),
        s = document.createElement("span"),
        b = document.createElement("b");
      s.textContent = week;
      b.textContent = title;
      li.append(s, b);
      return li;
    }),
  );
  $("#class-status").textContent =
    (key === "start" ? "はじめの4週間" : "深める8週間") + "を表示しています。";
}
$$("[data-class]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-class]");
    showClass(b.dataset.class);
    feedback($(".class-detail"));
  }),
);
showClass("start");
