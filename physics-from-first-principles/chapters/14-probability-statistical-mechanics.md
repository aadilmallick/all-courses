# 14. Probability, statistical mechanics, and quantum statistics

A gas contains too many particles to track individually. Yet pressure and temperature are often more predictable than the trajectory of one molecule. The reason is not that microscopic laws stop operating. It is that a macroscopic measurement averages many microscopic contributions, and overwhelmingly many microscopic arrangements correspond to the same macroscopic state. Statistical mechanics makes this relation quantitative.

The first task is to learn probability as a language for incomplete information and repeated outcomes. The second is to identify which probability model represents a physical preparation. Probability rules alone cannot tell us a gas's energy levels or interactions. Those come from mechanics, quantum theory, and experiment. Combining them produces equilibrium distributions, entropy, heat capacities, and fluctuations.

## Probability begins with a specified collection of outcomes

A sample space is the collection of possible outcomes. An event is a subset of those outcomes. For a fair six-sided die, the sample space is the six face labels; the probability of an even result is $3/6=1/2$. Fairness is a model assumption, not a deduction from the number of labels. Probabilities satisfy $0\le P(A)\le1$, $P(\Omega)=1$, and addition for disjoint events.

If events overlap, adding their probabilities counts their intersection twice:

$$P(A\cup B)=P(A)+P(B)-P(A\cap B).$$

Conditional probability restricts attention to outcomes compatible with information $B$:

$$P(A\mid B)=\frac{P(A\cap B)}{P(B)},\qquad P(B)>0.$$

Events are independent if $P(A\cap B)=P(A)P(B)$. Independence is a physical or statistical assumption that must be justified. Two particles sharing a fixed total energy are generally correlated: knowing one has unusually high energy changes the possibilities for the other. Independent does not mean mutually exclusive. Two nonzero-probability disjoint events cannot be independent because their intersection probability is zero.

Bayes' identity follows by writing the same intersection in two orders:

$$P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}.$$

Suppose a detector correctly registers 90% of actual events and gives a false positive on 1% of non-events. If only 1% of trials contain an event, a positive result is real with probability $0.009/[0.009+0.0099]\approx0.476$. A highly reliable-sounding detector can produce many false discoveries when the underlying signal is rare. Laboratory inference must include the base rate and background model.

## Expectations, variance, and independent sums

A random variable assigns a numerical value to each outcome. For discrete values $x_i$ with probabilities $p_i$, its expectation is

$$\langle X\rangle=\sum_i p_i x_i.$$

The sum means add one term for each possible outcome. For $X=0$ or $1$ with probability of $1$ equal to $p$, $\langle X\rangle=p$. Expectation need not itself be a possible result: no single coin toss produces half a head.

Variance measures mean-square spread around the expectation:

$$\mathrm{Var}(X)=\langle(X-\langle X\rangle)^2\rangle=\langle X^2\rangle-\langle X\rangle^2.$$

The second equality follows by expanding the square and using linearity of expectation. Standard deviation is the positive square root, $\sigma_X=\sqrt{\mathrm{Var}(X)}$, with the same units as $X$. For the 0-or-1 variable, $X^2=X$, giving variance $p-p^2=p(1-p)$.

For a sum $S=X_1+\cdots+X_N$, means always add. Variances add only when the cross-covariances vanish. Independent variables have that property. If all $X_i$ are independent 0-or-1 trials, $\langle S\rangle=Np$ and $\sigma_S=\sqrt{Np(1-p)}$. Relative fluctuations are of order $1/\sqrt N$ when $p$ is fixed away from zero. This scaling explains the stability of many macroscopic averages. It does not apply unchanged to strongly correlated variables near criticality.

For $N=10^6$ and $p=1/2$, the expected count is $500000$, its standard deviation is $500$, and its relative standard deviation is $0.001$. Absolute fluctuations grow with sample size while fractional fluctuations shrink. A perfectly fixed macroscopic value is an idealization; a highly stable average is the physical situation.

## Counting arrangements and the binomial distribution

For $N$ independent trials with success probability $p$, a specified sequence containing $n$ successes has probability $p^n(1-p)^{N-n}$. Many sequences share the same success count. Their number is

$$\binom Nn=\frac{N!}{n!(N-n)!},$$

where $N!=N(N-1)\cdots1$ and $0!=1$. To derive the count, order $N$ labelled positions in $N!$ ways, then divide by the $n!$ reorderings of the selected positions and $(N-n)!$ reorderings of the rest, which do not change the selection. Therefore

