# 08. Number theory and modular arithmetic

Clocks wrap around, hash tables use remainders, and public-key arithmetic depends on the structure of integers. Number theory asks which operations remain valid under these constraints. Source Chapter 9 is unusually broad, so this chapter joins divisibility, Euclid's algorithm, prime factorization, modular arithmetic, and the mathematics behind toy cryptosystems. The cryptographic examples explain algebra; they are not deployment instructions.

## Divisibility and linear combinations

For integers $a,b$, write $a\mid b$ when $b=ak$ for some integer $k$. Thus $4\mid20$ but $4\nmid22$. Every nonzero integer divides zero. Under this definition $0\mid0$ is true, while $0$ divides no nonzero integer. Divisibility is a relation, not division as a numerical operation.

If $d\mid a$ and $d\mid b$, then $d\mid(ua+vb)$ for all integers $u,v$: substitute $a=dr,b=ds$ and factor $d(ur+vs)$. This linear-combination property explains both gcd algorithms and impossibility results. If jug operations only create amounts that are integer combinations of capacities six and ten, all obtainable amounts are divisible by two, so an odd target is impossible.

For positive integer capacities $a,b$ and an integer target $0\le t\le\max(a,b)$, the standard ideal jug model permits obtaining $t$ in one jug exactly when $\gcd(a,b)\mid t$, assuming unlimited filling, emptying, and pouring until a jug empties or fills. Necessity follows from an invariant on amounts. Sufficiency can be seen by repeatedly cycling pours, which visits residue classes in increments of one capacity modulo the other; the reachable residues are exactly multiples of the gcd. A linear combination alone does not describe a legal physical sequence, so a constructive pouring argument is still needed.

The gcd of integers not both zero is the greatest positive common divisor, written $\gcd(a,b)$. It is unchanged by signs. The least common multiple for positive $a,b$ is the smallest positive common multiple and satisfies $\operatorname{lcm}(a,b)=ab/\gcd(a,b)$. Prime exponents will explain that formula below.

## Euclid and Bézout coefficients

The identity $\gcd(a,b)=\gcd(b,a\bmod b)$ follows because the pairs have the same common divisors, as proved in Chapter 06. Apply repeated division to $252$ and $105$:

$$252=2\cdot105+42,\qquad105=2\cdot42+21,\qquad42=2\cdot21.$$

The gcd is twenty-one. Back-substitution, called the extended Euclidean algorithm or the source's “Pulverizer,” writes it as a linear combination:

$$21=105-2\cdot42=105-2(252-2\cdot105)=5\cdot105-2\cdot252.$$

Bézout's identity says $\gcd(a,b)=ua+vb$ for integers $u,v$. Extended Euclid constructs them. Its proof can track each remainder as an integer combination of the original inputs. The initial remainders have coefficient pairs $(1,0)$ and $(0,1)$; subtracting an integer multiple preserves the representation.

Consequently $ax+by=t$ has an integer solution exactly when the gcd divides $t$. Necessity is the linear-combination property. For sufficiency, multiply Bézout's identity by $t/d$ when $d=\gcd(a,b)\mid t$. For $6x+10y=14$, divide the gcd identity $2=2\cdot6-10$ into the target: multiply by seven to get $x=14,y=-7$. A smaller solution is $x=-1,y=2$. Negative coefficients are allowed algebraically.

Euclid is efficient because the remainder decreases rapidly, not just because it decreases eventually. Over two divisions, the relevant positive value falls by at least a factor of two: if a remainder is more than half its predecessor, the next remainder is their difference and is less than half. Thus the number of divisions is logarithmic in the input magnitude. The cost of each division also depends on the number of input bits; counting divisions is a particular cost model.

## Primes and unique factorization

A prime is an integer greater than one whose only positive divisors are one and itself. A composite integer greater than one has a nontrivial factorization. One is neither prime nor composite. Every integer at least two has a prime factorization by strong induction.

Euclid's lemma states that if prime $p$ divides $ab$, then $p\mid a$ or $p\mid b$. If $p\nmid a$, primality gives $\gcd(p,a)=1$, so Bézout gives $up+va=1$. Multiply by $b$: $upb+vab=b$. Both left terms are divisible by $p$, so $p\mid b$. This proof identifies why primality is essential: $6\mid2\cdot3$, but six divides neither factor.

