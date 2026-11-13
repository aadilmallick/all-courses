# 19. Logistic regression and multiclass softmax regression

[Previous](18-regularized-regression.md) · [Course index](../README.md) · [Next](20-metrics-calibration.md)

## A linear score is not a probability

A linear score $z=w^\top x+b$ can be any real number. For a binary probability, model log odds as that score:

$$\log\frac{p}{1-p}=z.$$

Exponentiate: $p/(1-p)=e^z$. Multiply out: $p=e^z-e^zp$. Collect terms: $p(1+e^z)=e^z$. Divide to obtain $p=1/(1+e^{-z})$, the sigmoid. At $z=0$ it gives 0.5; increasing the logit by one multiplies odds by $e$, not probability by $e$.

## Derive the loss gradient through both layers

For target $y\in\{0,1\}$, $\ell=-y\log p-(1-y)\log(1-p)$. Differentiation gives $\partial\ell/\partial p=-y/p+(1-y)/(1-p)$. Sigmoid has derivative $p(1-p)$. Their product simplifies:

$$\frac{\partial\ell}{\partial z}=-y(1-p)+(1-y)p=p-y.$$

Since $\partial z/\partial w=x$, the average parameter gradient is $X^\top(p-y)/n$. At initialization $w=0$ and balanced targets, the bias gradient may be zero while feature gradients remain nonzero. Balanced classes do not imply there is nothing to learn.

Take one observation $x=(1,2)$, target 1, and zero weights. Its probability is 0.5, loss is $\log2$, and gradient is $(-0.5,-1)$. A rate-0.1 update gives $w=(0.05,0.1)$, logit 0.25, and probability approximately 0.5622. The target's assigned probability has increased.

## Convexity and an important boundary case

The Hessian is $X^\top D X/n$ with $D_{ii}=p_i(1-p_i)\ge0$. It is positive semidefinite, so the objective is convex in linear model parameters. A finite maximum-likelihood solution need not exist on perfectly separable data: coefficients can diverge while loss approaches zero. A regularizer can restore a finite preferred solution. Convexity is not the same as existence of a finite minimizer.

## Several mutually exclusive classes

Use a logit $z_k$ for each class and define $p_k=e^{z_k}/\sum_ce^{z_c}$. Adding a common constant to all logits changes neither numerator-to-denominator ratios nor probabilities. Subtract the row maximum before exponentiation for stability.

For target class $y$, $\ell=-z_y+\log\sum_ce^{z_c}$. Differentiating with respect to $z_k$ gives $p_k-\mathbf1[k=y]$. Stack one-hot targets in $Y$ and logits as $XW$ to get $\nabla_WJ=X^\top(P-Y)/n$. A softmax distribution describes mutually exclusive outcomes. For independent multilabel events, use one sigmoid and binary loss per label instead.

## Implementation and diagnostics

Use logits directly in stable loss functions. Applying sigmoid and then a logits-based loss applies the transformation twice. Accuracy depends on a threshold or argmax, while likelihood evaluates the full distribution. A classifier can retain accuracy while probability calibration deteriorates.

The supplied implementation uses an explicit bias column if desired. It penalizes every supplied weight when the penalty is nonzero; to exempt an intercept, center inputs and adapt the penalty mask deliberately. Audit gradients before adding regularization, then audit the penalty separately so a missing term cannot hide behind a correct data term.


## Derive the full softmax Jacobian

Let $p_i=e^{z_i}/Z$ with $Z=\sum_ke^{z_k}$. Differentiate using the quotient rule. If the input coordinate is $j$, the numerator derivative is $\mathbf1[i=j]e^{z_i}$ and denominator derivative is $e^{z_j}$. Hence

$$\frac{\partial p_i}{\partial z_j}=p_i(\mathbf1[i=j]-p_j).$$

The Jacobian is $\operatorname{diag}(p)-pp^\top$. Its rows sum to zero, matching invariance to a common logit shift. For any $v$, $v^\top Jv=\sum_ip_iv_i^2-(\sum_ip_iv_i)^2$, the variance of values $v_i$ under $p$, so it is nonnegative. This proves the log-sum-exp Hessian is positive semidefinite.

With logits $(0,0)$, probabilities are $(0.5,0.5)$ and the Jacobian is $\begin{bmatrix}.25&-.25\\-.25&.25\end{bmatrix}$. Increasing the first logit raises the first probability and lowers the second. Treating softmax as independent sigmoids would miss that coupling and produce a different model.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_19.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_19.py`.

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

def softmax(z):
    z = np.asarray(z, dtype=float)
    if z.ndim == 0 or z.shape[-1] == 0 or np.isnan(z).any() or np.isposinf(z).any():
        raise ValueError('softmax needs nonempty rows without NaN or positive infinity')
    if not np.isfinite(z.max(axis=-1)).all():
        raise ValueError('every softmax row needs a finite allowed score')
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

def sigmoid(z):
    return np.exp(-np.logaddexp(0., -np.asarray(z, dtype=float)))

def binary_objective(w,X,y,penalty=0.):
    X,y=_supervised(X,y)
    w=np.asarray(w,float)
    if w.shape != (X.shape[1],) or not np.isfinite(w).all():
        raise ValueError('w must be a finite vector with one entry per feature')
    if np.any((y<0)|(y>1)) or not np.isfinite(penalty) or penalty<0:
        raise ValueError('binary targets must lie in [0,1] and penalty must be nonnegative')
    z=X@w
    loss=np.mean(np.logaddexp(0.,z)-y*z)+penalty*(w@w)/2
    grad=X.T@(sigmoid(z)-y)/len(y)+penalty*w
    return loss,grad

def fit_logistic(X,y,rate=0.2,steps=1000,penalty=0.):
    w=np.zeros(X.shape[1])
    for _ in range(steps):
        _,g=binary_objective(w,X,y,penalty)
        w-=rate*g
    return w

def multiclass_objective(W,X,y,penalty=0.):
    X=np.asarray(X,float);W=np.asarray(W,float);y=np.asarray(y)
    if X.ndim != 2 or 0 in X.shape or W.ndim != 2 or W.shape[0] != X.shape[1] or W.shape[1]==0 or y.shape != (len(X),):
        raise ValueError('multiclass arrays must have shapes X:(n,d), W:(d,k), y:(n,)')
    if not np.isfinite(X).all() or not np.isfinite(W).all() or not np.issubdtype(y.dtype,np.integer) or np.any(y<0) or np.any(y>=W.shape[1]):
        raise ValueError('use finite features and weights with integer class indices in [0,k)')
    if not np.isfinite(penalty) or penalty<0:
        raise ValueError('penalty must be finite and nonnegative')
    z=X@W
    p=softmax(z)
    logsum=np.logaddexp.reduce(z,axis=1)
    loss=np.mean(logsum-z[np.arange(len(y)),y])+penalty*np.sum(W*W)/2
    residual=p.copy()
    residual[np.arange(len(y)),y]-=1
    return loss,X.T@residual/len(y)+penalty*W

if __name__ == "__main__":
    X=np.array([[1.,-1.],[1.,1.]])
    y=np.array([0.,1.])
    w=fit_logistic(X,y)
    print(w,sigmoid(X@w))
```

The recorded output in the supplied CPU environment was:

```text
[4.45476989e-16 5.27904354e+00] [0.00507145 0.99492855]
```


## Verification note

The executable loss functions require a one-dimensional target array. Binary targets must lie in [0,1]; multiclass targets must be integer indices from zero through K-1. A column-shaped target can otherwise broadcast into an unintended matrix, so it is rejected rather than reshaped silently.
