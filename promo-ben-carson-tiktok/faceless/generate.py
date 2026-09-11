import asyncio, json, subprocess, math
from pathlib import Path
import edge_tts

root = Path(__file__).resolve().parent.parent
out = root / 'public' / 'faceless'
videos = [
 {'id':'Repaso','tag':'ESTUDIA CON MÉTODO','accent':'#63F5CD','scenes':[
 ('¿LEES… Y SE TE OLVIDA?', 'Prueba esto con el tema de hoy', '¿Lees y se te olvida? Prueba esto con el tema de hoy.', 'book'),
 ('CIERRA EL LIBRO', '01 / Recuerda sin mirar', 'Primero, cierra el libro. Explica lo que recuerdas sin mirar tus apuntes.', 'book'),
 ('PONLO EN PAPEL', '02 / Encuentra los vacíos', 'Escríbelo en una hoja. Después compara y marca lo que olvidaste o confundiste.', 'notes'),
 ('PONTE A PRUEBA', '03 / Explica tu respuesta', 'Resuelve una pregunta y explica por qué descartas las otras opciones.', 'quiz'),
 ('¿QUÉ MATERIA TE CUESTA?', 'Cuéntanos en comentarios', '¿Qué materia te cuesta más? Cuéntanos en comentarios. Sigue a Prepa Ben Carson.', 'cta')]},
 {'id':'Simulacro','tag':'APRENDE DE TUS ERRORES','accent':'#FFD36A','scenes':[
 ('TU NOTA NO LO DICE TODO', '¿Ya corregiste tu simulacro?', 'Tu nota no lo dice todo. Lo importante ahora es revisar tus errores.', 'quiz'),
 ('¿QUÉ FALLÓ?', '01 / No conocía el tema', 'Si no conocías el tema, vuelve a la base y practica una pregunta sencilla.', 'notes'),
 ('¿CONFUNDISTE CONCEPTOS?', '02 / Compara las diferencias', 'Si confundiste conceptos, compáralos y escribe la diferencia con tus palabras.', 'compare'),
 ('¿LEÍSTE MUY RÁPIDO?', '03 / Revisa la consigna', 'Si leíste muy rápido, identifica exactamente qué te pide la pregunta.', 'quiz'),
 ('CORRIGE. PRACTICA. REPITE.', 'Guárdalo para tu próximo simulacro', 'Guarda este video para tu próximo simulacro. Prepárate con Ben Carson.', 'cta')]},
 {'id':'RetoBiologia','tag':'RETO DE BIOLOGÍA / 01','accent':'#96B7FF','scenes':[
 ('¿DÓNDE SE FABRICAN LAS PROTEÍNAS?', 'Pregunta de práctica • Biología', 'Reto de biología. ¿Qué estructura celular sintetiza las proteínas?', 'cell'),
 ('ELIGE TU RESPUESTA', 'A  Lisosoma\nB  Ribosoma\nC  Aparato de Golgi', 'A, lisosoma. B, ribosoma. C, aparato de Golgi. Piensa tu respuesta.', 'options'),
 ('B / RIBOSOMA', 'Une aminoácidos para formar proteínas', 'La respuesta es B: ribosoma. Allí se unen aminoácidos para formar proteínas.', 'cell'),
 ('NO LOS CONFUNDAS', 'Golgi: modifica y clasifica\nLisosoma: digestión celular', 'El aparato de Golgi modifica y clasifica. El lisosoma participa en la digestión celular.', 'compare'),
 ('¿ACERTASTE?', 'Sigue la cuenta para otro reto', '¿Acertaste? Sigue a Prepa Ben Carson para practicar con más retos.', 'cta')]}
]

async def main():
 for video in videos:
  result=[]
  for i,(title,sub,voice,kind) in enumerate(video['scenes']):
   filename=f"{video['id']}-{i}.mp3"
   await edge_tts.Communicate(voice, 'es-BO-MarceloNeural', rate='+8%').save(str(out/filename))
   seconds=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(out/filename)]))
   frames=math.ceil((seconds+0.45)*30)
   if kind=='options': frames+=60
   result.append(dict(title=title,sub=sub,voice=voice,kind=kind,audio='faceless/'+filename,frames=frames))
  video['scenes']=result
  print(video['id'],sum(s['frames'] for s in result)/30,flush=True)
 (root/'faceless'/'data.json').write_text(json.dumps(videos,ensure_ascii=False,indent=2),encoding='utf-8')

asyncio.run(main())
