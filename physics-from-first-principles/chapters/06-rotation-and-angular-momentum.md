# 06. Rotation: geometry, torque, and angular momentum

A force applied near a door's hinge has a different effect from the same force applied at its handle. Newton's force law still holds for every tiny piece of the door, but tracking each piece separately would bury the simple question: how quickly does the door turn? Rotation introduces variables that summarize coordinated motion around an axis.

We begin with a fixed axis and then ask what survives when the axis itself changes. The new mathematical operation is the cross product, which encodes an oriented area and a perpendicular direction. We will also meet the moment of inertia, angular momentum, rolling constraints, and the first elements of three-dimensional rigid-body dynamics. The prerequisites are vectors, trigonometry, derivatives, work, and linear momentum from Chapters 02–05.

## Angle is a way to measure arc length

For a circle of radius $r$, define an angle in radians by $\theta=s/r$, where $s$ is the arc length. A full turn corresponds to $2\pi$ radians. The radian is dimensionless in dimensional analysis because it is a ratio of two lengths, but retaining “rad” in a reported angular speed helps readers recognize its meaning.

Angular velocity about a fixed axis is $\omega=d\theta/dt$, and angular acceleration is $\alpha=d\omega/dt$. Every point on a rigid body shares the same $\omega$ about that axis, but points at different distances have different linear speeds:

$$v_{\rm tan}=r_\perp\omega,\qquad a_{\rm tan}=r_\perp\alpha.$$

Here $r_\perp$ is perpendicular distance to the axis, not necessarily distance to a chosen origin. A point can also have radial acceleration $r_\perp\omega^2$ toward the axis. Tangential acceleration changes speed; radial acceleration changes direction. They should not be added as ordinary signed scalars because their directions differ.

A wheel turns through $12$ radians in $3$ seconds at constant angular velocity. Then $\omega=4\,\mathrm{rad\,s^{-1}}$. A mark $0.20\,\mathrm m$ from the axle has speed $0.80\,\mathrm{m\,s^{-1}}$ and inward acceleration $0.20(4^2)=3.2\,\mathrm{m\,s^{-2}}$. Its tangential acceleration is zero. Saying “constant angular speed” therefore does not mean that every part has zero acceleration.

For constant angular acceleration, integration gives $\omega=\omega_0+\alpha t$ and $\theta=\theta_0+\omega_0t+\tfrac12\alpha t^2$. These equations resemble their straight-line counterparts because they express the same derivative relationships for a different coordinate. The analogy is useful, but three-dimensional rotations cannot in general be treated as ordinary angle vectors: finite rotations about different axes do not commute.

## The cross product and the meaning of torque

For vectors $\mathbf a$ and $\mathbf b$, the cross product $\mathbf a\times\mathbf b$ has magnitude $ab\sin\phi$, where $\phi$ is their angle, and points perpendicular to their plane according to the right-hand rule. Curl the fingers of your right hand from the first vector toward the second through the smaller angle; your thumb gives the positive direction. Reversing the order changes the sign.

In a right-handed Cartesian basis, its components are

$$\mathbf a\times\mathbf b=
(a_yb_z-a_zb_y,\ a_zb_x-a_xb_z,\ a_xb_y-a_yb_x).$$

This component formula defines the operation even if a drawing is difficult. Parallel vectors have zero cross product. The magnitude represents the area of the parallelogram spanned by the two vectors. This geometry explains why an interaction's rotational effect depends on its perpendicular lever arm.

Define torque about an origin O as

$$\boldsymbol\tau_O=\mathbf r\times\mathbf F,$$

with $\mathbf r$ pointing from O to the force's point of application. Its magnitude is force times the perpendicular distance from O to the force's line of action. A force through the origin has zero torque about it. Torque has units newton meter, but it is not energy: torque is an axial vector, whereas work is a scalar and requires an angular displacement or path.

For a door with a handle $0.80\,\mathrm m$ from its hinge, a perpendicular $15\,\mathrm N$ push gives torque magnitude $12\,\mathrm{N\,m}$. If the push makes $30^\circ$ with the radius from hinge to handle, the torque is $0.80(15)\sin30^\circ=6.0\,\mathrm{N\,m}$. The angle here is with the radius, not automatically with the door's surface normal. Drawing the vectors prevents the common sine-versus-cosine error.

## Angular momentum follows from Newton's law

For a particle, define angular momentum about O as

$$\mathbf L_O=\mathbf r\times\mathbf p.$$

Take O fixed in an inertial frame. Differentiating with the product rule gives

