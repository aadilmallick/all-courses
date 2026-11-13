# 03. Vectors, matrices, geometry, and computational shapes

[Previous](02-algebra-notation-proofs.md) · [Course index](../README.md) · [Next](04-spectral-linear-algebra.md)

## Coordinates describe observations

A vector $x=(x_1,\ldots,x_d)^\top$ collects $d$ measurements. Its coordinates have units: temperature and pressure are not interchangeable. Adding vectors requires matching meanings, not just matching array sizes. A matrix $X\in\mathbb R^{n\times d}$ stores one observation per row. We use row batches in code while writing many individual-vector formulas as column vectors; transposes connect these conventions.

For two vectors the dot product is $x^\top w=\sum_jx_jw_j$. With $x=(2,3)$ and $w=(4,-1)$ the result is $8-3=5$. The model combines evidence by multiplying each coordinate by its weight and adding. A bias adds a constant independent of the input.

Matrix multiplication repeats this operation. If $X$ has shape $(n,d)$ and $W$ has shape $(d,k)$, then $(XW)_{ic}=\sum_jX_{ij}W_{jc}$ and the result has shape $(n,k)$. The feature axis disappears because it is summed. This is why matrix multiplication requires the two inner dimensions to match.

## Lengths, angles, and projections

The Euclidean norm is $\|x\|_2=\sqrt{\sum_jx_j^2}$. It gives the usual length. The distance between points is $\|x-z\|_2$. The dot product also equals $\|x\|\|z\|\cos\phi$. Therefore orthogonal vectors have dot product zero. The zero vector has no direction, so cosine similarity with it is undefined.

To project $x$ onto nonzero $u$, choose a multiple $au$ minimizing $\|x-au\|^2$. Expand the square as $x^\top x-2a u^\top x+a^2u^\top u$. Differentiating with respect to $a$ and setting the result to zero gives $a=u^\top x/(u^\top u)$. The residual is orthogonal to $u$, because $u^\top(x-au)=0$ by substitution.

If $u=(1,1)$ and $x=(2,0)$, then $a=1$ and the projection is $(1,1)$. The residual $(1,-1)$ has zero dot product with $u$. This is the geometric pattern behind linear least squares.

## Shapes protect mathematical meaning

```python
import numpy as np
X = np.array([[1.,2.],[3.,4.],[5.,6.]])
w = np.array([2.,-1.])
y = np.array([0.,2.,4.])
prediction = X @ w
assert prediction.shape == y.shape == (3,)
print(prediction)
```

The predictions are `[0. 2. 4.]`. If `y` were shape `(3,1)`, subtracting the `(3,)` prediction would broadcast to `(3,3)`. The program could compute a number while comparing every target against every prediction. Check shapes before reduction; taking a mean can hide an incorrect intermediate shape.

## Numerical shape workshop

The following optional framework sections expand the numerical operations just introduced. Install PyTorch only for this framework comparison; the NumPy examples above remain the base route.

## 1.8 Dot products: a weighted combination of evidence

For two vectors with matching length, the dot product multiplies corresponding entries and adds the products. If features are `[area, temperature]` and weights are `[area_weight, temperature_weight]`, their dot product is one prediction before adding the baseline. Each coefficient expresses how a measurement contributes within this particular model.

For features `[20, 10]` and weights `[2, -1]`, the dot product is `20 × 2 + 10 × (-1) = 30`. Adding baseline five produces thirty-five. The negative temperature coefficient means that, while holding the area input fixed, a larger temperature reduces the predicted consumption. This is a statement about the fitted formula; it is not automatically a causal conclusion about buildings.

```python
import torch

features = torch.tensor([20.0, 10.0])
weights = torch.tensor([2.0, -1.0])
prediction = torch.dot(features, weights) + 5.0
print(prediction.item())
```

`item()` extracts a Python number from a tensor containing exactly one element. That is convenient for reporting. It is unsuitable when you intend to preserve a differentiable computation, because a Python float does not carry the tensor's autograd connection. This is a first example of an operation that is harmless for logging and harmful inside a loss calculation.

