# 52. Action diffusion, flow matching, and learned world models

[Previous](51-physical-ai-control.md) · [Index](../README.md) · [Next](53-capstone-local-system.md)

**Part:** Multimodal and embodied models. **Prerequisite:** read lessons 01–51 in order, or verify the earlier definitions used here.

## Predict a distribution over action sequences

Action chunking predicts several future actions together. It can represent temporally coherent behavior and reduce high-level decision frequency. Receding-horizon execution performs only part of the planned chunk before observing again and replanning. Long open-loop chunks can drift when the world changes.

Diffusion policies represent action sequences through a conditional denoising process. For a clean action vector $a_0$, sample noise $\epsilon\sim\mathcal N(0,I)$ and construct $a_t=\sqrt{\bar\alpha_t}a_0+\sqrt{1-\bar\alpha_t}\epsilon$. Train a network to predict noise or another parameterization from $a_t$, time, and observations.

## Recover the clean estimate carefully

If a noise predictor returns $\widehat\epsilon$, rearrange the corruption equation:

$$\widehat a_0=\frac{a_t-\sqrt{1-\bar\alpha_t}\widehat\epsilon}{\sqrt{\bar\alpha_t}}.$$

This is an algebraic estimate at a nonzero $\bar\alpha_t$, not a complete reverse sampler. A full diffusion sampler needs a noise schedule, conditional denoiser, reverse update equations, and stochastic or deterministic sampling choices. Using the true injected noise demonstrates the identity but is not an available deployment oracle.

## Flow matching offers another generative path

A simple flow-matching construction interpolates $x_t=(1-t)x_0+tx_1$ between source noise $x_0$ and data $x_1$. The path velocity is $x_1-x_0$. Train $v_\theta(x_t,t,c)$ to predict this conditional velocity, then integrate $dx/dt=v_\theta(x,t,c)$ from the source distribution. Different path and coupling choices produce different formulations.

A one-step Euler approximation is $x_{t+h}=x_t+h v_\theta(x_t,t,c)$. Numerical integration error and learned vector-field error both affect results. Flow matching and diffusion share generative goals but have different training and sampling definitions.

## World models and planning

A learned world model predicts future observations, latent states, or rewards under actions. A planner searches action sequences using those predictions. Prediction error can compound, and optimizing against a model can exploit its errors. Short-horizon replanning, uncertainty estimates, and real-environment evaluation can help diagnose those limitations.

The experiment reconstructs clean actions using known injected noise and demonstrates an exact linear interpolation with a constant oracle velocity. It labels both oracle quantities explicitly. It does not train a diffusion policy, a flow model, or a world model; the purpose is to make their core equations traceable before implementing learned approximations.

Optional application: replace the oracle noise by noise plus a fixed error. Derive that reconstruction error is scaled by $\sqrt{(1-\bar\alpha_t)/\bar\alpha_t}$. This shows why the corruption level matters to error amplification.

### Noise-prediction error amplification is explicit

Let predicted noise be $\widehat\epsilon=\epsilon+e$. Substitute into the clean-action estimate: $\widehat a_0=a_0-\sqrt{(1-\bar\alpha_t)/\bar\alpha_t}\,e$. Therefore error magnitude is multiplied by $\sqrt{(1-\bar\alpha_t)/\bar\alpha_t}$. At $\bar\alpha_t=0.5$, the factor is one; at 0.01, it is approximately 9.95. This does not by itself determine the best training weighting or sampler, because the denoiser's error distribution changes with time. It does explain why reconstruction from heavily corrupted samples is sensitive to noise-prediction error.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(52)
action = np.array([-.5, .2, .8])
noise = rng.normal(size=3)
alpha_bar = .4
corrupted = np.sqrt(alpha_bar)*action+np.sqrt(1-alpha_bar)*noise
recovered = (corrupted-np.sqrt(1-alpha_bar)*noise)/np.sqrt(alpha_bar)
assert np.allclose(recovered, action)
source, destination = rng.normal(size=3), action
state = source.copy()
velocity = destination-source
for _ in range(10):
    state += .1*velocity
