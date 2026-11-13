# Chapter 29 — Hensel lifting and a first look at p-adic integers

Suppose we have solved $x^2\equiv2\pmod7$. Can that solution be improved to one modulo forty-nine, then modulo three hundred forty-three, and then modulo every power of seven? This looks like an arithmetic approximation problem. The surprising next step is to regard a coherent sequence of these approximations as an exact new number.

The resulting numbers are called p-adic integers. Their notion of closeness measures divisibility by a fixed prime rather than small distance on the real line. Hensel's lemma supplies a method for constructing roots in this new setting. The method resembles a linear correction, but everything in its elementary proof is an exact congruence.

You need modular arithmetic, polynomial evaluation, valuations and the sequence language of Chapter 28. We introduce the required derivative as a formal polynomial operation; no differentiation course is assumed. We will prove the simple-root version of Hensel's lemma, construct the ring of p-adic integers, describe its units and explain the first step toward the field of p-adic numbers. The [Hensel companion lab](../companion/index.html) performs finite lifts. It does not store an infinite p-adic number, and finite roots alone do not decide every integer equation.

## 29.1 What it means to improve a congruence solution

Fix a prime $p$. A root modulo $p^k$ of a polynomial $f\in\mathbb Z[X]$ is a residue class represented by an integer $a$ such that $p^k\mid f(a)$. A lift to modulus $p^{k+1}$ must reduce to the original class modulo $p^k$.

Every candidate lift can be written

$$
a+t p^k,\qquad t=0,1,\ldots,p-1.
$$

There are exactly $p$ candidates modulo $p^{k+1}$. This follows because two such candidates are congruent modulo $p^{k+1}$ exactly when their digit parameters are congruent modulo $p$. The parameter $t$ is the next base-$p$ digit.

For example, the solutions of $x^2\equiv1\pmod3$ are $1$ and $2$. Lifts of the first class modulo nine are $1,4,7$. Their squares modulo nine are $1,7,4$, respectively, so only one survives. Lifts of the class two are $2,5,8$, and only eight survives. Thus the two roots modulo nine are one and minus one.

A singular root behaves differently. The equation $x^2\equiv0\pmod2$ has root zero. Its candidates modulo four are zero and two, and both have square zero. By contrast, the equation $x^2\equiv2\pmod2$ has the same initial root zero, but neither candidate solves the equation modulo four. An initial root can branch into several lifts or die out entirely.

The task is therefore not just to find any root modulo a larger power. We want a criterion ensuring that a specified root has one and only one compatible continuation. The simple-root hypothesis in Hensel's lemma does exactly that.

## 29.2 Formal differentiation is algebra here

For a polynomial $f(X)=\sum_{j=0}^d c_jX^j$, define its formal derivative by

$$
f'(X)=\sum_{j=1}^d jc_jX^{j-1}.
$$

This definition is an algebraic operation on coefficients and powers. We do not need limits of difference quotients. The key property comes from the binomial theorem: for integers $a$ and $h$,

$$
f(a+h)=f(a)+hf'(a)+h^2R
$$

for some integer $R$ depending on $a,h$ and the coefficients. Every term beyond the linear term in the binomial expansion contains at least two factors of $h$.

For $f(X)=X^2-2$, this is the exact identity

$$
f(a+h)=a^2-2+2ah+h^2.
$$

For $f(X)=X^3+X+1$, expansion gives $f(a+h)=f(a)+(3a^2+1)h+3ah^2+h^3$. The last two terms are divisible by $h^2$, which is all we need. The derivative records the coefficient of the first-order change.

Take $h=t p^k$ with $k\ge1$. Then $h^2$ is divisible by $p^{2k}$, and $2k\ge k+1$. Therefore

$$
f(a+t p^k)\equiv f(a)+t p^k f'(a)\pmod{p^{k+1}}.
$$

This is exact modular linearization. It is not an approximation with an unspecified small error. The discarded part is known to vanish in the quotient ring in which we are computing. That divisibility is why a nonlinear root problem becomes a linear congruence for the next digit.

