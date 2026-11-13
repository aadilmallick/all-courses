# Chapter 08 — Homomorphisms, normal subgroups and quotients

Reducing an integer modulo $n$ forgets its exact value while preserving addition. If we know only the residue classes of two integers, we can still determine the residue class of their sum. This controlled loss of information is one of the main ideas of algebra. The relevant maps are called homomorphisms, and the objects formed by forgetting precisely the right information are called quotient groups.

Our central question is concrete: when can a partition of a group into cosets itself carry a consistent multiplication? The tentative rule is to multiply representatives. The difficulty is that each coset has many representatives, and a valid result must be independent of the choice. Normal subgroups are exactly the subgroups that make the rule work.

This chapter connects those two views. A homomorphism loses information through its kernel; a quotient removes exactly that information; and the first isomorphism theorem shows that the two constructions agree. Read the chapter in stages rather than trying to memorize the named theorems at once. Each theorem organizes a calculation we can inspect directly.

## 1. A map that respects the operation

Let $G,H$ be groups. A function $f:G\to H$ is a **group homomorphism** if

$$
f(ab)=f(a)f(b)\qquad\text{for all }a,b\in G.
$$

The multiplication on the left is in $G$; the multiplication on the right is in $H$. If the groups are written additively, the condition becomes $f(a+b)=f(a)+f(b)$. If only one is additive, mix the notations appropriately. The condition always says that combining before applying the map gives the same result as applying the map first and combining afterward.

Reduction $\pi:\mathbb Z\to\mathbb Z/n\mathbb Z$, given by $\pi(k)=[k]$, is an additive homomorphism because $[a+b]=[a]+[b]$. Multiplication by a fixed integer $m$ gives an additive homomorphism $f:\mathbb Z\to\mathbb Z$ with $f(k)=mk$. Its image is $m\mathbb Z$. The map preserves addition even when it is not onto the target group.

A constant homomorphism must send every element to the identity. Indeed, the constant value $c$ would have to satisfy $c=cc$, and cancellation gives $c=e_H$. A constant map to any other element does not preserve multiplication. The map $f(k)=k+1$ on the additive integers is a simple nonexample: $f(0+0)=1$, whereas $f(0)+f(0)=2$.

The definition does not explicitly require $f(e_G)=e_H$, but this follows. We have $f(e_G)=f(e_Ge_G)=f(e_G)f(e_G)$, so cancellation in $H$ gives $f(e_G)=e_H$. Similarly,

$$
f(a)f(a^{-1})=f(aa^{-1})=e_H,
$$

so uniqueness of inverses gives $f(a^{-1})=f(a)^{-1}$. Therefore $f(a^k)=f(a)^k$ for every integer $k$. A homomorphism preserves all group calculations, not merely the first multiplication displayed in its definition.

## 2. Image and kernel: what survives and what disappears

The **image** of $f:G\to H$ is the subset $f(G)=\{f(g):g\in G\}$ of $H$. It is a subgroup: it contains $e_H=f(e_G)$, and $f(a)f(b)^{-1}=f(ab^{-1})$ again belongs to the image. The image need not equal the stated target $H$. A map is **surjective** precisely when it does.

The **kernel** is

$$
\ker f=\{g\in G:f(g)=e_H\}.
$$

It is a subgroup of $G$, by the same subgroup test: if $f(a)=f(b)=e_H$, then $f(ab^{-1})=e_H$. The kernel records elements that become indistinguishable from the identity after applying $f$. For reduction of integers modulo $n$, the kernel is $n\mathbb Z$.

More generally, two elements have the same image exactly when their difference in group language lies in the kernel:

$$
f(a)=f(b)\quad\Longleftrightarrow\quad b^{-1}a\in\ker f.
$$

To prove this, multiply $f(a)=f(b)$ on the left by $f(b)^{-1}$ and use preservation of products and inverses. The converse reverses the same calculation. This is the coset-equality criterion from Chapter 7 with the kernel playing the role of the subgroup.

A homomorphism is injective if and only if its kernel is trivial, meaning $\ker f=\{e_G\}$. If the kernel is trivial and $f(a)=f(b)$, then $b^{-1}a=e_G$ and $a=b$. Conversely, injectivity forces the only preimage of $e_H=f(e_G)$ to be $e_G$. This criterion replaces a comparison of arbitrary pairs by a single question about identity preimages.

