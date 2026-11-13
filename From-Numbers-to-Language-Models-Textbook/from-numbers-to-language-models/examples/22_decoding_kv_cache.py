import numpy as np
from core import attention, softmax
rng = np.random.default_rng(22)
q, k, v = [rng.normal(size=(5, 4)) for _ in range(3)]
full, _ = attention(q, k, v, np.tril(np.ones((5, 5), dtype=bool)))
last, _ = attention(q[-1:], k, v)
assert np.allclose(full[-1], last[0])
logits = np.array([1., 0.2, -0.7, 0.5])
keep = np.argsort(logits)[-2:]
filtered = np.full_like(logits, -np.inf)
filtered[keep] = logits[keep]
probability = softmax(filtered / 0.7)
assert np.count_nonzero(probability) == 2
print('cached last row', last, 'top-k probability', probability)
