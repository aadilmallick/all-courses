# 3. Matrices, information, and least squares

This chapter contains outline lessons 9–12. Its prerequisites are combinations, independence, norms, and projections. Our central problem is fitting one linear rule to several observations. A matrix will first mean a function that combines columns, then a compact representation of all predictions at once.

<a id="lesson-09"></a>
## Session 9 — Matrices as functions and matrix multiplication

### A matrix describes what happens to reference directions

Let

$$
A=\begin{pmatrix}2&1\\0&3\end{pmatrix},\qquad
x=\begin{pmatrix}4\\2\end{pmatrix}.
$$

The transformation $x\mapsto Ax$ takes four copies of the first column and two of the second. Therefore $Ax=(10,6)^\top$. Equivalently, its first output is $2(4)+1(2)$ and its second is $0(4)+3(2)$. The column-combination view explains geometry; the row-dot-product view explains each output.

For $A\in\mathbb R^{m\times d}$ and $x\in\mathbb R^d$,

$$
(Ax)_i=\sum_{j=1}^d A_{ij}x_j.
$$

The input dimension is the number of columns, and the output dimension the number of rows. Each column is the image of a standard basis vector, because multiplying by $e_j$ selects that column. Once those images are known, linearity determines the map on every input.

A linear transformation preserves sums and scalar multiplication. Distributivity in the entry formula proves $A(au+bv)=aAu+bAv$. Conversely, a linear map on $\mathbb R^d$ is represented by the matrix whose columns are its images of the standard basis. This is why matrices represent all finite-dimensional linear maps after choosing bases.

The identity matrix $I$ leaves a vector unchanged. A diagonal matrix scales each coordinate independently. A rotation in the plane is represented by

$$
R_\theta=\begin{pmatrix}\cos\theta&-\sin\theta\\
\sin\theta&\cos\theta\end{pmatrix}.
$$

Its columns are perpendicular unit vectors, so it preserves lengths and angles. At a quarter turn, $(1,0)$ becomes $(0,1)$ and $(0,1)$ becomes $(-1,0)$. A shear, such as $\begin{pmatrix}1&1\\0&1\end{pmatrix}$, preserves neither individual lengths nor angles even though it remains linear.

Matrix multiplication represents composition. If $B$ takes inputs to intermediate vectors and $A$ acts on those intermediates, then $AB$ represents “first $B$, then $A$.” The entry formula is

$$
(AB)_{ij}=\sum_k A_{ik}B_{kj}.
$$

Its inner dimensions must agree. If $A$ is $m\times r$ and $B$ is $r\times d$, the product is $m\times d$. Associativity follows because finite double sums can be regrouped. Commutativity generally fails because changing order changes the transformation.

For example, scale the horizontal coordinate by two using $S=\operatorname{diag}(2,1)$ and rotate by a quarter turn using $R$. Then $RS(1,0)=(0,2)$, while $SR(1,0)=(0,1)$. This concrete mismatch proves $RS\ne SR$. A matrix formula should always be read in operation order before being simplified.

The transpose exchanges rows and columns: $(A^\top)_{ji}=A_{ij}$. It satisfies $(AB)^\top=B^\top A^\top$, which you can check from the entry formula. For vectors, $u^\top v$ is a scalar while $uv^\top$ is a matrix, called an outer product. With $u=(1,2)$ and $v=(3,4)$, the outer product is $\begin{pmatrix}3&4\\6&8\end{pmatrix}$. The same symbols in a different order describe different objects.

<a id="lesson-10"></a>
## Session 10 — Systems of equations and elimination

### Separate a mathematical system from a solving method

The equations

$$
2p+q=7,\qquad p-q=-1
$$

become $A\theta=y$ with $A=\begin{pmatrix}2&1\\1&-1\end{pmatrix}$, $\theta=(p,q)^\top$, and $y=(7,-1)^\top$. Adding the equations gives $3p=6$, hence $p=2$; substituting gives $q=3$. Solving finds a parameter vector whose column combination equals the target.

Gaussian elimination uses elementary row operations: exchanging rows, multiplying a row by a nonzero scalar, and adding a multiple of one row to another. Each operation preserves the solution set because it can be reversed. Multiplying a row by zero would destroy information and is excluded.

For the example, subtract half the first row from the second. The augmented system becomes

$$
\left(\begin{array}{cc|c}2&1&7\\0&-3/2&-9/2\end{array}\right).
$$

The second row gives $q=3$, followed by $p=2$. The leading nonzero coefficient in a row is a pivot. A column without a pivot can correspond to a free variable. Back-substitution recovers remaining unknowns once triangular structure is exposed.

