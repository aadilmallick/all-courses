import numpy as np
from core import attention
rng = np.random.default_rng(14)
q, k, v = [rng.normal(size=(4, 3)) for _ in range(3)]
causal = np.tril(np.ones((4, 4), dtype=bool))
base, weights = attention(q, k, v, causal)
changed = v.copy()
changed[-1] += 100
modified, _ = attention(q, k, changed, causal)
assert np.allclose(base[:-1], modified[:-1])
assert np.allclose(weights[~causal], 0)
document = np.array([0, 0, 1, 1])
packed = causal & (document[:, None] == document[None, :])
_, packed_weights = attention(q, k, v, packed)
assert np.allclose(packed_weights[2:, :2], 0)
print('causal weights', weights, 'packed weights', packed_weights)
