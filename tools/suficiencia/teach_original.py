"""Worked lessons for the reviewed ABP selection. No sentence-splitting fallback."""
from teaching_common import lesson as L, step as S
import teach_math,teach_physics,teach_chemistry

LESSONS={}
def add(id,goal,basics,rows,mistake,check):
    steps=[]
    for row in rows.strip().split('\n'):
        parts=row.split('|',2);steps.append(S(*[x.strip() for x in parts]))
    LESSONS['abp-'+id]=L(goal,basics,steps,mistake,check)

def reused(module,id,family,**inputs):
    LESSONS['abp-'+id]=module.explain(family,inputs)

reused(teach_math,'13-04','identidad-cubica',**{'cubes':10,'ab':6,'offset':20})
reused(teach_math,'13-05','promedio',known=[60,50,40,20,20,10,10],size=8,mean='30.5')
LESSONS['abp-13-05']['steps'][1]['formula']='Suma total=30,5×8=244'
LESSONS['abp-13-05']['steps'][-1]['formula']='(210+34)/8=244/8=30,5'
reused(teach_math,'31-40','frecuencias',N=50,n1=6,n2=11,n3=8,n4=4)
LESSONS['abp-31-40']['steps'][0]['text']='f₁=n₁/total. Multiplicamos por total y dividimos entre f₁: total=n₁/f₁. Para dividir 6 entre 0,12, multiplicamos ambos por 100.'
LESSONS['abp-31-40']['steps'][0]['formula']='Total=6/0,12=600/12=50'
LESSONS['abp-31-40']['steps'][3]['formula']='f₃=8/50=0,16'
LESSONS['abp-31-40']['steps'][4]['formula']='n₃f₃=8×0,16=1,28'
LESSONS['abp-31-40']['steps'][5]['formula']='E=1,28+25=26,28'
reused(teach_math,'30-34','log-base-variable',**{'constant':12,'t':4})

