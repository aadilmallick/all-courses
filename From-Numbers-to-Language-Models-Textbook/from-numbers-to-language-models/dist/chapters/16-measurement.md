# Measuring what matters: judges, uncertainty, and reproducible research

## An evaluator can be useful without being an oracle

An LLM judge can compare answers quickly and recognize some semantic differences that exact string matching misses. It can also prefer longer prose, familiar style, or whichever answer appears first. The right starting point is to treat it as a measurement instrument whose behavior needs calibration and testing.

This is the same stance we used toward a numerical gradient checker. One successful comparison establishes a property at a point, not universal truth. For a judge, we need representative cases, clear criteria, independent reference judgments, and tests that can expose specific biases. Merely choosing a larger judge model does not eliminate these responsibilities.

## Decompose a vague quality score into observable criteria

For an evidence-based answer, separate correctness, completeness, support, citation accuracy, format compliance, and appropriate uncertainty. An answer might be factually right but cite the wrong passage. Another might cite valid passages while omitting a decisive exception. A single score can hide these differences and make a regression difficult to diagnose.

A rubric should define what each score means with concrete anchors. If partial credit is allowed, describe which missing elements reduce it. If evidence is insufficient, specify how abstention should be judged. Do not reward confident completion when the correct task behavior is to state that the answer cannot be established.

## LLM judges, ranking, agreement, and controlled experiments

### A judge is a measurement instrument

An LLM judge can score a response, compare a pair, or rank a list. It approximates a desired assessment and can be biased by order, length, style, identity, or persuasive but unsupported explanations. Its output is evidence about an evaluator's judgment, not ground truth by definition.

A rubric should define observable criteria and include anchors. For evidence-grounded answers, score factual support, completeness, citation correctness, and instruction compliance separately. A single 'quality' score can conceal which dimension changed.

### Pairwise order and ties

Presenting A before B may influence a judge. Evaluate both orders, map results back to candidate identity, and inspect disagreement. Permit ties and abstention where the rubric supports them. A forced winner can create artificial distinctions. Blind model identities when identity itself is not part of the criterion.

A Bradley-Terry fit models $P(i\succ j)=\sigma(s_i-s_j)$. Scores are identifiable only up to a common shift. Inconsistent comparisons do not disappear because a fitted ranking exists; inspect residuals and agreement on important subsets.

### Agreement is not correctness

For two binary raters, Cohen's kappa is $(p_o-p_e)/(1-p_e)$, where $p_o$ is observed agreement and $p_e$ is agreement expected from their marginal label rates. High agreement can coexist with shared systematic error. Kappa also depends on prevalence and should not replace task-specific analysis.

A human reference set should include representative hard cases, with adjudication for ambiguous criteria. Measure judge accuracy against that reference, repeatability across runs, order sensitivity, and drift across model versions. If the same judge generates training preferences and evaluates the resulting model, correlated bias can inflate apparent progress.

### Design a paired improvement experiment

Use the same held-out prompts for two systems. Randomize answer order, fix rubric and judge settings, and analyze results by domain and difficulty. Bootstrap independent units, not every sentence from a shared document as if independent. Report win/tie/loss counts alongside uncertainty and cost.

Reranking metrics such as NDCG evaluate graded relevance ordering. Their ideal ranking denominator depends on the relevance labels for that query. A higher NDCG does not directly imply a generator's answer is more factual; retrieval and generation remain distinct measurements.

The example computes kappa and demonstrates how position-swapped preference labels can expose inconsistency. The labels are illustrative input data, not results of actual model judging. This keeps the statistical computation reproducible without claiming an experiment that was never run.

#### Agreement can be high for a trivial judge

If 95 percent of examples are labeled acceptable, a judge that always says acceptable has 95 percent raw accuracy. It misses every unacceptable example. Report confusion counts and class-specific recall so this failure is visible. If both the reference and candidate rater have heavily skewed marginals, kappa can differ substantially from raw agreement. Neither statistic alone establishes usefulness for rare but consequential errors. Build a test set with enough examples of the failure modes the judge is intended to detect, then report results by category.


## Work a position-swap example

Suppose a judge prefers the first displayed answer in both presentations of a pair. In presentation one, candidate A is first and wins. In presentation two, candidate B is first and wins. If results are recorded only as left-wins, the bias can look consistent. Mapping decisions back to candidate identity exposes the contradiction.

Order swapping is a diagnostic, not a complete correction. A judge can consistently prefer the wrong factual claim under both orders. It can also disagree for legitimate reasons when a rubric is ambiguous. Inspect the content and reference evidence, and preserve ties or abstentions where the task warrants them.


### Executable calculation

Run `python examples/46_llm_judges.py` from the package root. Complete source is also included as [46_llm_judges.py](../examples/46_llm_judges.py).

