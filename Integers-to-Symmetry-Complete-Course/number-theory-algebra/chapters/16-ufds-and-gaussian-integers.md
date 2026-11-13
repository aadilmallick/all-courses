# Chapter 16 — Euclidean domains, PIDs, UFDs and Gaussian integers

## When the integers stop being the only arithmetic

The number $65$ has two visible representations as a sum of squares:

$$
65=1^2+8^2=4^2+7^2.
$$

This looks like an isolated numerical curiosity until we permit a new kind of integer. Introduce a symbol $i$ satisfying $i^2=-1$. Then the first equality becomes $65=(1+8i)(1-8i)$ and the second becomes $65=(4+7i)(4-7i)$. A question about squares has become a question about factorization. The central purpose of this chapter is to explain why this change of viewpoint works and when it is justified.

We will not assume that factorization behaves well merely because expressions resemble ordinary integers. In earlier chapters, unique factorization in $\mathbb Z$ followed from the Euclidean algorithm and Euclid's lemma. Here we identify exactly which parts of that reasoning survive in other rings. The resulting chain is

$$
\text{Euclidean domain}\Longrightarrow\text{principal ideal domain}
\Longrightarrow\text{unique factorization domain}.
$$

The arrows express sufficient conditions. They do not mean that all three definitions describe the same class of rings. Keeping this distinction clear prevents several common mistakes later, especially in number fields.

The prerequisites are the definitions of an integral domain, an ideal, a quotient ring and polynomial division. Recall that an integral domain is a commutative ring with identity, with $1\ne0$, and with no zero divisors. Cancellation holds for nonzero factors in a domain. An ideal is an additive subgroup closed under multiplication by arbitrary ring elements. The principal ideal $(a)$ consists of all multiples of $a$. We will repeatedly translate between divisibility language and ideal language, explaining the direction of each translation.

## Divisibility needs units and associates

In a domain $R$, write $a\mid b$ when $b=ac$ for some $c\in R$. The definition is unchanged from integer arithmetic, but the factors allowed now belong to $R$. Thus $2$ does not divide $1$ in $\mathbb Z$, while $2$ does divide $1$ in $\mathbb Q$, because $1=2(1/2)$. Divisibility is always relative to the ring under discussion.

A unit is an element with a multiplicative inverse in the ring. The units of $\mathbb Z$ are $1$ and $-1$. Every nonzero rational number is a unit in $\mathbb Q$. Units cannot serve as meaningful building blocks in factorization because they can be inserted or removed freely. For instance, $6=2\cdot3=(-2)(-3)$ should not count as two genuinely different factorizations.

Two nonzero elements $a,b$ are associates if $a=ub$ for a unit $u$. In a domain, this is equivalent to saying that $a\mid b$ and $b\mid a$. To prove the less immediate direction, write $b=ac$ and $a=bd$. Substitution gives $a=acd$. Cancel nonzero $a$ to obtain $cd=1$, so $c$ is a unit. The cancellation step is precisely where the domain hypothesis is used.

An element $r$ is irreducible if it is nonzero, is not a unit, and whenever $r=ab$, at least one of $a,b$ is a unit. An element $p$ is prime if it is nonzero, is not a unit, and $p\mid ab$ implies $p\mid a$ or $p\mid b$. Irreducibility concerns possible factorizations of one element. Primality concerns how that element divides products. They are different definitions, even though they coincide in the integers.

Every prime element in a domain is irreducible. Suppose $p=ab$. Since $p\mid ab$, primality gives, say, $p\mid a$. Write $a=pc$. Then $p=pcb$, and cancellation gives $1=cb$, so $b$ is a unit. The converse requires additional hypotheses and is one of the main achievements below.

For comparison, take the domain $\mathbb Z[\sqrt{-5}]$, consisting of $a+b\sqrt{-5}$ with integer coefficients. Its norm $a^2+5b^2$ shows that $2$ is irreducible: a nontrivial factorization would require an element of norm $2$, and $a^2+5b^2=2$ has no integer solution. Yet $2$ divides

$$
(1+\sqrt{-5})(1-\sqrt{-5})=6
$$

without dividing either factor, since divisibility by $2$ would require both coefficients to be even. Thus irreducible need not mean prime. Chapter 23 returns to this example; here it warns us not to smuggle integer theorems into an unfamiliar ring.

