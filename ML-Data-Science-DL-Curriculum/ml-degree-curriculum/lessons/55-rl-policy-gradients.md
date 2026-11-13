# 55. Policy gradients, actor critic, advantage estimation, and PPO

[Previous](54-rl-values.md) · [Course index](../README.md) · [Next](56-reinforcement-finetuning.md)

## Optimize a distribution over actions

Let trajectory probability depend on policy parameters. Under suitable regularity, differentiate an expectation using $\nabla p=p\nabla\log p$. Environment factors independent of policy parameters drop out of the log derivative, leaving policy score terms multiplied by return. This derives a gradient estimator rather than treating sampled discrete actions as differentiable numbers.

A baseline depending on state but not the sampled action has zero expected score contribution: $\sum_a\pi(a\mid s)\nabla\log\pi(a\mid s)b(s)=b(s)\nabla\sum_a\pi(a\mid s)=0$. It can reduce variance without changing the expected policy gradient, subject to the stated treatment of baseline parameters. A learned baseline and finite samples introduce additional practical considerations.

## Policy gradient, actor critic, and PPO laboratories
## Differentiate an expectation whose samples depend on parameters

Let trajectory $\tau$ have probability $p_\theta(\tau)$ and return $R(\tau)$ independent of $\theta$ once the trajectory is fixed. The objective is $J(\theta)=\sum_\tau p_\theta(\tau)R(\tau)$. Assuming differentiation and summation can be interchanged,

$$\nabla J=\sum_\tau p_\theta(\tau)R(\tau)\nabla\log p_\theta(\tau)
=\mathbb E[R(\tau)\nabla\log p_\theta(\tau)].$$

The identity uses $\nabla p=p\nabla\log p$ on positive-probability trajectories. If environment transitions and the initial distribution do not depend on policy parameters, only policy factors contribute to the log derivative. Thus $\nabla\log p_\theta(\tau)=\sum_t\nabla\log\pi_\theta(a_t\mid s_t)$.

## Remove irrelevant past rewards

An action cannot affect rewards already received. Conditional-expectation arguments permit using reward-to-go instead of total episode reward for each action. This reduces variance without changing the expected gradient under the stated sampling assumptions.

A state baseline $b(s)$ also leaves the expected score gradient unchanged:

$$\sum_a\pi(a\mid s)b(s)\nabla\log\pi(a\mid s)
=b(s)\nabla\sum_a\pi(a\mid s)=0.$$

The baseline must be independent of the sampled action conditional on state for this elementary argument. In an autodiff surrogate, return and baseline targets are usually detached so the policy update differentiates only the intended log-probability term.

## A two-action derivation

Let action one have probability $p=\sigma(\theta)$ and expected reward $0.8$, while action zero has reward mean $0.2$. Expected reward is $J=0.2+0.6p$, giving derivative $0.6p(1-p)$. The score derivative for sampled binary action $a$ is $a-p$. Therefore $R(a-p)$ is an unbiased gradient estimator. Its individual samples can be noisy even though its mean has the correct sign.

Gradient ascent maximizes reward. Most optimizers minimize a loss, so use negative log-probability times advantage. A sign error trains away from the rewarded behavior. Entropy bonuses encourage exploration but also change the optimized objective.

The experiment compares a large Monte Carlo mean with the exact bandit gradient. The tolerance accounts for sampling noise. It separately prints a baseline estimator to show variance reduction can be measured rather than assumed.

For LLMs, a response log-probability is a sum of token log-probabilities conditional on its prefixes. The same score identity applies, while reward definition, sampling cost, and long-horizon credit assignment become the hard practical questions.

### Derive the softmax policy score for any action count