$$P(n)=\binom Nn p^n(1-p)^{N-n}.$$

For four fair trials, the probability of two successes is $6/16=3/8$. The six arises from choosing the two success positions; it is not an extra physical interaction. The probability of any one specified sequence is only $1/16$.

For a gas initially confined to half a box, each molecule in a simple equilibrium model is equally likely to be in either half after mixing. The number in the original half is approximately binomial if correlations are negligible. The probability that all $N$ are there at a randomly sampled equilibrium instant is $2^{-N}$. No mechanical law forbids that arrangement. Its overwhelming rarity explains why a macroscopic gas does not visibly unmix during ordinary observation.

This reasoning concerns a specified equilibrium model and observation protocol. It is not a rigorous proof that every isolated many-body system samples all possible arrangements. Dynamical ergodicity and equilibration are substantive questions, especially for systems with constraints or long-lived metastable states.

## Continuous distributions and the Gaussian

For a continuous variable, the probability of one exact value is usually zero. Instead a probability density $f(x)$ assigns probability $f(x)dx$ to a small interval. Normalization requires $\int f(x)dx=1$, and expectation is $\langle X\rangle=\int xf(x)dx$. A density has reciprocal units of its variable. Its numerical value can exceed one without violating probability bounds.

The Gaussian density is

$$f(x)=\frac1{\sqrt{2\pi\sigma^2}}\exp\left[-\frac{(x-\mu)^2}{2\sigma^2}\right].$$

Its mean is $\mu$ and variance $\sigma^2$. The normalization follows from the Gaussian integral. If $I=\int_{-\infty}^{\infty}e^{-x^2}dx$, then $I^2$ is the integral of $e^{-(x^2+y^2)}$ over the plane. Polar coordinates give $I^2=2\pi\int_0^\infty r e^{-r^2}dr=\pi$, hence $I=\sqrt\pi$. The radial area factor $r$ is essential; leaving it out destroys normalization.

The central limit theorem, under appropriate finite-variance and independence or weak-dependence assumptions, explains why appropriately scaled sums often approach a Gaussian. It does not say every data set is Gaussian. Heavy tails, correlations, small samples, or a nonlinear measurement can require another model. Counting very rare independent events often leads instead to a Poisson distribution, $P(n)=e^{-\lambda}\lambda^n/n!$, with mean and variance $\lambda$.

## Microstates, macrostates, and entropy

A microstate specifies detailed microscopic information within the chosen model. A macrostate specifies a smaller collection such as total energy, volume, and particle number. Many microstates can share one macrostate. Let $\Omega$ denote their count in a specified discrete model or a properly defined phase-space measure in a classical model.

Boltzmann's relation is

$$S=k_B\ln\Omega.$$

The logarithm makes entropy additive for independent systems: if system A has $\Omega_A$ possibilities and B has $\Omega_B$, their combined count is $\Omega_A\Omega_B$, so $S_{AB}=S_A+S_B$. The additivity assumes that the systems' allowed states combine independently. Interactions and correlations require attention.

For an isolated system with fixed energy, the microcanonical ensemble assigns equal weights to accessible microstates within an appropriately narrow energy shell. This is a statistical postulate motivated by equilibrium behavior and symmetry of the information available. It is not obtained from counting alone. In a classical continuous phase space, the state measure needs a convention; quantum mechanics supplies a natural scale involving Planck's constant. Entropy differences are often less sensitive to this convention than an absolute classical entropy.

If two weakly coupled systems exchange energy while total energy stays fixed, the most probable division maximizes $S_A(E_A)+S_B(E_{\rm total}-E_A)$. Differentiating with respect to $E_A$ gives

$$\left(\frac{\partial S_A}{\partial E_A}\right)=\left(\frac{\partial S_B}{\partial E_B}\right).$$

Thermodynamics identifies each derivative, at fixed volume and particle number, as $1/T$. Equal temperatures therefore arise from maximum combined multiplicity. This connects the statistical and thermodynamic definitions of equilibrium.

## A reservoir generates the Boltzmann factor

Let a small system exchange energy with a much larger thermal reservoir. If the system occupies microstate $i$ of energy $E_i$, the reservoir has energy $E_{\rm total}-E_i$. The probability of that system microstate is proportional to the reservoir's number of compatible microstates:

