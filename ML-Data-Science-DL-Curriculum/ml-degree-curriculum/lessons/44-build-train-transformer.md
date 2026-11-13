# 44. Implement and train a tiny transformer with a numerical autodiff engine

[Previous](43-transformer-architectures.md) · [Course index](../README.md) · [Next](45-translation-decoding-evaluation.md)

## Build the model before scaling it

The supplied NumPy engine implements reverse-mode differentiation for the exact operations needed by a tiny causal decoder. It is deliberately limited: float64 CPU arrays, fresh graphs per training step, and no GPU kernels or general-purpose tensor runtime. That makes every local derivative visible.

Read the tensor operations in dependency order: addition and multiplication, broadcast reduction, matrix multiplication, indexing accumulation, nonlinearities, normalization, and log-softmax. Then inspect embeddings, query/key/value projections, causal attention, residual blocks, and the output head. A single scalar loss drives the backward traversal; all shared-path contributions add into stored gradients.

Training shifts target tokens relative to input tokens by one position. Token at position $t$ predicts the token at $t+1$ using only its permitted prefix. A causal mask plus incorrect target alignment can still produce the wrong task. Test both causality and alignment.

## Implement and train the numerical decoder
## Assemble the pieces into one probabilistic model

The supplied `TinyGPT` in `code/core.py` is a complete differentiable causal decoder. It has token embeddings, learned absolute position embeddings, multi-head causal attention, a nonlinear feed-forward network, residual connections, normalization, and a vocabulary output projection. It is intentionally small enough to inspect. It does not implement the architecture or quality of a particular released LLM.

For IDs of shape $(B,T)$, the embedding lookup gives $(B,T,D)$. Add positions, normalize, and form projected queries, keys, and values. Split heads, calculate causal attention, merge heads, and apply the output projection. Add that result to the residual stream, apply a normalized feed-forward branch, add again, normalize once more, and project to $(B,T,V)$ logits.

## Understand the parameter graph

Every trainable array is a `Tensor` leaf. Arithmetic operations create new graph nodes that retain parent references and a local reverse rule. The parameter list contains leaves only. The model builds a new graph for every call; intermediate gradients therefore start at zero. Updating parameter data between forward and backward would invalidate the saved computation and must be avoided.

Embedding lookup uses repeated indexing. If token ID two appears four times, four upstream row gradients must add into embedding row two. The engine uses `np.add.at` because ordinary advanced-index `+=` does not reliably accumulate repeated indices as intended.

For a target at batch $b$, position $t$, select log-probability $\ell_{bt,y_{bt}}$. The mean negative of these selected values is a scalar. Calling `backward()` propagates derivatives through indexing, log-softmax, output projection, both residual branches, and the three attention projections to embeddings.

## Verify more than successful execution

A shape check should confirm output $(B,T,V)$. A causality check should alter the last input ID and verify earlier logits are unchanged. A gradient check should perturb one parameter coordinate and compare the loss change with its autodiff gradient. These are different properties; passing one does not imply the others.

The example checks all three on a tiny vocabulary. Numerical gradients are expensive because each coordinate requires two forward passes. They are practical for representative coordinates and primitive operations, not for every parameter of a large model.

## Deliberate simplifications

The model uses one block, tanh activation, no dropout, and unlearned normalization scale and shift. It trains with float64 NumPy on CPU. It has no attention cache or accelerated kernel. These simplifications preserve the central forward/backward mathematics while making the implementation inspectable.

A model can overfit a tiny pattern without learning general linguistic competence. The next lesson uses that limitation constructively: first prove the training pipeline can learn a simple pattern, then discuss what changes for realistic data.

### Count the tiny model before trusting it

For vocabulary $V$, context $T$, and width $D$, our one-block model has token and position tables with $VD+TD$ parameters, four attention matrices with $4D^2$, feed-forward matrices with $8D^2$, and an untied output matrix with $DV$. Total is $2VD+TD+12D^2$. There are no learned biases or normalization affine parameters in this implementation. For $V=5,T=5,D=8$, total is $80+40+768=888$. Compare this arithmetic with the parameter arrays. A mismatch identifies an architectural misunderstanding before any training claim is made.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import TinyGPT
model = TinyGPT(vocabulary=5, width=8, heads=2, context=5)
inputs = np.array([[0, 1, 2, 3]])
targets = np.array([[1, 2, 3, 4]])
logits = model(inputs).data
assert logits.shape == (1, 4, 5)
changed = inputs.copy()
changed[0, -1] = 0
assert np.allclose(model(changed).data[:, :-1], logits[:, :-1])
loss = model.loss(inputs, targets)
loss.backward()
parameter, index = model.wq, (0, 0)
analytic = parameter.grad[index]
original, step = parameter.data[index], 1e-5
parameter.data[index] = original + step
positive = float(model.loss(inputs, targets).data)
parameter.data[index] = original - step
negative = float(model.loss(inputs, targets).data)
parameter.data[index] = original
assert np.allclose(analytic, (positive-negative)/(2*step), atol=1e-6)
print('loss', float(loss.data), 'checked gradient', analytic)

