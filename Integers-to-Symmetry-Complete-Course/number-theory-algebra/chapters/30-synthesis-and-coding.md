# Chapter 30 — Synthesis: finite-field coding and mathematical investigations

A message is transmitted as five symbols, but one symbol changes in transit. Can the receiver recover the original message with certainty? Repetition is one answer: send the same information many times and take a majority. Algebra offers a more systematic answer. Encode a message as a low-degree polynomial over a finite field, then send its values at several points.

The reason this works is a theorem already proved in the course: a nonzero polynomial of degree $d$ over a field has at most $d$ roots. Two different low-degree messages cannot agree at too many evaluation points. Extra values therefore create a controlled gap between valid transmissions, making some errors detectable and correctable.

This chapter develops that idea completely for small Reed–Solomon codes. It then offers guided mathematical investigations that bring together the course's number theory, group theory, rings, fields and analysis. These projects are optional directions with worked starting examples and clear proof goals. They are not claims that every suggested investigation is implemented in the companion.

You need finite fields, vector spaces, polynomial arithmetic and the habit of checking hypotheses. We rebuild the coding vocabulary before using it. The [coding companion lab](../companion/index.html) performs finite-field experiments on small inputs; consult its included instructions for the implemented controls. The proofs explain why the finite calculations generalize beyond the displayed examples.

## 30.1 Symbols, words and errors

Fix a finite field $\mathbb F_q$, where $q$ is a prime power. A symbol is an element of that field. A word of length $n$ is an ordered tuple $(c_1,\ldots,c_n)\in\mathbb F_q^n$. Its positions are distinct even when two symbols have equal values.

A code is a specified subset $C\subseteq\mathbb F_q^n$ of valid words. Encoding chooses one valid word for each possible message. A received word may lie outside the code because errors changed some symbols. Decoding attempts to infer which valid word was originally sent.

An error is a changed symbol at an unknown location. An erasure is a symbol whose location is known to be unavailable. These are different problems. If the receiver knows exactly which positions are missing, the remaining trusted values can be used directly. If a position contains an incorrect but apparently valid symbol, the receiver must also discover where the error occurred.

For example, over $\mathbb F_5$, the word $(2,1,2,0,0)$ might be received as $(2,1,4,0,0)$. There is one error, at the third position. If that position were marked as unknown instead, it would be one erasure. The mathematical encoding can be the same while the decoding guarantee changes.

The Hamming distance between two words is the number of positions in which they differ. For the displayed pair the distance is one. This is a metric: it is nonnegative, symmetric, and zero only for equal words. The triangle inequality follows position by position, because if $u_i\ne w_i$, then at least one of $u_i\ne v_i$ or $v_i\ne w_i$ holds.

The minimum distance $d$ of a code with at least two words is the smallest distance between distinct valid words. It measures how separated legal transmissions are. It is not the distance of a received word from the nearest codeword, which depends on a particular transmission.

## 30.2 Why distance gives a correction guarantee

A code of minimum distance $d$ can detect every pattern of at most $d-1$ changed symbols: such a pattern cannot turn one codeword into a different codeword, because that would produce two codewords at distance below $d$. Detection means recognizing that the received word is invalid; it does not identify the original message.

For correction, suppose at most $t$ errors occur and $2t<d$. If two different codewords were both within distance $t$ of the received word, the triangle inequality would put them within distance $2t<d$ of each other. That contradicts the minimum-distance definition. Thus there is at most one codeword compatible with the error bound.

The largest guaranteed correction radius is therefore

$$
t=\left\lfloor\frac{d-1}{2}\right\rfloor.
$$

The guarantee assumes the actual number of errors stays within that radius. A decoder can fail or choose an incorrect codeword when more errors occur; minimum distance alone does not promise behavior outside the hypothesis.

