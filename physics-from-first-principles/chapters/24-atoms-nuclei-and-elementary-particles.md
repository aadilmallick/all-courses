# 24. Atoms, nuclei and elementary particles

The electron-volt scale explains chemical bonds and optical spectra. A million times that energy can rearrange a nucleus. At still higher energies, collisions create particles absent from the initial state. We need to connect these scales without imagining that one detailed model applies unchanged across all of them.

The organizing question is: what are the useful degrees of freedom and conservation laws at each scale? For atoms they are primarily electrons and a nucleus; for nuclear structure they are protons and neutrons in an effective interaction; for elementary-particle reactions they are quantum fields and their excitations. We will calculate spectra, decay rates, binding energies, collision thresholds and oscillation probabilities. A particle catalogue alone would not teach those abilities.

We use quantum states, angular momentum, approximation methods, relativity and probability from earlier chapters. New conventions, especially nuclear mass bookkeeping and natural units, are introduced explicitly. Numerical examples use rounded constants and, where stated, deliberately chosen model data rather than a claim to reproduce the latest precision measurements.

## Why the hydrogen spectrum is only the first atom

For a nucleus with charge $+Ze$ and $N$ electrons, a basic nonrelativistic Hamiltonian is

$$H=\sum_{i=1}^N\left[\frac{\mathbf p_i^2}{2m_e}
-\frac{Ze^2}{4\pi\epsilon_0r_i}\right]
+\sum_{i<j}\frac{e^2}{4\pi\epsilon_0|\mathbf r_i-\mathbf r_j|}.$$

The last sum counts each electron pair once. Its presence prevents exact separation into independent hydrogen problems. Ignoring it for a many-electron atom would overbind the electrons and produce incorrect level patterns. The nuclear motion can be included through reduced masses and coupled coordinates when needed; a fixed heavy nucleus is an approximation.

A central-field approximation replaces the average effect of the other electrons by a spherically symmetric potential. Electrons then occupy orbitals with radial and angular labels. Pauli exclusion limits each complete one-electron state, including spin, to one electron. Screening makes the effective attraction weaker far from the nucleus, while orbital penetration can distinguish states with the same principal label but different angular momentum. Hence the hydrogen rule that energy depends only on $n$ no longer applies.

The central-field orbitals are computational building blocks, not literal independent tracks. Antisymmetrization produces exchange effects even before correlation corrections beyond a single determinant are considered. The remaining electron-electron correlation can shift energies and transition strengths. An orbital filling diagram is therefore an approximate organizational tool, useful for many chemical patterns but insufficient as a complete derivation of every ground-state configuration.

## A deliberately crude helium estimate

Take two electrons in the same normalized hydrogenic spatial orbital with adjustable effective charge $Z_*$ and opposite spins in a singlet. In atomic units, where lengths are measured in the Bohr radius and energies in the Hartree, one Hartree is approximately $27.2\,\mathrm{eV}$. The spatial orbital is proportional to $e^{-Z_*r}$, and the nuclear charge is $Z=2$.

For this trial product, the total kinetic expectation is $Z_*^2$ Hartree, the nuclear attraction is $-2ZZ_*$ Hartree, and the electron-electron repulsion expectation is $(5/8)Z_*$ Hartree. The last coefficient is obtained by integrating the Coulomb interaction over the two spherical exponential densities; we state it as a model integral here rather than claiming the electrons never interact. Thus

$$E(Z_*)=Z_*^2-2ZZ_*+\frac58Z_*.$$

Minimize by differentiation: $2Z_*-2Z+5/8=0$, so $Z_*=Z-5/16=27/16$ for helium. Substitution gives $E=-(27/16)^2$ Hartree, about $-77.5\,\mathrm{eV}$. This is a variational upper bound within the stated nonrelativistic fixed-nucleus Hamiltonian and trial family. It illustrates screening and optimization; it is not an exact helium energy and does not include every physical correction. The two electrons' spatial product is allowed because the complete spin-space state is antisymmetric.

The important comparison is structural: independent bare-charge hydrogenic electrons would give $-4$ Hartree, much too negative because repulsion was omitted. An optimized trial function keeps repulsion and changes the orbital scale. Better correlated trial states lower the variational bound further.

## Spectroscopy measures differences and matrix elements

