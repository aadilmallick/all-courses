# Chapter 09 — Units, orders, Fermat, Euler and RSA

Modular addition always allows subtraction, but modular multiplication does not always allow division. Modulo $12$, the equation $5x\equiv1$ has solution $x\equiv5$, while $6x\equiv1$ has none. The invertible classes form a group, and that group explains several central theorems of elementary number theory. It also provides a precise setting for understanding a small public-key encryption example.

This chapter intertwines arithmetic and algebra deliberately. Bezout's identity identifies the group elements; Lagrange constrains their orders; polynomial roots show that the multiplicative group modulo a prime is cyclic; and the Chinese remainder theorem assembles groups for composite moduli. We will prove Fermat's theorem, Euler's theorem, Wilson's theorem, and the existence of primitive roots modulo primes. A labeled extension develops the prime-power unit groups.

The prerequisites are Chapters 2–8. A short polynomial prerequisite will be introduced exactly where it is needed, before the later systematic polynomial chapters. All computations use positive moduli at least two, and multiplication of residue classes is always performed modulo the stated modulus.

## 1. Which classes can be divided by?

A class $[a]\in\mathbb Z/n\mathbb Z$ is a **unit** if some class $[b]$ satisfies $[a][b]=[1]$. Integer multiplication commutes, so this is automatically a two-sided inverse. The class is a unit precisely when $\gcd(a,n)=1$.

For necessity, if $ab\equiv1\pmod n$, then $ab-nt=1$ for an integer $t$. Every common divisor of $a$ and $n$ divides the left side and hence divides $1$, so the gcd is one. For sufficiency, Bezout gives integers $u,v$ with $ua+vn=1$. Reducing modulo $n$ yields $[u][a]=[1]$, so $[u]$ is the inverse.

This criterion is independent of the representative, because $\gcd(a+kn,n)=\gcd(a,n)$. The set of all units is written $U(n)$ or $(\mathbb Z/n\mathbb Z)^\times$. It forms an abelian group under multiplication. Products remain units because the inverse of $ab$ is the product of the inverses. The identity is $[1]$, associativity is inherited, and the inverse of a unit is again a unit.

For $n=12$, the unit classes are $[1],[5],[7],[11]$. Each nonidentity element squares to $[1]$. Hence $U(12)$ is not cyclic: a cyclic group of size four would have an element of order four. The additive group of classes modulo $12$ is cyclic of size twelve, so keeping the operation explicit matters greatly.

If $p$ is prime, every nonzero class modulo $p$ is a unit. In later ring terminology, $\mathbb Z/p\mathbb Z$ is a field, denoted $\mathbb F_p$. For our present purposes, the crucial fact is that nonzero classes can be canceled and divided by. If $n$ is composite, some nonzero class fails to have an inverse, so that cancellation property is unavailable for arbitrary nonzero classes.

## 2. Counting units: Euler's totient

Euler's totient $\varphi(n)$ counts integers $1\le a\le n$ coprime to $n$, equivalently the number of elements in $U(n)$. For a prime $p$, we have $\varphi(p)=p-1$. For a prime power $p^k$, the only excluded integers are the multiples of $p$, of which there are $p^{k-1}$ in the interval. Thus

$$
\varphi(p^k)=p^k-p^{k-1}=p^{k-1}(p-1).
$$

If $m,n$ are coprime, the Chinese remainder map sends a class modulo $mn$ to its pair of classes modulo $m$ and modulo $n$. A class is a unit modulo $mn$ exactly when both coordinates are units: being coprime to $mn$ is equivalent to being coprime to each factor. The map therefore restricts to an isomorphism

$$
U(mn)\cong U(m)\times U(n).
$$

It preserves multiplication, and the usual CRT gives a bijection. Counting yields $\varphi(mn)=\varphi(m)\varphi(n)$ for coprime $m,n$. A function with this coprime-product property is called multiplicative; it need not preserve products when the factors share primes.

If $n=\prod_i p_i^{k_i}$ is the prime factorization, repeated use of the formula gives

$$
\varphi(n)=\prod_i p_i^{k_i-1}(p_i-1)
=n\prod_{p\mid n}\left(1-\frac1p\right).
$$

For $n=360=2^3\cdot3^2\cdot5$, this is $4\cdot6\cdot4=96$. The prime factors determine which classes are excluded, while the exponents determine how many times each pattern repeats.

