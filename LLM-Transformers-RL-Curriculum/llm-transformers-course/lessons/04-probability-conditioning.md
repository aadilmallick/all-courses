# 04. Probability, conditioning, and statistical estimation

[Previous](03-calculus-chain-rule.md) · [Index](../README.md) · [Next](05-entropy-softmax.md)

**Part:** Foundations. **Prerequisite:** read lessons 01–03 in order, or verify the earlier definitions used here.

## Uncertainty is represented by a distribution

A categorical variable chooses one label from a finite set. Its probabilities are nonnegative and sum to one. A language model assigns such a distribution to the next token, conditional on a prefix. It does not directly assign a truth value to a sentence.

The joint probability $p(a,b)$ is the probability both events occur. If $p(b)>0$, define $p(a\mid b)=p(a,b)/p(b)$. Multiplying gives $p(a,b)=p(a\mid b)p(b)$. Apply this repeatedly to obtain

$$p(x_1,\ldots,x_T)=\prod_{t=1}^Tp(x_t\mid x_{<t}).$$

This chain rule is exact and does not assume adjacent tokens are independent. A bigram model adds the simplifying assumption $p(x_t\mid x_{<t})=p(x_t\mid x_{t-1})$. A transformer relaxes that short-memory restriction within its available context.

## Bayes' rule with numbers

Suppose a document is relevant with prior probability $0.2$. A retrieval flag appears with probability $0.8$ for relevant documents and $0.1$ for irrelevant documents. The joint probability of relevant and flagged is $0.2\cdot0.8=0.16$. Total flag probability is $0.16+0.8\cdot0.1=0.24$. Consequently relevance given the flag is $0.16/0.24=2/3$. The denominator includes false positives; ignoring their base rate overstates confidence.

## Expectations and likelihood

For discrete $X$, $\mathbb E[f(X)]=\sum_xp(x)f(x)$. The expected reward is a probability-weighted sum of rewards, not necessarily a reward that is ever observed. Variance is $\mathbb E[(X-\mathbb EX)^2]$ and measures spread around that mean.

Observe a Bernoulli outcome $y\in\{0,1\}$ with success probability $p$. Its likelihood is $p^y(1-p)^{1-y}$, so its negative log-likelihood is $-y\log p-(1-y)\log(1-p)$. For independent samples, log-likelihoods add. Averaging rescales the objective; it does not change its unregularized minimizer.

With $s$ successes and $f$ failures, the maximum-likelihood estimate is $s/(s+f)$ when the total is positive. A Beta$(a,b)$ prior yields Beta$(a+s,b+f)$ posterior and mean $(a+s)/(a+b+s+f)$. This mean is a different estimator from the maximum-likelihood solution. It avoids zero probability in small samples when $a,b>0$.

## From mathematical probability to measurement

Dataset frequency estimates a probability under a sampling procedure. It need not represent future users. Correlated examples reduce the amount of independent information; duplicated test prompts can make an error bar look more convincing than it is. Conditional performance on one benchmark should not be interpreted as universal competence.

The experiment computes Bayes' rule by summing disjoint cases and evaluates a Bernoulli loss in logit space. The logit parameter is unconstrained, while its sigmoid always lies strictly between zero and one for finite exact inputs.

### From a finite dataset to uncertainty

For three successes and one failure, the likelihood is $p^3(1-p)$. Its log derivative is $3/p-1/(1-p)$. Setting it to zero gives $3(1-p)=p$, hence $p=3/4$. The second derivative is $-3/p^2-1/(1-p)^2<0$, so this stationary point is a strict maximum of log-likelihood in $(0,1)$. A Beta$(1,1)$ prior instead gives posterior Beta$(4,2)$ and posterior mean $4/6=2/3$. The difference comes from using a prior and a posterior-mean estimator, not from a contradictory probability calculation.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
prior, sensitivity, false_positive = 0.2, 0.8, 0.1
flagged = prior * sensitivity + (1 - prior) * false_positive
posterior = prior * sensitivity / flagged
assert np.allclose(posterior, 2 / 3)
logit = 0.7
probability = 1 / (1 + np.exp(-logit))
labels = np.array([1, 1, 0, 1])
loss = np.mean(np.logaddexp(0, logit) - labels * logit)
print('posterior', posterior, 'probability', probability, 'loss', loss)

