# 11. Multivariate time series and Bayesian computation

## 11.1 Several series can share a dynamic structure

Interest rates, inflation, output, and asset returns interact through time. Modeling each separately can miss useful cross-series information, but adding many variables also increases estimation burden. A system model must define its variables, timing, transformations, and intended interpretation. A predictive system is not automatically a causal explanation of policy or market behavior.

This chapter covers the later families in [MIT 14.384](https://ocw.mit.edu/courses/14-384-time-series-analysis-fall-2013/pages/lecture-notes/): vector autoregressions, structural identification, factors, empirical processes, unit roots, breaks, cointegration, state-space filtering, Bayesian methods, and Markov-chain Monte Carlo. These are substantial graduate subjects. The derivations here establish a coherent working foundation; the mapped original notes and problems supply further technical development.

## 11.2 Vector autoregression and stability

A VAR(1) writes x_t = c + A x_(t−1) + u_t, where x_t is a column vector and u_t is a vector innovation with specified conditional mean and covariance. Each equation regresses one variable on all lagged variables. A VAR(p) includes p lag matrices. If there are k variables, the number of coefficients grows roughly with k²p, so a large system can overfit quickly.

For a stable VAR(1), all eigenvalues of A have magnitude less than one. Then repeated substitution gives x_t − mu = sum from j = 0 to infinity of A^j u_(t−j), with mu = (I − A)^(−1)c when defined. This is the matrix version of the AR(1) geometric expansion. Stability concerns powers of A, which explains the eigenvalue criterion.

If innovation covariance is Sigma_u, stationary covariance Gamma solves Gamma = A Gamma A-transpose + Sigma_u. This discrete Lyapunov equation adds the propagated old uncertainty to new innovation uncertainty. A numerical solution should be checked by substituting it back into the equation and verifying symmetry and positive semidefiniteness. A solver returning a matrix is not enough.

Forecasts recursively apply the estimated system. For h steps ahead, the conditional mean is mu + A^h(x_t − mu), and forecast-error covariance sums A^j Sigma_u (A-transpose)^j over future innovation contributions. These formulas assume known parameters; estimated-parameter uncertainty adds another layer that short samples can make important.

## 11.3 Reduced-form innovations and structural shocks

Reduced-form innovations u_t can be contemporaneously correlated. A structural model writes u_t = B epsilon_t with structural shocks normalized to identity covariance. Then Sigma_u = BB-transpose. Many B matrices can yield the same covariance, so reduced-form estimation alone does not identify a unique economic shock decomposition.

A Cholesky factor imposes a recursive ordering. Changing the variable order generally changes the implied contemporaneous restrictions and impulse responses. This is an identifying assumption, not a neutral numerical convenience. Other approaches use long-run restrictions, sign restrictions, external instruments, or explicit structural equations. Each requires an argument tied to the economic setting.

An impulse response at horizon h is A^h B times a chosen structural shock vector in a VAR(1). It describes the model's response to a normalized shock holding the modeled mechanism fixed. Confidence intervals need to reflect estimation and, where relevant, identification uncertainty. A response plot without units, shock normalization, and identifying restrictions is incomplete.

Granger predictability asks whether past values of one series improve prediction of another conditional on included information. It is a statement about incremental forecasting within a model, not necessarily intervention causality. Omitted common drivers, measurement timing, and nonstationarity can create or obscure predictive relationships. Use the term with its formal meaning rather than as shorthand for “causes.”

## 11.4 Factor models reduce a large system

A static factor model writes x_t = Lambda f_t + e_t, where a small factor vector captures common variation across many observed series. Loadings Lambda map factors to observables. Because Lambda H and H^(−1)f_t produce the same product for invertible H, factors need normalization and are not uniquely labeled by the data alone. PCA imposes a convenient orthogonal normalization under its objective.

Dynamic factors evolve over time, for example f_t = A f_(t−1) + eta_t, and can combine with a measurement equation in state-space form. They allow many series to inform a smaller hidden state. Missing observations and ragged publication schedules can be handled by suitable filtering, but the data's actual release times remain essential for real-time forecasting.

For yield curves, a few factors can summarize correlated maturity movements. Evaluate reconstruction error, out-of-sample stability, and sensitivity to maturity scaling. A low reconstruction error is not a guarantee of derivative-pricing accuracy or forecast skill. A model can describe historical curves well while misrepresenting the tails or dynamics relevant to a particular claim.

## 11.5 Unit roots and nonstandard inference

A random walk x_t = x_(t−1) + u_t has a unit root. Its variance grows with time under independent finite-variance innovations. Regressing one unrelated random walk on another can produce a high R-squared and apparently significant conventional t statistics despite no meaningful relationship. This spurious-regression problem arises because familiar stationary asymptotics do not apply.

Rewrite an AR(1) as delta x_t = (phi − 1)x_(t−1) + u_t. Testing a unit root means testing coefficient zero in this representation. Under the unit-root null, the usual t statistic has a nonstandard limiting distribution; ordinary normal critical values are inappropriate. Augmented tests add lagged differences to address short-run dependence under their assumptions. Deterministic intercept and trend choices affect the test's distribution and interpretation.

Unit-root tests can have low power against highly persistent stationary alternatives. A failure to reject is not proof of an exact unit root. Structural breaks can also distort tests. Inspect economic context, transformation choices, and alternative models. A blanket instruction to difference after one p-value discards information and hides uncertainty about persistence.

An empirical process studies how a whole estimated function, such as an empirical distribution or a partial-sum path, fluctuates around its population counterpart. Ordinary central limit theory studies one statistic; empirical-process theory studies collections indexed by thresholds, time fractions, or functions. This distinction explains why uniform confidence bands and unit-root limits require more than a pointwise normal approximation. Brownian-motion functionals appear as limits of rescaled partial sums under suitable conditions.

## 11.6 Cointegration and error correction

Two series can each be nonstationary while a particular linear combination is stationary. Suppose x_t is a random walk and y_t = 2x_t + v_t with stationary v_t. Then y_t − 2x_t = v_t is stationary. The vector (−2, 1) describes a cointegrating relationship. Shared stochastic trends cancel in the combination.

A cointegrating relationship is stronger than a high correlation of levels. It concerns the integration order of a specific linear combination under a dynamic model. Estimating the combination and testing residual stationarity requires appropriate nonstandard inference because the residuals come from an estimated regression. A conventional stationary residual test with ordinary critical values can be invalid.

An error-correction representation connects short-run changes to long-run disequilibrium. In a simple form, delta y_t = alpha(y_(t−1) − beta x_(t−1)) + short-run lag terms + innovation. If alpha is negative under this sign convention, an above-equilibrium y tends to adjust downward. A multivariate vector error-correction model writes delta x_t = Pi x_(t−1) + lagged differences + u_t, with reduced-rank Pi = alpha beta-transpose when cointegration holds.

Cointegration does not guarantee profitable pairs trading. Estimated relationships can break, costs and borrow fees can dominate, and convergence can occur through an adverse path or not within a feasible horizon. A trading strategy needs position sizing, stop or exit rules, financing, and an out-of-sample stability analysis. The model identifies a historical dynamic relationship, not a contractual promise of mean reversion.

## 11.7 Structural breaks and changing regimes

A structural break changes parameters or distributional features at an unknown or known date. A mean shift can create apparent persistence; a variance shift can distort confidence intervals; a change in measurement can look like an economic regime change. Begin with data provenance before interpreting a detected break.

A known-break test compares constrained and separate parameter fits under a specified sampling model. Searching over unknown break dates changes the statistic's distribution because the date is selected to maximize evidence. Minimum segment lengths and multiple-break choices affect results. Report the search procedure and use an inference method designed for it rather than an ordinary single-date test after choosing the most dramatic date.

Regime-switching models introduce a latent state, often a Markov chain, governing parameters. They can describe different volatility or mean regimes, but estimated states are model-based classifications. Label switching, local optima, and weak separation can complicate estimation. A retrospective smoothed state uses future observations; a filtered state uses only current and past observations. Forecasting must use the latter information convention.

## 11.8 State-space models and the Kalman filter

A linear state-space model separates hidden dynamics from noisy observations:

$$s_t=F s_{t-1}+\eta_t,\qquad y_t=H s_t+\epsilon_t.$$

Assume zero-mean independent Gaussian innovations with covariance Q and R and a Gaussian initial state. The Kalman filter recursively computes the conditional state mean and covariance. Prediction gives m_minus = F m_previous and P_minus = F P_previous F-transpose + Q. The innovation is v = y − H m_minus with covariance S = H P_minus H-transpose + R. The gain is K = P_minus H-transpose S^(−1). Update m = m_minus + Kv and P = P_minus − K S K-transpose, with numerically stable equivalent covariance updates available.

For a scalar hidden level with predicted mean 10 and variance 4, observe y = 13 with measurement variance 5 and H = 1. Innovation variance is nine, gain is 4/9, updated mean is 10 + (4/9) × 3 = 11.3333, and updated variance is 4 − 16/9 = 2.2222. The filter compromises between prediction and observation according to their relative uncertainty. A noisier observation receives less weight.

Filtering conditions on observations through t; smoothing conditions on a later completed sample. A smoothed historical state often looks more accurate because it uses future information. It must not be inserted into a historical trading decision as if it were known then. This timing distinction is one of the most consequential uses of precise probability conditioning.

Under non-Gaussian assumptions, the same linear recursions can retain a best-linear-estimation interpretation under suitable moment conditions, but they need not give the full conditional distribution. Nonlinear models require approximations or other filters. State clearly whether a method is exact under its assumptions, a linear approximation, or a simulation-based estimate.

## 11.9 Likelihood, hidden states, and DSGE context

In a linear Gaussian state-space model, one-step innovations and their covariances provide a likelihood: each observation contributes a normal density conditional on the past. Summing log contributions gives an objective for estimating transition and noise parameters. Identification, initialization, positivity constraints, and local optima still matter. Multiple parameter combinations can produce similar observable dynamics.

Dynamic stochastic general equilibrium models specify agents, constraints, expectations, and market-clearing conditions, often producing nonlinear dynamic systems. Linearization around a steady state can yield a state-space representation for estimation and filtering. The state-space machinery is a computational bridge, not a substitute for the economic assumptions. Solving a representative model requires defining preferences, technology, policy rules, and equilibrium before applying a filter.

For curriculum purposes, derive and estimate simple state-space models first. Then read the course's DSGE-related notes to understand how structural economics supplies the transition and measurement equations. Building an entire policy model from scratch is an advanced extension; recognizing its assumptions and estimation structure is part of the common core.

## 11.10 Bayesian time-series models

A Bayesian VAR places priors on coefficients and covariance parameters, then updates with the likelihood. Shrinkage priors can stabilize systems with many lag coefficients. Prior scales and centering encode assumptions about persistence and cross-variable influence. A prior favoring a random-walk-like own lag has a different implication from one favoring zero persistence. Report the choice and inspect sensitivity.

Posterior predictive forecasting integrates over parameter and state uncertainty. Draw parameters from the posterior, draw or condition on the current state, simulate future innovations, and summarize future trajectories. Plugging only posterior mean parameters into one forecast generally omits some uncertainty and can differ from averaging nonlinear forecasts over posterior draws.

Bayesian model comparison can use marginal likelihoods, but these can be sensitive to prior choices and numerical methods. Predictive evaluation asks a different question and may be more directly relevant for forecasting. A model can have strong in-sample posterior fit and poor future calibration if its structure changes or its observation model is wrong.

## 11.11 Markov-chain Monte Carlo

When a posterior cannot be integrated analytically, MCMC constructs a Markov chain whose stationary distribution is the target posterior under suitable conditions. Draws are dependent. The number of iterations is not the number of independent posterior samples. Convergence and mixing diagnostics are necessary evidence, though no finite diagnostic proves complete convergence in every model.

Metropolis–Hastings proposes theta_star from q(theta_star given theta), then accepts with probability min[1, p_tilde(theta_star)q(theta given theta_star)/(p_tilde(theta)q(theta_star given theta))]. The unknown posterior normalization cancels. For a symmetric random-walk proposal, the q ratio is one. If a proposal is rejected, retain the current state; discarding rejected states changes the target sampling scheme.

Why this acceptance rule? It enforces a detailed-balance relationship between the probability flow from theta to theta_star and the reverse flow, relative to the target. Under additional irreducibility and recurrence conditions, the chain can converge to that target. An excessively small proposal makes high acceptance but slow exploration; an excessively large proposal can create many rejections. Acceptance rate alone is not a convergence certificate.

Gibbs sampling draws each parameter block from its full conditional distribution given the other blocks. If two parameters are strongly correlated, one-at-a-time updates may move slowly along a narrow posterior ridge. Reparameterization or blocking can improve mixing. Multiple chains from dispersed starts, trace plots, effective sample size, and modern convergence diagnostics help reveal problems. A burn-in discard does not automatically fix poor exploration or multimodality.

For a simple normal-mean posterior with known variance and a normal prior, we know the exact posterior analytically. This makes an excellent MCMC test: compare sampled mean and variance with the known values, accounting for Monte Carlo error. Testing on a known target before a complex financial model distinguishes algorithm mistakes from difficult posterior geometry.

## 11.12 A worked hidden-level study

Generate a synthetic level that moves by small random increments and observe it with larger measurement noise. Start with a diffuse but finite initial uncertainty. At each date, predict the state, calculate the innovation, update using the gain, and retain the filtered mean and variance. Compare the filtered path with observations and the known synthetic hidden path. The hidden truth is available only because we generated the data; market applications generally lack that advantage.

Change measurement variance R while holding the synthetic observations fixed. Larger R makes the filter trust observations less; larger process variance Q makes it adapt faster to new observations. These parameters represent a tradeoff between assumed state mobility and measurement reliability. Estimating both from a short history can be difficult because different combinations may explain similar observed variation.

The filtering laboratory exposes Q and R and displays observations, hidden synthetic state, and filtered estimate. It uses filtering rather than smoothing and resets to a fixed seed. The implementation is a scalar linear-Gaussian teaching model; it does not claim to implement a full VAR, DSGE model, or general MCMC engine. Those topics have analytical worked treatment here and mapped advanced source assignments.

### Cointegration versus a stationary ratio

A ratio y_t/x_t can look stable while the difference y_t − beta x_t is nonstationary, and a stationary linear combination need not produce a stable ratio when the denominator approaches zero. Cointegration is defined for integration orders and linear combinations under the model, not for any chart that appears bounded. Decide whether the economic hypothesis concerns dollar spreads, log-price differences, or proportional ratios before selecting a test.

If log prices satisfy log P_A − beta log P_B = stationary spread, the corresponding trading exposures require translating log sensitivities into share or dollar holdings. A constant beta in log space does not automatically mean holding a constant number of shares. Transaction costs and rebalancing enter that translation. Mathematical stationarity and self-financing implementation are separate obligations.

### A two-variable VAR impulse response by hand

Let A = [[0.5, 0.2], [0, 0.4]] and let a structural shock initially affect only the second variable by one unit, with B equal to identity. At horizon zero the response is (0, 1). At horizon one it is A(0, 1) = (0.2, 0.4). At horizon two it is A(0.2, 0.4) = (0.18, 0.16). The second variable decays directly while feeding the first through the cross-lag coefficient.

The eigenvalues are 0.5 and 0.4, so the response eventually decays. If B instead mixes shocks across variables, the initial response changes before propagation. This small calculation distinguishes dynamics A from contemporaneous identification B. A response's economic label comes from B and the identifying argument, not from the matrix multiplication alone.

### Kalman uncertainty and innovation diagnostics

In the scalar example, gain K = P_minus/(P_minus + R) lies between zero and one for positive variances. If prediction variance approaches zero, the filter almost ignores the observation. If measurement variance approaches zero, it almost adopts the observation. These limiting cases are useful checks on both code and intuition. A negative gain in this scalar setup indicates invalid inputs or an implementation error.

Standardized innovations divide each innovation by the square root of its predicted variance. Under a correctly specified linear Gaussian model with appropriate initialization, these innovations have the corresponding independent standard-normal structure. Persistent correlation, changing scale, or extreme tails can reveal model failure. Estimating Q and R from the same short dataset affects diagnostics and uncertainty, so do not interpret a few matching moments as proof of correctness.

The Joseph covariance update, (I − KH)P_minus(I − KH)-transpose + KRK-transpose, is algebraically equivalent to a simpler update under exact arithmetic and optimal gain. It can better preserve symmetry and nonnegative covariance numerically. This is an example of choosing a computational form that respects a mathematical invariant.

### Metropolis–Hastings on a known posterior

Suppose observations have known variance one and unknown mean theta, with prior theta normal mean zero and variance four. For n observations with sum s, posterior precision is 1/4 + n and posterior mean is s/(1/4 + n). Posterior variance is the reciprocal precision. These exact results make a test target for a sampler.

Propose theta_star = theta + proposal_sd times Z. Compute the log unnormalized posterior difference, then accept if log(U) is below the smaller of zero and that difference. Using log probabilities avoids underflow from multiplying many tiny densities. Record the retained state on every iteration, including rejection repeats. Compare the chain's mean and variance with the exact posterior and inspect autocorrelation.

If proposal_sd is extremely small, almost every proposal is accepted but the chain can take a long time to traverse the posterior. If extremely large, most proposals land in low-density regions and are rejected. Both can produce misleadingly stable short traces. Several dispersed chains and effective-sample diagnostics provide more useful evidence than acceptance alone.

### Gibbs sampling for a correlated Gaussian pair

Let (X, Y) be a bivariate normal pair with zero means, unit variances, and correlation rho with |rho| < 1. The conditional distribution X given Y = y is normal with mean rho y and variance 1 − rho²; the analogous statement holds for Y given X. Alternating those two draws is a Gibbs sampler with the desired joint stationary distribution under the standard conditions.

When rho is close to one, each update changes the state mostly by a small amount around the current ridge, so mixing can be slow. Transforming to principal-component coordinates can reduce correlation and improve exploration in this known Gaussian case. This connects MCMC computation with linear algebra: parameterization changes algorithm behavior even when the target distribution is mathematically equivalent.

### Real-time datasets and revised history

A macroeconomic state-space model can be evaluated retrospectively using today's revised data or in real time using historical vintages. These are different experiments. A filtered estimate computed from revised observations may still contain information unavailable at the original date even though the filtering recursion itself uses only past indices.

Record both observation dates and vintage or release dates. If vintage data are unavailable, state that the exercise is a retrospective modeling study rather than a historical real-time forecast. This limitation is specific and consequential; it cannot be removed by a chronological train/test split alone.

### Posterior computation has its own uncertainty

An MCMC estimate of a posterior mean is itself a numerical estimate. Correlated draws reduce effective sample size relative to the raw iteration count. Monte Carlo standard error should reflect the chain's dependence, using an appropriate method such as batch means or a spectral estimate under suitable conditions. A posterior interval describes parameter uncertainty; Monte Carlo error describes how accurately that interval or mean was computed.

Increasing iterations can reduce Monte Carlo error if the chain explores correctly, but cannot repair an unidentified model or a missed posterior mode. Compare multiple chains, inspect meaningful functions of parameters, and test the sampler on a known distribution. Distinguish numerical convergence evidence from evidence that the economic model is adequate. Both matter, and neither implies the other.

A hidden-state model also needs observability: the measurements over time must contain enough information to distinguish relevant state directions. If a state coordinate never affects current or future observations under the transition and measurement matrices, data cannot recover it merely because a filter equation is available. In a linear system, observability can be studied through the rank of stacked matrices H, HF, HF squared, and so on. This is another identification problem expressed through linear algebra. A prior can assign a distribution to an unobserved direction, but that does not mean the data identified it. Report which parameters or states are mainly prior-driven when the distinction matters.

## 11.13 Practice and source progression

Suggested applications: check stability of a two-variable diagonal VAR; derive its forecast covariance; demonstrate why Cholesky ordering is an identifying choice; construct two cointegrated synthetic series; perform one scalar Kalman update; derive a symmetric Metropolis acceptance ratio; explain why retaining rejected states matters. Hints: inspect eigenvalues; sum propagated innovation covariances; compare alternative B matrices with the same BB-transpose; use the scalar filter numbers above as a reference.

Read [MIT 14.384's later lecture notes](https://ocw.mit.edu/courses/14-384-time-series-analysis-fall-2013/pages/lecture-notes/) in their published order after Chapters 9–11, with particular attention to weak IV, empirical processes, unit roots, cointegration, state-space models, and MCMC. The direct PDF catalog makes the less prominent topics visible rather than losing them under a generic “time series” heading. Supplement with [Forecasting: Principles and Practice](https://otexts.com/fpp3/) for applied forecasting perspective.

The unifying idea is conditional structure: a system specifies how hidden states, observed variables, parameters, and information evolve together. The next chapter develops optimization, the mathematical machinery used to fit many of these models and to choose portfolios under explicit constraints.
