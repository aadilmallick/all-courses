# 20. Schrödinger mechanics: confinement, bound states and tunneling

A particle trapped between two walls cannot have every energy we might assign to a classical particle. An electron approaching a barrier can sometimes appear beyond it even when its energy is below the barrier height. These are predictions of one mathematical framework, not separate rules attached to separate experiments. Our task is to learn that framework well enough to derive the predictions and to recognize when its approximations fail.

Chapter 19 introduced a quantum state as a vector of probability amplitudes. Here the labels of that vector become positions. We assume the derivatives and integrals of Chapter 3, complex numbers of Chapter 7, Fourier ideas of Chapter 8, and inner products of Chapter 19. We will rebuild the few new mathematical steps at their first use. We work with a single nonrelativistic particle in one spatial dimension unless stated otherwise. Spin is temporarily absent. The potential energy (V(x)) is a specified real function. These restrictions define the model; they do not assert that all particles are one dimensional or spinless.

## A continuous list of amplitudes

Divide a line into narrow bins of width $\Delta x$. Let (c_j) be the amplitude for finding the particle in bin (j). Normalization says $\sum_j|c_j|^2=1$. When we make the bins smaller, their individual probabilities get smaller too. A useful quantity that remains meaningful is the amplitude per square root of length:

$$c_j\approx \psi(x_j)\sqrt{\Delta x}.$$

The corresponding probability is $|c_j|^2\approx |\psi(x_j)|^2\Delta x$. Adding these probabilities and taking the limit gives

$$\int_{-\infty}^{\infty}|\psi(x)|^2\,dx=1.$$

Thus $|\psi(x)|^2$ is a probability density, with units inverse length. It is not the probability at one exact point. The probability in an interval $[a,b]$ is its integral over that interval. In an ideal continuous distribution, any one point has zero probability even though finite intervals have nonzero probabilities. This is the same distinction between density and amount that appeared in mass distributions.

The wavefunction itself has units $\mathrm{m}^{-1/2}$ in one dimension. In three dimensions its units are $\mathrm{m}^{-3/2}$, because the probability element is $|\psi|^2d^3r$. A wavefunction can be complex; a probability cannot. Multiplying the entire state by one constant phase $e^{i\alpha}$ changes no position probability and no other expectation value. Changing relative phases among different components can change interference and therefore physical predictions.

For a concrete normalization, suppose $\psi=A$ on $0<x<L$, zero elsewhere. Then

$$1=\int_0^L |A|^2dx=|A|^2L,$$

so we may choose $A=1/\sqrt L$. The probability in the left third is $L^{-1}(L/3)=1/3$. This is a valid normalized square-integrable state, but its sharp jumps create mathematical complications for kinetic energy. A normalized state is not automatically a finite-energy state in every Hamiltonian domain. That distinction will matter when we impose physical boundary conditions.

## From momentum to a differential operator

A traveling Fourier component has the form $e^{ikx}$. Quantum experiments motivate the momentum relation $p=\hbar k$, where $\hbar=h/(2\pi)$. Differentiate that component:

$$\frac{d}{dx}e^{ikx}=ik e^{ikx},\qquad
-i\hbar\frac{d}{dx}e^{ikx}=\hbar k e^{ikx}.$$

The operation $-i\hbar d/dx$ therefore returns the momentum value times the component. This motivates the position-representation momentum operator

$$\hat p=-i\hbar\frac{d}{dx}.$$

It is a representation of the quantum momentum observable, not a claim that every state has a pre-existing definite momentum. A localized state generally combines many (k) values. Its momentum distribution comes from the Fourier amplitudes.

For a nonrelativistic particle, kinetic energy is $p^2/(2m)$. Applying the momentum operator twice gives

$$\hat T=-\frac{\hbar^2}{2m}\frac{d^2}{dx^2}.$$

Adding potential energy yields the Hamiltonian

$$\hat H=-\frac{\hbar^2}{2m}\frac{d^2}{dx^2}+V(x).$$

In this model time evolution obeys the Schrödinger equation,

$$i\hbar\frac{\partial\psi}{\partial t}=\hat H\psi.$$

This is an empirical dynamical postulate of nonrelativistic quantum mechanics. The manipulations above explain why the kinetic operator has its form once that framework is adopted. They do not derive quantum mechanics from Newton's laws. Notice the units: $\hbar\partial_t$ and $\hat H$ both have units of energy.

