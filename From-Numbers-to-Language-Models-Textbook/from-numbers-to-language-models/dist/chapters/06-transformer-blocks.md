# Building a transformer block: visibility, heads, position, and residual paths

## Add one responsibility at a time

An attention formula is not yet a complete language model. We need rules about what a token may see, several parallel ways to read, an indication of order, and a stable path for transforming and preserving features. Each addition solves a separate problem. Keeping them separate makes it possible to diagnose a failure without attributing everything to attention.

Consider predicting the third token of a training sentence. The model must not use that third token or any later token as evidence for its own prediction. It may need to read more than one relationship from earlier tokens. It must distinguish different orders of the same words. Finally, its output needs to retain useful local information while incorporating retrieved context. We will assemble exactly those responsibilities.

## Causal masks, padding, packed sequences, and batches

### Visibility defines the task

A decoder at position $i$ predicts the token at position $i+1$ using positions no later than $i$. The allowed matrix is $M_{ij}=\mathbf1[j\le i]$. Before softmax, set disallowed scores to negative infinity. Their exponentials become zero, so they contribute neither probability nor output.

Masking after softmax by setting some probabilities to zero generally leaves rows summing to less than one. Renormalization could repair that, but masking logits is simpler and gives the intended definition directly. Using a finite large negative constant is only an approximation; its adequacy depends on score range and precision.

### Distinguish four different masks

A key-padding mask prevents queries from reading padded keys. It need not prevent padded query positions from producing outputs. A loss mask excludes unwanted target positions from the objective. A causal mask hides future keys. A document-boundary mask prevents one packed document from reading another. They solve different problems and may need to be combined.

For token validity $v_j$, document ID $d_j$, and query position $i$, a packed decoder can allow $j$ when $j\le i$, $v_j$ is true, and $d_j=d_i$. Position numbering is a separate choice. Resetting position IDs at document boundaries can be appropriate but does not replace the document mask.

### Prove the no-future-dependence property

In a single causal attention layer, output row $i$ depends only on values and scores from positions $j\le i$. Tokenwise feed-forward and normalization operations do not mix positions. A residual connection preserves the same dependency. By induction over layers, a stack built only from these operations remains independent of future input tokens at row $i$. Positionwise normalization is essential: normalizing across time would break this argument.

This proof assumes the inputs at earlier positions themselves do not contain future information. Preprocessing or incorrectly aligned labels can leak future tokens even if the attention mask is correct.

### Test behavior, not only mask shape

The experiment changes the final value vector by a large amount and checks that earlier outputs are unchanged. It then adds document IDs to show how packed examples remain separated. The last query is intentionally valid so every tested row has at least one visible key.

Left padding requires additional care: a padded query may have no valid earlier keys. You can avoid computing such rows, allow a harmless key and mask their loss, or use a backend's documented handling. Do not assume all-masked rows produce useful zeros; a straightforward softmax gives undefined values.

Optional application: create two packed documents of lengths two and three, alter every token in the first, and check the second document's outputs are unchanged. Check both attention and loss accounting. A causal-only mask would fail the document-isolation test.

#### A two-token leakage counterexample

Let values be scalar $(0,10)$ and all unmasked scores zero. Without a causal mask, the first output is five because it reads both tokens equally. With the allowed first row `(True, False)`, its output is zero. Now multiply the original unmasked probabilities by `(1,0)` after softmax: output is still zero in this particular value example, hiding the normalization defect. Change values to $(2,10)$: correct causal output is two, while post-softmax zeroing gives one. A test that uses only zeros can therefore miss a real masking error.


## Causality is a statement about dependency

A triangular array is one implementation detail of a causal rule. The actual property is that changing a future input cannot change an earlier output. This property gives us a stronger test than visually inspecting a mask. It also reveals leaks from outside attention, such as normalization across time or preprocessing that includes future targets.

A padded key and an excluded target are not the same thing. The first should not be read. The second should not contribute a direct loss term. A valid earlier token can still influence a later supervised output even if its own target loss is excluded. We will use that distinction when constructing response-only instruction losses.


### Executable calculation

Run `python examples/14_attention_masks.py` from the package root. Complete source is also included as [14_attention_masks.py](../examples/14_attention_masks.py).

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

Recorded output on the checked Python/NumPy environment:

```text
causal weights [[1.         0.         0.         0.        ]
 [0.19400791 0.80599209 0.         0.        ]
 [0.39740975 0.19721439 0.40537585 0.        ]
 [0.97741014 0.00611523 0.00782393 0.0086507 ]] packed weights [[1.         0.         0.         0.        ]
 [0.19400791 0.80599209 0.         0.        ]
 [0.         0.         1.         0.        ]
 [0.         0.         0.47490765 0.52509235]]
```


