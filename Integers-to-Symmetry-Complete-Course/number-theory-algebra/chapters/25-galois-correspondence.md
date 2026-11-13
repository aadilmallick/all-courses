# Chapter 25 — Field automorphisms and the Galois correspondence

In $\mathbb Q(\sqrt2)$, we can replace $\sqrt2$ by $-\sqrt2$ while leaving every rational number fixed. All sums and products remain valid. In $\mathbb Q(\sqrt2,\sqrt3)$, the two square-root signs can be changed independently, producing four symmetries. The intermediate fields are not arbitrary: the numbers unchanged by each chosen collection of symmetries form a field.

Galois theory makes this observation systematic. For a suitable finite extension, the intermediate fields correspond exactly to subgroups of its automorphism group. Group theory then answers field-theoretic questions, including which extensions are normal and which polynomials admit formulas using radicals. This chapter proves the finite correspondence and carefully identifies the hypotheses that make it work.

We assume field extensions, minimal polynomials, splitting fields, groups and their quotients, and finite-dimensional vector spaces. The linear-algebra arguments needed for the key fixed-field theorem are explained as they occur. No primitive-element theorem is required for our proof.

## 1. Symmetries must preserve algebraic relations

An $F$-automorphism of an extension $E/F$ is a bijective field homomorphism $\sigma:E\to E$ that fixes every element of $F$. Their group under composition is denoted $\operatorname{Aut}_F(E)$. Composition is performed right to left. The identity fixes everything, and the inverse of an $F$-automorphism also fixes $F$.

If $\alpha$ has minimal polynomial $m\in F[X]$, then any $F$-automorphism satisfies

$$
0=\sigma(m(\alpha))=m(\sigma(\alpha)).
$$

Thus its image must be another root of the same polynomial. Not every independent choice of images for several generators preserves all their relations. One must check the whole field map, either through a quotient construction or by extending an existing embedding one generator at a time.

For a simple extension $F(\alpha)$, a root $\beta$ of the minimal polynomial in another field determines an $F$-embedding by $g(\alpha)\mapsto g(\beta)$. It is well-defined because the polynomials vanishing at $\alpha$ are exactly the multiples of the minimal polynomial. A field homomorphism preserving one is injective, so the image is a copy of the source field. An embedding need not have image equal to the whole target.

In $\mathbb Q(\sqrt2)$, the two possible images of $\sqrt2$ are $\sqrt2$ and $-\sqrt2$, and both yield automorphisms. In the real field $\mathbb Q(\sqrt[3]2)$, the other two roots of $X^3-2$ are nonreal and do not belong to the field. Its only $\mathbb Q$-automorphism is the identity, despite its degree being three. This example explains why an arbitrary extension may have too few internal symmetries for a field-subgroup correspondence.

## 2. Separable and normal: the two missing ingredients

An algebraic element is separable over $F$ if its minimal polynomial has distinct roots in a splitting field. An algebraic extension is separable if every element is separable. In characteristic zero, an irreducible polynomial is coprime to its derivative because the derivative is nonzero and has smaller degree. Thus every algebraic extension in characteristic zero is separable. Chapter 24 also proved that every finite field is perfect, so its irreducible polynomials are separable.

Repeated roots can occur in positive characteristic. Over $F=\mathbb F_p(t)$, the polynomial $X^p-t$ is irreducible by Eisenstein at $t$ and Gauss's lemma. If $u$ is one root, then $X^p-t=(X-u)^p$ in $F(u)[X]$. There is only one distinct root. An automorphism fixing $F$ must therefore fix $u$, so the extension has degree $p$ but only the identity automorphism. Separability rules out this source of missing symmetries.

An algebraic extension $E/F$ is normal if every irreducible polynomial over $F$ with one root in $E$ splits completely into linear factors in $E$. Repeated factors are allowed in this definition. Normality says that whenever a conjugate appears, all its companions appear too. The real cube-root field is not normal because it contains one root of $X^3-2$ and not the other two.

For finite extensions, normality is equivalent to being a splitting field of finitely many polynomials over $F$. One direction is immediate after choosing finitely many generators: their minimal polynomials all split in a normal extension, and their roots generate no field larger than $E$. Since the generators themselves are roots, those roots generate all of $E$.