For uniqueness, suppose a positive integer has two products of primes. The first prime in one product divides the other product, hence by repeated Euclid's lemma equals a prime factor there. Cancel equal nonzero factors and continue inductively. The prime multiset is therefore unique up to order. Existence and uniqueness are separate parts of the fundamental theorem of arithmetic.

For example, $360=2^3\cdot3^2\cdot5$ and $84=2^2\cdot3\cdot7$. Their gcd takes minimum exponents, $2^2\cdot3=12$, and their lcm takes maximum exponents, $2^3\cdot3^2\cdot5\cdot7=2520$. Minimum plus maximum equals the sum of exponents for each prime, proving $\gcd(a,b)\operatorname{lcm}(a,b)=ab$.

There are infinitely many primes. If $p_1,\ldots,p_k$ listed them all, the number $p_1\cdots p_k+1$ would have a prime divisor not on the list, since division by any listed prime leaves remainder one. The constructed number itself need not be prime. The source's “prime mysteries” illustrate the difference between proven theorems and conjectures about patterns. We do not use a historical numerical search limit as a current theorem.

## Congruence and remainder arithmetic

For modulus $m>1$, $a\equiv b\pmod m$ means $m\mid(a-b)$. Equivalently, $a$ and $b$ have the same remainder in $\{0,\ldots,m-1\}$. Thus $29\equiv5\pmod{12}$ and $-1\equiv11\pmod{12}$. Congruence is an equivalence relation: reflexivity, symmetry, and transitivity follow from corresponding properties of differences.

Addition and multiplication respect congruence. If $a\equiv b$ and $c\equiv d\pmod m$, then $a+c\equiv b+d$ and $ac\equiv bd$. For multiplication, $ac-bd=(a-b)c+b(c-d)$ is divisible by $m$. Therefore we can reduce after every operation without changing the final remainder.

The residue classes with these operations form $\mathbb Z_m$, a commutative ring: addition and multiplication are associative and commutative, distribute, and have identities zero and one; addition has inverses. The word “ring” names this package of laws. It does not promise that every nonzero element has a multiplicative inverse.

For $m=8$, $2\cdot4\equiv0$ even though neither factor is zero modulo eight. Such elements are zero divisors. This is why cancellation can fail. From $2\cdot1\equiv2\cdot5\pmod8$, one cannot conclude $1\equiv5\pmod8$.

## Inverses and cancellation

An inverse of $a$ modulo $m$ is a residue $b$ with $ab\equiv1\pmod m$. It exists exactly when $\gcd(a,m)=1$. If Bézout gives $ua+vm=1$, then $ua\equiv1$, so $u$ is an inverse. Conversely, $ab=1+km$ makes one an integer combination of $a,m$, forcing their gcd to divide one.

For the inverse of seven modulo twenty-six,

$$26=3\cdot7+5,\quad7=5+2,\quad5=2\cdot2+1.$$

Back-substitute to get $1=3\cdot26-11\cdot7$, so $7^{-1}\equiv-11\equiv15\pmod{26}$. Check $7\cdot15=105=4\cdot26+1$. To solve $7x\equiv9\pmod{26}$, multiply by fifteen: $x\equiv135\equiv5$.

Invertible elements are exactly cancellable elements. An inverse permits multiplication on both sides. If $d=\gcd(a,m)>1$, the distinct residues zero and $m/d$ have equal products with $a$ modulo $m$, proving noncancellability. For a prime modulus, every nonzero residue is invertible; this structure is a field.

More generally, $ax\equiv b\pmod m$ has solutions exactly when $d=\gcd(a,m)$ divides $b$. Dividing the integer equation $ax-my=b$ by $d$ reduces to a coprime problem, giving $d$ residue solutions modulo $m$. For $6x\equiv8\pmod{14}$, divide by two to get $3x\equiv4\pmod7$, hence $x\equiv6\pmod7$, yielding residues six and thirteen modulo fourteen.

## Euler's theorem and repeated squaring

Let $\varphi(m)$ count residues from zero through $m-1$ relatively prime to $m$. If $\gcd(a,m)=1$, then $a^{\varphi(m)}\equiv1\pmod m$. To prove this, multiply all invertible residues $r_1,\ldots,r_{\varphi(m)}$. Multiplication by $a$ permutes them because $a$ is invertible. Thus $a^{\varphi(m)}\prod r_i\equiv\prod r_i$. Cancel the invertible product to obtain the theorem.

