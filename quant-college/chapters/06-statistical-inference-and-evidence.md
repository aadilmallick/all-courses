# 6. Statistical inference and evidence

## 6.1 A sample is not the population

Suppose twelve monthly returns average 0.8%. The average is a property of the twelve observed numbers. Calling 0.8% the strategy's expected monthly return adds an inference about an unobserved distribution, possibly one that changes over time. Statistics studies that additional step. We need a sampling model, an estimator, a measure of uncertainty, and a clear distinction between what was observed and what is being inferred.

A parameter is a fixed feature of the model in frequentist inference, such as a population mean mu. An estimator is a rule that turns random data into an estimate, such as the sample mean. Before observing data the estimator is random; afterward its realized value is a number. The sampling distribution describes how the estimator would vary across repetitions of the specified experiment. Financial history is not literally rerunnable, so the repetition is a modeling device whose relevance must be defended.

Descriptive statistics summarize the sample without requiring that stronger interpretation. Report sample size, dates, missingness, mean, median, quantiles, and spread. A histogram or time plot can reveal asymmetry, outliers, regime changes, or data errors hidden by an average. An outlier is not automatically an error. Verify it against data provenance before excluding it, and report any exclusion rule chosen after inspecting the result.

## 6.2 Estimation, bias, variance, and loss

For independent observations with common mean mu, the sample mean is unbiased: E[sample mean] = sum E[X_i]/n = mu. If they have common variance sigma² and are independent, its variance is sigma²/n. Unbiasedness describes average behavior over hypothetical samples, not the accuracy of the one observed estimate. An unbiased estimator can be extremely noisy.

Mean squared error is E[(estimate − parameter)²]. Adding and subtracting the estimator's expectation gives variance plus squared bias. The cross term vanishes because the centered estimator has mean zero. Thus a slightly biased estimator can have lower mean squared error if it reduces variance sufficiently. Shrinkage and regularization exploit this tradeoff; “biased” is not a universal synonym for “bad.”

Sample variance uses s² = sum (X_i − sample mean)²/(n − 1). The loss of one degree of freedom comes from estimating the mean. An identity explains the correction: sum (X_i − sample mean)² = sum (X_i − mu)² − n(sample mean − mu)². Taking expectations under independent equal-variance sampling gives n sigma² − sigma² = (n − 1)sigma². Dividing by n would underestimate sigma² on average under these assumptions.

An estimator is consistent when it approaches the parameter as sample size grows in a specified sense. Unbiasedness and consistency differ: an estimator can be biased at every finite sample size and still become accurate asymptotically. Conversely, one observation selected from an ever-growing dataset is unbiased for the mean but does not become more concentrated merely because unused observations exist.

## 6.3 Likelihood asks how a parameter scores observed data

For a model with parameter theta, likelihood is the joint probability mass or density of the observed data regarded as a function of theta. The data are fixed while comparing parameter values. A density value is not a probability of the exact continuous observation, but density ratios still compare model fit in a coherent way. Likelihood is not automatically a probability distribution over theta.

For n independent Bernoulli observations with k successes, L(p) = p^k(1 − p)^(n−k), apart from a constant when only the count is recorded. Its log is k ln p + (n − k)ln(1 − p). For 0 < k < n, differentiating gives k/p − (n − k)/(1 − p) = 0, yielding p_hat = k/n. The second derivative is negative, confirming a maximum. If k is zero or n, the maximum is at a boundary; the interior derivative formula alone would miss the case.

For independent normal observations with known variance sigma², maximizing likelihood for mu is equivalent to minimizing sum (X_i − mu)², so the maximum-likelihood mean is the sample mean. If variance is also estimated by maximum likelihood, the divisor is n, not n − 1. This does not contradict the unbiasedness result: maximum likelihood and unbiasedness are different criteria.

The score is the derivative of log likelihood; its expected curvature leads to Fisher information under regularity conditions. More information means the likelihood tends to concentrate more sharply around distinguishable parameter values. Standard asymptotic normal approximations require identification, smoothness, and other conditions. Boundary parameters, weak identification, heavy tails, or dependent data can invalidate the familiar formulas.

## 6.4 Confidence intervals and standard errors

