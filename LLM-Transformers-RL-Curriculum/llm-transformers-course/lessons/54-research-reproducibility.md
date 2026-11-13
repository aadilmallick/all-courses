# 54. Read papers, reproduce claims, and design the next experiment

[Previous](53-capstone-local-system.md) · [Index](../README.md) · [Course home](../README.md)

**Part:** Synthesis and independent research. **Prerequisite:** read lessons 01–53 in order, or verify the earlier definitions used here.

## Turn a paper's equation into a program specification

Start with the question, setting, assumptions, and claimed improvement. Identify what changes relative to a baseline. Separate an architectural change from a training-data change, a compute increase, and an evaluation change. A larger score after all four change does not isolate which intervention caused the gain.

For each equation, list symbol domains and shapes. State which variables are random, which are optimized, and which are fixed. Identify the expectation distribution and reduction convention. Expand one coordinate or one two-action case before implementing the vectorized version. Then check limits, units where meaningful, and degenerate cases.

## A reproducibility ladder

First reproduce a mathematical identity with tiny arrays. Next reproduce a local algorithmic behavior with a controlled toy task. Then reproduce a training trend under matched conditions. Finally reproduce a reported benchmark with documented data, model, compute, and evaluation versions. These are different levels of evidence. Passing the first does not imply the fourth.

A useful experiment manifest records code revision, dependency versions, random seeds, tokenizer, data split hashes, architecture, optimizer, schedule, precision, hardware, evaluation settings, and checkpoint identity. Some accelerated backends remain nondeterministic despite a seed. Report tolerances and repeated-run variation where relevant.

## Falsifiable hypotheses and ablations

'Adding a memory module helps' is too broad. A sharper hypothesis is: under a fixed model and token budget, retrieving source-grounded notes improves accuracy on questions whose evidence was absent from the live context, with no increase in unsupported citations. Specify the test set and failure criteria before examining results.

Ablate one factor at a time when feasible, and include a matched-cost baseline. If an agent uses five model calls while a baseline uses one, improved quality may reflect additional compute rather than the proposed topology. A fair comparison can report both fixed-budget and best-achievable tradeoffs.

## Audit uncertainty without paralysis

Classify statements as definitions, algebraic identities, theorems under hypotheses, empirical results, heuristics, or open questions. Do not promote a heuristic to a theorem by writing it as an equation. A measured result applies to its setup; its extension to another domain is an inference that needs testing.

The course's primary-paper index supports further reading. Its primer mapping records which supplied pages motivated each topic. The lessons are original instructional explanations; source pages are not copied as a substitute for derivation. Emerging recursive and physical-AI topics remain a moving research frontier.

## Reconstruct an independent check

The example checks the KL-regularized optimum identity from earlier lessons in two independent ways: closed-form exponential tilting and a grid search over a two-action simplex. The finite grid only approximates the optimum, so comparison uses a tolerance tied to grid spacing. This is the habit to carry into new work: state the property, construct an independent route, and interpret the residual honestly.

A next project could replace one toy component with a trained public model while preserving the same contracts and tests. Choose one capability to measure deeply before adding more architecture.

### A published effect and a causal explanation are different claims

A reported benchmark gain establishes an empirical observation under a particular setup, subject to its measurement quality. Explaining that gain requires comparisons that isolate the proposed mechanism. If a sparse model gains accuracy but also uses more total parameters and different data, the mechanism is underdetermined. Reproduce the observation, then test competing explanations with controlled ablations. Record unsuccessful experiments too: omitting them can exaggerate confidence in the chosen story. This is the research analogue of the course's independent numerical checks.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax
reference = np.array([.6, .4])
reward = np.array([0., 1.])
beta = .7
closed = softmax(np.log(reference)+reward/beta)
grid = np.linspace(.0001, .9999, 10001)
policy = np.stack([1-grid, grid], axis=1)
objective = policy @ reward-beta*np.sum(policy*np.log(policy/reference), axis=1)
best = policy[objective.argmax()]
assert np.max(np.abs(best-closed)) < .0002
print('closed form', closed, 'grid optimum', best)

