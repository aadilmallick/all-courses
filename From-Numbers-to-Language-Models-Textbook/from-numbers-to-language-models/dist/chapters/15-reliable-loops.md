# Reliable iteration: tools, agent graphs, and improvement loops

## Repetition only helps when it changes something relevant

A model can produce a plan, call a tool, revise an answer, or propose a program change. A surrounding application decides which proposals are valid, what can execute, what evidence is saved, and when to stop. An agent is therefore a combined system, not a property created by adding the word autonomous to a prompt.

Consider a narrow task: answer the current-port question using the document store. The program can retrieve, draft an answer, check its citation, and stop. If evidence is missing, the correct outcome may be an explicit incomplete status. A loop that continues generating confident guesses has performed more activity while making the result worse.

## Write down state before writing the loop

A minimal state can include the goal, known evidence, proposed answer, remaining budget, completed actions, and unresolved errors. Each field has a reason. Evidence prevents repeatedly searching for information already found. Completed-action IDs prevent duplicate side effects. Remaining budget provides a termination condition independent of the model's willingness to continue.

State should distinguish observations from assumptions. 'The tool returned document A' is an observation. 'Document A probably contains the latest policy' is an inference. If the inference later proves false, preserving that distinction makes correction possible without rewriting history into a misleading success story.

## Tools, bounded agent loops, graphs, and external state

### A model call is one component of a program

An agent system repeatedly observes state, proposes an action, executes a permitted tool, records the result, and decides whether to stop. The model supplies probabilistic proposals; deterministic code can validate arguments, enforce budgets, execute tools, and check outcomes. More model calls do not by themselves establish progress.

Represent a loop state with a goal, evidence, pending tasks, completed artifacts, error records, and budgets. A transition function maps state and a validated action to a new state. Termination conditions should include success, exhausted budget, repeated failure, and lack of measurable progress.

### Contracts for tools and nodes

A tool contract specifies its name, arguments, preconditions, result format, failure modes, and side effects. A graph node contract adds input/output schemas and transition rules. Control-flow edges determine which operation runs next; data-flow edges determine which evidence a node can access. These relationships need not be identical.

For a retrieval-answer-review graph, retrieval emits evidence IDs and passages; answer generation emits claims linked to IDs; review checks schema, citation validity, and task criteria. A failed review may return to answer generation with explicit defects. Limit retries and preserve the best verified result rather than overwriting it unconditionally.

### Idempotency and retries

An idempotent action can be repeated without multiplying its effect. Reading a document is naturally close to this; sending a payment is not unless the service supports an idempotency key. A timeout does not establish that a side effect failed. Retrying blindly can duplicate external actions.

Use stable task and action IDs, persist attempted actions, and reconcile ambiguous outcomes. Separate proposing an action from permission to execute it. Text found in a retrieved document should not become a new tool authority.

### Loops require an evaluator

A measurable progress variable might be failing tests remaining, required evidence collected, or unresolved schema errors. A plan becoming longer is not necessarily progress. If a candidate and its evaluator share the same blind spot, repeated self-review can reinforce an error. Independent executable checks or grounded evidence provide stronger feedback where available.

The code implements a finite retrieve-answer-verify loop using deterministic local functions and a strict step budget. It demonstrates orchestration semantics, not LLM intelligence. In a real system, only the proposal function needs to be replaced by a model interface; validation and budget enforcement should remain inspectable code.

Optional application: make the proposal function repeatedly request an unavailable document. Verify that the loop stops with an explicit incomplete result rather than spinning forever or fabricating evidence.

#### An ambiguous timeout needs reconciliation

Suppose a tool creates a ticket but the network response is lost. The loop observes a timeout, not proof of failure. If it retries with a new request identity, two tickets may be created. A stable idempotency key or a lookup by the original action ID permits reconciliation. In contrast, repeating a pure local schema check is harmless. Classify tool actions by effects before designing retries. A language model's confidence that a call failed does not substitute for the service's observable state.


## A graph has two kinds of relationship

A control-flow edge says which node may run next. A data-flow edge says which information a node receives. In a retrieve-answer-review workflow, the reviewer may need the original question, selected evidence, and candidate answer even if it does not execute immediately after every retrieval operation. Drawing only a line of calls can hide missing evidence paths.

A node contract specifies inputs, outputs, validation, side effects, and failure behavior. A retrieval node emits source IDs and passages. A drafting node emits claims and citations. A deterministic validator checks schema and citation existence. A broader evaluator may assess support. These checks provide different evidence and should not be collapsed into one opaque approved flag.

## Bounded loops need a progress measure

For a software repair task, failing independent tests can be a progress measure. For evidence collection, unresolved required facts can be counted. For an answer contract, missing required fields can be checked. A longer explanation is not necessarily progress, and a larger number of tool calls is not a quality metric.

