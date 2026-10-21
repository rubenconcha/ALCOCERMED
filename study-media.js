/* Optional anatomical figures; questions and answers remain plain editable text. */
(function(){
 'use strict';
 function create(media){
  if(!media||typeof media.src!=='string'||!/^\/assets\/study\/oseo\/[a-z0-9.-]+$/.test(media.src))return null;
  var img=document.createElement('img');img.className='study-anatomy-image';img.src=media.src;img.alt=media.alt||'Figura anatómica';img.decoding='async';return img;
 }
 function render(anchor,media){
  if(!anchor)return;var old=anchor.parentElement.querySelector('.study-question-figure');if(old)old.remove();var img=create(media);if(!img)return;
  var figure=document.createElement('figure');figure.className='study-question-figure';figure.append(img);anchor.after(figure);
 }
 window.StudyMedia={create:create,render:render};
})();
