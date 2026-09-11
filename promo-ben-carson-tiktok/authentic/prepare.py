import truststore
truststore.inject_into_ssl()
import asyncio,json,math,subprocess,wave,struct,random
from pathlib import Path
import edge_tts
root=Path(__file__).resolve().parent.parent
assets=root/'public'/'authentic'
scenes=[
 ('hook','¿Te imaginas entrando aquí?','facultad.jpg',0),
 ('goal','Medicina. Universidad Mayor de San Simón.','facultad.jpg',0),
 ('reality','Ese sueño empieza mucho antes del examen.','clip3.mp4',0),
 ('practice','Con preguntas. Con práctica. Y corrigiendo lo que todavía te cuesta.','clip3.mp4',3),
 ('team','Y con gente que también quiere llegar.','clip4.mp4',1),
 ('brand','Esto es Prepa Ben Carson.','clip4.mp4',3),
 ('cta','¿Tu meta también es Medicina? Escríbenos y conoce nuestra preparación.','clip3.mp4',1)
]
async def main():
 result=[]
 for i,(kind,text,bg,offset) in enumerate(scenes):
  words=[]
  with (assets/f'voice-{i}.mp3').open('wb') as a:
   async for c in edge_tts.Communicate(text,'es-BO-SofiaNeural',rate='+9%',boundary='WordBoundary').stream():
    if c['type']=='audio': a.write(c['data'])
    elif c['type']=='WordBoundary': words.append(dict(text=c['text'],start=c['offset']/1e7,end=(c['offset']+c['duration'])/1e7))
  duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(assets/f'voice-{i}.mp3')]))
  result.append(dict(kind=kind,text=text,bg=bg,offset=offset,frames=math.ceil((duration+.18)*30),words=words))
  print(kind,duration,flush=True)
 (root/'authentic'/'data.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
asyncio.run(main())

# Original rhythmic bed: synth bass, chords, kick, snare and hi-hat.
random.seed(16)
sr=22050; bpm=112; beat=60/bpm
with wave.open(str(assets/'beat.wav'),'w') as w:
 w.setparams((1,2,sr,0,'NONE','not compressed'))
 for n in range(sr*45):
  t=n/sr;p=t%beat; eighth=t%(beat/2); b=int(t/beat); bar=int(t/(4*beat))
  kick=math.sin(2*math.pi*(48*p+4*(1-math.exp(-p*32))))*math.exp(-p*19)*.26
  noise=random.uniform(-1,1)
  snare=noise*math.exp(-p*35)*.12 if b%2 else 0
  hat=noise*math.exp(-eighth*150)*.055
  bassHz=[65.406,55,43.654,49][bar%4]
  bass=(math.sin(2*math.pi*bassHz*t)+.25*math.sin(2*math.pi*bassHz*2*t))*.075*min(p*30,1)*math.exp(-p*2)
  arpHz=bassHz*([4,6,8,10][int(t/(beat/2))%4])
  arp=math.sin(2*math.pi*arpHz*t)*math.exp(-eighth*13)*.035
  fade=min(t/.04,1)*min((45-t)/2,1)
  w.writeframesraw(struct.pack('<h',int(32767*fade*(kick+snare+hat+bass+arp))))
