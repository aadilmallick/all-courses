# 10. Special relativity: keeping the laws when clocks disagree

Imagine two inertial observers moving relative to one another. Each carries clocks and rulers, and each measures a vacuum light pulse. If both obtain the same light speed, the Galilean rule of adding velocities cannot describe their measurements: that rule would predict different speeds for the pulse. Something in our familiar description of space and time must change.

Special relativity preserves the equivalence of inertial observers and replaces the assumption of universal simultaneity. It does not make measurement arbitrary. It supplies precise transformation laws and quantities on which observers agree. We will derive those laws, distinguish coordinate time from proper time, and build momentum and energy that remain consistent with the new geometry.

The prerequisites are algebra, functions, square roots, derivatives, vectors, conservation laws, and waves. The word **event** means a specified occurrence with a place and time, such as a detector clicking. A trajectory through spacetime is a sequence of events called a worldline. We use $c$ for vacuum light speed; numerical examples may use $c\approx3.00\times10^8\,\mathrm{m\,s^{-1}}$ when stated.

## The postulates and what they do not assume

The first postulate says the laws of physics take the same form in every inertial frame. No local nongravitational experiment in a closed laboratory identifies one inertial frame as absolutely at rest. The second says light in vacuum propagates at invariant speed $c$, independent of the inertial motion of its source. These are empirical foundations of the theory, not conclusions obtained from Newton's mechanics.

An inertial coordinate system uses synchronized clocks at different positions. One operational convention sends a light pulse from clock A to clock B and back; if emission and return occur at A-times $t_1,t_3$, B's reflection event is assigned time $(t_1+t_3)/2$. The convention treats opposite vacuum light-travel times symmetrically. Once adopted consistently in each inertial frame, it leads to the transformation laws below.

The theory concerns local physics without gravitational spacetime curvature. Accelerating observers and accelerated particles can still be described within flat spacetime, but a single global inertial coordinate system does not move with an accelerating traveler. General relativity in Chapter 25 adds gravity and curved geometry. We do not need it merely because a clock turns around.

## Deriving the Lorentz transformation

Let frame S' move at speed $v$ in the positive $x$ direction of S. Origins coincide at $t=t'=0$, and the axes are parallel. Homogeneity of space and time suggests a linear coordinate transformation: equal intervals should not acquire different rules merely because we moved the origin. The moving origin satisfies $x=vt$, so write $x'=A(x-vt)$.

Require that light moving along $x=ct$ maps to $x'=ct'$ and light along $x=-ct$ maps to $x'=-ct'$. These two conditions force the accompanying time relation to be $t'=A(t-vx/c^2)$. Relativity between the frames requires the inverse to have the same form with $v$ reversed. Substitute the forward relation into the inverse $x=A(x'+vt')$:

$$x=A^2\left[(x-vt)+v(t-vx/c^2)\right]
=A^2(1-v^2/c^2)x.$$

Thus $A=1/\sqrt{1-v^2/c^2}$, choosing the positive branch that approaches one as $v$ approaches zero. Define $\beta=v/c$ and $\gamma=(1-\beta^2)^{-1/2}$. Then

$$x'=\gamma(x-vt),\qquad
t'=\gamma\left(t-\frac{vx}{c^2}\right),\qquad
y'=y,\quad z'=z.$$

The transverse coordinates are unchanged for this standard boost. The inverse is obtained by changing $v$ to $-v$ and swapping primes. These formulas apply to differences between events as well as to coordinates relative to the common origin.

At $v=0.60c$, $\gamma=1.25$. Consider an event at $x=300\,\mathrm m$, $t=2.00\,\mu\mathrm s$, using rounded $c=3.00\times10^8\,\mathrm{m\,s^{-1}}$. Here $vt=360\,\mathrm m$, so $x'=-75.0\,\mathrm m$. Also $vx/c^2=0.600\,\mu\mathrm s$, so $t'=1.25(1.40)=1.75\,\mu\mathrm s$. Space and time mix, but the units in each subtraction match. An expression such as $t-vx/c$ would fail that check.

For $|v|\ll c$, $\gamma\approx1+\tfrac12v^2/c^2$. To lowest order, $x'\approx x-vt$ and $t'\approx t$ when the synchronization correction is negligible on the problem's scales. Galilean mechanics emerges as an approximation, not as a competing description that must remain exact at every speed.

## Simultaneity depends on the frame

