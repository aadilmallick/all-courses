# Optimizing a policy: likelihood ratios, critics, GAE, and PPO

## The samples depend on the thing we are changing

A policy chooses actions using probabilities determined by its parameters. If we change those parameters, we change which trajectories are likely. We cannot differentiate an expected reward by pretending the sampled actions were drawn from a distribution unrelated to the parameters. The likelihood-ratio derivation accounts for that dependence.

We will first derive a gradient for a two-action bandit whose exact expected reward is known. Then we introduce a critic to estimate future returns and a weighted advantage estimate. Finally, PPO limits some of the pressure from reusing an old rollout. Each step addresses a practical difficulty while retaining a clear mathematical target.

## Policy gradients and REINFORCE from the likelihood ratio

### Differentiate an expectation whose samples depend on parameters

Let trajectory $\tau$ have probability $p_\theta(\tau)$ and return $R(\tau)$ independent of $\theta$ once the trajectory is fixed. The objective is $J(\theta)=\sum_\tau p_\theta(\tau)R(\tau)$. Assuming differentiation and summation can be interchanged,

$$\nabla J=\sum_\tau p_\theta(\tau)R(\tau)\nabla\log p_\theta(\tau)
=\mathbb E[R(\tau)\nabla\log p_\theta(\tau)].$$

The identity uses $\nabla p=p\nabla\log p$ on positive-probability trajectories. If environment transitions and the initial distribution do not depend on policy parameters, only policy factors contribute to the log derivative. Thus $\nabla\log p_\theta(\tau)=\sum_t\nabla\log\pi_\theta(a_t\mid s_t)$.

### Remove irrelevant past rewards

An action cannot affect rewards already received. Conditional-expectation arguments permit using reward-to-go instead of total episode reward for each action. This reduces variance without changing the expected gradient under the stated sampling assumptions.

A state baseline $b(s)$ also leaves the expected score gradient unchanged:

$$\sum_a\pi(a\mid s)b(s)\nabla\log\pi(a\mid s)
=b(s)\nabla\sum_a\pi(a\mid s)=0.$$

The baseline must be independent of the sampled action conditional on state for this elementary argument. In an autodiff surrogate, return and baseline targets are usually detached so the policy update differentiates only the intended log-probability term.

### A two-action derivation

Let action one have probability $p=\sigma(\theta)$ and expected reward $0.8$, while action zero has reward mean $0.2$. Expected reward is $J=0.2+0.6p$, giving derivative $0.6p(1-p)$. The score derivative for sampled binary action $a$ is $a-p$. Therefore $R(a-p)$ is an unbiased gradient estimator. Its individual samples can be noisy even though its mean has the correct sign.

Gradient ascent maximizes reward. Most optimizers minimize a loss, so use negative log-probability times advantage. A sign error trains away from the rewarded behavior. Entropy bonuses encourage exploration but also change the optimized objective.

The experiment compares a large Monte Carlo mean with the exact bandit gradient. The tolerance accounts for sampling noise. It separately prints a baseline estimator to show variance reduction can be measured rather than assumed.

For LLMs, a response log-probability is a sum of token log-probabilities conditional on its prefixes. The same score identity applies, while reward definition, sampling cost, and long-horizon credit assignment become the hard practical questions.

#### Derive the softmax policy score for any action count

For logits $z$ and action $a$, $\log\pi(a)=z_a-\log\sum_j e^{z_j}$. Therefore $\partial\log\pi(a)/\partial z_k=\mathbf1[k=a]-\pi(k)$. Multiply this vector by a fixed return or advantage to get a sampled ascent direction. Summing the components gives zero, consistent with invariance to a common logit shift. In the two-action sigmoid parameterization with only the action-one logit free, the score reduces to $a-p$. This connects the bandit code to the general categorical policy derivative.


## Recover the bandit derivative from two routes

Let action one have mean reward 0.8 and action zero have mean reward 0.2. With $p=\sigma(\theta)$, expected reward is $J=0.2+0.6p$. Direct differentiation gives $0.6p(1-p)$. At theta zero, $p=1/2$ and the derivative is 0.15. A positive ascent step increases the probability of the better arm.

Now enumerate sampled score contributions. Action one has score $1-p$ and occurs with probability $p$; action zero has score $-p$ and occurs with probability $1-p$. Expected reward-weighted score is $p\cdot0.8(1-p)+(1-p)\cdot0.2(-p)=0.6p(1-p)$. This independently recovers the same derivative and explains why a noisy sample can estimate it.


### Executable calculation

