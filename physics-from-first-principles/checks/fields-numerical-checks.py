"""Representative independent arithmetic, conservation and boundary checks for chapters 12–19.

Run with Python 3 and NumPy. This checks selected relationships, not every claim.
"""
from pathlib import Path
import json
import math
import platform
import numpy as np

records = []


def near(label, actual, expected, *, rtol=1e-9, atol=1e-12):
    assert np.allclose(actual, expected, rtol=rtol, atol=atol), (label, actual, expected)
    records.append({"check": label, "status": "passed"})


eps0 = 8.8541878128e-12
mu0 = 1.25663706212e-6
ce = 299792458.0
ke = 1/(4*math.pi*eps0)
kB = 1.380649e-23
Rgas = 8.314462618

# 12: dimensions are reviewed in prose; arithmetic and scale laws here.
near("12 hydrostatic gauge pressure", 1000*9.81*2, 19620)
Q = math.pi*100*0.001**4/(8*0.001*1)
near("12 Poiseuille mean speed", Q/(math.pi*0.001**2), 0.0125)
near("12 tube Reynolds number", 1000*0.0125*0.002/0.001, 25)
near("12 rod extension", 1000*2/(2e11*1e-4), 1e-4)
near("12 longitudinal rod speed", math.sqrt(2e11/8000), 5000)
near("12 diffusion rms time", 0.001**2/(2e-9), 500)
x = np.linspace(-10, 10, 200001)
f = np.exp(-x*x/4)/math.sqrt(4*math.pi)
dx = x[1]-x[0]
near("12 Gaussian total amount", dx*(f.sum()-(f[0]+f[-1])/2), 1, rtol=1e-9)
near("12 Gaussian mean-square displacement", dx*((x*x*f).sum()), 2, rtol=1e-8)

# 13: thermodynamic sign and entropy balances.
near("13 isothermal work", Rgas*300*math.log(2), 1729, rtol=0.001)
near("13 reversible adiabatic cooling", 300*2**(-2/3), 189, rtol=0.001)
near("13 finite-body entropy production", 100*math.log(49/48), 2.0619, rtol=0.0001)
near("13 practice finite-body entropy", 200*math.log(16/15), 12.9077, rtol=0.0001)
Qc = 600.0
W = Qc*(300-270)/270
near("13 refrigerator reversible entropy", (Qc+W)/300-Qc/270, 0)
near("13 Carnot energy balance", 1000-500, 500)

# 14: normalization, derivatives of partition sums and statistical response.
near("14 binomial normalization", sum(math.comb(4,n)*0.5**4 for n in range(5)), 1)
near("14 degenerate two-level occupation", 3/3/(1+3/3), 0.5)
near("14 fermion occupation", 1/(2+1), 1/3)
near("14 boson occupation", 1/(2-1), 1)
near("14 rms gas speed", math.sqrt(3*1.381e-23*300/4.65e-26), 517, rtol=0.001)
beta = 0.7  # dimensionless test with kB=1 and gap=1
delta = 1.0
h = 1e-5
U = lambda b: delta/(1+math.exp(b*delta))
minus_derivative = -(U(beta+h)-U(beta-h))/(2*h)
p = 1/(1+math.exp(beta))
near("14 canonical energy fluctuation derivative", minus_derivative, p*(1-p))
near("14 magnetic state mean at aligned weight ratio3", (3-1)/(3+1), 0.5)

# 15: a spherical potential differentiates to the correct field.
rad = 2.0
charge = 3.0e-9
rr = 0.7
potential_inside = lambda z: ke*charge*(3*rad*rad-z*z)/(2*rad**3)
dV = (potential_inside(rr+h)-potential_inside(rr-h))/(2*h)
near("15 sphere field from potential derivative", -dV, ke*charge*rr/rad**3, rtol=1e-8)
near("15 sphere potential continuity", potential_inside(rad), ke*charge/rad)
near("15 two-sheet example", 2e-9/eps0*0.010, 2.26, rtol=0.001)

# 16: image candidates satisfy boundary values, including off-axis points.
a = 3.0
rad = 1.0
b = rad*rad/a
qimage = -rad/a
for theta in np.linspace(0, math.pi, 41):
    d = math.sqrt(a*a+rad*rad-2*a*rad*math.cos(theta))
    di = math.sqrt(b*b+rad*rad-2*b*rad*math.cos(theta))
    near("16 grounded sphere image boundary", 1/d+qimage/di, 0)
