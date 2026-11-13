# Independent cross-review of mechanics chapters 04–11

Reviewer: the author of chapters 12–19. Reviewed on 2026-11-13 after the mechanics author made chapters 04–10 stable and then completed 11. The review inspected the display equations throughout 04–11, the assumptions around selected derivations, worked numerical examples, and the complete practice solutions 04–11. It did not independently reread every sentence of the eight chapters at equal depth.

## Areas examined

-04: free-body force signs; static versus kinetic friction; acceleration constraints; Atwood tensions; drag transient, equilibrium solution lost on division, and short/long-time limits; circular contact and Euler update stability.
-05: work and potential signs; particle versus extended-system work; center-of-mass decomposition; elastic and sticking collisions; exhaust momentum flux; fixed-center versus two-body orbital parameter; circular/escape energies; contact failure at the top of an inside track.
-06: torque origin requirements; mass-distribution integrals; rolling contact and friction threshold; pulley tension difference; effective radial potential; Euler rigid-body signs; intermediate-axis linearization; assumptions behind slow gyroscopic precession.
-07: damping roots and initial conditions; negative-frequency phasor convention; displacement resonance versus power resonance; average dissipation; undamped resonance secular growth; convolution initial conditions; coupled normal modes.
-08: wave initial velocity and d'Alembert evolution; Fourier sine orthogonality and triangular-pluck coefficient; string power flux and reflection/transmission normalization; phase versus group speed; acoustic Doppler reference to the medium.
-09: ray-angle convention; lens signs; field-amplitude interference versus incoherent intensity; slit envelope/missing orders; Airy and Rayleigh assumptions; sequential polarizers; Fresnel intensity conversion; quarter-wave coating assumptions.
-10: Lorentz signs and units; event-pair definitions; proper time and path comparisons; velocity addition; longitudinal Doppler; invariant mass of composite systems; constant force; rapidity range.
-11: fixed-endpoint variation and integration by parts; multiplier force signs; stationary versus minimum action; cyclic momentum and Noether boundary term; Legendre regularity; canonical divergence and Poisson bracket signs; Binet transformation and full two-body Kepler period; eigenvalue bridge; chaotic horizon and numerical area preservation.

## Executed independent checks

Ran `checks/cross-review-mechanics.py`;68 assertions passed. Results are in `cross-review-mechanics-results.json`. The first run exposed a test tolerance narrower than the rounding of a printed 3.21 answer; the test was corrected to respect its 0.01 precision, with no change to the correct chapter answer. The final run passed.

Checks included arbitrary-mass elastic-collision energy/momentum; sticking-collision relative-energy loss; spring/resistance arithmetic; orbit speed/period; beam force balance; inertial pulley torque; intermediate-axis coefficient sign; complex driven-oscillator residual and dissipation; numerical Fourier projection of a triangular string shape through eight modes; string-junction power balance for three impedance pairs; optical angle/fringe/polarization/film calculations; Lorentz interval invariance for 12 event/boost combinations; relativistic system mass and Doppler; full Kepler area/period/energy consistency; forward and symplectic Euler Jacobian determinants; and exponential prediction-horizon arithmetic.

## Findings and limits

No substantive physics or mathematical error requiring a chapter correction was identified in the reviewed areas. This is a scoped review result, not a guarantee that the course is error-free. The text generally distinguishes empirical force/material laws from deductions, restores excluded solutions where division matters, states the assumptions behind formulas, and introduces the mathematical operations used in the worked calculations. General inertia eigensystems and large normal-mode systems are explicitly deferred while the current examples use symmetry or a locally taught two-coordinate determinant method.

The review did not run a physical laboratory, validate every possible parameter regime, test every optional solution with an independent solver, or certify the final reader layout. Package-level verification and later learner feedback remain separate evidence.
