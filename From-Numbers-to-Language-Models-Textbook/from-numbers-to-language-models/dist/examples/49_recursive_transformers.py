import numpy as np
from core import Tensor, finite_difference
weight = Tensor([[.6]])
hidden = Tensor([[.2]])
for _ in range(4):
    hidden = (hidden @ weight+.1).tanh()
loss = (hidden ** 2).mean()
loss.backward()
def objective(values):
    state = .2
    for _ in range(4):
        state = np.tanh(state*values[0]+.1)
    return state**2
numeric = finite_difference(objective, np.array([.6]))[0]
assert np.allclose(weight.grad[0, 0], numeric, atol=1e-7)
print('shared gradient', weight.grad[0, 0], 'numerical', numeric)
