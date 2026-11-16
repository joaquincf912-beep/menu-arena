/* =========================================================
   ARENAS GRILL BAR — Núcleo compartido
   Datos, persistencia local, formato y estado del local.
   ========================================================= */
(function () {
  "use strict";

  var KEY = "arenas.menu.v1";
  var TZ = "America/Caracas";
  var DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var DAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  var BASE = window.ARENAS_MENU;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function get() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.business && Array.isArray(parsed.products) && Array.isArray(parsed.categories)) {
          if (!Array.isArray(parsed.hours)) parsed.hours = clone(BASE.hours);
          return parsed;
        }
      }
    } catch (err) {
      console.warn("No se pudo leer el menú guardado:", err);
    }
    return clone(BASE);
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.warn("No se pudo guardar el menú:", err);
      return false;
    }
  }

  function reset() {
    try {
      localStorage.removeItem(KEY);
    } catch (err) {
      console.warn(err);
    }
  }

  function isCustom() {
    try {
      return Boolean(localStorage.getItem(KEY));
    } catch (err) {
      return false;
    }
  }

  function money(value) {
    var n = Number(value) || 0;
    return "US$ " + n.toFixed(2);
  }

  function toMinutes(hhmm) {
    var parts = String(hhmm || "").split(":");
    var h = Number(parts[0]);
    var m = Number(parts[1]);
    if (isNaN(h) || isNaN(m)) return 0;
    return h * 60 + m;
  }

  function fmtTime(minutes) {
    var total = ((Number(minutes) || 0) % 1440 + 1440) % 1440;
    var h = Math.floor(total / 60);
    var m = total % 60;
    var suffix = h >= 12 ? "p.m." : "a.m.";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + (m < 10 ? "0" + m : m) + " " + suffix;
  }

  function nowCaracas() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TZ,
        hourCycle: "h23",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
      }).formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var dow = 0;
      var hour = 0;
      var minute = 0;
      parts.forEach(function (part) {
        if (part.type === "weekday") dow = map[part.value] !== undefined ? map[part.value] : 0;
        if (part.type === "hour") hour = Number(part.value) % 24;
        if (part.type === "minute") minute = Number(part.value);
      });
      return { dow: dow, minutes: hour * 60 + minute };
    } catch (err) {
      var d = new Date();
      return { dow: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function rulesFor(state, dow) {
    return (state.hours || []).filter(function (rule) {
      return Array.isArray(rule.days) && rule.days.indexOf(dow) !== -1 && rule.open && rule.close;
    });
  }

  function openRuleAt(state, dow, minutes) {
    var rules = rulesFor(state, dow);
    for (var i = 0; i < rules.length; i++) {
      var open = toMinutes(rules[i].open);
      var close = toMinutes(rules[i].close);
      if (open === close) continue;
      if (open < close) {
        if (minutes >= open && minutes < close) return { closes: close };
      } else if (minutes >= open) {
        return { closes: close + 1440 };
      }
    }
    var previous = rulesFor(state, (dow + 6) % 7);
    for (var j = 0; j < previous.length; j++) {
      var pOpen = toMinutes(previous[j].open);
      var pClose = toMinutes(previous[j].close);
      if (pOpen > pClose && minutes < pClose) return { closes: pClose };
    }
    return null;
  }

  function todayHours(state) {
    var dow = nowCaracas().dow;
    var rules = rulesFor(state, dow);
    if (!rules.length) return "Cerrado hoy";
    return rules
      .map(function (rule) {
        return fmtTime(toMinutes(rule.open)) + " – " + fmtTime(toMinutes(rule.close));
      })
      .join(" · ");
  }

  function status(state) {
    var now = nowCaracas();
    var current = openRuleAt(state, now.dow, now.minutes);
    if (current) {
      return {
        open: true,
        label: "Abierto",
        detail: "Cerramos a las " + fmtTime(current.closes),
        today: todayHours(state)
      };
    }
    for (var offset = 0; offset <= 7; offset++) {
      var dow = (now.dow + offset) % 7;
      var opens = rulesFor(state, dow)
        .map(function (rule) {
          return toMinutes(rule.open);
        })
        .sort(function (a, b) {
          return a - b;
        });
      for (var i = 0; i < opens.length; i++) {
        if (offset === 0 && opens[i] <= now.minutes) continue;
        var dayLabel =
          offset === 0 ? "hoy" : offset === 1 ? "mañana" : "el " + DAY_NAMES[dow].toLowerCase();
        return {
          open: false,
          label: "Cerrado",
          detail: "Abrimos " + dayLabel + " a las " + fmtTime(opens[i]),
          today: todayHours(state)
        };
      }
    }
    return {
      open: false,
      label: "Cerrado",
      detail: "Consulta nuestros horarios por WhatsApp",
      today: todayHours(state)
    };
  }

  function scheduleList(state) {
    var dow = nowCaracas().dow;
    return (state.hours || []).map(function (rule) {
      var isToday = Array.isArray(rule.days) && rule.days.indexOf(dow) !== -1;
      return {
        label: rule.label || (Array.isArray(rule.days)
          ? rule.days.map(function (d) { return DAY_SHORT[d]; }).join(", ")
          : "Horario"),
        range: fmtTime(toMinutes(rule.open)) + " – " + fmtTime(toMinutes(rule.close)),
        today: isToday
      };
    });
  }

  window.ArenasStore = {
    KEY: KEY,
    get: get,
    save: save,
    reset: reset,
    isCustom: isCustom,
    money: money,
    fmtTime: fmtTime,
    nowCaracas: nowCaracas,
    todayHours: todayHours,
    status: status,
    scheduleList: scheduleList,
    dayNames: DAY_NAMES,
    dayShort: DAY_SHORT
  };
})();
