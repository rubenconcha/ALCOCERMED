-- Reacciones y comentarios internos de las videoclases. Sin correos públicos.
create function public.campus_video_exists(p_video text)
returns boolean language sql stable security invoker set search_path = '' as $$
 select p_video = 'ben-carson-5050' or exists
 (select 1 from public.videoclases where id::text = p_video and id <> 1);
$$;
revoke all on function public.campus_video_exists(text) from public, anon;
grant execute on function public.campus_video_exists(text) to authenticated;

create table public.campus_video_reactions (
 video_id text not null,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 author_name text not null default left(coalesce(nullif(auth.jwt()->'user_metadata'->>'full_name',''), 'Estudiante'),100),
 reaction text not null check (reaction in ('like','love','fun','excellent')),
 created_at timestamptz not null default now(),
 primary key(video_id,user_id)
);
create table public.campus_video_comments (
 id uuid primary key default gen_random_uuid(),
 video_id text not null,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 author_name text not null default left(coalesce(nullif(auth.jwt()->'user_metadata'->>'full_name',''), 'Estudiante'),100),
 body text not null check (char_length(btrim(body)) >= 1 and char_length(body) <= 1500),
 created_at timestamptz not null default now()
);
create index campus_video_comments_video_date on public.campus_video_comments(video_id,created_at desc,id desc);
create index campus_video_comments_owner on public.campus_video_comments(user_id);
create index campus_video_reactions_owner on public.campus_video_reactions(user_id);
alter table public.campus_video_reactions enable row level security;
alter table public.campus_video_comments enable row level security;
revoke all on public.campus_video_reactions, public.campus_video_comments from public,anon,authenticated;
grant select,delete on public.campus_video_reactions, public.campus_video_comments to authenticated;
grant insert(video_id,user_id,reaction), update(video_id,user_id,reaction) on public.campus_video_reactions to authenticated;
grant insert(video_id,user_id,body) on public.campus_video_comments to authenticated;

create policy video_reactions_read on public.campus_video_reactions for select to authenticated
 using ((select public.campus_has_video_access()) and public.campus_video_exists(video_id));
create policy video_reactions_insert on public.campus_video_reactions for insert to authenticated
 with check (user_id=(select auth.uid()) and (select public.campus_has_video_access()) and public.campus_video_exists(video_id));
create policy video_reactions_update on public.campus_video_reactions for update to authenticated
 using (user_id=(select auth.uid()) and (select public.campus_has_video_access()))
 with check (user_id=(select auth.uid()) and (select public.campus_has_video_access()) and public.campus_video_exists(video_id));
create policy video_reactions_delete on public.campus_video_reactions for delete to authenticated
 using (user_id=(select auth.uid()) and (select public.campus_has_video_access()));
create policy video_comments_read on public.campus_video_comments for select to authenticated
 using ((select public.campus_has_video_access()) and public.campus_video_exists(video_id));
create policy video_comments_insert on public.campus_video_comments for insert to authenticated
 with check (user_id=(select auth.uid()) and (select public.campus_has_video_access()) and public.campus_video_exists(video_id));
create policy video_comments_delete on public.campus_video_comments for delete to authenticated
 using ((user_id=(select auth.uid()) or (select public.campus_is_admin())) and (select public.campus_has_video_access()));

create function public.campus_video_reaction_summary(p_video text)
returns jsonb language sql stable security invoker set search_path = '' as $$
 select jsonb_build_object('counts',coalesce((select jsonb_object_agg(reaction,n) from
  (select reaction,count(*) n from public.campus_video_reactions where video_id=p_video group by reaction) s),'{}'::jsonb),
  'mine',(select reaction from public.campus_video_reactions where video_id=p_video and user_id=auth.uid()));
$$;
revoke all on function public.campus_video_reaction_summary(text) from public,anon;
grant execute on function public.campus_video_reaction_summary(text) to authenticated;

-- Apertura = 0 %. Los eventos del reproductor aumentan el progreso; una reacción nunca lo aumenta.
create function public.campus_record_video_activity(p_video text,p_progress integer default 0)
returns void language plpgsql security invoker set search_path = '' as $$
declare title text; subject text; pct integer;
begin
 if auth.uid() is null or not public.campus_has_video_access() or not public.campus_video_exists(p_video) then
  raise exception 'No tienes acceso a esta videoclase.' using errcode='42501';
 end if;
 pct := greatest(0,least(coalesce(p_progress,0),100));
 if p_video='ben-carson-5050' then
  title := 'Temas principales de anatomía y fisiología'; subject := 'MORFOFUNCIÓN';
 else
  select "TITULO","MATERIA" into title,subject from public.videoclases where id::text=p_video;
 end if;
 insert into public.progreso_videoclases(user_id,video_id,video_titulo,materia,progreso_pct,visto,fecha_visto)
 values(auth.uid(),p_video,title,subject,pct,pct>=90,now())
 on conflict(user_id,video_id) do update set
  progreso_pct=greatest(public.progreso_videoclases.progreso_pct,excluded.progreso_pct),
  visto=greatest(public.progreso_videoclases.progreso_pct,excluded.progreso_pct)>=90,
  fecha_visto=now();
end;
$$;
revoke all on function public.campus_record_video_activity(text,integer) from public,anon;
grant execute on function public.campus_record_video_activity(text,integer) to authenticated;
