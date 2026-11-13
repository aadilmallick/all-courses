# Giving numbers a meaning: tensors, coordinates, and learned maps

## A sentence does not enter the computer as meaning

Imagine teaching a small model to continue the sequence `red cat sleeps`. Before the model can learn anything, the program needs a representation of that input. We could assign the three words integer IDs, perhaps 2, 7, and 4. Those integers are labels. Seven is not more feline than two, and the difference between IDs seven and four does not measure a semantic distance. The IDs tell the program which rows of a table to retrieve.

That first distinction will protect us from a surprising number of later mistakes. An ID identifies an item. A feature vector describes an item using a collection of numbers. An axis of an array says which kind of thing changes as we move along it. We will keep these three meanings separate even when the program stores all of them as numbers.

Suppose the row for `cat` contains four learned features: $(0.2,-0.1,0.6,0.4)$. We do not yet know what those features mean, and we should not name the first coordinate 'animalness' merely because that sounds plausible. Training will adjust the coordinates to help the task. At this point our job is more modest: know where the numbers are, what operations are allowed, and which numbers one operation combines.

## Build one array before naming all the dimensions

Write the three feature rows underneath one another. This gives a three-row, four-column matrix. Each row corresponds to a token position, so reading across one row changes the feature while keeping the token fixed. Reading down a column changes the token while keeping the feature coordinate fixed. The array has shape `(3,4)`. If we process two sentences together, introduce a batch axis and obtain shape `(2,3,4)`.

A batch is an organizational device that lets the same operation process several examples. It does not mean the sentences should exchange information. When we later say an operation preserves the batch axis, we mean that one example's output can be computed without reading another example's values. We will test that property as well as checking dimensions.

Our convention is to write token features as rows. A learned linear map therefore multiplies them on the right. Some books use column vectors and multiply on the left. Neither convention is intrinsically better; mixing them halfway through a calculation is the problem. Whenever you translate a paper, write down one small input and output shape before transposing anything.

## Tensors, Python, and the meaning of a shape

### Why arrays come before architectures

A language model does arithmetic on arrays. A token ID such as 7 is an integer address, not a measure of how meaningful a word is. Looking up row 7 in a learned table produces a vector of measurements. Processing a batch produces an array whose axes describe different kinds of variation. If these meanings are unclear, a program can run successfully while mixing unrelated examples.

Start with a sentence represented by three tokens and four features per token. Its shape is `(3, 4)`. Two such sentences have shape `(2, 3, 4)`. We write this as $(B,T,D)$: batch, token position, feature. A scalar has shape `()`, a vector has one axis, and a matrix has two. Tensor here means a multidimensional numerical array; this programming usage does not require differential geometry.

### Trace a projection without hiding an index

Let $X\in\mathbb R^{B\times T\times D}$ and $W\in\mathbb R^{D\times F}$. Define $Y=XW$. The batch and time axes survive; the feature axis is contracted:

$$Y_{btf}=\sum_{d=0}^{D-1}X_{btd}W_{df}.$$

For a row $(1,2)$ and a column $(3,4)^\top$, the output is $1\cdot3+2\cdot4=11$. Multiplication forms two contributions; summation combines them into one feature. The output shape is $(B,T,F)$, because every batch-position pair obtains $F$ new measurements.

A bias $b\in\mathbb R^F$ is added as $Y_{btf}+b_f$. Broadcasting treats missing leading axes as size one and permits matching axes when sizes agree or one is one. It does not infer your intentions. Adding a `(T,)` vector to a `(B,T,D)` array generally targets the final axis and is wrong for a per-position offset. Write `(1,T,1)` explicitly.

### Reshaping is different from moving an axis

Reshape preserves flattened element order. Transpose changes which index corresponds to which original axis. To introduce heads, reshape `(B,T,H*d)` to `(B,T,H,d)`, then transpose to `(B,H,T,d)`. Directly reshaping to `(B,H,T,d)` assigns elements to different token-head pairs. Equal numbers of elements do not establish semantic equivalence.

