/* Loboburguer — panel: PIN, precios, fotos, platos nuevos y eliminados. */
(function () {
  var menu = window.LOBO_MENU;
  var config = window.LOBO_CONFIG || {};
  var app = document.getElementById("app");
  var bar = document.getElementById("bar");
  var barText = document.getElementById("barText");
  var retryBtn = document.getElementById("retry");
  var undoBtn = document.getElementById("undo");

  var base = String(config.supabaseUrl || "").replace(/\/$/, "");
  var apiKey = config.supabaseKey || "";
  var stateId = config.stateId || "__lobo_menu__";
  var bucket = config.bucket || "menu";
  var PIN = String(config.pin || "1987");
  var UNLOCKED = "lobo_admin_unlocked";

  var defaults = {};
  var current = {};
  var saved = {};
  var meta = { removed: [], added: [] };
  var dirty = false;
  var saving = false;
  var queued = false;
  var saveTimer = null;
  var retryTimer = null;
  var hideTimer = null;
  var started = false;
  var undoState = null;

  /* Valores por defecto de la carta de domicilios: solo se usan si esa carta
     todavía no tiene datos propios guardados. */
  var DOMI_DEFAULTS = {
    whatsapp: "584149552961",
    phoneLabel: "0414-9552961",
    minimum: 8,
    timing: "35 a 50 minutos",
    greeting: "Hola, quiero hacer un pedido a domicilio 🛵",
    feeNote: "El envío se calcula según la distancia y la hora; te lo confirmamos por WhatsApp.",
    hours: { open: "06:30", close: "00:00" },
    lateFrom: "17:00",
    pay: {
      methods: ["Pago móvil", "Efectivo"],
      notes: {
        "Pago móvil": "Envíenme banco, cédula y teléfono para hacer la transferencia.",
        "Efectivo": "Pago en efectivo al recibir el pedido."
      }
    }
  };

  var domi = null;

  if (!menu) return;

  /* ---------- utilidades ---------- */

  function esc(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toNumber(raw) {
    var value = String(raw == null ? "" : raw).trim().replace(",", ".");
    if (value === "") return null;
    var number = Number(value);
    return isFinite(number) && number >= 0 ? number : null;
  }

  function priceText(value) {
    return value === null || value === undefined ? "" : String(value).replace(".", ",");
  }

  function slugify(text) {
    return String(text == null ? "" : text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || "plato";
  }

  function photoSrc(value) {
    if (!value) return "";
    if (/^(https?:|data:|blob:|\/)/.test(value)) return value;
    if (value.indexOf("assets/") === 0) return value;
    return "assets/img/d/" + value + ".jpg";
  }

  function rowNodes() {
    return Array.prototype.slice.call(app.querySelectorAll(".row"));
  }

  function normalizeMeta(raw) {
    var source = raw && typeof raw === "object" ? raw : {};
    return {
      removed: Array.isArray(source.removed) ? source.removed.slice() : [],
      added: Array.isArray(source.added) ? source.added.slice() : []
    };
  }

  function countText(total) {
    return total + (total === 1 ? " plato" : " platos");
  }

  /* ---------- datos de la carta de domicilios ---------- */

  function numberOr(value, fallback) {
    var number = toNumber(value);
    return number === null ? fallback : number;
  }

  function timeOr(value, fallback) {
    var match = String(value == null ? "" : value).trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return fallback;
    var h = Math.min(23, Number(match[1]));
    var m = Math.min(59, Number(match[2]));
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
  }

  function normalizeDomi(raw) {
    var source = raw && typeof raw === "object" ? raw : {};
    var notes = source.pay && typeof source.pay.notes === "object" ? source.pay.notes : {};
    var methods = Array.isArray(source.pay && source.pay.methods) && source.pay.methods.length
      ? source.pay.methods.slice()
      : DOMI_DEFAULTS.pay.methods.slice();
    var hours = source.hours && typeof source.hours === "object" ? source.hours : {};

    var out = {
      whatsapp: String(source.whatsapp || DOMI_DEFAULTS.whatsapp).replace(/\D/g, "") || DOMI_DEFAULTS.whatsapp,
      phoneLabel: String(source.phoneLabel || DOMI_DEFAULTS.phoneLabel),
      minimum: numberOr(source.minimum, DOMI_DEFAULTS.minimum),
      timing: String(source.timing || DOMI_DEFAULTS.timing),
      greeting: String(source.greeting || DOMI_DEFAULTS.greeting),
      feeNote: String(source.feeNote || DOMI_DEFAULTS.feeNote),
      hours: {
        open: timeOr(hours.open, DOMI_DEFAULTS.hours.open),
        close: timeOr(hours.close, DOMI_DEFAULTS.hours.close)
      },
      lateFrom: timeOr(source.lateFrom, DOMI_DEFAULTS.lateFrom),
      pay: { methods: methods, notes: {} }
    };

    methods.forEach(function (method) {
      out.pay.notes[method] = String(notes[method] || DOMI_DEFAULTS.pay.notes[method] || "");
    });

    return out;
  }

  function buildDomiPanel(open) {
    var panel = document.createElement("details");
    panel.className = "panel";
    panel.setAttribute("data-section", "domicilios");
    panel.open = open !== undefined ? open : true;

    var head = document.createElement("summary");
    head.className = "panel__head";
    head.innerHTML =
      '<svg class="panel__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span class="panel__title">Carta de domicilios</span>' +
      '<span class="panel__count" data-domi-wa></span>';
    head.querySelector("[data-domi-wa]").textContent = "wa.me/" + domi.whatsapp;
    panel.appendChild(head);

    function field(name, label, value, mode, hint) {
      return "<label>" + esc(label) +
        '<input data-domi="' + name + '" type="text"' + (mode ? ' inputmode="' + mode + '"' : "") +
        ' autocomplete="off" value="' + esc(value) + '">' +
        (hint ? "<span>" + esc(hint) + "</span>" : "") +
      "</label>";
    }

    function area(name, label, value) {
      return "<label>" + esc(label) +
        '<textarea data-domi="' + name + '" rows="2">' + esc(value) + "</textarea>" +
      "</label>";
    }

    function timeField(name, label, value, hint) {
      return "<label>" + esc(label) +
        '<input data-domi="' + name + '" type="time" value="' + esc(value) + '">' +
        (hint ? "<span>" + esc(hint) + "</span>" : "") +
      "</label>";
    }

    var body = document.createElement("div");
    body.className = "panel__body";

    var form = document.createElement("form");
    form.className = "domi";
    form.innerHTML =
      '<p class="domi__note">Solo cambia la carta de domicilios. Los platos, precios y fotos son los mismos del panel de abajo.</p>' +
      '<div class="domi__grid">' +
        field("whatsapp", "WhatsApp con código de país", domi.whatsapp, "numeric", "Ej. 584149552961") +
        field("phoneLabel", "Teléfono visible", domi.phoneLabel) +
        field("minimum", "Pedido mínimo $", priceText(domi.minimum), "decimal") +
        field("timing", "Tiempo de entrega", domi.timing) +
        timeField("hours:open", "Abre a las", domi.hours.open) +
        timeField("hours:close", "Cierra a las", domi.hours.close, "12:00 de la noche = 00:00") +
        timeField("lateFrom", "Carta de la noche desde", domi.lateFrom, "Hamburguesas y especiales de la noche") +
      "</div>" +
      field("greeting", "Saludo del botón de WhatsApp", domi.greeting) +
      area("feeNote", "Texto del envío (sin costo fijo)", domi.feeNote) +
      '<div class="domi__grid domi__grid--pay">' +
        area("pay:Pago móvil", "Mensaje para Pago móvil", domi.pay.notes["Pago móvil"] || "") +
        area("pay:Efectivo", "Mensaje para Efectivo", domi.pay.notes["Efectivo"] || "") +
      "</div>" +
      '<p class="domi__hint">El envío no tiene precio fijo: el cliente lo ve como “según distancia y hora” y se confirma en el WhatsApp. Elige Pago móvil o Efectivo solo para avisar cómo paga; la carta no cobra nada.</p>';

    form.addEventListener("input", function (event) {
      var node = event.target;
      var key = node.getAttribute("data-domi");
      if (!key) return;

      if (key.indexOf("pay:") === 0) domi.pay.notes[key.slice(4)] = node.value;
      else if (key === "whatsapp") domi.whatsapp = node.value.replace(/\D/g, "");
      else if (key === "hours:open" || key === "hours:close") {
        var part = key.slice(6);
        domi.hours[part] = /^\d{1,2}:\d{2}$/.test(node.value) ? timeOr(node.value, domi.hours[part]) : domi.hours[part];
      } else if (key === "lateFrom") domi.lateFrom = timeOr(node.value, domi.lateFrom);
      else if (key === "minimum") domi[key] = numberOr(node.value, 0);
      else domi[key] = node.value;

      var badge = head.querySelector("[data-domi-wa]");
      if (badge) badge.textContent = "wa.me/" + domi.whatsapp;
      onEdit();
    });

    form.addEventListener("submit", function (event) { event.preventDefault(); });

    body.appendChild(form);
    panel.appendChild(body);
    return panel;
  }

  function showBar(text, state, autoHide) {
    clearTimeout(hideTimer);
    bar.hidden = false;
    bar.setAttribute("data-state", state);
    barText.textContent = text;
    retryBtn.hidden = state !== "error";
    undoBtn.hidden = !undoState;
    if (autoHide) {
      hideTimer = setTimeout(function () {
        bar.hidden = true;
        undoBtn.hidden = true;
        undoState = null;
      }, typeof autoHide === "number" ? autoHide : 2600);
    }
  }

  function hideBar() {
    clearTimeout(hideTimer);
    bar.hidden = true;
  }

  /* ---------- confirmación ---------- */

  function askConfirm(name) {
    return new Promise(function (resolve) {
      var layer = document.createElement("div");
      layer.className = "confirm";
      layer.innerHTML =
        '<div class="confirm__box" role="alertdialog" aria-modal="true" aria-labelledby="confirmTitle" aria-describedby="confirmText">' +
          '<p class="confirm__tag">Quitar de la carta</p>' +
          '<h2 class="confirm__title" id="confirmTitle"></h2>' +
          '<p class="confirm__text" id="confirmText">Dejará de aparecer en la carta de las mesas. Puedes deshacerlo justo después.</p>' +
          '<div class="confirm__actions">' +
            '<button type="button" class="confirm__cancel">Cancelar</button>' +
            '<button type="button" class="confirm__ok">Eliminar</button>' +
          "</div>" +
        "</div>";

      var box = layer.firstChild;
      box.querySelector(".confirm__title").textContent = "\u00bfEliminar \u201c" + name + "\u201d?";

      var cancel = box.querySelector(".confirm__cancel");
      var ok = box.querySelector(".confirm__ok");
      var previous = document.activeElement;
      var closed = false;

      function onKey(event) {
        if (event.key === "Escape") {
          event.preventDefault();
          close(false);
        } else if (event.key === "Tab") {
          if (event.shiftKey && document.activeElement === cancel) {
            event.preventDefault();
            ok.focus();
          } else if (!event.shiftKey && document.activeElement === ok) {
            event.preventDefault();
            cancel.focus();
          }
        }
      }

      function close(result) {
        if (closed) return;
        closed = true;
        document.removeEventListener("keydown", onKey, true);
        layer.remove();
        document.body.classList.remove("is-locked");
        if (previous && previous.focus) previous.focus();
        resolve(result);
      }

      cancel.addEventListener("click", function () { close(false); });
      ok.addEventListener("click", function () { close(true); });
      layer.addEventListener("click", function (event) {
        if (event.target === layer) close(false);
      });

      document.addEventListener("keydown", onKey, true);
      document.body.classList.add("is-locked");
      document.body.appendChild(layer);
      cancel.focus();
    });
  }

  /* ---------- PIN ---------- */

  function lockScreen(message) {
    app.innerHTML = "";
    var box = document.createElement("form");
    box.className = "lock";
    box.innerHTML =
      '<img src="assets/img/logo.svg" alt="" aria-hidden="true">' +
      "<h1>Panel de la carta</h1>" +
      "<p>Escribe el PIN del restaurante para cambiar precios, fotos y platos.</p>" +
      '<input name="pin" type="password" inputmode="numeric" autocomplete="off" maxlength="8" aria-label="PIN" placeholder="••••">' +
      '<button type="submit">Entrar</button>';
    if (message) {
      var note = document.createElement("p");
      note.className = "lock__error";
      note.textContent = message;
      box.appendChild(note);
    }
    var input = box.querySelector("input");

    box.addEventListener("submit", function (event) {
      event.preventDefault();
      if (input.value.trim() === PIN) {
        try { sessionStorage.setItem(UNLOCKED, "1"); } catch (error) {}
        start();
      } else {
        input.value = "";
        var old = box.querySelector(".lock__error");
        if (old) old.remove();
        var wrong = document.createElement("p");
        wrong.className = "lock__error";
        wrong.textContent = "PIN incorrecto.";
        box.appendChild(wrong);
        input.focus();
      }
    });

    app.appendChild(box);
    setTimeout(function () { input.focus(); }, 60);
  }

  /* ---------- fotos ---------- */

  function squareBlob(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var image = new Image();
      image.onload = function () {
        var size = Math.min(image.width, image.height);
        var target = Math.min(900, size);
        var canvas = document.createElement("canvas");
        canvas.width = target;
        canvas.height = target;
        var ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          image,
          (image.width - size) / 2, (image.height - size) / 2, size, size,
          0, 0, target, target
        );
        URL.revokeObjectURL(url);
        canvas.toBlob(function (blob) { resolve(blob || file); }, "image/jpeg", 0.82);
      };
      image.onerror = function () {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      image.src = url;
    });
  }

  function uploadPhoto(file, key) {
    return squareBlob(file).then(function (blob) {
      var path = "fotos/" + key.replace(/:/g, "-") + "-" + Date.now() + ".jpg";
      return fetch(base + "/storage/v1/object/" + bucket + "/" + path, {
        method: "POST",
        headers: {
          apikey: apiKey,
          Authorization: "Bearer " + apiKey,
          "Content-Type": "image/jpeg",
          "x-upsert": "true",
          "cache-control": "31536000"
        },
        body: blob
      }).then(function (response) {
        if (!response.ok) {
          return response.text().then(function (text) {
            throw new Error("HTTP " + response.status + " " + text.slice(0, 90));
          });
        }
        return base + "/storage/v1/object/public/" + bucket + "/" + path;
      });
    });
  }

  /* ---------- panel ---------- */

  function viewSections() {
    var removed = {};
    meta.removed.forEach(function (key) { removed[key] = true; });

    return menu.sections.map(function (section) {
      var items = section.items.filter(function (item) {
        return !removed[section.id + ":" + item.id];
      });
      meta.added.forEach(function (item) {
        if (item.section !== section.id) return;
        var copy = { id: item.id, name: item.name, desc: item.desc, sizeLabel: item.sizeLabel, price: item.price, img: item.img, options: item.options };
        copy.isCustom = true;
        items.push(copy);
      });
      return { id: section.id, title: section.title, items: items };
    });
  }

  function entryOf(key) {
    if (!current[key]) current[key] = {};
    return current[key];
  }

  function priceOf(key) {
    var entry = current[key];
    var fallback = defaults[key] || {};
    return entry && entry.price !== undefined ? entry.price : fallback.price;
  }

  function optionsOf(key) {
    var entry = current[key];
    var fallback = defaults[key] || {};
    return entry && Array.isArray(entry.options) && entry.options.length ? entry.options : fallback.options;
  }

  function imgOf(key) {
    var entry = current[key];
    var fallback = defaults[key] || {};
    return entry && entry.img ? entry.img : fallback.img;
  }

  function syncChangeMark(key) {
    var row = app.querySelector('[data-key="' + key + '"]');
    if (!row) return;
    var entry = current[key] || {};
    var fallback = defaults[key] || {};
    var changed = false;
    if (entry.price !== undefined && entry.price !== fallback.price) changed = true;
    if (entry.img && entry.img !== fallback.img) changed = true;
    if (entry.options && JSON.stringify(entry.options) !== JSON.stringify(fallback.options)) changed = true;
    row.classList.toggle("is-changed", changed);
  }

  function refreshRow(key) {
    var row = app.querySelector('[data-key="' + key + '"]');
    if (!row) return;
    var priceInput = row.querySelector("[data-price]");
    if (priceInput) priceInput.value = priceText(priceOf(key));

    var img = row.querySelector(".row__thumb img");
    var src = photoSrc(imgOf(key));
    if (img) {
      if (src) img.src = src;
      else img.removeAttribute("src");
    } else if (src) {
      var fresh = document.createElement("img");
      fresh.src = src;
      fresh.alt = "";
      row.querySelector(".row__thumb").insertBefore(fresh, row.querySelector(".row__thumb input"));
    }

    syncChangeMark(key);
  }

  function syncCount(sectionId) {
    var panel = app.querySelector('.panel[data-section="' + sectionId + '"]');
    if (!panel) return;
    var total = panel.querySelectorAll(".row").length;
    var count = panel.querySelector(".panel__count");
    if (count) count.textContent = countText(total);
  }

  function buildRow(section, item) {
    var key = section.id + ":" + item.id;
    if (!defaults[key]) {
      defaults[key] = {
        price: item.price === undefined ? null : item.price,
        options: item.options ? item.options.map(function (option) {
          return { label: option.label, price: option.price };
        }) : null,
        img: item.img || null
      };
    }

    var row = document.createElement("div");
    row.className = "row";
    row.setAttribute("data-key", key);

    /* foto */
    var thumb = document.createElement("label");
    thumb.className = "row__thumb";
    thumb.title = "Cambiar la foto de " + item.name;
    var img = document.createElement("img");
    img.src = photoSrc(imgOf(key));
    img.alt = "";
    img.loading = "lazy";
    thumb.appendChild(img);

    var file = document.createElement("input");
    file.type = "file";
    file.accept = "image/jpeg,image/png,image/webp";
    file.setAttribute("aria-label", "Cambiar foto de " + item.name);
    file.addEventListener("change", function () {
      var picked = file.files && file.files[0];
      if (!picked) return;
      if (picked.size > 8 * 1024 * 1024) {
        showBar("La foto pesa más de 8 MB. Usa una imagen más liviana.", "error");
        file.value = "";
        return;
      }
      thumb.classList.add("is-busy");
      showBar("Subiendo la foto de " + item.name + "…", "saving");
      uploadPhoto(picked, key)
        .then(function (publicUrl) {
          entryOf(key).img = publicUrl;
          var shown = thumb.querySelector("img");
          if (shown) shown.src = publicUrl;
          dirty = true;
          syncChangeMark(key);
          return save();
        })
        .catch(function () {
          showBar("No se pudo subir la foto. Intenta de nuevo.", "error");
        })
        .then(function () {
          thumb.classList.remove("is-busy");
          file.value = "";
        });
    });
    thumb.appendChild(file);
    row.appendChild(thumb);

    /* nombre */
    var name = document.createElement("div");
    name.className = "row__name";
    name.innerHTML = esc(item.name) + (item.sizeLabel ? " <em>" + esc(item.sizeLabel) + "</em>" : "");
    if (item.desc) {
      var hint = document.createElement("span");
      hint.textContent = item.desc;
      name.appendChild(hint);
    }
    row.appendChild(name);

    /* precio */
    var priceBox = document.createElement("label");
    priceBox.className = "row__price";
    priceBox.innerHTML = "<b>$</b>";
    var input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.value = priceText(priceOf(key));
    input.setAttribute("data-price", "1");
    input.setAttribute("aria-label", "Precio de " + item.name);
    input.addEventListener("input", function () {
      entryOf(key).price = toNumber(input.value);
      onEdit(key);
    });
    input.addEventListener("blur", function () {
      var value = toNumber(input.value);
      if (value === null) delete entryOf(key).price;
      input.value = priceText(value);
      onEdit(key);
    });
    priceBox.appendChild(input);
    row.appendChild(priceBox);

    /* acciones */
    var actions = document.createElement("div");
    actions.className = "row__actions";

    var reset = document.createElement("button");
    reset.type = "button";
    reset.className = "row__reset";
    reset.title = "Volver al valor de la carta";
    reset.setAttribute("aria-label", "Restaurar " + item.name);
    reset.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    reset.addEventListener("click", function () {
      delete current[key];
      refreshRow(key);
      onEdit(key);
    });
    actions.appendChild(reset);

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "row__del";
    remove.title = "Eliminar este plato de la carta";
    remove.setAttribute("aria-label", "Eliminar " + item.name);
    remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10 11v5M14 11v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    remove.addEventListener("click", function () {
      askConfirm(item.name).then(function (confirmed) {
        if (!confirmed) return;

        if (item.isCustom) {
          var index = -1;
          meta.added.forEach(function (record, position) {
            if (record.section === section.id && record.id === item.id) index = position;
          });
          if (index > -1) {
            undoState = { type: "custom", index: index, record: meta.added[index] };
            meta.added.splice(index, 1);
          }
        } else {
          undoState = { type: "original", key: key, entry: current[key] || null };
          if (meta.removed.indexOf(key) === -1) meta.removed.push(key);
        }
        delete current[key];
        delete defaults[key];

        var node = app.querySelector('[data-key="' + key + '"]');
        if (node) node.remove();
        syncCount(section.id);

        dirty = true;
        clearTimeout(retryTimer);
        showBar("Guardando…", "saving");
        save();
      });
    });
    actions.appendChild(remove);

    row.appendChild(actions);

    /* opciones */
    var options = optionsOf(key);
    if (options && options.length) {
      var wrap = document.createElement("div");
      wrap.className = "row__opts";
      options.forEach(function (option) {
        var label = document.createElement("label");
        label.className = "row__opt";
        label.appendChild(document.createTextNode(option.label));
        var optInput = document.createElement("input");
        optInput.type = "text";
        optInput.inputMode = "decimal";
        optInput.autocomplete = "off";
        optInput.value = priceText(option.price);
        optInput.setAttribute("data-opt", option.label);
        optInput.setAttribute("aria-label", option.label + " de " + item.name);
        optInput.addEventListener("input", function () {
          entryOf(key).options = optionsFromRow(row, key);
          onEdit(key);
        });
        optInput.addEventListener("blur", function () {
          optInput.value = priceText(toNumber(optInput.value));
          onEdit(key);
        });
        label.appendChild(optInput);
        wrap.appendChild(label);
      });
      row.appendChild(wrap);
    }

    return row;
  }

  function optionsFromRow(row, key) {
    var fallback = (defaults[key] && defaults[key].options) || [];
    return Array.prototype.map.call(row.querySelectorAll("[data-opt]"), function (input, index) {
      return {
        label: (fallback[index] && fallback[index].label) || input.getAttribute("data-opt"),
        price: toNumber(input.value)
      };
    });
  }

  /* ---------- nuevo plato ---------- */

  function buildAddForm(section) {
    var form = document.createElement("form");
    form.className = "add";
    form.hidden = true;
    form.innerHTML =
      '<div class="add__grid">' +
        '<label class="add__wide">Nombre del plato<input name="name" type="text" maxlength="60" required autocomplete="off" placeholder="Ej. Parrilla mixta"></label>' +
        '<label>Precio $<input name="price" type="text" inputmode="decimal" autocomplete="off" placeholder="Opcional"></label>' +
        '<label>Tamaño<input name="size" type="text" maxlength="18" autocomplete="off" placeholder="Opcional"></label>' +
      "</div>" +
      '<label>Descripción <span>Opcional</span><textarea name="desc" rows="2" maxlength="160" placeholder="Los ingredientes o el acompañamiento"></textarea></label>' +
      '<label class="add__photo">Foto <span>Opcional · JPG, PNG o WebP</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp"></label>' +
      '<div class="add__actions">' +
        '<button type="button" class="add__cancel">Cancelar</button>' +
        '<button type="submit" class="add__save">Agregar a la carta</button>' +
      "</div>";

    form.querySelector(".add__cancel").addEventListener("click", function () {
      form.reset();
      form.hidden = true;
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var nameInput = form.querySelector('[name="name"]');
      var name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        return;
      }

      var file = form.querySelector('[name="photo"]').files[0];
      if (file && file.size > 8 * 1024 * 1024) {
        showBar("La foto pesa más de 8 MB. Usa una imagen más liviana.", "error");
        return;
      }

      var id = slugify(name) + "-" + Date.now().toString(36).slice(-4);
      var key = section.id + ":" + id;
      var record = {
        section: section.id,
        id: id,
        name: name,
        sizeLabel: form.querySelector('[name="size"]').value.trim() || null,
        desc: form.querySelector('[name="desc"]').value.trim() || null,
        price: toNumber(form.querySelector('[name="price"]').value),
        img: null
      };

      var submit = form.querySelector(".add__save");
      submit.disabled = true;

      var photo = file
        ? uploadPhoto(file, key).then(function (url) {
            record.img = url;
          }).catch(function () {
            showBar("El plato se agregó sin foto: no se pudo subir la imagen.", "error");
          })
        : Promise.resolve();

      photo.then(function () {
        meta.added.push(record);
        dirty = true;
        render();

        var row = app.querySelector('[data-key="' + key + '"]');
        if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });

        showBar("Guardando…", "saving");
        save();
      });
    });

    return form;
  }

  /* ---------- render ---------- */

  function render() {
    var openPanels = {};
    Array.prototype.forEach.call(app.querySelectorAll(".panel"), function (panel) {
      openPanels[panel.getAttribute("data-section")] = panel.open;
    });

    app.innerHTML = "";

    var intro = document.createElement("div");
    intro.className = "intro";
    intro.innerHTML =
      "<h1>Precios, fotos y platos de la carta</h1>" +
      "<p>Escribe el precio en dólares y toca la foto de un plato para cambiarla. Con el botón <strong>Agregar plato</strong> sumas uno nuevo al final de su sección y con el basurero lo quitas de la carta. Se guarda solo y la carta de las mesas se actualiza en segundos. Deja el precio vacío para mostrar <code>Consultar</code>.</p>" +
      "<p>En <strong>Carta de domicilios</strong> ajustas el WhatsApp, el horario del negocio, la hora en que se habilita la carta de la noche, el mínimo, el envío (que se confirma por WhatsApp según la distancia y la hora) y los textos de pago. Los platos y los precios son los mismos para las dos cartas.</p>";
    app.appendChild(intro);

    if (domi) app.appendChild(buildDomiPanel(openPanels.domicilios));

    viewSections().forEach(function (section, index) {
      var panel = document.createElement("details");
      panel.className = "panel";
      panel.setAttribute("data-section", section.id);
      panel.open = openPanels[section.id] !== undefined ? openPanels[section.id] : index < 1;

      var head = document.createElement("summary");
      head.className = "panel__head";
      head.innerHTML =
        '<svg class="panel__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span class="panel__title">' + esc(section.title) + "</span>" +
        '<span class="panel__count">' + countText(section.items.length) + "</span>";
      panel.appendChild(head);

      var body = document.createElement("div");
      body.className = "panel__body";
      section.items.forEach(function (item) {
        body.appendChild(buildRow(section, item));
      });
      panel.appendChild(body);

      var foot = document.createElement("div");
      foot.className = "panel__foot";
      var openForm = document.createElement("button");
      openForm.type = "button";
      openForm.className = "add-btn";
      openForm.innerHTML = '<span aria-hidden="true">+</span> Agregar plato';
      var form = buildAddForm(section);

      openForm.addEventListener("click", function () {
        form.hidden = !form.hidden;
        if (!form.hidden) {
          var field = form.querySelector('[name="name"]');
          if (field) field.focus();
        }
      });

      foot.appendChild(openForm);
      panel.appendChild(foot);
      panel.appendChild(form);
      app.appendChild(panel);
    });
  }

  /* ---------- guardado ---------- */

  function payload() {
    var out = {};

    if (domi) out.__domicilios__ = JSON.parse(JSON.stringify(domi));

    if (meta.removed.length || meta.added.length) {
      out.__loboburguer__ = {
        removed: meta.removed.slice(),
        added: meta.added.map(function (record) { return record; })
      };
    }

    rowNodes().forEach(function (row) {
      var key = row.getAttribute("data-key");
      var fallback = defaults[key] || { price: null, options: null, img: null };
      var entry = current[key] || {};
      var price = entry.price !== undefined ? entry.price : fallback.price;

      var optInputs = row.querySelectorAll("[data-opt]");
      var options = null;
      if (optInputs.length) options = optionsFromRow(row, key);

      var img = entry.img && entry.img !== fallback.img ? entry.img : null;

      var priceChanged = price !== fallback.price;
      var optionsChanged = options && JSON.stringify(options) !== JSON.stringify(fallback.options);

      if (priceChanged || optionsChanged || img) {
        var item = { price: price };
        if (img) item.img = img;
        if (optionsChanged) item.options = options;
        out[key] = item;
      }
    });

    return out;
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 900);
  }

  function onEdit(key) {
    if (key) syncChangeMark(key);
    var next = payload();
    if (JSON.stringify(next) === JSON.stringify(saved)) return;
    dirty = true;
    clearTimeout(retryTimer);
    showBar("Guardando…", "saving");
    scheduleSave();
  }

  function save() {
    if (!base || !apiKey) {
      showBar("Falta configurar Supabase en assets/config.js.", "error");
      return Promise.resolve();
    }
    if (saving) {
      queued = true;
      return Promise.resolve();
    }

    saving = true;
    var body = payload();

    return fetch(base + "/rest/v1/menu_state?on_conflict=id", {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify([{ id: stateId, state: body }])
    })
      .then(function (response) {
        if (!response.ok) {
          return response.text().then(function (text) {
            throw new Error("HTTP " + response.status + " " + text.slice(0, 120));
          });
        }
        dirty = false;
        saved = JSON.parse(JSON.stringify(body));
        clearTimeout(retryTimer);
        showBar("Guardado. La carta ya muestra los cambios.", "ok", undoState ? 6000 : 2600);
      })
      .catch(function () {
        dirty = true;
        showBar("No se pudo guardar. Revisa la conexión y reintenta.", "error");
        clearTimeout(retryTimer);
        retryTimer = setTimeout(function () { if (dirty) save(); }, 8000);
      })
      .then(function () {
        saving = false;
        if (queued) {
          queued = false;
          save();
        }
      });
  }

  retryBtn.addEventListener("click", function () {
    clearTimeout(retryTimer);
    save();
  });

  undoBtn.addEventListener("click", function () {
    if (!undoState) return;
    if (undoState.type === "custom") {
      meta.added.splice(undoState.index, 0, undoState.record);
    } else {
      meta.removed = meta.removed.filter(function (key) { return key !== undoState.key; });
      if (undoState.entry) current[undoState.key] = undoState.entry;
    }
    undoState = null;
    render();
    dirty = true;
    clearTimeout(retryTimer);
    showBar("Guardando…", "saving");
    save();
  });

  window.addEventListener("online", function () {
    if (dirty) {
      clearTimeout(retryTimer);
      save();
    }
  });

  window.addEventListener("beforeunload", function (event) {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });

  /* ---------- arranque ---------- */

  function start() {
    if (started) return;
    started = true;

    var endpoint = base + "/rest/v1/menu_state?id=eq." + encodeURIComponent(stateId) + "&select=state";

    var load = base && apiKey
      ? fetch(endpoint, {
          headers: { apikey: apiKey, Authorization: "Bearer " + apiKey, Accept: "application/json" },
          cache: "no-store"
        }).then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        }).then(function (rows) {
          var state = rows && rows[0] && rows[0].state;
          return state && typeof state === "object" ? state : {};
        })
      : Promise.reject(new Error("sin configuracion"));

    showBar("Cargando la carta…", "saving");

    load
      .catch(function () { return null; })
      .then(function (state) {
        current = state || {};
        domi = normalizeDomi(current.__domicilios__);
        current.__domicilios__ = domi;
        meta = normalizeMeta(current.__loboburguer__);
        saved = JSON.parse(JSON.stringify(current));
        render();
        if (state) hideBar();
        else {
          showBar("Sin conexión: los cambios no se están guardando.", "error");
        }
      });
  }

  var unlocked = false;
  try { unlocked = sessionStorage.getItem(UNLOCKED) === "1"; } catch (error) {}

  if (unlocked) start();
  else lockScreen();
})();
