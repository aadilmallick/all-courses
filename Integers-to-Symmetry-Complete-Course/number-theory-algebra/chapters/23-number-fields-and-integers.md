# Chapter 23 — Number fields, algebraic integers and failed factorization

The identity $6=2\cdot3$ looks completely settled in the ordinary integers. In the larger ring $\mathbb Z[\sqrt{-5}]$, another factorization appears:

$$
6=(1+\sqrt{-5})(1-\sqrt{-5}).
$$

Are these merely two ways of grouping the same prime factors, or has unique factorization actually failed? Before answering, we need to decide what counts as an integer in a number field. The answer is more subtle than “use integer coefficients in a familiar basis.” In $\mathbb Q(\sqrt5)$, for example, $(1+\sqrt5)/2$ behaves as an integer even though its displayed coefficients have denominators.

Our goals are to identify the correct integer ring, use norms to prove an explicit failure of unique factorization, and understand how ideals recover part of the lost arithmetic. The prerequisites are field degrees, polynomial irreducibility, ideals, quotients, and the Euclidean-domain hierarchy. We introduce the required determinant facts locally. Some general theorems of algebraic number theory are marked as further results rather than presented as proofs completed here.

## 1. A field of numbers and its integer part

A number field is a finite extension $K/\mathbb Q$. Every element is algebraic over $\mathbb Q$ by the finite-dimensional dependence argument from Chapter 22. Examples include $\mathbb Q(\sqrt2)$, $\mathbb Q(\sqrt{-5})$, and $\mathbb Q(\sqrt[3]2)$. The real or complex appearance of the generators does not affect the definition. Finiteness of the extension degree is the defining condition.

An algebraic integer is a complex algebraic number satisfying a monic polynomial with coefficients in $\mathbb Z$. Inside a number field $K$, the set of algebraic integers is denoted $\mathcal O_K$ and called its ring of integers. We will prove that it is a ring; the terminology is not a substitute for that proof.

The monic condition matters. Every rational number is algebraic over $\mathbb Q$, but not every rational number should be an integer. For instance, $1/2$ satisfies $2X-1=0$, which is not monic. We claim that a rational algebraic integer is an ordinary integer.

Write a rational number in lowest terms as $a/b$, with $b>0$ and $\gcd(a,b)=1$. If it satisfies a monic degree-$n$ equation, multiply that equation by $b^n$:

$$
a^n+c_{n-1}a^{n-1}b+\cdots+c_0b^n=0.
$$

Every term except the first is divisible by $b$, so $b\mid a^n$. Coprimality implies $b=1$. Thus

$$
\mathcal O_{\mathbb Q}=\mathbb Z.
$$

The definition therefore extends the familiar integers rather than merely borrowing their name. The positive leading coefficient one ensures that a denominator cannot hide in the leading term and cancel against the rest of the equation.

Every ordinary integer is an algebraic integer because $m$ satisfies $X-m=0$. The number $\sqrt d$ is an algebraic integer for every integer $d$, because it satisfies $X^2-d=0$. The number $\omega=(1+\sqrt5)/2$ satisfies $\omega^2-\omega-1=0$, so it is an algebraic integer too. Its denominator does not prevent integrality because the polynomial relation, not the appearance of one coordinate expression, is the criterion.

## 2. Why sums and products remain integral

If $\alpha$ and $\beta$ satisfy monic integer polynomials, we want to prove that $\alpha+\beta$ and $\alpha\beta$ do as well. Adding the two equations does not directly produce a polynomial in the sum. A finite-module argument provides the missing bridge.

Suppose the equations have degrees $r$ and $s$. The relation for $\alpha$ rewrites $\alpha^r$ as an integer combination of lower powers. Repeated substitution reduces every higher power. The same holds for $\beta$. Consequently every element of the ring $\mathbb Z[\alpha,\beta]$ is an integer combination of the finitely many products

$$
\alpha^i\beta^j,\qquad0\leq i<r,\quad0\leq j<s.
$$

This spanning list includes one. It need not be independent over the integers; independence is unnecessary for the argument. Let its members be $w_1,\ldots,w_N$, choosing $w_1=1$. For any $\gamma\in\mathbb Z[\alpha,\beta]$, each product $\gamma w_i$ is an integer combination of the same list. Choose integer coefficients recording these combinations in a matrix $M$.

