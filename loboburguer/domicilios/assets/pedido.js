/* Loboburguer Domicilios — pedido por WhatsApp.
   Carrito con cantidades, ingredientes a quitar, ubicación GPS del cliente
   y cierre de la venta en WhatsApp (sin pagos dentro del menú). */
(function () {
  "use strict";

  var cfg = ((window.LOBO_CONFIG || {}).delivery) || {};
  var WA = String(cfg.whatsapp || "").replace(/\D/g, "");
  var CURRENCY = (window.LOBO_MENU && window.LOBO_MENU.currency) || "$";
  var MIN = Number(cfg.minimum) > 0 ? Number(cfg.minimum) : 0;
  /* El envío ya no tiene tarifa fija: cambia con la distancia y la hora. */
  var FEE_NOTE = cfg.feeNote || "El envío se calcula según la distancia y la hora; te lo confirmamos por WhatsApp.";
  var ETA = cfg.timing || "35 a 50 minutos";
  var GREETING = cfg.greeting || "Hola, quiero hacer un pedido a domicilio";
  var PAY_CFG = cfg.payment || {};
  var PAYS = Array.isArray(PAY_CFG.methods) && PAY_CFG.methods.length ? PAY_CFG.methods.slice() : ["Pago móvil", "Efectivo"];
  var PAY_NOTES = PAY_CFG.notes || {};
  var STORE = "lobo_domicilio_v1";

  var esc = function (text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  var money = function (value) {
    if (value === null || value === undefined) return "A consultar";
    var n = Number(value);
    if (!isFinite(n)) return "A consultar";
    var text = (Math.round(n * 100) / 100).toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1")
      .replace(".", ",");
    return CURRENCY + text;
  };

  var cards = function () {
    return (window.LOBO_CARTA && window.LOBO_CARTA.catalog) || {};
  };

  var find = function (key) { return cards()[key] || null; };

  var waUrl = function (text) {
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
  };

  var chat = function (text) {
    window.open(waUrl(text), "_blank", "noopener");
  };

  /* ---------- estado ---------- */

  var state = {
    items: [],
    customer: {},
    gps: null,
    step: "cart",
    errors: {},
    sent: false
  };

  var draft = null;

  var save = function () {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        items: state.items,
        customer: state.customer,
        gps: state.gps
      }));
    } catch (e) {}
  };

  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && typeof saved === "object") {
      if (Array.isArray(saved.items)) {
        state.items = saved.items.filter(function (line) {
          return line && line.key && Number(line.qty) > 0 && find(line.key);
        }).map(function (line) {
          return {
            key: line.key,
            opt: line.opt || null,
            sin: Array.isArray(line.sin) ? line.sin : [],
            notes: line.notes || "",
            qty: Math.max(1, Number(line.qty) || 1)
          };
        });
      }
      if (saved.customer && typeof saved.customer === "object") state.customer = saved.customer;
      if (saved.gps && saved.gps.lat) state.gps = saved.gps;
    }
  } catch (e) {}

  var optPrice = function (item, label) {
    var value = null;
    (item.options || []).forEach(function (option) {
      if (option.label === label) {
        value = option.price === null || option.price === undefined ? null : Number(option.price);
      }
    });
    return value;
  };

  var linePrice = function (line) {
    var item = find(line.key);
    if (!item) return null;
    if (line.opt) return optPrice(item, line.opt);
    return item.price === null || item.price === undefined ? null : Number(item.price);
  };

  var totals = function () {
    var sub = 0;
    var unknown = false;
    state.items.forEach(function (line) {
      var price = linePrice(line);
      if (price === null) unknown = true;
      else sub += price * line.qty;
    });
    return { sub: sub, total: sub, unknown: unknown };
  };

  var signature = function (line) {
    return JSON.stringify([line.key, line.opt || null, line.sin || [], line.notes || ""]);
  };

  var pushLine = function (line) {
    var sig = signature(line);
    var found = null;
    state.items.forEach(function (l) { if (signature(l) === sig) found = l; });
    if (found) found.qty += Math.max(1, Number(line.qty) || 1);
    else {
      state.items.push({
        key: line.key,
        opt: line.opt || null,
        sin: (line.sin || []).slice(),
        notes: line.notes || "",
        qty: Math.max(1, Number(line.qty) || 1)
      });
    }
    state.sent = false;
    save();
    render();
    popTray();
  };

  /* ---------- estructura ---------- */

  var shell = document.createElement("div");
  shell.innerHTML =
    '<div class="tray" id="tray" hidden>' +
      '<button type="button" class="tray__main" data-open-cart>' +
        '<span class="tray__count">0</span>' +
        '<span class="tray__text"><b class="tray__label">Ver mi pedido</b><em>Domicilio</em></span>' +
        '<span class="tray__total">' + esc(CURRENCY) + '0</span>' +
      "</button>" +
    "</div>" +
    '<a class="wa-float" href="' + esc(waUrl(GREETING)) + '" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.02c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.05 8.05 0 0 1-1.24-4.28c0-4.49 3.65-8.14 8.14-8.14 4.49 0 8.14 3.65 8.14 8.14s-3.65 8.14-8.14 8.14z" fill="currentColor"/><path d="M17.5 14.38c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.79-.71-1.33-1.58-1.49-1.85-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26 0 1.33.97 2.62 1.1 2.8.14.18 1.9 3.03 4.61 4.13 2.7 1.1 2.7.73 3.19.68.49-.05 1.58-.64 1.8-1.27.22-.63.22-1.16.16-1.27-.07-.11-.25-.18-.52-.32z" fill="currentColor"/></svg>' +
    "</a>" +
    '<div class="ped" id="ped" hidden>' +
      '<div class="ped__veil" data-close></div>' +
      '<section class="ped__box" role="dialog" aria-modal="true" aria-labelledby="ped-title">' +
        '<header class="ped__head">' +
          '<button type="button" class="ped__back" data-back aria-label="Volver" hidden>←</button>' +
          "<div>" +
            '<p class="ped__eyebrow">Pedido a domicilio</p>' +
            '<h2 class="ped__title" id="ped-title">Tu pedido</h2>' +
          "</div>" +
          '<button type="button" class="ped__close" data-close aria-label="Cerrar">×</button>' +
        "</header>" +
        '<div class="ped__body" id="ped-body"></div>' +
        '<footer class="ped__foot" id="ped-foot"></footer>' +
      "</section>" +
    "</div>" +
    '<div class="ped ped--dish" id="dish" hidden>' +
      '<div class="ped__veil" data-dish-close></div>' +
      '<section class="ped__box ped__box--dish" role="dialog" aria-modal="true" aria-labelledby="dish-title">' +
        '<header class="ped__head ped__head--dish">' +
          "<div>" +
            '<p class="ped__eyebrow">Agregar a tu pedido</p>' +
            '<h2 class="ped__title" id="dish-title">Plato</h2>' +
            '<p class="ped__sub" id="dish-price"></p>' +
          "</div>" +
          '<button type="button" class="ped__close" data-dish-close aria-label="Cerrar">×</button>' +
        "</header>" +
        '<div class="ped__body" id="dish-body"></div>' +
        '<footer class="ped__foot" id="dish-foot"></footer>' +
      "</section>" +
    "</div>" +
    '<p class="ped__notice" id="notice" role="status" hidden></p>';

  document.body.appendChild(shell);

  var tray = document.getElementById("tray");
  var ped = document.getElementById("ped");
  var pedBody = document.getElementById("ped-body");
  var pedFoot = document.getElementById("ped-foot");
  var pedTitle = document.getElementById("ped-title");
  var back = ped.querySelector("[data-back]");
  var dish = document.getElementById("dish");
  var dishBody = document.getElementById("dish-body");
  var dishFoot = document.getElementById("dish-foot");
  var dishTitle = document.getElementById("dish-title");
  var dishPrice = document.getElementById("dish-price");
  var notice = document.getElementById("notice");
  var noticeTimer;

  var tell = function (text) {
    notice.textContent = text;
    notice.hidden = false;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(function () { notice.hidden = true; }, 5200);
  };

  var popTray = function () {
    tray.classList.remove("is-pop");
    void tray.offsetWidth;
    tray.classList.add("is-pop");
  };

  /* ---------- carrito ---------- */

  var cartBody = function () {
    if (!state.items.length) {
      return '<p class="ped__empty">Todavía no has agregado nada. Vuelve a la carta y toca <b>Agregar</b> en el plato que quieras.</p>';
    }
    return '<ul class="olines">' + state.items.map(function (line, i) {
      var item = find(line.key);
      var unit = linePrice(line);
      var total = unit === null ? null : unit * line.qty;
      return '<li class="oline">' +
        '<div class="oline__text">' +
          '<p class="oline__name">' + esc(item ? item.name : line.key) + (line.opt ? " <em>" + esc(line.opt) + "</em>" : "") + "</p>" +
          (line.sin && line.sin.length ? '<p class="oline__meta oline__meta--sin">Sin: ' + esc(line.sin.join(", ")) + "</p>" : "") +
          (line.notes ? '<p class="oline__meta">Nota: ' + esc(line.notes) + "</p>" : "") +
          '<p class="oline__meta">' + (unit === null ? "Precio a consultar" : money(unit) + " c/u") + "</p>" +
        "</div>" +
        '<div class="oline__side">' +
          '<p class="oline__total">' + (total === null ? "—" : money(total)) + "</p>" +
          '<div class="qty">' +
            '<button type="button" data-step="-1" data-i="' + i + '" aria-label="Quitar una unidad">−</button>' +
            "<span>" + line.qty + "</span>" +
            '<button type="button" data-step="1" data-i="' + i + '" aria-label="Agregar una unidad">+</button>' +
          "</div>" +
          '<button type="button" class="oline__drop" data-drop="' + i + '">Quitar</button>' +
        "</div>" +
      "</li>";
    }).join("") + "</ul>";
  };

  var summary = function (t) {
    return '<dl class="sum">' +
      '<div><dt>Subtotal</dt><dd>' + (t.unknown ? "a confirmar" : money(t.sub)) + "</dd></div>" +
      '<div><dt>Envío</dt><dd class="sum__soft">según distancia y hora</dd></div>' +
      (state.customer.pay ? "<div><dt>Pago</dt><dd>" + esc(state.customer.pay) + "</dd></div>" : "") +
      '<div class="sum__total"><dt>Total de los platos</dt><dd>' + (t.unknown ? "a confirmar" : money(t.total)) + "</dd></div>" +
    "</dl>" +
    '<p class="ped__note">' + esc(FEE_NOTE) + "</p>";
  };

  var cartFoot = function (t) {
    var short = MIN > 0 && t.sub < MIN;
    return summary(t) +
      (short ? '<p class="ped__note ped__note--bad">Pedido mínimo ' + money(MIN) + ". Agrega algo más para continuar.</p>" : "") +
      '<button type="button" class="btn btn--wine" data-go="datos"' + (short || !state.items.length ? " disabled" : "") + ">Continuar</button>";
  };

  /* ---------- datos de entrega ---------- */

  var field = function (id, label, value, opts) {
    opts = opts || {};
    var err = opts.err;
    var control = opts.textarea
      ? '<textarea id="' + id + '" rows="' + (opts.rows || 2) + '" placeholder="' + esc(opts.placeholder || "") + '" autocomplete="' + esc(opts.autocomplete || "off") + '">' + esc(value || "") + "</textarea>"
      : '<input id="' + id + '" type="' + (opts.type || "text") + '"' +
        (opts.inputmode ? ' inputmode="' + opts.inputmode + '"' : "") +
        ' autocomplete="' + esc(opts.autocomplete || "off") + '"' +
        ' placeholder="' + esc(opts.placeholder || "") + '" value="' + esc(value || "") + '">';
    return '<div class="field' + (err ? " is-bad" : "") + '">' +
      '<label for="' + id + '"><span>' + esc(label) + "</span>" + control + "</label>" +
      (err ? '<p class="field__err">' + esc(err) + "</p>" : "") +
    "</div>";
  };

  var mapsUrl = function () {
    if (!state.gps) return "";
    return "https://maps.google.com/?q=" + state.gps.lat + "," + state.gps.lng;
  };

  var pinIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

  var payBlock = function (e) {
    return '<fieldset class="pick">' +
      '<legend>Método de pago</legend>' +
      '<p class="pick__hint">Solo para avisar cómo pagas. No se cobra nada aquí: los datos te llegan por WhatsApp.</p>' +
      '<div class="pick__row">' + PAYS.map(function (method) {
        var on = state.customer.pay === method;
        return '<button type="button" class="pick__chip pick__chip--pay' + (on ? " is-on" : "") + '" data-pay="' + esc(method) + '" aria-pressed="' + on + '">' + esc(method) + "</button>";
      }).join("") + "</div>" +
      (e.pay ? '<p class="field__err">' + esc(e.pay) + "</p>" : "") +
    "</fieldset>";
  };

  var dataBody = function () {
    var e = state.errors || {};
    return '<p class="ped__hint">Escribe tus datos y, si puedes, comparte la ubicación exacta: así llegamos sin llamarte.</p>' +
      field("f-name", "Nombre y apellido", state.customer.name, { err: e.name, autocomplete: "name", placeholder: "María Pérez" }) +
      field("f-phone", "Teléfono / WhatsApp", state.customer.phone, { err: e.phone, type: "tel", inputmode: "tel", autocomplete: "tel", placeholder: "0414 123 4567" }) +
      field("f-address", "Dirección de entrega", state.customer.address, { err: e.address, textarea: true, autocomplete: "street-address", placeholder: "Calle, casa o apartamento, sector" }) +
      '<div class="gps">' +
        '<button type="button" class="gps__btn" data-gps>' + pinIcon + (state.gps ? "Ubicación lista" : "Compartir mi ubicación exacta") + "</button>" +
        (state.gps
          ? '<p class="gps__note">Ubicación tomada' + (state.gps.acc ? " (±" + state.gps.acc + " m)" : "") + " (" + state.gps.lat.toFixed(5) + ", " + state.gps.lng.toFixed(5) + '). <a href="' + esc(mapsUrl()) + '" target="_blank" rel="noopener">Ver en el mapa</a> · <button type="button" class="gps__clear" data-gps-clear>Quitar</button></p>'
          : '<p class="gps__note">Solo se envía con el pedido. Si no la compartes, escribe una referencia clara.</p>') +
      "</div>" +
      field("f-ref", "Punto de referencia", state.customer.ref, { placeholder: "Frente a la panadería, portón negro…" }) +
      payBlock(e) +
      field("f-notes", "Notas para la cocina", state.customer.notes, { textarea: true, placeholder: "Sin cebolla, salsa aparte, tocar el timbre…" });
  };

  var dataFoot = function () {
    return '<button type="button" class="btn btn--ghost" data-go="cart">Volver al pedido</button>' +
      '<button type="button" class="btn btn--wine" data-send>Enviar pedido por WhatsApp</button>' +
      '<p class="ped__note ped__note--center">Se abre WhatsApp con el resumen y tu método de pago. Allí te pasan los datos para pagar.</p>';
  };

  /* ---------- envío ---------- */

  var validate = function () {
    var errors = {};
    var c = state.customer;
    if (!c.name || c.name.trim().length < 2) errors.name = "Escribe tu nombre.";
    if (String(c.phone || "").replace(/\D/g, "").length < 7) errors.phone = "Un teléfono para avisarte del pedido.";
    if (!c.address || c.address.trim().length < 6) errors.address = "¿A dónde lo llevamos?";
    if (!c.pay) errors.pay = "Elige cómo vas a pagar.";
    return errors;
  };

  var buildMessage = function () {
    var out = ["*Pedido a domicilio · Loboburguer*", ""];
    state.items.forEach(function (line, i) {
      var item = find(line.key);
      var name = (item ? item.name : line.key) + (line.opt ? " (" + line.opt + ")" : "");
      var price = linePrice(line);
      out.push((i + 1) + ". " + line.qty + " × " + name + (price === null ? "" : " — " + money(price * line.qty)));
      if (line.sin && line.sin.length) out.push("   Sin: " + line.sin.join(", "));
      if (line.notes) out.push("   Nota: " + line.notes);
    });
    var t = totals();
    out.push("");
    out.push("Subtotal: " + (t.unknown ? "a confirmar" : money(t.sub)));
    out.push("Envío: a confirmar según la distancia y la hora");
    out.push("*Total de los platos: " + (t.unknown ? "a confirmar" : money(t.total)) + "*");
    out.push(FEE_NOTE);
    out.push("");
    out.push("*Entrega*");
    out.push("Nombre: " + (state.customer.name || "—"));
    out.push("Teléfono: " + (state.customer.phone || "—"));
    out.push("Dirección: " + (state.customer.address || "—"));
    if (state.customer.ref) out.push("Referencia: " + state.customer.ref);
    if (state.gps) out.push("Ubicación GPS: " + mapsUrl());
    if (state.customer.notes) out.push("Notas: " + state.customer.notes);
    out.push("");
    out.push("*Pago: " + (state.customer.pay || "a coordinar") + "*");
    out.push(PAY_NOTES[state.customer.pay] || "Me confirman cómo hacer el pago.");
    return out.join("\n");
  };

  var send = function () {
    var errors = validate();
    if (Object.keys(errors).length) {
      state.errors = errors;
      state.step = "datos";
      render();
      var bad = pedBody.querySelector(".is-bad input, .is-bad textarea");
      if (bad) bad.focus();
      return;
    }
    if (!state.items.length) { state.step = "cart"; render(); return; }
    window.open(waUrl(buildMessage()), "_blank", "noopener");
    state.sent = true;
    render();
    tell("Abrimos WhatsApp con tu pedido: envíalo para que lo confirmemos.");
  };

  /* ---------- ubicación ---------- */

  var locate = function () {
    var btn = pedBody.querySelector("[data-gps]");
    if (!("geolocation" in navigator)) {
      tell("Este dispositivo no permite compartir la ubicación. Escribe la dirección y una referencia.");
      return;
    }
    if (window.isSecureContext === false) {
      tell("La ubicación solo funciona con conexión segura (https). Escribe la dirección y una referencia.");
      return;
    }

    var setBusy = function (text) {
      if (btn) {
        btn.classList.add("is-busy");
        btn.textContent = text;
      }
    };

    var onOk = function (pos) {
      state.gps = {
        lat: Number(pos.coords.latitude.toFixed(6)),
        lng: Number(pos.coords.longitude.toFixed(6)),
        acc: pos.coords.accuracy ? Math.round(pos.coords.accuracy) : null
      };
      save();
      render();
      tell(state.gps.acc
        ? "Ubicación guardada (±" + state.gps.acc + " m). Se envía con tu pedido."
        : "Ubicación guardada. Se envía con tu pedido.");
    };

    var onFail = function (err) {
      if (err && err.code === 1) {
        render();
        tell("No diste permiso de ubicación. Puedes escribir la dirección y un punto de referencia.");
        return;
      }
      /* Segundo intento con menos precisión: funciona mejor en interiores,
         equipos con GPS lento o navegadores que no aceptan alta precisión. */
      setBusy("Ajustando la ubicación…");
      navigator.geolocation.getCurrentPosition(onOk, function (err2) {
        render();
        tell(err2 && err2.code === 1
          ? "No diste permiso de ubicación. Escribe la dirección y un punto de referencia."
          : "No pudimos tomar tu ubicación. Revisa que el GPS esté activo o escribe la dirección y una referencia.");
      }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 });
    };

    setBusy("Buscando tu ubicación…");
    navigator.geolocation.getCurrentPosition(onOk, onFail, {
      enableHighAccuracy: true,
      timeout: 18000,
      maximumAge: 0
    });
  };

  /* ---------- pintar ---------- */

  var render = function () {
    var count = state.items.reduce(function (n, line) { return n + line.qty; }, 0);
    var t = totals();

    tray.hidden = count === 0;
    document.body.classList.toggle("has-tray", count > 0);
    if (count) {
      var countNode = tray.querySelector(".tray__count");
      var totalNode = tray.querySelector(".tray__total");
      var labelNode = tray.querySelector(".tray__label");
      if (countNode) countNode.textContent = count;
      if (labelNode) labelNode.textContent = count === 1 ? "1 plato" : count + " platos";
      if (totalNode) totalNode.textContent = t.unknown ? "—" : money(t.total);
    }

    if (ped.hidden) return;

    back.hidden = state.step === "cart";
    if (state.step === "cart") {
      pedTitle.textContent = "Tu pedido";
      pedBody.innerHTML = cartBody();
      pedFoot.innerHTML = cartFoot(t);
    } else {
      pedTitle.textContent = "Entrega a domicilio";
      pedBody.innerHTML = dataBody();
      pedFoot.innerHTML = dataFoot();
    }
  };

  /* ---------- plato: tamaño, ingredientes y nota ---------- */

  var renderDish = function () {
    if (!draft) return;
    var item = find(draft.key);
    if (!item) { closeDish(); return; }

    var price = draft.opt ? optPrice(item, draft.opt) : item.price;
    var total = price === null || price === undefined ? null : Number(price) * draft.qty;

    dishTitle.textContent = item.name;
    dishPrice.textContent = total === null ? "Precio a confirmar" : money(total);

    var blocks = [];

    if (item.options && item.options.length) {
      blocks.push('<fieldset class="pick"><legend>Tamaño</legend><div class="pick__row">' + item.options.map(function (option) {
        var lock = option.price === null || option.price === undefined || !(Number(option.price) > 0);
        var on = draft.opt === option.label;
        return '<button type="button" class="pick__chip' + (on ? " is-on" : "") + '" data-dish-opt="' + esc(option.label) + '"' +
          (lock ? " disabled" : "") + ' aria-pressed="' + on + '">' + esc(option.label) +
          "<em>" + (lock ? "consultar" : money(option.price)) + "</em></button>";
      }).join("") + "</div></fieldset>");
    }

    if (item.sin && item.sin.length) {
      blocks.push('<fieldset class="pick"><legend>Quitar ingredientes</legend>' +
        '<p class="pick__hint">Marca lo que no quieres y lo preparamos sin eso.</p>' +
        '<div class="pick__row">' + item.sin.map(function (name) {
          var on = draft.sin.indexOf(name) !== -1;
          return '<button type="button" class="pick__chip pick__chip--sin' + (on ? " is-on" : "") + '" data-dish-sin="' + esc(name) + '" aria-pressed="' + on + '">' +
            (on ? "<s>" : "") + esc(name) + (on ? "</s>" : "") + "</button>";
        }).join("") + "</div></fieldset>");
    }

    blocks.push('<div class="field"><label for="dish-notes"><span>Nota para la cocina (opcional)</span>' +
      '<textarea id="dish-notes" rows="2" placeholder="Bien cocido, salsa aparte…">' + esc(draft.notes) + "</textarea></label></div>");

    blocks.push('<div class="dish__qty"><span>Cantidad</span><div class="qty">' +
      '<button type="button" data-dish-qty="-1" aria-label="Quitar una unidad">−</button>' +
      "<span>" + draft.qty + "</span>" +
      '<button type="button" data-dish-qty="1" aria-label="Agregar una unidad">+</button>' +
      "</div></div>");

    dishBody.innerHTML = blocks.join("");
    dishFoot.innerHTML = '<button type="button" class="btn btn--wine" data-dish-add>' +
      (total === null ? "Agregar al pedido" : "Agregar · " + money(total)) + "</button>";

    var notes = document.getElementById("dish-notes");
    if (notes) {
      notes.addEventListener("input", function () { draft.notes = notes.value; });
    }
  };

  var openDish = function (key) {
    var item = find(key);
    if (!item) return;
    var first = null;
    (item.options || []).forEach(function (option) {
      if (first === null && option.price !== null && option.price !== undefined && Number(option.price) > 0) first = option.label;
    });
    draft = { key: key, opt: first, sin: [], notes: "", qty: 1 };
    renderDish();
    dish.hidden = false;
    document.body.classList.add("is-locked");
    var closeBtn = dish.querySelector("[data-dish-close]");
    if (closeBtn) closeBtn.focus();
  };

  var closeDish = function () {
    dish.hidden = true;
    draft = null;
    if (ped.hidden) document.body.classList.remove("is-locked");
    var opener = document.querySelector(".dish__add");
    if (opener) opener.focus();
  };

  /* ---------- abrir y cerrar el pedido ---------- */

  var openSheet = function (step) {
    state.step = step || "cart";
    state.errors = {};
    state.sent = false;
    ped.hidden = false;
    document.body.classList.add("is-locked");
    render();
    pedBody.scrollTop = 0;
    var closeBtn = ped.querySelector(".ped__close");
    if (closeBtn) closeBtn.focus();
  };

  var closeSheet = function () {
    ped.hidden = true;
    document.body.classList.remove("is-locked");
    if (!tray.hidden) tray.querySelector(".tray__main").focus();
  };

  /* ---------- eventos ---------- */

  var addFromCard = function (key, opt) {
    var item = find(key);
    if (!item) return;
    if (item.blocked) { tell("Este plato está agotado por ahora. Elige otro de la carta."); return; }

    if (opt) {
      var price = optPrice(item, opt);
      if (price === null) { chat("Hola, quiero consultar el precio de " + item.name + " (" + opt + ") para un domicilio."); return; }
      pushLine({ key: key, opt: opt, qty: 1 });
      return;
    }

    if (item.price === null || item.price === undefined) {
      chat("Hola, quiero consultar el precio de " + item.name + " para un domicilio.");
      return;
    }

    if ((!item.options || !item.options.length) && (!item.sin || !item.sin.length)) {
      pushLine({ key: key, qty: 1 });
      return;
    }
    openDish(key);
  };

  document.addEventListener("click", function (event) {
    var node = event.target.closest ? event.target.closest("[data-add]") : null;
    if (node) {
      event.preventDefault();
      addFromCard(node.getAttribute("data-add"), node.getAttribute("data-opt") || null);
      return;
    }
    var open = event.target.closest ? event.target.closest("[data-open-cart]") : null;
    if (open) { openSheet("cart"); }
  });

  tray.addEventListener("click", function () { openSheet("cart"); });

  ped.addEventListener("click", function (event) {
    var el = event.target.closest ? event.target.closest("button, a") : null;
    if (!el) return;

    if (el.hasAttribute("data-close")) { closeSheet(); return; }
    if (el.hasAttribute("data-back")) { state.step = "cart"; state.errors = {}; render(); return; }
    if (el.hasAttribute("data-go")) {
      if (el.getAttribute("data-go") === "datos" && state.items.length) {
        state.step = "datos";
        state.errors = {};
        render();
        pedBody.scrollTop = 0;
      }
      return;
    }
    if (el.hasAttribute("data-step")) {
      var i = Number(el.getAttribute("data-i"));
      var delta = Number(el.getAttribute("data-step"));
      var line = state.items[i];
      if (!line) return;
      line.qty += delta;
      if (line.qty < 1) state.items.splice(i, 1);
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-drop")) {
      state.items.splice(Number(el.getAttribute("data-drop")), 1);
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-gps")) { locate(); return; }
    if (el.hasAttribute("data-gps-clear")) { state.gps = null; save(); render(); return; }
    if (el.hasAttribute("data-pay")) {
      state.customer.pay = el.getAttribute("data-pay");
      delete state.errors.pay;
      save();
      render();
      return;
    }
    if (el.hasAttribute("data-send")) { send(); }
  });

  dish.addEventListener("click", function (event) {
    var el = event.target.closest ? event.target.closest("button") : null;
    if (!el || !draft) return;

    if (el.hasAttribute("data-dish-close")) { closeDish(); return; }
    if (el.hasAttribute("data-dish-opt")) {
      draft.opt = el.getAttribute("data-dish-opt");
      renderDish();
      return;
    }
    if (el.hasAttribute("data-dish-sin")) {
      var name = el.getAttribute("data-dish-sin");
      var at = draft.sin.indexOf(name);
      if (at === -1) draft.sin.push(name);
      else draft.sin.splice(at, 1);
      renderDish();
      return;
    }
    if (el.hasAttribute("data-dish-qty")) {
      draft.qty = Math.max(1, draft.qty + Number(el.getAttribute("data-dish-qty")));
      renderDish();
      return;
    }
    if (el.hasAttribute("data-dish-add")) {
      var item = find(draft.key);
      var price = draft.opt ? optPrice(item, draft.opt) : item.price;
      if (price === null || price === undefined) {
        closeDish();
        chat("Hola, quiero consultar el precio de " + item.name + " para un domicilio.");
        return;
      }
      var line = {
        key: draft.key,
        opt: draft.opt,
        sin: draft.sin.slice(),
        notes: draft.notes.trim(),
        qty: draft.qty
      };
      closeDish();
      pushLine(line);
      tell("Agregado a tu pedido.");
    }
  });

  ped.addEventListener("input", function (event) {
    var input = event.target;
    if (!input || !input.id) return;
    var map = {
      "f-name": "name",
      "f-phone": "phone",
      "f-address": "address",
      "f-ref": "ref",
      "f-notes": "notes"
    };
    var key = map[input.id];
    if (!key) return;
    state.customer[key] = input.value;
    save();
    var box = input.closest(".field");
    if (box) box.classList.remove("is-bad");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (!dish.hidden) { closeDish(); return; }
    if (!ped.hidden) closeSheet();
  });

  document.addEventListener("lobo:catalog", function () {
    if (!dish.hidden) renderDish();
    else if (ped.hidden) render();
  });

  /* ---------- datos que llegan del panel ---------- */

  var applyDelivery = function (src) {
    if (!src || typeof src !== "object") return;

    var digits = String(src.whatsapp || "").replace(/\D/g, "");
    if (digits) WA = digits;
    if (src.minimum !== undefined) MIN = Number(src.minimum) > 0 ? Number(src.minimum) : 0;
    if (src.feeNote) FEE_NOTE = String(src.feeNote);
    if (src.timing) ETA = String(src.timing);
    if (src.greeting) GREETING = String(src.greeting);

    if (src.pay) {
      if (Array.isArray(src.pay.methods) && src.pay.methods.length) PAYS = src.pay.methods.slice();
      if (src.pay.notes && typeof src.pay.notes === "object") PAY_NOTES = src.pay.notes;
    }

    if (state.customer.pay && PAYS.indexOf(state.customer.pay) === -1) delete state.customer.pay;

    var floater = document.querySelector(".wa-float");
    if (floater) floater.href = waUrl(GREETING);

    Array.prototype.forEach.call(document.querySelectorAll(".footer__links a"), function (link) {
      var href = link.getAttribute("href") || "";
      if (href.indexOf("https://wa.me/") === 0) link.href = waUrl(GREETING);
      else if (href.indexOf("tel:") === 0) {
        link.href = "tel:+" + WA;
        if (src.phoneLabel) link.textContent = String(src.phoneLabel);
      }
    });

    render();
  };

  document.addEventListener("lobo:delivery", function () {
    applyDelivery(window.LOBO_DELIVERY);
  });

  render();

  if (window.LOBO_DELIVERY) applyDelivery(window.LOBO_DELIVERY);
})();