$$\frac{d\mathbf L_O}{dt}
=\mathbf v\times m\mathbf v+\mathbf r\times\dot{\mathbf p}
=\boldsymbol\tau_O.$$

The first term vanishes because a vector crossed with itself is zero. Thus torque changes angular momentum just as force changes linear momentum. Integrating gives angular impulse $\int\boldsymbol\tau\,dt=\Delta\mathbf L$.

For a collection of particles, sum the angular momenta. Internal central pair forces give zero net internal torque because each pair acts along the separation between its particles. Then $d\mathbf L_O/dt=\boldsymbol\tau_{O,\rm ext}$. This usual mechanical result requires the relevant interaction and field bookkeeping; it should not be promoted into a claim that all particle-only internal torques always vanish in every theory.

The fixed-origin hypothesis matters. A moving origin can introduce additional terms. A particularly useful alternative is angular momentum about the center of mass, formed with positions and velocities relative to that center; its derivative equals external torque about the center for a fixed-mass system. Do not silently mix an angular momentum measured about one point with torques measured about another.

If external torque about the selected origin vanishes, angular momentum about that origin is conserved. A gravitational central force points along $\mathbf r$, so $\mathbf r\times\mathbf F=0$. A satellite therefore has conserved orbital angular momentum even though its linear momentum changes continuously. Its orbit lies in the plane perpendicular to its nonzero angular momentum vector, because $\mathbf L$ is perpendicular to both position and velocity.

## Moment of inertia: where the mass is matters

For a rigid body rotating about a fixed $z$ axis, particle $i$ has tangential speed $r_{\perp i}\omega$. Adding kinetic energies yields

$$K_{\rm rot}=\frac12\sum_i m_i r_{\perp i}^2\omega^2
=\frac12I_z\omega^2,$$

where

$$I_z=\sum_i m_i r_{\perp i}^2$$

is the moment of inertia about that axis. For continuous matter, replace the sum by $I_z=\int r_\perp^2\,dm$. The squared distance weights remote mass strongly. Equal total masses need not have equal rotational inertia, and a body's inertia changes when the axis changes.

For a thin hoop of radius $R$, every mass element is distance $R$ from its central perpendicular axis, so $I=MR^2$. For a uniform disk, imagine thin concentric rings. A ring of radius $r$ and width $dr$ has area $2\pi r\,dr$. Uniform surface density is $\sigma=M/(\pi R^2)$, hence $dm=2\pi\sigma r\,dr$. Therefore

$$I=\int_0^Rr^2(2\pi\sigma r\,dr)
=2\pi\sigma\frac{R^4}{4}=\frac12MR^2.$$

For a uniform slender rod of length $L$ about its midpoint and perpendicular to its length, use linear density $M/L$ and coordinate $x\in[-L/2,L/2]$:

$$I_{\rm mid}=\frac{M}{L}\int_{-L/2}^{L/2}x^2dx=\frac{ML^2}{12}.$$

These are derivations from mass distribution, not independent laws. A hollow rod, nonuniform disk, or thick hoop requires a different integral.

The parallel-axis theorem relates parallel axes separated by distance $d$:

$$I_O=I_{\rm CM}+Md^2.$$

To derive it, write a particle's perpendicular position relative to O as its position relative to the center of mass plus the constant offset. Expanding the squared distance produces an $I_{\rm CM}$ term, an $Md^2$ term, and a cross term proportional to the mass-weighted sum of positions relative to the center. That sum is zero by the definition of center of mass. For the rod about one end, $d=L/2$ gives $I_{\rm end}=ML^2/12+ML^2/4=ML^2/3$.

## The rotational equation and work about a fixed axis

For fixed-axis rotation, the angular momentum component along the axis is $L_z=I_z\omega$. If the body is rigid and the axis is fixed, $I_z$ is constant. Therefore

$$\tau_{z,\rm ext}=I_z\alpha.$$

This is an equation for the component along that axis. It does not imply the vector relation $\boldsymbol\tau=I\boldsymbol\alpha$ for arbitrary three-dimensional motion with one scalar $I$. Supports can exert additional torques needed to keep a nonprincipal axis fixed.

An infinitesimal rotation $d\theta$ moves a force's application point by a tangential amount. Its work is $dW=\tau_zd\theta$, so $P=\tau_z\omega$ and net rotational work changes $\tfrac12I_z\omega^2$. The sign convention must be consistent: a torque opposite angular velocity removes rotational kinetic energy.

