/* ARENAS Grill · Bar — claves estables de cada plato.
   Se usan para guardar y leer los precios en Supabase. */
window.ArenasPricing = {
  slug: function (text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },
  key: function (sectionId, item) {
    var key = sectionId + ":" + this.slug(item.name);
    if (item.sizeLabel) key += ":" + this.slug(item.sizeLabel);
    return key;
  }
};
