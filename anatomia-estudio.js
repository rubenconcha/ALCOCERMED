import { senses } from './anatomia-sentidos.js?v=17';
// Study objectives based on the supplied Saladin, chapters 6 and 10–25.
// The atlas source geometry determines which individual components can be explored.
export const studyObjectives={
 lungs:['Reconoce los tres lóbulos del pulmón derecho y los dos del izquierdo. Ubica las caras costal y mediastínica y la base apoyada sobre el diafragma.','Distingue la circulación pulmonar, destinada al intercambio gaseoso, de la circulación bronquial que nutre el tejido pulmonar.'],
 trachea:['Sigue la tráquea hasta su bifurcación y distingue los bronquios principales. El bronquio derecho es más corto, ancho y vertical.','Relaciona los anillos cartilaginosos con el mantenimiento de una vía aérea abierta.'],
 heart:['Distingue aurículas, ventrículos, tabiques y válvulas. Sigue la entrada venosa y la salida arterial de cada lado.','Separa circulación pulmonar y sistémica. La irrigación del propio miocardio corresponde a las arterias coronarias.'],
 liver:['Ubica el hígado bajo el diafragma y reconoce su relación con la vesícula biliar.','Distingue la entrada por arteria hepática y vena porta de la salida por venas hepáticas. La bilis sigue una vía diferente de la sangre.'],
 stomach:['Reconoce cardias, fondo, cuerpo y región pilórica. Ubica las curvaturas y la continuidad con esófago y duodeno.','Relaciona la pared muscular con la mezcla del contenido y la formación del quimo.'],
 'small-intestine':['Distingue duodeno, yeyuno e íleon. El duodeno recibe secreciones pancreáticas y bilis; yeyuno e íleon se sostienen por el mesenterio.','Relaciona las vellosidades con la absorción: sangre para muchos nutrientes y vasos quilíferos para gran parte de los lípidos.'],
 colon:['Sigue ciego, colon ascendente, transverso, descendente, sigmoide y recto. Reconoce las haustras y tenias.','Compara absorción de agua y electrolitos con la absorción de nutrientes en el intestino delgado.'],
 pancreas:['Ubica cabeza, cuerpo y cola; relaciona la cabeza con el duodeno y la cola con el bazo.','Separa secreción exocrina hacia conductos de secreción endocrina hacia la sangre.'],
 gallbladder:['Ubica la vesícula en la cara inferior del hígado y sigue el conducto cístico hacia la vía biliar.','El hígado produce la bilis; la vesícula la almacena y concentra.'],
 oesophagus:['Sigue el esófago desde la faringe, por el tórax, a través del diafragma y hasta el estómago.','Distingue el transporte por peristalsis de la digestión y absorción que predominan en otras regiones.'],
 kidneys:['Reconoce posición retroperitoneal, hilio, corteza, médula y pelvis renal cuando el modelo los incluya.','Distingue arteria renal, vena renal y uréter. La filtración empieza en los corpúsculos renales, que no se ven a esta escala.'],
 ureters:['Sigue cada uréter desde la pelvis renal hasta la vejiga.','La orina avanza por contracciones de la pared muscular; su transporte no depende únicamente de la gravedad.'],
 bladder:['Ubica la vejiga en la pelvis y reconoce sus conexiones con uréteres y uretra.','Distingue almacenamiento de orina y vaciado por contracción del detrusor, coordinado con los esfínteres.'],
 thyroid:['Ubica los dos lóbulos y el istmo frente a la tráquea.','Distingue las hormonas tiroideas, que regulan el metabolismo, de la calcitonina.'],
 adrenals:['Ubica cada glándula sobre el riñón correspondiente. Diferencia corteza y médula, aunque no estén separadas en la superficie del modelo.','La corteza produce hormonas esteroideas; la médula libera catecolaminas.'],
 brain:['Identifica cerebro, diencéfalo, tronco encefálico y cerebelo. Cambia de vista para distinguir superficies y estructuras profundas.','Relaciona cada región con integración sensitiva, control motor y funciones autónomas; evita atribuir todas las funciones a una sola región.'],
 'spinal-cord':['Sigue la médula dentro del conducto vertebral y reconoce su continuidad con el tronco encefálico.','Distingue vías ascendentes sensitivas, vías descendentes motoras y circuitos de los reflejos espinales.'],
 skin:['Distingue la superficie cutánea de los músculos y órganos profundos.','Separa epidermis, dermis e hipodermis conceptualmente: el modelo de superficie no representa esas capas histológicas por separado.'],
 spleen:['Ubica el bazo en el lado izquierdo, próximo al estómago y al diafragma.','El bazo filtra sangre; los ganglios filtran linfa. No son equivalentes.'],
 thymus:['Ubica el timo en el mediastino, por detrás del esternón.','Relaciona este órgano linfático primario con la maduración de linfocitos T y su involución con la edad.']
};
for(const sense of senses)studyObjectives[sense.id]=sense.objectives;
studyObjectives.skin[1]+=' '+('Los receptores somáticos permiten percibir tacto, presión, vibración, temperatura y dolor. Los corpúsculos táctiles y laminares no están segmentados en esta superficie 3D.');
export function lessonSteps(data){
 const objective=studyObjectives[data.id];
 const steps=[{title:'Ubicación',body:data.region||'Ubica la estructura en el cuerpo y reconoce sus relaciones con los tejidos vecinos.',mode:'location'},
 {title:'Componentes',body:objective?.[0]||'Explora las piezas originales del modelo. Selecciona una para acercarla y vuelve al conjunto para orientarte.',mode:'components'},
 {title:data.action?'Acción':data.text?'Función':'Reconocimiento anatómico',body:(data.action||data.text||'Comprueba el nombre, el lado y la posición de esta estructura en el conjunto. Gira el modelo para identificar sus relaciones espaciales.')+(objective?' '+objective[1]:''),mode:'function'}];
 if(data.action)steps.push({title:'Origen',body:data.origin,mode:'origin'},{title:'Inserción',body:data.insertion,mode:'insertion'});
 for(const [title,mode] of [['Irrigación','irrigation'],[data.nerveTitle||'Inervación','nerve'],['Drenaje linfático','lymph']])if(data[mode])steps.push({title,mode,body:data[mode]});
 steps.push({title:'Comprueba lo aprendido',mode:'review',body:data.action?'Sin mirar la ficha, explica la acción, el origen, la inserción y la inervación. Después comprueba tu respuesta.':data.system==='sensory'?'Sin mirar la ficha, identifica el estímulo, las estructuras receptoras y la vía nerviosa. Distingue lo que representa el modelo de lo que corresponde a escala celular.':'Sin mirar la ficha, explica su función, identifica sus componentes y distingue irrigación, inervación y drenaje linfático.'});
 return steps;
}
