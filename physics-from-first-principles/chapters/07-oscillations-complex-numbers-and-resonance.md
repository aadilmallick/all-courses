# 07. Oscillations: why the same mathematics keeps returning

A guitar string, a hanging pendulum, a building in wind, and an electrical resonator are different physical objects. Near a stable equilibrium, many of them obey nearly the same equation. The shared structure is a restoring tendency: a displacement creates a response that points back toward equilibrium. Inertia carries the system past that equilibrium, and the process repeats.

The main question is how a system responds when it is displaced, loses energy, or receives a repeated push. We will derive natural frequency, damping, phase, resonance, and normal modes. The new mathematical tool is the complex number. It is introduced because it turns the geometry of an oscillation into algebra that is easier to check, not because the physical displacement becomes imaginary.

We use Newton's law, spring potential energy, elementary derivatives, and the real exponential developed earlier. Oscillation also provides a concrete place to distinguish a model's exact solution from an approximation used to obtain the model.

## A spring makes a solvable return force

Let $x$ measure displacement from equilibrium of a mass attached to an ideal linear spring. The spring force is $-kx$ with $k>0$. Newton's law gives

$$m\ddot x=-kx,\qquad \ddot x+\omega_0^2x=0,
\qquad\omega_0=\sqrt{k/m}.$$

The ratio $k/m$ has units $\mathrm{s^{-2}}$, so $\omega_0$ is an angular frequency in radians per second. Direct differentiation verifies that both $\cos(\omega_0t)$ and $\sin(\omega_0t)$ solve the equation. Because the equation is linear, a sum of solutions is also a solution:

$$x(t)=A\cos(\omega_0t)+B\sin(\omega_0t).$$

Here linear means that the unknown function and its derivatives appear to the first power and are not multiplied by one another. It does not mean that the graph of the solution is a straight line. Substituting $t=0$ gives $A=x_0$. Differentiating and setting $t=0$ gives $B=v_0/\omega_0$. Position and velocity initial conditions determine the two constants.

An equivalent representation is $x=C\cos(\omega_0t+\phi)$. Expanding the angle sum shows $A=C\cos\phi$ and $B=-C\sin\phi$. Thus $C=\sqrt{A^2+B^2}$, while the signs of $A$ and $B$ determine the correct quadrant for $\phi$. An inverse tangent without quadrant information can give the wrong phase.

For $m=0.50\,\mathrm{kg}$ and $k=50\,\mathrm{N\,m^{-1}}$, $\omega_0=10\,\mathrm{rad\,s^{-1}}$. The ordinary frequency is $f_0=\omega_0/(2\pi)\approx1.59\,\mathrm{Hz}$ and the period is $T=2\pi/\omega_0\approx0.628\,\mathrm s$. A hertz means one cycle per second. Confusing $f$ with $\omega$ introduces a factor of $2\pi$, often twice when a frequency is squared.

If the mass begins at $x_0=0.10\,\mathrm m$ with zero velocity, $x=0.10\cos(10t)$ and $v=-1.0\sin(10t)$ in SI. At equilibrium the speed is largest, not zero. At the extreme displacements velocity is zero and restoring acceleration is largest in magnitude. Position, velocity, and acceleration therefore do not reach their extrema simultaneously.

## Energy explains the motion's geometry

The undamped oscillator has conserved energy

$$E=\frac12m\dot x^2+\frac12kx^2.$$

For amplitude $C$, this is $E=\tfrac12kC^2$. At the turning points all the modeled mechanical energy is spring potential; at equilibrium it is kinetic. Substitution of $x=C\cos(\omega_0t+\phi)$ and $v=-\omega_0C\sin(\omega_0t+\phi)$ makes the total constant because $m\omega_0^2=k$ and $\sin^2+\cos^2=1$.

A plot of velocity against position is a **phase-space** plot. Dividing the energy equation by $E$ gives

$$\frac{x^2}{C^2}+\frac{v^2}{\omega_0^2C^2}=1.$$

The trajectory is an ellipse, or a circle if velocity is rescaled by $\omega_0$. This plot records the state, unlike a position-only picture. Two points with the same $x$ but opposite $v$ lie on different sides of the ellipse and have different immediate futures.

The spring oscillator's period is independent of amplitude within the linear model. This is not true of every periodic system. A force containing a significant $-\lambda x^3$ term generally produces an amplitude-dependent period. “Simple harmonic” names a special sinusoidal motion, not every back-and-forth motion.

