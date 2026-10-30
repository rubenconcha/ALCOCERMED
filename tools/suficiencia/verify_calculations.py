"""Independent numerical/symbolic check of the generated answer alternatives."""
from pathlib import Path
from fractions import Fraction
import json,math,re,collections,sys
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr,standard_transformations,implicit_multiplication_application
sys.stdout.reconfigure(encoding='utf8')
HERE=Path(__file__).resolve().parents[2]/'tmp'/'suficiencia-build';qs=json.loads((HERE/'calculation-questions.json').read_text(encoding='utf8'));checks={x['id']:x for x in json.loads((HERE/'calculation-checks.json').read_text(encoding='utf8'))}
trans=standard_transformations+(implicit_multiplication_application,)
def expr(text):return parse_expr(text.replace('−','-').replace('²','**2').replace('³','**3').replace('⁴','**4').replace('×','*').replace('^','**').replace(',','.'),transformations=trans)
def scalar(text):
 first=text.split(' ')[0].replace('−','-').replace(',','.')
 return float(sp.Rational(first))
def close(actual,expected,tol=.0050001):assert abs(float(actual)-float(expected))<=tol,(actual,expected)
def set_format(values):return '{'+', '.join(str(v) for v in sorted(set(values)))+'}'
x,a,b,c,y,z=sp.symbols('x a b c y z');families=collections.Counter();report=[]
for q in qs:
 data=checks[q['id']]['inputs'];family=q['family'];actual=q['options'][q['correct']];expected=None;special=False
 assert actual==checks[q['id']]['display'],q['id']
 assert len(set(q['options']))==len(q['options']) and len(q['options']) in [4,5]
 if q['subject']=='matematicas':
  if family=='conjuntos':expected=set_format((set(data['C'])|set(data['A']))&(set(data['U'])-set(data['B'])));assert actual==expected;special=True
  elif family in ['resto','resto-cuadratico']:expected=float(sp.Poly.from_list(data['coefficients'],x).eval(data['root']))
  elif family=='division':
   coeff=data['quotient'];poly=data['divisor']*(coeff[0]*x**5+coeff[1]*x**4+coeff[2]*x**3);expected=sp.cancel(poly/(data['divisor']*x**3));assert sp.expand(expr(actual)-expected)==0;special=True
  elif family=='promedio':expected=sp.solve((sum(data['known'])+x)/data['size']-sp.Rational(data['mean']),x)[0]
  elif family=='frecuencias':expected=data['n3']*sp.Rational(data['n3'],data['N'])+data['n1']+data['n2']+data['n3']
  elif family=='sistema':
   solution=sp.linsolve((sp.Matrix(data['matrix']),sp.Matrix(data['rhs'])),(x,y));pair=list(solution)[0];found=[int(v) for v in re.findall(r'=(-?\d+)',actual.replace('−','-'))];assert tuple(found)==tuple(pair);expected=str(pair);special=True
  elif family=='raices':
   roots=sp.solve(((data['scale']+2)*x-data['v'])**2-(x+data['u'])**2,x);expected=abs(roots[0]-roots[1]);assert len(roots)==2
  elif family=='trinomio':
   k,l=data['k'],data['l'];expected=k*k*a*a+l*l*b*b+c*c+2*k*l*a*b-2*k*a*c-2*l*b*c;assert sp.expand(expr(actual)-expected)==0;special=True
  elif family=='logaritmos':
   r,s=data['roots'];roots=sp.solve(x*x-(r+s)*x+r*s,x);answers=[data['base']**int(v) for v in roots];found=[int(v) for v in re.findall(r'=(\d+)',actual)];assert sorted(found)==sorted(answers);expected=str(answers);special=True
  elif family=='log-base-variable':
   roots=[r for r in sp.solve(x*x-x-data['constant'],x) if r>0 and r!=1];assert len(roots)==1;target=sp.sqrt(roots[0]);written=actual.removeprefix('x=±');value=sp.sqrt(int(written[1:])) if written.startswith('√') else sp.Integer(written);assert sp.simplify(target-value)==0;expected=str(target);special=True
  elif family=='termino-independiente':expected=sp.cancel(((data['a']*x*x-data['a'])/data['b'])/((data['a']*x+data['a'])/(data['b']*x+data['b']+2))).subs(x,0)
  elif family=='identidad-cubica':expected=data['cubes']+data['offset']
  elif family=='notacion-cientifica':
   expected=3*data['coefficient']*sp.Integer(10)**data['power'];assert sp.simplify(expr(actual)-expected)==0;coef,power=actual.split('×10^');assert 1<=float(coef.replace(',','.'))<10 and int(power)==float(power);special=True
  elif family=='diferencia-cuadrados':
   aa,bb,cc=data['a'],data['b'],data['c'];expected=sp.expand((aa*x+bb*y-cc*z)*(aa*x-bb*y+cc*z)-2*bb*cc*y*z);assert sp.expand(expr(actual)-expected)==0;special=True
  elif family=='inecuacion':
   l,r=data['roots'];solution=sp.solve_univariate_inequality((x-l)*(x-r)<0,x,relational=False);assert solution==sp.Interval.open(l,r);assert actual==f'({l},{r})';expected=str(solution);special=True
  elif family=='logica':
   p,qq,rr=map(bool,[data['p'],data['q'],data['r']]);imp=(not p) or qq;expected='V' if ((imp and not rr) or ((not imp) and rr)) else 'F';assert actual==expected;assert 'V' in q['options'] and 'F' in q['options'];special=True
  elif family=='multiplos':expected=set_format(set(range(data['multiple'],data['limit']+1,data['multiple']))&set(range(data['step'],data['limit']+1,data['step'])));assert actual==expected;special=True
  elif family=='razon':expected=sp.solve(data['a']*x-data['b']*y,x)[0]/y
  elif family=='operaciones-polinomios':
   aa,bb,cc,inter=data['a'],data['b'],data['c'],data['intercept'];expected=sp.expand((aa*x*x-aa*bb*x+cc)*(x+bb)+aa*bb*bb*x-(cc*bb-inter));assert sp.expand(expr(actual)-expected)==0;special=True
  else:raise AssertionError(family)
 elif q['subject']=='fisica':
  if family=='conversion-aceleracion':expected=data['speedCms']/100/(data['minutes']*60)
  elif family=='dos-etapas':expected=2*data['s1']/data['v']+data['s2']/data['v']
  elif family=='energia-cinetica':expected=.5*data['m']*(data['v']*data['factor'])**2
  elif family=='encuentro':expected=abs(data['distance']-data['va']*data['hours']-data['vb']*data['hours'])
  elif family=='alcance':expected=math.sqrt(2*float(Fraction(data['gap']))/(data['aFast']-data['aSlow']))
  elif family=='fuerza-neta':expected=data['m']*(data['speedKmh']*1000/3600)/data['time']
  elif family=='dilatacion':expected=data['L']*data['dT']*data['alpha']
  elif family=='ondas':expected=data['frequency']*float(Fraction(data['wavelength']))
  elif family in ['lente-divergente','lente-convergente']:expected=1/(1/data['focal']-1/data['object'])
  elif family=='campo-distancia':expected=data['field']/data['ratio']**2
  elif family=='paralelo':expected=1/sum(1/r for r in data['resistors'])
  elif family=='temperatura':expected=(float(Fraction(data['fahrenheit']))-32)*5/9
  elif family=='vectores':expected=math.hypot(data['x'],data['y'])
  elif family=='tiro-vertical':expected=(data['initialVelocity']+math.sqrt(data['initialVelocity']**2+2*data['g']*data['height']))/data['g']
  elif family=='dos-encuentros':
   roots=sorted(sp.solve(x*x+(data['vb']-data['va'])*x+data['initial'],x));found=[int(v) for v in re.findall(r'\b\d+(?= s)',actual)];assert found==roots;expected=str(roots);special=True
  elif family=='plano-inclinado':expected=data['speed']**2/(2*data['g']*data['sinTheta'])
  elif family=='campo-fuerza':expected=data['force']/(data['chargeMc']*.001)
  elif family=='carga-corriente':expected=data['mA']*.001*data['minutes']*60
  elif family=='serie-ohm':expected=(data['r1']+data['r2'])*data['mA']*.001
  elif family=='conversion-longitud':expected=math.sqrt(2*data['a']*data['feet']*.3048)
  else:raise AssertionError(family)
 else:
  if family=='masa-molar':expected=sum(count*data['atomicMasses'][e] for e,count in data['composition'].items())
  elif family=='numero-atomos':expected=data['grams']/data['molarMass']*data['NAfactor'];close(float(actual.split('×')[0].replace(',','.')),expected,.00005001);special=True
  elif family=='masa-moleculas':
   mol=float(Fraction(data['moles']));grams=scalar(actual);particles=float(actual.split('; ')[1].split('×')[0].replace(',','.'));close(grams,mol*data['M']);close(particles,mol*6.022,.00005001);expected=str((mol*data['M'],mol*6.022));special=True
  elif family=='pureza':expected=(data['volumeM3']*1000/data['molarVolume']/3*data['M']/1000)/data['sampleKg']*100
  elif family=='balance-aluminio':expected=data['alMoles']*3/4
  elif family=='masa-atomica':expected=data['atomicMass']/data['NAfactor'];close(float(actual.split('×')[0].replace(',','.')),expected,.00005001);special=True
  elif family=='combustion-etano':expected=data['co2Litres']/data['Vm']/2*data['ethaneM']
  elif family=='dicromato-yodo':expected=(data['iodineG']/data['iodineM']/3)*data['dichromateM']
  elif family=='nitrogeno-alanina':expected=data['alanineG']/data['M']/2*data['Vm']
  elif family=='comparar-atomos':expected=max(data['samples'],key=lambda p:Fraction(p['grams'])/p['M'])['element'];assert actual==expected;special=True
  elif family=='descomposicion-hgo':expected=data['hgoMoles']/2
  elif family=='neutralizacion':expected=data['acidMoles']*2
  elif family=='sustitucion-magnesio':expected=data['magnesiumG']/data['M']
  elif family=='composicion':expected=sum(data['composition'].values())*data['units']
  elif family=='orbitales':expected=data['orbitals']*data['perOrbital']
  elif family=='unidad-masa':expected=data['ratioToC12']*12
  elif family=='balance-oxigeno-yodo':expected=data['co2Moles']/5
  elif family=='fraccion-masica':expected=data['compoundMass']/data['M']*data['oxygenPerMole']
  else:raise AssertionError(family)
 if not special:close(scalar(actual),expected)
 families[q['subject']+':'+family]+=1
 report.append({'id':q['id'],'verified':True,'method':'symbolic or independent numerical calculation','expected':str(expected),'answer':actual})
assert len(report)==508
assert len(families)==59,len(families)
(HERE/'verified-calculations.json').write_text(json.dumps({'verified':508,'families':dict(families),'checks':report},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Independently verified',len(report),'answer keys across',len(families),'problem families.')