## A Euclidean function is a controlled remainder mechanism

A Euclidean domain is a domain $R$ with a function $\delta:R\setminus\{0\}\to\mathbb N$ such that, whenever $a,b\in R$ and $b\ne0$, there exist $q,r\in R$ with

$$
a=bq+r,
\qquad r=0\text{ or }\delta(r)<\delta(b).
$$

Some books impose extra conditions on a Euclidean function. We use only the remainder condition just stated. This is enough for every argument here. The natural number assigned to a nonzero remainder measures progress; it need not be an ordinary absolute value.

For $\mathbb Z$, use $\delta(a)=|a|$. Integer division supplies the required remainder. For $F[x]$, where $F$ is a field, use $\delta(f)=\deg f$. Polynomial long division works because the leading coefficient of the divisor is invertible. This explains why the field hypothesis matters: division in $\mathbb Z[x]$ by $2x+1$ cannot always eliminate an arbitrary leading term using integer coefficients.

A Euclidean algorithm repeatedly replaces a pair $(a,b)$ by $(b,r)$, where $a=bq+r$. The value of $\delta$ on nonzero remainders strictly decreases, so the algorithm must stop. A strictly decreasing sequence of natural numbers cannot continue indefinitely. No calculus or limiting argument is involved.

The common-divisor invariant is algebraic. If $d$ divides $a$ and $b$, it divides $a-bq=r$. If it divides $b$ and $r$, it divides $bq+r=a$. Therefore the common divisors of $(a,b)$ and $(b,r)$ coincide. The last nonzero remainder is consequently a greatest common divisor, understood up to multiplication by a unit.

Back substitution expresses that gcd as $sa+tb$ with $s,t\in R$. This is Bezout's identity in its appropriate setting. It does not assert that every domain has Bezout identities. It says that this algorithmic mechanism supplies them in a Euclidean domain.

## Why Euclidean division makes every ideal principal

A principal ideal domain, abbreviated PID, is an integral domain in which every ideal is principal. We prove the first arrow in the structural chain.

Let $R$ be a Euclidean domain and let $I$ be an ideal. If $I=\{0\}$, then $I=(0)$. Suppose instead that $I$ contains a nonzero element. The set of natural numbers $\delta(a)$ for nonzero $a\in I$ has a least member. Choose $d\in I$ realizing it. We claim that $I=(d)$.

Because $d\in I$ and $I$ is an ideal, every multiple of $d$ lies in $I$, so $(d)\subseteq I$. For the opposite inclusion, take any $a\in I$ and divide by $d$:

$$
a=dq+r.
$$

Both $a$ and $dq$ lie in $I$, so $r=a-dq$ lies in $I$. If $r$ were nonzero, its Euclidean value would be smaller than the chosen minimum. Thus $r=0$, and $a\in(d)$. Both inclusions hold, proving the claim.

Notice the proof's architecture. We did not choose a numerically smallest ring element, because an arbitrary ring has no ordering. We chose an element with smallest Euclidean value. We did not assume a division remainder belongs to the ideal; we proved it using ideal closure. These details are the conceptual bridge from integer gcds to ideal theory.

In any PID, the ideal generated by two elements has a generator:

$$
(a,b)=\{sa+tb:s,t\in R\}=(d).
$$

Since $a,b\in(d)$, $d$ divides both. Since $d\in(a,b)$, it is a linear combination of them. Every common divisor then divides $d$. Thus a generator of $(a,b)$ is a gcd and supplies Bezout's identity even if no Euclidean algorithm is known. The ideal formulation retains the theorem while separating it from a particular computation method.

## Why a PID has enough factors

A unique factorization domain, abbreviated UFD, is a domain in which every nonzero nonunit has a factorization into irreducibles, and any two such factorizations differ only by order and replacement of factors by associates. There are two requirements: factors must exist, and they must be unique in the stated sense. A proof of uniqueness alone does not establish a UFD.

We first prove a finiteness property of ideals in a PID. Suppose

$$
I_1\subseteq I_2\subseteq I_3\subseteq\cdots
$$

is an increasing chain of ideals. Its union $I$ is an ideal. To check addition, take $x,y\in I$; each lies in some member of the chain, so both lie in the larger of those two members. Their difference lies there too. Multiplication by any ring element also remains in that member. Because $R$ is a PID, $I=(d)$ for some $d$. The element $d$ belongs to one $I_N$. Every multiple of $d$ then belongs to $I_N$, giving $I\subseteq I_N$. Consequently all later ideals equal $I_N$.

