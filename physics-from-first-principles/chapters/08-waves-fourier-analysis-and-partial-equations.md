# 08. Waves and Fourier analysis: local rules, extended patterns

Displace one point of a stretched string. Nearby points pull on it, and its motion pulls on theirs. A disturbance travels even though each material element remains near its original location. A wave is an organized change propagating through a system; it need not mean that matter travels along with the disturbance.

This chapter connects the coupled oscillators of Chapter 07 to continuous fields. It teaches partial derivatives, the wave equation, boundary conditions, normal modes, Fourier series and transforms, reflection, sound, and dispersion. These are central tools for optics, electrodynamics, quantum mechanics, and heat transport. The common question is how a local dynamical law produces a pattern over an extended region.

## A field needs more than one independent variable

For a transverse string, let $y(x,t)$ be vertical displacement of the material near horizontal position $x$ at time $t$. Its value depends on both location and time. A **partial derivative** changes one independent variable while holding the others fixed. Thus $\partial y/\partial t$ is the vertical velocity of the string element at fixed $x$, whereas $\partial y/\partial x$ is the string's local slope at fixed time.

The distinction can be checked with $y(x,t)=Ax^2t$. At fixed $x$, $\partial_ty=Ax^2$. At fixed $t$, $\partial_xy=2Axt$. The other variable behaves as a constant during the particular derivative. A second time derivative describes acceleration, and a second space derivative describes curvature in the small-slope approximation.

Consider a string with uniform tension $\mathcal T$ and linear mass density $\mu$, in kilograms per meter. Take a short horizontal segment of length $\Delta x$. The tension forces nearly cancel horizontally. For small slopes, their vertical difference is approximately $\mathcal T[y_x(x+\Delta x)-y_x(x)]$, where $y_x$ abbreviates $\partial y/\partial x$. Its mass is $\mu\Delta x$. Newton's law gives

$$\mu\Delta x\,y_{tt}\approx\mathcal T\Delta x\,y_{xx}.$$

Taking the continuum limit yields

$$y_{tt}=c^2y_{xx},\qquad c=\sqrt{\mathcal T/\mu}.$$

The curvature determines the net restoring force. A straight tilted segment has no curvature and no net transverse force from a uniform tension. The speed has the correct units because $\mathcal T/\mu$ has units $\mathrm{m^2\,s^{-2}}$. A $100\,\mathrm N$ tension and $0.010\,\mathrm{kg\,m^{-1}}$ density give $c=100\,\mathrm{m\,s^{-1}}$.

The derivation assumes small transverse slopes, nearly constant tension, negligible bending stiffness, and a continuum description. A real string at sufficiently short wavelengths or large amplitude violates these approximations. The mathematical solution can be exact for the model without being exact for every physical string.

## A traveling shape solves the wave equation

Let $f$ be any twice-differentiable function and set $y(x,t)=f(x-ct)$. Introduce $u=x-ct$. The chain rule gives $y_x=f'(u)$, $y_{xx}=f''(u)$, $y_t=-cf'(u)$, and $y_{tt}=c^2f''(u)$. Therefore the wave equation is satisfied. A feature with fixed argument $u$ has $x=ct+u$ and moves right at speed $c$. Similarly $g(x+ct)$ moves left.

On an infinite line, the sufficiently smooth general solution is

$$y(x,t)=f(x-ct)+g(x+ct).$$

The two independent traveling functions supply the two kinds of initial data: displacement and velocity. If $y(x,0)=Y(x)$ and $y_t(x,0)=V(x)$, then $f+g=Y$ and $-cf'+cg'=V$. Integrating these relationships gives d'Alembert's formula

$$y(x,t)=\frac{Y(x-ct)+Y(x+ct)}2
+\frac{1}{2c}\int_{x-ct}^{x+ct}V(s)\,ds.$$

At $t=0$ the integral vanishes and the first term becomes $Y(x)$. Differentiating with respect to time confirms the initial velocity. The value at $(x,t)$ depends only on initial data in $[x-ct,x+ct]$, a finite region called its domain of dependence. This is a precise form of finite propagation speed within the model.

