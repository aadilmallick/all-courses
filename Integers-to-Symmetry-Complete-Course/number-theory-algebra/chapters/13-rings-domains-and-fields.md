# Chapter 13 — Rings, integral domains and fields

The integers support two operations that cooperate: addition and multiplication. Modular arithmetic keeps both operations, but it changes their behavior. Modulo seven, every nonzero class has a multiplicative inverse. Modulo eight, the class of two is nonzero yet its product with four is zero. Groups describe each reversible operation separately, but they do not by themselves describe the way multiplication distributes over addition. Rings provide that combined language.

Our goal is not to attach unfamiliar labels to familiar examples. It is to determine which arguments from integer arithmetic survive when the underlying number system changes. When is cancellation legal? When can an equation be divided by its coefficient? When does a finite system become a field? Why does the integer $n$ become zero in arithmetic modulo $n$? These questions lead naturally to units, zero divisors, integral domains, characteristic and fraction fields.

## 13.1 Starting with calculations that behave differently

In the integers, $2x=6$ has the unique solution $x=3$. Modulo eight, $[2][x]=[6]$ has two solutions: $[3]$ and $[7]$. Multiplying either by $[2]$ gives $[6]$. The ambiguity is connected to $[2][4]=[0]$: adding four to a solution leaves its product with two unchanged. Modulo seven, however, the inverse of $[2]$ is $[4]$, so multiplying both sides by $[4]$ gives the unique solution $[x]=[3]$.

These examples separate two properties that are often merged in ordinary arithmetic. A nonzero element may fail to annihilate any other nonzero element, which makes cancellation possible. It may also possess a multiplicative inverse, which makes division possible within the system. The first does not imply the second in an infinite system. The integer two can be canceled from an equality $2x=2y$, but its reciprocal is not an integer.

A third issue is closure. If we decide to work in the integers, a proposed answer $1/2$ is outside the system, even though it is a perfectly good rational number. Algebra always includes an ambient set together with its operations. Saying that an equation has no solution means no solution in that specified set. Changing the set can change the answer without changing the printed equation.

## 13.2 The ring axioms and what each part contributes

In this course a **ring** is a set $R$ with addition and multiplication satisfying the following conventions. The additive structure $(R,+)$ is an abelian group, with identity $0$. Multiplication is associative and commutative. There is a multiplicative identity $1$, distinct from $0$. Finally, multiplication distributes over addition:

$$
a(b+c)=ab+ac.
$$

Commutativity supplies the right distributive identity as well. Some books allow noncommutative rings or rings without identity. Whenever such an example is useful, we will identify the changed convention explicitly. Unless stated otherwise, every ring here is commutative, has an identity, and is nonzero.

The additive group gives subtraction: $a-b$ means $a+(-b)$. It also makes additive cancellation available. Associativity permits unambiguous products of several factors. The identity makes powers such as $a^0=1$ meaningful and gives a natural interpretation to integers inside a ring. Distributivity is the bridge connecting the two group-like structures. It is what makes algebraic expansion legitimate.

Several familiar rules follow rather than needing separate axioms. Since $a0=a(0+0)=a0+a0$, subtracting $a0$ gives $a0=0$. Also $0=a(b+(-b))=ab+a(-b)$, so $a(-b)=-(ab)$. Applying this twice yields $(-a)(-b)=ab$. These derivations matter because they show that signs and zero behave consistently in every ring, even an unfamiliar one.

We must not assume multiplication forms a group on all of $R$. Zero has no inverse, since $0u=0$ cannot equal $1$. Even deleting zero may not leave a group: nonzero products can become zero, and inverses may be missing. Instead, the elements that do have inverses form a distinguished multiplicative group, discussed shortly.

## 13.3 Examples and nonexamples before abstraction grows

The integers $\mathbb Z$, rationals $\mathbb Q$, reals $\mathbb R$ and residue rings $\mathbb Z/n\mathbb Z$ for $n\ge2$ are rings with their familiar operations. The residue operations are well defined because replacing representatives by congruent integers preserves sums and products, as proved in Chapter 4.

