# 12. Putting the mathematics together: models, training, and generalization

This chapter contains outline lessons 45–48. It uses the entire preceding sequence. We will derive linear regression, ridge regression, logistic and softmax models, and a small neural network. Then we will distinguish optimization success from generalization and derive stable ways to compute the equations.

<a id="lesson-45"></a>
## Session 45 — Linear regression, Gaussian noise, ridge, and bias–variance

### A statistical model makes least squares an inference procedure

Let a design matrix $X\in\mathbb R^{n\times d}$ be fixed, with targets

$$
y=X\beta+\varepsilon,\qquad \varepsilon\sim N(0,\sigma^2I).
$$

This assumes independent Gaussian errors with common variance and a mean representable by the chosen features. Under these assumptions, the likelihood is proportional to $\exp[-\|y-X\beta\|^2/(2\sigma^2)]$. Maximizing it over $\beta$ is equivalent to minimizing squared residuals. Chapter 3 derived the resulting estimator geometrically; we now understand one noise model that justifies it statistically.

With full column rank, $\widehat\beta=(X^\top X)^{-1}X^\top y$. Substitute the model:

$$
\widehat\beta=\beta+(X^\top X)^{-1}X^\top\varepsilon.
$$

Taking expectations gives unbiasedness, and covariance becomes $\sigma^2(X^\top X)^{-1}$. Gaussianity gives an exact Gaussian sampling distribution. Unbiasedness and this covariance formula need mean-zero homoskedastic uncorrelated errors, while exact Gaussian sampling statements need more. Distinguish which assumption supports which conclusion.

For the delivery data, the fitted intercept is $4.5$ and slope $47/14$. At distance three the predicted time is $4.5+141/14=102/7\approx14.571429$. That is a fitted conditional mean under the model. A future observation also contains new noise. A prediction interval is therefore wider than an interval for the mean response at that distance.

Ridge minimizes $\|X\beta-y\|^2+\lambda\|\beta\|^2$. Differentiating gives

$$
\widehat\beta_\lambda=(X^\top X+\lambda I)^{-1}X^\top y.
$$

For $\lambda>0$ this is unique even with redundant columns. A Gaussian prior $\beta\sim N(0,\tau^2I)$ and Gaussian observation noise lead to the MAP form with $\lambda=\sigma^2/\tau^2$ under this summed-loss convention. If the loss is averaged over $n$, the displayed regularization coefficient must be scaled accordingly.

In many regression applications the intercept is left unpenalized by centering features and targets or using a penalty matrix with zero at the intercept entry. The equation above penalizes every coordinate. State which convention you implement; otherwise two apparently identical ridge formulas can produce different answers.

If $X=U\Sigma V^\top$, each fitted coefficient direction has multiplier $\sigma_j/(\sigma_j^2+\lambda)$ on $u_j^\top y$. Shrinkage introduces bias but reduces variance in weakly supported directions. This is the same sensitivity tradeoff seen in Chapter 4, now connected to repeated noisy datasets.

### Prediction error has several sources

At a fixed input $x$, let the true conditional mean be $f_*(x)$ and new outcome $Y=f_*(x)+\epsilon$ with zero-mean noise independent of the training dataset $D$, conditional on $x$. Let $\widehat f_D(x)$ be the fitted predictor. Then

$$
\mathbb E_{D,Y}[(Y-\widehat f_D(x))^2]
=\operatorname{Var}(Y\mid x)
+\left(\mathbb E_D\widehat f_D(x)-f_*(x)\right)^2
+\operatorname{Var}_D(\widehat f_D(x)).
$$

Derive it by adding and subtracting $\mathbb E_D\widehat f_D(x)$ and expanding the square. Noise has zero conditional mean, and the centered estimator fluctuation has zero mean over training samples, so cross terms vanish. These are irreducible outcome noise, squared prediction bias, and variance across fitted datasets. A single training-error number does not directly estimate all three.