$$p_i\propto\Omega_R(E_{\rm total}-E_i)=\exp[S_R(E_{\rm total}-E_i)/k_B].$$

Expand the reservoir entropy to first order in the exchanged energy: $S_R(E_{\rm total}-E_i)\approx S_R(E_{\rm total})-E_i/T$. Higher terms are negligible when the reservoir is sufficiently large and its temperature change is negligible. The common constant cancels on normalization, leaving

$$p_i=\frac{e^{-\beta E_i}}Z,\qquad \beta=\frac1{k_BT},\qquad Z=\sum_i e^{-\beta E_i}.$$

This is the canonical distribution, and $Z$ is the partition function. Every state is included separately; if $g$ distinct states share an energy, their combined probability carries a factor $g$. A common energy shift multiplies every term in $Z$ by the same factor and leaves probabilities unchanged.

For a two-level system with energies $0$ and $\Delta$, one state at each energy,

$$Z=1+e^{-\beta\Delta},\qquad P_{\rm excited}=\frac1{1+e^{\beta\Delta}}.$$

If $\Delta=k_BT\ln3$, then $e^{\beta\Delta}=3$ and the excited-state probability is $1/4$. At low positive temperature it approaches zero; at very high temperature it approaches $1/2$ because the two states become nearly equally weighted. A finite two-state model does not yield unbounded thermal energy.

## A partition function contains thermodynamics

Differentiate $Z$ with respect to $\beta$:

$$\frac{\partial Z}{\partial\beta}=-\sum_i E_i e^{-\beta E_i}.$$

Dividing by $Z$ shows

$$U=\langle E\rangle=-\frac{\partial\ln Z}{\partial\beta}.$$

The derivative holds when the model's energy levels themselves are independent of $\beta$ under the stated fixed parameters. If a temperature-dependent effective Hamiltonian is used, additional care is required. The Helmholtz free energy is $F=-k_BT\ln Z$, and entropy can be written

$$S=-k_B\sum_i p_i\ln p_i=k_B(\ln Z+\beta U).$$

The first expression is the Gibbs entropy for a normalized classical probability distribution over distinguishable alternatives. The convention $0\ln0=0$ follows by continuity. Substituting the canonical probabilities proves the second expression. Quantum states require a density-matrix generalization when coherences are relevant; Chapter 22 introduces that structure.

For the two-level example, $U=\Delta/(1+e^{\beta\Delta})$. Differentiating with respect to temperature gives

$$C_V=k_B\left(\frac{\Delta}{k_BT}\right)^2\frac{e^{\Delta/(k_BT)}}{[1+e^{\Delta/(k_BT)}]^2}.$$

The heat capacity tends to zero at both temperature extremes. At low temperature the upper level is rarely occupied; at high temperature the populations are already nearly equal, leaving little energy change when temperature rises further. The intermediate peak is a Schottky anomaly. This behavior is a concrete warning against treating classical equipartition as universal.

## A worked magnetic example of energy competing with multiplicity

Consider $N$ independent microscopic magnetic moments in a field of magnitude $B$. Each moment can point along or against the field in this two-state model, with energies $-\mu_mB$ and $+\mu_mB$. The positive constant $\mu_m$ is the magnitude of the moment; the subscript distinguishes it from chemical potential. Define $x=\beta\mu_mB$. A single moment has partition function $Z_1=e^x+e^{-x}=2\cosh x$, where $\cosh x=(e^x+e^{-x})/2$.

The mean moment along the field is the value $+\mu_m$ weighted by $e^x/Z_1$ plus the value $-\mu_m$ weighted by $e^{-x}/Z_1$. Thus it is $\mu_m\tanh x$, where $\tanh x=(e^x-e^{-x})/(e^x+e^{-x})$. For independent moments the total mean is $N\mu_m\tanh x$. At weak field or high temperature, expand both exponentials to first order: the numerator is approximately $2x$ and denominator approximately $2$, so $\tanh x\approx x$. The mean total moment is then approximately $N\mu_m^2B/(k_BT)$.

This inverse-temperature response is a statistical result with a clear mechanism. The field favors alignment energetically, while at higher temperature both orientations retain more nearly equal weights. At strong positive $x$, $\tanh x\to1$, and the magnetization saturates rather than growing indefinitely. If $e^{2x}=3$, the aligned probability is $3/4$, the anti-aligned probability $1/4$, and the mean moment per particle is $\mu_m/2$. This model neglects moment interactions and is not a theory of ferromagnetic ordering. Its usefulness lies in an exact example where microscopic energies, state counting, limiting behavior, and a measurable response connect without additional approximation.