Erasures are cheaper. If at most $d-1$ positions are erased, two codewords agreeing on all unerased positions would differ in fewer than $d$ places, impossible. More generally, $e$ errors and $s$ erasures are uniquely correctable whenever $2e+s<d$. After deleting erased positions, distinct codewords still differ in at least $d-s$ positions, and the earlier argument applies with $2e<d-s$.

This proof derives the factor of two rather than presenting it as a rule to memorize. An unknown error can place the received word between two candidates, so both candidates' error budgets count. An erasure merely removes one constraint. The difference is informational, not a peculiarity of a chosen algorithm.

## 30.3 Messages as polynomial coefficients

Choose distinct evaluation points $a_1,\ldots,a_n\in\mathbb F_q$ and an integer $k$ with $1\le k\le n\le q$. A message is a tuple of $k$ field elements $(m_0,\ldots,m_{k-1})$. Interpret it as the polynomial

$$
f(X)=m_0+m_1X+\cdots+m_{k-1}X^{k-1}.
$$

Encode it as

$$
\operatorname{ev}(f)=(f(a_1),\ldots,f(a_n)).
$$

The set of all these words is a Reed–Solomon evaluation code. We use the unextended version, so the distinct evaluation points lie in the field itself and $n\le q$. Other conventions and extended versions exist, but their additional points are not part of this definition.

The degree restriction is strictly less than $k$. A coefficient vector with last coefficient zero is still a valid message, even if its polynomial degree is smaller. The zero polynomial is included. It has no ordinary finite degree, so proofs involving degrees should treat it separately rather than assigning it a misleading degree zero.

The evaluation map is linear over $\mathbb F_q$, because evaluation respects addition and scalar multiplication. It is injective: if two degree-less-than-$k$ polynomials have identical evaluations at all $n\ge k$ points, their difference has at least $k$ roots but degree at most $k-1$. The root bound forces that difference to be zero.

Thus there are exactly $q^k$ codewords, one for each message, and the code is a $k$-dimensional vector subspace of $\mathbb F_q^n$. No information is lost during encoding. The extra $n-k$ symbols provide redundancy rather than extra independent message data.

The word “linear” describes how messages combine, not a restriction to degree-one message polynomials. A code built from quadratic message polynomials is still a linear code because adding two such polynomials preserves the degree bound and corresponds to adding their codewords coordinatewise.

## 30.4 Minimum distance from the root bound

Take two different message polynomials $f$ and $g$, each of degree less than $k$. Their difference $h=f-g$ is nonzero and has degree at most $k-1$. It can vanish at at most $k-1$ evaluation points. Therefore their codewords differ at at least $n-k+1$ positions:

$$
d\ge n-k+1.
$$

To see equality, choose $k-1$ of the evaluation points and form

$$
h(X)=\prod_{j=1}^{k-1}(X-a_j).
$$

For $k=1$, interpret this empty product as the constant polynomial one. The polynomial has degree $k-1$ and vanishes at exactly those selected evaluation points, because all points are distinct and a field has no zero divisors. Its codeword therefore differs from the zero word in exactly $n-k+1$ positions. Hence

$$
d=n-k+1.
$$

The parameters are written $[n,k,n-k+1]_q$. The symbols give length, dimension, minimum distance and field size. They are a compact summary of the proved properties, not a definition that automatically certifies an arbitrary encoding scheme.

Why insist on a field? Over a ring with zero divisors, a nonzero polynomial can have more roots than its degree. Over $\mathbb Z/8\mathbb Z$, the polynomial $X^2-1$ has four roots. The entire distance proof could fail if one replaced the finite field with a convenient composite-modulus ring without checking new hypotheses.

Why insist on distinct evaluation points? Repeating a point gives a repeated constraint, not a new independent one. Two different polynomials could then agree in many repeated positions for the same single-root reason. The proof counts distinct roots, so distinctness is a structural requirement rather than a formatting choice.

## 30.5 A complete five-symbol example

Work in $\mathbb F_5$, using the evaluation points $0,1,2,3,4$ and $k=3$. Our message is $(2,3,1)$, so

