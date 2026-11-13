# 02. Linear algebra for representations and projections

[Previous](01-tensors-shapes.md) · [Index](../README.md) · [Next](03-calculus-chain-rule.md)

**Part:** Foundations. **Prerequisite:** read lessons 01–01 in order, or verify the earlier definitions used here.

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
python code/02_linear_algebra.py
```

### Recorded output from the supplied environment

```text
rank 2 error 1.006401
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Squared distance along one singular direction, plus irreducible error.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\left(x - 2\right)^{2} + 1.$$

Its first derivative is

$$f^{(1)}(x)=2 x - 4.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=2.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.3 | 3.89 | -3.4 | 2 |
| 0.5 | 3.25 | -3 | 2 |
| 0.7 | 2.69 | -2.6 | 2 |

#### Evaluation 1: substitute $x=0.3$

$$f(0.3)=\frac{389}{100}\approx 3.89.$$
At this coordinate the slope is $-3.4$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0034$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.003399$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.5$

$$f(0.5)=\frac{13}{4}\approx 3.25.$$
At this coordinate the slope is $-3$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.002999$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.7$

$$f(0.7)=\frac{269}{100}\approx 2.69.$$
At this coordinate the slope is $-2.6$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0026$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.002599$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -3 | 2.6645e-15 |
| 0.01 | -3 | 2.6645e-15 |
| 0.001 | -3 | 3.304e-13 |
| 0.0001 | -3 | 3.304e-13 |
| 1e-05 | -3 | 1.9653e-11 |
| 1e-06 | -3 | 2.4755e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 3.89 | 3.85 | 3.89 | 4.4409e-16 |
| -0.1 | 3.56 | 3.55 | 3.56 | 8.8818e-16 |
| 0.1 | 2.96 | 2.95 | 2.96 | 0 |
| 0.2 | 2.69 | 2.65 | 2.69 | 4.4409e-16 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: transformers](https://aman.ai/primers/transformers/)
- [Aman.ai: parameter-efficient-fine-tuning](https://aman.ai/primers/parameter-efficient-fine-tuning/)

[Previous](01-tensors-shapes.md) · [Index](../README.md) · [Next](03-calculus-chain-rule.md)
