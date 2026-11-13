# 28. Quantization, numerical error, and QLoRA

[Previous](27-lora-peft.md) · [Index](../README.md) · [Next](29-mixture-of-experts.md)

**Part:** Adaptation and compression. **Prerequisite:** read lessons 01–27 in order, or verify the earlier definitions used here.

## Represent weights with fewer bits

Uniform symmetric quantization chooses a scale $s>0$ and represents a weight by integer $q=\operatorname{clip}(\operatorname{round}(w/s),-Q,Q)$. Reconstruct $\widehat w=sq$. With no clipping, rounding error is at most $s/2$. With clipping, that bound no longer applies. A zero tensor needs a safe nonzero scale convention.

For four-bit signed symmetric illustration, use integer range $[-7,7]$. A maximum absolute weight of 1.4 gives scale 0.2. Weight 0.31 maps to integer two and reconstructs as 0.4, error 0.09. Actual four-bit formats may use asymmetric ranges, nonuniform codebooks, group scales, and packed storage. Our float NumPy array of integers does not itself demonstrate compressed byte storage.

## Propagate error through a layer

Let reconstruction error be $E=\widehat W-W$. For row input $x$, output error is $xE$. By submultiplicativity, $\|xE\|_2\le\|x\|_2\|E\|_2\le\|x\|_2\|E\|_F$. A small weight error bound controls one linear layer's output under bounded input. It does not directly bound a whole autoregressive model's generated text, because nonlinearities and discrete token selection can amplify small changes.

Per-channel or groupwise scales reduce the influence of outlier channels at the cost of scale metadata and more complex kernels. Activation quantization introduces another error source. Calibration data should reflect actual activations and workloads; weight-only experiments cannot establish activation quantization quality.

## What QLoRA adds

QLoRA trains low-rank adapters while using a frozen quantized base. Its specific recipe includes a nonuniform four-bit format, additional compression of quantization constants, and memory-management choices. It is not simply 'round weights and train everything with four-bit gradients.' Computation can dequantize blocks into a higher-precision compute type, while trainable adapters and optimizer states use their documented formats.

The derivative of exact rounding is zero almost everywhere and undefined at thresholds. Quantization-aware training may use surrogate gradients, which are estimators rather than ordinary derivatives of the rounding function. With a frozen quantized base and differentiable adapters, gradients need not update the stored integer codes.

## Evaluate the actual deployment format

Check accuracy, calibration, outlier behavior, throughput, and peak memory. Fewer weight bits do not guarantee faster execution without efficient kernels. Merging an adapter into a quantized base may introduce fresh rounding error and requires re-evaluation.

The experiment quantizes a small matrix, checks the unclipped reconstruction bound, and measures output error against a norm bound. It does not implement NF4, packed kernels, or a complete QLoRA training system.

### An outlier changes uniform quantization resolution