```

### Code structure and observed intermediate values


#### Stage 3

```python
model = TinyGPT(vocabulary=5, width=8, heads=2, context=5)
```

#### Stage 4

```python
inputs = np.array([[0, 1, 2, 3]])
```

An observed state during this stage was:

- `inputs`: `[[0 1 2 3]]`

#### Stage 5

```python
targets = np.array([[1, 2, 3, 4]])
```

An observed state during this stage was:

- `targets`: `[[1 2 3 4]]`

#### Stage 6

```python
logits = model(inputs).data
```

An observed state during this stage was:

- `logits`: `[[[-0.49307 -0.13454  0.07445 -0.53996  0.06473]   [-0.23169 -0.21648  0.03673 -0.2694   0.35906]   [ 0.10637  0.05112 -0.20411  0.48429  0.29624]   [ 0.20436  0.35609 -0.10427  0.32656 -0.23961]]]`

#### Stage 7

```python
assert logits.shape == (1, 4, 5)
```

#### Stage 8

```python
changed = inputs.copy()
```

An observed state during this stage was:

- `changed`: `[[0 1 2 3]]`

#### Stage 9

```python
changed[0, -1] = 0
```

An observed state during this stage was:

- `changed`: `[[0 1 2 0]]`

#### Stage 10

```python
assert np.allclose(model(changed).data[:, :-1], logits[:, :-1])
```

#### Stage 11

```python
loss = model.loss(inputs, targets)
```

An observed state during this stage was:

- `loss`: `Tensor(data=1.59868)`

#### Stage 12

```python
loss.backward()
```

#### Stage 13

```python
parameter, index = model.wq, (0, 0)
```

An observed state during this stage was:

- `parameter`: `Tensor(data=array shape=(8, 8), min=-0.212857, max=0.224476, norm=0.719617)`
- `index`: `(0, 0)`

#### Stage 14

```python
analytic = parameter.grad[index]
```

An observed state during this stage was:

- `analytic`: `-0.0010531233`

#### Stage 15

```python
original, step = parameter.data[index], 1e-5
```

An observed state during this stage was:

- `original`: `-0.042802494`
- `step`: `1e-05`

#### Stage 16

```python
parameter.data[index] = original + step
```

An observed state during this stage was:

- `parameter`: `Tensor(data=array shape=(8, 8), min=-0.212857, max=0.224476, norm=0.719616)`

#### Stage 17

```python
positive = float(model.loss(inputs, targets).data)
```

An observed state during this stage was:

- `positive`: `1.5986828`

#### Stage 18

```python
parameter.data[index] = original - step
```

An observed state during this stage was:

- `parameter`: `Tensor(data=array shape=(8, 8), min=-0.212857, max=0.224476, norm=0.719617)`

#### Stage 19

```python
negative = float(model.loss(inputs, targets).data)
```

An observed state during this stage was:

- `negative`: `1.5986829`

#### Stage 20

```python
parameter.data[index] = original
```

#### Stage 21

```python
assert np.allclose(analytic, (positive-negative)/(2*step), atol=1e-6)
```

#### Stage 22

```python
print('loss', float(loss.data), 'checked gradient', analytic)
```

Run from the course root:

```bash
python code/neural/19_implement_gpt.py
```

### Recorded output from the supplied environment

```text
loss 1.5986828515745766 checked gradient -0.0010531233244849207
```

## Start with an intentionally easy dataset

Before paying for a large training run, confirm that the implementation can overfit a small deterministic pattern. Our dataset repeats a short sequence of token IDs. A successful run demonstrates that the shifting, loss, gradients, and updates work together. It provides no evidence about general language ability.

Create a batch of prefixes and their one-token-shifted targets. Compute logits, negative log-likelihood, backward derivatives, global gradient norm, and an update. Reset leaf gradients afterward. The ordering matters: clearing gradients before recording a norm loses the diagnostic, and updating weights before backward differentiates a graph whose stored values no longer match.

## Follow one optimization step

With gradient $g$ and clipping threshold $c$, define $\widetilde g=g\min(1,c/(\|g\|+\epsilon))$. Update $\theta\leftarrow\theta-\eta\widetilde g$. The epsilon protects the zero-gradient case. Clipping rescales all parameters together, preserving relative gradient components. Independently clipping each coordinate is a different operation.

Our model uses ordinary gradient descent to expose this process. A production baseline usually uses AdamW with a documented learning-rate schedule, weight-decay exclusions, warmup, and mixed-precision handling. Those choices change training dynamics and need their own controlled comparison.

## Validation and checkpoints

Validation requires fixed held-out examples and no parameter updates. This model has no dropout, but frameworks with dropout must also switch to evaluation mode. A checkpoint should save parameters, architecture configuration, tokenizer, optimizer state when present, random-generator state, step number, and data-position metadata. Saving only weights permits inference but may not permit faithful continuation.

The example writes a temporary in-memory snapshot of parameter arrays, deliberately perturbs a parameter, then restores it and checks identical logits. It avoids creating a misleading checkpoint format without architecture metadata. A practical extension is an `.npz` parameter file plus a JSON manifest.

## Sampling changes the input distribution

At generation time, select a token from the last position's probability distribution, append it, and run again. Greedy selection picks the largest probability; sampling preserves diversity but can choose low-quality alternatives. Prefixes generated by the model can differ from training prefixes, so a low teacher-forced loss does not guarantee robust long generation.

The implementation crops to the learned context table and restarts absolute position indices for the cropped window. That is a defined toy behavior, not an exact reproduction of infinite-history generation or a cached full-prefix model. Keep inference semantics explicit.

The code asserts a substantial training-loss reduction without requiring one exact floating-point final value. This is a meaningful integration check. The generated IDs are shown for inspection; they are not used as a correctness oracle.

### What a decreasing training loss actually establishes

Suppose loss falls from $\log4\approx1.386$ to 0.2 on a four-token deterministic pattern. Perplexity falls from four to $e^{0.2}\approx1.221$. That means the geometric mean probability assigned to the correct training targets is $e^{-0.2}\approx0.819$, under the stated token weighting. It does not mean 81.9 percent sequence accuracy or 81.9 percent factual correctness. A six-token all-correct sequence probability multiplies six conditional probabilities and can be much lower. Keep token-level likelihood, sampled sequence quality, and task success separate.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import TinyGPT
model = TinyGPT(vocabulary=4, width=12, heads=2, context=6, seed=20)
inputs = np.array([[0, 1, 2, 3, 0, 1], [1, 2, 3, 0, 1, 2]])
targets = (inputs + 1) % 4
initial = float(model.loss(inputs, targets).data)
for step in range(180):
    loss = model.loss(inputs, targets)
    loss.backward()
    norm = model.step(learning_rate=0.15, max_norm=1)
final = float(model.loss(inputs, targets).data)
assert final < initial * 0.5
snapshot = [p.data.copy() for p in model.parameters()]
before = model(inputs).data.copy()
model.embedding.data += 1
for parameter, saved in zip(model.parameters(), snapshot):
    parameter.data[:] = saved
assert np.allclose(model(inputs).data, before)
print('initial', initial, 'final', final, 'sample', model.generate([0], 8, 0.5))

```

