(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    query = new URLSearchParams(location.search),
    mq = matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = mq.matches || query.get("reduce") === "1",
    anim = null,
    opener = null;
  function motion() {
    reduce = mq.matches || query.get("reduce") === "1";
    document.documentElement.dataset.reduce = String(reduce);
    if (anim) anim.cancel();
  }
  mq.addEventListener("change", motion);
  motion();
  function flash(el) {
    if (anim) anim.cancel();
    anim = el.animate([{ opacity: 0.5 }, { opacity: 1 }], {
      duration: reduce ? 120 : 300,
      easing: "ease-out",
    });
    if (query.has("t")) {
      anim.pause();
      anim.currentTime = Number(query.get("t")) * 1000;
    }
  }
  function openModal(title, body, trigger) {
    opener = trigger;
    $("#modal-title").textContent = title;
    $("#modal-body").textContent = body;
    $("#modal").showModal();
  }
  const dialog = $("#modal");
  $("#modal-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    if (opener) opener.focus();
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  function canvasSize(el) {
    let c;
    try {
      c = el.getContext("2d");
    } catch {}
    if (!c) return null;
    const r = el.getBoundingClientRect(),
      d = Math.min(devicePixelRatio || 1, 2);
    el.width = r.width * d;
    el.height = r.height * d;
    c.scale(d, d);
    return { c, w: r.width, h: r.height };
  }
  let text = "永",
    weight = 700,
    spacing = -2;
  function update() {
    const shown = text.trim() || "字",
      preview = $("#type-preview"),
      stage = $("#letter-display"),
      fontSize = innerWidth < 600 ? 280 : 500;
    preview.textContent = shown;
    preview.style.fontSize = fontSize + "px";
    preview.style.fontWeight = weight;
    preview.style.letterSpacing = spacing / 100 + "em";
    const range = document.createRange();
    range.selectNodeContents(preview);
    const textRect = range.getBoundingClientRect(),
      stageRect = stage.getBoundingClientRect(),
      ratio = Math.min(
        1,
        (stageRect.width - 18) / Math.max(1, textRect.width),
        (stageRect.height - 16) /
          Math.max(1, preview.getBoundingClientRect().height),
      );
    preview.style.fontSize = Math.max(10, fontSize * ratio) + "px";
    $("#weight-large").textContent = weight;
    $("#weight-output").value = weight;
    const sp = (spacing / 100).toFixed(2) + " em";
    $("#spacing-large").textContent = sp;
    $("#spacing-output").value = sp;
    $("#type-status").textContent =
      "「" + shown + "」を太さ" + weight + "、字間" + sp + "で表示しています。";
    $$("[data-text]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.text === text)),
    );
  }
  $("#specimen-text").addEventListener("input", (e) => {
    text = e.target.value;
    update();
  });
  $("#weight").addEventListener("input", (e) => {
    weight = Number(e.target.value);
    update();
  });
  $("#spacing").addEventListener("input", (e) => {
    spacing = Number(e.target.value);
    update();
  });
  $$("[data-text],[data-sample]").forEach((b) =>
    b.addEventListener("click", () => {
      text = b.dataset.text || b.dataset.sample;
      $("#specimen-text").value = text;
      update();
      flash($("#type-preview"));
    }),
  );
  const cssArea = document.createElement("textarea");
  cssArea.className = "css-output";
  cssArea.readOnly = true;
  cssArea.setAttribute("aria-label", "現在の文字設定のCSS");
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "copy-button";
  copyButton.textContent = "CSSをコピー";
  const copyStatus = document.createElement("p");
  copyStatus.id = "copy-status";
  copyStatus.setAttribute("aria-live", "polite");
  dialog.append(cssArea, copyButton, copyStatus);
  $("#show-css").addEventListener("click", (e) => {
    cssArea.value =
      'font-family: "Yu Gothic", "Arial Black", sans-serif;\nfont-weight: ' +
      weight +
      ";\nletter-spacing: " +
      (spacing / 100).toFixed(2) +
      "em;";
    copyStatus.textContent = "選択して手動コピーもできます。";
    openModal(
      "文字設定のCSS",
      "端末のシステムフォントを利用します。字形は環境で異なります。",
      e.currentTarget,
    );
  });
  copyButton.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("manual");
      await navigator.clipboard.writeText(cssArea.value);
      copyStatus.textContent = "CSSをコピーしました。";
    } catch {
      cssArea.focus();
      cssArea.select();
      copyStatus.textContent =
        "CSSを選択しました。Ctrl+Cまたは端末のコピー操作でコピーしてください。";
    }
  });
  addEventListener("resize", update);
  update();
  window.__ready = true;
})();
