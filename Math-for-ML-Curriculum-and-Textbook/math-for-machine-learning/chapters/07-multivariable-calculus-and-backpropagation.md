# 7. Multivariable calculus: gradients, Jacobians, and backpropagation

This chapter contains outline lessons 25–28. It combines linear transformations with local approximation. Our central problem is determining how a scalar loss changes when many inputs or parameters move at once. We use column gradients and explicitly track the dimensions of each derivative.

<a id="lesson-25"></a>
## Session 25 — Partial derivatives and total differentiability

### One coordinate at a time is a start

Let $f(x,y)=x^2+3xy+y^2$. Holding $y$ fixed and differentiating with respect to $x$ gives $f_x=2x+3y$. Holding $x$ fixed gives $f_y=3x+2y$. At $(1,2)$, these are eight and seven. The partial derivatives describe sensitivity along the two coordinate directions.

For a general scalar function $f:\mathbb R^d\to\mathbb R$, the partial derivative in coordinate $j$ is

$$
\partial_jf(x)=\lim_{h\to0}\frac{f(x+he_j)-f(x)}h.
$$

The direction vector $e_j$ changes only one coordinate. A directional derivative along a unit vector $v$ replaces $e_j$ by $v$ in that limit. We specify unit length when interpreting a rate per unit distance; algebraic directional derivatives can also be defined for nonunit vectors, in which case scale changes the rate.

For the quadratic above, move by $h=(h_1,h_2)$. Exact expansion gives

$$
f(1+h_1,2+h_2)=f(1,2)+8h_1+7h_2+h_1^2+3h_1h_2+h_2^2.
$$

The first-order change is the linear map $h\mapsto8h_1+7h_2$. The rest is quadratic and becomes negligible relative to $\|h\|$. Total differentiability formalizes this requirement:

$$
f(x+h)=f(x)+Df(x)[h]+r(h),\qquad
\frac{|r(h)|}{\|h\|}\to0.
$$

Here $Df(x)$ must be one linear map that approximates changes in every approaching direction, not a separate rule on each axis.

Partial derivatives alone do not guarantee this. Define

$$
g(x,y)=\begin{cases}xy/(x^2+y^2),&(x,y)\ne(0,0),\\0,&(x,y)=(0,0).\end{cases}
$$

Along either coordinate axis the function is zero, so both partial derivatives at the origin exist and equal zero. Along the diagonal $x=y=t\ne0$, it equals one-half, so it is not even continuous there. The axes missed behavior in other directions. A useful sufficient condition is that all first partial derivatives exist and are continuous in a neighborhood; then the function is totally differentiable there. This theorem is stated here, with the local linear expansion used as the defining standard.

For a differentiable vector-valued map $F:\mathbb R^d\to\mathbb R^m$, the same definition uses a linear map $DF(x)$ and a vector remainder. Choosing coordinates gives a matrix. This is the conceptual bridge: multivariable derivatives are matrices because their job is to linearly transform small input changes into small output changes.

<a id="lesson-26"></a>
## Session 26 — Gradients and steepest ascent

### The gradient represents a linear functional

For a scalar differentiable function, put the partial derivatives into a column:

$$
\nabla f(x)=\begin{pmatrix}\partial_1f(x)\\\vdots\\\partial_df(x)\end{pmatrix}.
$$

Then $Df(x)[h]=\nabla f(x)^\top h$. At our point, a displacement $(0.01,-0.02)$ gives first-order change $8(0.01)+7(-0.02)=-0.06$. The exact quadratic remainder is $0.0001-0.0006+0.0004=-0.0001$, so the exact change is $-0.0601$. The derivative predicts both sign and approximate magnitude, with an explicit error scale.

For unit $v$, the directional derivative is $\nabla f(x)^\top v$. Cauchy–Schwarz bounds it by $\|\nabla f(x)\|$. Equality is attained by $v=\nabla f/\|\nabla f\|$ when the gradient is nonzero. Thus the gradient direction gives steepest first-order ascent under a Euclidean unit-length constraint; its negative gives steepest descent.

The Euclidean qualification matters. Suppose a step $h$ has cost $h^\top Mh$ for a symmetric positive definite matrix $M$. Maximizing the linear change under that cost produces a direction proportional to $M^{-1}\nabla f$. Changing the metric changes what counts as an equally sized step. Feature scaling and preconditioning therefore affect practical optimization geometry rather than merely renaming coordinates.

At a zero gradient, every differentiable directional derivative is zero, but a minimum need not occur. The function $x^2-y^2$ has zero gradient at the origin and decreases along the vertical axis while increasing along the horizontal. First-order information vanishes there; second-order information is necessary to classify the point.

