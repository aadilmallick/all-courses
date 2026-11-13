import numpy as np
transition = np.array([[0.7, 0.3], [0.2, 0.8]])
reward = np.array([1., 0.])
discount = 0.9
exact = np.linalg.solve(np.eye(2)-discount*transition, reward)
value = np.zeros(2)
for _ in range(250):
    value = reward+discount*transition @ value
residual = np.max(np.abs(value-(reward+discount*transition @ value)))
assert np.allclose(value, exact, atol=1e-9)
print('value', value, 'Bellman residual', residual)
