# 12. Fluids, elasticity, diffusion, and continuum models

A glass of water looks continuous even though it consists of molecules. A steel bridge also looks continuous even though its atoms occupy a lattice. Both descriptions can be useful because a small laboratory volume contains an enormous number of particles. Instead of tracking those particles, we ask how mass, velocity, pressure, temperature, and deformation vary from place to place. This chapter builds that description carefully, including the mathematics needed to say what changes when several variables are involved.

The central problem is transport: how can matter, momentum, energy, or a dissolved substance move through a region while respecting conservation? A second problem is response: how does matter deform when forces act on it? Fluid flow, heat conduction, and elastic waves will emerge as different combinations of conservation laws and material response laws. Those response laws are empirical models; conservation alone cannot tell us a material's viscosity or stiffness.

## From particles to fields

A field assigns a quantity to every position and time in a chosen region. Temperature is a scalar field: one number, such as 293 kelvin, at a point. Fluid velocity is a vector field: both speed and direction at a point. Write it as

$$\mathbf v(x,y,z,t)=v_x\hat{\mathbf x}+v_y\hat{\mathbf y}+v_z\hat{\mathbf z}.$$

A field value means an average over a small region. That region must contain enough molecules for the average to be stable, yet remain much smaller than the length over which the macroscopic field changes. In a very dilute gas, a tiny channel, or a shock front, this separation can fail. A continuum model then needs correction or replacement. Continuity of matter is an approximation, not an assertion that molecules disappear.

Density is mass divided by volume, $\rho=m/V$, measured in kilograms per cubic metre. If density varies, the mass in a sufficiently small volume $\Delta V$ is approximately $\rho\Delta V$. Dividing space into small pieces and adding their masses gives, in the limit,

$$M=\int_V\rho\,dV.$$

Here $dV$ is a small volume element and the integral accumulates contributions throughout a three-dimensional region. For uniform density this reduces to $M=\rho V$. Water near ordinary room conditions has density approximately $1000\,\mathrm{kg\,m^{-3}}$; we use that rounded value for examples, not as an exact universal constant.

The same logic defines a concentration $c$: amount of a substance per volume. We will use number concentration in particles per cubic metre, although moles per cubic metre works too if used consistently. A concentration is not a probability. It can exceed one in its stated units.

## The mathematical bridge: changing one variable at a time

An ordinary derivative measures how a quantity changes with one input. A field has several inputs. A partial derivative specifies which input changes while the others are held fixed:

$$\frac{\partial T}{\partial x}=\lim_{h\to0}\frac{T(x+h,y,z,t)-T(x,y,z,t)}{h}.$$

For $T(x,t)=300+2x-0.5t$, with $x$ in metres and $t$ in seconds, $\partial T/\partial x=2\,\mathrm{K\,m^{-1}}$ and $\partial T/\partial t=-0.5\,\mathrm{K\,s^{-1}}$. The coefficients carry units. These derivatives answer different questions: walking through the room at one instant versus waiting at one location.

A moving observer can experience both changes. Suppose the observer follows $x=x(t)$. Over a short interval, temperature changes because time passes and because position changes. Adding these contributions and dividing by the interval produces the chain rule

$$\frac{dT(x(t),t)}{dt}=\frac{\partial T}{\partial t}+\frac{dx}{dt}\frac{\partial T}{\partial x}.$$

For an observer moving at $1\,\mathrm{m\,s^{-1}}$ through our example, the experienced rate is $-0.5+1(2)=1.5\,\mathrm{K\,s^{-1}}$. Every fixed location cools, while the observer gets warmer by moving into hotter locations. There is no contradiction.

In three dimensions this becomes the material derivative,

$$\frac{D}{Dt}=\frac{\partial}{\partial t}+v_x\frac{\partial}{\partial x}+v_y\frac{\partial}{\partial y}+v_z\frac{\partial}{\partial z}.$$

