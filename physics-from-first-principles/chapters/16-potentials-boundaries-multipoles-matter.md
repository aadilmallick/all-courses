# 16. Potentials, boundary problems, multipoles, and matter

The electric potential is often easier to specify than the charge distribution. A battery holds a metal plate at a chosen voltage, but the surface charge adjusts itself and is initially unknown. A dielectric inserted between capacitor plates polarizes, changing the field even though no free charge crosses the gap. These are boundary problems: sources, material response, and constraints must be solved together.

This chapter develops four methods with different strengths. Uniqueness tells us when a candidate solution is sufficient. Images replace complicated induced charge by fictitious sources outside the physical region. Separation of variables builds solutions from spatial modes. Multipole expansions approximate distant fields by retaining only their most consequential structure. Capacitance, field energy, and polarization then connect these mathematical methods to physical devices.

## What a boundary condition supplies

In a region of specified charge density, potential obeys $\nabla^2V=-\rho/\epsilon_0$. In empty space it obeys Laplace's equation. The equation constrains local curvature but does not fix all possible solutions. For example, both zero potential and $V=-E_0x$ satisfy Laplace's equation. Different distant electrodes select different members of this solution family.

A Dirichlet boundary condition specifies potential on the boundary. A Neumann condition specifies its normal derivative, related to normal electric field. A grounded conductor has potential zero relative to the chosen ground reference and can exchange charge with its environment. An isolated neutral conductor instead has a fixed total charge, and its potential is generally an unknown constant. Confusing these situations changes the physical answer.

For Neumann data on a closed boundary, consistency requires the specified flux to agree with enclosed charge through Gauss' law, and potential remains undetermined by an additive constant. Mixed conditions prescribe different types on different boundary portions. In every case, infinity counts as part of the problem when the domain is unbounded: one must state whether potential vanishes, approaches a uniform-field form, or follows another asymptotic condition.

## Why uniqueness makes clever guesses trustworthy

Suppose $V_1$ and $V_2$ solve Poisson's equation in the same bounded region with the same source density and the same boundary potential. Let $u=V_1-V_2$. Then $\nabla^2u=0$ in the region and $u=0$ on its boundary.

Apply the product rule to the divergence of $u\nabla u$:

$$\nabla\cdot(u\nabla u)=|\nabla u|^2+u\nabla^2u=|\nabla u|^2.$$

Integrate over the region and use the divergence theorem:

$$\int_V|\nabla u|^2dV=\oint_{\partial V}u\frac{\partial u}{\partial n}\,dA=0.$$

The boundary integral vanishes because $u=0$ there. Since the integrand on the left is nonnegative, it must vanish throughout a sufficiently regular solution: $\nabla u=0$. Thus $u$ is constant on a connected region, and the boundary value forces that constant to zero. Therefore $V_1=V_2$.

This proof assumes appropriate smoothness and finite integrals; point-charge singularities can be handled by excluding small spheres and matching singular behavior. Its key idea is that a nonzero difference field would carry positive integrated squared gradient, while homogeneous boundary data leave no place to support it. Uniqueness does not construct a solution or guarantee one exists for inconsistent data. It says that once a valid candidate is found, there cannot be a different physical solution under the same conditions.

## The image charge above a grounded plane

Place a real charge $q$ at $(0,0,a)$ above a grounded conducting plane $z=0$. Seek the potential only in the physical region $z>0$. Introduce a fictitious charge $-q$ at $(0,0,-a)$ and write

$$V(x,y,z)=k_eq\left[\frac1{\sqrt{x^2+y^2+(z-a)^2}}-\frac1{\sqrt{x^2+y^2+(z+a)^2}}\right].$$

At the plane, the two denominators are equal, so $V=0$. In $z>0$, the only source singularity is the real charge; the image lies outside the solved region. Potential also vanishes at infinity. Uniqueness makes this the correct potential above the plane. It is not the physical potential inside the conductor, where the field is zero. The image is a calculation device representing the induced surface distribution.

The force on the real charge is the force from the image field, excluding the charge's own singular field:

$$F_z=-\frac{k_eq^2}{(2a)^2}=-\frac{q^2}{16\pi\epsilon_0a^2}.$$

