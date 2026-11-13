# 41. Attention from weighted retrieval through full backpropagation

[Previous](40-tokenization-embeddings.md) · [Course index](../README.md) · [Next](42-masks-position-multihead.md)

## A query retrieves a weighted combination

Let queries $Q:(B,H,L,d_k)$, keys $K:(B,H,S,d_k)$, and values $V:(B,H,S,d_v)$. Scores are $S=QK^\top/\sqrt{d_k}$. Softmax normalizes each query row over allowed keys: $A=\operatorname{softmax}(S)$. Output is $O=AV$. The row weights are nonnegative and sum to one, so each output lies in the convex hull of its value rows before any following projection.

The scale compensates for a dot product's variance growing with dimension under a rough independent unit-variance coordinate model. This is a motivation, not a guarantee that real learned queries and keys are independent Gaussians.

For upstream $G=\partial L/\partial O$, $\nabla_V L=A^\top G$, $\nabla_A L=GV^\top$. For one row, softmax derivative gives $\nabla_S=A\odot(\nabla_A-\sum_jA_j\nabla_{A_j})$. Then $\nabla_Q=\nabla_SK/\sqrt{d_k}$ and $\nabla_K=\nabla_S^\top Q/\sqrt{d_k}$. The following numerical laboratories expand and test that entire chain.

## Retrieval, scaling, and the backward pass
## Separate deciding where to read from what is read

Imagine three memory slots. Each has an address-like key and a content-like value. A query scores keys, a normalization produces nonnegative weights, and a weighted sum returns content. Keys and values need not have the same width. This analogy explains the operation, but a neural key is a continuous learned vector, not a literal database address.

For scores $s_1,\ldots,s_N$, weights are $a_i=\operatorname{softmax}(s)_i$. Values $v_i\in\mathbb R^{D_v}$ produce output $o=\sum_i a_iv_i$. Since $a_i\ge0$ and $\sum_i a_i=1$, $o$ lies in the convex hull of values. It may combine incompatible facts; being a convex combination does not make it a valid symbolic answer.

## Work a two-slot read

Let scores be $(0,\log3)$ and scalar values be $(2,10)$. Exponentials are $(1,3)$, weights are $(1/4,3/4)$, and output is $(1/4)2+(3/4)10=8$. Uniform scores instead give output six. Increasing the second score shifts mass toward ten continuously.

Differentiate the output with respect to score $s_k$. Softmax's derivative is $\partial a_i/\partial s_k=a_i(\mathbf1[i=k]-a_k)$. Therefore

$$\frac{\partial o}{\partial s_k}
=\sum_i v_i a_i(\mathbf1[i=k]-a_k)
=a_k(v_k-o).$$

The first sum selects $a_kv_k$; the second is $a_k\sum_i a_iv_i=a_ko$. A slot changes the result most when it has appreciable weight and its value differs from the current output. If all values are identical, score gradients vanish because changing the mixture does not change the output.

## Soft selection is not discrete lookup

A low temperature sharpens weights but generally does not create exact one-hot selection for finite scores. As temperature tends to zero, a unique maximum dominates; ties share mass. Hard argmax loses ordinary derivatives at switches and has zero derivative almost everywhere elsewhere. Replacing soft attention by argmax changes the learning problem.

Attention weights are also not a general causal explanation. The output depends on values, subsequent layers, residual streams, and the task. Changing a weight while holding everything else fixed is a different intervention from removing a token and recomputing the network.

The experiment confirms the score derivative from the equation. Its values are two-dimensional, so we scalarize the output with a chosen readout before comparing derivatives. This is exactly how reverse mode carries an upstream gradient through a vector-valued operation.

### A convex mixture can erase a useful distinction

Let values be $v_1=(1,0)$ and $v_2=(0,1)$ with equal weights. The output is $(1/2,1/2)$. It is distinct from both slots, and a later linear readout cannot recover which slot should have been chosen from this output alone when many weight/value configurations yield the same mixture. Multiple heads or nonlinear downstream processing can preserve or exploit more information, but soft attention itself is an aggregation. If all values equal $v$, output remains $v$ for every score vector; differentiating confirms every addressing gradient is zero.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax, finite_difference
scores = np.array([0., np.log(3)])
values = np.array([[2., -1.], [10., 3.]])
readout = np.array([0.4, -0.2])
weights = softmax(scores)
output = weights @ values
gradient = weights * ((values - output) @ readout)
def scalar_output(energy):
    return float((softmax(energy) @ values) @ readout)
