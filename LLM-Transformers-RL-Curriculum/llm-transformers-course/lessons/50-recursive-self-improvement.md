# 50. Recursive improvement, self-training, self-play, and evidence

[Previous](49-recursive-transformers.md) · [Index](../README.md) · [Next](51-physical-ai-control.md)

**Part:** Multimodal and embodied models. **Prerequisite:** read lessons 01–49 in order, or verify the earlier definitions used here.

## Specify what persists between iterations

An improvement loop can revise an answer, change a prompt, store memory, generate training data, tune weights, or modify an orchestration program. These are different interventions. A better answer in one session is not evidence that the underlying model weights improved. A stored skill is not the same as a new learned representation.

A credible experiment names the object being changed, the proposal mechanism, the evaluator, the persistence mechanism, and the held-out measurement. Keep versions so a failed update can be diagnosed and reverted. Measure resource cost as well as task score.

## Selection can overfit a checker

Suppose many candidates have equal true quality but noisy measured scores. Selecting the largest measured score preferentially selects positive noise. Evaluating the selected candidate on independent data often produces a lower score. This selection effect grows with the number of candidates and can mimic progress.

For iid binary success outcomes, a sample mean has standard error approximately $\sqrt{p(1-p)/n}$ under the usual large-sample approximation. Repeatedly selecting improvements based on tiny differences within that noise can produce a misleading staircase. Independent held-out tasks and final evaluation reduce this specific failure mode, though they do not solve every distribution shift.

## Self-training changes the data distribution

Generating candidate solutions, filtering with a verifier, and training on accepted examples can improve a targeted skill when the generator produces useful diversity and the verifier is reliable. If errors pass the filter or rare modes disappear, later training can reinforce mistakes and narrow coverage. Synthetic data quality and diversity need explicit measurement.

Self-play creates tasks through interaction among policies or roles. It can generate a curriculum, but success in a closed game need not transfer to external tasks. Ground the evaluation in the intended deployment problem, and keep task generation separate from final test construction.

## Distinguish evidence from extrapolation

Bounded iterative refinement with external tests is an established engineering pattern. Open-ended claims of unlimited recursive improvement require much stronger evidence about generalization, evaluator validity, resource scaling, and persistent capability change. A rising internal score alone does not establish those claims.

The example uses two independent noisy datasets to show selection optimism. Candidate true qualities are all equal. Choosing the highest development score yields an apparently improved winner, while its independent test score has no reason to retain that noise advantage. This is a controlled counterexample to the inference 'the loop found a higher score, therefore it improved capability.'

Optional application: give candidates genuinely different true qualities and vary evaluation sample size. Observe when selection begins to recover the better candidate reliably. This connects statistical power to improvement-loop design.

### Improvement claims need a preserved external task

