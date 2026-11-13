"""Independent selected numerical checks for chapters 01–03, 27 and 28."""
from pathlib import Path
import json,math
import numpy as np

checks=[]
def verify(name,actual,expected,rtol=1e-9,atol=1e-12):
    actual=float(actual);expected=float(expected)
    assert math.isclose(actual,expected,rel_tol=rtol,abs_tol=atol),(name,actual,expected)
    checks.append({'name':name,'actual':actual,'expected':expected,'passed':True})

verify('01 density from 15 cubic cm',.120/(15*(.01)**3),8000)
verify('01 percentage bases',1.2*.8,.96)
verify('02 three-dimensional separation',np.linalg.norm(np.array([1,5,12])-np.array([-2,1,0])),13)
a=np.array([1,2,0]);b=np.array([2,-1,0])
verify('02 orthogonal dot',np.dot(a,b),0)
verify('02 oriented cross z',np.cross(a,b)[2],-5)
theta=math.pi/4
rotation=np.array([[math.cos(theta),math.sin(theta)],[-math.sin(theta),math.cos(theta)]])
verify('02 passive rotation norm',np.linalg.norm(rotation@np.array([2,0])),2)
u=10;g=9.81;theta=math.pi/4
verify('03 projectile flight time',2*u*math.sin(theta)/g,1.4416,rtol=.0001)
verify('03 projectile range',u**2*math.sin(2*theta)/g,10.1937,rtol=.0001)
verify('03 constant acceleration distance with reversal',(4.25-2)+(4.25-(-2)),8.5)
verify('03 integrated velocity with reversal',4+4,8)
verify('27 centred difference error',((2+.05)**3-(2-.05)**3)/(.1)-12,.0025,rtol=1e-9)
verify('27 diffusion maximum step',.02**2/(2*.01),.02)
verify('27 Monte Carlo standard error',math.sqrt((1/5-1/9)/10000),.00298142397,rtol=1e-8)
times=np.array([1.98,2,2.02])
verify('28 sample mean',np.mean(times),2)
verify('28 unbiased sample deviation',np.std(times,ddof=1),.02)
X=np.array([.25,.40,.55,.70]);Y=np.array([1.03,1.65,2.25,2.83])
design=np.column_stack([np.ones(4),X])
intercept,slope=np.linalg.lstsq(design,Y,rcond=None)[0]
verify('28 synthetic fit intercept',intercept,.04)
verify('28 synthetic fit slope',slope,4)
residual=Y-design@np.array([intercept,slope])
verify('28 synthetic fit RSS',np.dot(residual,residual),.0004)
variance=np.dot(residual,residual)/2
covariance=variance*np.linalg.inv(design.T@design)
verify('28 fitted slope standard error',math.sqrt(covariance[1,1]),.0421637021356)
gravity=4*math.pi**2/(2.006**2)
verify('28 pendulum g',gravity,9.81065,rtol=1e-6)
relative=math.sqrt(.002**2+4*(.004/2.006)**2)
verify('28 pendulum standard uncertainty',gravity*relative,.0438,rtol=.002)

report={'scope':'Independent selected arithmetic and linear-algebra checks, not exhaustive proof or experimental validation.','passed_checks':len(checks),'checks':checks}
out=Path(__file__).with_name('foundations-cross-results.json')
out.write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'passed_checks':len(checks),'output':str(out)},indent=2))
