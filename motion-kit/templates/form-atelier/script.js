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

let project = "courtyard",
  view = "perspective";
const projects = {
  courtyard: ["中庭を囲む家", "住宅 / 長野 / 148㎡ / 2026"],
  library: ["小さなまちの書庫", "文化施設 / 群馬 / 312㎡ / 2025"],
  atelier: ["光を編むアトリエ", "アトリエ / 東京 / 86㎡ / 2025"],
};
function projectStatus() {
  $("#project-status").textContent =
    projects[project][0] + " / " + (view === "plan" ? "平面図" : "透視図");
}
$$("[data-project]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-project]");
    project = b.dataset.project;
    $(".model-stage").dataset.project = project;
    $("#project-name").textContent = projects[project][0];
    $("#project-meta").textContent = projects[project][1];
    $(".model-stage").setAttribute(
      "aria-label",
      projects[project][0] + "の建築スタディ模型",
    );
    projectStatus();
    feedback($(".architecture"));
  }),
);
$$("[data-view]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-view]");
    view = b.dataset.view;
    $(".model-stage").classList.toggle("plan", view === "plan");
    projectStatus();
  }),
);
