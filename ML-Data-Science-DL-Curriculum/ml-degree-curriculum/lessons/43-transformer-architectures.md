# 43. Transformer blocks and encoder decoder architecture choices

[Previous](42-masks-position-multihead.md) · [Course index](../README.md) · [Next](44-build-train-transformer.md)

## Compose the operations already derived

A transformer block combines attention, a positionwise feedforward network, residual connections, and normalization. In a pre-normalization block, a typical form is $u=x+\operatorname{Attention}(\operatorname{Norm}(x))$, followed by $y=u+\operatorname{FFN}(\operatorname{Norm}(u))$. Post-normalization changes the order and therefore the derivative paths and training behavior.

The feedforward network is applied separately to each token with shared parameters across positions. Attention communicates between positions. A residual connection preserves a direct path across a sublayer. None of these alone is the whole transformer.

An encoder uses representations with the declared bidirectional mask and often a masked or discriminative objective. An autoregressive decoder uses causal attention for next-token factorization. An encoder-decoder model adds cross-attention from generated target states to source representations. Decoder terminology can also appear in nonautoregressive models; specify the factorization rather than infer it from a label.

## Architecture choices and shape derivations
## Architecture follows information availability

An encoder processes all observed input tokens with bidirectional attention. A causal decoder restricts each position to its prefix. An encoder-decoder reads a full source sequence and generates a target sequence through a causal decoder that also cross-attends to source representations. These are visibility patterns and training designs, not simply model-size categories.

BERT-style masked-token prediction corrupts selected input tokens and predicts their original identities. The model sees both left and right context. Its loss is computed on designated prediction positions. It does not directly define the same left-to-right joint distribution as a causal model. Summing masked-token scores is therefore not automatically a normalized sequence likelihood.

A causal language model minimizes next-token negative log-likelihood. A text-to-text denoising model such as T5 maps a corrupted source into a target sequence containing missing spans under a defined serialization. The corruption scheme is part of the objective and influences what the representation learns.

## Cross-attention with different lengths

Let decoder states $Y\in\mathbb R^{T_y\times D_y}$ and encoded source states $X\in\mathbb R^{T_x\times D_x}$. Set $Q=YW_Q$, $K=XW_K$, and $V=XW_V$. Then scores have shape $(T_y,T_x)$, and each target query chooses among source positions. The source and target lengths need not agree.

Source padding must be hidden from cross-attention. Causality applies to the decoder's target-side self-attention; it need not hide source positions because the source is already observed. Accidentally applying a square target causal mask to cross-attention either fails shape checks or imposes an unintended source alignment.

## A training-pair example

For translation source `red cat` and target `chat rouge <eos>`, decoder input begins with `<bos>` followed by `chat rouge`. The output targets are `chat rouge <eos>`. Cross-attention reads the same encoded source at every target step. During teacher forcing, earlier target words are correct; during inference, generated earlier words are used.

The model predicts distributions, while the tokenizer and serialization define which IDs correspond to these symbols. A real chat model adds role and message boundaries learned during instruction training. An arbitrary printable template is not guaranteed to have the same effect.

## Choose a baseline by the actual task

For classification, an encoder with a small head can be efficient. For open-ended generation, a causal decoder is a natural baseline. For constrained source-to-target transformations, encoder-decoder models can separate source processing from generation. These are useful starting hypotheses, not universal rankings.

The experiment demonstrates rectangular cross-attention and a source-padding mask. It verifies that altering the padded source value cannot alter any decoder output. This is the relevant behavioral property, beyond merely checking that the output array has the expected dimensions.

### Compare likelihood factorizations carefully

