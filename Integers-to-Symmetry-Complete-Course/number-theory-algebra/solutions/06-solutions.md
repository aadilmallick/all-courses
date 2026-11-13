# Chapter 06 — Hints and reference solutions

These solutions use the conventions of [Chapter 06](../chapters/06-groups-and-symmetry.md). An equation between transformations uses right-to-left composition.

## 1. Multiplicative real numbers

**Hint.** Separate closure, identity, and inverses. Ask what inverse zero could have.

**Solution.** Products of nonzero real numbers are nonzero, real multiplication is associative, and $1$ is an identity. Each nonzero real $a$ has inverse $1/a$, again a nonzero real. Multiplication commutes, so this is an abelian group. The set of all reals contains zero. For every real $b$, the product $0b$ equals $0$, so it can never equal the identity $1$. Thus zero has no inverse, and all reals under multiplication fail the inverse axiom. They still satisfy closure, associativity, and existence of an identity.

## 2. Equations and conjugation

**Hint.** Multiply on the correct side. Insert $x^{-1}x$ between repeated factors.

**Solution.** From $axb=c$, multiplication on the left by $a^{-1}$ and on the right by $b^{-1}$ yields the unique solution $x=a^{-1}cb^{-1}$. Substituting gives $a(a^{-1}cb^{-1})b=c$.

Suppose now that $xax^{-1}=b$. For $m=0$, both $xa^0x^{-1}$ and $b^0$ equal $e$. If the identity holds for a nonnegative integer $m$, then

$$
xa^{m+1}x^{-1}=(xa^mx^{-1})(xax^{-1})=b^mb=b^{m+1}.
$$

Induction proves the claim for nonnegative exponents. Taking inverses of $xax^{-1}=b$ gives $xa^{-1}x^{-1}=b^{-1}$, and the same positive-exponent argument applied to $a^{-1}$ proves it for negative integers. A solution need not exist: in an abelian group $xax^{-1}=a$ for every $x$, so if $b\ne a$ the equation has no solution. There is no universal formula for $x$ analogous to the first equation.

## 3. Every element self-inverse

**Hint.** Compute the inverse of $ab$ in two ways.

**Solution.** The assumption $g^2=e$ implies $g^{-1}=g$ for every element $g$. Hence $(ab)^{-1}=ab$, because it applies to the element $ab$, while the product-inverse rule gives $(ab)^{-1}=b^{-1}a^{-1}=ba$. Thus $ab=ba$ for arbitrary $a,b$, and the group is abelian. It is not enough that two selected elements are self-inverse: different reflections of a square may each square to the identity and still fail to commute.

## 4. A subgroup of the square group

**Hint.** A half-turn commutes with the chosen reflection.

**Solution.** The relation $sr^2=r^{-2}s=r^2s$ and the equalities $(r^2)^2=s^2=e$ show that every word in $r^2,s$ reduces to one of $e,r^2,s,r^2s$. These four elements are distinct in $D_8$. Products stay in the list because the two generators commute and both exponents can be reduced modulo $2$. Each listed element is its own inverse. Thus the list is the generated subgroup, and it is abelian. It is structurally a product of two two-element groups; that assertion will be formalized in the next chapters.

## 5. A union criterion

**Hint.** If neither subgroup contains the other, choose one element exclusive to each.

**Solution.** If $H\subseteq K$, their union is $K$ and therefore a subgroup; the other containment is analogous. Conversely, suppose $H\cup K$ is a subgroup and neither contains the other. Choose $h\in H\setminus K$ and $k\in K\setminus H$. The product $hk$ belongs to $H\cup K$. If $hk\in H$, then $k=h^{-1}(hk)\in H$, a contradiction. If $hk\in K$, then $h=(hk)k^{-1}\in K$, also a contradiction. At least one containment must hold.

## 6. Integer generation

**Hint.** Euclid's algorithm identifies the smallest positive generator.

**Solution.** We have $84=2\cdot30+24$ and $30=24+6$, so the gcd is $6$. Substitution gives $6=30-(84-2\cdot30)=3\cdot30-84$. Therefore the generated subgroup contains $6$ and all its integer multiples. Every combination of $84$ and $30$ is divisible by $6$, giving the reverse inclusion. The answer is $6\mathbb Z$.

## 7. Centralizers

**Hint.** From $ya=ay$, derive the corresponding identity for $y^{-1}$.

**Solution.** The identity commutes with $a$. If $y$ commutes with $a$, multiplying $ya=ay$ on both sides appropriately gives $y^{-1}a=ay^{-1}$. If $x$ also commutes with $a$, then

$$
(xy^{-1})a=x(ay^{-1})=(xa)y^{-1}=a(xy^{-1}).
$$

The subgroup test proves $C_G(a)\le G$. This subgroup only requires commuting with the one fixed element $a$. The center requires commuting with every element, so $Z(G)=\bigcap_{a\in G}C_G(a)$. A centralizer can be much larger than the center; for example, $C_G(e)=G$ always.

## 8. Finite closure via a bijection

**Hint.** An injective self-map of a finite set is surjective.

**Solution.** Fix $h\in H$. Closure makes $L_h(x)=hx$ a map from $H$ to $H$. Cancellation in the ambient group makes it injective, hence surjective because $H$ is finite. Thus some $x\in H$ satisfies $hx=h$, since $h$ is a target in $H$. Cancellation gives $x=e$, so $e\in H$. Surjectivity now supplies $y\in H$ satisfying $hy=e$. In the ambient group this forces $y=h^{-1}$. The choice of $h$ was arbitrary, so all inverses lie in $H$, completing the subgroup proof.
