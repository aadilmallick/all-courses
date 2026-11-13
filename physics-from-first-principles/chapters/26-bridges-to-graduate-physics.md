# 26. Bridges to graduate physics

Undergraduate physics teaches a collection of powerful models. Graduate work increasingly asks us to build new models, choose controlled approximations, and connect ideas that first appeared in different subjects. An impulse response in mechanics, an electrostatic boundary problem, a quantum resolvent and a correlation function can all be approached through related inverse operators. A conservation law in particle mechanics becomes a local current in field theory. A probability distribution becomes an operator when coherence matters.

This chapter develops four bridges through worked mathematics: distributions and Green functions, variational fields and conservation, density matrices and open-system evolution, and statistical response near a phase transition. These are starting tools for graduate study. Working through them does not establish comprehensive graduate competence, which also requires a much larger body of problem solving, specialized mathematics, experimental skill and research experience.

Prerequisites are the calculus, Fourier methods, linear algebra, Lagrangian mechanics, quantum states and statistical mechanics developed earlier. We will identify additional mathematical assumptions. The notation may look more compact, but every compact expression must still answer a concrete question: what is the system, what is the source or preparation, which boundary conditions apply, and what observable is being predicted?

## An impulse is defined by what it does to a test function

A force that acts for a very short time can deliver a finite momentum change. As the duration shrinks, its peak must grow to keep the impulse fixed. The limiting idealization is not an ordinary function with a finite value at each time. It is a distribution, defined through integration against smooth test functions.

The Dirac delta at zero is specified by

$$\int_{-\infty}^{\infty}\delta(x)f(x)dx=f(0).$$

If $x$ has units length, $\delta(x)$ has units inverse length. A translated delta selects $f(a)$. For a nonzero constant $b$, changing variables gives $\delta(bx)=\delta(x)/|b|$. The absolute value is essential: an integral of a positive impulse must not become negative when the coordinate direction is reversed.

One approximate sequence is

$$\delta_\epsilon(x)=\frac1{\sqrt\pi\epsilon}e^{-x^2/\epsilon^2},\qquad\epsilon>0.$$

Its integral is one. For a continuous test function that does not grow too rapidly, substituting $x=\epsilon u$ makes the weighted average tend to $f(0)$ as $\epsilon\to0$. Pointwise, the sequence tends to zero away from the origin and diverges at the origin. The distributional limit is therefore not captured by taking its pointwise limit and then integrating. Interchanging limits and integrals requires hypotheses.

The derivative of a distribution is defined by integration by parts:

$$\int\delta'(x)f(x)dx=-f'(0).$$

This definition moves derivatives onto a well-behaved test function. It does not require drawing an ordinary derivative curve for an infinitely narrow peak. Distributional identities are meaningful inside their specified action on test functions; multiplying arbitrary distributions is not automatically defined.

## A jump in a derivative encodes a source

Consider the boundary-value equation

$$-u''(x)=s(x),\qquad 0<x<L,\quad u(0)=u(L)=0.$$

We want a Green function $G(x,\xi)$ satisfying

$$-\partial_x^2G(x,\xi)=\delta(x-\xi)$$

with the same endpoint conditions in $x$. Away from $\xi$, the second derivative vanishes, so the function is linear on each side. Left-boundary compatibility gives $G=A x$ for $x<\xi$; right-boundary compatibility gives $G=B(L-x)$ for $x>\xi$.

Continuity requires $A\xi=B(L-\xi)$. Integrate the differential equation across a narrow interval around $\xi$. The result is

$$-\left[G_x(\xi^+,\xi)-G_x(\xi^-,\xi)\right]=1.$$

Thus the slope jump is $-1$, or $A+B=1$. Solving the two equations gives

$$G(x,\xi)=\frac{\min(x,\xi)[L-\max(x,\xi)]}{L}.$$

Its units are length. The solution for an ordinary source is

$$u(x)=\int_0^LG(x,\xi)s(\xi)d\xi.$$

Applying the differential operator under the integral returns $s(x)$, and the boundary values vanish. This is an inverse operator with boundary conditions built in. The equation alone does not define a unique Green function; boundary or initial conditions are part of the inverse.

