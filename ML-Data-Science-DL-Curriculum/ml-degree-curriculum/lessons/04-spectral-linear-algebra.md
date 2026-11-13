# 04. Eigenvectors, SVD, least squares, and numerical conditioning

[Previous](03-vectors-matrices.md) · [Course index](../README.md) · [Next](05-single-variable-calculus.md)

## Why solving systems can become unstable

Two features can contain nearly the same information. For example, columns $(1,2,3)$ and $(1.000001,2.000002,3.000003)$ point in the same direction. Many coefficient pairs generate essentially the same predictions. Tiny measurement changes can then produce large coefficient changes. Prediction stability and coefficient identifiability are related but different questions.

The rank of $X$ is the number of independent column directions. A square full-rank matrix has an inverse. A rectangular matrix generally does not. Least squares asks for a vector minimizing $\|Xw-y\|_2^2$, which remains meaningful even when an inverse does not exist.

## Eigenvectors and singular directions

An eigenvector $v\ne0$ satisfies $Av=\lambda v$: multiplication preserves its direction and scales it by $\lambda$. For a symmetric real matrix, eigenvectors can be chosen orthonormally and all eigenvalues are real. For $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, directions $(1,1)$ and $(1,-1)$ have eigenvalues 3 and 1. Check by multiplying each vector explicitly.

The singular value decomposition works for any real rectangular matrix:

$$X=U\Sigma V^\top.$$

Columns of $V$ identify orthogonal input directions. Singular values on $\Sigma$ say how strongly those directions are stretched. Columns of $U$ give the resulting output directions. Zero singular values represent directions lost by the transformation. A pseudoinverse reciprocates nonzero singular values and leaves zeros at zero; the numerical threshold must reflect precision and scale.

## From geometry to least squares

Write $y$ in the output basis, $c=U^\top y$. In a nonzero singular direction the squared residual contribution is $(\sigma_j a_j-c_j)^2$, minimized by $a_j=c_j/\sigma_j$. Reassemble $w=Va$. A component of $y$ orthogonal to the column space cannot be fitted. This construction produces the minimum-norm least-squares solution when the system is rank deficient.

A small $\sigma_j$ divides by a tiny number and amplifies noise. The 2-norm condition number for a full-column-rank matrix is $\kappa=\sigma_{\max}/\sigma_{\min}$. Forming $X^\top X$ squares this condition number. That is a reason to solve least squares with QR or SVD rather than explicitly invert the normal-equation matrix.

```python
import numpy as np
X = np.array([[1.,0.],[1.,1.],[1.,2.]])
y = np.array([1.,3.,5.])
w, residuals, rank, singular = np.linalg.lstsq(X,y,rcond=None)
assert np.allclose(w,[1.,2.])
assert np.allclose(X.T @ (X@w-y),0)
print(w, rank, singular)
```

The residual orthogonality is the optimality condition. The solution has intercept 1 and slope 2. `lstsq` is an algorithm for the stated mathematical problem, not an instruction to compute a matrix inverse.

## Low-rank approximation

Keeping the largest $r$ singular values gives a best rank-at-most-$r$ approximation in Frobenius norm. The squared error is the sum of discarded squared singular values. For singular values $(5,2,1)$, rank-one error is $\sqrt5$, and rank-two error is 1. This fixed-matrix approximation theorem will motivate PCA and parameter-efficient updates; it does not guarantee that a low-rank trained model is best for every task.

Optional application: duplicate one feature column and inspect the returned rank. Predictions can remain exact even though individual coefficients are no longer uniquely determined. Explain the distinction using the null space: adding a vector $v$ with $Xv=0$ changes weights without changing predictions.


## A complete two-dimensional eigendecomposition

For $C=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, solve $\det(C-\lambda I)=0$. The determinant is $(2-\lambda)^2-1=\lambda^2-4\lambda+3=(\lambda-1)(\lambda-3)$. At eigenvalue 3 the equations reduce to $v_1=v_2$, so normalize $(1,1)$ to $u_1=(1,1)/\sqrt2$. At eigenvalue 1 they reduce to $v_1=-v_2$, so $u_2=(1,-1)/\sqrt2$.

