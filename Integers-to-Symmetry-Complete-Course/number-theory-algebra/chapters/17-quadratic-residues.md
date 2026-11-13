# Chapter 17 — Quadratic residues and the Legendre symbol

## Which numbers have square roots in a finite world?

The equation $x^2=2$ has no integer solution, but modular arithmetic asks a different question. Modulo $7$, it does have solutions: $3^2=9\equiv2$ and $4^2=16\equiv2$. Modulo $5$, it has none. The phrase “$2$ has a square root” is therefore incomplete until we specify the number system. Our task is to understand this dependence systematically.

We will study squares modulo an odd prime $p$. The prime hypothesis makes $\mathbb F_p=\mathbb Z/p\mathbb Z$ a field. The oddness hypothesis makes $2$ invertible and ensures that a nonzero element cannot equal its own negative. Both facts will enter our proofs explicitly. We will later consider composite moduli, where some conclusions fail or require adjustment.

The group-theoretic question is equally concrete. The nonzero elements of $\mathbb F_p$ form a multiplicative group of order $p-1$. Squaring is a homomorphism on that abelian group. Its image is the collection of nonzero squares, and its kernel describes how many square roots each square has. Thus the arithmetic problem is a natural application of the first isomorphism theorem.

This chapter develops the language and tools needed for quadratic reciprocity. That theorem will relate two apparently different questions, whether $p$ is a square modulo $q$ and whether $q$ is a square modulo $p$. We first need to make each question precise, obtain efficient criteria, and learn which manipulations preserve the answer.

## Build the first square table slowly

Take $p=11$. Squaring the nonzero residues gives

| $x$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ |
|---|---|---|---|---|---|---|---|---|---|---|
| $x^2\bmod11$ | $1$ | $4$ | $9$ | $5$ | $3$ | $3$ | $5$ | $9$ | $4$ | $1$ |

The outputs repeat in pairs because $(11-x)^2\equiv x^2\pmod{11}$. The nonzero squares are $1,3,4,5,9$. The other nonzero classes, $2,6,7,8,10$, are nonsquares. Zero is a square too, but it behaves separately from the multiplicative group and must not be folded into statements about nonzero squares without care.

A nonzero class $a\in\mathbb F_p$ is a quadratic residue modulo $p$ if there exists a class $x$ with $x^2=a$. A nonzero class with no such square root is a quadratic nonresidue. In integer language, an integer $a$ not divisible by $p$ is a residue if $x^2\equiv a\pmod p$ is solvable. The answer depends only on the residue class of $a$, because replacing $a$ by $a+kp$ does not change the congruence.

If $x^2=y^2$ in a field, then $(x-y)(x+y)=0$. Since a field has no zero divisors, $x=y$ or $x=-y$. If $x\ne0$ and $p$ is odd, these two roots are distinct. Consequently every nonzero square has exactly two square roots. The $p-1$ nonzero elements therefore produce exactly $(p-1)/2$ distinct squares.

Observe the proof's ingredients. Factoring a difference of squares is valid in any commutative ring. Concluding that one factor vanishes uses the absence of zero divisors. Distinguishing $x$ from $-x$ uses odd characteristic. A familiar computation becomes a theorem only after these structural assumptions have been identified.

## The subgroup of squares

Write $G=\mathbb F_p^\times$, the multiplicative group of nonzero residues. Define $s:G\to G$ by $s(x)=x^2$. Since multiplication in a field is commutative,

$$
s(xy)=(xy)^2=x^2y^2=s(x)s(y).
$$

Thus $s$ is a group homomorphism. Its kernel consists of solutions to $x^2=1$. Factoring gives $(x-1)(x+1)=0$, so the kernel is $\{1,-1\}$. Its image $H$ is the subgroup of nonzero squares. The first isomorphism theorem gives $|H|=(p-1)/2$ and index $[G:H]=2$.

