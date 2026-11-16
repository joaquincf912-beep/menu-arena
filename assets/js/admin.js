/* =========================================================
   ARENAS GRILL BAR — Panel de administración
   Productos, disponibilidad, horarios y ajustes del negocio.
   ========================================================= */
(function () {
  "use strict";

  var Store = window.ArenasStore;
  var state = Store.get();
  var SESSION_KEY = "arenas.admin.session";
  var editingId = null;
  var cloudTimer = null;
  var cloudLoaded = false;

  var $ = function (selector, root) {
    return (root || document).querySelector(selector);
  };
  var $$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toast(message) {
    var node = $("#adminToast");
    $("#adminToastText").textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () {
      node.classList.remove("is-visible");
    }, 2400);
  }

  function persist() {
    if (!Store.save(state)) {
      toast("No se pudo guardar en este navegador");
      return false;
    }
    scheduleCloudSave();
    return true;
  }

  /* ---------------- Sincronización con Supabase ---------------- */
  function cloudEnabled() {
    return Boolean(window.ArenasCloud && window.ArenasCloud.enabled());
  }

  function setCloudStatus(text, kind) {
    var node = $("#cloudStatus");
    if (!node) return;
    node.textContent = text;
    node.className = "cloud-status" + (kind ? " is-" + kind : "");
  }

  function renderCloud() {
    if (!cloudEnabled()) {
      setCloudStatus("Supabase no está configurado en este sitio.", "error");
      $("#cloudForm").hidden = true;
      return;
    }
    var session = window.ArenasCloud.session();
    var logged = Boolean(session && session.access_token);
    $("#cloudForm").hidden = logged;
    $("#cloudLogout").hidden = !logged;
    if (logged) setCloudStatus("Conectado como " + (session.email || "administrador") + ".", "ok");
    else setCloudStatus("Sin sesión. Entra para publicar los cambios en todos los dispositivos.");
  }

  function scheduleCloudSave() {
    if (!cloudEnabled() || !window.ArenasCloud.session()) return;
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(function () {
      window.ArenasCloud.save(state)
        .then(function () {
          setCloudStatus("Cambios publicados en el menú.", "ok");
        })
        .catch(function (error) {
          setCloudStatus(error.message || "No se pudo publicar en la nube.", "error");
        });
    }, 900);
  }

  function applyRemote(result, quiet) {
    if (!result || !result.state) return;
    state = result.state;
    Store.save(state);
    renderAll();
    if (!quiet) toast("Menú actualizado desde la nube");
  }

  function loadCloud(quiet) {
    if (!cloudEnabled()) return;
    setCloudStatus("Cargando menú desde Supabase…");
    window.ArenasCloud.load()
      .then(function (result) {
        if (result && result.state) {
          applyRemote(result, quiet);
          if (!window.ArenasCloud.session()) setCloudStatus("Menú leído desde Supabase. Entra para editarlo.", "ok");
        } else {
          setCloudStatus("Aún no hay un menú publicado en la nube.");
        }
      })
      .catch(function (error) {
        setCloudStatus(error.message || "No se pudo leer Supabase.", "error");
      });
  }

  function slugify(value) {
    return String(value || "plato")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 42) || "plato";
  }

  function categoryById(id) {
    return state.categories.filter(function (category) {
      return category.id === id;
    })[0];
  }

  /* ---------------- Sesión ---------------- */
  function showApp() {
    $("#loginScreen").hidden = true;
    $("#app").hidden = false;
    $("#logoutBtn").hidden = false;
    renderAll();
    renderCloud();
    if (!cloudLoaded) {
      cloudLoaded = true;
      loadCloud(true);
    }
  }

  function showLogin() {
    $("#loginScreen").hidden = false;
    $("#app").hidden = true;
    $("#logoutBtn").hidden = true;
  }

  /* ---------------- Estadísticas ---------------- */
  function renderStats() {
    var total = state.products.length;
    var available = state.products.filter(function (product) {
      return product.available !== false;
    }).length;
    var cards = [
      { label: "Productos en carta", value: total },
      { label: "Disponibles", value: available },
      { label: "Agotados", value: total - available },
      { label: "Categorías", value: state.categories.length }
    ];
    $("#stats").innerHTML = cards
      .map(function (card) {
        return (
          '<div class="stat"><strong>' +
          card.value +
          "</strong><span>" +
          card.label +
          "</span></div>"
        );
      })
      .join("");
  }

  /* ---------------- Productos ---------------- */
  function renderCategoryOptions() {
    var options = state.categories
      .map(function (category) {
        return '<option value="' + escapeHtml(category.id) + '">' + escapeHtml(category.name) + "</option>";
      })
      .join("");
    $("#categoryFilter").innerHTML = '<option value="">Todas las categorías</option>' + options;
    $("#productCat").innerHTML = options;
  }

  function filteredProducts() {
    var needle = $("#productSearch").value.trim().toLowerCase();
    var cat = $("#categoryFilter").value;
    return state.products.filter(function (product) {
      if (cat && product.cat !== cat) return false;
      if (!needle) return true;
      return (
        product.name.toLowerCase().indexOf(needle) !== -1 ||
        String(product.desc || "").toLowerCase().indexOf(needle) !== -1
      );
    });
  }

  function renderProducts() {
    var products = filteredProducts();
    $("#productCount").textContent = products.length + (products.length === 1 ? " producto" : " productos");

    if (!products.length) {
      $("#productRows").innerHTML =
        '<tr><td colspan="5"><div class="table-empty">No hay productos que coincidan con el filtro.</div></td></tr>';
      return;
    }

    $("#productRows").innerHTML = products
      .map(function (product) {
        var category = categoryById(product.cat);
        var available = product.available !== false;
        return (
          "<tr>" +
          '<td><div class="prod-cell"><span class="prod-thumb"><img src="' +
          escapeHtml(product.photo ? previewSrc(product.photo) : "assets/img/" + (category ? category.image : "flatlay") + ".webp") +
          '" alt="" width="44" height="44" loading="lazy" decoding="async" /></span><div><div class="prod-name">' +
          escapeHtml(product.name) +
          '</div><div class="prod-desc">' +
          escapeHtml(product.desc || "Sin descripción") +
          "</div></div></div></td>" +
          '<td><span class="tag-pill">' +
          escapeHtml(category ? category.name : "—") +
          "</span></td>" +
          '<td><input class="price-input" type="number" min="0" step="0.01" value="' +
          Number(product.price).toFixed(2) +
          '" data-price="' +
          escapeHtml(product.id) +
          '" aria-label="Precio de ' +
          escapeHtml(product.name) +
          '"></td>' +
          '<td><label class="switch"><input type="checkbox" data-avail="' +
          escapeHtml(product.id) +
          '"' +
          (available ? " checked" : "") +
          ' aria-label="Disponibilidad de ' +
          escapeHtml(product.name) +
          '"><span class="slider"></span></label></td>' +
          '<td><div class="row-actions">' +
          '<button type="button" class="row-btn" data-edit="' +
          escapeHtml(product.id) +
          '">Editar</button>' +
          '<button type="button" class="row-btn danger" data-del="' +
          escapeHtml(product.id) +
          '">Eliminar</button>' +
          "</div></td></tr>"
        );
      })
      .join("");
  }

  /* ---------------- Horarios ---------------- */
  function renderHoursPreview() {
    var info = Store.status(state);
    $("#hoursPreview").textContent = info.label + " · " + info.detail;
    $("#hoursPreview").dataset.state = info.open ? "open" : "closed";
  }

  function renderHours() {
    $("#hoursEditor").innerHTML = state.hours
      .map(function (rule, index) {
        var days = [1, 2, 3, 4, 5, 6, 0]
          .map(function (day) {
            var active = Array.isArray(rule.days) && rule.days.indexOf(day) !== -1;
            return (
              '<label class="day-chip' +
              (active ? " is-on" : "") +
              '"><input type="checkbox" data-hour-days="' +
              index +
              '" value="' +
              day +
              '"' +
              (active ? " checked" : "") +
              "><span>" +
              Store.dayShort[day][0] +
              "</span></label>"
            );
          })
          .join("");
        return (
          '<div class="hour-card" data-hour-row="' +
          index +
          '">' +
          '<div class="hour-card-head"><input class="text-input hour-label" type="text" value="' +
          escapeHtml(rule.label || "") +
          '" data-hour-label="' +
          index +
          '" aria-label="Nombre del horario"><button type="button" class="row-btn danger" data-hour-del="' +
          index +
          '">Eliminar</button></div>' +
          '<div class="day-picker">' +
          days +
          "</div>" +
          '<div class="hour-range"><label>¿Abre? <input type="time" value="' +
          escapeHtml(rule.open) +
          '" data-hour-open="' +
          index +
          '"></label><label>¿Cierra? <input type="time" value="' +
          escapeHtml(rule.close) +
          '" data-hour-close="' +
          index +
          '"></label></div></div>'
        );
      })
      .join("");
    renderHoursPreview();
  }

  /* ---------------- Ajustes ---------------- */
  function renderSettings() {
    $("#bizName").value = state.business.name || "";
    $("#bizTagline").value = state.business.tagline || "";
    $("#bizWhatsapp").value = state.business.whatsapp || "";
    $("#bizInstagram").value = state.business.instagram || "";
    $("#bizPin").value = state.business.pin || "";
    $("#localBadge").hidden = !Store.isCustom();
  }

  function renderAll() {
    renderStats();
    renderCategoryOptions();
    renderProducts();
    renderHours();
    renderSettings();
    renderCloud();
  }

  /* ---------------- Diálogo de producto ---------------- */
  var dialog = $("#productDialog");
  var removeImage = false;

  function previewSrc(src) {
    if (!src) return "";
    if (/^(https?:|data:)/i.test(String(src))) return String(src);
    return "assets/img/" + String(src) + ".webp";
  }

  function renderImagePreview(src) {
    var preview = $("#imagePreview");
    var empty = $("#imageEmpty");
    var clearBtn = $("#clearImageBtn");
    var hint = $("#imageHint");
    if (src) {
      preview.hidden = false;
      empty.hidden = true;
      preview.innerHTML =
        '<img src="' + escapeHtml(previewSrc(src)) + '" alt="Vista previa del plato" loading="lazy" decoding="async" />';
      clearBtn.hidden = false;
      if (hint) hint.textContent = "Haz clic en la foto para cambiarla.";
    } else {
      preview.hidden = true;
      empty.hidden = false;
      preview.innerHTML = "";
      clearBtn.hidden = true;
      if (hint) hint.textContent = "La foto se guarda en la nube con el menú.";
    }
  }

  function optimizeImage(file, done) {
    var reader = new FileReader();
    reader.onload = function () {
      var image = new Image();
      image.onload = function () {
        var max = 1000;
        var scale = Math.min(1, max / Math.max(image.width, image.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        var type = "image/webp";
        var data = canvas.toDataURL(type, 0.78);
        if (!/^data:image\/webp/i.test(data)) data = canvas.toDataURL("image/jpeg", 0.8);
        done(data);
      };
      image.onerror = function () {
        done(String(reader.result || ""));
      };
      image.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  }

  function openProductDialog(product) {
    editingId = product ? product.id : null;
    removeImage = false;
    $("#dialogTitle").textContent = product ? "Editar producto" : "Nuevo producto";
    $("#productName").value = product ? product.name : "";
    $("#productCat").value = product ? product.cat : state.categories[0].id;
    $("#productPrice").value = product ? Number(product.price).toFixed(2) : "";
    $("#productTag").value = product && product.tag ? product.tag : "";
    $("#productDesc").value = product && product.desc ? product.desc : "";
    $("#productAvailable").checked = product ? product.available !== false : true;
    $("#productImage").value = "";
    $("#productImageUrl").value = product && /^https?:/i.test(String(product.photo || "")) ? product.photo : "";
    renderImagePreview(product && product.photo ? product.photo : null);
    $("#dialogError").hidden = true;
    dialog.showModal();
    $("#productName").focus();
  }

  function persistProduct(photo) {
    var name = $("#productName").value.trim();
    var price = parseFloat($("#productPrice").value);
    var cat = $("#productCat").value;
    var desc = $("#productDesc").value.trim();
    var tag = $("#productTag").value.trim();
    var available = $("#productAvailable").checked;

    if (name.length < 2 || isNaN(price) || price < 0 || !cat) {
      $("#dialogError").textContent = "Completa el nombre y un precio válido.";
      $("#dialogError").hidden = false;
      return;
    }

    if (editingId) {
      state.products = state.products.map(function (product) {
        if (product.id !== editingId) return product;
        var next = {
          id: product.id,
          cat: cat,
          name: name,
          price: Math.round(price * 100) / 100,
          desc: desc,
          tag: tag || undefined,
          available: available
        };
        if (photo !== undefined) next.photo = photo;
        else if (product.photo && !removeImage) next.photo = product.photo;
        return next;
      });
    } else {
      var base = slugify(name);
      var id = base;
      var counter = 2;
      while (
        state.products.some(function (product) {
          return product.id === id;
        })
      ) {
        id = base + "-" + counter;
        counter += 1;
      }
      var next = {
        id: id,
        cat: cat,
        name: name,
        price: Math.round(price * 100) / 100,
        desc: desc,
        tag: tag || undefined,
        available: available
      };
      if (photo) next.photo = photo;
      state.products.unshift(next);
    }

    if (persist()) toast(editingId ? "Producto actualizado" : "Producto agregado");
    dialog.close();
    editingId = null;
    renderStats();
    renderProducts();
  }

  function saveProduct(event) {
    event.preventDefault();
    var fileInput = $("#productImage");
    var file = fileInput.files && fileInput.files[0];
    var url = $("#productImageUrl").value.trim();

    if (file) {
      optimizeImage(file, function (dataUrl) {
        persistProduct(dataUrl);
      });
      return;
    }
    if (url) {
      persistProduct(url);
      return;
    }
    if (removeImage) {
      persistProduct(undefined);
      return;
    }
    persistProduct();
  }

  /* ---------------- Exportar / importar ---------------- */
  function exportData() {
    var content =
      "/* =========================================================\n" +
      "   ARENAS GRILL BAR — Datos del menú\n" +
      "   Exportado desde el panel el " +
      new Date().toLocaleString("es-VE") +
      "\n" +
      "   Reemplaza assets/js/data.js con este archivo para publicar.\n" +
      "   ========================================================= */\n" +
      "window.ARENAS_MENU = " +
      JSON.stringify(state, null, 2) +
      ";\n";
    var blob = new Blob([content], { type: "text/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "data.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast("data.js descargado");
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var text = String(reader.result || "");
        var start = text.indexOf("{");
        var end = text.lastIndexOf("}");
        if (start === -1 || end === -1) throw new Error("Formato inválido");
        var parsed = JSON.parse(text.slice(start, end + 1));
        if (!parsed.business || !Array.isArray(parsed.categories) || !Array.isArray(parsed.products)) {
          throw new Error("Faltan datos del menú");
        }
        if (!Array.isArray(parsed.hours)) parsed.hours = state.hours;
        state = parsed;
        persist();
        renderAll();
        toast("Menú importado correctamente");
      } catch (err) {
        window.alert("No se pudo importar el archivo. Verifica que sea un data.js válido.");
      }
    };
    reader.readAsText(file);
  }

  /* ---------------- Eventos ---------------- */
  function bindEvents() {
    $("#loginForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var pin = $("#pin").value.trim();
      var fresh = Store.get();
      if (pin && pin === String(fresh.business.pin || "")) {
        state = fresh;
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch (err) {
          /* sesión no disponible */
        }
        $("#loginError").hidden = true;
        $("#pin").value = "";
        showApp();
      } else {
        $("#loginError").hidden = false;
        $("#pin").value = "";
        $("#pin").focus();
      }
    });

    $("#logoutBtn").addEventListener("click", function () {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch (err) {
        /* sesión no disponible */
      }
      showLogin();
    });

    $$(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        $$(".tab").forEach(function (other) {
          other.classList.toggle("is-active", other === tab);
        });
        ["products", "hours", "settings"].forEach(function (name) {
          $("#tab-" + name).hidden = name !== tab.dataset.tab;
        });
      });
    });

    $("#newProductBtn").addEventListener("click", function () {
      openProductDialog(null);
    });

    $("#productForm").addEventListener("submit", saveProduct);

    $("#productImage").addEventListener("change", function (event) {
      removeImage = false;
      var file = event.target.files && event.target.files[0];
      if (!file) {
        var current = editingId
          ? state.products.filter(function (p) {
              return p.id === editingId;
            })[0]
          : null;
        renderImagePreview(current && current.photo ? current.photo : null);
        return;
      }
      optimizeImage(file, function (dataUrl) {
        $("#productImageUrl").value = "";
        renderImagePreview(dataUrl);
      });
    });

    $("#productImageUrl").addEventListener("input", function (event) {
      removeImage = false;
      $("#productImage").value = "";
      renderImagePreview(event.target.value.trim() || null);
    });

    var drop = $("#imageDrop");
    ["dragenter", "dragover"].forEach(function (name) {
      drop.addEventListener(name, function (event) {
        event.preventDefault();
        drop.classList.add("is-dragging");
      });
    });
    ["dragleave", "drop"].forEach(function (name) {
      drop.addEventListener(name, function (event) {
        event.preventDefault();
        drop.classList.remove("is-dragging");
      });
    });
    drop.addEventListener("drop", function (event) {
      var file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      if (!file || !/^image\//.test(file.type)) return;
      removeImage = false;
      $("#productImageUrl").value = "";
      optimizeImage(file, function (dataUrl) {
        renderImagePreview(dataUrl);
        toast("Foto lista para guardar");
      });
    });

    $("#clearImageBtn").addEventListener("click", function () {
      removeImage = true;
      $("#productImage").value = "";
      $("#productImageUrl").value = "";
      renderImagePreview(null);
    });
    $("#dialogCancel").addEventListener("click", function () {
      dialog.close();
    });
    $("#dialogCancel2").addEventListener("click", function () {
      dialog.close();
    });

    $("#productSearch").addEventListener("input", renderProducts);
    $("#categoryFilter").addEventListener("change", renderProducts);

    $("#productRows").addEventListener("change", function (event) {
      var priceInput = event.target.closest("[data-price]");
      var availInput = event.target.closest("[data-avail]");
      if (priceInput) {
        var value = parseFloat(priceInput.value);
        if (isNaN(value) || value < 0) {
          toast("Precio inválido");
          renderProducts();
          return;
        }
        state.products = state.products.map(function (product) {
          if (product.id !== priceInput.dataset.price) return product;
          product.price = Math.round(value * 100) / 100;
          return product;
        });
        if (persist()) toast("Precio actualizado");
      }
      if (availInput) {
        var available = availInput.checked;
        state.products = state.products.map(function (product) {
          if (product.id !== availInput.dataset.avail) return product;
          product.available = available;
          return product;
        });
        if (persist()) toast(available ? "Producto disponible" : "Producto marcado como agotado");
        renderStats();
        renderProducts();
      }
    });

    $("#productRows").addEventListener("click", function (event) {
      var edit = event.target.closest("[data-edit]");
      var del = event.target.closest("[data-del]");
      if (edit) {
        var product = state.products.filter(function (item) {
          return item.id === edit.dataset.edit;
        })[0];
        if (product) openProductDialog(product);
      }
      if (del) {
        var target = state.products.filter(function (item) {
          return item.id === del.dataset.del;
        })[0];
        if (!target) return;
        if (window.confirm('¿Eliminar "' + target.name + '" del menú?')) {
          state.products = state.products.filter(function (item) {
            return item.id !== target.id;
          });
          if (persist()) toast("Producto eliminado");
          renderStats();
          renderProducts();
        }
      }
    });

    $("#addHourBtn").addEventListener("click", function () {
      state.hours.push({ label: "Nuevo horario", days: [1, 2, 3, 4, 5], open: "12:00", close: "22:00" });
      if (persist()) toast("Horario agregado");
      renderHours();
    });

    var hoursEditor = $("#hoursEditor");

    hoursEditor.addEventListener("input", function (event) {
      var openInput = event.target.closest("[data-hour-open]");
      var closeInput = event.target.closest("[data-hour-close]");
      var labelInput = event.target.closest("[data-hour-label]");
      if (openInput) {
        state.hours[Number(openInput.dataset.hourOpen)].open = openInput.value;
        persist();
        renderHoursPreview();
      }
      if (closeInput) {
        state.hours[Number(closeInput.dataset.hourClose)].close = closeInput.value;
        persist();
        renderHoursPreview();
      }
      if (labelInput) {
        state.hours[Number(labelInput.dataset.hourLabel)].label = labelInput.value;
        persist();
      }
    });

    hoursEditor.addEventListener("change", function (event) {
      var dayInput = event.target.closest("[data-hour-days]");
      if (!dayInput) return;
      var index = Number(dayInput.dataset.hourDays);
      var day = Number(dayInput.value);
      var rule = state.hours[index];
      if (!rule) return;
      rule.days = Array.isArray(rule.days) ? rule.days : [];
      if (dayInput.checked) {
        if (rule.days.indexOf(day) === -1) rule.days.push(day);
      } else {
        rule.days = rule.days.filter(function (item) {
          return item !== day;
        });
      }
      dayInput.closest(".day-chip").classList.toggle("is-on", dayInput.checked);
      if (persist()) toast("Días actualizados");
      renderHoursPreview();
    });

    hoursEditor.addEventListener("click", function (event) {
      var del = event.target.closest("[data-hour-del]");
      if (!del) return;
      if (state.hours.length <= 1) {
        toast("Debe quedar al menos un horario");
        return;
      }
      state.hours.splice(Number(del.dataset.hourDel), 1);
      if (persist()) toast("Horario eliminado");
      renderHours();
    });

    $("#settingsForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var whatsapp = $("#bizWhatsapp").value.replace(/[^0-9]/g, "");
      var pin = $("#bizPin").value.trim();
      if (whatsapp.length < 8) {
        toast("El WhatsApp debe incluir código de país");
        return;
      }
      if (pin.length < 4) {
        toast("El PIN debe tener al menos 4 caracteres");
        return;
      }
      state.business.name = $("#bizName").value.trim() || state.business.name;
      state.business.tagline = $("#bizTagline").value.trim();
      state.business.whatsapp = whatsapp;
      state.business.instagram = $("#bizInstagram").value.trim();
      state.business.pin = pin;
      if (persist()) toast("Ajustes guardados");
      renderSettings();
    });

    $("#cloudForm").addEventListener("submit", function (event) {
      event.preventDefault();
      if (!cloudEnabled()) return;
      var email = $("#cloudEmail").value.trim();
      var password = $("#cloudPassword").value;
      if (!email || !password) {
        setCloudStatus("Escribe el correo y la contraseña de Supabase.", "error");
        return;
      }
      setCloudStatus("Entrando a la nube…");
      window.ArenasCloud.signIn(email, password)
        .then(function () {
          $("#cloudPassword").value = "";
          renderCloud();
          loadCloud(false);
          toast("Conectado a Supabase");
        })
        .catch(function (error) {
          setCloudStatus(error.message || "No se pudo entrar a la nube.", "error");
        });
    });

    $("#cloudLogout").addEventListener("click", function () {
      window.ArenasCloud.signOut();
      renderCloud();
      setCloudStatus("Sesión cerrada. Los cambios quedan solo en este navegador.");
    });

    $("#exportBtn").addEventListener("click", exportData);
    $("#importInput").addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      if (file) importData(file);
      event.target.value = "";
    });
    $("#resetBtn").addEventListener("click", function () {
      if (!window.confirm("¿Restablecer el menú original? Se perderán los cambios guardados en este navegador.")) return;
      Store.reset();
      state = Store.get();
      renderAll();
      toast("Menú restablecido");
    });
  }

  /* ---------------- Arranque ---------------- */
  bindEvents();
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      state = Store.get();
      showApp();
    }
  } catch (err) {
    showLogin();
  }
})();
