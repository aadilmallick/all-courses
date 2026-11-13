# Chapter 18 — Gauss lemma and quadratic reciprocity

## Two square questions that should not know about each other

Is $3$ a square modulo $11$? Yes: $5^2\equiv3$. Is $11$ a square modulo $3$? Reducing the numerator gives $2$, which is not a square modulo $3$. The answers disagree. Now compare $5$ modulo $11$ and $11$ modulo $5$. Both are squares: $4^2\equiv5\pmod{11}$, and $11\equiv1\pmod5$. A pattern begins to emerge, but why should changing the roles of two primes preserve or reverse square status?

Quadratic reciprocity gives an exact answer. For distinct odd primes $p,q$,

$$
\left(\frac pq\right)\left(\frac qp\right)
=(-1)^{((p-1)/2)((q-1)/2)}.
$$

Thus the two Legendre symbols are equal unless both primes are congruent to $3$ modulo $4$, in which case they are opposite. This is a theorem about a relationship between two finite fields. There is no natural inclusion of one field into the other, so the relationship is deeper than reducing a single equation in two ways.

We will prove the theorem completely using elementary counting. The essential device is Gauss's lemma, which detects square status by counting signs in half of a multiplication table. A parity reformulation turns that count into lattice points under a line. Swapping the two primes exchanges the two sides of a rectangle, making the reciprocity sign visible.

The prerequisites are Legendre-symbol multiplicativity, Euler's criterion, cancellation modulo a prime and the floor function. We introduce the floor notation now: $\lfloor x\rfloor$ is the greatest integer at most the real number $x$. For example, $\lfloor13/5\rfloor=2$ and $\lfloor-1/3\rfloor=-1$. In our lattice proof, the numbers inside the floor will be positive nonintegers, so a floor counts positive integers strictly below the given number.

## A multiplication table with signs attached

Fix an odd prime $p$, set $m=(p-1)/2$, and let $a$ be an integer not divisible by $p$. Consider the $m$ residues

$$
a,2a,3a,\ldots,ma\pmod p.
$$

Replace each with its least positive representative, an integer between $1$ and $p-1$. Count how many of these representatives exceed $p/2$; call that number $N$. Since $p$ is odd, no representative equals $p/2$.

For $p=11$ and $a=3$, the list is $3,6,9,1,4$. The entries larger than $11/2$ are $6,9$, so $N=2$. Replace each of those entries by its negative representative: $6\equiv-5$ and $9\equiv-2$. The signed list becomes $3,-5,-2,1,4$. Its absolute values are exactly $1,2,3,4,5$ in a different order.

This last phenomenon is general. If two signed representatives had the same absolute value, then $ai\equiv aj$ or $ai\equiv-aj\pmod p$. Cancelling $a$ gives $i\equiv j$ or $i\equiv-j$. The first implies $i=j$ because both indices lie between $1$ and $m$. The second would make $p$ divide $i+j$, impossible since $2\le i+j\le p-1$. Therefore the absolute values are distinct elements of $\{1,\ldots,m\}$ and must be a permutation of that set.

This is the point where using only half the nonzero residues matters. If all indices from $1$ to $p-1$ were used, $i$ and $p-i$ would both occur, and the signed pairing would duplicate absolute values. The half-table chooses exactly one representative from each opposite pair.

## Gauss's lemma, proved by comparing products

Multiply the original $m$ congruences. Their product is $a^m m!$. The signed representatives have absolute values $1,\ldots,m$ and exactly $N$ negative signs, so their product is $(-1)^N m!$ modulo $p$. Consequently

$$
a^m m!\equiv(-1)^N m!\pmod p.
$$

None of the factors in $m!$ is divisible by $p$, so $m!$ is invertible modulo $p$. Cancel it to obtain $a^m\equiv(-1)^N$. Euler's criterion says $a^m\equiv(a/p)$. Since $1$ and $-1$ are distinct modulo an odd prime, this proves

$$
\boxed{\left(\frac ap\right)=(-1)^N.}
$$

This is Gauss's lemma. It expresses the Legendre symbol as the parity of a sign count. An even number of upper-half residues means $a$ is a square; an odd number means it is a nonsquare.

