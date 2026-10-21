/* Content arrives only through the authenticated map endpoint. */
(function(){
 var panel,button,returnFocus;
 function node(tag,text,cls){var e=document.createElement(tag);e.textContent=text||'';if(cls)e.className=cls;return e;}
 function close(){document.getElementById('mm-lightbox').classList.remove('mm-show-practice');if(button)button.setAttribute('aria-expanded','false');if(returnFocus&&returnFocus.isConnected)returnFocus.focus();}
 window.MindmapPractice={
  close:close,
  isOpen:function(){return document.getElementById('mm-lightbox').classList.contains('mm-show-practice');},
  reset:function(){close();if(panel)panel.replaceChildren();if(button)button.hidden=true;},
  mount:function(data){
   if(!panel){
    panel=node('section','','mm-practice');panel.id='mm-practice';panel.setAttribute('aria-label','Práctica de estudio');
    document.querySelector('.mm-lb-stage').appendChild(panel);
    button=node('button','Practicar','mm-visual-toggle');button.id='mm-practice-toggle';button.type='button';button.setAttribute('aria-controls','mm-practice');
    document.getElementById('mm-lb-download').before(button);
    button.onclick=function(){if(MindmapPractice.isOpen()){close();return;}returnFocus=button;document.getElementById('mm-lightbox').classList.add('mm-show-practice');button.setAttribute('aria-expanded','true');panel.querySelector('h2').focus();};
   }
   panel.replaceChildren();button.hidden=!data;if(!data)return;
   var logo=node('img','','mm-institution-logo');logo.src='/promo-ben-carson-tiktok/public/authentic/logo.png';logo.alt='Preparatoria Ben Carson';panel.append(logo);
   var heading=node('h2','Comprueba lo que entendiste');heading.tabIndex=-1;panel.append(heading,node('p','Responde antes de abrir cada tarjeta. En las preguntas, elige una alternativa para revisar el razonamiento.'));
   var back=node('button','Volver al material','mm-practice-back');back.type='button';back.onclick=close;panel.append(back);
   panel.append(node('h3','Flashcards · '+data.flashcards.length));
   data.flashcards.forEach(function(card,i){var d=node('details','','mm-practice-card'),s=node('summary',(i+1)+'. '+card.question),img=window.StudyMedia&&StudyMedia.create(card.study_image);if(img)s.append(img);d.append(s,node('p',card.answer),node('small','Saladin · PDF '+card.pdf_pages.join(', ')));panel.append(d);});
   panel.append(node('h3','Preguntas razonadas · '+data.questions.length));
   data.questions.forEach(function(q,i){
    var item=node('section','','mm-practice-question');item.append(node('h4',(i+1)+'. '+q.question));
    var img=window.StudyMedia&&StudyMedia.create(q.study_image);if(img)item.append(img);
    var feedback=node('div','','mm-practice-feedback');feedback.setAttribute('aria-live','polite');var choices=[];
    q.options.forEach(function(option,index){var choice=node('button',String.fromCharCode(65+index)+'. '+option,'mm-practice-option');choice.type='button';choices.push(choice);choice.onclick=function(){
     choices.forEach(function(c,j){c.disabled=true;c.classList.toggle('is-correct',j===q.correct);c.classList.toggle('is-wrong',j===index&&j!==q.correct);});
     feedback.replaceChildren(node('strong',index===q.correct?'Respuesta correcta':'Revisa la explicación: la correcta es '+String.fromCharCode(65+q.correct)));
     q.reasons.forEach(function(reason,j){feedback.append(node('p',String.fromCharCode(65+j)+'. '+reason));});
     feedback.append(node('small','Saladin · PDF '+q.pdf_pages.join(', ')));
    };item.append(choice);});item.append(feedback);panel.append(item);
   });
   var restart=node('button','Reiniciar práctica','mm-practice-back');restart.type='button';restart.onclick=function(){MindmapPractice.mount(data);panel.querySelector('h2').focus();document.querySelector('.mm-lb-stage').scrollTop=0;};panel.append(restart,node('p',data.source,'mm-practice-source'),node('small',data.review));
  }
 };
})();