This property is called the ascending chain condition on ideals. The name records what we proved: ideals cannot increase strictly forever. It supplies the termination argument that a norm supplied in the integers.

Suppose a nonzero nonunit $a_0$ could not be factored into irreducibles. It is not itself irreducible, so $a_0=a_1b_1$ with both factors nonunits. At least one factor cannot be factored into irreducibles, otherwise multiplying their factorizations would factor $a_0$. Call that factor $a_1$. Repeat to obtain $a_1=a_2b_2$, and so on.

The corresponding ideals satisfy $(a_0)\subsetneq(a_1)\subsetneq(a_2)\subsetneq\cdots$. Inclusion holds because $a_{j+1}$ divides $a_j$. It is strict: equality would make the two generators associates, which would force the other factor $b_{j+1}$ to be a unit after cancellation. This contradicts the ascending chain condition. Therefore every nonzero nonunit has an irreducible factorization.

The direction of ideal inclusion deserves emphasis. A number with more divisibility conditions generates a smaller ideal: $(12)\subseteq(6)$ in $\mathbb Z$. Factoring off a nonunit enlarges the principal ideal. Confusing this reversal makes the chain argument look mysterious.

## Why irreducible becomes prime in a PID

Let $p$ be irreducible in a PID, and suppose $p\mid ab$. If $p\mid a$, the prime condition is already satisfied. Otherwise take a gcd $d$ of $p$ and $a$, obtained by generating $(p,a)$. Since $d\mid p$, irreducibility implies that $d$ is either a unit or an associate of $p$. The second possibility would imply $p\mid a$, which was excluded. Thus $d$ is a unit, and rescaling its Bezout identity gives

$$
up+va=1
$$

for suitable $u,v\in R$. Multiply by $b$:

$$
upb+vab=b.
$$

Both terms on the left are divisible by $p$, so $p\mid b$. This proves that irreducibles are prime in a PID.

Now compare two irreducible factorizations of the same nonzero nonunit:

$$
p_1p_2\cdots p_r=q_1q_2\cdots q_s.
$$

The prime element $p_1$ divides the product on the right, so it divides some $q_j$. Since $q_j$ is irreducible, that divisibility makes $p_1$ and $q_j$ associates. Reorder factors, absorb the intervening unit, and cancel one nonzero factor. Repeating proves that the numbers of factors agree and the remaining factors pair up as associates. Together with existence, this establishes PID implies UFD.

We have now earned the full chain. Its practical meaning is powerful: finding a valid Euclidean remainder procedure automatically gives principal ideals, Bezout identities, existence of irreducible factors, and uniqueness of factorization. A single algorithmic property organizes a large family of theorems.

## Constructing the Gaussian integers carefully

The complex numbers can be introduced here as ordered pairs of real numbers. We write the pair $(a,b)$ as $a+bi$, add componentwise, and multiply using

$$
(a+bi)(c+di)=(ac-bd)+(ad+bc)i.
$$

This rule follows formally from $i^2=-1$. For our arithmetic, restrict both coordinates to integers:

$$
\mathbb Z[i]=\{a+bi:a,b\in\mathbb Z\}.
$$

The multiplication rule shows closure. Associativity, distributivity and commutativity follow by expanding coordinates, or by viewing these pairs inside the complex field. The identity is $1+0i$. To see that there are no zero divisors without relying on geometry, define conjugation and norm by

$$
\overline{a+bi}=a-bi,
\qquad N(a+bi)=a^2+b^2.
$$

A direct expansion gives $z\bar z=N(z)$ and $N(zw)=N(z)N(w)$. If $zw=0$, the product of the nonnegative integers $N(z),N(w)$ is zero. One factor is zero, which means both coordinates of that factor vanish. Thus $\mathbb Z[i]$ is a domain.

The norm measures squared distance from the origin, but its arithmetic multiplicativity matters more than the picture. For example,

$$
N((2+i)(3-2i))=N(8-i)=65=5\cdot13.
$$

