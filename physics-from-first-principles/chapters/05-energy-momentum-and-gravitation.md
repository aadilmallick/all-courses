# 05. Energy and momentum: finding what survives a change

You drop a ball, catch a cart, compress a spring, and launch a satellite. Newton's law can describe each event, but a detailed time history may be unnecessary. If the question asks how fast the ball is just before impact, the acceleration at every intermediate instant may be more information than we need. Conservation laws organize a different kind of prediction: compare an initial state with a final state by tracking quantities that transfer between systems or forms.

This chapter develops work, kinetic and potential energy, impulse, momentum, center of mass, collisions, and Newtonian gravitation. The mathematics uses the derivatives and integrals of Chapter 03 and the force models of Chapter 04. Each conservation statement has a boundary condition attached to it. “Energy is conserved” does not imply that the mechanical energy of every chosen object remains constant. “Momentum is conserved” does not imply that a wall exerts no impulse during a collision with it.

## Work measures a force along a displacement

For a constant force acting through a straight displacement, define work as

$$W=\mathbf F\cdot\Delta\mathbf r=F\Delta r\cos\theta,$$

where $\theta$ is the angle between the force and displacement. The dot product selects the force component along the displacement. A perpendicular force does no work in this particle model. Its direction can still change the motion: tension in uniform circular motion is an example.

For a varying force or curved path, divide the path into small pieces and add the contributions. In the limiting notation,

$$W=\int_{\mathcal C}\mathbf F\cdot d\mathbf r.$$

The symbol $\mathcal C$ denotes the actual path, and $d\mathbf r$ is its tiny displacement vector. In one dimension this becomes $\int_{x_i}^{x_f}F_x(x)\,dx$. The integral is signed. A negative force acting through a negative displacement can do positive work. Work has SI unit newton meter, called the joule: $1\,\mathrm J=1\,\mathrm{kg\,m^2\,s^{-2}}$.

Derive its relation to motion rather than memorize it. For a constant-mass particle, $\mathbf F=m\dot{\mathbf v}$. Since $d\mathbf r=\mathbf v\,dt$,

$$W=\int m\dot{\mathbf v}\cdot\mathbf v\,dt
=\int\frac{d}{dt}\left(\frac12m\mathbf v\cdot\mathbf v\right)dt.$$

The final equality follows by the product rule: $d(\mathbf v\cdot\mathbf v)/dt=2\mathbf v\cdot\dot{\mathbf v}$. Therefore

$$W_{\rm net}=K_f-K_i,\qquad K=\frac12mv^2.$$

This **work–kinetic-energy theorem** follows from Newton's law in this regime. It applies even when friction acts, as long as all relevant work on the modeled particle is counted. It does not state that kinetic energy is conserved; it states exactly how net work changes it.

For a $2.0\,\mathrm{kg}$ cart initially at rest, a constant $8.0\,\mathrm N$ force acts along $3.0\,\mathrm m$ while a $2.0\,\mathrm N$ resistance acts against the motion. Net work is $(8.0-2.0)(3.0)=18\,\mathrm J$. Thus $\tfrac12(2.0)v_f^2=18$, so $v_f=\sqrt{18}\approx4.24\,\mathrm{m\,s^{-1}}$. We did not calculate the travel time. The energy method answered the question using the variables the question actually supplied.

## Potential energy stores the effect of conservative forces

Some forces do work that depends only on the endpoints. In one dimension, if $F_x$ depends only on $x$ over an interval, define a potential energy function by

$$U(x)-U(x_0)=-\int_{x_0}^{x}F_x(s)\,ds.$$

The dummy variable $s$ prevents confusion between the endpoint $x$ and the variable being summed over. Differentiation gives $F_x=-dU/dx$. The minus sign means the force points toward decreasing potential energy. A potential is not the force itself: it has different units and describes a different aspect of the model.

