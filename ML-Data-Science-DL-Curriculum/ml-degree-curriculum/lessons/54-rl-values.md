# 54. Reinforcement learning, Bellman equations, and value based methods

[Previous](53-discrete-diffusion-language.md) · [Course index](../README.md) · [Next](55-rl-policy-gradients.md)

## Decisions change the future observations

In supervised learning the dataset is often treated as fixed. In reinforcement learning an agent's actions influence both rewards and future experience. A finite Markov decision process specifies states, actions, transitions, rewards, and a discount or finite-horizon objective. The Markov assumption says the modeled state contains the information needed for the transition distribution; raw observations may not satisfy it.

A return is $G_t=\sum_{k\ge0}\gamma^kr_{t+k+1}$ for a continuing discounted task. A terminal state ends the return. Truncating a continuing rollout for computational convenience does not necessarily mean the environment terminated. Bootstrapping conventions must reflect that distinction.

## Value learning and dynamic programming
## Predicting a label differs from choosing an action

In supervised learning, an example supplies a target. In reinforcement learning, an agent chooses an action, receives feedback, and may change what it observes next. A policy describes action selection. A reward describes a task signal. Neither a reward function nor a high measured reward is automatically a complete specification of what people want.

A bandit has actions and rewards without state transitions relevant to future decisions. An MDP adds states $s$, actions $a$, transition law $P(s'\mid s,a)$, reward distribution, initial-state distribution, and discount $\gamma$. The Markov assumption says the current state contains the information needed to predict the next state and reward given the action. A language prefix can be treated as a state, though practical summaries may lose relevant history.

## Define a return before optimizing it

For rewards $r_t$, define discounted return $G_t=\sum_{k=0}^{T-t-1}\gamma^kr_{t+k}$. With rewards $(1,0,2)$ and $\gamma=0.9$, $G_0=1+0.9\cdot0+0.9^2\cdot2=2.62$. The recursion is $G_t=r_t+\gamma G_{t+1}$, with terminal return zero. This follows by factoring one power of $\gamma$ from all terms after the first.

For infinite horizons and $0\le\gamma<1$, bounded rewards ensure the return converges absolutely. Finite-horizon tasks can use $\gamma=1$, but time may need to be included in the state if optimal behavior depends on remaining steps.

## Exploration creates information

A greedy bandit agent selects the largest estimated value and can become stuck after noisy initial feedback. Epsilon-greedy selects a random action with probability $\epsilon$ and otherwise exploits. UCB methods add an uncertainty bonus, while Thompson sampling samples plausible reward parameters. Each approach uses assumptions about stationarity and reward structure.

For sample mean $Q_n$ after $n$ observations, the update $Q_n=Q_{n-1}+(R_n-Q_{n-1})/n$ follows by expanding the new mean. Constant step sizes instead emphasize recent observations and can track drift, at the expense of not converging to the exact historical mean.

## A miniature experiment with a precise boundary

The code simulates three Bernoulli arms and epsilon-greedy learning. The reward probabilities are known to the simulator but hidden from the policy. It reports estimates and action counts; one finite random run is not a performance theorem.

In LLM alignment, a whole response can be treated as one action in a contextual bandit, or generation can be treated as token-by-token sequential decision making. The choice changes where credit assignment and value estimation appear. Both formulations need a clearly defined reward and sampling distribution.

### Markov state is a modeling choice you can test

Suppose a robot's observation is only position, but velocity affects its next position under the same action. Two histories with identical current position and different velocities can have different next-state distributions. Position alone is then not Markov for those dynamics. Adding velocity can restore the property for a suitable physical model. In an LLM agent, a summary that omits whether a tool action already succeeded creates the same type of ambiguity: identical visible summaries can require different next actions. State design is therefore a prerequisite to meaningful policy learning.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(31)
truth = np.array([0.2, 0.5, 0.8])
estimate, counts = np.zeros(3), np.zeros(3, dtype=int)
for step in range(2000):
    action = int(rng.integers(3)) if rng.random() < 0.1 else int(estimate.argmax())
    reward = float(rng.random() < truth[action])
    counts[action] += 1
    estimate[action] += (reward-estimate[action])/counts[action]
rewards = [1., 0., 2.]
returns, running = [], 0.
for reward in rewards[::-1]:
    running = reward+0.9*running
    returns.append(running)
assert np.allclose(returns[-1], 2.62)
print('estimates', estimate, 'counts', counts, 'return', returns[-1])

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(31)
```

#### Stage 3

```python
truth = np.array([0.2, 0.5, 0.8])
```

An observed state during this stage was:

- `truth`: `[0.2 0.5 0.8]`

#### Stage 4

```python
estimate, counts = np.zeros(3), np.zeros(3, dtype=int)
```

An observed state during this stage was:

- `estimate`: `[0. 0. 0.]`
- `counts`: `[0 0 0]`

#### Stage 5

```python
for step in range(2000):
    action = int(rng.integers(3)) if rng.random() < 0.1 else int(estimate.argmax())
    reward = float(rng.random() < truth[action])
    counts[action] += 1
    estimate[action] += (reward-estimate[action])/counts[action]
```

An observed state during this stage was:

- `estimate`: `[0.21429 0.      0.     ]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 6

```python
rewards = [1., 0., 2.]
```

#### Stage 7

```python
returns, running = [], 0.
```

#### Stage 8

```python
for reward in rewards[::-1]:
    running = reward+0.9*running
    returns.append(running)
```

#### Stage 9

```python
assert np.allclose(returns[-1], 2.62)
```

#### Stage 10

```python
print('estimates', estimate, 'counts', counts, 'return', returns[-1])
```

Run from the course root:

```bash
python code/neural/31_rl_foundations.py
```

### Recorded output from the supplied environment

```text
estimates [0.15909091 0.5        0.78867102] counts [  88   76 1836] return 2.62
```

## A value is an expected future return

For fixed policy $\pi$, $V^\pi(s)=\mathbb E_\pi[G_t\mid s_t=s]$. Split the first reward from the return and condition on the next action and state:

$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\left(r(s,a,s')+\gamma V^\pi(s')\right).$$

The sums are the law of total expectation. Define policy-averaged reward vector $r_\pi$ and transition matrix $P_\pi$. Then $V=r_\pi+\gamma P_\pi V$, or $(I-\gamma P_\pi)V=r_\pi$. For finite states and $\gamma<1$, this has a unique solution under standard stochastic transition assumptions.

## Why repeated backups converge

Define $T_\pi V=r_\pi+\gamma P_\pi V$. For any vectors $U,V$, the absolute difference at a state is bounded by $\gamma\sum_{s'}P_\pi(s'\mid s)|U(s')-V(s')|\le\gamma\|U-V\|_\infty$. Taking the maximum gives a contraction. Repeated application shrinks value error geometrically, proving convergence to the unique fixed point.

For control, replace policy averaging over actions by a maximum: $(T_*V)(s)=\max_a\mathbb E[r+\gamma V(s')]$. The inequality $|\max_a u_a-\max_a v_a|\le\max_a|u_a-v_a|$ yields the same contraction factor. Value iteration repeatedly applies this optimality backup.

## Policy improvement

Given $V^\pi$, define $Q^\pi(s,a)=\mathbb E[r+\gamma V^\pi(s')]$. A greedy policy selects an action maximizing this quantity. Under the finite discounted setting, this policy is at least as good in value as the original. The key idea is that replacing one decision by a no-worse action and then repeatedly applying the improved policy preserves the inequality through Bellman backups.

The result concerns exact values and the actual MDP. Approximation error, insufficient exploration, and function approximation complicate the guarantee. An LLM reward model is not an exact known environment reward merely because it outputs a number.

## Trace the small system

The code solves a two-state fixed-policy model both by a linear solve and by repeated Bellman backups. Comparing these independent procedures checks the fixed-point implementation. It also reports a residual $\|V-(r+\gamma PV)\|_\infty$, which measures equation consistency.

A terminal state can be represented by zero future value and no further reward, or by an absorbing zero-reward state. Keep the transition convention consistent. Bootstrapping from an arbitrary nonzero terminal value introduces reward that the task never supplied.

### Bellman residual bounds value error in the discounted case

Let $V^*$ be the fixed point of contraction $T$ with factor $\gamma<1$, and let approximate value $V$ have residual $\epsilon=\|V-TV\|_\infty$. By the triangle inequality, $\|V-V^*\|\le\|V-TV\|+\|TV-TV^*\|\le\epsilon+\gamma\|V-V^*\|$. Rearranging gives $\|V-V^*\|_\infty\le\epsilon/(1-\gamma)$. The bound becomes loose as discount approaches one. It applies to the stated exact Bellman operator, not an arbitrary sampled or neural approximation whose residual was evaluated on only a few states.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
transition = np.array([[0.7, 0.3], [0.2, 0.8]])
reward = np.array([1., 0.])
discount = 0.9
exact = np.linalg.solve(np.eye(2)-discount*transition, reward)
value = np.zeros(2)
for _ in range(250):
    value = reward+discount*transition @ value
residual = np.max(np.abs(value-(reward+discount*transition @ value)))
assert np.allclose(value, exact, atol=1e-9)
print('value', value, 'Bellman residual', residual)

```

### Code structure and observed intermediate values


#### Stage 2

```python
transition = np.array([[0.7, 0.3], [0.2, 0.8]])
```

An observed state during this stage was:

- `transition`: `[[0.7 0.3]  [0.2 0.8]]`

#### Stage 3

```python
reward = np.array([1., 0.])
```

An observed state during this stage was:

- `reward`: `[1. 0.]`

#### Stage 4

```python
discount = 0.9
```

An observed state during this stage was:

- `discount`: `0.9`

#### Stage 5

```python
exact = np.linalg.solve(np.eye(2)-discount*transition, reward)
```

An observed state during this stage was:

- `exact`: `[5.09091 3.27273]`

#### Stage 6

```python
value = np.zeros(2)
```

An observed state during this stage was:

- `value`: `[0. 0.]`

#### Stage 7

```python
for _ in range(250):
    value = reward+discount*transition @ value
```

An observed state during this stage was:

- `value`: `[5.07029 3.25211]`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 8

```python
residual = np.max(np.abs(value-(reward+discount*transition @ value)))
```

#### Stage 9

```python
assert np.allclose(value, exact, atol=1e-9)
```

#### Stage 10

```python
print('value', value, 'Bellman residual', residual)
```

Run from the course root:

```bash
python code/neural/32_bellman_dynamic_programming.py
```

### Recorded output from the supplied environment

```text
value [5.09090909 3.27272727] Bellman residual 1.4548362514688051e-12
```

## Learn from sampled transitions

Dynamic programming assumes a known transition model. Temporal-difference learning uses observed transitions. With value estimate $V$, TD(0) error is $\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$, and the tabular update is $V(s_t)\leftarrow V(s_t)+\alpha\delta_t$. At a true terminal transition, omit the bootstrap term.

The target uses an estimate of future value, so TD bootstraps. Monte Carlo instead waits for a sampled complete return. Bootstrapping can reduce variance while introducing dependence on current value errors. This is a tradeoff, not a universal dominance claim.

## On-policy and off-policy targets

SARSA updates $Q(s_t,a_t)$ toward $r_t+\gamma Q(s_{t+1},a_{t+1})$, using the next action actually selected by the behavior policy. Q-learning uses $r_t+\gamma\max_aQ(s_{t+1},a)$, targeting greedy control even when behavior explores. The distinction is in the target policy, not whether the data were collected in a file or in memory.

For a transition to a terminal goal with reward one, the target is exactly one. If current $Q=0.2$ and $\alpha=0.1$, the updated value is $0.2+0.1(1-0.2)=0.28$. A preceding zero-reward state with discount $0.9$ eventually inherits value about $0.9$ when reaching that goal is optimal.

## Convergence has conditions

Tabular Q-learning has convergence results under finite discounted settings, sufficient visitation, and suitable diminishing step sizes, among other assumptions. Constant learning rates in one finite simulation do not meet every asymptotic condition. Neural function approximation, bootstrapping, and off-policy learning can interact unstably; tabular guarantees do not transfer automatically.

Deep Q-learning often uses replay buffers and target networks. Replay changes sample reuse and correlation. A target network temporarily holds bootstrap targets more stable. Double-Q ideas address maximization bias caused by using noisy estimates to select and evaluate the same action.

## Termination and truncation differ

A task-terminal state has no future task return. A rollout stopped only by a sampling time limit may still have future value, depending on the task definition. Treating all truncations as terminal can bias value estimates. Record both flags when the environment distinguishes them.

The code uses a deterministic three-state line world with a genuine terminal goal. It checks that the learned start-state greedy action moves right. This is a compact control example, not an implementation of a neural value learner or an LLM training system.

Optional application: add a negative step reward. The optimal policy should still reach the goal, but loops become less attractive. Derive the expected return for a path before changing the code so reward semantics remain clear.

### Why maximizing noisy estimates can overestimate value

Suppose two actions both have true value zero, but estimates independently take values plus or minus one with equal probability. The maximum estimate is minus one only when both are minus one, probability one quarter; otherwise it is plus one, probability three quarters. Expected maximum is therefore $-1/4+3/4=1/2$, even though the maximum true value is zero. This exact example explains maximization bias. Separating action selection from evaluation with suitably independent estimates can reduce that bias, though realistic estimates are not perfectly independent.

## Reconstruct the executable example, one stage at a time

The complete program below is also saved as a numbered Python file. Run it from the course root using the command shown after the listing. The imports resolve the adjacent `core.py` automatically because Python adds the script's directory to its import path. No API key, account, external model download, or GPU is required for these local examples.

```python
import numpy as np
rng = np.random.default_rng(33)
q = np.zeros((3, 2))
for episode in range(1500):
    state = 0
    for _ in range(20):
        action = int(rng.integers(2)) if rng.random() < .2 else int(q[state].argmax())
        next_state = min(2, state+1) if action == 1 else max(0, state-1)
        terminal = next_state == 2
        reward = float(terminal)
        target = reward if terminal else reward+.9*q[next_state].max()
        q[state, action] += .1*(target-q[state, action])
        state = next_state
        if terminal:
            break
assert q[0].argmax() == 1
print('Q values', q)

```

### Code structure and observed intermediate values


#### Stage 2

```python
rng = np.random.default_rng(33)
```

#### Stage 3

```python
q = np.zeros((3, 2))
```

An observed state during this stage was:

- `q`: `[[0. 0.]  [0. 0.]  [0. 0.]]`

#### Stage 4

```python
for episode in range(1500):
    state = 0
    for _ in range(20):
        action = int(rng.integers(2)) if rng.random() < .2 else int(q[state].argmax())
        next_state = min(2, state+1) if action == 1 else max(0, state-1)
        terminal = next_state == 2
        reward = float(terminal)
        target = reward if terminal else reward+.9*q[next_state].max()
        q[state, action] += .1*(target-q[state, action])
        state = next_state
        if terminal:
            break
```

An observed state during this stage was:

- `state`: `0`

This is one recorded iteration state, not necessarily the final loop state. The final printed result below is authoritative for the completed run. Long loops are deliberately sampled to keep the trace readable.

#### Stage 5

```python
assert q[0].argmax() == 1
```

#### Stage 6

```python
print('Q values', q)
```

Run from the course root:

```bash
python code/neural/33_td_q_learning.py
```

### Recorded output from the supplied environment

```text
Q values [[0.81       0.9       ]
 [0.80999999 1.        ]
 [0.         0.        ]]
```