For the converse we use a small extension lemma. An embedding of an intermediate field extends across an algebraic adjunction by sending the new generator to a root of the polynomial obtained by transporting its minimal polynomial's coefficients. A sufficiently large splitting field contains such a root. Repeating over finitely many generators extends the embedding of the intermediate field to the whole finite extension.

If $E$ is a splitting field over $F$, any $F$-embedding into a field containing all the needed roots carries every generating root to another root of the same defining polynomial, already in $E$. Thus its image is contained in $E$. It has the same finite $F$-dimension as $E$, so its image equals $E$. Now take any root $\alpha\in E$ of an irreducible polynomial and any other root $\beta$ in a common splitting field. The map $F(\alpha)\to F(\beta)$ sending $\alpha$ to $\beta$ extends to an embedding of $E$ into that common splitting field. Its image lies in $E$, so $\beta\in E$. This proves normality.

A finite extension is Galois if it is both normal and separable. We write its automorphism group as $\operatorname{Gal}(E/F)$. Being a splitting field alone ensures normality, not separability; the polynomial $X^p-t$ illustrates the distinction. Over characteristic zero or a finite base field, separability is automatic, so a finite splitting field is Galois.

## 3. Counting embeddings one generator at a time

Let $E/F$ be finite. Choose generators $\alpha_1,\ldots,\alpha_r$ and the tower $F=E_0\subseteq E_1\subseteq\cdots\subseteq E_r=E$, where $E_i=E_{i-1}(\alpha_i)$. Such a finite list exists: an $F$-basis is already a finite generating list, even if it is not an efficient one.

Suppose an embedding of $E_{i-1}$ has been fixed. The image of $\alpha_i$ must be a root of its transported minimal polynomial, whose degree is $[E_i:E_{i-1}]$. Hence at most that many extensions of the embedding exist. Multiplying over the tower and using the tower law gives at most $[E:F]$ embeddings into any field.

If $E/F$ is separable and the target contains the roots of the minimal polynomials over $F$ of all chosen generators, every stage has exactly the expected number of choices. The stage polynomial divides the original polynomial of the generator after extending coefficients. Its transported version also divides that original polynomial, which splits in the target. Its roots remain distinct because the original polynomial was separable. Each root yields exactly one extended embedding by the simple-extension construction.

Therefore a finite separable extension has exactly $[E:F]$ embeddings into a sufficiently large splitting field. If the extension is also normal, all these embeddings have image $E$, as proved above. We obtain

$$
|\operatorname{Gal}(E/F)|=[E:F].
$$

This theorem counts internal symmetries only under both hypotheses. For the cube-root field, normality fails; for the $p$th-root rational-function extension, separability fails. In each case the count drops below the degree for a different reason.

If $F\subseteq K\subseteq E$ and $E/F$ is Galois, then $E/K$ is also Galois. The same polynomials over $F$, now viewed over $K$, still split in $E$ and generate it over $K$, giving normality. Each minimal polynomial over $K$ divides a separable polynomial over $F$, giving separability. It does not follow that $K/F$ is Galois; that is the normal-subgroup issue we will resolve.

## 4. The extension-of-embeddings lemma in slow motion

Because the same lemma supports several later deductions, let us inspect its construction rather than treating the word “extend” as automatic. Suppose $K\subseteq E$ is an intermediate field, $\rho:K\to L$ is an embedding, and $a\in E$ is algebraic over $K$. Let $m(X)=\sum c_iX^i$ be its monic minimal polynomial. Transport the coefficients to obtain $m^\rho(X)=\sum\rho(c_i)X^i$ over $\rho(K)$.

The transported polynomial is irreducible. A factorization over $\rho(K)$ could be transported back with the inverse isomorphism $\rho(K)\to K$, producing a factorization of $m$. Choose a root $b$ of $m^\rho$ in a field containing its splitting field. Define the new map by

$$
\sum_i c_i a^i\longmapsto\sum_i\rho(c_i)b^i.
$$