Two spatially separated events simultaneous in S satisfy $\Delta t=0$. Their time difference in S' is

$$\Delta t'=-\gamma\frac{v\Delta x}{c^2}.$$

Unless $v\Delta x=0$, they are not simultaneous in S'. This is the crucial change behind time dilation and length contraction. It is not merely a delay caused by seeing a distant flash: the formula describes coordinates after light-travel-time corrections have been made using synchronized clocks.

For two events separated by $\Delta x=600\,\mathrm m$ and simultaneous in S, a frame moving at $0.60c$ assigns $\Delta t'=-1.50\,\mu\mathrm s$ with the rounded $c$ above. The negative sign says the event at larger $x$ occurs earlier in S'. We will shortly identify which event order can change without allowing a cause to precede itself.

When comparing measurements, specify the two events. “The moving clock is slower” without a pair of events and a synchronization convention can sound contradictory because either inertial observer can describe the other's clocks as moving. The resolution lies in which separated clocks are being compared and which simultaneity slice is used.

## Proper time is what a clock carries along its path

Direct substitution into the Lorentz transformation shows that

$$c^2\Delta t'^2-\Delta x'^2-\Delta y'^2-\Delta z'^2
=c^2\Delta t^2-\Delta x^2-\Delta y^2-\Delta z^2.$$

We use the metric-sign convention $+---$ in this chapter. An alternative overall sign convention is physically equivalent if used consistently. For nearby events along a massive clock's worldline, define proper time by

$$d\tau^2=dt^2-\frac{d\mathbf r^2}{c^2}
=dt^2\left(1-\frac{u^2}{c^2}\right).$$

Thus $d\tau=dt/\gamma_u$, where $u$ is that clock's speed in the chosen inertial frame. Proper time is invariant and is measured by an ideal clock traveling between the events. Coordinate time is measured using the chosen frame's synchronized clock network.

For a clock moving at constant $u$ between two events on its own worldline, $\Delta t=\gamma_u\Delta\tau$. This is time dilation. A particle with rest-frame mean lifetime $2.0\,\mu\mathrm s$ moving at $0.80c$ has $\gamma=5/3$ and mean coordinate lifetime $3.33\,\mu\mathrm s$ in the laboratory. Its mean travel distance is then $u\Delta t\approx800\,\mathrm m$ using rounded $c$. A mean lifetime is a statistical decay scale, not a promise that every particle lasts exactly that long.

For variable speed, integrate along the actual path:

$$\tau=\int_{t_i}^{t_f}\sqrt{1-u(t)^2/c^2}\,dt.$$

This formula already handles acceleration in flat spacetime. Ideal-clock behavior means the clock's reading follows proper time; physical clocks can also have engineering sensitivities to forces or environmental conditions, which are separate from the spacetime prediction.

## Length contraction is a statement about simultaneous endpoints

A rod at rest in S' has proper length $L_0$. Measure its length in S by recording both endpoints at the same S-time, so $\Delta t=0$. The Lorentz transformation gives $\Delta x'=\gamma\Delta x$. Since the two endpoints maintain fixed separation $L_0$ in S',

$$L=\Delta x=\frac{L_0}{\gamma}.$$

A rod of proper length $10\,\mathrm m$ moving at $0.60c$ has length $8.0\,\mathrm m$ under this simultaneous-endpoint procedure. Its own observer still measures $10\,\mathrm m$. There is no contradiction because the two procedures select different pairs of endpoint events.

A photograph is another observable. Light from different points takes different times to arrive, so a camera image can combine events that were not simultaneous in the camera frame. The contraction formula is not automatically a rule for the apparent shape in every photograph. Nor does a moving object physically need to be compressed by a force to satisfy the coordinate comparison.

No perfectly rigid object transmits a push instantaneously in relativity. A change at one end must propagate through the material at a finite signal speed. Prescribing an accelerated rod as if every point received simultaneous instructions in every frame is incompatible with the theory's geometry.

## Intervals classify possible causal relationships

For a separation, define $\Delta s^2=c^2\Delta t^2-|\Delta\mathbf r|^2$. A positive value is timelike: an inertial frame exists in which the events occur at the same place, and a massive object can in principle travel between them at sublight speed. A zero value is null or lightlike: a vacuum light signal can connect them. A negative value is spacelike: no signal traveling at or below $c$ can connect them directly.