A Gaussian integer is a unit exactly when its norm is $1$. One direction follows from multiplicativity: if $zu=1$, then $N(z)N(u)=1$, so $N(z)=1$. Conversely, if $N(z)=1$, then $z\bar z=1$, so $\bar z$ is its inverse. The integer solutions of $a^2+b^2=1$ give precisely $1,-1,i,-i$.

Consequently a Gaussian factor has four associates, obtained by quarter turns and sign changes. Unique factorization must allow these units. For instance $1+i$ and $1-i$ are associates because $1-i=-i(1+i)$.

## Gaussian division is nearest-lattice-point division

We claim that $N$ is a Euclidean function on $\mathbb Z[i]$. Given $\alpha,\beta\in\mathbb Z[i]$ with $\beta\ne0$, form the complex quotient $\alpha/\beta=x+yi$. Choose integers $m,n$ with $|x-m|\le1/2$ and $|y-n|\le1/2$. Let $q=m+ni$ and $r=\alpha-\beta q$.

Then

$$
N(r)=N(\beta)\big((x-m)^2+(y-n)^2\big)
\le\frac12N(\beta)<N(\beta).
$$

If $r=0$, we have exact division; otherwise this is the required decrease. The geometric statement is that every point of the plane lies within squared distance $1/2$ of an integer lattice point. Ties in rounding cause no problem. The quotient and remainder need not be unique; termination requires only that some valid pair exists.

Work through $\alpha=7+5i$ and $\beta=3+2i$. Multiplying numerator and denominator by $3-2i$ gives

$$
\frac{7+5i}{3+2i}=\frac{31+i}{13}.
$$

Rounding coordinates gives $q=2$. Therefore $r=(7+5i)-2(3+2i)=1+i$. Its norm is $2$, smaller than $N(3+2i)=13$. Dividing again,

$$
\frac{3+2i}{1+i}=\frac{5-i}{2}=\frac52-\frac12i.
$$

Choose $q=2$, giving remainder $1$. The next remainder is zero, so the gcd is a unit. Back substitution gives

$$
1=(3+2i)-2(1+i)=5(3+2i)-2(7+5i).
$$

A reader can check the last equality directly. The algorithm has produced both a gcd statement and an explicit certificate of coprimality.

Since Gaussian integers are Euclidean, the preceding proofs apply without any new factorization argument: $\mathbb Z[i]$ is a PID and a UFD.

## What happens to ordinary primes

An ordinary positive prime need not remain irreducible in the larger ring. The smallest example is

$$
2=(1+i)(1-i)=-i(1+i)^2.
$$

The prime $5$ also factors: $5=(2+i)(2-i)$. By contrast, $3$ remains irreducible. Suppose $3=\alpha\beta$ with both factors nonunits. Norms would satisfy $9=N(\alpha)N(\beta)$ with both factors greater than $1$, forcing both norms to be $3$. But $a^2+b^2=3$ has no integer solution.

This extends to every ordinary prime $p\equiv3\pmod4$. Squares modulo $4$ are $0$ or $1$, so a sum of two squares cannot be congruent to $3$. If such a prime factored nontrivially in $\mathbb Z[i]$, both factors would have norm $p$, impossible. Thus it remains Gaussian irreducible and therefore Gaussian prime.

For $p\equiv1\pmod4$, we need a square root of $-1$ modulo $p$. We can obtain one without yet using quadratic reciprocity. Wilson's theorem says $(p-1)!\equiv-1\pmod p$. Its short proof pairs each nonzero residue with its inverse; only $1$ and $-1$ pair with themselves. Write $m=(p-1)/2$. Pairing $k$ and $p-k$ in the factorial gives

$$
(p-1)!\equiv(-1)^m(m!)^2\pmod p.
$$

When $p\equiv1\pmod4$, $m$ is even. Therefore $(m!)^2\equiv-1\pmod p$. Let $t=m!$.

We have $p\mid(t+i)(t-i)$ in $\mathbb Z[i]$, because their product is the ordinary integer $t^2+1$. But $p$ cannot divide $t+i$: if $t+i=p(a+bi)$, comparison of imaginary coordinates would give $1=pb$. The same reasoning excludes $p\mid t-i$. Hence $p$ is not a Gaussian prime. In a UFD irreducibles are prime, so $p$ is reducible.

