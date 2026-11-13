# 23. Condensed matter: bands, semiconductors and collective behavior

A small collection of atoms has a few recognizable energy levels. A crystal contains an enormous number of atoms, yet it can conduct electricity, insulate, transmit sound, become magnetic, or carry current without ordinary electrical resistance. The central challenge is to predict collective behavior without solving separately for every atom and electron.

We will build a sequence of models with explicit assumptions: a lattice of repeating positions, a particle moving through a periodic environment, electrons filling the resulting states, and coupled degrees of freedom that support collective motion. Each model answers a particular question. No single independent-electron picture explains every solid. The point is to recognize which simplification preserves the behavior we are trying to understand.

The mathematical ingredients are Fourier waves, eigenvectors, probability distributions, quantum statistics, and differential equations from earlier chapters. We will introduce reciprocal-space counting, effective mass and order parameters as they become necessary. This chapter connects particularly closely to Feynman's treatments of crystal propagation and semiconductors, while extending the reasoning into a broader undergraduate condensed-matter framework.

## A lattice is geometry, not yet a material

In one dimension, equally spaced lattice sites lie at $x_n=na$, where $a$ is the spacing and $n$ is integer. In three dimensions a Bravais lattice has positions

$$\mathbf R=n_1\mathbf a_1+n_2\mathbf a_2+n_3\mathbf a_3.$$

The three primitive vectors specify translations that leave the site pattern unchanged. A basis of one or more atoms can be attached to each lattice point. Lattice and basis are different ideas: the lattice describes repetition, while the basis describes what repeats. Some crystals require several atoms in a primitive cell; one should not count every atom as an independent primitive translation.

A plane wave $e^{i\mathbf k\cdot\mathbf r}$ changes phase under a lattice translation by $e^{i\mathbf k\cdot\mathbf R}$. Wave vectors differing by a reciprocal-lattice vector $\mathbf G$ give the same translation phases if

$$e^{i\mathbf G\cdot\mathbf R}=1\quad\hbox{for all lattice vectors }\mathbf R.$$

Equivalently, $\mathbf G\cdot\mathbf R$ is an integer multiple of $2\pi$. In one dimension, $G=2\pi m/a$. We can therefore choose one interval of distinct translation labels, usually $-\pi/a\le k<\pi/a$, called the first Brillouin zone. This is a counting convention for physically distinct translation phases, not a claim that ordinary momentum cannot exceed $\hbar\pi/a$.

Diffraction follows the same geometry. Scattering amplitudes from sites contain a sum $\sum_ne^{i\mathbf q\cdot\mathbf R_n}$, where $\mathbf q$ is the wave-vector transfer. At a reciprocal-lattice transfer the phases line up. If they vary around the unit circle, contributions largely cancel. Finite crystals have finite-width peaks, and the atomic basis changes their intensities. The phase-sum reasoning is more general than memorizing a particular plane-spacing formula.

## Why periodicity permits Bloch waves

Suppose an electron moves in a potential satisfying $V(x+a)=V(x)$. The translation operator and Hamiltonian commute, so their eigenfunctions can be chosen together. If one translation multiplies a state by a phase $e^{ika}$, then

$$\psi_k(x+a)=e^{ika}\psi_k(x).$$

Define $u_k(x)=e^{-ikx}\psi_k(x)$. Substituting $x+a$ gives $u_k(x+a)=u_k(x)$. Thus

$$\psi_k(x)=e^{ikx}u_k(x),$$

with a periodic function $u_k$. This is Bloch form. The argument relies on the periodic Hamiltonian and suitable translation eigenstates. Disorder, surfaces and finite boundaries require modifications. Even in a perfect crystal, the electron's ordinary momentum distribution can contain several Fourier components; the Bloch label is a crystal momentum defined modulo reciprocal-lattice vectors.

Different solutions at the same $k$ are labeled by a band index $n$, giving energies $E_n(k)$. In a large crystal, nearby allowed $k$ values are very closely spaced. A band is a family of states across those labels, not a single broadened atomic state with one probability assigned to the whole family.

## Building a band from coupled sites

Take $N$ identical sites on a one-dimensional ring, one localized orbital $|n\rangle$ per site, and nearest-neighbor hopping only. Let the on-site energy be $\epsilon_0$ and the real positive hopping parameter be $t$. Our model Hamiltonian acts as

$$H|n\rangle=\epsilon_0|n\rangle-t|n-1\rangle-t|n+1\rangle.$$

The minus sign is a stated convention. Try the normalized phase-pattern state

