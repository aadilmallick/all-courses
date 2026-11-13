# 29. Mixture-of-experts routing, capacity, and balancing

[Previous](28-quantization-qlora.md) · [Index](../README.md) · [Next](30-knowledge-distillation.md)

**Part:** Adaptation and compression. **Prerequisite:** read lessons 01–28 in order, or verify the earlier definitions used here.

## Conditional computation separates capacity from active work

A dense feed-forward sublayer applies all its weights to each token. A sparse mixture-of-experts layer chooses a small number of expert networks per token. A router maps hidden vector $x$ to logits $r=xW_r$, probabilities $p=\operatorname{softmax}(r)$, and selected expert IDs. The output combines selected expert results under a stated weighting rule.

For selected set $S(x)$, one convention is $y=\sum_{e\in S}\widetilde p_eE_e(x)$ where $\widetilde p$ renormalizes probabilities within the selected set. Another keeps original router probabilities. These define different functions and gradients. In particular, renormalized top-one weight is always one, so the task loss provides no ordinary smooth router-weight gradient through that weight alone. Discrete selection requires other training mechanisms or weighting choices.

## Capacity is a systems constraint

With $N$ tokens, $E$ experts, $k$ selections per token, and capacity factor $c$, a simple per-expert capacity is $\lceil cNk/E\rceil$. This is one convention; implementations differ. If assignments exceed capacity, a system may drop, reroute, or process overflow. Dropping an expert branch can leave the token's residual stream intact while still losing that expert computation.

For $N=8,E=4,k=1,c=1$, capacity is two assignments per expert. If six tokens choose expert zero, four assignments overflow there even though other experts are underused. Total nominal capacity being adequate does not guarantee balanced dispatch.

## Load balancing is not a proof of specialization

A common auxiliary term combines assignment fractions $f_e$ and mean routing probabilities $P_e$ as $E\sum_e f_eP_e$. The discrete assignments are treated according to the method's gradient convention, often with no derivative through argmax. This loss encourages aggregate utilization but does not guarantee meaningful semantic expert specialization or optimal task accuracy.

Router instability, outlier activations, uneven token lengths, and all-to-all communication complicate training. Total parameter count determines weight storage, while active experts influence per-token arithmetic. Communication and expert placement determine much of the practical latency.

The code implements a clearly specified top-one router with original softmax weights, counts capacity overflow without silently changing outputs, and computes a balancing statistic. It is a local mathematical example, not a distributed MoE kernel.

Optional application: set all router logits equal. A deterministic argmax tie rule may send every token to expert zero despite uniform probabilities. This shows why probability balance and actual dispatch balance must both be monitored.

### Top-one normalization can remove a gradient path