Every element of $K(a)$ is such a polynomial expression because $a$ is algebraic. If two expressions represent the same element, their difference is divisible by $m$. After transport their difference is divisible by $m^\rho$, so it vanishes at $b$. This proves well-definedness. Addition and multiplication are respected by evaluation, and one maps to one. The resulting field map is therefore injective and extends the original $\rho$.

There is exactly one extension for each possible root $b$ of the transported minimal polynomial. Existence was the construction, and uniqueness follows because the map is already prescribed on $K$ and $a$, which generate the whole field. If the polynomial has repeated roots, distinct roots rather than degree count the choices. This is precisely where separability enters the embedding-count theorem.

For a finite extension $E/F$, one can choose finitely many generators $a_i$ and work in a common splitting field of their minimal polynomials over $F$, together with any extra polynomial needed for an initial embedding. At a stage of the extension process, the minimal polynomial of $a_i$ over the current intermediate field divides its original polynomial over $F$. If the embedding fixes $F$, transport preserves that original polynomial. Therefore the transported factor splits in the chosen common splitting field, and a root is available for the next step.

This argument explains why no algebraic-closure theorem is secretly required in our finite proof. A finite collection of polynomials has a splitting field by the repeated quotient construction from Chapter 24. That field is enough to perform every adjunction in the finite generator list. We do not need one ambient field containing roots of every possible polynomial at once.

The lemma also does not say that an embedding of an intermediate field automatically extends to an automorphism of $E$ itself. Initially it extends into a sufficiently large field. Normality is the additional condition that forces the resulting image to lie back inside $E$. Finite dimension then promotes containment of the image to equality. These are three distinct steps: construct an embedding, use normality to locate its image, and use dimension to obtain an automorphism.

For a concrete illustration, the map $\mathbb Q(r)\to\mathbb Q(\zeta r)$ sending the real cube root $r$ to $\zeta r$ is a legitimate embedding because both elements have minimal polynomial $X^3-2$. It is not an automorphism of the real cubic field: its image contains a nonreal number. It does extend to an automorphism of the full splitting field $\mathbb Q(r,\zeta)$, where all three roots are present. This separates the roles of the small field and its normal closure.

## 5. Fixed elements form a field

For a subgroup $H\leq\operatorname{Aut}_F(E)$, define its fixed field by

$$
E^H=\{x\in E:\sigma(x)=x\text{ for every }\sigma\in H\}.
$$

If $x$ and $y$ are fixed, so are their sum, difference, and product, because every automorphism respects those operations. If $x\ne0$ is fixed, its inverse is fixed because $\sigma(x^{-1})=\sigma(x)^{-1}=x^{-1}$. Zero and one are fixed, and every element of $F$ is fixed. Thus $F\subseteq E^H\subseteq E$ is an intermediate field.

Larger subgroups impose more fixing conditions and therefore have smaller fixed fields. If $H_1\subseteq H_2$, then $E^{H_2}\subseteq E^{H_1}$. Conversely, a larger intermediate field has a smaller subgroup of automorphisms fixing it. This reversal is not a notational accident. Knowing more fixed coefficients gives a symmetry less freedom to move the remaining elements.

The hard question is whether these two constructions undo one another. Could extra elements be fixed accidentally? Could the fixed field admit more automorphisms than the subgroup we began with? The following theorem supplies the exact degree count needed to exclude both possibilities.

## 6. Independence of distinct field embeddings

We first prove that distinct field homomorphisms $\sigma_1,\ldots,\sigma_r:E\to E$ are linearly independent as functions over $E$. This means that an identity

$$
c_1\sigma_1(x)+\cdots+c_r\sigma_r(x)=0\quad\text{for every }x\in E
$$

forces all coefficients $c_i\in E$ to be zero. This is a statement about functions, not a claim that their values at one chosen $x$ are independent.

Suppose a nontrivial relation exists, and choose one with as few nonzero terms as possible. Delete zero terms. A one-term relation is impossible by evaluating at one, so there are at least two terms. Since $\sigma_1$ and $\sigma_r$ differ, choose $a$ with $\sigma_1(a)\ne\sigma_r(a)$.

Evaluate the relation at $ax$ and subtract $\sigma_r(a)$ times the relation at $x$. Multiplicativity gives