This explains the arithmetic of square status. A product of two squares is a square because $H$ is a subgroup. A square times a nonsquare is a nonsquare: if $h\in H$, $a\notin H$ and $ha\in H$, multiplying by $h^{-1}\in H$ would put $a$ in $H$. A product of two nonsquares is a square. One way to prove the last assertion is that a group with a subgroup of index two has precisely two cosets. If $a$ is a nonsquare, all nonsquares form $aH$. Thus $(ah_1)(ah_2)=a^2h_1h_2\in H$.

For $p=11$, both $2$ and $6$ are nonsquares, while $2\cdot6\equiv1$ is a square. The product $3\cdot2\equiv6$ combines a square with a nonsquare and stays nonsquare. A multiplication table of eleven residues contains many entries; the subgroup viewpoint compresses their square-status behavior into a two-element quotient group.

A common error is to think that a nonsquare has no algebraic structure. In fact, every nonsquare differs from every other nonsquare by multiplication by a square. The distinction between the two cosets is the entire content of the quadratic character introduced next.

## The Legendre symbol is a carefully defined function

For an odd prime $p$ and an integer $a$, define

$$
\left(\frac ap\right)=
\begin{cases}
0,&p\mid a,\\
1,&a\text{ is a nonzero square modulo }p,\\
-1,&a\text{ is a nonsquare modulo }p.
\end{cases}
$$

This notation is called the Legendre symbol. It is not a fraction. The bottom entry must be an odd prime in the definition we are using. The top entry may be negative, composite or larger than the bottom entry. For example, $(14/11)=(3/11)=1$, because $5^2\equiv3\pmod{11}$.

The subgroup argument proves multiplicativity:

$$
\left(\frac{ab}{p}\right)=
\left(\frac ap\right)\left(\frac bp\right).
$$

If neither factor is divisible by $p$, this is precisely the square-times-square, square-times-nonsquare and nonsquare-times-nonsquare discussion. If a factor is divisible by $p$, the product and the corresponding symbol are zero, so the formula remains valid.

Consequently a square factor can be removed from the numerator when it is coprime to $p$:

$$
\left(\frac{a c^2}{p}\right)=\left(\frac ap\right)
\quad\text{if }p\nmid c.
$$

The coprimality condition matters. If $p\mid c$, the left side is zero regardless of the original square status of $a$.

For a nonzero numerator, multiplicativity also gives $(a^{-1}/p)=(a/p)$, where $a^{-1}$ denotes the multiplicative inverse class. Indeed, $1=(1/p)=(a/p)(a^{-1}/p)$, and the only possibilities are $1$ and $-1$. This is useful when completing the square in a quadratic congruence.

The function on $G$ with values $\{1,-1\}$ is a group homomorphism. Its kernel is exactly $H$. In group language it is a character: a multiplicative function into nonzero complex numbers, here taking only the two real values $1,-1$. We need no representation theory to use that word; the defining multiplicative property is the whole requirement here.

## Euler's criterion without guessing a generator

**Euler's criterion.** If $p$ is an odd prime and $p\nmid a$, then

$$
a^{(p-1)/2}\equiv\left(\frac ap\right)\pmod p.
$$

The right-hand side is an ordinary integer $1$ or $-1$ interpreted modulo $p$. This theorem turns an existence question about square roots into one modular exponentiation.

Let $m=(p-1)/2$. If $a=b^2$, Fermat's theorem gives $a^m=b^{p-1}=1$ in $\mathbb F_p$. Thus every nonzero square is a root of $X^m-1$. There are exactly $m$ nonzero squares, and a nonzero polynomial of degree $m$ over a field has at most $m$ roots. Therefore these are all the roots of $X^m-1$.

If $a$ is a nonsquare, $a^m\ne1$. But Fermat's theorem still gives $(a^m)^2=a^{p-1}=1$. The only roots of $Y^2-1$ are $1$ and $-1$. Since the first possibility was excluded, $a^m=-1$. This proves the criterion in both cases.

The root bound used here was established through polynomial division: a root $r$ gives a factor $X-r$, and successively factoring distinct roots cannot produce more linear factors than the degree. It is not a counting heuristic. It requires a domain so that the relevant cancellation and degree statements work.

