# 12. Queries, keys, values, and scaled dot-product attention

[Previous](11-attention-weighted-retrieval.md) · [Index](../README.md) · [Next](13-attention-backpropagation.md)

**Part:** Language and attention. **Prerequisite:** read lessons 01–11 in order, or verify the earlier definitions used here.

## Turn hidden vectors into a learned read mechanism

Let $X\in\mathbb R^{T\times D}$. Projections create $Q=XW_Q$, $K=XW_K$, and $V=XW_V$. For query position $i$ and key position $j$, score $S_{ij}=q_i^\top k_j/\sqrt{d_k}$. Apply softmax across key positions $j$, then multiply by values:

$$A=\operatorname{softmax}_{\text{keys}}(QK^\top/\sqrt{d_k}),\qquad O=AV.$$

Shapes explain the calculation: $Q$ is $(T,d_k)$, $K^\top$ is $(d_k,T)$, the score matrix is $(T,T)$, and $V$ is $(T,d_v)$. Consequently $O$ is $(T,d_v)$. Every output row has its own distribution over keys. Softmax across queries would normalize the wrong decision.

## A numerical score

For $q=(1,0)$, $k_1=(1,0)$, and $k_2=(0,1)$, raw dot products are one and zero. Divide by $\sqrt2$ to obtain approximately $0.7071$ and zero. The first weight is $e^{0.7071}/(e^{0.7071}+1)\approx0.6698$. With values $(2,0)$ and $(0,4)$, output is approximately $(1.3395,1.3209)$.

## Why the square root appears

Assume each component of $q,k$ has mean zero and variance one, with the independence conditions needed to make products uncorrelated. The dot product is $\sum_{r=1}^{d_k}q_rk_r$. Each product has mean zero and variance one; summing uncorrelated products gives variance $d_k$. Division by $\sqrt{d_k}$ gives variance one. This is an initialization-scale argument. Trained queries and keys need not satisfy those assumptions exactly.

Large score gaps make softmax nearly one-hot, which can make its score derivatives small. Scaling reduces this saturation tendency at initialization. It does not guarantee numerical stability on arbitrary data; stable normalization and suitable precision are still required.

## Why use three projections

A token can ask one kind of question, advertise another matching description, and provide different content. Independent projections let those roles differ. If $Q=K$ before masking, $QK^\top$ is symmetric, but row-normalized attention need not be symmetric because row denominators differ. With separate projections, scores need not even be symmetric.

The code computes both vectorized and explicit-loop attention. It uses distinct value width to reinforce that matching width and content width are independent choices. A successful agreement checks implementation against this definition. It does not establish that a random set of projections has learned useful language relationships.

Optional application: rescale both queries and keys by two. Scores grow by four, so attention sharpens. Rescaling values by two instead doubles outputs while leaving weights unchanged. These interventions distinguish addressing from content.

### Check scaling assumptions rather than memorizing a constant

Suppose independent coordinates instead have $\operatorname{Var}(q_r)=\sigma_q^2$ and $\operatorname{Var}(k_r)=\sigma_k^2$, both mean zero. Then each product has variance $\sigma_q^2\sigma_k^2$, so the dot product variance is $d_k\sigma_q^2\sigma_k^2$. Division by $\sqrt{d_k}$ leaves variance $\sigma_q^2\sigma_k^2$, not necessarily one. Learned projections, normalization, and correlations determine the actual distribution. This calculation explains both why the square root is sensible and why it is not a universal cure for arbitrary activation scales.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention, softmax
query = np.array([[1., 0.], [0., 1.]])
key = np.array([[1., 0.], [0., 1.], [1., 1.]])
value = np.array([[2., 0., 1.], [0., 4., -1.], [1., 1., 0.]])
output, weights = attention(query, key, value)
manual = []
for row in query:
    scores = np.array([sum(row[d] * slot[d] for d in range(2)) / np.sqrt(2) for slot in key])
    manual.append(softmax(scores) @ value)
assert np.allclose(output, manual)
assert np.allclose(weights.sum(axis=-1), 1)
print('weights', weights, 'output', output)