If an initially displaced string is released from rest, $V=0$ and its initial profile splits into two equal-amplitude copies moving oppositely. If instead we want a single right-moving profile $Y(x-ct)$, its initial velocity cannot be zero: it must be $V(x)=-cY'(x)$. A shape alone does not determine a wave's direction; the initial velocity field matters.

## Sinusoidal waves define wavelength and frequency

A harmonic right-moving wave can be written

$$y(x,t)=A\cos(kx-\omega t+\phi).$$

Amplitude $A$ is the maximum displacement, phase $\phi$ sets its initial alignment, wave number $k=2\pi/\lambda$ measures spatial phase change, and angular frequency $\omega=2\pi f$ measures temporal phase change. A wavelength $\lambda$ advances the phase by $2\pi$ at fixed time. A period $T=1/f$ advances it by $2\pi$ at fixed location.

Substitution into the wave equation gives $\omega^2=c^2k^2$. For a chosen right-moving positive-frequency convention, $\omega=ck$. Thus $c=\omega/k=f\lambda$. This is the speed of a fixed phase, not the vertical velocity of a string element. The element's maximum transverse speed is $A\omega$ and may be entirely different from $c$.

For $c=100\,\mathrm{m\,s^{-1}}$ and $f=50\,\mathrm{Hz}$, the wavelength is $2.0\,\mathrm m$, $k=\pi\,\mathrm{m^{-1}}$, and $\omega=100\pi\,\mathrm{s^{-1}}$. If $A=0.0050\,\mathrm m$, the maximum transverse element speed is $0.0050(100\pi)\approx1.57\,\mathrm{m\,s^{-1}}$. Confusing that speed with the propagation speed would conflate motion of matter with motion of the pattern.

Two waves can occupy the same linear medium and pass through one another. Their instantaneous displacements add. Interference is the resulting enhancement or cancellation of the sum, not necessarily a collision that destroys the constituent waves. Nonlinear systems can behave differently, including permanent waveform changes after interactions.

## Boundaries select standing waves

For a string of length $L$ fixed at both ends, $y(0,t)=y(L,t)=0$. Seek a separated solution $y(x,t)=X(x)Q(t)$. Substitution gives $XQ''=c^2X''Q$. Where the factors are nonzero, divide to obtain $Q''/(c^2Q)=X''/X$. The left side depends only on time and the right only on position, so both must equal a constant.

Choose that constant as $-k^2$ for oscillatory solutions. Then $X''+k^2X=0$ and $Q''+c^2k^2Q=0$. The first boundary requires $X$ proportional to $\sin kx$. The second requires $\sin kL=0$, so

$$k_n=\frac{n\pi}{L},\qquad
\omega_n=\frac{n\pi c}{L},\qquad n=1,2,3,\ldots.$$

The corresponding wavelengths are $2L/n$. There is no nonzero $n=0$ mode for a fixed-fixed string because the only linear spatial solution satisfying both zero endpoints is zero. Negative $n$ would duplicate the same spatial patterns up to sign.

The fundamental is $f_1=c/(2L)$ and the higher frequencies are integer harmonics $nf_1$ in this nondispersive ideal string. For $L=1.0\,\mathrm m$ and $c=100\,\mathrm{m\,s^{-1}}$, $f_1=50\,\mathrm{Hz}$, $f_2=100\,\mathrm{Hz}$, and $f_3=150\,\mathrm{Hz}$. Nodes are positions of permanently zero displacement; antinodes are positions of largest oscillation amplitude. A standing wave has no net average energy transport along the string when made from equal counterpropagating waves, even though energy moves locally between neighboring regions.

Different boundary conditions give different spectra. A free end requires approximately zero transverse force, hence zero slope $y_x=0$. A fixed-free string therefore has $kL=(n+\tfrac12)\pi$ for $n=0,1,2,\ldots$, giving odd multiples of its fundamental. Boundary physics, rather than a preference for particular numbers, chooses the allowed modes.

## Fourier coefficients come from orthogonality

An arbitrary suitable initial displacement on a fixed string can be expanded in its sine modes:

$$Y(x)=\sum_{n=1}^{\infty}a_n\sin\frac{n\pi x}{L}.$$

