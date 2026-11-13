# 15. Vector calculus and electrostatic fields

Rub a balloon and it can attract a nearby object without touching it. The force is not explained by Newton's laws alone: those laws relate force to motion but do not specify which forces exist. Electromagnetism supplies additional empirical laws. We begin with stationary charges, then develop the mathematical language needed to describe how their influence fills space.

The central question is how to calculate a field produced by many sources without repeatedly summing every microscopic force. Symmetry, flux, divergence, and potential will become complementary tools. Each tool compresses information differently, and knowing when a compressed description is sufficient is as important as knowing the formula.

## Charge, Coulomb's law, and the electric field

Electric charge comes in positive and negative varieties. Charge is conserved in observed ordinary processes: it can move between bodies, while the total in an isolated system remains fixed. The SI unit is the coulomb. The elementary charge magnitude is $e\approx1.602\times10^{-19}\,\mathrm C$; an electron has charge $-e$. Charge signs are conventional labels, while the attraction of opposite charges and repulsion of like charges are physical facts.

For two stationary point charges in vacuum, Coulomb's force on charge $q$ due to a source $Q$ is

$$\mathbf F=\frac1{4\pi\epsilon_0}\frac{qQ}{r^2}\hat{\mathbf r},$$

where $\hat{\mathbf r}$ points from source to test charge and $r$ is their separation. The constant $k_e=1/(4\pi\epsilon_0)\approx8.99\times10^9\,\mathrm{N\,m^2\,C^{-2}}$. The inverse-square law and the proportionality to charge are empirical inputs. We will derive consequences from them, not claim to derive them from geometry alone.

Define the electric field by $\mathbf E=\mathbf F/q$ for a sufficiently small test charge that does not significantly disturb the source arrangement. Then

$$\mathbf E(\mathbf r)=\frac1{4\pi\epsilon_0}\frac{Q}{r^2}\hat{\mathbf r}.$$

Field units are $\mathrm{N\,C^{-1}}$. A negative test charge feels a force opposite the field. The field exists as a useful local physical quantity even when no test charge is actually placed at the point. A source's field should not be confused with the force on the source itself.

For $Q=2.0\,\mathrm{nC}$ at the origin, at distance $0.30\,\mathrm m$ the field magnitude is $8.99\times10^9(2.0\times10^{-9})/(0.30)^2\approx200\,\mathrm{N\,C^{-1}}$. A charge $q=-3.0\,\mathrm{nC}$ there experiences magnitude $6.0\times10^{-7}\,\mathrm N$ directed toward the source. Check units before interpreting the sign: a field is not an energy or a potential.

## Superposition turns many sources into a field

In vacuum classical electromagnetism, fields from specified sources add linearly. For discrete charges at positions $\mathbf r_i$,

$$\mathbf E(\mathbf r)=k_e\sum_i q_i\frac{\mathbf r-\mathbf r_i}{|\mathbf r-\mathbf r_i|^3}.$$

The numerator supplies direction and one factor of distance; the denominator supplies three powers, leaving inverse-square magnitude. Evaluate components before adding. Adding magnitudes alone is valid only when the individual fields point along the same direction.

For two equal positive charges at $x=\pm a$, their fields cancel at the origin by symmetry. At a point $(0,y,0)$, the horizontal components cancel while vertical components add:

$$E_y=\frac{2k_eqy}{(a^2+y^2)^{3/2}}.$$

At $y=0$ the result vanishes, and for $y\gg a$ it approaches $2k_eq/y^2$, as expected for an unresolved total charge $2q$. At small nonzero $y$, it is approximately $2k_eqy/a^3$. These limiting checks test both geometry and algebra.

For a continuous distribution, replace a tiny charge by $dq=\lambda\,dl$ on a line, $dq=\sigma\,dA$ on a surface, or $dq=\rho\,dV$ in a volume. The symbols have different units: $\lambda$ is coulombs per metre, $\sigma$ coulombs per square metre, and $\rho$ coulombs per cubic metre. In this chapter $\rho$ means charge density rather than mass density; the physical meaning must accompany notation.

For example, a uniformly charged ring of radius $a$ and total charge $Q$ gives an axial field

