# 8. Portfolios, asset pricing, and performance

## 8.1 Diversification changes a joint distribution

Two risky assets need not make an equally risky combination. Their interaction depends on how their returns move together. Let weights w1 and w2 sum to one at the beginning of a period, with no external cash flows. Portfolio return is w1R1 + w2R2. Its expectation is the same weighted combination of means, while its variance includes covariance. Diversification is therefore a statement about joint behavior, not the number of names in an account.

For standard deviations sigma1 and sigma2 and correlation rho,

$$\sigma_p^2=w_1^2\sigma_1^2+w_2^2\sigma_2^2+2w_1w_2\rho\sigma_1\sigma_2.$$

With equal weights, sigma1 = 0.20, sigma2 = 0.10, and rho = 0.30, variance is 0.0155 and volatility approximately 12.45%. The weighted average of individual volatilities is 15%, larger than the portfolio's volatility. Averaging volatilities omits covariance and generally does not calculate portfolio risk.

If rho = 1 and weights are nonnegative, volatility is the weighted sum. If rho = −1, choosing weights so that w1sigma1 = w2sigma2 gives zero modeled variance. With these standard deviations, weights 1/3 and 2/3 achieve it. Exact negative dependence is a stringent model assumption. Estimated historical correlation does not provide a guaranteed future hedge, and zero variance over one modeled return horizon does not remove every operational or liquidity risk.

## 8.2 The minimum-variance portfolio

For two assets, write w2 = 1 − w. Expanding portfolio variance gives w²sigma1² + (1 − w)²sigma2² + 2w(1 − w)c, where c is covariance. Differentiate and set to zero. The unconstrained minimum occurs at

$$w^*=\frac{\sigma_2^2-c}{\sigma_1^2+\sigma_2^2-2c},$$

provided the denominator is positive. That denominator is Var(R1 − R2); if it is zero, the assets' difference is constant and the problem needs separate treatment. With sigma1² = 0.04, sigma2² = 0.01, and c = 0.006, the weight is 0.004/0.038 ≈ 0.105263 in asset one. If short selling is prohibited, constrain w to [0, 1] and check boundaries if the unconstrained solution lies outside.

For many assets with positive-definite covariance Sigma and only the budget constraint 1-transpose w = 1, the global minimum-variance weights are Sigma^(−1)1 divided by 1-transpose Sigma^(−1)1. Derive this with a Lagrange multiplier: minimize w-transpose Sigma w − lambda(1-transpose w − 1); stationarity gives 2Sigma w = lambda 1, then normalize. In computation, solve Sigma x = 1 and normalize x rather than constructing an inverse.

The formula is sensitive to covariance estimation. Adding a redundant asset can make Sigma singular, and a nearly redundant asset can create extreme offsetting positions. Constraints and shrinkage can improve stability but change the optimization problem. Report the objective, estimate window, covariance method, and allowable positions with the resulting weights.

## 8.3 Mean–variance choice and the efficient frontier

Mean–variance optimization studies tradeoffs between expected return mu-transpose w and variance w-transpose Sigma w. A portfolio is efficient if no feasible alternative has at least as high expected return and no higher variance, with one strict improvement. The efficient frontier is a boundary of the feasible set, not a statement that its inputs are known accurately.

One formulation minimizes variance subject to target expected return and a budget constraint. Another maximizes mu-transpose w − (gamma/2)w-transpose Sigma w, where gamma > 0 controls aversion to variance in that objective. These formulations can describe corresponding frontier points under suitable conditions. Their economic interpretation is exact for particular utility or return-distribution assumptions and an approximation in other settings.

If a risk-free return r_f is available and x denotes risky-asset exposures, excess portfolio return has mean x-transpose(mu − r_f1) and variance x-transpose Sigma x. The unconstrained quadratic-utility optimum satisfies x = Sigma^(−1)(mu − r_f1)/gamma. The risky direction is common across gamma values; gamma changes its scale. This is a version of separation under the model. Borrowing and lending at different rates, position constraints, transaction costs, or nonquadratic preferences can break the simple result.

