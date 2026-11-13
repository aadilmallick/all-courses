# 15. Multi-head, multi-query, and grouped-query attention

[Previous](14-attention-masks.md) · [Index](../README.md) · [Next](16-position-rope.md)

**Part:** Transformer construction. **Prerequisite:** read lessons 01–14 in order, or verify the earlier definitions used here.

## Several learned reads in parallel

A single head produces one weighted combination for each query. Multiple heads use separate projections, allowing different compatibility spaces and value mixtures. For head $h$, compute $O_h=\operatorname{Attention}(XW_Q^h,XW_K^h,XW_V^h)$, concatenate the results, and apply output projection $W_O$.

With total width $D$ and $H$ heads, a common choice is $d=D/H$. Each head's score scale is $\sqrt d$, not $\sqrt D$. Concatenation reconstructs width $D$; it is not averaging heads. $W_O$ can mix their channels after the separate reads.

## Derive the tensor transformations

A projected array starts at $(B,T,D)$. Reshape it to $(B,T,H,d)$, then transpose to $(B,H,T,d)$. Multiplication by transposed keys produces $(B,H,T,T)$. Multiplying weights by values returns $(B,H,T,d)$. Transpose back to $(B,T,H,d)$ before flattening heads. These operations change indexing but introduce no learned parameters.

One can implement all head projections as a single matrix because selecting slices of its output is equivalent to separate matrices concatenated along columns. The separate attention normalizations remain essential; combining all heads into one softmax would be a different model.

## Why share keys and values

During autoregressive decoding, past keys and values are cached. Multi-query attention uses $H$ query heads but one key and one value head. Grouped-query attention uses an intermediate number $G$ of key/value heads, with $G$ dividing $H$. Each group of $H/G$ query heads shares keys and values.

For $L$ layers, batch $B$, context $T$, key/value width $d$, and element size $b$ bytes, cache size is approximately $2LBGTdb$. The factor two stores keys and values. With $G=H$, this is ordinary multi-head caching; with $G=1$, the cache can be much smaller. Model architecture and training must support the sharing; simply dropping cache heads is not an equivalent conversion.

Active arithmetic, memory capacity, and bandwidth are separate constraints. Fewer key/value heads reduce cache traffic, but projection costs and kernel behavior also matter. A smaller asymptotic memory formula does not alone predict measured latency.

## Implementation boundary

The code expands grouped keys/values into query-head order to express the mathematics clearly. An efficient kernel may avoid physically copying them. The assertion compares one group against its corresponding individual query head. Head order is contiguous within each group in this example; a different mapping requires a different repeat or indexing operation.

Optional application: compare cache bytes for $H=8$ and $G=2$ with all other quantities fixed. The key/value cache ratio is four, while the query-head count remains eight. This is a memory statement, not a claim of fourfold end-to-end speedup.

### Count projection parameters explicitly

