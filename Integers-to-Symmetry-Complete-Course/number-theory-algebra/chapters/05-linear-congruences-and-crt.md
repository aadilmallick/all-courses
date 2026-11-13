# Chapter 05 — Linear congruences and the Chinese remainder theorem

## 1. Two clocks, one integer

Suppose a quantity leaves remainder $2$ when divided by $3$ and remainder $3$ when divided by $5$. Can both observations describe the same integer? The integer $8$ works, as do $23$, $38$, and every integer obtained from $8$ by adding a multiple of $15$. Why should all solutions form exactly one class modulo $15$?

Now change the conditions to remainder $2$ modulo $6$ and remainder $4$ modulo $9$. A quick search finds no solution. Is that because we have not searched far enough, or because the conditions contradict each other? A useful theorem should tell us which situation we are in and provide a construction whenever the data are compatible.

The Chinese remainder theorem solves this simultaneous-remainder problem. It is also a statement about how a larger arithmetic system decomposes into smaller ones. Before proving it, we will solve every linear congruence $ax\equiv b\pmod n$ and count its solution classes exactly. The gcd and Bezout identities from Chapter 02 will do most of the work.

This chapter is a major meeting point of number theory and algebra. A concrete reconstruction algorithm will lead to a bijection that preserves addition and multiplication. Later we will recognize such bijections as isomorphisms and generalize the theorem to quotient rings.

## 2. Turning a congruence into an integer equation

The congruence $ax\equiv b\pmod n$ means $n\mid ax-b$. Thus there exists an integer $k$ such that $ax-b=nk$, or equivalently

$$
ax+ny=b
$$

for an integer $y=-k$. We have converted a congruence in one unknown into a linear Diophantine equation in two integer unknowns.

Chapter 02 already gives the existence criterion. If $d=\gcd(a,n)$, then

$$
ax\equiv b\pmod n\text{ is solvable}\quad\Longleftrightarrow\quad d\mid b.
$$

For necessity, every expression $ax+ny$ is divisible by $d$. For sufficiency, choose $u,v$ with $au+nv=d$ and multiply by $b/d$. The value $x=u(b/d)$ is a solution.

For example, $18x\equiv7\pmod{30}$ is impossible because $\gcd(18,30)=6$ does not divide $7$. By contrast, $18x\equiv12\pmod{30}$ is possible because $6\mid12$. This is an exact test, not a heuristic about whether a solution seems likely.

The multiplier $a$ may be negative or zero. The gcd is nonnegative and the criterion remains valid. When $a=0$, it says the congruence is solvable exactly when $n\mid b$; if so, every class of $x$ works. We will keep this boundary case visible when counting solutions.

## 3. Reducing a solvable linear congruence

Assume $d\mid b$, and write $a=da'$, $n=dn'$, $b=db'$. Then

