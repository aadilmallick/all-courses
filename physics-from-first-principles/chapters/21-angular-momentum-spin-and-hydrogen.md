# 21. Angular momentum, spin and the hydrogen atom

A hydrogen atom emits sharply defined colors. A beam of silver atoms can split into separate traces in a magnetic-field gradient. An electron in an atom cannot be described adequately as a small planet on a small orbit. To connect these observations, we need a language for rotations that works for wavefunctions, including forms of angular momentum with no classical spinning-object picture.

The central question is this: how does rotational symmetry organize the allowed states and measurable quantities of a quantum system? We start with orbital angular momentum, derive the algebra it obeys, introduce the new empirical degree of freedom called spin, and then solve the main structure of hydrogen. This is the nonrelativistic, isolated-atom model. Fine structure, hyperfine structure, finite nuclear size, and radiative corrections improve it; they are not hidden inside the basic formula.

## Why three-dimensional probability needs a volume element

For a particle in space, normalization is $\int|\psi(\mathbf r)|^2d^3r=1$. Spherical coordinates describe a point by its distance $r\ge0$, polar angle $0\le\theta\le\pi$ measured from the positive $z$ axis, and azimuth $0\le\varphi<2\pi$ around that axis:

$$x=r\sin\theta\cos\varphi,\quad
y=r\sin\theta\sin\varphi,\quad z=r\cos\theta.$$

A small radial change gives length $dr$; a polar-angle change gives arc length $r\,d\theta$; an azimuthal change gives arc length $r\sin\theta\,d\varphi$. Multiplying these three locally perpendicular lengths gives

$$d^3r=r^2\sin\theta\,dr\,d\theta\,d\varphi.$$

The factor is part of the measure, not part of the probability amplitude by definition. Leaving it out overweights points near the origin. Define the solid-angle element $d\Omega=\sin\theta\,d\theta\,d\varphi$. Its integral over a sphere is $4\pi$, since $\int_0^{2\pi}d\varphi=2\pi$ and $\int_0^\pi\sin\theta d\theta=2$.

For a spherically symmetric state $\psi=Ae^{-r/a}$, the normalization is

$$1=4\pi|A|^2\int_0^\infty r^2e^{-2r/a}dr.$$

Repeated integration by parts gives $\int_0^\infty r^ne^{-br}dr=n!/b^{n+1}$ for nonnegative integer $n$ and (b>0). Here $n!=1\cdot2\cdots n$, with (0!=1). The boundary terms vanish because exponential decay eventually dominates a finite power. For (n=2,b=2/a), the integral is (a^3/4), so $A=1/\sqrt{\pi a^3}$ is a real positive choice.

Even though the density is largest at the origin, the probability in a shell of radius $r$ and thickness $dr$ is proportional to $r^2e^{-2r/a}dr$. The shell area grows with $r$. A density per unit volume and a density per unit radius answer different questions.

## Angular momentum as a generator of rotations

Classically $\mathbf L=\mathbf r\times\mathbf p$. In the position representation, use $\mathbf p=-i\hbar\nabla$. The $z$ component is

$$\hat L_z=\hat x\hat p_y-\hat y\hat p_x
=-i\hbar\left(x\frac\partial{\partial y}-y\frac\partial{\partial x}\right)
=-i\hbar\frac\partial{\partial\varphi}.$$

To see the last equality, vary $\varphi$ at fixed $r,\theta$: $\partial x/\partial\varphi=-y$, $\partial y/\partial\varphi=x$. The multivariable chain rule gives $\partial_\varphi=-y\partial_x+x\partial_y$.

An infinitesimal rotation changes the argument of a wavefunction. Expanding that change to first order produces an operator proportional to $L_z$. For a finite active rotation through angle $\alpha$, one convention is $U_z(\alpha)=e^{-i\alpha L_z/\hbar}$. This exponential is defined by its convergent power series on suitable states, or by acting on eigenstates. If $L_z|m\rangle=\hbar m|m\rangle$, then $U_z|m\rangle=e^{-im\alpha}|m\rangle$.

Angular momentum is therefore linked to how a state changes under rotation. This meaning survives even when $\mathbf r\times\mathbf p$ does not describe the entire angular momentum. Spin will be the important example.

The canonical commutators $[x_i,p_j]=i\hbar\delta_{ij}$, with coordinates mutually commuting and momenta mutually commuting, imply

$$[L_x,L_y]=i\hbar L_z,$$