For $p=11$, $a=3$, the count $N=2$ gives $(3/11)=1$. For $a=2$, the half-table is $2,4,6,8,10$. Three entries lie above $11/2$, giving $(2/11)=-1$. For $a=-1$, every least positive representative is $p-j$ with $1\le j\le m$, so all $m$ lie in the upper half. We recover $(-1/p)=(-1)^m$.

The proof compares products rather than sums because multiplication by $a$ naturally contributes the power $a^m$. The permutation of absolute values makes the factorial common to both sides. This is a recurring proof design: arrange a transformation so its global effect is visible in one invariant, and cancel everything that has merely been permuted.

## The second supplementary law: the status of two

Apply Gauss's lemma to $a=2$. The integers $2,4,\ldots,2m=p-1$ already lie between $1$ and $p-1$, so no reduction is required. The entry $2j$ exceeds $p/2$ precisely when $j>p/4$. Therefore

$$
N=m-\lfloor p/4\rfloor.
$$

We need only its parity. Write the odd prime in one of the forms $8k+1,8k+3,8k+5,8k+7$. In these cases, respectively, $N$ is $2k,2k+1,2k+1,2k+2$. The sign is therefore positive for residues $1,7$ modulo $8$ and negative for residues $3,5$ modulo $8$.

The compact formula is

$$
\boxed{\left(\frac2p\right)=(-1)^{(p^2-1)/8}.}
$$

The exponent is an integer because the square of every odd integer is congruent to $1$ modulo $8$. To check that its parity matches the table, substitute $p=8k+r$ and reduce the exponent modulo two. The table is often easier to remember conceptually: two is a square exactly for primes congruent to $\pm1$ modulo $8$.

For $p=17$, the answer is positive, and $6^2=36\equiv2$. For $p=19$, it is negative. For $p=23$, it is positive, and $5^2=25\equiv2$. This law covers an even numerator that cannot be handled directly by reciprocity between odd primes.

Together, the two supplementary laws allow us to remove a negative sign and all powers of two from any nonzero numerator before applying reciprocity to its odd part. They are integral components of the computational method, not exceptional cases to ignore.

## A parity formula involving floors

To prove reciprocity, we want a version of Gauss's lemma that is symmetric in two positive odd integers. Fix an odd positive integer $a$ coprime to the odd prime $p$. For $1\le j\le m$, use ordinary division to write

$$
aj=pq_j+r_j,\qquad
q_j=\left\lfloor\frac{aj}{p}\right\rfloor,
\qquad1\le r_j\le p-1.
$$

Let $N$ count the $r_j$ in the upper half. Replace each such $r_j$ by $p-r_j$, leaving lower-half entries unchanged. The resulting positive integers are a permutation of $1,\ldots,m$, as in Gauss's lemma. Let $T$ be the sum of the new positive values that came from upper-half entries.

The original residues then have total

$$
\sum_{j=1}^m r_j=\sum_{j=1}^m j+Np-2T.
$$

Indeed, an upper-half residue is $p-u$ rather than its positive absolute representative $u$, changing the total by $p-2u$. Summing these changes gives the displayed identity.

On the other hand, summing $aj=pq_j+r_j$ gives

$$
a\sum_{j=1}^m j=p\sum_{j=1}^m q_j+\sum_{j=1}^m r_j.
$$

Reduce both expressions modulo two. Since $a$ and $p$ are odd, the second identity says $\sum r_j\equiv\sum j-\sum q_j\pmod2$. The first says $\sum r_j\equiv\sum j+N\pmod2$. Subtracting gives $N\equiv\sum q_j\pmod2$; minus and plus agree modulo two.

Combining with Gauss's lemma yields the floor-sum formula

$$
\boxed{\left(\frac ap\right)=
(-1)^{\sum_{j=1}^{(p-1)/2}\lfloor aj/p\rfloor}}
\qquad(a\text{ positive and odd},\ p\nmid a).
$$

This formula is sometimes called Eisenstein's version of Gauss's lemma. The oddness of $a$ was used in the parity comparison. For an even numerator the displayed exponent need not give the right answer. That is why we proved the supplementary law for two separately instead of applying this formula indiscriminately.