Write $p=\alpha\beta$ with both factors nonunits. Their norms are integers greater than $1$ whose product is $p^2$. Since $p$ is an ordinary prime, each norm must equal $p$. Writing $\alpha=a+bi$ produces $p=a^2+b^2$. This proves the prime case of the sum-of-two-squares theorem, with every bridge from modular arithmetic to ring factorization made explicit.

## A complete sum-of-two-squares criterion

For a positive integer $n$, the criterion is:

**Theorem.** The integer $n$ is a sum of two integer squares if and only if every prime congruent to $3$ modulo $4$ occurs to an even exponent in its ordinary prime factorization.

First prove necessity. Suppose $n=a^2+b^2$ and let $p\equiv3\pmod4$ divide $n$. Since $p$ is a Gaussian prime and

$$
p\mid(a+bi)(a-bi),
$$

it divides one of these factors. Coordinate comparison gives $p\mid a$ and $p\mid b$. Thus $p^2\mid n$, and dividing both coordinates by $p$ gives another sum of squares. Repetition shows that the exponent of $p$ in $n$ is even. This argument also covers a coordinate equal to zero.

For sufficiency, $2=1^2+1^2$, every prime congruent to $1$ modulo $4$ is a sum of squares by the previous proof, and every even power $q^{2e}$ is $(q^e)^2+0^2$. Products of sums of squares remain sums of squares because

$$
(a^2+b^2)(c^2+d^2)=(ac-bd)^2+(ad+bc)^2.
$$

This identity is just norm multiplicativity written in coordinates. Multiply the representations of the prime-power factors to represent $n$.

For example, $325=5^2\cdot13$ passes the criterion. Starting with $5=2^2+1^2$ and $13=3^2+2^2$, multiply Gaussian factors:

$$
(2+i)^2(3+2i)=(3+4i)(3+2i)=1+18i.
$$

Taking norms yields $325=1^2+18^2$. Choosing conjugates differently gives other representations. In contrast, $45=3^2\cdot5$ passes and equals $3^2+6^2$, whereas $75=3\cdot5^2$ fails because the exponent of $3$ is odd. Numerical experimentation suggests patterns; the factorization theorem explains exactly which patterns are forced.

## Polynomial rings and the limits of the arrows

The ring $F[x]$ over a field is Euclidean, so it is a PID and a UFD. Its units are the nonzero constant polynomials. Consequently irreducible factorizations of polynomials are unique up to reordering and nonzero constant factors. Requiring factors to be monic removes that final ambiguity.

The ring $\mathbb Z[x]$ is also a UFD, but the proof requires Gauss's lemma: the product of primitive integer polynomials is primitive. Here primitive means that the integer coefficients have gcd $1$. To see the core argument, suppose a prime $p$ divided every coefficient of a product of two primitive polynomials. Reducing coefficients modulo $p$ would make their product the zero polynomial in $\mathbb F_p[x]$. That polynomial ring is a domain, so one factor would reduce to zero, meaning all its coefficients were divisible by $p$, a contradiction. Removing coefficient gcds then transfers factorization between $\mathbb Z[x]$ and $\mathbb Q[x]$. We will use this viewpoint more fully when discussing algebraic numbers.

However, $\mathbb Z[x]$ is not a PID. Consider the ideal $(2,x)$. If it were $(f)$, then $f$ would divide the constant polynomial $2$, so $f$ would be constant. Since it also divides $x$, that constant must be $1$ or $-1$, making the ideal the whole ring. But every polynomial in $(2,x)$ has even constant term, so $1$ is not in the ideal. This contradiction proves nonprincipality.

Thus UFD does not imply PID. Since Euclidean implies PID, this example also cannot be Euclidean under any function satisfying our definition. It is not enough to observe that one familiar norm fails. Nonexistence of every Euclidean function follows from the stronger obstruction of a nonprincipal ideal.

The reverse implication PID implies Euclidean also fails in general, though constructing and verifying an example requires more number theory than we need here. We do not use that fact as a hidden step. The useful working rule is the proved forward chain, together with the concrete warning that unique factorization does not automatically produce principal ideals.

## Interpreting quotient rings through factorization

The bridge to the preceding chapter is especially clean. In a PID, if $p$ is irreducible, then $(p)$ is maximal. To prove this, let an ideal $(d)$ contain $(p)$. The inclusion means $d\mid p$. Irreducibility says $d$ is a unit or an associate of $p$. Thus the containing ideal is either the whole ring or exactly $(p)$, which is maximality. Therefore $R/(p)$ is a field.