## Separation of time and space

If (V) does not depend on time, try a product $\psi(x,t)=\phi(x)f(t)$. Substitution gives

$$i\hbar\phi\frac{df}{dt}=f\hat H\phi.$$

Where division is legitimate, divide by $\phi f$. One side depends only on time, the other only on position. They must equal a constant, called (E). The resulting equations are

$$\hat H\phi=E\phi,\qquad
i\hbar\frac{df}{dt}=Ef.$$

The time equation integrates to $f=e^{-iEt/\hbar}$, apart from a constant absorbed into $\phi$. Thus an energy eigenstate evolves as

$$\psi(x,t)=\phi(x)e^{-iEt/\hbar}.$$

Its density $|\psi|^2=|\phi|^2$ stays fixed. This is why it is called stationary. The wavefunction still changes phase. A superposition of different energy eigenstates generally has a moving probability density because their relative phase changes at frequency $(E_n-E_m)/\hbar$.

The spatial equation is the time-independent Schrödinger equation:

$$-\frac{\hbar^2}{2m}\phi''+V\phi=E\phi.$$

It is a second-order ordinary differential equation. In each region with a specified potential, two independent solution coefficients normally appear. Boundary conditions and normalization determine which combinations describe allowed states. An eigenvalue problem differs from an initial-value problem: we are searching for both a function and values of (E) compatible with all boundaries.

## The infinite well, one step at a time

Consider an ideal well between (x=0) and (x=L). Inside, (V=0). Outside, an ideal infinite potential excludes the particle. We impose $\phi(0)=\phi(L)=0$. This is an idealization of strong confinement, not a material wall with literally infinite energy.

Inside, the differential equation becomes

$$\phi''+k^2\phi=0,\qquad k^2=\frac{2mE}{\hbar^2}.$$

For (E>0), the general solution is $A\sin kx+B\cos kx$. The left boundary gives (B=0), since $\sin0=0$ and $\cos0=1$. The right boundary then gives $A\sin kL=0$. We reject (A=0), which would be the zero vector rather than a normalized state. Therefore $kL=n\pi$, with positive integer (n). Negative (n) changes only an overall sign, while (n=0) produces the zero function. The allowed energies are

$$E_n=\frac{\hbar^2\pi^2n^2}{2mL^2},\qquad n=1,2,3,\ldots.$$

Normalization uses $\int_0^L\sin^2(n\pi x/L)dx=L/2$. We obtain

$$\phi_n(x)=\sqrt{\frac2L}\sin\frac{n\pi x}{L}.$$

This energy discreteness followed from a differential equation plus two boundaries. There was no extra instruction to quantize the energy. A system on an unbounded line has different boundary conditions and can have a continuous energy spectrum.

For an electron in a $1.00\,\mathrm{nm}$ ideal well, using $\hbar=1.055\times10^{-34}\,\mathrm{J\,s}$, $m_e=9.11\times10^{-31}\,\mathrm{kg}$, and $1\,\mathrm{eV}=1.602\times10^{-19}\,\mathrm J$,

$$E_1\approx6.03\times10^{-20}\,\mathrm J\approx0.376\,\mathrm{eV}.$$

The second level has four times this energy, $1.50\,\mathrm{eV}$, so the transition energy is about $1.13\,\mathrm{eV}$. Halving (L) multiplies all levels by four. Increasing mass lowers the energy spacing. These scale checks are often more informative than carrying many decimal places.

The ground state has nonzero energy. A zero-energy state inside would obey $\phi''=0$, so $\phi=Ax+B$. Both endpoints force (A=B=0). Thus zero energy is impossible for a nonzero normalized state with these boundaries. This is a direct argument; the uncertainty principle gives a complementary scale estimate.

## Expectation values are averages over repeated preparations

For position, the expectation value is

$$\langle x\rangle=\int\psi^*x\psi\,dx.$$

For a general operator $\hat A$, replace (x) by that operator: $\langle A\rangle=\int\psi^*\hat A\psi dx$, provided the state lies in the appropriate domain. The derivative acts on the wavefunction to its right, not on every factor in the integral.

In the well ground state the density is symmetric around (L/2). Pair each point (x) with (L-x); the two have equal probability and their average position is (L/2). Hence $\langle x\rangle=L/2$, without integrating a sine explicitly. This does not mean every position measurement returns the center. For example, the probability in the middle half is