$$
f(X)=2+3X+X^2.
$$

Evaluate one position at a time. At zero, the value is two. At one, it is $2+3+1=6\equiv1$. At two, it is $2+6+4=12\equiv2$. At three, it is $2+9+9=20\equiv0$. At four, it is $2+12+16=30\equiv0$. The transmitted word is

$$
c=(2,1,2,0,0).
$$

The code parameters are $[5,3,3]_5$. Its minimum distance is three, so it detects up to two errors and corrects one error. It can correct two erasures. It does not guarantee correction of two unknown errors, because $2\cdot2$ is not less than three.

Suppose the received word is $r=(2,1,4,0,0)$. If we already knew that the third symbol was wrong, three trusted values would determine the quadratic. But discovering that location is part of the decoding problem. We will first explain interpolation for known trusted values, then incorporate an unknown error location algebraically.

The two zero positions are not erased positions. They are transmitted field symbols carrying real information. In fact they say that three and four are roots of the message polynomial. Here $f=(X-3)(X-4)$ modulo five, which expands to $X^2+3X+2$. Confusing a zero symbol with missing information would throw away valid constraints.

## 30.6 Interpolation is the inverse of trusted evaluation

Given $k$ distinct points $b_1,\ldots,b_k$ and values $y_1,\ldots,y_k$ in a field, there is a unique polynomial of degree less than $k$ taking those values. Define

$$
L_j(X)=\prod_{\ell\ne j}\frac{X-b_\ell}{b_j-b_\ell}.
$$

The denominators are nonzero because the points are distinct, so they are invertible in the field. The polynomial $L_j$ equals one at $b_j$ and zero at every other listed point. Consequently

$$
f(X)=\sum_{j=1}^k y_jL_j(X)
$$

has the desired values. Uniqueness follows from the root bound applied to the difference of two candidates.

For the five-symbol example, suppose positions $0,1,3$ are trusted, with values $2,1,0$. The basis term for zero is

$$
L_0(X)=\frac{(X-1)(X-3)}{(0-1)(0-3)}
=2(X-1)(X-3)
$$

in $\mathbb F_5$, because the denominator is three and its inverse is two. The basis term for one is

$$
L_1(X)=\frac{X(X-3)}{(1-0)(1-3)}
=2X(X-3),
$$

since the denominator is minus two, again three modulo five. The third value is zero and contributes no term. Thus

$$
f(X)=4(X-1)(X-3)+2X(X-3)=X^2+3X+2.
$$

Every step takes place modulo five. A real-number interpolation formula with ordinary fractions would describe a different polynomial unless the fractions are explicitly interpreted as finite-field inverses.

This solves erasures: if at least $k$ trustworthy positions remain, interpolate from any $k$ of them and check the rest. For unknown errors, blindly choosing the first $k$ positions can include corrupted data. Interpolation alone does not identify which positions to trust.

## 30.7 An error-locator polynomial converts errors into equations

Suppose at most $t$ positions are wrong. Let $E(X)$ vanish at the erroneous evaluation points, and define $Q(X)=E(X)f(X)$. At a correct position, $Q(a_i)=E(a_i)r_i$ because $r_i=f(a_i)$. At an erroneous position, both sides are zero because $E(a_i)=0$. Hence every position satisfies

$$
Q(a_i)=E(a_i)r_i.
$$

If $E$ has degree $t$, then $Q$ has degree less than $k+t$. Choose $E$ monic to remove an irrelevant nonzero scalar factor. Its remaining coefficients and the coefficients of $Q$ become unknowns in a linear system. This is the central idea of Berlekamp–Welch decoding.

For the received word $(2,1,4,0,0)$, take $t=1$. Write $E(X)=X+e$ and $Q(X)=q_0+q_1X+q_2X^2+q_3X^3$. There are five unknown coefficients. The five evaluation positions give five linear equations over $\mathbb F_5$.

