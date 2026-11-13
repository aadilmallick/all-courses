# 42. Attention masks, positions, multihead attention, and GQA

[Previous](41-attention-derivation.md) · [Course index](../README.md) · [Next](43-transformer-architectures.md)

## Information access is part of the model

A causal mask allows key position $j$ when $j\le i$ for query position $i$. A padding mask excludes positions that contain no real observation. A packed-document mask prevents one training document from attending to unrelated concatenated documents. These constraints can be combined, but they represent different reasons to exclude an edge.

A forbidden score receives negative infinity before softmax, giving zero weight in the mathematical limit. Every query row must still have an allowed finite score. A row of all negative infinity has undefined normalization. Boolean mask conventions differ between APIs: in PyTorch scaled-dot-product attention, true means allowed; a key-padding mask in another module can use true to mean excluded. Check the selected API.

Without position information, ordinary self-attention is permutation equivariant. Position embeddings, relative biases, or rotary transformations supply order. An encoder's bidirectional access and a decoder's causal access are constraints on information flow; the names alone do not define an objective or guarantee a particular capability.

## Full mask, head, and positional laboratories
## Visibility defines the task

A decoder at position $i$ predicts the token at position $i+1$ using positions no later than $i$. The allowed matrix is $M_{ij}=\mathbf1[j\le i]$. Before softmax, set disallowed scores to negative infinity. Their exponentials become zero, so they contribute neither probability nor output.

Masking after softmax by setting some probabilities to zero generally leaves rows summing to less than one. Renormalization could repair that, but masking logits is simpler and gives the intended definition directly. Using a finite large negative constant is only an approximation; its adequacy depends on score range and precision.

## Distinguish four different masks

A key-padding mask prevents queries from reading padded keys. It need not prevent padded query positions from producing outputs. A loss mask excludes unwanted target positions from the objective. A causal mask hides future keys. A document-boundary mask prevents one packed document from reading another. They solve different problems and may need to be combined.

For token validity $v_j$, document ID $d_j$, and query position $i$, a packed decoder can allow $j$ when $j\le i$, $v_j$ is true, and $d_j=d_i$. Position numbering is a separate choice. Resetting position IDs at document boundaries can be appropriate but does not replace the document mask.

## Prove the no-future-dependence property

In a single causal attention layer, output row $i$ depends only on values and scores from positions $j\le i$. Tokenwise feed-forward and normalization operations do not mix positions. A residual connection preserves the same dependency. By induction over layers, a stack built only from these operations remains independent of future input tokens at row $i$. Positionwise normalization is essential: normalizing across time would break this argument.

This proof assumes the inputs at earlier positions themselves do not contain future information. Preprocessing or incorrectly aligned labels can leak future tokens even if the attention mask is correct.

## Test behavior, not only mask shape

The experiment changes the final value vector by a large amount and checks that earlier outputs are unchanged. It then adds document IDs to show how packed examples remain separated. The last query is intentionally valid so every tested row has at least one visible key.

Left padding requires additional care: a padded query may have no valid earlier keys. You can avoid computing such rows, allow a harmless key and mask their loss, or use a backend's documented handling. Do not assume all-masked rows produce useful zeros; a straightforward softmax gives undefined values.

Optional application: create two packed documents of lengths two and three, alter every token in the first, and check the second document's outputs are unchanged. Check both attention and loss accounting. A causal-only mask would fail the document-isolation test.

### A two-token leakage counterexample

