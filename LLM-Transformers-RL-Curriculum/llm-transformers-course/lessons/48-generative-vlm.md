# 48. Generative vision-language models and cross-modal fusion

[Previous](47-vision-clip.md) · [Index](../README.md) · [Next](49-recursive-transformers.md)

**Part:** Multimodal and embodied models. **Prerequisite:** read lessons 01–47 in order, or verify the earlier definitions used here.

## Similarity alignment and language generation are different tasks

A contrastive model compares image and text embeddings. A generative vision-language model conditions text generation on visual information. One design maps image-encoder features through a learned projector into the language model's embedding width, then inserts those visual tokens into the context. Another uses cross-attention from language states to visual features. Resamplers can compress many visual patches into a smaller latent set.

For visual features $F\in\mathbb R^{N\times D_v}$ and projector $P\in\mathbb R^{D_v\times D}$, projected features are $Z=FP$. They have the correct width to enter a language model, but width equality does not establish semantic alignment. Training must teach the downstream model how to use them.

## Define the supervised objective

Given image $I$, question $x$, and answer tokens $y$, minimize $-\sum_t\log p_\theta(y_t\mid I,x,y_{<t})$, with a specified target mask and reduction. Early training may freeze large encoders and learn only a connector; later stages may tune more components. These choices affect memory, adaptation capacity, and retained behavior.

For a prefix-fusion causal model, visual features placed before answer tokens are visible to answer queries. Whether visual features attend bidirectionally to one another depends on the exact mask design and encoder. A generic triangular text mask is not a complete description of every multimodal architecture.

## Resolution and sequence budget

High resolution can improve small-text or fine-detail tasks but increases patch count and computation. Crops and tiling preserve detail with more tokens and require spatial metadata to maintain layout. Video adds a time axis, frame sampling, and temporal position. Audio requires a suitable representation and alignment with text or other streams.

OCR accuracy, visual grounding, counting, charts, and spatial relations test different abilities. A model that recognizes a scene may still hallucinate small text. Ask for evidence that can be localized or checked where the application needs it.

## Cross-modal gradient flow

If the image encoder is frozen, gradients may still pass through its output to train the connector or language model, but its parameters are not updated. Detaching features can save graph storage when the encoder is frozen; detaching the connector output would prevent learning the connector. Loss masking applies to answer targets, while visual inputs still influence the loss.

The example uses cross-attention from two language queries to three visual feature tokens, then projects the result to vocabulary logits. It checks rectangular shapes and probability normalization. It is a mathematical fusion demonstration using synthetic features, not an image-question answering model.

Optional application: perturb one visual feature and compare answer logits. Dependence on visual input is necessary for grounded generation but not sufficient: a trained model must depend on the right visual evidence.

### A visual connector has a direct supervised gradient

For visual features $F$, connector $P$, projected tokens $Z=FP$, and scalar answer loss with upstream $G_Z$, the connector gradient is $F^\top G_Z$. If the visual encoder is also trainable, its feature gradient is $G_ZP^\top$. If it is frozen, retain the first gradient and omit its parameter updates; do not detach $Z$ before the language model if the connector needs training. This matrix calculation separates freezing encoder weights from breaking every gradient path out of the visual representation.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import attention, softmax
rng = np.random.default_rng(48)
visual = rng.normal(size=(3, 5))
projector = rng.normal(size=(5, 4))
visual_tokens = visual @ projector
language_query = rng.normal(size=(2, 4))
context, weights = attention(language_query, visual_tokens, visual_tokens)
output_projection = rng.normal(size=(4, 7))
probability = softmax(context @ output_projection)
assert probability.shape == (2, 7)
assert np.allclose(probability.sum(axis=-1), 1)
print('visual attention', weights, 'answer probabilities', probability)

