# Review of chapters 12–19

Reviewed and authored on 2026-11-13. These are original chapters, using the Feynman source as a conceptual reference rather than reproducing its wording. The supplied PDF has not been claimed as fully inspected. Its source-access record is maintained in the book's provenance documents.

## Delivered files and depth

Each chapter has 8 original optional practice problems, with separate hint and complete-solution files under `solutions/`. Reading does not require submitting an answer or passing a quiz. Mathematical prerequisites are introduced before the consequential calculations: partial/material derivatives and local transport; logarithms and equilibrium state functions; probability/counting/partition sums; gradient/divergence/curl and their integral theorems; boundary-value uniqueness/Fourier modes/multipoles; circuit differential equations and explicit complex-time convention; field conservation and retarded solutions; finite-dimensional complex linear algebra and unitary dynamics.

UTF-8 text measured with `tiktoken` encoding `cl100k_base` on 2026-11-13:

| Chapter | Tokens |
| --- | ---: |
|12 continuum mechanics/transport |5,757|
|13 thermodynamics |5,056|
|14 probability/statistical mechanics |5,304|
|15 vector calculus/electrostatics |5,144|
|16 boundary problems/matter |5,094|
|17 circuits/magnetism/induction |5,112|
|18 Maxwell/waves/radiation |5,173|
|19 quantum/linear algebra |5,276|

Counts are a depth diagnostic, not evidence that learning outcomes or mathematical correctness follow from length. Subsequent editorial changes can alter counts; the final package-level report takes precedence.

## Executed mathematical checks

Ran `checks/fields-numerical-checks.py` with Python 3.12.14 and NumPy 2.3.5. It completed 161 assertions. Detailed machine-readable results are in `fields-numerical-results.json`.

The checks independently evaluated representative arithmetic and invariants rather than testing only whether prose formulas parse. They included Poiseuille mean speed/Reynolds number; rod extension and wave speed; normalized diffusion profile and variance; isothermal work, reversible cooling and entropy balances; refrigerator reversible entropy; partition-function derivative versus energy variance; Gaussian gas speeds and occupation limits; a sphere potential differentiated numerically; off-axis image-charge boundary values on a sphere; numerical time integration of RC source and resistor energies; phasor sign under the declared negative-frequency convention; vacuum constant consistency; Fresnel reflected/transmitted energy sum; angular integration of dipole radiation; Pauli commutators; normalized complex-state Born probabilities; and exact detuned two-state dynamics checked against an independent Hermitian eigensolver.

## Manual reasoning and consistency review

Checked the distinctions between ideal and empirical material laws; steady flow and material acceleration; reversible adiabatic and merely insulated processes; heat/work paths and state functions; extensive and intensive quantities; probability and density/occupation; source/test coordinates; image sources and physical induced charge; grounded and isolated conductors; fixed charge and fixed voltage; field versus terminal-voltage signs; peak and rms amplitudes; near fields and far radiation; active evolution and passive basis change; global and relative phase; expectations and individual quantum outcomes.

Explicitly retained qualifications for continuum scale separation, Newtonian viscosity, laminar pipe flow, heat-capacity models, canonical ensembles, Bose-state convergence, infinite-source idealizations, regularity/topology in vector-calculus theorems, boundary-value hypotheses, linear lossless dielectrics, circuit quasistatics, far-zone nonrelativistic dipole radiation, and finite-dimensional Hermitian theorems. Resolved several typesetting commas that had been intended as thin spaces and removed a duplicate thermodynamics heading before final review.

## Limits of this evidence

The assertions are selected checks, not a symbolic proof of every equation or an experimental validation of the models. This author did not independently render the final assembled book or exercise the companion browser controls; root-level verification records cover those actions. No claim is made that every external Feynman chapter was read, that every problem has an independent automated oracle, or that study alone confers a degree or research qualification.
