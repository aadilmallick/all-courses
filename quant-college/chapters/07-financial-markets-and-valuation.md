# 7. Financial markets and valuation

## 7.1 A security is a claim with rules

A financial security is a contractual or ownership claim whose value depends on future benefits and obligations. A share represents an ownership interest; a bond promises specified payments subject to terms and default risk; a derivative's payoff depends on another quantity or event. Before building a pricing model, identify the claim, cash-flow dates, currency, seniority, optionality, collateral, and information needed to determine payments. A symbol on a price screen is not a complete contract description.

Primary markets issue new claims; secondary markets transfer existing ones. Intermediaries connect borrowers, investors, and payment systems. Exchanges and dealers provide different trading arrangements. A quoted bid is a price at which someone is willing to buy under stated conditions; an ask is a price at which someone is willing to sell. The spread and available size affect execution. A midquote can be useful for analysis but is not automatically an attainable trade price.

A long position benefits from an increase in the asset's value, all else equal. A short position borrows and sells an asset, with obligations to return it and possibly compensate distributions, pay fees, and post collateral. The mathematical payoff of a negative holding is easy to write; implementing it introduces financing, availability, and operational constraints. A frictionless model can teach a relationship while omitting costs that matter in practice.

This chapter builds valuation from cash-flow equivalence. We first use deterministic discounting, then identify where uncertainty requires additional ideas. It follows the conceptual scope of [MIT Finance Theory I](https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/); the course's lectures and problems provide a full external practice sequence after these foundations.

## 7.2 Time value and discount factors

If one dollar today grows to 1 + r in one period under an agreed lending convention, one dollar paid at the endpoint has present value 1/(1 + r). Define the discount factor D(0, T) as the price today of one unit of currency paid at time T under the specified credit and collateral assumptions. A deterministic payment C_T has value C_T D(0, T). A collection of payments adds by linearity when the claims can be combined without changing their terms.

For annual discrete compounding with rate r and integer T, D(0, T) = (1 + r)^(−T). For a continuously compounded zero rate z(T), D(0, T) = exp[−z(T)T]. These are alternative parameterizations of discount factors. A flat rate is an assumption; actual term structures generally assign different rates to different maturities. Using one yield for every cash flow can be a useful summary without being the fundamental valuation rule.

Suppose discount factors for one and two years are 0.96 and 0.91. A bond paying 5 at year one and 105 at year two has price 5 × 0.96 + 105 × 0.91 = 100.35. This calculation uses two maturity-specific prices. Its yield to maturity is the single rate y satisfying 100.35 = 5/(1 + y) + 105/(1 + y)². Yield compresses the price into one number conditional on the cash-flow schedule; it is not a promise about realized return.

An annuity pays a constant amount C at the end of each period for n periods. Summing the geometric series gives PV = C[1 − (1 + r)^(−n)]/r for r nonzero under the stated convention. At r = 0, its limiting value is nC. A perpetuity has value C/r for r > 0. A growing perpetuity paying C1 next period and growing at g has value C1/(r − g) only when the geometric series converges, requiring g < r in the usual positive-growth-factor setup. Ignoring this condition produces meaningless valuations.

## 7.3 No arbitrage and replication

An arbitrage, in a simplified model, is a feasible self-financing strategy with no positive initial cost, no possible future loss, and a positive payoff with positive probability. Precise definitions vary with the trading model and horizon. The core principle is that identical feasible cash flows should have identical prices when trading them against one another is possible without omitted restrictions.

Suppose claim A pays exactly 100 next year and costs 95, while claim B has the same currency, timing, credit, and contractual conditions but costs 97. Buying A and selling B produces two dollars initially and zero net future payment. This is an arbitrage in the frictionless model. In practice, different collateral, settlement, taxes, borrowing constraints, or credit risk can mean the cash flows are not truly identical. A price difference alone does not prove an implementable arbitrage.

