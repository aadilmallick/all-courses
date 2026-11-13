# 24. Long-context modeling and position extrapolation

[Previous](23-efficient-attention.md) · [Index](../README.md) · [Next](25-evaluation-interpretability.md)

**Part:** Training and inference. **Prerequisite:** read lessons 01–23 in order, or verify the earlier definitions used here.

## Capacity to accept tokens differs from capacity to use them

A configured context limit says how much input an implementation permits. Effective long-context ability asks whether the model can retrieve, combine, and reason over the relevant information at that length. A single planted keyword tests a narrow retrieval property. Multi-document synthesis, distractor resistance, ordering, and evidence integration are harder and different tasks.

Increasing context raises attention work, key/value cache memory, and potentially distractor interference. Retrieval can reduce the amount of irrelevant material, while long-context processing can retain relationships that a retriever might omit. The two approaches can be combined; there is no mathematical rule that one universally replaces the other.

## Position interpolation is a geometric intervention

Suppose a model was trained on positions below $L_0$ and must process up to $L_1>L_0$. A simple interpolation maps $p$ to $pL_0/L_1$ before positional encoding. This keeps the mapped range near training positions while compressing relative distances. Nearby tokens become closer in positional phase, which can change local discrimination.

For a rotary frequency $\omega$, a relative distance $\Delta$ gives phase $\omega\Delta$. Scaling positions by $a$ changes it to $a\omega\Delta$. Different frequencies encode different scales, so changing all frequencies uniformly is not equivalent to a selectively adjusted schedule. Methods described as NTK-aware or dynamic scaling require their actual formula and assumptions to reproduce; a label alone is insufficient.

## Build an evaluation that can fail informatively

Vary evidence location, total length, number of distractors, lexical overlap, and number of required evidence pieces. Keep answer keys independent of the candidate model. Measure answer correctness, evidence citation accuracy, abstention behavior, latency, and memory. A long-context test contaminated by training data may measure recall from weights rather than use of supplied evidence.

For example, place an update saying a service now uses port 8443 near the middle, while several older notes say 443. Ask for the current port with the source date. Exact keyword retrieval alone may find both numbers; temporal resolution and citation correctness distinguish a useful answer from a plausible one.

## Quantify the resource change

Doubling $T$ roughly quadruples dense score entries and doubles the key/value cache, holding architecture and batch fixed. Position interpolation does not change those resource counts. Efficient kernels reduce intermediate storage and traffic, while grouped-query attention reduces cache head count. Each intervention addresses a distinct term.

The experiment compares rotary scores under original and compressed positions, making the geometry change explicit. It also reports score-matrix and cache scaling ratios. No extrapolation-quality claim follows from these calculations; that requires a trained model and held-out tasks.

### Construct an evidence-position test that cannot be solved by memorization

Generate random key-value pairs after the evaluated model was trained, place a queried key's value at controlled positions, and ask for that value. Vary distance and distractors while keeping the answer format fixed. Randomization reduces the chance that the answer can be recalled from weights. Then add two-hop questions linking one random key to another, and contradictory dated updates. These extensions test composition and temporal selection beyond a single literal lookup. Report separate curves for each task rather than treating all as one measure of long-context understanding.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
q, k = np.array([1., 0.5]), np.array([0.2, 1.])
def score(distance, scale=1.0):
    angle = 0.2 * distance * scale
    c, s = np.cos(angle), np.sin(angle)
    rotation = np.array([[c, -s], [s, c]])
    return q @ rotation @ k
for distance in [1, 5, 20, 80]:
    print('distance', distance, 'original', score(distance), 'interpolated', score(distance, 0.25))
old, new = 1024, 4096
print('dense score ratio', (new/old)**2, 'cache ratio', new/old)

```

### Code structure and observed intermediate values


#### Stage 2

```python
q, k = np.array([1., 0.5]), np.array([0.2, 1.])
```

An observed state during this stage was:

- `q`: `[1.  0.5]`
- `k`: `[0.2 1. ]`

#### Stage 3

```python
def score(distance, scale=1.0):
    angle = 0.2 * distance * scale
    c, s = np.cos(angle), np.sin(angle)
    rotation = np.array([[c, -s], [s, c]])
    return q @ rotation @ k