If iteration one is scored on arithmetic and iteration two on easier formatting tasks, a higher score is not evidence of general capability improvement. If the loop edits its own tests, passing more tests can reflect weakened requirements. Preserve an independent evaluation target and version its data. Allow the system to propose new tests, but distinguish those exploratory tests from the held-out measurement. A rigorous improvement claim identifies the changed artifact, the unchanged measurement, the resource budget, and uncertainty across repeated runs.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(50)
candidates, trials = 50, 100
true_probability = .6
development = (rng.random((candidates, trials)) < true_probability).mean(axis=1)
independent_test = (rng.random((candidates, 10000)) < true_probability).mean(axis=1)
winner = development.argmax()
print('selected candidate', int(winner), 'development', development[winner])
print('independent test', independent_test[winner], 'true quality', true_probability)
assert development[winner] >= development.mean()

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(50)
```

#### Stage 3

```python
candidates, trials = 50, 100
```

An observed state during this stage was:

- `candidates`: `50`
- `trials`: `100`

#### Stage 4

```python
true_probability = .6
```

An observed state during this stage was:

- `true_probability`: `0.6`

#### Stage 5

```python
development = (rng.random((candidates, trials)) < true_probability).mean(axis=1)
```

An observed state during this stage was:

- `development`: `array shape=(50,), min=0.47, max=0.69, norm=4.23161`

#### Stage 6

```python
independent_test = (rng.random((candidates, 10000)) < true_probability).mean(axis=1)
```

An observed state during this stage was:

- `independent_test`: `array shape=(50,), min=0.5918, max=0.6103, norm=4.24548`

#### Stage 7

```python
winner = development.argmax()
```

An observed state during this stage was:

- `winner`: `np.int64(19)`

#### Stage 8

```python
print('selected candidate', int(winner), 'development', development[winner])
```

#### Stage 9

```python
print('independent test', independent_test[winner], 'true quality', true_probability)
```

#### Stage 10

```python
assert development[winner] >= development.mean()
```

Run from the course root:

```bash
python code/50_recursive_self_improvement.py
```

### Recorded output from the supplied environment

```text
selected candidate 19 development 0.69
independent test 0.5962 true quality 0.6
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Binomial standard-error approximation as independent evaluation sample count changes; x must be positive.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{\sqrt{6} \sqrt{\frac{1}{x}}}{5}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{\sqrt{6} \sqrt{\frac{1}{x}}}{10 x}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{3 \sqrt{6} \sqrt{\frac{1}{x}}}{20 x^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 90 | 0.0516397779 | -0.000286887655 | 4.78146092e-06 |
| 100 | 0.0489897949 | -0.000244948974 | 3.67423461e-06 |
| 110 | 0.0467099366 | -0.000212317894 | 2.89524401e-06 |

#### Evaluation 1: substitute $x=90$

$$f(90)=\frac{\sqrt{15}}{75}\approx 0.0516397779.$$
At this coordinate the slope is $-0.000286887655$, so the function decreases under a sufficiently small positive perturbation. The curvature is $4.78146092e-06$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-2.86887655e-07$. The quadratic correction is $f^{(2)}(x)h^2/2\approx2.39073046e-12$. Adding them predicts the second-order change. The actual change from direct substitution is $-2.86885265e-07$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=100$

$$f(100)=\frac{\sqrt{6}}{50}\approx 0.0489897949.$$
At this coordinate the slope is $-0.000244948974$, so the function decreases under a sufficiently small positive perturbation. The curvature is $3.67423461e-06$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-2.44948974e-07$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.83711731e-12$. Adding them predicts the second-order change. The actual change from direct substitution is $-2.44947137e-07$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=110$

$$f(110)=\frac{\sqrt{165}}{275}\approx 0.0467099366.$$
At this coordinate the slope is $-0.000212317894$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2.89524401e-06$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-2.12317894e-07$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.447622e-12$. Adding them predicts the second-order change. The actual change from direct substitution is $-2.12316446e-07$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.0002449491274 | 1.5309e-10 |
| 0.01 | -0.0002449489758 | 1.531e-12 |
| 0.001 | -0.0002449489743 | 1.66e-14 |
| 0.0001 | -0.0002449489743 | 2.0069e-14 |
| 1e-05 | -0.0002449489746 | 3.6701e-13 |
| 1e-06 | -0.0002449489743 | 2.0069e-14 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \frac{3 \sqrt{6} \sqrt{\frac{1}{x}}}{8 x^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -10 | 0.0516397779 | 0.0514392846 | 0.0516229963 | 1.6782e-05 |
| -5 | 0.050262469 | 0.0502145397 | 0.0502604677 | 2.0013e-06 |
| 5 | 0.0478091444 | 0.04776505 | 0.0478109779 | 1.8335e-06 |
| 10 | 0.0467099366 | 0.0465403051 | 0.0467240168 | 1.408e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: recursive-self-improvement](https://aman.ai/primers/recursive-self-improvement/)

[Previous](49-recursive-transformers.md) · [Index](../README.md) · [Next](51-physical-ai-control.md)
