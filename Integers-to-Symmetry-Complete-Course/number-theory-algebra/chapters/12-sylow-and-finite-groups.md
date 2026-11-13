# Chapter 12 — Cauchy, Sylow and finite group structure

Lagrange's theorem tells us that a subgroup's order divides the order of a finite group. The converse is false: a divisor of the group order need not be a subgroup order. The group $A_4$, of order twelve, has no subgroup of order six. Yet some divisors are unavoidable. If a prime $p$ divides the group order, an element of order $p$ must exist. More strongly, if $p^a$ is the largest power of $p$ dividing the order, a subgroup of order $p^a$ must exist. These are the existence statements behind Cauchy's theorem and Sylow's theorems.

The importance of these theorems goes beyond finding subgroups. They sharply restrict how many such subgroups there can be, and they relate any two by conjugation. Arithmetic information about the number $|G|$ becomes structural information about $G$. This chapter proves the results using the actions and class equation developed in Chapter 11, then uses them to analyze small groups without trying every possible multiplication table.

## 12.1 Prime-power subgroups and the limits of divisibility

A finite **$p$-group** is a group whose order is a power of the prime $p$. A **$p$-subgroup** of $G$ is a subgroup that is a $p$-group. If $|G|=p^am$ with $p\nmid m$, a **Sylow $p$-subgroup** means a subgroup of order $p^a$. The definition specifies the largest possible prime-power order allowed by Lagrange's theorem. It does not yet establish existence.

For example, if $|G|=72=2^3\cdot3^2$, a Sylow $2$-subgroup has order eight, and a Sylow $3$-subgroup has order nine. A subgroup of order four would be a $2$-subgroup but not a Sylow $2$-subgroup. Notice also that “largest possible order” differs from “largest by inclusion.” Sylow's theorems will imply that every maximal $p$-subgroup by inclusion has the required full order; that is a consequence, not part of the definition we will use.

Why is the naive converse to Lagrange wrong? Consider a hypothetical subgroup $H\le A_4$ of order six. It would have index two and hence be normal. The quotient would have order two. Every three-cycle in $A_4$ would map to the identity, because its image has order dividing both three and two. But three-cycles generate $A_4$: a double transposition, such as $(12)(34)$, equals $(132)(134)$ under right-to-left composition, and the other double transpositions are obtained by relabeling. Hence every element would map to the identity, contradicting a quotient of order two. The obstruction is group multiplication, not integer divisibility alone.

Prime powers behave better because actions of $p$-groups have orbit sizes that are powers of $p$. This gives a common prime divisor for all nontrivial orbit sizes, which permits a useful congruence. When the acting group has unrelated prime divisors, that uniform argument disappears.

## 12.2 A counting lemma for prime-power actions

Let a finite $p$-group $P$ act on a finite set $X$. Let $X^P$ denote the points fixed by every element of $P$. Then

$$
|X|\equiv|X^P|\pmod p.
$$

To prove this, partition $X$ into orbits. By orbit-stabilizer, each orbit size divides $|P|$, so it is a power of $p$. An orbit has size one exactly when every element of $P$ fixes its unique point. Every larger orbit contributes a multiple of $p$. Adding the orbit sizes proves the congruence.

Two consequences will recur. If $p\nmid|X|$, a common fixed point must exist. If $p\mid|X|$ and one common fixed point is already known, the congruence forces the number of common fixed points to be at least $p$. The second form is useful for finding something besides an identity object.

A fixed point of one element is not automatically a common fixed point. The notation $X^P$ uses the entire acting group. When $P$ is cyclic and a generator fixes a point, however, every power of that generator fixes it, so it is a common fixed point. We will use a cyclic group of order $p$ in the next proof, making this distinction easy to control.

## 12.3 Cauchy's theorem from a rotating tuple

**Cauchy's theorem.** If $G$ is finite and a prime $p$ divides $|G|$, then $G$ contains an element of order $p$.