## 3. Euler's theorem and Fermat's theorem

Lagrange's theorem applied to $U(n)$ says that the multiplicative order of a unit divides $\varphi(n)$. Therefore

$$
a^{\varphi(n)}\equiv1\pmod n\qquad\text{if }\gcd(a,n)=1.
$$

This is **Euler's theorem**. The coprimality hypothesis is essential: modulo $8$, the expression $2^{\varphi(8)}=2^4$ is congruent to $0$, not $1$.

For prime $p$, every nonzero class is a unit and $\varphi(p)=p-1$, giving **Fermat's little theorem**:

$$
a^{p-1}\equiv1\pmod p\qquad\text{when }p\nmid a.
$$

An equivalent formulation valid for every integer $a$ is $a^p\equiv a\pmod p$. If $p\mid a$, both sides are zero modulo $p$; otherwise multiply the first formulation by $a$. Do not divide the second formulation by $a$ when $p\mid a$.

There is also a direct permutation proof of Euler's theorem. Multiplying all units by a fixed unit $a$ permutes the unit set, because multiplication by $a$ is a bijection. Multiplying the resulting list gives $a^{\varphi(n)}P=P$, where $P$ is the product of all units. Since $P$ is itself a unit, it can be canceled. This proof is an arithmetic version of the same group phenomenon.

For example, to calculate $7^{2026}$ modulo $15$, first note that $7$ is a unit and $\varphi(15)=8$. Reducing the exponent modulo $8$ gives $7^{2026}\equiv7^2\equiv4\pmod{15}$. We could do better by finding the exact order: $7^2\equiv4$ and $7^4\equiv1$, so the order is $4$. A smaller valid period shortens computations but does not change their justification.

## 4. Exponentiation by repeated squaring

Large powers need not be formed as enormous integers. At each multiplication we may reduce modulo $n$, because congruence respects multiplication. Write the exponent in binary, or equivalently as a sum of distinct powers of two. Repeatedly square the base, reducing after each square, and multiply the selected entries.

To compute $7^{13}$ modulo $55$, calculate $7^2\equiv49$, $7^4\equiv49^2\equiv36$, and $7^8\equiv36^2\equiv31$. Since $13=8+4+1$, multiply $31\cdot36\cdot7$. The first product is $1116\equiv16$, and $16\cdot7=112\equiv2$. Hence $7^{13}\equiv2\pmod{55}$.

This method works for nonunits too. It relies only on multiplication and congruence, not on inverses. Euler's theorem, by contrast, requires a unit before reducing an exponent by $\varphi(n)$. Separating the computational algorithm from the theorem used to shorten exponents prevents invalid cancellations.

If a negative exponent is requested, an inverse is necessary. For a unit $a$, define $a^{-k}$ using its modular inverse. For a nonunit, a negative modular power is undefined in this group sense. Extended Euclid both determines whether the inverse exists and calculates it when it does.

## 5. Wilson's theorem through inverse pairing

For a prime $p$, **Wilson's theorem** states

$$
(p-1)!\equiv-1\pmod p.
$$

For $p=2$, the assertion reads $1\equiv-1\pmod2$, which is true. Assume now that $p$ is odd. Every nonzero class modulo $p$ has an inverse. Pair each class with its inverse. A pair of distinct classes contributes product $1$ to the product of all nonzero classes.

The unpaired classes are those satisfying $x=x^{-1}$, equivalently $x^2=1$. In a prime modulus, $(x-1)(x+1)=0$ implies $x=1$ or $x=-1$, because nonzero factors are invertible and cannot multiply to zero. Thus only $1$ and $-1$ are self-inverse. Their product is $-1$, proving the theorem.

The converse also holds: if an integer $n\ge2$ satisfies $(n-1)!\equiv-1\pmod n$, then $n$ is prime. If $n$ were composite, choose a prime divisor $q<n$. The factorial contains the factor $q$, so it is divisible by $q$. The congruence would force $0\equiv-1\pmod q$, impossible. Thus Wilson gives an exact characterization of primes, although factorial calculation is not generally an efficient primality algorithm.

