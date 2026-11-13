import numpy as np
from core import softmax
reference = np.array([.6, .4])
reward = np.array([0., 1.])
beta = .7
closed = softmax(np.log(reference)+reward/beta)
grid = np.linspace(.0001, .9999, 10001)
policy = np.stack([1-grid, grid], axis=1)
objective = policy @ reward-beta*np.sum(policy*np.log(policy/reference), axis=1)
best = policy[objective.argmax()]
assert np.max(np.abs(best-closed)) < .0002
print('closed form', closed, 'grid optimum', best)