For example, determine whether $7$ is a square modulo $13$. We compute $7^2\equiv10$, then $7^3\equiv5$, so $7^6\equiv25\equiv-1\pmod{13}$. Euler's criterion says $(7/13)=-1$. We did not have to inspect all twelve possible nonzero roots.

For $a=3$, $3^3=27\equiv1\pmod{13}$, so $3^6\equiv1$. Thus $(3/13)=1$. A square root can be found separately: $4^2=16\equiv3$. Euler's criterion detects whether a root exists; it does not automatically output a root.

## The first supplementary law: the status of minus one

Apply Euler's criterion to $a=-1$. Since $(-1)^m$ is an actual integer sign, we obtain

$$
\left(\frac{-1}{p}\right)=(-1)^{(p-1)/2}.
$$

Thus $-1$ is a square modulo $p$ exactly when $p\equiv1\pmod4$. This agrees with the Gaussian-integer discussion, where such a square root caused an ordinary prime to split.

There is a group-theoretic explanation as well. If $x^2=-1$, then $x^4=1$ but $x^2\ne1$, so $x$ has order four in $\mathbb F_p^\times$. Lagrange's theorem then forces $4\mid p-1$. This proves necessity. Existence when $4\mid p-1$ follows from cyclicity of the multiplicative group, proved below, or from the Wilson-theorem construction in Chapter 16. The Euler-criterion proof establishes both directions without first needing a generator.

For $p=17$, $4^2=16\equiv-1$. For $p=19$, the exponent $(19-1)/2=9$ is odd, so there is no square root of $-1$. When manipulating a negative numerator, extract the minus sign using multiplicativity. For instance,

$$
\left(\frac{-3}{11}\right)=
\left(\frac{-1}{11}\right)\left(\frac3{11}\right)=(-1)(1)=-1.
$$

The fact that $3$ is a square modulo $11$ came from the initial table; the negative sign reverses its status because $11\equiv3\pmod4$.

## Why finite multiplicative subgroups of fields are cyclic

We now prove a structural theorem that is useful beyond quadratic questions.

**Theorem.** Every finite subgroup $G$ of the multiplicative group of a field is cyclic.

Let $n=|G|$. Every element has finite order dividing $n$ by Lagrange's theorem. Let $m$ be the least common multiple of all these orders. We first show that some element of $G$ has order $m$. This step is not true for arbitrary nonabelian groups, so we explain it.

Write $m=\prod_\ell\ell^{e_\ell}$, the product over the finitely many primes dividing $m$. For each prime $\ell$, the definition of least common multiple ensures that some element $g_\ell$ has order whose $\ell$-part is exactly $\ell^{e_\ell}$. If its order is $\ell^{e_\ell}u$ with $\ell\nmid u$, then $h_\ell=g_\ell^u$ has order $\ell^{e_\ell}$. The order formula follows from $\operatorname{ord}(g^u)=\operatorname{ord}(g)/\gcd(\operatorname{ord}(g),u)$, or directly from the least exponent making the power equal to one.

The elements $h_\ell$ commute because multiplication in a field is commutative. A product of commuting elements of pairwise coprime orders has order equal to the product of those orders. For two factors $x,y$ of coprime orders $r,s$, if $(xy)^k=1$, then $x^k=y^{-k}$ lies in both $\langle x\rangle$ and $\langle y\rangle$. Its order divides both $r,s$, so it is the identity. Hence $r\mid k$ and $s\mid k$, giving $rs\mid k$. The reverse divisibility is immediate from $(xy)^{rs}=1$. Induction proves the assertion for finitely many factors.

Thus $h=\prod h_\ell$ has order $m$. Every element of $G$ satisfies $x^m=1$, so all $n$ elements are roots of $X^m-1$. The polynomial root bound gives $n\le m$. But $h$ has order $m$, so its $m$ powers are distinct elements of $G$, giving $m\le n$. Consequently $m=n$, and $h$ generates $G$.

This theorem proves that $\mathbb F_p^\times$ has a primitive root, meaning an element of order $p-1$. It will also prove cyclicity of multiplicative groups in larger finite fields. The proof used only finite group theory and the field root bound, making a particularly clean bridge between the two subjects.

## Discrete exponents organize all power questions