## Lattice points in a rectangle prove reciprocity

Let $p,q$ be distinct odd primes. Put $m=(p-1)/2$ and $n=(q-1)/2$. Define

$$
A=\sum_{i=1}^{m}\left\lfloor\frac{qi}{p}\right\rfloor,
\qquad
B=\sum_{j=1}^{n}\left\lfloor\frac{pj}{q}\right\rfloor.
$$

The floor-sum formula gives $(q/p)=(-1)^A$ and $(p/q)=(-1)^B$. We will prove the exact integer equality $A+B=mn$.

Consider all integer-coordinate points $(i,j)$ with $1\le i\le m$ and $1\le j\le n$. There are $mn$ such points. The line $q i=p j$ contains none of them. If it contained one, primality and distinctness would imply $p\mid i$ and $q\mid j$, impossible in these ranges.

For a fixed $i$, the positive integers $j$ satisfying $p j<q i$ are exactly $1,\ldots,\lfloor qi/p\rfloor$. The upper endpoint does not exceed $n$, because $qi/p<q/2$ and the floor is at most $(q-1)/2$. Thus $A$ counts the rectangle's points strictly below the line $j=(q/p)i$.

For a fixed $j$, the positive integers $i$ satisfying $q i<p j$ are exactly $1,\ldots,\lfloor pj/q\rfloor$, all within the permitted horizontal range. Thus $B$ counts the points strictly above the same line. Every point lies on exactly one side, so $A+B=mn$.

Finally,

$$
\left(\frac qp\right)\left(\frac pq\right)
=(-1)^{A+B}=(-1)^{mn}
=(-1)^{((p-1)/2)((q-1)/2)}.
$$

This completes the proof of quadratic reciprocity. The apparent relationship between two different finite fields was obtained by comparing two counts in one ordinary integer rectangle. No unproved cyclicity statement, analytic estimate or geometric intuition was substituted for the count: the bijection between floors and points supplied the rigorous bridge.

## Inspect the whole proof with small primes

Take $p=7$ and $q=11$. Then $m=3$, $n=5$, and

$$
A=\lfloor11/7\rfloor+\lfloor22/7\rfloor+\lfloor33/7\rfloor
=1+3+4=8.
$$

The other sum is

$$
B=\lfloor7/11\rfloor+\lfloor14/11\rfloor+
\lfloor21/11\rfloor+\lfloor28/11\rfloor+\lfloor35/11\rfloor
=0+1+1+2+3=7.
$$

Their sum is $15=mn$. Consequently $(11/7)=1$ and $(7/11)=-1$, and their product is $-1$ because both primes are $3$ modulo $4$. The first calculation also reduces to $(4/7)=1$. The second can be checked from the nonzero square table modulo $11$.

Now take $p=5$, $q=13$. Here $m=2$, $n=6$, so $mn$ is even. The law predicts equal signs. Since $(13/5)=(3/5)=-1$, we obtain $(5/13)=-1$ without building the whole table modulo $13$.

A mistake to avoid is swapping the two symbols and always changing the sign. The sign changes only when both odd primes are $3$ modulo $4$. Another mistake is reducing a denominator. Numerator reduction is permitted: $(13/5)=(3/5)$. Replacing the denominator $13$ by $3$ in $(5/13)$ would mean asking a different question and is not a valid simplification.

## An efficient Legendre-symbol calculation

Suppose we want $(123/211)$. The denominator $211$ is prime. Factor the numerator as $123=3\cdot41$, then use multiplicativity. For the first factor, both $3$ and $211$ are $3$ modulo $4$, so

$$
\left(\frac3{211}\right)=-\left(\frac{211}{3}\right)
=-\left(\frac13\right)=-1.
$$

For the second factor, $41\equiv1\pmod4$, so there is no reciprocity sign:

$$
\left(\frac{41}{211}\right)=\left(\frac{211}{41}\right)
=\left(\frac6{41}\right)
=\left(\frac2{41}\right)\left(\frac3{41}\right).
$$

