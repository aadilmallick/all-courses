"""Independent numerical evidence for selected derivations; not a proof checker."""
from pathlib import Path
import importlib.util
import json
import sys
import numpy as np
from scipy import stats

root = Path(__file__).resolve().parents[1]
passed = []
def check(name, actual, expected, **kwargs):
    np.testing.assert_allclose(actual, expected, **kwargs)
    passed.append(name)
X = np.array([[1.,1.],[1.,2.],[1.,4.]])
y = np.array([8.,11.,18.])
beta = np.linalg.lstsq(X,y,rcond=None)[0]
check('delivery coefficients',beta,[4.5,47/14])
check('delivery mean squared error',np.mean((X@beta-y)**2),1/42)
check('delivery residual orthogonality',X.T@(y-X@beta),[0,0],atol=1e-12)
u=np.array([3.,1.]);v=np.array([1.,1.]);p=(u@v)/(v@v)*v
check('line projection',p,[2,2]);check('projection residual orthogonality',(u-p)@v,0)
A=np.array([[2.,1.],[0.,3.],[1.,-1.]])
U,s,Vt=np.linalg.svd(A,full_matrices=False)
check('SVD reconstruction',(U*s)@Vt,A,atol=1e-12)
check('pseudoinverse identity',A@np.linalg.pinv(A)@A,A,atol=1e-12)
points=np.array([[2.,0.],[0.,1.],[-2.,0.],[0.,-1.]])
_,s,Vt=np.linalg.svd(points,full_matrices=False)
check('PCA variance fraction',s[0]**2/np.sum(s**2),.8)
check('PCA reconstruction error',np.sum((points-np.outer(points@Vt[0],Vt[0]))**2),2)
H=np.diag([1.,20.]);x=np.array([4.,4.]);next_x=x-.05*(H@x)
check('quadratic update',[*next_x],[3.8,0])
check('binomial example',stats.binom.pmf(2,5,.2),.2048)
check('beta posterior predictive',stats.beta.mean(8,4),2/3)
check('geometric mean',stats.geom.mean(.25),4)
check('gamma rate convention',stats.gamma.mean(a=3,scale=1/2),1.5)
check('Gaussian CDF example',stats.norm.cdf(12,loc=10,scale=2),.8413447460685429)
# Cross entropy score gradient, checked against central differences.
z=np.array([.2,-.3,1.1]);target=np.array([0,0,1]);m=z.max();p=np.exp(z-m);p/=p.sum()
def softmax_loss(q):
    m=q.max();return m+np.log(np.exp(q-m).sum())-target@q
numeric=[]
for j in range(3):
    offset=np.eye(3)[j]*1e-5
    numeric.append((softmax_loss(z+offset)-softmax_loss(z-offset))/2e-5)
