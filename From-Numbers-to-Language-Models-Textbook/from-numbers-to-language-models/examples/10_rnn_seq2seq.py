import numpy as np
from core import softmax
observations = np.array([[1.0], [0.0], [-1.0]])
state = np.zeros(2)
states = []
wx = np.array([[0.6, -0.2]])
wh = np.array([[0.5, 0.1], [-0.2, 0.4]])
for observation in observations:
    state = np.tanh(observation @ wx + state @ wh)
    states.append(state.copy())
states = np.array(states)
query = np.array([0.3, -0.1])
energies = np.tanh(states + query) @ np.array([0.7, -0.4])
weights = softmax(energies)
context = weights @ states
assert np.allclose(weights.sum(), 1)
print('states', states, 'weights', weights, 'context', context)
