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

function layoutHomes(kind) {
  $$("[data-home]").forEach((p) => (p.hidden = p.dataset.home !== kind));
  $(".home-stage").classList.toggle("two", kind === "two");
  $("#plan-name").textContent =
    kind === "two" ? "庭につながる家" : "窓辺のある暮らし";
  $("#plan-area").textContent = kind === "two" ? "67.2㎡" : "48.6㎡";
  $("#plan-type").textContent =
    kind === "two" ? "2LDK / 南東向き" : "1LDK / 南向き";
  $("#home-status").textContent =
    (kind === "two" ? "2LDK" : "1LDK") + "のサンプルを2件表示しています。";
  feedback($(".floorplan"));
}
$$("[data-layout]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-layout]");
    layoutHomes(b.dataset.layout);
  }),
);
layoutHomes("one");
$$(".save-home").forEach((b) =>
  b.addEventListener("click", () => {
    const saved = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(saved));
    b.textContent = saved ? "♥" : "♡";
    const name = $("h3", b.closest(".property")).textContent;
    b.setAttribute(
      "aria-label",
      name + (saved ? "をお気に入りから削除" : "をお気に入りに追加"),
    );
    $("#save-status").textContent =
      name +
      (saved
        ? "をこのページ内のお気に入りに追加しました。"
        : "をお気に入りから外しました。");
  }),
);
