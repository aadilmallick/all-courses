# 06. Partial derivatives, Jacobians, Hessians, and matrix calculus

[Previous](05-single-variable-calculus.md) · [Course index](../README.md) · [Next](07-probability-conditioning.md)

## One input coordinate at a time

For $f(w_1,w_2)=(w_1+2w_2-3)^2$, define residual $r=w_1+2w_2-3$. Holding $w_2$ fixed gives $\partial f/\partial w_1=2r$. Holding $w_1$ fixed gives $\partial f/\partial w_2=4r$. Collect them into the column gradient $\nabla f=(2r,4r)^\top$. At $(0,0)$ it is $(-6,-12)^\top$.

The gradient is defined by the first-order change $f(w+\delta)=f(w)+\nabla f(w)^\top\delta+o(\|\delta\|)$. For a unit direction $v$, the directional derivative is $\nabla f^\top v$. Cauchy-Schwarz gives $\nabla f^\top v\ge-\|\nabla f\|$. Equality occurs at $v=-\nabla f/\|\nabla f\|$ when the gradient is nonzero. Thus the negative gradient is the steepest local decrease direction under the Euclidean norm.

## Jacobians and the multivariable chain rule

If $g:\mathbb R^d\to\mathbb R^k$, its Jacobian has entries $J_{ij}=\partial g_i/\partial x_j$ and shape $(k,d)$. For a scalar loss $L(g(x))$,

$$\nabla_x L=J_g(x)^\top\nabla_g L.$$

The transpose aligns the axes. An output contribution flows back to every input on which it depends. When an input influences several paths, the contributions add. Forgetting this addition is a common manual-backpropagation bug.

For $z=Xw$, $z_i=\sum_jX_{ij}w_j$, so $\partial z_i/\partial w_j=X_{ij}$. If $L=\frac1{2n}\sum_i(z_i-y_i)^2$, then $\partial L/\partial z_i=(z_i-y_i)/n$. Therefore

$$\frac{\partial L}{\partial w_j}=\sum_i X_{ij}(z_i-y_i)/n,
\qquad \nabla_w L=X^\top(Xw-y)/n.$$

Each coordinate is a residual-feature correlation. The matrix form is a compressed version of those sums, not a separate rule.

## Matrix derivatives without memorized tables

Let $Z=XW+b$ with $X:(n,d)$, $W:(d,k)$, $b:(k,)$ and upstream gradient $G=\partial L/\partial Z:(n,k)$. Expand $Z_{ic}=\sum_jX_{ij}W_{jc}+b_c$. Summing the appropriate coordinate products gives $\nabla_W L=X^\top G$, $\nabla_X L=GW^\top$, and $\nabla_bL=\sum_iG_{i,:}$. The broadcast bias received contributions from every row; reverse the broadcast by summing.

## Hessians and stationary points

The Hessian collects second partial derivatives. For our squared linear residual, $H=2aa^\top$ with $a=(1,2)^\top$, hence $H=\begin{bmatrix}2&4\\4&8\end{bmatrix}$. For any vector $v$, $v^\top Hv=2(a^\top v)^2\ge0$, so the Hessian is positive semidefinite. There is a flat direction because one equation cannot identify both weights uniquely.

A stationary point of a general nonlinear objective may be a minimum, maximum, or saddle. Positive definite Hessian gives a strict local minimum under standard smoothness conditions. Positive semidefinite alone is insufficient without additional information. Convexity, introduced in lesson 11, is a global property that makes first-order conditions more powerful.

## A numerical gradient audit

```python
import numpy as np
X=np.array([[1.,2.],[3.,1.]])
y=np.array([1.,2.]); w=np.array([.2,-.1])
def loss(w):
    return np.mean((X@w-y)**2)/2
analytic=X.T@(X@w-y)/len(y)
eps=1e-5
numeric=np.array([(loss(w+eps*np.eye(2)[j])-loss(w-eps*np.eye(2)[j]))/(2*eps) for j in range(2)])
assert np.allclose(analytic,numeric,rtol=1e-6,atol=1e-7)
print(analytic,numeric)
```

Central differences compare evaluations on either side of each coordinate. A step that is too large has truncation error; one too small loses precision through cancellation. Check multiple steps and avoid kinks. This is a numerical diagnostic, not a proof of all derivatives in the program.


## A quadratic form without a derivative table

Let $f(w)=w^\top Aw$ for a fixed real matrix. Perturb by $h$ and expand:

$$f(w+h)-f(w)=h^\top Aw+w^\top Ah+h^\top Ah.$$

The two linear terms equal $[(A+A^\top)w]^\top h$. The final term is quadratic in $h$, so the gradient is $(A+A^\top)w$. When $A$ is symmetric this becomes $2Aw$. Writing $2Aw$ for a nonsymmetric matrix would be a hidden assumption.

For a scalar function of a matrix, use the Frobenius inner product $\langle G,dW\rangle=\operatorname{tr}(G^\top dW)$. If $Z=XW$ and $dL=\operatorname{tr}(G^\top dZ)$, substitute $dZ=X\,dW$ and move factors cyclically under the trace: $dL=\operatorname{tr}((X^\top G)^\top dW)$. This identifies the matrix gradient $X^\top G$. The coordinate and differential derivations reach the same result, giving independent ways to check a transpose.
