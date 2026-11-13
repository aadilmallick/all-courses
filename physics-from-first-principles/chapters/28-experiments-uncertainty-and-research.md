# 28. Experimental physics, uncertainty and research

A pendulum swings almost periodically. The ideal small-angle model predicts $T=2\pi\sqrt{L/g}$. A timer gives a number close to that prediction, but closeness alone is not a scientific conclusion. How well was length known? Was timing one swing accurate enough? Was the angle small? Did the model account for the finite size of the bob? Could a clock offset imitate a physical effect?

Experimental physics develops a defensible chain from observations to a claim. This final chapter teaches that chain: a measurement definition, a record of evidence, an uncertainty model, an analysis procedure, checks against alternatives, and an honest conclusion. It also supplies laboratory projects and capstones that connect the subjects of the course. It assumes the probability, calculus and modeling tools already developed, and introduces the required data-analysis machinery locally.

## 1. An observable must be operationally defined

“Pendulum length” could mean string length, distance from the support to the bottom of the bob, or distance from the pivot to its centre of mass. The point-mass pendulum formula uses pivot-to-centre-of-mass distance for an approximately compact bob on a light string. If you measure another distance without modeling the difference, an apparently precise experiment may test the wrong equation.

An operational definition says how a quantity is obtained. Define a period as elapsed time for $N$ complete cycles divided by $N$, using the same direction of passage through a fixed reference each time. A left-to-right crossing and the next right-to-left crossing are half a cycle apart. The definition prevents a factor-of-two error before any calculation begins.

Record the apparatus, settings, dates, environment, units, calibration, raw readings, and decisions made during the work. Keep raw observations separate from transformed quantities. If a time is corrected for a known clock factor, preserve both the recorded time and the corrected value. A scientific notebook should make it possible to reconstruct the inference, including changes of mind.

Do not delete a reading merely because it disagrees with the expected law. An independently documented event, such as the bob hitting a support, can justify excluding a trial from a specified analysis. A rule invented after seeing an inconvenient result risks turning expectation into evidence. Report exclusions and their reasons.

## 2. Repeated measurements and sample spread

Let $x_1,\ldots,x_n$ be repeated readings of the same stable quantity under comparable conditions. Their arithmetic mean is

$$\bar x=\frac1n\sum_{i=1}^n x_i.$$

The sample variance is

$$s^2=\frac1{n-1}\sum_{i=1}^n(x_i-\bar x)^2.$$

The denominator is $n-1$ because estimating the mean consumes one independent degree of freedom: the deviations sum to zero. For independent readings drawn from a common distribution with finite variance, this formula is an unbiased estimator of that distribution's variance. Independence and stability are assumptions, not consequences of writing the formula.

For readings 1.98, 2.00 and 2.02 s, the mean is 2.00 s. Squared deviations sum to $0.0008$ s², so $s^2=0.0004$ s² and $s=0.020$ s. The standard deviation describes variation of individual readings. The estimated standard error of the mean is $s/\sqrt n\approx0.01155$ s if the independence assumptions apply. It describes the mean's sampling variability, not the spread of individual measurements.

Repeating one hundred times does not necessarily reduce all uncertainty by ten. A fixed ruler offset affects every reading together. A slowly drifting oscillator correlates successive observations. Treating correlated observations as independent can create impressive-looking but unjustified precision.

## 3. Random variation, calibration and systematic effects

Random variation describes outcomes that fluctuate between trials under the measurement model. Systematic effects shift readings in a shared or structured way. The distinction concerns how an effect enters an analysis, not whether it is morally worse or always knowable. A calibration offset can itself have uncertainty described probabilistically.

Suppose a clock is known to run fast by factor $1+\epsilon$, so it reports $t_{\mathrm{read}}=(1+\epsilon)t_{\mathrm{true}}$. Correct by dividing by $1+\epsilon$. If $\epsilon$ is uncertain, that uncertainty contributes to every corrected time and creates correlation between them. It will not vanish by repeating the timing with the same clock.

Instrument resolution is another component. If rounding is the only error and the true value is equally likely anywhere within a display bin of width $q$, the rounding error has a uniform distribution on $[-q/2,q/2]$. Its variance is $q^2/12$ and its standard deviation is $q/\sqrt{12}$. This estimate depends on the uniform-error model. Resolution alone does not establish calibration accuracy, and a manufacturer specification is not automatically a standard deviation.

Build an uncertainty budget listing each contribution, its assumed distribution or evidence, its sensitivity coefficient, and its correlation with other contributions. An explicit imperfect model is more useful than an unexplained string of decimal places.