$$|k\rangle=\frac1{\sqrt N}\sum_ne^{ikna}|n\rangle.$$

Each coefficient receives contributions from its two neighbors. Factoring out $e^{ikna}$ leaves $e^{ika}+e^{-ika}=2\cos ka$. Therefore

$$E(k)=\epsilon_0-2t\cos ka.$$

Periodic boundaries require $e^{ikNa}=1$, so $k=2\pi m/(Na)$. There are $N$ distinct wave vectors in one Brillouin zone. Without spin, one orbital on each of $N$ sites produces $N$ states in the band, exactly preserving the original number of degrees of freedom. Including spin one half gives two states per $k$ in this spin-independent model.

The band width is $4t$: the minimum is $\epsilon_0-2t$ and maximum $\epsilon_0+2t$. When $t\to0$, the band collapses to the isolated-site energy. Stronger overlap produces greater dispersion. This simple model explains how a large collection of equal local energies turns into many closely spaced extended-state energies.

## Group velocity and effective mass

A wave packet narrowly concentrated around $k$ moves with group velocity

$$v_g=\frac1\hbar\frac{dE}{dk}.$$

For the cosine band, $v_g=(2ta/\hbar)\sin ka$. At the band minimum and maximum the velocity is zero, even though the crystal momentum label can be nonzero at the zone edge. A current depends on the distribution of velocities, not simply on how many electrons are present.

Under a slowly varying weak force $F$, semiclassical wave-packet dynamics gives $\hbar\dot k=F$. Differentiate the velocity:

$$\dot v_g=\frac1{\hbar^2}\frac{d^2E}{dk^2}F.$$

Define the local effective mass by

$$\frac1{m^*}=\frac1{\hbar^2}\frac{d^2E}{dk^2}.$$

Near the cosine-band minimum, use $\cos ka\approx1-(ka)^2/2$. Then $E\approx\epsilon_0-2t+ta^2k^2$, so $m^*=\hbar^2/(2ta^2)$. With $t=1.00\,\mathrm{eV}$ and $a=0.300\,\mathrm{nm}$, this gives approximately $3.86\times10^{-31}\,\mathrm{kg}$, or $0.423m_e$. The electron's vacuum mass has not changed; the parameter describes its acceleration in the periodic environment within this band approximation.

Near a band maximum, curvature and electron effective mass are negative. This does not imply negative rest energy or a material with a negative amount of matter. The convenient description of a nearly full band uses holes: missing electrons behave as positively charged excitations with positive effective mass near the maximum. Their dispersion is measured as missing-electron energy relative to the filled-band reference.

## Filling states explains the first metal-insulator distinction

Electrons are fermions. At zero temperature, they occupy the lowest available one-particle states subject to Pauli exclusion, up to the Fermi energy. In the spin-degenerate single-band model there are $2N$ states. With one electron per site, the band is half filled. Small excitations can move electrons into nearby empty states, so the independent-electron model has metallic behavior.

With two electrons per site, the band is full. If the next band is separated by a gap $E_g$, creating an electron excitation costs finite energy. At low enough temperature and for a clean sample, this produces a band insulator. Interactions can change this classification: a partly filled band can become insulating through correlations or symmetry breaking. The filling argument is an important first model, not an all-material theorem.

Why does a completely filled band carry no ordinary net current? Sum its velocities. In one dimension with uniform state counting, the sum becomes proportional to

$$\int_{-\pi/a}^{\pi/a}\frac{dE}{dk}\,dk
=E(\pi/a)-E(-\pi/a)=0.$$

The endpoints have equal energy by periodicity. A nearly full band's current can be calculated by subtracting the missing electron contributions from zero, which gives the hole picture its practical meaning.

At finite temperature the occupation probability is the Fermi-Dirac function,

$$f(E)=\frac1{e^{(E-\mu)/(k_BT)}+1},$$

where $\mu$ is chemical potential and $k_B$ is Boltzmann's constant. Far below $\mu$, occupation is near one; far above, near zero. Only a thermal energy window around $\mu$ changes substantially when a cold metal is warmed. This is why the electronic heat capacity of an ordinary degenerate metal is much smaller than a classical equipartition estimate for all its electrons.

## Counting free-electron states in three dimensions

For a large box of volume $V$ with periodic boundaries, allowed wave vectors occupy a grid with one state per volume $(2\pi)^3/V$ in $k$ space. Including two spin states, filling a sphere of radius $k_F$ gives