Let values be scalar $(0,10)$ and all unmasked scores zero. Without a causal mask, the first output is five because it reads both tokens equally. With the allowed first row `(True, False)`, its output is zero. Now multiply the original unmasked probabilities by `(1,0)` after softmax: output is still zero in this particular value example, hiding the normalization defect. Change values to $(2,10)$: correct causal output is two, while post-softmax zeroing gives one. A test that uses only zeros can therefore miss a real masking error.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention
rng = np.random.default_rng(14)
q, k, v = [rng.normal(size=(4, 3)) for _ in range(3)]
causal = np.tril(np.ones((4, 4), dtype=bool))
base, weights = attention(q, k, v, causal)
changed = v.copy()
changed[-1] += 100
modified, _ = attention(q, k, changed, causal)
assert np.allclose(base[:-1], modified[:-1])
assert np.allclose(weights[~causal], 0)
document = np.array([0, 0, 1, 1])
packed = causal & (document[:, None] == document[None, :])
_, packed_weights = attention(q, k, v, packed)
assert np.allclose(packed_weights[2:, :2], 0)
print('causal weights', weights, 'packed weights', packed_weights)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(14)
```

#### Stage 4

```python
q, k, v = [rng.normal(size=(4, 3)) for _ in range(3)]
```

An observed state during this stage was:

- `q`: `[[ 0.69552 -0.97947 -1.57349]  [-2.92497 -0.35323  1.24761]  [ 0.03307  0.51184  1.02324]  [-0.88215  2.65229 -0.87691]]`
- `k`: `[[ 0.37355  2.73958 -0.11425]  [ 0.11429 -0.51188  0.33453]  [-2.12668 -0.64681  1.69409]  [ 0.21133 -0.2404   0.37293]]`
- `v`: `[[ 0.41461  0.1521   0.57859]  [-1.6596   0.59126 -0.67353]  [ 0.7858  -0.02125 -0.99818]  [-0.07213 -1.00708  1.01273]]`

#### Stage 5

```python
causal = np.tril(np.ones((4, 4), dtype=bool))
```

An observed state during this stage was:

- `causal`: `[[ True False False False]  [ True  True False False]  [ True  True  True False]  [ True  True  True  True]]`

#### Stage 6

```python
base, weights = attention(q, k, v, causal)
```

An observed state during this stage was:

- `base`: `[[ 0.41461  0.1521   0.57859]  [-1.25718  0.50606 -0.43061]  [ 0.15602  0.16844 -0.30753]  [ 0.40062  0.1434   0.56235]]`
- `weights`: `[[1.      0.      0.      0.     ]  [0.19401 0.80599 0.      0.     ]  [0.39741 0.19721 0.40538 0.     ]  [0.97741 0.00612 0.00782 0.00865]]`

#### Stage 7

```python
changed = v.copy()
```

An observed state during this stage was:

- `changed`: `[[ 0.41461  0.1521   0.57859]  [-1.6596   0.59126 -0.67353]  [ 0.7858  -0.02125 -0.99818]  [-0.07213 -1.00708  1.01273]]`

#### Stage 8

```python
changed[-1] += 100
```

An observed state during this stage was:

- `changed`: `[[ 4.14607e-01  1.52103e-01  5.78588e-01]  [-1.65960e+00  5.91255e-01 -6.73527e-01]  [ 7.85803e-01 -2.12467e-02 -9.98183e-01]  [ 9.99279e+01  9.89929e+01  1.01013e+02]]`

#### Stage 9

```python
modified, _ = attention(q, k, changed, causal)
```

An observed state during this stage was:

- `modified`: `[[ 0.41461  0.1521   0.57859]  [-1.25718  0.50606 -0.43061]  [ 0.15602  0.16844 -0.30753]  [ 1.26569  1.00847  1.42742]]`

#### Stage 10

```python
assert np.allclose(base[:-1], modified[:-1])
```

#### Stage 11

```python
assert np.allclose(weights[~causal], 0)
```

#### Stage 12

```python
document = np.array([0, 0, 1, 1])
```

An observed state during this stage was:

- `document`: `[0 0 1 1]`

#### Stage 13

```python
packed = causal & (document[:, None] == document[None, :])
```

An observed state during this stage was:

- `packed`: `[[ True False False False]  [ True  True False False]  [False False  True False]  [False False  True  True]]`

#### Stage 14

```python
_, packed_weights = attention(q, k, v, packed)
```

An observed state during this stage was:

- `packed_weights`: `[[1.      0.      0.      0.     ]  [0.19401 0.80599 0.      0.     ]  [0.      0.      1.      0.     ]  [0.      0.      0.47491 0.52509]]`

#### Stage 15

```python
assert np.allclose(packed_weights[2:, :2], 0)
```

#### Stage 16

```python
print('causal weights', weights, 'packed weights', packed_weights)
```

Run from the course root:

```bash
python code/neural/14_attention_masks.py
```

### Recorded output from the supplied environment

```text
causal weights [[1.         0.         0.         0.        ]
 [0.19400791 0.80599209 0.         0.        ]
 [0.39740975 0.19721439 0.40537585 0.        ]
 [0.97741014 0.00611523 0.00782393 0.0086507 ]] packed weights [[1.         0.         0.         0.        ]
 [0.19400791 0.80599209 0.         0.        ]
 [0.         0.         1.         0.        ]
 [0.         0.         0.47490765 0.52509235]]