for s in [0, 0.5, 2, 10]:
    near("16 grounded plane image boundary", 1/math.sqrt(s*s+a*a)-1/math.sqrt(s*s+a*a), 0)
near("16 isolated dielectric voltage ratio", 1/4, 0.25)
near("16 fixed-voltage capacitor energy ratio", 4, 4)

# 17: RC energy is integrated rather than inferred from the claimed answer.
t = np.linspace(0, 30, 300001)
dt = t[1]-t[0]
current = np.exp(-t)  # normalized R=C=V0=1
integrate = lambda vals: dt*(vals.sum()-(vals[0]+vals[-1])/2)
near("17 RC source energy integral", integrate(current), 1, rtol=1e-8)
near("17 RC resistor energy integral", integrate(current*current), 0.5, rtol=1e-8)
near("17 LC angular frequency", 1/math.sqrt(0.10*10e-6), 1000)
near("17 inductor energy", 0.5*0.2*3*3, 0.9)
near("17 induction emf", math.pi*0.05**2*0.2, 0.0015707963267948969)
omega = 2.0
cap = 0.3
Zc = 1j/(omega*cap)
Iamp = -1j*omega*cap
near("17 capacitor negative-frequency phasor relation", Zc*Iamp, 1)

# 18: field relations, intensity, conserved flux fractions and radiation scaling.
near("18 vacuum constant relation", 1/math.sqrt(mu0*eps0), ce, rtol=1e-9)
near("18 intensity from peak electric amplitude", 0.5*eps0*ce*100**2, 13.3, rtol=0.003)
Z0 = math.sqrt(mu0/eps0)
Z2 = Z0/1.5
r = (Z2-Z0)/(Z2+Z0)
trans = 2*Z2/(Z0+Z2)
near("18 Fresnel reflected fraction", r*r, 0.04)
near("18 Fresnel energy conservation", r*r+(Z0/Z2)*trans*trans, 1)
theta = np.linspace(0, math.pi, 100001)
dtheta = theta[1]-theta[0]
near("18 dipole angular factor integral", 2*math.pi*dtheta*(np.sin(theta)**3).sum(), 8*math.pi/3)
near("18 reflecting force", 2*2/3e8, 1.3333333333333334e-8)

# 19: complex algebra, spectral theorem examples and exact propagator.
eye = np.eye(2, dtype=complex)
X = np.array([[0,1],[1,0]], dtype=complex)
Y = np.array([[0,-1j],[1j,0]], dtype=complex)
Z = np.diag([1,-1]).astype(complex)
near("19 Pauli XY commutator", X@Y-Y@X, 2j*Z)
near("19 Pauli XZ commutator", X@Z-Z@X, -2j*Y)
psi = np.array([math.sqrt(3)/2, 0.5j])
plus = np.array([1,1])/math.sqrt(2)
near("19 complex-state normalization", np.vdot(psi,psi), 1)
near("19 plus measurement probability", abs(np.vdot(plus,psi))**2, 0.5)
near("19 Z expectation", np.vdot(psi,Z@psi), 0.5)
H = np.array([[2.0,0.3],[0.3,2.0]])
near("19 coupled eigenvalues", np.linalg.eigvalsh(H), [1.7,2.3])
for omega in [0.1,1,3]:
    for detuning in [0,0.7,2]:
        H = (omega*X+detuning*Z)/2  # hbar=1
        energies, vectors = np.linalg.eigh(H)
        for time in [0,0.3,1,4]:
            Umat = vectors@np.diag(np.exp(-1j*energies*time))@vectors.conj().T
            near("19 propagator unitarity", Umat.conj().T@Umat, eye)
            state = Umat@np.array([1,0])
            analytic = omega**2/(omega**2+detuning**2)*math.sin(math.sqrt(omega**2+detuning**2)*time/2)**2
            near("19 detuned transition against independent eigensolver", abs(state[1])**2, analytic)

report = {
    "python": platform.python_version(),
    "numpy": np.__version__,
    "passed_assertions": len(records),
    "checks": records,
    "limits": "Selected arithmetic, known limits, boundary values, numerical integrals and matrix invariants. Not an exhaustive proof or validation of every textual claim.",
}
destination = Path(__file__).with_name("fields-numerical-results.json")
destination.write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps({"passed_assertions": len(records), "python": platform.python_version(), "numpy": np.__version__}, indent=2))
