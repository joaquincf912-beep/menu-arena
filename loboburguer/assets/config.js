/* Loboburguer Restaurant — conexión con Supabase.
   La clave publishable es pública por diseño: los permisos reales los
   controla Row Level Security (solo la fila del menú y el bucket de
   fotos son escribibles desde el panel). */
window.LOBO_CONFIG = {
  supabaseUrl: "https://dlznvpmxolahwcvqsmli.supabase.co",
  supabaseKey: "sb_publishable_dWKT4JI9wCD34onyTNwrsw_54tl0Pc1",
  stateId: "__lobo_menu__",
  bucket: "menu",
  pin: "1987"
};
