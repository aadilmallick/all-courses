# 14. Derivatives pricing and Monte Carlo

## 14.1 Start with a replicable two-state claim

A stock costs 100 today and will be either 120 or 90 after one period. A risk-free account grows by factor 1.05. A call with strike 100 pays 20 in the up state and zero in the down state. Hold delta shares and B dollars in the account. Matching payoffs requires 120delta + 1.05B = 20 and 90delta + 1.05B = 0. Subtracting gives delta = 2/3; substitution gives B = −57.142857. The replicating cost is 100 × 2/3 − 57.142857 = 9.52381.

This price did not use the physical probability of the stock rising. It used state-by-state replication and the ability to trade and finance the positions under the model. If the call had a different price, buying the cheaper replicating claim and selling the more expensive equivalent claim would create an arbitrage in the frictionless setting. The conclusion depends on feasibility and matching contractual details.

Define q = (1.05 − 0.9)/(1.2 − 0.9) = 0.5. Then the same price is [q × 20 + (1 − q) × 0]/1.05. These are risk-neutral weights, not an estimate that the stock rises with physical probability one half. The no-arbitrage condition 0.9 < 1.05 < 1.2 ensures q lies strictly between zero and one. If financing dominates both stock outcomes or is dominated by both, the model itself contains an arbitrage.

## 14.2 Multi-period trees and early exercise

A recombining binomial tree repeats up and down factors over smaller periods. Terminal payoffs are known functions of terminal stock prices. Work backward: at each node, the European option value is the discounted risk-neutral average of its two next-node values. The local replication argument repeats at every node, making the strategy dynamic and self-financing under the idealized model.

For an American option, compare immediate exercise value with continuation value at each node and take the larger. This is an optimal-stopping problem. Early exercise decisions depend on dividends, rates, payoff type, and other terms. A rule learned for one simple non-dividend call model should not be generalized to every option.

A common diffusion-approximation tree uses up factor exp(sigma sqrt(h)) and down factor its reciprocal, with q = [exp((r − q_div)h) − d]/(u − d). Here q_div is dividend yield, distinct from the probability symbol. Check that the chosen step and parameters yield probabilities in [0, 1]. Refining the tree can improve approximation, but convergence can oscillate, especially around payoff kinks or exercise boundaries.

## 14.3 Deriving the Black–Scholes equation

Assume a non-dividend-paying stock follows dS = mu S dt + sigma S dW under P, with constant positive sigma and a continuously compounded financing rate r. Let a sufficiently smooth derivative value be V(t, S). Itô's lemma gives dV = [V_t + mu S V_S + one half sigma² S² V_SS]dt + sigma S V_S dW.

Choose a locally offsetting stock position delta = V_S. The stochastic parts of derivative and stock cancel in the self-financing replication argument. The remaining locally riskless portfolio must earn r under the frictionless no-arbitrage assumptions. Rearranging yields

$$V_t+\frac12\sigma^2S^2V_{SS}+rSV_S-rV=0.$$

The physical drift mu disappears because the hedge cancels exposure to the stock shock. This is the mathematical reason a real-world expected-return forecast is not an input to the standard replicating option price. The derivation assumes continuous trading, no omitted costs, a diffusion model, suitable regularity, and the ability to finance and short as required. Real hedges operate discretely and face costs and model error.

A terminal condition specifies the claim, such as V(T, S) = max(S − K, 0). Boundary and growth conditions complete the pricing problem. A partial differential equation without its terminal payoff is not a full option model. The payoff has a kink, so smoothness at expiration needs careful mathematical treatment; the standard price is smooth before expiration under the model.

## 14.4 Risk-neutral expectation and the closed form

Under the corresponding Q measure, dS = rS dt + sigma S dW_Q for the non-dividend case. The European payoff value is V0 = e^(−rT)E_Q[h(S_T)] under integrability and the model's pricing assumptions. For continuous dividend yield q_div, drift becomes r − q_div and the stock's discounted cum-dividend gains have the appropriate martingale property.