### Code structure and observed intermediate values


#### Stage 3

```python
model = TinyGPT(vocabulary=4, width=12, heads=2, context=6, seed=20)
```

#### Stage 4

```python
inputs = np.array([[0, 1, 2, 3, 0, 1], [1, 2, 3, 0, 1, 2]])
```

An observed state during this stage was:

- `inputs`: `[[0 1 2 3 0 1]  [1 2 3 0 1 2]]`

#### Stage 5

```python
targets = (inputs + 1) % 4
```

An observed state during this stage was:

- `targets`: `[[1 2 3 0 1 2]  [2 3 0 1 2 3]]`

#### Stage 6

```python
initial = float(model.loss(inputs, targets).data)
```

An observed state during this stage was:

- `initial`: `1.471912`

#### Stage 7

```python
for step in range(180):
    loss = model.loss(inputs, targets)
    loss.backward()
    norm = model.step(learning_rate=0.15, max_norm=1)
```

An observed state during this stage was:

- `step`: `17`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 8

```python
final = float(model.loss(inputs, targets).data)
```

#### Stage 9

```python
assert final < initial * 0.5
```

#### Stage 10

```python
snapshot = [p.data.copy() for p in model.parameters()]
```

#### Stage 11

```python
before = model(inputs).data.copy()
```

