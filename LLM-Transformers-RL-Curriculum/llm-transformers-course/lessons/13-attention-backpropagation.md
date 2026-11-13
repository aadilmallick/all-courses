# 13. Backpropagating through attention by hand

[Previous](12-scaled-dot-product-attention.md) · [Index](../README.md) · [Next](14-attention-masks.md)

**Part:** Transformer construction. **Prerequisite:** read lessons 01–12 in order, or verify the earlier definitions used here.

## Work backward through exactly three operations

Write $S=QK^\top/\sqrt d$, $A=\operatorname{softmax}(S)$ rowwise, and $O=AV$. Suppose a scalar objective supplies upstream matrix $G=\partial L/\partial O$. We will derive all three input gradients without constructing a four-dimensional Jacobian.

For $O_{ic}=\sum_jA_{ij}V_{jc}$, differentiation gives

$$G_V=A^\top G,\qquad G_A=GV^\top.$$

The first sums contributions from every query that read a value; the second measures how changing a weight changes the upstream objective. Check dimensions: $G_V$ has the shape of $V$, and $G_A$ has the shape of $A$.

For one row $a=\operatorname{softmax}(s)$ with upstream $g$, its score gradient is $a\odot(g-\langle a,g\rangle)$. Expand coordinate $k$: $\sum_jg_ja_j(\mathbf1[j=k]-a_k)=a_kg_k-a_k\sum_jg_ja_j$. Thus for all rows,

$$G_S=A\odot\left(G_A-\operatorname{rowsum}(A\odot G_A)\right).$$

The row sum retains an axis so it broadcasts over keys. Its role is a probability-weighted baseline. Score gradients sum to zero in every row, consistent with softmax's invariance to adding a row constant.

Finally, use matrix-product derivatives:

$$G_Q=G_SK/\sqrt d,\qquad G_K=G_S^\top Q/\sqrt d.$$

If $Q=XW_Q$, the projection contributes $G_QW_Q^\top$ to $G_X$. Add analogous key and value contributions because the input appears on three paths. Weight gradients are $X^\top G_Q$, $X^\top G_K$, and $X^\top G_V$.

## What masking changes

A fixed disallowed score is replaced by negative infinity before normalization. Its probability is zero, so its score gradient is zero. Gradients must not flow into the overwritten score. Every query needs at least one allowed key; otherwise normalization is undefined. In a numerical implementation, avoid multiplying unrelated infinities by zero in loss code.

## Read the independent check

The experiment defines $L=\sum O\odot G$. This linear scalarization supplies an arbitrary upstream derivative and tests the full local backward operation. It compares each analytical input gradient with central differences while holding the other inputs fixed. All arrays are small and use float64 to reduce roundoff.

An important edge case is a single allowed key: its weight is always one, so key and query score gradients vanish, while its value still receives a gradient. Another is identical values: addressing gradients can vanish even when value gradients do not. These are consequences of the operation, not bugs.

Optional application: chain the three projections from a shared input and compare the sum of three input-gradient contributions with a finite-difference input gradient. This directly checks the shared-input accounting that a transformer relies on.

### Carry one reverse pass all the way to the shared input

For $X\in\mathbb R^{T\times D}$ and projection weights $W_Q,W_K,W_V$, compute $G_Q,G_K,G_V$ as above. The input derivative is $G_X=G_QW_Q^\top+G_KW_K^\top+G_VW_V^\top$. Every summand has shape $(T,D)$, which permits addition. Each projection weight derivative instead contracts over token positions: $G_{W_Q}=X^\top G_Q$, with analogous key and value terms. Confusing these two contractions can produce plausible shapes when widths happen to agree. Test unequal widths and lengths to reveal accidental transposes.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention, finite_difference
rng = np.random.default_rng(13)
q, k, v = rng.normal(size=(2, 3)), rng.normal(size=(4, 3)), rng.normal(size=(4, 2))
g = rng.normal(size=(2, 2))
o, a = attention(q, k, v)
gv = a.T @ g
ga = g @ v.T
gs = a * (ga - (a * ga).sum(axis=-1, keepdims=True))
gq, gk = gs @ k / np.sqrt(3), gs.T @ q / np.sqrt(3)
assert np.allclose(gs.sum(axis=-1), 0)
checks = [(gq, finite_difference(lambda z: np.sum(attention(z, k, v)[0] * g), q)),
          (gk, finite_difference(lambda z: np.sum(attention(q, z, v)[0] * g), k)),
          (gv, finite_difference(lambda z: np.sum(attention(q, k, z)[0] * g), v))]