For Gaussian integers, quotienting by $3$ gives a field with $9$ elements. Every class has a representative $a+bi$ with $a,b\in\{0,1,2\}$. Multiplication uses $i^2=-1=2$ modulo $3$. This is the same construction as $\mathbb F_3[x]/(x^2+1)$, since $x^2+1$ has no root in $\mathbb F_3$ and is therefore irreducible of degree two.

Quotienting Gaussian integers by $5$ does not give a field. The classes of $2+i$ and $2-i$ are nonzero, but their product is zero. This is the quotient-ring shadow of $5$ splitting into Gaussian factors. The ordinary modulus is prime in $\mathbb Z$, yet it is reducible in the larger ring. Every statement involving the word prime must name its ambient ring.

One can count the quotient by a single Gaussian integer using lattice geometry, but we will not assume that result here. The examples modulo ordinary integers are enough to expose the underlying mechanism. Later finite-field constructions generalize exactly this connection between irreducible polynomials and field quotients.

## How to organize a factorization proof

When you meet a new arithmetic ring, begin by asking what the elements are and which elements are units. Next seek a multiplicative norm or a useful degree. A norm can prove that a proposed factor is irreducible because there are too few ways for its norm to split. It can also expose impossible factorizations. But a multiplicative norm does not by itself establish Euclidean division. The missing obligation is to choose a quotient whose remainder has smaller value.

For example, the function $a^2+5b^2$ on $\mathbb Z[\sqrt{-5}]$ is multiplicative, yet irreducibles need not be prime there. The norm is useful, but it does not magically supply unique factorization. In Gaussian integers, rounding both coordinates gave the stronger decrease inequality, and that was the decisive extra fact.

A second reliable tactic is to identify the ideal generated by two elements. If $(a,b)=R$, a Bezout identity exists. In a quotient, that identity often becomes an inverse formula. For instance, from $ua+vp=1$ we get $[u][a]=[1]$ modulo $(p)$. The same equation can be read as coprimality, generation of the whole ideal, or invertibility in a quotient. These are three views of one structural relationship.

Finally, distinguish finding a factorization from proving it is the only kind possible. To factor a number in a UFD, a norm or computation may find candidates. The UFD theorem then explains uniqueness. Without that theorem, a successful factorization does not rule out a structurally different second one. The example of $6$ in $\mathbb Z[\sqrt{-5}]$ makes this danger concrete.

## A worked gcd that finds a representation of a prime

The proof that a prime congruent to $1$ modulo $4$ is a sum of squares is an existence proof, but Gaussian gcds make it computational. Suppose $t^2\equiv-1\pmod p$. A gcd of $p$ and $t+i$ often exposes a factor of norm $p$. For $p=13$, take $t=5$, since $5^2+1=26$ is divisible by $13$.

Divide $13$ by $5+i$. The exact quotient in the complex field is

$$
\frac{13}{5+i}=\frac{13(5-i)}{26}=\frac52-\frac12i.
$$

Choose the nearby Gaussian integer $q=2$. The remainder is

$$
r=13-2(5+i)=3-2i.
$$

Its norm is $9+4=13$, which is smaller than $N(5+i)=26$. Now divide $5+i$ by $3-2i$:

$$
\frac{5+i}{3-2i}=\frac{(5+i)(3+2i)}{13}
=\frac{13+13i}{13}=1+i.
$$

The division is exact. The gcd is therefore $3-2i$, and taking norms immediately produces $13=3^2+2^2$. Different rounding choices can give an associate, such as $2+3i$, without changing the representation except for signs and exchange of coordinates.

Why should the gcd have norm $p$, rather than norm $1$ or $p^2$? Let $d$ generate the ideal $(p,t+i)$. If $d$ were a unit, a Bezout identity $up+v(t+i)=1$ would exist. In the quotient ring $\mathbb Z[i]/(p)$, this would make the class of $t+i$ invertible. But its product with the nonzero class of $t-i$ is zero. Multiplying that zero-product relation by the supposed inverse would force $t-i$ to be zero modulo $p$, impossible because its imaginary coefficient is $-1$. Thus $d$ is not a unit.