The proof begins by manufacturing a set whose size is divisible by $p$. Let

$$
X=\{(g_1,\ldots,g_p)\in G^p:g_1g_2\cdots g_p=e\}.
$$

Choose the first $p-1$ entries arbitrarily. The final entry is then uniquely forced to be $(g_1\cdots g_{p-1})^{-1}$. Therefore $|X|=|G|^{p-1}$, which is divisible by $p$.

The cyclic group $C_p$ acts by rotating entries one place. We must check that rotation preserves the defining product condition even when $G$ is not abelian. If $g_1\cdots g_p=e$, then

$$
g_2\cdots g_pg_1=g_1^{-1}(g_1\cdots g_p)g_1=e.
$$

Thus rotation indeed sends $X$ to itself. Rotating $p$ times gives the original tuple, so the cyclic action is well defined. A tuple fixed by a one-step rotation has every entry equal, say $(g,g,\ldots,g)$. It lies in $X$ precisely when $g^p=e$.

The prime-power action lemma says that the number of such constant tuples is divisible by $p$. There is at least one: $(e,\ldots,e)$. Hence there must be at least $p$, so some $g\ne e$ satisfies $g^p=e$. The order of $g$ divides $p$; because $p$ is prime and $g$ is not the identity, its order is exactly $p$. This proves the theorem.

The construction is worth understanding before memorizing it. The product-one condition creates a count of $|G|^{p-1}$. Rotation creates an action whose fixed objects encode the equation $g^p=e$. The divisibility congruence forces more fixed objects than the identity alone. Each ingredient has a specific job.

Cauchy's theorem does not assert that every element has order divisible by $p$, nor that an element of order $p^a$ exists when $p^a$ divides $|G|$. The group $C_2\times C_2$ has order four but no element of order four. Sylow existence concerns subgroups, which need not be cyclic, and therefore avoids this false strengthening.

## 12.4 Preparing the existence proof: the center and a quotient

Recall the center $Z(G)=\{z:zg=gz\text{ for all }g\in G\}$. It is a normal subgroup. If an element $z$ lies in the center, the cyclic subgroup $\langle z\rangle$ is also normal, because every conjugation fixes each of its elements. Quotienting by this subgroup is consequently legal.

If $N\trianglelefteq G$ and $\pi:G\to G/N$ is the quotient map, the inverse image of a subgroup $\overline H\le G/N$ is a subgroup $H\le G$ containing $N$. In the finite case,

$$
|H|=|N|\,|\overline H|.
$$

Indeed, $H$ is the disjoint union of the cosets of $N$ indexed by $\overline H$, and every such coset has $|N|$ elements. We will use this simple counting fact to lift a smaller prime-power subgroup from a quotient.

An induction proof needs its parameter stated carefully. We shall induct on $|G|$ while keeping the prime $p$ fixed. Inside a proper subgroup or a nontrivial quotient, the group order decreases, so the induction hypothesis becomes available. We do not assume the very result we are trying to prove for a group of the same size.

## 12.5 Sylow existence, with the class-equation argument exposed

**First Sylow theorem.** If $|G|=p^am$ and $p\nmid m$, then $G$ has a subgroup of order $p^a$.

If $a=0$, the identity subgroup has the required order one. Assume $a\ge1$, and use induction on $|G|$. If some proper subgroup $K<G$ has order divisible by $p^a$, its order cannot contain a larger power of $p$, by Lagrange. The induction hypothesis applied to $K$ gives the desired subgroup inside $K$, hence inside $G$.

It remains to consider the case in which no proper subgroup has order divisible by $p^a$. For each noncentral element $x$, the centralizer $C_G(x)$ is proper. Its order therefore contains at most $p^{a-1}$, so its index $[G:C_G(x)]$ is divisible by $p$. The class equation

$$
|G|=|Z(G)|+\sum_i[G:C_G(x_i)]
$$

