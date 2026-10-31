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

const rituals = {
  release: [
    "ボディトリートメント",
    "深く息をして、重さを手放す。",
    "背中から足先まで、温かなオイルでゆっくりと。呼吸のリズムに合わせて、こわばりをほどきます。",
    "90 min",
    "¥12,000",
    "release",
    "23deg",
  ],
  restore: [
    "フェイシャルトリートメント",
    "肌も、気持ちも、うるおう。",
    "やさしいタッチと保湿を中心に。乾燥が気になる肌に、ゆっくりと向き合う時間です。",
    "60 min",
    "¥9,000",
    "restore",
    "-12deg",
  ],
  reset: [
    "ヘッド＆ハンド",
    "考えることを、少し休む。",
    "頭から肩、手のひらまで。忙しい日々の合間に、静けさを取り戻す短いリチュアル。",
    "45 min",
    "¥6,500",
    "reset",
    "42deg",
  ],
};
$$("[data-ritual]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-ritual]");
    const r = rituals[b.dataset.ritual];
    [
      "#ritual-type",
      "#ritual-title",
      "#ritual-description",
      "#ritual-time",
      "#ritual-price",
      "#moon-word",
    ].forEach((s, i) => ($(s).textContent = r[i]));
    $(".moon-object").style.transform = "rotate(" + r[6] + ")";
    feedback($(".ritual-detail"));
  }),
);