A product $R\times S$ is also a ring, with componentwise operations:

$$
(r,s)+(r',s')=(r+r',s+s'),\qquad
(r,s)(r',s')=(rr',ss').
$$

Its zero is $(0,0)$ and its identity is $(1,1)$. If both factors are nonzero rings, the elements $(1,0)$ and $(0,1)$ are nonzero but multiply to zero. This will be our simplest model of a ring whose two components do not interact multiplicatively.

The set of real-valued functions on a set $X$ is a ring under pointwise operations. For functions $f,g$, define $(f+g)(x)=f(x)+g(x)$ and $(fg)(x)=f(x)g(x)$. The zero and one are constant functions. If $X$ has two distinct points, functions supported on disjoint parts can be nonzero yet have product zero. This gives a less numerical example of zero divisors.

The positive integers are not a ring under ordinary addition and multiplication, because they have no additive identity zero and no additive inverses. The nonnegative integers contain zero but still lack additive inverses. The even integers form an additive abelian group and are closed under multiplication, but they do not contain a multiplicative identity for their own multiplication. The integer two does not act as an identity, since $2\cdot2=4\ne2$. Under our convention, the even integers are not a ring, although they are an important example of a nonunital ring in other conventions.

The nonzero rational numbers form a multiplicative group, but they are not a ring under ordinary operations: $1+(-1)=0$ leaves the set. A structure can be excellent for one operation and fail for the pair. This is why checking closure precedes checking elegant identities.

## 13.4 Units: the multiplicative group that survives

An element $u\in R$ is a **unit** if there exists $v\in R$ with $uv=1$. The inverse is unique. If $uv=1$ and $uw=1$, then $v=v(uw)=(vu)w=w$. Write the group of units as $R^\times$.

The units form an abelian group under multiplication. The identity is a unit. If $u,v$ are units, then $uv$ has inverse $u^{-1}v^{-1}$, using commutativity. The inverse of a unit is itself a unit. Associativity is inherited from the ring. Thus group theory applies to an important part of every ring without requiring every nonzero element to be invertible.

In $\mathbb Z$, the only units are $1$ and $-1$. If integers $a,b$ satisfy $ab=1$, their absolute values multiply to one, forcing both to have absolute value one. In $\mathbb Q$, every nonzero element is a unit. In $\mathbb Z/n\mathbb Z$, a class $[a]$ is a unit precisely when $\gcd(a,n)=1$. If $ab\equiv1\pmod n$, a common divisor of $a,n$ divides one. Conversely, Bezout gives $ax+ny=1$ when the greatest common divisor is one, and reducing modulo $n$ supplies the inverse $[x]$.

For example, the units modulo twelve are $[1],[5],[7],[11]$. Each squares to $[1]$, so the unit group is not cyclic of order four. This is a ring giving rise to a familiar finite abelian group. Additively, $\mathbb Z/12\mathbb Z$ is cyclic of order twelve; multiplicatively, its unit group has order four and a different structure. Always specify which operation is under discussion.

In a product ring, $(r,s)$ is a unit exactly when each component is a unit. The equation $(r,s)(a,b)=(1,1)$ is equivalent to $ra=1$ and $sb=1$. Hence $(R\times S)^\times\cong R^\times\times S^\times$. This connects the ring Chinese remainder theorem of the next chapter to the multiplicative-group calculations already used in number theory.

## 13.5 Zero divisors and the exact condition for cancellation

A nonzero element $a\in R$ is a **zero divisor** if some nonzero $b\in R$ satisfies $ab=0$. We exclude zero itself from the term, while remembering that zero annihilates every element. In a commutative ring, there is no left-right distinction for zero divisors.

For a fixed nonzero $a$, multiplication by $a$ is injective exactly when $a$ is not a zero divisor. If $ax=ay$, subtracting gives $a(x-y)=0$. When $a$ is not a zero divisor, this forces $x-y=0$, so $x=y$. Conversely, if $ab=0$ with $b\ne0$, then $ab=a0$ but $b\ne0$, so multiplication by $a$ is not injective. This equivalence is the precise cancellation criterion.