```

## Several learned reads in parallel

A single head produces one weighted combination for each query. Multiple heads use separate projections, allowing different compatibility spaces and value mixtures. For head $h$, compute $O_h=\operatorname{Attention}(XW_Q^h,XW_K^h,XW_V^h)$, concatenate the results, and apply output projection $W_O$.

With total width $D$ and $H$ heads, a common choice is $d=D/H$. Each head's score scale is $\sqrt d$, not $\sqrt D$. Concatenation reconstructs width $D$; it is not averaging heads. $W_O$ can mix their channels after the separate reads.

## Derive the tensor transformations

A projected array starts at $(B,T,D)$. Reshape it to $(B,T,H,d)$, then transpose to $(B,H,T,d)$. Multiplication by transposed keys produces $(B,H,T,T)$. Multiplying weights by values returns $(B,H,T,d)$. Transpose back to $(B,T,H,d)$ before flattening heads. These operations change indexing but introduce no learned parameters.

One can implement all head projections as a single matrix because selecting slices of its output is equivalent to separate matrices concatenated along columns. The separate attention normalizations remain essential; combining all heads into one softmax would be a different model.

## Why share keys and values

During autoregressive decoding, past keys and values are cached. Multi-query attention uses $H$ query heads but one key and one value head. Grouped-query attention uses an intermediate number $G$ of key/value heads, with $G$ dividing $H$. Each group of $H/G$ query heads shares keys and values.

For $L$ layers, batch $B$, context $T$, key/value width $d$, and element size $b$ bytes, cache size is approximately $2LBGTdb$. The factor two stores keys and values. With $G=H$, this is ordinary multi-head caching; with $G=1$, the cache can be much smaller. Model architecture and training must support the sharing; simply dropping cache heads is not an equivalent conversion.

Active arithmetic, memory capacity, and bandwidth are separate constraints. Fewer key/value heads reduce cache traffic, but projection costs and kernel behavior also matter. A smaller asymptotic memory formula does not alone predict measured latency.

## Implementation boundary

The code expands grouped keys/values into query-head order to express the mathematics clearly. An efficient kernel may avoid physically copying them. The assertion compares one group against its corresponding individual query head. Head order is contiguous within each group in this example; a different mapping requires a different repeat or indexing operation.

Optional application: compare cache bytes for $H=8$ and $G=2$ with all other quantities fixed. The key/value cache ratio is four, while the query-head count remains eight. This is a memory statement, not a claim of fourfold end-to-end speedup.

### Count projection parameters explicitly

With full width $D$, ordinary query, key, value, and output matrices each have $D^2$ parameters when biases are omitted, totaling $4D^2$. Splitting into heads changes indexing, not this total under the standard fixed-width design. With $H$ query heads, $G$ key/value heads, and per-head width $d=D/H$, query and output still cost $D^2$ each, while key and value each cost $DGd$. Total is $2D^2+2DGd$. This count excludes feed-forward layers and normalization. It makes clear which weights GQA changes and which costs remain.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention
rng = np.random.default_rng(15)
batch, heads, groups, tokens, width = 1, 4, 2, 3, 2
q = rng.normal(size=(batch, heads, tokens, width))
k = rng.normal(size=(batch, groups, tokens, width))
v = rng.normal(size=(batch, groups, tokens, width))
expanded_k = np.repeat(k, heads // groups, axis=1)
expanded_v = np.repeat(v, heads // groups, axis=1)
output, _ = attention(q, expanded_k, expanded_v)
individual, _ = attention(q[:, 2], k[:, 1], v[:, 1])
assert np.allclose(output[:, 2], individual)
print('output shape', output.shape, 'cache head ratio', heads / groups)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(15)
```

#### Stage 4

```python
batch, heads, groups, tokens, width = 1, 4, 2, 3, 2
```

An observed state during this stage was:

- `batch`: `1`
- `heads`: `4`
- `groups`: `2`
- `tokens`: `3`

#### Stage 5

```python
q = rng.normal(size=(batch, heads, tokens, width))
```

An observed state during this stage was:

- `q`: `array shape=(1, 4, 3, 2), min=-1.56054, max=2.09408, norm=4.88392`

#### Stage 6

```python
k = rng.normal(size=(batch, groups, tokens, width))
```

