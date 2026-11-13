# 02. Algebra, functions, notation, and proof habits

[Previous](01-scientific-python.md) · [Course index](../README.md) · [Next](03-vectors-matrices.md)

## Reading an equation as a sentence

The first obstacle in ML mathematics is often notation. Consider

$$\widehat R(\theta)=\frac1n\sum_{i=1}^n \ell(f_\theta(x_i),y_i).$$

Read from inside outward. $x_i$ is input number $i$. The model turns it into $f_\theta(x_i)$. The loss $\ell$ compares that prediction with target $y_i$. The summation adds all $n$ comparisons. Division by $n$ gives an average. A hat marks an estimate computed from a finite sample. This equation defines empirical risk; it does not yet prescribe how to minimize it.

A subscript may index an observation, a feature, or time. Its meaning must be declared. Use $x_{ij}$ for feature $j$ of observation $i$, and $\theta_j$ for its weight. Then $\sum_j x_{ij}\theta_j$ uses all features of one observation. Swapping $i$ and $j$ without changing the definition changes the computation.

## Functions, domains, and inverse reasoning

A function maps each permitted input to one output. The real logarithm has domain $(0,\infty)$. An equation containing $\log p$ therefore requires $p>0$, or a carefully defined limiting convention in an expression such as $0\log 0$. Square roots over the reals require nonnegative arguments. A probability must remain between zero and one.

An inverse exists on a domain when the mapping is one-to-one there and reaches the intended output domain. Squaring is not invertible on all real numbers: both 2 and -2 square to 4. Restricting to nonnegative inputs gives the usual square-root inverse. Similarly a matrix need not have an inverse, and “divide by a matrix” is not a general algebraic operation.

Exponentials turn sums into products: $e^{a+b}=e^ae^b$. Logarithms reverse that operation: $\log(ab)=\log a+\log b$ for positive $a,b$. These identities explain why likelihood products become sums of log probabilities. Since log is increasing, maximizing a positive likelihood and maximizing its logarithm select the same maximizers.

## Transforming an expression carefully

Let $J(w)=(2w-3)^2$. Expanding gives $4w^2-12w+9$. Completing the square returns $4(w-3/2)^2$. Both forms describe the same function, but reveal different information. The expanded form helps differentiation. The completed-square form proves that the smallest possible value is zero, achieved at $w=3/2$.

An equality is stronger than an approximation. Write $f(x+h)\approx f(x)+hf'(x)$ when ignoring higher-order terms. Write equality only if the remainder is included or the function makes the approximation exact. ML derivations often become confusing when an approximation quietly changes into an equality.

## Assumptions and proofs

A theorem has hypotheses and a conclusion. For example, if $a_i\ge0$ and $\sum_i a_i=1$, then a weighted average $\sum_i a_i z_i$ lies between the smallest and largest $z_i$. To prove the upper bound, let $M=\max_i z_i$. Each $z_i\le M$, multiplication by a nonnegative $a_i$ preserves the inequality, and summing gives $\sum_i a_iz_i\le M\sum_i a_i=M$. The lower bound follows the same way.

This proof will explain attention outputs and convex combinations. Negative weights break the argument: $2(3)-1(1)=5$ exceeds both 1 and 3 although the weights sum to one. The nonnegativity hypothesis was necessary.

To disprove a universal claim, one counterexample suffices. “Every stationary point is a minimum” fails for $f(x)=-x^2$ at zero. To prove a universal claim, testing thousands of examples is insufficient. Numerical experiments are valuable checks, but should be labeled as such.

## Implementation bridge

```python
import numpy as np
values = np.array([1., 3., 8.])
weights = np.array([0.2, 0.5, 0.3])
assert np.all(weights >= 0) and np.isclose(weights.sum(), 1)
answer = weights @ values
assert values.min() <= answer <= values.max()
print(answer)  # 4.1
```

The assertion tests this instance of a proved statement. It does not replace the proof. `np.isclose` acknowledges finite-precision rounding; exact floating-point equality is usually inappropriate for calculated sums. The integer identity $2+2=4$ and a computed approximation to a real logarithm do not require the same testing strategy.

When reading later derivations, annotate each step with one reason: substitution, expansion, linearity, a domain condition, an approximation, or an invoked theorem. If no reason can be supplied, the missing bridge deserves investigation.
