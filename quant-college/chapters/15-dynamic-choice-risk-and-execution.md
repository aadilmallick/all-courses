# 15. Dynamic choice, risk, and execution

## 15.1 A decision today changes tomorrow's opportunities

A one-period portfolio problem chooses weights and evaluates an endpoint. A dynamic problem chooses a rule for responding to future states. Wealth, information, liabilities, transaction costs, and constraints evolve. A strategy is therefore a policy mapping available states and information into actions. A list of hindsight-optimal weights is not an implementable policy.

Dynamic optimization appears in portfolio choice, consumption, execution, exercise, and risk management. [MIT 15.450 Analytics of Finance](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/pages/lecture-notes/) explicitly includes static and dynamic approaches to portfolio choice, dynamic programming, and numerical approximation. This chapter connects those methods to practical risk accounting and execution, which the original roadmap leaves less developed.

## 15.2 Bellman's principle from a two-stage problem

Suppose a state x changes according to x_next = f(x, a, noise) after action a. Let reward be r(x, a), discount factor delta, and terminal value g(x). At the last decision date, choose a to maximize current reward plus expected discounted terminal value. One step earlier, replace the future subproblem by its already optimized value. This is the principle of optimality: after reaching a state, the remaining policy must solve the remaining problem for that state under the model.

The Bellman recursion is V_t(x) = max over feasible a of {r_t(x, a) + delta E[V_(t+1)(x_next) given x, a]}, with V_T = g. It requires a state rich enough to summarize information relevant to future rewards and transitions. If transaction costs depend on current holdings, wealth alone is insufficient; holdings must enter the state. An omitted state variable can make a supposedly optimal policy solve the wrong problem.

Consider wealth 100 and a one-step choice between cash with gross return 1.02 and a risky asset with gross return 1.20 or 0.90, each with probability one half. If fraction a is risky, next wealth is 100[1.02 + a(R_risky − 1.02)]. Under expected log wealth and a in [0, 1], maximize one half ln(1.02 + 0.18a) + one half ln(1.02 − 0.12a), plus constant ln100. The derivative equates 0.18/(1.02 + 0.18a) with 0.12/(1.02 − 0.12a), giving a = 1.4167 before constraints. The feasible optimum is therefore a = 1, checked against the boundary. Changing probabilities or loss size changes the result.

## 15.3 Static state-price approach to dynamic choice

In a complete market under suitable assumptions, attainable terminal wealth can be described by a budget constraint involving a state-price density or stochastic discount factor. A terminal-utility problem maximizes E[u(W_T)] subject to E[M_T W_T] ≤ W0 and appropriate positivity and attainability conditions. The pricing kernel M_T weights wealth by its current cost across states.

The first-order condition is u'(W_T) = lambda M_T for an interior solution, where lambda enforces the budget. Thus optimal terminal wealth is the inverse marginal-utility function applied to lambda M_T. States where wealth is expensive, with high M_T, receive lower optimal wealth under this pure terminal-utility setup. Preferences and liabilities can change the allocation.

For power utility u(w) = w^(1−gamma)/(1−gamma), gamma > 0 and gamma not one, marginal utility is w^(−gamma). The condition gives W_T = (lambda M_T)^(−1/gamma). Lambda is chosen to satisfy the budget. This approach separates the desired terminal payoff from the trading strategy that replicates it. Incomplete markets or trading constraints can make a desired payoff unattainable, so the static solution cannot simply be assumed feasible.

## 15.4 Continuous-time dynamic programming

Let wealth follow dW = [rW + pi(mu − r)]dt + pi sigma dB, where pi is the dollar amount in the risky asset. For terminal utility and no consumption, define V(t, w) as the best expected terminal utility from time t and wealth w. A small-time expansion plus the dynamic-programming principle leads formally to the Hamilton–Jacobi–Bellman equation

$$0=V_t+\max_\pi\left\{[rw+\pi(\mu-r)]V_w+\frac12\pi^2\sigma^2V_{ww}\right\},$$

with V(T, w) = u(w). The variance term comes from Itô's lemma. A verification theorem requires regularity, admissibility, and integrability conditions before a formal candidate can be declared optimal. Solving an algebraic first-order condition is only part of the argument.