The time ordering of timelike-separated events is the same in all proper orthochronous inertial frames. For a spacelike separation, some frames reverse the coordinate order. That reversal does not reverse an allowed cause-and-effect chain because no ordinary causal signal can link those two events. A Lorentz transformation does not let an observer turn a timelike future into its own past.

For example, a separation of $300\,\mathrm m$ in $2.0\,\mu\mathrm s$ has $c\Delta t=600\,\mathrm m$, so it is timelike. A separation of $600\,\mathrm m$ in zero coordinate time is spacelike. The invariant interval, rather than the coordinate values separately, identifies the physical distinction.

A spacetime diagram often puts $ct$ vertically and $x$ horizontally, so light rays make $45^\circ$ lines when the axes use equal length scales. Massive worldlines remain within the light cone. A Lorentz boost changes the coordinate grid while preserving that cone, unlike an ordinary Euclidean rotation that preserves circles.

## Velocities transform by dividing transformed intervals

Let a particle have components $u_x=dx/dt$ and $u_y=dy/dt$ in S. Differentiate the coordinate transformation and divide:

$$u_x'=\frac{u_x-v}{1-vu_x/c^2},\qquad
u_y'=\frac{u_y}{\gamma(1-vu_x/c^2)}.$$

The $z$ expression is analogous. If $u_x=c$ and $u_y=0$, then $u_x'=c$. If both collinear speeds have magnitude below $c$, their relativistic composition also remains below $c$. The denominator is the effect of transforming time as well as space.

A spacecraft moves at $0.80c$ relative to Earth and launches a probe forward at $0.70c$ relative to itself. Earth's probe speed is

$$u=\frac{0.80c+0.70c}{1+0.80(0.70)}
=\frac{1.50}{1.56}c\approx0.9615c.$$

It is not $1.50c$. A probe launched backward at $0.70c$ relative to the craft has Earth speed $(0.80-0.70)c/[1-0.80(0.70)]\approx0.2273c$ forward. A negative relative velocity in one frame does not guarantee a negative velocity in another.

## The traveling-clock comparison has different paths

Suppose a traveler moves from Earth to a destination $4.0$ light-years away in Earth's inertial frame at $0.80c$, then reverses and returns at the same speed. Idealize the turnaround as brief. One light-year is the distance light travels in one year, so Earth's time for each leg is $4.0/0.80=5.0$ years. Total Earth time is 10 years.

The traveler's proper time on each leg is $5.0/(5/3)=3.0$ years, so total is 6.0 years. Both clocks meet at departure and reunion; their readings can be directly compared without a distant synchronization argument. The worldlines between the same endpoints differ, and so do their proper-time integrals.

During each constant-velocity leg the traveler can use an inertial frame, but the outbound and inbound frames are different. Joining them changes which distant Earth event is called simultaneous with the turnaround. Treating both legs as one unchanging inertial frame creates the apparent paradox. Acceleration is needed to change the path in this trip, but it is not correct to say that acceleration by itself is a universal instantaneous clock-slowing term in $d\tau$. The proper-time formula depends locally on speed in a chosen inertial frame; the full path determines the final difference.

## Relativistic Doppler shift combines travel geometry and clocks

Let a source recede directly from an observer at speed $v$. It emits successive crests separated by proper time $\Delta\tau_s$. In the observer's frame the emission interval is $\gamma\Delta\tau_s$. During that interval the source moves farther away by $v\gamma\Delta\tau_s$, adding another light-travel delay. Thus the arrival interval is

$$\Delta t_{\rm arr}=\gamma(1+\beta)\Delta\tau_s.$$

Taking reciprocal periods gives

$$f_{\rm obs}=f_s\sqrt{\frac{1-\beta}{1+\beta}}$$

for recession, with the inverse factor for approach. At $\beta=0.60$, the recession factor is $\sqrt{0.40/1.60}=1/2$. The received frequency is half the source's rest-frame frequency. Unlike the acoustic formula in Chapter 08, there is no material medium's preferred rest frame in this vacuum result.

At other viewing angles, one must transform the emission direction as well as account for time dilation. Do not use the longitudinal formula for a transverse arrangement by merely setting an intuitive radial speed to zero. The transverse Doppler effect is a direct consequence of the clock relationship and requires a clearly specified observation geometry.

## Four-momentum turns spacetime geometry into dynamics

Write a spacetime displacement as $dx^\mu=(c\,dt,dx,dy,dz)$. The superscript $\mu$ is a component label running from 0 to 3, not an exponent. Divide by invariant proper time to define four-velocity:

$$U^\mu=\frac{dx^\mu}{d\tau}=\gamma(c,\mathbf u).$$

For a massive particle of invariant mass $m$, define four-momentum $P^\mu=mU^\mu$. Its spatial part is $\mathbf p=\gamma m\mathbf u$. Define energy through the time component, $P^0=E/c$, giving

$$E=\gamma mc^2,\qquad \mathbf p=\gamma m\mathbf u.$$

This construction makes momentum and energy transform together as a four-vector. It is supported physically by their conservation in interactions and by the work relation below; geometry alone does not determine every interaction law. Invariant mass is a property of the particle, not a speed-dependent “amount of matter.” We use the same $m$ in every inertial frame.

The invariant norm is

$$\frac{E^2}{c^2}-p^2=m^2c^2,
\qquad E^2=p^2c^2+m^2c^4.$$

At rest $E_0=mc^2$. Kinetic energy is $K=E-E_0=(\gamma-1)mc^2$. Expanding at low speed gives $K\approx\tfrac12mu^2+\tfrac38mu^4/c^2+\cdots$, recovering Newtonian kinetic energy as the leading term. The total energy includes rest energy; adding $mc^2$ to kinetic energy again would double-count it.

For a massless free particle, proper-time four-velocity is not defined because its worldline is null. Instead use a null four-momentum with $E=pc$ and propagation speed $c$. One cannot obtain a photon's momentum by setting $m=0$ in $\gamma m u$ while leaving $\gamma$ finite. Quantum theory later supplies the photon relation $E=hf$ as an additional physical fact, not as a consequence of the Lorentz transformation alone.

At $u=0.60c$, $\gamma=1.25$, so a massive particle's kinetic energy is $0.25mc^2$ and momentum is $0.75mc$. The Newtonian estimate would give $0.18mc^2$, already significantly smaller. As $u\to c$ for fixed positive $m$, $\gamma$ and the required energy diverge. Finite supplied energy cannot accelerate such a particle to $c$ in this framework.

## Forces change momentum, not a universal scalar times acceleration

Define the laboratory three-force by $\mathbf F=d\mathbf p/dt$. Differentiate the energy–momentum relation, or the expressions in $\gamma$, to find

$$\frac{dE}{dt}=\mathbf F\cdot\mathbf u.$$

Thus work remains the transfer of energy, but the kinetic-energy expression has changed. For force parallel to velocity, differentiation of $p=\gamma mu$ gives $F=\gamma^3ma$. For force perpendicular to velocity, $\mathbf u\cdot\mathbf a=0$ at that instant, so $\gamma$ does not change then and $F_\perp=\gamma ma_\perp$. One scalar “relativistic mass” multiplying every acceleration would obscure this directional distinction.

A constant one-dimensional laboratory force acting on a particle initially at rest gives $p=Ft$. Using $u=pc^2/E$ and $E=\sqrt{p^2c^2+m^2c^4}$,

$$u(t)=\frac{Ft/m}{\sqrt{1+(Ft/mc)^2}}.$$

For small $t$ this is approximately $Ft/m$; for large $t$ it approaches $c$ while momentum continues to grow. Integration yields

$$x(t)=\frac{mc^2}{F}\left[\sqrt{1+(Ft/mc)^2}-1\right].$$

Differentiate to check the velocity, and note that the bracket is dimensionless while $mc^2/F$ is a length. The Newtonian limit follows by expanding the square root, giving $x\approx Ft^2/(2m)$. Consistent limiting behavior is a powerful check on a relativistic formula.

## A system's invariant mass includes internal energy

Total four-momentum is the sum of constituent four-momenta. Define a system's invariant mass by

$$M^2c^4=E_{\rm tot}^2-c^2|\mathbf P_{\rm tot}|^2.$$

It is not generally the sum of constituent rest masses. In the center-of-momentum frame, $\mathbf P_{\rm tot}=0$, so $Mc^2=E_{\rm CM}$. Relative kinetic energy, stored field energy, and other internal energy contribute to the system's rest energy.

Consider two identical masses $m$ approaching one another at equal speed $u$ in their center-of-momentum frame and sticking. Initial total momentum is zero and total energy is $2\gamma mc^2$. If no energy escapes, the final composite remains at rest and has invariant mass $M=2\gamma m$. At $u=0.60c$, $M=2.5m$, exceeding $2m$ by the converted internal energy divided by $c^2$. Rest mass of the closed system is consistent with total four-momentum conservation even though the sum of the separate particle masses changes after binding or heating.

