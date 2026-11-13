# 59. The integrated undergraduate ML capstone

[Previous](58-interpretability-causality-fairness.md) · [Course index](../README.md) · [Next](60-research-synthesis.md)

## One portfolio project with several connected investigations

The capstone is a reproducible repository that compares mathematical models under one clear question and extends to a structured-data modality. Use a public dataset you can legally redistribute or generate all data locally. The supplied reference project uses bundled and synthetic data so no private information or remote model account is required.

The core question is binary or multiclass prediction from a table. Add one extension: document classification, a temporal prediction, graph node classification, or a tiny generated sequence task. These connect the early statistical foundations to the later architectures while keeping the protocol auditable.

## Milestone 1: reconstruct the objective

Write the prediction time, observation unit, target, deployment population, and split rule. Define each chosen loss with domains, dimensions, and reduction. For a linear model, derive the gradient from individual coordinates. For a neural model, trace a full path from an output residual to an early weight. Show one hand-calculated update and compare it with executable values.

The mathematical deliverable is not a copied formula sheet. Explain each transformation, the role of every assumption, and one case where the claim fails. Include a numerical gradient check for one nontrivial composed objective at several non-kink points.

## Milestone 2: build two implementation levels

Implement at least three relevant models from scratch in NumPy: a linear or logistic model, a tree or neighbor model, and a clustering or latent-variable model. Then compare with a standard-library estimator under matched objective and preprocessing conventions. For neural extensions, compare a NumPy derivative calculation with PyTorch if installed.

Differences are evidence to investigate. Check loss scaling, intercept penalties, label encoding, initialization, convergence tolerances, and numerical precision before assuming a library is wrong. Require approximate prediction or objective agreement where a unique solution should agree. Do not require identical parameters in an unidentifiable factorization.

## Milestone 3: perform selection honestly

Use development cross validation for feature processing, hyperparameters, and threshold choices. Retain a final holdout until those decisions are frozen. Record search trials and a fixed compute budget. Compare with a trivial baseline and include uncertainty appropriate to the sampling units.

If performance is poor, diagnose learning curves and representative errors. Add one justified intervention, such as a better feature, class weighting, a nonlinear interaction, or an architecture suited to structure. Keep the original baseline and evaluate the intervention under the same protocol.

## Milestone 4: extend and stress the system

For text, compare sparse features with learned embeddings. For graphs, test equivariance and split leakage. For temporal tasks, use forward evaluation and inspect regime changes. For a generative task, verify conditioning and sampling separately from training loss. A small denoising or sequence task is a legitimate learning exercise when its scope is explicit.

Create stress cases: missing features, shifted scales, unknown categories or tokens, duplicate observations, empty input, a small subgroup, and near-boundary predictions. State intended behavior, observe actual behavior, and repair clear implementation failures. Do not modify an evaluation set to remove inconvenient but valid cases.

## Milestone 5: package a result someone else can run

Include setup instructions, exact data provenance, a split manifest, code, environment versions, saved preprocessing, model state, validation report, model card, and one command reproducing the main result. Evaluate load-save prediction equivalence. If an experiment requires PyTorch, CUDA, or distributed hardware, separate that dependency from the base CPU route.

The supplied `code/classical/project.py` demonstrates selection and evaluation, and `code/neural/sequence_alignment.py` demonstrates an actual tiny neural training pipeline. They are starting references, not substitutes for your own derivation and investigation.

## Assessment rubric

| Component | Points | Evidence |
|---|---:|---|
| Problem and data protocol | 20 | Availability cutoff, sampling unit, no leakage |
| Derivations | 20 | Shapes, assumptions, chain rule, hand trace |
| Implementations | 20 | Runnable code, edge cases, gradient or invariant checks |
| Evaluation | 20 | Baselines, selection separation, uncertainty, slices |
| Reproducibility and judgment | 20 | Re-run instructions, artifacts, limitations, decision rationale |

A high score requires coherent evidence across the components. A sophisticated architecture does not compensate for an invalid split, and a correct derivative does not establish that the target is meaningful.