Compare three systems. The equations $p+q=2$ and $2p+2q=4$ describe the same line and have infinitely many solutions. Replacing the last target by five makes them inconsistent: elimination gives $0=1$. The equations $p+q=2$ and $p-q=0$ have one solution. Counting equations alone does not establish any of these outcomes; their independent information matters.

A rectangular system can also have one solution. Three consistent equations in two unknowns may determine one parameter vector if the first two already identify it. Conversely, a square system can be singular. The geometry is whether the target lies in the column span and whether columns are independent.

In floating point arithmetic, dividing by a tiny pivot can amplify rounding errors. Partial pivoting chooses a sufficiently large available pivot in the current column before elimination. Exact algebra explains row equivalence, but a numerical algorithm must additionally manage error. This is one reason to use established solvers rather than hand-coded inverses in real data analysis.

<a id="lesson-11"></a>
## Session 11 — Rank, null spaces, invertibility, and identifiability

### What a transformation forgets

The column space $\operatorname{col}(A)$ is the span of the columns, exactly the set of possible outputs $Ax$. The null space is

$$
\operatorname{null}(A)=\{v\in\mathbb R^d:Av=0\}.
$$

A null vector describes an input change invisible at the output. If $A\theta_0=y$ and $Av=0$, then $A(\theta_0+v)=y$. Conversely, subtract any two solutions and their difference lies in the null space. Thus the entire solution set, when nonempty, is $\theta_0+\operatorname{null}(A)$.

The rank is the dimension of the column space. The rank–nullity theorem states

$$
\operatorname{rank}(A)+\dim\operatorname{null}(A)=d.
$$

Here is a proof strategy made explicit. Choose a basis of the null space and extend it to a basis of the input space. The images of the added basis vectors span the column space, because every input decomposes in that full basis and null-space components map to zero. Those images are independent: a zero combination of them would place the same combination of added basis vectors inside the null space, contradicting independence of the extended basis. Their number is therefore the rank. Counting the original null basis and the added vectors gives $d$.

This theorem measures retained and lost directions. For $A=\begin{pmatrix}1&2\\2&4\end{pmatrix}$, rank is one and $(-2,1)$ spans the null space. The prediction $A\theta$ only depends on $\theta_1+2\theta_2$. Separate values of the two parameters cannot be identified from these outputs.

A square matrix is invertible if a matrix $A^{-1}$ exists with $A^{-1}A=AA^{-1}=I$. In finite dimension, this is equivalent to independent columns, trivial null space, full rank, and unique solvability for every target. These equivalences follow from rank–nullity and the definition of a bijection. An inverse is a mathematical object; explicitly computing it is rarely the best way to solve one linear system.

The determinant of a square matrix records signed volume scaling. For a $2\times2$ matrix $\begin{pmatrix}a&b\\c&d\end{pmatrix}$ it is $ad-bc$. A zero determinant means volume collapses and the matrix is singular. It is useful for geometric reasoning, but a determinant's magnitude alone is a poor practical conditioning diagnostic: rescaling a well-behaved matrix can make it tiny. Chapter 4 supplies singular values for that purpose.

In ML, identifiability asks whether different parameter choices imply different observable distributions or predictions. Matrix rank gives the linear deterministic version. Even when parameters are identifiable in exact mathematics, nearly dependent columns can make them extremely uncertain from noisy data. Exact uniqueness and practical reliability are distinct properties.

<a id="lesson-12"></a>
## Session 12 — Norms, orthogonality, and least squares geometry

### When exact equations cannot all hold

For delivery times, use

$$
X=\begin{pmatrix}1&1\\1&2\\1&4\end{pmatrix},\quad
\beta=\begin{pmatrix}b\\w\end{pmatrix},\quad
y=\begin{pmatrix}8\\11\\18\end{pmatrix}.
$$

The first column supplies an intercept. The predictions $X\beta$ must lie in a two-dimensional subspace of $\mathbb R^3$. The target need not lie there. Least squares chooses $\beta$ to minimize $\|X\beta-y\|_2^2$. Dividing by $n$ changes the loss scale but not the minimizers.

A norm measures vector magnitude. The $\ell_1$ norm is $\sum_j|v_j|$, the Euclidean norm is $\sqrt{\sum_jv_j^2}$, and the $\ell_\infty$ norm is $\max_j|v_j|$. Each is positive except at zero, absolutely homogeneous, and satisfies a triangle inequality. The induced distance between $u,v$ is $\|u-v\|$.