The equations can be written $(\gamma I-M)w=0$, after selecting a consistent row convention for the column $w$ of spanning elements. Here $I$ is the identity matrix. We need a standard matrix identity: for a square matrix $A$ over a commutative ring,

$$
\operatorname{adj}(A)A=\det(A)I.
$$

The determinant is the signed sum of products obtained by choosing one entry from each row and each column; the signs are permutation parities. The adjugate is the transpose of the signed matrix of determinants formed by deleting a row and column. Expanding the product gives the determinant on the diagonal. Off the diagonal the corresponding expansion has a repeated row or column, so its terms cancel in opposite-sign pairs. This establishes the identity without dividing by anything.

Apply it to $A=\gamma I-M$. We obtain $\det(\gamma I-M)w_i=0$ for every $i$. Since $w_1=1$, the determinant itself is zero. But $\det(TI-M)$ is a monic polynomial in $T$ with integer coefficients: its highest-degree term is the product of the diagonal $T$ terms, and every other term has lower degree. Hence $\gamma$ is an algebraic integer.

In particular $\alpha+\beta$, $\alpha\beta$, and $-\alpha$ are integral. The set $\mathcal O_K$ contains zero and one and is closed under addition, subtraction, and multiplication, proving that it is a ring. The proof shows why finitely many coordinates matter, while also explaining why a basis was not required. A generating list containing one is enough for the determinant trick.

## 3. Conjugation, trace and norm in a quadratic field

Let $d$ be a squarefree integer other than zero or one. Squarefree means no prime square divides $d$. Put $K=\mathbb Q(\sqrt d)$. Every element is $a+b\sqrt d$ with rational $a,b$. Its conjugate is $a-b\sqrt d$. Conjugation respects addition and multiplication and fixes every rational number, so it is a field automorphism.

Define the trace and norm by

$$
\operatorname{Tr}(a+b\sqrt d)=2a,\qquad
N(a+b\sqrt d)=a^2-db^2.
$$

They are respectively the sum and product of the element and its conjugate. The trace is additive, while the norm is multiplicative:

$$
N(xy)=xy\overline{xy}=x\bar x\,y\bar y=N(x)N(y).
$$

The rearrangement uses commutativity. Norms may be negative in real quadratic fields, so inequalities involving them require care. In imaginary quadratic fields with $d<0$, $a^2-db^2=a^2+|d|b^2$ is nonnegative and vanishes only at zero.

These quantities also arise from coordinates. Multiplication by $a+b\sqrt d$ in the basis $1,\sqrt d$ has matrix

$$
\begin{pmatrix}a&db\\b&a\end{pmatrix}.
$$

The trace of a square matrix is the sum of its diagonal entries, here $2a$. The determinant is $a^2-db^2$. Thus the field trace and norm agree with the trace and determinant of multiplication. In higher-degree number fields this coordinate definition generalizes them. We use the quadratic formulas directly, so no general spectral theory or eigenvalue results are assumed.

Every element $x=a+b\sqrt d$ satisfies

$$
X^2-\operatorname{Tr}(x)X+N(x)=0
$$

at $X=x$, because this polynomial is $(X-x)(X-\bar x)$. If $x$ is not rational, it is its degree-two minimal polynomial over $\mathbb Q$. If $x$ is rational, the polynomial is a square of a linear factor, so we should not call it minimal.

If $x$ is an algebraic integer, its conjugate is integral: apply conjugation to a monic integer polynomial vanishing at $x$. Closure under sums and products makes $\operatorname{Tr}(x)$ and $N(x)$ algebraic integers. They are rational, so the rational-integrality lemma makes them ordinary integers. Conversely, if both trace and norm are integers, the displayed monic polynomial proves that $x$ is integral. We have obtained an exact quadratic integrality test.

## 4. Deriving the quadratic integer ring

Write $x=a+b\sqrt d$ with rational coefficients, and suppose it is integral. Its trace gives $t=2a\in\mathbb Z$. Its norm $n=a^2-db^2$ is also an integer. Therefore

$$
t^2-4n=d(2b)^2\in\mathbb Z.
$$

