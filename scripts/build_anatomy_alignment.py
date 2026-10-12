from pathlib import Path
import json,struct,re,numpy as np
s=Path('tmp/musculos-source/human-body.prefab').read_text();docs=re.split(r'(?m)^--- !u!',s)[1:];ids={re.search(r'&(-?\d+)',d).group(1):d for d in docs};objects={}
def values(d,k):return [float(x) for x in re.findall(r'[xyzw]: ([^,}]+)',re.search(k+r': (\{[^}]+\})',d).group(1))]
for d in docs:
 if not d.startswith('4 &') or 'm_GameObject:' not in d:continue
 gid=re.search(r'm_GameObject: {fileID: (-?\d+)}',d).group(1);go=ids.get(gid,'');m=re.search(r'm_Name: (.+)',go)
 if not m:continue
 name=m.group(1).strip().strip("'");position=values(d,'m_LocalPosition');scale=values(d,'m_LocalScale');rotation=values(d,'m_LocalRotation');father=re.search(r'm_Father: {fileID: (-?\d+)}',d).group(1)
 objects.setdefault(name,[]).append(dict(position=position,scale=scale,rotation=rotation,father=father))
sources={'muscular':'z-muscles-original','skeletal':'z-bones-original','visceral':'VisceralSystem100','nervous':'NervousSystem100','cardiac':'CardioVascular41','vascular':'CardioVascular41','joints':'Joints100','integumentary':'regions-original'}
result={}
for source,stem in sources.items():
 b=Path('tmp/musculos-source/'+stem+'.glb').read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);records={}
 for node in j['nodes']:
  name=node.get('name','');o=objects.get(name,[])
  if len(o)!=1 or name=='RootNode':continue
  mat=np.array(node.get('matrix',np.eye(4).flatten(order='F'))).reshape((4,4),order='F')
  # Assimp drops pivots on empty grouping nodes. Preserve all valid nonidentity FBX transforms.
  if not np.allclose(mat,np.eye(4),atol=1e-7):continue
  u=o[0];x,y,z,w=u['rotation'];r=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
  m=np.eye(4);m[:3,:3]=r@np.diag(u['scale']);m[:3,3]=u['position'];f=np.diag([-100,100,100,1]);m=f@m@np.linalg.inv(f)
  if np.allclose(m,np.eye(4),atol=1e-6):continue
  records[name]=[float(v) for v in m.flatten(order='F')]
 # The web optimizer removes empty grouping nodes, so carry their source-space
 # world correction onto every named descendant instead of relying on the group.
 parents={c:i for i,node in enumerate(j['nodes']) for c in node.get('children',[])}
 oldworld={};newworld={}
 def worlds(i):
  if i in oldworld:return
  node=j['nodes'][i];local=np.array(node.get('matrix',np.eye(4).flatten(order='F'))).reshape((4,4),order='F')
  corrected=np.array(records.get(node.get('name'),local.flatten(order='F'))).reshape((4,4),order='F')
  if i in parents:
   worlds(parents[i]);oldworld[i]=oldworld[parents[i]]@local;newworld[i]=newworld[parents[i]]@corrected
  else:oldworld[i]=local;newworld[i]=corrected
 corrections={}
 for i,node in enumerate(j['nodes']):
  worlds(i);delta=newworld[i]@np.linalg.inv(oldworld[i]);name=node.get('name','')
  if name and not np.allclose(delta,np.eye(4),atol=1e-6):corrections[name]=[float(v) for v in delta.flatten(order='F')]
 result[source]=corrections
 print(source,len(corrections),list(corrections)[:12])
Path('anatomia-alineacion.js').write_text('// Transforms of empty FBX groups restored from the original Z-Anatomy Human Body prefab. CC BY-SA 4.0.\nexport const anatomyAlignment='+json.dumps(result,ensure_ascii=False,indent=2)+';\n',encoding='utf8')
