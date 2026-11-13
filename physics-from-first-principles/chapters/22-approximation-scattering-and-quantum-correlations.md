# 22. Approximation, scattering and quantum correlations

Most useful quantum systems cannot be solved by a short list of exact eigenfunctions. Adding a weak electric field to hydrogen, a second electron to an atom, or an interaction between two spins changes the problem. A physicist needs more than exact examples: we need controlled ways to simplify a problem, estimates of the error, and a language for correlations that cannot be represented by independent one-particle states.

This chapter develops three connected abilities. First, estimate energies and transitions without pretending an approximate solution is exact. Second, infer interactions from scattered waves. Third, describe identical particles and entanglement without assigning them inappropriate classical labels. We use the Hilbert-space, differential-equation and angular-momentum ideas established in Chapters 19–21. Whenever a new piece of mathematics appears, we will identify its assumptions.

## Small changes and a bookkeeping parameter

Suppose $H=H_0+\lambda V$, where (H_0) is solvable, (V) is an additional interaction, and $\lambda$ is a dimensionless parameter used to organize the calculation. At the end it may be set to one. It does not magically make a large physical interaction small. What matters is the size of matrix elements of (V) relative to relevant unperturbed energy gaps.

Let $H_0|n^{(0)}\rangle=E_n^{(0)}|n^{(0)}\rangle$. Try expansions

$$E_n=E_n^{(0)}+\lambda E_n^{(1)}+\lambda^2E_n^{(2)}+\cdots,$$
$$|n\rangle=|n^{(0)}\rangle+\lambda|n^{(1)}\rangle+\cdots.$$

Insert them into $H|n\rangle=E_n|n\rangle$. Matching the terms proportional to $\lambda$ gives

$$H_0|n^{(1)}\rangle+V|n^{(0)}\rangle
=E_n^{(0)}|n^{(1)}\rangle+E_n^{(1)}|n^{(0)}\rangle.$$

Multiply by $\langle n^{(0)}|$. Hermiticity of (H_0) makes the terms involving $n^{(1)}$ cancel, leaving

$$E_n^{(1)}=\langle n^{(0)}|V|n^{(0)}\rangle.$$

Thus the first energy shift is the average added potential in the old state. This is not a guess that the state remains unchanged; it is the first term of an expansion that also changes the state.

Project instead onto $\langle m^{(0)}|$, with $m\ne n$, and choose the first correction perpendicular to the old state. We obtain

$$|n^{(1)}\rangle=\sum_{m\ne n}
\frac{\langle m^{(0)}|V|n^{(0)}\rangle}{E_n^{(0)}-E_m^{(0)}}|m^{(0)}\rangle.$$

At the next order, projection onto the original state yields

$$E_n^{(2)}=\sum_{m\ne n}
\frac{|\langle m^{(0)}|V|n^{(0)}\rangle|^2}{E_n^{(0)}-E_m^{(0)}}.$$

These formulas assume an isolated, nondegenerate level and suitable convergence or asymptotic behavior. A small energy denominator can defeat the approximation even when the added interaction looks small in absolute units. The sum includes all relevant discrete states and, when present, an integral over continuum states.

## A two-level calculation with an exact check

Consider

$$H=\begin{pmatrix}0&v\\v&\Delta\end{pmatrix},\qquad \Delta>0,$$

with real coupling $v$. The characteristic equation is $E(E-\Delta)-v^2=0$, so

$$E_\pm=\frac{\Delta\pm\sqrt{\Delta^2+4v^2}}2.$$

For the lower level, the unperturbed energy is zero. The first-order shift vanishes because the diagonal perturbation is zero. The second-order shift is $-v^2/\Delta$. Expand the exact square root using $\sqrt{1+\epsilon}=1+\epsilon/2-\epsilon^2/8+\cdots$:

$$E_-=-\frac{v^2}\Delta+\frac{v^4}{\Delta^3}+\cdots.$$

For $v=0.1\Delta$, the second-order answer is $-0.0100\Delta$, while the exact result is about $-0.009902\Delta$. Its relative error is about one percent. For $v=\Delta$, the same approximation gives $-\Delta$ instead of about $-0.618\Delta$; it is poor. Checking a solvable model reveals how the ratio $|v|/\Delta$ controls the expansion.