Replication constructs a portfolio whose payoff matches a target claim in every modeled state. Once constructed, its cost determines the target's no-arbitrage price in a complete feasible replication model. This differs from predicting the most likely payoff and discounting it. A claim can have a negative expected profit under one investor's forecast and still have a unique replication price.

We will use replication for forwards and options. The important preparation is to distinguish a payoff identity from a statistical association. Two assets that were historically correlated do not necessarily replicate each other in every future state. A regression hedge is a model-based approximation; an exact payoff identity is stronger.

## 7.4 Fixed income: price, yield, and risk

A coupon bond typically pays periodic coupons and principal at maturity, subject to its terms. A zero-coupon bond makes one payment. Default risk means the promised payment can differ from the realized payment. Clean price excludes accrued interest under the relevant convention; dirty price includes it. A historical dataset may report either, so identify which before calculating returns. Day-count and coupon-date conventions are contract-specific implementation details to verify for a real instrument.

For an annual coupon bond with payments C_t, price at yield y is P(y) = sum C_t/(1 + y)^t. Differentiating gives P'(y) = −sum t C_t/(1 + y)^(t+1). Define modified duration as −P'(y)/P(y). Then a small yield change delta y gives relative price change approximately −D_mod delta y. Macaulay duration is the present-value-weighted average payment time; for this annual convention D_mod = D_Mac/(1 + y).

A two-year zero coupon has P(y) = 100/(1 + y)². At y = 0.05, price is approximately 90.7029 and modified duration is 2/1.05 ≈ 1.90476. A 10-basis-point yield increase predicts a relative loss of about 0.19048%. The exact repricing differs because the price-yield relationship is curved. Convexity, P''(y)/P(y), supplies the second-order correction one half convexity times delta y².

Duration is a local sensitivity under a specified yield shift. A single yield duration does not capture every possible movement of a nonflat curve. Key-rate durations perturb selected maturities; factor models describe common curve movements; scenario analysis can reprice the full instrument. Callable bonds also have cash flows that depend on rates and exercise decisions, so fixed-cash-flow formulas are insufficient without modeling that optionality.

Immunization matches selected asset and liability sensitivities. Matching present value and duration can reduce exposure to small parallel rate changes around a chosen point. It does not remove credit risk, nonparallel moves, large changes, model error, or the need to rebalance as time passes. State what risk the hedge targets and inspect residual exposures rather than calling the position “risk-free.”

## 7.5 Spot rates, forwards, and curve construction

A forward discount relationship compares discount factors across dates. If D(0, 1) = 0.96 and D(0, 2) = 0.91, the one-year forward gross lending factor from year one to year two is D(0, 1)/D(0, 2), approximately 1.054945. The corresponding annual forward rate is about 5.4945%. It is an implied exchange rate between dated cash flows, not necessarily a forecast of the future short rate.

Curve bootstrapping solves for discount factors sequentially from instrument prices. Suppose a one-year zero paying 100 costs 96, giving D1 = 0.96. A two-year bond pays 4 in year one and 104 in year two and costs 98. Solve 98 = 4 × 0.96 + 104D2, obtaining D2 = 94.16/104 ≈ 0.905385. This uses previously identified discount factors rather than assuming one rate fits every maturity.

In real markets, curve construction must respect instrument conventions, collateral, liquidity, and possibly separate forecasting and discounting curves. The numerical bootstrapping idea survives, but the relevant cash-flow equations become more detailed. A curve fitted to inconsistent quotes can violate no-arbitrage conditions or produce implausible oscillations between maturities. Interpolation is therefore part of the model and should be disclosed.

## 7.6 Equity valuation and the limits of forecasts

Equity holders receive residual benefits after contractual obligations, often through dividends, repurchases, or eventual sale. A dividend-discount model values expected future distributions using a risk-appropriate framework. With constant required return k and expected dividend growth g < k, the Gordon model gives P0 = D1/(k − g). The algebra is a geometric series; the difficult inputs are long-horizon growth and the appropriate discounting of risk.