add('05-01','Hallar los números que sobreviven a las tres operaciones.','∪ une listas sin repetir. ∩ conserva solo los elementos comunes. Aᶜ es el complemento de A: lo que está en U pero no en A.', '''
Unimos C y D | Copiamos los números de ambos conjuntos una sola vez, ordenados. | C∪D={−8,−7,−6,−5,−4,−3,−2,−1}
Construimos el complemento | De U quitamos −4, −3, −2 y −1, que son los elementos de A. | Aᶜ={−10,−9,−8,−7,−6,−5}
Resolvemos la primera intersección | Comparamos las dos listas y conservamos únicamente los números que aparecen en ambas. | (C∪D)∩Aᶜ={−8,−7,−6,−5}
Comparamos con B | B={−8,−4,−2,−1}. De los cuatro números anteriores, solo −8 está también en B. | Resultado={−8}
''','El complemento se calcula dentro de U. No cambia el signo de los números de A.','−8 pertenece a C∪D y a B, pero no pertenece a A: cumple las tres condiciones.')
add('05-04','Restar los polinomios y clasificar el resultado.','Un término es cada parte separada por + o −. Los términos semejantes tienen la misma letra con el mismo exponente; sus coeficientes se pueden sumar o restar.', '''
Escribimos la resta completa | El segundo polinomio debe ir entre paréntesis: estamos restando todo P. | Q−P=(5x³−2x−7)−(2x³+5x−3)
Quitamos el paréntesis con cuidado | Multiplicar por −1 cambia los tres signos de P, incluido el último. | 5x³−2x−7−2x³−5x+3
Reunimos términos semejantes | Calculamos por separado los coeficientes de x³, de x y las constantes. | (5−2)x³+(−2−5)x+(−7+3)=3x³−7x−4
Miramos los grados | Los exponentes de sus términos son 3, 1 y 0. Como son diferentes, el polinomio es heterogéneo. También es incompleto porque falta x².
''','El signo menos delante del paréntesis afecta a todos sus términos, no solo al primero.','El resultado tiene tres términos de grados distintos; corresponde a heterogéneo.')
add('05-05','Calcular el resto sin efectuar toda la división.','Si el divisor ax+b vale cero en x=−b/a, al evaluar allí la identidad P=divisor×cociente+resto solo queda el resto. Por eso evaluamos P(−b/a).', '''
Hallamos dónde se anula el divisor | Restamos b y dividimos entre a; se permite porque a≠0. | ax+b=0 → ax=−b → x=−b/a
Reemplazamos en los cuatro términos | Sustituimos todas las x, conservando potencias y signos. | P(−b/a)=a³(−b/a)³+3a²b(−b/a)²+3ab²(−b/a)−b³
Resolvemos potencias y cancelamos a | El cubo de un negativo es negativo; su cuadrado es positivo. | a³(−b³/a³)=−b³; 3a²b(b²/a²)=3b³; 3ab²(−b/a)=−3b³
Sumamos los términos | Todos contienen b³, por lo que sumamos sus coeficientes. | R=(−1+3−3−1)b³=−2b³
''','El último término del polinomio es −b³; no se convierte en +b³ al evaluar.','P también puede escribirse como (ax+b)³−2b³. Al anular ax+b queda exactamente −2b³.')
add('05-08','Contar las letras que comparten las dos frases.','Un conjunto no cuenta repeticiones. ∩ pide las letras presentes en ambas frases y las barras | | piden cuántos elementos tiene ese conjunto.', '''
Normalizamos las frases | Quitamos espacios y tratamos é como e, í como i, tal como pide el enunciado. No contamos una letra varias veces.
Escribimos las letras distintas de A | Recorremos «aprobel examen» y anotamos cada letra solo la primera vez. | A={a,p,r,o,b,e,l,x,m,n}
Escribimos las letras distintas de B | Recorremos «mi amigo se copio» con el mismo criterio. | B={m,i,a,g,o,s,e,c,p}
Buscamos las coincidencias | Las letras que están en ambas listas son estas cinco. | A∩B={a,e,m,o,p} → |A∩B|=5
''','No cuentes cuántas veces se repite la letra a en las frases: aquí cada letra distinta cuenta una vez.','La intersección tiene a, e, m, o y p: cinco elementos.')
add('05-09','Simplificar una división de fracciones algebraicas.','Dividir por una fracción equivale a multiplicar por su inversa. Solo se cancelan factores que multiplican a todo un numerador y a todo un denominador; no términos de una suma.', '''
Multiplicamos la primera parte | xy multiplica a los dos sumandos: x²·xy/y=x³ y y²·xy/x=y³. | [(x²/y+y²/x)xy]/(x+y)=(x³+y³)/(x+y)
Factorizamos la suma de cubos | La identidad A³+B³=(A+B)(A²−AB+B²) permite cancelar el factor x+y. | (x³+y³)/(x+y)=x²−xy+y²
Ponemos el divisor sobre un denominador común | Para tener x²y² abajo, multiplicamos los tres numeradores por y², x² y xy respectivamente. | 1/x²+1/y²−1/(xy)=(y²+x²−xy)/(x²y²)
Invertimos la fracción divisora | Conservamos la primera expresión y multiplicamos por la inversa de la segunda. | (x²−xy+y²)·[x²y²/(x²−xy+y²)]
Cancelamos el factor completo | El mismo bloque multiplica arriba y abajo. Su cociente vale 1. | Resultado=x²y²
Revisamos las restricciones | La simplificación vale en el dominio original: x≠0, y≠0, x+y≠0 y el divisor distinto de cero. No recupera valores donde la expresión inicial no existía.
''','No canceles x² con y² a través de signos + o −. Primero hay que factorizar.','Multiplicar el resultado x²y² por el divisor recupera x²−xy+y², la primera parte simplificada.')
add('10-33','Construir los dos números y sumarlos.','Un primo es un entero positivo con exactamente dos divisores positivos: 1 y él mismo. Para maximizar un número de tres cifras, elegimos primero la mayor centena posible.', '''
Buscamos el primer primo de dos cifras | El primer número de dos cifras es 10, pero se divide entre 2 y 5. El siguiente es 11, cuyos únicos divisores positivos son 1 y 11. | Menor primo=11
Elegimos la centena mayor | Las cifras pares son 0,2,4,6,8. La mayor que puede ir al principio es 8.
Completamos sin repetir | Después de usar 8, la mayor cifra disponible es 6; después, 4. | Mayor número=864
Sumamos ambos resultados | 864+10=874 y agregamos 1 más. | 864+11=875
''','888 es mayor, pero incumple que las tres cifras sean distintas.','864 usa tres cifras pares distintas; 11 es primo y tiene dos cifras.')
add('10-35','Comparar las cantidades antes de comparar las sumas.','En números positivos con potencias negativas de 10, un exponente más negativo representa una cantidad mucho menor. También se puede escribir todo con la misma potencia para comparar.', '''
Usamos la potencia 10⁻⁸ | Convertimos b y c a esa escala para comparar sus coeficientes. | a=6,37×10⁻⁸; b=5000×10⁻⁸; c=0,0007×10⁻⁸
Ordenamos las tres cantidades | Con la misma potencia basta comparar 5000, 6,37 y 0,0007. | b>a>c
Comparamos 2b con a+b | De b>a, sumamos b a los dos lados. Sumar la misma cantidad conserva la desigualdad. | b+b>a+b → 2b>a+b
Comparamos las otras dos sumas | De a>c, sumamos b a los dos lados y unimos ambos resultados. | a+b>b+c → 2b>a+b>b+c
''','No compares solo 6,37 con 5: las potencias de 10 son distintas.','Si restas b a la desigualdad encadenada recuperas b>a>c.')
add('10-36','Hacer dos divisiones: primero obtener C y R, después el resto de C/R.','En una división de polinomios dividimos los términos de mayor grado, multiplicamos ese resultado por todo el divisor y restamos. Repetimos hasta que el resto tenga grado menor que el divisor.', '''
Comenzamos la primera división | 2x⁴/x²=2x². Multiplicamos por x²−3 y restamos de P. | P−(2x⁴−6x²)=−3x³−9x²+10x+24
Dividimos el nuevo término principal | −3x³/x²=−3x. Restamos −3x(x²−3)=−3x³+9x. | (−3x³−9x²+10x+24)−(−3x³+9x)=−9x²+x+24
Terminamos de obtener C y R | −9x²/x²=−9. Restamos −9(x²−3)=−9x²+27. | C=2x²−3x−9; R=x−3
Ahora resolvemos lo que sí pregunta | Hay que dividir C por R=x−3. El resto de dividir un polinomio por x−3 es su valor en x=3. | C(3)=2·3²−3·3−9
Hacemos la cuenta final | Primero 3²=9, luego los productos y por último las restas. | 2·9−9−9=18−9−9=0
''','x−3 es el resto de la primera división, pero todavía no es la respuesta final.','C(3)=0 indica que C es divisible por x−3 sin resto.')
add('13-06','Hallar la razón x/y sin resolver las dos incógnitas.','Una razón es un cociente. Si ya hay una ecuación que relaciona x con y, podemos dividir ambos lados por el mismo factor no nulo.', '''
Escogemos la ecuación útil | La primera ya contiene las dos variables en forma multiplicativa. | bx−ay=0
Pasamos el término negativo al otro lado | Sumamos ay a ambos lados. | bx=ay
Dividimos entre by | Los denominadores del enunciado exigen b≠0 y además se da y≠0, así que podemos hacerlo. | bx/(by)=ay/(by)
Cancelamos los factores iguales | b se cancela a la izquierda; y se cancela a la derecha. | x/y=a/b
''','No hace falta usar todos los datos si una relación ya determina exactamente lo que piden.','Multiplicar x/y=a/b por by devuelve bx=ay, la condición inicial.')
add('13-07','Despejar x en la igualdad de dos fracciones.','Multiplicar en cruz elimina los denominadores cuando estos no son cero. Después agruparemos términos iguales y sacaremos factores comunes.', '''
Anotamos las restricciones | Los denominadores originales no pueden ser cero. | x≠ab; x≠a²
Multiplicamos en cruz | Cada numerador multiplica al denominador del otro lado. | (2ab−x)(x−a²)=(a²+b²−x)(x−ab)
Desarrollamos los dos productos | Cada término del primer paréntesis multiplica a cada término del segundo. | Izq.=2abx−2a³b−x²+a²x; der.=(a²+b²)x−ab(a²+b²)−x²+abx
Restamos y reunimos términos | Los −x² y los a²x se cancelan. Los términos restantes admiten un factor común. | b(a−b)x−ab(a²−b²)=0 → b(a−b)[x−a(a+b)]=0
Dejamos el factor de x igual a cero | b≠0 y a−b≠0 son condiciones dadas. Por tanto el factor restante debe ser cero. | x−a(a+b)=0 → x=a(a+b)
Volvemos a los denominadores | Al sustituir x, ambos quedan no nulos porque a y b no son cero. | x−ab=a²; x−a²=ab
''','No multipliques en cruz y luego olvides revisar los denominadores de la expresión original.','La solución a(a+b) no anula ninguno de los dos denominadores.')
add('13-09','Decidir si existe algún número real que cumpla la desigualdad.','Una desigualdad pide valores que hagan verdadera una comparación. Todo cuadrado de un número real es mayor o igual que cero; usaremos esa idea para descartar soluciones.', '''
Multiplicamos los paréntesis | x multiplica a 2x y a 3; 1 multiplica a 2x y a 3. | (x+1)(2x+3)=2x²+3x+2x+3=2x²+5x+3
Llevamos todo al lado izquierdo | Restamos x²+4x+1 a ambos lados. | x²+x+2<0
Completamos un cuadrado | Como (x+1/2)²=x²+x+1/4, faltan 2−1/4=7/4. | (x+1/2)²+7/4<0
Evaluamos si es posible | El cuadrado no baja de 0. Al agregar 7/4, toda la expresión es positiva; nunca puede ser menor que 0. | Solución=∅
''','No basta encontrar números que anulen una expresión; aquí se pregunta dónde es negativa.','Su valor mínimo es 7/4, alcanzado en x=−1/2. Incluso allí sigue siendo positivo.')
add('13-10','Resolver primero el logaritmo exterior y luego el interior.','log_b(A)=c significa bᶜ=A. Además log₁₀(x³)=3log₁₀x cuando x>0. Un logaritmo real exige argumento positivo.', '''
Quitamos el logaritmo exterior | Si log₂(A)=1, entonces A=2¹=2. | log₁₀(x³)−(log₁₀x)²=2
Cambiamos una expresión larga por t | Llamamos t a log₁₀x; el logaritmo del cubo se convierte en 3t. | 3t−t²=2
Ordenamos y factorizamos | Pasamos todo a un lado y multiplicamos por −1. Buscamos dos números que sumen 3 y multipliquen 2. | t²−3t+2=0 → (t−1)(t−2)=0
Resolvemos los dos factores | Si un producto es cero, al menos un factor es cero. | t=1 o t=2
Volvemos a x | t era log₁₀x. Por la definición de logaritmo, x=10ᵗ. | x=10¹=10 o x=10²=100
Comprobamos el dominio | Ambos x son positivos y producen argumento exterior 2, también positivo. | Para t=1: 3−1=2; para t=2: 6−4=2
''','No confundas log(x³)=3log x con (log x)³: son operaciones diferentes.','En ambos casos el logaritmo exterior es log₂2=1, como pide el ejercicio.')
add('18-41','Deducir los valores de verdad a partir de una proposición falsa.','¬ invierte V y F. A∨B es falsa solo si ambos son falsos. A→B es falsa únicamente cuando A es verdadera y B falsa.', '''
Separamos la disyunción | Como toda la expresión con ∨ es falsa, sus dos partes deben ser falsas. | p→¬q=F; ¬r→s=F
Analizamos la primera implicación | Para que sea falsa, p debe ser V y ¬q debe ser F. | p=V; ¬q=F
Quitamos la negación de q | Si ¬q es falsa, q es verdadera. | q=V
Analizamos la segunda implicación | Para que ¬r→s sea falsa, ¬r debe ser V y s F. | ¬r=V; s=F → r=F
Ordenamos como pide el enunciado | No escribimos los valores en el orden de las negaciones, sino p,q,r,s. | p,q,r,s=V,V,F,F
''','Que una implicación sea falsa no significa que ambos lados sean falsos: debe ser V→F.','Las dos implicaciones quedan V→F; su disyunción es F∨F=F.')
add('18-42','Distinguir descripción por comprensión de descripción por extensión.','Un mismo conjunto puede describirse mediante una lista o mediante la propiedad que cumplen sus elementos.', '''
Identificamos qué se pregunta | La palabra clave es comprensión: buscamos una regla para reconocer elementos, no una lista.
Entendemos la regla | Una propiedad dice qué condición debe cumplir cada elemento para pertenecer al conjunto.
Contrastamos con una lista | Ejemplo didáctico: «enteros pares entre 1 y 6» es una regla; {2,4,6} enumera los elementos del mismo conjunto.
Elegimos la definición | Corresponde a la alternativa que proporciona una regla que permite identificar sus elementos.
''','Enumerar uno por uno corresponde a extensión, aunque los elementos sean correctos.','Si la descripción permite decidir si un elemento pertenece sin listar todos, usa comprensión.')
add('26-38','Simplificar P/Q y encontrar el término que no contiene x ni y.','El término independiente es la constante: la parte sin variables. Para verlo con claridad llamamos z=xy; así x²y²=z².', '''
Dividimos multiplicando por la inversa | Ponemos z=xy y damos vuelta a Q. | P/Q=[(z²−1)/4]·[(3z+6)/(z+1)]
Factorizamos la diferencia de cuadrados | z²−1=(z−1)(z+1). Cancelamos z+1 donde el cociente original está definido. | P/Q=(z−1)(3z+6)/4
Desarrollamos el producto | Multiplicamos cada término del primer factor por cada término del segundo. | (3z²+6z−3z−6)/4=(3z²+3z−6)/4
Separamos la constante | Los dos primeros términos contienen z; el último no contiene letras. | Término independiente=−6/4=−3/2
''','No busques solo el término independiente de P: lo piden después de dividir entre Q.','Volviendo a z=xy, queda (3/4)x²y²+(3/4)xy−3/2. La constante es −3/2.')
add('26-40','Aprovechar que dos expresiones con raíz son recíprocas.','Si dos números multiplicados dan 1, uno es el inverso del otro. Además (a+b)(a−b)=a²−b², una diferencia de cuadrados.', '''
Multiplicamos los conjugados | Los términos cruzados se cancelan y queda el cuadrado de 2 menos el cuadrado de √3. | (2+√3)(2−√3)=4−3=1
Usamos una letra más corta | Sea t=2+√3. Entonces 2−√3=1/t. | Numerador=t³−1/t³; denominador=t⁶−1
Unimos el numerador en una fracción | Para poner denominador t³, escribimos t³ como t⁶/t³. | t³−1/t³=(t⁶−1)/t³
Dividimos por el denominador original | Cancelamos el factor t⁶−1 de arriba y abajo; t>1, por eso no es cero. | [(t⁶−1)/t³]/(t⁶−1)=1/t³
Regresamos a la expresión inicial | Como 1/t=2−√3, su cubo es la respuesta. | Resultado=(2−√3)³
''','No es necesario desarrollar sextas potencias. Reconocer el producto igual a 1 reduce toda la cuenta.','Multiplicar el resultado por el denominador reconstruye el numerador.')
add('30-35','Reconocer las dos ramas de la estadística por su función.','La estadística trabaja con datos. Una cosa es describir los datos observados y otra sacar conclusiones sobre un grupo mayor a partir de una muestra.', '''
Entendemos describir | Organizar, resumir y presentar los datos que ya tenemos corresponde a estadística descriptiva.
Entendemos inferir | Obtener conclusiones sobre una población a partir de una muestra corresponde a estadística inferencial.
Comparamos con un ejemplo | Ejemplo didáctico: calcular el promedio de los estudiantes encuestados describe esa muestra; usarla para estimar una característica de todos los estudiantes es inferir.
Elegimos la pareja | Las dos funciones anteriores dan los nombres de las dos grandes ramas. | Descriptiva e inferencial
''','Una tabla o un promedio no representa por sí solo una inferencia sobre toda una población.','La respuesta debe incluir ambas funciones: resumir datos e inferir desde una muestra.')
add('36-61','Encontrar los múltiplos que aparecen en ambos conjuntos.','5k con k=1,2,3,… significa multiplicar 5 por cada entero positivo. La intersección ∩ conserva los elementos compartidos por las dos listas.', '''
Desarrollamos A | Sustituimos k por 1,2,3,4,… | A={5,10,15,20,25,30,…}
Desarrollamos B | Hacemos lo mismo, ahora multiplicando por 10. | B={10,20,30,40,…}
Comparamos las listas | Todo número 10k también se escribe como 5·(2k). Por tanto, cada elemento de B ya está en A. | B⊂A
Escribimos la intersección | Como B está contenido en A, lo común es todo B. Los puntos suspensivos indican que la lista continúa. | A∩B={10,20,30,…}
''','No incluyas 5: es múltiplo de 5, pero no es múltiplo positivo de 10.','Cada número de la respuesta es divisible entre 5 y entre 10.')
add('36-62','Construir los conjuntos antes de evaluar la afirmación.','Un complemento se toma dentro de U. El símbolo ⊂ indica inclusión: cada elemento del conjunto de la izquierda debe estar en el de la derecha.', '''
Construimos B y C dentro de U | B contiene los enteros del universo menores que 8. x²=4 da ±2, pero solo 2 pertenece a U. | B={1,2,3,4,5,6,7}; C={2}
Identificamos los primos | 1 no es primo. Los primos de U son 2,3,5,7,11,13,17,19. Los otros números forman Aᶜ.
Intersecamos Aᶜ con B | De B retiramos 2,3,5 y 7 porque son primos. | Aᶜ∩B={1,4,6}
Comparamos con Cᶜ | Cᶜ contiene todos los números de U excepto 2. Por eso incluye 1,4 y 6, además de otros. | Aᶜ∩B⊂Cᶜ
''','−2 resuelve x²=4, pero no pertenece al universo dado. No puede incluirse en C.','Ninguno de 1,4,6 es 2; los tres están en Cᶜ.')
add('36-64','Contar correctamente los elementos de una lista.','Los puntos suspensivos indican que la secuencia continúa con el mismo patrón. El cero también es un elemento y debe contarse.', '''
Desarrollamos la lista | Entre 0 y 5 escribimos todos los enteros consecutivos. | {0,1,…,5}={0,1,2,3,4,5}
Contamos uno por uno | Al cero le corresponde el primer lugar, no el lugar cero del conteo. | 0: primero; 1: segundo; 2: tercero; 3: cuarto; 4: quinto; 5: sexto
Revisamos si hay repeticiones | Son seis números distintos, así que ninguno debe eliminarse del conteo.
Seleccionamos el conjunto | La lista que empieza en 0 y termina en 5 tiene exactamente seis elementos. | Cantidad=6
''','El último número de una lista no siempre coincide con la cantidad de elementos.','5−0+1=6 confirma el conteo incluyendo ambos extremos.')
add('36-65','Leer la definición del conjunto de los números racionales.','ℤ significa enteros: …,−2,−1,0,1,2,… ℚ significa racionales. Un racional puede escribirse como una fracción de dos enteros con denominador no nulo.', '''
Identificamos el numerador | p puede ser cualquier entero: positivo, negativo o cero.
Identificamos el denominador | q también es entero, pero no puede ser cero porque no está definida la división entre cero. | q≠0
Leemos la notación completa | El signo : se interpreta como «tales que». | ℚ={p/q:p,q∈ℤ; q≠0}
Verificamos con ejemplos | Ejemplos didácticos: −3/2 es racional; 4 también, porque 4=4/1; 0 también, porque 0=0/1.
''','El numerador sí puede ser cero. La restricción distinta de cero corresponde al denominador.','La opción correcta permite enteros de ambos signos y exige q≠0.')
add('36-67','Distinguir un decimal que termina de uno que repite un bloque para siempre.','En la división decimal, si reaparece un resto, vuelven a aparecer las mismas cifras. Eso produce un decimal periódico.', '''
Empezamos a dividir 2 entre 7 | Como 2<7, escribimos 0 y agregamos decimales. 20÷7 da 2 y sobra 6. | 2/7=0,2…
Continuamos con los restos | Cada resto se multiplica por 10 para obtener la cifra siguiente. | 60÷7→8, resto 4; 40÷7→5, resto 5; 50÷7→7, resto 1
Cerramos el bloque repetido | Seguimos hasta volver al resto inicial 2. Desde allí se repetirá todo el proceso. | 10÷7→1, resto 3; 30÷7→4, resto 2
Leemos el decimal | Las seis cifras obtenidas forman el bloque que se repite sin terminar. | 2/7=0,285714285714…
''','Periódico no significa que cualquier cifra se repita alguna vez; debe repetirse un mismo bloque indefinidamente.','El resto no llega a cero y vuelve a 2: el decimal no termina y repite 285714.')
add('36-69','Reconocer la estructura de la notación científica.','La notación científica expresa números como a×10ⁿ. El coeficiente a y la potencia de 10 se multiplican; n es un entero.', '''
Separamos las dos partes | a es el coeficiente; 10ⁿ indica una potencia de diez. | a×10ⁿ
Leemos la operación | El signo × indica producto. No es una suma ni un cociente.
Revisamos la forma normalizada | Para una cantidad no nula, el tamaño del coeficiente debe estar entre 1 incluido y 10 sin incluir. | 1≤|a|<10
Vemos un ejemplo de la estructura | Ejemplo didáctico: 3200=3,2×10³. El coeficiente es 3,2 y el exponente es 3.
''','El exponente puede ser negativo o cero; tiene que ser entero, no necesariamente positivo.','La alternativa que habla de producto de un número y una potencia de 10 describe esa estructura.')
add('36-71','Revisar los requisitos de la notación científica normalizada.','La forma es a×10ⁿ, donde n es entero y 1≤|a|<10. El valor absoluto |a| mide el tamaño del coeficiente sin su signo.', '''
Identificamos las partes | En −9,9×10⁻³, el coeficiente es −9,9 y el exponente es −3. | a=−9,9; n=−3
Revisamos el coeficiente | Quitamos el signo solo para comprobar su tamaño. 9,9 está entre 1 y 10. | 1≤9,9<10
Revisamos la potencia | La base es 10 y −3 es un número entero. Ambos requisitos se cumplen.
Interpretamos el número | 10⁻³ equivale a dividir entre 1000. El signo negativo del coeficiente se conserva. | −9,9×10⁻³=−0,0099
''','Un coeficiente negativo es válido. La condición entre 1 y 10 se aplica a su valor absoluto.','La expresión cumple los tres requisitos: base 10, exponente entero y coeficiente normalizado.')
add('36-73','Multiplicar, reducir y solo después contar los términos.','Los términos semejantes tienen la misma potencia de x. Después de multiplicar, algunos pueden cancelarse; no debemos contarlos antes de simplificar.', '''
Multiplicamos los seis pares | Cada término de A multiplica a 5x y a 7. | 25x³+35x²−35x²−49x−30x−42
Reducimos el producto | Los términos x² se anulan; los términos en x se suman entre sí. | AB=25x³−79x−42
Sumamos C | Agregamos 74x+38 y volvemos a reunir términos semejantes. | AB+C=25x³+(−79+74)x+(−42+38)
Contamos el resultado reducido | Quedan un término cúbico, uno lineal y una constante. | 25x³−5x−4: 3 términos
''','Los seis productos iniciales no son seis términos finales: varios se juntan o se cancelan.','Los coeficientes finales son 25, −5 y −4, ninguno es cero.')
add('36-74','Obtener el cociente de dos divisiones sucesivas.','El cociente es el resultado que multiplica al divisor; el resto es lo que sobra. Aquí se pide el cociente de dividir el primer cociente otra vez por x−3.', '''
Dividimos el primer término | 4x³/x=4x². Restamos 4x²(x−3)=4x³−12x² del dividendo. | Queda −5x²+7x−4
Seguimos la primera división | −5x²/x=−5x. Restamos −5x(x−3)=−5x²+15x. | Queda −8x−4
Obtenemos el primer cociente | −8x/x=−8. Al restar −8(x−3)=−8x+24 queda −28. | C=4x²−5x−8; primer resto=−28
Dividimos C otra vez por x−3 | 4x²/x=4x. Al restar 4x(x−3)=4x²−12x, queda 7x−8.
Terminamos la segunda división | 7x/x=7. Restamos 7(x−3)=7x−21 y queda 13. | Segundo cociente=4x+7; segundo resto=13
''','La pregunta pide el segundo cociente, 4x+7, no el segundo resto, 13.','(x−3)(4x+7)+13=4x²−5x−8, que es C.')
add('37-77','Simplificar primero P y Q y después dividir.','Para x>0, x=(√x)², así que x/√x=√x. También (u−v)(u+v)=u²−v².', '''
Simplificamos P | El primer factor vale √x−√x=0; todo ese producto vale cero. | P=0+x⁴=x⁴
Desarrollamos Q | (x−3)²=x²−6x+9 y 8(x−1)=8x−8. Sumamos términos semejantes. | Q=x²+2x+1
Construimos el numerador | Hay que restar todo Q: sus tres signos cambian. | P−Q=x⁴−x²−2x−1
Dividimos por R | x⁴/x²=x². Restamos x²(x²+x+1) y queda −x³−2x²−2x−1.
Seguimos la división | −x³/x²=−x. Al restar −x(x²+x+1), queda −x²−x−1, que es −1 veces R. | Cociente=x²−x−1; resto=0
''','(x−3)² no es x²+9: falta el término cruzado −6x.','Multiplica (x²+x+1)(x²−x−1): debe dar x⁴−x²−2x−1.')
add('41-22','Reconocer qué distingue a un número primo.','Un entero positivo mayor que 1 es primo si solo tiene como divisores positivos 1 y él mismo. Es compuesto si tiene otros divisores.', '''
Limitamos el conjunto | La pregunta habla de enteros positivos: 1,2,3,… No incluye negativos ni fracciones.
Recordamos la excepción | 1 tiene un solo divisor positivo, por eso no es primo ni compuesto.
Clasificamos los mayores que 1 | Si tienen algún divisor intermedio son compuestos; si no lo tienen, son primos.
Leemos la alternativa | «Distinto de 1 y no compuesto» elimina la excepción y deja exactamente los primos.
''','Decir solo «no es compuesto» incluiría al 1, que no es primo.','2 cumple: es positivo, distinto de 1 y no compuesto; tiene divisores 1 y 2.')
add('41-24','Dividir un polinomio por un monomio.','Dividimos cada término del numerador entre 6x². Al dividir potencias de la misma base, restamos exponentes: xᵐ/xⁿ=xᵐ⁻ⁿ, con x≠0.', '''
Separamos la división | El denominador se aplica a los tres términos. | 24x⁴/(6x²)−18x³/(6x²)+12x²/(6x²)
Resolvemos el primer término | 24/6=4 y x⁴/x²=x². | Primer resultado=4x²
Resolvemos el segundo término | −18/6=−3 y x³/x²=x. | Segundo resultado=−3x
Resolvemos el último y reunimos | 12/6=2 y x²/x²=1. | Resultado=4x²−3x+2
''','No restes exponentes de bases diferentes ni dividas solo el primer término.','6x²(4x²−3x+2)=24x⁴−18x³+12x², el numerador inicial.')
add('41-25','Dividir coeficientes fraccionarios y potencias de x.','Dividir entre 5/2 es multiplicar por 2/5. Las potencias de x se dividen restando exponentes, con x≠0.', '''
Aplicamos el divisor a cada término | Separamos tres cocientes, cada uno con denominador (5/2)x³.
Dividimos el primer término | Multiplicamos el coeficiente por 2/5 y restamos 5−3 en el exponente. | (15/2)·(2/5)=3; x⁵/x³=x² → 3x²
Dividimos el segundo término | Conservamos el signo negativo y restamos 4−3. | (−5/2)·(2/5)=−1; x⁴/x³=x → −x
Dividimos el último término | Las dos potencias x³ se cancelan. | (45/2)·(2/5)=9; x³/x³=1 → 9
Reunimos las tres partes | Sumamos los cocientes obtenidos sin cambiar sus signos. | 3x²−x+9
''','Dividir entre una fracción no es multiplicar por esa misma fracción: hay que invertirla.','Multiplicar 3x²−x+9 por (5/2)x³ devuelve el numerador.')
add('41-26','Interpretar dos inclusiones en sentidos opuestos.','A⊆B significa que todo elemento de A está también en B. No significa que B tenga necesariamente elementos extra.', '''
Leemos la primera condición | No puede haber un elemento de A que falte en B. | A⊆B
Leemos la segunda condición | Tampoco puede haber un elemento de B que falte en A. | B⊆A
Juntamos ambas condiciones | Ningún conjunto puede tener un elemento que el otro no tenga. Por tanto, contienen exactamente los mismos elementos.
Concluimos la relación | Esa coincidencia de elementos es la definición de igualdad de conjuntos. | A=B
''','Una sola inclusión no demuestra igualdad; aquí se dan ambas.','Si A y B fueran diferentes, al menos un elemento aparecería solo en uno, contradiciendo una de las condiciones.')
add('41-30','Usar diferencia de cuadrados y controlar los signos.','El producto (A+B)(A−B) vale A²−B². Aquí A=ax y el bloque B es by−cz completo, no solo by.', '''
Reconocemos los bloques | El segundo paréntesis es ax−(by−cz), porque −(by−cz)=−by+cz. | (ax+by−cz)(ax−by+cz)=(ax)²−(by−cz)²
Elevamos el primer bloque | El cuadrado afecta tanto a a como a x. | (ax)²=a²x²
Desarrollamos el segundo cuadrado | (u−v)²=u²−2uv+v². | (by−cz)²=b²y²−2bcyz+c²z²
Aplicamos el signo menos exterior | Cambian los tres signos del cuadrado que estamos restando. | a²x²−b²y²+2bcyz−c²z²−2bcyz
Cancelamos los términos cruzados | +2bcyz y −2bcyz suman cero. | Resultado=a²x²−b²y²−c²z²
''','El menos delante del cuadrado cambia también el signo de −2bcyz: pasa a ser positivo.','Los únicos términos que sobreviven son los tres cuadrados; no queda ningún término yz.')
add('21-31','Reconocer el cuadrado de una suma de tres términos con signos.','(A+B+C)² contiene A²+B²+C²+2AB+2AC+2BC. Los productos cruzados indican qué signos deben llevar las tres bases.', '''
Leemos las bases de los cuadrados | p²,q²,r² provienen de bases p,q,r, pero todavía debemos decidir sus signos.
Revisamos el término entre p y q | +2pq exige que p y q tengan el mismo signo. Elegimos ambos positivos.
Revisamos los productos con r | −2pr y −2qr exigen que r tenga signo contrario a p y q. | Bases con signos: p, q, −r
Escribimos el cuadrado | La suma de esas tres bases se eleva al cuadrado. | (p+q−r)²
Desarrollamos para comprobar | Los cuadrados son positivos y los productos con −r son negativos. | p²+q²+r²+2pq−2pr−2qr
''','No decidas los signos mirando solo los cuadrados: (−r)² también es r². Los productos cruzados son la pista.','La expansión reproduce los seis términos del enunciado, con sus mismos signos.')
add('21-32','Reducir las ecuaciones y resolver por sustitución.','Una solución del sistema debe cumplir ambas ecuaciones al mismo tiempo. Primero quitamos paréntesis; después despejamos una letra y la reemplazamos en la otra ecuación.', '''
Desarrollamos la primera ecuación | Distribuimos 12, −8 y 2 sobre cada término de sus respectivos paréntesis. | 12x+24y−16x−8y=10x+12y
Reunimos términos y despejamos y | A la izquierda quedan −4x+16y. Restamos 10x y 12y a ambos lados. | −14x+4y=0 → 4y=14x → y=7x/2
Simplificamos la segunda ecuación | Dividimos ambos lados entre 20. | 2x+y=−10/20=−1/2
Sustituimos la expresión de y | Sumamos usando denominador 2: 2x=4x/2. | 2x+7x/2=−1/2 → 11x/2=−1/2
Despejamos x y calculamos y | Multiplicamos por 2 y dividimos entre 11; luego usamos y=7x/2. | 11x=−1 → x=−1/11; y=7(−1/11)/2=−7/22
Comprobamos ambas ecuaciones reducidas | Es más sencillo verificar estas formas equivalentes. | −14(−1/11)+4(−7/22)=0; 2(−1/11)−7/22=−11/22=−1/2
''','El −8 multiplica también a +y: produce −8y, no +8y.','La pareja satisface las dos ecuaciones, no solo la segunda.')
add('21-35','Factorizar en cuatro factores lineales y después sumarlos.','Lineal respecto de a significa que a aparece a la potencia 1. Mónico significa que su coeficiente es 1. Usaremos dos veces A²−B²=(A−B)(A+B).', '''
Reescribimos el término final | (b²−d²)²=(b²+d²)²−4b²d². Esto permite completar un cuadrado en a². | Expresión=[a²−(b²+d²)]²−(2bd)²
Aplicamos diferencia de cuadrados | Restamos y sumamos 2bd al bloque a²−b²−d². | [a²−b²−d²−2bd][a²−b²−d²+2bd]
Reconocemos dos cuadrados más | b²+2bd+d²=(b+d)² y b²−2bd+d²=(b−d)². | [a²−(b+d)²][a²−(b−d)²]
Factorizamos cada diferencia | Cada uno de los dos factores se convierte en dos factores lineales mónicos. | (a−b−d)(a+b+d)(a−b+d)(a+b−d)
Sumamos los cuatro factores | Cada factor aporta una a; las dos +b cancelan las dos −b y ocurre lo mismo con d. | Suma=4a
''','La pregunta pide la suma de los factores, no su producto, que sería el polinomio original.','Los cuatro factores tienen coeficiente de a igual a 1, por lo que son mónicos como se pidió.')
add('21-39','Hallar dos raíces y restar la menor de la mayor.','Una diferencia de cuadrados se factoriza como (A−B)(A+B). Si el producto es cero, se iguala a cero cada factor por separado.', '''
Formamos la resta de los bloques | El signo menos cambia todos los signos del segundo paréntesis. | (2x−5)−(5x−3)=−3x−2
Formamos la suma de los bloques | Sumamos términos en x y constantes. | (2x−5)+(5x−3)=7x−8
Resolvemos cada factor | En el primero sumamos 2 y dividimos entre −3; en el segundo sumamos 8 y dividimos entre 7. | −3x−2=0 → x=−2/3; 7x−8=0 → x=8/7
Ordenamos las raíces | Una es negativa y otra positiva; la mayor es 8/7. | Diferencia=8/7−(−2/3)=8/7+2/3
Restamos usando denominador común | El denominador común es 21: multiplicamos 8 por 3 y 2 por 7. | (24+14)/21=38/21
''','Restar un número negativo equivale a sumar su valor positivo.','38/21 es positivo y mide la distancia entre −2/3 y 8/7 en la recta numérica.')