Adding a constant to $U$ changes neither the force nor any potential difference. Thus a choice such as $U=0$ at a tabletop or at infinity is a reference convention. A negative potential energy is not a negative amount of all possible energy; it means the chosen state lies below the reference.

For a linear spring, $F_x=-kx$ with $x$ measured from its unstretched equilibrium. Then $U(x)-U(0)=\int_0^xks\,ds=\tfrac12kx^2$. For nearly uniform gravity with upward coordinate $y$, $F_y=-mg$, so $U(y)=mgy+C$. These expressions hold under stated force models. A highly stretched nonideal spring need not have a quadratic potential, and $mgy$ is only a local approximation to Earth's full gravitational potential.

When all work is due to conservative forces, $\Delta K=-\Delta U$, hence

$$E=K+U=\text{constant}.$$

If other forces do work $W_{\rm nc}$, the particle mechanical-energy equation is $\Delta(K+U)=W_{\rm nc}$. The subscript means nonconservative within the chosen mechanical description. Energy transferred into heat or deformation has not vanished; it has left the variables represented by $K+U$.

For a $0.50\,\mathrm{kg}$ cart released from rest against a spring of stiffness $200\,\mathrm{N\,m^{-1}}$ compressed by $0.10\,\mathrm m$, the spring initially stores $\tfrac12(200)(0.10)^2=1.0\,\mathrm J$. On a frictionless track, the cart's speed when the spring reaches equilibrium satisfies $\tfrac12(0.50)v^2=1.0$, giving $v=2.0\,\mathrm{m\,s^{-1}}$. If $0.20\,\mathrm J$ is transferred to internal energy before that point, kinetic energy is $0.80\,\mathrm J$, and $v=\sqrt{3.2}\approx1.79\,\mathrm{m\,s^{-1}}$.

## Reading motion from an energy curve

In one dimension, energy conservation gives $\tfrac12m\dot x^2+U(x)=E$. Since kinetic energy cannot be negative, accessible positions satisfy $U(x)\leq E$. At a turning point, $U(x)=E$ and velocity is zero. Acceleration need not be zero there: $a=-U'(x)/m$ can immediately reverse the motion.

An equilibrium position $x_*$ satisfies $U'(x_*)=0$. If $U$ has a strict local minimum there, small displacements raise potential energy and the force tends to restore the particle. If it has a local maximum, a small displacement tends to move the particle farther away. Expanding a smooth potential near equilibrium gives

$$U(x_*+q)=U(x_*)+\frac12U''(x_*)q^2+\cdots,$$

because the linear term vanishes. Positive $U''(x_*)$ therefore makes the leading force $-U''(x_*)q$, a spring-like restoring force. This explains why harmonic oscillation occurs in so many apparently unrelated systems.

The second-derivative test can be inconclusive. For $U=\alpha x^4$ with $\alpha>0$, $U''(0)=0$ even though zero is a stable minimum. For $U=-\alpha x^4$, zero is unstable. When the lowest nonzero term is higher order, inspect that term or the graph rather than declare stability from a zero second derivative.

One can also reconstruct time from energy where the motion is monotone:

$$dt=\frac{dx}{\sqrt{2[E-U(x)]/m}}$$

for the positive-velocity branch. The negative branch carries the opposite sign. This expression shows that an energy method need not lose the time information; it often postpones the harder integral until time is actually requested. It also warns that dividing by velocity requires care at a turning point. The physical trajectory is continued by the force equation there.

## Power and system boundaries

Power is the rate of work transfer:

$$P=\frac{dW}{dt}=\mathbf F\cdot\mathbf v.$$

Its SI unit is the watt, $1\,\mathrm W=1\,\mathrm{J\,s^{-1}}$. A motor can exert a large force at low speed with modest power, or require large power to maintain speed against resistance. If a car experiences a $400\,\mathrm N$ resistance while moving at $25\,\mathrm{m\,s^{-1}}$, the power delivered to its translational mechanical motion to maintain that speed is $10{,}000\,\mathrm W=10\,\mathrm{kW}$. Actual fuel power is larger because the conversion is not perfectly efficient.