## Fluctuations are measurable derivatives

A second derivative of $\ln Z$ gives

$$\frac{\partial^2\ln Z}{\partial\beta^2}=\langle E^2\rangle-\langle E\rangle^2.$$

Using $d\beta/dT=-1/(k_BT^2)$ and the expression for $U$ yields

$$\mathrm{Var}(E)=k_BT^2C_V.$$

This canonical result links microscopic fluctuations to macroscopic response. It assumes fixed volume and particle number and the canonical equilibrium ensemble. It also implies nonnegative canonical heat capacity for the ordinary temperature-independent Hamiltonian under these conditions. Other ensembles, constrained gravitating systems, and effective descriptions require more nuanced statements.

For $N$ weakly coupled comparable particles away from criticality, $U$ and $C_V$ are proportional to $N$, so energy standard deviation scales like $\sqrt N$, while mean energy scales like $N$. Relative fluctuations therefore shrink as $N^{-1/2}$. This is the earlier independent-sum story expressed through thermodynamic derivatives.

## Classical kinetic theory and equipartition

For a particle of mass $m$ in a classical ideal gas, translational energy is $(p_x^2+p_y^2+p_z^2)/(2m)$. The canonical distribution factorizes into three Gaussian momentum components. For one component,

$$f(p_x)=\sqrt{\frac{\beta}{2\pi m}}\exp\left(-\frac{\beta p_x^2}{2m}\right).$$

Its variance is $m/\beta=mk_BT$, so $\langle p_x^2/(2m)\rangle=k_BT/2$. Each independent quadratic term contributes $k_BT/2$ in the classical regime. Three translational terms give mean kinetic energy $3k_BT/2$ per particle and $U=3Nk_BT/2$ for a monatomic ideal gas.

Pressure follows from molecular momentum transfer to walls. A particle's normal momentum reverses at an elastic wall collision; averaging many collisions gives $p=Nm\langle v_x^2\rangle/V$. Isotropy makes the three component variances equal, so $\langle v_x^2\rangle=k_BT/m$ and $pV=Nk_BT$. The equilibrium symmetry and dilute noninteracting model are essential assumptions.

The root-mean-square speed is

$$v_{\rm rms}=\sqrt{\langle v^2\rangle}=\sqrt{\frac{3k_BT}{m}}.$$

For particles of mass $4.65\times10^{-26}\,\mathrm{kg}$ at $300\,\mathrm K$, using $k_B\approx1.381\times10^{-23}\,\mathrm{J\,K^{-1}}$, $v_{\rm rms}\approx517\,\mathrm{m\,s^{-1}}$. This is not the mean speed, nor does it mean the gas as a whole flows at that speed. Opposite microscopic velocities can cancel in the bulk mean.

The speed distribution requires counting how many velocity vectors share the same speed. Spherical shells in velocity space have area $4\pi v^2$, giving

$$f_{\rm speed}(v)=4\pi\left(\frac{m}{2\pi k_BT}\right)^{3/2}v^2e^{-mv^2/(2k_BT)},\quad v\ge0.$$

The extra $v^2$ explains why the most probable speed is nonzero even though each Cartesian velocity component is most likely near zero. Confusing a component distribution with a speed distribution is a common normalization and interpretation error.

## Indistinguishability changes counting

If two identical quantum particles exchange positions, this does not create a new physically distinguishable arrangement merely because we assigned labels in a calculation. Classical dilute-gas counting must account for this by dividing the appropriate many-particle partition function by $N!$. For noninteracting particles in the Maxwell–Boltzmann regime,

$$Z_N\approx\frac{Z_1^N}{N!}.$$

The approximation applies when occupation of each accessible quantum single-particle state is small. It corrects extensivity and prevents a spurious entropy of mixing for identical gases. It does not mean that every classical combinatorial problem should be divided by a factorial; the physical identity of alternatives determines the count.

At low temperature or high density, small-occupancy counting fails. Bosons can share a single-particle state without a one-particle-per-state restriction. Fermions obey the Pauli exclusion principle: at most one identical fermion occupies a specified complete single-particle state, including spin. These are empirical quantum structures, not consequences of ordinary dice probability. Later quantum chapters develop wavefunction symmetry.