At $\Delta=0$, nondegenerate formulas divide by zero. The correct first step is to diagonalize the perturbation inside the degenerate subspace. Here the states $(|1\rangle\pm|2\rangle)/\sqrt2$ have energies $\pm v$. Choosing an arbitrary old basis and treating a zero denominator as a numerical nuisance misses the physical mixing.

## Symmetry can make an energy shift vanish

Put a particle in a symmetric potential and add $V=Fx$, with (F) having units force. A stationary state of definite parity has even density, while (x) is odd. Therefore $\int\psi^*x\psi dx=0$, so its first-order energy shift vanishes. It does not follow that the interaction has no effect. It mixes opposite-parity states and usually produces a second-order shift.

For the harmonic oscillator, completing the square gives an exact check:

$$\frac12m\omega^2x^2+Fx
=\frac12m\omega^2\left(x+\frac{F}{m\omega^2}\right)^2
-\frac{F^2}{2m\omega^2}.$$

All oscillator levels shift by $-F^2/(2m\omega^2)$, and the equilibrium position moves to $-F/(m\omega^2)$. The shift is quadratic, consistent with zero first order. The potential has been displaced; no instability appears because its curvature remains positive. This example is a useful test of both algebra and physical interpretation.

## The variational principle is an upper bound

Suppose a normalized trial state $|\phi\rangle$ is in the Hamiltonian's domain and the Hamiltonian is bounded below by ground energy $E_0$. Expand the trial state in energy eigenstates for a discrete example:

$$|\phi\rangle=\sum_n c_n|n\rangle,\qquad \sum_n|c_n|^2=1.$$

Its average energy is $\sum_n|c_n|^2E_n$. Since every $E_n\ge E_0$,

$$\langle\phi|H|\phi\rangle\ge E_0.$$

The spectral version extends the argument to continuous spectra. This is a theorem, not an empirical approximation rule. The approximation enters when we restrict the trial states to a manageable family. Minimizing within that family produces the best upper bound available there; it does not guarantee the best possible approximation to every other observable.

Try a normalized Gaussian for a one-dimensional oscillator:

$$\phi_\alpha(x)=\left(\frac\alpha\pi\right)^{1/4}e^{-\alpha x^2/2},\qquad\alpha>0.$$

Using $\langle x^2\rangle=1/(2\alpha)$ and $\langle p^2\rangle=\hbar^2\alpha/2$,

$$E(\alpha)=\frac{\hbar^2\alpha}{4m}+\frac{m\omega^2}{4\alpha}.$$

Differentiation gives $dE/d\alpha=\hbar^2/(4m)-m\omega^2/(4\alpha^2)$. The positive stationary point is $\alpha=m\omega/\hbar$, with energy $\hbar\omega/2$. Here the trial family contains the exact ground state, so the bound is attained. A poorer family would give a larger result. If a computation produces a value below a known exact ground energy, then normalization, the Hamiltonian, integration, or the claimed bound has been mishandled.

For a quartic addition $\gamma x^4$, $\gamma>0$, the same Gaussian gives

$$E(\alpha)=\frac{\hbar^2\alpha}{4m}+\frac{m\omega^2}{4\alpha}+
\frac{3\gamma}{4\alpha^2}.$$

The new term uses $\langle x^4\rangle=3/(4\alpha^2)$. Minimization can be numerical. This is a real prediction for a nonsolvable model with a one-sided energy guarantee. It is not a proof that the true wavefunction is Gaussian.

## Time-dependent driving and transition amplitudes

Now let $H(t)=H_0+V(t)$. Expand the state using unperturbed time phases:

$$|\psi(t)\rangle=\sum_n c_n(t)e^{-iE_nt/\hbar}|n\rangle.$$

Substituting into the Schrödinger equation cancels the $H_0$ terms and gives

$$i\hbar\dot c_f(t)=\sum_n V_{fn}(t)
e^{i(E_f-E_n)t/\hbar}c_n(t).$$

If the system starts in $|i\rangle$ and transitions remain weak, set $c_i\approx1$ and the other amplitudes to zero on the right. Integration gives the first-order transition amplitude

$$c_f^{(1)}(t)=-\frac i\hbar\int_0^t
V_{fi}(t')e^{i\omega_{fi}t'}dt',\qquad
\omega_{fi}=\frac{E_f-E_i}{\hbar}.$$

For a constant off-diagonal interaction $v$ switched on at zero,

$$P_{i\to f}(t)\approx
\frac{4|v|^2}{\hbar^2\omega_{fi}^2}
\sin^2\frac{\omega_{fi}t}{2}.$$