Integer arrays normally index token IDs. Floating arrays represent activations and weights. Boolean arrays represent allowed connections. Keep those roles separate. A mask value of `True` means allowed throughout this course; some APIs use the opposite convention.

### Read the experiment

The loop independently computes the matrix contraction, so agreement with `@` checks the index equation. The next assertion checks the inverse transpose. It does not establish that a future model's axes are correct; that requires carrying their meanings through each operation. A useful debugging practice is to write the intended shape above every contraction before running it.

Optional application: project `(2,5,3)` inputs to seven features, then add a per-token offset. A correct result has shape `(2,5,7)`, and changing one input sentence must leave the other sentence unchanged. This independence is a stronger check than a shape assertion alone.

#### Worked shape audit: one projection and its reverse

Take $B=2,T=3,D=4,F=6$. The input has 24 numbers, the weight has 24 parameters, and the output has 36 numbers. Output entry $Y_{1,2,5}$ is the sum of four products $X_{1,2,d}W_{d,5}$. It uses one input token and one output-feature column; it does not mix batches or token positions. If a scalar loss supplies upstream $G$ of shape $(2,3,6)$, weight gradient entry $(d,f)$ sums $X_{btd}G_{btf}$ over all six batch-position pairs. Thus the shared weight aggregates evidence across positions while the forward projection remains positionwise. This distinction is the first example of parameter sharing versus information mixing.


## Read the first program patiently

In Python, `import numpy as np` gives the numerical library the short name `np`. A tuple such as `(2,3,4)` specifies sizes, while square brackets index into an existing array. Indexing begins at zero, so the first batch has index zero and the fourth feature has index three. The nested loops in the program are intentionally slower and more explicit than the matrix expression. They establish an independent reference for what the compact operation means.

A random generator with a fixed seed gives repeatable demonstration values. Random numbers here are inputs for a calculation, not the result of training. Repeating the program with another seed should preserve the equalities being checked, even though the numerical outputs change. The meaningful claim is the relationship between the two computations.


### Executable calculation

Run `python examples/01_tensors_shapes.py` from the package root. Complete source is also included as [01_tensors_shapes.py](../examples/01_tensors_shapes.py).

```python
import numpy as np
rng = np.random.default_rng(0)
inputs = rng.normal(size=(2, 3, 4))
weight = rng.normal(size=(4, 6))
output = inputs @ weight
manual = np.zeros((2, 3, 6))
for batch in range(2):
    for token in range(3):
        for feature in range(6):
            for channel in range(4):
                manual[batch, token, feature] += inputs[batch, token, channel] * weight[channel, feature]
assert np.allclose(output, manual)
heads = output.reshape(2, 3, 2, 3).transpose(0, 2, 1, 3)
restored = heads.transpose(0, 2, 1, 3).reshape(2, 3, 6)
assert np.allclose(restored, output)
print('projected', output.shape, 'heads', heads.shape)
```

Recorded output on the checked Python/NumPy environment:

```text
projected (2, 3, 6) heads (2, 2, 3, 3)
```


For one selected output, stop the loops mentally at fixed batch, token, and output-feature indices. Only the innermost channel index changes. Multiply each input channel by the corresponding entry in the weight column, then add. Advancing the output-feature index chooses another weight column. Advancing the token index chooses another input row. Nothing in that calculation mixes the two sentences.

## Why a linear map is more than a lookup table

A lookup table retrieves one existing row. A linear map forms new measurements by combining coordinates. If an output feature uses weight column $(1,-1,0,0)^\top$, it measures the difference between the first two input features. If another column is $(0,0,1,1)^\top$, it measures their last-two-coordinate sum. A learned matrix selects useful combinations through training instead of requiring us to choose every measurement manually.

