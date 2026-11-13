"""Independent arithmetic/invariant checks for selected examples, chapters 20–26.

Run with Python 3 and NumPy. This checks selected formulas and limits, not every
statement or the validity of a physical model for a particular material.
"""
from pathlib import Path
import json
import math
import numpy as np

records=[]

def check(name, actual, expected, rtol=1e-9, atol=1e-12):
    actual=float(actual);expected=float(expected)
    assert math.isclose(actual,expected,rel_tol=rtol,abs_tol=atol),(name,actual,expected)
    records.append({'name':name,'actual':actual,'expected':expected,'passed':True})

def integrate(f,a,b,n=20000):
    # Composite Simpson quadrature, independent of closed-form antiderivatives.
    assert n%2==0
    h=(b-a)/n
    odd=sum(f(a+j*h) for j in range(1,n,2))
    even=sum(f(a+j*h) for j in range(2,n,2))
    return h*(f(a)+f(b)+4*odd+2*even)/3

hbar=1.055e-34;me=9.11e-31;e=1.602e-19
E1=hbar*hbar*math.pi**2/(2*me*(1e-9)**2)/e
check('20 electron 1nm well energy, eV',E1,0.376,rtol=.002)
check('20 well middle-half probability quadrature',integrate(lambda x:2*math.sin(math.pi*x)**2,.25,.75),.5+1/math.pi)
check('20 left-quarter probability quadrature',integrate(lambda x:2*math.sin(math.pi*x)**2,0,.25),.25-1/(2*math.pi))
check('20 ground-state variance quadrature',integrate(lambda x:2*(x-.5)**2*math.sin(math.pi*x)**2,0,1),1/12-1/(2*math.pi**2))
kappa=math.sqrt(2*me*e)/hbar
T=1/math.cosh(kappa*.2e-9)**2
check('20 finite barrier transmission',T,.405,rtol=.005)
for ratio in [.2,.5,1,2,5]:
    r=(1-ratio)/(1+ratio)
    t=2/(1+ratio)
    check('20 step flux R+T ratio '+str(ratio),r*r+ratio*t*t,1)

sx=np.array([[0,1],[1,0]],complex)
sy=np.array([[0,-1j],[1j,0]],complex)
sz=np.array([[1,0],[0,-1]],complex)
check('21 Pauli commutator norm',np.linalg.norm(sx@sy-sy@sx-2j*sz),0)
check('21 spin magnitude operator norm',np.linalg.norm((sx@sx+sy@sy+sz@sz)/4-.75*np.eye(2)),0)
for theta in [0,math.pi/2,math.pi]:
    direction=math.cos(theta)*sz+math.sin(theta)*sx
    state=np.array([math.cos(theta/2),math.sin(theta/2)],complex)
    check('21 rotated spin eigenvector residual '+str(theta),np.linalg.norm(direction@state-state),0)
check('21 spherical harmonic normalization quadrature',integrate(lambda theta:1.5*math.cos(theta)**2*math.sin(theta),0,math.pi),1)
check('21 hydrogen radial norm',integrate(lambda r:4*r*r*math.exp(-2*r),0,30),1,rtol=1e-8)
check('21 hydrogen mean radius',integrate(lambda r:4*r**3*math.exp(-2*r),0,30),1.5,rtol=1e-8)
check('21 hydrogen 3 to 2 wavelength nm',1240/(13.6*(1/4-1/9)),656,rtol=.001)
check('21 hydrogen 2 to 1 wavelength nm',1240/(13.6*(1-1/4)),121.6,rtol=.001)

v=.2;gap=1
exact=float(np.linalg.eigvalsh(np.array([[0,v],[v,gap]]))[0])
check('22 exact two-level energy from eigensolver',exact,(1-math.sqrt(1+4*v*v))/2)
check('22 second-order relative error',abs(-v*v-exact)/abs(exact),.03851648071345,rtol=1e-9)
# Solve the Gaussian stationarity equation by bisection, then evaluate its energy.
left,right=1.,2.
for _ in range(80):
    mid=(left+right)/2
    if mid**3-mid-.6>0:right=mid
    else:left=mid