Since $41\equiv1\pmod8$, the first symbol is $1$. Reciprocity for $3$ and $41$ has positive sign because $41\equiv1\pmod4$, giving $(3/41)=(41/3)=(2/3)=-1$. Thus $(41/211)=-1$ and the original symbol is $(-1)(-1)=1$.

This proves that $123$ has a square root modulo $211$, but the symbol calculation itself has not found one. A separate finite search gives $40$: its square is $1600$, and $1600-7\cdot211=123$. The other root is $-40\equiv171$. This verification supplies actual roots in addition to the existence verdict. The distinction remains important for large primes, where root extraction uses its own algorithm. The companion separates the symbol and root-list outputs so the two tasks can be inspected independently.

## A factorization-free Jacobi algorithm

The preceding calculation factored the numerator into small primes. There is another method that imitates Euclid's algorithm and avoids complete factorization. For an odd positive denominator $n$, the Jacobi symbol obeys numerator reduction, multiplicativity, the supplementary law for two, and reciprocity for positive odd coprime numerators and denominators. We justify this extension before using it.

Write $n=\prod p_i^{e_i}$. The minus-one law multiplies over prime factors. The parity of $\sum e_i(p_i-1)/2$ equals $(n-1)/2$ modulo two, because for odd integers $u,v$,

$$
\frac{uv-1}{2}\equiv\frac{u-1}{2}+\frac{v-1}{2}\pmod2.
$$

The corresponding parity identity for the two-law is

$$
\frac{(uv)^2-1}{8}\equiv
\frac{u^2-1}{8}+\frac{v^2-1}{8}\pmod2,
$$

since the omitted product term is even. Thus both supplementary laws extend to odd composite denominators.

For positive odd coprime $a,n$, factor each into primes and apply prime reciprocity to every pair. The total sign exponent is the product of the two parity sums, giving

$$
\left(\frac an\right)=
(-1)^{((a-1)/2)((n-1)/2)}\left(\frac na\right).
$$

This proof uses factorization to establish the law, but an algorithm can use the resulting law without knowing either factorization. That separation between proof and computation is useful: a theorem can justify an efficient procedure even if its proof describes data the procedure never calculates.

To compute the symbol, reduce the numerator modulo the odd denominator. Remove powers of two, updating a running sign according to the denominator modulo eight. If the remaining numerator is one, stop. Otherwise swap numerator and denominator, changing the sign only if both are three modulo four, and reduce again. The positive denominator decreases after a swap-and-reduction, so the process terminates. If it reaches numerator zero with denominator greater than one, the original gcd was not one and the symbol is zero.

For $(1001/9907)$, both numbers are odd and $1001\equiv1\pmod4$, so swapping gives $(9907/1001)=(898/1001)$. Remove $898=2\cdot449$. Since $1001\equiv1\pmod8$, the factor of two contributes $1$. Swap again without a sign because $449\equiv1\pmod4$, giving $(1001/449)=(103/449)$. Swap with positive sign because $449\equiv1\pmod4$, obtaining $(449/103)=(37/103)$. Swap again with positive sign because $37\equiv1\pmod4$, obtaining $(103/37)=(29/37)$. Another swap gives $(37/29)=(8/29)$. There are three factors of two, and $(2/29)=-1$ because $29\equiv5\pmod8$. The final value is $-1$.

Because this is a Jacobi calculation, the negative result proves that $1001$ cannot be a square modulo $9907$, whether or not the denominator was known to be prime. A positive result would not by itself have proved a square root exists.

## Congruence criteria for small numerators

Quadratic reciprocity turns the status of a fixed small numerator into congruence conditions on the prime denominator. Consider $3$. For an odd prime $p\ne3$,

$$
\left(\frac3p\right)=(-1)^{(p-1)/2}\left(\frac p3\right).
$$

The second factor is $1$ when $p\equiv1\pmod3$ and $-1$ when $p\equiv2\pmod3$. Combining with the sign from $p$ modulo four produces a rule modulo twelve. The permitted prime classes are $1,5,7,11$ modulo twelve. The resulting signs are respectively $1,-1,-1,1$. Thus $3$ is a square precisely when $p\equiv\pm1\pmod{12}$.

