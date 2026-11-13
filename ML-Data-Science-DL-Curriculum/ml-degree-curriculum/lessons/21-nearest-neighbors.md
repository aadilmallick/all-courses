# 21. Nearest neighbors, distances, and high dimensional geometry

[Previous](20-metrics-calibration.md) · [Course index](../README.md) · [Next](22-generative-classifiers.md)

## Learn by keeping examples

Nearest neighbors stores training observations and predicts using nearby ones. For query $q$, Euclidean squared distance to $x_i$ is $d_i^2=\sum_j(q_j-x_{ij})^2$. Because square root is increasing, sorting squared distances gives the same ordering as sorting distances. Classification takes a majority vote; regression averages neighboring targets.

Consider training values $x=(0,2,3,7)$ with labels $(0,0,1,1)$ and query 2.4. Distances are $(2.4,0.4,0.6,4.6)$. With $k=1$, the prediction is 0. With $k=3$, neighbors at 2, 3, and 0 vote $(0,1,0)$, still 0. At query 4.5, the three nearest examples at 3, 7, and 2 vote $(1,1,0)$, so the prediction is 1. The selected neighborhood is part of the model's inductive bias.

## Define distance deliberately

Manhattan distance sums absolute coordinate differences. Euclidean distance sums squared differences before a square root. Cosine distance compares orientation after accounting for norms. Mahalanobis squared distance $(x-z)^\top M(x-z)$ uses a positive semidefinite matrix $M$ to change geometry. An arbitrary similarity score need not satisfy metric axioms.

Scaling changes nearest neighbors. Two observations a year apart but ten dollars apart may look close or far depending on units. Standardize training features when appropriate and apply the same transformation to queries. Categorical IDs should not acquire an artificial order merely because they are integers.

## Bias, variance, and computational cost

A small neighborhood can follow local detail and noise; a larger one smooths more aggressively. The ideal value depends on sample size, intrinsic structure, noise, and feature quality. Under appropriate regularity conditions, consistency results use $k\to\infty$ while $k/n\to0$; this is an asymptotic statement, not a formula selecting $k$ for a finite dataset.

Brute-force querying costs roughly $O(nd)$ distance work per query and stores $O(nd)$ values. Trees can accelerate some low-dimensional queries, but high dimension can erode pruning effectiveness. Approximate indexes trade exact retrieval for latency or memory. Their speed and recall need measurement on the actual vectors and hardware.

In high dimensions, much volume can lie far from any fixed point and distances may concentrate under certain distributions. This does not mean every high-dimensional dataset is impossible: low intrinsic dimension, a learned metric, or informative sparse structure can help. Avoid a blanket conclusion based solely on the number of columns.

## Ties, duplicates, and weighted voting

Specify what happens at equal distances and equal class votes. The supplied code uses stable sorting, so training order breaks a distance tie; sorted class order breaks a vote tie through argmax. These are implementation conventions, not mathematical necessities. For inverse-distance weighting, exact duplicate queries need an explicit zero-distance rule rather than divide by zero.

Optional application: add one irrelevant feature with much larger scale and inspect how neighbors change. Then compare an appropriately fitted scaler and a feature selection procedure inside cross validation. This distinguishes the role of geometry from the voting rule.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_21.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_21.py`.

```python
import numpy as np

def knn_predict(X,y,query,k=3):
    if not 1 <= k <= len(X):
        raise ValueError('k must be between one and training sample size')
    classes=np.unique(y)
    distances=((query[:,None,:]-X[None,:,:])**2).sum(axis=-1)
    # Stable sort means training order resolves equal-distance boundaries.
    neighbors=np.argsort(distances,axis=1,kind='stable')[:,:k]
    votes=np.stack([(y[neighbors]==label).sum(axis=1) for label in classes],axis=1)
    return classes[votes.argmax(axis=1)]

if __name__ == "__main__":
    X=np.array([[0.],[2.],[3.],[7.]])
    y=np.array([0,0,1,1])
    print(knn_predict(X,y,np.array([[2.4],[4.5]]),k=3))
```

The recorded output in the supplied CPU environment was:

```text
[0 1]
```
