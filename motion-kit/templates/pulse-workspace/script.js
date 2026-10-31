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

const tasks = $$("[data-task]");
function updateTasks() {
  const n = tasks.filter(
    (b) => b.getAttribute("aria-pressed") === "true",
  ).length;
  $("#completion").innerHTML = n * 25 + "<span>%</span>";
  $("#done-count").textContent = n + " / 4";
  $(".progress-ring").style.setProperty("--progress", n * 25);
  $(".progress-ring").setAttribute("aria-label", "4件中" + n + "件完了");
  $("#task-status").textContent = n + "件完了。残り" + (4 - n) + "件です。";
  tasks.forEach((b) => {
    const done = b.getAttribute("aria-pressed") === "true";
    b.classList.toggle("is-done", done);
    $(".task-check", b).textContent = done ? "✓" : "＋";
  });
  feedback($(".progress-ring"));
}
tasks.forEach((b) =>
  b.addEventListener("click", () => {
    b.setAttribute(
      "aria-pressed",
      String(b.getAttribute("aria-pressed") !== "true"),
    );
    updateTasks();
  }),
);
$("#reset-tasks").addEventListener("click", () => {
  tasks.forEach((b, i) => b.setAttribute("aria-pressed", String(i === 3)));
  updateTasks();
});
$$("[data-billing]").forEach((b) =>
  b.addEventListener("click", () => {
    selectButton(b, "[data-billing]");
    $$("[data-month]").forEach(
      (p) =>
        (p.textContent =
          b.dataset.billing === "year" ? p.dataset.year : p.dataset.month),
    );
    $("#billing-note").textContent =
      b.dataset.billing === "year"
        ? "年払い・月額換算 / 税込サンプル"
        : "税込サンプル / 1人・月あたり";
  }),
);
