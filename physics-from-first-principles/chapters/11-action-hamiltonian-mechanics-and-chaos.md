# 11. Analytical mechanics: action, symmetry, and phase space

A pendulum is constrained to a circle. A satellite moves under a central attraction. A pair of coupled masses has useful collective coordinates. In each case Cartesian force components work, but the geometry suggests a more economical description. Analytical mechanics organizes that economy and reveals why certain quantities are conserved.

The central problem is to formulate dynamics in coordinates adapted to the system while preserving a clear route back to measurable motion. We introduce generalized coordinates, the action, variational calculus, Lagrange's equations, Hamilton's equations, symmetry, and Poisson brackets. We then derive the full Kepler orbit and examine the limits of predictability in nonlinear systems.

The prerequisites are derivatives, integrals, partial derivatives, kinetic and potential energy, angular momentum, and oscillation. The advanced vocabulary will be built from those ideas. Action principles are a new formulation of the mechanics already studied, not a claim that a particle forecasts its future and chooses a path.

## Coordinates should describe the allowed configurations

A generalized coordinate is any independent number needed to specify a system's configuration, subject to its constraints. A point mass in three unconstrained dimensions needs three coordinates. A pendulum of fixed length in a plane needs one angle. Choosing the angle builds the length constraint into the description, so we need not solve for a tension merely to predict the angle.

Let the independent coordinates be $q_1,\ldots,q_n$. Cartesian particle positions can be expressed as $\mathbf r_i(q_1,\ldots,q_n,t)$. The chain rule gives velocities

$$\dot{\mathbf r}_i=\sum_j\frac{\partial\mathbf r_i}{\partial q_j}\dot q_j
+\frac{\partial\mathbf r_i}{\partial t}.$$

Substitute these into $T=\sum_i\tfrac12m_i\dot{\mathbf r}_i^2$ to obtain kinetic energy in the new coordinates. A coordinate may be an angle, so its conjugate quantities need not have the units of ordinary linear momentum or force.

For a simple pendulum, choose pivot-centered coordinates $x=\ell\sin\theta$, $y=-\ell\cos\theta$. Differentiation gives $\dot x=\ell\cos\theta\dot\theta$ and $\dot y=\ell\sin\theta\dot\theta$, so $T=\tfrac12m\ell^2\dot\theta^2$. Set the gravitational potential zero at the bottom: $U=mg\ell(1-\cos\theta)$. The single coordinate describes the allowed circle, while the geometry places the factor $\ell^2$ in the inertia term.

Such configuration constraints are called holonomic when expressible as equations among coordinates and perhaps time. An ideal rolling condition can constrain velocities in ways not globally reducible to position-only equations. Do not assume every velocity constraint can be inserted into an unconstrained action and varied as if it were a simple coordinate restriction. Our derivations use independent coordinates with appropriate ideal constraints, or explicit multipliers.

## A functional takes a whole path as its input

A function might take one number and return one number: $U(q)$ assigns potential to a position. A **functional** takes a function, such as an entire trial path $q(t)$, and returns a number. Define the Lagrangian for ordinary conservative particle mechanics as $L=T-U$, and the action as

$$S[q]=\int_{t_i}^{t_f}L(q,\dot q,t)dt.$$

Action has units energy times time. It is not the same quantity as energy or accumulated distance. The stationary-action principle says that the physical path makes the first-order change in $S$ vanish for small variations holding the endpoint configurations fixed.

To understand “variation,” start with a candidate path $q(t)$ and an arbitrary smooth displacement function $\eta(t)$ with $\eta(t_i)=\eta(t_f)=0$. Compare it with $q_\epsilon(t)=q(t)+\epsilon\eta(t)$ for a small scalar $\epsilon$. Stationarity means $dS[q_\epsilon]/d\epsilon$ at zero is zero for every such $\eta$. This is an ordinary derivative with respect to the family parameter; the path itself is the object being varied.

The first-order change is

$$\delta S=\int_{t_i}^{t_f}\left(
\frac{\partial L}{\partial q}\eta+
\frac{\partial L}{\partial\dot q}\dot\eta\right)dt.$$

