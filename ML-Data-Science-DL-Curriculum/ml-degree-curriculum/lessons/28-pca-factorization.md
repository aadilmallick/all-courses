# 28. PCA, low rank approximation, and matrix factorization

[Previous](27-classical-ml-project.md) · [Course index](../README.md) · [Next](29-partition-clustering.md)

## Compress directions rather than arbitrary columns

PCA seeks a low-dimensional linear subspace that preserves variation in centered data. Let $X_c=X-\mathbf1\mu^\top$. A unit direction $v$ produces scalar coordinates $X_cv$. Their sample variance is $v^\top X_c^\top X_cv/(n-1)$. Maximizing it subject to $v^\top v=1$ gives a leading eigenvector of the covariance matrix.

A Lagrange multiplier makes the condition explicit. Set $\mathcal L(v,\lambda)=v^\top Cv-\lambda(v^\top v-1)$. Differentiating gives $2Cv-2\lambda v=0$, so $Cv=\lambda v$. Expanding $v$ in an orthonormal eigenbasis shows that its variance is a weighted average of eigenvalues. The maximum is the largest eigenvalue, achieved in its eigenspace.

## Reconstruction and SVD

For orthonormal columns $V_r$, coordinates are $Z=X_cV_r$ and reconstruction is $\widehat X=ZV_r^\top+\mu$. Truncated SVD gives the subspace minimizing squared reconstruction error. If $X_c=U\Sigma V^\top$, then $Z=U_r\Sigma_r$ and discarded squared singular values sum to the reconstruction error.

For points $(-2,-2),(0,0),(2,2)$, the mean is zero and all variation lies on direction $(1,1)/\sqrt2$. One component reconstructs every point exactly. The orthogonal direction $(1,-1)/\sqrt2$ has zero variance. Changing a sign of an eigenvector changes the sign of coordinates but leaves reconstruction unchanged.

## Scaling and interpretation

PCA on a covariance matrix emphasizes variables with larger numerical variance. Standardizing first instead yields correlation-based PCA. These answer different questions. A high-variance feature may reflect meaningful scale or unwanted measurement units. State the choice. Fit means, scales, and PCA directions on training data only.

Explained variance is not supervised usefulness. A tiny-variance direction can contain nearly all label information. Inspect downstream validation if using PCA before prediction. A two-dimensional visualization can hide meaningful distances or create apparent clusters; visualization is exploratory evidence, not a proof of latent categories.

## Matrix factorization for recommendation

For observed user-item ratings $r_{ui}$, approximate them by $p_u^\top q_i$ plus optional biases. Minimize squared error only over observed pairs, with regularization on user and item vectors. Missing entries are not automatically zeros. A gradient for one residual $e=p_u^\top q_i-r_{ui}$ is $e q_i+\lambda p_u$ for $p_u$ and $e p_u+\lambda q_i$ for $q_i$, under the corresponding half-squared-loss convention.

The factorization is not unique: an invertible change of coordinates in one factor can be canceled in the other. Predictions may be identifiable while individual coordinates are not. Regularization and constraints choose a preferred representation, not a uniquely true semantic meaning for every dimension.

## Beyond PCA

Nonnegative matrix factorization restricts factors to nonnegative values and can support additive interpretations. Random projections approximately preserve distances under specified dimension and probability conditions. t-SNE and UMAP are visualization methods whose neighborhoods and distances need careful interpretation. They are not interchangeable with PCA reconstruction objectives.

Optional application: recover data from projected coordinates and verify that reconstruction error matches discarded singular-value energy. Then compare that error with classification accuracy. The best compression under squared reconstruction need not be the best representation for a target label.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_28.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_28.py`.

```python
import numpy as np

def pca(X,components=2):
    X=np.asarray(X,float)
    if X.ndim != 2 or 0 in X.shape or not np.isfinite(X).all():
        raise ValueError('PCA requires a nonempty finite matrix')
    if not isinstance(components,(int,np.integer)) or isinstance(components,(bool,np.bool_)) or not 1 <= components <= min(X.shape):
        raise ValueError('components must be an integer between 1 and min(n,d)')
    mean=X.mean(axis=0)
    _,singular,vt=np.linalg.svd(X-mean,full_matrices=False)
    directions=vt[:components]
    return (X-mean)@directions.T,directions,mean,singular

if __name__ == "__main__":
    X=np.array([[-2.,-2.],[0.,0.],[2.,2.]])
    Z,V,mean,singular=pca(X,1)
    print(Z)
    assert np.allclose(Z@V+mean,X)
```

The recorded output in the supplied CPU environment was:

```text
[[-2.82842712]
 [ 0.        ]
 [ 2.82842712]]
```
