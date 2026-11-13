# Validation, execution scope, and lesson inventory

Current verification: **2026-11-12 (America/New_York)**. Read [VERIFICATION.md](VERIFICATION.md) for the corrections and remaining limitations. Exact outputs and return codes are in [execution-results.json](execution-results.json).

## Supported execution

| Check | Result | What it establishes |
|---|---|---|
| CPU demonstration programs | 76 passed | 18 classical scripts, 56 neural programs, and 2 Python-only workshop programs |
| Classical and advanced tests | 18 passed | Numerical gradients, KKT checks, HMM enumeration, and finite learning experiments |
| Verification regression tests | 18 passed | Fixed input-contract and final-parameter consistency cases |
| Independent estimator comparisons | 8 passed | Agreement with installed library implementations under matched conventions |
| Autodiff and tiny transformer tests | 10 passed | Derivative composition, all parameter families, causal behavior, and fitting |
| Symbolic identity checks | 33/33 passed | Selected exact scalar and low-dimensional formulas |
| Source/listing consistency | 34 definitions and 20 complete listings matched | Displayed teaching code agrees with canonical executable source |
| Python syntax | All files and Python Markdown blocks parsed | Does not establish runtime behavior |
| Structural checks | Local links, referenced script paths, fences, controls, math delimiters, numbering, and source-map count passed | Does not establish external-link availability or rendered mathematical correctness |

Recorded library versions: Python 3.12.14, NumPy 2.3.5, SciPy 1.17.0, scikit-learn 1.8.0, and SymPy 1.14.0. A physical-core discovery warning in scikit-learn falls back to logical cores; the affected checks completed successfully.

Re-run from the course root:

```bash
python tools/run_validation.py
python tools/verify_course.py
python tools/check_consistency.py
python tools/check_math.py
```

The final command requires SymPy, supplied by `requirements-verification.txt`. The runner records unavailable optional checks explicitly. A successful supported route does not mean those skipped tracks passed.

## Explicitly unverified tracks

- PyTorch runtime execution, CUDA, multi-process framework training, compilation, export, server integration, and real GPU FlashAttention kernels were not run.
- The finite NumPy transformer, denoisers, policy experiments, and graph computations do not establish the quality of a large model, translator, image generator, recommender, or real controller.
- Some demonstration features or signals are synthetic or explicitly oracle-supplied. Those programs isolate a calculation rather than establish a trained capability.
- The discrete denoiser is a learned finite table under a simplified fixed-time objective, not a full diffusion-LLM pipeline. The online softmax is a numerical algorithm, not a GPU kernel benchmark.
- Scalar Gaussian-mixture EM is implemented from scratch. Topic LDA, spectral clustering, discriminant analysis, and kernel SVM use library comparisons rather than full custom production engines.
- Statistical, causal, privacy, and fairness conclusions still require the hypotheses in their lessons. Numerical passing cases do not establish those hypotheses on arbitrary real-world data.
- Source-topic mapping is complete for the 47 supplied links, but every primer subsection and every equation in this curriculum has not received an exhaustive formal audit.

## Length and depth

There are 60 core lessons with **93,969 whitespace-separated words**, ranging from **479** to **5,953** per lesson. Seven workshops contain **35,801** additional words. The counts include code, output, and overlapping workshop passages, so they are not unique-prose counts.

**55/60 lessons are below the conservative 5,000-whitespace-word proxy.** A compatible model tokenizer was unavailable; exact per-lesson model-token compliance remains unverified. These results do not certify the intended uniform 5,000-model-token depth target. File count, topic mapping, and executable checks pass independently of that limitation.