with cyclic permutations. The symbol $\delta_{ij}$ equals one when $i=j$, zero otherwise. As an example of the algebra, one term is $[yp_z,zp_x]=y[p_z,z]p_x=-i\hbar yp_x$; the other nonzero terms combine into $i\hbar(xp_y-yp_x)$. Keeping operator order matters. Numbers commute; operators need not.

Because $[L_x,L_y]\ne0$, no state can generally have sharp values for all three components. The squared magnitude

$$L^2=L_x^2+L_y^2+L_z^2$$

does commute with each component. We may therefore seek simultaneous eigenstates of $L^2$ and one chosen component, usually (L_z). Choosing the $z$ axis is a coordinate or apparatus choice; an isolated atom does not carry a uniquely preferred axis.

## The ladder argument rather than a memorized list

It is useful to derive allowed angular-momentum labels abstractly. Write a general angular momentum as $\mathbf J$, obeying the same commutators. Define

$$J_\pm=J_x\pm iJ_y.$$

Using the commutators gives $[J_z,J_\pm]=\pm\hbar J_\pm$ and $[J^2,J_\pm]=0$. If a state has component eigenvalue $\hbar m$, applying $J_+$ changes it to $\hbar(m+1)$, unless the result is zero. The total squared magnitude remains unchanged.

Let the $J^2$ eigenvalue be $\hbar^2\lambda$. The norm squared of the raised state is

$$\|J_+|\lambda,m\rangle\|^2
=\langle J_-J_+\rangle
=\hbar^2[\lambda-m(m+1)].$$

It cannot be negative. Repeatedly raising $m$ must terminate at a highest value (j); otherwise the negative quadratic term eventually makes the norm negative. At the top the norm is zero, so $\lambda=j(j+1)$. The lowering process similarly terminates at $m=-j$. Since each step changes $m$ by one, the number of steps between endpoints is (2j), a nonnegative integer. Consequently

$$j=0,\frac12,1,\frac32,\ldots,\qquad
m=-j,-j+1,\ldots,j.$$

The normalized raising formula is

$$J_+|j,m\rangle=\hbar\sqrt{j(j+1)-m(m+1)}\,|j,m+1\rangle.$$

This is an algebraic result under the stated representation assumptions. It tells us which angular-momentum multiplets are possible. Which multiplet a given particle has is physical input. Orbital angular momentum of an ordinary single-valued scalar wavefunction has integer (j=l); intrinsic spin can have half-integer values.

The common picture of a vector with fixed length and a definite $z$ projection is only a mnemonic. For an eigenstate $|j,m\rangle$, the magnitude measurement gives $\hbar\sqrt{j(j+1)}$, while the selected component gives $\hbar m$. There are not simultaneously sharp unmeasured $x$ and $y$ components hiding in the diagram.

## Spherical harmonics as angular standing waves

For a central potential (V$r$), separating radial and angular dependence leads to

$$\psi(r,\theta,\varphi)=R(r)Y_l^m(\theta,\varphi).$$

The functions (Y_l^m), spherical harmonics, are normalized angular eigenfunctions:

$$L^2Y_l^m=\hbar^2l(l+1)Y_l^m,\qquad
L_zY_l^m=\hbar mY_l^m.$$

Their name expresses the connection to standing waves on a sphere. The simplest is $Y_0^0=1/\sqrt{4\pi}$, constant in direction. For (l=1), useful choices are

$$Y_1^0=\sqrt{\frac3{4\pi}}\cos\theta,\qquad
Y_1^{\pm1}=\mp\sqrt{\frac3{8\pi}}\sin\theta,e^{\pm i\varphi}.$$

Differentiating with $-i\hbar\partial_\varphi$ verifies the $m$ values. Integrating their squared magnitudes with $d\Omega$ verifies normalization. For example, $\int\cos^2\theta d\Omega=4\pi/3$, canceling the prefactor in $|Y_1^0|^2$.

Single-valuedness under $\varphi\to\varphi+2\pi$ requires $e^{2\pi im}=1$, so $m$ is integer for these scalar orbital functions. Regularity at the polar axes and square integrability select integer $l\ge|m|$. The full angular differential equation is

$$-\left[\frac1{\sin\theta}\frac\partial{\partial\theta}
\left(\sin\theta\frac\partial{\partial\theta}\right)
+\frac1{\sin^2\theta}\frac{\partial^2}{\partial\varphi^2}\right]Y
=l(l+1)Y.$$

This equation and its endpoint conditions define the allowed angular shapes. A general orbital can be a linear combination. The familiar real (p_x,p_y,p_z) shapes are combinations of the complex (l=1) basis; their labels do not mean that an electron follows a little figure-eight trajectory.