For $5$, reciprocity has no sign because $5\equiv1\pmod4$. Therefore $(5/p)=(p/5)$. The nonzero squares modulo five are $1,4$, so $5$ is a square modulo an odd prime $p\ne5$ exactly when $p\equiv1$ or $4\pmod5$. This gives information about infinitely many possible prime denominators through a four-entry residue table.

For $-2$, multiply the supplementary laws:

$$
\left(\frac{-2}{p}\right)=
\left(\frac{-1}{p}\right)\left(\frac2p\right).
$$

Checking the four odd classes modulo eight gives positive values for $p\equiv1,3\pmod8$ and negative values for $p\equiv5,7\pmod8$. Such conditions later guide questions about representation by forms like $x^2+2y^2$. They are modular obstructions, but we must not assume they automatically prove every global representation theorem.

## Local restrictions on integer equations

If an integer equation $x^2=ay^2+b$ has a solution, reducing modulo any prime produces a necessary congruence condition. Quadratic residues can therefore prove impossibility. For example, the equation $x^2=3y^2+2$ has no solution with $y$ divisible by $5$: reducing modulo five would give $x^2\equiv2$, a nonsquare. More broadly, reducing modulo three gives $x^2\equiv2$, so in fact the equation has no integer solution at all. The stronger obstruction makes the conditional one unnecessary, but checking both illustrates the search for a useful modulus.

A more interesting example is $x^2+y^2=3z^2$ with integers $x,y,z$. Modulo three, the only squares are zero and one. Their sum is zero only if both are zero, so three divides both $x$ and $y$. Substituting $x=3u$, $y=3v$ gives $3u^2+3v^2=z^2$, forcing three to divide $z$ as well. Dividing the original equation by nine yields a smaller solution of the same form. Choosing a nonzero solution with smallest positive $|z|$ produces a contradiction. Thus only the all-zero solution exists.

This last argument combines a local congruence obstruction with infinite descent. Congruences did not immediately forbid a solution; they forced every solution to have a common factor. Descent then showed that a nonzero solution would imply an endlessly smaller one, impossible among positive integers. The proof resembles the termination arguments behind Euclid, but the decreasing object is a hypothetical solution rather than an algorithmic remainder.

The converse principle, that a solution modulo every modulus guarantees an integer solution, is false for arbitrary polynomial equations. The course will not use such a principle without a precise theorem. Local information is powerful, but recognizing the logical direction is essential: an integer solution always produces local solutions; the reverse is a separate and often difficult problem.

## A worked classification for the numerator six

Combining small-symbol laws is a good way to practice using a theorem as a tool rather than memorizing isolated answers. We will classify the odd primes $p$ other than three for which six is a square. Multiplicativity gives $(6/p)=(2/p)(3/p)$. The first factor depends on the prime modulo eight; the second depends on the prime modulo twelve. Both can be determined from the prime modulo twenty-four, the least common multiple of eight and twelve.

An odd prime other than three belongs to one of the eight invertible classes modulo twenty-four. Checking the two already proved rules gives the following table.

| $p\bmod24$ | $1$ | $5$ | $7$ | $11$ | $13$ | $17$ | $19$ | $23$ |
|---|---|---|---|---|---|---|---|---|
| $(2/p)$ | $1$ | $-1$ | $1$ | $-1$ | $-1$ | $1$ | $-1$ | $1$ |
| $(3/p)$ | $1$ | $-1$ | $-1$ | $1$ | $1$ | $-1$ | $-1$ | $1$ |
| $(6/p)$ | $1$ | $1$ | $-1$ | $-1$ | $-1$ | $-1$ | $1$ | $1$ |

Thus six is a square precisely when $p$ is congruent to $1,5,19$ or $23$ modulo twenty-four. For a concrete check, $p=29$ lies in class five, and $8^2=64\equiv6\pmod{29}$. The prime thirty-one lies in class seven, so six is not a square modulo thirty-one. We can establish that negative answer without a search through possible roots.

Nothing in this argument says how frequently primes occur in the eight classes. The table is a conditional classification: if the prime lies in a given class, its square status is determined. Questions about how many primes occur in a class require additional theorems. In particular, the fact that four of eight allowable classes give a positive sign should not be presented as a proved density statement merely by counting the table columns.