```python
import numpy as np
first = np.array([1, 1, 0, 0, 1, 0, 1, 0])
second = np.array([1, 0, 0, 0, 1, 1, 1, 0])
observed = np.mean(first == second)
expected = first.mean()*second.mean()+(1-first.mean())*(1-second.mean())
kappa = (observed-expected)/(1-expected)
original_winner = np.array(['A', 'B', 'A', 'tie'])
swapped_identity_winner = np.array(['A', 'A', 'A', 'tie'])
consistent = original_winner == swapped_identity_winner
print('agreement', observed, 'kappa', kappa, 'order consistency', consistent.mean())
```

Recorded output on the checked Python/NumPy environment:

```text
agreement 0.75 kappa 0.5 order consistency 0.75
```


## Agreement and usefulness can diverge

On a set containing 95 percent acceptable outputs, an always-acceptable judge gets 95 percent raw accuracy. It misses every unacceptable output. If those rare failures are the purpose of the review system, the high accuracy is misleading. Report false acceptances and false rejections, not just the fraction of matching labels.

Kappa adjusts agreement relative to marginal label rates under its definition, but it is not a guarantee of correctness. Two raters can share a systematic error. A reference set itself can have ambiguous labels or narrow coverage. Measurement quality depends on the task and the collection process as well as the statistic.

## Pair the comparison before estimating uncertainty

Use the same prompts for systems A and B whenever the comparison permits it. Differences on a shared difficult prompt are more informative than unrelated samples whose difficulty varies. Bootstrap the independent sampling units. If several questions came from one document or user, resampling individual questions as independent can underestimate uncertainty.

An interval from a bootstrap procedure describes that procedure's sampling variability. It does not automatically account for contamination, evaluator bias, distribution shift, or errors in answer keys. List those uncertainties separately rather than implying one confidence interval has absorbed them all.

## A judge used for training should not be the only final measurement

If a model is optimized to please a particular judge and then evaluated only by that same judge, the result can reflect learned evaluator preferences. Independent human review, executable checks, source-grounded assessment, or another carefully validated measurement can reveal failures the training signal missed.

Different judges are not guaranteed to have independent errors. Several models trained on similar data can share biases. The goal is not merely to count evaluators but to obtain evidence with different failure modes and a clear relationship to the desired task.

## Distinguish a confidence interval from a guarantee about the world

Suppose a paired test reports an estimated improvement with a narrow bootstrap interval. That interval reflects resampling variability under the chosen examples and procedure. If the examples all come from one easy domain, the interval can be narrow while saying little about another domain. If both systems encountered the test data during tuning, the comparison can be systematically biased in a way the resampling does not reveal.

This does not invalidate uncertainty estimates. It identifies what additional evidence is needed. Use domain-stratified results, source-level splits, contamination checks where feasible, and independent task sets when claims extend beyond the initial sample. Explain which uncertainty each check addresses rather than announcing that all uncertainty has been eliminated.

A reproducible result also needs a preserved measurement definition. If one run counts ties as half-wins and another discards them, their reported win rates are not directly comparable. If a parser changes which answers count as valid, an apparent gain can come from measurement rather than model behavior. Version the rubric, parser, and reduction convention alongside model and prompt settings.

The practical objective is a conclusion another reader can assess: what changed, what was measured, how the measurement was checked, and where the conclusion stops. That is stronger than either unqualified confidence or an unstructured list of caveats.

## Read papers, reproduce claims, and design the next experiment

### Turn a paper's equation into a program specification

Start with the question, setting, assumptions, and claimed improvement. Identify what changes relative to a baseline. Separate an architectural change from a training-data change, a compute increase, and an evaluation change. A larger score after all four change does not isolate which intervention caused the gain.

For each equation, list symbol domains and shapes. State which variables are random, which are optimized, and which are fixed. Identify the expectation distribution and reduction convention. Expand one coordinate or one two-action case before implementing the vectorized version. Then check limits, units where meaningful, and degenerate cases.

### A reproducibility ladder

First reproduce a mathematical identity with tiny arrays. Next reproduce a local algorithmic behavior with a controlled toy task. Then reproduce a training trend under matched conditions. Finally reproduce a reported benchmark with documented data, model, compute, and evaluation versions. These are different levels of evidence. Passing the first does not imply the fourth.

A useful experiment manifest records code revision, dependency versions, random seeds, tokenizer, data split hashes, architecture, optimizer, schedule, precision, hardware, evaluation settings, and checkpoint identity. Some accelerated backends remain nondeterministic despite a seed. Report tolerances and repeated-run variation where relevant.

### Falsifiable hypotheses and ablations

'Adding a memory module helps' is too broad. A sharper hypothesis is: under a fixed model and token budget, retrieving source-grounded notes improves accuracy on questions whose evidence was absent from the live context, with no increase in unsupported citations. Specify the test set and failure criteria before examining results.

Ablate one factor at a time when feasible, and include a matched-cost baseline. If an agent uses five model calls while a baseline uses one, improved quality may reflect additional compute rather than the proposed topology. A fair comparison can report both fixed-budget and best-achievable tradeoffs.

### Audit uncertainty without paralysis

