# 45. Translation, generation, caching, and language model evaluation

[Previous](44-build-train-transformer.md) · [Course index](../README.md) · [Next](46-finetuning-hypernetworks.md)

## Translation defines a conditional distribution

For source $x$ and target $y_{1:T}$, an autoregressive translator factorizes $p(y\mid x)=\prod_tp(y_t\mid y_{<t},x)$. Teacher forcing conditions on the true previous target tokens during training. At generation, previous targets come from the model, so prediction errors can alter later inputs. This exposure difference is a limitation to study, not a reason to insert future gold tokens during evaluation.

Greedy decoding chooses the highest-probability next token. Beam search retains several partial sequences and extends them. It optimizes an approximate search objective, which may include length normalization or penalties. The most likely token sequence need not be the best human translation. Temperature and top-k or nucleus sampling change the generation distribution; they are not interchangeable with beam search.

BLEU compares n-gram overlap with references using a brevity penalty under a specified implementation. A single number can miss meaning changes, rare names, or factual errors. Learned metrics and human evaluation add other evidence but carry their own biases. Report dataset, reference handling, tokenization, and decoding settings.

## Caching and evaluation laboratories
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
python code/neural/22_decoding_kv_cache.py
```

### Recorded output from the supplied environment

```text
cached last row [[ 0.83100195 -0.47165109 -0.66982414  1.25173382]] top-k probability [0.67134745 0.         0.         0.32865255]
```

## Decide what success means before measuring it

Next-token loss, factual question answering, code execution, instruction following, and calibrated uncertainty are different targets. A single score cannot establish all of them. Choose a deployment population, specify a metric, reserve an evaluation set, and record uncertainty. Reusing the test set to tune prompts turns it into development data.

Exact match is useful when an answer has a canonical representation. It can punish equivalent wording. Semantic scoring can recognize paraphrases but introduce evaluator bias. Executable tests provide strong evidence for specified behavior but can miss untested cases. Evaluation design is the problem of making these limitations explicit.

## Calibration with a numerical example

A predictor is calibrated for an event if among cases assigned probability $p$, the event occurs with frequency $p$ under the evaluation distribution. Accuracy alone does not establish calibration. A model that is 80 percent correct and always claims 99 percent confidence is overconfident.

For a binary event $y$ and probability $p$, Brier loss is $(p-y)^2$. Its expected value under true success rate $q$ is $q(p-1)^2+(1-q)p^2=p^2-2pq+q$. Differentiating gives $2(p-q)$, so the unique minimizer on $[0,1]$ is $p=q$. This is a proper scoring rule. Log loss is also proper under its support conditions.

Expected calibration error bins confidence and compares empirical accuracy with mean confidence. Its value depends on binning and sample size. A coarse bin can hide errors that cancel. Report reliability data and uncertainty rather than treating one ECE number as a complete description.

## From inspection to causal evidence

Attention maps reveal one intermediate quantity. They do not by themselves identify the cause of a decision. Probe classifiers show information can be decoded, but not that the model uses that information. Ablation removes a component; activation patching replaces internal states between runs; controlled interventions can test causal hypotheses. Distribution shifts caused by an intervention complicate interpretation.

For an induction-like behavior, construct matched examples, locate candidate components, intervene, and measure a specific output change. Include negative controls and alternative explanations. A circuit description is stronger when it predicts behavior beyond the examples used to discover it.

## Statistical discipline

A paired comparison uses the same examples for both systems. Bootstrap over independent units such as users or documents when examples are clustered. A confidence interval quantifies a sampling procedure, not every source of uncertainty, including contamination and evaluator error.

The example computes Brier score and bootstrap uncertainty for a small paired accuracy difference. It illustrates the calculation, but eight examples are too few for a reliable deployment decision. The deliberately modest sample makes this limitation visible.

### A calibrated constant predictor can still be unhelpful

If a dataset has 70 percent positive labels, always predicting 0.7 can be calibrated at its one confidence value. Yet it distinguishes no individual cases. A perfect ranking model might discriminate examples well but need probability recalibration. Calibration and discrimination are therefore separate axes. Under Brier loss, the constant predictor's expected score is $0.7(0.3)^2+0.3(0.7)^2=0.21$. A perfectly accurate probability predictor has zero. Report calibration alongside task accuracy and discrimination metrics suitable for the application.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(25)
labels = np.array([1, 0, 1, 1, 0, 0, 1, 0])
probability = np.array([.8, .3, .6, .9, .4, .1, .7, .2])
brier = np.mean((probability-labels)**2)
a = np.array([1, 1, 0, 1, 1, 0, 1, 1])
b = np.array([1, 0, 0, 1, 1, 0, 1, 0])
differences = a-b
samples = rng.choice(differences, size=(2000, len(differences)), replace=True).mean(axis=1)
print('Brier', brier, 'paired improvement', differences.mean())
print('illustrative bootstrap interval', np.quantile(samples, [.025, .975]))

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(25)
```

#### Stage 3

```python
labels = np.array([1, 0, 1, 1, 0, 0, 1, 0])
```

An observed state during this stage was:

- `labels`: `[1 0 1 1 0 0 1 0]`

#### Stage 4

```python
probability = np.array([.8, .3, .6, .9, .4, .1, .7, .2])
```

An observed state during this stage was:

- `probability`: `[0.8 0.3 0.6 0.9 0.4 0.1 0.7 0.2]`

#### Stage 5

```python
brier = np.mean((probability-labels)**2)
```

An observed state during this stage was:

- `brier`: `0.075`

#### Stage 6

```python
a = np.array([1, 1, 0, 1, 1, 0, 1, 1])
```

An observed state during this stage was:

- `a`: `[1 1 0 1 1 0 1 1]`

#### Stage 7

```python
b = np.array([1, 0, 0, 1, 1, 0, 1, 0])
```

An observed state during this stage was:

- `b`: `[1 0 0 1 1 0 1 0]`

#### Stage 8

```python
differences = a-b
```

An observed state during this stage was:

- `differences`: `[0 1 0 0 0 0 0 1]`

#### Stage 9

```python
samples = rng.choice(differences, size=(2000, len(differences)), replace=True).mean(axis=1)
```

An observed state during this stage was:

- `samples`: `array shape=(2000,), min=0, max=0.75, norm=13.051`

#### Stage 10

```python
print('Brier', brier, 'paired improvement', differences.mean())
```

#### Stage 11

```python
print('illustrative bootstrap interval', np.quantile(samples, [.025, .975]))
```

Run from the course root:

```bash
python code/neural/25_evaluation_interpretability.py
```

### Recorded output from the supplied environment

```text
Brier 0.07500000000000001 paired improvement 0.25
illustrative bootstrap interval [0.    0.625]
```
Optional application: train a tiny encoder-decoder on a synthetic copy or reversal task, stating clearly that it is a sequence-transduction exercise rather than natural-language translation. Verify attention access, padding exclusion, teacher-forcing alignment, and an evaluation rollout that uses no future gold target tokens.
