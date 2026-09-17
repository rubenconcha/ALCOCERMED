const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('juegos/app.js','utf8');
const buttons=Array.from({length:4},()=>({style:{color:'#fff'},disabled:false}));
const elements={};function el(id){return elements[id]||= {style:{},textContent:'',appendChild(x){this.child=x;},remove(){},removeAttribute(){}};}
let ticks,feedback=0,synced=0,rendered=0,applied=0;
const ctx=vm.createContext({console,Math,Date,window:{getComputedStyle:()=>({width:"100%"})},document:{querySelectorAll:()=>buttons,getElementById:el,createElement:()=>({style:{},textContent:''})},clearInterval(){},setInterval(fn){ticks=fn;return 1;},setTimeout(){return 1;},clearTimeout(){},playBeep(){},showPowerupToast(){},syncLiveQuizProgress(){synced++},showFeedbackAnimation(){feedback++},getAudioCtx(){throw Error('muted')},quizTimerInterval:null,quizTimerTotal:60,quizTimeLeft:40,quizConfirmed:false,quizSelectedOption:-1,quizMultiSelections:[],quizCurrentQ:0,quizAnswers:[],activePowerup:null,powerupUsedThisQ:false,quizData:{preguntas:[{id:'q1',tipo:'mc',temporizador:40,puntos:1,opciones:[{text:'Incorrecta',correct:false},{text:'Correcta',correct:true},{text:'No',correct:false},{text:'No',correct:false}]}]},preloadedAudio:{},powerups:[],flippedCards:true,pendingPowerupKey:'retry',powerupCloseTimeout:1});
function load(name){let start=src.indexOf('function '+name+'(');assert.ok(start>=0,name);let end=src.indexOf('\n}',start)+2;vm.runInContext(src.slice(start,end),ctx);}
['isQuizOptionCorrect','getQuestionTimerSeconds','updateQuizTimerDisplay','startQuestionTimer','addQuizTime','handleQuizRetry','applyPowerupToAnswer','getQuizPoints','confirmQuizAnswerInstant','toggleQuizMulti','confirmQuizMulti','skipPowerupCards','closePowerupCards','showQuestionHint'].forEach(load);
ctx.activePowerup={effect:'retry'};ctx.confirmQuizAnswerInstant(0);
assert.equal(ctx.quizAnswers.length,0);assert.equal(buttons[0].disabled,true);assert.equal(buttons[1].style.color,'#172554');assert.equal(buttons[1].style.background,'#fff');assert.equal(ctx.quizTimeLeft,40);
ctx.confirmQuizAnswerInstant(0);assert.equal(ctx.quizAnswers.length,0,'blocked wrong answer cannot submit with keyboard');
ctx.confirmQuizAnswerInstant(1);assert.equal(ctx.quizAnswers.length,1);assert.equal(ctx.quizAnswers[0].correcta,true);
ctx.quizConfirmed=false;ctx.startQuestionTimer(40);ticks();assert.equal(ctx.quizTimeLeft,39);ctx.addQuizTime(10);assert.equal(ctx.quizTimeLeft,49);assert.equal(ctx.quizTimerTotal,50);assert.equal(el('quiz-timer-bar').style.width,'98%');ticks();assert.equal(el('quiz-timer-label').textContent,'48s');
ctx.quizAnswers=[];ctx.activePowerup={effect:'multiply',value:2};assert.equal(ctx.getQuizPoints(true,ctx.quizData.preguntas[0]),2000,'x2 applied, time bonus capped');
ctx.quizData.preguntas[0].tipo='ms';ctx.quizMultiSelections=[1];ctx.quizConfirmed=false;ctx.confirmQuizMulti();let count=ctx.quizAnswers.length;ctx.confirmQuizMulti();ctx.toggleQuizMulti(0);assert.equal(ctx.quizAnswers.length,count,'double submit ignored');assert.deepEqual(Array.from(ctx.quizMultiSelections),[1]);
ctx.renderQuizQuestion=()=>rendered++;ctx.applyPendingPowerup=()=>applied++;ctx.skipPowerupCards();assert.equal(rendered,0,'skip cannot clear chosen card');
let overlay=el('powerup-cards-overlay');overlay.removeAttribute=()=>delete elements['powerup-cards-overlay'];ctx.document.getElementById=id=>elements[id]||null;
ctx.showQuizResults=()=>{};ctx.closePowerupCards();ctx.closePowerupCards();assert.equal(rendered,1);assert.equal(applied,1,'card applied once');
vm.runInContext(fs.readFileSync('juegos/tejido-nervioso-imagenes.js','utf8'),ctx);
const bank=JSON.parse(fs.readFileSync('juegos/tejido-nervioso-41-50.json','utf8'));for(const q of bank.questions){let im=ctx.nervousQuestionImages[q.id];assert.ok(im);assert.ok(fs.existsSync('.'+im.src));assert.ok(ctx.nervousQuestionHints[q.id]);}
console.log('OK: contraste y bloqueo retry; tiempo real +10; x2; envío único múltiple; carta aplicada una vez; 10 imágenes y pistas.');