then shows that $p\mid|Z(G)|$. Apply Cauchy's theorem to the finite group $Z(G)$. It contains an element $z$ of order $p$. Let $N=\langle z\rangle$. This subgroup is central, normal and of order $p$.

The quotient has order $|G/N|=p^{a-1}m$. By induction, it has a subgroup $\overline P$ of order $p^{a-1}$. Its inverse image $P$ in $G$ has order $p\cdot p^{a-1}=p^a$. This completes the remaining case and hence the proof.

Where did the hypotheses enter? Finiteness permits subgroup orders and the class equation. Primality makes all noncentral indices in the remaining case divisible by the same $p$. Cauchy's theorem provides a central subgroup of exactly order $p$. Centrality makes the quotient legitimate. None of those steps claims that $P$ is cyclic or unique.

The argument also explains why the center of an arbitrary finite group need not be nontrivial. We proved $p\mid|Z(G)|$ only in the special induction branch where no proper subgroup carried the whole $p$-part of the order. For $S_3$ and $p=3$, a proper subgroup of order three exists, so that branch never applies.

## 12.6 Containment and conjugacy from a coset action

**Second Sylow theorem.** Every $p$-subgroup $Q$ of $G$ is contained in a conjugate of a Sylow $p$-subgroup $P$. Consequently, any two Sylow $p$-subgroups are conjugate.

Let $Q$ act by left multiplication on the left cosets $G/P$. The number of cosets is $[G:P]=m$, which is not divisible by $p$. Since $Q$ is a $p$-group, the counting lemma forces a common fixed coset $gP$.

Expanding fixedness gives $qgP=gP$ for every $q\in Q$. Equality of these left cosets is equivalent to $g^{-1}qg\in P$. Thus

$$
g^{-1}Qg\subseteq P,
\qquad\text{or equivalently}\qquad
Q\subseteq gPg^{-1}.
$$

This is the desired containment. If $Q$ is itself Sylow, both subgroups have order $p^a$, so containment becomes equality. The proof is complete.

The power of this proof lies in choosing a coset set whose size is coprime to $p$. If we had acted on $G$ itself by left multiplication, its size would be divisible by $p$, and no fixed point would be forced. The right set is as important as the right group.

A consequence is that every $p$-subgroup maximal by inclusion is Sylow: the theorem puts it inside a Sylow subgroup, so maximality forces equality. Another is that all Sylow subgroups for a fixed prime are isomorphic, because conjugation is an isomorphism. They need not be equal as subsets. In $S_3$, the three subgroups generated by transpositions are distinct Sylow $2$-subgroups, and conjugation permutes them.

## 12.7 Counting Sylow subgroups

Write $n_p$ for the number of Sylow $p$-subgroups of $G$. The **third Sylow theorem** states

$$
n_p\equiv1\pmod p,\qquad n_p\mid m,
\qquad |G|=p^am,\ p\nmid m.
$$

First prove the divisibility. Conjugation acts transitively on the Sylow $p$-subgroups by the second theorem. The stabilizer of $P$ is its normalizer $N_G(P)=\{g:gPg^{-1}=P\}$. Hence $n_p=[G:N_G(P)]$. Since $P\le N_G(P)$, write $|N_G(P)|=p^ad$ for some divisor $d$ of $m$. It follows that $n_p=m/d$, a divisor of $m$.

For the congruence, let $P$ itself act by conjugation on the set of all Sylow $p$-subgroups. We claim that the only common fixed point is $P$. Certainly $P$ is fixed by conjugation by its own elements. Suppose another Sylow subgroup $R$ is fixed. Then $P$ normalizes $R$, meaning that $prp^{-1}\in R$ for all $p\in P$, $r\in R$.

Because of that normalization, $RP=\{rp:r\in R,p\in P\}$ is a subgroup. For example, $r_1p_1r_2p_2=r_1(p_1r_2p_1^{-1})p_1p_2$ remains in $RP$, and inverses are handled similarly. Its order is

$$
|RP|=\frac{|R||P|}{|R\cap P|}.
$$

