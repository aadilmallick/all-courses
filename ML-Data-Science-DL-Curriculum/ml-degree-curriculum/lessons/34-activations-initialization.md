# 34. Activation functions and variance preserving initialization

[Previous](33-neural-networks-backprop.md) · [Course index](../README.md) · [Next](35-dropout-normalization-residuals.md)

## Nonlinearity changes the function family

An activation is a function applied to a preactivation, not a test that certifies a neuron's quality. ReLU is $\max(0,z)$; sigmoid maps to $(0,1)$; tanh maps to $(-1,1)$. Their output domains and derivatives affect both representation and optimization. Softmax is a vector-valued normalization, with cross-coordinate coupling, rather than an independent scalar activation on each coordinate.

For sigmoid, differentiate $1/(1+e^{-z})$ to get $\sigma(z)(1-\sigma(z))$. This is at most 1/4, with the maximum at zero. Multiplying many small derivatives can attenuate a backpropagated signal. Tanh derivative is $1-\tanh^2z$, also small for large magnitude inputs. ReLU derivative is 1 for positive inputs and 0 for negative inputs, with a chosen convention at zero. A unit receiving only negative preactivations can stop receiving a useful local gradient.

Leaky ReLU uses slope $a>0$ on the negative side. ELU has an exponential negative branch. Exact GELU is $z\Phi(z)$, where $\Phi$ is the standard normal CDF; its derivative is $\Phi(z)+z\varphi(z)$. Practical implementations may use an approximation. SELU's self-normalizing behavior requires specific assumptions and an appropriate setup; swapping it into an arbitrary network does not guarantee normalized activations.

## Why all-zero hidden weights fail

If two hidden units have identical incoming weights and biases, they produce the same activation. If their downstream roles are also symmetric, gradient updates preserve that equality. The network cannot spontaneously distinguish their features. Random initialization breaks symmetry. Zero biases can be fine when weights already differ; the problem is not that every stored number must be random.

## Derive Xavier scaling

For $z=\sum_{j=1}^{n_{in}}w_jx_j$, assume zero-mean independent weights with common variance, independent of centered inputs with common variance. Cross terms vanish, giving $\operatorname{Var}(z)=n_{in}\operatorname{Var}(w)\operatorname{Var}(x)$. Keeping forward variance near the input variance suggests $\operatorname{Var}(w)\approx1/n_{in}$. A similar backward calculation suggests $1/n_{out}$. Xavier's compromise is $2/(n_{in}+n_{out})$.

A uniform distribution on $[-a,a]$ has variance $a^2/3$. Matching it to $2/(n_{in}+n_{out})$ yields $a=\sqrt{6/(n_{in}+n_{out})}$. For 100 input and 100 output units, the variance is 0.01 and bound is $\sqrt{0.03}\approx0.1732$. A normal initializer instead uses standard deviation 0.1 for the same variance.

For roughly symmetric inputs, ReLU zeroes about half of a signal's second moment, motivating He variance $2/n_{in}$ under its approximate independence assumptions. These are initialization analyses, not guarantees after weights and activations become dependent during training.

## A reproducible variance experiment

```python
import numpy as np
rng=np.random.default_rng(34)
X=rng.normal(size=(4000,100))
for variance in [.0001,.01,.02,1.]:
    W=rng.normal(scale=np.sqrt(variance),size=(100,100))
    Z=X@W
    H=np.maximum(Z,0)
    print(variance, Z.var(), np.mean(H**2))
```

Preactivation variance should be near $100\operatorname{Var}(w)$, while ReLU's second moment is about half that value. Its variance is not exactly half, because its mean becomes positive. This distinction between variance and second moment prevents an overly literal interpretation of the He heuristic.

Check activation histograms and gradient norms across depth before selecting an initializer based only on a name. Layer widths, nonlinearities, residual scaling, and normalization all affect the relevant signal propagation.