```

### Code structure and observed intermediate values


#### Stage 3

```python
rng = np.random.default_rng(48)
```

#### Stage 4

```python
visual = rng.normal(size=(3, 5))
```

An observed state during this stage was:

- `visual`: `[[-0.30763  1.34959  0.19283  1.40656  0.16221]  [-1.01861  0.86045 -0.63939  0.4137   1.17013]  [ 0.73408  0.34851 -1.0546  -0.0382  -0.74437]]`

#### Stage 5

```python
projector = rng.normal(size=(5, 4))
```

An observed state during this stage was:

- `projector`: `[[ 1.34099  0.56545  0.86096  1.1076 ]  [ 0.42636 -0.4385  -0.08492 -0.08755]  [-0.67438  0.13245 -0.81665  0.12116]  [-0.27253 -0.01076  2.39675 -0.42248]  [ 0.87179 -1.16954  0.48046  0.85495]]`

#### Stage 6

```python
visual_tokens = visual @ projector
```

An observed state during this stage was:

- `visual_tokens`: `[[-0.20906 -0.94505  2.91216 -0.89108]  [ 0.33947 -2.41094  1.12582 -0.45539]  [ 1.20567  0.99356  1.01447  0.03452]]`

#### Stage 7

```python
language_query = rng.normal(size=(2, 4))
```

An observed state during this stage was:

- `language_query`: `[[ 0.2659  -0.06291  0.52281  1.08782]  [ 2.47003 -1.17479  0.38371  1.30838]]`

#### Stage 8

```python
context, weights = attention(language_query, visual_tokens, visual_tokens)
```

An observed state during this stage was:

- `context`: `[[ 0.48503 -0.64701  1.67172 -0.41434]  [ 0.53052 -1.19188  1.32306 -0.36355]]`
- `weights`: `[[0.32906 0.29451 0.37643]  [0.12927 0.56832 0.30242]]`

#### Stage 9

```python
output_projection = rng.normal(size=(4, 7))
```

An observed state during this stage was:

- `output_projection`: `array shape=(4, 7), min=-1.77587, max=1.89416, norm=5.78022`

#### Stage 10

```python
probability = softmax(context @ output_projection)
```

An observed state during this stage was:

- `probability`: `[[0.01426 0.00318 0.6141  0.00195 0.00193 0.35062 0.01395]  [0.0634  0.00445 0.47215 0.01355 0.00713 0.40068 0.03863]]`

#### Stage 11

```python
assert probability.shape == (2, 7)
```

#### Stage 12

```python
assert np.allclose(probability.sum(axis=-1), 1)
```

#### Stage 13

```python
print('visual attention', weights, 'answer probabilities', probability)
```

Run from the course root:

```bash
python code/48_generative_vlm.py
```

### Recorded output from the supplied environment

```text
visual attention [[0.3290616  0.29450814 0.37643026]
 [0.12926618 0.56831846 0.30241537]] answer probabilities [[0.01426249 0.00318082 0.61410451 0.00195421 0.00192768 0.35062438
  0.01394591]
 [0.06340227 0.00445073 0.47215245 0.01355489 0.00713362 0.40067941
  0.03862664]]