If V_ww < 0, the objective is concave in pi and stationarity gives pi_star = −(mu − r)V_w/(sigma² V_ww). For constant-relative-risk-aversion utility under the standard constant-opportunity model, this yields risky wealth fraction (mu − r)/(gamma sigma²). With premium 4%, volatility 20%, and gamma = 4, the fraction is 0.04/(4 × 0.04) = 0.25. This is a model-dependent policy, not a recommendation to invest 25% in any real asset.

The result assumes known constant parameters and omits costs and constraints. Learning about expected returns, stochastic opportunities, liabilities, and trading frictions can introduce hedging demands or inaction regions. A precise closed form is useful because it exposes assumptions and provides a benchmark for more realistic numerical methods.

## 15.5 Numerical dynamic programming

Discretize the state space, action space, and transition distribution, specify a terminal value, and work backward. At each state and date, evaluate feasible actions, take an expected continuation value, and store the best action. Interpolation estimates values between grid points. Boundary handling must be explicit: clipping every out-of-grid state can create artificial value and distort the policy.

Check numerical convergence by refining grids and comparing with a known analytical case. Distinguish state-grid error, action discretization, quadrature or simulation error, and horizon truncation. A policy can change sharply near a constraint, so a coarse grid can miss economically important boundaries. Report computational cost and sensitivity, not only the final policy plot.

The curse of dimensionality means grid size grows exponentially with the number of state variables. Approximate value functions, simulation methods, and reinforcement learning can help, but introduce approximation and estimation concerns. Reducing the state dimension requires a defensible summary, not merely removing inconvenient variables.

The dynamic-choice laboratory uses a finite two-period wealth problem with a small displayed action set and exact scenario enumeration. It recomputes the optimal first action when risk aversion or probabilities change. Because transitions and actions are explicitly enumerated, its result can be checked by brute-force calculation. It is not a production portfolio optimizer.

## 15.6 Risk metrics answer different questions

Volatility measures dispersion around a mean. Value at Risk at level alpha is a loss quantile under a stated horizon and loss convention. Expected shortfall averages the worst tail in an appropriate quantile-integral definition. Maximum drawdown measures peak-to-trough decline along a path. Stress loss evaluates specified adverse scenarios. These metrics are complementary because they summarize different features.

Let L be a positive-for-loss random variable. VaR_alpha is inf{l: P(L ≤ l) ≥ alpha}. Expected shortfall can be defined as (1/(1 − alpha)) integral from alpha to one of VaR_u du, assuming integrability. For a continuous distribution under suitable conditions, it equals E[L given L ≥ VaR_alpha]. With atoms at the quantile, the naive conditional-tail formula can differ from the quantile-integral definition. State the convention, especially for discrete scenario sets.

For ten equally weighted sorted losses, a 90% quantile and tail average depend on the empirical quantile convention. A simple teaching rule can take the largest loss as the worst 10% average, but software interpolation can return a different VaR. The mathematical definition and finite-sample estimator must both be recorded for reproducibility.

VaR need not be subadditive. For a concrete example, let each of two independent positions lose one dollar with probability 4% and zero otherwise. Each has 95% VaR zero, but the combined position loses at least one dollar with probability 7.84%, so its 95% VaR is one dollar. Diversifying can increase this quantile metric relative to the sum of individual VaRs. Expected shortfall has coherent-risk properties under standard integrable-loss conditions, though estimation and model risk remain.

## 15.7 Risk models, stress, and backtesting

Historical simulation uses past portfolio or risk-factor changes as scenarios, under a rule for applying them to current positions. Parametric models specify distributions and dependence; Monte Carlo samples them. Full repricing can capture nonlinear claims more faithfully than a linear delta approximation but requires reliable pricing models. A historical scenario set cannot include an event absent from its window unless added deliberately.

Stress testing asks how the portfolio behaves under specified shocks, including joint moves and liquidity effects. Reverse stress testing asks what scenarios would breach a loss or solvency threshold. Scenarios need economic coherence and a clear scope. A shock to rates without corresponding collateral or funding effects may understate institutional risk even if market-value repricing is accurate.

