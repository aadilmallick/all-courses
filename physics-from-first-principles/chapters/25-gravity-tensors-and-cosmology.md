# 25. Gravity, tensors and the expanding universe

An astronaut in a freely falling laboratory can feel weightless while remaining close to Earth. Two freely falling objects separated across that laboratory can nevertheless accelerate relative to one another. The first observation suggests that a gravitational field can be removed locally by choosing a falling frame. The second tells us that gravity cannot always be removed throughout an extended region. General relativity turns that distinction into geometry.

Our goal is to calculate with the simplest parts of that geometry: proper time, coordinate changes, geodesics, weak gravitational fields, black-hole exteriors and homogeneous expanding universes. We will introduce tensors because coordinate-independent laws need them, not because more indices automatically mean deeper physics. This chapter is a worked introduction to general relativity and cosmology. It does not replace a full course in differential geometry, nonlinear field equations or relativistic astrophysics.

We assume special relativity from Chapter 10, derivatives and integrals, and the elementary variational ideas of Chapter 11. New geometric definitions are built locally. We use metric signature $(-,+,+,+)$ and coordinates $x^0=ct,x^1=x,x^2=y,x^3=z$ when convenient. Stating the signature matters: signs in formulas copied from the opposite convention can differ while describing the same physics.

## An interval measures clocks and rulers

In inertial Cartesian coordinates of flat spacetime,

$$ds^2=-c^2dt^2+dx^2+dy^2+dz^2.$$

For a timelike path followed by a clock, its proper time satisfies $d\tau^2=-ds^2/c^2$. If its ordinary speed is $v$, this gives $d\tau=dt\sqrt{1-v^2/c^2}$. Proper time is what the moving clock accumulates along its own path. Coordinate time is a label used to compare events across a chosen chart.

The general expression is

$$ds^2=g_{\mu\nu}(x)dx^\mu dx^\nu.$$

Repeated upper and lower indices are summed over $0,1,2,3$. This is Einstein summation notation. For example, $A_\mu B^\mu$ means $A_0B^0+A_1B^1+A_2B^2+A_3B^3$. The symmetric matrix $g_{\mu\nu}$ is the metric. It specifies local interval measurements and can vary with position. An inverse matrix $g^{\mu\nu}$ satisfies $g^{\mu\alpha}g_{\alpha\nu}=\delta^\mu{}_{\nu}$.

The metric is not merely an arbitrary measure of distance imposed after doing the physics. In general relativity its geometry is dynamical and couples to matter. But before studying that coupling, we must separate two sources of complicated metric coefficients: genuine curvature and a complicated coordinate choice in flat space.

## Coordinate components are not the object itself

In an ordinary plane, a displacement has the same geometric meaning whether written in Cartesian or polar coordinates. The Cartesian metric is $d\ell^2=dx^2+dy^2$. With $x=r\cos\theta$, $y=r\sin\theta$, differentiating gives

$$d\ell^2=dr^2+r^2d\theta^2.$$

The coefficient $r^2$ varies with position even though the plane is flat. Therefore a position-dependent metric is not by itself proof of curvature. Curvature measures an obstruction to removing the geometric effects over a region, rather than the presence of inconvenient coordinates.

A vector's components transform like coordinate displacements:

$$V'^\mu=\frac{\partial x'^\mu}{\partial x^\nu}V^\nu.$$

A covector transforms with the inverse Jacobian. The gradient of a scalar is an example: by the chain rule,

$$\partial'_\mu f=\frac{\partial x^\nu}{\partial x'^\mu}\partial_\nu f.$$

These opposite transformation laws ensure that the contraction $V^\mu\partial_\mu f$ is coordinate independent. A tensor is an object whose components transform with one such factor for each index, upper or lower. This definition states how the representation changes; it is not a synonym for any array of numbers.