assert np.allclose(gradient, finite_difference(scalar_output, scores), atol=1e-7)
print('weights', weights, 'output', output, 'score gradient', gradient)

```

### Code structure and observed intermediate values


#### Stage 3

```python
scores = np.array([0., np.log(3)])
```

An observed state during this stage was:

- `scores`: `[0.      1.09861]`

#### Stage 4

```python
values = np.array([[2., -1.], [10., 3.]])
```

An observed state during this stage was:

- `values`: `[[ 2. -1.]  [10.  3.]]`

#### Stage 5

```python
readout = np.array([0.4, -0.2])
```

An observed state during this stage was:

- `readout`: `[ 0.4 -0.2]`

#### Stage 6

```python
weights = softmax(scores)
```

An observed state during this stage was:

- `weights`: `[0.25 0.75]`

#### Stage 7

```python
output = weights @ values
```

An observed state during this stage was:

- `output`: `[8. 2.]`

#### Stage 8

```python
gradient = weights * ((values - output) @ readout)
```

An observed state during this stage was:

- `gradient`: `[-0.45  0.45]`

#### Stage 9

```python
def scalar_output(energy):
    return float((softmax(energy) @ values) @ readout)
```

#### Stage 10

```python
assert np.allclose(gradient, finite_difference(scalar_output, scores), atol=1e-7)
```

#### Stage 11

```python
print('weights', weights, 'output', output, 'score gradient', gradient)
```

Run from the course root:

```bash
python code/neural/11_attention_weighted_retrieval.py
```

### Recorded output from the supplied environment

```text
weights [0.25 0.75] output [8. 2.] score gradient [-0.45  0.45]
```

## Turn hidden vectors into a learned read mechanism

Let $X\in\mathbb R^{T\times D}$. Projections create $Q=XW_Q$, $K=XW_K$, and $V=XW_V$. For query position $i$ and key position $j$, score $S_{ij}=q_i^\top k_j/\sqrt{d_k}$. Apply softmax across key positions $j$, then multiply by values:

$$A=\operatorname{softmax}_{\text{keys}}(QK^\top/\sqrt{d_k}),\qquad O=AV.$$

Shapes explain the calculation: $Q$ is $(T,d_k)$, $K^\top$ is $(d_k,T)$, the score matrix is $(T,T)$, and $V$ is $(T,d_v)$. Consequently $O$ is $(T,d_v)$. Every output row has its own distribution over keys. Softmax across queries would normalize the wrong decision.

## A numerical score

For $q=(1,0)$, $k_1=(1,0)$, and $k_2=(0,1)$, raw dot products are one and zero. Divide by $\sqrt2$ to obtain approximately $0.7071$ and zero. The first weight is $e^{0.7071}/(e^{0.7071}+1)\approx0.6698$. With values $(2,0)$ and $(0,4)$, output is approximately $(1.3395,1.3209)$.

## Why the square root appears

Assume each component of $q,k$ has mean zero and variance one, with the independence conditions needed to make products uncorrelated. The dot product is $\sum_{r=1}^{d_k}q_rk_r$. Each product has mean zero and variance one; summing uncorrelated products gives variance $d_k$. Division by $\sqrt{d_k}$ gives variance one. This is an initialization-scale argument. Trained queries and keys need not satisfy those assumptions exactly.

Large score gaps make softmax nearly one-hot, which can make its score derivatives small. Scaling reduces this saturation tendency at initialization. It does not guarantee numerical stability on arbitrary data; stable normalization and suitable precision are still required.

## Why use three projections

A token can ask one kind of question, advertise another matching description, and provide different content. Independent projections let those roles differ. If $Q=K$ before masking, $QK^\top$ is symmetric, but row-normalized attention need not be symmetric because row denominators differ. With separate projections, scores need not even be symmetric.

The code computes both vectorized and explicit-loop attention. It uses distinct value width to reinforce that matching width and content width are independent choices. A successful agreement checks implementation against this definition. It does not establish that a random set of projections has learned useful language relationships.

Optional application: rescale both queries and keys by two. Scores grow by four, so attention sharpens. Rescaling values by two instead doubles outputs while leaving weights unchanged. These interventions distinguish addressing from content.

### Check scaling assumptions rather than memorizing a constant

Suppose independent coordinates instead have $\operatorname{Var}(q_r)=\sigma_q^2$ and $\operatorname{Var}(k_r)=\sigma_k^2$, both mean zero. Then each product has variance $\sigma_q^2\sigma_k^2$, so the dot product variance is $d_k\sigma_q^2\sigma_k^2$. Division by $\sqrt{d_k}$ leaves variance $\sigma_q^2\sigma_k^2$, not necessarily one. Learned projections, normalization, and correlations determine the actual distribution. This calculation explains both why the square root is sensible and why it is not a universal cure for arbitrary activation scales.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention, softmax
query = np.array([[1., 0.], [0., 1.]])
key = np.array([[1., 0.], [0., 1.], [1., 1.]])
value = np.array([[2., 0., 1.], [0., 4., -1.], [1., 1., 0.]])
output, weights = attention(query, key, value)
manual = []
for row in query:
    scores = np.array([sum(row[d] * slot[d] for d in range(2)) / np.sqrt(2) for slot in key])
    manual.append(softmax(scores) @ value)
assert np.allclose(output, manual)
assert np.allclose(weights.sum(axis=-1), 1)
print('weights', weights, 'output', output)

```