Expected returns are especially noisy inputs. An optimizer can amplify small estimated mean differences into large bets. Compare optimized portfolios with equal-weight, minimum-variance, and constrained baselines. A complicated optimizer should earn its place through out-of-sample evidence and sensitivity analysis. An efficient frontier drawn from estimated inputs is conditional on those estimates, not a map of guaranteed future opportunities.

## 8.4 The Sharpe ratio and annualization

The Sharpe ratio is expected excess return divided by its standard deviation over a specified horizon, when that standard deviation is positive. Its sample estimate replaces population quantities with estimates. Use a risk-free return matched to the observation interval and currency. A reported ratio without frequency, sample dates, treatment of costs, and excess-return definition is incomplete.

For independent identically distributed arithmetic excess returns over m periods, the sum has mean m mu and variance m sigma², giving a square-root-m scaling for the ratio of the sum. Compounded wealth is not exactly the arithmetic sum, and dependence changes the variance. The common annualization rule is therefore a model-based approximation that should be described with its assumptions.

With autocovariances gamma(k), the variance of an m-period sum is m gamma(0) + 2 sum from k = 1 to m−1 of (m − k)gamma(k). Positive serial correlation increases long-horizon variance relative to the independent rule. Smoothed or stale prices can produce deceptively low measured volatility and high estimated Sharpe ratios. Examine liquidity and marking practices before interpreting a high ratio as superior skill.

The ratio is also noisy and affected by selection. A strategy selected from many candidates can have an inflated in-sample Sharpe ratio. Heavy tails and nonstationarity complicate uncertainty estimates. Report a distribution or confidence assessment under a stated method, and preserve the research search history. A single headline metric does not capture crash risk, leverage, drawdown duration, or capacity.

## 8.5 CAPM connects covariance to equilibrium compensation

The capital asset pricing model adds economic assumptions to portfolio mathematics. In a standard one-period idealization, investors choose mean–variance portfolios with common beliefs and access to a risk-free asset, markets clear, and trading frictions are omitted. The market portfolio is then mean–variance efficient. An asset's expected excess return is proportional to its covariance with the market:

$$E[R_i]-r_f=\beta_i(E[R_M]-r_f),\qquad
\beta_i=\frac{\operatorname{Cov}(R_i,R_M)}{\operatorname{Var}(R_M)}.$$

Beta measures exposure to market variation, not total volatility. An asset can be volatile because of firm-specific noise and still have a modest beta. In the model, diversified investors can remove idiosyncratic variation, so only systematic covariance earns equilibrium compensation. The conclusion depends on the assumptions; it is not a definition of all real expected returns.

If covariance with the market is 0.018 and market variance is 0.0225, beta is 0.8. With risk-free return 2% and expected market return 7%, CAPM implies expected asset return 2% + 0.8 × 5% = 6%. These are consistent-horizon expectations. Substituting a realized market return into the expectation formula changes the question.

An empirical time-series regression often uses R_it − r_ft = alpha_i + beta_i(R_Mt − r_ft) + error_it. Estimated alpha is a model-relative intercept, not automatically skill or an arbitrage. Benchmark misspecification, omitted factors, costs, unstable exposures, and sampling error can all influence it. Testing alpha also tests the chosen model of normal returns.

## 8.6 Factor models and the arbitrage pricing perspective

A factor model represents returns as exposures to a smaller set of common drivers plus idiosyncratic components. In vector form R = a + Bf + epsilon. Factors might be traded portfolio returns, macroeconomic shocks, or statistically extracted components. Each construction has a different interpretation. PCA finds high-variance directions; an economic factor model attaches a hypothesized mechanism; neither automatically establishes priced risk.

The arbitrage pricing perspective links expected returns to factor exposures under assumptions about a sufficiently rich asset universe, diversifiable residual risk, and absence of suitable arbitrage opportunities. A relationship E[R_i] = r_f + sum beta_ik lambda_k says factor risk prices lambda_k compensate exposures. This is not identical to an arbitrary regression with several predictors. The economic restrictions and feasibility assumptions do work.

A simple two-factor example has factor premia 4% and 2%, exposures 1.2 and −0.5, and risk-free return 1%. The implied expected return is 1% + 1.2 × 4% − 0.5 × 2% = 4.8%. A negative exposure can hedge a rewarded risk and reduce expected return under the model. Whether estimated factors are stable and whether premia persist are empirical questions.

