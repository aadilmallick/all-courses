# 17. Currents, circuits, magnetic fields, and induction

A wire can carry charge steadily while remaining nearly neutral overall. A magnet can deflect that moving charge, and changing magnetic flux can drive current around a closed wire. These observations require more structure than electrostatics. We will connect microscopic charge motion to circuit equations, then develop magnetic forces and induction without treating a circuit diagram as a separate kind of physics.

The central problem is how energy is transported, stored, and dissipated when charge moves. Circuit models answer it when device dimensions and frequencies permit a small collection of lumped variables. Field equations answer it when spatial propagation matters. Both descriptions have limits, and understanding their connection prevents many apparent paradoxes about where energy comes from.

## Current is charge transport, not charge consumption

Current through an oriented surface is the rate at which net charge crosses it: $I=dQ/dt$, measured in amperes, where $1\,\mathrm A=1\,\mathrm{C\,s^{-1}}$. Positive current follows positive charge motion. Electron motion in a metal is opposite conventional current because electrons carry negative charge.

For mobile carriers of number density $n$, charge $q$, and average drift velocity $\mathbf v_d$, the current density is $\mathbf J=nq\mathbf v_d$. Its units are amperes per square metre. For multiple carrier species, add their contributions. Through a surface, $I=\int\mathbf J\cdot d\mathbf A$. Thermal velocities can be large yet cancel in the mean; drift is the small directional bias that carries current.

Charge conservation in a fixed small volume gives

$$\frac{\partial\rho}{\partial t}+\nabla\cdot\mathbf J=0.$$

This continuity equation has the same accounting structure as mass transport in Chapter 12. In a steady circuit, charge does not continually accumulate at a junction, so incoming currents sum to outgoing currents. Kirchhoff's current rule is this local conservation law applied to a lumped junction.

For a wire of area $1.0\,\mathrm{mm^2}$, carrier density $8.0\times10^{28}\,\mathrm{m^{-3}}$, and electron drift speed $1.0\times10^{-4}\,\mathrm{m\,s^{-1}}$, current magnitude is $n e A v_d\approx1.28\,\mathrm A$. The drift is slow; the establishment of electric fields around the circuit is a different propagation process and is not limited to the time one electron takes to travel around the wire.

## Ohm's law is a material response model

In an isotropic ohmic conductor, $\mathbf J=\sigma\mathbf E$, with conductivity $\sigma$. A uniform wire of length $L$ and area $A$ has voltage drop $V=EL$ and current $I=\sigma EA$, so

$$V=IR,\qquad R=\frac L{\sigma A}.$$

Resistance is measured in ohms. This relation assumes suitable steady or low-frequency conditions, approximately uniform material and temperature, and linear response. Diodes, electrolytes, superconductors, high-field transport, and rapidly varying signals need other constitutive models. Ohm's law is not a universal consequence of charge conservation.

A simple microscopic model treats collisions as relaxing carrier drift momentum over an average time $\tau$. Mean velocity obeys $m\,d\mathbf v_d/dt=q\mathbf E-m\mathbf v_d/\tau$. In steady state $\mathbf v_d=q\tau\mathbf E/m$, giving $\sigma=nq^2\tau/m$. The square makes conductivity positive for either sign of carrier. This Drude model captures useful trends while missing quantum band structure, detailed scattering, and many material-specific effects.

The electrical power transferred to a two-terminal element is $P=VI$ under the passive sign convention, where current enters the terminal labeled positive. For a resistor this is $I^2R=V^2/R\ge0$: electrical energy becomes internal energy. A $100\,\Omega$ resistor carrying $0.20\,\mathrm A$ dissipates $4.0\,\mathrm W$. The charge is not used up; the energy delivered per unit charge is reduced.

## Circuit rules and what a voltage source does

Resistors in series carry the same current, so voltage drops add and $R_{\rm series}=\sum R_i$. Parallel resistors share a voltage while currents add, so $1/R_{\rm parallel}=\sum1/R_i$. Two $100\,\Omega$ resistors therefore give $200\,\Omega$ in series and $50\,\Omega$ in parallel. Always check the actual topology: elements drawn near each other are not necessarily in parallel unless both ends connect to the same two nodes.

