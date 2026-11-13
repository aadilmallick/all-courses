# 11. Attention as differentiable weighted retrieval

[Previous](10-rnn-seq2seq.md) · [Index](../README.md) · [Next](12-scaled-dot-product-attention.md)

**Part:** Language and attention. **Prerequisite:** read lessons 01–10 in order, or verify the earlier definitions used here.

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
python code/11_attention_weighted_retrieval.py
```

### Recorded output from the supplied environment

```text
weights [0.25 0.75] output [8. 2.] score gradient [-0.45  0.45]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

An exact two-slot attention output with values 2 and 10 and relative score x.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=2 + \frac{8}{1 + e^{- x}}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{8 e^{- x}}{\left(1 + e^{- x}\right)^{2}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \frac{8 e^{- x}}{\left(1 + e^{- x}\right)^{2}} + \frac{16 e^{- 2 x}}{\left(1 + e^{- x}\right)^{3}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.8 | 7.51979585 | 1.71127757 | -0.650198138 |
| 1 | 7.84846863 | 1.57289547 | -0.726861981 |
| 1.2 | 8.14819827 | 1.42315553 | -0.764305059 |

#### Evaluation 1: substitute $x=0.8$

$$f(0.8)=2 + \frac{8}{e^{- \frac{4}{5}} + 1}\approx 7.51979585.$$
At this coordinate the slope is $1.71127757$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.650198138$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00171127757$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-3.25099069e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00171095239$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=1$

$$f(1)=2 + \frac{8}{e^{-1} + 1}\approx 7.84846863.$$
At this coordinate the slope is $1.57289547$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.726861981$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00157289547$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-3.63430991e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00157253199$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=1.2$

$$f(1.2)=2 + \frac{8}{e^{- \frac{6}{5}} + 1}\approx 8.14819827.$$
At this coordinate the slope is $1.42315553$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.764305059$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00142315553$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-3.82152529e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00142277336$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 1.572424119 | 0.00047135 |
| 0.01 | 1.572890756 | 4.7101e-06 |
| 0.001 | 1.572895419 | 4.7101e-08 |
| 0.0001 | 1.572895465 | 4.715e-10 |
| 1e-05 | 1.572895466 | 1.4088e-11 |
| 1e-06 | 1.572895465 | 5.0259e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{8 e^{- x}}{\left(1 + e^{- x}\right)^{2}} - \frac{48 e^{- 2 x}}{\left(1 + e^{- x}\right)^{3}} + \frac{48 e^{- 3 x}}{\left(1 + e^{- x}\right)^{4}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 7.51979585 | 7.53388954 | 7.5193523 | 0.00044355 |
| -0.1 | 7.68759602 | 7.69117908 | 7.68754477 | 5.1248e-05 |
| 0.1 | 8.00208084 | 8.00575818 | 8.00212387 | 4.3021e-05 |
| 0.2 | 8.14819827 | 8.16304772 | 8.14851048 | 0.00031221 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: attention](https://aman.ai/primers/attention/)

[Previous](10-rnn-seq2seq.md) · [Index](../README.md) · [Next](12-scaled-dot-product-attention.md)
