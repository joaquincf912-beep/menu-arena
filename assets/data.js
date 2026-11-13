/* ARENAS Grill · Bar — contenido del menú.
   Precios tomados del menú impreso del restaurante. */
window.ARENAS_MENU = {
  currency: "$",
  sections: [
    {
      id: "entradas",
      title: "Entradas",
      blurb: "Para abrir el apetito y compartir en la mesa.",
      items: [
        {
          name: "Copitas de Cochino",
          img: "copitas",
          price: 7,
          desc: "Copitas de tostón con guacamole y cochino frito en su manteca.",
          tag: "Para compartir"
        },
        {
          name: "Ceviche de Chicharrón",
          img: "ceviche-chicharron",
          price: 9,
          desc: "Pork belly en leche de tigre, ají dulce, cebolla morada, cilantro y chips de plátano."
        },
        {
          name: "Ración de Tequeños",
          img: "tequenos",
          price: 6,
          desc: "10 tequeños full queso con salsa de ajo."
        },
        {
          name: "Ensalada César",
          img: "cesar",
          price: 6,
          desc: "Lechuga romana, aderezo césar, croutons de mantequilla y orégano, polvito de tocineta y queso parmesano.",
          variants: ["Clásica", "Pollo crispy", "Pollo al grill", "Camarones crispy", "Camarones al ajillo"]
        }
      ]
    },
    {
      id: "carnes",
      title: "Carnes",
      blurb: "Cortes de res a la parrilla, al punto que prefieras.",
      items: [
        {
          name: "Filet Mignon",
          img: "filet-mignon",
          price: 16,
          desc: "Centro de lomo envuelto en tocineta, en salsa de vino y champiñones."
        },
        {
          name: "Lomito al Grill",
          img: "lomito",
          price: 12,
          desc: "Lomito al grill. Escoge el término de tu preferencia."
        },
        {
          name: "Lomito con Champiñones",
          img: "lomito-champ",
          price: 12,
          desc: "Lomito coronado con champiñones salteados con mantequilla, ajo y especias. Flameado con ron."
        },
        {
          name: "Lomo Saltado",
          img: "lomo-saltado",
          price: 9,
          desc: "Tiras de lomo salteadas con vegetales, papas fritas, salsa de ostras y cebollín. Un toque asiático."
        },
        {
          name: "Parrilla Mixta",
          img: "parrilla-mixta",
          price: 25,
          desc: "Carne, pollo, chorizo, yuca, tostones, ensalada mixta, aguacate y queso a la plancha.",
          tag: "Para compartir"
        },
        {
          name: "Parrilla Mar y Tierra",
          img: "mar-tierra",
          price: 35,
          desc: "Carne, pollo, chorizo, camarones y tentáculos de calamar, yuca, tostones, ensalada mixta, aguacate y queso a la plancha.",
          tag: "Para compartir"
        }
      ]
    },
    {
      id: "cerdo",
      title: "Cerdo",
      blurb: "En su manteca, al carbón y glaseado.",
      items: [
        {
          name: "Chicharrón con Guacamole",
          img: "chicharron",
          price: 11,
          desc: "Pork belly frito en su manteca, con guacamole y maíz dulce."
        },
        {
          name: "Costillas BBQ",
          img: "costillas",
          price: 20,
          desc: "Costillas de cerdo al grill glaseadas con la salsa BBQ de la casa, con un toque especial."
        },
        {
          name: "Cochino Frito",
          img: "cochino-frito",
          price: 9,
          desc: "Pulpa de cerdo frita en su manteca con arepas, papas fritas y natilla."
        },
        {
          name: "Medallones de Lomo",
          img: "medallones",
          price: 16,
          desc: "Medallones de lomo al grill, escogidos a tu gusto.",
          variants: ["Grill tradicional", "BBQ", "Glaseados con parchita y romero"]
        }
      ]
    },
    {
      id: "grill",
      title: "Grill",
      blurb: "La parrilla de la casa, con chimichurri y contornos a elección.",
      items: [
        {
          name: "Punta Importada",
          img: "punta",
          price: 50,
          desc: "Punta seleccionada al grill. Escoge los contornos y el término de tu preferencia.",
          tag: "Para compartir"
        },
        {
          name: "Parrilla Argentina",
          img: "parrilla-arg",
          price: 30,
          desc: "Churrasco de solomo, churrasco de pollo, chuleta de cerdo y chorizo, con chimichurri y los contornos de tu preferencia.",
          tag: "Para compartir"
        },
        {
          name: "Asado de Tira de Cerdo",
          img: "asado-tira",
          price: 15,
          desc: "Costillas de cerdo en corte de tiras al grill, con chimichurri y los contornos de preferencia."
        },
        {
          name: "Churrasco de Solomo",
          img: "churrasco",
          price: 10,
          desc: "Churrasco de solomo al grill con chimichurri. Escoge el término y los contornos de tu preferencia."
        },
        {
          name: "Churrasco de Pollo",
          img: "churrasco-pollo",
          price: 6,
          desc: "Churrasco de pollo al grill con los contornos de tu preferencia."
        },
        {
          name: "Brochetas Mixtas",
          img: "brochetas",
          price: 13,
          desc: "Trío de brochetas de lomito, pollo y chorizo al grill, con chimichurri y los contornos de tu preferencia."
        }
      ]
    },
    {
      id: "aves",
      title: "Aves",
      blurb: "Empanizado, gratinado y frito.",
      items: [
        {
          name: "Gordon Blue",
          img: "gordon-blue",
          price: 9,
          desc: "Relleno de jamón y queso, empanizado, con su salsa especial."
        },
        {
          name: "Parmigiana de Pollo",
          img: "parmigiana",
          price: 11,
          desc: "Milanesa de pollo empanizada y gratinada con salsa roja de la casa, mozzarella y parmesano."
        },
        {
          name: "Pollo Saltado",
          img: "pollo-saltado",
          price: 11,
          desc: "Con vegetales, salsa de ostras, papas y cebollín. Un toque Nikkei."
        },
        {
          name: "Pollo a la Broster Grande",
          img: "pollo-broster",
          price: 14.99,
          desc: "8 piezas de pollo frito con arepitas, ensalada y papas.",
          tag: "Para 4 personas"
        }
      ]
    },
    {
      id: "cocteles",
      title: "Cócteles",
      blurb: "Ron, tequila y fruta. Bien fríos.",
      items: [
        {
          name: "Mojito",
          img: "mojito",
          price: 3,
          desc: "Ron blanco, azúcar, limón y 7UP o soda."
        },
        {
          name: "Cuba Libre",
          img: "cuba-libre",
          price: 3,
          desc: "Ron oscuro, limón y Coca Cola."
        },
        {
          name: "Margarita Frozen",
          img: "margarita-frozen",
          price: 3.5,
          desc: "Tequila, triple sec, limón, hielo y borde de sal."
        },
        {
          name: "Daikiri",
          img: "daikiri",
          price: 4,
          desc: "Fresa congelada, ron blanco, limón y azúcar a gusto."
        },
        {
          name: "Piña Colada",
          img: "pina-colada",
          price: 4,
          desc: "Ron blanco, crema de coco, piña y coco rallado."
        },
        {
          name: "Margarita Arenas",
          img: "margarita-arenas",
          price: 6,
          desc: "Tequila, triple sec, limón, hielo, borde de sal y cerveza volteada (la cerveza a elección).",
          tag: "De la casa"
        }
      ]
    },
    {
      id: "infantil",
      title: "Infantil",
      blurb: "Porciones pensadas para los más pequeños de la mesa.",
      items: [
        {
          name: "Tenders de Pollo",
          img: "tenders",
          price: 8,
          desc: "8 tenders de pollo con ración de papas fritas.",
          sizeLabel: "Grandes"
        },
        {
          name: "Tenders de Pollo",
          img: "tenders-small",
          price: 6,
          desc: "4 tenders de pollo con ración de papas fritas.",
          sizeLabel: "Pequeños"
        },
        {
          name: "Mini Hamburguesa",
          img: "mini-burger",
          price: 5,
          desc: "Carne, salsas, queso fundido y papas francesas."
        },
        {
          name: "Perro Caliente Infantil",
          img: "perro",
          price: 2.5,
          desc: "Salchicha, papitas ripio, salsas y queso parmesano."
        },
        {
          name: "Ración de Tequeñitos",
          img: "tequenitos",
          price: 4,
          desc: "5 tequeños full queso con salsa de ajo."
        }
      ]
    },
    {
      id: "bebidas",
      title: "Bebidas",
      blurb: "Cervezas, refrescos y batidos.",
      items: [
        {
          name: "Cerveza",
          img: "cerveza",
          price: 2,
          desc: "Bien fría. Lata, botella o tobo de 10 para compartir.",
          options: [
            { label: "Lata", price: 2 },
            { label: "Botella", price: 4 },
            { label: "Tobo 10 cervezas", price: 10 }
          ]
        },
        {
          name: "Whiski",
          img: "whiski",
          price: 6,
          desc: "Dos opciones disponibles, a tu elección.",
          variants: ["Opción 1", "Opción 2"]
        },
        {
          name: "Refresco de Botella",
          img: "refresco-botella",
          price: 1.3,
          desc: "Elige tu sabor favorito."
        },
        {
          name: "Refresco",
          img: "refresco-vaso",
          price: 2.5,
          desc: "Vaso con hielo, elige tu sabor favorito.",
          options: [
            { label: "Grande", price: null },
            { label: "Mediano", price: 2.5 },
            { label: "Pequeño", price: null }
          ]
        },
        {
          name: "Refresco de Lata",
          img: "refresco-lata",
          price: null,
          desc: "Sabores variados."
        },
        {
          name: "Batidos",
          img: "batidos",
          price: 3,
          desc: "Hielo triturado con jarabes de frutas a elección."
        }
      ]
    }
  ]
};