The notation $\partial L/\partial\dot q$ treats $q$ and $\dot q$ as separate input slots of $L$ during differentiation. It does not assert that a path's position and velocity are unrelated. They become related when the varied path is substituted into the integral.

Integrate the second term by parts. This uses $\int a\dot\eta\,dt=[a\eta]-\int\dot a\eta\,dt$. The endpoint term vanishes because the endpoints are fixed. Hence

$$\delta S=\int_{t_i}^{t_f}\left[
\frac{\partial L}{\partial q}-\frac{d}{dt}\frac{\partial L}{\partial\dot q}
\right]\eta(t)dt.$$

If the bracketed continuous function were positive or negative in some small interval, an $\eta$ supported there could make the integral nonzero. Therefore stationarity for every allowed variation requires

$$\frac{d}{dt}\frac{\partial L}{\partial\dot q_j}
-\frac{\partial L}{\partial q_j}=0$$

for every independent coordinate. These are the Euler–Lagrange equations. The proof depends on differentiability, fixed endpoint variations, and independent coordinates; dropping those hypotheses can change the boundary terms or allowable equations.

## Recovering forces and handling constraints

For one Cartesian coordinate with $L=\tfrac12m\dot x^2-U(x)$, the equation gives $m\ddot x+U'(x)=0$, exactly Newton's law for $F=-U'$. The action formulation has reorganized the same dynamics. Its usefulness becomes clearer in curved coordinates.

For the pendulum Lagrangian,

$$\frac{\partial L}{\partial\dot\theta}=m\ell^2\dot\theta,
\qquad
\frac{\partial L}{\partial\theta}=-mg\ell\sin\theta.$$

Thus $m\ell^2\ddot\theta+mg\ell\sin\theta=0$. Tension is absent because it acts perpendicular to allowed instantaneous displacements and does no work in that coordinate variation. The equation remains nonlinear until we make the separate small-angle approximation $\sin\theta\approx\theta$.

Sometimes we need the constraint force itself. Keep Cartesian coordinates and add a multiplier:

$$L'=\frac12m(\dot x^2+\dot y^2)-mgy
+\lambda(t)(x^2+y^2-\ell^2).$$

Variation with respect to $\lambda$ enforces the circle. Variation in $x,y$ gives $m\ddot x=2\lambda x$ and $m\ddot y=-mg+2\lambda y$. The vector $2\lambda(x,y)$ is the constraint force. For a taut string it points inward, so $\lambda<0$ and tension magnitude is $-2\lambda\ell$. Multipliers are not magic extra physical constants; they are unknown functions determined along with the motion to enforce the constraint.

For nonconservative generalized forces $Q_j$, the equation becomes $d(\partial L/\partial\dot q_j)/dt-\partial L/\partial q_j=Q_j$. For a Cartesian viscous force $-b\dot x$, use $Q_x=-b\dot x$. A convenient quadratic dissipation function $\mathcal R=\tfrac12b\dot x^2$ generates it as $Q_x=-\partial\mathcal R/\partial\dot x$, but $\mathcal R$ is not a potential energy to be subtracted from $L$. It has units of power, and it represents an additional modeling device.

## Stationary is broader than minimum

“Least action” is a traditional phrase, but the mathematical condition is stationarity. A stationary path can be a local minimum, a maximum in some constrained examples, or a saddle. The first variation tests only the linear change. A second variation is needed to characterize the local shape of the functional.

For a free particle with fixed endpoints over a fixed duration, $S=\int\tfrac12m\dot x^2dt$. The straight constant-velocity path minimizes that positive kinetic action: writing a trial path as the straight path plus $\eta$ makes the cross term vanish and adds $\tfrac12m\int\dot\eta^2dt\geq0$. This particular example supports “minimum.” It does not prove the same property for every Lagrangian, duration, or boundary choice.

Adding a total time derivative to a Lagrangian leaves the fixed-endpoint equations unchanged. If $L'=L+dF(q,t)/dt$, then $S'=S+F(q_f,t_f)-F(q_i,t_i)$. That endpoint contribution has zero variation when the endpoints and endpoint times are held fixed. Consequently different-looking Lagrangians can encode the same motion. The physical equations are not determined by the numerical value of action alone.