For $f:\mathbb Z\to\mathbb Z$ with $f(k)=3k$, the kernel is $\{0\}$, so the map is injective. It is not onto $\mathbb Z$, since $1$ is not a multiple of $3$. For reduction modulo $n$, the image is the whole finite group, but the kernel is nontrivial. These examples keep injectivity and surjectivity distinct.

## 3. Isomorphisms preserve the entire multiplication pattern

A bijective homomorphism is an **isomorphism**. We write $G\cong H$ when one exists. The inverse function of an isomorphism is also a homomorphism. To check this, write arbitrary $u,v\in H$ as $u=f(a)$ and $v=f(b)$. Then $f^{-1}(uv)=f^{-1}(f(ab))=ab=f^{-1}(u)f^{-1}(v)$.

An isomorphism is more than a matching of elements. It preserves products, identities, inverses, equations, and element orders. For example, if $a$ has finite order $n$, then $f(a)^n=e_H$. If a smaller positive power of $f(a)$ were the identity, injectivity would force the same smaller return for $a$. Hence $\operatorname{ord}(f(a))=\operatorname{ord}(a)$.

The map $\mathbb Z/n\mathbb Z\to\langle a\rangle$ given by $[k]\mapsto a^k$ is an isomorphism whenever $a$ has order $n$. The map is well-defined because exponents differing by a multiple of $n$ give the same power. It preserves the operation since $a^{r+s}=a^ra^s$. The order calculation from Chapter 7 supplies injectivity and surjectivity. This makes the statement that all cyclic groups of order $n$ have the same structure precise.

The groups $C_4$ and $C_2\times C_2$ are not isomorphic. The first has an element of order $4$, while the second does not. Likewise, an abelian group cannot be isomorphic to a nonabelian group, because applying a surjective homomorphism to $ab=ba$ shows that all target elements commute. These are examples of **invariants**, properties unchanged by isomorphism.

A useful distinction concerns maps that are injective but not surjective. Multiplication by $3$ identifies $\mathbb Z$ with the subgroup $3\mathbb Z$, so $\mathbb Z\cong3\mathbb Z$. It does not identify $\mathbb Z$ bijectively with all of itself through that particular map. The same formula can be an isomorphism or merely an injective homomorphism depending on the stated target.

## 4. Kernels have a special stability property

Let $K=\ker f$. For any $g\in G$ and $k\in K$,

$$
f(gkg^{-1})=f(g)f(k)f(g)^{-1}=f(g)e_Hf(g)^{-1}=e_H.
$$

Thus $gkg^{-1}\in K$. The expression $gkg^{-1}$ is called a **conjugate** of $k$. It means that we change the frame in which the operation $k$ is described. In a symmetry group, conjugating a reflection changes its axis; the formula is algebraically meaningful even without geometry.

A subgroup $N\le G$ is **normal**, written $N\trianglelefteq G$, if $gNg^{-1}=N$ for every $g\in G$. Here $gNg^{-1}$ denotes the set of all $gng^{-1}$ with $n\in N$. The kernel calculation gives one inclusion. Replacing $g$ by $g^{-1}$ gives the reverse inclusion, so every kernel is normal.

It is enough to check $gNg^{-1}\subseteq N$ for every $g$, because the inverse substitution supplies equality. The phrase for every is essential. A subgroup can be stable under conjugation by some elements while failing stability under others. Testing a few convenient elements is enough only if a separate generation argument shows they cover all conjugations.

Normality is equivalent to $gN=Ng$ for every $g\in G$. If $gNg^{-1}=N$, multiply the two sets on the right by $g$. Conversely, if $gN=Ng$, multiply on the right by $g^{-1}$. This equivalence explains why normality appeared at the end of Chapter 7 as the condition that left and right cosets match.

Every subgroup of an abelian group is normal, because $gng^{-1}=n$. The identity subgroup and the whole group are always normal. A subgroup of index two is normal, because its nontrivial left and right cosets are both the complement of the subgroup. Normal does not mean central: its elements may move under conjugation as long as they remain somewhere inside the subgroup.

## 5. Normality in the square group