For prime $p$, $\varphi(p)=p-1$, giving Fermat's little theorem. For a prime power, $\varphi(p^k)=p^k-p^{k-1}$ because the excluded numbers are exactly multiples of $p$. In general,

$$\varphi(m)=m\prod_{p\mid m}\left(1-\frac1p\right),$$

where the product is over distinct prime divisors. Chapter 13 derives this by inclusion–exclusion. For $m=36$, it gives $36(1/2)(2/3)=12$. The coprimality condition in Euler's theorem cannot be dropped: $2^{\varphi(8)}=16\equiv0$, not one modulo eight.

Large exponents are computed by repeated squaring. To calculate $3^{13}\pmod{17}$, use $13=8+4+1$. Successive squares give $3^2\equiv9$, $3^4\equiv13$, and $3^8\equiv16$. Multiply the selected powers: $16\cdot13\cdot3\equiv12\pmod{17}$. The number of squarings is proportional to the exponent's bit length, rather than to the exponent itself.

## Two insecure multiplication codes

The source presents hypothetical early Turing-style codes to expose algebraic attacks, while acknowledging uncertainty about historical details. In the first, a secret prime $k$ multiplies prime messages $m$ to produce $c=km$. Two distinct prime messages give ciphertexts with gcd $k$ if neither message equals the key. For example, $k=11$, $m_1=7$, $m_2=13$ yield $77,143$, whose gcd is eleven. Reusing a key defeats the hoped-for difficulty of factoring a single product.

The modular version sends $c\equiv km\pmod p$ for public prime $p$ and nonzero key $k$. Decryption uses $k^{-1}$. But a known nonzero message yields $k\equiv cm^{-1}\pmod p$. With $p=29,k=8,m=5$, the ciphertext is eleven; since $5^{-1}\equiv6$, an observer knowing the pair recovers $11\cdot6\equiv8$. Correct reversible arithmetic does not imply cryptographic security.

The historical Turing material connects mathematical invention with the wartime codebreaking context and the persecution he later faced. Those narratives motivate the subject but are not assumptions in the algebra. We retain the mathematical lessons without treating speculative details of a hypothetical cipher as established history.

## The mathematics of toy RSA

Choose distinct primes $p=5,q=11$, so $n=55$ and $\varphi(n)=40$. Choose $e=3$, coprime to forty, and $d=27$ because $3\cdot27=81\equiv1\pmod{40}$. The public arithmetic is $c\equiv m^e\pmod n$, and recovery is $m'\equiv c^d\pmod n$. For message seven, $c=343\bmod55=13$, and repeated squaring gives $13^{27}\bmod55=7$.

For messages coprime to $n$, Euler gives $m^{ed}=m^{1+40t}\equiv m$. For all residues, reason separately modulo $p$ and modulo $q$. If $p\mid m$, both $m^{ed}$ and $m$ are zero modulo $p$. Otherwise Fermat's theorem applies since $p-1$ divides $ed-1$. The same holds modulo $q$. Their difference is divisible by both distinct primes, hence by $pq$, proving recovery for every message residue.

Factoring $n$ reveals $\varphi(n)$ and permits calculation of $d$. This implication does not prove every way to recover plaintext is equivalent to factoring. The examples use tiny parameters and raw deterministic exponentiation to teach a theorem. They make no claim about the security of a real encryption format or modern implementation.

Finally, a polynomial-time SAT decision procedure would permit polynomial-time factoring through a multiplication circuit. Encode unknown factor bits, require a nontrivial product equal to the target, and ask whether some assignment exists. Recover a witness by fixing one bit at a time, keeping a bit value for which satisfiability remains possible. Use enough bits for both factors of a general input; a special balanced-semiprime setting permits smaller fixed widths. This explains the connection between efficient constraint solving and arithmetic search without claiming that factoring is known to be NP-complete.

## A complete jug trace

With capacities three and five, obtain four units in the five-unit jug as follows. Start empty, fill the five-unit jug, and pour into the three-unit jug, leaving two in the larger. Empty the smaller, pour the two into it, refill the larger, then pour one unit into the smaller to fill it. Four remain in the larger. Every operation obeys the fill/empty/pour rules stated earlier. This concrete trace supplements the divisibility criterion with a legal construction.

