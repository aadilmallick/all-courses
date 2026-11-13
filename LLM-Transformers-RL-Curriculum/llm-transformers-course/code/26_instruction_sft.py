import numpy as np
from core import TinyGPT, log_softmax
model = TinyGPT(6, width=8, heads=2, context=4)
inputs = np.array([[0, 1, 2, 3]])
targets = np.array([[1, 2, 3, 4]])
mask = np.array([[0., 0., 1., 1.]])
actual = float(model.loss(inputs, targets, mask).data)
logp = log_softmax(model(inputs).data)
selected = logp[0, np.arange(4), targets[0]]
manual = -np.sum(mask[0]*selected)/mask.sum()
assert np.allclose(actual, manual)
changed = targets.copy()
changed[0, :2] = 5
assert np.allclose(model.loss(inputs, changed, mask).data, actual)
print('response-only loss', actual)