A standard error estimates the sampling variability of an estimator. It is not the standard deviation of the raw observations. For an independent equal-variance sample mean, estimated standard error is s/sqrt(n). If twelve monthly returns have mean 0.008 and sample standard deviation 0.04, the standard error is approximately 0.01155. The uncertainty of the mean can therefore exceed the estimate itself.

Under independent normal sampling, (sample mean − mu)/(s/sqrt(n)) has a Student t distribution with n − 1 degrees of freedom. A two-sided 95% interval is sample mean plus or minus the appropriate t quantile times standard error. With n = 12 the critical value is approximately 2.201, giving about [−0.0174, 0.0334]. This wide interval reflects limited evidence, not a mathematical failure.

A frequentist 95% confidence procedure covers the fixed true parameter in 95% of repeated samples under its assumptions. After observing one interval, the parameter is not assigned a 95% probability by that interpretation alone. Bayesian credible intervals have a different probability statement involving a posterior model. Both methods require assumptions; neither interval is automatically a guarantee about a future realized return.

Dependence changes standard errors. If adjacent monthly returns are positively autocorrelated, s/sqrt(n) may understate mean uncertainty. Heteroskedasticity changes variance over observations. Robust covariance estimators, cluster methods, block bootstrap, or explicitly modeled dependence can address particular structures. The word “robust” always needs a target: robust to which violation and under which remaining assumptions?

Prediction intervals cover future observations rather than a population parameter. Even if mu were known exactly, a future return would remain uncertain because of its own variation. As sample size grows, uncertainty about mu can shrink while uncertainty about a new observation remains large. Confusing confidence and prediction intervals creates implausibly precise forecasts.

## 6.5 Hypothesis tests and what a p-value means

A null hypothesis specifies a claim or model to challenge, such as mu = 0. A test statistic measures discrepancy between data and that null. A p-value is the probability, computed under the null and its auxiliary assumptions, of obtaining a statistic at least as extreme as the observed one according to the chosen rule. It is not the probability that the null is true and not the probability the result happened “by chance” in an undefined sense.

A test with significance level alpha controls the probability of rejecting a true null under the stated model. This is a type I error. A type II error is failing to reject a false null. Power is one minus the type II error probability at a specified alternative. Larger samples, stronger effects, and lower noise generally improve power, while stricter significance thresholds can reduce it. A nonsignificant result can reflect weak evidence rather than evidence of exactly zero effect.

Statistical significance differs from economic significance. A reliably estimated daily gain of 0.2 basis points may disappear under transaction costs. A noisy estimate of a large effect may remain economically interesting but uncertain. Report effect size, uncertainty, costs, and the decision context alongside a p-value. A threshold should not replace quantitative reasoning.

If many hypotheses are tested, some small p-values are expected even when every null is true. Under independent tests each using alpha = 0.05, the probability of at least one false rejection among m tests is 1 − 0.95^m. For m = 20 it is approximately 64.15%. Independence is used for this exact calculation; multiplicity remains a concern without it. Searching many strategy variants and reporting only the winner is a statistical selection procedure, even if the researcher never calls it a test.

Bonferroni controls familywise error by testing each of m hypotheses at alpha/m, using a union bound rather than independence. False-discovery-rate procedures target a different error criterion, the expected proportion of false discoveries under specified conditions. A research report should name the family of tests and explain the correction. Splitting one search into many unreported notebooks does not remove multiplicity.

## 6.6 Bootstrap and simulation-based inference

The nonparametric bootstrap resamples observations with replacement from the empirical distribution, recomputes an estimator, and uses the resulting distribution to approximate sampling variability. It substitutes the observed distribution for the unknown population. For a mean under suitable independent sampling, the approach can work well. It cannot manufacture observations from regimes absent from the sample.

A practical bootstrap has explicit steps: store n observations; draw n indices independently with replacement; compute the statistic; repeat B times; summarize the bootstrap distribution. A standard-error estimate is the standard deviation of bootstrap statistics. Percentile intervals use empirical quantiles, while basic and studentized intervals use different transformations. Their coverage properties differ; no interval recipe is universally best.

For time series, independent resampling destroys serial dependence. A block bootstrap resamples contiguous stretches, attempting to preserve local dependence. Block length trades dependence preservation against the number of effectively independent blocks. For clustered observations, resample clusters when the theory justifies that sampling unit. “Bootstrap” names a family of procedures, not permission to ignore the data's structure.