At exact degeneracy the limiting expression is $|v|^2t^2/\hbar^2$. It eventually exceeds one if used beyond its regime; this flags breakdown of the first-order approximation. The exact resonant two-level result is a bounded sine squared, describing repeated coherent transfer. Perturbation theory cannot describe full depletion while assuming the initial amplitude remains one.

A sinusoidal drive $V(t)\propto\cos\omega t$ contains exponentials at $\pm\omega$. The integral becomes large when one oscillating phase varies slowly, near $\omega=|\omega_{fi}|$. Resonance emerges from phase accumulation. In a continuum of final states, a long-time limit leads to Fermi's golden rule, $\Gamma=(2\pi/\hbar)|V_{fi}|^2\rho(E_f)$, where $\rho$ is the density of accessible final states in the convention used. This requires a weak interaction, a suitable continuum, and a time window where a nearly constant rate makes sense. It is not the exact evolution law for an isolated pair of levels.

## Slowly varying potentials and the WKB idea

The time-independent equation can be written $\phi''+k(x)^2\phi=0$, where $k(x)=\sqrt{2m[E-V(x)]}/\hbar$ in an allowed region. If $k$ changes little over one wavelength, a local wave can be approximated as

$$\phi(x)\approx\frac{A}{\sqrt{k(x)}}
\exp\left(i\int^xk(s)ds\right)+
\frac{B}{\sqrt{k(x)}}\exp\left(-i\int^xk(s)ds\right).$$

The phase integral adds local wave number along the path. The amplitude factor makes the current approximately constant when no reflection is being generated. A common local criterion is $|k'|\ll k^2$. It fails at a turning point, where $E=V$ and $k=0$; connection formulas derived from a locally linear potential are then required.

Inside a broad forbidden interval $[x_1,x_2]$, the leading transmission exponent is

$$T\sim\exp\left[-2\int_{x_1}^{x_2}
\frac{\sqrt{2m[V(x)-E]}}\hbar\,dx\right].$$

The integral is dimensionless. This estimate explains why changing mass or barrier width has such a large effect on tunneling. It does not supply every prefactor, nor is it reliable for an arbitrarily sharp or thin barrier. Chapter 20's exact rectangular result provides a useful comparison. A controlled approximation comes with a criterion and a limiting check.

## Scattering converts an interaction into an angular pattern

In three dimensions, a localized potential deflects an incoming wave. Far from the interaction, a conventional stationary form is

$$\psi(\mathbf r)\sim e^{ikz}+f(\theta,\varphi)\frac{e^{ikr}}r.$$

The first term is the incoming plane wave and the second an outgoing spherical wave. The amplitude $f$ has units length. Comparing outgoing flux through a patch $r^2d\Omega$ with incident flux gives

$$\frac{d\sigma}{d\Omega}=|f(\theta,\varphi)|^2.$$

The cross section is an effective area describing a rate per incident flux; it is not necessarily the physical silhouette of the target. For a beam flux $\mathcal F$ particles per area per time and a single target, the count rate into a small detector solid angle is $\mathcal F(d\sigma/d\Omega)\Delta\Omega$, with detector efficiency and backgrounds treated separately in an experiment.

For a weak, sufficiently short-range potential, the first Born approximation gives

$$f_B(\mathbf k_f,\mathbf k_i)=
-\frac{m}{2\pi\hbar^2}\int e^{-i(\mathbf k_f-\mathbf k_i)\cdot\mathbf r}
V(\mathbf r)d^3r.$$

This is a Fourier transform of the potential with a stated normalization convention. The momentum transfer is $\hbar(\mathbf k_f-\mathbf k_i)$. The approximation neglects the change of the wave inside the scattering integral, using the incoming plane wave there. A strong potential, low-energy resonance, or long-range unscreened Coulomb interaction demands more care; small coupling by appearance alone is not a sufficient criterion.

Take $V(r)=V_0e^{-r^2/a^2}$. The three Cartesian Gaussian integrals factor. Using $\int e^{-x^2/a^2-iq_xx}dx=\sqrt\pi a,e^{-a^2q_x^2/4}$,

$$f_B(q)=-\frac{mV_0\sqrt\pi a^3}{2\hbar^2}e^{-a^2q^2/4},
\qquad q=2k\sin\frac\theta2.$$