The geometric interpretation of a dot product connects alignment and magnitude. For nonzero vectors, their dot product equals the product of their lengths multiplied by the cosine of the angle between them. A larger positive dot product can indicate aligned directions. In learned models, vector scales also matter, so a large dot product should not casually be called pure similarity without discussing normalization.



## 1.9 Matrix multiplication handles a whole batch

Place examples in the rows of a matrix `X` with shape `[B, F]`, where `B` is the number of examples and `F` the number of features. Multiply by a weight vector with shape `[F]`. The result has shape `[B]`, one weighted sum per example. Each row performs exactly the dot product we just calculated.

```python
import torch

features = torch.tensor([[20.0, 10.0],
                         [40.0, 15.0],
                         [60.0, 20.0]])
weights = torch.tensor([2.0, -1.0])
predictions = features @ weights + 5.0
print(predictions)
```

The three predictions are thirty-five, seventy, and one hundred five. The inner feature dimension disappears because it is summed over. This operation is called a contraction. When a formula appears complicated, identify which axes remain and which axes are summed away. That habit scales directly to convolution, attention, and per-example gradients.

For several output features, use a weight matrix. If `W` has shape `[F, O]`, then `X @ W` has shape `[B, O]`. Every output column uses its own weight vector. Later, `nn.Linear(F, O)` stores its weight internally as `[O, F]` and computes the equivalent `X @ weight.T + bias`. The transpose is an implementation convention, not a different model.

Matrix multiplication is not commutative. Even when both orders are shape-compatible, `A @ B` generally differs from `B @ A`. Swapping operands because an error disappears is not debugging. Write the intended scalar sum, assign meanings to indices, and recover the correct tensor expression from that description.



## 1.10 Reductions: removing an axis by answering a question

A reduction combines values along an axis. A sum asks for a total. A mean asks for an average. A maximum asks for the largest value. Reductions matter because training usually begins with many prediction errors and ends with one scalar objective. Before reducing, specify which observations should have equal influence.

```python
import torch

values = torch.tensor([[1.0, 3.0], [5.0, 7.0]])
print(values.mean())
print(values.mean(dim=0))
print(values.mean(dim=1))
print(values.mean(dim=1, keepdim=True))
```

The overall mean is four. Reducing dimension zero averages corresponding columns across examples and produces `[3, 5]`. Reducing dimension one averages features within each example and produces `[2, 6]`. Keeping the reduced dimension produces shape `[2, 1]`, preserving the place of the axis for a later broadcast.

A useful verbal rule is that `dim` names the axis being combined, not the axis being kept. If rows are examples and columns are features, `mean(dim=0)` computes one mean per feature. This is exactly what a standardization transform usually needs. `mean(dim=1)` answers a different question: the average value within each observation.

For a maximum, you may need both the value and its location. `values.max(dim=1)` returns both. `argmax(dim=1)` returns only the index of the largest entry along that axis. In classification, that index can be a predicted class. It is not a probability, and it is not normally part of the differentiable training objective.



## 1.11 Broadcasting, with a silent failure example

Broadcasting permits operations between certain different shapes. Compare axes from the right. Two sizes are compatible if equal or if one is one. Missing leading axes behave as singleton axes. A singleton dimension can be logically repeated to match the other operand. This usually avoids explicitly allocating repeated copies.

Consider a matrix `[B, F]` and a feature mean vector `[F]`. Their trailing dimensions match, so subtraction removes the corresponding feature mean from every row. A per-example mean `[B]` does not generally align with `[B, F]`; it lines up against the feature dimension. Keeping it as `[B, 1]` communicates the correct intention.

```python
import torch

predictions = torch.tensor([[1.0], [2.0], [3.0]])
targets = torch.tensor([1.0, 2.0, 3.0])
wrong_errors = predictions - targets
right_errors = predictions.squeeze(-1) - targets
print(wrong_errors.shape)
print(right_errors.shape)
print(right_errors)
```

The wrong shape is `[3, 3]`. Every prediction is compared with every target. The right shape is `[3]`, and all errors are zero. Both expressions execute. This is why assertions about expected shapes are useful even when no exception is raised. A training loop can optimize an unintended objective for hours without producing a runtime error.

