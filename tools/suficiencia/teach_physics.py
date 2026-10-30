import math
from teaching_common import num,frac,F,step as S,lesson as L

def explain(f,d):
 if f=='conversion-aceleracion':
  v=d['speedCms'];minutes=d['minutes'];meters=F(v)/100;seconds=minutes*60;a=meters/seconds
  return L('Calcular cuánto aumenta la rapidez por cada segundo.', 'La aceleración se calcula como a=(v final−v inicial)/tiempo. «Parte del reposo» significa v inicial=0. Como piden m/s², la rapidez debe estar en metros por segundo y el tiempo en segundos.',[
   S('Convertimos centímetros a metros','Un metro contiene 100 centímetros. Para expresar la misma distancia en metros, dividimos entre 100.',f'{v} cm/s ÷ 100 = {num(meters)} m/s'),
   S('Convertimos minutos a segundos','Cada minuto tiene 60 segundos. Ahora multiplicamos, porque un intervalo contiene más segundos que minutos.',f'{minutes} min × 60 = {seconds} s'),
   S('Calculamos el cambio de rapidez','La rapidez inicial es cero, así que todo el valor final es un aumento.',f'Δv = {num(meters)} − 0 = {num(meters)} m/s'),
   S('Dividimos entre el tiempo','La pregunta pide el cambio por cada segundo: repartimos el aumento entre los segundos transcurridos.',f'a = Δv/Δt = {num(meters)}/{seconds} = {num(a)} m/s²'),
   S('Leemos la unidad','m/s² significa que la rapidez, medida en m/s, aumenta esa cantidad en cada segundo. Si las alternativas están redondeadas, usamos la aproximación indicada.')],
   'No dividas cm/s entre minutos como si ya fueran m/s y segundos: necesitas las dos conversiones.',f'Al multiplicar la aceleración sin redondear por {seconds} s, se recupera el aumento de rapidez de {num(meters)} m/s.')
 if f=='dos-etapas':
  s1,s2,v=[F(d[k]) for k in ['s1','s2','v']];t1=2*s1/v;t2=s2/v
  return L('Sumar el tiempo de una etapa con aceleración y el de otra a rapidez constante.', 'No se puede usar la rapidez final para toda la carrera: al principio el atleta aún va más despacio. Con aceleración constante desde el reposo, la rapidez media de esa primera etapa es (0+v)/2.',[
   S('Separamos los tramos',f'Primer tramo: {num(s1)} m, desde 0 hasta {num(v)} m/s. Segundo tramo: {num(s2)} m, siempre a {num(v)} m/s.'),
   S('Hallamos la rapidez media del primero','Como la rapidez sube uniformemente, promediamos los valores inicial y final.',f'v media = (0+{num(v)})/2 = {num(v/2)} m/s'),
   S('Calculamos el primer tiempo','Tiempo=distancia/rapidez media. Dividir entre v/2 equivale a multiplicar la distancia por 2 y dividir entre v.',f't₁ = {num(s1)}/({num(v/2)}) = {num(2*s1)}/{num(v)} = {num(t1)} s'),
   S('Calculamos el segundo tiempo','Aquí no hay que promediar: la rapidez ya es constante.',f't₂ = {num(s2)}/{num(v)} = {num(t2)} s'),
   S('Sumamos los dos tiempos','Las etapas ocurren una después de la otra, así que sus duraciones se suman.',f't total = {num(t1)}+{num(t2)} = {num(t1+t2)} s')],
   'Usar (distancia total)/rapidez final hace como si el atleta hubiese tenido esa rapidez desde el inicio.',f'La primera etapa tarda más que recorrer sus {num(s1)} m a la rapidez final. Eso concuerda con que empezó desde cero.')
 if f=='energia-cinetica':
  m,v,k=[F(d[a]) for a in ['m','v','factor']];vf=v*k;square=vf*vf;K=m*square/2
  return L('Encontrar la energía del movimiento después de aumentar la rapidez.', 'La energía cinética se calcula con K=m·v²/2. m es la masa en kg y v la rapidez en m/s. El cuadrado v² significa v×v; por eso cambiar la rapidez tiene un efecto mayor que cambiar solo la masa.',[
   S('Calculamos la nueva rapidez',f'La rapidez inicial se multiplica por {num(k)}. Todavía no calculamos la energía.',f'v final = {num(v)}×{num(k)} = {num(vf)} m/s'),
   S('Elevamos esa rapidez al cuadrado','El cuadrado debe aplicarse a la rapidez nueva completa.',f'v² = {num(vf)}×{num(vf)} = {num(square)}'),
   S('Multiplicamos por la masa','Recién ahora entra la masa del cuerpo.',f'mv² = {num(m)}×{num(square)} = {num(m*square)}'),
   S('Dividimos entre 2','La fórmula pide la mitad del producto anterior.',f'K = {num(m*square)}/2 = {num(K)} J'),
   S('Verificamos cómo cambió la energía',f'Multiplicar la rapidez por {num(k)} multiplica su cuadrado por {num(k*k)}. La masa no cambió.',f'K final/K inicial = {num(k)}² = {num(k*k)}')],
   'No multipliques la energía inicial solo por el factor de rapidez: ese factor también debe elevarse al cuadrado.',f'La energía final debe ser {num(k*k)} veces la inicial, además de coincidir con {num(K)} J.')
 if f=='encuentro':
  gap,va,vb,t=[F(d[k]) for k in ['distance','va','vb','hours']];closing=va+vb;meet=gap/closing;after=t-meet;sep=abs(gap-closing*t)
  return L('Saber la distancia que separa a los móviles después de cierto tiempo.', 'Cuando avanzan uno hacia el otro, ambos ayudan a cerrar la separación: se suman sus rapideces. Si continúan después de cruzarse, empiezan a separarse otra vez; la distancia física no puede ser negativa.',[
   S('Sumamos cuánto acercan sus posiciones en una hora',f'Uno avanza {num(va)} km y el otro {num(vb)} km por hora. Juntos cierran más separación.',f'Rapidez relativa = {num(va)}+{num(vb)} = {num(closing)} km/h'),
   S('Hallamos cuándo se cruzan','Tiempo de encuentro=separación inicial/rapidez con la que se cierra esa separación.',f't encuentro = {num(gap)}/{num(closing)} = {num(meet)} h'),
   S('Comparamos con el tiempo preguntado',f'Preguntan por {num(t)} h. '+('Ya se cruzaron; calculamos el tiempo que siguieron moviéndose.' if after>=0 else 'Aún no se cruzaron; la separación sigue disminuyendo.'),f'{num(t)}−{num(meet)} = {num(after)} h'),
   S('Calculamos la separación', 'Después de cruzarse se alejan con la suma de rapideces.' if after>=0 else 'Restamos a la separación inicial lo que han cerrado.',f'Distancia = {num(closing)}×{num(abs(after))} = {num(sep)} km'),
   S('Interpretamos el resultado','No se detienen en el encuentro. La distancia buscada es la que hay al tiempo indicado, no la distancia recorrida por cada uno.')],
   'No respondas cero solo porque alguna vez se cruzan: hay que evaluar la separación a la hora que pide el problema.',f'El encuentro ocurre a las {num(meet)} h y la separación al tiempo pedido es {num(sep)} km.')
 if f=='alcance':
  gap=F(d['gap']);af,ab=F(d['aFast']),F(d['aSlow']);delta=af-ab;t2=2*gap/delta;t=math.sqrt(float(t2))
  return L('Encontrar cuándo el móvil de atrás recupera toda la ventaja del otro.', 'Desde el reposo y con aceleración constante, la distancia recorrida es a·t²/2. Los dos recorren distancia, pero solo la diferencia entre esas distancias sirve para cerrar la ventaja inicial.',[
   S('Escribimos lo recorrido por cada móvil', 'Los tiempos son iguales porque parten simultáneamente.',f'sA={num(af)}t²/2; sB={num(ab)}t²/2'),
   S('Restamos las distancias','A alcanza a B cuando ha recorrido exactamente la ventaja inicial más lo que recorrió B.',f'sA−sB = ({num(af)}−{num(ab)})t²/2 = {num(delta)}t²/2'),
   S('Igualamos a la separación inicial',f'La distancia que A debe recuperar es {num(gap)} m.',f'{num(delta)}t²/2 = {num(gap)}'),
   S('Despejamos el cuadrado del tiempo','Multiplicamos por 2 y dividimos entre la diferencia de aceleraciones.',f't² = (2×{num(gap)})/{num(delta)} = {num(t2)}'),
   S('Sacamos la raíz positiva','La raíz cuadrada es el número que, multiplicado por sí mismo, da t². El tiempo transcurrido no puede ser negativo.',f't=√{num(t2)}={num(t)} s')],
   'Usar solo la distancia recorrida por A ignora que B también avanza durante ese mismo tiempo.',f'Con este t, la diferencia entre las dos distancias recorridas es {num(gap)} m, justo la ventaja inicial.')
 if f=='fuerza-neta':
  m,v,t=[F(d[k]) for k in ['m','speedKmh','time']];meters=v*1000;vs=meters/3600;a=vs/t;force=m*a
  return L('Calcular la fuerza neta que produce el cambio de rapidez del automóvil.', 'F=m·a relaciona fuerza neta, masa y aceleración. Antes de usarla debemos hallar a. Como parte del reposo, su rapidez inicial es cero. La fuerza en newtons se calcula usando kg, m y s.',[
   S('Leemos los datos útiles',f'Masa m={num(m)} kg; rapidez final {num(v)} km/h; tiempo {num(t)} s; rapidez inicial 0 m/s.'),
   S('Pasamos los kilómetros a metros','1 km=1000 m. Multiplicamos por 1000 y por ahora mantenemos la hora.',f'{num(v)} km/h × 1000 = {num(meters)} m/h'),
   S('Pasamos la hora a segundos','1 h=3600 s. Para saber cuánto recorre por cada segundo dividimos entre 3600.',f'{num(meters)} m/h ÷ 3600 = {num(vs)} m/s'),
   S('Calculamos la aceleración','Aceleración=cambio de rapidez/tiempo. El cambio es v final−0.',f'a=({num(vs)}−0)/{num(t)}={num(a)} m/s²'),
   S('Aplicamos F=m·a','Multiplicamos la masa por la aceleración que acabamos de calcular.',f'F={num(m)}×{num(a)}={num(force)} N'),
   S('Distinguimos la fuerza del peso','Aquí se pide la fuerza neta que acelera al automóvil, no el peso mg. Usar g=9,8 sin que se necesite resolvería otra pregunta.')],
   'No coloques km/h directamente en la fórmula de aceleración si el resultado final debe estar en unidades del SI.',f'La fuerza dividida entre la masa debe devolver la aceleración: {num(force)}/{num(m)}={num(a)} m/s².')
 if f=='dilatacion':
  length,temp,alpha=[F(d[k]) for k in ['L','dT','alpha']];first=alpha*length;delta=first*temp
  return L('Calcular cuánto se alarga una barra al calentarse.', 'En ΔL=α·L₀·ΔT, ΔL es el aumento de longitud, α (alfa) es el coeficiente de dilatación, L₀ la longitud inicial y ΔT el aumento de temperatura. ΔL no es la longitud final de la barra.',[
   S('Identificamos qué nos dieron',f'L₀={num(length)} cm; ΔT={num(temp)} °C; α={num(alpha,8)} por °C. Las longitudes pueden quedar en cm porque L₀ está en cm.'),
   S('Elegimos la relación','El aumento es mayor si la barra es más larga, si se calienta más o si el material tiene mayor coeficiente. Por eso se multiplican los tres factores.', 'ΔL=α·L₀·ΔT'),
   S('Multiplicamos coeficiente por longitud','Conservamos suficientes decimales; todavía no redondeamos.',f'α·L₀={num(alpha,8)}×{num(length)}={num(first,8)}'),
   S('Multiplicamos por el cambio de temperatura','El resultado ya es el aumento de longitud.',f'ΔL={num(first,8)}×{num(temp)}={num(delta,8)} cm'),
   S('Respondemos lo que pide el enunciado','Si se pide aproximar a dos decimales, se redondea solo al final. Para hallar la longitud final habría que sumar este aumento a L₀, pero esa es otra cantidad.',f'Aumento sin redondear: {num(delta,8)} cm')],
   'No confundas la longitud final con el aumento. Tampoco redondees α a 0: es pequeño, pero no es cero.',f'El aumento es positivo al aumentar la temperatura y es mucho menor que la longitud inicial {num(length)} cm.')
 if f=='ondas':
  frequency=F(d['frequency']);wavelength=F(d['wavelength']);v=frequency*wavelength
  return L('Hallar la rapidez con que se propaga la onda.', 'La frecuencia f indica cuántas oscilaciones ocurren en un segundo. La longitud de onda λ (lambda) es la distancia de un ciclo. Si en un segundo pasan f ciclos de longitud λ, la onda avanza f·λ metros.',[
   S('Identificamos las dos cantidades',f'f={num(frequency)} Hz y λ={num(wavelength)} m. Hz significa 1/s, es decir, veces por segundo.'),
   S('Elegimos multiplicar, no dividir','Número de ciclos por segundo × metros de cada ciclo = metros por segundo.', 'v=f·λ'),
   S('Reemplazamos los datos','Usamos los valores tal como están porque ya están en Hz y metros.',f'v={num(frequency)}×{num(wavelength)}'),
   S('Hacemos la multiplicación y ponemos la unidad','Una rapidez no se expresa en Hz ni solo en metros.',f'v={num(v)} m/s')],
   'Dividir f entre λ no tiene unidades de rapidez. Revisar las unidades ayuda a decidir qué operación corresponde.',f'La unidad del producto es (1/s)·m=m/s y el valor es {num(v)}.')
 if f in ['lente-divergente','lente-convergente']:
  focal,obj=F(d['focal']),F(d['object']);inverse=1/focal-1/obj;image=1/inverse
  common=math.lcm(abs(int(focal)),abs(int(obj)));n1=int(common/focal);n2=int(common/obj)
  kind='La lente divergente usa f negativa.' if focal<0 else 'La lente convergente usa f positiva.'
  return L('Encontrar la posición de la imagen de una lente.', 'En 1/f=1/s+1/s′, f es la distancia focal, s la distancia del objeto y s′ la de la imagen. Los números 1/f y 1/s son inversos: 1 dividido entre la distancia. '+kind,[
   S('Anotamos los datos con sus signos',f'f={num(focal)} cm y s={num(obj)} cm. No se cambia el signo de f para que resulte más cómodo.'),
   S('Aislamos el término de la imagen','Restamos 1/s a ambos lados para que a la derecha quede solo 1/s′.', '1/s′=1/f−1/s'),
   S('Buscamos un denominador común',f'Usamos {common}, que es divisible entre ambas distancias en valor absoluto. Al multiplicar el denominador también multiplicamos su numerador por el mismo factor.',f'1/f={n1}/{common}; 1/s={n2}/{common}'),
   S('Restamos las fracciones','Con el mismo denominador restamos solo los numeradores y simplificamos.',f'1/s′=({n1}−({n2}))/{common}={n1-n2}/{common}={frac(inverse)} cm⁻¹'),
   S('Invertimos para encontrar s′','Hasta aquí tenemos 1/s′, no s′. Si 1/s′=a/b, entonces s′=b/a.',f's′=1/({frac(inverse)})={frac(image)} cm ≈ {num(image)} cm'),
   S('Interpretamos el signo','Con la convención del ejercicio, una distancia de imagen negativa indica imagen virtual; una positiva indica imagen real. El signo no debe eliminarse del resultado.')],
   'No confundas el valor de 1/s′ con el de s′. El último paso de invertir es necesario.',f'Al colocar s′={frac(image)} cm, se cumple 1/f=1/s+1/s′. Así comprobamos las tres distancias.')
 if f=='campo-distancia':
  E,r=F(d['field']),F(d['ratio']);square=r*r;result=E/square
  return L('Encontrar el nuevo campo cuando cambia la distancia a la misma carga.', 'Para una carga puntual E=kQ/r². Si la carga no cambia, kQ permanece igual: solo cambia el cuadrado de la distancia. Alejarse reduce el campo; no lo aumenta.',[
   S('Identificamos qué permanece igual','No cambian ni la carga ni el medio. El único cambio indicado es la distancia.',f'r₂={num(r)}·r₁'),
   S('Elevamos el factor de distancia al cuadrado','El denominador de la fórmula contiene r². Por eso el factor de alejamiento también se eleva al cuadrado.',f'({num(r)}r₁)²={num(square)}r₁²'),
   S('Calculamos la parte de campo que queda',f'El nuevo campo es el anterior dividido entre {num(square)}, no entre {num(r)}.',f'E₂=E₁/{num(square)}'),
   S('Sustituimos el campo conocido','Ahora realizamos la división.',f'E₂={num(E)}/{num(square)}={num(result)} N/C')],
   'Si la distancia se duplica, el campo se divide entre 4, no entre 2: el exponente 2 es esencial.',f'{num(result)} N/C es menor que {num(E)} N/C, como debe ocurrir al alejarnos de la misma carga.')
 if f=='paralelo':
  rs=[F(r) for r in d['resistors']];conductance=sum(1/r for r in rs);R=1/conductance
  denominator=math.lcm(*(r.numerator for r in rs));numerators=[int(denominator/r) for r in rs]
  return L('Encontrar una sola resistencia que equivalga a las conectadas en paralelo.', 'En paralelo hay varios caminos para la corriente. La relación que se usa es 1/R=1/R₁+1/R₂+1/R₃. El resultado de esa suma es el inverso de la resistencia, no la resistencia misma.',[
   S('Reconocemos el tipo de conexión','El enunciado dice paralelo. Por eso no corresponde sumar directamente R₁+R₂+R₃.', '1/R=1/R₁+1/R₂+1/R₃'),
   S('Reemplazamos cada resistencia','Escribimos una fracción por cada camino de corriente.', '1/R='+' + '.join(f'1/{num(r)}' for r in rs)),
   S('Usamos el mismo denominador',f'{denominator} es múltiplo de todas las resistencias. Para transformar cada fracción multiplicamos arriba y abajo por el mismo número.', ' + '.join(f'1/{num(r)}={n}/{denominator}' for r,n in zip(rs,numerators))),
   S('Sumamos los numeradores','Con denominador común, sumamos las partes de arriba y mantenemos el de abajo. Después simplificamos si hay un factor común.',f'1/R=('+ '+'.join(map(str,numerators))+f')/{denominator}={sum(numerators)}/{denominator}={frac(conductance)} Ω⁻¹'),
   S('Invertimos el resultado','Si 1/R=a/b, entonces R=b/a. Este paso no se puede omitir.',f'R=1/({frac(conductance)})={frac(R)} Ω ≈ {num(R)} Ω'),
   S('Comparamos con las resistencias originales','Varios caminos en paralelo hacen que la resistencia equivalente sea menor que la más pequeña de las ramas.')],
   'Sumar las resistencias directamente es la regla de una conexión en serie, no de una conexión en paralelo.',f'El valor {num(R)} Ω es menor que {num(min(rs))} Ω, la menor resistencia individual.')
 if f=='temperatura':
  value=F(d['fahrenheit']);difference=value-32;product=difference*5;C=product/9
  return L('Expresar una temperatura Fahrenheit en grados Celsius.', 'Las escalas no empiezan en el mismo número y tampoco tienen pasos del mismo tamaño. Por eso se hacen dos operaciones: restar 32 y después multiplicar por 5/9.',[
   S('Escribimos la conversión completa','Los paréntesis indican que la resta debe hacerse antes de multiplicar.', 'T°C=(T°F−32)×5/9'),
   S('Sustituimos la temperatura dada','Reemplazamos solamente T°F; el 32, el 5 y el 9 son parte de la conversión.',f'T°C=({num(value)}−32)×5/9'),
   S('Resolvemos el paréntesis','Primero quitamos la diferencia entre los orígenes de las escalas.',f'{num(value)}−32={num(difference)}'),
   S('Multiplicamos por 5 y dividimos entre 9','Multiplicar por una fracción significa multiplicar por su numerador y dividir entre su denominador.',f'{num(difference)}×5={num(product)}; {num(product)}/9={num(C)}'),
   S('Cambiamos la unidad de la respuesta','El número hallado ahora corresponde a Celsius, no a Fahrenheit.',f'T={num(C)} °C')],
   'Si multiplicas por 5/9 antes de restar 32, resuelves otra operación. Conserva el orden de los paréntesis.',f'Conversión inversa: ({num(C)}×9/5)+32={num(value)} °F. Se recupera el dato inicial.')
 if f=='vectores':
  x,y=F(d['x']),F(d['y']);squares=x*x+y*y;mod=math.sqrt(float(squares))
  return L('Encontrar el tamaño del vector que hace que la suma de los tres sea cero.', 'i y j representan direcciones perpendiculares. Para anular un vector se necesita otro con componentes opuestas. El módulo es su tamaño y se obtiene con Pitágoras, no sumando directamente las componentes.',[
   S('Sumamos los dos vectores conocidos','Uno aporta la componente horizontal y el otro la vertical.',f'Vector suma = {num(x)}i+{num(y)}j'),
   S('Elegimos el vector que lo anula','Las componentes deben ser opuestas para que cada dirección sume cero.',f'Tercer vector = −{num(x)}i−{num(y)}j'),
   S('Elevamos las componentes al cuadrado','El módulo usa cuadrados: el signo negativo desaparece al multiplicar dos negativos.',f'(−{num(x)})²={num(x*x)}; (−{num(y)})²={num(y*y)}'),
   S('Sumamos y sacamos la raíz','La suma de cuadrados representa el cuadrado del tamaño buscado.',f'Módulo = √({num(x*x)}+{num(y*y)})=√{num(squares)}={num(mod)}')],
   'La suma de componentes x+y no es el módulo cuando las direcciones son perpendiculares.',f'El tercer vector cancela {num(x)}i y {num(y)}j, y su módulo es positivo: {num(mod)}.')
 if f=='tiro-vertical':
  h,v,g=[F(d[k]) for k in ['height','initialVelocity','g']];A=g/2;disc=v*v+4*A*h;root=math.sqrt(float(disc));plus=(float(v)+root)/(2*float(A));minus=(float(v)-root)/(2*float(A))
  return L('Calcular cuándo la piedra llega al suelo después de lanzarse hacia arriba.', 'Tomamos el suelo como altura 0 y el sentido hacia arriba como positivo. La posición es y=altura inicial+v₀t−gt²/2. La gravedad resta altura porque actúa hacia abajo.',[
   S('Construimos la ecuación de altura','La piedra empieza a cierta altura y sube inicialmente, pero la gravedad frena esa subida y después la hace caer.',f'y={num(h)}+{num(v)}t−{num(A)}t²'),
   S('Imponemos la condición de llegar al suelo','El suelo corresponde a y=0. Ordenamos para resolver una ecuación cuadrática.',f'{num(A)}t²−{num(v)}t−{num(h)}=0'),
   S('Identificamos los coeficientes','En At²+Bt+C=0, A es el coeficiente de t², B el de t y C el término sin t.',f'A={num(A)}, B=−{num(v)}, C=−{num(h)}'),
   S('Calculamos lo que va dentro de la raíz','La fórmula cuadrática usa B²−4AC. Como C es negativo, al restar 4AC aquí se agrega una cantidad.',f'B²−4AC={num(v*v)}+{num(4*A*h)}={num(disc)}'),
   S('Aplicamos la fórmula con los dos signos','El signo ± significa hacer una cuenta sumando la raíz y otra restándola.',f't=[{num(v)}±√{num(disc)}]/{num(2*A)} → {num(plus)} s o {num(minus)} s'),
   S('Elegimos el tiempo posterior al lanzamiento','La raíz negativa correspondería a un instante anterior a t=0. Para el tiempo que transcurre después de soltar la piedra, conservamos la positiva.',f't={num(plus)} s')],
   'No uses solo el tiempo de subida. La pregunta pide llegar al suelo, que está por debajo del punto de lanzamiento.',f'Al poner t={num(plus)} en la ecuación de altura, el resultado es y=0, el nivel del suelo.')
 if f=='dos-encuentros':
  va,vb,start=[F(d[k]) for k in ['va','vb','initial']];sumr=va-vb;disc=sumr*sumr-4*start;root=math.sqrt(float(disc));t1=(float(sumr)-root)/2;t2=(float(sumr)+root)/2
  return L('Encontrar todos los instantes en que ambos móviles ocupan la misma posición.', 'Dos móviles se encuentran cuando sus posiciones son iguales en el mismo t. No necesitamos igualar sus velocidades. Como una posición contiene t², puede haber dos instantes de encuentro.',[
   S('Igualamos las posiciones dadas','En un encuentro, xA=xB.',f'{num(va)}t={num(start)}+{num(vb)}t+t²'),
   S('Pasamos todo a un mismo lado','Restamos la posición de A y juntamos los términos en t.',f't²−{num(sumr)}t+{num(start)}=0'),
   S('Buscamos dos números para factorizar','Deben sumar el coeficiente lineal en valor absoluto y multiplicar el término independiente.',f'{num(t1)}+{num(t2)}={num(sumr)}; {num(t1)}×{num(t2)}={num(start)}'),
   S('Igualamos cada factor a cero','Un producto solo puede dar cero si por lo menos uno de sus factores es cero.',f'(t−{num(t1)})(t−{num(t2)})=0 → t={num(t1)} o t={num(t2)}'),
   S('Interpretamos las dos soluciones','Las dos son positivas; las dos representan instantes posteriores a t=0, así que no descartamos una solo por haber encontrado la otra.')],
   'Encontrar una raíz no garantiza que sea el único encuentro. Una ecuación cuadrática puede aportar dos.',f'Sustituye t={num(t1)} y luego t={num(t2)} en ambas posiciones: en cada instante las posiciones coinciden.')
 if f=='plano-inclinado':
  v,g,sine=[F(d[k]) for k in ['speed','g','sinTheta']];a=g*sine;v2=v*v;den=2*a;s=v2/den
  return L('Hallar la distancia recorrida sobre el plano inclinado.', 'Sin rozamiento, la aceleración a lo largo del plano es a=g·senθ. Como empieza desde el reposo, podemos usar v²=2as. s es la longitud sobre la rampa, no la altura vertical.',[
   S('Calculamos la aceleración sobre el plano','No toda la gravedad acelera en la dirección de la rampa: se usa el factor seno que da el problema.',f'a={num(g)}×{num(sine)}={num(a)} m/s²'),
   S('Escribimos la relación entre rapidez y distancia','La fórmula completa es v²=v₀²+2as. Con v₀=0, el primer cuadrado desaparece.', 'v²=2as'),
   S('Despejamos la distancia','Para dejar s sola dividimos ambos lados entre 2a.', 's=v²/(2a)'),
   S('Calculamos numerador y denominador por separado','Primero el cuadrado de la rapidez y luego el doble de la aceleración.',f'v²={num(v)}×{num(v)}={num(v2)}; 2a=2×{num(a)}={num(den)}'),
   S('Hacemos la división','El resultado queda en metros porque trabajamos con m/s y m/s².',f's={num(v2)}/{num(den)}={num(s)} m')],
   'No confundas s con la altura. También evita reemplazar a por g: el factor seno cambia la aceleración sobre la rampa.',f'Al sustituir s en 2as, se recupera {num(v2)}, que es el cuadrado de la rapidez final.')
 if f=='campo-fuerza':
  force=F(d['force']);mc=F(d['chargeMc']);charge=mc/1000;E=force/charge
  return L('Calcular la fuerza que correspondería a una unidad de carga.', 'El campo eléctrico se define como E=F/q: fuerza dividida entre la carga de prueba. F se mide en newtons (N) y q en coulombs (C), por eso E queda en N/C. El prefijo mili significa dividir entre 1000.',[
   S('Identificamos fuerza y carga',f'F={num(force)} N y q={num(mc)} mC. La carga todavía no está en C.'),
   S('Convertimos milicoulombs a coulombs','1 C=1000 mC. Para pasar de mC a C, dividimos el número entre 1000.',f'q={num(mc)}/1000={num(charge)} C'),
   S('Sustituimos en la definición','La fuerza va arriba y la carga abajo. Invertir ese orden no da un campo eléctrico.',f'E=F/q={num(force)}/({num(charge)})'),
   S('Dividimos y expresamos la unidad','Dividir entre una carga pequeña puede dar un número mayor que el valor numérico de la fuerza.',f'E={num(E)} N/C')],
   'Usar el número de mC directamente produciría un resultado 1000 veces menor.',f'El campo sin redondear multiplicado por la carga en C recupera la fuerza: E×{num(charge)}={num(force)} N.')
 if f=='carga-corriente':
  ma,minutes=F(d['mA']),F(d['minutes']);amp=ma/1000;seconds=minutes*60;Q=amp*seconds
  return L('Calcular cuánta carga pasa durante el tiempo indicado.', 'Una corriente de 1 ampere significa que pasa 1 coulomb de carga en cada segundo: 1 A=1 C/s. Por eso, carga=corriente×tiempo. Antes de multiplicar hay que convertir mA a A y minutos a segundos.',[
   S('Convertimos la corriente','Mili es una milésima parte. Dividir entre 1000 transforma los mA en A.',f'I={num(ma)} mA={num(ma)}/1000={num(amp)} A'),
   S('Convertimos la duración','Cada minuto tiene 60 segundos. Multiplicamos el tiempo por 60.',f't={num(minutes)} min×60={num(seconds)} s'),
   S('Elegimos la operación','Si en cada segundo pasa I coulombs, en t segundos pasan I×t. No corresponde dividir.', 'Q=I·t'),
   S('Multiplicamos los valores convertidos','La unidad segundo se cancela: (C/s)·s=C.',f'Q={num(amp)}×{num(seconds)}={num(Q)} C'),
   S('Revisamos que respondimos una carga','El resultado se expresa en C, no en A ni en segundos. La corriente es la rapidez con que pasa la carga; la carga es el total que pasó.')],
   'Multiplicar mA por minutos sin convertir mezcla dos unidades que no son las de Q=It en coulombs.',f'Q/t={num(Q)}/{num(seconds)}={num(amp)} C/s, que coincide con la corriente en A.')
 if f=='serie-ohm':
  r1,r2,ma=[F(d[k]) for k in ['r1','r2','mA']];R=r1+r2;I=ma/1000;V=I*R
  return L('Hallar el voltaje necesario para que circule la corriente dada.', 'La ley de Ohm es V=I·R. V es voltaje, I corriente en amperes y R resistencia en ohms (Ω). En serie la corriente atraviesa una resistencia y después la otra: las resistencias se suman.',[
   S('Calculamos la resistencia total','Como la conexión es en serie, sumamos las dos resistencias directamente.',f'R total={num(r1)}+{num(r2)}={num(R)} Ω'),
   S('Convertimos la corriente a amperes','La fórmula necesita A, pero el dato está en mA. Dividimos entre 1000.',f'I={num(ma)}/1000={num(I)} A'),
   S('Escribimos la ley de Ohm con los datos','Multiplicamos la corriente por la resistencia total, no por una sola rama.',f'V={num(I)}×{num(R)}'),
   S('Calculamos el voltaje de la fuente','El resultado se expresa en voltios (V).',f'V={num(V)} V'),
   S('Comprobamos con las caídas en cada resistencia','Cada resistencia requiere I×R. La suma de ambas caídas tiene que ser el voltaje total.',f'V₁={num(I*r1)} V; V₂={num(I*r2)} V; suma={num(V)} V')],
   'La suma de inversos pertenece a resistencias en paralelo. Aquí dice serie: se suman R₁ y R₂.',f'V/R={num(V)}/{num(R)}={num(I)} A. Al multiplicar por 1000, recuperamos {num(ma)} mA.')
 if f=='conversion-longitud':
  feet,a=F(d['feet']),F(d['a']);s=feet*F('.3048');twice=2*a;inside=twice*s;v=math.sqrt(float(inside))
  return L('Encontrar la rapidez final después de recorrer una distancia conocida.', 'Como no se da el tiempo, usamos v²=v₀²+2as, que relaciona rapidez, aceleración y distancia. Parte del reposo significa v₀=0. La distancia debe estar en metros porque a está en m/s².',[
   S('Convertimos los pies a metros','El enunciado indica que cada pie equivale a 0,3048 m. Multiplicamos para obtener la longitud de todos los pies.',f's={num(feet)}×0,3048={num(s)} m'),
   S('Quitamos el término inicial','La rapidez inicial es 0 y su cuadrado también es 0.', 'v²=0²+2as → v²=2as'),
   S('Calculamos el doble de la aceleración','Este factor se multiplicará por la distancia ya convertida.',f'2a=2×{num(a)}={num(twice)}'),
   S('Calculamos el cuadrado de la rapidez','Aún no es la rapidez; el símbolo del lado izquierdo sigue siendo v².',f'v²={num(twice)}×{num(s)}={num(inside)}'),
   S('Sacamos la raíz cuadrada y redondeamos al final','Buscamos el número que multiplicado por sí mismo da el resultado anterior.',f'v=√{num(inside)}≈{num(v,2)} m/s')],
   'No marques el valor de v² como respuesta. Y no mezcles pies con m/s²: primero convierte la distancia.',f'Elevar la rapidez sin redondear al cuadrado debe devolver {num(inside)}. Las unidades finales son m/s.')
 raise ValueError('No physics lesson for '+f)