An observed state during this stage was:

- `k`: `[[[[ 1.44331 -0.6133 ]    [ 0.07777 -0.81298]    [-0.42233 -2.27945]]    [[ 0.73884 -0.72261]    [-0.0727   0.44573]    [ 0.33909 -1.31423]]]]`

#### Stage 7

```python
v = rng.normal(size=(batch, groups, tokens, width))
```

An observed state during this stage was:

- `v`: `[[[[ 1.51817  0.75731]    [ 0.50014 -0.6596 ]    [-1.60428 -1.63016]]    [[-0.20842  0.16067]    [-0.70336  1.82945]    [ 0.30114  0.99852]]]]`

#### Stage 8

```python
expanded_k = np.repeat(k, heads // groups, axis=1)
```

An observed state during this stage was:

- `expanded_k`: `array shape=(1, 4, 3, 2), min=-2.27945, max=1.44331, norm=4.81969`

#### Stage 9

```python
expanded_v = np.repeat(v, heads // groups, axis=1)
```

An observed state during this stage was:

- `expanded_v`: `array shape=(1, 4, 3, 2), min=-1.63016, max=1.82945, norm=5.25228`

#### Stage 10

```python
output, _ = attention(q, expanded_k, expanded_v)
```

An observed state during this stage was:

- `output`: `array shape=(1, 4, 3, 2), min=-1.36305, max=1.36203, norm=3.69332`

#### Stage 11

```python
individual, _ = attention(q[:, 2], k[:, 1], v[:, 1])
```

An observed state during this stage was:

- `individual`: `[[[-0.23802  1.0143 ]   [-0.45954  1.32248]   [-0.48961  1.36203]]]`

#### Stage 12

```python
assert np.allclose(output[:, 2], individual)
```

#### Stage 13

```python
print('output shape', output.shape, 'cache head ratio', heads / groups)
```

Run from the course root:

```bash
python code/neural/15_multihead_gqa.py
```

### Recorded output from the supplied environment

```text
output shape (1, 4, 3, 2) cache head ratio 2.0
```

## Attention alone does not know sequence order

Without positional information or order-dependent masks, self-attention is permutation equivariant: permuting input rows permutes output rows correspondingly. This follows because the score matrix receives the same permutation on rows and columns, rowwise softmax respects that reindexing, and values are permuted consistently. It cannot distinguish all order-dependent tasks merely from token identity.

Learned absolute embeddings add a trainable position vector to each token embedding. Sinusoidal embeddings use deterministic sine/cosine coordinates at different frequencies. Relative position biases instead add a function of $i-j$ to scores. These are different ways to introduce order, with different extrapolation assumptions.

## Derive rotary position embeddings in two dimensions

For angle $\theta$, define

$$R(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}.$$

For column vectors, rotate query at position $m$ by $R(m\omega)$ and key at position $n$ by $R(n\omega)$. Their dot product becomes

$$(R(m\omega)q)^\top R(n\omega)k
=q^\top R(m\omega)^\top R(n\omega)k
=q^\top R((n-m)\omega)k.$$

The first equality moves the left rotation through the transpose. Orthogonality gives $R(\theta)^\top=R(-\theta)$; angle addition gives the final relative rotation. Thus the score contains relative position even though each vector is transformed using its absolute position.

In larger even width, apply a rotation to each coordinate pair using a prescribed frequency schedule. Pairing conventions differ across implementations. You must match the convention and schedule used during training. Values are usually not rotated in standard RoPE attention.

## Relative does not mean unlimited extrapolation

The formula can be evaluated at arbitrary positions, but a model trained on short sequences may not generalize to the resulting phase patterns and attention distributions. Numerical existence is not learned competence. Frequency scaling and position interpolation alter the geometry and often require evaluation or further training.

ALiBi adds a head-specific linear distance penalty to causal scores. It has different structure from rotation: the penalty changes with distance regardless of content, whereas RoPE modifies the content-dependent dot product.

## Trace the program

Our helper takes a two-dimensional column-vector convention, implemented by a matrix-vector product. The assertion checks the exact relative-angle identity numerically and also checks norm preservation. It does not check a whole long-context model.

Optional worked calculation: choose $q=(1,0)$ and $k=(1,0)$. The rotated dot product is $\cos((n-m)\omega)$. Identical content can therefore receive different compatibility scores at different relative distances. With multiple frequencies, these effects superpose across pairs.

