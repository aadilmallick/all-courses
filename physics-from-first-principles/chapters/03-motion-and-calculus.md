# 03. Motion, change and accumulation

A car covers 100 metres in ten seconds. Its average speed is ten metres per second, but that number cannot tell us whether it briefly stopped or exceeded a speed limit. We need a way to describe motion at an instant. The difficulty is that an instant has no duration, so the ordinary distance-over-time calculation cannot be applied by dividing by zero. Calculus resolves the difficulty by studying what finite-interval calculations approach as the interval shrinks.

We will build this idea from algebra and graphs, then reverse it: if the rate of motion is known, how can we reconstruct the journey? Derivatives describe local change; integrals describe accumulation. They are connected, and together they will let us turn physical laws into predictions.

## 1. Position, displacement and average velocity

Choose a fixed coordinate system and a clock. The function $x(t)$ gives a particle's position at clock time $t$. A particle here is an idealization: an object whose internal size and rotation are irrelevant to the question. For a car journey it might describe the centre of the car; it cannot describe the wheel's rotation without additional variables.

Between times $t_1$ and $t_2$, the displacement is $x(t_2)-x(t_1)$. The elapsed time is $t_2-t_1$, assumed positive. Define average velocity by

$$\bar v=\frac{x(t_2)-x(t_1)}{t_2-t_1}.$$

The bar distinguishes an interval average from an instantaneous value. If a runner moves from coordinate 5 m to 17 m in 3 s, average velocity is 4 m/s in the positive direction. If the runner first goes to 20 m and then returns to 17 m, displacement remains 12 m, but distance travelled is 18 m. Average speed is then $18/3=6$ m/s. Average speed and the magnitude of average velocity coincide only for suitable motion without directional reversals.

On a position-versus-time graph, average velocity is the slope of the straight line connecting the two observation points. Such a line is a secant. If the graph curves, different intervals generally have different slopes. A single average cannot retain all that information.

## 2. Limits describe an approach, not division by zero

Consider a model

$$x(t)=\alpha t^2,$$

where $\alpha=2\,\mathrm{m/s^2}$. At $t=3$ s the position is 18 m. To measure the rate near that time, use a small nonzero interval $h$:

$$\frac{x(t+h)-x(t)}{h}
=\frac{\alpha(t+h)^2-\alpha t^2}{h}
=\frac{2\alpha th+\alpha h^2}{h}
=2\alpha t+\alpha h.$$

We expanded the square, cancelled equal terms, then divided by $h$ while it was nonzero. At $t=3$ s, taking $h=1$ s gives 14 m/s, $h=0.1$ s gives 12.2 m/s, and $h=0.01$ s gives 12.02 m/s. As $h$ approaches zero, these slopes approach 12 m/s. Intervals ending just before 3 s approach the same value from the other side.

The notation

$$\lim_{h\to0}\frac{x(t+h)-x(t)}h=2\alpha t$$

states this approach. It does not insert $h=0$ into the original quotient. More precisely, for every desired positive output tolerance, sufficiently small nonzero input intervals make the quotient fall within that tolerance of the limit. For this example the error is $|\alpha h|$, so choosing $|h|$ smaller than the desired velocity tolerance divided by $|\alpha|$ guarantees it. This is the central logic of a limit, expressed with physically meaningful units.

A limit need not exist. The function $|t|$ has right-hand slope $+1$ and left-hand slope $-1$ at zero. The two approaches disagree, so there is no single tangent slope there. A particle model with an instantaneous reversal of velocity has a corner in its position graph; real collisions usually smooth that corner over a short time, requiring a model of the interaction.

## 3. The derivative is the instantaneous rate

Define velocity as the derivative of position:

$$v(t)=\frac{dx}{dt}=\lim_{h\to0}\frac{x(t+h)-x(t)}h.$$

The notation $dx/dt$ names a limit, though it will sometimes be manipulated like a ratio when a justified chain rule permits it. Its units are position units divided by time units. Other derivative notations are $x'(t)$ and $\dot x(t)$. A dot means a time derivative in this course.

