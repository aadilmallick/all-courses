# Following a change backward: calculus, computation graphs, and learning

## Begin with a measurement that can be wrong

Suppose a model predicts a number $v$ and the desired answer is $y$. We need a scalar that becomes small when the prediction is close. One convenient choice is half the squared error, $L=(v-y)^2/2$. The square removes the sign and emphasizes larger deviations. The factor one half makes its derivative cleaner; it does not change where the minimum lies.

Take $y=1$ and $v=0.4$. Error is $-0.6$, squared error is 0.36, and the loss is 0.18. If the prediction rises slightly, the error becomes less negative and the loss falls. A derivative gives this directional statement a numerical scale. It tells us how much loss change to expect per small unit change in the prediction.

The word small is essential. A derivative describes a local relationship. It is not a promise that moving a parameter an arbitrary distance in that direction keeps improving the objective. We will repeatedly compare local predictions with actual changes, because this distinction explains learning-rate instability.

## Derivatives, Jacobians, and the chain rule

### What a gradient actually predicts

Training needs a local answer: how does the loss change when a parameter moves slightly? For differentiable $f$, the derivative is the limit $f'(a)=\lim_{h\to0}[f(a+h)-f(a)]/h$. The limit matters: a finite difference estimates a derivative; it is not its definition or an exact replacement.

For $f(x)=x^2$, expand $(a+h)^2-a^2=2ah+h^2$. Divide by $h\ne0$ to obtain $2a+h$, then take the limit to obtain $2a$. We have used the distributive law and the fact that $h\to0$. No memorized power rule was required.

A scalar function $L(\theta)$ of many parameters has gradient whose $i$th component is $\partial L/\partial\theta_i$. Its first-order approximation is $L(\theta+\Delta)\approx L(\theta)+\nabla L^\top\Delta$. Choosing $\Delta=-\eta\nabla L$ gives predicted change $-\eta\|\nabla L\|^2$, negative for nonzero gradient and positive step size. The approximation can fail for a large step.

### Derive a small network

Let $u=wx+b$, $v=\tanh u$, and $L=(v-y)^2/2$. Hold data $x,y$ fixed. The outer derivative is $\partial L/\partial v=v-y$. The activation derivative is $\partial v/\partial u=1-v^2$. The affine derivatives are $\partial u/\partial w=x$ and $\partial u/\partial b=1$. Therefore

$$\frac{\partial L}{\partial w}=(v-y)(1-v^2)x,\qquad
\frac{\partial L}{\partial b}=(v-y)(1-v^2).$$

Every factor describes one edge of the computation. A gradient multiplies along a path and adds across different paths. If $w$ is used twice, both uses contribute. Forgetting one path is a common error in tied embeddings and recurrent models.

### Jacobians and reverse mode

For $f:\mathbb R^n\to\mathbb R^m$, $J_{ij}=\partial f_i/\partial x_j$. Given upstream scalar-loss derivatives $g\in\mathbb R^m$, reverse mode computes $J^\top g\in\mathbb R^n$. It avoids constructing a huge Jacobian explicitly. Backpropagation is the chain rule organized around this vector-Jacobian product.

At an absolute-value cusp, no unique classical derivative exists. At a clipping boundary, a numerical derivative may average two slopes. Check smooth points first. With floating-point subtraction, tiny $h$ can lose significant digits; huge $h$ measures nonlocal curvature. The central difference has truncation error of order $h^2$ for sufficiently smooth functions, but roundoff eventually dominates.

The experiment compares an analytical network derivative with central differences. Agreement at one point provides useful local evidence, not a proof for every input. A proper implementation check also changes the input, uses multiple coordinates, and checks shared-parameter paths.

#### A shared-parameter derivative you can reconstruct

Let $u=w^2$, $v=3w$, and $L=(u+v)^2/2$. The derivative at the final square is $u+v$. The first path contributes $(u+v)2w$ and the second contributes $(u+v)3$. Add them to obtain $(w^2+3w)(2w+3)$. At $w=1$, this is $4\cdot5=20$. Differentiating only the $w^2$ occurrence would give eight and miss twelve from the second path. This tiny counterexample explains why an autodiff engine accumulates into a shared leaf instead of overwriting its gradient each time a parent operation is visited.


## Work one complete chain with numbers

