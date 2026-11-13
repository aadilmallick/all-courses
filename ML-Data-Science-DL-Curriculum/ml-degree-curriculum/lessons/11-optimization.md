# 11. Convexity, gradient descent, stochastic optimization, and Adam

[Previous](10-information-losses.md) · [Course index](../README.md) · [Next](12-learning-theory.md)

## The objective is not the optimizer

An objective states what we want. An optimizer specifies how parameters change. For a differentiable scalar $J(w)$, gradient descent uses $w_{t+1}=w_t-\eta\nabla J(w_t)$. The learning rate $\eta$ controls the step size. Backpropagation computes a gradient; gradient descent uses it. They are different operations.

A function is convex if $J(\lambda u+(1-\lambda)v)\le\lambda J(u)+(1-\lambda)J(v)$ for $\lambda\in[0,1]$. For differentiable convex functions, every tangent plane is a global lower bound: $J(v)\ge J(u)+\nabla J(u)^\top(v-u)$. Thus a zero gradient proves global optimality. Neural-network objectives are generally nonconvex, so the same conclusion does not follow there.

## A convergence calculation you can trace

Take $J(w)=\tfrac12 aw^2$, $a>0$. Its gradient is $aw$, so $w_{t+1}=(1-\eta a)w_t$. Repeating yields $w_t=(1-\eta a)^tw_0$. Convergence to zero requires $|1-\eta a|<1$, equivalently $0<\eta<2/a$. If $a=4$ and $\eta=0.1$, the factor is 0.6. If $\eta=0.6$, it is -1.4 and magnitudes grow while signs alternate.

For a positive-definite quadratic with Hessian $H$, each eigen-direction behaves similarly, with its eigenvalue replacing $a$. The largest eigenvalue limits the stable learning rate; a small eigenvalue slows progress in a flat direction. Feature scaling and preconditioning can improve this geometry without changing the target problem's meaning.

## Smoothness gives a local improvement bound

If the gradient is L-Lipschitz, the descent lemma gives

$$J(w+v)\le J(w)+\nabla J(w)^\top v+\tfrac L2\|v\|^2.$$

Substitute $v=-\eta\nabla J(w)$ to obtain a decrease of at least $(\eta-L\eta^2/2)\|\nabla J(w)\|^2$ when $0<\eta<2/L$. The guarantee needs the smoothness hypothesis. A kinked objective, changing stochastic batch, or incorrect gradient does not automatically satisfy this proof.

## Stochastic estimates

For $J(w)=\frac1n\sum_i\ell_i(w)$, uniformly sampling an example gives an unbiased estimate $\nabla\ell_i(w)$ under differentiability and appropriate interchange conditions. A minibatch averages several estimates and generally reduces variance. Sampling examples with unequal probabilities changes the expectation unless the weights are corrected. An epoch is a pass through the chosen training set; an optimizer step is one parameter update.

Momentum uses $v_t=\beta v_{t-1}+g_t$ and $w_{t+1}=w_t-\eta v_t$ in one common convention. It aggregates past gradients. Adam maintains exponential averages $m_t=\beta_1m_{t-1}+(1-\beta_1)g_t$ and $v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2$, corrects their initial bias using $1-\beta_1^t$ and $1-\beta_2^t$, then divides the first by the square root of the second plus a stabilizer. These are coordinatewise operations, not a full inverse Hessian.

AdamW applies weight decay separately from the adaptive gradient transformation. Adding an L2 penalty to the loss is generally not equivalent to decoupled decay under an adaptive optimizer. Record the precise update rather than treating every regularization parameter with the same name as identical.

## Stopping and debugging

A decreasing training loss is useful evidence, but does not demonstrate generalization. A tiny gradient can mean convergence, saturation, incorrect detachment, or severe numerical underflow. Inspect gradient norms, parameter changes, small-subset fitting, and validation curves. Early stopping selects a parameter state using validation data and therefore belongs inside the model-selection protocol.

```python
w=3.0
for step in range(6):
    loss=2*w*w
    gradient=4*w
    print(step,round(w,6),round(loss,6))
    w -= 0.1*gradient
```

Each parameter value is 0.6 times the preceding one. This deterministic trace is a direct check of the quadratic analysis before we move to minibatch noise and larger models.


## Newton's method and constraints

A quadratic local approximation is $J(w+\Delta)\approx J(w)+g^\top\Delta+\Delta^\top H\Delta/2$. If $H$ is positive definite, differentiating the approximation gives $H\Delta=-g$. Solve this system rather than explicitly invert $H$. For a truly quadratic objective, the step reaches its minimizer in one iteration when the Hessian is nonsingular. For a general objective, damping and line search can be necessary; an indefinite Hessian need not provide a descent direction.

For an inequality constraint $g_j(w)\le0$, a Lagrangian adds $\lambda_jg_j(w)$ with $\lambda_j\ge0$. Stationarity, primal feasibility, dual feasibility, and complementary slackness $\lambda_jg_j(w)=0$ are KKT conditions. Under suitable convexity and constraint qualifications they characterize optimality; they are not unconditional sufficiency rules for arbitrary nonconvex problems. The SVM dual later uses these conditions in a concrete convex setting.

Projected gradient descent takes an unconstrained step then projects onto a feasible convex set. For a probability simplex this is a geometric projection problem, not simply clipping negatives and renormalizing in every norm. Choose an update whose mathematical constraint handling matches the intended objective.
