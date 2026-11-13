# Chapter 27 — Computing Galois groups and solvability by radicals

The quadratic formula expresses every quadratic root using field operations and a square root. Cubic and quartic formulas also exist, although their expressions are less friendly. Why does this pattern stop at degree five? The obstacle is not that mathematicians have failed to find a sufficiently clever rearrangement. For some polynomials, the permitted operations cannot produce their roots at all.

This chapter explains that obstruction through symmetry. We will calculate several Galois groups, define solvable groups, and connect successive radical extractions with successive abelian layers of symmetry. The result is a precise statement about a specified class of expressions, not a claim that quintic roots cannot be approximated or defined in any other way.

The prerequisites are permutation groups, normal subgroups, field extensions and the Galois correspondence. We recall the necessary definitions as they enter. Two substantial general theorems are explicitly identified as imported results: the reduction-cycle theorem and the full radical-solvability equivalence. Their mechanisms are explained, but the surrounding examples do not pretend that a sketch supplies their complete proofs. The concrete group calculations and the nonsolvability of $A_5$ are proved here.

## 27.1 What a Galois group calculation asks

Let $f\in\mathbb Q[X]$ have distinct roots $\alpha_1,\ldots,\alpha_n$ in a splitting field $L$. Every automorphism of $L$ fixing $\mathbb Q$ permutes these roots, because applying it to $f(\alpha_j)=0$ gives $f(\sigma(\alpha_j))=0$. Since the roots generate $L$, an automorphism fixing all of them is the identity. Thus the Galois group embeds faithfully in $S_n$.

The calculation is to identify which permutations actually preserve all rational algebraic relations among the roots. We do not begin by assuming every permutation is allowed. For $X^4-2$, the roots lie at the corners of a square, and a relation such as $\alpha_3=-\alpha_1$ must remain true after applying an automorphism. Those relations exclude most elements of $S_4$.

A powerful first observation is that an irreducible polynomial has a transitive Galois action on its roots. Any root can be sent to any other root by an embedding of its simple extension, and separability permits extending that embedding to the splitting field. Conversely, if the polynomial is reducible, the roots of each irreducible factor form an invariant subset. Transitivity therefore detects irreducibility when the polynomial is separable.

If $f$ is irreducible of degree $n$, orbit-stabilizer implies $n\mid |G|$. It does not imply $|G|=n$, or $G=S_n$. For degree four, cyclic, dihedral and symmetric groups can all act transitively. A successful calculation accumulates enough independent restrictions to eliminate alternatives.

The [Galois companion lab](../companion/index.html) makes selected small examples visible. It is a place to inspect the relation between a group and its subgroup arrangement, not a universal algorithm that reads any polynomial and returns a certified group. The arguments here remain necessary even when a numerical program supplies approximate roots.

## 27.2 Quadratics and their one possible swap

Take $f=X^2-d$ with $d\in\mathbb Q$ not a rational square. Its roots are $\sqrt d$ and $-\sqrt d$, and its splitting field is $\mathbb Q(\sqrt d)$. There are exactly two automorphisms: the identity and the map changing the sign of $\sqrt d$. Thus the Galois group is $C_2$.

For a general quadratic $aX^2+bX+c$, completing the square gives

$$
(2aX+b)^2=b^2-4ac.
$$

The discriminant $D=b^2-4ac$ determines the splitting field $\mathbb Q(\sqrt D)$ when $D$ is not a square. If $D$ is a square, both roots are rational and the Galois group is trivial. If $D=0$, there is a repeated root, and one should first discard the multiplicity when describing the splitting field.

Observe the relation between the group and the operation. A square root introduces a possible sign ambiguity, represented by a group with two elements. Taking a square root does not produce arbitrary symmetry; it creates one very controlled layer. The same idea persists for higher radicals once the necessary roots of unity are present.

A common misconception is that a polynomial's degree equals its splitting-field degree. For this irreducible quadratic, that happens. It fails for $X^3-2$, whose splitting field has degree six. The root field may contain one root without containing the others. The splitting field is built to contain all roots, so its automorphisms can record their full system of relations.

