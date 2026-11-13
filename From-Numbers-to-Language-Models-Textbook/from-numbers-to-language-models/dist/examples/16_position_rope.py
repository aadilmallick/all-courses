import numpy as np
def rotation(angle):
    c, s = np.cos(angle), np.sin(angle)
    return np.array([[c, -s], [s, c]])
q, k = np.array([1., 2.]), np.array([-0.5, 0.7])
m, n, frequency = 3, 8, 0.2
rotated_q, rotated_k = rotation(m * frequency) @ q, rotation(n * frequency) @ k
left = rotated_q @ rotated_k
right = q @ rotation((n-m) * frequency) @ k
assert np.allclose(left, right)
assert np.allclose(np.linalg.norm(q), np.linalg.norm(rotated_q))
print('absolute rotation score', left, 'relative rotation score', right)