Distinguish time-series beta estimation from cross-sectional risk-price estimation. The first uses each asset's return history to estimate exposure. The second relates expected returns across assets to exposures, often with generated-regressor uncertainty and dependence. A factor's attractive backtest can reflect construction choices, data mining, or a particular sample regime. The research chapters require a transparent formation protocol and out-of-sample checks.

## 8.7 Characteristic portfolios: size, value, momentum, volatility

A characteristic is an observable attribute used to sort or predict, such as market capitalization or a price-to-fundamental ratio. A factor portfolio is a constructed return series, often a spread between groups. Characteristics and covariances can both explain empirical patterns but represent different statistical objects. Calling a variable a “factor” should not obscure whether it is an attribute, a traded return, or a latent driver.

For a momentum sort, specify the formation window, any skipped recent period, eligibility criteria, rebalance frequency, weighting, and holding horizon. At each rebalance date, calculate signals using only earlier available observations, rank eligible assets, form groups, and measure subsequent returns. A value sort using accounting data needs publication lags and point-in-time fundamentals. Today's cleaned financial statements can contain revisions unknown at the historical decision date.

Size sorts require a consistent market-cap definition and treatment of share classes, delistings, and corporate actions. Volatility sorts require an estimation window and a decision about raw, residual, or downside volatility. Every detail can alter the result. A reproducible factor is an algorithm with dated inputs, not merely the name “momentum.”

The [Kenneth French Data Library](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html) provides official academic factor and portfolio datasets and descriptions. Read its units and construction notes before merging. Some files contain multiple tables or percentage-formatted returns. Historical series and construction methods can be revised; preserve a retrieved snapshot and date. The included synthetic exercises do not reproduce or validate any particular published factor premium.

## 8.8 Performance attribution and benchmark choice

A benchmark answers “compared with what?” A global equity portfolio should not be judged solely against cash if the objective was to improve equity exposure. A market-neutral strategy still needs a benchmark for capital usage, financing, and residual factor risks. Choose the benchmark before seeing which comparison makes performance most attractive.

Tracking error is the standard deviation of active return, portfolio minus benchmark. The information ratio divides mean active return by tracking error. A strategy can have high total volatility but low tracking error if it closely follows a volatile benchmark. Conversely, a low-volatility strategy can have large active risk relative to an unrelated benchmark. These quantities measure different relationships.

Attribution decomposes returns into exposures, allocation choices, selection effects, financing, and costs under a stated method. A regression-based attribution uses factor loadings; a holdings-based attribution uses actual positions and relevant benchmarks. Their residuals can differ because of timing, nonlinear exposures, missing factors, and measurement conventions. Do not interpret an unexplained residual as a causal explanation.

Time-weighted returns link subperiod portfolio returns to reduce the effect of external cash-flow timing. Money-weighted returns solve an internal-rate-of-return problem for the investor's actual cash flows. If an investor adds money just before a loss, the investor's realized experience can differ greatly from the manager's time-weighted return. Both can be informative when clearly labeled.

## 8.9 Utility, downside, and behavioral finance

Expected utility evaluates E[u(W)] for a specified utility function and terminal wealth model. Concave utility expresses diminishing marginal utility and risk aversion in that framework. For log utility, a proportional gain at low wealth matters more than the same dollar gain at high wealth. Mean–variance objectives can approximate expected utility locally, but they do not capture all preference structures or all tail risks.

Consider equal-probability terminal wealth 50 and 150 from initial wealth 100. Expected wealth is 100, while expected log wealth is below ln(100) by Jensen's inequality. A risk-averse log-utility investor prefers certain wealth 100. Another investor with a different utility or a liability threshold can rank choices differently. Portfolio optimization needs an objective tied to an investor or institution, not an abstract command to “maximize return.”

Behavioral finance studies patterns such as reference dependence, loss aversion, overconfidence, and attention limits. These can explain choices that differ from particular rational-choice models. A behavioral claim still needs identification and evidence. For example, a price response after salient news might also reflect liquidity or changing risk. An elegant narrative is a hypothesis generator, not a substitute for empirical discrimination.

