-- Tres dispositivos por cuenta de estudiante. No expulsa a los otros al entrar.
-- Ejecutar en Supabase SQL Editor antes de publicar el cliente actualizado.
begin;

create table if not exists public.device_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null,
  device_name text not null default 'Dispositivo',
  is_active boolean not null default true,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, device_id)
);

create index if not exists idx_device_sessions_user_active
  on public.device_sessions (user_id, is_active);

alter table public.device_sessions enable row level security;
drop policy if exists "Users read own devices" on public.device_sessions;
create policy "Users read own devices" on public.device_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users insert own devices" on public.device_sessions;
drop policy if exists "Users update own devices" on public.device_sessions;
drop policy if exists "Users delete own devices" on public.device_sessions;
revoke insert, update, delete on public.device_sessions from public, authenticated, anon;
grant select on public.device_sessions to authenticated;

-- La versión anterior marcaba solo el último dispositivo como activo.
-- Recuperamos los anteriores sin superar tres sesiones por cuenta.
with ranked as (
  select id, row_number() over (
    partition by user_id order by is_active desc, last_seen desc, created_at desc, id
  ) as position
  from public.device_sessions
)
update public.device_sessions as devices
set is_active = ranked.position <= 3
from ranked
where devices.id = ranked.id;

create or replace function public.activate_device(p_device_id text, p_device_name text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_active_count integer;
  v_registered_count integer;
  v_this_active boolean;
  v_this_registered boolean;
begin
  if v_user_id is null then
    return pg_catalog.json_build_object('ok', false, 'code', 'NOT_AUTHENTICATED', 'error', 'Inicia sesión para entrar.');
  end if;
  if p_device_id is null or pg_catalog.length(pg_catalog.btrim(p_device_id)) = 0
      or pg_catalog.length(p_device_id) > 128 then
    return pg_catalog.json_build_object('ok', false, 'code', 'INVALID_DEVICE', 'error', 'No pudimos identificar este dispositivo.');
  end if;

  -- Serializa entradas simultáneas de la misma cuenta para que dos equipos
  -- nuevos no puedan ocupar ambos el tercer lugar.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );

  select is_active into v_this_active
  from public.device_sessions
  where user_id = v_user_id and device_id = p_device_id;
  v_this_registered := found;

  select count(*), count(*) filter (where is_active = true)
  into v_registered_count, v_active_count
  from public.device_sessions
  where user_id = v_user_id;

  if (not v_this_registered and v_registered_count >= 3)
      or (coalesce(v_this_active, false) = false and v_active_count >= 3) then
    return pg_catalog.json_build_object(
      'ok', false,
      'code', 'DEVICE_LIMIT',
      'limit', 3,
      'error', 'Tu cuenta ya está registrada en 3 dispositivos. Para usar otro, solicita liberar uno.'
    );
  end if;

  insert into public.device_sessions (user_id, device_id, device_name, is_active, last_seen)
  values (v_user_id, p_device_id, pg_catalog.left(coalesce(nullif(pg_catalog.btrim(p_device_name), ''), 'Dispositivo'), 80), true, now())
  on conflict (user_id, device_id) do update
    set device_name = excluded.device_name,
        is_active = true,
        last_seen = now();

  return pg_catalog.json_build_object(
    'ok', true,
    'limit', 3,
    'registered', case when v_this_registered then v_registered_count else v_registered_count + 1 end
  );
end;
$$;

create or replace function public.check_device_active(p_device_id text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_active boolean;
begin
  if v_user_id is null then
    return pg_catalog.json_build_object('active', false, 'reason', 'No autenticado');
  end if;

  select is_active into v_active
  from public.device_sessions
  where user_id = v_user_id and device_id = p_device_id;

  if v_active is distinct from true then
    return pg_catalog.json_build_object('active', false, 'reason', 'Este dispositivo ya no está autorizado.');
  end if;

  update public.device_sessions
  set last_seen = now()
  where user_id = v_user_id and device_id = p_device_id;

  return pg_catalog.json_build_object('active', true, 'limit', 3);
end;
$$;

revoke all on function public.activate_device(text, text) from public;
revoke all on function public.check_device_active(text) from public;
grant execute on function public.activate_device(text, text) to authenticated;
grant execute on function public.check_device_active(text) to authenticated;

commit;
