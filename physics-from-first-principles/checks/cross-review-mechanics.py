"""Independent representative checks by the fields/quantum-foundations author.

These target chapters04–11 arithmetic, signs, boundary values and invariants.
"""
from pathlib import Path
import json
import math
import numpy as np

checks = []


def near(label, actual, expected, rtol=1e-8, atol=1e-10):
    assert np.allclose(actual, expected, rtol=rtol, atol=atol), (label, actual, expected)
    checks.append(label)


g = 9.81
# Newtonian mechanics and force bookkeeping.
near("04 inclined sliding acceleration rounded to0.01", g*(0.5-0.2*math.sqrt(3)/2), 3.21, rtol=0, atol=0.0051)
near("04 ideal Atwood acceleration", g*(3-2)/(3+2), 1.962)
near("04 ideal Atwood tension", 2*(g+1.962), 23.544)
tau = 2
terminal = g*tau
near("04 drag velocity at one tau", terminal*(1-math.exp(-1)), 12.40, rtol=0.001)
near("04 drag displacement at one tau", terminal*(tau-tau*(1-math.exp(-1))), 14.44, rtol=0.001)
near("04 Euler drag second step", 0.981+0.1*(g-0.5*0.981), 1.91295)
near("04 elevator downward scale force", 70*(g-2), 546.7)

# Collisions checked from both conserved quantities with arbitrary unequal masses.
for m1,m2,u1,u2 in [(2,1,3,0),(1,3,4,0),(3,7,-2,5)]:
    v1 = ((m1-m2)*u1+2*m2*u2)/(m1+m2)
    v2 = (2*m1*u1+(m2-m1)*u2)/(m1+m2)
    near("05 elastic momentum", m1*v1+m2*v2, m1*u1+m2*u2)
    near("05 elastic kinetic energy", m1*v1*v1+m2*v2*v2, m1*u1*u1+m2*u2*u2)
    V = (m1*u1+m2*u2)/(m1+m2)
    loss = (m1*u1*u1+m2*u2*u2-(m1+m2)*V*V)/2
    near("05 inelastic relative-energy loss", loss, 0.5*m1*m2/(m1+m2)*(u1-u2)**2)
near("05 spring and resistance example", math.sqrt(2*(0.5*100*0.08**2-0.5*0.4)/0.2), math.sqrt(1.2))
near("05 circular orbit speed", math.sqrt(3.986e14/7e6), 7550, rtol=0.001)
near("05 circular orbit period", 2*math.pi*math.sqrt((7e6)**3/3.986e14), 5830, rtol=0.001)

# Rotation: work/energy, contact, pulley inertia and Euler-equation stability.
near("06 torque work disk", 0.9*20, 0.5*0.09*20**2)
Tbeam = (10*g*1+5*g*1.5)/2
near("06 beam cable", Tbeam, 85.8375)
near("06 beam hinge force", 15*g-Tbeam, 61.3125)
near("06 disk incline no-slip threshold", math.tan(math.pi/6)/3, 0.19245, rtol=0.0001)
a = g/5.5
near("06 inertial pulley acceleration", a, 1.784, rtol=0.001)
near("06 pulley torque from tension difference", 3*(g-a)-2*(g+a), 0.5*a)
I1,I2,I3,Omega = 1,2,3,4
stability = (I2-I3)*(I1-I2)*Omega**2/(I1*I3)
assert stability > 0
checks.append("06 intermediate-axis perturbation has positive growth coefficient")

# Oscillation: response amplitude/phase satisfies the original complex equation.
m,k,b,F0,w = 0.5,50,2,1,10
X = F0/(k-m*w*w-1j*b*w)
near("07 complex driven equation", (k-m*w*w-1j*b*w)*X, F0)
near("07 response amplitude", abs(X), 0.05)
near("07 mean resistor-like dissipation", 0.5*b*w*w*abs(X)**2, 0.25)
near("07 displacement peak", math.sqrt(k/m-2*(b/(2*m))**2), math.sqrt(92))

