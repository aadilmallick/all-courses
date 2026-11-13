# 30. Knowledge distillation, temperature, and prefix distributions

[Previous](29-mixture-of-experts.md) · [Index](../README.md) · [Next](31-rl-foundations.md)

**Part:** Adaptation and compression. **Prerequisite:** read lessons 01–29 in order, or verify the earlier definitions used here.

## A student can learn from distributions

A hard label says which class is correct. A teacher distribution also encodes relative alternatives. Classical distillation trains student probabilities to match softened teacher probabilities, often combined with a hard-label loss. Teacher confidence is not equivalent to truth, so matching a teacher can transfer its mistakes.

Let $p_T=\operatorname{softmax}(z_T/\tau)$ and $p_S=\operatorname{softmax}(z_S/\tau)$. A conventional loss is $\tau^2D_{KL}(p_T\Vert p_S)$. Holding the teacher fixed, differentiate with respect to student logits:

$$\frac{\partial L}{\partial z_{S,k}}=\tau(p_{S,k}-p_{T,k}).$$

The softmax cross-entropy derivative contributes the probability difference, the division by temperature contributes $1/\tau$, and the prefactor contributes $\tau^2$. Their product is $\tau$. The scaling convention is motivated partly by high-temperature gradient behavior; it does not make all temperatures equivalent.

## Direction of divergence changes the target behavior

Forward KL penalizes failing to assign mass where the teacher assigns mass. Reverse KL weights expectations under the student and can favor concentrating on modes. These descriptions are heuristics whose practical effect depends on support, model class, and optimization. If the teacher assigns zero mass where the student is positive, reverse KL can be infinite. Finite logits avoid exact zeros in exact arithmetic, but numerical underflow still matters.

Sequence-level distillation trains on teacher-generated responses as targets. Token-level distillation matches distributions at each supplied prefix. The prefix source is crucial: teacher-generated, dataset, and student-generated prefixes expose different states. A student may imitate well on teacher prefixes but drift during its own rollout.

## On-policy is a distribution choice

On-policy distillation collects prefixes from the student and asks for teacher guidance there. This can address rollout mismatch but requires teacher coverage and reliable feedback on those states. It does not create a theorem that the student must improve. Using teacher-only hidden data at training time can create a mismatch with deployment context.

Compression evaluation should include held-out tasks, out-of-domain behavior, calibration, and actual serving cost. Fewer parameters may not yield proportional speed improvements on a given backend. Synthetic data provenance and teacher/model permissions are practical parts of a reproducible distillation experiment.

The code checks the temperature-scaled gradient against finite differences. It freezes teacher logits and computes stable log-probabilities. The lesson's scalar audit studies a binary soft-target objective; it is the local component of distillation, not a full student-training claim.

### A temperature calculation with all factors visible

For two student logits $(x,0)$ and teacher target $(q,1-q)$ at temperature $\tau$, the teacher-dependent cross-entropy term is $\tau^2[\log(1+e^{x/\tau})-qx/\tau]$. Differentiate: the logarithm contributes $\sigma(x/\tau)/\tau$, and the linear term contributes $-q/\tau$. Multiplying by $\tau^2$ yields $\tau(\sigma(x/\tau)-q)$. The second derivative is $\sigma(x/\tau)(1-\sigma(x/\tau))$. This verifies the code's scale and shows that matching the same softened target under a different temperature is still a different objective.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax, log_softmax, finite_difference
teacher = np.array([2., 0.5, -1.])
student = np.array([0.2, -0.1, 0.4])
temperature = 2.0
teacher_p = softmax(teacher/temperature)
teacher_logp = log_softmax(teacher/temperature)
def objective(logits):
    return temperature**2*np.sum(teacher_p*(teacher_logp-log_softmax(logits/temperature)))
analytic = temperature*(softmax(student/temperature)-teacher_p)
numeric = finite_difference(objective, student)
assert np.allclose(analytic, numeric, atol=1e-7)
print('distillation loss', objective(student), 'gradient', analytic)