Use $x=2$, $w=0.3$, $b=-0.1$, and target $y=1$. The affine intermediate is $u=wx+b=0.5$. The activation is $v=\tanh(0.5)\approx0.462117$. Therefore $L\approx(0.462117-1)^2/2\approx0.144659$. Every number belongs to one named stage; this naming is what makes a long chain manageable.

The outer slope is $v-y\approx-0.537883$. The tanh slope is $1-v^2\approx0.786448$. The affine slope with respect to $w$ is $x=2$. Multiply along the path: $\partial L/\partial w\approx-0.846033$. The negative sign says a small increase in this weight decreases the loss. With learning rate 0.01, gradient descent proposes a weight change of about $+0.00846033$.

Notice the sign reversal. Gradient points toward increasing loss. Descent subtracts the gradient. If we later maximize a reward, we either add its gradient or minimize the negative reward. Many reinforcement-learning bugs are ordinary sign mistakes disguised by more elaborate notation.


### Executable calculation

Run `python examples/03_calculus_chain_rule.py` from the package root. Complete source is also included as [03_calculus_chain_rule.py](../examples/03_calculus_chain_rule.py).

```python
import numpy as np
from core import finite_difference
sample, target = 1.4, -0.2
def objective(parameter):
    value = np.tanh(parameter[0] * sample + parameter[1])
    return 0.5 * (value - target) ** 2
parameter = np.array([0.3, -0.1])
value = np.tanh(parameter[0] * sample + parameter[1])
local = (value - target) * (1 - value ** 2)
analytic = np.array([local * sample, local])
numerical = finite_difference(objective, parameter)
assert np.allclose(analytic, numerical, atol=1e-7)
print('analytic', analytic, 'numerical', numerical)
```

Recorded output on the checked Python/NumPy environment:

```text
analytic [0.64497852 0.46069894] numerical [0.64497852 0.46069894]
```


## A graph records dependencies, not a new kind of calculus

Draw one node for $w$, one for $b$, one for $u$, one for $v$, and one for $L$. Edges indicate which values were used to compute another value. During the forward pass, store the intermediate values. During the reverse pass, start at the scalar loss with derivative one and distribute derivatives to parents using each operation's local rule.

For a sum, each input receives the upstream derivative. For a product, each input receives that derivative multiplied by the other input. For tanh, multiply by one minus the squared saved output. When a variable has several outgoing paths, add the contributions that return along them. These are not additional assumptions: they are the chain rule and the derivative of a sum applied systematically.

Reverse mode is especially useful when there are many parameters but one scalar objective. It computes the derivative of that objective with respect to every participating parameter in one backward traversal. It does not construct every output-by-input derivative separately. A full Jacobian is sometimes useful for analysis, but training normally needs its product with an upstream vector.

## Understand accumulation before implementing an optimizer

Let $L=(w+w)^2/2$. The inside sum contains two uses of the same parameter. At $w=1$, the sum is two and the outer derivative is two. Each use returns contribution two, so the total derivative is four. Overwriting the first contribution with the second would incorrectly give two. Visiting the shared leaf twice and propagating its entire accumulated gradient twice would also be wrong. The graph traversal and the accumulation rule solve different bookkeeping problems.

Our engine stores references to the same parameter object wherever it is reused. It visits each graph node once in reverse topological order, while local reverse rules add into parent gradients. This is the pattern that later handles repeated embedding IDs and recurrent transformer weights.

## Derive a nonlinear activation rather than treating it as a named box

The hyperbolic tangent can be written as $\tanh u=(e^u-e^{-u})/(e^u+e^{-u})$. Let numerator be N and denominator be D. Their derivatives are respectively D and N. The quotient rule therefore gives $(D^2-N^2)/D^2=1-(N/D)^2=1-\tanh^2u$. This derivation explains both the formula and its limits. Near zero, tanh is approximately linear and the derivative is near one. Far from zero, the output approaches plus or minus one and the derivative approaches zero.

If a long chain contains many saturated tanh operations, local slope factors can become small. This is one mechanism behind weak gradients in recurrent systems. It is a statement about a product of derivatives, not a claim that every nonlinear network fails. A residual path can provide another route, and different activations and normalization change the numerical behavior.

The squared-error objective also has a useful exact expansion. For $L(v)=(v-y)^2/2$ and change h, $L(v+h)-L(v)=(v-y)h+h^2/2$. The first term is the derivative prediction; the second is the curvature correction. If v is below y, a positive h initially helps, but an excessively large h can overshoot and increase loss. This is a complete local-versus-finite example with no approximation error because the objective is quadratic.