In $D_8$, the rotation subgroup $R=\langle r\rangle$ is normal. It has index two, so the general argument already proves it. Directly, conjugation by a reflection sends $r$ to $r^{-1}$, which remains a rotation. The subgroup is stable even though the particular quarter-turn is changed.

The reflection subgroup $H=\{e,s\}$ is not normal. Compute

$$
r s r^{-1}=r^2s.
$$

The relation $sr^{-1}=rs$ gives the equality. The result is a different reflection and does not belong to $H$. A single conjugate outside the subgroup disproves normality.

The center $Z(D_8)=\{e,r^2\}$ is normal as well, because conjugation fixes each of its elements. In every group, the center is normal for this reason. But $R$ is larger than the center and still normal, showing concretely that normality is weaker than requiring every element to commute with the whole group.

An isomorphism carries normal subgroups to normal subgroups. If $f:G\to H$ is an isomorphism and $N\trianglelefteq G$, write an arbitrary element of $H$ as $f(g)$. Then conjugating $f(n)$ by $f(g)$ gives $f(gng^{-1})$, which lies in $f(N)$. Normality is therefore structural, not dependent on the names attached to elements.

## 6. Why multiplying cosets can fail

For a subgroup $H\le G$, try to define $(aH)(bH)=abH$. The left side refers to two subsets, but the right side uses selected representatives. If $aH=a'H$ and $bH=b'H$, a well-defined operation requires $abH=a'b'H$. Without this condition the same two inputs could receive two different outputs.

The failure is visible in $D_8$ with $H=\{e,s\}$. The coset $H$ can be represented by $e$ or $s$. Multiply it by $rH$. Using $e$ gives $rH=\{r,rs\}$. Using $s$ gives $srH=r^3sH=\{r^3s,r^3\}=r^3H$, which is different. Thus the tentative rule does not define a function on cosets.

The problem is not that a product of group elements is ambiguous. Each representative product is perfectly well-defined. The ambiguity appears only after we declare different representatives to be the same input. This is exactly the distinction between a formula on representatives and a well-defined operation on equivalence classes.

If $N$ is normal, the problem disappears. Write $a'=an_1$ and $b'=bn_2$ with $n_1,n_2\in N$. Then

$$
a'b'=an_1bn_2=ab(b^{-1}n_1b)n_2.
$$

Normality puts $b^{-1}n_1b$ in $N$, and closure puts its product with $n_2$ in $N$. Consequently $a'b'N=abN$. The selected representatives no longer affect the resulting coset.

This calculation explains precisely where normality is used: it allows a subgroup factor to pass across a general group factor at the cost of conjugating it, and the conjugated factor remains inside the subgroup. We do not assume the factors commute. Normality repairs representative independence without imposing commutativity on the entire group.

## 7. Constructing the quotient group

For $N\trianglelefteq G$, the **quotient group** $G/N$ is the set of cosets $gN$ with multiplication

$$
(aN)(bN)=abN.
$$

Well-definedness was just proved. Associativity follows from associativity in $G$: $((aN)(bN))(cN)=(ab)cN=a(bc)N$. The identity is the coset $N=eN$, and the inverse of $aN$ is $a^{-1}N$. Thus all group axioms are satisfied.

The canonical map $\pi:G\to G/N$, given by $\pi(g)=gN$, is a surjective homomorphism. Its kernel is $N$, because $gN=N$ exactly when $g\in N$. We have proved the converse of the earlier kernel observation: every normal subgroup occurs as the kernel of a natural homomorphism.

For finite $G$, the quotient has $[G:N]=|G|/|N|$ elements. Each element of the quotient is itself a set containing $|N|$ original elements. There are therefore two different counts to keep separate: the size of a coset as a subset of $G$, and the number of cosets as elements of $G/N$.

For the additive integers, $\mathbb Z/n\mathbb Z$ is exactly the quotient by the subgroup $n\mathbb Z$. The operation on cosets is the familiar addition of residue classes. The quotient construction did not change modular arithmetic; it explained why its class arithmetic works and identified a general condition under which similar constructions are valid.

For the square group modulo its rotations, $D_8/R$ has two elements: the rotation coset $R$ and the reflection coset $sR$. Multiplying two reflection cosets gives $s^2R=R$. The quotient remembers whether a symmetry is a rotation or reflection, while forgetting which particular one it is. Its operation pattern is the cyclic group of order two.