Every unit can be canceled: multiply by its inverse. In particular, a unit cannot be a zero divisor. The converse is false in infinite rings, as the integer two shows. It is neither a unit nor a zero divisor. We therefore have three possible behaviors for a nonzero element in a general ring: invertible, noninvertible but cancellable, or a zero divisor. In some rings one of these categories may be empty.

Modulo eight, $[2],[4],[6]$ are zero divisors, while $[1],[3],[5],[7]$ are units. Modulo six, $[2][3]=[0]$, even though neither factor is zero. The familiar implication “a product is zero, so one factor is zero” is not a universal algebraic law. It is a special property of rings without nonzero zero divisors.

More generally, a nonzero residue class $[a]$ modulo $n$ is a zero divisor precisely when $\gcd(a,n)>1$. Let $d=\gcd(a,n)>1$. Then $[n/d]$ is nonzero and $a(n/d)$ is divisible by $n$, so it annihilates $[a]$. Conversely, if $ab\equiv0\pmod n$ and $\gcd(a,n)=1$, Bezout or multiplication by the inverse of $[a]$ forces $b\equiv0$. Thus no nonzero annihilator exists for a unit.

## 13.6 Integral domains and fields

An **integral domain** is a commutative ring with identity, $1\ne0$, and no nonzero zero divisors. A **field** is a commutative ring with identity, $1\ne0$, in which every nonzero element is a unit. Every field is an integral domain. If $ab=0$ and $a\ne0$, multiplication by $a^{-1}$ gives $b=0$.

The integers are an integral domain but not a field. The rationals and reals are fields. The product of two nonzero rings is never an integral domain, because of $(1,0)(0,1)=0$. The ring $\mathbb Z/n\mathbb Z$ is a field exactly when $n$ is prime, and is an integral domain under exactly the same condition.

For the prime direction, if $p$ is prime, every nonzero residue has greatest common divisor one with $p$ and hence has an inverse. For the composite direction, write $n=ab$ with $1<a<n$ and $1<b<n$. Then $[a]$ and $[b]$ are nonzero but have product zero, so the ring is not a domain and therefore not a field.

A field permits the familiar linear-equation argument. If $a\ne0$, then $ax=b$ has the unique solution $x=a^{-1}b$. Existence comes from having the inverse, and uniqueness comes from cancellation. In a domain, uniqueness holds if a solution exists, but existence may fail. The equation $2x=1$ has no integer solution. In a ring with zero divisors, even uniqueness may fail, as $2x=6$ modulo eight demonstrated.

This hierarchy organizes proof assumptions. If an argument only cancels nonzero factors, a domain is enough. If it divides by arbitrary nonzero coefficients, it needs a field. If it only expands and subtracts, the ring axioms may suffice. Matching the hypothesis to the actual operation is a central algebraic habit.

## 13.7 Why every finite integral domain is a field

Let $R$ be a finite integral domain and choose $a\ne0$. Consider the function $m_a:R\to R$ defined by $m_a(x)=ax$. Because $R$ has no nonzero zero divisors, this function is injective: $ax=ay$ implies $a(x-y)=0$, hence $x=y$.

An injective function from a finite set to itself is surjective. To justify this, the images of the $|R|$ distinct inputs are $|R|$ distinct elements of a set having only $|R|$ elements; therefore every element appears. In particular, $1$ lies in the image. Some $b$ satisfies $ab=1$, so $a$ is a unit. Since $a$ was any nonzero element, $R$ is a field.

Finiteness is essential. Multiplication by two is an injective map $\mathbb Z\to\mathbb Z$, but its image contains only even integers and misses one. There is no contradiction because an infinite set can be in bijection with a proper subset of itself. The finite-set principle is a real hypothesis, not a decorative adjective.

A slightly broader consequence is that in any finite commutative ring, every nonzero element is either a unit or a zero divisor. If $a$ is not a zero divisor, the same injective-map argument makes it a unit. This does not say that every finite ring is a field. It says that the third behavior present in the integers, noninvertible yet cancellable, disappears in finite rings.