For logits $z$ and action $a$, $\log\pi(a)=z_a-\log\sum_j e^{z_j}$. Therefore $\partial\log\pi(a)/\partial z_k=\mathbf1[k=a]-\pi(k)$. Multiply this vector by a fixed return or advantage to get a sampled ascent direction. Summing the components gives zero, consistent with invariance to a common logit shift. In the two-action sigmoid parameterization with only the action-one logit free, the score reduces to $a-p$. This connects the bandit code to the general categorical policy derivative.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

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

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(34)
```

#### Stage 3

```python
theta = 0.3
```

An observed state during this stage was:

- `theta`: `0.3`

#### Stage 4

```python
p = 1/(1+np.exp(-theta))
```

An observed state during this stage was:

- `p`: `0.57444252`

#### Stage 5

```python
action = rng.random(100000) < p
```

An observed state during this stage was:

- `action`: `array shape=(100000,), min=0, max=1, norm=239.562`

#### Stage 6

```python
mean_reward = np.where(action, .8, .2)
```

An observed state during this stage was:

- `mean_reward`: `array shape=(100000,), min=0.2, max=0.8, norm=196.046`

#### Stage 7

```python
reward = (rng.random(len(action)) < mean_reward).astype(float)
```

An observed state during this stage was:

- `reward`: `array shape=(100000,), min=0, max=1, norm=233.27`

#### Stage 8

```python
score = action.astype(float)-p
```

An observed state during this stage was:

- `score`: `array shape=(100000,), min=-0.574443, max=0.425557, norm=156.377`

#### Stage 9

```python
estimate = np.mean(reward*score)
```

An observed state during this stage was:

- `estimate`: `0.1460571`

#### Stage 10

```python
exact = .6*p*(1-p)
```

An observed state during this stage was:

- `exact`: `0.14667499`

#### Stage 11

```python
baseline = .2+.6*p
```

An observed state during this stage was:

- `baseline`: `0.54466551`

#### Stage 12

```python
centered = (reward-baseline)*score
```

An observed state during this stage was:

- `centered`: `array shape=(100000,), min=-0.261563, max=0.312879, norm=79.1231`

#### Stage 13

```python
assert abs(estimate-exact) < .005
```

#### Stage 14

```python
print('Monte Carlo', estimate, 'exact', exact, 'variances', np.var(reward*score), np.var(centered))
```

Run from the course root:

```bash
python code/neural/34_policy_gradients.py
```

### Recorded output from the supplied environment

```text
Monte Carlo 0.14605710447693573 exact 0.1466749870144475 variances 0.08994359562735979 0.0411855864061244
```

## Separate action selection from return prediction

The actor is a policy. The critic estimates a value used to reduce variance or bootstrap future returns. Advantage is $A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)$, measuring how an action compares with the policy's average at that state. A high-return state can still contain a negative-advantage action.

A sampled TD residual is $\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$, with terminal bootstrap zero. If the critic is exact, the residual is a noisy estimate of action advantage. An imperfect critic introduces estimation error that depends on its fit and the sampling distribution.

## Derive the GAE recursion

Generalized advantage estimation combines future TD residuals:

$$\widehat A_t=\sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}.$$

Separate the first residual and factor $\gamma\lambda$ from the rest to obtain $\widehat A_t=\delta_t+\gamma\lambda\widehat A_{t+1}$. Compute this backward, resetting propagation at terminal boundaries. This is a weighted sum of residuals, not a new Bellman equation for the true value function.

When $\lambda=0$, use a one-step residual. When $\lambda=1$ over a truly terminated rollout, the sum telescopes to sampled return minus $V(s_t)$. To see it, expand the value terms: each $+\gamma^{l+1}V(s_{t+l+1})$ cancels the next $-\gamma^{l+1}V(s_{t+l+1})$. At a truncated rollout, a final bootstrap remains.

## Build targets without accidental gradient paths

A common critic target is $\widehat R_t=\widehat A_t+V_{\text{old}}(s_t)$. Fit the new critic to this fixed target with squared error. The actor uses fixed advantages in its policy surrogate. Letting gradients flow through the advantage computation changes the objective and can let the policy manipulate its own training target.

Advantage normalization subtracts the batch mean and divides by a batch standard deviation plus epsilon. It can stabilize numerical scale but changes finite-sample behavior and interacts with grouping and padding. Constant advantages have zero centered signal; be deliberate about whether that is desired.

## Numerical trace

The example computes residuals and a backward GAE recursion for a three-step terminal episode, then checks the $\lambda=1$ telescoping identity against directly computed returns. It keeps the final state's value zero and records terminal status explicitly.

A critic can become more accurate under its regression metric without producing a better policy if the sampled distribution, rewards, or actor update are unsuitable. Track actor reward and held-out task behavior alongside critic loss and explained variance.

### Expand a two-step GAE estimate

For residuals $\delta_0,\delta_1$ in a terminal two-step episode, $A_0=\delta_0+\gamma\lambda\delta_1$ and $A_1=\delta_1$. Substitute $\delta_0=r_0+\gamma V_1-V_0$ and $\delta_1=r_1-V_1$ to get $A_0=r_0+\gamma\lambda r_1-V_0+\gamma(1-\lambda)V_1$. At $\lambda=1$, the intermediate value cancels and the estimate is sampled return minus initial value. At $\lambda=0$, only the one-step bootstrap remains. The expansion shows exactly where critic error enters as lambda changes.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

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

### Code structure and observed intermediate values


#### Stage 2

```python
reward = np.array([0., 0., 1.])
```

An observed state during this stage was:

- `reward`: `[0. 0. 1.]`

#### Stage 3

```python
value = np.array([.2, .3, .4, 0.])
```

An observed state during this stage was:

- `value`: `[0.2 0.3 0.4 0. ]`

#### Stage 4

```python
gamma, lam = .9, .95
```

An observed state during this stage was:

- `gamma`: `0.9`
- `lam`: `0.95`

#### Stage 5

```python
delta = reward+gamma*value[1:]-value[:-1]
```

An observed state during this stage was:

- `delta`: `[0.07 0.06 0.6 ]`

#### Stage 6

```python
def gae(parameter):
    output, running = np.zeros(3), 0.
    for index in range(2, -1, -1):
        running = delta[index]+gamma*parameter*running
        output[index] = running
    return output
