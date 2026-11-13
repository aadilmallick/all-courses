# 04. Newton's laws: turning a force into a prediction

A cart sits on a straight track. You can measure its mass, give it a push, and watch it move. Describing the resulting positions is one task. Predicting the positions before the experiment is another. The bridge is a model that connects interactions to changes of motion. Newtonian mechanics is our first systematic version of that model.

The central question is: **given the state now and the interactions, what happens next?** A state must contain enough information to distinguish possible futures. Position alone cannot distinguish a cart rolling to the left from one rolling to the right through the same point. For a particle in ordinary Newtonian mechanics, position and velocity provide the required state. A force law then determines acceleration.

Read Chapters 02–03 first. We use vectors, sine and cosine, velocity as a derivative, and acceleration as the derivative of velocity. The new mathematics is an ordinary differential equation: an equation that relates an unknown function to its derivatives. We will build its meaning through examples rather than assume that the name explains anything.

## Choosing the object and the observer

Begin every mechanics problem by choosing a **system**. It may be a cart, a person, two connected masses, or the Earth and a satellite together. Everything outside that choice is the environment. Interactions across the boundary appear as external forces. Interactions between parts of the system are internal forces. This distinction depends on our choice; it is not a permanent label attached to a force.

A particle model replaces an extended object by a point when its size and orientation do not materially affect the question. A car traveling along a road can often be modeled this way for its travel time. The same model cannot predict whether the car tips over: that requires its geometry and distribution of mass. A useful model discards details for a stated purpose.

Position is always position relative to a coordinate frame. An **inertial frame** is one in which an isolated particle moves with constant velocity. In a classroom, a frame fixed to the floor is often a sufficiently good approximation. Earth's rotation produces small corrections that matter in long-range trajectories, weather, and precision experiments. Calling the laboratory inertial is therefore a modeling decision, not an exact statement about the planet.

Newton's first law identifies the privileged frames: without a net external force, velocity remains constant. Constant velocity includes rest. The law does not say that motion requires a continuing push. A rolling cart slows because of interactions such as bearing friction and air resistance, not because motion naturally runs out. Nor can a single experiment distinguish rest from uniform straight-line motion relative to another inertial frame.

Choose axes before assigning signs. For a cart moving along a horizontal track, let positive $x$ point right. A leftward velocity is then negative. A leftward acceleration is also negative, but these statements mean different things: negative velocity describes the present direction of motion; negative acceleration describes how velocity changes. A right-moving cart can have a leftward acceleration and slow down. After reversing, the same leftward acceleration makes its leftward speed increase.

## What the second and third laws actually say

For a particle of constant mass $m$, Newton's second law is

$$\sum \mathbf F_{\mathrm{ext}}=m\mathbf a=m\frac{d\mathbf v}{dt}.$$

The summation sign means add all external force vectors. Mass measures inertia: for the same net force, a larger mass changes its velocity more slowly. In SI, mass is measured in kilograms and acceleration in meters per second squared. The derived unit of force is the newton:

$$1\,\mathrm N=1\,\mathrm{kg\,m\,s^{-2}}.$$

The equation is a relation between quantities, not a recipe for drawing arrows. It becomes predictive only after the forces have been identified and their dependence on position, velocity, or time specified. For example, a spring model supplies $F_x=-kx$, with $k>0$ and $x$ measured from equilibrium. Newton's law then gives $m\ddot x=-kx$. A dot over a variable denotes a derivative with respect to time; two dots denote the second derivative.

The force laws and Newton's dynamical law play different roles. Newton's law does not tell us that springs are linear or that friction has a constant coefficient. Those are additional models whose accuracy must be investigated. Combining an accurate dynamical framework with an inaccurate force model can still produce a poor prediction.

The more general momentum statement is $\mathbf F_{\rm ext}=d\mathbf p/dt$ for a suitable closed system. In this chapter $\mathbf p=m\mathbf v$ and mass is constant, so it reduces to the displayed equation. Do not apply $d(m\mathbf v)/dt$ to a rocket while ignoring the momentum carried across the chosen boundary by the exhaust. Chapter 05 explains that bookkeeping.

Newton's third law concerns a pair of interacting objects. If object A exerts a force on B, B exerts an equal and opposite force on A:

$$\mathbf F_{A\to B}=-\mathbf F_{B\to A}.$$

