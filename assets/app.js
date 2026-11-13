/* ARENAS Grill · Bar — render, navegación, búsqueda. */
(function () {
  var menu = window.ARENAS_MENU;
  if (!menu) return;

  var money = function (value) {
    if (value === null || value === undefined) return "—";
    var hasCents = Math.round(value * 100) % 100 !== 0;
    return menu.currency + value.toFixed(hasCents ? 2 : 0);
  };

  var slug = function (text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
  };

  var el = function (tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  };

  /* ---------- render ---------- */

  var main = document.getElementById("menu");
  var chips = document.getElementById("chips");
  var eagerCount = 0;

  menu.sections.forEach(function (section) {
    var block = el("section", "section");
    block.id = section.id;
    block.setAttribute("data-section", section.id);

    var head = el("header", "section__head");
    head.innerHTML =
      '<p class="section__kicker">' + section.items.length + " platos</p>" +
      "<h2>" + section.title + "</h2>" +
      '<p class="section__blurb">' + section.blurb + "</p>" +
      '<div class="section__ornament" aria-hidden="true"><span></span>' +
      '<svg viewBox="0 0 40 24"><path d="M20 22V9M20 9c0-4-3-7-7-7 0 4 3 7 7 7Zm0 0c0-4 3-7 7-7 0 4-3 7-7 7ZM20 16c-3 0-6-2-6-5 3 0 6 2 6 5Zm0 0c3 0 6-2 6-5-3 0-6 2-6 5Z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>' +
      "<span></span></div>";
    block.appendChild(head);

    var grid = el("div", "grid");
    section.items.forEach(function (item) {
      var card = el("article", "dish");
      card.setAttribute("data-name", (item.name + " " + (item.sizeLabel || "") + " " + item.desc).toLowerCase());
      if (item.sizeLabel) card.setAttribute("data-size", item.sizeLabel.toLowerCase());

      var topPrice = item.options && item.options.length
        ? "desde " + money(item.options[0].price !== null ? item.options[0].price : item.price)
        : (item.price === null ? "Consultar" : money(item.price));

      var alt = item.name + (item.sizeLabel ? " (" + item.sizeLabel + ")" : "") + " — Arenas Grill Bar";
      var base = "assets/img/dishes/" + item.img;
      var priority = eagerCount < 3 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
      eagerCount++;
      card.innerHTML =
        '<div class="dish__media">' +
          "<picture>" +
            '<source type="image/webp" srcset="' + base + '-200.webp 200w, ' + base + '-400.webp 400w, ' + base + '-900.webp 900w"' +
              ' sizes="(max-width: 720px) 104px, (max-width: 1024px) 45vw, 380px">' +
            '<img src="' + base + '-600.jpg" alt="' + alt.replace(/"/g, "&quot;") + '" ' + priority + ' decoding="async" width="1200" height="900">' +
          "</picture>" +
          (item.tag ? '<span class="dish__tag">' + item.tag + "</span>" : "") +
        "</div>" +
        '<div class="dish__body">' +
          '<div class="dish__head">' +
            '<h3 class="dish__name">' + item.name +
              (item.sizeLabel ? ' <em>' + item.sizeLabel + "</em>" : "") + "</h3>" +
            '<span class="dish__price">' + topPrice + "</span>" +
          "</div>" +
          '<p class="dish__desc">' + item.desc + "</p>" +
          (item.options && item.options.length ? optionsMarkup(item.options) : "") +
          (item.variants && item.variants.length
            ? '<ul class="dish__variants">' + item.variants.map(function (v) {
                return "<li>" + v + "</li>";
              }).join("") + "</ul>"
            : "") +
        "</div>";
      grid.appendChild(card);
    });

    block.appendChild(grid);
    main.appendChild(block);

    var chip = el("a", "chip", section.title);
    chip.href = "#" + section.id;
    chip.setAttribute("data-target", section.id);
    chips.appendChild(chip);
  });

  /* índice rápido: mapa del menú completo para móvil */
  var qindex = el("nav", "qindex");
  qindex.setAttribute("aria-label", "Índice del menú");
  qindex.innerHTML = menu.sections.map(function (section) {
    var first = section.items[0];
    var base = "assets/img/dishes/" + first.img;
    return '<a class="qindex__item" href="#' + section.id + '">' +
      '<img src="' + base + '-200.webp" alt="" width="200" height="150" loading="lazy" decoding="async">' +
      '<span class="qindex__text"><b>' + section.title + '</b><i>' + section.items.length + " platos</i></span>" +
      "</a>";
  }).join("");
  main.parentNode.insertBefore(qindex, main);

  function optionsMarkup(options) {
    return '<ul class="dish__options">' + options.map(function (o) {
      return '<li><span class="dish__opt-label">' + o.label + "</span><i></i>" +
        '<span class="dish__opt-price">' + (o.price === null ? "Consultar" : money(o.price)) + "</span></li>";
    }).join("") + "</ul>";
  }

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
    Array.prototype.forEach.call(document.querySelectorAll(".dish"), function (dish) {
      revealObserver.observe(dish);
    });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".dish"), function (dish) {
      dish.classList.add("is-in");
    });
  }

  /* seguro: si algo no se revela (scroll muy rápido en móvil), se muestra igual */
  setTimeout(function () {
    Array.prototype.forEach.call(document.querySelectorAll(".dish:not(.is-in)"), function (dish) {
      dish.classList.add("is-in");
    });
  }, 2500);

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
    timer = setTimeout(applyFilter, 120);
  });

  function applyFilter() {
    var term = search.value.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    var anyVisible = false;

    sections.forEach(function (section) {
      var visibleHere = 0;
      Array.prototype.forEach.call(section.querySelectorAll(".dish"), function (dish) {
        var haystack = dish.getAttribute("data-name")
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        var match = !term || haystack.indexOf(term) !== -1;
        dish.classList.toggle("is-hidden", !match);
        if (match) {
          visibleHere++;
          dish.classList.add("is-in");
        }
      });
      section.classList.toggle("is-hidden", visibleHere === 0);
      if (visibleHere) anyVisible = true;
    });

    empty.hidden = anyVisible;
  }

  /* ---------- varios ---------- */

  document.getElementById("year").textContent = new Date().getFullYear();

  var toolbar = document.getElementById("toolbar");
  var onScroll = function () {
    toolbar.classList.toggle("is-stuck", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
