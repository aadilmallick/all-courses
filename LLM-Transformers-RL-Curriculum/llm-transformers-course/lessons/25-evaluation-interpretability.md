# 25. Evaluation, calibration, and mechanistic investigation

[Previous](24-long-context.md) · [Index](../README.md) · [Next](26-instruction-sft.md)

**Part:** Adaptation and compression. **Prerequisite:** read lessons 01–24 in order, or verify the earlier definitions used here.

## Decide what success means before measuring it

Next-token loss, factual question answering, code execution, instruction following, and calibrated uncertainty are different targets. A single score cannot establish all of them. Choose a deployment population, specify a metric, reserve an evaluation set, and record uncertainty. Reusing the test set to tune prompts turns it into development data.

Exact match is useful when an answer has a canonical representation. It can punish equivalent wording. Semantic scoring can recognize paraphrases but introduce evaluator bias. Executable tests provide strong evidence for specified behavior but can miss untested cases. Evaluation design is the problem of making these limitations explicit.

## Calibration with a numerical example

A predictor is calibrated for an event if among cases assigned probability $p$, the event occurs with frequency $p$ under the evaluation distribution. Accuracy alone does not establish calibration. A model that is 80 percent correct and always claims 99 percent confidence is overconfident.

For a binary event $y$ and probability $p$, Brier loss is $(p-y)^2$. Its expected value under true success rate $q$ is $q(p-1)^2+(1-q)p^2=p^2-2pq+q$. Differentiating gives $2(p-q)$, so the unique minimizer on $[0,1]$ is $p=q$. This is a proper scoring rule. Log loss is also proper under its support conditions.

Expected calibration error bins confidence and compares empirical accuracy with mean confidence. Its value depends on binning and sample size. A coarse bin can hide errors that cancel. Report reliability data and uncertainty rather than treating one ECE number as a complete description.

## From inspection to causal evidence

Attention maps reveal one intermediate quantity. They do not by themselves identify the cause of a decision. Probe classifiers show information can be decoded, but not that the model uses that information. Ablation removes a component; activation patching replaces internal states between runs; controlled interventions can test causal hypotheses. Distribution shifts caused by an intervention complicate interpretation.

For an induction-like behavior, construct matched examples, locate candidate components, intervene, and measure a specific output change. Include negative controls and alternative explanations. A circuit description is stronger when it predicts behavior beyond the examples used to discover it.

## Statistical discipline

A paired comparison uses the same examples for both systems. Bootstrap over independent units such as users or documents when examples are clustered. A confidence interval quantifies a sampling procedure, not every source of uncertainty, including contamination and evaluator error.

The example computes Brier score and bootstrap uncertainty for a small paired accuracy difference. It illustrates the calculation, but eight examples are too few for a reliable deployment decision. The deliberately modest sample makes this limitation visible.

### A calibrated constant predictor can still be unhelpful

If a dataset has 70 percent positive labels, always predicting 0.7 can be calibrated at its one confidence value. Yet it distinguishes no individual cases. A perfect ranking model might discriminate examples well but need probability recalibration. Calibration and discrimination are therefore separate axes. Under Brier loss, the constant predictor's expected score is $0.7(0.3)^2+0.3(0.7)^2=0.21$. A perfectly accurate probability predictor has zero. Report calibration alongside task accuracy and discrimination metrics suitable for the application.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(25)
labels = np.array([1, 0, 1, 1, 0, 0, 1, 0])
probability = np.array([.8, .3, .6, .9, .4, .1, .7, .2])
brier = np.mean((probability-labels)**2)
a = np.array([1, 1, 0, 1, 1, 0, 1, 1])
b = np.array([1, 0, 0, 1, 1, 0, 1, 0])
differences = a-b
samples = rng.choice(differences, size=(2000, len(differences)), replace=True).mean(axis=1)
print('Brier', brier, 'paired improvement', differences.mean())
print('illustrative bootstrap interval', np.quantile(samples, [.025, .975]))

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(25)
```

#### Stage 3

```python
labels = np.array([1, 0, 1, 1, 0, 0, 1, 0])
```

An observed state during this stage was:

- `labels`: `[1 0 1 1 0 0 1 0]`

#### Stage 4

```python
probability = np.array([.8, .3, .6, .9, .4, .1, .7, .2])
```

An observed state during this stage was:

- `probability`: `[0.8 0.3 0.6 0.9 0.4 0.1 0.7 0.2]`

#### Stage 5

```python
brier = np.mean((probability-labels)**2)
```

An observed state during this stage was:

- `brier`: `0.075`

#### Stage 6

```python
a = np.array([1, 1, 0, 1, 1, 0, 1, 1])
```

An observed state during this stage was:

- `a`: `[1 1 0 1 1 0 1 1]`

#### Stage 7

```python
b = np.array([1, 0, 0, 1, 1, 0, 1, 0])
```

An observed state during this stage was:

- `b`: `[1 0 0 1 1 0 1 0]`

#### Stage 8

```python
differences = a-b
```

An observed state during this stage was:

- `differences`: `[0 1 0 0 0 0 0 1]`

#### Stage 9

```python
samples = rng.choice(differences, size=(2000, len(differences)), replace=True).mean(axis=1)
```

An observed state during this stage was:

- `samples`: `array shape=(2000,), min=0, max=0.75, norm=13.051`

#### Stage 10

```python
print('Brier', brier, 'paired improvement', differences.mean())
```

#### Stage 11

```python
print('illustrative bootstrap interval', np.quantile(samples, [.025, .975]))
```

Run from the course root:

```bash
python code/25_evaluation_interpretability.py
```

### Recorded output from the supplied environment

```text
Brier 0.07500000000000001 paired improvement 0.25
illustrative bootstrap interval [0.    0.625]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Expected Brier score when true binary success probability is 0.7.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\frac{3 x^{2}}{10} + \frac{7 \left(x - 1\right)^{2}}{10}.$$

Its first derivative is

$$f^{(1)}(x)=2 x - \frac{7}{5}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=2.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.2 | 0.46 | -1 | 2 |
| 0.4 | 0.3 | -0.6 | 2 |
| 0.6 | 0.22 | -0.2 | 2 |

#### Evaluation 1: substitute $x=0.2$

$$f(0.2)=\frac{23}{50}\approx 0.46.$$
At this coordinate the slope is $-1$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.001$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000999$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.4$

$$f(0.4)=\frac{3}{10}\approx 0.3.$$
At this coordinate the slope is $-0.6$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0006$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000599$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.6$

$$f(0.6)=\frac{11}{50}\approx 0.22.$$
At this coordinate the slope is $-0.2$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0002$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000199$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.6 | 2.2204e-16 |
| 0.01 | -0.6 | 6.6613e-16 |
| 0.001 | -0.6 | 1.0436e-14 |
| 0.0001 | -0.6 | 4.5075e-14 |
| 1e-05 | -0.6 | 4.9509e-12 |
| 1e-06 | -0.6 | 4.5009e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.46 | 0.42 | 0.46 | 1.1102e-16 |
| -0.1 | 0.37 | 0.36 | 0.37 | 5.5511e-17 |
| 0.1 | 0.25 | 0.24 | 0.25 | 0 |
| 0.2 | 0.22 | 0.18 | 0.22 | 2.7756e-17 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: LLM-as-a-judge](https://aman.ai/primers/LLM-as-a-judge/)

[Previous](24-long-context.md) · [Index](../README.md) · [Next](26-instruction-sft.md)