The bootstrap can fail for nonsmooth extremes, weakly identified parameters, unstable model-selection steps, and certain boundary problems. Repeating an invalid resampling procedure more times reduces simulation noise around an invalid approximation. Distinguish the number of bootstrap replications from the amount of original information.

A parametric bootstrap simulates new datasets from a fitted model. It can incorporate dependence when that model captures it, but it inherits model misspecification. A permutation test instead relies on an exchangeability or randomization argument. Permuting labels in a dependent time series without justification may destroy exactly the structure relevant to the null.

## 6.7 Bayesian inference, step by step

Bayesian inference specifies a prior distribution p(theta), combines it with likelihood p(data given theta), and normalizes to obtain posterior p(theta given data). The prior is part of the model and should be stated. It may represent substantive information or a regularizing convention; calling it “uninformative” does not eliminate modeling choices or parameterization effects.

For a Bernoulli success probability p, a Beta(a, b) prior has density proportional to p^(a−1)(1 − p)^(b−1), for a and b positive. With k successes in n trials, multiplying by the likelihood gives a Beta(a + k, b + n − k) posterior. Its mean is (a + k)/(a + b + n), a weighted combination of prior mean a/(a + b) and observed proportion k/n.

If the prior is Beta(2, 2) and data contain eight successes in ten independent trials, the posterior is Beta(10, 4), with mean 10/14 ≈ 0.7143. The sample proportion is 0.8; the posterior mean is pulled toward the prior mean 0.5. The amount of shrinkage follows the prior's concentration relative to sample size. A different reasonable prior can materially affect a small sample, so sensitivity analysis belongs in the report.

A posterior predictive distribution averages the data-generating model over posterior parameter uncertainty. For one next Bernoulli outcome, the predicted success probability equals the posterior mean of p. For many future observations, the shared unknown p induces predictive dependence after averaging it out. This illustrates why uncertainty about a parameter is not equivalent to plugging a point estimate into every future simulation.

Bayesian credible intervals assign posterior probability to parameter regions under the specified model. They do not automatically have frequentist coverage in every sampling situation. Conversely, a frequentist confidence interval does not automatically encode a prior. Choose an interpretation deliberately and explain it in terms the decision-maker can use.

## 6.8 Model checking and predictive evaluation

Estimation asks which parameter fits within a model; model checking asks whether the model's observable implications resemble data. Examine residual distributions, serial dependence, conditional variance, and calibration. A model can fit an average while failing in the tails. A large likelihood can favor a flexible model that overfits, so in-sample fit alone is insufficient.

Posterior predictive checks simulate data under the fitted Bayesian model and compare meaningful statistics with those observed. Frequentist goodness-of-fit checks similarly examine discrepancies under a reference distribution. Select discrepancies relevant to the question, such as clustered losses or forecast calibration. No finite checklist establishes that a model is true; it can expose particular failures and support limited adequacy for a purpose.

Separate training, validation, and test data. Training estimates parameters. Validation chooses models or hyperparameters. The final test estimates performance after those choices are fixed. Repeatedly examining the test set turns it into another validation set. Financial data also require chronological separation and care with overlapping label windows, discussed in Chapters 16 and 17.

Predictive calibration asks whether events assigned probability p occur at approximately rate p in comparable cases. A model can rank cases well but be poorly calibrated. Accuracy can be misleading under class imbalance: always predicting no event achieves 99% accuracy if events occur 1% of the time. Compare with meaningful baselines and use metrics tied to the research target and error costs.

## 6.9 Selection, publication, and the winner's curse

Suppose one hundred strategies each have true mean zero, but their estimated means contain noise. The largest observed mean will usually be positive. Selecting it makes the reported estimate upward biased conditional on selection. This is the winner's curse. An ordinary confidence interval calculated as if the strategy had been chosen in advance does not generally account for the search.

Pre-specify the research question, universe, data cutoff, target, candidate models, primary metric, cost assumptions, and stopping rule when feasible. Exploration remains valuable; label it exploratory and seek fresh confirmation. A log of failed variants is useful evidence about the size of the search. The goal is not to prohibit discovery but to distinguish discovery from confirmation.