## 27.3 A cubic with Galois group $S_3$

Let $a=\sqrt[3]2$ be the positive real cube root and let $\omega$ be a primitive cube root of unity. The roots of $X^3-2$ are $a,\omega a,\omega^2a$, so its splitting field is $L=\mathbb Q(a,\omega)$.

Eisenstein at two proves $X^3-2$ irreducible over $\mathbb Q$, so $[\mathbb Q(a):\mathbb Q]=3$. This root field is real. The nonreal number $\omega$ is not in it, and it satisfies $X^2+X+1=0$. Hence adjoining $\omega$ gives degree two. The tower law gives $[L:\mathbb Q]=6$.

Since $L$ is a splitting field in characteristic zero, its Galois group has six elements. As it embeds in the six-element group $S_3$, it must be all of $S_3$. This is already a complete calculation, requiring neither a general cubic formula nor a table of all transitive groups.

One can see generators concretely. A map $r$ sends $a$ to $\omega a$ and fixes $\omega$; it cycles the three roots. Complex conjugation $s$ fixes $a$ and interchanges $\omega$ and $\omega^2$; it swaps the two nonreal roots. They satisfy $r^3=s^2=1$ and $srs=r^{-1}$. Therefore $rs\ne sr$, so this is a nonabelian Galois group even though the polynomial is solvable by radicals.

This last fact prevents an overly restrictive guess. Radical solvability does not require the entire Galois group to be abelian. It requires the group to be assembled from abelian pieces through a suitable normal series. The distinction is exactly the difference between one radical step and several successive steps.

## 27.4 The discriminant as a parity detector

For a monic separable polynomial with roots $\alpha_1,\ldots,\alpha_n$, define

$$
\Delta=\prod_{i<j}(\alpha_i-\alpha_j),\qquad D=\Delta^2.
$$

The square $D$ is the discriminant. Although the unsquared product depends on an ordering of the roots, its square does not. Permuting two roots negates $\Delta$, and a general permutation multiplies it by its sign. The squared expression is symmetric in the roots and belongs to the base field; equivalently, every Galois automorphism fixes it.

Because the polynomial is separable, $\Delta\ne0$. A Galois automorphism fixes $\Delta$ exactly when its root permutation is even. Therefore

$$
G\subseteq A_n \quad\Longleftrightarrow\quad D\text{ is a square in the base field}.
$$

For the forward implication, every automorphism fixes $\Delta$, so the Galois fixed-field theorem gives $\Delta$ in the base field. For the reverse implication, suppose $D=c^2$ for a base-field element $c$. Since $\Delta^2=c^2$ and the characteristic is not two, $\Delta=c$ or $\Delta=-c$, so it too belongs to the base field. Hence every automorphism is even.

For an irreducible cubic over $\mathbb Q$, transitivity leaves only $A_3$ and $S_3$. Its Galois group is $A_3\cong C_3$ if its discriminant is a rational square, and $S_3$ otherwise. For $X^3+pX+q$, direct expansion gives

$$
D=-4p^3-27q^2.
$$

For $X^3-2$, this is $-108$, which is not a rational square. That independently confirms the $S_3$ result. For $X^3-3X+1$, the rational-root test shows irreducibility, and $D=108-27=81$. Thus its Galois group is cyclic of order three. Two irreducible cubics can therefore have genuinely different splitting fields and symmetry groups.

## 27.5 A quartic whose symmetry is a square

Take $a=\sqrt[4]2$. The splitting field of $X^4-2$ is $L=\mathbb Q(a,i)$, because its roots are $a,ia,-a,-ia$. Eisenstein gives $[\mathbb Q(a):\mathbb Q]=4$, and the field is real, so adjoining $i$ doubles the degree. Hence $[L:\mathbb Q]=8$.

