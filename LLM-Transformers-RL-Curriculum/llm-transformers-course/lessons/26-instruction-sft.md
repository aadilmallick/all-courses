# 26. Instruction tuning and supervised response losses

[Previous](25-evaluation-interpretability.md) · [Index](../README.md) · [Next](27-lora-peft.md)

**Part:** Adaptation and compression. **Prerequisite:** read lessons 01–25 in order, or verify the earlier definitions used here.

## Change the training distribution and objective deliberately

Pretraining learns to continue text. Instruction tuning trains on examples of desired responses to instructions. It uses the same basic next-token likelihood machinery but changes the serialized data and often which target positions receive loss. It does not directly guarantee truthfulness, safety, or broad reasoning improvements.

Let a serialized example contain system text, user text, and assistant response. Use the entire preceding conversation as context, but frequently compute loss only on assistant response tokens. With mask $m_t\in\{0,1\}$,

$$L=-\frac{\sum_t m_t\log\pi_\theta(x_t\mid x_{<t})}{\sum_t m_t}.$$

The denominator counts supervised targets, not total input tokens. Every included target still needs the correctly shifted input. If all mask entries are zero, the objective is undefined; reject the batch or skip it under a documented policy.

## Trace a three-position example

Suppose the input positions end with a user boundary and then two assistant tokens. The target for the boundary position is the first assistant token, so that position's loss should be included. A mask based only on the visible role of the input token can be off by one. Construct masks against target indices, then inspect one decoded example with its labels and mask.

Masked-out prompt tokens still affect response predictions through the forward computation. Excluding their direct loss does not freeze their embedding gradients when those embeddings help predict supervised responses. Loss masking and parameter freezing are separate mechanisms.

## Data quality is a mathematical issue

Contradictory demonstrations produce competing gradients. Repeated templates can distort task balance. Long responses receive more weight under a token mean than short responses unless examples are reweighted. Decide whether the intended objective is per-token performance or equal weighting of conversations.

Keep training and evaluation tasks separate by source and generation process when possible. Synthetic instructions can be useful, but a teacher's errors and style biases can be replicated. Include answerability, uncertainty, and abstention examples if those behaviors matter.

## Evaluate both adaptation and regression

Measure the desired task before and after tuning and also evaluate important retained capabilities. Low tuning loss can coexist with memorization or regression. A small learning rate or frozen base weights can reduce some changes but does not prove that forgetting is absent.

The example compares the model's masked loss with an independently computed selection from log-softmax. It also verifies that changing excluded labels leaves the objective unchanged. The inputs remain fixed, so this is specifically a loss-selection check, not a statement about changing the actual prompt.

### A response mask can change parameter gradients far upstream

Consider prompt token embedding $e_p$, answer state $h=e_pW$, and supervised answer loss $L(h)$. Even if no prompt-target loss is included, $\partial L/\partial e_p=(\partial L/\partial h)W^\top$ can be nonzero. The prompt token influences the answer prediction through the forward graph. Excluding a prompt position from the target reduction removes one direct loss term; it does not detach prompt representations. This distinction matters when debugging unexpectedly nonzero embedding gradients during response-only supervised fine-tuning.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import TinyGPT, log_softmax
model = TinyGPT(6, width=8, heads=2, context=4)
inputs = np.array([[0, 1, 2, 3]])
targets = np.array([[1, 2, 3, 4]])
mask = np.array([[0., 0., 1., 1.]])
actual = float(model.loss(inputs, targets, mask).data)
logp = log_softmax(model(inputs).data)
selected = logp[0, np.arange(4), targets[0]]
manual = -np.sum(mask[0]*selected)/mask.sum()
assert np.allclose(actual, manual)
changed = targets.copy()
changed[0, :2] = 5
assert np.allclose(model.loss(inputs, changed, mask).data, actual)
print('response-only loss', actual)