The proof illustrates why field-like cancellation matters. For a composite modulus, a solution to $x^2=1$ may differ from $\pm1$. Modulo $8$, all four units $1,3,5,7$ are self-inverse. The factorization $(x-1)(x+1)=0$ does not force one factor to be zero there, because nonzero classes can have zero product.

## 6. A local polynomial prerequisite

To prove that $U(p)$ is cyclic, we need one fact about polynomials. A polynomial over $\mathbb F_p$ is an expression $c_0+c_1X+\cdots+c_dX^d$ with coefficients that are classes modulo $p$. Its degree is the largest index of a nonzero coefficient. A root is a field element $a$ at which substitution gives zero.

A nonzero polynomial of degree $d$ over a field has at most $d$ distinct roots. Here is a proof sufficient for our use. If $a$ is a root of $f$, then $f(X)-f(a)$ is divisible by $X-a$, because each difference $X^k-a^k$ equals $(X-a)(X^{k-1}+X^{k-2}a+\cdots+a^{k-1})$. Hence $f(X)=(X-a)g(X)$ with $g$ of degree $d-1$.

If $b\ne a$ is another root, substitution gives $0=(b-a)g(b)$. The factor $b-a$ is nonzero and invertible in the field, so $g(b)=0$. Induction on degree proves the bound: one selected root is removed, and at most $d-1$ others remain. A nonzero constant polynomial has no roots, providing the initial case.

Over a composite modulus the root bound can fail. The polynomial $X^2-1$ has four roots modulo $8$, although its degree is two. The induction breaks exactly where a nonzero factor would need to be canceled. Thus the field hypothesis is not decorative. The later polynomial chapters will generalize this small argument, but it is already available for the prime-modulus group proof.

## 7. Primitive roots modulo primes

A **primitive root modulo $n$** is a unit whose multiplicative order is $\varphi(n)$, equivalently a generator of $U(n)$. We now prove that primitive roots exist modulo every prime.

Let $G=U(p)$ and let $E$ be the least common multiple of all element orders in $G$. Lagrange says each order divides $p-1$, so $E\mid p-1$. We first show that some element has order $E$. Factor $E$ into prime powers. For each prime power $q^r$ appearing, the definition of least common multiple ensures that some element $a_q$ has order whose $q$-part is exactly $q^r$. If that order is $q^rt$ with $q\nmid t$, the element $b_q=a_q^t$ has order $q^r$ by the order-of-a-power formula.

The elements $b_q$ commute because $G$ is abelian. Their orders are pairwise coprime. Repeated application of the coprime-order product theorem from Chapter 7 shows that their product has order $\prod_q q^r=E$. If $G$ has only one element, as for $p=2$, the identity itself supplies the generator and the following argument is unnecessary.

Every element of $G$ satisfies $x^E=1$, by the definition of $E$. Thus the nonzero polynomial $X^E-1$ over $\mathbb F_p$ has at least $p-1$ roots. The root bound gives $p-1\le E$. Combined with $E\mid p-1$, this forces $E=p-1$. The constructed product therefore generates $G$.

For example, modulo $7$ the powers of $3$ are $1,3,2,6,4,5$ before returning to $1$. Thus $3$ is primitive. The class $2$ is not, because $2^3\equiv1$. A cyclic group of order $6$ has $\varphi(6)=2$ generators; the primitive roots here are $3$ and $5$.

To test a proposed primitive root $g$ modulo $p$, factor $p-1$. It suffices to check $g^{(p-1)/q}\not\equiv1$ for each prime divisor $q$ of $p-1$. If the order were a proper divisor, at least one such prime could be removed from the known return exponent. For $p=17$, testing $g=3$ requires only $3^8\not\equiv1$, because the only prime divisor of $16$ is $2$. Indeed $3^4\equiv13$ and $3^8\equiv16=-1$, so $3$ is primitive.

## 8. Discrete logarithms: a useful coordinate system

Once a primitive root $g$ modulo $p$ is chosen, every nonzero class has a unique expression $g^k$ with $k$ taken modulo $p-1$. The exponent is called a discrete logarithm to base $g$. Multiplication of nonzero classes becomes addition of exponent classes. This is the isomorphism $C_{p-1}\cong U(p)$ written as a coordinate system.

