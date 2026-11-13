"""Optional independent exact example checks; requires SymPy.
Tested dependency version is recorded in verification/reference-cases.json.
The textbook and laboratory do not require SymPy.
"""
from pathlib import Path
import json,math
try:
 import sympy as s
except ImportError:
 raise SystemExit('Optional verification only: SymPy is not installed. Reading and laboratory use do not need it.')
x=s.symbols('x'); cases=[]
def case(name,truth,detail):
 assert truth,name
 cases.append({'case':name,'result':'passed','detail':detail})
case('Bezout reference',414*8-662*5==math.gcd(414,662)==2,'414*8 - 662*5 = 2')
case('Linear congruence solution classes',[i for i in range(662) if (414*i-6)%662==0]==[24,355],'Solutions modulo 662 are 24 and 355')
case('Noncoprime CRT',s.ntheory.modular.solve_congruence((5,12),(11,18))==(29,36),'x = 29 mod 36')
case('Gaussian representations',[(a,b) for a in range(9) for b in range(a,9) if a*a+b*b==65]==[(1,8),(4,7)],'65 = 1^2+8^2 = 4^2+7^2')
case('Reciprocity reference',s.legendre_symbol(17,43)==1 and 19**2%43==17,'17 is a quadratic residue mod 43; 19 is a root')
case('Jacobi counterexample',s.jacobi_symbol(2,15)==1 and not any(a*a%15==2 for a in range(15)),'Jacobi(2,15)=1 but no square root modulo 15')
case('Totient and Mobius',s.totient(30)==sum(s.mobius(d)*(30//d) for d in s.divisors(30))==8,'phi(30)=8 via inversion')
case('Smith example',s.det(s.Matrix([[4,2],[2,4]]))==12,'gcd of entries 2, determinant 12: invariant factors 2,6')
case('Field F9 polynomial',s.Poly(x*x+1,x,modulus=3).is_irreducible,'X^2+1 irreducible over F3')
case('Field F8 polynomial',s.Poly(x**3+x+1,x,modulus=2).is_irreducible,'X^3+X+1 irreducible over F2')
case('Biquadratic minimal polynomial',s.expand(((x-s.sqrt(2))**2-3)*((x+s.sqrt(2))**2-3))==x**4-10*x*x+1,'sqrt2+sqrt3 satisfies X^4-10X^2+1')
case('Algebraic integer reference',s.simplify(((1+s.sqrt(5))/2)**2-(1+s.sqrt(5))/2-1)==0,'(1+sqrt5)/2 is root of monic X^2-X-1')
case('Cyclotomic polynomial',s.cyclotomic_poly(12,x)==x**4-x*x+1,'Phi12 = X^4-X^2+1')
case('Quintic irreducibility mod 3',s.Poly(x**5-x-1,x,modulus=3).is_irreducible,'Irreducible mod 3 gives irreducibility over Q')
case('Quintic mod 2 factorization',s.Poly((x*x+x+1)*(x**3+x*x+1)-(x**5-x-1),x,modulus=2).is_zero,'Cycle types 2+3 in a squarefree reduction')
case('Quintic discriminant',s.discriminant(x**5-x-1,x)==2869,'Discriminant 2869, not divisible by 2 or 3')
case('Quartic discriminant',s.discriminant(x**4-2,x)==-2048,'Discriminant of X^4-2 is -2048')
case('Pell reference',649**2-13*180**2==1 and 1766319049**2-61*226153980**2==1,'Exact Pell checks for D=13 and D=61')
case('Hensel reference',10**2%49==2 and 10%7==3,'3 mod 7 lifts to 10 mod 49')
case('Evaluation code reference',[(3+2*t+t*t)%7 for t in range(5)]==[3,6,4,4,6],'F7 polynomial codeword')
case('Prime counting reference',s.primepi(1000)==168,'pi(1000)=168')
report={'status':'passed','sympy_version':s.__version__,'cases':cases,'limits':'Selected exact worked examples only. This is not a formal proof checker or an audit of every printed number.'}
root=Path(__file__).resolve().parents[1]
(root/'verification'/'reference-cases.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'status':'passed','sympy_version':s.__version__,'cases':len(cases)},indent=2))