## Spin is an additional state space

An electron has intrinsic spin (s=1/2). This means that spin-component measurements and rotations are described by a two-dimensional angular-momentum representation. It is not inferred by treating an electron as a small rigid sphere rotating faster and faster. That classical model is not the definition and gives misleading expectations.

Choose $|+z\rangle=(1,0)^T$, $|-z\rangle=(0,1)^T$. The spin operators are $S_i=\hbar\sigma_i/2$, where the Pauli matrices are

$$\sigma_x=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad
\sigma_y=\begin{pmatrix}0&-i\\i&0\end{pmatrix},\quad
\sigma_z=\begin{pmatrix}1&0\\0&-1\end{pmatrix}.$$

Multiplying matrices verifies $[S_x,S_y]=i\hbar S_z$ and $S^2=3\hbar^2I/4$. The eigenvalues of any chosen component are $\pm\hbar/2$. Its magnitude is $\sqrt3\hbar/2$, not $\hbar/2$.

Solve $\sigma_xv=v$: the two entries must be equal. Normalization gives $|+x\rangle=(|+z\rangle+|-z\rangle)/\sqrt2$. A particle prepared in $|+z\rangle$ therefore gives $S_x=+\hbar/2$ with probability $|\langle+x|+z\rangle|^2=1/2$, and the negative result with probability $1/2$. If we select the positive $x$ output and measure $z$ again, both $z$ outcomes occur. The intervening selection changed the state. It did not reveal a simultaneously sharp $x$ label already compatible with the original sharp $z$ state.

We can also vary the measurement direction continuously. Let a new direction lie in the $xz$ plane at angle $\theta$ from positive $z$. Its spin component is $S_{\mathbf n}=S_z\cos\theta+S_x\sin\theta$. Multiplying its matrix by the normalized column $(\cos(\theta/2),\sin(\theta/2))^T$ verifies that this column is the positive-component eigenstate: the angle-addition identities reduce the two resulting entries to the original entries times $\hbar/2$. A particle prepared in $|+z\rangle$ therefore gives the positive result along the new direction with probability $\cos^2(\theta/2)$. The negative-result probability is $\sin^2(\theta/2)$, and the two add to one.

This angular dependence makes useful checks possible. Identical axes give certainty; perpendicular axes give equal probabilities; reversing the axis gives the opposite component with certainty. The half angle belongs to the state amplitudes, whereas the apparatus direction turns through the full angle. We have derived the probabilities by projection in a two-dimensional state space, without assigning a hidden classical orientation to each electron. The same calculation applies whenever a two-state system realizes this spin algebra, although the physical apparatus coupling to that system must be specified separately.

A spinor changes sign under a $2\pi$ rotation: $U_z(2\pi)=e^{-i\pi\sigma_z}=-I$. For an isolated spin state this is an overall phase and gives unchanged probabilities. Relative phases between differently rotated paths can be observable. Saying that the sign alone changes all probabilities would confuse a state vector with its physical ray.

## Magnetic coupling and precession

An angular momentum often carries a magnetic moment. For electron spin, define the positive Bohr magneton $\mu_B=e\hbar/(2m_e)$, where $e>0$ is the elementary-charge magnitude. The magnetic moment is approximately

$$\boldsymbol\mu_s=-g_s\mu_B\frac{\mathbf S}{\hbar},$$

with $g_s\approx2$ adequate for this model. The minus sign is associated with the electron's negative charge. The interaction energy is $H_B=-\boldsymbol\mu\cdot\mathbf B$. In a uniform $z$-directed field,

$$H_B=g_s\mu_BB\frac{S_z}{\hbar},\qquad
E_\pm=\pm\frac{g_s\mu_BB}{2}.$$

The energy separation is $g_s\mu_BB$. The higher-energy spin component is not automatically the one whose magnetic moment points along the field; electron spin and moment point oppositely. Keeping the charge sign explicit prevents that confusion.

If the initial state is $|+x\rangle$, its two $z$ amplitudes accumulate phases $e^{-iE_\pm t/\hbar}$. Their relative phase changes at angular frequency $\omega_L=g_s\mu_BB/\hbar$. Direct matrix multiplication gives $\langle S_x\rangle=(\hbar/2)\cos\omega_Lt$ and $\langle S_y\rangle=(\hbar/2)\sin\omega_Lt$ for the Hamiltonian sign above. This is quantum precession of expectation values. A field gradient adds a position-dependent energy and can spatially separate components; a uniform field by itself changes phases rather than separating the beam.

## The hydrogen Hamiltonian