## 8.10 Rebalancing, turnover, and estimation risk

Weights drift as assets earn different returns. If an equal-weight two-asset portfolio experiences +10% and zero returns, ending wealth is 1.05 per initial dollar and the first asset's weight becomes 0.55/1.05 ≈ 52.38%. Restoring 50/50 requires selling some of the first and buying the second. Constant weights require trading; buy-and-hold holdings do not imply constant weights.

Turnover conventions differ. One common long-only convention is half the sum of absolute weight changes, interpreted as one-way traded portfolio fraction when buys and sells balance. A cost charged per traded dollar may instead multiply the full absolute-change sum. The difference is a factor of two. State the convention and align it with the cost parameter before calculating net returns.

Estimation risk includes uncertainty in means, covariance, factor exposures, and transaction costs. Robustness analysis perturbs inputs, windows, and constraints within defensible ranges. If small changes reverse conclusions, report fragility. Stability is not proof of truth, but instability is important evidence about practical reliability. An optimizer's numerical precision should never be mistaken for parameter certainty.

### The frontier with a target mean

For invertible Sigma and a nondegenerate pair of budget and expected-return constraints, minimize one half w-transpose Sigma w subject to 1-transpose w = 1 and mu-transpose w = m. Stationarity gives Sigma w = lambda 1 + eta mu. Define A = 1-transpose Sigma^(−1)1, B = 1-transpose Sigma^(−1)mu, and C = mu-transpose Sigma^(−1)mu. The constraints become A lambda + B eta = 1 and B lambda + C eta = m.

If AC − B² > 0, solve lambda = (C − Bm)/(AC − B²) and eta = (Am − B)/(AC − B²). Substitution gives minimum variance (Am² − 2Bm + C)/(AC − B²). The formula exposes a quadratic relationship between target mean and minimum variance. The efficient branch uses targets above the global minimum-variance portfolio's mean, under this unconstrained setup.

If AC − B² is zero, the expected-return vector supplies no independent direction relative to the budget geometry, and the usual formula fails. Position limits and costs also change the frontier, so the closed form is a benchmark rather than a universal solver. An implementation can check the small analytical case before moving to constrained numerical optimization.

### The tangency direction and estimation uncertainty

With excess expected-return vector e = mu − r_f1, the maximum-Sharpe risky direction is proportional to Sigma^(−1)e under the standard unconstrained positive-definite setup and appropriate nondegeneracy. This follows by applying Cauchy–Schwarz in covariance-adjusted coordinates. Let z = Sigma^(1/2)w and a = Sigma^(−1/2)e. Then expected excess return is a-transpose z and volatility is ||z||. Their ratio is bounded by ||a||, with equality when z is proportional to a.

The derivation identifies a direction, while normalization and leverage constraints determine a feasible allocation. If estimated e is dominated by noise, the mathematically optimal direction can be statistically unstable. A tiny change in one mean estimate can rotate the portfolio substantially. This is why out-of-sample comparison, shrinkage, and exposure constraints are central rather than optional decorations.

### Arithmetic and geometric performance

For small returns, a second-order expansion gives ln(1 + R) approximately R − R²/2. Taking expectations gives expected log growth approximately mu − one half(sigma² + mu²), when the approximation and moments are appropriate. If mu is small, the familiar shorthand is mu − sigma²/2. This is an approximation, not an identity for arbitrary return distributions or leveraged strategies.

Two strategies can have the same arithmetic mean and different long-run compounded behavior because their volatility and tails differ. A rare near-total loss is especially damaging to log growth. Conversely, geometric growth is not the only objective: an investor with liabilities or a finite-horizon utility may prefer a different tradeoff. Match the performance measure to the decision rather than declaring one average universally correct.

### Factor neutrality is a model-relative statement

A portfolio can target B-transpose w = 0 to eliminate exposures to modeled linear factors. If B is estimated, true exposures can differ; if factors change, neutrality can drift; if payoffs are nonlinear, linear betas can omit important risks. Dollar neutrality, 1-transpose w = 0, is a different constraint and does not imply market beta neutrality.