$$
ax\equiv b\pmod n\quad\Longleftrightarrow\quad a'x\equiv b'\pmod{n'}.
$$

This follows by canceling the common factor in the divisibility statement $dn'\mid d(a'x-b')$. The modulus changes from $n$ to $n'=n/d$. Keeping the old modulus would generally change the solution set.

The reduced coefficient and modulus are coprime. Therefore $a'$ has an inverse modulo $n'$ whenever $n'\geq2$, and the reduced congruence has exactly one solution class modulo $n'$. If that class is $[x_0]_{n'}$, all integer solutions are

$$
x=x_0+n't,\qquad t\in\mathbb Z.
$$

If $n'=1$, the reduced condition imposes no restriction: every integer is congruent to every other modulo $1$. We normally use moduli at least two, but this explicitly identified boundary system is convenient here. It has one class, and the original congruence then either has all classes as solutions or none, according to the gcd test.

For $18x\equiv12\pmod{30}$, divide by $6$ to get $3x\equiv2\pmod5$. The inverse of $3$ modulo $5$ is $2$, so $x\equiv4\pmod5$. Every integer $4+5t$ solves the original condition. The next step is to count how many distinct classes this represents modulo $30$.

## 4. Why the number of solutions is the gcd

A solvable congruence $ax\equiv b\pmod n$ has exactly $d=\gcd(a,n)$ distinct solution classes modulo $n$. From the preceding section, its integer solutions are $x=x_0+(n/d)t$. Take $t=0,1,\ldots,d-1$. These give $d$ classes modulo $n$.

They are distinct: if the values for $s,t$ are congruent modulo $n$, then

$$
n\mid\frac nd(s-t),
$$

which is equivalent to $d\mid s-t$. With $0\leq s,t<d$, this forces $s=t$. They also exhaust all possibilities, because replacing $t$ by $t+d$ adds $n$ to $x$, leaving its class unchanged. The division algorithm reduces every parameter to one of these $d$ choices.

In the example $18x\equiv12\pmod{30}$, the six solution classes have representatives

$$
4,9,14,19,24,29.
$$

Each class contains infinitely many integer solutions differing by $30$. The six classes together are also the single class $[4]_5$ when viewed with the smaller modulus. There is no contradiction: the modulus determines which distinctions are retained.

If $a=0$ and $n\mid b$, then $d=\gcd(0,n)=n$, and the theorem correctly counts all $n$ classes. A statement that the answer is always “one solution” usually overlooks the distinction between the reduced modulus and the original one.

## 5. A worked inverse calculation

Solve

$$
14x\equiv30\pmod{100}.
$$

The gcd is $2$, so the congruence is solvable and has two classes modulo $100$. Divide the coefficient, right side and modulus by $2$:

$$
7x\equiv15\pmod{50}.
$$

To invert $7$ modulo $50$, use $50=7\cdot7+1$. Rearranging gives $1=50-7\cdot7$, so $-7\equiv43\pmod{50}$ is the inverse of $7$. Multiply the reduced congruence by $43$:

$$
x\equiv43\cdot15=645\equiv45\pmod{50}.
$$

Thus the solution classes modulo $100$ are $[45]$ and $[95]$. Checking against the original equation gives $14\cdot45=630\equiv30$ and $14\cdot95=1330\equiv30\pmod{100}$.

Every step has a separate justification. The gcd criterion establishes existence and count. Divisibility permits reducing the modulus. Bezout produces an inverse. Multiplication by an inverse is reversible, so it gives a complete solution rather than just a candidate. Finally, substituting the two representatives catches arithmetic slips.

The order of these tasks matters for clear reasoning. It is possible to guess a solution first, but a complete answer should still explain why no other classes are missing. Counting alone is not enough either: knowing there are two roots does not identify them without a construction or search.

## 6. The map behind the counting theorem

Fix $a$ and consider the function on residue classes modulo $n$ that sends $[x]$ to $[ax]$. Its zero-output inputs satisfy $ax\equiv0\pmod n$. There are exactly $d=\gcd(a,n)$ of them, represented by

$$
0,\frac nd,2\frac nd,\ldots,(d-1)\frac nd.
$$

If $x_0$ maps to some attainable output $[b]$, then every other preimage differs from $x_0$ by a zero-output input. Indeed, $ax\equiv ax_0$ exactly when $a(x-x_0)\equiv0$. Thus every attainable output has the same number $d$ of preimages.

There are $n$ total input classes, divided into equal groups of $d$, so there are $n/d$ distinct outputs. These outputs are exactly the classes represented by multiples of $d$, matching the existence criterion $d\mid b$.

For multiplication by $4$ modulo $12$, the zero-output classes are $[0],[3],[6],[9]$. The image consists of $[0],[4],[8]$, and each output has four preimages. This is a concrete structural explanation of failed cancellation: multiplying by $4$ merges classes into four-element blocks.

Later the zero-output set will be called a kernel, and the output set an image. We have not needed the terminology to understand the mechanism. When the general group homomorphism theorem arrives, this example will make its counting and quotient statements familiar.

## 7. Two coprime moduli: existence by construction

Let $m,n\geq2$ be coprime, and prescribe integers $a,b$. We want

$$
x\equiv a\pmod m,\qquad x\equiv b\pmod n.
$$

Bezout supplies integers $u,v$ satisfying $um+vn=1$. Consider

$$
x_0=a(vn)+b(um).
$$

Modulo $m$, the term $um$ vanishes and $vn\equiv1$, so $x_0\equiv a$. Modulo $n$, the term $vn$ vanishes and $um\equiv1$, so $x_0\equiv b$. This explicitly constructs a solution for every pair of desired remainders.

For the opening example, $m=3,n=5$, and $2\cdot3-1\cdot5=1$. Thus $u=2,v=-1$, giving $x_0=2(-5)+3(6)=8$. The negative coefficient is harmless because we ultimately care about a residue class.

The construction works by building two selector numbers. The number $vn$ looks like $1$ modulo $m$ and $0$ modulo $n$. The number $um$ looks like $0$ modulo $m$ and $1$ modulo $n$. Multiplying them by the desired data and adding installs each remainder independently.

This independence is the real content of coprimality. If the moduli share a factor, the two observations have overlapping information and cannot always be chosen independently. We will quantify that overlap after proving uniqueness in the coprime case.

## 8. Two coprime moduli: uniqueness

Suppose $x$ and $y$ satisfy the same prescribed remainders modulo coprime $m,n$. Then $m\mid x-y$ and $n\mid x-y$. Since the moduli are coprime, Chapter 02 implies $mn\mid x-y$. Therefore every solution is congruent to the constructed one modulo $mn$.

Conversely, adding a multiple of $mn$ to a solution preserves both congruences. Hence the complete solution set is exactly one class modulo $mn$.

**Chinese remainder theorem, two-modulus form.** If $m,n$ are coprime positive integers at least two, then for every pair of residue classes modulo $m$ and $n$, there is a unique residue class modulo $mn$ having those two reductions.

The word “unique” again concerns a class, not one integer. For the remainders $2$ modulo $3$ and $3$ modulo $5$, the unique class is $[8]_{15}$, with infinitely many representatives $8+15t$.

It is useful to identify exactly where each hypothesis entered. Bezout gave the selector construction because the gcd was $1$. Coprime divisibility gave uniqueness modulo the product rather than merely some common multiple. Without coprimality, existence may fail, and even when it holds the correct period is the least common multiple, not necessarily the product.

Existence and uniqueness together yield a reconstruction procedure. Either alone would be weaker: an existence proof without uniqueness might leave many possible large-modulus classes, while a uniqueness proof without existence could describe a system that has no solution at all.

## 9. Several pairwise coprime moduli

Let $n_1,\ldots,n_r$ be pairwise coprime integers at least two, and let $N=n_1\cdots n_r$. For each index $i$, set $N_i=N/n_i$. No prime divisor of $n_i$ divides any other modulus, so $\gcd(N_i,n_i)=1$. Choose an integer $u_i$ with $u_iN_i\equiv1\pmod{n_i}$.

Then the simultaneous conditions $x\equiv a_i\pmod{n_i}$ are solved by

$$
x_0=\sum_{i=1}^{r}a_i u_iN_i.
$$

Modulo a fixed $n_j$, every summand with $i\ne j$ vanishes because $N_i$ contains the factor $n_j$. The remaining summand reduces to $a_j$. Thus the construction satisfies all conditions.

For uniqueness, the difference of two solutions is divisible by every $n_i$. Pairwise coprimality implies it is divisible by their product. One can prove this by prime exponents or by repeatedly applying the coprime-divisor lemma. Therefore all solutions form one class modulo $N$.

Pairwise coprimality is stronger than saying the gcd of the entire list is $1$. For $6,10,15$, the common gcd of all three is $1$, but each pair shares a factor. Their remainder conditions are not independent. Always read “pairwise” as a condition on every two different entries, not as one condition on the whole list.

The formula is a finite sum with explicitly computable coefficients. It is not necessary to know any abstract ring theory to use it, even though its selectors will later have a useful algebraic interpretation.

## 10. A complete three-modulus reconstruction

Solve

$$
x\equiv2\pmod3,\qquad x\equiv3\pmod5,\qquad x\equiv2\pmod7.
$$

The moduli are pairwise coprime, and their product is $N=105$. The complementary products are $35,21,15$. Their inverses in the respective smaller systems are $2,1,1$, because $35\equiv2\pmod3$ and $2\cdot2\equiv1$, while $21\equiv1\pmod5$ and $15\equiv1\pmod7$.

The reconstruction formula gives

$$
x_0=2\cdot2\cdot35+3\cdot1\cdot21+2\cdot1\cdot15
=140+63+30=233.
$$

Reducing modulo $105$ gives $233-2\cdot105=23$. Therefore all solutions are $x=23+105t$, $t\in\mathbb Z$.

Check the original data: $23=3\cdot7+2$, $23=5\cdot4+3$, and $23=7\cdot3+2$. The checks confirm the construction's arithmetic. Uniqueness follows from the theorem, so checking the candidate does not need to be followed by an unbounded search for other classes.

There is another route: combine the first two conditions to get $x\equiv8\pmod{15}$, write $x=8+15t$, and impose the third condition. Then $8+15t\equiv2\pmod7$ becomes $1+t\equiv2\pmod7$, giving $t\equiv1$. This yields $x\equiv23\pmod{105}$ again. A stepwise construction can keep intermediate numbers smaller than the all-at-once formula.

## 11. The theorem as a structural bijection

Define

$$
F:\mathbb Z/(mn)\mathbb Z\longrightarrow(\mathbb Z/m\mathbb Z)\times(\mathbb Z/n\mathbb Z)
$$

by $F([x]_{mn})=([x]_m,[x]_n)$, with $m,n$ coprime. This is well-defined because a difference divisible by $mn$ is divisible by each modulus.

The CRT says that $F$ is bijective. Surjectivity is the existence statement: every pair of smaller classes has a preimage. Injectivity is uniqueness: equal pairs of smaller remainders force the original classes modulo $mn$ to agree.

On the product set, add or multiply coordinate by coordinate. Then $F$ preserves both operations:

$$
F([x]+[y])=F([x])+F([y]),\qquad F([x][y])=F([x])F([y]).
$$

These equalities follow from ordinary reduction of sums and products. Thus the correspondence is more than a bijection between two sets of equal size. It translates arithmetic exactly.

For example, modulo $15$, the class $[8]$ corresponds to $([2]_3,[3]_5)$. Squaring in the smaller systems gives $([1]_3,[4]_5)$. Reconstructing yields $[4]_{15}$, matching $8^2=64\equiv4\pmod{15}$.

This is the arithmetic meaning of decomposing a composite system into independent pieces. Abstract algebra will give the correspondence a name, an isomorphism of rings. The name records the fact that all the specified algebraic operations survive in both directions.

## 12. Selector elements and idempotents

In the two-modulus construction, let $e=vn$ and $f=um$, viewed modulo $mn$. Their coordinate descriptions are $e\leftrightarrow(1,0)$ and $f\leftrightarrow(0,1)$. Coordinate multiplication immediately suggests

$$
e^2\equiv e,\qquad f^2\equiv f,\qquad ef\equiv0,\qquad e+f\equiv1\pmod{mn}.
$$

These statements can also be checked separately modulo $m$ and $n$, then combined using uniqueness. An element satisfying $e^2=e$ is called idempotent.

Modulo $15$, choose $e=10$ and $f=6$. Then $10\equiv1\pmod3$, $10\equiv0\pmod5$, while $6\equiv0\pmod3$, $6\equiv1\pmod5$. Indeed, $100\equiv10$, $36\equiv6$, $60\equiv0$, and $16\equiv1\pmod{15}$.

Every class modulo $15$ can be reconstructed from its two smaller remainders using $x\equiv10a+6b$. The selectors separate the two coordinates without interference. Their product is zero even though neither selector is zero, exposing zero divisors through the decomposition.

In a prime-modulus system, an idempotent satisfies $e(e-1)=0$, so Euclid's lemma forces $e=0$ or $e=1$ as a class. Composite systems with independent CRT factors can have nontrivial idempotents. This is a precise structural difference between prime and composite arithmetic, expressed through a short polynomial equation.

## 13. Noncoprime moduli: the compatibility condition

Now allow $m,n$ to share a factor, and let $d=\gcd(m,n)$. If an integer satisfies $x\equiv a\pmod m$ and $x\equiv b\pmod n$, then reducing both conditions modulo $d$ gives $x\equiv a\equiv b\pmod d$. Therefore

$$
a\equiv b\pmod d
$$

is necessary for existence.

It is also sufficient. Write $x=a+mt$ to satisfy the first condition automatically. The second becomes

$$
mt\equiv b-a\pmod n.
$$

The linear congruence criterion says this is solvable exactly when $d\mid b-a$, which is exactly the compatibility condition. Thus we have proved the generalized two-modulus CRT.

If solutions exist, any two differ by a number divisible by both $m$ and $n$, hence by their lcm. Conversely, adding a multiple of the lcm preserves both congruences. Therefore the full solution set is one class modulo $\operatorname{lcm}(m,n)=mn/d$.

The smaller modulus reflects overlapping information. When the moduli are coprime, there is no overlap and the period is the product. When they share a factor, the two remainder observations must agree on that shared part. Once they agree, the combined information covers one lcm-sized cycle, not a product-sized cycle.

This is an example of a general mathematical strategy: identify a necessary overlap condition, reduce the construction to a previously solved problem, and then prove that the condition is sufficient as well.

## 14. Compatible and incompatible examples

Consider

$$
x\equiv2\pmod6,\qquad x\equiv5\pmod9.
$$

The gcd is $3$, and $5-2=3$ is divisible by it, so solutions exist. Write $x=2+6t$. The second congruence becomes $6t\equiv3\pmod9$. Divide by $3$ to obtain $2t\equiv1\pmod3$, hence $t\equiv2\pmod3$.

Substitute $t=2+3s$ to get $x=14+18s$. The combined period is $18=\operatorname{lcm}(6,9)$, as the theorem predicts. Checking $14$ gives the prescribed remainders $2$ and $5$.

By contrast, the conditions $x\equiv2\pmod6$ and $x\equiv4\pmod9$ are incompatible. The first forces $x\equiv2\pmod3$, while the second forces $x\equiv1\pmod3$. No integer can have both remainders modulo $3$.

The generalized theorem also clarifies why using the product as a uniqueness modulus would be misleading. In the compatible example, the solutions $14$, $32$, and $50$ are distinct modulo $54=6\cdot9$ but share the same original remainder data. The data determine one class modulo $18$, which corresponds to three classes modulo $54$.

One can still say that all solutions have period $54$, because every multiple of $54$ is also a multiple of $18$. But $54$ is not the smallest positive period, and claiming one solution class modulo $54$ would be false.

## 15. Merging a longer list of conditions

For a longer system with arbitrary moduli, a practical method is to combine two conditions at a time using the generalized theorem. If the pair is incompatible, the whole system is impossible. If it is compatible, replace it by one condition modulo the lcm, then merge the next condition.

For example, begin with $x\equiv2\pmod6$ and $x\equiv5\pmod9$, which combine to $x\equiv14\pmod{18}$. Add $x\equiv4\pmod5$. Writing $x=14+18t$, the new condition is $4+3t\equiv4\pmod5$, so $3t\equiv0$ and $t\equiv0\pmod5$. Hence $x\equiv14\pmod{90}$.

The overall modulus is the lcm of $6,9,5$, namely $90$. Each merge preserves exactly the integers satisfying the conditions already processed. This preservation is an invariant, just as common-divisor preservation was the invariant in Euclid's algorithm.

For completeness, a finite list of congruences is solvable exactly when every pair of prescribed remainders agrees modulo the gcd of that pair's moduli. One can prove sufficiency by factoring moduli into prime powers: for each prime, choose the condition involving its highest power; pairwise compatibility guarantees that every lower-power condition agrees with that choice. The choices for distinct primes then combine by ordinary CRT.

This prime-power viewpoint is conceptually useful, but the iterative merging method does not require full factorization of the moduli. Gcd computations and linear congruence solving are enough to implement it.

## 16. Reducing polynomial equations to prime powers

Suppose $N=n_1\cdots n_r$ with pairwise coprime factors. An integer polynomial satisfies $f(x)\equiv0\pmod N$ exactly when $f(x)\equiv0\pmod{n_i}$ for every $i$. One direction follows from divisibility by each factor. The other follows because a number divisible by pairwise coprime factors is divisible by their product.

Moreover, CRT matches a residue class $x$ modulo $N$ with its tuple of classes modulo the $n_i$, and polynomial evaluation respects this matching. Therefore roots modulo $N$ correspond bijectively to independent choices of roots in the smaller systems.

For $x^2\equiv1\pmod{15}$, solve modulo $3$ and modulo $5$. Each prime system has the two roots $1,-1$. The four possible pairs give four classes modulo $15$: $1,4,11,14$. This reproduces the example from Chapter 04 while explaining why exactly four solutions occur.

The root counts multiply when the factors are coprime. If one factor has no root, the original equation has none. If one factor has several, each can be combined with each root of every other factor. This is an application of a bijection and the multiplication principle in finite counting.

Factoring a modulus into prime powers isolates the remaining difficulty. CRT separates distinct primes, but it does not by itself solve an equation modulo $p^e$. Later Hensel lifting will study how roots modulo one prime power extend to higher powers.

## 17. Square roots of one modulo odd prime powers

Let $p$ be an odd prime and $e\geq1$. We claim that the only solutions of $x^2\equiv1\pmod{p^e}$ are $x\equiv1$ and $x\equiv-1$ modulo $p^e$.

The condition says $p^e\mid(x-1)(x+1)$. A common divisor of $x-1$ and $x+1$ divides their difference $2$. Since $p$ is odd, it cannot divide both factors. Thus at most one factor contains any copies of $p$. All $e$ required copies must lie in that factor, so $p^e\mid x-1$ or $p^e\mid x+1$.

This argument uses prime exponents rather than applying Euclid's lemma incorrectly to the composite number $p^e$. If one factor is zero as an integer, the conclusion already holds. Otherwise valuation additivity gives the same reasoning formally: one of the two valuations is zero, so the other must be at least $e$.

For an odd integer $N$ with $r$ distinct prime divisors, factor it into its $r$ pairwise coprime prime-power factors. Each has exactly two roots of one, so CRT gives exactly $2^r$ roots modulo $N$. For $N=45=3^2\cdot5$, there are four roots. Solving the pairs produces representatives $1,19,26,44$.

The oddness assumption matters. Modulo $8$, there are four roots even though the modulus has only one distinct prime divisor. The two factors $x-1$ and $x+1$ can both contain powers of $2$, so the argument that separated all copies into one factor fails.

## 18. Idempotents for a general modulus

A class $[x]_N$ is idempotent when $x^2\equiv x\pmod N$, or $N\mid x(x-1)$. The consecutive integers $x$ and $x-1$ are coprime: any common divisor divides their difference $1$.

For a prime-power modulus $p^e$, all $e$ copies of $p$ must therefore lie in one factor. Hence the only idempotents modulo $p^e$ are $0$ and $1$. This works also for $p=2$, because consecutive integers cannot both be even.

If $N$ has $r$ distinct prime divisors, CRT then gives exactly $2^r$ idempotents modulo $N$, one for each independent choice of $0$ or $1$ in its prime-power coordinates. For $N=12=4\cdot3$, the four idempotents are $0,1,4,9$. Indeed, $4^2-4=12$ and $9^2-9=72$ are divisible by $12$.

The nontrivial idempotents are useful indicators of a decomposition. The class $[4]_{12}$ corresponds to $([0]_4,[1]_3)$, selecting only the modulo-$3$ component. The class $[9]_{12}$ selects the other component. Their sum is $[1]$ and their product is $[0]$.

This application distinguishes two similar-looking equations. Roots of $x^2=1$ behave exceptionally at powers of two, whereas roots of $x^2=x$ have exactly two choices for every prime power. The difference is the gcd of the factored terms: $x-1$ and $x+1$ may share $2$, while $x$ and $x-1$ never share a prime.

## 19. Reconstructing an integer from bounded information

CRT reconstructs a residue class modulo $N$. To recover one ordinary integer uniquely, we also need a size restriction specifying one representative per class. For instance, the interval $0\leq x<N$ contains exactly one integer in each class, so the combined remainders determine a unique integer in that interval.

For the three-modulus example, the conditions determine $x\equiv23\pmod{105}$. If we know $0\leq x<105$, then $x=23$. If we only know $0\leq x<300$, the possibilities are $23,128,233$. Remainder data alone do not reveal which representative was intended.

A centered interval can also be useful. If an unknown integer satisfies $-N/2<x\leq N/2$, its class modulo $N$ identifies it uniquely. Any two distinct integers in that interval differ in absolute value by less than $N$, so they cannot differ by a nonzero multiple of $N$.

This explains a practical use of many small moduli. One can compute a large integer expression separately in several small systems, combine the results, and recover the true integer once the product modulus exceeds a known bound on the possible range. The bound is essential. Without it, the reconstruction is correct only modulo the product.

The same distinction appears in digital representations: a fixed-width stored remainder may accurately encode arithmetic modulo a base power, while ordinary integer overflow means it no longer determines an unrestricted integer value.

## 20. Scheduling and repeated events

Suppose one event occurs at integer times congruent to $2$ modulo $6$, while another occurs at times congruent to $5$ modulo $9$. Their simultaneous occurrences are exactly the compatible example already solved: times $14+18t$.

If time begins at $0$, the first simultaneous occurrence is at $14$, followed by $32,50,\ldots$. The spacing $18$ is the lcm of the periods. The initial offsets determine whether simultaneous events exist and where the combined class starts; the periods alone do not settle those questions.

For comparison, events with offsets $2$ modulo $6$ and $4$ modulo $9$ never coincide. Both schedules repeat forever, and their periods have a common multiple, but the offsets conflict modulo their shared gcd. A statement such as “they must eventually meet because both schedules repeat” overlooks this overlap condition.

When using the theorem in an application, separate the integer-time model from real time. A continuous-time problem may require different methods if times are not integral multiples of one chosen unit. Here the model assumes a common discrete unit, so the modular translation is exact.

This example is useful because it makes the existence condition intuitive: schedules with periods sharing a factor also share a coarser clock. They must agree on that coarser clock before any detailed alignment is possible. The proof through $mt\equiv b-a\pmod n$ makes that intuition precise and constructive.

## Seeing the linear theorem one prime at a time

The complete linear-congruence theorem can also be recovered from prime-power pieces. Suppose $N=p_1^{e_1}\cdots p_r^{e_r}$ is the prime factorization of the modulus. CRT says that solving $ax\equiv b\pmod N$ is equivalent to solving it independently modulo each $p_i^{e_i}$. The solutions then combine bijectively.

For one prime power $p^e$ and a nonzero coefficient $a$, let $h=\min(v_p(a),e)$. Then the local gcd is $p^h$. The local equation is solvable exactly when $p^h\mid b$, and when solvable it has $p^h$ classes modulo $p^e$. Multiplying the local counts gives $\prod p_i^{h_i}=\gcd(a,N)$, exactly the earlier global count.

This does not provide a circular new proof unless the local counting result has been established separately. Its value here is structural: it explains why the gcd combines the obstructions and multiplicities from every prime in one compact integer. The direct Bezout proof was more efficient because it avoided factoring $N$ at all.

For example, consider $12x\equiv18\pmod{90}$, where $90=2\cdot9\cdot5$. Modulo $2$, both sides are zero, so either class of $x$ works. Modulo $9$, the equation is $3x\equiv0$, whose roots are $0,3,6$. Modulo $5$, it is $2x\equiv3$, with the unique root $4$. Thus there are $2\cdot3\cdot1=6$ global classes.

The direct calculation agrees: $\gcd(12,90)=6$, so divide to get $2x\equiv3\pmod{15}$. The inverse of $2$ modulo $15$ is $8$, giving $x\equiv24\equiv9\pmod{15}$. Modulo $90$, the six representatives are $9,24,39,54,69,84$. Each is divisible by $3$ and has remainder $4$ modulo $5$, while both parity choices occur.

This comparison clarifies the phrase “local-to-global” in this finite setting. The local pieces are specified prime-power divisors of one fixed modulus, and CRT proves that compatible local data combine exactly. It does not say that a polynomial equation with integer unknowns has an integer solution merely because it has solutions modulo many numbers. That much stronger issue requires separate theorems and can behave differently. Always state which global object is being reconstructed: here it is a residue class modulo a fixed finite product.

There are therefore two complementary strategies for modular problems. Use gcd and Bezout when a linear equation can be solved directly. Use prime-power decomposition when the smaller pieces reveal structure, especially for nonlinear polynomial equations. CRT explains why both viewpoints can be coordinated without changing the answer.

## 21. A reconstruction algorithm and its checks

For pairwise coprime moduli, a complete reconstruction procedure has four stages. First compute their product $N$. Next form each complementary product $N_i=N/n_i$. Then use extended Euclid to find an inverse $u_i$ of $N_i$ modulo $n_i$. Finally compute $\sum a_i u_iN_i$ and reduce it to the desired representative modulo $N$.

The procedure should check pairwise coprimality rather than silently assume it. If an inverse computation returns a gcd greater than one, the corresponding selector cannot be built by this formula. One must use the generalized compatibility method instead.

Each coefficient can be verified locally: check $u_iN_i\equiv1\pmod{n_i}$. The final result can be checked against every input remainder. These are efficient certificates for a particular execution. The proof of the theorem explains why the procedure works on all allowed data and why the result is unique as a class.

The [congruence experiment in the companion](../companion/index.html) combines two remainder conditions, including noncoprime moduli. Solve any linear equations by hand first, then enter their resulting remainder conditions to check compatibility. Use small examples where you can independently list the classes and compare them with the computed answer. In the hand calculation, check that dividing a common gcd also changes the modulus.

The companion's computations illustrate exact integer theorems within validated input ranges. They do not replace the proofs or turn toy modular examples into production cryptographic software. Chapter 09 will discuss what elementary RSA mathematics does and does not establish about an actual security system.

## 22. Common errors and the next abstraction

The most frequent linear-congruence error is canceling a common factor without changing the modulus. From $6x\equiv6\pmod{12}$, the correct reduction is $x\equiv1\pmod2$, not $x\equiv1\pmod{12}$. The original has six solution classes modulo $12$, not one.

The most frequent CRT error is replacing pairwise coprimality by a gcd-of-the-whole-list condition. Another is using the product period for noncoprime moduli and then claiming uniqueness. The generalized theorem requires compatibility modulo the gcd and gives uniqueness modulo the lcm.

A subtler error is to use a finite search that finds one representative as if it proved uniqueness for all integers. The correct uniqueness proof examines the difference between any two solutions. A solution certificate and a uniqueness argument perform different jobs.

Our next chapter begins groups. The residue classes under addition already provide examples: addition is associative, there is a zero class, and every class has an additive inverse. The invertible classes under multiplication give another example. CRT will eventually identify these structures with products of smaller structures, and the multiplication map from Section 6 will become a model for kernels and homomorphisms.

The abstraction will not erase the arithmetic. It will explain why the same arguments about inverses, equal-sized preimages and quotient classes recur in apparently different problems. We now have enough concrete examples to attach those general definitions to mathematical work we have actually performed.

A final comparison makes the pairwise condition concrete. The moduli $6,10,15$ have overall gcd $1$, yet the data $x\equiv1\pmod6$, $x\equiv3\pmod{10}$, $x\equiv3\pmod{15}$ are impossible. The first condition forces remainder $1$ modulo $3$, while the last forces remainder $0$. The condition on the middle modulus cannot repair that conflict. Testing only the overall gcd would miss it.

If instead all three prescribed remainders equal $1$, the system is compatible and reduces to $x\equiv1\pmod{30}$. To see the period directly, the difference $x-1$ must be divisible by $6,10,15$, hence by their lcm $30$. Their product is $900$, so these data would correspond to thirty distinct classes modulo $900$, all collapsing to one class modulo $30$. This example separates the size of a written product from the amount of independent information in the observations. The shared factors repeat information rather than adding a new independent coordinate.

## Optional practice

1. Solve $21x\equiv14\pmod{35}$ and list all solution classes modulo $35$.
2. Determine whether $15x\equiv8\pmod{25}$ is solvable. Explain the obstruction.
3. Solve $x\equiv1\pmod4$, $x\equiv2\pmod7$ and give the unique representative between $0$ and $27$.
4. Solve $x\equiv3\pmod8$, $x\equiv4\pmod9$, $x\equiv2\pmod5$.
5. Determine whether $x\equiv4\pmod{12}$ and $x\equiv10\pmod{18}$ are compatible. If so, describe every integer solution.
6. Find all roots of $x^2\equiv1\pmod{21}$ using CRT, rather than checking twenty-one inputs.
7. Find all idempotents modulo $20$ and explain their smaller-system coordinates.
8. Prove that if $m,n$ are coprime, a class modulo $mn$ is invertible exactly when both of its CRT coordinate classes are invertible.

[Hints and complete reference solutions](../solutions/05-solutions.md).

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](04-congruence-and-quotients.md) · [Next chapter](06-groups-and-symmetry.md) · [Hints and solutions](../solutions/05-solutions.md)