An ideal voltage source maintains a stated potential difference by non-electrostatic processes, such as chemical reactions. Its electromotive force, or emf, is energy supplied per charge, despite the historical word force. Real batteries also have internal resistance and chemical limitations. In a quasistatic circuit without separately unaccounted changing magnetic flux, signed voltage changes around a loop sum to zero. When inductors are present, their induced-voltage contribution must be included consistently rather than invoking a purely electrostatic loop integral.

For a $12\,\mathrm V$ ideal source feeding $100\,\Omega$ and $200\,\Omega$ in series, current is $12/300=0.040\,\mathrm A$. Drops are $4\,\mathrm V$ and $8\,\mathrm V$. Source power is $0.48\,\mathrm W$, equal to $0.16+0.32\,\mathrm W$ in the resistors. This power balance is an independent check on the loop calculation.

## Capacitor charging: solving the first circuit differential equation

A capacitor stores separated charge with $Q=CV$. If current enters its positive terminal, $I=dQ/dt=C\,dV/dt$ for constant capacitance. Connect an initially uncharged capacitor through resistor $R$ to a constant source $V_0$. The loop equation is

$$V_0-R\frac{dQ}{dt}-\frac QC=0.$$

Rearrange to $dQ/dt=(CV_0-Q)/(RC)$. Set $u=CV_0-Q$, so $du/dt=-u/(RC)$. Separating variables gives $du/u=-dt/(RC)$ and therefore $u(t)=u(0)e^{-t/(RC)}$. Since $Q(0)=0$,

$$Q(t)=CV_0(1-e^{-t/(RC)}),\qquad I(t)=\frac{V_0}{R}e^{-t/(RC)}.$$

The time constant $RC$ has units seconds. At one time constant, capacitor voltage is about $0.632V_0$, not its final value. At five time constants it is about $0.993V_0$. An exponential approaches its limiting value without reaching it exactly at finite time in this ideal model.

For $R=10\,\mathrm{k\Omega}$ and $C=100\,\mathrm{\mu F}$, $RC=1.0\,\mathrm s$. With $V_0=5.0\,\mathrm V$, initial current is $0.50\,\mathrm{mA}$ and final capacitor energy is $CV_0^2/2=1.25\,\mathrm{mJ}$. The source supplies $\int V_0I\,dt=CV_0^2=2.50\,\mathrm{mJ}$; the other half dissipates in the resistor. Making the resistance smaller changes the charging rate, but in this ideal sudden-connection model it does not remove that energy loss. Inductance and radiation become relevant when taking unrealistically fast limits.

## Magnetic force is velocity dependent

The force on a charge moving through electric and magnetic fields is the Lorentz force,

$$\mathbf F=q(\mathbf E+\mathbf v\times\mathbf B).$$

The magnetic field $\mathbf B$ is measured in tesla, $\mathrm T=\mathrm{N\,s\,C^{-1}\,m^{-1}}$. The cross product makes magnetic force perpendicular to velocity, so $\mathbf v\cdot(q\mathbf v\times\mathbf B)=0$. A magnetic field alone changes direction but does no work on a point charge. Magnetic devices can still transfer energy through associated electric fields and moving constraints; the zero-work statement concerns this particular force term.

With velocity perpendicular to a uniform magnetic field, the force magnitude is $|q|vB$ and supplies centripetal acceleration $mv^2/r$. Nonrelativistically,

$$r=\frac{mv}{|q|B},\qquad \omega_c=\frac{|q|B}{m}.$$

For a proton at speed $1.0\times10^5\,\mathrm{m\,s^{-1}}$ in $0.10\,\mathrm T$, using $m_p\approx1.67\times10^{-27}\,\mathrm{kg}$, radius is approximately $0.0104\,\mathrm m$. A velocity component parallel to the field remains constant, producing a helix. At relativistic speeds use momentum $p$ in $r=p_\perp/(|q|B)$ and include the changed relation between momentum and velocity.

For a current-carrying wire, summing forces on moving charges gives $d\mathbf F=I\,d\boldsymbol\ell\times\mathbf B$. A straight $0.20\,\mathrm m$ segment carrying $3.0\,\mathrm A$ perpendicular to $0.50\,\mathrm T$ feels $0.30\,\mathrm N$. The surrounding circuit and supports experience reaction forces; isolating one segment does not describe total momentum conservation by itself.