Define $r$ by $r(a)=ia$ and $r(i)=i$. It is an automorphism fixing $\mathbb Q(i)$: the extension has degree four, and the four roots of $X^4-2$ lie in $L$. Define $s$ to be complex conjugation, so $s(a)=a$ and $s(i)=-i$. Then

$$
r^4=s^2=1,\qquad srs=r^{-1}.
$$

The eight maps $r^j$ and $sr^j$ are distinct. They form the dihedral group $D_8$, meaning the square symmetry group of order eight. A different convention sometimes writes this group as $D_4$; this book uses the order-eight notation to keep the convention explicit.

The field calculation explains the group picture. Multiplying $a$ by $i$ rotates among the four roots. Complex conjugation reflects the square. The relation $srs=r^{-1}$ says that reflecting changes clockwise rotation into counterclockwise rotation. The picture does not replace the degree proof, but it interprets the algebra once the automorphisms have been justified.

The chain $1\triangleleft\langle r^2\rangle\triangleleft\langle r\rangle\triangleleft D_8$ has cyclic quotients of orders two, two and two. This is a group-theoretic indication that the roots can be assembled using controlled radical steps. It also illustrates why a nonabelian group need not obstruct radical expressions: the important question concerns the quotient layers.

## 27.6 Derived groups and a definition of solvability

For elements $g,h$ of a group $G$, their commutator is

$$
[g,h]=ghg^{-1}h^{-1}.
$$

It measures the failure of $g$ and $h$ to commute: the commutator is the identity exactly when $gh=hg$. The derived subgroup $G'$ is the subgroup generated by all commutators. It is normal because conjugating a commutator gives a commutator of the conjugated elements.

The quotient $G/G'$ is abelian: in that quotient every commutator becomes the identity. More strongly, if $N\triangleleft G$ and $G/N$ is abelian, then every commutator lies in $N$, hence $G'\subseteq N$. Thus $G'$ is the smallest normal subgroup whose quotient is abelian. This universal property explains why it is the right tool.

Define $G^{(0)}=G$ and $G^{(j+1)}=(G^{(j)})'$. The group is solvable if $G^{(r)}=1$ for some finite $r$. Equivalently, it possesses a finite subnormal series with abelian successive quotients. “Subnormal” means each group in the chain is normal in the next one; it need not be normal in the entire original group.

For an abelian group, the first derived subgroup is trivial. For $S_3$, commutators are even, so $S_3'\subseteq A_3$. A nontrivial commutator of transpositions is a three-cycle, so $S_3'=A_3$. Since $A_3$ is cyclic, its derived subgroup is trivial. Thus $S_3$ is solvable with two nontrivial layers.

Solvability passes to subgroups and quotients. For a subgroup $H\le G$, every iterated commutator in $H$ is an iterated commutator in $G$, so $H^{(j)}\subseteq G^{(j)}$. For a surjective homomorphism, images of derived groups are derived groups of the image. These observations will matter when a radical field is larger than the polynomial's splitting field: we can pass between groups without losing solvability.

## 27.7 Why all quartic equations escape the obstruction

The group $S_4$ has a normal subgroup

$$
V=\{1,(12)(34),(13)(24),(14)(23)\}.
$$

Multiplication shows that $V\cong C_2\times C_2$. It is normal because conjugation preserves the cycle type “two disjoint transpositions.” The alternating group $A_4$ contains $V$, and the quotient $A_4/V$ has order three, hence is cyclic. Also $S_4/A_4\cong C_2$.

Therefore

$$
1\triangleleft V\triangleleft A_4\triangleleft S_4
$$

is a series with abelian quotient groups. It proves $S_4$ solvable. Every Galois group of a separable polynomial of degree at most four is a subgroup of an appropriate $S_n$, hence also a subgroup of $S_4$. Since subgroups of solvable groups are solvable, all these Galois groups are solvable.

This explains why degree four lies on one side of the boundary. The quartic formula is complicated, but there is no group-theoretic obstruction to its existence. The radical-solvability theorem below turns this structural observation into the existence of formulas.

