-- Catálogo de partidas para estudiantes con sesión iniciada.
-- Solo expone metadatos de evaluaciones publicadas; no entrega preguntas.
-- Las políticas RLS de evaluaciones/evaluacion_preguntas siguen controlando
-- el acceso real al contenido cuando se inicia una partida.
create or replace function public.campus_game_catalog()
returns table (
  id uuid,
  titulo text,
  tema text,
  codigo text,
  asignatura text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select e.id, e.titulo, e.tema, e.codigo, e.asignatura, e.created_at
  from public.evaluaciones e
  where e.publicado is true
    and auth.uid() is not null
  order by e.created_at desc;
$$;

revoke all on function public.campus_game_catalog() from public, anon;
grant execute on function public.campus_game_catalog() to authenticated;

-- Conserva las tres partidas que ya eran gratuitas y suma las demos oficiales
-- de Morfofunción, Biología Celular y Educación para la Salud.
-- Los juegos de pago siguen protegidos por las políticas RLS existentes.
create or replace function public.campus_game_access(p_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.campus_is_admin()
    or exists (
      select 1 from public.campus_memberships m
      where m.user_id = auth.uid()
        and m.plan in ('monthly', 'semester', 'annual')
        and m.starts_at <= now()
        and m.expires_at > now()
    )
    or p_id in (
      '7d7b8eaa-4b8e-51cb-a9db-a666bda3d976'::uuid,
      '2fa17a3c-035a-50d7-afae-ed8fe3ba11fc'::uuid,
      'be379789-f013-4431-bb31-95b1c6f01517'::uuid,
      '113fd5dc-8283-9838-9557-f032f103b5ef'::uuid,
      'a7d3b295-dc3a-6c7a-6cc4-743cdd9724ae'::uuid,
      '29d04e4f-2469-1ff1-c583-9d8f2105e363'::uuid
    );
$$;
