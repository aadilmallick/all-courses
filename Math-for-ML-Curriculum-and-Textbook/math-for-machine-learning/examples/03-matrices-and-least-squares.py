# Source: chapters/03-matrices-and-least-squares.md
import numpy as np

X = np.array([[1.0, 1.0], [1.0, 2.0], [1.0, 4.0]])
y = np.array([8.0, 11.0, 18.0])
beta, _, rank, singular_values = np.linalg.lstsq(X, y, rcond=None)
prediction = X @ beta
residual = y - prediction
print(beta)
print(np.mean(residual ** 2))
print(X.T @ residual)