To verify the formula, the pairs $(r,p)$ producing one product differ by an element of $R\cap P$, so each product has exactly $|R\cap P|$ representations. The displayed order is a power of $p$. By Lagrange it is at most $p^a$, while $RP$ contains both $R$ and $P$, each already of order $p^a$. Thus $RP=P=R$. The common fixed point is unique.

The prime-power action lemma now gives $n_p\equiv1\pmod p$. This proves the third theorem. Finally, a Sylow $p$-subgroup is normal exactly when $n_p=1$. If it is unique, every conjugate must equal it. If it is normal, every conjugate already equals it, and conjugacy of all Sylow subgroups implies uniqueness.

## 12.8 Example: every group of order fifteen is cyclic

Let $|G|=15=3\cdot5$. The number $n_5$ divides three and is congruent to one modulo five. The only divisor of three with that congruence is one. Hence the Sylow $5$-subgroup $P$ is normal. Similarly, $n_3$ divides five and is congruent to one modulo three. The divisors of five are one and five, and five is congruent to two modulo three. Therefore $n_3=1$, so the Sylow $3$-subgroup $Q$ is also normal.

Their intersection has order dividing both three and five, hence is the identity subgroup. They commute element by element. To see this, for $p\in P$ and $q\in Q$, the commutator $pqp^{-1}q^{-1}$ lies in $Q$ because $Q$ is normal, and also lies in $P$ because $P$ is normal. It therefore equals $e$, which says $pq=qp$.

Choose generators $p$ of $P$ and $q$ of $Q$. The element $pq$ has order fifteen. If $(pq)^k=e$, commutativity gives $p^k=q^{-k}\in P\cap Q$, so both sides equal $e$. Thus both five and three divide $k$, and fifteen divides $k$. Conversely $(pq)^{15}=e$. Therefore $G=\langle pq\rangle$ is cyclic.

The proof contains more than the numerical conclusion $n_3=n_5=1$. Normality alone does not automatically make the whole group abelian; the trivial intersection and the commutator calculation supplied the needed bridge. Likewise, two commuting elements do not always have product order equal to the product of their orders. Coprimality was crucial here.

## 12.9 Example: order twenty-one admits two different behaviors

If $|G|=21=3\cdot7$, then $n_7$ divides three and satisfies $n_7\equiv1\pmod7$, so $n_7=1$. But $n_3$ divides seven and is congruent to one modulo three. Both one and seven are possible. The Sylow information therefore does not force every group of order twenty-one to be cyclic.

A concrete nonabelian example consists of functions on $\mathbb Z/7\mathbb Z$ of the form $x\mapsto ax+b$, where $a\in\{1,2,4\}$ and $b$ is any residue. There are $3\cdot7=21$ such functions. The multiplier set is closed because $2^3\equiv1\pmod7$. Composition gives

$$
(a,b)(c,d)=(ac,ad+b).
$$

The identity is $(1,0)$ and the inverse of $(a,b)$ is $(a^{-1},-a^{-1}b)$, so these functions form a group. Let $t(x)=x+1$ and $s(x)=2x$. Then $t$ has order seven and $s$ has order three. A calculation gives $sts^{-1}=t^2$, so $s$ and $t$ do not commute.

The subgroup of translations is the unique Sylow $7$-subgroup. The Sylow $3$-subgroups are not unique: if one were normal, the preceding coprime-normal-subgroup argument would make the whole group abelian. Therefore $n_3=7$. This illustrates how arithmetic possibilities guide a construction without uniquely determining it.

We have not claimed a complete classification of all groups of order twenty-one in this example. Such a classification can be obtained by analyzing homomorphisms from $C_3$ into the automorphism group of $C_7$, but the explicit function group already shows the essential phenomenon. A group order can allow a nontrivial action of one prime-order subgroup on another.

## 12.10 Counting elements can rule out the remaining numerical option