The derivative also defines a tangent-line approximation. For a sufficiently small time increment $h$,

$$x(t+h)\approx x(t)+v(t)h.$$

For the quadratic example the omitted term is exactly $\alpha h^2$. This makes “sufficiently small” quantitative: the approximation is good when $|\alpha h^2|$ is small compared with the position accuracy required. A tangent line is local. Extending it across a long accelerating journey would discard the very curvature it approximates.

In three dimensions differentiate each component: $\mathbf v=d\mathbf r/dt$. The instantaneous speed is $|\mathbf v|$. A curved path can have constant speed with changing velocity because the direction changes. The vector language of Chapter 2 prevents us from overlooking that change.

## 4. Derivative rules with their reasons

The derivative of a constant is zero because its change over every interval is zero. The derivative of $ct$ is $c$, because its difference quotient is $ch/h=c$. Limits preserve sums and constant multiples when the relevant limits exist, so differentiate a sum term by term.

For a positive integer $n$, expand $(t+h)^n$. The term linear in $h$ is $nt^{n-1}h$ and all remaining changed terms contain at least $h^2$. After division by $h$ and passage to the limit,

$$\frac{d}{dt}t^n=nt^{n-1}.$$

This power rule extends to many real exponents on suitable domains. It must be used with those domains in mind: $\sqrt t$ requires $t\ge0$ as a real function and has an unbounded right-hand slope at zero.

Products require more than multiplying derivatives. Add and subtract $f(t+h)g(t)$ in the product difference:

$$\frac{f(t+h)g(t+h)-f(t)g(t)}h
=f(t+h)\frac{g(t+h)-g(t)}h+g(t)\frac{f(t+h)-f(t)}h.$$

For differentiable functions, $f(t+h)$ approaches $f(t)$. The product rule follows:

$$\frac{d}{dt}(fg)=fg'+gf'.$$

For $f=t^2,g=t^3$, this gives $t^2(3t^2)+t^3(2t)=5t^4$, agreeing with differentiating $t^5$. Multiplying the derivatives would give $6t^3$, which disagrees even in dimensions if these factors carry physical units.

Differentiating $g(1/g)=1$ yields $(1/g)'=-g'/g^2$ where $g\ne0$. Combining this with the product rule gives the quotient rule $(f/g)'=(f'g-fg')/g^2$. The zero-denominator exclusion survives differentiation.

For nested dependence, if $y=f(u)$ and $u=u(t)$, a small change $dt$ produces $du\approx u'(t)dt$, then $dy\approx f'(u)du$. The chain rule makes the relationship exact at the derivative level:

$$\frac{dy}{dt}=\frac{df}{du}\frac{du}{dt}.$$

Thus the derivative of $(3t+1)^2$ is $2(3t+1)\times3$. The inside function contributes the factor three. Missing this factor is a frequent error in oscillations and exponential decay.

## 5. Sine and cosine change by turning

Use radians. On a unit circle, a small angle $h$ sweeps arc length $h$. The corresponding vertical change near angle zero is $\sin h$. Geometrically, for positive small $h$, the sine is bounded by the arc and tangent lengths; these bounds imply $\sin h/h\to1$ and $(\cos h-1)/h\to0$. Negative $h$ follows by sine's odd symmetry and cosine's even symmetry.

The angle addition identity

$$\sin(\theta+h)=\sin\theta\cos h+\cos\theta\sin h$$

can be obtained by rotating a unit-circle point and projecting onto the vertical axis. Substitute it into the difference quotient and use the two limits. The result is

$$\frac{d}{d\theta}\sin\theta=\cos\theta,\qquad
\frac{d}{d\theta}\cos\theta=-\sin\theta.$$

With degrees, an extra factor $\pi/180$ would appear. The clean radian rule is one reason physics uses radians. If $x(t)=A\cos(\omega t+\phi)$, define $A$ as amplitude, $\omega$ as angular frequency in rad/s and $\phi$ as phase. The chain rule gives $v=-A\omega\sin(\omega t+\phi)$. We have not yet explained why an object should follow this motion; Chapter 7 derives it from a force law.

