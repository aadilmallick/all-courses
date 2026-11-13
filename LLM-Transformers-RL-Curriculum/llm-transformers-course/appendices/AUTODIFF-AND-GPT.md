# Read and reconstruct the numerical implementation

The source of truth is [core.py](../code/core.py). This appendix explains its design so the course does not depend on an unexplained framework. Read lessons 01–06 before the autodiff discussion and lessons 11–18 before the full decoder.

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
