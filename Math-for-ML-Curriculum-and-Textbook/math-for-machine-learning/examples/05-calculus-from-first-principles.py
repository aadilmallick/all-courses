# Source: chapters/05-calculus-from-first-principles.md
from math import sin, cos

x = 1.0
for h in [1e-1, 1e-3, 1e-5, 1e-7, 1e-9]:
    estimate = (sin(x + h) - sin(x - h)) / (2 * h)
    print(h, estimate, abs(estimate - cos(x)))