$$P=\frac2L\int_{L/4}^{3L/4}\sin^2\frac{\pi x}{L}dx
=\frac12+\frac1\pi\approx0.818.$$

To get the result, use $\sin^2u=(1-\cos2u)/2$. An antiderivative of the density is $x/L-\sin(2\pi x/L)/(2\pi)$. Subtracting its endpoint values gives the expression above. The same interval would contain probability (1/2) for a uniform density, so confinement does not imply a uniform position distribution.

The variance measures spread: $\sigma_x^2=\langle x^2\rangle-\langle x\rangle^2$. In the ground state,

$$\sigma_x^2=L^2\left(\frac1{12}-\frac1{2\pi^2}\right).$$

This is positive and has units length squared. A negative variance from a calculation signals an error. No position measurement is guaranteed to lie within one standard deviation; a standard deviation is a distribution property, not a hard boundary.

## Conservation of probability and probability current

The wavefunction describes a conserved particle probability in this closed model. We can verify this rather than assuming it from an animation. Take the Schrödinger equation and its complex conjugate, multiply the first by $\psi^*$, the conjugate by $\psi$, and subtract. The real potential terms cancel. After regrouping derivatives,

$$\frac{\partial |\psi|^2}{\partial t}+\frac{\partial j}{\partial x}=0,\qquad
j=\frac\hbar m\operatorname{Im}\left(\psi^*\frac{\partial\psi}{\partial x}\right).$$

This is a continuity equation, structurally the same as conservation of fluid mass or electric charge. Integrating between two points gives the rate of probability change inside as the incoming current minus outgoing current. If the current vanishes at infinity or at reflecting boundaries, total probability stays one.

For $\psi=Ae^{ikx}$, differentiation gives $j=(\hbar k/m)|A|^2$. Momentum divided by mass is velocity, so this resembles density times velocity. The resemblance is useful but does not make every wavefunction a classical fluid of trajectories. A real stationary well eigenfunction has (j=0), although its kinetic energy is nonzero. Zero net current does not imply zero kinetic energy: a standing wave contains opposing momentum components.

Plane waves on the entire real line are not normalizable to one particle because their density never decays. They are convenient idealized components for scattering and wave packets. Ratios of their fluxes can nevertheless predict reflection and transmission probabilities for a sufficiently narrow packet in momentum.

## A potential step and the meaning of matching

Let (V=0) to the left of zero and (V=V_0>0) to the right. A particle approaches from the left with (E>V_0). Put

$$k_1=\frac{\sqrt{2mE}}\hbar,\qquad
k_2=\frac{\sqrt{2m(E-V_0)}}\hbar.$$

The left solution is an incoming plus reflected wave,

$$\phi_L=Ae^{ik_1x}+Be^{-ik_1x},$$

and the right solution is $\phi_R=Ce^{ik_2x}$. We omit a right-to-left incoming wave because the preparation specifies incidence from the left only.

For a finite step with constant mass, both $\phi$ and $\phi'$ are continuous. One reason is that integrating the differential equation across an ever smaller interval around the step makes the integral of finite $(V-E)\phi$ vanish; therefore the derivative cannot jump. A discontinuous $\phi$ would introduce still more singular derivatives inconsistent with a finite step. Delta-function potentials require a different derivative matching rule, so do not apply this reasoning beyond its assumptions.

At zero the matching equations are

$$A+B=C,\qquad k_1(A-B)=k_2C.$$

Substitute (C=A+B) into the second and collect terms:

$$\frac BA=\frac{k_1-k_2}{k_1+k_2},\qquad
\frac CA=\frac{2k_1}{k_1+k_2}.$$

Reflection probability is $R=|B/A|^2$. Transmission requires a velocity factor because the density alone is not flux:

$$T=\frac{k_2}{k_1}\left|\frac CA\right|^2
=\frac{4k_1k_2}{(k_1+k_2)^2}.$$

Algebra gives (R+T=1). Omitting (k_2/k_1) generally violates conservation. For (E=4V_0/3), (k_2=k_1/2), so (R=1/9) and (T=8/9). A classically allowed particle can reflect from an abrupt change even without an impenetrable wall.

## Exponentials in a forbidden region

