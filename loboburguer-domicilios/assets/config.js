/* Loboburguer Domicilios — conexión con Supabase y datos del servicio.
   La clave publishable es pública por diseño: los permisos reales los
   controla Row Level Security (solo la fila del menú y el bucket de
   fotos son escribibles desde el panel).

   Este proyecto es independiente de la carta de mesa, pero lee los mismos
   precios del panel (menu_state), así que un cambio de precio se refleja
   en los dos. */
window.LOBO_CONFIG = {
  supabaseUrl: "https://dlznvpmxolahwcvqsmli.supabase.co",
  supabaseKey: "sb_publishable_dWKT4JI9wCD34onyTNwrsw_54tl0Pc1",
  stateId: "__lobo_menu__",
  bucket: "menu",

  /* Domicilios: todo el pedido se cierra por WhatsApp.
     Estos valores son el punto de partida; si el panel (loboburguer/admin.html)
     guarda cambios en __domicilios__, la carta usa esos en su lugar. */
  delivery: {
    whatsapp: "584149552961",
    phoneLabel: "0414-9552961",
    /* El envío no tiene precio fijo: depende de la distancia y de la hora,
       así que se confirma por WhatsApp. */
    feeNote: "El envío se calcula según la distancia y la hora; te lo confirmamos por WhatsApp.",
    minimum: 8,
    timing: "35 a 50 minutos",
    greeting: "Hola, quiero hacer un pedido a domicilio 🛵",

    /* Horario del negocio y hora en que se habilita la carta de la noche. */
    hours: { open: "06:30", close: "00:00" },
    lateFrom: "17:00",

    /* El menú no cobra nada: el cliente solo avisa cómo va a pagar y en el
       WhatsApp se le pasan los datos para que haga el pago. */
    payment: {
      methods: ["Pago móvil", "Efectivo"],
      notes: {
        "Pago móvil": "Envíenme banco, cédula y teléfono para hacer la transferencia.",
        "Efectivo": "Pago en efectivo al recibir el pedido."
      }
    }
  }
};