We claim that $s=2b$ is an integer. Write $s=u/v$ in lowest terms with $v>0$. The condition says $v^2\mid du^2$. Since $u$ and $v$ are coprime, every prime dividing $v$ would have its squared power dividing the squarefree integer $d$, impossible. Thus $v=1$.

Hence every integral element has the form $(t+s\sqrt d)/2$ with integers $t,s$, and its norm is integral exactly when

$$
t^2-ds^2\equiv0\pmod4.
$$

Squares modulo four are zero or one. If $d\equiv2$ or $3\pmod4$, an odd $s$ would make $t^2$ congruent to two or three, impossible. Thus $s$ is even and then $t$ is even. The element lies in $\mathbb Z[\sqrt d]$.

If $d\equiv1\pmod4$, the congruence instead says that $t$ and $s$ have the same parity. When both are even, we again get integer coefficients. When both are odd, write

$$
\frac{t+s\sqrt d}{2}=\frac{t-s}{2}+s\frac{1+\sqrt d}{2}.
$$

Both displayed coefficients are integers. Conversely every element described by these parity conditions has integral trace and norm, so the quadratic test proves it is integral. We conclude

$$
\mathcal O_K=
\begin{cases}
\mathbb Z[\sqrt d],&d\equiv2,3\pmod4,\\
\mathbb Z[(1+\sqrt d)/2],&d\equiv1\pmod4.
\end{cases}
$$

The squarefree assumption matters. If one writes $\mathbb Q(\sqrt{12})$, first replace it by $\mathbb Q(\sqrt3)$. Applying a memorized formula to the non-squarefree radicand twelve can hide integers such as $\sqrt3$ that are not in $\mathbb Z[\sqrt{12}]$.

For $d=5$, the ring has basis $1,\omega$ over $\mathbb Z$, where $\omega=(1+\sqrt5)/2$ and $\omega^2=\omega+1$. For $d=-5$, we have $-5\equiv3\pmod4$, so the integer ring is exactly $\mathbb Z[\sqrt{-5}]$. The opening factorization therefore takes place in the full ring of integers, not an accidentally undersized subring.

## 5. Norms detect units and irreducibility

For a quadratic algebraic integer $u$, being a unit implies $N(u)=\pm1$, because $uv=1$ gives $N(u)N(v)=1$ with both factors integers. Conversely, if $N(u)=\pm1$, then $u^{-1}=\bar u/N(u)$ lies in the integer ring. Thus a quadratic integer is a unit exactly when its norm is plus or minus one.

In $R=\mathbb Z[\sqrt{-5}]$, the norm is

$$
N(a+b\sqrt{-5})=a^2+5b^2,\qquad a,b\in\mathbb Z.
$$

The equation $N(u)=1$ forces $b=0$ and $a=\pm1$. These are the only units. Any nonzero nonunit has norm at least two. Two elements are associates if one is a unit times the other; here that means they differ only by sign.

There is no element of norm two or three. If $b=0$, the norm is the square $a^2$, never two or three. If $b\ne0$, the norm is at least five. Now $N(2)=4$. A factorization of two into two nonunits would factor four into integer norms both at least two, forcing norms two and two, impossible. Thus two is irreducible.

Similarly $N(3)=9$. A nonunit factorization would force norms three and three, also impossible. The elements $1\pm\sqrt{-5}$ have norm six. A nonunit factorization would force norms two and three in some order, impossible. Therefore both are irreducible.

We have proved that

$$
2\cdot3=(1+\sqrt{-5})(1-\sqrt{-5})
$$

is genuinely a pair of factorizations into irreducibles. The factors two and three have norms four and nine, whereas the other factors have norm six, so the two lists cannot be matched by associates. Even the two norm-six factors are not associates of one another: they are neither equal nor negatives. Unique factorization fails.

The element two is irreducible but not prime. It divides the product $(1+\sqrt{-5})(1-\sqrt{-5})=6$, but it divides neither factor, because division by two gives coefficients $1/2$ and $\pm1/2$ in the basis $1,\sqrt{-5}$, not integers. In a UFD, irreducible elements are prime. This explicit distinction shows exactly which familiar integer argument breaks.

## 6. Ideals capture divisibility more flexibly