## Keep parameter updates separate from derivatives

A correct gradient describes the current forward function. An optimizer decides how to use it. Plain descent rescales every coordinate by one learning rate. Momentum combines present and previous gradients. Adaptive methods use additional state. Two optimizers can receive the same correct gradient and follow different paths.

For the simple quadratic $L=\lambda w^2/2$, descent multiplies w by $1-\eta\lambda$ at every step. If that factor is between zero and one, convergence is monotone. Between minus one and zero, signs alternate while magnitude shrinks. Outside that magnitude range, errors grow. The companion lets you observe the distinction directly rather than attributing every unstable run to a backward-pass bug.

Finally, a zero gradient needs interpretation. It can mean an optimum, a saturated activation, a missing dependency, or a cancellation among paths. Inspect intermediate values and test a small perturbation. A single numerical symptom does not identify its cause; the computation graph provides the evidence needed to distinguish these cases.

## Neural networks, backpropagation, and optimization

### Why stack learned transformations

A linear layer maps $x$ to $xW+b$. Two consecutive linear layers can be collapsed into one affine map. A nonlinearity between them changes the class of functions the network can express. Our small networks use $\tanh$, a smooth function with output in $(-1,1)$; production transformers often use GELU or gated SiLU variants instead.

A network is a directed computation graph. Nodes store numerical results; edges describe dependencies. Reverse mode starts with derivative one at a scalar loss and propagates local vector-Jacobian products in reverse topological order. The graph is an accounting device for the chain rule, not an additional learning algorithm.

### Derive the matrix reverse pass

For $Y=XW$ and upstream gradient $G=\partial L/\partial Y$, expand $Y_{ij}=\sum_kX_{ik}W_{kj}$. Holding $W$ fixed, an input perturbation gives $dY=dXW$. The scalar change is $dL=\sum_{ij}G_{ij}dY_{ij}$. Regroup the finite sums by $dX_{ik}$ to obtain $\partial L/\partial X=GW^\top$. Regroup by $dW_{kj}$ instead to obtain $\partial L/\partial W=X^\top G$.

If a bias is shared over examples, its gradient sums the upstream gradients across the shared axis. Broadcasting in the forward pass becomes summation in the backward pass. If one weight is used in two paths, its gradients add. The supplied `Tensor` class implements both rules explicitly.

### Optimization is another layer of reasoning

Gradient descent uses $\theta_{k+1}=\theta_k-\eta g_k$. Stochastic gradients estimate a dataset gradient from a minibatch. Momentum maintains a moving average of gradients. Adam also maintains an average of squared gradients and bias-corrects the moving estimates. AdamW applies decoupled weight decay; adding an L2 penalty to Adam's loss is not generally identical.

For scalar quadratic $L=\lambda\theta^2/2$, gradient descent gives $\theta_{k+1}=(1-\eta\lambda)\theta_k$. Convergence requires $|1-\eta\lambda|<1$, or $0<\eta<2/\lambda$ for positive $\lambda$. This is a complete proof for that quadratic, not a universal learning-rate rule for neural networks.

Global gradient clipping replaces $g$ by $g\min(1,c/\|g\|)$. It limits the length of the raw gradient while preserving its direction. It does not fix a wrong loss, corrupted labels, or an exploding activation. Log unclipped norms so clipping does not hide instability.

### Follow the implementation

`core.py` provides a deliberately small NumPy autodiff engine. Its `backward()` visits every parent before appending a node and traverses the resulting order backward. Fresh graphs are built on each training step, and leaf gradients are reset after updates. The tiny fitting experiment learns a scalar affine relationship. It demonstrates optimization mechanics, not language understanding.

A trustworthy check compares autodiff against finite differences before attempting a large training run. If a training loss stays flat, inspect parameter participation, gradient norms, learning rate, and label alignment in that order.

#### Derive Adam's initial bias correction

If $m_t=\beta m_{t-1}+(1-\beta)g_t$ and $m_0=0$, then $m_t=(1-\beta)\sum_{i=1}^t\beta^{t-i}g_i$. Under a stationary mean gradient $\mathbb E g_i=\mu$, take expectations and sum the geometric series to get $\mathbb E m_t=(1-\beta^t)\mu$. Dividing by $1-\beta^t$ removes this initialization bias under that assumption. It does not remove stochastic noise or make the gradient stationary. Adam applies an analogous correction to its second-moment accumulator, then divides the corrected first moment by the square root of the corrected second moment plus epsilon.


