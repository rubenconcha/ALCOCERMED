"""New practice variations explicitly anchored to the user-authorized ABP exam.

The original, reviewed bank is immutable input. Every variation has its own
worked comment, source page, parent question and deterministic answer order.
"""
from pathlib import Path
from fractions import Fraction as F
import json, math, random, copy, collections, sys
sys.stdout.reconfigure(encoding='utf8')
HERE=Path(__file__).resolve().parents[2]/'tmp'/'suficiencia-build'
BANK=json.loads((HERE/'base-bank.json').read_text(encoding='utf8'))
original={q['id']:q for q in BANK['questions']}
created=[];checks=[]

def n(value,d=2):
 if isinstance(value,F):
  if value.denominator==1:return str(value.numerator).replace('-', '−')
  return f'{value.numerator}/{value.denominator}'.replace('-', '−')
 if isinstance(value,int) or float(value).is_integer():return str(int(value)).replace('-', '−')
 return f'{float(value):.{d}f}'.rstrip('0').rstrip('.').replace('.',',').replace('-', '−')

def add(subject,family,index,parent,topic,text,answer,wrong,comment,unit='',data=None):
 qid=f'practica-{subject}-{family}-{index:02d}'
 def show(v):return (n(v) if isinstance(v,(int,float,F)) else str(v))+((' '+unit) if unit else '')
 correct=show(answer);options=[]
 for v in [answer,*wrong]:
  text_option=show(v)
  if text_option not in options:options.append(text_option)
 if len(options)<5 and isinstance(answer,(int,float,F)):
  for offset in [1,-1,2,-2,5,-5,10,-10]:
   candidate=show(answer+offset)
   if candidate not in options:options.append(candidate)
   if len(options)==5:break
 assert len(options)>=4,(qid,options)
 options=options[:5]
 random.Random(qid).shuffle(options)
 source=copy.deepcopy(original[parent]['source'])
 source.update(kind='variante de práctica',parentId=parent,original=False,note='Ejercicio nuevo de AlcocerMed basado en el tipo de problema de la página indicada. No es una transcripción ni un patrón oficial.')
 if isinstance(answer,float) and abs(answer-round(answer,2))>1e-8:
  text+=' Aproxima a dos decimales.'
  comment+=f' Al redondear a dos decimales, la alternativa es {correct}.'
 created.append(dict(id=qid,subject=subject,topic=topic,text=text,options=options,correct=options.index(correct),explanation=comment,source=source,family=family))
 checks.append(dict(id=qid,subject=subject,family=family,inputs=data or {},answer=str(answer),display=correct))

def m(f,i,p,t,q,a,w,c,unit='',data=None):add('matematicas',f,i,p,t,q,a,w,c,unit,data)
def f(family,i,p,t,q,a,w,c,unit='',data=None):add('fisica',family,i,p,t,q,a,w,c,unit,data)
def c(family,i,p,t,q,a,w,comment,unit='',data=None):add('quimica',family,i,p,t,q,a,w,comment,unit,data)

def setstr(values):return '{'+', '.join(str(x) for x in sorted(set(values)))+'}'