A solution is $e=3$ and $q_0=q_1=q_2=q_3=1$. Thus

$$
E=X+3=X-2,\qquad Q=X^3+X^2+X+1.
$$

Verify the equations directly. At zero, $Q=1$ and $Er=3\cdot2=1$. At one, both sides are four. At two, $E=0$ and $Q=0$, so the incorrect received value four is neutralized. At three and four, the received symbols and $Q$ are both zero.

Divide $Q$ by $E$. Exact division gives $f=X^2+3X+2$, recovering the message. The root of $E$ identifies the erroneous point two, and the recovered polynomial gives the corrected value $f(2)=2$.

A complete decoder must check that the proposed division has zero remainder, that the recovered degree is less than $k$, and that its codeword differs from the received word in at most the allowed number of positions. Solving an arbitrary linear system is not by itself a certificate of correct decoding outside the guaranteed radius.

## 30.8 Why the decoder is unique in its guaranteed range

Suppose $(E_1,Q_1)$ and $(E_2,Q_2)$ both satisfy the evaluation equations, with $\deg E_j\le t$ and $\deg Q_j<k+t$. The polynomial

$$
Q_1E_2-Q_2E_1
$$

vanishes at every evaluation point, because there $Q_j=E_jr$. Its degree is at most $k+2t-1$. If $n\ge k+2t$, the root bound forces it to be zero.

When a true message with at most $t$ errors exists, choose an error-locator polynomial vanishing at its error positions, multiplying by extra factors if necessary to reach degree $t$. Its product with the message gives one valid pair. The identity above then forces every other pair to have the same rational quotient $Q/E=f$, whenever $E\ne0$.

This proves the algebraic uniqueness behind the algorithm. It agrees with the distance guarantee because $d=n-k+1$, so $2t<d$ is equivalent to $n\ge k+2t$. The coding metric and polynomial-degree arguments are two views of the same amount of redundancy.

For the small example, $n=5$, $k=3$ and $t=1$ meet equality. There are just enough equations to determine the needed ratio. If two errors occurred, the prescribed degree bounds would no longer guarantee recovery. A program should report the limitation rather than inventing certainty from a candidate output.

The proof also indicates why large practical codes use finite fields with many elements. More distinct evaluation points allow a longer word and more redundancy while retaining a useful number of message symbols. Binary extension fields let symbols be represented by fixed-size bit blocks, using the polynomial arithmetic of Chapter 24. Field size, word length and symbol width are linked design choices.

## 30.9 Linear algebra explains the encoding matrix

The evaluation map can be written with a matrix whose $i$th row is

$$
(1,a_i,a_i^2,\ldots,a_i^{k-1}).
$$

Multiplying this $n$-by-$k$ matrix by the message coefficient column gives the codeword column. This is a Vandermonde-type matrix. Any $k$ rows give an invertible square matrix because a polynomial of degree less than $k$ vanishing at those $k$ distinct points must be zero.

This is a proof of invertibility without expanding a determinant. The kernel is trivial, and a linear map between vector spaces of the same finite dimension is invertible. If desired, the determinant formula $\prod_{i<j}(a_j-a_i)$ gives the same conclusion, since every difference is nonzero in a field.

A parity-check matrix gives another description of a linear code: it is a matrix $H$ for which $C=\{c:Hc=0\}$. One can obtain such a matrix by row reduction, finding linear constraints on the column space of the encoding matrix. The vector $Hr$ is called the syndrome of a received word.

If $r=c+e$ with $c$ valid, then $Hr=He$. The syndrome depends only on the error pattern, not the message. That observation underlies many decoding algorithms. It does not immediately reveal a unique error unless the permitted error patterns produce distinguishable syndromes. Minimum distance supplies the corresponding uniqueness condition.

