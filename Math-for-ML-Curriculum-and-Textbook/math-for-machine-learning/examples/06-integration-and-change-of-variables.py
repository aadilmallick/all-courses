# Source: chapters/06-integration-and-change-of-variables.md
from math import exp

n = 1000
step = 1.0 / n
total = 0.5 * (exp(0.0) + exp(1.0))
for i in range(1, n):
    total += exp(i * step)
approximation = step * total
exact = exp(1.0) - 1.0
print(approximation)
print(abs(approximation - exact))
