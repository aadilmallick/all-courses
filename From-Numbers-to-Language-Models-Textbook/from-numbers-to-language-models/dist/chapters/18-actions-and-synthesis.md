# Closing the loop: physical actions, generative policies, and a final synthesis

## A plausible plan is not a completed physical action

A robot must observe, estimate state, choose an action, execute under timing and actuator constraints, and observe the result. A language instruction can describe a goal, but a control system still needs numerical actions and feedback. The physical consequences of an error cannot be evaluated only by how convincing the explanation sounds.

We will study small equations that make these responsibilities explicit. They are simulated teaching models, not instructions to command hardware. Their purpose is to connect the probability and gradient machinery of earlier chapters with state uncertainty, action distributions, and stability.

## Physical AI, partial observability, imitation, and control

### Acting in the world changes the problem

A physical agent receives imperfect observations and chooses actions whose effects unfold under dynamics and latency. A language instruction alone does not specify a complete control policy. The system also needs perception, state estimation, action representations, timing, feedback, and task constraints.

An MDP state contains information sufficient for predicting transitions. A robot often sees only observation $o_t$ generated from hidden state $s_t$, leading to a partially observable MDP. A belief distribution over states or a learned history representation can summarize uncertainty. Treating one camera frame as a complete state is a modeling assumption that can fail under occlusion or motion ambiguity.

### Behavioral cloning from demonstrations

Given observations and expert actions, behavioral cloning minimizes a supervised action loss, such as $\mathbb E\|\pi_\theta(o)-a^*\|^2$ for suitable continuous actions. Deployment exposes the learner to its own mistakes, shifting the state distribution away from expert demonstrations. Small local errors can compound. Data aggregation with expert corrections is one way to address this mismatch under the method's assumptions.

A single mean-squared-error action prediction can be unsuitable for multimodal actions. If an obstacle can be passed safely on either side, averaging left and right demonstrations can point directly at the obstacle. The conditional mean minimizes squared error but need not be a safe or feasible action.

### Feedback control with a solvable system

Consider scalar dynamics $x_{t+1}=x_t+\Delta t\,u_t$ and target zero. Choose proportional feedback $u_t=-kx_t$. Then $x_{t+1}=(1-\Delta t k)x_t$. Stability requires $|1-\Delta t k|<1$, giving $0<\Delta t k<2$. This is the same geometric convergence structure seen in quadratic optimization, now with a physical state interpretation.

Real dynamics include actuator limits, delays, contacts, and model errors. A high-level vision-language-action model can propose goals or action chunks, while a faster controller handles local feedback. The actual separation of responsibilities should be explicit.

### Evaluation must reflect deployment variation

Measure success across initial conditions, objects, viewpoints, disturbances, and embodiments. Simulation can support repeatability and scale, but simulation-to-real transfer depends on what dynamics and sensing variations are represented. A successful text plan is not evidence of successful physical execution.

The code simulates only the scalar system, compares stable and unstable gains, and reports state trajectories. It sends no commands to hardware. The exact stability derivation applies to this discrete linear model; it does not certify a robot controller or a learned policy.

#### Why mean action can be physically wrong

Suppose at an obstacle, expert action is left with probability one half and right with probability one half, represented as $a=-1$ and $a=1$. A deterministic squared-error predictor minimizes $\mathbb E(\widehat a-a)^2=\widehat a^2+1$, whose derivative is $2\widehat a$ and minimizer is zero. If zero points into the obstacle, the statistically optimal mean under this loss is behaviorally unsuitable. A multimodal policy can represent the two alternatives, while feedback and feasibility checks decide how to execute one. The loss must match the action semantics.


## A history can contain information absent from one observation

A single frame may show an object at a position without revealing its velocity. Two histories ending at that same frame can imply different future motion under the same action. A policy that sees only the frame must either infer uncertainty, retain history, or use another state representation. This is the practical meaning of partial observability.

A belief state represents a distribution over possible hidden states. A learned recurrent representation can summarize history without explicitly enumerating such a distribution, but it must be evaluated for whether it preserves the information needed by the task. Calling a hidden vector state does not prove the Markov assumption holds.


### Executable calculation

Run `python examples/51_physical_ai_control.py` from the package root. Complete source is also included as [51_physical_ai_control.py](../examples/51_physical_ai_control.py).