Choose a primitive root $g$ modulo $p$. Every nonzero residue is uniquely $g^k$ with the exponent considered modulo $p-1$. A square is $g^{2j}$, so it has an even exponent. Conversely every even exponent is visibly a square. Hence

$$
\left(\frac{g^k}{p}\right)=(-1)^k.
$$

This description is conceptually powerful even when finding $k$ is computationally difficult. The task of recovering $k$ from $g^k$ is the discrete logarithm problem. We do not need an efficient discrete-log algorithm to prove the classification.

More generally, consider $x^r=a$ in $\mathbb F_p^\times$, and write $a=g^k$, $x=g^j$. The equation becomes a linear congruence

$$
rj\equiv k\pmod{p-1}.
$$

By Chapter 5, this has solutions if and only if $\gcd(r,p-1)$ divides $k$. When it is solvable, it has exactly $\gcd(r,p-1)$ exponent solutions modulo $p-1$, hence that many nonzero field solutions. The quadratic case is $r=2$, where the gcd is two.

For example, modulo $7$, the element $3$ is primitive: its powers are $3,2,6,4,5,1$. Cubes correspond to exponents divisible by three, so the nonzero cubes are $1$ and $6$. Each has three cube roots, since $\gcd(3,6)=3$. The same group structure that counts square roots counts arbitrary power roots.

A subtle point concerns characteristic. The exponent $r$ need not be prime, and it need not be coprime to $p$. The argument takes place in a group of order $p-1$, so the relevant gcd is with $p-1$. For the map $x\mapsto x^p$, that gcd is one; every element has exactly one $p$th root in the finite field. This observation anticipates Frobenius automorphisms later in the course.

## Solving a quadratic congruence by its discriminant

The question $ax^2+bx+c\equiv0\pmod p$ is not fundamentally more complicated when $p$ is odd and $p\nmid a$. Multiply the equation by $4a$ and complete the square:

$$
(2ax+b)^2\equiv b^2-4ac\pmod p.
$$

Let $\Delta=b^2-4ac$, the discriminant. Since $2a$ is invertible, the substitution $y=2ax+b$ is a bijection of the field. Therefore the number of roots of the original quadratic equals the number of roots of $y^2=\Delta$.

It follows that there are two roots if $(\Delta/p)=1$, one repeated root if $p\mid\Delta$, and no roots if $(\Delta/p)=-1$. The compact count is $1+(\Delta/p)$, valid because the symbol is $0$ at zero. The roots, when a square root $s$ of $\Delta$ is known, are

$$
x\equiv(-b+s)(2a)^{-1},\qquad
x\equiv(-b-s)(2a)^{-1}\pmod p.
$$

For $x^2+x+1\equiv0\pmod7$, the discriminant is $1-4=-3\equiv4$. Its roots are $\pm2$. The inverse of $2$ modulo $7$ is $4$, so the two solutions are $(-1+2)4\equiv4$ and $(-1-2)4\equiv2$. Direct substitution verifies both.

Over $\mathbb F_5$, the same polynomial has discriminant $-3\equiv2$, a nonsquare, and no root. A quadratic polynomial over a field is irreducible exactly when it has no root, so the quadratic-residue calculation becomes an irreducibility test. This will let us build finite fields by quotienting polynomial rings.

If $p\mid a$, the expression is no longer a genuine quadratic in the field, and completing the square using $(2a)^{-1}$ is invalid. Reduce first: the equation may become linear, constant, or identically zero. This is an example of why writing an inverse implicitly asserts a nonzero hypothesis.

## Extracting roots when the prime is three modulo four

Euler's criterion tests existence but does not always give a root cheaply. For $p\equiv3\pmod4$, however, there is a direct formula. Suppose $a$ is a nonzero square. Then

$$
x=a^{(p+1)/4}
$$

is a square root modulo $p$, because

$$
x^2=a^{(p+1)/2}=a\cdot a^{(p-1)/2}=a.
$$

The final equality uses Euler's criterion and the assumption that $a$ is a square. The exponent $(p+1)/4$ is an integer precisely for this congruence class of primes.