Backtesting VaR examines exceedance frequency and dependence under a specified forecast setup. A correct average exceedance rate can coexist with clustered failures, which is operationally important. Tail metrics have few effective observations at high confidence levels, so apparent validation can be weak. Regulatory or institution-specific requirements change and must be verified separately for an actual compliance use; this textbook teaches the statistical framework rather than asserting current regulatory rules.

## 15.8 Leverage, margin, and liquidity

Leverage magnifies exposures relative to capital. A portfolio can have low net exposure and high gross exposure, with large financing and liquidation needs. If long positions total 150 and shorts total 100 on equity 50, gross exposure is 250 and net exposure 50, producing gross leverage five and net exposure one relative to equity under these definitions. The difference matters for costs and liquidity.

Margin requirements can change as volatility rises, forcing sales during adverse markets. A position with positive expected terminal payoff can fail because cash demands occur earlier. Risk analysis must therefore include funding liquidity, collateral timing, and liquidation capacity. Terminal expected value alone cannot describe survival.

Liquidity has several dimensions: spread, depth, price impact, immediacy, and resilience after trades. A backtest using a closing midprice assumes an execution opportunity that may not exist for its size. Capacity asks how strategy performance changes as traded capital grows. A signal can be statistically real and economically too small or illiquid to support meaningful scale.

## 15.9 Market microstructure and execution

An order book contains standing bids and asks at different prices and sizes under the venue's rules. A market order prioritizes execution but exposes the trader to available prices; a limit order constrains price but may not fill and can be adversely selected. Queue position and hidden liquidity can matter. A simple historical price series omits much of this process.

Implementation shortfall compares the achieved execution outcome with a specified decision-price benchmark, including relevant costs and unfilled opportunities under the chosen method. Spread cost, commissions, fees, temporary impact, permanent impact, and timing risk are distinct components. Do not add them mechanically if definitions overlap.

A simple execution model splits an order across time. Trading faster can increase impact; trading slower leaves more exposure to price movement. A quadratic impact cost plus variance penalty can produce a tractable optimization, but impact parameters and market conditions are uncertain. An execution rule calibrated on tiny trades may not extrapolate to a large order.

If a strategy turns over 40% of capital one-way per month and pays 10 basis points per one-way traded dollar, a consistent simple monthly cost is 0.4 × 0.001 = 0.0004, or four basis points. If turnover is reported as the full buy-plus-sell sum instead, align the cost convention. Small definitional differences can determine whether a weak signal survives.

## 15.10 Model risk and institutional practice

Model risk includes incorrect structure, wrong implementation, bad inputs, misuse, and unrecognized limits. Independent validation should challenge assumptions and compare outputs with benchmarks, not merely rerun the author's code. A model inventory records purpose, owner, data, versions, limits, and validation evidence. The appropriate process depends on the institution and use.

Operational controls include position and exposure checks, stale-data detection, reconciliation, logging, and a safe response to failed inputs. A research notebook is not automatically a trading system. Deployment adds order handling, failure recovery, monitoring, permissions, and human accountability. The curriculum's projects build research competence; production trading requires additional engineering and institution-specific review.

### An explicit two-period Bellman table

Normalize wealth to one, allow risky fractions zero or one, and use log utility. Cash grows by 1.02; the risky asset grows by 1.20 with probability 0.6 and 0.80 with probability 0.4, independently in each period. At the last date, all-cash expected log growth is ln(1.02), approximately 0.019803. All-risky expected log growth is 0.6ln(1.20) + 0.4ln(0.80), approximately 0.020136.

The risky choice is slightly better under these exact inputs. Because log utility separates ln(current wealth) from log gross return and opportunities are unchanged across states, the same choice is optimal in either second-period state. At the first date, the expected terminal log wealth is twice the one-period expected log growth for a stationary repeated policy. This special separability makes the dynamic problem easy; transaction costs or state-dependent opportunities can remove it.

Notice how small the modeled advantage is: about 0.000333 log units per period. A small change in probability or a modest cost can reverse it. The exact calculation is therefore a useful sensitivity example. “Optimal” means optimal for the stated probabilities, action set, utility, and costs, not robustly superior in a market with uncertain inputs.

### Consumption adds a control and a constraint