## 4. Propagating uncertainty through a calculation

For a derived quantity $y=f(x_1,\ldots,x_k)$, small input deviations give the first-order expansion

$$\delta y\approx\sum_i\frac{\partial f}{\partial x_i}\delta x_i.$$

Each partial derivative holds the other inputs fixed. Squaring and taking expectations gives

$$\sigma_y^2\approx\sum_i\left(\frac{\partial f}{\partial x_i}\right)^2\sigma_i^2
+2\sum_{i<j}\frac{\partial f}{\partial x_i}\frac{\partial f}{\partial x_j}\operatorname{Cov}(x_i,x_j).$$

For random variables $X,Y$ with finite second moments, covariance is defined by $\operatorname{Cov}(X,Y)=\mathbb E[(X-\mathbb E X)(Y-\mathbb E Y)]$, where $\mathbb E$ denotes the probability-weighted average from Chapter 14. It measures shared fluctuations: deviations with matching signs give positive contributions and opposite signs give negative contributions. Its units are the product of the input units, so every term in the propagation formula has units of $y^2$. It is zero for independent inputs with finite variances, but uncorrelatedness does not in general imply independence. The formula is a local approximation; large errors, strong nonlinearities, boundaries, or highly non-Gaussian input distributions may require direct propagation by sampling or a more complete likelihood model.

For $y=ab$ with independent small relative uncertainties, the variance approximation becomes

$$\left(\frac{\sigma_y}{y}\right)^2\approx
\left(\frac{\sigma_a}{a}\right)^2+
\left(\frac{\sigma_b}{b}\right)^2.$$

This formula uses nonzero nominal $a,b$. For a product or ratio near zero, use absolute sensitivities instead of dividing by a nearly vanishing value. Errors are added in quadrature because independent zero-mean fluctuations have variances that add, not because uncertainty is always a geometric triangle.

For pendulum gravity $g=4\pi^2L/T^2$, logarithmic differentiation yields fractional sensitivity $\delta g/g\approx\delta L/L-2\delta T/T$. With independent uncertainties,

$$\frac{\sigma_g}{g}\approx\sqrt{\left(\frac{\sigma_L}{L}\right)^2+4\left(\frac{\sigma_T}{T}\right)^2}.$$

For $L=1.000\pm0.002$ m and $T=2.006\pm0.004$ s, treating the quoted uncertainties as standard deviations gives $g\approx9.81065$ m/s² and fractional standard uncertainty about 0.004465, or absolute uncertainty about 0.0438 m/s². Reporting roughly $9.81\pm0.04$ m/s² fits this illustrative budget. It does not yet include model errors such as finite amplitude or bob geometry.

## 5. Correlation can help or hurt

Suppose two positions are measured with the same ruler and share a common zero offset $b$. The readings are $X_1=x_1+b+e_1$ and $X_2=x_2+b+e_2$. Their difference is $X_2-X_1=x_2-x_1+e_2-e_1$: the common offset cancels exactly. Treating the two offset uncertainties as independent would overestimate the uncertainty of the difference.

A common scale error behaves differently. If readings are multiplied by an uncertain factor, differences retain that factor. Distinguishing offset and scale is therefore physically meaningful. In an uncertainty budget, do not reduce every calibration effect to one generic “instrument error” when its structure matters.

For the mean of correlated readings, $\operatorname{Var}(\bar x)=n^{-2}\sum_{ij}\operatorname{Cov}(x_i,x_j)$. If all pairs share a common offset variance $\sigma_b^2$ while independent noise has variance $\sigma_e^2$, the mean's variance is $\sigma_b^2+\sigma_e^2/n$. Repetition suppresses the independent part and leaves the shared part. This equation formalizes a limitation that repeated timing alone cannot overcome.

## 6. Fitting a line from a physical model

For a small-angle pendulum, squaring the period formula gives $T^2=(4\pi^2/g)L$. A plot of $Y=T^2$ against $X=L$ should therefore be linear under the ideal model. We may initially fit $Y=a+bX$ with a free intercept to diagnose offsets or model discrepancies. Forcing the intercept to zero without justification can bias the slope.

For independent errors in $Y$ with equal variance and negligible $X$ errors, least squares minimizes

$$S(a,b)=\sum_i(Y_i-a-bX_i)^2.$$

Setting its derivatives with respect to $a$ and $b$ to zero gives $a=\bar Y-b\bar X$ and

$$b=\frac{\sum_i(X_i-\bar X)(Y_i-\bar Y)}{\sum_i(X_i-\bar X)^2}.$$