The result will later make polynomial quotient constructions efficient. If a quotient ring is finite and has no zero divisors, it is automatically a field; we do not need to list an inverse for each element. At the same time, an explicit inverse calculation remains useful for understanding what division means inside the constructed field.

## 13.8 Characteristic: how integers enter a ring

For a nonnegative integer $n$, let $n1$ mean $1+\cdots+1$ with $n$ summands, and let $01=0$. For negative integers, define $(-n)1=-(n1)$. These elements form the image of a natural map

$$
\iota:\mathbb Z\longrightarrow R,\qquad n\longmapsto n1.
$$

Repeated addition shows that $\iota(m+n)=\iota(m)+\iota(n)$ and $\iota(mn)=\iota(m)\iota(n)$. The latter follows by distributing a product of two repeated sums and extends to negative integers using sign rules. Also $\iota(1)=1$. Thus this map preserves both operations and the identity.

The **characteristic** of $R$ is the least positive integer $n$ with $n1=0$, if one exists; otherwise it is zero. In $\mathbb Z$ and $\mathbb Q$, the characteristic is zero. In $\mathbb Z/n\mathbb Z$, it is $n$. The phrase characteristic zero does not mean the ring contains no zero. It means no positive number of copies of one adds to zero.

If $R$ is an integral domain and has positive characteristic $n$, then $n$ is prime. Since $1\ne0$, $n\ne1$. If $n=ab$ with $1<a,b<n$, then $(a1)(b1)=n1=0$. Minimality of $n$ makes both factors nonzero, contradicting the domain property. Hence $n$ is prime.

A ring can have composite characteristic when it has zero divisors; $\mathbb Z/6\mathbb Z$ does. Conversely, prime characteristic alone does not imply a domain. The product $\mathbb F_2\times\mathbb F_2$ has characteristic two, because $2(1,1)=(0,0)$, yet it has zero divisors. Characteristic records additive repetition of the identity, not the whole multiplicative structure.

When a field has characteristic $p$, the elements $0,1,\ldots,(p-1)1$ form a copy of $\mathbb F_p$. When a field has characteristic zero, it contains a copy of $\mathbb Q$: send $a/b$ to $(a1)(b1)^{-1}$. The denominator is nonzero because characteristic is zero, and cross multiplication proves representative independence. These smallest subfields are called prime subfields. They will provide the scalar systems underlying finite fields and number fields later.

## 13.9 Ring homomorphisms and the information they preserve

A **ring homomorphism** $f:R\to S$ satisfies

$$
f(a+b)=f(a)+f(b),\qquad f(ab)=f(a)f(b),\qquad f(1_R)=1_S.
$$

We require preservation of identity. Additive-group reasoning implies $f(0)=0$ and $f(-a)=-f(a)$. A bijective homomorphism is an isomorphism, expressing that the two rings have the same arithmetic structure after relabeling.

Reduction modulo $n$ is a ring homomorphism $\mathbb Z\to\mathbb Z/n\mathbb Z$. Inclusion $\mathbb Z\hookrightarrow\mathbb Q$ is another. Projection $R\times S\to R$ is another. These maps do different things: reduction identifies distinct integers, inclusion adds access to a larger ambient system without identifying integers, and projection forgets a component.

A homomorphism sends units to units. If $uv=1_R$, then $f(u)f(v)=f(1_R)=1_S$. The converse need not hold: the integer two is not a unit in $\mathbb Z$, but it becomes a unit under inclusion into $\mathbb Q$. Similarly, a homomorphism need not preserve nonzero zero divisors as nonzero elements, because it may send them to zero. Projection sends $(1,0)$ to one and $(0,1)$ to zero in the product example.

An injective ring homomorphism from a ring into a domain forces the source to be a domain. If $ab=0$ and both factors are nonzero in the source, injectivity makes both images nonzero, contradicting the domain property in the target. Surjective maps behave differently: a domain can map onto a ring with zero divisors, as $\mathbb Z\to\mathbb Z/6\mathbb Z$ shows. The direction and injectivity assumptions cannot be omitted.