Run `python examples/34_policy_gradients.py` from the package root. Complete source is also included as [34_policy_gradients.py](../examples/34_policy_gradients.py).

```python
import numpy as np
rng = np.random.default_rng(34)
theta = 0.3
p = 1/(1+np.exp(-theta))
action = rng.random(100000) < p
mean_reward = np.where(action, .8, .2)
reward = (rng.random(len(action)) < mean_reward).astype(float)
score = action.astype(float)-p
estimate = np.mean(reward*score)
exact = .6*p*(1-p)
baseline = .2+.6*p
centered = (reward-baseline)*score
assert abs(estimate-exact) < .005
print('Monte Carlo', estimate, 'exact', exact, 'variances', np.var(reward*score), np.var(centered))
```

Recorded output on the checked Python/NumPy environment:

```text
Monte Carlo 0.14605710447693573 exact 0.1466749870144475 variances 0.08994359562735979 0.0411855864061244
```


## A baseline changes variance without changing the elementary expected gradient

For a baseline independent of the sampled action conditional on state, the expected baseline times policy score is zero. That is because action probabilities sum to one and the derivative of one is zero. This cancellation is a mathematical condition, not a license to subtract any learned quantity with unrestricted gradient flow.

In an autodiff implementation, hold sampled returns and the chosen advantage target fixed during the actor update unless the algorithm explicitly derives another objective. Letting the actor change a target through its own gradient can create a different optimization problem. The critic has its own regression objective and update path.

## Actor-critic learning and generalized advantage estimation

### Separate action selection from return prediction

The actor is a policy. The critic estimates a value used to reduce variance or bootstrap future returns. Advantage is $A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)$, measuring how an action compares with the policy's average at that state. A high-return state can still contain a negative-advantage action.

A sampled TD residual is $\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$, with terminal bootstrap zero. If the critic is exact, the residual is a noisy estimate of action advantage. An imperfect critic introduces estimation error that depends on its fit and the sampling distribution.

### Derive the GAE recursion

Generalized advantage estimation combines future TD residuals:

$$\widehat A_t=\sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}.$$

Separate the first residual and factor $\gamma\lambda$ from the rest to obtain $\widehat A_t=\delta_t+\gamma\lambda\widehat A_{t+1}$. Compute this backward, resetting propagation at terminal boundaries. This is a weighted sum of residuals, not a new Bellman equation for the true value function.

When $\lambda=0$, use a one-step residual. When $\lambda=1$ over a truly terminated rollout, the sum telescopes to sampled return minus $V(s_t)$. To see it, expand the value terms: each $+\gamma^{l+1}V(s_{t+l+1})$ cancels the next $-\gamma^{l+1}V(s_{t+l+1})$. At a truncated rollout, a final bootstrap remains.

### Build targets without accidental gradient paths

A common critic target is $\widehat R_t=\widehat A_t+V_{\text{old}}(s_t)$. Fit the new critic to this fixed target with squared error. The actor uses fixed advantages in its policy surrogate. Letting gradients flow through the advantage computation changes the objective and can let the policy manipulate its own training target.

Advantage normalization subtracts the batch mean and divides by a batch standard deviation plus epsilon. It can stabilize numerical scale but changes finite-sample behavior and interacts with grouping and padding. Constant advantages have zero centered signal; be deliberate about whether that is desired.

### Numerical trace

The example computes residuals and a backward GAE recursion for a three-step terminal episode, then checks the $\lambda=1$ telescoping identity against directly computed returns. It keeps the final state's value zero and records terminal status explicitly.

A critic can become more accurate under its regression metric without producing a better policy if the sampled distribution, rewards, or actor update are unsuitable. Track actor reward and held-out task behavior alongside critic loss and explained variance.

#### Expand a two-step GAE estimate

For residuals $\delta_0,\delta_1$ in a terminal two-step episode, $A_0=\delta_0+\gamma\lambda\delta_1$ and $A_1=\delta_1$. Substitute $\delta_0=r_0+\gamma V_1-V_0$ and $\delta_1=r_1-V_1$ to get $A_0=r_0+\gamma\lambda r_1-V_0+\gamma(1-\lambda)V_1$. At $\lambda=1$, the intermediate value cancels and the estimate is sampled return minus initial value. At $\lambda=0$, only the one-step bootstrap remains. The expansion shows exactly where critic error enters as lambda changes.


## Compute a two-step advantage with visible values

Let rewards be zero then one, value estimates be 0.2 and 0.4, terminal value zero, and discount 0.9. Residuals are $\delta_0=0+0.9\cdot0.4-0.2=0.16$ and $\delta_1=1-0.4=0.6$. With lambda 0.95, $A_0=0.16+0.9\cdot0.95\cdot0.6=0.673$ and $A_1=0.6$.

