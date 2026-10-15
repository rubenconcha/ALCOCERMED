'use strict';
// Static inventory: evidence of coverage, never a substitute for academic review.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'mindmap-detailed-content.js'),'utf8'),context);
const general=read('content/mindmaps-catalog.json');
const details=read('content/mindmaps-premium-catalog.json');
const restricted=new Set(read('content/mindmaps-restricted-general.json').map(x=>x.id));
const topics=general.filter(t=>/^(morfo|biocel|salud)_\d{2}_/.test(t.key)).map(t=>{
 const id=t.key.replace(/\.[^.]+$/,'');
 const maps=details.filter(m=>m.parent_key===t.key).map(m=>{
  const data=read('api/_mindmaps/'+m.id+'.json');
  const items=data.sections.flatMap(s=>s.groups.flatMap(g=>g.items));
  const lengths=items.map(i=>i.text.trim().split(/\s+/).length);
  return {id:m.id,title:m.titulo,sections:data.sections.length,concepts:items.length,
   very_short_explanations:lengths.filter(n=>n<15).length,
   sourced_concepts:items.filter(i=>i.source?.pdfPage).length,
   average_words:Math.round(lengths.reduce((a,b)=>a+b,0)/Math.max(1,lengths.length)),
   academic_review:data.review?.state||'pending',original_logo_verified:!!m.curated,
   generative_art_verified:!!(m.curated&&data.assets.generative_download)};
 });
 const generalSections=restricted.has(id)?read('api/_mindmaps/'+id+'.json').sections:context.window.MINDMAP_DETAILED_CONTENT[t.key];
 return {id,title:t.title,subject:t.subject,general_sections:generalSections?.length||0,
  detailed_maps:maps.length,maps,priority:/^morfo_(16|18)_/.test(id)?1:2,
  workflow_status:'requires_academic_and_visual_review',
  next_action:'Contrast the actual chapter with its objectives; author missing mechanisms, relationships, comparisons and reasoned practice. Verify original branding and generated illustrations.'};
});
topics.sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
const report={schema_version:1,inventory_date:new Date().toISOString(),
 scope:'Local authoring files. Database delivery and clinical accuracy require separate verification.',
 official_topics:topics.length,detailed_maps:topics.reduce((n,t)=>n+t.detailed_maps,0),
 reviewed_topics:0,warning:'Existing quantities do not demonstrate sufficient depth. Pending visual flags mean not verified, not necessarily absent.',topics};
fs.mkdirSync(path.join(root,'quality'),{recursive:true});
fs.writeFileSync(path.join(root,'quality/material-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({officialTopics:report.official_topics,detailedMaps:report.detailed_maps,
 veryShortExplanations:topics.flatMap(t=>t.maps).reduce((n,m)=>n+m.very_short_explanations,0),
 academicReview:'pending',priority:topics.filter(t=>t.priority===1).map(t=>t.title)}));
