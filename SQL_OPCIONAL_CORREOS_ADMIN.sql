-- OPCIONAL: solo si quieres que el panel admin muestre los correos reales de Authentication > Users.
-- Sin esta funcion, el panel igual muestra progreso, pero puede mostrar "correo no disponible" porque auth.users esta protegido.

create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  email text,
  name text,
  last_seen timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if lower(coalesce(auth.jwt() ->> 'email', '')) not in (
    'admin@alcocermed.com',
    'admin@bencarson.com',
    'rubenconcha@example.com',
    'pichon4488@gmail.com'
  ) then
    raise exception 'not authorized';
  end if;

  return query
  select
    u.id as user_id,
    u.email::text as email,
    coalesce(
      u.raw_user_meta_data ->> 'full_name',
      u.raw_user_meta_data ->> 'name',
      split_part(u.email, '@', 1)
    )::text as name,
    u.last_sign_in_at as last_seen,
    u.created_at as created_at
  from auth.users u
  order by u.created_at desc;
end;
$$;

grant execute on function public.admin_list_users() to authenticated;
