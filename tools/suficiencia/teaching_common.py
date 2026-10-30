from fractions import Fraction
import math

def num(v, places=6):
    if isinstance(v,str): return v
    if abs(float(v)) < 1e-12: return '0'
    if float(v).is_integer(): return str(int(v)).replace('-', '−')
    return f'{float(v):.{places}f}'.rstrip('0').rstrip('.').replace('.',',').replace('-', '−')

def frac(v):
    f=Fraction(v)
    return (str(f.numerator) if f.denominator==1 else f'{f.numerator}/{f.denominator}').replace('-', '−')

def F(v): return Fraction(str(v))
def step(title,text,formula=None):
    row={'title':title,'text':text}
    if formula is not None:row['formula']=str(formula)
    return row
def lesson(goal,basics,steps,mistake,check):
    assert 4<=len(steps)<=12
    return {'version':1,'level':'desde-cero','goal':goal,'basics':basics,'steps':steps,'mistake':mistake,'check':check}
def aset(values):return '{'+', '.join(num(x) for x in sorted(set(values)))+'}'
def common_subtraction(a,b):
    a,b=Fraction(a),Fraction(b);d=math.lcm(a.denominator,b.denominator)
    an=a.numerator*(d//a.denominator);bn=b.numerator*(d//b.denominator)
    return f'{frac(a)} − ({frac(b)}) = ({an} − ({bn}))/{d} = {frac(a-b)}'