For an electron and proton, separating the center-of-mass motion leaves a relative-coordinate problem with reduced mass

$$\mu=\frac{m_em_p}{m_e+m_p}.$$

This is the same two-body reduction used in classical mechanics. Approximating $\mu\approx m_e$ is good at the level of about one part in two thousand for hydrogen energies, but the reduced mass matters for precision or isotope comparisons.

Define $C=e^2/(4\pi\epsilon_0)$. The relative Hamiltonian is

$$H=-\frac{\hbar^2}{2\mu}\nabla^2-\frac Cr.$$

The Laplacian in spherical coordinates separates into a radial piece and an angular piece:

$$\nabla^2=\frac1{r^2}\frac\partial{\partial r}
\left(r^2\frac\partial{\partial r}\right)-\frac{L^2}{\hbar^2r^2}.$$

Using an angular eigenfunction replaces $L^2$ by $\hbar^2l(l+1)$. Introduce $u(r)=rR(r)$. Differentiating shows that the radial equation becomes

$$-\frac{\hbar^2}{2\mu}u''+
\left[\frac{\hbar^2l(l+1)}{2\mu r^2}-\frac Cr\right]u=Eu.$$

The first bracketed term is a centrifugal barrier. It arises from angular variation of the wavefunction; it does not require a classical orbit. The radial normalization becomes $\int_0^\infty|u|^2dr=1$, assuming the angular function has unit norm. The ordinary regular bound-state solution has $u(0)=0$ and decays at infinity.

## Deriving the bound-state energy scale

For (l=0), try $\psi=Ae^{-r/a}$. For a radial function,

$$\nabla^2e^{-r/a}=\left(\frac1{a^2}-\frac2{ar}\right)e^{-r/a}.$$

Substitution gives

$$H\psi=\left[-\frac{\hbar^2}{2\mu a^2}+
\frac1r\left(\frac{\hbar^2}{\mu a}-C\right)\right]\psi.$$

To make the coefficient a constant energy, set the (1/r) coefficient to zero. This defines the reduced-mass Bohr radius

$$a_0=\frac{\hbar^2}{\mu C},\qquad
E_1=-\frac{\mu C^2}{2\hbar^2}=-\frac{C}{2a_0}.$$

Using $\mu\approx m_e$, $a_0\approx5.29\times10^{-11}\,\mathrm m$ and $E_1\approx-13.6\,\mathrm{eV}$. Negative energy is measured relative to an electron and proton at rest infinitely separated. It does not mean negative kinetic energy; the attractive potential contribution is more negative than the positive kinetic contribution.

The normalized ground state is

$$\psi_{100}=\frac{e^{-r/a_0}}{\sqrt{\pi a_0^3}}.$$

Its radial probability density is $P_r=4r^2e^{-2r/a_0}/a_0^3$. Setting its derivative to zero gives a maximum at (r=a_0). Its mean radius is $3a_0/2$, using the exponential moment integral established earlier. The most probable radius, mean radius, and point of maximum volume density are three different quantities.

For general negative $E$, define $\kappa=\sqrt{-2\mu E}/\hbar$, $\rho=2\kappa r$, and $\eta=1/(\kappa a_0)$. The radial equation is

$$\frac{d^2u}{d\rho^2}+
\left[-\frac14+\frac\eta\rho-\frac{l(l+1)}{\rho^2}\right]u=0.$$

Near zero the regular behavior is $u\sim\rho^{l+1}$; at large distance the decaying behavior is $e^{-\rho/2}$. Factor both out: $u=\rho^{l+1}e^{-\rho/2}v(\rho)$. Substitution and collection of derivatives gives

$$\rho v''+(2l+2-\rho)v'+(\eta-l-1)v=0.$$

Try a power series $v=\sum_{q=0}^\infty a_q\rho^q$. Matching each power gives

$$a_{q+1}=\frac{q+l+1-\eta}{(q+1)(q+2l+2)}a_q.$$

The acceptable bound-state branch terminates as a polynomial: otherwise the regular series develops an exponentially growing contribution at infinity. Termination at degree $N\ge0$ requires $\eta=N+l+1=n$. Hence

$$E_n=-\frac{\mu C^2}{2\hbar^2n^2},\qquad
n=1,2,\ldots,\quad l=0,1,\ldots,n-1.$$

The series argument explains the extra principal quantum number and the restriction on $l$. The termination condition is a normalizability condition. Naming the resulting polynomials would not by itself explain why only those energies work.

## Spectra, degeneracy and corrections

