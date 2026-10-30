"""180 genuinely introductory exercises, derived from the authorized ABP topics.

Each item has a complete lesson and machine-readable inputs for independent checks.
Run after the original 800 questions and lessons have been rebuilt.
"""
from pathlib import Path
from fractions import Fraction
import json,copy,random
from teaching_common import lesson as L,step as S,num,frac,aset
ROOT=Path(__file__).resolve().parents[2]
path=ROOT/'api/_sufficiency/bank.json';bank=json.loads(path.read_text(encoding='utf8'))
bank['questions']=[q for q in bank['questions'] if q.get('practiceKind')!='basica']
original={q['id']:q for q in bank['questions']};created=[];checks=[]

def add(subject,family,i,parent,topic,text,answer,basics,steps,mistake,check,unit='',data=None,wrong=None):
 id=f'basico-{subject}-{family}-{i:02d}'
 show=lambda x: (frac(x) if isinstance(x,Fraction) and family=='razon-directa' else num(x))+((' '+unit) if unit else '')
 right=show(answer); options=[right]
 values=wrong if wrong is not None else [answer+1,answer+2,max(0,answer-1),answer*2,answer+3]
 for value in values:
  option=show(value)
  if option not in options:options.append(option)
  if len(options)==4:break
 assert len(options)==4,(id,options)
 random.Random(id).shuffle(options)
 source=copy.deepcopy(original[parent]['source']);source.update(kind='práctica básica',parentId=parent,original=False,note='Ejercicio introductorio nuevo. Se simplifican los datos y se desarrolla una sola habilidad del problema de referencia; no es una transcripción del examen.')
 if len(check)<=20:check='Comprobación con los datos iniciales: '+check
 solution=L('Resolver el ejercicio con una idea a la vez.',basics,steps,mistake,check);solution['answer']=right
 q=dict(id=id,subject=subject,family=family,topic=topic,text=text,options=options,correct=options.index(right),source=source,practiceKind='basica',solution=solution,explanation=' '.join(s['text'] for s in steps))
 created.append(q);checks.append(dict(id=id,family=family,subject=subject,inputs=data,answer=right))