## 8. The first isomorphism theorem, built from its map

Let $f:G\to H$ be a homomorphism and $K=\ker f$. Define a function

$$
\overline f:G/K\longrightarrow f(G),\qquad \overline f(gK)=f(g).
$$

We must first show it is well-defined. If $gK=g'K$, then $g'^{-1}g\in K$, so $f(g'^{-1}g)=e_H$ and $f(g)=f(g')$. Thus the output depends only on the coset, not on the representative.

The map preserves multiplication because

$$
\overline f((aK)(bK))=f(ab)=f(a)f(b).
$$

It is surjective onto the image by definition. It is injective because equality $f(a)=f(b)$ forces $b^{-1}a\in K$, hence $aK=bK$. Therefore it is an isomorphism:

$$
G/\ker f\cong f(G).
$$

This is the **first isomorphism theorem**. The proof is more valuable than the slogan. It identifies the actual map, checks the representative issue, and proves both injectivity and surjectivity. The theorem says that collapsing exactly the kernel loses exactly the information that $f$ loses—no more and no less.

For a finite group, it yields the counting formula $|G|=|\ker f|\,|f(G)|$. The target group may be larger than the image, so replacing $|f(G)|$ by $|H|$ requires surjectivity. This small distinction is responsible for many incorrect applications of the theorem.

## 9. A detailed arithmetic example

Define $f:\mathbb Z\to\mathbb Z/12\mathbb Z$ by $f(k)=[8k]$. This is an additive homomorphism. Its image is $\{[0],[8],[4]\}$, because successive multiples of $[8]$ repeat after three steps. Its kernel consists of integers $k$ satisfying $12\mid8k$, equivalently $3\mid2k$, and therefore $3\mid k$ by coprimality. Thus $\ker f=3\mathbb Z$.

The first isomorphism theorem identifies $\mathbb Z/3\mathbb Z$ with the three-element image. The explicit map is $[k]_3\mapsto[8k]_{12}$. It sends $[0]$ to $[0]$, $[1]$ to $[8]$, and $[2]$ to $[4]$. Adding $[1]+[2]=[0]$ corresponds to $[8]+[4]=[0]$ in the image.

The theorem does not claim $\mathbb Z/3\mathbb Z\cong\mathbb Z/12\mathbb Z$. The image is only a subgroup of the target. Writing the explicit image before applying the theorem prevents that error.

For a broader example, let $m,n\ge2$ be coprime and consider

$$
f:\mathbb Z\to\mathbb Z/m\mathbb Z\times\mathbb Z/n\mathbb Z,\qquad
f(k)=([k]_m,[k]_n).
$$

Its kernel is $mn\mathbb Z$, since simultaneous divisibility by coprime $m,n$ is equivalent to divisibility by $mn$. The Chinese remainder theorem supplies surjectivity. Therefore the first isomorphism theorem gives $\mathbb Z/mn\mathbb Z\cong\mathbb Z/m\mathbb Z\times\mathbb Z/n\mathbb Z$ as additive groups. The familiar reconstruction formula is one way to calculate the inverse isomorphism.

## 10. The universal property of forgetting a subgroup

Suppose $N\trianglelefteq G$ and $f:G\to H$ sends every element of $N$ to the identity. Equivalently, $N\subseteq\ker f$. Then there is a unique homomorphism $\widetilde f:G/N\to H$ satisfying $f=\widetilde f\circ\pi$, where $\pi(g)=gN$.

The only possible definition is $\widetilde f(gN)=f(g)$, because the factorization condition forces that value. It is well-defined precisely because changing $g$ by an element of $N$ does not change its image. The homomorphism calculation is the same as before. Uniqueness follows because every coset is reached by $\pi$.

This is called a **universal property**: it characterizes a construction by how maps to other objects must pass through it. Here it has a direct meaning. If a calculation already ignores every element of $N$, it can be performed using only cosets of $N$. Quotienting does not obstruct any homomorphism that was already blind to that information.

For example, reduction modulo $2$ factors through reduction modulo $6$, because $6\mathbb Z\subseteq2\mathbb Z$. The induced map sends $[k]_6$ to $[k]_2$. In contrast, reduction modulo $4$ does not factor through reduction modulo $6$: the integers $0$ and $6$ give the same class modulo $6$ but different classes modulo $4$. The obstruction is exactly the failed kernel containment $6\mathbb Z\nsubseteq4\mathbb Z$.