A photon carries energy $h\nu$ and momentum $h/\lambda$ in vacuum. An atomic transition connects states of different total energy; its photon frequency is determined by the energy difference, with recoil included for precision. Transition strength depends on a coupling matrix element, not just the existence of two levels. In the electric-dipole approximation, the relevant spatial operator is the dipole moment $-e\sum_i\mathbf r_i$.

For a simple atom with good total angular-momentum labels, angular selection rules follow from how this vector operator transforms under rotations. Common electric-dipole conditions include a parity change and $\Delta J=0,\pm1$, excluding $J=0\to J=0$. These conditions belong to that approximation and label scheme; magnetic-dipole, electric-quadrupole and higher-order transitions have different rules. A nominally forbidden transition can therefore be weak rather than absolutely impossible.

Stimulated transitions can be treated with a classical driving field and quantum matter, as in Chapter 22. Spontaneous emission requires coupling to electromagnetic field modes, including the quantum vacuum in a full treatment. It is not caused by a classical electron orbit continuously radiating while stationary. A stationary atomic energy eigenstate of the matter-only Hamiltonian can decay when that Hamiltonian is enlarged to include matter-radiation coupling and accessible lower-energy final states.

Finite excited-state lifetime produces finite spectral width. If the amplitude decays as $e^{-t/(2\tau)}e^{-i\omega_0t}$ for $t\ge0$, its Fourier transform is proportional to $[1/(2\tau)-i(\omega-\omega_0)]^{-1}$. Squaring gives a Lorentzian line shape with angular-frequency full width at half maximum $1/\tau$. This is a Fourier relationship for that exponential model, not a universal claim that every observed line is lifetime limited; Doppler and collision broadening can dominate.

## A nucleus is a bound quantum many-body system

A nuclide has proton number $Z$, neutron number $N$, and mass number $A=Z+N$. Isotopes share $Z$ but differ in $N$. Protons and neutrons are nucleons. They have internal quark-gluon structure, but an effective nucleon description is useful at nuclear binding scales. The residual strong interaction between nucleons is not identical to a simple pairwise Coulomb force with a changed sign.

A useful empirical size model is $R=r_0A^{1/3}$, with $r_0$ of order $1.2\,\mathrm{fm}$ and $1\,\mathrm{fm}=10^{-15}\,\mathrm m$. Cubing gives volume proportional to $A$, suggesting approximately saturated nuclear density. It is a scale model: light nuclei, deformation and neutron distributions can require more detail. For $A=125$, this estimate gives $R\approx6.0\,\mathrm{fm}$.

Nuclear binding energy is the rest-energy difference

$$B=\left[Zm_p+Nm_n-M_{\mathrm{nuc}}\right]c^2.$$

If $B>0$, the bound nucleus has less mass than separated stationary nucleons. The missing rest energy was released or transferred during formation; energy was not destroyed. For chosen model masses whose mass defect is $0.0300\,\mathrm u$, using $1\,\mathrm u\,c^2\approx931.5\,\mathrm{MeV}$ gives $B\approx27.9\,\mathrm{MeV}$. For $A=4$, that is about $6.99\,\mathrm{MeV}$ per nucleon. These are illustrative data, not a precision isotope mass determination.

Atomic masses include electrons. For many beta-decay calculations atomic masses make electron bookkeeping convenient, but for the binding formula above one must either use nuclear masses or explicitly account for electron masses and binding energies. Mixing mass conventions can create false energy releases of order an electron rest energy, much larger than many interesting spectral effects.

## Why binding energy has competing trends

The semi-empirical mass formula organizes smooth nuclear binding approximately as

$$B\approx a_vA-a_sA^{2/3}-a_c\frac{Z(Z-1)}{A^{1/3}}
-a_a\frac{(A-2Z)^2}{A}+\delta.$$

The constants are fitted positive energy scales; $\delta$ is a pairing correction whose sign depends on even-odd nucleon numbers. We do not insert a universal parameter set because fitted coefficients depend on the chosen data and model variant.

The volume term represents approximately saturated short-range binding. The surface term subtracts binding for nucleons with fewer neighbors. Coulomb repulsion penalizes many protons in a compact nucleus. The asymmetry term reflects the energy cost of strongly unequal proton and neutron populations, including Pauli-state filling. Pairing favors particular even-odd patterns. This is an effective summary, not a derivation of the nuclear force from first principles.