Survivorship bias selects entities that remain observable or successful. Looking only at today's fund list omits closed funds and can overstate historical performance. Look-ahead bias uses information unavailable at the decision time. Revision bias uses corrected historical macroeconomic data rather than the vintage available then. These are sampling and information-set problems, not errors that a more complex estimator automatically fixes.

## 6.10 A complete inference example

Consider twenty independent hypothetical measurements with sample mean 1.5 and sample standard deviation 4.0. We test a zero population mean under a normal sampling model. Standard error is 4/sqrt(20), approximately 0.8944; the t statistic is 1.5/0.8944 ≈ 1.6771 with nineteen degrees of freedom. A two-sided 95% interval uses a critical value about 2.093, giving approximately [−0.372, 3.372]. Zero is inside the interval.

The defensible conclusion is that this sample does not reject the specified zero-mean null at the 5% two-sided level. It does not establish that the mean equals zero. If the economically relevant threshold is 2.0 after costs, the interval also shows substantial uncertainty about exceeding that threshold. If observations are dependent, the calculation's nominal confidence interpretation needs revision.

Now suppose the researcher chose these twenty measurements from two hundred candidates after seeing which subset had the largest average. The arithmetic is unchanged, but its interpretation is no longer the pre-specified sampling experiment. Selection must enter the inference or an independent sample must be used. A numerical result is inseparable from the procedure that produced it.

The inference laboratory displays repeated-sampling behavior for the mean and a separate multiple-testing calculation. Reset returns to the same seed, allowing comparison of sample sizes without confusing a changed random draw with a changed statistical rule. The displayed intervals are teaching examples under the stated normal independent model, not confidence guarantees for arbitrary financial returns.

### The delta method connects estimator uncertainty to transformations

Suppose theta_hat is close to theta and sqrt(n)(theta_hat − theta) has an approximately normal distribution with variance V. For a differentiable scalar function g, Taylor expansion gives g(theta_hat) − g(theta) approximately g'(theta)(theta_hat − theta). The transformed estimator therefore has approximate variance [g'(theta)]²V/n. In several dimensions, the gradient replaces the derivative and covariance becomes gradient-transpose V gradient divided by n.

For a positive estimated variance v_hat, volatility is sqrt(v_hat), whose derivative is 1/(2sqrt(v)). The same absolute variance-estimation error has a larger first-order effect on volatility when v is small. Near a boundary v = 0, this derivative becomes singular and the ordinary delta approximation needs reconsideration. A theorem's smoothness requirement explains the failure rather than merely labeling it a numerical issue.

For a ratio a_hat/b_hat, the derivatives are 1/b and −a/b². A denominator near zero can make uncertainty enormous and the normal approximation poor. This connects Sharpe-ratio inference, weak-IV ratios, and ordinary relative-error calculations. Replacing a small denominator by an arbitrary constant may stabilize code while changing the estimand; it is not an inferential repair.

### Robust summaries and contamination

The mean is sensitive to extreme observations because every value enters linearly without a bound. The median is less affected by one arbitrarily large observation but estimates a different population feature. A trimmed mean discards a specified fraction at each tail; a winsorized mean replaces extreme values by threshold values. Define these choices before seeing which produces a favorable result.

If a sample is 1, 2, 3, 4, 100, its mean is 22 and median three. Neither arithmetic result is wrong. If 100 is a valid rare payoff, deleting it changes the investment question. If it is a misplaced decimal, retaining it corrupts the data. Statistical robustness and data verification address different problems. Inspect the source and economic mechanism before deciding how an extreme value should enter the analysis.

Robust standard errors do not make the mean robust to arbitrary contamination. They estimate uncertainty under a specified class of variance or dependence violations. A robust loss changes the fitted target; a robust covariance changes estimated sampling variability. State which operation was performed and what it protects against.

### Planning a sample size requires an effect size

Under a normal known-variance model, a two-sided confidence interval for a mean has half-width approximately z times sigma/sqrt(n). To target half-width h, solve n approximately (z sigma/h)². With sigma = 0.04, h = 0.005, and z = 1.96, the result is about 246 independent observations. This is a planning calculation under stable variance and independent sampling, not a guarantee that 246 financial months suffice.

