# 17. Linear regression from geometry to a tested implementation

[Previous](16-data-quality-privacy.md) · [Course index](../README.md) · [Next](18-regularized-regression.md)

## Begin with one line and three observations

Suppose inputs are $x=(0,1,2)$ and targets are $y=(1,3,5)$. A model $\widehat y=b+wx$ fits these exactly with $b=1,w=2$. Real data rarely lie on one exact line. Least squares chooses the line minimizing squared residuals, making the fitting rule explicit rather than drawing a plausible line by eye.

Put a column of ones into a design matrix $X$ so intercept and slope share the vector $\theta=(b,w)^\top$. For $n$ observations, $X:(n,d)$, $y:(n,)$ and $\theta:(d,)$. Define

$$J(\theta)=\frac1{2n}\|X\theta-y\|_2^2.$$

The factor $1/2$ cancels the derivative's 2; $1/n$ makes the objective an average. Neither changes the unregularized minimizer. The residual is prediction minus target; reversing that sign without changing the update reverses the gradient.

## Derive every coordinate of the gradient

For row $i$, $r_i=\sum_jX_{ij}\theta_j-y_i$. Differentiate: $\partial r_i/\partial\theta_k=X_{ik}$. The chain rule gives $\partial(r_i^2/2)/\partial\theta_k=r_iX_{ik}$. Sum over rows and divide by $n$:

$$\nabla J=\frac1nX^\top(X\theta-y).$$

The Hessian is $X^\top X/n$, positive semidefinite because $v^\top X^\top Xv/n=\|Xv\|^2/n\ge0$. Hence the objective is convex. A stationary point satisfies the normal equations $X^\top X\theta=X^\top y$. If columns are independent, this solution is unique. Otherwise there can be many coefficient vectors with identical fitted predictions.

## Trace a gradient step

At $b=w=0$, predictions are $(0,0,0)$ and residuals $(-1,-3,-5)$. The intercept gradient is $(-1-3-5)/3=-3$. The slope gradient is $(0(-1)+1(-3)+2(-5))/3=-13/3$. With rate 0.1, the next coefficients are $b=0.3,w=13/30$. Predictions become $(0.3,0.7333,1.1667)$. They are still inaccurate, but the step follows the negative gradient. More iterations are needed; one update is not a fit.

For an exact solution, center the scalar inputs and targets. Minimizing the intercept first yields $b=\bar y-w\bar x$. Substituting into the objective leaves centered values, whose derivative gives

$$w=\frac{\sum_i(x_i-\bar x)(y_i-\bar y)}{\sum_i(x_i-\bar x)^2}.$$

Here $\bar x=1$, $\bar y=3$, numerator is $(-1)(-2)+0+(1)(2)=4$, and denominator is 2. Thus $w=2$ and $b=1$. If all $x_i$ are equal, the denominator is zero and the slope is not identifiable.

## Probability and assumptions

If $Y_i=x_i^\top\theta+\epsilon_i$ with independent Gaussian noise of common variance, maximum likelihood gives the same squared-error fit. Gaussian noise is not required merely to compute least squares. Different additional assumptions support different claims: full rank gives coefficient uniqueness; a correctly specified conditional mean and suitable exogeneity support unbiased coefficient estimation; homoscedasticity supports classical variance formulas; Gaussian errors support certain exact finite-sample tests. Do not bundle these into a claim that predictions are impossible without normal residuals.

A polynomial regression is linear in parameters even when nonlinear in the raw input. Columns $1,x,x^2$ still yield $X\theta$. This increases flexibility but can worsen conditioning and extrapolation. A high in-sample $R^2$ does not certify generalization or causation.

## From derivation to numerical code

Use QR or SVD-based least squares rather than explicitly invert $X^\top X$. The implementation below supports an optional ridge extension, with its exact objective convention documented. The intercept is supplied explicitly so you can see which columns are penalized. Compare predictions, residual orthogonality, and finite-difference gradients on small datasets before using it as a baseline.

Optional application: add a fourth point $(3,20)$. Fit by hand or code and inspect residuals. Explain why squaring gives this outlier substantial influence, and compare a robust loss without claiming that every unusual observation should be discarded.


## Residual geometry and coefficient uncertainty

For full column rank, fitted values are $\widehat y=Hy$ with $H=X(X^\top X)^{-1}X^\top$. This expression defines a mathematical projection; compute fits with stable solvers. Verify $H^\top=H$ and $H^2=H$ by transposition and multiplication. The residual operator $I-H$ projects onto the orthogonal complement, so $X^\top(y-\widehat y)=0$.

If $y=X\theta+\epsilon$, $E[\epsilon\mid X]=0$, and $\operatorname{Cov}(\epsilon\mid X)=\sigma^2I$, then $E[\widehat\theta\mid X]=\theta$ and $\operatorname{Cov}(\widehat\theta\mid X)=\sigma^2(X^\top X)^{-1}$. Substitute the linear estimator into the covariance rule $\operatorname{Cov}(Ay)=A\operatorname{Cov}(y)A^\top$ to derive it. Large inverse eigenvalues reveal poorly identified coefficient directions.

The Gauss-Markov conclusion is minimum variance among linear unbiased estimators under its assumptions. It does not assert minimum mean squared prediction error among every nonlinear or biased estimator. Ridge can improve prediction while introducing coefficient bias, so the two claims are compatible.


## Complete algorithm laboratory

The following program is saved as [the lesson laboratory](../code/classical/lesson_17.py). It uses only NumPy. The final small dataset is chosen so that you can connect each array to the preceding derivation. Run it from the course root with `python code/classical/lesson_17.py`.

```python
import numpy as np

def least_squares(X, y, ridge=0.):
    """No automatic intercept. Augmentation avoids inverting X.T @ X.

    Penalty is ridge * ||w||^2 added to the SUM of squared residuals.
    All supplied columns, including a supplied intercept, are penalized.
    """
    X, y = np.asarray(X,float), np.asarray(y,float)
    if ridge < 0:
        raise ValueError('ridge must be nonnegative')
    if ridge:
        X = np.vstack([X, np.sqrt(ridge)*np.eye(X.shape[1])])
        y = np.concatenate([y, np.zeros(X.shape[1])])
    return np.linalg.lstsq(X,y,rcond=None)[0]

if __name__ == "__main__":
    X=np.array([[1.,0.],[1.,1.],[1.,2.]])
    y=np.array([1.,3.,5.])
    print(least_squares(X,y))
```

The recorded output in the supplied CPU environment was:

```text
[1. 2.]
```