These two forces act on **different objects**. They do not cancel in the equation for B alone. A book on a table experiences an upward table force and a downward gravitational force; those may balance, but they are not a third-law pair. The partner of the table's force on the book is the book's force on the table. The partner of Earth's gravitational force on the book is the book's gravitational force on Earth.

This simple pairwise statement applies to the ordinary mechanical interactions considered here. In electrodynamics, fields can carry momentum, and a particle-only instantaneous action–reaction picture need not hold. The larger conservation principle survives when the field is included. We will earn that extension in Chapter 18.

## A free-body diagram is a bookkeeping device

Draw only the forces acting **on the chosen system**. Use a dot or an outline for the object and arrows for external interactions. Label each arrow by its source. Weight is the gravitational force, usually $m\mathbf g$ near Earth's surface. A normal force is the component of a contact force perpendicular to a surface. Tension is a pulling contact force along an ideal string. Friction is a component parallel to the contact surface.

The arrows are not motion arrows. Do not add a force labeled “velocity,” “acceleration,” or “inertia” to an inertial-frame diagram. A force that keeps an object on a circular path is not automatically an extra interaction called centrifugal or centripetal force. Identify the actual source—perhaps tension or gravity—and use its radial component in the acceleration equation.

As a first numerical example, a $2.0\,\mathrm{kg}$ cart receives a $7.0\,\mathrm N$ rightward pull and a $1.0\,\mathrm N$ leftward resistance. The horizontal net force is $7.0-1.0=6.0\,\mathrm N$. Dividing by mass gives

$$a_x=\frac{6.0\,\mathrm N}{2.0\,\mathrm{kg}}=3.0\,\mathrm{m\,s^{-2}}.$$

Suppose $x(0)=1.0\,\mathrm m$ and $v_x(0)=-2.0\,\mathrm{m\,s^{-1}}$. Constant acceleration gives $v_x(t)=-2.0+3.0t$ in SI and $x(t)=1.0-2.0t+1.5t^2$. At $t=1.0\,\mathrm s$, the cart is at $0.50\,\mathrm m$ and moving right at $1.0\,\mathrm{m\,s^{-1}}$. It initially moved left, stopped at $2/3\,\mathrm s$, then reversed. The net force never reversed. This is a concrete reason to keep signs attached to components rather than replace velocity by speed.

Check the vertical equation too. If there is no vertical acceleration and the pull is horizontal, $N-mg=0$, so $N=mg$. This equality follows from these conditions. It is not the definition of a normal force.

## Contact, friction, and constraints

A contact surface can push but ordinarily cannot pull an unattached object toward itself. Thus its normal reaction satisfies $N\geq0$. If equations demand a negative $N$, the assumed contact has failed; the object loses contact and a new model must be used. A taut ideal string likewise pulls, so a negative calculated tension signals a mistaken assumption or a slack string.

The simple dry-friction model distinguishes two regimes. During sliding, the magnitude of kinetic friction is approximately $\mu_kN$ and its direction opposes the relative sliding velocity. For static contact, friction adjusts as needed within

$$|f_s|\leq\mu_sN.$$

Static friction is not always $\mu_sN$. The equality describes the threshold of impending slip. A $10\,\mathrm N$ horizontal push on a stationary box may be balanced by $10\,\mathrm N$ static friction even if the maximum available friction is $30\,\mathrm N$. A friction coefficient is dimensionless. The model is empirical and approximate; real contact depends on surface history, speed, temperature, deformation, and other details.

Consider a block on a plane inclined at angle $\theta$ above horizontal. Choose positive $s$ downhill and positive $n$ perpendicular outward. Resolving weight gives a downhill component $mg\sin\theta$ and an inward normal component $mg\cos\theta$. The block has no normal acceleration while it remains on a straight plane, so

$$N=mg\cos\theta.$$

If the block slides downhill, friction is uphill. The tangential equation becomes

$$ma_s=mg\sin\theta-\mu_kmg\cos\theta,$$

and therefore $a_s=g(\sin\theta-\mu_k\cos\theta)$. The mass cancels because both the gravitational and modeled friction forces scale with mass. This cancellation would not survive an additional drag force that scaled differently.

For $\theta=30^\circ$, $\mu_k=0.20$, and $g=9.81\,\mathrm{m\,s^{-2}}$, use $\sin30^\circ=0.5$ and $\cos30^\circ\approx0.8660$. Then

$$a_s=9.81(0.5000-0.1732)\approx3.21\,\mathrm{m\,s^{-2}}.$$