For two target tokens, a causal model defines $p(y_1,y_2\mid x)=p(y_1\mid x)p(y_2\mid x,y_1)$. A masked encoder might separately estimate $p(y_1\mid x,y_2)$ and $p(y_2\mid x,y_1)$. Their product is not generally the causal joint, because each conditional uses information the other task lacks and no shared normalization over complete sequences is implied. This small example prevents using a masked model's pseudo-likelihood as if it were directly comparable to a decoder's normalized joint likelihood without qualification.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention
rng = np.random.default_rng(18)
query = rng.normal(size=(2, 4))
source_key = rng.normal(size=(5, 4))
source_value = rng.normal(size=(5, 3))
allowed = np.array([[True, True, True, True, False]])
output, weights = attention(query, source_key, source_value, allowed)
changed = source_value.copy()
changed[-1] += 1000
modified, _ = attention(query, source_key, changed, allowed)
assert output.shape == (2, 3)
assert np.allclose(output, modified)
print('cross-attention weights', weights, 'output shape', output.shape)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(18)
```

#### Stage 4

```python
query = rng.normal(size=(2, 4))
```

An observed state during this stage was:

- `query`: `[[-0.43234 -1.1301   0.67384 -1.10781]  [ 2.01392  0.92411 -0.35926  0.57052]]`

#### Stage 5

```python
source_key = rng.normal(size=(5, 4))
```

An observed state during this stage was:

- `source_key`: `[[ 1.61159e+00  2.83397e+00 -9.23265e-01  1.06507e+00]  [ 5.17741e-01 -2.79551e-01  1.09220e+00  5.06774e-01]  [ 1.07624e+00 -5.25899e-01 -2.49148e-03  3.94961e-01]  [ 1.96024e-02  1.65724e-02 -7.68416e-01  1.26379e-01]  [ 1.87646e-01 -6.13100e-02 -1.47479e-02  6.96461e-01]]`

#### Stage 6

```python
source_value = rng.normal(size=(5, 3))
```

An observed state during this stage was:

- `source_value`: `[[-0.6586   0.69652 -0.15348]  [ 0.05617 -0.19089  0.89918]  [ 0.76057  0.00614 -0.43852]  [ 1.8564   0.53902 -1.14641]  [-0.00438 -0.11234  0.72189]]`

#### Stage 7

```python
allowed = np.array([[True, True, True, True, False]])
```

An observed state during this stage was:

- `allowed`: `[[ True  True  True  True False]]`

#### Stage 8

```python
output, weights = attention(query, source_key, source_value, allowed)
```

An observed state during this stage was:

- `output`: `[[ 0.72122  0.07594 -0.06177]  [-0.4383   0.60482 -0.16695]]`
- `weights`: `[[0.02089 0.41298 0.30951 0.25662 0.     ]  [0.85177 0.03988 0.07364 0.0347  0.     ]]`

#### Stage 9

```python
changed = source_value.copy()
```

An observed state during this stage was:

- `changed`: `[[-0.6586   0.69652 -0.15348]  [ 0.05617 -0.19089  0.89918]  [ 0.76057  0.00614 -0.43852]  [ 1.8564   0.53902 -1.14641]  [-0.00438 -0.11234  0.72189]]`

#### Stage 10

```python
changed[-1] += 1000
```

An observed state during this stage was:

- `changed`: `[[-6.58603e-01  6.96523e-01 -1.53483e-01]  [ 5.61661e-02 -1.90892e-01  8.99182e-01]  [ 7.60570e-01  6.13580e-03 -4.38521e-01]  [ 1.85640e+00  5.39018e-01 -1.14641e+00]  [ 9.99996e+02  9.99888e+02  1.00072e+03]]`

#### Stage 11

```python
modified, _ = attention(query, source_key, changed, allowed)
```

An observed state during this stage was:

- `modified`: `[[ 0.72122  0.07594 -0.06177]  [-0.4383   0.60482 -0.16695]]`

#### Stage 12

```python
assert output.shape == (2, 3)
```

#### Stage 13

```python
assert np.allclose(output, modified)
```

#### Stage 14

```python
print('cross-attention weights', weights, 'output shape', output.shape)
```

Run from the course root:

```bash
python code/neural/18_encoder_decoder_architectures.py
```

### Recorded output from the supplied environment

```text
cross-attention weights [[0.02089186 0.41298293 0.30950774 0.25661747 0.        ]
 [0.85176918 0.03988242 0.07364383 0.03470457 0.        ]] output shape (2, 3)
