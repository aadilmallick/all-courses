"""Independent selected checks for Chapters 12–19, using Python stdlib."""
import math
count = 0
def ck(a, b, tolerance=1e-9):
    global count
    assert abs(a-b) <= tolerance * max(1, abs(a), abs(b)), (a,b)
    count += 1
def ok(condition):
    global count
    assert condition
    count += 1
def integral(f, a, b, n=4000):
    h=(b-a)/n
    return h/3*(f(a)+f(b)+sum((4 if i%2 else 2)*f(a+i*h) for i in range(1,n)))
# 12: independent profile integration and diffusion PDE residuals.
R, eta, dp, L = 0.001, 0.001, 100, 1
v=lambda r: dp*(R*R-r*r)/(4*eta*L)
Q=integral(lambda r: v(r)*2*math.pi*r,0,R)
ck(Q, math.pi*dp*R**4/(8*eta*L))
ck(Q/(math.pi*R**2),0.0125)
ck(1000*0.0125*(2*R)/eta,25)
for D,t,x in [(0.3,2,0),(0.3,2,1),(2,0.7,-3)]:
    c=math.exp(-x*x/(4*D*t))/math.sqrt(4*math.pi*D*t)
    ct=c*(-1/(2*t)+x*x/(4*D*t*t))
    cxx=c*(x*x/(4*D*D*t*t)-1/(2*D*t))
    ck(ct,D*cxx)
# 13: first-law signs, reversible adiabat and finite-body entropy.
ck(-80-(-140),60)
ck(8**(-(5/3-1)),0.25)
ck(1200*(1-300/500),480)
ck(100*math.log(350/400)+100*math.log(350/300),100*math.log(49/48))
ok(200*math.log(400/300)+200*math.log(400/500)>0)
# 14: direct finite canonical sums versus derivative identities.
energies=[0,1,1,3]
for beta in [0.2,1,3]:
    weights=[math.exp(-beta*E) for E in energies]
    Z=sum(weights)
    U=sum(E*w for E,w in zip(energies,weights))/Z
    U2=sum(E*E*w for E,w in zip(energies,weights))/Z
    h=1e-4
    logZ=lambda b: math.log(sum(math.exp(-b*E) for E in energies))
    ck(-(logZ(beta+h)-logZ(beta-h))/(2*h),U,1e-7)
    ck((logZ(beta+h)-2*logZ(beta)+logZ(beta-h))/(h*h),U2-U*U,1e-6)
ck(1/(math.exp(math.log(2))+1),1/3)
ck(1/(math.exp(math.log(2))-1),1)
# 15: potential derivatives checked by centered finite differences.
Qe, radius, ke = 3, 2, 5
inside=lambda r: ke*Qe*(3*radius**2-r*r)/(2*radius**3)
outside=lambda r:ke*Qe/r
ck(inside(radius),outside(radius))
for r in [0.2,0.7,1.5]:
    h=1e-5
    ck(-(inside(r+h)-inside(r-h))/(2*h),ke*Qe*r/radius**3)
# 16: grounded-sphere boundary cancellation at many angles; plane energy force.
a,R,q=3,1,2
b,qi=R*R/a,-q*R/a
for theta in [0,0.2,0.7,1.3,2,math.pi]:
    d=math.sqrt(a*a+R*R-2*a*R*math.cos(theta))
    di=math.sqrt(b*b+R*R-2*b*R*math.cos(theta))
    ck(q/d+qi/di,0)
for height in [0.3,1,4]:
    h=1e-5
    U=lambda x:-q*q/(4*x)
    ck(-(U(height+h)-U(height-h))/(2*h),-q*q/(4*height**2),1e-8)
C0,V,epsr=100e-12,20,4
initial_energy=0.5*C0*V*V
isolated_Q=C0*V
isolated_V=isolated_Q/(epsr*C0)
ck(isolated_V,5)
ck(0.5*epsr*C0*isolated_V**2/initial_energy,0.25)
ck(0.5*epsr*C0*V*V/initial_energy,4)
ck(V*(epsr*C0*V-C0*V)/initial_energy,6)
# 17: charging ODE and phasor signs with exp(-i omega t).
for time in [0,0.1,0.5,2]:
    R,C,V=2,0.3,5
    Q=C*V*(1-math.exp(-time/(R*C)))
    I=V/R*math.exp(-time/(R*C))
    ck(R*I+Q/C,V)
L,C,R=0.1,1e-5,20
w=1/math.sqrt(L*C)
ck(w,1000)
ck(complex(R,1/(w*C)-w*L),R)
ck(math.pi*0.05**2*0.2,0.0015707963267948967)
# 18: flux, radiation angular integral, and interface energy.
ck(integral(lambda t:2*math.pi*math.sin(t)**3,0,math.pi),8*math.pi/3)
for Z1,Z2 in [(1,1),(1,2),(3,0.7),(377,377/1.5)]:
    r=(Z2-Z1)/(Z2+Z1);t=2*Z2/(Z1+Z2)
    ck(r*r+(Z1/Z2)*t*t,1)
ck(2*2/3e8,1.3333333333333334e-8)
ck(2**4*(0.5)**2,4)
# 19: arbitrary normalized qubits satisfy Bloch norm and Robertson bound.
for a,b in [(1,0),(1,1j),(2+1j,1-3j),(-0.4+2j,0.8-0.5j)]:
    norm=math.sqrt(abs(a)**2+abs(b)**2);a,b=a/norm,b/norm
    X=2*(a.conjugate()*b).real
    Y=2*(a.conjugate()*b).imag
    Z=abs(a)**2-abs(b)**2
    ck(X*X+Y*Y+Z*Z,1)
    ok(math.sqrt(max(0,1-X*X))*math.sqrt(max(0,1-Y*Y))+1e-12>=abs(Z))
for detuning in [0,1,3]:
    Omega=2
    maximum=Omega**2/(Omega**2+detuning**2)
    ok(0<=maximum<=1)
    ck(maximum*(Omega**2+detuning**2),Omega**2)
print(f'Passed {count} independent selected checks for Chapters 12–19.')
