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

canvasScene("#fire", (ctx, w, h) => {
  const rnd = randomSeed(893);
  ctx.fillStyle = "#170e0b";
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(
    w * 0.66,
    h * 0.49,
    0,
    w * 0.6,
    h * 0.5,
    w * 0.58,
  );
  glow.addColorStop(0, "#9e3a17");
  glow.addColorStop(0.3, "#4d1d12");
  glow.addColorStop(1, "#170e0b");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 55; i++) {
    let x = w * (0.38 + rnd() * 0.5),
      y = h * (0.43 + rnd() * 0.15),
      height = h * (0.12 + rnd() * 0.33),
      bend = (rnd() - 0.5) * w * 0.18;
    let g = ctx.createLinearGradient(x, y, x + bend, y - height);
    g.addColorStop(0, "#ff9f3260");
    g.addColorStop(0.45, "#e8491633");
    g.addColorStop(1, "#ed3d1100");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - 15 - rnd() * 25, y);
    ctx.bezierCurveTo(
      x - 60,
      y - height * 0.4,
      x + bend + 70,
      y - height * 0.65,
      x + bend,
      y - height,
    );
    ctx.bezierCurveTo(
      x + bend + 20,
      y - height * 0.4,
      x + 35,
      y - height * 0.2,
      x + 20,
      y,
    );
    ctx.fill();
  }
  for (let i = 0; i < 500; i++) {
    const x = w * (0.15 + rnd() * 0.8),
      y = h * (0.14 + rnd() * 0.65);
    ctx.globalAlpha = rnd() * 0.75;
    ctx.fillStyle = i % 3 === 0 ? "#ffcd76" : "#f75d26";
    ctx.fillRect(x, y, 0.6 + rnd() * 1.7, 1 + rnd() * 3);
  }
  ctx.restore();
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.translate(w * 0.65, h * 0.6 + i * 8);
    ctx.rotate(-0.17 + i * 0.025);
    ctx.fillStyle = i % 2 ? "#200d08" : "#2e1009";
    ctx.fillRect(-w * 0.28, 0, w * 0.58, 12);
    ctx.strokeStyle = "#e25a2344";
    ctx.strokeRect(-w * 0.28, 0, w * 0.58, 12);
    ctx.restore();
  }
});
const courses = {
  season: {
    name: "季節のコース",
    price: "¥9,800",
    items: [
      ["はじまり", "焼き茄子のひとくち"],
      ["畑から", "根菜と焦がしバター"],
      ["海から", "本日の魚、炭の香り"],
      ["火のそばで", "薪焼き牛と季節の葉"],
      ["余韻", "焼きりんごとミルク"],
    ],
  },
  vegetable: {
    name: "畑のコース",
    price: "¥7,800",
    items: [
      ["はじまり", "蕪の温かいひと皿"],
      ["土の香り", "薪焼きビーツと胡桃"],
      ["畑から", "きのこと麦のリゾット"],
      ["火のそばで", "丸ごと焼いた根セロリ"],
      ["余韻", "洋梨とハーブのソルベ"],
    ],
  },
};
$$("[data-course]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-course]");
    const c = courses[b.dataset.course];
    $("#course-name").textContent = c.name;
    $("#course-price").textContent = c.price;
    $("#course-list").replaceChildren(
      ...c.items.map(([tag, text]) => {
        const li = document.createElement("li"),
          s = document.createElement("span");
        s.textContent = tag;
        li.append(s, document.createTextNode(" " + text));
        return li;
      }),
    );
    $("#course-status").textContent = c.name + " / 5皿 / 約120分";
    feedback($(".course-panel"));
  }),
);