There is a subtlety with friction in extended systems. Static friction at an ideal rolling contact can provide force and torque while the contact point is instantaneously at rest, so its local power at that contact is zero. A naive calculation that multiplies friction by the displacement of the center of mass does not necessarily equal actual work at the point of application. The particle work theorem uses a particle's displacement; an extended body needs translational and rotational bookkeeping. Chapter 06 makes that distinction explicit.

The choice of system resolves many energy puzzles. For the falling ball alone, gravity performs external work. For the ball-plus-Earth system, gravitational potential energy is part of the internal interaction bookkeeping. For a sliding block alone, friction transfers energy out of its mechanical motion. For block plus floor, much of the same energy appears as internal thermal energy. Neither description changes the measured final speed when used consistently.

## Momentum and impulse: what a brief force accomplishes

Define a particle's linear momentum as $\mathbf p=m\mathbf v$. For constant mass, Newton's law gives $\dot{\mathbf p}=\mathbf F_{\rm net}$. Integrating over an event yields

$$\mathbf J=\int_{t_i}^{t_f}\mathbf F_{\rm net}\,dt
=\mathbf p_f-\mathbf p_i.$$

The vector $\mathbf J$ is impulse. Its unit is newton second, equal to kilogram meter per second. A short strong force and a longer weak force can cause the same momentum change. Their injury risk or deformation can differ because peak force and time history matter, but momentum alone records the integral.

A $0.15\,\mathrm{kg}$ ball moving right at $20\,\mathrm{m\,s^{-1}}$ rebounds left at $15\,\mathrm{m\,s^{-1}}$. Its momentum change is $0.15(-15-20)=-5.25\,\mathrm{kg\,m\,s^{-1}}$. If contact lasts $0.010\,\mathrm s$, the average horizontal net force is $-525\,\mathrm N$. The average need not equal the maximum. Drawing a smooth pulse or a rectangular pulse with the same area produces the same impulse but different peak forces.

For several particles, add their momenta. Internal forces cancel in pairs under the mechanical third-law assumptions of Chapter 04:

$$\frac{d\mathbf P}{dt}=\mathbf F_{\rm ext},\qquad
\mathbf P=\sum_i m_i\mathbf v_i.$$

If net external impulse is negligible during an event, total momentum remains approximately constant. During a brief collision on a level low-friction track, horizontal external impulse may be small even though the colliding objects exert large forces on each other. Vertical forces need not be small; their effects must be analyzed component by component.

## Center of mass separates whole-system motion from internal motion

For fixed constituent masses, define total mass $M=\sum_i m_i$ and center of mass

$$\mathbf R=\frac{1}{M}\sum_i m_i\mathbf r_i.$$

Differentiate to obtain $M\dot{\mathbf R}=\mathbf P$, then differentiate again to obtain $M\ddot{\mathbf R}=\mathbf F_{\rm ext}$. This result does not require the object to be rigid. Its pieces may vibrate or fly apart; their mass-weighted average still follows the external-force equation.

For two masses $m_1=2\,\mathrm{kg}$ at $x_1=0$ and $m_2=3\,\mathrm{kg}$ at $x_2=5\,\mathrm m$, the center is $R=(2\cdot0+3\cdot5)/5=3\,\mathrm m$. It is nearer the heavier mass. If they move with velocities $+4$ and $-1\,\mathrm{m\,s^{-1}}$, their total momentum is $8-3=5\,\mathrm{kg\,m\,s^{-1}}$, so center-of-mass velocity is $1\,\mathrm{m\,s^{-1}}$.

Define each velocity relative to the center as $\mathbf u_i=\mathbf v_i-\mathbf V$, where $\mathbf V=\dot{\mathbf R}$. Because $\sum_i m_i\mathbf u_i=0$, expanding the squares gives

$$\sum_i\frac12m_i v_i^2
=\frac12MV^2+\sum_i\frac12m_i u_i^2.$$