```python
import numpy as np
def simulate(gain, dt=.1, steps=20):
    state, trajectory = 1., [1.]
    for _ in range(steps):
        action = -gain*state
        state += dt*action
        trajectory.append(state)
    return np.array(trajectory)
stable = simulate(5)
unstable = simulate(25)
assert abs(stable[-1]) < abs(stable[0])
assert abs(unstable[-1]) > abs(unstable[0])
print('stable final', stable[-1], 'unstable final', unstable[-1])
print('opposite demonstration mean', np.mean([-1., 1.]))
```

Recorded output on the checked Python/NumPy environment:

```text
stable final 9.5367431640625e-07 unstable final 3325.256730079651
opposite demonstration mean 0.0
```


## Why squared-error imitation can choose the wrong action

Imagine demonstrations that pass an obstacle on either side. Represent the two actions as minus one and plus one, equally likely. The conditional mean is zero. It minimizes expected squared error, but if zero means moving straight into the obstacle, the optimal predictor under that loss is unsuitable for the task. A distribution over feasible modes can preserve alternatives that a single mean erases.

Action chunking predicts several future actions together. Receding-horizon execution applies only part of the chunk, observes again, and replans. This balances coherent plans with feedback. Long open-loop execution can be efficient but fragile under disturbances; frequent replanning costs computation and may create inconsistent actions without suitable design.

## Action diffusion, flow matching, and learned world models

### Predict a distribution over action sequences

Action chunking predicts several future actions together. It can represent temporally coherent behavior and reduce high-level decision frequency. Receding-horizon execution performs only part of the planned chunk before observing again and replanning. Long open-loop chunks can drift when the world changes.

Diffusion policies represent action sequences through a conditional denoising process. For a clean action vector $a_0$, sample noise $\epsilon\sim\mathcal N(0,I)$ and construct $a_t=\sqrt{\bar\alpha_t}a_0+\sqrt{1-\bar\alpha_t}\epsilon$. Train a network to predict noise or another parameterization from $a_t$, time, and observations.

### Recover the clean estimate carefully

If a noise predictor returns $\widehat\epsilon$, rearrange the corruption equation:

$$\widehat a_0=\frac{a_t-\sqrt{1-\bar\alpha_t}\widehat\epsilon}{\sqrt{\bar\alpha_t}}.$$

This is an algebraic estimate at a nonzero $\bar\alpha_t$, not a complete reverse sampler. A full diffusion sampler needs a noise schedule, conditional denoiser, reverse update equations, and stochastic or deterministic sampling choices. Using the true injected noise demonstrates the identity but is not an available deployment oracle.

### Flow matching offers another generative path

A simple flow-matching construction interpolates $x_t=(1-t)x_0+tx_1$ between source noise $x_0$ and data $x_1$. The path velocity is $x_1-x_0$. Train $v_\theta(x_t,t,c)$ to predict this conditional velocity, then integrate $dx/dt=v_\theta(x,t,c)$ from the source distribution. Different path and coupling choices produce different formulations.

A one-step Euler approximation is $x_{t+h}=x_t+h v_\theta(x_t,t,c)$. Numerical integration error and learned vector-field error both affect results. Flow matching and diffusion share generative goals but have different training and sampling definitions.

### World models and planning

A learned world model predicts future observations, latent states, or rewards under actions. A planner searches action sequences using those predictions. Prediction error can compound, and optimizing against a model can exploit its errors. Short-horizon replanning, uncertainty estimates, and real-environment evaluation can help diagnose those limitations.

The experiment reconstructs clean actions using known injected noise and demonstrates an exact linear interpolation with a constant oracle velocity. It labels both oracle quantities explicitly. It does not train a diffusion policy, a flow model, or a world model; the purpose is to make their core equations traceable before implementing learned approximations.

Optional application: replace the oracle noise by noise plus a fixed error. Derive that reconstruction error is scaled by $\sqrt{(1-\bar\alpha_t)/\bar\alpha_t}$. This shows why the corruption level matters to error amplification.

#### Noise-prediction error amplification is explicit

Let predicted noise be $\widehat\epsilon=\epsilon+e$. Substitute into the clean-action estimate: $\widehat a_0=a_0-\sqrt{(1-\bar\alpha_t)/\bar\alpha_t}\,e$. Therefore error magnitude is multiplied by $\sqrt{(1-\bar\alpha_t)/\bar\alpha_t}$. At $\bar\alpha_t=0.5$, the factor is one; at 0.01, it is approximately 9.95. This does not by itself determine the best training weighting or sampler, because the denoiser's error distribution changes with time. It does explain why reconstruction from heavily corrupted samples is sensitive to noise-prediction error.