This example makes an abstract existence theorem testable through representatives. Before defining a map on residue classes, ask whether two equivalent inputs are guaranteed to have equivalent outputs. Kernel containment packages that question in group language.

## 11. Subgroups in a quotient and the correspondence theorem

Let $\pi:G\to G/N$ be the quotient map. If $L$ is a subgroup of $G/N$, its preimage

$$
\pi^{-1}(L)=\{g\in G:\pi(g)\in L\}
$$

is a subgroup of $G$ containing $N$. To check closure, apply $\pi$ to $ab^{-1}$ and use the subgroup test in $L$. Containment of $N$ follows because every kernel element maps to the identity, which belongs to $L$.

Conversely, if $K\le G$ contains $N$, its image $\pi(K)$ is the subgroup $K/N$ of $G/N$. These two operations reverse one another. Starting with $K$, an element lies in $\pi^{-1}(\pi(K))$ exactly when it has the same coset as some $k\in K$. Then it differs from $k$ by an element of $N\subseteq K$, so it belongs to $K$. Starting with $L$, surjectivity of $\pi$ gives $\pi(\pi^{-1}(L))=L$.

Thus subgroups of $G/N$ correspond bijectively to subgroups of $G$ containing $N$. This is the **correspondence theorem**. The containment condition is indispensable: a subgroup not containing $N$ may shrink or merge with another subgroup under the quotient map.

Normality is preserved in this correspondence. If $K\trianglelefteq G$, then conjugating $kN$ by $gN$ gives $(gkg^{-1})N\in K/N$. Conversely, normality of $K/N$ implies that $gkg^{-1}$ has a coset belonging to $K/N$, hence belongs to $K$ because $N\subseteq K$. So $K/N\trianglelefteq G/N$ exactly when $K\trianglelefteq G$.

As an example, subgroups of $\mathbb Z/12\mathbb Z$ correspond to additive subgroups $d\mathbb Z$ containing $12\mathbb Z$. The containment holds exactly when $d\mid12$. This recovers the cyclic subgroup classification through a quotient map and explains why divisors appear naturally.

## 12. Quotienting in two stages

Suppose $N\trianglelefteq G$ and $K\trianglelefteq G$ with $N\subseteq K$. First form $G/N$, then collapse its normal subgroup $K/N$. The resulting group has the same structure as collapsing $K$ immediately:

$$
(G/N)/(K/N)\cong G/K.
$$

To prove this, define $F:G/N\to G/K$ by $F(gN)=gK$. It is well-defined because $N\subseteq K$, is a homomorphism, and is surjective. Its kernel consists of cosets $gN$ with $g\in K$, which is exactly $K/N$. The first isomorphism theorem gives the displayed isomorphism. This is often called the third isomorphism theorem.

For integers, take $N=12\mathbb Z$ and $K=3\mathbb Z$. We begin with twelve residue classes, then identify classes differing by $3$. The subgroup $K/N$ has four elements, and the final quotient has three elements, matching $\mathbb Z/3\mathbb Z$. The explicit map $[k]_{12}\mapsto[k]_3$ shows that the two-stage construction introduces no new mystery.

A related theorem is the second isomorphism theorem. If $A\le G$ and $N\trianglelefteq G$, then $AN=\{an:a\in A,n\in N\}$ is a subgroup, and

$$
A/(A\cap N)\cong AN/N.
$$

For the subgroup claim, multiply $a_1n_1a_2n_2$ and rewrite it as $a_1a_2(a_2^{-1}n_1a_2)n_2$, which belongs to $AN$ by normality. Inverses are handled by the same conjugation idea. Restrict the quotient map $G\to G/N$ to $A$. Its kernel is $A\cap N$, and its image is $AN/N$, since $(an)N=aN$. The first isomorphism theorem proves the result. The named theorem is therefore a reusable instance of a map-and-kernel calculation.

## 13. Conjugation and commutators

For fixed $g\in G$, the map $c_g(x)=gxg^{-1}$ is an isomorphism from $G$ to itself, called an **inner automorphism**. It preserves products because

$$
gxyg^{-1}=(gxg^{-1})(gyg^{-1}),
$$