Let $|G|=45=3^2\cdot5$. Sylow gives $n_5\mid9$ and $n_5\equiv1\pmod5$, so $n_5=1$. It also gives $n_3\mid5$ and $n_3\equiv1\pmod3$, so $n_3=1$. Thus both Sylow subgroups are normal and commute. The group is a direct product of a group of order nine and a group of order five. Every group of order nine is abelian by the center argument from Chapter 11, so every group of order forty-five is abelian. It need not be cyclic, since $C_3\times C_3\times C_5$ has no element of order forty-five.

Now consider a group of order thirty. Sylow gives $n_5\in\{1,6\}$ and $n_3\in\{1,10\}$. Suppose both were nonunique. Distinct subgroups of order five have trivial intersection, since any nonidentity element generates the whole subgroup. Six such subgroups would contribute $6\cdot4=24$ distinct elements of order five. Ten subgroups of order three would contribute $10\cdot2=20$ distinct elements of order three. These collections cannot overlap, since an element cannot have two different orders. Including the identity would require at least $45$ elements, impossible in a group of order thirty. Hence at least one of the Sylow $3$- or $5$-subgroups is normal.

The counting argument relies on the subgroups having prime order. Two different subgroups of order $p^2$ can have an intersection of order $p$, so multiplying their counts by $p^2-1$ could double-count many elements. Always justify the intersection claim before using a raw element count.

## 12.11 Prime-power groups: strong constraints without a single structure

Every group of order $p^2$ is abelian, but groups of order $p^3$ need not be. The square symmetry group $D_8$ is a nonabelian group of order eight. Its center is $\{e,r^2\}$, which has order two, agreeing with the nontrivial-center theorem. The presence of a center does not force the entire group to commute.

For an abelian group of order $p^2$, there are two possibilities. If an element has order $p^2$, the group is cyclic. If no element does, every nonidentity element has order $p$. Choose $a\ne e$ and choose $b\notin\langle a\rangle$. The map $C_p\times C_p\to G$ sending $(i,j)$ to $a^ib^j$ is a homomorphism because $G$ is abelian. If $a^ib^j=e$ and $j$ is nonzero modulo $p$, then $b$ would lie in $\langle a\rangle$, a contradiction. Thus the map is injective. Domain and codomain each have $p^2$ elements, so it is an isomorphism.

This small classification is the first appearance of the finite abelian-group structure theorem developed later. Sylow theory breaks a group into prime-power questions, while abelian-group theory explains the internal possibilities for each prime. The two methods complement one another; neither replaces the other.

A useful general conclusion is that a finite abelian group is a product of its Sylow subgroups. Every subgroup is normal, and the coprime-order pieces have trivial pairwise intersections. The precise decomposition proof will be given in Chapter 21. At this stage, examples such as $C_{12}\cong C_4\times C_3$ can be recognized as the group-theoretic shadow of the Chinese remainder theorem.

## 12.12 A reliable method for small-order problems

Start by factoring the group order. For each prime, list the divisors of the cofactor and retain only those congruent to one modulo that prime. Do not declare normality until exactly one is forced, or until a further argument eliminates the other options. A list of possibilities is a constraint, not a classification.

Next look for interactions: can two hypothetical families contribute too many elements? Can a normal Sylow subgroup be acted on by a complement? Does the quotient have a simple order? Can the class equation force a central element? State which theorem applies at every transition. This disciplined order of work prevents a common mistake: selecting the most convenient allowed Sylow number and treating it as inevitable.

It also helps to separate three conclusions. An element of order $p$ gives a cyclic subgroup of order $p$. A Sylow subgroup of order $p^a$ need not contain an element of order $p^a$. A normal Sylow subgroup need not commute with every element of $G$. The affine group of order twenty-one supplies a counterexample to the last implication, while $C_2\times C_2$ supplies one to the middle implication.

