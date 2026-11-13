# Source: chapters/04-matrix-structure-and-pca.md
import numpy as np

X = np.array([[2., 0.], [0., 1.], [-2., 0.], [0., -1.]])
center = X.mean(axis=0)
Xc = X - center
U, singular, Vt = np.linalg.svd(Xc, full_matrices=False)
leading = Vt[0]
scores = Xc @ leading
reconstruction = np.outer(scores, leading) + center
fraction = singular[0] ** 2 / np.sum(singular ** 2)
print(fraction)
print(np.sum((X - reconstruction) ** 2))