```## 5.11 Position information and residual blocks

Self-attention without position information is equivariant to input reordering under corresponding output reordering. Tokens therefore need a way to represent order. Learned position embeddings assign a vector to each allowed position. Sinusoidal and relative-position methods provide other ways to encode order and distance.

Learned absolute positions are straightforward but establish a maximum represented context length in the simple implementation. Supplying a longer sequence without adapting the position scheme is not a harmless batch-size change. Even a scheme that computes positions beyond training length may not generalize there.

A transformer block combines attention with a positionwise feedforward network, residual connections, and normalization. A common pre-normalization pattern is `x = x + attention(norm(x))`, then `x = x + feedforward(norm(x))`. The feedforward network expands feature width, applies a nonlinearity, and projects back. It operates independently at each token after attention exchanges information across positions.

Layer normalization normalizes the feature vector for each token under this setup. Residual paths preserve existing representations while learned branches add corrections. These mechanisms connect directly to the convolutional residual intuition, but the information-exchange operation is attention rather than a spatially local filter.



## 5.17 Encoders, decoders, and encoder-decoder systems

An encoder commonly allows each token to access all valid tokens in the input sequence. This suits tasks where the entire observation is available, such as document classification or offline entity tagging. A causal decoder restricts each position to its prefix, supporting next-token generation. An encoder-decoder system adds cross-attention from generated output positions to an encoded input.

These names refer to information flow, not merely class names in a library. A module called a decoder may contain self-attention and cross-attention, while a decoder-only language model uses causal self-attention without a separate source encoder. Read the actual dependencies to understand what information is available.

For translation, the encoder processes a source sentence, and the decoder predicts a target sequence. During teacher-forced training, the decoder receives previous target tokens and predicts the next ones. The causal mask prevents access to future target tokens, while cross-attention can inspect the valid source representation. At inference, previous target tokens are the model's own outputs, creating a difference from training that evaluation must account for.

For time-series forecasting, a similar distinction matters. An offline encoder can use the whole historical window, but it must not receive future measurements unavailable at the forecast time. Known future covariates, such as a calendar, are a separate input category from unknown future outcomes. Masking cannot correct a dataset that already placed unavailable information into the input features.


## Transformer residual and normalization laboratory

## Attention is only one sublayer

A decoder block must both communicate across tokens and transform features within each token. Attention mixes information across positions. A feed-forward network applies the same nonlinear transformation independently at every position. Residual additions preserve a direct path alongside each transformation.

A pre-normalized block can be written $U=X+\operatorname{Attention}(\operatorname{LN}(X))$ and $Y=U+\operatorname{FFN}(\operatorname{LN}(U))$. In post-normalization, normalization follows a residual addition. These are distinct functions and have different optimization behavior. Do not move normalization when reproducing pretrained weights.

## Layer normalization from its definition

For one token's feature vector $x\in\mathbb R^D$, compute $\mu=D^{-1}\sum_i x_i$, $v=D^{-1}\sum_i(x_i-\mu)^2$, and $\operatorname{LN}(x)_i=\gamma_i(x_i-\mu)/\sqrt{v+\epsilon}+\beta_i$. The variance uses denominator $D$, not the unbiased sample-variance denominator $D-1$, because this operation normalizes the current feature vector rather than estimating a population variance.

The epsilon prevents division by zero and changes exact scale invariance. For constant features, centered values are zero, so the normalized result before learned shift is zero. For nonconstant inputs and zero epsilon, a common positive rescaling cancels; with nonzero epsilon it does not cancel exactly.

RMSNorm omits mean subtraction and normalizes by $\sqrt{D^{-1}\sum_i x_i^2+\epsilon}$, usually with a learned scale. It preserves different information and cannot be treated as an interchangeable name for layer normalization.

## Nonlinear feature computation

A simple FFN is $\phi(xW_1+b_1)W_2+b_2$. Expanding width allows intermediate features before projecting back to model width. A gated variant multiplies two branches, such as $\operatorname{SiLU}(xW_g)\odot(xW_u)$ before a down projection. Gating changes both expressivity and parameter count.

For residual map $y=x+f(x)$, the Jacobian is $I+J_f$. The identity term creates a direct gradient path. It does not prove gradients cannot explode or vanish; products of residual Jacobians can still be unstable.

## Why positionwise normalization matters

Normalizing each token over features preserves causal independence. Normalizing a token using statistics across future positions would leak information in training. Batch normalization and layer normalization therefore differ in a way that is especially consequential for sequence models.

The experiment checks that shifting all features by a constant leaves ordinary layer normalization unchanged, within floating-point tolerance. It compares an explicit formula with the autodiff helper and checks that changing a different token does not affect the first token's normalization.

Optional application: set all features equal and compare results with epsilon zero and epsilon positive. The former is undefined; the latter is well-defined. This edge case explains why epsilon is part of the algorithm rather than arbitrary boilerplate.

### Layer normalization is a coupled feature operation

Changing one feature changes both the mean and variance, so its effect reaches every normalized feature of the same token. With $c=x-\mu$ and $r=\sqrt{D^{-1}\sum c_i^2+\epsilon}$, the Jacobian is $\partial(c_i/r)/\partial x_j=(\delta_{ij}-1/D)/r-c_ic_j/(Dr^3)$. The first term accounts for mean subtraction; the second accounts for variance. This coupling stays within the token's feature axis. It explains why differentiating normalization as merely division by a fixed standard deviation gives an incorrect backward pass.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

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

### Code structure and observed intermediate values


#### Stage 3

```python
values = np.array([[1., 2., 4.], [-2., 0., 1.]])
```

An observed state during this stage was:

- `values`: `[[ 1.  2.  4.]  [-2.  0.  1.]]`

#### Stage 4

```python
epsilon = 1e-5
```

An observed state during this stage was:

- `epsilon`: `1e-05`

#### Stage 5

```python
centered = values - values.mean(axis=-1, keepdims=True)
```

An observed state during this stage was:

- `centered`: `[[-1.33333 -0.33333  1.66667]  [-1.66667  0.33333  1.33333]]`

#### Stage 6

```python
manual = centered / np.sqrt((centered ** 2).mean(axis=-1, keepdims=True) + epsilon)
```

An observed state during this stage was:

- `manual`: `[[-1.06904 -0.26726  1.3363 ]  [-1.3363   0.26726  1.06904]]`

#### Stage 7

```python
actual = layer_norm(Tensor(values)).data
```

An observed state during this stage was:

- `actual`: `[[-1.06904 -0.26726  1.3363 ]  [-1.3363   0.26726  1.06904]]`

#### Stage 8

```python
assert np.allclose(actual, manual)
```

#### Stage 9

```python
assert np.allclose(layer_norm(Tensor(values + 8)).data, actual)
```

#### Stage 10

```python
changed = values.copy()
```

An observed state during this stage was:

- `changed`: `[[ 1.  2.  4.]  [-2.  0.  1.]]`

#### Stage 11

```python
changed[1] += np.array([10., -5., 2.])
```

An observed state during this stage was:

- `changed`: `[[ 1.  2.  4.]  [ 8. -5.  3.]]`

#### Stage 12

```python
assert np.allclose(layer_norm(Tensor(changed)).data[0], actual[0])
```

#### Stage 13

```python
print('normalized', actual)
```

Run from the course root:

```bash
python code/neural/17_transformer_blocks.py
```

### Recorded output from the supplied environment

```text
normalized [[-1.06904153 -0.26726038  1.33630191]
 [-1.33630191  0.26726038  1.06904153]]
```