The [permutations lab](../companion/index.html) supports exploration of small permutations that realize these groups. The lab can compute the cycle structure and order of an entered permutation. Conjugating $(12)$ by $(123)$ is hand work here; you can enter the resulting permutation to inspect its order. It does not enumerate all finite groups or establish Sylow's theorems. The proofs above supply those general claims; the laboratory supplies a way to inspect finite models.


## 12.13 An automorphism bridge: why $p$ dividing $q-1$ matters

The affine example suggests a general mechanism for noncommutativity in groups of order $pq$, where $p<q$ are primes. We will prove a useful criterion rather than assume that the numerical Sylow possibilities settle the question. Let $|G|=pq$. The Sylow $q$-subgroup is unique, since its number divides $p$ and is congruent to one modulo $q$; the only possibility is one. Call this subgroup $Q$. It is cyclic, because it has prime order. Choose its generator $a$.

Conjugation by any element $g\in G$ restricts to an automorphism of $Q$, since $Q$ is normal. This gives a homomorphism $G\to\operatorname{Aut}(Q)$. An automorphism of a cyclic group of prime order $q$ is determined by the image of $a$, and that image can be any nonidentity element $a^j$, with $j=1,\ldots,q-1$. Each such choice does give an automorphism: multiplication by a nonzero residue $j$ is invertible modulo $q$. Therefore $|\operatorname{Aut}(Q)|=q-1$.

Now choose a Sylow $p$-subgroup $P=\langle b\rangle$. Restricting the conjugation homomorphism gives $P\to\operatorname{Aut}(Q)$. Its image has order dividing both $p$ and $q-1$. If $p$ does not divide $q-1$, the image must be trivial. Hence $b$ commutes with $a$, and indeed every element of $P$ commutes with every element of $Q$.

Since $P\cap Q$ is trivial, the product set $QP$ contains $pq$ elements. Normality of $Q$ makes that product a subgroup, so it equals $G$. Thus $G$ is generated by commuting elements $a,b$ of coprime orders, and $ab$ has order $pq$. We have proved: if $p<q$ are primes and $p\nmid(q-1)$, every group of order $pq$ is cyclic.

This result explains the difference between orders fifteen and twenty-one. For fifteen, $3$ does not divide $5-1=4$, so no nontrivial conjugation action of the order-three subgroup on the order-five subgroup is possible. For twenty-one, $3$ divides $7-1=6$, and the multiplier $2$ modulo seven realizes a nontrivial action. The criterion does not claim that every group is nonabelian when the divisibility holds. The cyclic group $C_{21}$ still exists. It says that this divisibility opens a possible route to noncommutativity.

The argument also shows why automorphism groups matter. They measure the possible ways one subgroup can act on another through conjugation. We did not need a full theory of semidirect products to see the mechanism. When that language is introduced in a later course, the affine example will already provide a concrete model for the definition.

## 12.14 A complete normalizer computation in the square group

Let $D_8=\langle r,s:r^4=e,s^2=e,srs=r^{-1}\rangle$, the square symmetry group of order eight. Because eight is a power of two, the entire group is the unique Sylow $2$-subgroup. Sylow theory alone therefore says little about its proper subgroups. This is a useful reminder that the theorems are strongest when several prime factors compete.

Choose $s$ as reflection across a diagonal of the square, and consider the reflection subgroup $H=\{e,s\}$. Conjugation by $r$ sends $s$ to $r^2s$. One way to calculate this carefully is to use $sr^{-1}=rs$, which follows from the defining relation. Then $rsr^{-1}=r(rs)=r^2s$. Thus $r$ does not normalize $H$. A half turn does normalize it, because $r^2sr^{-2}=s$. The elements $e,r^2,s,r^2s$ all normalize $H$, and the other four do not. Hence $N_{D_8}(H)=\{e,r^2,s,r^2s\}$, of order four.

Orbit-stabilizer predicts that $H$ has two conjugates. They are $\{e,s\}$ and $\{e,r^2s\}$, corresponding to two reflection axes through opposite corners. Reflections through opposite edge midpoints form the other conjugacy family, represented by $\{e,rs\}$ and $\{e,r^3s\}$. All four subgroups have order two, but not all are conjugate.