One can also see a cubic problem inside a quartic by looking at the three partitions of four roots into two unordered pairs. Permutations of the roots permute those three partitions. The resulting homomorphism $S_4\to S_3$ has kernel $V$. This is why cubic resolvents enter classical quartic formulas: a quotient action reduces part of the problem to degree three. We are explaining the structural reason rather than displaying a large expression before its purpose is clear.

The same approach suggests a sensible computational strategy. Instead of solving for roots immediately, first look for simpler functions of the roots that form a smaller orbit. Their minimal polynomial may have lower degree. Once those quantities are known, the remaining ambiguity is governed by a kernel, which can be easier to handle.

## 27.8 Why $A_5$ is different

The alternating group $A_5$ has order $60$. Its nonidentity elements have cycle types: three-cycles, products of two disjoint transpositions, and five-cycles. There are twenty three-cycles, fifteen double transpositions, and twenty-four five-cycles. We will use conjugacy classes to show that $A_5$ is simple, meaning it has no nontrivial proper normal subgroup.

All twenty three-cycles form one conjugacy class in $A_5$. To see its size, the centralizer of $(123)$ in $S_5$ consists of powers of that cycle and an optional swap of four and five. Its order is six, and exactly the three powers are even. Thus its centralizer in $A_5$ has order three, giving class size $60/3=20$.

For $(12)(34)$, the centralizer in $S_5$ has order eight; its even elements form a subgroup of order four. Hence its $A_5$ class has size $60/4=15$. A five-cycle has centralizer consisting of its five powers, all even, so its $A_5$ class has size $60/5=12$. The twenty-four five-cycles therefore split into two classes of twelve.

A normal subgroup must be a union of whole conjugacy classes and must contain the identity. Its possible order is consequently one plus a sum of some of $20,15,12,12$. The resulting values are

$$
1,13,16,21,25,28,33,36,40,45,48,60.
$$

By Lagrange, a subgroup order must divide sixty. Of the listed values, only one and sixty divide sixty. Thus $A_5$ is simple.

It is not abelian: for example the cycles $(123)$ and $(345)$ do not commute, as is checked by following the image of three under the two compositions. Its derived subgroup is therefore nontrivial. The derived subgroup is normal, so simplicity forces $A_5'=A_5$. The derived series never reaches the identity. Hence $A_5$ is not solvable, and neither is $S_5$, because a subgroup of a solvable group would be solvable.

This is the decisive new phenomenon at degree five. A nonabelian simple layer cannot be broken into smaller abelian quotients. The obstruction is not merely the presence of noncommuting elements; $S_3$ had those too. It is the persistence of noncommutativity after every permitted attempt to pass to abelian quotient layers.

## 27.9 What “solvable by radicals” means

Let $F$ be a field of characteristic zero. A radical tower is a sequence

$$
F=F_0\subseteq F_1\subseteq\cdots\subseteq F_r,
\qquad F_j=F_{j-1}(u_j),\quad u_j^{m_j}\in F_{j-1},
$$

with positive integers $m_j$. A polynomial is solvable by radicals over $F$ if some such tower contains all its roots. The tower may contain extra elements, including complex numbers even when the original roots are real. Division by zero is never an allowed operation; the field language automatically respects that limitation.

**Radical-solvability theorem.** For a polynomial over a field of characteristic zero, its splitting-field Galois group is solvable if and only if the polynomial is solvable by radicals.

We use this general theorem as an imported result. A complete proof requires additional lemmas about cyclic extensions, roots of unity and embeddings of radical towers into normal extensions. The next two sections explain its architecture and prove the elementary mechanism behind one direction; they are a proof sketch of the general equivalence, not a replacement for all those lemmas. A further-reading reference is J. S. Milne, *Fields and Galois Theory*, version 5.10, Theorem 5.34 on printed page 77 (also stated as Theorem 3.28 on page 45), on the author's site: <https://www.jmilne.org/math/CourseNotes/FT.pdf>.

