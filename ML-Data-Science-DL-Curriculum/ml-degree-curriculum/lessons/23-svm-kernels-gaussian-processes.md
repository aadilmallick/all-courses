# 23. Margins, support vector machines, kernels, and Gaussian processes

[Previous](22-generative-classifiers.md) · [Course index](../README.md) · [Next](24-decision-trees.md)

## Margin is distance with a normalization

For labels $y_i\in\{-1,+1\}$ and score $w^\top x+b$, the signed functional margin is $y_i(w^\top x_i+b)$. Scaling $w,b$ changes it without changing the decision boundary. Geometric distance divides by $\|w\|$. Fixing the minimum functional margin to one makes maximizing geometric margin equivalent to minimizing $\|w\|^2/2$ subject to $y_i(w^\top x_i+b)\ge1$.

For overlapping data, introduce slacks $\xi_i\ge0$ and penalize them: minimize $\|w\|^2/2+C\sum_i\xi_i$ subject to margin at least $1-\xi_i$. For fixed $w,b$, the smallest feasible slack is $\max(0,1-y_if_i)$. Substitution produces hinge loss. Some formulations use an average loss and a coefficient $\lambda$; convert scales before comparing their parameters with $C$.

## The dual exposes kernels

Attach nonnegative Lagrange multipliers $\alpha_i$ to margin constraints. Stationarity with respect to $w$ gives $w=\sum_i\alpha_i y_i x_i$; with respect to $b$, $\sum_i\alpha_i y_i=0$. Eliminating primal variables yields the soft-margin dual

$$\max_\alpha\sum_i\alpha_i-\frac12\sum_{ij}\alpha_i\alpha_jy_iy_jx_i^\top x_j,$$

with $0\le\alpha_i\le C$ and the bias constraint above. Complementary slackness explains support vectors: only selected observations need nonzero multipliers. A full derivation also eliminates slack multipliers to produce the upper bound $C$; it is not an arbitrary clipping heuristic.

Replace inner products by a valid positive semidefinite kernel $k(x,z)=\phi(x)^\top\phi(z)$. The polynomial kernel represents products of coordinates; the RBF kernel $\exp(-\|x-z\|^2/(2\ell^2))$ corresponds to a richer feature space. An arbitrary similarity function need not be a valid kernel. A sigmoid expression is not positive semidefinite for every parameter setting.

## Subgradients and practical fitting

Away from margin exactly one, hinge derivative with respect to $w$ is $-y_ix_i$ for violating observations and zero otherwise. Add $\lambda w$ for the L2 term. At the kink, a valid subgradient can be selected. The teaching code uses zero for the loss contribution at equality, which is one valid convention. Its bias is an explicitly supplied feature and is penalized if present; this differs from the usual unpenalized-bias formulation.

Kernel SVM predictions are not posterior probabilities. Probability estimates require an additional calibration procedure. RBF length scale, regularization, and feature scaling interact; tune them together inside an appropriate validation scheme.

## A probabilistic kernel model: Gaussian processes

A Gaussian process prior places jointly Gaussian distributions on function values with mean function and kernel covariance. For zero prior mean, training covariance $K+\sigma_n^2I$, cross covariance $K_*$ and query covariance $K_{**}$, Gaussian conditioning gives

$$m_*=K_*^\top(K+\sigma_n^2I)^{-1}y,$$
$$\Sigma_*=K_{**}-K_*^\top(K+\sigma_n^2I)^{-1}K_*.$$

Use Cholesky solves, not explicit inversion. Add observation-noise variance to the diagonal only when predicting noisy outcomes rather than latent function values. Standard exact fitting costs cubic time and quadratic storage in training size. Kernel and noise assumptions determine the uncertainty; a narrow posterior interval is not a guarantee under misspecification.


## Write one explicit feature map before using a kernel

For two-dimensional $x,z$, $(x^\top z)^2=(x_1z_1+x_2z_2)^2=x_1^2z_1^2+2x_1x_2z_1z_2+x_2^2z_2^2$. Define $\phi(x)=(x_1^2,\sqrt2x_1x_2,x_2^2)$. Its dot product with $\phi(z)$ equals the polynomial kernel exactly. The square-root factor is essential; omitting it changes the cross term.