Also, $d$ cannot be an associate of $p$, since then $p$ would divide $t+i$, again contradicted by the imaginary coefficient. Since $d\mid p$, its norm divides $p^2$ as an ordinary integer. The only possibilities are $1,p,p^2$. The first and last were excluded, so $N(d)=p$. The algorithm is therefore not just a lucky trick: the ideal and norm arguments force the useful answer.

This is a recurring mathematical pattern. An existence theorem identifies a structure; a Euclidean algorithm turns the structure into explicit data; a norm supplies an easily checked certificate. Here the certificate is the equation $a^2+b^2=p$, which can be verified using ordinary integer arithmetic after the Gaussian computation is finished.

## Prime Gaussian integers beyond ordinary prime inputs

It is useful to know what an arbitrary Gaussian prime looks like. Let $z=a+bi$ have both coordinates nonzero. Then $z$ is Gaussian irreducible if and only if $N(z)$ is an ordinary prime. One direction is immediate: if $N(z)=p$ and $z=uv$, then $p=N(u)N(v)$ forces one norm to be $1$, making that factor a unit.

For the converse, suppose $z$ is Gaussian irreducible. Since this is a UFD, $z$ is Gaussian prime. The ordinary positive integer $N(z)=z\bar z$ factors into ordinary primes. As $z$ divides their product, Gaussian primality says that $z$ divides at least one ordinary prime $p$. Therefore $p=zw$ and $p^2=N(z)N(w)$. Since $z$ is a nonunit, its norm is either $p$ or $p^2$.

If $N(z)=p^2$, then $N(w)=1$, so $z$ is an associate of the ordinary integer $p$. Every associate of a real integer has one coordinate zero. That contradicts the assumption that both coordinates of $z$ are nonzero. Hence $N(z)=p$, as claimed.

If one coordinate is zero, say $z=a$ is real, irreducibility occurs precisely when $|a|$ is an ordinary prime congruent to $3$ modulo $4$. Composite ordinary integers already factor into smaller real nonunits, so they are reducible in the Gaussian ring. The ordinary prime $2$ splits, and primes congruent to $1$ modulo $4$ split by the theorem above. Primes congruent to $3$ modulo $4$ remain irreducible by the norm argument. Multiplication by $i$ handles the purely imaginary case.

For example, $3+2i$ is Gaussian prime because its norm is $13$. The number $3+4i$ is reducible because its norm is $25$; indeed $(2+i)^2=3+4i$. The ordinary number $7$ is Gaussian prime even though its norm is $49$, not an ordinary prime. This last example explains why the nonzero-coordinate condition was essential in the first classification statement.

## What uniqueness actually guarantees for representations

Suppose $p\equiv1\pmod4$ is an ordinary prime and $p=a^2+b^2=c^2+d^2$. Both Gaussian factorizations

$$
p=(a+bi)(a-bi)=(c+di)(c-di)
$$

use factors of norm $p$, hence Gaussian irreducibles. Unique factorization says that $a+bi$ is associated to one of $c+di$ or $c-di$. Multiplication by the units $1,-1,i,-i$, together with conjugation, only changes signs or interchanges the real and imaginary coordinates. Thus the representation of an ordinary prime as a sum of two squares is unique up to signs and exchange.

For composite integers, several Gaussian prime factors can be allocated between a factor and its conjugate in different ways. This explains why $65$ has two essentially different representations. Factor $5=(2+i)(2-i)$ and $13=(3+2i)(3-2i)$. Multiplying $(2+i)(3+2i)$ gives $4+7i$, whereas multiplying $(2+i)(3-2i)$ gives $8-i$. Their norms are both $65$, yielding the two representations at the chapter's opening. The choices are no longer forced because two distinct conjugate pairs are involved.

This is a useful correction to a vague statement such as “unique factorization makes a sum-of-squares representation unique.” Unique factorization makes the multiset of Gaussian prime factors unique. A sum-of-squares representation also chooses how to distribute these factors into a number and its conjugate. Understanding exactly what is unique prevents a correct algebraic theorem from being applied to the wrong object.

## Keeping algorithms, ideals and factorization separate

There are three levels of information in this chapter. Euclidean division provides an explicit procedure. Principal ideals provide an existence statement about generators. Unique factorization provides a statement about multiplicative decomposition. The implications move from the strongest of these properties to weaker consequences. When solving a problem, identify which level it truly needs.