If one selected expert's weight is renormalized by the sum over the selected set, it becomes $p_e/p_e=1$. Within a fixed selection region, differentiating that weight with respect to router logits gives zero. Using the original $p_e$ instead retains a smooth magnitude path, while the argmax choice remains discrete. This is a small but important implementation distinction: two snippets both described as top-one MoE can train differently. Router auxiliary losses, noise, and specialized estimators can add other signals, but they must be specified rather than assumed.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax
rng = np.random.default_rng(29)
x = rng.normal(size=(8, 3))
router = rng.normal(size=(3, 4))
experts = rng.normal(size=(4, 3, 3))
probability = softmax(x @ router)
chosen = probability.argmax(axis=1)
output = np.stack([probability[t, e]*(x[t] @ experts[e]) for t, e in enumerate(chosen)])
counts = np.bincount(chosen, minlength=4)
capacity = int(np.ceil(len(x)/4))
overflow = np.maximum(counts-capacity, 0).sum()
fraction = counts/len(x)
balance = 4*np.sum(fraction*probability.mean(axis=0))
print('assignments', counts, 'overflow', overflow, 'balance', balance, 'shape', output.shape)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(29)
```

#### Stage 4

```python
x = rng.normal(size=(8, 3))
```

An observed state during this stage was:

- `x`: `array shape=(8, 3), min=-2.2325, max=2.98252, norm=4.7067`

#### Stage 5

```python
router = rng.normal(size=(3, 4))
```

An observed state during this stage was:

- `router`: `[[ 0.15437 -2.1822  -1.68406  2.19295]  [ 2.74579  0.44635 -0.08028  0.55709]  [-2.03528 -0.53061 -0.40542  1.7355 ]]`

#### Stage 6

```python
experts = rng.normal(size=(4, 3, 3))
```

An observed state during this stage was:

- `experts`: `array shape=(4, 3, 3), min=-2.17675, max=1.7746, norm=5.64996`

#### Stage 7

```python
probability = softmax(x @ router)
```

An observed state during this stage was:

- `probability`: `array shape=(8, 4), min=4.493e-05, max=0.971325, norm=2.07874`

#### Stage 8

```python
chosen = probability.argmax(axis=1)
```

An observed state during this stage was:

- `chosen`: `[1 0 3 1 2 1 3 0]`

#### Stage 9

```python
output = np.stack([probability[t, e]*(x[t] @ experts[e]) for t, e in enumerate(chosen)])
```

An observed state during this stage was:

- `output`: `array shape=(8, 3), min=-2.63846, max=1.61613, norm=4.55495`

#### Stage 10

```python
counts = np.bincount(chosen, minlength=4)
```

An observed state during this stage was:

- `counts`: `[2 3 1 2]`

#### Stage 11

```python
capacity = int(np.ceil(len(x)/4))
```

An observed state during this stage was:

- `capacity`: `2`

#### Stage 12

```python
overflow = np.maximum(counts-capacity, 0).sum()
```

An observed state during this stage was:

- `overflow`: `np.int64(1)`

#### Stage 13

```python
fraction = counts/len(x)
```

An observed state during this stage was:

- `fraction`: `[0.25  0.375 0.125 0.25 ]`

#### Stage 14

```python
balance = 4*np.sum(fraction*probability.mean(axis=0))
```

An observed state during this stage was:

- `balance`: `1.0051255`

#### Stage 15

```python
print('assignments', counts, 'overflow', overflow, 'balance', balance, 'shape', output.shape)
```

Run from the course root:

```bash
python code/29_mixture_of_experts.py
```

### Recorded output from the supplied environment

```text
assignments [2 3 1 2] overflow 1 balance 1.0051254686339979 shape (8, 3)
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A two-expert original-probability weighted top-one branch within a fixed routing region.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{x + 1}{1 + e^{- x}}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{1}{1 + e^{- x}} + \frac{\left(x + 1\right) e^{- x}}{\left(1 + e^{- x}\right)^{2}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \frac{\left(x + 1\right) e^{- x}}{\left(1 + e^{- x}\right)^{2}} + \frac{2 e^{- x}}{\left(1 + e^{- x}\right)^{2}} + \frac{2 \left(x + 1\right) e^{- 2 x}}{\left(1 + e^{- x}\right)^{3}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 0.5 | 0.75 | 0.5 |
| 0.2 | 0.659800797 | 0.846853885 | 0.465429769 |
| 0.4 | 0.838162724 | 0.935052704 | 0.414131333 |

#### Evaluation 1: substitute $x=0$

$$f(0)=\frac{1}{2}\approx 0.5.$$
At this coordinate the slope is $0.75$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.5$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00075$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.5e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000750249979$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=\frac{6}{5 \left(e^{- \frac{1}{5}} + 1\right)}\approx 0.659800797.$$
At this coordinate the slope is $0.846853885$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.465429769$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000846853885$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.32714884e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000847086563$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=\frac{7}{5 \left(e^{- \frac{2}{5}} + 1\right)}\approx 0.838162724.$$
At this coordinate the slope is $0.935052704$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.414131333$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000935052704$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.07065667e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000935259721$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.8464908281 | 0.00036306 |
| 0.01 | 0.8468502497 | 3.6348e-06 |
| 0.001 | 0.8468538482 | 3.6349e-08 |
| 0.0001 | 0.8468538842 | 3.6402e-10 |
| 1e-05 | 0.8468538846 | 4.8611e-12 |
| 1e-06 | 0.8468538845 | 4.927e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\left(x + 1\right) e^{- x}}{\left(1 + e^{- x}\right)^{2}} - \frac{3 e^{- x}}{\left(1 + e^{- x}\right)^{2}} - \frac{6 \left(x + 1\right) e^{- 2 x}}{\left(1 + e^{- x}\right)^{3}} + \frac{6 e^{- 2 x}}{\left(1 + e^{- x}\right)^{3}} + \frac{6 \left(x + 1\right) e^{- 3 x}}{\left(1 + e^{- x}\right)^{4}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.5 | 0.49043002 | 0.499738615 | 0.00026138 |
| -0.1 | 0.577477106 | 0.575115408 | 0.577442557 | 3.4549e-05 |
| 0.1 | 0.746775272 | 0.744486185 | 0.746813334 | 3.8062e-05 |
| 0.2 | 0.838162724 | 0.829171574 | 0.838480169 | 0.00031744 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: mixture-of-experts](https://aman.ai/primers/mixture-of-experts/)

[Previous](28-quantization-qlora.md) · [Index](../README.md) · [Next](30-knowledge-distillation.md)