The metric lowers an index: $V_\mu=g_{\mu\nu}V^\nu$. In Cartesian Euclidean coordinates, raising or lowering often changes nothing numerically, making the distinction easy to overlook. In spacetime, even flat spacetime, the time component changes sign with our convention. In polar coordinates, angular components also acquire factors of $r^2$. Index positions encode real transformation information.

## Why ordinary derivatives need correction

Comparing vector components at nearby points requires accounting for changes in the coordinate basis. In polar coordinates, the radial unit direction rotates as the angle changes. Differentiating only the numeric components would miss that rotation. A covariant derivative includes a connection that accounts for the changing basis:

$$\nabla_\mu V^\nu=\partial_\mu V^\nu+
\Gamma^\nu{}_{\mu\lambda}V^\lambda.$$

For a covector, the connection term has the opposite sign:

$$\nabla_\mu W_\nu=\partial_\mu W_\nu-
\Gamma^\lambda{}_{\mu\nu}W_\lambda.$$

For the metric-compatible, torsion-free connection used in general relativity, the Christoffel symbols are

$$\Gamma^\rho{}_{\mu\nu}=\frac12g^{\rho\sigma}
\left(\partial_\mu g_{\sigma\nu}+\partial_\nu g_{\sigma\mu}
-\partial_\sigma g_{\mu\nu}\right).$$

The symbols themselves are not tensor components; their transformation law includes extra terms that make the full covariant derivative a tensor. They can be nonzero in a flat plane. This is why a nonzero Christoffel symbol is not automatically a measurable gravitational field.

For the polar plane, $g_{rr}=1$, $g_{\theta\theta}=r^2$. Its inverse entries are $1,r^{-2}$. The only derivative needed is $\partial_rg_{\theta\theta}=2r$. Substitution gives

$$\Gamma^r{}_{\theta\theta}=-r,\qquad
\Gamma^\theta{}_{r\theta}=\Gamma^\theta{}_{\theta r}=\frac1r.$$

The apparent singularity at $r=0$ reflects the failure of polar angle as a unique coordinate there. The plane has no physical singularity at its origin. A good diagnostic is to ask whether a different regular chart removes a supposed problem.

## Geodesics are locally unaccelerated paths

A freely moving massive test body follows a timelike geodesic when nongravitational forces and effects of its own finite size are negligible. In an affine parameter such as proper time, the equation is

$$\frac{d^2x^\rho}{d\tau^2}+
\Gamma^\rho{}_{\mu\nu}\frac{dx^\mu}{d\tau}\frac{dx^\nu}{d\tau}=0.$$

One derivation varies the action proportional to proper time, or an equivalent quadratic metric action with an affine parameter. Applying the Euler-Lagrange equation to $L=g_{\mu\nu}\dot x^\mu\dot x^\nu/2$, then multiplying by the inverse metric, produces the Christoffel combination above. The result says the tangent vector is parallel transported along the path: its covariant acceleration vanishes.

In the polar plane, a geodesic with parameter $s$ satisfies

$$\ddot r-r\dot\theta^2=0,\qquad
\ddot\theta+\frac{2\dot r\dot\theta}{r}=0.$$

These are the radial and angular equations for a straight line written in polar coordinates. A path with constant $r$ and nonzero $\dot\theta$ does not satisfy the first equation: motion around a circle requires acceleration. Nonzero coordinate acceleration can also occur on a straight physical path because the coordinates curve. Always distinguish a coordinate second derivative from covariant acceleration measured by an accelerometer.

Light follows null geodesics, with $ds^2=0$; proper time cannot parameterize such a path because it vanishes. Another affine parameter is used. The massless case therefore shares the geometric path principle while requiring a different parameter convention.

## Equivalence has a local domain

At any ordinary spacetime event, one can choose freely falling coordinates in which the metric is Minkowskian and its first derivatives vanish at that event. Locally this removes connection effects. It does not generally remove second-derivative curvature effects over a finite region. Two nearby freely falling paths can converge or diverge because of tidal gravity.

To see the Newtonian version, take two points separated by a small vector $\boldsymbol\xi$ in potential $\Phi$. Their relative acceleration is approximately

