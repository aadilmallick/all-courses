import numpy as np
from core import finite_difference
rng = np.random.default_rng(27)
x, base = rng.normal(size=(3, 4)), rng.normal(size=(4, 5))
a, b = rng.normal(size=(4, 2)), np.zeros((2, 5))
g, scale = rng.normal(size=(3, 5)), 0.5
ga = scale*x.T @ g @ b.T
gb = scale*(x @ a).T @ g
assert np.allclose(ga, 0)
assert np.linalg.norm(gb) > 0
b += 0.02*gb
ga = scale*x.T @ g @ b.T
numeric = finite_difference(lambda z: np.sum((x @ base+scale*(x @ z) @ b)*g), a)
assert np.allclose(ga, numeric, atol=1e-7)
assert np.allclose(x @ base+scale*(x @ a) @ b, x @ (base+scale*a @ b))
print('trainable parameters', a.size+b.size, 'base parameters', base.size)