```

#### Stage 7

```python
returns, running = np.zeros(3), 0.
```

An observed state during this stage was:

- `returns`: `[0. 0. 0.]`
- `running`: `0`

#### Stage 8

```python
for index in range(2, -1, -1):
    running = reward[index]+gamma*running
    returns[index] = running
```

An observed state during this stage was:

- `returns`: `[0.81 0.9  1.  ]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 9

```python
assert np.allclose(gae(1), returns-value[:-1])
```

#### Stage 10

```python
print('TD residual', delta, 'GAE', gae(lam), 'return', returns)
```

Run from the course root:

```bash
python code/neural/35_actor_critic_gae.py
```

### Recorded output from the supplied environment

```text
TD residual [0.07 0.06 0.6 ] GAE [0.559915 0.573    0.6     ] return [0.81 0.9  1.  ]
```

## Reuse a rollout without pretending the policy stayed fixed

Collect actions under an old policy $\pi_{\text{old}}$, then update parameters. The action probability ratio is $r_t(\theta)=\pi_\theta(a_t\mid s_t)/\pi_{\text{old}}(a_t\mid s_t)$. Compute it as $\exp(\log\pi_\theta-\log\pi_{\text{old}})$ for numerical convenience. Old log-probabilities and advantage targets are fixed during optimization.

The PPO clipped surrogate maximizes

$$L^{\text{clip}}=\mathbb E\left[\min(r_t\widehat A_t,\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)\widehat A_t)\right].$$

A minimization implementation negates this expression. A critic loss and entropy term may be added with explicit coefficients. Different implementations make different choices about value clipping and normalization.

## Work through both signs