The amplitude decreases when the transfer resolves length scales smaller than $a$. Squaring gives an angular distribution. Its prefactor has units length because $mV_0a^3/\hbar^2$ does. This model illustrates how spatial structure leaves a pattern in momentum transfer; it is not a universal scattering law.

## Partial waves and the low-energy limit

For a central potential, rotational symmetry lets us decompose scattering into angular-momentum channels. Each channel $l$ acquires a phase shift $\delta_l$ relative to a free radial wave. The amplitude is

$$f(\theta)=\frac1k\sum_{l=0}^\infty(2l+1)
e^{i\delta_l}\sin\delta_l,P_l(\cos\theta),$$

where $P_l$ are Legendre polynomials, with $P_0=1$, $P_1(x)=x$. They are the azimuthally symmetric angular basis associated with the spherical harmonics. Orthogonality of these polynomials gives the total elastic cross section

$$\sigma=\frac{4\pi}{k^2}\sum_l(2l+1)\sin^2\delta_l.$$

At low energy for an ordinary short-range potential, the $l=0$ or s-wave often dominates because higher angular momenta face larger centrifugal barriers. Defining the scattering length by $\delta_0\approx-ka_s$ at sufficiently small $k$, we obtain $\sigma\approx4\pi a_s^2$ for distinguishable particles in this simple channel. Near a threshold resonance $a_s$ can become very large and the naive fixed-$a_s$ low-energy description must be used with its limits. For identical particles, symmetrization changes which channels and counting conventions apply.

## Identical particles require exchange symmetry

Two electrons cannot be made physically distinguishable by writing labels 1 and 2 on paper. The labels identify coordinate slots in a calculation. Interchanging those slots must give a state with the same physical predictions. For identical bosons the state is symmetric under exchange; for identical fermions it is antisymmetric. The spin-statistics connection is a result of relativistic quantum field theory under its assumptions; here we adopt its experimentally supported consequence for nonrelativistic multiparticle states.

For two orthonormal one-particle states $a,b$, define the product $a(1)b(2)$. A normalized fermionic state is

$$\Psi_F(1,2)=\frac{a(1)b(2)-b(1)a(2)}{\sqrt2}.$$

The denominator follows because the two products have unit norm and zero mutual inner product. Replacing the minus with a plus gives the corresponding bosonic state. If a boson pair occupies the same one-particle state, the normalized state is $a(1)a(2)$, not the previous expression with an unchanged denominator. Normalization depends on overlap.

For fermions, setting $a=b$ makes the antisymmetric expression zero. There is no normalized two-fermion state with both in the same complete one-particle state: the Pauli exclusion principle. The word complete includes spin. Two electrons may share the same spatial orbital if their spin part combines antisymmetrically. A symmetric spatial state times the antisymmetric spin singlet has the required overall antisymmetry.

For $N$ fermions in $N$ orthonormal orbitals, the compact form is a Slater determinant, a determinant of the matrix whose entries are orbital $j$ evaluated at particle slot $i$, multiplied by $1/\sqrt{N!}$. A determinant changes sign when two rows are exchanged and vanishes when two columns are identical. Those mathematical properties implement exchange antisymmetry and exclusion. A single determinant is often an approximation; interacting electrons can require superpositions of determinants.

## Entanglement means failure of a product description

Consider two distinguishable two-state systems with bases $|0\rangle,|1\rangle$. Their joint space consists of four amplitudes in the basis $|00\rangle,|01\rangle,|10\rangle,|11\rangle$. A product state has amplitudes $(a|0\rangle+b|1\rangle)(c|0\rangle+d|1\rangle)$, so the four coefficients are $ac,ad,bc,bd$.

The Bell state

$$|\Phi^+\rangle=\frac{|00\rangle+|11\rangle}{\sqrt2}$$

cannot be such a product. If $ac$ and $bd$ are nonzero, then all four $a,b,c,d$ are nonzero, forcing $ad$ and $bc$ nonzero, contrary to the state. That is a direct proof of entanglement for this pure state.

Measuring both systems in the $0,1$ basis gives 00 or 11, each with probability one half. This alone could be mimicked by a classical mixture of matching labels. The quantum distinction appears in other bases. Since $|\pm\rangle=(|0\rangle\pm|1\rangle)/\sqrt2$, the same Bell state is $(|++\rangle+|--\rangle)/\sqrt2$, again perfectly correlated. The classical mixture of 00 and 11 instead produces all four $x$-basis results equally often.