# Mathematics: 20 problem families, eight distinct datasets each (160 new).
for i in range(1,9):
 U=set(range(1,2*i+11));A={x for x in U if x%2==0};B={x for x in U if x%3==0};C=set(range(i+1,i+8))
 result=(C|A)&(U-B)
 m('conjuntos',i,'abp-05-01','Operaciones con conjuntos',f'U={setstr(U)}, A={setstr(A)}, B={setstr(B)} y C={setstr(C)}. Calcula (C ∪ A) ∩ Bᶜ respecto de U.',setstr(result),[setstr(C&A),setstr((C|A)&B),setstr(C|A),setstr(A-B),setstr(U-result)],f'Primero se reúnen los elementos de C y A. Luego se retiran los que pertenecen a B, porque Bᶜ es su complemento en U. El resultado es {setstr(result)}.',data={'U':sorted(U),'A':sorted(A),'B':sorted(B),'C':sorted(C)})
 a=i+1;b=i+3;k=2*i+1
 # The remainder is obtained by evaluating the dividend at the divisor's root.
 polynomial=f'{a}x³+{b}x²−{k}x+{i+4}';root=i%3+1
 rem=a*root**3+b*root**2-k*root+i+4
 m('resto',i,'abp-05-05','Teorema del resto',f'¿Cuál es el resto al dividir P(x)={polynomial} entre x−{root}?',rem,[rem+root,rem-root,-rem,a+b+k+i+4],f'El divisor x−{root} se anula en x={root}. Por el teorema del resto, R=P({root})={a}·{root}³+{b}·{root}²−{k}·{root}+{i+4}={rem}. No hace falta obtener todo el cociente.',data={'coefficients':[a,b,-k,i+4],'root':root})
 d=i+1;coefs=[i+2,-(2*i+3),i+5]
 ans=f'{coefs[0]}x²−{abs(coefs[1])}x+{coefs[2]}'
 m('division',i,'abp-41-24','División algebraica',f'Simplifica [{d*coefs[0]}x⁵−{d*abs(coefs[1])}x⁴+{d*coefs[2]}x³]/({d}x³), con x≠0.',ans,[f'{coefs[0]}x²+{abs(coefs[1])}x+{coefs[2]}',f'{coefs[0]}x³−{abs(coefs[1])}x²+{coefs[2]}',f'{coefs[0]}x²−{abs(coefs[1])}x−{coefs[2]}',f'{d*coefs[0]}x²−{abs(coefs[1])}x+{coefs[2]}'],f'Se divide cada coeficiente entre {d} y se restan los exponentes de x: 5−3=2, 4−3=1 y 3−3=0. Se conserva el signo de cada término. Queda {ans}.',data={'divisor':d,'quotient':coefs})
 total=8+i;missing=3*i+12;known=[i+4,2*i+1,i+7,i+10,total+3];mean=F(sum(known)+missing,6)
 m('promedio',i,'abp-13-05','Media aritmética',f'Seis datos son {", ".join(map(str,known))} y x. Su media es {n(mean)}. ¿Cuánto vale x?',missing,[missing+6,missing-6,sum(known),sum(known)+missing],f'La suma de todos los datos debe ser 6·({n(mean)})={sum(known)+missing}. Los cinco conocidos suman {sum(known)}. Por tanto, x={sum(known)+missing}−{sum(known)}={missing}.',data={'known':known,'mean':str(mean),'size':6})
 N=40+10*i;n1=4+i;n2=6+i;n3=5+2*i;n4=3+i;N4=n1+n2+n3+n4;f1=F(n1,N);value=F(n3*n3,N)+n1+n2+n3
 m('frecuencias',i,'abp-31-40','Frecuencias',f'Una tabla tiene n₁={n1}, f₁={n(f1)}, n₂={n2}, n₄={n4} y N₄={N4}. Con n absoluta, f relativa y N acumulada, halla n₃f₃+N₃.',value,[value+n4,value-n3,F(n3,N)+n1+n2+n3,F(n3*n3,N)],f'El total es n₁/f₁={n1}/({n(f1)})={N}. N₃=N₄−n₄={N4}−{n4}={n1+n2+n3}. Se obtiene n₃={n3} y f₃={n(F(n3,N))}. Entonces n₃f₃+N₃={n3}·({n(F(n3,N))})+{n1+n2+n3}={n(value)}.',data={'N':N,'n1':n1,'n2':n2,'n3':n3,'n4':n4})
 x=i+1;y=i+3;aa=i%3+1;bb=i%4+2;rhs1=aa*x+bb*y;rhs2=2*x-y
 m('sistema',i,'abp-21-32','Sistemas lineales',f'Resuelve el sistema {aa}x+{bb}y={rhs1} y 2x−y={rhs2}.',f'x={x}; y={y}',[f'x={y}; y={x}',f'x=−{x}; y={y}',f'x={x}; y=−{y}',f'x={x+1}; y={y-1}'],f'De la segunda ecuación, y=2x−({rhs2}). Se sustituye en la primera: ({aa}+2·{bb})x={rhs1}+{bb}·({rhs2}), de donde x={x}. Al reemplazar en y=2x−({rhs2}), y={y}. Ambos valores satisfacen las dos ecuaciones.',data={'matrix':[[aa,bb],[2,-1]],'rhs':[rhs1,rhs2]})
 scale=i+1;u=i+2;v=i+5
 # Difference of two squares with two unequal linear factors.
 r1=F(v+u,scale+1);r2=F(v-u,scale+3);diff=abs(r1-r2)
 m('raices',i,'abp-21-39','Ecuaciones cuadráticas',f'Halla la diferencia positiva entre las raíces de [({scale+2})x−{v}]²−(x+{u})²=0.',diff,[r1+r2,-diff,2*diff,F(u+v,scale+1)],f'Se usa A²−B²=(A−B)(A+B). Los factores son ({scale+1})x−({v+u}) y ({scale+3})x−({v-u}). Las raíces correctas son ({v+u})/{scale+1} y ({v-u})/{scale+3}; se resta la menor de la mayor.',data={'scale':scale,'u':u,'v':v,'needsCorrection':True})
 created[-1]['explanation']+=f' La diferencia pedida es {n(diff)}.'
 k=i+2;l=i+4
 ans=f'({k}a+{l}b−c)²'
 m('trinomio',i,'abp-21-31','Productos notables',f'Factoriza {k*k}a²+{l*l}b²+c²+{2*k*l}ab−{2*k}ac−{2*l}bc.',ans,[f'({k}a−{l}b+c)²',f'({k}a+{l}b+c)²',f'({k}a−{l}b−c)²',f'({k}a+{l}b−c)³'],f'Los cuadrados corresponden a {k}a, {l}b y c. Los productos cruzados son +2·({k}a)·({l}b), −2·({k}a)c y −2·({l}b)c. Sus signos determinan {ans}.',data={'k':k,'l':l})
 base=i+1;r=1;s=2+(i%2);sol=sorted([base**r,base**s]);answer=f'x={sol[0]} o x={sol[1]}'
 m('logaritmos',i,'abp-13-10','Logaritmos',f'Resuelve log₂[({r+s})·log{base}(x)−(log{base}(x))²]=log₂({r*s}), con x>0. Aquí log{base} significa logaritmo de base {base}.',answer,[f'x={r} o x={s}',f'x=−{sol[0]} o x=−{sol[1]}',f'x={sol[0]+sol[1]}',f'x={base**(r+s)}'],f'Como los dos logaritmos externos tienen la misma base, sus argumentos se igualan. Si t=log{base}(x), entonces t²−({r+s})t+{r*s}=0=(t−{r})(t−{s}). Así, t={r} o {s}; al volver a x resultan {sol[0]} y {sol[1]}. Ambos hacen positivo el argumento externo.',data={'base':base,'roots':[r,s]})
 t=i+4;constant=t*(t-1);root_display=str(math.isqrt(t)) if math.isqrt(t)**2==t else f'√{t}'
 m('log-base-variable',i,'abp-30-34','Logaritmos con base variable',f'Resuelve log₄(x²+{constant})·log₍ₓ²₎2=1, respetando el dominio de las bases.',f'x=±{root_display}',[f'x=±{t}',f'x={root_display}',f'x=−{root_display}',f'x=±√{constant}'],f'El cambio de base convierte el producto en ln(x²+{constant})/[2ln(x²)]=1. Con z=x², z+{constant}=z². Las raíces son z={t} y z={1-t}; solo la positiva es admisible. Por tanto x=±{root_display}; x² no es 0 ni 1.',data={'t':t,'constant':constant})
 a=i+2;b=i+5
 m('termino-independiente',i,'abp-26-38','Término independiente',f'P(x)=({a}x²−{a})/{b} y Q(x)=({a}x+{a})/({b}x+{b+2}). ¿Cuál es el término independiente de P(x)/Q(x), donde esté definido?',-F(b+2,b),[F(b+2,b),-F(b,b+2),F(a,b),-(b+2)],f'Se factoriza x²−1=(x−1)(x+1). Al cancelar {a}(x+1), queda (x−1)({b}x+{b+2})/{b}. El término constante es (−1)·{b+2}/{b}={n(-F(b+2,b))}. Las cancelaciones solo se hacen en el dominio del cociente original.',data={'a':a,'b':b})
 a=i+1;ab=(i+1)*(i+2);sumcubes=(i+1)**3+(i+2)**3;offset=3*i
 m('identidad-cubica',i,'abp-13-04','Identidades algebraicas',f'Si a³+b³={sumcubes} y ab={ab}, halla (a+b)³−{3*ab}(a+b)+{offset}.',sumcubes+offset,[sumcubes-offset,3*ab+offset,sumcubes,offset],f'La identidad (a+b)³=a³+b³+3ab(a+b) permite sustituir. El término 3ab(a+b) se cancela con −{3*ab}(a+b), por lo que quedan {sumcubes}+{offset}={sumcubes+offset}.',data={'ab':ab,'cubes':sumcubes,'offset':offset})
 coefficient=i+1;power=i-5;shift=i%3+1
 result=coefficient*(10**shift)
 m('notacion-cientifica',i,'abp-36-69','Notación científica',f'Escribe {coefficient}×10^{power} + {2*coefficient}×10^{power} en notación científica normalizada.',f'{n(3*coefficient/10) if 3*coefficient>=10 else 3*coefficient}×10^{power+1 if 3*coefficient>=10 else power}',[f'{3*coefficient}×10^{2*power}',f'{coefficient}×10^{power+1}',f'{3*coefficient}×10^{power+2}',f'{2*coefficient}×10^{power}'],f'Las potencias de 10 son iguales: se suman los coeficientes, {coefficient}+{2*coefficient}={3*coefficient}. Si este coeficiente es 10 o mayor, se divide entre 10 y se aumenta en uno el exponente. La base y el valor de la cantidad no cambian.',data={'coefficient':coefficient,'power':power})
 divisor=i+2;coef=i+1;constant=i+4;x0=divisor
 rem=coef*x0*x0-constant*x0+i
 m('resto-cuadratico',i,'abp-10-36','Resto y evaluación',f'El cociente de una división es C(x)={coef}x²−{constant}x+{i}. ¿Qué resto deja C(x) al dividirlo entre x−{divisor}?',rem,[rem+divisor,rem-divisor,coef+constant+i,-rem],f'El resto de dividir C por x−{divisor} es C({divisor}). Al sustituir se obtiene {coef}·{divisor}²−{constant}·{divisor}+{i}={rem}. Que C proviniera de otra división no altera el teorema.',data={'coefficients':[coef,-constant,i],'root':divisor})
 aa=i+2;bb=i+3;cc=i+4
 ans=f'{aa*aa}x²−{bb*bb}y²−{cc*cc}z²'
 m('diferencia-cuadrados',i,'abp-41-30','Productos notables',f'Simplifica ({aa}x+{bb}y−{cc}z)({aa}x−{bb}y+{cc}z)−{2*bb*cc}yz.',ans,[f'{aa*aa}x²+{bb*bb}y²−{cc*cc}z²',f'{aa*aa}x²−{bb*bb}y²+{cc*cc}z²',f'({aa}x−{bb}y−{cc}z)²',f'{aa}x²−{bb}y²−{cc}z²'],f'Los factores son A+B y A−B, con A={aa}x y B={bb}y−{cc}z. Al desarrollar A²−B² aparece +{2*bb*cc}yz, que se cancela con el término final. Queda {ans}.',data={'a':aa,'b':bb,'c':cc})
 left=-(i+2);right=i+3
 m('inecuacion',i,'abp-13-09','Inecuaciones cuadráticas',f'Resuelve (x+{i+2})(x−{i+3})<0 en los números reales.',f'({left},{right})',[f'(−∞,{left}) ∪ ({right},+∞)',f'[{left},{right}]',f'(−∞,{right})', '∅'],f'Los ceros son x={left} y x={right}. El producto de dos factores lineales con coeficiente principal positivo es negativo entre sus ceros. Como la desigualdad es estricta, no se incluyen los extremos: ({left},{right}).',data={'roots':[left,right]})
 pp=(i>>2)&1;qq=(i>>1)&1;rr=i&1;imp=(not bool(pp)) or bool(qq);val=bool(imp)^bool(rr)
 m('logica',i,'abp-18-41','Lógica proposicional',f'Si p={"V" if pp else "F"}, q={"V" if qq else "F"} y r={"V" if rr else "F"}, evalúa [(p→q) ∧ ¬r] ∨ [¬(p→q) ∧ r].', 'V' if val else 'F',['Equivale siempre a p','No puede determinarse','Equivale siempre a q','La expresión no está definida'],f'Primero, p→q vale {"V" if imp else "F"}: una implicación solo es falsa cuando el antecedente es verdadero y el consecuente falso. La expresión total exige que (p→q) y r tengan valores distintos. Aquí sus valores son {"V" if imp else "F"} y {"V" if rr else "F"}; el resultado es {"V" if val else "F"}.',data={'p':pp,'q':qq,'r':rr})
 mult=i+2;step=(i+2)*(i+3);lim=step*3
 m('multiplos',i,'abp-36-61','Intersección de conjuntos',f'A son los múltiplos positivos de {mult} no mayores que {lim}, y B los múltiplos positivos de {step} no mayores que {lim}. ¿Cuál es A ∩ B?',setstr([step,2*step,3*step]),[setstr([mult,2*mult,3*mult]),setstr([step,2*step]),setstr([mult,step,lim]),'∅'],f'{step} es múltiplo de {mult}; por ello todo elemento de B ya pertenece a A. La intersección es B y, con el límite dado, contiene {step}, {2*step} y {3*step}.',data={'multiple':mult,'step':step,'limit':lim})
 factor=i+2;denom=3*i+4;x=i+1;y=i+4
 m('razon',i,'abp-13-06','Razones algebraicas',f'Sean x,y≠0 y {denom}x−{factor}y=0. ¿Cuánto vale x/y?',F(factor,denom),[F(denom,factor),-F(factor,denom),F(factor*factor,denom),F(factor,denom*denom)],f'Al pasar el segundo término al otro miembro, {denom}x={factor}y. Se divide entre {denom}y, que no es cero: x/y={factor}/{denom}={n(F(factor,denom))}.',data={'a':denom,'b':factor})
 intercept=i+3;aa=i+1;bb=2*i+1;cc=i+5
 # Product deliberately cancels its quadratic coefficient, then adjusts constants.
 ans=f'{aa}x³+{cc}x+{intercept}'
 m('operaciones-polinomios',i,'abp-36-73','Operaciones con polinomios',f'Simplifica ({aa}x²−{aa*bb}x+{cc})(x+{bb})+{aa*bb*bb}x−{cc*bb-intercept}.',ans,[f'{aa}x³−{cc}x+{intercept}',f'{aa}x³+{cc}x−{intercept}',f'{aa}x³+{aa*bb}x²+{intercept}',f'{aa}x²+{cc}x+{intercept}'],f'Al multiplicar, los términos de x² son +{aa*bb}x² y −{aa*bb}x², que se cancelan. El coeficiente de x del producto es {cc}−{aa*bb*bb}; el término exterior +{aa*bb*bb}x lo deja en {cc}. La constante final es {cc*bb}−({cc*bb-intercept})={intercept}. Resultado: {ans}.',data={'a':aa,'b':bb,'c':cc,'intercept':intercept})