The cross term vanishes. The first term is kinetic energy of the overall motion; the second is kinetic energy of motion within the system. Conservation of momentum fixes the first contribution for an isolated system but says nothing by itself about how the second becomes deformation, sound, heat, or other internal energy.

For two particles, let $\mathbf v_{\rm rel}=\mathbf v_1-\mathbf v_2$ and define the reduced mass $\mu=m_1m_2/(m_1+m_2)$. Algebra then reduces the internal kinetic energy to $\tfrac12\mu v_{\rm rel}^2$. The reduced mass is useful whenever a two-body interaction depends on their separation. If one mass is enormously larger, $\mu$ approaches the smaller mass, explaining why the fixed-heavy-object approximation often works.

## Collisions: conserved momentum does not imply conserved kinetic energy

An **elastic collision** preserves total kinetic energy as well as momentum in the isolated system. An **inelastic collision** does not preserve kinetic energy, though total energy still balances when internal forms are included. Objects that stick undergo a perfectly inelastic collision in the usual one-dimensional model.

Let $m_1=2.0\,\mathrm{kg}$ move at $u_1=3.0\,\mathrm{m\,s^{-1}}$ toward a stationary $m_2=1.0\,\mathrm{kg}$ cart. If they stick, momentum conservation gives

$$V=\frac{m_1u_1+m_2u_2}{m_1+m_2}=2.0\,\mathrm{m\,s^{-1}}.$$

Initial kinetic energy is $\tfrac12(2)(3^2)=9.0\,\mathrm J$. Final kinetic energy is $\tfrac12(3)(2^2)=6.0\,\mathrm J$. The $3.0\,\mathrm J$ difference is converted to internal energy and other accounted forms. It is not evidence against total energy conservation.

For a one-dimensional elastic collision, the momentum and kinetic-energy equations imply reversal of relative velocity:

$$v_1-v_2=-(u_1-u_2).$$

To see why, rearrange momentum as $m_1(u_1-v_1)=m_2(v_2-u_2)$ and energy as $m_1(u_1-v_1)(u_1+v_1)=m_2(v_2-u_2)(v_2+u_2)$. For a nontrivial collision, divide the common momentum-transfer factor to get $u_1+v_1=v_2+u_2$. The trivial zero-transfer case also satisfies the original conservation equations and should not be lost by division.

Solving for the final velocities gives

$$v_1=\frac{m_1-m_2}{m_1+m_2}u_1+\frac{2m_2}{m_1+m_2}u_2,$$

$$v_2=\frac{2m_1}{m_1+m_2}u_1+\frac{m_2-m_1}{m_1+m_2}u_2.$$

For the same $2\,\mathrm{kg}$ and $1\,\mathrm{kg}$ carts with initial velocities $3$ and $0$, the elastic answers are $v_1=1$ and $v_2=4\,\mathrm{m\,s^{-1}}$. Momentum is $2+4=6$ in the original units, and kinetic energy is $1+8=9\,\mathrm J$. Equal masses exchange velocities; a light projectile reflecting from a much heavier stationary target approximately reverses its velocity. These limits are stronger checks than matching one numerical example.

## Variable mass and the rocket equation

A rocket demonstrates why the system boundary matters. At time $t$ let the rocket have mass $m$ and inertial velocity $v$. During a short interval it expels positive mass $\delta m$, leaving rocket mass $m-\delta m$ and velocity $v+\delta v$. Let the exhaust leave backward at relative speed $u>0$, so its inertial velocity is approximately $v-u$. Neglect external impulse during that short interval.

Conservation of the total momentum of rocket plus expelled parcel gives, to first order,

$$mv=(m-\delta m)(v+\delta v)+\delta m(v-u).$$

Cancel $mv$ and neglect the product $\delta m\delta v$, which is second order in the short interval. The result is $m\delta v=u\delta m$. Since the rocket's own differential mass change is $dm=-\delta m$, this becomes $dv=-u\,dm/m$.