Linearity means two precise properties: the map of a sum equals the sum of the mapped vectors, and scaling an input scales its output by the same amount. These properties let us reason about individual directions. They also impose limits. A purely linear classifier cannot make arbitrary curved decision boundaries in the original feature space; nonlinear transformations will become necessary.

## Distinguish storage order from the relationship you intend

An array's shape is a contract about indexing. It is not proof that the program assigned the correct meaning to an index. Suppose two token rows are `(1,2)` and `(10,20)`. Flattening gives `(1,2,10,20)`. Reshaping to two rows of two preserves them; interpreting the same flattened sequence as two heads with different grouping can create the pairs `(1,2)` and `(10,20)` for a different semantic purpose. The numbers alone do not tell the program which interpretation is intended.

A reliable design writes the intended index equation first. For a projection, output at batch b and token t uses only input at that same b and t. For attention, output at a query position deliberately sums over key positions. For an embedding, the token ID selects a row without arithmetic on the ID's magnitude. These are three different uses of indices that can all appear in one short model.

When testing, choose values that expose a wrong interpretation. Distinct rows such as one and ten make an accidental swap visible. All-zero inputs or identical rows can hide it. Unequal dimensions also help: an incorrect transpose often fails immediately when query count, key count, and value width differ. This is why our later numerical examples avoid making every dimension equal merely for convenience.

## Linear algebra for representations and projections

### Features as coordinates

A vector is a list of coordinates relative to a chosen basis. In an embedding, a coordinate is not automatically a human concept. A learned change of basis can redistribute information while preserving the useful relationships. Two models may solve the same task with different internal coordinates.

For $u,v\in\mathbb R^D$, the dot product is $u^\top v=\sum_i u_iv_i$. Its geometric expression is $\|u\|\|v\|\cos\theta$. Thus a large dot product can indicate alignment, large norms, or both. Cosine similarity divides out the norms and is undefined when either vector is zero. Never silently divide by zero or assume that magnitude is irrelevant to a trained retrieval model.

For $u=(1,2)$ and $v=(2,0)$, the dot product is two, norms are $\sqrt5$ and two, and cosine is $1/\sqrt5$. Doubling $v$ doubles the dot product but leaves the cosine unchanged. This difference later explains why normalized embeddings and unnormalized attention scores behave differently.

### Matrix multiplication as composition

Using row vectors, let $x\in\mathbb R^{1\times D}$, $A\in\mathbb R^{D\times R}$, and $B\in\mathbb R^{R\times F}$. Then $(xA)B=x(AB)$. Expand the left side at output coordinate $j$:

$$\sum_{r=1}^R\left(\sum_{i=1}^Dx_iA_{ir}\right)B_{rj}
=\sum_{i=1}^Dx_i\left(\sum_{r=1}^RA_{ir}B_{rj}\right).$$

Interchanging two finite sums justifies associativity. The intermediate width $R$ limits the rank of $AB$ to at most $R$. It is the number of independent intermediate directions, not simply the number of nonzero entries. This will become the mathematical foundation of LoRA.

### Rank, singular values, and approximation

Every real matrix has a singular value decomposition $W=U\Sigma V^\top$. Orthogonal factors rotate or reflect; nonnegative singular values stretch independent directions. Keeping the largest $r$ singular values gives a best rank-at-most-$r$ approximation in Frobenius norm. The squared error is the sum of squares of discarded singular values. This statement concerns approximating a fixed matrix under that norm; it does not prove that rank-$r$ fine-tuning is optimal for a language task.

The experiment deliberately constructs a rank-two update. Numerical rank depends on a tolerance because floating-point values rarely satisfy exact algebraic identities. We then truncate a separate random matrix and compare measured error with the discarded singular-value energy.

### When the analogy breaks

A neural layer with a nonlinear activation is not just one global linear projection. Composition of linear layers collapses into a single matrix, whereas composition separated by nonlinearities generally does not. Likewise, adding a rank-two update to a full-rank base matrix usually leaves the combined matrix full rank. It is the update that is constrained.

