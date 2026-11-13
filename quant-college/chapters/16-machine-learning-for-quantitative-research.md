# 16. Machine learning for quantitative research

## 16.1 Define a target before choosing an algorithm

Machine learning estimates useful relationships from data under a specified objective. In quant research, a defensible target might be next-week realized variance, a filing classification, an execution-cost estimate, or the probability of a defined event. “Predict the market” is too vague: it leaves horizon, universe, labels, information timing, loss, and decision costs unspecified.

[Stanford CS229](https://see.stanford.edu/Course/CS229) supplies a broad foundation in supervised learning, generative models, support vector machines, learning theory, unsupervised learning, dimensionality reduction, neural networks, and reinforcement learning. This chapter connects those families to the mathematical foundations already established. It does not assume that model complexity produces market predictability. A simple baseline remains the reference every candidate must improve upon.

Let each example contain features x_i known at a decision time and a target y_i measured over a specified later interval. A predictor f_theta maps features to an output. Training minimizes an empirical loss plus any regularization. Generalization asks how the fitted procedure behaves on new data from the relevant future environment. These are distinct stages. Low training loss establishes fit, not generalization.

## 16.2 Linear regression and gradient learning

For squared loss J(theta) = (1/(2n))sum (x_i-transpose theta − y_i)², the gradient is X-transpose(Xtheta − y)/n. Gradient descent subtracts a step-size multiple of this vector. The normal equations give a direct solution when rank permits, while iterative methods can handle large datasets. Both optimize the same stated objective when implemented and converged correctly.

Stochastic gradient descent uses one example or a small batch to estimate the gradient. It reduces per-update cost but introduces update noise. Learning-rate schedules, feature scaling, batch order, and stopping criteria matter. A decreasing training loss is useful diagnostic evidence but cannot reveal a label leak or an invalid time split.

Regularization modifies the target objective. Ridge adds lambda||theta||²; lasso adds lambda||theta||1. Hyperparameters must be chosen using training/validation procedures that preserve chronology. Standardizing on the full dataset before splitting leaks future means and scales. Fit the scaler within each training fold, then apply it unchanged to the corresponding validation fold.

The bias–variance tradeoff describes how restricted models can miss structure while flexible models can fit sampling noise. This is not a universal monotonic law in every modern model, but it remains useful for diagnosing small noisy financial datasets. Learning curves, regularization paths, and chronological validation help distinguish underfitting from overfitting.

## 16.3 Logistic regression and probabilistic classification

For a binary event, logistic regression gives p_theta(x) = 1/[1 + exp(−x-transpose theta)]. Cross-entropy loss is −[y ln p + (1 − y)ln(1 − p)] averaged over observations. It is the negative Bernoulli log likelihood under the conditional model. Its gradient is X-transpose(p − y)/n. Stable implementations evaluate log-sum-exp forms to avoid overflow when scores are large.

A probability prediction is different from a class decision. A threshold of 0.5 is appropriate only under particular class and error-cost assumptions. If a false positive costs much more than a false negative, the decision threshold changes. Evaluate calibration and ranking separately. A model with useful ranking can still output poorly calibrated probabilities.

For rare financial events, accuracy can reward a model that always predicts the majority class. Precision asks what fraction of positive predictions are true positives; recall asks what fraction of actual positives are found. Precision–recall curves, ROC curves, log loss, and Brier score answer different questions. Choose a primary metric tied to the intended use, and report class prevalence and uncertainty.

## 16.4 Generative models and naive Bayes

A discriminative model estimates P(Y given X) directly. A generative classifier models P(X given Y) and P(Y), then applies Bayes' rule. Gaussian discriminant analysis assumes class-conditional normal features, with shared or class-specific covariance depending on the variant. Shared covariance yields a linear decision boundary under the usual model; separate covariances can yield quadratic boundaries.

Naive Bayes assumes conditional feature independence given the class. For text, word or token counts can form a simple probabilistic classifier with smoothing to avoid zero likelihood for unseen terms. The independence assumption is usually unrealistic, but the model can still provide a useful baseline. Its probability calibration may be poor, so empirical evaluation is necessary.

For filing analysis, split documents by publication time and consider grouping by company so that near-duplicate documents or firm-specific phrases do not create an easy leakage path. Build vocabulary and weighting using training text only. A model recognizing a document template can achieve high classification accuracy without learning the economic information intended by the research question.

## 16.5 Support vector machines and kernels

A linear support vector classifier seeks a separating hyperplane with a large margin while penalizing violations. With labels y_i in {−1, +1}, a soft-margin formulation minimizes one half ||w||² + C sum xi_i subject to y_i(w-transpose x_i + b) ≥ 1 − xi_i and xi_i ≥ 0. The margin relates to distance from the separating hyperplane, while slack allows noisy or nonseparable observations.

The hinge loss max(0, 1 − y score) gives an equivalent regularized objective. C controls the penalty on violations relative to coefficient size under the chosen scaling convention. Feature scaling affects distances and therefore the fitted margin. Tuning C on the final test period invalidates its role as an independent evaluation.

The dual formulation depends on inner products between examples. A valid positive-semidefinite kernel K(x, z) acts like an inner product in a possibly higher-dimensional feature space. Polynomial and radial-basis kernels produce nonlinear boundaries without explicitly listing all transformed features. Arbitrary similarity functions are not automatically valid kernels for the standard convex theory.

A kernel model can be computationally expensive as sample size grows and can overfit through flexible kernel parameters. It usually does not produce a probability by default; calibration requires an additional fitted procedure evaluated without leakage. A nonlinear boundary is not evidence of a nonlinear economic mechanism unless the research design supports that interpretation.

## 16.6 Learning theory and model selection

Empirical risk is average loss on training data; population risk is expected loss under the target distribution. Generalization bounds relate their difference to sample size, model-class complexity, confidence level, and assumptions such as independent sampling and bounded or controlled losses. A bound is meaningful only under its hypotheses. Financial dependence and changing distributions can make textbook independent-identically-distributed guarantees inapplicable.

VC dimension measures the richness of a class of binary classifiers through its ability to realize labelings of points. More expressive classes can require more data for uniform guarantees. The purpose is not to calculate a magic sample size for every trading model, but to understand why searching larger classes can fit more noise. Regularization, restricted hypothesis classes, and independent validation constrain that search.

Cross-validation estimates performance of a model-selection procedure under a split design. Ordinary random k-fold validation mixes past and future and can leak overlapping information. Use expanding or rolling chronological folds and a gap that addresses label overlap and data latency. If labels cover several future dates, remove training examples whose label intervals overlap the validation interval. This is a timing requirement, not a universal fixed number of days.

Nested evaluation separates hyperparameter selection from performance assessment. The outer split measures the entire selected procedure, while inner splits choose settings using only the outer training period. Repeatedly changing the research question after looking at outer results still creates adaptive selection. Preserve a research log and reserve a final untouched period where feasible.

## 16.7 Trees, ensembles, and practical extensions

A decision tree partitions feature space using threshold rules and predicts within leaves. It can capture interactions and nonlinearities with little feature transformation, but small data changes can alter the tree. Depth, minimum leaf size, and pruning control complexity. A leaf containing a few rare observations can produce unstable financial conclusions.

Random forests average many trees trained with randomized data and feature choices, reducing some variance. Boosting sequentially adds models to improve a loss, often achieving strong predictive performance with careful regularization. These are added practical extensions beyond the historical CS229 core. Their APIs and defaults change, so use current official library documentation for an installed environment.

Feature importance measures depend on the method. Split-based importance can favor certain variable types; permutation importance measures a predictive disruption under a chosen data distribution; correlated features can share or mask importance. None automatically identifies causal effects. Report stability across folds and plausible alternative feature groupings.

## 16.8 Neural networks and backpropagation

A feedforward network composes affine transformations and nonlinear activations. For one hidden layer, h = activation(W1x + b1) and output = W2h + b2, followed by an output link if needed. Without nonlinear activation, stacked affine layers collapse into one affine map, so depth alone would not expand the function class in that setting.

Backpropagation applies the chain rule efficiently through the computational graph. For squared-error output loss one half(y_hat − y)², the derivative with respect to output is y_hat − y. Multiply by the relevant downstream weights and activation derivatives to obtain earlier-layer gradients. Each parameter receives the sum of contributions along paths that depend on it. This is multivariable calculus organized to avoid repeated work, not a separate mysterious learning principle.

For a scalar network h = tanh(wx + b), y_hat = vh + c, the gradient with respect to w is (y_hat − y)v(1 − h²)x. The factor 1 − h² is tanh's derivative. If h saturates near ±1, this factor is small and learning can slow. Other activations and initialization schemes alter optimization behavior. A full implementation must distinguish forward values, gradients, updates, and evaluation mode.

Networks can be nonconvex in their parameters. Different initializations may converge to different solutions. Early stopping, weight decay, architecture choice, and learning rate are model-selection decisions. Small tabular financial datasets often do not justify a large network, especially when labels are noisy and independent sample size is low. Compare against linear and tree baselines before attributing value to depth.

## 16.9 Unsupervised learning: clustering and PCA

K-means minimizes within-cluster squared Euclidean distance by alternating assignments to nearest centers and center updates to assigned means. Each step does not increase the objective, but the algorithm can stop at a local solution. Initialization and scaling matter. Empty clusters require a defined handling rule. A cluster is a geometric grouping under the chosen features, not automatically an economic regime or industry.

PCA finds orthogonal high-variance directions, as derived in Chapter 3. Fit centering, scaling, and components on training data. Reconstruction error measures a different objective from forecast accuracy. A component that explains most input variance can carry little information about the target, while a small spread component can be predictive.

Mixture models represent a distribution as weighted component distributions. A Gaussian mixture can model heterogeneous clusters with soft membership probabilities. Component labels can be permuted without changing the overall density, so comparing “component one” across fits requires alignment. Too many components can fit noise or create nearly singular covariance estimates without constraints or regularization.

## 16.10 Expectation–maximization and latent variables

EM alternates between computing a conditional distribution over latent variables under current parameters and maximizing an expected complete-data log likelihood. In a Gaussian mixture, the E step computes responsibilities, the conditional probability each observation belongs to each component. The M step updates weights, means, and covariance using those responsibilities.

For two components, responsibility for component one is pi1 f1(x)/[pi1f1(x) + pi2f2(x)]. The denominator normalizes the weighted densities. The updated mean is sum responsibility_i x_i divided by sum responsibility_i. A point contributes fractionally to both components rather than being assigned irrevocably to one.

Under standard exact-step conditions, EM does not decrease observed-data likelihood, but it can converge to a local optimum or a problematic boundary. Monotone likelihood improvement does not establish model truth or globally best fit. Multiple starts, covariance constraints, and held-out density evaluation can help diagnose practical behavior.

## 16.11 Reinforcement learning and dynamic decisions

A Markov decision process specifies states, actions, transition probabilities, rewards, and a discount factor. A policy chooses actions from states. The optimal value obeys a Bellman equation, connecting reinforcement learning directly to Chapter 15. The difference is often that transitions or values must be learned from interaction or historical data rather than being fully known.

For action-value Q(s, a), a tabular Q-learning update moves toward r + delta max_a_next Q(s_next, a_next). Convergence theory requires conditions such as sufficient exploration and suitable learning rates in a stationary finite setting. Function approximation, off-policy learning, and financial nonstationarity introduce complications beyond the tabular theorem.

Historical market data do not contain outcomes for every action the researcher might have taken. Large trades can affect prices, and unobserved policies can differ from the logged behavior policy. Offline policy evaluation therefore needs assumptions about support, confounding, and the environment. A trading simulator that fills every order at a favorable price can reward unrealistic behavior. Reinforcement learning is an advanced research direction after credible baselines and execution models are established.

## 16.12 A leakage-resistant financial ML pipeline

Choose a concrete target, such as next-five-trading-day realized variance. Timestamp features when available, form labels from subsequent returns, and preserve label start and end times. Split chronologically. Fit imputation, scaling, vocabulary, PCA, and model parameters inside each training fold. Tune hyperparameters on inner validation periods with appropriate gaps. Evaluate the chosen procedure once on a final period.

Compare constant variance, lagged realized variance, EWMA, linear regression, and one nonlinear candidate under the same loss and dates. Report the number of tried variants, training windows, target overlap, missingness, calibration, and uncertainty in loss differences. If a forecast later becomes a trading rule, perform a separate decision and cost evaluation rather than assuming a lower prediction loss means higher trading profit.

The machine-learning laboratory demonstrates overfitting by fitting polynomial degrees to a fixed synthetic training set and displaying independent validation error. Changing degree changes the computed fit, and reset restores the same data. It is a teaching experiment about model flexibility, not evidence that polynomial models are suitable for market prediction. The package's Python examples include a small chronological regression pipeline and explicit timing checks.

### One gradient update, with numbers

Take one observation x = 2, y = 5 and a linear model y_hat = wx + b. Start with w = 1 and b = 0, so prediction is two and error is −3. For loss one half(y_hat − y)², gradient with respect to w is error times x = −6, and gradient with respect to b is −3. With learning rate 0.1, the new parameters are w = 1.6 and b = 0.3. Prediction becomes 3.5 and loss falls from 4.5 to 1.125.

This update illustrates differentiation, parameter movement, and objective evaluation separately. A larger step can overshoot. With many observations, the gradient averages their contributions according to the objective's normalization. Changing from a sum to a mean without adjusting a fixed learning rate changes effective step size. Check the exact loss convention before comparing implementations.

For logistic regression at score zero, predicted probability is 0.5. If y = 1 and x = 2, the slope-gradient contribution is (0.5 − 1) × 2 = −1. A gradient-descent step increases the slope, raising the probability for that positive-feature observation. This sign check is useful for catching an incorrectly negated gradient.

### A neural-network chain rule by hand

Use a scalar network h = tanh(wx), output y_hat = vh, with x = 1, w = 0, v = 2, and target y = 1. Then h = 0, y_hat = 0, and output error is −1. The derivative with respect to v is error times h = 0. The derivative with respect to w is error times v times (1 − h²) times x = −2.

The hidden weight can update even though the output weight's gradient is zero at this exact point. After changing w, h becomes nonzero and the output-weight gradient can change. This example shows why gradients depend on intermediate activations and current parameters. Store the forward-pass values needed for backpropagation before overwriting parameters with updates.

For larger networks, automatic differentiation performs the same chain-rule bookkeeping. It does not verify that labels, loss, or data timing express the intended problem. Gradient checks on a tiny model using finite differences can reveal implementation errors, but numerical differentiation has the step-size limitations from Chapter 2.

### EM responsibilities in a small mixture

Suppose two Gaussian components have equal prior weights and equal variance one, with means zero and three. For observation x = 1, unnormalized weights are proportional to exp(−1/2) and exp(−4/2). Their ratio favors the first component. Responsibility for the first is exp(−0.5)/[exp(−0.5) + exp(−2)], approximately 0.8176.

The observation contributes about 0.8176 of its weight to the first mean update and 0.1824 to the second. Repeating across observations gives weighted sufficient statistics. If a component collapses onto one observation with vanishing variance in an unconstrained mixture, likelihood can become pathological. A likelihood increase alone does not certify a useful or well-posed density model.

### Proper probability losses and calibration

For a true Bernoulli event probability p and a predicted probability q, expected Brier loss is p(1 − q)² + (1 − p)q². Expanding yields p(1 − p) + (q − p)², minimized uniquely at q = p. This is why the score encourages truthful probability forecasts under its setup. Log loss has a related proper-scoring interpretation but penalizes confident wrong predictions more severely near zero and one.

A reliability plot groups predictions and compares their mean probability with observed event frequency. Grouping choice and finite sample size affect the display. Calibration can vary by time regime even if it looks good overall. A model can be perfectly calibrated by always predicting the base rate while having no useful ranking. Evaluate both discrimination and calibration according to the use case.

### A tabular Bellman update

Suppose action a in state s yields reward one, transitions deterministically to s_next, and discount factor is 0.9. If the best current next-state action value is two, the one-step target is 1 + 0.9 × 2 = 2.8. With current Q(s, a) = 2 and learning rate 0.25, the update gives 2 + 0.25(2.8 − 2) = 2.2.

The target uses the best estimated future action, so estimation error can feed back through repeated updates. Exploration and data coverage matter. In a financial offline dataset, a state-action pair that never occurred cannot be learned merely by writing the update equation. Function approximation can extrapolate, but its unsupported extrapolation must not be confused with observed evidence.

### Hyperparameters belong to the evaluated procedure

If you try ten regularization strengths and five feature sets, you have evaluated fifty candidates before choosing one. A final report should preserve that search. The validation score of the winner is optimistic for its future performance because it helped select the winner. An outer evaluation or untouched test period estimates the selected procedure more honestly under its sampling assumptions.

Early stopping is a hyperparameter choice too. Watching validation loss every epoch and stopping at the minimum uses that set repeatedly. This can be appropriate within a training procedure, but it means the set is not an independent final test. Keep the hierarchy of training, selection, and final assessment visible in both code and prose.

### Regularization and probabilistic priors can coincide in form

For a Gaussian observation model, squared-error loss is proportional to negative log likelihood. Adding an independent zero-mean Gaussian prior on coefficients adds a quadratic penalty to negative log posterior. A maximum-a-posteriori estimate therefore resembles ridge regression after matching scale conventions. A Laplace prior similarly relates to an absolute-value penalty.

This correspondence explains a useful connection without equating every frequentist and Bayesian interpretation. A penalized point estimate is not a full posterior distribution. Posterior uncertainty requires the specified probability model and integration, while cross-validated ridge tuning optimizes a predictive criterion. The same numerical coefficient can carry different interpretations depending on the procedure.

### Data augmentation must preserve the target question

Duplicating observations does not add independent information. Synthetic perturbations can regularize a model if they reflect justified invariances, but arbitrary return shuffling can destroy time structure or create labels with no economic meaning. If two augmented records share the same original event, keep them in the same evaluation group to avoid leakage.

For text, a paraphrase can change economically important negation, uncertainty, or timing. For market data, rescaling prices preserves simple returns but changing calendar order does not preserve a forecasting task. State the invariance an augmentation assumes and test whether it is appropriate. More training rows are valuable only when they add relevant information or a defensible inductive constraint.

A classifier's confidence is a model output, not a measure of how trustworthy its entire research process is. A model can assign probability 0.99 using a leaked feature, a shifted population, or a misspecified link. Calibration checks evaluate probabilities on a relevant sample, while provenance and timing checks evaluate whether the prediction task was valid. Keep these layers separate. If uncertainty about the input or population is not represented in the model, a sharp output probability does not make that uncertainty disappear.

When comparing models, use the same target definition and evaluation rows, and retain failed fits. A complex model that predicts only easy cases may have lower conditional loss but poor coverage. Report abstention and missing-prediction rates alongside accuracy. If the application permits abstention, define its cost and evaluate the resulting policy. Otherwise a model with frequent missing outputs may be unusable despite an attractive score on the rows it retained. This connects statistical evaluation to the operational decision rather than treating one metric as a complete description.

## 16.13 Interpretability, drift, and limitations

Explain predictions at the level appropriate to the model and user. Coefficients depend on scaling and collinearity; local feature attributions depend on a reference distribution and model assumptions; partial-dependence plots can evaluate unrealistic feature combinations when predictors are dependent. Interpretability tools explain aspects of a fitted predictor, not the causal structure of the world.

Distribution shift can change feature ranges, target prevalence, relationships, or measurement processes. Monitor data quality, calibration, and performance by time and relevant groups. A retraining rule should be specified and evaluated as part of the procedure. Repeatedly reacting to noisy recent performance can itself overfit. Preserve a simple fallback and clear capability limits in any operational application.

Suggested applications: derive squared-loss and logistic gradients; solve a one-step SVM margin example; implement one EM responsibility update; trace a scalar network's gradient; compare random and chronological splits on a deliberately trending synthetic dataset; explain why a learned policy needs action-support assumptions. Hints: keep the objective fixed during differentiation, and identify every place a fitted transformation could see future data.

Use the full [Stanford CS229 archive](https://see.stanford.edu/Course/CS229), including notes, assignments, data, transcripts, and solutions. Its historical software context differs from modern Python, so preserve the mathematical exercises while checking current APIs against [scikit-learn's official documentation](https://scikit-learn.org/stable/). [An Introduction to Statistical Learning](https://www.statlearning.com/) is an added authors' resource for further statistical-learning study and labs. The next two chapters turn these tools into a complete research process and assess readiness through actual work products.
