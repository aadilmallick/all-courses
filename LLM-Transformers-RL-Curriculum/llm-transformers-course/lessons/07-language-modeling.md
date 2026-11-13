# 07. Language modeling from counts to autoregression

[Previous](06-neural-networks-autodiff.md) · [Index](../README.md) · [Next](08-tokenization-bpe.md)

**Part:** Language and attention. **Prerequisite:** read lessons 01–06 in order, or verify the earlier definitions used here.

## Start with a problem small enough to solve exactly

Given a prefix, predict the next token. A bigram table stores a distribution for every previous token. Counting transitions supplies the maximum-likelihood estimate, but an unseen transition receives probability zero. One such event makes the probability of the whole sequence zero. Smoothing trades exact fit for more robust estimates.

Let $C_{ij}$ count transitions from token $i$ to token $j$, with vocabulary size $V$. Add-$\alpha$ smoothing defines $p(j\mid i)=(C_{ij}+\alpha)/(\sum_k C_{ik}+\alpha V)$ for $\alpha>0$. Summing the numerators over $j$ reproduces the denominator, proving normalization. A row with no observations becomes uniform. Smoothing is a prior-like modeling choice, not evidence that all transitions actually occur.

For counts $(3,1,0)$ and $\alpha=1$, probabilities become $(4,2,1)/7$. The observed first token's probability decreases from $3/4$ to $4/7$ because some mass is reserved for uncertainty. In a neural model, shared parameters permit statistical generalization across prefixes; a count table has no such learned representation.

## Factor a sequence, then form training pairs

For tokens $(a,b,c,d)$, inputs are $(a,b,c)$ and labels are $(b,c,d)$. Position zero predicts $b$ from $a$; it must not see $b$ in its input state. Causal masking preserves this rule while allowing all positions' losses to be computed in one training pass. Teacher forcing provides the correct preceding tokens during training. During generation, the model conditions on its own earlier outputs, so errors can change the future prefix distribution.

The training objective is $L=-N^{-1}\sum_{n,t}\log p_\theta(x_t^{(n)}\mid x_{<t}^{(n)})$, with $N$ the number of included target positions. A token mean and an example mean differ when sequence lengths vary. Specify the denominator rather than saying only 'average loss.'

## Train and validation are different questions

Training loss measures fit to observed examples. Validation loss estimates generalization to a chosen held-out population. Split whole documents before producing overlapping windows; otherwise almost identical text can appear in both sets. A chronological split may be appropriate for forecasting, while a source or domain split tests another kind of generalization.

A small model that memorizes `abac` can achieve low loss without learning natural language. That is acceptable for verifying shifting, masking, gradient flow, and sampling. It is not a substitute for a realistic evaluation.

The code builds a smoothed transition model and computes a sequence loss. The first token is treated as given; a complete document model also needs a beginning distribution and an end-of-sequence convention. This distinction prevents an off-by-one mismatch between the stated probability and the implemented one.

### A normalized joint needs a stopping convention

Suppose vocabulary is $\{a,\mathrm{EOS}\}$ and each step emits EOS with probability $q\in(0,1)$. The probability of exactly $n$ copies of $a$ followed by EOS is $(1-q)^nq$. Summing over $n\ge0$ gives $q/[1-(1-q)]=1$. Thus the model defines a normalized distribution over finite strings. If EOS probability were always zero, no finite output would terminate under this process. Fixed-length sequence likelihood and variable-length generation are different specifications. Explicit stopping rules matter both to mathematical normalization and to practical token budgets.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
sequence = np.array([0, 1, 0, 2, 0, 1, 0, 2])
vocabulary, alpha = 3, 1.0
counts = np.zeros((vocabulary, vocabulary))
np.add.at(counts, (sequence[:-1], sequence[1:]), 1)
probability = (counts + alpha) / (counts.sum(axis=1, keepdims=True) + alpha * vocabulary)
assert np.allclose(probability.sum(axis=1), 1)
loss = -np.log(probability[sequence[:-1], sequence[1:]]).mean()
print('counts', counts, 'loss', loss, 'perplexity', np.exp(loss))