If D1 = 3, k = 0.09, and g = 0.03, value is 50. Raising g to 0.04 increases value to 60. That large sensitivity does not prove the stock's true value changed; it shows how strongly a long-horizon model depends on an uncertain assumption. Terminal value often dominates a discounted-cash-flow model, so scenario and sensitivity analysis are essential.

Cash-flow definitions must match claimholders. Free cash flow to the firm is available to debt and equity providers before selected financing flows; discounting it under a suitable framework gives enterprise value, from which net debt and other claims are reconciled to equity value. Free cash flow to equity uses an equity perspective. Mixing a firm-level cash flow with an equity-only discount rate can double-count or omit financing effects.

Accounting earnings are not identical to cash flow. Accruals, capital expenditure, working capital, depreciation, and financing create differences. A balance sheet satisfies assets = liabilities + equity under its accounting definitions. An income statement describes performance over an interval; a cash-flow statement reconciles cash changes. A quant using accounting features must also know when statements became public and whether historical data were restated.

## 7.7 Capital budgeting and value creation

Net present value adds discounted incremental cash flows, including the initial expenditure. A project costing 100 today and paying 60 after each of two years at discount rate 10% has NPV = −100 + 60/1.1 + 60/1.1² ≈ 4.1322. Under the model, it creates value relative to the opportunity cost embedded in the discount rate.

Use incremental cash flows: changes caused by taking the project. Sunk costs already incurred are not changed by the decision. Opportunity costs, such as using a property that could otherwise be rented, do matter. Financing and tax treatment must be handled consistently with the valuation method. The distinction is causal and economic before it is numerical.

Internal rate of return solves NPV = 0 as a function of the discount rate. It can be useful as a summary but can have multiple solutions or no economically relevant solution when cash-flow signs change repeatedly. Mutually exclusive projects can have different scale and timing, so ranking by IRR can conflict with value creation. NPV under an appropriate opportunity cost is the more direct value criterion.

For cash flows −100, +230, −132 at years zero, one, and two, setting NPV to zero yields −100(1 + r)² + 230(1 + r) − 132 = 0. Both r = 10% and r = 20% solve it. Asking for “the IRR” without recognizing multiple roots is therefore ambiguous. Plotting NPV against rate and examining the cash-flow pattern is a useful diagnostic.

## 7.8 Forwards, futures, and carrying an asset

A forward agrees today on an exchange at future date T for delivery price K. Its long payoff at expiration is S_T − K under a simple cash-settled description. The delivery price that makes the initial contract value zero differs from the value of an existing contract whose K is already fixed. Confusing price and value creates common derivative errors.

For a non-income-paying asset that can be bought and financed at a constant continuously compounded rate r, the idealized forward price is F0 = S0 e^(rT). Buying the asset today with borrowing and delivering it at T replicates the forward's asset delivery. If S0 = 100, r = 0.04, T = 0.5, the forward price is approximately 102.0201. Expected future spot price is not used in this replication argument.

Known cash income reduces the financed asset cost by its present value. With a continuous dividend yield q under the standard model, F0 = S0 e^((r−q)T). Commodities can introduce storage costs and convenience benefits; borrowing and short-sale constraints can limit an arbitrage argument. State the carry model rather than transferring the equity formula blindly.

Futures are marked to market according to exchange and clearing arrangements. Daily cash settlements create financing effects that can make futures and forward prices differ when rates and underlying values interact. Under simplified deterministic-rate assumptions they can coincide. A margin deposit is collateral, not the contract's notional value, and leverage can create cash demands even when a long-horizon thesis eventually proves correct.

## 7.9 Options and basic bounds

A European call permits exercise only at expiration and pays max(S_T − K, 0). A European put pays max(K − S_T, 0). An American option allows earlier exercise under its contract. The word “option” describes a right for the holder, but the seller has the corresponding obligation. Payoff diagrams should distinguish holder and writer and separate payoff from premium-adjusted profit.