For a block initially at rest, however, first ask whether static friction can hold it. The required magnitude is $mg\sin\theta$, while the maximum is $\mu_smg\cos\theta$. Static equilibrium is possible when $\tan\theta\leq\mu_s$. This result follows by dividing by the positive quantity $mg\cos\theta$ for $0\leq\theta<90^\circ$. If $\mu_s=0.60$, a $30^\circ$ incline can hold because $\tan30^\circ\approx0.577<0.60$. In that case using the kinetic formula from rest would describe the wrong regime.

## Connected systems: the acceleration constraint comes first

Two masses hang from a light inextensible string passing over an ideal pulley. Let $m_2>m_1$. Choose positive upward for mass 1 and positive downward for mass 2, so the same positive number $a$ describes both accelerations. The equality of acceleration magnitudes follows from constant string length. It is a geometric constraint, not a consequence of equal forces.

An ideal massless string and frictionless, massless pulley give a common tension $T$. Writing separate equations yields

$$T-m_1g=m_1a,\qquad m_2g-T=m_2a.$$

Add them to eliminate the internal string force:

$$a=g\frac{m_2-m_1}{m_1+m_2}.$$

Substitute into the first equation to recover $T=m_1(g+a)$. For $m_1=2.0\,\mathrm{kg}$ and $m_2=3.0\,\mathrm{kg}$, $a=9.81/5=1.962\,\mathrm{m\,s^{-2}}$ and $T=2.0(9.81+1.962)=23.544\,\mathrm N$. Tension lies between the two weights, as expected: it must accelerate the lighter object upward while allowing the heavier object to accelerate downward.

Several limits test the result. Equal masses give $a=0$ and $T=mg$. If $m_1$ approaches zero while $m_2$ stays fixed, $a$ approaches $g$ and $T$ approaches zero. If the pulley has rotational inertia, the two tensions are generally unequal, and Chapter 06 supplies the missing rotation equation. Calling every pulley “ideal” without checking the physical apparatus hides the assumption that makes this calculation possible.

The same bookkeeping helps a person on a scale in an elevator. Choose upward positive. If the person accelerates upward at $a$, then $N-mg=ma$, so $N=m(g+a)$. The scale measures the contact force $N$, not gravitational mass directly. For downward acceleration of magnitude $a_d$, $N=m(g-a_d)$. In free fall $a_d=g$ and $N=0$ even though the gravitational force remains $mg$.

## What an ordinary differential equation asks us to find

The expression $\dot v=a$ can describe a constant $a$, but a real force may depend on the changing state. For a falling particle with drag proportional to velocity, choose downward positive and use

$$m\dot v=mg-bv,\qquad b>0.$$

The unknown is the entire function $v(t)$. The coefficient $b$ has units $\mathrm{kg\,s^{-1}}$ because $bv$ must be a force. A useful scale appears by dividing mass by $b$:

$$\tau=\frac{m}{b}.$$

Its units are seconds. It will measure the time over which the velocity approaches its long-time value. Setting $\dot v=0$ gives the equilibrium or terminal velocity $v_\infty=mg/b=g\tau$. That is a prediction about a steady state, not yet a solution for the approach to it.

Let $u=v-v_\infty$. Because $v_\infty$ is constant, $\dot u=\dot v$. Substituting and using $bv_\infty=mg$ gives

$$\dot u=-\frac{u}{\tau}.$$

To solve it, we need the exponential function. Define $e^z$ as the function equal to one at $z=0$ whose derivative equals itself. Its power series is $e^z=1+z+z^2/2!+\cdots$, where $n!$ means $1\cdot2\cdots n$ and $0!=1$. The chain rule shows that $d(e^{-t/\tau})/dt=-e^{-t/\tau}/\tau$. Thus

$$u(t)=u(0)e^{-t/\tau},\qquad
v(t)=v_\infty+(v_0-v_\infty)e^{-t/\tau}.$$

You can verify the solution by differentiating it and substituting, without trusting a memorized formula. An initial condition such as $v(0)=v_0$ chooses one member of the solution family. Without it, the force law does not distinguish all possible motions.

For a particle released from rest at $y(0)=0$, integration gives

$$y(t)=v_\infty\left[t-\tau(1-e^{-t/\tau})\right].$$