The denominator must be nonzero: measuring only one length cannot determine a slope independently of an intercept. These equations derive the fit from a stated error model and loss function. A computer's trend line uses assumptions too, even when the interface hides them.

Consider deliberately synthetic data, created for instruction rather than measured:

| $L$ (m) | $Y=T^2$ (s²) |
| --- | --- |
| 0.25 | 1.03 |
| 0.40 | 1.65 |
| 0.55 | 2.25 |
| 0.70 | 2.83 |

The means are $\bar X=0.475$ m and $\bar Y=1.94$ s². The denominator is 0.1125 m² and numerator 0.4500 m s². Thus $b=4.00$ s²/m and $a=0.040$ s². Residuals, observed minus fitted $Y$, are $-0.01,+0.01,+0.01,-0.01$ s². Their sum is zero, as expected for a free-intercept least-squares fit.

If we interpret the slope using the ideal relation, $g=4\pi^2/b=9.86960$ m/s². The nonzero intercept deserves investigation rather than automatic physical interpretation. A fit parameter is a description of the chosen model's agreement with data; it does not tell us by itself what caused a discrepancy.

## 7. Fit uncertainty, weights and residuals

Under the equal-independent-Gaussian-error model, estimate residual variance by $s^2=S/(n-2)$ because two parameters were fitted. The synthetic example has $S=0.0004$ s⁴ and $n-2=2$, so $s^2=0.0002$ s⁴. The estimated slope standard error is

$$s_b=\frac{s}{\sqrt{\sum_i(X_i-\bar X)^2}}\approx0.04216\,\mathrm{s^2/m}.$$

First-order propagation gives $s_g\approx g(s_b/b)\approx0.1040$ m/s². With only four synthetic points, this estimated precision should not be mistaken for a robust real-world gravity measurement. It illustrates the calculation under its assumptions.

When standard uncertainties $\sigma_i$ differ, minimize weighted squared residuals $\chi^2=\sum_i[(Y_i-f(X_i))/\sigma_i]^2$. The weights are $1/\sigma_i^2$. For a correct model and independent Gaussian errors with correctly known variances, the expected minimized chi-square is approximately the number of data points minus the number of fitted independent parameters in a regular linear setting. A reduced chi-square near one is a diagnostic, not proof that a model is true.

Transforming data can change its error structure. If $Y=T^2$, small time uncertainty gives $\sigma_Y\approx2T\sigma_T$. Equal uncertainty in $T$ therefore does not generally mean equal uncertainty in $Y$. Length uncertainty can also matter. When both axes have appreciable errors, ordinary vertical least squares is not enough; use an errors-in-variables or direct measurement model.

Always plot residuals against the independent variable and, when relevant, against time or trial order. Curvature can indicate a missing nonlinear term. A trend with trial order can indicate drift. A single large point can indicate a genuine fluctuation or a documented apparatus problem. Residual patterns often carry more physical information than a visually impressive best-fit line.

## 8. Intervals, tests and responsible claims

A standard uncertainty is not automatically a 95% interval. For a known Gaussian sampling distribution, approximately 1.96 standard errors gives a two-sided 95% interval for a mean. When variance is estimated from few Gaussian observations, Student's $t$ distribution gives a wider interval. Non-Gaussian or correlated data require other treatment.

A frequentist 95% confidence procedure has 95% coverage over hypothetical repetitions under its assumptions. Once a particular interval has been computed, the conventional frequentist statement is not a 95% probability assigned to the fixed parameter. A Bayesian credible interval does assign probability conditional on a prior and likelihood. These frameworks answer related but distinct questions and should not be mixed silently.

A small $p$ value measures incompatibility of data with a specified null model according to a specified statistic; it is not the probability that the null hypothesis is true. A large $p$ value does not prove the model. For most beginner laboratory work, an estimate with a clear uncertainty budget and residual analysis is more informative than a ritual threshold declaration.

Compare a measured discrepancy with all relevant uncertainty sources, including reference-value uncertainty when appreciable. Agreement within uncertainty means the experiment has not resolved a disagreement at that scale. It is not a demonstration of unlimited exactness. Reporting a null result can be valuable if it establishes a meaningful bound with a valid method.

## 9. Laboratory A: pendulum modeling

Use a string, compact bob, ruler and clock, with enough clearance for small unobstructed swings. Measure pivot-to-centre distance. Choose several substantially different lengths, repeat timing for many complete cycles at each, and record initial angle. Averaging many cycles reduces the effect of a fixed start/stop timing uncertainty on the inferred single period. It does not remove drift or an incorrect cycle count.