With full width $D$, ordinary query, key, value, and output matrices each have $D^2$ parameters when biases are omitted, totaling $4D^2$. Splitting into heads changes indexing, not this total under the standard fixed-width design. With $H$ query heads, $G$ key/value heads, and per-head width $d=D/H$, query and output still cost $D^2$ each, while key and value each cost $DGd$. Total is $2D^2+2DGd$. This count excludes feed-forward layers and normalization. It makes clear which weights GQA changes and which costs remain.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention
rng = np.random.default_rng(15)
batch, heads, groups, tokens, width = 1, 4, 2, 3, 2
q = rng.normal(size=(batch, heads, tokens, width))
k = rng.normal(size=(batch, groups, tokens, width))
v = rng.normal(size=(batch, groups, tokens, width))
expanded_k = np.repeat(k, heads // groups, axis=1)
expanded_v = np.repeat(v, heads // groups, axis=1)
output, _ = attention(q, expanded_k, expanded_v)
individual, _ = attention(q[:, 2], k[:, 1], v[:, 1])
assert np.allclose(output[:, 2], individual)
print('output shape', output.shape, 'cache head ratio', heads / groups)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(15)
```

#### Stage 4

```python
batch, heads, groups, tokens, width = 1, 4, 2, 3, 2
```

An observed state during this stage was:

- `batch`: `1`
- `heads`: `4`
- `groups`: `2`
- `tokens`: `3`

#### Stage 5

```python
q = rng.normal(size=(batch, heads, tokens, width))
```

An observed state during this stage was:

- `q`: `array shape=(1, 4, 3, 2), min=-1.56054, max=2.09408, norm=4.88392`

#### Stage 6

```python
k = rng.normal(size=(batch, groups, tokens, width))
```

An observed state during this stage was:

- `k`: `[[[[ 1.44331 -0.6133 ]    [ 0.07777 -0.81298]    [-0.42233 -2.27945]]    [[ 0.73884 -0.72261]    [-0.0727   0.44573]    [ 0.33909 -1.31423]]]]`

#### Stage 7

```python
v = rng.normal(size=(batch, groups, tokens, width))
```

An observed state during this stage was:

- `v`: `[[[[ 1.51817  0.75731]    [ 0.50014 -0.6596 ]    [-1.60428 -1.63016]]    [[-0.20842  0.16067]    [-0.70336  1.82945]    [ 0.30114  0.99852]]]]`

#### Stage 8

```python
expanded_k = np.repeat(k, heads // groups, axis=1)
```

An observed state during this stage was:

- `expanded_k`: `array shape=(1, 4, 3, 2), min=-2.27945, max=1.44331, norm=4.81969`

#### Stage 9

```python
expanded_v = np.repeat(v, heads // groups, axis=1)
```

An observed state during this stage was:

- `expanded_v`: `array shape=(1, 4, 3, 2), min=-1.63016, max=1.82945, norm=5.25228`

#### Stage 10

```python
output, _ = attention(q, expanded_k, expanded_v)
```

An observed state during this stage was:

- `output`: `array shape=(1, 4, 3, 2), min=-1.36305, max=1.36203, norm=3.69332`

#### Stage 11

```python
individual, _ = attention(q[:, 2], k[:, 1], v[:, 1])
```

An observed state during this stage was:

- `individual`: `[[[-0.23802  1.0143 ]   [-0.45954  1.32248]   [-0.48961  1.36203]]]`

#### Stage 12

```python
assert np.allclose(output[:, 2], individual)
```

#### Stage 13

```python
print('output shape', output.shape, 'cache head ratio', heads / groups)
```

Run from the course root:

```bash
python code/15_multihead_gqa.py
```

### Recorded output from the supplied environment

```text
output shape (1, 4, 3, 2) cache head ratio 2.0
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

One head log-normalizer; separate heads normalize separately before recombination.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(e^{\frac{\sqrt{2} x}{2}} + e^{- \frac{\sqrt{2} x}{2}} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{\frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{2} - \frac{\sqrt{2} e^{- \frac{\sqrt{2} x}{2}}}{2}}{e^{\frac{\sqrt{2} x}{2}} + e^{- \frac{\sqrt{2} x}{2}}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{\left(- \frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{2} + \frac{\sqrt{2} e^{- \frac{\sqrt{2} x}{2}}}{2}\right) \left(\frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{2} - \frac{\sqrt{2} e^{- \frac{\sqrt{2} x}{2}}}{2}\right)}{\left(e^{\frac{\sqrt{2} x}{2}} + e^{- \frac{\sqrt{2} x}{2}}\right)^{2}} + \frac{\frac{e^{\frac{\sqrt{2} x}{2}}}{2} + \frac{e^{- \frac{\sqrt{2} x}{2}}}{2}}{e^{\frac{\sqrt{2} x}{2}} + e^{- \frac{\sqrt{2} x}{2}}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.1 | 0.6956451 | 0.049916833 | 0.49750831 |
| 0.3 | 0.715480428 | 0.147789776 | 0.478158182 |
| 0.5 | 0.754386917 | 0.240079085 | 0.442362033 |

#### Evaluation 1: substitute $x=0.1$

$$f(0.1)=\log{\left(e^{- \frac{\sqrt{2}}{20}} + e^{\frac{\sqrt{2}}{20}} \right)}\approx 0.6956451.$$
At this coordinate the slope is $0.049916833$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.49750831$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx4.9916833e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.48754155e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $5.01655789e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.3$

$$f(0.3)=\log{\left(e^{- \frac{3 \sqrt{2}}{20}} + e^{\frac{3 \sqrt{2}}{20}} \right)}\approx 0.715480428.$$
At this coordinate the slope is $0.147789776$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.478158182$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000147789776$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.39079091e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000148028831$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.5$

$$f(0.5)=\log{\left(e^{- \frac{\sqrt{2}}{4}} + e^{\frac{\sqrt{2}}{4}} \right)}\approx 0.754386917.$$
At this coordinate the slope is $0.240079085$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.442362033$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000240079085$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.21181016e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000240300231$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.1475546587 | 0.00023512 |
| 0.01 | 0.14778742 | 2.3555e-06 |
| 0.001 | 0.147789752 | 2.3556e-08 |
| 0.0001 | 0.1477897753 | 2.3456e-10 |
| 1e-05 | 0.1477897755 | 1.9207e-12 |
| 1e-06 | 0.1477897754 | 1.7016e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\left(- \sqrt{2} e^{\frac{\sqrt{2} x}{2}} + \sqrt{2} e^{- \frac{\sqrt{2} x}{2}}\right) \left(- \frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{2} + \frac{\sqrt{2} e^{- \frac{\sqrt{2} x}{2}}}{2}\right) \left(\frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{2} - \frac{\sqrt{2} e^{- \frac{\sqrt{2} x}{2}}}{2}\right)}{\left(e^{\frac{\sqrt{2} x}{2}} + e^{- \frac{\sqrt{2} x}{2}}\right)^{3}} + \frac{2 \left(- \frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{2} + \frac{\sqrt{2} e^{- \frac{\sqrt{2} x}{2}}}{2}\right) \left(\frac{e^{\frac{\sqrt{2} x}{2}}}{2} + \frac{e^{- \frac{\sqrt{2} x}{2}}}{2}\right)}{\left(e^{\frac{\sqrt{2} x}{2}} + e^{- \frac{\sqrt{2} x}{2}}\right)^{2}} + \frac{\frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{4} - \frac{\sqrt{2} e^{- \frac{\sqrt{2} x}{2}}}{4}}{e^{\frac{\sqrt{2} x}{2}} + e^{- \frac{\sqrt{2} x}{2}}} + \frac{\left(\frac{\sqrt{2} e^{\frac{\sqrt{2} x}{2}}}{2} - \frac{\sqrt{2} e^{- \frac{\sqrt{2} x}{2}}}{2}\right) \left(- \frac{e^{\frac{\sqrt{2} x}{2}}}{2} - \frac{e^{- \frac{\sqrt{2} x}{2}}}{2}\right)}{\left(e^{\frac{\sqrt{2} x}{2}} + e^{- \frac{\sqrt{2} x}{2}}\right)^{2}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.6956451 | 0.685922473 | 0.695485637 | 0.00015946 |
| -0.1 | 0.703114024 | 0.700701451 | 0.703092242 | 2.1782e-05 |
| 0.1 | 0.732624956 | 0.730259406 | 0.732650197 | 2.5241e-05 |
| 0.2 | 0.754386917 | 0.745038383 | 0.754601547 | 0.00021463 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: attention](https://aman.ai/primers/attention/)
- [Aman.ai: LLM](https://aman.ai/primers/LLM/)

[Previous](14-attention-masks.md) · [Index](../README.md) · [Next](16-position-rope.md)
