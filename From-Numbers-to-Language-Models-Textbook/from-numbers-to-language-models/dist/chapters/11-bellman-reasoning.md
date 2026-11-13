# Learning to act: bandits, Markov decisions, and Bellman reasoning

## A label can be observed; an unchosen action's outcome often cannot

In a supervised example, the desired target is supplied. In a decision problem, we choose an action and observe its consequence. The reward of an action we did not take is usually unavailable. Our choices therefore affect both immediate results and future information. Exploration is not an optional decoration added to an otherwise ordinary classifier; it addresses this missing-feedback problem.

Begin with a bandit: choose one of several arms and observe a reward. There is no relevant state transition connecting decisions. Then add a state and action-dependent dynamics. That creates the setting in which an action can be valuable because it leads somewhere useful, even if its immediate reward is small.

## Bandits, policies, returns, and Markov decision processes

### Predicting a label differs from choosing an action

In supervised learning, an example supplies a target. In reinforcement learning, an agent chooses an action, receives feedback, and may change what it observes next. A policy describes action selection. A reward describes a task signal. Neither a reward function nor a high measured reward is automatically a complete specification of what people want.

A bandit has actions and rewards without state transitions relevant to future decisions. An MDP adds states $s$, actions $a$, transition law $P(s'\mid s,a)$, reward distribution, initial-state distribution, and discount $\gamma$. The Markov assumption says the current state contains the information needed to predict the next state and reward given the action. A language prefix can be treated as a state, though practical summaries may lose relevant history.

### Define a return before optimizing it

For rewards $r_t$, define discounted return $G_t=\sum_{k=0}^{T-t-1}\gamma^kr_{t+k}$. With rewards $(1,0,2)$ and $\gamma=0.9$, $G_0=1+0.9\cdot0+0.9^2\cdot2=2.62$. The recursion is $G_t=r_t+\gamma G_{t+1}$, with terminal return zero. This follows by factoring one power of $\gamma$ from all terms after the first.

For infinite horizons and $0\le\gamma<1$, bounded rewards ensure the return converges absolutely. Finite-horizon tasks can use $\gamma=1$, but time may need to be included in the state if optimal behavior depends on remaining steps.

### Exploration creates information

A greedy bandit agent selects the largest estimated value and can become stuck after noisy initial feedback. Epsilon-greedy selects a random action with probability $\epsilon$ and otherwise exploits. UCB methods add an uncertainty bonus, while Thompson sampling samples plausible reward parameters. Each approach uses assumptions about stationarity and reward structure.

For sample mean $Q_n$ after $n$ observations, the update $Q_n=Q_{n-1}+(R_n-Q_{n-1})/n$ follows by expanding the new mean. Constant step sizes instead emphasize recent observations and can track drift, at the expense of not converging to the exact historical mean.

### A miniature experiment with a precise boundary

The code simulates three Bernoulli arms and epsilon-greedy learning. The reward probabilities are known to the simulator but hidden from the policy. It reports estimates and action counts; one finite random run is not a performance theorem.

In LLM alignment, a whole response can be treated as one action in a contextual bandit, or generation can be treated as token-by-token sequential decision making. The choice changes where credit assignment and value estimation appear. Both formulations need a clearly defined reward and sampling distribution.

#### Markov state is a modeling choice you can test

Suppose a robot's observation is only position, but velocity affects its next position under the same action. Two histories with identical current position and different velocities can have different next-state distributions. Position alone is then not Markov for those dynamics. Adding velocity can restore the property for a suitable physical model. In an LLM agent, a summary that omits whether a tool action already succeeded creates the same type of ambiguity: identical visible summaries can require different next actions. State design is therefore a prerequisite to meaningful policy learning.


## Estimate one arm before comparing policies

Suppose observed rewards for an arm are one, zero, one. The sample mean is two thirds. The incremental formula starts at one after the first observation, moves halfway toward zero after the second to become one half, then moves one third of the way toward one after the third to become two thirds. The update step one over count is not arbitrary: it exactly reproduces the historical mean.

A constant step size uses another weighting scheme. Recent observations retain greater influence, which can help when rewards drift. It no longer equals the complete historical average. Choosing an estimator means choosing which evidence to emphasize, and that choice should match the stationarity assumptions of the task.


### Executable calculation

Run `python examples/31_rl_foundations.py` from the package root. Complete source is also included as [31_rl_foundations.py](../examples/31_rl_foundations.py).

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

Recorded output on the checked Python/NumPy environment:

```text
estimates [0.15909091 0.5        0.78867102] counts [  88   76 1836] return 2.62
```


## Define a state by the prediction it supports

A state is adequate for an MDP model when, given that state and an action, additional history is not needed to specify the next-state and reward distribution. This is a modeling assumption about information, not a synonym for the latest raw observation. If velocity affects the next position, position alone may be insufficient.

For a finite-horizon task, remaining time can also matter. An action useful with ten steps left may be useless with one step left. Include time in the state or write time-indexed value functions. Otherwise the same visible state could require different decisions under the supposedly stationary policy.

## Bellman equations, policy evaluation, and dynamic programming

### A value is an expected future return

For fixed policy $\pi$, $V^\pi(s)=\mathbb E_\pi[G_t\mid s_t=s]$. Split the first reward from the return and condition on the next action and state:

$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\left(r(s,a,s')+\gamma V^\pi(s')\right).$$

The sums are the law of total expectation. Define policy-averaged reward vector $r_\pi$ and transition matrix $P_\pi$. Then $V=r_\pi+\gamma P_\pi V$, or $(I-\gamma P_\pi)V=r_\pi$. For finite states and $\gamma<1$, this has a unique solution under standard stochastic transition assumptions.

### Why repeated backups converge

Define $T_\pi V=r_\pi+\gamma P_\pi V$. For any vectors $U,V$, the absolute difference at a state is bounded by $\gamma\sum_{s'}P_\pi(s'\mid s)|U(s')-V(s')|\le\gamma\|U-V\|_\infty$. Taking the maximum gives a contraction. Repeated application shrinks value error geometrically, proving convergence to the unique fixed point.

For control, replace policy averaging over actions by a maximum: $(T_*V)(s)=\max_a\mathbb E[r+\gamma V(s')]$. The inequality $|\max_a u_a-\max_a v_a|\le\max_a|u_a-v_a|$ yields the same contraction factor. Value iteration repeatedly applies this optimality backup.

### Policy improvement

Given $V^\pi$, define $Q^\pi(s,a)=\mathbb E[r+\gamma V^\pi(s')]$. A greedy policy selects an action maximizing this quantity. Under the finite discounted setting, this policy is at least as good in value as the original. The key idea is that replacing one decision by a no-worse action and then repeatedly applying the improved policy preserves the inequality through Bellman backups.

The result concerns exact values and the actual MDP. Approximation error, insufficient exploration, and function approximation complicate the guarantee. An LLM reward model is not an exact known environment reward merely because it outputs a number.

### Trace the small system

The code solves a two-state fixed-policy model both by a linear solve and by repeated Bellman backups. Comparing these independent procedures checks the fixed-point implementation. It also reports a residual $\|V-(r+\gamma PV)\|_\infty$, which measures equation consistency.

A terminal state can be represented by zero future value and no further reward, or by an absorbing zero-reward state. Keep the transition convention consistent. Bootstrapping from an arbitrary nonzero terminal value introduces reward that the task never supplied.

#### Bellman residual bounds value error in the discounted case

Let $V^*$ be the fixed point of contraction $T$ with factor $\gamma<1$, and let approximate value $V$ have residual $\epsilon=\|V-TV\|_\infty$. By the triangle inequality, $\|V-V^*\|\le\|V-TV\|+\|TV-TV^*\|\le\epsilon+\gamma\|V-V^*\|$. Rearranging gives $\|V-V^*\|_\infty\le\epsilon/(1-\gamma)$. The bound becomes loose as discount approaches one. It applies to the stated exact Bellman operator, not an arbitrary sampled or neural approximation whose residual was evaluated on only a few states.


## Solve a two-state value problem without an algorithm first

Let state A return reward one each step and remain at A; let state B return zero and move to A. With discount 0.9, $V(A)=1+0.9V(A)$, so $0.1V(A)=1$ and $V(A)=10$. Then $V(B)=0+0.9V(A)=9$. The value ten includes an infinite geometric stream of rewards; it is not the immediate reward.

If the reward at A occurred only once and then the episode terminated, its value would be one instead. The transition and terminal conventions change the task. Many apparent Bellman mistakes are really ambiguous descriptions of when rewards occur and whether future value remains.


### Executable calculation

Run `python examples/32_bellman_dynamic_programming.py` from the package root. Complete source is also included as [32_bellman_dynamic_programming.py](../examples/32_bellman_dynamic_programming.py).

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

Recorded output on the checked Python/NumPy environment:

```text
value [5.09090909 3.27272727] Bellman residual 1.4548362514688051e-12
```


## Why a fixed point is an answer rather than a slogan

A Bellman equation relates each state's value to immediate reward and successor values. Iteration repeatedly replaces the current vector by the right side. Under the finite discounted assumptions, the operator contracts the maximum difference between two value vectors by at most gamma. This gives a reason convergence occurs, not merely a pattern observed in a plot.

The residual measures how much a proposed vector violates its own Bellman equation. A small residual under the exact operator yields an error bound through the contraction argument. A small residual measured on a few sampled states cannot automatically certify every unvisited state, especially with a neural approximator.

## Replace a known expectation with sampled experience

Dynamic programming can sum over a known model. In many tasks we only observe transitions. A TD update replaces the expectation by a sampled reward and next-state estimate. This changes the source of error: targets now contain sampling noise and imperfect bootstrap values. The algebra still traces back to the same return decomposition.

## A policy and a value answer different questions

A policy tells us how actions are chosen. A value predicts expected return under a specified policy or optimality definition. If the policy changes, its value function generally changes too, even though environment dynamics remain fixed. A table of large values is not itself a complete action-selection rule unless we state how those values are attached to states or actions.

For a state value, action selection needs a transition model or another estimate of action consequences. For an action value, a greedy rule can select the largest entry directly, while an exploratory behavior rule may choose otherwise. This distinction explains why learning a value estimate and collecting experience can use different policies. Always label whether a value belongs to the current policy, a target policy, or an optimality equation; the superscript is part of its meaning, not decoration.

## Temporal differences, Q-learning, and exploration

### Learn from sampled transitions

Dynamic programming assumes a known transition model. Temporal-difference learning uses observed transitions. With value estimate $V$, TD(0) error is $\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$, and the tabular update is $V(s_t)\leftarrow V(s_t)+\alpha\delta_t$. At a true terminal transition, omit the bootstrap term.

The target uses an estimate of future value, so TD bootstraps. Monte Carlo instead waits for a sampled complete return. Bootstrapping can reduce variance while introducing dependence on current value errors. This is a tradeoff, not a universal dominance claim.

### On-policy and off-policy targets

SARSA updates $Q(s_t,a_t)$ toward $r_t+\gamma Q(s_{t+1},a_{t+1})$, using the next action actually selected by the behavior policy. Q-learning uses $r_t+\gamma\max_aQ(s_{t+1},a)$, targeting greedy control even when behavior explores. The distinction is in the target policy, not whether the data were collected in a file or in memory.

For a transition to a terminal goal with reward one, the target is exactly one. If current $Q=0.2$ and $\alpha=0.1$, the updated value is $0.2+0.1(1-0.2)=0.28$. A preceding zero-reward state with discount $0.9$ eventually inherits value about $0.9$ when reaching that goal is optimal.

### Convergence has conditions

Tabular Q-learning has convergence results under finite discounted settings, sufficient visitation, and suitable diminishing step sizes, among other assumptions. Constant learning rates in one finite simulation do not meet every asymptotic condition. Neural function approximation, bootstrapping, and off-policy learning can interact unstably; tabular guarantees do not transfer automatically.

Deep Q-learning often uses replay buffers and target networks. Replay changes sample reuse and correlation. A target network temporarily holds bootstrap targets more stable. Double-Q ideas address maximization bias caused by using noisy estimates to select and evaluate the same action.

### Termination and truncation differ

A task-terminal state has no future task return. A rollout stopped only by a sampling time limit may still have future value, depending on the task definition. Treating all truncations as terminal can bias value estimates. Record both flags when the environment distinguishes them.

The code uses a deterministic three-state line world with a genuine terminal goal. It checks that the learned start-state greedy action moves right. This is a compact control example, not an implementation of a neural value learner or an LLM training system.

Optional application: add a negative step reward. The optimal policy should still reach the goal, but loops become less attractive. Derive the expected return for a path before changing the code so reward semantics remain clear.

#### Why maximizing noisy estimates can overestimate value

Suppose two actions both have true value zero, but estimates independently take values plus or minus one with equal probability. The maximum estimate is minus one only when both are minus one, probability one quarter; otherwise it is plus one, probability three quarters. Expected maximum is therefore $-1/4+3/4=1/2$, even though the maximum true value is zero. This exact example explains maximization bias. Separating action selection from evaluation with suitably independent estimates can reduce that bias, though realistic estimates are not perfectly independent.


## Follow one terminal update and its predecessor

In the line-world example, moving into the goal gives reward one and ends the episode. The terminal target is one with no future bootstrap. After that action value becomes accurate, the preceding state can learn a discounted value near 0.9 for moving toward it. Values propagate backward through sampled transitions even though rewards were received at the end.

If we accidentally add the terminal state's arbitrary stored estimate, the agent learns a return containing a reward source that does not exist in the task. Keep true termination distinct from stopping data collection after a time limit. The latter may still permit a bootstrap when the underlying task continues.


### Executable calculation

Run `python examples/33_td_q_learning.py` from the package root. Complete source is also included as [33_td_q_learning.py](../examples/33_td_q_learning.py).

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

Recorded output on the checked Python/NumPy environment:

```text
Q values [[0.81       0.9       ]
 [0.80999999 1.        ]
 [0.         0.        ]]
```


## Read the companion's policy and value views together

The **Bellman laboratory** exposes a discount and a small transition model, then calculates values and a Bellman residual. The same displayed reward can correspond to different values as discount changes because the weight on future outcomes changes. Approaching discount one also slows contraction and enlarges residual-to-value error bounds.

At discount one, the contraction proof no longer applies. A finite terminating task may still have well-defined values, but it needs an argument based on its horizon or termination structure rather than the discounted proof.

A tabular example is not a proof that a neural control algorithm is stable. Function approximation, off-policy data, and bootstrapping introduce additional interactions. We use the finite case to establish exact meanings before adding approximation. The next chapter optimizes a policy directly and derives the gradient of expected reward from the sampling distribution.