If an investor consumes c_t as well as choosing risky exposure, wealth drift becomes rW + pi(mu − r) − c. An objective can add discounted utility of consumption plus terminal utility. The HJB maximizes u(c) plus the wealth-dynamics terms, subject to c ≥ 0 and any solvency or borrowing constraints.

For an interior consumption choice, first-order optimality gives u'(c) = V_w under a consistent discounting convention in the value equation. Marginal utility of spending one more unit now equals marginal continuation value of retaining that unit. This interpretation explains the condition more clearly than treating it as a symbolic derivative. Constraints can move the optimum to a boundary and require complementary conditions.

### Dynamic consistency and changing objectives

Bellman's recursion assumes that the continuation objective agrees with the objective anticipated earlier, under a state representation carrying the relevant information. Some risk measures and preference specifications can be time-inconsistent: a plan preferred today may not be preferred by a later decision-maker using the same-looking criterion. A precommitment solution and a dynamically reoptimized policy can then differ.

For a practical portfolio, define whether the institution commits to a horizon objective or updates under a specified rule. A backtest that chooses whichever policy would have looked better at each historical point does not evaluate either coherent procedure. The policy itself, including update rules and constraints, must be fixed for evaluation.

### Expected shortfall with a probability mass at the threshold

Consider losses zero with probability 0.94, ten with probability 0.04, and one hundred with probability 0.02. At alpha = 0.95, VaR is ten because cumulative probability reaches 0.98 at that loss. The worst 5% contains all of the 2% mass at one hundred and 3% of the 4% mass at ten. Expected shortfall is (0.02 × 100 + 0.03 × 10)/0.05 = 46.

The naive conditional mean E[L given L ≥ 10] averages 6% of outcomes, giving (2 + 0.4)/0.06 = 40. It differs because conditioning includes the entire atom at ten rather than exactly the worst 5%. This example shows why the quantile-integral definition matters for discrete scenario models. A software function's interpolation and tail-weight convention should match the intended risk definition.

### Risk contributions and a budget

For portfolio volatility sigma_p = sqrt(w-transpose Sigma w) with positive sigma_p, the derivative with respect to w_i is (Sigma w)_i/sigma_p. Multiplying by w_i gives a component contribution. Summing these components yields sigma_p because w-transpose Sigma w/sigma_p = sigma_p. This is an Euler decomposition for a positively homogeneous risk function.

A component can be negative when an exposure hedges the rest of the portfolio. Equal capital weights do not imply equal risk contributions. Risk-parity methods seek a specified contribution balance under constraints and an estimated covariance model. They inherit estimation risk and can increase leverage when targeting a fixed volatility. A risk budget is a model-relative allocation rule, not a guarantee about realized loss.

### Volatility targeting and its hidden assumptions

A simple volatility-targeting rule scales exposure by target volatility divided by forecast volatility, subject to caps. If forecast volatility falls, exposure rises; if it jumps, exposure falls. This can stabilize modeled risk but can also create large trades, leverage in calm periods, and forced deleveraging after shocks. Forecast errors and execution delays matter.

Use a strictly lagged volatility estimate, a positive floor with an economic rationale, leverage limits, and explicit costs. Evaluate the whole policy chronologically. Reporting lower realized volatility without reporting increased turnover and gross exposure gives an incomplete picture. The target is an input to a control rule, not a guaranteed future standard deviation.

### A simple execution tradeoff

Suppose Q shares must be sold over two periods. Sell q now and Q − q later. A quadratic temporary-impact model gives cost eta[q² + (Q − q)²]. If only impact matters, differentiating yields q = Q/2. Add a penalty lambda sigma²(Q − q)² for holding the remaining inventory through the uncertain interval. The objective becomes eta q² + (eta + lambda sigma²)(Q − q)².

Stationarity gives q = Q(eta + lambda sigma²)/(2eta + lambda sigma²). As risk aversion lambda rises, more is sold immediately; as impact eta dominates, the split approaches equal halves. This is a transparent toy model, not a calibrated execution algorithm. It assumes the specified impact form, no price predictability, and a particular risk penalty. The derivation helps identify what more realistic models need to add.

### Funding stress is a path problem

Imagine a hedged position with a small terminal expected gain but a temporary mark-to-market loss requiring collateral. If available cash is insufficient, the position may be liquidated before convergence. Terminal payoff analysis alone misses this failure. Simulate collateral and financing dates, not only terminal wealth, when survival depends on interim liquidity.

