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
  let level = 50;
  function draw() {
    const s = canvasSize($("#roast-curve"));
    if (!s) return;
    const { c, w, h } = s;
    c.clearRect(0, 0, w, h);
    c.font = "11px Arial";
    for (let i = 0; i < 5; i++) {
      const y = 25 + (i * (h - 45)) / 4;
      c.strokeStyle = "#a1774b55";
      c.beginPath();
      c.moveTo(30, y);
      c.lineTo(w, y);
      c.stroke();
      c.fillStyle = "#c49b6c";
      c.fillText(String(240 - i * 40), 0, y + 4);
    }
    c.strokeStyle = "#f5a25c";
    c.lineWidth = 3;
    c.beginPath();
    const end = (165 + level * 0.6 - 80) / 160;
    for (let n = 0; n <= 100; n++) {
      const t = n / 100,
        x = 30 + t * (w - 45),
        val =
          0.22 + ((end - 0.22) * (1 - Math.exp(-t * 3))) / (1 - Math.exp(-3)),
        y = h - 20 - val * (h - 45);
      c.lineTo(x, y);
    }
    c.stroke();
    c.fillStyle = "#f5a25c";
    c.beginPath();
    c.arc(w - 15, h - 20 - end * (h - 45), 6, 0, Math.PI * 2);
    c.fill();
  }
  function update() {
    const name = level < 34 ? "浅煎り" : level < 70 ? "中煎り" : "深煎り",
      temp = Math.round(165 + level * 0.6),
      seconds = 390 + level * 3.6,
      time =
        String(Math.floor(seconds / 60)).padStart(2, "0") +
        ":" +
        String(Math.round(seconds % 60)).padStart(2, "0"),
      acid = Math.round(90 - level * 0.8),
      sweet = Math.round(95 - Math.abs(level - 55) * 0.8),
      bitter = Math.round(10 + level * 0.7);
    $("#roast-name").textContent = name;
    $("#roast-english").textContent =
      level < 34 ? "Light roast" : level < 70 ? "Medium roast" : "Dark roast";
    $("#temperature").innerHTML = temp + "<small>°C</small>";
    $("#roast-time").textContent = "焙煎時間 " + time;
    $("#curve-end").textContent = temp + "°C / " + time;
    $("#roast-output").value = level + " / 100";
    $("#dial-pointer").style.transform =
      "rotate(" + (-210 + level * 2.4) + "deg)";
    $("#beans").style.filter =
      "brightness(" +
      (1.5 - level * 0.009) +
      ") drop-shadow(15px 25px 15px #25150d80)";
    [
      ["acidity", acid],
      ["sweetness", sweet],
      ["bitterness", bitter],
    ].forEach(([id, value]) => {
      $("#" + id).value = value;
      $("#" + id + "-bar").style.transform = "scaleX(" + value / 100 + ")";
    });
    $("#taste-title").replaceChildren(
      document.createTextNode(
        level < 34
          ? "明るい酸味と、"
          : level < 70
            ? "丸い甘さと、"
            : "深い苦味と、",
      ),
      document.createElement("br"),
      document.createTextNode(
        level < 34
          ? "軽やかな後味。"
          : level < 70
            ? "ほどよい余韻。"
            : "長く続く余韻。",
      ),
    );
    $("#roast-status").textContent =
      name + "、" + temp + "°C、" + time + "のサンプルを表示しています。";
    $$("[data-roast]").forEach((b) =>
      b.setAttribute("aria-pressed", String(Number(b.dataset.roast) === level)),
    );
    draw();
  }
  $("#roast-level").addEventListener("input", (e) => {
    level = Number(e.target.value);
    update();
  });
  $$("[data-roast]").forEach((b) =>
    b.addEventListener("click", () => {
      level = Number(b.dataset.roast);
      $("#roast-level").value = level;
      update();
      flash($(".dial-value"));
    }),
  );
  $("#save-roast").addEventListener("click", (e) =>
    openModal(
      "焙煎記録 / " + $("#roast-name").textContent,
      $("#roast-status").textContent +
        " 酸味" +
        $("#acidity").value +
        "、甘味" +
        $("#sweetness").value +
        "、苦味" +
        $("#bitterness").value +
        "。画面内の記録プレビューです。外部には保存されません。",
      e.currentTarget,
    ),
  );
  new ResizeObserver(draw).observe($(".curve"));
  update();
  window.__ready = true;
})();
