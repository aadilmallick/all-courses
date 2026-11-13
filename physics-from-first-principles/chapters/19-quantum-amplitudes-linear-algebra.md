# 19. Quantum amplitudes, linear algebra, and two-state systems

Send individual electrons through a two-slit apparatus and record one detection at a time. Each event is localized, yet the accumulated distribution can show interference. Closing one slit changes the distribution in a way that is not obtained by adding two ordinary independent probability patterns. Quantum mechanics describes this with probability amplitudes, whose phases matter before probabilities are calculated.

The central problem is how to represent alternatives that can interfere and how to predict the outcomes of measurements. We will introduce the mathematical machinery in finite-dimensional systems first. Two-state examples let us multiply every matrix entry explicitly before the next chapter replaces finite lists by position-dependent wavefunctions. Quantum theory supplies new empirical postulates; it cannot be deduced from Newton's laws by clever algebra.

## What an amplitude predicts

For an outcome with complex amplitude $a$, quantum mechanics assigns probability $|a|^2=a^*a$. The star means complex conjugation: if $a=x+iy$, then $a^*=x-iy$ and $|a|^2=x^2+y^2$. Amplitudes can be negative or complex, while probabilities are real and nonnegative.

When coherent indistinguishable alternatives contribute to the same outcome, their amplitudes add. If two contributions are $a_1$ and $a_2$,

$$P=|a_1+a_2|^2=|a_1|^2+|a_2|^2+2\operatorname{Re}(a_1^*a_2).$$

The cross term is interference. If $a_1=1/2$ and $a_2=1/2$, the result is 1; if $a_2=-1/2$, it is 0. These numbers describe a particular final outcome and require the rest of the experiment to be normalized consistently. One should not assign the same unit probability independently to every point on a screen.

If the alternatives are distinguished by an available record, the relevant probability generally becomes a sum over those recorded alternatives rather than the coherent sum above. A person need not consciously read the record. Interaction with an apparatus or environment can correlate path alternatives with distinct physical states. Chapter 22 develops entanglement and decoherence; here the operational distinction is whether the experimental preparation retains coherent alternatives for the measured outcome.

For amplitudes of equal magnitude $a$ and relative phase $\phi$, $P=2|a|^2(1+\cos\phi)$. Phase differences can therefore be measured through probability changes. A phase multiplying every amplitude in the same state, $a_i\mapsto e^{i\chi}a_i$, changes no probabilities or interference internal to that state. Global phase and relative phase are physically different.

## State vectors are organized lists of amplitudes

Suppose a measurement has two exclusive outcomes, labelled 0 and 1. Represent a pure state by

$$|\psi\rangle=\begin{pmatrix}a\\b\end{pmatrix}=a|0\rangle+b|1\rangle,$$

where $|0\rangle=(1,0)^T$, $|1\rangle=(0,1)^T$, and the superscript $T$ denotes transposition. The vertical-bar notation, called a ket, names a vector. It does not add mysterious physical content. The normalization condition is

$$|a|^2+|b|^2=1.$$

Then the outcome probabilities in this basis are $P(0)=|a|^2$ and $P(1)=|b|^2$. For $a=\sqrt3/2$ and $b=i/2$, they are 3/4 and 1/4. The relative phase is not visible in this one measurement but can affect a later measurement in another basis.

A vector space is a collection where vectors can be added and multiplied by scalars while obeying the usual distributive and associative rules. Here the scalars are complex numbers. Linear combination means $a\mathbf u+b\mathbf v$. A set is linearly independent if no nontrivial combination of its members is zero. A basis is an independent set spanning the space, meaning every vector has a unique expansion in that set. A two-dimensional state space has two basis vectors, but infinitely many possible normalized states.

The dimension counts mutually orthogonal basis alternatives, not the number of possible state preparations. Also, a superposition is not a statement that a single measurement reveals two ordinary outcomes simultaneously. The theory predicts one of the specified outcomes with the corresponding probabilities, while other experimental arrangements can reveal phase information.

## Inner products make geometry and probability precise

For vectors $|u\rangle=(u_1,u_2)^T$ and $|v\rangle=(v_1,v_2)^T$, define

$$\langle u|v\rangle=u_1^*v_1+u_2^*v_2.$$