A level set contains points with the same function value. If a smooth curve $x(t)$ stays in one level set, differentiating $f(x(t))$ gives $\nabla f(x(t))^\top x'(t)=0$. Thus the gradient is perpendicular to tangent directions along that level set. This is a local statement at regular points with nonzero gradient; singular level sets can have more complicated structure.

<a id="lesson-27"></a>
## Session 27 — Jacobians, composition, and backpropagation

### Keep the derivative's input and output spaces visible

The Jacobian of $F:\mathbb R^d\to\mathbb R^m$ has entries

$$
J_F(x)_{ij}=\frac{\partial F_i}{\partial x_j},
\qquad J_F\in\mathbb R^{m\times d}.
$$

Its columns correspond to input coordinates and rows to output coordinates. For

$$
F(x,y)=\begin{pmatrix}x^2+y\\xy\end{pmatrix},
\qquad J_F(x,y)=\begin{pmatrix}2x&1\\y&x\end{pmatrix}.
$$

At $(1,2)$, a small displacement $(0.01,-0.02)$ maps to approximately $(0,0)^\top$: $2(0.01)-0.02=0$ and $2(0.01)-0.02=0$. Exact output changes need not vanish because quadratic terms remain. A derivative can erase a first-order direction without the nonlinear function being globally constant along it.

For differentiable $F:\mathbb R^d\to\mathbb R^m$ and $G:\mathbb R^m\to\mathbb R^k$, substitute local linear expansions to derive

$$
J_{G\circ F}(x)=J_G(F(x))J_F(x).
$$

The dimensions are $(k\times m)(m\times d)=k\times d$. The order matches composition. Local remainders remain negligible under fixed finite-dimensional linear maps, so the first-order parts compose exactly while higher-order errors disappear relative to input length.

If the final output is a scalar loss $L=\ell(F(x))$, then

$$
\nabla_xL=J_F(x)^\top\nabla_z\ell,\qquad z=F(x).
$$

Forward perturbations multiply by $J_F$. Backward sensitivities multiply by its transpose. These are different operations with compatible meanings: the scalar change $\nabla_z\ell^\top(J_Fh)$ equals $(J_F^\top\nabla_z\ell)^\top h$. This equality derives the backward rule rather than requiring memorized arrows.

### Walk through a tiny neural computation

Let $z=wx+b$, $a=\tanh z$, and $L=\frac12(a-y)^2$. The hyperbolic tangent can be defined as $(e^z-e^{-z})/(e^z+e^{-z})$ and has derivative $1-\tanh^2z$. Build local sensitivities:

$$
\frac{\partial L}{\partial a}=a-y,\qquad
\frac{\partial a}{\partial z}=1-a^2,
$$

$$
\frac{\partial L}{\partial w}=(a-y)(1-a^2)x,
\qquad
\frac{\partial L}{\partial b}=(a-y)(1-a^2).
$$

At $x=2,w=0,b=0,y=1$, the forward pass gives $z=0,a=0,L=1/2$. The backward pass gives loss sensitivity $-1$, activation sensitivity one, weight gradient $-2$, and bias gradient $-1$. Every number has a local role. Gradient descent will increase both parameters, which increases the output toward the positive target.

Backpropagation applies this chain rule efficiently on a computation graph, saving needed forward values and accumulating sensitivities in reverse order. If one variable feeds two branches, contributions add. For $L=u^2+3u$ with $u=wx$, the two paths contribute $2u$ and three to $\partial L/\partial u$. Using only one path would omit part of the derivative.

For vector layers $z=Wx+b$, elementwise $a=\phi(z)$, and scalar loss, let $\delta=\nabla_zL$. Then

$$
\nabla_WL=\delta x^\top,\quad
\nabla_bL=\delta,\quad
\nabla_xL=W^\top\delta.
$$

The first expression is an outer product. If $W$ is $m\times d$, then $\delta$ has length $m$, $x$ length $d$, and their outer product has the right shape. For a batch loss averaged over observations, sum these sample contributions and divide by the batch size. Missing that division changes gradient scale and therefore the effective learning rate.

Reverse mode is especially efficient when there are many parameters and one scalar loss: one backward traversal computes all parameter derivatives. Forward-mode differentiation propagates input perturbations instead and can be attractive when the input dimension is small compared with the number of outputs. Neither method approximates derivatives by finite differences; both differentiate the executed operations, subject to their mathematical differentiability and arithmetic precision.

<a id="lesson-28"></a>
## Session 28 — Hessians, Taylor expansions, and matrix derivatives

### Second-order structure is another matrix

The Hessian of a scalar function has entries $H_{ij}=\partial_i\partial_jf$. If second partial derivatives are continuous in a neighborhood, mixed partials agree and $H$ is symmetric. For $f(x,y)=x^2+3xy+y^2$,