A homomorphism from a field to a nonzero ring is injective. If $a\ne0$ had image zero, then $1=f(aa^{-1})=f(a)f(a^{-1})=0$, impossible. This small proof explains why field extensions can be treated as inclusions after appropriate relabeling. A field cannot lose a nonzero element under an identity-preserving homomorphism into a nonzero ring.

## 13.10 Building fractions from any integral domain

The rational numbers arise by adjoining quotients to the integers. The same construction works for an integral domain $D$. Consider pairs $(a,b)$ with $a,b\in D$ and $b\ne0$, thought of as $a/b$. Declare

$$
(a,b)\sim(c,d)\quad\text{when}\quad ad=bc.
$$

Reflexivity and symmetry are immediate. For transitivity, suppose $ad=bc$ and $cf=de$, with denominators $b,d,f$ nonzero. Multiplying the first equality by $f$ and the second by $b$ gives $adf=bcf=bde$. Thus $d(af-be)=0$. Since $d\ne0$ and $D$ is a domain, cancellation gives $af=be$. This is precisely the desired equivalence between $(a,b)$ and $(e,f)$.

On equivalence classes define

$$
\frac ab+\frac cd=\frac{ad+bc}{bd},\qquad
\frac ab\frac cd=\frac{ac}{bd}.
$$

The denominator $bd$ is nonzero because $D$ is a domain. Representative independence follows by cross multiplication and distributivity. For multiplication, if $ab'=a'b$ and $cd'=c'd$, then $acb'd'=(ab')(cd')=(a'b)(c'd)=a'c'bd$. For addition, expanding both cross products and substituting the same two identities gives equality. These checks are the price of defining arithmetic on equivalence classes.

The resulting system, called the **fraction field** $\operatorname{Frac}(D)$, is a field. The zero class is $0/1$ and the identity is $1/1$. A fraction $a/b$ is nonzero exactly when $a\ne0$, and then its inverse is $b/a$. The map $D\to\operatorname{Frac}(D)$ sending $a$ to $a/1$ is injective, because equality $a/1=c/1$ means $a=c$.

If the original ring has zero divisors, this straightforward construction fails. Products of nonzero denominators may become zero, and the transitivity proof above used cancellation. There are more general constructions called localizations, but one must restrict allowed denominators carefully. We will not invoke that machinery without teaching it. For our purposes, the domain hypothesis is exactly what makes ordinary fractions work.

## 13.11 Testing a ring before solving equations in it

A practical order of questions is useful. First identify the set and operations. Verify closure and the identity convention. Next determine the units and zero divisors. Then decide whether cancellation or arbitrary division is available. Finally note the characteristic, because integer coefficients may collapse unexpectedly.

For example, consider $R=\mathbb F_2\times\mathbb F_2$. Its four elements are $(0,0),(1,0),(0,1),(1,1)$. Only $(1,1)$ is a unit, because both coordinates must be nonzero in their fields. The two other nonzero elements are zero divisors. Every element satisfies $x^2=x$, checked coordinatewise. This identity would be false for most integers, but it follows here because each coordinate is zero or one.

In any ring of characteristic two, $a+a=0$ and $-a=a$. Also $(a+b)^2=a^2+2ab+b^2=a^2+b^2$, since $2ab=0$. The binomial expansion survives; a coefficient vanishes. This is not a violation of ordinary algebra but an application of its rules in a ring with different characteristic. Later, the same phenomenon will produce Frobenius maps in finite fields.

The [quotient-rings lab](../companion/index.html) calculates in a quadratic quotient with coefficient modulus $n$. To inspect ordinary residue classes inside it, set the coefficient of $\alpha$ to zero. Compare the powers and invertibility of constants for coefficient moduli seven and eight; for example, the constant four squares to zero modulo eight. This is a calculation in specified finite rings, rather than a general multiplication-table explorer. Explain the observed difference with the prime-versus-composite proof.