Modulo $11$, take $a=5$. The formula gives $x=5^3=125\equiv4$, and indeed $4^2\equiv5$. The second root is $-4\equiv7$. If one applies the same formula to a nonsquare, its square becomes $-a$, because Euler's criterion contributes a minus sign. A useful algorithm should therefore check residue status or verify the resulting square before reporting success.

For primes congruent to $1$ modulo $4$, other algorithms are needed in general. We do not introduce a formula with a fractional exponent or pretend that one case covers every prime. Brute force works for the small inputs in our companion, and efficient general algorithms can be studied after the conceptual foundations are secure.

The distinction between root detection and root extraction also matters in cryptography. Over a known prime field the relevant algorithms are efficient, but over certain composite moduli root extraction can encode factorization information. The arithmetic structure of the modulus determines which computational tasks become easy.

## Composite moduli reveal which hypotheses mattered

Modulo $15$, the congruence $x^2\equiv1$ has four roots: $1,4,11,14$. This does not contradict the degree-two root bound, because $\mathbb Z/15\mathbb Z$ is not a domain. Indeed, $(4-1)(4+1)=3\cdot5\equiv0$ even though neither factor is zero modulo $15$.

The Chinese remainder theorem explains all four roots. An integer modulo $15$ corresponds to a pair of residues modulo $3$ and modulo $5$. Each local equation $x^2=1$ has the two choices $1,-1$. Combining the independent sign choices gives four pairs and hence four global solutions.

For an odd squarefree modulus with $r$ distinct prime factors, a unit $a$ is a square exactly when it is a square modulo every prime factor. If it is, it has $2^r$ square roots modulo the modulus. The assumptions squarefree and unit keep the local counting simple. Repeated prime powers or a numerator sharing factors with the modulus require additional analysis, developed in the Hensel-lifting chapter.

For example, solve $x^2\equiv4\pmod{15}$. Modulo $3$, the roots are $1,2$; modulo $5$, they are $2,3$. Combining gives $2,7,8,13$ modulo $15$. Checking $7^2=49\equiv4$ illustrates one nontrivial combination. A pair of local square roots can be turned into an explicit global root using the constructive CRT formula from Chapter 5.

This is why there is no Legendre symbol with an arbitrary composite denominator under the definition above. There is a related Jacobi symbol, which we introduce next, but its value does not mean exactly the same thing.

## The Jacobi symbol and a logical trap

If $n>1$ is odd with ordinary prime factorization $n=\prod p_i^{e_i}$, define the Jacobi symbol by

$$
\left(\frac an\right)=\prod_i
\left(\frac a{p_i}\right)^{e_i}.
$$

The notation deliberately resembles the Legendre symbol, and the definitions agree for a prime denominator. The product definition makes the Jacobi symbol multiplicative in the denominator as well as the numerator. It is often convenient for algorithms, but a value of $1$ need not imply that $a$ is a square modulo $n$.

For example, $(2/15)=(2/3)(2/5)=(-1)(-1)=1$. Yet $2$ is not a square modulo $15$, since it is not a square modulo either $3$ or $5$. The two negative local signs cancel in the product. The single Jacobi value has forgotten which prime factors caused the obstruction.

If $a$ is coprime to odd $n$ and is a square modulo $n$, then the Jacobi symbol is $1$, because every local Legendre symbol is $1$. The converse is false, as the example shows. If the Jacobi symbol is $-1$, a square is impossible; if it is $1$, further information is required. This is a useful example of a necessary condition that is not sufficient.

At a prime denominator, Euler's criterion says a modular power is exactly the residue sign. At a composite denominator, similar-looking congruences can fail to characterize primality. Some composites pass particular tests. One should distinguish a theorem valid for all primes from a test whose successful output proves primality. The direction of implication is part of the mathematics, not a detail of terminology.

The reciprocity laws in the next chapter also provide a fast way to compute Jacobi symbols without first factoring the denominator. That computational fact is valuable precisely because factoring large integers may be difficult. It does not restore the missing square-existence information at composite moduli.

## Counting a quadratic character sum directly