The characteristic-zero hypothesis is not decorative. In positive characteristic, inseparable extensions and equations such as $X^p-X-a$ require a different formulation. The correct theory is still rich, but applying the displayed theorem unchanged would be false. In our applications the base field is $\mathbb Q$ or a number field, so characteristic zero is assured.

The theorem does not say that a root is undefined if its polynomial is not solvable by radicals. It can still be specified as the unique real solution in a rational interval, approximated numerically, or represented using more general functions. It rules out one exact vocabulary of finite expressions.

## 27.10 The mechanism: radicals create abelian layers

Suppose a field $F$ already contains every $m$th root of unity and $u^m=a\in F$. All roots of $X^m-a$ are $\zeta u$ with $\zeta^m=1$, so $F(u)$ is a splitting field if $a\ne0$. In characteristic zero it is separable. Any automorphism sends $u$ to $\zeta u$ for some root of unity.

The map

$$
\sigma\longmapsto\frac{\sigma(u)}u
$$

is an injective homomorphism from the Galois group into the cyclic group of $m$th roots of unity. It is a homomorphism because the roots of unity already belong to the fixed base field: $\sigma(\tau(u)/u)=\tau(u)/u$. Without that assumption, the multiplication calculation would not work in this simple form. Thus the Galois group of this single radical step is cyclic, or a subgroup of a cyclic group.

If roots of unity are absent, first adjoining them creates an abelian cyclotomic extension, as Chapter 26 showed. This is why roots of unity occur in the theorem's proof even if an initial expression only mentions real radicals. They make all conjugates of a radical visible and convert the ambiguity into an abelian group.

The general necessity argument takes a radical tower, adds the required roots of unity, and also adds the conjugates needed to make suitable normal extensions. Each controlled layer has abelian symmetry. Finite extensions of solvable groups are solvable: if $N\triangleleft G$, $N$ is solvable and $G/N$ is solvable, then some derived group of $G$ lies in $N$, and further derived steps reach one. Passing to the relevant splitting-field group preserves solvability through a quotient or subgroup description.

The converse uses the Galois correspondence to reverse a solvable normal series into field extensions. After arranging enough roots of unity, cyclic prime-degree extensions can be generated by suitable radicals. That last statement is the substantial cyclic-extension lemma, often developed through eigenvectors for an automorphism or Lagrange resolvents. The outline identifies the bridge, but a full proof of that lemma belongs to the extended field-theory treatment in the cited reference.

## 27.11 Modular factorization reads cycle types

There is another useful imported result, stated in a form adequate for computation.

**Reduction-cycle theorem.** Let $f\in\mathbb Z[X]$ be monic and separable over $\mathbb Q$. Let $p$ be a prime such that its reduction modulo $p$ has no repeated factor. If the irreducible factor degrees modulo $p$ are $d_1,\ldots,d_r$, its Galois group over $\mathbb Q$, acting on the complex roots, contains a permutation with disjoint cycle lengths $d_1,\ldots,d_r$.

This result is Theorem 4.28 on printed page 55 of Milne's cited notes. The theorem does not assert that the whole Galois group is the Galois group of the reduced polynomial. It asserts the existence of one cycle type in the characteristic-zero group. Different primes may reveal different elements of that same group. Repeated factors are excluded because good reduction is needed to distinguish the roots.

Here is the mechanism, without claiming a complete proof. Over a finite field, Frobenius $x\mapsto x^p$ cycles the roots of each irreducible factor, and its orbit length is the factor degree. Algebraic number theory permits lifting that permutation information from a prime of the splitting field lying above $p$. Establishing that lifting carefully is the missing theorem-level work. The elementary finite-field part is already familiar from Chapter 24.

For example, a factorization into an irreducible quadratic and an irreducible cubic indicates an element of cycle type $(ab)(cde)$. Cubing this element kills the three-cycle while preserving the transposition, so the group contains a transposition. This additional group calculation is elementary and must be done explicitly; saying that a quadratic factor automatically gives a transposition would be wrong if the other cycle lengths behaved differently.