## Symmetry identifies conserved conjugate momentum

Define the conjugate momentum by

$$p_j=\frac{\partial L}{\partial\dot q_j}.$$

If $L$ does not explicitly depend on a coordinate $q_j$, the Euler–Lagrange equation says $\dot p_j=0$. Such a coordinate is called cyclic or ignorable. For a free particle, independence from $x$ gives conservation of $m\dot x$. In plane polar coordinates, a central-potential Lagrangian is

$$L=\frac12m(\dot r^2+r^2\dot\theta^2)-U(r).$$

It is independent of $\theta$, so $p_\theta=mr^2\dot\theta$ is conserved angular momentum. Rotational symmetry has become a conservation equation through one derivative.

A small general continuous coordinate change can be written $\delta q_j=\epsilon\xi_j(q,t)$. Along a physical solution,

$$\delta L=\sum_j\left(L_{q_j}\delta q_j+L_{\dot q_j}\delta\dot q_j\right)
=\frac{d}{dt}\sum_jp_j\delta q_j.$$

If the transformation leaves $L$ unchanged to first order for constant $\epsilon$, the quantity $\sum_jp_j\xi_j$ is conserved. If $\delta L=\epsilon\,dB/dt$ instead, the conserved quantity is $\sum_jp_j\xi_j-B$. This is the coordinate-transformation version of Noether's reasoning. It explains why a symmetry can conserve something even when a chosen Lagrangian changes by a harmless total derivative.

Time translation gives energy. Define

$$H=\sum_jp_j\dot q_j-L.$$

Differentiate along a solution and cancel the Euler–Lagrange terms to find $dH/dt=-\partial L/\partial t$. If $L$ has no explicit time dependence, $H$ is conserved. For the usual kinetic energy quadratic in velocities and a velocity-independent potential, $H=T+U$. In more general coordinates or velocity-dependent interactions, work through the definition rather than assume every symbol named $H$ equals a familiar-looking expression.

## Hamilton's equations choose position and momentum as the state

Lagrange's equations use $q,\dot q$. Hamiltonian mechanics uses $q,p$. To change variables, solve $p_j=L_{\dot q_j}$ for velocities in terms of coordinates and momenta, then substitute into $H=\sum p_j\dot q_j-L$. This is a Legendre transformation. It requires an invertible velocity-to-momentum relation in the ordinary unconstrained formulation; singular Lagrangians need an extended constraint theory.

For $L=\tfrac12m\dot q^2-U(q)$, $p=m\dot q$ and

$$H(q,p)=\frac{p^2}{2m}+U(q).$$

To derive the dynamical equations, take a differential of $H$. The terms multiplying $d\dot q$ cancel because $p=L_{\dot q}$. The remainder is $dH=\sum_j\dot q_jdp_j-\sum_jL_{q_j}dq_j-L_tdt$. With $L_{q_j}=\dot p_j$ along the motion, identify coefficients:

$$\dot q_j=\frac{\partial H}{\partial p_j},\qquad
\dot p_j=-\frac{\partial H}{\partial q_j}.$$

For the particle Hamiltonian, these become $\dot q=p/m$ and $\dot p=-U'(q)$. Two first-order equations replace one second-order equation. They contain the same initial data and the same physics; they expose a geometric structure useful in statistical mechanics, numerical integration, and quantum theory.

For the oscillator, $H=p^2/(2m)+kq^2/2$. Constant-energy curves in $(q,p)$ space are ellipses. Momentum points are not extra spatial positions; phase space is the space of possible states. An orbit in phase space tells us both where the particle is and how it is moving.

## Phase-space area is preserved in Hamiltonian flow

Consider a small cloud of neighboring initial states. A Hamiltonian flow moves and distorts it. Its phase-space divergence is

$$\sum_j\left(\frac{\partial\dot q_j}{\partial q_j}
+\frac{\partial\dot p_j}{\partial p_j}\right)
=\sum_j\left(H_{p_jq_j}-H_{q_jp_j}\right)=0$$