This statement needs regularity qualifications: for piecewise smooth functions the series has standard pointwise convergence behavior, and square-integrable functions can be represented in a mean-square sense. At a jump, the series converges to the average of the one-sided limits. Do not assume a Fourier series equals every possible function at every point without specifying the sense of convergence.

The coefficients follow from the integral identity

$$\int_0^L\sin\frac{n\pi x}{L}\sin\frac{m\pi x}{L}dx
=\begin{cases}0,&n\ne m,\\L/2,&n=m.\end{cases}$$

To see the cancellation, use $2\sin a\sin b=\cos(a-b)-\cos(a+b)$ and integrate. For different positive integers the endpoint sines vanish. For matching integers the zero-frequency cosine contributes $L$, while the oscillatory part integrates to zero. This is **orthogonality**, the continuous analogue of perpendicular coordinate directions.

Multiply the series by the $m$th sine and integrate. Every other term vanishes, leaving

$$a_m=\frac{2}{L}\int_0^LY(x)\sin\frac{m\pi x}{L}dx.$$

Initial velocity has its own coefficients $b_n=(2/L)\int_0^LV(x)\sin(n\pi x/L)dx$. The full motion is then

$$y(x,t)=\sum_{n=1}^{\infty}\left[a_n\cos\omega_nt+
\frac{b_n}{\omega_n}\sin\omega_nt\right]\sin\frac{n\pi x}{L}.$$

The factor $1/\omega_n$ is fixed by differentiating with respect to time. Dropping it would give the wrong units and initial velocities. The expansion uncouples the wave equation into independent oscillators, one for each allowed mode.

## A plucked string and a discontinuous example

Suppose a string is plucked into a triangle of height $h$ at its midpoint, then released from rest. Its initial displacement is $Y=2hx/L$ on $0\leq x\leq L/2$ and $Y=2h(L-x)/L$ on $L/2\leq x\leq L$. Splitting the coefficient integral at the midpoint and integrating by parts gives

$$a_n=\frac{8h}{n^2\pi^2}\sin\frac{n\pi}{2}.$$

Even modes vanish. The first coefficients are $a_1=8h/\pi^2$, $a_3=-8h/(9\pi^2)$, and $a_5=8h/(25\pi^2)$. Their decreasing $1/n^2$ size means the large-scale shape is captured rapidly, while many higher modes refine the sharp corner. An off-center pluck changes the harmonic mixture and therefore changes the sound even if the fundamental frequency stays the same.

For a periodic square wave of height $+1$ on $0<\theta<\pi$ and $-1$ on $-\pi<\theta<0$, odd symmetry removes cosine terms. Its sine coefficient is

$$b_n=\frac{2}{\pi}\int_0^\pi\sin(n\theta)d\theta
=\frac{2[1-(-1)^n]}{n\pi}.$$

Thus $b_n=4/(n\pi)$ for odd $n$ and zero for even $n$. At a jump, the series value is zero, the average of $+1$ and $-1$. Finite partial sums overshoot near the jump: the Gibbs phenomenon. Adding terms narrows the overshoot region but does not remove its limiting fractional height. This is not a failure of arithmetic; a discontinuous target cannot be uniformly approximated by these continuous partial sums.

The examples connect smoothness to spectral decay. The triangular function's corner produces $1/n^2$ coefficients; the square wave's jump produces slower $1/n$ decay. Resolving abrupt features generally requires more high-frequency content. That observation becomes important in numerical grids, diffraction, and quantum wave packets.

## Wave energy and the direction of its flow

For the small-slope string, kinetic energy per unit length is $u_K=\tfrac12\mu y_t^2$. Stretching the string by a small transverse slope increases arc length by approximately $\tfrac12y_x^2dx$, so potential energy per unit length is $u_U=\tfrac12\mathcal T y_x^2$. Therefore

$$u=\frac12\mu y_t^2+\frac12\mathcal T y_x^2.$$

The power crossing a point toward positive $x$ is

$$P=-\mathcal T y_x y_t.$$

For a right-moving sinusoid, $y_x=-Ak\sin(kx-\omega t)$ and $y_t=A\omega\sin(kx-\omega t)$, so $P=\mathcal T A^2k\omega\sin^2(kx-\omega t)\geq0$. Its average is

