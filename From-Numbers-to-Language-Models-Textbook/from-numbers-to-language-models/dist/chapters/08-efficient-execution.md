# Making training and inference practical: data, memory, caches, and context

## Start with a workload rather than a speed claim

A system serving short questions and long answers has a different bottleneck from one reading long documents and producing one label. Before choosing an optimization, specify batch size, prompt lengths, output lengths, model dimensions, precision, and hardware. The same algorithm can be compute-bound in one setting and memory-bound in another.

We will use arithmetic estimates as explanations, not as substitutes for measurement. A memory formula can reveal a job cannot fit. It cannot account for every allocator, kernel workspace, communication pattern, or queueing effect. A useful optimization story connects the counted quantity to an observed workload.

## Pretraining data, scaling, distributed execution, and memory

### Scale is a resource-allocation problem

A language model's behavior depends on architecture, data, objective, optimization, and compute. Parameter count is only one axis. A large undertrained model may perform worse than a smaller model trained on better or more data. Empirical scaling laws describe fitted trends in particular regimes; they are not universal laws that eliminate experimentation.

Data preparation includes decoding, document boundaries, deduplication, quality filtering, language and domain balance, sensitive-data handling, and contamination checks. Filtering changes the distribution being learned. Repeating a dataset increases optimization steps but does not create independent factual evidence.

### Count memory before launching a job

For $P$ trainable parameters, weights, gradients, optimizer moments, and sometimes master copies each require storage. A simple float32 Adam accounting gives four arrays of four bytes per parameter: weights, gradients, first moment, and second moment, approximately $16P$ bytes before activations and temporary buffers. Mixed-precision accounting differs with implementation. Frozen parameters avoid gradient and optimizer-state storage but still require weights and forward activations.

Activations depend on batch size, sequence length, width, layer count, and attention implementation. A materialized dense attention tensor can require order $BHT^2$ elements per layer. Checkpointing recomputes selected forward operations during backward to trade additional arithmetic for lower retained activation memory.

### Derive accumulation correctly

Suppose microbatch $m$ has $n_m$ valid targets and mean loss $L_m$. The global token-mean objective is $L=\sum_m n_mL_m/\sum_m n_m$. Its gradient is the same weighted combination. Simply averaging microbatch means gives equal weight to microbatches even when their valid-target counts differ.

With equal sizes, divide each microbatch loss by the accumulation count before backward, accumulate gradients, then perform one optimizer step. Clip the accumulated gradient if the goal is to bound the full update. Clipping every microbatch separately defines another procedure.

### Parallelism changes what is shared

Data parallel workers hold model replicas and process different data, then combine gradients. Tensor parallelism partitions operations or weight dimensions within layers. Pipeline parallelism partitions layers and introduces scheduling bubbles. Sharded optimizer and parameter schemes distribute model states. Communication, synchronization, and load imbalance can dominate ideal arithmetic savings.

Sparse MoE adds expert dispatch and all-to-all communication, which later lessons treat separately. A memory estimate that fits on paper can still fail because of fragmentation, kernel workspaces, or peak transient buffers.

The experiment demonstrates weighted gradient accumulation on a scalar regression problem. It deliberately uses unequal microbatches to show why averaging means is wrong. This numerical equality is the local algebra that distributed reduction must preserve.

#### A padding imbalance changes the objective

Microbatch A has one valid target with gradient ten; microbatch B has nine valid targets with mean gradient zero. Equal averaging of the two means gives gradient five. The global token mean gives $(1\cdot10+9\cdot0)/10=1$. Both calculations are arithmetically correct for different objectives. If a distributed framework averages worker gradients equally, compensate for unequal valid-target counts when the desired objective is the global token mean. Gradient accumulation is therefore a reduction-design problem before it is a memory optimization.


## Data preparation changes the function being learned

Deduplication reduces repeated text and can reduce train-test leakage. Filtering changes which styles and domains the model sees. Document boundaries determine which conditional transitions are included. Quality scores and sampling weights alter effective task balance. None of these choices is merely a file-format detail, because the objective is an expectation under the resulting data distribution.

A larger dataset can contain less useful information if it adds mostly duplicates or systematically wrong targets. More training steps can reduce fitting error while increasing memorization. Keep data provenance and split decisions alongside optimizer settings when recording an experiment.


### Executable calculation

Run `python examples/21_pretraining_systems.py` from the package root. Complete source is also included as [21_pretraining_systems.py](../examples/21_pretraining_systems.py).

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

Recorded output on the checked Python/NumPy environment:

```text
full gradient -3.4 incorrect mean -2.9166666666666665
simple float32 Adam states, MB 16.0
```


## Decoding, temperature, KV caches, and serving

### A distribution still needs a decision rule

Given logits $z$, temperature sampling uses $p_i\propto e^{z_i/\tau}$ for $\tau>0$. Higher temperature usually flattens a fixed distribution; lower temperature sharpens it. It changes the decoding distribution without changing model weights. The zero-temperature limit with a unique maximum is greedy decoding; code should handle greedy selection explicitly instead of dividing by zero.

Top-$k$ retains the $k$ largest logits and renormalizes. Nucleus sampling retains a smallest high-probability prefix whose cumulative probability reaches a chosen threshold, under a specified tie convention. Apply the threshold to a clearly defined distribution, normally after temperature. Different operation orders can produce different samples.

Beam search maintains several promising prefixes under a scoring rule. Raw log-probability often favors shorter completed sequences because every added term is nonpositive. Length penalties change that objective. More search does not automatically improve factual accuracy or human preference.

### Why cache keys and values

For a causal decoder, an earlier token's hidden state does not change when a future token is appended, provided positions, masks, and all other inputs are consistent. Therefore its per-layer keys and values can be reused. A new query attends to cached past keys plus its current key and reads cached values plus its current value.

Prefill processes the initial prompt. Decode processes newly generated tokens. Dense prefill has quadratic attention work in prompt length, while a single new query performs work linear in current context length for its attention read. Caching avoids repeatedly recomputing old projections and states; it does not make attention to history constant cost.

Cache correctness needs layer-specific storage, correct position indices, correct batch identities, and careful handling of branch changes. Reusing a cache for a different prompt or after editing earlier tokens is invalid. Sliding windows require an explicit policy for position and visibility semantics.

### Verify an elementary cache

The experiment compares the final row of a full causal attention operation with a one-query attention operation over all saved keys and values. It checks the exact local equality underlying caching. It is not a full cached implementation of `TinyGPT`, whose multiple sublayers would each need consistent cached states.

Serving systems also balance batch size, queueing, prompt length, output length, and memory bandwidth. Time to first token and throughput measure different experiences. Report prompt/output distributions and hardware alongside a speed result; tokens per second without workload context is incomplete.

Optional application: run two different prompts with the same token count. Demonstrate that reusing the first prompt's keys for the second changes the output. Equal shapes do not imply a valid cache identity.

#### Derive the key/value cache byte count

For $L=24,B=1,G=4,T=4096,d=64$ and two-byte elements, keys and values require $2\cdot24\cdot1\cdot4\cdot4096\cdot64\cdot2=100{,}663{,}296$ bytes, or 96 MiB. This excludes allocator overhead, alignment, other activations, and model weights. If batch grows to eight, this ideal cache grows to 768 MiB. If context doubles, it doubles again. Beam or speculative branches may share some prefixes but require explicit storage management; multiplying every branch's full history can overestimate or underestimate an actual system depending on sharing.


## Separate three distributions during decoding

The model distribution comes from its logits under the current prefix. Temperature and filtering define a modified sampling distribution. The realized generated token is one sample or decision from that distribution. A low-temperature output can be more predictable without being more factually supported, and a high-temperature output can be diverse without being useful.

For probabilities `(0.6,0.3,0.1)`, retaining only the two largest candidates removes the last one and renormalizes the others to `(2/3,1/3)`. This is no longer the original model distribution. Log-probabilities reported for evaluation should state whether they refer to original model probabilities or filtered sampling probabilities.


### Executable calculation

Run `python examples/22_decoding_kv_cache.py` from the package root. Complete source is also included as [22_decoding_kv_cache.py](../examples/22_decoding_kv_cache.py).

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

Recorded output on the checked Python/NumPy environment:

```text
cached last row [[ 0.83100195 -0.47165109 -0.66982414  1.25173382]] top-k probability [0.67134745 0.         0.         0.32865255]
```


## A cache is a claim about unchanged computation

For a fixed causal prefix with consistent positions, appending a token does not alter earlier hidden states. That is why their keys and values can be reused. If you edit an earlier token, change a position scheme, switch model weights, or mix examples across a batch, the premise can fail. A valid cache needs identity as well as shape.

The elementary equality test compares a full causal attention row against a one-query read over saved keys and values. A complete multi-layer cache must apply the same logic at each layer. Reusing only final-layer keys for every layer would not implement the same network, even if all arrays have compatible dimensions.