A progress measure can be incomplete. A program can pass tests while violating untested requirements. That limitation does not make testing useless; it means the measure's coverage must be understood. Protect the evaluator from being casually weakened by the same loop that seeks to improve the candidate.


### Executable calculation

Run `python examples/45_agent_loops_graphs.py` from the package root. Complete source is also included as [45_agent_loops_graphs.py](../examples/45_agent_loops_graphs.py).

```python
state = {'evidence': {}, 'answer': None, 'steps': 0, 'status': 'running'}
store = {'doc-2': 'Current port is 8443.'}
while state['steps'] < 3 and state['status'] == 'running':
    state['steps'] += 1
    if not state['evidence']:
        state['evidence']['doc-2'] = store['doc-2']
    elif state['answer'] is None:
        state['answer'] = {'port': 8443, 'evidence_id': 'doc-2'}
    else:
        candidate = state['answer']
        valid = candidate['evidence_id'] in state['evidence'] and str(candidate['port']) in state['evidence'][candidate['evidence_id']]
        state['status'] = 'verified' if valid else 'failed'
if state['status'] == 'running':
    state['status'] = 'budget_exhausted'
assert state['status'] == 'verified'
print(state)
```

Recorded output on the checked Python/NumPy environment:

```text
{'evidence': {'doc-2': 'Current port is 8443.'}, 'answer': {'port': 8443, 'evidence_id': 'doc-2'}, 'steps': 3, 'status': 'verified'}
```


## Reconcile before retrying a side effect

A timeout may mean a request failed before reaching a service, or that it succeeded and its response was lost. These cases look similar to a client but require different actions. If the effect is creating a ticket, retrying with a new identity can create duplicates. If the effect is reading a local document, a repeated read is normally much less consequential.

A stable idempotency key ties retries to one intended action when the service supports it. A lookup by the original action ID can resolve an ambiguous outcome. The surrounding application should preserve that identity and evidence. A model's narrative confidence cannot replace a query of actual state.

## An improvement loop changes a persistent object

Revising one answer, modifying an orchestration prompt, storing a reusable note, and updating model weights are four different changes. Ask what persists after the iteration ends. The answer determines what an improvement claim could mean and how it should be evaluated.

A repaired answer can be a successful task result without evidence that the base model became more capable. A better prompt can improve a particular workflow without changing weights. A weight update can change behavior broadly, including unwanted regressions. These distinctions prevent a useful local engineering technique from being promoted into an unsupported universal claim.

## Design the stop condition before the first iteration

A loop can stop because the task is verified, because required evidence is unavailable, because a budget is exhausted, or because repeated attempts make no progress. These outcomes should not be collapsed into a single done flag. A completed result and a well-explained inability to complete are different artifacts, both potentially correct under the task contract.

For the port question, verification requires an authoritative current source and a supported answer. Exhausting retrieval attempts without that source should preserve an insufficient-evidence status. For a code task, a candidate can pass the available tests while still awaiting a required manual review; the state should retain that pending requirement rather than treating a green test run as a universal completion signal.

A retry budget can be expressed in calls, tokens, elapsed time, or estimated cost. Choose units that match the resource constraint and record them visibly. A model's proposal to continue should not silently reset its own budget. Similarly, a graph transition should not discard the best verified artifact merely because a later unverified candidate was generated.

Independent checks can be deterministic where the task allows them. A schema check can verify required fields. A source lookup can verify a citation ID exists. An executable test can check specified behavior. A broader judgment may still require a probabilistic evaluator or a person, but preserving the deterministic evidence reduces what that judgment must infer.

The same structure helps improvement experiments. Name the candidate being changed, preserve its predecessor, record evaluation data and settings, and decide what evidence is required to accept a change. Reverting an update is much easier when the system saved exact versions rather than only a narrative saying it improved. This is an ordinary engineering discipline with particular value in probabilistic systems.

## Recursive improvement, self-training, self-play, and evidence

### Specify what persists between iterations

An improvement loop can revise an answer, change a prompt, store memory, generate training data, tune weights, or modify an orchestration program. These are different interventions. A better answer in one session is not evidence that the underlying model weights improved. A stored skill is not the same as a new learned representation.

A credible experiment names the object being changed, the proposal mechanism, the evaluator, the persistence mechanism, and the held-out measurement. Keep versions so a failed update can be diagnosed and reverted. Measure resource cost as well as task score.

### Selection can overfit a checker

Suppose many candidates have equal true quality but noisy measured scores. Selecting the largest measured score preferentially selects positive noise. Evaluating the selected candidate on independent data often produces a lower score. This selection effect grows with the number of candidates and can mimic progress.

For iid binary success outcomes, a sample mean has standard error approximately $\sqrt{p(1-p)/n}$ under the usual large-sample approximation. Repeatedly selecting improvements based on tiny differences within that noise can produce a misleading staircase. Independent held-out tasks and final evaluation reduce this specific failure mode, though they do not solve every distribution shift.