for analytic, numeric in checks:
    assert np.allclose(analytic, numeric, atol=1e-7)
print('maximum gradient errors', [float(np.max(np.abs(a-b))) for a, b in checks])

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(13)
```

#### Stage 4

```python
q, k, v = rng.normal(size=(2, 3)), rng.normal(size=(4, 3)), rng.normal(size=(4, 2))
```

An observed state during this stage was:

- `q`: `[[ 1.82676 -3.07833  0.95806]  [ 0.06964  1.31825  0.38563]]`
- `k`: `[[ 1.82726  0.03174 -0.51623]  [ 0.58048  0.43211 -0.35684]  [-0.2473   0.71944  0.70432]  [-0.49393 -0.36771 -1.80679]]`
- `v`: `[[ 1.67921 -0.22429]  [ 1.33728  0.41747]  [ 1.94396  1.53711]  [ 0.3183   1.48076]]`

#### Stage 5

```python
g = rng.normal(size=(2, 2))
```

An observed state during this stage was:

- `g`: `[[-0.95012  1.25862]  [-1.48042  0.34324]]`

#### Stage 6

```python
o, a = attention(q, k, v)
```

An observed state during this stage was:

- `o`: `[[1.56396 0.0487 ]  [1.55544 0.86346]]`
- `a`: `[[0.77223 0.11116 0.05011 0.0665 ]  [0.20499 0.27397 0.41767 0.10337]]`

#### Stage 7

```python
gv = a.T @ g
```

An observed state during this stage was:

- `gv`: `[[-1.03719  1.0423 ]  [-0.51121  0.23394]  [-0.66594  0.20643]  [-0.21621  0.11918]]`

#### Stage 8

```python
ga = g @ v.T
```

An observed state during this stage was:

- `ga`: `[[-1.87775 -0.74515  0.08763  1.56129]  [-2.56292 -1.83645 -2.3503   0.03704]]`

#### Stage 9

```python
gs = a * (ga - (a * ga).sum(axis=-1, keepdims=True))
```

An observed state during this stage was:

- `gs`: `[[-0.34989  0.07553  0.07578  0.19858]  [-0.11409  0.04654 -0.14366  0.21121]]`

#### Stage 10

```python
gq, gk = gs @ k / np.sqrt(3), gs.T @ q / np.sqrt(3)
```

An observed state during this stage was:

- `gq`: `[[-0.41126  0.00175 -0.08761]  [-0.14449 -0.09499 -0.25433]]`
- `gk`: `[[-0.37361  0.53501 -0.21894]  [ 0.08153 -0.09882  0.05214]  [ 0.07415 -0.24402  0.00993]  [ 0.21793 -0.19217  0.15687]]`

#### Stage 11

```python
assert np.allclose(gs.sum(axis=-1), 0)
```

#### Stage 12

```python
checks = [(gq, finite_difference(lambda z: np.sum(attention(z, k, v)[0] * g), q)),
          (gk, finite_difference(lambda z: np.sum(attention(q, z, v)[0] * g), k)),
          (gv, finite_difference(lambda z: np.sum(attention(q, k, z)[0] * g), v))]