$$E_z(z)=k_e\int\frac{z\,dq}{(a^2+z^2)^{3/2}}=\frac{k_eQz}{(a^2+z^2)^{3/2}}.$$

Each element has the same source distance and axial projection, so those factors leave the integral. Transverse components cancel around the ring. At $z=0$ the field vanishes although potential will not. Field zero does not imply an absence of charge elsewhere.

## A scalar potential and the gradient

For a point charge, the potential energy of test charge $q$ with zero at infinity is $U=k_eQq/r$. Define electric potential $V=U/q$, measured in volts, where $1\,\mathrm V=1\,\mathrm{J\,C^{-1}}$. Potential is energy per charge, not electric force per charge.

Suppose a differentiable scalar field $V(x,y,z)$ is sampled at nearby points. The chain rule gives the first-order change

$$dV=\frac{\partial V}{\partial x}dx+\frac{\partial V}{\partial y}dy+\frac{\partial V}{\partial z}dz.$$

Collect the three slopes into the gradient,

$$\nabla V=\left(\frac{\partial V}{\partial x},\frac{\partial V}{\partial y},\frac{\partial V}{\partial z}\right),\qquad dV=\nabla V\cdot d\mathbf r.$$

The gradient points in the direction of greatest local increase of $V$ and has units of potential per length. In electrostatics,

$$\mathbf E=-\nabla V.$$

The minus sign says a positive charge accelerates toward decreasing potential energy. For $V=Ax^2+By$, the field is $(-2Ax,-B,0)$, with coefficients carrying the required units. If $A=3\,\mathrm{V\,m^{-2}}$ and $B=4\,\mathrm{V\,m^{-1}}$, then at $x=2\,\mathrm m$ the field is $(-12,-4,0)\,\mathrm{V\,m^{-1}}$. The equivalence $\mathrm{V\,m^{-1}}=\mathrm{N\,C^{-1}}$ follows from energy being force times distance.

Adding any constant to $V$ leaves $\mathbf E$ unchanged. Only potential differences determine work on a fixed charge. For an infinite line charge one cannot set a finite potential zero at infinity because the relevant logarithm diverges; a finite reference radius is needed. A reference choice is not a change in physical field.

## Line integrals accumulate local work

A line integral adds a field's tangential contribution along a path. Parameterize the path by $s$, with position $\mathbf r(s)$. Then

$$\int_A^B\mathbf E\cdot d\mathbf r=\int_{s_A}^{s_B}\mathbf E[\mathbf r(s)]\cdot\frac{d\mathbf r}{ds}\,ds.$$

For an electrostatic field this equals $V(A)-V(B)$. The field's work on charge $q$ is $q[V(A)-V(B)]$, and the change in its potential energy is the negative of that. The path independence follows because integrating $\nabla V\cdot d\mathbf r$ integrates the total derivative $dV/ds$. Returning to the starting point gives zero circulation, $\oint\mathbf E\cdot d\mathbf r=0$.

For a uniform field $\mathbf E=E_0\hat{\mathbf x}$, moving from $(0,0)$ to $(a,b)$ gives integral $E_0a$ regardless of whether one goes directly or along two sides of a rectangle. The part perpendicular to the field contributes zero. An induced electric field from a changing magnetic flux will later violate this electrostatic circulation condition, so the same scalar-potential-only description will no longer suffice.

## Flux: how much field passes through a surface?

For a small flat surface with unit normal $\hat{\mathbf n}$, define electric flux as $\mathbf E\cdot\hat{\mathbf n}\,dA$. It uses the normal component, not the component along the surface. For a curved surface, divide it into small patches and integrate:

$$\Phi_E=\int_S\mathbf E\cdot d\mathbf A,\qquad d\mathbf A=\hat{\mathbf n}\,dA.$$

For a closed surface choose outward normals. Flux can be positive, negative, or zero. It is a mathematical measure of a field through a surface, not a fluid of electric field material flowing across it. Field lines can help visualize direction and relative strength, but the number of lines drawn is a plotting convention.

