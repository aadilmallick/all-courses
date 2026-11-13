# 23. Exact online attention, sparse patterns, and linear alternatives

[Previous](22-decoding-kv-cache.md) · [Index](../README.md) · [Next](24-long-context.md)

**Part:** Training and inference. **Prerequisite:** read lessons 01–22 in order, or verify the earlier definitions used here.

## Separate arithmetic from memory traffic

Dense attention computes every query-key interaction. A naive implementation also stores all scores or probabilities. FlashAttention-style algorithms reorganize exact attention using tiles and online normalization, avoiding large intermediate writes. They do not generally change dense attention's quadratic arithmetic complexity. Floating-point operation order may change rounding.

For one query with scores $s_j$, the output is $\sum_j e^{s_j}v_j/\sum_j e^{s_j}$. Maintain a running maximum $m$, normalizer $l$, and unnormalized output accumulator $u$. On a new score block with maximum $m_b$, set $m'=\max(m,m_b)$ and update

$$l'=e^{m-m'}l+\sum_{j\in b}e^{s_j-m'},\qquad
u'=e^{m-m'}u+\sum_{j\in b}e^{s_j-m'}v_j.$$

The rescaling converts the old accumulator from reference maximum $m$ to $m'$. After all blocks, output $u/l$. These identities follow by factoring the same exponential constant from numerator and denominator. Our CPU loop demonstrates the algebra, not a fast GPU kernel.

## Sparse attention changes the connectivity

A sliding window of width $w$ lets each query read nearby positions, reducing score work to roughly $O(Twd)$ for fixed $w$. Global tokens, dilation, or learned selection can add long-range paths. Multiple layers can propagate information farther than one window, but this does not make sparse and dense attention identical.

Low-rank sequence compression assumes useful attention can be approximated through a lower-dimensional sequence representation. That assumption can fail for tasks requiring many distinct precise references. Approximation quality must be measured on the intended workload.

## Linear attention changes the kernel

If similarity has form $\phi(q)^\top\phi(k)$, reassociate sums:

$$o_i=\frac{\phi(q_i)^\top\left(\sum_j\phi(k_j)v_j^\top\right)}{\phi(q_i)^\top\left(\sum_j\phi(k_j)\right)}.$$

This avoids a full score matrix when feature-map dimension is manageable. Causal versions maintain prefix accumulators. The denominator needs positivity or other stability treatment. Ordinary softmax attention cannot simply be reassociated this way because exponentiating a dot product is not a finite ordinary dot product without a feature representation or approximation.

## Pick the property you need to preserve

Exact tiled attention preserves the mathematical operation. Sparse patterns preserve selected edges. Kernel methods preserve or approximate another similarity representation. State-space and recurrent alternatives use another computation structure. Compare quality, memory, wall time, precision, and supported masks rather than calling all of them the same efficiency trick.

The experiment checks online normalization against a direct stable softmax read, including extreme scores. A correct output equality is the key numerical invariant before considering performance.

### Verify online rescaling with two scores

Take scores 1000 and 1001 with scalar values two and four. After the first item, use maximum 1000, normalizer one, and accumulator two. On the second item, new maximum is 1001. Rescale the old contribution by $e^{-1}$, giving normalizer $e^{-1}+1$ and accumulator $2e^{-1}+4$. Their ratio equals direct softmax attention. Exponentiating 1001 directly would overflow ordinary floating-point formats, but exponentiating zero and minus one is safe. The algorithm's stability follows from changing the reference scale consistently in both numerator and denominator.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax
scores = np.array([1000., 999., 1002., 998., 1001.])
values = np.arange(15, dtype=float).reshape(5, 3)
maximum, normalizer, accumulator = -np.inf, 0.0, np.zeros(3)
for start in range(0, len(scores), 2):
    block = scores[start:start+2]
    next_max = max(maximum, block.max())
    rescale = np.exp(maximum-next_max)
    weights = np.exp(block-next_max)
    accumulator = rescale*accumulator + weights @ values[start:start+2]
    normalizer = rescale*normalizer + weights.sum()
    maximum = next_max
online = accumulator / normalizer
direct = softmax(scores) @ values
assert np.allclose(online, direct)
print('online', online, 'direct', direct)

```

### Code structure and observed intermediate values


#### Stage 3

```python
scores = np.array([1000., 999., 1002., 998., 1001.])
```

An observed state during this stage was:

- `scores`: `[1000.  999. 1002.  998. 1001.]`

#### Stage 4

```python
values = np.arange(15, dtype=float).reshape(5, 3)
```

An observed state during this stage was:

- `values`: `[[ 0.  1.  2.]  [ 3.  4.  5.]  [ 6.  7.  8.]  [ 9. 10. 11.]  [12. 13. 14.]]`

#### Stage 5

```python
maximum, normalizer, accumulator = -np.inf, 0.0, np.zeros(3)
```

An observed state during this stage was:

- `maximum`: `-inf`
- `normalizer`: `0`
- `accumulator`: `[0. 0. 0.]`

#### Stage 6

```python
for start in range(0, len(scores), 2):
    block = scores[start:start+2]
    next_max = max(maximum, block.max())
    rescale = np.exp(maximum-next_max)
    weights = np.exp(block-next_max)
    accumulator = rescale*accumulator + weights @ values[start:start+2]
    normalizer = rescale*normalizer + weights.sum()
    maximum = next_max
```

An observed state during this stage was:

- `normalizer`: `1.5713174`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 7

```python
online = accumulator / normalizer
```

An observed state during this stage was:

- `online`: `[6.82787 7.82787 8.82787]`

#### Stage 8

```python
direct = softmax(scores) @ values
```

An observed state during this stage was:

- `direct`: `[6.82787 7.82787 8.82787]`

#### Stage 9

```python
assert np.allclose(online, direct)
```

#### Stage 10

```python
print('online', online, 'direct', direct)
```

Run from the course root:

```bash
python code/23_efficient_attention.py
```

### Recorded output from the supplied environment

```text
online [6.82787261 7.82787261 8.82787261] direct [6.82787261 7.82787261 8.82787261]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A softmax log-normalizer whose exact value is independent of the tiling order in real arithmetic.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(e^{x} + e^{-1} + e \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{e^{x}}{e^{x} + e^{-1} + e}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{x}}{e^{x} + e^{-1} + e} - \frac{e^{2 x}}{\left(e^{x} + e^{-1} + e\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.2 | 1.46037255 | 0.28354837 | 0.203148692 |
| 0.4 | 1.52125916 | 0.325869216 | 0.21967847 |
| 0.6 | 1.59092359 | 0.371233665 | 0.233419231 |

#### Evaluation 1: substitute $x=0.2$

$$f(0.2)=\log{\left(e^{-1} + e^{\frac{1}{5}} + e \right)}\approx 1.46037255.$$
At this coordinate the slope is $0.28354837$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.203148692$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00028354837$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.01574346e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000283649959$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.4$

$$f(0.4)=\log{\left(e^{-1} + e^{\frac{2}{5}} + e \right)}\approx 1.52125916.$$
At this coordinate the slope is $0.325869216$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.21967847$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000325869216$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.09839235e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000325979068$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.6$

$$f(0.6)=\log{\left(e^{-1} + e^{\frac{3}{5}} + e \right)}\approx 1.59092359.$$
At this coordinate the slope is $0.371233665$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.233419231$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000371233665$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.16709616e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000371350385$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.325996621 | 0.00012741 |
| 0.01 | 0.325870491 | 1.2751e-06 |
| 0.001 | 0.3258692287 | 1.2751e-08 |
| 0.0001 | 0.325869216 | 1.271e-10 |
| 1e-05 | 0.3258692159 | 3.8657e-12 |
| 1e-06 | 0.3258692159 | 2.607e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{x}}{e^{x} + e^{-1} + e} - \frac{3 e^{2 x}}{\left(e^{x} + e^{-1} + e\right)^{2}} + \frac{2 e^{3 x}}{\left(e^{x} + e^{-1} + e\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 1.46037255 | 1.45608531 | 1.46047888 | 0.00010633 |
| -0.1 | 1.4897576 | 1.48867223 | 1.48977063 | 1.3032e-05 |
| 0.1 | 1.55495692 | 1.55384608 | 1.55494447 | 1.2449e-05 |
| 0.2 | 1.59092359 | 1.586433 | 1.59082657 | 9.702e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: attention](https://aman.ai/primers/attention/)
- [Aman.ai: LLM](https://aman.ai/primers/LLM/)

[Previous](22-decoding-kv-cache.md) · [Index](../README.md) · [Next](24-long-context.md)
