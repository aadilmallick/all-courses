# 27. Computational physics and numerical reliability

An equation can be understood without having a convenient closed-form solution. The orbit of two idealized bodies is tractable; the motion of several interacting bodies generally requires numerical work. A nonlinear oscillator, a realistic material, or a measured data set presents the same challenge. Computation turns mathematical rules into finite procedures, but finite procedures introduce approximation. This chapter teaches how to make those approximations visible and testable.

You can use the included browser experiments without programming. The algorithms below explain what those experiments do and give a foundation for writing your own. We use calculus from Chapter 3, differential equations from mechanics, probability from Chapter 14, and linear algebra from Chapter 19. New numerical ideas are derived here rather than assumed.

## 1. A computer represents a model, not nature itself

A simulation contains at least three distinct objects: a physical model, a mathematical problem built from that model, and a finite algorithm approximating that problem. For a falling body, the model might ignore air drag, the mathematical equation might be $\ddot y=-g$, and the algorithm might update position at regularly spaced times. A numerical answer can be accurate for that equation while disagreeing with an actual feather because the model omitted the dominant physics.

Verification asks whether the algorithm solves the specified mathematical problem with the intended accuracy. Validation asks whether that mathematical problem represents the physical situation well enough for its intended use. Comparing a solver with an exact oscillator trajectory is verification. Comparing a pendulum model with measured motion is validation. Both matter, and success at one does not establish the other.

Reproducibility requires recording input values, units, initial and boundary conditions, algorithm, step size or resolution, stopping conditions, and any random seed. A plot without that information is a picture of an undocumented procedure. The companion's displayed parameters and reset buttons make these records easier, but a laboratory notebook should still record which question the computation answered.

## 2. Floating-point numbers and finite precision

Most scientific calculations use floating-point numbers: a sign, a finite significand and an exponent. This resembles scientific notation, but common computers use base two. Consequently some simple decimal fractions, including 0.1, do not have an exact finite representation. Arithmetic generally rounds each result to a nearby representable number.

For the double-precision format used by ordinary JavaScript numbers, the relative spacing near one is about $2.22\times10^{-16}$. This is not a universal bound on a whole computation's error. Many operations, badly scaled problems, or subtraction of nearly equal numbers can amplify rounding dramatically. The finite number range also creates overflow for numbers too large to represent and underflow for extremely small magnitudes.

Consider subtracting measured lengths 1.000001 m and 1.000000 m. Their difference is $10^{-6}$ m. If each input has uncertainty $10^{-6}$ m, the difference is not known accurately, however many decimal places a calculator displays. The analogous numerical problem occurs when rounded inputs are subtracted: leading digits cancel and the remaining small difference can have a large relative error. This is cancellation.

Sometimes algebra removes it. The expression $\sqrt{1+\epsilon}-1$ loses precision for very small positive $\epsilon$. Multiply numerator and denominator by $\sqrt{1+\epsilon}+1$ to get

$$\sqrt{1+\epsilon}-1=\frac{\epsilon}{\sqrt{1+\epsilon}+1}.$$

The second form avoids subtracting nearly equal numbers and approaches $\epsilon/2$ transparently. Algebraic equivalence in exact mathematics does not guarantee equivalent numerical behavior.

## 3. Conditioning and algorithmic stability

A problem is ill-conditioned when a small change in its inputs can produce a large relative change in its answer. An algorithm is unstable when its own errors grow excessively compared with the sensitivity inherent in the problem. These are different diagnoses. Improving an algorithm cannot eliminate uncertainty already amplified by the underlying question.

For a scalar function $y=f(x)$ away from zero, linearization gives $\delta y\approx f'(x)\delta x$. Dividing by $y$ and by the relative input error suggests the relative condition number