## Multi-head, multi-query, and grouped-query attention

### Several learned reads in parallel

A single head produces one weighted combination for each query. Multiple heads use separate projections, allowing different compatibility spaces and value mixtures. For head $h$, compute $O_h=\operatorname{Attention}(XW_Q^h,XW_K^h,XW_V^h)$, concatenate the results, and apply output projection $W_O$.

With total width $D$ and $H$ heads, a common choice is $d=D/H$. Each head's score scale is $\sqrt d$, not $\sqrt D$. Concatenation reconstructs width $D$; it is not averaging heads. $W_O$ can mix their channels after the separate reads.

### Derive the tensor transformations

A projected array starts at $(B,T,D)$. Reshape it to $(B,T,H,d)$, then transpose to $(B,H,T,d)$. Multiplication by transposed keys produces $(B,H,T,T)$. Multiplying weights by values returns $(B,H,T,d)$. Transpose back to $(B,T,H,d)$ before flattening heads. These operations change indexing but introduce no learned parameters.

One can implement all head projections as a single matrix because selecting slices of its output is equivalent to separate matrices concatenated along columns. The separate attention normalizations remain essential; combining all heads into one softmax would be a different model.

### Why share keys and values

During autoregressive decoding, past keys and values are cached. Multi-query attention uses $H$ query heads but one key and one value head. Grouped-query attention uses an intermediate number $G$ of key/value heads, with $G$ dividing $H$. Each group of $H/G$ query heads shares keys and values.

For $L$ layers, batch $B$, context $T$, key/value width $d$, and element size $b$ bytes, cache size is approximately $2LBGTdb$. The factor two stores keys and values. With $G=H$, this is ordinary multi-head caching; with $G=1$, the cache can be much smaller. Model architecture and training must support the sharing; simply dropping cache heads is not an equivalent conversion.

Active arithmetic, memory capacity, and bandwidth are separate constraints. Fewer key/value heads reduce cache traffic, but projection costs and kernel behavior also matter. A smaller asymptotic memory formula does not alone predict measured latency.

### Implementation boundary

The code expands grouped keys/values into query-head order to express the mathematics clearly. An efficient kernel may avoid physically copying them. The assertion compares one group against its corresponding individual query head. Head order is contiguous within each group in this example; a different mapping requires a different repeat or indexing operation.

Optional application: compare cache bytes for $H=8$ and $G=2$ with all other quantities fixed. The key/value cache ratio is four, while the query-head count remains eight. This is a memory statement, not a claim of fourfold end-to-end speedup.

#### Count projection parameters explicitly

With full width $D$, ordinary query, key, value, and output matrices each have $D^2$ parameters when biases are omitted, totaling $4D^2$. Splitting into heads changes indexing, not this total under the standard fixed-width design. With $H$ query heads, $G$ key/value heads, and per-head width $d=D/H$, query and output still cost $D^2$ each, while key and value each cost $DGd$. Total is $2D^2+2DGd$. This count excludes feed-forward layers and normalization. It makes clear which weights GQA changes and which costs remain.


## Follow head indexing with a small labeled tensor

Let there be two tokens, two heads, and two channels per head. Label one projected token's four features `(a,b,c,d)`. Reshaping to token-head-channel order assigns `(a,b)` to head zero and `(c,d)` to head one at that token. Transposing then groups the same head across tokens. A direct reshape into head-token-channel order can instead group adjacent flattened token values incorrectly. Both arrays have eight elements, but they describe different computations.

The output projection mixes the concatenated head channels after each head has performed its separate softmax. It cannot be moved inside as one shared normalization without changing the operation. Head specialization is learned behavior, not a property we can assume from drawing different colors for heads.


### Executable calculation

Run `python examples/15_multihead_gqa.py` from the package root. Complete source is also included as [15_multihead_gqa.py](../examples/15_multihead_gqa.py).

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

Recorded output on the checked Python/NumPy environment:

```text
output shape (1, 4, 3, 2) cache head ratio 2.0
```


## Position, sinusoidal features, relative biases, and RoPE

### Attention alone does not know sequence order

Without positional information or order-dependent masks, self-attention is permutation equivariant: permuting input rows permutes output rows correspondingly. This follows because the score matrix receives the same permutation on rows and columns, rowwise softmax respects that reindexing, and values are permuted consistently. It cannot distinguish all order-dependent tasks merely from token identity.

