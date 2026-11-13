-- ARENAS Grill · Bar — precios dinámicos del menú
-- Ejecutar en el SQL Editor del proyecto de Supabase.

create table if not exists public.menu_prices (
  key text primary key,
  price numeric(10, 2),
  options jsonb,
  updated_at timestamptz not null default now()
);

alter table public.menu_prices enable row level security;

-- Cualquiera puede leer los precios (el menú público los consulta sin login).
drop policy if exists "precios lectura publica" on public.menu_prices;
create policy "precios lectura publica"
  on public.menu_prices for select
  using (true);

-- Solo un usuario autenticado (el dueño) puede crear o cambiar precios.
drop policy if exists "precios escritura dueno" on public.menu_prices;
create policy "precios escritura dueno"
  on public.menu_prices for all
  to authenticated
  using (true)
  with check (true);

grant select on public.menu_prices to anon, authenticated;
grant insert, update, delete on public.menu_prices to authenticated;

-- Marcas de tiempo de la última edición.
create or replace function public.menu_prices_touch()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists menu_prices_touch on public.menu_prices;
create trigger menu_prices_touch
  before update on public.menu_prices
  for each row execute function public.menu_prices_touch();