```

### Code structure and observed intermediate values


#### Stage 3

```python
model = TinyGPT(6, width=8, heads=2, context=4)
```

#### Stage 4

```python
inputs = np.array([[0, 1, 2, 3]])
```

An observed state during this stage was:

- `inputs`: `[[0 1 2 3]]`

#### Stage 5

```python
targets = np.array([[1, 2, 3, 4]])
```

An observed state during this stage was:

- `targets`: `[[1 2 3 4]]`

#### Stage 6

```python
mask = np.array([[0., 0., 1., 1.]])
```

An observed state during this stage was:

- `mask`: `[[0. 0. 1. 1.]]`

#### Stage 7

```python
actual = float(model.loss(inputs, targets, mask).data)
```

An observed state during this stage was:

- `actual`: `1.644505`

#### Stage 8

```python
logp = log_softmax(model(inputs).data)
```

An observed state during this stage was:

- `logp`: `array shape=(1, 4, 6), min=-2.20625, max=-1.34192, norm=8.9819`

#### Stage 9

```python
selected = logp[0, np.arange(4), targets[0]]
```

An observed state during this stage was:

- `selected`: `[-1.75304 -2.19679 -1.41761 -1.8714 ]`

#### Stage 10

```python
manual = -np.sum(mask[0]*selected)/mask.sum()
```

An observed state during this stage was:

- `manual`: `1.644505`

#### Stage 11

```python
assert np.allclose(actual, manual)
```

#### Stage 12

```python
changed = targets.copy()
```

An observed state during this stage was:

- `changed`: `[[1 2 3 4]]`

#### Stage 13

```python
changed[0, :2] = 5
```

An observed state during this stage was:

- `changed`: `[[5 5 3 4]]`

#### Stage 14

```python
assert np.allclose(model.loss(inputs, changed, mask).data, actual)
```

#### Stage 15

```python
print('response-only loss', actual)
```

Run from the course root:

```bash
python code/26_instruction_sft.py
```

### Recorded output from the supplied environment

```text
response-only loss 1.6445050445689042
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A single included assistant-token loss; excluded targets contribute no direct objective term.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- x + \log{\left(e^{x} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=-1 + \frac{e^{x}}{e^{x} + 1}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{e^{2 x}}{\left(e^{x} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.2 | 0.798138869 | -0.549833997 | 0.247516573 |
| 0 | 0.693147181 | -0.5 | 0.25 |
| 0.2 | 0.598138869 | -0.450166003 | 0.247516573 |

#### Evaluation 1: substitute $x=-0.2$

$$f(-0.2)=\frac{1}{5} + \log{\left(e^{- \frac{1}{5}} + 1 \right)}\approx 0.798138869.$$
At this coordinate the slope is $-0.549833997$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000549833997$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000549710235$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=\log{\left(2 \right)}\approx 0.693147181.$$
At this coordinate the slope is $-0.5$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.25$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0005$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.25e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000499875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=- \frac{1}{5} + \log{\left(1 + e^{\frac{1}{5}} \right)}\approx 0.598138869.$$
At this coordinate the slope is $-0.450166003$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000450166003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000450042249$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.5 | 6.6613e-16 |
| 0.01 | -0.5 | 4.4409e-16 |
| 0.001 | -0.5 | 4.4409e-16 |
| 0.0001 | -0.5 | 6.1018e-13 |
| 1e-05 | -0.5 | 3.2756e-12 |
| 1e-06 | -0.5 | 4.1133e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{3 e^{2 x}}{\left(e^{x} + 1\right)^{2}} + \frac{2 e^{3 x}}{\left(e^{x} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.798138869 | 0.793147181 | 0.798147181 | 8.3112e-06 |
| -0.1 | 0.74439666 | 0.743147181 | 0.744397181 | 5.2049e-07 |
| 0.1 | 0.64439666 | 0.643147181 | 0.644397181 | 5.2049e-07 |
| 0.2 | 0.598138869 | 0.593147181 | 0.598147181 | 8.3112e-06 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Continue into sequence-model training

The complete tiny-transformer supervised-to-DPO program is [sequence_alignment.py](../code/sequence_alignment.py). [Lesson 53](53-capstone-local-system.md) derives its response log-probability aggregation and preference gradients and reports the executed result. This extension updates real transformer parameters on synthetic sequences; it does not rely on a simulated probability change.

## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: parameter-efficient-fine-tuning](https://aman.ai/primers/parameter-efficient-fine-tuning/)

[Previous](25-evaluation-interpretability.md) · [Index](../README.md) · [Next](27-lora-peft.md)