For a European call,

$$C=S_0e^{-q_{div}T}\Phi(d_1)-Ke^{-rT}\Phi(d_2),$$
$$d_1=\frac{\ln(S_0/K)+(r-q_{div}+\sigma^2/2)T}{\sigma\sqrt T},\qquad d_2=d_1-\sigma\sqrt T.$$

Phi is the standard normal cumulative distribution. The formula follows by integrating the positive part of a lognormal terminal price over S_T > K. Splitting the payoff into S_T times the exercise indicator minus K times the indicator gives the two terms. Completing the square in the normal integral shifts one threshold from d2 to d1, explaining why the stock-weighted term uses a different normal probability.

For S0 = K = 100, r = 0.05, q_div = 0, sigma = 0.20, T = 1, d1 = 0.35 and d2 = 0.15. The call is approximately 10.4506. Put–call parity gives put value C − S0 + Ke^(−rT), approximately 5.5735. The call is positive, below 100, and above its lower bound max(100 − 100e^(−0.05), 0), approximately 4.8771.

At T = 0 return intrinsic payoff directly. At sigma = 0 and T > 0, the terminal price is deterministic under Q and the call equals max(S0e^(−q_div T) − Ke^(−rT), 0). Dividing by sigma sqrt(T) would fail in these boundary cases, so a reliable implementation handles them explicitly.

## 14.5 Greeks and a risk decomposition

Greeks are sensitivities of model value to inputs. Delta is partial V/partial S, gamma is partial²V/partial S², vega is partial V/partial sigma, theta is a time sensitivity under a stated calendar convention, and rho is partial V/partial r. Units matter: vega per unit volatility differs by a factor of one hundred from vega per one percentage point of volatility.

For the standard call, delta is e^(−q_div T)Phi(d1), and gamma is e^(−q_div T)phi(d1)/(S0 sigma sqrt(T)), where lowercase phi is the standard normal density. Gamma is positive for the ordinary long call under positive inputs before expiration. Delta changes as the stock changes, so a delta hedge must be rebalanced. A hedge fixed at yesterday's delta does not remove all exposure today.

A local value change can be approximated by delta delta S + one half gamma(delta S)² + vega delta sigma + other sensitivity terms. Large moves, interacting changes, and a changing volatility surface require higher-order or full repricing. Summing individual Greeks only makes sense when their input conventions and units match.

The Black–Scholes equation links theta, gamma, delta, and financing under its model. This relationship is a useful implementation check, but a market position can lose money even if the model identity holds exactly. Realized volatility, jumps, costs, funding, and implied-volatility changes all affect discrete hedging outcomes.

## 14.6 Implied volatility and calibration

Implied volatility is the sigma that makes a chosen pricing formula equal an observed option price. The inversion is meaningful only when the price lies within appropriate no-arbitrage bounds and the option terms match the model. A negative or arbitrage-inconsistent quote may have no valid implied volatility. A very low-vega option makes the inversion numerically sensitive.

Because standard European call value increases with sigma under the usual assumptions, bracketed root finding is reliable when a solution lies within the bracket. Bisection repeatedly narrows the interval. Newton's method uses vega as the derivative and can converge quickly, but poor initial values or tiny vega can create invalid steps. A hybrid method retains the bracket while using faster proposals when safe.

Market implied volatilities vary by strike and maturity, forming a surface rather than a single constant. This is evidence that one constant-volatility model cannot match all quotes simultaneously. Fitting a surface requires static-arbitrage checks, interpolation choices, and careful quote filtering. Calibration fits selected market prices; it does not uniquely identify the real-world dynamics or guarantee hedging performance.

## 14.7 Monte Carlo pricing from first principles

For a European payoff under geometric Brownian Q dynamics, draw independent standard normals Z_i and compute S_T_i = S0 exp[(r − q_div − sigma²/2)T + sigma sqrt(T)Z_i]. Discount each payoff Y_i = e^(−rT)h(S_T_i). The Monte Carlo estimate is their average. Estimated standard error is sample standard deviation of Y divided by sqrt(N), assuming independent draws and finite variance.