There is no conflict with Sylow conjugacy, because none of these order-two subgroups is Sylow in a group of order eight. The hypothesis “Sylow” cannot be weakened to “same prime-power order.” This is a particularly useful counterexample because every operation can be visualized on the same square used in the previous chapter.

The normalizer is also larger than the subgroup in this example. The half turn is outside $H$ but commutes with every symmetry, so it necessarily normalizes $H$. This illustrates a general fact for a finite $p$-group: proper subgroups often have additional normalizing elements. A full normalizer-condition theorem is beyond what we need here, but the concrete computation makes clear why equality $N_G(H)=H$ should never be assumed without proof.

## 12.15 Working backward from a proposed proof

Consider the sentence “the number of Sylow $p$-subgroups divides $m$, therefore it equals one.” This is incomplete unless all other divisors have been excluded by the congruence or another argument. At order twelve, for example, $n_3$ divides four and is congruent to one modulo three. Both one and four survive. The group $A_4$ realizes four Sylow $3$-subgroups. Their eight nonidentity elements are exactly its eight three-cycles.

The order-four subgroup $V=\{e,(12)(34),(13)(24),(14)(23)\}$ of $A_4$ is a different story. It is closed under multiplication, since the product of any two distinct nonidentity members is the third, and each nonidentity member squares to the identity. Every conjugation relabels a double transposition into another double transposition, so $V$ is normal. It is therefore the unique Sylow $2$-subgroup. This gives a group in which one prime's Sylow subgroup is normal while another prime's Sylow subgroups are not.

A second tempting sentence is “the quotient by a Sylow subgroup has order $m$.” A quotient group exists only when the Sylow subgroup is normal. The set of left cosets always has $m$ elements, which was enough for the conjugacy proof. Its role there was an acted-on set, not a group. Replacing a coset set by a quotient group without checking normality changes the mathematics.

A third tempting sentence is “two distinct Sylow subgroups intersect trivially.” This is true for distinct subgroups of prime order, because the only subgroup orders available in either are one and that prime. For higher prime powers it can fail. In $D_8$, the two order-four subgroups $\langle r\rangle$ and $\{e,r^2,s,r^2s\}$ intersect in $\{e,r^2\}$. They are not Sylow in $D_8$, but the example already disproves the underlying general assertion about equal prime-power subgroups. In larger groups, distinct Sylow subgroups can likewise overlap nontrivially.

When auditing an element-counting proof, ask which orders are being counted and whether the counted sets are disjoint. When auditing a quotient proof, ask which subgroup is normal. When auditing an action proof, ask whether the action is defined on elements, subgroups or cosets. These are different objects, and identifying them accurately often repairs a proof more effectively than manipulating the final equation.

## 12.16 What the theorems leave undecided

The Sylow theorems are powerful constraints, not a complete algorithm classifying all finite groups from their orders. The groups $C_8$ and $D_8$ have the same order and identical trivial Sylow-number data, yet one is abelian and the other is not. Even among abelian groups, $C_8$, $C_4\times C_2$ and $C_2\times C_2\times C_2$ have different element-order patterns.

A useful question is therefore not “does Sylow solve the group?” but “which uncertainty does Sylow remove?” At order fifteen it forces two normal cyclic pieces that commute, removing all uncertainty. At order twenty-one it forces one normal cyclic piece and leaves an action to analyze. At prime-power order it leaves most of the internal multiplication unresolved, so centers, element orders and later abelian-group structure become more important.

This distinction is part of mathematical judgment. A theorem can be fully applied and still leave a problem open. That is not a failed calculation. It tells us which additional invariant or construction is needed. In the coming ring chapters, the same lesson will reappear: knowing a quotient's cardinality constrains its structure, but one must still distinguish a field from a ring with zero divisors.


## 12.17 What “a product of subgroups” means