Integrating from initial mass $m_i$ to final mass $m_f$ for constant relative exhaust speed gives

$$\Delta v=u\ln\frac{m_i}{m_f}.$$

The logarithm appears because each later parcel accelerates a lighter remaining rocket. For $u=2.0\,\mathrm{km\,s^{-1}}$ and mass ratio $m_i/m_f=3$, $\Delta v=2\ln3\approx2.20\,\mathrm{km\,s^{-1}}$. This ideal result omits gravitational and aerodynamic losses. It is not a complete launch-performance model. Crucially, inserting a changing rocket mass into $d(mv)/dt$ and setting that derivative to zero for the rocket alone would miss the exhaust momentum flux.

## Gravitation: a force law that unifies falling and orbiting

Newton's gravitational model for two point masses, or for nonoverlapping spherically symmetric bodies, is an attractive inverse-square force. For a small mass $m$ at displacement $\mathbf r$ from a much larger approximately fixed mass $M$,

$$\mathbf F=-\frac{GMm}{r^2}\hat{\mathbf r},\qquad r=|\mathbf r|.$$

Here $G$ is the gravitational constant and $\hat{\mathbf r}$ is the outward radial unit vector. The minus sign makes the force inward. The model is highly successful in its domain; it is not derived from $F=ma$. That dynamical law and this interaction law are distinct empirical ingredients.

Choose the potential to vanish at infinite separation. Because $F_r=-dU/dr$,

$$U(r)=-\frac{GMm}{r}.$$

Differentiate: $dU/dr=GMm/r^2$, so the force is indeed negative. Near a body's surface, put $r=R+y$ with $|y|\ll R$. Using $1/(R+y)\approx R^{-1}-yR^{-2}$ gives $U\approx-GMm/R+(GMm/R^2)y$. The varying part is $mgy$ with $g=GM/R^2$. Uniform gravity is therefore a local limit of the inverse-square model.

For a circular orbit, the gravitational force supplies the inward acceleration:

$$\frac{mv^2}{r}=\frac{GMm}{r^2},\qquad
v_{\rm circ}=\sqrt{\frac{GM}{r}}.$$

The period is circumference divided by speed, so

$$T=2\pi\sqrt{\frac{r^3}{GM}},\qquad
T^2=\frac{4\pi^2}{GM}r^3.$$

This is the circular-orbit version of Kepler's period relation. In a genuine two-body calculation the relative orbit uses $G(M+m)$; the fixed-center approximation replaces that by $GM$ when $m\ll M$. General elliptical motion requires angular-momentum bookkeeping, developed next, rather than treating this circular derivation as proof for every orbit.

As a rounded numerical example take Earth's gravitational parameter $GM=3.986\times10^{14}\,\mathrm{m^3\,s^{-2}}$ and orbital radius $r=7.00\times10^6\,\mathrm m$. Then $GM/r\approx5.694\times10^7\,\mathrm{m^2\,s^{-2}}$, so $v\approx7.55\times10^3\,\mathrm{m\,s^{-1}}$. The period is $2\pi r/v\approx5.83\times10^3\,\mathrm s$, about $97.1$ minutes. Radius means distance from Earth's center, not altitude above the surface.

## Escape, binding, and why an orbit is still a fall

To escape to infinite separation with zero remaining speed in this ideal model, initial total energy must be zero:

$$\frac12mv_{\rm esc}^2-\frac{GMm}{r}=0,
\qquad v_{\rm esc}=\sqrt{\frac{2GM}{r}}.$$

Thus escape speed is $\sqrt2$ times circular speed at the same radius. At the previous orbital radius it is about $10.7\,\mathrm{km\,s^{-1}}$. This neglects atmosphere, rotation, other gravitating bodies, and propulsion during flight. “Escape speed” describes the initial free-flight energy threshold, not a requirement that an engine-powered craft always move at least that fast.

A circular orbit has total energy

