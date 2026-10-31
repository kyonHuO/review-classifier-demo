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
  const issues = [
    {
      num: "07",
      name: "遠回り",
      title: ["遠回りの", "地図を描く。"],
      sub: "いつもの街を、知らない角度から。",
      articles: [
        "近道をやめた日のこと",
        "地図に載らない余白",
        "窓から、知らない方へ",
      ],
      color: "#f4f05e",
    },
    {
      num: "06",
      name: "境界線",
      title: ["境界線は、", "どこにある。"],
      sub: "となり合う、ふたつの世界のこと。",
      articles: [
        "窓と壁、そのあいだ",
        "線をひく人、越える人",
        "水平線の向こう側",
      ],
      color: "#ded7fb",
    },
    {
      num: "05",
      name: "余韻",
      title: ["去ったあとも、", "残るもの。"],
      sub: "記憶の端を、そっとたどる。",
      articles: ["音のない帰り道", "香りの記憶を編む", "おわりから、はじまる"],
      color: "#a7dbbd",
    },
  ];
  let active = 0;
  $$("[data-issue]").forEach((b) =>
    b.addEventListener("click", () => {
      active = Number(b.dataset.issue);
      const i = issues[active];
      $("#cover-number").textContent = "Vol. " + i.num;
      $("#cover-title").replaceChildren(
        document.createTextNode(i.title[0]),
        document.createElement("br"),
        document.createTextNode(i.title[1]),
      );
      $("#cover-subtitle").textContent = i.sub;
      $("#issue-cover").style.background = i.color;
      $("#contents-number").textContent = "Vol. " + i.num + " / 目次";
      i.articles.forEach((s, n) => ($("#article-" + n).textContent = s));
      $$("[data-issue]").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b)),
      );
      $("#issue-status").textContent =
        "第" + Number(i.num) + "号「" + i.name + "」の目次を表示しています。";
      flash($("#issue-cover"));
    }),
  );
  $$("[data-article]").forEach((b) =>
    b.addEventListener("click", (e) => {
      const i = issues[active],
        n = Number(b.dataset.article);
      openModal(
        i.articles[n],
        "目をとめなければ通り過ぎてしまう、小さな風景があります。" +
          i.sub +
          " 私たちは歩く速度を少しだけ落として、その輪郭を言葉にしてみました。これは第" +
          Number(i.num) +
          "号「" +
          i.name +
          "」の架空の記事サンプルです。",
        e.currentTarget,
      );
    }),
  );
  window.__ready = true;
})();
