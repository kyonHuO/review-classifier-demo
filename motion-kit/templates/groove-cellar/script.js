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
  const records = [
    {
      title: "Subsurface",
      artist: "Haru Sequence",
      genre: "電子",
      tracks: ["水面下", "Echo in a room", "帰り道の信号"],
    },
    {
      title: "Amber Rooms",
      artist: "Fumio Kado",
      genre: "ジャズ",
      tracks: ["窓辺のアンバー", "Night Window", "午後4時の余白"],
    },
    {
      title: "Tide Memory",
      artist: "Slow Habitat",
      genre: "環境",
      tracks: ["海を待つ", "Low water", "消えない波紋"],
    },
  ];
  let selected = 0;
  $$("[data-filter]").forEach((b) =>
    b.addEventListener("click", () => {
      let count = 0;
      $$("[data-filter]").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b)),
      );
      $$("[data-record]").forEach((x) => {
        x.hidden =
          b.dataset.filter !== "all" && x.dataset.genre !== b.dataset.filter;
        if (!x.hidden) count++;
      });
      $("#shelf-status").textContent = count + "枚のレコードを表示しています。";
    }),
  );
  $$("[data-record]").forEach((b) =>
    b.addEventListener("click", () => {
      selected = Number(b.dataset.record);
      const r = records[selected];
      $("#record-title").textContent = r.title;
      $("#disc-title").textContent = r.title;
      $("#artist").textContent = r.artist;
      $("#genre-label").textContent = r.genre + " / 2026";
      $("#main-cover").src = "assets/cover-" + (selected + 1) + ".jpg";
      $("#main-cover").alt = r.title + "のオリジナル抽象ジャケット";
      $("#tracks").replaceChildren(
        ...r.tracks.map((t) => {
          const li = document.createElement("li");
          li.textContent = t;
          return li;
        }),
      );
      $$("[data-record]").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b)),
      );
      $("#shelf-status").textContent =
        r.title + "を選びました。上の盤面と曲目を更新しました。";
      flash($("#main-cover"));
    }),
  );
  $("#preview").addEventListener("click", (e) => {
    const r = records[selected];
    openModal(
      r.title,
      r.artist +
        " / " +
        r.tracks.map((t, i) => i + 1 + ". " + t).join("、") +
        "。音源再生は行わない曲目プレビューです。",
      e.currentTarget,
    );
  });
  window.__ready = true;
})();