The ideal $(a,b)$ in a ring consists of all combinations $ra+sb$ with $r,s$ in the ring. It is not merely the set containing the two displayed generators. In $R$, put $s=\sqrt{-5}$ for shorter formulas and define

$$
\mathfrak p_2=(2,1+s),\qquad
\mathfrak p_3=(3,1+s),\qquad
\mathfrak q_3=(3,1-s).
$$

These are proper prime ideals. To see this for $\mathfrak p_2$, map $R$ to $\mathbb F_2$ by sending $s$ to one and reducing integer coefficients modulo two. The defining relation is preserved because $1^2=-5$ in characteristic two. The kernel is $(2,1+s)$: modulo those generators, every expression reduces to its value at $s=1$ modulo two. The quotient is the field $\mathbb F_2$, so the ideal is maximal and therefore prime.

For $\mathfrak p_3$, send $s$ to $-1$ modulo three; for $\mathfrak q_3$, send it to one. Both values square to $-5\equiv1\pmod3$. The quotient in each case is $\mathbb F_3$, proving maximality. The two ideals are distinct because the corresponding values of $s$ are distinct modulo three.

The product of ideals is the set of finite sums of products of elements from them. If ideals have finite generating lists, their product is generated by all pairwise products of those generators. This definition differs from intersection, although coprime ideals have product equal to intersection.

Let us compute $\mathfrak p_2^2$. Its generators are $4$, $2(1+s)$, and $(1+s)^2=-4+2s$. They are all multiples of two, so $\mathfrak p_2^2\subseteq(2)$. Conversely,

$$
2(1+s)-(-4+2s)=6,
$$

and $6-4=2$, so two belongs to the product ideal. Hence $(2)\subseteq\mathfrak p_2^2$ and

$$
(2)=\mathfrak p_2^2.
$$

Similarly $\mathfrak p_3\mathfrak q_3$ is generated by $9$, $3(1+s)$, $3(1-s)$, and six. All are multiples of three, and $9-6=3$, so

$$
(3)=\mathfrak p_3\mathfrak q_3.
$$

Finally $\mathfrak p_2\mathfrak p_3=(1+s)$. Every product generator is a multiple of $1+s$, since $6=(1+s)(1-s)$. Conversely the product ideal contains $3(1+s)-2(1+s)=1+s$. Replacing $s$ by $-s$ gives $(1-s)=\mathfrak p_2\mathfrak q_3$, because $(2,1+s)=(2,1-s)$.

The two element factorizations of six now give the same ideal factorization:

$$
(6)=\mathfrak p_2^2\mathfrak p_3\mathfrak q_3.
$$

We have directly verified this example. The general theorem says that every nonzero ideal in the full integer ring of a number field factors uniquely into nonzero prime ideals. Its full proof requires additional ideal theory and is not supplied here. Our concrete computations explain the theorem's purpose and show that it is stronger than a hope based on notation.

## 7. A nonprincipal ideal is the obstruction

Why can $\mathfrak p_2$ not be generated by one element? The quotient $R/\mathfrak p_2$ has two elements. If $\mathfrak p_2=(\alpha)$, its additive index in $R$ would equal $|N(\alpha)|$. Here is the coordinate reason for that fact.

The additive group of $R$ is $\mathbb Z^2$ in the basis $1,s$. Multiplication by $\alpha=a+bs$ sends it onto the principal ideal $(\alpha)$ and has matrix $\begin{pmatrix}a&-5b\\b&a\end{pmatrix}$. Smith normal form says that the index of the image of a full-rank two-by-two integer matrix is its absolute determinant. The determinant here is $a^2+5b^2=N(\alpha)$.

Thus a principal ideal of index two would require an element of norm two, which we proved does not exist. Hence $\mathfrak p_2$ is nonprincipal. In particular $R$ is not a PID, agreeing with its failure to be a UFD. The ideal contains a kind of divisibility information that cannot be represented by a single element of the ring.

For a nonzero ideal $I$ whose quotient is finite, define its ideal norm by $N(I)=|R/I|$. This is a positive integer, not an element of the field. In our example the three prime ideals above have norms two, three, and three. Element norm and ideal norm are different constructions; they agree in absolute value for principal ideals in this quadratic calculation.

