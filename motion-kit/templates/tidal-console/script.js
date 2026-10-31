(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    mq = matchMedia("(prefers-reduced-motion: reduce)"),
    params = new URLSearchParams(location.search);
  let reduce = mq.matches || params.get("reduce") === "1",
    animation = null,
    station = 0,
    depth = 120,
    scans = 1;
  const data = [
    { name: "北の浅瀬", code: "ST–021", temp: 18.4, salt: 34.8, clarity: 24 },
    { name: "海溝の縁", code: "ST–054", temp: 8.2, salt: 35.1, clarity: 16 },
    { name: "外洋の丘", code: "ST–089", temp: 14.7, salt: 34.5, clarity: 31 },
  ];
  function motionPreference() {
    reduce = mq.matches || params.get("reduce") === "1";
    document.documentElement.dataset.reduce = String(reduce);
    if (animation) animation.cancel();
  }
  mq.addEventListener("change", motionPreference);
  motionPreference();
  function setupCanvas(canvas) {
    let ctx = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {}
    if (!ctx) return null;
    const r = canvas.getBoundingClientRect(),
      dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.scale(dpr, dpr);
    return { ctx, w: r.width, h: r.height };
  }
  function draw() {
    const surface = setupCanvas($("#terrain"));
    if (surface) {
      $(".canvas-fallback").hidden = true;
      const { ctx: c, w, h } = surface;
      const cx = w * 0.51,
        cy = h * 0.43,
        r = Math.min(w * 0.4, h * 0.43);
      c.clearRect(0, 0, w, h);
      c.strokeStyle = "#54846b";
      c.lineWidth = 0.6;
      for (let j = 0; j < 5; j++) {
        c.beginPath();
        c.arc(cx, cy, r + j * 7, 0, Math.PI * 2);
        c.stroke();
      }
      for (let n = 0; n < 96; n++) {
        const a = (n * Math.PI) / 48,
          len = n % 8 === 0 ? 12 : 5;
        c.beginPath();
        c.moveTo(cx + Math.cos(a) * (r + 29), cy + Math.sin(a) * (r + 29));
        c.lineTo(
          cx + Math.cos(a) * (r + 29 - len),
          cy + Math.sin(a) * (r + 29 - len),
        );
        c.stroke();
      }
      c.strokeStyle = "#719a8355";
      for (let x = 0; x < w; x += 30) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, h);
        c.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(w, y);
        c.stroke();
      }
      const phase = station * 1.3 + scans * 0.1;
      for (let row = 51; row >= 0; row--) {
        c.beginPath();
        for (let n = 0; n <= 95; n++) {
          const u = n / 95,
            v = row / 51,
            x = w * 0.02 + u * w * 0.93 + (v - 0.5) * w * 0.08;
          const ridge =
            Math.sin(u * 7 + phase) * Math.cos(v * 3.5 + u * 2) +
            Math.sin(u * 14 - v * 5 + phase) * 0.22;
          const peak = Math.exp(-((u - 0.58) ** 2 * 25 + (v - 0.48) ** 2 * 5));
          const y =
            h * 0.79 -
            v * h * 0.46 -
            ridge * (16 + depth * 0.1) -
            peak * depth * 0.24;
          c.lineTo(x, y);
        }
        c.strokeStyle = row % 5 === 0 ? "#123f32cc" : "#3a705a88";
        c.lineWidth = row % 5 === 0 ? 1.2 : 0.55;
        c.stroke();
      }
      for (let row = 0; row < 36; row++) {
        for (let n = 0; n < 54; n++) {
          const u = n / 53,
            v = row / 35,
            x = w * 0.02 + u * w * 0.93 + (v - 0.5) * w * 0.08,
            ridge =
              Math.sin(u * 7 + phase) * Math.cos(v * 3.5 + u * 2) +
              Math.sin(u * 14 - v * 5 + phase) * 0.22,
            peak = Math.exp(-((u - 0.58) ** 2 * 25 + (v - 0.48) ** 2 * 5)),
            y =
              h * 0.79 -
              v * h * 0.46 -
              ridge * (16 + depth * 0.1) -
              peak * depth * 0.24;
          c.fillStyle = (n + row) % 7 === 0 ? "#e4eee4" : "#326449";
          c.fillRect(x, y, 1.25, 1.25);
        }
      }
      c.strokeStyle = "#d95643";
      c.lineWidth = 1;
      c.setLineDash([3, 5]);
      c.beginPath();
      c.moveTo(cx, cy - 40);
      c.lineTo(cx, h * 0.88);
      c.stroke();
      c.setLineDash([]);
      c.fillStyle = "#d95643";
      c.beginPath();
      c.arc(cx, h * 0.64 - depth * 0.16, 4, 0, Math.PI * 2);
      c.fill();
    }
    const wave = setupCanvas($("#wave"));
    if (wave) {
      const { ctx: c, w, h } = wave;
      c.clearRect(0, 0, w, h);
      c.strokeStyle = "#63917d55";
      for (let y = 12; y < h; y += 14) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(w, y);
        c.stroke();
      }
      c.strokeStyle = "#214e3c";
      c.lineWidth = 1;
      c.beginPath();
      for (let x = 0; x < w; x++) {
        const y =
          h * 0.5 +
          Math.sin(x * 0.12 + station) * 8 +
          Math.sin(x * 0.33 + scans) * 5 +
          Math.sin(x * 0.035) * depth * 0.035;
        c.lineTo(x, y);
      }
      c.stroke();
    }
  }
  function feedback() {
    if (animation) animation.cancel();
    animation = $("#terrain").animate([{ opacity: 0.5 }, { opacity: 1 }], {
      duration: reduce ? 120 : 240,
      easing: "ease-out",
    });
    if (params.has("t")) {
      animation.pause();
      animation.currentTime = Number(params.get("t")) * 1000;
    }
  }
  function update(announce = true) {
    const d = data[station];
    $("#station-name").textContent = d.name;
    $("#station-code").textContent = d.code + " / 地形投影";
    $("#depth-number").innerHTML = depth + "<small>m</small>";
    $("#depth-output").value = depth + " m";
    $("#temp").textContent = (d.temp - (depth - 120) * 0.018).toFixed(1);
    $("#salt").textContent = (d.salt + (depth - 120) * 0.001).toFixed(1);
    $("#clarity").textContent = d.clarity;
    $("#scan-count").textContent = "取得回数 " + String(scans).padStart(3, "0");
    $("#terrain").setAttribute(
      "aria-label",
      d.name + "の海底地形。観測深度" + depth + "メートル。",
    );
    if (announce)
      $("#status").textContent =
        d.name + "を観測中。深度" + depth + " mの水塊を表示しています。";
    document
      .querySelectorAll("[data-station]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(Number(b.dataset.station) === station),
        ),
      );
    draw();
  }
  document.querySelectorAll("[data-station]").forEach((b) =>
    b.addEventListener("click", () => {
      station = Number(b.dataset.station);
      update();
      if (animation) animation.cancel();
      animation = $("#terrain").animate([{ opacity: 0.65 }, { opacity: 1 }], {
        duration: reduce ? 120 : 240,
        easing: "ease-out",
      });
      if (params.has("t")) {
        animation.pause();
        animation.currentTime = Number(params.get("t")) * 1000;
      }
    }),
  );
  $("#depth").addEventListener("input", (e) => {
    depth = Number(e.target.value);
    update();
  });
  $("#scan").addEventListener("click", () => {
    scans++;
    update();
    feedback();
    $("#status").textContent =
      data[station].name + "の再走査を完了しました。取得回数" + scans + "。";
  });
  const dialog = $("#record");
  $("#details").addEventListener("click", () => {
    $("#record-title").textContent = data[station].name;
    $("#record-body").textContent =
      "深度 " +
      depth +
      " m、水温 " +
      $("#temp").textContent +
      " °C、塩分 " +
      $("#salt").textContent +
      " PSU。" +
      scans +
      "回の地形走査から、この水塊の輪郭を記録しました。";
    dialog.showModal();
  });
  $("#close-record").addEventListener("click", () => dialog.close());
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
  dialog.addEventListener("close", () => $("#details").focus());
  new ResizeObserver(() => draw()).observe($(".scope"));
  update(false);
  window.__ready = true;
})();
