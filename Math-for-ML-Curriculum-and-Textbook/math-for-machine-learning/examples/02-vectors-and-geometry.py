# Source: chapters/02-vectors-and-geometry.md
from math import sqrt

u = [3.0, 1.0]
v = [1.0, 1.0]

def dot(a, b):
    if len(a) != len(b):
        raise ValueError("Vectors must have the same dimension")
    return sum(a_j * b_j for a_j, b_j in zip(a, b))

coefficient = dot(u, v) / dot(v, v)
projection = [coefficient * value for value in v]
residual = [a - b for a, b in zip(u, projection)]
print(coefficient, projection, residual)
print(dot(residual, v), sqrt(dot(residual, residual)))