assert np.allclose(state, destination)
print('oracle reconstruction', recovered, 'oracle flow endpoint', state)

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(52)
```

#### Stage 3

```python
action = np.array([-.5, .2, .8])
```

An observed state during this stage was:

- `action`: `[-0.5  0.2  0.8]`

#### Stage 4

```python
noise = rng.normal(size=3)
```

An observed state during this stage was:

- `noise`: `[-0.82595  0.24251 -0.06385]`

#### Stage 5

```python
alpha_bar = .4
```

An observed state during this stage was:

- `alpha_bar`: `0.4`

#### Stage 6

```python
corrupted = np.sqrt(alpha_bar)*action+np.sqrt(1-alpha_bar)*noise
```

An observed state during this stage was:

- `corrupted`: `[-0.95601  0.31434  0.45651]`

#### Stage 7

```python
recovered = (corrupted-np.sqrt(1-alpha_bar)*noise)/np.sqrt(alpha_bar)
```

An observed state during this stage was:

- `recovered`: `[-0.5  0.2  0.8]`

#### Stage 8

```python
assert np.allclose(recovered, action)
```

#### Stage 9

```python
source, destination = rng.normal(size=3), action
```

An observed state during this stage was:

- `source`: `[-0.09436  0.32345  0.66595]`
- `destination`: `[-0.5  0.2  0.8]`

#### Stage 10

```python
state = source.copy()
```

An observed state during this stage was:

- `state`: `[-0.09436  0.32345  0.66595]`

#### Stage 11

```python
velocity = destination-source
```

An observed state during this stage was:

- `velocity`: `[-0.40564 -0.12345  0.13405]`

#### Stage 12

```python
for _ in range(10):
    state += .1*velocity
```

An observed state during this stage was:

- `state`: `[-0.5  0.2  0.8]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 13

```python
assert np.allclose(state, destination)
```

#### Stage 14

```python
print('oracle reconstruction', recovered, 'oracle flow endpoint', state)
```

Run from the course root:

```bash
python code/52_generative_actions_world_models.py
```

### Recorded output from the supplied environment

```text
oracle reconstruction [-0.5  0.2  0.8] oracle flow endpoint [-0.5  0.2  0.8]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

A single noise-prediction coordinate squared loss with a fixed sampled target.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\left(x - \frac{4}{5}\right)^{2}.$$

Its first derivative is

$$f^{(1)}(x)=2 x - \frac{8}{5}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=2.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| -0.1 | 0.81 | -1.8 | 2 |
| 0.1 | 0.49 | -1.4 | 2 |
| 0.3 | 0.25 | -1 | 2 |

#### Evaluation 1: substitute $x=-0.1$

$$f(-0.1)=\frac{81}{100}\approx 0.81.$$
At this coordinate the slope is $-1.8$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0018$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.001799$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.1$

$$f(0.1)=\frac{49}{100}\approx 0.49.$$
At this coordinate the slope is $-1.4$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.0014$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.001399$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.3$

$$f(0.3)=\frac{1}{4}\approx 0.25.$$
At this coordinate the slope is $-1$, so the function decreases under a sufficiently small positive perturbation. The curvature is $2$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.001$. The quadratic correction is $f^{(2)}(x)h^2/2\approx1e-06$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000999$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -1.4 | 0 |
| 0.01 | -1.4 | 1.1102e-15 |
| 0.001 | -1.4 | 1.5543e-14 |
| 0.0001 | -1.4 | 2.6534e-13 |
| 1e-05 | -1.4 | 1.3998e-12 |
| 1e-06 | -1.4 | 4.0258e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=0.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.81 | 0.77 | 0.81 | 1.1102e-16 |
| -0.1 | 0.64 | 0.63 | 0.64 | 0 |
| 0.1 | 0.36 | 0.35 | 0.36 | 0 |
| 0.2 | 0.25 | 0.21 | 0.25 | 1.1102e-16 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: physical-ai](https://aman.ai/primers/physical-ai/)
- [Aman.ai: VLM](https://aman.ai/primers/VLM/)

[Previous](51-physical-ai-control.md) · [Index](../README.md) · [Next](53-capstone-local-system.md)
