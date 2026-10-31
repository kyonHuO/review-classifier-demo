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

let qty = 1,
  color = "ember";
const colors = {
  ember: ["Ember / エンバー", "エンバー", "#b94a22", "#f7b273", "#692512"],
  silver: ["Silver / シルバー", "シルバー", "#a3a8a2", "#f4f1de", "#525b56"],
  forest: [
    "Forest / フォレスト",
    "フォレスト",
    "#31564b",
    "#8fac8a",
    "#102f2c",
  ],
};
function productStatus() {
  $("#product-status").textContent =
    colors[color][1] + " / " + qty + "本を表示しています。";
}
$$("[data-color]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-color]");
    color = b.dataset.color;
    const c = colors[color];
    $("#color-name").textContent = c[0];
    ["--metal", "--light", "--dark"].forEach((p, i) =>
      $(".bottle").style.setProperty(p, c[i + 2]),
    );
    $(".bottle-stage").setAttribute(
      "aria-label",
      c[1] + "色のステンレスボトルのプロダクトスタディ",
    );
    productStatus();
  }),
);
$$("[data-qty]").forEach((b) =>
  b.addEventListener("click", () => {
    qty = Math.max(1, Math.min(9, qty + Number(b.dataset.qty)));
    $("#quantity").textContent = qty;
    $("#order-total").textContent = "¥" + (4800 * qty).toLocaleString("ja-JP");
    productStatus();
  }),
);
$("#explode").addEventListener("click", () => {
  const open = $(".bottle-stage").classList.toggle("exploded");
  $("#explode").setAttribute("aria-pressed", String(open));
  $("#explode").textContent = open ? "元に戻す −" : "構造を見る ＋";
});