Ignoring pairing and replacing $Z(Z-1)$ by $Z^2$ for a rough optimization, minimize the negative binding contributions at fixed $A$. Differentiation gives

$$Z\approx\frac{A}{2+[a_c/(2a_a)]A^{2/3}}.$$

For small $A$, the denominator is near two, favoring $N\approx Z$. For larger $A$, Coulomb repulsion shifts the favorable composition toward more neutrons. Shell closures produce additional stability patterns that this smooth formula misses. Calling the formula a fit does not make it useless; knowing what it averages out tells us where to expect deviations.

## Radioactive decay as a constant-hazard model

Suppose each undecayed nucleus has probability $\lambda\,dt$ of decaying in a sufficiently short interval $dt$, independent of its age and the others. The expected change is $dN=-\lambda Ndt$, giving

$$N(t)=N_0e^{-\lambda t},\qquad A(t)=\lambda N(t).$$

Here activity $A(t)$ is a rate, measured in becquerels, $1\,\mathrm{Bq}=1\,\mathrm{s}^{-1}$. It is not the mass number, despite sharing the traditional symbol. Context and units distinguish them. The half-life is $t_{1/2}=\ln2/\lambda$; the mean lifetime is $\tau=1/\lambda$. They are different averages or quantiles of the same exponential distribution.

For a sample initially containing $10^6$ parent nuclei with half-life $10.0\,\mathrm{min}$, $\lambda=\ln2/600\,\mathrm{s}^{-1}\approx1.16\times10^{-3}\,\mathrm{s}^{-1}$. The initial activity is about $1.16\times10^3\,\mathrm{Bq}$. After $30.0\,\mathrm{min}$, one eighth remain and the activity is one eighth as large. Decay times are random; these formulas describe expectations or large samples, not a scheduled decay of each nucleus at its half-life.

For a parent feeding one unstable daughter with no daughter initially present, equations are $\dot N_P=-\lambda_PN_P$ and $\dot N_D=\lambda_PN_P-\lambda_DN_D$. Multiplying the daughter equation by $e^{\lambda_Dt}$ and integrating gives, for unequal rates,

$$N_D(t)=\frac{\lambda_PN_{P0}}{\lambda_D-\lambda_P}
\left(e^{-\lambda_Pt}-e^{-\lambda_Dt}\right).$$

Both signs combine to give a nonnegative population. At equal rates the limit is $N_D=\lambda N_{P0}t e^{-\lambda t}$; using the unequal-rate expression numerically with nearly equal rates can cause cancellation error. Chapter 27 discusses this type of numerical issue more broadly.

## Decay channels and energy bookkeeping

Alpha decay emits a helium-4 nucleus. Its energy release is the initial rest energy minus final rest energies. Tunneling through the Coulomb barrier explains how emission can occur even when the classical kinetic energy is insufficient to cross the barrier maximum. The WKB exponent of Chapter 22 makes the rate highly sensitive to the released energy. A full prediction also requires an interior nuclear model and formation amplitude; the barrier factor alone is not the entire decay rate.

In beta-minus decay a neutron-rich system can transform a neutron into a proton, electron and electron antineutrino. For neutral atomic masses of parent and daughter, the leading available energy is $Q_{\beta^-}=[M_P-M_D]c^2$, with small atomic excitation details handled as needed. In beta-plus decay, atomic-mass bookkeeping gives $Q_{\beta^+}=[M_P-M_D-2m_e]c^2$. One electron mass is the emitted positron and the other comes from the different neutral-atom electron counts. Omitting the second mass gives a wrong threshold.

For electron capture, an atomic electron is absorbed in the nuclear transition. The atomic-mass difference supplies the leading available energy, distributed among the neutrino, recoil and atomic rearrangement products. Beta spectra are continuous because energy and momentum are shared among at least three final particles, whereas a simple two-body decay at rest fixes the outgoing momentum magnitudes.

Gamma decay changes an excited nuclear state without changing $Z$ or $N$. Momentum conservation makes the daughter recoil. For a photon energy much smaller than a heavy daughter rest energy, the recoil energy scale is approximately $E_\gamma^2/(2Mc^2)$. It is often small, but precision measurements can resolve effects that a leading energy-difference picture neglects.

## Reaction rates and cross sections

A cross section $\sigma$ converts incident flux into a reaction rate. For a thin target with areal density $n_t$ nuclei per area and incident particle rate $I$, the expected interaction rate is