```

### Code structure and observed intermediate values


#### Stage 3

```python
reference = np.array([.6, .4])
```

An observed state during this stage was:

- `reference`: `[0.6 0.4]`

#### Stage 4

```python
reward = np.array([0., 1.])
```

An observed state during this stage was:

- `reward`: `[0. 1.]`

#### Stage 5

```python
beta = .7
```

An observed state during this stage was:

- `beta`: `0.7`

#### Stage 6

```python
closed = softmax(np.log(reference)+reward/beta)
```

An observed state during this stage was:

- `closed`: `[0.26442 0.73558]`

#### Stage 7

```python
grid = np.linspace(.0001, .9999, 10001)
```

An observed state during this stage was:

- `grid`: `array shape=(10001,), min=0.0001, max=0.9999, norm=57.7365`

#### Stage 8

```python
policy = np.stack([1-grid, grid], axis=1)
```

An observed state during this stage was:

- `policy`: `array shape=(10001, 2), min=0.0001, max=0.9999, norm=81.6517`

#### Stage 9

```python
objective = policy @ reward-beta*np.sum(policy*np.log(policy/reference), axis=1)
```

An observed state during this stage was:

- `objective`: `array shape=(10001,), min=-0.356792, max=0.573566, norm=42.7532`

#### Stage 10

```python
best = policy[objective.argmax()]
```

An observed state during this stage was:

- `best`: `[0.26445 0.73555]`

#### Stage 11

```python
assert np.max(np.abs(best-closed)) < .0002
```

#### Stage 12

```python
print('closed form', closed, 'grid optimum', best)
```

Run from the course root:

```bash
python code/54_research_reproducibility.py
```

### Recorded output from the supplied environment

```text
closed form [0.26442277 0.73557723] grid optimum [0.26444712 0.73555288]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Two-action KL-regularized reward objective; domain is strictly between zero and one.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \frac{7 x \log{\left(\frac{5 x}{2} \right)}}{10} + x - \frac{7 \left(1 - x\right) \log{\left(\frac{5}{3} - \frac{5 x}{3} \right)}}{10}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{7 \left(1 - x\right)}{6 \left(\frac{5}{3} - \frac{5 x}{3}\right)} - \frac{7 \log{\left(\frac{5 x}{2} \right)}}{10} + \frac{7 \log{\left(\frac{5}{3} - \frac{5 x}{3} \right)}}{10} + \frac{3}{10}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{35 \left(1 - x\right)}{18 \left(\frac{5}{3} - \frac{5 x}{3}\right)^{2}} - \frac{7}{3 \left(\frac{5}{3} - \frac{5 x}{3}\right)} - \frac{7}{10 x}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.35 | 0.346295759 | 1.14950187 | -3.07692308 |
| 0.5 | 0.485712302 | 0.716174424 | -2.8 |
| 0.65 | 0.561148086 | 0.282846978 | -3.07692308 |

#### Evaluation 1: substitute $x=0.35$

$$f(0.35)=- \frac{91 \log{\left(\frac{13}{12} \right)}}{200} - \frac{49 \log{\left(\frac{7}{8} \right)}}{200} + \frac{7}{20}\approx 0.346295759.$$
At this coordinate the slope is $1.14950187$, so the function increases under a sufficiently small positive perturbation. The curvature is $-3.07692308$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.00114950187$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.53846154e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.00114796408$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.5$

$$f(0.5)=- \frac{7 \log{\left(\frac{5}{4} \right)}}{20} - \frac{7 \log{\left(\frac{5}{6} \right)}}{20} + \frac{1}{2}\approx 0.485712302.$$
At this coordinate the slope is $0.716174424$, so the function increases under a sufficiently small positive perturbation. The curvature is $-2.8$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000716174424$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.4e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000714774423$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.65$

$$f(0.65)=- \frac{91 \log{\left(\frac{13}{8} \right)}}{200} - \frac{49 \log{\left(\frac{7}{12} \right)}}{200} + \frac{13}{20}\approx 0.561148086.$$
At this coordinate the slope is $0.282846978$, so the function increases under a sufficiently small positive perturbation. The curvature is $-3.07692308$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000282846978$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.53846154e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000281307839$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.7161744243 | 4.4409e-16 |
| 0.01 | 0.7161744243 | 4.5519e-15 |
| 0.001 | 0.7161744243 | 2.6756e-14 |
| 0.0001 | 0.7161744243 | 1.9329e-13 |
| 1e-05 | 0.7161744243 | 1.4722e-12 |
| 1e-06 | 0.7161744243 | 2.3508e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{175 \left(1 - x\right)}{27 \left(\frac{5}{3} - \frac{5 x}{3}\right)^{3}} - \frac{35}{6 \left(\frac{5}{3} - \frac{5 x}{3}\right)^{2}} + \frac{7}{10 x^{2}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.15 | 0.346295759 | 0.378286138 | 0.346786138 | 0.00049038 |
| -0.075 | 0.42409442 | 0.43199922 | 0.42412422 | 2.98e-05 |
| 0.075 | 0.531520583 | 0.539425384 | 0.531550384 | 2.98e-05 |
| 0.15 | 0.561148086 | 0.593138466 | 0.561638466 | 0.00049038 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: recursive-self-improvement](https://aman.ai/primers/recursive-self-improvement/)

[Previous](53-capstone-local-system.md) · [Index](../README.md) · [Course home](../README.md)