$$\ddot\xi_i=-\partial_i\partial_j\Phi\,\xi_j.$$

The second spatial derivatives are tidal information. A uniform gravitational acceleration can be removed by a uniformly falling frame; a varying field leaves differential effects. General relativity describes those effects through curvature. A sufficiently small laboratory can make them small, but no slogan that gravity disappears everywhere follows from local free fall.

## Curvature measures noncommuting transport

Transport a vector around a small closed loop. In a curved geometry it can return with a changed direction relative to its starting value. Algebraically, covariant derivatives need not commute. With one common convention,

$$R^\rho{}_{\sigma\mu\nu}=
\partial_\mu\Gamma^\rho{}_{\nu\sigma}
-\partial_\nu\Gamma^\rho{}_{\mu\sigma}
+\Gamma^\rho{}_{\mu\lambda}\Gamma^\lambda{}_{\nu\sigma}
-\Gamma^\rho{}_{\nu\lambda}\Gamma^\lambda{}_{\mu\sigma}.$$

Then $(\nabla_\mu\nabla_\nu-\nabla_\nu\nabla_\mu)V^\rho=R^\rho{}_{\sigma\mu\nu}V^\sigma$ for the corresponding derivative convention. Some texts reverse the Riemann sign; formulas must be translated consistently.

The polar-plane component $R^r{}_{\theta r\theta}$ illustrates cancellation. Its terms include $\partial_r\Gamma^r{}_{\theta\theta}=-1$ and $-\Gamma^r{}_{\theta\theta}\Gamma^\theta{}_{r\theta}=+1$, with the others zero. Their sum is zero. The nonzero connection did not imply nonzero curvature.

Contract the Riemann tensor to define the Ricci tensor $R_{\mu\nu}=R^\rho{}_{\mu\rho\nu}$ and scalar curvature $R=g^{\mu\nu}R_{\mu\nu}$. The Einstein tensor is $G_{\mu\nu}=R_{\mu\nu}-g_{\mu\nu}R/2$. These contractions retain particular combinations of curvature, not every component. In a vacuum exterior the Ricci tensor can vanish while full tidal curvature remains nonzero.

## Matter and curvature: the field equation

Einstein's equation is

$$G_{\mu\nu}+\Lambda g_{\mu\nu}
=\frac{8\pi G}{c^4}T_{\mu\nu}.$$

Here $T_{\mu\nu}$ is the stress-energy tensor, combining energy density, momentum density, energy flux and stress. $\Lambda$ is the cosmological constant, with units inverse length squared when coordinates have length units. The equation is a physical law supported by experiment, not a theorem obtained merely by inventing tensor notation.

For a perfect fluid at rest locally, the energy density is $\rho c^2$ if $\rho$ denotes mass-equivalent density, and spatial diagonal stresses are pressure $p$. In a general frame the compact expression is

$$T^{\mu\nu}=(\rho+p/c^2)u^\mu u^\nu+p g^{\mu\nu},$$

with $u^\mu=dx^\mu/d\tau$ and $u^\mu u_\mu=-c^2$. The pressure terms show that gravity couples to more than rest mass. The dimensions are consistent: every term has energy per volume in locally length-based coordinates.

A geometric identity gives $\nabla_\mu G^{\mu\nu}=0$. With constant $\Lambda$ and metric compatibility, Einstein's equation implies $\nabla_\mu T^{\mu\nu}=0$. This is local stress-energy conservation. In a general time-dependent curved spacetime, it need not provide a single globally conserved energy defined as in static Newtonian mechanics. A global conservation law requires appropriate symmetry and boundary conditions.

## Recovering Newton's theory where it works

For a weak static field and slow particles, write

$$g_{00}\approx-\left(1+\frac{2\Phi}{c^2}\right),\qquad
|\Phi|/c^2\ll1.$$

To leading order, $\Gamma^i{}_{00}\approx\partial_i\Phi/c^2$. The time components of a slow particle's four-velocity dominate, so the geodesic equation reduces to

