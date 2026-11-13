# 46. LLM judges, ranking, agreement, and controlled experiments

[Previous](45-agent-loops-graphs.md) · [Index](../README.md) · [Next](47-vision-clip.md)

**Part:** Retrieval and agent systems. **Prerequisite:** read lessons 01–45 in order, or verify the earlier definitions used here.

## A judge is a measurement instrument

An LLM judge can score a response, compare a pair, or rank a list. It approximates a desired assessment and can be biased by order, length, style, identity, or persuasive but unsupported explanations. Its output is evidence about an evaluator's judgment, not ground truth by definition.

A rubric should define observable criteria and include anchors. For evidence-grounded answers, score factual support, completeness, citation correctness, and instruction compliance separately. A single 'quality' score can conceal which dimension changed.

## Pairwise order and ties

Presenting A before B may influence a judge. Evaluate both orders, map results back to candidate identity, and inspect disagreement. Permit ties and abstention where the rubric supports them. A forced winner can create artificial distinctions. Blind model identities when identity itself is not part of the criterion.

A Bradley-Terry fit models $P(i\succ j)=\sigma(s_i-s_j)$. Scores are identifiable only up to a common shift. Inconsistent comparisons do not disappear because a fitted ranking exists; inspect residuals and agreement on important subsets.

## Agreement is not correctness

For two binary raters, Cohen's kappa is $(p_o-p_e)/(1-p_e)$, where $p_o$ is observed agreement and $p_e$ is agreement expected from their marginal label rates. High agreement can coexist with shared systematic error. Kappa also depends on prevalence and should not replace task-specific analysis.

A human reference set should include representative hard cases, with adjudication for ambiguous criteria. Measure judge accuracy against that reference, repeatability across runs, order sensitivity, and drift across model versions. If the same judge generates training preferences and evaluates the resulting model, correlated bias can inflate apparent progress.

## Design a paired improvement experiment

Use the same held-out prompts for two systems. Randomize answer order, fix rubric and judge settings, and analyze results by domain and difficulty. Bootstrap independent units, not every sentence from a shared document as if independent. Report win/tie/loss counts alongside uncertainty and cost.

Reranking metrics such as NDCG evaluate graded relevance ordering. Their ideal ranking denominator depends on the relevance labels for that query. A higher NDCG does not directly imply a generator's answer is more factual; retrieval and generation remain distinct measurements.

The example computes kappa and demonstrates how position-swapped preference labels can expose inconsistency. The labels are illustrative input data, not results of actual model judging. This keeps the statistical computation reproducible without claiming an experiment that was never run.

### Agreement can be high for a trivial judge

If 95 percent of examples are labeled acceptable, a judge that always says acceptable has 95 percent raw accuracy. It misses every unacceptable example. Report confusion counts and class-specific recall so this failure is visible. If both the reference and candidate rater have heavily skewed marginals, kappa can differ substantially from raw agreement. Neither statistic alone establishes usefulness for rare but consequential errors. Build a test set with enough examples of the failure modes the judge is intended to detect, then report results by category.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
first = np.array([1, 1, 0, 0, 1, 0, 1, 0])
second = np.array([1, 0, 0, 0, 1, 1, 1, 0])
observed = np.mean(first == second)
expected = first.mean()*second.mean()+(1-first.mean())*(1-second.mean())
kappa = (observed-expected)/(1-expected)
original_winner = np.array(['A', 'B', 'A', 'tie'])
swapped_identity_winner = np.array(['A', 'A', 'A', 'tie'])
consistent = original_winner == swapped_identity_winner
print('agreement', observed, 'kappa', kappa, 'order consistency', consistent.mean())

```

### Code structure and observed intermediate values


#### Stage 2

```python
first = np.array([1, 1, 0, 0, 1, 0, 1, 0])
```

An observed state during this stage was:

- `first`: `[1 1 0 0 1 0 1 0]`

#### Stage 3

```python
second = np.array([1, 0, 0, 0, 1, 1, 1, 0])
```

An observed state during this stage was:

- `second`: `[1 0 0 0 1 1 1 0]`

#### Stage 4

```python
observed = np.mean(first == second)
```

An observed state during this stage was:

- `observed`: `0.75`

#### Stage 5

```python
expected = first.mean()*second.mean()+(1-first.mean())*(1-second.mean())
```

An observed state during this stage was:

- `expected`: `0.5`

#### Stage 6

```python
kappa = (observed-expected)/(1-expected)
```

An observed state during this stage was:

- `kappa`: `0.5`

#### Stage 7

```python
original_winner = np.array(['A', 'B', 'A', 'tie'])
```

An observed state during this stage was:

- `original_winner`: `['A' 'B' 'A' 'tie']`

#### Stage 8

```python
swapped_identity_winner = np.array(['A', 'A', 'A', 'tie'])
```

An observed state during this stage was:

- `swapped_identity_winner`: `['A' 'A' 'A' 'tie']`

#### Stage 9

```python
consistent = original_winner == swapped_identity_winner
```

An observed state during this stage was:

- `consistent`: `[ True False  True  True]`

#### Stage 10

```python
print('agreement', observed, 'kappa', kappa, 'order consistency', consistent.mean())
```

Run from the course root:

```bash
python code/46_llm_judges.py
```

### Recorded output from the supplied environment

```text
agreement 0.75 kappa 0.5 order consistency 0.75
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Pairwise judge-ranking loss for one preferred response; a statistical model of ratings, not proof of truth.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(1 + e^{- x} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{e^{- x}}{1 + e^{- x}}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{- x}}{1 + e^{- x}} - \frac{e^{- 2 x}}{\left(1 + e^{- x}\right)^{2}}.$$

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

$$f(-0.2)=\log{\left(1 + e^{\frac{1}{5}} \right)}\approx 0.798138869.$$
At this coordinate the slope is $-0.549833997$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000549833997$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000549710235$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=\log{\left(2 \right)}\approx 0.693147181.$$
At this coordinate the slope is $-0.5$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.25$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0005$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.25e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000499875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=\log{\left(e^{- \frac{1}{5}} + 1 \right)}\approx 0.598138869.$$
At this coordinate the slope is $-0.450166003$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000450166003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000450042249$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.5 | 4.4409e-16 |
| 0.01 | -0.5 | 4.4409e-16 |
| 0.001 | -0.5 | 4.4409e-16 |
| 0.0001 | -0.5 | 5.0004e-13 |
| 1e-05 | -0.5 | 7.8267e-12 |
| 1e-06 | -0.5000000001 | 6.9889e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=- \frac{e^{- x}}{1 + e^{- x}} + \frac{3 e^{- 2 x}}{\left(1 + e^{- x}\right)^{2}} - \frac{2 e^{- 3 x}}{\left(1 + e^{- x}\right)^{3}}.$$

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


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM-as-a-judge](https://aman.ai/primers/LLM-as-a-judge/)

[Previous](45-agent-loops-graphs.md) · [Index](../README.md) · [Next](47-vision-clip.md)
