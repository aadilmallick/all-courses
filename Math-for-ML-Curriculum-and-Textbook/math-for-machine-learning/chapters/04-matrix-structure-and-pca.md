# 4. Matrix structure: eigenvectors, singular values, and PCA

This chapter contains outline lessons 13–16. You need matrix multiplication, orthogonality, rank, and least squares. We want to answer two related questions: which directions does a matrix preserve, and which directions does it nearly erase? These questions explain dimensionality reduction and the sensitivity of fitted coefficients.

<a id="lesson-13"></a>
## Session 13 — Eigenvalues and eigenvectors

### Directions that a transformation does not turn

Consider $A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$. Applying it to $(1,1)^\top$ gives $(3,3)^\top$, while applying it to $(1,-1)^\top$ gives $(1,-1)^\top$. Those directions do not turn. Their scale factors are three and one. A nonzero vector $v$ is an eigenvector of $A$ with eigenvalue $\lambda$ if $Av=\lambda v$.

The nonzero restriction matters. The zero vector satisfies the equation for every $\lambda$ and therefore identifies no special scale. Eigenvalues can be zero: then their nonzero eigenvectors lie in the null space. Negative real eigenvalues reverse direction as well as scale. Eigenvectors are not unique vectors, because every nonzero scalar multiple gives the same direction and eigenvalue.

The equation rearranges to $(A-\lambda I)v=0$. A nonzero solution exists exactly when $A-\lambda I$ is singular. In two dimensions we can solve $\det(A-\lambda I)=0$:

$$
(2-\lambda)^2-1=0,
\qquad \lambda^2-4\lambda+3=(\lambda-3)(\lambda-1)=0.
$$

For $\lambda=3$, the equations require $v_1=v_2$. For $\lambda=1$, they require $v_1=-v_2$. Computing a scale factor does not finish the problem; solving for its directions supplies the geometry.

If $A$ has a basis of eigenvectors, place them in columns of $V$ and eigenvalues in a diagonal matrix $\Lambda$. Then $AV=V\Lambda$, so

$$
A=V\Lambda V^{-1},\qquad A^k=V\Lambda^kV^{-1}.
$$

The interpretation is change into eigenvector coordinates, scale each coordinate, and change back. Powers are easy because a diagonal matrix raises its entries independently. If all eigenvalues have magnitude below one and the matrix is diagonalizable, repeated application tends to zero. A component along a magnitude-greater-than-one eigenvalue grows instead.

Not every real matrix has a real eigenbasis. A quarter-turn rotation has no nonzero real direction that remains on its original line; its eigenvalues are complex. The shear $J=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ has only one independent eigenvector despite a repeated eigenvalue one. It is not diagonalizable. Indeed $J^k=\begin{pmatrix}1&k\\0&1\end{pmatrix}$, showing that eigenvalues alone can miss transient or polynomial growth in a general matrix.

Trace is the sum of diagonal entries. For a diagonalizable matrix it equals the sum of eigenvalues, counting multiplicity; determinant equals their product. These are useful consistency checks, not substitutes for finding directions or examining conditioning. A matrix can have moderate eigenvalues yet badly aligned eigenvectors, making its behavior sensitive.

<a id="lesson-14"></a>
## Session 14 — Symmetry, the spectral theorem, and quadratic forms

### Why symmetry gives a cleaner geometry

A real matrix is symmetric if $A^\top=A$. The spectral theorem says a real symmetric matrix has an orthonormal eigenbasis and real eigenvalues:

$$
A=Q\Lambda Q^\top,\qquad Q^\top Q=I.
$$

Unlike a general change of basis, the orthogonal change $Q$ preserves lengths. This lets us reason about the matrix using independent perpendicular directions. The theorem applies to Hessians under continuous second derivatives and to covariance matrices, which is why it appears throughout ML.