A reducible factorization modulo one prime does not prove reducibility over $\mathbb Q$. The irreducibility test goes in the other direction: irreducibility modulo a prime, with degree preserved, implies irreducibility over $\mathbb Q$. These distinct implications are easy to confuse. The reduction-cycle theorem supplies information precisely when a factorization is reducible but still arithmetically informative.

## 27.12 A concrete quintic with group $S_5$

Consider

$$
f(X)=X^5-X-1.
$$

Modulo two it factors as

$$
(X^2+X+1)(X^3+X^2+1).
$$

Multiplication verifies the identity. The quadratic has no root in $\mathbb F_2$, so it is irreducible. The cubic also has no root in $\mathbb F_2$, hence is irreducible. The factors are distinct. By the reduction-cycle theorem, the characteristic-zero group contains an element of type $(ab)(cde)$ and therefore a transposition.

Modulo three the polynomial is irreducible. Here is a short certificate rather than an unsupported software claim. It has no linear factor because its values at $0,1,2$ are all nonzero modulo three. The only monic irreducible quadratics over $\mathbb F_3$ are $X^2+1$, $X^2+X+2$, and $X^2+2X+2$. Division of $f$ by these gives remainders $-1$, $X-1$, and $X-1$, respectively. None divides $f$.

Any reducible degree-five polynomial over a field has a factor of degree at most two: in a factorization into irreducibles, if every factor had degree at least three, two factors would already have total degree at least six. Thus the preceding tests prove irreducibility modulo three. They prove irreducibility over $\mathbb Q$ and, through the cycle theorem, exhibit a five-cycle in its Galois group.

A five-cycle and a transposition inside a group need not be the particular standard generators you remember. Nevertheless they generate $S_5$ in this situation. Label the five positions cyclically by $\mathbb Z/5\mathbb Z$, using the five-cycle as translation. If the transposition joins positions $a$ and $b$, its conjugates by powers of the cycle join $a+j$ to $b+j$ for all $j$.

These edges form a connected graph: their step size $b-a$ is nonzero modulo the prime five, so repeatedly adding it visits every vertex. Transpositions along the edges of a connected graph generate the full symmetric group. One way to prove the latter assertion is to follow a path and use conjugation to obtain a transposition between its initial vertex and each later vertex. Those transpositions generate all swaps. Therefore the subgroup already equals $S_5$.

The Galois group is consequently $S_5$, which is not solvable. By the radical-solvability theorem, $X^5-X-1$ is not solvable by radicals over $\mathbb Q$. The example depends on the two explicitly identified general theorems, while its modular arithmetic and group-generation steps have been proved in full.

## 27.13 Boundaries, workflow and interpretation

The statement “there is no quintic formula” needs care. There is no formula using only finitely many field operations and radical extractions that solves every quintic over $\mathbb Q$. Many particular quintics are solvable by radicals: $X^5-2$ already displays its roots using a fifth root and fifth roots of unity. Other quintics factor into lower-degree pieces. Degree alone does not determine a particular Galois group.

For a new polynomial, a reliable workflow begins with the base field and squarefree part. Factor over that field if possible. Establish irreducibility of the factors, identify the splitting field in easy cases, and use degree bounds, discriminants and explicit automorphisms. Modular factorization can then supply cycle types, provided the reduction is squarefree and the theorem's hypotheses hold. Finish with an actual group argument rather than assuming that a few plausible permutations determine the answer.

Several errors have small diagnostic counterexamples. A nonsquare discriminant only shows that the group is not contained in $A_n$; it does not by itself prove the group is $S_n$. The quartic $X^4-2$ has group $D_8$, a proper subgroup of $S_4$. An irreducible polynomial has a transitive group, but transitive groups may be much smaller than $S_n$. A radical root field need not be normal: $\mathbb Q(\sqrt[3]2)$ is a basic example. These distinctions are not technical decoration; each prevents an invalid inference.

