/* ARENAS Grill · Bar — render, navegación, búsqueda. */
(function () {
  var menu = window.ARENAS_MENU;
  if (!menu) return;

  var money = function (value) {
    if (value === null || value === undefined) return "—";
    var hasCents = Math.round(value * 100) % 100 !== 0;
    return menu.currency + value.toFixed(hasCents ? 2 : 0);
  };

  var pricing = window.ArenasPricing;
  var cardByKey = {};
  var itemByKey = {};

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

  var topPriceFor = function (item) {
    return item.options && item.options.length
      ? "desde " + money(item.options[0].price !== null ? item.options[0].price : item.price)
      : (item.price === null ? "Consultar" : money(item.price));
  };

  var paintPrices = function (card, item) {
    var priceNode = card.querySelector('[data-role="price"]');
    if (priceNode) priceNode.textContent = topPriceFor(item);
    if (item.options) {
      item.options.forEach(function (option) {
        var node = card.querySelector('[data-opt="' + option.label + '"]');
        if (node) node.textContent = option.price === null ? "Consultar" : money(option.price);
      });
    }
  };

  function optionsMarkup(options) {
    return '<ul class="dish__options">' + options.map(function (o) {
      return '<li><span class="dish__opt-label">' + esc(o.label) + "</span><i></i>" +
        '<span class="dish__opt-price" data-opt="' + esc(o.label) + '">' + (o.price === null ? "Consultar" : money(o.price)) + "</span></li>";
    }).join("") + "</ul>";
  }

  var ornament =
    '<div class="section__ornament" aria-hidden="true"><span></span>' +
    '<svg viewBox="0 0 40 24"><path d="M20 22V9M20 9c0-4-3-7-7-7 0 4 3 7 7 7Zm0 0c0-4 3-7 7-7 0 4-3 7-7 7ZM20 16c-3 0-6-2-6-5 3 0 6 2 6 5Zm0 0c3 0 6-2 6-5-3 0-6 2-6 5Z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>' +
    "<span></span></div>";

  /* ---------- render (una sola pasada) ---------- */

  var main = document.getElementById("menu");
  var chips = document.getElementById("chips");
  var eagerCount = 0;
  var blocks = [];
  var chipLinks = [];

  menu.sections.forEach(function (section) {
    var cards = section.items.map(function (item) {
      var cardKey = pricing ? pricing.key(section.id, item) : "";
      if (cardKey) itemByKey[cardKey] = item;

      var base = "assets/img/dishes/" + item.img;
      var priority = eagerCount < 3
        ? ' loading="eager" fetchpriority="high"'
        : ' loading="lazy" fetchpriority="low"';
      eagerCount += 1;

      var haystack = norm(item.name + " " + (item.sizeLabel || "") + " " + (item.desc || ""));
      var alt = item.name + (item.sizeLabel ? " (" + item.sizeLabel + ")" : "") + " — Arenas Grill Bar";

      return (
        '<article class="dish"' +
          (cardKey ? ' data-key="' + esc(cardKey) + '"' : "") +
          ' data-search="' + esc(haystack) + '">' +
          '<div class="dish__media"><picture>' +
            '<source type="image/webp" srcset="' + base + '-200.webp 200w, ' + base + '-400.webp 400w, ' + base + '-900.webp 900w"' +
              ' sizes="(max-width: 720px) 104px, (max-width: 1024px) 45vw, 380px">' +
            '<img src="' + base + '-600.jpg" alt="' + esc(alt) + '"' + priority + ' decoding="async" width="1200" height="900">' +
          "</picture>" +
          (item.tag ? '<span class="dish__tag">' + esc(item.tag) + "</span>" : "") +
          "</div>" +
          '<div class="dish__body">' +
            '<div class="dish__head">' +
              '<h3 class="dish__name">' + esc(item.name) +
                (item.sizeLabel ? " <em>" + esc(item.sizeLabel) + "</em>" : "") +
              "</h3>" +
              '<span class="dish__price" data-role="price">' + topPriceFor(item) + "</span>" +
            "</div>" +
            '<p class="dish__desc">' + esc(item.desc) + "</p>" +
            (item.options && item.options.length ? optionsMarkup(item.options) : "") +
            (item.variants && item.variants.length
              ? '<ul class="dish__variants">' + item.variants.map(function (v) {
                  return "<li>" + esc(v) + "</li>";
                }).join("") + "</ul>"
              : "") +
          "</div>" +
        "</article>"
      );
    }).join("");

    blocks.push(
      '<section class="section" id="' + esc(section.id) + '" data-section="' + esc(section.id) + '">' +
        '<header class="section__head">' +
          '<p class="section__kicker">' + section.items.length + " platos</p>" +
          "<h2>" + esc(section.title) + "</h2>" +
          '<p class="section__blurb">' + esc(section.blurb) + "</p>" +
          ornament +
        "</header>" +
        '<div class="grid">' + cards + "</div>" +
      "</section>"
    );

    chipLinks.push(
      '<a class="chip" href="#' + esc(section.id) + '" data-target="' + esc(section.id) + '">' +
        esc(section.title) +
      "</a>"
    );
  });

  main.innerHTML = blocks.join("");
  chips.innerHTML = chipLinks.join("");

  /* mapa clave → tarjeta, en una sola lectura del DOM */
  var tagged = main.querySelectorAll("[data-key]");
  for (var i = 0; i < tagged.length; i++) {
    cardByKey[tagged[i].getAttribute("data-key")] = tagged[i];
  }

  /* índice rápido: mapa del menú completo para móvil */
  main.insertAdjacentHTML(
    "beforebegin",
    '<nav class="qindex" aria-label="Índice del menú">' +
      menu.sections.map(function (section) {
        return '<a class="qindex__item" href="#' + esc(section.id) + '">' +
          '<img src="assets/img/dishes/' + esc(section.items[0].img) + '-200.webp" alt="" width="200" height="150" loading="lazy" decoding="async">' +
          '<span class="qindex__text"><b>' + esc(section.title) + "</b><i>" + section.items.length + " platos</i></span></a>";
      }).join("") +
    "</nav>"
  );

  /* ---------- precios en vivo (Supabase) ---------- */

  (function syncPrices() {
    var config = window.ARENAS_CONFIG || {};
    if (!pricing || !config.supabaseUrl || !config.supabaseAnonKey) return;

    var endpoint = String(config.supabaseUrl).replace(/\/$/, "") +
      "/rest/v1/menu_prices?select=key,price,options";

    fetch(endpoint, { headers: { apikey: config.supabaseAnonKey } })
      .then(function (res) { return res.ok ? res.json() : []; })
      .then(function (rows) {
        (rows || []).forEach(function (row) {
          var item = itemByKey[row.key];
          var card = cardByKey[row.key];
          if (!item || !card) return;
          if (row.price !== null && row.price !== undefined) item.price = Number(row.price);
          if (Array.isArray(row.options) && row.options.length) {
            item.options = row.options.map(function (option) {
              return {
                label: option.label,
                price: option.price === null || option.price === undefined ? null : Number(option.price)
              };
            });
          }
          paintPrices(card, item);
        });
      })
      .catch(function () {
        /* sin conexión o sin configurar: se mantienen los precios locales */
      });
  })();

  /* ---------- navegación activa ---------- */

  var sections = Array.prototype.slice.call(document.querySelectorAll(".section"));
  var chipMap = {};
  Array.prototype.forEach.call(chips.children, function (chip) {
    chipMap[chip.getAttribute("data-target")] = chip;
  });

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Array.prototype.forEach.call(chips.children, function (c) { c.classList.remove("is-active"); });
        var active = chipMap[entry.target.id];
        if (active) {
          active.classList.add("is-active");
          var box = chips.getBoundingClientRect();
          var chipBox = active.getBoundingClientRect();
          if (chipBox.left < box.left || chipBox.right > box.right) {
            chips.scrollTo({ left: active.offsetLeft - 24, behavior: "smooth" });
          }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    var dishes = main.querySelectorAll(".dish");
    for (var d = 0; d < dishes.length; d++) revealObserver.observe(dishes[d]);
  } else {
    Array.prototype.forEach.call(main.querySelectorAll(".dish"), function (dish) {
      dish.classList.add("is-in");
    });
  }

  /* seguro: si algo no se revela (scroll muy rápido en móvil), se muestra igual */
  setTimeout(function () {
    Array.prototype.forEach.call(main.querySelectorAll(".dish:not(.is-in)"), function (dish) {
      dish.classList.add("is-in");
    });
  }, 1800);

  chips.addEventListener("click", function (event) {
    var chip = event.target.closest(".chip");
    if (!chip) return;
    Array.prototype.forEach.call(chips.children, function (c) { c.classList.remove("is-active"); });
    chip.classList.add("is-active");
  });

  /* ---------- búsqueda ---------- */

  var search = document.getElementById("search");
  var empty = document.getElementById("empty");
  var timer;

  search.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(applyFilter, 110);
  });

  function applyFilter() {
    var term = norm(search.value.trim());
    var anyVisible = false;

    sections.forEach(function (section) {
      var visibleHere = 0;
      var dishes = section.querySelectorAll(".dish");
      for (var i = 0; i < dishes.length; i++) {
        var dish = dishes[i];
        var match = !term || dish.getAttribute("data-search").indexOf(term) !== -1;
        dish.classList.toggle("is-hidden", !match);
        if (match) {
          visibleHere += 1;
          if (!dish.classList.contains("is-in")) dish.classList.add("is-in");
        }
      }
      section.classList.toggle("is-hidden", visibleHere === 0);
      if (visibleHere) anyVisible = true;
    });

    empty.hidden = anyVisible;
  }

  /* ---------- varios ---------- */

  document.getElementById("year").textContent = new Date().getFullYear();

  var toolbar = document.getElementById("toolbar");
  var stuck = false;
  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var next = window.scrollY > 40;
      if (next !== stuck) {
        stuck = next;
        toolbar.classList.toggle("is-stuck", next);
      }
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
