import {boneStudy} from './anatomia-huesos-estudio.js?v=21';
// Anatomical recognition notes: supplied Saladin, chapters 8, 9, 13–14 and 20.
const bones=[
 [/^humerus$/,'Brazo','Reconoce cabeza, cuello, tubérculos y diáfisis; en el extremo distal, tróclea y capítulo. Se articula con la escápula, el radio y el cúbito.'],
 [/^radius$/,'Antebrazo','El radio se encuentra del lado del pulgar en posición anatómica. Reconoce cabeza, cuello, tuberosidad radial y apófisis estiloides. Su extremo distal participa en la articulación de la muñeca.'],
 [/^ulna$/,'Antebrazo','El cúbito se encuentra del lado del meñique. Reconoce olécranon, apófisis coronoides, incisura troclear y extremo distal. Su unión con el húmero proporciona estabilidad al codo.'],
 [/^scapula$/,'Cintura escapular','Reconoce espina, acromion, apófisis coracoides y cavidad glenoidea. La cavidad glenoidea recibe la cabeza del húmero; las superficies y bordes sirven de inserción a numerosos músculos.'],
 [/^clavicle$/,'Cintura escapular','Su extremo medial se articula con el esternón y el lateral con el acromion. Mantiene el hombro separado del tórax y transmite fuerzas desde el miembro superior al esqueleto axial.'],
 [/^femur$/,'Muslo','Reconoce cabeza, cuello, trocánteres, diáfisis y cóndilos. La cabeza se articula con el acetábulo; el extremo distal participa en la rodilla. Compara los puntos de inserción muscular con los de articulación.'],
 [/^tibia$/,'Pierna','La tibia es el principal hueso de carga de la pierna. Reconoce cóndilos, tuberosidad tibial, borde anterior y maléolo medial. Se articula con fémur, peroné y astrágalo.'],
 [/^fibula$/,'Pierna','El peroné está lateral a la tibia. Reconoce cabeza y maléolo lateral. Proporciona inserciones musculares y contribuye a la estabilidad del tobillo; no se articula directamente con el fémur.'],
 [/^patella$/,'Rodilla','La rótula es un hueso sesamoideo dentro del tendón del cuádriceps. Su cara posterior se articula con el fémur. Distingue el tendón del cuádriceps del ligamento rotuliano que continúa hacia la tibia.'],
 [/^hip bone$|^ilium$|^ischium$|^pubis$/,'Cintura pélvica','El hueso coxal resulta de la unión de ilion, isquion y pubis. Reconoce cresta ilíaca, acetábulo, agujero obturador y tuberosidad isquiática. Se articula con el sacro y con el fémur.'],
 [/^sacrum$/,'Columna y pelvis','El sacro se forma por la fusión de cinco vértebras sacras. Se articula con los huesos coxales y transmite el peso de la columna hacia la pelvis. Reconoce promontorio y agujeros sacros.'],
 [/^coccyx$/,'Columna y pelvis','El cóccix constituye el extremo inferior de la columna vertebral y sirve de fijación a tejidos del suelo pélvico. Se articula con el sacro.'],
 [/^manubrium$|^body of sternum$|^sternum$|^xiphoid process$/,'Tórax','El esternón comprende manubrio, cuerpo y apófisis xifoides. Reconoce la incisura yugular y el ángulo esternal. Las clavículas y los cartílagos costales se relacionan con sus bordes.'],
 [/rib$/,'Tórax','Las costillas se articulan posteriormente con vértebras torácicas. Las primeras siete se unen directamente al esternón mediante cartílago; las 8–10 lo hacen indirectamente y las 11–12 son flotantes.'],
 [/^calcaneus$/,'Pie','El calcáneo forma el talón. Reconoce la tuberosidad posterior donde se fija el tendón calcáneo y su relación superior con el astrágalo.'],
 [/^talus$/,'Tobillo y pie','El astrágalo recibe la carga desde tibia y peroné y la transmite al pie. Reconoce tróclea, cuello y cabeza; se relaciona con calcáneo y navicular.'],
 [/^atlas/,'Columna cervical','El atlas, C1, sostiene el cráneo y carece de un cuerpo vertebral típico. Sus masas laterales se articulan con los cóndilos occipitales. La articulación atlantooccipital participa en la flexión y extensión de la cabeza.'],
 [/^axis/,'Columna cervical','El axis, C2, se reconoce por el diente o apófisis odontoides. La unión entre atlas y axis permite gran parte de la rotación de la cabeza.'],
 [/^vertebra c/,'Columna cervical','Las vértebras cervicales tienen agujeros transversos y sostienen la cabeza. Distingue cuerpo, arco, agujero vertebral y apófisis. Atlas y axis presentan características especiales.'],
 [/^vertebra t/,'Columna torácica','Las vértebras torácicas se articulan con las costillas. Reconoce sus facetas costales y compara cuerpo y apófisis con los de las regiones cervical y lumbar.'],
 [/^vertebra l/,'Columna lumbar','Las vértebras lumbares tienen cuerpos voluminosos adaptados a soportar peso. Reconoce cuerpo, pedículos, láminas y apófisis; compáralas con las vértebras torácicas.'],
 [/^frontal bone$/,'Cráneo','El frontal contribuye a la frente, al techo de las órbitas y a la fosa craneal anterior. Reconoce sus relaciones con parietales, esfenoides y huesos de la cara.'],
 [/^parietal bone$/,'Cráneo','Los parietales forman gran parte de la bóveda y de las paredes laterales del cráneo. Reconoce las suturas sagital, coronal y lambdoidea.'],
 [/^temporal bone$/,'Cráneo','Reconoce porciones escamosa y petrosa, conducto auditivo externo y apófisis mastoides y estiloides. Se relaciona con la mandíbula y aloja estructuras del oído.'],
 [/^occipital bone$/,'Cráneo','Reconoce agujero magno y cóndilos occipitales. El agujero magno permite la continuidad entre encéfalo y médula; los cóndilos se articulan con el atlas.'],
 [/^sphenoid bone$/,'Cráneo','El esfenoides forma parte de la base del cráneo y de las órbitas. Reconoce cuerpo, alas y silla turca; esta última aloja la hipófisis.'],
 [/^mandible$/,'Cara','La mandíbula comprende cuerpo y ramas. Reconoce cóndilo y apófisis coronoides. El cóndilo se articula con el temporal en la articulación temporomandibular.'],
 [/^maxilla$/,'Cara','El maxilar forma parte de la mandíbula superior, del paladar duro, de las órbitas y de la cavidad nasal. Reconoce el proceso alveolar y el seno maxilar.']
];
export function structureStudy(part){
 const key=part.name.toLowerCase().replace(/\.[rlgj]$/,'').replace(/_/g,' ');
 if(part.system==='skeletal'){
  const note=bones.find(([pattern])=>pattern.test(key));
  if(note)return {region:note[1],text:note[2],chapters:'8',...boneStudy(part)};
  const study=boneStudy(part);if(study.boneStudy)return {...study,region:study.classification,text:study.articulations};
 }
 return {};
}
