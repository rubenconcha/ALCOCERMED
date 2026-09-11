import subprocess,json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
out=root.parent/'outputs'/'ben-carson-pro'
source=out/'premaster.mp4'
target=out/'BenCarson-Edicion-Pro.mp4'
scan=subprocess.run(['ffmpeg','-hide_banner','-i',str(source),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-vn','-f','null','-'],capture_output=True,text=True,check=True)
stats=json.JSONDecoder().raw_decode(scan.stderr[scan.stderr.rfind('{'):])[0]
af=f"loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:offset={stats['target_offset']}:linear=true:print_format=summary"
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-c:v','copy','-af',af,'-c:a','aac','-b:a','256k','-ar','48000','-movflags','+faststart',str(target)],check=True)
subprocess.run(['ffmpeg','-v','error','-i',str(target),'-f','null','-'],stdout=subprocess.DEVNULL,check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(target),'-vf','fps=1/3,scale=216:384,tile=5x2','-frames:v','1',str(out/'revision-final.jpg')],check=True)
meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,width,height,r_frame_rate','-show_entries','format=duration,size','-of','json',str(target)]))
(out/'verificacion.json').write_text(json.dumps({'media':meta,'normalization_input':stats,'decode':'OK'},indent=2),encoding='utf8')
print(json.dumps(meta,indent=2))
