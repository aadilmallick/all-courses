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