reused(teach_physics,'05-11','conversion-aceleracion',speedCms=180000,minutes=30)
reused(teach_physics,'05-16','encuentro',distance=13,va=5,vb=8,hours=3)
reused(teach_physics,'11-17','alcance',gap=100,aFast=7,aSlow=5)
reused(teach_physics,'11-19','fuerza-neta',m=1200,speedKmh=144,time=8)
reused(teach_physics,'13-13','ondas',frequency=500,wavelength=2.5)
reused(teach_physics,'13-15','campo-distancia',field=2,ratio=2)
reused(teach_physics,'13-19','paralelo',resistors=[3,4,5])
reused(teach_physics,'13-20','temperatura',fahrenheit=104)
reused(teach_physics,'17-40','conversion-longitud',feet=150,a=8.5)
reused(teach_physics,'34-27','vectores',x=3,y=4)
reused(teach_physics,'34-28','tiro-vertical',height=50,initialVelocity=15,g=10)
reused(teach_physics,'34-29','dos-encuentros',va=8,vb=2,initial=5)
reused(teach_physics,'43-40','plano-inclinado',speed=10,g=9.8,sinTheta=2**.5/2)
reused(teach_physics,'21-27','lente-convergente',focal=10,object=30)
reused(teach_physics,'21-28','campo-fuerza',force=2,chargeMc=24)
reused(teach_physics,'21-29','carga-corriente',mA=500,minutes=4)
reused(teach_physics,'21-30','serie-ohm',r1=120,r2=100,mA=55)