Thus the course's vector-space concepts have a concrete purpose. Bases parameterize messages, injectivity prevents collisions, kernels express validity constraints, and quotient information separates error behavior from message behavior. These are the same structural ideas encountered in group and ring homomorphisms, now applied to transmitted data.

## 30.10 Optimal distance and the Singleton bound

No code with $q^k$ words of length $n$ and minimum distance $d$ can beat

$$
d\le n-k+1.
$$

To prove this, delete any $d-1$ coordinates from every codeword. The shortened words must remain distinct. If two became equal, the original two words would differ only in the deleted positions, giving distance at most $d-1$, a contradiction.

There are at most $q^{n-d+1}$ possible shortened words, so $q^k\le q^{n-d+1}$. Since $q>1$, comparison of exponents gives $k\le n-d+1$, equivalent to the bound. The proof applies to nonlinear codes too when $k$ is interpreted through a code size $q^k$.

Reed–Solomon codes attain equality. Such codes are called maximum distance separable, abbreviated MDS. This means they use their redundancy optimally for the particular length, alphabet size and code size in the Singleton comparison. It does not mean they are optimal under every engineering criterion.

The tradeoff is explicit. With $n$ fixed, increasing $k$ sends more independent message symbols but reduces minimum distance. Decreasing $k$ adds redundancy and improves correction capability. A code cannot simultaneously keep all message information, add no extra symbols and correct arbitrary changes. The counting argument explains why.

The bound is also an instance of a familiar proof strategy: construct an injective map into a simpler finite set, then compare sizes. We used the same kind of reasoning in Lagrange-style counting and finite-field cardinality arguments. Abstract algebra repeatedly converts structural preservation into a counting inequality.

## 30.11 A guided number-theory investigation

Return to the equation $x^2+y^2=p$ for a prime $p$. The arithmetic criterion and the Gaussian integer factorization offer two perspectives on one problem. Begin with $p=13$: $13=3^2+2^2=(3+2i)(3-2i)$. Modulo thirteen, the quotient $3\cdot2^{-1}$ is a square root of minus one because $3^2+2^2\equiv0$.

To check the quotient explicitly, $2^{-1}\equiv7\pmod{13}$, so $3\cdot7\equiv8$. Then $8^2=64\equiv-1$. Conversely, if a square root of minus one is found modulo $p$, computing a Gaussian gcd of $p$ and $a+i$ can expose a factor of norm $p$. The Euclidean algorithm in $\mathbb Z[i]$ is doing constructive work behind the representation theorem.

A useful investigation is to choose several primes, compute the Legendre symbol $(-1/p)$, find a root when it exists, and use Gaussian division to recover a sum of squares. Explain every quotient choice and check norms. The final report should distinguish the general theorem from the computed examples: examples validate the procedure for those inputs, while the norm and gcd proof explain why the method works.

This project joins quadratic residues, Euclidean domains, units, norms and prime factorization. It also trains translation between languages. A congruence root is not itself a sum of squares, but a Gaussian gcd converts that root into a factor, and its norm converts the factor into the desired integer equation.

## 30.12 A guided field-theory investigation

Choose a small cyclotomic field, such as $\mathbb Q(\zeta_8)$. Begin by recovering $i$ and $\sqrt2$ from $\zeta_8$, then list its four automorphisms. Compute the fixed fields by applying each automorphism to a general element of the basis $1,\sqrt2,i,i\sqrt2$.

The concrete outcome is a complete subgroup–field correspondence. The three quadratic fields are $\mathbb Q(i)$, $\mathbb Q(\sqrt2)$ and $\mathbb Q(\sqrt{-2})$. A good proof checks both inclusions for each fixed field, rather than merely noticing that a displayed generator is fixed. The degree count then verifies completeness.

As an extension, compare with $\mathbb Q(\zeta_5)$, whose Galois group is cyclic of order four. It has only one subgroup of order two, so only one quadratic intermediate field, namely $\mathbb Q(\sqrt5)$. Both total fields have degree four, but their intermediate structures differ.