With lambda one, the first advantage is 0.7, equal to discounted sampled return 0.9 minus initial value 0.2. With lambda zero, it is only 0.16 and depends heavily on the one-step critic estimate. This calculation makes the interpolation concrete without promising a universal best lambda.


### Executable calculation

Run `python examples/35_actor_critic_gae.py` from the package root. Complete source is also included as [35_actor_critic_gae.py](../examples/35_actor_critic_gae.py).

```python
import numpy as np
reward = np.array([0., 0., 1.])
value = np.array([.2, .3, .4, 0.])
gamma, lam = .9, .95
delta = reward+gamma*value[1:]-value[:-1]
def gae(parameter):
    output, running = np.zeros(3), 0.
    for index in range(2, -1, -1):
        running = delta[index]+gamma*parameter*running
        output[index] = running
    return output
returns, running = np.zeros(3), 0.
for index in range(2, -1, -1):
    running = reward[index]+gamma*running
    returns[index] = running
assert np.allclose(gae(1), returns-value[:-1])
print('TD residual', delta, 'GAE', gae(lam), 'return', returns)
```

Recorded output on the checked Python/NumPy environment:

```text
TD residual [0.07 0.06 0.6 ] GAE [0.559915 0.573    0.6     ] return [0.81 0.9  1.  ]
```


## Old policy, new policy, and reference policy have different jobs

The old policy supplied a rollout. The new policy is being optimized using it. An importance ratio compares their action probabilities at the sampled states. A reference policy used for alignment regularization is another object, often held fixed over a longer training period. Do not use one log-probability array for all three merely because the initial weights happened to agree.

A probability ratio corrects a specified sampling mismatch under support conditions. It does not automatically repair state-distribution changes, critic error, or unrestricted reuse of stale data. PPO's clipped surrogate is a practical objective designed around controlled updates; its properties need to be read from its actual piecewise formula.

## Importance weighting has a precise elementary justification

For a fixed state and function f of an action, an expectation under a new policy is $\sum_a\pi_{new}(a)f(a)$. If the old policy is positive wherever the new policy is positive, multiply and divide each term by the old probability. The sum becomes $\sum_a\pi_{old}(a)[\pi_{new}(a)/\pi_{old}(a)]f(a)$, an expectation under the old policy with a probability ratio. This is the basic importance-sampling identity.

If the old probability is zero for an action the new policy uses, this route cannot estimate its contribution from old samples. If old probabilities are extremely small, ratios can be large and sample estimates can have high variance. Clipping ratios changes the estimator or objective; it is not an algebraically exact continuation of the identity.

In sequential problems, state visitation also depends on the policy. A per-action ratio at sampled states does not by itself establish an exact full-trajectory objective under every update. PPO uses a particular surrogate and practical controls. Understanding the elementary identity helps us see both why ratios appear and why their presence is not a universal certificate of off-policy correctness.

The distinction between the old and reference policies follows the same discipline. The old policy defines the sampling distribution for an update. The reference defines a behavior baseline in a regularized objective. Their probabilities may begin equal but serve different mathematical roles, so implementations should preserve their identities separately.

## PPO, importance ratios, clipping, and KL monitoring

### Reuse a rollout without pretending the policy stayed fixed

Collect actions under an old policy $\pi_{\text{old}}$, then update parameters. The action probability ratio is $r_t(\theta)=\pi_\theta(a_t\mid s_t)/\pi_{\text{old}}(a_t\mid s_t)$. Compute it as $\exp(\log\pi_\theta-\log\pi_{\text{old}})$ for numerical convenience. Old log-probabilities and advantage targets are fixed during optimization.

The PPO clipped surrogate maximizes

$$L^{\text{clip}}=\mathbb E\left[\min(r_t\widehat A_t,\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)\widehat A_t)\right].$$

A minimization implementation negates this expression. A critic loss and entropy term may be added with explicit coefficients. Different implementations make different choices about value clipping and normalization.

### Work through both signs

Take $\epsilon=0.2$ and advantage $A=2$. At ratio $r=1.3$, the unclipped term is 2.6 and clipped term is 2.4, so the minimum is 2.4. Further increasing this action's probability supplies no additional surrogate benefit in that region.

Now take $A=-2$ and $r=0.7$. The unclipped term is -1.4 and clipped term is -1.6, so the minimum is -1.6. Further decreasing a bad action's probability past the lower bound likewise supplies no additional benefit. For a bad action whose probability increases, the unfavorable gradient remains active. Clipping is asymmetric because it limits improvement pressure, not all changes.