and its inverse is $c_{g^{-1}}$. An isomorphism from a group to itself is called an automorphism. Normal subgroups are exactly the subgroups stable under every inner automorphism.

The element $aba^{-1}b^{-1}$ is a **commutator** of $a$ and $b$. It equals $e$ precisely when $ab=ba$. Let $[G,G]$ denote the subgroup generated by all such commutators. This notation names a subgroup, not just the set of individual commutators; products of commutators may be needed.

Conjugating a commutator gives a commutator of the conjugated elements:

$$
g(aba^{-1}b^{-1})g^{-1}
=(gag^{-1})(gbg^{-1})(gag^{-1})^{-1}(gbg^{-1})^{-1}.
$$

Therefore conjugation preserves the generating set and hence its generated subgroup. Thus $[G,G]\trianglelefteq G$.

The quotient $G/[G,G]$ is abelian. In the quotient every commutator becomes the identity, which is exactly the condition that every pair of cosets commute. Moreover, any homomorphism from $G$ to an abelian group kills every commutator and therefore kills $[G,G]$. It factors uniquely through this quotient by the universal property. The quotient is called the **abelianization**: it forgets precisely the obstruction to commutativity relevant to homomorphisms into abelian groups.

This construction will return when we discuss solvable groups. For now, the main lesson is the method: define a subgroup from a desired relation, prove normality, and then pass to a quotient where the relation becomes true.

## Homomorphisms out of a cyclic group

A homomorphism from a cyclic group is completely determined by the image of a generator. If $G=\langle a\rangle$ and $f(a)=b$, then preservation of powers forces $f(a^k)=b^k$ for every integer $k$. There is no independent freedom to choose images of the other elements. The remaining question is whether the proposed value $b$ gives a consistent function.

When $a$ has infinite order, every element has a unique exponent, so any selected $b\in H$ defines a homomorphism by this formula. When $a$ has finite order $n$, we need $b^n=e_H$, because $a^n=e_G$ must map to the identity. That condition is also sufficient: if $a^r=a^s$, then $n\mid(r-s)$, and $b^n=e_H$ gives $b^r=b^s$. Thus the formula is independent of the exponent representative. The resulting map preserves products because adding exponents corresponds to multiplying powers.

This is a first example of defining a homomorphism by generators and relations. The generator may be assigned an image, but the image must satisfy every relation already imposed on that generator. The relation $a^n=e$ becomes the compatibility condition $b^n=e$. Later examples with several generators follow the same principle, although checking that a list of relations is complete requires additional care.

Consider additive homomorphisms from $\mathbb Z/n\mathbb Z$ to $\mathbb Z/m\mathbb Z$. Such a map is determined by $f([1]_n)=[t]_m$, and it has the form $f([k]_n)=[kt]_m$. It is well-defined exactly when $m\mid nt$. Let $d=\gcd(m,n)$, write $m=dm_0$ and $n=dn_0$, and use $\gcd(m_0,n_0)=1$. The condition is equivalent to $m_0\mid t$. Among residue classes modulo $m$, there are exactly $d$ multiples of $m_0$. Hence there are exactly $\gcd(m,n)$ homomorphisms between these two additive cyclic groups.

For example, from $\mathbb Z/6\mathbb Z$ to $\mathbb Z/8\mathbb Z$, the allowed images of $[1]$ are $[0]$ and $[4]$. The second choice yields image $\{[0],[4]\}$ and kernel $\{[0],[2],[4]\}$ in the six-element domain. The quotient of the domain by that kernel has two elements, agreeing with the image. There cannot be a surjective homomorphism in this direction because a six-element set cannot cover an eight-element set; the image calculation gives the stronger structural description.

An automorphism of $\mathbb Z/n\mathbb Z$ must send $[1]$ to another generator, so it has the form $[k]\mapsto[tk]$ with $\gcd(t,n)=1$. Conversely, such a $t$ has a multiplicative inverse modulo $n$ by Bezout's identity, giving an inverse map. Composing the maps associated with $t$ and $u$ multiplies their parameters modulo $n$. This observation anticipates the unit group of the next chapter: invertible residue classes encode the automorphisms of a cyclic group.

## Fibers are translated kernels

