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
