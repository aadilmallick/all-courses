# Source: chapters/08-optimization.md
import numpy as np

H = np.diag([1.0, 20.0])
x = np.array([4.0, 4.0])
step = 0.05
for iteration in range(6):
    value = 0.5 * x @ H @ x
    print(iteration, value, x)
    x = x - step * (H @ x)
