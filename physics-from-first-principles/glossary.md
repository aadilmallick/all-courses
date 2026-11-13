# Notation and central definitions

Meanings can vary by context. A chapter defines its local symbols before using them. In particular, $k$ may be spring stiffness, wave number, Boltzmann's constant with subscript, or a mathematical index; inspect the units and definition.

| Symbol or term | Meaning and use |
| --- | --- |
| $\Delta x$ | Finite change, final minus initial value |
| $dx/dt$, $\dot x$ | Derivative with respect to time |
| $\partial f/\partial x$ | Partial derivative, holding other independent inputs fixed |
| $\int_a^b f(x)dx$ | Accumulation as a limit of signed sums |
| $\sum_j a_j$ | Sum over the indicated index values |
| $\mathbf r,\mathbf v,\mathbf a$ | Position, velocity, acceleration vectors |
| $|\mathbf v|$ | Magnitude of a vector; speed for velocity |
| $\hat{\mathbf n}$ | A unit direction vector |
| $\mathbf a\cdot\mathbf b$ | Dot product, a scalar measuring alignment |
| $\mathbf a\times\mathbf b$ | Oriented cross product in three-dimensional Euclidean space |
| $\nabla f$ | Gradient, direction and rate of strongest local increase |
| $\nabla\cdot\mathbf F$ | Divergence, local outward flux per volume |
| $\nabla\times\mathbf F$ | Curl, local circulation density with orientation |
| $\nabla^2 f$ | Laplacian, divergence of gradient |
| $i$ | Imaginary unit satisfying $i^2=-1$ |
| $z^*$ | Complex conjugate |
| $A^\dagger$ | Conjugate transpose of a matrix/operator |
| $\hbar=h/(2\pi)$ | Reduced Planck constant |
| $\langle\phi|\psi\rangle$ | Inner product, conjugating the first state |
| $\langle A\rangle$ | Expectation value, not necessarily an individual outcome |
| $\rho$ | Density; context distinguishes mass, charge, probability or density operator |
| $\sigma$ | Often standard deviation, surface charge density or a Pauli matrix label |
| $\delta Q,\delta W$ | Path-dependent infinitesimal heat and work |
| $dU,dS$ | Differentials of state functions internal energy and entropy |
| $\beta$ | Either $v/c$ in relativity or $1/(k_BT)$ in statistical physics; context specified |
| Postulate | An empirical or foundational rule adopted by a theory |
| Derivation | A conclusion following from stated premises and mathematics |
| Approximation | A replacement justified within a specified regime and accuracy |
| Boundary condition | Information specified on a domain's boundary |
| Initial condition | Information specifying a system's state at a starting time |
| Verification | Checking an algorithm against its mathematical specification |
| Validation | Checking a model's adequacy for the physical question |
| Residual | Observed value minus the model's fitted or predicted value |
| Uncertainty | Quantified incomplete knowledge under a stated measurement model |

## Selected numerical constants

The exact SI values are $c=299792458$ m/s, $h=6.62607015\times10^{-34}$ J s, $e=1.602176634\times10^{-19}$ C and $k_B=1.380649\times10^{-23}$ J/K. Exact here describes the SI defining numerical values, not an experimental uncertainty determination. See [BIPM's SI definitions](https://www.bipm.org/en/measurement-units/).

Measured constants are rounded appropriately in examples: $m_e\approx9.1093837139\times10^{-31}$ kg and $\epsilon_0\approx8.8541878188\times10^{-12}$ F/m, using the 2022 CODATA adjustment listed by [NIST](https://physics.nist.gov/cuu/Constants/). Quoted digits without uncertainty are computational reference values in the companion, not exact definitions. Local near-Earth $g=9.81$ m/s² is an explicit model approximation and varies with location; it is distinct from Newton's gravitational constant $G$.