| Lesson | Whitespace words | UTF-8 bytes | 5,000-word proxy |
|---|---:|---:|---|
| [01-scientific-python](lessons/01-scientific-python.md) | 703 | 4,691 | Below |
| [02-algebra-notation-proofs](lessons/02-algebra-notation-proofs.md) | 647 | 4,531 | Below |
| [03-vectors-matrices](lessons/03-vectors-matrices.md) | 2,020 | 14,019 | Below |
| [04-spectral-linear-algebra](lessons/04-spectral-linear-algebra.md) | 1,617 | 12,016 | Below |
| [05-single-variable-calculus](lessons/05-single-variable-calculus.md) | 1,286 | 9,271 | Below |
| [06-multivariable-calculus](lessons/06-multivariable-calculus.md) | 545 | 4,446 | Below |
| [07-probability-conditioning](lessons/07-probability-conditioning.md) | 1,273 | 9,036 | Below |
| [08-random-variables-distributions](lessons/08-random-variables-distributions.md) | 641 | 4,831 | Below |
| [09-statistical-inference](lessons/09-statistical-inference.md) | 715 | 5,439 | Below |
| [10-information-losses](lessons/10-information-losses.md) | 1,181 | 8,779 | Below |
| [11-optimization](lessons/11-optimization.md) | 681 | 5,282 | Below |
| [12-learning-theory](lessons/12-learning-theory.md) | 673 | 5,049 | Below |
| [13-splits-cross-validation](lessons/13-splits-cross-validation.md) | 546 | 4,291 | Below |
| [14-data-preparation](lessons/14-data-preparation.md) | 480 | 3,611 | Below |
| [15-sampling-imbalance](lessons/15-sampling-imbalance.md) | 499 | 3,823 | Below |
| [16-data-quality-privacy](lessons/16-data-quality-privacy.md) | 557 | 4,149 | Below |
| [17-linear-regression](lessons/17-linear-regression.md) | 792 | 6,309 | Below |
| [18-regularized-regression](lessons/18-regularized-regression.md) | 792 | 6,310 | Below |
| [19-logistic-softmax](lessons/19-logistic-softmax.md) | 909 | 7,633 | Below |
| [20-metrics-calibration](lessons/20-metrics-calibration.md) | 553 | 4,117 | Below |
| [21-nearest-neighbors](lessons/21-nearest-neighbors.md) | 583 | 4,480 | Below |
| [22-generative-classifiers](lessons/22-generative-classifiers.md) | 805 | 6,850 | Below |
| [23-svm-kernels-gaussian-processes](lessons/23-svm-kernels-gaussian-processes.md) | 900 | 7,830 | Below |
| [24-decision-trees](lessons/24-decision-trees.md) | 873 | 7,474 | Below |
| [25-bagging-random-forests](lessons/25-bagging-random-forests.md) | 791 | 7,750 | Below |
| [26-boosting](lessons/26-boosting.md) | 901 | 8,589 | Below |
| [27-classical-ml-project](lessons/27-classical-ml-project.md) | 591 | 4,050 | Below |
| [28-pca-factorization](lessons/28-pca-factorization.md) | 601 | 4,903 | Below |
| [29-partition-clustering](lessons/29-partition-clustering.md) | 806 | 7,608 | Below |
| [30-density-hierarchical-spectral](lessons/30-density-hierarchical-spectral.md) | 577 | 4,967 | Below |
| [31-mixtures-latent-variables](lessons/31-mixtures-latent-variables.md) | 948 | 8,442 | Below |
| [32-hmm-time-series](lessons/32-hmm-time-series.md) | 890 | 8,737 | Below |
| [33-neural-networks-backprop](lessons/33-neural-networks-backprop.md) | 5,952 | 43,084 | Met |
| [34-activations-initialization](lessons/34-activations-initialization.md) | 479 | 3,838 | Below |
| [35-dropout-normalization-residuals](lessons/35-dropout-normalization-residuals.md) | 945 | 7,698 | Below |
| [36-pytorch-training](lessons/36-pytorch-training.md) | 5,293 | 40,913 | Met |
| [37-convolutional-networks](lessons/37-convolutional-networks.md) | 5,054 | 37,679 | Met |
| [38-recurrent-networks](lessons/38-recurrent-networks.md) | 2,461 | 18,117 | Below |
| [39-nlp-tasks-preprocessing](lessons/39-nlp-tasks-preprocessing.md) | 525 | 4,026 | Below |
| [40-tokenization-embeddings](lessons/40-tokenization-embeddings.md) | 2,401 | 17,230 | Below |
| [41-attention-derivation](lessons/41-attention-derivation.md) | 2,889 | 21,021 | Below |
| [42-masks-position-multihead](lessons/42-masks-position-multihead.md) | 3,334 | 23,761 | Below |
| [43-transformer-architectures](lessons/43-transformer-architectures.md) | 2,418 | 18,395 | Below |
| [44-build-train-transformer](lessons/44-build-train-transformer.md) | 3,499 | 25,009 | Below |
| [45-translation-decoding-evaluation](lessons/45-translation-decoding-evaluation.md) | 2,144 | 15,148 | Below |
| [46-finetuning-hypernetworks](lessons/46-finetuning-hypernetworks.md) | 2,991 | 21,810 | Below |
| [47-efficient-attention-memory](lessons/47-efficient-attention-memory.md) | 2,740 | 20,391 | Below |
| [48-distributed-deployment](lessons/48-distributed-deployment.md) | 5,953 | 47,145 | Met |
| [49-graphs-knowledge-gnn](lessons/49-graphs-knowledge-gnn.md) | 620 | 5,350 | Below |
| [50-self-supervised-representations](lessons/50-self-supervised-representations.md) | 1,365 | 9,791 | Below |
| [51-vae-gan](lessons/51-vae-gan.md) | 5,060 | 39,429 | Met |
| [52-continuous-diffusion](lessons/52-continuous-diffusion.md) | 727 | 6,700 | Below |
| [53-discrete-diffusion-language](lessons/53-discrete-diffusion-language.md) | 738 | 6,644 | Below |
| [54-rl-values](lessons/54-rl-values.md) | 2,518 | 18,315 | Below |
| [55-rl-policy-gradients](lessons/55-rl-policy-gradients.md) | 2,543 | 19,091 | Below |
| [56-reinforcement-finetuning](lessons/56-reinforcement-finetuning.md) | 2,494 | 19,291 | Below |
| [57-recommendation-anomaly-semisupervised](lessons/57-recommendation-anomaly-semisupervised.md) | 568 | 5,392 | Below |
| [58-interpretability-causality-fairness](lessons/58-interpretability-causality-fairness.md) | 560 | 4,291 | Below |
| [59-capstone](lessons/59-capstone.md) | 707 | 5,105 | Below |
| [60-research-synthesis](lessons/60-research-synthesis.md) | 615 | 4,343 | Below |