for i in range(1,7):
 values=list(range(1,i+3));a=len(values)
 add('matematicas','contar',i,'abp-36-64','Contar elementos',f'Cuenta los números distintos de esta lista: {aset(values)}. ¿Cuántos hay?',a,
  'Cada número distinto de una lista cuenta como un elemento. Aquí no sumamos sus valores: contamos cuántos números aparecen.',[
   S('Leemos la lista completa','Anotamos cada número que aparece entre las llaves.',aset(values)),
   S('Revisamos si se repite alguno','Todos los números de esta lista son distintos; cada uno se contará una sola vez.'),
   S('Contamos desde uno','Asignamos un lugar en el conteo a cada número.', '; '.join(f'{v}: lugar {j}' for j,v in enumerate(values,1))),
   S('Escribimos la cantidad','El último lugar del conteo indica cuántos elementos hay.',f'Cantidad={a}')],
  'No sumes los números de la lista: la pregunta pide su cantidad.',f'Hay {a} números distintos y hemos contado cada uno una sola vez.',data={'values':values})
 A=[1,2,i+3];B=[i+3,i+4];union=sorted(set(A)|set(B))
 add('matematicas','union',i,'abp-05-01','Unir dos listas',f'A={aset(A)} y B={aset(B)}. Reúne los números de las dos listas sin repetir. ¿Cuál es A ∪ B?',aset(union),
  'La unión A∪B reúne los elementos que están en A, en B o en ambos. Un número compartido se escribe una sola vez.',[
   S('Empezamos por A','Copiamos sus tres números en una lista.',f'A={aset(A)}'),
   S('Revisamos los números de B',f'{i+3} ya estaba en A. {i+4} todavía no estaba y hay que agregarlo.',f'B={aset(B)}'),
   S('Quitamos las repeticiones','El número compartido aparece una sola vez en la unión.',f'A∪B={aset(union)}'),
   S('Comprobamos ambas listas','Todos los elementos de A y todos los de B deben aparecer en el resultado; no agregamos otros números.')],
  'Unión significa reunir, no quedarse solamente con los números comunes.',f'El resultado contiene {len(union)} números distintos: {aset(union)}.',data={'A':A,'B':B},wrong=[aset([i+3]),aset(A),aset(B)])
 A=[i,i+1,i+2];B=[i+2,i+3];answer=aset(set(A)&set(B))
 add('matematicas','interseccion',i,'abp-05-01','Números comunes',f'A={aset(A)} y B={aset(B)}. ¿Qué número aparece en las dos listas? Escribe A ∩ B.',answer,
  'La intersección A∩B contiene solo los elementos que aparecen en las dos listas a la vez.',[
   S('Miramos los números de A','Buscaremos cada uno de estos números en la otra lista.',aset(A)),
   S('Comparamos con B',f'{i} y {i+1} no aparecen en B. {i+2} sí aparece en ambas.',aset(B)),
   S('Conservamos solo la coincidencia','No incluimos los números que están únicamente en una de las listas.',f'A∩B={answer}'),
   S('Revisamos el resultado',f'El número {i+2} se puede señalar tanto en A como en B.')],
  'No unas todas las listas: la palabra «común» exige que el número esté en las dos.',f'Hay una sola coincidencia: {answer}.',data={'A':A,'B':B},wrong=[aset(A),aset(B),aset(set(A)|set(B))])
 U=list(range(i,i+5));A=[i+1,i+3];rest=aset(set(U)-set(A))
 add('matematicas','complemento',i,'abp-05-01','Quitar elementos',f'U={aset(U)} y A={aset(A)}. Quita de U los números de A. ¿Qué lista queda?',rest,
  'U es la lista completa o universo. El complemento de A dentro de U está formado por los números de U que no están en A.',[
   S('Copiamos el universo','Partimos de todos los números permitidos por U.',aset(U)),
   S('Señalamos lo que hay que quitar','Los números de A se retiran de la lista inicial.',aset(A)),
   S('Escribimos lo que queda','Los otros números se conservan, sin cambiarles el signo.',rest),
   S('Comprobamos las dos condiciones','Cada número de la respuesta debe estar en U y ninguno debe seguir dentro de A.')],
  'Complemento no significa convertir los números en negativos: significa quitar elementos de U.',f'Quedan tres elementos: {rest}.',data={'U':U,'A':A},wrong=[aset(A),aset(U),aset([i,i+4])])
 values=[2*i,2*i+2,2*i+4];mean=sum(values)//3
 add('matematicas','media',i,'abp-13-05','Promedio de tres datos',f'Tres notas son {values[0]}, {values[1]} y {values[2]}. ¿Cuál es su promedio?',mean,
  'El promedio se obtiene sumando todos los datos y dividiendo entre la cantidad de datos. Aquí son tres notas.',[
   S('Contamos los datos','Hay tres notas. Ese será el número por el que dividiremos.'),
   S('Sumamos las notas','Cada nota entra una sola vez en la suma.',f'{values[0]}+{values[1]}+{values[2]}={sum(values)}'),
   S('Dividimos entre tres','Repartimos la suma en tres partes iguales.',f'Promedio={sum(values)}/3={mean}'),
   S('Revisamos el tamaño','El promedio debe quedar entre la menor y la mayor nota.',f'{values[0]}≤{mean}≤{values[2]}')],
  'No dividas entre la suma ni entre la última nota; se divide entre cuántos datos hay.',f'{mean}×3={sum(values)}: recuperamos la suma.',data={'values':values})
 a,b,mean=i,i+2,i+2;x=3*mean-a-b
 add('matematicas','dato-faltante',i,'abp-13-05','Un dato que falta',f'Los datos son {a}, {b} y x. Su promedio es {mean}. ¿Cuánto vale x?',x,
  'Si conocemos el promedio, multiplicarlo por la cantidad de datos nos devuelve la suma completa. Después quitamos los datos conocidos.',[
   S('Recuperamos la suma de los tres datos','Hay tres datos, incluido x aunque todavía no sepamos cuánto vale.',f'Suma total=3×{mean}={3*mean}'),
   S('Sumamos los dos datos conocidos','Por ahora solo usamos los datos con valor numérico.',f'{a}+{b}={a+b}'),
   S('Hallamos la parte que falta','Restamos lo conocido de la suma total.',f'x={3*mean}−{a+b}={x}'),
   S('Volvemos a calcular el promedio','Reemplazamos x por la respuesta y verificamos.',f'({a}+{b}+{x})/3={3*mean}/3={mean}')],
  'El dato desconocido también cuenta: son tres datos, no dos.',f'Con x={x}, el promedio coincide con {mean}.',data={'a':a,'b':b,'mean':mean})
 x=i+2;answer=Fraction(x,2)
 add('matematicas','razon-directa',i,'abp-13-06','Dividir dos valores',f'Si x={x} e y=2, ¿cuánto vale x/y? Simplifica el resultado.',answer,
  'x/y significa x dividido entre y. Como ya tenemos sus valores, basta reemplazarlos; no hay que resolver una ecuación.',[
   S('Identificamos numerador y denominador',f'x={x} va arriba; y=2 va abajo.'),
   S('Reemplazamos las letras','Conservamos el orden que pide la razón.',f'x/y={x}/2'),
   S('Simplificamos si se puede','Solo dividimos arriba y abajo por un mismo factor. Si no comparten factor, la fracción ya está simplificada.',f'{x}/2={frac(answer)}'),
   S('Comprobamos el cociente','Multiplicar la razón por el denominador debe devolver el numerador.',f'({frac(answer)})×2={x}')],
  'x/y y y/x invierten el orden y generalmente dan resultados distintos.',f'El resultado pedido es {frac(answer)}.',data={'x':x,'y':2},wrong=[Fraction(2,x),Fraction(x+1,2),Fraction(x,3),Fraction(x+2,2)])
 divisor=i+1;coefficient=i+2;raw=divisor*coefficient
 add('matematicas','division-simple',i,'abp-41-24','Dividir un término',f'Simplifica ({raw}x²)/({divisor}x), con x≠0.',f'{coefficient}x',
  'Podemos dividir por separado los números y las potencias de x. x²/x=x porque se cancela un factor x de arriba con uno de abajo.',[
   S('Separamos las dos partes','El cociente de números multiplica al cociente de las potencias.',f'({raw}/{divisor})×(x²/x)'),
   S('Dividimos los números','Usamos la división habitual entre los coeficientes.',f'{raw}/{divisor}={coefficient}'),
   S('Simplificamos la letra','x²=x·x. Al dividir entre x, queda un solo factor x.',f'x²/x=x'),
   S('Reunimos los resultados','Multiplicamos el coeficiente obtenido por x.',f'Resultado={coefficient}x')],
  'No dividas los exponentes: aquí se cancela un factor de la misma base.',f'{coefficient}x×{divisor}x={raw}x², el numerador original.',data={'raw':raw,'divisor':divisor},wrong=[f'{coefficient}x²',f'{raw}x',f'{coefficient+1}x'])
 c=i+1
 add('matematicas','potencia-diez',i,'abp-36-69','Potencias de diez',f'Escribe {c}×10² como un número decimal, sin potencia de diez.',c*100,
  '10² significa 10×10=100. El signo × indica que el coeficiente se multiplica por ese valor.',[
   S('Leemos el exponente','El 2 indica dos factores 10; no indica multiplicar 10 por 2.', '10²=10×10'),
   S('Calculamos la potencia','Multiplicamos esos dos factores.', '10×10=100'),
   S('Multiplicamos por el coeficiente','El número que estaba delante de la potencia también se conserva.',f'{c}×100={c*100}'),
   S('Escribimos la respuesta','Nos pidieron el número sin potencia de diez.',str(c*100))],
  '10² vale 100, no 20. El exponente cuenta factores iguales.',f'{c*100}/100={c}, el coeficiente inicial.',data={'coefficient':c,'power':2})
 d=i+1
 add('matematicas','multiplo',i,'abp-36-61','Múltiplos positivos',f'¿Cuál es el tercer múltiplo positivo de {d}?',3*d,
  'Los múltiplos positivos de un número se obtienen multiplicándolo por 1, por 2, por 3 y así sucesivamente. El cero no se incluye si piden positivos.',[
   S('Hallamos el primer múltiplo','Multiplicamos por uno.',f'{d}×1={d}'),
   S('Hallamos el segundo','Sumamos otro grupo del mismo tamaño.',f'{d}×2={2*d}'),
   S('Hallamos el tercero','El tercer lugar se obtiene multiplicando por tres.',f'{d}×3={3*d}'),
   S('Revisamos el orden','Los tres primeros múltiplos crecen de uno en uno por grupos del número dado.',f'{d}, {2*d}, {3*d}')],
  'El tercer múltiplo no es el número más 3: es el número multiplicado por 3.',f'{3*d}/{d}=3, así que es el tercer múltiplo.',data={'number':d,'position':3})

 # PHYSICS: one relation per item, using compatible units.
 add('fisica','centimetros',i,'abp-05-11','Centímetros a metros',f'Convierte {100*i} cm a metros. Recuerda que 1 m=100 cm.',i,
  'Un metro contiene cien centímetros. Para expresar una misma longitud en metros, el número se divide entre 100.',[
   S('Identificamos la unidad inicial','La longitud está en centímetros, pero nos piden metros.'),
   S('Elegimos la conversión','Cada grupo de cien centímetros corresponde a un metro.', '1 m=100 cm'),
   S('Dividimos entre cien','Contamos cuántos grupos de 100 cm hay.',f'{100*i}/100={i}'),
   S('Escribimos la nueva unidad','La longitud es la misma; cambia el número y la unidad con que la expresamos.',f'{100*i} cm={i} m')],
  'Para pasar de cm a m se divide entre 100; multiplicar haría el número más grande.',f'{i} m×100 cm/m={100*i} cm.',unit='m',data={'cm':100*i})
 add('fisica','segundos',i,'abp-05-11','Minutos a segundos',f'¿Cuántos segundos hay en {i} min? Usa 1 min=60 s.',60*i,
  'Cada minuto reúne sesenta segundos. Si hay varios minutos, sumamos sesenta por cada uno, o multiplicamos la cantidad de minutos por 60.',[
   S('Leemos lo que nos piden','La respuesta debe estar en segundos, no en minutos.'),
   S('Usamos la equivalencia','Cada minuto contiene la misma cantidad de segundos.', '1 min=60 s'),
   S('Multiplicamos por los minutos','Reunimos los segundos de todos los minutos.',f'{i}×60={60*i}'),
   S('Añadimos la unidad correcta','El número obtenido cuenta segundos.',f't={60*i} s')],
  'En este sentido de la conversión se multiplica: hay más segundos que minutos para el mismo tiempo.',f'{60*i}/60={i} min.',unit='s',data={'minutes':i})
 d=30*i;t=5;v=d//t
 add('fisica','rapidez',i,'abp-05-16','Rapidez constante',f'Un móvil recorre {d} m en {t} s a rapidez constante. Calcula su rapidez usando v=distancia/tiempo.',v,
  'La rapidez indica cuántos metros se recorren en cada segundo. Dividir la distancia total entre el tiempo reparte el recorrido entre esos segundos.',[
   S('Identificamos los datos',f'Distancia d={d} m; tiempo t={t} s.'),
   S('Escribimos la relación','La distancia va en el numerador y el tiempo en el denominador.', 'v=d/t'),
   S('Reemplazamos y dividimos','Las unidades ya son metros y segundos.',f'v={d}/{t}={v} m/s'),
   S('Interpretamos la rapidez',f'Recorre {v} metros en cada segundo, manteniendo esa rapidez.')],
  'No inviertas tiempo/distancia: tendría unidades s/m en vez de m/s.',f'{v} m/s×{t} s={d} m.',unit='m/s',data={'distance':d,'time':t})
 v=2*i;t=2
 add('fisica','aceleracion',i,'abp-05-11','Aceleración desde el reposo',f'Un móvil parte del reposo y llega a {v} m/s en {t} s. Con aceleración constante, usa a=(v final−v inicial)/tiempo.',i,
  'Partir del reposo significa velocidad inicial cero. La aceleración mide cuánto cambia la velocidad en cada segundo.',[
   S('Escribimos las velocidades',f'La inicial es 0 m/s y la final es {v} m/s.'),
   S('Calculamos el cambio','Restamos inicial a final.',f'Δv={v}−0={v} m/s'),
   S('Dividimos entre el tiempo','Repartimos ese cambio entre los segundos transcurridos.',f'a={v}/{t}={i} m/s²'),
   S('Leemos la unidad',f'En cada segundo la velocidad aumenta {i} m/s.')],
  'Aceleración no es velocidad: su unidad es m/s², porque mide un cambio de velocidad por segundo.',f'{i}×{t}={v}: se recupera el cambio de velocidad.',unit='m/s²',data={'finalVelocity':v,'initialVelocity':0,'time':t})
 m=2*i;a=3
 add('fisica','fuerza',i,'abp-11-19','Fuerza neta',f'Un cuerpo de {m} kg tiene aceleración de {a} m/s². Calcula la fuerza neta con F=m·a.',m*a,
  'm es la masa y a la aceleración. Si ambas están en kg y m/s², su producto da la fuerza neta en newtons, N.',[
   S('Anotamos los datos',f'm={m} kg; a={a} m/s².'),
   S('Identificamos la operación','La fórmula junta m y a mediante una multiplicación.', 'F=m×a'),
   S('Sustituimos los números','Multiplicamos masa por aceleración.',f'F={m}×{a}={m*a}'),
   S('Expresamos la fuerza','La unidad kg·m/s² recibe el nombre de newton.',f'F={m*a} N')],
  'No dividas m entre a: la relación dada pide multiplicarlos.',f'{m*a} N/{m} kg={a} m/s².',unit='N',data={'mass':m,'acceleration':a})
 add('fisica','peso',i,'abp-05-14','Peso de un cuerpo',f'Una masa de {i} kg está sometida a g=10 m/s². ¿Cuál es su peso? Usa P=m·g.',10*i,
  'El peso es una fuerza debida a la gravedad. La masa se expresa en kg y el peso calculado con estos datos se expresa en N.',[
   S('Separamos masa y gravedad',f'm={i} kg; g=10 m/s² es el valor indicado para este ejercicio.'),
   S('Usamos la relación del peso','Multiplicamos la masa por la aceleración gravitatoria.', 'P=m×g'),
   S('Hacemos el producto','Todavía conservamos la unidad de fuerza, no la de masa.',f'P={i}×10={10*i} N'),
   S('Respondemos lo que se pidió',f'La masa sigue siendo {i} kg; el peso es {10*i} N.')],
  'No escribas kg como unidad del peso: aquí se pide una fuerza en newtons.',f'{10*i} N/10 m/s²={i} kg.',unit='N',data={'mass':i,'g':10})
 v=i+1;K=v*v
 add('fisica','energia',i,'abp-05-15','Energía cinética básica',f'Un cuerpo de 2 kg se mueve a {v} m/s. Calcula K=m·v²/2.',K,
  'K es energía cinética. La fórmula pide elevar la rapidez al cuadrado, multiplicar por la masa y dividir entre 2, en ese orden.',[
   S('Calculamos el cuadrado de la rapidez','Elevar al cuadrado significa multiplicar el número por sí mismo.',f'v²={v}×{v}={K}'),
   S('Multiplicamos por la masa','La masa dada es 2 kg.',f'mv²=2×{K}={2*K}'),
   S('Dividimos entre dos','Tomamos la mitad del resultado anterior.',f'K={2*K}/2={K}'),
   S('Indicamos la unidad','Con kg y m/s, la energía queda en joules.',f'K={K} J')],
  'No uses 2v en lugar de v²: duplicar y elevar al cuadrado son operaciones distintas.',f'Como la masa vale 2 kg, m/2=1 y la energía numérica coincide con v²={K}.',unit='J',data={'mass':2,'speed':v})
 f=10*i;w=2
 add('fisica','onda',i,'abp-13-13','Rapidez de una onda',f'Una onda tiene frecuencia {f} Hz y longitud de onda {w} m. Usa v=f·λ para calcular su rapidez.',f*w,
  'f indica ciclos por segundo. λ, llamada lambda, indica metros por ciclo. Multiplicarlas da metros por segundo.',[
   S('Leemos las dos cantidades',f'f={f} Hz; λ={w} m.'),
   S('Escribimos la multiplicación','La relación dada usa el producto de ambas cantidades.', 'v=f×λ'),
   S('Sustituimos y operamos','Las dos cantidades ya están en las unidades de la fórmula.',f'v={f}×{w}={f*w}'),
   S('Escribimos la rapidez','La respuesta no queda en Hz: queda en metros por segundo.',f'v={f*w} m/s')],
  'Dividir frecuencia entre longitud no produce la rapidez que pide esta relación.',f'(ciclos/s)×(m/ciclo)=m/s.',unit='m/s',data={'frequency':f,'wavelength':w})
 add('fisica','carga',i,'abp-21-29','Carga eléctrica',f'Una corriente de {i} A circula durante 10 s. ¿Qué carga pasa? Usa Q=I·t.',10*i,
  'La corriente I indica cuánta carga pasa en un segundo. Con corriente constante, multiplicamos por todos los segundos para obtener Q.',[
   S('Identificamos corriente y tiempo',f'I={i} A; t=10 s. No hace falta convertir las unidades.'),
   S('Usamos la fórmula','La carga es corriente por tiempo.', 'Q=I×t'),
   S('Multiplicamos','Contamos la carga que pasa durante los diez segundos.',f'Q={i}×10={10*i}'),
   S('Nombramos la unidad','La carga se expresa en coulombs, C.',f'Q={10*i} C')],
  'No respondas en A: amperios es la unidad de corriente, no de carga.',f'{10*i} C/10 s={i} A.',unit='C',data={'current':i,'time':10})
 add('fisica','voltaje',i,'abp-21-30','Ley de Ohm básica',f'Por una resistencia de 3 Ω circula una corriente de {i} A. Calcula el voltaje con V=I·R.',3*i,
  'V es voltaje, I es corriente y R es resistencia. La ley de Ohm usada en este ejercicio indica multiplicar I por R.',[
   S('Identificamos cada símbolo',f'I={i} A; R=3 Ω.'),
   S('Escribimos la relación','No hay resistencias que sumar ni conversiones que hacer.', 'V=I×R'),
   S('Multiplicamos los datos','Reemplazamos cada letra por el valor correspondiente.',f'V={i}×3={3*i}'),
   S('Añadimos la unidad','El voltaje se expresa en volts, V.',f'V={3*i} V')],
  'Usar R/I no corresponde a la fórmula de voltaje indicada.',f'{3*i} V/3 Ω={i} A.',unit='V',data={'current':i,'resistance':3})

 # CHEMISTRY: formulas and masses already present in the reviewed ABP selection.
 formulas=[('H₂SO₄',{'H':2,'S':1,'O':4},{'H':1,'S':32,'O':16},'abp-24-23'),('NaClO₄',{'Na':1,'Cl':1,'O':4},{'Na':22.99,'Cl':35.5,'O':15.99},'abp-17-28'),('C₃H₇NO₂',{'C':3,'H':7,'N':1,'O':2},{'C':12,'H':1,'N':14,'O':16},'abp-44-46'),('C₂H₆',{'C':2,'H':6},{'C':12,'H':1},'abp-36-57'),('Fe₂O₃',{'Fe':2,'O':3},{'Fe':56,'O':16},'abp-25-25'),('NaHCO₃',{'Na':1,'H':1,'C':1,'O':3},{'Na':23,'H':1,'C':12,'O':16},'abp-36-59')]
 formula,comp,masses,parent=formulas[i-1];count=len(comp);atoms=sum(comp.values())
 # Na=23 for the final counting formula is not needed in a mass problem:
 # use H2SO4 with its source-given masses instead for the sixth molar-mass case.
 add('quimica','elementos',i,parent,'Elementos diferentes',f'¿Cuántos elementos diferentes hay en {formula}? Los símbolos son '+', '.join(comp)+'.',count,
  'Un símbolo identifica un elemento. Na y Fe tienen dos letras, pero cada uno sigue siendo un solo símbolo. Los subíndices cuentan átomos, no elementos distintos.',[
   S('Separamos los símbolos','Leemos un símbolo completo cada vez.',', '.join(comp)),
   S('Ignoramos los subíndices para este conteo','Un 2 o un 3 junto a un símbolo no agrega un elemento nuevo.'),
   S('Contamos los símbolos distintos','Cada uno aparece una sola vez en nuestra lista.',f'Cantidad de elementos={count}'),
   S('Distinguimos lo que se pidió','Aquí contamos tipos de elementos, no todos los átomos de la fórmula.')],
  'No sumes los subíndices cuando te pregunten cuántos elementos distintos hay.',f'La lista contiene {count} símbolos distintos.',data={'composition':comp})
 add('quimica','atomos-formula',i,parent,'Átomos en una fórmula',f'¿Cuántos átomos en total representa una unidad de {formula}? Si un símbolo no tiene subíndice, cuenta 1.',atoms,
  'Un subíndice indica cuántos átomos de ese elemento hay por unidad. Un símbolo sin subíndice equivale a tener un 1.',[
   S('Leemos los subíndices','Anotamos la cantidad de cada elemento.', '; '.join(f'{e}: {n}' for e,n in comp.items())),
   S('Incluimos los que no llevan número','Los elementos con cantidad 1 también cuentan; no se omiten de la suma.'),
   S('Sumamos todos los átomos','Ahora sí sumamos las cantidades, porque preguntan átomos totales.', '+'.join(map(str,comp.values()))+f'={atoms}'),
   S('Diferenciamos átomos y elementos',f'Esta fórmula tiene {count} elementos diferentes y {atoms} átomos en total por unidad.')],
  'Contar símbolos responde elementos distintos; sumar sus cantidades responde átomos totales.',f'Cada uno de los {atoms} átomos quedó incluido en la suma.',data={'composition':comp})
 if i==6:formula,comp,masses,parent='H₂SO₄',{'H':2,'S':1,'O':4},{'H':1,'S':32,'O':16},'abp-24-23'
 M=sum(Fraction(str(masses[e]))*n for e,n in comp.items())
 # Sixth case uses two moles: a different question without introducing a new atomic mass.
 if i<6:
  add('quimica','masa-molar-basica',i,parent,'Masa molar',f'Calcula la masa molar de {formula}. Usa '+', '.join(f'{e}={num(v)}' for e,v in masses.items())+' g/mol.',M,
   'La masa molar es la suma de lo que aporta cada elemento. Multiplicamos su masa por el subíndice y luego reunimos todos los aportes.',[
    S('Contamos cada elemento','Un símbolo sin subíndice cuenta una vez.', '; '.join(f'{e}: {n}' for e,n in comp.items())),
    S('Calculamos cada aporte','Multiplicamos cantidad por masa de ese elemento.', '; '.join(f'{n}×{num(masses[e])}={num(Fraction(str(masses[e]))*n)}' for e,n in comp.items())),
    S('Sumamos los aportes','Todos los elementos deben entrar en la suma.', '+'.join(num(Fraction(str(masses[e]))*n) for e,n in comp.items())+f'={num(M)}'),
    S('Interpretamos el resultado',f'Un mol de {formula} tiene masa {num(M)} g.',f'M={num(M)} g/mol')],
   'No sumes solo las masas de los símbolos: cada una se multiplica por su subíndice.',f'La suma incluye todos los átomos de la fórmula.',unit='g/mol',data={'composition':comp,'atomicMasses':masses})
 else:
  add('quimica','masa-molar-basica',i,parent,'Masa desde moles', 'Un mol de H₂SO₄ tiene masa de 98 g. ¿Cuántos gramos tienen dos moles?',196,
   'Si cada mol pesa 98 g, dos moles contienen dos veces esa masa. La cantidad de moles multiplica a los gramos por mol.',[
    S('Leemos la equivalencia','Un mol de la sustancia corresponde a 98 g.', '1 mol→98 g'),
    S('Contamos los grupos','Dos moles son dos grupos iguales de 98 g.'),
    S('Sumamos las dos masas','Sumar 98 dos veces equivale a multiplicar por 2.', '98+98=2×98=196 g'),
    S('Expresamos la masa total','La respuesta está en gramos, no en g/mol.', 'm=196 g')],
   'La masa molar sigue siendo 98 g/mol; lo que aumenta es la masa total de la muestra.', '196 g/2 mol=98 g/mol.',unit='g',data={'moles':2,'M':98})
 add('quimica','moles-a-masa',i,'abp-24-23','De moles a gramos',f'Tienes {i} mol de H₂SO₄. Su masa molar es 98 g/mol. ¿Qué masa tienen? Usa m=n·M.',98*i,
  'n es cantidad de moles y M son gramos por mol. Multiplicarlos permite contar la masa de todos los moles.',[
   S('Identificamos los datos',f'n={i} mol; M=98 g/mol.'),
   S('Elegimos la operación','Cada mol aporta 98 g, por eso multiplicamos.', 'm=n×M'),
   S('Sustituimos y multiplicamos','La unidad mol se cancela con mol del denominador.',f'm={i}×98={98*i} g'),
   S('Respondemos en gramos','No se pide la masa de un átomo o molécula: se pide la masa de toda la cantidad dada.')],
  'Dividir n entre M no da la masa: se necesita multiplicar moles por gramos/mol.',f'{98*i} g/98 g/mol={i} mol.',unit='g',data={'moles':i,'M':98})
 add('quimica','masa-a-moles',i,'abp-24-23','De gramos a moles',f'Una muestra de H₂SO₄ tiene masa {98*i} g. Su masa molar es 98 g/mol. Calcula n=m/M.',i,
  'Si un mol pesa 98 g, dividimos la masa total entre 98 para saber cuántos grupos de un mol contiene.',[
   S('Identificamos masa y masa molar',f'm={98*i} g; M=98 g/mol.'),
   S('Escribimos el cociente','La masa total va arriba y los gramos por mol abajo.', 'n=m/M'),
   S('Hacemos la división','Contamos los grupos de 98 g contenidos en la muestra.',f'n={98*i}/98={i} mol'),
   S('Interpretamos la unidad',f'La muestra contiene {i} mol de la sustancia.')],
  'No multipliques por 98: eso sirve al ir de moles a gramos, la conversión contraria.',f'{i} mol×98 g/mol={98*i} g.',unit='mol',data={'grams':98*i,'M':98})
 add('quimica','orbitales-basicos',i,'abp-16-24','Capacidad de orbitales',f'Cada orbital admite como máximo 2 electrones. ¿Cuántos caben en {i} orbitales?',2*i,
  'Contamos una capacidad de dos electrones por cada orbital. No estamos afirmando que los orbitales ya estén ocupados: calculamos cuántos caben.',[
   S('Identificamos cuántos orbitales hay',f'El ejercicio da {i} orbitales.'),
   S('Anotamos la capacidad de uno','Cada orbital aporta capacidad para dos electrones.', '1 orbital→2 electrones'),
   S('Multiplicamos cantidad por capacidad','Sumamos la misma capacidad tantas veces como orbitales hay.',f'{i}×2={2*i}'),
   S('Escribimos qué se contó','La respuesta corresponde al máximo de electrones.',f'Máximo={2*i} electrones')],
  'El número de orbitales y el de electrones no son el mismo conteo.',f'{2*i}/{i}=2 electrones por orbital.',unit='electrones',data={'orbitals':i,'capacity':2})
 n=2*i
 add('quimica','hgo-basico',i,'abp-16-22','Proporción de una reacción',f'En 2HgO→2Hg+O₂, cada 2 mol de HgO forman 1 mol de O₂. ¿Cuánto O₂ se obtiene de {n} mol de HgO?',i,
  'Los coeficientes de la ecuación relacionan moles de sustancias. Aquí hay que formar grupos de dos moles de HgO por cada mol de O₂.',[
   S('Leemos la proporción','La relación que interesa es entre HgO y O₂.', '2 mol HgO→1 mol O₂'),
   S('Identificamos la cantidad inicial',f'Partimos de {n} mol de HgO, no de gramos.'),
   S('Dividimos entre dos','Cada grupo de dos produce uno de oxígeno.',f'n(O₂)={n}/2={i} mol'),
   S('Nombramos el producto','El número calculado corresponde a O₂, la sustancia que nos pidieron.')],
  'El subíndice 2 de O₂ no significa que se produzcan dos moles: eso lo indican los coeficientes.',f'{i} mol O₂ requieren {2*i} mol HgO, los dados.',unit='mol de O₂',data={'hgoMoles':n})
 add('quimica','agua-basica',i,'abp-35-46','Moles de agua',f'H₂SO₄+Ca(OH)₂→CaSO₄+2H₂O. Cada mol del ácido forma 2 mol de agua. Con base suficiente, ¿cuánta agua forman {i} mol de ácido?',2*i,
  'Para este ejercicio solo necesitamos la proporción dada: un mol del ácido produce dos moles de agua. Tener base suficiente permite consumir todo el ácido indicado.',[
   S('Elegimos las sustancias','Seguimos la relación H₂SO₄→H₂O, no la del ácido con la sal.'),
   S('Leemos el factor','Por cada mol de ácido se obtiene el doble de moles de agua.', '1 mol H₂SO₄→2 mol H₂O'),
   S('Multiplicamos la cantidad inicial','Usamos el factor 2 que indica la reacción.',f'n(H₂O)={i}×2={2*i} mol'),
   S('Escribimos la sustancia en la respuesta','Son moles de agua, no gramos ni moles del ácido.')],
  'La relación es entre moles; no implica que la masa del agua sea el doble de la masa del ácido.',f'{2*i}/{i}=2 mol de agua por mol de ácido.',unit='mol de H₂O',data={'acidMoles':i})
 add('quimica','mg-basico',i,'abp-35-45','Una relación uno a uno',f'Mg+H₂SO₄→MgSO₄+H₂. Un mol de Mg forma 1 mol de H₂. ¿Cuántos moles de H₂ forman {i} mol de Mg con ácido suficiente?',i,
  'Los dos coeficientes de interés son 1. Por eso la cantidad de moles de H₂ producido coincide con los moles de Mg que reaccionan.',[
   S('Leemos la relación','Por cada mol de Mg aparece un mol del gas.', '1 mol Mg→1 mol H₂'),
   S('Identificamos los moles disponibles',f'Hay {i} mol de Mg y suficiente ácido para que reaccionen.'),
   S('Aplicamos el factor uno','Multiplicar por uno mantiene el número de moles.',f'n(H₂)={i}×1={i} mol'),
   S('Cambiamos el nombre de la sustancia','El número coincide, pero el dato era de Mg y la respuesta corresponde al H₂ formado.')],
  'Que los moles coincidan no significa que sus masas en gramos sean iguales.',f'La proporción H₂/Mg es {i}/{i}=1.',unit='mol de H₂',data={'magnesiumMoles':i})
 add('quimica','unidades-formula',i,'abp-36-59','Átomos en varias unidades',f'Una unidad de NaHCO₃ contiene 6 átomos en total. ¿Cuántos átomos representan {i} unidades?',6*i,
  'Si conocemos cuántos átomos tiene una unidad, varias unidades iguales repiten esa misma cantidad. Multiplicamos átomos por unidad por cantidad de unidades.',[
   S('Leemos la cantidad de una unidad','El dato ya cuenta Na, H, C y los tres O.', '1+1+1+3=6 átomos'),
   S('Leemos cuántas unidades hay',f'Hay {i} copias de esa misma composición.'),
   S('Multiplicamos','Cada copia aporta seis átomos.',f'{i}×6={6*i}'),
   S('Indicamos el conteo total','Se piden átomos totales, no elementos distintos.',f'Total={6*i} átomos')],
  'NaHCO₃ tiene cuatro elementos diferentes, pero seis átomos por unidad. No confundas esos conteos.',f'{6*i}/{i}=6 átomos por unidad.',unit='átomos',data={'units':i,'atomsPerUnit':6})

assert len(created)==180
assert len({q['text'] for q in created})==180
bank['questions']+=created
path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(ROOT/'api/_sufficiency/beginner-checks.json').write_text(json.dumps({'questions':180,'families':30,'checks':checks},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Created 180 introductory exercises: 60 mathematics, 60 physics, 60 chemistry.')