$$N=2\frac V{(2\pi)^3}\frac{4\pi k_F^3}{3},\qquad
k_F=(3\pi^2n)^{1/3},$$

where $n=N/V$. With dispersion $E=\hbar^2k^2/(2m^*)$, the Fermi energy is $E_F=\hbar^2k_F^2/(2m^*)$. These expressions belong to an isotropic parabolic-band model. Real band shapes may require more complicated counting.

The density of states tells how many levels lie in an energy interval: $g(E)dE$ is their number. Differentiating the cumulative sphere count gives $g(E)\propto\sqrt E$ for a three-dimensional parabolic band measured upward from its minimum. In one dimension the result is instead proportional to $1/\sqrt E$ near the edge. Geometry changes the state counting. One should not transplant a density-of-states formula between dimensions without revisiting the measure.

## Scattering turns acceleration into ordinary conductivity

An applied electric field exerts force $-e\mathbf E$ on an electron. In a parabolic-band relaxation-time model, the average drift velocity obeys

$$m^*\frac{d\mathbf v_d}{dt}=-e\mathbf E-\frac{m^*\mathbf v_d}{\tau},$$

where $\tau>0$ is a phenomenological momentum-relaxation time. In the steady state, $\mathbf v_d=-e\tau\mathbf E/m^*$. The current density is charge times carrier density times velocity:

$$\mathbf j=-ne\mathbf v_d=\frac{ne^2\tau}{m^*}\mathbf E.$$

Thus $\sigma=ne^2\tau/m^*$. This is a model of transport after averaging over scattering processes. It does not say that every microscopic electron is a slow classical ball. In a degenerate metal, the distribution responds near the Fermi surface and $\tau$ summarizes processes that relax the current.

For a hypothetical material with $n=10^{28}\,\mathrm{m}^{-3}$, $m^*=m_e$ and $\tau=10^{-14}\,\mathrm s$, the model gives $\sigma\approx2.82\times10^6\,\mathrm{S/m}$. Increasing $\tau$ doubles conductivity if all else stays fixed. If no relaxation were present, the steady-state assumption would fail: the model would predict continued acceleration rather than a finite dc Ohm-law coefficient. A finite measured resistance calls for a mechanism of momentum or current relaxation, including boundaries where appropriate.

## Band gaps from mixing waves

A weak periodic potential couples plane waves whose wave vectors differ by reciprocal-lattice vectors. Near a crossing, retain just two nearly degenerate waves. Their Hamiltonian has form

$$H=\begin{pmatrix}E_0&U\\U^*&E_0\end{pmatrix}.$$

Diagonalizing gives $E_0\pm|U|$, an energy splitting $2|U|$. This is the same avoided-crossing mathematics as Chapter 22. At a zone boundary, Bragg-coupled waves can form standing combinations with different probability near the ionic potential, producing different energies. Repeated crossings organize bands and gaps.

The conclusion depends on retaining the appropriate coupled states. It does not mean every periodic potential produces the same gap or that a gap must open everywhere in a multidimensional band structure. Symmetry can protect crossings. The two-state example supplies a mechanism and a calculation, not a substitute for a material's full Hamiltonian.

## Semiconductors: a small population can control a current

In a semiconductor, thermal excitation can put an electron in a conduction band and leave a hole in a valence band. At thermal equilibrium, carrier concentrations depend on the gap, density of states, chemical potential and temperature. In the nondegenerate limit, where occupation probabilities are small in the relevant band-edge description,

$$n\approx N_c e^{-(E_c-\mu)/(k_BT)},\qquad
p\approx N_v e^{-(\mu-E_v)/(k_BT)}.$$

Here $N_c,N_v$ are effective densities of states per volume, and $E_g=E_c-E_v$. Multiplying gives

$$np=N_cN_v e^{-E_g/(k_BT)}\equiv n_i^2.$$

For an ideal intrinsic semiconductor, charge neutrality gives $n=p=n_i$. Then $n_i=\sqrt{N_cN_v}e^{-E_g/(2k_BT)}$. The factor of two in the exponent follows because one excitation creates two carrier types and neutrality determines the chemical potential. Assigning $e^{-E_g/k_BT}$ separately to both intrinsic carrier densities would double count the gap cost.

At $300\,\mathrm K$, $k_BT\approx0.0259\,\mathrm{eV}$. In a hypothetical material with $E_g=1.00\,\mathrm{eV}$, the intrinsic exponential factor is $e^{-1/(2\times0.0259)}\approx4.1\times10^{-9}$. The prefactors have units density and can be large, so the factor alone is not the actual concentration. It does show the strong temperature sensitivity and why the gap matters.