$$E_{\rm circ}=\frac12\frac{GMm}{r}-\frac{GMm}{r}
=-\frac{GMm}{2r}.$$

Its negative value indicates binding relative to the zero chosen at infinite separation. Increasing the orbital radius raises the total energy toward zero even though the circular speed decreases. Energy added to reach a higher circular orbit increases potential energy by more than it decreases kinetic energy. Trying to infer the energy change from speed alone gives the wrong conclusion.

An orbiting astronaut is not weightless because gravity has vanished. The astronaut and spacecraft are falling together, with nearly the same gravitational acceleration. Their mutual support force can be small, just as the elevator scale in free fall reads zero. The sideways velocity makes the path curve around Earth rather than intersect its surface. The same inward acceleration that makes an apple fall also bends the satellite's velocity.

## Choosing the right conserved quantity

Use momentum when external impulse is small and interactions are brief or difficult to resolve. Use mechanical energy when conservative forces dominate or nonconservative work is known. Use Newton's law to determine forces, accelerations, and contact conditions. Some problems require all three in sequence. For a projectile that embeds in a hanging block, use momentum during the short inelastic impact, then mechanical energy during the subsequent swing. Conserving kinetic energy during embedding would falsely erase the internal-energy change.

The checks are complementary. Momentum is a vector, so directions and signs are essential. Energy is a scalar, so it cannot alone determine an outgoing direction. Dimensional analysis can reject an expression like $v=GM/r$ because the right side has units of speed squared. A conservation equation can be mathematically correct and physically irrelevant if its assumed isolated system is actually receiving a substantial external transfer. State the boundary, the time interval, and the neglected transfer before trusting the cancellation.

## Optional practice

1. A force $F_x=(4.0\,\mathrm{N\,m^{-1}})x$ acts on a $2.0\,\mathrm{kg}$ particle from $x=0$ to $x=3.0\,\mathrm m$. Starting at rest, find work and final speed.
2. A $0.20\,\mathrm{kg}$ cart is launched by a $100\,\mathrm{N\,m^{-1}}$ spring compressed $0.080\,\mathrm m$. A constant $0.50\,\mathrm N$ resistance acts over $0.40\,\mathrm m$. Find the final speed, assuming the spring has fully released before the endpoint.
3. Two carts of masses $1.0$ and $3.0\,\mathrm{kg}$ have velocities $+4.0$ and $0\,\mathrm{m\,s^{-1}}$. Find final velocity and kinetic-energy change if they stick. Find both final velocities if the collision is elastic instead.
4. Prove that the kinetic-energy loss in a perfectly inelastic two-body collision is $\tfrac12\mu|\mathbf u_1-\mathbf u_2|^2$. State the assumed external impulse.
5. An ideal rocket has exhaust speed $3.0\,\mathrm{km\,s^{-1}}$ and mass ratio 4. Find its ideal velocity increment. Explain why doubling the initial-to-final mass ratio does not double that increment.
6. For $GM=3.986\times10^{14}\,\mathrm{m^3\,s^{-2}}$ and $r=8.00\times10^6\,\mathrm m$, find circular speed, escape speed, and period. Keep radius distinct from altitude.
7. For $U(x)=\alpha(x^2-a^2)^2$ with $\alpha>0$ and $a>0$, find the equilibria and classify them. Find the energy barrier between the two minima.
8. A small mass starts from rest at the top of a frictionless circular track on its inside. Explain why energy alone cannot determine whether contact is maintained everywhere. Write the radial equation at the top and identify the contact constraint.

Hints and complete solutions: [hints](../solutions/05-hints.md), [solutions](../solutions/05-solutions.md). Explore the numerical versions in the [companion](../companion/index.html).

Further conceptual reading: Feynman Lectures, Volume I, Chapters 4, 7, 10, 13–14; [work and potential energy](https://www.feynmanlectures.caltech.edu/I_13.html). Next, torque and angular momentum extend the same reasoning to rotation and central-force orbits.
