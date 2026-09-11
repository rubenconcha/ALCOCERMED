import {AbsoluteFill, Audio, Composition, Sequence, interpolate, registerRoot, spring, staticFile, useCurrentFrame} from 'remotion';
import data from './data.json';

const ink='#091323';
function Art({kind,accent}:{kind:string;accent:string}){
 const f=useCurrentFrame();
 const bob=Math.sin(f/18)*9;
 return <div style={{height:470,display:'flex',justifyContent:'center',alignItems:'center',transform:`translateY(${bob}px)`}}>
 <svg width="650" height="430" viewBox="0 0 650 430" fill="none">
 <circle cx="325" cy="215" r="192" stroke={accent} strokeOpacity=".13" strokeWidth="2"/>
 <circle cx="325" cy="215" r="160" fill={accent} fillOpacity=".05"/>
 {kind==='book'?<g stroke={accent} strokeWidth="8" strokeLinejoin="round"><path d="M325 330V110Q240 60 130 102V305Q240 270 325 330Q410 270 520 305V102Q410 60 325 110" fill={ink}/><path d="M170 150Q230 135 285 160M170 200Q230 185 285 210M170 250Q230 235 285 260M365 160Q430 135 480 150M365 210Q430 185 480 200M365 260Q430 235 480 250" strokeWidth="5"/></g>:
 kind==='cell'?<g><ellipse cx="325" cy="225" rx="155" ry="110" fill={accent} fillOpacity=".25" stroke={accent} strokeWidth="5"/><ellipse cx="325" cy="135" rx="125" ry="60" fill={accent} fillOpacity=".6"/><path d="M115 258Q220 350 325 280T535 290" stroke="#fff" strokeWidth="7"/>{Array.from({length:7},(_,i)=><circle key={i} cx={285+i*25} cy={90-i*7+Math.sin(f/12+i)*5} r="12" fill={i%2?accent:'#fff'}/>)}</g>:
 kind==='cta'?<g stroke={accent} strokeWidth="9"><rect x="175" y="65" width="300" height="265" rx="44" fill={ink}/><path d="M240 155H410M240 207H360M285 330L260 375L365 330"/><circle cx="468" cy="81" r="43" fill={accent}/><path d="M447 81H489M468 60V102" stroke={ink}/></g>:
 kind==='compare'?<g>{[0,1].map((v)=><g key={v} transform={`translate(${130+v*215},95)`}><rect width="185" height="240" rx="24" fill={ink} stroke={accent} strokeWidth="5"/><path d="M35 65H150M35 115H130M35 165H150" stroke={v?'#fff':accent} strokeWidth="7"/></g>)}</g>:
 <g><rect x="180" y="45" width="290" height="330" rx="28" fill={ink} stroke={accent} strokeWidth="6"/>{[0,1,2].map((i)=><g key={i} transform={`translate(220,${120+i*83})`}><rect width="33" height="33" rx="7" stroke={accent} strokeWidth="4"/><path d="M65 15H205" stroke="white" strokeOpacity=".7" strokeWidth="7"/>{f>i*12+12&&<path d="M5 15L15 25L31 5" stroke={accent} strokeWidth="5"/>}</g>)}</g>}
 </svg></div>
}
function Scene({scene,accent,index,total,tag}:any){
 const frame=useCurrentFrame();
 const enter=spring({frame,fps:30,config:{damping:19,stiffness:140}});
 const opacity=interpolate(frame,[0,7,scene.frames-6,scene.frames],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{opacity,padding:'180px 115px 230px 85px',transform:`translateY(${(1-enter)*30}px)`}}>
 <div style={{color:accent,fontSize:24,fontWeight:800,letterSpacing:4,marginBottom:36}}>{tag}</div>
 <div style={{fontSize:scene.title.length>32?72:86,fontWeight:900,lineHeight:1.03,letterSpacing:-3,minHeight:255}}>{scene.title}</div>
 {scene.kind==='options'?<div style={{height:470,paddingTop:30}}>{scene.sub.split('\n').map((s:string,i:number)=><div key={s} style={{padding:'25px 30px',marginBottom:18,border:'2px solid '+accent+'55',borderRadius:22,fontSize:40,background:accent+'0D',transform:`translateX(${(1-spring({frame:frame-i*8,fps:30,config:{damping:20}}))*60}px)`}}>{s}</div>)}</div>:<Art kind={scene.kind} accent={accent}/>}
 {scene.kind!=='options'&&<div style={{fontSize:38,lineHeight:1.45,whiteSpace:'pre-line',color:accent,fontWeight:700,minHeight:110,marginTop:20}}>{scene.sub}</div>}
 <div style={{marginTop:35,width:70,height:5,background:accent,borderRadius:10}}/>
 <div style={{fontSize:34,lineHeight:1.45,color:'#DFE7F2',marginTop:28}}>{scene.voice}</div>
 <div style={{position:'absolute',bottom:250,left:85,right:115,display:'flex',gap:10}}>{Array.from({length:total},(_,i)=><div key={i} style={{height:5,flex:1,background:i<=index?accent:'#293346',borderRadius:5}}/>)}</div>
 </AbsoluteFill>
}
function Video({video}:any){
 const f=useCurrentFrame();let start=0;
 return <AbsoluteFill style={{background:ink,color:'white',fontFamily:'Arial, sans-serif'}}>
 <Audio src={staticFile('faceless/bed.wav')} volume={0.22}/>
 <AbsoluteFill style={{background:`radial-gradient(ellipse at ${35+Math.sin(f/100)*20}% 15%, ${video.accent}19, transparent 60%)`}}/>
 <div style={{position:'absolute',inset:0,opacity:.12,backgroundImage:'linear-gradient(#8aa0bc 1px, transparent 1px),linear-gradient(90deg,#8aa0bc 1px,transparent 1px)',backgroundSize:'70px 70px'}}/>
 <div style={{position:'absolute',top:85,left:85,fontSize:28,fontWeight:900,letterSpacing:2}}>BEN <span style={{color:video.accent}}>CARSON</span><span style={{fontWeight:400,fontSize:20,marginLeft:24,color:'#B3C0D5'}}>PREPARATORIA</span></div>
 {video.scenes.map((scene:any,index:number)=>{const from=start;start+=scene.frames;return <Sequence key={index} from={from} durationInFrames={scene.frames}><Scene {...{scene,index,accent:video.accent,total:video.scenes.length,tag:video.tag}}/><Audio src={staticFile(scene.audio)}/></Sequence>})}
 <div style={{position:'absolute',bottom:165,left:85,fontSize:26,color:'#B3C0D5'}}>INGRESO A MEDICINA · UMSS</div>
 <div style={{position:'absolute',bottom:118,left:85,fontSize:30,fontWeight:700,color:video.accent}}>@prepabencarson</div>
 </AbsoluteFill>
}
const Root=()=> <>{data.map(video=><Composition key={video.id} id={video.id} component={Video} defaultProps={{video}} durationInFrames={video.scenes.reduce((n,s)=>n+s.frames,0)} fps={30} width={1080} height={1920}/>)}</>;
registerRoot(Root);
