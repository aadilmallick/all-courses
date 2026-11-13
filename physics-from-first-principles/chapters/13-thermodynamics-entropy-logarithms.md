# 13. Thermodynamics, entropy, and the mathematics of logarithms

A hot cup cools in a room. A room-temperature cup does not ordinarily cool the room while heating itself. Energy conservation permits both processes if the energy transfers balance. Why does only one direction happen spontaneously? Thermodynamics answers this without following every molecule. It describes reproducible relations between macroscopic states and identifies restrictions that conservation alone does not provide.

This chapter starts with temperature and energy accounting, builds logarithms when expansion work requires them, and then develops entropy. The central achievement will be an ability to decide what is possible, what work a process can produce, and which assumptions make a familiar formula legitimate. Thermodynamics describes equilibrium states and constraints on processes. It does not, by itself, predict every rate of approach to equilibrium.

## States, systems, and temperature

Choose a system boundary before writing an equation. Gas inside a piston can be a closed system: energy crosses the boundary but matter does not. A turbine with flowing steam is an open system and needs mass-flow energy terms. An isolated system exchanges neither energy nor matter with its surroundings. These words concern the selected boundary; they are not intrinsic labels attached permanently to an object.

An equilibrium state has no macroscopic changes or unbalanced internal gradients that drive further evolution under the specified constraints. A simple compressible gas can often be characterized by particle number $N$, volume $V$, and temperature $T$. Pressure $p$ is then related through an equation of state. For a dilute ideal gas,

$$pV=Nk_BT=nRT.$$

Here $k_B$ is Boltzmann's constant, $n$ is amount in moles, and $R$ is the gas constant. The ideal-gas equation neglects intermolecular interactions and the particles' finite occupied volume; it fails near condensation and at sufficiently high density. Temperature in this equation is absolute kelvin temperature. A Celsius temperature must be shifted by 273.15 before use.

Temperature is operationally defined by thermal equilibrium: systems that are each in thermal equilibrium with the same third system are in equilibrium with each other. This zeroth-law relation makes thermometers possible. Temperature is not total energy. A large cool lake can contain more internal energy than a hot cup, while heat still tends to flow from the hotter cup toward the cooler surroundings when they interact.

Some quantities scale when the system is doubled. Internal energy $U$, volume, entropy, and particle number are extensive. Temperature, pressure, and density are intensive for homogeneous equilibrium phases. This distinction helps detect errors: doubling an ideal gas sample at unchanged temperature should double its internal energy, not its pressure if volume also doubles.

## Heat and work describe transfers

Internal energy includes microscopic kinetic and interaction energies after macroscopic centre-of-mass motion and external potential energy have been accounted for separately. Heat $Q$ is energy transferred because of a temperature difference. Work $W$ is energy transferred through organized generalized forces and displacements. Neither is a stored substance called heat or work inside the system.

For a closed system whose macroscopic kinetic and potential energies are unchanged, our convention is

$$\Delta U=Q-W,$$

with $Q>0$ for heat entering the system and $W>0$ for work done by the system on its surroundings. Other sign conventions exist; translating them consistently matters more than preferring one. In differential notation we write $dU=\delta Q-\delta W$. The different symbols warn that $U$ is a state function, whereas heat and work depend on the path between states.

For a slowly moving piston of area $A$, a displacement $dx$ changes volume by $dV=A\,dx$. Work done against external pressure $p_{\rm ext}$ is $\delta W=p_{\rm ext}A\,dx=p_{\rm ext}\,dV$. In a mechanically reversible limit, the gas pressure differs infinitesimally from the external pressure, so

$$W_{\rm rev}=\int_{V_i}^{V_f}p\,dV.$$

For a rapid irreversible expansion, using an equilibrium gas pressure inside this integral may be meaningless. The external pressure, when well defined, determines boundary work. Free expansion into a vacuum has $p_{\rm ext}=0$ and does zero boundary work even though volume increases.

Suppose a gas absorbs $500\,\mathrm J$ while performing $200\,\mathrm J$ of work. Its internal energy increases by $300\,\mathrm J$. If it is compressed so the surroundings do $200\,\mathrm J$ on it while it loses $50\,\mathrm J$ of heat, then $W=-200\,\mathrm J$, $Q=-50\,\mathrm J$, and $\Delta U=150\,\mathrm J$. Writing the signs before calculating avoids a frequent confusion.

