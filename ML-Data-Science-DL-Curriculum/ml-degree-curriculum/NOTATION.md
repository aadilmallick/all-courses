# Notation and implementation conventions

| Symbol | Meaning | Typical code shape |
|---|---|---|
| $n,d,K$ | Examples, input features, classes | Integers |
| $X$ | Design matrix, rows are observations | `(n,d)` |
| $x_i$ | Individual feature vector | `(d,)`; column in individual-vector mathematics |
| $y$ | Scalar target or integer class array | `(n,)` |
| $w,b$ | Weights and bias | `(d,)`, scalar |
| $W$ | Multiclass or layer weights | `(d,K)` in NumPy row-batch convention |
| $\theta$ | Collection of trainable parameters | Several arrays |
| $\ell,J$ | Per-observation loss, full objective | Scalar after stated reduction |
| $\eta,\lambda$ | Learning rate, regularization strength | Nonnegative scalars as specified |
| $\mu,\Sigma$ | Mean and covariance | `(d,)`, `(d,d)` |
| $Q,K,V$ | Attention queries, keys, values | `(batch,heads,length,width)` |
| $A,D,L$ | Graph adjacency, degree matrix, Laplacian | `(nodes,nodes)` |
| $\pi$ | Class prior, mixture weight, or RL policy | Meaning redefined explicitly per setting |
| $\gamma$ | Discount, normalization scale, or variational parameter | Meaning depends on the declared model |

`@` is matrix multiplication and `*` is elementwise multiplication. A broadcast is reversed in backpropagation by summing gradients over repeated axes. Natural logarithms are the default. Expected-value, sample-average, summed-loss, and per-token reductions are different operations.

Scikit-learn and PyTorch may store linear-layer weights in different axis conventions from a mathematical derivation. Inspect the actual tensor shape before transposing. An identity such as $\nabla_WL=X^\top G$ assumes the row-batch convention stated in that derivation.

Loss scaling changes regularization equivalence. The ridge helper uses summed squared residuals plus a summed penalty, while the analytical chapter often uses average half-squared loss. The helper docstring states the conversion. Teaching estimators do not add an intercept silently.

A proof establishes a statement under stated assumptions. A proof sketch omits some formal detail. A heuristic motivates a design without proving it. A numerical check tests selected instances. An empirical result depends on its measurement protocol. The course distinguishes these types of evidence.