Here is a proof sketch showing the main mechanism. A real symmetric quadratic form $v^\top Av$ attains a maximum on the unit sphere because the sphere is compact and the form is continuous. At a maximizer $q$, consider an infinitesimal movement along any perpendicular unit direction $u$: $v(t)=q\cos t+u\sin t$. The derivative of $v(t)^\top Av(t)$ at zero is $2u^\top Aq$, which must vanish. Thus $Aq$ is parallel to $q$, giving a real eigenpair. Symmetry ensures the subspace perpendicular to $q$ is invariant: if $u\perp q$, then $q^\top Au=(Aq)^\top u=0$. Restrict to that smaller subspace and repeat by induction on dimension. This sketch uses compactness and a one-variable derivative; Chapters 5 and 8 explain those analysis tools in detail. You may use the stated theorem here without needing its proof to execute any calculation.

Orthogonality of different eigenspaces has a short algebraic proof. If $Au=\lambda u$ and $Av=\mu v$, symmetry gives

$$
\lambda u^\top v=(Au)^\top v=u^\top Av=\mu u^\top v.
$$

When $\lambda\ne\mu$, subtracting yields $u^\top v=0$. When eigenvalues repeat, arbitrary eigenvectors inside the same eigenspace need not be perpendicular, but one can choose an orthonormal basis there.

A quadratic form is the scalar $x^\top Ax$. In eigenvector coordinates $z=Q^\top x$,

$$
x^\top Ax=z^\top\Lambda z=\sum_j\lambda_j z_j^2.
$$

The matrix is positive semidefinite, abbreviated PSD, if that value is nonnegative for every $x$. For symmetric matrices, this is equivalent to all eigenvalues being nonnegative. Necessity follows by choosing an eigenvector; sufficiency follows from the displayed sum. Positive definite means strictly positive for all nonzero $x$, equivalent to all eigenvalues positive.

For $A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$, normalized eigenvectors are $(1,1)/\sqrt2$ and $(1,-1)/\sqrt2$. Its quadratic form is $3z_1^2+z_2^2$. Equal-value curves are ellipses, narrower in the direction with larger coefficient. The inverse curvature direction is easier to move along. If one eigenvalue were negative, the form would curve upward in one direction and downward in another, producing a saddle.

The matrix $X^\top X$ is always PSD because $v^\top X^\top Xv=\|Xv\|^2$. It is positive definite exactly when $X$ has trivial null space. This links least squares uniqueness to eigenvalues. A tiny positive eigenvalue signifies a weakly constrained direction rather than complete nonidentifiability.

<a id="lesson-15"></a>
## Session 15 — Singular value decomposition and pseudoinverses

### Separate input directions from output directions

Eigenvectors require a square matrix and compare a direction to itself after transformation. Data matrices are often rectangular, and their input and output spaces differ. Singular value decomposition, or SVD, gives

$$
A=U\Sigma V^\top.
$$

For a full SVD of an $m\times d$ matrix, $U$ is $m\times m$ orthogonal, $V$ is $d\times d$ orthogonal, and $\Sigma$ is $m\times d$ with nonnegative diagonal entries. The positive entries $\sigma_1\ge\cdots\ge\sigma_r>0$ are singular values, where $r$ is rank. Reduced SVDs omit unneeded directions; software shapes depend on that option.

Read the factorization from right to left. $V^\top$ expresses the input in orthonormal input directions. $\Sigma$ scales retained directions and may remove some. $U$ expresses the scaled result in orthonormal output directions. Thus every matrix transforms a unit sphere into an ellipsoid, possibly flattened into a lower-dimensional set.

Why does an SVD exist? The matrix $A^\top A$ is symmetric PSD, so choose orthonormal eigenvectors $v_j$ with eigenvalues $\lambda_j\ge0$. Define $\sigma_j=\sqrt{\lambda_j}$ and, for positive singular values, $u_j=Av_j/\sigma_j$. Then

$$
u_i^\top u_j=
\frac{v_i^\top A^\top Av_j}{\sigma_i\sigma_j}
=\frac{\lambda_j v_i^\top v_j}{\sigma_i\sigma_j},
$$