$$
H=\begin{pmatrix}2&3\\3&2\end{pmatrix}.
$$

Its eigenvalues are five and minus one, so the function has both upward and downward curvature. Positive coefficients on $x^2$ and $y^2$ alone do not guarantee an overall bowl; the cross term matters.

For a twice continuously differentiable function,

$$
f(x+h)=f(x)+\nabla f(x)^\top h+\tfrac12h^\top H(x)h+o(\|h\|^2).
$$

For a quadratic this expansion is exact. For a general function it is local. Eigenvectors of a symmetric Hessian identify principal curvature directions. The Hessian's sign at one point classifies a strict local optimum only with the appropriate stationary-point conditions and definiteness, developed in Chapter 8.

A clean way to derive matrix gradients uses differentials. For a scalar function of a matrix, define its gradient by

$$
dL=\sum_{ij}\frac{\partial L}{\partial W_{ij}}dW_{ij}
=\operatorname{tr}((\nabla_WL)^\top dW).
$$

Trace sums diagonal entries. This identity expresses the ordinary entrywise inner product, not a new kind of derivative. It helps arrange matrix expressions into a recognizable gradient shape.

For $L(\beta)=\frac12\|X\beta-y\|^2$, set $r=X\beta-y$. The differential is $dL=r^\top dr=r^\top X\,d\beta$. Therefore

$$
\nabla_\beta L=X^\top(X\beta-y),\qquad
H=X^\top X.
$$

The factor one-half cancels the derivative of the square. If the objective is mean squared error without one-half, multiply the gradient and Hessian by $2/n$. Scaling conventions must match the stated objective.

For $q(x)=x^\top Ax$, expand $q(x+h)-q(x)=h^\top Ax+x^\top Ah+h^\top Ah$. The linear part gives $\nabla q=(A+A^\top)x$. It reduces to $2Ax$ only when $A$ is symmetric. Assuming symmetry without checking is a common source of matrix-calculus errors.