add('05-12','Calcular el tiempo de cada tramo y sumarlos.','En el tramo con aceleración constante, la velocidad media es (v₀+v)/2. En el tramo de rapidez constante, tiempo=distancia/rapidez. No podemos usar una única rapidez para toda la carrera.', '''
Separamos los dos tramos | Primero recorre 40 m acelerando desde v₀=0 hasta 2√10 m/s. Después recorre 60 m con esa rapidez constante.
Hallamos la velocidad media inicial | Como acelera uniformemente, promediamos la velocidad del principio y la del final. | vmedia=(0+2√10)/2=√10 m/s
Calculamos el primer tiempo | Dividimos distancia entre velocidad media. Para quitar la raíz del denominador multiplicamos arriba y abajo por √10. | t₁=40/√10=40√10/10=4√10 s
Calculamos el segundo tiempo | Ahora la rapidez ya no cambia, por lo que usamos 2√10 directamente. | t₂=60/(2√10)=30/√10=3√10 s
Sumamos los tiempos | Ambos resultados contienen √10, así que sumamos sus coeficientes. | t=4√10+3√10=7√10 s
''','Usar 2√10 en los primeros 40 m supondría que ya llevaba esa rapidez desde el inicio.','Los tramos suman 40+60=100 m y los tiempos se suman porque ocurren uno después del otro.')
add('05-13','Reconocer qué energía permanece constante.','K representa energía cinética, asociada al movimiento. U representa energía potencial. La energía mecánica es la suma K+U.', '''
Identificamos la suma nombrada | El enunciado suma la energía potencial y la cinética. | E_mecánica=K+U
Leemos las condiciones | No hay resistencia del aire ni otras fuerzas disipativas y tampoco se añade energía externa.
Interpretamos permanece constante | K puede aumentar mientras U disminuye, o al revés; lo que se conserva es su suma. | K_inicial+U_inicial=K_final+U_final
Nombramos el principio | La conservación de esa suma se llama conservación de la energía mecánica.
''','No implica que la energía cinética y la potencial permanezcan constantes por separado.','La alternativa correcta debe nombrar la energía mecánica, que reúne las dos del enunciado.')
add('05-14','Calcular el peso y expresarlo en kilogramo-fuerza.','La masa se mide en kg y el peso es una fuerza. Primero usamos P=mg para obtener newtons; luego convertimos con la equivalencia de kgf que proporciona la pregunta.', '''
Identificamos los datos | m es masa y g es aceleración gravitatoria. | m=6 kg; g=9,81 m/s²
Calculamos el peso en newtons | Multiplicamos masa por gravedad. kg·m/s² corresponde a N. | P=6·9,81=58,86 N
Usamos la equivalencia | Cada 9,81 N forman 1 kgf. Por eso dividimos los newtons entre 9,81. | P=58,86/9,81=6 kgf
Escribimos con la unidad solicitada | La alternativa expresa el valor con dos decimales. | P=6,00 kgf
''','6 kg es masa; 6 kgf es fuerza. Que aquí coincidan los números no vuelve iguales las unidades.','6 kgf×9,81 N/kgf=58,86 N: recuperamos el peso calculado.')
add('05-15','Calcular por cuánto se multiplica la energía, no la energía final.','La energía cinética es K=mv²/2. Si solo cambia la rapidez y la masa se mantiene, el cambio depende del cuadrado de esa rapidez.', '''
Escribimos la energía inicial | La masa y la rapidez originales pueden representarse como m y v. | K₁=mv²/2
Expresamos triplicar la rapidez | La nueva rapidez es 3v, no v+3. | K₂=m(3v)²/2
Resolvemos el cuadrado | (3v)²=3²v²=9v², porque el 3 también se eleva al cuadrado. | K₂=9mv²/2=9K₁
Leemos el factor pedido | El cociente final/inicial es 9. No hace falta calcular por separado ambas energías. | K₂/K₁=9
''','Triplicar la rapidez no triplica la energía cinética: la multiplica por nueve.','La masa 55 kg aparece en ambas energías y se cancela al calcular su razón.')
add('13-11','Despejar el coeficiente de dilatación a partir del alargamiento.','La dilatación lineal cumple ΔL=αL₀ΔT. Δ significa cambio: valor final menos inicial. α indica cuánto se alarga la barra por unidad de longitud y de temperatura.', '''
Calculamos cuánto creció | Restamos la longitud inicial de la final, no usamos toda la longitud final como aumento. | ΔL=10,20−10,00=0,20 cm
Identificamos los otros datos | L₀ es la longitud antes de calentar; ΔT ya está dado como aumento. | L₀=10,00 cm; ΔT=80 °C
Despejamos α | Como L₀ y ΔT multiplican a α, pasan dividiendo al otro lado. | α=ΔL/(L₀ΔT)
Sustituimos y operamos | Las dos longitudes están en cm, así que esa unidad se cancela. | α=0,20/(10·80)=0,20/800=0,00025 °C⁻¹
''','No uses 10,20 como ΔL ni cambies centímetros a metros solo en una de las longitudes.','0,00025·10·80=0,20 cm, el aumento observado.')
add('13-14','Encontrar primero la imagen y después su aumento.','En 1/f=1/s+1/s′, f es distancia focal, s la del objeto y s′ la de la imagen. El aumento lateral es m=−s′/s. La lente divergente tiene f negativa en esta convención.', '''
Copiamos datos con sus signos | El objeto está a distancia positiva; la distancia focal divergente es negativa. | f=−12 cm; s=12 cm
Despejamos la inversa de s′ | Restamos 1/s a ambos lados de la ecuación de lente. | 1/s′=1/f−1/s=−1/12−1/12=−2/12=−1/6
Invertimos para obtener s′ | Si 1/s′=−1/6, entonces s′=−6. Conservamos el signo. | s′=−6 cm
Calculamos el aumento | La fórmula tiene un menos exterior, que cambia el signo negativo de s′. | m=−(−6)/12=6/12=0,5
Interpretamos la cantidad | El aumento es una razón de tamaños, por eso no lleva cm. Su magnitud 0,5 indica la mitad del tamaño del objeto.
''','s′=−6 cm es un paso intermedio; la pregunta pide el aumento 0,5.','Al reemplazar f, s y s′: −1/12=1/12−1/6, la ecuación de lente se cumple.')
add('17-31','Reconocer la operación de medir.','Una magnitud es una propiedad que puede cuantificarse. Para medirla necesitamos una referencia o patrón con el cual compararla.', '''
Leemos el verbo del enunciado | Dice comparar una magnitud con un patrón. Esa comparación es la pista principal.
Entendemos el patrón | El patrón aporta la unidad de referencia. No basta decir que una cosa es grande o pequeña sin comparación.
Lo aplicamos a un ejemplo | Ejemplo didáctico: comparar una longitud con el metro permite expresar cuántos metros mide.
Nombramos la operación | Comparar de esa manera para asignar un valor es medir.
''','Estimar puede ser una aproximación; la definición dada corresponde específicamente a medir.','La respuesta debe reunir magnitud, comparación y patrón.')
add('17-32','Distinguir una magnitud fundamental de una derivada.','Una magnitud derivada se obtiene combinando magnitudes fundamentales mediante operaciones como multiplicación o división.', '''
Identificamos la acción | El enunciado habla de combinar magnitudes que ya sirven de base.
Recordamos el nombre | El resultado de esa combinación no se llama fundamental: se llama derivado.
Vemos un ejemplo de la operación | Ejemplo didáctico: distancia dividida entre tiempo produce rapidez. | v=d/t; unidad m/s
Elegimos la clasificación | La palabra que describe la combinación es magnitudes derivadas.
''','No confundas magnitud derivada con unidad grande o pequeña: lo que importa es cómo se define.','m/s combina longitud y tiempo, mostrando el sentido de derivada.')
add('17-33','Relacionar el prefijo pico con una potencia de diez.','Un prefijo modifica el tamaño de una unidad. Una potencia negativa de diez indica una fracción de esa unidad, no una cantidad negativa.', '''
Identificamos el prefijo solicitado | La pregunta pide pico, no nano ni micro. Cada prefijo corresponde a una escala concreta.
Escribimos su equivalencia | Pico representa una billonésima de la unidad. | pico=10⁻¹²
Interpretamos el exponente negativo | Significa dividir entre diez doce veces, o entre 10¹². | 10⁻¹²=1/1 000 000 000 000
Leemos el tamaño decimal | Es una cantidad positiva muy pequeña. | 10⁻¹²=0,000000000001
''','10⁻¹² no es −10¹²: el signo del exponente no convierte el número en negativo.','El denominador contiene un 1 seguido de doce ceros.')
add('17-34','Convertir masa a peso y después a libras-fuerza.','La masa está en gramos, pero P=mg con g en m/s² requiere kg para dar N. Finalmente convertimos N a lbf usando la equivalencia de la pregunta.', '''
Convertimos gramos a kg | Un kg tiene 1000 g; dividimos entre 1000. | m=2340/1000=2,34 kg
Calculamos el peso en N | Multiplicamos por la gravedad proporcionada. | P=2,34·9,81=22,9554 N
Convertimos a lbf | Cada lbf equivale a 4,448 N. Contamos cuántos grupos de 4,448 N hay en el peso. | P=22,9554/4,448≈5,1608 lbf
Redondeamos al final | Conservamos dos cifras decimales para comparar con las alternativas. | P≈5,16 lbf
''','No multipliques 2340 directamente por g: estarías usando gramos en una fórmula preparada para kg.','5,16 lbf×4,448 N/lbf≈22,95 N, aproximadamente el peso previo al redondeo.')
add('17-35','Reconocer el efecto de giro producido por una fuerza.','Una fuerza puede tender a cambiar el movimiento de traslación o el de rotación. Aquí la palabra clave es rotacional.', '''
Identificamos el tipo de movimiento | El enunciado habla de un cambio de rotación: girar, no solo desplazarse.
Identificamos qué produce ese efecto | Es una fuerza que tiene tendencia a generar o cambiar ese giro.
Relacionamos efecto y nombre | La magnitud que cuantifica ese efecto rotacional es el momento de torsión.
Elegimos la alternativa | Debe mencionar momento de torsión, porque conserva la idea de fuerza que produce giro.
''','No elijas una magnitud solo porque también mencione fuerza: debe describir su efecto rotacional.','La palabra torsión en la respuesta corresponde al giro descrito en la pregunta.')
add('17-39','Separar rapidez, velocidad con signo y desplazamiento.','Como el eje positivo apunta hacia arriba, la aceleración de caída es a=−g. Rapidez es el tamaño de la velocidad y nunca es negativa; desplazamiento sí lleva signo.', '''
Copiamos los datos y el convenio | Se deja caer, por lo que parte con velocidad cero. | v₀=0; t=17 s; a=−9,81 m/s²
Calculamos la velocidad final | Usamos v=v₀+at porque la aceleración es constante. | v=0−9,81·17=−166,77 m/s
Pasamos de velocidad a rapidez | Quitamos el signo direccional y redondeamos a una cifra decimal. | Rapidez=|v|=166,77≈166,8 m/s
Calculamos el desplazamiento | Usamos Δy=v₀t+at²/2. El primer término vale cero y 17²=289. | Δy=−9,81·289/2=−1417,545 m
Redondeamos conservando el signo | El resultado negativo indica que terminó por debajo del punto inicial. | Δy≈−1417,5 m
''','No pongas rapidez negativa. El signo hacia abajo pertenece a la velocidad y al desplazamiento.','Ambos resultados son coherentes con una caída: rapidez positiva y desplazamiento negativo respecto del eje elegido.')
add('34-36','Reconocer la condición que define una fuerza conservativa.','Una trayectoria cerrada empieza y termina en el mismo punto. El trabajo de una fuerza conservativa depende de los extremos, no del camino entre ellos.', '''
Leemos la condición completa | La pregunta dice cualquier trayectoria cerrada, no una sola trayectoria particular.
Identificamos los extremos | En un recorrido cerrado, el punto final coincide con el inicial.
Relacionamos con el trabajo | Si el trabajo depende solo de esos extremos, al regresar al mismo punto el trabajo total de esa fuerza es cero.
Nombramos la fuerza | La condición dada caracteriza a una fuerza conservativa.
''','Que el trabajo sea cero en un recorrido particular no basta; aquí se exige en cualquier trayectoria cerrada.','La respuesta conserva las dos ideas del enunciado: recorrido cerrado y trabajo cero.')
add('34-39','Construir una razón entre lo útil obtenido y lo entregado.','El rendimiento indica qué fracción de la potencia de entrada aparece como potencia útil de salida. Para expresarlo en porcentaje se multiplica por 100.', '''
Identificamos la salida útil | Es la potencia que aprovechamos; va en el numerador.
Identificamos la entrada | Es la potencia entregada al sistema; sirve como total de referencia y va en el denominador.
Formamos la fracción | Ambas potencias deben estar expresadas en la misma unidad. | Rendimiento=P_útil/P_entrada
Pasamos a porcentaje | Multiplicar por 100 convierte la fracción en un porcentaje. | η%=(P_útil/P_entregada)×100
Aplicamos un ejemplo didáctico | Si de 100 W de entrada se aprovechan 80 W: 80/100=0,8; luego 0,8×100=80 %.
''','Invertir el cociente entrada/salida cambia lo que se está midiendo.','La fórmula elegida debe poner potencia útil arriba, entregada abajo y multiplicar por 100.')
add('43-39','Calcular solo el trabajo de la fuerza normal.','El trabajo de una fuerza constante es W=Fd cosθ, donde θ es el ángulo entre la fuerza y el desplazamiento. Una fuerza perpendicular al movimiento no aporta trabajo.', '''
Identificamos la fuerza solicitada | Solo analizamos la normal, que es vertical. No estamos calculando el trabajo total de todas las fuerzas.
Identificamos el desplazamiento | El objeto recorre 15 m horizontalmente.
Determinamos el ángulo | Una dirección vertical y otra horizontal forman 90°. | θ=90°; cos90°=0
Sustituimos en la fórmula | No necesitamos el valor de N porque está multiplicado por cero. | W_N=N·15·0=0 J
''','Que el objeto se mueva no implica que todas las fuerzas hagan trabajo. Importa la dirección de cada una.','La normal no tiene componente en la dirección horizontal del desplazamiento.')