$$
\sum_{i=1}^{r-1}c_i\bigl(\sigma_i(a)-\sigma_r(a)\bigr)\sigma_i(x)=0
$$

for every $x$. The last term has vanished, while the first coefficient is nonzero. This is a nontrivial relation with fewer terms, contradicting minimality. Hence the homomorphisms are independent.

If $K$ is fixed by all these maps and $[E:K]=d$ is finite, there can be at most $d$ distinct maps. Choose a $K$-basis $b_1,\ldots,b_d$. Each map supplies a row vector $(\sigma_i(b_1),\ldots,\sigma_i(b_d))\in E^d$. More than $d$ such rows would be dependent over $E$. A dependence on basis values extends to every element of $E$ by $K$-linearity, contradicting the functional independence just proved.

This gives another proof of the upper bound on automorphism counts. More importantly, it will supply one half of the fixed-field degree theorem without needing to express the whole extension as a single simple adjunction.

## 7. Artin's fixed-field theorem, with the degree argument

Let $H$ be a finite group of automorphisms of any field $E$, and put $K=E^H$. We prove

$$
[E:K]=|H|.
$$

The statement itself implies that this extension is finite; finiteness of $E/K$ is not an extra assumption. Write $n=|H|$. The main task is to prove that no $n+1$ elements can be independent over $K$.

Suppose instead that $a_1,\ldots,a_{n+1}$ are $K$-independent. Consider the $n$ homogeneous linear equations over $E$

$$
\sum_{j=1}^{n+1}\sigma(a_j)c_j=0\qquad(\sigma\in H).
$$

There are more unknowns than equations. To justify a nonzero solution, view the $n+1$ columns as vectors in $E^n$; they are dependent because the space has dimension $n$. Their dependence coefficients supply a solution $c=(c_1,\ldots,c_{n+1})\ne0$.

Among all nonzero solutions choose one with the fewest nonzero coordinates, and reorder the $a_j$ if necessary so $c_1\ne0$. Divide every coefficient by $c_1$ to normalize $c_1=1$. This operation stays within the solution space because the equations are homogeneous.

For $\tau\in H$, apply $\tau$ to every equation. The compositions $\tau\sigma$ run through $H$, so the coefficient vector $(\tau(c_1),\ldots,\tau(c_{n+1}))$ is another solution of the same system. Subtract the original solution. Its first coordinate is zero because $\tau(1)=1$. Every coordinate that was originally zero remains zero, so a nonzero difference would have strictly fewer nonzero coordinates, contradicting the chosen minimality.

Therefore $\tau(c_j)=c_j$ for every $\tau\in H$ and every $j$. All coefficients belong to $K$. The equation corresponding to the identity automorphism is now a nontrivial $K$-linear relation among the $a_j$, contradicting their assumed independence. We conclude $[E:K]\leq n$.

The degree is now finite. The independence-of-maps argument in the preceding section shows that the $n$ distinct automorphisms in $H$ require $n\leq[E:K]$. Combining the inequalities proves equality. This is Artin's theorem in the exact form needed here.

The minimal-support choice was the decisive device. It forced the coefficients of a linear relation initially found in the large field to descend into the fixed field. Counting equations alone would only provide coefficients in $E$, which would not contradict independence over $K$. The descent step is what turns ordinary linear algebra into a field-theoretic theorem.

## 8. The finite Galois correspondence

Let $E/F$ be finite Galois and let $G=\operatorname{Gal}(E/F)$. Associate to an intermediate field $K$ the subgroup

$$
G_K=\operatorname{Gal}(E/K)=\{\sigma\in G:\sigma(k)=k\text{ for every }k\in K\}.
$$

Associate to a subgroup $H\leq G$ its fixed field $E^H$. Then these operations are inverse bijections, and they reverse containment. Moreover,

$$
[E:E^H]=|H|,\qquad [E^H:F]=[G:H].
$$

Here $[G:H]=|G|/|H|$ is the subgroup index, the number of cosets. The degree formula uses the tower law together with $[E:F]=|G|$.

