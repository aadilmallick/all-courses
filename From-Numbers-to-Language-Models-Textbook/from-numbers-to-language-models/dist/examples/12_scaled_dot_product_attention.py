import numpy as np
from core import attention, softmax
query = np.array([[1., 0.], [0., 1.]])
key = np.array([[1., 0.], [0., 1.], [1., 1.]])
value = np.array([[2., 0., 1.], [0., 4., -1.], [1., 1., 0.]])
output, weights = attention(query, key, value)
manual = []
for row in query:
    scores = np.array([sum(row[d] * slot[d] for d in range(2)) / np.sqrt(2) for slot in key])
    manual.append(softmax(scores) @ value)
assert np.allclose(output, manual)
assert np.allclose(weights.sum(axis=-1), 1)
print('weights', weights, 'output', output)