Optional worked task: if singular values are $(5,2,1)$, rank-one error is $\sqrt{2^2+1^2}=\sqrt5$. Keeping rank two reduces error to one. These are absolute errors; relative error divides by $\sqrt{30}$.

#### Worked projection and a counterexample

Project $v=(3,4)$ onto unit direction $u=(1,0)$. The scalar coefficient is $u^\top v=3$, so the projected vector is $(3,0)$ and residual is $(0,4)$. Their dot product is zero, and squared lengths satisfy $25=9+16$. This Pythagorean identity depends on orthogonality. A learned matrix need not be an orthogonal projection: multiplying by $\operatorname{diag}(2,1)$ stretches the first coordinate rather than projecting onto a subspace. Calling every neural matrix a 'projection' is common terminology, but it does not grant idempotence $P^2=P$ or orthogonality. Keep the mathematical property distinct from the programming name.


## From a distance calculation to representation design

Consider two vectors $(1,0)$ and $(2,0)$. Their cosine similarity is one because they point in the same direction. Their Euclidean distance is one because their lengths differ. Both descriptions are correct. If magnitude expresses useful confidence or frequency information, removing it can discard a signal. If magnitude is an unwanted artifact, normalization may help. The representation objective and evaluation task decide which comparison is appropriate.

A basis is a set of independent coordinate directions that can express the vectors under discussion. Rotating the basis changes the coordinates without necessarily changing relationships such as angles and distances. A general learned matrix need not preserve either of those relationships. It can stretch some directions, suppress others, and change dimension. That is why calling a neural weight matrix a projection should not make us assume it is an orthogonal geometric projection.

## Inspect rank through a concrete bottleneck

Take a map from four features to two intermediate features and then to six outputs. Every final output is formed through only two intermediate measurements. The combined matrix has rank at most two, even though it contains 24 entries. A large number of entries is not the same as a large number of independent directions. Later, LoRA will use exactly this distinction to learn a restricted weight update cheaply.

The singular-value experiment makes that restriction measurable. Its first assertion checks a rank bound; its second checks the error of a truncated approximation. These are algebraic properties of the constructed matrices. They do not tell us that a low-rank update will solve a particular language task. Keeping the mathematical statement narrower than its application is part of understanding it.


### Executable calculation

Run `python examples/02_linear_algebra.py` from the package root. Complete source is also included as [02_linear_algebra.py](../examples/02_linear_algebra.py).

```python
import numpy as np
rng = np.random.default_rng(1)
a = rng.normal(size=(5, 2))
b = rng.normal(size=(2, 4))
update = a @ b
assert np.linalg.matrix_rank(update) <= 2
weight = rng.normal(size=(5, 4))
u, singular, vt = np.linalg.svd(weight, full_matrices=False)
approximation = (u[:, :2] * singular[:2]) @ vt[:2]
error = np.linalg.norm(weight - approximation)
assert np.allclose(error ** 2, np.sum(singular[2:] ** 2))
print('rank', np.linalg.matrix_rank(update), 'error', round(error, 6))
```

Recorded output on the checked Python/NumPy environment:

```text
rank 2 error 1.006401
```


## Use the companion as a coordinate microscope

Open the companion and choose **Coordinates and projections**. Change one input coordinate while leaving the others fixed. The output changes by that coordinate change multiplied by the corresponding weight row. Changing two coordinates produces the sum of their separate effects; that is linearity made visible. Reset returns the original input and matrix, making comparisons reproducible.

If an output differs from your hand calculation, first check the row/column convention. Next check whether you used matrix multiplication or elementwise multiplication. Finally inspect the reduction index: a projection sums over input features, not over examples. These checks explain most early shape mistakes more directly than repeatedly reshaping arrays until an error disappears.

We now have a language for values and the maps between them. A model learns those maps by changing their parameters. To understand learning, we need to make one further relationship precise: how a small parameter change affects a final error.