reused(teach_chemistry,'17-28','masa-molar',composition={'Na':1,'Cl':1,'O':4},atomicMasses={'Na':22.99,'Cl':35.5,'O':15.99})
reused(teach_chemistry,'17-29','numero-atomos',grams=3.7,molarMass=32.06,NAfactor=6.022)
reused(teach_chemistry,'24-23','masa-moleculas',moles=.250,M=98)
LESSONS['abp-24-23']['steps'].insert(0,S('Calculamos la masa molar','H₂SO₄ tiene 2 H, 1 S y 4 O. Multiplicamos cantidad de átomos por la masa dada y sumamos.','M=2·1+32+4·16=2+32+64=98 g/mol'))
reused(teach_chemistry,'25-25','pureza',sampleKg=400,volumeM3=134.4,molarVolume=22.4,M=160)
LESSONS['abp-25-25']['steps'].insert(0,S('Hallamos la masa molar del óxido','La fórmula Fe₂O₃ tiene dos Fe y tres O.','M=2·56+3·16=112+48=160 g/mol'))
reused(teach_chemistry,'35-48','balance-aluminio',alMoles=8.24)
reused(teach_chemistry,'35-56','masa-atomica',atomicMass=32,NAfactor=6.022)
LESSONS['abp-35-56']['steps'].append(S('Comparamos con las alternativas','La cuenta da 5,313849…×10⁻²³ g. La alternativa impresa 5,3130×10⁻²³ g es la más cercana, aunque sus últimos decimales no son un redondeo exacto del dato proporcionado.'))
reused(teach_chemistry,'36-57','combustion-etano',co2Litres=250,Vm=22.4,ethaneM=30)
LESSONS['abp-36-57']['steps'].insert(0,S('Hallamos la masa molar del etano','En C₂H₆ hay dos carbonos y seis hidrógenos.','M=2·12+6·1=30 g/mol'))
reused(teach_chemistry,'43-43','dicromato-yodo',iodineG=100,dichromateM=294,iodineM=254)
LESSONS['abp-43-43']['steps'][0:0]=[
 S('Balanceamos sin cambiar las fórmulas','Ponemos 1 delante de K₂Cr₂O₇. Sus dos Cr exigen 1 Cr₂(SO₄)₃. Llamamos b,c,d,e,g a los coeficientes de KI, H₂SO₄, K₂SO₄, I₂ y H₂O respectivamente.'),
 S('Conservamos K, I, S y H','Cada letra representa cuántas unidades de esa sustancia participan. Contamos los átomos a cada lado.','K: 2+b=2d; I: b=2e; S: c=d+3; H: 2c=2g → g=c'),
 S('Usamos el oxígeno para hallar d','El dicromato aporta 7 O; cada ácido, 4 O; cada sulfato de K, 4 O; el sulfato de Cr, 12 O; cada agua, 1 O. Reemplazamos g=c y c=d+3.','7+4c=4d+12+g → 3c−4d=5 → 3(d+3)−4d=5 → d=4'),
 S('Completamos los coeficientes','c=d+3=7; g=c=7; b=2d−2=6; e=b/2=3. Ahora podemos usar la proporción entre dicromato y yodo.','K₂Cr₂O₇+6KI+7H₂SO₄→4K₂SO₄+3I₂+Cr₂(SO₄)₃+7H₂O')]