We prove that the maps are inverse. Begin with $H$ and put $K=E^H$. Certainly $H\subseteq G_K$. Artin's theorem gives $[E:K]=|H|$. But the automorphism upper bound gives $|G_K|\leq[E:K]$. Thus the containment is between finite groups of equal size, so $G_K=H$.

Now begin with $K$ and put $H=G_K$. We know $K\subseteq E^H$. Since $E/K$ is Galois, its automorphism count gives $|H|=[E:K]$. Artin gives $[E:E^H]=|H|$. The tower law for $K\subseteq E^H\subseteq E$ then forces $[E^H:K]=1$, so $E^H=K$.

This proves the full finite correspondence rather than only a map in one direction. The proof also shows that $E^G=F$, and that the fixed field of the trivial subgroup is $E$. The extreme cases are useful checks when drawing a field lattice: the entire group belongs at the bottom field, while the smallest subgroup belongs at the top field.

## 9. Normal subgroups identify Galois intermediate extensions

For $\sigma\in G$ and subgroup $H$, a direct calculation gives

$$
\sigma(E^H)=E^{\sigma H\sigma^{-1}}.
$$

Indeed, if $x$ is fixed by every $h\in H$, then $(\sigma h\sigma^{-1})(\sigma x)=\sigma h(x)=\sigma x$. This proves one containment, and applying the same argument to $\sigma^{-1}$ proves the reverse.

Therefore $H$ is normal in $G$ exactly when every $\sigma\in G$ maps its fixed field $K$ onto itself. By the correspondence, equality of the two fixed fields is equivalent to equality of the subgroups, so this implication is reversible.

The stability condition is equivalent to $K/F$ being normal. If it is normal, every restriction of an $F$-automorphism sends $K$ onto itself because all conjugates of its elements lie in $K$. Conversely, suppose every $\sigma$ stabilizes $K$. For $a\in K$, all roots of its minimal polynomial lie in $E$ because $E/F$ is normal. Any chosen root $b$ gives an embedding $F(a)\to E$ sending $a$ to $b$. The extension-of-embeddings lemma extends it to an automorphism of $E$, using normality. Stability then gives $b\in K$. Thus the minimal polynomial splits in $K$.

Every intermediate field of the separable extension is separable over $F$. Consequently

$$
K/F\text{ is Galois}\quad\Longleftrightarrow\quad G_K\trianglelefteq G.
$$

When this happens, restriction gives a homomorphism $G\to\operatorname{Gal}(K/F)$ with kernel $G_K$. It is surjective: its image has size $|G|/|G_K|=[K:F]$, while the target has that same size by the automorphism count. The first isomorphism theorem yields

$$
\operatorname{Gal}(K/F)\cong G/G_K.
$$

If $G_K$ is not normal, the quotient group is not defined. Writing $G/G_K$ as if it were a group would conceal exactly the obstruction to normality of the intermediate extension.

## 10. The complete biquadratic example

Let $E=\mathbb Q(\sqrt2,\sqrt3)$. Chapter 22 established degree four and basis $1,\sqrt2,\sqrt3,\sqrt6$. It is the splitting field of $(X^2-2)(X^2-3)$, and characteristic zero gives separability. Hence it is Galois.

Define $u$ to negate $\sqrt2$ and fix $\sqrt3$, and define $v$ to fix $\sqrt2$ and negate $\sqrt3$. The basis expression shows that both maps preserve multiplication and are their own inverses. They commute. The four maps $1,u,v,uv$ exhaust the Galois group because the degree is four. Thus $G\cong C_2\times C_2$.

The subgroup $\langle u\rangle$ fixes exactly the elements $a+c\sqrt3$. To see this, apply $u$ to $a+b\sqrt2+c\sqrt3+d\sqrt6$ and compare independent basis coefficients. Fixedness forces $b=d=0$. Its fixed field is $\mathbb Q(\sqrt3)$. Similarly $\langle v\rangle$ fixes $\mathbb Q(\sqrt2)$.

The product $uv$ negates both square roots and therefore fixes their product $\sqrt6$. Comparing basis coefficients now forces $b=c=0$, giving fixed field $\mathbb Q(\sqrt6)$. The subgroup list and field list are

