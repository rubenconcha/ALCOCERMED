from teaching_common import num,frac,F,step as S,lesson as L

def explain(f,d):
 if f=='masa-molar':
  counts=d['composition'];masses=d['atomicMasses'];parts=[F(masses[e])*n for e,n in counts.items()];M=sum(parts)
  return L('Sumar la masa de todos los átomos indicados por la fórmula para hallar la masa de un mol.', 'La masa molar, en g/mol, dice cuántos gramos pesa un mol de la sustancia. Un subíndice señala cuántos átomos hay de ese elemento; si no se escribe subíndice, se cuenta 1. Un número fuera de un paréntesis multiplica los átomos de dentro.',[
   S('Contamos los átomos de cada elemento','Leemos los símbolos y sus subíndices antes de sumar masas.', '; '.join(f'{e}: {n} átomo'+('s' if n!=1 else '') for e,n in counts.items())),
   S('Buscamos las masas que proporciona el ejercicio','No todos los elementos pesan lo mismo. Usamos el valor indicado para cada símbolo.', '; '.join(f'{e}: {num(masses[e])} g/mol' for e in counts)),
   S('Calculamos el aporte de cada elemento','Cada masa se multiplica por cuántas veces aparece ese átomo en la fórmula.', '; '.join(f'{n}×{num(masses[e])}={num(F(masses[e])*n)}' for e,n in counts.items())),
   S('Sumamos todos los aportes','La molécula o unidad de fórmula contiene todos esos elementos, no solo el primero.', 'M = '+' + '.join(num(v) for v in parts)+f' = {num(M)} g/mol'),
   S('Interpretamos el resultado',f'Un mol de la sustancia tiene una masa de {num(M)} g. Eso no significa que un solo átomo o una sola molécula pese esos gramos.')],
   'No sumes cada elemento una sola vez si su subíndice es mayor que 1. Por ejemplo, O₄ aporta cuatro veces la masa del oxígeno.',f'Cada elemento de la fórmula aparece una vez en nuestra lista de aportes, multiplicado por su cantidad de átomos. La suma es {num(M)} g/mol.')
 if f=='numero-atomos':
  grams,M,NA=[F(d[k]) for k in ['grams','molarMass','NAfactor']];moles=grams/M;factor=moles*NA;power=23;norm=factor
  while norm<1:norm*=10;power-=1
  while norm>=10:norm/=10;power+=1
  return L('Pasar de gramos de un elemento al número de átomos que contienen.', 'Un mol es una unidad para contar una cantidad enorme de partículas: Nₐ=6,022×10²³ por mol, según el dato del ejercicio. La masa molar M dice los gramos que corresponden a 1 mol. Primero convertimos gramos a moles y después moles a átomos.',[
   S('Identificamos las dos equivalencias',f'{num(M)} g del elemento corresponden a 1 mol, y cada mol contiene {num(NA)}×10²³ átomos.'),
   S('Convertimos la masa en moles','Si conocemos gramos y cada mol pesa M gramos, dividimos la masa entre M.',f'n=m/M={num(grams)}/{num(M)}≈{num(moles,8)} mol'),
   S('Multiplicamos por los átomos de cada mol','El mol se cancela como unidad: mol×átomos/mol=átomos.',f'N=n·Nₐ=({num(grams)}/{num(M)})×{num(NA)}×10²³'),
   S('Calculamos la parte numérica','Se puede multiplicar y dividir los números sin escribir por completo la enorme cantidad de ceros.',f'({num(grams)}×{num(NA)})/{num(M)}≈{num(factor,8)} → N≈{num(factor,8)}×10²³'),
   S('Acomodamos la notación científica si hace falta','El coeficiente normalizado va de 1 a menos de 10. Si lo multiplicamos por 10, bajamos el exponente en 1 para conservar el valor.',f'N≈{num(norm,6)}×10^{power} átomos')],
   'Los gramos no se multiplican directamente por Nₐ: antes hay que convertirlos a moles dividiendo por la masa molar.',f'La proporción m/M={num(moles)} indica cuántas veces tenemos la cantidad de un mol; por eso el número de átomos es esa misma proporción de Nₐ.')
 if f=='masa-moleculas':
  n,M=F(d['moles']),F(d['M']);mass=n*M;factor=n*F('6.022')
  return L('Obtener dos resultados a partir de la misma cantidad de moles: masa y número de unidades.', 'Un mol permite dos conversiones diferentes: M gramos por mol y Nₐ unidades por mol. La masa y la cantidad de partículas no son la misma magnitud; se calculan por separado, sin mezclar sus unidades.',[
   S('Separamos lo que nos piden',f'Nos dan n={num(n)} mol y M={num(M)} g/mol. Buscamos una masa en gramos y un conteo de unidades.'),
   S('Elegimos la conversión de moles a gramos','Cada mol pesa M gramos. Si tenemos n moles, multiplicamos n por M.', 'm=n·M'),
   S('Calculamos la masa','La unidad mol se cancela y queda g.',f'm={num(n)}×{num(M)}={num(mass)} g'),
   S('Elegimos la conversión de moles a unidades','Cada mol contiene Nₐ unidades. Esta vez no usamos la masa molar.',f'N=n·Nₐ={num(n)}×6,022×10²³'),
   S('Multiplicamos el coeficiente y conservamos la potencia','El 10²³ sigue multiplicando todo el resultado numérico.',f'{num(n)}×6,022={num(factor,6)} → N={num(factor,6)}×10²³ unidades'),
   S('Unimos las dos respuestas','La masa lleva g; el conteo se expresa en moléculas o unidades de fórmula, según el enunciado. Elegimos la alternativa que coincida en ambas partes.',f'Masa={num(mass)} g; cantidad={num(factor,6)}×10²³ unidades')],
   'Una alternativa puede tener la masa correcta y el conteo incorrecto. Hay que revisar las dos cantidades.',f'La masa dividida entre M recupera {num(n)} mol. El conteo dividido entre Nₐ también recupera {num(n)} mol.')
 if f=='pureza':
  sample,vol,Vm,M=[F(d[k]) for k in ['sampleKg','volumeM3','molarVolume','M']];litres=vol*1000;co2=litres/Vm;oxide=co2/3;grams=oxide*M;kg=grams/1000;percentage=kg/sample*100
  return L('Calcular qué parte de la muestra era realmente Fe₂O₃.', 'La muestra puede contener impurezas. Solo la masa que corresponde al Fe₂O₃ que reaccionó cuenta como masa pura. Pureza=(masa pura/masa total)×100. Usaremos el gas producido para retroceder hasta la cantidad de óxido.',[
   S('Convertimos el volumen a litros','El volumen molar está en L/mol. Un metro cúbico contiene 1000 litros.',f'V={num(vol)} m³×1000={num(litres)} L'),
   S('Calculamos los moles de CO₂','Según el dato, cada mol ocupa 22,4 L en las condiciones del ejercicio. Dividimos el volumen entre lo que ocupa cada mol.',f'n(CO₂)=V/Vm={num(litres)}/{num(Vm)}={num(co2)} mol'),
   S('Leemos la proporción de la reacción','Fe₂O₃+3CO→2Fe+3CO₂ indica que 1 mol de Fe₂O₃ origina 3 mol de CO₂. Para retroceder del gas al óxido dividimos entre 3.',f'n(Fe₂O₃)={num(co2)}/3={num(oxide)} mol'),
   S('Convertimos los moles de óxido a gramos','Multiplicamos los moles por su masa molar.',f'm pura={num(oxide)}×{num(M)}={num(grams)} g'),
   S('Ponemos ambas masas en la misma unidad','La muestra está en kg. Dividimos la masa pura en gramos entre 1000.',f'm pura={num(grams)}/1000={num(kg)} kg'),
   S('Calculamos la fracción pura','Dividimos la masa de Fe₂O₃ entre toda la muestra.',f'm pura/m total={num(kg)}/{num(sample)}={num(kg/sample)}'),
   S('La expresamos como porcentaje','Multiplicar por 100 transforma la fracción en una cantidad por cada 100 partes.',f'Pureza={num(kg/sample)}×100={num(percentage)} %')],
   'No dividas gramos de óxido entre kilogramos de muestra sin convertirlos. Tampoco olvides la proporción 1 a 3 entre óxido y CO₂.',f'La masa pura {num(kg)} kg no supera los {num(sample)} kg de muestra. El porcentaje queda entre 0 y 100.')
 if f=='balance-aluminio':
  al=F(d['alMoles']);numer=al*3;oxygen=numer/4
  return L('Calcular los moles de oxígeno que reaccionan con la cantidad dada de aluminio.', 'Balancear es poner números delante de las fórmulas para que haya la misma cantidad de cada átomo a ambos lados. Esos números, llamados coeficientes, también indican proporciones entre moles. No se cambian los subíndices de las sustancias.',[
   S('Contamos los oxígenos','O₂ tiene 2 oxígenos y Al₂O₃ tiene 3. El menor número que se puede formar con grupos de 2 y de 3 es 6.'),
   S('Ponemos 6 oxígenos en cada lado','Hacen falta 3O₂ y 2Al₂O₃. Estas dos unidades de óxido contienen en total 4 átomos de Al.', '4Al+3O₂→2Al₂O₃'),
   S('Leemos la relación que nos sirve','Por cada 4 mol de Al, se necesitan 3 mol de O₂. El factor de conversión es 3/4.', 'n(O₂)=n(Al)×(3/4)'),
   S('Reemplazamos los moles de aluminio','Multiplicamos primero por el numerador y después dividimos entre el denominador.',f'{num(al)}×3={num(numer)}; {num(numer)}/4={num(oxygen)} mol'),
   S('Escribimos el nombre de la sustancia en la respuesta','El resultado es de O₂, no de Al ni del óxido.',f'n(O₂)={num(oxygen)} mol')],
   'El 3/4 sale de los coeficientes de O₂ y Al, no de los subíndices de una sola fórmula.',f'n(O₂)/n(Al) debe ser 3/4. Con {num(oxygen)} y {num(al)}, esa proporción se cumple.')
 if f=='masa-atomica':
  atomic,NA=F(d['atomicMass']),F(d['NAfactor']);coef=atomic/NA
  return L('Encontrar la masa de un solo átomo a partir de la masa de un mol.', 'La masa molar corresponde a muchísimos átomos juntos: un mol contiene Nₐ átomos. Para repartir la masa de ese conjunto entre sus átomos, dividimos. La masa de un solo átomo debe ser una cantidad muy pequeña de gramos.',[
   S('Escribimos qué significa la masa molar',f'Un conjunto de {num(NA)}×10²³ átomos pesa {num(atomic)} g.'),
   S('Repartimos la masa entre el número de átomos','Es la misma idea que dividir una masa total entre cuántas unidades contiene.',f'm de 1 átomo={num(atomic)}/({num(NA)}×10²³) g'),
   S('Dividimos los coeficientes','Primero hacemos la cuenta numérica sin perder la potencia de diez.',f'{num(atomic)}/{num(NA)}≈{num(coef,6)}'),
   S('Aplicamos el exponente negativo','Dividir entre 10²³ equivale a multiplicar por 10⁻²³. El signo negativo indica un número muy pequeño.',f'm≈{num(coef,6)}×10⁻²³ g'),
   S('Elegimos la aproximación que corresponde','Comparamos el coeficiente y el exponente de las alternativas. Ambos deben coincidir o ser la aproximación indicada.')],
   'Multiplicar la masa molar por Nₐ haría la cantidad todavía más grande; para hallar un solo átomo necesitamos dividir.',f'Al multiplicar la masa por átomo sin redondear por Nₐ, vuelve a obtenerse la masa de un mol: {num(atomic)} g.')
 if f=='combustion-etano':
  V,Vm,M=[F(d[k]) for k in ['co2Litres','Vm','ethaneM']];gas=V/Vm;fuel=gas/2;grams=fuel*M
  return L('Encontrar cuántos gramos de etano se necesitan para producir el CO₂ indicado.', 'La reacción relaciona moles, no litros directamente con gramos. Por eso seguimos tres conversiones: litros de CO₂ → moles de CO₂ → moles de etano → gramos de etano.',[
   S('Convertimos los litros de CO₂ en moles','Cada mol de gas ocupa el volumen que indica el ejercicio en CN.',f'n(CO₂)=V/Vm={num(V)}/{num(Vm)}={num(gas)} mol'),
   S('Leemos los coeficientes de ambas sustancias','En 2C₂H₆+7O₂→4CO₂+6H₂O, dos moles de etano producen cuatro de CO₂.', 'Relación etano/CO₂=2/4=1/2'),
   S('Calculamos los moles de etano','Usamos la mitad de los moles de CO₂ porque cada mol de etano produce dos de CO₂.',f'n(C₂H₆)={num(gas)}×(2/4)={num(fuel)} mol'),
   S('Pasamos de moles de etano a masa','La masa molar es el número de gramos de cada mol. Multiplicamos por ella.',f'm=n·M={num(fuel)}×{num(M)}={num(grams)} g'),
   S('Respondemos en la unidad solicitada','Nos pidieron gramos de etano: el número de litros inicial y el de moles intermedio todavía no eran la respuesta.')],
   'Invertir 2/4 por 4/2 duplica en vez de reducir los moles y lleva a una masa incorrecta.',f'Los {num(fuel)} mol de etano producirían {num(2*fuel)} mol de CO₂; multiplicados por {num(Vm)} L/mol recuperan {num(V)} L.')
 if f=='dicromato-yodo':
  iodine,Md,Mi=[F(d[k]) for k in ['iodineG','dichromateM','iodineM']];ni=iodine/Mi;nd=ni/3;mass=nd*Md
  return L('Calcular la masa de dicromato necesaria para obtener la masa de yodo indicada.', 'Los coeficientes de una reacción balanceada comparan moles. Primero convertimos los gramos de yodo a moles; luego usamos la relación de reacción, y al final volvemos a gramos de la sustancia que nos piden.',[
   S('Identificamos las sustancias que vamos a relacionar','En la ecuación, K₂Cr₂O₇ tiene coeficiente 1 y I₂ tiene coeficiente 3. Las otras sustancias ayudan a balancear, pero no entran en esta conversión.', '1 mol de K₂Cr₂O₇ → 3 mol de I₂'),
   S('Convertimos gramos de yodo en moles','La masa molar de I₂ corresponde a la molécula de dos átomos, no a un átomo I.',f'n(I₂)={num(iodine)}/{num(Mi)}≈{num(ni,8)} mol'),
   S('Retrocedemos del yodo al dicromato','Si un mol de dicromato da tres de yodo, necesitamos la tercera parte de moles de dicromato.',f'n(K₂Cr₂O₇)=({num(iodine)}/{num(Mi)})×(1/3)≈{num(nd,8)} mol'),
   S('Convertimos esos moles de dicromato a gramos','Multiplicamos por la masa molar de K₂Cr₂O₇.',f'm=({num(iodine)}/{num(Mi)})×(1/3)×{num(Md)}≈{num(mass,2)} g'),
   S('Redondeamos sin cortar los pasos anteriores','Usar la expresión completa en la calculadora evita acumular errores por redondear los moles antes de tiempo.')],
   'No compares gramos con los coeficientes 1 y 3: la relación 1:3 es entre moles.',f'La cadena cancela unidades: g de I₂ × mol I₂/g I₂ × mol dicromato/mol I₂ × g dicromato/mol dicromato = g de dicromato.')
 if f=='nitrogeno-alanina':
  grams,M,Vm=[F(d[k]) for k in ['alanineG','M','Vm']];n=grams/M;nitrogen=n/2;V=nitrogen*Vm
  return L('Calcular el volumen de N₂ que se forma con la alanina disponible.', 'La fórmula C₃H₇NO₂ contiene un átomo de N por unidad de alanina. Una molécula de N₂ necesita dos átomos de N. Por eso dos moles de alanina producen un mol de N₂, no dos.',[
   S('Pasamos la masa de alanina a moles','Dividimos entre los gramos que pesa cada mol.',f'n(alanina)=m/M={num(grams)}/{num(M)}≈{num(n,8)} mol'),
   S('Contamos cómo se agrupa el nitrógeno','Cada alanina aporta un N; cada N₂ agrupa dos N. Necesitamos dos unidades de alanina por cada unidad de N₂.', '2 mol de alanina → 1 mol de N₂'),
   S('Calculamos los moles de gas','Dividimos entre 2 la cantidad de moles de alanina.',f'n(N₂)=({num(grams)}/{num(M)})/2≈{num(nitrogen,8)} mol'),
   S('Convertimos los moles del gas en litros','En las condiciones dadas, cada mol de N₂ ocupa el volumen molar Vm.',f'V=n·Vm=({num(grams)}/{num(M)})×(1/2)×{num(Vm)}≈{num(V,2)} L'),
   S('Verificamos qué volumen se está dando','El volumen calculado es del N₂ formado; no es un volumen de alanina ni de todos los productos juntos.')],
   'No olvides el 1/2 por agrupar el nitrógeno en N₂. Sin él, el volumen sale el doble.',f'Por cada mol de alanina solo puede formarse medio mol de N₂. El cálculo conserva la misma cantidad de átomos de N.')
 if f=='comparar-atomos':
  rows=d['samples'];values=[F(r['grams'])/F(r['M']) for r in rows];index=max(range(len(rows)),key=lambda i:values[i])
  return L('Decidir cuál muestra contiene más átomos, no cuál pesa más.', 'Cada mol de cualquier elemento contiene el mismo número Nₐ de átomos. Así, más moles significan más átomos. Para comparar no hace falta multiplicar cinco veces por ese enorme número; basta calcular m/M en cada caso.',[
   S('Distinguimos masa y cantidad de átomos','Unos átomos tienen más masa que otros. Por eso la muestra con más gramos no es necesariamente la que contiene más átomos.'),
   S('Usamos la misma conversión en todas las muestras','Dividimos la masa de cada muestra entre su propia masa molar.', 'n=m/M'),
   S('Calculamos la cantidad de cada elemento','Todas las cantidades siguientes están en moles; ahora sí son comparables.', '\n'.join(f'{r["element"]}: {num(F(r["grams"]))}/{num(F(r["M"]))}={num(v)} mol' for r,v in zip(rows,values))),
   S('Elegimos el valor mayor',f'La mayor cantidad es {num(values[index])} mol y corresponde a {rows[index]["element"]}.'),
   S('Lo relacionamos con los átomos','Todas las cantidades se multiplicarían por el mismo Nₐ positivo. Eso no cambia cuál es la mayor.')],
   'No elijas solo por los gramos ni solo por la masa molar cuando las muestras tienen masas distintas: hay que usar la razón m/M.',f'La muestra elegida tiene el mayor resultado de m/M; por eso también tiene el mayor número de átomos.')
 if f=='descomposicion-hgo':
  n=F(d['hgoMoles']);oxygen=n/2
  return L('Usar una reacción balanceada para calcular cuánto O₂ se forma.', 'En 2HgO→2Hg+O₂, el número 2 delante de HgO cuenta unidades o moles de esa sustancia. El subíndice 2 de O₂ dice que cada molécula de oxígeno tiene dos átomos. Coeficiente y subíndice cumplen funciones distintas.',[
   S('Leemos de dónde sale el oxígeno','Cada HgO aporta un átomo de O. Para formar una molécula O₂ se necesitan dos de esos átomos.'),
   S('Comprobamos los coeficientes', 'Dos HgO aportan 2 Hg y 2 O. A la derecha, 2Hg y un O₂ conservan esos mismos átomos.', '2 mol HgO → 1 mol O₂'),
   S('Armamos el factor de conversión','Como vamos de HgO a O₂, ponemos O₂ arriba y HgO abajo para cancelar la sustancia inicial.', 'n(O₂)=n(HgO)×(1 mol O₂/2 mol HgO)'),
   S('Reemplazamos y dividimos','Se forma la mitad de moles de O₂ que los moles de HgO consumidos.',f'n(O₂)={num(n)}/2={num(oxygen)} mol')],
   'El 2 escrito dentro de O₂ no significa que debas multiplicar por 2 los moles del gas. Hay que usar la relación balanceada 1/2.',f'El gas contiene {num(2*oxygen)} mol de átomos de O, igual a lo aportado por {num(n)} mol de HgO.')
 if f=='neutralizacion':
  acid=F(d['acidMoles']);water=2*acid
  return L('Determinar los moles de agua producidos por una neutralización.', 'La ecuación balanceada H₂SO₄+Ca(OH)₂→CaSO₄+2H₂O indica qué cantidades reaccionan. El coeficiente omitido es 1. Por cada mol del ácido aparecen dos moles de agua, siempre que haya suficiente base.',[
   S('Señalamos reactivo y producto de interés','Partimos de H₂SO₄ y queremos H₂O. No necesitamos convertir a gramos porque las dos cantidades se relacionan en moles.'),
   S('Leemos sus coeficientes','El ácido tiene coeficiente 1; el agua, coeficiente 2.', '1 mol H₂SO₄ → 2 mol H₂O'),
   S('Multiplicamos por la relación producto/reactivo','El factor 2/1 significa el doble de moles de agua.',f'n(H₂O)={num(acid)}×(2/1)'),
   S('Calculamos y nombramos la sustancia','Una cantidad de moles siempre debe indicar de qué sustancia se habla.',f'n(H₂O)={num(water)} mol'),
   S('Revisamos la condición del enunciado','La base es suficiente y el ácido se neutraliza por completo. Por eso podemos usar todo el ácido dado.')],
   'No uses la cantidad de átomos de una fórmula como si fuera un coeficiente de reacción. Aquí el 2 útil está delante de H₂O.',f'La razón agua/ácido queda {num(water)}/{num(acid)}=2, como indica la ecuación.')
 if f=='sustitucion-magnesio':
  grams,M=F(d['magnesiumG']),F(d['M']);mol=grams/M
  return L('Pasar de gramos de magnesio a los moles de hidrógeno producidos.', 'La reacción Mg+H₂SO₄→MgSO₄+H₂ tiene coeficiente 1 en cada sustancia. Eso relaciona moles de Mg con moles de H₂ en proporción 1:1; no dice que sus masas en gramos sean iguales.',[
   S('Convertimos el Mg a moles','Cada mol de Mg pesa la masa molar indicada. Por eso dividimos los gramos entre esa masa.',f'n(Mg)={num(grams)}/{num(M)}={num(mol)} mol'),
   S('Leemos el factor de la reacción','Un mol de Mg produce un mol de H₂, cuando el ácido es suficiente.', '1 mol Mg → 1 mol H₂'),
   S('Aplicamos la proporción','La cantidad numérica de moles no cambia porque el factor es 1/1.',f'n(H₂)={num(mol)}×(1/1)={num(mol)} mol'),
   S('Respondemos en moles de hidrógeno','No hace falta otra masa molar: no nos pidieron gramos de H₂ ni su volumen.')],
   'Moles iguales no significan gramos iguales. La igualdad 1:1 se toma de los coeficientes de la reacción.',f'El ácido suficiente permite consumir todo el Mg, de modo que {num(mol)} mol de Mg producen {num(mol)} mol de H₂.')
 if f=='composicion':
  comp=d['composition'];units=d['units'];per=sum(comp.values());total=per*units
  return L('Contar todos los átomos representados por varias unidades de una fórmula.', 'Un símbolo distinto identifica un elemento. Su subíndice indica cuántos átomos de ese elemento hay por unidad. No es lo mismo contar elementos diferentes que contar todos los átomos; en este problema se piden átomos.',[
   S('Leemos cada símbolo con su subíndice','Si no tiene número pequeño, cuenta 1. Un número fuera de paréntesis multiplica a cada símbolo dentro.', '; '.join(f'{e}: {n} átomo'+('s' if n!=1 else '') for e,n in comp.items())),
   S('Sumamos los átomos de una sola unidad','La suma incluye los átomos repetidos de cada elemento.', '+'.join(str(n) for n in comp.values())+f'={per} átomos por unidad'),
   S('Multiplicamos por la cantidad de unidades',f'Hay {units} copias de la misma composición; cada una aporta {per} átomos.',f'{units}×{per}={total} átomos'),
   S('Distinguimos la respuesta de otros conteos',f'La fórmula tiene {len(comp)} elementos diferentes, pero eso no responde cuántos átomos hay en {units} unidades.')],
   'Contar solo las letras distintas daría el número de elementos, no el número total de átomos.',f'Contar {units} veces todos los átomos de una unidad produce el mismo total: {total}.')
 if f=='orbitales':
  n=d['orbitals'];capacity=n*d['perOrbital']
  return L('Calcular la capacidad máxima de un conjunto de orbitales.', 'Un orbital no es lo mismo que un electrón. Aquí contamos cuántos electrones pueden ocupar los orbitales dados. Cada orbital admite como máximo dos electrones. El enunciado pregunta cuántos caben, no cuántos hay realmente.',[
   S('Identificamos la cantidad de orbitales',f'El conjunto tiene {n} orbitales. Ese es el número de lugares cuya capacidad debemos sumar.'),
   S('Anotamos la capacidad por orbital','El límite de dos electrones se aplica por separado a cada orbital.', 'Máximo por orbital=2 electrones'),
   S('Multiplicamos cantidad por capacidad','Si cada uno admite 2, sumamos 2 tantas veces como orbitales hay.',f'{n}×2={capacity} electrones'),
   S('Interpretamos el máximo','No afirmamos que todos estén ocupados: solo calculamos el límite si se llenaran.')],
   'No confundas el número de orbitales con el número de electrones. Cada orbital aporta capacidad para dos.',f'Si repartimos los {capacity} electrones entre {n} orbitales completos, tocan 2 por orbital y se respeta el límite.')
 if f=='unidad-masa':
  ratio=d['ratioToC12'];u=12*ratio
  return L('Expresar una masa en unidades de masa atómica a partir del carbono-12.', 'La unidad u se define como la doceava parte de la masa de un átomo de carbono-12. Eso significa que el átomo completo de carbono-12 tiene masa 12 u. No confundas un átomo completo con la fracción usada para definir la unidad.',[
   S('Partimos de la definición','Doce partes iguales de tamaño 1 u reconstruyen un átomo de carbono-12 en esta escala.', 'Masa de carbono-12=12 u'),
   S('Leemos cuántas veces esa masa tiene el átomo del problema',f'El enunciado dice {ratio} veces la masa completa de carbono-12, no {ratio} veces una sola u.'),
   S('Sustituimos la equivalencia','Reemplazamos la masa del carbono-12 por sus 12 u.',f'Masa buscada={ratio}×12 u'),
   S('Hacemos la multiplicación','El resultado se expresa en u; no se convirtió todavía a gramos.',f'Masa={u} u')],
   'Dividir otra vez entre 12 invertiría la equivalencia. Cada masa completa de carbono-12 aporta 12 u.',f'{u} u dividido entre 12 u da {ratio}, el número de masas de carbono-12 indicado.')
 if f=='balance-oxigeno-yodo':
  n=F(d['co2Moles']);product=n/5
  return L('Balancear la ecuación propuesta y calcular los moles de I₂O₅.', 'Balancear conserva la cantidad de átomos de cada elemento. No se cambian los subíndices de CO₂, CO o I₂O₅; se buscan coeficientes que indiquen cuántas unidades de cada sustancia hay.',[
   S('Comparamos CO₂ con CO','Cada CO₂ que pasa a CO deja un átomo de O disponible. Para aportar los 5 oxígenos de I₂O₅ hacen falta 5 CO₂ y se obtienen 5 CO.'),
   S('Balanceamos también el yodo','Una unidad I₂O₅ contiene dos I, por lo que necesita una unidad I₂.', '5CO₂+I₂→5CO+I₂O₅'),
   S('Comprobamos los átomos','Izquierda: 5 C, 10 O y 2 I. Derecha: 5 C, 5+5=10 O y 2 I. Ahora los coeficientes pueden usarse para comparar moles.'),
   S('Leemos la relación requerida','Por cada 5 mol de CO₂ se forma 1 mol de I₂O₅.', 'n(I₂O₅)=n(CO₂)×(1/5)'),
   S('Calculamos con el dato','Dividimos los moles de CO₂ entre cinco.',f'n(I₂O₅)={num(n)}/5={num(product)} mol')],
   'Usar los subíndices como si fueran coeficientes o cambiar la fórmula para balancear modifica las sustancias del ejercicio.',f'{num(product)} mol de I₂O₅ requieren {num(product*5)} mol de CO₂, que es la cantidad dada.')
 if f=='fraccion-masica':
  mass,M,oxygen=[F(d[k]) for k in ['compoundMass','M','oxygenPerMole']];fraction=oxygen/M;result=mass*fraction
  return L('Calcular qué parte de la masa de la muestra corresponde al oxígeno.', 'La masa molar incluye todos los elementos del compuesto. Si de cada M gramos del compuesto una parte es oxígeno, esa misma proporción se conserva en cualquier cantidad de la muestra.',[
   S('Separamos masa total y aporte del oxígeno',f'Cada {num(M)} g de compuesto contienen {num(oxygen)} g de oxígeno. El resto corresponde a los otros elementos.'),
   S('Construimos la fracción de masa','Para expresar una parte del total, dividimos masa de oxígeno entre masa total del compuesto.',f'Fracción de oxígeno={num(oxygen)}/{num(M)}≈{num(fraction,8)}'),
   S('Aplicamos la fracción a la muestra','La muestra puede tener una masa distinta de un mol; su composición relativa sigue siendo la misma.',f'm(O)={num(mass)}×({num(oxygen)}/{num(M)})'),
   S('Calculamos sin redondear antes de tiempo','Se puede hacer la cuenta como (masa de muestra×aporte de O)/masa molar.',f'm(O)=({num(mass)}×{num(oxygen)})/{num(M)}={num(result)} g'),
   S('Comprobamos que es una parte, no todo','La masa de oxígeno debe ser menor que la masa completa de la muestra, porque también hay otros elementos.')],
   'Dividir la masa entre el subíndice 4 no da la fracción de oxígeno: los elementos tienen masas diferentes.',f'{num(result)} g es menor que {num(mass)} g y conserva la proporción {num(oxygen)}/{num(M)} de la composición.')
 raise ValueError('No chemistry lesson for '+f)