## Why a pendulum is only approximately harmonic

For a point mass on a light rigid-length pendulum of length $\ell$, torque about the pivot is $-mg\ell\sin\theta$ and inertia is $m\ell^2$. Hence

$$\ddot\theta+\frac{g}{\ell}\sin\theta=0.$$

This equation is nonlinear. For small angles measured in radians, the sine expansion is $\sin\theta=\theta-\theta^3/6+\cdots$. Keeping only the first term gives $\ddot\theta+(g/\ell)\theta=0$, so $\omega_0=\sqrt{g/\ell}$. The relative correction to replacing sine by angle begins at roughly $\theta^2/6$. At $0.10$ rad, about $5.7^\circ$, it is around $0.17\%$; at one radian it is no longer a small correction.

For $\ell=1.0\,\mathrm m$, the small-angle period is $2\pi\sqrt{1/9.81}\approx2.01\,\mathrm s$. The mass cancels because both gravitational torque and rotational inertia contain the same mass factor. This is a result of the ideal point-mass model, not permission to ignore a massive rod or friction at the pivot.

More generally, for an extended rigid body pivoted a distance $d$ from its center of mass, $I\ddot\theta=-Mgd\sin\theta$. In the small-angle regime the physical-pendulum period is $2\pi\sqrt{I/(Mgd)}$. The relevant inertia is about the pivot, not automatically about the center.

The energy method reveals why the large-angle period grows. Near the top of a long swing, the torque is smaller than the linear approximation predicts because $\sin\theta<\theta$ for positive $\theta$. The turning region takes longer to traverse. The exact period can be expressed by an integral, but calling the small-angle formula exact would hide the important physics before any advanced integration begins.

## Damping turns closed trajectories into inward spirals

Use a linear resistive force $-b\dot x$ with $b>0$. Then

$$m\ddot x+b\dot x+kx=0.$$

Define $\gamma=b/(2m)$ and retain $\omega_0=\sqrt{k/m}$, giving $\ddot x+2\gamma\dot x+\omega_0^2x=0$. The parameter $\gamma$ has units inverse seconds. Seek an exponential solution $x=e^{st}$ because each derivative preserves its form. Substitution gives

$$s^2+2\gamma s+\omega_0^2=0,
\qquad s=-\gamma\pm\sqrt{\gamma^2-\omega_0^2}.$$

The roots organize three regimes. When $0<\gamma<\omega_0$, define $\omega_d=\sqrt{\omega_0^2-\gamma^2}$. The real solution is

$$x(t)=e^{-\gamma t}[A\cos(\omega_dt)+B\sin(\omega_dt)].$$

It oscillates under a decaying amplitude envelope. At critical damping, $\gamma=\omega_0$, the repeated root gives $x=(A+Bt)e^{-\gamma t}$. The second independent solution needs the factor $t$; writing the same exponential twice would not supply two independently adjustable initial conditions. For overdamping, $\gamma>\omega_0$, there are two distinct negative real roots and the solution is a sum of decaying exponentials without a sustained sinusoidal oscillation.

The initial conditions for the underdamped case give $A=x_0$ and $B=(v_0+\gamma x_0)/\omega_d$. The additional $\gamma x_0$ matters because differentiating the envelope contributes to the initial velocity. Setting $B=0$ just because $v_0=0$ would be wrong when $x_0\ne0$ and damping is present.

For the earlier mass and spring with $b=2.0\,\mathrm{kg\,s^{-1}}$, $\gamma=2.0\,\mathrm{s^{-1}}$ and $\omega_d=\sqrt{96}\approx9.798\,\mathrm{rad\,s^{-1}}$. With $x_0=0.10\,\mathrm m$ and $v_0=0$, the sine coefficient is $B=0.20/9.798\approx0.0204\,\mathrm m$. The oscillation period is slightly longer than the undamped period, while the amplitude envelope falls by a factor $e^{-1}$ over $1/\gamma=0.50\,\mathrm s$.

Differentiate mechanical energy and use the equation of motion:

$$\frac{dE}{dt}=\dot x(m\ddot x+kx)=-b\dot x^2\leq0.$$