For (E<V_0), the right-hand wave number becomes imaginary. Define the positive inverse length

$$\kappa=\frac{\sqrt{2m(V_0-E)}}\hbar.$$

The equation is now $\phi''=\kappa^2\phi$, with solutions $e^{\kappa x}$ and $e^{-\kappa x}$. For a semi-infinite step extending to $+\infty$, we reject the growing exponential because it would give infinite probability. The remaining tail penetrates the high-potential region. It has zero current by itself: $\phi^*\phi'$ is real. Consequently (T=0) and (R=1) for that semi-infinite problem, although the density just inside the barrier is nonzero.

This distinction prevents a common misconception. Penetration into a region is not automatically transmission through it. A finite barrier has another interface and a transmitted traveling wave beyond it; a semi-infinite step does not.

For a rectangular barrier of height (V_0), width (a), and equal zero potentials on both sides, matching four conditions gives, for (0<E<V_0),

$$T=\left[1+\frac{V_0^2\sinh^2(\kappa a)}{4E(V_0-E)}\right]^{-1}.$$

One can derive this by writing the barrier solution as $Ce^{\kappa x}+De^{-\kappa x}$, matching $\phi,\phi'$ at both endpoints, and eliminating (C,D). Both exponentials are needed inside a finite interval; neither diverges there. The hyperbolic sine is defined by $\sinh z=(e^z-e^{-z})/2$. When $\kappa a\gg1$, its square is approximately $e^{2\kappa a}/4$, which explains the dominant exponential suppression $T\propto e^{-2\kappa a}$. The prefactor need not be one.

As a numerical model, take an electron with $E=1.00\,\mathrm{eV}$, $V_0=2.00\,\mathrm{eV}$, and $a=0.200\,\mathrm{nm}$. Then $\kappa\approx5.12\,\mathrm{nm}^{-1}$ and $\kappa a\approx1.02$. Since the prefactor inside brackets is one for (E=V_0/2), $T=1/\cosh^2(\kappa a)\approx0.405$. The crude exponential alone gives about (0.129), a poor answer here because the barrier is not in the thick-barrier limit and the prefactor matters. A named approximation must be checked against its regime, not used because its expression is short.

There is no energy borrowing in this stationary scattering model. The total energy is the same before and after the barrier. The classical statement that kinetic energy would be negative is evidence that a classical trajectory description fails inside, not evidence of a temporary violation of energy conservation.

## A finite well and how transcendental equations arise

Real confinement often has finite depth. Put (V=-V_0) for $|x|<a$, and (V=0) outside. Bound states have $-V_0<E<0$. Inside, define $k=\sqrt{2m(E+V_0)}/\hbar$; outside, $\kappa=\sqrt{-2mE}/\hbar$. The interior oscillates and the exterior decays. Because the potential is symmetric, states can be chosen even or odd. An even state has interior $A\cos kx$. On the right its exterior is $Be^{-\kappa(x-a)}$. Matching values gives $A\cos ka=B$; matching slopes gives $-Ak\sin ka=-\kappa B$. Dividing gives

$$k\tan ka=\kappa.$$

An odd state's sine interior similarly gives $-k\cot ka=\kappa$. Also $k^2+\kappa^2=2mV_0/\hbar^2$. These equations cannot generally be solved by elementary algebra; graphing or root finding is appropriate. The appearance of a transcendental equation is a property of boundary matching, not a failure to find a clever substitution.

The finite well has tails and finitely many bound levels. Its energies approach the infinite-well pattern in an appropriately deep-well limit after accounting for the different energy zero and width (2a). Comparing formulas without matching these conventions leads to erroneous factors of four or offsets of (V_0).

## The harmonic oscillator and a Gaussian ground state

Near a smooth potential minimum (x_0), a Taylor expansion gives

$$V(x)\approx V(x_0)+\frac12V''(x_0)(x-x_0)^2,$$

because the first derivative vanishes there. If the curvature is positive, put $m\omega^2=V''(x_0)$, shift the origin to (x_0), and subtract the constant energy. The local model is $V=m\omega^2x^2/2$.

Try a Gaussian $\phi=Ae^{-\alpha x^2/2}$. Its derivatives are

$$\phi'=-\alpha x\phi,\qquad
\phi''=(\alpha^2x^2-\alpha)\phi.$$

