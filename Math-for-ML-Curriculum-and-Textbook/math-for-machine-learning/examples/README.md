# Example programs

Run from the package root with the Python environment described in the main README. The numbered programs are extracted from the canonical chapter listings. `python scripts/extract_examples.py` regenerates them after edits.

| File | Calculation and expected relationship |
|---|---|
| `01-mathematical-language.py` | Two MSE values and stable log-sum-exp; 1/3, 14/3, about 1000.313262 |
| `02-vectors-and-geometry.py` | Projection (2,2), orthogonal residual (1,−1) |
| `03-matrices-and-least-squares.py` | Delivery coefficients (4.5,47/14), MSE 1/42 |
| `04-matrix-structure-and-pca.py` | Explained fraction 0.8, squared reconstruction error 2 |
| `05-calculus-from-first-principles.py` | Central-difference error initially shrinks, then rounding interferes |
| `06-integration-and-change-of-variables.py` | Trapezoid approximation near e−1, error about 1.43×10⁻⁷ |
| `07-multivariable-calculus-and-backpropagation.py` | Analytic and numerical gradients both near (−1,−4) |
| `08-optimization.py` | Quadratic loss decreases; steep coordinate vanishes after first step |
| `09-probability-foundations.py` | Count mean 1, variance 0.5, Bayes posterior 0.4 |
| `10-distributions-and-sampling-limits.py` | Empirical standard error near theoretical 0.04 |
| `11-statistical-inference.py` | Gaussian t interval around mean 11; separate beta predictive probability 2/3 |
| `12-machine-learning-synthesis.py` | One stable logistic update lowers loss from about 0.6931 to 0.6686 |
| `neural_network.py` | All nine gradients checked; one small update lowers the example loss |
| `bootstrap_and_anova.py` | Resampling distribution and independent ANOVA decomposition check |
| `end_to_end.py` | Training-only preprocessing, validation selection, held-out evaluation |

The first two programs and the finite-difference, trapezoid, and finite-probability examples use only the standard library. Others require the pinned NumPy and/or SciPy dependencies. Numerical checks use tolerances. Random-number results depend on the stated seed and library environment; a histogram is not a proof.

The advanced neural and capstone listings are also included in the continuous book's source appendix. The source paths here remain the authoritative runnable files for those implementations.