For $p=7$ and $g=3$, the class $2$ corresponds to exponent $2$ and the class $5$ to exponent $5$. Their product $2\cdot5\equiv3$ corresponds to exponent $2+5\equiv1\pmod6$. The modulus for exponents is $p-1$, while the modulus for the original classes is $p$. Confusing these two moduli is a frequent source of mistakes.

The existence of this coordinate system does not imply that finding a discrete logarithm is easy for large parameters. Algebraic existence and computational efficiency are separate questions. We can build the full table for a small prime in a lesson, but that does not provide an efficient method for every large prime.

## Prerequisite detail: why the lifting expansions work

The binomial identity used in the prime-power section is

$$
(x+y)^m=\sum_{j=0}^{m}\binom mj x^{m-j}y^j.
$$

Here the sum symbol means that we add the terms for $j=0,1,\ldots,m$, and $\binom mj$ counts the subsets of size $j$ from a set with $m$ elements. To derive the identity, multiply $m$ copies of $(x+y)$. A term is produced by choosing either $x$ or $y$ from each copy. Choosing $y$ from exactly $j$ copies produces $x^{m-j}y^j$, and there are $\binom mj$ choices of those copies. This argument assumes the factors commute, which ordinary integer multiplication does.

For prime $p$ and $1\le j\le p-1$, the integer $\binom pj$ is divisible by $p$. The identity $\binom pj=p!/(j!(p-j)!)$ shows that the numerator contains a factor $p$, while the denominator contains none. More formally, the denominator is coprime to $p$, so the integrality of the coefficient and Euclid's lemma imply that $p$ divides the coefficient. This is the exact divisibility fact used to push all middle terms beyond the leading term in the lifting argument.

The phrase exact power of $p$ can be expressed without new machinery: an integer has exact power $p^r$ dividing it when $p^r$ divides it and $p^{r+1}$ does not. If one summand has exact power $p^r$ and all the remaining summands are divisible by $p^{r+1}$, their sum still has exact power $p^r$. Factor out $p^r$; the resulting sum is a nonmultiple of $p$ plus multiples of $p$, so it remains a nonmultiple. This explains why the leading term in the binomial proof cannot be canceled by the later terms.

## 9. Extension: unit groups of prime powers

This section goes beyond the first encounter with Euler and Fermat, but it completes a standard structural picture. We prove that $U(p^k)$ is cyclic when $p$ is odd, while powers of two behave differently. The proofs use binomial expansion, whose finite identity follows from multiplying out repeated sums and grouping like terms.

Start with a primitive root $g$ modulo an odd prime $p$. We can choose a representative $h$ of the same class with $h^{p-1}\not\equiv1\pmod{p^2}$. If $g$ already has this property, take $h=g$. Otherwise take $h=g+p$. Binomial expansion modulo $p^2$ gives

$$
(g+p)^{p-1}\equiv g^{p-1}+(p-1)g^{p-2}p\pmod{p^2}.
$$

The coefficient $(p-1)g^{p-2}$ is nonzero modulo $p$, so the added term is divisible by $p$ but not by $p^2$. It changes a value congruent to $1$ modulo $p^2$ into one not congruent to $1$. Thus $h^{p-1}=1+pu$ with $p\nmid u$.

We need a lifting observation. If $v=1+p^ru$ with $r\ge1$, $p$ odd, and $p\nmid u$, then $v^p-1$ is divisible by $p^{r+1}$ but not by $p^{r+2}$. In the binomial expansion the first term is $p^{r+1}u$. For exponents $2$ through $p-1$, the binomial coefficient is divisible by $p$, giving divisibility by at least $p^{r+2}$. The last term has exponent $pr\ge r+2$. Thus no later term cancels the first term's exact power of $p$.

Induction gives that $h^{(p-1)p^t}-1$ has exact $p$-divisibility $p^{t+1}$. The order of $h$ modulo $p^k$ is divisible by $p-1$, because reducing a return modulo $p$ gives a return there. Euler's theorem says it divides $(p-1)p^{k-1}$, so it must be $(p-1)p^j$ for some $0\le j\le k-1$. The exact-divisibility calculation forces $j=k-1$. Hence $h$ has the full group order and generates $U(p^k)$.

For powers of two, $U(2)$ is trivial and $U(4)=\{1,3\}$ is cyclic of order two. For $k\ge3$, the precise structure is

$$
U(2^k)\cong C_2\times C_{2^{k-2}}.
$$