Classify statements as definitions, algebraic identities, theorems under hypotheses, empirical results, heuristics, or open questions. Do not promote a heuristic to a theorem by writing it as an equation. A measured result applies to its setup; its extension to another domain is an inference that needs testing.

The course's primary-paper index supports further reading. Its primer mapping records which supplied pages motivated each topic. The lessons are original instructional explanations; source pages are not copied as a substitute for derivation. Emerging recursive and physical-AI topics remain a moving research frontier.

### Reconstruct an independent check

The example checks the KL-regularized optimum identity from earlier lessons in two independent ways: closed-form exponential tilting and a grid search over a two-action simplex. The finite grid only approximates the optimum, so comparison uses a tolerance tied to grid spacing. This is the habit to carry into new work: state the property, construct an independent route, and interpret the residual honestly.

A next project could replace one toy component with a trained public model while preserving the same contracts and tests. Choose one capability to measure deeply before adding more architecture.

#### A published effect and a causal explanation are different claims

A reported benchmark gain establishes an empirical observation under a particular setup, subject to its measurement quality. Explaining that gain requires comparisons that isolate the proposed mechanism. If a sparse model gains accuracy but also uses more total parameters and different data, the mechanism is underdetermined. Reproduce the observation, then test competing explanations with controlled ablations. Record unsuccessful experiments too: omitting them can exaggerate confidence in the chosen story. This is the research analogue of the course's independent numerical checks.


## Read one equation as an executable specification

When encountering an expectation, identify its sampling distribution before implementing an average. When encountering a KL term, identify its direction and support. When encountering a loss sum, identify which positions are included and how reduction weights examples. These decisions can change the optimized function while leaving code syntactically correct.

Then write a tiny instance whose answer you can derive independently. Two actions reveal policy signs. Two keys reveal attention normalization. Unequal lengths reveal mistaken reductions. Repeated token IDs reveal scatter-accumulation errors. The purpose of a small example is to expose structure, not to imitate a large benchmark's realism.


### Executable calculation

Run `python examples/54_research_reproducibility.py` from the package root. Complete source is also included as [54_research_reproducibility.py](../examples/54_research_reproducibility.py).

```python
import numpy as np
from core import softmax
reference = np.array([.6, .4])
reward = np.array([0., 1.])
beta = .7
closed = softmax(np.log(reference)+reward/beta)
grid = np.linspace(.0001, .9999, 10001)
policy = np.stack([1-grid, grid], axis=1)
objective = policy @ reward-beta*np.sum(policy*np.log(policy/reference), axis=1)
best = policy[objective.argmax()]
assert np.max(np.abs(best-closed)) < .0002
print('closed form', closed, 'grid optimum', best)
```

Recorded output on the checked Python/NumPy environment:

```text
closed form [0.26442277 0.73557723] grid optimum [0.26444712 0.73555288]
```


## Separate reproduction levels

Reproducing an algebraic identity, reproducing a local algorithm on a toy task, reproducing a learning trend, and reproducing a published benchmark are different accomplishments. Each requires additional evidence. A correct loss function is necessary for a training reproduction but insufficient if the data, optimizer, model, and evaluation differ.

An experiment record should state code revision, dependency versions, random seeds, model and tokenizer identity, data splits, objective, optimizer, precision, hardware, and evaluation configuration. A seed makes some processes repeatable but does not force every parallel backend to be deterministic. Compare outcomes with tolerances and repeated runs where the problem requires them.

## Design an ablation that could change your conclusion

Suppose a new agent graph uses five model calls while a baseline uses one. Higher quality could arise from extra compute rather than the graph's organization. Compare at a fixed call or token budget, and also report best-achievable quality versus cost if that is relevant. A good ablation addresses a competing explanation rather than merely removing a component until performance falls.

For recurrent transformers, compare fixed-parameter and fixed-compute settings. For RAG, compare ordinary and oracle context. For preference tuning, evaluate both target preferences and retained task ability. For visual models, test relations and small details directly rather than inferring them from broad scene recognition.

## Use the companion as a measurement sandbox

The **Judges and evidence** experiment calculates agreement, class-specific outcomes, calibration loss, and order consistency from visible small fixtures. Change one label or probability and observe which statistics change. A high agreement score can coexist with poor recall for an important class; the interface displays both to make that failure visible.

The book's own verification report follows the same discipline. Structural checks establish that chapters and assets resolve. Numerical tests establish selected equations and invariants. Browser inspection establishes observed rendering and interaction on the tested browser. These layers do not merge into a claim of error-free universal correctness.

Text-overlap metrics answer a narrower question than factual support. A correct paraphrase can have low overlap, and a fluent unsupported answer can reuse many reference words. Choose metrics that match the claimed improvement and retain examples that expose their blind spots.

We have now studied text models, their training signals, and the systems around them. The final part extends the same principles to images, repeated latent computation, and physical actions. New modalities introduce new representations and objectives, while the obligations to define shapes, information access, and evidence remain.
