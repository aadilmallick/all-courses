# Quantitative Finance from First Principles

## A college-level program from first arithmetic to independent research

This book starts with no assumed finance, calculus, or programming background. It builds the mathematical language, computational habits, financial understanding, and research judgment needed to study the university courses in the supplied roadmap and undertake serious quantitative projects.

There are eighteen substantial chapters. Their numbered sections are smaller study sessions: read one or two, work a numerical example, then return later. The program combines original teaching with full official university lectures, notes, and problem sets. It is a multi-year learning path, not a short bootcamp. The suggested 1,800–2,400 hours includes those external courses, practice, and projects; it is a planning estimate.

Use the chapters in order for the first pass. The common foundation is Chapters 1–8. Chapters 9–12 develop empirical methods and optimization; Chapters 13–15 develop continuous-time finance and dynamic decisions; Chapters 16–18 integrate learning, research, and projects. Later specialize in research, pricing, portfolio/risk, execution, or development. Job requirements differ, and completing this program does not guarantee employment or investment profits.

Every formula has a domain and an interpretation. Returns are decimals unless labeled percentages. Time is in years unless another interval is stated. Vectors are columns. P denotes a physical probability model; Q denotes a pricing measure. Losses are positive in risk calculations unless a section explicitly uses return-style negative drawdowns. A sample estimate is distinguished from a population parameter. Synthetic results demonstrate methods and are never market evidence.

The [local laboratory](companion/index.html) contains fourteen genuine computed experiments with controls and reset behavior. The [Python reference examples](examples/core_labs.py) run offline using only the standard library. The [source catalog](resources/RESOURCE-CATALOG.md) and [CSV inventory](resources/course-resources.csv) contain official course assets and their discovery pages. The [coverage matrix](COURSE-COVERAGE.md) maps university topic families to the original chapters. External sources retain their own rights; full course videos and source books are not republished.

Research was conducted on November 12, 2026, using official MIT, Stanford, authors', library, and public-agency sources. Resource indexes were inspected; linked content was not all read end to end. HTTP response checks establish reachability at the time of checking, not correctness or unrestricted access. Paid recommended books and unverified third-party readings are optional references, outside the free core.

The main deliverable is an original connected textbook plus a research practice program. Its breadth is substantial, but specialized graduate topics still require the mapped source lectures, problem sets, and continued study. Use the readiness rubric to test whether you can derive, implement, critique, and explain the material independently.


## Contents

