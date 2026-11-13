import numpy as np
from core import attention
rng = np.random.default_rng(15)
batch, heads, groups, tokens, width = 1, 4, 2, 3, 2
q = rng.normal(size=(batch, heads, tokens, width))
k = rng.normal(size=(batch, groups, tokens, width))
v = rng.normal(size=(batch, groups, tokens, width))
expanded_k = np.repeat(k, heads // groups, axis=1)
expanded_v = np.repeat(v, heads // groups, axis=1)
output, _ = attention(q, expanded_k, expanded_v)
individual, _ = attention(q[:, 2], k[:, 1], v[:, 1])
assert np.allclose(output[:, 2], individual)
print('output shape', output.shape, 'cache head ratio', heads / groups)