#### Stage 12

```python
model.embedding.data += 1
```

#### Stage 13

```python
for parameter, saved in zip(model.parameters(), snapshot):
    parameter.data[:] = saved
```

#### Stage 14

```python
assert np.allclose(model(inputs).data, before)
```

#### Stage 15

```python
print('initial', initial, 'final', final, 'sample', model.generate([0], 8, 0.5))
```

Run from the course root:

```bash
python code/neural/20_train_gpt.py
```

### Recorded output from the supplied environment

```text
initial 1.4719119592561287 final 0.007086804620041463 sample [0, 1, 2, 3, 0, 1, 2, 3, 0]
```
## Autodiff engine implementation notes

# Read and reconstruct the numerical implementation

The source of truth is [core.py](../code/neural/core.py). This appendix explains its design so the course does not depend on an unexplained framework. Read lessons 01–06 before the autodiff discussion and lessons 11–18 before the full decoder.

## One node, three pieces of information

Each `Tensor` stores `data`, `grad`, and `parents`, plus a local reverse function. `data` is the forward numerical value. `grad` accumulates the derivative of the final scalar objective with respect to that value. `parents` identify the operations that produced it. The reverse function answers: given the gradient at this output, what contributions should its parents receive?

A graph is built as normal Python arithmetic executes. If two operations use the same leaf, they reference the same object. A reverse traversal visits the graph's nodes once but adds contributions along all incoming dependency paths. This distinction prevents both double-visiting whole subgraphs and losing shared-parameter contributions.

`backward()` first performs a depth-first traversal that visits parents before appending a node. Reversing that order ensures downstream gradients are available before a node sends them to its parents. The scalar output starts with derivative one because $dL/dL=1$.

The implementation intentionally accumulates gradients. Call backward once per newly constructed loss graph in the training examples, then clear leaf gradients after updating. Reusing a graph for multiple backward calls without resetting all intermediates is outside this small engine's supported training pattern.

## Addition and broadcast reversal

For equal-shaped arrays, $Y=A+B$ gives $G_A=G_Y$ and $G_B=G_Y$. If $B$ was broadcast, several output entries depend on the same original $B$ entry, so their derivatives add.

For input shape `(2,3)` and bias shape `(3,)`, forward addition uses the bias twice. Its gradient sums over the first axis. For shape `(2,3,4)` plus `(1,3,1)`, the bias gradient sums over batch and feature axes while retaining the middle position axis. `unbroadcast` performs exactly these reductions: remove extra leading dimensions by summation, then sum any expanded size-one axis.

Broadcasting is not copying independent parameters. A shared bias has one parameter per original entry, so the reverse pass must collect every use into that one entry.

## Elementwise products and powers

For $Y=A\odot B$, variations give $dY=dA\odot B+A\odot dB$. Consequently $G_A=G_Y\odot B$ and $G_B=G_Y\odot A$, followed by unbroadcasting. If both arguments are the same object, both contributions accumulate and yield the familiar derivative of a square.

For fixed scalar power $p$, $Y=A^p$ gives $G_A=G_Y\odot pA^{p-1}$ where the real-domain derivative exists. The engine uses this for squares, reciprocals, and inverse square roots. It does not provide a general symbolic real-domain checker; keep inputs in the intended domain. Dividing by zero remains an error in the mathematics even if a floating-point runtime emits a warning and infinity.

## Matrix multiplication

For $Y=AB$, $G_A=G_YB^\top$ and $G_B=A^\top G_Y$. With batch dimensions, transpose only the final two axes and then unbroadcast any shared batch axes. The local implementation supports operands of at least two dimensions. It deliberately rejects vector-special-case matmul to keep the rule uniform.

A projected feature matrix shared across many token rows accumulates its weight gradient over every token. That is why the right factor's gradient contracts over both example and position dimensions after the required broadcast reductions.

## Reductions, views, and indexing

