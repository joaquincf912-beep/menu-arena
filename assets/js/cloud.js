/* =========================================================
   ARENAS GRILL & BAR — Sincronización con Supabase
   Guarda el menú completo en la tabla menu_prices usando la
   clave reservada __menu_state__. La lectura es pública; la
   escritura requiere sesión autenticada del dueño.
   ========================================================= */
(function () {
  "use strict";

  var config = window.ARENAS_CONFIG || {};
  var base = String(config.supabaseUrl || "").replace(/\/$/, "");
  var anon = String(config.supabaseAnonKey || "");
  var SESSION_KEY = "arenas.cloud.session";
  var MENU_KEY = "__menu_state__";

  function enabled() {
    return Boolean(base && anon);
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch (err) {
      return null;
    }
  }

  var session = readSession();

  function saveSession(next) {
    session = next;
    try {
      if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      else localStorage.removeItem(SESSION_KEY);
    } catch (err) {
      /* almacenamiento no disponible */
    }
  }

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
    var current = session;
    saveSession(null);
    if (current && current.access_token) {
      fetch(base + "/auth/v1/logout", {
        method: "POST",
        headers: { apikey: anon, Authorization: "Bearer " + current.access_token }
      }).catch(function () {});
    }
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
            throw new Error("Supabase (" + res.status + "): " + text.slice(0, 160));
          });
        }
        return options.method && options.method !== "GET" ? null : res.json();
      });
    });
  }

  function load() {
    if (!enabled()) return Promise.resolve(null);
    var url =
      base +
      "/rest/v1/menu_prices?key=eq." +
      encodeURIComponent(MENU_KEY) +
      "&select=options,updated_at&limit=1";
    return fetch(url, { headers: { apikey: anon } })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows) || !rows.length) return null;
        var row = rows[0];
        var data = row.options && row.options.state ? row.options.state : null;
        if (!data || !data.business || !Array.isArray(data.products)) return null;
        return { state: data, updatedAt: row.updated_at || "" };
      })
      .catch(function () {
        return null;
      });
  }

  function save(state) {
    if (!enabled()) return Promise.reject(new Error("Supabase no está configurado."));
    return rest("menu_prices?on_conflict=key", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: [{ key: MENU_KEY, price: null, options: { state: state } }]
    });
  }

  window.ArenasCloud = {
    enabled: enabled,
    load: load,
    save: save,
    signIn: signIn,
    signOut: signOut,
    session: function () {
      return session;
    }
  };
})();