This distinction is an example of a broader mathematical habit. Classification, existence and distribution are different tasks. Reciprocity supplies a classification for the square-status question. A particular modular calculation supplies existence of a root. Prime-distribution results address how often the denominator falls into the relevant classes. Keeping the tasks separate makes both proofs and conclusions more precise.

## Infinitely many primes congruent to one modulo four

The law for minus one yields an elementary infinitude theorem. Suppose, seeking a contradiction, that the complete list of primes congruent to one modulo four were $p_1,\ldots,p_r$. Let $P$ be their product, with the empty product interpreted as one if needed, and form

$$
M=(2P)^2+1.
$$

This is an odd integer greater than one, so it has an odd prime divisor $q$. Modulo that divisor, $(2P)^2\equiv-1$. Also $q$ cannot divide $2P$, because then it would divide both $M$ and $(2P)^2$ and therefore divide one. Thus minus one is a nonzero square modulo $q$. The supplementary law forces $q\equiv1\pmod4$.

But no listed prime divides $M$: each listed prime divides $P$, so $M\equiv1$ modulo that prime. The divisor $q$ is therefore a new prime in the supposedly complete list's congruence class. This contradiction proves infinitely many such primes exist.

Notice why we did not claim that $M$ itself is prime. Euclid-style arguments rarely need the constructed number to be prime. They need a prime divisor with a controlled property. Here every odd prime divisor of $M$ has the desired class because minus one becomes a square at each one. The theorem is stronger than an accidental sequence of prime-valued examples and weaker than a claim that the displayed polynomial always takes prime values.

A related elementary proof gives infinitely many primes congruent to three modulo four. If their list were finite with product $Q$, consider $4Q-1$. None of the listed primes divides this number, and its prime factorization must contain a prime congruent to three modulo four to an odd exponent; otherwise every prime factor would contribute one modulo four overall. That new prime contradicts completeness. This proof uses multiplication of congruence classes rather than quadratic reciprocity, illustrating that different infinitude questions can call for different invariants.

## An infinitude theorem using the minus-two law

We can go one step further and prove infinitely many primes congruent to three modulo eight. Suppose the complete list were $q_1,\ldots,q_s$, and let $Q$ be their product. All listed primes are odd, so $Q$ is odd. Form

$$
M=2Q^2+1.
$$

Every odd square is one modulo eight, so $M\equiv3\pmod8$. Let $r$ be any prime divisor of $M$. This divisor is odd, and it does not divide $Q$. From $2Q^2\equiv-1\pmod r$, multiply by two to obtain $(2Q)^2\equiv-2\pmod r$. Therefore minus two is a square modulo $r$.

The supplementary-law computation gave $(-2/r)=1$ exactly for prime classes one and three modulo eight. Consequently every prime divisor of $M$ is in one of those two classes. Products of such classes are again one or three; each factor in class three changes between the two possibilities, because $3^2\equiv1\pmod8$. Since $M$ is three modulo eight, at least one prime divisor is three modulo eight to an odd exponent.

No listed prime can divide $M$, because each divides $Q$ and hence leaves $M\equiv1$. We have found a new prime congruent to three modulo eight, contradicting the assumed completeness. This proves the infinitude theorem using only the supplementary laws and prime factorization.

The argument carefully controls all prime divisors of the constructed number before extracting one of the desired kind. Without that control, knowing $M\equiv3\pmod8$ alone would not force a divisor in class three: for example, a product of a class-five factor and a class-seven factor is also class three. The residue law excluded those unwanted possibilities. This is exactly the extra arithmetic information that makes the proof work.

## Reciprocity as a terminating symbolic procedure

It is useful to state the computational invariant behind the Jacobi procedure in plain language. At every stage, keep a running sign $s$ and a current symbol $(a/n)$ such that the original answer equals $s(a/n)$. Numerator reduction leaves the current symbol unchanged. Removing a factor of two multiplies the running sign by the known two-symbol. Swapping odd coprime arguments multiplies the sign by the reciprocity correction. Each step preserves the invariant.

