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
  const sizes = [
      { name: "S", reach: 369, stack: 531, weight: 1220, min: 155, max: 168 },
      { name: "M", reach: 382, stack: 554, weight: 1280, min: 168, max: 180 },
      { name: "L", reach: 397, stack: 578, weight: 1350, min: 180, max: 193 },
    ],
    colors = [
      { name: "深青", hex: "#183056" },
      { name: "朱色", hex: "#f04e28" },
      { name: "白銀", hex: "#d8ddd8" },
    ];
  let size = 1,
    color = 0,
    height = 172;
  function update() {
    const s = sizes[size],
      recommended =
        height < sizes[0].min || height > sizes[2].max
          ? null
          : height < 168
            ? "S"
            : height < 180
              ? "M"
              : "L";
    $("#reach-display").textContent = "Reach " + s.reach + " mm";
    $("#stack-display").textContent = "Stack " + s.stack + " mm";
    $("#weight").innerHTML = s.weight.toLocaleString() + " <small>g</small>";
    $("#fit-range").innerHTML = s.min + "–" + s.max + " <small>cm</small>";
    $("#height-output").value = height + " cm";
    $("#fit-status").textContent =
      height +
      " cmでは" +
      (recommended
        ? recommended + "が推奨範囲です。"
        : "サンプル適合範囲外のため、推奨サイズはありません。") +
      "選択サイズ：" +
      s.name +
      "。" +
      (height >= s.min && height <= s.max
        ? "選択サイズのサンプル範囲内です。"
        : recommended
          ? "サンプル範囲から外れています。推奨サイズを確認してください。"
          : "選択サイズのサンプル範囲外です。");
    document.documentElement.style.setProperty("--frame", colors[color].hex);
    $$("[data-size]").forEach((b) =>
      b.setAttribute("aria-pressed", String(Number(b.dataset.size) === size)),
    );
    $$("[data-color]").forEach((b) =>
      b.setAttribute("aria-pressed", String(Number(b.dataset.color) === color)),
    );
    $(".bike").setAttribute(
      "aria-label",
      s.name +
        "サイズ、" +
        colors[color].name +
        "の自転車設計図。リーチ" +
        s.reach +
        "mm、スタック" +
        s.stack +
        "mm。",
    );
    $(".frame").style.transform =
      "scaleX(" + (size === 0 ? 0.97 : size === 2 ? 1.03 : 1) + ")";
  }
  $$("[data-size]").forEach((b) =>
    b.addEventListener("click", () => {
      size = Number(b.dataset.size);
      update();
      flash($(".bike"));
    }),
  );
  $$("[data-color]").forEach((b) =>
    b.addEventListener("click", () => {
      color = Number(b.dataset.color);
      update();
      flash($(".frame"));
    }),
  );
  $("#height").addEventListener("input", (e) => {
    height = Number(e.target.value);
    update();
  });
  $("#specification").addEventListener("click", (e) => {
    const s = sizes[size];
    openModal(
      "R–01 / " + s.name + " / " + colors[color].name,
      "リーチ " +
        s.reach +
        " mm、スタック " +
        s.stack +
        " mm、フレーム重量 " +
        s.weight +
        " g。身長サンプル " +
        height +
        " cm。架空の仕様プレビューで、注文や実車フィッティングは行いません。",
      e.currentTarget,
    );
  });
  update();
  window.__ready = true;
})();
