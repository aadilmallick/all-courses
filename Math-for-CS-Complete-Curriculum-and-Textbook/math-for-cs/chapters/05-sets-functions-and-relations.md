# 05. Sets, functions, relations, and finite size

A database contains records, a program accepts inputs, and a graph connects vertices. To reason about any of these, we must distinguish an object from a collection of objects, an ordered record from an unordered set, and a function from a general relationship. Source Chapter 4 supplies the main scope; relation classifications from Chapter 10 are introduced here and developed further in Chapter 09.

## Membership and set operations

A set is a collection specified by its members. Write $x\in A$ for membership. The sets $\{1,2,2,3\}$ and $\{3,2,1\}$ are equal: repetition and order do not change membership. The empty set $\varnothing$ has no members. The set $\{\varnothing\}$ has one member, namely the empty set, so these two sets differ.

Set-builder notation specifies a domain and a condition: $\{n\in\mathbb Z:n^2<5\}=\{-2,-1,0,1,2\}$. A subset $A\subseteq B$ means every member of $A$ belongs to $B$. Equality means both inclusions. Every set is its own subset; a proper subset is unequal to the containing set. The symbol $\in$ compares an element with a set, whereas $\subseteq$ compares sets. A set can itself be an element, so context and braces matter.

The union $A\cup B$ contains elements in either set; intersection $A\cap B$ contains those in both; difference $A\setminus B$ contains those in $A$ but not $B$. For $A=\{1,2,4\}$ and $B=\{2,3\}$, the union is $\{1,2,3,4\}$, intersection $\{2\}$, and difference $\{1,4\}$. Difference is not symmetric: $B\setminus A=\{3\}$.

A complement requires a declared universe $U$: $A^c=U\setminus A$. Complementing even integers within $\mathbb Z$ gives odd integers, while complementing them within $\mathbb R$ includes nonintegers. An unstated universe can change a statement's meaning.

## Proving set identities

To prove $A\cap(B\cup C)=(A\cap B)\cup(A\cap C)$, choose arbitrary $x$. Then $x$ belongs to the left side exactly when $x\in A$ and either $x\in B$ or $x\in C$. Logical distributivity makes that equivalent to either $x\in A\cap B$ or $x\in A\cap C$. That is membership in the right side. Since membership agrees for arbitrary $x$, the sets are equal.

The proof is the logic identity from Chapter 02 applied to membership predicates. De Morgan's laws similarly give $(A\cup B)^c=A^c\cap B^c$ and $(A\cap B)^c=A^c\cup B^c$. A Venn diagram can guide discovery, but elementwise equivalence establishes the identity for all sets, including empty and infinite ones.

For indexed families, $\bigcup_{i\in I}A_i$ means an element belongs to at least one indexed set, whereas $\bigcap_{i\in I}A_i$ means it belongs to every indexed set. De Morgan's law becomes a quantifier-negation law. With a fixed universe, the intersection of an empty family is the universe and the union of an empty family is empty. These conventions mirror vacuous universal truth and false existential truth over an empty index set.

The power set $\mathcal P(A)$ is the set of all subsets of $A$. If $A=\{u,v\}$, its power set is $\{\varnothing,\{u\},\{v\},\{u,v\}\}$. Elements of the power set are sets. It contains the empty subset even when $A$ itself is empty, so $\mathcal P(\varnothing)=\{\varnothing\}$.

## Ordered structures

An ordered pair $(a,b)$ distinguishes first and second coordinates. Thus $(1,2)\ne(2,1)$. A Cartesian product $A\times B$ contains all pairs with first coordinate in $A$ and second in $B$. If $A=\{r,s\}$ and $B=\{0,1,2\}$, there are six pairs. The number six is a count of distinct pairs, not a claim about the numerical values of their entries.

A finite sequence $(a_0,\ldots,a_{n-1})$ has length $n$, order, and allowed repetition. A string is a finite sequence over an alphabet, a set of permitted symbols. Over $\Sigma=\{0,1\}$, the strings $01$ and $10$ differ, and $00$ has length two although it uses one distinct symbol. The empty string $\varepsilon$ has length zero. Concatenation places one string after another: $01\cdot10=0110$.

A set of sequences differs from a sequence of sets. For example, $(\{a,b\},\{c\})$ has two positions; choosing one entry from each gives either $(a,c)$ or $(b,c)$. The distinction becomes essential in product rules, generating functions, and encodings of combinatorial objects.

## Functions: domain, codomain, image

A function $f:A\to B$ assigns exactly one element $f(a)\in B$ to every $a\in A$. The domain is $A$, codomain is $B$, and image is $f(A)=\{f(a):a\in A\}$. An input may have only one output, but several inputs may share an output. A rule leaving some domain input unanswered is not a total function on that domain.

Consider $f:\mathbb Z\to\mathbb Z$ defined by $f(n)=n^2$. It reaches nonnegative squares, so its image is smaller than its codomain. Restricting the codomain to the nonnegative squares changes a property of the function even though the calculation rule stays the same. A function is more than its formula.