It measures change following a material parcel. Applied component by component to velocity it gives the parcel's acceleration. A steady flow has $\partial\mathbf v/\partial t=0$ at fixed positions, yet a parcel can accelerate as it enters a narrower channel. Steady does not mean every particle moves with constant velocity.

## Pressure: force distributed over area

A fluid at rest cannot maintain a sustained shear stress: neighbouring layers slide until such stress relaxes. It can maintain a normal compressive stress, called pressure. On a small surface of area $A$, uniform pressure $p$ produces a force of magnitude $pA$ normal to the surface. The pascal is $1\,\mathrm{N\,m^{-2}}$.

Take a stationary horizontal slab of fluid with area $A$, thickness $dz$, and upward coordinate $z$. Pressure below pushes upward by $p(z)A$; pressure above pushes downward by $p(z+dz)A$; gravity contributes $\rho A dz\,g$ downward. Zero net force gives

$$p(z)A-p(z+dz)A-\rho A dz\,g=0.$$

Rearrange, divide by $A dz$, and take the thin-slab limit:

$$\frac{dp}{dz}=-\rho g.$$

For constant density, pressure increases with depth $h$ below a surface:

$$p=p_{\rm surface}+\rho gh.$$

At depth $2.0\,\mathrm m$ in water, the increase is $1000(9.81)(2.0)=19620\,\mathrm{Pa}$, about $19.6\,\mathrm{kPa}$. This is gauge pressure, the excess over surface pressure. Absolute pressure includes atmospheric pressure as well. Confusing the two matters when discussing gas laws or cavitation, which depend on absolute pressure.

Pressure itself is not a vector. Its force points differently on differently oriented surfaces. Fluid pressure acts in every direction, not only downward. A small object with equal pressure on all sides feels no net pressure force, although each side is compressed.

Integrating pressure over a submerged body gives buoyancy. One way to see the result without difficult geometry is to imagine replacing the body with the fluid that would occupy its volume. That fluid would be at rest, so the surrounding pressure force would balance its weight. Therefore the same pressure distribution exerts an upward force $\rho_{\rm fluid}gV_{\rm displaced}$ on the body. A floating object adjusts its submerged volume until this equals its weight. This argument assumes hydrostatic conditions and the relevant fluid density; it does not apply unchanged to rapidly accelerating flow.

## Conservation of mass creates the continuity equation

Consider a pipe with cross-sectional area $A$ and approximately uniform speed $v$ across a section. In time $\Delta t$, a length $v\Delta t$ passes the section, transporting volume $Av\Delta t$ and mass $\rho Av\Delta t$. The mass flow rate is

$$\dot m=\rho Av.$$

For steady flow with no leaks or accumulation, $\rho_1A_1v_1=\rho_2A_2v_2$. If the fluid is incompressible, density stays constant following a parcel, and $A_1v_1=A_2v_2$. Water entering a pipe of area $4.0\,\mathrm{cm^2}$ at $0.50\,\mathrm{m\,s^{-1}}$ reaches speed $2.0\,\mathrm{m\,s^{-1}}$ in a section of area $1.0\,\mathrm{cm^2}$. Both areas may be used in the ratio without conversion, but a volume flow rate requires SI conversion: $Q=4.0\times10^{-4}(0.50)=2.0\times10^{-4}\,\mathrm{m^3\,s^{-1}}$.

For a narrow one-dimensional tube of constant area, accumulation within $[x,x+dx]$ equals inflow minus outflow. Dividing by volume and taking a limit gives

$$\frac{\partial\rho}{\partial t}+\frac{\partial(\rho v)}{\partial x}=0.$$

The three-dimensional version is

$$\frac{\partial\rho}{\partial t}+\nabla\cdot(\rho\mathbf v)=0,$$

where the divergence $\nabla\cdot\mathbf F$ means $\partial F_x/\partial x+\partial F_y/\partial y+\partial F_z/\partial z$. It measures local outward transport per unit volume. Chapter 15 develops its geometry and integral theorem. Here its component definition is enough to interpret mass balance.

