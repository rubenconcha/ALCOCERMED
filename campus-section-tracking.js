'use strict';
// Activity is self-reported usage, not a proctored attendance or reading certificate.
(function(){
 let unavailable=false;
 window.CampusTracking={record(section,action,subject='',topic='',resource='',grade=null){
  if(unavailable||typeof currentUser==='undefined'||!currentUser?.id)return;
  const actor=currentUser.id,eventId=crypto.randomUUID();
  // No persistent queue: an account change must never submit another person's activity.
  try{const client=getSupabase();if(currentUser?.id!==actor)return;
   Promise.resolve(client.rpc('record_campus_activity',{event_id:eventId,section_name:section,action_name:action,subject_name:String(subject||'').slice(0,200),topic_name:String(topic||'').slice(0,500),resource_name:String(resource||'').slice(0,500),result_grade:grade})).then(({error})=>{if(error&&['PGRST202','42P01'].includes(error.code))unavailable=true;}).catch(()=>{});
  }catch(_){}
 }};
})();