A liquidity stress can combine adverse prices, wider spreads, lower market depth, increased margin, and reduced borrowing capacity. These shocks are not independent conveniences; they can reinforce each other. A coherent stress scenario makes the interaction explicit. Do not present a single historical quantile as a substitute for a scenario the historical sample barely contains.

### Separate risk appetite from a model estimate

Risk appetite is a decision about acceptable exposure or loss relative to an institution's purpose and resources. A model estimates consequences under assumptions. Choosing a 99% quantile does not decide whether the implied loss is acceptable, and a low estimated loss does not establish that omitted risks are acceptable. Keep the decision threshold and the measurement model distinct.

When communicating a recommendation, show the proposed policy, its assumed opportunity set, its modeled risks, sensitivity to uncertain inputs, and the constraints it would use. This turns an opaque “optimal portfolio” into a reviewable decision. In the learning projects, make the decision hypothetical and preserve the evidence needed to critique it.

### A risk limit must specify its measurement horizon

A daily loss limit, a monthly volatility target, and a long-horizon solvency requirement constrain different quantities. Scaling a daily normal quantile by the square root of the number of days assumes a particular independent or suitably aggregating return model and stable positions. Dynamic rebalancing, serial dependence, nonlinear payoffs, and changing liquidity can invalidate the shortcut.

Reprice or simulate at the horizon relevant to the decision, including the policy's response when appropriate. A static-position stress and a dynamically managed stress answer different questions. State whether the scenario assumes no trading, a predefined rebalancing rule, or forced liquidation. The distinction can dominate the result during a crisis.

A limit breach also needs an operational interpretation in a real institution: which data trigger it, who reviews it, and what action follows. In this learning program, describe those choices hypothetically so the mathematics connects to a coherent decision process without implying that the local experiments are live controls.

Risk aversion parameters have meaning only with an objective and units. In a mean minus variance penalty written in dollar profit, rescaling capital changes the numerical variance term quadratically and the mean term linearly. A coefficient copied from a return-based objective can therefore imply a different decision when used with dollars. Power utility instead encodes a particular relative-risk-aversion structure over positive wealth. Do not compare numerical gamma values across different objective conventions as if they were the same preference measurement. Normalize variables deliberately, derive the resulting coefficients, and check that a change of display currency does not accidentally change the economic policy.

An action is feasible only if it satisfies the constraints at its actual decision state.

## 15.11 An integrated decision example

Suppose a model forecasts a small positive excess return for a liquid asset. Before optimizing, quantify uncertainty in that forecast and compare it with estimated trading costs. Define capital, maximum leverage, loss tolerance, and rebalance frequency. Solve a constrained policy problem under those assumptions, then evaluate it chronologically on unseen data with realistic timing.

Inspect worst drawdown, funding needs, turnover, and exposure during stress periods. Perturb expected return, volatility, and cost estimates. If the policy swings from maximum long to maximum short under tiny changes, the model is dominated by uncertain inputs or a sharp decision threshold. Consider regularization, smaller positions, or a simpler baseline, and report the effect on performance.

A decision can be rational under a model and still lose money in one realization. Conversely, a profitable historical outcome can come from a poorly justified decision. Evaluate the process and evidence separately from one realized result. This is the difference between disciplined risk-taking and hindsight storytelling.

## 15.12 Practice and advanced source work

Suggested applications: solve a two-stage Bellman recursion by enumeration; derive the continuous-time risky fraction under power utility; compare static state-price and dynamic approaches; compute VaR and expected shortfall for a discrete loss table; construct the VaR subadditivity counterexample; calculate leverage and transaction costs under explicit conventions. Hints: state the state variables and feasible actions first, and preserve the sign convention positive-for-loss throughout.

Study [MIT 15.450's dynamic portfolio-choice lectures and handouts](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/pages/lecture-notes/), including the principle-of-optimality justification and numerical examples. Use [Stanford EE364A](https://see.stanford.edu/Course/EE364A) for constrained formulations and the original finance courses for portfolio context. The next chapter develops machine learning as another tool for prediction and decision support, with the same requirement that evaluation respect information timing and uncertainty.