Here the two factors are generated by $-1$ and $5$. To justify the claim, first prove by repeated squaring that $5^{2^t}-1$ is divisible by $2^{t+2}$ but not by $2^{t+3}$. The starting case is $5-1=4$. If $v=1+2^ru$ with $r\ge2$ and $u$ odd, then $v^2-1=2^{r+1}u+2^{2r}u^2$ has exact power $2^{r+1}$, since $2r\ge r+2$.

Consequently $5$ has order $2^{k-2}$ modulo $2^k$. Its powers all lie among classes congruent to $1$ modulo $4$, and there are exactly $2^{k-2}$ such classes, so they exhaust that set. Every odd class is either $1$ or $3$ modulo $4$. Multiplication by $-1$ swaps these two types, so each unit has a unique expression $(-1)^\varepsilon5^t$ with $\varepsilon$ modulo $2$ and $t$ modulo $2^{k-2}$. This gives the claimed direct-product isomorphism. In particular these groups are not cyclic for $k\ge3$.

For an explicit odd-prime example, take $p=3$ and $h=2$. We have $2^2-1=3$, with exact power three. Then $2^6-1=63=3^2\cdot7$, and $2^{18}-1=262143=3^3\cdot9709$, where the remaining factors are not divisible by three. Accordingly the order of two modulo $3$, $9$, and $27$ is respectively $2$, $6$, and $18$. The abstract lifting proof explains every stage instead of requiring a fresh search at each modulus.

For powers of two, beginning with a number congruent to one modulo four is what makes the squaring argument work cleanly. If one starts with $1+2u$ for odd $u$, the two terms in the square difference can have the same two-adic size and may interact. Starting with five gives an initial difference divisible by four, ensuring that the quadratic term has at least one extra factor of two at each step. This is why the generator five appears naturally in the structural description rather than being an unexplained numerical trick.

## 10. Extension: exactly which moduli have primitive roots?

Combining the prime-power classification with CRT shows that, for $n\ge2$, primitive roots exist exactly for

$$
n=2,\quad 4,\quad p^k,\quad 2p^k
$$

where $p$ is an odd prime and $k\ge1$. The positive assertions follow because $U(p^k)$ is cyclic, and adding a coprime factor $2$ adds only the trivial unit group.

For the exclusions, two distinct odd prime-power factors each contribute an even-order unit group. Their product cannot be cyclic: the order of any pair is at most the least common multiple of two even group orders, strictly less than their product. A factor $2^k$ with $k\ge3$ already contributes a noncyclic group. If $4$ divides the modulus and an odd prime also divides it, the factor $U(4)$ and the odd-prime-power factor again both have even order, preventing cyclicity. These cases exhaust all other prime factorizations.

For example, $U(18)\cong U(2)\times U(9)$ is cyclic of order six, whereas $U(24)\cong U(8)\times U(3)$ is not. The classification explains these facts without listing all multiplication tables. The proofs above establish the classification, while later chapters revisit its ingredients in the broader language of fields and valuations.

## 11. RSA correctness for every residue class

Choose distinct primes $p,q$ and let $n=pq$. Then $\varphi(n)=(p-1)(q-1)$. Choose a positive integer $e$ coprime to $\varphi(n)$, and use extended Euclid to find a positive integer $d$ with $ed\equiv1\pmod{\varphi(n)}$. Encryption sends a class $m$ to $c=m^e$ modulo $n$, and decryption sends $c$ to $c^d$.

For units $m$, Euler's theorem immediately gives $m^{ed}\equiv m$. But a complete correctness proof must include nonunits. Write $ed=1+t\varphi(n)$ and work separately modulo $p$ and $q$. Modulo $p$, if $p\mid m$, both $m^{ed}$ and $m$ are zero. If $p\nmid m$, Fermat's theorem applies, and $p-1$ divides $ed-1$, so $m^{ed}\equiv m$. The same argument holds modulo $q$. CRT then gives $m^{ed}\equiv m\pmod{pq}$ for every integer $m$.

The distinct-prime hypothesis matters. For modulus $9$, using $e=d=5$ gives $ed\equiv1\pmod{\varphi(9)}$, yet $3^5\equiv0\pmod9$, so the nonunit message $3$ cannot be recovered. The prime-power obstruction is not repaired by blindly applying Euler to a nonunit.