## Exact online attention, sparse patterns, and linear alternatives

### Separate arithmetic from memory traffic

Dense attention computes every query-key interaction. A naive implementation also stores all scores or probabilities. FlashAttention-style algorithms reorganize exact attention using tiles and online normalization, avoiding large intermediate writes. They do not generally change dense attention's quadratic arithmetic complexity. Floating-point operation order may change rounding.

For one query with scores $s_j$, the output is $\sum_j e^{s_j}v_j/\sum_j e^{s_j}$. Maintain a running maximum $m$, normalizer $l$, and unnormalized output accumulator $u$. On a new score block with maximum $m_b$, set $m'=\max(m,m_b)$ and update

$$l'=e^{m-m'}l+\sum_{j\in b}e^{s_j-m'},\qquad
u'=e^{m-m'}u+\sum_{j\in b}e^{s_j-m'}v_j.$$

The rescaling converts the old accumulator from reference maximum $m$ to $m'$. After all blocks, output $u/l$. These identities follow by factoring the same exponential constant from numerator and denominator. Our CPU loop demonstrates the algebra, not a fast GPU kernel.

### Sparse attention changes the connectivity

A sliding window of width $w$ lets each query read nearby positions, reducing score work to roughly $O(Twd)$ for fixed $w$. Global tokens, dilation, or learned selection can add long-range paths. Multiple layers can propagate information farther than one window, but this does not make sparse and dense attention identical.

Low-rank sequence compression assumes useful attention can be approximated through a lower-dimensional sequence representation. That assumption can fail for tasks requiring many distinct precise references. Approximation quality must be measured on the intended workload.

### Linear attention changes the kernel

If similarity has form $\phi(q)^\top\phi(k)$, reassociate sums:

$$o_i=\frac{\phi(q_i)^\top\left(\sum_j\phi(k_j)v_j^\top\right)}{\phi(q_i)^\top\left(\sum_j\phi(k_j)\right)}.$$

This avoids a full score matrix when feature-map dimension is manageable. Causal versions maintain prefix accumulators. The denominator needs positivity or other stability treatment. Ordinary softmax attention cannot simply be reassociated this way because exponentiating a dot product is not a finite ordinary dot product without a feature representation or approximation.

### Pick the property you need to preserve

Exact tiled attention preserves the mathematical operation. Sparse patterns preserve selected edges. Kernel methods preserve or approximate another similarity representation. State-space and recurrent alternatives use another computation structure. Compare quality, memory, wall time, precision, and supported masks rather than calling all of them the same efficiency trick.

The experiment checks online normalization against a direct stable softmax read, including extreme scores. A correct output equality is the key numerical invariant before considering performance.

#### Verify online rescaling with two scores

Take scores 1000 and 1001 with scalar values two and four. After the first item, use maximum 1000, normalizer one, and accumulator two. On the second item, new maximum is 1001. Rescale the old contribution by $e^{-1}$, giving normalizer $e^{-1}+1$ and accumulator $2e^{-1}+4$. Their ratio equals direct softmax attention. Exponentiating 1001 directly would overflow ordinary floating-point formats, but exponentiating zero and minus one is safe. The algorithm's stability follows from changing the reference scale consistently in both numerator and denominator.


## Exact reorganization and approximation answer different questions

An online normalizer changes how the same weighted sum is accumulated. Sparse attention changes which interactions are computed. Linear attention usually changes or approximates the similarity representation to permit reassociation. These alternatives can all be useful, but they preserve different properties. Compare their mathematical target before comparing their latency.

A CPU loop that implements an online identity is not a fast FlashAttention kernel. It establishes the algebra needed to understand one. GPU efficiency additionally depends on tiling, on-chip memory, memory transfers, parallelism, and backward-pass storage choices. The book does not treat successful numerical equality as evidence of GPU performance.


### Executable calculation

Run `python examples/23_efficient_attention.py` from the package root. Complete source is also included as [23_efficient_attention.py](../examples/23_efficient_attention.py).

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

Recorded output on the checked Python/NumPy environment:

```text
online [6.82787261 7.82787261 8.82787261] direct [6.82787261 7.82787261 8.82787261]
```


## Long-context modeling and position extrapolation

### Capacity to accept tokens differs from capacity to use them

A configured context limit says how much input an implementation permits. Effective long-context ability asks whether the model can retrieve, combine, and reason over the relevant information at that length. A single planted keyword tests a narrow retrieval property. Multi-document synthesis, distractor resistance, ordering, and evidence integration are harder and different tasks.

Increasing context raises attention work, key/value cache memory, and potentially distractor interference. Retrieval can reduce the amount of irrelevant material, while long-context processing can retain relationships that a retriever might omit. The two approaches can be combined; there is no mathematical rule that one universally replaces the other.

### Position interpolation is a geometric intervention

Suppose a model was trained on positions below $L_0$ and must process up to $L_1>L_0$. A simple interpolation maps $p$ to $pL_0/L_1$ before positional encoding. This keeps the mapped range near training positions while compressing relative distances. Nearby tokens become closer in positional phase, which can change local discrimination.

For a rotary frequency $\omega$, a relative distance $\Delta$ gives phase $\omega\Delta$. Scaling positions by $a$ changes it to $a\omega\Delta$. Different frequencies encode different scales, so changing all frequencies uniformly is not equivalent to a selectively adjusted schedule. Methods described as NTK-aware or dynamic scaling require their actual formula and assumptions to reproduce; a label alone is insufficient.

### Build an evaluation that can fail informatively

Vary evidence location, total length, number of distractors, lexical overlap, and number of required evidence pieces. Keep answer keys independent of the candidate model. Measure answer correctness, evidence citation accuracy, abstention behavior, latency, and memory. A long-context test contaminated by training data may measure recall from weights rather than use of supplied evidence.

For example, place an update saying a service now uses port 8443 near the middle, while several older notes say 443. Ask for the current port with the source date. Exact keyword retrieval alone may find both numbers; temporal resolution and citation correctness distinguish a useful answer from a plausible one.

### Quantify the resource change

Doubling $T$ roughly quadruples dense score entries and doubles the key/value cache, holding architecture and batch fixed. Position interpolation does not change those resource counts. Efficient kernels reduce intermediate storage and traffic, while grouped-query attention reduces cache head count. Each intervention addresses a distinct term.

The experiment compares rotary scores under original and compressed positions, making the geometry change explicit. It also reports score-matrix and cache scaling ratios. No extrapolation-quality claim follows from these calculations; that requires a trained model and held-out tasks.

#### Construct an evidence-position test that cannot be solved by memorization

Generate random key-value pairs after the evaluated model was trained, place a queried key's value at controlled positions, and ask for that value. Vary distance and distractors while keeping the answer format fixed. Randomization reduces the chance that the answer can be recalled from weights. Then add two-hop questions linking one random key to another, and contradictory dated updates. These extensions test composition and temporal selection beyond a single literal lookup. Report separate curves for each task rather than treating all as one measure of long-context understanding.


### Executable position-scaling calculation

Run `python examples/24_long_context.py` from the package root. Complete source is included as [24_long_context.py](../examples/24_long_context.py). Compare the original and interpolated score at each distance before interpreting the resource ratios.

```python
import numpy as np
q, k = np.array([1., 0.5]), np.array([0.2, 1.])
def score(distance, scale=1.0):
    angle = 0.2 * distance * scale
    c, s = np.cos(angle), np.sin(angle)
    rotation = np.array([[c, -s], [s, c]])
    return q @ rotation @ k
for distance in [1, 5, 20, 80]:
    print('distance', distance, 'original', score(distance), 'interpolated', score(distance, 0.25))
old, new = 1024, 4096
print('dense score ratio', (new/old)**2, 'cache ratio', new/old)
```

Recorded output on the checked Python/NumPy environment:

```text
distance 1 original 0.507244206773314 interpolated 0.6541439299328659
distance 5 original -0.379112272219409 interpolated 0.4555751318683807
distance 20 original 0.22357171117260702 interpolated -0.379112272219409
distance 80 original -0.4112486512278105 interpolated 0.22357171117260702
dense score ratio 16.0 cache ratio 4.0
```

## Evaluate the context you intend to use

A single relevant phrase hidden in a long document tests one kind of access. Two relevant facts that must be combined test composition. A newer exception contradicting an old rule tests temporal selection and provenance. A useful long-context evaluation separates these demands because one score can conceal distinct weaknesses.

The companion's **Inference and context costs** experiment changes context length, key/value-head count, and temperature. It calculates cache bytes and dense score entries from the displayed dimensions, then compares a direct attention read with its cached last-row form. These are real calculations on a specified small model. The memory estimate excludes temporary buffers and implementation overhead, which remain labeled limits.

We now understand how a base model can be trained and executed. The next chapters change its behavior with instruction examples, restricted updates, sparse computation, and teacher guidance. Their losses and memory tradeoffs will be easier to reason about because we have separated objective, architecture, and execution.
