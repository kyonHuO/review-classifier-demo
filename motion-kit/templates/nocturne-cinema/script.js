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
  const films = [
    {
      title: "波の眠る場所",
      genre: "風景の記録",
      mins: 94,
      desc: "誰もいない海辺で、一人の録音技師が失われた音を探す。",
      credit: "監督：水野 透 / 架空作品",
      time: ["19:20", "14:10"],
    },
    {
      title: "砂丘の向こう",
      genre: "境界の旅",
      mins: 108,
      desc: "古い地図を手にした二人が、砂の町に残る約束をたどる。",
      credit: "監督：野原 玲 / 架空作品",
      time: ["20:10", "16:20"],
    },
    {
      title: "月の裏の手紙",
      genre: "夜の寓話",
      mins: 86,
      desc: "届くはずのない手紙が、眠らない街の窓を一つずつ灯す。",
      credit: "監督：遠野 朱 / 架空作品",
      time: ["18:40", "19:00"],
    },
  ];
  let film = 0,
    day = 0;
  function update() {
    const f = films[film];
    $("#film-title").textContent = f.title;
    $("#film-description").textContent = f.desc;
    $("#film-credit").textContent = f.credit;
    $("#film-genre").textContent = f.genre + " / " + f.mins + "分";
    $("#film-image").src = "assets/film-" + (film + 1) + ".jpg";
    $("#film-image").alt = f.title + "のオリジナル風景";
    $("#film-number").textContent = "0" + (film + 1);
    $("#show-time").textContent = f.time[day];
    const [hh, mm] = f.time[day].split(":").map(Number),
      end = hh * 60 + mm + f.mins;
    $("#show-end").textContent =
      "終映 " + Math.floor(end / 60) + ":" + String(end % 60).padStart(2, "0");
    $("#cinema-status").textContent =
      "10/" +
      (30 + day) +
      "「" +
      f.title +
      "」" +
      f.time[day] +
      "の回を表示しています。";
    $$("[data-film]").forEach((b) =>
      b.setAttribute("aria-pressed", String(Number(b.dataset.film) === film)),
    );
    $$("[data-day]").forEach((b) =>
      b.setAttribute("aria-pressed", String(Number(b.dataset.day) === day)),
    );
  }
  $$("[data-film]").forEach((b) =>
    b.addEventListener("click", () => {
      film = Number(b.dataset.film);
      update();
      flash($("#film-image"));
    }),
  );
  $$("[data-day]").forEach((b) =>
    b.addEventListener("click", () => {
      day = Number(b.dataset.day);
      update();
    }),
  );
  const seatWrap = document.createElement("div");
  seatWrap.innerHTML =
    '<div class="seat-screen">スクリーン / 座席プレビュー</div><div class="seat-grid"></div><p id="seat-status" aria-live="polite">座席を選ぶとここに表示されます。予約は行われません。</p>';
  dialog.append(seatWrap);
  for (let n = 0; n < 18; n++) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = String.fromCharCode(65 + Math.floor(n / 6)) + ((n % 6) + 1);
    b.dataset.seat = b.textContent;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      $$("[data-seat]").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b)),
      );
      $("#seat-status").textContent =
        "座席 " +
        b.dataset.seat +
        " をプレビュー中。予約・決済は行われません。";
    });
    $(".seat-grid").append(b);
  }
  $("#seats").addEventListener("click", (e) => {
    $$("[data-seat]").forEach((x) => x.setAttribute("aria-pressed", "false"));
    $("#seat-status").textContent =
      "座席を選ぶとここに表示されます。予約は行われません。";
    openModal(
      films[film].title,
      "10/" +
        (30 + day) +
        " " +
        films[film].time[day] +
        "の上映。座席を選んで、画面との距離を想像してみてください。",
      e.currentTarget,
    );
  });
  update();
  window.__ready = true;
})();