A more flexible model can lower approximation bias while increasing sampling variability. Regularization can reverse part of that tradeoff. This is a useful framework under the stated squared-error setup, not a universal explanation of every modern overparameterized learning curve. Generalization also depends on data, algorithm, representation, and selection procedure.

<a id="lesson-46"></a>
## Session 46 — Logistic regression, softmax, entropy, and KL divergence

### Build a probability from an unrestricted score

For a binary outcome, an affine score $z=w^\top x+b$ can take any real value. The sigmoid maps it to a probability:

$$
p=\sigma(z)=\frac1{1+e^{-z}}.
$$

Its odds are $p/(1-p)=e^z$, so log odds equal the affine score. This gives a direct interpretation of coefficients: increasing feature $x_j$ by one changes log odds by $w_j$, holding other features fixed. It does not mean the probability increases by a constant amount.

For a Bernoulli observation $y\in\{0,1\}$, negative log likelihood is

$$
\ell(z,y)=-y\log p-(1-y)\log(1-p)
=\log(1+e^z)-yz.
$$

Differentiate the score expression: $\partial\ell/\partial z=p-y$. For a dataset averaged loss, $\nabla_wL=X^\top(p-y)/n$ when the design matrix includes the relevant features and intercept convention. The Hessian is $X^\top DX/n$, with diagonal entries $p_i(1-p_i)\ge0$, proving convexity in coefficients.

Convexity does not guarantee a finite minimizer. With perfectly linearly separable binary data, increasing score magnitudes in a separating direction can drive loss toward zero without attaining it at finite coefficients. Regularization can restore a finite optimum. This is a concrete instance of the distinction between an infimum and a minimum introduced in Chapter 1.

For $K$ classes, softmax probabilities are $p_j=e^{z_j}/\sum_ke^{z_k}$. Adding the same constant to every score leaves the probabilities unchanged, so the score representation has a redundant direction. With a one-hot target vector $y$, cross-entropy is

$$
\ell(z,y)=\operatorname{LSE}(z)-\sum_jy_jz_j,
\qquad \nabla_z\ell=p-y.
$$

The gradient follows by differentiating LSE, whose derivative in coordinate $j$ is $p_j$. The Hessian $\operatorname{diag}(p)-pp^\top$ is PSD: for any $v$, its quadratic form is the variance of values $v_j$ under probabilities $p_j$. Its all-ones null direction reflects constant-shift invariance.

### Information quantities explain the objective

For discrete probabilities $q_j$, entropy is $H(q)=-\sum_jq_j\log q_j$, with $0\log0$ defined by its limiting value zero. Cross-entropy against a predictive distribution $p$ is $H(q,p)=-\sum_jq_j\log p_j$. If $q_j>0$ where $p_j=0$, cross-entropy is infinite: the model declares an observed possibility impossible.

KL divergence is

$$
D_{\mathrm{KL}}(q\|p)=\sum_jq_j\log\frac{q_j}{p_j},
\qquad H(q,p)=H(q)+D_{\mathrm{KL}}(q\|p).
$$

To prove nonnegativity when supports are compatible, use $\log t\le t-1$ for $t>0$. Apply it to $p_j/q_j$ for positive $q_j$:

$$
-\sum_{q_j>0}q_j\log(p_j/q_j)
\ge\sum_{q_j>0}(q_j-p_j)\ge0.
$$

Equality requires matching probabilities, including no extra mass outside the support. The logarithm inequality follows by differentiating $t-1-\log t$, which has its minimum zero at one. This proves why the true distribution minimizes expected cross-entropy within an unrestricted family. KL is not a metric: it is asymmetric and does not satisfy a triangle inequality.

Mutual information measures dependence as $I(X;Y)=D_{\mathrm{KL}}(p_{X,Y}\|p_Xp_Y)$ in the discrete case, with a corresponding density integral when defined. Nonnegativity follows from KL, and zero means independence under the usual measure-theoretic conditions. This connects prediction to how much one variable can tell us about another, though estimating mutual information from finite high-dimensional data is itself difficult.

