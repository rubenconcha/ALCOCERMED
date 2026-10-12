// Educational reconstruction, not an original segmented Z-Anatomy nerve.
// Normalized coordinates use the atlas' shared frame (body height = 6).
// Inferior gluteal nerve: infrapiriform passage, then branches on the deep
// gluteus maximus surface. Surface points are derived from the source muscle.
// References: Saladin, muscle table p. 361; NCBI Bookshelf NBK532884.
export function addGlutealNerves(THREE, parts, material) {
 for (const side of ['left','right']) {
  const suffix=side==='left'?'.l':'.r',sign=side==='left'?1:-1;
  if(parts.some(p=>p.name==='Inferior gluteal nerve'+suffix))continue;
  const muscle=parts.find(p=>p.catalogId==='gluteus'&&p.side===side);
  if(!muscle)continue;
  const shell=new THREE.Mesh(muscle.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
  shell.updateMatrixWorld(true);
  const ray=new THREE.Raycaster(),point=(x,y,z)=>new THREE.Vector3(sign*x,y,z);
  const surface=(x,y)=>{
   ray.set(point(x,y,1),new THREE.Vector3(0,0,-1));
   const hit=ray.intersectObject(shell,false)[0];
   return hit?hit.point.clone().add(new THREE.Vector3(0,0,.006)):null;
  };
  const entry=surface(.245,-.20);
  if(!entry){shell.material.dispose();continue;}
  const junction=point(.205,.015,-.245),geometries=[];
  const tube=(points,radius)=>{
   const curve=new THREE.CatmullRomCurve3(points,false,'centripetal');
   const g=new THREE.TubeGeometry(curve,Math.max(24,points.length*12),radius,10,false);
   g.computeBoundingBox();g.computeBoundingSphere();geometries.push(g);
  };
  // The proximal segment is separate from the sciatic nerve; it is not a
  // sciatic branch. Fine rootlets/individual variants are not reconstructed.
  tube([point(.125,.11,-.155),point(.17,.065,-.205),junction,entry],.0045);
  const terminals=[[.31,.13],[.37,.02],[.40,-.13],[.35,-.30],[.27,-.40]];
  for(const [x,y] of terminals){
   const path=[entry];
   for(let i=1;i<=6;i++){const t=i/6,p=surface(.245+(x-.245)*t+.012*Math.sin(t*Math.PI),-.20+(y+.20)*t);if(p)path.push(p)}
   if(path.length<4)continue;
   tube(path,.0024);
   // Terminal twigs follow the actual deep muscle surface rather than
   // floating in front of it; this remains a schematic distribution.
   for(const t of [.48,.73]){
    const base=path[Math.round(t*(path.length-1))],a=surface(Math.abs(base.x)+.035,base.y+.035),end=surface(Math.abs(base.x)+.065,base.y+.055);
    if(a&&end)tube([base,a,end],.0014);
   }
  }
  for(const geometry of geometries){parts.push({key:'nervous:Inferior gluteal nerve'+suffix,name:'Inferior gluteal nerve'+suffix,geometry,box:geometry.boundingBox.clone(),system:'nervous',material,side,reconstructed:true});}
  shell.material.dispose();
 }
}