## Corruption and reconstruction are separate from learning a sampler

The forward diffusion equation constructs a noisy action from a clean action and sampled noise. Rearranging it using the true noise recovers the clean action algebraically. During deployment, the true noise component relative to the unknown clean action is not available. A trained predictor and a specified reverse procedure must supply an approximation.

This distinction prevents an oracle reconstruction identity from being mistaken for a learned diffusion policy. The numerical example intentionally uses the injected noise so you can verify the equation. The text identifies what a full trained system would need: a dataset, conditioning representation, denoising network, time schedule, loss weighting, sampler, and evaluation under actual closed-loop execution.


### Executable calculation

Run `python examples/52_generative_actions_world_models.py` from the package root. Complete source is also included as [52_generative_actions_world_models.py](../examples/52_generative_actions_world_models.py).

```python
import numpy as np
rng = np.random.default_rng(52)
action = np.array([-.5, .2, .8])
noise = rng.normal(size=3)
alpha_bar = .4
corrupted = np.sqrt(alpha_bar)*action+np.sqrt(1-alpha_bar)*noise
recovered = (corrupted-np.sqrt(1-alpha_bar)*noise)/np.sqrt(alpha_bar)
assert np.allclose(recovered, action)
source, destination = rng.normal(size=3), action
state = source.copy()
velocity = destination-source
for _ in range(10):
    state += .1*velocity
assert np.allclose(state, destination)
print('oracle reconstruction', recovered, 'oracle flow endpoint', state)
```

Recorded output on the checked Python/NumPy environment:

```text
oracle reconstruction [-0.5  0.2  0.8] oracle flow endpoint [-0.5  0.2  0.8]
```


## A world model can be exploited by its planner

A learned dynamics model predicts what may happen under candidate actions. A planner searches those predictions for high reward. If the model has errors, the planner can find actions that look excellent only inside the inaccurate model. More search may then make the real result worse by exploiting prediction weaknesses more effectively.

Evaluate plans in the actual target environment or a sufficiently independent test process. Short-horizon replanning and uncertainty estimates can help diagnose failures, but neither creates a universal guarantee. This is the physical analogue of optimizing a language model against an imperfect reward model or judge.

## Integrate the learning system without hiding its boundaries

Our final project contains a real differentiable transformer training path and a separate evidence-grounded answer path. The transformer learns synthetic token patterns and can be instruction- or preference-tuned under the supplied objectives. The evidence path ranks documents and verifies a narrow structured answer. These are working components with different capabilities.

Do not silently replace the deterministic extractor with the tiny model and claim a general factual assistant. A larger learned answerer is an additional integration requiring weights, data, and held-out evaluation. The project is designed so that you can add such a component while preserving interpretable interfaces and baselines.

## Capstone: train, adapt, retrieve, and verify one local system

### Integrate interfaces without confusing demonstrations with capabilities

This capstone has two real executable components: a small trainable autoregressive model and an evidence-retrieval answer path. The tiny model learns a synthetic symbol pattern. The evidence path answers a narrow port question using deterministic extraction and citations. Combining their interfaces teaches system boundaries; it does not turn a small symbol model into a general factual assistant.

Begin by running the transformer training lesson and inspecting loss reduction. Then inspect the retrieval index and the selected evidence. Finally validate a structured answer against the selected passage. Each stage has a check whose meaning is clear.

### Define the artifacts

The model artifact consists of architecture configuration and trained arrays. The data artifact records vocabulary and token sequences. The retrieval artifact records document IDs, text, timestamps, and ranking configuration. The answer artifact records the claim, evidence IDs, status, and relevant configuration versions. Keeping these separate makes a failed answer diagnosable.

For this task, the knowledge corpus has an old port note, a current port note, and an unrelated backup note. A lexical retriever should rank the current configuration highly. The deterministic answer extractor recognizes a numeric port in the selected passage. A verifier checks that the cited passage contains that number and is the intended current configuration. This is a narrow check, not a general natural-language entailment engine.

### Add adaptation as a controlled experiment