## Heat capacity and the first molecular connection

Heat capacity specifies how much energy transfer changes temperature under stated constraints. At fixed volume with no other work, $C_V=(\partial U/\partial T)_V$. At fixed pressure, heat capacity is related to enthalpy $H=U+pV$, giving $C_p=(\partial H/\partial T)_p$. Capacities refer to the whole chosen sample; lowercase or molar versions divide by mass or amount.

For a classical monatomic ideal gas, molecular translational kinetic energy gives

$$U=\frac32Nk_BT,\qquad C_V=\frac32Nk_B,\qquad C_p=\frac52Nk_B.$$

Chapter 14 derives the mean kinetic energy using probability. For now this is a microscopic result supplied as a model input, not a consequence of the first law alone. The difference $C_p-C_V=Nk_B$ arises because constant-pressure heating also expands the gas and does work. Molecules with rotational or vibrational degrees of freedom have different heat capacities, and quantum effects can freeze out some modes.

Heating one mole of a monatomic ideal gas by $20\,\mathrm K$ at fixed volume requires $Q=(3R/2)(20)\approx249\,\mathrm J$, using $R\approx8.314\,\mathrm{J\,mol^{-1}\,K^{-1}}$. At constant pressure the required heat is $(5R/2)(20)\approx416\,\mathrm J$. The additional $166\,\mathrm J$ is expansion work. Both paths connect temperatures differing by the same amount, but heat differs because it is a path quantity.

## The logarithm appears because scale ratios matter

During reversible isothermal expansion of an ideal gas at temperature $T$, pressure is $Nk_BT/V$. The work is therefore

$$W=Nk_BT\int_{V_i}^{V_f}\frac{dV}{V}.$$

The antiderivative needed here defines the natural logarithm. For $x>0$,

$$\ln x=\int_1^x\frac{du}{u}.$$

Its derivative is $1/x$. It measures multiplicative change using an additive number. To see why, split an integral at $a>0$ and substitute $u=av$ in the remaining part. This gives $\ln(ab)=\ln a+\ln b$. Consequently $\ln(a/b)=\ln a-\ln b$, and $\ln(x^r)=r\ln x$ for positive $x$ with an appropriate real exponent. These identities follow from the definition rather than being unrelated calculation tricks.

The inverse function is the exponential: $y=\ln x$ means $x=e^y$. Its derivative equals itself, and $e^{a+b}=e^ae^b$. Natural logarithms require positive dimensionless arguments. Writing $\ln V$ without a reference volume is shorthand at best; the physical result must contain a ratio such as $V_f/V_i$.

Thus

$$W=Nk_BT\ln\left(\frac{V_f}{V_i}\right).$$

Doubling and then doubling again produces two equal work increments in an isothermal ideal-gas expansion because the ratio is the same each time. The pressure is lower during the second interval, but the extra volume is proportionally larger. The logarithm encodes precisely that compensation.

For one mole at $300\,\mathrm K$ expanding reversibly from $10\,\mathrm L$ to $20\,\mathrm L$, $W=8.314(300)\ln2\approx1729\,\mathrm J$. For an ideal gas $U$ depends only on temperature, so $\Delta U=0$ and $Q=W$. The gas does work by continuously absorbing heat. Isothermal does not mean adiabatic.

## Adiabatic expansion and a useful differential equation

An adiabatic process has $Q=0$. A reversible adiabatic ideal-gas expansion therefore satisfies $dU=-p\,dV$. If $C_V$ is constant,

$$C_VdT=-\frac{Nk_BT}{V}\,dV.$$

Divide by $T$ and integrate:

$$C_V\ln\frac{T_f}{T_i}=-Nk_B\ln\frac{V_f}{V_i}.$$

Let $\gamma=C_p/C_V$. Since $C_p-C_V=Nk_B$, $Nk_B/C_V=\gamma-1$. Exponentiating gives

$$TV^{\gamma-1}=\text{constant},\qquad pV^\gamma=\text{constant}.$$

These relations need reversible adiabatic evolution and an ideal gas with approximately constant heat capacities. They do not describe every insulated expansion. An insulated free expansion of an ideal gas has no heat and no work, so its temperature remains unchanged instead of following this reversible curve.

