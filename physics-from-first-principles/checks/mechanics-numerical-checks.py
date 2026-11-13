"""Reproducible checks for selected claims in Chapters 04–11; Python 3 stdlib.

These calculations sample named examples and identities. They do not certify
every sentence, every equation, or arbitrary physical systems.
"""
import math

count = 0


def check(actual, expected, *, rel=1e-10, abs_tol=1e-10):
    global count
    assert math.isclose(actual, expected, rel_tol=rel, abs_tol=abs_tol), (actual, expected)
    count += 1


def truth(condition):
    global count
    assert condition
    count += 1


g = 9.81
# 04: constant acceleration, contact regimes, constraints and drag.
check((7 - 1) / 2, 3)
check(1 - 2 + 1.5, 0.5)
check(-2 + 3, 1)
check(g * (0.5 - 0.2 * math.sqrt(3) / 2), 3.21, abs_tol=0.005)
truth(math.tan(math.pi / 6) < 0.60)
check(g * (3 - 2) / (3 + 2), 1.962)
check(2 * (g + 1.962), 23.544)
tau, terminal = 2, 19.62
check(terminal * (1 - math.exp(-1)), 12.40, abs_tol=0.005)
check(terminal * (2 - 2 * (1 - math.exp(-1))), 14.44, abs_tol=0.005)
for t in [0, 0.01, 0.2, 1, 5, 20]:
    v = terminal * (1 - math.exp(-t / tau))
    acceleration = terminal / tau * math.exp(-t / tau)
    check(0.2 * acceleration, 0.2 * g - 0.1 * v)
check(0.5 * 4**2 / 0.8, 10)
check(0.981 + 0.1 * (9.81 - 0.5 * 0.981), 1.91295)
check(terminal * (1 - math.exp(-0.1)), 1.867, abs_tol=0.001)
check(70 * (g - 2), 546.7)
check(70 * (g + 2), 826.7)
truth(abs(1 - 0.5 / tau) < 1)
truth(abs(1 - 4 / tau) == 1)
# 05: work, energy, momentum and gravitational scales.
check((8 - 2) * 3, 18)
check(math.sqrt(2 * 18 / 2), 4.24, abs_tol=0.005)
check(0.5 * 200 * 0.1**2, 1)
check(math.sqrt(2 * 0.8 / 0.5), 1.79, abs_tol=0.005)
check(0.15 * (-15 - 20), -5.25)
check(-5.25 / 0.010, -525)
check((2 * 0 + 3 * 5) / 5, 3)
check((2 * 4 - 3) / 5, 1)
check(0.5 * 2 * 3**2 - 0.5 * 3 * 2**2, 3)
check(2 * 1 + 1 * 4, 6)
check(0.5 * 2 * 1**2 + 0.5 * 1 * 4**2, 9)
check(2 * math.log(3), 2.20, abs_tol=0.005)
GM, radius = 3.986e14, 7e6
v = math.sqrt(GM / radius)
check(v, 7.55e3, abs_tol=5)
check(2 * math.pi * radius / v / 60, 97.1, abs_tol=0.1)
check(math.sqrt(2 * GM / radius), 10.7e3, abs_tol=50)
radius = 8e6
check(math.sqrt(GM / radius), 7059, abs_tol=1)
check(2 * math.pi * math.sqrt(radius**3 / GM), 7121, abs_tol=2)
# 06: inertia, torque, rolling, and spinning.
check(0.8 * 15, 12)
check(0.8 * 15 * math.sin(math.pi / 6), 6)
check(1 / 12 + 1 / 4, 1 / 3)
check(0.5 * 2 * 0.3**2, 0.09)
check(0.9 / 0.09, 10)
check(0.5 * 0.09 * 20**2, 18)
check((10 * g + 5 * g * 1.5) / 2, 85.8375)
check(15 * g - 85.8375, 61.3125)
check((2 / 3) * g * 0.5, 3.27)
check(math.tan(math.pi / 6) / 3, 0.1925, abs_tol=0.0001)
check(g / 5.5, 1.784, abs_tol=0.001)
check(2 * (g + g / 5.5), 23.19, abs_tol=0.005)
check(3 * (g - g / 5.5), 24.08, abs_tol=0.005)
check(4 * 3 / 2.5, 4.8)
check(0.5 * 2.5 * 4.8**2 - 0.5 * 4 * 3**2, 10.8)
I1, I2, I3, spin = 1, 2, 3, 4
truth((I3 - I2) * (I2 - I1) * spin**2 / (I1 * I3) > 0)
# 07: frequencies, initial conditions, drive phases and power.
check(math.sqrt(50 / 0.5), 10)
check(2 * math.pi / 10, 0.628, abs_tol=0.001)
check(2 * math.pi / math.sqrt(g), 2.01, abs_tol=0.005)
gamma, w0 = 2, 10
wd = math.sqrt(w0**2 - gamma**2)
check(wd, 9.798, abs_tol=0.001)
A, B = 0.1, gamma * 0.1 / wd
check(-gamma * A + wd * B, 0)
for t in [0, 0.1, 0.4, 1]:
    q = A * math.cos(wd * t) + B * math.sin(wd * t)
    qd = -A * wd * math.sin(wd * t) + B * wd * math.cos(wd * t)
    x = math.exp(-gamma * t) * q
    dx = math.exp(-gamma * t) * (qd - gamma * q)
    ddx = math.exp(-gamma * t) * (-wd**2 * q - 2 * gamma * qd + gamma**2 * q)
    check(0.5 * ddx + 2 * dx + 50 * x, 0)
