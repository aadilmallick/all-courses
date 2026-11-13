# 22. Decoding, temperature, KV caches, and serving

[Previous](21-pretraining-systems.md) · [Index](../README.md) · [Next](23-efficient-attention.md)

**Part:** Training and inference. **Prerequisite:** read lessons 01–21 in order, or verify the earlier definitions used here.

## A distribution still needs a decision rule

Given logits $z$, temperature sampling uses $p_i\propto e^{z_i/\tau}$ for $\tau>0$. Higher temperature usually flattens a fixed distribution; lower temperature sharpens it. It changes the decoding distribution without changing model weights. The zero-temperature limit with a unique maximum is greedy decoding; code should handle greedy selection explicitly instead of dividing by zero.

Top-$k$ retains the $k$ largest logits and renormalizes. Nucleus sampling retains a smallest high-probability prefix whose cumulative probability reaches a chosen threshold, under a specified tie convention. Apply the threshold to a clearly defined distribution, normally after temperature. Different operation orders can produce different samples.

Beam search maintains several promising prefixes under a scoring rule. Raw log-probability often favors shorter completed sequences because every added term is nonpositive. Length penalties change that objective. More search does not automatically improve factual accuracy or human preference.

## Why cache keys and values

For a causal decoder, an earlier token's hidden state does not change when a future token is appended, provided positions, masks, and all other inputs are consistent. Therefore its per-layer keys and values can be reused. A new query attends to cached past keys plus its current key and reads cached values plus its current value.

Prefill processes the initial prompt. Decode processes newly generated tokens. Dense prefill has quadratic attention work in prompt length, while a single new query performs work linear in current context length for its attention read. Caching avoids repeatedly recomputing old projections and states; it does not make attention to history constant cost.

Cache correctness needs layer-specific storage, correct position indices, correct batch identities, and careful handling of branch changes. Reusing a cache for a different prompt or after editing earlier tokens is invalid. Sliding windows require an explicit policy for position and visibility semantics.

## Verify an elementary cache

The experiment compares the final row of a full causal attention operation with a one-query attention operation over all saved keys and values. It checks the exact local equality underlying caching. It is not a full cached implementation of `TinyGPT`, whose multiple sublayers would each need consistent cached states.

Serving systems also balance batch size, queueing, prompt length, output length, and memory bandwidth. Time to first token and throughput measure different experiences. Report prompt/output distributions and hardware alongside a speed result; tokens per second without workload context is incomplete.

Optional application: run two different prompts with the same token count. Demonstrate that reusing the first prompt's keys for the second changes the output. Equal shapes do not imply a valid cache identity.

### Derive the key/value cache byte count

