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

const works = {
  loop: [
    "Soft loop",
    "途切れない線を、柔らかなかたまりへ。連続する輪の、光と影の実験。",
    "Form study / Continuous loop",
    "連続する輪でできた、紫の螺旋彫刻",
  ],
  fold: [
    "Paper, almost",
    "折ることで生まれる強さと、開くことで見える軽さ。紙のような、紙ではない形。",
    "Material study / Folded planes",
    "黄緑色の面が折り重なる、紙のような彫刻",
  ],
  pebble: [
    "Quiet company",
    "机のすみに、そっと置く。石のように自然で、少しだけ不思議な三つのかたち。",
    "Object study / Desk companions",
    "三つのなめらかな石を重ねた彫刻",
  ],
};
$$("[data-work]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-work]");
    const k = b.dataset.work,
      w = works[k];
    $$(".sculpture").forEach(
      (s) => (s.hidden = !s.classList.contains("sculpt-" + k)),
    );
    $("#work-title").textContent = w[0];
    $("#work-description").textContent = w[1];
    $("#sculpture-material").textContent = w[2];
    $(".sculpture-stage").setAttribute("aria-label", w[3]);
    $("#work-detail").dataset.demo = w[0] + "の作品詳細デモ";
    $("#work-status").textContent = w[0] + "を展示しています。";
    feedback($(".sculpt-" + k));
  }),
);
