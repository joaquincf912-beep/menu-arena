/* =========================================================
   ARENAS GRILL BAR — Carta oficial
   Basada en el menú físico de la casa.
   El panel de administración puede exportar una versión
   actualizada de este mismo archivo.
   ========================================================= */
window.ARENAS_MENU = {
  version: 2,
  business: {
    name: "Arenas Grill Bar",
    legal: "Arenas, C.A",
    rif: "J501472530",
    tagline: "Para cada gusto, cada sabor",
    whatsapp: "584149535760",
    instagram: "https://www.instagram.com/arenas_grill_bar/",
    pin: "1987"
  },
  hours: [
    { label: "Lunes a jueves", days: [1, 2, 3, 4], open: "12:00", close: "23:00" },
    { label: "Viernes y sábado", days: [5, 6], open: "12:00", close: "01:00" },
    { label: "Domingo", days: [0], open: "12:00", close: "22:00" }
  ],
  categories: [
    { id: "promos", name: "Promociones", icon: "01", note: "Lo nuevo de Arenas", image: "ribs" },
    { id: "platos", name: "Platos fuertes", icon: "02", note: "Carnes, cerdo y aves a la parrilla", image: "steak" },
    { id: "entradas", name: "Entradas", icon: "03", note: "Para abrir el apetito", image: "wings" },
    { id: "texmex", name: "Tex-Mex", icon: "04", note: "Sabores de México en tu mesa", image: "tacos" },
    { id: "premium", name: "Hamburguesas premium", icon: "05", note: "Nuestras hamburguesas de autor", image: "burger" },
    { id: "urbano", name: "Menú urbano", icon: "06", note: "Street food de la casa", image: "burger2" },
    { id: "infantil", name: "Menú infantil", icon: "07", note: "Porciones para los más pequeños", image: "chicken" },
    { id: "compartir", name: "Pa' compartir", icon: "08", note: "Para la mesa completa", image: "tacos2" },
    { id: "bebidas", name: "Bebidas", icon: "09", note: "Refrescantes y clásicas", image: "beer" },
    { id: "cocteles", name: "Cócteles", icon: "10", note: "Preparados en barra", image: "cocktail" }
  ],
  products: [
    /* ---------- PROMOCIONES ---------- */
    {
      id: "parrilla-resuelve",
      cat: "promos",
      name: "Parrilla Resuelve",
      price: 15.99,
      desc: "Cerdo, pollo, chorizo, yuca, papas y ensalada rallada.",
      tag: "Para compartir",
      photo: "ribs"
    },
    {
      id: "cesar-wrap",
      cat: "promos",
      name: "Cesar Wrap",
      price: 7.99,
      desc: "2 enrollados de pollo crispy con lechuga romana, aderezo césar, queso parmesano y queso gouda + 2 vasos de refresco."
    },
    {
      id: "pollo-broaster",
      cat: "promos",
      name: "Pollo Broaster",
      price: 11.99,
      desc: "8 piezas de pollo, ensalada rallada, arepitas, papas fritas y un refresco de litro.",
      photo: "chicken"
    },
    {
      id: "promo-pollo",
      cat: "promos",
      name: "Promo de Pollo",
      price: 14.99,
      desc: "8 piezas de pollo, media ensalada y 150 g de papas."
    },
    {
      id: "promo-medallones",
      cat: "promos",
      name: "Medallones de Lomito",
      price: 9.0,
      desc: "Medallones de lomito al grill."
    },

    /* ---------- PLATOS FUERTES ---------- */
    {
      id: "menu-almuerzo",
      cat: "platos",
      name: "Menú de Almuerzo",
      price: 6.99,
      desc: "Elige tu almuerzo preferido: una proteína y tres contornos a elegir."
    },
    {
      id: "filet-mignon",
      cat: "platos",
      name: "Filet Mignon",
      price: 16.0,
      desc: "Centro de lomo envuelto en tocineta, en salsa de vino y champiñones."
    },
    {
      id: "lomito-grill",
      cat: "platos",
      name: "Lomito al Grill",
      price: 12.0,
      desc: "Lomito al grill. Escoge el término de tu preferencia."
    },
    {
      id: "lomito-champinones",
      cat: "platos",
      name: "Lomito con Champiñones",
      price: 12.0,
      desc: "Lomito coronado con champiñones, salteado con mantequilla, ajo y especias. Flameado con ron."
    },
    {
      id: "lomo-salteado",
      cat: "platos",
      name: "Lomo Salteado",
      price: 9.0,
      desc: "Tiras de lomo salteadas con vegetales, papas fritas, salsa de ostras y cebollín. Un toque asiático delicioso."
    },
    {
      id: "parrilla-mixta",
      cat: "platos",
      name: "Parrilla Mixta",
      price: 23.0,
      desc: "Carne, pollo, chorizo, yuca, tostones, ensalada mixta, aguacate y queso a la plancha.",
      tag: "Para compartir"
    },
    {
      id: "parrilla-mar-tierra",
      cat: "platos",
      name: "Parrilla Mar y Tierra",
      price: 35.0,
      desc: "Carne, pollo, chorizo, camarones y tentáculos de calamar, yuca, tostones, ensalada mixta, aguacate y queso a la plancha.",
      tag: "Especialidad",
      photo: "steak"
    },
    {
      id: "chicharron-guacamole",
      cat: "platos",
      name: "Chicharrón con Guacamole",
      price: 11.0,
      desc: "Pork belly frito en su manteca, con guacamole y maíz dulce."
    },
    {
      id: "costillas-bbq",
      cat: "platos",
      name: "Costillas BBQ",
      price: 20.0,
      desc: "Costillas de cerdo al grill glaseadas con salsa BBQ de la casa, con un toque especial."
    },
    {
      id: "cochino-frito",
      cat: "platos",
      name: "Cochino Frito",
      price: 9.0,
      desc: "Pulpa de cerdo frita en su manteca con arepas, papas fritas y natilla."
    },
    {
      id: "medallones-lomo",
      cat: "platos",
      name: "Medallones de Lomo",
      price: 10.0,
      desc: "Medallones de lomo al grill. Escógelos a tu gusto: grill tradicional, BBQ o glaseados con parchita y romero."
    },
    {
      id: "punta-importada",
      cat: "platos",
      name: "Punta Importada",
      price: 50.0,
      desc: "Punta seleccionada al grill. Escoge los contornos de tu preferencia y el término que deseas."
    },
    {
      id: "parrilla-argentina",
      cat: "platos",
      name: "Parrilla Argentina",
      price: 30.0,
      desc: "Churrasco de solomo, churrasco de pollo, chuleta de cerdo y chorizo, con chimichurri y los contornos de tu preferencia.",
      tag: "Para compartir"
    },
    {
      id: "churrasco-solomo",
      cat: "platos",
      name: "Churrasco de Solomo",
      price: 10.0,
      desc: "Churrasco de solomo al grill con chimichurri. Escoge el término que desees y los contornos de tu preferencia."
    },
    {
      id: "churrasco-pollo",
      cat: "platos",
      name: "Churrasco de Pollo",
      price: 6.0,
      desc: "Churrasco de pollo al grill con los contornos de tu preferencia."
    },
    {
      id: "parmigiana-pollo",
      cat: "platos",
      name: "Parmigiana de Pollo",
      price: 11.0,
      desc: "Milanesa de pollo empanizada y gratinada con salsa de la casa, mozzarella y parmesano."
    },
    {
      id: "pollo-salteado",
      cat: "platos",
      name: "Pollo Salteado",
      price: 11.0,
      desc: "Con vegetales, salsa de ostras, papas y cebollín, con un toque nikkei."
    },
    {
      id: "pollo-broaster-grande",
      cat: "platos",
      name: "Pollo a la Broster Grande",
      price: 14.99,
      desc: "8 piezas de pollo frito con arepitas, ensalada rallada, papas y refresco de litro. Para 4 personas.",
      tag: "Para 4"
    },
    {
      id: "buffalo-wings",
      cat: "platos",
      name: "Buffalo Wings",
      price: 11.5,
      desc: "500 g de alas de pollo crujiente bañadas en salsa buffalo picante o sin picante, acompañadas con papas fritas."
    },
    {
      id: "alitas-panchos",
      cat: "platos",
      name: "Alitas Pancho's",
      price: 11.5,
      desc: "500 g de alas de pollo crujiente bañadas en una reducción de parchita, acompañadas con papas fritas."
    },
    {
      id: "alitas-parmesana",
      cat: "platos",
      name: "Alitas a la Parmesana",
      price: 9.0,
      desc: "500 g de alas de pollo crujiente bañadas en mantequilla con parmesano, acompañadas con papas fritas."
    },

    /* ---------- ENTRADAS ---------- */
    {
      id: "nachos-chiliqueso",
      cat: "entradas",
      name: "Nachos Chiliqueso",
      price: 5.0,
      desc: "50 g de nachos con chili con carne y queso gratinado."
    },
    {
      id: "nachos-cheese-bacon",
      cat: "entradas",
      name: "Nachos Cheese and Bacon",
      price: 5.0,
      desc: "50 g de nachos con queso gratinado y tocineta."
    },
    {
      id: "ensalada-cesar",
      cat: "entradas",
      name: "Ensalada César",
      price: 6.0,
      desc: "Lechuga romana, aderezo césar, croutons de mantequilla y orégano, polvito de tocineta y queso parmesano. Elígela clásica, pollo crispy, pollo al grill, camarones crispy o camarones al ajillo."
    },
    {
      id: "racion-tequenos",
      cat: "entradas",
      name: "Ración de Tequeños",
      price: 6.0,
      desc: "10 tequeños full queso con salsa de ajo."
    },
    {
      id: "ceviche-chicharron",
      cat: "entradas",
      name: "Ceviche de Chicharrón",
      price: 9.0,
      desc: "Pork belly en leche de tigre, ají dulce, cebolla morada, cilantro y chips de plátano."
    },
    {
      id: "copitas-cochino",
      cat: "entradas",
      name: "Copitas de Cochino",
      price: 7.0,
      desc: "Copitas de tostón con guacamole y cochino frito en su manteca. Una delicia para abrir el apetito."
    },

    /* ---------- TEX-MEX ---------- */
    {
      id: "fajitas-grande",
      cat: "texmex",
      name: "Fajitas Grande",
      price: 33.0,
      desc: "9 tortillas de trigo, 180 g de pico de gallo, 180 g de guacamole, 600 g de lomito y pollo, 180 g de queso amarillo y 5 oz de crema de leche.",
      tag: "Para compartir"
    },
    {
      id: "media-fajitas",
      cat: "texmex",
      name: "Media Fajitas",
      price: 19.0,
      desc: "6 tortillas, 100 g de pico de gallo, 100 g de guacamole, 300 g de pollo o lomito y queso amarillo."
    },
    {
      id: "fajita-single",
      cat: "texmex",
      name: "Fajita Single",
      price: 11.0,
      desc: "3 tortillas, 80 g de pico de gallo, 80 g de guacamole, 150 g de pollo o lomito y 80 g de queso amarillo."
    },
    {
      id: "fajita-mar-tierra",
      cat: "texmex",
      name: "Fajita Mar y Tierra",
      price: 40.0,
      desc: "Fajita de pollo y camarones salteados con vegetales, acompañada de guacamole, pico de gallo, queso amarillo, crema de leche y 9 tortillas de trigo."
    },
    {
      id: "nachos-panchos",
      cat: "texmex",
      name: "Nachos Panchos",
      price: 8.0,
      desc: "28 nachos, 8 oz de guacamole, 8 oz de pico de gallo, 150 g de queso, 4 oz de crema de leche y 200 g de proteína."
    },
    {
      id: "burritos",
      cat: "texmex",
      name: "Burritos",
      price: 12.0,
      desc: "Tortilla de trigo rellena de frijol, arroz, la proteína, guacamole, pico de gallo y queso."
    },
    {
      id: "burrito-norteno",
      cat: "texmex",
      name: "Burrito Norteño",
      price: 14.0,
      desc: "Una tortilla de trigo grande rellena de guacamole, queso y la proteína que desees: lomito, pollo o mixto."
    },
    {
      id: "quesadillas",
      cat: "texmex",
      name: "Quesadillas",
      price: 8.0,
      desc: "Tortilla de trigo full queso y la proteína a tu gusto."
    },
    {
      id: "tacos-pastor",
      cat: "texmex",
      name: "Tacos al Pastor",
      price: 10.0,
      desc: "Tres tortillas de maíz blandas, lomo de cerdo con salsa al pastor, acompañadas de piña, cebolla y cilantro. Si te atreves, salsa Valentina."
    },
    {
      id: "tacos-chili",
      cat: "texmex",
      name: "Tacos Panchos de Chili",
      price: 10.0,
      desc: "3 tortillas de maíz crujientes rellenas de chili con carne o solo carne molida, queso amarillo, guacamole, pico de gallo, lechuga y jalapeños si gustas."
    },
    {
      id: "tacos-molida",
      cat: "texmex",
      name: "Tacos Panchos de Molida",
      price: 10.0,
      desc: "3 tortillas de maíz crujientes rellenas de carne molida, queso amarillo, guacamole, pico de gallo, lechuga y jalapeños si gustas."
    },
    {
      id: "tacos-carne-grill",
      cat: "texmex",
      name: "Tacos de Carne al Grill",
      price: 10.0,
      desc: "3 tortillas de maíz crujientes con tu carne favorita: solomo al grill, cerdo o pollo; queso amarillo, guacamole, pico de gallo, lechuga y jalapeños si gustas."
    },
    {
      id: "tacos-birria",
      cat: "texmex",
      name: "Tacos de Birria",
      price: 10.0,
      desc: "3 tortillas de maíz finas bañadas en salsa de la casa, con pulled beef y full queso por dentro. Sumérgelos en su caldo de birria."
    },
    {
      id: "tacos-pollo",
      cat: "texmex",
      name: "Tacos de Pollo",
      price: 10.0,
      desc: "3 tortillas de maíz crujientes con pollo a la plancha, queso amarillo, guacamole, pico de gallo, lechuga y jalapeños si gustas."
    },
    {
      id: "tacos-cerdo",
      cat: "texmex",
      name: "Tacos de Cerdo",
      price: 10.0,
      desc: "3 tortillas de maíz crujientes con pulpa de cerdo al grill, queso amarillo, guacamole, pico de gallo, lechuga y jalapeños si gustas."
    },
    {
      id: "chimichanguitas",
      cat: "texmex",
      name: "Chimichanguitas",
      price: 8.0,
      desc: "2 mini tortillas de trigo fritas, rellenas de carne de res con queso amarillo, acompañadas de guacamole, pico de gallo y salsa picante si gustas."
    },

    /* ---------- HAMBURGUESAS PREMIUM ---------- */
    {
      id: "doble-chicken-bacon",
      cat: "premium",
      name: "Doble Chicken Bacon",
      price: 10.0,
      desc: "Pan brioche con ajonjolí, 200 g de milanesa crispy, doble facilita, sweet relish y salsa Big-Mac."
    },
    {
      id: "funghi-bacon",
      cat: "premium",
      name: "Funghi-Bacon",
      price: 12.0,
      desc: "Pan brioche con ajonjolí, doble carne, doble facilista, sweet relish, mermelada de tocineta con champiñones, cebolla crispy y jalapeño opcional."
    },
    {
      id: "two-station",
      cat: "premium",
      name: "2 Station",
      price: 10.0,
      desc: "Pan brioche con ajonjolí, carne de la casa, pollo crispy, mermelada de tocineta con champiñones y salsa Big-Mac."
    },
    {
      id: "crispy-spicy",
      cat: "premium",
      name: "Crispy Spicy",
      price: 13.0,
      desc: "Pan brioche con ajonjolí, 200 g de milanesa crispy, carne de la casa, facilista, relish con jalapeño y salsa Big-Mac."
    },
    {
      id: "arenas-big-melt",
      cat: "premium",
      name: "Arenas Big Melt",
      price: 14.0,
      desc: "Pan brioche con ajonjolí, triple carne de la casa, triple facilista, sweet relish, tocineta, cebolla crispy y salsa Big-Mac.",
      tag: "La más grande",
      photo: "burger"
    },
    {
      id: "triple-onion-crunch",
      cat: "premium",
      name: "Triple Onion Crunch",
      price: 12.0,
      desc: "Pan brioche con ajonjolí, doble carne, milanesa crispy, sweet relish, mermelada de tocineta y champiñones, salsa de la casa."
    },

    /* ---------- MENÚ URBANO ---------- */
    {
      id: "hamburguesa-carne",
      cat: "urbano",
      name: "Hamburguesa de Carne",
      price: 9.5,
      desc: "Carne, tomate, cebolla, lechuga, papitas y salsa de la casa."
    },
    {
      id: "hamburguesa-pollo",
      cat: "urbano",
      name: "Hamburguesa de Pollo Crispy",
      price: 9.0,
      desc: "Pollo crispy, tomate, cebolla, lechuga, papitas y salsa de la casa."
    },
    {
      id: "hamburguesa-triple",
      cat: "urbano",
      name: "Hamburguesa Triple",
      price: 15.0,
      desc: "Pollo, carne, chuleta ahumada, tomate, cebolla, lechuga, papitas y salsas de la casa."
    },
    {
      id: "promo-pepito",
      cat: "urbano",
      name: "Promo Pepito",
      price: 13.99,
      desc: "Pollo, lomito, tocineta, papitas, salsa de la casa y queso parmesano."
    },
    {
      id: "pepito-grande",
      cat: "urbano",
      name: "Pepito Grande",
      price: 17.0,
      desc: "Pollo, lomito, tocineta, papitas, salsa de la casa y queso parmesano."
    },
    {
      id: "pepiburrito",
      cat: "urbano",
      name: "Pepiburrito",
      price: 8.0,
      desc: "Tortilla de trigo con pollo, carne, tomate, cebolla, lechuga, salsas de la casa y queso parmesano."
    },

    /* ---------- MENÚ INFANTIL ---------- */
    {
      id: "mini-hamburguesa",
      cat: "infantil",
      name: "Mini Hamburguesa",
      price: 5.0,
      desc: "Carne, salsas, queso facilita y papas francesas."
    },
    {
      id: "perro-caliente",
      cat: "infantil",
      name: "Perro Caliente Infantil",
      price: 2.5,
      desc: "Salchicha, papitas ripio, salsas y queso parmesano.",
      tag: "Nuevo"
    },
    {
      id: "tender-grandes",
      cat: "infantil",
      name: "Tenders de Pollo Grandes",
      price: 8.0,
      desc: "8 tenders de pollo con ración de papas fritas."
    },
    {
      id: "tender-pequenos",
      cat: "infantil",
      name: "Tenders de Pollo Pequeños",
      price: 6.0,
      desc: "4 tenders de pollo con ración de papas fritas."
    },
    {
      id: "tequenitos",
      cat: "infantil",
      name: "Ración de Tequeñitos",
      price: 4.0,
      desc: "5 tequeños full queso con salsa de ajo."
    },

    /* ---------- PA' COMPARTIR ---------- */
    {
      id: "bandeja-tex-mex",
      cat: "compartir",
      name: "Bandeja Tex-Mex",
      price: 65.0,
      desc: "1 kilo de alas, 5 tacos de chili con carne, 5 quesadillas baby de carne molida, 3 baby burritos de pollo y 1 nachos chili/queso.",
      tag: "Para la mesa",
      photo: "tacos2"
    },

    /* ---------- BEBIDAS ---------- */
    { id: "cerveza", cat: "bebidas", name: "Cerveza Botella", price: 1.0, desc: "Bien fría." },
    { id: "cerveza-lata", cat: "bebidas", name: "Cerveza Lata", price: 2.0, desc: "" },
    { id: "tobo-cervezas", cat: "bebidas", name: "Tobo 10 Cervezas", price: 10.0, desc: "Ideal para la mesa." },
    { id: "whisky-trago", cat: "bebidas", name: "Whisky x Trago", price: 6.0, desc: "Consulta las opciones de la casa." },
    { id: "refresco-botella", cat: "bebidas", name: "Refresco de Botella", price: 1.3, desc: "Elige tu sabor favorito." },
    { id: "refresco", cat: "bebidas", name: "Refresco", price: 2.5, desc: "Grande, mediano o pequeño." },
    { id: "batidos", cat: "bebidas", name: "Batidos", price: 3.0, desc: "Hielo triturado con jarabes de frutas a elección." },
    { id: "agua-mineral", cat: "bebidas", name: "Agua Mineral", price: 1.0, desc: "" },
    { id: "soda", cat: "bebidas", name: "Soda", price: 3.5, desc: "" },
    { id: "lipton", cat: "bebidas", name: "Lipton", price: 3.0, desc: "" },

    /* ---------- CÓCTELES ---------- */
    {
      id: "mojito",
      cat: "cocteles",
      name: "Mojito",
      price: 3.0,
      desc: "Ron blanco, azúcar, limón y 7Up o soda."
    },
    {
      id: "cuba-libre",
      cat: "cocteles",
      name: "Cuba Libre",
      price: 3.0,
      desc: "Ron oscuro, limón y Coca-Cola."
    },
    {
      id: "margarita-frozen",
      cat: "cocteles",
      name: "Margarita Frozen",
      price: 3.5,
      desc: "Tequila, triple C, limón, hielo y borde de sal."
    },
    {
      id: "daikiri",
      cat: "cocteles",
      name: "Daikiri",
      price: 4.0,
      desc: "Una porción de fresa congelada, ron blanco, limón y azúcar a gusto."
    },
    {
      id: "pina-colada",
      cat: "cocteles",
      name: "Piña Colada",
      price: 4.0,
      desc: "Ron blanco, crema de coco, piña y coco rallado."
    },
    {
      id: "margarita-arenas",
      cat: "cocteles",
      name: "Margarita Arenas",
      price: 6.0,
      desc: "Tequila, triple C, limón, hielo, borde de sal y cerveza volteada (la cerveza a elección).",
      tag: "De la casa"
    }
  ]
};