A later course organizes the failure of principality using the ideal class group. Roughly, nonzero fractional ideals are grouped according to whether they differ by multiplication by a principal fractional ideal. A fractional ideal is an $R$-submodule of $K$ that becomes an ordinary ideal after multiplication by some nonzero ring element. In the full integer ring of a number field, nonzero ideals have multiplicative inverses among fractional ideals, producing a group of classes.

We state that general invertibility theorem rather than assuming it from the definition. In the class group, principal ideals represent the identity. Our equality $\mathfrak p_2^2=(2)$ shows that the class of $\mathfrak p_2$ has order two, because it is nontrivial and its square is principal. We do not claim here to have computed every ideal class of this ring. The verified conclusion is the existence of a nontrivial class of order two.

## 8. How ordinary primes behave in a larger integer ring

Let us connect the ring calculations back to congruences. If $R=\mathbb Z[\sqrt d]$ is the full integer ring, reduction modulo an ordinary prime $p$ gives

$$
R/(p)\cong\mathbb F_p[X]/(X^2-d).
$$

The map sends the class of $X$ to the class of $\sqrt d$. The polynomial relation and unique two-coordinate representation prove the isomorphism. The factorization of this quadratic over $\mathbb F_p$ predicts the shape of the quotient.

If the quadratic is irreducible, the quotient is a field with $p^2$ elements. Thus $(p)$ is prime; the prime is called inert in this quadratic field. If it has two distinct roots $r,-r$, polynomial CRT gives a product $\mathbb F_p\times\mathbb F_p$. The ideal $(p)$ then has two distinct prime factors $(p,\sqrt d-r)$ and $(p,\sqrt d+r)$; the prime is called split. The distinct-root hypothesis matters for CRT because it makes the linear factors coprime.

If the quadratic has a repeated root, the quotient has a nonzero nilpotent element, meaning an element whose positive power is zero. This corresponds to ramification rather than to two distinct factors. In $\mathbb Q(\sqrt{-5})$, the prime two gives $X^2+5\equiv(X+1)^2\pmod2$, and we explicitly found $(2)=\mathfrak p_2^2$. Three gives $X^2+5\equiv(X-1)(X+1)\pmod3$, agreeing with the two factors above.

As a fresh example, modulo eleven the possible nonzero squares are $1,3,4,5,9$. The number $-5\equiv6$ is absent, so eleven is inert. Modulo seven, $-5\equiv2=3^2$, so seven splits into two distinct primes. Quadratic reciprocity can predict these outcomes for large primes without listing all squares. A theorem about congruences is now controlling factorization of ideals in a number field.

For fields whose integer ring is $\mathbb Z[(1+\sqrt d)/2]$, use the monic polynomial of that correct generator instead. Reducing $X^2-d$ without accounting for the larger integer ring can misdescribe the prime two. This is one reason the derivation of the full ring of integers was necessary before discussing prime behavior.

## 9. Working through a split prime from beginning to end

The terminology about splitting is easier to retain after one complete calculation. Stay in $R=\mathbb Z[s]$ with $s^2=-5$, and consider the ordinary prime seven. The two roots of $X^2+5$ modulo seven are three and minus three, because $3^2+5=14$. Define

$$
I=(7,s-3),\qquad J=(7,s+3).
$$

The map $R\to\mathbb F_7$ obtained by substituting $s=3$ has kernel $I$. Indeed, every $a+bs$ differs from $a+3b$ by the multiple $b(s-3)$, and its residue vanishes precisely when seven divides $a+3b$. Thus $R/I\cong\mathbb F_7$, so $I$ is maximal. Substituting $s=-3$ gives the corresponding statement for $J$. The quotient maps also show the ideals are different: the class of $s$ has two different specified values.

Their sum is the whole ring. It contains seven and $(s+3)-(s-3)=6$, hence it contains $7-6=1$. Their product is generated by $49$, $7(s-3)$, $7(s+3)$, and $(s-3)(s+3)=s^2-9=-14$. Every generator is divisible by seven. Conversely, $49+3(-14)=7$, so the product contains seven. Therefore $IJ=(7)$.

The Chinese remainder theorem now gives