```

### Code structure and observed intermediate values


#### Stage 3

```python
query = np.array([[1., 0.], [0., 1.]])
```

An observed state during this stage was:

- `query`: `[[1. 0.]  [0. 1.]]`

#### Stage 4

```python
key = np.array([[1., 0.], [0., 1.], [1., 1.]])
```

An observed state during this stage was:

- `key`: `[[1. 0.]  [0. 1.]  [1. 1.]]`

#### Stage 5

```python
value = np.array([[2., 0., 1.], [0., 4., -1.], [1., 1., 0.]])
```

An observed state during this stage was:

- `value`: `[[ 2.  0.  1.]  [ 0.  4. -1.]  [ 1.  1.  0.]]`

#### Stage 6

```python
output, weights = attention(query, key, value)
```

An observed state during this stage was:

- `output`: `[[ 1.20334  1.19222  0.20334]  [ 0.79666  2.00556 -0.20334]]`
- `weights`: `[[0.40111 0.19778 0.40111]  [0.19778 0.40111 0.40111]]`

#### Stage 7

```python
manual = []
```

An observed state during this stage was:

- `manual`: `[]`

#### Stage 8

```python
for row in query:
    scores = np.array([sum(row[d] * slot[d] for d in range(2)) / np.sqrt(2) for slot in key])
    manual.append(softmax(scores) @ value)
```

An observed state during this stage was:

- `manual`: `[array([1.20333628, 1.19221535, 0.20333628]), array([ 0.79666372,  2.00556046, -0.20333628])]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 9

```python
assert np.allclose(output, manual)
```

#### Stage 10

```python
assert np.allclose(weights.sum(axis=-1), 1)
```

#### Stage 11

```python
print('weights', weights, 'output', output)
```

Run from the course root:

```bash
python code/12_scaled_dot_product_attention.py
```

### Recorded output from the supplied environment

```text
weights [[0.40111209 0.19777581 0.40111209]
 [0.19777581 0.40111209 0.40111209]] output [[ 1.20333628  1.19221535  0.20333628]
 [ 0.79666372  2.00556046 -0.20333628]]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

The log-normalizer of a scaled two-key attention row, exposing its sensitivity.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(e^{\frac{\sqrt{2} x}{2}} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{2 \left(e^{\frac{\sqrt{2} x}{2}} + 1\right)}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{\frac{\sqrt{2} x}{2}}}{2 \left(e^{\frac{\sqrt{2} x}{2}} + 1\right)} - \frac{e^{\sqrt{2} x}}{2 \left(e^{\frac{\sqrt{2} x}{2}} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.5 | 0.885468167 | 0.415410385 | 0.121173712 |
| 0.7 | 0.970951937 | 0.439309642 | 0.117645865 |
| 0.9 | 1.06113831 | 0.462404235 | 0.113151494 |

#### Evaluation 1: substitute $x=0.5$

$$f(0.5)=\log{\left(1 + e^{\frac{\sqrt{2}}{4}} \right)}\approx 0.885468167.$$
At this coordinate the slope is $0.415410385$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.121173712$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000415410385$. The quadratic correction is $f^{(2)}(x)h^2/2\approx6.05868561e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00041547097$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.7$

$$f(0.7)=\log{\left(1 + e^{\frac{7 \sqrt{2}}{20}} \right)}\approx 0.970951937.$$
At this coordinate the slope is $0.439309642$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.117645865$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000439309642$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5.88229327e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000439368461$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.9$

$$f(0.9)=\log{\left(1 + e^{\frac{9 \sqrt{2}}{20}} \right)}\approx 1.06113831.$$
At this coordinate the slope is $0.462404235$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.113151494$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000462404235$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5.65757468e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000462460807$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.4392760274 | 3.3614e-05 |
| 0.01 | 0.4393093054 | 3.3629e-07 |
| 0.001 | 0.4393096383 | 3.3629e-09 |
| 0.0001 | 0.4393096416 | 3.327e-11 |
| 1e-05 | 0.4393096417 | 5.1875e-13 |
| 1e-06 | 0.4393096417 | 3.8339e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{4 \left(e^{\frac{\sqrt{2} x}{2}} + 1\right)} - \frac{3 \sqrt{2} e^{\sqrt{2} x}}{4 \left(e^{\frac{\sqrt{2} x}{2}} + 1\right)^{2}} + \frac{\sqrt{2} e^{\frac{3 \sqrt{2} x}{2}}}{2 \left(e^{\frac{\sqrt{2} x}{2}} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.885468167 | 0.883090009 | 0.885442926 | 2.5242e-05 |
| -0.1 | 0.927612463 | 0.927020973 | 0.927609202 | 3.2605e-06 |
| 0.1 | 1.01546767 | 1.0148829 | 1.01547113 | 3.4623e-06 |
| 0.2 | 1.06113831 | 1.05881387 | 1.06116678 | 2.8468e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: attention](https://aman.ai/primers/attention/)
- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Previous](11-attention-weighted-retrieval.md) · [Index](../README.md) · [Next](13-attention-backpropagation.md)
