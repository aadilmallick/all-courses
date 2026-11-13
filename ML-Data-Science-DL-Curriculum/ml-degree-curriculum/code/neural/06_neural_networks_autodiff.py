import numpy as np
from core import Tensor
inputs = Tensor(np.array([[-1.0], [0.0], [1.0], [2.0]]))
target = Tensor(2 * inputs.data + 0.5)
weight, bias = Tensor([[0.0]]), Tensor([0.0])
initial = None
for step in range(100):
    prediction = inputs @ weight + bias
    loss = ((prediction - target) ** 2).mean()
    if initial is None:
        initial = float(loss.data)
    loss.backward()
    for parameter in (weight, bias):
        parameter.data -= 0.1 * parameter.grad
        parameter.grad.fill(0)
    inputs.grad.fill(0)
    target.grad.fill(0)
assert float(loss.data) < initial / 1000
print('initial', initial, 'final', float(loss.data), 'weight', weight.data)