$$\frac{d^2x^i}{dt^2}\approx-c^2\Gamma^i{}_{00}
=-\partial_i\Phi.$$

The weak-field field equation similarly reduces to Poisson's equation $\nabla^2\Phi=4\pi G\rho$ for nonrelativistic matter and the appropriate boundary conditions. The coefficient $8\pi G/c^4$ is chosen to recover this limit consistently. This is a correspondence check, not a derivation of all nonlinear general relativity from Newtonian gravity.

For a clock held fixed in a static weak field, $d\tau\approx(1+\Phi/c^2)dt$. A higher potential gives a greater proper-time rate relative to the same static coordinate time. Two stationary clocks separated vertically by a small height $h$ near Earth have fractional rate difference approximately $gh/c^2$. With $h=1000\,\mathrm m$, $g=9.81\,\mathrm{m/s^2}$ and $c=2.998\times10^8\,\mathrm{m/s}$, the fraction is about $1.09\times10^{-13}$, accumulating about $9.43\,\mathrm{ns}$ in one day if other effects are absent.

The comparison presumes stationary clocks in a specified field. A satellite also moves, requiring special-relativistic time dilation and an actual trajectory. Adding only an altitude correction to every moving-clock problem is insufficient.

## Schwarzschild exterior and the meaning of a horizon

Outside a nonrotating, spherically symmetric isolated body in the vacuum idealization, the Schwarzschild metric is

$$ds^2=-\left(1-\frac{r_s}{r}\right)c^2dt^2+
\left(1-\frac{r_s}{r}\right)^{-1}dr^2+r^2d\Omega^2,
\qquad r_s=\frac{2GM}{c^2}.$$

The coordinate $r$ is the areal radius: spheres have area $4\pi r^2$. It is not generally the radial proper distance, which includes the metric factor. The exterior weak-field limit gives $g_{00}\approx-(1+2\Phi/c^2)$ with $\Phi=-GM/r$, as expected.

For a solar-mass model $M=1.99\times10^{30}\,\mathrm{kg}$, $r_s\approx2.95\,\mathrm{km}$. Ordinary stars with radius much larger than $r_s$ are not black holes just because a Schwarzschild radius can be calculated for their mass. The black-hole interpretation requires the appropriate global spacetime and collapse or compact-object conditions.

The metric coefficients in these coordinates become singular at $r=r_s$, but freely falling coordinates can be regular there. A horizon is a causal boundary, not a local material wall where every invariant necessarily diverges. In the ideal Schwarzschild solution, curvature diverges at $r=0$; for example the squared Riemann invariant is $48G^2M^2/(c^4r^6)$, finite at a positive-mass horizon. Coordinate and curvature singularities must be distinguished.

For two stationary observers outside the horizon, a photon emitted at $r_e$ and received at $r_r$ obeys

$$\frac{\nu_r}{\nu_e}=
\sqrt{\frac{1-r_s/r_e}{1-r_s/r_r}}.$$

Emission deeper in the potential and reception farther out gives a smaller received frequency. The conserved quantity associated with static time symmetry is not the same numerical energy measured by every local observer. Stating the observer is part of stating an energy measurement in relativity.

## Orbits, light and gravitational waves

The Schwarzschild orbit equation for a massive test body can be written approximately in terms of $u=1/r$ as

$$\frac{d^2u}{d\varphi^2}+u=\frac{GM}{h^2}+
\frac{3GM}{c^2}u^2,$$

where $h$ is the specific angular-momentum constant in the standard weak-field orbit convention. The final term perturbs the Newtonian closed ellipse. Treating it to leading order gives periapsis advance per orbit

$$\Delta\varphi\approx\frac{6\pi GM}{a(1-e^2)c^2}.$$

The denominator makes the correction small for a wide weak-field orbit, and it grows for compact eccentric orbits. The formula is not accurate arbitrarily close to the strong-field separatrix; it belongs to a leading weak-field expansion.