Two photons of equal energy $\varepsilon$ traveling oppositely have total momentum zero and system mass $2\varepsilon/c^2$, despite each having zero invariant mass. If the photons travel in the same direction, their total energy and total momentum satisfy $E=cP$, and the pair has zero invariant mass. Direction matters; adding energies alone is insufficient to determine invariant mass.

This also explains collider design. A beam particle with total energy $E_b$ hits an identical target of mass $m$ at rest. The squared center-of-momentum energy is

$$E_{\rm CM}^2=(E_b+mc^2)^2-p_b^2c^2
=2m^2c^4+2mc^2E_b.$$

At very high beam energy, the available center-of-momentum energy grows only as $\sqrt{E_b}$. Two equal opposing beams instead have zero total momentum and $E_{\rm CM}=2E_b$. Much more of their energy is available for creating new particles rather than carrying the whole reaction forward.

## Rapidity makes repeated boosts add

Ordinary velocities do not add linearly, but a new parameter can. Define hyperbolic functions through exponentials:

$$\cosh\eta=\frac{e^\eta+e^{-\eta}}2,\qquad
\sinh\eta=\frac{e^\eta-e^{-\eta}}2,\qquad
\tanh\eta=\frac{\sinh\eta}{\cosh\eta}.$$

Their identity $\cosh^2\eta-\sinh^2\eta=1$ resembles the invariant spacetime interval. Set $\beta=\tanh\eta$. Then $\gamma=\cosh\eta$ and $\gamma\beta=\sinh\eta$. The Lorentz boost becomes a hyperbolic rotation mixing $ct$ and $x$. The parameter is

$$\eta=\frac12\ln\frac{1+\beta}{1-\beta}.$$

For collinear boosts, multiplying the transformations and using the exponential definitions shows their rapidities add: $\eta_{\rm total}=\eta_1+\eta_2$. Taking the hyperbolic tangent reproduces the velocity-addition rule. This provides an efficient language for repeated accelerations and a bridge to the geometry of Chapter 25. Noncollinear boosts require more care; they can include a rotation and are not summarized by adding ordinary rapidity vectors.

The conceptual chain is now complete: invariant light propagation requires transformed simultaneity; transformed space and time produce invariant proper time; the same geometry organizes four-momentum; and energy–momentum conservation replaces the Newtonian expressions while preserving their successful low-speed limit. No single observer's coordinates are absolute, but the transformation rules and invariants make their predictions agree.

## Optional practice

1. Compute $\gamma$ at $0.80c$. A moving ideal clock records $3.0\,\mu\mathrm s$ between two events on its worldline. Find laboratory elapsed time and distance traveled.
2. A rod has proper length $12\,\mathrm m$ and moves along its length at $0.60c$. Find its laboratory length and identify the simultaneity condition used.
3. Two events have $\Delta x=900\,\mathrm m$ and $\Delta t=2.0\,\mu\mathrm s$, with no transverse separation. Using rounded $c=3.00\times10^8\,\mathrm{m\,s^{-1}}$, classify the interval. Find the speed of a frame in which they are simultaneous.
4. Compose collinear speeds $0.60c$ and $0.60c$. Check that the result is less than $c$.
5. A source recedes at $0.80c$. Find its longitudinal observed-to-emitted frequency ratio.
6. A particle has momentum $p=3mc/4$. Find total energy, kinetic energy, speed, and $\gamma$ in units built from $m$ and $c$.
7. Two equal rest masses move oppositely at $0.80c$ and stick without radiation escaping. Find the composite invariant mass. Explain why conserving the sum of constituent rest masses would be incorrect.
8. Derive the constant-force position formula by integrating the displayed velocity. Verify its low-speed limit and large-time speed limit.

Hints and complete solutions: [hints](../solutions/10-hints.md), [solutions](../solutions/10-solutions.md). Use the [companion](../companion/index.html) for listed relativistic calculations.

Further conceptual reading: Feynman Lectures, Volume I, Chapters 15–17; [spacetime](https://www.feynmanlectures.caltech.edu/I_17.html). Next, analytical mechanics reorganizes classical motion around action, symmetry, and phase space, preparing a language used throughout advanced physics.