For a monatomic gas, $\gamma=5/3$. If volume doubles in a reversible adiabatic expansion, $T_f/T_i=2^{-2/3}\approx0.630$. Starting at $300\,\mathrm K$ gives approximately $189\,\mathrm K$. Cooling occurs because the gas supplies work from its internal energy. If a calculation instead predicts heating for this expansion, its work sign is likely wrong.

## The second law and why a heat engine needs a sink

A cyclic engine returns its working substance to the same state, so $\Delta U=0$ over a cycle. Suppose it absorbs heat $Q_h>0$ from a hot reservoir and rejects magnitude $Q_c>0$ to a cold reservoir. The net work output is $W=Q_h-Q_c$ and efficiency is

$$\eta=\frac{W}{Q_h}=1-\frac{Q_c}{Q_h}.$$

Energy conservation alone would allow $Q_c=0$. The second law excludes a cyclic device whose sole effect is to convert heat drawn from one reservoir entirely into work. It also excludes spontaneous transfer of heat from cold to hot as the sole effect. Refrigerators can move heat from cold to hot because they consume work; their complete effect includes that energy input.

A reversible engine is an ideal limiting device whose operation can be reversed without leaving net changes elsewhere. Reversible does not merely mean slow. Friction, finite temperature differences, electrical resistance, and mixing can produce irreversibility even when a process is performed gradually.

For two reservoirs at absolute temperatures $T_h>T_c$, a reversible engine has

$$\frac{Q_c}{Q_h}=\frac{T_c}{T_h},\qquad \eta_{\rm rev}=1-\frac{T_c}{T_h}.$$

One derivation uses a Carnot cycle with two isotherms joined by two reversible adiabats. The isothermal heats are $Nk_BT_h\ln(V_2/V_1)$ and magnitude $Nk_BT_c\ln(V_3/V_4)$. The adiabatic relations imply $V_2/V_1=V_3/V_4$, so the logarithmic factors cancel in their ratio. A hypothetical more efficient engine could drive the reversible one backward and violate the second law. That comparison establishes the bound for every engine operating only between those reservoirs.

At $T_h=600\,\mathrm K$ and $T_c=300\,\mathrm K$, the maximum efficiency is $0.50$. If $Q_h=1000\,\mathrm J$, reversible work is $500\,\mathrm J$ and rejected heat is $500\,\mathrm J$. This is a ceiling, not a design guarantee. Raising temperatures introduces material and engineering constraints absent from the abstract cycle.

## Entropy is a state function built from reversible heat

The reversible cycle suggests that heat transfer divided by temperature has a special balance. For an infinitesimal reversible transfer, define entropy change by

$$dS=\frac{\delta Q_{\rm rev}}{T}.$$

Entropy has units $\mathrm{J\,K^{-1}}$. The subscript matters. For an irreversible process, computing $\int\delta Q/T$ along the actual path does not generally give the system's entropy change. Instead find any reversible path joining the same equilibrium endpoints. Because entropy is a state function, that calculation gives the correct endpoint difference.

For a closed system,

$$\Delta S=\int\frac{\delta Q}{T_{\rm boundary}}+S_{\rm generated},\qquad S_{\rm generated}\ge0.$$

This balance separates entropy transferred through a boundary from entropy generated by irreversibility. Several boundary regions at different temperatures need separate transfer terms. For an isolated system, no entropy crosses the boundary and its entropy cannot decrease. A subsystem's entropy can decrease if it exports sufficient entropy to its surroundings.

For a reversible ideal-gas path, the first law gives $\delta Q_{\rm rev}=C_VdT+p\,dV$. Dividing by $T$ and integrating gives

$$\Delta S=C_V\ln\frac{T_f}{T_i}+Nk_B\ln\frac{V_f}{V_i}.$$

This assumes constant $C_V$; otherwise integrate $C_V(T)/T$. The formula depends only on endpoints, so it also applies to irreversible transitions between those equilibrium states. In an insulated ideal-gas free expansion doubling volume, $\Delta S=Nk_B\ln2>0$ even though $Q=0$. Entropy increases through generation rather than heat transfer.

