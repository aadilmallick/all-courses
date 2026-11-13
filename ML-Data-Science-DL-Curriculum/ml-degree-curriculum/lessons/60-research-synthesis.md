# 60. Research literacy, reproducibility, and a degree scale study plan

[Previous](59-capstone.md) · [Course index](../README.md)

## Treat a paper as an argument to reconstruct

Read the problem definition and assumptions before the architecture diagram. Identify the objective, model class, optimization, data protocol, comparison budget, and evaluation metric. A claimed improvement can depend on any of them. Translate one central equation into dimensions and one executable example. Distinguish a theorem, an approximation, an empirical observation, and a suggested explanation.

A replication attempts to reproduce a stated result under closely matched conditions. A reproduction in a different implementation or environment may test a broader claim, but also introduces differences. Report failures as precisely as successes. A model that runs without exceptions has passed an execution check, not necessarily a scientific replication.

## A suggested four-semester sequence

| Semester | Core lessons | Evidence of mastery |
|---|---|---|
| 1 | 01–16 | Python arrays, proof habits, linear algebra, calculus, probability, inference, valid data protocol |
| 2 | 17–32 | Derive and implement classical estimators, compare honestly, explain unsupervised and sequence objectives |
| 3 | 33–48 | Backpropagation, PyTorch training, CNNs, sequence models, transformers, memory and deployment |
| 4 | 49–60 | Graphs, representation learning, generative models, RL, responsible decisions, capstone and research |

This is a self-study plan with undergraduate breadth in ML and advanced electives. It is not an accredited degree and does not replace the full mathematics, systems, breadth, and supervised assessment of a university program. Allocate time according to the derivations and projects, not a promise that every chapter can be mastered in one sitting.

A flexible rhythm is two study sessions for concepts and derivations, one for coding, and one for application or debugging. Revisit prerequisite chapters when an equation's domain, shape, or justification is unclear. Mathematical fluency grows by reconstructing results and diagnosing mistakes, not simply recognizing notation.

## Optional cumulative applications

After semester one, derive a probabilistic prediction and a confidence procedure from a small dataset. After semester two, implement a supervised and unsupervised model and explain their objectives. After semester three, train a tiny model, audit its backward pass, and demonstrate causal masking. After semester four, complete the integrated capstone and critique one paper using its original sources.

These are optional application opportunities with increasing scope. Worked examples remain in the text; open tasks need an independent attempt to reveal reasoning gaps. Use the [assessment guide](../ASSESSMENTS.md) for hints and acceptance criteria.

## Reproducibility as part of understanding

A seed controls one source of randomness. Data ordering, library versions, parallel execution, hardware kernels, and floating-point formats can also change results. Save split identities and environment details. Compare values with justified tolerances, and separate numerical differences from changed scientific conclusions.

The archive includes a machine-generated structural and execution report. It reports which programs ran, which checks passed, and which dependency tracks were unavailable. It cannot guarantee that every equation or interpretation is error-free. A useful learning resource makes its verification inspectable so a reader can challenge and improve it.

## How to keep learning beyond this course

Choose one extension and ask a precise question. Examples include how a covariance assumption changes uncertainty, how a different graph affects smoothness, how a loss weights rare events, or how a denoising schedule changes an estimator. Read primary sources, reconstruct a small instance, and measure a controlled comparison. Keep the question narrow enough that the result can be interpreted.

Your final outcome should be a portfolio of derivations, hand traces, numerical checks, and complete implementations. That portfolio demonstrates more than familiarity with model names: it shows the ability to connect a claim, an equation, a program, and the evidence supporting its use.