LESSONS['abp-43-43']['steps'].insert(0,S('Calculamos las masas molares','Contamos los átomos de cada fórmula usando las masas de la pregunta.','M(K₂Cr₂O₇)=2·39+2·52+7·16=294 g/mol; M(I₂)=2·127=254 g/mol'))
reused(teach_chemistry,'44-46','nitrogeno-alanina',alanineG=10,M=89,Vm=22.4)
LESSONS['abp-44-46']['steps'].insert(0,S('Calculamos la masa molar de alanina','Usamos los subíndices de C₃H₇NO₂; N sin subíndice cuenta como 1.','M=3·12+7·1+14+2·16=36+7+14+32=89 g/mol'))
reused(teach_chemistry,'44-48','comparar-atomos',samples=[{'element':e,'M':m,'grams':10} for e,m in [('Fe',56),('Cr',52),('I',127),('Na',23),('Carbono',12)]])

add('36-58','Balancear la reacción y sumar sus coeficientes.','Un coeficiente es el número escrito delante de una fórmula; multiplica a todos sus átomos. Balancear conserva la cantidad de cada elemento sin cambiar los subíndices de las fórmulas.', '''
Asignamos letras a los coeficientes | Escribimos a,b,c,d para las cuatro sustancias en el orden de la reacción. | aCO₂+bI₂→cCO+dI₂O₅
Conservamos carbono e yodo | Cada CO₂ y cada CO tienen un C; cada I₂ y cada I₂O₅ tienen dos I. | a=c; 2b=2d → b=d
Conservamos oxígeno | A la izquierda hay 2a O; a la derecha c+5d O. Reemplazamos c=a. | 2a=a+5d → a=5d
Elegimos los enteros más pequeños | Tomamos d=1; entonces a=5, c=5 y b=1. | 5CO₂+I₂→5CO+I₂O₅
Sumamos los cuatro coeficientes | Los coeficientes 1 también se cuentan aunque normalmente no se escriban. | 5+1+5+1=12
''','No cambies CO₂ por CO para balancear: cambiar subíndices cambia la sustancia.','Hay 5 C, 10 O y 2 I a cada lado; por eso los coeficientes están balanceados.')
add('16-22','Reconocer una descomposición de HgO que produce oxígeno.','HgO es óxido de mercurio. Descomposición significa que un compuesto se separa en sustancias más simples; el oxígeno elemental de esta reacción se escribe O₂.', '''
Identificamos el reactivo | Debe aparecer HgO al lado izquierdo, porque se descompone óxido de mercurio.
Identificamos los productos | El óxido se separa en mercurio Hg y oxígeno O₂. | HgO→Hg+O₂, aún sin balancear
Igualamos los átomos de oxígeno | O₂ tiene dos átomos de O; necesitamos 2 HgO a la izquierda.
Igualamos los átomos de mercurio | Los 2 HgO aportan también dos Hg, así que ponemos 2 delante de Hg. | 2HgO→2Hg+O₂
''','Producir oxígeno no basta: la alternativa debe partir específicamente del óxido de mercurio.','La ecuación conserva 2 Hg y 2 O de cada lado y tiene un compuesto como único reactivo.')
add('16-24','Identificar la capacidad máxima de un solo orbital.','La pregunta no pide electrones de una capa completa ni de todo el átomo: habla de un orbital individual.', '''
Precisamos qué se cuenta | Contamos electrones en un único orbital, no el número de orbitales.
Recordamos la capacidad máxima | Un orbital puede albergar como máximo dos electrones. Puede tener menos, pero no más.
Indicamos la condición del par | Cuando hay dos en el mismo orbital, tienen espines opuestos. Eso distingue las dos ocupaciones permitidas.
Respondemos el máximo | La alternativa numérica es 2. | Máximo=2 electrones por orbital
''','No respondas con la capacidad de una capa o subnivel: pueden incluir varios orbitales.','La palabra máximo permite 0, 1 o 2 electrones ocupándolo, pero establece el límite en 2.')
add('35-45','Clasificar la reacción por el cambio de participantes.','En sustitución simple, un elemento desplaza a otro que estaba dentro de un compuesto. Aquí observamos quién está libre al inicio y quién queda libre al final.', '''
Identificamos los reactivos | Mg está como elemento; H₂SO₄ es el compuesto con el que reacciona. | Mg+H₂SO₄
Seguimos al magnesio | Mg pasa a formar parte del sulfato de magnesio. | MgSO₄
Seguimos al hidrógeno | El hidrógeno que estaba en el ácido aparece al final como H₂. El magnesio lo reemplaza en el compuesto.
Nombramos el patrón | Elemento+compuesto→compuesto+elemento corresponde a sustitución simple. | Mg+H₂SO₄→MgSO₄+H₂
''','No toda reacción donde participa un ácido es neutralización; aquí hay metal y se libera H₂.','Un elemento libre, Mg, desplaza a otro, H: hay una sustitución simple.')
add('35-53','Distinguir un compuesto puro de una mezcla.','Una sustancia pura tiene composición definida. Puede ser un elemento o un compuesto; pura no significa que tenga un solo tipo de elemento.', '''
Identificamos el compuesto | Carbonato de calcio corresponde a la fórmula CaCO₃.
Interpretamos su fórmula | La proporción es fija: un Ca, un C y tres O por unidad de fórmula. Que tenga varios elementos no lo convierte en mezcla.
Comparamos las otras opciones | Gasolina, aire y madera corresponden a mezclas de componentes; no representan una sola fórmula de composición definida.
Seleccionamos la sustancia pura | Entre esas alternativas, el compuesto definido es carbonato de calcio. | CaCO₃
''','No confundas compuesto con mezcla. Un compuesto químico puede ser una sustancia pura.','La respuesta tiene una identidad química y una fórmula definidas, a diferencia de las mezclas listadas.')
add('35-54','Reconocer la definición de la unidad de masa atómica.','Para expresar masas atómicas se usa como referencia el átomo de carbono-12. La unidad u es una fracción de la masa de ese átomo.', '''
Identificamos la referencia | Es un átomo de carbono-12, no un mol de carbono ni cualquier isótopo.
Interpretamos doceava parte | Dividimos su masa en doce partes iguales y tomamos una. | 1 u=m(átomo de carbono-12)/12
Distinguimos unidad y átomo completo | El átomo de referencia completo tiene doce de esas partes. | m(carbono-12)=12 u
Nombramos la unidad | Esa definición corresponde a unidad de masa atómica, representada por u.
''','La masa del átomo completo de carbono-12 no es 1 u: es 12 u.','Multiplicar la unidad definida por 12 recupera la masa del átomo de referencia.')
add('35-55','Encontrar la propiedad que NO corresponde al patrón de los compuestos iónicos.','La palabra NO invierte la tarea: buscamos la afirmación incorrecta entre las propiedades propuestas. Un compuesto iónico contiene iones, que son partículas con carga.', '''
Marcamos la negación | No debemos seleccionar una propiedad habitual correcta. La pregunta exige la excepción.
Recordamos qué mantiene unidos a los iones | Las cargas opuestas se atraen. Por eso la interacción de cargas es esencial para analizar estos compuestos.
Revisamos la afirmación sobre disolventes | «Son solubles en compuestos apolares» presenta como propiedad general algo que no corresponde al patrón iónico del ejercicio.
Elegimos la excepción | Esa es la alternativa que hay que marcar, precisamente porque la pregunta dice NO. No significa que todos los compuestos iónicos sean solubles en cualquier otro disolvente.
''','No conviertas una propiedad habitual en una regla universal: la solubilidad depende del compuesto y del disolvente.','La respuesta seleccionada es la afirmación que se rechaza, no una nueva propiedad que debamos memorizar como verdadera.')
add('36-59','Contar elementos diferentes, no átomos totales.','En una fórmula, cada símbolo distinto representa un elemento. Un subíndice indica cuántos átomos hay de ese elemento, no cuántos tipos nuevos aparecen.', '''
Separamos los símbolos | Na es un símbolo de dos letras y cuenta como un solo elemento. | Na, H, C, O
Contamos los tipos distintos | Hay sodio, hidrógeno, carbono y oxígeno. | 4 elementos diferentes
Interpretamos el subíndice 3 | O₃ significa tres átomos del mismo elemento oxígeno, no tres elementos distintos.
Nombramos la clasificación | Un compuesto con cuatro elementos distintos se llama cuaternario. | NaHCO₃: cuaternario
''','Contar todos los átomos daría 6, pero esa no es la clasificación solicitada.','Na, H, C y O forman una lista de cuatro símbolos distintos.')
add('44-49','Relacionar el nombre óxido nítrico con su fórmula.','Óxido nítrico corresponde al monóxido de nitrógeno. En ese nombre, mono indica un átomo de oxígeno en la fórmula.', '''
Identificamos los elementos | N representa nitrógeno y O representa oxígeno.
Interpretamos el nombre específico | El óxido nítrico es el monóxido de nitrógeno; no debe confundirse con otros óxidos de nitrógeno.
Escribimos la proporción | La fórmula contiene un N y un O. El subíndice 1 no se escribe. | N₁O₁=NO
Elegimos la fórmula | Debe aparecer N seguida de O, sin un subíndice 2 en ninguno de ellos. | NO
''','NO y NO₂ son fórmulas diferentes: cambiar el subíndice cambia el compuesto.','La fórmula NO contiene exactamente un nitrógeno y un oxígeno.')
add('35-46','Reconocer el nombre específico de la reacción ácido-base.','Una neutralización ácido-base del tipo mostrado produce una sal y agua. La pregunta pide ese nombre específico.', '''
Identificamos el ácido | El reactivo H₂SO₄ es el ácido del enunciado.
Identificamos la base | Ca(OH)₂ es la base que reacciona con él.
Revisamos los productos | Se forma la sal CaSO₄ y agua. | H₂SO₄+Ca(OH)₂→CaSO₄+2H₂O
Nombramos la reacción | El patrón ácido+base→sal+agua corresponde a neutralización.
Distinguimos una categoría más amplia | También puede verse un intercambio de grupos, pero «neutralización» responde de manera más específica a lo que se pregunta.
''','No elijas una clasificación general cuando la pregunta solicita el nombre específico de la reacción ácido-base.','Los dos reactivos y los dos tipos de producto coinciden con el patrón de neutralización.')

def explain(q):
    if q['id'] not in LESSONS:raise ValueError('Missing reviewed original lesson: '+q['id'])
    return LESSONS[q['id']]