# Physics: 21 families, eight datasets each (168 new).
for i in range(1,9):
 speed=3600*(i+1);minutes=i+2;acc=F(speed,100)/F(minutes*60)
 f('conversion-aceleracion',i,'abp-05-11','Cinemática y unidades',f'Un móvil parte del reposo y alcanza {speed} cm/s en {minutes} min con aceleración constante. Calcula su aceleración en m/s².',float(acc),[float(acc)*100,float(acc)*60,float(acc)/60,float(acc)*10],f'Se convierte primero la rapidez: {speed} cm/s={n(F(speed,100))} m/s. El intervalo es {minutes}·60={minutes*60} s. Luego a=Δv/Δt={n(F(speed,100))}/{minutes*60}={n(float(acc))} m/s².', 'm/s²',{'speedCms':speed,'minutes':minutes})
 distance1=20+5*i;distance2=30+10*i;v=4+2*i;time=F(2*distance1+distance2,v)
 f('dos-etapas',i,'abp-05-12','Movimiento en dos etapas',f'Un atleta parte del reposo y acelera uniformemente durante {distance1} m hasta {v} m/s. Después recorre otros {distance2} m a esa rapidez. ¿Cuánto tarda en total?',float(time),[float(F(distance1+distance2,v)),float(F(2*(distance1+distance2),v)),float(F(distance1,v)),float(time)+v],f'En la etapa acelerada, la rapidez media es v/2: t₁=2·{distance1}/{v}={n(F(2*distance1,v))} s. En la etapa uniforme, t₂={distance2}/{v}={n(F(distance2,v))} s. El tiempo total es t₁+t₂={n(float(time))} s.','s',{'s1':distance1,'s2':distance2,'v':v})
 mass=10+5*i;v=3+i;factor=2+i%4;energy=F(mass*(v*factor)**2,2)
 f('energia-cinetica',i,'abp-05-15','Energía cinética',f'Un cuerpo de {mass} kg lleva rapidez de {v} m/s. Su rapidez se multiplica por {factor}. ¿Cuál es su energía cinética final?',float(energy),[float(F(mass*v*v,2)),float(F(mass*v*v*factor,2)),float(mass*v*factor),float(energy)*2],f'La nueva rapidez es {v}·{factor}={v*factor} m/s. Se aplica K=mv²/2: K={mass}·({v*factor})²/2={n(energy)} J. Al multiplicar la rapidez por {factor}, la energía se multiplica por {factor*factor}.','J',{'m':mass,'v':v,'factor':factor})
 va=3+i;vb=5+i;initial=(va+vb)*(1+i%3);hours=4+i%3;separation=abs(initial-(va+vb)*hours)
 f('encuentro',i,'abp-05-16','Movimiento relativo',f'Dos móviles separados {initial} km avanzan uno hacia el otro a {va} y {vb} km/h. Continúan después de cruzarse. ¿Qué separación tienen a las {hours} h?',separation,[initial+(va+vb)*hours,(va+vb)*hours,abs(initial-(vb-va)*hours),initial],f'La separación con signo es d(t)={initial}−({va}+{vb})t. Para t={hours} h resulta {initial-(va+vb)*hours} km; su valor absoluto es {separation} km. El signo negativo solo indica que ya se cruzaron.','km',{'distance':initial,'va':va,'vb':vb,'hours':hours})
 difference=2+i%3;time=3+i;distance=F(difference*time*time,2);slow=i+2;fast=slow+difference
 f('alcance',i,'abp-11-17','Movimiento uniformemente acelerado',f'A está {n(distance)} m detrás de B. Los dos parten del reposo, simultáneamente y en el mismo sentido, con aceleraciones de {fast} y {slow} m/s². ¿Cuándo A alcanza a B?',time,[time*2,time/2,time+1,float(distance/difference)],f'La distancia relativa ganada es [(aA−aB)t²]/2. Así, {n(distance)}=({fast}−{slow})t²/2. De t²={time*time}, se toma la raíz positiva: t={time} s.','s',{'gap':str(distance),'aFast':fast,'aSlow':slow})
 mass=500+100*i;speed=36+18*i;time=3+i;force=F(mass)*F(speed,1)/F(18,5)/time
 f('fuerza-neta',i,'abp-11-19','Segunda ley de Newton',f'Un automóvil de {mass} kg parte del reposo y alcanza {speed} km/h en {time} s con aceleración constante. ¿Cuál es la fuerza neta?',float(force),[float(force)*3.6,float(force)/mass,float(force)*time,float(force)/2],f'La rapidez final es {speed}/3,6={n(F(speed)*F(5,18))} m/s. La aceleración es Δv/t={n(F(speed)*F(5,18)/time)} m/s². Por F=ma, la fuerza neta es {n(float(force))} N.','N',{'m':mass,'speedKmh':speed,'time':time})
 length=20+5*i;temp=10+5*i;alpha=(i+1)*1e-5;delta=length*temp*alpha
 f('dilatacion',i,'abp-13-11','Dilatación lineal',f'Una barra de {length} cm tiene α={n(alpha,5)} °C⁻¹. Si su temperatura aumenta {temp} °C, ¿cuánto aumenta su longitud?',delta,[delta/length,delta/temp,delta*10,delta*length],f'La variación de longitud es ΔL=αL₀ΔT. Al sustituir, ΔL={n(alpha,5)}·{length}·{temp}={n(delta,4)} cm. Se pide el aumento, no la longitud final L₀+ΔL.','cm',{'L':length,'dT':temp,'alpha':alpha})
 freq=150+50*i;wavelength=F(i+2,4);speed=F(freq)*wavelength
 f('ondas',i,'abp-13-13','Rapidez de una onda',f'Una onda tiene frecuencia de {freq} Hz y longitud de onda de {n(wavelength)} m. Calcula su rapidez de propagación.',float(speed),[float(F(freq)/wavelength),float(wavelength/freq),float(speed)*2,float(speed)/2],f'La relación es v=fλ. Con Hz=s⁻¹ y λ en metros, v={freq}·({n(wavelength)})={n(speed)} m/s. Dividir frecuencia entre longitud de onda daría unidades incorrectas para una rapidez.','m/s',{'frequency':freq,'wavelength':str(wavelength)})
 focal=4+i;distance=2*focal;magnification=F(1,3);image=-F(focal*distance,focal+distance)
 f('lente-divergente',i,'abp-13-14','Lentes divergentes',f'Una lente tiene f=−{focal} cm y el objeto está a {distance} cm. Usando 1/f=1/s+1/s′, determina la posición de la imagen.',float(image),[-float(image),float(F(focal*distance,distance-focal)),float(-distance),float(focal)],f'La distancia focal de una lente divergente es negativa. 1/s′=−1/{focal}−1/{distance}; al invertir se obtiene s′={n(float(image))} cm. El signo negativo indica una imagen virtual al lado del objeto.','cm',{'focal':-focal,'object':distance})
 E=12*(i+1);ratio=i%3+2;new=F(E,ratio*ratio)
 f('campo-distancia',i,'abp-13-15','Campo eléctrico y distancia',f'Una carga puntual produce E={E} N/C a distancia r. ¿Qué campo produce a distancia {ratio}r, sin cambiar la carga?',float(new),[float(F(E,ratio)),E*ratio,E*ratio*ratio,float(new)/ratio],f'Para la misma carga puntual, E es proporcional a 1/r². Al multiplicar r por {ratio}, el campo se divide entre {ratio}²={ratio*ratio}: E₂={E}/{ratio*ratio}={n(float(new))} N/C.','N/C',{'field':E,'ratio':ratio})
 r1=2*(i+1);r2=3*(i+1);r3=6*(i+1);equiv=i+1
 f('paralelo',i,'abp-13-19','Resistencias en paralelo',f'Se conectan en paralelo resistencias de {r1}, {r2} y {r3} Ω. Halla la resistencia equivalente.',equiv,[r1+r2+r3,F(r1+r2+r3,3),r1+r2,2*equiv],f'En paralelo se suman los inversos: 1/R=1/{r1}+1/{r2}+1/{r3}=1/{equiv}. Entonces R={equiv} Ω, menor que cualquiera de las tres resistencias. Sumar directamente las resistencias correspondería a una conexión en serie.','Ω',{'resistors':[r1,r2,r3]})
 Ctemp=-15+10*i;Ftemp=F(9*Ctemp,5)+32
 f('temperatura',i,'abp-13-20','Escalas de temperatura',f'Convierte {n(Ftemp)} °F a grados Celsius.',Ctemp,[float(Ftemp)-32,float(Ftemp)*5/9,Ctemp+32,Ctemp*1.8],f'La conversión es T°C=(T°F−32)·5/9. Por tanto, ({n(Ftemp)}−32)·5/9={Ctemp} °C. El 32 se resta antes de multiplicar por 5/9.','°C',{'fahrenheit':str(Ftemp)})
 a=3*(i+1);b=4*(i+1);module=5*(i+1)
 f('vectores',i,'abp-34-27','Suma de vectores',f'Tres vectores coplanares suman cero. Dos son {a}i y {b}j. ¿Cuál es el módulo del tercero?',module,[a+b,abs(a-b),a*b,module*2],f'El tercer vector debe ser −{a}i−{b}j para anular los otros dos. Su módulo es √({a}²+{b}²)={module}; no se suman directamente las componentes porque son perpendiculares.',data={'x':a,'y':b})
 t=3+i;v=5*i;height=5*t*t-v*t
 f('tiro-vertical',i,'abp-34-28','Tiro vertical',f'Desde una altura de {height} m se lanza una piedra hacia arriba a {v} m/s. Usa g=10 m/s² y desprecia el aire. ¿Cuándo llega al suelo?',t,[t/2,t*2,t+1,F(v,10)],f'Con el suelo como y=0, la altura es y={height}+{v}t−5t². Al resolver 5t²−{v}t−{height}=0 se obtiene una raíz positiva de {t} s y otra negativa de {n(F(v,5)-t)} s. Solo la primera representa un tiempo posterior al lanzamiento.','s',{'height':height,'initialVelocity':v,'g':10})
 t1=i;t2=i+4;vb=2+i;va=vb+t1+t2;initial=t1*t2
 f('dos-encuentros',i,'abp-34-29','Encuentros y posición',f'A tiene posición xA={va}t. B tiene xB={initial}+{vb}t+t². Las posiciones están en metros y t en segundos. ¿En qué instantes coinciden?',f'{t1} s y {t2} s',[f'{t1+1} s y {t2+1} s',f'{t1} s y −{t2} s',f'Solo en {t1+t2} s',f'Solo en {t1*t2} s'],f'Igualar posiciones da t²−{t1+t2}t+{initial}=0. Se factoriza como (t−{t1})(t−{t2})=0, de donde t={t1} s y t={t2} s. Los dos instantes son positivos y, por ello, ambos son encuentros válidos.',data={'va':va,'vb':vb,'initial':initial})
 speed=4+2*i;g=10;theta=30;distance=speed*speed/(2*g*.5)
 f('plano-inclinado',i,'abp-43-40','Plano inclinado sin rozamiento',f'Un bloque parte del reposo por un plano de 30° sin rozamiento y alcanza {speed} m/s. Usa g=10 m/s² y sen30°=0,5. ¿Qué distancia recorrió sobre el plano?',distance,[distance/2,distance*2,speed/5,speed*speed/20],f'La aceleración paralela al plano es a=g sen30°=10·0,5=5 m/s². Con v₀=0, v²=2as. Así, s={speed}²/(2·5)={n(distance)} m. No se pide la altura vertical.','m',{'speed':speed,'g':10,'sinTheta':.5})
 focal=12+i;distance=3*focal;image=F(focal*distance,distance-focal)
 f('lente-convergente',i,'abp-21-27','Lentes convergentes',f'Una lente convergente tiene f={focal} cm y un objeto está a {distance} cm. Calcula la distancia de la imagen usando la ecuación de lentes delgadas.',float(image),[-float(image),distance,focal,float(image)*2],f'La ecuación es 1/f=1/s+1/s′. Entonces 1/s′=1/{focal}−1/{distance} y s′=fs/(s−f)={focal}·{distance}/({distance}−{focal})={n(image)} cm. El resultado es positivo: la imagen es real.','cm',{'focal':focal,'object':distance})
 charge=5+5*i;force=i+1;E=F(force*1000,charge)
 f('campo-fuerza',i,'abp-21-28','Definición de campo eléctrico',f'Una carga de prueba positiva de {charge} mC experimenta una fuerza de {force} N. ¿Cuál es el módulo del campo eléctrico?',float(E),[float(F(force,charge)),float(E)*1000,float(F(charge,force)),float(E)/2],f'Se convierte q={charge} mC={n(charge/1000,4)} C. El módulo del campo es E=F/q={force}/({n(charge/1000,4)})={n(float(E))} N/C. Usar mC sin convertir produciría un error de factor 1000.','N/C',{'chargeMc':charge,'force':force})
 mA=100+50*i;minutes=2+i;Q=F(mA,1000)*minutes*60
 f('carga-corriente',i,'abp-21-29','Corriente y carga eléctrica',f'Por un conductor circula una corriente constante de {mA} mA durante {minutes} min. ¿Qué carga atraviesa una sección?',float(Q),[float(Q)/60,float(Q)*1000,float(Q)/1000,float(Q)*60],f'Primero, I={mA}/1000={n(F(mA,1000))} A y t={minutes}·60={minutes*60} s. Luego Q=It={n(F(mA,1000))}·{minutes*60}={n(Q)} C.','C',{'mA':mA,'minutes':minutes})
 r1=20+5*i;r2=30+10*i;current=20+10*i;V=F(current,1000)*(r1+r2)
 f('serie-ohm',i,'abp-21-30','Ley de Ohm y serie',f'Dos resistencias de {r1} y {r2} Ω están en serie. Circulan {current} mA. ¿Qué voltaje tiene la fuente ideal?',float(V),[float(V)*1000,float(F(current,1000)*r1),float(F(current,1000)*r2),float(V)/2],f'En serie se suman las resistencias: R={r1}+{r2}={r1+r2} Ω. La corriente es {current}/1000={n(F(current,1000))} A. Por V=IR, el voltaje es {n(V)} V.','V',{'r1':r1,'r2':r2,'mA':current})
 foot=50+25*i;accel=2+i;v=math.sqrt(2*accel*foot*.3048)
 f('conversion-longitud',i,'abp-17-40','Rapidez con conversión de longitud',f'Un móvil parte del reposo con aceleración constante de {accel} m/s² y recorre {foot} ft. Usa 1 ft=0,3048 m. ¿Cuál es su rapidez final, con dos decimales?',v,[math.sqrt(2*accel*foot),v/2,v*2,math.sqrt(accel*foot*.3048)],f'La distancia se convierte antes de usar la fórmula: s={foot}·0,3048={n(foot*.3048,4)} m. Como v₀=0, v=√(2as)=√(2·{accel}·{n(foot*.3048,4)})≈{n(v)} m/s.','m/s',{'feet':foot,'a':accel})

