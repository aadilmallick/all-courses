# Source: chapters/07-multivariable-calculus-and-backpropagation.md
import numpy as np

X = np.array([[1., 1.], [1., 2.], [1., 4.]])
y = np.array([8., 11., 18.])
beta = np.array([5., 3.])

def loss(parameters):
    residual = X @ parameters - y
    return 0.5 * (residual @ residual)

analytic = X.T @ (X @ beta - y)
step = 1e-5
numerical = np.zeros_like(beta)
for j in range(beta.size):
    offset = np.zeros_like(beta)
    offset[j] = step
    numerical[j] = (loss(beta + offset) - loss(beta - offset)) / (2 * step)
print(analytic)
print(numerical)