Light passing a weak isolated spherical mass with impact parameter $b$ is deflected by approximately $4GM/(bc^2)$. Both the temporal and spatial parts of the weak metric contribute. A naive Newtonian corpuscle calculation can produce half the result because it omits spatial curvature. This is an example where matching slow massive-particle motion does not guarantee the correct light propagation.

Small disturbances around flat spacetime can carry gravitational radiation. After gauge choices and in an appropriate weak-wave regime, two transverse tensor polarizations describe the observable strain. Passing waves change the relative motion or proper separation of freely falling test masses. Strain is a fractional effect, roughly $\Delta L/L$ in a suitable detector configuration, not an absolute displacement independent of detector geometry. A local coordinate change can simplify a metric perturbation but cannot remove a genuine extended tidal signal.

## Homogeneity reduces cosmology to a scale factor

On sufficiently large scales, a useful background model assumes spatial homogeneity and isotropy. Its metric can be written

$$ds^2=-c^2dt^2+a(t)^2\left[
\frac{d\chi^2}{1-k\chi^2}+\chi^2d\Omega^2\right].$$

Here we choose dimensionless scale factor $a(t)$, coordinate $\chi$ with units length, and curvature parameter $k$ with units inverse length squared. Other textbooks choose dimensionless spatial coordinates and a scale factor with length units. Both work if the dimensions are carried consistently.

Observers at fixed spatial coordinates are comoving with this idealized background. Nearby comoving proper separations scale as $a(t)$. The expansion rate is

$$H(t)=\frac{\dot a}{a}.$$

This does not say that bound atoms or planetary systems automatically expand with the scale factor. Their dynamics is dominated by local interactions and geometry rather than by simply imposing comoving motion on every constituent. Nor does expansion require a special center within the homogeneous spatial geometry.

For a perfect-fluid source, Einstein's equation gives the Friedmann equations. A useful pair is

$$H^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2}+\frac{\Lambda c^2}{3},$$
$$\frac{\ddot a}{a}=-\frac{4\pi G}{3}
\left(\rho+\frac{3p}{c^2}\right)+\frac{\Lambda c^2}{3}.$$

The local conservation equation becomes

$$\dot\rho+3H\left(\rho+\frac p{c^2}\right)=0.$$

These equations assume the homogeneous-isotropic background, a specified stress-energy model and general relativity. They do not by themselves determine the material content, its equation of state or the initial conditions.

## Matter, radiation and vacuum scale differently

Write an equation of state $p=w\rho c^2$ with constant $w$ for a simple component. Dividing the continuity equation by $\rho$ and using $H=\dot a/a$ gives

$$\frac{d\rho}{\rho}=-3(1+w)\frac{da}{a},\qquad
\rho\propto a^{-3(1+w)}.$$

Nonrelativistic matter has $w\approx0$, so density scales as $a^{-3}$: particle number in a comoving volume is conserved while the volume grows. Radiation has $w=1/3$, so density scales as $a^{-4}$: volume dilution contributes three powers and photon redshift contributes another. Vacuum energy has $w=-1$ in the cosmological-constant model, so its density stays constant while the comoving volume grows. The negative pressure term is essential to its conservation equation; applying dust intuition to it gives a false contradiction.

For a flat universe with $\Lambda=0$ and one constant-$w$ component, $H^2\propto a^{-3(1+w)}$. Thus $\dot a\propto a^{1-3(1+w)/2}$. Integrating for $w\ne-1$ gives

$$a(t)\propto t^{2/[3(1+w)]}$$

after choosing the idealized origin of cosmic time. Matter gives $a\propto t^{2/3}$ and radiation gives $a\propto t^{1/2}$. A positive constant vacuum density instead gives nearly constant $H$ and exponential growth. Real expansion histories combine components, so one power law cannot describe every epoch.

## Redshift and distances

For freely propagating light in the homogeneous background,

$$1+z=\frac{a(t_r)}{a(t_e)}.$$