## Deriving mean occupations with a particle reservoir

Let a single-particle level of energy $\epsilon$ exchange particles and energy with a reservoir. A state containing $n$ particles in that level has grand-canonical weight proportional to $e^{-\beta n(\epsilon-\mu)}$, where chemical potential $\mu$ controls particle exchange. Define $q=e^{-\beta(\epsilon-\mu)}$.

For a fermionic state, $n$ can be only 0 or 1. Its normalization is $1+q$ and mean occupation is

$$\bar n_F=\frac q{1+q}=\frac1{e^{\beta(\epsilon-\mu)}+1}.$$

For a noninteracting bosonic state, $n=0,1,2,\ldots$. The geometric series $1+q+q^2+\cdots=1/(1-q)$ converges for $0\le q<1$. Differentiate that sum with respect to $q$ to evaluate $\sum n q^n=q/(1-q)^2$. Dividing by the normalization gives

$$\bar n_B=\frac q{1-q}=\frac1{e^{\beta(\epsilon-\mu)}-1}.$$

For equilibrium Bose gases with conserved particle number, $\mu$ cannot exceed the lowest single-particle energy; the limiting ground-state occupation needs special treatment near condensation. For photons in thermal equilibrium with matter, number is not independently conserved and $\mu=0$. Nonequilibrium driven photon systems may require a different description.

When $e^{\beta(\epsilon-\mu)}\gg1$, both distributions approach $e^{-\beta(\epsilon-\mu)}$, the Maxwell–Boltzmann limit. The distinction disappears because two particles rarely compete for the same state. For fermions at zero temperature the occupation approaches a step at the Fermi energy, explaining why a cold electron gas retains substantial kinetic energy. Low temperature does not force every system into the classical state of zero particle velocity.

## A quantum oscillator and the blackbody connection

A quantum harmonic oscillator has energies $E_n=\hbar\omega(n+1/2)$, $n=0,1,\ldots$. This spectrum is introduced here as a quantum result and derived in Chapter 20. Its canonical partition sum is a geometric series:

$$Z=\frac{e^{-\beta\hbar\omega/2}}{1-e^{-\beta\hbar\omega}}.$$

Differentiation gives

$$U=\frac{\hbar\omega}{2}+\frac{\hbar\omega}{e^{\beta\hbar\omega}-1}.$$

The zero-point term is temperature independent. At high temperature, $e^x-1\approx x$ for small $x$, so the thermal contribution approaches $k_BT$. At low temperature it is exponentially suppressed. Electromagnetic cavity modes behave as oscillators; combining their thermal mean energies with the density of modes gives Planck's blackbody spectrum. Quantization removes the classical ultraviolet divergence because high-frequency modes are difficult to thermally excite.

This is a powerful pattern: first obtain the allowed microscopic states from a physical theory, then count and weight them. Probability provides the machinery, while the spectrum and statistics encode the material or field being studied.

### Optional practice

1. A fair coin is tossed four times. Find the probability of exactly one head and of at least one head.
2. For a variable that is 0 with probability $3/4$ and 4 with probability $1/4$, find its mean and variance.
3. A count is Poisson with mean 25. Find its standard deviation and relative standard deviation. What do they become if mean count is 100?
4. A two-level system has one ground state and three excited states, each at energy $\Delta$. Derive its partition function and excited-level probability. Evaluate when $\Delta=k_BT\ln3$.
5. Derive $U=-\partial\ln Z/\partial\beta$ and explain why a common shift of all energies leaves probabilities unchanged but shifts $U$.
6. For a classical gas at fixed temperature, find the ratio of rms speeds for particles whose masses are $m$ and $4m$.
7. At $\epsilon-\mu=k_BT\ln2$, calculate the mean occupancy of one fermionic state and one bosonic state. Explain why occupancy is not the same as a probability for bosons.
8. Show that the quantum oscillator's high-temperature thermal energy tends to $k_BT$ and explain why two quadratic classical terms are involved.

Hints and solutions are in `../solutions/14-hints.md` and `../solutions/14-solutions.md`.

### Source connections

Feynman Volume I Chapters 6 and 39–46 supply the probability, kinetic-theory, and thermal connections; Volume III Chapter 4 connects identical particles and thermal radiation. The canonical derivations and quantum occupation sums are presented here as original mathematical explanations with their equilibrium assumptions stated. Subsequent chapters use probability distributions again in quantum measurements and experimental uncertainty.