alpha=(left+right)/2
energy=alpha/4+1/(4*alpha)+.075/(alpha*alpha)
check('22 quartic Gaussian alpha',alpha,1.2212,rtol=.0001)
check('22 quartic Gaussian energy',energy,.5603,rtol=.0002)
bell=np.array([1,0,0,1],complex)/math.sqrt(2)
rho=np.outer(bell,bell.conj())
reduced=np.einsum('ijkj->ik',rho.reshape(2,2,2,2))
check('22 Bell reduced density norm',np.linalg.norm(reduced-np.eye(2)/2),0)
xx=np.kron(sx,sx)
check('22 Bell x correlation',np.vdot(bell,xx@bell).real,1)
mixture=np.diag([.5,0,0,.5])
check('22 classical mixture x correlation',np.trace(mixture@xx).real,0)

mass=hbar*hbar/(2*e*(.3e-9)**2)
check('23 tight-binding effective mass fraction',mass/me,.423,rtol=.002)
sigma=1e28*e*e*1e-14/me
check('23 Drude conductivity S per m',sigma,2.82e6,rtol=.002)
check('23 junction built-in volts',.0259*math.log(1e12),.716,rtol=.001)
for wave in [.01,.1,.7,1.2]:
    # Substitute a plane wave into the discrete spring equation.
    lam=2-np.exp(1j*wave)-np.exp(-1j*wave)
    check('23 spring dispersion residual '+str(wave),abs(lam-4*math.sin(wave/2)**2),0)

Zeff=27/16
check('24 helium variational eV',-(Zeff**2)*27.2,-77.5,rtol=.001)
check('24 nuclear binding example MeV',.03*931.5,27.945)
check('24 beta-plus atomic-mass Q MeV',1.5-2*.511,.478)
check('24 thin target event rate',1e6*1e24*.1e-28,10)
check('24 fixed-target threshold model',(4**2-3**2)/(2*2),1.75)
check('24 two-flavor maximum probability',math.sin(2*math.pi/6)**2,.75)

G=6.674e-11;c=2.998e8
check('25 stationary 1km clock day shift ns',9.81*1000/c**2*86400*1e9,9.43,rtol=.002)
check('25 solar Schwarzschild radius km',2*G*1.99e30/c**2/1000,2.95,rtol=.003)
check('25 photon redshift ratio',math.sqrt(1-1/4),math.sqrt(3)/2)
H=70*1000/3.086e22
check('25 illustrative critical density kg per m3',3*H**2/(8*math.pi*G),9.2e-27,rtol=.01,atol=1e-32)

L=2.;sourcepoint=.7
green=lambda x: min(x,sourcepoint)*(L-max(x,sourcepoint))/L
eps=1e-6
jump=(green(sourcepoint+eps)-green(sourcepoint))/eps-(green(sourcepoint)-green(sourcepoint-eps))/eps
check('26 Dirichlet Green slope jump',jump,-1,rtol=1e-8)
check('26 uniform-source Green midpoint',integrate(lambda xi:min(1,xi)*(2-max(1,xi))/2,0,2),.5)
for p in [0,.25,.5,1]:
    initial=np.array([[.5,.5],[.5,.5]],complex)
    evolved=(1-p)*initial+p*sz@initial@sz
    check('26 dephasing trace p='+str(p),np.trace(evolved).real,1)
    assert min(np.linalg.eigvalsh(evolved))>=-1e-12
    check('26 dephasing purity p='+str(p),np.trace(evolved@evolved).real,(1+(1-2*p)**2)/2)
check('26 two-level C over kB at betaGap1',.25/math.cosh(.5)**2,.1966,rtol=.0003)
check('26 lower-state probability betaGap2',1/(1+math.exp(-2)),.8808,rtol=.0001)

report={'scope':'Selected arithmetic, numerical integrals, independent matrix eigenvalues, flux and normalization invariants for chapters 20–26. Not exhaustive mathematical proof or physical validation.','passed_checks':len(records),'numpy_version':np.__version__,'checks':records}
out=Path(__file__).with_name('quantum-math-results.json')
out.write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'passed_checks':len(records),'output':str(out)},indent=2))