$$
R/(7)\cong R/I\times R/J\cong\mathbb F_7\times\mathbb F_7.
$$

An element $a+bs$ maps to $(a+3b,a-3b)$ modulo seven. This formula is an exact coordinate translation, not just an assertion that two rings happen to have forty-nine elements. To recover $a$ and $b$ from a pair $(u,v)$, solve $2a=u+v$ and $6b=u-v$ in $\mathbb F_7$. Both two and six are nonzero and therefore invertible, giving a unique pair of coefficients. This explicitly checks bijectivity.

The quotient has zero divisors. For example, the classes of $s-3$ and $s+3$ are both nonzero modulo seven but their product is zero. They are nonzero because their coefficient of $s$ is one, which is not divisible by seven. Hence $(7)$ is not prime even though seven is a prime in the ordinary integers. Primality depends on the ring in which the divisibility statement is made.

Compare eleven. Because $X^2+5$ has no root modulo eleven, it is irreducible there. The quotient $R/(11)$ is a field of $11^2=121$ elements. Thus if eleven divides a product of elements of $R$, one factor is divisible by eleven. The ordinary integer eleven remains a prime element in this ring. The same original ring can make different rational primes behave in different ways.

The split calculation also shows why the factorization of the polynomial is the relevant object. The relation $s^2=-5$ controls every element of the ring, and reducing its coefficients modulo seven gives exactly the relation in the quotient. Distinct linear factors describe two independent evaluations. An irreducible quadratic describes a genuine degree-two field extension. A repeated factor describes an element that becomes nilpotent rather than a product decomposition.

## 10. Discriminants, correct bases, and the special prime two

The number that separates distinct roots from repeated roots is the discriminant. For a monic quadratic $X^2-tX+n$, its discriminant is $\Delta=t^2-4n$. Over a field of characteristic different from two, a repeated root occurs exactly when this number is zero: the roots, when they exist, are $(t\pm\sqrt\Delta)/2$, and equality means the square-root term vanishes.

For a quadratic integer ring with an integral basis $1,\omega$, the field discriminant is the discriminant of the minimal polynomial of $\omega$. In the two cases derived above, it is

$$
D_K=
\begin{cases}
4d,&d\equiv2,3\pmod4,\\
d,&d\equiv1\pmod4.
\end{cases}
$$

To verify the second line, take $\omega=(1+\sqrt d)/2$. Its trace is one and its norm is $(1-d)/4$, so its polynomial is $X^2-X+(1-d)/4$. The discriminant is $1-(1-d)=d$. For the first line, the generator $\sqrt d$ has polynomial $X^2-d$, whose discriminant is $4d$.

This calculation does not rely on a general definition using all field embeddings, although that broader definition agrees with it. We introduce the quadratic formula here because it directly explains which ordinary primes may produce repeated roots after reduction. In $\mathbb Q(\sqrt{-5})$, the field discriminant is minus twenty, so the primes two and five are the candidates for ramification. Our repeated-root calculation at two and the reduction $X^2+5\equiv X^2\pmod5$ display both cases.

Now contrast $\mathbb Q(\sqrt5)$. Its full integer ring uses $\omega=(1+\sqrt5)/2$, not $\sqrt5$. Modulo two, the correct defining polynomial is $X^2-X-1\equiv X^2+X+1$. It has neither zero nor one as a root, so it is irreducible over $\mathbb F_2$. Therefore two is inert in this field, and the residue field has four elements.

If we had incorrectly reduced $X^2-5$ instead, we would obtain $X^2+1=(X+1)^2$ in characteristic two and falsely predict ramification. The error would arise from using the smaller order $\mathbb Z[\sqrt5]$ in place of the full integer ring. An order is a subring of the integer ring with the same rational span; the full theory of orders is beyond this chapter, but this example shows why the distinction cannot be ignored.

There is a useful coordinate explanation of the denominator issue. The additive subgroup $\mathbb Z[\sqrt5]$ has index two in $\mathcal O_K$, because $\sqrt5=2\omega-1$. In coordinates relative to $1,\omega$, its elements have an even coefficient of $\omega$. Reducing modulo two interacts precisely with this missing half-step. At odd primes, two is invertible and the two descriptions can be converted into each other after reduction. At the prime two, that conversion is unavailable.