check(1 / (2 * 10), 0.05)
check(0.5 * 2 * (0.05 * 10)**2, 0.25)
check(math.sqrt(100 - 8), 9.59, abs_tol=0.005)
truth((2 + 3j) * (1 - 2j) == 8 - 1j)
check(abs(3 - 4j), 5)
check(0.5 * 20 * 0.05**2, 0.025)
# 08: modes, energy, reflection and orthogonality.
check(math.sqrt(100 / 0.01), 100)
check(100 / 50, 2)
check(0.005 * 100 * math.pi, 1.57, abs_tol=0.005)
check(100 / (2 * 1), 50)
Z1, Z2 = 1, 3
r, t = (Z1 - Z2) / (Z1 + Z2), 2 * Z1 / (Z1 + Z2)
check(r, -0.5)
check(t, 0.5)
check(r**2 + Z2 / Z1 * t**2, 1)
check(500 * 340 / (340 - 20), 531.25)
check(500 * (340 + 20) / 340, 529.41, abs_tol=0.005)
def simpson(f, lo, hi, n=2000):
    h = (hi - lo) / n
    return h / 3 * (f(lo) + f(hi) + sum((4 if i % 2 else 2) * f(lo + i * h) for i in range(1, n)))
for n, m in [(1, 1), (1, 2), (2, 3), (3, 3)]:
    product = simpson(lambda x: math.sin(n * math.pi * x) * math.sin(m * math.pi * x), 0, 1)
    check(product, 0.5 if n == m else 0, abs_tol=1e-10)
for n in range(1, 7):
    coeff = 2 * simpson(lambda x: (2 * x if x <= 0.5 else 2 * (1 - x)) * math.sin(n * math.pi * x), 0, 1)
    check(coeff, 8 * math.sin(n * math.pi / 2) / (n * math.pi)**2, abs_tol=1e-9)
# 09: rays, wave patterns, polarization and optical paths.
check(math.degrees(math.asin(1 / 3)), 19.47, abs_tol=0.005)
check(1 / (1 / 0.1 - 1 / 0.3), 0.15)
check(1 / (1 / 0.1 - 1 / 0.05), -0.1)
check(580e-9 * 2 / 0.25e-3, 4.64e-3)
check(580e-9 * 2 / 0.05e-3, 23.2e-3)
check(1.22 * 550e-9 / 0.1, 6.71e-6)
check(1.22 * 550e-9 / 0.1 * 206265, 1.38, abs_tol=0.005)
check(100 * 0.5 * math.cos(math.pi / 3)**2, 12.5)
check(((1 - 1.5) / (1 + 1.5))**2, 0.04)
check(1.5 * (2 / 2.5)**2, 0.96)
check(math.degrees(math.asin(1 / 1.5)), 41.81, abs_tol=0.005)
check(100 * 633e-9 / 2, 31.65e-6)
check(0.5 * math.cos(math.pi / 6)**2 * math.cos(math.pi / 3)**2, 3 / 32)
# 10: invariant interval, boosts, energy and momentum.
c = 3e8
beta, gam = 0.6, 1.25
xp = gam * (300 - beta * c * 2e-6)
tp = gam * (2e-6 - beta * 300 / c)
check(xp, -75)
check(tp, 1.75e-6)
check((c * tp)**2 - xp**2, (c * 2e-6)**2 - 300**2)
check(1 / math.sqrt(1 - 0.8**2), 5 / 3)
check((0.8 + 0.7) / (1 + 0.8 * 0.7), 0.9615, abs_tol=0.00005)
check((0.8 - 0.7) / (1 - 0.8 * 0.7), 0.2273, abs_tol=0.00005)
check(math.sqrt((1 - 0.6) / (1 + 0.6)), 0.5)
check(math.sqrt(1 + 0.75**2), 1.25)
check(0.75 / 1.25, 0.6)
check(2 / math.sqrt(1 - 0.8**2), 10 / 3)
for beta in [0, 0.1, 0.6, 0.95]:
    eta = 0.5 * math.log((1 + beta) / (1 - beta))
    check(math.tanh(eta), beta)
# 11: conic energy, period identity and integration-map geometry.
mu, kap, ell, eccentricity = 2, 7, 3, 0.5
p = ell**2 / (mu * kap)
energy = mu * kap**2 * (eccentricity**2 - 1) / (2 * ell**2)
for theta in [0, 0.3, 1, 2, math.pi]:
    u = (1 + eccentricity * math.cos(theta)) / p
    du = -eccentricity * math.sin(theta) / p
    check(ell**2 * (du**2 + u**2) / (2 * mu) - kap * u, energy)
a = p / (1 - eccentricity**2)
check(energy, -kap / (2 * a))
check((1 + eccentricity) / (1 - eccentricity), 3)
for h in [0.01, 0.1, 0.5]:
    m, k = 2, 7
    check((1 - h*h*k/m) - (h/m) * (-h*k), 1)
    truth(1 + h*h*k/m > 1)
check(math.log(1e4) / 0.5, 18.4, abs_tol=0.05)
check(math.log(100) / 0.2, 23.03, abs_tol=0.005)
print(f"Passed {count} selected numerical and invariant checks for Chapters 04–11.")