# Chemistry: 18 families, ten datasets each (180 new). Constants are explicit.
compounds=[('NaClO₄',{'Na':1,'Cl':1,'O':4}),('H₂SO₄',{'H':2,'S':1,'O':4}),('NaHCO₃',{'Na':1,'H':1,'C':1,'O':3}),('Al₂O₃',{'Al':2,'O':3}),('Fe₂O₃',{'Fe':2,'O':3}),('C₂H₆',{'C':2,'H':6}),('Ca(OH)₂',{'Ca':1,'O':2,'H':2}),('MgSO₄',{'Mg':1,'S':1,'O':4}),('K₂Cr₂O₇',{'K':2,'Cr':2,'O':7}),('C₃H₇NO₂',{'C':3,'H':7,'N':1,'O':2})]
mass={'Na':23,'Cl':35.5,'O':16,'H':1,'S':32,'C':12,'Al':27,'Fe':56,'Ca':40,'Mg':24,'K':39,'Cr':52,'N':14}
elements=[('carbono',12),('sodio',23),('azufre',32),('hierro',56),('cromo',52),('yodo',127),('oxígeno',16),('aluminio',27),('magnesio',24),('potasio',39)]
for i in range(1,11):
 formula,counts=compounds[i-1];M=sum(mass[e]*count for e,count in counts.items());given='; '.join(f'{e}={n(mass[e])}' for e in counts)
 c('masa-molar',i,'abp-17-28','Masa molar',f'Calcula la masa molar de {formula}. Masas atómicas en g/mol: {given}.',M,[sum(mass[e] for e in counts),M+16,M-1,M*2],f'Se multiplica cada masa atómica por el número de átomos de ese elemento en la fórmula: '+ ' + '.join(f'{count}·{n(mass[e])}' for e,count in counts.items())+f' = {n(M)} g/mol. Los subíndices y los paréntesis indican cuántas veces debe contarse cada átomo.','g/mol',{'composition':counts,'atomicMasses':{e:mass[e] for e in counts}})
 name,atomic=elements[i-1];grams=(i+1)*atomic/10;N=grams/atomic*6.022;answer=f'{n(N,4)}×10²³ átomos'
 c('numero-atomos',i,'abp-17-29','Moles y número de átomos',f'¿Cuántos átomos hay en {n(grams)} g de {name}? Usa M={atomic} g/mol y Nₐ=6,022×10²³ mol⁻¹.',answer,[f'{n(N/10,4)}×10²³ átomos',f'{n(N*10,4)}×10²³ átomos',f'{n(grams/atomic)} átomos',f'{n(N/2,4)}×10²³ átomos'],f'La cantidad es n=m/M={n(grams)}/{atomic}={n(grams/atomic)} mol. Cada mol contiene Nₐ átomos: N={n(grams/atomic)}·6,022×10²³={answer}. La masa en gramos no es por sí misma un número de partículas.',data={'grams':grams,'molarMass':atomic,'NAfactor':6.022})
 mol=F(i+1,5);grams=mol*F(str(M));molecules=float(mol)*6.022
 answer=f'{n(grams)} g; {n(molecules,4)}×10²³ moléculas'
 c('masa-moleculas',i,'abp-24-23','Cantidad de sustancia',f'Para {n(mol)} mol de {formula}, halla la masa y el número de moléculas. Usa masa molar {n(M)} g/mol y Nₐ=6,022×10²³ mol⁻¹. Trata la fórmula dada como una unidad de composición para el conteo.',answer,[f'{n(M)} g; {n(molecules,4)}×10²³ moléculas',f'{n(grams)} g; {n(molecules/10,4)}×10²³ moléculas',f'{n(float(grams)*2)} g; {n(molecules*2,4)}×10²³ moléculas',f'{n(mol)} g; {n(M)} moléculas'],f'La masa se calcula con m=nM={n(mol)}·{n(M)}={n(grams)} g. El número de unidades se obtiene con N=nNₐ={n(mol)}·6,022×10²³={n(molecules,4)}×10²³. Se conserva la cantidad de sustancia en ambas conversiones.',data={'moles':str(mol),'M':M})
 sample=100+20*i;purity=25+5*i;pure=sample*purity/100;volume=pure*1000/160*3*22.4/1000
 c('pureza',i,'abp-25-25','Pureza y estequiometría',f'Una muestra de {sample} kg contiene Fe₂O₃. Al reaccionar Fe₂O₃+3CO→2Fe+3CO₂ produce {n(volume,4)} m³ de CO₂ en CN. Usa 22,4 L/mol y M(Fe₂O₃)=160 g/mol. ¿Qué pureza tiene?',purity,[purity/3,purity*2,100-purity,purity+10],f'El CO₂ ocupa {n(volume*1000)} L, equivalentes a {n(volume*1000/22.4)} mol. Se divide entre 3 para hallar los moles de Fe₂O₃ y se multiplica por 160 g/mol: masa pura={n(pure)} kg. La pureza es {n(pure)}/{sample}·100={purity} %.','%',{'sampleKg':sample,'volumeM3':volume,'molarVolume':22.4,'M':160})
 aluminium=4*(i+1);oxygen=3*(i+1)
 c('balance-aluminio',i,'abp-35-48','Relación molar y balance',f'Balancea Al+O₂→Al₂O₃. ¿Cuántos moles de O₂ reaccionan con {aluminium} mol de Al si no hay otro reactivo limitante?',oxygen,[aluminium,aluminium*3,oxygen*2,F(aluminium,3)],f'La ecuación balanceada es 4Al+3O₂→2Al₂O₃. La proporción es 3 mol de O₂ por 4 mol de Al: n(O₂)={aluminium}·3/4={oxygen} mol. Los coeficientes no son masas en gramos.','mol',{'alMoles':aluminium})
 element,atomic=elements[(i+2)%10];value=atomic/6.022;answer=f'{n(value,4)}×10⁻²³ g'
 c('masa-atomica',i,'abp-35-56','Masa de un átomo',f'La masa molar del {element} es {atomic} g/mol. Con Nₐ=6,022×10²³ mol⁻¹, ¿cuál es la masa de un átomo?',answer,[f'{n(value*10,4)}×10⁻²³ g',f'{n(value/10,4)}×10⁻²³ g',f'{atomic} g',f'{n(atomic*6.022,4)}×10²³ g'],f'Un mol de átomos tiene masa {atomic} g y contiene 6,022×10²³ átomos. Por eso, m(átomo)={atomic}/(6,022×10²³)={answer}. Se divide entre Nₐ; multiplicar daría el proceso inverso.',data={'atomicMass':atomic,'NAfactor':6.022})
 co2=44.8*(i+1);ethane=co2/22.4/2*30
 c('combustion-etano',i,'abp-36-57','Combustión y volumen de gases',f'¿Qué masa de etano se necesita para producir {n(co2)} L de CO₂ en CN? Reacción: 2C₂H₆+7O₂→4CO₂+6H₂O. Usa 22,4 L/mol y M(C₂H₆)=30 g/mol.',ethane,[ethane*2,ethane/2,co2/22.4,ethane*4],f'Primero, n(CO₂)={n(co2)}/22,4={n(co2/22.4)} mol. La relación C₂H₆:CO₂ es 2:4, por lo que se necesita la mitad de moles de etano. Su masa es {n(co2/22.4/2)}·30={n(ethane)} g.','g',{'co2Litres':co2,'Vm':22.4,'ethaneM':30})
 iodine=25*(i+1);dichromate=iodine*294/(3*254)
 c('dicromato-yodo',i,'abp-43-43','Estequiometría de oxidación-reducción',f'En K₂Cr₂O₇+6KI+7H₂SO₄→4K₂SO₄+3I₂+Cr₂(SO₄)₃+7H₂O, ¿qué masa de K₂Cr₂O₇ produce {iodine} g de I₂? Usa M(K₂Cr₂O₇)=294 y M(I₂)=254 g/mol.',dichromate,[iodine*294/254,dichromate*3,dichromate/3,iodine*254/294],f'La ecuación indica que 1 mol de K₂Cr₂O₇ produce 3 mol de I₂. Se convierten {iodine} g de I₂ a moles, se divide entre 3 y se multiplica por 294 g/mol: m={iodine}·294/(3·254)≈{n(dichromate)} g.','g',{'iodineG':iodine,'dichromateM':294,'iodineM':254})
 alanine=8.9*(i+1);nitrogen=alanine/89*.5*22.4
 c('nitrogeno-alanina',i,'abp-44-46','Estequiometría de gases',f'La oxidación completa de alanina C₃H₇NO₂ forma N₂. ¿Qué volumen de N₂ en CN procede de {n(alanine)} g de alanina? Usa M=89 g/mol y 22,4 L/mol; cada 2 mol de alanina producen 1 mol de N₂.',nitrogen,[nitrogen*2,nitrogen/2,alanine/89,22.4*(i+1)],f'La cantidad de alanina es {n(alanine)}/89={n(alanine/89)} mol. Como se necesitan dos átomos de N para formar cada N₂, n(N₂)=n(alanina)/2={n(alanine/89/2)} mol. El volumen es {n(alanine/89/2)}·22,4={n(nitrogen)} L.','L',{'alanineG':alanine,'M':89,'Vm':22.4})
 samples=[(name,atomic,atomic*F(((j+i)%5)+1,10)*(1+(i-1)//5)) for j,(name,atomic) in enumerate(elements[:5])]
 winner=max(samples,key=lambda row:row[2]/row[1]);prompt='; '.join(f'{name}: {n(grams)} g (M={atomic} g/mol)' for name,atomic,grams in samples)
 c('comparar-atomos',i,'abp-44-48','Comparación del número de átomos',f'Compara estas muestras de elementos: {prompt}. ¿Cuál contiene más átomos?',winner[0],[row[0] for row in samples if row[0]!=winner[0]],'Para comparar el número de átomos basta comparar n=m/M, porque todas las muestras se multiplicarían por el mismo Nₐ. Las cantidades son '+ '; '.join(f'{name}: {n(grams/atomic)} mol' for name,atomic,grams in samples)+f'. La mayor corresponde a {winner[0]}.',data={'samples':[{'element':name,'M':atomic,'grams':str(grams)} for name,atomic,grams in samples]})
 hgo=2*(i+1);oxygen=hgo/2
 c('descomposicion-hgo',i,'abp-16-22','Descomposición y coeficientes',f'En la descomposición de HgO, la ecuación balanceada es 2HgO→2Hg+O₂. Si se descomponen {hgo} mol de HgO, ¿cuántos moles de O₂ se obtienen?',oxygen,[hgo,2*hgo,oxygen/2,hgo+1],f'Los coeficientes indican que 2 mol de HgO producen 1 mol de O₂. Por tanto n(O₂)={hgo}·1/2={n(oxygen)} mol. El número de átomos de oxígeno se conserva: dos átomos forman cada molécula de O₂.','mol',{'hgoMoles':hgo})
 acid=i+1;water=2*acid
 c('neutralizacion',i,'abp-35-46','Neutralización ácido-base',f'Para H₂SO₄+Ca(OH)₂→CaSO₄+2H₂O, ¿cuántos moles de agua se producen al neutralizar completamente {acid} mol de H₂SO₄ con suficiente Ca(OH)₂?',water,[acid,acid/2,water*2,acid+3],f'La ecuación ya está balanceada: 1 mol de H₂SO₄ produce 2 mol de H₂O. Al consumir {acid} mol del ácido se forman {acid}·2={water} mol de agua. No se confunden los coeficientes con los subíndices internos de las fórmulas.','mol',{'acidMoles':acid})
 magnesium=12*(i+1);hydrogen=magnesium/24
 c('sustitucion-magnesio',i,'abp-35-45','Sustitución simple y estequiometría',f'El magnesio reacciona con ácido suficiente: Mg+H₂SO₄→MgSO₄+H₂. Con M(Mg)=24 g/mol, ¿cuántos moles de H₂ se obtienen de {magnesium} g de Mg?',hydrogen,[hydrogen*2,hydrogen/2,magnesium,magnesium/12],f'Primero se convierte la masa de Mg a moles: {magnesium}/24={n(hydrogen)} mol. Los coeficientes de Mg y H₂ son ambos 1, así que la proporción es 1:1 y se forman {n(hydrogen)} mol de H₂.','mol',{'magnesiumG':magnesium,'M':24})
 units=i+2;atoms=sum(counts.values())*units
 c('composicion',i,'abp-36-59','Lectura de fórmulas químicas',f'Usando la fórmula {formula}, ¿cuántos átomos en total representan {units} unidades de esa fórmula? Cuenta todos los elementos y los subíndices; un paréntesis multiplica lo que contiene.',atoms,[sum(counts.values()),units*len(counts),atoms+units,atoms*2],f'Cada unidad de {formula} contiene '+ ' + '.join(str(v) for v in counts.values())+f' = {sum(counts.values())} átomos. Para {units} unidades, el total es {units}·{sum(counts.values())}={atoms}. Se cuentan átomos, no solo la cantidad de elementos diferentes.',data={'composition':counts,'units':units})
 orbitals=i+1;capacity=2*orbitals
 c('orbitales',i,'abp-16-24','Capacidad de orbitales',f'Cada orbital puede contener como máximo dos electrones. ¿Cuántos electrones caben como máximo en un conjunto de {orbitals} orbitales?',capacity,[orbitals,orbitals+2,capacity*2,capacity-1],f'El límite de dos electrones se aplica a cada orbital, no al conjunto completo. Para {orbitals} orbitales, el máximo es {orbitals}·2={capacity} electrones. No se afirma que esos orbitales estén ocupados; se calcula su capacidad.','electrones',{'orbitals':orbitals,'perOrbital':2})
 ratio=i+1;amu=12*ratio
 c('unidad-masa',i,'abp-35-54','Unidad de masa atómica',f'Un átomo tiene una masa igual a {ratio} veces la masa de un átomo de carbono-12. Si 1 u es 1/12 de la masa de carbono-12, ¿cuál es la masa del primer átomo en u?',amu,[ratio,F(ratio,12),amu*12,amu-12],f'La definición implica que la masa de un átomo de carbono-12 es 12 u. La masa indicada en el problema es {ratio}·12 u={amu} u. Multiplicar por 12 es lo correcto porque se está expresando un múltiplo de la masa completa del carbono-12.','u',{'ratioToC12':ratio})
 co2moles=5*(i+1);iodinepentoxide=co2moles/5
 c('balance-oxigeno-yodo',i,'abp-36-58','Balance y proporciones molares',f'Balancea CO₂+I₂→CO+I₂O₅ con los menores coeficientes enteros. Si reaccionan {co2moles} mol de CO₂ con I₂ suficiente, ¿cuántos moles de I₂O₅ se forman?',iodinepentoxide,[co2moles,co2moles*5,iodinepentoxide/2,co2moles/2],f'La conservación de átomos da 5CO₂+I₂→5CO+I₂O₅. Por cada 5 mol de CO₂ aparece 1 mol de I₂O₅: n={co2moles}/5={n(iodinepentoxide)} mol. Se comprueban 5 C, 10 O y 2 I a cada lado.','mol',{'co2Moles':co2moles})
 compoundMass=12.25*(i+1);oxygenMass=compoundMass*64/122.5
 c('fraccion-masica',i,'abp-17-28','Composición y masa molar',f'NaClO₄ tiene masa molar 122,5 g/mol; sus cuatro oxígenos aportan 64 g por mol. ¿Qué masa de oxígeno hay en {n(compoundMass)} g del compuesto?',oxygenMass,[compoundMass/4,compoundMass*4,oxygenMass/2,compoundMass*64/23],f'La fracción de masa debida al oxígeno es 64/122,5. Se multiplica por la masa total de la muestra: m(O)={n(compoundMass)}·64/122,5={n(oxygenMass)} g. La cantidad de oxígeno debe ser menor que la masa total del compuesto.','g',{'compoundMass':compoundMass,'M':122.5,'oxygenPerMole':64})

# Do not describe ionic formula units as molecules. Keep the same numerical task.
for q in created:
 if q['family']=='carga-corriente':
  q['explanation']+=' La corriente indica carga por segundo; por eso se multiplica por el tiempo convertido a segundos. Mantener los minutos sin convertir reduciría erróneamente el resultado por un factor de 60.'
 if q['family']=='logica':
  value=q['options'][q['correct']]
  options=[value,'F' if value=='V' else 'V','Depende de un valor no dado','La expresión no tiene valor lógico']
  random.Random(q['id']).shuffle(options);q['options']=options;q['correct']=options.index(value)
 if q['family']=='masa-moleculas':
  q['text']=q['text'].replace('número de moléculas','número de unidades de fórmula')
  q['options']=[o.replace('moléculas','unidades de fórmula') for o in q['options']]
  for check in checks:
   if check['id']==q['id']:check['display']=q['options'][q['correct']]

counts=collections.Counter(q['subject'] for q in created)
assert counts=={'matematicas':160,'fisica':168,'quimica':180},counts
assert len({q['id'] for q in created})==len(created)
assert all(len(q['options']) in (4,5) and len(set(q['options']))==len(q['options']) for q in created)
duplicates=[text for text,count in collections.Counter(q['text'] for q in created).items() if count>1]
assert not duplicates,duplicates
(HERE/'calculation-questions.json').write_text(json.dumps(created,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(HERE/'calculation-checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('New worked variations:',dict(counts),'Total',len(created))
