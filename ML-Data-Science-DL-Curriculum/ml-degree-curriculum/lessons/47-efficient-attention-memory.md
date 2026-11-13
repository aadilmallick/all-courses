# 47. FlashAttention, accumulation, checkpointing, and memory budgets

[Previous](46-finetuning-hypernetworks.md) · [Course index](../README.md) · [Next](48-distributed-deployment.md)

## Arithmetic and memory traffic are different costs

Standard attention forms an $L\times S$ score matrix for each batch and head. Even when matrix multiplication is efficient, storing and moving these scores can be expensive. FlashAttention uses tiled computation and an online softmax to avoid materializing the whole matrix in high-bandwidth memory. It computes exact dense attention in real arithmetic with ordinary finite-precision differences, rather than replacing the distribution with a sparse approximation. Dense pairwise arithmetic remains quadratic in sequence length.

For one score row, keep running maximum $m$, exponential sum $l$, and unnormalized weighted value sum $o$. When a tile has maximum $m_b$, set $m'=\max(m,m_b)$. Rescale prior sums by $e^{m-m'}$, then add tile exponentials measured relative to $m'$. The final output is $o/l$. The shared rescaling cancels in the ratio, preserving the softmax result while keeping exponentials numerically manageable.

The NumPy laboratory demonstrates online normalization and compares with dense attention. It is not a GPU FlashAttention kernel and does not establish a speedup. Hardware kernels need specialized layouts, tiling, scheduling, and backward recomputation.

## Accumulation preserves a declared denominator

To match a large-batch mean, accumulate each microbatch's summed losses divided by the total number of valid observations across the update. Averaging microbatch means equally matches only when their denominators are equal. Zero gradients once at the start, backward for every microbatch, and step once at the end. Clip after accumulation, and account for distributed averaging if using several workers.

BatchNorm statistics and stochastic operations can make microbatch accumulation differ from a single simultaneous large batch even with identical loss scaling. Accumulation reproduces the gradient of the accumulated independent-example objective under stated conditions, not every behavior of a larger physical batch.

## Checkpointing trades recomputation for saved activations

Activation checkpointing discards selected intermediate forward values and recomputes them during backward. A recovery checkpoint stores model and optimizer state on disk. These share a name but solve different problems. Recomputed stochastic or stateful operations must preserve the intended behavior; read the framework's current checkpoint contract.

## Numerical and system laboratories
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
python code/neural/23_efficient_attention.py
```

### Recorded output from the supplied environment

```text
online [6.82787261 7.82787261 8.82787261] direct [6.82787261 7.82787261 8.82787261]
```

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
python code/neural/21_pretraining_systems.py
```

### Recorded output from the supplied environment

```text
full gradient -3.4 incorrect mean -2.9166666666666665
simple float32 Adam states, MB 16.0
```## 7.3 Understand what consumes training memory

Training stores parameters, gradients, optimizer state, saved activations, temporary workspaces, and possibly communication buffers. A parameter-count estimate covers only part of this. Adam-style optimizers keep additional state per parameter, and activations can dominate for large batches or long sequences.

Memory reported as reserved by a caching allocator differs from memory occupied by live tensors. Returning a tensor's storage to a cache can make it reusable without returning it immediately to the device driver. A high reserved figure alone is not evidence of a leak. Track allocated live memory and iteration behavior before diagnosing retention.

Typical remedies target specific components. Reducing batch size reduces many activations. Gradient accumulation can recover a larger effective batch across several passes. Activation checkpointing trades extra computation for fewer saved intermediates. Sharding reduces replicated state. Lower precision can reduce some storage and bandwidth. None is universally best.

Activation checkpointing recomputes selected forward regions during backward rather than retaining all intermediates. This requires compatible recomputation behavior; random operations and side effects need care. It also changes performance, so choose boundaries where memory savings justify extra work. Use the current checkpointing API with its documented options rather than copying an old recipe blindly.



## 7.5 Gradient accumulation requires the correct denominator

If one large batch does not fit, process several microbatches before stepping the optimizer. Gradients accumulate naturally, but each microbatch's contribution must be scaled to match the intended combined objective. Dividing every microbatch mean by a fixed count works only when all microbatches in the accumulation group have equal effective size and the group count is correct.

For unequal sizes, sum unreduced example losses and divide each contribution by the total examples in the group. Then all contributions add to the same gradient as the combined average, assuming no batch-dependent operations or other differences in computation.

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
microbatches = [
    (torch.randn(3, 2), torch.randn(3)),
    (torch.randn(2, 2), torch.randn(2)),
]
total_examples = sum(len(targets) for _, targets in microbatches)
optimizer.zero_grad(set_to_none=True)
for features, targets in microbatches:
    prediction = model(features).squeeze(-1)
    contribution = (prediction - targets).square().sum() / total_examples
    contribution.backward()
optimizer.step()
```

This example stores a group explicitly to make its denominator visible. A streaming loader can calculate group sizes or use a carefully defined final-group policy. For token objectives, use valid-token counts. Dropout randomness and batch normalization can make accumulated microbatches differ from one physical large batch even when gradient scaling is correct.

When combining with AMP, keep one scale across an accumulation group and unscale only after all contributions are accumulated. When combining with distributed training, synchronization policy adds another layer. Compose features only after verifying each independently.



## 7.21 A numerical memory budget before a scaling decision

Consider a model with one hundred million parameters. Storing each in float32 requires about four hundred million bytes before gradients or optimizer state. A same-sized gradient adds another such amount. Two float32 moment tensors add approximately eight hundred million more bytes. This rough accounting already reaches about 1.6 billion bytes without activations, temporary buffers, or allocator overhead.

The estimate is intentionally simplified. Mixed-precision methods may retain master weights, different optimizer implementations organize state differently, and sharded systems distribute ownership. Its value is showing why a model file's size does not predict training memory. If long-sequence activations dominate, sharding parameter state may save less than expected. If optimizer state dominates, activation checkpointing alone may be insufficient.

Write a budget for the actual model and batch before choosing a scaling mechanism. Then measure a representative step and compare observed peaks with the estimate. Differences often reveal hidden copies, saved activations, or optimizer initialization that occurs only after the first update. A budget turns “out of memory” from an opaque failure into an identifiable resource mismatch.