$$\langle P\rangle=\frac12\mu c\omega^2A^2.$$

The square of amplitude matters: doubling amplitude quadruples average power within this linear model. Averaged energy density is $\langle u\rangle=\tfrac12\mu\omega^2A^2$, so $\langle P\rangle=c\langle u\rangle$. The relationship is consistent with energy traveling at $c$ for this nondispersive wave.

One can verify local conservation directly: differentiate $u$ in time, use $\mu y_{tt}=\mathcal T y_{xx}$, and apply the product rule to obtain $\partial_tu+\partial_xP=0$. This is a continuity equation: energy stored in a tiny region changes because energy flows across its boundaries. The same structure later governs electric charge and probability.

## Reflection follows from matching displacement and force

Let a wave travel from string 1 to string 2 across a junction, with common tension $\mathcal T$ and speeds $c_1,c_2$. Use a sinusoidal incident displacement amplitude $A_i$, reflected amplitude $A_r$, and transmitted amplitude $A_t$. Continuity of displacement gives $A_i+A_r=A_t$. Continuity of transverse force gives $k_1(A_i-A_r)=k_2A_t$ because reflected propagation reverses the spatial phase derivative.

Define the string impedance $Z=\mathcal T/c=\mu c$. Since $k=\omega/c$, solving gives

$$r=\frac{A_r}{A_i}=\frac{Z_1-Z_2}{Z_1+Z_2},\qquad
t=\frac{A_t}{A_i}=\frac{2Z_1}{Z_1+Z_2}.$$

These are displacement-amplitude coefficients for this specific string convention. Pressure-wave coefficients in acoustics have a different sign convention and should not be copied blindly. The reflected power fraction is $r^2$; the transmitted fraction is $(Z_2/Z_1)t^2$. Their sum is one for an ideal lossless junction.

As $Z_2\to\infty$, $r\to-1$: a fixed-like end reflects with inverted displacement. As $Z_2\to0$, $r\to+1$: a free-like end reflects without inversion. For matching impedances, $r=0$. These limits explain why a change in the medium can reflect a wave even when no energy is dissipated.

## Sound is a compressional wave

In a fluid, let $\xi(x,t)$ be the small longitudinal displacement of a parcel. Compression corresponds approximately to fractional density change $\delta\rho/\rho_0=-\xi_x$. Define a bulk modulus $B$ by the linear relation between pressure change and compression: $\delta p=-B\xi_x$. Pressure gradients accelerate the fluid, so $\rho_0\xi_{tt}=-\partial_x\delta p$. Combining gives

$$\xi_{tt}=\frac{B}{\rho_0}\xi_{xx},\qquad
c_s=\sqrt{B/\rho_0}.$$

The appropriate bulk modulus depends on how quickly heat can flow. For ordinary rapid small-amplitude sound in an ideal gas, compression is approximately adiabatic, giving $B=\Gamma p_0$ where $\Gamma=C_p/C_v$. Thermodynamics will derive that distinction in Chapter 13; until then $B$ is a measured constitutive parameter, so the wave calculation does not require an unexplained thermal derivation.

Acoustic intensity is average power per area. For a plane traveling sound wave with pressure amplitude $p_a$, $I=p_a^2/(2\rho_0c_s)$. The quantity $\rho_0c_s$ is acoustic impedance for pressure divided by particle velocity. In an ideal isotropic three-dimensional medium, a point source's fixed average power spreads over spheres of area $4\pi r^2$, so intensity falls as $1/r^2$ and wave amplitude falls as $1/r$ in the far field without absorption. An inverse-square intensity law is geometric dilution, not necessarily energy loss to the medium.

## Dispersion separates phase speed from packet speed

Not every wave satisfies $\omega=ck$ with constant $c$. A **dispersion relation** $\omega(k)$ tells how frequency depends on wave number. The phase speed is $v_p=\omega/k$. To understand a narrow packet, add two nearby waves with $k\pm\Delta k/2$ and $\omega\pm\Delta\omega/2$. The cosine addition identity produces a fast carrier multiplied by a slow envelope. A fixed envelope phase moves at approximately $\Delta\omega/\Delta k$.

In the narrow-band limit this becomes the group velocity