For a function, the preimage of one target value is often called a **fiber**. Suppose $f:G\to H$ is a homomorphism and $y=f(g)$ belongs to its image. The fiber over $y$ is exactly $g\ker f$. To prove this, if $x=gk$ with $k\in\ker f$, then $f(x)=f(g)f(k)=y$. Conversely, if $f(x)=f(g)$, then $g^{-1}x\in\ker f$, so $x\in g\ker f$.

Thus all nonempty fibers have the same size, because all cosets of a subgroup have the same size. For finite groups, the counting formula $|G|=|\ker f|\,|f(G)|$ follows directly: the domain is partitioned into one equally sized fiber for each image element. The first isomorphism theorem says more than this counting fact, since it also identifies the multiplication pattern of the fibers.

The distinction between empty and nonempty fibers matters. A target value outside the image has an empty fiber; there is no reason to assign it the kernel's size. In the map $k\mapsto[8k]_{12}$, only three of the twelve possible target classes have nonempty fibers. Every one of those fibers is a congruence class modulo $3$ in the integer domain. The target contains extra elements that the map never uses.

The fiber viewpoint is useful for solving equations. If one solution $g$ of $f(x)=y$ is known, all solutions are $g\ker f$. A particular solution supplies the location, while the kernel supplies every allowed variation. This is the same pattern seen in linear congruences: after finding one solution, adding the appropriate step size generates all the others. It will appear again for linear equations, polynomial evaluation, and later ring homomorphisms.

## Normality relative to which group?

A subgroup can be normal in one ambient group but fail to be normal in a larger group. Every group is normal in itself, since conjugation by one of its elements stays inside it. In the square group, however, $\{e,s\}$ is not normal in $D_8$. The ambient group determines which conjugations must be checked. Saying only that a set is normal, without specifying an ambient group when ambiguity exists, can hide the actual assertion.

This explains a useful qualification about images. If $f:G\to H$ is any homomorphism and $N\trianglelefteq G$, then $f(N)$ is normal in $f(G)$. Every conjugating element of $f(G)$ is $f(g)$, and conjugating $f(n)$ yields $f(gng^{-1})$. But an element of $H$ outside $f(G)$ need not have such a preimage, so the proof says nothing about its conjugation action. Surjectivity repairs this gap by making $f(G)=H$.

Inverse images behave more uniformly. If $M\trianglelefteq H$, then $f^{-1}(M)$ is normal in $G$ whether or not $f$ is surjective. For $x$ in the preimage and $g\in G$, the image of $gxg^{-1}$ is $f(g)f(x)f(g)^{-1}$, which belongs to $M$. Thus conjugation stays in the preimage. The direction of the map determines whether a surjectivity hypothesis is needed.

These statements are not isolated rules to memorize. Each follows by writing the defining conjugation equation and checking whether every required element can be expressed as an image. Keeping the domain, image, and full target visible usually reveals the correct hypothesis before the proof is complete.

## A diagnostic example: the squaring function

The formula $q(g)=g^2$ looks algebraic, but it need not define a homomorphism. On an abelian group it does: $(ab)^2=a^2b^2$ because the two middle factors can be exchanged. On a nonabelian group that exchange may be invalid. In fact, the squaring function is a homomorphism from a group to itself if and only if the group is abelian.

For the less immediate direction, suppose $(ab)^2=a^2b^2$ for every $a,b$. Expanding gives $abab=aabb$. Cancel the first $a$ on the left, obtaining $bab=abb$. Cancel the last $b$ on the right, obtaining $ba=ab$. Because $a,b$ were arbitrary, every pair commutes. The proof pinpoints exactly what the apparently innocent squaring formula assumes.

In $D_8$, take $a=r$ and $b=s$. The product $rs$ is a reflection, so $(rs)^2=e$. But $r^2s^2=r^2\ne e$. Thus the squaring map fails the homomorphism condition on this explicit pair. It still defines a perfectly valid function on the group. The failed property is preservation of multiplication, not the existence of the function.

On an abelian group, the kernel of the squaring homomorphism is the set of elements satisfying $g^2=e$. The first isomorphism theorem then identifies the quotient by that kernel with the subgroup of squares. For the cyclic group of order eight, generated by $a$, the kernel is $\{e,a^4\}$ and the image is $\{e,a^2,a^4,a^6\}$. The quotient has four elements and is cyclic, as the image shows.

