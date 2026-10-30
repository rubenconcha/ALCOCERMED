from fractions import Fraction
import math
from teaching_common import num,frac,F,step as S,lesson as L,aset,common_subtraction

def explain(f,d):
 if f=='conjuntos':
  U,A,B,C=map(set,[d['U'],d['A'],d['B'],d['C']]);union=C|A;comp=U-B;answer=union&comp
  return L('Encontrar qué números quedan al efectuar las operaciones de conjuntos.', 'Un conjunto es una colección de elementos. ∪ significa unir sin repetir; ∩ significa quedarse con los elementos comunes; Bᶜ son los elementos de U que no están en B.',[
   S('Respetamos los paréntesis','Primero resolvemos C ∪ A. Copiamos los números de ambos y escribimos cada número una sola vez.',f'C ∪ A = {aset(union)}'),
   S('Construimos el complemento de B','Partimos del universo U y retiramos todos los elementos de B. No son los números negativos de B ni los que están fuera de U.',f'Bᶜ = U − B = {aset(comp)}'),
   S('Buscamos los números comunes','Comparamos las dos listas anteriores. Un número se conserva solamente si aparece en las dos.',f'(C ∪ A) ∩ Bᶜ = {aset(answer)}'),
   S('Leemos el resultado','Las llaves indican el conjunto que nos pidieron. No se suman sus elementos: se escribe la lista encontrada.',aset(answer))],
   'No confundas unión con intersección: unir agrega elementos; intersectar exige que estén en ambas listas.',f'Cada elemento de {aset(answer)} debe estar en C o en A, y ninguno debe pertenecer a B.')
 if f in ['resto','resto-cuadratico']:
  co=d['coefficients'];r=d['root'];degree=len(co)-1;powers=[r**(degree-i) for i in range(len(co))];terms=[a*b for a,b in zip(co,powers)];total=sum(terms)
  return L('Calcular el resto que queda en una división de polinomios.', 'P(x) significa que el valor del polinomio depende de x. Al dividir por x−r, el resto es P(r): ponemos r en cada lugar donde aparece x. Esto funciona porque el divisor x−r vale cero allí.',[
   S('Encontramos el número que sustituye a x',f'Igualamos el divisor a cero. Sumamos {r} a ambos lados para dejar x sola.',f'x − {r} = 0 → x = {r}'),
   S('Sustituimos en todos los términos','Cada potencia conserva su exponente y cada coeficiente conserva su signo. No sustituimos solo en el primer término.', 'P('+str(r)+') = '+' + '.join(f'({a})·{r}^{degree-i}' for i,a in enumerate(co))),
   S('Resolvemos las potencias','Una potencia indica multiplicar la base por sí misma. Por ejemplo, r³=r·r·r; una potencia cero vale 1.', 'Potencias: '+', '.join(f'{r}^{degree-i}={value}' for i,value in enumerate(powers))),
   S('Multiplicamos los coeficientes','Multiplicamos cada coeficiente por la potencia que le corresponde; los términos negativos siguen siendo negativos.', 'P('+str(r)+') = '+' + '.join(f'({num(v)})' for v in terms)),
   S('Sumamos para obtener el resto','Ahora solo queda una operación con números. El resultado de esta suma es el resto, no el cociente.',f'Resto = {total}')],
   'En x−r se sustituye x por +r. Usar −r cambiaría los signos y daría otro resultado.', f'La identidad de una división es P(x)=(x−{r})·cociente+resto. Si x={r}, el primer producto es 0 y queda P({r})={total}.')
 if f=='division':
  div=d['divisor'];a,b,c=d['quotient'];raw=[div*a,div*b,div*c]
  return L('Simplificar una fracción que contiene un polinomio.', 'Una suma dividida entre un mismo número puede separarse término por término. Además, x⁵/x³=x² porque se cancelan tres factores x de arriba con los tres de abajo; esto requiere x≠0.',[
   S('Separamos los tres términos','La división se aplica a cada término del numerador. No se divide únicamente el primero.',f'({raw[0]}x⁵)/({div}x³) + ({raw[1]}x⁴)/({div}x³) + ({raw[2]}x³)/({div}x³)'),
   S('Dividimos el primer término',f'El coeficiente se divide entre {div}; en las potencias se restan exponentes.',f'{raw[0]}/{div} = {a}; x⁵/x³ = x² → {a}x²'),
   S('Dividimos el segundo término','El signo negativo también forma parte del coeficiente y se conserva al dividir por un número positivo.',f'{raw[1]}/{div} = {b}; x⁴/x³ = x → {b}x'),
   S('Dividimos el término final','Las potencias de x se cancelan por completo: x³/x³=1. Por eso este resultado es una constante.',f'{raw[2]}/{div} = {c}; x³/x³ = 1'),
   S('Reunimos los resultados','Escribimos juntos los tres términos ya simplificados.',f'{a}x² − {abs(b)}x + {c}')],
   'Al dividir potencias de igual base se restan exponentes, no se dividen. x⁵/x³ no es x^(5/3).',f'Si multiplicas el resultado por {div}x³, deben reaparecer los tres términos del numerador original.')
 if f=='promedio':
  values=d['known'];size=d['size'];mean=F(d['mean']);known=sum(values);total=mean*size;missing=total-known
  return L('Encontrar un dato que falta cuando conocemos el promedio.', 'El promedio o media es la suma de todos los datos dividida entre cuántos datos hay. Si conocemos el promedio y la cantidad, podemos recuperar la suma multiplicándolos.',[
   S('Contamos todos los datos',f'Hay {size} datos en total: {len(values)} conocidos y uno llamado x. x también cuenta aunque todavía no conozcamos su valor.',f'Cantidad total = {size}'),
   S('Recuperamos la suma total','Para deshacer la división de la fórmula del promedio, multiplicamos por la cantidad de datos.',f'Suma total = promedio × cantidad = ({frac(mean)}) × {size} = {frac(total)}'),
   S('Sumamos los datos conocidos','Se suman solamente los datos que ya nos dieron. Todavía no agregamos x.', ' + '.join(map(str,values))+f' = {known}'),
   S('Hallamos cuánto falta','La suma total debe incluir también x. Restamos lo que ya conocemos para encontrar la parte faltante.',f'x = {frac(total)} − {known} = {frac(missing)}'),
   S('Comprobamos con el promedio','Volvemos a sumar incluyendo el valor hallado y dividimos entre todos los datos.',f'({known} + {frac(missing)})/{size} = {frac(mean)}')],
   'No dividas entre la cantidad de datos conocidos: el promedio incluye también el dato que falta.',f'Al colocar x={frac(missing)}, el promedio vuelve a ser {num(mean)}. Esa es la comprobación de que no confundimos suma y promedio.')
 if f=='frecuencias':
  N,n1,n2,n3,n4=[d[k] for k in ['N','n1','n2','n3','n4']];f1=Fraction(n1,N);N4=n1+n2+n3+n4;N3=N4-n4;f3=Fraction(n3,N);product=n3*f3;res=product+N3
  return L('Completar los valores necesarios de una tabla de frecuencias y evaluar la expresión.', 'nᵢ es cuántos datos hay en una fila. fᵢ es esa cantidad dividida entre el total. Nᵢ es el acumulado: la suma de las frecuencias absolutas desde la primera fila hasta esa fila. La mayúscula y la minúscula no significan lo mismo.',[
   S('Recuperamos el total de datos',f'Como f₁=n₁/total, despejamos total=n₁/f₁. Dividir entre {frac(f1)} equivale a multiplicar por {frac(1/f1)}.',f'Total = {n1} ÷ ({frac(f1)}) = {N}'),
   S('Retrocedemos del acumulado cuarto al tercero','N₄ incluye hasta la cuarta fila. Para quedarnos hasta la tercera quitamos la cantidad de la cuarta, n₄.',f'N₃ = N₄ − n₄ = {N4} − {n4} = {N3}'),
   S('Separamos lo que pertenece a la tercera fila','N₃=n₁+n₂+n₃. Quitamos las dos primeras cantidades para dejar solo n₃.',f'n₃ = {N3} − {n1} − {n2} = {n3}'),
   S('Calculamos su frecuencia relativa','Dividimos la cantidad de esa fila entre el total, no entre el acumulado.',f'f₃ = n₃/total = {n3}/{N} = {frac(f3)}'),
   S('Hacemos primero la multiplicación','En n₃f₃+N₃, escribir los símbolos juntos significa multiplicar. La multiplicación va antes de la suma.',f'n₃f₃ = {n3} × ({frac(f3)}) = {frac(product)}'),
   S('Agregamos el acumulado','Ahora sí sumamos el resultado anterior y N₃.',f'E = {frac(product)} + {N3} = {frac(res)} = {num(res)}')],
   'No uses N₃ como si fuera n₃. Uno acumula varias filas y el otro cuenta solo una.',f'Los valores deben recuperar N₄: {n1}+{n2}+{n3}+{n4}={N4}. Además f₃ debe estar entre 0 y 1.')
 if f=='sistema':
  aa,bb=d['matrix'][0];r1,r2=d['rhs'];coef=aa+2*bb;rhs=r1+bb*r2;x=Fraction(rhs,coef);y=2*x-r2
  return L('Encontrar dos números, x e y, que cumplan a la vez las dos ecuaciones.', 'Resolver un sistema significa hallar la misma pareja para ambas ecuaciones. Usaremos sustitución: despejar una letra en una ecuación y colocar esa expresión en la otra.',[
   S('Despejamos y en la segunda ecuación','Partimos de 2x−y=r. Pasar y al otro lado y r al lado de 2x deja y sola.',f'2x − y = {r2} → y = 2x − ({r2})'),
   S('Sustituimos en la primera','Donde antes decía y ponemos la expresión completa entre paréntesis.',f'{aa}x + {bb}(2x − ({r2})) = {r1}'),
   S('Multiplicamos dentro del paréntesis',f'El {bb} multiplica tanto a 2x como a −({r2}). Luego juntamos los términos que contienen x.',f'({aa}+{2*bb})x − ({bb*r2}) = {r1} → {coef}x = {rhs}'),
   S('Dejamos x sola',f'El {coef} está multiplicando a x. Dividimos ambos lados entre ese número.',f'x = {rhs}/{coef} = {frac(x)}'),
   S('Volvemos por y','Usamos y=2x−r con el valor de x que acabamos de encontrar.',f'y = 2·({frac(x)}) − ({r2}) = {frac(y)}'),
   S('Verificamos ambas condiciones','Una respuesta no basta con que funcione en una sola ecuación.',f'{aa}·({frac(x)})+{bb}·({frac(y)})={r1}; 2·({frac(x)})−({frac(y)})={r2}')],
   'Al sustituir, conserva el paréntesis: el coeficiente multiplica toda la expresión de y, no solo su primer término.',f'La pareja final es x={frac(x)}, y={frac(y)}, y recupera los dos resultados del enunciado.')
 if f=='raices':
  k=d['scale']+2;u,v=d['u'],d['v'];r1=Fraction(v+u,k-1);r2=Fraction(v-u,k+1);hi=max(r1,r2);lo=min(r1,r2)
  return L('Encontrar las dos raíces y después calcular la distancia positiva entre ellas.', 'Una raíz es un valor de x que hace cero la expresión. Usaremos A²−B²=(A−B)(A+B). Si un producto da cero, al menos uno de sus factores debe valer cero.',[
   S('Reconocemos los dos bloques al cuadrado',f'El primero es {k}x−{v}; el segundo es x+{u}. No se resta simplemente lo que está dentro de los cuadrados.',f'A = {k}x−{v}; B = x+{u}'),
   S('Restamos y sumamos los bloques','Para A−B, el signo menos cambia los signos de todo el segundo paréntesis. Para A+B sumamos términos semejantes.',f'A−B = {k-1}x−{v+u}; A+B = {k+1}x−{v-u}'),
   S('Igualamos el primer factor a cero','Pasamos la constante al otro lado y dividimos entre el coeficiente de x.',f'{k-1}x−{v+u}=0 → x=({v+u})/{k-1}={frac(r1)}'),
   S('Igualamos el otro factor a cero','Se hace lo mismo con el segundo factor: así obtenemos la segunda raíz.',f'{k+1}x−{v-u}=0 → x=({v-u})/{k+1}={frac(r2)}'),
   S('Restamos mayor menos menor','Para restar fracciones debemos usar un mismo denominador. Multiplicamos los numeradores por los factores que faltan.',common_subtraction(hi,lo)),
   S('Interpretamos el signo','Nos pidieron una diferencia positiva. Por eso usamos mayor menos menor y no el orden en que encontramos las raíces.',f'Diferencia = {frac(hi-lo)}')],
   'La resta A−B exige cambiar ambos signos del segundo paréntesis. Ese error cambia las dos raíces.',f'Cada raíz debe anular por lo menos uno de los factores, y la diferencia {frac(hi-lo)} es positiva.')
 if f=='trinomio':
  k,l=d['k'],d['l']
  return L('Reconocer un cuadrado de tres términos y escribirlo como un solo factor al cuadrado.', 'Al elevar tres términos al cuadrado aparecen los cuadrados de cada uno y tres productos cruzados multiplicados por 2. Esos productos permiten determinar los signos.',[
   S('Sacamos las bases de los tres cuadrados',f'Las raíces de {k*k}a², {l*l}b² y c² son {k}a, {l}b y c.',f'({k}a)²={k*k}a²; ({l}b)²={l*l}b²; c²=c²'),
   S('Miramos el producto entre a y b',f'El término +{2*k*l}ab es positivo. Los términos {k}a y {l}b deben tener el mismo signo.',f'2·({k}a)·({l}b) = +{2*k*l}ab'),
   S('Decidimos el signo de c',f'Los productos con c son negativos: −{2*k}ac y −{2*l}bc. Por eso c lleva un signo contrario al de los otros dos términos.',f'{k}a + {l}b − c'),
   S('Escribimos y comprobamos el cuadrado','Al desarrollarlo deben reaparecer exactamente los tres cuadrados y los tres productos cruzados.',f'({k}a+{l}b−c)² = {k*k}a²+{l*l}b²+c²+{2*k*l}ab−{2*k}ac−{2*l}bc')],
   'No basta mirar los tres cuadrados: también debes comprobar los signos de los productos cruzados.',f'Los seis términos del desarrollo coinciden con los del enunciado. Por eso la factorización es ({k}a+{l}b−c)².')
 if f=='logaritmos':
  base=d['base'];r,t=d['roots'];v1=base**r;v2=base**t
  return L('Encontrar los valores de x que hacen verdadera la igualdad de logaritmos.', f'log{base}(x)=t significa {base}ᵗ=x: un logaritmo pregunta qué exponente necesita la base. Para no repetir una expresión larga llamaremos t al logaritmo interior.',[
   S('Quitamos los logaritmos exteriores','Los dos tienen base 2. Si son iguales y sus argumentos son positivos, los argumentos también deben ser iguales.',f'({r+t})·log{base}(x) − (log{base}(x))² = {r*t}'),
   S('Cambiamos temporalmente el nombre','Escribimos t en lugar de log de x. Así se ve una ecuación cuadrática normal, no una operación nueva.',f't = log{base}(x) → {r+t}t − t² = {r*t}'),
   S('Llevamos todo a un lado','Sumamos t² y restamos el término lineal para obtener coeficiente positivo en t².',f't² − {r+t}t + {r*t} = 0'),
   S('Factorizamos la ecuación','Buscamos dos números que sumen el coeficiente lineal en valor absoluto y multipliquen la constante.',f'({r})+({t})={r+t}; ({r})·({t})={r*t} → (t−{r})(t−{t})=0'),
   S('Recuperamos los valores del logaritmo','Un producto es cero cuando alguno de sus factores vale cero. Aún no hemos encontrado x: encontramos t.',f't={r} o t={t}'),
   S('Volvemos de t a x','Si log de base b de x vale t, entonces x=bᵗ. Esta conversión se hace para las dos soluciones.',f'x={base}^{r}={v1} o x={base}^{t}={v2}')],
   'No marques t=1 o t=2 como si fueran x. Esos números son exponentes; todavía debes elevar la base.',f'Los dos valores de x son positivos y el argumento exterior queda {r*t}>0. Las dos soluciones se pueden usar.')
 if f=='log-base-variable':
  t=d['t'];k=d['constant'];other=1-t
  return L('Resolver una igualdad donde x aparece también en la base de un logaritmo.', 'Una base de logaritmo tiene que ser positiva y distinta de 1. Por eso x²>0 y x²≠1. Cambiar de base permite escribir todos los logaritmos con la misma función ln; ln es el logaritmo natural.',[
   S('Cambiamos las bases','Aplicamos log_b(a)=ln(a)/ln(b). Como ln4=2ln2, el factor ln2 se cancela.',f'ln(x²+{k})/ln4 · ln2/ln(x²) = ln(x²+{k})/[2ln(x²)]'),
   S('Deshacemos la división','Si la fracción vale 1, su numerador y su denominador son iguales. Multiplicamos ambos lados por 2ln(x²), que no es cero.',f'ln(x²+{k}) = 2ln(x²)'),
   S('Pasamos el 2 como exponente','La regla k·ln(a)=ln(aᵏ) convierte el segundo miembro. Si los logaritmos son iguales, igualamos sus argumentos.',f'ln(x²+{k}) = ln((x²)²) → x²+{k}=x⁴'),
   S('Hacemos una sustitución más sencilla','Llamamos z a x². Entonces x⁴=z², de modo que aparece una cuadrática.',f'z²−z−{k}=0 → (z−{t})(z+{t-1})=0'),
   S('Elegimos el valor posible de x²',f'Los candidatos son {t} y {other}. El cuadrado de un número real no puede ser negativo; descartamos {other}.',f'x²={t}'),
   S('Sacamos las dos raíces','Tanto una raíz positiva como su negativa tienen el mismo cuadrado. Por eso no conservamos solo la positiva.',f'x=+√{t} o x=−√{t}')],
   'x² nunca puede ser la raíz negativa de la ecuación en z. Tampoco olvides que x²=t da dos valores de x.',f'Con x²={t}, la base es positiva y no es 1; además x²+{k}={t*t}>0. Ambas raíces respetan el dominio.')
 if f=='termino-independiente':
  a,b=d['a'],d['b'];k=b+2;ans=Fraction(-k,b)
  return L('Hallar el término que no lleva x después de dividir las expresiones.', 'El término independiente es la parte constante de un polinomio. Dividir por una fracción es multiplicar por su inversa. Solo se pueden cancelar factores completos, no términos separados de una suma.',[
   S('Invertimos la fracción por la que se divide','Q está en el denominador de P/Q; por eso su numerador y denominador intercambian posiciones.',f'P/Q = ({a}x²−{a})/{b} · ({b}x+{k})/({a}x+{a})'),
   S('Factorizamos antes de cancelar','Arriba hay una diferencia de cuadrados; abajo hay un factor común.',f'{a}x²−{a}={a}(x−1)(x+1); {a}x+{a}={a}(x+1)'),
   S('Cancelamos lo que multiplica a todo',f'Se elimina {a}(x+1) en numerador y denominador, manteniendo las restricciones del ejercicio.',f'P/Q = (x−1)({b}x+{k})/{b}'),
   S('Buscamos el único producto sin x',f'Para obtener una constante multiplicamos el −1 del primer paréntesis por {k} del segundo. Cualquier otro producto lleva x.',f'Término constante = (−1)·{k}/{b} = {frac(ans)}'),
   S('Comprobamos con x=0','Aquí x=0 está permitido. Al sustituir cero en el polinomio simplificado desaparecen todos los términos que llevan x.',f'(0−1)({b}·0+{k})/{b} = {frac(ans)}')],
   'No canceles x² con x dentro de una suma: primero deben aparecer como factores que multiplican al resto.',f'El término independiente queda {frac(ans)}; es negativo porque sale de multiplicar −1 por una constante positiva.')
 if f=='identidad-cubica':
  ab=d['ab'];c=d['cubes'];offset=d['offset'];res=c+offset
  return L('Evaluar la expresión sin tener que encontrar a y b por separado.', 'Un cubo de suma no es solo la suma de los cubos: (a+b)³=a³+b³+3ab(a+b). Los términos adicionales aparecen al multiplicar tres veces (a+b).',[
   S('Escribimos la identidad completa','Agrupamos los productos cruzados en 3ab(a+b); esto permite aprovechar el dato ab.', '(a+b)³ = (a³+b³) + 3ab(a+b)'),
   S('Reemplazamos los datos disponibles',f'Sabemos a³+b³={c} y ab={ab}. Primero calculamos 3ab=3·{ab}={3*ab}.',f'(a+b)³ = {c} + {3*ab}(a+b)'),
   S('Sustituimos dentro de toda la expresión','No estamos sumando solo el cubo: también hay una resta y una constante en el ejercicio.',f'E = {c}+{3*ab}(a+b)−{3*ab}(a+b)+{offset}'),
   S('Cancelamos los opuestos','Una cantidad menos ella misma vale cero, aunque no sepamos cuánto vale a+b.',f'+{3*ab}(a+b)−{3*ab}(a+b)=0'),
   S('Hacemos la suma restante','Ya no quedan letras por calcular.',f'E = {c}+{offset} = {res}')],
   'No intentes adivinar a y b: los datos ya bastan porque el término desconocido se cancela.',f'La expresión queda reducida exactamente a la suma {c}+{offset}; por eso el valor es {res}.')
 if f=='notacion-cientifica':
  a=d['coefficient'];e=d['power'];total=3*a;normal=total/10 if total>=10 else total;exponent=e+1 if total>=10 else e
  return L('Sumar cantidades con la misma potencia de 10 y dejar el resultado normalizado.', 'En a×10ⁿ, a es el coeficiente y n el exponente. Si la potencia de 10 es la misma en dos términos, se conserva ese factor y se suman los coeficientes. El coeficiente final debe estar entre 1 y 10.',[
   S('Identificamos la parte que se repite','Los dos términos llevan la misma potencia. Por eso podemos tratarla como un factor común.',f'{a}×10^{e} + {2*a}×10^{e} = ({a}+{2*a})×10^{e}'),
   S('Sumamos los coeficientes','No sumamos los exponentes: no estamos multiplicando potencias.',f'{a}+{2*a}={total} → {total}×10^{e}'),
   S('Revisamos si el coeficiente está permitido',f'El coeficiente {total} '+('es mayor o igual que 10; movemos la coma una posición a la izquierda.' if total>=10 else 'ya está entre 1 y 10, por lo que no necesita moverse.')),
   S('Conservamos el valor al normalizar', 'Si dividimos el coeficiente entre 10, aumentamos el exponente en 1 para compensar.' if total>=10 else 'Como no cambiamos el coeficiente, tampoco cambiamos el exponente.',f'Resultado = {num(normal)}×10^{exponent}')],
   'Sumar exponentes es una regla de multiplicación, no de suma. Aquí las cantidades comparten el mismo factor 10ⁿ.',f'El coeficiente {num(normal)} está entre 1 y 10 y la cantidad sigue siendo {total}×10^{e}.')
 if f=='diferencia-cuadrados':
  a,b,c=d['a'],d['b'],d['c'];cross=2*b*c
  return L('Multiplicar los paréntesis y simplificar sin perder los signos.', 'Los dos paréntesis tienen un bloque igual y otro opuesto. La identidad (A+B)(A−B)=A²−B² evita nueve multiplicaciones separadas. Aun así, el cuadrado de B debe desarrollarse completo.',[
   S('Separamos el bloque común y el que cambia de signo',f'El bloque común es {a}x. En el primero se suma {b}y−{c}z; en el segundo se resta ese mismo bloque.',f'A={a}x; B={b}y−{c}z'),
   S('Usamos la diferencia de cuadrados','Los productos +AB y −AB se cancelan al multiplicar los paréntesis. Por eso quedan A²−B².',f'({a}x)²−({b}y−{c}z)²−{cross}yz'),
   S('Elevamos el primer bloque',f'Al cuadrar un producto se cuadran sus dos factores: {a}²={a*a}.',f'({a}x)²={a*a}x²'),
   S('Desarrollamos el cuadrado de la resta','Usamos (u−v)²=u²−2uv+v². El producto del medio no se puede omitir.',f'({b}y−{c}z)²={b*b}y²−{cross}yz+{c*c}z²'),
   S('Aplicamos el menos al paréntesis completo','El signo menos delante del cuadrado cambia el signo de cada término de su desarrollo.',f'{a*a}x²−{b*b}y²+{cross}yz−{c*c}z²−{cross}yz'),
   S('Cancelamos los términos opuestos','Los dos términos que llevan yz tienen el mismo tamaño y signos contrarios. Suman cero.',f'+{cross}yz−{cross}yz=0 → {a*a}x²−{b*b}y²−{c*c}z²')],
   'El cuadrado de una resta incluye −2uv. Olvidarlo o no cambiar sus signos al restarlo impide la cancelación.',f'Después de cancelar yz quedan solamente tres términos: {a*a}x², −{b*b}y² y −{c*c}z².')
 if f=='inecuacion':
  left,right=d['roots'];mid=Fraction(left+right,2)
  return L('Encontrar los valores de x que hacen negativo el producto.', 'Un producto es negativo cuando un factor es positivo y el otro negativo. Las raíces separan la recta en zonas donde cambian los signos. El símbolo <0 no incluye el cero.',[
   S('Localizamos los ceros de cada factor',f'El primer factor es cero en {left}; el segundo es cero en {right}. Esos números marcan los límites de los intervalos.',f'x={left}; x={right}'),
   S('Probamos a la izquierda del menor',f'Si x es menor que {left}, está a la izquierda de ambas raíces. Ambos factores son negativos.', 'negativo × negativo = positivo → no sirve'),
   S('Probamos entre las raíces',f'Si {left}<x<{right}, el primer factor ya es positivo y el segundo sigue siendo negativo.', 'positivo × negativo = negativo → sí sirve'),
   S('Probamos a la derecha del mayor',f'Si x>{right}, los dos factores son positivos.', 'positivo × positivo = positivo → no sirve'),
   S('Decidimos si incluimos los extremos','En las raíces el producto es 0. Como piden menor que 0 y no menor o igual, usamos paréntesis, no corchetes.',f'Solución: ({left},{right})')],
   'Los extremos no pertenecen a la solución: 0 no es menor que 0.',f'Un número intermedio, como {num(mid)}, produce factores de signos opuestos. Fuera del intervalo los signos coinciden.')
 if f=='logica':
  p,q,r=map(bool,[d['p'],d['q'],d['r']]);imp=not p or q;neg=not r;first=imp and neg;second=(not imp) and r;out=first or second;v=lambda t:'V' if t else 'F'
  return L('Asignar un valor de verdad a toda la proposición compuesta.', 'V significa verdadero y F falso. ¬ invierte un valor; ∧ exige que ambos sean verdaderos; ∨ exige que al menos uno sea verdadero. p→q solo es falso en el caso p=V y q=F.',[
   S('Copiamos los valores dados','No hay que adivinar proposiciones: el enunciado ya asigna sus valores.',f'p={v(p)}, q={v(q)}, r={v(r)}'),
   S('Resolvemos la implicación interior','Aplicamos la regla de p→q y llamamos I al resultado para no repetir el cálculo.',f'I=(p→q)={v(imp)}'),
   S('Calculamos las negaciones','Una negación cambia V por F y F por V.',f'¬r={v(neg)}; ¬I={v(not imp)}'),
   S('Resolvemos el primer bloque','Una conjunción ∧ solo vale V si los dos valores son V.',f'I ∧ ¬r = {v(imp)} ∧ {v(neg)} = {v(first)}'),
   S('Resolvemos el segundo bloque','Usamos la misma regla, ahora con la negación de la implicación y r.',f'¬I ∧ r = {v(not imp)} ∧ {v(r)} = {v(second)}'),
   S('Unimos ambos bloques con ∨','La disyunción final será verdadera si alguno de los bloques es verdadero.',f'{v(first)} ∨ {v(second)} = {v(out)}')],
   'No interpretes p→q como si fuera p∧q. Son conectores distintos y tienen tablas de verdad diferentes.',f'La expresión completa vale {v(out)}. El cálculo se hizo desde los paréntesis interiores hacia el conector final.')
 if f=='multiplos':
  m,div,limit=d['multiple'],d['step'],d['limit'];A=list(range(m,limit+1,m));B=list(range(div,limit+1,div))
  return L('Encontrar los números que pertenecen a los dos conjuntos de múltiplos.', 'Un múltiplo positivo se obtiene multiplicando un número por 1, 2, 3… La intersección A∩B conserva solo los que están en ambos. No se suman los elementos ni se mezclan todas las listas.',[
   S('Formamos A sin superar el límite',f'Multiplicamos {m} por enteros positivos y nos detenemos en {limit}.',f'A={aset(A)}'),
   S('Formamos B del mismo modo',f'Los múltiplos de {div} permitidos por el límite son los siguientes.',f'B={aset(B)}'),
   S('Comparamos las listas',f'{div} es {div//m} veces {m}; por eso cada múltiplo de {div} también es múltiplo de {m}. Todos los elementos de B están en A.'),
   S('Escribimos solamente los comunes','Como B está contenido en A, la intersección es B.',f'A∩B={aset(set(A)&set(B))}')],
   'Si un número aparece solo en A, no puede quedar en una intersección aunque sea un múltiplo válido.',f'Cada número del resultado debe ser divisible entre {m} y entre {div}, y no debe exceder {limit}.')
 if f=='razon':
  a,b=d['a'],d['b'];result=Fraction(b,a)
  return L('Encontrar la razón x/y sin calcular por separado las dos letras.', 'x/y pregunta cuántas unidades de y corresponden a x. Para encontrar esa razón podemos reorganizar la ecuación; dividir ambos miembros entre la misma cantidad distinta de cero mantiene la igualdad.',[
   S('Separamos los dos términos','Sumamos el término que lleva y a ambos lados.',f'{a}x−{b}y=0 → {a}x={b}y'),
   S('Dividimos ambos lados entre y','Se permite porque el enunciado indica y≠0. En el lado derecho, y/y=1.',f'{a}·(x/y)={b}'),
   S('Quitamos el coeficiente de la razón',f'El {a} multiplica a x/y. Dividimos ambos lados entre {a}.',f'x/y={b}/{a}'),
   S('Simplificamos si hay factores comunes','Dividimos numerador y denominador por el mismo factor, sin alterar el valor.',f'x/y={frac(result)}')],
   'La razón pedida es x/y, no y/x. Invertir la fracción da una respuesta diferente.',f'Al multiplicar {frac(result)} por {a} se recupera {b}, que era la condición anterior.')
 if f=='operaciones-polinomios':
  a,b,c,k=[d[x] for x in ['a','b','c','intercept']];ab=a*b;ab2=a*b*b;const=c*b-k
  return L('Multiplicar los polinomios y agrupar términos con la misma potencia de x.', 'Distribuir significa multiplicar cada término del primer paréntesis por cada término del segundo. Después solo se suman los términos semejantes: x³ con x³, x² con x², x con x y constantes con constantes.',[
   S('Multiplicamos el primer paréntesis por x','La x multiplica cada uno de los tres términos.',f'{a}x³−{ab}x²+{c}x'),
   S('Lo multiplicamos por la constante del segundo paréntesis',f'Ahora repetimos la distribución con {b}.',f'+{ab}x²−{ab2}x+{c*b}'),
   S('Sumamos esos productos','Los términos de x² son opuestos y se cancelan. El coeficiente de x queda como una resta.',f'{a}x³ + ({c}−{ab2})x + {c*b}'),
   S('Incluimos los términos que estaban fuera del producto',f'Agregamos +{ab2}x y restamos {const}. No hay que olvidarlos al terminar la multiplicación.',f'{a}x³+({c}−{ab2}+{ab2})x+({c*b}−{const})'),
   S('Reducimos cada grupo','Los coeficientes de x y la constante se calculan por separado.',f'{c}−{ab2}+{ab2}={c}; {c*b}−{const}={k} → {a}x³+{c}x+{k}')],
   'Tener x² y x no los hace términos semejantes. Sus exponentes deben coincidir para poder sumarlos.',f'Con x=0 la expresión original da {c*b}−{const}={k}; el resultado simplificado también da {k}.')
 raise ValueError('No mathematics lesson for '+f)