Learned absolute embeddings add a trainable position vector to each token embedding. Sinusoidal embeddings use deterministic sine/cosine coordinates at different frequencies. Relative position biases instead add a function of $i-j$ to scores. These are different ways to introduce order, with different extrapolation assumptions.

### Derive rotary position embeddings in two dimensions

For angle $\theta$, define

$$R(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}.$$

For column vectors, rotate query at position $m$ by $R(m\omega)$ and key at position $n$ by $R(n\omega)$. Their dot product becomes

$$(R(m\omega)q)^\top R(n\omega)k
=q^\top R(m\omega)^\top R(n\omega)k
=q^\top R((n-m)\omega)k.$$

The first equality moves the left rotation through the transpose. Orthogonality gives $R(\theta)^\top=R(-\theta)$; angle addition gives the final relative rotation. Thus the score contains relative position even though each vector is transformed using its absolute position.

In larger even width, apply a rotation to each coordinate pair using a prescribed frequency schedule. Pairing conventions differ across implementations. You must match the convention and schedule used during training. Values are usually not rotated in standard RoPE attention.

### Relative does not mean unlimited extrapolation

The formula can be evaluated at arbitrary positions, but a model trained on short sequences may not generalize to the resulting phase patterns and attention distributions. Numerical existence is not learned competence. Frequency scaling and position interpolation alter the geometry and often require evaluation or further training.

ALiBi adds a head-specific linear distance penalty to causal scores. It has different structure from rotation: the penalty changes with distance regardless of content, whereas RoPE modifies the content-dependent dot product.

### Trace the program

Our helper takes a two-dimensional column-vector convention, implemented by a matrix-vector product. The assertion checks the exact relative-angle identity numerically and also checks norm preservation. It does not check a whole long-context model.

Optional worked calculation: choose $q=(1,0)$ and $k=(1,0)$. The rotated dot product is $\cos((n-m)\omega)$. Identical content can therefore receive different compatibility scores at different relative distances. With multiple frequencies, these effects superpose across pairs.

#### Expand a rotary score coordinate by coordinate

Let $q=(q_1,q_2)$, $k=(k_1,k_2)$, and relative angle $\delta$. Multiplying by the rotation gives $q^\top R(\delta)k=(q_1k_1+q_2k_2)\cos\delta+(q_2k_1-q_1k_2)\sin\delta$. The first coefficient is the ordinary content dot product; the second captures an oriented cross-term. This expansion is useful for checking rotation sign conventions. Swapping the relative-position definition from $n-m$ to $m-n$ changes the sine sign, so code and derivation must use one convention consistently.


## Position changes compatibility while preserving useful structure

A rotary transform preserves each two-coordinate vector's length because a rotation is orthogonal. Yet it changes the dot product between vectors rotated by different angles. This combination is the point: preserve content-vector norm while making matching depend on relative position. A model can then learn position-sensitive relationships through ordinary dot-product attention.

For $q=k=(1,0)$ and angular increment 0.2, relative distances zero, one, and two yield cosine scores one, about 0.980067, and about 0.921061. Those numbers illustrate one frequency pair only. Real embeddings combine multiple pairs, and learned content affects the coefficients. Do not read the simple cosine as a universal attention-distance curve.


### Executable calculation

Run `python examples/16_position_rope.py` from the package root. Complete source is also included as [16_position_rope.py](../examples/16_position_rope.py).

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

Recorded output on the checked Python/NumPy environment:

```text
absolute rotation score -0.9442285988920982 relative rotation score -0.9442285988920983
```


## Residual streams, normalization, and feed-forward blocks

### Attention is only one sublayer

A decoder block must both communicate across tokens and transform features within each token. Attention mixes information across positions. A feed-forward network applies the same nonlinear transformation independently at every position. Residual additions preserve a direct path alongside each transformation.

A pre-normalized block can be written $U=X+\operatorname{Attention}(\operatorname{LN}(X))$ and $Y=U+\operatorname{FFN}(\operatorname{LN}(U))$. In post-normalization, normalization follows a residual addition. These are distinct functions and have different optimization behavior. Do not move normalization when reproducing pretrained weights.

### Layer normalization from its definition

For one token's feature vector $x\in\mathbb R^D$, compute $\mu=D^{-1}\sum_i x_i$, $v=D^{-1}\sum_i(x_i-\mu)^2$, and $\operatorname{LN}(x)_i=\gamma_i(x_i-\mu)/\sqrt{v+\epsilon}+\beta_i$. The variance uses denominator $D$, not the unbiased sample-variance denominator $D-1$, because this operation normalizes the current feature vector rather than estimating a population variance.