## Steady currents produce magnetic fields

For localized steady currents in vacuum, the Biot–Savart law is

$$\mathbf B(\mathbf r)=\frac{\mu_0}{4\pi}\int I\,\frac{d\boldsymbol\ell'\times(\mathbf r-\mathbf r')}{|\mathbf r-\mathbf r'|^3}.$$

The integral follows the source wire, and its orientation is conventional current. For extended current density, replace $I\,d\boldsymbol\ell'$ by $\mathbf J(\mathbf r')dV'$. The law applies to magnetostatics; rapidly changing sources require retarded electromagnetic fields. $\mu_0\approx1.257\times10^{-6}\,\mathrm{N\,A^{-2}}$ is the vacuum permeability.

An infinitely long straight wire gives circular field lines of magnitude $B=\mu_0I/(2\pi r)$. One can obtain this by integrating Biot–Savart, or by Ampere's law and cylindrical symmetry:

$$\oint\mathbf B\cdot d\boldsymbol\ell=\mu_0I_{\rm enclosed}.$$

On a circular path $\mathbf B$ is tangential with constant magnitude, so $B(2\pi r)=\mu_0I$. For $I=10\,\mathrm A$ and $r=0.020\,\mathrm m$, $B\approx1.0\times10^{-4}\,\mathrm T$. As in Gauss' law, symmetry permits solving for the field; the integral law alone is not an algebraic field formula for an arbitrary geometry.

For a long tightly wound solenoid with $n$ turns per unit length, the ideal interior field is approximately $B=\mu_0nI$, while the exterior field is small away from ends. A rectangular Ampere loop aligned with the axis yields the relation when the long-solenoid approximation is valid. An infinite ideal solenoid is a mathematical limit; finite coils have fringe fields.

## Divergence, vector potential, and magnetic dipoles

In ordinary classical electromagnetism there are no observed isolated magnetic charge sources. The field obeys

$$\nabla\cdot\mathbf B=0.$$

Equivalently, net magnetic flux through any closed surface is zero. This differs from electric Gauss' law. Cutting a bar magnet produces smaller magnets rather than isolated north and south magnetic charges in the ordinary material description.

A divergence-free field can locally be represented as a curl, $\mathbf B=\nabla\times\mathbf A$, where $\mathbf A$ is the vector potential. Adding a gradient $\nabla\chi$ to $\mathbf A$ changes no magnetic field because curl of a smooth gradient is zero. This gauge freedom is a redundancy in description, not a physical ambiguity in $\mathbf B$. Global topology and boundary choices can require more careful potential patches; local formulas are not a reason to ignore those conditions.

A small planar current loop has magnetic dipole moment $\mathbf m=IA\hat{\mathbf n}$, with normal set by the right-hand rule following current. In a uniform field its torque is $\mathbf m\times\mathbf B$ and energy is $-\mathbf m\cdot\mathbf B$. Far from a small loop its dipolar field has the same angular structure as an electric dipole, with magnetic constants and the appropriate moment. This similarity does not mean magnetic monopoles are present inside the loop.

Matter can acquire magnetic moments through microscopic orbital and spin effects. Diamagnetic response opposes an applied field, paramagnetic response tends to align moments, and ferromagnets can exhibit collective order and hysteresis. A single constant permeability is only a linear-response approximation; ferromagnetic response depends on history and can saturate. Chapter 23 connects these properties to quantum states and collective behavior.

## Changing magnetic flux creates circulation of electric field

Faraday's law for a stationary closed contour is

$$\oint\mathbf E\cdot d\boldsymbol\ell=-\frac{d}{dt}\int_S\mathbf B\cdot d\mathbf A.$$

The contour direction and surface normal follow the right-hand rule. The minus sign is Lenz's law: the induced response tends to oppose the change that drives it. It does not mean the induced field always opposes the original magnetic field. If an upward flux is decreasing, the induced current tends to support upward flux, opposing the decrease.