| Subgroup | Fixed field | Degree over $\mathbb Q$ |
|---|---|---|
| $\{1\}$ | $E$ | $4$ |
| $\langle u\rangle$ | $\mathbb Q(\sqrt3)$ | $2$ |
| $\langle v\rangle$ | $\mathbb Q(\sqrt2)$ | $2$ |
| $\langle uv\rangle$ | $\mathbb Q(\sqrt6)$ | $2$ |
| $G$ | $\mathbb Q$ | $1$ |

There are no other intermediate fields because there are no other subgroups. All subgroups are normal, so every intermediate extension over $\mathbb Q$ is Galois. This is a classification of fields obtained by solving a small group problem.

## 11. A nonabelian example and a nonnormal cubic field

Let $r=\sqrt[3]2$ be the real cube root, and let $\zeta$ be a nonreal cube root of one satisfying $\zeta^2+\zeta+1=0$. The splitting field of $X^3-2$ is $E=\mathbb Q(r,\zeta)$, with roots $r,\zeta r,\zeta^2r$.

The field $\mathbb Q(r)$ has degree three by Eisenstein. It is contained in the real numbers, so it cannot contain the nonreal $\zeta$. Adjoining $\zeta$ therefore has degree two, giving $[E:\mathbb Q]=6$. The extension is Galois because it is a characteristic-zero splitting field.

An automorphism acts faithfully on the three roots: if it fixes all roots, it fixes the field they generate. Thus $G$ embeds in $S_3$. Its order is six by the degree theorem, so the embedding is onto and $G\cong S_3$. One may choose a three-cycle sending $r$ to $\zeta r$ while fixing $\zeta$, and complex conjugation gives a transposition fixing $r$ and interchanging the nonreal roots. Their relation is the usual conjugation of a three-cycle to its inverse.

The subgroup of order three fixes $\mathbb Q(\zeta)$, a quadratic field. It is normal, so this quadratic extension is Galois. Each of the three order-two subgroups fixes one of the cubic fields generated by a root: $\mathbb Q(r)$, $\mathbb Q(\zeta r)$, or $\mathbb Q(\zeta^2r)$. None of these subgroups is normal in $S_3$, so none of the cubic extensions over $\mathbb Q$ is normal.

For the real cubic field, its internal automorphism group is trivial, as noted at the start. One must not identify it with a nonexistent quotient group $S_3/C_2$. On the other hand, the top extension $E/\mathbb Q(r)$ is Galois of degree two, with complex conjugation as its nonidentity automorphism. A top extension can be Galois even when the lower intermediate extension is not.

## 12. Intersections, generated fields, and the direction of the dictionary

Suppose $K_1,K_2$ are intermediate fields, with fixing subgroups $H_1,H_2$. Their intersection is a field, because operations on elements common to both fields stay in both. Their compositum $K_1K_2$ is the smallest subfield of $E$ containing both. This notation denotes a generated field, not the set of individual products $xy$ with $x\in K_1$ and $y\in K_2$.

An automorphism fixes the compositum exactly when it fixes both component fields. Therefore

$$
\operatorname{Gal}(E/K_1K_2)=H_1\cap H_2.
$$

On the other hand, an element is fixed by the subgroup generated by $H_1$ and $H_2$ exactly when it is fixed by both subgroups. Fixedness is preserved under composition and inverses. Hence

$$
K_1\cap K_2=E^{\langle H_1,H_2\rangle}.
$$

This is containment reversal expressed for two basic operations: generating a larger field corresponds to intersecting subgroups, while intersecting fields corresponds to generating a larger subgroup. It is easy to reverse one of these formulas by mistake, so check the extreme case $K_1=K_2=E$ or compare the direction of containment before calculating.

In the biquadratic example, the fields $\mathbb Q(\sqrt2)$ and $\mathbb Q(\sqrt3)$ have intersection $\mathbb Q$ and compositum $E$. Their fixing subgroups are two distinct order-two subgroups. Those subgroups intersect trivially and together generate all of $C_2\times C_2$, exactly as the formulas predict.

