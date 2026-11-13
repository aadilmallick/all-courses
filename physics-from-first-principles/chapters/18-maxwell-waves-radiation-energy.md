# 18. Maxwell's equations, electromagnetic waves, and radiation

A changing current in one place can influence another place after a finite delay. Light carries energy across empty space. A charged capacitor stores energy in a region with no conducting wire through its gap. These observations belong to the same theory. Maxwell's equations combine the electric and magnetic laws into a local description that predicts propagation and accounts for field energy and momentum.

The central question is how local field changes communicate through space while remaining consistent with charge conservation. We will derive a wave equation, follow energy through a surface, and distinguish near fields from radiation. Some historical language describes electric and magnetic fields as creating each other. A more precise statement is that the coupled field equations determine how a complete electromagnetic configuration evolves from initial data and sources.

## The four equations and the information each contains

In vacuum with charge density $\rho$ and current density $\mathbf J$, the equations in SI units are

$$\nabla\cdot\mathbf E=\frac\rho{\epsilon_0},\qquad \nabla\cdot\mathbf B=0,$$

$$\nabla\times\mathbf E=-\frac{\partial\mathbf B}{\partial t},\qquad \nabla\times\mathbf B=\mu_0\mathbf J+\mu_0\epsilon_0\frac{\partial\mathbf E}{\partial t}.$$

The divergence equations constrain sources and local flux. Faraday's law relates electric circulation to changing magnetic flux. The Ampere–Maxwell law relates magnetic circulation to conduction current and changing electric field. Together with the Lorentz force, charge conservation, and suitable material laws where matter is present, they form classical electromagnetism.

These equations are empirical physical laws, although several are connected by mathematical consistency. They do not determine the response of every material without additional relations between fields, polarization, magnetization, and currents. A statement that a medium has permittivity $\epsilon$ and permeability $\mu$ is an extra material model, often approximate and frequency dependent.

The displacement-current term $\epsilon_0\partial\mathbf E/\partial t$ has current-density units. It need not represent charged particles physically crossing the region. Its role becomes clear both from a charging capacitor and from the continuity equation.

## Why magnetostatics alone fails for changing charge

Take the divergence of the magnetostatic equation $\nabla\times\mathbf B=\mu_0\mathbf J$. Divergence of a smooth curl is zero, because paired mixed derivatives cancel. The result would force $\nabla\cdot\mathbf J=0$, which allows no local charge accumulation. That is too restrictive for a charging capacitor.

Including Maxwell's term gives

$$0=\mu_0\nabla\cdot\mathbf J+\mu_0\epsilon_0\frac{\partial}{\partial t}(\nabla\cdot\mathbf E)=\mu_0\left(\nabla\cdot\mathbf J+\frac{\partial\rho}{\partial t}\right).$$

Thus the equations imply the required charge-continuity relation. The extension preserves a conservation law rather than abandoning it.

For an ideal parallel-plate capacitor, $E=Q/(\epsilon_0A)$ between plates. The changing electric flux is $d(EA)/dt=(1/\epsilon_0)dQ/dt=I/\epsilon_0$. Therefore the displacement current through the gap, $\epsilon_0d\Phi_E/dt$, equals the conduction current in the wire. An Ampere loop can be spanned by a surface cutting the wire or one bulging through the gap, and the total right-hand side agrees. The field cannot depend on which mathematical surface was chosen.

For a circular plate of radius $R$ with approximately uniform charging field, take an internal circular loop of radius $r<R$ in the gap. Symmetry gives

$$B(2\pi r)=\mu_0\epsilon_0\pi r^2\frac{dE}{dt},\qquad B(r)=\frac{\mu_0\epsilon_0r}{2}\frac{dE}{dt}.$$

Substituting $dE/dt=I/(\epsilon_0\pi R^2)$ yields $B=\mu_0Ir/(2\pi R^2)$. This is an approximate central-region result; real finite capacitors have edge fields and nonuniform current distributions.

## Deriving the wave equation

In source-free vacuum, $\rho=0$ and $\mathbf J=0$. Take the curl of Faraday's law:

$$\nabla\times(\nabla\times\mathbf E)=-\frac{\partial}{\partial t}(\nabla\times\mathbf B)=-\mu_0\epsilon_0\frac{\partial^2\mathbf E}{\partial t^2}.$$