The total quantity currently held need not remain constant because filling and emptying are allowed. The useful invariant is that amounts remain multiples of the gcd, not conservation of water. Choosing the wrong invariant from an superficially similar token-transfer example would give an incorrect reachability argument. Model the actual transitions before selecting a property to preserve.

## Solving a modular equation with several answers

For $4x\equiv2\pmod6$, the gcd is two, which divides the right side, so solutions exist. Divide the integer divisibility statement by two to get $2x\equiv1\pmod3$. The inverse of two modulo three is two, giving $x\equiv2\pmod3$. In a complete residue system modulo six, the answers are two and five. Both check: four times either leaves remainder two modulo six.

We reduced the modulus along with the coefficients. Cancelling two while keeping modulus six would falsely suggest a unique solution to a different congruence. In modular arithmetic, noninvertible factors can sometimes be divided out, but the modulus and solution multiplicity must change appropriately. This example is a useful diagnostic whenever a cancellation step seems too easy.

## Primality is different from factoring

To prove an integer $n>1$ composite, a nontrivial factor is a short certificate. To test primality by trial division, it suffices to check divisors through the square root: if $n=ab$ with both factors greater than one, at least one is at most the square root. The resulting method is finite and correct. Its running time measured in the number of input bits can still be very large, because a number with $k$ bits can have magnitude near $2^k$.

The source discusses efficient primality tests and their historical development. The mathematical distinction is that deciding whether a number is prime need not output its prime factors when it is composite. Factoring supplies more information. A proof that a particular trial-division method is slow does not establish a lower bound on every primality or factoring method. We avoid converting the source's historical descriptions of computational difficulty into unqualified current security claims.

## Checking a toy RSA calculation independently

For message ten under the key $n=55,e=3,d=27$, encryption gives $10^3\bmod55=10$. Recovery again gives ten. This particular ciphertext equals the message, so correctness is easy to see but secrecy is absent. Small examples can contain such fixed points, which reinforces why the arithmetic theorem alone is not a security theorem.

For message seven, compute the recovery through powers: $13^2\equiv4$, $13^4\equiv16$, $13^8\equiv36$, and $13^{16}\equiv31\pmod{55}$. Since $27=16+8+2+1$, multiply $31\cdot36\cdot4\cdot13$ modulo fifty-five. The successive reduced products are sixteen, nine, then seven. This provides a transparent trace matching the general modular-exponentiation algorithm.

Every reduction is justified because multiplication respects congruence. We never construct the enormous ordinary integer $13^{27}$. A machine implementation can likewise reduce at each step, though arbitrary-size integer support or overflow-safe multiplication is needed for large inputs. The companion restricts its toy examples and uses exact integer arithmetic where necessary.

## From decision to search

The SAT factoring connection illustrates a reusable reduction pattern. A decision oracle tells whether a completion exists, not necessarily which completion. To recover a witness, ask whether one proposed first bit can be extended to a valid solution. Keep it if yes, otherwise choose the other bit, assuming the current partial assignment was known to be extendable. Repeat for each remaining bit. Each answer preserves the invariant that at least one valid completion remains.

At the end, the complete assignment is a witness because it satisfies all constraints. The number of oracle calls is linear in the witness length. This is a proof about hypothetical access to a correct solver and the size of the encoding; it does not claim that the solver itself is fast. Separating the reduction's cost from the oracle's cost prevents circular conclusions about efficiency.

A useful final audit for any congruence calculation is to substitute the proposed residues into the original statement and compare remainders in the declared range. This independently catches errors from negative representatives, a changed modulus, or an inverse computed for the wrong number. Verification of selected answers does not replace the theorem proving that all solutions have been found; completeness comes from the gcd criterion and the reduced congruence.

## Practice

The number-theory lab displays Euclid, modular inverses, repeated squaring, and toy RSA. All calculations use bounded integer examples; their correctness is checked against exact arithmetic.

**08-A.** Find Bézout coefficients for $84,30$. **08-B.** Solve $5x\equiv3\pmod{17}$. **08-C.** Explain why $4x\equiv3\pmod6$ has no solution. **08-D.** Compute $\varphi(60)$. **08-E.** For the toy RSA key above, encrypt and recover message ten, which is not coprime to fifty-five. **08-F.** Explain the known-plaintext weakness of multiplicative encryption.