Differentiate the position to check that it returns the velocity. At short times, $e^{-t/\tau}=1-t/\tau+t^2/(2\tau^2)-\cdots$. Inserting this expansion yields $y\approx\tfrac12gt^2$ because the first-order terms cancel. At long times, $e^{-t/\tau}$ approaches zero and the motion becomes almost uniform at terminal speed. Both limits connect the new model to simpler physical pictures.

## A complete drag example and the limits of separation

Take $m=0.20\,\mathrm{kg}$ and $b=0.10\,\mathrm{kg\,s^{-1}}$. Then $\tau=2.0\,\mathrm s$ and $v_\infty=19.62\,\mathrm{m\,s^{-1}}$. After one time constant, a release from rest gives

$$v(2)=19.62(1-e^{-1})\approx12.40\,\mathrm{m\,s^{-1}},$$

$$y(2)=19.62[2-2(1-e^{-1})]\approx14.44\,\mathrm m.$$

Without drag, the predictions would be $19.62\,\mathrm{m\,s^{-1}}$ and $19.62\,\mathrm m$. Drag reduces both, as the force direction requires. After $3\tau$, the remaining difference from terminal velocity is $e^{-3}\approx0.0498$, about five percent of its initial difference. The approach is asymptotic: the mathematical solution never reaches exactly $v_\infty$ in finite time.

Another solution method starts from $du/u=-dt/\tau$ and integrates to $\ln|u|=-t/\tau+C$. Here $\ln$ is the inverse of the positive exponential: $\ln(e^z)=z$. Differentiating that inverse gives $d\ln|u|/du=1/u$ for $u\ne0$. Exponentiation recovers $u=Ae^{-t/\tau}$, with either sign allowed for $A$.

Dividing by $u$ temporarily excludes the equilibrium solution $u=0$. Always check any value by which you divide. The equilibrium is valid and must be restored. This small mathematical issue has a physical interpretation: a particle initially at terminal velocity remains there. The exponential solution with $A=0$ includes it, whereas an intermediate logarithm does not.

Linear drag is a useful low-speed, appropriate-flow model, not a universal law for falling objects. A common higher-speed model has drag magnitude $c_dv^2$ opposing velocity. In one dimension its signed form is $-c_d|v|v$, not $-c_dv^2$ for both directions. The absolute value ensures resistance reverses direction when the particle does. Its terminal speed for downward falling is $\sqrt{mg/c_d}$. We need not solve that model to recognize that the physics and the speed scale have changed.

## Circular motion: changing direction is acceleration

A particle can have constant speed and changing velocity. In uniform circular motion of radius $R$, write

$$\mathbf r(t)=R\cos(\omega t)\,\hat{\mathbf x}
+R\sin(\omega t)\,\hat{\mathbf y}.$$

Differentiating twice gives $\mathbf a=-\omega^2\mathbf r$. The acceleration points toward the center. Since the speed is $v=\omega R$, its magnitude is $v^2/R$. This is a kinematic result. The dynamical question is which interaction provides the required inward force $mv^2/R$.

For a mass whirled on a horizontal frictionless table by a string, tension supplies that force, so $T=mv^2/R$. If $m=0.50\,\mathrm{kg}$, $v=4.0\,\mathrm{m\,s^{-1}}$, and $R=0.80\,\mathrm m$, then $T=10\,\mathrm N$. Cutting the string removes the inward force. The particle initially travels tangent to the circle, not radially outward: its velocity at the cut is tangent, and no force instantly changes that velocity.

For motion around a vertical circle, the radial component of weight varies around the path, and the speed may vary too. At the top, inward is downward. The radial equation is $T+mg=mv^2/R$. Requiring a taut string, $T\geq0$, gives $v^2\geq gR$ at that point. This is only a local contact condition; determining whether a release elsewhere reaches the top also requires an energy calculation. Chapter 05 supplies it.

## When an accelerating frame is convenient

Suppose the laboratory coordinates and a translating frame satisfy $\mathbf r=\mathbf r'+\mathbf R(t)$. Differentiating twice gives $\mathbf a=\mathbf a'+\ddot{\mathbf R}$. Substitution into Newton's law yields

$$m\mathbf a'=\sum\mathbf F_{\rm real}-m\ddot{\mathbf R}.$$

The extra term is the inertial or fictitious force associated with that accelerating frame. It is not an additional interaction with a physical source. It appears because we elected to use coordinates that accelerate. A passenger in a forward-accelerating bus can describe the backward apparent force in the bus frame, or describe insufficient forward contact force to accelerate their upper body in a ground frame. Both descriptions agree when the coordinate transformation is handled consistently.