For a circular loop of radius $r$ enclosing a uniform perpendicular field changing at rate $dB/dt$, flux is $\pi r^2B$ and emf magnitude is $\pi r^2|dB/dt|$. With $r=0.050\,\mathrm m$ and $dB/dt=0.20\,\mathrm{T\,s^{-1}}$, emf is $1.57\,\mathrm{mV}$. The induced electric field exists even if the wire is absent. The wire reveals it by providing mobile charge and a circuit response.

For a moving material loop, the general motional emf includes magnetic force on carriers:

$$\mathcal E=\oint(\mathbf E+\mathbf u\times\mathbf B)\cdot d\boldsymbol\ell,$$

where $\mathbf u$ is the loop element's velocity. Under the usual smooth moving-loop assumptions this equals minus the rate of magnetic flux through the moving loop. A conducting rod of length $\ell$ sliding at speed $u$ perpendicular to a uniform field develops emf magnitude $B\ell u$. If it drives current, magnetic drag resists motion and the pulling agent supplies the electrical and thermal energy. A static magnetic field is not a free energy source.

## Inductance stores magnetic energy

For a fixed linear circuit, flux linkage is proportional to current: $\Lambda=LI$. Flux linkage counts flux through each turn and sums over turns. The self-induced emf is $-L\,dI/dt$. With passive terminal signs, the inductor voltage drop is $V_L=L\,dI/dt$. These two sign statements describe the same physics with different referenced directions.

The instantaneous power entering an ideal inductor is $VI=LI\,dI/dt$, so its stored energy is

$$U_L=\frac12LI^2.$$

Inductance is measured in henries, $\mathrm H=\mathrm{V\,s\,A^{-1}}$. It depends on geometry and material response; a magnetic core can make it nonlinear. In vacuum the corresponding field energy density is $B^2/(2\mu_0)$, which will be combined with electric energy in Chapter 18.

For a series resistor and inductor connected to constant voltage $V_0$, $L\,dI/dt+RI=V_0$. The same first-order method as capacitor charging gives

$$I(t)=\frac{V_0}{R}(1-e^{-tR/L}).$$

The time constant is $L/R$. Current cannot change discontinuously in an ideal finite-voltage inductor because that would require an impulsively infinite $dI/dt$. Opening a real inductive circuit can therefore generate a large transient voltage as the stored field energy seeks a discharge path.

Mutual inductance couples two circuits: a current change in one changes flux through the other. In a linear reciprocal arrangement, the same mutual coefficient $M$ appears in both directions with signs set by winding orientation. Transformers exploit this coupling under alternating excitation. An ideal transformer changes voltage and current ratios while conserving power; real cores and windings introduce losses and frequency limits.

## LC and RLC circuits revisit oscillation

Connect an ideal inductor and capacitor. Let $Q$ denote the capacitor plate charge with a consistent loop orientation. The equation is

$$L\frac{d^2Q}{dt^2}+\frac QC=0,$$

with natural angular frequency $\omega_0=1/\sqrt{LC}$. Electric energy $Q^2/(2C)$ and magnetic energy $LI^2/2$ exchange while their sum stays fixed. This is the same mathematics as a mass-spring oscillator with $L$ playing the inertial role and $1/C$ the restoring coefficient. The analogy concerns equations and energy structure, not a literal mass moving in the wire.

Adding series resistance gives $LQ''+RQ'+Q/C=0$. Divide by $L$ and define damping rate $\gamma=R/(2L)$. The underdamped angular frequency is $\sqrt{\omega_0^2-\gamma^2}$ when $\gamma<\omega_0$. Critical and overdamped cases follow the oscillator analysis of Chapter 7. For $L=0.10\,\mathrm H$ and $C=10\,\mathrm{\mu F}$, $\omega_0=1000\,\mathrm{s^{-1}}$ and $f_0=\omega_0/(2\pi)\approx159\,\mathrm{Hz}$. With $R=20\,\Omega$, $\gamma=100\,\mathrm{s^{-1}}$, giving an underdamped response.

## Alternating current and complex impedance

