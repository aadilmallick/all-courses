import numpy as np
inputs = np.array([1., 2., 3., 4., 5.])
targets = np.array([0., 1., 1., 2., 3.])
weight = 0.2
def gradient(x, y):
    return np.mean((weight*x-y)*x)
full = gradient(inputs, targets)
first, second = gradient(inputs[:2], targets[:2]), gradient(inputs[2:], targets[2:])
weighted = (2*first + 3*second)/5
unweighted = (first+second)/2
assert np.allclose(full, weighted)
assert not np.allclose(full, unweighted)
parameters = 1_000_000
print('full gradient', full, 'incorrect mean', unweighted)
print('simple float32 Adam states, MB', 16*parameters/1e6)