For elementwise activations, the Jacobian is diagonal: $\operatorname{diag}(\phi'(z_j))$. For softmax, by contrast, outputs interact through a shared denominator. With $p_i=e^{z_i}/\sum_ke^{z_k}$,

$$
\frac{\partial p_i}{\partial z_j}=p_i(\mathbf1_{i=j}-p_j),
\quad J=\operatorname{diag}(p)-pp^\top.
$$

The indicator $\mathbf1_{i=j}$ is one for equal indices and zero otherwise. Summing each column gives zero because probabilities always sum to one. This invariant is useful when checking implementations.

### A worked vector-layer derivative with actual numbers

Take a two-input, two-output affine layer. Let the weight rows be one and two, then minus one and three. Let the input be two and one, and choose zero biases. The output is four and one, obtained by dotting each row with the input. Suppose a later scalar loss sends back output sensitivities three and minus two. These sensitivities describe the loss change per unit change in each layer output.

The input sensitivity is the weight transpose times that output-sensitivity vector. Its first component is one times three plus minus one times minus two, giving five. Its second is two times three plus three times minus two, giving zero. Thus a small change in the first input has a first-order effect on the loss, while the two paths from the second input cancel.

For a weight entry, the local output change equals that weight change multiplied by its incoming input. Therefore the first weight row receives three times the input, giving six and three. The second receives minus two times the input, giving minus four and minus two. Bias derivatives are three and minus two because a bias adds directly to its corresponding output.

This is the outer-product formula in ordinary arithmetic. It also shows why replacing the outer product with a dot product is wrong: a dot product would collapse all those independently meaningful parameter sensitivities into one scalar. Tracking the object each derivative must describe is a reliable way to catch a mistaken operation.

Now imagine this input was copied into two separate branches before their outputs were added. The backward input sensitivity must sum both branch contributions. A variable is one mathematical input even when it appears in several expressions. Reusing it in code does not make one of its paths disappear. Automatic differentiation systems implement that accumulation, but a hand derivation must also account for it explicitly.

### A directional test is often cheaper than checking every coordinate

For a scalar function of many parameters, checking every partial derivative with central differences takes two function evaluations per coordinate. A random-direction check chooses one fixed vector of parameter perturbations and compares the analytic gradient's dot product with that vector against a central difference taken along the entire vector.

This check asks whether the derivative's predicted loss change agrees with an independent finite-difference approximation. It can reveal a wrong overall sign, missing batch average, or missing branch with only two perturbed forward passes. It does not certify every coordinate: an error orthogonal to the chosen direction can escape detection. Several deterministic directions or a full coordinate check on a tiny model provide stronger evidence.

Use the same data and randomness for both perturbed evaluations. If dropout masks or random sampling change between calls, the loss difference includes random changes unrelated to the parameter perturbation. Similarly, a stateful running average updated during each evaluation can make the function being compared different from the fixed mathematical objective.

Double precision and a moderate perturbation are useful for diagnostic examples. A perturbation so small that both function values round to the same number can falsely suggest a zero derivative. One so large that nonlinear effects dominate can falsely suggest an incorrect derivative. Varying the step over a short reasonable range helps distinguish a systematic formula error from finite-difference limitations.

### The Hessian is a derivative of the gradient

There are two useful ways to understand a Hessian-vector product. First, differentiate the gradient along a chosen direction; the resulting first-order change is the Hessian applied to that direction. Second, read it as the curvature information relevant to that one direction, without needing to store the entire matrix.

For a model with a million parameters, a dense Hessian would contain a trillion entries. Yet an algorithm may only require products with a few directions. Automatic differentiation can compute such products by composing forward and reverse operations. The mathematical object is still the same derivative of a gradient; the computational representation changes to avoid materializing unused entries.

The scalar quadratic form formed by a direction, the Hessian, and the same direction describes second-order change along that direction. A positive value means local upward curvature along that line; a negative value means downward curvature. Zero means the quadratic approximation contributes nothing along it, leaving higher orders relevant. It does not automatically mean the function is constant there.

In least squares the Hessian does not depend on the current coefficients, because the objective is exactly quadratic. In logistic regression it depends on current predicted probabilities through a diagonal weight matrix. In a neural network, both activation sensitivities and residual-dependent terms can change with parameters. Treating every model's Hessian as a fixed Gram matrix would erase precisely the nonlinear structure being studied.

### Differentiability of the executed computation has practical limits

A mathematical derivative describes a specified function. A program can contain rounding, clipping, conditional branches, sorting, or discrete indexing. These operations can make the executed function piecewise smooth, discontinuous, or locally constant. A framework's automatic derivative follows its implemented derivative rules; it does not invent a useful derivative for an arbitrary discrete decision.

For example, taking the index of the largest class score produces a predicted label. That index changes abruptly at score ties and is locally constant elsewhere, so differentiating it is unhelpful for training. Cross-entropy instead differentiates the smooth scores or probabilities before the label decision. This explains why prediction output and training objective often use different computational paths.

Clipping a probability before taking a logarithm prevents undefined arithmetic but changes the function and can create flat regions with zero derivative. A stable algebraic logit loss preserves the intended objective more faithfully than an arbitrary clipping threshold. The final chapter develops those stable expressions, building on the log-sum-exp identity from Chapter 1.

These details do not diminish the chain rule. They establish what function is actually being differentiated and whether its hypotheses hold. A careful implementation names nondifferentiable points and conventions, keeps diagnostic examples deterministic, and checks local sensitivities against the same stated objective.

### Verify a gradient with an independent approximation

```python
import numpy as np

X = np.array([[1., 1.], [1., 2.], [1., 4.]])
y = np.array([8., 11., 18.])
beta = np.array([5., 3.])

def loss(parameters):
    residual = X @ parameters - y
    return 0.5 * (residual @ residual)

analytic = X.T @ (X @ beta - y)
step = 1e-5
numerical = np.zeros_like(beta)
for j in range(beta.size):
    offset = np.zeros_like(beta)
    offset[j] = step
    numerical[j] = (loss(beta + offset) - loss(beta - offset)) / (2 * step)
print(analytic)
print(numerical)
```

Both gradients are approximately `[-1., -4.]`. The forward residual is `[0., 0., -1.]`; multiplying by the intercept and distance columns gives the two entries. The central difference computes an independent approximate derivative, which is useful for detecting a missing transpose or scaling factor. It is a diagnostic, not a replacement for the analytic rule, and should use double precision on a small deterministic example.

The backpropagation companion lets you change the scalar network's input, weight, bias, and target, then shows both passes and finite-difference comparisons. At large positive or negative preactivation, $\tanh$ saturates and its derivative becomes small. A large output error can then coexist with a small parameter gradient, illustrating why loss magnitude and sensitivity are different quantities.

An optional extension replaces the activation by $\max(0,z)$, the rectified linear unit. Away from zero, its derivative is zero on the negative side and one on the positive side. At zero it has no ordinary derivative. Frameworks choose a convention for computation there; state it and avoid centered gradient checks exactly at the kink. A numerical mismatch at a nondifferentiable point does not establish that a smooth chain-rule derivation was wrong elsewhere.

We have built derivatives as linear maps, represented scalar sensitivities as gradients, composed derivatives as Jacobians, and accumulated reverse sensitivities through a network. The next chapter uses those derivatives to choose actual parameter changes, with guarantees that depend on curvature, step size, and assumptions about the objective.

[Previous chapter](06-integration-and-change-of-variables.md) · [Curriculum](../CURRICULUM.md) · [Next chapter](08-optimization.md)