$$\kappa(x)=\left|\frac{x f'(x)}{f(x)}\right|.$$

For $f(x)=x^2$, $\kappa=2$ when $x\ne0$: a one-percent small input error produces approximately a two-percent output error. For $f(x)=1/(1-x)$, $\kappa=|x/(1-x)|$, which grows without bound as $x$ approaches one. The denominator's near cancellation is a property of the question itself.

Near zero outputs, relative conditioning is often unhelpful. Use absolute sensitivity and meaningful physical scales instead. An orbit whose coordinate crosses zero is not automatically unreliable because a relative coordinate error spikes there. Compare position error with orbital radius or with a specified spatial tolerance.

## 4. Numerical differentiation

The derivative definition suggests a forward difference,

$$D_hf(x)=\frac{f(x+h)-f(x)}h.$$

Taylor expansion gives $f(x+h)=f(x)+hf'(x)+h^2f''(x)/2+\cdots$, so the leading truncation error is proportional to $h$. A centred difference uses both sides:

$$C_hf(x)=\frac{f(x+h)-f(x-h)}{2h}=f'(x)+\frac{h^2}{6}f'''(x)+\cdots.$$

The odd and even Taylor terms cancel differently, leaving leading error of order $h^2$. “Order $h^2$” means the error scales approximately with $h^2$ as $h$ becomes small within a regime where the neglected higher terms and rounding are controlled.

For $f(x)=x^3$ at $x=2$, the exact derivative is 12. The forward formula gives $12+6h+h^2$. With $h=0.1$ it gives 12.61. The centred formula gives $12+h^2$, or 12.01. Reducing $h$ to 0.05 reduces the centred error to 0.0025, a factor of four. This is an actual convergence prediction, not merely a hope that smaller steps are better.

But rounding errors in $f(x+h)$ and $f(x-h)$ are divided by $h$. A rough error model is $Ah^2+B\varepsilon/h$ for the centred method, where $\varepsilon$ describes input arithmetic precision and the constants depend on function scale. At sufficiently small $h$, the second term grows. Differentiating noisy experimental data can be even worse because measurement noise is much larger than machine rounding. Smoothing must be justified by a physical or statistical model; it is not permission to erase inconvenient structure.

## 5. Numerical integration

An integral is already a limit of sums, so finite sums are natural approximations. Divide $[a,b]$ into $N$ equal intervals of width $h=(b-a)/N$. The composite trapezoidal rule replaces each small curve segment by a straight line:

$$T_N=h\left[\frac{f(a)+f(b)}2+\sum_{j=1}^{N-1}f(a+jh)\right].$$

The endpoints have half weight because each belongs to only one small trapezoid; internal samples are shared by two. For a sufficiently smooth integrand, the global error scales as $h^2$. For $f(x)=x^2$ on $[0,1]$, the exact integral is $1/3$. Two subintervals give $0.5[0.5+0.25]=0.375$. Four give 0.34375. Their errors, $1/24$ and $1/96$, differ by a factor of four.

Simpson's rule fits quadratic pieces over pairs of intervals. For even $N$,

$$S_N=\frac h3\left[f_0+f_N+4\sum_{\substack{j\ \mathrm{odd}}}f_j+2\sum_{\substack{j\ \mathrm{even}\,,\ 0<j<N}}f_j\right].$$

Here $f_j=f(a+jh)$. Under suitable fourth-derivative smoothness it has global error of order $h^4$. It integrates every polynomial of degree at most three exactly in exact arithmetic. Higher order is useful when its hypotheses hold. A jump, cusp or narrow unresolved peak can defeat an optimistic error estimate. Split an integral at known discontinuities and resolve the relevant physical scales.

Adaptive integration compares approximations on an interval and its subdivisions, spending more work where estimated error is larger. An error estimate is model-dependent; two coarse rules can agree while both miss a narrow peak. Inspect the integrand and use physical scale information rather than relying entirely on one stopping number.

## 6. Finding roots by a bracket

Many predictions are implicit: an equilibrium satisfies $F(x)=0$, an eigenenergy satisfies a boundary condition, and a fitted parameter may satisfy an optimization condition. If continuous $F$ has opposite signs at endpoints $a,b$, the intermediate value theorem guarantees at least one root between them.

Bisection evaluates the midpoint $m=(a+b)/2$ and keeps the half whose endpoints still have opposite signs. After $n$ steps the interval width is $(b-a)/2^n$. Reporting the midpoint gives position error at most half that width, provided the assumptions hold. This is a rigorous geometric error bound, not a probabilistic confidence statement.

For $F(x)=x^2-2$ on $[1,2]$, $F(1)<0$ and $F(2)>0$. The first midpoint 1.5 has positive $F$, so keep $[1,1.5]$. The next midpoint 1.25 has negative $F$, so keep $[1.25,1.5]$. After ten steps the interval width is $1/1024$, so midpoint error is at most $1/2048\approx0.0004883$. Uniqueness follows here because $x^2-2$ is strictly increasing on this positive interval.

A sign change across a discontinuity does not guarantee a zero: $F(x)=1/x$ changes sign across zero but is undefined there. A root of even multiplicity, such as $(x-1)^2=0$, may not change sign at all. Bracketing is reliable within its hypotheses, not universal.

## 7. Newton iteration and residuals

The tangent approximation $F(x+\delta)\approx F(x)+F'(x)\delta$ suggests choosing $\delta=-F(x)/F'(x)$. This gives Newton's iteration

$$x_{n+1}=x_n-\frac{F(x_n)}{F'(x_n)}.$$

For $F(x)=x^2-2$ and $x_0=1.5$, the next value is $1.5-0.25/3=1.4166667$. The following value is about 1.4142157. Near a simple root with nonzero derivative and adequate smoothness, the error often decreases quadratically: each small error is replaced by a constant times its square. Far away, the iteration can diverge, cycle, leave the permitted domain, or divide by a nearly zero derivative.

Check both the step size and the residual $|F(x_n)|$. A tiny step can reflect failure to move, not a genuine root. A small residual may still permit a large root error if $F'$ is small. If a bracket exists, safeguard Newton steps by rejecting those that leave it and falling back to bisection. This combines a reliable interval with rapid local convergence.

## 8. Time stepping from Taylor expansion

Rewrite a second-order mechanical equation as first-order equations for position and velocity. For a mass-spring oscillator, $\dot x=v$ and $\dot v=-\omega^2x$. More generally write a state $\mathbf y$ and evolution law $\dot{\mathbf y}=\mathbf f(t,\mathbf y)$. Forward Euler takes the first Taylor term:

$$\mathbf y_{n+1}=\mathbf y_n+h\mathbf f(t_n,\mathbf y_n).$$

The local error per step is generally of order $h^2$, while accumulated error over a fixed finite interval is generally of order $h$ under suitable regularity and stability assumptions. Do not confuse local order with global order. Doubling the number of steps usually halves Euler's leading global error, rather than reducing it by four.

For decay $y'=-\lambda y$, Euler gives $y_{n+1}=(1-\lambda h)y_n$. The exact solution decays smoothly. Euler is stable in magnitude only when $|1-\lambda h|<1$, or $0<\lambda h<2$. To avoid unphysical sign alternation for a nonnegative decaying population, require $0<\lambda h\le1$. A time step can therefore be stable in one mathematical sense and still violate an important physical property.

If $\lambda=1$ s⁻¹ and $h=0.1$ s, after ten steps Euler predicts $0.9^{10}\approx0.348678$ of the initial amount, whereas exact decay after one second is $e^{-1}\approx0.367879$. Smaller steps reduce the discrepancy. No amount of plotting smooth lines between these samples changes the integration error.

## 9. Why an oscillator exposes a bad integrator

For $\omega=1$ in nondimensional time, forward Euler updates $x_{n+1}=x_n+hv_n$ and $v_{n+1}=v_n-hx_n$. Compute the squared state size:

$$x_{n+1}^2+v_{n+1}^2=(1+h^2)(x_n^2+v_n^2).$$

The mixed terms cancel. Energy is proportional to this quantity, so it grows by factor $1+h^2$ every step. Forward Euler is not energy-conserving for the oscillator, however smooth the curve looks. This exact identity is a powerful test of the implementation.

Symplectic Euler changes the order: first update velocity using old position, then update position using the new velocity. It does not exactly conserve the ordinary oscillator energy, but for a sufficiently small stable step its energy error stays bounded and oscillatory over long runs. It preserves the appropriate phase-space area. Velocity Verlet provides another common mechanical method:

$$v_{n+1/2}=v_n+\tfrac h2a(x_n),\quad
x_{n+1}=x_n+hv_{n+1/2},\quad
v_{n+1}=v_{n+1/2}+\tfrac h2a(x_{n+1}).$$

For smooth position-dependent forces it has second-order global accuracy, time-reversal symmetry and useful long-time geometric behavior. Forces depending on velocity or explicit constraints require suitable extensions. No integrator is automatically appropriate for every model.

## 10. Higher order and stiffness

The classical fourth-order Runge–Kutta method samples four slopes. With $\mathbf y'=\mathbf f(t,\mathbf y)$, set $k_1=f(t,y)$, $k_2=f(t+h/2,y+hk_1/2)$, $k_3=f(t+h/2,y+hk_2/2)$ and $k_4=f(t+h,y+hk_3)$. Then advance by $h(k_1+2k_2+2k_3+k_4)/6$. The $k$ values here are slopes, not increments; the outer factor $h$ supplies time units.

For a sufficiently smooth problem over a fixed finite interval, its global error is of order $h^4$. It is often accurate for moderate times, but it is not generally symplectic and can drift in conserved quantities over very long Hamiltonian trajectories. Choose an algorithm based on what must be preserved, not just its nominal order.

A stiff equation contains widely separated decay or response times. An explicit method may need tiny steps to remain stable even when the visible solution changes slowly. For $y'=-\lambda y$, backward Euler uses the new-time value on the right: $y_{n+1}=y_n-h\lambda y_{n+1}$, so $y_{n+1}=y_n/(1+h\lambda)$. It decays without sign reversal for positive $h\lambda$ and remains stable for this model. Its stability does not make it accurate at an arbitrarily large step: it can erase physically important transients.

## 11. Grids, fields and boundary conditions

To approximate a field $u(x,t)$, choose grid points separated by $\Delta x$. The second spatial derivative becomes

$$\frac{\partial^2u}{\partial x^2}\approx\frac{u_{j+1}-2u_j+u_{j-1}}{(\Delta x)^2}.$$

This follows by adding Taylor expansions on either side. Substituting into the diffusion equation $u_t=D u_{xx}$ and using forward Euler in time gives

$$u_j^{n+1}=u_j^n+r(u_{j+1}^n-2u_j^n+u_{j-1}^n),\qquad r=\frac{D\Delta t}{(\Delta x)^2}.$$

For this one-dimensional explicit scheme, $0\le r\le1/2$ gives the usual stability condition. It also makes each new value a weighted average of old neighboring values, preserving nonnegativity for nonnegative data with compatible boundaries. Halving the spatial spacing requires a time step at least four times smaller to retain the same $r$.

Boundary conditions supply information missing from the interior update. Fixed temperature means prescribe endpoint values. Insulation means zero normal derivative, which requires a different endpoint rule. Periodic boundaries identify the two ends; they describe a ring or repeating medium, not an insulated finite rod. A calculation with the wrong boundary conditions solves a different physical problem even if its interior equation is correct.

## 12. Random sampling as integration

For a uniformly distributed random variable $X$ on $[a,b]$, $\mathbb E[f(X)]=(b-a)^{-1}\int_a^b f(x)dx$. Estimate the integral with $N$ independent samples:

$$I_N=(b-a)\frac1N\sum_{j=1}^N f(X_j).$$

When the variance is finite, the standard error is proportional to $1/\sqrt N$. Reducing statistical error by a factor ten therefore takes about one hundred times as many independent samples. This slow rate can nevertheless be useful in high-dimensional integrals where a regular grid becomes impossibly large.

As an example estimate $\int_0^1x^2dx$. The exact mean of $X^2$ is $1/3$, while $\mathbb E[X^4]=1/5$. Its variance is $1/5-1/9=4/45$. With $N=10000$, standard error is approximately $\sqrt{(4/45)/10000}=0.002981$. A particular run need not lie within one standard error of the exact answer. An uncertainty estimate describes a distribution of possible runs, not a guarantee for a chosen seed.

A pseudorandom generator is deterministic given its initial seed. Recording the seed makes a run reproducible. It does not establish independence or remove bias. Correlated samples require an effective sample-size analysis; treating every stored point as independent can severely underestimate uncertainty.

## 13. Linear systems and eigenproblems

Discretizing electrostatics or fitting a model often gives $A\mathbf x=\mathbf b$. Gaussian elimination removes unknowns one at a time. Pivoting chooses a suitable row interchange to avoid division by a zero or dangerously small pivot. Solving directly is generally preferable to forming an explicit inverse matrix, which adds work and can amplify rounding unnecessarily.

For $2x+y=5$ and $x+3y=5$, double the second equation and subtract the first: $5y=5$, so $y=1$ and $x=2$. Substitution checks both original equations. For a numerical system compute the residual $\mathbf r=A\mathbf x-\mathbf b$, but remember that a small residual need not imply a small solution error when the matrix is ill-conditioned.

Quantum energy calculations lead to eigenproblems $H\mathbf c=E\mathbf c$. A Hermitian discretized Hamiltonian should have real eigenvalues and orthogonal eigenvectors for distinct eigenvalues. If a numerical implementation produces appreciable imaginary energies for a claimed Hermitian problem, first check the matrix and boundary conditions. In a finite-difference box calculation, refine the grid and enlarge the domain separately: grid error and artificial-wall error are different limits.

## 14. A reproducible computational investigation

Use the companion's numerical-oscillator experiment. Its model is $x''=-x$ with initial $x=1,v=0$ and nondimensional angular frequency one. Compare forward Euler and symplectic Euler over the same duration. Record the step size, final state and energy behavior. Repeat with half the step. Compare against $x=\cos t,v=-\sin t$.

First verify the exact solution satisfies the differential equation and initial values. Then check that the numerical results approach it as the step shrinks over a fixed interval. Next compare long-time energy behavior. These are different questions: a method can have small short-time trajectory error yet systematic long-time energy drift.

Finally change the model to include damping, if you implement an extension. Conservation of mechanical energy is no longer the correct invariant. Test the energy balance including dissipation. A check must follow the model's actual assumptions. Blindly demanding constant energy would reject correct damped motion.

The same pattern scales to serious computational physics: isolate a known case; test a dimensionless invariant or balance; refine resolution; vary boundary or domain choices; compare independent methods; document the regime where the result remains stable. A converged numerical solution is strong evidence about a specified model. It is not proof that every modeling choice was physically correct.

## Optional practice

Hints and complete reasoning are in [27-hints](../solutions/27-hints.md) and [27-solutions](../solutions/27-solutions.md).

1. Derive the centred-difference formula's error for $f(x)=x^3$ at arbitrary $x$.
2. Apply the trapezoidal rule with two and four intervals to $x^2$ on $[0,1]$ and compare errors.
3. How many bisection steps reduce a bracket of width 1 m to width at most $10^{-6}$ m?
4. For decay rate 5 s⁻¹, find the forward-Euler stability range and the stricter range preventing sign alternation.
5. Prove the forward-Euler oscillator energy multiplier $1+h^2$ for nondimensional frequency one.
6. A diffusion model has $D=0.01\,\mathrm{m^2/s}$ and $\Delta x=0.02$ m. Find the maximum stable explicit time step under the stated scheme.
7. A Monte Carlo estimate has standard error 0.02 from 2,500 independent samples. Estimate the sample count needed for error 0.005.
8. Explain how an algorithm can converge accurately to a prediction that fails in an experiment. Give separate verification and validation checks for one physical model.

## Connection to the rest of physics

Feynman Volume I, Chapter 9 already uses numerical evolution as a way to understand mechanics. Our treatment extends that idea to error, stability, fields and random sampling. The final chapter brings computation back to measurement: extracting a defensible physical conclusion from actual observations rather than from an idealized equation alone.