If density is constant, $\nabla\cdot\mathbf v=0$. This does not force velocity to be spatially uniform. The field $\mathbf v=(ax,-ay,0)$ has divergence $a-a=0$: a little parcel stretches along one direction while contracting along another, preserving volume.

## Bernoulli's relation and its limits

For an ideal fluid, neglect viscosity. Following a streamline in steady flow, pressure forces can change kinetic and gravitational potential energy. Along a small displacement $ds$, Newton's law gives

$$\rho v\,\frac{dv}{ds}=-\frac{dp}{ds}-\rho g\frac{dz}{ds}.$$

Multiply by $ds/\rho$ and integrate:

$$\frac{p}{\rho}+\frac{v^2}{2}+gz=\text{constant along a streamline}.$$

Each term has units of energy per mass. Equivalent forms divide by $g$ to obtain a height, or multiply by $\rho$ to obtain energy per volume. The derivation assumes steady, incompressible, inviscid flow and no pump, turbine, or other unaccounted energy transfer along the segment. In a general rotational flow the constant can differ between streamlines.

For the pipe example at equal height, the faster section has lower pressure:

$$p_1-p_2=\frac{\rho}{2}(v_2^2-v_1^2)=500(4.00-0.25)=1875\,\mathrm{Pa}.$$

The pressure drop transfers energy into directed motion. A pressure drop does not always imply an increase in speed: in a long uniform pipe, viscosity dissipates mechanical energy while average speed remains constant. Applying Bernoulli there without a loss term would give a wrong prediction.

For water draining from a large open tank through a small outlet at depth $h$, the surface speed is approximately zero and pressures at surface and outlet are atmospheric. Bernoulli gives $v=\sqrt{2gh}$. The result resembles free fall because the same energy conversion occurs. Real openings have contraction and dissipation, so actual flow rate needs an experimentally determined discharge coefficient.

## Viscosity and the Reynolds number

Imagine a fluid film between parallel plates. Hold the lower plate still and move the upper plate at speed $U$, separated by distance $H$. For a Newtonian fluid in steady simple shear, the shear force per area is

$$\tau=\eta\frac{dv_x}{dy}.$$

The dynamic viscosity $\eta$ has units $\mathrm{Pa\,s}$. In this geometry the velocity profile is linear, $v_x=Uy/H$, so $\tau=\eta U/H$. The force needed on plate area $A$ is $F=\eta AU/H$. The fluid's reaction on the moving plate opposes its motion. The sign depends on which surface force is being described; the magnitude law alone should not be mistaken for a complete vector equation.

For $\eta=0.10\,\mathrm{Pa\,s}$, $A=0.020\,\mathrm{m^2}$, $U=0.30\,\mathrm{m\,s^{-1}}$, and $H=0.0010\,\mathrm m$, the required force is $0.60\,\mathrm N$. Reducing the gap tenfold raises the force tenfold in this ideal model. A non-Newtonian fluid can violate proportionality between stress and shear rate; viscosity may then depend on rate or history.

Compare inertial force density, of order $\rho U^2/L$, with viscous force density, of order $\eta U/L^2$. Their ratio is the Reynolds number,

$$\mathrm{Re}=\frac{\rho UL}{\eta}.$$

For water with $\eta\approx10^{-3}\,\mathrm{Pa\,s}$, speed $0.10\,\mathrm{m\,s^{-1}}$, and length $0.010\,\mathrm m$, $\mathrm{Re}\approx1000$. This number identifies the relative importance of inertia and viscosity; it does not by itself determine a universal transition to turbulence. Geometry, disturbances, surface roughness, and the definition of characteristic length matter. Small swimming organisms live at low Reynolds number; their motion is dominated by instantaneous viscous resistance rather than coasting.

For incompressible Newtonian flow with constant viscosity, combining momentum balance with this stress law gives

$$\rho\frac{D\mathbf v}{Dt}=-\nabla p+\eta\nabla^2\mathbf v+\rho\mathbf g.$$