# Waves: numerical Fourier projection versus the stated centered-triangle formula.
L,h = 1.0,0.3
x = np.linspace(0,L,100001)
shape = np.where(x <= L/2, 2*h*x/L, 2*h*(1-x/L))
dx = x[1]-x[0]
for n in range(1,9):
    values = shape*np.sin(n*math.pi*x/L)
    numerical = 2/L*dx*(values.sum()-(values[0]+values[-1])/2)
    analytical = 8*h/(n*n*math.pi**2)*math.sin(n*math.pi/2)
    near("08 triangular-pluck Fourier coefficient", numerical, analytical, atol=1e-9)
for Z1,Z2 in [(1,3),(7,2),(4,4)]:
    refl = (Z1-Z2)/(Z1+Z2)
    trans = 2*Z1/(Z1+Z2)
    near("08 string-junction power conservation", refl*refl+(Z2/Z1)*trans*trans, 1)
near("08 acoustic source Doppler", 500*340/(340-20), 531.25)

# Optics: ray and interference calculations, distinct from intensity-amplitude conversion.
near("09 refraction angle", math.degrees(math.asin(math.sin(math.pi/6)/1.5)), 19.47, rtol=0.001)
near("09 double-slit spacing", 500e-9*1.5/(0.30e-3), 0.0025)
near("09 three-polarizer intensity fraction", 0.5*math.cos(math.pi/6)**2*math.cos(math.pi/3)**2, 3/32)
near("09 visibility unequal intensities", (25-1)/(25+1), 12/13)
near("09 Airy angular scale", 1.22*550e-9/0.1, 6.71e-6)
near("09 quarter-wave film thickness", 600e-9/(4*1.5), 100e-9)

# Relativity: independent invariant check over several boosts and event separations.
for beta in [-0.8,-0.2,0.6,0.9]:
    gamma = 1/math.sqrt(1-beta*beta)
    for ct,xx in [(600,300),(0,600),(1200,-900)]:
        ctp = gamma*(ct-beta*xx)
        xp = gamma*(xx-beta*ct)
        near("10 Lorentz interval invariance", ctp*ctp-xp*xp, ct*ct-xx*xx)
near("10 collinear velocity composition", (0.8+0.7)/(1+0.8*0.7), 0.9615384615384616)
near("10 system mass from opposite equal-speed particles", 2/math.sqrt(1-0.8**2), 10/3)
near("10 longitudinal Doppler", math.sqrt((1-0.8)/(1+0.8)), 1/3)

# Analytical mechanics: Kepler identities and numerical phase-space map determinants.
mu,kappa,ell,ecc = 2,5,3,0.4
p = ell**2/(mu*kappa)
a = p/(1-ecc**2)
energy_ecc = mu*kappa*kappa*(ecc**2-1)/(2*ell**2)
near("11 Kepler energy identity", energy_ecc, -kappa/(2*a))
bminor = a*math.sqrt(1-ecc**2)
period_from_area = math.pi*a*bminor/(ell/(2*mu))
near("11 Kepler period from swept area", period_from_area**2, 4*math.pi**2*mu*a**3/kappa)
step,w,m = 0.1,3,2
k = m*w*w
forward = np.array([[1,step/m],[-step*k,1]])
symplectic = np.array([[1-step*step*k/m,step/m],[-step*k,1]])
near("11 forward Euler area multiplier", np.linalg.det(forward), 1+(w*step)**2)
near("11 symplectic Euler area multiplier", np.linalg.det(symplectic), 1)
near("11 chaotic horizon example", math.log(1e4)/0.5, 18.42, rtol=0.001)

result = {"passed_assertions": len(checks), "checks": checks,
          "limits": "Representative numerical and invariant checks; not every equation, proof, or prose claim is automatically verified."}
Path(__file__).with_name("cross-review-mechanics-results.json").write_text(json.dumps(result,indent=2),encoding="utf-8")
print(json.dumps({"passed_assertions": len(checks)},indent=2))