### Code structure and observed intermediate values


#### Stage 3

```python
query = np.array([[1., 0.], [0., 1.]])
```

An observed state during this stage was:

- `query`: `[[1. 0.]  [0. 1.]]`

#### Stage 4

```python
key = np.array([[1., 0.], [0., 1.], [1., 1.]])
```

An observed state during this stage was:

- `key`: `[[1. 0.]  [0. 1.]  [1. 1.]]`

#### Stage 5

```python
value = np.array([[2., 0., 1.], [0., 4., -1.], [1., 1., 0.]])
```

An observed state during this stage was:

- `value`: `[[ 2.  0.  1.]  [ 0.  4. -1.]  [ 1.  1.  0.]]`

#### Stage 6

```python
output, weights = attention(query, key, value)
```

An observed state during this stage was:

- `output`: `[[ 1.20334  1.19222  0.20334]  [ 0.79666  2.00556 -0.20334]]`
- `weights`: `[[0.40111 0.19778 0.40111]  [0.19778 0.40111 0.40111]]`

#### Stage 7

```python
manual = []
```

An observed state during this stage was:

- `manual`: `[]`

#### Stage 8

```python
for row in query:
    scores = np.array([sum(row[d] * slot[d] for d in range(2)) / np.sqrt(2) for slot in key])
    manual.append(softmax(scores) @ value)
```

An observed state during this stage was:

- `manual`: `[array([1.20333628, 1.19221535, 0.20333628]), array([ 0.79666372,  2.00556046, -0.20333628])]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 9

```python
assert np.allclose(output, manual)
```

#### Stage 10

```python
assert np.allclose(weights.sum(axis=-1), 1)
```

#### Stage 11

```python
print('weights', weights, 'output', output)
```

Run from the course root:

```bash
python code/neural/12_scaled_dot_product_attention.py
```

### Recorded output from the supplied environment

```text
weights [[0.40111209 0.19777581 0.40111209]
 [0.19777581 0.40111209 0.40111209]] output [[ 1.20333628  1.19221535  0.20333628]
 [ 0.79666372  2.00556046 -0.20333628]]