$$R\approx I n_t\sigma,$$

provided $n_t\sigma\ll1$ so attenuation and repeated interactions are negligible. A barn is $10^{-28}\,\mathrm{m}^2$. It is a unit of area, not a statement that a nucleus is an opaque disk of that exact size.

For $I=10^6\,\mathrm{s}^{-1}$, $n_t=10^{24}\,\mathrm{m}^{-2}$ and $\sigma=0.100$ barn, the interaction probability is $10^{-5}$ and the rate is $10\,\mathrm{s}^{-1}$. With detection efficiency $0.40$, the expected observed signal is $4.0\,\mathrm{s}^{-1}$ before backgrounds. Real inference must include geometry, energy distribution, dead time, branching fractions and uncertainty. A discrepancy between raw counts and this simplest rate is not automatically new physics.

## Thresholds require momentum conservation too

If a reaction has negative $Q$, the projectile needs kinetic energy to create the final rest masses. In a fixed-target experiment it also needs enough energy for the required overall motion. Let projectile mass be $m_a$, stationary target mass $m_A$, and total final rest mass at threshold be $M_f$. Define the invariant squared center-of-mass energy as

$$s=E_{\mathrm{tot}}^2-c^2\mathbf p_{\mathrm{tot}}^2,$$

which has units energy squared. With target at rest and projectile total energy $E_a=m_ac^2+K_a$,

$$s=(m_a+m_A)^2c^4+2m_Ac^2K_a.$$

At threshold the final particles have no relative motion in their center-of-mass frame, so $s=M_f^2c^4$. Therefore

$$K_{\mathrm{th}}=\frac{M_f^2-(m_a+m_A)^2}{2m_A}c^2.$$

This expression assumes the reaction is otherwise allowed and the threshold final configuration is physically accessible. If the numerator is negative for an exothermic channel, the kinematic threshold is zero rather than negative kinetic energy. For small endothermic rest-energy change $-Q=(M_f-m_a-m_A)c^2$, expansion gives $K_{\mathrm{th}}\approx -Q(1+m_a/m_A)$, plus a small quadratic correction. The extra factor is recoil bookkeeping.

Colliding beams can place more energy into center-of-mass motion than a fixed target at the same projectile energy. For two equal-mass particles with equal opposite momenta, total momentum is zero and the center-of-mass energy is simply twice each beam's total energy. This is a kinematic advantage, distinct from the practical challenges of luminosity and beam focusing.

## Natural units are a convention with a recovery rule

Particle calculations often set $c=\hbar=1$. Then masses, energies, momenta and inverse lengths can be expressed in compatible powers of energy. For example, $E^2=p^2+m^2$ is the compact form of $E^2=p^2c^2+m^2c^4$. To recover units, identify the dimension of the physical quantity rather than mechanically appending a random power of $c$.

The useful conversion $\hbar c\approx197.3\,\mathrm{MeV\,fm}$ says that a momentum scale $pc=200\,\mathrm{MeV}$ corresponds to a reduced wavelength $\hbar/p\approx0.987\,\mathrm{fm}$. The ordinary de Broglie wavelength $h/p$ is $2\pi$ times larger. Mixing the two wavelengths produces a persistent factor-of-$2\pi$ error.

## Elementary particles and interactions