The same care applies to a proposed unit. The expression $(1+\sqrt5)/2$ is integral in the full ring but is not in $\mathbb Z[\sqrt5]$. Asking whether it is a unit of the smaller ring is therefore not meaningful as an internal unit question: it is not even an element there. First specify the ring, then ask for its units or prime elements. Statements about an ambient field alone do not determine divisibility in a chosen subring.

These examples also clarify what the norm can and cannot tell us about integrality. The number $x=(1+\sqrt5)/2$ has integer trace and norm and is integral. The number $y=\sqrt5/2$ has trace zero but norm $-5/4$, so it is not integral. The number $z=(1+\sqrt{13})/2$ is integral because its trace is one and norm minus three. A denominator of two is neither automatically allowed nor automatically forbidden; the parity condition derived from the norm decides.

A final comparison concerns fractions with integer norm but noninteger trace. In $\mathbb Q(\sqrt2)$, take $u=(3+\sqrt2)/2$. Its norm is $7/4$, so nonintegrality is immediate. More generally, checking only a norm equation is insufficient unless trace integrality is already guaranteed by the coordinates under consideration. The two-part criterion is the theorem: both trace and norm must be integers. In an integer basis, the condition is built into the coordinates, which is why later calculations can safely use norm divisibility alone.

The conceptual progression is deliberate. First determine the full ring of integers. Next identify a genuine integral basis. Then reduce the defining polynomial, and only then interpret roots, units, ideals, and ramification. Reversing that order can produce calculations that are internally consistent for the wrong ring.

## 11. Element primality and ideal splitting are different questions

The phrase “seven splits” refers to the ideal generated by seven. It does not necessarily mean that seven itself factors into two nonunit elements. In our ring $R=\mathbb Z[\sqrt{-5}]$, seven is actually irreducible. Its norm is forty-nine, so a nonunit factorization would require both factor norms to be seven. But $a^2+5b^2=7$ has no integer solutions: if $b=0$, it asks for a square equal to seven; if $|b|=1$, it asks for a square equal to two; if $|b|\geq2$, the left side is at least twenty. Thus the required factors do not exist.

Nevertheless seven is not prime, because the nonzero residue classes of $s-3$ and $s+3$ modulo seven have zero product. This gives another irreducible element that is not prime. Its principal ideal splits into prime ideals even though no element factorization realizes those individual ideals. The missing generators of those ideals are exactly the obstruction.

This distinction is a useful safeguard when translating between element language and ideal language. A prime element generates a nonzero prime principal ideal in an integral domain. An irreducible element need not do so. A nonzero prime ideal need not be principal. These three objects coincide in particularly well-behaved rings such as the ordinary integers, but not in every ring of integers of a number field.

Norm searches in an imaginary quadratic ring are finite for a prescribed value. To solve $a^2+5b^2=m$ with positive integer $m$, first bound $|b|\leq\sqrt{m/5}$. For each permitted integer $b$, check whether $m-5b^2$ is an integer square. No analysis theorem is needed for the bound: it is just an inequality of nonnegative integers. This method proves nonexistence once all the finitely many cases have been excluded.

For example, norm fourteen is represented by $a=3,b=1$, giving $3+s$. Its norm factors as two times seven. Since neither norm two nor norm seven is represented, $3+s$ is irreducible despite its composite norm. The same is true of $3-s$. Their product is fourteen, producing the further pair of irreducible factorizations $2\cdot7=(3+s)(3-s)$. This reinforces the mechanism already observed at six with a different rational prime.

In a real quadratic ring the corresponding norm search is not bounded in this way. The equation $a^2-2b^2=1$ admits arbitrarily large solutions because its two terms can nearly cancel. This is why a method that works by inspecting a bounded ellipse in an imaginary field does not solve Pell equations in a real field. The algebraic definition of norm is uniform; the geometry and computational behavior depend strongly on the sign of the squarefree radicand.

## 12. Units return us to Pell equations

In a real quadratic field, norms need not be positive. For $\mathbb Z[\sqrt2]$, the units are exactly the integer solutions to

$$
a^2-2b^2=1\quad\text{or}\quad a^2-2b^2=-1.
$$