When two normal subgroups $P,Q$ have trivial intersection, the conclusion that they commute has a precise structural form. The map $P\times Q\to G$ given by $(p,q)\mapsto pq$ is a homomorphism: the image of $(p,q)(p',q')$ is $pp'qq'$, while the product of the images is $pqp'q'$, and these agree because every element of $P$ commutes with every element of $Q$. Its kernel consists of pairs with $pq=e$, which means $p=q^{-1}\in P\cap Q$. The trivial-intersection condition makes the kernel trivial.

If additionally $|P||Q|=|G|$, the injective map has equal finite domain and codomain sizes, so it is surjective and hence an isomorphism. We then call $G$ an internal direct product of $P$ and $Q$. The external direct product $P\times Q$ is a separately constructed set of ordered pairs with componentwise multiplication. The isomorphism identifies the two descriptions, but they are not literally the same underlying set.

Normality of both subgroups did two jobs: it made the commutator lie in both subgroups, and therefore made the product map preserve multiplication. If only one subgroup is normal, the set product can still be a subgroup and can still have full size, but the direct-product map need not be a homomorphism. The affine group of order twenty-one exhibits that failure. Its translation and multiplier subgroups combine to describe every affine function, but the multiplier acts nontrivially on translations.

A final caution concerns cyclicity. A direct product of cyclic groups of coprime orders is cyclic, as the order argument for $pq$ showed. A direct product of cyclic groups with overlapping prime factors need not be cyclic. In $C_2\times C_2$, every element squares to the identity, so no single element generates all four pairs. Thus even after obtaining a direct-product decomposition, one must inspect factor orders before claiming a cyclic generator. This distinction is exactly why the finite abelian-group theorem records prime-power factors rather than only the total cardinality.

## 12.18 Reading the numerical conditions together

The two restrictions on $n_p$ must be used simultaneously. Divisibility controls the list of candidates; congruence selects positions within that list. Neither restriction alone usually suffices. At order twenty-one, the candidate seven survives both restrictions for $n_3$, while at order fifteen the candidate five fails the congruence. Writing the actual divisor list is often faster and more reliable than trying to remember a classification theorem. After the arithmetic, state the structural translation explicitly: a unique Sylow subgroup is normal because all conjugates are Sylow subgroups and hence coincide. This final sentence connects the number one to the group property needed in the next step.

## 12.19 Optional exercises

Hints and complete solutions are in [Chapter 12 solutions](../solutions/12-solutions.md).

1. For a group of order $84$, list all Sylow-number possibilities $n_2,n_3,n_7$ allowed by the third Sylow theorem.
2. Prove that every group of order $35$ is cyclic.
3. A group has order $56$. Prove that it has either a normal Sylow $7$-subgroup or a normal Sylow $2$-subgroup.
4. Explain why Cauchy's theorem does not guarantee an element of order four in a group of order twelve, and give a concrete group demonstrating failure.
5. In the order-twenty-one affine group, compute $s^2ts^{-2}$ and the commutator $sts^{-1}t^{-1}$.
6. Prove that if $P$ is a normal Sylow $p$-subgroup, every $p$-subgroup of $G$ is contained in $P$.
7. Show that a finite group with exactly one Sylow subgroup for each prime dividing its order is a product of those Sylow subgroups. You may present the argument for two primes and then explain the induction.
8. Prove that a group of order $p^2$ has exactly one subgroup of order $p$ when it is cyclic, and exactly $p+1$ such subgroups when it is isomorphic to $C_p\times C_p$.

We now have two ways to extract algebra from arithmetic: residue calculations produce groups, and prime factorizations constrain finite groups. The next chapter returns to the integers' second operation. Keeping addition and multiplication together leads to rings, where divisibility, quotients and factorization can be rebuilt in a much broader setting.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](11-group-actions-and-counting.md) · [Next chapter](13-rings-domains-and-fields.md) · [Hints and solutions](../solutions/12-solutions.md)