Substitution into the energy equation gives

$$\left[\frac{\hbar^2\alpha}{2m}
+\frac12\left(m\omega^2-\frac{\hbar^2\alpha^2}{m}\right)x^2\right]\phi=E\phi.$$

For a fixed energy the (x^2) coefficient must vanish. Normalizability requires $\alpha>0$, so $\alpha=m\omega/\hbar$, and then $E_0=\hbar\omega/2$. The Gaussian integral $\int e^{-\alpha x^2}dx=\sqrt{\pi/\alpha}$ yields $A=(\alpha/\pi)^{1/4}$. The Gaussian integral can be proved by squaring the integral, treating it as an integral over a plane, and using polar coordinates; its positivity selects the positive square root.

The full oscillator spectrum is $E_n=\hbar\omega(n+1/2)$, with $n=0,1,2,\ldots$. A convenient derivation introduces dimensionless operators

$$\hat a=\sqrt{\frac{m\omega}{2\hbar}}\hat x+
\frac{i\hat p}{\sqrt{2m\hbar\omega}},\qquad
[\hat a,\hat a^\dagger]=1.$$

Here $[A,B]=AB-BA$ is a commutator. Using $[x,p]=i\hbar$ gives $H=\hbar\omega(a^\dagger a+1/2)$. Since $\langle a^\dagger a\rangle=\|a\psi\|^2\ge0$, the energy is bounded below by $\hbar\omega/2$. Applying $a^\dagger$ raises energy by $\hbar\omega$, which follows from $[H,a^\dagger]=\hbar\omega a^\dagger$. The Gaussian solves $a\phi_0=0$. This explains equally spaced levels rather than merely listing them.

## What this model lets us predict

To solve a new one-dimensional problem, specify the potential and domain, write the differential equation in each region, impose physically justified matching and endpoint conditions, normalize bound states, and calculate probabilities or fluxes appropriate to the preparation. Check units, total probability, symmetry, and limits. A plot is useful after these choices; it cannot choose them for us.

The model becomes inadequate when particle creation, relativistic energies, many-particle correlations, spin-dependent forces, or an environment that cannot be neglected are central. Even within nonrelativistic physics, a poorly chosen potential can give excellent arithmetic and poor science. In Chapter 21, three-dimensional geometry and angular momentum will turn this machinery into a model of hydrogen. In Chapter 22, approximation methods will handle the many potentials that cannot be solved in closed form.

## Optional practice

1. Normalize $\psi=A x$ on $0<x<L$, zero elsewhere, and find the probability in $0<x<L/2$. Discuss why normalization alone does not establish smooth finite-energy compatibility with a chosen Hamiltonian.
2. An ideal well is widened from (L) to (3L). How do (E_1), the $1\to2$ transition energy, and $\langle x\rangle$ scale?
3. For the well ground state, calculate the probability in $0<x<L/4$. Check against the middle-half probability by symmetry.
4. A step has (k_2=k_1/3). Calculate reflection and transmission from amplitudes and verify flux conservation.
5. Derive the finite-well odd-parity equation by matching the sine interior to the decaying right exterior. Explain why the exterior growing term is rejected.
6. For a thick rectangular barrier, increasing its width by $1/\kappa$ changes the dominant transmission factor by what ratio? State the approximation used.
7. For the oscillator ground state, show $\sigma_x^2=\hbar/(2m\omega)$ and $\sigma_p^2=m\hbar\omega/2$. Interpret their product.
8. A state is $\psi=(\phi_1e^{-iE_1t/\hbar}+\phi_2e^{-iE_2t/\hbar})/\sqrt2$ in a real well basis. Expand its density and identify the beat angular frequency. Explain why it is normalized at all times.

Hints and solutions are in [chapter 20 hints](../solutions/20-hints.md) and [chapter 20 solutions](../solutions/20-solutions.md). The [interactive companion](../companion/index.html) provides numerical experiments; compare any simulated tunneling result with the stated potential and its flux convention.

## References and further study

Conceptual connections: Feynman Lectures, Volume III, chapters 16, 20 and 21. The supplied compilation is a reference source; this chapter's derivations and numerical examples are original. For later approximation and scattering work, see the official [MIT Quantum Physics III lecture-note index](https://www.ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2018/resources/lecture-notes/). This chapter does not assume that every item in that index has been read.