The gradient $\nabla p$ is the vector of pressure slopes. The Laplacian $\nabla^2$ adds second spatial derivatives, applied separately to each velocity component. This is the incompressible Navier–Stokes equation. Its assumptions are part of its meaning; it is not the equation of every substance under every condition.

## A solved boundary problem: flow through a tube

Consider steady laminar flow in a long circular tube of radius $R$ and length $L$. Let the pressure fall by $\Delta p>0$ along the tube. Symmetry suggests velocity along the tube axis, depending only on radial distance $r$. Newtonian momentum balance reduces to

$$0=\frac{\Delta p}{L}+\eta\frac1r\frac{d}{dr}\left(r\frac{dv}{dr}\right).$$

The radial derivative expression reflects the changing area of cylindrical shells; using a Cartesian second derivative alone would miss that geometry. Multiply by $r$ and integrate:

$$r\frac{dv}{dr}=-\frac{\Delta p}{2\eta L}r^2+C.$$

Finite slope at the centre requires $C=0$. Divide by $r$ away from the centre, integrate again, and impose no slip $v(R)=0$:

$$v(r)=\frac{\Delta p}{4\eta L}(R^2-r^2).$$

Integrate the speed over rings of area $dA=2\pi r\,dr$ to find volume flow rate:

$$Q=\int_0^R v(r)2\pi r\,dr=\frac{\pi\Delta pR^4}{8\eta L}.$$

The fourth power is striking. Doubling the radius raises flow rate sixteenfold if the other assumptions remain valid. It also raises Reynolds number, so sufficiently large changes can invalidate laminar-flow assumptions. An algebraic prediction must be checked against the conditions used to derive it.

Take $R=0.0010\,\mathrm m$, $L=1.0\,\mathrm m$, $\Delta p=100\,\mathrm{Pa}$, and $\eta=0.0010\,\mathrm{Pa\,s}$. Then $Q=3.93\times10^{-8}\,\mathrm{m^3\,s^{-1}}$ and mean speed $Q/(\pi R^2)=0.0125\,\mathrm{m\,s^{-1}}$. With diameter $2R$, $\mathrm{Re}=25$, consistent with a quiet laminar example. Entrance effects and microscopic boundary slip are neglected.

## Elasticity: when matter remembers its shape

A solid supports shear as well as compression. Start with a thin rod of original length $L$, cross-sectional area $A$, and small extension $\Delta L$. Tensile stress is $\sigma=F/A$. Strain is $\epsilon=\Delta L/L$, a dimensionless fractional deformation. For small reversible deformation many materials approximately obey Hooke's law,

$$\sigma=Y\epsilon.$$

Young's modulus $Y$ is measured in pascals. Rearranging gives $\Delta L=FL/(YA)$. A rod with $Y=2.0\times10^{11}\,\mathrm{Pa}$, $L=2.0\,\mathrm m$, $A=1.0\times10^{-4}\,\mathrm{m^2}$, and $F=1000\,\mathrm N$ stretches by $1.0\times10^{-4}\,\mathrm m$, or $0.10\,\mathrm{mm}$. Its strain is $5.0\times10^{-5}$.

Stress is not generally captured by one number. On a surface normal to one axis, force can have components along any axis. The collection $\sigma_{ij}$ records the $i$-directed force per area on a surface normal to direction $j$. This is a second-rank tensor. At this stage think of its nine components as a bookkeeping table whose entries change together when coordinates rotate. Chapter 25 develops coordinate transformations more formally. Symmetry and angular-momentum balance often reduce independent stress components to six.

For a displacement field $\mathbf u$, small strain components are

$$\epsilon_{ij}=\frac12\left(\frac{\partial u_i}{\partial x_j}+\frac{\partial u_j}{\partial x_i}\right).$$