The nonabelian cubic example gives a more subtle warning about degrees. Take $K_1=\mathbb Q(r)$ and $K_2=\mathbb Q(\zeta r)$. These are distinct cubic fields because they fix distinct order-two subgroups. Their intersection has degree dividing three, so it is either $\mathbb Q$ or the whole of each cubic field. The latter would make the fields equal, so their intersection is $\mathbb Q$.

Their compositum nevertheless has degree six, not nine. It contains $r$ and $\zeta r$, hence their quotient $\zeta$, and therefore equals the splitting field $E$. The intersection being the base field does not by itself make degrees multiply. Assuming a product formula without additional hypotheses would give the wrong answer in this elementary example.

It is also useful to separate the two normality questions in a tower. For every intermediate $K$ of a finite Galois extension $E/F$, the top extension $E/K$ is Galois. Its group is the subgroup $H$ and its degree is $|H|$. The bottom extension $K/F$ is Galois only when $H$ is normal in the full group. In that case its group is the quotient $G/H$ and its degree is the index $[G:H]$. The top degree is a subgroup order; the bottom degree is a subgroup index. Mixing them is one of the most frequent numerical errors in applying the theorem.

The fixed-field calculation is also stricter than independently assigning signs to every displayed radical. In $\mathbb Q(\sqrt2,\sqrt3)$, the image of $\sqrt6$ is forced to be the product of the images of $\sqrt2$ and $\sqrt3$. It cannot be negated independently while those two are fixed. The relation $\sqrt6=\sqrt2\sqrt3$ must be preserved. Listing generator images is a proposal for a map; checking relations or using the extension lemma turns that proposal into a proof.

Finally, functional independence should not be confused with independence of values at a single point. All automorphisms send one to one, so their values at one are identical. The independence theorem says no fixed linear combination of the functions vanishes for every input. Its proof varies the input from $x$ to $ax$ to force a shorter relation. That change of input is why the theorem remains true even though the functions often agree on large subfields.

These distinctions make the correspondence a usable method. Identify the ambient Galois extension first, compute its actual automorphism group, translate the desired field operation to a subgroup operation, and then return through the fixed-field map. Every step has a theorem supporting it, and the degree formulas provide an independent consistency check.

## 13. Finite fields fit the correspondence exactly

For $E=\mathbb F_{p^n}$ over $F=\mathbb F_p$, Chapter 24 proved that the Frobenius map $\sigma(x)=x^p$ has order $n$. The extension has degree $n$, so these $n$ powers already exhaust its automorphism group. The group is cyclic.

For each divisor $d\mid n$, the subgroup $\langle\sigma^d\rangle$ has order $n/d$, and its fixed field has degree $d$ over the prime field. It is the unique subfield $\mathbb F_{p^d}$. All subgroups of a cyclic group are normal, so all finite-field intermediate extensions are Galois.

For example, inside $\mathbb F_{2^{12}}$, the subgroup generated by $\sigma^4$ has order three and fixes the sixteen-element field. The subgroup generated by $\sigma^6$ has order two and fixes the sixty-four-element field. Their generated subgroup is $\langle\sigma^2\rangle$, so the intersection of their fixed fields is the four-element field. This recovers the gcd rule by group theory.

## 14. One more degree check: the fourth roots of two

For a different nonabelian group, let $r=\sqrt[4]2$ be the positive real fourth root and let $E=\mathbb Q(r,i)$. The polynomial $X^4-2$ is irreducible over $\mathbb Q$ by Eisenstein, giving $[\mathbb Q(r):\mathbb Q]=4$. This field is real, so adjoining $i$ has degree two. Hence $[E:\mathbb Q]=8$. It contains all four roots $r,ir,-r,-ir$, making it the characteristic-zero splitting field and therefore a Galois extension.

The degree of $E$ over $\mathbb Q(i)$ is four by the tower law. Thus $X^4-2$ is still the minimal polynomial of $r$ over that field. Sending $r$ to $ir$ while fixing $i$ gives an automorphism $\rho$ of order four. Complex conjugation gives an automorphism $\tau$ fixing $r$ and sending $i$ to $-i$. It has order two, and direct application to the generators verifies $\tau\rho\tau=\rho^{-1}$.