## 13.12 Subrings and the importance of sharing an identity

A **subring** $S$ of $R$, under our identity convention, is a subset closed under addition, additive inverses and multiplication, and containing the same multiplicative identity as $R$. It then inherits all ring axioms. To check closure efficiently, one may verify that $S$ is nonempty, closed under differences and products, and contains $1_R$. Difference closure supplies additive inverses and addition once zero is present.

The integers sit as a subring of the rationals, and the rationals as a subring of the reals. The set $\mathbb Z[\sqrt2]=\{a+b\sqrt2:a,b\in\mathbb Z\}$ is a subring of the reals. To verify multiplication, expand:

$$
(a+b\sqrt2)(c+d\sqrt2)=(ac+2bd)+(ad+bc)\sqrt2.
$$

Both coefficients are integers, so the result stays inside the set. It contains one and is closed under differences. Because it lies inside the real field, it has no nonzero zero divisors. Thus it is an integral domain. We are not yet classifying its units or its factorization; those are additional questions requiring additional arguments.

The same calculation with rational coefficients produces $\mathbb Q[\sqrt2]$. This time it is a field. For $a+b\sqrt2\ne0$, multiply numerator and denominator by $a-b\sqrt2$:

$$
\frac1{a+b\sqrt2}=\frac{a-b\sqrt2}{a^2-2b^2}.
$$

The denominator cannot vanish unless $a=b=0$. If $b\ne0$ and it vanished, $(a/b)^2=2$, contradicting irrationality of $\sqrt2$; if $b=0$, it forces $a=0$. The inverse therefore has rational coefficients and belongs to the same set. This example previews a field extension while using only arithmetic already established. It also shows how changing integer coefficients to rational coefficients can create inverses that were missing.

Identity conventions deserve care in product rings. The subset $R\times\{0\}$ of $R\times S$ has an identity $(1,0)$ for its own multiplication, but it does not contain the ambient identity $(1,1)$. We therefore do not call its inclusion an identity-preserving subring inclusion under our convention. This does not make the subset uninteresting; it will be an ideal in the next chapter. The difference between subrings and ideals is not merely terminological: one preserves an identity and both internal operations, while the other must absorb multiplication by arbitrary ambient elements.

## 13.13 Divisibility in a domain, and why units appear in uniqueness statements

The familiar definition of divisibility makes sense in any commutative ring: $a\mid b$ means $b=ac$ for some ring element $c$. In the integers, the only invertible factors are signs, so uniqueness of prime factorization is stated “up to order and signs.” In another ring, there may be many more units. The correct general replacement for changing a sign is multiplication by any unit.

Two elements $a,b$ are called **associates** if $a=ub$ for a unit $u$. In a domain, two nonzero elements divide one another exactly when they are associates. One direction is easy: if $a=ub$, then $b=u^{-1}a$, so each divides the other. Conversely, suppose $a=bc$ and $b=ad$ with $a\ne0$. Substitute the second into the first to obtain $a=adc$. Cancellation yields $dc=1$, so $c$ is a unit and $a$ is a unit multiple of $b$.

The domain hypothesis appears precisely in cancellation. This is the same logical habit as before: when a proof cancels a factor, record why it is nonzero and why the ambient ring permits cancellation. Divisibility in rings with zero divisors can behave less rigidly, and familiar statements need rechecking rather than automatic transfer.

For a first new unit, consider $1+\sqrt2\in\mathbb Z[\sqrt2]$. Its product with $\sqrt2-1$ is $2-1=1$, so it is a unit even though neither factor is $1$ or $-1$. Thus a uniqueness theorem in this ring cannot merely allow a sign change. The elements $3$ and $3(1+\sqrt2)=3+3\sqrt2$ are associates. They differ substantially as real numbers but represent the same divisibility class up to an invertible factor.

This perspective will become important in Chapter 16, where irreducible and prime elements are distinguished. At present the useful lesson is narrower: the ambient ring determines which factors are considered trivial. A rational field has no nonzero nonunit elements at all, so integer-style factorization questions change completely if one accidentally moves the problem from $\mathbb Z$ to $\mathbb Q$.