Here is a short calculation that shows how residue symbols can count solutions. Let $a\ne0$ in $\mathbb F_p$. Consider the number $N$ of pairs $(x,y)$ satisfying $y^2=x^2-a$. For each fixed $x$, the number of possible $y$ is $1+((x^2-a)/p)$. Therefore

$$
N=p+\sum_{x\in\mathbb F_p}
\left(\frac{x^2-a}{p}\right).
$$

There is another way to count the same pairs. Rewrite the equation as $(x-y)(x+y)=a$. Since $a\ne0$, choose any nonzero value $u=x-y$. Then $v=x+y$ must equal $a/u$. Because $2$ is invertible, the formulas $x=(u+v)/2$ and $y=(v-u)/2$ recover exactly one pair. There are $p-1$ choices of nonzero $u$, so $N=p-1$.

Comparing the two counts gives

$$
\sum_{x\in\mathbb F_p}
\left(\frac{x^2-a}{p}\right)=-1.
$$

The proof is elementary double counting. It also prepares for later number theory, where sums of characters measure how arithmetic properties are distributed. We have not used any analytic estimates here, and the final value is exact.

For $p=5$, $a=1$, the five arguments $x^2-1$ are $4,0,3,3,0$. Their Legendre values are $1,0,-1,-1,0$, summing to $-1$. The zero values are essential; silently treating every input as a unit would give the wrong count.

The same strategy often works when a polynomial expression can be factored after adding another variable. Instead of attempting a difficult sum directly, interpret it as a count and seek a bijection. This is one of the most useful habits to carry from algebra into number theory.

## Two useful counts involving sums of squares

The character-sum identity can be used to count solutions of $x^2+y^2=a$ for a nonzero $a$ modulo an odd prime. For each fixed $x$, there are $1+((a-x^2)/p)$ possible values of $y$. Hence the total number of ordered pairs is

$$
p+\sum_x\left(\frac{a-x^2}{p}\right)
=p+\left(\frac{-1}{p}\right)
\sum_x\left(\frac{x^2-a}{p}\right)
=p-\left(\frac{-1}{p}\right).
$$

We used multiplicativity to extract the factor $-1$, then used the identity already proved. Thus there are $p-1$ pairs when $p$ is one modulo four and $p+1$ pairs when it is three modulo four. Both are positive. Every nonzero residue modulo an odd prime is therefore a sum of two squares, even though it may fail to be a single square.

For example, modulo seven there are eight ordered solutions of $x^2+y^2=1$. The four pairs with a zero coordinate are $(1,0),(-1,0),(0,1),(0,-1)$. The other four arise from $x^2=y^2=4$, because $4+4=1$ modulo seven: they are the independent sign choices of $(2,2)$. Counting ordered pairs means that exchanging coordinates generally produces a different solution; this convention is essential when comparing the formula with a hand enumeration.

This finite-field statement does not say every positive integer is a sum of two integer squares. The integer three is not a sum of two integer squares, while its residue class modulo seven is, since $1^2+3^2=10$ reduces to three. Passing to a quotient forgets exact integer size. A local representation is a necessary condition for an integer representation, but it need not retain every global obstruction.

The zero right-hand side has a different count. If minus one is a nonsquare, $x^2+y^2=0$ forces both coordinates zero: a nonzero $y$ would give $(x/y)^2=-1$. If minus one is a square, choose $i$ with $i^2=-1$. For every nonzero $y$, there are the two choices $x=iy$ and $x=-iy$, along with the zero pair. The total is $2p-1$. This sharp difference shows again why a theorem stated for nonzero $a$ must not be applied silently at zero.

## Character sums and the balance between squares and nonsquares

Let $\chi(a)=(a/p)$, including $\chi(0)=0$. There are equally many nonzero squares and nonsquares, so

$$
\sum_{a\in\mathbb F_p}\chi(a)=0.
$$

There is also a structural proof. Choose a nonsquare $b$, which exists because only half the nonzero elements are squares. Multiplication by $b$ permutes the field, so the sum has the same value after replacing every argument $a$ by $ba$. Multiplicativity turns the new sum into $\chi(b)\sum_a\chi(a)=-\sum_a\chi(a)$. An ordinary integer equal to its negative is zero. Here the sum is an integer, not a field element, so no ambiguity about reduction modulo $p$ enters the conclusion.

