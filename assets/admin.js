/* ARENAS Grill · Bar — panel privado de precios (Supabase). */
(function () {
  var config = window.ARENAS_CONFIG || {};
  var menu = window.ARENAS_MENU;
  var pricing = window.ArenasPricing;
  var app = document.getElementById("app");
  var savebar = document.getElementById("savebar");
  var statusEl = document.getElementById("status");
  var saveBtn = document.getElementById("save");
  var logoutBtn = document.getElementById("logout");
  var whoEl = document.getElementById("who");

  var STORE = "arenas_admin_session";
  var base = String(config.supabaseUrl || "").replace(/\/$/, "");
  var anon = config.supabaseAnonKey || "";
  var session = null;
  var dirty = false;

  /* ---------- utilidades ---------- */

  function money(value) {
    if (value === null || value === undefined) return "";
    return String(Math.round(value * 100) / 100);
  }

  function setStatus(text, kind) {
    statusEl.textContent = text || "";
    statusEl.className = "savebar__status" + (kind ? " is-" + kind : "");
  }

  function notice(html) {
    var box = document.createElement("p");
    box.className = "notice";
    box.innerHTML = html;
    return box;
  }

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "null");
    } catch (error) {
      return null;
    }
  }

  function saveSession(next) {
    session = next;
    if (next) localStorage.setItem(STORE, JSON.stringify(next));
    else localStorage.removeItem(STORE);
  }

  /* ---------- auth (Supabase GoTrue) ---------- */

  function authRequest(path, body) {
    return fetch(base + "/auth/v1/" + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: anon },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          throw new Error(data.error_description || data.msg || data.error || "No se pudo iniciar sesión.");
        }
        return data;
      });
    });
  }

  function toSession(data) {
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + (data.expires_in || 3600) * 1000,
      email: (data.user && data.user.email) || ""
    };
  }

  function signIn(email, password) {
    return authRequest("token?grant_type=password", { email: email, password: password }).then(function (data) {
      var next = toSession(data);
      saveSession(next);
      return next;
    });
  }

  function refresh() {
    if (!session || !session.refresh_token) return Promise.reject(new Error("Sesión expirada."));
    return authRequest("token?grant_type=refresh_token", { refresh_token: session.refresh_token }).then(function (data) {
      var next = toSession(data);
      saveSession(next);
      return next;
    });
  }

  function signOut() {
    saveSession(null);
    renderLogin();
  }

  function withAuth() {
    if (session && session.expires_at - 60000 > Date.now()) return Promise.resolve(session);
    return refresh();
  }

  function rest(path, options) {
    options = options || {};
    return withAuth().then(function (current) {
      return fetch(base + "/rest/v1/" + path, {
        method: options.method || "GET",
        headers: {
          apikey: anon,
          Authorization: "Bearer " + current.access_token,
          "Content-Type": "application/json",
          Prefer: options.prefer || "return=minimal"
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      }).then(function (res) {
        if (res.status === 401) {
          saveSession(null);
          throw new Error("La sesión expiró. Vuelve a entrar.");
        }
        if (!res.ok) {
          return res.text().then(function (text) {
            throw new Error("Error de Supabase (" + res.status + "): " + text.slice(0, 160));
          });
        }
        return options.method && options.method !== "GET" ? null : res.json();
      });
    });
  }

  /* ---------- vista: login ---------- */

  function renderLogin(message) {
    savebar.hidden = true;
    whoEl.textContent = "";
    logoutBtn.hidden = true;
    app.innerHTML = "";

    var box = document.createElement("form");
    box.className = "login";
    box.innerHTML =
      "<h1>Panel de precios</h1>" +
      "<p>Acceso exclusivo del dueño. Aquí cambias los precios y el menú público se actualiza al instante en todos los teléfonos.</p>" +
      '<label class="field"><span>Correo</span><input type="email" name="email" autocomplete="username" required></label>' +
      '<label class="field"><span>Contraseña</span><input type="password" name="password" autocomplete="current-password" required></label>' +
      '<button class="btn btn--primary" type="submit">Entrar</button>';

    if (message) box.appendChild(notice(message));

    box.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = box.querySelector("button");
      var email = box.querySelector('[name="email"]').value.trim();
      var password = box.querySelector('[name="password"]').value;
      button.disabled = true;
      button.textContent = "Entrando…";
      signIn(email, password)
        .then(function () {
          renderPanel();
        })
        .catch(function (error) {
          button.disabled = false;
          button.textContent = "Entrar";
          var old = box.querySelector(".notice");
          if (old) old.remove();
          box.appendChild(notice(error.message));
        });
    });

    app.appendChild(box);
  }

  /* ---------- vista: panel ---------- */

  function buildRow(section, item, overrides) {
    var key = pricing.key(section.id, item);
    var override = overrides[key];
    var livePrice = override && override.price !== null && override.price !== undefined ? override.price : item.price;
    var liveOptions = item.options;
    if (override && Array.isArray(override.options) && override.options.length) liveOptions = override.options;

    var row = document.createElement("div");
    row.className = "row";
    row.setAttribute("data-key", key);

    var name = document.createElement("div");
    name.className = "row__name";
    name.innerHTML = item.name + (item.sizeLabel ? " <em>" + item.sizeLabel + "</em>" : "");
    row.appendChild(name);

    var priceWrap = document.createElement("label");
    priceWrap.className = "row__price";
    var priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.step = "0.01";
    priceInput.min = "0";
    priceInput.inputMode = "decimal";
    priceInput.value = money(livePrice);
    priceInput.setAttribute("data-field", "price");
    priceInput.addEventListener("input", markDirty);
    priceWrap.appendChild(priceInput);
    row.appendChild(priceWrap);

    if (liveOptions && liveOptions.length) {
      var opts = document.createElement("div");
      opts.className = "row__opts";
      liveOptions.forEach(function (option) {
        var label = document.createElement("label");
        label.className = "row__opt";
        label.appendChild(document.createTextNode(option.label));
        var input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.min = "0";
        input.inputMode = "decimal";
        input.value = money(option.price);
        input.setAttribute("data-opt", option.label);
        input.addEventListener("input", markDirty);
        label.appendChild(input);
        opts.appendChild(label);
      });
      row.appendChild(opts);
    }

    return row;
  }

  function markDirty() {
    dirty = true;
    setStatus("Cambios sin guardar");
  }

  function renderPanel() {
    whoEl.textContent = session && session.email ? session.email : "";
    logoutBtn.hidden = false;
    savebar.hidden = false;
    setStatus("Cargando precios…");

    rest("menu_prices?select=key,price,options")
      .then(function (rows) {
        var overrides = {};
        (rows || []).forEach(function (row) {
          overrides[row.key] = row;
        });
        paint(overrides);
        dirty = false;
        setStatus("Precios actuales cargados");
      })
      .catch(function (error) {
        if (!session) return renderLogin(error.message);
        paint({});
        dirty = false;
        setStatus("No se pudieron leer los precios guardados. " + error.message, "error");
      });
  }

  function renderAccount() {
    var box = document.createElement("section");
    box.className = "panel";
    box.innerHTML =
      "<h2>Cuenta<small>" + (session && session.email ? session.email : "") + "</small></h2>" +
      '<div class="account">' +
        '<label class="field"><span>Nueva contraseña</span>' +
          '<input type="password" id="new-pass" autocomplete="new-password" minlength="8" placeholder="Mínimo 8 caracteres"></label>' +
        '<button class="btn btn--primary" id="change-pass" type="button">Cambiar contraseña</button>' +
      "</div>";

    var input = box.querySelector("#new-pass");
    var button = box.querySelector("#change-pass");

    button.addEventListener("click", function () {
      var value = input.value;
      if (value.length < 8) {
        setStatus("La contraseña debe tener al menos 8 caracteres.", "error");
        return;
      }
      button.disabled = true;
      setStatus("Guardando contraseña…");
      withAuth()
        .then(function (current) {
          return fetch(base + "/auth/v1/user", {
            method: "PUT",
            headers: {
              apikey: anon,
              Authorization: "Bearer " + current.access_token,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: value })
          });
        })
        .then(function (res) {
          if (!res.ok) throw new Error("No se pudo cambiar (" + res.status + ").");
          input.value = "";
          setStatus("Contraseña actualizada.", "ok");
        })
        .catch(function (error) {
          setStatus(error.message, "error");
        })
        .then(function () {
          button.disabled = false;
        });
    });

    app.appendChild(box);
  }

  function paint(overrides) {
    app.innerHTML = "";

    menu.sections.forEach(function (section) {
      var panel = document.createElement("section");
      panel.className = "panel";

      var head = document.createElement("h2");
      head.innerHTML = section.title + "<small>" + section.items.length + " platos</small>";
      panel.appendChild(head);

      section.items.forEach(function (item) {
        panel.appendChild(buildRow(section, item, overrides));
      });

      app.appendChild(panel);
    });

    renderAccount();
  }

  function collect() {
    var rows = [];
    Array.prototype.forEach.call(app.querySelectorAll(".row"), function (row) {
      var priceInput = row.querySelector('[data-field="price"]');
      var optionInputs = row.querySelectorAll("[data-opt]");
      var payload = {
        key: row.getAttribute("data-key"),
        price: priceInput.value === "" ? null : Number(priceInput.value),
        options: null
      };
      if (optionInputs.length) {
        payload.options = Array.prototype.map.call(optionInputs, function (input) {
          return { label: input.getAttribute("data-opt"), price: input.value === "" ? null : Number(input.value) };
        });
      }
      rows.push(payload);
    });
    return rows;
  }

  function save() {
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando…";
    setStatus("");
    rest("menu_prices?on_conflict=key", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: collect()
    })
      .then(function () {
        dirty = false;
        setStatus("Guardado. El menú público ya muestra estos precios.", "ok");
      })
      .catch(function (error) {
        setStatus(error.message, "error");
      })
      .then(function () {
        saveBtn.disabled = false;
        saveBtn.textContent = "Guardar cambios";
      });
  }

  /* ---------- arranque ---------- */

  saveBtn.addEventListener("click", save);
  logoutBtn.addEventListener("click", signOut);
  window.addEventListener("beforeunload", function (event) {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  if (!base || !anon) {
    app.appendChild(notice("Falta conectar Supabase: abre <code>assets/config.js</code> y completa <code>supabaseUrl</code> y <code>supabaseAnonKey</code>."));
    return;
  }

  session = loadSession();
  if (session) {
    renderPanel();
  } else {
    renderLogin();
  }
})();