which is one when $i=j$ and zero otherwise. Extend these $u_j$ to an orthonormal output basis. Zero eigenvalues correspond to null directions. Expanding any input in the $v_j$ basis reconstructs the factorization. This proof gives the structure, though computing an SVD numerically by first forming $A^\top A$ is usually less accurate than direct routines.

For $A=\begin{pmatrix}3&0\\0&1\\0&0\end{pmatrix}$, input directions are the two coordinate axes. They become output vectors $(3,0,0)$ and $(0,1,0)$. Singular values are three and one. The output space contains a third direction that no input can reach. The nonzero part can be written as a sum of rank-one maps:

$$
A=\sum_{j=1}^r\sigma_j u_jv_j^\top.
$$

Each term measures one input coordinate with $v_j^\top x$, scales it, and sends it along $u_j$.

The pseudoinverse reverses nonzero singular values and leaves zero directions zero:

$$
A^+=\sum_{j=1}^r\frac1{\sigma_j}v_ju_j^\top.
$$

For any target $y$, $A^+y$ is a least squares solution with smallest Euclidean coefficient norm. To see this, write $y$ in output coordinates. For each retained direction, choose coefficient $(u_j^\top y)/\sigma_j$ to match it. Unreachable output components remain residual. Any extra input null-space component would not change the fit but would add squared norm orthogonally, so the minimum-norm choice sets it to zero.

A tiny singular value causes large inverse amplification. If $\sigma=10^{-6}$, an output perturbation of $10^{-3}$ along the matching direction changes an inverse coefficient by $10^3$. That does not mean the SVD failed; it reveals that the inverse problem itself is sensitive. A numerical cutoff or regularization expresses a decision not to invert directions unsupported at the available precision or noise level.

<a id="lesson-16"></a>
## Session 16 — Low rank approximation, PCA, and conditioning

### Keep what contributes most

Truncate the SVD after $k$ terms:

$$
A_k=\sum_{j=1}^k\sigma_j u_jv_j^\top.
$$

The Frobenius norm is the square root of the sum of squared entries. Since these rank-one terms are orthonormal under the entrywise inner product, the squared truncation error is

$$
\|A-A_k\|_F^2=\sum_{j>k}\sigma_j^2.
$$

The Eckart–Young result says this is the smallest possible Frobenius error among rank-at-most-$k$ matrices. Its spectral-norm error is $\sigma_{k+1}$. A useful proof idea for the spectral claim is that any rank-$k$ approximation must annihilate some unit vector inside the $(k+1)$-dimensional span of the leading right singular vectors. On that vector, $A$ has norm at least $\sigma_{k+1}$, giving a lower bound attained by truncation. The full Frobenius optimality proof additionally compares retained orthogonal subspaces and their captured squared lengths; we give the operational derivation through PCA below rather than claiming that the one-vector argument proves both norms.

For data $X\in\mathbb R^{n\times d}$, center each column and call the result $X_c$. With $n>1$, define sample covariance

$$
C=\frac1{n-1}X_c^\top X_c.
$$

For a unit direction $v$, the projected observations are $X_cv$ and their sample variance is $v^\top Cv$. Write $v=\sum_j a_jq_j$ in the eigenbasis of $C$. Unit length gives $\sum_j a_j^2=1$, so

$$
v^\top Cv=\sum_j\lambda_j a_j^2\le\lambda_1.
$$

Equality is attained along a leading eigenvector. This proves the first principal component maximizes projected variance. Restricting later directions to be perpendicular to earlier ones gives the remaining eigenvectors. SVD of $X_c$ supplies the same directions because $C$ has eigenvalues $\sigma_j^2/(n-1)$ and eigenvectors equal to the right singular vectors.