A translation gives $\sum_a\chi(a+c)=0$ for any fixed $c$, since addition by $c$ also permutes the field. Combining a nonzero scaling and a translation shows that $\sum_a\chi(ua+v)=0$ whenever $u\ne0$. The formula fails when $u=0$ because then every summand is the same constant; once more the invertibility assumption is doing visible work.

These identities are the earliest examples of cancellation in arithmetic sums. Individual terms are only zero, one or minus one, but the algebraic symmetry forces exact balance. Later analytic number theory studies sums where such perfect cancellation is unavailable and seeks useful bounds instead. The conceptual starting point is already present here: a multiplicative sign can measure how evenly a polynomial expression visits squares and nonsquares.

## Factoring an odd composite from two square roots

Suppose an odd integer $n$ has two square roots $r,s$ of the same unit $a$, and suppose $r$ is neither $s$ nor $-s$ modulo $n$. Then

$$
(r-s)(r+s)\equiv0\pmod n.
$$

If $n$ were prime, the field argument would force one factor zero. The two nontrivial roots therefore witness compositeness. In many cases, computing $\gcd(r-s,n)$ finds a proper factor. For a product of two distinct odd primes, CRT describes exactly what happens: the two roots use the same sign at one prime and opposite signs at the other, so one prime divides $r-s$ and the other divides $r+s$.

Take $n=77$ and $a=4$. The obvious roots are two and minus two. Another root is nine because $9^2=81$ reduces to four modulo seventy-seven. Comparing nine with two gives $\gcd(9-2,77)=7$, while $\gcd(9+2,77)=11$. The factorization has been recovered from a pair of incongruent sign choices. Notice that finding just the roots two and minus two would not help: their difference or sum would produce only trivial gcd information.

This calculation explains why square-root extraction modulo an unknown composite factorization can be more subtle than extraction modulo a known prime. It is not a claim that every root algorithm automatically factors every integer, and it is not an implementation recommendation for cryptographic software. It is an exact relationship in this specified two-prime setting, derived from the same zero-divisor phenomenon that invalidated the quadratic root bound.

## Testing a proposed primitive root economically

If the factorization of $p-1$ is known, one can test whether a nonzero residue $g$ generates the multiplicative group by checking a small number of powers. For each distinct prime divisor $\ell$ of $p-1$, verify

$$
g^{(p-1)/\ell}\ne1\pmod p.
$$

These tests are sufficient. The order $d$ of $g$ divides $p-1$. If $d$ were a proper divisor, the quotient $(p-1)/d$ would have a prime divisor $\ell$. Then $d$ would divide $(p-1)/\ell$, contradicting the corresponding power test. Necessity follows because an element of full order cannot become one at a smaller positive exponent.

For $p=17$, the only distinct prime divisor of sixteen is two. The calculation $3^4=81\equiv13$ gives $3^8\equiv13^2=169\equiv-1$. Therefore three has order sixteen and is primitive. A power table can now be generated in a controlled way, but the order test already proves the generator property without listing every power. This is a useful final connection: prime factorization controls the computational certification of a group-theoretic generator.

## Generators, squares and the order of an element

Once a primitive root $g$ is chosen, the generators of the full group are exactly the powers $g^k$ with $\gcd(k,p-1)=1$. To prove this, the order of $g^k$ is the least positive $r$ with $(p-1)\mid kr$, which is $(p-1)/\gcd(k,p-1)$. It equals the full group order precisely under the stated coprimality condition. Therefore the number of primitive roots is $\varphi(p-1)$, tying generator counting to the totient function from earlier arithmetic.

Because $p-1$ is even, an exponent coprime to it must be odd. Every primitive root is consequently a nonsquare. The converse is false: a nonsquare has an odd exponent relative to $g$, but that exponent may share an odd prime factor with $p-1$. For example, two is primitive modulo thirteen, while its cube eight has order four. Eight is a nonsquare, yet it does not generate the twelve-element group. Square status records only exponent parity, whereas full generator status records coprimality with the entire group order.