This is an exact instantaneous statement for the linear-damping model. Energy decreases even though it temporarily stops decreasing at a turning point where $v=0$. For weak damping, cycle-averaged energy decays approximately as $e^{-2\gamma t}$. The instantaneous energy is not exactly a pure exponential for arbitrary damping and phase, so distinguish an envelope or averaged law from the exact derivative above.

## Complex numbers are two real components with a useful multiplication

Define $i$ by $i^2=-1$. A complex number $z=a+ib$ packages two real numbers. Its real part is $a$, its imaginary part is $b$, and its conjugate is $z^*=a-ib$. The squared magnitude is $zz^*=a^2+b^2$, so $|z|=\sqrt{a^2+b^2}$.

Addition is componentwise. Multiplication follows ordinary distribution with $i^2=-1$:

$$ (a+ib)(c+id)=(ac-bd)+i(ad+bc).$$

To divide, multiply numerator and denominator by the denominator's conjugate. For example,

$$\frac{1}{3+4i}=\frac{3-4i}{(3+4i)(3-4i)}
=\frac{3-4i}{25}.$$

This is algebra on pairs, with a geometry: multiplication by $i$ rotates the plane by $90^\circ$ because $(a,b)$ becomes $(-b,a)$. A complex number can be written in polar form $z=\rho(\cos\phi+i\sin\phi)$ with $\rho\geq0$. Multiplication adds the angles and multiplies the magnitudes.

Euler's identity

$$e^{i\phi}=\cos\phi+i\sin\phi$$

connects this geometry to exponentials. One justification expands the convergent exponential series into even and odd powers of $i\phi$: even powers give the cosine series and odd powers give $i$ times the sine series. Another differentiates the right side and checks the same initial-value equation as the left. The exponent $\phi$ is dimensionless.

The identity makes differentiation easy: $d(e^{-i\Omega t})/dt=-i\Omega e^{-i\Omega t}$. A real sinusoid can therefore be written as the real part of a complex exponential. We will use the convention $e^{-i\Omega t}$ in the forced-oscillator calculation. The imaginary part is bookkeeping for a quadrature component, shifted by a quarter cycle. Measured displacement remains the real part of the final expression.

Complex notation works here because the equation is linear with real coefficients. Taking a real part commutes with addition, real scalar multiplication, and differentiation. For a nonlinear term such as $x^2$, replacing $x$ by a complex expression and taking the real part only at the end generally changes the problem. The tool has a reason and a limit.

## A periodic drive selects its own steady frequency

Let a force $F_0\cos(\Omega t)$ drive the damped oscillator:

$$m\ddot x+b\dot x+kx=F_0\cos(\Omega t).$$

After transients decay, seek $x_{\rm ss}=\operatorname{Re}[Xe^{-i\Omega t}]$, where $X$ is a constant complex amplitude. Replacing each derivative by multiplication by $-i\Omega$ gives

$$[k-m\Omega^2-ib\Omega]X=F_0,$$

so

$$X=\frac{F_0}{k-m\Omega^2-ib\Omega}.$$

Taking its magnitude gives the steady amplitude

$$A(\Omega)=\frac{F_0}{\sqrt{(k-m\Omega^2)^2+b^2\Omega^2}}.$$

Writing $X=Ae^{i\delta}$ yields $x_{\rm ss}=A\cos(\Omega t-\delta)$. Thus the displacement lags the force by phase $\delta$, with

$$\delta=\operatorname{atan2}(b\Omega,k-m\Omega^2).$$

The two-argument inverse tangent returns the proper quadrant. At low frequency, $\delta\approx0$ and $A\approx F_0/k$: the spring nearly follows static force balance. At $\Omega=\omega_0$, the restoring and inertial terms cancel in the complex denominator, the phase is $\pi/2$, and $A=F_0/(b\omega_0)$. At high frequency, $A\approx F_0/(m\Omega^2)$ and the displacement is almost opposite the force.

The complete motion is the steady solution plus a solution of the homogeneous damped equation. The steady solution alone generally fails the specified initial conditions. Damping erases the transient over time; it does not make the transient absent at the moment the drive begins.

## Resonance is a competition, not a mysterious extra force

The drive supplies energy with a phase relationship. Near the oscillator's natural frequency, the repeated pushes can accumulate an unusually large response before damping removes an equal average amount. For displacement amplitude, minimizing the squared denominator gives

$$\Omega_{\rm peak}=\sqrt{\omega_0^2-2\gamma^2}$$