Successive wave crests stretch with the scale factor. This cosmological redshift is most naturally a comparison across an expanding geometry; at small nearby separations it connects to an ordinary recession-velocity description. A unique global special-relativistic velocity for every distant source is not required.

For radial light in a flat background, $ds^2=0$ implies $d\chi=c\,dt/a(t)$ in magnitude. The comoving distance to emission is therefore

$$\chi=\int_{t_e}^{t_r}\frac{c\,dt}{a(t)}.$$

The distance depends on the expansion history. The observed flux from a source also includes photon-energy redshift and arrival-rate time dilation. In the flat model the luminosity distance is $d_L=(1+z)a(t_r)\chi$. Distances defined by angular size, flux and present proper separation need not be equal. A numerical cosmology answer must state which distance is requested.

The critical density is $\rho_c=3H^2/(8\pi G)$. For an illustrative value $H=70\,\mathrm{km\,s^{-1}\,Mpc^{-1}}$, with $1\,\mathrm{Mpc}=3.086\times10^{22}\,\mathrm m$, we obtain $H\approx2.27\times10^{-18}\,\mathrm{s}^{-1}$ and $\rho_c\approx9.2\times10^{-27}\,\mathrm{kg/m^3}$. This is a chosen calculation value, not a claim about a unique current measurement. The inverse $H^{-1}$ is about $14.0$ billion years, called a Hubble time. It is not generally the age of the universe; in the ideal matter-only flat model the age is $2/(3H)$.

## What the background model leaves open

The expanding-background equations are a framework for comparing hypotheses with observations. Dark matter denotes matter-like gravitational behavior not explained by the visible luminous components in a model; it does not identify a known particle species by definition. A cosmological constant is one possible model of accelerated expansion. Initial-condition questions, early-universe mechanisms and the detailed origin of structures require additional theory and evidence.

We have not derived a unique origin of the universe from the Friedmann equation. Extrapolating a classical solution to a singular boundary signals that the model reaches an extreme regime; it does not prove that the mathematics is a complete description of that regime. A careful physicist can calculate a model's consequences while keeping its assumptions visible.

## Optional practice

1. Starting from $x=r\cos\theta,y=r\sin\theta$, derive the polar metric and compute its two distinct nonzero Christoffel-symbol forms.
2. Verify explicitly that $R^r{}_{\theta r\theta}=0$ for the polar plane using the stated curvature convention.
3. Calculate the weak-field clock-rate difference for stationary clocks separated by $100\,\mathrm m$ near Earth and the accumulated difference in one day.
4. A nonrotating black-hole model has mass ten times the solar-mass example. Find its Schwarzschild radius and explain why curvature at its horizon is finite in the ideal solution.
5. In a Schwarzschild exterior, a photon is emitted by a stationary observer at $r_e=4r_s$ and received at infinity. Find the received-to-emitted frequency ratio.
6. Derive the density scaling for a component with constant $w=1/3$ and the corresponding flat single-component scale-factor power law.
7. If the scale factor doubles between emission and reception, find redshift and the factor by which a freely propagating photon's energy changes.
8. For a flat matter-only model with present rate $H_0$, derive its age $2/(3H_0)$. Explain why this answer cannot be used unchanged for a matter-plus-vacuum model.

[Hints](../solutions/25-hints.md) and [solutions](../solutions/25-solutions.md) are separate. The [companion](../companion/index.html) supports model exploration; inspect the density convention and units before comparing any cosmological calculator with these equations.

## References and further study

Feynman Lectures, Volume I, chapters 7 and 15–17, provide the Newtonian and special-relativistic starting points. The general-relativistic development here is an extension beyond that introductory spine. University-level further study is available through [David Tong's relativity and cosmology course collection](https://www.damtp.cam.ac.uk/user/tong/concepts.html) and his [expanding-universe chapter](https://www.damtp.cam.ac.uk/user/tong/cosmo/cosmohtml/S1.html). The worked derivations above are independently presented; no claim is made that this introduction exhausts those courses.