## 13.14 Idempotents expose a split arithmetic system

An element $e\in R$ is **idempotent** if $e^2=e$. Rearranging gives $e(e-1)=0$. In an integral domain, this forces $e=0$ or $e=1$. Thus any other idempotent immediately certifies zero divisors.

Modulo six, $[3]^2=[3]$ and $[4]^2=[4]$. These are nontrivial idempotents. Their product is zero and their sum is one. One can think of them as arithmetic selectors for two components. Every residue $[a]$ decomposes as $[a]=[3a]+[4a]$, with each piece selected by one idempotent. This is a hint of the isomorphism $\mathbb Z/6\mathbb Z\cong\mathbb Z/2\mathbb Z\times\mathbb Z/3\mathbb Z$ that the ring Chinese remainder theorem will explain.

The idempotent condition is stronger than merely being a zero divisor. Modulo four, $[2]$ is a zero divisor, but $[2]^2=[0]\ne[2]$. Indeed, the only idempotents modulo four are zero and one: direct calculation gives squares $0,1,0,1$ for representatives $0,1,2,3$. The ring has zero divisors without splitting into two independent nonzero ring factors in this elementary way.

An element $a$ is called **nilpotent** if $a^k=0$ for some positive integer $k$. The residue $[2]$ modulo four is nilpotent. In a domain, the only nilpotent is zero: if $a\ne0$, a product of nonzero copies of $a$ cannot vanish. Nilpotence and idempotence describe different multiplicative behaviors. An element that is both nilpotent and idempotent must be zero, because idempotence makes every positive power equal to the element itself.

These definitions are useful diagnostics, not an invitation to memorize a large vocabulary at once. If a quotient calculation produces a nonzero element whose square vanishes, we will know immediately that the quotient is not a domain. If it produces a nontrivial idempotent, we will look for a product decomposition. Both ideas will soon arise from ideals.

## 13.15 Characteristic of a product and a caution about finite field sizes

Suppose finite-characteristic rings $R,S$ have characteristics $r,s$. In the product ring, $n(1_R,1_S)=(n1_R,n1_S)$ is zero exactly when both $r$ and $s$ divide $n$. Consequently the characteristic of $R\times S$ is $\operatorname{lcm}(r,s)$. For example, $\mathbb Z/4\mathbb Z\times\mathbb Z/6\mathbb Z$ has characteristic twelve, even though it has twenty-four elements. Cardinality and characteristic are different invariants.

A finite field necessarily has prime characteristic, but its number of elements need not be prime. Later we will construct a field with four elements. It cannot be $\mathbb Z/4\mathbb Z$, which has characteristic four and zero divisors. The existence of four elements does not determine the multiplication table. When we write $\mathbb F_4$, we mean a field of order four, not integers modulo four. We will teach the required polynomial construction before using that notation computationally.

For the same reason, $\mathbb Z/n\mathbb Z$ is a reliable source of fields only when $n$ is prime. Replacing a prime by a prime power in that construction does not preserve the field property. This is a common beginner error because the statements “finite fields have prime-power size” and “prime residue rings are fields” sound similar. They concern different constructions. The first needs a vector-space argument and a polynomial existence theorem; the second was proved directly with Bezout.


## 13.16 Why polynomial equations can gain unexpected solutions

The equation $x^2=1$ factors as $(x-1)(x+1)=0$ in every commutative ring, because distributivity and the sign rules are enough for the expansion. In a domain, one factor must vanish, so the only possible solutions are $1$ and $-1$. In characteristic two these may coincide, but there can still be no additional solutions in a domain.

Modulo eight, the four classes $[1],[3],[5],[7]$ all square to one. For $[3]$, the factorization reads $[2][4]=[0]$; neither factor is zero. The algebraic factorization remains correct, but the implication from a zero product to a zero factor fails. This identifies the exact invalid step in a familiar proof rather than vaguely saying that modular arithmetic is different.

