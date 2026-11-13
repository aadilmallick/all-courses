# 21. Pretraining data, scaling, distributed execution, and memory

[Previous](20-train-gpt.md) · [Index](../README.md) · [Next](22-decoding-kv-cache.md)

**Part:** Training and inference. **Prerequisite:** read lessons 01–20 in order, or verify the earlier definitions used here.

## Scale is a resource-allocation problem

A language model's behavior depends on architecture, data, objective, optimization, and compute. Parameter count is only one axis. A large undertrained model may perform worse than a smaller model trained on better or more data. Empirical scaling laws describe fitted trends in particular regimes; they are not universal laws that eliminate experimentation.

Data preparation includes decoding, document boundaries, deduplication, quality filtering, language and domain balance, sensitive-data handling, and contamination checks. Filtering changes the distribution being learned. Repeating a dataset increases optimization steps but does not create independent factual evidence.

## Count memory before launching a job

For $P$ trainable parameters, weights, gradients, optimizer moments, and sometimes master copies each require storage. A simple float32 Adam accounting gives four arrays of four bytes per parameter: weights, gradients, first moment, and second moment, approximately $16P$ bytes before activations and temporary buffers. Mixed-precision accounting differs with implementation. Frozen parameters avoid gradient and optimizer-state storage but still require weights and forward activations.

Activations depend on batch size, sequence length, width, layer count, and attention implementation. A materialized dense attention tensor can require order $BHT^2$ elements per layer. Checkpointing recomputes selected forward operations during backward to trade additional arithmetic for lower retained activation memory.

## Derive accumulation correctly

Suppose microbatch $m$ has $n_m$ valid targets and mean loss $L_m$. The global token-mean objective is $L=\sum_m n_mL_m/\sum_m n_m$. Its gradient is the same weighted combination. Simply averaging microbatch means gives equal weight to microbatches even when their valid-target counts differ.

With equal sizes, divide each microbatch loss by the accumulation count before backward, accumulate gradients, then perform one optimizer step. Clip the accumulated gradient if the goal is to bound the full update. Clipping every microbatch separately defines another procedure.

## Parallelism changes what is shared

Data parallel workers hold model replicas and process different data, then combine gradients. Tensor parallelism partitions operations or weight dimensions within layers. Pipeline parallelism partitions layers and introduces scheduling bubbles. Sharded optimizer and parameter schemes distribute model states. Communication, synchronization, and load imbalance can dominate ideal arithmetic savings.

Sparse MoE adds expert dispatch and all-to-all communication, which later lessons treat separately. A memory estimate that fits on paper can still fail because of fragmentation, kernel workspaces, or peak transient buffers.

The experiment demonstrates weighted gradient accumulation on a scalar regression problem. It deliberately uses unequal microbatches to show why averaging means is wrong. This numerical equality is the local algebra that distributed reduction must preserve.

### A padding imbalance changes the objective

Microbatch A has one valid target with gradient ten; microbatch B has nine valid targets with mean gradient zero. Equal averaging of the two means gives gradient five. The global token mean gives $(1\cdot10+9\cdot0)/10=1$. Both calculations are arithmetically correct for different objectives. If a distributed framework averages worker gradients equally, compensate for unequal valid-target counts when the desired objective is the global token mean. Gradient accumulation is therefore a reduction-design problem before it is a memory optimization.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
inputs = np.array([1., 2., 3., 4., 5.])
targets = np.array([0., 1., 1., 2., 3.])
weight = 0.2
def gradient(x, y):
    return np.mean((weight*x-y)*x)
full = gradient(inputs, targets)
first, second = gradient(inputs[:2], targets[:2]), gradient(inputs[2:], targets[2:])
weighted = (2*first + 3*second)/5
unweighted = (first+second)/2
assert np.allclose(full, weighted)
assert not np.allclose(full, unweighted)
parameters = 1_000_000
print('full gradient', full, 'incorrect mean', unweighted)
print('simple float32 Adam states, MB', 16*parameters/1e6)

```

### Code structure and observed intermediate values


#### Stage 2

```python
inputs = np.array([1., 2., 3., 4., 5.])
```

An observed state during this stage was:

- `inputs`: `[1. 2. 3. 4. 5.]`

#### Stage 3

```python
targets = np.array([0., 1., 1., 2., 3.])
```

An observed state during this stage was:

- `targets`: `[0. 1. 1. 2. 3.]`

#### Stage 4

```python
weight = 0.2
```

An observed state during this stage was:

- `weight`: `0.2`

#### Stage 5

```python
def gradient(x, y):
    return np.mean((weight*x-y)*x)
```

#### Stage 6

```python
full = gradient(inputs, targets)
```

An observed state during this stage was:

- `full`: `-3.4`

#### Stage 7

```python
first, second = gradient(inputs[:2], targets[:2]), gradient(inputs[2:], targets[2:])
```

An observed state during this stage was:

- `first`: `-0.5`
- `second`: `-5.3333333`

#### Stage 8

```python
weighted = (2*first + 3*second)/5
```

An observed state during this stage was:

- `weighted`: `-3.4`

#### Stage 9

```python
unweighted = (first+second)/2
```

An observed state during this stage was:

- `unweighted`: `-2.9166667`

#### Stage 10

```python
assert np.allclose(full, weighted)
```

#### Stage 11

```python
assert not np.allclose(full, unweighted)
```

#### Stage 12

```python
parameters = 1_000_000
```

An observed state during this stage was:

- `parameters`: `1000000`

#### Stage 13

```python
print('full gradient', full, 'incorrect mean', unweighted)
```

#### Stage 14

```python
print('simple float32 Adam states, MB', 16*parameters/1e6)
```

Run from the course root:

```bash
python code/21_pretraining_systems.py
```

### Recorded output from the supplied environment

```text
full gradient -3.4 incorrect mean -2.9166666666666665
simple float32 Adam states, MB 16.0
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A summed loss with unequal contributions, illustrating why reduction weights matter.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\left(x - 1\right)^{2} + 2 \left(2 x - 1\right)^{2}.$$

Its first derivative is

$$f^{(1)}(x)=18 x - 10.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=18.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 3 | -10 | 18 |
| 0.2 | 1.36 | -6.4 | 18 |
| 0.4 | 0.44 | -2.8 | 18 |

#### Evaluation 1: substitute $x=0$

$$f(0)=3\approx 3.$$
At this coordinate the slope is $-10$, so the function decreases under a sufficiently small positive perturbation. The curvature is $18$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.01$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.009991$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=\frac{34}{25}\approx 1.36.$$
At this coordinate the slope is $-6.4$, so the function decreases under a sufficiently small positive perturbation. The curvature is $18$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0064$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.006391$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=\frac{11}{25}\approx 0.44.$$
At this coordinate the slope is $-2.8$, so the function decreases under a sufficiently small positive perturbation. The curvature is $18$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0028$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.002791$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -6.4 | 1.7764e-15 |
| 0.01 | -6.4 | 5.3291e-15 |
| 0.001 | -6.4 | 3.908e-14 |
| 0.0001 | -6.4 | 2.6112e-13 |
| 1e-05 | -6.4 | 6.3993e-12 |
| 1e-06 | -6.4 | 1.4903e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 3 | 2.64 | 3 | 8.8818e-16 |
| -0.1 | 2.09 | 2 | 2.09 | 4.4409e-16 |
| 0.1 | 0.81 | 0.72 | 0.81 | 2.2204e-16 |
| 0.2 | 0.44 | 0.08 | 0.44 | 0 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)

[Previous](20-train-gpt.md) · [Index](../README.md) · [Next](22-decoding-kv-cache.md)