This example provides a useful habit for later algebra. A formula involving familiar operations is not automatically a structure-preserving map. Write the homomorphism condition, expand both sides using the relevant axioms, and determine what extra hypothesis is required. If the hypothesis fails, look for a small pair exposing the failure. The same strategy will prevent mistakes with polynomial evaluation, matrix powers, and maps between rings later in the course.

## 14. Diagnosing false quotient arguments

A subgroup need not be normal. Listing cosets is always legitimate, but multiplying them by representatives needs an additional check. The nonnormal reflection subgroup of $D_8$ is a compact counterexample worth keeping available. It exposes a failed definition before a long calculation can conceal the problem.

A kernel is a subset of the domain, while an image is a subset of the target. Mixing their locations leads to expressions with no meaning. For a homomorphism $f:G\to H$, the quotient in the first isomorphism theorem is formed from $G$, not from $H$. Writing the source and target above a map often resolves the confusion immediately.

An isomorphism requires bijectivity and operation preservation. A bijection alone can pair the elements of $C_4$ with those of $C_2\times C_2$, but cannot preserve multiplication because element orders differ. Conversely, a homomorphism can preserve every product while collapsing many elements. Both conditions matter.

A proof of representative independence should compare arbitrary representatives, not merely a few selected ones. The calculation with $a'=an_1$ and $b'=bn_2$ does exactly that. Examples help us discover the rule, while the general calculation establishes it for every input.

In the [companion](../companion/index.html), compare modular unit groups in the `units` experiment and retain the additive quotient examples from this chapter on paper. The companion's finite computations do not implement a general quotient-group engine; the explicit maps above are the central worked models for quotients.

A final way to organize a quotient proof is to keep a three-column record: original elements, the equivalence criterion, and resulting cosets. For a kernel quotient, the criterion is equality of images. For an integer quotient, it is a difference divisible by the modulus. For the square modulo rotations, it is agreement about being a rotation or reflection. These descriptions look different on the surface, but each identifies elements differing by a normal-subgroup factor. Stating the criterion in ordinary words before using quotient notation often makes a complicated example manageable. It also gives an immediate test for whether a proposed map can descend to the quotient.

## 15. Optional exercises

Hints and full arguments are in [Chapter 08 solutions](../solutions/08-solutions.md).

1. Classify all additive homomorphisms $f:\mathbb Z\to\mathbb Z$ and determine which are injective, surjective, or isomorphisms.
2. Define $f:\mathbb Z/18\mathbb Z\to\mathbb Z/6\mathbb Z$ by $f([k]_{18})=[k]_6$. Prove well-definedness, find the kernel and image, and state the resulting first-isomorphism identification.
3. Show that $[k]_m\mapsto[k]_n$ defines a map from $\mathbb Z/m\mathbb Z$ to $\mathbb Z/n\mathbb Z$ exactly when $n\mid m$.
4. Prove that the inverse image of a normal subgroup under any homomorphism is normal. Explain why the image of a normal subgroup is automatically normal in the image of the map, but need not be normal in a larger target.
5. Compute $D_8/\{e,r^2\}$ explicitly and identify its group structure.
6. Suppose $G$ is finite and $f:G\to H$ is a homomorphism with kernel of size $4$ and image of size $9$. Find $|G|$ and explain why this does not determine $|H|$.
7. Prove that $G/N$ is abelian if and only if $N$ contains every commutator of $G$, for $N\trianglelefteq G$.
8. For $A=4\mathbb Z$ and $N=6\mathbb Z$ inside the additive integers, calculate $A+N$, $A\cap N$, and both groups in the second isomorphism theorem.

## 16. The compression principle

Homomorphisms preserve calculations while possibly identifying inputs. Their kernels tell us exactly which inputs become indistinguishable, and those kernels are normal. Conversely, normality makes coset multiplication well-defined. The first isomorphism theorem unifies these facts through an explicit bijective homomorphism.

We now have a language for structural equivalence and controlled compression. In the next chapter, the group of invertible residue classes will convert divisibility into multiplicative structure. Orders and quotients will help explain Fermat's theorem, Euler's theorem, modular exponentiation, and the correctness of a small RSA example.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](07-cyclic-groups-and-lagrange.md) · [Next chapter](09-units-orders-and-rsa.md) · [Hints and solutions](../solutions/08-solutions.md)