when $\gamma<\omega_0/\sqrt2$. To verify it, write the denominator divided by $m^2$ as $(\omega_0^2-\Omega^2)^2+4\gamma^2\Omega^2$ and differentiate with respect to $\Omega$. The nonzero stationary point solves $\Omega^2=\omega_0^2-2\gamma^2$. For stronger damping the amplitude need not show a nonzero-frequency peak.

The peak of absorbed average power is a different question. For the steady motion, velocity is $-A\Omega\sin(\Omega t-\delta)$. Averaging $b\dot x^2$ over a cycle uses the average of sine squared, $1/2$, giving

$$\langle P\rangle=\frac12b\Omega^2A^2
=\frac{F_0^2b\Omega^2}{2[(k-m\Omega^2)^2+b^2\Omega^2]}.$$

For this ideal velocity-damping model with constant $F_0$, power peaks at $\Omega=\omega_0$. Do not report a single “resonance frequency” without stating what response is being measured. Frequency-dependent forcing or damping can alter these results.

For $m=0.50\,\mathrm{kg}$, $k=50\,\mathrm{N\,m^{-1}}$, $b=2.0\,\mathrm{kg\,s^{-1}}$, and $F_0=1.0\,\mathrm N$, driving at $\Omega=10\,\mathrm{rad\,s^{-1}}$ gives $A=1/(2\cdot10)=0.050\,\mathrm m$. The displacement is $0.050\sin(10t)$, since its phase lag is $\pi/2$. Velocity is $0.50\cos(10t)\,\mathrm{m\,s^{-1}}$, in phase with the force. Average input power is $\tfrac12(1.0)(0.50)=0.25\,\mathrm W$, equal to $\tfrac12b(0.50)^2=0.25\,\mathrm W$. The displacement peak occurs at $\sqrt{100-8}\approx9.59\,\mathrm{rad\,s^{-1}}$, slightly below the undamped frequency.

The quality factor for weak damping is $Q=\omega_0/(2\gamma)=m\omega_0/b$. It compares stored energy to energy lost per radian; equivalently $Q\approx2\pi E/(\text{energy lost per cycle})$ when the fractional cycle loss is small. Large $Q$ means slow decay and a narrow resonance. In our moderately damped example $Q=2.5$, so weak-damping approximations should not be treated as high-precision identities.

## Zero damping is a singular resonant limit

If $b=0$ and the drive frequency differs from $\omega_0$, a sinusoidal particular solution has amplitude $F_0/[m|\omega_0^2-\Omega^2|]$. At exact resonance the denominator vanishes, so this assumed form fails. It does not prove that a finite-time displacement becomes infinite.

For $\ddot x+\omega_0^2x=(F_0/m)\cos\omega_0t$, try a growing sinusoid. Direct differentiation verifies

$$x_p(t)=\frac{F_0}{2m\omega_0}t\sin\omega_0t.$$

Starting from rest at zero displacement, this particular solution already satisfies both initial conditions. Its envelope grows linearly with time in the ideal linear undamped model. Real systems eventually encounter damping, nonlinear behavior, finite drive capacity, or structural change. “Infinite resonance” is shorthand for the failure of a bounded steady-state ansatz, not a literal finite-time prediction.

This example illustrates the difference between limits. Taking a long-time steady state with $b>0$ and then sending $b$ to zero is not the same operation as setting $b=0$ in a finite-time initial-value problem. The distinction returns throughout physics whenever a small dissipative term controls the long-time behavior.

## Impulses and arbitrary forces build responses by addition

A short force pulse of impulse $J$ changes velocity by $J/m$ if displacement changes negligibly during the pulse. An underdamped oscillator initially at rest then responds, for $t>0$, with

$$x(t)=\frac{J}{m\omega_d}e^{-\gamma t}\sin(\omega_dt).$$

This follows from the free damped solution with $x(0)=0$ and $v(0)=J/m$. It defines a response per unit impulse,

$$h(t)=\frac{e^{-\gamma t}\sin(\omega_dt)}{m\omega_d},\qquad t\geq0.$$

Divide a general force history into small time intervals. The interval near $t'$ supplies impulse approximately $F(t')dt'$, and its later response is shifted by $t'$. Adding those responses produces

$$x(t)=x_{\rm free}(t)+\int_0^t h(t-t')F(t')\,dt'.$$