A sum distributes its upstream gradient to every contributing element. A mean divides by the number of reduced elements. Keeping a reduced axis or removing it changes only shape bookkeeping, not which original elements contributed.

Reshape reverses by reshaping the gradient to the old shape. Transpose reverses by applying the inverse permutation. These operations rearrange coordinates without adding parameters or arithmetic interactions.

Indexing reverses by scattering gradients into original locations. Repeated embedding IDs are crucial: the derivative of row lookup at every occurrence must add into the same embedding row. `np.add.at` guarantees the intended repeated-index accumulation. A simple advanced-index assignment can lose repeated updates.

## Smooth nonlinearities

For exponential, derivative equals the output, so reuse the saved result. For logarithm, divide the upstream gradient by the input. For tanh, multiply by $1-y^2$. These are local rules composed by the graph; no operation needs to know the entire network structure.

The tests compare each rule and several compositions against central differences. A finite difference is an independent numerical approximation, not a replacement for deriving a correct reverse rule.

## Stable log-softmax

Subtract a row maximum, exponentiate shifted logits, sum exponentials, take log, and subtract that log-normalizer. This avoids large positive exponentials. The numerical maximum is treated as a constant in this small implementation. Why is that legitimate for the composed log-softmax?

Let $u=z-c\mathbf1$ and $f(u)=u-\log\sum_j e^{u_j}$. For any scalar $c$, $f(z-c\mathbf1)=f(z)$. The derivative in the common-shift direction is zero. Therefore the contribution from differentiating the shift cancels in the full function. This argument concerns the complete shift-invariant expression; dropping the derivative of an arbitrary stabilization term elsewhere would not automatically be correct.

A row with no finite allowed logits is undefined. The ordinary numerical softmax rejects it. The causal decoder guarantees a diagonal allowed entry for every actual input position; padding-specific all-masked cases are discussed in lesson 14.

## Layer normalization

`layer_norm` subtracts each token's feature mean, computes its mean squared centered value, adds epsilon, takes inverse square root, and multiplies. The autodiff engine composes the primitive rules, including the dependence of the mean and variance on every feature.

The small decoder omits learned normalization scale and shift. This is a documented architectural simplification, not a claim that those parameters are absent from production models.

## Full decoder forward pass

1. Look up token embeddings and add learned absolute positions.
2. Normalize each token's feature vector.
3. Project to queries, keys, and values.
4. Reshape and transpose into heads.
5. Compute scaled scores and add the fixed causal mask.
6. Normalize over keys and read values.
7. Restore head order, merge channels, and apply output projection.
8. Add the attention result to the original residual stream.
9. Normalize, apply an expanded tanh feed-forward map, project down, and add again.
10. Normalize the final features and project to vocabulary logits.

Every step preserves the earlier token's independence from future token IDs. Tokenwise operations preserve it directly; masked attention preserves it by restricting visible keys. This is tested behaviorally by changing a future token and comparing earlier logits.

## Loss, update, and generation

The loss selects target log-probabilities and computes a mean or explicitly masked weighted mean. A zero total supervised weight is rejected. After backward, `step` measures the joint gradient norm, rescales if needed, updates parameters, and zeros their gradients.

Generation runs a new forward pass on each growing or cropped prefix. It does not use a key/value cache. When the prefix exceeds the learned position table, it takes the latest context window and restarts absolute indices for that window. This is a defined toy inference policy with a context limitation. It is not equivalent to an unlimited-context model.

## From this engine to PyTorch

| Local concept | Typical PyTorch counterpart | What to preserve |
|---|---|---|
| `Tensor.data` arrays | `torch.Tensor` values | Shape, dtype, device |
| Leaf parameters | `torch.nn.Parameter` | Which arrays are trainable |
| Reverse rules | Autograd | The same computation graph semantics |
| Parameter list | `module.parameters()` | Correct optimizer coverage |
| Clearing gradients | `optimizer.zero_grad()` | Accumulation policy |
| Explicit update | Optimizer step | Learning-rate and optimizer definition |
| Local causal attention | Explicit operations or documented SDPA API | Mask convention, scale, dropout, causality |
| Local embedding lookup | `torch.nn.Embedding` | Repeated-index gradient accumulation |

This is a conceptual mapping, not an executed PyTorch port. PyTorch is not installed in the checked environment and is not required by the delivered examples. Consult the official versioned documentation before choosing an accelerated backend or relying on its mask semantics.