This difference is coherence, not communication faster than light. Either observer's local outcome is random with probability one half. Changing which basis the distant observer measures does not change those local probabilities when distant results are not conditioned upon. Comparing the correlations requires bringing records together through an ordinary communication channel.

## Density matrices make the distinction precise

For a pure state, define $\rho=|\psi\rangle\langle\psi|$. For a probabilistic ensemble of prepared states, define $\rho=\sum_a p_a|\psi_a\rangle\langle\psi_a|$, with $p_a\ge0$ and $\sum_ap_a=1$. An observable average is $\langle A\rangle=\operatorname{Tr}(\rho A)$; the trace is the sum of diagonal matrix entries. This formula follows by expanding the ensemble average of the pure-state Born rule.

In the ordered basis 00,01,10,11, the Bell-state density matrix has diagonal entries $1/2,0,0,1/2$, plus off-diagonal entries $\rho_{00,11}=\rho_{11,00}=1/2$. The classical mixture has the same diagonal entries but zero off-diagonal ones. Hence measurements in the original basis agree while suitable rotated-basis measurements differ.

To obtain the state relevant for local measurements on $A$, sum over a complete basis of $B$:

$$\rho_A=\operatorname{Tr}_B\rho_{AB},\qquad
(\rho_A)_{ii'}=\sum_j(\rho_{AB})_{ij,i'j}.$$

For the Bell state this gives $\rho_A=I/2$. Its local state is mixed even though the joint state is pure. The relation $\operatorname{Tr}\rho_A^2=1/2<1$ detects that mixedness; the joint pure density matrix satisfies $\operatorname{Tr}\rho_{AB}^2=1$. Entanglement is a property of the joint state relative to a partition into subsystems, not merely an unfamiliar correlation coefficient.

## How to choose a method

Use nondegenerate perturbation theory when relevant couplings are small relative to gaps. Diagonalize within a nearly degenerate subspace before expanding outside it. Use variational families when a ground-state estimate and a reliable upper bound are valuable. Use time-dependent perturbation for weak transitions over a valid time window; use exact two-level evolution or numerical integration when depletion matters. Use WKB when the potential varies slowly on a wavelength scale, with turning-point treatment where needed. Use scattering methods suited to the potential range and strength. None of these choices eliminates the need to inspect units, normalization, symmetry and limiting behavior.

For many particles, first decide what the subsystems and complete one-particle states are. Impose exchange symmetry where required, then ask whether an independent-particle approximation is adequate. The presence of an antisymmetric determinant and the presence of interaction-induced correlations are related but different issues. Careful definitions prevent the same word, correlation, from doing several incompatible jobs.

## Optional practice

1. For the two-level matrix with $v=0.2\Delta$, compare exact and second-order lower energies and calculate the relative error.
2. Derive the exact oscillator shift for an added $Fx$ term by completing the square, and compare its order in $F$ with the parity argument.
3. In units $\hbar=m=\omega=1$, use the Gaussian variational family for $H=p^2/2+x^2/2+0.1x^4$. Write the equation determining the best positive $\alpha$; find a numerical approximate root or bracket it.
4. Take a constant weak transition matrix element $v$ between two degenerate levels. At what time scale does first-order probability cease to be small? Compare with exact resonant transfer.
5. Starting from the Gaussian Born amplitude, obtain $d\sigma/d\Omega$ and explain how increasing $a$ changes its angular width at fixed $k$.
6. Normalize $a(1)b(2)+b(1)a(2)$ when $\langle a|b\rangle=s$, assuming both orbitals are normalized. Include the $a=b$ case.
7. Prove directly that $(|01\rangle-|10\rangle)/\sqrt2$ is not a product state and find its local density matrix.
8. Compare the probability of matching $x$-basis outcomes for $|\Phi^+\rangle$ and for an equal classical mixture of $|00\rangle$, $|11\rangle$.

[Hints](../solutions/22-hints.md) and [solutions](../solutions/22-solutions.md) are separate. The [companion](../companion/index.html) is useful for parameter changes; use an exact solvable limit to check a numerical approximation whenever one is available.

## References and further study

Connections: Feynman Lectures, Volume III, chapters 3–4, 8–11 and 15. The official [MIT Quantum Physics III notes index](https://www.ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2018/resources/lecture-notes/) identifies the upper-undergraduate families of perturbation, approximation and scattering problems. The explanations and examples above are original rather than a transcription of those notes.