Take $\epsilon=0.2$ and advantage $A=2$. At ratio $r=1.3$, the unclipped term is 2.6 and clipped term is 2.4, so the minimum is 2.4. Further increasing this action's probability supplies no additional surrogate benefit in that region.

Now take $A=-2$ and $r=0.7$. The unclipped term is -1.4 and clipped term is -1.6, so the minimum is -1.6. Further decreasing a bad action's probability past the lower bound likewise supplies no additional benefit. For a bad action whose probability increases, the unfavorable gradient remains active. Clipping is asymmetric because it limits improvement pressure, not all changes.

## Clipping is not a hard trust region

The objective does not constrain every action ratio or the full policy KL to a fixed bound. Ratios can move outside the clip range, including because parameters are shared across actions and examples. Monitor empirical KL, ratio distributions, clip fraction, entropy, reward, and critic behavior. Early stopping on a KL estimate is a separate control mechanism.

A sampled log-ratio statistic is not automatically an unbiased estimate of any chosen KL direction without the correct sampling distribution. State which policy supplied the samples. Keep reference-policy KL used in RLHF distinct from the old-policy ratio used to control one PPO update.

## Sequence models add masks and lengths

Token-level policy terms must exclude padding and prompt positions under the chosen objective. Terminal response rewards must be assigned under a documented return scheme. Averaging token terms versus averaging responses changes relative weight by response length.

The code prints surrogate values for positive and negative advantages and estimates derivatives away from clipping boundaries. It verifies the expected flat regions. At the boundary itself, the objective is piecewise differentiable and a finite difference can straddle two regions; do not use that as a smooth-gradient test.

### A complete local PPO optimizer is included

Run `python code/neural/alignment_training.py` from the course root. The bandit experiment collects actions under an old categorical policy, stores the old probabilities, computes fixed centered rewards, and performs several clipped-surrogate updates. Its derivative uses $rA(\mathbf1_a-\pi)$ only where the selected surrogate branch is active. At positive advantage and ratio above the upper boundary, the branch is flat; at negative advantage and ratio below the lower boundary, it is flat. The experiment reports exact expected bandit reward under the known simulator means, avoiding confusion with one noisy sampled batch.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

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

### Code structure and observed intermediate values


#### Stage 2

```python
def surrogate(ratio, advantage, epsilon=.2):
    return np.minimum(ratio*advantage, np.clip(ratio, 1-epsilon, 1+epsilon)*advantage)
```

#### Stage 3

```python
ratios = np.array([.7, .9, 1., 1.1, 1.3])
```

An observed state during this stage was:

- `ratios`: `[0.7 0.9 1.  1.1 1.3]`

#### Stage 4

```python
print('positive', surrogate(ratios, 2.))
```

#### Stage 5

```python
print('negative', surrogate(ratios, -2.))
```

#### Stage 6

```python
def derivative(ratio, advantage):
    h = 1e-5
    return (surrogate(ratio+h, advantage)-surrogate(ratio-h, advantage))/(2*h)
```

#### Stage 7

```python
assert np.allclose(derivative(1.3, 2.), 0)
```

#### Stage 8

```python
assert np.allclose(derivative(.7, -2.), 0)
```

#### Stage 9

```python
assert np.allclose(derivative(.9, 2.), 2)
```

#### Stage 10

```python
print('active positive slope', derivative(.9, 2.))
```

Run from the course root:

```bash
python code/neural/36_ppo.py
```

### Recorded output from the supplied environment

```text
positive [1.4 1.8 2.  2.2 2.4]
negative [-1.6 -1.8 -2.  -2.2 -2.6]
active positive slope 1.9999999999908977
```
The additional `code/neural/alignment_training.py` trains a categorical bandit policy with a clipped PPO surrogate. Its scope is a bandit with exact small-state feedback, not a complete rollout-based control implementation. The surrogate's improvement is evidence about that local experiment and does not prove a hard bound on policy divergence.
