# 56. Reward modeling, preference optimization, and reinforcement fine tuning

[Previous](55-rl-policy-gradients.md) · [Course index](../README.md) · [Next](57-recommendation-anomaly-semisupervised.md)

## Feedback needs its own measurement model

Supervised fine-tuning imitates desired target sequences. Reinforcement fine-tuning optimizes a reward or verifier using samples from a policy. Preference optimization uses comparisons between responses under a specified objective. Low-rank adaptation specifies which parameters can change and can be used with either supervised or reinforcement objectives; it is not an alternative on the same axis as PPO or GRPO.

For a pairwise reward model with preferred response $y^+$ and rejected response $y^-$, the Bradley-Terry probability is $\sigma(r(x,y^+)-r(x,y^-))$. Fit the negative log probability. A learned reward can reflect annotation artifacts and be exploited by optimization. A programmatic grader can also be incomplete, gameable, or correlated with a narrow training set.

For a KL-regularized policy objective $E_\pi[r]-\beta D_{KL}(\pi\|\pi_{ref})$, optimizing over a finite response distribution with support in the reference yields $\pi^*(y)\propto\pi_{ref}(y)e^{r(y)/\beta}$. Substitute this relation into a preference model to motivate DPO under its assumptions. DPO is a particular preference objective; its derivation does not prove equivalence to every online reward-optimization pipeline.

## Reward, preference, and verifiable-feedback derivations
## Preferences are observations, rewards are a model

A preference dataset may contain a prompt $x$, chosen response $y_w$, and rejected response $y_l$. A reward model assigns scalar score $r_\phi(x,y)$. A Bradley-Terry model predicts the chosen response wins with probability $\sigma(r_w-r_l)$. Minimize $-\log\sigma(r_w-r_l)$. The scale and meaning of the reward depend on data and model assumptions.

Adding any prompt-dependent constant to all responses' rewards leaves pairwise probabilities unchanged because it cancels in the difference. Absolute reward zero is therefore not identified by this pairwise objective. Cyclic, noisy, or context-dependent preferences can violate the simple scalar-ranking model.

## KL-regularized optimization

For one prompt and finite response set, maximize $\sum_y\pi(y)r(y)-\beta\sum_y\pi(y)\log[\pi(y)/\pi_{\rm ref}(y)]$, with $\beta>0$, normalized $\pi$, and reference support covering candidate responses. Introduce a Lagrange multiplier for $\sum_y\pi(y)=1$. Differentiating with respect to $\pi(y)$ gives

$$r(y)-\beta\left(\log\frac{\pi(y)}{\pi_{\rm ref}(y)}+1\right)+\lambda=0.$$

Rearrange and normalize to obtain