The vector identity $\nabla\times(\nabla\times\mathbf E)=\nabla(\nabla\cdot\mathbf E)-\nabla^2\mathbf E$ follows by expanding component derivatives. Since divergence is zero here, the gradient term vanishes. Rearranging gives

$$\nabla^2\mathbf E-\mu_0\epsilon_0\frac{\partial^2\mathbf E}{\partial t^2}=0.$$

Repeating the argument gives the same equation for $\mathbf B$. Comparing with the wave equation from Chapter 8 identifies speed

$$c=\frac1{\sqrt{\mu_0\epsilon_0}}.$$

In vacuum this is the speed of light, approximately $3.00\times10^8\,\mathrm{m\,s^{-1}}$ in rounded examples. The theory unifies optics with electromagnetism: light is a propagating electromagnetic field. Wave equations also admit initial disturbances and standing-wave solutions; a traveling sinusoid is a useful member of the solution family rather than the only possibility.

## Plane-wave geometry and polarization

Choose a plane wave moving along $+z$ with electric field

$$\mathbf E(z,t)=E_0\cos(kz-\omega t)\hat{\mathbf x}.$$

The wave equation requires $\omega=ck$ for positive frequency and positive $k$. Electric Gauss' law excludes a longitudinal sinusoidal electric component in source-free vacuum. Faraday's law then fixes

$$\mathbf B(z,t)=\frac{E_0}{c}\cos(kz-\omega t)\hat{\mathbf y}.$$

The fields are perpendicular to each other and to propagation, with $\mathbf E\times\mathbf B$ pointing along $+z$. They are in phase in this vacuum traveling-wave solution. A sign choice that makes $\mathbf E\times\mathbf B$ point backward should trigger a check of the curl equation and wave direction.

Polarization describes the time-dependent direction of the transverse electric field at a fixed location. Linear polarization has one fixed axis. Circular polarization combines equal orthogonal components separated in phase by a quarter cycle, such as $E_x=E_0\cos\phi$, $E_y=E_0\sin\phi$. Elliptical polarization is the general unequal-amplitude or different-phase case. Handedness conventions depend on viewing direction and terminology, so a precise field expression is safer than an unexplained left/right label.

A plane wave has ideal infinite transverse extent and infinite total energy. A real beam is localized and diffracts; a sufficiently broad beam can be approximated locally by a plane wave. Transversality remains central, but longitudinal components can arise in focused or guided configurations without contradicting the plane-wave result.

## Frequency, wavelength, and propagation delay

Angular frequency counts phase in radians per second, while ordinary frequency $f$ counts complete cycles per second, so $\omega=2\pi f$. Wave number is $k=2\pi/\lambda$. Substituting these definitions into $\omega=ck$ gives $f\lambda=c$. A vacuum wave at $100\,\mathrm{MHz}$ has wavelength approximately $3.00\,\mathrm m$. Its period is $10\,\mathrm{ns}$, and a wavefront travels approximately $3.00\,\mathrm m$ during that period. A receiver $30\,\mathrm m$ away experiences a propagation delay of approximately $100\,\mathrm{ns}$ under a straight vacuum-path model. The delay is distinct from the phase modulo one cycle: a sinusoidal signal alone can hide an integer number of periods, while a timed pulse can identify arrival time. This distinction matters in ranging, communications, and interpreting phase measurements.

## Poynting's theorem derives local energy conservation

Dot the Ampere–Maxwell equation with $\mathbf E$:

$$\mathbf E\cdot(\nabla\times\mathbf B)=\mu_0\mathbf J\cdot\mathbf E+\mu_0\epsilon_0\mathbf E\cdot\frac{\partial\mathbf E}{\partial t}.$$

Dot Faraday's law with $\mathbf B$ and subtract in the order needed for the identity $\nabla\cdot(\mathbf E\times\mathbf B)=\mathbf B\cdot(\nabla\times\mathbf E)-\mathbf E\cdot(\nabla\times\mathbf B)$. Since $\mathbf E\cdot\partial_t\mathbf E=\partial_t(E^2/2)$ and similarly for $B$, we obtain

$$\frac{\partial u}{\partial t}+\nabla\cdot\mathbf S=-\mathbf J\cdot\mathbf E,$$

where