If observations are serially dependent, replace the independent variance relationship with an appropriate long-run variance. If the target effect is smaller, required sample size rises quadratically. If many hypotheses will be tested, multiplicity and selection affect the design. A research question can be scientifically sound yet practically underpowered with available data; reporting that is useful.

Power analysis also distinguishes a minimum economically relevant effect from a merely nonzero effect. A very large sample can reject a zero effect that is too small to survive costs. Design around the decision threshold where possible. Estimating that threshold's uncertainty may be as important as estimating the effect itself.

### A likelihood interval and a posterior interval need not agree

For ten Bernoulli trials with eight successes, maximum likelihood gives p_hat = 0.8. A symmetric normal approximation based on p_hat(1 − p_hat)/n has standard error about 0.1265 and can behave poorly near boundaries or with small n. Likelihood-based, score-based, and exact procedures use different constructions and can produce asymmetric intervals.

A Beta prior produces the posterior already derived, with a credible interval defined by posterior quantiles. Its interval changes with prior concentration. This is not evidence that one method is arbitrary and the other assumption-free. Each answers a specified inferential question. Compare their coverage, prior sensitivity, and relevance to the intended decision rather than demanding identical endpoints.

### Report uncertainty at the right level

If a model is re-estimated and selected before each prediction, evaluating only the final fitted coefficient ignores the broader procedure. Resampling or validation should reproduce the important selection and fitting steps when the goal is procedure-level uncertainty. Holding the selected model fixed answers a narrower conditional question. Neither is universally wrong; the report must name which one it estimates.

For a strategy study, uncertainty can include return variation, parameter estimation, candidate selection, cost estimation, and data revisions. Not every component can be summarized in one confidence interval. Present a sampling interval under stated assumptions alongside sensitivity scenarios for less quantifiable components. This makes the evidence more interpretable than one deceptively comprehensive-looking error bar.

### Equivalence asks a different question from non-rejection

Failing to reject a zero effect does not establish that the effect is economically negligible. An equivalence analysis instead specifies a meaningful tolerance band, such as effects between minus and plus two basis points, and asks whether evidence places the target sufficiently within it under an appropriate procedure. The tolerance should come from the decision context before examining the result.

A wide confidence interval spanning both large gains and large losses is inconclusive, even if its p-value against zero is large. A narrow interval entirely inside an economically negligible region can support a more useful conclusion. Report interval width relative to the meaningful effect size, not only whether zero is included. This encourages research designs that can answer a practical question rather than merely accumulate significance tests.

A bootstrap interval can be assessed on a synthetic model with known truth. Generate many independent original datasets, construct an interval from each using the full bootstrap procedure, and count coverage of the known parameter. This tests the implementation and finite-sample behavior for that model. It does not establish coverage for every financial distribution. Use enough outer repetitions to quantify uncertainty in the coverage estimate itself: a simulated coverage fraction is another sample proportion. Distinguish outer datasets from inner bootstrap replications in both code and reporting. Increasing inner replications cannot replace missing outer repetitions when assessing coverage.

Always identify the sampling unit before assigning a standard error to an estimated effect.

## 6.11 Practice and university connections

Suggested applications: derive the bias–variance decomposition; compare n and n − 1 variance divisors on a three-observation example; calculate a Beta posterior; simulate the false-positive rate of twenty independent tests; redesign a bootstrap for weekly overlapping returns. Hints: center the estimator around its own expectation; use the sum-of-squares identity; multiply prior and likelihood powers; preserve the sampling unit that creates dependence.

The statistical-estimation sections of [Stanford EE364A](https://see.stanford.edu/Course/EE364A) connect likelihood and convexity. [MIT 14.382 Econometrics](https://ocw.mit.edu/courses/14-382-econometrics-spring-2017/) develops inference beyond introductory sampling assumptions, and [MIT 15.450 Analytics of Finance](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/) applies estimation, tests, and bootstrap to finance. Those graduate resources assume foundations; Chapters 5 and 6 are the bridge before their advanced notes.

Reliable inference is a chain: define a target, specify how observations become evidence, quantify uncertainty under assumptions, examine violations, and limit conclusions to what that chain supports. Chapter 7 gives the financial objects on which these statistical tools will operate.