We call a root $a$ modulo $p$ simple if $f'(a)\not\equiv0\pmod p$. Since $p$ is prime, this derivative value is invertible modulo $p$. The field property of $\mathbb F_p$ is essential; a nonzero derivative modulo a composite number need not have an inverse.

## 29.3 The one-digit lifting theorem

**Theorem.** Suppose $f(a)\equiv0\pmod{p^k}$ for $k\ge1$, and suppose $f'(a)\not\equiv0\pmod p$. Then there is exactly one residue $t\pmod p$ such that $a+t p^k$ is a root modulo $p^{k+1}$.

Write $f(a)=c p^k$ with $c\in\mathbb Z$. The linearization formula shows that the new candidate is a root exactly when

$$
c+t f'(a)\equiv0\pmod p.
$$

Because $f'(a)$ is invertible modulo $p$, this has the unique solution

$$
t\equiv-c\bigl(f'(a)\bigr)^{-1}\pmod p.
$$

This proves both existence and uniqueness of the lift. It also gives a practical algorithm: evaluate the polynomial, divide by the old modulus, reduce the quotient modulo $p$, invert the derivative modulo $p$, and compute the next digit.

The derivative remains nonzero modulo $p$ at the new representative because the representative is congruent to $a$ modulo $p$. Polynomial evaluation respects congruence. Consequently the process may be repeated forever. Starting from a simple root modulo $p$, each later stage has a unique compatible lift.

There are two distinct uniqueness statements here. A specified simple residue class modulo $p$ has exactly one full chain of lifts. The polynomial may still have several different simple roots modulo $p$, each leading to its own chain. For $X^2-2$ modulo seven there are two initial roots, three and four, so the theorem gives two seven-adic roots rather than one.

The representative convention also matters in a calculation. We usually choose $0\le a<p^k$ and $0\le t<p$ so that $a+t p^k$ is the standard representative modulo $p^{k+1}$. Choosing another integer representative changes the digit formula but not the resulting residue class. The theorem concerns classes, not the accidental printed integer used to represent them.

## 29.4 Lifting a square root of two at seven

Start with $f(X)=X^2-2$, $p=7$, and $a_1=3$. We have $f(3)=7$, so three is a root modulo seven. Its derivative is six, which is invertible modulo seven; its inverse is six because $6\cdot6\equiv1$.

At the first step, $c=f(3)/7=1$. The next digit satisfies $1+6t\equiv0\pmod7$, giving $t=1$. Thus

$$
a_2=3+1\cdot7=10,\qquad 10^2-2=98=2\cdot49.
$$

At modulus forty-nine, take $c=2$. The derivative at ten is twenty, congruent to six modulo seven. Hence $2+6t\equiv0$, giving $t=2$. The new representative is

$$
a_3=10+2\cdot49=108.
$$

Directly, $108^2-2=11662=34\cdot343$. At the next stage $c=34\equiv6\pmod7$, while the derivative $216$ is again six modulo seven. We solve $6+6t\equiv0$, giving $t=6$. Therefore

$$
a_4=108+6\cdot343=2166.
$$

Its square differs from two by a multiple of $2401=7^4$. The sequence of digits so far is $3,1,2,6$, giving the seven-adic expansion beginning $3+7+2\cdot7^2+6\cdot7^3+\cdots$.

The representatives grow as ordinary real numbers, so they do not approach the real square root of two. Their improvement is divisibility: $a_{k+1}-a_k$ is divisible by $7^k$, and $a_k^2-2$ is divisible by increasingly high powers of seven. We are constructing a different kind of limit.

The other root begins with four modulo seven and is the negative of this root. At every finite level, negation carries one root class to the other. The two chains stay distinct because their first digits differ. No real ordering is involved in calling one the negative of the other.

## 29.5 Singular roots: why the hypothesis is needed

If $f'(a)\equiv0\pmod p$, the next-digit equation becomes $c\equiv0\pmod p$, independent of $t$. Thus either all $p$ candidates lift or none do. This does not by itself decide later stages; branching can be followed by dead ends.

For $X^2-1$ at $p=2$, the derivative is $2X$, always zero modulo two. Modulo eight, every odd residue is a root: $1,3,5,7$. But a representative congruent to three modulo eight has candidates three and eleven modulo sixteen. Both squares are nine modulo sixteen, so that branch dies. A representative congruent to one modulo eight has candidates one and nine, and both square to one modulo sixteen, so that branch splits.

The root count modulo powers of two can therefore exceed the eventual number of two-adic roots. In the two-adic integers, once we prove that the ring has no zero divisors, $(x-1)(x+1)=0$ forces $x=1$ or $x=-1$. Finite quotient rings do have zero divisors, so the same factorization can admit additional finite-level roots.

Another example is $X^2-2$ at two. The initial congruence modulo two has root zero, but its two candidates modulo four are zero and two. Both squares are zero modulo four, never two. There is no two-adic square root of two, because any compatible two-adic root would already give a root modulo four.

This is a useful local obstruction. It can disprove an integer or rational equation after the correct denominator considerations. But solvability at one prime does not establish an integer solution. The seven-adic square root of two exists, while no integer squared equals two. Passing every test in one local environment is much weaker than satisfying an equation globally over the integers.

## 29.6 Constructing the ring from compatible residues

A p-adic integer is a sequence

$$
x=(x_1,x_2,x_3,\ldots),\qquad x_k\in\mathbb Z/p^k\mathbb Z,
$$

such that reducing $x_{k+1}$ modulo $p^k$ gives $x_k$. Compatibility is part of the definition. A random choice of one residue at each level generally does not define a p-adic integer.

For example, the sequence of residue classes of a fixed ordinary integer $m$ is compatible. The Hensel lift sequence just constructed is also compatible. By contrast, choosing zero modulo seven and one modulo forty-nine is incompatible, because one reduces to one rather than zero modulo seven.

Add and multiply compatible sequences coordinate by coordinate. Compatibility remains true because reduction respects addition and multiplication. The associative, commutative and distributive laws follow from the same laws in each finite quotient ring. The zero sequence and the sequence of ones act as additive and multiplicative identities. This ring is denoted $\mathbb Z_p$.

The construction is called an inverse limit of the quotient rings, written

$$
\mathbb Z_p=\varprojlim_k\mathbb Z/p^k\mathbb Z.
$$

For this chapter, the explicit compatible-sequence definition is the meaning of that notation. An abstract category-theoretic definition is unnecessary. The arrows implicit in the construction point from a finer modulus to a coarser one by reduction.

Ordinary integers embed in $\mathbb Z_p$. To prove injectivity, suppose an ordinary integer maps to the zero sequence. It is then divisible by every $p^k$. A nonzero fixed integer cannot have absolute value at least $p^k$ for arbitrarily large $k$, so the integer must be zero. Thus no two different ordinary integers become the same p-adic integer.

The image is not the whole ring. Compatible digit sequences can encode numbers not represented by one ordinary integer, including roots constructed by Hensel's lemma. We have enlarged the arithmetic system while preserving ordinary integer addition and multiplication.

## 29.7 Digits, carries and negative integers

Every p-adic integer has a unique expansion

$$
x=a_0+a_1p+a_2p^2+\cdots,\qquad a_j\in\{0,1,\ldots,p-1\}.
$$

This means that its residue modulo $p^k$ is represented by the finite sum through $a_{k-1}p^{k-1}$. Choose $a_0$ from the first residue. Compatibility then says that the representative at the next level differs from $a_0$ by one digit times $p$. Continuing determines all digits uniquely. Conversely, any such digit sequence gives compatible finite sums, hence a p-adic integer.

The infinite expression is notation for compatibility before it is a statement about a metric limit. Addition uses ordinary base-$p$ carrying from low powers to high powers. Each output digit depends on only finitely many input digits, so infinitely many higher digits do not obstruct a finite computation at a specified precision.

Negative integers have infinite expansions. For example,

$$
-1=(p-1)+(p-1)p+(p-1)p^2+\cdots.
$$

The finite sum through power $p^{k-1}$ equals $p^k-1$, which is congruent to minus one modulo $p^k$. This verifies the identity directly from the compatible-residue definition. It does not assert that the positive real partial sums approach minus one in the ordinary metric.

For $p=5$, adding one to the expansion $4+4\cdot5+4\cdot5^2+\cdots$ causes a carry through every digit. At any finite precision, the result is zero modulo that power of five. Hence the sum is the zero p-adic integer. Infinite carries are harmless when interpreted precision by precision.

The geometric series $1+p+p^2+\cdots$ equals $1/(1-p)$ in $\mathbb Z_p$. At precision $p^k$, multiplying the finite sum by $1-p$ gives $1-p^k\equiv1$. Thus the compatible sequence of partial sums is the inverse of the unit $1-p$. This is another exact arithmetic identity whose real-series interpretation would diverge.

## 29.8 Which p-adic integers have inverses?

**Theorem.** A p-adic integer is a unit if and only if its first digit is nonzero, equivalently its residue modulo $p$ is nonzero.

If the first digit is zero, reducing a proposed inverse equation modulo $p$ would give $0=1$, impossible. Conversely suppose $x$ has nonzero residue modulo $p$. Its residue at every level is relatively prime to $p^k$, so it has a unique multiplicative inverse modulo $p^k$ by Bezout's identity.

These inverses are compatible: the inverse at level $k+1$, reduced modulo $p^k$, is an inverse of the residue at level $k$. Uniqueness of inverses forces it to be the chosen level-$k$ inverse. Thus the sequence of inverses defines $y\in\mathbb Z_p$ with $xy=1$.

Consequently $\mathbb Z_p$ is not a field. The element $p$ is nonzero but has zero first digit, so it is not invertible inside the ring. Yet every element not divisible by $p$ is invertible. This is more structured than the ordinary integers, whose only units are one and minus one.

For instance, $1/3$ belongs to $\mathbb Z_5$ because three is relatively prime to five. Its inverse residue modulo five is two. Modulo twenty-five, the inverse is seventeen because $3\cdot17=51\equiv1$. Modulo one hundred twenty-five, it is forty-two because $3\cdot42=126\equiv1$. These representatives are compatible: seventeen reduces to two modulo five, and forty-two reduces to seventeen modulo twenty-five.

The associated base-five digits begin $2,3,1$, since $17=2+3\cdot5$ and $42=2+3\cdot5+1\cdot25$. The symbol $1/3$ represents an ordinary rational number embedded in the p-adic system, but its expansion and notion of approximation depend on the chosen prime.

## 29.9 Valuation and the absence of zero divisors

For a nonzero $x\in\mathbb Z_p$, define $v_p(x)$ to be the index of its first nonzero digit. Equivalently, it is the largest $r$ for which $x$ is divisible by $p^r$ in $\mathbb Z_p$. Such an index exists because a sequence with every digit zero is the zero element. Set $v_p(0)=\infty$.

Every nonzero $x$ has a unique form $p^r u$ with $u$ a unit and $r=v_p(x)$. Shift the digit expansion past its initial zero digits to obtain $u$. If $x=p^r u$ and $y=p^s v$ with units $u,v$, their product is $p^{r+s}uv$, and $uv$ is still a unit. Hence

$$
v_p(xy)=v_p(x)+v_p(y).
$$

In particular the product of two nonzero p-adic integers is nonzero. Thus $\mathbb Z_p$ is an integral domain, even though every finite quotient $\mathbb Z/p^k\mathbb Z$ for $k>1$ has zero divisors. The inverse limit has not inherited the finite rings' zero divisors because compatible divisibility across every precision is more restrictive.

Addition satisfies

$$
v_p(x+y)\ge\min\{v_p(x),v_p(y)\}.
$$

If both summands are divisible by $p^r$, so is their sum. When their valuations differ, equality holds: after factoring out the smaller power, one summand is a unit and the other is divisible by $p$, so their sum is still a unit. When valuations agree, cancellation may increase the valuation.

For ordinary integers, $v_5(1+4)=1$ although both summands have valuation zero. In base five, the first digits cancel and create a carry. This example is the p-adic counterpart of ordinary cancellation, but “more divisible” will mean “closer to zero.”

## 29.10 A new absolute value and a new kind of limit

Define

$$
|x|_p=p^{-v_p(x)}\quad(x\ne0),\qquad |0|_p=0.
$$

Then $|xy|_p=|x|_p|y|_p$, and the valuation inequality becomes the strong triangle inequality

$$
|x+y|_p\le\max\{|x|_p,|y|_p\}.
$$

It is stronger than the ordinary triangle inequality, since the maximum of two nonnegative numbers is at most their sum. A distance is given by $d_p(x,y)=|x-y|_p$. Two numbers are close when they agree modulo a large power of $p$.

For example, $1$ and $126$ are close in the five-adic metric because their difference is $125=5^3$, giving distance $1/125$. On the ordinary real line their distance is one hundred twenty-five. Neither metric contradicts the other; each measures a different arithmetic relation.

A sequence converges p-adically to $x$ if, for every fixed $k$, its terms eventually agree with $x$ modulo $p^k$. This is equivalent to the ordinary epsilon definition using $d_p$. In particular, $p^n\to0$, and Hensel's representatives converge to the compatible p-adic root they define.

The ring is complete in this metric. To see the idea precisely, take a Cauchy sequence. For every $k$, all sufficiently late terms agree modulo $p^k$, so there is a stabilized residue at that level. The stabilized residues are compatible because each comes from sufficiently late common terms. They define a p-adic integer, and the original sequence converges to it. This proof exposes the construction's purpose: it fills in all limits required by divisibility-based Cauchy approximation.

## 29.11 Hensel's lemma as an exact root theorem

The lifting process now has an exact interpretation. Begin with a simple root modulo $p$ and construct its unique compatible roots modulo $p^k$. They define an element $a\in\mathbb Z_p$. Polynomial evaluation is coordinatewise, so the residue of $f(a)$ is zero at every level. Therefore $f(a)=0$ in $\mathbb Z_p$.

If another p-adic root has the same initial residue, its residue at the next level must be the unique lift found by the theorem. Inductively every residue agrees, so the two p-adic integers are equal. This proves the simple-root version of Hensel's lemma: each simple root modulo $p$ lifts to a unique p-adic root with that first digit.

For $X^2-2$ and $p=7$, the roots three and four modulo seven are simple, so exactly two seven-adic roots arise from them. Any seven-adic root must reduce to one of those initial roots; hence these are all the roots. For $X^2-2$ at $p=2$, the obstruction modulo four proves that no two-adic root exists.

For $X^2+1$ at five, two and three are simple roots modulo five. Hensel therefore gives a square root of minus one in $\mathbb Z_5$. No real number has square minus one. The p-adic system is not just a disguised subset of the reals with unusual notation; its polynomial solvability can differ.

A useful comparison with real Newton iteration is that both methods correct a candidate using the derivative. Here the inverse derivative exists modulo a prime, and each step obtains an exact additional digit. A real iteration may converge, diverge or depend sensitively on starting values. The stated Hensel hypotheses guarantee the prescribed p-adic continuation.

## 29.12 From $\mathbb Z_p$ to $\mathbb Q_p$

Since $\mathbb Z_p$ is an integral domain, it has a fraction field. This field is called $\mathbb Q_p$. Every nonzero p-adic integer is $p^r u$ with $u$ a unit, so a fraction of two p-adic integers can be written

$$
p^{-m}x,\qquad x\in\mathbb Z_p,\quad m\ge0.
$$

Thus adjoining an inverse for $p$ supplies all missing denominators. The valuation extends by $v_p(x/y)=v_p(x)-v_p(y)$, and the absolute value extends correspondingly. Ordinary rationals embed because ordinary integers do and nonzero denominators become invertible in the fraction field.

A rational number belongs to $\mathbb Z_p$ exactly when its reduced denominator is not divisible by $p$. To verify this, write the rational as $a/b$ in lowest terms. Its valuation is $v_p(a)-v_p(b)$. Since numerator and denominator are relatively prime, they cannot both have positive valuation. The valuation is nonnegative exactly when $p\nmid b$.

For example, $1/7$ belongs to $\mathbb Z_5$ but not $\mathbb Z_7$. It belongs to both fields $\mathbb Q_5$ and $\mathbb Q_7$. An element's status as a p-adic integer is prime-dependent, while an ordinary rational remains a legitimate element of every p-adic field.

One can construct $\mathbb Q_p$ directly as the completion of $\mathbb Q$ with respect to $|\cdot|_p$. Establishing the full equivalence with the fraction-field description requires a little more metric bookkeeping, so we treat that as a structural description rather than repeating the full completion construction. The compatible-residue model already proves all the facts about $\mathbb Z_p$ and Hensel roots used here.

## 29.13 Classifying square roots at an odd prime

For odd primes, the simple-root lemma gives a clean criterion for units. Let $u\in\mathbb Z_p$ be a unit and suppose its nonzero residue modulo $p$ is a quadratic residue. Choose an integer $a$ with $a^2\equiv u\pmod p$. Here the polynomial $X^2-u$ has p-adic coefficients rather than integer coefficients, but the same digit proof works: coefficient residues determine each finite congruence, and polynomial expansion remains valid coordinatewise.

Since $a$ is nonzero modulo $p$ and $p$ is odd, its derivative $2a$ is nonzero modulo $p$. The root therefore lifts uniquely to a p-adic square root in that initial residue class. Its negative gives the other initial square-root class. Conversely, any p-adic square root reduces to a square root modulo $p$. Thus a p-adic unit is a square exactly when its residue is a square in $\mathbb F_p$.

For a nonzero element $x=p^r u$ of $\mathbb Z_p$, being a square requires $r$ even, because $v_p(y^2)=2v_p(y)$. If $r=2m$ and the unit $u$ has square residue modulo $p$, take its p-adic square root $v$ and obtain $x=(p^m v)^2$. This proves the full criterion for odd $p$: a nonzero p-adic integer is a square if and only if its valuation is even and its unit part has square residue.

For example, two is a unit at seven and a square modulo seven, so it has a seven-adic square root. The number fourteen has valuation one at seven, so it is not a square in $\mathbb Q_7$ or $\mathbb Z_7$, even though its unit part two is a square. The number ninety-eight has valuation two and unit part two, so it is a square in $\mathbb Z_7$: multiply a square root of two by seven.

The odd-prime hypothesis matters. At two, the derivative $2a$ is never a unit, so the simple-root theorem does not prove the analogous criterion. An odd two-adic square must be one modulo eight, a stronger initial constraint than merely being nonzero modulo two. Indeed the square of an odd integer $2k+1$ is $4k(k+1)+1$, and one of the consecutive integers $k,k+1$ is even, making the product term divisible by eight. This proves necessity without stating a sufficiency theorem we have not developed.

This section ties Hensel lifting back to quadratic residues. Chapter 17 decided whether a nonzero residue is a square in a finite field. Hensel explains when that one-digit decision determines an infinite p-adic square root. Valuations then account for powers of the prime. A finite-field question and an infinite limiting question meet through the derivative's invertibility.

## 29.14 Faster lifting by doubling precision

The one-digit method is the clearest proof, but it is not the fastest computational version. Suppose an integer $a$ satisfies $f(a)\equiv0\pmod{p^k}$ and $p\nmid f'(a)$. Choose an inverse $u$ of $f'(a)$ modulo $p^{2k}$, and define

$$
b\equiv a-u f(a)\pmod{p^{2k}}.
$$

The correction $h=b-a$ is divisible by $p^k$, because $f(a)$ is. The polynomial expansion gives $f(b)=f(a)+hf'(a)+h^2R$. The first two terms cancel modulo $p^{2k}$ by the inverse choice, and the final term is divisible by $p^{2k}$. Thus $b$ is a root modulo $p^{2k}$ that agrees with $a$ modulo $p^k$.

This is a Newton-style update with exact modular arithmetic. Starting at one digit, it gives precision exponents $1,2,4,8,\ldots$ rather than $1,2,3,4,\ldots$. The number of update stages is smaller, although each later stage uses arithmetic on larger integers. Efficient implementation also improves derivative inverses incrementally; the elementary extended Euclidean algorithm suffices for the sizes in the companion.

There is no need to divide by a potentially nonintegral real number. The symbol $u$ is an integer representative of a modular inverse, and all operations occur modulo a stated power. The derivative hypothesis guarantees this inverse. Without it, the update is undefined in precisely the cases where the one-digit theorem also loses its uniqueness guarantee.

For the square-root example at seven, $a=10$ is already correct modulo forty-nine. A doubling step can jump directly to a representative correct modulo $7^4$. The unique simple-root continuation must agree with the representative $2166$ found by the slower method. Comparing the two procedures provides an independent computational check, because both are constrained by the same uniqueness theorem.

## 29.15 Ideals reveal a local principal ideal domain

The valuation description makes the ideal structure of $\mathbb Z_p$ unusually transparent. Let $I$ be a nonzero ideal. The valuations of its nonzero elements form a nonempty set of nonnegative integers, so there is a smallest value $r$. Choose $x\in I$ with $v_p(x)=r$ and write $x=p^r u$ with $u$ a unit.

Because $I$ is an ideal, multiplying $x$ by $u^{-1}$ shows that $p^r\in I$. Hence every multiple of $p^r$ belongs to $I$. Conversely, every nonzero element of $I$ has valuation at least $r$, so it is a multiple of $p^r$. Thus

$$
I=(p^r).
$$

The zero ideal is principal too. Therefore $\mathbb Z_p$ is a principal ideal domain. Its nonzero ideals are arranged in the chain $(1)\supset(p)\supset(p^2)\supset\cdots$. The only maximal ideal is $(p)$, since the quotient by it is $\mathbb F_p$, while every element outside it is a unit and cannot lie in a proper ideal.

A ring with a unique maximal ideal is called a local ring. The word local here reflects a precise algebraic property, not merely that computations use small numbers. Passing from the integers to $\mathbb Z_p$ isolates one prime's divisibility behavior. Ordinary primes different from $p$ become units, while powers of $p$ organize every nonzero ideal.

This does not identify $\mathbb Z_p$ with the localization $\mathbb Z_{(p)}$, whose elements are rational numbers with denominator not divisible by $p$. That localization embeds in $\mathbb Z_p$, but the p-adic ring also contains limits such as a seven-adic square root of two that are not rational. Localization allows specified denominators; completion adds limits. They are different operations that can be related without being confused.

## 29.16 Root trees and compatibility

Suppose a polynomial has at least one root modulo $p^k$ for every $k$, but no particular sequence of roots has been chosen. Does a compatible root still exist? Yes, and finite branching explains why. Arrange roots in levels, connecting a root at level $k+1$ to the root obtained by reduction at level $k$. Each vertex has at most $p$ children.

Among the finitely many roots modulo $p$, at least one has descendants at arbitrarily high levels; otherwise finitely many upper bounds would give a global upper bound on the tree's height. Choose that root. Among its finitely many children, one again has descendants at arbitrarily high levels. Continue this choice inductively. The selected vertices form a compatible chain, defining a p-adic root.

This is a special finite-branching tree argument, often called König's lemma. It proves that roots at every precision imply a p-adic root, even when singular branching prevents the simple algorithm from choosing uniquely. The condition “every precision” is essential. A large but finite collection of successful tests still permits all branches to die later.

Even roots in every p-adic environment do not automatically solve every possible global equation over the integers or rationals. Local-to-global principles are theorems for specific classes of equations, and they can fail outside their hypotheses. This course uses local congruences as reliable obstructions and Hensel as a reliable root-construction theorem, without claiming an unrestricted local-to-global principle.

## 29.17 A different rule for convergent series

The strong triangle inequality makes p-adic series behave differently from real series. For terms $u_n\in\mathbb Z_p$, the series $\sum_{n\ge0}u_n$ converges if and only if $u_n\to0$ p-adically. Necessity follows in every metric field by subtracting consecutive partial sums. Sufficiency is special to the strong triangle inequality and completeness.

To prove sufficiency, fix a precision $p^k$. Since $u_n\to0$, every sufficiently late term is divisible by $p^k$. Every finite sum of those late terms is also divisible by $p^k$. Equivalently, the distance between any two sufficiently late partial sums is at most $p^{-k}$. Thus the partial sums are Cauchy. Completeness gives their limit. In valuation language, a tail cannot have smaller valuation than the minimum valuation of its terms.

Compare this with the real harmonic series. Its terms tend to zero, but many small positive terms can add up to an arbitrarily large tail. In the p-adic metric, the strong inequality prevents a collection of individually p-adically small terms from creating a larger distance. The word “small” means high divisibility, so it is unsurprising arithmetically: a sum of multiples of a large prime power remains a multiple of that power.

For instance, $\sum_{n\ge0}p^n$ converges p-adically because $|p^n|_p=p^{-n}\to0$. The identity with $1/(1-p)$ was verified earlier by finite multiplication. Another example is $\sum_{n\ge1}n!$. For any fixed $k$, once $n\ge kp$, the factorial contains at least $k$ multiples of $p$, so $v_p(n!)\ge k$. Therefore $n!\to0$ p-adically and the factorial series converges in $\mathbb Z_p$.

As a real series, the same factorial series diverges violently because its terms do not even approach zero. There is no contradiction: both the terms and the addition are the same rational arithmetic, but the topology controlling convergence is different. A limit is always a limit with respect to a specified notion of distance.

This contrast helps interpret the entire chapter. We did not change the integers' multiplication table or declare incompatible ordinary equations true. We enlarged the space and changed which sequences count as Cauchy. The resulting completion preserves polynomial identities, introduces new roots, and turns divisibility information into exact limiting numbers. Keeping arithmetic, embedding and topology separate makes the unfamiliar notation much less mysterious.

A practical finite-precision representation should record both the residue and its modulus. The printed integer $10$ might mean an exact ordinary integer, a residue modulo forty-nine, or the first two digits of a seven-adic root. Those are different claims. A lift should preserve the earlier residue and certify the polynomial congruence at the new modulus. These two checks catch distinct mistakes: an unrelated root at the new modulus may satisfy the equation but fail compatibility, while a compatible candidate may fail the equation. Hensel's proof guarantees both properties for the specified update, and an implementation can verify them independently at every finite stage.

## 29.18 Optional practice

1. Lift the root $a=2$ of $X^2+1$ modulo five to roots modulo twenty-five and one hundred twenty-five.
2. Lift the root $a=1$ of $X^3-2$ modulo seven, or explain why the stated starting value is invalid.
3. Find all roots of $X^2-1$ modulo eight and determine which classes lift to modulo sixteen.
4. Prove that $-1$ has all digits $p-1$ in its p-adic expansion.
5. Compute the inverse of three modulo $5$, $25$ and $125$, and recover its first three base-five digits.
6. Determine which of $7/10$, $3/7$ and $25/6$ belong to $\mathbb Z_5$, giving their five-adic valuations.
7. Prove that when $v_p(x)\ne v_p(y)$, equality holds in $v_p(x+y)\ge\min(v_p(x),v_p(y))$.
8. Explain why the existence of a seven-adic square root of two does not imply an integer square root, and why failure modulo four does exclude a two-adic square root.

[Hints and full solutions](../solutions/29-solutions.md) include a deliberately invalid initial root in Problem 2. The final chapter brings the course's structures together in finite-field error-correcting codes and offers guided investigations that require moving between arithmetic, algebra and careful proof.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](28-analysis-and-primes.md) · [Next chapter](30-synthesis-and-coding.md) · [Hints and solutions](../solutions/29-solutions.md)
