begin;
create temporary table video_qa_ids(label text primary key,id uuid default gen_random_uuid(),session_id uuid default gen_random_uuid());
insert into video_qa_ids(label) values('a'),('b');
create temporary table video_qa_checks(label text,ok boolean);
grant select on video_qa_ids to authenticated;
grant all on video_qa_checks to authenticated;
insert into auth.users(id,email,raw_user_meta_data,created_at,aud,role)
 select id,'video-qa-'||id||'@example.invalid','{"full_name":"Prueba temporal"}',now(),'authenticated','authenticated' from video_qa_ids;
insert into public.campus_memberships(user_id,plan,starts_at,expires_at)
 select id,'monthly',now()-interval '1 hour',now()+interval '1 day' from video_qa_ids
 on conflict(user_id) do update set plan='monthly',starts_at=excluded.starts_at,expires_at=excluded.expires_at;
insert into auth.sessions(id,user_id,created_at,updated_at) select session_id,id,now(),now() from video_qa_ids;
insert into public.device_sessions(user_id,device_id,is_active,auth_session_id) select id,'video-qa-'||id,true,session_id from video_qa_ids;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select id from video_qa_ids where label='a'),'role','authenticated','session_id',(select session_id from video_qa_ids where label='a'),'user_metadata',jsonb_build_object('full_name','Alumno A'))::text,true);
set local role authenticated;
insert into public.campus_video_reactions(video_id,user_id,reaction) values('ben-carson-5050',auth.uid(),'like');
insert into public.campus_video_reactions(video_id,user_id,reaction) values('ben-carson-5050',auth.uid(),'love')
 on conflict(video_id,user_id) do update set reaction=excluded.reaction;
insert into video_qa_checks values('one current reaction per account',(select count(*)=1 from public.campus_video_reactions where user_id=auth.uid()));
insert into public.campus_video_comments(video_id,body) values('ben-carson-5050','Comentario temporal A');
insert into video_qa_checks values('author filled from authenticated identity',(select author_name='Alumno A' from public.campus_video_comments where user_id=auth.uid()));
select public.campus_record_video_activity('ben-carson-5050',0);
insert into video_qa_checks values('opening is not completion',(select progreso_pct=0 and not visto from public.progreso_videoclases where user_id=auth.uid() and video_id='ben-carson-5050'));
select public.campus_record_video_activity('ben-carson-5050',35);
select public.campus_record_video_activity('ben-carson-5050',0);
insert into video_qa_checks values('reopening preserves highest progress',(select progreso_pct=35 and not visto from public.progreso_videoclases where user_id=auth.uid() and video_id='ben-carson-5050'));
do $$begin
 begin insert into public.campus_video_comments(video_id,user_id,body) values('ben-carson-5050',(select id from video_qa_ids where label='b'),'Impersonation');
  raise exception 'Impersonation accepted'; exception when insufficient_privilege then insert into video_qa_checks values('cannot forge comment owner',true);end;
 begin insert into public.campus_video_comments(video_id,author_name,body) values('ben-carson-5050','Teacher','Forged name');
  raise exception 'Forged name accepted'; exception when insufficient_privilege then insert into video_qa_checks values('cannot forge author name',true);end;
 begin insert into public.campus_video_comments(video_id,body) values('not-a-video','Invalid video');
  raise exception 'Invalid video accepted'; exception when insufficient_privilege then insert into video_qa_checks values('unknown video denied',true);end;
 begin insert into public.campus_video_comments(video_id,body) values('ben-carson-5050',repeat('x',1501));
  raise exception 'Oversize comment accepted'; exception when check_violation then insert into video_qa_checks values('oversize comments denied',true);end;
end$$;
reset role;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select id from video_qa_ids where label='b'),'role','authenticated','session_id',(select session_id from video_qa_ids where label='b'))::text,true);
set local role authenticated;
insert into public.campus_video_comments(video_id,body) values('ben-carson-5050','Comentario temporal B');
do $$declare n integer;begin
 update public.campus_video_reactions set reaction='fun' where user_id=(select id from video_qa_ids where label='a');get diagnostics n=row_count;
 insert into video_qa_checks values('cannot modify another reaction',n=0);
 delete from public.campus_video_comments where user_id=(select id from video_qa_ids where label='a');get diagnostics n=row_count;
 insert into video_qa_checks values('cannot delete another comment',n=0);
end$$;
insert into video_qa_checks values('platform classmates can see the conversation',(select count(*)=2 from public.campus_video_comments where user_id in (select id from video_qa_ids)));
insert into video_qa_checks values('aggregate counts include class reactions',public.campus_video_reaction_summary('ben-carson-5050')->'counts'->>'love'='1');
delete from public.campus_video_comments where user_id=auth.uid();
insert into video_qa_checks values('can delete own comment',(select count(*)=0 from public.campus_video_comments where user_id=auth.uid()));
reset role;
update public.campus_memberships set expires_at=now()-interval '1 second' where user_id=(select id from video_qa_ids where label='b');
set local role authenticated;
insert into video_qa_checks values('expired membership hides comments',(select count(*)=0 from public.campus_video_comments));
insert into video_qa_checks values('expired membership hides reactions',(select count(*)=0 from public.campus_video_reactions));
do $$begin
 begin insert into public.campus_video_comments(video_id,body) values('ben-carson-5050','Expired');raise exception 'Expired account accepted';
 exception when insufficient_privilege then insert into video_qa_checks values('expired account cannot comment',true);end;
 begin perform public.campus_record_video_activity('ben-carson-5050',100);raise exception 'Expired progress accepted';
 exception when insufficient_privilege then insert into video_qa_checks values('expired account cannot record progress',true);end;
end$$;
reset role;
update public.device_sessions set is_active=false where user_id=(select id from video_qa_ids where label='a');
select set_config('request.jwt.claims',jsonb_build_object('sub',(select id from video_qa_ids where label='a'),'role','authenticated','session_id',(select session_id from video_qa_ids where label='a'))::text,true);
set local role authenticated;
insert into video_qa_checks values('displaced device cannot read comments',(select count(*)=0 from public.campus_video_comments));
do $$begin
 begin insert into public.campus_video_reactions(video_id,user_id,reaction) values('ben-carson-5050',auth.uid(),'fun') on conflict(video_id,user_id) do update set reaction=excluded.reaction;
  raise exception 'Displaced device accepted'; exception when insufficient_privilege then insert into video_qa_checks values('displaced device cannot react',true);end;
end$$;
reset role;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select u.id from auth.users u where lower(u.email)='pichon4488@gmail.com' limit 1),'role','authenticated')::text,true);
set local role authenticated;
do $$declare n integer;begin
 if not public.campus_is_admin() then raise exception 'Admin fixture unavailable';end if;
 delete from public.campus_video_comments where user_id in (select id from video_qa_ids);get diagnostics n=row_count;
 insert into video_qa_checks values('teacher can moderate comments',n=1);
end$$;
reset role;
insert into video_qa_checks values('anonymous cannot read comments',not has_table_privilege('anon','public.campus_video_comments','select'));
insert into video_qa_checks values('anonymous cannot read reactions',not has_table_privilege('anon','public.campus_video_reactions','select'));
do $$begin if exists(select 1 from video_qa_checks where not coalesce(ok,false)) then raise exception 'Video RLS check failed';end if;end$$;
select jsonb_agg(jsonb_build_object('check',label,'passed',ok)) as verification from video_qa_checks;
rollback;
