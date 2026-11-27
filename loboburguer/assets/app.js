/* Loboburguer Restaurant — carta: render, búsqueda y precios en vivo. */
(function () {
  var menu = window.LOBO_MENU;
  if (!menu) return;

  var config = window.LOBO_CONFIG || {};
  var stateId = config.stateId || "__lobo_menu__";
  var base = String(config.supabaseUrl || "").replace(/\/$/, "");
  var apiKey = config.supabaseKey || "";
  var IMG_BASE = "assets/img/d/";
  var IMG_EXT = ".jpg";

  var esc = function (text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  var norm = function (text) {
    return String(text == null ? "" : text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  var money = function (value) {
    if (value === null || value === undefined || value === "") return "Consultar";
    var n = Number(value);
    if (!isFinite(n) || n <= 0) return "Consultar";
    var text = n.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
    return menu.currency + text;
  };

  var cheapest = function (options, fallback) {
    var prices = [];
    (options || []).forEach(function (option) {
      if (option.price !== null && option.price !== undefined && Number(option.price) > 0) prices.push(Number(option.price));
    });
    if (!prices.length) return fallback === undefined ? null : fallback;
    return Math.min.apply(null, prices);
  };

  var srcFor = function (value) {
    if (!value) return "";
    if (/^(https?:|data:|blob:|\/)/.test(value)) return value;
    if (value.indexOf("assets/") === 0) return value;
    return IMG_BASE + value + IMG_EXT;
  };

  /* ---------- render ---------- */

  var main = document.getElementById("menu");
  var chips = document.getElementById("chips");
  var registry = {};
  var defaults = {};

  var meta = { removed: [], added: [] };
  var stateCache = {};
  var renderedSig = "";
  var sections = [];
  var chipMap = {};
  var navObserver = null;

  var signature = function (value) {
    var removed = (value && value.removed) || [];
    var added = (value && value.added) || [];
    return removed.join(",") + "|" + added.map(function (item) {
      return [item.section, item.id, item.name, item.sizeLabel || "", item.desc || "", item.price == null ? "" : item.price, item.img || ""].join("~");
    }).join("|");
  };

  var itemMarkup = function (section, item) {
    var key = section.id + ":" + item.id;
    defaults[key] = {
      price: item.price === undefined ? null : item.price,
      options: item.options ? item.options.map(function (o) { return { label: o.label, price: o.price }; }) : null,
      img: item.img || null
    };

    var img = srcFor(item.img);
    var search = norm(item.name + " " + (item.sizeLabel || "") + " " + (item.desc || "") + " " + section.title);

    var options = "";
    if (item.options) {
      options = '<ul class="dish__opts">' + item.options.map(function (option) {
        return "<li><span>" + esc(option.label) + "</span><b data-opt=\"" + esc(option.label) + "\">" +
          money(option.price) + "</b></li>";
      }).join("") + "</ul>";
    }

    return '<article class="dish" data-key="' + esc(key) + '" data-search="' + esc(search) + '">' +
      '<figure class="dish__ph">' + (img ? '<img src="' + esc(img) + '" alt="' + esc(item.name) + '" loading="lazy" decoding="async" width="120" height="120">' : "") + "</figure>" +
      '<div class="dish__text">' +
        '<div class="dish__row">' +
          '<h3 class="dish__name">' + esc(item.name) +
            (item.sizeLabel ? " <em>" + esc(item.sizeLabel) + "</em>" : "") +
          "</h3>" +
          '<span class="dish__lead" aria-hidden="true"></span>' +
          '<p class="dish__price" data-role="price"></p>' +
        "</div>" +
        (item.tag ? '<span class="dish__tag">' + esc(item.tag) + "</span>" : "") +
        '<span class="dish__flag" data-role="flag" hidden>Agotado</span>' +
        (item.desc ? '<p class="dish__desc">' + esc(item.desc) + "</p>" : "") +
        options +
      "</div>" +
    "</article>";
  };

  /* El panel puede quitar platos o sumar platos propios; la carta se
     reconstruye cuando esa estructura cambia. */

  var buildSections = function () {
    var removed = {};
    (meta.removed || []).forEach(function (key) { removed[key] = true; });

    return menu.sections.map(function (section) {
      var items = section.items.filter(function (item) {
        return !removed[section.id + ":" + item.id];
      });
      (meta.added || []).forEach(function (item) {
        if (item.section === section.id && !removed[section.id + ":" + item.id]) items.push(item);
      });
      return { id: section.id, title: section.title, blurb: section.blurb, items: items };
    }).filter(function (section) { return section.items.length > 0; });
  };

  var draw = function () {
    var list = buildSections();
    var blocks = [];
    var chipLinks = [];

    defaults = {};
    registry = {};

    list.forEach(function (section) {
      blocks.push(
        '<section class="cat" id="' + esc(section.id) + '" data-section="' + esc(section.id) + '">' +
          '<header class="cat__head">' +
            '<p class="cat__index">' + section.items.length +
              (section.items.length === 1 ? " plato" : " platos") + "</p>" +
            '<h2 class="cat__title">' + esc(section.title) + "</h2>" +
            (section.blurb ? '<p class="cat__blurb">' + esc(section.blurb) + "</p>" : "") +
            '<div class="cat__rule" aria-hidden="true"><i></i></div>' +
          "</header>" +
          '<div class="grid">' + section.items.map(function (item) { return itemMarkup(section, item); }).join("") + "</div>" +
        "</section>"
      );

      chipLinks.push('<a class="chip" href="#' + esc(section.id) + '" data-target="' + esc(section.id) + '">' +
        esc(section.title) + "</a>");
    });

    main.innerHTML = blocks.join("");
    chips.innerHTML = chipLinks.join("");

  Array.prototype.forEach.call(main.querySelectorAll(".dish"), function (node) {
    registry[node.getAttribute("data-key")] = {
      node: node,
      price: node.querySelector('[data-role="price"]'),
      ph: node.querySelector(".dish__ph")
    };
  });

    Array.prototype.forEach.call(main.querySelectorAll(".dish__ph img"), function (img) {
      img.addEventListener("error", function () {
        img.remove();
      });
    });

    sections = Array.prototype.slice.call(main.querySelectorAll(".cat"));
    chipMap = {};
    Array.prototype.forEach.call(chips.children, function (chip) {
      chipMap[chip.getAttribute("data-target")] = chip;
    });

    if (navObserver) navObserver.disconnect();
    navObserver = null;

    if ("IntersectionObserver" in window) {
      navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) markActive(entry.target.id);
        });
      }, { rootMargin: "-38% 0px -56% 0px", threshold: 0 });
      sections.forEach(function (section) { navObserver.observe(section); });
    }

    renderedSig = signature(meta);

    if (typeof paint === "function") {
      Object.keys(registry).forEach(function (key) { paint(key, stateCache[key] || null, false); });
    }
    if (search && search.value.trim() && typeof applyFilter === "function") applyFilter();
  };

  draw();

  /* ---------- pintar precios e imágenes ---------- */

  var liveValue = {};

  var flash = function (node) {
    node.classList.remove("is-live");
    void node.offsetWidth;
    node.classList.add("is-live");
    setTimeout(function () { node.classList.remove("is-live"); }, 1200);
  };

  var setPhoto = function (target, name, value) {
    if (!target.ph) return;
    var wanted = srcFor(value);
    var img = target.ph.querySelector("img");

    if (!wanted) {
      if (img) img.remove();
      return;
    }
    if (img && img.getAttribute("src") === wanted) return;

    if (!img) {
      img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 120;
      img.height = 120;
      img.addEventListener("error", function () { img.remove(); });
      target.ph.appendChild(img);
    }
    img.alt = name;
    img.src = wanted;
  };

  var paint = function (key, entry, animate) {
    var target = registry[key];
    var fallback = defaults[key];
    if (!target || !fallback) return;

    if (typeof entry === "number") entry = { price: entry };

    var blocked = !!(entry && entry.blocked);
    var price = entry && Object.prototype.hasOwnProperty.call(entry, "price") ? entry.price : fallback.price;
    var options = entry && Array.isArray(entry.options) && entry.options.length ? entry.options : fallback.options;
    if (price !== null && price !== undefined) price = Number(price);
    if (price !== null && !isFinite(price)) price = fallback.price;

    var label;
    var isFrom = false;
    if (options && options.length) {
      var from = cheapest(options, price);
      label = from ? "desde " + money(from) : "Consultar";
      isFrom = true;
    } else {
      label = money(price);
    }

    if (target.price) {
      var before = target.price.textContent;
      target.price.textContent = label;
      target.price.classList.toggle("is-soft", label === "Consultar" || isFrom);
      if (animate && before && before !== label) flash(target.price);
    }

    if (options && options.length) {
      options.forEach(function (option) {
        var node = target.node.querySelector('[data-opt="' + option.label.replace(/"/g, '\\"') + '"]');
        if (node) node.textContent = money(option.price);
      });
    }

    setPhoto(target, target.node.querySelector(".dish__name").textContent.trim(), entry && entry.img ? entry.img : fallback.img);

    target.node.classList.toggle("is-blocked", blocked);
    var flag = target.node.querySelector('[data-role="flag"]');
    if (flag) flag.hidden = !blocked;
  };

  Object.keys(registry).forEach(function (key) { paint(key, null, false); });

  /* ---------- precios en vivo (silencioso) ---------- */

  if (base && apiKey) {
    var endpoint = base + "/rest/v1/menu_state?id=eq." + encodeURIComponent(stateId) + "&select=state";
    var loading = false;

    var applyState = function (state) {
      stateCache = state && typeof state === "object" ? state : {};

      var nextMeta = stateCache.__loboburguer__ || { removed: [], added: [] };
      if (signature(nextMeta) !== renderedSig) {
        meta = nextMeta;
        draw();
        return;
      }

      Object.keys(registry).forEach(function (key) {
        var next = stateCache[key] || null;
        if (JSON.stringify(next) === JSON.stringify(liveValue[key] || null)) return;
        liveValue[key] = next;
        paint(key, next, true);
      });
    };

    var load = function () {
      if (loading) return;
      loading = true;
      var controller = "AbortController" in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (controller) controller.abort(); }, 9000);

      fetch(endpoint, {
        headers: { apikey: apiKey, Authorization: "Bearer " + apiKey, Accept: "application/json" },
        cache: "no-store",
        signal: controller ? controller.signal : undefined
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (rows) {
          var row = rows && rows[0];
          applyState((row && row.state) || {});
        })
        .catch(function () {})
        .then(function () {
          clearTimeout(timer);
          loading = false;
        });
    };

    load();
    setInterval(function () {
      if (document.visibilityState === "visible" && navigator.onLine) load();
    }, 12000);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") load();
    });
    window.addEventListener("focus", load);
    window.addEventListener("online", load);
  }

  /* ---------- alto real de la barra en el teléfono ---------- */

  var header = document.getElementById("top");
  var syncHead = function () {
    if (!header) return;
    document.documentElement.style.setProperty("--head", header.offsetHeight + "px");
  };
  syncHead();
  window.addEventListener("resize", syncHead);
  window.addEventListener("orientationchange", syncHead);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHead);

  /* ---------- barra de progreso ---------- */

  var progress = document.getElementById("progress");

  var updateProgress = function () {
    if (!progress) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.transform = "scaleX(" + value + ")";
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  window.addEventListener("orientationchange", updateProgress);
  window.addEventListener("load", updateProgress);
  updateProgress();

  /* ---------- navegación ---------- */

  var markActive = function (id) {
    Array.prototype.forEach.call(chips.children, function (chip) { chip.classList.remove("is-active"); });
    var active = chipMap[id];
    if (!active) return;
    active.classList.add("is-active");
    if (active.offsetLeft < chips.scrollLeft || active.offsetLeft > chips.scrollLeft + chips.clientWidth - 90) {
      chips.scrollTo({ left: Math.max(0, active.offsetLeft - 24), behavior: "smooth" });
    }
  };

  chips.addEventListener("click", function (event) {
    var chip = event.target.closest(".chip");
    if (chip) markActive(chip.getAttribute("data-target"));
  });

  /* Anclajes suaves: con <base>, dejar que el navegador navegue al hash
     recargaría la página cuando se sirve sin barra final. */
  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  });

  /* ---------- búsqueda ---------- */

  var search = document.getElementById("search");
  var empty = document.getElementById("empty");
  var searchTimer;

  search.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilter, 90);
  });

  var applyFilter = function () {
    var term = norm(search.value.trim());
    var any = false;

    sections.forEach(function (section) {
      var visible = 0;
      Array.prototype.forEach.call(section.querySelectorAll(".dish"), function (dish) {
        var match = !term || dish.getAttribute("data-search").indexOf(term) !== -1;
        dish.classList.toggle("is-hidden", !match);
        if (match) visible += 1;
      });
      section.classList.toggle("is-hidden", visible === 0);
      if (visible) any = true;
    });

    empty.hidden = any;
  };
})();
