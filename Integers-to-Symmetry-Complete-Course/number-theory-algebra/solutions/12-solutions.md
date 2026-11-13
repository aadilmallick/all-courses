# Chapter 12 — Hints and reference solutions

Return to [Chapter 12](../chapters/12-sylow-and-finite-groups.md). Sylow-number lists below are necessary possibilities, not claims that every entry is realized by a group of the specified order.

## 1. Order eighty-four

**Hint.** Use the cofactor after removing the full prime power, not merely one copy of the prime.

**Solution.** Since $84=2^2\cdot3\cdot7$, the number $n_2$ divides twenty-one and is odd, leaving $1,3,7,21$. The number $n_3$ divides twenty-eight and is one modulo three, leaving $1,4,7,28$. The number $n_7$ divides twelve and is one modulo seven. Among $1,2,3,4,6,12$, only one has that property. Thus the Sylow $7$-subgroup is necessarily normal. The theorem alone does not choose a single $n_2$ or $n_3$.

## 2. Order thirty-five

**Hint.** Both Sylow counts are forced to one.

**Solution.** We have $n_7\mid5$ and $n_7\equiv1\pmod7$, so $n_7=1$. Also $n_5\mid7$ and $n_5\equiv1\pmod5$, so $n_5=1$. Let the two normal subgroups be $P,Q$. Their intersection is trivial because its order divides both five and seven. The commutator of an element of $P$ and an element of $Q$ belongs to both normal subgroups, hence is the identity. Generators $a,b$ therefore commute. If $(ab)^k=e$, then $a^k=b^{-k}$ lies in the trivial intersection, so both five and seven divide $k$. Hence $ab$ has order thirty-five and generates $G$.

## 3. Order fifty-six

**Hint.** If eight order-seven subgroups occur, count their nonidentity elements.

**Solution.** Since $56=8\cdot7$, Sylow gives $n_7\in\{1,8\}$. If it is one, the requested normal subgroup already exists. Otherwise, distinct order-seven subgroups intersect only in the identity, so they contribute $8\cdot6=48$ distinct nonidentity elements of order seven. Exactly eight group elements remain, including the identity. Every Sylow $2$-subgroup has order eight and contains no nonidentity element of order seven, by Lagrange. It must therefore be exactly that remaining set. All Sylow $2$-subgroups coincide, so this subgroup is normal.

## 4. No forced element of order four

**Hint.** Cauchy's conclusion is for prime orders.

**Solution.** The prime two divides twelve, so Cauchy guarantees an element of order two, not four. In $A_4$, the nonidentity elements are three-cycles of order three and double transpositions of order two. There is no element of order four. Nevertheless its Sylow $2$-subgroup has order four: it is the identity together with the three double transpositions, isomorphic to $C_2\times C_2$. Subgroup order and existence of a generator of that order are different claims.

## 5. Conjugation in the affine example

**Hint.** Conjugation by $s$ multiplies the translation distance by two.

**Solution.** From $sts^{-1}=t^2$, we obtain $s^2ts^{-2}=s(t^2)s^{-1}=(sts^{-1})^2=t^4$. Directly, doubling twice before reversing scales a translation by four. The commutator is $sts^{-1}t^{-1}=t^2t^{-1}=t$. It is nonidentity, confirming that $s,t$ do not commute. All translation exponents are interpreted modulo seven.

## 6. A normal Sylow subgroup contains every $p$-subgroup

**Hint.** Apply the containment part of the second theorem, then use uniqueness.

**Solution.** If $Q$ is any $p$-subgroup, Sylow containment gives $Q\subseteq gPg^{-1}$ for some $g$. Normality gives $gPg^{-1}=P$, so $Q\subseteq P$. This also follows from uniqueness of the Sylow subgroup, but containment explains why smaller $p$-subgroups are included, not merely why other Sylow subgroups coincide.

## 7. Product of unique Sylow subgroups

**Hint.** Normal subgroups with coprime orders have trivial intersection and commute.

**Solution.** Let $P,Q$ be normal Sylow subgroups for distinct primes. Their intersection has order dividing both prime powers, hence is trivial. For $p\in P,q\in Q$, the commutator lies in both subgroups, so equals the identity. The map $P\times Q\to PQ$, $(p,q)\mapsto pq$, is therefore an injective homomorphism and is surjective onto $PQ$ by definition. Thus $|PQ|=|P||Q|$. The product is normal, because conjugation preserves each factor. For additional primes, repeat with the accumulated normal product and the next Sylow subgroup. Their orders remain coprime. Eventually the product order equals $|G|$, so the product is all of $G$ and the multiplication map gives the claimed direct-product isomorphism.

## 8. Subgroups of order $p$

**Hint.** In the elementary abelian case, count nonidentity elements in disjoint cyclic subgroups.

**Solution.** In $C_{p^2}=\langle a\rangle$, the elements satisfying $x^p=e$ are exactly the powers of $a^p$, forming the unique subgroup of order $p$. In $C_p\times C_p$, every nonidentity element has order $p$ and generates a subgroup containing exactly $p-1$ nonidentity elements. Two such subgroups sharing a nonidentity element must coincide, because that element generates either subgroup. Thus the $p^2-1$ nonidentity elements partition into groups of $p-1$, giving $(p^2-1)/(p-1)=p+1$ subgroups. This count is independent of any vector-space terminology.