For a non-dividend-paying stock, deterministic discounting, and idealized European options sharing strike and expiration, put–call parity is C − P = S0 − KD(0, T). At expiration, call payoff minus put payoff equals S_T − K in every state. A stock minus a zero-coupon liability has the same payoff. Equality of current values follows from replication under the model.

If S0 = 100, K = 100, D = 0.95, and call price is 12, parity implies put price 7. A call price cannot exceed the stock price under the standard assumptions because owning the stock dominates the call's terminal claim and can be used in a dominance argument. A lower bound is max(S0 − KD, 0). These bounds are diagnostic checks, not a full pricing model.

Option value depends on the distribution of future outcomes and hedging possibilities, not only the expected terminal price. Greater uncertainty can increase a convex payoff's expected value under appropriate comparisons. Chapter 14 derives replication and risk-neutral pricing, while Chapter 13 supplies the continuous-time mathematics. Here the objective is to understand the contract and the identities a later model must respect.

## 7.10 Risk, return, and efficient markets

Expected return is compensation or forecast under a probability model; realized return is one outcome. Risk can mean dispersion, downside loss, default, liquidity demands, model error, or failure to meet liabilities. A single volatility statistic captures only one dimension. Investors can disagree about forecasts and preferences even when they observe the same price.

Market efficiency is a family of claims about how prices reflect information and the difficulty of earning abnormal returns under a specified benchmark and information set. Testing efficiency jointly tests a model of normal returns. A failed benchmark can look like inefficiency, while trading frictions can make a predictable pattern economically unavailable. The joint-hypothesis issue prevents a simplistic “an anomaly proves markets irrational” conclusion.

Behavioral explanations consider systematic features of beliefs and preferences, such as overconfidence, loss aversion, or limited attention. They can motivate testable hypotheses, but a plausible story after observing a pattern is not evidence of the mechanism. Chapter 8 connects asset-pricing models to empirical tests, and the research chapters require timing, benchmarks, and costs before interpreting an anomaly.

### Inflation, nominal claims, and purchasing power

A nominal payment promises currency units, while a real quantity measures purchasing power relative to a price index or basket. If nominal gross return is 1 + R_n and inflation gross growth is 1 + inflation, real gross return is their ratio. Thus 1 + R_real = (1 + R_n)/(1 + inflation). The approximation R_real approximately R_n − inflation omits their interaction.

With nominal return 8% and inflation 5%, real return is 1.08/1.05 − 1 ≈ 2.857%, not exactly 3%. For a future inflation-linked claim, the relevant index rule, publication lag, and contractual floor matter. A real cash-flow forecast should be discounted with a rate framework consistent with that real definition; mixing nominal cash flows and real rates can materially misvalue a project.

The Fisher relationship is often expressed as a connection between nominal rates, real rates, and expected inflation under simplifying assumptions. Uncertain inflation and risk premia complicate a literal subtraction. A break-even inflation measure derived from nominal and inflation-linked bonds can contain liquidity and risk-premium components, so it is not automatically a pure forecast of future inflation.

### Credit risk changes the promised-cash-flow calculation

Suppose a one-year bond promises 100 but pays 40 if default occurs. Under a specified pricing probability model with default probability p_Q and deterministic rate r, its simplified value is e^(−r)[(1 − p_Q)100 + p_Q40]. With r = 0.03 and p_Q = 0.02, expected pricing payoff is 98.8 and value is approximately 95.8800. The physical default probability need not equal p_Q because credit risk can carry a premium.

Recovery can depend on seniority, collateral, default timing, and the legal process. A model paying a fixed recovery at maturity omits these details. A yield spread over a government or collateralized curve can reflect default risk, liquidity, taxes, optionality, and other effects. Inferring a physical default probability directly from a spread requires a model and cannot be justified by vocabulary alone.

Diversification reduces some idiosyncratic credit risk, but defaults can become dependent during stress. A portfolio of many loans can retain substantial systematic tail exposure. A covariance approximation may miss nonlinear recovery and default clustering. The lesson is the same as for equity factors: the joint state model matters.