## 6. Acceleration and the meaning of a second derivative

Define acceleration as the rate of change of velocity:

$$a(t)=\frac{dv}{dt}=\frac{d^2x}{dt^2}.$$

The squared symbols in the final notation indicate differentiating twice; they do not mean squaring $dx/dt$. Acceleration has units m/s², meaning a velocity change in m/s per second. For $x=\alpha t^2$, velocity is $2\alpha t$ and acceleration is $2\alpha$. Our earlier choice $\alpha=2$ m/s² corresponds to acceleration 4 m/s².

Positive acceleration means velocity is becoming more positive. It does not always mean speed is increasing. A particle with velocity $-5$ m/s and acceleration $+2$ m/s² is initially slowing down. It reaches zero velocity after 2.5 s if acceleration remains constant, then moves in the positive direction with increasing speed.

The vector acceleration $d\mathbf v/dt$ includes direction change. For uniform circular motion of radius $R$, take $\mathbf r=(R\cos\omega t,R\sin\omega t)$. Differentiation gives $\mathbf v=(-R\omega\sin\omega t,R\omega\cos\omega t)$ and then $\mathbf a=-\omega^2\mathbf r$. The acceleration points inward, with magnitude $R\omega^2=v^2/R$. The speed is constant, but the velocity is not. This is a kinematic derivation; Chapter 4 asks what force produces it.

## 7. Accumulation from many small pieces

Now reverse the question. A velocity sensor records a changing velocity. How far does the object move? Divide the time interval into small pieces. Over piece $j$ of duration $\Delta t_j$, approximate displacement by $v(t_j^*)\Delta t_j$, where $t_j^*$ is a chosen sample time inside that piece. Add all the pieces:

$$\Delta x\approx\sum_{j=1}^{N}v(t_j^*)\Delta t_j.$$

The symbol $\sum$ means add the indicated terms for $j=1,2,\ldots,N$. For a well-behaved continuous velocity, the sums approach one value as the largest interval width approaches zero, independently of reasonable sample choices. Define that limit as the definite integral:

$$x(t_2)-x(t_1)=\int_{t_1}^{t_2}v(t)\,dt.$$

The integral sign is an elongated S for sum. The lower and upper labels specify the interval. The $dt$ indicates the variable whose small widths are being accumulated. A velocity-time graph offers a picture: the integral is signed area under the curve. Its units are (m/s) times s, hence m. Regions below zero contribute negative displacement.

Total distance instead accumulates speed:

$$D=\int_{t_1}^{t_2}|v(t)|\,dt.$$

If velocity changes sign, split the integral at the zero crossings or integrate the absolute value directly. Integrating velocity and taking the absolute value afterward can lose the distance travelled during a reversal.

## 8. Why differentiation reverses accumulation

Let $F(t)=\int_{t_0}^{t}f(s)\,ds$, where $f$ is continuous. The letter $s$ is a temporary integration variable; using a different letter avoids confusing the moving endpoint with the summed variable. A small endpoint change $h$ adds the thin strip $\int_t^{t+h}f(s)ds$. Divide by $h$. Since continuity makes all values in this shrinking strip approach $f(t)$, the average strip height approaches $f(t)$. Therefore $F'(t)=f(t)$.

This is one part of the fundamental theorem of calculus. Its companion says that if $G'=f$ on the interval, then

$$\int_a^b f(t)\,dt=G(b)-G(a).$$

One proof is to note that $F$ and $G$ have the same derivative, so their difference is constant; evaluate at the endpoints. The statement requires appropriate continuity or a suitable more general integration theory. We will use continuous or piecewise continuous physical models and identify jumps explicitly.

A function $G$ with derivative $f$ is an antiderivative. If one exists, adding a constant gives another because constants differentiate to zero. This is why indefinite integrals include an arbitrary constant. The definite integral between specified endpoints has a particular value and no arbitrary constant.

