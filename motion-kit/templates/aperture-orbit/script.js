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
  const lenses = [
    {
      name: "Convex / 凸面レンズ",
      note: "光を一点に集める、基本のかたち。",
      hue: 205,
      base: 94,
    },
    {
      name: "Biconvex / 両凸レンズ",
      note: "ふたつの曲面で、光の向きを整える。",
      hue: 250,
      base: 92,
    },
    {
      name: "Meniscus / 三日月レンズ",
      note: "曲率の差が、光の表情を変える。",
      hue: 160,
      base: 93,
    },
    {
      name: "Achromat / 色消しレンズ",
      note: "異なる色の光を、近い場所へ。",
      hue: 40,
      base: 90,
    },
    {
      name: "Aspheric / 非球面レンズ",
      note: "球面から少し離れた、精密な輪郭。",
      hue: 290,
      base: 95,
    },
    {
      name: "Planar / 平面レンズ",
      note: "境界を通り抜ける光を観測する。",
      hue: 320,
      base: 97,
    },
    {
      name: "Concave / 凹面レンズ",
      note: "広がる光の、その先を想像する。",
      hue: 180,
      base: 92,
    },
    {
      name: "Doublet / 接合レンズ",
      note: "ふたつの素材で、ひとつの焦点へ。",
      hue: 80,
      base: 89,
    },
    {
      name: "Fresnel / 輪帯レンズ",
      note: "薄い輪に分けて、光を集める。",
      hue: 230,
      base: 88,
    },
  ];
  let active = 0,
    wavelength = 580,
    focus = 62;
  function rayColor() {
    const hue =
      wavelength < 440
        ? 270
        : wavelength < 490
          ? 230
          : wavelength < 530
            ? 150
            : wavelength < 590
              ? 55
              : wavelength < 640
                ? 25
                : 5;
    return "hsl(" + hue + " 75% 67%)";
  }
  function draw() {
    const s = canvasSize($("#rays"));
    if (!s) return;
    const { c, w, h } = s;
    c.clearRect(0, 0, w, h);
    const mid = w * 0.43,
      end = w * (0.67 + (focus / 100) * 0.27),
      center = h * 0.5;
    c.strokeStyle = rayColor();
    c.lineWidth = 1.5;
    c.shadowBlur = 6;
    c.shadowColor = rayColor();
    for (let i = -1; i <= 1; i++) {
      const y = center + i * h * 0.19;
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(mid, y);
      c.lineTo(end, active === 6 ? center + i * h * 0.31 : center);
      c.lineTo(
        w,
        active === 6
          ? center + i * h * 0.4
          : center - ((w - end) / (end - mid)) * (y - center),
      );
      c.stroke();
    }
    c.shadowBlur = 0;
    c.fillStyle = "#ee725c";
    c.beginPath();
    c.arc(end, center, 5, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#ee725c66";
    c.setLineDash([4, 6]);
    c.beginPath();
    c.moveTo(end, center - 65);
    c.lineTo(end, center + 65);
    c.stroke();
    c.setLineDash([]);
  }
  function update() {
    const l = lenses[active],
      code = "F–" + String(active + 1).padStart(2, "0");
    $("#lens-title").textContent = l.name;
    $("#lens-code").textContent = code;
    $("#lens-note").textContent = l.note;
    $("#major-lens>span").textContent = "APERTURE / " + code;
    $("#focal-distance").innerHTML = focus + " <small>mm</small>";
    $("#wavelength-output").value = wavelength + " nm";
    $("#focus-output").value = focus + " mm";
    $("#transmission").innerHTML =
      (l.base - Math.abs(wavelength - 580) * 0.008).toFixed(1) +
      " <small>%</small>";
    $("#optics-status").textContent =
      code +
      "、波長" +
      wavelength +
      " nm、焦点距離" +
      focus +
      " mmを表示しています。";
    document.documentElement.style.setProperty("--lens-hue", l.hue + "deg");
    $("#rays").setAttribute(
      "aria-label",
      l.name +
        "の簡略光路。波長" +
        wavelength +
        "nm、焦点距離" +
        focus +
        "mm。",
    );
    $$("[data-lens]").forEach((b) =>
      b.setAttribute("aria-pressed", String(Number(b.dataset.lens) === active)),
    );
    draw();
  }
  function overview() {
    const chosen = $('[data-lens="' + active + '"]');
    $(".optics-stage").classList.remove("focused");
    $("#overview").hidden = true;
    draw();
    chosen.focus();
  }
  $$("[data-lens]").forEach((b) =>
    b.addEventListener("click", () => {
      active = Number(b.dataset.lens);
      $(".optics-stage").classList.add("focused");
      $("#overview").hidden = false;
      update();
      flash($("#major-lens"));
    }),
  );
  $("#overview").addEventListener("click", overview);
  addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      !dialog.open &&
      $(".optics-stage").classList.contains("focused")
    )
      overview();
  });
  $("#wavelength").addEventListener("input", (e) => {
    wavelength = Number(e.target.value);
    update();
  });
  $("#focus").addEventListener("input", (e) => {
    focus = Number(e.target.value);
    update();
  });
  $("#optics-details").addEventListener("click", (e) =>
    openModal(
      $("#lens-code").textContent + " / 光学観測票",
      lenses[active].name +
        "。" +
        $("#optics-status").textContent +
        " 透過率" +
        $("#transmission").textContent +
        "。体験用の簡略モデルで、実測値ではありません。",
      e.currentTarget,
    ),
  );
  new ResizeObserver(draw).observe($(".optical-art"));
  update();
  window.__ready = true;
})();
