import numpy as np
q, k = np.array([1., 0.5]), np.array([0.2, 1.])
def score(distance, scale=1.0):
    angle = 0.2 * distance * scale
    c, s = np.cos(angle), np.sin(angle)
    rotation = np.array([[c, -s], [s, c]])
    return q @ rotation @ k
for distance in [1, 5, 20, 80]:
    print('distance', distance, 'original', score(distance), 'interpolated', score(distance, 0.25))
old, new = 1024, 4096
print('dense score ratio', (new/old)**2, 'cache ratio', new/old)