Composition means applying one function after another. If $f:A\to B$ and $g:B\to C$, then $(g\circ f)(a)=g(f(a))$. For $f(x)=2x+1$ and $g(x)=x^2$, $g(f(2))=25$, while $f(g(2))=9$. Composition is generally not commutative. Its order is read from the inside out.

The preimage of $S\subseteq B$ is $f^{-1}(S)=\{a\in A:f(a)\in S\}$. This notation does not require an inverse function. For the squaring function, $f^{-1}(\{4\})=\{-2,2\}$. Images and preimages are sets, so a preimage can contain several elements even though each input has one output.

## Injective, surjective, bijective

Injective means distinct inputs have distinct outputs: $f(a)=f(a')$ implies $a=a'$. Surjective means every element of the codomain has an input: for every $b\in B$, there exists $a\in A$ with $f(a)=b$. Bijective means both. Injections prevent collisions; surjections leave no codomain element unreached; bijections create exact pairings.

The function $f:\mathbb Z\to\mathbb Z$, $f(n)=2n$, is injective because $2n=2m$ gives $n=m$, but not surjective because no integer maps to one. The map $g:\mathbb Z\to\mathbb N$, $g(n)=|n|$, is surjective but not injective, since $1$ and $-1$ share output one. The map $h:\mathbb Z\to\mathbb Z$, $h(n)=n+3$, is bijective; the unique preimage of $b$ is $b-3$.

A bijection has an inverse function $f^{-1}:B\to A$. Existence of an inverse implies both injectivity and surjectivity. If an output is never reached, its inverse is missing; if two inputs reach it, the inverse is ambiguous. This is why inverse-function notation must be distinguished from the always-defined preimage of a subset.

Composition preserves these properties in the expected direction: a composition of injections is injective, because equality of final outputs can be pulled backward through each injection; a composition of surjections is surjective, because a desired final output has a preimage at each stage. The converse implications need care and do not generally hold for both component functions.

## Relations and their properties

A binary relation from $A$ to $B$ is any subset of $A\times B$. It can associate an input with zero, one, or many outputs. A function is a relation with the additional exactly-one-output condition. On integers, divisibility relates $a$ to $b$ when $b=ak$ for some integer $k$; the relation “less than” relates many pairs but is not a function.

For a relation $R$ on $A$, reflexive means $aRa$ for every $a$. Irreflexive means no $aRa$. Symmetric means $aRb$ implies $bRa$. Antisymmetric means $aRb$ and $bRa$ together force $a=b$. Transitive means $aRb$ and $bRc$ imply $aRc$. Antisymmetric does not mean “never symmetric”; equality is both symmetric and antisymmetric.

The relation $\le$ is reflexive, antisymmetric, and transitive. The relation $<$ is irreflexive and transitive. “Has the same remainder modulo three” is reflexive, symmetric, and transitive; such a relation is called an equivalence relation. Its classes are the integers with remainders zero, one, and two. Chapter 09 develops equivalence classes and partial orders as structures in their own right.

Relation composition describes two-step connection: $a(S\circ R)c$ if some $b$ satisfies $aRb$ and $bSc$. The middle witness matters. In a directed graph, composing the edge relation with itself gives the relation “connected by a walk of length two,” not necessarily an edge of the original graph.

## Finite cardinality

The cardinality $|A|$ of a finite set is its number of elements. A bijection proves two sets have equal size without requiring a particular listing. An injection $A\to B$ proves $|A|\le|B|$ for finite sets, and a surjection $A\to B$ proves $|A|\ge|B|$. These statements formalize the pigeonhole principle.

If $A$ and $B$ have the same finite size, an injection between them is automatically surjective: distinct inputs occupy all available outputs. This fails for infinite sets; the map $n\mapsto n+1$ injects $\mathbb N$ into itself but misses zero. Chapter 07 explores why finite intuition must be revised.

For finite disjoint sets, $|A\cup B|=|A|+|B|$. Without disjointness, subtract overlap: $|A\cup B|=|A|+|B|-|A\cap B|$. If $|A|=8$, $|B|=7$, and overlap is three, the union has twelve. Summing $8+7$ counts those three elements twice.

The product rule $|A\times B|=|A||B|$ follows by grouping pairs by first coordinate: each of $|A|$ groups contains $|B|$ pairs. There are $|B|^{|A|}$ functions $A\to B$ when these are finite and $B$ nonempty, because each input independently chooses an output. Empty cases require conventions: there is one empty function from $\varnothing$ to any $B$, and no function from a nonempty $A$ to $\varnothing$.

Each subset of an $n$-element set corresponds to an $n$-bit membership string: one means include the element. This is a bijection, so the power set has $2^n$ elements. The result is not about how the elements are named. Fixing an order merely supplies a convenient encoding.

## Images and preimages preserve different operations

For a function $f:A\to B$, preimages commute with unions and intersections. An input lies in $f^{-1}(S\cap T)$ exactly when its output lies in both $S$ and $T$, which is exactly membership in $f^{-1}(S)\cap f^{-1}(T)$. This elementwise argument needs no injectivity or surjectivity. Complements also behave cleanly when the domain and codomain universes are fixed.

Images preserve unions, but intersections can shrink: $f(S\cap T)\subseteq f(S)\cap f(T)$. Equality need not hold. Under integer squaring, let $S=\{-1\}$ and $T=\{1\}$. Their intersection is empty, whose image is empty, but both images are $\{1\}$. The same output can be reached by different inputs on opposite sides. If $f$ is injective, that collision cannot occur, and equality of images of an intersection is restored.

This example explains a general proof habit: when an identity unexpectedly requires injectivity, locate the step where equal outputs were turned into equal inputs. That is exactly the content of injectivity. A property should be invoked where it supplies a needed inference, not attached to a theorem as an unexplained adjective.

## Counting functions with restrictions

Let $A$ have three elements and $B$ five. There are $5^3=125$ functions from $A$ to $B$, since each domain element selects one output. For injections, the choices are five, four, then three, yielding sixty. No surjection exists because three inputs cannot reach five different outputs. This small example separates “one output for each input” from “every possible output is used.”

Reverse the sizes, with five inputs and three outputs. There are $3^5$ functions but no injections. Surjections can be counted by excluding functions that miss one or more outputs: $3^5-3\cdot2^5+3\cdot1^5=150$. This previews inclusion–exclusion. Missing two designated outputs leaves only one output choice for every input, and missing all three is impossible for a nonempty domain. The count illustrates why an output-side condition is more involved than independent per-input choices.

With equal finite size $n$, bijections number $n!$. Their inverses are also bijections. Composition of bijections gives another bijection and therefore preserves the property of exact pairing. This algebra of reversible mappings appears in permutation routing, cryptographic toy examples, and relabeling graphs.

## Partitions are not arbitrary covers

A cover of a set is a family of subsets whose union is the set. A partition additionally requires the blocks to be nonempty and pairwise disjoint. For $\{1,2,3\}$, the family $\{\{1,2\},\{2,3\}\}$ is a cover but not a partition because two belongs to both blocks. The family $\{\{1,2\},\{3\}\}$ is a partition. Equivalence classes yield partitions precisely because overlap forces equality of classes.

An indexed family can repeat a block even when the underlying set of blocks would not. When summing over indices, repeated entries are counted repeatedly. This is another reason to distinguish sequences, sets, and families with specified indices. An argument using “all groups” should say whether groups are labeled and whether repetition is meaningful.

## Relations as data and as rules

A finite relation can be listed as pairs, displayed in a table, or drawn as arrows. These representations encode the same membership facts. For a relation on three vertices, a three-by-three Boolean table has a true entry precisely where the ordered pair belongs. Reflexivity asks for every diagonal entry true; symmetry asks that entries mirror across the diagonal. Transitivity concerns combinations of entries, not merely a visible diagonal pattern.

Take the relation with arrows $a\to b$ and $b\to c$ but no $a\to c$. It is not transitive. Adding the missing arrow repairs that particular triple, but larger examples may require repeated additions. The transitive closure is the relation connecting every pair joined by a positive-length walk. If a reflexive closure is also desired, add every length-zero pair explicitly. These closure operations anticipate reachability matrices in Chapter 09.

## An empty-domain audit

There is exactly one function from the empty domain to any codomain: it has no input-output pairs. It satisfies the function rule because there is no input lacking an output. This function is injective, since no two distinct inputs collide. It is surjective only when the codomain is also empty, because a nonempty codomain contains an unreached element. A function from a nonempty domain into the empty set cannot exist.

These cases are not artificial puzzles. They explain why combinatorial conventions work at zero size and why an implication may hold vacuously. Whenever a theorem claims that an injection or surjection exists, checking empty sets can reveal a missing nonemptiness condition. The familiar expression for the number of functions must be interpreted with the empty-function convention when both sizes are zero.

A relation on the empty set is reflexive, symmetric, antisymmetric, and transitive because each property universally quantifies over nonexistent inputs. It is also irreflexive. On a nonempty set, reflexivity and irreflexivity cannot both hold. This shows that the compatibility of relation properties can depend on the domain's size, another reason to keep domains explicit rather than treating adjectives as isolated labels.

For a new relation, test the definitions directly on a pair and a triple before assigning names to it. A small example often reveals whether symmetry, antisymmetry, and transitivity have been confused. It does not prove a universal property on an infinite domain, but it can expose a false claim immediately.

## Applying the distinctions

A list of user IDs may contain duplicates; a set of IDs does not. Converting a list to a set can lose multiplicity and order. A table mapping each ID to exactly one balance is a function; a table of friendships is a relation. A program specification should say which structure is intended before a proof or count begins.

In the counting lab, compare ordered selections with unordered subsets. In the graph lab, the adjacency matrix represents a relation; a single row may contain several ones, so it is generally not a function. These experiments reinforce the definitions rather than replace them.

**05-A.** List $\mathcal P(\{a,b,c\})$. **05-B.** Classify $f:\mathbb Z\to\mathbb Z$, $f(n)=n+5$, as injective and/or surjective, with proof. **05-C.** Compute the preimage of $\{1,4\}$ under integer squaring. **05-D.** Is “has the same absolute value” an equivalence relation on $\mathbb Z$? **05-E.** Explain why a five-entry list can produce a set with fewer than five members.
