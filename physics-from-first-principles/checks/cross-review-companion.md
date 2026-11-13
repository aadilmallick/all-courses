# Independent companion physics review

Reviewed `companion/models.js` and `companion/labs.js` against the chapter conventions, with particular attention to the factor of two in coherent dynamics, probability-density normalization, angular domains, approximation labels, numerical integration and synthetic-data inference.

## Formula and scope findings

- **Rabi dynamics:** correct for the displayed Hamiltonian `H = ℏ(Δσz + Ωσx)/2`, matching chapter 19. Resonant transfer is `sin²(Ωt/2)` and first inversion occurs at `π/Ω`; detuning uses the generalized frequency `sqrt(Ω²+Δ²)`. Independently integrated the two complex Schrödinger amplitudes with fourth-order Runge–Kutta for four resonant/detuned/signed-detuning cases; transition probabilities agreed to numerical precision and normalization was preserved.
- **Infinite well:** correct electron energy `h²n²/(8mL²)` and dimensionless plotted density `L|ψ|² = 2 sin²(nπx/L)` against dimensionless position. The density integrates to one in the plotted variable; it is not mislabeled as a density in inverse metres. Existing independent width and quantum-number scaling tests remain valid.
- **Diffraction:** correct scalar Fraunhofer sinc-squared formula and central limiting value. The reported first minimum exists only when `λ/a ≤ 1`; a larger ratio correctly reports no physical first minimum. The chart intentionally uses a window of `sin(angle)` inside the physical interval. Strengthened the test to evaluate the actual sampled first zero, rather than only checking the angle formula under a test name that claimed to check the zero.
- **Pendulum:** correct elliptic-integral quadrature for the ideal nonlinear period, with an explicit amplitude bound away from the separatrix. The plotted trajectory is intentionally the small-angle sinusoid using the small-angle period, and both note and axis state that distinction. The zero-amplitude result is the limiting natural period. No claim is made that the displayed sinusoid is the nonlinear trajectory.
- **Diffusion:** correct infinite-line Gaussian width `sqrt(σ₀²+2Dt)`. Found and fixed a rendering error at large width ratios: sampling the initially narrow Gaussian on the evolved broad grid could draw a misleading triangle with an incorrect displayed area. Each Gaussian now uses its own ±4-standard-width sampling grid. The note distinguishes whole-line normalization from the small omitted tails and identifies the curve colors. A large-width-ratio test now integrates both independently sampled curves.
- **Radiation:** correct relation `B₀=E₀/c` and average intensity `ε₀cE₀²/2`, with the control explicitly labeled as the peak plane-wave amplitude. Independently averaged the actual plotted electric field squared for zero, ordinary and large amplitudes; this checks the absolute factor of one half rather than only the quadratic scaling.
- **Numerical oscillator:** correct forward-Euler old-state update and symplectic-Euler velocity-first update. The exact forward energy multiplier, long-time bounded symplectic behavior in the permitted step range, and fixed-interval convergence tests remain valid. Energy is the correct nondimensional invariant for the displayed undamped model.
- **Regression:** correct free-intercept fit, residual variance with `n−2` degrees of freedom, slope standard error and `g=4π²/slope`. A common additive squared-period offset preserves slope. Added a physical-domain check rejecting offsets that make any synthetic squared period nonpositive; the example remains explicitly synthetic.
- **Thermal curve:** found a domain error for valid hot temperatures below 1 K: the previous plotted lower endpoint was fixed at 1 K, so parts of the curve had cold temperature greater than hot temperature. The lower endpoint now scales with hot temperature, keeping the displayed ordinary input range inside the intended positive-temperature domain. Added a sub-kelvin test.
- **Thermal two-level energy label:** replaced the potentially undefined `mean energy / gap` wording at a zero gap with the valid multiplicative coefficient relation `mean E = coefficient × gap`. The occupation probabilities and numerical model are unchanged.

## Plot corrections

Vector and circular-orbit plots now request equal physical-axis scales. The actual plot function expands the shorter coordinate range to maintain identical pixels per metre on both axes, preserving angles and showing circular orbits as circles at desktop and narrow widths. Their notes explain the geometry and curve meanings.

Y-axis tick labels are now right aligned next to the plotting region, separated from the rotated y-axis title. This addresses the overlap found during the root's visual review. Numerical canvas tests do not substitute for the root's browser screenshot recheck.

## Executed evidence

- `node checks/models.cjs`: 28 test groups, 316 assertions passed after the fixes, including all 23 models and invalid-input paths. Results: `models.json`.
- `node checks/companion-cross.cjs`: 14 independent comparisons passed. These include numerical Schrödinger propagation, averaging the plotted wave intensity, and invoking the actual plot function against a recording canvas to verify circular pixel aspect at widths 700 and 290 and preservation of a vector's 4:3 slope. Results: `companion-cross-results.json`.

The review checks selected model equations, domains, representations and meaningful limits. It does not certify every possible finite input, physical validity for arbitrary real apparatus, or appearance in every browser. The root performs the affected browser and packaging checks after rebuilding.