A nonzero polynomial of degree two can therefore have more than two roots in a ring with zero divisors. Chapter 15 will prove the degree bound over integral domains. The necessary hypothesis should now feel motivated: repeated factor removal relies on cancellation, so allowing zero divisors can break the bound. Ring theory tells us where an elementary-looking theorem actually gets its force.

For a different calculation, suppose $u$ is a unit and $n$ is nilpotent, with $n^k=0$. Then $1-n$ is a unit, because

$$
(1-n)(1+n+\cdots+n^{k-1})=1-n^k=1.
$$

This is a finite geometric identity, proved by expanding and canceling the intermediate terms. There is no appeal to convergence or an infinite series. Modulo eight, take $n=[2]$, for which $n^3=[0]$. The formula says that $[1]-[2]=[7]$ has inverse $[1]+[2]+[4]=[7]$. Checking gives $[7]^2=[1]$.

The example is useful for two reasons. First, it constructs an inverse without testing all possible candidates. Second, it distinguishes a finite algebraic identity from an analytic summation argument. We will introduce limits and infinite series only when they are genuinely needed in the analysis chapter. A notation that resembles a geometric series does not itself justify an infinite sum inside an arbitrary ring.

There is also a direct finite-field inverse formula once a field's size is known. If $F$ has $q$ elements, its nonzero elements form a group of order $q-1$. Lagrange gives $a^{q-1}=1$ for $a\ne0$, so $a^{-1}=a^{q-2}$. For the field $\mathbb F_7$, this gives $[3]^{-1}=[3]^5=[5]$. Repeated multiplication or fast exponentiation verifies the arithmetic. The formula assumes a field; applying it in $\mathbb Z/8\mathbb Z$ as though eight were a field size would be unjustified.

These examples show how ring classification changes equation-solving strategy. In a field, divide and use the multiplicative group. In a domain, cancel but check whether the resulting candidate stays inside the ring. In a ring with zero divisors, track annihilators and test factor arguments carefully. The operations may look identical on paper while supporting different logical conclusions.

## 13.17 Keeping the ambient ring visible

When writing a proof, a short phrase such as “in the integers” or “in the field of residues modulo seven” can prevent a serious logical error. The symbols zero and one occur in many rings, but their surrounding rules differ. Even divisibility depends on the ambient ring: two divides one in the rationals because $1=2(1/2)$, while it does not divide one in the integers. Before importing a familiar calculation, identify which coefficients, inverses and solutions belong to the current system. This habit is especially valuable when moving between a ring, its fraction field and a quotient ring in one argument.

## 13.18 Optional exercises

Hints and detailed solutions are in [Chapter 13 solutions](../solutions/13-solutions.md).

1. List the units and nonzero zero divisors of $\mathbb Z/18\mathbb Z$.
2. Solve $[6]x=[3]$ and $[6]x=[12]$ in $\mathbb Z/15\mathbb Z$. Explain the difference using greatest common divisors.
3. Prove that a unit cannot be a zero divisor, and give a nonzero integer that is neither a unit nor a zero divisor.
4. Determine the units and characteristic of $\mathbb Z/4\mathbb Z\times\mathbb Z/6\mathbb Z$.
5. Prove that an identity-preserving homomorphism from a field to a nonzero ring is injective.
6. Give a finite ring of prime characteristic that is not a field, and identify an explicit nonzero product equal to zero.
7. Let $D$ be an integral domain. Prove that the map $a\mapsto a/1$ into its fraction field is injective and that every fraction is a quotient of two elements of its image.
8. If $R$ is a finite commutative ring and $a$ is not a unit, prove that some nonzero $b$ satisfies $ab=0$.

Rings retain the arithmetic operations while making their possible failures visible. The next chapter asks which collections of elements can consistently be declared zero. That question leads to ideals and quotient rings, reconnecting the familiar congruence relation to a general algebraic construction.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](12-sylow-and-finite-groups.md) · [Next chapter](14-ideals-and-ring-quotients.md) · [Hints and solutions](../solutions/13-solutions.md)
