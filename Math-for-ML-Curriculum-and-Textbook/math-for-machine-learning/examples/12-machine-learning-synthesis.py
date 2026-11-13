# Source: chapters/12-machine-learning-synthesis.md
import numpy as np

X = np.array([[1., -1.], [1., 0.], [1., 1.], [1., 2.]])
y = np.array([0., 0., 1., 1.])
beta = np.zeros(2)
step = 0.1

def objective(parameters):
    score = X @ parameters
    return np.mean(np.logaddexp(0.0, score) - y * score)

before = objective(beta)
score = X @ beta
probability = np.exp(-np.logaddexp(0.0, -score))
gradient = X.T @ (probability - y) / len(y)
beta = beta - step * gradient
print(before, objective(beta))
print(beta)