### Expand a rotary score coordinate by coordinate

Let $q=(q_1,q_2)$, $k=(k_1,k_2)$, and relative angle $\delta$. Multiplying by the rotation gives $q^\top R(\delta)k=(q_1k_1+q_2k_2)\cos\delta+(q_2k_1-q_1k_2)\sin\delta$. The first coefficient is the ordinary content dot product; the second captures an oriented cross-term. This expansion is useful for checking rotation sign conventions. Swapping the relative-position definition from $n-m$ to $m-n$ changes the sine sign, so code and derivation must use one convention consistently.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
def rotation(angle):
    c, s = np.cos(angle), np.sin(angle)
    return np.array([[c, -s], [s, c]])
q, k = np.array([1., 2.]), np.array([-0.5, 0.7])
m, n, frequency = 3, 8, 0.2
rotated_q, rotated_k = rotation(m * frequency) @ q, rotation(n * frequency) @ k
left = rotated_q @ rotated_k
right = q @ rotation((n-m) * frequency) @ k
assert np.allclose(left, right)
assert np.allclose(np.linalg.norm(q), np.linalg.norm(rotated_q))
print('absolute rotation score', left, 'relative rotation score', right)

```

### Code structure and observed intermediate values


#### Stage 2

```python
def rotation(angle):
    c, s = np.cos(angle), np.sin(angle)
    return np.array([[c, -s], [s, c]])
```

#### Stage 3

```python
q, k = np.array([1., 2.]), np.array([-0.5, 0.7])
```

An observed state during this stage was:

- `q`: `[1. 2.]`
- `k`: `[-0.5  0.7]`

#### Stage 4

```python
m, n, frequency = 3, 8, 0.2
```

An observed state during this stage was:

- `m`: `3`
- `n`: `8`
- `frequency`: `0.2`

#### Stage 5

```python
rotated_q, rotated_k = rotation(m * frequency) @ q, rotation(n * frequency) @ k
```

An observed state during this stage was:

- `rotated_q`: `[-0.30395  2.21531]`
- `rotated_k`: `[-0.6851  -0.52023]`

#### Stage 6

```python
left = rotated_q @ rotated_k
```

An observed state during this stage was:

- `left`: `-0.9442286`

#### Stage 7

```python
right = q @ rotation((n-m) * frequency) @ k
```

An observed state during this stage was:

- `right`: `-0.9442286`

#### Stage 8

```python
assert np.allclose(left, right)
```

#### Stage 9

```python
assert np.allclose(np.linalg.norm(q), np.linalg.norm(rotated_q))
```

#### Stage 10

```python
print('absolute rotation score', left, 'relative rotation score', right)
```

Run from the course root:

```bash
python code/neural/16_position_rope.py
```

### Recorded output from the supplied environment

```text
absolute rotation score -0.9442285988920982 relative rotation score -0.9442285988920983
```## 5.16 Combining padding and causality explicitly

For functional attention, let `valid_keys` have shape `[B, T]`, with true for actual tokens. Let a lower-triangular Boolean matrix of shape `[T, T]` mark causal permission. Their logical conjunction can create an allowed mask broadcastable to `[B, H, T, T]`.

```python
import torch
from torch.nn import functional as F

batch, heads, length, width = 2, 2, 4, 3
query = torch.randn(batch, heads, length, width)
key = torch.randn_like(query)
value = torch.randn_like(query)
valid_keys = torch.tensor([[True, True, True, True],
                           [True, True, False, False]])
causal = torch.ones(length, length, dtype=torch.bool).tril()
allowed = causal[None, None, :, :] & valid_keys[:, None, None, :]
output = F.scaled_dot_product_attention(query, key, value,
                                        attn_mask=allowed, dropout_p=0.0)
output = output * valid_keys[:, None, :, None]
print(output.shape)
```

The batch dimension permits different padding patterns. The singleton head dimension shares the permission pattern across heads. The final multiplication zeroes padded query outputs, while the attention mask excludes padded keys. The example uses right padding and nonempty sequences, so real queries retain a valid prefix.

A left-padded causal sequence needs additional care because early padded queries can have no allowed valid keys. Position numbering also needs a defined policy. Rather than treating every padding arrangement as interchangeable, establish the tokenizer, batching convention, and generation convention together. A consistent simple design is easier to validate than a flexible design with untested combinations.