Suppose a uniform disk has $M=2.0\,\mathrm{kg}$ and $R=0.30\,\mathrm m$. Its central inertia is $I=0.090\,\mathrm{kg\,m^2}$. A tangential $3.0\,\mathrm N$ force at the rim supplies torque $0.90\,\mathrm{N\,m}$. Neglect axle resistance; then $\alpha=0.90/0.090=10\,\mathrm{rad\,s^{-2}}$. Starting at rest, after $2.0\,\mathrm s$ it has $\omega=20\,\mathrm{rad\,s^{-1}}$ and has turned through $20$ radians. Torque work is $0.90(20)=18\,\mathrm J$, matching $\tfrac12(0.090)(20)^2=18\,\mathrm J$.

## Static equilibrium requires both kinds of balance

An extended body at rest requires net external force zero and net external torque zero. Force balance alone can leave an unbalanced couple: two equal opposite forces at different points can have zero net force and nonzero net torque. Torque balance alone can leave a net translational force.

A uniform horizontal beam of length $L=2.0\,\mathrm m$ and mass $M=10\,\mathrm{kg}$ is hinged at the left end. A vertical cable supports its right end. A $5.0\,\mathrm{kg}$ load hangs $1.5\,\mathrm m$ from the hinge. Taking torques about the hinge removes the hinge force from that equation:

$$T(2.0)-Mg(1.0)-(5.0g)(1.5)=0.$$

Thus $T=[98.1+73.575]/2=85.8375\,\mathrm N$. Vertical force balance then gives hinge reaction $H_y=(10+5)g-T=61.3125\,\mathrm N$. The cable does not carry the whole weight because the hinge also supports the beam. Taking torque about a different origin gives the same result once all forces and lever arms are included.

The beam's gravitational force acts at its center of mass in a uniform gravitational field. In a significantly nonuniform field, a single center-of-gravity force may not reproduce the torque for all orientations. The simplification works here because $g$ is effectively constant across the beam.

## Rolling is translation plus rotation

A wheel rolling without slipping on a stationary flat surface satisfies $v_{\rm CM}=R\omega$ in magnitude. The contact point is instantaneously at rest relative to the surface: its velocity from translation and its velocity from rotation cancel. The top point moves at $2v_{\rm CM}$. These are instantaneous velocities; the contact point is not a permanently fixed pivot in an inertial frame.

For a rigid body whose center moves with speed $V$,

$$K=\frac12MV^2+\frac12I_{\rm CM}\omega^2.$$

This follows from the center-of-mass kinetic-energy decomposition in Chapter 05. It is not double-counting: one term describes motion of the center and the other motion relative to the center. Under no-slip rolling, substitute $\omega=V/R$.

For a body rolling down an incline through vertical drop $h$, assume static contact, negligible rolling resistance, and no other energy transfer. Then

$$Mgh=\frac12MV^2+\frac12I_{\rm CM}\frac{V^2}{R^2},$$

so

$$V^2=\frac{2gh}{1+I_{\rm CM}/(MR^2)}.$$

A disk has denominator $1+1/2=3/2$, giving $V^2=4gh/3$. A hoop has denominator 2, giving $V^2=gh$. The hoop is slower at the same drop because more energy resides in rotation for the same center speed, not because it necessarily experiences a larger dissipative friction force.

To find acceleration and the required static friction, choose downhill positive and let $f$ denote an uphill friction magnitude. Translation gives $Mg\sin\theta-f=Ma$. Rotation about the center gives $fR=I_{\rm CM}\alpha$, and no slip gives $a=R\alpha$. Combining,

$$a=\frac{g\sin\theta}{1+I_{\rm CM}/(MR^2)},\qquad
f=\frac{I_{\rm CM}}{R^2}a.$$

For a disk on a $30^\circ$ incline, $a=(2/3)g\sin30^\circ=3.27\,\mathrm{m\,s^{-2}}$ and $f=Mg\sin30^\circ/3=Mg/6$. Because $N=Mg\cos30^\circ$, rolling requires $\mu_s\geq f/N=\tan30^\circ/3\approx0.1925$. If friction is insufficient, the no-slip constraint fails and a sliding model must replace it.

In ideal rolling on a stationary rigid surface, static friction does no work at the contact point. It still redistributes the mechanical effect between translation and rotation. Real tires deform, surfaces yield, and rolling resistance dissipates energy; the ideal conclusion must not be applied to every wheel without its assumptions.

## A pulley with inertia makes the tensions unequal

Return to two hanging masses, but let the pulley have radius $R$ and moment of inertia $I$. The string does not slip. Use upward positive for $m_1$ and downward positive for $m_2>m_1$. The equations are

$$T_1-m_1g=m_1a,\qquad m_2g-T_2=m_2a,$$

$$ (T_2-T_1)R=I\alpha=I\frac{a}{R}.$$