The bra $\langle u|$ is the conjugate transpose of $|u\rangle$. Conjugating the first vector ensures $\langle u|u\rangle=|u_1|^2+|u_2|^2\ge0$. Using an ordinary unconjugated dot product would give $1+i^2=0$ for the nonzero vector $(1,i)^T$, which cannot serve as a squared length.

The norm is $\|u\|=\sqrt{\langle u|u\rangle}$. Vectors are orthogonal if their inner product is zero, and orthonormal if each also has norm 1. The basis states 0 and 1 are orthonormal. Define $|+\rangle=(|0\rangle+|1\rangle)/\sqrt2$ and $|-\rangle=(|0\rangle-|1\rangle)/\sqrt2$. Their inner product is $(1-1)/2=0$, so they form another orthonormal basis.

The amplitude for obtaining normalized state $|u\rangle$ in a projective measurement of a basis containing it is $\langle u|\psi\rangle$, and its probability is the squared modulus. For $|\psi\rangle=(\sqrt3/2,i/2)^T$,

$$\langle+|\psi\rangle=\frac{\sqrt3+i}{2\sqrt2},\qquad P(+)=\frac{3+1}{8}=\frac12.$$

If the same 0/1 probabilities were prepared with $b=+1/2$ instead, then $P(+)=(\sqrt3+1)^2/8=(2+\sqrt3)/4\approx0.933$. Equal probabilities in one basis do not specify the full pure state.

## Projection and completeness

The operator projecting onto a normalized vector $|u\rangle$ is $P_u=|u\rangle\langle u|$. Acting on a state gives $P_u|\psi\rangle=|u\rangle\langle u|\psi\rangle$: it keeps only the component along that vector. It satisfies $P_u^2=P_u$ because $\langle u|u\rangle=1$.

For an orthonormal basis $\{|j\rangle\}$, completeness says $\sum_j|j\rangle\langle j|=I$, the identity operator. Applying this to any vector reconstructs its basis expansion. Taking the expectation in a normalized state gives $\sum_j|\langle j|\psi\rangle|^2=1$, so completeness ensures probabilities add to one.

For an ideal projective measurement, conditional on obtaining outcome associated with projector $P$, the updated state is $P|\psi\rangle/\sqrt{\langle\psi|P|\psi\rangle}$ when that outcome has nonzero probability. The denominator normalizes the retained component. This is an operational state-update rule. Real measurements can be imperfect or more general than projective measurements; the rule is not a complete microscopic description of every apparatus.

## Matrices represent linear operations

A linear operator $A$ obeys $A(a|u\rangle+b|v\rangle)=aA|u\rangle+bA|v\rangle$. Its matrix is determined by its action on basis vectors. If

$$A=\begin{pmatrix}A_{00}&A_{01}\\A_{10}&A_{11}\end{pmatrix},$$

then

$$A\begin{pmatrix}a\\b\end{pmatrix}=\begin{pmatrix}A_{00}a+A_{01}b\\A_{10}a+A_{11}b\end{pmatrix}.$$

Each output is a row-column sum. For $X=\begin{pmatrix}0&1\\1&0\end{pmatrix}$, the operation exchanges the two amplitudes: $X(a,b)^T=(b,a)^T$. Matrix multiplication represents successive operations, with the rightmost operator acting first. In general $AB\ne BA$.

The conjugate transpose $A^\dagger$ swaps rows and columns while conjugating entries. It is characterized by $\langle u|Av\rangle=\langle A^\dagger u|v\rangle$. A Hermitian operator satisfies $A^\dagger=A$. In finite-dimensional quantum mechanics, observable quantities are represented by Hermitian matrices, whose measurement outcomes are their eigenvalues. This association is another physical postulate, while the properties of Hermitian matrices are mathematical theorems.

## Eigenvalues identify definite outcomes

An eigenvector obeys $A|u\rangle=\lambda|u\rangle$: the operation changes only its scale. A normalized state in an eigenvector of an observable yields that eigenvalue with certainty in the ideal measurement model. For $Z=\begin{pmatrix}1&0\\0&-1\end{pmatrix}$, basis states 0 and 1 have eigenvalues+1 and−1. For $X$, states+ and− have those eigenvalues instead.

To find eigenvalues of a two-by-two matrix, seek a nonzero solution of $(A-\lambda I)|u\rangle=0$. Such a solution exists when its determinant vanishes. For $\begin{pmatrix}a&b\\c&d\end{pmatrix}$, determinant is $ad-bc$, so the condition is $(a-\lambda)(d-\lambda)-bc=0$. This quadratic is a calculation tool, not the definition of an eigenvalue.

