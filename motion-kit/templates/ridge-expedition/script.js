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
  const routes = [
    {
      name: "雲上の稜線",
      distance: "12.8",
      hours: "6.5",
      start: 1680,
      end: 2860,
      desc: "尾根の起伏をたどり、空に近い展望地へ。",
      points: ["白樺ベース", "風の肩", "雲上の展望台"],
      path: [
        [0.33, 0.8],
        [0.42, 0.66],
        [0.47, 0.58],
        [0.53, 0.43],
        [0.65, 0.32],
        [0.7, 0.23],
      ],
    },
    {
      name: "静かな湖畔",
      distance: "8.4",
      hours: "3.5",
      start: 1540,
      end: 1920,
      desc: "山肌を回り込み、水の色を探す緩やかな道。",
      points: ["湖畔ベース", "青の入り江", "水鏡の丘"],
      path: [
        [0.27, 0.7],
        [0.4, 0.63],
        [0.55, 0.59],
        [0.64, 0.53],
        [0.68, 0.37],
        [0.6, 0.28],
      ],
    },
    {
      name: "東の岩稜",
      distance: "10.6",
      hours: "7.0",
      start: 1750,
      end: 3040,
      desc: "岩の輪郭を読みながら、東の高みを目指す道。",
      points: ["東の入口", "岩の回廊", "朝陽の峰"],
      path: [
        [0.38, 0.85],
        [0.49, 0.72],
        [0.58, 0.63],
        [0.7, 0.53],
        [0.73, 0.4],
        [0.78, 0.2],
      ],
    },
  ];
  let active = 0,
    progress = 0;
  function draw() {
    const s = canvasSize($("#route-map"));
    if (!s) return;
    const { c, w, h } = s;
    c.clearRect(0, 0, w, h);
    const r = routes[active];
    c.lineJoin = "round";
    c.strokeStyle = "#253b4b99";
    c.lineWidth = 9;
    c.beginPath();
    r.path.forEach((p) => c.lineTo(p[0] * w, p[1] * h));
    c.stroke();
    c.strokeStyle = "#ff632e";
    c.lineWidth = 4;
    c.setLineDash([10, 7]);
    c.stroke();
    c.setLineDash([]);
    r.path.forEach((p, i) => {
      c.fillStyle = "#d8e3e2";
      c.strokeStyle = "#253b4b";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(p[0] * w, p[1] * h, 5, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    });
    const loc = (progress / 100) * (r.path.length - 1),
      idx = Math.min(Math.floor(loc), r.path.length - 2),
      frac = loc - idx,
      a = r.path[idx],
      b = r.path[idx + 1],
      x = (a[0] + (b[0] - a[0]) * frac) * w,
      y = (a[1] + (b[1] - a[1]) * frac) * h;
    c.fillStyle = "#ff632e";
    c.beginPath();
    c.arc(x, y, 12, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#fff";
    c.lineWidth = 3;
    c.stroke();
  }
  function update() {
    const r = routes[active],
      idx = progress < 34 ? 0 : progress < 75 ? 1 : 2,
      alt = Math.round(r.start + ((r.end - r.start) * progress) / 100);
    $("#route-name").textContent = r.name;
    $("#distance").textContent = r.distance;
    $("#hours").textContent = r.hours;
    $("#route-description").textContent = r.desc;
    $("#point-altitude").innerHTML = alt.toLocaleString() + " <small>m</small>";
    $("#point-name").textContent = r.points[idx];
    $("#progress-label").textContent = progress + "% / " + r.points[idx];
    $("#route-status").textContent =
      r.name + "、" + progress + "%地点、標高" + alt + " mを表示しています。";
    $("#route-map").setAttribute(
      "aria-label",
      r.name + "の経路。現在" + progress + "%、標高" + alt + "メートル。",
    );
    $$("[data-route]").forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(Number(b.dataset.route) === active),
      ),
    );
    $("#waypoints").replaceChildren(
      ...r.points.map((name, i) => {
        const li = document.createElement("li"),
          label = document.createElement("span"),
          title = document.createElement("strong"),
          height = document.createElement("b");
        label.textContent = ["出発", "中間", "到着"][i];
        title.textContent = name;
        height.textContent =
          Math.round(r.start + ((r.end - r.start) * i) / 2).toLocaleString() +
          " m";
        li.append(label, title, height);
        return li;
      }),
    );
    draw();
  }
  $$("[data-route]").forEach((b) =>
    b.addEventListener("click", () => {
      active = Number(b.dataset.route);
      update();
      flash($("#route-map"));
    }),
  );
  $("#progress").addEventListener("input", (e) => {
    progress = Number(e.target.value);
    update();
  });
  $("#route-details").addEventListener("click", (e) => {
    const r = routes[active];
    openModal(
      r.name + " / 行程票",
      r.distance +
        " km、" +
        r.hours +
        "時間。" +
        r.points.join(" → ") +
        "。現在の進行は" +
        progress +
        "%。架空の遠征記録です。",
      e.currentTarget,
    );
  });
  new ResizeObserver(draw).observe($(".map-stage"));
  update();
  window.__ready = true;
})();