### Self-training changes the data distribution

Generating candidate solutions, filtering with a verifier, and training on accepted examples can improve a targeted skill when the generator produces useful diversity and the verifier is reliable. If errors pass the filter or rare modes disappear, later training can reinforce mistakes and narrow coverage. Synthetic data quality and diversity need explicit measurement.

Self-play creates tasks through interaction among policies or roles. It can generate a curriculum, but success in a closed game need not transfer to external tasks. Ground the evaluation in the intended deployment problem, and keep task generation separate from final test construction.

### Distinguish evidence from extrapolation

Bounded iterative refinement with external tests is an established engineering pattern. Open-ended claims of unlimited recursive improvement require much stronger evidence about generalization, evaluator validity, resource scaling, and persistent capability change. A rising internal score alone does not establish those claims.

The example uses two independent noisy datasets to show selection optimism. Candidate true qualities are all equal. Choosing the highest development score yields an apparently improved winner, while its independent test score has no reason to retain that noise advantage. This is a controlled counterexample to the inference 'the loop found a higher score, therefore it improved capability.'

Optional application: give candidates genuinely different true qualities and vary evaluation sample size. Observe when selection begins to recover the better candidate reliably. This connects statistical power to improvement-loop design.

#### Improvement claims need a preserved external task

If iteration one is scored on arithmetic and iteration two on easier formatting tasks, a higher score is not evidence of general capability improvement. If the loop edits its own tests, passing more tests can reflect weakened requirements. Preserve an independent evaluation target and version its data. Allow the system to propose new tests, but distinguish those exploratory tests from the held-out measurement. A rigorous improvement claim identifies the changed artifact, the unchanged measurement, the resource budget, and uncertainty across repeated runs.


## Selection noise can imitate a staircase of progress

Imagine fifty candidate prompts with identical true quality. Evaluate each on a small noisy development set and select the highest score. The winner tends to have unusually favorable noise. Re-evaluate it on independent examples and that advantage often shrinks. Nothing paradoxical occurred: selection used both quality and noise, even though quality was constant.

If every new iteration chooses the best among many candidates on the same small set, reported development scores can rise while independent performance remains flat. A preserved test set and repeated evaluations help expose this effect. The amount of uncertainty depends on sample size, clustering, and the selection process.


### Executable calculation

Run `python examples/50_recursive_self_improvement.py` from the package root. Complete source is also included as [50_recursive_self_improvement.py](../examples/50_recursive_self_improvement.py).

```python
import numpy as np
rng = np.random.default_rng(50)
candidates, trials = 50, 100
true_probability = .6
development = (rng.random((candidates, trials)) < true_probability).mean(axis=1)
independent_test = (rng.random((candidates, 10000)) < true_probability).mean(axis=1)
winner = development.argmax()
print('selected candidate', int(winner), 'development', development[winner])
print('independent test', independent_test[winner], 'true quality', true_probability)
assert development[winner] >= development.mean()
```

Recorded output on the checked Python/NumPy environment:

```text
selected candidate 19 development 0.69
independent test 0.5962 true quality 0.6
```


## Self-generated training data needs an external question to answer

A model can generate candidate solutions, filter them with a verifier, and train on accepted examples. This can be useful when the generator explores valuable cases and the verifier supplies reliable discrimination. It can also amplify mistakes, remove rare modes, or overfit a narrow checker. The process is not automatically improving merely because it is recursive.

Record which data were generated, which filters were applied, which model produced them, and how final evaluation remains independent. In self-play, distinguish mastery of the self-created game from transfer to the intended task. Persistent artifacts and provenance make these distinctions inspectable.

## Run a bounded loop in the companion

The **Loops and improvement** experiment executes a local retrieve-draft-verify process under a visible step budget. You can remove evidence or reduce the budget and observe an explicit incomplete result. A second view shows how selecting the largest noisy development score can exaggerate measured quality. Neither experiment calls a remote model or sends an external action.

An execution log and a durable task summary have different purposes. The log preserves detailed events for diagnosis. The summary preserves the compact state needed to continue work. A good summary retains exact action identities, verified results, unresolved outcomes, and source provenance. It can omit redundant prose while keeping the log accessible. If compression drops whether an external action already succeeded, the next iteration can repeat it incorrectly. Treat summary construction as an information transformation whose adequacy can be tested by continuation tasks.

A checkpoint should preserve unresolved outcomes explicitly so another iteration can reconcile them safely.

Reset clears the loop state and restores the deterministic fixture. Navigation disposes the previous experiment's listeners so repeated entry does not multiply actions. These ordinary software responsibilities are part of a trustworthy agent harness. The next chapter examines evaluators themselves: how to compare systems without allowing style, order, or reused test data to decide the result accidentally.
