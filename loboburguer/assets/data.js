/* Loboburguer Restaurant — carta digital.
   Precios tomados de la carta impresa del restaurante (en dólares).
   El panel de administración guarda los cambios en Supabase y estos
   valores quedan como respaldo si la nube no responde.
   Las fotos son de Pexels (licencia libre) y se pueden cambiar desde el panel. */
window.LOBO_MENU = {
  currency: "$",
  restaurant: "Loboburguer Restaurant",
  phone: "0414-9552961",
  instagram: "loboburguer.restaurant",
  sections: [
    {
      id: "almuerzos",
      title: "Almuerzos",
      blurb: "Con arroz o pasta, ensalada y tajadas. Servido todos los días.",
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
      id: "pollo",
      title: "Pollo Asado",
      blurb: "A la brasa, con yuca o hallaquita y ensalada rallada.",
      items: [
        { id: "solo", name: "Pollo Asado Solo", price: 15, img: "pollo-asado", desc: "Pollo entero asado a la brasa." },
        { id: "cuarto", name: "1/4 de Pollo Asado", price: 7, img: "cuarto-pollo", desc: "Yuca o hallaquita y ensalada rallada." },
        { id: "medio", name: "1/2 Pollo Asado", price: 12, img: "pollo-asado-2", desc: "Yuca o hallaquita, ensalada rallada y jugo de papelón." },
        { id: "con-refresco", name: "Pollo Asado", price: 22, img: "pollo-asado", desc: "Pollo entero, yuca o hallaquita, ensalada rallada y refresco de 1,25 L." },
        { id: "promo-dos", name: "Promo de 2 Pollos Asados", price: 40, img: "pollo-asado-3", desc: "Dos pollos, yuca o hallaquita, ensalada rallada y refresco de 1,5 L.", tag: "Para compartir" }
      ]
    },
    {
      id: "parrillas",
      title: "Parrillas",
      blurb: "Carne asada al carbón, con yuca y ensalada rallada.",
      items: [
        { id: "cuarto-carne", name: "1/4 kg de Carne", price: 13.5, img: "carne-asada", desc: "Yuca y ensalada rallada." },
        { id: "medio-carne", name: "1/2 kg de Carne", price: 25, img: "carne-asada-2", desc: "Yuca y ensalada rallada." },
        { id: "kilo-carne", name: "1 kg de Carne", price: 45, img: "parrilla", desc: "Yuca y ensalada rallada.", tag: "Para compartir" },
        { id: "cuarto-promo", name: "1/4 Promo", price: 18, img: "parrilla-2", desc: "Yuca, ensalada rallada y 1 chorizo." },
        { id: "medio-promo", name: "1/2 Promo", price: 28, img: "parrilla-3", desc: "Yuca, ensalada rallada, 3 chorizos, chinchurria y jugo de papelón." },
        { id: "promo", name: "Promo", price: 45, img: "parrilla", desc: "Yuca, ensalada rallada, 5 chorizos, chinchurria y refresco de 2 L.", tag: "Para compartir" },
        { id: "media-premium", name: "1/2 Parrilla Premium", price: null, img: "parrilla-2", desc: "1/4 chicharrón carnudo, 1/4 carne asada, 1/4 cochino asado, 1/4 pollo asado, chorizos, yuca, ensalada, arepas fritas, tostón, natilla, guacamoles, cachapa, queso de mano y jugo de papelón." },
        { id: "premium", name: "Parrilla Premium", price: null, img: "parrilla-3", desc: "1/2 chicharrón carnudo, 1/2 carne asada, 1/2 cochino asado, 1/2 pollo asado, chorizos, yuca, ensalada, arepas fritas, tostón, natilla, guacamoles, cachapa, queso de mano y refresco de 2 L.", tag: "Para compartir" }
      ]
    },
    {
      id: "burguer",
      title: "Burguer",
      blurb: "Empanizados, sándwiches y papas. Todo se hace al momento.",
      items: [
        { id: "cesar-tradicional", name: "Ensalada César Tradicional", price: 9, img: "ensalada-cesar", desc: "" },
        { id: "cesar-premium", name: "Ensalada César Premium", price: 12, img: "ensalada-cesar-pollo", desc: "200 g de milanesa empanizada o a la plancha." },
        { id: "hamburguesa", name: "Hamburguesa", price: 11, img: "hamburguesa", desc: "200 g de milanesa empanizada, facilita craft, tocineta, salsas tradicionales, vegetales (tomate, cebolla, pepinillo) y 120 g de papas fritas." },
        { id: "pepito-mixto", name: "Pepito Mixto", price: 11, img: "pepito", desc: "100 g entre lomito y milanesa, papas ralladas, tocineta, queso parmesano, salsas tradicionales y 120 g de papas fritas." },
        { id: "club-house", name: "Club House", price: 12, img: "club-house", desc: "200 g de milanesa a la plancha, 500 g de papas fritas, huevos a la plancha, vegetales (tomate, cebolla, lechuga), jamón, queso amarillo y salsas tradicionales." },
        { id: "shawarma", name: "Shawarma", price: 11, img: "shawarma", desc: "Entre lomito y milanesa, papas ralladas, tocineta, salsas tradicionales, vegetales (tomate, cebolla, lechuga) y papas fritas." },
        { id: "tender", name: "Tender de Pollo", price: 10, img: "tender", desc: "200 g de milanesa empanizada y 250 g de papas fritas." },
        { id: "salchipapa", name: "Salchipapa", price: 9, img: "salchipapa", desc: "500 g de papas fritas, salchicha, 200 g de milanesa, queso amarillo y salsas tradicionales." }
      ]
    },
    {
      id: "broaster",
      title: "Pollo Broaster",
      blurb: "Crocante por fuera, jugoso por dentro. Con arepas fritas y papas.",
      items: [
        { id: "medio", name: "1/2 Pollo Broaster", price: 15, img: "broaster", desc: "Papas fritas, arepas fritas, ensalada cocida y jugo de papelón." },
        { id: "entero", name: "Pollo Broaster", price: 18, img: "broaster", desc: "Papas fritas, arepas fritas, ensalada cocida y refresco de 1,5 L." }
      ]
    },
    {
      id: "cachapas",
      title: "Cachapas",
      blurb: "De maíz tierno, hechas al momento en la plancha.",
      items: [
        { id: "sola", name: "Cachapa Sola", price: 2.5, img: "cachapa", desc: "Solo la cachapa." },
        { id: "con-queso", name: "Cachapa con Queso", price: 6, img: "cachapa-queso", desc: "Queso de mano." },
        { id: "doble-queso", name: "Cachapa Doble Queso", price: 9.5, img: "cachapa-queso", desc: "Doble porción de queso de mano." },
        { id: "con-cochino", name: "Cachapa con Cochino", price: 7.5, img: "cachapa-cochino", desc: "Sola con cochino frito." },
        { id: "queso-cochino", name: "Cachapa con Queso y Cochino", price: 10, img: "cachapa-cochino", desc: "Queso de mano y cochino frito." },
        { id: "queso-pollo", name: "Cachapa con Queso y Pollo Frito", price: 10, img: "cachapa-cochino", desc: "Queso de mano y pollo frito." },
        { id: "queso-jamon-carne", name: "Cachapa con Queso, Jamón y Carne Mechada", price: 10, img: "cachapa-queso", desc: "Queso de mano, jamón y carne mechada." }
      ]
    },
    {
      id: "sopas",
      title: "Sopas",
      blurb: "Caldo de la casa, todos los días.",
      items: [
        { id: "gallina", name: "Sopa de Gallina", price: 4, img: "sopa-gallina", desc: "Con presas de gallina, verduras y cilantro." },
        { id: "picadillo", name: "Sopa de Picadillo", price: 3, img: "sopa-res", desc: "Carne de res picada, papa, zanahoria y cilantro." },
        { id: "costilla", name: "Sopa de Costilla", price: 3, img: "sopa-res-2", desc: "Costilla de res, verduras y cilantro." },
        { id: "mondongo", name: "Sopa de Mondongo", price: 4, img: "mondongo", desc: "Mondongo, verduras y cilantro." }
      ]
    },
    {
      id: "arroz-chino",
      title: "Arroz Chino",
      blurb: "Especial de la casa y con camarones.",
      items: [
        { id: "especial", name: "Arroz Especial", price: 6, img: "arroz-especial", desc: "Pollo, cochino y jamón." },
        { id: "especial-2", name: "Arroz Especial", price: 9, img: "arroz-chino", desc: "Con 2 contornos a elección.", sizeLabel: "2 contornos" },
        { id: "especial-3", name: "Arroz Especial", price: 11.5, img: "arroz-chino-2", desc: "Con 3 contornos a elección.", sizeLabel: "3 contornos" },
        { id: "camarones", name: "Arroz con Camarones", price: 7, img: "camarones", desc: "Pollo, cochino, jamón y camarones." },
        { id: "camarones-2", name: "Arroz con Camarones", price: 10, img: "camarones-2", desc: "Con 2 contornos a elección.", sizeLabel: "2 contornos" },
        { id: "camarones-3", name: "Arroz con Camarones", price: 12.5, img: "camarones", desc: "Con 3 contornos a elección.", sizeLabel: "3 contornos" }
      ]
    },
    {
      id: "contornos",
      title: "Contornos",
      blurb: "Para acompañar el arroz chino.",
      items: [
        { id: "lumpias", name: "Lumpias", price: 1.5, img: "lumpias", desc: "" },
        { id: "papas-fritas", name: "Papas Fritas", price: 2, img: "papas-fritas", desc: "" },
        { id: "chop-suey", name: "Chop Suey", price: 4, img: "chop-suey", desc: "" },
        { id: "pollo-agridulce", name: "Pollo Agridulce", price: 3, img: "agridulce", desc: "" },
        { id: "pollo-sal-pimienta", name: "Pollo Sal y Pimienta", price: 4.5, img: "sal-pimienta", desc: "" },
        { id: "pollo-broaster", name: "Pollo a la Broaster", price: 3.5, img: "broaster-2", desc: "" },
        { id: "costilla-agridulce", name: "Costilla Agridulce", price: 6.5, img: "agridulce-2", desc: "" },
        { id: "costilla-sal-pimienta", name: "Costilla Sal y Pimienta", price: 6, img: "sal-pimienta-2", desc: "" }
      ]
    },
    {
      id: "raciones",
      title: "Raciones",
      blurb: "Complementos y guarniciones para la mesa.",
      items: [
        { id: "yuca", name: "Yuca", price: 2.5, img: "yuca", desc: "" },
        { id: "hallaquita", name: "Hallaquita", price: 2.5, img: "hallaquita", desc: "" },
        { id: "ensalada-rallada", name: "Ensalada Rallada", price: 3, img: "ensalada-rallada", desc: "" },
        { id: "ensalada-cocida", name: "Ensalada Cocida", price: 3.5, img: "ensalada-cocida", desc: "" },
        { id: "ensalada-mixta", name: "Ensalada Mixta", price: 3, img: "ensalada-rallada-2", desc: "" },
        { id: "papas-fritas-racion", name: "Papas Fritas", price: 1.5, img: "papas-fritas-2", desc: "" },
        { id: "toston", name: "Tostón", price: 2.5, img: "toston", desc: "" },
        { id: "toston-queso", name: "Tostón con Queso", price: 5.5, img: "toston-2", desc: "" },
        { id: "arepa", name: "Arepa", price: 1.5, img: "arepas-fritas", desc: "" },
        { id: "arepa-natilla", name: "Arepa con Natilla", price: 3.5, img: "arepas-fritas-2", desc: "" },
        { id: "natilla", name: "Natilla", price: 2.5, img: "natilla", desc: "" },
        { id: "cochino-racion", name: "Cochino Frito", price: 5.5, img: "cochino-frito", desc: "" },
        { id: "tajadas", name: "Tajadas", price: 2.5, img: "tajadas", desc: "" },
        { id: "tajadas-queso", name: "Tajadas con Queso", price: 5, img: "tajadas-2", desc: "" },
        { id: "queso-rallado", name: "Queso Rallado", price: 4.5, img: "queso-mano-2", desc: "" },
        { id: "queso-mano", name: "Queso de Mano", price: 4, img: "queso-mano", desc: "" },
        { id: "queso-plancha", name: "Queso a la Plancha", price: 3, img: "queso-mano-2", desc: "" },
        { id: "pasta", name: "Pasta", price: 1.5, img: "pasta-racion", desc: "" },
        { id: "arroz", name: "Arroz", price: 1.5, img: "arroz-blanco", desc: "" },
        { id: "caraotas", name: "Caraotas", price: 2.5, img: "caraotas", desc: "" },
        { id: "aguacate", name: "Aguacate", price: 3, img: "aguacate", desc: "" },
        { id: "chorizo", name: "Chorizo", price: 2, img: "chorizo", desc: "" }
      ]
    },
    {
      id: "bebidas",
      title: "Bebidas",
      blurb: "Jugos naturales, refrescos y maltas bien frías.",
      items: [
        {
          id: "papelon", name: "Papelón", price: 1, img: "jugo", desc: "Con limón.",
          options: [ { label: "Vaso", price: 1 }, { label: "1/2 jarra", price: 2 }, { label: "1 jarra", price: 3 } ]
        },
        {
          id: "parchita", name: "Parchita", price: 1.5, img: "jugo", desc: "Jugo natural de parchita.",
          options: [ { label: "Vaso", price: 1.5 }, { label: "1/2 jarra", price: 3 }, { label: "1 jarra", price: 4.5 } ]
        },
        {
          id: "nestea", name: "Nestea", price: 2, img: "refresco", desc: "",
          options: [ { label: "Vaso", price: 2 }, { label: "1/2 jarra", price: 4 }, { label: "1 jarra", price: 5.5 } ]
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
    },
    {
      id: "postres",
      title: "Smoothies y Postres",
      blurb: "Fresas con crema, milkshakes y waffles.",
      items: [
        { id: "smoothie", name: "Smoothie", price: 3, img: "smoothie", desc: "Fresa, mora, parchita, melón, limonada, lechosa o piña." },
        { id: "milkshake", name: "Milkshake", price: 5, img: "milkshake", desc: "Oreo, fresa, cambur, cere lac o mora." },
        {
          id: "fresas-crema", name: "Fresas con Crema", price: 4, img: "fresas-crema", desc: "",
          options: [
            { label: "6 onzas", price: null },
            { label: "8 onzas", price: 4 },
            { label: "9 onzas", price: 6 },
            { label: "12 onzas", price: 8 },
            { label: "24 onzas", price: 10 }
          ]
        },
        { id: "torta", name: "Torta de la Casa", price: null, img: "torta", desc: "" },
        { id: "quesillo", name: "Quesillo", price: null, img: "quesillo", desc: "" },
        { id: "especiales", name: "Especiales", price: 3.5, img: "jugo-2", desc: "Parchita con hierba buena, limonada con hierba buena o parchita con mango." },
        { id: "cafe-leche", name: "Café con Leche", price: 2, img: "cafe", desc: "" },
        { id: "waffles", name: "Waffles", price: null, img: "waffles", desc: "Con frutas o con Oreo." }
      ]
    }
  ]
};