For one mole, the increase is $R\ln2\approx5.76\,\mathrm{J\,K^{-1}}$. Reversible isothermal expansion between the same states gives the same system entropy increase, but now it is supplied by heat transfer and the reservoir loses the same entropy. In the reversible case total entropy change is zero; in the isolated free expansion it is positive. Same endpoints for the gas, different consequences for the surroundings.

## A direct irreversibility calculation

Transfer $100\,\mathrm J$ from a reservoir at $400\,\mathrm K$ to one at $300\,\mathrm K$. The reservoirs' entropy changes are $-100/400=-0.250\,\mathrm{J\,K^{-1}}$ and $+100/300=0.333\,\mathrm{J\,K^{-1}}$. The total increase is approximately $0.0833\,\mathrm{J\,K^{-1}}$. Energy is conserved exactly in this ideal accounting, while entropy increases.

Reverse the transfer without any other change and the total entropy change would be negative. That is the thermodynamic reason it does not occur spontaneously. Entropy is therefore more precise than an everyday description such as disorder. A neat refrigerator interior can become colder and lower in entropy while the compressor and room create a larger entropy increase elsewhere.

For two finite bodies, temperatures change during transfer. If each has constant heat capacity $C$, integrating $dS=C\,dT/T$ gives $C\ln(T_f/T_i)$. Suppose equal bodies initially at $400\,\mathrm K$ and $300\,\mathrm K$ are thermally isolated together, with no work and equal constant $C=100\,\mathrm{J\,K^{-1}}$. Energy balance gives $T_f=350\,\mathrm K$. Their total entropy change is

$$100\ln(350/400)+100\ln(350/300)=100\ln(49/48)\approx2.06\,\mathrm{J\,K^{-1}}>0.$$

Replacing the logarithms by $Q/T$ with one arbitrarily chosen temperature would be incorrect because neither body stays at a fixed temperature.

## Refrigeration and the meaning of a performance ratio

A refrigerator removes heat $Q_c$ from a cold space, consumes work $W$, and rejects $Q_h=Q_c+W$ to a hotter room. Its useful output is the heat removed, so its coefficient of performance is $\mathrm{COP}_R=Q_c/W$. This is not a heat-engine efficiency. A value above one does not violate energy conservation: work enables the movement of heat already present in the cold space rather than supplying all the rejected energy itself.

For a reversible refrigerator, zero total reservoir entropy change requires $Q_h/T_h=Q_c/T_c$. Insert $Q_h=Q_c+W$ and multiply by $T_hT_c$ to obtain $T_cQ_c+T_cW=T_hQ_c$. Rearranging gives $W=Q_c(T_h-T_c)/T_c$ and therefore

$$\mathrm{COP}_{R,\max}=\frac{T_c}{T_h-T_c}.$$

Removing $600\,\mathrm J$ from a space at $270\,\mathrm K$ and rejecting heat to a room at $300\,\mathrm K$ requires at least $600(30)/270=66.7\,\mathrm J$ of work in this reversible model. Rejected heat is then $666.7\,\mathrm J$. The refrigerator reservoir loses $600/270\approx2.222\,\mathrm{J\,K^{-1}}$ and the room gains $666.7/300\approx2.222\,\mathrm{J\,K^{-1}}$. A real refrigerator requires more work and produces positive total entropy. A useful diagnostic is that the room must gain more heat than the cold space loses whenever the device consumes positive work.

As $T_h-T_c$ approaches zero, the ideal performance ratio diverges. This limiting mathematical result does not promise finite-rate heat transfer at zero temperature difference or zero machinery loss. Reversibility is an ideal limit; practical cooling power and performance depend on transport rates as well as thermodynamic bounds.

## Fundamental relations and thermodynamic potentials

For a simple compressible system of fixed composition in equilibrium, combine reversible heat and work to obtain

$$dU=T\,dS-p\,dV.$$

This is a relation between neighbouring equilibrium states; it is not a claim that every actual path is reversible. If particles can be exchanged, add $\mu\,dN$, where chemical potential $\mu$ is the energy change per added particle at fixed entropy and volume. Additional kinds of work need additional conjugate pairs, such as magnetic variables under a stated convention.

The natural variables of $U$ are $S,V,N$: $T=(\partial U/\partial S)_{V,N}$ and $p=-(\partial U/\partial V)_{S,N}$. These derivatives extract measurable quantities from one state function. The notation on each derivative states what is held fixed; omitting that information can make a thermodynamic expression ambiguous.

