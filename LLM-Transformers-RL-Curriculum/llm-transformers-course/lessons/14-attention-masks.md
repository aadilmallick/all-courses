# 14. Causal masks, padding, packed sequences, and batches

[Previous](13-attention-backpropagation.md) · [Index](../README.md) · [Next](15-multihead-gqa.md)

**Part:** Transformer construction. **Prerequisite:** read lessons 01–13 in order, or verify the earlier definitions used here.

## Visibility defines the task

A decoder at position $i$ predicts the token at position $i+1$ using positions no later than $i$. The allowed matrix is $M_{ij}=\mathbf1[j\le i]$. Before softmax, set disallowed scores to negative infinity. Their exponentials become zero, so they contribute neither probability nor output.

Masking after softmax by setting some probabilities to zero generally leaves rows summing to less than one. Renormalization could repair that, but masking logits is simpler and gives the intended definition directly. Using a finite large negative constant is only an approximation; its adequacy depends on score range and precision.

## Distinguish four different masks

A key-padding mask prevents queries from reading padded keys. It need not prevent padded query positions from producing outputs. A loss mask excludes unwanted target positions from the objective. A causal mask hides future keys. A document-boundary mask prevents one packed document from reading another. They solve different problems and may need to be combined.

For token validity $v_j$, document ID $d_j$, and query position $i$, a packed decoder can allow $j$ when $j\le i$, $v_j$ is true, and $d_j=d_i$. Position numbering is a separate choice. Resetting position IDs at document boundaries can be appropriate but does not replace the document mask.

## Prove the no-future-dependence property

In a single causal attention layer, output row $i$ depends only on values and scores from positions $j\le i$. Tokenwise feed-forward and normalization operations do not mix positions. A residual connection preserves the same dependency. By induction over layers, a stack built only from these operations remains independent of future input tokens at row $i$. Positionwise normalization is essential: normalizing across time would break this argument.

This proof assumes the inputs at earlier positions themselves do not contain future information. Preprocessing or incorrectly aligned labels can leak future tokens even if the attention mask is correct.

## Test behavior, not only mask shape

The experiment changes the final value vector by a large amount and checks that earlier outputs are unchanged. It then adds document IDs to show how packed examples remain separated. The last query is intentionally valid so every tested row has at least one visible key.

Left padding requires additional care: a padded query may have no valid earlier keys. You can avoid computing such rows, allow a harmless key and mask their loss, or use a backend's documented handling. Do not assume all-masked rows produce useful zeros; a straightforward softmax gives undefined values.

Optional application: create two packed documents of lengths two and three, alter every token in the first, and check the second document's outputs are unchanged. Check both attention and loss accounting. A causal-only mask would fail the document-isolation test.

### A two-token leakage counterexample