```

#### Stage 4

```python
for distance in [1, 5, 20, 80]:
    print('distance', distance, 'original', score(distance), 'interpolated', score(distance, 0.25))
```

An observed state during this stage was:

- `distance`: `80`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 5

```python
old, new = 1024, 4096
```

An observed state during this stage was:

- `old`: `1024`
- `new`: `4096`

#### Stage 6

```python
print('dense score ratio', (new/old)**2, 'cache ratio', new/old)
```

Run from the course root:

```bash
python code/24_long_context.py
```

### Recorded output from the supplied environment

```text
distance 1 original 0.507244206773314 interpolated 0.6541439299328659
distance 5 original -0.379112272219409 interpolated 0.4555751318683807
distance 20 original 0.22357171117260702 interpolated -0.379112272219409
distance 80 original -0.4112486512278105 interpolated 0.22357171117260702
dense score ratio 16.0 cache ratio 4.0
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A two-frequency positional score slice; changing the frequency schedule changes its geometry.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\sin{\left(\frac{x}{5} \right)} + \cos{\left(\frac{x}{20} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=- \frac{\sin{\left(\frac{x}{20} \right)}}{20} + \frac{\cos{\left(\frac{x}{5} \right)}}{5}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=- \frac{\sin{\left(\frac{x}{5} \right)}}{25} - \frac{\cos{\left(\frac{x}{20} \right)}}{400}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 4.8 | 1.79052954 | 0.102818866 | -0.0351960077 |
| 5 | 1.81038341 | 0.0956902632 | -0.0360811204 |
| 5.2 | 1.82879421 | 0.0883900239 | -0.036912144 |

#### Evaluation 1: substitute $x=4.8$

$$f(4.8)=\sin{\left(\frac{24}{25} \right)} + \cos{\left(\frac{6}{25} \right)}\approx 1.79052954.$$
At this coordinate the slope is $0.102818866$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.0351960077$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx0.000102818866$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.75980038e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $0.000102801267$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=5$

$$f(5)=\sin{\left(1 \right)} + \cos{\left(\frac{1}{4} \right)}\approx 1.81038341.$$
At this coordinate the slope is $0.0956902632$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.0360811204$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx9.56902632e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.80405602e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $9.56722219e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=5.2$

$$f(5.2)=\sin{\left(\frac{26}{25} \right)} + \cos{\left(\frac{13}{50} \right)}\approx 1.82879421.$$
At this coordinate the slope is $0.0883900239$, so the function increases under a sufficiently small positive perturbation. The curvature is $-0.036912144$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx8.83900239e-05$. The quadratic correction is $f^{(2)}(x)h^2/2\approx-1.8456072e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $8.83715671e-05$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | 0.09568311087 | 7.1523e-06 |
| 0.01 | 0.09569019169 | 7.1525e-08 |
| 0.001 | 0.0956902625 | 7.1534e-10 |
| 0.0001 | 0.0956902632 | 7.6832e-12 |
| 1e-05 | 0.0956902632 | 8.7934e-12 |
| 1e-06 | 0.09569026327 | 5.782e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\sin{\left(\frac{x}{20} \right)}}{8000} - \frac{\cos{\left(\frac{x}{5} \right)}}{125}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 1.79052954 | 1.79124535 | 1.79052373 | 5.8117e-06 |
| -0.1 | 1.8006347 | 1.80081438 | 1.80063397 | 7.2087e-07 |
| 0.1 | 1.81977132 | 1.81995243 | 1.81977203 | 7.096e-07 |
| 0.2 | 1.82879421 | 1.82952146 | 1.82879984 | 5.6314e-06 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: LLM](https://aman.ai/primers/LLM/)
- [Aman.ai: attention](https://aman.ai/primers/attention/)

[Previous](23-efficient-attention.md) · [Index](../README.md) · [Next](25-evaluation-interpretability.md)