For weights $(0.1,0.2,0.3,10)$ with symmetric range $[-7,7]$, the shared scale is $10/7\approx1.429$. All three small weights round to zero, losing their differences. If the outlier uses a separate group, the small group's scale is $0.3/7\approx0.0429$, preserving much finer distinctions. Grouping improves this example's resolution but adds scale metadata and changes kernel access patterns. Weight distributions and activation sensitivity determine whether the extra complexity is worthwhile. Mean squared weight error alone may not predict task degradation.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(28)
weight = rng.normal(size=(4, 5))
limit = 7
scale = max(float(np.max(np.abs(weight)))/limit, 1e-12)
integer = np.clip(np.round(weight/scale), -limit, limit).astype(np.int8)
reconstructed = integer.astype(float)*scale
error = reconstructed-weight
assert np.max(np.abs(error)) <= scale/2+1e-12
x = rng.normal(size=(2, 4))
actual = np.linalg.norm(x @ error)
bound = np.linalg.norm(x)*np.linalg.norm(error)
assert actual <= bound+1e-12
print('scale', scale, 'output error', actual, 'bound', bound)

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(28)
```

#### Stage 3

```python
weight = rng.normal(size=(4, 5))
```

An observed state during this stage was:

- `weight`: `[[-1.20685  0.13136 -0.231   -0.52421  0.29134]  [ 0.92838 -0.01077 -1.18076  0.40944 -0.46052]  [ 0.99608 -0.336    0.70513 -1.16245  1.71143]  [-0.8048  -0.57437  0.35321  2.34071 -0.06547]]`

#### Stage 4

```python
limit = 7
```

An observed state during this stage was:

- `limit`: `7`

#### Stage 5

```python
scale = max(float(np.max(np.abs(weight)))/limit, 1e-12)
```

An observed state during this stage was:

- `scale`: `0.3343869`

#### Stage 6

```python
integer = np.clip(np.round(weight/scale), -limit, limit).astype(np.int8)
```

An observed state during this stage was:

- `integer`: `[[-4  0 -1 -2  1]  [ 3  0 -4  1 -1]  [ 3 -1  2 -3  5]  [-2 -2  1  7  0]]`

#### Stage 7

```python
reconstructed = integer.astype(float)*scale
```

An observed state during this stage was:

- `reconstructed`: `[[-1.33755  0.      -0.33439 -0.66877  0.33439]  [ 1.00316  0.      -1.33755  0.33439 -0.33439]  [ 1.00316 -0.33439  0.66877 -1.00316  1.67193]  [-0.66877 -0.66877  0.33439  2.34071  0.     ]]`

#### Stage 8

```python
error = reconstructed-weight
```

An observed state during this stage was:

- `error`: `[[-0.1307  -0.13136 -0.10339 -0.14456  0.04305]  [ 0.07478  0.01077 -0.15679 -0.07506  0.12613]  [ 0.00708  0.00162 -0.03636  0.15929 -0.03949]  [ 0.13603 -0.0944  -0.01882  0.       0.06547]]`

#### Stage 9

```python
assert np.max(np.abs(error)) <= scale/2+1e-12
```

#### Stage 10

```python
x = rng.normal(size=(2, 4))
```

An observed state during this stage was:

- `x`: `[[ 0.21593 -2.24141  0.91652 -0.30936]  [ 0.6869   1.73975 -1.66236 -0.33715]]`

#### Stage 11

```python
actual = np.linalg.norm(x @ error)
```

An observed state during this stage was:

- `actual`: `0.86199869`

#### Stage 12

```python
bound = np.linalg.norm(x)*np.linalg.norm(error)
```

An observed state during this stage was:

- `bound`: `1.4927999`

#### Stage 13

```python
assert actual <= bound+1e-12
```

#### Stage 14

```python
print('scale', scale, 'output error', actual, 'bound', bound)
```

Run from the course root:

```bash
python code/28_quantization_qlora.py
```

### Recorded output from the supplied environment

```text
scale 0.3343869004438958 output error 0.8619986857257129 bound 1.4927999248301533
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Smooth reconstruction-error slice around a fixed quantization bin; bin changes are discrete.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\left(x - \frac{2}{5}\right)^{2}.$$

Its first derivative is

$$f^{(1)}(x)=2 x - \frac{4}{5}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=2.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.11 | 0.0841 | -0.58 | 2 |
| 0.31 | 0.0081 | -0.18 | 2 |
| 0.51 | 0.0121 | 0.22 | 2 |

#### Evaluation 1: substitute $x=0.11$

$$f(0.11)=\frac{841}{10000}\approx 0.0841.$$
At this coordinate the slope is $-0.58$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00058$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000579$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.31$

$$f(0.31)=\frac{81}{10000}\approx 0.0081.$$
At this coordinate the slope is $-0.18$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.00018$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000179$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.51$

$$f(0.51)=\frac{121}{10000}\approx 0.0121.$$
At this coordinate the slope is $0.22$, so the function increases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00022$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000221$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.18 | 0 |
| 0.01 | -0.18 | 1.6653e-16 |
| 0.001 | -0.18 | 4.1633e-16 |
| 0.0001 | -0.18 | 1.954e-14 |
| 1e-05 | -0.18 | 1.4524e-13 |
| 1e-06 | -0.18 | 5.4058e-12 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.0841 | 0.0441 | 0.0841 | 0 |
| -0.1 | 0.0361 | 0.0261 | 0.0361 | 0 |
| 0.1 | 0.0001 | -0.0099 | 0.0001 | 9.4868e-19 |
| 0.2 | 0.0121 | -0.0279 | 0.0121 | 1.7347e-18 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: parameter-efficient-fine-tuning](https://aman.ai/primers/parameter-efficient-fine-tuning/)
- [Aman.ai: LLM](https://aman.ai/primers/LLM/)

[Previous](27-lora-peft.md) · [Index](../README.md) · [Next](29-mixture-of-experts.md)