In this model the energy depends on $n$ only. For each $l$, there are $2l+1$ orbital $m$ states. Adding them for $l=0$ through $n-1$ gives $n^2$. Including the electron's two spin states gives $2n^2$ states at a given hydrogenic energy before smaller interactions split them. This degeneracy is special to the Coulomb model; a general central potential retains independence from $m$ but can depend on $l$.

For a transition $n=3\to2$, the emitted photon energy is

$$\Delta E=13.6\left(\frac14-\frac19\right)\mathrm{eV}
\approx1.89\,\mathrm{eV}.$$

Using $hc\approx1240\,\mathrm{eV\,nm}$ gives $\lambda=hc/\Delta E\approx656\,\mathrm{nm}$. The relation uses the energy difference, not the negative value of either level alone. The electron plus radiation conserves energy; the isolated electron state is not closed during emission.

Not every pair of states couples equally strongly to light. In the electric-dipole approximation, transition strength involves matrix elements $\langle f|\mathbf r|i\rangle$. Position is odd under spatial inversion. Since orbital parity is $(-1)^l$, the dipole integral vanishes for equal parity. Detailed angular integration gives $\Delta l=\pm1$, $\Delta m=0,\pm1$, with polarization determining the allowed component. These are dipole selection rules, not absolute bans on every possible higher-order process. The spin is unchanged by an electric-dipole operator in the basic spin-independent approximation.

Corrections introduce additional physics. Relativistic motion and spin-orbit interaction contribute to fine structure. Coupling electron and nuclear magnetic moments produces hyperfine structure. Quantum electrodynamics produces radiative shifts. Their smallness relative to the leading Coulomb binding energy makes a hierarchy of models useful. They also show why a leading-order formula should not be presented with unjustified precision.

## Combining angular momenta

If orbital and spin degrees of freedom are both present, total angular momentum is $\mathbf J=\mathbf L+\mathbf S$. The product basis $|l,m_l\rangle|s,m_s\rangle$ makes (L_z,S_z) sharp. A coupled basis $|j,m_j\rangle$ makes (J^2,J_z) sharp. Both span the same space; changing basis does not create extra states.

For two spins one half, the four product states reorganize into a triplet $j=1$ and a singlet $j=0$:

$$|1,1\rangle=|++\rangle,\quad
|1,0\rangle=\frac{|+-\rangle+|-+\rangle}{\sqrt2},\quad
|1,-1\rangle=|--\rangle,$$
$$|0,0\rangle=\frac{|+-\rangle-|-+\rangle}{\sqrt2}.$$

Apply the total raising operator $J_+=S_{1+}+S_{2+}$ to the singlet. The two contributions cancel, confirming zero total angular momentum. Yet each particle still has spin one half. A composite can have zero total angular momentum without its constituents having zero individual angular momentum. The singlet will also provide a precise example of entanglement in Chapter 22.

## Optional practice

1. Verify the normalization of $Y_1^0$ using $u=\cos\theta$ in the polar integral.
2. For (j=3/2), list all component eigenvalues and calculate the magnitude of angular momentum.
3. Apply $J_+$ to $|1,0\rangle$, including its coefficient. Explain why raising $|1,1\rangle$ gives zero.
4. A spin is prepared in $(\sqrt3/2)|+z\rangle+(1/2)|-z\rangle$. Find the probabilities for the two $S_z$ results and the $+\hbar/2$ result of $S_x$.
5. For hydrogen's ground state, derive $\langle r\rangle=3a_0/2$ and identify the radius maximizing shell probability.
6. Calculate the leading-order photon wavelength for the hydrogen $2\to1$ transition using $13.6\,\mathrm{eV}$ and $hc=1240\,\mathrm{eV\,nm}$.
7. Show that the singlet is annihilated by $J_z$ and $J_+$. State why a sharp $J_z=0$ alone would not establish $j=0$.
8. For a hydrogen-like ion with nuclear charge $+Ze$, ignoring reduced-mass differences, determine how radius and binding energy scale with $Z$. State when the nonrelativistic approximation becomes questionable.

[Hints](../solutions/21-hints.md) and [worked solutions](../solutions/21-solutions.md) are separate. Use the [companion](../companion/index.html) to connect probability plots to the measure actually being plotted; an orbital image is a density representation, not a photographed trajectory.

## References and further study

Connections to Feynman Lectures, Volume III, chapters 5–6, 12 and 17–19. The angular-momentum derivations here use the operator framework built in this course. Additional advanced problem families are listed in the official [MIT Quantum Physics III notes index](https://www.ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2018/resources/lecture-notes/); that index includes fine-structure and approximation topics for later study.