Use the convention $V(t)=\operatorname{Re}[\widetilde V e^{-i\omega t}]$ and similarly for current. The complex amplitude records magnitude and phase; the observed voltage is its real part. Differentiation becomes multiplication by $-i\omega$. For a resistor, $\widetilde V=R\widetilde I$. For an inductor, $\widetilde V=-i\omega L\widetilde I$. For a capacitor, $\widetilde I=-i\omega C\widetilde V$, so

$$Z_R=R,\qquad Z_L=-i\omega L,\qquad Z_C=\frac{i}{\omega C}.$$

Signs would reverse for the equally valid $e^{+i\omega t}$ convention. Mixing conventions within a calculation gives incorrect phases. Series impedances add exactly as resistances do because complex voltage amplitudes satisfy the same linear loop equation. Parallel admittances $1/Z$ add because currents add.

For a driven series RLC circuit,

$$Z=R+i\left(\frac1{\omega C}-\omega L\right),\qquad |\widetilde I|=\frac{|\widetilde V|}{\sqrt{R^2+(1/(\omega C)-\omega L)^2}}.$$

At $\omega=1/\sqrt{LC}$ the reactances cancel and current amplitude is $|\widetilde V|/R$ in this ideal series model. Capacitor and inductor voltages can individually exceed the source amplitude because they are nearly opposite in phase, not because energy conservation fails. Average power delivered to a passive element is $\frac12\operatorname{Re}(\widetilde V\widetilde I^*)$ when amplitudes are peak amplitudes; for the resistor it is $I_{\rm rms}^2R$ with $I_{\rm rms}=|\widetilde I|/\sqrt2$.

The factor one-half is a time average of squared sine or cosine, not an arbitrary electrical convention. Root-mean-square voltage is the constant voltage that would produce the same average resistor heating. At $10\,\mathrm V$ peak across $100\,\Omega$, average power is $10^2/[2(100)]=0.50\,\mathrm W$.

## When a lumped circuit stops being enough

Lumped models assume propagation delays across the device are small compared with the variation time, so one current or voltage can represent an element. At sufficiently high frequency or large dimension, wires have distributed capacitance and inductance, transmission-line waves matter, and radiation can carry energy away. Even at low frequency, parasitic resistance, leakage, and coupling can matter for precision measurements.

A circuit diagram is therefore a controlled approximation to fields and materials, rather than a replacement for them. The next chapter shows how Maxwell's equations predict propagation, tie charge conservation to displacement current, and account for the energy flowing around and into circuit elements. The companion's circuit and induction calculations should be interpreted with the ideal element assumptions stated here.

### Optional practice

1. A $9.0\,\mathrm V$ source drives $100\,\Omega$ and $200\,\Omega$ in parallel. Find each current, total current, equivalent resistance, and total power.
2. A $2.0\,\mathrm{\mu F}$ capacitor charges through $0.50\,\mathrm{M\Omega}$. Find its time constant and fraction of final voltage after 2.0 seconds.
3. A positive charge moves along $+x$ in a magnetic field along $+z$. Find the force direction. What changes if the charge is negative?
4. Find the field $0.050\,\mathrm m$ from an ideal long straight wire carrying $5.0\,\mathrm A$.
5. A loop area $0.020\,\mathrm{m^2}$ has its upward flux density increase at $0.30\,\mathrm{T\,s^{-1}}$. Find emf magnitude and induced current direction viewed from above in a resistive closed loop.
6. A $0.20\,\mathrm H$ inductor carries $3.0\,\mathrm A$. Find stored energy. If current rises uniformly to that value in 0.10 seconds from zero, find voltage magnitude during the rise.
7. Derive the ideal LC angular frequency from the charge equation and evaluate it for $L=0.25\,\mathrm H$, $C=4.0\,\mathrm{\mu F}$.
8. Under the $e^{-i\omega t}$ convention, derive capacitor impedance and explain why its sign differs from tables using $e^{+i\omega t}$.

Hints and solutions are in `../solutions/17-hints.md` and `../solutions/17-solutions.md`.

### Source connections

Feynman Volume II Chapters 13–18 and 22 connect magnetostatics, vector potential, induced currents, induction laws, and AC circuits. Chapter 29 connects charge motion to fields. The charge-relaxation model, energy checks, and explicit phasor convention here support later numerical and laboratory work without reproducing the source's prose.
