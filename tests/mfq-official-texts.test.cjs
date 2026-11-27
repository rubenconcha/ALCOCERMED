const {test}=require('node:test');
const assert=require('node:assert/strict');
const data=require('../study-calendar-data.js');
const books=require('../api/_official_texts/segments.json');
const manifest=require('../referencias-oficiales/manifest.json');
const fs=require('node:fs');
const path=require('node:path');

test('every MFQ class and practice block has the verified reading for its date in all three groups',()=>{
 for(const group of ['presencial_1','presencial_2','virtual']) {
  let dates=0;
  for(const [date,items] of data.buildGroupPlan('2026-11-26',group)) {
   dates++;
   const expected=data.mfqReadings(date);
   assert.ok(expected.length,date);
   for(const item of items.filter(row=>row.resource==='sufficiency')) {
    assert.deepEqual(item.readingOptions,expected,group+' '+date);
    assert.equal(item.reading.id,expected[0].id);
    assert.deepEqual(item.assignment,data.practiceFor(date,item.assignment.block));
   }
   if(group==='virtual')assert.deepEqual(items.find(row=>row.id.endsWith('-clases')).studyLinks,expected);
   for(const ref of expected) {
    assert.equal(books[ref.slug].year,2027);
    assert.equal(ref.printed.length,0,'No fabricated continuous printed numbers');
    assert.ok(ref.pdf[0]>1 && ref.pdf[1]>=ref.pdf[0] && ref.pdf[1]<books[ref.slug].pages);
    assert.ok(ref.pdf[1]-ref.pdf[0]<21,'Only the assigned section, not the full textbook');
    assert.equal(ref.topicLinks,undefined,'MFQ readings do not invent Medicine evaluation IDs');
   }
  }
  assert.equal(dates,40);
 }
 assert.deepEqual(data.mfqReadings('2026-11-28'),[]);
 assert.deepEqual(data.mfqReadings('2027-01-18'),[]);
});

test('the supplied original hashes, page counts and isolated free preview segments are registered',()=>{
 const expected={
  fisica:[132,'947de21e3a00468da21d8ecc2be3c79660c3459f6190e1bc8165ffd79d1aff23'],
  quimica:[137,'dd99d67c577fdde9cf717b0d18007ccdfb3538bceaad5dad3b8158fc6c5e111c'],
  matematicas:[309,'fc5ae1d389a63511b4ac5a80ea60104f26bc57db65de328491bb8c62b2b19e98'],
 };
 for(const [slug,[pages,hash]] of Object.entries(expected)) {
  const source=manifest.archivos.find(item=>item.materia===slug);
  assert.equal(source.paginas_pdf,pages);assert.equal(source.sha256,hash);
  assert.equal(books[slug].pages,pages);assert.equal(books[slug].sha256,hash);
  const segments=Object.entries(books[slug].segments);
  assert.deepEqual(segments.slice(0,4).map(([start])=>Number(start)),[1,2,3,4]);
  let offset=0;
  for(const [,range] of segments){assert.equal(range[0],offset);assert.ok(range[1]>0);offset+=range[1];}
  assert.equal(offset,books[slug].bytes);
  assert.ok(fs.statSync(path.join(__dirname,'../assets/study-art/mfq-'+slug+'.webp')).size>1000);
 }
});