For a constant source $s_0$, direct integration or elementary ODE solving gives $u=s_0x(L-x)/2$. Differentiate twice to check $-u''=s_0$, and inspect both endpoints. At the center, $u(L/2)=s_0L^2/8$. A numerical implementation should reproduce that scale and shape before being trusted on a complicated source.

## Causality chooses a different inverse

For the driven oscillator

$$\ddot x+\omega_0^2x=f(t),$$

define a retarded Green function by $(d^2/dt^2+\omega_0^2)G_R(t)=\delta(t)$ and $G_R(t)=0$ for $t<0$. For $t>0$, the homogeneous solution satisfying continuity at zero has the form $A\sin\omega_0t$. Integrating across zero gives $G_R'(0^+)-G_R'(0^-)=1$, so

$$G_R(t)=\Theta(t)\frac{\sin\omega_0t}{\omega_0}.$$

The step function $\Theta$ is zero before zero and one after; its distributional derivative is $\delta$. The solution with specified initial data is the freely evolving initial-data solution plus

$$x_{\mathrm{driven}}(t)=\int_{-\infty}^t
\frac{\sin[\omega_0(t-t')]}{\omega_0}f(t')dt'.$$

Only earlier forcing contributes. An advanced inverse, responding before the force, can also solve the algebraic differential equation with different support. Causality is the physical condition selecting the retarded inverse for an ordinary driven preparation.

For $\ddot x+2\gamma\dot x+\omega_0^2x=f$ in the underdamped regime $0<\gamma<\omega_0$, the retarded kernel is $\Theta(t)e^{-\gamma t}\sin(\Omega t)/\Omega$, with $\Omega=\sqrt{\omega_0^2-\gamma^2}$. The same derivative jump fixes normalization. Critical and overdamped cases use different but continuous limiting forms. An algorithm that blindly takes a square root of a negative real number without changing the representation has confused a convenient formula with the underlying ODE.

## Spectral decomposition reveals the same inverse

Suppose a self-adjoint operator $L$ has orthonormal eigenfunctions $v_n$ and nonzero eigenvalues $\lambda_n$ under the relevant boundary conditions. Expand the source as $s=\sum_ns_nv_n$. Solving $Lu=s$ gives $u=\sum_n(s_n/\lambda_n)v_n$. Hence its Green kernel is formally

$$G(x,\xi)=\sum_n\frac{v_n(x)v_n^*(\xi)}{\lambda_n}.$$

This expression requires appropriate convergence or distributional interpretation. If an eigenvalue is zero, a full inverse does not exist without further restrictions. The source must satisfy a compatibility condition, or one must fix a gauge, remove the zero mode or use a generalized inverse appropriate to the problem. Dividing by a tiny eigenvalue explains large responses near resonance and numerical ill conditioning.

For a finite-dimensional quantum Hamiltonian, the resolvent is $(zI-H)^{-1}$. In its eigenbasis,

$$(zI-H)^{-1}=\sum_n\frac{|n\rangle\langle n|}{z-E_n}.$$

The poles occur at energy eigenvalues. For a two-level diagonal Hamiltonian with energies $\pm\Delta/2$, its entries are $1/(z-\Delta/2)$ and $1/(z+\Delta/2)$. The operator language generalizes the ordinary idea of dividing each Fourier component by its response coefficient. In continuum scattering, limiting prescriptions such as $E+i0$ select outgoing-wave conditions; they are boundary information, not decorative notation.

## From a coordinate to a field

A particle coordinate $q(t)$ assigns one number to each time. A real scalar field $\phi(\mathbf x,t)$ assigns one number to each point and time. Temperature is a familiar scalar field, although its dissipative dynamics is not described by every conservative action we will write. A vibrating string or a simple relativistic wave field gives a suitable conservative example.

Take units $c=1$ temporarily and the spacetime signature $(-,+,+,+)$ used in Chapter 25. Consider the Lagrangian density

$$\mathcal L=-\frac12\partial_\mu\phi\partial^\mu\phi
-\frac12\kappa^2\phi^2
=\frac12\dot\phi^2-\frac12|\nabla\phi|^2-\frac12\kappa^2\phi^2.$$

The parameter $\kappa$ is a nonnegative inverse-length scale; it is not a spacetime index here. An overall physical normalization can be attached to match the field's units. The action is the spacetime integral of this density. Vary $\phi\to\phi+\epsilon\eta$, with $\eta$ vanishing on the boundary. To first order,

$$\delta S=\int d^4x\left[-\partial^\mu\phi\partial_\mu\eta
-\kappa^2\phi\eta\right].$$

Integrating the derivative term by parts removes the derivative from $\eta$ and produces a boundary term that vanishes by the variation condition. Since the remaining $\eta$ is arbitrary,

$$\partial_\mu\partial^\mu\phi-\kappa^2\phi=0,$$

or $\ddot\phi-\nabla^2\phi+\kappa^2\phi=0$. A plane wave gives $\omega^2=k^2+\kappa^2$ in these units. Restoring $c$ gives $\omega^2=c^2(k^2+\kappa^2)$. If this is a relativistic quantum field of mass $m$, one identifies $\kappa=mc/\hbar$ so the relation becomes the familiar relativistic energy-momentum relation after $E=\hbar\omega$, $p=\hbar k$.

This variation is an actual derivation within a chosen action. Choosing the action itself is physical modeling. A negative sign in front of the kinetic energy would not merely be another harmless convention; it would change stability properties unless the whole framework and interpretation were changed consistently.

## Noether's idea as an explicit conserved current

For $\kappa=0$, the action above is unchanged by adding a constant to the field, $\phi\to\phi+\epsilon$. This is a continuous shift symmetry. The associated current can be taken as

$$j^\mu=-\partial^\mu\phi.$$

Its divergence is $\partial_\mu j^\mu=-\partial_\mu\partial^\mu\phi=0$ by the massless field equation. With our signature, $j^0=\dot\phi$ and $\mathbf j=-\nabla\phi$. Thus the continuity equation is $\partial_t\dot\phi-\nabla^2\phi=0$. Integrating over a region gives a charge-change rate equal to minus the outward flux. If fields or fluxes vanish appropriately at infinity, the total charge $Q=\int\dot\phi,d^3x$ is conserved, provided that integral exists.

For $\kappa\ne0$, adding a constant changes the $\phi^2$ term, so the shift symmetry is absent and this current is not conserved. The assumption matters. Noether's theorem links a continuous action symmetry to a conserved current under suitable regularity and boundary conditions; it does not turn every aesthetically pleasing transformation into a symmetry of every system.

Time-translation symmetry gives another conservation law. Define

$$u=\frac12\dot\phi^2+\frac12|\nabla\phi|^2+\frac12\kappa^2\phi^2,
\qquad\mathbf S=-\dot\phi\nabla\phi.$$

Differentiate $u$ and take the divergence of $\mathbf S$. The mixed-gradient terms cancel, leaving

$$\partial_tu+\nabla\cdot\mathbf S
=\dot\phi\left(\ddot\phi-\nabla^2\phi+\kappa^2\phi\right)=0.$$

We have verified a local energy continuity equation directly. Boundary flux can change the energy inside a finite region even when the total energy of a closed isolated system is conserved. Distinguishing local balance from a blanket statement that a subsystem's energy is constant is as important in field theory as in thermodynamics.

## Canonical fields and normal modes

The canonical momentum field is $\pi=\partial\mathcal L/\partial\dot\phi=\dot\phi$. The Hamiltonian density $\pi\dot\phi-\mathcal L$ is precisely the positive energy density above. Fourier decomposition separates a free linear field into oscillator modes with frequencies $\omega_k=\sqrt{k^2+\kappa^2}$ in $c=1$ units. This connects field theory with the oscillator rather than introducing a completely unrelated quantization recipe.

Canonical quantization promotes fields to operators with equal-time relation

$$[\hat\phi(\mathbf x),\hat\pi(\mathbf y)]
=i\hbar\delta^3(\mathbf x-\mathbf y).$$

This formula is formal unless smeared over test functions or regulated. Quantum fields are operator-valued distributions; products at exactly one point can be singular. A finite lattice spacing $a$ makes the number of degrees of freedom finite in a finite box. For a one-dimensional nearest-neighbor discretization, the squared frequency is

$$\omega_k^2=\kappa^2+\frac4{a^2}\sin^2\frac{ka}{2}.$$

At $|ka|\ll1$, it approaches $\kappa^2+k^2$. The cutoff changes high-wave-number behavior, so a continuum prediction requires checking which low-energy quantities remain stable as the cutoff is changed and parameters are appropriately related. Renormalization is the systematic organization of scale dependence and measurable parameters. Merely discarding a divergent number is not a derivation of a finite physical prediction.

## Density operators evolve coherently or through an environment

For a closed quantum system, $\rho=|\psi\rangle\langle\psi|$ or an ensemble mixture evolves as $\rho(t)=U(t)\rho(0)U^\dagger(t)$. Differentiating and using the Schrödinger equation gives

$$\dot\rho=-\frac i\hbar[H,\rho].$$

The commutator preserves trace, Hermiticity, positivity and eigenvalues under unitary evolution. For a pure state, $\rho^2=\rho$ and $\operatorname{Tr}\rho^2=1$. A mixed finite-dimensional state has smaller purity, down to $1/d$ for the maximally mixed state in dimension $d$.

An environment can entangle with the system. Taking a partial trace then generally produces nonunitary reduced evolution, even when the total system evolves unitarily. A concrete dephasing channel is

$$\mathcal E(\rho)=(1-p)\rho+p\sigma_z\rho\sigma_z,
\qquad0\le p\le1.$$

It is a probabilistic mixture of two unitary operations, so it maps physical states to physical states. Written as $K_0\rho K_0^\dagger+K_1\rho K_1^\dagger$, the operators are $K_0=\sqrt{1-p}I$, $K_1=\sqrt p\sigma_z$, and $\sum_aK_a^\dagger K_a=I$ ensures trace preservation. This is an example of a completely positive trace-preserving map. The adjective completely means positivity remains valid even when the system is part of a larger entangled state.

For $\rho=\begin{pmatrix}a&b\\b^*&1-a\end{pmatrix}$, the channel leaves diagonal entries unchanged and multiplies $b$ by $1-2p$. At $p=1/2$, coherence in this basis vanishes. At $p=1$, the operation is a definite phase flip, so purity is preserved; larger $p$ is not automatically more irreversible noise across the full interval. This edge case is a useful guard against treating a parameter name as a monotonic physical conclusion.

For repeated weak dephasing over short intervals, a continuous model is

$$\dot\rho=\frac\gamma2(\sigma_z\rho\sigma_z-\rho),\qquad\gamma\ge0.$$

It gives $\dot b=-\gamma b$ and $b(t)=b(0)e^{-\gamma t}$, with populations unchanged. An initial $|+x\rangle$ state has purity $[1+e^{-2\gamma t}]/2$, approaching one half. The model assumes a memoryless effective environment and a preferred dephasing basis. It is not a universal equation for every environment or every time scale.

## Entropy and thermal states

The von Neumann entropy is

$$S=-k_B\operatorname{Tr}(\rho\ln\rho),$$

defined by diagonalizing $\rho$ and applying $-k_B\sum_ap_a\ln p_a$, with $0\ln0$ defined as its continuous limit zero. A pure state has zero entropy; $I/d$ has entropy $k_B\ln d$. The entropy of a subsystem can increase under entanglement even while the total closed pure state's entropy remains zero. One must specify which state and partition the entropy describes.

For an equilibrium canonical ensemble with fixed Hamiltonian and mean energy constraint, maximize $-\sum_np_n\ln p_n$ subject to normalization and $\sum_np_nE_n=U$. Introducing multipliers and differentiating with respect to $p_n$ gives $-(\ln p_n+1)-\alpha-\beta E_n=0$. Hence

$$p_n=\frac{e^{-\beta E_n}}Z,\qquad
Z=\sum_ne^{-\beta E_n},\qquad\beta=\frac1{k_BT}.$$

The operator form is $\rho_\beta=e^{-\beta H}/Z$. This state is diagonal in an energy eigenbasis, including identity weights within exact degeneracies. Its partition function is not merely a normalization convenience: derivatives generate measurable averages and fluctuations.

Differentiate $\ln Z$ while holding the Hamiltonian fixed:

$$U=-\frac{\partial\ln Z}{\partial\beta},\qquad
\frac{\partial^2\ln Z}{\partial\beta^2}
=\langle H^2\rangle-\langle H\rangle^2.$$

Using $d\beta/dT=-1/(k_BT^2)$ yields

$$C=\frac{\operatorname{Var}(H)}{k_BT^2}\ge0.$$

This nonnegativity belongs to a stable canonical description with the stated fixed Hamiltonian. Other ensembles or long-range self-gravitating systems require care; a negative microcanonical heat capacity is not an algebraic counterexample to this canonical variance identity.

## A complete two-level thermal example

Let energies be $-\Delta/2,+\Delta/2$, with $\Delta>0$. Then

$$Z=2\cosh\frac{\beta\Delta}{2},\qquad
U=-\frac\Delta2\tanh\frac{\beta\Delta}{2}.$$

Differentiation gives

$$C=k_B\left(\frac{\beta\Delta}{2}\right)^2
\operatorname{sech}^2\frac{\beta\Delta}{2}.$$

Here $\cosh x=(e^x+e^{-x})/2$, $\tanh x=\sinh x/\cosh x$ and $\operatorname{sech}x=1/\cosh x$. At low temperature the upper state is rarely occupied and heat capacity approaches zero. At high temperature both states become almost equally occupied, so the energy saturates and heat capacity again approaches zero. The heat-capacity maximum occurs between those limits, a simple example of a Schottky-type peak.

When $\Delta=k_BT$, the dimensionless argument is $1/2$ and $C\approx0.1966k_B$. The lower-state probability is $1/(1+e^{-\beta\Delta})\approx0.7311$. These numbers are useful checks for a thermal two-state calculator. They also show why a temperature-dependent probability need not imply a heat capacity equal to a fixed equipartition value.

## Response is tied to fluctuations

Suppose a classical equilibrium model has energy $H_h=H_0-hM$, with $M$ independent of the applied field parameter $h$. Differentiating its canonical average gives

$$\frac{\partial\langle M\rangle}{\partial h}
=\beta\left(\langle M^2\rangle-\langle M\rangle^2\right).$$

One can verify this by differentiating both the numerator $\sum M e^{-\beta(H_0-hM)}$ and normalization $Z$. The subtraction from the derivative of $Z$ is what turns the second moment into a variance. Large fluctuations imply a large static response in this setting.

For a quantum system with noncommuting $M$ and $H_0$, the simple equal-time variance formula generally needs modification to an imaginary-time correlation expression. If $[M,H_0]=0$, the classical-looking result follows in their common eigenbasis. Stating the commutation assumption prevents a familiar classical identity from being overextended into a false general quantum theorem.

## A phase transition as competing terms in a free energy

An order parameter $m$ can distinguish two phases, as magnetization did in Chapter 23. A simple mean-field free-energy model near a symmetric transition is

$$F(m)=F_0+\frac{a(T-T_c)}2m^2+\frac b4m^4-hm,
\qquad a>0,\quad b>0.$$

The positive quartic term stabilizes large $|m|$ within this truncated model. At zero field, stationary values satisfy $m[a(T-T_c)+bm^2]=0$. Above $T_c$, the minimum is $m=0$. Below, $m=0$ becomes a maximum and two minima appear:

$$m=\pm\sqrt{\frac{a(T_c-T)}b}.$$

The sign reflects symmetry-related states. At nonzero field one branch is favored. For a finite symmetric system at exactly zero field, averaging over both branches can give zero magnetization; spontaneous symmetry breaking is characterized through a thermodynamic-limit and small-field procedure, not by ignoring the average's definition.

The susceptibility follows by differentiating $a(T-T_c)m+bm^3=h$. Above $T_c$, $\chi=\partial m/\partial h=1/[a(T-T_c)]$. Below, evaluating the derivative at a selected minimum gives $\chi=1/[2a(T_c-T)]$. Both diverge at the mean-field critical point. This model predicts particular exponents, but spatial fluctuations change them in many dimensions and universality classes. A divergence in a model does not authorize using the same exponent for every real material.

## Correlation length returns us to a Green function

Let the order parameter vary in space. A quadratic fluctuation free energy about a stable symmetric phase can be written

$$F[\phi]=\frac12\int d^3x\left[r_0\phi^2+K|\nabla\phi|^2\right],
\qquad r_0>0,\quad K>0.$$

The positive gradient term penalizes rapid spatial variation. A source adds $-\int h(\mathbf x)\phi(\mathbf x)d^3x$. Variation gives

$$(-K\nabla^2+r_0)\phi=h.$$

This is another inverse-operator problem. Fourier transforming sends $-\nabla^2$ to $k^2$, so each mode responds as $\phi(\mathbf k)=h(\mathbf k)/(Kk^2+r_0)$. The natural length scale is

$$\xi=\sqrt{\frac K{r_0}}.$$

In three infinite dimensions, the corresponding Green kernel is $G(R)=e^{-R/\xi}/(4\pi K R)$ for distance $R>0$, with a delta-function source normalization at the origin. It can be checked by applying the radial Laplacian away from zero and using the flux through a small sphere to fix the coefficient. As $r_0$ decreases, the response extends farther. This is the origin of a growing correlation length in the Gaussian approximation.

Interactions beyond the quadratic approximation and fluctuation effects near criticality require more advanced methods. The calculation nevertheless closes a useful circle: the same Green-function logic that solved a bent string now organizes spatial response in statistical physics. Graduate study deepens such connections and tests their regimes rather than replacing elementary reasoning with a vocabulary list.

## A working standard for the next stage

For a new problem, specify the degrees of freedom and the domain of the operator. Define sources, states, boundaries and observables. Identify a small parameter, symmetry or scale separation that justifies a simplification. Derive the consequence with units and normalization intact. Check a solvable limit, a conservation law or an independent numerical calculation. Finally, state what evidence would make the model inadequate.

These habits matter more than presenting an advanced formula quickly. A reader who can reconstruct the impulse normalization, the field variation, the dephasing map and the thermal variance identity has concrete foundations for advanced electrodynamics, quantum theory, statistical mechanics and field theory. More specialized courses must then build the detailed tools and long problem-solving experience required in each area.

## Optional practice

1. Prove $\delta(bx)=\delta(x)/|b|$ by applying both sides to a test function. Explain why the delta has units inverse to its argument.
2. Derive the Dirichlet Green function for $-d^2/dx^2$ on $[0,L]$ by matching the two linear branches and their slope jump.
3. A unit impulse drives an initially resting oscillator. Use the retarded Green function to find its later displacement and verify the velocity jump.
4. Vary the scalar-field action and derive its equation of motion, explicitly identifying the boundary term that is dropped.
5. An initial $|+x\rangle$ state passes through the discrete dephasing channel with $p=1/4$. Find its density matrix and purity. Compare $p=1/2$ and $p=1$.
6. Derive the two-level partition function, average energy and heat capacity. Evaluate the lower-state probability at $\beta\Delta=2$.
7. For the Landau model at $h=0,T<T_c$, calculate the second derivative of $F$ at each nonzero stationary point and verify stability.
8. Check the units and limiting behavior of $\xi=\sqrt{K/r_0}$ in the quadratic spatial model. Explain what fails if $r_0<0$ while the quartic term has been omitted.

[Hints](../solutions/26-hints.md) and [solutions](../solutions/26-solutions.md) are separate. The [companion](../companion/index.html) supplies model experiments; the computational and experimental chapters that follow turn these standards into reproducible numerical and measurement workflows.

## References and further study

Feynman Lectures, Volume II, chapters 19–21 and 25–27, and Volume III, chapters 8, 17 and 20, supply useful conceptual connections to actions, fields, propagation and operators. For the scope of further graduate preparation, consult the official [MIT graduate-course guidance](https://physics.mit.edu/academic-programs/graduate-students/information-on-graduate-course-requirements/). Its core subject families motivate further study; completing this bridge chapter is not a claim of having completed those courses.