For the Euclidean norm, the triangle inequality follows by expanding $\|u+v\|^2$ and using Cauchy–Schwarz to bound the cross term by $2\|u\|\|v\|$. The result is at most $(\|u\|+\|v\|)^2$; square roots preserve the inequality. The choice of norm matters: least absolute deviations and least squares solve different approximation problems because their error geometry differs.

### Derive the normal equations without calculus

Let $\widehat\beta$ be a candidate fit and $e=y-X\widehat\beta$ its target-minus-prediction residual. For a parameter perturbation $h$,

$$
\|y-X(\widehat\beta+h)\|^2
=\|e-Xh\|^2
=\|e\|^2-2h^\top X^\top e+\|Xh\|^2.
$$

If $X^\top e=0$, the cross term vanishes, so no perturbation reduces the error. Conversely, if $g=X^\top e\ne0$, choose $h=tg$ with a sufficiently small positive $t$. The change is $-2t\|g\|^2+t^2\|Xg\|^2$, which is negative for small enough $t$. Therefore a least squares solution is characterized by

$$
X^\top(y-X\widehat\beta)=0,
\qquad X^\top X\widehat\beta=X^\top y.
$$

These are the normal equations. “Normal” refers to perpendicularity: the residual is orthogonal to every column, hence to the whole column space. It does not refer to a Gaussian distribution. Gaussian noise will provide a separate statistical interpretation later.

For the delivery example, compute every entry rather than relying on a memorized shape:

$$
X^\top X=\begin{pmatrix}3&7\\7&21\end{pmatrix},\qquad
X^\top y=\begin{pmatrix}37\\102\end{pmatrix}.
$$

The first right-hand entry is the sum of the three times. The second is their distance-weighted sum, $1(8)+2(11)+4(18)=102$. The equations are $3b+7w=37$ and $7b+21w=102$. Subtracting $7/3$ times the first equation from the second gives $(14/3)w=47/3$. Therefore


$$
X^\top y=\begin{pmatrix}37\\102\end{pmatrix},\quad
w=\frac{47}{14},\quad b=\frac92.
$$

The predictions are $55/7,157/14,251/14$. The target-minus-prediction residual is $(1/7,-3/14,1/14)^\top$. Its sum is zero, and its distance-weighted sum is $1/7-6/14+4/14=0$. The squared error is $1/14$; the mean squared error is $1/42$. Checking residual orthogonality supplies an independent diagnostic of the arithmetic. An incorrect weighted sum or transposed feature order will usually violate it.

### Existence, uniqueness, and stable computation

In finite-dimensional Euclidean space, every vector has a unique orthogonal projection onto a subspace. One can construct it from an orthonormal basis using Chapter 2. Hence least squares fitted predictions always exist and are unique. Coefficients are unique only if $X$ has independent columns. With dependent columns, all coefficient minimizers differ by null vectors while producing the same projection.

If columns are independent, $v^\top X^\top Xv=\|Xv\|^2>0$ for nonzero $v$, so $X^\top X$ is positive definite and invertible. The formal solution is $(X^\top X)^{-1}X^\top y$. This formula is valuable for derivation. For numerical computation, forming $X^\top X$ can square a condition number, so QR or SVD-based least squares is preferable.

With a reduced QR factorization $X=QR$, the columns of $Q$ are orthonormal and $R$ is square upper triangular when $X$ has full column rank. The objective decomposes as

$$
\|y-X\beta\|^2
=\|Q^\top y-R\beta\|^2
+\|(I-QQ^\top)y\|^2.
$$

The second term cannot be changed by $\beta$. Solving $R\beta=Q^\top y$ minimizes the first. This derives an algorithm directly from projection geometry.

### Fitted values and residuals as complementary projections

With independent columns, define the fitted-value matrix by applying the least squares formula to an arbitrary target. It sends the target to its projection on the column space. Applying it twice gives the same result as once, because a vector already in that space does not change under projection. A matrix with this property is called idempotent.

The fitted-value matrix is also symmetric under ordinary Euclidean least squares. Its complement, identity minus that projection, sends targets to residuals. These two outputs are perpendicular. Therefore the squared length of the target decomposes into squared fitted length plus squared residual length. This decomposition is an origin-based statement. When an intercept is present, centering the target gives the familiar decomposition around its mean used in regression summaries.

The diagonal entries of the fitted-value matrix are called leverages. They describe how much each observation's target can influence its own fitted value, holding the design fixed. A high-leverage observation has an unusual position in feature space. Leverage alone does not imply a bad observation: a legitimate extreme input can be informative. It does mean that checking only ordinary residual magnitude may miss an observation that strongly affects the fitted rule.

