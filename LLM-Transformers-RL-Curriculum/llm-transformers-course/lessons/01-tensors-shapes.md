# 01. Tensors, Python, and the meaning of a shape

[Course home](../README.md) · [Index](../README.md) · [Next](02-linear-algebra.md)

**Part:** Foundations. **Prerequisite:** basic comfort running Python; the mathematical conventions are introduced here.

## Why arrays come before architectures

A language model does arithmetic on arrays. A token ID such as 7 is an integer address, not a measure of how meaningful a word is. Looking up row 7 in a learned table produces a vector of measurements. Processing a batch produces an array whose axes describe different kinds of variation. If these meanings are unclear, a program can run successfully while mixing unrelated examples.

Start with a sentence represented by three tokens and four features per token. Its shape is `(3, 4)`. Two such sentences have shape `(2, 3, 4)`. We write this as $(B,T,D)$: batch, token position, feature. A scalar has shape `()`, a vector has one axis, and a matrix has two. Tensor here means a multidimensional numerical array; this programming usage does not require differential geometry.

## Trace a projection without hiding an index

Let $X\in\mathbb R^{B\times T\times D}$ and $W\in\mathbb R^{D\times F}$. Define $Y=XW$. The batch and time axes survive; the feature axis is contracted:

$$Y_{btf}=\sum_{d=0}^{D-1}X_{btd}W_{df}.$$

For a row $(1,2)$ and a column $(3,4)^\top$, the output is $1\cdot3+2\cdot4=11$. Multiplication forms two contributions; summation combines them into one feature. The output shape is $(B,T,F)$, because every batch-position pair obtains $F$ new measurements.

A bias $b\in\mathbb R^F$ is added as $Y_{btf}+b_f$. Broadcasting treats missing leading axes as size one and permits matching axes when sizes agree or one is one. It does not infer your intentions. Adding a `(T,)` vector to a `(B,T,D)` array generally targets the final axis and is wrong for a per-position offset. Write `(1,T,1)` explicitly.

## Reshaping is different from moving an axis

Reshape preserves flattened element order. Transpose changes which index corresponds to which original axis. To introduce heads, reshape `(B,T,H*d)` to `(B,T,H,d)`, then transpose to `(B,H,T,d)`. Directly reshaping to `(B,H,T,d)` assigns elements to different token-head pairs. Equal numbers of elements do not establish semantic equivalence.

Integer arrays normally index token IDs. Floating arrays represent activations and weights. Boolean arrays represent allowed connections. Keep those roles separate. A mask value of `True` means allowed throughout this course; some APIs use the opposite convention.

## Read the experiment

The loop independently computes the matrix contraction, so agreement with `@` checks the index equation. The next assertion checks the inverse transpose. It does not establish that a future model's axes are correct; that requires carrying their meanings through each operation. A useful debugging practice is to write the intended shape above every contraction before running it.

Optional application: project `(2,5,3)` inputs to seven features, then add a per-token offset. A correct result has shape `(2,5,7)`, and changing one input sentence must leave the other sentence unchanged. This independence is a stronger check than a shape assertion alone.

### Worked shape audit: one projection and its reverse

Take $B=2,T=3,D=4,F=6$. The input has 24 numbers, the weight has 24 parameters, and the output has 36 numbers. Output entry $Y_{1,2,5}$ is the sum of four products $X_{1,2,d}W_{d,5}$. It uses one input token and one output-feature column; it does not mix batches or token positions. If a scalar loss supplies upstream $G$ of shape $(2,3,6)$, weight gradient entry $(d,f)$ sums $X_{btd}G_{btf}$ over all six batch-position pairs. Thus the shared weight aggregates evidence across positions while the forward projection remains positionwise. This distinction is the first example of parameter sharing versus information mixing.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(0)
inputs = rng.normal(size=(2, 3, 4))
weight = rng.normal(size=(4, 6))
output = inputs @ weight
manual = np.zeros((2, 3, 6))
for batch in range(2):
    for token in range(3):
        for feature in range(6):
            for channel in range(4):
                manual[batch, token, feature] += inputs[batch, token, channel] * weight[channel, feature]