If the estimate is 10.48 with standard error 0.04, an approximate normal sampling interval is 10.48 ± 1.96 × 0.04, about [10.4016, 10.5584]. The known Black–Scholes price 10.4506 lies inside. This is a check on sampling and implementation under the same model. It does not validate the model against real option prices. Approximately one in twenty nominal 95% intervals can miss even when the procedure is correct under its assumptions.

Four times as many independent paths roughly halves standard error. Doubling paths does not double accuracy. This slow square-root rate motivates variance reduction. A fixed random seed makes a teaching result repeatable, but independent replications are useful for checking whether reported sampling errors are plausible.

## 14.8 Variance reduction and numerical error budgets

Antithetic sampling pairs Z with −Z. Average their two payoffs as one observation, then calculate standard error across independent pairs. The pair's covariance can reduce variance for monotone payoffs, but standard error must respect pairing. Treating both members as independent misstates uncertainty. Variance reduction is not automatic for every payoff.

A control variate uses a correlated variable X with known expectation. Replace Y by Y − b(X − E[X]); expectation is unchanged for fixed b. The variance-minimizing coefficient is Cov(Y, X)/Var(X) when variance is positive. For an option, discounted terminal stock has known Q expectation S0e^(−q_div T). Estimate b on an independent pilot or account for coefficient estimation appropriately. A poorly chosen control can increase variance.

Importance sampling changes the simulation distribution and reweights outcomes by a likelihood ratio. It can help rare-event estimation but can create unstable weights if the proposal is poorly chosen. Quasi-Monte Carlo uses low-discrepancy sequences; its error assessment differs from independent sampling and often uses randomized replicates. Report the sampling method rather than applying an ordinary standard-error formula indiscriminately.

The total error budget can include Monte Carlo noise, time discretization, missed barrier crossings, calibration error, and model misspecification. Increasing path count only targets one component. A convergence study changes one numerical control at a time and compares with a reference or extrapolated limit. Keep sampling noise small enough to see discretization effects, preferably using common random numbers when appropriate.

## 14.9 Path-dependent options and exercise

An Asian option depends on an average of prices; a barrier option depends on whether a level is crossed; a lookback depends on a path maximum or minimum. Exact terminal sampling is insufficient because the payoff needs intermediate path information. The observation schedule is part of the contract. A discretely monitored barrier differs from a continuously monitored one.

Sampling only daily endpoints can miss a barrier crossing between endpoints in a continuous model. Brownian-bridge methods can adjust crossing probabilities under suitable dynamics, or the grid can be refined with an error study. Refinement alone can remain biased for discontinuous path events. Identify the particular approximation rather than saying “Monte Carlo handles any option.”

American exercise under Monte Carlo requires estimating continuation values or another optimal-stopping method. A least-squares continuation approximation uses simulated future cash flows and basis functions, but training and evaluation separation matter. A fitted exercise rule can be evaluated on independent paths to estimate its achieved value. A lower-bound policy estimate is not automatically an exact American option price or an upper bound.

## 14.10 PDE numerics, jumps, and stochastic volatility

Finite-difference methods discretize the pricing PDE over time and asset price. Explicit schemes can be easy to implement but have stability restrictions; implicit schemes solve linear systems; Crank–Nicolson averages time levels and can need damping near nonsmooth payoffs. Boundary conditions, grid truncation, and payoff interpolation affect accuracy. Verify convergence against a closed-form European case before applying the solver to a harder claim.

Jump-diffusion models add discontinuous price changes. Under Q, the drift must include the appropriate jump compensation so the discounted tradable gains have the required property. Simply adding positive or negative jumps to a Black–Scholes simulation without adjusting the drift generally changes expected discounted stock value. Jump-risk pricing can introduce incompleteness and additional assumptions.

