"""Selected exact algebraic checks; this is not a proof audit of every chapter.

Optional dependency: SymPy. Every check identifies the particular identity tested.
"""
from pathlib import Path
import json,sys
import sympy as s
ROOT=Path(__file__).resolve().parents[1]
checks=[]
def check(name,expression):
    simplified=s.simplify(expression)
    checks.append({'name':name,'passed':simplified==0,'residual':str(simplified)})
x,w,b,y=s.symbols('x w b y',real=True)
p=1/(1+s.exp(-x))
check('sigmoid derivative',s.diff(p,x)-p*(1-p))
check('tanh derivative',s.diff(s.tanh(x),x)-(1-s.tanh(x)**2))
check('quadratic chain rule',s.diff((2*w-3)**2,w)-4*(2*w-3))
check('binary logit loss gradient',s.diff(s.log(1+s.exp(x))-y*x,x)-(p-y))
check('binary logit loss curvature',s.diff(s.log(1+s.exp(x))-y*x,x,2)-p*(1-p))
z=s.symbols('z0:3',real=True)
prob=[s.exp(v)/sum(s.exp(k) for k in z) for v in z]
for i in range(3):
    for j in range(3):
        check(f'softmax Jacobian {i},{j}',s.diff(prob[i],z[j])-prob[i]*((1 if i==j else 0)-prob[j]))
check('softmax cross entropy gradient',s.diff(-z[1]+s.log(sum(s.exp(k) for k in z)),z[0])-prob[0])
x1,x2,y1,y2=s.symbols('x1 x2 y1 y2',real=True)
objective=((b+w*x1-y1)**2+(b+w*x2-y2)**2)/4
check('least squares slope gradient',s.diff(objective,w)-((b+w*x1-y1)*x1+(b+w*x2-y2)*x2)/2)
check('least squares intercept gradient',s.diff(objective,b)-((b+w*x1-y1)+(b+w*x2-y2))/2)
lam=s.symbols('lambda',positive=True)
check('ridge penalty gradient',s.diff(lam*w*w/2,w)-lam*w)
a,c=s.symbols('a c',positive=True)
check('lasso positive branch stationarity',(s.diff(a*w*w/2-c*w+lam*w,w)).subs(w,(c-lam)/a))
check('lasso negative branch stationarity',(s.diff(a*w*w/2-c*w-lam*w,w)).subs(w,(c+lam)/a))
q=s.symbols('q0:3',positive=True)
r=s.symbols('r0:3',positive=True)
Hq=-sum(qi*s.log(qi) for qi in q)
Hp=-sum(qi*s.log(ri) for qi,ri in zip(q,r))
KL=sum(qi*(s.log(qi)-s.log(ri)) for qi,ri in zip(q,r))
check('cross entropy minus entropy equals KL',Hp-Hq-KL)
xv=s.Matrix([x1,x2]);av=s.Matrix([a,c])
check('rank one quadratic form',(xv.T*(av*av.T)*xv)[0]-(av.dot(xv))**2)
u1,u2,v1,v2=s.symbols('u1 u2 v1 v2',real=True)
check('degree two polynomial kernel feature map',(u1*v1+u2*v2)**2-((u1**2)*(v1**2)+2*u1*u2*v1*v2+(u2**2)*(v2**2)))
err=s.symbols('error',positive=True)
alpha=s.log((1-err)/err)/2
weighted=(1-err)*s.exp(-x)+err*s.exp(x)
# The stated AdaBoost branch assumes 0 < error < 1.
check('AdaBoost optimal weight',s.diff(weighted,x).subs(x,alpha))
G,H=s.symbols('G H',real=True)
check('second order boosting leaf optimum',s.diff(G*w+(H+lam)*w*w/2,w).subs(w,-G/(H+lam)))
beta,ab=s.symbols('beta alpha_bar_previous',positive=True)
check('diffusion forward variance recursion',(1-beta)*(1-ab)+beta-(1-(1-beta)*ab))
check('Gaussian forward posterior variance',1/((1-beta)/beta+1/(1-ab))-beta*(1-ab)/(1-(1-beta)*ab))
check('noise to conditional score conversion',-(x-s.sqrt(ab)*y)/(1-ab)-(-(x-s.sqrt(ab)*y)/s.sqrt(1-ab))/s.sqrt(1-ab))
rate=s.symbols('rate',positive=True)
check('gradient descent quadratic contraction',w-rate*s.diff(a*w*w/2,w)-(1-rate*a)*w)
check('two state policy gradient',s.diff(p*x1+(1-p)*x2,x)-p*(1-p)*(x1-x2))
fp,fn=s.symbols('false_positive_cost false_negative_cost',positive=True)
threshold=fp/(fp+fn)
check('cost threshold equality',fp*(1-threshold)-fn*threshold)
V,innovation,ar=s.symbols('V innovation ar',real=True)
check('stationary AR1 variance',(V-ar*ar*V-innovation).subs(V,innovation/(1-ar*ar)))
drop=s.symbols('drop',positive=True)
check('inverted dropout variance',(1-drop)*(y/(1-drop)-y)**2+drop*y*y-y*y*drop/(1-drop))
result={'sympy_version':s.__version__,'checks':checks,'passed':sum(row['passed'] for row in checks),'total':len(checks),'all_passed':all(row['passed'] for row in checks),'scope':'Selected scalar identities and low dimensional derivative formulas; not every equation or theorem.'}
(ROOT/'math-verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps({k:v for k,v in result.items() if k!='checks'},indent=2))
for row in checks:
    if not row['passed']:print(row)
sys.exit(not result['all_passed'])
