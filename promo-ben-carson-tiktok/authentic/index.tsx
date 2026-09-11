import {AbsoluteFill,Audio,Composition,Img,OffthreadVideo,Sequence,interpolate,registerRoot,spring,staticFile,useCurrentFrame} from 'remotion';
import scenes from './data.json';
const red='#EF2738',yellow='#FFE45E',blue='#124EA2',paper='#FFF9EA';
const pop=(f:number,delay=0)=>spring({frame:f-delay,fps:30,config:{damping:15,stiffness:190}});
const display={fontFamily:'Impact, Arial Black, sans-serif',fontWeight:900,lineHeight:.98,letterSpacing:-1.5} as const;
function Icon({type,size=150,color=yellow}:{type:string,size?:number,color?:string}){
return <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
{type==='heart'?<><path d="M60 103S7 69 12 36C17 8 46 9 60 31C77 6 106 14 109 37C113 70 60 103 60 103Z" fill={red}/><path d="M16 60H38L47 42L59 80L73 52L81 61H106" stroke="white" strokeWidth="5"/></>:type==='clock'?<><circle cx="60" cy="67" r="40" fill={paper}/><path d="M60 47V69L79 79M47 11H73M60 11V25M92 28L101 20" stroke={blue}/></>:type==='dna'?<><path d="M30 8C110 40 10 80 90 112M90 8C10 40 110 80 30 112"/><path d="M42 16H78M39 40H81M45 59H75M39 80H81M42 103H78" stroke="white" strokeWidth="4"/></>:type==='check'?<><circle cx="60" cy="60" r="47" fill={blue}/><path d="M31 61L51 81L88 39" stroke="white"/></>:type==='chat'?<><path d="M16 17H104V82H61L32 105V82H16Z" fill={yellow}/><path d="M33 39H87M33 59H72" stroke={blue}/></>:<><path d="M22 92L30 65L85 10L110 35L55 91L22 98Z" fill={yellow}/><path d="M31 65L55 91M75 20L100 45" stroke={blue}/></>}
</svg>}
function Sticker({children,x,y,rotate=0,delay=0,style={}}:any){const f=useCurrentFrame();return <div style={{position:'absolute',left:x,top:y,transform:`rotate(${rotate}deg) scale(${pop(f,delay)})`,transformOrigin:'center',...style}}>{children}</div>}
function Label({children,color=yellow,rotate=-3}:any){return <div style={{display:'inline-block',padding:'17px 28px',background:color,color:'#10151C',fontSize:32,fontWeight:900,letterSpacing:1,boxShadow:'7px 8px 0 #000',transform:`rotate(${rotate}deg)`}}>{children}</div>}
function Captions({words}:any){
 const f=useCurrentFrame();const t=f/30;
 const i=words.findIndex((w:any)=>t>=w.start&&t<w.end+.12);
 const current=i<0?Math.max(0,words.reduce((n:number,w:any,j:number)=>t>=w.start?j:n,0)):i;
 const start=Math.floor(current/3)*3;
 return <div style={{position:'absolute',bottom:320,left:65,right:125,textAlign:'center',fontSize:53,fontWeight:900,lineHeight:1.3,textTransform:'uppercase',textShadow:'0 3px 12px #000'}}>
 <span style={{background:'#101010E6',padding:'10px 16px',boxDecorationBreak:'clone',WebkitBoxDecorationBreak:'clone',borderRadius:10}}>{words.slice(start,start+3).map((w:any,j:number)=><span key={j} style={{color:j+start===current?yellow:'white'}}>{w.text} </span>)}</span></div>
}
function Scene({s,index}:any){
 const f=useCurrentFrame();const intro=pop(f); const zoom=interpolate(f,[0,s.frames],[1.03,1.13]);
 const footage=s.bg.endsWith('mp4');
 return <AbsoluteFill style={{background:blue,overflow:'hidden'}}>
 {footage?<OffthreadVideo src={staticFile(s.bg)} startFrom={Math.round(s.offset*30)} muted style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${zoom})`,filter:'saturate(1.12) contrast(1.08)'}}/>:<Img src={staticFile('authentic/'+s.bg)} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(.65)',transform:`scale(${zoom})`}}/>}
 <AbsoluteFill style={{background:'linear-gradient(180deg,#0009 0%,transparent 40%,transparent 55%,#000B 100%)'}}/>
 <div style={{position:'absolute',top:85,left:65,background:paper,borderRadius:60,padding:'6px 24px 6px 6px',display:'flex',alignItems:'center',gap:12,boxShadow:'0 5px 20px #0004'}}><Img src={staticFile('authentic/logo.png')} style={{width:93,height:80,objectFit:'contain'}}/><div style={{fontSize:23,fontWeight:900,color:blue}}>PREPA BEN CARSON</div></div>
 <div style={{position:'absolute',top:108,right:110,color:paper,fontSize:25,fontWeight:800}}>CBBA <span style={{color:red}}>●</span></div>

 {s.kind==='hook'&&<>
 <Sticker x={65} y={250} rotate={-4}><Label>POV: TU META ES MEDICINA</Label></Sticker>
 <div style={{position:'absolute',top:390,left:65,right:120,...display,fontSize:126,transform:`translateX(${(1-intro)*-150}px)`,textShadow:'5px 6px 0 #000'}}>¿TE IMAGINAS<br/><span style={{color:yellow}}>ENTRANDO</span><br/>AQUÍ?</div>
 <Sticker x={690} y={910} rotate={13} delay={8}><Icon type="heart" size={220}/></Sticker>
 <svg style={{position:'absolute',left:130,top:905}} width="400" height="360" viewBox="0 0 400 360"><path d="M20 10Q330 20 230 260M190 225L230 270L285 245" fill="none" stroke={yellow} strokeWidth="13" strokeLinecap="round"/></svg>
 </>}
 {s.kind==='goal'&&<>
 <div style={{position:'absolute',top:250,left:60,...display,fontSize:159,color:yellow,textShadow:'7px 7px 0 '+blue,transform:`scale(${intro})`}}>MEDICINA.</div>
 <div style={{position:'absolute',left:65,top:480,width:820,height:690,background:paper,padding:22,transform:`rotate(-4deg) scale(${intro})`,boxShadow:'18px 20px 0 '+red}}><Img src={staticFile('authentic/facultad.jpg')} style={{width:'100%',height:550,objectFit:'cover'}}/><div style={{fontFamily:'Segoe Print, cursive',fontSize:48,color:blue,textAlign:'center',marginTop:18}}>Nos vemos en San Simón ✦</div></div>
 <Sticker x={735} y={1060} rotate={9} delay={6}><Img src={staticFile('authentic/umss.jpg')} style={{width:155,height:185,objectFit:'contain',background:'white',padding:10,border:'6px solid '+paper,boxShadow:'8px 9px 0 '+blue}}/></Sticker>
 <Sticker x={60} y={1250} rotate={-2} delay={10}><Label color={yellow}>UNIVERSIDAD MAYOR DE SAN SIMÓN</Label></Sticker>
 </>}
 {s.kind==='reality'&&<>
 <Sticker x={65} y={260} rotate={-3}><Label>EL SUEÑO EMPIEZA ANTES</Label></Sticker>
 <div style={{position:'absolute',top:400,left:65,...display,fontSize:130,textShadow:'5px 6px 0 #000'}}>MUCHO ANTES<br/>DEL <span style={{color:yellow}}>EXAMEN.</span></div>
 <Sticker x={690} y={1060} rotate={13} delay={8}><Icon type="clock" size={240}/></Sticker>
 <Sticker x={70} y={1130} rotate={-5} delay={10}><div style={{background:paper,color:blue,padding:24,fontSize:41,fontWeight:900,boxShadow:'10px 10px 0 '+red}}>Un día a la vez.<br/>Una pregunta más.</div></Sticker>
 </>}
 {s.kind==='practice'&&<>
 <Sticker x={65} y={240} rotate={-3}><Label>ASÍ SE CONSTRUYE LA META</Label></Sticker>
 <div style={{position:'absolute',top:390,left:65,...display,fontSize:142,color:yellow,textShadow:'6px 7px 0 '+blue}}>{f<55?'PREGUNTA.':f<108?'PRACTICA.':'CORRIGE.'}</div>
 <Sticker x={60} y={850} rotate={-6} delay={5}><div style={{width:485,padding:32,background:paper,color:blue,boxShadow:'12px 12px 0 '+red,borderRadius:8}}><div style={{fontSize:24,fontWeight:900,letterSpacing:3}}>MI PRÓXIMO PASO</div>{['Resolver','Revisar','Volver a intentar'].map((x,i)=><div key={x} style={{fontSize:34,marginTop:24,fontWeight:800,display:'flex',alignItems:'center',gap:15}}><span style={{border:'3px solid '+blue,width:32,height:32,color:red}}>{f>15+i*22?'✓':''}</span>{x}</div>)}</div></Sticker>
 <Sticker x={695} y={800} rotate={16} delay={8}><Icon type="pencil" size={190}/></Sticker>
 <Sticker x={715} y={1100} rotate={-13} delay={13}><Icon type="dna" size={190}/></Sticker>
 </>}
 {s.kind==='team'&&<>
 <Sticker x={65} y={240} rotate={-3}><Label>LA MISMA META</Label></Sticker>
 <div style={{position:'absolute',left:65,top:405,...display,fontSize:128,textShadow:'5px 6px 0 #000'}}>NO ESTÁS<br/><span style={{color:yellow}}>SOLO EN ESTO.</span></div>
 <Sticker x={70} y={1050} rotate={-5} delay={8}><Label color={paper}>TU FUTURO GRUPO DE ESTUDIO ↗</Label></Sticker>
 <Sticker x={715} y={1170} rotate={10} delay={10}><Icon type="heart" size={190}/></Sticker>
 </>}
 {s.kind==='brand'&&<>
 <div style={{position:'absolute',top:260,left:65,...display,fontSize:123,textShadow:'5px 6px 0 #000'}}>ESTO ES<br/><span style={{color:yellow}}>BEN CARSON.</span></div>
 <Sticker x={260} y={760} rotate={-7}><div style={{width:440,height:440,borderRadius:35,background:paper,border:'9px solid white',boxShadow:'16px 18px 0 '+red}}><Img src={staticFile('authentic/logo.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div></Sticker>
 <Sticker x={680} y={1100} rotate={13} delay={5}><Icon type="check" size={180}/></Sticker>
 </>}
 {s.kind==='cta'&&<>
 <div style={{position:'absolute',left:65,top:260,...display,fontSize:120,textShadow:'5px 6px 0 #000'}}>TU META:<br/><span style={{color:yellow}}>MEDICINA UMSS.</span></div>
 <Sticker x={70} y={680} rotate={-3}><div style={{width:790,padding:'45px 35px',borderRadius:25,background:paper,boxShadow:'15px 17px 0 '+red,color:blue}}><div style={{display:'flex',alignItems:'center',gap:15}}><Icon type="chat" size={110}/><span style={{...display,fontSize:80}}>ESCRÍBENOS</span></div><div style={{fontSize:38,fontWeight:800,marginTop:35}}>Conoce nuestra preparación</div><div style={{background:blue,color:'white',fontSize:40,fontWeight:900,padding:'20px 18px',marginTop:28,borderRadius:12}}>75960539 · 76998745</div><div style={{fontSize:32,marginTop:22,fontWeight:800}}>@prepabencarson</div></div></Sticker>
 </>}
 <Captions words={s.words}/>
 <div style={{position:'absolute',bottom:230,left:65,right:125,display:'flex',gap:8}}>{scenes.map((_,i)=><div key={i} style={{height:5,flex:1,background:i<=index?yellow:'#FFFFFF50'}}/>)}</div>
 <div style={{position:'absolute',bottom:175,left:65,fontSize:25,fontWeight:800,color:'white',textShadow:'0 2px 10px #000'}}>PREPARACIÓN PARA EL INGRESO A MEDICINA</div>
 {f<5&&index>0&&<AbsoluteFill style={{background:paper,opacity:interpolate(f,[0,5],[.5,0])}}/>}
 </AbsoluteFill>
}
function Video(){let start=0;return <AbsoluteFill style={{fontFamily:'Arial, sans-serif',color:'white'}}><Audio src={staticFile('authentic/beat.wav')} volume={.36}/>{scenes.map((s,i)=>{let from=start;start+=s.frames;return <Sequence key={i} from={from} durationInFrames={s.frames}><Scene s={s} index={i}/><Audio src={staticFile(`authentic/voice-${i}.mp3`)} volume={1}/>{i>0&&<Audio src={staticFile('whoosh.wav')} volume={.09}/>}</Sequence>})}</AbsoluteFill>}
registerRoot(()=> <Composition id="BenCarsonReal" component={Video} width={1080} height={1920} fps={30} durationInFrames={scenes.reduce((n,s)=>n+s.frames,0)}/>);