For a point charge at the centre of a sphere of radius $r$, field is radial and constant in magnitude on the sphere. Its flux is $E(4\pi r^2)=Q/\epsilon_0$. The factors of radius cancel because the inverse-square decrease matches the sphere's area growth. The same total holds for any closed surface enclosing the charge. A patch seen from the charge subtends solid angle $d\Omega=(\hat{\mathbf r}\cdot\hat{\mathbf n})dA/r^2$, so its flux is $Qd\Omega/(4\pi\epsilon_0)$. A closed enclosing surface subtends total oriented solid angle $4\pi$.

Charges outside a closed surface contribute zero net flux: their field enters some portions and leaves others with compensating contributions. Superposition therefore yields Gauss' law,

$$\oint_S\mathbf E\cdot d\mathbf A=\frac{Q_{\rm enclosed}}{\epsilon_0}.$$

The law is general for electrostatic charge distributions. Using it to determine the field algebraically requires enough symmetry to know the field's direction and constancy on useful portions of the chosen surface. Zero enclosed charge means zero net flux, not zero field.

## Gauss' law used well: spheres, cylinders, and planes

For a spherically symmetric charge distribution, rotational symmetry forces $\mathbf E=E(r)\hat{\mathbf r}$. A concentric sphere gives

$$E(r)=\frac{Q_{\rm enc}(r)}{4\pi\epsilon_0r^2}.$$

For a solid sphere of radius $R$ and uniform charge density $\rho$, the enclosed charge for $r<R$ is $\rho(4\pi r^3/3)$, so $E=\rho r/(3\epsilon_0)$. Outside, the whole charge acts as if concentrated at the centre. The inside field grows linearly, remains finite at the centre, and joins continuously to the outside value at $R$ when no additional surface sheet is present.

For an infinitely long uniform line charge, translational and cylindrical symmetry give a radial field depending only on radius. A coaxial cylinder of radius $r$ and length $L$ has flux only through its curved side, so $E(2\pi rL)=\lambda L/\epsilon_0$ and

$$E(r)=\frac{\lambda}{2\pi\epsilon_0r}.$$

The $1/r$ dependence differs from a point charge's $1/r^2$ because cylindrical area grows linearly in radius for fixed length. A long finite wire resembles the infinite model only at distances small relative to its length and far from its ends.

For an infinite uniform sheet of surface charge density $\sigma$, reflection and translation symmetry imply equal-magnitude perpendicular fields on the two sides. A thin pillbox has two contributing flat faces, giving $2EA=\sigma A/\epsilon_0$ and $E=\sigma/(2\epsilon_0)$. For a positive sheet, fields point away from it on both sides. Two opposite sheets make the fields add between them and cancel outside, in the ideal infinite-plane approximation.

For $\sigma=1.0\,\mathrm{nC\,m^{-2}}$, a single sheet gives approximately $56.5\,\mathrm{N\,C^{-1}}$. Between equal and opposite sheets the magnitude is approximately $113\,\mathrm{N\,C^{-1}}$. Finite plates have edge fields, so the uniform-field approximation works best well inside a small separation compared with plate dimensions.

## Divergence makes Gauss' law local

Take a tiny rectangular box with sides $dx,dy,dz$. The outward flux through the two faces normal to $x$ is approximately

$$[E_x(x+dx)-E_x(x)]dy\,dz\approx\frac{\partial E_x}{\partial x}dx\,dy\,dz.$$

Adding the other pairs gives total outward flux per volume

$$\nabla\cdot\mathbf E=\frac{\partial E_x}{\partial x}+\frac{\partial E_y}{\partial y}+\frac{\partial E_z}{\partial z}.$$

Divergence measures a local source density in the field, not simply whether vectors drawn nearby look spread out. For $\mathbf F=(ax,ay,az)$ it is $3a$. For $\mathbf F=(-ay,ax,0)$ it is zero even though the field varies from point to point.

Adding fluxes of adjacent boxes cancels contributions on shared interior faces. Only the exterior survives. Taking a limit gives the divergence theorem,

$$\int_V\nabla\cdot\mathbf E\,dV=\oint_{\partial V}\mathbf E\cdot d\mathbf A.$$

The theorem applies to sufficiently regular fields and regions; singular sources need explicit treatment. Combining it with Gauss' law for arbitrary small volumes gives the local equation