when the mixed derivatives are continuous and equal. Zero divergence means that phase-space volume is locally preserved. This is Liouville's theorem in canonical coordinates. The cloud may stretch in one direction and shrink in another without changing its total volume. Conservation of volume does not prevent nearby trajectories from separating.

Damped motion is different: the $(x,v)$ oscillator flow has divergence $-b/m$, so areas contract. If a mechanical subsystem loses energy to an unmodeled environment, its reduced phase-space flow need not preserve volume. Including enough environmental degrees of freedom can restore a larger conservative description; the reduced model and the closed system are different objects.

A canonical coordinate transformation preserves the Hamiltonian structure, not merely any attractive plot shape. Later, symplectic geometry gives a formal language for that requirement. Here it is enough to know why $(q,p)$ are special and why arbitrary rescaling or mixing of coordinates requires attention to the corresponding momentum rule.

## Poisson brackets package evolution and compatibility

For functions $A(q,p,t)$ and $B(q,p,t)$, define their Poisson bracket as

$$\{A,B\}=\sum_j\left(
\frac{\partial A}{\partial q_j}\frac{\partial B}{\partial p_j}
-\frac{\partial A}{\partial p_j}\frac{\partial B}{\partial q_j}
\right).$$

Using the chain rule and Hamilton's equations gives

$$\frac{dA}{dt}=\{A,H\}+\frac{\partial A}{\partial t}.$$

For one pair, $\{q,p\}=1$, $\{q,H\}=H_p$, and $\{p,H\}=-H_q$. A time-independent quantity commutes with $H$ under this bracket precisely when it is conserved along the Hamiltonian flow. The word “commutes” here means the bracket is zero; it does not mean ordinary scalar multiplication has become noncommutative.

For the oscillator, $\{H,H\}=0$ because the two terms cancel, confirming energy conservation when $H$ has no explicit time dependence. For a free particle, $\{p,H\}=0$, confirming constant momentum. Angular-momentum components satisfy related brackets in three dimensions, preparing the symmetry structure of quantum angular momentum. The quantum commutator is a different operation, with a physical correspondence developed later rather than assumed identical to this classical definition.

## The full Kepler orbit from a cyclic angle

For two gravitational masses $M,m$, separate the center-of-mass motion from their relative separation. The reduced mass is $\mu=Mm/(M+m)$ and the interaction strength is $\kappa=GMm$. Relative motion has

$$L=\frac12\mu(\dot r^2+r^2\dot\theta^2)+\frac{\kappa}{r}.$$

The plus sign in $L$ comes from subtracting negative potential $U=-\kappa/r$. Since the angle is cyclic, $\ell=\mu r^2\dot\theta$ is constant. We use $\ell$ here for angular momentum magnitude, not pendulum length. Assume $\ell\ne0$ to describe a nonradial orbit.

The radial equation is $\mu(\ddot r-r\dot\theta^2)=-\kappa/r^2$. Set $u(\theta)=1/r$ and let a prime now mean derivative with respect to $\theta$. Since $\dot\theta=\ell u^2/\mu$,

$$\dot r=-\frac{\ell}{\mu}u',\qquad
\ddot r=-\frac{\ell^2}{\mu^2}u^2u''.$$

Substitute these into the radial equation and divide by the nonzero common factors to obtain Binet's equation for this force:

$$u''+u=\frac{\mu\kappa}{\ell^2}.$$

It is an oscillator equation with a constant offset. Its solution is

$$r(\theta)=\frac{p}{1+e\cos(\theta-\theta_0)},
\qquad p=\frac{\ell^2}{\mu\kappa}.$$

The integration constants are eccentricity $e\geq0$ and orientation $\theta_0$. For $0\leq e<1$ the orbit is an ellipse, for $e=1$ a parabola, and for $e>1$ a hyperbola, on the physically allowed branches where $r>0$. The zero-angular-momentum radial case was excluded by dividing and must be treated directly rather than forced into this polar orbit formula.

To connect shape to energy, substitute $u$ and $u'$ into

