import numpy as np
rng = np.random.default_rng(1)
a = rng.normal(size=(5, 2))
b = rng.normal(size=(2, 4))
update = a @ b
assert np.linalg.matrix_rank(update) <= 2
weight = rng.normal(size=(5, 4))
u, singular, vt = np.linalg.svd(weight, full_matrices=False)
approximation = (u[:, :2] * singular[:2]) @ vt[:2]
error = np.linalg.norm(weight - approximation)
assert np.allclose(error ** 2, np.sum(singular[2:] ** 2))
print('rank', np.linalg.matrix_rank(update), 'error', round(error, 6))