Finally, a numerical root finder and a Galois computation answer different questions. Numerical approximations may converge rapidly even when radical expressions do not exist. Conversely a known radical expression may be numerically unstable if evaluated carelessly. The algebraic theorem classifies exact operations. It neither rates the usefulness of an equation nor limits all methods of approximation.

The conceptual chain is now visible. Roots produce permutation actions. Normal subgroups produce intermediate quotient layers. Radicals produce abelian layers after roots of unity are included. The persistence of a nonabelian simple group blocks that decomposition. A question that began as “find a formula” has become a structural question about which symmetries can be dismantled by the allowed operations.

## 27.14 Deriving a cubic radical step instead of memorizing it

A general cubic can be reduced to a depressed cubic $X^3+pX+q$ by translating the variable. For a monic cubic $X^3+bX^2+cX+d$, put $X=Y-b/3$. Expanding shows that the coefficient of $Y^2$ vanishes. Division by three is allowed over $\mathbb Q$ and, more generally, in characteristic zero. The translation changes the presentation of the roots but not whether they can be produced by radicals.

For the depressed cubic, try $X=u+v$. Expanding gives

$$
(u+v)^3+p(u+v)+q
=u^3+v^3+(3uv+p)(u+v)+q.
$$

The mixed term disappears if $uv=-p/3$. We then need $u^3+v^3=-q$, while $u^3v^3=-p^3/27$. Thus $u^3$ and $v^3$ should be the two roots of

$$
T^2+qT-\frac{p^3}{27}=0.
$$

Completing the square gives

$$
u^3=-\frac q2+\sqrt{\frac{q^2}{4}+\frac{p^3}{27}},\qquad
v^3=-\frac q2-\sqrt{\frac{q^2}{4}+\frac{p^3}{27}}.
$$

Choose the cube roots compatibly so that $uv=-p/3$. Arbitrarily choosing two complex cube roots independently can break this requirement. If $p\ne0$, one can select a nonzero $u$ first and define $v=-p/(3u)$; the displayed product identity then guarantees the correct cube for $v$. If $p=0$, the original equation is already $X^3=-q$, so it should be handled directly instead of dividing by $u$ unnecessarily.

The three roots are $u+v$, $\omega u+\omega^{-1}v$, and $\omega^2u+\omega^{-2}v$. The inverse powers are essential: multiplying $u$ and $v$ by opposite powers of $\omega$ preserves their product. This elementary derivation displays the operations that the solvability theorem promises, and it exposes the branch-choice issue often hidden by a compressed formula.

For $X^3-2$, take $p=0$ and $q=-2$. The direct route gives $u=\sqrt[3]2$, $v=0$, and multiplication by powers of $\omega$ supplies all roots. For $X^3-3X+1$, the quantity inside the square root is $1/4-1=-3/4$. Complex intermediate radicals therefore arise even though all three roots are real. Real output does not force every intermediate field to be real. A restriction to real radicals would be a different notion from the radical towers used in the theorem.

The discriminant relation is also visible: $D=-108(q^2/4+p^3/27)$. The square root appearing in the cubic calculation is therefore directly related to the discriminant's parity-detecting square root. Algebraic formulas and group invariants are not parallel stories; the formula is responding to the same root symmetries that the discriminant records.

## 27.15 A proof about extensions of solvable groups

The sketch of the radical theorem used a basic group lemma worth proving fully. Suppose $N\triangleleft G$, and assume both $N$ and $G/N$ are solvable. Let $\pi:G\to G/N$ be the quotient map. Commutators commute with homomorphisms in the sense that

$$
\pi([g,h])=[\pi(g),\pi(h)].
$$