Adding the first two and substituting the torque relation gives

$$a=\frac{(m_2-m_1)g}{m_1+m_2+I/R^2}.$$

The term $I/R^2$ has units of mass and expresses the extra inertia associated with spinning the pulley. With $m_1=2.0\,\mathrm{kg}$, $m_2=3.0\,\mathrm{kg}$, and a uniform $1.0\,\mathrm{kg}$ pulley, $I/R^2=0.50\,\mathrm{kg}$. Hence $a=9.81/5.5\approx1.784\,\mathrm{m\,s^{-2}}$, smaller than the ideal massless-pulley value. Then $T_1\approx23.19\,\mathrm N$ and $T_2\approx24.08\,\mathrm N$. Their difference supplies the pulley torque.

## Central forces, swept area, and effective radial energy

Angular momentum connects rotation to orbital motion. In a plane, polar coordinates describe position by distance $r$ and angle $\theta$. The radial and tangential unit vectors rotate with the particle. A small displacement has radial part $dr$ and tangential part $r\,d\theta$, so

$$v^2=\dot r^2+r^2\dot\theta^2,\qquad L=mr^2\dot\theta$$

for the signed perpendicular angular momentum component. For a central force, $L$ is constant. In a short time, the radius sweeps a thin triangle of area approximately $\tfrac12r^2d\theta$. Thus

$$\frac{dA}{dt}=\frac12r^2\dot\theta=\frac{L}{2m}.$$

Equal swept areas in equal times follow from zero torque, not specifically from an inverse-square force. The special orbit shape requires the additional gravitational force law. Near a planet the radius is smaller, so angular speed must be larger to maintain the same $r^2\dot\theta$.

Substitute $\dot\theta=L/(mr^2)$ into energy:

$$E=\frac12m\dot r^2+U_{\rm eff}(r),\qquad
U_{\rm eff}(r)=U(r)+\frac{L^2}{2mr^2}.$$

The second term is a convenient way to account for tangential kinetic energy in a radial equation. It is not an additional physical potential interaction. For gravity, $U=-GMm/r$. A circular orbit has $\dot r=0$ at a stationary point of the effective potential:

$$\frac{dU_{\rm eff}}{dr}=\frac{GMm}{r^2}-\frac{L^2}{mr^3}=0,$$

so $L^2=GMm^2r$. Substituting $L=mrv$ recovers $v^2=GM/r$. At that radius $U_{\rm eff}''=GMm/r^3>0$, so small radial disturbances around the circular orbit are stable in this ideal model. This is a local stability statement, not a claim that every disturbance leaves the same circle intact.

## Three-dimensional rotation needs more than one scalar inertia

For a body rotating with angular velocity vector $\boldsymbol\omega$, a mass element at position $\mathbf r$ relative to the center has velocity $\boldsymbol\omega\times\mathbf r$. Its angular momentum is $\mathbf r\times dm(\boldsymbol\omega\times\mathbf r)$. Adding elements produces a linear relation between the three components of $\mathbf L$ and those of $\boldsymbol\omega$.

Write it as $L_i=\sum_jI_{ij}\omega_j$, where

$$I_{ij}=\int(r^2\delta_{ij}-r_ir_j)\,dm.$$

Here indices $i,j$ run over $x,y,z$, and $\delta_{ij}$ is 1 when the indices match and 0 otherwise. For example, $I_{xx}=\int(y^2+z^2)dm$ and $I_{xy}=-\int xy\,dm$. The array $I_{ij}$ is the inertia tensor. It describes how direction matters in the mass distribution. This is our first concrete tensor: a rule converting one vector into another while representing the same physical relationship under a change of coordinates.

For suitable mutually perpendicular **principal axes**, the off-diagonal entries vanish. Then $L_1=I_1\omega_1$, $L_2=I_2\omega_2$, and $L_3=I_3\omega_3$. Symmetry often identifies these axes directly. A sphere has the same inertia in every direction, so $\mathbf L$ is parallel to $\boldsymbol\omega$. An asymmetric body generally does not. The matrix and eigenvector machinery that finds the axes systematically is taught in Chapter 19; here the diagonal relationships are sufficient to understand the dynamics.

Because body-fixed axes rotate, the time derivative of a vector in the inertial frame equals its body-component derivative plus $\boldsymbol\omega\times$ that vector. For angular momentum this gives the body-axis equations

$$\tau_1=I_1\dot\omega_1+(I_3-I_2)\omega_2\omega_3,$$

$$\tau_2=I_2\dot\omega_2+(I_1-I_3)\omega_3\omega_1,$$

