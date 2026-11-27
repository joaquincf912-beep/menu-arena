/* Loboburguer Restaurant — carta de noche.
   Precios tomados de la carta impresa de la noche (en dólares).
   Tiene su propio panel (admin-noche.html) y guarda sus cambios en
   menu_state como la clave __noche__ de la misma fila del menú. */
window.LOBO_MENU_NOCHE = {
  currency: "$",
  restaurant: "Loboburguer Restaurant",
  phone: "0414-9552961",
  instagram: "loboburguer.restaurant",
  sections: [
    {
      id: "pollos",
      title: "Pollos",
      blurb: "A la brasa o broaster, con hallaquitas, arepas y ensalada.",
      items: [
        { id: "solo", name: "Pollo Asado", sizeLabel: "solo", price: 15, img: "pollo-asado", desc: "Solo para llevar." },
        { id: "cuarto", name: "¼ Pollo Asado", price: 7, img: "cuarto-pollo", desc: "2 hallaquitas y ensalada." },
        { id: "medio", name: "½ Pollo Asado", price: 12, img: "pollo-asado-2", desc: "3 hallaquitas y ensalada." },
        { id: "entero", name: "1 Pollo Asado", price: 22, img: "pollo-asado-3", desc: "5 hallaquitas, ensalada y refresco de 1,25 L." },
        { id: "broaster-medio", name: "½ Pollo Broaster", price: 9.5, img: "broaster", desc: "Arepas y papas fritas. Ensalada." },
        { id: "broaster-dos", name: "½ Pollo Broaster", sizeLabel: "para 2", price: 15, img: "broaster-2", desc: "Para 2 personas: arepas y papas fritas. Ensalada." },
        { id: "broaster-entero", name: "1 Pollo Broaster", price: 29.5, img: "broaster", desc: "14 a 15 piezas de pollo, arepas y papas fritas, ensalada y refresco de 1,5 L.", tag: "Para compartir" }
      ]
    },
    {
      id: "parrillas",
      title: "Parrillas",
      blurb: "Solomo y cochino al carbón, con chorizos, ensalada y papas o hallaquitas.",
      items: [
        { id: "cuarto-promo", name: "¼ Promo", price: 13.5, img: "parrilla-2", desc: "125 g de solomo, 125 g de cochino, 1 chorizo, ensalada y papas fritas o hallaquitas." },
        { id: "medio-promo", name: "½ Promo", price: 28, img: "parrilla-3", desc: "250 g de solomo, 250 g de cochino, 3 chorizos, ensalada y papas fritas o hallaquitas." },
        { id: "promo", name: "1 Promo", price: 55, img: "parrilla", desc: "500 g de solomo, 500 g de cochino, 5 chorizos, ensalada, papas fritas o hallaquitas y refresco de 2 L.", tag: "Para compartir" },
        { id: "media-premium", name: "½ Premium", price: 47, img: "parrilla-2", desc: "¼ chicharrón carnudo, ¼ de carne, ¼ de cochino, ½ pollo, chorizos, yuca, ensalada, arepas fritas, tostón, cachapa con queso de mano, natilla y jugo de papelón." },
        { id: "premium", name: "1 Premium", price: 80, img: "parrilla-3", desc: "½ chicharrón carnudo, ½ de carne, ½ de cochino, ½ pollo, chorizos, yuca, ensalada, arepas fritas, tostón, cachapa con queso de mano, natilla y refresco de 2 L.", tag: "Para compartir" }
      ]
    },
    {
      id: "hamburguesas",
      title: "Hamburguesas",
      blurb: "Carne o pollo, queso amarillo y papas ralladas. Hechas al momento.",
      items: [
        { id: "sencilla", name: "Sencilla", price: 4, img: "hamburguesa", desc: "Disco de carne o pollo, vegetales, papas ralladas y queso amarillo." },
        { id: "doble", name: "Doble", price: 5.5, img: "hamburguesa", desc: "Doble disco de carne o pollo, vegetales, papas ralladas, queso amarillo, huevo y ración de papas fritas." },
        { id: "guapa", name: "Guapa", price: 15, img: "hamburguesa", desc: "Carne picada (milanesa, lomito y chuleta ahumada), tocineta, queso amarillo, maíz, aguacate, vegetales, papas ralladas y ración de papas fritas.", tag: "La de la casa" },
        { id: "crispy", name: "Crispy", price: 10, img: "milanesa", desc: "200 g de milanesa empanizada, tocineta, queso amarillo, maíz, aguacate, vegetales, papas ralladas y ración de papas fritas." }
      ]
    },
    {
      id: "especiales",
      title: "Especiales",
      blurb: "Sándwiches, salchipapas, tenders y ensaladas.",
      items: [
        { id: "pepito", name: "Pepito", price: 15, img: "pepito", desc: "300 g de proteína (milanesa, lomito y chuleta ahumada), tocineta, papas ralladas, queso, aguacate, maíz y ración de papas fritas." },
        { id: "shawarma", name: "Shawarma", price: 10, img: "shawarma", desc: "Proteína (milanesa, lomito y chuleta ahumada), tocineta, papas ralladas, queso, aguacate, queso amarillo y ración de papas fritas." },
        { id: "salchipapa", name: "Salchipapa", price: 10, img: "salchipapa", desc: "300 g de papas fritas, 100 g de salchichas, 200 g de queso amarillo, tocineta y salsas." },
        { id: "salchipapa-especial", name: "Salchipapa Especial", price: 14, img: "salchipapa", desc: "300 g de papas fritas, 100 g de salchichas, 200 g de proteína, tocineta, queso amarillo y salsas." },
        { id: "club-house", name: "Club House", price: 12, img: "club-house", desc: "250 g de milanesa, huevo, jamón, tocineta, queso amarillo, vegetales y 200 g de papas fritas." },
        { id: "tenders", name: "Tenders de Pollo", price: 10, img: "tender", desc: "200 g de proteína y 300 g de papas fritas." },
        {
          id: "cesar", name: "Ensalada César", price: 9, img: "ensalada-cesar", desc: "",
          options: [ { label: "Tradicional", price: 9 }, { label: "Con milanesa", price: 12 } ]
        },
        {
          id: "cachapa", name: "Cachapa", price: 2.5, img: "cachapa-queso", desc: "",
          options: [ { label: "Sola", price: 2.5 }, { label: "Con queso de mano", price: 6 }, { label: "Con queso y cochino", price: 10 } ]
        }
      ]
    },
    {
      id: "extras",
      title: "Extras",
      blurb: "Raciones para completar la mesa.",
      items: [
        { id: "papas", name: "Ración de Papas", price: 4.5, img: "papas-fritas-2", desc: "" },
        { id: "hallaquitas", name: "Ración de Hallaquitas", price: 2.5, img: "hallaquita", desc: "" },
        { id: "natilla", name: "Ración de Natilla", price: 2.5, img: "natilla", desc: "" },
        { id: "queso-mano", name: "Ración de Queso de Mano", price: 4, img: "queso-mano", desc: "" },
        { id: "toston", name: "Ración de Tostón", price: 2.5, img: "toston", desc: "" },
        { id: "arepas", name: "Ración de Arepas", price: 1.5, img: "arepas-fritas", desc: "" }
      ]
    },
    {
      id: "arroz-chino",
      title: "Arroz Chino",
      blurb: "El especial de la casa, con contornos a elección.",
      items: [
        { id: "especial", name: "Arroz Especial", price: 6, img: "arroz-especial", desc: "Pollo, cochino y jamón." },
        { id: "especial-2", name: "Arroz Especial", sizeLabel: "2 contornos", price: 9, img: "arroz-chino", desc: "Con 2 contornos a elección." },
        { id: "camarones", name: "Arroz con Camarones", price: 7, img: "camarones", desc: "Especial con camarones." }
      ]
    },
    {
      id: "postres",
      title: "Postres",
      blurb: "Smoothies, milkshakes y dulces de la casa.",
      items: [
        { id: "smoothie", name: "Smoothie", price: 3, img: "smoothie", desc: "Fresa, mora o piña." },
        { id: "milkshake", name: "Milkshake", price: 6, img: "milkshake", desc: "Tody y Oreo." },
        { id: "torta", name: "Torta de la Casa", price: null, img: "torta", desc: "" },
        { id: "quesillo", name: "Quesillo", price: null, img: "quesillo", desc: "" }
      ]
    },
    {
      id: "jugos",
      title: "Jugos",
      blurb: "Naturales, por vaso o por jarra.",
      items: [
        {
          id: "papelon", name: "Papelón", price: 1, img: "jugo", desc: "Con limón.",
          options: [ { label: "Vaso", price: 1 }, { label: "½ jarra", price: 2 }, { label: "1 jarra", price: 3 } ]
        },
        {
          id: "nestea", name: "Nestea", price: 2, img: "refresco", desc: "",
          options: [ { label: "Vaso", price: 2 }, { label: "½ jarra", price: 4 }, { label: "1 jarra", price: 5.5 } ]
        },
        {
          id: "parchita", name: "Parchita", price: 1.5, img: "jugo-2", desc: "Jugo natural de parchita.",
          options: [ { label: "Vaso", price: 1.5 }, { label: "½ jarra", price: 3 }, { label: "1 jarra", price: 4.5 } ]
        }
      ]
    }
  ]
};
