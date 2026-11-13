# 9. Econometrics: identification and estimation

## 9.1 Prediction, description, and causal questions differ

Suppose companies with larger research spending have higher future sales. A regression can describe the association or predict sales for similar firms. It does not automatically estimate how much sales would change if a particular company were forced to spend more. Firms choose spending using information the researcher may not observe. Econometrics connects statistical procedures to explicit questions about economic data-generating mechanisms.

Identification asks whether the target parameter can be uniquely determined from the population distribution of observed variables under the model's assumptions. Estimation asks how to learn that identified parameter from a finite sample. A larger sample can reduce estimation noise while leaving an identification failure untouched. If two parameter values imply exactly the same observable distribution, no amount of data of that form can distinguish them without additional assumptions or information.

The [MIT 14.382 course](https://ocw.mit.edu/courses/14-382-econometrics-spring-2017/) includes structural equations, instrumental variables, generalized method of moments, M-estimation, bootstrap, panels, high-dimensional inference, and treatment effects. This chapter supplies a connected treatment of those families. Its graduate problems remain part of the curriculum: the original notes develop technical details and proofs beyond the representative derivations here.

## 9.2 Linear regression as a population projection

Let Y be an outcome and X a vector of regressors including an intercept when intended. The population linear projection coefficient minimizes E[(Y − X-transpose beta)²], assuming the moments exist and E[XX-transpose] is invertible. Differentiating gives E[X(Y − X-transpose beta)] = 0, hence beta = E[XX-transpose]^(−1)E[XY]. The residual is orthogonal to regressors by construction.

This projection exists as a descriptive best linear approximation even if E[Y given X] is nonlinear. A structural interpretation Y = X-transpose beta + u with E[u given X] = 0 is stronger. It says the same coefficient relationship describes conditional means under the model and excludes systematic residual dependence on X. A causal interpretation generally requires additional assumptions about how X is assigned and how interventions map to outcomes.

For one regressor and an intercept, slope is Cov(X, Y)/Var(X). If Y = beta X + gamma Z + u and Z is omitted, the projected slope on X becomes beta + gamma Cov(X, Z)/Var(X), under suitable orthogonality conditions for u. The extra term is omitted-variable bias relative to beta. It can be positive, negative, or zero depending on both relationships. Adding arbitrary controls is not automatically a cure; controls affected by treatment or selection can create other biases.

Sample OLS replaces expectations by averages. Under identification and suitable laws of large numbers, the estimator converges to the population projection. If a structural exogeneity condition fails, OLS may consistently estimate the projection while failing to estimate the desired structural effect. Calling the estimator “consistent” without naming its target hides the central issue.

## 9.3 Partialling out and interpreting controls

The Frisch–Waugh–Lovell result gives a precise interpretation of a controlled regression. Suppose X is the variable of interest and Z contains controls, including any intended intercept. Regress Y on Z and retain residual y_tilde. Regress X on Z and retain residual x_tilde. Regress y_tilde on x_tilde. The resulting slope equals the X coefficient in the full OLS regression of Y on X and Z, under the appropriate full-rank conditions.

Geometrically, residualization removes the component in the control column space. The remaining regression compares variation in X not linearly explained by Z with variation in Y not linearly explained by Z. This is a linear algebra identity; it does not prove that the remaining variation is exogenous. “Controlling for” a variable means conditioning or projecting within a model, not recreating a randomized experiment by verbal declaration.

In a factor model, partialling out market returns before studying a candidate factor can clarify incremental linear association. If the candidate is nearly collinear with existing factors, little residual variation remains, making its coefficient imprecise. This is a substantive information limitation. A different optimizer cannot manufacture independent variation.

## 9.4 Standard errors follow the dependence structure

For independent homoskedastic errors conditional on a fixed design, the familiar OLS covariance is sigma²(X-transpose X)^(−1). Heteroskedasticity replaces the common variance with observation-specific conditional variance. A sandwich estimator has the form A^(−1) B A^(−1), where A describes model curvature or regressor moments and B describes variability of estimating equations.

For OLS, A_hat = X-transpose X/n and B_hat = sum x_i x_i-transpose u_hat_i²/n under an independent-observation heteroskedasticity-robust formulation. The estimated coefficient covariance is approximately A_hat^(−1)B_hat A_hat^(−1)/n. Finite-sample corrections differ across software. Robust standard errors change uncertainty estimates; they do not repair biased coefficients caused by endogeneity or an incorrectly defined target.

If observations within a firm are dependent across time, clustering by firm can allow arbitrary within-cluster covariance under a many-independent-clusters asymptotic framework. If common dates induce dependence across firms, a date or multiway structure may be relevant. A large number of rows is not equivalent to a large number of independent clusters. Few-cluster inference requires special care and cannot be solved by merely labeling an option “clustered.”

Heteroskedasticity-and-autocorrelation-consistent estimators weight sample autocovariances of score contributions. They require assumptions about dependence decay and bandwidth choices. Chapter 10 connects them to long-run variance and spectral density at frequency zero. The covariance estimator should follow the sampling model and economic dependence, not whichever choice yields the smallest p-value.

## 9.5 Instrumental variables separate relevance from exclusion

Consider Y = beta D + u, where D is correlated with u. An instrument Z can identify beta if it is relevant, Cov(Z, D) nonzero, and satisfies an appropriate exogeneity/exclusion restriction, Cov(Z, u) = 0, in this simple centered linear model. Then Cov(Z, Y) = beta Cov(Z, D), so beta = Cov(Z, Y)/Cov(Z, D). The derivation shows exactly what each assumption accomplishes.

Relevance concerns observable association with the endogenous regressor and can be investigated empirically. Exclusion and exogeneity concern how Z relates to the unobserved structural error and generally require institutional reasoning and design. A strong first-stage regression does not establish a valid instrument. An invalid but strong instrument can give a very precise wrong answer.

With multiple regressors and instruments, two-stage least squares projects endogenous regressors on instruments and included exogenous controls, then relates outcomes to the projected regressors. Its matrix expression uses the projection P_Z = Z(Z-transpose Z)^(−1)Z-transpose. The estimator is (X-transpose P_Z X)^(−1)X-transpose P_Z Y under rank conditions. Use a dedicated IV covariance estimator; treating fitted first-stage regressors as ordinary fixed regressors in a naive second-stage standard-error formula misses the estimation structure.

Weak identification occurs when instruments barely distinguish changes in the target coefficient. In the scalar ratio, a near-zero denominator makes estimates unstable. Conventional normal approximations can fail even in samples that look large. Weak-instrument-robust tests, such as tests based directly on the structural moment at a hypothesized beta, can provide different inference. Instrument strength diagnostics are useful evidence but not a universal threshold certifying validity.

## 9.6 Generalized method of moments

A moment condition states E[g_i(theta0)] = 0 at the true parameter. OLS uses g_i(beta) = X_i(Y_i − X_i-transpose beta); IV uses instrument-weighted residuals. GMM chooses theta to make sample moments close to zero under a weight matrix W:

$$\hat\theta=\arg\min_\theta \bar g(\theta)^\top W\bar g(\theta),\qquad
\bar g(\theta)=\frac1n\sum_i g_i(\theta).$$

If there are more valid moments than parameters, exact zero may be impossible in a finite sample. The weight matrix determines how discrepancies are combined. An efficient asymptotic choice under standard regularity uses the inverse long-run covariance of moments. A common two-step procedure estimates with an initial weight, estimates moment covariance at that preliminary estimate, then re-estimates with the updated weight. Finite-sample behavior can differ from the asymptotic ideal.

Let G be the derivative of expected moments with respect to theta and S their long-run covariance. The asymptotic covariance of sqrt(n)(theta_hat − theta0) is (G-transpose W G)^(−1)G-transpose W S W G(G-transpose W G)^(−1), under identification and regularity. With W = S^(−1), it simplifies to (G-transpose S^(−1)G)^(−1). Rank conditions on G are essential; a formal inverse does not establish identification.

An overidentification statistic can compare minimized moment discrepancies with a reference chi-square distribution under valid moments and standard conditions. Rejection suggests incompatibility among the moment restrictions, not which restriction is wrong. Failure to reject does not prove every instrument valid, especially when tests have low power. Report the economic rationale for each moment alongside statistical diagnostics.

## 9.7 Euler equations connect finance and GMM

Suppose an investor maximizes expected discounted utility of consumption and can shift a small amount of consumption into an asset. At an interior optimum, the marginal utility cost today equals the expected discounted marginal utility benefit tomorrow. A representative condition is E[m_(t+1) R_(t+1)^gross given information_t] = 1, where m is a stochastic discount factor tied to marginal utility under the model.

Multiplying the pricing error mR − 1 by instruments Z_t known at time t gives unconditional moments E[Z_t(mR − 1)] = 0. GMM can estimate preference or discount-factor parameters from these conditions. The instruments' timing is part of the derivation. Using tomorrow's information as an instrument violates the conditional-optimality argument.

With power utility, a model may specify m_(t+1) = delta(C_(t+1)/C_t)^(−gamma), with discount parameter delta and risk-aversion parameter gamma. Estimating these parameters requires reliable consumption and return measurement, adequate identification, and a defensible representative-agent interpretation. A numerical optimum does not demonstrate that the model captures actual investor behavior. Weak sensitivity of moments to parameters can create weak identification even without a traditional IV first stage.

## 9.8 M-estimation and nonlinear models

An M-estimator minimizes an average objective sum rho(W_i, theta)/n. Least squares uses squared residual loss; maximum likelihood minimizes negative log likelihood; quantile regression uses an asymmetric absolute loss. The unifying perspective separates the criterion, identification, optimization, and sampling theory. Smooth objectives often lead to estimating equations, but nonsmooth criteria require appropriate arguments rather than automatic differentiation of a kink.

For binary Y and predictors X, logistic regression specifies P(Y = 1 given X) = 1/[1 + exp(−X-transpose beta)]. Its negative log likelihood is the sum of log(1 + exp(eta_i)) − Y_i eta_i, where eta_i = X_i-transpose beta. The gradient is sum X_i(p_i − Y_i); the Hessian is sum p_i(1 − p_i)X_iX_i-transpose, positive semidefinite. Convexity aids optimization but does not establish causal interpretation or finite-sample calibration.

A logistic coefficient is a change in log odds per unit predictor, holding other included predictors fixed. The probability marginal effect is p(1 − p)beta_j, which depends on the observation. Reporting beta_j as a constant percentage-point effect is wrong. Complete separation can drive unregularized maximum-likelihood coefficients toward infinity, so a solver's large coefficient may reflect a structural estimation issue.

Distribution regression models P(Y ≤ y given X) across thresholds y, often using binary-response regressions at each threshold. It can describe changes across an outcome distribution rather than only the mean. Separate fitted thresholds may violate monotonicity unless constrained or rearranged appropriately. Counterfactual distributions combine estimated conditional distributions with a specified covariate distribution; interpretation depends on the assumptions supporting that combination.

## 9.9 Panel data and fixed effects

Panel data observe multiple entities across time. A simple model is Y_it = alpha_i + tau_t + beta D_it + u_it. Entity effects capture time-invariant differences; date effects capture shocks common across entities. The within transformation subtracts each entity's time mean, removing alpha_i. Identification then comes from within-entity variation remaining after included effects and controls.

Strict exogeneity requires the error at a date to have mean zero conditional on the entity's regressors across all sample dates and relevant effects. Weaker predeterminedness permits some feedback but changes valid moments and estimators. Including lagged outcomes can create correlation between transformed regressors and transformed errors in short panels. More fixed effects do not automatically eliminate dynamic bias.

Nonlinear panel models introduce further complications. Estimating one entity parameter for each entity with fixed short time length can create incidental-parameter bias in structural coefficients. Conditional likelihood, bias correction, or alternative asymptotics can address particular models. The appropriate method depends on the model's structure; applying linear within demeaning to a nonlinear probability model does not generally remove the fixed effect in the same way.

## 9.10 Treatment effects and research design

Potential outcomes Y(1) and Y(0) describe outcomes under treatment and no treatment. The individual treatment effect is their difference, but only one is observed for each unit. The average treatment effect is E[Y(1) − Y(0)]. The missing counterfactual is the central identification problem. A treated-versus-untreated mean difference mixes treatment effects with selection unless assignment or assumptions justify the comparison.

Under conditional unconfoundedness, treatment is independent of potential outcomes given observed X, and overlap requires propensity e(X) = P(D = 1 given X) bounded away from zero and one in the relevant population. Then outcome regression or inverse-probability weighting can identify average effects. These assumptions exclude unmeasured confounding and require comparable treated and untreated cases. They are not certified by a high predictive score.

A doubly robust score for the average effect combines outcome models m1(X), m0(X) and propensity e(X): m1 − m0 + D(Y − m1)/e − (1 − D)(Y − m0)/(1 − e). Under suitable conditions its expectation equals the target if one of the relevant nuisance-model components is correctly specified. Orthogonal scores and cross-fitting can reduce first-order sensitivity to estimated nuisance functions, subject to rate and regularity conditions. “Doubly robust” does not protect against every identification failure or absent overlap.

Difference-in-differences compares changes across groups under a parallel-trends counterfactual assumption and appropriate timing conditions. With staggered treatment and heterogeneous effects, a naive two-way fixed-effect coefficient can aggregate effects in problematic ways. Event-study plots can diagnose pre-trend patterns but do not prove parallel trends. A financial announcement event study, which measures abnormal returns around an event, is related in name but not automatically the same causal design.

## 9.11 High dimensions, selection, and simultaneous inference

When predictors are numerous relative to observations, ordinary least squares can be unstable or unidentified. Ridge penalizes squared coefficient size; lasso penalizes absolute size and can select sparse models. Their tuning parameters should be chosen within the training process. A selected coefficient's ordinary post-selection t statistic generally ignores the selection procedure and can overstate evidence.

Partialling out with flexible high-dimensional nuisance models can help estimate a low-dimensional target when the target score has suitable orthogonality. Cross-fitting estimates nuisance functions on one fold and evaluates scores on another. This reduces certain overfitting dependencies, but financial time dependence requires folds and inference compatible with the sampling structure. Random cross-fitting is not automatically valid for every time-series problem.

Moderately high-dimensional GMM can accumulate bias and distort conventional approximations when the number of moments grows. More instruments may improve population identification while worsening finite-sample performance. Bias correction, regularization, and dimension restrictions must follow the relevant theory. “Use all available variables” is not a generally sound statistical rule.

Simultaneous inference concerns a collection of estimates or confidence statements. A band covering an entire response curve differs from separate pointwise intervals at each point. Bootstrap critical values based on a maximum statistic can account for joint behavior under suitable conditions. Define the family of claims before evaluating coverage or significance.

### A scalar moment example with identification visible

Suppose Y_i = theta X_i + u_i and an instrument Z_i satisfies E[Z_i u_i] = 0. The sample moment is average Z_i(Y_i − theta X_i). With one moment and one parameter, setting it to zero gives theta_hat = sum Z_iY_i / sum Z_iX_i when the denominator is nonzero. If the numerator is 12 and denominator four, the estimate is three. If a tiny data revision changes the denominator from 0.01 to −0.01 while the numerator remains one, the estimate jumps from 100 to −100.

The problem is not that division is implemented badly. The observed moment barely distinguishes parameter values, so the target is weakly identified in the relevant sense. An optimizer may still report a sharply defined numerical minimum because numerical precision and statistical information are different. Plotting the objective over plausible theta values can reveal a flat or irregular region hidden by a single reported estimate.

For a candidate theta0, the sample moment at theta0 can be tested directly with a variance estimate appropriate to Z_i u_i(theta0). Inverting a family of such tests can give a confidence set that remains valid under weaker identification assumptions than a naive normal interval for the ratio. The set may be very wide or unbounded, which is an honest expression of limited information.

### Local treatment effects from an instrument

When both treatment D and instrument Z are binary, the ratio of the change in mean outcome across Z groups to the change in treatment probability is often called the Wald estimand. Under random or conditionally valid instrument assignment, exclusion, relevance, and a monotonicity assumption ruling out one direction of treatment switching, it identifies an average treatment effect for compliers in the standard potential-outcomes framework.

Compliers are units whose treatment changes in the direction encouraged by the instrument. Their effect need not equal the population average effect or the effect for always-treated units. This is a substantive limitation, not a defect to hide. If an instrument changes borrowing access for marginal firms, the estimated effect may concern those firms rather than every company in the market.

### A difference-in-differences calculation

Suppose a treated group's mean outcome rises from 10 to 14 and a comparison group's from 8 to 11. The before–after treated change is four; the comparison change is three; the difference-in-differences estimate is one. The identifying assumption says that, absent treatment, the treated group's change would have matched the comparison group's change under the chosen design and conditioning.

Equal pre-treatment levels are not required by that assumption, and similar levels do not prove parallel trends. Differential shocks, anticipation, changing composition, and treatment spillovers can invalidate the interpretation. With multiple dates, event-time estimates can describe dynamics, but choosing the specification after inspecting favorable pre-trends creates selection. State the design before presenting the graph as evidence.

### M-estimator asymptotics from a local expansion

For a smooth estimating equation average psi(W_i, theta_hat) = 0, expand around theta0: zero approximately equals average psi(W_i, theta0) + A(theta_hat − theta0), where A is the population derivative matrix. Rearranging gives sqrt(n)(theta_hat − theta0) approximately −A^(−1) times sqrt(n) average psi(W_i, theta0). A central limit theorem for the score average then gives sandwich covariance A^(−1)BA^(−transpose).

This derivation explains the regularity requirements. A must be invertible for local identification; the score must have suitable moments and a valid limit theorem; the remainder must be negligible. If A is nearly singular, uncertainty grows. If the objective has a boundary or kink, the expansion may need a different form. If observations are dependent, B is a long-run covariance rather than a single-observation covariance.

### Resampling the complete estimator

An econometric bootstrap should repeat the estimation steps relevant to the target distribution. If the original estimator selects controls, estimates a propensity score, and fits an outcome model, freezing all those stages while resampling only the final residual can answer a different question. Some procedures require specialized bootstrap theory, and naive resampling after model selection can fail.

For a panel with independent entities and dependent observations within entity, resampling entire entities preserves the within-entity structure under a cluster-bootstrap rationale. For one long dependent series, block methods address a different sampling setting. Match the resampling unit to the scientific experiment. An implementation that runs without errors does not establish the validity of the resampling approximation.

### Measurement error can change the target coefficient

Suppose the true regressor is X_star but the observed regressor is X_star plus independent mean-zero measurement error V. In a simple model Y = beta X_star + u with the relevant independence assumptions, the observed-regressor slope is beta times Var(X_star) divided by Var(X_star) plus Var(V). The denominator includes noise that predicts none of Y, producing attenuation toward zero.

This result depends on the classical measurement-error assumptions. Nonclassical error can bias coefficients in other directions. A company characteristic built from stale or revised accounting records may violate those assumptions. More observations reduce sampling noise around the contaminated projection; they do not automatically recover the structural coefficient. Better measurement or a valid identifying design may be required.

A control variable measured after treatment can be a mediator, a consequence of treatment, or a selection variable. Including it may change the estimand or introduce bias rather than improve identification. Draw the hypothesized causal sequence and name the target effect before deciding which controls belong in a structural regression. Predictive feature usefulness and causal adjustment validity are different criteria.

## 9.12 A reproducible econometric workflow

Write the estimand first: population projection, predictive effect, causal effect, or structural parameter. Specify the observable unit and information timing. Draw or describe the assignment and measurement process. State identification assumptions, then choose an estimator and covariance method consistent with them. Only after that should you interpret a coefficient.

For a factor regression, use excess returns aligned by date, verify units, include an intercept intentionally, inspect rank, estimate coefficients, and examine residual dependence. Compare ordinary and dependence-aware uncertainty when justified. Report the benchmark model, sample, costs, and any strategy selection preceding the regression. A significant intercept after an undisclosed search is not clean confirmatory evidence.

The regression laboratory fits a line to a synthetic cloud with adjustable slope and noise. It visualizes projection and sampling variability. It does not identify a causal effect. The Python examples implement a hand-checkable OLS fit and residual checks; advanced IV, GMM, and treatment-effect exercises are analytical and source-based study tasks rather than claims that every estimator is implemented in the companion.

Suggested applications: derive omitted-variable bias; reproduce the partialling-out identity on a small dataset; explain relevance versus exclusion for a proposed instrument; write moments for a pricing equation; compare strict and weak exogeneity in a panel; design a treatment-effect analysis with an explicit overlap check. Use the [14.382 lecture notes](https://ocw.mit.edu/courses/14-382-econometrics-spring-2017/pages/lecture-notes/) and original assignments for deeper derivations and empirical practice. The catalog records published R code and data links; they remain external materials with their own provenance.

The next chapter makes time dependence the center of the model. Regression assumptions that were optional simplifications here become explicit questions about persistence, forecasting, volatility, and the amount of independent information in a financial series.
