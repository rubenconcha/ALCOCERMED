// Cosmetic surface variation, not histology or a map of vessels/lesions.
// Uses source coordinates so it does not depend on absent texture UVs.
export function finishOrganMaterial(material,system){
 if(!['respiratory','digestive','urinary','endocrine','lymphatic'].includes(system))return;
 material.roughness=system==='respiratory'?.57:.48;
 material.clearcoat=.16;material.clearcoatRoughness=.48;
 material.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vTissuePosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nvTissuePosition = position;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vTissuePosition;
float tissueHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float tissueNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(tissueHash(i),tissueHash(i+vec3(1,0,0)),f.x),mix(tissueHash(i+vec3(0,1,0)),tissueHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(tissueHash(i+vec3(0,0,1)),tissueHash(i+vec3(1,0,1)),f.x),mix(tissueHash(i+vec3(0,1,1)),tissueHash(i+vec3(1,1,1)),f.x),f.y),f.z);}`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float mottling=tissueNoise(vTissuePosition*90.0)*0.55+tissueNoise(vTissuePosition*250.0)*0.45;
diffuseColor.rgb *= 0.90 + mottling*0.16;`);
 };
 material.customProgramCacheKey=()=> 'atlas-soft-tissue-14';
}
