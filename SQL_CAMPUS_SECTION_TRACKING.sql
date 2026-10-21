-- Seguimiento del menú. No modifica notas ni reconstruye actividad pasada.
begin;
create table if not exists public.campus_section_activity (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 section text not null check(section in ('flashcards','mapas','atlas','resumenes','intocables','banco','examenes','simulacros','evaluaciones','quiz','ahorcado','juegos')),
 action text not null check(action in ('opened','reviewed','completed')),
 subject text not null default '' check(length(subject)<=200),
 topic text not null default '' check(length(topic)<=500),
 resource_key text not null default '' check(length(resource_key)<=500),
 grade numeric check(grade between 0 and 100),
 created_at timestamptz not null default now()
);
create index if not exists campus_section_activity_user_date on public.campus_section_activity(user_id,created_at desc);
alter table public.campus_section_activity enable row level security;
revoke all on public.campus_section_activity from anon,authenticated;
grant select on public.campus_section_activity to authenticated;
drop policy if exists campus_activity_read on public.campus_section_activity;
create policy campus_activity_read on public.campus_section_activity for select to authenticated using(user_id=auth.uid() or public.campus_is_admin());
create or replace function public.record_campus_activity(event_id uuid,section_name text,action_name text,subject_name text default '',topic_name text default '',resource_name text default '',result_grade numeric default null)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 insert into public.campus_section_activity(id,user_id,section,action,subject,topic,resource_key,grade)
 values(event_id,auth.uid(),section_name,action_name,coalesce(subject_name,''),coalesce(topic_name,''),coalesce(resource_name,''),result_grade)
 on conflict(id) do nothing;
end; $$;
revoke all on function public.record_campus_activity(uuid,text,text,text,text,text,numeric) from public,anon;
grant execute on function public.record_campus_activity(uuid,text,text,text,text,text,numeric) to authenticated;
alter table public.resultados_simulacros add column if not exists menu_section text check(menu_section in ('evaluaciones','examenes','simulacros'));
notify pgrst,'reload schema';
commit;