$$u=\frac{\epsilon_0E^2}{2}+\frac{B^2}{2\mu_0},\qquad \mathbf S=\frac1{\mu_0}\mathbf E\times\mathbf B.$$

The energy density $u$ has units joules per cubic metre. The Poynting vector $\mathbf S$ has units watts per square metre and represents electromagnetic energy flux. The term $\mathbf J\cdot\mathbf E$ is work per volume per time transferred from fields to charges. It can be negative when charges supply energy to the field, as inside a source.

Integrated over a volume, the theorem says field-energy increase plus outward energy flow equals negative work done on matter. This separates storage, transport, and transfer. A positive flux through one surface patch does not by itself imply radiation: static crossed fields can carry a Poynting vector in a steady energy-flow arrangement, and nearby fields can exchange stored energy back and forth.

## Intensity, impedance, and a numerical wave

For a vacuum traveling plane wave, $B=E/c$, so electric and magnetic energy densities are equal. Total density is $u=\epsilon_0E^2$ and instantaneous flux magnitude is $S=\epsilon_0cE^2=uc$. For a sinusoidal field with peak amplitude $E_0$, the time-averaged intensity is

$$I=\langle S\rangle=\frac12\epsilon_0cE_0^2.$$

The vacuum wave impedance is $Z_0=\sqrt{\mu_0/\epsilon_0}=\mu_0c\approx377\,\Omega$, so $I=E_0^2/(2Z_0)$. The ohm unit appears because a plane wave relates electric and magnetic amplitudes, not because vacuum is an ordinary resistor dissipating wave energy.

For $E_0=100\,\mathrm{V\,m^{-1}}$, magnetic amplitude is $3.33\times10^{-7}\,\mathrm T$, and intensity is approximately $13.3\,\mathrm{W\,m^{-2}}$. A detector of area $0.020\,\mathrm{m^2}$ normal to the beam intercepts approximately $0.266\,\mathrm W$ if the beam is uniform across it. An oblique surface intercepts the normal flux component, including a cosine projection.

For fixed intensity, confusing peak with rms electric amplitude creates a factor-of-two error. With rms field $E_{\rm rms}=E_0/\sqrt2$, the formula becomes $I=\epsilon_0cE_{\rm rms}^2$. Always state which amplitude appears.

## Where circuit energy flows

Consider a cylindrical resistor carrying steady current along its axis. An axial electric field drives the current, while a circular magnetic field surrounds it. Their cross product points radially inward, so Poynting flux enters the resistor through its sides. The field transfers energy to charges, and collisions transfer that energy into microscopic degrees of freedom.

For a long cylindrical resistor of length $\ell$ and radius $a$ under a simple uniform-field approximation, $E=V/\ell$ and surface $B=\mu_0I/(2\pi a)$. The inward flux integrated over side area $2\pi a\ell$ is

$$P=\frac{EB}{\mu_0}(2\pi a\ell)=VI.$$

This exactly matches the circuit power formula. The calculation does not require energy to ride inside individual electrons from battery to resistor like parcels in a delivery service. The circuit's electric and magnetic fields provide the local energy accounting. Real surface-charge distributions establish those fields, and the complete geometry determines their spatial pattern.

## Potentials in time-dependent fields

Because $\nabla\cdot\mathbf B=0$, write $\mathbf B=\nabla\times\mathbf A$. Faraday's law then implies that $\mathbf E+\partial\mathbf A/\partial t$ has zero curl locally, so

$$\mathbf E=-\nabla\phi-\frac{\partial\mathbf A}{\partial t}.$$

The scalar potential alone is no longer sufficient. Under a gauge transformation $\mathbf A\mapsto\mathbf A+\nabla\chi$ and $\phi\mapsto\phi-\partial\chi/\partial t$, both physical fields stay unchanged. One can choose a gauge to simplify equations without changing measured forces.

In the Lorenz gauge, $\nabla\cdot\mathbf A+(1/c^2)\partial\phi/\partial t=0$, the potentials satisfy sourced wave equations. A causal solution in unbounded vacuum with suitable no-incoming-radiation conditions is