Use response-only SFT masks from Chapter 9 to teach a small formatting pattern. For a larger model, compare full tuning with LoRA under a fixed held-out task set. If adding preferences, compute response log-probability sums and verify the DPO sign on a known pair before optimizing. Do not tune the generator and judge simultaneously and then claim an independent improvement measurement.

The local capstone does not claim to execute every larger-scale extension. It supplies working foundational components and a precise interface for experiments. Real model weights, training data, and compute budgets are separate choices with version and evaluation requirements.

### A failure-oriented acceptance protocol

Change the old note's port and confirm the current answer remains correct. Remove current evidence and require abstention. Insert an instruction inside a document and verify the retrieval pipeline treats it as text. Corrupt a citation ID and require validation failure. Shift target labels incorrectly and verify the model-training tests catch the mismatch.

For an actual end-to-end learned answerer, add a held-out question set and evaluate retrieval, oracle-context generation, answer support, calibration, latency, and cost separately. A single integrated success example establishes connectivity, not reliable general performance.

The executable example below performs the narrow retrieval and answer verification task. It uses no network calls or secret credentials, making it suitable for a public learning repository.

#### A concrete extension path with acceptance conditions

First preserve the current deterministic retrieval baseline and its abstention behavior. Add a learned embedding retriever while keeping the corpus and held-out questions fixed; require improved evidence recall without unauthorized passages. Then add a real conditional generator and measure unsupported claims under both ordinary and oracle evidence. Only after those checks, compare full tuning, LoRA, and preference tuning on a separate response-quality set. Each stage changes one subsystem and leaves a runnable baseline. This sequence turns a broad capstone into a set of causal experiments instead of an opaque bundle of new components.



### Executable calculation

Run `python examples/53_capstone_local_system.py` from the package root. Complete source is also included as [53_capstone_local_system.py](../examples/53_capstone_local_system.py).

```python
import re
corpus = [
    {'id': 'old', 'current': False, 'text': 'Old service port 443.'},
    {'id': 'current', 'current': True, 'text': 'Current service port 8443.'},
    {'id': 'backup', 'current': True, 'text': 'Backup runs daily.'},
]
query = {'current', 'service', 'port'}
def rank(document):
    words = set(re.findall(r'\w+', document['text'].lower()))
    return len(query & words)
evidence = max(corpus, key=rank)
match = re.search(r'port (\d+)', evidence['text'])
if match and evidence['current'] and rank(evidence) == len(query):
    answer = {'port': int(match.group(1)), 'citation': evidence['id'], 'status': 'answered'}
else:
    answer = {'port': None, 'citation': None, 'status': 'insufficient_evidence'}
assert answer['port'] == 8443 and answer['citation'] == 'current'
print(answer)
```

Recorded output on the checked Python/NumPy environment:

```text
{'port': 8443, 'citation': 'current', 'status': 'answered'}
```


## Follow the complete supervised-to-preference experiment

Run `python examples/sequence_alignment.py` from the package root. It trains the tiny transformer on a cyclic pattern, copies its parameters into an independent reference model, and computes whole-response log-probabilities for a chosen and rejected sequence. DPO then updates the policy while the reference stays fixed.

The checked source run reduced supervised token loss from about 1.4420 to 0.02573 and reduced its one-pair DPO loss from log two to about 0.01313. Those numbers describe the supplied seeded synthetic task. They verify a complete optimization path, not natural-language competence or broad human preference satisfaction. The script checks reference immutability and the intended relative probability change.

## Choose the next experiment by the missing relationship

If retrieval misses relevant evidence, improve retrieval before tuning a generator to compensate. If the generator fails with oracle evidence, examine its task formulation and training. If a policy learns the reward but violates the intended behavior, inspect reward coverage. If a recurrent model degrades with more steps, examine its learned dynamics and training distribution. These choices follow from measured bottlenecks rather than from adding fashionable components.

The companion's **Actions and feedback** experiment simulates scalar control and action corruption under visible parameters. A stable gain shrinks state error; an excessive gain makes it grow. The diffusion view reconstructs using a clearly labeled oracle noise value. No hardware is connected and no learned robot capability is implied.

You now have a connected set of tools: coordinates to represent information, derivatives to trace change, probabilities to express uncertainty, attention to retrieve features, objectives to train behavior, retrieval to supply evidence, and feedback to measure consequences. Durable mastery comes from rebuilding these relationships in new cases while keeping assumptions and evidence visible. The included projects and sources give you concrete places to continue that work.