Fit $T^2$ against $L$ using a model appropriate to the transformed uncertainties. Estimate $g$ from slope, and compare free-intercept and physically motivated fits. Inspect residuals. Repeat at a noticeably larger angle to test the small-angle approximation; Chapter 7 explains why period grows with amplitude. Keep length and bob geometry constant during that comparison.

Your report should include raw elapsed times, cycle counts, lengths, angle estimates, fit equations, uncertainty budget, residual plot and a conclusion about which model features the observations can distinguish. Do not present the companion's ideal pendulum output as measured evidence. It is a model prediction to compare with independently collected observations.

## 10. Laboratory B: damping and resonance

A hanging mass on a suitable spring or an oscillating ruler can show decaying motion. Record displacement versus time with a fixed camera view and a visible length reference, or use repeated manual amplitude readings where precision allows. Define the equilibrium position before measuring amplitudes. The weakly damped linear model predicts an approximately exponential amplitude envelope and a nearly constant damped frequency.

Plot amplitude against time and compare with $A_0e^{-\gamma t}$. A log-amplitude plot should be linear only where the amplitude remains positive and measurements have suitable uncertainty. Noise near zero amplitude can strongly bias logarithms. Fitting the original amplitude model may better represent the actual error distribution.

Compare viscous damping with a model of nearly constant friction if the observations suggest it. Their envelopes differ. State which motion range was analyzed and whether the measurement method can resolve the difference. The goal is model discrimination, not obtaining the expected curve by selecting only agreeable data.

## 11. Laboratory C: circuits and time constants

With an ordinary low-voltage battery, resistor, capacitor and suitable voltage meter, record a charging or discharging curve. Use the circuit and component ratings appropriately; this exercise uses a battery circuit. The ideal discharge law is $V(t)=V_0e^{-t/(RC)}$. Measure or estimate the meter's input resistance, because it can alter the effective discharge path.

Define time zero consistently, record voltages with elapsed times, and estimate $\tau=RC$ from a direct nonlinear fit or a carefully justified logarithmic transformation. Include resistor tolerance, capacitor tolerance, meter effects and timing uncertainty. A capacitor's nominal printed value is not an exact independently established capacitance.

Compare the inferred time constant with the component prediction and its uncertainty. If discrepancies remain, examine leakage, loading, switching delay, nonideal capacitor behavior and time resolution. The companion's RC experiment gives a reference ideal curve; it cannot establish the properties of your actual components.

## 12. Laboratory D: waves and diffraction

Sound recorded on a phone or computer provides accessible frequency data. Record a sustained tone and compare its waveform with a Fourier decomposition. Record the sample rate. The highest unaliased frequency for ideal bandlimited sampling is half the sample rate; real recording systems require anti-alias filtering and have their own response. A spectral peak can reflect the source, the room or the microphone.

For a purely numerical optics experiment, vary slit width and wavelength in the companion's diffraction model and measure the predicted first minimum. Test $\sin\theta=\lambda/a$ where a single-slit minimum exists. Distinguish this model experiment from a physical diffraction measurement. If actual optical apparatus is available, use its established laboratory procedure and record alignment, geometry and detector response.

The common scientific task is extracting a scale from structure: oscillation frequency from a time trace or aperture size from an angular intensity pattern. Include resolution limits. A finite recording duration limits frequency discrimination, and a finite observation window can create spectral leakage. Chapter 8 explains why the measurement window itself has a Fourier effect.

## 13. Laboratory E: counting and distributions

Collect counts of a clearly defined ordinary event in fixed intervals, or use the included explicitly synthetic count model when no suitable physical process is available. Specify what counts as one event and how overlapping events are handled. For a stationary independent-event Poisson model, mean and variance of counts over equal intervals should match in the population. Small samples need not show equality exactly.

Compare a histogram with the model, examine trial-order dependence, and estimate the rate. A changing mean rate creates extra variation even when events are locally Poisson. Detector dead time can reduce recorded counts and alter their distribution. Do not infer quantum randomness merely because a histogram resembles a familiar curve; the measurement mechanism and alternative models matter.

For synthetic data, report the generation rule and seed. Use it to verify an analysis method or explore expected variation. It is not a substitute for physical evidence. The ability to distinguish simulated data from observations is part of experimental integrity.

## 14. Laboratory F: quantum spectra and reproducible public data

A serious extension is to analyze an openly documented atomic spectrum or another appropriate public physics data set. Record the original source, measurement conditions, units, calibration and data license. Verify the exact data resource before using it; this chapter does not bundle an uninspected observational data set. Synthetic energy levels in the companion are clearly labeled model outputs.