## Derive a matrix gradient without memorizing its shape

For $Y=XW$, write $Y_{ij}=\sum_kX_{ik}W_{kj}$. Suppose the final loss supplies $G_{ij}=\partial L/\partial Y_{ij}$. To find the derivative with respect to $W_{kj}$, identify every output using that entry. Holding $k,j$ fixed, sum over input rows $i$: $\partial L/\partial W_{kj}=\sum_iX_{ik}G_{ij}$. This is entry $(k,j)$ of $X^\top G$.

For input entry $X_{ik}$, sum over output features $j$: $\partial L/\partial X_{ik}=\sum_jG_{ij}W_{kj}$, giving $GW^\top$. The transpose appears because the reverse pass reverses the contraction, not because transposes are a universal way to repair a mismatch.

A broadcast bias has another sharing pattern. The same bias entry affects several rows, so its gradient sums contributions over those rows. Forward broadcasting becomes reverse summation. This principle will also appear in layer normalization, where one mean depends on every feature of a token.


### Executable calculation

Run `python examples/06_neural_networks_autodiff.py` from the package root. Complete source is also included as [06_neural_networks_autodiff.py](../examples/06_neural_networks_autodiff.py).

```python
import numpy as np
from core import Tensor
inputs = Tensor(np.array([[-1.0], [0.0], [1.0], [2.0]]))
target = Tensor(2 * inputs.data + 0.5)
weight, bias = Tensor([[0.0]]), Tensor([0.0])
initial = None
for step in range(100):
    prediction = inputs @ weight + bias
    loss = ((prediction - target) ** 2).mean()
    if initial is None:
        initial = float(loss.data)
    loss.backward()
    for parameter in (weight, bias):
        parameter.data -= 0.1 * parameter.grad
        parameter.grad.fill(0)
    inputs.grad.fill(0)
    target.grad.fill(0)
assert float(loss.data) < initial / 1000
print('initial', initial, 'final', float(loss.data), 'weight', weight.data)
```

Recorded output on the checked Python/NumPy environment:

```text
initial 7.25 final 4.4017965133294734e-14 weight [[1.99999989]]
```


## Check a derivative independently

Central differences evaluate the function at $w+h$ and $w-h$, subtract, and divide by $2h$. They ask the original forward computation a local question without using its backward implementation. At a smooth point and moderate scale, agreement with the analytical derivative is useful evidence. A very small step can lose digits in subtraction; a large step measures curvature instead of a local slope.

The companion's **Gradient microscope** shows the loss, exact derivative, finite-difference estimate, and a proposed update for the one-neuron example. Change the step and watch the derivative estimate stabilize before roundoff becomes important. Change the learning rate separately. A good derivative estimate does not guarantee that a large optimizer step is useful.

## Read the full implementation in layers

The included numerical engine is explained operation by operation in the implementation appendix. Begin with addition and multiplication, then broadcasting, matrix products, reductions, indexing, and smooth functions. You do not need to memorize all the source before using it. You should be able to point to the local rule that corresponds to an equation you derive.

There are deliberate limits: the engine is CPU NumPy, uses ordinary floating-point arrays, and builds a fresh graph for each training step. It has no GPU kernels or automatic device placement. Those conveniences can be added by a framework later. The mathematical responsibilities remain the same: define the objective, preserve dependencies, accumulate derivatives correctly, and update the intended parameters.

## What happens at a nonsmooth point

Our examples use tanh because it has an ordinary derivative everywhere. Another common activation is the rectified linear function, defined as zero for negative input and equal to input for positive input. Its derivative is zero on the negative side and one on the positive side, while no unique classical derivative exists at zero. A framework chooses a documented convention there. A central difference taken exactly across that corner can return an average slope that differs from the chosen backward rule. This is why a gradient test should first use smooth interior points, then test nonsmooth conventions separately instead of treating every mismatch as evidence that calculus failed.

The next chapter changes the kind of prediction. Instead of one desired number, a language model predicts a distribution over possible next tokens. Probability gives us a way to describe that uncertainty, and information theory gives us a loss that rewards useful distributions.
