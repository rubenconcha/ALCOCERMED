from pathlib import Path
import json,struct,numpy as np
from scipy.spatial import cKDTree
base=Path('tmp/musculos-source');b=(base/'z-bones-original.glb').read_bytes();n=struct.unpack_from('<I',b,12)[0];g=json.loads(b[20:20+n]);off=20+n;blen,typ=struct.unpack_from('<II',b,off);binary=b[off+8:off+8+blen]
s=Path('anatomia-alineacion.js').read_text(encoding='utf-8');align=json.loads(s[s.index('=')+1:].strip().rstrip(';'))['skeletal'];nodes=g['nodes'];parents={c:i for i,x in enumerate(nodes) for c in x.get('children',[])};worlds={}
def world(i):
 if i not in worlds:
  x=nodes[i];m=np.array(x.get('matrix',np.eye(4).flatten(order='F'))).reshape(4,4,order='F');worlds[i]=world(parents[i])@m if i in parents else m
 return worlds[i]
def vertices(i):
 x=nodes[i];mat=np.array(align.get(x.get('name'),np.eye(4).flatten(order='F'))).reshape(4,4,order='F')@world(i);vs=[]
 for pr in g['meshes'][x['mesh']]['primitives']:
  a=g['accessors'][pr['attributes']['POSITION']];v=g['bufferViews'][a['bufferView']];start=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',12);points=np.ndarray((a['count'],3),dtype='<f4',buffer=binary,offset=start,strides=(stride,4)).astype(float);vs.append(points@mat[:3,:3].T+mat[:3,3])
 return np.concatenate(vs)
# Exact source owner names present in the optimized bone asset.
b2=Path('assets/anatomy/esqueleto-detallado.glb').read_bytes();n2=struct.unpack_from('<I',b2,12)[0];opt=json.loads(b2[20:20+n2]);owner_names={x.get('extras',{}).get('name') or x.get('name') for x in opt['nodes']};trees={};records=[]
for i,x in enumerate(nodes):
 name=x.get('name','')
 if not name.endswith('.j') or 'mesh' not in x:continue
 k=parents.get(i)
 while k is not None and not (nodes[k].get('name') in owner_names and 'mesh' in nodes[k]):k=parents.get(k)
 if k is None:continue
 owner=nodes[k]['name']
 if name[:-2].lower().strip()==owner.lower().removesuffix('.r').removesuffix('.l') or (name[:-2] in ['Atlas','Axis'] and owner.startswith(name[:-2])):continue
 if k not in trees:
  v=vertices(k);trees[k]=(cKDTree(v),v,np.linalg.norm(v.max(0)-v.min(0)))
 tree,v,size=trees[k];dots=vertices(i);dist,ind=tree.query(dots);best=int(dist.argmin());error=float(dist[best]);point=v[ind[best]]
 if error>max(size*.04,.001):continue
 records.append(dict(bone=owner,raw=name[:-2],point=[round(float(z),8) for z in point],sourceDistance=round(error,8)))
translations={}
for line in (base/'Translations0.txt').read_text(encoding='utf-8-sig').splitlines():
 columns=line.split(';')
 if len(columns)>3:translations[columns[0].strip().lower()]=columns[3].strip()
translations.update({'atlas':'Atlas','external surface of frontal bone':'Cara externa del frontal','lateral lip of linea apera':'Labio lateral de la línea áspera','medial lip of linea apera':'Labio medial de la línea áspera','pterygoid process':'Apófisis pterigoides','supercilliary arch':'Arco superciliar','[trochlear spine]':'Espina troclear'})
for record in records:
 record['name']=translations.get(record['raw'].strip().lower())
 if not record['name']:raise ValueError('Missing Spanish label: '+record['raw'])
 for old,new in [('Capitulo','Capítulo'),('Lamina','Lámina'),('Epicondilo','Epicóndilo'),('Troclea','Tróclea')]:record['name']=record['name'].replace(old,new)
Path('anatomia-huesos-relieves.js').write_text('// Z-Anatomy annotation arrows and Spanish nomenclature, anchored to original bone surfaces. CC BY-SA 4.0.\nexport const boneLandmarks='+json.dumps(records,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Landmarks',len(records),'bone meshes',len(set(r['bone'] for r in records)))