Why symmetrize? A small rigid rotation changes the displacement gradients but does not stretch the material. The antisymmetric part describes that rotation; the symmetric part describes shape change. For $u_x=ay$ and $u_y=-ax$, the shear strain is $(a-a)/2=0$, consistent with an infinitesimal rotation.

Linear elasticity fails beyond yield, during fracture, or for large deformation. A stiff material has large modulus; a strong material resists failure. These are distinct properties. Glass can be stiff and brittle. An elastic material can store energy without permanently changing shape, even if the instantaneous displacement is substantial within its permitted range.

## Elastic waves and local restoring forces

For a thin rod with longitudinal displacement $u(x,t)$, strain is $\partial u/\partial x$ and stress is $Y\partial u/\partial x$. The force difference across a short slice is $YA\,\partial^2u/\partial x^2\,dx$. Its mass is $\rho A dx$. Newton's law therefore gives

$$\frac{\partial^2u}{\partial t^2}=\frac{Y}{\rho}\frac{\partial^2u}{\partial x^2}.$$

This is a wave equation with speed $c=\sqrt{Y/\rho}$ in the thin-rod approximation, where lateral stresses can relax. With $Y=2.0\times10^{11}\,\mathrm{Pa}$ and $\rho=8000\,\mathrm{kg\,m^{-3}}$, $c=5000\,\mathrm{m\,s^{-1}}$. Bulk three-dimensional longitudinal waves involve other elastic moduli, so the same formula must not be applied to every sound-speed problem.

The mathematical distinction between this equation and diffusion is physically important. Waves retain a second time derivative because inertia stores kinetic energy and restoring forces store potential energy. Diffusion will have a first time derivative and smooth differences without oscillating under ordinary conditions.

## Diffusion: conservation plus a downhill flux

A drop of dye spreads through still water because molecular motion transports particles from a highly populated region toward a less populated one on average. The particles themselves move both ways. A concentration gradient biases the net transport because more particles are available on the more concentrated side.

Define one-dimensional number flux $J$ as particles crossing unit area per unit time, positive along $+x$. Fick's empirical law for ordinary diffusion is

$$J=-D\frac{\partial c}{\partial x},$$

where diffusivity $D$ has units $\mathrm{m^2\,s^{-1}}$ and is positive. The minus sign makes the flux point downhill in concentration. Conservation in a small interval gives $\partial c/\partial t=-\partial J/\partial x$. For constant $D$,

$$\frac{\partial c}{\partial t}=D\frac{\partial^2c}{\partial x^2}.$$

At a smooth concentration peak, the second derivative is negative, so the peak decreases. At a valley it is positive, so the valley fills. This local curvature argument explains why diffusion smooths profiles. A negative diffusivity would amplify small fluctuations and represents a different, unstable mathematical model rather than ordinary molecular diffusion.

A localized packet in an infinite one-dimensional medium has Gaussian solution

$$c(x,t)=\frac{N}{\sqrt{4\pi Dt}}\exp\left(-\frac{x^2}{4Dt}\right),\qquad t>0.$$

Here $N=\int c\,dx$ is the total amount per transverse area in this reduced one-dimensional description. The prefactor preserves that integral as the packet widens. The mean-square displacement is $2Dt$, so a typical width grows like $\sqrt t$. Doubling spreading distance requires four times as long. For $D=10^{-9}\,\mathrm{m^2\,s^{-1}}$, an rms distance of $10^{-3}\,\mathrm m$ requires $t=x_{\rm rms}^2/(2D)=500\,\mathrm s$. Molecular diffusion alone mixes a centimetre-scale sample much more slowly than stirring.

The ideal diffusion equation predicts an immediately nonzero Gaussian tail arbitrarily far away. That is a limitation of the continuum approximation, not a statement that molecules or signals travel infinitely fast. At sufficiently short times and distances, finite collision times and microscopic dynamics matter.

## Heat conduction uses the same mathematical structure

Temperature differences drive heat flux approximately according to Fourier's law, $j_Q=-\kappa\partial T/\partial x$, where thermal conductivity $\kappa$ has units $\mathrm{W\,m^{-1}\,K^{-1}}$. If density and specific heat $c_p$ are approximately constant in the relevant process, conservation of thermal energy gives