$$\tau_3=I_3\dot\omega_3+(I_2-I_1)\omega_1\omega_2.$$

To justify the extra cross term, imagine a vector whose body components remain constant while the body turns: it still changes direction in the laboratory at rate $\boldsymbol\omega\times\mathbf L$. The displayed equations are Euler's rigid-body equations in principal axes. They are not obtained by applying $\tau=I\alpha$ independently while ignoring the rotating basis.

For torque-free motion, both $L^2$ and rotational kinetic energy remain constant, but the body's orientation and body components of angular velocity can change. Rotation about the largest or smallest principal inertia is stable to small disturbances; rotation about an intermediate inertia is unstable. The final practice problem derives the intermediate-axis result from a small perturbation rather than asking you to trust an object-tossing demonstration.

## Gyroscopic precession is angular momentum changing direction

A rapidly spinning top can respond to gravity by turning its axis sideways. Let its large spin angular momentum be approximately $\mathbf L$ along the symmetry axis. If that axis precesses steadily around a vertical direction with angular velocity $\boldsymbol\Omega$, then

$$\frac{d\mathbf L}{dt}=\boldsymbol\Omega\times\mathbf L.$$

Gravity exerts torque $\boldsymbol\tau=\mathbf r_{\rm CM}\times M\mathbf g$ about the support. If the axis makes angle $\theta$ with vertical and the center lies distance $\ell$ along it, the torque magnitude is $Mg\ell\sin\theta$. The precession derivative has magnitude $\Omega L\sin\theta$. For nonzero tilt, equating them gives

$$\Omega\approx\frac{Mg\ell}{L}\approx\frac{Mg\ell}{I_{\rm spin}\omega_{\rm spin}}.$$

This approximation assumes rapid spin and a regime of slow, nearly steady precession in which the spin dominates the angular momentum. A general top can nutate, meaning its tilt oscillates, and the approximation does not describe all releases. Increasing spin angular momentum reduces the slow precession rate in the stated regime. A torque can change direction rather than mainly change magnitude, just as a perpendicular force can turn linear velocity without changing speed.

The point of the chapter is not to memorize a second set of mechanics formulas. It is to see how geometry supplies the appropriate conserved quantity. Position crossed with momentum gives angular momentum; position crossed with force gives torque; mass weighted by squared distance gives inertia. Keeping the origin, axis, frame, and constraint explicit lets these compact quantities replace an impossible list of individual particle motions.

## Optional practice

1. A $0.50\,\mathrm m$ wrench receives a $40\,\mathrm N$ force at $60^\circ$ to its length. Find the torque magnitude. What changes if the force is parallel to the wrench?
2. Derive the inertia of a uniform rod about one end by direct integration and by the parallel-axis theorem.
3. A uniform disk of mass $3.0\,\mathrm{kg}$ and radius $0.20\,\mathrm m$ accelerates from rest to $30\,\mathrm{rad\,s^{-1}}$ in $5.0\,\mathrm s$. Find the required constant net torque and the work done.
4. A hoop and a disk of the same mass and radius roll from rest through a $1.0\,\mathrm m$ vertical drop without slipping. Find their center speeds and compare their kinetic-energy partitions.
5. Derive the minimum coefficient of static friction for a uniform solid sphere rolling down an incline, using $I=2MR^2/5$ about its center.
6. A skater changes their axial inertia from $4.0$ to $2.5\,\mathrm{kg\,m^2}$ while rotating initially at $3.0\,\mathrm{rad\,s^{-1}}$, with negligible external axial torque. Find the final angular speed and kinetic-energy change. Identify the energy source.
7. A central-force orbit has radius $r$ and angular speed $\dot\theta$. At a later instant its radius is half as large. Find the new angular speed and tangential speed relative to their original values, assuming nonzero conserved angular momentum.
8. Suppose $I_1<I_2<I_3$ and a torque-free body nearly spins about axis 2 with $\omega_2=\Omega$. Linearize Euler's equations in small $\omega_1,\omega_3$. Show that $\ddot\omega_1=c\omega_1$ with $c>0$, and interpret the growing solution. Explain why conserving both energy and angular momentum does not forbid this instability.

Hints and complete solutions: [hints](../solutions/06-hints.md), [solutions](../solutions/06-solutions.md). The [companion](../companion/index.html) provides numerical exploration of the mechanics models where listed.

Further conceptual reading: Feynman Lectures, Volume I, Chapters 18–20; [rotation in space](https://www.feynmanlectures.caltech.edu/I_20.html). Next, the local spring-like behavior near a stable equilibrium becomes a general theory of oscillation and resonance.