### Clipping is not a hard trust region

The objective does not constrain every action ratio or the full policy KL to a fixed bound. Ratios can move outside the clip range, including because parameters are shared across actions and examples. Monitor empirical KL, ratio distributions, clip fraction, entropy, reward, and critic behavior. Early stopping on a KL estimate is a separate control mechanism.

A sampled log-ratio statistic is not automatically an unbiased estimate of any chosen KL direction without the correct sampling distribution. State which policy supplied the samples. Keep reference-policy KL used in RLHF distinct from the old-policy ratio used to control one PPO update.

### Sequence models add masks and lengths

Token-level policy terms must exclude padding and prompt positions under the chosen objective. Terminal response rewards must be assigned under a documented return scheme. Averaging token terms versus averaging responses changes relative weight by response length.

The code prints surrogate values for positive and negative advantages and estimates derivatives away from clipping boundaries. It verifies the expected flat regions. At the boundary itself, the objective is piecewise differentiable and a finite difference can straddle two regions; do not use that as a smooth-gradient test.

#### A complete local PPO optimizer is included

Run `python code/alignment_training.py` from the course root. The bandit experiment collects actions under an old categorical policy, stores the old probabilities, computes fixed centered rewards, and performs several clipped-surrogate updates. Its derivative uses $rA(\mathbf1_a-\pi)$ only where the selected surrogate branch is active. At positive advantage and ratio above the upper boundary, the branch is flat; at negative advantage and ratio below the lower boundary, it is flat. The experiment reports exact expected bandit reward under the known simulator means, avoiding confusion with one noisy sampled batch.


## Differentiate the active branches

Away from boundaries, the unclipped term has derivative with respect to a selected action log-probability equal to ratio times advantage. Multiplying by the policy score gives a parameter update direction. In a clipped flat region, that selected surrogate term contributes zero through the ratio. The sign of advantage determines which side is flat.

Parameters are shared across actions and examples. An update motivated by another active term can still move a ratio that was already clipped. Therefore clipping is not a projection into a safe set of all policies. Monitor measured divergence, ratios, rewards, and failures in addition to the clipped objective.


### Executable calculation

Run `python examples/36_ppo.py` from the package root. Complete source is also included as [36_ppo.py](../examples/36_ppo.py).

```python
import numpy as np
def surrogate(ratio, advantage, epsilon=.2):
    return np.minimum(ratio*advantage, np.clip(ratio, 1-epsilon, 1+epsilon)*advantage)
ratios = np.array([.7, .9, 1., 1.1, 1.3])
print('positive', surrogate(ratios, 2.))
print('negative', surrogate(ratios, -2.))
def derivative(ratio, advantage):
    h = 1e-5
    return (surrogate(ratio+h, advantage)-surrogate(ratio-h, advantage))/(2*h)
assert np.allclose(derivative(1.3, 2.), 0)
assert np.allclose(derivative(.7, -2.), 0)
assert np.allclose(derivative(.9, 2.), 2)
print('active positive slope', derivative(.9, 2.))
```

Recorded output on the checked Python/NumPy environment:

```text
positive [1.4 1.8 2.  2.2 2.4]
negative [-1.6 -1.8 -2.  -2.2 -2.6]
active positive slope 1.9999999999908977
```


## Execute a complete policy improvement experiment

The additional `alignment_training.py` program contains a complete PPO-style bandit optimization loop. It collects a batch under the old policy, stores those probabilities, forms fixed centered reward advantages, and performs several surrogate updates. It then reports expected reward under the known simulator means. This final expectation is less noisy than the reward of one particular batch.

The companion's **Policy updates** experiment computes the bandit gradient, GAE values, and a PPO surrogate for visible advantage and ratio controls. Try a positive advantage above the upper clip limit, then a negative advantage below the lower limit. The displayed slope changes because a different mathematical branch is active. Reset restores all parameters without retaining hidden training state.

The code's centered advantages are fixed for each collected batch. Recomputing them after every parameter change from a newly sampled batch would define another training schedule. Neither schedule is identified by a loss formula alone. Record rollout collection, batch reuse, advantage estimation, and update counts together when reproducing a policy optimizer. These temporal choices determine which probabilities are old and how stale the observations become.

Stored old log-probabilities must correspond to the exact actions and states in the reused rollout.

We now have the optimization machinery needed to understand one family of LLM alignment methods. The next chapter asks where response rewards and preferences come from and derives how a KL-regularized reward problem leads to a direct pairwise policy loss.