$$\frac{\partial T}{\partial t}=\alpha\frac{\partial^2T}{\partial x^2},\qquad \alpha=\frac{\kappa}{\rho c_p}.$$

More precise settings require the correct heat capacity and a thermodynamic account of expansion or work. The simplified equation is appropriate for a solid with negligible motion and suitably constant properties. Heat sources add an explicit source term; an insulated boundary imposes zero normal heat flux; a thermostat boundary imposes temperature. Initial conditions describe the starting profile, while boundary conditions describe interaction at the edges. Neither can be omitted when asking for a unique evolution.

For a bar of length $L$ held at zero temperature excess at both ends, a sinusoidal excess $T(x,0)=A\sin(\pi x/L)$ evolves as

$$T(x,t)=A\sin(\pi x/L)e^{-\alpha\pi^2t/L^2}.$$

Substituting it into the equation verifies both the time derivative and spatial curvature. Its decay time is $L^2/(\alpha\pi^2)$. Shorter wavelength modes decay faster because their larger curvature creates larger flux differences. This connects diffusion to Fourier modes from Chapter 8.

## What this chapter lets you recognize

A continuum problem normally needs a conserved quantity, a flux, a material law, and initial/boundary conditions. For fluid momentum the response involves pressure and viscosity. For a stretched solid it involves elasticity. For concentration and temperature it involves transport down a gradient. The equations look related because the same local accounting recurs, while their solutions differ because the physical storage and response laws differ.

The companion's transport experiments can be used to compare smoothing with propagation and to check characteristic length and time scales. Numerical approximations require care: a diffusion update can become unstable when the time step is too large even though the physical diffusion process is stable. Chapter 27 derives that restriction rather than treating a computer picture as automatic evidence.

### Optional practice

1. Find the gauge pressure at depth $3.0\,\mathrm m$ in a liquid of density $800\,\mathrm{kg\,m^{-3}}$. State why absolute pressure cannot be found without another datum.
2. An incompressible flow passes from area $6.0\,\mathrm{cm^2}$ to $2.0\,\mathrm{cm^2}$, entering at $0.40\,\mathrm{m\,s^{-1}}$. Find exit speed and volume flow rate.
3. For $T(x,t)=290+3x+2t$, find the temperature rate experienced by a parcel moving with $dx/dt=-0.50\,\mathrm{m\,s^{-1}}$. Include units.
4. A rod with $Y=70\,\mathrm{GPa}$, length $1.0\,\mathrm m$, and area $2.0\,\mathrm{mm^2}$ carries a $14\,\mathrm N$ tensile load. Find stress, strain, and extension.
5. A diffusing packet has $D=2.0\times10^{-9}\,\mathrm{m^2\,s^{-1}}$. How long until its one-dimensional rms displacement is $2.0\,\mathrm{mm}$? Explain why this does not give a sharp leading edge.
6. Derive the mean speed for the parabolic tube profile, and compare it with the centreline speed. Explain the role of the no-slip boundary condition.
7. Show that a sinusoidal temperature mode satisfies the diffusion equation and obtain its decay time. What changes when its spatial frequency doubles?
8. Explain why applying ideal Bernoulli to a uniform long viscous pipe would incorrectly predict zero pressure loss. Identify the missing physical process.

Hints and full solutions are in the separate files `../solutions/12-hints.md` and `../solutions/12-solutions.md`.

### Source connections

This original treatment connects to Feynman Volume II Chapters 38–41 on elasticity and fluids, Volume I Chapters 41–43 on Brownian motion and diffusion, and Volume II Chapters 2–3 on field derivatives and transport. The course reorganizes those ideas to introduce partial derivatives locally. The supplied PDF is a reference source; this chapter is not a transcription. The next chapter develops the thermodynamic meaning of temperature, heat, and entropy.