Use `squeeze(-1)` when you deliberately remove a final singleton output axis. An unrestricted `squeeze()` can also remove the batch axis when batch size is one. Programs that work for large batches and fail on the last batch often have this exact mistake. Preserve the batch contract explicitly rather than relying on accidental dimensions.



## 1.12 Indexing, masks, and discrete choices

Indexing selects values. A scalar index selects one position. A slice selects a range. A Boolean mask selects positions for which a condition is true. These operations have different output shapes, so inspect shape and meaning together. For a feature matrix, `features[:, 0]` selects the first feature for all examples and usually removes that feature axis.

```python
import torch

features = torch.tensor([[20.0, 10.0],
                         [40.0, 15.0],
                         [60.0, 20.0]])
areas = features[:, 0]
large = areas >= 40.0
print(areas)
print(large)
print(features[large])
```

The mask contains false, true, true. Applying it selects the final two rows. Masks are important for missing labels, padding tokens, sequence boundaries, and selective metrics. They are discrete decisions. Gradients can flow through the selected floating-point values, but ordinary differentiation does not tell you how to change a Boolean condition continuously.

A mask used in a loss also defines a denominator. If only three of ten positions are valid, averaging all ten after zeroing invalid losses underweights the example relative to a mean over the three valid positions. Define whether the objective should weight examples, tokens, or something else equally. This apparently minor reduction choice becomes important in variable-length sequence training.



## 1.13 Shape changes are not all the same operation

`reshape` changes how a sequence of elements is grouped into axes. `transpose` exchanges two axes. `permute` reorders all axes. These may produce the same output shape while arranging values differently. Shape equality does not prove computational equivalence.

```python
import torch

values = torch.tensor([[1, 2, 3], [4, 5, 6]])
print(values.reshape(3, 2))
print(values.transpose(0, 1))
```

Reshaping produces rows `[1, 2]`, `[3, 4]`, `[5, 6]`. Transposing produces rows `[1, 4]`, `[2, 5]`, `[3, 6]`. The first regrouped elements in their logical traversal order. The second exchanged the row and column interpretations. Converting an image from height-width-channel to channel-height-width requires axis permutation, not an arbitrary reshape.

`unsqueeze` inserts a singleton axis. `squeeze` removes singleton axes. `stack` creates a new axis while joining tensors. `cat` joins along an existing axis. If you have several vectors representing examples, stacking them creates a batch matrix. If you already have several batch matrices with the same feature width, concatenating them along axis zero creates a larger batch.

An inferred dimension of `-1` asks PyTorch to calculate one axis size from the total number of elements. It does not grant permission to change the element count. You may infer only one dimension in a reshape because the total alone cannot determine multiple unknown sizes. Treat inferred dimensions as a convenience after you understand the intended contract.



## 1.14 Views, storage, and copying

A view is another tensor interpretation sharing underlying storage. Changing a view can therefore change the original. Some shape transformations return views; others may require copies. `reshape` can choose either according to layout. `view` requires compatible strides. A contiguous tensor is sufficient for many reshapes, but saying that every noncontiguous tensor categorically cannot be viewed is too strong.

```python
import torch

original = torch.arange(6.0).reshape(2, 3)
shared = original[:, :2]
independent = shared.clone()
shared[0, 0] = 99.0
print(original[0, 0].item())
print(independent[0, 0].item())
```

The original now contains ninety-nine at that position; the clone retains zero. `clone()` makes a copy of values. It does not, by itself, sever a gradient connection. `detach()` severs that connection but ordinarily still shares storage. If you need both independence and no gradient history, use `detach().clone()`.

Strides describe how logical index changes map to storage offsets. You do not need to calculate strides for everyday model construction, but they explain why a transposed tensor can have the expected shape and still reject a particular `view`. Start with `reshape` when regrouping is your intention, and use `contiguous()` only when a particular layout is actually required.

Avoid in-place changes to tensors needed for gradient computation until you understand their lifetime. Operations with a trailing underscore, such as `add_`, usually modify their input. In-place code can save an allocation but can also overwrite a value the backward pass needs. Correctness comes before such micro-optimizations.