For any finite coefficient vector $a$ and Gram matrix $K_{ij}=\phi(x_i)^\top\phi(x_j)$, $a^\top Ka=\|\sum_i a_i\phi(x_i)\|^2\ge0$. This proves positive semidefiniteness for an inner-product kernel. It explains why a visually plausible similarity function is not sufficient: the Gram matrices must satisfy this property.

In the GP example, the same kernel has a probabilistic covariance interpretation. In the SVM, it defines a feature-space margin. Sharing a kernel does not make the objectives or uncertainty outputs identical. A kernel method is a family of computational constructions, not one single learning algorithm.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_23.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_23.py`.

```python
import numpy as np

def _supervised(X, y):
    """Preserve the row-batch contract; never broadcast targets implicitly."""
    X, y = np.asarray(X, dtype=float), np.asarray(y, dtype=float)
    if X.ndim != 2 or y.ndim != 1 or len(X) == 0 or X.shape[1] == 0 or len(y) != len(X):
        raise ValueError('X must be nonempty (n,d) and y must have shape (n,)')
    if not np.isfinite(X).all() or not np.isfinite(y).all():
        raise ValueError('training values must be finite')
    return X, y

def hinge_objective(w,X,y,penalty=0.1):
    X,y=_supervised(X,y)
    w=np.asarray(w,float)
    if w.shape != (X.shape[1],) or not np.isfinite(w).all() or not np.isin(y,[-1.,1.]).all():
        raise ValueError('hinge loss needs finite feature weights and labels -1 or +1')
    if not np.isfinite(penalty) or penalty<0:
        raise ValueError('penalty must be finite and nonnegative')
    margin=y*(X@w)
    active=margin<1
    loss=np.maximum(0,1-margin).mean()+penalty*(w@w)/2
    gradient=penalty*w-X[active].T@y[active]/len(y)
    return loss,gradient

def fit_linear_svm(X,y,penalty=0.1,rate=.05,steps=2000):
    w=np.zeros(X.shape[1])
    for _ in range(steps):
        _,g=hinge_objective(w,X,y,penalty)
        w-=rate*g
    return w

def rbf(X,Z,length=1.):
    X=np.asarray(X,float);Z=np.asarray(Z,float)
    if X.ndim != 2 or Z.ndim != 2 or X.shape[1] != Z.shape[1] or not np.isfinite(X).all() or not np.isfinite(Z).all():
        raise ValueError('RBF inputs must be finite feature matrices with matching widths')
    if not np.isfinite(length) or length <= 0:
        raise ValueError('length must be positive')
    return np.exp(-((X[:,None,:]-Z[None,:,:])**2).sum(axis=-1)/(2*length**2))

def gaussian_process(X,y,query,noise=.1,length=1.):
    """Zero-mean GP; noise is observation standard deviation.

    Returns posterior mean and LATENT marginal variance, not noisy variance.
    """
    X,y=_supervised(X,y)
    if not np.isfinite(noise) or noise < 0:
        raise ValueError('noise standard deviation must be finite and nonnegative')
    K=rbf(X,X,length)+(noise**2+1e-10)*np.eye(len(X))
    L=np.linalg.cholesky(K)
    cross=rbf(X,query,length)
    alpha=np.linalg.solve(L.T,np.linalg.solve(L,y))
    mean=cross.T@alpha
    projected=np.linalg.solve(L,cross)
    variance=1.-(projected**2).sum(axis=0)
    return mean,np.maximum(variance,0.)

if __name__ == "__main__":
    X=np.array([[-2.],[-1.],[1.],[2.]])
    y=np.array([-1.,-1.,1.,1.])
    w=fit_linear_svm(X,y)
    print('SVM weight',w)
    print('GP',gaussian_process(X,y,np.array([[0.],[1.5]])))
```

The recorded output in the supplied CPU environment was:

```text
SVM weight [1.00949934]
GP (array([0.        , 1.12220562]), array([0.24903054, 0.03462644]))
```


## Verification note

The kernel helper rejects mismatched feature widths, and the GP helper treats noise as a nonnegative standard deviation. The hinge-loss helper expects labels -1 and +1; binary logistic loss instead uses targets in [0,1]. Convert the label encoding explicitly when changing objectives.
