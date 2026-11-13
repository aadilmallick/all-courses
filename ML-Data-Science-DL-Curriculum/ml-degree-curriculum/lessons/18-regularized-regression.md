# 18. Ridge, lasso, elastic net, and regularization geometry

[Previous](17-linear-regression.md) · [Course index](../README.md) · [Next](19-logistic-softmax.md)

## Why a perfect fit can be unstable

When two columns are nearly redundant, large positive and negative coefficients can cancel. A small target perturbation may require a large coefficient change. Regularization restricts which solution is preferred. It trades training fit against a declared structural preference and can improve generalization without guaranteeing improvement on every dataset.

For ridge, use the objective

$$J(w)=\frac1{2n}\|Xw-y\|^2+\frac\lambda2\|w\|_2^2.$$

Its gradient is $X^\top(Xw-y)/n+\lambda w$. Setting it to zero gives $(X^\top X+n\lambda I)w=X^\top y$. If a source instead uses a sum loss, the matching ridge parameter is $n\lambda$. Numerical comparisons need this conversion.

## Spectral shrinkage explains ridge

With $X=U\Sigma V^\top$, the unregularized coefficient along singular direction $j$ is $(u_j^\top y)/\sigma_j$. Ridge changes it to $\sigma_j(u_j^\top y)/(\sigma_j^2+n\lambda)$. Relative to least squares the factor is $\sigma_j^2/(\sigma_j^2+n\lambda)$. Small singular directions are shrunk more strongly. L2 regularization therefore does not shrink every coefficient by one identical multiplicative factor in the original coordinate system.

In an orthogonal one-feature example with $X^\top X=n$ and $X^\top y=2n$, least squares gives 2 and ridge gives $2/(1+\lambda)$. At $\lambda=1$ the answer is 1. The limit $\lambda\to0$ returns least squares; the limit $\lambda\to\infty$ pushes the penalized coefficient to zero.

## Lasso and the kink at zero

Lasso replaces the L2 term by $\lambda\sum_j|w_j|$. At a nonzero coordinate the derivative of absolute value is its sign. At zero, its subgradient is the interval $[-1,1]$. This interval allows a zero coefficient to satisfy the optimality condition across a range of residual correlations.

For one coordinate with others fixed, let $r^{(-j)}=y-\sum_{k\ne j}X_kw_k$, $a=X_j^\top X_j/n$, and $c=X_j^\top r^{(-j)}/n$. Ignoring a constant, the objective is $aw_j^2/2-cw_j+\lambda|w_j|$. For a positive solution, differentiation gives $(c-\lambda)/a$; for a negative solution it gives $(c+\lambda)/a$. The subgradient condition at zero holds when $|c|\le\lambda$. Together these are

$$w_j=\frac{\operatorname{sign}(c)\max(|c|-\lambda,0)}{a}.$$

If $a=1$, $c=0.7$, and $\lambda=0.3$, the update is 0.4. If $c=0.2$, it is exactly zero. This soft-threshold operation is the mechanism of sparsity, not a postprocessing rule that discards small values.

## Elastic net and the intercept

Elastic net combines L1 and L2 penalties. The coordinate update keeps the soft-threshold numerator and adds the L2 coefficient to the denominator. Correlated predictors can share weight more stably than in pure lasso, although feature selection still depends on scaling and tuning.

Usually center $X,y$ and fit an intercept separately without penalizing it. Otherwise the model is encouraged to predict near zero even if the target's natural baseline is not zero. Standardizing features changes the penalty's units and therefore its meaning. Store the fitted transformation with the model.

## Bayesian connection and validation

A zero-mean Gaussian prior yields a quadratic negative log prior. A Laplace prior yields an absolute-value term. MAP connects those priors to ridge and lasso objectives, with variance-dependent scaling. It does not turn a point estimate into posterior uncertainty or prove that the selected prior describes the data-generating mechanism.

Choose penalty strengths inside cross validation. Inspect validation error, coefficient stability, and residual diagnostics. A sparse result can be convenient, but correlated alternatives mean that one chosen feature need not be the unique scientific cause of the outcome.


## Check the lasso optimality conditions directly

Let residual $r=y-Xw$. For coordinate $j$, stationarity requires $X_j^\top r/n=\lambda\operatorname{sign}(w_j)$ when $w_j\ne0$, and $|X_j^\top r/n|\le\lambda$ when $w_j=0$. These conditions are meaningful tests for a converged coordinate-descent fit. A tiny parameter change alone can be misleading if the update was implemented with the wrong normalization.

A proximal-gradient alternative first takes a squared-loss gradient step $u=w-\eta X^\top(Xw-y)/n$, then applies soft threshold with threshold $\eta\lambda$. The proximal operation exactly solves a local quadratic-plus-L1 subproblem. The learning rate must respect the smooth part's curvature for standard convergence guarantees.

For elastic net with L1 coefficient $\lambda_1$ and L2 coefficient $\lambda_2/2$, coordinate descent uses $S(c,\lambda_1)/(a+\lambda_2)$. This explicit convention avoids ambiguity in packages that use one total strength and one mixing ratio. Inspect objective definitions before matching a package's `alpha`, `C`, or `l1_ratio` to mathematical symbols.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_18.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_18.py`.

```python
import numpy as np

def soft_threshold(value, threshold):
    return np.sign(value)*np.maximum(np.abs(value)-threshold,0.)

def lasso(X, y, penalty=0.1, steps=1000):
    """Cyclic coordinate descent: ||Xw-y||^2/(2n) + penalty*||w||_1.

    No automatic intercept; center data to fit an unpenalized one separately.
    """
    X,y=np.asarray(X,float),np.asarray(y,float)
    if penalty < 0:
        raise ValueError('penalty must be nonnegative')
    n,d=X.shape
    w=np.zeros(d)
    for _ in range(steps):
        old=w.copy()
        for j in range(d):
            residual=y-X@w+X[:,j]*w[j]
            curvature=X[:,j]@X[:,j]/n
            w[j]=soft_threshold(X[:,j]@residual/n,penalty)/curvature if curvature else 0.
        if np.max(np.abs(w-old)) < 1e-10:
            break
    return w

if __name__ == "__main__":
    X=np.eye(3)
    y=np.array([3.,.2,-2.])
    print(lasso(X,y,penalty=.1))
```

The recorded output in the supplied CPU environment was:

```text
[ 2.7  0.  -1.7]
```