Do not mix half of one description with half of the other. If using an inertial ground frame, include only real interactions. If using the accelerating bus frame, include the coordinate correction for each modeled mass. Rotating frames require additional terms depending on angular velocity and position; the translational formula above does not cover them.

## Stepping forward when no closed formula is available

A differential equation can be solved approximately by advancing the state in small time steps. Given $x_n,v_n$ at time $t_n$, the forward Euler method uses

$$a_n=F(x_n,v_n,t_n)/m,\quad
x_{n+1}=x_n+v_n\Delta t,\quad
v_{n+1}=v_n+a_n\Delta t.$$

The subscript is a step number, not a derivative. This is an approximation because acceleration and velocity may change during the step. Reducing $\Delta t$ usually improves accuracy for a well-behaved problem, but numerical stability also matters. Chapter 27 makes these issues quantitative.

For the linear-drag example, $v_0=0$ and $\Delta t=0.10\,\mathrm s$ give $a_0=9.81\,\mathrm{m\,s^{-2}}$, then $v_1=0.981\,\mathrm{m\,s^{-1}}$. On the second step, $a_1=9.81-(0.10/0.20)(0.981)=9.3195\,\mathrm{m\,s^{-2}}$, so $v_2=1.91295\,\mathrm{m\,s^{-1}}$. The exact value at $0.20\,\mathrm s$ is $19.62(1-e^{-0.1})\approx1.867\,\mathrm{m\,s^{-1}}$. A plausible-looking result is not proof of accuracy; comparison with a known solution exposes the finite-step error.

The most useful workflow is now visible: define the system; select a frame and axes; identify interactions; write vector equations; add constraints and initial conditions; solve; check units, signs, limiting cases, and the force model's applicability. Conservation principles will soon make many problems shorter, but this force-based construction remains the place to return when a shortcut becomes confusing.

## Optional practice

1. A $3.0\,\mathrm{kg}$ cart moving right at $5.0\,\mathrm{m\,s^{-1}}$ experiences a constant $6.0\,\mathrm N$ leftward force. Find its acceleration, stopping time, and displacement before stopping. Explain why acceleration is not zero at the stop.
2. A $4.0\,\mathrm{kg}$ block rests on a horizontal floor with $\mu_s=0.50$ and $\mu_k=0.30$. A horizontal force increases slowly to $15\,\mathrm N$ and then to $25\,\mathrm N$. Find the friction at $15\,\mathrm N$, the threshold for slipping, and the acceleration while sliding under $25\,\mathrm N$.
3. Derive the acceleration and tension for an ideal pulley with masses $1.5\,\mathrm{kg}$ and $2.5\,\mathrm{kg}$. Check whether the tension lies between the weights.
4. In the linear-drag model, a particle starts at $v_0=2v_\infty$. Find $v(t)$ and the time when its excess above $v_\infty$ has fallen to ten percent of its initial excess. Does its velocity ever fall below $v_\infty$?
5. A $0.25\,\mathrm{kg}$ object moves at $3.0\,\mathrm{m\,s^{-1}}$ around a horizontal circle of radius $0.60\,\mathrm m$. Find the tension. Describe its initial motion after the string breaks.
6. A $70\,\mathrm{kg}$ person stands on a scale in an elevator accelerating downward at $2.0\,\mathrm{m\,s^{-2}}$. Find the scale force. Repeat for upward acceleration of the same magnitude.
7. Derive the Euler recurrence for linear drag and show that the velocity error relative to terminal speed is multiplied by $1-\Delta t/\tau$ at every step. Identify the step-size interval for decay of that error, and the smaller interval for a monotone approach from rest.
8. Explain why a block moving uphill on an incline has a different friction term from one sliding downhill. Write a signed acceleration formula while it moves uphill, with positive downhill. State what must be reconsidered at the instant its velocity becomes zero.

Hints and complete solutions: [hints](../solutions/04-hints.md), [solutions](../solutions/04-solutions.md). Use the [companion](../companion/index.html) to compare trajectories and numerical steps where available.

Further conceptual reading: Feynman Lectures, Volume I, Chapters 9 and 12; [Newton's laws](https://www.feynmanlectures.caltech.edu/I_09.html). The examples and teaching sequence here are original. Next we replace some detailed force calculations by conserved quantities, beginning with the work done along a path.