<a id="lesson-47"></a>
## Session 47 — A complete neural forward and backward pass

### Write the dimensions before the equations

Take $x\in\mathbb R^2$, hidden width two, $W\in\mathbb R^{2\times2}$, $b\in\mathbb R^2$, $v\in\mathbb R^2$, and scalar $c$. Define

$$
a=Wx+b,\qquad h=\tanh(a),\qquad z=v^\top h+c,
\qquad p=\sigma(z).
$$

For binary cross-entropy, the backward equations are

$$
\delta_z=p-y,\quad
\nabla_v\ell=\delta_z h,\quad
\nabla_c\ell=\delta_z,
$$

$$
\delta_a=(\delta_z v)\odot(1-h\odot h),\quad
\nabla_W\ell=\delta_ax^\top,\quad
\nabla_b\ell=\delta_a.
$$

The symbol $\odot$ means elementwise multiplication. Each hidden activation receives sensitivity from the output coefficient connected to it, then multiplies by its local activation derivative. The outer product distributes that sensitivity over incoming weights.

Choose $x=(1,2)^\top$, $W=\begin{pmatrix}0.1&-0.2\\0&0.3\end{pmatrix}$, $b=0$, $v=(0.4,-0.5)^\top$, $c=0$, and $y=1$. The preactivation is $(-0.3,0.6)$, hidden output approximately $(-0.291313,0.537050)$, score approximately $-0.385050$, and probability approximately $0.404910$. The output sensitivity is therefore approximately $-0.595090$.

The hidden sensitivities are approximately $(-0.2178,0.2117)$ after multiplying by output weights and $1-h^2$. The first row of the weight gradient is that first sensitivity times $(1,2)$, and the second row uses the second sensitivity. To update, subtract a chosen step size times each gradient. Do not recompute one parameter's gradient using already-updated values of other parameters; all gradients in a single ordinary step refer to the same forward pass.

The included neural-network Python example computes these quantities and checks every parameter against central differences. It then takes one small step and verifies a decrease for this particular input. That observed decrease does not establish convergence for every starting point or step size; Chapter 8 explains the assumptions needed for broader guarantees.

For several observations, average losses and average their gradients. Matrix batches can implement the same arithmetic efficiently, but the single-observation derivation is the clearest place to establish meaning. Once that is correct, vectorization should preserve its numerical result.

<a id="lesson-48"></a>
## Session 48 — Generalization, numerical stability, and an end-to-end workflow

### Population performance differs from empirical performance

For a fixed predictor $f$, population risk is $R(f)=\mathbb E[\ell(f(X),Y)]$ under a specified distribution. Empirical risk is the sample average. Training selects a predictor using the sample, so it can exploit random quirks in that same sample. A concentration result for one predictor chosen independently of the sample does not automatically apply to the predictor selected by searching many candidates on it.

For a finite class $\mathcal H$ of $M$ predictors and independent examples, suppose each loss lies in $[0,1]$. Applying Hoeffding to each predictor and a union bound gives

$$
P\left(\max_{f\in\mathcal H}|\widehat R(f)-R(f)|>\varepsilon\right)
\le2M e^{-2n\varepsilon^2}.
$$

Thus with probability at least $1-\delta$, all candidate risks differ from their empirical risks by at most $\sqrt{\log(2M/\delta)/(2n)}$. If $\widehat f$ minimizes empirical risk and $f_*$ minimizes population risk in the class, the same event gives

$$
R(\widehat f)\le\widehat R(\widehat f)+\varepsilon
\le\widehat R(f_*)+\varepsilon\le R(f_*)+2\varepsilon.
$$

This is a complete finite-class argument under bounded independent losses. Squared error is not generally bounded, and neural-network parameter spaces are not finite classes of a stated $M$, so this formula cannot be transplanted without extra reasoning. More general theories use capacity, stability, or complexity measures. The point is to see exactly how selection changes the proof obligation.

