# 09. Optics: when to draw rays and when to add waves

A camera can form a recognizable image, yet a sufficiently small aperture makes that image blurrier. A thin soap film shows colors even when its material is almost transparent. Two light beams can produce dark fringes where their fields cancel. No single picture of little straight arrows explains all three observations equally well.

Optics uses several models at different scales. Rays describe the direction of propagation when wavelength is small compared with the relevant lengths. Wave amplitudes explain phase, interference, diffraction, and polarization. Later, quantum theory explains the statistics of individual detection events. We will not pretend that one model was derived merely by naming another. This chapter develops the ray and classical-wave descriptions and makes their domains explicit.

We use trigonometry, derivatives, complex amplitudes, superposition, and Fourier ideas from Chapters 02–08. The new physical parameter is refractive index. The new reasoning habit is to decide whether an experiment asks about a path, an amplitude, an intensity, or a detector count.

## Refractive index and the approximations behind a ray

For a monochromatic plane wave in a transparent isotropic medium, define phase refractive index $n=c_0/v_p$, where $c_0$ is the speed of light in vacuum and $v_p$ is phase speed in the medium. If frequency is $f$, the vacuum wavelength is $\lambda_0=c_0/f$, while the medium wavelength is $\lambda=\lambda_0/n$.

At a stationary interface the frequency remains the same in ordinary linear optics. Otherwise the phases on the two sides could not match for all times. Wavelength changes because propagation speed changes. A light wave entering glass does not ordinarily keep its wavelength while slowing its frequency.

A ray traces the local direction of wave propagation in geometrical optics. The approximation works when refractive properties vary slowly over a wavelength and when diffraction at edges or small openings is not the dominant effect. A sharp edge, focus, or wavelength-scale aperture can require wave treatment even when rays are useful elsewhere in the same apparatus.

The optical path length along a curve is $\int n\,ds$. Dividing by $c_0$ gives travel time in a nondispersive ray description. Fermat's principle states that an actual ray makes this travel time stationary against nearby allowed paths, with endpoints fixed. Stationary means the first-order change vanishes; it does not always mean a global minimum. Rays can correspond to other stationary paths in more complicated systems. The principle is a compact law of geometrical optics, connected to short-wavelength wave interference rather than an assertion that light consciously chooses a route.

## Reflection and refraction from a stationary path

For reflection from a flat mirror, reflect the final point geometrically to the opposite side of the mirror. The shortest broken path from source to mirror to observer becomes a straight line to that reflected point. The geometry gives equal incidence and reflection angles, measured from the normal to the surface. This ray construction also explains the virtual image behind a plane mirror: the backward extensions of reflected rays meet there, although light does not physically pass through that image point.

For refraction, let a source be height $a$ above a flat interface and a destination be depth $b$ below it, horizontally separated by $D$. Let the ray cross at horizontal coordinate $x$. Travel time is

$$t(x)=\frac{n_1}{c_0}\sqrt{a^2+x^2}
+\frac{n_2}{c_0}\sqrt{b^2+(D-x)^2}.$$

Differentiate and set the first derivative to zero:

$$n_1\frac{x}{\sqrt{a^2+x^2}}
=n_2\frac{D-x}{\sqrt{b^2+(D-x)^2}}.$$

The fractions are sines of the incidence and refraction angles relative to the normal. Thus Snell's law is

$$n_1\sin\theta_1=n_2\sin\theta_2.$$

The same law follows by requiring matching phase along the interface: the tangential components of wave vector must agree, so $k_1\sin\theta_1=k_2\sin\theta_2$. Since $k=n\omega/c_0$ and the frequency is shared, the refractive indices appear. This gives a useful connection between a ray derivation and a wave boundary condition.

For air with $n_1\approx1.00$ and glass with $n_2=1.50$, incidence at $30^\circ$ gives $\sin\theta_2=(1/1.5)(0.5)=1/3$, so $\theta_2\approx19.47^\circ$. The ray bends toward the normal in the higher-index medium. If you accidentally measure angles from the surface, the sine formula will be applied to the wrong angles.

## Lenses form images within a paraxial approximation

A thin converging lens in air can bring nearly parallel rays to a focal point a distance $f>0$ beyond the lens. A diverging lens has $f<0$ under the convention used here. We use the real-is-positive convention: object distance $s>0$ for an object on the incident side, and image distance $s'>0$ for a real image on the outgoing side. A virtual image has $s'<0$.