The investigation should finish with a geometric conclusion. The regular octagon and pentagon are constructible because the relevant real fields arise from square roots. Explain why a similar argument fails for the regular heptagon, whose real coordinate has degree three. This turns a group comparison into a statement about permitted geometric operations.

A further local comparison can ask where the equation $X^2+1=0$ has roots modulo a prime and then in $\mathbb Z_p$. For odd primes, quadratic residues decide the initial question and Hensel lifts simple roots. This does not identify a cyclotomic number field with a p-adic field; it compares the solvability of the same polynomial in different ambient arithmetic systems.

## 30.13 A guided analysis investigation

Use exact finite computations to compare three quantities: the number of primes up to $N$, the sum of their reciprocals, and the partial Euler product for $s=2$. The point is not to claim a new proof from a graph. It is to practice matching a numerical experiment with the theorem and error estimate that justify its interpretation.

For the Euler product, compute the product over primes at most $N$. Explain why it omits only terms indexed by integers larger than $N$, and give a tail bound using the dyadic estimate or the optional integral bound from Chapter 28. A decimal without a truncation estimate is an approximation, not a certified interval.

For the prime-count comparison, display $\pi(N)$ and $N/\log N$ and identify the prime number theorem as the external theorem describing their ratio. Finite data do not prove the limiting ratio. For prime reciprocals, explain why slow growth does not establish convergence, referring to the finite-product contradiction proof.

As an optional synthesis, estimate the fraction of coprime ordered pairs in a growing square and compare it with $1/\zeta(2)$. Derive the exact finite count using $\mu$ and show how a uniform tail bound permits the limit. This combines inclusion-exclusion, divisor sums, convergence and a precise probability model.

A strong written report separates exact counts, proved inequalities, asymptotic theorems and informal heuristics. That classification is a mathematical skill. It lets the reader see which conclusions follow from the computation itself and which require additional theory.

## 30.14 The same construction over a field with four elements

A finite field need not have prime order. To see the coding argument beyond modular integers, construct $\mathbb F_4=\mathbb F_2[\theta]$ with relation $\theta^2+\theta+1=0$. The polynomial $X^2+X+1$ has no root in $\mathbb F_2$, so it is irreducible and the quotient is a field. Its elements are $0,1,\theta,\theta+1$.

Addition occurs coefficientwise modulo two. In particular $1+1=0$ and $\theta+\theta=0$. Multiplication uses $\theta^2=\theta+1$. For example, $\theta(\theta+1)=\theta^2+\theta=1$, so $\theta$ and $\theta+1$ are inverses. Also $(\theta+1)^2=\theta^2+1=\theta$, because the middle term has coefficient two and vanishes.

Choose all four field elements as evaluation points and use degree-less-than-two messages. Let

$$
f(X)=\theta+(\theta+1)X.
$$

At zero, the value is $\theta$. At one, it is $\theta+\theta+1=1$. At $\theta$, it is $\theta+(\theta+1)\theta=\theta+1$. At $\theta+1$, it is $\theta+(\theta+1)^2=0$. Thus the codeword is $(\theta,1,\theta+1,0)$.

The code has parameters $[4,2,3]_4$, so one symbol error is correctable. Each symbol can be stored as two bits by choosing the basis $1,\theta$: the symbols $0,1,\theta,\theta+1$ correspond to $00,01,10,11$ in that convention. A symbol error may change one or both bits. The guarantee counts changed symbols, not changed individual bits. This distinction matters when translating a field-code theorem into a bit-level claim.

It would be incorrect to implement these four symbols as the integers modulo four. The quotient $\mathbb Z/4\mathbb Z$ has a zero divisor, namely two, and characteristic four. The field $\mathbb F_4$ has characteristic two and no nonzero zero divisors. They have the same number of elements but different arithmetic. The polynomial representation is what supplies the needed field structure.