Let values be scalar $(0,10)$ and all unmasked scores zero. Without a causal mask, the first output is five because it reads both tokens equally. With the allowed first row `(True, False)`, its output is zero. Now multiply the original unmasked probabilities by `(1,0)` after softmax: output is still zero in this particular value example, hiding the normalization defect. Change values to $(2,10)$: correct causal output is two, while post-softmax zeroing gives one. A test that uses only zeros can therefore miss a real masking error.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention
rng = np.random.default_rng(14)
q, k, v = [rng.normal(size=(4, 3)) for _ in range(3)]
causal = np.tril(np.ones((4, 4), dtype=bool))
base, weights = attention(q, k, v, causal)
changed = v.copy()
changed[-1] += 100
modified, _ = attention(q, k, changed, causal)
assert np.allclose(base[:-1], modified[:-1])
assert np.allclose(weights[~causal], 0)
document = np.array([0, 0, 1, 1])
packed = causal & (document[:, None] == document[None, :])
_, packed_weights = attention(q, k, v, packed)
assert np.allclose(packed_weights[2:, :2], 0)
print('causal weights', weights, 'packed weights', packed_weights)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(14)
```

#### Stage 4

```python
q, k, v = [rng.normal(size=(4, 3)) for _ in range(3)]
```

An observed state during this stage was:

- `q`: `[[ 0.69552 -0.97947 -1.57349]  [-2.92497 -0.35323  1.24761]  [ 0.03307  0.51184  1.02324]  [-0.88215  2.65229 -0.87691]]`
- `k`: `[[ 0.37355  2.73958 -0.11425]  [ 0.11429 -0.51188  0.33453]  [-2.12668 -0.64681  1.69409]  [ 0.21133 -0.2404   0.37293]]`
- `v`: `[[ 0.41461  0.1521   0.57859]  [-1.6596   0.59126 -0.67353]  [ 0.7858  -0.02125 -0.99818]  [-0.07213 -1.00708  1.01273]]`

#### Stage 5

```python
causal = np.tril(np.ones((4, 4), dtype=bool))
```

An observed state during this stage was:

- `causal`: `[[ True False False False]  [ True  True False False]  [ True  True  True False]  [ True  True  True  True]]`

#### Stage 6

```python
base, weights = attention(q, k, v, causal)
```

An observed state during this stage was:

- `base`: `[[ 0.41461  0.1521   0.57859]  [-1.25718  0.50606 -0.43061]  [ 0.15602  0.16844 -0.30753]  [ 0.40062  0.1434   0.56235]]`
- `weights`: `[[1.      0.      0.      0.     ]  [0.19401 0.80599 0.      0.     ]  [0.39741 0.19721 0.40538 0.     ]  [0.97741 0.00612 0.00782 0.00865]]`

#### Stage 7

```python
changed = v.copy()
```

An observed state during this stage was:

- `changed`: `[[ 0.41461  0.1521   0.57859]  [-1.6596   0.59126 -0.67353]  [ 0.7858  -0.02125 -0.99818]  [-0.07213 -1.00708  1.01273]]`

#### Stage 8

```python
changed[-1] += 100
```

An observed state during this stage was:

- `changed`: `[[ 4.14607e-01  1.52103e-01  5.78588e-01]  [-1.65960e+00  5.91255e-01 -6.73527e-01]  [ 7.85803e-01 -2.12467e-02 -9.98183e-01]  [ 9.99279e+01  9.89929e+01  1.01013e+02]]`

#### Stage 9

```python
modified, _ = attention(q, k, changed, causal)
```

An observed state during this stage was:

- `modified`: `[[ 0.41461  0.1521   0.57859]  [-1.25718  0.50606 -0.43061]  [ 0.15602  0.16844 -0.30753]  [ 1.26569  1.00847  1.42742]]`

#### Stage 10

```python
assert np.allclose(base[:-1], modified[:-1])
```

#### Stage 11

```python
assert np.allclose(weights[~causal], 0)
```

#### Stage 12

```python
document = np.array([0, 0, 1, 1])
```

An observed state during this stage was:

- `document`: `[0 0 1 1]`

#### Stage 13

```python
packed = causal & (document[:, None] == document[None, :])
```

An observed state during this stage was:

- `packed`: `[[ True False False False]  [ True  True False False]  [False False  True False]  [False False  True  True]]`

#### Stage 14

```python
_, packed_weights = attention(q, k, v, packed)
```

An observed state during this stage was:

- `packed_weights`: `[[1.      0.      0.      0.     ]  [0.19401 0.80599 0.      0.     ]  [0.      0.      1.      0.     ]  [0.      0.      0.47491 0.52509]]`

#### Stage 15

```python
assert np.allclose(packed_weights[2:, :2], 0)
```

#### Stage 16

```python
print('causal weights', weights, 'packed weights', packed_weights)
```

Run from the course root:

```bash
python code/14_attention_masks.py
```

### Recorded output from the supplied environment

```text
causal weights [[1.         0.         0.         0.        ]
 [0.19400791 0.80599209 0.         0.        ]
 [0.39740975 0.19721439 0.40537585 0.        ]
 [0.97741014 0.00611523 0.00782393 0.0086507 ]] packed weights [[1.         0.         0.         0.        ]
 [0.19400791 0.80599209 0.         0.        ]
 [0.         0.         1.         0.        ]
 [0.         0.         0.47490765 0.52509235]]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A supervised binary target after unwanted positions have been excluded; masks are held fixed.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- x + \log{\left(e^{x} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=-1 + \frac{e^{x}}{e^{x} + 1}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{e^{2 x}}{\left(e^{x} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.2 | 0.598138869 | -0.450166003 | 0.247516573 |
| 0.4 | 0.513015252 | -0.40131234 | 0.240260746 |
| 0.6 | 0.43748795 | -0.354343694 | 0.22878424 |

#### Evaluation 1: substitute $x=0.2$

$$f(0.2)=- \frac{1}{5} + \log{\left(1 + e^{\frac{1}{5}} \right)}\approx 0.598138869.$$
At this coordinate the slope is $-0.450166003$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000450166003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000450042249$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.4$

$$f(0.4)=- \frac{2}{5} + \log{\left(1 + e^{\frac{2}{5}} \right)}\approx 0.513015252.$$
At this coordinate the slope is $-0.40131234$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.240260746$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00040131234$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.20130373e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000401192217$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.6$

$$f(0.6)=- \frac{3}{5} + \log{\left(1 + e^{\frac{3}{5}} \right)}\approx 0.43748795.$$
At this coordinate the slope is $-0.354343694$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.22878424$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000354343694$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.1439212e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000354229313$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.4013913014 | 7.8962e-05 |
| 0.01 | -0.4013131302 | 7.9035e-07 |
| 0.001 | -0.4013123478 | 7.9035e-09 |
| 0.0001 | -0.40131234 | 7.8994e-11 |
| 1e-05 | -0.4013123399 | 5.9382e-12 |
| 1e-06 | -0.4013123399 | 2.7369e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{3 e^{2 x}}{\left(e^{x} + 1\right)^{2}} + \frac{2 e^{3 x}}{\left(e^{x} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.598138869 | 0.59327772 | 0.598082935 | 5.5934e-05 |
| -0.1 | 0.554355244 | 0.553146486 | 0.55434779 | 7.4544e-06 |
| 0.1 | 0.474076984 | 0.472884018 | 0.474085322 | 8.338e-06 |
| 0.2 | 0.43748795 | 0.432752784 | 0.437557999 | 7.0049e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: attention](https://aman.ai/primers/attention/)
- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Previous](13-attention-backpropagation.md) · [Index](../README.md) · [Next](15-multihead-gqa.md)