Use training data to fit parameters, validation data for choices such as regularization and architecture, and a held-out test for final evaluation. Repeatedly tuning on a test set turns it into another selection set. For time-ordered data, randomly mixing future and past can create leakage. The split should reflect the intended deployment question and dependence structure.

A distribution shift means deployment examples follow a different distribution from the one supporting the estimate or guarantee. More iid training data from the old distribution does not automatically repair that mismatch. Mathematical generalization statements always refer to a distributional setup, explicit or implicit.

### Compute the intended equation without destroying it numerically

Binary loss should be evaluated as `logaddexp(0, z) - y*z` in NumPy, which is a stable softplus expression, rather than taking the logarithm of a rounded sigmoid. For very positive $z$ and $y=1$, direct subtraction can still lose tiny positive losses; a symmetric stable form is `max(z, 0) - y*z + log1p(exp(-abs(z)))`. The latter maintains the small correction without first forming an enormous exponential.

For softmax, subtract $m=\max_jz_j$ before exponentiation. Probabilities are unchanged, because the common $e^m$ factor cancels. Log probabilities are $z_j-m-\log\sum_ke^{z_k-m}$. This expression avoids taking a logarithm after a small probability has underflowed to zero.

For least squares, solve with QR or SVD instead of explicitly inverting $X^\top X$. For covariance, center data before multiplying; subtracting two huge nearly equal raw moments can lose precision. For comparisons, use tolerances tied to scale instead of expecting every mathematical zero to be represented by exactly `0.0`.

Conditioning concerns the sensitivity of the mathematical problem. Stability concerns how an algorithm's result responds to arithmetic error. A stable algorithm can accurately solve a nearby problem and still produce a sensitive answer when the original problem is ill-conditioned. These are complementary diagnostics, not competing explanations.

### A complete stable logistic update

```python
import numpy as np

X = np.array([[1., -1.], [1., 0.], [1., 1.], [1., 2.]])
y = np.array([0., 0., 1., 1.])
beta = np.zeros(2)
step = 0.1

def objective(parameters):
    score = X @ parameters
    return np.mean(np.logaddexp(0.0, score) - y * score)

before = objective(beta)
score = X @ beta
probability = np.exp(-np.logaddexp(0.0, -score))
gradient = X.T @ (probability - y) / len(y)
beta = beta - step * gradient
print(before, objective(beta))
print(beta)
```

The initial loss is $\ln2\approx0.693147$. The gradient is $(0,-0.5)$, so the updated coefficients are $(0,0.05)$. The new loss is approximately $0.668616$. The intercept remains zero on this first step because initial positive and negative target errors balance. Later steps need not preserve it. This tiny dataset is separable, so without regularization its coefficients need not converge to a finite MLE even though loss can keep decreasing.

The companion includes this classification experiment and the small neural computation. Inputs change the actual probabilities, losses, and derivatives. Reset restores documented defaults. These experiments connect the theory to behavior, while the Python verification suite checks independent numerical invariants and gradient approximations.

### Trace one complete modeling decision from start to finish

Suppose the goal is predicting delivery time from distance and stops. First choose a target in minutes and specify which deliveries belong to the intended population. Then decide whether the output should be a typical time, a conditional mean, or a high quantile for planning. Those choices can imply different losses even before choosing a model architecture.

For a squared-error mean predictor, define the feature map and intercept convention. Record whether distance is in meters or kilometers and how any transformations are fitted. A linear model in distance and stops represents additive effects; adding their product permits an interaction. Merely applying a better optimizer to the additive family cannot introduce that missing interaction.

Next split observations in a way matching intended use. If future deliveries are the target, a chronological split can expose temporal changes that a random split would hide. If several observations share a route-specific effect, splitting rows while placing the same route in both sets answers a different question from predicting entirely new routes. The mathematical risk being estimated depends on this design.

Fit preprocessing using training data only, then hold it fixed. Choose regularization using validation data. Once a final procedure is selected, evaluate it once on an untouched test set if possible. The fitted parameters, preprocessing, and model-selection rule together define the procedure being assessed. Reporting only the final weight vector omits part of what the data influenced.