For a complete toy example, take $p=5$, $q=11$, $n=55$, and $\varphi(n)=40$. Choose $e=3$. Since $3\cdot27=81\equiv1\pmod{40}$, take $d=27$. The message $m=7$ encrypts to $7^3=343\equiv13$. Decrypting means computing $13^{27}$ modulo $55$. Modulo $5$, it is $3^{27}\equiv3^3\equiv2$; modulo $11$, it is $2^{27}\equiv2^7\equiv7$. The original value $7$ has exactly those two residues, so CRT reconstructs $7$.

A nonunit message works too. Let $m=5$. Encryption gives $5^3\equiv15$. Modulo $5$, every positive power of $15$ is zero. Modulo $11$, $15^{27}\equiv4^{27}\equiv5$, since $4^5\equiv1$ and $4^2\equiv5$. The unique class modulo $55$ with residues $0$ modulo $5$ and $5$ modulo $11$ is $5$. This verifies the case that an incomplete unit-only proof would miss.

The arithmetic demonstrates correctness of the exponentiation mechanism. It is not a complete secure encryption format: practical encryption also needs carefully designed encodings, randomness, parameter handling, and implementation safeguards. Those engineering choices are separate from the group-theoretic theorem proved here.

The correctness proof also shows that encryption is a permutation of all residue classes modulo the distinct-prime product. If two messages have the same ciphertext, applying the decryption power to both gives the same original message, so encryption is injective. A self-map of a finite set that is injective is also surjective. Thus no residue class is omitted, and none has two different preimages. This statement includes zero and nonunits. The power map is generally not an additive homomorphism, so its bijectivity should not be confused with preserving every operation of the residue ring.

## 12. Testing primes and recognizing logical limits

Fermat's theorem gives a necessary condition for primality, not a sufficient one for a selected base. The composite number $341=11\cdot31$ satisfies $2^{340}\equiv1\pmod{341}$ because $2^{10}=1024\equiv1\pmod{341}$ and $340$ is a multiple of $10$. Passing this single Fermat test therefore does not prove primality.

Failure is decisive when the hypotheses are interpreted correctly. If $\gcd(a,n)=1$ and $a^{n-1}\not\equiv1\pmod n$, then $n$ is composite, because a prime would satisfy Fermat. If the gcd is already a nontrivial factor, compositeness is known before exponentiation. A successful test gives evidence, while a failed necessary condition gives proof of failure.

Wilson's theorem has a converse, but that logical strength does not automatically make it a fast computational method. Distinguish what a theorem characterizes from how efficiently its condition can be checked. This distinction is central to algorithmic number theory and to interpreting computer experiments responsibly.

In the [companion](../companion/index.html), the `units` experiment computes actual unit sets, powers, and orders for bounded moduli. Use it to compare prime moduli, odd prime powers, and powers of two. Its finite output checks examples; the proofs explain why the structural patterns persist beyond the displayed range.

## Solving power equations with cyclic coordinates

Primitive roots turn multiplicative equations into additive congruences. Let $p$ be prime, let $g$ be a primitive root, and let $a=g^s$ be nonzero modulo $p$. Every possible nonzero unknown has the form $x=g^t$. The equation $x^k=a$ becomes $g^{kt}=g^s$, equivalently

$$
kt\equiv s\pmod{p-1}.
$$

Chapter 5 completely solves this linear congruence. Set $d=\gcd(k,p-1)$. There are no solutions unless $d\mid s$, and if that divisibility holds, there are exactly $d$ exponent classes modulo $p-1$. Because exponent classes label nonzero field elements bijectively, there are exactly $d$ nonzero roots. This is a concrete payoff from connecting group structure with the earlier arithmetic.

For instance, modulo $7$ choose $g=3$. The class $6$ is $3^3$. To solve $x^3=6$, solve $3t\equiv3\pmod6$. The solutions are $t=1,3,5$ modulo $6$, giving $x=3,6,5$. Direct calculation checks $3^3\equiv6$, $6^3\equiv6$, and $5^3\equiv6$. There are three roots, matching the gcd. To solve $x^2=3$, we instead need $2t\equiv1\pmod6$, which has no solution because $2$ does not divide $1$.

