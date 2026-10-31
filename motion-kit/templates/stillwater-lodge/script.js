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

let light = "morning";
const paintLandscape = canvasScene("#landscape", (ctx, w, h) => {
  const rnd = randomSeed(313);
  const eve = light === "evening";
  let g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, eve ? "#30435d" : "#6c959c");
  g.addColorStop(0.45, eve ? "#e6a484" : "#c1d5bf");
  g.addColorStop(0.55, eve ? "#8a8f8b" : "#608f91");
  g.addColorStop(1, "#102f35");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = eve ? "#f5c79e" : "#eaf1cf";
  ctx.beginPath();
  ctx.arc(w * 0.72, h * 0.32, h * 0.048, 0, Math.PI * 2);
  ctx.fill();
  for (let k = 0; k < 7; k++) {
    const base = h * (0.38 + k * 0.025),
      amp = h * (0.11 + k * 0.004);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.56);
    for (let x = 0; x <= w + 6; x += 6) {
      const yy =
        base +
        Math.sin((x / w) * 8 + k * 0.9) * amp +
        Math.sin((x / w) * 24 + k * 1.8) * amp * 0.2 +
        Math.sin((x / w) * 60 + k) * amp * 0.07;
      ctx.lineTo(x, yy);
    }
    ctx.lineTo(w, h * 0.58);
    ctx.closePath();
    ctx.fillStyle = [
      "#9badac",
      "#8daba3",
      "#7a9995",
      "#628785",
      "#4c7471",
      "#355e5a",
      "#214f4a",
    ][k];
    ctx.fill();
  }
  for (let i = 0; i < 360; i++) {
    const y = h * (0.55 + rnd() * 0.45),
      len = rnd() * w * 0.12;
    ctx.fillStyle = i % 3 === 0 ? "#d7ddd133" : "#7faba623";
    ctx.fillRect(rnd() * w, y, len, 0.4 + rnd() * 1.1);
  }
  ctx.fillStyle = "#173e37";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  ctx.bezierCurveTo(w * 0.11, h * 0.66, w * 0.12, h * 0.88, w * 0.3, h);
  ctx.lineTo(0, h);
  ctx.fill();
  for (let i = 0; i < 90; i++) {
    const x = rnd() * w * 0.18,
      y = h * (0.54 + rnd() * 0.3),
      sz = 14 + rnd() * 35;
    ctx.fillStyle = i % 2 ? "#214b3c" : "#173e33";
    ctx.beginPath();
    ctx.moveTo(x, y - sz);
    ctx.lineTo(x - sz * 0.24, y + sz * 0.2);
    ctx.lineTo(x + sz * 0.24, y + sz * 0.2);
    ctx.fill();
  }
  ctx.fillStyle = "#112c28";
  ctx.fillRect(w * 0.3, h * 0.66, w * 0.03, h * 0.025);
  ctx.beginPath();
  ctx.moveTo(w * 0.295, h * 0.66);
  ctx.lineTo(w * 0.315, h * 0.645);
  ctx.lineTo(w * 0.335, h * 0.66);
  ctx.fill();
});
$$("[data-light]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-light]");
    light = b.dataset.light;
    paintLandscape();
    $("#light-status").textContent =
      light === "morning" ? "朝の光 / 06:30" : "夕の光 / 17:40";
  }),
);
const lodges = {
  lake: [
    "Lake cabin",
    "朝の光が水面から届く、湖畔の一棟。大きな窓とデッキが、外の時間を部屋の中へ。",
    "42㎡ / 1〜2名",
    "¥32,000",
  ],
  forest: [
    "Forest cabin",
    "木立の向こうに湖を望む、森の一棟。読書のための椅子と、小さな薪ストーブを。",
    "56㎡ / 2〜4名",
    "¥42,000",
  ],
};
$$("[data-lodge]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-lodge]");
    const l = lodges[b.dataset.lodge];
    [
      "#lodge-name",
      "#lodge-description",
      "#lodge-size",
      "#lodge-price",
    ].forEach((s, i) => ($(s).textContent = l[i]));
    $("#lodge-status").textContent = l[0] + "を表示しています。";
    $(".cabin").style.transform =
      b.dataset.lodge === "forest"
        ? "rotateY(18deg) rotateX(8deg)"
        : "rotateY(-18deg) rotateX(8deg)";
    feedback($(".stay-info"));
  }),
);