The Standard Model organizes quarks and leptons as matter fields and includes electromagnetic, weak and strong interactions. Quarks carry color charge; leptons do not. The photon is associated with electromagnetism, gluons with the strong interaction, and $W^\pm,Z$ with the weak interaction. A Higgs field and its excitation are part of the model. Gravity is outside this framework. Neutrino oscillations require physics beyond the minimal version with exactly massless neutrinos. These broad identifications are consistent with [CERN's Standard Model overview](https://home.cern/science/physics/standard-model/).

Several distinctions prevent misleading pictures. A virtual particle in a diagram is an internal term in a perturbative calculation, not a directly observed particle briefly violating energy conservation. Quarks are not isolated as free low-energy particles in ordinary experiments; hadrons are color-neutral composite states. A proton contains quark and gluon dynamics, and most of its mass is associated with strong-interaction energy rather than merely adding the light-quark masses generated through Higgs couplings. The Higgs mechanism should not be described as the sole source of every kilogram of ordinary matter.

A reaction calculation starts with exact conserved quantities appropriate to the interaction: energy-momentum, electric charge and angular momentum, together with the relevant quantum numbers and symmetry constraints. Some approximate quantum numbers can change under weak interactions. Lepton flavor is not an exact label for neutrino propagation. Baryon and lepton numbers have useful conservation roles in ordinary perturbative Standard Model reactions, but should not be elevated to unrestricted fundamental laws without specifying the theory and process.

For example, a free neutron can decay into a proton, electron and electron antineutrino while preserving electric charge: $0=(+1)+(-1)+0$ in units of $e$. A proposed decay into only a proton and electron would also satisfy charge conservation, yet it would fail to describe the observed continuous beta spectrum and the complete angular-momentum and energy-momentum accounting. One conservation check is necessary, not sufficient.

## Neutrino oscillation as two-state interference

A simple two-flavor model illustrates how propagation eigenstates and interaction labels can differ. Let mass eigenstates be $|\nu_1\rangle,|\nu_2\rangle$ and define flavor states by a mixing angle $\theta$:

$$|\nu_a\rangle=\cos\theta|\nu_1\rangle+\sin\theta|\nu_2\rangle,$$
$$|\nu_b\rangle=-\sin\theta|\nu_1\rangle+\cos\theta|\nu_2\rangle.$$

In natural units, an ultrarelativistic component has $E_i\approx p+m_i^2/(2p)$. Over propagation time $t\approx L$, the relevant relative phase is $\Delta m^2L/(2E)$, where $\Delta m^2=m_2^2-m_1^2$. Projecting the evolved $a$ state onto $b$ gives

$$P_{a\to b}=\sin^2(2\theta)\sin^2\left(\frac{\Delta m^2L}{4E}\right).$$

The first factor describes mixing; the second describes phase accumulation. If $\theta=0$ or the masses are equal, the oscillation vanishes in this model. A flavor state is generally not a definite-mass state. Real neutrino phenomenology uses three flavors, matter effects where relevant, production and detection physics, and coherence conditions. The two-state derivation establishes the mechanism rather than fitting all data with two parameters.

The same logic appears in coupled oscillators, spin precession and neutral-meson mixing: a preparation basis differs from a propagation basis. Recognizing a shared mathematical structure helps without implying that the physical mechanisms are identical.

## Optional practice

1. Minimize the helium trial energy for a general nuclear charge $Z$, and state why its form is not an exact many-electron solution.
2. For the exponential lifetime model, find the Lorentzian intensity ratio at $|\omega-\omega_0|=1/(2\tau)$. Explain the distinction between half-width and full width.
3. A model nucleus has mass defect $0.0500\,\mathrm u$ and $A=7$. Calculate its total and per-nucleon binding energies.
4. A parent has half-life $2.00\,\mathrm h$. What fraction remains after $5.00\,\mathrm h$? Find the decay constant in inverse seconds.
5. Neutral atomic masses differ by $1.50\,\mathrm{MeV}/c^2$. Ignoring atomic excitation details, calculate the beta-plus available energy using $m_ec^2=0.511\,\mathrm{MeV}$.
6. A thin-target experiment has $I=2.0\times10^7\,\mathrm{s}^{-1}$, $n_t=5.0\times10^{23}\,\mathrm{m}^{-2}$ and $\sigma=0.0200$ barn. Find the interaction rate and the observed rate at efficiency $0.25$.
7. In natural units, a projectile of mass 1 hits a stationary target of mass 2 and creates a final system of total rest mass 4. Calculate the threshold projectile kinetic energy. Compare it with the rest-energy deficit.
8. In the two-flavor oscillation model, set $\theta=\pi/6$ and phase $\Delta m^2L/(4E)=\pi/2$. Find the transition probability. Explain what changing the baseline does while the components remain coherent.

[Hints](../solutions/24-hints.md) and [solutions](../solutions/24-solutions.md) are separate. The [companion](../companion/index.html) can support rate and probability explorations; synthetic model data should always remain distinguishable from measured nuclear or particle data.

## References and further study

Feynman Lectures, Volume I, chapters 2 and 52, and Volume III, chapters 12 and 19, offer conceptual connections to particles, symmetry and atomic structure. This chapter adds nuclear and modern particle models rather than claiming the historical lectures contain a complete contemporary particle curriculum. CERN's linked overview supplies a primary institutional check on the broad Standard Model organization; numerical examples above use explicit model data and rounded constants.