```


## A fully worked mathematical sensitivity laboratory

This laboratory isolates one scalar slice so you can connect symbolic differentiation, numerical evaluation, and local approximation. It supplements the main topic; it does not replace the multidimensional model or turn a discrete algorithm into a differentiable one. Where the chapter studies a discrete decision, the function below is explicitly an illustrative smooth component or tradeoff. Treat its stated interpretation as its scope.

An answer-token loss through a scalar visual connector, showing how supervision reaches the connector.

Let the free scalar be $x$, with every other quantity held fixed. The exact laboratory function is

$$f(x)=\log{\left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1 \right)} - \tanh{\left(\frac{x}{2} \right)}.$$

Its first derivative is

$$f^{(1)}(x)=\frac{\left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right) e^{\tanh{\left(\frac{x}{2} \right)}}}{e^{\tanh{\left(\frac{x}{2} \right)}} + 1} + \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2} - \frac{1}{2}.$$

Differentiating once more gives the local curvature

$$f^{(2)}(x)=\frac{\left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right)^{2} e^{\tanh{\left(\frac{x}{2} \right)}}}{e^{\tanh{\left(\frac{x}{2} \right)}} + 1} - \frac{\left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right)^{2} e^{2 \tanh{\left(\frac{x}{2} \right)}}}{\left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)^{2}} + \frac{\left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right) \tanh{\left(\frac{x}{2} \right)}}{2} - \frac{\left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right) e^{\tanh{\left(\frac{x}{2} \right)}} \tanh{\left(\frac{x}{2} \right)}}{2 \left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)}.$$

### Read the derivative as a local statement

The first derivative is the slope with respect to this scalar coordinate. It measures the change in the stated function per small unit change in that coordinate. A positive slope means increasing the coordinate increases the function locally; a negative slope means it decreases it locally. This is not yet an optimization recommendation: for a reward we usually maximize, while for a loss we usually minimize. Read the objective's meaning before choosing the update sign.

The second derivative measures how the slope changes. Positive curvature means the local slope increases as the coordinate increases; negative curvature means it decreases. A nonzero slope is enough to identify a first-order direction of local improvement. A zero slope requires more investigation: positive curvature indicates a strict local minimum under the usual smoothness conditions, negative curvature a strict local maximum, and zero curvature leaves higher-order behavior unresolved. These scalar conclusions do not establish whether a point is a minimum of a multivariable network.

### Three concrete evaluations

The neighboring points hold all other quantities fixed. Values below are computed from the displayed function and derivatives, rounded for readability.

| Coordinate | Function | Slope | Curvature |
|---:|---:|---:|---:|
| 0.2 | 0.644554383 | -0.235192033 | 0.0845536778 |
| 0.4 | 0.599321264 | -0.216626651 | 0.0999234102 |
| 0.6 | 0.558061456 | -0.195694054 | 0.108255414 |

#### Evaluation 1: substitute $x=0.2$

$$f(0.2)=- \tanh{\left(\frac{1}{10} \right)} + \log{\left(1 + e^{\tanh{\left(\frac{1}{10} \right)}} \right)}\approx 0.644554383.$$
At this coordinate the slope is $-0.235192033$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.0845536778$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000235192033$. The quadratic correction is $f^{(2)}(x)h^2/2\approx4.22768389e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000235149741$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 2: substitute $x=0.4$

$$f(0.4)=- \tanh{\left(\frac{1}{5} \right)} + \log{\left(1 + e^{\tanh{\left(\frac{1}{5} \right)}} \right)}\approx 0.599321264.$$
At this coordinate the slope is $-0.216626651$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.0999234102$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000216626651$. The quadratic correction is $f^{(2)}(x)h^2/2\approx4.99617051e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.00021657668$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

#### Evaluation 3: substitute $x=0.6$

$$f(0.6)=- \tanh{\left(\frac{3}{10} \right)} + \log{\left(1 + e^{\tanh{\left(\frac{3}{10} \right)}} \right)}\approx 0.558061456.$$
At this coordinate the slope is $-0.195694054$, so the function decreases under a sufficiently small positive perturbation. The curvature is $0.108255414$. These numbers refer to the scalar laboratory objective, with the constants and any sampled targets held fixed. They should not be interpreted as a measured property of a trained model.
For a displacement $h=0.001$, the first-order predicted change is $f^{(1)}(x)h\approx-0.000195694054$. The quadratic correction is $f^{(2)}(x)h^2/2\approx5.41277072e-08$. Adding them predicts the second-order change. The actual change from direct substitution is $-0.000195639922$. A close match is expected at a smooth interior point with a small displacement, while rounding can affect the last printed digits.

### Independently approximate the derivative

The central difference follows by expanding both sides around the same point. Taylor's formula gives $f(a+h)=f(a)+hf'(a)+h^2f''(a)/2+h^3f^{(3)}(a)/6+O(h^4)$ and the corresponding expression at $a-h$. Subtracting cancels the constant and even-power terms. Dividing by $2h$ gives $[f(a+h)-f(a-h)]/(2h)=f'(a)+h^2f^{(3)}(a)/6+O(h^4)$ when the required derivatives exist. This explains the leading quadratic truncation error. Floating-point cancellation introduces a separate error that can grow as the step becomes extremely small.

The table uses the middle coordinate above. It compares two independently organized calculations: symbolic differentiation and direct numerical evaluation at perturbed inputs. Near clipping boundaries, support changes, or singularities, the smooth Taylor argument may not apply. All tabulated steps here are chosen inside the stated scalar function's local domain.

| Difference step | Numerical derivative | Absolute error from symbolic slope |
|---:|---:|---:|
| 0.1 | -0.2165281267 | 9.8525e-05 |
| 0.01 | -0.2166256663 | 9.8505e-07 |
| 0.001 | -0.2166266415 | 9.8505e-09 |
| 0.0001 | -0.2166266512 | 9.9366e-11 |
| 1e-05 | -0.2166266513 | 2.2216e-12 |
| 1e-06 | -0.2166266512 | 7.9937e-11 |

The third derivative controlling the leading smooth truncation term is

$$f^{(3)}(x)=\frac{\left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right)^{3} e^{\tanh{\left(\frac{x}{2} \right)}}}{e^{\tanh{\left(\frac{x}{2} \right)}} + 1} - \frac{\left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right)^{3} e^{2 \tanh{\left(\frac{x}{2} \right)}}}{\left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)^{2}} + \frac{2 \left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right)^{3} e^{3 \tanh{\left(\frac{x}{2} \right)}}}{\left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)^{3}} - \frac{\left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right)^{2} \left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right) e^{2 \tanh{\left(\frac{x}{2} \right)}}}{\left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)^{2}} + \frac{\left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right) \left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right)}{2} - \frac{3 \left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right) \left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right) e^{\tanh{\left(\frac{x}{2} \right)}} \tanh{\left(\frac{x}{2} \right)}}{2 \left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)} - \frac{\left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right) \left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right) e^{\tanh{\left(\frac{x}{2} \right)}}}{2 \left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)} + \frac{3 \left(\frac{1}{2} - \frac{\tanh^{2}{\left(\frac{x}{2} \right)}}{2}\right) \left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right) e^{2 \tanh{\left(\frac{x}{2} \right)}} \tanh{\left(\frac{x}{2} \right)}}{2 \left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)^{2}} - \frac{\left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right) \tanh^{2}{\left(\frac{x}{2} \right)}}{2} + \frac{\left(1 - \tanh^{2}{\left(\frac{x}{2} \right)}\right) e^{\tanh{\left(\frac{x}{2} \right)}} \tanh^{2}{\left(\frac{x}{2} \right)}}{2 \left(e^{\tanh{\left(\frac{x}{2} \right)}} + 1\right)}.$$

### Build the local quadratic approximation

Around $a$, write $q(h)=f(a)+f'(a)h+f''(a)h^2/2$. The approximation preserves value, slope, and curvature at $h=0$. It is useful for understanding why a small update behaves differently from a large one. It does not preserve the global function, and minimizing this quadratic is inappropriate if its curvature is nonpositive or its proposed step leaves the valid domain.

The next table evaluates both the exact function and the local approximations. The first-order column uses only the slope; the second-order column includes curvature. Comparing errors reveals the practical meaning of retaining another Taylor term. Exact agreement for a quadratic is an algebraic property, up to floating-point rounding; it is not evidence that numerical precision is unlimited.

| Displacement | Exact value | First order | Second order | Second-order absolute error |
|---:|---:|---:|---:|---:|
| -0.2 | 0.644554383 | 0.642646594 | 0.644645062 | 9.0679e-05 |
| -0.1 | 0.621472952 | 0.620983929 | 0.621483546 | 1.0593e-05 |
| 0.1 | 0.578167327 | 0.577658598 | 0.578158216 | 9.1116e-06 |
| 0.2 | 0.558061456 | 0.555995933 | 0.557994402 | 6.7054e-05 |

### Use the laboratory to check your own implementation

To reconstruct this calculation, implement the function directly, differentiate it on paper using the chain and product rules, then compare both with central differences. Keep the same constants, reduction, and target values in all three routes. If the derivatives disagree by a fixed factor, check sums versus means and temperature or scaling factors. If only some signs disagree, check which quantity is optimized and the direction of any preference or probability ratio. If the error depends strongly on step size, inspect numerical precision and nonsmooth boundaries.

A numerical agreement is evidence about the tested formula at the tested point. It does not verify data preprocessing, masking, random sampling, or an entire training loop. Those require their own checks, described in the main lesson and the validation appendix. The value of this exercise is that each source of evidence has a precise scope rather than being merged into a blanket claim that the whole system is correct.


## Sources and scope

The following supplied primers are topic maps and further reading. The worked explanations and examples in this chapter are original course material. Primary papers and official documentation are indexed in [Sources](../SOURCES.md); [coverage](../SOURCE-MAP.md) records the relationship to every supplied primer. Access date: 2026-11-12.

- [Aman.ai: VLM](https://aman.ai/primers/VLM/)

[Previous](47-vision-clip.md) · [Index](../README.md) · [Next](49-recursive-transformers.md)