The subgroup of squares itself is cyclic, generated by $g^2$, and has order $(p-1)/2$. Its generators are squares of suitable elements, but they generate only the square subgroup, not the full multiplicative group. It is therefore possible for the phrase “generator among squares” to be correct while the phrase “primitive root modulo the prime” is false for the same element. Naming the group avoids the ambiguity.

There is also an order-only test for square status. An element is a square exactly when its order divides $(p-1)/2$, since membership in the unique subgroup generated by $g^2$ is equivalent to that divisibility. If $p-1=2^s u$ with $u$ odd, the distinction says that a nonsquare must have the full factor $2^s$ in its order, while a square has a smaller power of two in its order. Odd factors of the order do not affect this particular test.

This interpretation explains why quadratic characters are such economical summaries. They forget most of an element's order and all of its exact discrete exponent, retaining just the one bit that says whether it belongs to an index-two subgroup. An economical summary is useful because it is easy to manipulate, but it cannot answer questions that require the information it discarded.

For a quick order calculation illustrating the distinction, modulo thirteen we have $8^2=64\equiv-1$, so $8^4\equiv1$ and $8$ has order four. Since six is not divisible by four, this order does not divide $(13-1)/2$, confirming that eight is a nonsquare. By contrast, four has order six: its cube is minus one and its sixth power is one. That order does divide six, confirming that four is a square. In this small example, the order test, the power-of-a-generator test and the original square table all give the same answer through different calculations. Agreement among independent descriptions is useful for checking understanding, while the proofs establish why such agreement must always occur.

## Reading the chapter as one conceptual chain

We began with a square table and identified paired roots. Factoring a difference of squares justified that pairing over a field. The squaring homomorphism organized the squares into a subgroup of index two. The Legendre symbol recorded the corresponding quotient sign. Euler's criterion then connected that sign to modular exponentiation, while cyclicity explained all higher power equations through linear congruences of exponents.

Each transition reduced a new-looking question to a structure already studied. There is no need to memorize separate rules for square multiplication once the subgroup is understood. There is no need to guess the number of roots of a quadratic once completing the square and the Legendre symbol are available. The definitions were designed to carry reasoning from one problem to another.

At the same time, examples modulo $15$ showed the limits of the field arguments. The equation $(x-y)(x+y)=0$ cannot be split into two cases in a ring with zero divisors. The Jacobi symbol showed how combining local information can lose distinctions. These failures are as informative as the successful theorems because they identify exactly which assumptions support each conclusion.

## Optional practice and companion connection

In the [companion](../companion/index.html), use the residues experiment to list squares for several odd primes, inspect paired roots and compare computed symbols. It implements finite calculations, not a proof of reciprocity. You can also use its output to check the arithmetic in the examples above.

1. List the nonzero squares modulo $13$, pairing each root with its negative. Compute $(2/13)$, $(3/13)$ and $(-1/13)$.
2. Use Euler's criterion to decide whether $5$ is a square modulo $19$. Show the modular exponentiation steps.
3. Solve $2x^2+3x+1\equiv0\pmod7$ by completing the square or using the discriminant.
4. Show that $3$ is a primitive root modulo $7$, and use its powers to solve $x^3\equiv6\pmod7$.
5. Find the two roots of $x^2\equiv9\pmod{11}$ using the exponent formula and verify them.
6. Solve $x^2\equiv1\pmod{21}$ using CRT. Explain why four roots are possible for a quadratic.
7. Compute $(2/15)$ as a Jacobi symbol and prove that $2$ is nevertheless not a square modulo $15$.
8. Reproduce the double-counting proof of the character-sum identity for $p=7$, $a=2$, checking the final sum numerically.

Hints and complete solutions appear in [Chapter 17 solutions](../solutions/17-solutions.md). Next we seek a law that replaces large square tables with a relation between two small prime-denominator calculations.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](16-ufds-and-gaussian-integers.md) · [Next chapter](18-quadratic-reciprocity.md) · [Hints and solutions](../solutions/17-solutions.md)