The eight maps $\rho^j$ and $\rho^j\tau$ for $0\leq j<4$ are distinct: the first kind fixes $i$, the second kind negates it, and their effects on $r$ distinguish the four powers in each kind. They exhaust the group because its order is eight. This is the square symmetry group $D_8$, using the convention that the subscript denotes its order, not its number of vertices.

The real quartic field $\mathbb Q(r)$ is fixed by $\langle\tau\rangle$. Its degree over the base is four, so the subgroup has order two, matching the direct calculation. That subgroup is not normal: conjugating the reflection by a rotation gives a different reflection. Therefore the real quartic extension is not normal, even though the top quadratic extension $E/\mathbb Q(r)$ is Galois.

The field $\mathbb Q(i)$ is fixed by the order-four rotation subgroup $\langle\rho\rangle$. This subgroup is normal, and its quotient has order two, agreeing with the quadratic Galois group of $\mathbb Q(i)/\mathbb Q$. The field $\mathbb Q(\sqrt2)$ is also quadratic, so its fixing subgroup has order four. It is generated by $\rho^2$ and $\tau$, because both fix $r^2=\sqrt2$. Its index is two, ensuring normality.

Finally, the field $\mathbb Q(i,\sqrt2)$ has degree four and is fixed by $\langle\rho^2\rangle$. This subgroup is central and normal. The quotient is $C_2\times C_2$, matching the two independent signs in that biquadratic field. The same ambient group therefore contains intermediate fields whose fixing subgroups have very different shapes, while every degree remains determined by a subgroup order or index.

This example is useful for checking the dictionary without relying on familiar quadratic formulas alone. The irreducibility proof determines the total degree, explicit maps determine the group, and the correspondence translates its subgroup structure back into fields. No general algorithm for quartic equations was used. We can learn the structure of the splitting field before trying to express any roots in a particular formula.

The [browser companion](../companion/index.html) includes a Galois lab for inspecting small modeled correspondences. Its finite examples make containment reversal visible. They do not replace the proof or compute the Galois group of every supplied polynomial. The theorem applies because the extension is finite, normal, and separable, not because a diagram resembles a subgroup lattice.

The trivial extension is a useful boundary case. If $E=F$, its degree is one, its automorphism group contains only the identity, and the correspondence has exactly one field and one subgroup. All formulas still hold. Likewise a subgroup of order one fixes the whole top field; it does not fix only the base field. Checking these endpoints prevents a mistaken reversal before more complicated examples are attempted.

The essential achievement is now precise: for finite Galois extensions, fixed fields and fixing subgroups recover one another, degrees become group orders, and normal intermediate extensions become normal subgroups. The next chapters apply this dictionary to roots of unity and the possibility of solving equations by radicals.

## Optional exercises

1. In the biquadratic example, compute the fixed field of the automorphism negating both $\sqrt2$ and $\sqrt3$ by comparing basis coordinates.
2. If $|G|=24$ and $H\leq G$ has order four, find $[E:E^H]$ and $[E^H:F]$ for a finite Galois extension with group $G$.
3. Explain separately why $\mathbb Q(\sqrt[3]2)/\mathbb Q$ is separable and why it is not normal.
4. Inside $\mathbb F_{2^{12}}$, identify the fixed field of $\langle\sigma^4\rangle$ and the Galois group of that fixed field over $\mathbb F_2$.
5. Prove directly that $\sigma(E^H)=E^{\sigma H\sigma^{-1}}$ by showing both containments.
6. In the splitting field of $X^3-2$, identify the subgroup fixing the real cubic field and explain why its quotient in $S_3$ is not a group.
7. Prove that if $E/F$ is finite Galois and $K$ is intermediate, then $E/K$ is Galois, while explaining why the analogous assertion for $K/F$ fails.
8. Let $H$ be a finite automorphism group of $E$. Explain why the minimal-support step in Artin's theorem is needed, rather than merely finding a nonzero solution to the homogeneous equations.

[Hints and complete worked solutions](../solutions/25-solutions.md).

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](24-finite-fields.md) · [Next chapter](26-cyclotomic-fields.md) · [Hints and solutions](../solutions/25-solutions.md)
