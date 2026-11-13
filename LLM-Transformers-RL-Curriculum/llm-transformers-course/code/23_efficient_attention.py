import numpy as np
from core import softmax
scores = np.array([1000., 999., 1002., 998., 1001.])
values = np.arange(15, dtype=float).reshape(5, 3)
maximum, normalizer, accumulator = -np.inf, 0.0, np.zeros(3)
for start in range(0, len(scores), 2):
    block = scores[start:start+2]
    next_max = max(maximum, block.max())
    rescale = np.exp(maximum-next_max)
    weights = np.exp(block-next_max)
    accumulator = rescale*accumulator + weights @ values[start:start+2]
    normalizer = rescale*normalizer + weights.sum()
    maximum = next_max
online = accumulator / normalizer
direct = softmax(scores) @ values
assert np.allclose(online, direct)
print('online', online, 'direct', direct)
