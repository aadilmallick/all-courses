# Chapter 11 — Hints and reference solutions

Return to [Chapter 11](../chapters/11-group-actions-and-counting.md). Each hint is followed by a full solution so the course remains usable offline. The exercises are optional; working through one example carefully is more useful than rushing through all eight.

## 1. Translation on six residues

**Hint.** A translation fixing even one residue must be the zero translation.

**Solution.** Every residue can be obtained from $[2]$ by adding a suitable class, so its orbit is all six residues. If $[a]+[2]=[2]$, additive cancellation gives $[a]=[0]$. Thus the stabilizer is trivial. The same reasoning works at every point, so the action is free. Any element fixing all points fixes $[2]$, so the kernel is trivial and the action is faithful. Orbit-stabilizer gives $6=6/1$.

## 2. Units acting on the class of three

**Hint.** Multiply three by each of the four units modulo twelve.

**Solution.** The units are $[1],[5],[7],[11]$. Their products with $[3]$ are $[3],[3],[9],[9]$. Therefore the orbit is $\{[3],[9]\}$ and the stabilizer is $\{[1],[5]\}$. Its order is two, so the orbit size is $4/2=2$, exactly as listed. The zero divisors in the whole residue ring do not obstruct the action because the acting elements are units.

## 3. Conjugating stabilizers

**Hint.** Expand the assertion that $h$ fixes $g\cdot x$ and then apply $g^{-1}$.

**Solution.** With $y=g\cdot x$, we have $h\in G_y$ exactly when $h\cdot(g\cdot x)=g\cdot x$. Applying the action of $g^{-1}$ to both sides gives $(g^{-1}hg)\cdot x=x$. Thus $h\in G_y$ exactly when $g^{-1}hg\in G_x$, which is equivalent to $h\in gG_xg^{-1}$. Applying $g^{-1}$ was legitimate because every group action map is a bijection with inverse given by the inverse group element.

## 4. Triangle colorings

**Hint.** A three-cycle has one position cycle; a reflection has two.

**Solution.** For rotations, the identity fixes $3^3=27$ colorings and each of the two nonidentity rotations fixes three solid colorings. Burnside gives $(27+3+3)/3=11$. For all six symmetries, each of the three reflections fixes $3^2=9$ colorings, since the fixed vertex can have any color and the exchanged pair must share a color. The count is $(27+3+3+27)/6=10$. Reflection identifies a pair of rotational types that remain distinct under rotations alone; with three distinct colors, the two cyclic orientations are different rotational classes but become one reflection class.

## 5. Normal subgroups of order two in $S_3$

**Hint.** A normal subgroup is a union of conjugacy classes.

**Solution.** The classes are $\{e\}$, the three transpositions, and the two three-cycles. Conjugation relabels cycles, proving both the membership and completeness of this list. A subgroup of order two contains exactly one nonidentity element, necessarily a transposition. If normal, it must contain every conjugate of that transposition, giving at least the identity and three transpositions. This contradicts order two. The argument uses class closure, not just the fact that two divides six.

## 6. Free versus faithful

**Hint.** Apply orbit-stabilizer separately to each orbit.

**Solution.** If every stabilizer is trivial, each orbit has $|G|$ elements. Since the finite set is a disjoint union of these orbits, its size is a multiple of $|G|$. Faithfulness only says the intersection of all stabilizers is trivial; individual stabilizers can be nontrivial. For example, $C_2$ acting by swapping two points and fixing a third is faithful, but the set has size three, not divisible by two. Its orbit sizes are two and one.

## 7. A prime-power action

**Hint.** Reduce the orbit decomposition modulo five.

**Solution.** Orbits of a group of order twenty-five have sizes one, five or twenty-five. Every orbit larger than one contributes a multiple of five. Therefore the number of common fixed points is congruent to $26\equiv1\pmod5$ and in particular is positive. For twenty-five points, no common fixed point is forced: let the group act on itself by left multiplication. This action is free and transitive, so its one orbit has size twenty-five and it has no common fixed point.

## 8. Kernel of a coset action

**Hint.** Compute the stabilizer of each coset and intersect them.

**Solution.** An element $g$ fixes $aH$ exactly when $gaH=aH$, or equivalently $a^{-1}ga\in H$. The stabilizer is $aHa^{-1}$. The action kernel is therefore their intersection $K=\bigcap_a aHa^{-1}$. It is normal because it is a homomorphism kernel, and it lies in $H$ by taking $a=e$. If $N$ is any normal subgroup contained in $H$, then $N=aNa^{-1}\subseteq aHa^{-1}$ for every $a$, so $N\subseteq K$. This proves maximality. In $S_3$ with $H=\{e,(12)\}$, its three conjugates are the three transposition-generated subgroups. Their intersection is $\{e\}$, so the coset action is faithful.