To show a quotient is a field, maximality of the ideal is enough; an actual division algorithm may be unnecessary. To compute an inverse, a Bezout identity is convenient; you may obtain it algorithmically if Euclidean division is available. To compare factorizations, irreducibles being prime and factor existence are the crucial facts. Separating these roles makes later generalizations easier: some number rings lose a Euclidean algorithm, some lose principal ideals, and some lose unique factorization of elements entirely, while other useful structures survive.

## A final check on the meaning of a greatest common divisor

In an arbitrary domain, calling $d$ a greatest common divisor does not refer to a numerical maximum. It means that $d$ divides both inputs and every common divisor divides $d$. The word greatest refers to the divisibility relation. Two gcds divide one another and are therefore associates. In the integers we select the nonnegative associate as a convention; in Gaussian integers there is no equally natural order that distinguishes one of four associates.

This matters when checking a computer result. If one computation returns $3-2i$ and another returns $2+3i$, the answers are consistent because multiplication by $i$ sends the first to the second. A program that compares raw coordinates without allowing units would incorrectly reject a valid gcd. The right certificate is divisibility together with a Bezout identity, or an associate comparison after a chosen normalization.

Likewise, “coprime” means that every common divisor is a unit. In a PID it is equivalent to generating the whole ideal and to having a Bezout identity equal to one. In a general domain, merely having no common irreducible factor need not give a Bezout identity. The ideal $(2,x)$ in $\mathbb Z[x]$ shows this distinction: $2$ and $x$ have no nonunit common factor, yet no integer-polynomial combination of them equals one, because its constant term would be even. This small example anticipates why ideal language becomes indispensable when elementwise divisibility no longer records all the arithmetic information.

## Zero cases and factorization conventions

A gcd of $a$ and zero is an associate of $a$ when $a$ is nonzero, because every divisor of $a$ automatically divides zero. The ideal equation is $(a,0)=(a)$. For the pair zero, zero, the element zero satisfies the divisibility definition of a gcd, since every common divisor divides zero; algorithms often return zero by convention. These cases should be handled before trying to divide by a nonzero remainder.

Factorization into irreducibles deliberately excludes zero and units. Zero admits expressions with arbitrarily many nonunit factors, such as zero times any product, so uniqueness in the UFD sense cannot hold for it. A unit has no irreducible factors and is best regarded as carrying only the leading unit in a factorization. These conventions are not exceptions invented after a theorem fails: they identify the elements for which multiplicative decomposition has the intended meaning.

## Optional practice and companion connection

The companion's quotient-rings experiment lets you examine finite residue-ring arithmetic and zero divisors. It illustrates the field-versus-reducible-modulus distinction for selected finite examples. The Gaussian Euclidean proof above is a proof for infinitely many inputs; finite tables in a lab do not replace it. Open the [companion](../companion/index.html) and compare a prime-field quotient with a quotient having zero divisors, then explain the relevant ideal condition in your own words if you find that useful.

1. In $\mathbb Z[i]$, find all associates of $2+i$ and show that $2+i$ is irreducible.
2. Carry out Gaussian division of $8+3i$ by $3+i$, choosing a nearest Gaussian integer quotient. Verify the norm decrease.
3. Find a Gaussian gcd of $5$ and $2+i$, and explain why the answer is defined only up to a unit.
4. Prove that if $R$ is a PID and $a,b$ have gcd $1$, then $a\mid bc$ implies $a\mid c$.
5. Determine which of $65,75,130,147$ are sums of two squares. Produce representations whenever they exist.
6. Prove directly that the ideal $(2,x)$ in $\mathbb Z[x]$ is proper, then explain why it is not principal.
7. Show that $\mathbb Z[i]/(3)$ is a field by explicitly finding an inverse of $1+i$.
8. Explain precisely why the multiplicativity of a norm alone does not prove unique factorization, using $\mathbb Z[\sqrt{-5}]$.

Hints and full reference solutions are in [Chapter 16 solutions](../solutions/16-solutions.md). The next chapter returns to squares modulo an odd prime. We now have two complementary tools available: counting and group structure in finite fields, and factorization in a larger arithmetic ring.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](15-polynomial-arithmetic.md) · [Next chapter](17-quadratic-residues.md) · [Hints and solutions](../solutions/16-solutions.md)