Often temperature or pressure is controlled more conveniently than entropy or volume. Define Helmholtz free energy $F=U-TS$. Differentiate using the product rule:

$$dF=dU-T\,dS-S\,dT=-S\,dT-p\,dV+\mu\,dN.$$

At fixed $T,V,N$, equilibrium minimizes $F$ among allowed states under the usual stable-equilibrium conditions. To see the physical basis, place a closed system in contact with a large reservoir at fixed $T$. For fixed volume and no other work, energy leaving the reservoir enters the system, so total entropy change is $\Delta S_{\rm total}=\Delta S-\Delta U/T=-\Delta F/T$. The second law requires $\Delta F\le0$ for spontaneous change under these constraints. The conclusion comes with constraints; $F$ need not decrease in an externally driven process.

For fixed temperature and pressure, define Gibbs free energy $G=U+pV-TS$. Its differential is

$$dG=-S\,dT+V\,dp+\mu\,dN.$$

At fixed $T,p,N$, it is the appropriate minimized potential. At fixed entropy and volume, internal energy is the relevant potential. These are different descriptions of the same energy-entropy competition adapted to different experimental controls.

## Maxwell relations turn hidden derivatives into measurable ones

If $F(T,V)$ has continuous second derivatives in a single smooth phase, mixed derivatives commute. Since $\partial F/\partial T=-S$ and $\partial F/\partial V=-p$,

$$\left(\frac{\partial S}{\partial V}\right)_T=\left(\frac{\partial p}{\partial T}\right)_V.$$

The minus signs cancel. For an ideal gas the right side is $Nk_B/V$, matching the volume derivative of the entropy formula already derived. This is a Maxwell relation: a mathematical identity from a thermodynamic potential, not an additional empirical law. The smoothness assumption can fail at a phase boundary, where derivatives may jump or diverge.

For coexisting phases, equality of temperature, pressure, and chemical potential expresses equilibrium. Along a coexistence curve the slope satisfies the Clapeyron equation $dp/dT=\Delta s/\Delta v=L/(T\Delta v)$, with consistent per-particle, per-mole, or per-mass quantities. It follows by equating $d\mu=-s\,dT+v\,dp$ for the phases. The latent heat $L=T\Delta s$ accounts for a finite entropy change at fixed coexistence temperature. Heat added during melting can change phase fraction without raising temperature, so a constant heat-capacity formula alone is insufficient.

### Optional practice

1. A gas loses $80\,\mathrm J$ of heat while surroundings do $140\,\mathrm J$ of work on it. Find $\Delta U$ using the chapter's convention.
2. Derive $\ln(a/b)=\ln a-\ln b$ from the product identity, and explain why logarithms of dimensional quantities require a reference scale.
3. Find reversible isothermal expansion work for $0.50$ mole of ideal gas at $400\,\mathrm K$ when volume triples.
4. A monatomic ideal gas expands reversibly and adiabatically from $V$ to $8V$. Find its final temperature as a fraction of its initial temperature.
5. An engine absorbs $1200\,\mathrm J$ from a $500\,\mathrm K$ reservoir and rejects heat to a $300\,\mathrm K$ reservoir. Find maximum work and minimum rejected heat for an engine operating only between these reservoirs.
6. One mole of ideal gas freely expands into twice its initial volume in an insulated vessel. Find $Q,W,\Delta U,\Delta T,\Delta S$ within the ideal-gas model.
7. Two bodies with equal constant heat capacity $200\,\mathrm{J\,K^{-1}}$ begin at $300\,\mathrm K$ and $500\,\mathrm K$. They exchange heat in isolation without work. Find equilibrium temperature and total entropy change.
8. Starting from $dG=-S\,dT+V\,dp$, derive $(\partial S/\partial p)_T=-(\partial V/\partial T)_p$. State the mathematical hypothesis needed.

Hints and solutions are in `../solutions/13-hints.md` and `../solutions/13-solutions.md`.

### Source connections

Feynman Volume I Chapters 44–46 provide the thermodynamic connection; Chapters 39–40 connect temperature to molecular motion. The free-energy and Maxwell-relation treatment extends the conceptual spine toward upper-undergraduate thermal physics. All explanations and examples here are original. Chapter 14 will connect entropy with probabilities and derive equilibrium distributions.