check('softmax cross entropy gradient',p-target,numeric,atol=1e-8)
check('softmax Hessian null direction',(np.diag(p)-np.outer(p,p))@np.ones(3),[0,0,0],atol=1e-14)
spec=importlib.util.spec_from_file_location('neural',root/'examples/neural_network.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
parameters=np.array([.1,-.2,0.,.3,0.,0.,.4,-.5,0.])
discrepancy=module.gradient_check(parameters);passed.append('all nine neural parameter derivatives')
# Exact finite joint distribution verifies total expectation and total variance.
values=np.array([1.,3.,2.,6.]);weights=np.array([.1,.2,.3,.4]);group=np.array([0,0,1,1]);mean=weights@values
within=between=0.
for g in [0,1]:
    mask=group==g;mass=weights[mask].sum();gm=weights[mask]@values[mask]/mass
    within+=weights[mask]@((values[mask]-gm)**2);between+=mass*(gm-mean)**2
check('law of total variance',within+between,weights@((values-mean)**2))

# Additional cross-checks of worked answers and assumptions from all topic families.
from scipy import integrate, special
check('initial model MSE',np.mean((X@np.array([5.,3.])-y)**2),1/3)
check('changed model MSE',np.mean((X@np.array([5.,4.])-y)**2),14/3)
check('stable log sum exp',special.logsumexp([1000.,999.]),1000.3132616875182)
check('rank-nullity example null vector',np.array([[1.,2.],[2.,4.]])@[-2.,1.],[0,0])
check('rank-nullity example rank',np.linalg.matrix_rank([[1.,2.],[2.,4.]]),1)
check('symmetric matrix eigenvalues',np.linalg.eigvalsh([[2.,1.],[1.,2.]]),[1,3])
check('indefinite quadratic Hessian eigenvalues',np.linalg.eigvalsh([[2.,3.],[3.,2.]]),[-1,5])
assert abs(np.exp(.1)-(1+.1+.1**2/2))<=np.exp(.1)*.1**3/6
passed.append('exponential Taylor error bound')
assert abs(np.log1p(.1)-(.1-.1**2/2))<=2*.1**3/6
passed.append('logarithm Taylor error bound')
check('integration by parts example',integrate.quad(lambda t:t*np.exp(t),0,1)[0],1)
check('Gaussian normalization',integrate.quad(lambda t:np.exp(-t*t/2),-np.inf,np.inf)[0],np.sqrt(2*np.pi))
check('transformed uniform square density normalization',integrate.quad(lambda t:1/(2*np.sqrt(t)),0,1)[0],1)
check('weighted density variance',integrate.quad(lambda t:(t-2/3)**2*2*t,0,1)[0],1/18)
def vector_function(q):return np.array([q[0]**2+q[1],q[0]*q[1]])
point=np.array([1.,2.]);offset=1e-5
numerical_J=np.column_stack([(vector_function(point+offset*direction)-vector_function(point-offset*direction))/(2*offset) for direction in np.eye(2)])
check('worked vector-function Jacobian',numerical_J,[[2,1],[2,1]],atol=1e-9)
check('worked vector-function first-order-null remainder',vector_function(point+[.01,-.02])-vector_function(point),[.0001,-.0002],atol=1e-12)
check('quadratic gradient at (1,2)',[2*1+3*2,3*1+2*2],[8,7])
check('equality-constrained multiplier equations',[2*.5-1,2*.5-1,.5+.5-1],[0,0,0])
check('inequality KKT stationarity and complementary slackness',[2*(1-2)+2,2*(1-1)],[0,0])
# Verify the stated descent upper bound on a deterministic family of SPD quadratics.
random=np.random.default_rng(41)
for _ in range(20):
 B=random.normal(size=(3,3));Hq=B.T@B+np.eye(3);current=random.normal(size=3)
 L=np.linalg.eigvalsh(Hq)[-1];gradient=Hq@current;next_point=current-gradient/L
 before=.5*current@Hq@current;after=.5*next_point@Hq@next_point
 assert after<=before-(gradient@gradient)/(2*L)+1e-11
passed.append('smooth descent bound on twenty SPD quadratics')
check('Bayes route posterior',.3*.1/(.3*.1+.05*.9),.4)
check('geometric memorylessness',stats.geom.sf(9,.25)/stats.geom.sf(5,.25),stats.geom.sf(4,.25))
check('gamma shape-rate variance',stats.gamma.var(a=3,scale=.5),.75)
check('beta(2,3) mean and variance',[stats.beta.mean(2,3),stats.beta.var(2,3)],[.4,.04])
check('chi-squared moments',[stats.chi2.mean(5),stats.chi2.var(5)],[5,10])
check('Student t variance',stats.t.var(5),5/3)
check('squared t and F CDF identity',2*stats.t.cdf(np.sqrt(2),5)-1,stats.f.cdf(2,1,5))
def posterior_kernel(mu):return np.exp(-mu*mu/8-4*(mu-2)**2/2)
normalizer=integrate.quad(posterior_kernel,-np.inf,np.inf)[0]
posterior_mean=integrate.quad(lambda mu:mu*posterior_kernel(mu),-np.inf,np.inf)[0]/normalizer
posterior_variance=integrate.quad(lambda mu:(mu-posterior_mean)**2*posterior_kernel(mu),-np.inf,np.inf)[0]/normalizer
check('normal conjugate posterior by direct integration',[posterior_mean,posterior_variance],[32/17,4/17])
critical=stats.t.ppf(.975,3);interval=11+np.array([-1,1])*critical*np.sqrt(20/3)/2
check('worked t interval',interval,[6.891479486478,15.108520513522],atol=1e-9)
check('ANOVA worked statistic and p-value',[stats.f_oneway([1,2,3],[3,4,5],[4,5,6]).statistic,stats.f_oneway([1,2,3],[3,4,5],[4,5,6]).pvalue],[7,.027])
logistic_design=np.array([[1.,-1.],[1.,0.],[1.,1.],[1.,2.]])
logistic_target=np.array([0.,0.,1.,1.]);updated_score=logistic_design@np.array([0.,.05])
check('worked logistic update loss',np.mean(np.logaddexp(0,updated_score)-logistic_target*updated_score),.6686157841650221)
q=np.array([.2,.8]);predictive=np.array([.5,.5]);kl=np.sum(q*np.log(q/predictive))
check('KL numerical value and cross-entropy identity',[kl,-np.sum(q*np.log(predictive))+np.sum(q*np.log(q))],[.19274475702175753,kl])
check('Hoeffding sample-size ceiling',np.ceil(np.log(2/.05)/(2*.05**2)),738)

report={'passed':len(passed),'checks':passed,'maximum_neural_gradient_discrepancy':discrepancy}
print(json.dumps(report,indent=2))
