/* =========================================================
   ARENAS GRILL & BAR — Carta digital
   Render de la carta, carrito y pedido por WhatsApp.
   ========================================================= */
(function () {
  "use strict";

  var Store = window.ArenasStore;
  var state = Store.get();
  var money = Store.money;
  var CART_KEY = "arenas.cart.v1";

  var $ = function (selector, root) {
    return (root || document).querySelector(selector);
  };

  var els = {
    masthead: $("#masthead"),
    topDot: $("#topDot"),
    topStatus: $("#topStatus"),
    topHours: $("#topHours"),
    heroStatus: $("#heroStatus"),
    heroToday: $("#heroToday"),
    hoursStatus: $("#hoursStatus"),
    hoursState: $("#hoursState"),
    hoursDetail: $("#hoursDetail"),
    hoursList: $("#hoursList"),
    footerToday: $("#footerToday"),
    signatureGrid: $("#signatureGrid"),
    chips: $("#chips"),
    search: $("#search"),
    sections: $("#menuSections"),
    cartCount: $("#cartCount"),
    cartDrawer: $("#cartDrawer"),
    cartEmpty: $("#cartEmpty"),
    cartItems: $("#cartItems"),
    clearCart: $("#clearCart"),
    orderForm: $("#orderForm"),
    cartTotal: $("#cartTotal"),
    cartBar: $("#cartBar"),
    cartBarItems: $("#cartBarItems"),
    cartBarTotal: $("#cartBarTotal"),
    overlay: $("#overlay"),
    openCart: $("#openCart"),
    closeCart: $("#closeCart"),
    emptyCta: $("#emptyCta"),
    sendOrder: $("#sendOrder"),
    formError: $("#formError"),
    addressField: $("#addressField"),
    customerName: $("#customerName"),
    address: $("#address"),
    notes: $("#notes"),
    toast: $("#toast"),
    toastText: $("#toastText")
  };

  /* ---------------- Utilidades ---------------- */
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function productById(id) {
    for (var i = 0; i < state.products.length; i++) {
      if (state.products[i].id === id) return state.products[i];
    }
    return null;
  }

  function categoryById(id) {
    for (var i = 0; i < state.categories.length; i++) {
      if (state.categories[i].id === id) return state.categories[i];
    }
    return { name: "Carta", image: "flatlay", icon: "" };
  }

  function isAvailable(product) {
    return product.available !== false;
  }

  function photoSrc(value) {
    if (/^(https?:|data:)/i.test(String(value || ""))) return String(value);
    return "assets/img/" + value + ".webp";
  }

  function photoOf(product) {
    if (product.photo) return product.photo;
    var name = normalize((product.name || "") + " " + (product.desc || ""));
    if (/wing|alita/.test(name)) return "wings";
    if (/taco|fajita|burrito|quesadilla|nacho|chimichang|birria|pastor/.test(name)) {
      return product.cat === "compartir" ? "tacos2" : "tacos";
    }
    if (/hamburguesa/.test(name)) return product.cat === "urbano" ? "burger2" : "burger";
    if (/pollo|tender|broaster/.test(name)) return "chicken";
    if (/cerveza|tobo/.test(name)) return "beer";
    if (/mojito|cuba|margarita|daikiri|pina colada|whisky|cocktail/.test(name)) return "cocktail";
    if (/costilla|cerdo|chicharron|cochino|ribs/.test(name)) return "ribs";
    if (/lomito|filet|carne|solomo|churrasco|punta|parrilla/.test(name)) return "steak";
    if (/tequen/.test(name)) return "wings";
    var category = categoryById(product.cat);
    return category.image || "flatlay";
  }

  function toast(message) {
    els.toastText.textContent = message;
    els.toast.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () {
      els.toast.classList.remove("is-visible");
    }, 2300);
  }

  var plusIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
    '<path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>';

  /* ---------------- Enlaces ---------------- */
  function initLinks() {
    var business = state.business;
    var waHref = "https://wa.me/" + business.whatsapp;
    ["#headerWa", "#heroWa", "#hoursWa", "#contactWa", "#footerWa", "#topWa", "#karaokeWa"].forEach(function (id) {
      var node = $(id);
      if (node) node.href = waHref;
    });
    ["#contactIg", "#footerIg", "#topIg"].forEach(function (id) {
      var node = $(id);
      if (node) node.href = business.instagram;
    });
    $("#footerYear").textContent =
      "© " + new Date().getFullYear() + " " + business.name + ". Todos los derechos reservados.";
  }

  /* ---------------- Horario ---------------- */
  function renderStatus() {
    var info = Store.status(state);

    els.topDot.classList.toggle("is-open", info.open);
    els.topStatus.textContent = info.open
      ? "Abierto · " + info.detail
      : "Cerrado · " + info.detail;
    els.topHours.textContent = "Hoy · " + info.today;
    els.topDot.title = info.label;

    els.heroStatus.textContent = info.open ? "Abierto ahora" : "Cerrado ahora";
    els.heroToday.textContent = info.today;

    els.hoursStatus.dataset.state = info.open ? "open" : "closed";
    els.hoursState.textContent = info.open ? "Abierto ahora" : "Cerrado ahora";
    els.hoursDetail.textContent = info.detail;

    els.footerToday.textContent = "Hoy · " + info.today;

    els.hoursList.innerHTML = Store.scheduleList(state)
      .map(function (row) {
        return (
          '<li class="schedule-row' +
          (row.today ? " is-today" : "") +
          '"><span class="schedule-day">' +
          escapeHtml(row.label) +
          '</span><span class="schedule-leader"></span><span class="schedule-range">' +
          escapeHtml(row.range) +
          "</span></li>"
        );
      })
      .join("");
  }

  /* ---------------- Selección de la casa ---------------- */
  function renderSignature() {
    var preferred = ["parrilla-mar-tierra", "pollo-broaster", "arenas-big-melt", "bandeja-tex-mex"];
    var picks = preferred
      .map(productById)
      .filter(function (product) {
        return product && product.photo;
      });

    if (picks.length < 4) {
      state.products.forEach(function (product) {
        if (picks.length < 4 && product.photo && picks.indexOf(product) === -1) picks.push(product);
      });
    }

    els.signatureGrid.innerHTML = picks
      .map(function (product) {
        var available = isAvailable(product);
        return (
          '<article class="signature-card reveal">' +
          '<button class="signature-media" type="button" data-add="' +
          escapeHtml(product.id) +
          '" aria-label="Agregar ' +
          escapeHtml(product.name) +
          ' al pedido">' +
          '<img src="' +
          escapeHtml(photoSrc(photoOf(product))) +
          '" alt="' +
          escapeHtml(product.name) +
          '" width="400" height="310" loading="lazy" decoding="async" />' +
          (product.tag
            ? '<span class="signature-tag">' + escapeHtml(product.tag) + "</span>"
            : "") +
          "</button>" +
          '<div class="signature-body">' +
          '<h3 class="signature-title">' +
          escapeHtml(product.name) +
          "</h3>" +
          '<p class="signature-desc">' +
          escapeHtml(product.desc || "") +
          "</p>" +
          '<div class="signature-foot">' +
          '<span class="price">' +
          money(product.price) +
          "</span>" +
          (available
            ? '<button class="btn-text" type="button" data-add="' +
              escapeHtml(product.id) +
              '">Agregar ' +
              plusIcon +
              "</button>"
            : '<span class="btn-text">Agotado</span>') +
          "</div></div></article>"
        );
      })
      .join("");

    observeReveals(els.signatureGrid);
  }

  /* ---------------- Carrito ---------------- */
  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(function (item) {
          return item && item.id && productById(item.id);
        })
        .map(function (item) {
          return { id: item.id, qty: Math.max(1, Math.min(99, Number(item.qty) || 1)) };
        });
    } catch (err) {
      return [];
    }
  }

  var cart = loadCart();

  function persistCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn("No se pudo guardar el pedido:", err);
    }
  }

  function cartTotals() {
    var items = 0;
    var total = 0;
    cart.forEach(function (item) {
      var product = productById(item.id);
      if (!product) return;
      items += item.qty;
      total += product.price * item.qty;
    });
    return { items: items, total: total };
  }

  function addToCart(id) {
    var product = productById(id);
    if (!product) return;
    if (!isAvailable(product)) {
      toast("Ese plato está agotado por ahora");
      return;
    }
    var line = cart.filter(function (item) {
      return item.id === id;
    })[0];
    if (line) {
      line.qty = Math.min(99, line.qty + 1);
    } else {
      cart.push({ id: id, qty: 1 });
    }
    persistCart();
    renderCart();
    toast(product.name + " · agregado al pedido");
  }

  function changeQty(id, delta) {
    var line = cart.filter(function (item) {
      return item.id === id;
    })[0];
    if (!line) return;
    line.qty += delta;
    if (line.qty < 1) {
      cart = cart.filter(function (item) {
        return item.id !== id;
      });
    }
    persistCart();
    renderCart();
  }

  function removeLine(id) {
    cart = cart.filter(function (item) {
      return item.id !== id;
    });
    persistCart();
    renderCart();
  }

  function renderCart() {
    var totals = cartTotals();
    els.cartCount.textContent = String(totals.items);
    els.cartTotal.textContent = money(totals.total);
    els.cartBarTotal.textContent = money(totals.total);
    els.cartBarItems.textContent =
      totals.items === 0
        ? "Sin productos"
        : totals.items + (totals.items === 1 ? " producto" : " productos");
    els.cartBar.classList.toggle("is-visible", totals.items > 0);

    if (!cart.length) {
      els.cartEmpty.hidden = false;
      els.cartItems.innerHTML = "";
      els.clearCart.hidden = true;
      els.orderForm.hidden = true;
      return;
    }

    els.cartEmpty.hidden = true;
    els.orderForm.hidden = false;
    els.clearCart.hidden = false;

    els.cartItems.innerHTML = cart
      .map(function (item) {
        var product = productById(item.id);
        if (!product) return "";
        return (
          '<div class="cart-item">' +
          '<div class="cart-thumb"><img src="' +
          escapeHtml(photoSrc(photoOf(product))) +
          '" alt="" width="58" height="58" loading="lazy" decoding="async" /></div>' +
          '<div class="cart-item-main">' +
          '<div class="cart-item-name">' +
          escapeHtml(product.name) +
          "</div>" +
          '<div class="cart-item-unit">' +
          money(product.price) +
          " c/u</div>" +
          '<div class="cart-item-controls">' +
          '<div class="stepper">' +
          '<button type="button" data-dec="' +
          escapeHtml(product.id) +
          '" aria-label="Quitar una unidad de ' +
          escapeHtml(product.name) +
          '">−</button>' +
          "<span>" +
          item.qty +
          "</span>" +
          '<button type="button" data-inc="' +
          escapeHtml(product.id) +
          '" aria-label="Agregar una unidad de ' +
          escapeHtml(product.name) +
          '">+</button>' +
          "</div>" +
          '<button type="button" class="cart-remove" data-remove="' +
          escapeHtml(product.id) +
          '">Quitar</button>' +
          "</div></div>" +
          '<div class="cart-item-total">' +
          money(product.price * item.qty) +
          "</div></div>"
        );
      })
      .join("");
  }

  /* ---------------- Carta ---------------- */
  function dishRow(product) {
    var available = isAvailable(product);
    return (
      '<li class="dish' +
      (available ? "" : " is-soldout") +
      '">' +
      '<div class="dish-copy">' +
      '<div class="dish-line"><h3 class="dish-name">' +
      escapeHtml(product.name) +
      '</h3><span class="dish-leader"></span><span class="dish-price">' +
      money(product.price) +
      "</span></div>" +
      (product.desc ? '<p class="dish-desc">' + escapeHtml(product.desc) + "</p>" : "") +
      (available
        ? product.tag
          ? '<span class="dish-tag">' + escapeHtml(product.tag) + "</span>"
          : ""
        : '<span class="dish-tag">Agotado</span>') +
      "</div>" +
      (available
        ? '<button type="button" class="dish-add" data-add="' +
          escapeHtml(product.id) +
          '" aria-label="Agregar ' +
          escapeHtml(product.name) +
          ' al pedido">' +
          plusIcon +
          "</button>"
        : "") +
      "</li>"
    );
  }

  function renderChips() {
    els.chips.innerHTML = state.categories
      .map(function (category) {
        var count = state.products.filter(function (product) {
          return product.cat === category.id;
        }).length;
        if (!count) return "";
        return (
          '<button type="button" class="cat-link" data-target="cat-' +
          escapeHtml(category.id) +
          '">' +
          escapeHtml(category.name) +
          "</button>"
        );
      })
      .join("");
  }

  function renderSections(query) {
    var needle = normalize(query);
    var produced = 0;
    var html = "";

    state.categories.forEach(function (category, catIndex) {
      var items = state.products.filter(function (product) {
        if (product.cat !== category.id) return false;
        if (!needle) return true;
        return (
          normalize(product.name).indexOf(needle) !== -1 ||
          normalize(product.desc).indexOf(needle) !== -1 ||
          normalize(product.tag).indexOf(needle) !== -1 ||
          normalize(category.name).indexOf(needle) !== -1
        );
      });

      if (!items.length) return;
      produced += items.length;

      html +=
        '<section class="course' +
        (!needle && catIndex > 0 ? " is-collapsed" : "") +
        '" id="cat-' +
        escapeHtml(category.id) +
        '" data-cat="' +
        escapeHtml(category.id) +
        '">' +
        '<aside class="course-aside">' +
        '<p class="course-index">' +
        escapeHtml(category.icon || "") +
        "</p>" +
        '<h2 class="course-title">' +
        escapeHtml(category.name) +
        "</h2>" +
        '<p class="course-note">' +
        escapeHtml(category.note || "") +
        "</p>" +
        (category.image
          ? '<figure class="course-photo"><img src="assets/img/' +
            escapeHtml(category.image) +
            '.webp" alt="' +
            escapeHtml(category.name) +
            '" width="300" height="380" loading="lazy" decoding="async" /></figure>'
          : "") +
        '<span class="course-count">' +
        items.length +
        (items.length === 1 ? " plato" : " platos") +
        "</span>" +
        '<button class="course-toggle" type="button" data-toggle="' +
        escapeHtml(category.id) +
        '" aria-expanded="' +
        (!needle && catIndex > 0 ? "false" : "true") +
        '"><span>' +
        (!needle && catIndex > 0 ? "Ver platos" : "Ocultar platos") +
        '</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        "</aside>" +
        '<div class="course-body"><ul class="dishes">' +
        items.map(dishRow).join("") +
        "</ul></div></section>";
    });

    if (!produced) {
      html =
        '<div class="empty-results"><strong>Sin resultados</strong><span>No encontramos platos para “' +
        escapeHtml(query) +
        "”. Prueba con otra palabra.</span></div>";
    }

    els.sections.innerHTML = html;
    observeReveals(els.sections);
    setActiveChipFromScroll();
  }

  /* ---------------- Animación ---------------- */
  function observeReveals(root) {
    var nodes = root.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (node) {
        node.classList.add("is-in");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
    );
    nodes.forEach(function (node, index) {
      node.style.transitionDelay = Math.min(index % 4, 3) * 60 + "ms";
      observer.observe(node);
    });
  }

  /* ---------------- Navegación de categorías ---------------- */
  function setActiveChip(catId) {
    els.chips.querySelectorAll(".cat-link").forEach(function (chip) {
      chip.classList.toggle("is-active", chip.dataset.target === "cat-" + catId);
    });
  }

  function setCourseOpen(section, open) {
    if (!section) return;
    section.classList.toggle("is-collapsed", !open);
    var toggle = section.querySelector("[data-toggle]");
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    var label = toggle.querySelector("span");
    if (label) label.textContent = open ? "Ocultar platos" : "Ver platos";
  }

  function setActiveChipFromScroll() {
    var sections = els.sections.querySelectorAll(".course");
    if (!sections.length) return;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top - 190 <= 0) current = section;
    });
    if (current) setActiveChip(current.dataset.cat);
  }

  function setupScrollSpy() {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        els.masthead.classList.toggle("is-stuck", window.scrollY > 40);
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          setActiveChipFromScroll();
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------------- Carrito: abrir y cerrar ---------------- */
  var lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    document.body.classList.add("is-locked");
    els.overlay.classList.add("is-open");
    els.cartDrawer.classList.add("is-open");
    els.cartDrawer.setAttribute("aria-hidden", "false");
    window.setTimeout(function () {
      els.closeCart.focus();
    }, 130);
  }

  function closeDrawer() {
    document.body.classList.remove("is-locked");
    els.overlay.classList.remove("is-open");
    els.cartDrawer.classList.remove("is-open");
    els.cartDrawer.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------------- Pedido por WhatsApp ---------------- */
  function currentMode() {
    var selected = els.orderForm.querySelector('input[name="mode"]:checked');
    return selected ? selected.value : "delivery";
  }

  function syncMode() {
    var isPickup = currentMode() === "pickup";
    els.addressField.hidden = isPickup;
    if (isPickup) els.address.classList.remove("is-invalid");
  }

  function showError(message) {
    if (!message) {
      els.formError.hidden = true;
      els.formError.textContent = "";
      return;
    }
    els.formError.textContent = message;
    els.formError.hidden = false;
  }

  function buildMessage(name, mode, address, notes) {
    var lines = [];
    lines.push("*NUEVO PEDIDO · " + state.business.name.toUpperCase() + "*");
    lines.push("");
    lines.push("*Cliente:* " + name);
    lines.push("*Modalidad:* " + (mode === "delivery" ? "Delivery" : "Retiro en el local"));
    if (mode === "delivery") lines.push("*Dirección:* " + address);
    lines.push("");
    lines.push("*Pedido:*");
    cart.forEach(function (item) {
      var product = productById(item.id);
      if (!product) return;
      lines.push("• " + item.qty + " × " + product.name + " — " + money(product.price * item.qty));
    });
    lines.push("");
    lines.push("*Total: " + money(cartTotals().total) + "*");
    if (notes) {
      lines.push("");
      lines.push("*Notas:* " + notes);
    }
    lines.push("");
    lines.push("Pedido enviado desde la carta digital.");
    return lines.join("\n");
  }

  function sendOrder() {
    if (!cart.length) {
      toast("Agrega al menos un plato para continuar");
      return;
    }

    var name = els.customerName.value.trim();
    var mode = currentMode();
    var address = els.address.value.trim();
    var notes = els.notes.value.trim();

    els.customerName.classList.remove("is-invalid");
    els.address.classList.remove("is-invalid");
    showError("");

    if (name.length < 2) {
      els.customerName.classList.add("is-invalid");
      els.customerName.focus();
      showError("Escribe tu nombre para identificar el pedido.");
      return;
    }

    if (mode === "delivery" && address.length < 6) {
      els.address.classList.add("is-invalid");
      els.address.focus();
      showError("Indica la dirección de entrega o selecciona retiro en el local.");
      return;
    }

    var url =
      "https://wa.me/" +
      encodeURIComponent(state.business.whatsapp) +
      "?text=" +
      encodeURIComponent(buildMessage(name, mode, address, notes));

    var opened = window.open(url, "_blank", "noopener");
    if (!opened) window.location.href = url;
    toast("Abriendo WhatsApp con tu pedido…");
  }

  /* ---------------- Eventos ---------------- */
  function bindEvents() {
    [els.sections, els.signatureGrid].forEach(function (root) {
      root.addEventListener("click", function (event) {
        var trigger = event.target.closest("[data-add]");
        if (!trigger) return;
        addToCart(trigger.dataset.add);
      });
    });

    els.chips.addEventListener("click", function (event) {
      var chip = event.target.closest(".cat-link");
      if (!chip) return;
      setActiveChip(chip.dataset.target.replace("cat-", ""));
      var section = document.getElementById(chip.dataset.target);
      if (!section) return;
      setCourseOpen(section, true);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    els.sections.addEventListener("click", function (event) {
      var toggle = event.target.closest("[data-toggle]");
      if (!toggle) return;
      var section = document.getElementById("cat-" + toggle.dataset.toggle);
      if (!section) return;
      setCourseOpen(section, section.classList.contains("is-collapsed"));
    });

    var searchTimer;
    els.search.addEventListener("input", function () {
      clearTimeout(searchTimer);
      var value = els.search.value;
      searchTimer = setTimeout(function () {
        renderSections(value);
      }, 130);
    });

    els.openCart.addEventListener("click", openDrawer);
    els.closeCart.addEventListener("click", closeDrawer);
    els.overlay.addEventListener("click", closeDrawer);
    els.cartBar.addEventListener("click", openDrawer);
    els.emptyCta.addEventListener("click", function () {
      closeDrawer();
      document.getElementById("carta").scrollIntoView({ behavior: "smooth" });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && els.cartDrawer.classList.contains("is-open")) closeDrawer();
    });

    els.cartItems.addEventListener("click", function (event) {
      var inc = event.target.closest("[data-inc]");
      var dec = event.target.closest("[data-dec]");
      var remove = event.target.closest("[data-remove]");
      if (inc) changeQty(inc.dataset.inc, 1);
      if (dec) changeQty(dec.dataset.dec, -1);
      if (remove) removeLine(remove.dataset.remove);
    });

    els.clearCart.addEventListener("click", function () {
      cart = [];
      persistCart();
      renderCart();
      toast("Pedido vaciado");
    });

    els.orderForm.querySelectorAll('input[name="mode"]').forEach(function (input) {
      input.addEventListener("change", syncMode);
    });

    els.sendOrder.addEventListener("click", sendOrder);

    [els.customerName, els.address].forEach(function (field) {
      field.addEventListener("input", function () {
        field.classList.remove("is-invalid");
        if (
          !els.customerName.classList.contains("is-invalid") &&
          !els.address.classList.contains("is-invalid")
        ) {
          showError("");
        }
      });
    });
  }

  /* ---------------- Sincronización en vivo con Supabase ---------------- */
  var cloudUpdatedAt = "";

  function applyCloudState(next) {
    if (!next || !next.business || !Array.isArray(next.products)) return;
    state = next;
    Store.save(state);
    initLinks();
    renderStatus();
    renderSignature();
    renderChips();
    renderSections(els.search.value || "");
    renderCart();
  }

  function syncCloud() {
    if (!window.ArenasCloud || !window.ArenasCloud.enabled()) return;
    window.ArenasCloud.load().then(function (result) {
      if (!result || !result.state) return;
      if (result.updatedAt && result.updatedAt === cloudUpdatedAt) return;
      cloudUpdatedAt = result.updatedAt || "";
      applyCloudState(result.state);
    });
  }

  /* ---------------- Arranque ---------------- */
  initLinks();
  renderStatus();
  renderSignature();
  renderChips();
  renderSections("");
  renderCart();
  syncMode();
  bindEvents();
  setupScrollSpy();
  syncCloud();

  window.setInterval(renderStatus, 60 * 1000);
  window.setInterval(syncCloud, 30 * 1000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) syncCloud();
  });
})();