```

### Code structure and observed intermediate values


#### Stage 3

```python
teacher = np.array([2., 0.5, -1.])
```

An observed state during this stage was:

- `teacher`: `[ 2.   0.5 -1. ]`

#### Stage 4

```python
student = np.array([0.2, -0.1, 0.4])
```

An observed state during this stage was:

- `student`: `[ 0.2 -0.1  0.4]`

#### Stage 5

```python
temperature = 2.0
```

An observed state during this stage was:

- `temperature`: `2`

#### Stage 6

```python
teacher_p = softmax(teacher/temperature)
```

An observed state during this stage was:

- `teacher_p`: `[0.5898 0.2786 0.1316]`

#### Stage 7

```python
teacher_logp = log_softmax(teacher/temperature)
```

An observed state during this stage was:

- `teacher_logp`: `[-0.52798 -1.27798 -2.02798]`

#### Stage 8

```python
def objective(logits):
    return temperature**2*np.sum(teacher_p*(teacher_logp-log_softmax(logits/temperature)))
```

#### Stage 9

```python
analytic = temperature*(softmax(student/temperature)-teacher_p)
```

An observed state during this stage was:

- `analytic`: `[-0.50526  0.02321  0.48205]`

#### Stage 10

```python
numeric = finite_difference(objective, student)
```

An observed state during this stage was:

- `numeric`: `[-0.50526  0.02321  0.48205]`

#### Stage 11

```python
assert np.allclose(analytic, numeric, atol=1e-7)
```

#### Stage 12

```python
print('distillation loss', objective(student), 'gradient', analytic)
```

Run from the course root:

```bash
python code/30_knowledge_distillation.py
```

### Recorded output from the supplied environment

```text
distillation loss 0.7258984752800344 gradient [-0.50525896  0.02320531  0.48205365]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Temperature-two binary distillation loss up to a teacher-only constant.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \frac{8 x}{5} + 4 \log{\left(e^{\frac{x}{2}} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{8}{5} + \frac{2 e^{\frac{x}{2}}}{e^{\frac{x}{2}} + 1}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{\frac{x}{2}}}{e^{\frac{x}{2}} + 1} - \frac{e^{x}}{\left(e^{\frac{x}{2}} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0 | 2.77258872 | -0.6 | 0.25 |
| 0.2 | 2.65758664 | -0.550041625 | 0.24937604 |
| 0.4 | 2.55255548 | -0.500332005 | 0.247516573 |

#### Evaluation 1: substitute $x=0$

$$f(0)=4 \log{\left(2 \right)}\approx 2.77258872.$$
At this coordinate the slope is $-0.6$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.25$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0006$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.25e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000599875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.2$

$$f(0.2)=- \frac{8}{25} + 4 \log{\left(1 + e^{\frac{1}{10}} \right)}\approx 2.65758664.$$
At this coordinate the slope is $-0.550041625$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.24937604$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000550041625$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.2468802e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000549916938$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.4$

$$f(0.4)=- \frac{16}{25} + 4 \log{\left(1 + e^{\frac{1}{5}} \right)}\approx 2.55255548.$$
At this coordinate the slope is $-0.500332005$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000500332005$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000500208249$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.5500520045 | 1.0379e-05 |
| 0.01 | -0.5500417289 | 1.0382e-07 |
| 0.001 | -0.5500416261 | 1.0383e-09 |
| 0.0001 | -0.5500416251 | 9.3361e-12 |
| 1e-05 | -0.550041625 | 4.8952e-12 |
| 1e-06 | -0.5500416254 | 3.1576e-10 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{\frac{x}{2}}}{2 \left(e^{\frac{x}{2}} + 1\right)} - \frac{3 e^{x}}{2 \left(e^{\frac{x}{2}} + 1\right)^{2}} + \frac{e^{\frac{3 x}{2}}}{\left(e^{\frac{x}{2}} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 2.77258872 | 2.76759497 | 2.77258249 | 6.2361e-06 |
| -0.1 | 2.71383859 | 2.7125908 | 2.71383768 | 9.0905e-07 |
| 0.1 | 2.60382819 | 2.60258248 | 2.60382936 | 1.1668e-06 |
| 0.2 | 2.55255548 | 2.54757832 | 2.55256584 | 1.0359e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: knowledge-distillation](https://aman.ai/primers/knowledge-distillation/)

[Previous](29-mixture-of-experts.md) · [Index](../README.md) · [Next](31-rl-foundations.md)