Reverse the power rule: for $n\ne-1$, an antiderivative of $t^n$ is $t^{n+1}/(n+1)$ on a suitable domain. Check it by differentiation. For example,

$$\int_0^3 4t\,dt=[2t^2]_0^3=18,$$

with the physical coefficients carrying the units appropriate to the original velocity. The square brackets mean evaluate the antiderivative at the upper limit and subtract its value at the lower limit.

### Changing the integration variable

The chain rule also supplies substitution for integrals. If $u=g(t)$, a small width transforms as $du=g'(t)dt$. Thus $\int_a^b f(g(t))g'(t)dt=\int_{g(a)}^{g(b)}f(u)du$, under differentiability and continuity assumptions that justify the chain rule and integral. Both the integrand and endpoints must change. For example $\int_0^1 2t(1+t^2)dt$ becomes $\int_1^2 u\,du=3/2$ after $u=1+t^2$. The old endpoints 0 and 1 would refer to the old variable and would give the wrong result. Differentiate the resulting antiderivative to check the substitution. This method will let later physical integrals use energy, radius or another convenient variable while preserving the same accumulated quantity.

## 9. Deriving constant-acceleration motion

Assume acceleration $a$ is constant over the interval starting at $t=0$. Integrating $dv/dt=a$ gives $v(t)=v_0+at$, where $v_0$ is velocity at zero. Integrating again gives

$$x(t)=x_0+v_0t+\frac12at^2.$$

The initial position $x_0$ is necessary: a rate law cannot determine an absolute position without a starting value. The factor one half appears because acceleration's contribution to velocity grows linearly from zero; its velocity-time area is a triangle, not a rectangle of height $at$ throughout the interval.

As a numerical example choose $x_0=2$ m, $v_0=3$ m/s and $a=-2$ m/s². At $t=4$ s, $v=3-8=-5$ m/s and $x=2+12-16=-2$ m. Displacement is $-4$ m. The object reverses at $t=1.5$ s, where its position is $2+4.5-2.25=4.25$ m. It travels 2.25 m forward and 6.25 m backward, for distance 8.50 m. This example makes the speed-velocity distinction measurable.

Eliminating time between $v=v_0+at$ and the position equation yields $v^2=v_0^2+2a(x-x_0)$. This relation is useful when time is not requested, but it loses the sign of velocity. Recover direction from the motion and initial conditions. It is not valid for arbitrary position-dependent acceleration merely by substituting a single value of $a$.

## 10. Falling and projectiles

Near Earth's surface, a useful approximate model has constant downward acceleration $g=9.81$ m/s² and negligible air resistance. This value is a stated local approximation, not a universal gravitational constant. Choose upward $y$ positive. Then $a_y=-g$, so

$$y(t)=y_0+v_{0y}t-\frac12gt^2.$$

For release from rest at height $H$ above the ground, set $y_0=H,v_{0y}=0$ and solve $0=H-gt^2/2$. The nonnegative arrival time is $t=\sqrt{2H/g}$. At $H=4.905$ m this is 1.000 s in the model. The negative algebraic root describes a backward extension of the same parabola, not a second future impact.

For a projectile in a vertical plane, horizontal and vertical motions share the same clock. With launch speed $u$ at angle $\theta$ above horizontal,

$$x(t)=x_0+u\cos\theta\,t,\qquad
y(t)=y_0+u\sin\theta\,t-\tfrac12gt^2.$$

If launch and landing heights are equal and $\sin\theta>0$, the nonzero flight time is $2u\sin\theta/g$. Multiplying by horizontal speed gives range $u^2\sin(2\theta)/g$. For $u=10$ m/s and $\theta=45^\circ$, the predicted time is about 1.4416 s, the range about 10.1937 m and maximum height above launch about 2.5484 m. The 45-degree maximum-range result assumes equal heights, no drag, flat local geometry and constant $g$; changing those assumptions can change the optimal angle.

## 11. Exponentials, logarithms and differential equations

A differential equation relates a function to its derivatives. We have already solved $x''=a$ with constant $a$. Another recurring equation is $y'=ky$, meaning a quantity changes at a rate proportional to its present value. Define the exponential $e^z$ as the function with derivative equal to itself and value one at zero. Its series is