$$E=\frac{\ell^2}{2\mu}(u'^2+u^2)-\kappa u.$$

The angular terms cancel and leave $E=\mu\kappa^2(e^2-1)/(2\ell^2)$. For an ellipse, the semimajor axis is $a=p/(1-e^2)$, hence

$$E=-\frac{\kappa}{2a}.$$

The periapsis and apoapsis distances are $a(1-e)$ and $a(1+e)$. A circle is the special case $e=0$, matching the earlier circular energy result.

Swept area per time is $\ell/(2\mu)$, while ellipse area is $\pi ab$ with $b=a\sqrt{1-e^2}$. Divide total area by areal speed and substitute the relation for $\ell$ to find

$$T^2=\frac{4\pi^2\mu a^3}{\kappa}
=\frac{4\pi^2a^3}{G(M+m)}.$$

This derives Kepler's period law for the full two-body ellipse. The circular argument in Chapter 05 was a useful special case; the symmetry and radial dynamics now explain why the same semimajor-axis law survives eccentricity.

## Small oscillations are a local quadratic geometry

Near an equilibrium of several coordinates, write small displacements $\eta_i$. To leading nontrivial order the potential is $U\approx U_0+\tfrac12\sum_{ij}K_{ij}\eta_i\eta_j$, where $K_{ij}$ is the array of second partial derivatives at equilibrium. The linear term vanishes because equilibrium requires zero first derivatives. Kinetic energy often takes the form $T\approx\tfrac12\sum_{ij}M_{ij}\dot\eta_i\dot\eta_j$, with a positive mass array.

The equations are $\sum_jM_{ij}\ddot\eta_j+\sum_jK_{ij}\eta_j=0$. Try a coordinated pattern $\eta_j=a_j\cos\omega t$. Then

$$\sum_j(K_{ij}-\omega^2M_{ij})a_j=0.$$

This is a generalized eigenvalue problem. The word means we seek nonzero amplitude patterns $a_j$ that reproduce themselves up to a scalar factor under the two linear rules. For two coordinates, a nonzero solution requires the determinant $A_{11}A_{22}-A_{12}A_{21}$ of $A=K-\omega^2M$ to vanish. This elementary formula eliminates the amplitudes and yields the allowed $\omega^2$ values. Chapter 19 develops the general linear algebra; the two-coordinate method is already enough to reproduce Chapter 07's normal modes.

Positive $\omega^2$ gives oscillatory linear motion; negative $\omega^2$ gives exponential growth and decay, indicating an unstable equilibrium direction. A zero value can signal a symmetry direction or the need to retain higher-order terms. The quadratic approximation describes a neighborhood, not all amplitudes or every global trajectory.

## Nonlinear deterministic systems can lose practical predictability

Deterministic means a specified state and a well-posed evolution law determine a future trajectory. It does not mean finite-precision measurements allow arbitrarily long predictions. In a chaotic regime, nearby states can separate approximately as

$$|\delta z(t)|\sim|\delta z(0)|e^{\lambda t}$$

over a suitable intermediate range, with positive Lyapunov exponent $\lambda$. The exponential describes separation while the disturbance is small and the local stretching estimate applies; it cannot grow indefinitely in a bounded state space without saturation and folding.

A driven damped pendulum is a concrete model:

$$\ddot\theta+2\gamma\dot\theta+\omega_0^2\sin\theta
=A\cos\Omega t.$$

For some parameter and initial-condition regimes the motion is periodic; for others it can be quasiperiodic or chaotic. Nonlinearity alone does not guarantee chaos. The undriven one-coordinate pendulum with conserved energy is integrable: its motion is confined by an energy curve and can be reconstructed by quadrature, even though the equation is nonlinear.

To inspect a periodically driven system, sample its state once per drive period $2\pi/\Omega$. This Poincare section removes the rapid repeating drive phase. A period-one attractor produces one repeated point, a period-two motion two, while more complicated sets can indicate other behavior. A cloud of points alone is not proof of chaos; numerical error, transients, or quasiperiodicity can also create complex plots. A stronger check estimates perturbation growth, convergence with time step, and long-time statistics.

For a numerical separation measure, first nondimensionalize state components, for example $z=(\theta,\dot\theta/\omega_0)$. Adding an angle difference directly to a velocity difference with incompatible units would make an arbitrary distance. Evolve two nearby states, periodically record the logarithm of their stretching factor, and renormalize their separation to remain small. The time average estimates a largest Lyapunov exponent under appropriate conditions. Its result must be checked against integration accuracy and parameter regimes rather than declared positive because a plot looks irregular.

If an initial uncertainty is $10^{-6}$ in a dimensionless coordinate, acceptable error is $10^{-2}$, and a verified local growth rate is $\lambda=0.5\,\mathrm{s^{-1}}$, the approximate prediction horizon is $\ln(10^4)/0.5\approx18.4\,\mathrm s$. Better measurements extend the horizon logarithmically. This is uncertainty amplification under a deterministic law, a concept distinct from the intrinsic probabilistic rules introduced in quantum physics.

## Numerical algorithms can respect or damage the geometry

For $H=p^2/(2m)+U(q)$, ordinary forward Euler updates both variables from their old values. For a harmonic oscillator its phase-space area multiplier is $1+(\omega_0\Delta t)^2>1$, so it systematically distorts conservative geometry and pumps energy into the numerical orbit.

One simple symplectic Euler scheme instead updates momentum first and then uses the new momentum:

$$p_{n+1}=p_n-\Delta t\,U'(q_n),\qquad
q_{n+1}=q_n+\frac{\Delta t}{m}p_{n+1}.$$

The derivative array of this map has determinant

$$\left(1-\frac{\Delta t^2}{m}U''\right)(1)
-\left(\frac{\Delta t}{m}\right)(-\Delta t U'')=1.$$

Thus it preserves phase-space area in this one-pair setting. It does not exactly conserve the original energy at every step. For an oscillator with a suitable stable step, its energy error oscillates rather than showing the unbounded forward-Euler growth. At excessively large steps it can still fail. A conservation property is a valuable check, not an excuse to skip accuracy tests. Chapter 27 develops numerical reliability in detail.

Analytical mechanics now ties several threads together: adapted coordinates remove unnecessary constraint forces; stationary action yields equations; continuous symmetries yield conserved momenta; a Legendre transformation exposes phase-space flow; and nonlinear geometry explains why conservation does not always imply simple or predictable motion. These are working tools for undergraduate mechanics and a language that carries into fields, statistical physics, and quantum theory.

## Optional practice

1. Starting with $L=\tfrac12m\dot x^2-\tfrac12kx^2$, derive the oscillator equation and its conserved energy using the Euler–Lagrange formula and $H=\dot xp-L$.
2. For a pendulum whose pivot is fixed, derive its exact angular equation from the stated Cartesian parametrization. Where does the small-angle approximation enter, and where does it not?
3. Prove that adding $dF(q,t)/dt$ changes action only by endpoint values and does not alter fixed-endpoint Euler–Lagrange motion.
4. For $H=p^2/(2m)+\alpha q^4$ with $\alpha>0$, write Hamilton's equations and show $dH/dt=0$. Compute $\{q^2,p^2\}$.
5. In an inverse-square bound orbit with semimajor axis $a$ and eccentricity $e=0.50$, find periapsis, apoapsis, and the ratio of tangential speeds at those two points. Explain why speed is purely tangential there.
6. Show that the two-body Kepler period depends on $M+m$, not solely on the larger mass. Recover the fixed-heavy-center limit.
7. For the Hamiltonian oscillator, compute the forward-Euler update determinant and compare it with the symplectic-Euler determinant. Explain why determinant one does not establish exact trajectory accuracy.
8. A verified chaotic regime has $\lambda=0.20\,\mathrm{s^{-1}}$. Estimate how much longer prediction remains within the same tolerance if initial uncertainty improves by a factor of 100. State the exponential-growth assumption and its limitation.

Hints and complete solutions: [hints](../solutions/11-hints.md), [solutions](../solutions/11-solutions.md). Explore the numerical models listed in the [companion](../companion/index.html).

Further conceptual reading: Feynman Lectures, Volume II, Chapter 19; [the principle of least action](https://www.feynmanlectures.caltech.edu/II_19.html). The next part changes scale: instead of following a few coordinates, we describe continuous materials and enormous collections of particles.