The unit $1+\sqrt2$ has norm $-1$, and its square $3+2\sqrt2$ has norm one. Repeated powers give infinitely many units and therefore infinitely many Pell-type solutions. The recurrence for multiplication by $3+2\sqrt2$ sends $(a,b)$ to $(3a+4b,2a+3b)$. Starting from $(1,0)$ gives $(3,2)$ and then $(17,12)$, with norms one at every stage.

In $\mathbb Q(\sqrt5)$, the integer $\omega=(1+\sqrt5)/2$ has norm $-1$ and inverse $\omega-1$, since $\omega(\omega-1)=1$. Restricting attention to $\mathbb Z[\sqrt5]$ would omit this unit. Choosing the correct integer ring changes the unit problem as well as the factorization problem.

Imaginary quadratic rings behave differently because their norm forms are positive definite. In $\mathbb Z[\sqrt{-5}]$, the equation $a^2+5b^2=1$ leaves only two units. In Gaussian integers, $a^2+b^2=1$ gives four. This contrast follows directly from the norm formulas. We do not need to invoke the much more general unit theorem to understand these examples.

## 13. What has been proved and what remains beyond the chapter

We proved the quadratic integer-ring formula, norm criteria, a concrete nonunique factorization, explicit prime-ideal products, a nonprincipal ideal, and several splitting decisions. We stated the general unique factorization of nonzero ideals and the fractional-ideal inverse theorem as further results. Separating these statuses matters: a detailed example illuminates a general theorem but does not prove it for every number field.

A norm is a strong filter, not a complete factorization algorithm. If $N(\alpha)$ is a rational prime in an imaginary quadratic ring, then $\alpha$ is irreducible because a nonunit factorization would split that prime into norms exceeding one. If the norm is composite, irreducibility may still hold, as two, three, and $1+s$ demonstrated. One must determine which intermediate norms can actually occur.

It is also useful to distinguish the integer ring from the ambient number field. Every nonzero element of $K$ has an inverse in $K$, but that inverse need not remain integral. The ordinary integer two is integral, while its inverse one half is not integral by the rational-integrality lemma. Thus the integer ring is a domain contained in a field, rather than a field itself. Divisibility becomes interesting precisely because inverses are restricted. If we performed all our factorization questions in $K$, every nonzero element would be a unit and distinctions between primes and composite elements would disappear. The chosen ring determines which factorizations carry arithmetic information.

The [browser companion](../companion/index.html) provides polynomial-quotient and finite-field computations that support the reduction-modulo-prime viewpoint. It does not compute arbitrary rings of integers or ideal class groups. The ideal identities here can be checked directly from the displayed generators, and that exact calculation remains their justification.

The guiding connection is now complete: enlarging a field changes which elements count as integers, which ordinary primes split, and whether element factorization remains unique. Ideals retain enough structure to repair the factorization story. Finite fields, developed next, are both useful fields in their own right and the residue arithmetic that appears when number-field integers are reduced modulo prime ideals.

## Optional exercises

1. Prove that $3/2$ is not an algebraic integer, and identify a monic integer polynomial for $2+\sqrt3$.
2. Determine the full integer rings of $\mathbb Q(\sqrt{13})$ and $\mathbb Q(\sqrt{-6})$.
3. Compute the trace, norm, and inverse of $2+\sqrt3$, and decide whether it is a unit in the integer ring.
4. Prove that $1+\sqrt{-5}$ is irreducible and that two does not divide it in $\mathbb Z[\sqrt{-5}]$.
5. Verify directly that $(3,1+s)(3,1-s)=(3)$ when $s^2=-5$.
6. Prove that $(2,1+s)$ is nonprincipal using its quotient size and the norm formula.
7. Determine whether seven and eleven split or remain inert in $\mathbb Q(\sqrt{-5})$, giving the relevant residue calculations.
8. Show that multiplication by $3+2\sqrt2$ sends a norm-one integer pair $(a,b)$ to $(3a+4b,2a+3b)$, and compute the next pair after $(17,12)$.

[Hints and complete worked solutions](../solutions/23-solutions.md).

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](22-field-extensions.md) · [Next chapter](24-finite-fields.md) · [Hints and solutions](../solutions/23-solutions.md)
