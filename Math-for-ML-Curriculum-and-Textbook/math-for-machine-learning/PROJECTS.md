# Optional applications and reference implementations

These projects are self-contained learning activities. They require no response in chat and do not block progress through the textbook. The supplied source is a reference you can inspect before or after modifying it.

## 1. Reconstruct the delivery fit

Read Chapters 1–3. Run `examples/03-matrices-and-least-squares.py`. Recover the intercept 4.5 and slope 47/14, then calculate predictions and both residual inner products by hand. Change the final target from 18 to 20 and refit. The projection changes, but residual orthogonality should remain near zero. This tests an invariant rather than a fixed answer copied from one dataset.

Next duplicate the distance column. Coefficients can be nonunique, while the projection stays unique. Compare the minimum-norm solution returned by least squares to another solution formed by adding a null vector. Explain which part is data-supported and which part is a coefficient convention.

## 2. A low-dimensional reconstruction

Read Chapters 2–4. Run the PCA example and the laboratory's PCA experiment. Translate every observation by a fixed vector, refit centering, and reconstruct. The mean shifts while centered geometry is preserved. Then rescale one feature and compare covariance-based PCA with PCA after standardizing features.

Reference calculation: the axis-aligned four-point cloud in Chapter 4 has leading variance fraction 0.8 and squared rank-one reconstruction error 2. Sign flips of a principal vector are valid if its score flips too. A small eigenvalue gap can make a direction unstable without making the leading subspace equally unstable.

## 3. Local error and safe updates

Read Chapters 5–8. Use the tangent and integration experiments, then the quadratic-descent experiment. For curvature twenty, step 0.05 removes the steep coordinate immediately and contracts the shallow coordinate by 0.95. Step 0.11 makes the steep multiplier −1.2, causing alternating growth.

Reference derivation: each error coordinate is multiplied by one minus step times its curvature. Compare predicted multipliers with actual iterates. A loss plot alone shows the outcome; the coordinate formula explains why it occurred.

## 4. Estimation and uncertainty

Read Chapters 9–11. Change the prior in the beta-posterior experiment while keeping seven successes and three failures fixed. Compare posterior mean, posterior variance, and predictive probability. Separately run `examples/bootstrap_and_anova.py` and inspect how bootstrap replications are generated.

The bootstrap example's percentile interval is a demonstration of a procedure, not an exact coverage guarantee for arbitrary populations. Increasing replication count improves its Monte Carlo approximation without increasing original sample information. The ANOVA program verifies the sum-of-squares identity and matches an independently implemented SciPy F statistic.

## 5. Every derivative of a tiny neural model

Read Chapters 7 and 12. Run `examples/neural_network.py`. Its nine parameters include a two-by-two weight matrix, two hidden biases, two output weights, and one output bias. The script checks each analytic derivative against a central difference, then verifies that one small update lowers this particular loss.

Trace the shape of every quantity before editing. Changing the hidden activation requires changing its derivative as well. A large preactivation can saturate tanh and produce small gradients. If a gradient check fails, compare moderate step sizes and avoid nondifferentiable points before concluding the formula is wrong.

## 6. End-to-end mathematical ML

Run `examples/end_to_end.py`. It generates 600 synthetic inputs, uses 360 for training, 120 for validation, and 120 for test. Training-only means and scales transform all three groups. Ridge is solved through an augmented least squares system, with the intercept unpenalized. Logistic regression uses average stable cross-entropy plus a squared nonintercept penalty and a step derived from a smoothness upper bound.

The validation split selects among four explicit strengths. The test split is evaluated only after that choice. In the tested environment, ridge test MSE was about 0.2362; logistic test log loss was about 0.5435 and accuracy 0.675. These are example outputs from the fixed synthetic generator, not general performance claims.

Change one factor at a time: sample size, noise, feature redundancy, class-score scale, or test-generation coefficients. Label whether the change affects optimization, inverse sensitivity, sampling uncertainty, approximation error, or distribution shift. Keep test data out of preprocessing and parameter selection. Explain the observed result using the appropriate mathematical object rather than a single generic label such as “overfitting.”
