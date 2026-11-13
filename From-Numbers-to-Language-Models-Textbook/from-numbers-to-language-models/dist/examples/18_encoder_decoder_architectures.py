import numpy as np
from core import attention
rng = np.random.default_rng(18)
query = rng.normal(size=(2, 4))
source_key = rng.normal(size=(5, 4))
source_value = rng.normal(size=(5, 3))
allowed = np.array([[True, True, True, True, False]])
output, weights = attention(query, source_key, source_value, allowed)
changed = source_value.copy()
changed[-1] += 1000
modified, _ = attention(query, source_key, changed, allowed)
assert output.shape == (2, 3)
assert np.allclose(output, modified)
print('cross-attention weights', weights, 'output shape', output.shape)
