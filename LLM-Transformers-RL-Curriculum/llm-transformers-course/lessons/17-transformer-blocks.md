# 17. Residual streams, normalization, and feed-forward blocks

[Previous](16-position-rope.md) · [Index](../README.md) · [Next](18-encoder-decoder-architectures.md)

**Part:** Transformer construction. **Prerequisite:** read lessons 01–16 in order, or verify the earlier definitions used here.

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
python code/17_transformer_blocks.py
```

### Recorded output from the supplied environment

```text
normalized [[-1.06904153 -0.26726038  1.33630191]
 [-1.33630191  0.26726038  1.06904153]]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A scalar residual map with a nonlinear branch; its derivative includes an identity contribution.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=x + \tanh^{2}{\left(x \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh{\left(x \right)} + 1.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\left(1 - \tanh^{2}{\left(x \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) - 2 \left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh^{2}{\left(x \right)}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.1 | 0.109933709 | 1.19735584 | 1.9211224 |
| 0.3 | 0.384863038 | 1.53318188 | 1.36430611 |
| 0.5 | 0.713552267 | 1.72686198 | 0.565209288 |

#### Evaluation 1: substitute $x=0.1$

$$f(0.1)=\tanh^{2}{\left(\frac{1}{10} \right)} + \frac{1}{10}\approx 0.109933709.$$
At this coordinate the slope is $1.19735584$, so the function increases under a sufficiently small positive perturbation. The curvature is $1.9211224$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00119735584$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9.60561199e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00119831614$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.3$

$$f(0.3)=\tanh^{2}{\left(\frac{3}{10} \right)} + \frac{3}{10}\approx 0.384863038.$$
At this coordinate the slope is $1.53318188$, so the function increases under a sufficiently small positive perturbation. The curvature is $1.36430611$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00153318188$. The quadratic correction is $f^{(2)}(x)h^2/2\approx6.82153053e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00153386341$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.5$

$$f(0.5)=\tanh^{2}{\left(\frac{1}{2} \right)} + \frac{1}{2}\approx 0.713552267.$$
At this coordinate the slope is $1.72686198$, so the function increases under a sufficiently small positive perturbation. The curvature is $0.565209288$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00172686198$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.82604644e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00172714393$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 1.527020984 | 0.0061609 |
| 0.01 | 1.533119841 | 6.2037e-05 |
| 0.001 | 1.533181258 | 6.2041e-07 |
| 0.0001 | 1.533181872 | 6.2043e-09 |
| 1e-05 | 1.533181878 | 5.7569e-11 |
| 1e-06 | 1.533181878 | 2.4262e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- 2 \left(1 - \tanh^{2}{\left(x \right)}\right) \left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh{\left(x \right)} - 3 \left(2 - 2 \tanh^{2}{\left(x \right)}\right)^{2} \tanh{\left(x \right)} + 4 \left(2 - 2 \tanh^{2}{\left(x \right)}\right) \tanh^{3}{\left(x \right)}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.109933709 | 0.0782266625 | 0.105512785 | 0.0044209 |
| -0.1 | 0.238957017 | 0.23154485 | 0.238366381 | 0.00059064 |
| 0.1 | 0.544361214 | 0.538181226 | 0.545002757 | 0.00064154 |
| 0.2 | 0.713552267 | 0.691499414 | 0.718785536 | 0.0052333 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Previous](16-position-rope.md) · [Index](../README.md) · [Next](18-encoder-decoder-architectures.md)