For several orthonormal directions in columns of $W$, reconstructed centered data are $X_cWW^\top$. Squared error equals total squared data length minus captured squared projected length. If $P=WW^\top$ and $v_j$ are the right singular vectors, captured length is $\sum_j\sigma_j^2\|W^\top v_j\|^2$. Each weight lies in $[0,1]$, and their sum is $k$. The largest possible weighted sum places weight one on the $k$ largest squared singular values. This proves PCA's reconstruction optimality for orthogonal rank-$k$ projections and explains the Frobenius truncation formula geometrically.

As a concrete example, take observations $(2,0),(0,2),(-2,0),(0,-2)$. They are already centered and have equal variance in both coordinates. Covariance is $\operatorname{diag}(8/3,8/3)$. There is no unique first direction: every unit direction captures the same variance. An implementation may return either axis or another orthonormal basis without being wrong. Repeated eigenvalues make directions nonunique even when the principal subspace is meaningful.

If instead observations are $(2,0),(0,1),(-2,0),(0,-1)$, covariance is $\operatorname{diag}(8/3,2/3)$. The horizontal direction captures four-fifths of total variance. Keeping it reconstructs all vertical coordinates as zero. Variance explained is a geometric criterion; a low-variance feature could still be crucial for predicting a target. PCA never consults that target.

### Measure sensitivity, then choose a response

For a full-column-rank matrix, the Euclidean condition number is $\kappa_2(A)=\sigma_{\max}/\sigma_{\min}$. For a square invertible system, relative solution sensitivity has an upper bound proportional to this number for sufficiently small perturbations. The bound is worst-case, not a promise that every perturbation causes that much error. Perturbations aligned with weak directions are especially damaging.

Normal equations square the condition number because singular values of $A^\top A$ are $\sigma_j^2$. If $\kappa(A)=10^6$, the corresponding Gram matrix has condition number $10^{12}$. Solving through that matrix can lose useful precision. Direct QR or SVD avoids adding this unnecessary numerical difficulty, though it cannot eliminate sensitivity inherent in the original data.

Ridge regularization solves $\|X\beta-y\|^2+\lambda\|\beta\|^2$ for $\lambda>0$. Its singular-direction multiplier is $\sigma_j/(\sigma_j^2+\lambda)$ rather than $1/\sigma_j$. Small singular values are damped. Truncated SVD discards weak directions sharply; ridge shrinks them smoothly. Both trade some fitting bias for less amplification. Chapter 12 derives the statistical consequences.

### A two-coordinate PCA example with an off-axis direction

Axis-aligned examples make the variance calculation easy, but they can hide why eigenvectors are useful. Consider centered observations on the diagonal: one at coordinates two and two, one at minus two and minus two, one at one and one, and one at minus one and minus one. Every observation is a multiple of the direction one and one. The covariance has equal diagonal and off-diagonal entries, rather than being diagonal in the original coordinates.

The normalized diagonal direction has positive variance, while the perpendicular direction one and minus one has zero variance. PCA rotates the coordinate system so those two kinds of variation become separate. A single principal score reconstructs every observation exactly because the data have rank one. Adding small perpendicular noise makes reconstruction approximate rather than exact and gives the second singular value a small positive value.

Now consider what the scores mean. A point at coordinates two and two has score two times the square root of two along the unit diagonal direction. Its score is not two because the direction was normalized to length one. Multiplying the score by that direction reconstructs the original point. Forgetting normalization can produce a reconstruction with the correct direction and the wrong scale.

The original mean must be added after reconstructing centered data. Without that final translation, PCA reconstructs deviations from the mean rather than observations themselves. This is particularly easy to miss when a demonstration uses data centered at the origin. The example code stores the mean explicitly so the same implementation remains correct after a translation.

### Covariance PCA and standardized PCA answer different questions

A feature measured in large units can dominate the covariance matrix. If one coordinate is kilometers and another a small probability, the largest numeric variance may largely reflect units. Standardizing every feature first performs PCA on a correlation-based geometry instead. It gives each nonconstant feature unit variance before looking for shared directions.