Stochastic-volatility models give variance its own random dynamics, often correlated with the asset shock. Parameters must preserve the intended state domain, and numerical schemes must handle variance boundaries carefully. An Euler scheme can generate negative variance even when the continuous model's state is nonnegative under its conditions. Calibration and simulation choices should be documented separately.

### The call integral, with the threshold made explicit

Under Q, write S_T = S0 exp[(r − q_div − sigma²/2)T + sigma sqrt(T)Z]. Exercise occurs when Z exceeds a = [ln(K/S0) − (r − q_div − sigma²/2)T]/(sigma sqrt(T)), which equals −d2. The strike contribution is K e^(−rT)P(Z > a) = K e^(−rT)Phi(d2).

For the stock contribution, integrate exp(sigma sqrt(T)z) times the standard normal density over z > a, then multiply by S0e^(−q_div T−sigma²T/2). Completing the square uses −z²/2 + bz = −(z − b)²/2 + b²/2 with b = sigma sqrt(T). The exponential b²/2 cancels the prefactor's variance correction, and the shifted threshold becomes a − b = −d1. The remaining probability is Phi(d1), giving the stock term S0e^(−q_div T)Phi(d1).

This derivation shows why d1 and d2 differ by sigma sqrt(T). They arise from two differently weighted normal integrals, not two arbitrary corrections. It also clarifies why Phi(d2) can be interpreted as the Q exercise probability in this model, while delta involves Phi(d1) and a dividend discount factor.

### A finite-difference Greek check

For a small positive h, approximate delta by [C(S + h) − C(S − h)]/(2h) and gamma by [C(S + h) − 2C(S) + C(S − h)]/h². Compare with analytic values over a range of h. If h is too large, truncation error dominates; if too small, cancellation and rounding dominate. Gamma is especially sensitive because it divides a second difference by h².

When checking vega, remember that sigma is a decimal annual volatility. A bump of 0.01 is one volatility percentage point, not a 1% relative change in sigma. A reported vega of 37.5 per unit sigma corresponds to about 0.375 per one percentage point near that point. This unit conversion should be visible in a risk report.

### The standard error of an antithetic estimator

Let A_i = [Y(Z_i) + Y(−Z_i)]/2 for independent base draws Z_i. The estimator averages A_i, so its standard error is sample SD(A_i)/sqrt(number of pairs). Its variance is [Var(Y(Z)) + Var(Y(−Z)) + 2Cov(Y(Z),Y(−Z))]/4 per pair. Negative covariance gives the improvement.

If a program instead stores the two payoffs in one list and divides their sample standard deviation by sqrt(2N), it ignores dependence within pairs. The estimate of the mean can remain correct while uncertainty is wrong. This is a useful general lesson: data grouping can affect inference without changing the point estimate.

### A control variate with an exact expectation

For no-dividend GBM under Q, X = e^(−rT)S_T has expectation S0. For a call payoff Y, X is positively associated with Y. Taking Y_control = Y − b(X − S0) preserves expectation for fixed b. Expanding variance yields Var(Y) + b²Var(X) − 2bCov(Y, X); differentiating gives b_star = Cov(Y, X)/Var(X).

Estimate b on a pilot set, then apply it to an independent main set for a transparent teaching implementation. Using the same sample can still be useful with appropriate analysis, but the simple fixed-b standard-error interpretation needs care. Record the pilot size and avoid reporting its observations as independent main draws if the procedure does not treat them that way.

### A discrete hedge's cash ledger

At time zero, sell one option for premium C0 and buy delta0 shares, leaving cash B0 = C0 − delta0S0. Before the next rebalance, cash grows to B0e^(rh). At the new stock price S1, change holdings from delta0 to delta1, paying (delta1 − delta0)S1 plus transaction cost. New cash is the grown balance minus that trade and cost. Repeat until expiration.

Final hedging profit for the option seller is stock liquidation value plus cash minus the option payoff, with all final costs included under the chosen convention. A program that updates cash using the old stock price or forgets dividends can produce a false hedge gain. Test a zero-volatility deterministic path and a one-step tree where replication is known exactly.