Then $U=[u_1,u_2]$ has $U^\top U=I$ and $C=U\operatorname{diag}(3,1)U^\top$. A vector $x$ can be written $a_1u_1+a_2u_2$, and multiplication by $C$ becomes $3a_1u_1+a_2u_2$. This calculation is the spectral theorem's mechanism in one concrete case.

For a symmetric positive-definite matrix, the quadratic form $x^\top Cx=3a_1^2+a_2^2$ has elliptical level sets. Along $u_1$ the same loss increase needs a smaller displacement than along $u_2$. Gradient descent therefore has different effective curvature in the two directions. Whitening multiplies by inverse square-root eigenvalues, but a zero or poorly estimated eigenvalue requires regularization rather than unrestricted amplification.


## Detailed SVD laboratory and projection distinctions

## Features as coordinates

A vector is a list of coordinates relative to a chosen basis. In an embedding, a coordinate is not automatically a human concept. A learned change of basis can redistribute information while preserving the useful relationships. Two models may solve the same task with different internal coordinates.

For $u,v\in\mathbb R^D$, the dot product is $u^\top v=\sum_i u_iv_i$. Its geometric expression is $\|u\|\|v\|\cos\theta$. Thus a large dot product can indicate alignment, large norms, or both. Cosine similarity divides out the norms and is undefined when either vector is zero. Never silently divide by zero or assume that magnitude is irrelevant to a trained retrieval model.

For $u=(1,2)$ and $v=(2,0)$, the dot product is two, norms are $\sqrt5$ and two, and cosine is $1/\sqrt5$. Doubling $v$ doubles the dot product but leaves the cosine unchanged. This difference later explains why normalized embeddings and unnormalized attention scores behave differently.

## Matrix multiplication as composition

Using row vectors, let $x\in\mathbb R^{1\times D}$, $A\in\mathbb R^{D\times R}$, and $B\in\mathbb R^{R\times F}$. Then $(xA)B=x(AB)$. Expand the left side at output coordinate $j$:

$$\sum_{r=1}^R\left(\sum_{i=1}^Dx_iA_{ir}\right)B_{rj}
=\sum_{i=1}^Dx_i\left(\sum_{r=1}^RA_{ir}B_{rj}\right).$$

Interchanging two finite sums justifies associativity. The intermediate width $R$ limits the rank of $AB$ to at most $R$. It is the number of independent intermediate directions, not simply the number of nonzero entries. This will become the mathematical foundation of LoRA.

## Rank, singular values, and approximation

Every real matrix has a singular value decomposition $W=U\Sigma V^\top$. Orthogonal factors rotate or reflect; nonnegative singular values stretch independent directions. Keeping the largest $r$ singular values gives a best rank-at-most-$r$ approximation in Frobenius norm. The squared error is the sum of squares of discarded singular values. This statement concerns approximating a fixed matrix under that norm; it does not prove that rank-$r$ fine-tuning is optimal for a language task.

The experiment deliberately constructs a rank-two update. Numerical rank depends on a tolerance because floating-point values rarely satisfy exact algebraic identities. We then truncate a separate random matrix and compare measured error with the discarded singular-value energy.

## When the analogy breaks

A neural layer with a nonlinear activation is not just one global linear projection. Composition of linear layers collapses into a single matrix, whereas composition separated by nonlinearities generally does not. Likewise, adding a rank-two update to a full-rank base matrix usually leaves the combined matrix full rank. It is the update that is constrained.

Optional worked task: if singular values are $(5,2,1)$, rank-one error is $\sqrt{2^2+1^2}=\sqrt5$. Keeping rank two reduces error to one. These are absolute errors; relative error divides by $\sqrt{30}$.

### Worked projection and a counterexample