Neither version is automatically superior. If the numeric scale encodes genuine measurement magnitude, preserving it may be appropriate. If units are arbitrary and comparable relative variation is the target, standardization may be useful. A decision about preprocessing is therefore a decision about which reconstruction errors count most.

Training and test data must share the fitted transformation. Estimate the mean, scales, and principal directions on training observations, then apply those fixed quantities to held-out data. Recomputing directions on the test data changes the representation using information unavailable at the time of fitting. Even an unsupervised transform can leak information across an intended evaluation boundary.

When leading eigenvalues are close, individual component directions may rotate substantially under tiny data changes. The subspace spanned by a group of components can be much more stable than any one named component. Interpreting a particular loading vector as a permanent physical factor requires more evidence than its appearance in one decomposition.

### Regularization as a controlled inverse

Consider a diagonal transformation with scales one and one-millionth. The first output coordinate identifies its input reliably at ordinary noise levels. The second output can be dominated by noise even when the input magnitude is ordinary. An exact inverse multiplies that noise by one million. Asking for more digits from the linear solver cannot create the missing measurement information.

Truncated inversion sets the weak component to zero. That introduces an explicit approximation: a real signal along that component is discarded too. Ridge inversion instead attenuates it continuously. Both procedures replace an unstable exact inversion with a more stable biased one. Selecting their strength should reflect noise, prediction goals, and validation, rather than a desire to make every coefficient small for its own sake.

A subtle point is that numerical rank is relative to a tolerance and scale. A matrix with a nonzero but tiny singular value has full algebraic rank. Software may treat that value as effectively zero relative to the largest singular value and machine precision. Reporting the cutoff and singular values makes the practical decision inspectable. Calling a matrix simply “rank deficient” without naming whether the statement is exact or numerical can conceal the reason two implementations differ.

In scientific computation, a residual check and a condition estimate belong together. A tiny residual means the returned solution nearly satisfies the equations. A large condition number means many very different solutions can correspond to nearly identical right-hand sides. Thus a tiny residual does not imply a small error relative to the unknown exact coefficients. The decomposition gives a direct explanation of that otherwise surprising combination.

### A complete PCA calculation

```python
import numpy as np

X = np.array([[2., 0.], [0., 1.], [-2., 0.], [0., -1.]])
center = X.mean(axis=0)
Xc = X - center
U, singular, Vt = np.linalg.svd(Xc, full_matrices=False)
leading = Vt[0]
scores = Xc @ leading
reconstruction = np.outer(scores, leading) + center
fraction = singular[0] ** 2 / np.sum(singular ** 2)
print(fraction)
print(np.sum((X - reconstruction) ** 2))
```

The variance fraction is `0.8` and total squared reconstruction error is `2.0`. The sign of `leading` may differ across valid implementations. Flipping both a direction and its scores leaves reconstruction unchanged. `axis=0` means averaging rows within each column. `full_matrices=False` returns only the reduced singular-vector arrays needed here. These details connect the mathematical convention of observations in rows to actual array operations.

The matrix companion transforms a sampled unit circle using a controllable matrix, displaying its image and two singular values. Set one row to a multiple of the other: the image collapses to a line. In the PCA experiment, change the vertical scale of the synthetic cloud and observe how variance fractions and reconstruction change. The calculations, rather than a pre-recorded animation, determine the displayed results.

An optional extension adds measurement noise along the weak direction of a nearly singular matrix. Compare coefficient changes with prediction changes. Large weight movement accompanied by small prediction movement is exactly what the singular directions predict. This is often a more informative diagnostic than treating unstable coefficients as an optimizer bug.

We now understand a matrix as a collection of independently scaled orthogonal directions, even when its input and output dimensions differ. To understand how a model changes as parameters change continuously, we next need limits and derivatives. The geometric theme remains: complicated behavior will be approximated by simpler local structure, with explicit assumptions about the approximation.

[Previous chapter](03-matrices-and-least-squares.md) · [Curriculum](../CURRICULUM.md) · [Next chapter](05-calculus-from-first-principles.md)