Termination is a separate obligation. After reducing, arrange $0\le a<n$. Removing powers of two can only decrease a positive numerator. If the remaining odd numerator is greater than one, swap it into the denominator. The new denominator is strictly smaller than the old one. A strictly decreasing sequence of positive integers must terminate, so the procedure cannot loop forever. This is the same logical engine as the Euclidean algorithm, now carrying an additional sign.

At a terminal numerator one, the current symbol is one, so the running sign is the answer. At numerator zero, the current symbol is zero unless the denominator has already become one. The gcd interpretation explains that case: the original numerator and denominator shared a factor. An implementation may define the auxiliary convention $(a/1)=1$ to handle the final successful step uniformly, but that convention should be declared because the introductory definition used denominators greater than one.

There is no need to test primality of intermediate denominators. They are Jacobi denominators, so the proved composite-denominator laws apply. This is one of the algorithm's strengths. But if the final task is to infer a square root exists, the original denominator still needs to be prime, or else local information must be recovered separately. A correct symbolic algorithm can compute a quantity perfectly while that quantity remains insufficient for a different inference.

## Diagnose three plausible-looking false arguments

First consider the statement: “Reciprocity says $(p/q)=(q/p)$, and both primes are odd, so their square statuses agree.” The missing sign is not cosmetic. For $p=3$, $q=7$, both primes are three modulo four. The squares modulo seven are one, two and four, so three is a nonsquare; but seven reduces to one modulo three, a square. This smallest kind of counterexample pinpoints exactly the omitted hypothesis for equal signs.

Second consider: “The Jacobi symbol is one, so the numerator is a square.” The pair two and fifteen refutes this. Both local Legendre symbols are minus one, whose product is one. The error is confusing a compressed product of local signs with the full list of signs. Restoring the list repairs the argument: a unit is a square modulo a squarefree odd modulus only when every local sign is positive.

Third consider: “The floor-sum proof works for any numerator, so it also proves the two-law with the same exponent.” The parity proof explicitly used that the numerator was odd when reducing $a\sum j$ modulo two. If the numerator is even, that step changes. For example, with numerator two and denominator seven, the floors $\lfloor2/7\rfloor$, $\lfloor4/7\rfloor$, $\lfloor6/7\rfloor$ all vanish, accidentally giving the right positive sign; with denominator five they again vanish, incorrectly giving a positive sign instead of the actual negative one. A formula can survive one test input and still fail generally. Tracing hypotheses through the proof is more reliable than trusting a few experiments.

## The same law describes splitting of quadratic algebras

There is an algebraic way to read the residue symbol that connects this chapter to ring quotients. Fix a nonzero $a$ modulo an odd prime $p$ and consider $\mathbb F_p[X]/(X^2-a)$. Every element has a unique representative $u+vX$, because polynomial division reduces the degree below two. There are therefore $p^2$ elements. What kind of ring is it?

If $a$ is a nonsquare, the polynomial has no root and, being quadratic, is irreducible. The ideal it generates is maximal in the PID $\mathbb F_p[X]$. The quotient is consequently a field. The construction creates a number system in which the class of $X$ is a square root of $a$, even though no such root existed in the original field. We have not yet needed the general classification of finite fields to verify this particular construction.

If $a=r^2$ with $r\ne0$, the polynomial factors as $(X-r)(X+r)$ with distinct roots. Define a map from the polynomial ring to $\mathbb F_p\times\mathbb F_p$ by evaluating at these two roots. Its kernel consists of polynomials divisible by both linear factors, hence by their product. One can see surjectivity explicitly: for any desired outputs $u,v$, the linear polynomial

$$
\frac{u+v}{2}+\frac{u-v}{2r}X
$$

has values $u$ at $r$ and $v$ at $-r$. All displayed divisions are legitimate because $p$ is odd and $r$ is nonzero. The first isomorphism theorem now gives a ring isomorphism from the quadratic quotient to the product of two copies of $\mathbb F_p$.

This product is not a field. The nonzero elements $(1,0)$ and $(0,1)$ multiply to zero. Thus the two possible nonzero Legendre-symbol values distinguish two genuinely different algebraic structures: a field when the polynomial is irreducible, and a split product when it has its two roots already in the ground field. The case $a=0$ would be a third structure with a nonzero element whose square is zero, which is why it was excluded from this two-case discussion.