As a worked example, take an energy operator

$$H=\begin{pmatrix}E_0&g\\g&E_0\end{pmatrix},\qquad g\text{ real}.$$

Its characteristic equation is $(E_0-E)^2-g^2=0$, giving $E=E_0\pm g$. Substitution shows eigenstates $|+\rangle$ and $|-\rangle$. The off-diagonal coupling splits the two uncoupled equal energies. If $g$ has energy units, so do the eigenvalues; a bare dimensionless matrix cannot silently become an energy operator without a scale.

## Two central theorems about Hermitian matrices

First, every Hermitian eigenvalue is real. If $A|u\rangle=\lambda|u\rangle$, then $\langle u|A|u\rangle=\lambda\langle u|u\rangle$. Hermiticity makes the left side equal to its complex conjugate, while $\langle u|u\rangle>0$ for a nonzero eigenvector. Thus $\lambda=\lambda^*$.

Second, eigenvectors of different eigenvalues are orthogonal. If $A|u\rangle=\lambda|u\rangle$ and $A|v\rangle=\mu|v\rangle$, then Hermiticity gives both $\langle u|Av\rangle=\mu\langle u|v\rangle$ and $\langle Au|v\rangle=\lambda\langle u|v\rangle$ because the eigenvalues are real. Therefore $(\mu-\lambda)\langle u|v\rangle=0$, and unequal eigenvalues force zero inner product.

The finite-dimensional spectral theorem adds that a Hermitian matrix has a complete orthonormal eigenbasis. Degenerate eigenvalues require choosing orthonormal vectors within their eigenspace, which can be done without changing that eigenvalue. This theorem permits the expansion $A=\sum_j a_j|a_j\rangle\langle a_j|$, with a sum over an orthonormal eigenbasis. Infinite-dimensional operators need domain and spectral subtleties; the finite proof is not permission to ignore those in wave mechanics.

## Expectations and uncertainty are distribution properties

For observable $A$ in normalized state $|\psi\rangle$, expectation is $\langle A\rangle=\langle\psi|A|\psi\rangle$. In an eigenbasis it becomes $\sum_j a_j|\langle a_j|\psi\rangle|^2$, the probability-weighted mean. Its uncertainty is the standard deviation,

$$\Delta A=\sqrt{\langle A^2\rangle-\langle A\rangle^2}.$$

For $Z$ in state $(\sqrt3/2,i/2)^T$, expectation is $3/4-1/4=1/2$. Since $Z^2=I$, $\langle Z^2\rangle=1$, so $\Delta Z=\sqrt{1-1/4}=\sqrt3/2$. No individual ideal measurement yields 1/2; outcomes remain+1 or−1. The expectation describes a collection of identically prepared measurements.

Quantum uncertainty is not automatically detector error or ignorance of a hidden classical trajectory. Within the theory it can remain nonzero for an ideally prepared pure state and an ideal measurement. Experimental uncertainty, calibration error, and quantum outcome variation are distinct issues that can all appear in the same laboratory.

## Noncommuting operations and measurement order

Define the commutator $[A,B]=AB-BA$. If it is nonzero, the operations do not generally commute. Introduce the third Pauli matrix

$$Y=\begin{pmatrix}0&-i\\i&0\end{pmatrix}.$$

Direct multiplication gives $XY=iZ$ and $YX=-iZ$, so $[X,Y]=2iZ$. Also $X^2=Y^2=Z^2=I$. These matrices provide a compact vocabulary for any two-state Hermitian operator, which can be written as a real coefficient times identity plus real coefficients times $X,Y,Z$.

To see measurement order operationally, begin in $|0\rangle$, so a $Z$ measurement yields+1 with certainty. An intervening $X$ measurement yields+ or− with equal probability and leaves the corresponding state. A following $Z$ measurement then has equal probabilities for±1. The intermediate measurement changes the preparation relevant for the later result. One must specify the entire sequence, not assign pre-existing simultaneous values from one measurement alone.

Commuting Hermitian matrices in finite dimensions admit a simultaneous eigenbasis after resolving degeneracies. Noncommutation does not mean every state has uncertainty in both observables or that every measurement ordering produces distinguishable probabilities. It means no universal interchange rule or shared complete eigenbasis exists in general.

