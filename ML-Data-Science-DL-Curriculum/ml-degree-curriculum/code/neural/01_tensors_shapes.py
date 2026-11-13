import numpy as np
rng = np.random.default_rng(0)
inputs = rng.normal(size=(2, 3, 4))
weight = rng.normal(size=(4, 6))
output = inputs @ weight
manual = np.zeros((2, 3, 6))
for batch in range(2):
    for token in range(3):
        for feature in range(6):
            for channel in range(4):
                manual[batch, token, feature] += inputs[batch, token, channel] * weight[channel, feature]
assert np.allclose(output, manual)
heads = output.reshape(2, 3, 2, 3).transpose(0, 2, 1, 3)
restored = heads.transpose(0, 2, 1, 3).reshape(2, 3, 6)
assert np.allclose(restored, output)
print('projected', output.shape, 'heads', heads.shape)
