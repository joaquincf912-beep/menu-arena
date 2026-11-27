/* Loboburguer Restaurant — carta digital.
   Precios tomados de la carta impresa del restaurante (en dólares).
   El panel de administración guarda los cambios en Supabase y estos
   valores quedan como respaldo si la nube no responde.
   Las fotos son de Pexels (licencia libre) y se pueden cambiar desde el panel.

   Horarios: `from: "late"` esconde el plato o la sección hasta la hora en
   que abre la carta de la noche y `until: "late"` lo apaga a partir de esa
   hora. "late" toma la hora editada en el panel (hoy 5:00 p. m.), así que un
   cambio allí mueve todo el horario. `from: "open"` esconde el plato o la
   sección hasta la hora de apertura del negocio (hoy 6:30 a. m.). Sin marca,
   el plato se vende todo el día. */
window.LOBO_MENU = {
  currency: "$",
  restaurant: "Loboburguer Restaurant",
  phone: "0414-9552961",
  instagram: "loboburguer.restaurant",
  sections: [
    {
      id: "almuerzos",
      title: "Almuerzos",
      from: "open",
      until: "late",
      quitar: ["Ensalada", "Tajadas", "Arroz o pasta"],
      blurb: "Con arroz o pasta, ensalada y tajadas. Servido hasta la tarde.",
      items: [
        { id: "pollo-guisado", name: "Pollo Guisado", price: 9.5, img: "pollo-guisado", desc: "Arroz o pasta, ensalada cocida o rallada y tajadas." },
        { id: "carne-guisada", name: "Carne Guisada", price: 9.5, img: "carne-guisada", desc: "Arroz o pasta, ensalada cocida o rallada y tajadas." },
        { id: "chuleta", name: "Chuleta", price: 8.5, img: "chuleta", desc: "Arroz o pasta, ensalada cocida o rallada y tajadas." },
        { id: "bistec", name: "Bistec", price: 8, img: "bistec", desc: "Arroz o pasta, ensalada cocida o rallada y tajadas." },
        { id: "chuleta-ahumada", name: "Chuleta Ahumada", price: 8, img: "chuleta-ahumada", desc: "Arroz o pasta, ensalada cocida o rallada y tajadas." },
        { id: "pollo-frito", name: "Pollo Frito", price: 10, img: "pollo-frito", desc: "Arroz o pasta, ensalada cocida o rallada y papas fritas." },
        { id: "milanesa-pollo", name: "Milanesa de Pollo", price: 10, img: "milanesa", desc: "Empanizada o a la plancha. Arroz o pasta, ensalada y tajadas." },
        { id: "cochino-frito", name: "Cochino Frito", price: null, img: "cochino-frito", desc: "Arroz o pasta, caraotas, queso y aguacate." },
        { id: "pabellon", name: "Pabellón", price: 8.5, img: "pabellon", desc: "Arroz, carne mechada, caraotas, tajadas, queso y huevo." },
        { id: "carbonara-tradicional", name: "Pasta Carbonara Tradicional", price: 10.5, img: "carbonara", desc: "Con pan al ajillo." },
        { id: "carbonara-premium", name: "Pasta Carbonara Premium", price: 12.5, img: "carbonara-premium", desc: "Con pan al ajillo y milanesa empanizada o a la plancha." },
        { id: "pasticho", name: "Pasticho", price: 7, img: "pasticho", desc: "Ensalada cocida y pan al ajillo." },
        { id: "churrasco", name: "Churrasco con Chimichurri", price: 11, img: "churrasco", desc: "Arroz o pasta, tostón y ensalada cocida, rallada o mixta." },
        { id: "gordon-blue", name: "Milanesa de Pollo Gordon Blue", price: 12, img: "gordon-blue", desc: "Arroz o pasta, ensalada cocida o rallada y tajadas." },
        { id: "pasta-bolona", name: "Pasta a la Boloña", price: 10, img: "pasta-bolona", desc: "Con pan al ajillo." }
      ]
    },
    {
      id: "sopas",
      title: "Sopas",
      from: "open",
      until: "late",
      quitar: ["Cilantro", "Verduras"],
      blurb: "Caldo de la casa, servido hasta la tarde.",
      items: [
        { id: "gallina", name: "Sopa de Gallina", price: 4, img: "sopa-gallina", desc: "Con presas de gallina, verduras y cilantro." },
        { id: "picadillo", name: "Sopa de Picadillo", price: 3, img: "sopa-res", desc: "Carne de res picada, papa, zanahoria y cilantro." },
        { id: "costilla", name: "Sopa de Costilla", price: 3, img: "sopa-res-2", desc: "Costilla de res, verduras y cilantro." },
        { id: "mondongo", name: "Sopa de Mondongo", price: 4, img: "mondongo", desc: "Mondongo, verduras y cilantro." }
      ]
    },
    {
      id: "pollo",
      title: "Pollos",
      quitar: ["Ensalada", "Papas fritas"],
      blurb: "A la brasa y broaster, con hallaquitas, arepas, ensalada y papas.",
      items: [
        { id: "solo", name: "Pollo Asado (solo)", price: 15, img: "pollo-asado", desc: "Solo para llevar." },
        { id: "cuarto", name: "¼ Pollo Asado", price: 7, img: "cuarto-pollo", desc: "2 hallaquitas y ensalada." },
        { id: "medio", name: "½ Pollo Asado", price: 12, img: "pollo-asado-2", desc: "3 hallaquitas y ensalada." },
        { id: "con-refresco", name: "1 Pollo Asado", price: 22, img: "pollo-asado", desc: "5 hallaquitas, ensalada y refresco de 1,25 L." },
        { id: "broaster-medio", name: "½ Pollo Broaster", price: 9.5, img: "broaster", desc: "Arepas, papas fritas y ensalada." },
        { id: "broaster-dos", name: "½ Pollo Broaster", price: 15, img: "broaster-2", desc: "Para 2 personas: arepas, papas fritas y ensalada.", sizeLabel: "Para 2" },
        { id: "broaster-entero", name: "1 Pollo Broaster", price: 29.5, img: "broaster", desc: "14 a 15 piezas, arepas, papas fritas, ensalada y refresco de 1,5 L." }
      ]
    },
    {
      id: "parrillas",
      title: "Parrillas",
      quitar: ["Yuca", "Ensalada", "Chorizo", "Papas fritas"],
      blurb: "Promos al carbón para compartir, con papas fritas o hallaquitas.",
      items: [
        { id: "cuarto-promo", name: "¼ Promo", price: 13.5, img: "parrilla-2", desc: "125 g de solomo, 125 g de cochino, 1 chorizo, ensalada y papas fritas o hallaquitas." },
        { id: "medio-promo", name: "½ Promo", price: 28, img: "parrilla-3", desc: "250 g de solomo, 250 g de cochino, 3 chorizos, ensalada y papas fritas o hallaquitas." },
        { id: "promo", name: "1 Promo", price: 55, img: "parrilla", desc: "500 g de solomo, 500 g de cochino, 5 chorizos, ensalada, papas fritas o hallaquitas y refresco de 2 L.", tag: "Para compartir" },
        { id: "media-premium-carta", name: "½ Premium", price: 47, img: "parrilla-2", desc: "¼ chicharrón carnudo, ¼ carne, ¼ cochino, ½ pollo, chorizos, yuca, ensalada, arepas fritas, tostón, cachapa con queso de mano, natilla y jugo de papelón.", tag: "Para compartir" },
        { id: "premium-carta", name: "1 Premium", price: 80, img: "parrilla-3", desc: "½ chicharrón carnudo, ½ carne, ½ cochino, ½ pollo, chorizos, yuca, ensalada, arepas fritas, tostón, cachapa con queso de mano, natilla y refresco de 2 L.", tag: "Para compartir" }
      ]
    },
    {
      id: "hamburguesas",
      title: "Hamburguesas",
      from: "late",
      quitar: ["Tocineta", "Queso", "Vegetales", "Salsas"],
      blurb: "Disco de carne o pollo, papas ralladas y papas fritas.",
      items: [
        { id: "sencilla", name: "Sencilla", price: 4, img: "hamburguesa", desc: "Disco de carne o pollo, vegetales, papas ralladas y queso amarillo." },
        { id: "doble", name: "Doble", price: 5.5, img: "hamburguesa", desc: "Doble disco de carne o pollo, vegetales, papas ralladas, queso amarillo y huevo. Incluye ración de papas fritas.", quitar: ["Huevo", "Tocineta", "Queso", "Vegetales", "Salsas"] },
        { id: "guapa", name: "Guapa", price: 15, img: "hamburguesa", desc: "Carne picada (milanesa, lomito y chuleta ahumada), tocineta, queso amarillo, maíz, aguacate, vegetales y papas ralladas. Incluye ración de papas fritas.", quitar: ["Maíz", "Aguacate", "Tocineta", "Queso", "Vegetales", "Salsas"] },
        { id: "crispy", name: "Crispy", price: 10, img: "hamburguesa", desc: "200 g de milanesa empanizada, tocineta, queso amarillo, maíz, aguacate, vegetales y papas ralladas. Incluye ración de papas fritas.", quitar: ["Maíz", "Aguacate", "Tocineta", "Queso", "Vegetales", "Salsas"] }
      ]
    },
    {
      id: "especiales",
      title: "Especiales",
      quitar: ["Tocineta", "Queso", "Vegetales", "Salsas"],
      blurb: "César y cachapas todo el día; pepitos, shawarmas y salchipapas por la noche.",
      items: [
        { id: "pepito", name: "Pepito", price: 15, from: "late", img: "pepito", desc: "300 g de proteína (milanesa, lomito y chuleta ahumada), tocineta, papas ralladas, queso, aguacate y maíz. Incluye ración de papas." },
        { id: "shawarma", name: "Shawarma", price: 10, from: "late", img: "shawarma", desc: "Proteína (milanesa, lomito y chuleta ahumada), tocineta, papas ralladas, queso y aguacate. Incluye ración de papas fritas." },
        { id: "salchipapa", name: "Salchipapa", price: 10, from: "late", img: "salchipapa", desc: "300 g de papas fritas, 100 g de salchichas, 200 g de queso amarillo, tocineta y salsas." },
        { id: "salchipapa-especial", name: "Salchipapa Especial", price: 14, from: "late", img: "salchipapa", desc: "300 g de papas fritas, 100 g de salchichas, 200 g de proteína, tocineta, queso amarillo y salsas." },
        { id: "club-house", name: "Club House", price: 12, from: "late", img: "club-house", desc: "250 g de milanesa, huevo, jamón, tocineta, queso amarillo, vegetales y 200 g de papas fritas." },
        { id: "tender", name: "Tenders de Pollo", price: 10, from: "late", img: "tender", desc: "200 g de proteína y 300 g de papas fritas." },
        { id: "cesar-tradicional", name: "Ensalada César", price: 9, img: "ensalada-cesar", desc: "Tradicional.", sizeLabel: "tradicional", quitar: ["Queso parmesano", "Crutones"] },
        { id: "cesar-premium", name: "Ensalada César", price: 12, img: "ensalada-cesar-pollo", desc: "Con milanesa.", sizeLabel: "con milanesa", quitar: ["Queso parmesano", "Crutones"] },
        { id: "cachapa-sola", name: "Cachapa", price: 2.5, img: "cachapa", desc: "Sola.", sizeLabel: "sola", quitar: ["Queso de mano", "Cochino frito"] },
        { id: "cachapa-queso", name: "Cachapa", price: 6, img: "cachapa-queso", desc: "Con queso de mano.", sizeLabel: "con queso de mano", quitar: ["Queso de mano", "Cochino frito"] },
        { id: "cachapa-queso-cochino", name: "Cachapa", price: 10, img: "cachapa-cochino", desc: "Con queso de mano y cochino.", sizeLabel: "con queso y cochino", quitar: ["Queso de mano", "Cochino frito"] }
      ]
    },
    {
      id: "arroz-chino",
      title: "Arroz Chino",
      quitar: ["Pollo", "Cochino", "Jamón", "Camarones"],
      blurb: "Especial de la casa y con camarones.",
      items: [
        { id: "especial", name: "Arroz Especial", price: 6, img: "arroz-especial", desc: "Pollo, cochino y jamón." },
        { id: "especial-2", name: "Arroz Especial", price: 9, img: "arroz-chino", desc: "Con 2 contornos a elección.", sizeLabel: "2 contornos" },
        { id: "camarones", name: "Arroz con Camarones", price: 7, img: "camarones", desc: "Pollo, cochino, jamón y camarones." }
      ]
    },
    {
      id: "extras",
      title: "Extras",
      quitar: [],
      blurb: "Raciones para completar el pedido.",
      items: [
        { id: "papas-fritas", name: "Ración de Papas", price: 4.5, img: "papas-fritas", desc: "" },
        { id: "natilla", name: "Ración de Natilla", price: 2.5, img: "natilla", desc: "" },
        { id: "queso-mano", name: "Ración de Queso de Mano", price: 4, img: "queso-mano", desc: "" },
        { id: "arepas", name: "Ración de Arepas", price: 1.5, img: "arepas-fritas", desc: "" }
      ]
    },
    {
      id: "postres",
      title: "Postres",
      quitar: [],
      blurb: "Smoothies, milkshakes, torta y quesillo.",
      items: [
        { id: "smoothie", name: "Smoothie", price: 3, img: "smoothie", desc: "Fresa, mora o piña." },
        { id: "milkshake", name: "Milkshake", price: 6, img: "milkshake", desc: "Toddy con Oreo." },
        { id: "torta", name: "Torta de la Casa", price: null, img: "torta", desc: "" },
        { id: "quesillo", name: "Quesillo", price: null, img: "quesillo", desc: "" }
      ]
    },
    {
      id: "bebidas",
      title: "Jugos y Bebidas",
      quitar: [],
      blurb: "Jugos naturales, refrescos y maltas bien frías.",
      items: [
        {
          id: "papelon", name: "Papelón", price: 1, img: "jugo", desc: "Con limón.",
          options: [ { label: "Vaso", price: 1 }, { label: "½ jarra", price: 2 }, { label: "1 jarra", price: 3 } ]
        },
        {
          id: "parchita", name: "Parchita", price: 1.5, img: "jugo", desc: "Jugo natural de parchita.",
          options: [ { label: "Vaso", price: 1.5 }, { label: "½ jarra", price: 3 }, { label: "1 jarra", price: 4.5 } ]
        },
        {
          id: "nestea", name: "Nestea", price: 2, img: "refresco", desc: "",
          options: [ { label: "Vaso", price: 2 }, { label: "½ jarra", price: 4 }, { label: "1 jarra", price: 5.5 } ]
        },
        { id: "refresco-lata", name: "Refresco de Lata", price: 1.8, img: "refresco", desc: "" },
        { id: "refresco-350", name: "Refresco 350 ml", price: 1.5, img: "refresco-3", desc: "" },
        { id: "refresco-1l", name: "Refresco 1 L", price: 2, img: "refresco-4", desc: "" },
        { id: "refresco-125", name: "Refresco 1,25 L", price: 2, img: "refresco-2", desc: "" },
        { id: "refresco-15", name: "Refresco 1,5 L", price: 2.5, img: "refresco-3", desc: "" },
        { id: "refresco-2l", name: "Refresco 2 L", price: 3, img: "refresco-4", desc: "" },
        { id: "gatorade", name: "Gatorade", price: 2.5, img: "refresco-2", desc: "" },
        { id: "yuky-pak", name: "Yuky Pak", price: 1.5, img: "jugo-2", desc: "" },
        { id: "yukery-250", name: "Yukery 250 ml", price: 2, img: "jugo", desc: "" },
        { id: "yukery-500", name: "Yukery 500 ml", price: 3.5, img: "jugo-2", desc: "" },
        { id: "yukery-15", name: "Yukery 1,5 L", price: 6, img: "jugo", desc: "" },
        { id: "lipton-500", name: "Lipton 500 ml", price: 3.5, img: "refresco-3", desc: "" },
        { id: "lipton-15", name: "Lipton 1,5 L", price: 6, img: "refresco-4", desc: "" },
        { id: "agua-350", name: "Agua 350 ml", price: 1, img: "agua", desc: "" },
        { id: "agua-600", name: "Agua 600 ml", price: 1.5, img: "agua", desc: "" },
        { id: "agua-15", name: "Agua 1,5 L", price: 3, img: "agua", desc: "" },
        { id: "soda", name: "Soda", price: 2, img: "refresco", desc: "" },
        { id: "malta-desechable", name: "Malta Desechable", price: 1.8, img: "malta-2", desc: "" },
        { id: "malta-retornable", name: "Malta Retornable", price: 1.5, img: "malta", desc: "" },
        { id: "malta-15", name: "Malta 1,5 L", price: 4.5, img: "malta-2", desc: "" }
      ]
    }
  ]
};