```

An observed state during this stage was:

- `checks`: `[(array([[-0.41125585,  0.00174949, -0.08761028],        [-0.14448785, -0.09499363, -0.25433127]]), array([[-0.41125585,  0.00174949, -0.08761028],        [-0.14448785, -0.09499363, -0.25433127]])), (array([[-0.37360735,  0.53501216, -0.21893941],        [ 0.08153425, -0.09881852,  0.05214289],        [ 0.07414612, -0.2440209 ,  0.00993036],       `

#### Stage 13

```python
for analytic, numeric in checks:
    assert np.allclose(analytic, numeric, atol=1e-7)
```

An observed state during this stage was:

- `analytic`: `[[-1.03719  1.0423 ]  [-0.51121  0.23394]  [-0.66594  0.20643]  [-0.21621  0.11918]]`
- `numeric`: `[[-1.03719  1.0423 ]  [-0.51121  0.23394]  [-0.66594  0.20643]  [-0.21621  0.11918]]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 14

```python
print('maximum gradient errors', [float(np.max(np.abs(a-b))) for a, b in checks])
```

An observed state during this stage was:

- `a`: `[[0.77223 0.11116 0.05011 0.0665 ]  [0.20499 0.27397 0.41767 0.10337]]`

Run from the course root:

```bash
python code/13_attention_backpropagation.py
```

### Recorded output from the supplied environment

```text
maximum gradient errors [2.0035140213536806e-11, 6.29335195068137e-11, 2.7627233833982245e-11]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A scalar squared loss through a two-slot attention read, requiring both outer and softmax derivatives.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{\left(2 + \frac{8}{1 + e^{- x}}\right)^{2}}{2}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{8 \left(2 + \frac{8}{1 + e^{- x}}\right) e^{- x}}{\left(1 + e^{- x}\right)^{2}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \frac{8 \left(2 + \frac{8}{1 + e^{- x}}\right) e^{- x}}{\left(1 + e^{- x}\right)^{2}} + \frac{16 \left(2 + \frac{8}{1 + e^{- x}}\right) e^{- 2 x}}{\left(1 + e^{- x}\right)^{3}} + \frac{64 e^{- 2 x}}{\left(1 + e^{- x}\right)^{4}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.3 | 21.7505748 | 12.8986768 | 1.9042115 |
| 0.5 | 24.3579291 | 13.1219956 | 0.320690048 |
| 0.7 | 26.9782011 | 13.0287391 | -1.23652694 |

#### Evaluation 1: substitute $x=0.3$

$$f(0.3)=\frac{\left(2 + \frac{8}{e^{- \frac{3}{10}} + 1}\right)^{2}}{2}\approx 21.7505748.$$
At this coordinate the slope is $12.8986768$, so the function increases under a sufficiently small positive perturbation. The curvature is $1.9042115$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.0128986768$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9.52105749e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.0128996277$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.5$

$$f(0.5)=\frac{\left(2 + \frac{8}{e^{- \frac{1}{2}} + 1}\right)^{2}}{2}\approx 24.3579291.$$
At this coordinate the slope is $13.1219956$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.320690048$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.0131219956$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.60345024e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.0131221546$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.7$

$$f(0.7)=\frac{\left(2 + \frac{8}{e^{- \frac{7}{10}} + 1}\right)^{2}}{2}\approx 26.9782011.$$
At this coordinate the slope is $13.0287391$, so the function increases under a sufficiently small positive perturbation. The curvature is $-1.23652694$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.0130287391$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-6.1826347e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.0130281196$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 13.10871591 | 0.01328 |
| 0.01 | 13.12186267 | 0.00013295 |
| 0.001 | 13.12199429 | 1.3296e-06 |
| 0.0001 | 13.12199561 | 1.3285e-08 |
| 1e-05 | 13.12199562 | 1.5834e-11 |
| 1e-06 | 13.12199562 | 6.9471e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{8 \left(2 + \frac{8}{1 + e^{- x}}\right) e^{- x}}{\left(1 + e^{- x}\right)^{2}} - \frac{48 \left(2 + \frac{8}{1 + e^{- x}}\right) e^{- 2 x}}{\left(1 + e^{- x}\right)^{3}} + \frac{48 \left(2 + \frac{8}{1 + e^{- x}}\right) e^{- 3 x}}{\left(1 + e^{- x}\right)^{4}} - \frac{192 e^{- 2 x}}{\left(1 + e^{- x}\right)^{4}} + \frac{384 e^{- 3 x}}{\left(1 + e^{- x}\right)^{5}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 21.7505748 | 21.73353 | 21.7399438 | 0.010631 |
| -0.1 | 23.0486638 | 23.0457295 | 23.047333 | 0.0013308 |
| 0.1 | 25.670407 | 25.6701287 | 25.6717321 | 0.0013251 |
| 0.2 | 26.9782011 | 26.9823282 | 26.988742 | 0.010541 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: attention](https://aman.ai/primers/attention/)
- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Previous](12-scaled-dot-product-attention.md) · [Index](../README.md) · [Next](14-attention-masks.md)