$$\pi^*(y)=\frac{\pi_{\rm ref}(y)e^{r(y)/\beta}}{\sum_{y'}\pi_{\rm ref}(y')e^{r(y')/\beta}}.$$

This is an exact finite-set result. Neural policies may not represent it exactly, and practical optimization may not find it. A larger $\beta$ penalizes deviation more strongly under this convention.

## A training pipeline with separate responsibilities

A common RLHF design first performs supervised instruction tuning, fits a reward model on preferences, then optimizes a policy with a reference penalty. PPO is one possible optimizer. The old policy used for PPO ratios and the fixed reference used for alignment regularization play different roles.

Sequence KL decomposes into expected token log-ratios under the policy when prefixes and sampling are handled consistently. A single response's log-ratio can be negative even though expected KL is nonnegative. An individual sampled penalty is therefore not itself a nonnegative divergence.

## Reward optimization can exploit errors

A reward model is reliable only over a measured distribution. Strong optimization may discover outputs that score highly without satisfying the intended task. Monitor independent human or task-grounded evaluations, length effects, style preference, and out-of-distribution behavior. Increasing reward alone is not sufficient evidence of improvement.

The example calculates the closed-form optimum over three responses and checks it against nearby distributions. It also checks that adding a constant to rewards leaves the optimum unchanged. This clarifies the role of the normalizer before introducing direct preference optimization.

### Rewrite the regularized objective as a KL gap

Let $\pi^*(y)=\pi_{\rm ref}(y)e^{r(y)/\beta}/Z$. Taking logs gives $\log[\pi(y)/\pi^*(y)]=\log[\pi(y)/\pi_{\rm ref}(y)]-r(y)/\beta+\log Z$. Multiply by $\pi(y)$ and sum. Rearranging yields $\mathbb E_\pi r-\beta KL(\pi\Vert\pi_{\rm ref})=\beta\log Z-\beta KL(\pi\Vert\pi^*)$. Nonnegativity of KL proves the displayed optimum globally over the finite simplex, with equality at $\pi=\pi^*$. This is stronger than checking a few neighboring distributions numerically.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import softmax
reference = np.array([.5, .3, .2])
reward = np.array([0., 1., .4])
beta = .7
optimum = softmax(np.log(reference)+reward/beta)
def objective(policy):
    return policy @ reward-beta*np.sum(policy*np.log(policy/reference))
assert np.allclose(optimum, softmax(np.log(reference)+(reward+5)/beta))
for epsilon in [-.02, .02]:
    nearby = optimum+np.array([epsilon, -epsilon, 0.])
    assert objective(optimum) >= objective(nearby)
print('optimal policy', optimum, 'objective', objective(optimum))

```

### Code structure and observed intermediate values


#### Stage 3

```python
reference = np.array([.5, .3, .2])
```

An observed state during this stage was:

- `reference`: `[0.5 0.3 0.2]`

#### Stage 4

```python
reward = np.array([0., 1., .4])
```

An observed state during this stage was:

- `reward`: `[0.  1.  0.4]`

#### Stage 5

```python
beta = .7
```

An observed state during this stage was:

- `beta`: `0.7`

#### Stage 6

```python
optimum = softmax(np.log(reference)+reward/beta)
```

An observed state during this stage was:

- `optimum`: `[0.23742 0.59441 0.16817]`

#### Stage 7

```python
def objective(policy):
    return policy @ reward-beta*np.sum(policy*np.log(policy/reference))
```

#### Stage 8

```python
assert np.allclose(optimum, softmax(np.log(reference)+(reward+5)/beta))
```

#### Stage 9

```python
for epsilon in [-.02, .02]:
    nearby = optimum+np.array([epsilon, -epsilon, 0.])
    assert objective(optimum) >= objective(nearby)
```

An observed state during this stage was:

- `nearby`: `[0.25742 0.57441 0.16817]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 10

```python
print('optimal policy', optimum, 'objective', objective(optimum))
```

Run from the course root:

```bash
python code/neural/37_reward_modeling_rlhf.py
```

### Recorded output from the supplied environment

```text
optimal policy [0.23741925 0.59441242 0.16816833] objective 0.5213463612147314
```

## Eliminate a fitted reward under a specific model

The previous lesson derived $\pi^*(y\mid x)\propto\pi_{\rm ref}(y\mid x)e^{r(x,y)/\beta}$. Taking logarithms and rearranging gives $r(x,y)=\beta\log[\pi^*(y\mid x)/\pi_{\rm ref}(y\mid x)]+\beta\log Z(x)$. For two responses to the same prompt, the unknown prompt-only normalizer cancels.

Assume a Bradley-Terry preference likelihood based on the reward difference. Substitute the policy-ratio reward parameterization. With

$$\Delta=\log\pi_\theta(y_w\mid x)-\log\pi_\theta(y_l\mid x)-\log\pi_{\rm ref}(y_w\mid x)+\log\pi_{\rm ref}(y_l\mid x),$$

the DPO loss is $L=-\log\sigma(\beta\Delta)$. This derivation relies on the KL-regularized reward model and preference assumptions. It is not a universal equivalence between every RL objective and every pairwise classifier.

## Differentiate and interpret the pressure

Using $-\log\sigma(u)=\log(1+e^{-u})$, the derivative is $dL/d\Delta=-\beta\sigma(-\beta\Delta)$. A badly ordered pair has a larger-magnitude correcting gradient. The objective increases the chosen response's relative log-probability over the rejected response, after accounting for the reference.

A response log-probability is a sum over its generated tokens, excluding prompt tokens and padding. Replacing that sum with a length average changes the objective and its reward interpretation. Length effects are real, but they should be handled explicitly rather than by silently changing the formula.

## The reference matters

The reference provides a baseline for the policy's relative preference. It should be frozen under ordinary DPO training. If both chosen and rejected probabilities move, the loss depends on their difference relative to that baseline; it does not require the chosen response's absolute probability to increase on every update.

DPO avoids an online rollout-and-reward-model stage in its standard offline form, but still depends on coverage and quality of preference data. Distribution shift, label noise, contradictory preferences, and overoptimization can cause problems. Compare held-out task performance and retained capabilities, not only training pair accuracy.

## Related objectives are not interchangeable names

IPO, KTO, ORPO, and other preference objectives use different assumptions, losses, or data formats. Understand their actual equations before choosing one. A beta parameter can have different numerical meaning across formulations. Reusing a hyperparameter value without checking its definition is unsafe experimentally.

The experiment checks the scalar DPO derivative and demonstrates that a reference-adjusted preference can differ from a raw policy preference. It uses stored log-probabilities rather than a model wrapper so every sign is visible.

### Fit a preference policy end to end

The additional `code/alignment_training.py` experiment optimizes a three-response categorical policy with the exact DPO loss. The frozen reference probabilities are $(0.5,0.3,0.2)$, and response one is preferred to response zero. Every step computes policy log-softmax, forms the reference-adjusted margin, applies stable softplus to its negative, backpropagates, and updates logits. Response two has no direct preference label, but normalization couples its probability to the others. The printed decrease in pair loss verifies optimization of this objective; it is not evidence that the resulting policy answers natural-language questions.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
from core import finite_difference
beta = .4
policy_logp = np.array([-1.2, -1.8])
reference_logp = np.array([-1., -2.])
delta = policy_logp[0]-policy_logp[1]-reference_logp[0]+reference_logp[1]
def objective(value):
    return np.logaddexp(0, -beta*value[0])
analytic = -beta/(1+np.exp(beta*delta))
numeric = finite_difference(objective, np.array([delta]))[0]
assert np.allclose(analytic, numeric, atol=1e-7)
print('adjusted gap', delta, 'loss', objective(np.array([delta])), 'gradient', analytic)

```

### Code structure and observed intermediate values


#### Stage 3

```python
beta = .4
```

An observed state during this stage was:

- `beta`: `0.4`

#### Stage 4

```python
policy_logp = np.array([-1.2, -1.8])
```

An observed state during this stage was:

- `policy_logp`: `[-1.2 -1.8]`

#### Stage 5

```python
reference_logp = np.array([-1., -2.])
```

An observed state during this stage was:

- `reference_logp`: `[-1. -2.]`

#### Stage 6

```python
delta = policy_logp[0]-policy_logp[1]-reference_logp[0]+reference_logp[1]
```

An observed state during this stage was:

- `delta`: `-0.4`

#### Stage 7

```python
def objective(value):
    return np.logaddexp(0, -beta*value[0])
```

#### Stage 8

```python
analytic = -beta/(1+np.exp(beta*delta))
```

An observed state during this stage was:

- `analytic`: `-0.21596595`

#### Stage 9

```python
numeric = finite_difference(objective, np.array([delta]))[0]
```

An observed state during this stage was:

- `numeric`: `-0.21596595`

#### Stage 10

```python
assert np.allclose(analytic, numeric, atol=1e-7)
```

#### Stage 11

```python
print('adjusted gap', delta, 'loss', objective(np.array([delta])), 'gradient', analytic)
```

Run from the course root:

```bash
python code/neural/38_dpo_preference_optimization.py
```

### Recorded output from the supplied environment

```text
adjusted gap -0.3999999999999999 loss 0.7763437730407396 gradient -0.21596595382222628
```

## Relative feedback within a prompt

For a prompt, sample a group of responses and assign rewards $R_1,\ldots,R_G$. A common group-relative advantage is $A_i=(R_i-\overline R)/(s_R+\epsilon)$, with a stated standard-deviation convention. This avoids learning a separate value model in that design, but the group statistic is still an estimator with its own finite-sample behavior.

If rewards are $(0,0,1,1)$, the population mean is $0.5$ and population standard deviation is $0.5$, so normalized advantages are approximately $(-1,-1,1,1)$. If every reward is identical, centered advantages are zero. A prompt on which every sampled response fails may therefore supply no relative task gradient under this rule, although other regularizers may remain active.

## Relate the update to PPO carefully

A GRPO-style objective can use old-policy importance ratios, clipped surrogates, and a reference-policy KL term with group-derived advantages. Token versus sequence reduction, response-length weighting, group normalization, and KL estimators vary between methods. 'GRPO' alone does not specify all those choices. Read the actual algorithm and implementation configuration before reproducing a result.

A group mean includes each response's own reward. For iid samples without normalization, centering by this mean introduces a finite-group factor in a simple score-function expectation: the expected centered estimator is $(1-1/G)$ times the uncentered reward gradient. A leave-one-out baseline avoids that particular self-inclusion effect under its assumptions. Division by random standard deviation introduces further behavior.

## What verifiability buys and what it does not

An exact arithmetic checker or executable test can provide reliable feedback for a specified condition. It may still be incomplete. Code can overfit visible tests; mathematical answers can have correct final values and invalid reasoning; parsers can accept unintended formats. Reward coverage determines what is optimized.

Separate answer correctness, formatting, and process constraints. Track reward hacking, answer extraction failures, pass rates under independent tests, and performance outside the rewarded domain. More optimization against a narrow checker does not prove broad reasoning improvement.

## A bounded numerical experiment

The code normalizes groups with both mixed and constant rewards, verifies zero mean, and computes a clipped policy surrogate. It explicitly uses population standard deviation with `ddof=0`. It does not implement a production rollout service or make a claim about the quality of generated explanations.

Optional application: compare groups of size two and eight under the same Bernoulli reward rate. Count how often every reward is equal. This quantifies how frequently a relative-only signal disappears for that sampling problem.

### Quantify all-equal reward groups

With independent Bernoulli success probability $p$ and group size $G$, all rewards are equal when either every response fails or every response succeeds. The probability is $(1-p)^G+p^G$. For $p=0.1,G=4$, it is $0.9^4+0.1^4=0.6562$. Thus most groups in this example carry no centered relative reward signal. Increasing group size changes this probability but also sampling cost. Curriculum choice, prompt difficulty, and alternative baselines can matter as much as the clipping equation when designing a practical relative-reward learner.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
def group_advantage(rewards):
    rewards = np.asarray(rewards, dtype=float)
    return (rewards-rewards.mean())/(rewards.std(ddof=0)+1e-8)
mixed = group_advantage([0, 0, 1, 1])
constant = group_advantage([0, 0, 0, 0])
assert np.allclose(mixed.mean(), 0)
assert np.allclose(constant, 0)
ratio = np.array([.9, 1.1, 1.3, .8])
surrogate = np.minimum(ratio*mixed, np.clip(ratio, .8, 1.2)*mixed)
print('mixed advantages', mixed, 'constant', constant, 'surrogate', surrogate.mean())

```

### Code structure and observed intermediate values


#### Stage 2

```python
def group_advantage(rewards):
    rewards = np.asarray(rewards, dtype=float)
    return (rewards-rewards.mean())/(rewards.std(ddof=0)+1e-8)
```

#### Stage 3

```python
mixed = group_advantage([0, 0, 1, 1])
```

An observed state during this stage was:

- `mixed`: `[-1. -1.  1.  1.]`

#### Stage 4

```python
constant = group_advantage([0, 0, 0, 0])
```

An observed state during this stage was:

- `constant`: `[0. 0. 0. 0.]`

#### Stage 5

```python
assert np.allclose(mixed.mean(), 0)
```

#### Stage 6

```python
assert np.allclose(constant, 0)
```

#### Stage 7

```python
ratio = np.array([.9, 1.1, 1.3, .8])
```

An observed state during this stage was:

- `ratio`: `[0.9 1.1 1.3 0.8]`

#### Stage 8

```python
surrogate = np.minimum(ratio*mixed, np.clip(ratio, .8, 1.2)*mixed)
```

An observed state during this stage was:

- `surrogate`: `[-0.9 -1.1  1.2  0.8]`

#### Stage 9

```python
print('mixed advantages', mixed, 'constant', constant, 'surrogate', surrogate.mean())
```

Run from the course root:

```bash
python code/neural/39_grpo_verifiable_rewards.py
```

### Recorded output from the supplied environment

```text
mixed advantages [-0.99999998 -0.99999998  0.99999998  0.99999998] constant [0. 0. 0. 0.] surrogate 0.0
```
## Actual sequence-level learning bridge

Run `python code/neural/sequence_alignment.py` to train a tiny decoder with supervised examples and then a preference objective using its sequence log probabilities. This is a complete local learning pipeline at educational scale. Distinguish its sampled tiny responses from a claim that a large model was aligned or that its reward reflects broad human values.