It points toward the plane for either sign of $q$, because induced charge has the opposite nearby sign. For $q=1.0\,\mathrm{nC}$ and $a=0.010\,\mathrm m$, magnitude is approximately $2.25\times10^{-5}\,\mathrm N$. Changing the charge sign leaves the magnitude and attraction unchanged.

The induced surface density follows from $\sigma=\epsilon_0E_z(0^+)$:

$$\sigma(s)=-\frac{qa}{2\pi(s^2+a^2)^{3/2}},\qquad s=\sqrt{x^2+y^2}.$$

Integrating over rings gives total induced charge $\int_0^\infty\sigma(s)2\pi s\,ds=-q$. Grounding permits the conductor to acquire that net charge. An isolated finite neutral conductor would require an additional constraint and a different solution.

## An image inside a grounded sphere

A second image construction shows why the physical domain matters. Put a real charge $q$ a distance $a>R$ from the centre of a grounded conducting sphere of radius $R$. An image charge $q'=-qR/a$ at distance $b=R^2/a$ from the centre, on the line toward the real charge, makes the sphere's potential zero.

To check this rather than accept a guess, take any point on the sphere at polar angle $\theta$ from that line. Its squared distance from the real charge is $d^2=a^2+R^2-2aR\cos\theta$. Its squared distance from the image is $d'^2=b^2+R^2-2bR\cos\theta=(R^2/a^2)d^2$. Thus $d'=(R/a)d$ and $q/d+q'/d'=0$. The constructed potential has the correct singularity outside the sphere, the correct boundary value, and the correct decay at infinity, so uniqueness identifies the exterior solution.

The field from the image gives the real charge's force. The image's location inside the metal is not a claim that a point charge physically sits there. The actual induced charge spreads over the surface. If the sphere is instead isolated and neutral, the grounded solution has the wrong net induced charge. Adding a central image $+qR/a$ restores zero total induced charge and shifts the sphere to a nonzero constant potential. Same geometry, different electrical constraint, different force. This is a useful test of whether the boundary condition was understood before calculation.

## Energy in an induced-charge problem needs a half factor

Return to the grounded-plane geometry: the real charge is a height $a$ above the plane, and its image is a distance $2a$ from it. The potential at the real charge due to that image is $V_{\rm image}=-k_eq/(2a)$. This expression is for the plane, not for the sphere in the preceding section. It is tempting to call $qV_{\rm image}$ the system energy, but that double-counts the assembly response. As the real charge is brought in or gradually increased, the induced distribution changes too. The interaction energy associated with the grounded plane is

$$U(a)=\frac12qV_{\rm image}=-\frac{k_eq^2}{4a}.$$

Check by differentiation: $F_z=-dU/da=-k_eq^2/(4a^2)$, exactly the image-force result. Using $qV_{\rm image}$ would predict a force twice too large. This check is more reliable than memorizing a half factor without understanding what is held fixed. Work by grounding connections or voltage sources must be included when comparing different electrical boundary conditions.

## Separation of variables: building spatial modes

Consider a two-dimensional strip $0<x<L$, $y>0$, with potential zero on the sides $x=0,L$, prescribed bottom potential $f(x)$, and potential tending to zero as $y\to\infty$. With no charge inside, solve $V_{xx}+V_{yy}=0$.

Try a product $V=X(x)Y(y)$. This is an ansatz, a candidate form, not yet a general solution. Substituting and dividing by nonzero $XY$ gives $X''/X=-Y''/Y$. The left depends only on $x$ and the right only on $y$, so each must equal a constant. Choose it as $-k^2$ for the $X$ equation, giving

$$X''+k^2X=0,\qquad Y''-k^2Y=0.$$

Zero side values select $X=\sin(n\pi x/L)$ with $n=1,2,\ldots$. Decay at infinity selects $Y=e^{-n\pi y/L}$. Linearity allows a sum:

$$V(x,y)=\sum_{n=1}^\infty a_n\sin(n\pi x/L)e^{-n\pi y/L}.$$

At the bottom this must reproduce $f(x)$ as a Fourier sine series. Multiplying by $\sin(m\pi x/L)$ and integrating uses orthogonality:

$$\int_0^L\sin(n\pi x/L)\sin(m\pi x/L)dx=\frac L2\delta_{nm}.$$

Here $\delta_{nm}$ is 1 when indices match and 0 otherwise. The result follows from product-to-sum identities and integrating whole-number periods. Therefore

$$a_n=\frac2L\int_0^Lf(x)\sin(n\pi x/L)dx.$$

For $f(x)=V_0\sin(\pi x/L)$, only $a_1=V_0$ survives. The potential is exactly $V_0\sin(\pi x/L)e^{-\pi y/L}$. Its spatial variation becomes weak a few strip widths above the boundary. Higher spatial-frequency features decay faster, explaining why small electrode details have a short-range influence in this geometry.

For a constant bottom value $V_0$ away from the corners, odd coefficients are $a_n=4V_0/(n\pi)$ and even coefficients vanish. Corner discontinuities need the appropriate boundary-limit interpretation. A truncated series approximates the interior well but can converge poorly near discontinuous boundary data. A numerical plot should not be mistaken for proof that the corner values match pointwise.

## Distant fields and the multipole idea

Suppose a localized charge distribution occupies a region much smaller than observation distance $r$. Its exact potential is $k_e\int dq/|\mathbf r-\mathbf r'|$. Expand the denominator in the small ratio $r'/r$:

$$\frac1{|\mathbf r-\mathbf r'|}=\frac1r+\frac{\hat{\mathbf r}\cdot\mathbf r'}{r^2}+\frac{3(\hat{\mathbf r}\cdot\mathbf r')^2-r'^2}{2r^3}+\cdots.$$

The expansion follows from the Taylor series of $(1+u)^{-1/2}$ after factoring out $r$. It converges when all source radii are smaller than the observation radius about the chosen origin. It should not be used inside an extended source merely because a sketch looks far away from one part of it.

Integrating term by term gives the monopole term $k_eQ/r$, where $Q=\int dq$, and dipole term

$$V_{\rm dipole}=k_e\frac{\mathbf p\cdot\hat{\mathbf r}}{r^2},\qquad \mathbf p=\int\mathbf r'\,dq.$$

The electric dipole moment points from negative toward positive charge for a simple pair. If $Q=0$, it is independent of origin shifts: replacing $\mathbf r'$ by $\mathbf r'-\mathbf a$ changes $\mathbf p$ by $-Q\mathbf a=0$. If $Q\ne0$, the dipole moment depends on origin, while the complete field remains independent of that bookkeeping choice.

For charges $+q$ and $-q$ separated by vector $\mathbf d$ from negative to positive, $\mathbf p=q\mathbf d$. Far from the pair, the net-charge term vanishes, so dipole potential falls as $1/r^2$ and field as $1/r^3$. A neutral object can therefore exert substantial nearby electric effects while its distant field fades faster than a charged object's.

With the dipole along $z$, $V=k_ep\cos\theta/r^2$. Differentiating radially and angularly gives $E_r=2k_ep\cos\theta/r^3$ and $E_\theta=k_ep\sin\theta/r^3$. Along its positive axis, magnitude is $2k_ep/r^3$; on the equatorial plane it is $k_ep/r^3$ directed opposite $\mathbf p$. A single scalar distance law cannot specify these directions.

The next, quadrupole, term matters when monopole and dipole vanish or when higher accuracy is needed. Its coefficients describe second moments of the source, and potential falls as $1/r^3$. Estimating the neglected term by powers of source size divided by distance is a useful approximation check. Symmetry can remove some terms entirely, but one should establish that symmetry rather than assume every neutral object is a pure dipole.

## Dipoles in an external field

For a small permanent dipole in a nearly uniform external field, forces on its charges approximately cancel but produce torque

$$\boldsymbol\tau=\mathbf p\times\mathbf E,$$

and potential energy $U=-\mathbf p\cdot\mathbf E$. Alignment has lower energy than anti-alignment. The torque magnitude $pE\sin\theta$ equals minus the derivative of energy with respect to the relevant rotation angle.

In a nonuniform electrostatic field, a fixed dipole can also feel $\mathbf F=\nabla(\mathbf p\cdot\mathbf E)$, with $\mathbf p$ held fixed in taking the spatial derivative. For an induced dipole $\mathbf p=\alpha\mathbf E$ in a linear isotropic model, energy is instead $-\alpha E^2/2$ when the polarization response is assembled consistently. The half factor again reflects an induced response. A neutral polarizable object can be attracted into a stronger field even though its net charge is zero, explaining one mechanism of electrostatic attraction without invoking hidden net charge.

## Capacitance measures a geometry's ability to store separated charge

For two conductors carrying charges $+Q$ and $-Q$ with potential difference $\Delta V$, capacitance is $C=Q/\Delta V$ in a linear electrostatic arrangement. The farad is $\mathrm{C\,V^{-1}}$. Capacitance depends on geometry and materials; in the linear model it does not depend on the chosen value of $Q$.

For two large parallel plates of area $A$, separation $d$, and vacuum gap, neglect edges. Surface charge density is $Q/A$, field between is $Q/(\epsilon_0A)$, and $\Delta V=Ed$. Thus

$$C=\frac{\epsilon_0A}{d}.$$

For $A=0.010\,\mathrm{m^2}$ and $d=1.0\,\mathrm{mm}$, $C\approx8.85\times10^{-11}\,\mathrm F=88.5\,\mathrm{pF}$. At $100\,\mathrm V$, stored charge magnitude is $8.85\,\mathrm{nC}$. Farads are large units for small isolated geometries, so prefixes matter.

For a conducting sphere of radius $R$ relative to infinity, $V=k_eQ/R$, giving $C=4\pi\epsilon_0R$. A sphere can have capacitance without a nearby second plate because the reference is the distant environment. A real nearby environment changes the field and hence the measured capacitance.

To charge a capacitor gradually, transferring an increment $dq$ at potential $q/C$ requires work $dU=(q/C)dq$. Integrating gives

$$U=\frac{Q^2}{2C}=\frac12C(\Delta V)^2=\frac12Q\Delta V.$$

For the numerical plate example at $100\,\mathrm V$, energy is approximately $4.43\times10^{-7}\,\mathrm J$. The factor one-half appears because the voltage rises during charging. Multiplying final voltage by total charge assumes every increment moved against that final voltage and gives twice the actual assembly work.

## Field energy and what self-energy means

For a localized continuous charge distribution, electrostatic assembly energy is $U=\frac12\int\rho V\,dV$. Use $\rho=-\epsilon_0\nabla^2V$ and integration by parts. With the appropriate boundary term vanishing at infinity, one obtains

$$U=\frac{\epsilon_0}{2}\int|\nabla V|^2dV=\int\frac{\epsilon_0E^2}{2}\,dV.$$

The vacuum field energy density is $u_E=\epsilon_0E^2/2$. Boundary terms must be retained when electrodes or finite boundaries exchange work; the unqualified infinite-space formula is not a replacement for accounting for voltage sources.

A point charge's field makes this energy integral diverge near the source because $E^2$ scales as $1/r^4$ while shell volume scales as $r^2dr$. The integral contains $\int dr/r^2$, which diverges at zero radius. Classical point-charge self-energy is therefore not finite. For forces between separate point charges, one can subtract fixed individual self-energies and calculate finite interaction energy $\sum_{i<j}k_eq_iq_j/r_{ij}$. This operational subtraction should not be confused with a complete classical explanation of elementary-particle mass.

For a thin charged spherical shell of radius $R$, the field is zero inside and $k_eQ/r^2$ outside. Integrating its finite field energy gives $U=Q^2/(8\pi\epsilon_0R)=Q^2/(2C)$, consistent with its capacitance. Agreement between these methods is a useful independent check.

## Polarization and the separation of free and bound charge

A dielectric contains positive and negative charges that can shift slightly relative to one another or rotate as molecular dipoles. Define polarization $\mathbf P$ as dipole moment per volume, with units $\mathrm{C\,m^{-2}}$. A smoothly varying polarization produces bound volume charge

$$\rho_b=-\nabla\cdot\mathbf P,$$

and bound surface charge $\sigma_b=\mathbf P\cdot\hat{\mathbf n}$ at a boundary where the polarized medium ends. A uniform polarization has zero bound volume charge but generally nonzero surface charges. The sign follows from which end of the microscopic dipoles is exposed at the surface.

The total charge is free plus bound: $\rho=\rho_f+\rho_b$. Substitute in Gauss' law and rearrange:

$$\nabla\cdot(\epsilon_0\mathbf E+\mathbf P)=\rho_f.$$

Define the electric displacement field $\mathbf D=\epsilon_0\mathbf E+\mathbf P$. Then $\nabla\cdot\mathbf D=\rho_f$. This does not introduce a new fundamental force. It packages material polarization so that free charge, controlled by wires or electrodes, appears as the explicit source.

For a linear isotropic dielectric, $\mathbf P=\epsilon_0\chi_e\mathbf E$, where dimensionless susceptibility $\chi_e$ describes the material. Then $\mathbf D=\epsilon\mathbf E$ with $\epsilon=\epsilon_0(1+\chi_e)$. Anisotropic crystals need a tensor relating components, nonlinear media need higher-order response, and frequency-dependent or dissipative media need more than one real constant. A constant permittivity is a model with a regime of validity.

## Dielectric boundary conditions and energy accounting

A pillbox crossing an interface gives $D_{2n}-D_{1n}=\sigma_f$, where $\sigma_f$ is free surface charge and the normal points from medium 1 into medium 2. A narrow electrostatic loop across the interface gives continuity of tangential $E$. Normal $E$ need not be continuous because bound or free surface charge may be present. Matching $D_n$ without checking for free surface charge is just as wrong as demanding all components of $E$ match.

Fill an ideal parallel-plate capacitor with dielectric of relative permittivity $\epsilon_r$. Its capacitance increases to $\epsilon_rC_0$. If it is isolated, $Q$ stays fixed, voltage falls by $1/\epsilon_r$, and stored energy $Q^2/(2C)$ decreases. If held at fixed voltage by a battery, charge increases by $\epsilon_r$ and capacitor field energy $CV^2/2$ increases. The battery supplies energy; a mechanical attraction into the capacitor can coexist with this increased field energy because the full accounting includes battery work.

For a lossless linear material under the appropriate quasistatic assumptions, stored electrostatic energy density is $\frac12\mathbf E\cdot\mathbf D$. In a nonlinear material the assembly integral is instead an integral over the response path, and in a dispersive lossy medium separating stored energy from dissipation needs additional analysis. The compact density formula should not be treated as universal.

### Optional practice

1. Why does specifying $\rho=0$ in a box not determine its potential? Give two different solutions and the boundary data that distinguish them.
2. A charge $q$ is height $a$ over a grounded plane. Derive its attractive force and verify it by differentiating $U=-k_eq^2/(4a)$.
3. For the strip solution $V=V_0\sin(\pi x/L)e^{-\pi y/L}$, calculate both field components and verify Laplace's equation.
4. Derive the dipole moment of charges $\pm q$ separated by distance $d$, and compare axial and equatorial far-field magnitudes at the same radius.
5. A vacuum capacitor has $C_0=100\,\mathrm{pF}$ and initially $V_0=20\,\mathrm V$. Insert dielectric with $\epsilon_r=4$ while isolated. Find new capacitance, voltage, and energy ratio.
6. Repeat problem 5 while voltage remains fixed by a battery. Find final charge and capacitor-energy ratio, and identify the energy source.
7. A uniform polarization $\mathbf P=P_0\hat{\mathbf z}$ fills a slab. Find bound volume charge and bound charges on top and bottom surfaces.
8. Explain the key nonnegative-integral step in the Dirichlet uniqueness proof. Why does it establish uniqueness rather than existence?

Hints and solutions are in `../solutions/16-hints.md` and `../solutions/16-solutions.md`.

### Source connections

Feynman Volume II Chapters 6–8 and 10–12 connect potentials, energy, dielectrics, and boundary analogies. The explicit uniqueness proof, Fourier boundary construction, and multipole error reasoning develop methods needed for upper-undergraduate electromagnetism. The next chapter introduces moving charge and magnetic induction, where scalar electrostatic potential alone no longer describes the full electric field.