$$v_g=\frac{d\omega}{dk}.$$

For a nondispersive string, $v_g=v_p=c$. For $\omega=ak^2$ with positive $a$, $v_p=ak$ and $v_g=2ak$. Different components then move with different phase speeds and a localized packet can spread. Group velocity often tracks an energy or packet speed in a transparent weakly dispersive regime, but it is not an unrestricted definition of information speed in every absorbing or strongly dispersive system.

The Fourier transform represents a localized initial shape by a continuous range of wave numbers. One convention is

$$\widetilde Y(k)=\int_{-\infty}^{\infty}Y(x)e^{-ikx}dx,
\qquad
Y(x)=\frac{1}{2\pi}\int_{-\infty}^{\infty}\widetilde Y(k)e^{ikx}dk.$$

The factors of $2\pi$ belong to a convention and must be kept consistent. Evolving each component by $e^{-i\omega(k)t}$ constructs a wave packet. A narrow spatial feature needs a broad range of wave numbers. This Fourier relationship is the mathematical precursor of the position–momentum uncertainty relation; quantum physics will add the physical identification $p=\hbar k$ rather than derive it from classical waves alone.

## Moving sources and the boundary of the linear model

For sound in a stationary medium, a source moving toward a stationary observer at speed $u_s<c_s$ emits successive crests from progressively closer positions. If its emitted period is $T_s$, the forward wavelength is $(c_s-u_s)T_s$. The observed frequency is therefore $f_{\rm obs}=f_s c_s/(c_s-u_s)$. A moving observer changes the rate at which crests are encountered instead: for motion toward the source at speed $u_o$, the numerator becomes $c_s+u_o$.

The source and observer velocities are relative to the medium in this acoustic model. Light in vacuum does not have the same preferred-medium rule; special relativity changes the Doppler relationship. Also, the formula assumes the source's forward crest pattern is subsonic. If a source outruns its waves, the geometry produces a Mach cone rather than arbitrarily high observed frequency from the subsonic formula.

Large-amplitude waves can steepen because different parts of the disturbance propagate at different speeds. Shocks require nonlinear dynamics and dissipative or other microscopic regularization. The linear wave equation cannot predict all of that behavior simply by increasing its amplitude parameter. Learning a solvable model includes recognizing the mechanism it leaves out.

## Optional practice

1. Verify directly that $y=Ae^{-(x-ct)^2/a^2}$ solves the one-dimensional wave equation. What initial velocity is needed for this right-moving Gaussian?
2. A string has tension $64\,\mathrm N$, density $0.010\,\mathrm{kg\,m^{-1}}$, and fixed length $0.80\,\mathrm m$. Find speed, fundamental frequency, and third-mode wavelength.
3. Show the sine-mode orthogonality relation by integrating the product-to-sum identity. Treat equal and unequal mode numbers separately.
4. For initial displacement $Y(x)=h\sin(\pi x/L)+\tfrac12h\sin(3\pi x/L)$ and zero initial velocity, write the full motion and find the displacement at $x=L/2$, $t=L/(2c)$.
5. For a lossless string junction with $Z_2=3Z_1$, find displacement reflection and transmission coefficients and both power fractions.
6. A string wave's amplitude doubles while its frequency triples, with the medium unchanged. By what factor does its average power change? State the linear-model limitation.
7. For $\omega=ak^2$, derive phase and group velocities. Explain why a packet assembled from a finite wave-number range generally changes shape.
8. A sound source emits at $500\,\mathrm{Hz}$ while approaching a stationary listener at $20\,\mathrm{m\,s^{-1}}$ in a medium with $c_s=340\,\mathrm{m\,s^{-1}}$. Find the observed frequency. Explain why swapping “source” and “listener” is not the same acoustic calculation.

Hints and complete solutions: [hints](../solutions/08-hints.md), [solutions](../solutions/08-solutions.md). Explore Fourier and wave behavior in the [companion](../companion/index.html) where listed.

Further conceptual reading: Feynman Lectures, Volume I, Chapters 47–51; [harmonics](https://www.feynmanlectures.caltech.edu/I_50.html). Next, light provides a particularly rich set of examples in which rays, waves, interference, and measurement must fit together.