The zero target must be handled separately. Over a prime modulus, $x^k=0$ for a positive exponent implies $x=0$, since every nonzero class is invertible. We do not take a discrete logarithm of zero, because zero is not in the multiplicative group. This boundary case is an example of checking the domain before applying a coordinate system.

For $x^k=1$, the exponent condition is $kt\equiv0\pmod{p-1}$, so the number of roots is $\gcd(k,p-1)$. The root bound from the polynomial argument is consistent with this count, since the gcd is no greater than $k$ for positive $k$. The formula also shows that the upper bound need not be attained: a cubic can have one or three nonzero roots of unity depending on the prime.

## CRT combines orders by least common multiples

When $m,n$ are coprime and $a$ is a unit modulo $mn$, let $r$ be its order modulo $m$ and $s$ its order modulo $n$. Then its order modulo $mn$ is $\operatorname{lcm}(r,s)$. A power returns to one modulo $mn$ exactly when it returns to one modulo both factors, by CRT. Those two conditions are $r\mid k$ and $s\mid k$, whose least positive simultaneous solution is the least common multiple.

For $a=2$ modulo $15$, its order modulo $3$ is $2$ and its order modulo $5$ is $4$. Hence its order modulo $15$ is $4$. The unit group has eight elements, so this element is not a generator. More generally, $U(15)\cong U(3)\times U(5)\cong C_2\times C_4$, and no pair has order greater than four. This provides a structural reason for the absence of primitive roots modulo fifteen.

The same viewpoint explains square roots of one. Modulo each odd prime, the only roots are $1$ and $-1$. For two distinct odd primes $p,q$, choose a sign independently in each coordinate, producing four roots modulo $pq$. Two choices give the global classes $1$ and $-1$; the mixed sign choices give two additional roots. Modulo fifteen these are $1,4,11,14$. For example, $4$ is $1$ modulo three but $-1$ modulo five, and $4^2\equiv1\pmod{15}$.

This does not contradict the polynomial root bound, whose hypothesis was a field. It instead pinpoints how a product of fields differs from a single field: different factors can make different parts of a product vanish. The later ring CRT will formalize that distinction and connect it to zero divisors.

## A shorter universal exponent

The group size $\varphi(n)$ is always a valid exponent for every unit, but it may be larger than necessary. Define $\lambda(n)$ to be the least common multiple of the orders of all elements of $U(n)$. Then every unit satisfies $a^{\lambda(n)}=1$, and any positive exponent with that property is a multiple of $\lambda(n)$. The latter claim follows because every individual element order must divide such an exponent.

Lagrange gives $\lambda(n)\mid\varphi(n)$. If the unit group is cyclic, its generator has order $\varphi(n)$, forcing equality. For a product supplied by CRT, the universal exponent is the least common multiple of the coordinate exponents. Thus $\lambda(15)=\operatorname{lcm}(2,4)=4$, even though $\varphi(15)=8$. For $55$, the value is $\operatorname{lcm}(4,10)=20$, whereas the totient is forty.

This explains a refinement of the RSA key relation. For distinct primes $p,q$, it is enough to choose $ed\equiv1\pmod{\operatorname{lcm}(p-1,q-1)}$. The prime-by-prime proof still works because both $p-1$ and $q-1$ divide $ed-1$. In the toy modulus fifty-five with $e=3$, one may take $d=7$, since $3\cdot7=21\equiv1\pmod{20}$. The earlier value $d=27$ differs by twenty and has the same effect on the power permutation.

The notation $\lambda$ here names a group exponent and does not refer to an element count. Distinguishing those quantities is useful throughout algebra: the number of elements gives one possible common period, while the internal decomposition can reveal a smaller period shared by all elements.

## From an element order to a factorization

Orders can also expose factors of a composite modulus. Suppose $a$ is a unit modulo an odd integer $n$ and has even order $r$. Then $b=a^{r/2}$ satisfies $b^2=1$ but $b\ne1$, since otherwise $r$ would not be the first return exponent. If $b\ne-1$ as well, then $n$ divides $(b-1)(b+1)$ without dividing either factor separately. Computing gcds can reveal nontrivial factors.

For example, take $n=55$ and $a=2$. The order modulo five is four and the order modulo eleven is ten, so the order modulo fifty-five is twenty. Compute $b=2^{10}\equiv34\pmod{55}$. This is neither one nor minus one. Now $\gcd(34-1,55)=\gcd(33,55)=11$, while $\gcd(34+1,55)=\gcd(35,55)=5$. The mixed square root of one separates the two prime factors.

