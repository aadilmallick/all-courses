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