This small example integrates several previous chapters at once: irreducibility constructs the field, a basis represents its elements, polynomial reduction implements multiplication, and the root theorem proves the code distance. None of the essential mathematics depends on choosing a prime field. The general finite-field theory is doing real work rather than merely adding notation.

## 30.15 A finite exhaustive decoder as a reference method

For a small code, one can decode by enumerating every message. This is computationally expensive but conceptually transparent. For each coefficient tuple, evaluate its polynomial at the prescribed points, count disagreements with the received word, and retain candidates within the guaranteed radius. The distance theorem proves that there is at most one such candidate.

For the five-symbol example, there are $5^3=125$ possible messages. Evaluating each at five points is feasible as a reference calculation. The candidate $(2,3,1)$ has codeword $(2,1,2,0,0)$ and differs from the received word in one position. No other candidate can have distance at most one, because that would put two codewords within distance two of each other, contradicting distance three.

This reference algorithm is useful for testing a more efficient decoder on small inputs. If two implementations disagree, compare their candidate sets and exact field arithmetic. Likely errors include using ordinary division instead of modular inverses, evaluating powers without reduction, confusing position indices with evaluation points, or checking distance against the message rather than against the full codeword.

Enumeration is not a practical large-code algorithm. Its search space is $q^k$, which grows exponentially with the message dimension. The Berlekamp–Welch formulation replaces that search with linear equations involving polynomial coefficients. The two procedures solve the same mathematical problem but have very different computational costs.

A good correctness test should include every one-symbol error for every message in a tiny code, plus a selection of words outside the guaranteed radius. For the latter cases, the right requirement is honest failure or clearly qualified output; no theorem says the original word can always be recovered. Tests should also include zero messages, constant messages, the maximum allowed degree, and symbol values represented by the field's full range.

This testing plan is an optional computational investigation, not a claim that all those exhaustive cases were executed for the delivered browser interface. Its purpose is to connect a formal proof with a concrete way to diagnose an implementation. A proof certifies the specified algorithm under its assumptions; a test checks that a particular program follows that specification on the cases actually exercised.

## 30.16 An optional bridge through formal generating functions

Arithmetic can also be encoded into coefficients rather than evaluation values. A partition of a positive integer $n$ is an unordered expression of $n$ as a sum of positive integers, with repetition allowed. For example, the partitions of five are $5$, $4+1$, $3+2$, $3+1+1$, $2+2+1$, $2+1+1+1$, and five ones. There are seven.

Introduce a formal variable $T$. The series $1+T^j+T^{2j}+\cdots$ records choosing zero, one, two or more parts equal to $j$. Multiplying these series for all positive $j$ gives

$$
\prod_{j\ge1}(1-T^j)^{-1}=\sum_{n\ge0}p(n)T^n,
$$

where $p(n)$ counts partitions and $p(0)=1$ records the empty partition. An exponent choice at factor $j$ specifies how many parts of size $j$ are used. The total exponent is the sum of their sizes, so the coefficient of $T^n$ counts exactly the partitions of $n$.

This is a formal power-series identity. It does not initially assign a real value to $T$, so no analytic convergence claim is being made. To determine the coefficient of $T^n$, only factors with $j\le n$ matter, and each contributes only finitely many relevant powers. Every coefficient is defined by a finite calculation. That coefficientwise finiteness is the precise justification for the infinite-looking product.

Compare with the Euler product for $\zeta(s)$. There, unique factorization records multiplicative decompositions of integers into prime powers. Here, choosing parts records additive decompositions of an exponent. Both products package independent choices, but the objects being counted and the justification for infinite operations differ. Formal coefficientwise algebra is not the same as a convergent numerical series.

A formal series can be viewed through compatible truncations modulo $T^k$, resembling the compatible residues modulo $p^k$ used for p-adic integers. The resemblance is useful, but the rings are not identical. In $\mathbb F_p[[T]]$, the integer $p$ equals zero because the coefficient field has characteristic $p$. In $\mathbb Z_p$, the integer $p$ is nonzero and has positive valuation. Similar limiting constructions can preserve different algebraic characteristics.