Project $v=(3,4)$ onto unit direction $u=(1,0)$. The scalar coefficient is $u^\top v=3$, so the projected vector is $(3,0)$ and residual is $(0,4)$. Their dot product is zero, and squared lengths satisfy $25=9+16$. This Pythagorean identity depends on orthogonality. A learned matrix need not be an orthogonal projection: multiplying by $\operatorname{diag}(2,1)$ stretches the first coordinate rather than projecting onto a subspace. Calling every neural matrix a 'projection' is common terminology, but it does not grant idempotence $P^2=P$ or orthogonality. Keep the mathematical property distinct from the programming name.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(1)
a = rng.normal(size=(5, 2))
b = rng.normal(size=(2, 4))
update = a @ b
assert np.linalg.matrix_rank(update) <= 2
weight = rng.normal(size=(5, 4))
u, singular, vt = np.linalg.svd(weight, full_matrices=False)
approximation = (u[:, :2] * singular[:2]) @ vt[:2]
error = np.linalg.norm(weight - approximation)
assert np.allclose(error ** 2, np.sum(singular[2:] ** 2))
print('rank', np.linalg.matrix_rank(update), 'error', round(error, 6))

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(1)
```

#### Stage 3

```python
a = rng.normal(size=(5, 2))
```

An observed state during this stage was:

- `a`: `[[ 0.34558  0.82162]  [ 0.33044 -1.30316]  [ 0.90536  0.44637]  [-0.53695  0.58112]  [ 0.36457  0.29413]]`

#### Stage 4

```python
b = rng.normal(size=(2, 4))
```

An observed state during this stage was:

- `b`: `[[ 0.02842  0.54671 -0.73645 -0.16291]  [-0.48212  0.59885  0.03972 -0.29246]]`

#### Stage 5

```python
update = a @ b
```

An observed state during this stage was:

- `update`: `[[-0.3863   0.68096 -0.22187 -0.29659]  [ 0.63767 -0.59974 -0.29512  0.32729]  [-0.18947  0.76228 -0.64902 -0.27804]  [-0.29543  0.05444  0.41852 -0.08248]  [-0.13144  0.37546 -0.25681 -0.14541]]`

#### Stage 6

```python
assert np.linalg.matrix_rank(update) <= 2
```

#### Stage 7

```python
weight = rng.normal(size=(5, 4))
```

An observed state during this stage was:

- `weight`: `[[-0.78191 -0.25719  0.00814 -0.2756 ]  [ 1.29406  1.00672 -2.71116 -1.88901]  [-0.17477 -0.42219  0.21364  0.21732]  [ 2.11784 -1.11202 -0.37761  2.04277]  [ 0.6467   0.66306 -0.51401 -1.64808]]`

#### Stage 8

```python
u, singular, vt = np.linalg.svd(weight, full_matrices=False)
```

An observed state during this stage was:

- `u`: `[[-0.01204 -0.21563 -0.47925 -0.6585 ]  [ 0.84264  0.33567 -0.39955  0.07691]  [-0.11113 -0.01355 -0.13373 -0.55912]  [-0.29447  0.91602  0.06463 -0.21086]  [ 0.43674 -0.03941  0.76721 -0.45098]]`
- `singular`: `[4.16823 3.18601 0.88605 0.47723]`
- `vt`: `[[ 0.18667  0.36355 -0.58098 -0.70388]  [ 0.79091 -0.20265 -0.38931  0.42642]  [ 0.5802   0.24189  0.7133  -0.30995]  [-0.05468  0.8765  -0.04588  0.47608]]`

#### Stage 9

```python
approximation = (u[:, :2] * singular[:2]) @ vt[:2]
```

An observed state during this stage was:

- `approximation`: `[[-0.55272  0.12097  0.29662 -0.25761]  [ 1.50147  1.06019 -2.45696 -2.01622]  [-0.12061 -0.15965  0.28592  0.30763]  [ 2.07911 -1.03767 -0.42307  2.10843]  [ 0.24052  0.68727 -1.00878 -1.33491]]`

#### Stage 10

```python
error = np.linalg.norm(weight - approximation)
```

An observed state during this stage was:

- `error`: `1.0064013`

#### Stage 11

```python
assert np.allclose(error ** 2, np.sum(singular[2:] ** 2))
```

#### Stage 12

```python
print('rank', np.linalg.matrix_rank(update), 'error', round(error, 6))
```

Run from the course root:

```bash
python code/neural/02_linear_algebra.py
```

### Recorded output from the supplied environment

```text
rank 2 error 1.006401
```