- [1. Numbers, functions, and mathematical reasoning](#chapter-01)
- [2. Calculus and continuous models](#chapter-02)
- [3. Linear algebra and numerical structure](#chapter-03)
- [4. Python and reproducible computation](#chapter-04)
- [5. Probability and random variables](#chapter-05)
- [6. Statistical inference and evidence](#chapter-06)
- [7. Financial markets and valuation](#chapter-07)
- [8. Portfolios, asset pricing, and performance](#chapter-08)
- [9. Econometrics: identification and estimation](#chapter-09)
- [10. Time series, forecasting, and volatility](#chapter-10)
- [11. Multivariate time series and Bayesian computation](#chapter-11)
- [12. Convex optimization and numerical methods](#chapter-12)
- [13. Stochastic processes and Itô calculus](#chapter-13)
- [14. Derivatives pricing and Monte Carlo](#chapter-14)
- [15. Dynamic choice, risk, and execution](#chapter-15)
- [16. Machine learning for quantitative research](#chapter-16)
- [17. Research design, data, and backtesting](#chapter-17)
- [18. Project studio and readiness](#chapter-18)


# Part: Foundations

<a id="chapter-01"></a>

# 1. Numbers, functions, and mathematical reasoning

## 1.1 The first quant problem is knowing what a number means

Suppose an account contains 200 dollars on Monday and 210 dollars on Tuesday. It gained 10 dollars. A different account grows from 2,000 dollars to 2,010 dollars and also gains 10 dollars. These gains are equal in currency but different relative to the money invested. The first grew by 10/200 = 0.05; the second by 10/2,000 = 0.005. We call these simple returns: 5% and 0.5%. A quantitative model begins by deciding which of these questions it answers. Confusing a dollar change with a return can invalidate an otherwise sophisticated calculation.

A quantity has a value, a unit, a time reference, and often a definition that specifies how it was measured. Price might mean the most recent transaction, a buyer's bid, a seller's ask, or an adjusted historical closing price. The number 100 alone tells us almost nothing. Writing “100 USD per share, closing auction on date t” supplies information a later calculation needs. This habit matters as much as algebra. Record units before manipulating symbols, and check that an answer has the units the question requests.

We will build mathematics as a language for relationships. A variable is a symbol that can represent different values. In the return formula, let P0 be the initial price and P1 the later price. For a position without interim cash payments,

$$R=\frac{P_1-P_0}{P_0}=\frac{P_1}{P_0}-1,\qquad P_0>0.$$

The condition on P0 is part of the definition. Division by zero is undefined. Prices can be nonpositive for some unusual contracts, and then the familiar percentage-return interpretation needs reconsideration. We begin with positive investment prices so that the economic interpretation and algebra agree. If a dividend D is paid during the period, total holding-period return is (P1 + D − P0)/P0, provided the convention treats the dividend as cash received at the endpoint. More elaborate reinvestment conventions need additional timing information.

## 1.2 Fractions, signs, and percentages

A fraction a/b, with b nonzero, means the number that multiplies b to produce a. Thus 3/4 = 0.75 because 0.75 × 4 = 3. Fractions need common denominators before addition because their pieces have different sizes. To add 1/2 and 1/3, rewrite them as 3/6 and 2/6, obtaining 5/6. Multiplication needs no common denominator: (a/b)(c/d) = ac/(bd). Division by c/d means multiplication by its reciprocal d/c when c and d are nonzero.

In finance, a percentage is a fraction with denominator 100. Five percent is 5/100 = 0.05. A percentage point is an absolute difference between two percentages: moving from 3% to 5% is an increase of two percentage points. The relative increase is (0.05 − 0.03)/0.03 = 2/3, or approximately 66.67%. A basis point is 0.01 percentage points, equivalently 0.0001 as a decimal rate. Twenty-five basis points is 0.0025. Store rates as decimal fractions in calculations and use percentages only for presentation.

Negative numbers can describe losses, liabilities, short positions, or changes below a reference value. Their meaning depends on the accounting convention. If cash received is positive, paying 30 dollars is −30. A liability valued at 100 dollars might be recorded as a positive liability balance or as −100 in a net-wealth calculation. Either convention works when applied consistently. A sign is mathematical information, not an economic explanation.

Order of operations makes an expression unambiguous. Parentheses group operations; powers precede multiplication and division; multiplication and division precede addition and subtraction. Thus 2 + 3 × 4 = 14, whereas (2 + 3) × 4 = 20. A fraction bar groups its entire numerator and denominator. The expression (a + b)/c equals a/c + b/c, but a/(b + c) generally does not equal a/b + a/c. For a = 1, b = 1, c = 1, the first is 1/2 and the alleged alternative is 2.

Exact fractions and rounded decimals serve different purposes. One third is exactly 1/3 but only approximately 0.3333. Repeatedly rounding intermediate computations can produce visible errors in a long valuation. Keep full precision internally and round the reported result according to the question. Precision is not certainty: a computer can calculate a wrong model to fifteen decimal places.

## 1.3 Algebra preserves relationships

An equation states that two expressions represent the same number. Solving it means finding all values of a variable that make the statement true. Consider 200(1 + R) = 210. Divide both sides by 200, obtaining 1 + R = 1.05. Subtract one from both sides to obtain R = 0.05. Every step preserves the set of solutions because we applied an invertible operation to both sides.

Operations need conditions. Multiplying an equation by zero destroys information: x = 3 implies 0 = 0, but 0 = 0 does not imply x = 3. Squaring can introduce extra solutions: x = −2 implies x² = 4, while x² = 4 also permits x = 2. Therefore, when solving sqrt(x + 1) = x − 1, first require x ≥ 1 so that the right side can equal a nonnegative square root. Squaring yields x + 1 = x² − 2x + 1, or x(x − 3) = 0. The candidate x = 0 violates the original equation; x = 3 works. Checking candidate solutions in the original statement is part of the solution.

Distributivity, a(b + c) = ab + ac, lets us expand and factor expressions. For example, x² − 5x + 6 = (x − 2)(x − 3). A product is zero if at least one factor is zero, so the equation has solutions 2 and 3. Factoring exposes structure hidden by expansion. Later, the same idea turns characteristic polynomials into information about time-series stability and matrices.

A linear equation ax + b = c has the unique solution (c − b)/a if a is nonzero. If a = 0 and b = c, every x is a solution. If a = 0 and b differs from c, there is no solution. “Divide by a” is therefore not a universally valid instruction. The exceptional case reveals why assumptions are not decorative additions to formulas.

Inequalities require similar care. Adding the same number preserves order. Multiplying by a positive number preserves order; multiplying by a negative number reverses it. From −2x < 6, division by −2 yields x > −3. Absolute value |x| measures distance from zero. The inequality |x − 100| ≤ 5 means 95 ≤ x ≤ 105. This notation will describe approximation errors, confidence intervals, and risk limits.

## 1.4 Functions turn inputs into outputs

A function assigns exactly one output to each input in its domain. Write f(x) = x². The input −3 gives output 9. The domain might be all real numbers, while the range is the set of nonnegative real numbers. A graph draws points (x, f(x)); the horizontal coordinate identifies the input and the vertical coordinate identifies the output. Axes must carry units when the quantities have units.

A financial accumulation function is A(t) = 100(1.05)^t. It assigns an account balance to a time measured in years under a specified growth assumption. The inverse question asks for the time associated with a balance. Inverses exist as functions when the original function is one-to-one on the chosen domain. The square function on all real numbers has no single-valued inverse because 3 and −3 share the output 9. Restricting its domain to nonnegative numbers gives the inverse sqrt(x).

Composition means feeding one function's output into another. If gross return g(R) = 1 + R and wealth h(g) = 200g, then h(g(R)) = 200(1 + R). The order matters. A data pipeline will similarly clean a price, compute a return, and summarize a sample. Writing the stages separately makes their assumptions visible.

A piecewise function uses different rules in different regions. A European call option's payoff at expiration is max(S − K, 0), where S is the terminal asset price and K is the strike. For K = 100 and S = 90, payoff is zero; for S = 115, payoff is 15. This is a payoff, not a profit: subtracting the appropriately timed purchase cost is a separate operation. The graph is flat below 100 and rises with slope one above it. Already, algebra connects a definition, a table of numbers, and a shape.

## 1.5 Powers, exponentials, and logarithms

For a positive integer n, a^n is a multiplied by itself n times. Define a^0 = 1 for nonzero a to preserve the law a^(m+n) = a^m a^n. Define negative powers by a^(−n) = 1/a^n. For positive a, fractional powers are defined through roots: a^(1/2) is the positive square root. A negative base raised to a noninteger power can fail to be real, so our financial growth bases will generally be positive.

If an investment earns return R each period, one dollar becomes 1 + R after one period, (1 + R)² after two, and (1 + R)^n after n. For variable returns, multiply the individual gross returns:

$$W_n=W_0\prod_{t=1}^{n}(1+R_t).$$

The product symbol means repeated multiplication. With returns +10% and −10%, the two-period growth factor is 1.1 × 0.9 = 0.99. Wealth falls 1%, although the arithmetic average return is zero. A 50% loss needs a 100% gain to recover: 0.5 × 2 = 1. Returns do not add across time in the same way dollar gains do.

The logarithm log_b(x) asks what power of b produces x. Thus log_10(1,000) = 3. The natural logarithm ln uses the base e, approximately 2.71828. Its defining inverse relationship is ln(e^x) = x. For positive a and b, ln(ab) = ln(a) + ln(b), which follows because e^u e^v = e^(u+v). Logarithms transform multiplication into addition.

Define log return r_t = ln(1 + R_t) when R_t > −1. Then ln(W_n/W_0) = sum r_t. For +10% and −10%, log returns are approximately 0.09531 and −0.10536, summing to −0.01005. Exponentiating gives 0.99. A log return of 0.05 is not exactly a simple return of 5%: the corresponding simple return is e^0.05 − 1, approximately 5.127%. Approximation becomes more reliable for smaller changes, a fact calculus will explain.

Continuous compounding uses W(t) = W0 e^(rt). If the continuously compounded annual rate is 0.04, 100 dollars becomes approximately 104.0811 after one year. A simple annual rate of 4% gives 104. The rates describe different conventions. Whenever a problem says “the rate is 4%,” identify its compounding frequency before using it.

## 1.6 Sequences, sums, and geometric growth

A sequence is an ordered list a1, a2, a3, and so on. The subscript is an index, not multiplication. The notation sum from t = 1 to n of a_t means a1 + a2 + … + an. For values 2, 5, and 8, the sum is 15 and the arithmetic mean is 15/3 = 5. A weighted mean uses weights that sum to one. Weights 0.2, 0.3, and 0.5 give 0.2 × 2 + 0.3 × 5 + 0.5 × 8 = 5.9.

Consider S_n = 1 + q + q² + … + q^(n−1). Multiplying by q shifts the terms: qS_n = q + q² + … + q^n. Subtract to obtain (1 − q)S_n = 1 − q^n. Therefore,

$$S_n=\frac{1-q^n}{1-q}\quad(q\ne1).$$

When q = 1, the sum is n; the formula's denominator is zero and must not be used. If |q| < 1, q^n approaches zero as n grows, so the infinite geometric series sums to 1/(1 − q). If q ≥ 1, its nonnegative terms do not decay sufficiently for a finite sum. This distinction later determines whether a perpetuity has finite value or an autoregressive process has stable variance.

To value three year-end payments of 10 at an annual discount rate of 5%, add 10/1.05 + 10/1.05² + 10/1.05³. The values are approximately 9.5238, 9.0703, and 8.6384, totaling 27.2325. A payment is divided by a growth factor because discounting reverses accumulation. Multiplying 9.5238 by 1.05 returns approximately 10. This reversal is the most basic consistency check in valuation.

## 1.7 Sets, logic, and precise claims

A set collects objects. Write A = {1, 2, 3}. Membership x in A means x is one of those elements. An interval [0, 1] includes both endpoints; (0, 1) excludes them. The real numbers include integers, fractions, and irrational values such as sqrt(2). Probability will assign weights to sets of possible outcomes, so set notation is more than a formal distraction.

The intersection A ∩ B contains elements in both sets; the union A ∪ B contains elements in at least one. If A = {1, 2} and B = {2, 3}, the intersection is {2}, while the union is {1, 2, 3}. A complement depends on the universe under discussion. The complement of {1} in {1, 2, 3} is {2, 3}; it differs from the complement in all integers. Always identify the underlying collection of possibilities.

An implication “if A then B” does not automatically give its converse “if B then A.” If an integer is divisible by four, it is even. An even integer need not be divisible by four: six is a counterexample. In statistical work, “a predictive relationship exists” does not imply “a particular economic explanation is true.” Multiple mechanisms can produce similar data.

The quantifier “for every” makes a universal claim, while “there exists” makes an existence claim. One counterexample refutes a universal statement. To disprove “every investment with positive average return increases wealth,” the +50%, −40% sequence suffices: its arithmetic mean is +5%, yet the product is 1.5 × 0.6 = 0.9. The argument does not establish that average return is useless; it establishes that it answers a different question.

A theorem has assumptions and a conclusion. A proof shows why the conclusion follows from the assumptions. An example illustrates a claim but does not usually prove a universal claim. A simulation can reveal a coding error or suggest a theorem, but observing ten thousand successes cannot logically rule out all unobserved failures. This distinction will remain important when we simulate random processes.

## 1.8 Three proof techniques used throughout the book

A direct proof starts with definitions and follows justified steps. For positive x and y, prove that their arithmetic mean is at least their geometric mean. The square (sqrt(x) − sqrt(y))² is nonnegative. Expanding gives x + y − 2sqrt(xy) ≥ 0. Rearranging yields (x + y)/2 ≥ sqrt(xy), with equality exactly when x = y. The proof explains why uneven growth rates reduce compounded growth relative to a fixed arithmetic average.

A proof by contradiction assumes the opposite of the desired conclusion and derives an impossibility. To show sqrt(2) is irrational, suppose sqrt(2) = p/q for integers with no common factor. Squaring gives p² = 2q², so p² is even. An odd integer has odd square, hence p is even: p = 2k. Substituting gives q² = 2k², making q even too. This contradicts the assumption that p and q have no common factor. The key is the contradiction with a chosen representation, not merely encountering a surprising equation.

Induction proves statements indexed by positive integers. First establish a base case. Then prove that validity at n implies validity at n + 1. For 1 + 2 + … + n = n(n + 1)/2, the base case n = 1 holds. Assuming the formula at n, adding n + 1 gives n(n + 1)/2 + n + 1 = (n + 1)(n + 2)/2, the required formula at the next integer. The two steps together cover every positive integer. The induction hypothesis is a temporary assumption within the implication, not an assumption of the entire theorem.

## 1.9 Approximation, scale, and numerical honesty

An absolute error is |estimate − truth|. A relative error divides the absolute error by |truth| when truth is nonzero. An error of 1 dollar is small for a million-dollar valuation and large for a 2-dollar instrument. Relative error becomes unstable near zero. In that situation, choose a meaningful scale, such as invested capital or a contractual tolerance, and explain it.

Scientific notation writes numbers as a × 10^k with 1 ≤ |a| < 10. A probability 0.000003 is 3 × 10^(−6). This notation helps compare orders of magnitude and spot unit mistakes. Confusing 5 basis points with 5% introduces a factor of 100; no amount of model complexity repairs that mistake.

Computer arithmetic represents most decimals approximately. Subtracting two nearly equal large values can erase useful digits, a phenomenon called cancellation. Consider computing (sqrt(1 + h) − 1)/h for tiny h. Multiply numerator and denominator by sqrt(1 + h) + 1 to obtain 1/(sqrt(1 + h) + 1). The second expression avoids subtracting two nearly equal numbers and approaches 1/2 smoothly. Algebra can improve numerical computation before any specialized algorithm appears.

An approximation must state what was omitted and when that omission is reasonable. For small R, ln(1 + R) is close to R; at R = 0.01 their difference is about 0.0000497. At R = 1, ln(2) differs greatly from 1. “Small” must be judged against the required tolerance and the number of repeated uses. A small daily approximation error can accumulate over years.

## 1.10 A complete financial calculation

An investor buys two shares at 50 dollars each, receives a 1-dollar dividend per share at the end of the first year, and sells both shares at 53 dollars at that same endpoint. Initial expenditure is 100 dollars. Final sale proceeds are 106 dollars and dividends total 2 dollars. Total final cash is 108 dollars; holding-period return is 8%. If inflation over the same year is 3%, real gross growth is 1.08/1.03, giving a real return of approximately 4.854%. Subtracting inflation gives 5%, a useful approximation but not the exact relationship.

Now suppose trading costs are 0.50 dollars at purchase and 0.50 at sale. Initial cash outflow is 100.50 and final inflow is 107.50. Net simple return is 107.50/100.50 − 1, approximately 6.965%. If the initial cost is instead paid from a separately specified account, the denominator convention changes. The cash-flow timeline determines the formula, not the other way around.

The calculation has four stages: define the position and dates; list every cash flow with a sign; combine cash flows that occur at the same date; compare correctly timed amounts. It also has four checks: dollars cancel in the return ratio; a larger sale price increases return; additional costs reduce return; removing all gains and costs yields zero return. These checks are elementary examples of invariants, relationships that should remain true when inputs change.

The companion's growth experiment lets you vary initial wealth, a rate, and time. It compares simple accumulation, repeated compounding, and continuous compounding under their displayed conventions. Use it to see why an annual rate must travel with its definition. It computes hypothetical balances, not forecasts.

Before leaving the example, distinguish a model input from a measured fact. The sale price and dividend can be historical observations; an assumed future price is a forecast. The same formula accepts both, but the resulting number has a different evidential status. Label a forecast return as conditional on its assumptions. A calculator cannot tell whether the numbers entered describe the past, a hypothetical scenario, or a justified expectation.

## 1.11 Guided practice and study resources

Practice is optional, but writing solutions will reveal gaps reading can conceal. First convert 12 basis points to a decimal; then calculate the difference between a 20% increase followed by a 20% decrease and a zero total return. Next solve 100(1 + R)² = 121 under the condition 1 + R > 0. Finally explain why the equation x/x = 1 cannot be used at x = 0. Record the condition that makes each manipulation valid.

Hints: divide basis points by 10,000; multiply gross returns; take the positive square root when the gross-return condition requires it; a fraction needs a nonzero denominator. A deeper extension is to prove that two positive gross returns with a fixed arithmetic mean have their largest product when they are equal. Expand (a − b)² ≥ 0 and connect the result to the arithmetic–geometric mean proof above.

For sustained algebra practice, use [OpenStax Algebra and Trigonometry](https://openstax.org/details/books/algebra-and-trigonometry-2e). Follow its sections on real numbers, equations, functions, exponential functions, and logarithms as needed. This is a supplementary prerequisite resource, not one of the original finance courses. For the eventual financial application, [MIT Finance Theory I](https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/) begins valuation from cash flows; approach its first present-value material after this chapter and Chapter 2's treatment of limits. The resource ledger distinguishes the pages inspected from linked files not individually opened.

You are ready to continue when you can translate a verbal money problem into a cash-flow timeline, manipulate the resulting equation without losing its domain restrictions, and explain the units of every intermediate result. Speed is secondary. The next chapter turns finite changes into local rates and finite sums into integrals, building the language required for continuous-time finance.


<a id="chapter-02"></a>

# 2. Calculus and continuous models

## 2.1 Measuring change without choosing an arbitrary interval

An account follows V(t) = 100(1 + t)², where t is time in years. Between t = 1 and t = 2, its value rises from 400 to 900, so its average rate of change is 500 dollars per year. Between t = 1 and t = 1.1, it rises from 400 to 441, an average rate of 410 dollars per year. Both answers are correct, but they answer questions about different intervals. We want a rate at a particular instant. That requires investigating what happens as the interval shrinks.

For a function f, the difference quotient at x over an increment h is [f(x + h) − f(x)]/h, with h nonzero. The numerator measures an output change and the denominator measures an input change. On a graph, their ratio is the slope of a secant line through two points. If these slopes approach a single finite value as h approaches zero from both sides, that value is the derivative f'(x).

For f(x) = x², expansion gives [(x + h)² − x²]/h = (2xh + h²)/h = 2x + h. Cancellation is valid because h is nonzero during the calculation. As h tends to zero, 2x + h tends to 2x. Thus f'(x) = 2x. The derivative was obtained from nearby distinct inputs; we never divided by zero. For V(t), V'(t) = 200(1 + t), so the instantaneous rate at t = 1 is 400 dollars per year. The 410-dollar average rate over the short interval is close because the slope changes gradually.

Calculus is not a replacement for discrete models. Financial data arrive at discrete times, and cash flows often occur on specified dates. Continuous models can make relationships tractable and provide useful approximations. Their assumptions must still connect to the actual contract or observation process. The difference between a convenient smooth model and a jagged observed price path will become central in stochastic calculus.

## 2.2 Limits give approximation a precise meaning

The statement f(x) tends to L as x tends to a means that f(x) can be made arbitrarily close to L by keeping x sufficiently close to a, excluding x = a itself if necessary. Formally, for every epsilon greater than zero there exists delta greater than zero such that 0 < |x − a| < delta implies |f(x) − L| < epsilon. Epsilon specifies the desired output tolerance; delta specifies an input tolerance sufficient to achieve it.

For f(x) = 3x + 2 near a = 1, the candidate limit is 5. Since |f(x) − 5| = 3|x − 1|, choosing delta = epsilon/3 proves the claim. This example shows the logical order. The desired tolerance is given first; we find a rule for satisfying it. Choosing one convenient epsilon would illustrate the behavior but would not prove the universal claim.

A function is continuous at a when its limit at a equals f(a). The function g(x) = (x² − 1)/(x − 1) is undefined at x = 1 but equals x + 1 elsewhere, so its limit there is 2. Defining g(1) = 2 repairs the removable discontinuity. By contrast, a jump from zero to one cannot be repaired by changing one point: the left and right limits differ. A derivative requires continuity, but continuity does not guarantee a derivative. The absolute-value function is continuous at zero and has left slope −1 and right slope +1, so it is not differentiable there.

Sequences also have limits. The sequence 1/n tends to zero because, for any positive epsilon, n > 1/epsilon makes 1/n < epsilon. A convergent series is a limit of partial sums. These definitions underlie discounted infinite cash flows, infinite moving-average representations, and the convergence of numerical algorithms. They also warn us that an apparently stable finite calculation does not automatically prove a limiting statement.

## 2.3 Derivative rules and why they work

Linearity follows directly from distributing a difference quotient: the derivative of af + bg is af' + bg' for constants a and b. The derivative of a constant is zero because its numerator change is zero. For integer powers, expansion of (x + h)^n gives nx^(n−1) as the only term that remains after division by h and passage to the limit. This leads to the power rule d(x^n)/dx = nx^(n−1), with suitable domains for noninteger powers.

For a product fg, add and subtract f(x + h)g(x) in the numerator. The quotient becomes f(x + h)[g(x + h) − g(x)]/h + g(x)[f(x + h) − f(x)]/h. Taking limits gives (fg)' = fg' + gf'. Both terms are needed because both factors change. The false rule (fg)' = f'g' fails even for x × x: it would predict 1 rather than 2x.

The chain rule handles composition. If y = f(u) and u = g(x), then dy/dx = f'(g(x))g'(x) when the derivatives exist. For f(u) = u² and g(x) = 1 + x, the result is 2(1 + x). A useful intuition is “output change per intermediate change” times “intermediate change per input change.” This unit-cancellation picture is intuition; the formal justification comes from controlling the approximation errors in both local linearizations.

The exponential function e^x has derivative e^x. Its inverse ln(x), defined for x > 0, therefore has derivative 1/x: differentiating e^(ln x) = x gives e^(ln x)(ln x)' = 1. Applying the chain rule, the derivative of ln(1 + x) is 1/(1 + x), for x > −1. These identities let us compare simple and log returns by studying their local change rates.

The quotient rule follows by treating division as multiplication by an inverse. For g nonzero, (f/g)' = (f'g − fg')/g². For a discounted payment P(y) = 100/(1 + y)², the derivative is −200/(1 + y)³ on y > −1. Increasing the discount rate lowers the present value. The sign of the derivative expresses an economic relationship; its magnitude quantifies sensitivity near the chosen rate.

## 2.4 Local linearity, curvature, and optimization

Differentiability means f(x + h) = f(x) + f'(x)h + error, where error/h tends to zero as h tends to zero. The tangent line is therefore a locally accurate approximation. If a two-year zero-coupon payment of 100 is discounted at 5%, its price is 100/1.05², approximately 90.7029. Its derivative there is approximately −172.7675 per unit decimal yield. A one-basis-point increase has h = 0.0001 and a first-order price change of approximately −0.01728.

The second derivative measures how the first derivative changes. For the bond example it is 600/(1 + y)^4, which is positive. The price-yield graph bends upward. Taylor's second-order approximation adds half the second derivative times h²:

$$f(x+h)\approx f(x)+f'(x)h+\frac12f''(x)h^2.$$

When the third derivative is bounded by M between x and x + h, the magnitude of the omitted second-order Taylor remainder is at most M|h|³/6. This condition explains why the approximation improves rapidly as the step shrinks and why it may fail over large moves or near singularities.

For a differentiable function with an interior local minimum, the derivative must vanish: slopes from either side cannot consistently point downhill through the proposed minimum. A zero derivative is necessary, not sufficient. The function x³ has derivative zero at zero but no minimum there. A positive second derivative at a stationary point gives a strict local minimum under the usual smoothness conditions. Boundaries require direct examination: minimizing x on [0, 1] gives x = 0 even though the derivative is one everywhere.

Consider minimizing f(x) = (x − 3)² + 2. Its derivative is 2(x − 3), so the stationary point is x = 3. The second derivative is 2, and the square is nonnegative for every real x. Therefore 3 is the unique global minimizer, with value 2. The global argument uses the function's structure, going beyond a local derivative test. In Chapter 12, convexity will provide systematic versions of this reasoning.

## 2.5 Integrals accumulate small contributions

Suppose a cash flow arrives continuously at rate c(t) dollars per year. Over a short interval of width delta t, the amount received is approximately c(t) delta t. Add these contributions over a partition of the time interval. If the sums approach a common limit as the largest interval width shrinks, that limit is the integral of c. The integral's units are dollars because dollars/year is multiplied by years.

For c(t) = 2t on [0, 1], right-endpoint sums using n equal intervals are sum from k = 1 to n of 2(k/n)(1/n). Using the sum of the first n integers gives (n + 1)/n, which tends to one. Thus the area under 2t from zero to one is one. Finite sums approximate accumulation; the integral captures the limiting idealization.

The fundamental theorem of calculus connects differentiation and integration. If f is continuous, F(x) = integral from a to x of f(t)dt has derivative f(x). Consequently, if G' = f, the definite integral from a to b equals G(b) − G(a). For 2t, an antiderivative is t², giving 1² − 0² = 1. The theorem's continuity assumption can be weakened in more advanced analysis, but we will state the version we use rather than silently extending it.

An indefinite integral describes a family of antiderivatives, differing by constants. Integral 2t dt = t² + C because differentiation erases C. A definite integral is a number and has no arbitrary constant. Integrals can be negative when the integrand lies below zero; they represent signed accumulation, not always geometric area.

Substitution reverses the chain rule. To integrate 2x e^(x²), set u = x², so du = 2x dx, leaving integral e^u du = e^u + C. Integration by parts reverses the product rule: integral u dv = uv − integral v du. For integral t e^t dt, take u = t and dv = e^t dt to obtain t e^t − e^t + C. Choosing a technique is recognizing structure, not memorizing an isolated list.

## 2.6 Infinite horizons and probability densities

An improper integral is defined through a limit when the interval is unbounded or the integrand becomes singular. For r > 0, the integral of e^(−rt) from zero to infinity is the limit of (1 − e^(−rT))/r as T grows, which equals 1/r. If r = 0, the integrand is one and the integral diverges. If r < 0, it grows exponentially and also diverges. A perpetual continuous payment rate c therefore has present value c/r only under positive constant discounting and the assumed infinite payment stream.

A nonnegative function p(x) with integral one can represent a probability density. Probability over an interval [a, b] is the integral of p there. This is a preview of Chapter 5, not an assumption that probability is already known. For p(x) = 2x on [0, 1] and zero elsewhere, the total integral is one and the probability of the interval [0, 0.5] is 0.25. The height p(0.5) = 1 is not the probability of one exact point. Integrating over a zero-width interval gives zero.

The integral of x p(x) weights possible values by their probability density. In the preceding example it equals integral from zero to one of 2x² dx = 2/3. This is the continuous counterpart of a weighted mean. The relationship between sums and integrals will let us move from finite scenarios to continuous distributions without changing the central question: how much weight belongs to each possible value?

## 2.7 Multiple inputs: gradients and Hessians

A function can depend on several variables, such as f(x, y) = x² + xy + 2y². A partial derivative changes one input while holding the others fixed. Thus partial f/partial x = 2x + y and partial f/partial y = x + 4y. At (1, 2), these values are 4 and 9. A small change (dx, dy) changes the output approximately by 4dx + 9dy. This generalizes one-dimensional local linearity.

The gradient is the column vector of partial derivatives. Its dot product with a direction gives the directional rate of change. The Hessian is the matrix of second partial derivatives. Here it is [[2, 1], [1, 4]]. For a change vector h, the quadratic correction is one half h-transpose H h. Chapter 3 will develop matrix notation fully; at this point, expand the expression to understand it: one half times (2dx² + 2dxdy + 4dy²).

At an unconstrained interior optimum of a differentiable multivariable function, every partial derivative is zero. Solve 2x + y = 0 and x + 4y = 0. The first gives y = −2x; the second then gives −7x = 0. Thus x = y = 0. The quadratic expression is positive away from the origin because x² + xy + 2y² = (x + y/2)² + 7y²/4. This establishes a unique global minimum without relying on a matrix theorem we have not yet proved.

Constrained problems differ. Minimize x² + y² subject to x + y = 1. Substitution gives f(x, 1 − x) = 2x² − 2x + 1. Its derivative vanishes at x = 1/2, giving y = 1/2 and value 1/2. The unconstrained minimizer (0, 0) is infeasible. Optimization must respect the problem's allowable set before interpreting derivatives.

## 2.8 Ordinary differential equations

A differential equation describes a relationship involving an unknown function and its derivatives. The growth equation dV/dt = rV says the rate of change is proportional to current wealth. For V positive, divide by V and integrate: integral dV/V = integral r dt. With constant r, ln V = rt + C. Exponentiating and imposing V(0) = V0 yields V(t) = V0 e^(rt). The initial condition selects one trajectory from a family of solutions.

For a mean-reverting deterministic quantity x, dx/dt = k(theta − x) with k > 0. Let y = x − theta. Then dy/dt = −ky, so y(t) = y(0)e^(−kt), giving x(t) = theta + [x(0) − theta]e^(−kt). The distance from theta shrinks exponentially. The half-life solves e^(−kt) = 1/2, so t = ln(2)/k. Units matter: if k is per year, the half-life is in years.

Differential equations do not automatically have a unique solution. Conditions such as local continuity and a suitable Lipschitz bound in the state variable provide standard existence and uniqueness results. The equation x' = 2sqrt(|x|) with x(0) = 0 illustrates trouble: a solution can stay at zero for a while and then follow a growing branch. We will use well-behaved deterministic equations and identify additional assumptions when introducing stochastic equations.

Euler's numerical method approximates x(t + h) by x(t) + h f(t, x(t)) for x' = f(t, x). For mean reversion with k = 1, theta = 0, x0 = 1, and h = 0.1, the first update is 0.9 and the second 0.81. The exact value at t = 0.2 is e^(−0.2), approximately 0.81873. The numerical discrepancy is discretization error. Decreasing h usually improves a stable consistent approximation, but computational cost rises.

Stability can matter more than local accuracy. For x' = −kx, Euler multiplies the state by 1 − kh each step. If |1 − kh| > 1, the computed path grows in magnitude although the true solution decays. Thus h must satisfy 0 < kh < 2 for this particular method's stability. A plausible-looking update formula can fail spectacularly when its step is too large.

## 2.9 Trigonometry and frequency before spectral models

An angle in radians measures arc length divided by radius. A full circle is 2pi radians. On a unit circle, cos(theta) is the horizontal coordinate and sin(theta) the vertical coordinate of the point at angle theta. Both oscillate between −1 and 1; cosine begins at one and sine at zero. Their derivatives are −sin(theta) and cos(theta), respectively, when angles use radians.

A periodic signal A cos(omega t + phi) has amplitude A, angular frequency omega, and phase phi. If ordinary frequency is f cycles per unit time, omega = 2pi f. Sampling a daily signal imposes limits on distinguishable frequencies. Two continuous oscillations can agree at every sampled time even when their behavior between samples differs. This phenomenon, aliasing, will explain why frequency analysis must respect the observation interval.

The imaginary number i satisfies i² = −1. Complex numbers a + ib are pairs with multiplication defined by this rule. Euler's identity e^(i theta) = cos(theta) + i sin(theta) packages oscillation into exponential notation. We will only need the operational identity and the interpretation of its real and imaginary components for spectral analysis; advanced complex analysis is not a prerequisite for this curriculum.

## 2.10 Numerical integration, roots, and a worked valuation

The trapezoidal rule approximates an integral by adding trapezoid areas. On intervals of width h, use h[f(x0)/2 + f(x1) + … + f(x_(n−1)) + f(xn)/2]. For f(t) = t² on [0, 1] with two intervals, the approximation is 0.5[0/2 + 0.25 + 1/2] = 0.375, compared with the exact 1/3. Refining the partition improves this smooth example. An error bound requires assumptions about derivatives; a discontinuity can change the convergence behavior.

Root finding solves f(x) = 0. Bisection starts with a continuous function whose endpoint values have opposite signs. The intermediate value theorem ensures a root inside. Repeatedly keep the half with the sign change; after n halvings, the interval width is its original width divided by 2^n. Newton's method uses the tangent line: x_new = x − f(x)/f'(x). It can converge quickly near a simple root but can fail with a poor initial value or a near-zero derivative. A reliable calculation combines speed with a checked bracket when available.

Suppose a contract pays 10 dollars per year continuously for three years under constant continuous discount rate r = 0.04. Its present value is integral from zero to three of 10e^(−0.04t)dt = 10(1 − e^(−0.12))/0.04, approximately 28.2699 dollars. The undiscounted amount is 30 dollars, so a value below 30 is sensible. Let r approach zero: the limiting value becomes 30. This limiting check confirms that the apparent division by a small rate corresponds to a well-behaved economic quantity.

To estimate rate sensitivity, differentiate under this finite integral for the smooth integrand: dPV/dr = −integral from zero to three of 10t e^(−rt)dt. It is negative because future positive cash payments lose present value when discounting increases. Here the derivative has units dollars × years per unit rate convention. A complete risk report states whether sensitivity is per unit decimal rate, per percentage point, or per basis point.

### Why a derivative estimate can get worse with a smaller step

The forward difference [f(x + h) − f(x)]/h has truncation error of order h for a sufficiently smooth function. A centered difference [f(x + h) − f(x − h)]/(2h) cancels the leading second-order Taylor contribution and has error of order h² when the required derivatives are controlled. This improved approximation is mathematical, but both formulas subtract nearby floating-point values.

If each function evaluation has a small absolute rounding error of scale epsilon, division by h can amplify that error to scale epsilon/h. Shrinking h reduces truncation error while increasing the rounding contribution. The total error can therefore have a U-shaped pattern. Choosing the smallest representable step is usually a poor numerical differentiation strategy.

For f(x) = x² at x = 1, the exact derivative is two. Calculate forward differences for h = 0.1, 0.01, and 0.001: they are 2.1, 2.01, and 2.001 in exact arithmetic. Continue toward extremely small h in a program and watch finite precision intervene. This experiment connects the limiting definition, Taylor approximation, and numerical implementation without confusing them.

A useful numerical report separates the analytic formula, the approximation rule, the chosen step, and the observed discrepancy. This makes a failed check diagnosable rather than merely surprising.

## 2.11 Practice, experiments, and further study

The growth laboratory corresponds to the ODE and compounding sections. Its finite outputs should agree with V0e^(rt) when continuous compounding is selected. In the Python examples, finite-difference derivatives are compared against known analytic derivatives. The purpose is to inspect convergence and cancellation, not to infer a theorem from a plot.

Suggested practice: derive the derivative of ln(x² + 1); evaluate integral from zero to two of 3t² dt; minimize (x − 2)² on [0, 1]; compute one Euler step for mean reversion toward 5 from initial state 1; explain why the optimum on [0, 1] need not satisfy f' = 0. For hints, apply the chain rule, use an antiderivative t³, inspect the feasible boundary, and substitute the current state into the ODE. Save full solutions until after making a serious attempt.

For a full university treatment, use [MIT 18.01SC Single Variable Calculus](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/) and [MIT 18.02SC Multivariable Calculus](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/). These are added foundations. Their exercises supply repetition beyond the original finance roadmap. Work derivative and integral problems until the operations have meaning, then revisit the bond and cash-flow examples. The next chapter develops vectors and matrices, turning several related equations into one coherent system.


<a id="chapter-03"></a>

# 3. Linear algebra and numerical structure

## 3.1 Several positions, one portfolio

Suppose a portfolio holds 3 shares of one asset and 2 shares of another. Their prices are 10 and 25 dollars. The portfolio's value is 3 × 10 + 2 × 25 = 80 dollars. A vector is an ordered collection that lets us represent this calculation without inventing a separate notation for every new asset. Let holdings h = (3, 2) and prices p = (10, 25). Their dot product h-transpose p is 80. Order matters because the first holding must match the first price.

We treat vectors as columns. The transpose symbol turns a column into a row, allowing h-transpose p to represent row-by-column multiplication. The same algebra can combine portfolio weights and returns. If weights are (0.6, 0.4) and asset returns are (0.02, −0.01), portfolio return over one holding period is 0.6 × 0.02 + 0.4 × (−0.01) = 0.008, or 0.8%, assuming weights are established at the beginning and no unmodeled cash flows occur. A vector's coordinates carry a defined order and unit; it is not an unlabeled bag of numbers.

Vector addition combines coordinates and scalar multiplication scales them. Adding holdings (3, 2) and (−1, 4) gives (2, 6). A linear combination a u + b v mixes vectors using scalar coefficients. A portfolio of assets is literally a linear combination of their state-dependent payoffs. This perspective will connect elementary algebra to replication, regression, principal components, and no-arbitrage pricing.

## 3.2 Geometry: length, angle, and projection

The Euclidean norm of x = (x1, …, xn) is sqrt(sum x_i²). For (3, 4) the length is five by the Pythagorean theorem. Norms measure size, but the choice matters. The one-norm sums absolute coordinates; the infinity-norm takes the largest absolute coordinate. A change that is small in one scale or unit need not be small in another. Standardizing inputs is a modeling choice that changes geometry.

The dot product x-transpose y equals sum x_i y_i. For nonzero vectors, it also equals ||x|| ||y|| cos(theta), defining their angle. Orthogonal vectors have dot product zero. The vectors (1, 1) and (1, −1) are orthogonal because their coordinate products sum to zero. Orthogonality is a geometric relationship; statistical independence is a probability relationship. They can connect, but they are not interchangeable.

To approximate y by a multiple of nonzero x, minimize ||y − ax||² over a. Expand the square: y-transpose y − 2a x-transpose y + a² x-transpose x. Differentiating gives −2x-transpose y + 2a x-transpose x. Setting it to zero yields a = (x-transpose y)/(x-transpose x). The residual y − ax is orthogonal to x because its dot product with x is zero. Projection therefore emerges from an optimization problem rather than a formula to memorize.

For x = (1, 1) and y = (2, 0), a = 2/2 = 1. The projection is (1, 1), residual (1, −1), and squared residual length is two. Any different coefficient increases the squared distance. This two-dimensional example contains the central idea of least-squares regression: find the component explained by an allowable collection of directions, then analyze what remains.

The Cauchy–Schwarz inequality states |x-transpose y| ≤ ||x|| ||y||. One proof uses the fact that ||y − ax||² is nonnegative and substitutes its minimizing coefficient. The remaining expression is ||y||² − (x-transpose y)²/||x||² ≥ 0. Rearranging gives the inequality when x is nonzero; the zero case is immediate. Equality occurs when the vectors are proportional. This bound later ensures that correlation lies between −1 and 1.

## 3.3 Matrices are linear maps

A matrix A with m rows and n columns maps an n-dimensional vector into an m-dimensional vector. The entry A_ij is in row i and column j. Multiplying A by x takes a dot product of each row with x. With A = [[1, 2], [3, 4]] and x = (5, 6), the result is (17, 39). The first output is 1 × 5 + 2 × 6; the second is 3 × 5 + 4 × 6.

An alternative view combines columns: Ax is x1 times the first column plus x2 times the second. For the same example, 5(1, 3) + 6(2, 4) = (17, 39). The row view explains how each output is calculated; the column view explains what combinations are possible. Both are needed for understanding a system of equations.

Matrix multiplication represents composition. If B maps inputs to intermediate values and A maps those to outputs, AB applies B first and A second. The inner dimensions must match. In general AB differs from BA. A rotation followed by a directional stretch usually differs from the stretch followed by the rotation. Treating matrix multiplication like ordinary multiplication loses the order of the modeled operations.

The identity matrix I leaves a vector unchanged. An inverse A^(−1), when it exists, reverses A: A^(−1)A = I. But most numerical work should solve Ax = b directly rather than explicitly constructing the inverse. An inverse is useful conceptually; a suitable factorization is usually better computationally. Rectangular matrices do not have ordinary two-sided inverses.

## 3.4 Solving systems and discovering rank

Consider x + 2y = 5 and 3x + 4y = 11. Subtract three times the first equation from the second to obtain −2y = −4, giving y = 2 and x = 1. This is elimination: replace equations by equivalent combinations until the unknowns can be recovered. Row swaps, adding a multiple of another row, and multiplying a row by a nonzero scalar preserve the solution set.

Now change the second equation to 2x + 4y = 10. It contributes no new restriction: it is twice the first. There are infinitely many solutions. If the right side were 11, there would be none. The same coefficient structure can therefore produce nonuniqueness or inconsistency depending on the right-hand side. Rank measures how many independent directions the columns, or equivalently the rows, contain.

The column space is the set of all possible Ax. The null space is the set of x satisfying Ax = 0. If a nonzero z is in the null space and x solves Ax = b, then x + z also solves it. A unique solution requires no hidden direction that leaves outputs unchanged. For an m-by-n matrix, rank plus null-space dimension equals n. This is the rank–nullity relationship.

Linear independence means the only combination of selected vectors that gives zero uses all zero coefficients. A basis is an independent collection spanning a space. Coordinates are coefficients relative to a basis. Choosing different bases changes the numerical description without changing the underlying object. Principal components will choose a basis that makes variation easier to describe; they do not create new information from nothing.

## 3.5 Least squares when exact fitting is impossible

Observed data seldom lie exactly on a model. Suppose y_i is an outcome and row i of X contains its model inputs. We choose coefficients beta to minimize ||y − X beta||². Differentiating gives the normal equations X-transpose X beta = X-transpose y. If X has independent columns, the unique solution is formally (X-transpose X)^(−1)X-transpose y. If columns are dependent, fitted values are still uniquely determined as a projection, but coefficient vectors may not be unique.

Take three observations at x = 0, 1, 2, with outcomes 1, 2, 2. Fit a line a + bx. The design matrix has rows (1, 0), (1, 1), (1, 2). The normal equations are 3a + 3b = 5 and 3a + 5b = 6. Subtraction gives 2b = 1, so b = 0.5 and a = 7/6. Fitted values are 7/6, 5/3, and 13/6. Residuals are −1/6, 1/3, and −1/6. They sum to zero and their weighted sum against x is zero, expressing orthogonality to both columns.

These properties depend on the objective and included columns. Residuals need not sum to zero if the model omits an intercept. Minimizing squared errors does not establish causality, statistical significance, or correct specification. It establishes a geometric best fit relative to the chosen column space and loss function. Statistical interpretation comes later.

Numerically, forming X-transpose X can worsen conditioning. A QR factorization writes X = QR, with orthonormal columns in Q and upper-triangular R. The least-squares problem becomes solving R beta = Q-transpose y. Orthonormal transformations preserve Euclidean lengths, so the objective retains its geometry without explicitly squaring the matrix's condition number. Modern least-squares routines use suitable stable factorizations rather than the inverse expression.

## 3.6 Quadratic forms and covariance geometry

A quadratic form is x-transpose A x. For a symmetric two-by-two matrix with entries a, b, b, c, it expands to ax1² + 2bx1x2 + cx2². Symmetry means A-transpose = A. A symmetric matrix is positive semidefinite if its quadratic form is nonnegative for every x; it is positive definite if the form is strictly positive for every nonzero x.

For A = [[2, 1], [1, 2]], the form is 2x1² + 2x1x2 + 2x2² = (x1 + x2)² + x1² + x2², positive for nonzero x. For B = [[1, 2], [2, 1]], choosing x = (1, −1) gives −2, so B is not positive semidefinite. A matrix can have positive diagonal entries and still have a negative quadratic direction. Checking only individual variances is insufficient for validating a covariance matrix.

A covariance matrix Sigma has entries Cov(R_i, R_j). For weights w, portfolio variance is w-transpose Sigma w because expanding the variance of sum w_i R_i creates every covariance pair. Since variance cannot be negative, every valid covariance matrix is positive semidefinite. This is both a theorem and a practical data-quality check. Pairwise estimates using different missing-data subsets can accidentally produce a matrix violating it.

For two assets with standard deviations 0.2 and 0.1 and correlation 0.3, covariance is 0.3 × 0.2 × 0.1 = 0.006. The covariance matrix is [[0.04, 0.006], [0.006, 0.01]]. Equal weights give variance 0.25 × 0.04 + 0.5 × 0.006 + 0.25 × 0.01 = 0.0155, hence standard deviation approximately 0.12450. The middle term appears twice through the two symmetric covariance entries. Forgetting it changes the portfolio's estimated risk.

## 3.7 Eigenvalues reveal natural directions

An eigenvector v is a nonzero vector satisfying Av = lambda v. The map changes its length and possibly reverses its direction but does not rotate it away from its span. Lambda is the eigenvalue. For [[2, 1], [1, 2]], (1, 1) maps to (3, 3), so it has eigenvalue three. The vector (1, −1) maps to itself and has eigenvalue one. The matrix stretches the shared direction more than the opposing direction.

Real symmetric matrices admit an orthonormal eigenvector basis. Write A = Q Lambda Q-transpose, where Q's columns are orthonormal eigenvectors and Lambda is diagonal. This spectral theorem turns a coupled quadratic form into a sum of independent squared coordinates multiplied by eigenvalues. The matrix is positive semidefinite exactly when all eigenvalues are nonnegative. Repeated eigenvalues allow multiple valid bases within the corresponding subspace.

For a covariance matrix, eigenvalues quantify variance along orthogonal directions. The trace, the sum of diagonal entries, equals the sum of eigenvalues and therefore total variance. A tiny eigenvalue indicates an almost redundant combination; a negative eigenvalue beyond numerical tolerance suggests an invalid covariance estimate or implementation problem. Eigenvectors can flip sign without changing their meaning because both v and −v describe the same one-dimensional direction.

Diagonalization is not available with an orthonormal real basis for every arbitrary matrix. Some nonsymmetric matrices have complex eigenvalues or insufficient independent eigenvectors. We will use symmetric eigensolvers for symmetric covariance matrices and more general decompositions when structure differs. Choosing an algorithm based on a matrix's known properties is a form of mathematical modeling.

## 3.8 Singular values and principal components

Every real m-by-n matrix has a singular value decomposition X = U D V-transpose, with orthonormal singular-vector columns and nonnegative singular values in D. Singular values measure how strongly X stretches particular orthogonal input directions. Their number above an appropriate tolerance estimates numerical rank. Unlike eigenvalue decomposition, the SVD also applies to rectangular matrices.

Principal component analysis begins with a data matrix whose rows are observations and columns are variables. Center each column by subtracting its sample mean. The sample covariance is X-transpose X/(n − 1). Its leading eigenvector gives the unit direction with largest sample variance, because maximizing v-transpose Sigma v subject to v-transpose v = 1 selects the largest eigenvalue direction. Subsequent components maximize remaining variance subject to orthogonality.

For two centered variables that move almost identically, the leading component points near (1, 1), capturing common variation; the second near (1, −1) captures their difference. In a yield-curve dataset, leading empirical components often resemble broad curve movements, but the labels “level,” “slope,” and “curvature” are interpretations checked against loadings, not universal mathematical guarantees. The course's interest-rate PCA materials supply a substantive application.

Scaling changes PCA. A variable measured in basis points and another in decimal units can have radically different numerical variances despite identical economic variation. Covariance PCA preserves original scale; correlation PCA standardizes each variable first. Choose according to the question, report the choice, and fit centering and scaling on training data only when evaluating forecasts. Computing components using the future test period leaks future distribution information.

PCA is unsupervised: it maximizes variance in inputs rather than prediction of an outcome. A high-variance component can be irrelevant to the target; a low-variance spread can be economically informative. Truncating components reduces dimension but discards information. Cross-validation or a stated reconstruction objective should justify the truncation.

## 3.9 Numerical conditioning and regularization

A problem is ill-conditioned when small input changes can produce large output changes. Consider equations x + y = 2 and x + (1 + epsilon)y = 2 + epsilon. For epsilon nonzero, the solution is x = y = 1. If the second right side changes by delta, y changes by delta/epsilon. When epsilon is tiny, even a tiny measurement error can produce a large coefficient change. This is a property of the mathematical problem, distinct from an unstable algorithm.

The two-norm condition number of an invertible matrix is its largest singular value divided by its smallest. A large ratio indicates strong amplification in an unfavorable direction. Stable computation cannot recover information absent from nearly redundant measurements. Report uncertainty, reconsider the model, or regularize rather than interpreting unstable coefficients as precise findings.

Ridge regularization minimizes ||y − X beta||² + lambda ||beta||² for lambda > 0. Its normal equation is (X-transpose X + lambda I)beta = X-transpose y. The added term lifts small eigenvalues and discourages large coefficients. It trades some fitting bias for reduced sensitivity. If an intercept should remain unpenalized, exclude its coordinate from the penalty. Scaling inputs matters because the penalty acts on coefficient magnitudes in the chosen units.

Covariance shrinkage uses a similar idea: Sigma_shrunk = (1 − alpha)Sigma_sample + alpha T, where T is a structured positive semidefinite target. If both matrices are positive semidefinite and alpha is between zero and one, the combination remains positive semidefinite because its quadratic form is a nonnegative weighted sum. A shrinkage estimator can improve stability without proving that its target is the true covariance.

## 3.10 Factorizations, computation, and failure diagnosis

Cholesky factorization writes a symmetric positive-definite matrix as LL-transpose with lower-triangular L. It is efficient for solving systems and generating correlated normal variables. If z has identity covariance and x = Lz, then Cov(x) = L I L-transpose = Sigma. A merely semidefinite matrix may require an eigenvalue or rank-aware method. Adding a small diagonal adjustment can make a computation run, but that changes the model and must be reported.

For A = [[4, 2], [2, 3]], choose L11 = 2, L21 = 1, and L22 = sqrt(2), giving L = [[2, 0], [1, sqrt(2)]]. Multiplication recovers A. Solving Ax = b then means first solving Ly = b and then L-transpose x = y. These triangular steps replace a more expensive explicit inverse. Reusing the factorization is valuable when many right-hand sides share the same matrix.

When a solver fails, diagnose the mathematical situation before changing a tolerance. A dimension mismatch means the specified operations do not align. A singular system can indicate duplicate features, an intercept duplicated by dummy variables, or an unidentifiable model. A failed positive-definiteness check can indicate valid redundancy or invalid covariance construction. An overflow can indicate extreme scaling. Each failure has a different remedy.

Numerical tolerances depend on scale. A value of 10^(−12) may be negligible relative to one and enormous relative to 10^(−20). Use comparisons such as |a − b| ≤ atol + rtol|b|, with tolerances chosen for the data and operation. Exact equality is often inappropriate for floating-point results, but an overly generous tolerance can hide substantive errors.

### Replication as a linear system

Suppose two securities have payoffs (120, 80) and (105, 105) across two future states. To replicate target payoff (20, 0), choose holdings a and b satisfying 120a + 105b = 20 and 80a + 105b = 0. Subtracting yields 40a = 20, so a = 0.5 and b = −40/105. The payoff matrix's columns span both state directions, so every two-state payoff can be represented. Its rank is two.

Now add a third state while keeping only those two securities. The payoff matrix has three rows and two columns, so its column space has dimension at most two. Some three-state target payoffs cannot be replicated. This is the linear-algebra core of market incompleteness. A least-squares approximation can minimize payoff error, but it does not turn the approximate payoff into an exact replication or uniquely determine every unhedgeable claim's price.

The null space has an economic interpretation too. If a nonzero portfolio produces zero payoff in every modeled state, no-arbitrage requires its current cost to be zero under the same feasibility assumptions. Otherwise one direction of the portfolio would deliver an initial gain with no future obligation. Redundant securities impose price restrictions even though they do not expand attainable payoffs.

### Determinants are summaries, not a default algorithm

For a two-by-two matrix [[a, b], [c, d]], the determinant is ad − bc. A nonzero determinant means its columns span the plane and the map is invertible. Geometrically, the absolute determinant scales oriented area; a negative determinant reverses orientation. For larger square matrices, determinant zero similarly indicates singularity, but explicitly expanding determinants is a poor way to solve large numerical systems.

A tiny determinant is not a scale-independent measure of poor conditioning. Multiplying every entry of a well-conditioned n-by-n matrix by a small constant multiplies its determinant by that constant to the nth power without changing its condition number. Conversely, a determinant can look moderate while singular values vary greatly. Use singular values or an appropriate condition estimate to diagnose sensitivity.

### Orthogonalization as an explicit procedure

To build an orthonormal basis from independent vectors, normalize the first, subtract its projection from the second, normalize what remains, and continue. For v1 = (1, 1) and v2 = (1, 0), the first unit vector is (1, 1)/sqrt(2). Subtracting v2's projection leaves (1/2, −1/2), whose normalized direction is (1, −1)/sqrt(2). These become the columns of Q in a QR construction.

Classical Gram–Schmidt expresses the geometry clearly but can lose orthogonality in floating-point arithmetic for nearly dependent columns. Modified Gram–Schmidt or Householder transformations improve numerical behavior. This illustrates a recurring distinction: a mathematically equivalent formula can have a different computational error profile. Learn the transparent derivation, then use a stable implementation appropriate to the scale.

When using a decomposition, retain its diagnostic output where available. Rank estimates, singular values, residual norms, and convergence status explain more than a coefficient vector alone. A small residual can coexist with unstable coefficients when predictors nearly duplicate one another.

## 3.11 Practice and connections

In the portfolio laboratory, the covariance expression changes as you adjust correlation and weights. Verify three limits: putting all weight in the first asset returns its risk; perfect positive correlation eliminates diversification for nonnegative weights; perfect negative correlation permits zero variance at a particular hedge ratio under the model. The zero-risk combination depends on exact model parameters and does not promise a real-world arbitrage.

Suggested exercises: calculate [[1, 2], [0, 1]] times (3, 4); solve x + y = 3 and x − y = 1; project (3, 1) onto (1, 1); find eigenvalues of [[2, 1], [1, 2]] using the directions already identified; explain why duplicate regression columns prevent unique coefficient identification. For an extension, prove that any covariance matrix is positive semidefinite by expanding the variance of a weighted sum.

Use [MIT 18.06SC Linear Algebra](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/) for full lectures and exercises. [MIT 18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) connects the ideas to one-period models and interest-rate PCA. [Stanford EE364A](https://see.stanford.edu/Course/EE364A) uses this language for optimization. The resource catalog includes direct notes and problem links; studying them after this chapter should feel like elaborating a familiar structure rather than encountering an unexplained notation system.

The main dependency is now established: vectors represent related quantities, matrices transform them, subspaces describe what can be represented, and factorizations reveal structure and support stable computation. Chapter 4 turns these operations into reproducible programs, while later chapters attach probability and economic interpretation to them.


<a id="chapter-04"></a>

# 4. Python and reproducible computation

## 4.1 A program is an explicit sequence of decisions

Research should be repeatable from stated inputs. If someone must remember which spreadsheet cells to edit or which notebook cells to run first, the procedure is only partly specified. A program records the operations. We begin with Python because its notation is approachable and its scientific ecosystem supports arrays, tables, statistics, and plotting. Learning the language is different from learning a trading platform. We will first build calculations that require no accounts, remote services, or market-data subscriptions.

The examples in this package's `examples` directory use Python's standard library and run without third-party installation. They are the reproducible computational baseline. NumPy, pandas, Matplotlib, SciPy, scikit-learn, and Jupyter are taught as the scientific-workflow path; examples using those libraries require their documented installation and are distinguished from the standard-library baseline. The verification report records which environments were actually executed.

Install a supported Python 3 interpreter from its official distribution or your institution's approved environment. On Windows, `py --version` often checks the installed launcher; `python --version` may work instead. In a terminal opened in the extracted course directory, run `py examples/core_labs.py`. On systems where the command is `python3`, substitute it consistently. A terminal is an interface for starting programs; it is not the Python language itself. Type Python source into a `.py` file or the interpreter, not directly into an unrelated command shell.

A project folder should separate source code, input data, generated outputs, and explanatory text. Never rely on an unexplained absolute path belonging to one machine. Use paths relative to the script location for bundled fixtures. For a new scientific project, create an isolated environment with `py -m venv .venv`, then activate it using the instructions appropriate to your shell. If organizational policy prevents activation scripts, invoke the environment's Python executable directly. Environment isolation keeps one project's library choices from unexpectedly changing another's.

## 4.2 Values, names, expressions, and types

The expression `200 * (1 + 0.05)` evaluates to 210.0. Assigning `initial_wealth = 200.0` binds a name to a value. A later expression can reuse it. The equals sign performs assignment in Python; `==` checks equality. Names should reveal meaning and units. `annual_rate_decimal` is more informative than `r` in a long data pipeline, even though concise mathematical symbols remain useful in derivations.

Python has integers, floating-point numbers, Boolean values, strings, and collections. Integers represent whole numbers; floats approximate real-valued calculations. `True` and `False` represent logical outcomes. A string is text enclosed in quotes. The string `"0.05"` is different from the number `0.05`; parsing converts valid numeric text into a number. Invalid text should raise a clear error rather than quietly becoming zero.

```python
initial_wealth = 200.0
return_decimal = 0.05
final_wealth = initial_wealth * (1.0 + return_decimal)
print(final_wealth)  # 210.0
```

Each assignment evaluates its right side before binding the left-side name. The printed number follows the compounding definition from Chapter 1. Multiplication uses `*`, exponentiation uses `**`, and division uses `/`. The caret `^` is a bitwise operator, not exponentiation. In a beginner's valuation program, that single-symbol mistake can produce a confusing error or an irrelevant result.

Floating-point arithmetic needs tolerant checks. `0.1 + 0.2 == 0.3` can be false because these decimals lack exact binary representations. Use `math.isclose` with tolerances meaningful for the calculation. For money accounting that requires exact decimal rounding, the `decimal` module is available, but it does not turn an uncertain economic estimate into an exact one. Separate numerical representation from model uncertainty.

## 4.3 Collections and iteration

A list stores an ordered sequence: `prices = [100.0, 103.0, 101.0]`. Index zero refers to the first entry, so `prices[0]` is 100.0. A slice `prices[1:]` includes the second entry onward. Negative indices count backward from the end. Indexing is exact bookkeeping: if prices and dates become misaligned, the program may calculate valid arithmetic for the wrong observations.

A `for` loop repeats operations over a collection. The following complete example computes two consecutive returns:

```python
prices = [100.0, 103.0, 101.0]
returns = []
for previous, current in zip(prices[:-1], prices[1:]):
    if previous <= 0.0:
        raise ValueError("Return denominator must be positive")
    returns.append(current / previous - 1.0)
print([round(value, 6) for value in returns])
# [0.03, -0.019417]
```

`zip` pairs corresponding entries from two sequences. The first slice contains 100 and 103; the second contains 103 and 101. Each pair produces one return. Indentation groups the statements belonging to the loop or condition. The error prevents a calculation outside our chosen price-domain assumptions. The final list comprehension creates a presentation-only rounded list; the stored values retain precision.

A dictionary maps keys to values, such as `{"symbol": "SYNTH_A", "currency": "USD"}`. It is useful for metadata and configuration. A tuple is an immutable ordered collection, useful for a fixed pair like `(date, value)`. A set stores unique elements and supports membership checks, useful for detecting repeated identifiers. Choose a collection based on what relationship it represents rather than memorizing syntax in isolation.

## 4.4 Functions make assumptions reusable

A function packages a calculation with named inputs and a returned result. `return` sends a value to the caller; `print` displays text and is not a substitute for returning a result. Pure functions, whose outputs depend only on their inputs and which do not modify external state, are easier to reason about and test.

```python
import math

def simple_returns(prices):
    if len(prices) < 2:
        raise ValueError("At least two prices are required")
    if any(not math.isfinite(p) or p <= 0 for p in prices):
        raise ValueError("Prices must be finite and positive")
    return [b / a - 1.0 for a, b in zip(prices[:-1], prices[1:])]

print(simple_returns([50.0, 55.0, 52.25]))
# Approximately [0.10, -0.05]
```

The import provides established numerical functions. `len` counts entries. `any` checks whether at least one condition is true. `math.isfinite` rejects infinities and missing numeric values represented as NaN. The function's validation matches the mathematical domain. If negative settlement prices are relevant to a different contract, design a different return definition rather than deleting validation without reconsidering the model.

An exception signals that the program cannot fulfill its stated contract. Catch an exception when you can add useful context or recover meaningfully. A broad `except: pass` can hide data corruption. At the boundary of a data pipeline, report the file, row, and rule that failed. Inside a mathematical routine, state the invalid input condition. Clear failures are preferable to plausible-looking incorrect outputs.

## 4.5 Modules, paths, and reproducibility

A module is a Python source file that can define reusable functions. The convention `if __name__ == "__main__":` separates behavior when the file is run as a program from behavior when another file imports it. This keeps an import from unexpectedly executing a full experiment. Small modules with clear responsibilities are easier to audit than one notebook containing years of accumulated state.

Use `pathlib.Path` to construct portable paths. `Path(__file__).resolve().parent` identifies the directory containing a script. A bundled fixture can then be located relative to that directory. When reading CSV files with Python's `csv` module, specify encoding and use `newline=""` as recommended by the module's documentation. Parse dates explicitly rather than trusting ambiguous strings such as `03/04/2025`.

Reproducibility requires more than a random seed. Record input-file hashes, retrieval dates, time zones, package versions, code version, configuration, and the separation between model selection and final evaluation. A seed controls a particular pseudorandom generator's sequence under a particular implementation; it does not guarantee that every parallel computation or future library version reproduces identical bits.

Keep raw input immutable. Write cleaned data to a separate location with a description of transformations. If an analysis excludes missing values, preserve which rows were excluded and why. A repeated run should either reuse a documented snapshot or clearly declare that it retrieved updated data. An output difference can then be traced to data, code, configuration, or random variation.

## 4.6 NumPy: arrays and shapes

NumPy represents homogeneous multidimensional arrays and supplies efficient numerical operations. In a scientific environment with NumPy installed:

```python
import numpy as np

returns = np.array([[0.01, 0.02], [-0.02, 0.00], [0.03, -0.01]])
weights = np.array([0.6, 0.4])
portfolio_returns = returns @ weights
print(portfolio_returns)
# [ 0.014 -0.012  0.014]
```

Rows are dates and columns are assets, so the array has shape `(3, 2)`. The weight vector has length two. Matrix multiplication using `@` produces one portfolio return per row. Elementwise multiplication using `*` has a different meaning. State the data layout before performing an operation; a transposed array can otherwise produce a result with a convincing but wrong interpretation.

An axis identifies the dimension being reduced. `returns.mean(axis=0)` calculates each asset's mean across rows; `axis=1` calculates a mean across assets for each date. The default may flatten all entries, answering neither question. Broadcasting lets compatible dimensions expand in elementwise operations, such as subtracting one mean per column. Broadcasting is useful but can silently accommodate an unintended shape, so inspect shapes at important boundaries.

`np.linalg.lstsq(X, y, rcond=None)` solves least-squares problems without requiring an explicit inverse. Its returned values include the coefficient solution and rank-related information. For a covariance matrix, `np.linalg.eigh` exploits symmetry. Check the relevant installed documentation rather than transferring assumptions from a general eigenvalue routine. Numerical code improves when the software call reflects known mathematical structure.

## 4.7 pandas: labels, missingness, and time alignment

pandas adds labeled one- and two-dimensional structures, Series and DataFrame. Labels help align dates and asset names, but automatic alignment is still a decision that needs inspection. Two Series with different date indices can introduce missing values during arithmetic. That is often preferable to silently pairing the wrong dates, yet it can also conceal an unexpected mismatch unless you check it.

```python
import pandas as pd

prices = pd.Series(
    [100.0, 102.0, 101.0],
    index=pd.to_datetime(["2025-01-02", "2025-01-03", "2025-01-06"]),
    name="synthetic_price",
)
returns = prices.pct_change(fill_method=None)
print(returns.dropna())
```

The first return is missing because no prior price is included. `fill_method=None` makes the missing-data convention explicit. The gap from Friday to Monday is one observed trading interval, not one calendar day. If annualizing, identify whether the observations are daily trading returns, weekly returns, or irregular event intervals. The mere presence of dates does not establish a uniform sampling interval.

Do not forward-fill returns to manufacture observations. Forward-filling a stale price can imply a zero return when the true price is unknown. Whether carrying forward a state variable is justified depends on what it represents and when updates become available. Distinguish “no trade,” “market closed,” “missing record,” and “observed unchanged price.” They are different data-generating situations.

An as-of merge can join each decision timestamp to the most recent information available before it. Direction and exact-match conventions matter. A company's fiscal quarter end is not the date its statements became public. A point-in-time join uses publication timestamps, and sometimes amendment history, so the model sees only information that existed at the decision. This is a statistical validity requirement expressed as a data-engineering operation.

## 4.8 Plotting, numerical libraries, and notebooks

Matplotlib creates plots from arrays and tables. A useful figure names variables, units, sample period, and transformation. Plot cumulative wealth on a scale appropriate to the question; a log vertical axis emphasizes proportional growth, while a linear axis emphasizes dollar changes. Show a benchmark and relevant uncertainty where meaningful. A decorative curve without definitions is not evidence.

SciPy supplies optimization, distributions, integration, and other scientific algorithms. Match the function to the problem and inspect convergence diagnostics. An optimizer returning a vector does not prove it reached a valid optimum. Check feasibility, objective values, gradients or residuals, and sensitivity to initialization when appropriate. Consult [SciPy's tutorials](https://docs.scipy.org/doc/scipy/tutorial/) for the installed version's interface.

scikit-learn provides estimators with consistent `fit` and `predict` methods. Fit learns from training data; predict applies the fitted transformation or model. Pipelines combine preprocessing and estimation so that training-only fitting can be enforced during validation. Financial time ordering still requires an appropriate split. A standard random split can be invalid even when every API call is correct.

Jupyter notebooks combine executable cells, prose, equations, and figures. Their flexibility introduces hidden state: a variable defined in a cell run yesterday may survive after the visible notebook order changes. Before sharing, restart the kernel and run all cells in order. Move reusable core calculations into modules, and use notebooks to explain and inspect them. The final report should be reconstructible from a clean start.

## 4.9 A complete research calculation

Let synthetic prices be 100, 105, 102, 108, and 106. First compute returns 0.05, approximately −0.028571, 0.058824, and −0.018519. Starting from wealth one, repeatedly multiply by gross returns. Wealth becomes 1, 1.05, 1.02, 1.08, and 1.06. This reproduces the normalized price path because there are no dividends or costs in the fixture.

The running peak is 1, 1.05, 1.05, 1.08, and 1.08. Drawdown is current wealth divided by running peak minus one. The worst observed drawdown is approximately −2.8571% at wealth 1.02. The final 1.06 has a smaller drawdown of approximately −1.8519%. Define whether a report presents maximum drawdown as a negative return or a positive loss magnitude; both conventions appear, and mixing them creates sign mistakes.

The standard-library example implements mean, sample variance, covariance, wealth, and drawdown using explicit loops or comprehensions. It then verifies relationships against known small cases. This is a teaching implementation, not a recommendation to replace well-tested scientific libraries for large production datasets. Understanding the calculation makes it possible to use a library critically rather than as a black box.

The next extension is metadata: record whether these are price returns or total returns, the observation interval, currency, and any omitted costs. No annualized Sharpe ratio should be inferred from four unspecified intervals. Annualization is a model assumption, not a formatting switch. Chapter 8 derives when square-root scaling is justified and what changes under serial dependence.

## 4.10 Testing and debugging as research methods

A test should examine a meaningful relationship. Constant positive prices produce zero returns. A single 10% increase produces 0.1. Multiplying all prices by a positive constant leaves simple returns unchanged. A portfolio with all weight in one asset reproduces that asset's return. An option price should respect appropriate bounds under its stated model. Such invariants can expose errors across many inputs.

Tests that merely repeat the implementation's formula can repeat its mistake. Compare with independently derived examples, known limiting cases, or a second method. For a Monte Carlo price, compare a simulated estimate with a closed-form result and a sampling-error interval. For an optimizer, compare against a small problem solved analytically. For a regression, inspect residual orthogonality and a hand-computed fixture.

Debug from the earliest incorrect intermediate state. Print or inspect shapes, date ranges, missing-value counts, and a few known rows before reviewing the final metric. If a cumulative-return plot is implausible, inspect individual returns before changing the plotting code. If a result changes after rerunning a notebook, check hidden state before inventing a market explanation.

Use assertions for internal invariants, and explicit exceptions for invalid external inputs. Assertions may be disabled in some execution modes; they should not be the sole validation of user-supplied data. Log enough context to reproduce a failure without writing credentials or private datasets into public reports. Version control records meaningful source changes; small commits make it easier to identify which change altered an outcome.

### A CSV import with a visible contract

The following complete standard-library example reads an explicitly defined two-column file. It does not guess whether a field contains percentages or dollars. Save a CSV with header `date,price` and rows such as `2025-01-02,100` before using the function. The function is reusable; the call supplies the path to your own fixture.

```python
import csv
import math
from datetime import date
from pathlib import Path

def read_prices(path):
    observations = []
    seen = set()
    with Path(path).open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        if reader.fieldnames != ["date", "price"]:
            raise ValueError("Expected exactly: date,price")
        for row_number, row in enumerate(reader, start=2):
            try:
                day = date.fromisoformat(row["date"])
                price = float(row["price"])
            except (ValueError, TypeError) as error:
                raise ValueError(f"Invalid data at row {row_number}") from error
            if day in seen:
                raise ValueError(f"Duplicate date at row {row_number}")
            if not math.isfinite(price) or price <= 0:
                raise ValueError(f"Invalid price at row {row_number}")
            if observations and day <= observations[-1][0]:
                raise ValueError("Dates must be strictly increasing")
            seen.add(day)
            observations.append((day, price))
    if len(observations) < 2:
        raise ValueError("Need at least two observations")
    return observations
```

`DictReader` uses the header to label fields. `enumerate` supplies a human-readable row number beginning after the header. `fromisoformat` accepts an unambiguous year-month-day format. The set catches duplicate dates; the final comparison catches unsorted dates. We reject rather than silently sort because unexpected ordering can indicate a bad upstream export. A different pipeline may intentionally sort, but that transformation should be recorded.

### Mutability can alter an experiment unexpectedly

Lists are mutable. Assigning `second = first` does not copy a list; both names refer to the same object. If `second.append(5)` is executed, inspecting `first` reveals the added element too. Use `first.copy()` for a shallow copy when independent outer lists are intended. Nested mutable objects require additional care because a shallow copy still shares the nested elements.

This matters when testing variants. If one model modifies a shared feature table in place, the next model may receive altered inputs even though the notebook appears to reuse the original variable. Prefer functions that return new transformed data or document in-place changes clearly. Keep raw fixtures separate, and test that a calculation does not mutate its inputs unless mutation is part of its contract.

### Record a compact experiment manifest

A useful manifest can be a JSON file containing a dataset hash, seed, feature cutoff, split dates, parameter values, and output names. JSON stores structured values without depending on the state of a notebook. Hash a file using `hashlib.sha256(path.read_bytes()).hexdigest()` for small fixtures; for large files, read in chunks. A hash identifies content, not its correctness or licensing.

When a result changes, compare manifests before changing the statistical explanation. Was the input revised? Did a package version change? Did the training cutoff move? Did a random seed or cost assumption change? This workflow converts “the result looks different” into a sequence of answerable questions. It also prepares a collaborator to reproduce the study without access to your memory.

### A clean execution is a reproducibility test

Run the bundled example from a new terminal and compare its JSON output with the recorded reference. Then run the tests with `python -m unittest discover -s tests -v` from the course folder. A test pass establishes the listed cases; it does not certify every future dataset. Keep the command and runtime version in your own project report.

If the program cannot find Python, resolve the installation or command name before changing source code. If it cannot find a file, inspect the working directory and path construction. If imports fail, inspect the selected interpreter and environment. These are different failure classes, and changing statistical formulas cannot repair them. Treat setup instructions as executable documentation that another learner should be able to follow.

A file hash changes when file bytes change, including line endings or formatting. Two economically equivalent CSV exports can therefore have different hashes. Preserve the original file and document parsing choices; use the hash to identify the exact input, not to decide whether two datasets mean the same thing.

## 4.11 Performance, ethics of evidence, and further practice

Optimize after measuring. A vectorized array operation can be much faster than a Python loop on large numeric data, but speed is irrelevant if dates are misaligned. Algorithms matter too: recomputing a full historical covariance matrix for every date can be far more expensive than updating sufficient statistics. First make the procedure correct and inspectable, then profile the slow stages.

Separate a result from its interpretation. “The code ran” establishes execution; “the calculation matches a known example” establishes a narrow correctness check; “the strategy predicts unseen returns” requires independent evidence. A synthetic demonstration can teach a method without supporting any claim about a live market. Label it accordingly in notebook titles, chart captions, and project reports.

Suggested applications: add dividend cash flows to the return function; reject unsorted or repeated timestamps; write a CSV reader that reports malformed rows; compare a hand-coded covariance with NumPy on the same data; build a notebook that restarts and runs cleanly; record a file hash before analysis. Hints and project guidance appear in the final chapter, while the bundled examples provide reference implementations for core calculations.

Primary references are the [Python 3.12 tutorial](https://docs.python.org/3.12/tutorial/), [NumPy beginner guide](https://numpy.org/doc/stable/user/absolute_beginners.html), [pandas introductory tutorials](https://pandas.pydata.org/docs/getting_started/intro_tutorials/), [Matplotlib tutorials](https://matplotlib.org/stable/tutorials/index.html), [Jupyter installation guide](https://jupyter.org/install), and [scikit-learn cross-validation documentation](https://scikit-learn.org/stable/modules/cross_validation.html). The official Python tutorial assumes some programming familiarity; this chapter supplies the earlier bridge. Historical course assignments may use R or MATLAB; learn their mathematical objective first and use the included Python examples to practice the corresponding ideas.

You now have a way to express a model, execute it, inspect intermediate values, and preserve the evidence. The next chapter introduces uncertainty. Its probability calculations will use the same habits: explicit inputs, defined domains, units, and checks against simple cases.


<a id="chapter-05"></a>

# 5. Probability and random variables

## 5.1 Uncertainty needs a specified experiment

Suppose a position gains 20 dollars in one scenario and loses 10 in another. Is it attractive? We cannot answer without describing the scenario probabilities, the money committed, the investor's preferences, and the possibility that the scenario model is incomplete. Probability supplies a language for weighting outcomes. It does not discover the correct weights by definition. In a fair coin experiment, symmetry may justify equal weights; in financial forecasting, weights must be estimated, assumed, or inferred under a model.

A probability model consists of a sample space, a collection of events, and a probability assignment. The sample space Omega contains possible outcomes. An event is a set of outcomes to which the model assigns probability. A probability measure P assigns values between zero and one, gives the full sample space probability one, and is countably additive over disjoint events. Countable additivity means the probability of a union of disjoint events equals the sum of their probabilities, even for a countably infinite collection.

For one fair six-sided die, Omega = {1, 2, 3, 4, 5, 6}; each singleton has probability 1/6. The event “even” has probability 3/6. For a continuous price model, Omega can be much larger, and the chosen event collection, called a sigma-algebra, is required to contain complements and countable unions. The purpose is to make probability operations coherent. We do not need advanced measure theory to compute the examples, but stating the structure prepares us for information sets in stochastic processes.

An event's complement has probability 1 − P(A). If A and B overlap, P(A union B) = P(A) + P(B) − P(A intersection B). The subtraction prevents counting the overlap twice. A table or Venn diagram can help, but the identity follows by partitioning the events into disjoint pieces. This small argument is a model of probability reasoning: identify disjoint cases, assign weights, and add.

## 5.2 Counting is useful when outcomes are equally likely

If a finite experiment has equally likely outcomes, an event's probability is its count divided by the total count. “Equally likely” is an assumption, not a consequence of writing a list. For two fair independent coins, the four ordered outcomes HH, HT, TH, TT each have probability 1/4. The three unordered categories “zero, one, two heads” are not equally likely: their probabilities are 1/4, 1/2, and 1/4.

The multiplication rule for counting says that if one stage has m options and the next has n options for every first-stage choice, there are mn ordered possibilities. A permutation of n distinct objects has n! arrangements, where n! = n(n − 1)…1. A combination selecting k objects without order has count n!/[k!(n − k)!]. Division by k! removes the orderings of the selected objects; division by (n − k)! removes orderings of those not selected.

Choosing two assets from four gives six unordered pairs. Choosing a first and second asset gives twelve ordered pairs. Which count applies depends on whether roles differ. Counting errors often come from switching between ordered and unordered descriptions halfway through a calculation. Write one concrete outcome before writing a factorial formula.

Sampling without replacement creates dependence. If a box contains three red and two blue balls, the probability of two reds without replacement is (3/5)(2/4) = 3/10. With replacement it is (3/5)² = 9/25. The first draw changes the second draw's distribution only in the first experiment. The language “independent observations” therefore describes a substantive sampling assumption.

## 5.3 Conditioning updates the relevant population

For P(B) > 0, conditional probability is P(A given B) = P(A intersection B)/P(B). Conditioning restricts attention to B and renormalizes its probability to one. It does not by itself express causation. The probability of carrying an umbrella given rain differs from the effect of making someone carry an umbrella on the weather.

Imagine 1,000 hypothetical events. A signal is associated with a genuine opportunity in 10 of them. It fires for eight of those ten and for 99 of the other 990. Among the 107 signal firings, only eight correspond to genuine opportunities. Thus the probability of an opportunity given a firing is 8/107, approximately 7.48%, even though the signal's sensitivity is 80%. Low base rates can dominate an apparently impressive detector.

Bayes' rule follows by writing the same joint probability in two orders:

$$P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)},\qquad P(B)>0.$$

If cases A_i partition the sample space, the denominator is sum P(B given A_i)P(A_i), the law of total probability. In the signal example it is 0.8 × 0.01 + 0.1 × 0.99 = 0.107. Bayes' rule is ordinary probability bookkeeping. Bayesian statistical inference later treats unknown parameters within a probability model and uses the same identity.

Independence of events means P(A intersection B) = P(A)P(B). When P(B) > 0 this is equivalent to P(A given B) = P(A). Pairwise independence of several events does not guarantee joint independence. For two fair coin bits X and Y and their exclusive-or Z, each pair is independent, yet knowing X and Y determines Z. This counterexample explains why assumptions about an entire collection cannot always be checked one pair at a time.

## 5.4 Random variables describe measurable outcomes

A random variable X assigns a number to each outcome in a way compatible with the event collection. For a die, X might be the face value or a payoff such as 10 if the face is six and −2 otherwise. Different random variables can describe the same underlying experiment. “Random” refers to uncertain outcome selection under the model, not to a variable changing mysteriously without a defined experiment.

The cumulative distribution function F(x) = P(X ≤ x) describes the entire one-dimensional distribution. It is nondecreasing, tends to zero at negative infinity and one at positive infinity, and is right-continuous. A discrete variable has probability masses p(x) = P(X = x). A continuous variable with density f has interval probabilities obtained by integrating f. Some distributions mix discrete masses and continuous components.

For a uniform variable on [0, 1], density is one inside the interval and zero outside. The probability of [0.2, 0.5] is 0.3. Each exact point has probability zero, but the variable must take some value. There is no contradiction: countable additivity concerns countable unions, whereas the interval contains uncountably many points. A zero probability event is not always logically impossible in a continuous model.

A quantile at level alpha is commonly defined as inf{x: F(x) ≥ alpha}. This definition handles jumps and nonunique inverses. A median is a 0.5 quantile. Quantile conventions in finite samples can differ because interpolation is a software choice. When comparing risk metrics, match the mathematical definition and the empirical implementation.

## 5.5 Expectation and variance from weighted sums

For a discrete variable, expectation is E[X] = sum x p(x), when the relevant integrability condition holds. For a density, it is integral x f(x)dx. Expectation is a probability-weighted average, not necessarily a possible realized value. A fair die has expectation 3.5 although it never lands on 3.5.

For a payoff +20 with probability 0.4 and −10 with probability 0.6, expected payoff is 8 − 6 = 2 dollars. The deviations from the mean are 18 and −12. Variance is the weighted mean squared deviation: 0.4 × 18² + 0.6 × 12² = 216 dollars squared. Standard deviation is sqrt(216), approximately 14.697 dollars. Positive expected payoff coexists with substantial loss probability.

Linearity gives E[aX + bY] = aE[X] + bE[Y] for integrable variables, whether or not they are independent. Variance behaves differently:

$$\operatorname{Var}(aX+bY)=a^2\operatorname{Var}(X)+b^2\operatorname{Var}(Y)+2ab\operatorname{Cov}(X,Y).$$

Covariance is E[(X − E[X])(Y − E[Y])]. Independence implies zero covariance when the moments exist, but zero covariance need not imply independence. If X is uniform on [−1, 1] and Y = X², symmetry gives E[X] = E[X³] = 0, hence covariance zero. Yet Y is completely determined by X. Linear association misses this nonlinear dependence.

Correlation divides covariance by the product of positive standard deviations. It is dimensionless and lies between −1 and 1 by Cauchy–Schwarz. If a variance is zero, the usual correlation is undefined. Changing a variable's unit by a positive factor does not change correlation, but it changes covariance. Neither correlation nor covariance fully specifies a joint distribution except in special distribution families.

## 5.6 Common distributions and their mechanisms

A Bernoulli variable is one with success probability p and zero otherwise. Its expectation is p and variance p(1 − p). A sum of n independent identically distributed Bernoulli variables is binomial, with mean np and variance np(1 − p). The binomial probability of k successes is the combination count times p^k(1 − p)^(n−k). The count handles which trials succeed; independence supplies the product probability.

A Poisson variable counts events under a specified arrival model and has probability e^(−lambda)lambda^k/k! for nonnegative integer k. Its mean and variance are lambda. A constant-rate Poisson process additionally assumes independent increments and Poisson counts proportional to interval length. Market events can cluster, so equal mean and variance or independent increments should be tested rather than assumed because the formula is convenient.

An exponential waiting time with rate lambda > 0 has survival probability P(T > t) = e^(−lambda t) for t ≥ 0 and mean 1/lambda. Its memoryless property follows from P(T > s + t given T > s) = e^(−lambda t). This is a special structural assumption. A waiting-time distribution can have the same mean without being memoryless.

A normal variable with mean mu and variance sigma² has density proportional to exp[−(x − mu)²/(2sigma²)]. Standardization Z = (X − mu)/sigma gives mean zero and variance one. Normal models are useful for sums, approximation, and conditional calculations. They assign positive probability to arbitrarily extreme positive and negative values; using them for quantities constrained to be positive needs care.

If log X is normal, X is lognormal and positive. If log X has mean m and variance s², E[X] = exp(m + s²/2). Exponentiating the mean log value alone gives the median exp(m), not the mean. This difference reflects convexity: rare large positive values pull the arithmetic mean upward. The relationship will reappear in geometric Brownian motion.

A Student t distribution has heavier tails than a normal distribution. For degrees of freedom nu, its mean exists for nu > 1 and variance for nu > 2; a familiar “center” parameter can exist even when a finite expectation does not. Moment existence is an assumption worth checking. If a model has infinite variance, procedures justified by finite-variance theory may fail even when a finite dataset produces a numerical sample variance.

## 5.7 Joint distributions and conditional expectation

A joint distribution gives probabilities for combinations of variable values. Marginalization sums or integrates out unwanted coordinates. For a two-variable density f(x, y), the marginal density of X is integral f(x, y)dy. Where the marginal is positive, the conditional density of Y given X = x is f(x, y)/f_X(x). This is the continuous counterpart of the conditional-probability ratio.

Conditional expectation E[Y given X] is a function of X giving the probability-weighted mean of Y in each information state. Suppose X labels two regimes: calm with probability 0.75 and stressed with probability 0.25. If mean payoff is 2 in calm and −4 in stressed, total expectation is 0.75 × 2 + 0.25 × (−4) = 0.5. This is the tower property: E[E[Y given X]] = E[Y].

The law of total variance separates within-state and between-state uncertainty:

$$\operatorname{Var}(Y)=E[\operatorname{Var}(Y\mid X)]+\operatorname{Var}(E[Y\mid X]).$$

To see why, write Y − E[Y] as [Y − E[Y given X]] + [E[Y given X] − E[Y]]. Squaring creates two squared terms and a cross term. The cross term has expectation zero because the first bracket has conditional mean zero given X. The identity explains why ignoring changes in regime means can understate total uncertainty.

Conditional expectation also gives the best squared-error prediction based on available information. For any candidate g(X), decompose Y − g(X) into Y − E[Y given X] plus E[Y given X] − g(X). The same orthogonality argument shows its mean squared error equals an irreducible term plus E[(E[Y given X] − g(X))²]. The latter is minimized at zero. Linear regression finds a best prediction within linear functions; conditional expectation permits all integrable functions with the required square moments.

## 5.8 Convergence, large numbers, and the central limit theorem

For independent identically distributed variables with finite mean, a law of large numbers states that their sample mean approaches the population mean under appropriate formulations. With finite variance sigma², the sample-mean variance is sigma²/n. Chebyshev's inequality gives P(|sample mean − mu| ≥ epsilon) ≤ sigma²/(n epsilon²). Thus averaging reduces uncertainty, but ten times greater precision requires roughly one hundred times as many independent observations.

The central limit theorem gives a distributional approximation: sqrt(n)(sample mean − mu)/sigma approaches a standard normal distribution under the familiar independent identically distributed finite-variance conditions. It does not say the original observations become normal, and it does not provide a universal sample size at which approximation is excellent. Skewness, heavy tails, dependence, and the tail probability being estimated all affect accuracy.

Convergence in probability means the probability of a deviation larger than any fixed positive tolerance tends to zero. Convergence in distribution concerns limiting cumulative probabilities at continuity points. Almost-sure convergence is stronger in a different sense: the pathwise convergence holds outside a probability-zero exceptional set. We will name the mode of convergence when it matters, particularly for quadratic variation and estimator theory.

Financial observations often violate independence. For a stationary sequence with autocovariance gamma(k), the variance of the sample mean is [n gamma(0) + 2 sum from k = 1 to n−1 of (n − k)gamma(k)]/n². Positive serial covariance can make uncertainty much larger than sigma²/n. Chapters 9 and 10 develop estimators that account for such dependence.

## 5.9 Bounds and nonlinear expectations

Markov's inequality states that for nonnegative X and a > 0, P(X ≥ a) ≤ E[X]/a. It follows because X is at least a on the event X ≥ a, so E[X] ≥ aP(X ≥ a). Applying it to (X − mu)² gives Chebyshev's inequality. These bounds may be loose, but they require much less distributional knowledge than a normal approximation.

Jensen's inequality states that for a convex function phi and an integrable variable under suitable expectation conditions, phi(E[X]) ≤ E[phi(X)]. Convexity means the graph lies below chords. For phi(x) = x², this becomes (E[X])² ≤ E[X²], equivalent to nonnegative variance. For phi(x) = e^x, it explains why exponentiating an average log return differs from averaging gross returns.

For concave ln on positive wealth, E[ln W] ≤ ln E[W]. This does not mean every investor should optimize expected log wealth; it identifies a mathematical relationship and a particular utility criterion. A gamble can raise expected wealth while reducing expected log wealth. For equal-probability gross wealth 0.5 and 1.5, expected gross wealth is one, while expected log wealth is one half ln(0.75), which is negative.

Tail dependence asks whether extremes occur together, a question correlation alone may not answer. Two joint distributions can share marginals and correlation while assigning different probabilities to simultaneous large losses. A copula is a representation of dependence separated from marginal distributions. At this stage, understand the modeling purpose; estimating a complex dependence model requires more data than fitting two means and a correlation, and its tail behavior can be weakly identified.

## 5.10 Simulation is probability made executable

A pseudorandom generator deterministically produces a sequence designed to mimic selected random properties. A seed makes a teaching experiment repeatable. To generate a Bernoulli variable from a uniform U on [0, 1), return one if U < p and zero otherwise. The interval below p has length p, so the generated success probability matches the requested value under the uniform idealization.

Inverse-transform sampling uses X = F^(−1)(U) with a suitable generalized inverse. For an exponential variable, solving u = 1 − e^(−lambda x) gives x = −ln(1 − u)/lambda. Special care near u = 1 avoids numerical issues. Normal generators use specialized algorithms rather than a simple elementary inverse. Prefer established library generators unless implementing one is itself the lesson.

A Monte Carlo estimate of E[g(X)] averages independent generated values g(X_i). If their variance is finite, estimated standard error is sample standard deviation divided by sqrt(n). The output should include the estimate, number of draws, standard error, seed, and sampling model. A small Monte Carlo standard error says little about whether the model for X resembles the market. Simulation error and model error are separate.

In the sampling laboratory, increase the number of draws and inspect the distribution of sample means. The plotted concentration illustrates the law of large numbers, while repeated sample means illustrate sampling distributions. A single sample's mean need not move monotonically toward the truth as you add observations. Convergence is a probabilistic statement, not a promise that every additional draw improves the realized estimate.

### Transformations need a change-of-variable factor

If X has a density and Y = g(X) is a differentiable strictly monotone transformation, probability conservation gives f_Y(y) = f_X(g_inverse(y)) times the absolute derivative of g_inverse(y). The derivative adjusts for how the transformation stretches intervals. Without it, the transformed density usually fails to integrate to one.

For X uniform on [0, 1] and Y = X², P(Y ≤ y) = P(X ≤ sqrt(y)) = sqrt(y) for y in [0, 1]. Differentiating gives density 1/(2sqrt(y)) on the open interval. The density becomes large near zero because squaring compresses many small X intervals into even smaller Y intervals. Its integral is still one. A density height exceeding one is therefore perfectly possible; probabilities are areas, not heights.

For a normal log price Z and S = exp(Z), the inverse is ln(S) and its derivative is 1/S. The lognormal density includes this 1/S factor. This is the continuous counterpart of carefully tracking units when changing variables. For nonmonotone transformations such as squaring a variable on all real numbers, several inverse branches can contribute and their densities must be added.

### Conditional independence is different from marginal independence

Suppose a hidden regime determines both trading volume and volatility. Conditional on the regime, the two variables might be independent, yet marginally they can move together because the regime shifts both. Conversely, conditioning on a variable influenced by two otherwise independent causes can create association between those causes. A joint-probability table can demonstrate both effects.

For a numerical example, let calm and stressed regimes each have probability one half. In calm, independent binary indicators A and B each equal one with probability 0.1; in stress, each equals one with probability 0.9. Marginal probabilities are both 0.5, but P(A = 1, B = 1) = 0.5 × 0.01 + 0.5 × 0.81 = 0.41, far above 0.25. The variables are conditionally independent within regimes and strongly associated overall.

This example explains why a dependence estimate can reflect common latent conditions. It also shows why stratifying a dataset changes the question. A model conditioned on an observable regime needs a rule for identifying that regime at decision time. Using a regime label assigned retrospectively can introduce future information.

### A tail probability is not a worst-case bound

Saying a loss exceeds 10 with probability 1% under a model does not cap the loss at 10. The remaining tail may contain much larger outcomes. A finite sample with no such event does not show the probability is zero. For independent trials with event probability p, the probability of observing no events in n trials is (1 − p)^n. With p = 0.01 and n = 100, it is about 36.6%.

Rare-event evidence is intrinsically limited. Before interpreting a tail estimate, inspect the number of effectively independent tail observations and the model's extrapolation beyond them. A smooth fitted distribution can produce precise-looking extreme quantiles from little information. Probability calculus makes the conditional calculation valid; it does not supply missing empirical support for the tail model.

### Expected loss and event probability are different summaries

Two positions can each lose money with probability 10% while having very different expected losses. One may lose one dollar in that event and the other one hundred. Conversely, a position with frequent small losses can have a positive expected payoff because of occasional large gains. Write both the event and its magnitude distribution before comparing risks.

This distinction also applies to classifier errors: a false-positive rate counts events, while decision loss weights their consequences. Probability supplies weights; a loss function supplies the cost of each outcome. Neither can be inferred from the other without additional assumptions.

## 5.11 Guided applications and sources

Suggested applications: compute the expected payoff and variance of a three-scenario position; use Bayes' rule for a signal with a 2% base rate, 70% sensitivity, and 5% false-positive rate; construct dependent uncorrelated variables; compare standard errors for independent and positively autocorrelated observations; explain why the average of simulated outcomes can be accurate under the wrong model. Hints: build a joint-probability table before conditioning; use a symmetric X and Y = X²; expand the variance of a sum rather than assuming covariance terms vanish.

For full foundational lectures, [Harvard Statistics 110](https://stat110.hsites.harvard.edu/) provides a legitimate free probability path and links to the authors' online book and practice materials. [MIT 18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) supplies probability lectures connected to finance, while its [2013 predecessor](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/) supplies additional recordings. These resources complement one another; the embedded probability segment of a finance course is not a complete substitute for sustained foundational practice.

The next chapter reverses the direction of the question. Probability starts with a model and asks what data it might generate. Statistical inference starts with data and asks what claims about a model are justified. Keeping those directions distinct prevents an estimated parameter from being mistaken for a known truth.


<a id="chapter-06"></a>

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



# Part: Financial economics

<a id="chapter-07"></a>

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


<a id="chapter-08"></a>

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



# Part: Empirical methods

<a id="chapter-09"></a>

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


<a id="chapter-10"></a>

# 10. Time series, forecasting, and volatility

## 10.1 Time order changes the statistical problem

A time series is a sequence indexed by time. Rearranging observations generally changes what can be learned because past and future play different roles. A forecast at time t must be a function of information available then. A model trained using a later revised value, a future normalization constant, or tomorrow's realized volatility is not performing the historical forecasting task it claims to perform.

We distinguish a stochastic process, a collection of random variables defined under a model, from one observed realization of that process. A long price history is one path, not a collection of independent parallel market histories. Estimation from that path needs assumptions linking behavior across time. Stationarity and ergodicity are two central examples, and neither should be silently inferred from a smooth plot.

This chapter develops univariate dependence, forecasting, spectral ideas, and volatility. [MIT 14.384 Time Series Analysis](https://ocw.mit.edu/courses/14-384-time-series-analysis-fall-2013/) contains these topics and the multivariate and Bayesian extensions in Chapter 11. [MIT 15.450](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/) adds finance-specific estimation and volatility applications.

## 10.2 Stationarity, autocovariance, and information

Strict stationarity means that shifting every time index by the same amount leaves every finite joint distribution unchanged. Weak or covariance stationarity requires a constant finite mean and a covariance depending only on time separation. Strict stationarity with finite second moments implies weak stationarity; weak stationarity need not imply unchanged higher-order distributions. For a Gaussian process, means and covariances determine finite distributions, creating a special connection.

For a weakly stationary process X_t with mean mu, autocovariance at lag k is gamma(k) = E[(X_t − mu)(X_(t−k) − mu)]. Autocorrelation is rho(k) = gamma(k)/gamma(0) when variance is positive. A sample autocorrelation estimates this relationship but has sampling uncertainty and can be distorted by trends, seasonality, outliers, and changing variance.

White noise has mean zero, constant finite variance, and zero autocovariance at nonzero lags. Some definitions additionally require independence; we will say “independent white noise” when that stronger property is needed. A process can be uncorrelated over time but dependent through its variance. Financial returns often motivate exactly that distinction.

Ergodic reasoning allows time averages from one path to estimate population expectations under appropriate conditions. Stationarity alone does not guarantee this. For example, choose a random constant C once and set X_t = C for all t. The process is stationary, but a path's average remains C rather than converging to E[C]. Persistent hidden heterogeneity can defeat naive averaging even without changing marginal distributions.

## 10.3 Autoregression as a conditional updating rule

An AR(1) model is X_t − mu = phi(X_(t−1) − mu) + epsilon_t, with innovations satisfying specified mean and dependence conditions. If |phi| < 1 and innovations are independent with variance sigma_e², the stationary solution is an infinite weighted sum of past innovations: X_t − mu = sum from j = 0 to infinity of phi^j epsilon_(t−j). The geometric weights decay, making the sum well behaved in mean square.

Taking variances gives gamma(0) = phi²gamma(0) + sigma_e², so gamma(0) = sigma_e²/(1 − phi²). Autocovariance at lag k is phi^|k| gamma(0). A positive phi produces persistence; a negative phi produces alternating correlations. The condition |phi| < 1 is essential. At phi = 1, the formula divides by zero because the stationary finite-variance solution no longer exists under the same assumptions.

With phi = 0.8 and innovation standard deviation 0.6, stationary variance is 0.36/0.36 = 1. If the current deviation from the mean is two, the one-step conditional mean deviation is 1.6 and the two-step deviation is 1.28. The h-step forecast is mu + phi^h(X_t − mu). Its error accumulates future innovations with variance sigma_e² sum from j = 0 to h−1 of phi^(2j), approaching unconditional variance as the horizon grows.

Estimate phi by regression of X_t on its lag with an intercept when the mean is unknown. Use only available lags and retain the original time order. Small samples, high persistence, model selection, and structural changes can make ordinary asymptotic inference unreliable. A fitted phi near one should motivate a unit-root and break analysis rather than automatic mean-reversion trading.

## 10.4 Moving averages, ARMA, and lag polynomials

An MA(1) model is X_t = epsilon_t + theta epsilon_(t−1). Its variance is sigma_e²(1 + theta²), lag-one covariance theta sigma_e², and higher-lag covariances zero under independent innovations. A short autocovariance pattern can therefore arise even though the series is a function of current and past shocks. The model's order refers to innovation lags, not the moving average used to smooth a price chart.

An ARMA(p, q) model combines autoregressive and moving-average terms. The lag operator L shifts a series back one period: LX_t = X_(t−1). Write phi(L)X_t = theta(L)epsilon_t after handling the mean, where phi(L) = 1 − phi1L − … − phipL^p. Stationarity of a causal AR representation requires roots of phi(z) outside the unit circle under the standard convention. Invertibility requires the analogous condition for the MA polynomial, allowing innovations to be recovered from current and past observations.

Root conventions can confuse beginners. For AR(1), the polynomial is 1 − phi z, whose root is 1/phi. A root outside the unit circle corresponds to |phi| < 1. Saying merely “the roots must be less than one” without defining the polynomial reverses the criterion. Always write the polynomial before applying a root rule.

Forecasting an ARMA model requires estimates of recent innovations as well as observed lags. Conditional likelihood, exact likelihood, and state-space methods use different initial-condition treatments. Diagnostic residuals should resemble the modeled innovations in the relevant respects. Zero sample autocorrelation at a few lags is encouraging but does not prove independence or correct tail behavior.

## 10.5 Trends, differencing, and forecast targets

A deterministic trend model writes X_t = a + bt + stationary disturbance. A random walk writes X_t = X_(t−1) + epsilon_t, possibly with drift. Both can produce trending-looking paths, but shocks have different persistence. In the deterministic-trend model, shocks decay relative to the trend under the disturbance assumptions. In a random walk, a shock permanently changes the level.

Differencing uses delta X_t = X_t − X_(t−1). It turns a random walk with drift into a stationary innovation-plus-drift series under the model. Differencing a trend-stationary process unnecessarily can introduce a moving-average structure and discard useful long-run information. Transformation should follow a considered model, not a universal instruction to difference everything until a plot looks flat.

Financial prices and returns answer different questions. A level forecast may be dominated by persistence and score well relative to a poor baseline while offering little economic information. Compare price forecasts with a random-walk baseline and return forecasts with appropriate mean or zero baselines. A high R-squared for price levels can coexist with negligible ability to forecast changes.

For realized-volatility prediction, define the target window before fitting. If tomorrow-to-next-week volatility uses returns through t + 5, then adjacent labels overlap. Validation must prevent training labels from reaching into validation periods, and standard errors must account for dependence. Target construction is part of the statistical model, not merely preprocessing.

## 10.6 Long-run variance, HAC, and dependence-aware inference

For a stationary mean-zero series, the variance of the sample sum includes all autocovariance terms. Under suitable summability and limit conditions, n times the sample-mean variance tends to Omega = gamma(0) + 2 sum from k = 1 to infinity of gamma(k). This long-run variance replaces the single-observation variance in a central limit theorem for the mean.

For an AR(1) with |phi| < 1, summing the geometric autocovariances gives Omega = gamma(0)(1 + phi)/(1 − phi) = sigma_e²/(1 − phi)². If phi = 0.8, the long-run variance is nine times the unconditional variance. Treating the observations as independent would substantially understate mean uncertainty. The effective amount of information depends on dependence, not only the row count.

A HAC estimate truncates and weights sample autocovariances: Omega_hat = gamma_hat(0) + 2 sum from k = 1 to K of w_k gamma_hat(k). Bartlett weights use w_k = 1 − k/(K + 1). A larger bandwidth includes more dependence but adds noisy covariance estimates. Asymptotic justification typically lets K grow while remaining small relative to sample size under suitable conditions. A fixed convenient bandwidth is not a universal solution.

In regression, apply the same idea to score contributions such as x_t u_t, producing a sandwich covariance. The relevant dependence is in the estimating equations, not necessarily only in raw outcomes. A predictor can interact with errors so that residual autocorrelation checks alone miss aspects of uncertainty.

## 10.7 Frequency-domain analysis

Time-domain autocovariances and frequency-domain spectra are alternative descriptions of second-order stationary dependence. Under appropriate summability, spectral density is f(omega) = [gamma(0) + 2 sum from k = 1 to infinity of gamma(k)cos(k omega)]/(2pi), for angular frequency omega in [−pi, pi]. Integrating the spectrum over the frequency range recovers variance.

The spectrum shows how variance is distributed across oscillatory components. Low-frequency concentration corresponds to slow persistent movements; a peak at a nonzero frequency can indicate repeated oscillation. The description is second-order and does not by itself identify an economic mechanism or guarantee a tradable cycle. A short sample can create noisy apparent peaks.

For white noise with variance sigma², f(omega) = sigma²/(2pi), flat across frequencies. For an AR(1), f(omega) = sigma_e²/[2pi(1 + phi² − 2phi cos omega)]. When phi is positive and near one, the denominator is small near zero, concentrating power at low frequencies. This is the frequency counterpart of slowly decaying autocorrelation.

The periodogram is a squared magnitude of a discrete Fourier transform with a stated normalization. Individual periodogram ordinates remain noisy; smoothing or averaging can produce consistent spectral estimators under suitable conditions. Windowing, detrending, frequency resolution, and sampling interval affect interpretation. Frequencies above the sampling limit can alias into lower frequencies, so a daily dataset cannot resolve arbitrary intraday cycles.

At frequency zero, 2pi f(0) equals long-run variance under this normalization. This connects spectral estimation to HAC standard errors. A method that seems like a separate signal-processing topic is therefore another way of estimating the uncertainty of a time average.

## 10.8 Volatility is conditional uncertainty

A return can have nearly zero predictable mean while its variance is strongly predictable. Write r_t = mu_t + epsilon_t, with epsilon_t = sigma_t z_t, where z_t has conditional mean zero and conditional variance one. Then sigma_t² is the conditional variance given the past. If sigma_t changes persistently, absolute or squared returns can be autocorrelated even when raw returns are not.

Historical sample volatility estimates a spread over a chosen past window. A rolling estimator recomputes it on a moving window; its result depends on window length and treatment of the mean. An exponentially weighted estimator updates h_t = lambda h_(t−1) + (1 − lambda)epsilon_(t−1)² for lambda between zero and one, using information available before r_t. Larger lambda gives longer memory. Specify initialization and whether the current return enters the forecast for today or tomorrow.

A GARCH(1,1) model uses h_t = omega + alpha epsilon_(t−1)² + beta h_(t−1). With omega > 0 and alpha, beta nonnegative, conditional variances remain nonnegative. Under a standard finite-second-moment setup with alpha + beta < 1, unconditional variance is omega/(1 − alpha − beta). Additional moment and stationarity questions depend on the innovation distribution and parameters; the simple sum condition is not the complete theory of every GARCH property.

For omega = 0.000002, alpha = 0.08, beta = 0.90, unconditional daily variance is 0.0001, giving daily standard deviation 1%. A large squared shock raises the next conditional variance, which decays toward the long-run level under the model. Near-unit persistence makes long-run variance estimates sensitive to parameters. Heavy-tailed innovation choices can better represent tails but introduce their own estimation and moment conditions.

## 10.9 Volatility forecast evaluation

Conditional variance is latent; a realized squared return is a noisy proxy. Comparing forecasts using one proxy and one loss function can yield different rankings from another defensible choice. Mean squared error on squared returns is easy to compute but sensitive to extreme observations. QLIKE-type variance losses use a ratio and logarithm structure under specified conditions. Define the target, proxy, and loss rather than announcing one model “best” without context.

Realized variance sums high-frequency squared returns under a continuous-price approximation, but microstructure noise, jumps, irregular sampling, and market closures complicate it. More frequent sampling does not always improve an estimator because measurement noise can dominate at very short intervals. This is an example of a general principle: more data points do not necessarily mean more independent or cleaner information.

Implied volatility is the volatility parameter that matches an observed option price in a specified pricing model. It is neither the same as historical realized volatility nor automatically a physical expectation of future volatility. Risk premia, payoff weighting, and model assumptions affect the relationship. Chapter 14 treats the inversion and its bounds.

## 10.10 Model selection and walk-forward evaluation

Information criteria balance fit and complexity. AIC uses −2 log likelihood + 2k, while BIC uses −2 log likelihood + k ln n, under their respective motivations and regularity assumptions. The parameter count and likelihood convention must be comparable across candidates. These criteria are not substitutes for forecasting evaluation when the goal is future predictive performance under changing conditions.

A rolling-origin evaluation repeatedly fits using observations available through a cutoff, predicts the next specified horizon, records the error, then advances the cutoff. An expanding window uses all earlier data; a rolling window discards older data. Expanding windows reduce estimation variance under stable models; rolling windows may adapt faster to changes but use less information. Choose the design based on the research question and inspect sensitivity.

Forecast comparisons need dependence-aware uncertainty, especially for overlapping horizons. A lower average loss can reflect noise. Formal predictive-accuracy tests have assumptions about the loss-difference process and model-estimation effects. Report the loss difference and uncertainty alongside any test. Avoid selecting a window after examining the final test period.

## 10.11 A complete volatility study

Use a fixed synthetic return fixture first to verify timing. For each date, compute the variance forecast using only earlier residuals; then compare it with the next realized squared return. Initialize EWMA from a training variance and state the initialization cutoff. A common error updates h_t with r_t and then scores it as a forecast of r_t, leaking the target into the prediction.

Compare constant training variance, rolling variance, and EWMA before adding GARCH. Keep the same evaluation dates and losses for all methods. Report whether zero or missing returns represent genuine observations. For a market dataset, preserve adjusted-price conventions and corporate-action handling. A volatility spike around an event is descriptive evidence; attributing it causally to the event needs a design addressing confounders and timing.

The time-series laboratory simulates an AR(1) and displays its path and empirical lag-one correlation as phi changes. It can demonstrate persistence and instability but does not estimate a market's true phi. The Python examples implement a lagged EWMA forecast and verify that modifying a future observation cannot alter an earlier forecast.

### Autocorrelation, partial autocorrelation, and model diagnosis

Autocorrelation at lag two includes both direct and indirect dependence through lag one. Partial autocorrelation asks for the linear association remaining after controlling for intervening lags. For an ideal AR(p), population partial autocorrelations vanish beyond p under the standard stationary setup; for an MA(q), population autocovariances vanish beyond q. Finite-sample plots rarely display a clean exact cutoff.

Use these patterns as diagnostic clues, then compare candidate models and forecast behavior. Testing many lag patterns until one resembles a textbook picture creates selection. Confidence bands on an autocorrelation plot are often pointwise approximations under a particular null, not simultaneous guarantees for every displayed lag. With dozens of lags, a few apparent spikes can occur under a simple model.

### Deriving a two-step AR(1) forecast

From X_(t+1) − mu = phi(X_t − mu) + epsilon_(t+1), substitute into the next equation: X_(t+2) − mu = phi²(X_t − mu) + phi epsilon_(t+1) + epsilon_(t+2). Conditional on information at t, both future innovations have mean zero, giving the stated forecast. Independence or orthogonality of future innovations gives error variance sigma_e²(phi² + 1).

For phi = 0.8 and sigma_e = 0.6, this variance is 0.36 × 1.64 = 0.5904, with standard deviation about 0.7684. A forecast interval based on normal innovations adds an appropriate normal quantile times this standard deviation, before considering parameter uncertainty. A point forecast can converge toward the mean while the interval widens, so “mean reversion” does not mean increasing certainty about the realized endpoint.

### ARCH effects without return autocorrelation

Let epsilon_t = sqrt(h_t)z_t with independent standardized z_t and h_t determined by the past. Then E[epsilon_t given past] = 0, so raw innovations can be uncorrelated over time under suitable integrability. Yet E[epsilon_t² given past] = h_t, which can be persistent. A regression or test on squared residuals can reveal conditional-variance structure that a raw-return autocorrelation plot misses.

An ARCH(1) model h_t = omega + alpha epsilon_(t−1)² has finite unconditional variance omega/(1 − alpha) when the standard second-moment conditions hold and alpha < 1. Higher moments require stronger conditions involving z_t. For standard normal z, fourth-moment existence for this simple model requires 3alpha² < 1. A process can therefore have finite variance but infinite fourth moment, affecting conventional inference about variance estimates.

### EWMA memory as a geometric weighting scheme

Expanding h_t = lambda h_(t−1) + (1 − lambda)epsilon_(t−1)² gives weights (1 − lambda), (1 − lambda)lambda, (1 − lambda)lambda², and so on on earlier squared shocks, plus a decaying initialization term. The weights sum toward one. The half-life of a shock's weight solves lambda^k = 1/2, giving k = ln(1/2)/ln(lambda).

For lambda = 0.94, the half-life is about 11.20 observation intervals. If the observations are daily trading returns, this is about eleven trading intervals, not eleven calendar days. The same numerical lambda applied to weekly data represents a much longer calendar memory. Parameter interpretation must travel with frequency.

### Forecast losses can emphasize different errors

For positive variance forecast h and nonnegative proxy v, a common QLIKE form is log(h) + v/h, with terms independent of h omitted. If h is tiny while v is positive, the ratio strongly penalizes underprediction. The expected loss is minimized at the conditional mean of v under suitable conditions: differentiate expected log(h) + E[v]/h with respect to h, giving 1/h − E[v]/h² = 0.

This derivation explains the target elicited by the loss. It does not establish that every noisy proxy or finite-sample comparison yields a reliable ranking. Zero or negative h is outside the domain and must be rejected or handled by an explicitly justified positive model. Adding an arbitrary floor changes the scoring rule near the floor and should be reported.

### A dependence-preserving bootstrap design

For a stationary series with local dependence, choose blocks of length l, sample blocks with replacement, concatenate until the desired length, and truncate the final excess. Moving-block, circular-block, and stationary-bootstrap variants handle boundaries and block lengths differently. The goal is to retain short-run dependence while approximating repeated samples from a long process.

Very short blocks resemble independent resampling and miss persistence; very long blocks provide few effectively distinct pieces. Theory requires conditions on dependence and how l grows with sample size. A block-length sensitivity analysis is informative when no single choice is compelling. Structural breaks can violate the stationary resampling rationale, so a bootstrap cannot be assumed to repair nonstationarity merely because it preserves adjacent observations.

### Seasonality is a calendar hypothesis

A repeated monthly or weekday pattern can be represented with calendar indicators or seasonal lags, but it should be defined in the correct trading calendar. Month-end, holiday, and market-close effects depend on observation timing. Testing many calendar patterns and retaining one favorable result creates multiplicity just as testing many technical indicators does.

If a seasonal adjustment is estimated using the full sample, it can incorporate future information. For a real-time forecast, fit or obtain the adjustment available at the forecast date. An officially revised seasonally adjusted series and a historical real-time series can differ. Document the vintage convention and compare against a baseline that uses the same information set.

Seasonality can also change after a market structure or participant behavior changes. A stable-looking full-sample average can conceal opposing subperiod effects. Report the sample and plausible break sensitivity rather than treating a calendar label as an immutable law.

An MA(1) with theta and another with reciprocal theta can produce related covariance patterns after rescaling innovation variance. Invertibility chooses a representation in which shocks can be recovered stably from past observations. This is an identification convention about innovations, not merely a stationarity condition: a finite moving average is stationary under the standard finite-variance innovation assumptions even when its inverse representation is unstable. Keep stationarity, causality, and invertibility as separate properties.

## 10.12 Guided study and resources

Suggested applications: derive the AR(1) variance and h-step forecast-error variance; compare an AR root with its coefficient; compute long-run variance for phi = 0.5; distinguish a trend-stationary model from a random walk; design a leakage-free rolling-volatility comparison. Hints: expand recursive updates; sum geometric series; write the forecast's information set before writing code.

Read the stationarity, ARMA, limit-theorem, HAC, spectrum, information-criteria, and bootstrap sections in [MIT 14.384's lecture notes](https://ocw.mit.edu/courses/14-384-time-series-analysis-fall-2013/pages/lecture-notes/). [Forecasting: Principles and Practice](https://otexts.com/fpp3/) is an added free text with a practical forecasting perspective and R examples. Use [MIT 15.450](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/) for the financial volatility connection. The next chapter extends a single series to systems, long-run relationships, hidden states, and Bayesian computation.


<a id="chapter-11"></a>

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



# Part: Optimization

<a id="chapter-12"></a>

# 12. Convex optimization and numerical methods

## 12.1 Choosing the best feasible decision

An optimization problem has variables, an objective, and constraints. For a portfolio, variables might be asset weights, the objective expected return minus a risk penalty, and constraints budget, leverage, exposure, or turnover limits. Writing these elements precisely is more important than choosing a solver first. A solver answers the mathematical problem supplied to it, which may differ from the intended economic decision.

Convex optimization is valuable because local improvement and global structure align under appropriate conditions. It does not make uncertain expected returns known or eliminate model risk. This chapter follows the families in [Stanford EE364A](https://see.stanford.edu/Course/EE364A), with the authors' freely available [Convex Optimization book](https://web.stanford.edu/~boyd/cvxbook/) as the full reference. The resource index includes lecture notes, review notes, homework links, solutions, transcripts, and data files.

## 12.2 Convex sets and their geometry

A set C is convex if, for any x and y in C and any theta between zero and one, theta x + (1 − theta)y is also in C. Every line segment between feasible points remains feasible. A portfolio budget hyperplane 1-transpose w = 1 is convex. Adding nonnegative-weight constraints gives a simplex, also convex. A rule “hold either zero or at least 10% of each asset” generally creates a nonconvex set because a midpoint can violate it.

Intersections of convex sets are convex: a segment between two points in the intersection belongs to every set and therefore to the intersection. Affine maps preserve convexity. Norm balls, halfspaces, and positive-semidefinite matrix cones are important examples. A union of convex sets need not be convex; two separated intervals illustrate the failure.

A separating hyperplane can distinguish a point outside a suitable closed convex set from the set. This geometric idea supports duality and optimality certificates. A supporting hyperplane touches a convex set while leaving it on one side. In portfolio terms, a linear objective can be viewed as sliding a hyperplane until it first supports the feasible region. The picture explains why linear constraints and objectives have exploitable geometry.

## 12.3 Convex functions and composition rules

A function f on a convex domain is convex if f(theta x + (1 − theta)y) ≤ theta f(x) + (1 − theta)f(y). Its graph lies below chords. The epigraph, points (x, t) with f(x) ≤ t, is convex exactly when f is convex. This lets us convert some nonlinear objectives into linear objectives with convex constraints by introducing an auxiliary variable.

For differentiable f, convexity is equivalent to f(y) ≥ f(x) + gradient f(x)-transpose(y − x) on the domain. The tangent plane is a global lower bound. For twice differentiable f on an open convex domain, a positive-semidefinite Hessian characterizes convexity. The quadratic w-transpose Sigma w is convex when Sigma is positive semidefinite, directly connecting covariance validity to portfolio optimization.

Positive weighted sums and pointwise maxima of convex functions are convex. Affine composition preserves convexity. General composition requires care: a convex nondecreasing outer function composed with a convex inner function is convex under appropriate domain conditions. Multiplying two arbitrary convex functions does not generally preserve convexity. A disciplined modeling system checks known composition rules rather than guessing from a smooth-looking formula.

The negative logarithm is convex on positive inputs. Log-sum-exp, log(sum exp x_i), is convex and gives a smooth approximation to a maximum. A ratio can be convex, concave, or neither depending on its structure; x²/y is convex for y > 0, while x/y is not generally jointly convex. Domain restrictions are part of the function's curvature statement.

## 12.4 Standard problem families

A linear program minimizes c-transpose x subject to affine equalities and inequalities. A quadratic program adds a quadratic objective with positive-semidefinite Hessian and retains affine constraints. A mean–variance portfolio with linear exposure limits is a convex quadratic program when covariance is positive semidefinite and the objective signs are correct.

A second-order cone constraint has the form ||Ax + b||2 ≤ c-transpose x + d. It can represent standard-deviation limits and robust linear constraints. A semidefinite program uses a symmetric matrix expression constrained to be positive semidefinite, such as F0 + sum x_i F_i semidefinite-positive. Semidefinite structure can model covariance, matrix inequalities, and experimental design, but computational size grows with matrix dimensions.

Geometric programming becomes convex after logarithmic transformations for a specific class of positive-variable monomial and posynomial expressions. “Geometric” here names that mathematical class, not arbitrary spatial geometry. Always state the transformation and domain, then translate the solution back. A transformation that is one-to-one on positive variables can preserve the optimization's meaning; ignoring positivity cannot.

Least squares minimizes ||Ax − b||² and is convex. Least absolute deviations minimizes the one-norm of residuals and can be written as a linear program with auxiliary bounds. Chebyshev fitting minimizes the maximum absolute residual. These objectives penalize errors differently, so the best choice depends on the data and purpose. A solver cannot decide which loss reflects the research question.

## 12.5 Lagrangians and lower bounds

Consider minimizing f0(x) subject to fi(x) ≤ 0 and h_j(x) = 0. The Lagrangian is L(x, lambda, nu) = f0(x) + sum lambda_i fi(x) + sum nu_j h_j(x), with lambda_i nonnegative. For feasible x, the inequality terms are nonpositive and equality terms vanish, so L(x, lambda, nu) ≤ f0(x). Taking the infimum over x gives a lower bound g(lambda, nu) on every feasible objective value.

The dual problem maximizes this lower bound over lambda ≥ 0 and unrestricted nu. Weak duality states that a dual feasible value cannot exceed a primal feasible value. The gap between them is an optimality certificate when both are available. Strong duality says the best values coincide; it requires conditions and is not automatic for every optimization problem.

For convex problems, Slater's condition gives a common sufficient condition for strong duality: a suitable relative-interior point satisfies strict inequalities and the affine equalities, with technical domain qualifications. A failure of Slater does not prove a duality gap; it means this convenient sufficient theorem cannot be invoked. State the actual assumptions used rather than treating a named theorem as a magic label.

## 12.6 KKT conditions and a fully solved example

Under appropriate differentiability and constraint qualifications, the Karush–Kuhn–Tucker conditions combine primal feasibility, dual feasibility, stationarity, and complementary slackness. Complementary slackness is lambda_i fi(x) = 0: an inequality can have a positive multiplier only when active. In a convex problem, a point satisfying suitable KKT conditions is globally optimal. Necessity and sufficiency have different assumptions and should be distinguished.

Minimize one half (x − 2)² subject to x ≤ 1. Write constraint f1(x) = x − 1 ≤ 0. Lagrangian is one half (x − 2)² + lambda(x − 1). Stationarity gives x − 2 + lambda = 0. If the constraint were inactive, lambda = 0 and x = 2, infeasible. Therefore x = 1, and stationarity gives lambda = 1. All conditions hold, so the optimum is x = 1 with objective 0.5.

The multiplier has a sensitivity interpretation. If the bound becomes x ≤ b near b = 1, optimal value is one half (b − 2)² and its derivative with respect to b is b − 2 = −1. Relaxing the bound lowers the objective at rate one, matching the negative multiplier under this constraint convention. Multiplier signs depend on how a constraint is written, so verify the convention before interpreting “shadow prices.”

For portfolio optimization, a multiplier on a risk or exposure bound describes local objective sensitivity to that bound under regularity. It is conditional on estimated inputs and the model. A large multiplier can identify a restrictive constraint, but it does not establish that relaxing it is institutionally appropriate.

## 12.7 Gradient descent and line search

Gradient descent updates x_new = x − alpha gradient f(x), moving opposite the local steepest ascent direction in Euclidean geometry. A step size that is too large can increase the objective or diverge. For f(x) = one half a x² with a > 0, the update is x_new = (1 − alpha a)x. Convergence requires |1 − alpha a| < 1, or 0 < alpha < 2/a. This simple case explains step-size sensitivity.

Backtracking line search starts with a candidate step and repeatedly reduces it until a sufficient-decrease condition holds. The condition compares actual decrease with a fraction of the linear prediction. It requires a descent direction and suitable smoothness. A line-search failure can indicate an invalid gradient, a domain violation, or numerical problems, not merely an inconvenient tolerance.

For a convex differentiable function with Lipschitz-continuous gradient, suitable fixed steps have standard convergence guarantees. Strong convexity gives stronger rates. Ill-conditioning makes gradient directions zigzag in narrow curved valleys. Scaling, preconditioning, or second-order methods can improve convergence. The geometry of the objective explains algorithm performance.

## 12.8 Newton's method and equality constraints

Newton's method approximates f near x by its second-order Taylor model and minimizes that local quadratic. The step solves H delta x = −gradient f, where H is the Hessian. For a positive-definite Hessian near a well-behaved optimum, it can converge rapidly. Far away, damping or a line search can be needed. An indefinite Hessian in a nonconvex problem may produce a direction that is not descending.

With equality constraints A x = b, a Newton step must satisfy A delta x = 0 when starting feasible. The KKT linear system combines curvature and constraints:

$$\begin{bmatrix}H&A^\top\\A&0\end{bmatrix}
\begin{bmatrix}\Delta x\\\nu\end{bmatrix}
=\begin{bmatrix}-\nabla f\\0\end{bmatrix}.$$

The block system is not positive definite in the same way as H; use an appropriate factorization. If starting infeasible, the right-hand side includes the equality residual. A small gradient alone does not establish convergence when constraints remain violated. Check primal residual, dual or stationarity residual, and objective or gap diagnostics.

Solving linear systems often dominates optimization cost. Sparse structure, repeated factorizations, and matrix conditioning matter. Numerical linear algebra from Chapter 3 is therefore a core prerequisite rather than a separate optional topic. Avoid explicitly inverting a large KKT matrix.

## 12.9 Interior-point methods and barriers

A logarithmic barrier for inequality fi(x) < 0 adds −sum log(−fi(x)) to a scaled objective. It becomes large near the boundary, keeping iterates strictly inside when the algorithm preserves the domain. Increasing the objective scale traces a central path toward the constrained optimum under suitable conditions. Newton steps solve each barrier subproblem.

For minimizing f0 with m inequalities, standard barrier analysis relates the duality gap along the central path to m/t under the usual setup. This supplies a principled stopping target rather than stopping only because consecutive iterates look similar. Domain feasibility, conditioning near boundaries, and a suitable starting point remain practical concerns.

An infeasible problem has no allowed point; an unbounded problem permits the objective to improve without limit. A solver can also stop because of numerical failure without establishing either property. Read the status and certificate. Do not convert every non-success status into “no solution” or silently use the last iterate as if optimal.

## 12.10 Statistical estimation and experimental design

Many likelihood objectives are convex in suitable parameters. Logistic negative log likelihood is convex because its Hessian is a nonnegative weighted sum of outer products. Covariance or latent-variable models can be nonconvex, so the word “maximum likelihood” does not guarantee a globally tractable problem. Curvature belongs to a specific parameterization and objective.

Experimental design chooses where to collect measurements to improve parameter information. If information matrix is M(w) = sum w_i a_i a_i-transpose, weights w_i can allocate sampling effort under a budget. D-optimal design maximizes log determinant of M over a positive-definite domain; A-optimal design minimizes trace of its inverse under suitable conditions. These criteria prioritize different summaries of uncertainty.

The interpretation of determinant is geometric: an information matrix defines an uncertainty ellipsoid, and determinant relates to its volume. Trace of inverse information summarizes average marginal variance in the chosen coordinates. Scaling parameters changes these criteria's practical meaning, so define units and target directions. The Stanford course's experimental-design material includes historical errata notes; consult the official book errata when solving those exercises.

Geometric optimization also includes minimum-volume enclosing ellipsoids, distance between convex sets, and separation problems. These applications illustrate how a mathematical formulation can transform a visual problem into a solvable convex program. They are not finance-specific, but they develop the formulation skill needed for portfolio and estimation constraints.

## 12.11 A portfolio program with costs

Let mu be expected returns, Sigma covariance, w_old current weights, and w new weights. One convex objective minimizes one half gamma w-transpose Sigma w − mu-transpose w + c||w − w_old||1, subject to budget and linear exposure limits. The absolute-value term approximates proportional trading costs under a stated convention. All terms need compatible units and a consistent horizon.

Introduce t_i ≥ w_i − w_old_i and t_i ≥ −(w_i − w_old_i), then minimize the linear cost c sum t_i along with the quadratic term. At optimum, positive costs encourage t_i to equal the absolute changes. A leverage limit ||w||1 ≤ L is also convex. A requirement to hold exactly ten assets is combinatorial and generally nonconvex; replacing it with an absolute-value penalty does not make it the same problem.

Before trusting results, check sum of weights, bound violations, factor exposures, objective components, and sensitivity to mu and Sigma. Compare against current weights and simple baselines. If the optimizer recommends huge trades for a tiny expected improvement, inspect input noise and the cost model. A model using constant proportional costs omits nonlinear market impact and capacity.

## 12.12 Robust optimization and model uncertainty

Robust optimization protects against a specified uncertainty set rather than a single estimated parameter. If expected return is mu_hat + delta with ||delta||2 ≤ epsilon, the worst-case portfolio return is mu_hat-transpose w − epsilon||w||2 by Cauchy–Schwarz. This converts parameter uncertainty into a norm penalty. The mathematical transformation is exact for the stated set; the set itself is a modeling choice.

A too-large uncertainty set can produce excessively conservative decisions, while a too-small one offers little protection. Robustness to one set of mean perturbations does not guarantee robustness to regime changes, liquidity shocks, or omitted constraints. Document what uncertainty is modeled and evaluate performance under additional scenarios relevant to the institution.

### A linear-program dual you can verify

Minimize c-transpose x subject to Ax = b and x ≥ 0. Using L = c-transpose x + nu-transpose(b − Ax), the infimum over nonnegative x is finite only when c − A-transpose nu ≥ 0. Otherwise a coordinate with negative coefficient can grow without bound and drive L to negative infinity. The dual is therefore maximize b-transpose nu subject to A-transpose nu ≤ c.

Take primal minimize 2x1 + 3x2 subject to x1 + x2 = 1 and x ≥ 0. The optimum is x1 = 1, x2 = 0, value two. The dual maximizes nu subject to nu ≤ 2 and nu ≤ 3, so nu = 2 gives the same value. Feasible primal and dual points with equal objective certify optimality without inspecting every feasible portfolio.

Complementary slackness says x_i(c_i − a_i-transpose nu) = 0. The second asset has reduced cost one at nu = 2 and zero optimal allocation; the first has zero reduced cost and positive allocation. This is a concrete version of the abstract KKT relationship. A numerical gap of 10^(−8) is meaningful only relative to objective scale and feasibility tolerances.

### Semidefinite constraints in two dimensions

A symmetric matrix [[a, b], [b, c]] is positive semidefinite exactly when a ≥ 0, c ≥ 0, and ac − b² ≥ 0. Necessity follows by testing coordinate directions and the quadratic's discriminant; sufficiency follows by completing the square, with a separate zero-diagonal case. For a correlation matrix [[1, rho], [rho, 1]], this reduces to |rho| ≤ 1.

A semidefinite constraint is a matrix-level generalization of nonnegative curvature. It can enforce that an estimated covariance candidate is valid while optimizing a fitting objective. Entrywise nonnegativity is different: a valid covariance matrix can have negative off-diagonal entries, and a matrix with every entry positive can still have a negative eigenvalue. Use the appropriate cone rather than a visually appealing sign rule.

### Geometry through norms and dual norms

The dual norm of a vector y is the maximum of y-transpose x over ||x|| ≤ 1. For the Euclidean norm, the dual is Euclidean by Cauchy–Schwarz. For the one-norm, the dual is the infinity-norm because the maximizing budget can be concentrated on the coordinate with largest absolute y. For the infinity-norm, the dual is the one-norm because each coordinate can independently take its favorable sign.

This relationship explains robust penalties. If mean uncertainty is bounded in infinity-norm, the worst-case portfolio-mean adjustment is proportional to ||w||1. If bounded in one-norm, it is proportional to ||w||infinity. The uncertainty-set geometry determines which exposure pattern is penalized. Choosing a norm is an economic assumption about plausible errors, not just a software setting.

### Filter design as an optimization example

Suppose a linear filter outputs y_t = sum from j = 0 to p of h_j x_(t−j). Choose coefficients h to approximate a desired response or denoise observations while limiting amplification. Squared fitting errors give a quadratic objective; bounds on frequency response or coefficient norms can give convex constraints under suitable formulations.

In finance, smoothing can make a chart easier to read but introduces lag and changes the statistical object. A centered filter uses future observations and cannot be applied as a real-time feature without delay. A causal filter uses current and past inputs. The Stanford filter-design examples build formulation skills; their application to a trading signal still requires an information-timing argument.

### Why KKT suffices in a convex differentiable problem

Let x_star be feasible and satisfy stationarity with nonnegative multipliers and complementary slackness. Convexity gives f0(x) ≥ f0(x_star) + gradient f0(x_star)-transpose(x − x_star). Substitute stationarity to replace the objective gradient by a negative weighted sum of constraint gradients and equality gradients.

For each convex inequality fi, fi(x) ≥ fi(x_star) + gradient fi(x_star)-transpose(x − x_star). Rearranging and multiplying by nonnegative lambda_i bounds the negative gradient contribution below by lambda_i[fi(x_star) − fi(x)]. Complementary slackness makes the first term zero, and feasibility makes the remaining negative weighted fi(x) nonnegative. Affine equality contributions vanish because both points satisfy the same equalities. Therefore f0(x) ≥ f0(x_star).

The proof identifies the roles of convexity, nonnegative multipliers, feasibility, and complementary slackness. Without convexity, the tangent inequality need not hold globally. Without nonnegative multipliers, multiplying an inequality could reverse its useful direction. A checklist of KKT equations is much easier to remember when the global proof is understood.

### A practical solver review

After solving, independently recompute the objective from returned variables and original inputs. Check every constraint in its original units. Compare the reported duality gap or residuals with meaningful tolerances. Perturb a bound slightly and see whether objective changes agree locally with the multiplier, recognizing that active-set changes can make sensitivity nonsmooth.

Finally compare the optimization output with a feasible simple decision. If the returned objective is worse than a known feasible baseline in a minimization problem, either convergence failed, the objective was recomputed differently, or the formulations differ. This cheap check can reveal mistakes that a polished solver status hides.

### Nondifferentiable convex objectives

The absolute-value function is convex but has no ordinary derivative at zero. A subgradient g at x satisfies f(y) at least f(x) plus g times (y minus x) for every y. For absolute value at zero, every g between minus one and one is a subgradient. Away from zero, the subgradient is the usual sign.

For minimizing a convex function without constraints, zero belonging to the subdifferential certifies a global minimum. This extends the tangent-lower-bound argument without pretending a kink has a unique slope. Lasso and turnover penalties use this structure. A numerical method designed for smooth objectives may behave poorly at such kinks; proximal or other nonsmooth methods exploit the objective's actual form. The correct formulation includes both curvature and differentiability information.

For f(x) = absolute value of x plus one half times (x minus a) squared, optimality is zero in the sum of a subgradient and x minus a. If a exceeds one, the solution is a minus one; if a is below minus one, it is a plus one; otherwise the solution is zero. This soft-threshold rule follows by checking the positive, negative, and zero regions separately. It explains how an absolute-value penalty creates exact zeros rather than merely shrinking every coefficient continuously. The zero region uses the whole subgradient interval, so forcing an arbitrary derivative value at the kink can miss the correct optimality argument. This scalar calculation underlies proximal updates for lasso-type objectives and offers an independent check for a numerical implementation.

## 12.13 Practice, computation, and source study

The optimization laboratory minimizes a one-dimensional quadratic with a bound and shows the unconstrained and constrained solutions. It exposes the role of an active constraint and a local sensitivity calculation. The portfolio laboratory separately explores a two-asset frontier. These are real calculations tied to the derivations, not a general-purpose convex solver. Large quadratic and semidefinite programs are advanced source-based exercises.

Suggested applications: prove intersection preserves convexity; test a Hessian for positive semidefiniteness; derive KKT conditions for nonnegative portfolio weights; solve a bounded quadratic by cases; compare gradient-descent steps for several step sizes; formulate absolute turnover with auxiliary variables; derive the worst-case mean penalty above. Hints: expand definitions before invoking a theorem, and separate feasibility from stationarity.

Follow the full [Stanford EE364A course](https://see.stanford.edu/Course/EE364A) and [Boyd–Vandenberghe book](https://web.stanford.edu/~boyd/cvxbook/) through sets, functions, problems, duality, approximation, estimation, geometry, numerical linear algebra, unconstrained and equality-constrained minimization, and interior-point methods. Historical course examples use MATLAB/CVX; the mathematical formulations transfer, but software syntax must be checked in the chosen environment. Do not treat an old executable assignment as an instruction to install or run unexamined code.

Optimization now supplies a language for deliberate choices and verifiable certificates. The next chapter returns to uncertainty evolving continuously through time, preparing the mathematical basis of derivatives and dynamic financial decisions.



# Part: Continuous-time finance

<a id="chapter-13"></a>

# 13. Stochastic processes and Itô calculus

## 13.1 Randomness evolves with information

An uncertain terminal payoff is a random variable. A price evolving through time is a stochastic process, a collection of random variables S_t indexed by t. To discuss trading, we also need to specify what is known at each time. A filtration F_t is an increasing collection of information sets, mathematically sigma-algebras, so F_s is contained in F_t when s ≤ t. An adapted process has its time-t value measurable using information available at t.

This formalism prevents a hidden timing mistake. A trading position chosen just before a price move cannot depend on that move's realized outcome. In discrete time, choose the position using F_t and then earn the next increment. Continuous-time stochastic integration encodes an analogous nonanticipation requirement. An apparently profitable rule using tomorrow's shock is not an admissible strategy in the intended information model.

We work on a probability space with a filtration satisfying the usual regularity assumptions when invoking standard continuous-time results. Full measure-theoretic construction is an advanced extension, but the information meaning is part of the core. [MIT 18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/), its [2013 predecessor](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/), and [MIT 15.450](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/) connect these ideas to finance.

## 13.2 Random walks and the Brownian scaling limit

A simple symmetric random walk adds independent increments +1 or −1 with equal probability. After n steps its expected position is zero and variance n. If we use n steps per unit time, scaling each spatial step by 1/sqrt(n) keeps the unit-time variance near one. Scaling by 1/n would instead drive variance toward zero. The square-root relationship is the bridge from discrete accumulated shocks to Brownian motion.

A standard Brownian motion W_t starts at zero, has continuous paths, independent increments, and normally distributed increments W_t − W_s with mean zero and variance t − s for t ≥ s. These properties specify the process's finite-dimensional behavior and continuity. W_t itself has distribution N(0, t). Time has units, and Brownian increments scale with the square root of time.

For a quarter-year interval, a standard Brownian increment has standard deviation 0.5 in the corresponding normalized units. Simulating it uses sqrt(0.25)Z for a standard normal Z. Multiplying Z by 0.25 would assign variance 0.0625 rather than 0.25. This is among the most common stochastic-simulation errors.

Brownian paths are continuous but almost surely not differentiable in the ordinary sense. A typical increment is of order sqrt(dt), so an increment divided by dt becomes increasingly erratic as dt shrinks. We cannot treat dW/dt as an ordinary finite-valued function and apply deterministic calculus without modification. The notation dW is a compact representation of an integral relationship, not an ordinary infinitesimal ratio.

## 13.3 Quadratic variation changes calculus

Partition [0, T] into n equal intervals and sum squared Brownian increments. Each increment has expected square T/n, so the sum has expectation T. For independent normal increments, the variance of each squared increment is 2(T/n)², and the sum's variance is 2T²/n. It therefore converges to T in mean square as the equal partition is refined. More general standard partition results require appropriate conditions.

This quadratic variation is written [W]_T = T. A smooth deterministic path has squared-increment sums tending to zero because increments are order dt rather than sqrt(dt). Brownian motion retains a second-order contribution. The mnemonic (dW)² = dt summarizes this limiting behavior; it is not an ordinary identity between real infinitesimals.

Consider W_T² − W_0². For each increment, W_(i+1)² − W_i² = 2W_i delta W_i + (delta W_i)². Summing and taking the stochastic-integral limit gives

$$W_T^2=2\int_0^T W_t\,dW_t+T.$$

Thus integral W_t dW_t = (W_T² − T)/2. Ordinary calculus would predict W_T²/2 and miss the correction. This concrete identity motivates Itô calculus before we state its general formula.

## 13.4 Martingales and fair-game reasoning

A martingale M_t is adapted, integrable at each time, and satisfies E[M_t given F_s] = M_s for s ≤ t. Its conditional expected future value equals its current value. This is a property under a specified probability measure and information set, not a universal statement that the observed path is flat or economically riskless. Brownian motion is a martingale under its natural filtration and appropriate extensions preserving the needed independence.

The process W_t² − t is also a martingale. Conditional on F_s, write W_t = W_s + independent zero-mean increment. The conditional expectation of W_t² is W_s² + (t − s), so subtracting t leaves W_s² − s. This proof uses independent increments and their variance, showing exactly where Brownian structure enters.

A submartingale has conditional expected future value at least its present value; a supermartingale has at most. Convex functions of martingales can produce submartingales under integrability conditions through conditional Jensen's inequality. A fair underlying process can therefore generate a convex payoff with increasing expected value, a connection to option convexity.

A stopping time tau is a random time whose occurrence by t can be determined from information available at t. “First time the price crosses a barrier” is a stopping time under suitable path and filtration conditions. “The date of the year's highest price” generally requires future information and is not a stopping time for ordinary trading information. This distinction formalizes why hindsight rules can appear deceptively successful.

Optional-stopping results preserve martingale expectations only under conditions such as bounded stopping times or suitable integrability and uniform-integrability assumptions. A doubling strategy can seem to guarantee a gain if unlimited capital and indefinite play are allowed, but it violates conditions needed for the naive conclusion and introduces unbounded financing exposure. “Martingale” does not justify applying a stopping theorem without checking hypotheses.

## 13.5 Constructing the Itô integral

Begin with a simple predictable strategy H_t constant over intervals and chosen using information at each interval's beginning. Define its gain as sum H_i(W_(t_(i+1)) − W_(t_i)). This is the natural discrete self-financing gain from holding H_i units of the stochastic driver. Left-endpoint information ensures the position does not use the upcoming increment.

For square-integrable adapted integrands under the standard construction, limits of these sums define integral H_t dW_t. The Itô isometry states E[(integral from zero to T of H_t dW_t)²] = E[integral from zero to T of H_t² dt]. It relates the stochastic integral's variance to ordinary accumulated squared exposure. The expectation of the integral is zero under the relevant square-integrability assumptions.

For constant H = 3, the integral is 3W_T, with variance 9T, matching the isometry. For H_t = W_t, the identity from quadratic variation gives (W_T² − T)/2. Its expectation is zero because E[W_T²] = T. The same formula provides a numerical simulation test: approximated left-point sums should approach that endpoint expression as partitions refine.

Changing the sampling convention changes the calculus. A midpoint-based construction can lead to a Stratonovich integral under appropriate conditions, with a different correction rule. We use Itô throughout because nonanticipating financial trading and conditional expectations align naturally with its convention. Never mix formulas from the two conventions without converting them.

## 13.6 Stochastic differential equations

The notation dX_t = a(t, X_t)dt + b(t, X_t)dW_t means X_t = X_0 + integral a(s, X_s)ds + integral b(s, X_s)dW_s. The first integral accumulates drift; the second accumulates random shocks. Suitable Lipschitz and growth conditions give standard existence and uniqueness results for strong solutions. Some financially useful models require more specialized conditions, particularly near boundaries.

Arithmetic Brownian motion has dX = mu dt + sigma dW and solution X_t = X0 + mu t + sigma W_t. It can become negative. Geometric Brownian motion has dS = mu S dt + sigma S dW and remains positive from a positive initial value under its explicit solution. Choosing one model rather than the other imposes different state-space and scaling assumptions.

The Ornstein–Uhlenbeck model dX = k(theta − X)dt + sigma dW adds noise to deterministic mean reversion. Its solution is theta + (X0 − theta)e^(−kt) + sigma integral from zero to t of e^(−k(t−s))dW_s. Conditional mean follows the deterministic mean-reverting path, and conditional variance is sigma²(1 − e^(−2kt))/(2k) for k > 0. Its long-run variance is sigma²/(2k). The process is Gaussian and can be negative, relevant when deciding whether it is appropriate for a particular rate or spread.

## 13.7 Itô's lemma, derived from local expansion

For a sufficiently smooth function f(t, X_t), with one time derivative and two state derivatives, Itô's lemma gives

$$df=\left(f_t+a f_x+\frac12b^2f_{xx}\right)dt+b f_x\,dW_t.$$

The first two terms resemble the chain rule. The third comes from the second-order Taylor term: one half f_xx(dX)². Since the Brownian part has squared variation b²dt, that term survives. Products involving dt with dW and dt² vanish in the limiting bookkeeping under the theorem's conditions. This heuristic motivates the formula; a rigorous proof controls Taylor remainders along partitions and uses quadratic-variation convergence.

Apply the formula to f(x) = x² with dX = mu dt + sigma dW. Then d(X²) = (2mu X + sigma²)dt + 2sigma X dW. Even with mu = 0, the expected square grows at rate sigma². That matches the variance of Brownian accumulation. A missing sigma² term signals ordinary calculus was incorrectly substituted.

For geometric Brownian motion and f(s) = ln s, derivatives are 1/s and −1/s². Itô gives d ln S = (mu − sigma²/2)dt + sigma dW. Integrating yields S_t = S0 exp[(mu − sigma²/2)t + sigma W_t]. The correction ensures E[S_t] = S0e^(mu t), using the normal exponential moment. The median is S0exp[(mu − sigma²/2)t], illustrating the mean–median distinction from Chapter 5.

For multivariable processes, covariance cross terms enter. If dX_i dX_j corresponds to covariance rate a_ij dt, the second-order correction is one half sum a_ij f_(x_i x_j)dt. Correlated Brownian drivers therefore affect functions of multiple assets. Omitting cross partials can misprice basket or spread claims even if each asset's individual volatility is correct.

## 13.8 Physical and pricing measures

The physical measure P describes a model of real-world outcomes. A pricing measure Q is chosen, when it exists under the market model, so discounted tradable prices have an appropriate martingale property. The two measures can assign different probabilities to the same possible paths. Equivalent measures agree on which events have probability zero but need not agree on ordinary event probabilities.

In a simple complete diffusion market with nonzero volatility, changing measure adjusts the stock drift from its physical expected return mu to the financing rate r, after accounting for dividends. A Girsanov theorem supplies a rigorous change-of-measure construction under conditions ensuring the density process is valid. An exponential local-martingale expression is not automatically a true probability density; integrability conditions matter.

Risk-neutral valuation does not assert that real investors are risk-neutral or that actual expected stock return equals r. It is a representation of no-arbitrage prices under the specified trading model. Market incompleteness can permit multiple pricing measures, so a payoff not fully hedgeable may need additional preferences, calibration, or pricing assumptions. Chapter 14 derives the elementary discrete version before the continuous formula.

## 13.9 Simulation and discretization

Euler–Maruyama approximates dX = a dt + b dW by X_(n+1) = X_n + a(t_n, X_n)h + b(t_n, X_n)sqrt(h)Z_n with independent standard normals. It extends deterministic Euler using Brownian scaling. The approximation has discretization error as well as Monte Carlo sampling error. More simulated paths reduce sampling error but do not remove bias from a coarse time step.

For geometric Brownian motion, exact time-step sampling is available: S_(n+1) = S_n exp[(mu − sigma²/2)h + sigma sqrt(h)Z_n]. This preserves positivity. Euler's additive update can produce negative prices for sufficiently large shocks or steps. Exact transition sampling is preferable when the model and required path observations permit it, though barrier events between sampled times can still be missed.

Strong convergence concerns pathwise error under coupled randomness, while weak convergence concerns errors in expectations of suitable functions. A method adequate for a smooth terminal expectation may be inadequate for a path-sensitive payoff. A convergence study should target the quantity actually estimated. Comparing two independent sets of paths can obscure discretization differences with sampling noise; using coupled Brownian increments can make the comparison more informative.

## 13.10 A worked stochastic calculation

Let S0 = 100, mu = 0.06 per year, sigma = 0.20 per square-root year, and T = 1. Under geometric Brownian motion, log(S_T/100) is normal with mean 0.04 and variance 0.04. Expected terminal price is 100e^0.06 ≈ 106.1837, while median is 100e^0.04 ≈ 104.0811. The probability of finishing below 100 is the standard normal probability below −0.2, approximately 42.07%.

A positive expected return therefore does not imply that most paths exceed every plausible target. The distribution is asymmetric in price space. If pricing a derivative under a risk-neutral model with r = 0.03 and no dividends, replace the drift in the Q transition with 0.03, giving log mean 0.01. This change is for valuation under the model, not a revision of the physical forecast to 3%.

The stochastic-path laboratory uses the exact geometric transition at displayed time steps with a fixed seed. It lets you change drift and volatility and see how paths and terminal distributions respond. The experiment also computes a squared-increment sum for Brownian motion as a finite-grid illustration of quadratic variation. A finite plot cannot prove the limiting theorem, but it can expose an incorrect dt scaling.

### The stochastic product rule

For Itô processes X and Y, the product differential includes their quadratic covariation: d(XY) = X dY + Y dX + d[X, Y]. If dX = a dt + b dW1 and dY = c dt + d dW2 with instantaneous correlation rho, then d[X, Y] = rho b d dt. The extra term is another manifestation of second-order Brownian variation.

Take X = Y = W. The rule gives d(W²) = 2W dW + dt, matching the earlier derivation. For a deterministic discount factor D_t = e^(−rt), its quadratic covariation with a continuous Itô process is zero because D has finite variation. Thus d(D S) = D dS + S dD. Under Q with no dividends and stock drift r, the drift cancels, leaving d(e^(−rt)S_t) = e^(−rt)sigma S_t dW_Q.

This calculation explains the discounted-stock martingale candidate. To conclude it is a true martingale rather than only a local one, check appropriate integrability. In constant-volatility geometric Brownian motion, the explicit lognormal solution supplies the needed finite moments. A similar-looking formula in a more extreme model may require additional work.

### Correlated Brownian drivers

If W1 and W2 are independent standard Brownian motions, define B1 = W1 and B2 = rho W1 + sqrt(1 − rho²)W2 for |rho| ≤ 1. Then B2 increments have variance dt, and covariance between B1 and B2 increments is rho dt. This construction is the continuous-time analogue of a Cholesky covariance transformation.

In simulation, generate two independent standard normals, then apply the same linear combination before multiplying by sqrt(dt). Reusing one normal for both drivers sets correlation to one regardless of the intended rho. Generating both independently sets it to zero. A sample correlation check over many increments is a useful implementation test, with sampling tolerance rather than exact equality.

### The exponential martingale

For constant a, define M_t = exp(aW_t − a²t/2). Itô's lemma gives dM_t = aM_t dW_t, with no dt drift. Its expectation is one because E[exp(aW_t)] = exp(a²t/2). This explicit finite expectation confirms the martingale property through conditional independent increments in this constant-coefficient case.

The compensating term −a²t/2 is the same variance correction that appears in geometric Brownian motion. It is not a discretionary adjustment to make a formula look tidy. It precisely offsets the exponential's convexity. When a becomes a random adapted process, analogous exponential expressions need conditions ensuring their expectation remains one before they define a probability-measure change.

### Stopping times and a bounded example

Let tau be the first time Brownian motion reaches either −a or +b, with a and b positive. Under suitable stopping and integrability arguments, optional-stopping reasoning gives E[W_tau] = 0. Since W_tau is either −a or +b, if p is the probability of hitting +b first, bp − a(1 − p) = 0, giving p = a/(a + b).

This example should not be used as a blanket permission to stop any martingale at any random time. The bounded terminal state and justified stopping argument matter. The expected hitting time can also be derived using W_t² − t and appropriate conditions, yielding ab in this standard setting. A trading rule with unbounded losses, financing demands, or an unbounded reward process requires a separate analysis.

### Jumps and compensated counts

For a Poisson process N_t with constant intensity lambda, the compensated process N_t − lambda t is a martingale under its natural model and filtration. The subtraction removes predictable mean growth. A jump-driven price model must account for expected jump size when constructing a pricing drift.

If a price jumps multiplicatively by factor J with mean E_Q[J], a schematic risk-neutral jump-diffusion drift subtracts lambda(E_Q[J] − 1) from the continuous drift, under the specified independent-jump setup and integrability. Otherwise expected discounted stock gains generally do not have the intended martingale property. The jump distribution and intensity under Q need not equal their physical counterparts. This is why a physical jump simulation alone does not determine a derivative price.

### A convergence experiment with shared Brownian increments

Generate fine-grid Brownian increments once. Construct a coarse increment by summing adjacent fine increments, so both grids describe the same underlying sampled Brownian path. Compare numerical solutions at matching endpoints. Differences then reflect discretization more clearly than a comparison using unrelated random draws.

For exact GBM transitions, composing two half-step exponential updates equals the corresponding full-step update when the increments are combined, up to floating-point error. Euler updates generally do not share that identity. This gives an independent algebraic check and a concrete way to distinguish exact transition sampling from an approximation.

### Drift and volatility have different time units

In dS/S = mu dt + sigma dW, mu has units inverse time and sigma has units inverse square root of time. If time changes from years to days under a stated 252-trading-day convention, a consistent diffusion conversion uses daily drift mu divided by 252 and daily volatility sigma divided by sqrt(252). The convention is a modeling scale, not a claim that every year contains exactly that many observations.

For irregular intervals, use each actual modeled time increment rather than assuming equal spacing. A weekend or market closure can require a convention about how variance accumulates when trading is closed. Record the choice and compare its consequences. Mixing annual drift with daily Brownian scaling produces a process different from the one the equation describes, even though every simulated path may look plausible.

The stochastic integral convention can be tested directly with one Brownian grid. A left-point sum of W times its increment differs from a right-point sum by the sum of squared increments. As the grid refines, the difference approaches T under the standard quadratic-variation result. Thus the choice of evaluation point survives the limit, unlike ordinary smooth-path Riemann integration in this example. A right-point trading position would use the end-of-interval price before earning that interval's change, violating the intended information timing. The correction is therefore connected to both path roughness and the definition of an admissible strategy, rather than being a purely symbolic adjustment.

Predictability is an information restriction, while square integrability controls the stochastic integral's second moment.

## 13.11 Boundaries, integrability, and honest models

Every stochastic statement carries domain and moment conditions. A process can be a local martingale without being a true martingale. A discounted-price local-martingale model needs care before exchanging expectations and limits. A payoff with extreme growth can fail integrability even when ordinary stock moments exist. We will use standard integrable payoffs and state when a theorem's stronger conditions are assumed.

Continuous-path models omit jumps. Real returns can include abrupt news, defaults, and market closures. A diffusion can approximate some scales while misrepresenting rare events. Jump processes add discontinuous increments and require additional compensator and pricing machinery. The roadmap's Monte Carlo jump example is a useful extension after the diffusion core; its risk pricing is not determined solely by inserting a Poisson jump into a physical simulation.

Suggested applications: derive the Brownian squared-increment expectation and variance; show W_t² − t is a martingale; compute an Itô differential for exp(aW_t + bt); derive the OU conditional variance using the isometry; compare Euler and exact GBM transitions; identify a hindsight rule that is not adapted. Hints: condition on the past, retain the second-order Brownian term, and label the probability measure before interpreting drift.

Study the stochastic-process and stochastic-calculus notes in [18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/) and [18.S096](https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/), then the corresponding [15.450 lecture notes](https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/pages/lecture-notes/). The next chapter uses this calculus to derive option prices and to distinguish hedging logic, numerical approximation, and market calibration.


<a id="chapter-14"></a>

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


<a id="chapter-15"></a>

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



# Part: Learning and research

<a id="chapter-16"></a>

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


<a id="chapter-17"></a>

# 17. Research design, data, and backtesting

## 17.1 A research claim must be falsifiable

“Machine learning can find profitable signals” is an aspiration, not a research question. “Using only filings published before each month-end, a specified text feature improves next-month volatility forecasts relative to lagged volatility on a fixed universe and loss” is testable. It names the information, target, horizon, baseline, and evaluation. A useful research process makes it possible for the result to be negative.

Begin with a mechanism or statistical motivation, then write the claim, data requirements, identification or prediction assumptions, and decision relevance. Separate a primary question from exploratory follow-ups. A project can be valuable when it rules out an attractive idea or reveals a data limitation. The objective is reliable knowledge, not a positive backtest at any cost.

This chapter integrates the roadmap's factor analysis, event study, volatility comparison, and machine-learning ideas. The final chapter supplies detailed project briefs and acceptance criteria. The computational examples use synthetic data so they run offline and have known mechanisms. Real-data extensions use official sources with explicit provenance and access limitations.

## 17.2 A research specification before data analysis

Write a short protocol containing the economic hypothesis, population, observation unit, sample period, data cutoff, feature definitions, target construction, baseline, candidate methods, primary metric, costs, uncertainty method, and stopping rule. Include what would count as a failure. This document prevents a moving target from making every result appear supportive.

For a momentum study, specify formation months, skipped period, eligibility and liquidity rules, portfolio breakpoints, weights, rebalance dates, holding interval, delisting treatment, and benchmark. For a filing-volatility study, specify filing types, publication timestamp, duplicate and amendment handling, text extraction, target window, and company grouping. A phrase like “use momentum” or “analyze filings” leaves too many researcher degrees of freedom.

Exploration can precede the final protocol, but label it and preserve its scope. If exploratory results motivate a revised hypothesis, evaluate the revision on fresh data or explicitly qualify the evidence. Pretending a post-hoc choice was pre-specified makes uncertainty statements misleading. A research log is a scientific tool, not administrative decoration.

## 17.3 Data provenance and public sources

Provenance records who supplied data, how it was retrieved, its version or date, units, coverage, transformations, and usage terms. A file name is insufficient. Store a retrieval timestamp and hash, retain an immutable raw snapshot when permitted, and create a data dictionary. If a provider revises history, the snapshot makes the original analysis reconstructible.

[FRED](https://fred.stlouisfed.org/) provides macroeconomic series and source metadata. [ALFRED](https://alfred.stlouisfed.org/) supports vintage-oriented economic data, useful when revisions matter. Read series frequency, seasonal adjustment, units, observation dates, and release timing. A value labeled for a month may have been released later, so the observation date is not automatically the information-availability date.

The [Kenneth French Data Library](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html) provides academic factor and portfolio returns with construction descriptions. These are valuable for factor-regression exercises but are not a substitute for point-in-time individual-security data when reproducing a security-selection strategy. A preconstructed factor series does not reveal every implementation cost or historical universe decision needed for a live strategy.

The [SEC's EDGAR API documentation](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) describes official filing-related endpoints. Check current [developer access guidance](https://www.sec.gov/about/developer-resources) before retrieving data. Access policies and endpoint details can change. The package does not assume credentials, unrestricted request volume, or a downloaded filing corpus. Its offline examples use synthetic event records.

Not every free data source provides delisted securities, historical constituents, intraday quotes, borrow fees, corporate-action histories, or point-in-time fundamentals. Record missing coverage and narrow the claim accordingly. Do not silently replace unavailable historical information with today's universe. A feasible restricted research question is better than a broad claim supported by biased data.

## 17.4 The data dictionary is part of the model

For each field, record name, type, unit, meaning, observation time, availability time, source, missingness convention, and transformation. Distinguish identifiers from labels: a ticker can change or be reused, while a stable entity or security identifier serves a different purpose. A corporate merger can connect entities without making their historical securities identical.

Time zones and calendars matter. A filing published after the close cannot inform a trade at that day's earlier closing price. A timestamp without time zone can be ambiguous around daylight-saving changes. Daily datasets from different markets can refer to overlapping but different trading sessions. Align economic information, not merely matching date strings.

Corporate actions can change raw prices without producing an investment loss. A two-for-one split halves price and doubles shares; an unadjusted price-return calculation would report a false 50% loss. Total-return adjustments include distributions under a convention. Verify that the adjustment does not create a point-in-time leak in a feature whose intended meaning depends on historical raw prices or shares.

Missing data require a reasoned policy. Dropping every row with any missing feature can change the population and create selection. Imputation must be fitted on training data when learned. A missing indicator can be informative but can also encode provider coverage or future restatements. Audit patterns by time, entity, and target before choosing a remedy.

## 17.5 Information timing and the backtest clock

Every backtest step should have an explicit clock. At decision time t, gather information available by a cutoff, compute signals, determine target positions, submit trades under an execution assumption, update holdings and cash, then observe subsequent outcomes. The order is the strategy. A vectorized shift can implement it, but the chronology must be understood before coding.

Suppose a signal uses the close on Monday. Trading at that exact close can be infeasible if the final close was not known when an executable order had to be placed. A conservative simple convention is to trade at a later specified price, with costs. The appropriate convention depends on the actual order process; document it rather than assuming simultaneity.

Weights at t should earn returns after their establishment, not the return used to construct them. In a table, a common safe relationship is target weight at t multiplied by return from t to t + 1, subject to the chosen execution lag. Test a deliberately shocking future return: changing it must not alter earlier signals or positions. This causality check can expose accidental backward fills or full-sample transformations.

## 17.6 Accounting for positions and cash

Portfolio accounting tracks holdings, prices, cash, financing, distributions, and costs. For a self-financing rebalance, purchases and sales plus costs must reconcile with cash changes. A weight-only backtest can approximate this for simple strategies, but leverage, shorting, dividends, and irregular cash flows can require explicit share and cash accounting.

Let q_t be holdings after trading at price p_t and c_t cash after costs. Next value is q_t-transpose p_(t+1) plus cash growth and distributions under the model. Before trading again, reconcile the value with the previous value and every intervening cash flow. A strategy that gains wealth merely by rebalancing unchanged prices without external flows has an accounting error unless the model explicitly includes a source of return.

Short positions require borrow availability, fees, collateral, and treatment of dividends owed. A backtest that shorts every historically attractive loser assumes those shares were borrowable at acceptable cost. If data are unavailable, state that the study is a frictionless signal test or use a long-only design. Do not report a precise net implementable return while omitting an unknown dominant cost.

## 17.7 Transaction costs and capacity

Start with a transparent cost model: commission or fee per traded amount, spread-related cost, and perhaps an impact term tied to participation or traded volume. Calibrate from credible data where available and use a range when uncertain. Costs can depend on direction, size, volatility, liquidity, and time of day. A constant basis-point model is a simplification with a stated scope.

Turnover must match the cost convention. If weights move from (0.6, 0.4) to (0.4, 0.6), total absolute change is 0.4 and one-way turnover is 0.2. A cost of c per dollar bought or sold multiplies 0.4; a cost quoted for a one-way turnover convention may be parameterized differently. Test the calculation on one explicit buy and one sell before applying it to years of data.

Capacity asks how results change with scale. A strategy trading tiny illiquid securities can show attractive percentage returns at negligible capital and poor returns at institutional size. Compare proposed trades with volume and available depth under a defensible execution model. Position constraints and delayed fills can change the signal itself, so capacity analysis is part of strategy evaluation rather than a footnote.

## 17.8 Validation for overlapping and grouped observations

Financial datasets often have several rows per date, several securities per company, and labels extending over future intervals. Random row splitting can put nearly identical information in training and test. Group by appropriate entities and preserve time order. If a label spans t through t + h, remove training labels overlapping a validation interval when their outcomes would reveal validation-period information.

A gap can also address feature latency or dependence around a boundary, but its length should follow the information structure. An arbitrary large gap can waste data without solving a different leak. Record label start and end times explicitly so overlap rules can be checked rather than guessed.

An expanding-window evaluation mimics accumulating knowledge; a rolling window mimics a fixed-memory procedure. Compare only procedures that could have been run at the historical time. If hyperparameters are reselected every quarter, include that reselection in the backtest and account for its cost and uncertainty. A model selected once using the entire future period is a different procedure.

## 17.9 Multiple testing and robustness without endless searching

Keep a candidate ledger: signals tried, transformations, windows, universes, models, and reasons for rejection. Many choices can create an implicit search even without formal hypothesis tests. A final test period loses independence if its results repeatedly guide redesign. Reserve fresh data or qualify conclusions as exploratory after extensive adaptation.

Robustness checks should challenge plausible failure modes, such as publication lags, costs, universe definitions, sample subperiods, and parameter uncertainty. They should not become a search for the one variation that looks good. State which variations were planned and show adverse results. A model that works only under one narrow arbitrary convention is fragile evidence.

Placebo tests ask whether the method finds effects where the mechanism predicts none, using a justified construction. For an event study, a placebo date assignment must preserve relevant dependence and calendar structure. A careless permutation can create an unrealistic null. Negative controls and synthetic known-effect fixtures help distinguish pipeline errors from substantive findings.

## 17.10 Event studies and abnormal returns

An event study aligns observations around an event time and measures returns relative to a benchmark model. Estimate normal-return parameters over a pre-event estimation window, define an event window, and compute abnormal return AR_it = R_it − expected-model return_it. Cumulative abnormal return adds AR across the chosen short window under the stated convention. For long horizons, compounding and benchmark choice require additional care.

If the market model is R_it = alpha_i + beta_i R_Mt + epsilon_it, fit alpha and beta before the event, then calculate event-window residuals using those fixed estimates. Including the event window in the fit can absorb the effect being studied. Announcement timing determines day zero; after-hours announcements may map to the next trading session.

Confounding events, anticipation, overlapping events, cross-sectional dependence, and selection of newsworthy cases affect inference. A price move after an announcement is not automatically caused solely by that announcement. Report estimation uncertainty and event clustering, and define exclusion rules before reviewing outcomes. The synthetic event fixture in the examples has a known inserted shock so the extraction and alignment can be checked independently of causal interpretation.

## 17.11 Research communication and reproducibility

A research memo should lead with the question and result, including uncertainty and whether the evidence supports action. Then describe data, timing, method, baselines, costs, robustness, and limitations. Show enough detail for another researcher to reproduce the result without reconstructing hidden notebook state. Attach code, configuration, data dictionary, and permitted data snapshots or retrieval instructions.

Distinguish four claims: the implementation ran; it passed specified numerical checks; the model improved a metric on a particular held-out sample; and the strategy is suitable for deployment. Each requires additional evidence. A convincing memo can say “no reliable improvement found” and explain why. A promotional result that omits failed variants is less useful even if its plot is attractive.

Document what was not tested: alternative markets, rare crises, live fills, institutional funding, or future regimes. A limitation should narrow interpretation rather than serve as a generic disclaimer. For example, “individual-security delistings unavailable, so this study evaluates supplied factor series rather than a reconstructed stock-selection strategy” tells the reader exactly what conclusion is supported.

## 17.12 From research prototype to operational system

A production system adds data contracts, automated quality checks, monitoring, reproducible builds, failure handling, access control, and reconciliation. It needs a response when a feed is stale, a model produces invalid values, an order is rejected, or positions disagree with records. These are engineering requirements, not features that emerge from a high backtest Sharpe ratio.

Separate offline research evaluation from paper trading and from live trading. Paper trading can reveal timing and operational issues but may still have unrealistic fills. Live deployment introduces financial commitments and institution-specific authority. This curriculum delivers local learning tools and research projects; it does not place trades or authorize deployment.

For research roles, Python, probability, statistics, linear algebra, and clear empirical reasoning are central. Quant developer roles add algorithms, systems, performance engineering, and often C++ or another production language. Pricing roles can require deeper PDEs, numerical methods, interest-rate models, and calibration. The common core prepares further specialization rather than making every role identical.

## 17.13 A worked protocol for a filing-volatility question

Question: does a filing-derived feature improve next-week variance prediction beyond lagged variance? Population: a fixed, documented set of companies with required point-in-time filing and return coverage. Decision: the first eligible trading timestamp after public release plus a stated processing delay. Features: text length and a pre-specified dictionary count normalized by total tokens, constructed with training-only preprocessing. Target: sum of squared subsequent daily returns over five trading sessions.

Baseline: lagged realized variance and an EWMA forecast. Candidate: ridge regression on baseline features plus the filing features. Evaluation: chronological outer folds with overlapping-label exclusions, inner folds for ridge tuning, and a final untouched period. Primary loss: a specified variance-forecast loss; secondary analysis: calibration and subperiod stability. Costs are irrelevant to the pure forecast claim but would enter a later trading decision study.

Failure criteria: no stable held-out improvement, performance driven by one company, sensitivity to a plausible publication delay, or evidence that features encode future revisions. Report all of these even if one model variant looks favorable. This protocol turns the roadmap's broad project suggestion into a concrete research experiment.

The research laboratory demonstrates a deliberately leaked feature alongside a correctly lagged feature on synthetic data. It shows how an impossible information advantage can create impressive scores. The implementation labels the leaked case as invalid and computes both outcomes from the same underlying fixture. Its purpose is to make a methodological failure visible, not to propose a strategy.

### A three-day abnormal-return calculation

Suppose a pre-event market model estimates alpha = 0.001 per day and beta = 1.2. During three event days, market returns are 0.01, −0.005, and 0.002, while asset returns are 0.02, 0.01, and −0.003. Model normal returns are 0.013, −0.005, and 0.0034. Abnormal returns are therefore 0.007, 0.015, and −0.0064, with short-window cumulative abnormal return 0.0156, or 1.56%.

This arithmetic does not yet provide an uncertainty interval or a causal interpretation. Alpha and beta were estimated, event-day residuals can be dependent, and other news may have occurred. For several firms announcing on the same date, a common shock can make event returns correlated. Treating every firm-day as independent can overstate precision. The benchmark model and dependence structure determine the next inferential step.

### Survivorship bias in a tiny example

At the start of a year, three hypothetical funds each have 100 of capital. Their year-end values are 120, 110, and zero. Equal initial investment across all three ends at 230 from 300, a return of about −23.33%. If a database contains only the two surviving funds, their average return is +15%. The difference is entirely selection, not a disagreement about arithmetic.

The appropriate universe is determined by the historical decision opportunity. Today's index constituents cannot be substituted for past constituents when claiming to simulate historical selection. If a provider lacks dead entities, disclose that the analysis covers survivors and avoid broad population claims. A sophisticated estimator applied to a selected sample estimates something about that selected sample unless additional assumptions justify extrapolation.

### A cost break-even calculation

Suppose average gross active return is 12 basis points per month and full buy-plus-sell turnover is 1.5 times capital per month. Under a simple cost c per traded dollar, break-even c is 0.0012/1.5 = 0.0008, or eight basis points. If credible costs range from five to fifteen basis points, the economic conclusion is highly sensitive to execution assumptions.

This calculation is useful even before a detailed impact model. It identifies how accurate cost estimates must be to support the claim. Report performance across the plausible range rather than selecting the cheapest assumption. If the strategy's edge is smaller than uncertainty about costs, the research may support signal existence without supporting implementation.

### A walk-forward table is an audit artifact

For each forecast, store decision timestamp, training start and end, latest feature-availability timestamp, label start and end, model version, selected settings, prediction, realized target, and loss. For a strategy, also store intended and executed positions, price convention, traded amount, and costs. These rows make chronology inspectable without reconstructing the program's entire state.

A reviewer can sample a row and ask whether every feature existed before the decision and every training label ended before the relevant cutoff. Aggregate charts cannot answer those questions. A pipeline that emits this table makes timing errors easier to discover and later changes easier to compare.

### Reproducibility without redistributing restricted data

Some datasets cannot be included in a public or portable package. Provide a schema, small synthetic fixture, retrieval or placement instructions for authorized users, file hashes where appropriate, and a clear statement of required coverage. Keep private records and credentials out of examples. A synthetic fixture should exercise the same transformations and edge cases without pretending to reproduce the empirical result.

The present package follows that approach: original synthetic calculations run offline; official course and public-data links are inventoried; full copyrighted source books and videos are not republished. The catalog's access field distinguishes a discovered link from an individually verified target. This is provenance information, not a claim that every linked resource has been read end to end.

### Negative results can narrow the next experiment

If a candidate feature fails to improve held-out forecasts, inspect whether the study had enough power, whether the target matched the mechanism, and whether data timing was reliable. Do not automatically keep changing the model until a positive result appears. A well-supported negative result can eliminate a costly direction or motivate a specific better-measured target.

Write the next experiment as a new claim with a reason for the change. For example, if filing publication timing is only daily and the hypothesized response occurs intraday, the current data may be inadequate. A next study could obtain reliable timestamps rather than adding a neural network to the same ambiguous labels. Better measurement can be more valuable than a more flexible algorithm.

### Research handoff and review

A handoff should tell a collaborator what question was asked, what was found, how to reproduce it, and where the weakest assumptions lie. Include the exact command for the baseline run and the names of generated outputs. Separate confirmed results from proposed extensions. A reviewer should not mistake a future idea for an implemented feature.

When receiving criticism, trace it to an assumption, calculation, data field, or inference. Reproduce the disputed number on a small fixture. If the reviewer is correct, revise the analysis and all downstream outputs together. If the disagreement is about a modeling choice, show how conclusions change under both defensible choices. This makes research collaborative and cumulative rather than a contest over a single preferred result.

### A minimal results table should include failures

For every planned model, report sample dates, observation count, primary loss or return metric, uncertainty method, turnover where relevant, and a status such as completed, invalid timing, numerical failure, or insufficient data. Do not quietly remove a failed candidate from the record. A numerical failure can reveal a model's fragility, while an invalid-timing result should be excluded from performance claims and explained.

Use identical evaluation rows when comparing models unless a difference is explicitly part of the question. A model that drops difficult missing-data cases can appear better simply because it is scored on an easier subset. Report coverage alongside accuracy. If coverage differs, show a common-sample comparison and describe the deployment consequences of abstaining on some observations.

### Freeze the final artifact

After validation, regenerate figures, tables, and the memo from the same source version. A corrected return calculation can change every downstream metric, so editing only the headline number leaves an inconsistent report. Record a package hash and verify that the archive contains the code and outputs described. Reproducibility includes agreement among prose, figures, data transformations, and the actual delivered files.

A backtest is a conditional historical experiment. It combines a dataset, an information convention, a policy, and an execution model. Changing any one produces a different experiment. Preserve those definitions when comparing versions, and avoid interpreting a changed result as evidence about the market before checking the changed procedure.

A final memo should also state the intended population of future use. Evidence from large liquid equities in one region may not transfer to small securities, another market calendar, or a different disclosure regime. Transfer requires an argument about mechanisms, measurement, and costs, followed by new evaluation where possible. A broad model name such as linear regression or neural network supplies no such transfer guarantee. Restricting the claim to the studied setting is a precise scientific conclusion, not a weakness to hide.

## 17.14 Practice and source connections

Suggested applications: write a one-page factor-study protocol; build a data dictionary with observation and availability timestamps; trace a rebalance's cash flows; design an overlapping-label exclusion rule; specify a placebo event test; write a negative-result memo. Hints: another researcher should be able to implement the procedure without asking what “available,” “return,” or “cost” means.

Use the empirical assignments in [MIT 14.382](https://ocw.mit.edu/courses/14-382-econometrics-spring-2017/), the projects and investment exercises in [18.642](https://ocw.mit.edu/courses/18-642-topics-in-mathematics-with-applications-in-finance-fall-2024/), and the [CS229 assignments](https://see.stanford.edu/Course/CS229) as additional research training. The official-source catalog separates course assets from public-data references and records where direct access was blocked or only an index was inspected. The final chapter provides the concrete projects, assessment rubrics, and a realistic path to demonstrating independent quantitative competence.


<a id="chapter-18"></a>

# 18. Project studio and readiness

## 18.1 Readiness is demonstrated by work

Completing lectures is useful preparation, but independent competence requires building, checking, explaining, and revising an analysis. This studio turns the five projects in the supplied roadmap into concrete work products. It also adds a derivatives project, a constrained-portfolio study, and an integrated capstone so the mathematical and empirical paths meet.

“Quant ready” here means ready to undertake serious entry-level quantitative research tasks with appropriate supervision and to continue specialized study. It does not mean guaranteed employment, profitable trading, or equal preparation for every quantitative role. The evidence is a portfolio of reproducible projects, correct derivations, defensible assumptions, and the ability to diagnose failures without relying on a prewritten answer.

Each project has a synthetic route and a real-data extension. The synthetic route is fully reproducible offline and tests implementation against a known mechanism. The real-data route addresses an empirical question using documented official sources or data you are authorized to use. Passing the synthetic route does not establish a real market effect, while a real-data result without a correct pipeline is unreliable.

## 18.2 A humane multi-year study sequence

Plan roughly 1,800–2,400 hours including the original course lectures and assignments, this book, coding, review, and projects. This is a planning estimate rather than a measured promise. At 15–20 hours per week, a six-term, twenty-week structure provides about 120 weeks and room for a substantial college-level program. A learner starting with no algebra may need more time; a learner with strong prerequisites can test out of some foundation work by solving representative problems independently.

Term one studies Chapters 1–4 and the added algebra, calculus, and linear-algebra resources. Term two studies Chapters 5–8 with probability practice, Finance Theory I, and a first portfolio notebook. Term three studies Chapters 9–11 with the econometrics and time-series courses. Term four studies Chapters 12–14 with EE364A, the finance-mathematics courses, and derivatives simulations. Term five studies Chapters 15–17 with Analytics of Finance and CS229. Term six completes the project studio and a specialization-focused capstone.

A weekly pattern can reserve two sessions for new concepts, one for worked derivations, one for coding, one for exercises or source lectures, and one for review or project writing. Sessions can be 60–90 minutes with breaks. Do not read an entire substantial chapter in one sitting. Its numbered sections are study units. When a derivation uses an unfamiliar prerequisite, return to the relevant earlier section and work one small numerical example before continuing.

Use optional retrieval practice: reconstruct a definition, derive a formula without looking, or explain a failure case. The goal is diagnostic feedback, not a ritual score. Consult hints before full reference code. A failed attempt that reveals the missing assumption is useful progress. If reading feels fluent but writing a solution is impossible, slow down and make the intermediate steps explicit.

## 18.3 Project 1: portfolio analysis and accounting

Question: how did a defined portfolio behave over a stated sample, under explicit return and cash-flow conventions? Begin with the bundled synthetic price fixture. Compute consecutive simple returns, log returns where defined, cumulative wealth, mean, sample volatility, covariance, correlation, excess-return Sharpe ratio under a stated horizon, and maximum drawdown. Avoid annualization until the interval convention is specified.

Trace the small path 100, 105, 102, 108, 106 by hand. Normalized wealth ends at 1.06; maximum drawdown magnitude is approximately 2.8571%. Your program should match these results within a stated numerical tolerance. Multiplying all prices by ten should leave returns and normalized drawdowns unchanged. Adding a zero-return asset and assigning it zero weight should leave portfolio results unchanged.

Extend to two assets and a fixed initial allocation. Distinguish buy-and-hold share holdings from periodic rebalancing. For rebalancing, show pre-trade weights, target weights, traded amounts, costs, and post-trade cash. A constant-price fixture should not generate gains from rebalancing. Include at least one dividend or external-flow example and explain whether you report time-weighted or money-weighted return.

Deliver a notebook or script, a data dictionary, a chart with labeled units and dates, and a two-page memo. Acceptance requires correct known examples, cash reconciliation, explicit missingness and annualization conventions, and a clean rerun from raw inputs. The real-data extension can use appropriately licensed total-return data, but must record adjustment and survivorship limitations. A beautiful plot does not compensate for an unexplained denominator.

## 18.4 Project 2: factor analysis

Question: is a pre-specified factor associated with returns in the studied sample, relative to a stated benchmark? The simplest route uses official factor returns from the [Kenneth French Data Library](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html). Read the description, preserve the downloaded snapshot, parse units, align dates, and estimate a benchmark regression with an intercept and appropriate uncertainty.

The synthetic fixture generates a market factor and an asset return with a known intercept and beta plus noise. Fit OLS, inspect residual orthogonality, and compare estimated coefficients with the known mechanism under sampling uncertainty. A finite sample need not recover the exact true coefficient. The test is that the implementation matches a hand-computed small fit and behaves sensibly across repeated synthetic samples, not that every estimate equals its population target.

For a security-level characteristic sort, define the universe, formation window, publication lags, breakpoints, weights, rebalance dates, and subsequent holding returns. Momentum, value, size, and volatility each need a precise algorithm. Include delisting and corporate-action treatment. If you lack suitable point-in-time individual-security data, keep the project at the supplied factor-series level and state the narrower claim.

Report gross and, where defensible, net performance, benchmark exposures, subperiod results, turnover, uncertainty, and the number of variants tried. Acceptance requires a reproducible construction, training-only choices, explicit information timing, and an interpretation that distinguishes association, priced risk, and causal mechanism. A significant alpha is a benchmark-relative finding, not automatic proof of skill.

## 18.5 Project 3: an event study

Question: what abnormal return pattern occurred around a defined class of public events? Start with synthetic market and asset returns containing an inserted event shock. Fit the normal-return model on a pre-event estimation window. Define day zero from the event timestamp, calculate abnormal returns in a fixed window, and sum them under the stated short-horizon convention.

Use an estimation window such as event days −120 through −21 and an event window such as −1 through +1 as an explicit example, not a universal prescription. The gap can reduce contamination from anticipation under some hypotheses, but its choice should follow the question. For after-hours announcements, define how the next trading session becomes the relevant response interval. Avoid calendar-day indexing when markets are closed.

For real filings, use [SEC EDGAR documentation](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) and current access guidance. Record accession or stable identifiers, publication times, amendments, and duplicate handling. Exclude confounding events only under a pre-specified rule or report exploratory sensitivity. A selected collection of dramatic examples cannot estimate a representative average event effect.

Deliver an event table, estimation and event-window definitions, code, average and cumulative abnormal-return plots, uncertainty treatment, and a memo distinguishing descriptive response from causal attribution. Acceptance requires no event-window leakage into benchmark fitting, correct trading-session alignment, and checks for overlapping events and cross-event dependence. The synthetic reference result verifies extraction of the inserted shock; the real-data study can validly conclude that evidence is inconclusive.

## 18.6 Project 4: volatility forecasting

Question: which of several pre-specified variance forecasts performs best on future observations under a chosen loss? Compare a constant training variance, rolling historical variance, and lagged EWMA. Add GARCH only after the simple pipeline is correct. Define whether the target is next-day squared return, multi-day realized variance, or a higher-frequency proxy.

The synthetic fixture contains a low-volatility segment followed by a higher-volatility segment. For each date, forecast before observing that date's return. Update EWMA only after scoring the forecast. Inspect how quickly each method responds to the change and how noisy its forecasts become. Change a future return and verify that earlier forecasts remain identical.

Use identical evaluation dates, targets, and losses across models. Tune window lengths or decay rates inside earlier validation periods. If targets overlap, address overlap in splits and uncertainty. Report initialization and the sensitivity of results to plausible choices. A model that reacts quickly to one shock can also overreact to noise; the evaluation should show both behaviors.

Deliver a clean experiment table, forecast and realized-proxy plots, loss differences with a defensible uncertainty method, and an explanation of conditional versus unconditional volatility. Acceptance requires correct lagging, nonnegative forecasts, finite outputs, and comparison with simple baselines. A real-data extension should investigate event timing and market closures without presenting a descriptive volatility spike as a causal estimate.

## 18.7 Project 5: machine learning as incremental prediction

Question: do additional features improve a defined research target beyond a strong simple baseline? Use next-period variance or another clearly timed target. The synthetic fixture gives features available at t and a target at t + 1. One deliberately leaked feature is included only in the teaching laboratory and must be excluded from a valid model. Identify why it leaks before fitting anything.

Build a chronological training/validation/test split. Fit imputation, scaling, feature selection, and any PCA on training data only. Compare a constant or lagged-target baseline, a regularized linear model, and one nonlinear candidate. Choose the primary metric before viewing the final test. Preserve the number of tried settings and the selected configuration.

For a filing-text extension, use only documents public before the decision, construct vocabulary from training text, group related documents where needed, and exclude overlapping labels around validation boundaries. Predicting volatility is a research target; converting the forecast into a trading strategy is a separate decision study requiring costs and risk constraints.

Deliver a model card describing purpose, target, timing, features, splits, metrics, calibration, failure cases, and untested populations. Acceptance requires an independent test period, no full-sample preprocessing, a useful baseline, and uncertainty about incremental performance. A negative result with correct methodology passes; an attractive score produced by future information fails.

## 18.8 Project 6: derivatives and simulation

Question: do independent pricing methods agree under the same model, and how do numerical errors behave? Implement the two-state replication, Black–Scholes European call and put, terminal Monte Carlo, and one variance-reduction method. Handle zero maturity and zero volatility explicitly. Use the known call value approximately 10.4506 for S = K = 100, r = 5%, sigma = 20%, T = 1, and no dividends.

Verify put–call parity, bounds, monotonicity in spot and volatility, and the expected discounted stock relationship under Q. Report the Monte Carlo estimate, standard error, seed, and number of independent observations or antithetic pairs. Run a path-count study and show the approximate inverse-square-root uncertainty scaling without requiring every realized error to decrease monotonically.

Extend to discrete delta hedging. Track stock holdings and cash with financing and costs, and compare hedge-error distributions across rebalance frequencies. Explain which risk is discretization and which is model mismatch. If adding a barrier, specify monitoring and missed-crossing treatment. Acceptance requires independent known-case checks and a clear separation of P simulation for hedging outcomes from Q simulation for valuation.

## 18.9 Project 7: constrained portfolio optimization

Question: does a stable constrained optimizer improve a chosen objective relative to simple allocations under estimated inputs? Begin with a two-asset problem solved analytically. Verify the minimum-variance weight and boundary cases. Then formulate a multi-asset objective with budget, nonnegative weights or leverage limits, exposure bounds, and a transparent turnover penalty.

Estimate inputs only from the training window. Compare equal weight, minimum variance, and constrained mean–variance choices on future periods. Inspect solver status, feasibility residuals, objective components, and sensitivity to expected-return and covariance perturbations. Do not accept an extreme solution merely because the solver reports success.

Add a transaction-cost range and report how much improvement survives. If the result depends on one tiny eigenvalue or one estimated mean, diagnose the instability. Acceptance requires a correct small analytical case, an explicitly stated convex formulation where claimed, reproducible numerical checks, and realistic interpretation of estimation risk. An efficient frontier based on known synthetic parameters is a mathematical demonstration; an empirical frontier needs uncertainty analysis.

## 18.10 Capstone: one question, complete evidence

Choose a coherent question connecting at least three areas, such as a volatility forecast used in a risk-constrained allocation, an event study with factor controls and dependence-aware inference, or a derivative simulation with parameter estimation and hedge-risk analysis. Avoid combining every method merely to display breadth. A focused question permits stronger evidence and clearer interpretation.

The proposal should define the target claim, data feasibility, information set, baseline, estimator or pricing model, evaluation, risks, and expected limitations. Create a synthetic known-mechanism version before the real-data analysis. This catches accounting and timing errors when ground truth is available. Then freeze the main protocol and conduct the empirical study.

Deliver a reproducible repository or folder, README, environment record, data dictionary, provenance ledger, scripts or clean notebooks, figures, tests, and a research memo. The memo should explain the result in plain language, quantify uncertainty, show adverse checks, and identify what further evidence would change the conclusion. Include a failed-ideas log and a statement of which code paths and datasets were actually executed.

A reviewer should be able to rebuild outputs from permitted inputs, locate the assumptions behind each equation, and trace one observation from raw data to final metric. If they cannot, improve the artifact before adding another model. Reproducibility is part of the result.

## 18.11 Assessment rubric

Use five dimensions, each scored from zero to four. Mathematical correctness asks whether definitions, derivations, units, and numerical checks are sound. Data and timing asks whether provenance, availability, transformations, and splits match the claim. Methodology asks whether identification or prediction assumptions, baselines, uncertainty, and selection are handled. Implementation asks whether code is readable, reproducible, and tested against meaningful cases. Communication asks whether conclusions follow from evidence and limitations are specific.

A score of zero means absent or invalid; one means major unresolved gaps; two means a usable draft with important weaknesses; three means a defensible independent analysis; four means a particularly strong analysis with thoughtful alternatives and diagnostics. Aim for at least three in every dimension. An average cannot compensate for a zero in timing or correctness: a leaked model with excellent prose is still invalid.

Use the rubric for revision, not a claim of external certification. Have another person inspect at least one project when possible. Ask them to identify the strongest unsupported inference and reproduce a key number. If no reviewer is available, return after a delay and rerun from a clean environment using only the README. Treat every undocumented manual step as a defect to repair.

## 18.12 Core derivations to reconstruct independently

You should be able to derive compounded and discounted cash flows, the geometric-series annuity, the derivative and duration of a fixed-cash-flow bond, the variance of a weighted portfolio, the two-asset minimum-variance weight, and the OLS normal equations. Explain the assumptions behind each rather than presenting memorized formulas.

For probability and inference, reconstruct Bayes' rule, the variance of an independent sample mean, the bias–variance decomposition, a likelihood score, a confidence-interval interpretation, and the effect of autocovariance on long-run uncertainty. For econometrics, explain omitted-variable bias, IV relevance and exclusion, GMM moments, and why causal identification differs from prediction.

For advanced mathematics, derive an AR(1) forecast, one Kalman update, KKT conditions for a bounded quadratic, Brownian quadratic variation's basic moments, Itô's log-GBM correction, binomial replication, and a Monte Carlo standard error. For machine learning, derive linear and logistic gradients, one backpropagation step, an EM responsibility, and a Bellman update. Being able to explain where a formula fails is as important as obtaining it in its standard case.

## 18.13 Specialization after the common core

For quantitative research, deepen statistical learning, econometric identification, time-series inference, alternative data, and reproducible experimentation. For derivatives and pricing, deepen measure-theoretic probability, PDEs, numerical schemes, stochastic volatility, term-structure models, and calibration. For portfolio and risk, deepen constrained optimization, estimation risk, multi-period allocation, stress testing, and institutional constraints.

For quantitative development, add data structures, algorithms, software architecture, profiling, concurrency, systems, and a production language appropriate to the role. This book's Python research foundation is not a complete systems-engineering curriculum. For execution or market-making research, add order-book data, queue models, microstructure, inventory control, and realistic simulators. The available data and role requirements determine which path is feasible.

Interview preparation should follow mastery rather than replace it. Practice explaining a derivation aloud, coding a small calculation correctly, diagnosing a flawed backtest, and discussing a project whose result was uncertain or negative. Puzzle speed alone does not demonstrate the ability to conduct research, but clear reasoning under constraints is useful. Keep a concise portfolio with two or three deeply defensible projects rather than dozens of unexamined notebooks.

## 18.14 How to use the original courses completely

The course coverage matrix maps every major published topic family to chapters and external sections. Work through each course's available lectures and assigned problems after its prerequisite chapters. Some published syllabi recommend paid books or external readings; those are labeled separately and are not required purchases in this free path. An official resource index being accessible does not imply every linked file, dataset, or third-party site was individually read or remains available.

For 15.401 and 15.433, complete the valuation, portfolio, asset-pricing, efficiency, performance, and behavioral sections. For 18.642 and 18.S096, connect mathematical lectures with financial applications and choose a final-paper topic. For EE364A, solve formulation and duality problems as well as computational ones. For 14.382 and 14.384, do not skip identification, weak instruments, inference, nonstationarity, or Bayesian computation because they seem less immediately tradable. For 15.450, complete pricing, simulation, dynamic choice, and econometric material. For CS229, cover learning theory, generative and unsupervised methods, and reinforcement learning alongside supervised algorithms.

The resource catalog contains direct PDF, video, assignment, solution, code, and data links discovered on official pages, plus the pages where each was found. Use source solutions as feedback after attempting problems. This original textbook supplies the beginner bridge and connected explanations; the university problem sets provide a much broader bank of unfamiliar tasks. The two together make the program substantially deeper than a list of links or a short trading tutorial.

### Suggested milestones with observable evidence

After the foundation term, produce a short calculation notebook that converts units, compounds returns, discounts a cash-flow stream, differentiates a bond price, solves a linear system, and reads a validated CSV. Explain one domain restriction for every formula. This artifact tests whether the mathematical and computational languages connect before advanced material begins.

After probability and finance, produce the portfolio project and a two-page explanation of conditional probability, sampling error, diversification, and benchmark-relative performance. After econometrics and time series, produce a regression or forecast study that explicitly distinguishes its estimand from a causal effect and uses a defensible dependence-aware evaluation. After stochastic calculus and optimization, produce a pricing comparison and a constrained small optimization with an independent analytical check.

The final milestone is an integrated capstone with a clean rerun and a critical memo. These milestones do not require a positive trading result. They require correct reasoning, transparent evidence, and the ability to repair a discovered error. If a milestone exposes a missing prerequisite, return to that topic before adding more complexity.

### Hints for the most common project failures

If cumulative wealth disagrees with the normalized price fixture, inspect return indexing and dividend treatment. If regression coefficients are unstable, inspect rank, scaling, and sample variation before changing the optimizer. If a forecast looks implausibly accurate, inspect availability timestamps, target overlap, and full-sample preprocessing. If Monte Carlo differs from the closed form, inspect P versus Q drift, discounting, volatility units, and standard-error grouping.

If an optimized portfolio trades excessively, inspect expected-return noise, covariance conditioning, cost units, and constraints. If an event study finds large pre-event effects, inspect announcement timing, anticipation, benchmark estimation, and event selection. These are diagnostic starting points, not automatic explanations. Follow the evidence to the earliest incorrect or unsupported step.

### Using solutions without losing the learning task

Work a small instance independently, compare only the relevant intermediate step, then close the solution and reconstruct the argument. Copying a complete notebook can create recognition without transfer. After using the reference implementation, change the fixture or assumption and explain the expected effect before executing. That checks whether the relationship was understood.

The bundled Python examples provide reference calculations for synthetic projects. The original university solutions remain external links and should be consulted after attempting their problems. Neither source certifies a new empirical claim. Your own memo must explain why the method applies to your data and what would fail if its assumptions were violated.

### Maintaining the curriculum as a personal reference

Keep corrections and questions alongside the relevant chapter, with a date and a small example. When a library changes, update the version record and rerun affected examples; do not rewrite a timeless mathematical definition merely because an API changed. When a source link disappears, retain its title, course, and discovery page so an official replacement can be located without guessing.

The strongest long-term reference is not the longest collection of notes. It is a coherent set of explanations and verified examples you can use to solve unfamiliar problems. Preserve the derivations and failure cases that helped you understand an idea, then use the course catalog for deeper study when the next research question demands it.

### A short oral defense for each project

Explain the question in one minute without jargon, derive one central equation, trace one observation through the pipeline, and identify the most consequential assumption. Then answer a challenge: what would change if costs doubled, a feature arrived one day later, dependence increased, or the distribution shifted? A correct answer can be conditional or uncertain, provided the reasoning is explicit.

Finish by naming the strongest conclusion the evidence supports and one tempting conclusion it does not support. This exercise tests transfer across mathematics, computation, and communication. It is particularly useful before interviews or handing a study to another researcher because it exposes places where recognition has not yet become independent understanding.

For the final assessment, preserve both a successful calculation and a repaired mistake. Explain how the mistake was detected, what assumption or operation failed, and which downstream outputs changed after correction. This demonstrates the ability to maintain reliable research when the first implementation is imperfect, a skill more transferable than memorizing one polished reference result.

## 18.15 Final readiness review

Select one project and rebuild it from scratch without the reference implementation. Explain each data field, timing choice, equation, test, and conclusion. Change one assumption and predict the direction of its effect before rerunning. Identify a scenario in which the method would fail. Write a concise memo stating what is established, what remains uncertain, and what next experiment would be most informative.

If you can do that across portfolio analysis, inference, time series, derivatives, optimization, and one machine-learning study, you have a serious foundation for quantitative work. Continue to treat unfamiliar problems as new research rather than forcing them into a remembered template. The durable skill is the ability to connect a question to assumptions, mathematics, computation, and evidence, then communicate the limits of the answer precisely.



# References and study tools

See the [source ledger](SOURCES.md), [coverage matrix](COURSE-COVERAGE.md), [resource catalog](resources/RESOURCE-CATALOG.md), [glossary](GLOSSARY.md), and [verification report](verification.md). Full executable examples are in [core_labs.py](examples/core_labs.py); browser experiment implementations are in [labs.mjs](companion/labs.mjs).