### Forward value after inception

At inception, a forward's delivery price K can be chosen to make value zero. Later, an existing long forward with fixed K generally has nonzero value. Under the simple no-dividend deterministic-rate model, value at time t is S_t − K D(t, T). The current forward delivery price is F_t = S_t/D(t, T), so value is D(t, T)(F_t − K).

If an existing contract has K = 100, current spot is 108, and the remaining discount factor is 0.98, its value is 108 − 98 = 10. The current zero-value forward price is about 110.2041. Quoting 110.2041 as the existing contract's value would confuse the delivery price of a new agreement with the mark-to-market value of an old one.

### Duration with several cash flows, step by step

For a two-year bond paying 5 and 105 at a 5% annual yield, the price is 100. Present-value weights are (5/1.05)/100 ≈ 0.047619 and (105/1.05²)/100 ≈ 0.952381. Macaulay duration is 1 × 0.047619 + 2 × 0.952381 ≈ 1.952381 years. Modified duration is that value divided by 1.05, approximately 1.859410.

A one-percentage-point yield increase predicts a price change of about −1.8594 dollars for this 100-dollar price. Full repricing gives 5/1.06 + 105/1.06² ≈ 98.1666, a loss around 1.8334. The difference is consistent with positive convexity: the tangent-line approximation slightly overstates the loss for this upward move. Repeating for a downward move helps reveal the curvature rather than treating the approximation error as random.

### Price and expected return determine one another conditionally

For a one-period uncertain payoff X and purchase price P, simple return is X/P minus one. Its expected value is E[X]/P minus one when P is known and positive. Holding the expected payoff fixed, a lower price implies a higher expected return. This arithmetic relationship does not identify the appropriate price because the required compensation for risk remains an economic question.

For expected payoff 110, price 100 implies expected return 10%, while price 105 implies about 4.762%. Different beliefs about X or different risk requirements can support different valuations. A valuation model should make both the payoff forecast and risk adjustment visible. Reporting only a target price hides the assumptions that determine it.

A negative discount rate does not invalidate every finite valuation. With annual rate minus one percent and a one-year payment of 100, present value is 100 divided by 0.99, approximately 101.0101. The payment is worth more than its nominal amount under that financing convention. The finite formula requires a positive gross discount base; an infinite perpetuity imposes additional convergence conditions. Do not transfer the positive-rate perpetuity formula to a negative-rate infinite stream without examining the series.

## 7.11 Integrated case, practice, and reading

Consider an investor choosing between a two-year bond and an equity claim. The bond's promised cash flows can be discounted using a suitable curve, but expected losses from default and liquidity considerations may alter the relevant model. The equity claim needs uncertain long-horizon distributions and a risk framework. Comparing their quoted yields or recent returns alone does not compare equivalent objects. Start with claims, dates, states, and constraints.

The growth laboratory teaches discounting through reversing accumulation; the option laboratory later checks parity and bounds. Suggested applications: value a coupon bond from three discount factors; bootstrap the final discount factor from one additional bond; calculate a duration approximation and compare with full repricing; find both IRRs in the nonconventional project; draw call payoff and premium-adjusted profit separately. Hints: write one equation per cash-flow date; use a decimal yield increment; verify candidate IRRs in the original NPV expression.

Read the present-value, fixed-income, equities, forward/futures, options, capital-budgeting, and efficient-market sections of [MIT 15.401](https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/). Its published materials include videos, slides, problem sets, and exams. Use the exact links in the course resource catalog rather than a paid certificate platform. [MIT 18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) adds bond mathematics and linear-rate applications. Historical institutional details should be treated as historical; the cash-flow logic remains the conceptual foundation.

The next chapter asks how many uncertain claims behave together. Diversification, equilibrium pricing, and performance evaluation all depend on understanding a portfolio as a weighted system rather than a list of individually attractive securities.