This integral is a causal convolution: only earlier forces contribute. The dimensions check: $h$ has units seconds per kilogram, so $hFdt$ has units meters. We have introduced the construction without requiring a generalized delta function. The method relies on linear superposition; a nonlinear oscillator cannot generally be assembled by adding independent pulse responses.

The formula is also practical. A measured force record can be inserted into a numerical integral to predict a model's displacement. Comparing that prediction with data tests the assumed parameters and linearity. Fitting an oscillator response does not prove that a building, instrument, or biological system remains linear outside the measured range.

## Coupled oscillators reveal normal modes

Two equal masses $m$ each attach to an outer spring of stiffness $k$ and share a middle spring of stiffness $\kappa$. Let $x_1,x_2$ be displacements from equilibrium in the same positive direction. The middle spring's extension is $x_2-x_1$. Newton's equations are

$$m\ddot x_1=-kx_1+\kappa(x_2-x_1),$$

$$m\ddot x_2=-kx_2-\kappa(x_2-x_1).$$

Add them and define $q_+=(x_1+x_2)/2$. Then $m\ddot q_+=-kq_+$, so $\omega_+=\sqrt{k/m}$. In this motion the masses move together and the coupling spring does not stretch. Subtract them and define $q_-=(x_1-x_2)/2$. Then $m\ddot q_-=-(k+2\kappa)q_-$, so $\omega_-=\sqrt{(k+2\kappa)/m}$. In this motion they move oppositely and the coupling spring contributes a stronger restoring force.

These are **normal modes**: coordinated patterns that oscillate independently at one frequency in the linear model. General motion is a superposition because $x_1=q_++q_-$ and $x_2=q_+-q_-$. This is a first example of choosing coordinates that uncouple equations, a strategy later generalized by linear algebra.

For weak coupling, the two frequencies are close. If initially only one mass is displaced, each mass's motion contains both frequencies. The identity

$$\cos\omega_+t+\cos\omega_-t
=2\cos\left(\frac{\omega_--\omega_+}{2}t\right)
\cos\left(\frac{\omega_-+\omega_+}{2}t\right)$$

shows a fast oscillation with a slowly changing amplitude: beats. Energy moves between masses while the total remains constant in the ideal undamped system. A mass being briefly at rest does not imply that the entire system has lost its energy. The extension to many coupled masses becomes the wave equation in the next chapter.

## Optional practice

1. A $0.20\,\mathrm{kg}$ mass on a $20\,\mathrm{N\,m^{-1}}$ spring begins at $x_0=0.030\,\mathrm m$, $v_0=0.40\,\mathrm{m\,s^{-1}}$. Find its motion, amplitude, and energy.
2. Derive the small-angle period of a uniform rod of length $L$ pivoted at one end. State which two approximations enter the pendulum model.
3. For $m=1.0\,\mathrm{kg}$, $k=25\,\mathrm{N\,m^{-1}}$, find the critical damping coefficient. Classify $b=2$, $10$, and $14\,\mathrm{kg\,s^{-1}}$.
4. Compute $(2+3i)(1-2i)$, $|3-4i|$, and $1/(1-i)$. Explain geometrically what multiplying by $i$ does.
5. A driven oscillator has $m=1.0\,\mathrm{kg}$, $k=100\,\mathrm{N\,m^{-1}}$, $b=1.0\,\mathrm{kg\,s^{-1}}$, $F_0=2.0\,\mathrm N$. Find its steady amplitude, lag, and average absorbed power at $\Omega=10\,\mathrm{rad\,s^{-1}}$.
6. Verify by differentiation the exact undamped resonant solution $x=(F_0/2m\omega_0)t\sin\omega_0t$. Explain why a time-independent amplitude fails.
7. Derive the normal frequencies for the two-mass system and show that the in-phase frequency does not depend on the middle spring stiffness.
8. For an undamped oscillator with $x(0)=v(0)=0$, use the impulse-response integral to derive the displacement caused by a constant force switched on at $t=0$. Interpret the oscillation around the new equilibrium.

Hints and complete solutions: [hints](../solutions/07-hints.md), [solutions](../solutions/07-solutions.md). Compare parameter changes in the [companion](../companion/index.html) where the corresponding experiment is listed.

Further conceptual reading: Feynman Lectures, Volume I, Chapters 21–25; [resonance](https://www.feynmanlectures.caltech.edu/I_23.html). Next, normal modes become waves and Fourier analysis explains how complicated signals are assembled from simple oscillations.