For $L=24,B=1,G=4,T=4096,d=64$ and two-byte elements, keys and values require $2\cdot24\cdot1\cdot4\cdot4096\cdot64\cdot2=100{,}663{,}296$ bytes, or 96 MiB. This excludes allocator overhead, alignment, other activations, and model weights. If batch grows to eight, this ideal cache grows to 768 MiB. If context doubles, it doubles again. Beam or speculative branches may share some prefixes but require explicit storage management; multiplying every branch's full history can overestimate or underestimate an actual system depending on sharing.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention, softmax
rng = np.random.default_rng(22)
q, k, v = [rng.normal(size=(5, 4)) for _ in range(3)]
full, _ = attention(q, k, v, np.tril(np.ones((5, 5), dtype=bool)))
last, _ = attention(q[-1:], k, v)
assert np.allclose(full[-1], last[0])
logits = np.array([1., 0.2, -0.7, 0.5])
keep = np.argsort(logits)[-2:]
filtered = np.full_like(logits, -np.inf)
filtered[keep] = logits[keep]
probability = softmax(filtered / 0.7)
assert np.count_nonzero(probability) == 2
print('cached last row', last, 'top-k probability', probability)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(22)
```

#### Stage 4

```python
q, k, v = [rng.normal(size=(5, 4)) for _ in range(3)]
```

An observed state during this stage was:

- `q`: `[[-1.39762 -1.20401 -1.30227 -0.62269]  [ 1.44728 -1.60131  0.94397  1.26247]  [-0.35546 -0.70094  0.47211  1.21456]  [ 2.15553  0.89181  1.59384 -0.45029]  [-0.87422 -1.71977 -1.1537  -0.36343]]`
- `k`: `[[ 0.19299 -1.3131   0.81609 -0.10305]  [-0.6422  -0.76529  2.02069  0.16923]  [-0.89793 -0.95398  1.83782 -0.57835]  [ 1.1887   1.42327 -2.3244   1.35097]  [-0.20843 -1.08413 -0.54384  0.5609 ]]`
- `v`: `[[ 0.37398  0.42551 -0.7249   1.27908]  [ 1.50213  1.83406  1.00046  1.89431]  [ 2.09393  0.70426  0.88116  0.58221]  [ 0.55142  0.86324 -1.70898 -0.3238 ]  [ 0.48786 -2.10733 -1.44184  1.5845 ]]`

#### Stage 5

```python
full, _ = attention(q, k, v, np.tril(np.ones((5, 5), dtype=bool)))
```

An observed state during this stage was:

- `full`: `[[ 0.37398  0.42551 -0.7249   1.27908]  [ 0.85336  1.02405  0.00826  1.54051]  [ 1.35333  1.10664  0.47598  1.33931]  [ 1.19825  1.03707  0.0937   1.07032]  [ 0.831   -0.47165 -0.66982  1.25173]]`

#### Stage 6

```python
last, _ = attention(q[-1:], k, v)
```

An observed state during this stage was:

- `last`: `[[ 0.831   -0.47165 -0.66982  1.25173]]`

#### Stage 7

```python
assert np.allclose(full[-1], last[0])
```

#### Stage 8

```python
logits = np.array([1., 0.2, -0.7, 0.5])
```

An observed state during this stage was:

- `logits`: `[ 1.   0.2 -0.7  0.5]`

#### Stage 9

```python
keep = np.argsort(logits)[-2:]
```

An observed state during this stage was:

- `keep`: `[3 0]`

#### Stage 10

```python
filtered = np.full_like(logits, -np.inf)
```

An observed state during this stage was:

- `filtered`: `[-inf -inf -inf -inf]`

#### Stage 11

```python
filtered[keep] = logits[keep]
```

An observed state during this stage was:

- `filtered`: `[ 1.  -inf -inf  0.5]`

#### Stage 12

```python
probability = softmax(filtered / 0.7)
```

An observed state during this stage was:

- `probability`: `[0.67135 0.      0.      0.32865]`

#### Stage 13

```python
assert np.count_nonzero(probability) == 2
```

#### Stage 14

```python
print('cached last row', last, 'top-k probability', probability)
```

Run from the course root:

```bash
python code/22_decoding_kv_cache.py
```

### Recorded output from the supplied environment

```text
cached last row [[ 0.83100195 -0.47165109 -0.66982414  1.25173382]] top-k probability [0.67134745 0.         0.         0.32865255]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A temperature-scaled binary log-normalizer; temperature changes both probabilities and sensitivity.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(e^{\frac{10 x}{7}} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{10 e^{\frac{10 x}{7}}}{7 \left(e^{\frac{10 x}{7}} + 1\right)}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{100 e^{\frac{10 x}{7}}}{49 \left(e^{\frac{10 x}{7}} + 1\right)} - \frac{100 e^{\frac{20 x}{7}}}{49 \left(e^{\frac{10 x}{7}} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.1 | 0.767124606 | 0.76521953 | 0.507609828 |
| 0.3 | 0.930218492 | 0.86504641 | 0.487475294 |
| 0.5 | 1.11275418 | 0.959067791 | 0.450285817 |

#### Evaluation 1: substitute $x=0.1$

$$f(0.1)=\log{\left(1 + e^{\frac{1}{7}} \right)}\approx 0.767124606.$$
At this coordinate the slope is $0.76521953$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.507609828$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00076521953$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.53804914e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000765473326$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.3$

$$f(0.3)=\log{\left(1 + e^{\frac{3}{7}} \right)}\approx 0.930218492.$$
At this coordinate the slope is $0.86504641$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.487475294$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00086504641$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.43737647e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000865290123$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.5$

$$f(0.5)=\log{\left(1 + e^{\frac{5}{7}} \right)}\approx 1.11275418.$$
At this coordinate the slope is $0.959067791$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.450285817$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000959067791$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.25142908e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000959292897$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.8648019023 | 0.00024451 |
| 0.01 | 0.8650439606 | 2.4497e-06 |
| 0.001 | 0.8650463858 | 2.4497e-08 |
| 0.0001 | 0.8650464101 | 2.45e-10 |
| 1e-05 | 0.8650464103 | 7.4851e-13 |
| 1e-06 | 0.8650464102 | 8.9566e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{1000 e^{\frac{10 x}{7}}}{343 \left(e^{\frac{10 x}{7}} + 1\right)} - \frac{3000 e^{\frac{20 x}{7}}}{343 \left(e^{\frac{10 x}{7}} + 1\right)^{2}} + \frac{2000 e^{\frac{30 x}{7}}}{343 \left(e^{\frac{10 x}{7}} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.767124606 | 0.75720921 | 0.766958716 | 0.00016589 |
| -0.1 | 0.846173885 | 0.843713851 | 0.846151228 | 2.2657e-05 |
| 0.1 | 1.01913427 | 1.01672313 | 1.01916051 | 2.6244e-05 |
| 0.2 | 1.11275418 | 1.10322777 | 1.11297728 | 0.0002231 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: attention](https://aman.ai/primers/attention/)

[Previous](21-pretraining-systems.md) · [Index](../README.md) · [Next](23-efficient-attention.md)
