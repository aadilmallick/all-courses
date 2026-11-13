# Chapter 08 — Hints and reference solutions

The maps below use the conventions in [Chapter 08](../chapters/08-homomorphisms-and-quotient-groups.md).

## 1. Homomorphisms of the additive integers

**Hint.** Determine $f(1)$, then use addition and additive inverses.

**Solution.** Put $m=f(1)$. For positive integers, induction gives $f(k)=km$. Also $f(0)=0$ and $f(-k)=-f(k)$, so the formula holds for all integers. Conversely, every formula $f(k)=mk$ preserves addition. It is injective exactly when $m\ne0$. Its image is $m\mathbb Z$, so it is surjective exactly when $m=1$ or $m=-1$. Those two cases are exactly the isomorphisms. For $m=0$ the kernel is all of $\mathbb Z$; otherwise the kernel is trivial.

## 2. Reduction from eighteen to six

**Hint.** Compare two representatives differing by a multiple of $18$.

**Solution.** If $a\equiv b\pmod{18}$, then $a-b$ is a multiple of $18$ and hence of $6$, so the output class modulo $6$ is independent of the representative. The map preserves addition and reaches every class modulo $6$. Its kernel is $\{[0]_{18},[6]_{18},[12]_{18}\}$, because those are exactly the classes represented by multiples of $6$. Thus the quotient of $\mathbb Z/18\mathbb Z$ by this three-element subgroup is isomorphic to $\mathbb Z/6\mathbb Z$. The induced isomorphism sends a kernel coset containing $[k]_{18}$ to $[k]_6$.

## 3. When reduction between moduli is valid

**Hint.** The two representatives $0$ and $m$ must have the same output.

**Solution.** If the proposed map is well-defined, $[0]_m=[m]_m$ forces $[0]_n=[m]_n$, so $n\mid m$. Conversely, if $n\mid m$, then any difference divisible by $m$ is divisible by $n$. Thus congruent representatives modulo $m$ have the same output modulo $n$. This proves both necessity and sufficiency. The resulting map also preserves addition.

## 4. Normality under maps

**Hint.** Apply the homomorphism to a conjugate, and track the ambient group.

**Solution.** Let $f:G\to H$ and $M\trianglelefteq H$. The preimage is a subgroup. If $x\in f^{-1}(M)$ and $g\in G$, then $f(gxg^{-1})=f(g)f(x)f(g)^{-1}\in M$, proving normality in $G$. If $N\trianglelefteq G$, then for $f(g)\in f(G)$ and $f(n)\in f(N)$ their conjugate is $f(gng^{-1})\in f(N)$, so $f(N)\trianglelefteq f(G)$. It need not be normal in all of $H$: let $G=\{e,s\}$, let $N=G$, and take the inclusion into $D_8$. Then $N$ is normal in its own domain, while its image is the nonnormal reflection subgroup of $D_8$.

## 5. The square group modulo its center

**Hint.** Write the four cosets and square each nonidentity coset.

**Solution.** Set $N=\{e,r^2\}$. The quotient elements are $N$, $rN=\{r,r^3\}$, $sN=\{s,r^2s\}$, and $rsN=\{rs,r^3s\}$. Each nonidentity coset has square $N$: $r^2\in N$, and reflections square to $e$. Moreover, $srN=r^{-1}sN=rsN$ because $r^{-1}N=rN$. Hence the quotient is abelian, and the map $(i,j)\mapsto r^is^jN$ from $C_2\times C_2$ is a bijective homomorphism. The quotient is therefore the four-element product group, not the cyclic group of order four.

## 6. Counting domain elements

**Hint.** Each nonempty fiber is a kernel coset.

**Solution.** The first-isomorphism counting formula gives $|G|=4\cdot9=36$. It determines only the image size, not the whole target size. For example, a target may be the nine-element image itself, or a larger group containing it. More concretely, the projection from $C_4\times C_9$ onto $C_9$ has kernel size four, and composing it with the inclusion $C_9\to C_9\times C_2$ as the first coordinate keeps the same kernel and image size while doubling the target size.

## 7. Abelian quotients

**Hint.** A commutator of cosets is the coset of a commutator.

**Solution.** The cosets $aN,bN$ commute exactly when their commutator is the identity coset. That commutator is $(aba^{-1}b^{-1})N$, which equals $N$ exactly when $aba^{-1}b^{-1}\in N$. Thus every pair of quotient elements commutes exactly when every commutator of $G$ lies in $N$. Since $N$ is a subgroup, this is equivalent to $[G,G]\subseteq N$ as well.

## 8. Second isomorphism theorem for integer subgroups

**Hint.** Use gcd for generation and lcm for intersection.

**Solution.** We have $A+N=4\mathbb Z+6\mathbb Z=2\mathbb Z$, since $6-4=2$ and every such sum is even. The intersection is $12\mathbb Z$. Hence the theorem gives $4\mathbb Z/12\mathbb Z\cong2\mathbb Z/6\mathbb Z$. Both groups are cyclic of order three. The explicit isomorphism is $4k+12\mathbb Z\mapsto4k+6\mathbb Z$. It is well-defined because changing $4k$ by a multiple of $12$ changes the output by a multiple of $6$; it is onto because the classes $0,4,8$ modulo $6$ are exactly $0,4,2$.