Why are the gcds nontrivial in this situation? Since $n\mid(b-1)(b+1)$, every prime divisor of $n$ divides at least one factor. For odd primes, no prime can divide both consecutive-even-separated integers $b-1$ and $b+1$, since a common divisor divides two. If one of the two gcds were one, all prime-power factors of $n$ would have to divide the other expression, forcing $b$ to equal one of the two global signs modulo $n$. The assumed mixed root excludes that outcome.

This calculation does not assert that finding an order is always easy. It shows a mathematical connection: an order-finding procedure can sometimes be converted into a factor-finding procedure. The gcd step is efficient and exact, while obtaining a useful even order is the separate computational issue. It is another example of a theorem translating information from one problem into progress on another.

## Turning an order computation into a primality proof

A full order can certify a prime when the relevant integer factorization is known. Suppose $n\ge2$, a unit $g$ modulo $n$ satisfies $g^{n-1}=1$, and for every prime divisor $q$ of $n-1$ we have $g^{(n-1)/q}\ne1$. Then the order of $g$ is exactly $n-1$. Indeed, the order divides the known return exponent. If it were a proper divisor, some prime factor of the quotient could be removed, contradicting one of the tests.

Because the element belongs to $U(n)$, its order divides $\varphi(n)$. Thus $n-1\le\varphi(n)$. But among the integers $1,\ldots,n-1$ there are at most $n-1$ units, and if $n$ is composite at least one integer in that interval shares a nontrivial factor with $n$. Consequently equality $\varphi(n)=n-1$ is possible only for a prime. The computed order therefore proves that $n$ is prime.

For $n=17$, take $g=3$. Repeated squaring gives $3^4\equiv13$, $3^8\equiv-1$, and $3^{16}\equiv1$. The only prime dividing sixteen is two, and the test at exponent eight is not one. Hence the order is sixteen, which certifies primality by the argument above. This is logically stronger than observing only $3^{16}\equiv1$.

The method also clarifies what the base-two test for $341$ lacks. Its successful return at exponent $340$ does not show that the order is $340$; in fact, the order divides ten. Primality depends on establishing a sufficiently large order, rather than merely finding some return exponent. The certificate is useful when the factorization of $n-1$ is available, and its proof makes that requirement visible.

## 13. Optional exercises

Hints and reference solutions are in [Chapter 09 solutions](../solutions/09-solutions.md).

1. List $U(15)$, compute the order of $[2]$, and determine whether the group is cyclic.
2. Calculate $\varphi(840)$ and use Euler's theorem to find $11^{2026}$ modulo $35$.
3. Prove Wilson's theorem gives $12!\equiv-1\pmod{13}$, then calculate $11!$ modulo $13$ without multiplying eleven factors.
4. Find all primitive roots modulo $11$, starting from the generator $2$. Prove that your list is complete.
5. Using the prime-power classification, determine which of $14,16,18,20,25,27$ have primitive roots.
6. For the toy RSA system $n=55,e=3,d=27$, encrypt and decrypt the nonunit message $11$. Show the prime-by-prime correctness explicitly.
7. Prove that a polynomial of degree two has at most two roots modulo a prime, and exhibit four distinct roots of $X^2-1$ modulo $8$.
8. Show that $341$ passes the base-two Fermat congruence, but fails the analogous congruence for at least one base coprime to $341$. Find such a base by a short calculation.

## 14. What the multiplicative viewpoint explains

Invertibility is equivalent to coprimality, so the arithmetic condition from Bezout becomes membership in a group. Group orders yield Euler and Fermat; inverse pairing yields Wilson; a polynomial root bound yields primitive roots modulo primes. CRT and lifting then describe unit groups for all prime-power factors.

The next chapter returns to general groups through permutations. Those groups will supply a language for rearrangements and parity, and eventually for symmetries of polynomial roots. The arithmetic examples here will remain active: primitive roots, element orders, and modular fields will become central again in quadratic residues, finite fields, and Galois theory.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](08-homomorphisms-and-quotient-groups.md) · [Next chapter](10-permutations-and-alternating-groups.md) · [Hints and solutions](../solutions/09-solutions.md)