An optional project is to compute partition coefficients up to a chosen bound using finite polynomial multiplication, explain why higher factors cannot affect them, and compare this with a numerical Euler-product approximation that needs an analytic tail bound. The project reinforces the course's recurring discipline: identify the ambient structure before deciding which manipulations are valid.

## 30.17 What error correction does and does not promise

The distance guarantee is deterministic. It does not assume errors are random or independent; even an adversary choosing their locations and replacement symbols cannot defeat unique decoding while staying within the allowed number of changed positions. Random-noise models become relevant when estimating how likely the channel is to exceed that bound, but the algebraic uniqueness proof itself needs no probability distribution.

Error correction is also different from encryption. A Reed–Solomon word contains enough information for anyone knowing the evaluation scheme to recover its message. The redundant symbols improve reliability, not secrecy. Likewise a valid codeword does not prove who sent it. An adversary could replace an entire transmission by another valid codeword, and a validity check would accept it because it satisfies the code's algebraic constraints.

Authenticating the source requires a separate mechanism, such as a suitable cryptographic authentication scheme. That is a different mathematical task from detecting a limited number of accidental changes. Chapter 9's RSA example concerned modular exponentiation and cryptographic structure; the present code concerns polynomial separation in Hamming distance. Both use finite arithmetic, but sharing mathematical ingredients does not make their security or reliability claims interchangeable.

There is an equally important distinction between a theorem about symbol errors and a physical channel model. A burst of corrupted bits may damage several symbols depending on how bits are grouped and interleaved. The finite-field theorem counts the resulting symbol disagreements. Translating physical noise into that count is an engineering model that must be stated, rather than assumed by the algebra.

These boundaries make the construction more useful, not less. A precise guarantee tells you how to combine tools: a code can handle bounded corruption, an authentication mechanism can check origin and integrity under its own assumptions, and an encryption scheme can protect confidentiality. The course's structural reasoning helps identify which problem each mathematical object actually solves.

A final decoding check should return the recovered coefficient tuple as well as the corrected word. Those outputs certify different layers of the process: evaluating the coefficients must reproduce the corrected word, and comparing the corrected word with the received word must satisfy the declared error budget. If either comparison fails, a displayed polynomial alone is insufficient evidence of a successful decode. This mirrors the course's earlier insistence on checking both a map and its preserved relations. Encoding, interpolation, error-location equations and distance are connected by proved statements; validating those connections in a concrete computation is more informative than trusting a plausible message.

## 30.18 Optional practice

1. Encode the message $(1,2,3)$ in the $[5,3,3]_5$ evaluation code at points $0,1,2,3,4$.
2. Prove the Hamming triangle inequality by considering each coordinate.
3. Recover $f=X^2+3X+2$ from its trusted values at $0,1,3$ using Lagrange interpolation, including the modular inverses.
4. Verify the error-locator pair $E=X-2$ and $Q=X^3+X^2+X+1$ for the received word $(2,1,4,0,0)$.
5. Determine the minimum distance and guaranteed error and erasure capabilities of an evaluation code with $n=7$, $k=3$ over $\mathbb F_7$.
6. Prove the Singleton bound by deleting coordinates, and explain why it does not imply the existence of an MDS code for every possible parameter choice.
7. For $p=13$, verify that eight is a square root of minus one and connect it to $13=3^2+2^2$.
8. Explain why equal extension degrees do not force equal Galois groups, comparing the fifth and eighth cyclotomic fields.

[Separate hints and full solutions](../solutions/30-solutions.md) complete these applications. The course's recurring method is now available in several languages: identify the structure, state the map, inspect its kernel or preserved relations, and use the resulting constraints to prove what can and cannot happen.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](29-hensel-and-p-adic.md) · [Hints and solutions](../solutions/30-solutions.md)