Taking generated subgroups gives $\pi(G')=(G/N)'$, and repeating gives $\pi(G^{(j)})=(G/N)^{(j)}$. If the quotient's derived series reaches one after $r$ steps, then $G^{(r)}\subseteq\ker\pi=N$. If $N^{(s)}=1$, another $s$ derived steps inside $N$ force $G^{(r+s)}=1$. Thus $G$ is solvable.

This lemma explains how several controlled ambiguity layers can combine without creating an unsolvable obstruction. It does not claim that the entire group is a direct product of those layers. The group $S_3$ is a counterexample to that stronger statement: it has a normal cyclic subgroup of order three and cyclic quotient of order two, but it is not the abelian direct product $C_3\times C_2$. An extension can twist the interaction between layers while still remaining solvable.

There is a useful equivalent formulation for finite groups. A finite abelian quotient can be refined into cyclic prime-order quotients using its finite abelian decomposition. Therefore a finite solvable group admits a subnormal series with cyclic prime-order factors. Conversely such a series plainly has abelian quotients. This is the kind of series that the field-theoretic proof reverses into manageable extension steps. The refinement is a structural convenience, not a statement that the original group is cyclic.

The word normal must continue to be checked at every step. An arbitrary chain of subgroups with prime indices does not automatically give the needed quotient groups, because a quotient is a group only when the smaller subgroup is normal in the larger. In the $S_3$ example, $A_3$ is normal in $S_3$ because it is the kernel of the sign map. A subgroup generated by a transposition is not normal in $S_3$, even though it has prime order. Orders alone do not supply quotient structure.

These elementary lemmas are the exact group-theoretic work behind the radical story. They show what a complete proof would need from the field side and what has already been established on the group side. Keeping that boundary visible makes an imported theorem useful without turning it into an unexplained slogan.

## 27.16 Why separability stayed in the background

Every irreducible polynomial over a characteristic-zero field is separable. The short proof is useful here. If an irreducible polynomial $g$ had a repeated root, then $g$ and its formal derivative $g'$ would have a nonconstant common divisor. Irreducibility would force $g\mid g'$. But $g'$ has smaller degree, so this is impossible unless $g'=0$. In characteristic zero a nonconstant polynomial cannot have zero derivative, because differentiating its highest nonconstant term multiplies a nonzero coefficient by a nonzero integer.

Consequently, after repeated factors are removed, every polynomial over $\mathbb Q$ has distinct roots in its splitting field. That is why we could use root permutations, discriminants and the finite Galois correspondence without repeatedly stopping to handle inseparability. It is a proved convenience of the base field, not a universal property of all polynomials.

For comparison, in characteristic $p$, the derivative of $X^p-a$ is zero. Depending on the field and on $a$, that polynomial can be irreducible while having only one distinct root in an algebraic closure. Its degree no longer counts distinct embeddings in the same way. This small example explains both why the radical theorem was stated in characteristic zero and why an unrestricted transfer of the preceding arguments to finite characteristic would be invalid.

## 27.17 Optional practice

1. Compute the splitting field and Galois group of $X^2-7$ and of $X^2-9$ over $\mathbb Q$.
2. Prove that $X^3-3X+1$ has cyclic Galois group of order three over $\mathbb Q$.
3. Verify the relations $r^4=s^2=1$ and $srs=r^{-1}$ for the automorphisms of $X^4-2$ described above.
4. Prove that the derived subgroup of $S_3$ is $A_3$, using a concrete commutator.
5. Explain why a nonsquare discriminant does not establish a full symmetric Galois group, giving a concrete example.
6. Verify the modular factorization of $X^5-X-1$ modulo two and all three quadratic remainders modulo three.
7. Prove that the transpositions associated with the edges of a connected finite graph generate the full symmetric group on its vertices.
8. Explain why $X^5-2$ is solvable by radicals, and identify the unjustified inference in the claim that every quintic is therefore solvable by radicals.

[Hints and reference solutions](../solutions/27-solutions.md) include the intermediate calculations. In Chapter 28 we shift from the exact symmetries of roots to the growth and distribution of primes, rebuilding the analysis needed to make infinite sums and products meaningful.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](26-cyclotomic-fields.md) · [Next chapter](28-analysis-and-primes.md) · [Hints and solutions](../solutions/27-solutions.md)