## Cauchy–Schwarz and a careful uncertainty relation

For any vectors $u,v$, $|\langle u|v\rangle|^2\le\langle u|u\rangle\langle v|v\rangle$. One proof starts from $\|u-\alpha v\|^2\ge0$ and chooses $\alpha=\langle v|u\rangle/\langle v|v\rangle$ when $v\ne0$. Expanding the squared norm yields the inequality; the zero-vector case is immediate. Equality holds when the vectors are linearly dependent.

Set $|u\rangle=(A-\langle A\rangle)|\psi\rangle$ and $|v\rangle=(B-\langle B\rangle)|\psi\rangle$. Their squared norms are $(\Delta A)^2$ and $(\Delta B)^2$. The imaginary part of $\langle u|v\rangle$ is related to the commutator: $\langle[A,B]\rangle=2i\operatorname{Im}\langle u|v\rangle$. Since a complex number's magnitude is at least the magnitude of its imaginary part,

$$\Delta A\,\Delta B\ge\frac12|\langle[A,B]\rangle|.$$

This Robertson bound is valid for the finite matrices considered here. For unbounded operators such as position and momentum, the state must lie in appropriate operator domains. The bound can be zero in some states even when the operators do not commute; that does not establish simultaneous sharp values. A stronger relation also retains the real covariance term, but the bound above is enough to reveal the mechanism linking geometry and noncommutation.

For $X,Y$ in state 0, $\langle Z\rangle=1$, so the right side is 1. Both $X$ and $Y$ have zero expectation and unit variance there, giving product 1 and saturating the bound. Physical spin components use $S_i=\hbar\sigma_i/2$; Chapter 21 explains their physical origin and units.

## Unitary transformations preserve total probability

A linear transformation $U$ is unitary if $U^\dagger U=I$. Then $\|U\psi\|^2=\langle\psi|U^\dagger U|\psi\rangle=\|\psi\|^2$. Unitaries preserve all inner products, not just one chosen state's norm. Their inverse is their conjugate transpose.

The matrix changing between the 0/1 and± bases is

$$U=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}.$$

Multiplying its transpose by itself gives identity, since diagonal row-column sums are $(1+1)/2=1$ and off-diagonal sums are $(1-1)/2=0$. For a basis matrix whose columns are the new basis vectors in old coordinates, new coordinates are $U^\dagger|\psi\rangle$, and an operator's new matrix is $U^\dagger AU$. Changing coordinates does not change physical probabilities if states and operators transform consistently.

An active unitary operation, such as a controlled apparatus rotation, changes the physical state relative to a fixed measurement setup. A passive basis change relabels the same state. The matrices can look identical while the interpretation differs. Stating which is being done prevents claims that a mere notation change altered a measured outcome.

## Time evolution and the Hamiltonian

For a closed system, quantum dynamics is governed by

$$i\hbar\frac{d}{dt}|\psi(t)\rangle=H|\psi(t)\rangle,$$

the Schrödinger equation. Here $H$ is the Hermitian Hamiltonian, an energy operator, and $\hbar=h/(2\pi)$ sets the conversion between energy and angular frequency. This dynamical law is a postulate. The energy spectrum and couplings depend on the physical system.

In an energy eigenstate with eigenvalue $E$, the equation reduces to $i\hbar\,dc/dt=Ec$, giving $c(t)=c(0)e^{-iEt/\hbar}$. The probability distribution for a time-independent observable in that stationary eigenstate remains unchanged by this global phase. A superposition of different energies acquires relative phases and can show time-dependent interference.

For a time-independent Hamiltonian with eigenstates $|E_j\rangle$, expand the initial state and evolve each coefficient:

$$|\psi(t)\rangle=\sum_j c_j(0)e^{-iE_jt/\hbar}|E_j\rangle.$$

Equivalently $U(t)=e^{-iHt/\hbar}$, where a matrix exponential is defined by the convergent power series $I+A+A^2/2!+\cdots$. For Hermitian $H$, conjugating reverses the exponential's sign, and $U^\dagger U=I$. Thus the postulated equation preserves normalization. If $H$ depends on time and does not commute with itself at different times, one cannot casually replace the evolution by an ordinary exponential of its time integral.

## A fully solved two-state oscillation

Take $H=(\hbar\Omega/2)X$ with $\Omega>0$ in inverse seconds. Since $X^2=I$, even powers in the exponential sum to cosine and odd powers to sine:

$$U(t)=I\cos(\Omega t/2)-iX\sin(\Omega t/2).$$

Starting from $|0\rangle$ gives

$$|\psi(t)\rangle=\cos(\Omega t/2)|0\rangle-i\sin(\Omega t/2)|1\rangle.$$

Consequently $P(1,t)=\sin^2(\Omega t/2)$ and $P(0,t)=\cos^2(\Omega t/2)$. Their sum is 1 for every time. At $t=\pi/\Omega$, the system is certainly in state 1 up to a global phase. At $t=2\pi/\Omega$ it is $-|0\rangle$, physically equivalent to the initial pure state for measurements on this system. A global phase of−1 is not a different 0/1 probability distribution.

For $\Omega=1000\,\mathrm{s^{-1}}$, the first complete transfer occurs at approximately $3.14\,\mathrm{ms}$. At half that time, both outcomes have probability 1/2, yet the state remains a coherent pure superposition. A 50–50 classical mixture of 0 and 1 gives the same probabilities for this one measurement but different responses to suitable later coherent operations.

With detuning, use $H=(\hbar/2)(\Omega X+\delta Z)$. Because $(\Omega X+\delta Z)^2=(\Omega^2+\delta^2)I$, the same power-series method gives transition probability

$$P(1,t)=\frac{\Omega^2}{\Omega^2+\delta^2}\sin^2\left(\frac{\sqrt{\Omega^2+\delta^2}\,t}{2}\right).$$

Detuning increases the oscillation frequency while reducing maximum transfer. If $\delta=\Omega$, maximum probability is 1/2 rather than 1. This compact model underlies many resonance experiments, but connecting a real driven atom to this effective time-independent Hamiltonian can require a rotating-frame approximation with explicitly limited validity.

## From finite lists to wavefunctions

Position is not restricted to two outcomes. A state in position representation becomes a function $\psi(x)$, with probability in a small interval approximately $|\psi(x)|^2dx$. Normalization becomes $\int|\psi(x)|^2dx=1$, and inner product becomes $\int u^*(x)v(x)dx$. These are continuous versions of the finite sums already used.

The wavefunction has units of inverse square root of length in one dimension. It is not an ordinary probability density until its squared modulus is taken. Position and momentum will be represented by operators acting on functions, and boundary conditions will select allowed energy states. The continuous setting adds domain and normalizability questions, so not every finite-dimensional manipulation can be transplanted without checking its hypotheses.

The companion's two-state experiment can vary coupling, detuning, time, or relative phase and compute actual Born probabilities. Such a simulation illustrates the model's mathematical consequences; it does not replace the empirical evidence that motivates quantum postulates or establish a particular interpretation of measurement.

### Optional practice

1. Normalize the vector $(1,i\sqrt3)^T$ and find 0/1 measurement probabilities.
2. For $|\psi\rangle=(|0\rangle+e^{i\phi}|1\rangle)/\sqrt2$, derive $P(+)$. Evaluate at $\phi=0,\pi/2,\pi$.
3. Multiply $X$ and $Z$ in both orders and find their commutator. Use the matrices defined in the chapter.
4. Find eigenvalues and normalized eigenvectors of $H=\begin{pmatrix}E_0&g\\g&E_0\end{pmatrix}$ for real nonzero $g$. What changes if $g=0$?
5. For state 0, calculate expectations and standard deviations of $X$ and $Z$. Distinguish expectation from an individual result.
6. Prove directly that $U=I\cos\theta-iX\sin\theta$ is unitary for real $\theta$.
7. Under $H=(\hbar\Omega/2)X$, find first transfer time and $P(1)$ at $t=\pi/(2\Omega)$. Explain why a global phase after a full probability cycle is unobservable for the isolated state.
8. For detuning $\delta=\sqrt3\Omega$, find maximum transition probability and effective oscillation angular frequency. Check the zero-detuning limit of the general formula.

Hints and solutions are in `../solutions/19-hints.md` and `../solutions/19-solutions.md`.

### Source connections

Feynman Volume III Chapters 1–3 and 5–11 connect quantum alternatives, amplitude algebra, spin systems, Hamiltonian matrices, and two-state dynamics. This course introduces the finite-dimensional linear algebra before its first required calculation. The next chapter applies the same principles to spatial wavefunctions, bound states, and tunneling.
