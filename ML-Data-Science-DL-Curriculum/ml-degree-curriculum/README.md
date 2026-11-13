# Machine learning, data science, and deep learning from first principles

A self-contained, undergraduate-style study curriculum built around **60 core Markdown lessons**, **7 extended PyTorch workshops**, from-scratch NumPy implementations, numerical laboratories, optional application work, and a capstone. Start with mathematical notation and Python arrays; build to classical ML, deep networks, NLP, graphs, generative models, reinforcement learning, and reproducible engineering.

The central learning goal is to connect four views of every important idea: a plain-language problem, a mathematical definition and derivation, a small hand trace, and an executable implementation. A library call is introduced as an implementation of a defined procedure. Assumptions, dimensions, edge cases, and the limits of an analogy are part of the teaching.

This is undergraduate breadth in ML with selected advanced electives, not an accredited degree or an exhaustive treatment of every published algorithm. The curriculum does not claim to be error-free. Its checks and unexecuted tracks are recorded transparently in [VALIDATION.md](VALIDATION.md).

## Begin here

Read lessons in numerical order. Basic arithmetic and willingness to read code are enough to begin; linear algebra, calculus, and probability are rebuilt before algorithms use them. If you already know Python, skim lesson 01 and keep its shape and experiment conventions. Equations use natural logarithms unless stated otherwise.

1. Open [lesson 01](lessons/01-scientific-python.md).
2. Keep [NOTATION.md](NOTATION.md) nearby for symbols and shape conventions.
3. Run the core demonstrations before adding framework dependencies.
4. Use the [optional applications and capstone criteria](ASSESSMENTS.md) to practice reconstruction.

The source primers are organized in [SOURCE-MAP.md](SOURCE-MAP.md). The primary references and research scope are documented in [SOURCES.md](SOURCES.md). The package contains the teaching text and code; access to the original websites is not necessary for the core reading path.

## Setup and execution

Use Python 3.10 or later in an isolated environment. From this folder:

```bash
python -m venv .venv
# Activate using the command for your shell.
python -m pip install -r requirements.txt
python code/classical/demo.py
python code/classical/advanced.py
python code/classical/extended.py
python code/classical/project.py
python code/neural/run_all.py
python -m unittest discover -s tests -p 'test_*.py' -v
python -m unittest discover -s tests/neural -p 'test_*.py' -v
python tools/verify_course.py
python tools/check_consistency.py
```

The core mathematical implementations and neural autodiff examples use NumPy and run on CPU. `extended.py` and `project.py` use scikit-learn. No local example requires a private dataset, model API key, or remote model download. Some optional framework discussions explain pretrained model downloads without requiring them for the base route.

