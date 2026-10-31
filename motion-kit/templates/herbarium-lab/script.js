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
  const specimens = [
    {
      code: "A.031",
      name: "木陰の長葉",
      type: "羽状脈 / なめらかな葉縁",
      vein: "羽状脈",
      note: "光を受けとめる面を、静かに広げる。",
      length: "18.4",
      place: "木陰に沿って伸びる",
      base: 72,
    },
    {
      code: "B.014",
      name: "日向の若葉",
      type: "羽状脈 / 細かな鋸歯",
      vein: "羽状脈",
      note: "細かな縁が、日差しの輪郭を刻む。",
      length: "12.6",
      place: "日向で小さく開く",
      base: 85,
    },
    {
      code: "C.008",
      name: "水辺の広葉",
      type: "網状脈 / 幅広い葉身",
      vein: "網状脈",
      note: "広い葉面に、水辺の光が残る。",
      length: "21.2",
      place: "水辺に大きく広がる",
      base: 68,
    },
  ];
  let active = 0,
    light = 65;
  function update() {
    const s = specimens[active];
    $("#specimen-number").textContent = s.code;
    $("#sheet-code").textContent = s.code;
    $("#leaf-name").textContent = s.name;
    $("#leaf-type").textContent = s.type;
    $("#leaf-note").textContent = s.note;
    $("#leaf-length").innerHTML = s.length + " <small>cm</small>";
    $("#leaf-vein").textContent = s.vein;
    $("#leaf-index").innerHTML =
      Math.round((s.base * light) / 65) + " <small>sample</small>";
    $("#leaf-place").textContent = s.place;
    $("#light-output").value = light + "%";
    $("#main-leaf").src = "assets/leaf-" + (active + 1) + ".png";
    $("#main-leaf").alt = s.name + "の自作葉脈標本";
    $("#main-leaf").style.filter =
      "brightness(" +
      (0.55 + (light / 100) * 0.7) +
      ") drop-shadow(3px 5px 2px #284c3922)";
    $("#leaf-status").textContent =
      s.name + "、観察光" + light + "%を表示しています。";
    $$("[data-leaf]").forEach((b) =>
      b.setAttribute("aria-pressed", String(Number(b.dataset.leaf) === active)),
    );
  }
  $$("[data-leaf]").forEach((b) =>
    b.addEventListener("click", () => {
      active = Number(b.dataset.leaf);
      update();
      flash($("#main-leaf"));
    }),
  );
  $("#light").addEventListener("input", (e) => {
    light = Number(e.target.value);
    update();
  });
  const enlarged = document.createElement("img");
  enlarged.className = "enlarged-leaf";
  enlarged.src = "assets/leaf-1.png";
  enlarged.alt = "木陰の長葉の葉脈拡大";
  dialog.append(enlarged);
  $("#enlarge").addEventListener("click", (e) => {
    const s = specimens[active];
    enlarged.src = "assets/leaf-" + (active + 1) + ".png";
    enlarged.alt = s.name + "の葉脈拡大";
    openModal(
      s.name + " / 葉脈観察",
      s.type + "。長さ " + s.length + " cm。" + s.note + " 架空の標本です。",
      e.currentTarget,
    );
  });
  update();
  window.__ready = true;
})();