This distinction also separates outliers in targets from unusual inputs. A delivery with an ordinary distance but an extraordinary time may have a large residual. A delivery at an extreme distance can have high leverage even with a small residual. A careful analysis inspects both where an observation lies and how well it follows the fitted pattern.

### Weighted least squares from the same geometric argument

Suppose each observation has a known positive precision weight. Minimize the sum of those weights times squared residuals. A weight twice as large assigns twice as much cost to the same squared miss. This does not mean duplicating a feature column; it changes the cost of disagreement in observation space.

Let the diagonal matrix of weights be W. The objective is the residual transpose times W times the residual. Its first-order condition is the weighted analogue of the normal equations, with the ordinary transpose product replaced by a weighted one. Equivalently, multiply every row of the design and corresponding target by the square root of its weight, then solve an ordinary least squares problem on the transformed data.

The square root is essential. Multiplying a residual by the weight itself before squaring would assign squared weights, a different objective. This is a frequent implementation mistake when a statistical precision is confused with an amplitude scale.

If observation noise variances are known and errors are independent with mean zero, inverse variances are natural precision weights. A noisy observation contributes less exact information about the mean than a precise one. These weights need scientific or measurement justification; setting them to make inconvenient observations disappear changes the question being answered.

The residual is now orthogonal to the feature columns under the weighted inner product. It need not be orthogonal under the unweighted dot product. Therefore a diagnostic must match the objective actually solved. Reusing an unweighted orthogonality assertion for a weighted solver would incorrectly report a valid fit as broken.

### Distinguishing an algebra error from a modeling limitation

Suppose a solver returns a very small residual but unreasonable coefficients. First inspect column ordering and units: a slope for meters differs by a factor of one thousand from a slope for kilometers. Next inspect rank and singular values: nearly redundant features can make coefficients unstable while predictions remain accurate on observed inputs. Finally inspect the input range. Extrapolating beyond that range can amplify uncertainty in directions poorly constrained by training observations.

A small residual establishes agreement with the observed targets under the chosen norm. It does not establish that the chosen linear mean relationship is correct, that noise is independent, or that future inputs resemble the training design. Those questions require the later probabilistic and statistical framework.

Conversely, a large residual need not indicate a failed optimizer. The target may genuinely lie far from the column space because the model is too restrictive or the observations contain substantial noise. Normal-equation residual orthogonality can certify that the best available projection has been found while leaving a large unexplained component. This is a useful separation between solving the stated problem and choosing an adequate model.

A practical habit is to reconstruct the fitted target from the returned coefficients, calculate the objective independently, and check the relevant stationarity or orthogonality condition. Each check answers a different question: reconstruction catches a representation mismatch, the objective measures fit, and stationarity checks optimality within the stated family. Together they are more informative than trusting a solver's success label alone.

### A complete executable fit

```python
import numpy as np

X = np.array([[1.0, 1.0], [1.0, 2.0], [1.0, 4.0]])
y = np.array([8.0, 11.0, 18.0])
beta, _, rank, singular_values = np.linalg.lstsq(X, y, rcond=None)
prediction = X @ beta
residual = y - prediction
print(beta)
print(np.mean(residual ** 2))
print(X.T @ residual)
```

The coefficients are approximately `[4.5, 3.35714286]`; their order is intercept, slope because that is the order of columns. Mean squared error is approximately `0.0238095238`. The last vector should be close to zero, within floating point rounding. `@` performs matrix multiplication; `*` would multiply array entries with broadcasting and has a different meaning. `X.T` is the transpose. The returned rank reports two independent columns for this example.

The official NumPy least squares reference documents the return values and rank cutoff; our pinned runtime and version notes appear in the references and verification files. Keep dimensions visible: `X` has shape `(3, 2)`, `beta` shape `(2,)`, and predictions shape `(3,)`. Mixing `(3,)` with `(3,1)` arrays can accidentally create a `(3,3)` residual through broadcasting. A valid Python operation can still encode the wrong mathematical object.

The companion's least squares experiment displays a fitted line and residuals while you change a target. A more advanced optional variation duplicates the distance column. The fitted predictions remain identifiable, but the returned weights split across redundant columns. That is a computational demonstration of the distinction between a unique projection and unique coordinates.

Matrices now describe several ideas at once: transformations, data tables, linear systems, and spaces of predictions. The next chapter studies their internal structure. Eigenvectors reveal directions preserved up to scale; singular values reveal which input directions are retained, amplified, or nearly lost.

[Previous chapter](02-vectors-and-geometry.md) · [Curriculum](../CURRICULUM.md) · [Next chapter](04-matrix-structure-and-pca.md)