$$\nabla\cdot\mathbf E=\frac{\rho}{\epsilon_0}.$$

For a point charge, ordinary divergence is zero everywhere away from the charge, while the flux through an enclosing sphere is nonzero. There is no contradiction: the field is singular at the source, so a smooth-field theorem cannot be applied across that point without accounting for it. A Dirac delta is a generalized density defined by its integrals: $\int\delta^3(\mathbf r)f(\mathbf r)dV=f(0)$. In that language $\rho=q\delta^3(\mathbf r)$ and the singular source is included. Beginners can instead exclude a small sphere and keep its boundary flux explicitly.

## Curl measures local circulation

For a small rectangle in the $xy$ plane, add the tangential field integrals around its edges, traversed counterclockwise when viewed from $+z$. Terms cancel to first order except

$$\oint\mathbf E\cdot d\mathbf r\approx\left(\frac{\partial E_y}{\partial x}-\frac{\partial E_x}{\partial y}\right)dx\,dy.$$

This motivates the $z$ component of curl. The full curl is

$$\nabla\times\mathbf E=\left(\frac{\partial E_z}{\partial y}-\frac{\partial E_y}{\partial z},\frac{\partial E_x}{\partial z}-\frac{\partial E_z}{\partial x},\frac{\partial E_y}{\partial x}-\frac{\partial E_x}{\partial y}\right).$$

Its direction follows the right-hand orientation of circulation. For $\mathbf F=(-ay,ax,0)$, the curl is $(0,0,2a)$, matching a field that circulates counterclockwise about the axis for $a>0$. This is different information from divergence, which is zero for the same field.

Tiling a surface with oriented little rectangles cancels integrals on shared edges. The remaining outer edge yields Stokes' theorem,

$$\int_S(\nabla\times\mathbf E)\cdot d\mathbf A=\oint_{\partial S}\mathbf E\cdot d\mathbf r.$$

The orientation of surface normal and boundary traversal must be linked by the right-hand rule. Electrostatic circulation vanishes, so $\nabla\times\mathbf E=0$ in smooth regions. Conversely, a curl-free field admits a single-valued potential throughout a suitably simply connected region. Without the topological qualification, zero local curl alone can miss circulation around an excluded singularity. This is an example where a theorem's domain hypothesis matters physically.

## Potential and Poisson's equation

Substitute $\mathbf E=-\nabla V$ into Gauss' local law:

$$\nabla^2V=-\frac{\rho}{\epsilon_0},\qquad \nabla^2V=\frac{\partial^2V}{\partial x^2}+\frac{\partial^2V}{\partial y^2}+\frac{\partial^2V}{\partial z^2}.$$

This is Poisson's equation. In a charge-free region it becomes Laplace's equation, $\nabla^2V=0$. A charge-free region can have a strong nonzero field, determined by charges and boundaries elsewhere. For example $V=-E_0x$ satisfies Laplace's equation and gives a uniform field.

The potential for a localized charge distribution with zero at infinity is