For distinct odd primes $p,q$, reciprocity therefore compares whether the quadratic algebra defined by $X^2-q$ splits over $\mathbb F_p$ and whether the algebra defined by $X^2-p$ splits over $\mathbb F_q$. For $p=7,q=3$, the first is a field because three is a nonsquare modulo seven. The second splits because seven reduces to one modulo three. Their different behavior is the reciprocity sign when both primes are three modulo four.

This viewpoint does not replace the elementary proof. It interprets the theorem after the proof has been established, showing why a question about square residues is also a question about ideals, quotient rings and field extensions. Later Galois theory develops this relationship between polynomial roots and algebraic structure much further.

The quadratic quotient also gives a precise interpretation of a “new square root.” In the irreducible case, its class $\theta=[X]$ satisfies $\theta^2=a$ by the defining ideal relation, and it cannot equal a constant class: that would exhibit a square root in the original field. Every element is uniquely $u+v\theta$, and multiplication reduces $\theta^2$ back to $a$. For instance, over the field with seven elements, adjoining a root of $X^2-3$ yields forty-nine elements, and the product $(2+\theta)(2-\theta)$ equals $4-3=1$. Thus $2-\theta$ is an explicit inverse of $2+\theta$.

In the split case the same formal relation does not create a field, because the two possible original roots coexist as different evaluation coordinates. The distinction between an expression satisfying a polynomial relation and a field obtained by adjoining an algebraic root is therefore controlled by irreducibility. This is why field-extension chapters insist on a minimal irreducible polynomial, rather than quotienting by an arbitrary polynomial and assuming the result remains a field. Quadratic reciprocity supplies an unusually elegant way to decide this irreducibility question for an entire family of quadratic polynomials.

## What the reciprocity proof teaches beyond its formula

The proof introduced an auxiliary object, a signed half-table, that was not present in the original problem. That object preserved square status through a product comparison. A second auxiliary object, a lattice rectangle, made the symmetry between two primes visible. Each object was chosen because it exposed a feature difficult to see directly in the equation $x^2\equiv a$.

This is a useful model for proof construction. When two arithmetic expressions seem related, look for a common object counted or transformed in two ways. The most productive object may involve more variables or a larger ambient structure. The extra structure is not decorative: it is the bridge that allows one theorem to speak to another.

The final sign is also more meaningful when traced to its source. It is the parity of the number of points in the rectangle, $((p-1)/2)((q-1)/2)$. That product is odd precisely when both side lengths are odd, which is precisely when both primes are three modulo four. The familiar sign rule is therefore a compressed record of a concrete counting argument.

## Optional practice and companion connection

Use the residues experiment in the [companion](../companion/index.html) to compare $(p/q)$ and $(q/p)$ for several prime pairs. A finite list checks examples; the half-table and lattice arguments prove the general law.

1. Apply Gauss's lemma directly to compute $(3/13)$, listing the half-table and upper-half count.
2. Compute $(2/31)$ and $(-2/31)$ using the supplementary laws.
3. For $p=5$, $q=7$, compute both floor sums and verify that their sum is $((p-1)/2)((q-1)/2)$.
4. Use reciprocity to compute $(7/19)$ and $(19/7)$, explaining the sign change.
5. Determine $(123/211)$ by the steps in the chapter, then find an actual square root by a finite search.
6. Derive the congruence criterion for $(3/p)=1$ without memorizing a table.
7. Calculate the Jacobi symbol $(8/29)$ and explain why the two-law applies to each factor of two.
8. Prove by infinite descent that $x^2+y^2=3z^2$ has no nonzero integer solution.

See [Chapter 18 solutions](../solutions/18-solutions.md) for hints and full arguments. The next chapter changes viewpoint from individual congruences to functions on all positive integers, while retaining the same themes of multiplicativity, prime factorization and structural compression.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](17-quadratic-residues.md) · [Next chapter](19-arithmetic-functions.md) · [Hints and solutions](../solutions/18-solutions.md)