Dopants can supply donor or acceptor levels. If donors are nearly fully ionized and compensation is negligible, a useful approximate regime is $n\approx N_D$ and $p\approx n_i^2/N_D$. These assumptions fail during carrier freeze-out, strong degeneracy, or substantial compensation. Doping changes available carriers and equilibrium charge balance; it is not just adding a uniform sea of uncompensated electrical charge to a bulk sample.

## A junction: diffusion and electric drift balance

Join p-type and n-type regions. Initial carrier-density gradients drive diffusion. As carriers move and recombine, relatively immobile ionized dopants leave a space-charge region. Its electric field opposes further net diffusion. At equilibrium the electrochemical potential is uniform and the total current vanishes, although drift and diffusion contributions can each be nonzero.

In the elementary nondegenerate model with fully ionized dopants, the built-in voltage is

$$V_{\mathrm{bi}}=\frac{k_BT}{e}\ln\frac{N_AN_D}{n_i^2}.$$

The logarithm enters because equilibrium carrier densities depend exponentially on electrostatic energy. If $N_A=N_D=10^{22}\,\mathrm{m}^{-3}$ and $n_i=10^{16}\,\mathrm{m}^{-3}$ at $300\,\mathrm K$, then $V_{\mathrm{bi}}\approx0.0259\ln(10^{12})\,\mathrm V\approx0.716\,\mathrm V$. These are chosen model parameters, not a specification for a particular manufactured device.

A built-in contact field is not a perpetual external battery: in equilibrium a complete closed measurement circuit includes contact potentials and has no extractable steady power without an additional energy source. Under applied bias or illumination, the equilibrium assumptions change. Ideal diode equations then require carrier transport and recombination assumptions; the equilibrium voltage formula alone does not derive their full current-voltage curve.

## Phonons begin with coupled masses

Consider a line of identical masses $M$, spacing $a$, joined by springs of constant $K$. Let $u_n(t)$ be a small longitudinal displacement. Linear restoring forces give

$$M\ddot u_n=K(u_{n+1}-2u_n+u_{n-1}).$$

Try $u_n=u_0e^{i(kna-\omega t)}$. Substitution gives

$$\omega^2=\frac{4K}{M}\sin^2\frac{ka}{2},\qquad
\omega=2\sqrt{\frac KM}\left|\sin\frac{ka}{2}\right|.$$

At long wavelengths $|ka|\ll1$, $\omega\approx a\sqrt{K/M}|k|$, so sound speed is $c_s=a\sqrt{K/M}$. At short wavelengths the discrete nature of the lattice matters; the continuum wave equation ceases to capture the full dispersion.

Each normal mode is a harmonic oscillator. Quantizing it gives energies $\hbar\omega_k(n_k+1/2)$; its excitation quanta are phonons. A phonon is a quantum of collective lattice vibration, not a separate atom hidden between lattice sites. The thermal occupation is Bose-Einstein because mode occupation can be any nonnegative integer and phonon number is not generally conserved in equilibrium, giving zero phonon chemical potential.

In three dimensions with linear low-frequency dispersion, the number of modes in a shell is proportional to $k^2dk$, hence the mode density is proportional to $\omega^2d\omega$. The thermal energy has the form

$$U_{\mathrm{th}}\propto\int_0^\infty
\frac{\hbar\omega\,\omega^2}{e^{\hbar\omega/(k_BT)}-1}d\omega.$$

Change variable to $x=\hbar\omega/(k_BT)$. The integral becomes a temperature-independent number times $T^4$, so heat capacity scales as $T^3$ in the low-temperature Debye regime. The upper limit is extended to infinity only when thermal energies are well below the lattice cutoff. At high temperature each normal mode approaches classical equipartition and the total lattice heat capacity approaches $3Nk_B$ for $N$ atoms in the harmonic approximation. These two limits arise from the same mode counting and occupation law.

## Magnetism needs interactions as well as moments

Independent magnetic moments in a field tend to align energetically, while thermal randomness opposes alignment. That competition produces paramagnetism. A ferromagnet adds interactions that favor collective order even without an applied field below a characteristic temperature. An order parameter is a quantity that distinguishes phases; average magnetization is an example.

A minimal Ising model assigns $s_i=\pm1$ to each site:

$$H=-J\sum_{\langle i,j\rangle}s_is_j-h\sum_i s_i.$$