```

### Code structure and observed intermediate values


#### Stage 2

```python
prior, sensitivity, false_positive = 0.2, 0.8, 0.1
```

An observed state during this stage was:

- `prior`: `0.2`
- `sensitivity`: `0.8`
- `false_positive`: `0.1`

#### Stage 3

```python
flagged = prior * sensitivity + (1 - prior) * false_positive
```

An observed state during this stage was:

- `flagged`: `0.24`

#### Stage 4

```python
posterior = prior * sensitivity / flagged
```

An observed state during this stage was:

- `posterior`: `0.66666667`

#### Stage 5

```python
assert np.allclose(posterior, 2 / 3)
```

#### Stage 6

```python
logit = 0.7
```

An observed state during this stage was:

- `logit`: `0.7`

#### Stage 7

```python
probability = 1 / (1 + np.exp(-logit))
```

An observed state during this stage was:

- `probability`: `0.66818777`

#### Stage 8

```python
labels = np.array([1, 1, 0, 1])
```

An observed state during this stage was:

- `labels`: `[1 1 0 1]`

#### Stage 9

```python
loss = np.mean(np.logaddexp(0, logit) - labels * logit)
```

An observed state during this stage was:

- `loss`: `0.57818605`

#### Stage 10

```python
print('posterior', posterior, 'probability', probability, 'loss', loss)
```

Run from the course root:

```bash
python code/04_probability_conditioning.py
```

### Recorded output from the supplied environment

```text
posterior 0.6666666666666666 probability 0.6681877721681662 loss 0.578186048885458
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

Average Bernoulli negative log-likelihood for three successes in four trials.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \frac{3 x}{4} + \log{\left(e^{x} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{3}{4} + \frac{e^{x}}{e^{x} + 1}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{e^{2 x}}{\left(e^{x} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.5 | 0.599076984 | -0.127540669 | 0.235003712 |
| 0.7 | 0.578186049 | -0.0818122278 | 0.221712873 |
| 0.9 | 0.566153875 | -0.0390504974 | 0.205500307 |

#### Evaluation 1: substitute $x=0.5$

$$f(0.5)=- \frac{3}{8} + \log{\left(1 + e^{\frac{1}{2}} \right)}\approx 0.599076984.$$
At this coordinate the slope is $-0.127540669$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.235003712$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000127540669$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.17501856e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000127423177$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.7$

$$f(0.7)=- \frac{21}{40} + \log{\left(1 + e^{\frac{7}{10}} \right)}\approx 0.578186049.$$
At this coordinate the slope is $-0.0818122278$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.221712873$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-8.18122278e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.10856437e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-8.17013838e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.9$

$$f(0.9)=- \frac{27}{40} + \log{\left(1 + e^{\frac{9}{10}} \right)}\approx 0.566153875.$$
At this coordinate the slope is $-0.0390504974$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.205500307$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-3.90504974e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.02750154e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-3.89477617e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.08193642269 | 0.00012419 |
| 0.01 | -0.0818134708 | 1.243e-06 |
| 0.001 | -0.08181224026 | 1.243e-08 |
| 0.0001 | -0.08181222796 | 1.2428e-10 |
| 1e-05 | -0.08181222783 | 6.2106e-13 |
| 1e-06 | -0.08181222783 | 6.1722e-12 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{3 e^{2 x}}{\left(e^{x} + 1\right)^{2}} + \frac{2 e^{3 x}}{\left(e^{x} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.599076984 | 0.594548494 | 0.598982752 | 9.4232e-05 |
| -0.1 | 0.58748795 | 0.586367272 | 0.587475836 | 1.2114e-05 |
| 0.1 | 0.571100666 | 0.570004826 | 0.57111339 | 1.2725e-05 |
| 0.2 | 0.566153875 | 0.561823603 | 0.566257861 | 0.00010399 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)

[Previous](03-calculus-chain-rule.md) · [Index](../README.md) · [Next](05-entropy-softmax.md)