```

### Code structure and observed intermediate values


#### Stage 2

```python
sequence = np.array([0, 1, 0, 2, 0, 1, 0, 2])
```

An observed state during this stage was:

- `sequence`: `[0 1 0 2 0 1 0 2]`

#### Stage 3

```python
vocabulary, alpha = 3, 1.0
```

An observed state during this stage was:

- `vocabulary`: `3`
- `alpha`: `1`

#### Stage 4

```python
counts = np.zeros((vocabulary, vocabulary))
```

An observed state during this stage was:

- `counts`: `[[0. 0. 0.]  [0. 0. 0.]  [0. 0. 0.]]`

#### Stage 5

```python
np.add.at(counts, (sequence[:-1], sequence[1:]), 1)
```

An observed state during this stage was:

- `counts`: `[[0. 2. 2.]  [2. 0. 0.]  [1. 0. 0.]]`

#### Stage 6

```python
probability = (counts + alpha) / (counts.sum(axis=1, keepdims=True) + alpha * vocabulary)
```

An observed state during this stage was:

- `probability`: `[[0.14286 0.42857 0.42857]  [0.6     0.2     0.2    ]  [0.5     0.25    0.25   ]]`

#### Stage 7

```python
assert np.allclose(probability.sum(axis=1), 1)
```

#### Stage 8

```python
loss = -np.log(probability[sequence[:-1], sequence[1:]]).mean()
```

An observed state during this stage was:

- `loss`: `0.72914141`

#### Stage 9

```python
print('counts', counts, 'loss', loss, 'perplexity', np.exp(loss))
```

Run from the course root:

```bash
python code/07_language_modeling.py
```

### Recorded output from the supplied environment

```text
counts [[0. 2. 2.]
 [2. 0. 0.]
 [1. 0. 0.]] loss 0.7291414099486773 perplexity 2.07329972874055
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A row of a learned transition model: its binary next-token loss.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=- \frac{4 x}{5} + \log{\left(e^{x} + 1 \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{4}{5} + \frac{e^{x}}{e^{x} + 1}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{e^{2 x}}{\left(e^{x} + 1\right)^{2}}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.2 | 0.758138869 | -0.349833997 | 0.247516573 |
| 0 | 0.693147181 | -0.3 | 0.25 |
| 0.2 | 0.638138869 | -0.250166003 | 0.247516573 |

#### Evaluation 1: substitute $x=-0.2$

$$f(-0.2)=\frac{4}{25} + \log{\left(e^{- \frac{1}{5}} + 1 \right)}\approx 0.758138869.$$
At this coordinate the slope is $-0.349833997$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000349833997$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000349710235$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0$

$$f(0)=\log{\left(2 \right)}\approx 0.693147181.$$
At this coordinate the slope is $-0.3$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.25$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.25e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000299875$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.2$

$$f(0.2)=- \frac{4}{25} + \log{\left(1 + e^{\frac{1}{5}} \right)}\approx 0.638138869.$$
At this coordinate the slope is $-0.250166003$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.247516573$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000250166003$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1.23758286e-07$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000250042249$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.3 | 2.2204e-16 |
| 0.01 | -0.3 | 2.2204e-16 |
| 0.001 | -0.3 | 2.2427e-14 |
| 0.0001 | -0.3 | 8.1024e-13 |
| 1e-05 | -0.3 | 8.6267e-12 |
| 1e-06 | -0.3 | 4.6884e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{e^{x}}{e^{x} + 1} - \frac{3 e^{2 x}}{\left(e^{x} + 1\right)^{2}} + \frac{2 e^{3 x}}{\left(e^{x} + 1\right)^{3}}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.758138869 | 0.753147181 | 0.758147181 | 8.3112e-06 |
| -0.1 | 0.72439666 | 0.723147181 | 0.724397181 | 5.2049e-07 |
| 0.1 | 0.66439666 | 0.663147181 | 0.664397181 | 5.2049e-07 |
| 0.2 | 0.638138869 | 0.633147181 | 0.638147181 | 8.3112e-06 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: transformers](https://aman.ai/primers/transformers/)

[Previous](06-neural-networks-autodiff.md) · [Index](../README.md) · [Next](08-tokenization-bpe.md)