For hydrogen-like spectra, compare observed transition energies with $E_n=-C/n^2$ at the approximation level of Chapter 21. Identify the assumptions: reduced mass, ignored fine structure, calibration, line identification and possible broadening. A broad peak's centre and its width answer different questions. Fit line profiles only with a justified detector and broadening model.

The deliverable is an analysis that another learner can reproduce from the recorded source and procedure. If access to a suitable data set is unavailable, perform the synthetic verification and label the observational stage incomplete. Never invent measurements to make a project appear finished.

## 15. Capstones that combine the course

Choose one substantial capstone rather than rushing through all of them. In a mechanics capstone, compare a nonlinear pendulum model with recorded or carefully labeled synthetic trajectories. Derive the equation from Chapter 11's action, solve it with Chapter 27's convergence checks, and compare period-amplitude behavior with Chapter 7. Separate numerical, measurement and model uncertainties.

In an electromagnetic capstone, model an RLC transient, derive its energy balance, compare underdamped and overdamped cases, and estimate parameters from a trace. Link oscillation mathematics, circuits and data fitting. A valid result includes residuals and identifiable parameters, not just an attractive overlay.

In a thermal capstone, analyze cooling or diffusion with controlled initial and boundary conditions. Derive a lumped-temperature model and identify when spatial gradients make it fail. Compare with the diffusion equation numerically and establish a resolution study. The experiment need not resolve every material coefficient independently; report which combinations it does constrain.

In a quantum capstone, construct a finite-difference one-dimensional Hamiltonian, verify the infinite-well limit, demonstrate grid convergence, and investigate a double well or barrier. Compare exact diagonalization within the discretized model with a two-state approximation. This is a computational physics project; physical claims about a real material require additional validation.

For a graduate bridge, derive a Green-function response or a field-theory conservation law from Chapter 26 and apply it to one well-defined boundary or initial-value problem. Show assumptions, function domains, normalization, dimensional checks and a limiting case. Depth on one problem is more valuable than collecting advanced terminology.

## 16. What counts as demonstrated mastery

A defensible capstone has a precise question, a derived model, independent checks, reproducible analysis and a conclusion proportional to the evidence. A reader should be able to identify which equations are physical postulates, which results follow mathematically, which numbers are measured, and which are simulated. If those categories blur, the report needs revision.

To assess your own progress, try explaining a derivation without reading it, solving a new problem with altered assumptions, and diagnosing a deliberately broken model. Ask a knowledgeable person to challenge your reasoning when possible. Feedback from real discussion and laboratory work develops skills that a written course cannot certify on its own.

Completing this book gives substantial contact with undergraduate core physics and selected tools used in graduate study. Degree-level competence also depends on sustained unfamiliar problem solving, laboratory judgment, mathematical fluency, communication and supervised research experience. Use the projects to build evidence of those abilities. Reading the last page is a milestone in study, not an automatic credential.

## Optional practice

See [28-hints](../solutions/28-hints.md) and [28-solutions](../solutions/28-solutions.md).

1. Find the mean, sample standard deviation and standard error of 1.98, 2.00 and 2.02 s. State the independence assumption.
2. Derive $q/\sqrt{12}$ for uniform rounding error across a bin of width $q$.
3. Propagate independent uncertainties for $g=4\pi^2L/T^2$ and explain why timing enters with coefficient two.
4. Show why a common additive ruler offset cancels in a measured difference but a common multiplicative scale error does not.
5. Reproduce the synthetic pendulum line fit, residual sum of squares and slope standard error.
6. If $T$ has the same standard uncertainty at all lengths, explain why $T^2$ generally requires unequal weights.
7. An experimental curve agrees with a simulation after fitting three free parameters to four points. Explain why that agreement alone provides weak model validation and propose stronger checks.
8. Draft a one-page capstone question, assumptions, measurements or synthetic inputs, numerical checks, uncertainty budget, expected deliverables and criteria for an inconclusive result.

## Source connection

Feynman's preface describes lectures, discussion and laboratory work as parts of a wider course. This chapter supplies original experiments and analysis guidance alongside the lecture-inspired concepts. University experimental physics also requires sustained apparatus work and reporting; the [MIT Junior Lab course overview](https://ocw.mit.edu/courses/8-13-14-experimental-physics-i-ii-junior-lab-fall-2016-spring-2017/) is a benchmark for the scope of that experience. The projects here are instructions for your future work, not claims that measurements have already been performed.