For example, long 100 dollars of a beta-two stock and short 100 dollars of a beta-one stock is dollar neutral but has positive market exposure of roughly 100 beta-dollars under the linear model. Neutralizing beta would require a different hedge amount, which changes net and gross exposure. Report the exact neutrality definition and estimation window.

### Drawdown depth and duration

Maximum drawdown records the deepest decline from a prior peak, but duration asks how long wealth remains below that peak. Two paths can share a 20% maximum drawdown while one recovers in a month and the other remains underwater for years. The timing matters for funding, investor behavior, and liability matching.

Drawdown is path-dependent and its sample maximum depends strongly on sample length. Comparing a ten-year strategy with a one-year strategy using only maximum drawdown is misleading. Show the wealth path, drawdown path, sample period, and recovery information. A future drawdown can exceed every historical drawdown even when the backtest accounting is perfect.

### An alpha estimate needs an economic scale

Suppose a daily factor regression estimates an intercept of 0.0001, one basis point, before costs. With average daily full traded fraction 0.3 and cost four basis points per traded dollar, the simple daily cost estimate is 1.2 basis points. The estimated gross intercept is smaller than the assumed cost, before accounting for its own sampling uncertainty.

This does not show that every implementation is unprofitable; it identifies the assumptions needed for a claim. A lower-turnover policy or better execution could change the decision, but those are new procedures requiring evaluation. Convert alpha to the same horizon and units as costs, and avoid multiplying a daily estimate by an annual factor while leaving uncertainty and dependence untreated.

For a benchmark-relative study, also check whether the factor exposures were achievable at the same dates and financing terms. A regression adjustment can describe a return series even when the benchmark portfolio is not directly investable. State whether the benchmark is an explanatory model, an implementable alternative, or both.

For fixed portfolio weights over a one-period linear return model, market beta is the weighted sum of asset betas because covariance is linear: Cov(sum w_i R_i, R_M) equals sum w_i Cov(R_i, R_M). Divide by positive market variance to obtain the result. This identity is useful for a hand check of a portfolio regression. With dynamic weights correlated with market conditions, a full-sample portfolio beta need not equal a simple average of reported constituent betas. Timing and conditioning change the object being estimated, so preserve the distinction between a static identity and an empirical dynamic strategy.

## 8.11 An integrated portfolio study

Start with a dated matrix of total returns and a clearly defined universe. Verify missingness, corporate-action adjustments, and observation intervals. Use a training window to estimate means and covariance; construct equal-weight, minimum-variance, and constrained mean–variance portfolios. Hold each according to a fixed rebalance rule and evaluate subsequent returns after costs. Repeat chronologically using only past information.

Report wealth paths, annualization conventions, volatility, drawdowns, turnover, benchmark exposure, and uncertainty. Compare against an implementable baseline with the same universe and timing. Explain whether an improvement comes from lower market exposure, a particular factor bet, or residual performance. A small positive net return without enough independent observations should be presented as uncertain evidence.

The portfolio laboratory calculates expected return and volatility from two assets' displayed inputs and plots the feasible weight combinations. It illustrates the deterministic mapping from assumed parameters to a frontier. It does not estimate those parameters from market data or demonstrate an investable strategy. The Python examples verify covariance calculations and path accounting on a small synthetic fixture.

## 8.12 Practice and source sequence

Suggested applications: derive the two-asset minimum-variance weight; compute CAPM beta from covariance and variance; show how portfolio weights drift after unequal returns; compare sample Sharpe annualization with a dependence-adjusted calculation; design a point-in-time value-sort protocol. Hints: substitute the budget constraint before differentiating; distinguish an exposure estimate from an expected premium; write down when every input was observable.

Study the portfolio, CAPM/APT, efficient-market, performance-evaluation, and behavioral-finance materials in [MIT 15.433 Investments](https://ocw.mit.edu/courses/15-433-investments-spring-2003/), together with the corresponding [15.401 lectures](https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/). [MIT 18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) adds quantitative equity and portfolio cases. Use the original problem sets to challenge this chapter's ideas in unfamiliar settings, consulting published solutions after attempting the problems.

The next chapter develops regression as an inferential tool. It explains what a factor-regression coefficient estimates, how standard errors change with data structure, and why a predictive association need not identify a causal effect.