### Pricing bounds as property-based checks

For fixed positive inputs under the standard European model, increasing strike should not increase call value, and increasing spot should not decrease it. A call spread's price should respect its payoff bounds. Put–call parity should hold within numerical tolerance across a grid of strikes and maturities. These checks examine relationships over many cases rather than copying one implementation formula into a test.

Some monotonicity claims need assumptions. Increasing maturity does not universally raise every option's price under every rate and dividend setup. State the model before adding a test that would reject a correct result in an allowed edge case. Mathematical tests are strongest when they encode valid theorems with explicit domains.

### Dividends and the hedge account

With a continuous dividend yield, stock holders receive distributions while the ex-dividend price follows its modeled dynamics. A self-financing hedge must include those receipts in cash accounting. The option formula discounts the stock term by the dividend yield because the option holder does not receive the stock's interim distributions merely by holding the option.

For discrete known dividends, a continuous-yield approximation can be inadequate, especially near an exercise decision or a large distribution. Contract terms and the ex-dividend date determine the correct treatment. A parity check must use the matching dividend model. If a quoted option appears to violate a no-dividend bound, first verify dividends, exercise style, settlement, and quote quality before declaring an arbitrage.

Model validation therefore begins with contract and data definitions before numerical precision. A perfectly converged solver for the wrong dividend schedule can be less useful than a simple correct model with a transparent approximation error.

For a long call under the standard model, increasing volatility increases its value while other displayed inputs remain fixed. One way to understand the sign is through convex payoff sensitivity under an appropriate mean-preserving spread of the pricing distribution. This does not mean a call buyer always profits when realized volatility rises. The purchase premium, implied-volatility changes, timing, hedging policy, and realized path determine profit. A model-price sensitivity holds inputs fixed in a specified hypothetical comparison; an actual market outcome changes several inputs together. State which comparison a chart or Greek describes. This distinction prevents a correct positive vega from being turned into an unjustified trading forecast. Similar care applies to all comparative-static statements in the curriculum.

The premium is a time-zero cost; the terminal payoff is a different dated quantity.

## 14.11 A complete pricing and hedging study

Implement the closed-form call with explicit input validation, the zero-time and zero-volatility limits, and a normal CDF from a reliable routine. Verify put–call parity, monotonicity in spot and volatility, price bounds, and a known numerical case. Then implement terminal Monte Carlo under the same model and compare its estimate and standard error with the closed form.

Next simulate discrete delta hedging under a stated physical process. At each rebalance time, compute delta using only current information, trade the stock, update the cash account with financing and transaction costs, and evaluate the final hedging error. More frequent rebalancing reduces some diffusion discretization error in the idealized setting but raises trading costs. A real study must compare the tradeoff rather than assuming continuous hedging is implementable.

The options laboratory computes closed-form calls, puts, delta, and a Monte Carlo estimate from displayed parameters. It checks parity and shows simulation uncertainty. Its European model has constant rates and volatility and continuous dividend yield. It does not claim to price arbitrary American, jump, or stochastic-volatility contracts. The Python example provides an independent standard-library implementation and known-value checks.

## 14.12 Guided study and practice

Suggested applications: solve a two-state replication with a different strike; derive risk-neutral weights from the stock payoff equation; verify a call price by parity and bounds; compare paired antithetic standard errors with a naive calculation; explain why a barrier needs more than terminal prices; design a discretization study with common random numbers. Hints: match every terminal state, label P versus Q, and separate numerical error sources before changing path counts.

Use the derivatives sections of [MIT 15.401](https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/), the stochastic-calculus and Black–Scholes materials in [18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) and [18.S096](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/), then the simulation and pricing notes in [15.450](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/pages/lecture-notes/). The catalog includes the published MATLAB simulation files as references; the original Python implementation is separately included and tested.

Pricing has now connected cash-flow identities, stochastic calculus, probability measures, and numerical computation. The next chapter studies decisions made repeatedly through time and the risk constraints that make a mathematically attractive strategy institutionally usable.
