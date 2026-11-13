import numpy as np
rng = np.random.default_rng(28)
weight = rng.normal(size=(4, 5))
limit = 7
scale = max(float(np.max(np.abs(weight)))/limit, 1e-12)
integer = np.clip(np.round(weight/scale), -limit, limit).astype(np.int8)
reconstructed = integer.astype(float)*scale
error = reconstructed-weight
assert np.max(np.abs(error)) <= scale/2+1e-12
x = rng.normal(size=(2, 4))
actual = np.linalg.norm(x @ error)
bound = np.linalg.norm(x)*np.linalg.norm(error)
assert actual <= bound+1e-12
print('scale', scale, 'output error', actual, 'bound', bound)