assert np.allclose(output, manual)
heads = output.reshape(2, 3, 2, 3).transpose(0, 2, 1, 3)
restored = heads.transpose(0, 2, 1, 3).reshape(2, 3, 6)
assert np.allclose(restored, output)
print('projected', output.shape, 'heads', heads.shape)

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(0)
```

#### Stage 3

```python
inputs = rng.normal(size=(2, 3, 4))
```

An observed state during this stage was:

- `inputs`: `array shape=(2, 3, 4), min=-2.32503, max=1.36646, norm=4.19531`

#### Stage 4

```python
weight = rng.normal(size=(4, 6))
```

An observed state during this stage was:

- `weight`: `array shape=(4, 6), min=-1.25907, max=1.96026, norm=4.44567`

#### Stage 5

```python
output = inputs @ weight
```

An observed state during this stage was:

- `output`: `array shape=(2, 3, 6), min=-3.91136, max=3.84123, norm=8.23262`

#### Stage 6

```python
manual = np.zeros((2, 3, 6))
```

An observed state during this stage was:

- `manual`: `array shape=(2, 3, 6), min=0, max=0, norm=0`

#### Stage 7

```python
for batch in range(2):
    for token in range(3):
        for feature in range(6):
            for channel in range(4):
                manual[batch, token, feature] += inputs[batch, token, channel] * weight[channel, feature]
```

An observed state during this stage was:

- `channel`: `1`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 8

```python
assert np.allclose(output, manual)
```

#### Stage 9

```python
heads = output.reshape(2, 3, 2, 3).transpose(0, 2, 1, 3)
```

#### Stage 10

```python
restored = heads.transpose(0, 2, 1, 3).reshape(2, 3, 6)
```

#### Stage 11

```python
assert np.allclose(restored, output)
```

#### Stage 12

```python
print('projected', output.shape, 'heads', heads.shape)
```

Run from the course root:

```bash
python code/01_tensors_shapes.py
```

### Recorded output from the supplied environment

```text
projected (2, 3, 6) heads (2, 2, 3, 3)
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Squared size of one projected feature as its first input coordinate changes.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\left(3 x + 4\right)^{2}.$$

Its first derivative is

$$f^{(1)}(x)=18 x + 24.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=18.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.3 | 24.01 | 29.4 | 18 |
| 0.5 | 30.25 | 33 | 18 |
| 0.7 | 37.21 | 36.6 | 18 |

#### Evaluation 1: substitute $x=0.3$

$$f(0.3)=\frac{2401}{100}\approx 24.01.$$
At this coordinate the slope is $29.4$, so the function increases under a sufficiently small positive perturbation. The curvature is $18$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.0294$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.029409$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.5$

$$f(0.5)=\frac{121}{4}\approx 30.25.$$
At this coordinate the slope is $33$, so the function increases under a sufficiently small positive perturbation. The curvature is $18$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.033$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.033009$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.7$

$$f(0.7)=\frac{3721}{100}\approx 37.21.$$
At this coordinate the slope is $36.6$, so the function increases under a sufficiently small positive perturbation. The curvature is $18$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.0366$. The quadratic correction is $f^{(2)}(x)h^2/2\approx9e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.036609$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 33 | 1.4211e-14 |
| 0.01 | 33 | 3.6238e-13 |
| 0.001 | 33 | 1.2506e-12 |
| 0.0001 | 33 | 2.9672e-11 |
| 1e-05 | 33 | 3.6113e-10 |
| 1e-06 | 32.99999999 | 5.1573e-09 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 24.01 | 23.65 | 24.01 | 7.1054e-15 |
| -0.1 | 27.04 | 26.95 | 27.04 | 3.5527e-15 |
| 0.1 | 33.64 | 33.55 | 33.64 | 0 |
| 0.2 | 37.21 | 36.85 | 37.21 | 7.1054e-15 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Course home](../README.md) · [Index](../README.md) · [Next](02-linear-algebra.md)
