import numpy as np
from core import Tensor, layer_norm
values = np.array([[1., 2., 4.], [-2., 0., 1.]])
epsilon = 1e-5
centered = values - values.mean(axis=-1, keepdims=True)
manual = centered / np.sqrt((centered ** 2).mean(axis=-1, keepdims=True) + epsilon)
actual = layer_norm(Tensor(values)).data
assert np.allclose(actual, manual)
assert np.allclose(layer_norm(Tensor(values + 8)).data, actual)
changed = values.copy()
changed[1] += np.array([10., -5., 2.])
assert np.allclose(layer_norm(Tensor(changed)).data[0], actual[0])
print('normalized', actual)
