// Deliberately schematic, low-amplitude physiological motion on source meshes.
// Baseline geometry and attachment coordinates remain unchanged when paused.
export const physiology={
 lungs:{label:'Respiración',duration:5,phases:['Inspiración: aumenta el volumen pulmonar','Espiración: retroceso elástico'],chapter:22},
 heart:{label:'Ciclo cardíaco',duration:1.2,phases:['Sístole auricular','Sístole ventricular','Diástole y llenado'],chapter:19},
 oesophagus:{label:'Peristalsis',duration:4,phases:['La onda de contracción propulsa el bolo','La pared vuelve al reposo'],chapter:25},
 ureters:{label:'Transporte de orina',duration:4,phases:['La onda peristáltica avanza hacia la vejiga','La pared vuelve al reposo'],chapter:23}
};
export function motionState(id,time,region='ventricular'){
 const d=physiology[id];if(!d)return null;
 const phase=(time/d.duration)%1;
 if(id==='lungs'){const expansion=(1-Math.cos(phase*Math.PI*2))/2;return {scale:[1+expansion*.025,1+expansion*.018,1+expansion*.025],phase:phase<.5?0:1};}
 if(id==='heart'){const atrial=phase<.125?Math.sin(phase/.125*Math.PI):0,ventricular=phase>=.125&&phase<.5?Math.sin((phase-.125)/.375*Math.PI):0,contraction=region==='atrial'?atrial:ventricular;return {scale:[1-contraction*.018,1-contraction*.014,1-contraction*.018],phase:phase<.125?0:phase<.5?1:2};}
 return {scale:[1,1,1],wave:phase,phase:phase<.7?0:1};
}