$$\phi(\mathbf r,t)=\frac1{4\pi\epsilon_0}\int\frac{\rho(\mathbf r',t-R/c)}R\,dV',$$

$$\mathbf A(\mathbf r,t)=\frac{\mu_0}{4\pi}\int\frac{\mathbf J(\mathbf r',t-R/c)}R\,dV',\qquad R=|\mathbf r-\mathbf r'|.$$

Sources are evaluated at retarded time $t-R/c$: the delay needed to reach the observer. These integrals are not instantaneous Coulomb and Biot–Savart formulas with a time label casually attached. Taking their derivatives introduces additional terms that encode induction and radiation. Other homogeneous solutions can represent incoming waves, so the causal boundary condition is part of the stated physical problem.

## Near fields and radiation have different distance scaling

A stationary localized electric dipole has a field falling as $1/r^3$. A time-varying dipole also produces induction terms falling as $1/r^2$ and a radiation field falling as $1/r$ at large distance. A $1/r$ field gives intensity proportional to $1/r^2$, which compensates the area growth of an expanding sphere and can carry a finite power to distant observers.

For a small nonrelativistic electric dipole $\mathbf p(t)$ whose source size is much less than wavelength, the far electric field is

$$\mathbf E_{\rm rad}(\mathbf r,t)=\frac1{4\pi\epsilon_0c^2r}\hat{\mathbf n}\times[\hat{\mathbf n}\times\ddot{\mathbf p}(t-r/c)],$$

where $\hat{\mathbf n}$ points toward the observer. The double cross product removes the component along the viewing direction, so radiation vanishes on the dipole axis. Its magnetic field is $\mathbf B_{\rm rad}=\hat{\mathbf n}\times\mathbf E_{\rm rad}/c$. These are leading far-zone terms, not the entire field at all distances.

For a dipole oscillating along one axis, the angular radiation intensity follows $\sin^2\theta$. Use the plane-wave flux relation locally in the far zone. Integrating over solid angle, with $\int\sin^2\theta\,d\Omega=8\pi/3$, gives instantaneous radiated power evaluated with the appropriate retarded dipole acceleration:

$$P=\frac{|\ddot{\mathbf p}|^2}{6\pi\epsilon_0c^3}.$$

For $\mathbf p=p_0\cos(\omega t)\hat{\mathbf z}$, averaging the squared cosine gives

$$\langle P\rangle=\frac{\omega^4p_0^2}{12\pi\epsilon_0c^3}.$$

The fourth power means radiation changes strongly with frequency for a fixed dipole amplitude. A real driven antenna's amplitude and impedance also vary with frequency, so this scaling cannot be applied while silently holding incompatible circuit conditions fixed.

## Accelerated charges and the energy source

For one slowly moving charge, $\mathbf p=q\mathbf x$ relative to a suitable fixed origin, so $\ddot{\mathbf p}=q\mathbf a$. The nonrelativistic Larmor formula is

$$P=\frac{q^2a^2}{6\pi\epsilon_0c^3}.$$

It is valid when speed is small compared with $c$ and the classical point-charge approximation is appropriate. Relativistic radiation has additional angular and acceleration dependence. Atomic stability cannot be explained by imagining an electron as a tiny classical planet radiating continuously; quantum mechanics changes the allowed stationary states.

Radiated energy must come from work on the charge or a reduction in the source's stored energy. For a driven antenna, the power supply maintains the motion and pays for both resistive loss and radiation. Radiation reaction and the self-force of ideal point charges involve subtleties that lie beyond this introductory derivation; the Larmor formula alone is not a complete equation of motion for a radiating point particle.

## Electromagnetic momentum and radiation pressure

In vacuum the electromagnetic momentum density is

$$\mathbf g=\frac{\mathbf S}{c^2}.$$

A traveling wave therefore carries momentum as well as energy. If a beam is absorbed at normal incidence, momentum transfer per energy is $1/c$, so pressure is $I/c$. For perfect reflection directly backward, the momentum change doubles and pressure is $2I/c$. These ideal formulas assume the whole relevant beam is absorbed or reflected and neglect additional material complications.

At intensity $1000\,\mathrm{W\,m^{-2}}$, absorption pressure is approximately $3.33\times10^{-6}\,\mathrm{Pa}$. The number is small on household scales but measurable with suitable precision and important for light sails and microscopic optical forces. The small pressure does not mean light lacks momentum; it reflects the large conversion speed $c$ between energy and momentum scales.

For general fields, momentum conservation involves the Maxwell stress tensor,

$$T_{ij}=\epsilon_0(E_iE_j-\tfrac12\delta_{ij}E^2)+\frac1{\mu_0}(B_iB_j-\tfrac12\delta_{ij}B^2).$$

Its entries package directional momentum transfer through surfaces. With this sign convention, the force on matter inside a fixed volume is the outward surface integral of $\mathbf T\cdot\hat{\mathbf n}$ minus the rate of change of enclosed field momentum. This connects field forces, pressure, and momentum balance. It is not necessary to memorize every component before using the plane-wave pressure result, but the tensor explains how that simple result belongs to a more general conservation structure.

## Reflection and boundary matching

At an interface without free surface charge or current, normal $D$ and $B$ are continuous, and tangential $E$ and $H$ match under the appropriate macroscopic material description. For normal incidence on lossless nonmagnetic media, match electric and magnetic traveling-wave amplitudes. If wave impedances are $Z_1$ and $Z_2$, the electric reflection amplitude is

$$r=\frac{Z_2-Z_1}{Z_2+Z_1},\qquad t=\frac{2Z_2}{Z_1+Z_2}.$$

The reflected wave reverses propagation direction, so its magnetic amplitude has the opposite relation to its electric amplitude; that sign creates the boundary equations. Reflected intensity fraction is $R=|r|^2$, while transmitted fraction for real positive impedances is $T=(Z_1/Z_2)|t|^2$. The amplitude transmission coefficient alone is not an energy fraction.

For vacuum entering glass of refractive index $n=1.5$ under this simplified lossless nonmagnetic model, $Z_2=Z_1/1.5$. Thus $r=(1-1.5)/(1+1.5)=-0.20$, $R=0.04$, and $T=0.96$. The negative electric reflection amplitude indicates a phase reversal. Reflection at oblique incidence depends on polarization and is treated through the same boundary logic with additional geometry.

## Relativity and the unity of the field

Electric and magnetic fields depend on observer motion. A charge at rest in one inertial frame can be moving in another, so a purely electric configuration need not remain purely electric. Special relativity organizes the field components into one electromagnetic tensor. For motion at velocity $\mathbf v$ between frames, transverse electric and magnetic components mix, while parallel components have different transformation rules. Chapter 10 introduced the relevant spacetime structure; Chapter 26 develops a more formal bridge.

Two useful vacuum invariants are $\mathbf E\cdot\mathbf B$ and $E^2-c^2B^2$. For a plane radiation wave both vanish, despite nonzero fields. These invariants distinguish radiation-like configurations from a purely electric field, for which $E^2-c^2B^2>0$ in its rest-source frame. Neither invariant alone specifies the entire physical configuration. Their value lies in checking whether a claimed transformation could be consistent.

### Optional practice

1. A capacitor current is $2.0\,\mathrm{mA}$. Find the displacement current through an ideal spanning surface in its gap and the electric-flux rate.
2. Starting with the source-free curl equations, derive the electric wave equation and identify the identity used.
3. A wave travels along $+x$ with electric field along $+y$ at one instant. Find the magnetic-field direction at that instant and its amplitude if $E_0=60\,\mathrm{V\,m^{-1}}$.
4. Find the average intensity of that wave using peak amplitude and $Z_0\approx377\,\Omega$.
5. A $2.0\,\mathrm{W}$ normally incident beam is completely reflected from a small mirror. Find force magnitude in the ideal model.
6. A dipole's frequency doubles while $p_0$ remains fixed and the small-source approximation remains valid. How does average radiated power change? What if $p_0$ halves at the same time?
7. For normal incidence from index 1 to lossless nonmagnetic index 2, derive reflected intensity using impedances. Evaluate for indices 1 and 2.
8. Explain why a static nonzero Poynting vector does not automatically prove radiation to infinity, and why the near/far distinction matters.

Hints and solutions are in `../solutions/18-hints.md` and `../solutions/18-solutions.md`.

### Source connections

Feynman Volume II Chapters 18 and 20–27 connect Maxwell equations, wave solutions, relativistic field descriptions, and field energy; Volume I Chapters 28–34 connect light and radiation. This chapter's derivations and examples are original. The companion wave calculations use ideal vacuum or lossless-medium models, and laboratory measurements require the uncertainty analysis of Chapter 28.
