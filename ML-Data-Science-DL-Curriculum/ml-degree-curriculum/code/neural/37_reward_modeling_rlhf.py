import numpy as np
from core import softmax
reference = np.array([.5, .3, .2])
reward = np.array([0., 1., .4])
beta = .7
optimum = softmax(np.log(reference)+reward/beta)
def objective(policy):
    return policy @ reward-beta*np.sum(policy*np.log(policy/reference))
assert np.allclose(optimum, softmax(np.log(reference)+(reward+5)/beta))
for epsilon in [-.02, .02]:
    nearby = optimum+np.array([epsilon, -epsilon, 0.])
    assert objective(optimum) >= objective(nearby)
print('optimal policy', optimum, 'objective', objective(optimum))
