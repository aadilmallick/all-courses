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