For the PyTorch workshops, install a build suitable for your OS and hardware using the [official installation selector](https://pytorch.org/get-started/locally/). Then run `python code/pytorch/check_runtime.py` and the desired example. PyTorch was unavailable in the authoring environment, so those programs were syntax checked but were not executed in this run. CUDA, multi-GPU, and fused-kernel claims are not benchmarked here. Do not install a random CUDA build solely to match prose in a lesson.

Library versions used for executed checks are in VALIDATION.md. `requirements.txt` states broad API expectations; `environment-tested.txt` records the exact authoring versions and is an audit record, not a portable guarantee that every platform can install identical packages.

## Reading order

### Mathematical and scientific foundations

| Lesson | Chapter |
|---|---|
| 01 | [The scientific learning process and Python laboratory](lessons/01-scientific-python.md) |
| 02 | [Algebra, functions, notation, and proof habits](lessons/02-algebra-notation-proofs.md) |
| 03 | [Vectors, matrices, geometry, and computational shapes](lessons/03-vectors-matrices.md) |
| 04 | [Eigenvectors, SVD, least squares, and numerical conditioning](lessons/04-spectral-linear-algebra.md) |
| 05 | [Limits, derivatives, integrals, and local approximation](lessons/05-single-variable-calculus.md) |
| 06 | [Partial derivatives, Jacobians, Hessians, and matrix calculus](lessons/06-multivariable-calculus.md) |
| 07 | [Probability, conditional reasoning, and Bayes theorem](lessons/07-probability-conditioning.md) |
| 08 | [Random variables, distributions, expectation, and covariance](lessons/08-random-variables-distributions.md) |
| 09 | [Estimation, likelihood, Bayesian inference, and uncertainty](lessons/09-statistical-inference.md) |
| 10 | [Entropy, divergence, likelihood, and loss functions](lessons/10-information-losses.md) |
| 11 | [Convexity, gradient descent, stochastic optimization, and Adam](lessons/11-optimization.md) |
| 12 | [Generalization, inductive bias, bias variance, and double descent](lessons/12-learning-theory.md) |
| 13 | [Dataset splits, cross validation, leakage, and model selection](lessons/13-splits-cross-validation.md) |
| 14 | [Data exploration, missing values, features, and scaling](lessons/14-data-preparation.md) |
| 15 | [Sampling, class imbalance, weighting, and decision thresholds](lessons/15-sampling-imbalance.md) |
| 16 | [Filtering, annotation agreement, privacy, and data provenance](lessons/16-data-quality-privacy.md) |

### Classical machine learning and statistical models

| Lesson | Chapter |
|---|---|
| 17 | [Linear regression from geometry to a tested implementation](lessons/17-linear-regression.md) |
| 18 | [Ridge, lasso, elastic net, and regularization geometry](lessons/18-regularized-regression.md) |
| 19 | [Logistic regression and multiclass softmax regression](lessons/19-logistic-softmax.md) |
| 20 | [Evaluation metrics, calibration, costs, and uncertainty](lessons/20-metrics-calibration.md) |
| 21 | [Nearest neighbors, distances, and high dimensional geometry](lessons/21-nearest-neighbors.md) |
| 22 | [Naive Bayes, discriminant analysis, and generative classification](lessons/22-generative-classifiers.md) |
| 23 | [Margins, support vector machines, kernels, and Gaussian processes](lessons/23-svm-kernels-gaussian-processes.md) |
| 24 | [Decision trees, impurity, recursive partitioning, and pruning](lessons/24-decision-trees.md) |
| 25 | [Bootstrap aggregation, random forests, and ensemble variance](lessons/25-bagging-random-forests.md) |
| 26 | [AdaBoost, gradient boosting, and second order tree boosting](lessons/26-boosting.md) |
| 27 | [A complete classical ML experiment and model comparison](lessons/27-classical-ml-project.md) |
| 28 | [PCA, low rank approximation, and matrix factorization](lessons/28-pca-factorization.md) |
| 29 | [K means, medoids, fuzzy clustering, and objective descent](lessons/29-partition-clustering.md) |
| 30 | [Hierarchical, density, and spectral clustering](lessons/30-density-hierarchical-spectral.md) |
| 31 | [Gaussian mixtures, EM, and probabilistic topic models](lessons/31-mixtures-latent-variables.md) |
| 32 | [Hidden Markov models, sequence inference, and time series](lessons/32-hmm-time-series.md) |

### Neural learning and systems

| Lesson | Chapter |
|---|---|
| 33 | [Neural networks and reverse mode differentiation](lessons/33-neural-networks-backprop.md) |
| 34 | [Activation functions and variance preserving initialization](lessons/34-activations-initialization.md) |
| 35 | [Dropout, normalization, residuals, and neural regularization](lessons/35-dropout-normalization-residuals.md) |
| 36 | [A complete PyTorch data, training, evaluation, and checkpoint workflow](lessons/36-pytorch-training.md) |
| 37 | [Convolutional networks, separable filters, and visual learning](lessons/37-convolutional-networks.md) |
| 38 | [Recurrent networks, LSTMs, GRUs, and packed sequences](lessons/38-recurrent-networks.md) |
| 39 | [NLP tasks, linguistic preprocessing, and text baselines](lessons/39-nlp-tasks-preprocessing.md) |
| 40 | [Subword tokenization, embeddings, and representation geometry](lessons/40-tokenization-embeddings.md) |
| 41 | [Attention from weighted retrieval through full backpropagation](lessons/41-attention-derivation.md) |
| 42 | [Attention masks, positions, multihead attention, and GQA](lessons/42-masks-position-multihead.md) |
| 43 | [Transformer blocks and encoder decoder architecture choices](lessons/43-transformer-architectures.md) |
| 44 | [Implement and train a tiny transformer with a numerical autodiff engine](lessons/44-build-train-transformer.md) |
| 45 | [Translation, generation, caching, and language model evaluation](lessons/45-translation-decoding-evaluation.md) |
| 46 | [Transfer learning, fine tuning, LoRA, and hypernetworks](lessons/46-finetuning-hypernetworks.md) |
| 47 | [FlashAttention, accumulation, checkpointing, and memory budgets](lessons/47-efficient-attention-memory.md) |
| 48 | [Distributed training, mixed precision, quantization, and deployment](lessons/48-distributed-deployment.md) |

### Advanced models, responsible practice, and synthesis

| Lesson | Chapter |
|---|---|
| 49 | [Graph theory, knowledge graphs, and graph neural networks](lessons/49-graphs-knowledge-gnn.md) |
| 50 | [Self supervised, contrastive, and multimodal representation learning](lessons/50-self-supervised-representations.md) |
| 51 | [Autoencoders, variational inference, and adversarial generation](lessons/51-vae-gan.md) |
| 52 | [Continuous diffusion, denoising objectives, and reverse sampling](lessons/52-continuous-diffusion.md) |
| 53 | [Discrete diffusion and masked language generation](lessons/53-discrete-diffusion-language.md) |
| 54 | [Reinforcement learning, Bellman equations, and value based methods](lessons/54-rl-values.md) |
| 55 | [Policy gradients, actor critic, advantage estimation, and PPO](lessons/55-rl-policy-gradients.md) |
| 56 | [Reward modeling, preference optimization, and reinforcement fine tuning](lessons/56-reinforcement-finetuning.md) |
| 57 | [Recommendation, anomaly detection, and semi supervised learning](lessons/57-recommendation-anomaly-semisupervised.md) |
| 58 | [Interpretability, causal reasoning, fairness, and reliable decisions](lessons/58-interpretability-causality-fairness.md) |
| 59 | [The integrated undergraduate ML capstone](lessons/59-capstone.md) |
| 60 | [Research literacy, reproducibility, and a degree scale study plan](lessons/60-research-synthesis.md) |

## Extended implementation workshops

The seven workshops are longer implementation treatments that accompany the core reading order. They retain their own internal workshop numbering. Some sections also appear within core chapters for continuity; the word inventory therefore is not a count of unique prose.

| Workshop | Use alongside |
|---|---|
| [Tensors and Python](workshops/01-foundations-and-tensors.md) | 01–06 |
| [Gradients and networks](workshops/02-gradients-and-neural-networks.md) | 19, 33–35 |
| [Data, training, and evaluation](workshops/03-data-training-and-evaluation.md) | 13–20, 36 |
| [Vision and transfer](workshops/04-vision-audio-and-transfer-learning.md) | 35, 37, 46 |
| [Sequences and transformers](workshops/05-sequences-attention-and-transformers.md) | 38–46 |
| [Advanced objectives](workshops/06-advanced-autograd-and-ai-objectives.md) | 50–56 |
| [Performance and deployment](workshops/07-performance-distributed-and-deployment.md) | 47–48 |

## How to read the code

`code/classical/models.py` contains transparent fitting and inference routines. `lesson_17.py` and the other exported laboratory files are standalone copies with tiny examples; their numbering matches core lessons. `advanced.py` contains complete finite experiments for GCN gradients, hypernetworks, dropout, denoising, matrix factorization, and label propagation. `project.py` demonstrates cross-validation selection and a final test.

`code/neural/core.py` is a numerical reverse-mode autodiff engine and tiny causal decoder. Its numbered examples retain the original demonstration numbers, which differ from core chapter numbers; follow the command shown in each chapter. The two alignment programs actually train tiny models. These are educational models, not pretrained large models or substitutes for production frameworks.

Some examples use intentionally synthetic features, exact tiny probabilities, or oracle signals to isolate an operation. Their text states that scope. A successful array check does not establish learned image understanding, reliable control, or production capability.

`code/pytorch/` contains framework examples corresponding to the workshops. A displayed fragment is a continuation when its surrounding text says so; complete files are the preferred execution target.

## Verification commands

Run `python tools/run_validation.py` for the supported CPU demonstration and test suites. For selected exact algebraic checks, install `requirements-verification.txt` and run `python tools/check_math.py`. The latest findings are in [VERIFICATION.md](VERIFICATION.md). Code-listing consistency is checked separately from syntax so copied programs cannot silently drift from their executable files.

## Depth and verification

All 60 lesson files contain finished instructional content rather than reserved outlines. Length varies substantially by topic, and the default 5,000-model-token-per-lesson depth target was not certified. A compatible model tokenizer was unavailable, and the conservative 5,000-whitespace-word proxy is not met for every chapter. Per-file word counts and bytes are provided rather than mislabeled as model tokens. Several mathematical and classical chapters are shorter than that target; use their complete laboratories and linked prerequisites, and do not interpret the file count as uniform textbook depth.

The curriculum integrates and revises material from the user's existing learning packages; see [PROVENANCE.md](PROVENANCE.md). No old validation claim is carried forward as proof of execution in this run. The current validation report distinguishes what ran, what was checked numerically, and what remains unverified.