Here $J>0$ favors neighboring equal signs and $h$ is an energy-like field coupling. The notation $\langle i,j\rangle$ counts each neighboring pair once. In a mean-field approximation, replace each neighbor by its average $m=\langle s\rangle$. A site with $z$ neighbors feels effective energy field $zJm+h$, leading to the consistency equation

$$m=\tanh\left[\frac{zJm+h}{k_BT}\right].$$

At $h=0$, expand $\tanh x\approx x-x^3/3+\cdots$ near zero. A nonzero small solution appears in this approximation when $k_BT$ falls below $zJ$. This predicts collective ordering through feedback. It neglects spatial fluctuations and correlations. In particular, the short-range one-dimensional Ising chain has no nonzero-temperature spontaneous magnetization in the infinite-system zero-field limit, contrary to naive mean field. A model approximation can capture a mechanism and still give the wrong phase diagram in a particular dimension.

## Superconductivity: what the simplest models establish

Superconductivity includes persistent current and magnetic-field expulsion in the equilibrium Meissner effect. Perfect conductivity alone does not logically imply the full Meissner response. A phenomenological London relation for a simple uniform superfluid density $n_s$ leads to

$$\nabla^2\mathbf B=\frac{\mathbf B}{\lambda_L^2},\qquad
\lambda_L=\sqrt{\frac{m^*}{\mu_0n_sq^2}}.$$

For a flat surface with superconductor occupying $x>0$, the decaying solution is $B(x)=B(0)e^{-x/\lambda_L}$. The penetration depth is finite, so expulsion is not the statement that the field jumps to zero at every boundary. This is a phenomenological electrodynamic description; it does not by itself explain the microscopic origin of the superconducting state.

In conventional BCS theory, an effective attraction near a Fermi surface creates correlated electron pairs and a many-particle coherent state with an excitation gap. The paired state cannot be understood as an ideal gas of nonoverlapping tiny molecules in every material. Many superconductors require richer microscopic descriptions. Here we have identified what a gap, an order parameter and a collective electromagnetic response mean; deriving a full superconducting ground state belongs to advanced many-body study.

## How the models fit together

Periodic geometry labels states. Hopping and interference create dispersion. Quantum statistics fills the states. Scattering controls ordinary transport. Coupled atoms create vibrational modes. Interactions can produce phases that independent particles miss. At each step, ask which degrees of freedom were retained, which processes were averaged away, and which observable is being predicted.

These questions transfer beyond solids. Effective mass, quasiparticles, order parameters, symmetry and collective modes reappear in nuclear matter, quantum fluids and field theory. A quasiparticle is a useful excitation of an interacting system with particle-like properties in some regime; it is not a claim that the material contains a new elementary particle of that name.

## Optional practice

1. For $E=\epsilon_0-2t\cos ka$, find the band width, maximum speed magnitude and effective mass at the minimum.
2. A ring has $N$ sites, one orbital per site and two spin states. How many one-particle band states exist? What fraction is occupied with $N$ electrons if interactions are neglected?
3. In the relaxation-time model, calculate conductivity when $n=5.0\times10^{27}\,\mathrm{m}^{-3}$, $m^*=0.5m_e$ and $\tau=2.0\times10^{-14}\,\mathrm s$.
4. Derive $np=n_i^2$ from the two nondegenerate carrier expressions. Explain why the intrinsic density contains half the gap in its exponential.
5. Using the stated hypothetical junction parameters, calculate the built-in voltage after increasing both dopant densities by a factor of ten while holding $n_i,T$ fixed.
6. Derive the long-wavelength sound speed from the discrete spring dispersion. What happens to this speed if every mass is multiplied by four?
7. Explain the $T^3$ low-temperature phonon heat-capacity law by counting powers of temperature in the integral, rather than quoting its name.
8. Linearize the mean-field magnetization equation at zero field and find its predicted critical temperature. State one case where this approximation fails qualitatively.

[Hints](../solutions/23-hints.md) and [worked solutions](../solutions/23-solutions.md) are separate. Use the [companion](../companion/index.html) to vary a model parameter and compare the output with a derived limiting case.

## References and further study

Feynman Lectures, Volume II, chapters 30–37, and Volume III, chapters 13–15, provide conceptual connections to crystal structure, magnetic matter and electronic propagation. For additional university-level band models, the official [David Tong band-structure notes](https://www.damtp.cam.ac.uk/user/tong/aqm/aqm.pdf) are a further-study source. The specific examples and calculations in this chapter are independently constructed model problems.