The epsilon prevents division by zero and changes exact scale invariance. For constant features, centered values are zero, so the normalized result before learned shift is zero. For nonconstant inputs and zero epsilon, a common positive rescaling cancels; with nonzero epsilon it does not cancel exactly.

RMSNorm omits mean subtraction and normalizes by $\sqrt{D^{-1}\sum_i x_i^2+\epsilon}$, usually with a learned scale. It preserves different information and cannot be treated as an interchangeable name for layer normalization.

### Nonlinear feature computation

A simple FFN is $\phi(xW_1+b_1)W_2+b_2$. Expanding width allows intermediate features before projecting back to model width. A gated variant multiplies two branches, such as $\operatorname{SiLU}(xW_g)\odot(xW_u)$ before a down projection. Gating changes both expressivity and parameter count.

For residual map $y=x+f(x)$, the Jacobian is $I+J_f$. The identity term creates a direct gradient path. It does not prove gradients cannot explode or vanish; products of residual Jacobians can still be unstable.

### Why positionwise normalization matters

Normalizing each token over features preserves causal independence. Normalizing a token using statistics across future positions would leak information in training. Batch normalization and layer normalization therefore differ in a way that is especially consequential for sequence models.

The experiment checks that shifting all features by a constant leaves ordinary layer normalization unchanged, within floating-point tolerance. It compares an explicit formula with the autodiff helper and checks that changing a different token does not affect the first token's normalization.

Optional application: set all features equal and compare results with epsilon zero and epsilon positive. The former is undefined; the latter is well-defined. This edge case explains why epsilon is part of the algorithm rather than arbitrary boilerplate.

#### Layer normalization is a coupled feature operation

Changing one feature changes both the mean and variance, so its effect reaches every normalized feature of the same token. With $c=x-\mu$ and $r=\sqrt{D^{-1}\sum c_i^2+\epsilon}$, the Jacobian is $\partial(c_i/r)/\partial x_j=(\delta_{ij}-1/D)/r-c_ic_j/(Dr^3)$. The first term accounts for mean subtraction; the second accounts for variance. This coupling stays within the token's feature axis. It explains why differentiating normalization as merely division by a fixed standard deviation gives an incorrect backward pass.


## Normalize features without mixing sentences or time

Layer normalization computes statistics over the features of one token. If a token has features `(1,2,4)`, its mean is $7/3$. Subtract that mean, square the centered values, and average those three squares. This is the denominator used by the operation, not an unbiased estimate of a population variance. The distinction explains why changing `ddof` to one would implement a different normalization.

A residual connection adds a transformed branch to the untransformed stream. Its identity derivative creates a direct backward path, but the complete derivative is identity plus the branch Jacobian. A large branch can still destabilize a stack. Residuals make useful optimization paths available; they do not exempt the model from scale and learning-rate considerations.


### Executable calculation

Run `python examples/17_transformer_blocks.py` from the package root. Complete source is also included as [17_transformer_blocks.py](../examples/17_transformer_blocks.py).

```python
import numpy as np
from core import Tensor, layer_norm
values = np.array([[1., 2., 4.], [-2., 0., 1.]])
epsilon = 1e-5
centered = values - values.mean(axis=-1, keepdims=True)
manual = centered / np.sqrt((centered ** 2).mean(axis=-1, keepdims=True) + epsilon)
actual = layer_norm(Tensor(values)).data
assert np.allclose(actual, manual)
assert np.allclose(layer_norm(Tensor(values + 8)).data, actual)
changed = values.copy()
changed[1] += np.array([10., -5., 2.])
assert np.allclose(layer_norm(Tensor(changed)).data[0], actual[0])
print('normalized', actual)
```

Recorded output on the checked Python/NumPy environment:

```text
normalized [[-1.06904153 -0.26726038  1.33630191]
 [-1.33630191  0.26726038  1.06904153]]
```


## Put the pieces together before moving to a whole model

The companion's **Masks, position, and heads** experiment lets you toggle causal visibility, change a rotary distance, and inspect which key/value head a query head shares. The calculations are deliberately small. For a single allowed key, attention weight is exactly one and addressing gradients vanish; the content can still affect output. That is a consequence of removing a choice, not a failed optimizer.

At this point we can describe a decoder block in ordinary language. Normalize each token's features. Let its heads read allowed positions using position-sensitive compatibility. Mix the read channels and add them to the residual stream. Normalize again, apply a tokenwise nonlinear feature transformation, and add another residual. The next chapter turns that block into a complete probability model with a vocabulary, an objective, and a training loop.
