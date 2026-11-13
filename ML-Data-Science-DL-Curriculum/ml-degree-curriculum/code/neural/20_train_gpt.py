import numpy as np
from core import TinyGPT
model = TinyGPT(vocabulary=4, width=12, heads=2, context=6, seed=20)
inputs = np.array([[0, 1, 2, 3, 0, 1], [1, 2, 3, 0, 1, 2]])
targets = (inputs + 1) % 4
initial = float(model.loss(inputs, targets).data)
for step in range(180):
    loss = model.loss(inputs, targets)
    loss.backward()
    norm = model.step(learning_rate=0.15, max_norm=1)
final = float(model.loss(inputs, targets).data)
assert final < initial * 0.5
snapshot = [p.data.copy() for p in model.parameters()]
before = model(inputs).data.copy()
model.embedding.data += 1
for parameter, saved in zip(model.parameters(), snapshot):
    parameter.data[:] = saved
assert np.allclose(model(inputs).data, before)
print('initial', initial, 'final', final, 'sample', model.generate([0], 8, 0.5))
