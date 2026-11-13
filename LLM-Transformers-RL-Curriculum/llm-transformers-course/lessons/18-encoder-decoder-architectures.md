# 18. Encoders, decoders, and cross-attention objectives

[Previous](17-transformer-blocks.md) · [Index](../README.md) · [Next](19-implement-gpt.md)

**Part:** Transformer construction. **Prerequisite:** read lessons 01–17 in order, or verify the earlier definitions used here.

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
python code/18_encoder_decoder_architectures.py
```

### Recorded output from the supplied environment

```text
cross-attention weights [[0.02089186 0.41298293 0.30950774 0.25661747 0.        ]
 [0.85176918 0.03988242 0.07364383 0.03470457 0.        ]] output shape (2, 3)
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

One target-token conditional loss; visibility determines which evidence may set its logit.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \frac{3 x}{5} + \log{\left(e^{x} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{3}{5} + \frac{e^{x}}{e^{x} + 1}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{e^{2 x}}{\left(e^{x} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.1 | 0.70439666 | -0.124979187 | 0.24937604 |
| 0.1 | 0.68439666 | -0.0750208125 | 0.24937604 |
| 0.3 | 0.674355244 | -0.0255574832 | 0.244458312 |

#### Evaluation 1: substitute $x=-0.1$

$$f(-0.1)=\frac{3}{50} + \log{\left(e^{- \frac{1}{10}} + 1 \right)}\approx 0.70439666.$$
At this coordinate the slope is $-0.124979187$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.24937604$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000124979187$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.2468802e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000124854497$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.1$

$$f(0.1)=- \frac{3}{50} + \log{\left(1 + e^{\frac{1}{10}} \right)}\approx 0.68439666.$$
At this coordinate the slope is $-0.0750208125$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.24937604$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-7.50208125e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.2468802e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-7.48961266e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.3$

$$f(0.3)=- \frac{9}{50} + \log{\left(1 + e^{\frac{3}{10}} \right)}\approx 0.674355244.$$
At this coordinate the slope is $-0.0255574832$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.244458312$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-2.55574832e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.22229156e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-2.54352601e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.07504155589 | 2.0743e-05 |
| 0.01 | -0.07502102016 | 2.0764e-07 |
| 0.001 | -0.0750208146 | 2.0764e-09 |
| 0.0001 | -0.07502081254 | 2.1121e-11 |
| 1e-05 | -0.07502081251 | 8.8546e-12 |
| 1e-06 | -0.07502081234 | 1.8094e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{3 e^{2 x}}{\left(e^{x} + 1\right)^{2}} + \frac{2 e^{3 x}}{\left(e^{x} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.70439666 | 0.699400823 | 0.704388343 | 8.3167e-06 |
| -0.1 | 0.693147181 | 0.691898741 | 0.693145622 | 1.559e-06 |
| 0.1 | 0.678138869 | 0.676894579 | 0.678141459 | 2.5896e-06 |
| 0.2 | 0.674355244 | 0.669392498 | 0.674380018 | 2.4774e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: transformers](https://aman.ai/primers/transformers/)
- [Aman.ai: LLM](https://aman.ai/primers/LLM/)

[Previous](17-transformer-blocks.md) · [Index](../README.md) · [Next](19-implement-gpt.md)