```

## Work backward through exactly three operations

Write $S=QK^\top/\sqrt d$, $A=\operatorname{softmax}(S)$ rowwise, and $O=AV$. Suppose a scalar objective supplies upstream matrix $G=\partial L/\partial O$. We will derive all three input gradients without constructing a four-dimensional Jacobian.

For $O_{ic}=\sum_jA_{ij}V_{jc}$, differentiation gives

$$G_V=A^\top G,\qquad G_A=GV^\top.$$

The first sums contributions from every query that read a value; the second measures how changing a weight changes the upstream objective. Check dimensions: $G_V$ has the shape of $V$, and $G_A$ has the shape of $A$.

For one row $a=\operatorname{softmax}(s)$ with upstream $g$, its score gradient is $a\odot(g-\langle a,g\rangle)$. Expand coordinate $k$: $\sum_jg_ja_j(\mathbf1[j=k]-a_k)=a_kg_k-a_k\sum_jg_ja_j$. Thus for all rows,

$$G_S=A\odot\left(G_A-\operatorname{rowsum}(A\odot G_A)\right).$$

The row sum retains an axis so it broadcasts over keys. Its role is a probability-weighted baseline. Score gradients sum to zero in every row, consistent with softmax's invariance to adding a row constant.

Finally, use matrix-product derivatives:

$$G_Q=G_SK/\sqrt d,\qquad G_K=G_S^\top Q/\sqrt d.$$

If $Q=XW_Q$, the projection contributes $G_QW_Q^\top$ to $G_X$. Add analogous key and value contributions because the input appears on three paths. Weight gradients are $X^\top G_Q$, $X^\top G_K$, and $X^\top G_V$.

## What masking changes

A fixed disallowed score is replaced by negative infinity before normalization. Its probability is zero, so its score gradient is zero. Gradients must not flow into the overwritten score. Every query needs at least one allowed key; otherwise normalization is undefined. In a numerical implementation, avoid multiplying unrelated infinities by zero in loss code.

## Read the independent check

The experiment defines $L=\sum O\odot G$. This linear scalarization supplies an arbitrary upstream derivative and tests the full local backward operation. It compares each analytical input gradient with central differences while holding the other inputs fixed. All arrays are small and use float64 to reduce roundoff.

An important edge case is a single allowed key: its weight is always one, so key and query score gradients vanish, while its value still receives a gradient. Another is identical values: addressing gradients can vanish even when value gradients do not. These are consequences of the operation, not bugs.

Optional application: chain the three projections from a shared input and compare the sum of three input-gradient contributions with a finite-difference input gradient. This directly checks the shared-input accounting that a transformer relies on.

### Carry one reverse pass all the way to the shared input

For $X\in\mathbb R^{T\times D}$ and projection weights $W_Q,W_K,W_V$, compute $G_Q,G_K,G_V$ as above. The input derivative is $G_X=G_QW_Q^\top+G_KW_K^\top+G_VW_V^\top$. Every summand has shape $(T,D)$, which permits addition. Each projection weight derivative instead contracts over token positions: $G_{W_Q}=X^\top G_Q$, with analogous key and value terms. Confusing these two contractions can produce plausible shapes when widths happen to agree. Test unequal widths and lengths to reveal accidental transposes.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention, finite_difference
rng = np.random.default_rng(13)
q, k, v = rng.normal(size=(2, 3)), rng.normal(size=(4, 3)), rng.normal(size=(4, 2))
g = rng.normal(size=(2, 2))
o, a = attention(q, k, v)
gv = a.T @ g
ga = g @ v.T
gs = a * (ga - (a * ga).sum(axis=-1, keepdims=True))
gq, gk = gs @ k / np.sqrt(3), gs.T @ q / np.sqrt(3)
assert np.allclose(gs.sum(axis=-1), 0)
checks = [(gq, finite_difference(lambda z: np.sum(attention(z, k, v)[0] * g), q)),
          (gk, finite_difference(lambda z: np.sum(attention(q, z, v)[0] * g), k)),
          (gv, finite_difference(lambda z: np.sum(attention(q, k, z)[0] * g), v))]
for analytic, numeric in checks:
    assert np.allclose(analytic, numeric, atol=1e-7)
print('maximum gradient errors', [float(np.max(np.abs(a-b))) for a, b in checks])

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(13)
```

#### Stage 4

```python
q, k, v = rng.normal(size=(2, 3)), rng.normal(size=(4, 3)), rng.normal(size=(4, 2))
```

An observed state during this stage was:

- `q`: `[[ 1.82676 -3.07833  0.95806]  [ 0.06964  1.31825  0.38563]]`
- `k`: `[[ 1.82726  0.03174 -0.51623]  [ 0.58048  0.43211 -0.35684]  [-0.2473   0.71944  0.70432]  [-0.49393 -0.36771 -1.80679]]`
- `v`: `[[ 1.67921 -0.22429]  [ 1.33728  0.41747]  [ 1.94396  1.53711]  [ 0.3183   1.48076]]`

#### Stage 5

```python
g = rng.normal(size=(2, 2))
```

An observed state during this stage was:

- `g`: `[[-0.95012  1.25862]  [-1.48042  0.34324]]`

#### Stage 6

```python
o, a = attention(q, k, v)
```

An observed state during this stage was:

- `o`: `[[1.56396 0.0487 ]  [1.55544 0.86346]]`
- `a`: `[[0.77223 0.11116 0.05011 0.0665 ]  [0.20499 0.27397 0.41767 0.10337]]`

#### Stage 7

```python
gv = a.T @ g
```

An observed state during this stage was:

- `gv`: `[[-1.03719  1.0423 ]  [-0.51121  0.23394]  [-0.66594  0.20643]  [-0.21621  0.11918]]`

#### Stage 8

```python
ga = g @ v.T
```

An observed state during this stage was:

- `ga`: `[[-1.87775 -0.74515  0.08763  1.56129]  [-2.56292 -1.83645 -2.3503   0.03704]]`

#### Stage 9

```python
gs = a * (ga - (a * ga).sum(axis=-1, keepdims=True))
```

An observed state during this stage was:

- `gs`: `[[-0.34989  0.07553  0.07578  0.19858]  [-0.11409  0.04654 -0.14366  0.21121]]`

#### Stage 10

```python
gq, gk = gs @ k / np.sqrt(3), gs.T @ q / np.sqrt(3)
```

An observed state during this stage was:

- `gq`: `[[-0.41126  0.00175 -0.08761]  [-0.14449 -0.09499 -0.25433]]`
- `gk`: `[[-0.37361  0.53501 -0.21894]  [ 0.08153 -0.09882  0.05214]  [ 0.07415 -0.24402  0.00993]  [ 0.21793 -0.19217  0.15687]]`

#### Stage 11

```python
assert np.allclose(gs.sum(axis=-1), 0)
```

#### Stage 12

```python
checks = [(gq, finite_difference(lambda z: np.sum(attention(z, k, v)[0] * g), q)),
          (gk, finite_difference(lambda z: np.sum(attention(q, z, v)[0] * g), k)),
          (gv, finite_difference(lambda z: np.sum(attention(q, k, z)[0] * g), v))]
```

An observed state during this stage was:

- `checks`: `[(array([[-0.41125585,  0.00174949, -0.08761028],        [-0.14448785, -0.09499363, -0.25433127]]), array([[-0.41125585,  0.00174949, -0.08761028],        [-0.14448785, -0.09499363, -0.25433127]])), (array([[-0.37360735,  0.53501216, -0.21893941],        [ 0.08153425, -0.09881852,  0.05214289],        [ 0.07414612, -0.2440209 ,  0.00993036],       `

#### Stage 13

```python
for analytic, numeric in checks:
    assert np.allclose(analytic, numeric, atol=1e-7)
```

An observed state during this stage was:

- `analytic`: `[[-1.03719  1.0423 ]  [-0.51121  0.23394]  [-0.66594  0.20643]  [-0.21621  0.11918]]`
- `numeric`: `[[-1.03719  1.0423 ]  [-0.51121  0.23394]  [-0.66594  0.20643]  [-0.21621  0.11918]]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 14

```python
print('maximum gradient errors', [float(np.max(np.abs(a-b))) for a, b in checks])
```

An observed state during this stage was:

- `a`: `[[0.77223 0.11116 0.05011 0.0665 ]  [0.20499 0.27397 0.41767 0.10337]]`

Run from the course root:

```bash
python code/neural/13_attention_backpropagation.py
```

### Recorded output from the supplied environment

```text
maximum gradient errors [2.0035140213536806e-11, 6.29335195068137e-11, 2.7627233833982245e-11]
```