For a thin paraxial lens,

$$\frac1f=\frac1s+\frac1{s'},\qquad
M=\frac{h'}{h}=-\frac{s'}s.$$

The magnification sign tells orientation: a negative value is inverted. To see the geometry, trace a ray through the lens center, approximately undeviated, and a ray initially parallel to the axis, which leaves through the far focal point. Similar triangles give $h'/h=-s'/s$ and the focal relationship. The lens changes direction over a thickness neglected compared with $s,s',f$; the paraxial approximation uses small angles, so $\sin\theta\approx\tan\theta\approx\theta$.

The focal length is related to surface curvature. For a thin lens of index $n$ in air,

$$\frac1f=(n-1)\left(\frac1{R_1}-\frac1{R_2}\right).$$

Here a positive radius means that the center of curvature lies downstream of the surface in the incident-light direction. A biconvex lens has $R_1>0$ and $R_2<0$. The formula follows by applying paraxial Snell refraction to each spherical surface and neglecting the separation between them. More explicitly, a surface separating indices $n_a,n_b$ obeys $n_a/s+n_b/s'=(n_b-n_a)/R$ in the corresponding real-object/real-image surface convention. Adding the two surface powers for zero thickness gives the displayed thin-lens result. Thick lenses require principal planes and cannot be handled by silently treating their physical center as the thin-lens plane.

Take $f=0.10\,\mathrm m$ and an object at $s=0.30\,\mathrm m$. Then $1/s'=10-3.333=6.667\,\mathrm{m^{-1}}$, so $s'=0.15\,\mathrm m$ and $M=-0.50$. The image is real, inverted, and half as tall. For the same lens with $s=0.050\,\mathrm m$, $1/s'=10-20=-10\,\mathrm{m^{-1}}$, so $s'=-0.10\,\mathrm m$ and $M=+2$. The image is virtual, upright, and enlarged. At $s=f$, the outgoing rays are parallel and no finite image plane exists in this model.

Real lenses also have aberrations. Spherical aberration makes large-angle rays focus differently, and dispersion makes different wavelengths have different focal lengths. These are separate effects from diffraction. Stopping a lens down can reduce some geometric aberrations while increasing diffraction blur. Optical design is therefore a tradeoff between effects, not a competition to make the opening arbitrarily small.

## Interference adds fields before it averages intensity

For coherent waves with the same frequency and polarization, let their complex field amplitudes at a point be $E_1$ and $E_2e^{i\delta}$. The detected time-averaged intensity in a fixed common medium is proportional to the squared magnitude of the total amplitude. If $I_1$ and $I_2$ are the separate intensities, then

$$I=I_1+I_2+2\sqrt{I_1I_2}\cos\delta.$$

The last term is the interference term. If the phase relation varies rapidly during the detector's averaging time, its average can vanish. In that case intensities add. Which addition rule applies depends on coherence and the measurement, not on a preference for a simpler formula.

For equal separate intensities $I_0$, $I=4I_0\cos^2(\delta/2)$. The maximum is $4I_0$ and the minimum zero. The maximum does not create energy from nowhere: bright regions are accompanied by dark regions, and a complete energy-flow calculation accounts for the redistribution. Looking only at a bright point ignores the rest of the pattern.

An optical path difference $\Delta$ gives phase difference $\delta=2\pi\Delta/\lambda_0$ plus any source or reflection phase shifts. Optical path means $n$ times physical length in a uniform medium. A $1\,\mathrm{mm}$ glass insertion does not necessarily contribute the same phase as a $1\,\mathrm{mm}$ vacuum path; compare the material path with the path it replaces.

Coherence has temporal and spatial aspects. A broad range of frequencies causes relative phase to wash out over large path differences. A source extended over many unrelated emitting points can blur fringes because each point produces a shifted pattern. A laser often helps, but “laser” is not a substitute for specifying whether a particular arrangement maintains a stable phase and polarization relation.

## Young's two slits connect geometry to phase

Two narrow slits separated by $d$ illuminate a distant screen. At angle $\theta$ relative to the central axis, the far-field path difference is approximately $d\sin\theta$. For equal in-phase illumination, bright fringes satisfy

$$d\sin\theta=m\lambda,\qquad m\in\mathbb Z.$$

Here $\lambda$ is the wavelength in the propagation medium. Dark fringes lie at half-integer path differences for equal amplitudes. At small screen angle, $y\approx D\theta$ and $\sin\theta\approx\theta$, so adjacent bright fringes have spacing $\Delta y\approx\lambda D/d$.

For $\lambda=580\,\mathrm{nm}=5.80\times10^{-7}\,\mathrm m$, $D=2.0\,\mathrm m$, and $d=0.25\,\mathrm{mm}=2.5\times10^{-4}\,\mathrm m$, spacing is $4.64\times10^{-3}\,\mathrm m=4.64\,\mathrm{mm}$. The expression requires the far-field and small-angle approximations used to derive it. At large angles, solve the sine relation and use the actual screen geometry rather than extending the linear spacing indefinitely.

If the slit intensities differ, complete darkness is generally impossible. At destructive phase, $I_{\min}=(\sqrt{I_1}-\sqrt{I_2})^2$. Fringe visibility is $(I_{\max}-I_{\min})/(I_{\max}+I_{\min})=2\sqrt{I_1I_2}/(I_1+I_2)$ for this fully coherent ideal case. A washed-out minimum can therefore result from unequal amplitudes, imperfect coherence, different polarizations, or background light; diagnosing it requires more than assuming a wrong wavelength.

## Diffraction is the wave nature of an aperture

A finite slit cannot radiate into only one geometrical direction. In the Fraunhofer, or far-field, regime, each point across an aperture contributes an amplitude with a position-dependent phase. For a uniformly illuminated slit of width $a$, let its transverse coordinate be $u$. At observation angle $\theta$, a contribution has relative phase $ku\sin\theta$. The total amplitude is proportional to

$$\int_{-a/2}^{a/2}e^{iku\sin\theta}du
=a\frac{\sin\beta}{\beta},\qquad
\beta=\frac{\pi a\sin\theta}{\lambda}.$$

At $\beta=0$, interpret the ratio by its limit, one. Define $\operatorname{sinc}\beta=\sin\beta/\beta$ with that continuous extension. Squaring the magnitude gives the single-slit intensity envelope

$$I(\theta)=I(0)\operatorname{sinc}^2\beta.$$

Its first zeros occur at $a\sin\theta=\pm\lambda$. Higher zeros occur at nonzero integer multiples of $\lambda$. The secondary maxima are not exactly halfway between adjacent zeros because the denominator also varies. The far-field approximation is appropriate when propagation distance is large compared with a scale of order $a^2/\lambda$, or when a lens forms the angular pattern near its focal plane. Near-field Fresnel diffraction retains additional quadratic phases.

For two identical finite slits, the ideal pattern is the two-slit interference modulation times the single-slit envelope:

$$I(\theta)=4I_0\operatorname{sinc}^2\left(\frac{\pi a\sin\theta}{\lambda}\right)
\cos^2\left(\frac{\pi d\sin\theta}{\lambda}\right),$$

where $I_0$ is the on-axis intensity from either slit alone. With the earlier $d=0.25\,\mathrm{mm}$ and $a=0.050\,\mathrm{mm}$, the first envelope zero occurs near $y=D\lambda/a=23.2\,\mathrm{mm}$. Since this is five fringe spacings, the nominal fifth interference order is missing. “Interference” and “diffraction” are not unrelated mechanisms; both follow from adding wave amplitudes over the relevant sources or aperture.

## Resolution is limited by the aperture's wave pattern

A circular aperture produces an Airy diffraction pattern rather than a point image. For an ideal uniformly illuminated circular opening of diameter $D_a$, the first dark ring occurs at a small angle approximately

$$\theta_{\rm dark}=1.22\frac{\lambda}{D_a}.$$

The number 1.22 comes from the first zero of the circular-aperture diffraction integral; it is not the same as the single-slit zero. One can write the circular amplitude as an integral over the aperture, $\int e^{ik\mathbf u\cdot\boldsymbol\theta}d^2u$. Rotational symmetry reduces it to a radial special function whose first zero supplies that number. We use the evaluated result here and identify its assumptions rather than manufacture an elementary derivation of the numerical constant.

The Rayleigh criterion calls two equal incoherent point sources approximately resolved when one's central maximum lies at the other's first minimum. It is a conventional practical criterion, not an absolute theorem that no information can exist below that separation. Noise, source assumptions, detector sampling, and estimation methods also matter.

At $\lambda=550\,\mathrm{nm}$ and aperture $D_a=0.10\,\mathrm m$, the angle is about $6.71\times10^{-6}\,\mathrm{rad}$, or $1.38$ arcseconds using $206{,}265$ arcseconds per radian. A telescope's angular magnification does not remove that diffraction scale. Enlarging an already blurred image does not recover spatial frequencies the aperture failed to transmit. For microscopy, numerical aperture $\mathrm{NA}=n\sin\alpha$ describes accepted angular range; a common lateral Rayleigh estimate is $0.61\lambda_0/\mathrm{NA}$ under its ideal incoherent-imaging assumptions.

## Polarization adds a direction to the amplitude

Light is an electromagnetic transverse wave. In vacuum its electric field is perpendicular to its propagation direction. If propagation is along $z$, write the field in two transverse components. Linear polarization means the electric vector oscillates along a fixed transverse line. Circular or elliptical polarization means its tip rotates as time advances at a fixed location.

An ideal linear polarizer transmits the electric-field projection onto its axis. If a linearly polarized input has amplitude $E_0$ at angle $\alpha$ to the axis, the transmitted amplitude is $E_0\cos\alpha$, giving Malus's law

$$I=I_0\cos^2\alpha.$$

The square is essential: intensity is not proportional to field amplitude itself. For unpolarized light, averaging equally over transverse orientations gives $\langle\cos^2\alpha\rangle=1/2$, so an ideal first polarizer transmits half the intensity. A second polarizer then applies Malus's law to the now linearly polarized output.

With input intensity $100\,\mathrm{W\,m^{-2}}$ unpolarized, the first ideal polarizer transmits $50$. A second at $60^\circ$ transmits $50\cos^260^\circ=12.5\,\mathrm{W\,m^{-2}}$. Two crossed polarizers transmit zero in the ideal model, but placing a third at $45^\circ$ between them yields $100(1/2)(1/2)(1/2)=12.5$. The middle polarizer changes the polarization state; it is not merely an extra neutral absorber.

Using complex amplitudes, a transverse polarization state can be represented by $(E_x,E_y)$. Equal amplitudes in phase give a line at $45^\circ$. Equal amplitudes differing by a quarter cycle, such as $E_y=iE_x$ under a stated time convention, give circular polarization; the sign of the phase difference determines handedness. A quarter-wave plate creates a relative $\pi/2$ phase between its principal axes. It produces circular polarization from a linearly polarized input only when that input has equal components on those axes. Arbitrary input angles generally give an ellipse.

Orthogonally polarized beams do not produce the usual intensity interference cross term in a polarization-insensitive detector because their field vectors have zero dot product. Projecting both through a common polarizer can restore interference if their phase relation is otherwise coherent. The vector nature of the wave therefore matters even when a scalar intensity picture looks tempting.

## Reflection phases, total internal reflection, and coatings

At normal incidence between transparent nonmagnetic media, the electric-field amplitude reflection coefficient is

$$r=\frac{n_1-n_2}{n_1+n_2},\qquad
t=\frac{2n_1}{n_1+n_2}.$$

The reflected intensity fraction is $R=|r|^2$, while the transmitted fraction is $T=(n_2/n_1)|t|^2$. The extra index ratio accounts for the different relation between field amplitude and energy flux. For air to glass with $n_1=1$ and $n_2=1.5$, $r=-0.20$, $R=0.040$, and $T=0.960$. Negative $r$ signifies a $\pi$ field phase shift, not negative intensity. These coefficients follow from electromagnetic boundary conditions, developed in Chapter 18; here they are a stated interface result used consistently with energy conservation.

For incidence from a higher index $n_1$ to a lower $n_2$, Snell's law demands $\sin\theta_2>1$ when $\sin\theta_1>n_2/n_1$. A propagating transmitted ray is then impossible. The critical angle satisfies $\sin\theta_c=n_2/n_1$. For glass to air with index 1.5, $\theta_c\approx41.81^\circ$. Total internal reflection still has an evanescent field penetrating the lower-index region; the field is not literally zero beyond the interface. For an ideal isolated lossless interface, it carries no net average energy away normal to the surface. A nearby second medium can change that through frustrated total internal reflection.

At oblique incidence the reflection coefficients depend on polarization. For nonmagnetic lossless dielectrics, the parallel-to-incidence-plane coefficient vanishes at Brewster's angle, $\tan\theta_B=n_2/n_1$. At this angle the reflected and refracted rays are perpendicular; combining that geometry with Snell's law gives the tangent formula. Real absorption and multilayer structures require a more general treatment.

Thin-film colors come from phase differences between reflections at two surfaces. Include both the extra optical round trip $2n_ft\cos\theta_f$ and any reflection phase changes. At normal incidence for an antireflection film with $n_1<n_f<n_3$, both reflected fields acquire the same $\pi$ reflection shift. A quarter-wave optical thickness $n_ft=\lambda_0/4$ adds a relative propagation phase $\pi$, making the two leading reflected contributions destructive. Exact cancellation at the design wavelength also requires matched amplitudes; the ideal single-layer condition is $n_f=\sqrt{n_1n_3}$. A quarter-wave thickness alone is not enough for perfect antireflection at arbitrary indices, wavelengths, or angles.

## Interferometers turn phase into a length measurement

In a Michelson interferometer, two beams make round trips along different arms and recombine. Moving one mirror by $\Delta L$ changes that arm's round-trip optical path by $2\Delta L$ in air. Its phase change is $4\pi\Delta L/\lambda_0$. One full bright-to-bright fringe cycle therefore corresponds to mirror motion $\lambda_0/2$.

For $\lambda_0=633\,\mathrm{nm}$, 100 fringe cycles correspond to $100(633/2)\,\mathrm{nm}=31.65\,\mu\mathrm m$. Counting fringes measures a change in optical path. It does not directly determine an absolute length without resolving whole-fringe ambiguity and other instrument effects. Index changes from temperature or pressure can mimic physical length changes, and unequal arm coherence can reduce contrast.

The optical models now connect. A lens's ray diagram predicts approximate image location. Its aperture's Fourier transform predicts diffraction blur. Polarization determines which field components interfere. An interferometer converts a phase difference into a measurable intensity change. A reliable calculation chooses the model appropriate to the requested observable, checks its assumptions, and keeps amplitudes distinct from intensities throughout.

## Optional practice

1. Light enters a medium of index 1.40 from air at $45^\circ$. Find the refracted angle and the wavelength inside if $\lambda_0=560\,\mathrm{nm}$.
2. A converging thin lens has $f=0.20\,\mathrm m$. Find image distance and magnification for object distances $0.60\,\mathrm m$ and $0.10\,\mathrm m$. Classify each image.
3. In a double-slit experiment, $\lambda=500\,\mathrm{nm}$, $D=1.5\,\mathrm m$, and $d=0.30\,\mathrm{mm}$. Find small-angle fringe spacing. If slit width is $0.060\,\mathrm{mm}$, which interference order coincides with the first envelope zero?
4. Derive $I_{\min}=(\sqrt{I_1}-\sqrt{I_2})^2$. For $I_1=9$ and $I_2=4$ in the same intensity units, find maximum, minimum, and visibility.
5. Unpolarized light passes through ideal polarizers at $0^\circ$, $30^\circ$, and $90^\circ$. Find the transmitted fraction of incident intensity.
6. Find the normal-incidence reflected fraction and critical angle for an index-1.60 medium next to air. Keep straight which direction of propagation permits total internal reflection.
7. A Michelson mirror moves while 240 fringe cycles are counted at $\lambda_0=600\,\mathrm{nm}$. Find its displacement. Explain why the factor of two appears.
8. For air, a film, and a substrate of index 2.25, find the ideal antireflection film index and physical quarter-wave thickness for $\lambda_0=600\,\mathrm{nm}$. State at least two limitations of the cancellation.

Hints and complete solutions: [hints](../solutions/09-hints.md), [solutions](../solutions/09-solutions.md). Use the [companion](../companion/index.html) for listed optical wave experiments.

Further conceptual reading: Feynman Lectures, Volume I, Chapters 26–33; [diffraction](https://www.feynmanlectures.caltech.edu/I_30.html). Next, the invariant vacuum light speed forces a revision of our earlier assumptions about space, time, and simultaneity.
