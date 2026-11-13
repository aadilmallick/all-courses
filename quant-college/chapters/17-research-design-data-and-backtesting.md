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