$$V(\mathbf r)=k_e\int\frac{\rho(\mathbf r')}{|\mathbf r-\mathbf r'|}\,dV'.$$

Primes label source coordinates; the unprimed position is the observation point. Keeping them distinct prevents differentiating with respect to the wrong variable. Potential is often easier to integrate than a vector field, after which one takes its gradient. Differentiating is not always easier numerically near singularities; both approaches require care where the source density is sharply concentrated.

## Conductors in electrostatic equilibrium

Charges in a conductor can move. If an internal electrostatic field persisted, mobile charge would accelerate and redistribute, so equilibrium requires zero macroscopic field inside the conducting material. The conductor is therefore an equipotential: moving along it changes no potential. Excess charge resides on its surface in the ideal macroscopic model.

A Gaussian pillbox crossing the surface gives the normal-field jump

$$E_{{\rm out},n}-E_{{\rm in},n}=\frac{\sigma}{\epsilon_0}.$$

For a conductor $E_{{\rm in},n}=0$, so just outside $E_n=\sigma/\epsilon_0$. This differs by a factor of two from the isolated infinite sheet because a conductor surface has a different field on its inner side. Boundary conditions are statements about the complete physical arrangement, not universal replacements for geometry.

An empty cavity completely enclosed by an equilibrium conductor has zero field if there is no charge inside it. Charges on the outer surface arrange to maintain the conductor's potential; uniqueness of the interior boundary problem, developed next chapter, establishes the cavity result. A charge inside a cavity produces induced charges on its inner wall and an internal field, so the empty-cavity condition is essential.

## Reconstructing a sphere's potential from its field

The uniformly charged sphere illustrates the difference between a vanishing field and a vanishing potential. Set $V(\infty)=0$. Outside, integrating the radial field gives $V(r)=k_eQ/r$. At the surface this is $k_eQ/R$. Inside, use the field already derived and integrate inward from the known surface value:

$$V(r)-V(R)=-\int_R^r\frac{k_eQr'}{R^3}\,dr'=\frac{k_eQ}{2R^3}(R^2-r^2).$$

Therefore $V(r)=k_eQ(3R^2-r^2)/(2R^3)$ for $r<R$. At the centre, $V(0)=3k_eQ/(2R)$, which is nonzero, while the gradient vanishes and hence the field is zero. A stationary positive test charge placed exactly at the centre experiences zero net electric force, but a positive displacement gives an outward force for $Q>0$, so the equilibrium is unstable.

This calculation also provides two independent consistency checks. Differentiating the inside potential recovers the inside field, and inserting $r=R$ gives the same surface potential as the outside formula. Potential is continuous across this finite surface-density-free charge boundary. Its second derivatives change because the volume charge density changes. If a proposed answer has a potential jump here, or gives a nonzero directional field at the centre of a spherical distribution, it violates the physical structure of the problem.

## Choosing a method before calculating

Use direct superposition when source geometry is simple enough for integration or when only a few charges are present. Use Gauss' law to extract a field when high symmetry fixes the unknown field over a convenient surface. Use potential when adding scalars is easier than adding vectors, or when boundary values rather than source charges are specified. Use divergence and curl to connect local laws to global integrals and to identify which information is still missing.

The equations $\nabla\cdot\mathbf E=\rho/\epsilon_0$ and $\nabla\times\mathbf E=0$ do not by themselves specify a unique field without suitable boundary conditions. Adding a uniform field changes neither equation in an empty region. A physical problem must say what electrodes, distant sources, or asymptotic conditions are present. Chapter 16 turns those boundary conditions into solved examples rather than leaving them as an afterthought.

### Optional practice

1. Find the electric field at $0.20\,\mathrm m$ from a $-1.0\,\mathrm{nC}$ point charge, including direction.
2. For two equal charges at $x=\pm a$, derive the axial-perpendicular field formula at $(0,y,0)$ and check its far-distance limit.
3. If $V=Axy$ with $A$ in volts per square metre, calculate the field, its divergence, and its curl. Is there volume charge in this region?
4. A uniformly charged solid sphere has total charge $Q$ and radius $R$. Derive the field inside and outside; explain its behavior at $r=0$ and $r=R$.
5. A uniform field crosses a closed cube. Show by paired faces why its net flux is zero even though the field is nonzero.
6. Calculate the divergence and curl of $\mathbf F=(-ay,ax,bz)$. Explain the distinct roles of $a$ and $b$.
7. Two infinite opposite sheets carry $\pm2.0\,\mathrm{nC\,m^{-2}}$ and are separated by $0.010\,\mathrm m$. Find the ideal field between them and potential difference magnitude.
8. Why does zero ordinary divergence away from a point charge not imply zero flux through a surrounding sphere? Give either an excluded-boundary or delta-density explanation.

Hints and solutions are in `../solutions/15-hints.md` and `../solutions/15-solutions.md`.

### Source connections

Feynman Volume II Chapters 1–6 connect fields, vector calculus, Coulomb forces, and Gauss' law; Chapters 7–8 connect potentials and energy. This course supplies the geometric derivations before using the compressed vector notation. The companion's electrostatic field experiment can connect vector arrows and equipotentials, while its output remains a calculation under an ideal source model rather than a measurement.
