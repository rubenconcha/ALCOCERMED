import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
out=root.parent/'outputs'/'ben-carson-sin-camara'
results=[]
for v in json.loads((root/'faceless'/'data.json').read_text(encoding='utf-8')):
 file=out/(v['id']+'.mp4')
 meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(file)]))
 streams=meta['streams']
 video=next(s for s in streams if s['codec_type']=='video')
 audio=next(s for s in streams if s['codec_type']=='audio')
 assert (video['width'],video['height'],video['r_frame_rate'])==(1080,1920,'30/1')
 assert abs(float(meta['format']['duration'])-sum(s['frames'] for s in v['scenes'])/30)<.15
 subprocess.run(['ffmpeg','-v','error','-i',str(file),'-f','null','-'],check=True,stdout=subprocess.DEVNULL)
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(file),'-vf','fps=1/5,scale=270:480,tile=7x1','-frames:v','1',str(out/(v['id']+'-revision.jpg'))],check=True)
 results.append(dict(file=file.name,duration=meta['format']['duration'],width=1080,height=1920,fps=30,audio=audio['codec_name'],decode='OK'))
(out/'verificacion.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
