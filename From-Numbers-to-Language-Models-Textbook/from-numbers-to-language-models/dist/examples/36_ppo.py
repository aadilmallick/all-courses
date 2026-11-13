import numpy as np
def surrogate(ratio, advantage, epsilon=.2):
    return np.minimum(ratio*advantage, np.clip(ratio, 1-epsilon, 1+epsilon)*advantage)
ratios = np.array([.7, .9, 1., 1.1, 1.3])
print('positive', surrogate(ratios, 2.))
print('negative', surrogate(ratios, -2.))
def derivative(ratio, advantage):
    h = 1e-5
    return (surrogate(ratio+h, advantage)-surrogate(ratio-h, advantage))/(2*h)
assert np.allclose(derivative(1.3, 2.), 0)
assert np.allclose(derivative(.7, -2.), 0)
assert np.allclose(derivative(.9, 2.), 2)
print('active positive slope', derivative(.9, 2.))
