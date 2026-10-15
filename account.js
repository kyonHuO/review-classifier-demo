(function () {
  "use strict";

  var API = "/api/auth";
  var PREVIEW_KEY = "np_preview_user";
  var params = new URLSearchParams(location.search);
  var preview = params.get("preview") === "1";

  function el(id) {
    return document.getElementById(id);
  }

  function setStatus(node, message, state) {
    if (!node) return;
    node.textContent = message || "";
    if (state) node.setAttribute("data-state", state);
    else node.removeAttribute("data-state");
  }

  function request(path, options) {
    var opts = options || {};
    return fetch(API + path, {
      method: opts.method || "GET",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    }).then(function (res) {
      return res
        .json()
        .catch(function () {
          return {};
        })
        .then(function (data) {
          return { ok: res.ok, status: res.status, data: data };
        });
    });
  }

  function errorText(result) {
    if (result.data && result.data.error) return result.data.error;
    if (result.status === 404) return "サーバーに接続できません（API未接続）。";
    return "処理に失敗しました。時間をおいて再度お試しください。";
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function previewUser() {
    try {
      return JSON.parse(sessionStorage.getItem(PREVIEW_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setPreviewUser(user) {
    try {
      sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(user));
    } catch (e) {}
  }

  function clearPreviewUser() {
    try {
      sessionStorage.removeItem(PREVIEW_KEY);
    } catch (e) {}
  }

  /* ---- customer page (login / signup) ---- */

  function initTabs() {
    var tabLogin = el("tab-login");
    var tabSignup = el("tab-signup");
    var panelLogin = el("panel-login");
    var panelSignup = el("panel-signup");
    if (!tabLogin || !tabSignup) return;

    function select(which) {
      var isLogin = which === "login";
      tabLogin.setAttribute("aria-selected", String(isLogin));
      tabSignup.setAttribute("aria-selected", String(!isLogin));
      panelLogin.hidden = !isLogin;
      panelSignup.hidden = isLogin;
    }

    tabLogin.addEventListener("click", function () {
      select("login");
    });
    tabSignup.addEventListener("click", function () {
      select("signup");
    });
  }

  function initPasswordToggles() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-toggle]"),
      function (btn) {
        btn.addEventListener("click", function () {
          var input = el(btn.getAttribute("data-toggle"));
          if (!input) return;
          var show = input.type === "password";
          input.type = show ? "text" : "password";
          btn.textContent = show ? "隠す" : "表示";
          btn.setAttribute("aria-label", show ? "パスワードを隠す" : "パスワードを表示");
        });
      },
    );
  }

  function initLoginForm() {
    var form = el("login-form");
    if (!form) return;
    var status = el("login-status");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = el("login-email").value.trim();
      var password = el("login-password").value;

      if (!validEmail(email)) {
        setStatus(status, "メールアドレスの形式を確認してください。", "error");
        return;
      }
      if (!password) {
        setStatus(status, "パスワードを入力してください。", "error");
        return;
      }

      if (preview) {
        setPreviewUser({ email: email, name: email.split("@")[0], created_at: Date.now() });
        setStatus(status, "プレビューとしてログインしました。", "ok");
        location.href = "dashboard.html?preview=1";
        return;
      }

      setStatus(status, "ログインしています…", "info");
      request("/login", { method: "POST", body: { email: email, password: password } })
        .then(function (result) {
          if (!result.ok) {
            setStatus(status, errorText(result), "error");
            return;
          }
          location.href = "dashboard.html";
        })
        .catch(function () {
          setStatus(status, "サーバーに接続できませんでした。", "error");
        });
    });
  }

  function initSignupForm() {
    var form = el("signup-form");
    if (!form) return;
    var status = el("signup-status");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = el("signup-name").value.trim();
      var email = el("signup-email").value.trim();
      var password = el("signup-password").value;
      var password2 = el("signup-password2").value;

      if (!validEmail(email)) {
        setStatus(status, "メールアドレスの形式を確認してください。", "error");
        return;
      }
      if (password.length < 8) {
        setStatus(status, "パスワードは8文字以上にしてください。", "error");
        return;
      }
      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        setStatus(status, "パスワードは英字と数字を含めてください。", "error");
        return;
      }
      if (password !== password2) {
        setStatus(status, "パスワードが一致しません。", "error");
        return;
      }

      if (preview) {
        setPreviewUser({ email: email, name: name || email.split("@")[0], created_at: Date.now() });
        setStatus(status, "プレビューとして登録しました。", "ok");
        location.href = "dashboard.html?preview=1";
        return;
      }

      setStatus(status, "登録しています…", "info");
      request("/register", { method: "POST", body: { name: name, email: email, password: password } })
        .then(function (result) {
          if (!result.ok) {
            setStatus(status, errorText(result), "error");
            return;
          }
          location.href = "dashboard.html";
        })
        .catch(function () {
          setStatus(status, "サーバーに接続できませんでした。", "error");
        });
    });
  }

  /* ---- dashboard ---- */

  function formatDate(ms) {
    if (!ms) return "-";
    try {
      return new Date(ms).toLocaleDateString("ja-JP");
    } catch (e) {
      return "-";
    }
  }

  function renderDashboard(user) {
    if (el("dash-name")) el("dash-name").textContent = user.name || user.email || "お客様";
    if (el("dash-email")) el("dash-email").textContent = user.email || "-";
    if (el("dash-created")) el("dash-created").textContent = formatDate(user.created_at);
    var used = typeof user.used_today === "number" ? user.used_today : 0;
    var limit = typeof user.daily_limit === "number" ? user.daily_limit : 100;
    if (el("usage-text")) el("usage-text").textContent = used + " / " + limit + " 行（本日）";
    if (el("usage-bar")) el("usage-bar").style.width = Math.min(100, (used / limit) * 100) + "%";
  }

  function initDashboard() {
    var logout = el("logout-btn");
    if (logout) {
      logout.addEventListener("click", function () {
        clearPreviewUser();
        if (preview) {
          location.href = "customer.html";
          return;
        }
        request("/logout", { method: "POST" }).then(function () {
          location.href = "customer.html";
        });
      });
    }

    if (preview) {
      var fallback = previewUser() || { email: "preview@example.com", name: "プレビュー", created_at: Date.now() };
      renderDashboard(fallback);
      return;
    }

    request("/me")
      .then(function (result) {
        if (!result.ok || !result.data.user) {
          location.href = "customer.html";
          return;
        }
        renderDashboard(result.data.user);
      })
      .catch(function () {
        location.href = "customer.html";
      });
  }

  /* ---- boot ---- */

  if (preview && el("preview-banner")) el("preview-banner").hidden = false;

  if (document.body.getAttribute("data-page") === "dashboard") {
    initDashboard();
  } else {
    initTabs();
    initPasswordToggles();
    initLoginForm();
    initSignupForm();
  }
})();