$$e^z=1+z+\frac{z^2}{2!}+\frac{z^3}{3!}+\cdots,$$

where $n!=1\cdot2\cdots n$ and $0!=1$. This convergent series can be differentiated term by term on finite intervals, giving the same series again. The chain rule establishes $y=y_0e^{kt}$ as a solution. If $k<0$, it decays; if $k>0$, it grows. Because an exponential's input is dimensionless, $k$ has units reciprocal time.

The natural logarithm $\ln y$ reverses $e^z$ for positive dimensionless $y$. Thus $\ln(e^z)=z$ and $e^{\ln y}=y$. Differentiating the inverse relation gives $d(\ln y)/dy=1/y$. One can therefore define $\ln y=\int_1^y ds/s$, which also explains why it is real only for positive input in this form.

If a quantity falls to half its initial value according to $y=y_0e^{-\lambda t}$, divide by $y_0$ and take logarithms: $1/2=e^{-\lambda t}$ gives $t=\ln2/\lambda$. Only the ratio $y/y_0$ enters the logarithm. A bare expression such as $\ln(3\,\mathrm{kg})$ depends on arbitrary unit choice and requires reformulation as a dimensionless ratio. Thermodynamics will return to this point carefully.

## 12. Reliable local approximations

If derivatives exist to the needed order, a function near a point can be expanded in powers of a small increment:

$$f(t+h)=f(t)+f'(t)h+\frac12f''(t)h^2+\cdots.$$

This is a Taylor expansion. It is not always legitimate to use an infinite series globally; a finite-order expansion needs a remainder estimate in the interval of interest. For $e^h$ near zero, $1+h+h^2/2$ omits terms beginning at order $h^3$. At $h=0.1$, the approximation is 1.105, compared with $e^{0.1}\approx1.105170$, an error about 0.000170.

For a small angle in radians, $\sin\theta\approx\theta$ and $\cos\theta\approx1-\theta^2/2$. The leading sine correction is $-\theta^3/6$. At 0.1 rad, the relative error of replacing sine by its argument is about $\theta^2/6\approx0.00167$, or 0.167%. Calling an angle “small” should therefore mean small enough for a specified accuracy, not merely small-looking on a sketch.

Approximation is central to physics, but it must preserve the question's required precision. In Chapter 7, the small-angle pendulum becomes an oscillator because $\sin\theta$ can be replaced by $\theta$ within a controlled regime. At large angles the same replacement changes the predicted period appreciably.

## Optional practice

Use [03-hints](../solutions/03-hints.md) and [03-solutions](../solutions/03-solutions.md) after an independent attempt.

1. For $x(t)=(1\,\mathrm{m})+(2\,\mathrm{m/s})t+(3\,\mathrm{m/s^2})t^2$, find velocity and acceleration at 2 s.
2. Use the difference quotient, rather than a memorized rule, to differentiate $t^3$.
3. A velocity is $v(t)=4-2t$ in m/s when $t$ is in seconds, for $0\le t\le4$. Find displacement and distance travelled.
4. Derive the time and height of the apex of a projectile using $v_y=0$. Explain why this does not make its acceleration zero.
5. A decay constant is 0.20 s⁻¹. Find the half-life and the remaining fraction after 10 s.
6. Differentiate $A\cos(\omega t+\phi)$ twice. State the units of every parameter and relate the second derivative to the original function.
7. Explain why $|t|$ has no derivative at zero even though it is continuous there.
8. Derive integration by parts by integrating the product rule: $\int f g'=[fg]-\int f'g$. Use it to evaluate $\int_0^1 t e^t\,dt$.

## Reading connection

Feynman Volume I, Chapters 8 and 9 connect motion with differential equations. Chapter 22 explores algebra useful for oscillations. You now have the mathematical language required to state Newton's laws as quantitative evolution laws; the next chapter introduces the physical assumptions that select one motion from all mathematically possible functions.
