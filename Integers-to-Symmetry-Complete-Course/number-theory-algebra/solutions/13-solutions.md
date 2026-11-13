# Chapter 13 — Hints and reference solutions

Return to [Chapter 13](../chapters/13-rings-domains-and-fields.md). Every solution specifies the ambient ring, because unit and divisibility claims depend on it.

## 1. Arithmetic modulo eighteen

**Hint.** Separate the nonzero classes according to whether their representative is coprime to eighteen.

**Solution.** The units are represented by $1,5,7,11,13,17$. The nonzero zero divisors are represented by $2,3,4,6,8,9,10,12,14,15,16$. These lists exhaust the seventeen nonzero classes. For a representative $a$ with $d=\gcd(a,18)>1$, the nonzero residue of $18/d$ annihilates $[a]$. For a coprime representative, Bezout supplies an inverse and therefore rules out any nonzero annihilator.

## 2. Two linear equations modulo fifteen

**Hint.** Divide the integer divisibility condition by the common divisor three, then solve modulo five.

**Solution.** The first equation means $15\mid6x-3$, equivalent to $5\mid2x-1$. Since the inverse of two modulo five is three, $x\equiv3\pmod5$. The three classes modulo fifteen are $[3],[8],[13]$. The second equation means $15\mid6x-12$, equivalent to $2x\equiv4\pmod5$, so $x\equiv2\pmod5$. Its solutions are $[2],[7],[12]$. Both right-hand sides are divisible by $\gcd(6,15)=3$, so both equations are solvable; their solution cosets differ. A right-hand side not divisible by three would make the equation impossible.

## 3. Units and zero divisors

**Hint.** Multiply an annihilation equation by an inverse.

**Solution.** If $u$ is a unit and $ub=0$, then $b=u^{-1}ub=0$. Hence no nonzero element can be annihilated by a unit. In the integers, two is not a unit because its reciprocal is not an integer. It is not a zero divisor because $2b=0$ in the integers forces $b=0$. This example shows why noninvertibility does not imply zero-divisor behavior in an infinite ring.

## 4. A product ring

**Hint.** Invertibility is componentwise; characteristic requires both coordinates to vanish.

**Solution.** The units modulo four are $[1]_4,[3]_4$, and those modulo six are $[1]_6,[5]_6$. Thus the product has exactly the four units obtained by choosing one element from each list. An integer number of copies of the product identity vanishes precisely when it is divisible by both four and six, so the characteristic is $\operatorname{lcm}(4,6)=12$. The ring has twenty-four elements, illustrating that cardinality is not characteristic.

## 5. A field homomorphism is injective

**Hint.** A nonzero kernel element would have an inverse in the source.

**Solution.** Let $f:F\to R$ preserve identity, with $F$ a field and $R$ nonzero. If $a\ne0$ and $f(a)=0$, then $1_R=f(1_F)=f(aa^{-1})=f(a)f(a^{-1})=0_R$, a contradiction. Thus the kernel is zero. If $f(a)=f(b)$, then $f(a-b)=0$, so $a-b=0$ and $a=b$. This supplies injectivity explicitly from the kernel condition.

## 6. Prime characteristic without a field

**Hint.** Use a product of two copies of the same prime field.

**Solution.** The ring $\mathbb F_2\times\mathbb F_2$ has characteristic two, because twice $(1,1)$ is $(0,0)$ and once is not. It is not a field: the nonzero elements $(1,0)$ and $(0,1)$ multiply to zero. Equivalently, neither is a unit because an inverse could not produce a nonzero missing coordinate. Prime characteristic controls repeated addition of one, not the absence of zero divisors.

## 7. Embedding a domain in its fraction field

**Hint.** Use cross multiplication for fractions with denominator one.

**Solution.** If $a/1=b/1$, the equivalence relation says $a\cdot1=b\cdot1$, so $a=b$. Thus the map is injective. Its operation preservation follows directly from the fraction formulas. Any fraction $a/b$ equals $(a/1)(b/1)^{-1}$, because $(b/1)^{-1}=1/b$ and their product is $a/b$. The nonzero denominator condition ensures that $b/1$ is a nonzero field element and has the indicated inverse. Hence the fraction field contains an embedded copy of the domain and consists of quotients of its elements.

## 8. A nonunit in a finite ring

**Hint.** Multiplication by a nonunit misses one; on a finite set, failure of surjectivity forces failure of injectivity.

**Solution.** Consider $m_a:R\to R$, $x\mapsto ax$. Since $a$ is not a unit, $1$ is not in its image. Thus the map is not surjective. A self-map of a finite set is injective if and only if surjective, so there exist distinct $x,y$ with $ax=ay$. Put $b=x-y$. Then $b\ne0$ and $ab=ax-ay=0$. This also covers $a=0$, for which one may directly take $b=1$. Therefore every nonzero nonunit in a finite commutative ring is a zero divisor.