### Optimization error and statistical error can move independently

Imagine two training runs using the same data and objective. One stops early with a noticeable gradient; another reaches a much smaller gradient and lower training loss. The second solved the empirical optimization problem more accurately. Whether it predicts better on future data is a separate empirical and theoretical question.

With a misspecified model, both runs may converge to the best available approximation rather than the true conditional mean. With a very flexible model, the more optimized run may fit idiosyncratic noise. With strong regularization, additional optimization can still improve performance. There is no universal rule that more optimization always helps or always harms generalization.

A useful experimental table records training loss, validation loss, gradient norm, and the chosen regularization for each run. It distinguishes progress within the objective from selection across objectives. It also reveals cases where apparent optimization trouble is actually a scaling mismatch between implementations.

### A numerical stability exercise with extreme scores

Consider class scores one thousand and nine hundred ninety-nine. Their probability ratio is the exponential of one, an ordinary number, even though exponentiating either raw score overflows in common double-precision arithmetic. Subtracting the largest score gives zero and minus one, preserving the ratio with safe intermediate values.

The resulting probabilities are about 0.7311 and 0.2689. A network can therefore produce perfectly ordinary class probabilities from extreme raw scores. Overflow is an implementation problem in the intermediate computation, not evidence that the probabilistic model itself requires an infinite output.

Likewise, binary loss for a confidently correct large positive score is tiny but positive. Computing a sigmoid can round the probability to exactly one, making a subsequent logarithm lose the small correction. A direct stable loss expression avoids that premature rounding. Deriving an equivalent real-number equation is only the first step; selecting an arithmetic path that preserves its useful information is another.

### What a reproducible result needs

A seed makes a random experiment repeatable within a specified implementation, but it is not a complete reproducibility record. Record the generator, data construction, dependency versions, split rule, objective normalization, stopping criterion, and evaluation metric. A changed library or hardware backend can alter low-order floating point behavior even when the high-level method is unchanged.

For an educational mathematical example, the strongest checks compare invariants and independently derived quantities. Residuals should be orthogonal to a least squares column space; probabilities should be nonnegative and sum to one; central differences should approximately match smooth analytic gradients; a known convergent quadratic update should contract at its predicted rate. These checks explain why a result is credible rather than relying on a single printed success message.

No finite test suite proves every mathematical statement or every platform behavior. The verification report therefore distinguishes executed examples, numerical assertions, static structure checks, equation-rendering checks, and browser observations. This separation is part of the teaching: confidence should track the evidence actually obtained.

### A guided final project

The included end-to-end project uses synthetic regression and binary-classification data with a fixed seed. It splits observations before fitting transformations, centers and scales using training statistics, fits a ridge model through a linear solve, trains regularized logistic regression, and evaluates held-out error. Its source explains shapes and objective conventions. The purpose is a small transparent mathematical pipeline, not an industrial benchmark.

Read its outputs in layers. Training loss measures fit on observed examples. Validation loss helps compare a stated small set of settings. Test loss estimates performance on independent examples from the same synthetic generator. A gradient norm diagnoses optimization stationarity, while singular values diagnose inverse sensitivity. Each number answers a different question.

As an optional extension, change the generator so the test slope differs from the training slope. Observe that an accurately solved training objective can still predict poorly on test data. Then return to a shared generator and reduce sample size; variation between seeds becomes more visible. These experiments separate distribution shift from finite-sample uncertainty.

You can now trace a complete chain: a model family defines possible functions; linear algebra describes representations; calculus describes local changes; optimization chooses parameters; probability defines uncertain outcomes; inference quantifies what finite data support; and generalization analysis asks how sample-based choices transfer. Specialized topics such as measure-theoretic probability, stochastic differential equations, causal identification, and advanced learning theory can extend this foundation. They are not silently assumed to have been exhausted by one refresher.

[Previous chapter](11-statistical-inference.md) · [Curriculum](../CURRICULUM.md)
