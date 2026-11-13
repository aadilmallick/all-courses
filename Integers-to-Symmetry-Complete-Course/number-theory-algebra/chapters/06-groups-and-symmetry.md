# Chapter 06 — Groups, symmetry and subgroups

A clock, an integer equation, and a rotating square appear to belong to different parts of mathematics. Yet each involves operations that can be performed, combined, and undone. Adding three hours and then adding five hours has the same effect as adding eight hours. Turning a square clockwise and then reversing that turn restores the square. The aim of this chapter is to isolate this common pattern without losing the concrete examples that make it understandable.

The new word is **group**. A group is a set equipped with a particular operation satisfying four precise requirements. The operation matters as much as the set. We will build the definition, investigate what follows from it, and learn how to recognize a smaller group inside a larger one. The arithmetic developed in Chapters 2–5 will keep providing examples: abstraction is a way to organize that arithmetic, rather than a request to forget it.

Read this chapter in three sittings if helpful: operations and axioms; calculations and symmetry; subgroups and construction. The only prerequisites are functions, sets, and modular arithmetic. Every new algebraic word used in an argument will be introduced before the argument needs it.

## 1. An operation needs a domain and a rule

A **binary operation on a set** $G$ is a function from $G\times G$ to $G$. It accepts an ordered pair of elements and returns one element of the same set. We often write its output as $a*b$, $a+b$, or $ab$. The notation alone does not determine the rule. Multiplication of integers and composition of rotations may both be written by placing symbols next to one another, but they are different operations.

The requirement that the output stays in $G$ is called **closure**. Addition is an operation on the integers because the sum of two integers is an integer. Ordinary division is not an operation on the integers: $1/2$ is not an integer, and division by zero creates an additional problem. Subtraction is an operation on the integers, but it will fail another requirement needed for groups. Thus closure is a necessary beginning, not the whole definition.

For finite sets, an operation can be described by a table. Rows and columns are labeled by elements, and the entry in row $a$, column $b$ is $a*b$. Consider addition of residue classes modulo $3$:

| $+$ | $[0]$ | $[1]$ | $[2]$ |
|---|---|---|---|
| $[0]$ | $[0]$ | $[1]$ | $[2]$ |
| $[1]$ | $[1]$ | $[2]$ | $[0]$ |
| $[2]$ | $[2]$ | $[0]$ | $[1]$ |

The table records closure because every entry is one of the labels. It also records facts such as $[2]+[2]=[1]$. That equality concerns classes: $4$ and $1$ differ by a multiple of $3$. When the modulus is fixed, we may omit brackets in informal calculations, but we should remember what objects the symbols denote.

There is a small logical distinction worth preserving. A formula involving representatives does not automatically define an operation on classes. Earlier chapters checked that addition is well-defined modulo $n$: changing a representative does not change the resulting class. The same obligation will return whenever we construct a quotient. Group theory never grants permission to skip it.

## 2. Why the group axioms have their particular shape

A **group** consists of a set $G$ and a binary operation $*$ satisfying the following conditions.

1. The operation is associative: $(a*b)*c=a*(b*c)$ for all $a,b,c\in G$.
2. There is an identity element $e\in G$ such that $e*a=a*e=a$ for every $a\in G$.
3. Every $a\in G$ has an inverse: there is $b\in G$ with $a*b=b*a=e$.

Closure is already built into the phrase binary operation on $G$. It is often listed as a fourth axiom because it deserves an explicit check in examples. A group is nonempty, since its identity must belong to it. We usually drop the star and write $ab$, with identity $e$ and inverse $a^{-1}$.

Associativity says that parentheses can be rearranged without changing the order of the elements. It does **not** say that order can be reversed. For three successive actions, it says that combining the first two before combining the third gives the same total action as combining the last two first. Function composition has this property because both parenthesizations send $x$ to the same expression $f(g(h(x)))$.

An identity is a genuine element of the set, not an instruction outside the set. For addition of integers it is $0$; for multiplication of nonzero rational numbers it is $1$; for symmetries of a square it is the action that leaves every point where it was. Inverses are always relative to the selected operation. The additive inverse of $5$ is $-5$, while its multiplicative inverse among nonzero rationals is $1/5$.

The inverse axiom expresses reversibility. It does not require that all elements look like fractions, or that the operation is numerical. Turning a square clockwise is undone by turning it counterclockwise. Applying a bijection is undone by its inverse function. The algebraic notation $a^{-1}$ packages this idea in a form that works across examples.

A group is **abelian** if $ab=ba$ for every pair of elements. This is an additional property, not part of being a group. Integer addition is abelian. Square symmetries will provide a nonabelian example. The term commemorates Niels Henrik Abel, but remembering the name is less important than remembering the quantifier: every pair must commute for the entire group to be abelian.

## 3. Four examples and four useful failures

The integers under addition form a group. Closure and associativity are familiar properties of integer arithmetic. The identity is $0$, and the inverse of $a$ is $-a$. Addition also commutes, so this group is abelian. We denote it by $(\mathbb Z,+)$ when clarity requires specifying the operation.

The integers under multiplication do not form a group. The identity $1$ exists and multiplication is associative, but $2$ has no multiplicative inverse in the integers. An integer $b$ satisfying $2b=1$ would have to be $1/2$. The problem is not that the inverse fails to exist anywhere; it fails to exist in the specified set. Zero fails even more decisively because $0b=0$ for every integer $b$.

The positive rational numbers under multiplication do form a group. Products remain positive rationals, multiplication is associative, $1$ is the identity, and the inverse of $a/b$ is $b/a$ when $a,b$ are positive integers. The set of all nonzero rational numbers also forms a multiplicative group. These examples show that removing an obstruction can turn a familiar operation into a group operation.

The nonnegative integers under addition fail because $1$ has no additive inverse in that set. Including $0$ gives an identity but does not repair the missing inverses. Under our convention the natural numbers include $0$; the positive integers do not, and therefore also lack an additive identity. Always state the set before checking the axioms.

The integers with subtraction give another instructive failure. Closure holds, and $a-0=a$, but $0-a$ need not equal $a$. Thus $0$ is only a right identity for this operation, not a two-sided identity. Associativity also fails: $(8-3)-2=3$, whereas $8-(3-2)=7$. The ability to perform an arithmetic operation is much weaker than satisfying the group axioms.

The set $\{1,-1\}$ under ordinary multiplication is a group. Both elements are their own inverses, and $1$ is the identity. The subset $\{1,2\}$ is not closed under multiplication because $2\cdot2=4$. A finite subset of a known group therefore needs its own closure check. Merely selecting some elements of a group does not automatically produce another group.

Finally, residue classes modulo $n$ under addition form an abelian group. The inverse of $[a]$ is $[-a]$, regardless of whether $a$ shares a factor with $n$. Multiplicative inverses are a different matter. For instance, modulo $8$, the class $[2]$ has no multiplicative inverse, while $[3]$ does because $3\cdot3\equiv1\pmod8$. We will give these invertible classes a systematic group of their own in Chapter 9.

## 4. Consequences that are theorems, not extra axioms

The definition says an identity exists. It does not separately say that the identity is unique. We should prove uniqueness rather than assume it. If $e$ and $f$ are both identities, then $ef=f$ because $e$ is an identity, while $ef=e$ because $f$ is an identity. Therefore $e=f$. The same product has two descriptions, and comparing them forces equality.

Inverses are unique as well. Suppose $b$ and $c$ both satisfy the inverse requirements for $a$. Then

$$
b=b e=b(ac)=(ba)c=e c=c.
$$

The middle step uses associativity. Each equality is licensed by an axiom or by the hypotheses about $b$ and $c$. Now $a^{-1}$ is unambiguous notation. Without a uniqueness proof it would merely denote some unspecified choice of inverse.

A group satisfies **left cancellation**: if $ab=ac$, then $b=c$. Multiply both sides on the left by $a^{-1}$, use associativity, and simplify:

$$
a^{-1}(ab)=a^{-1}(ac),\qquad (a^{-1}a)b=(a^{-1}a)c,\qquad eb=ec.
$$

Right cancellation follows by multiplying $ba=ca$ on the right by $a^{-1}$. Notice that multiplication occurs on the same side where the common factor appears. In a nonabelian group we are not allowed to slide $a^{-1}$ through other elements.

Cancellation can fail outside groups. Modulo $6$, multiplication gives $2\cdot1\equiv2\cdot4$, but $1\not\equiv4$. The class $[2]$ has no multiplicative inverse. This example connects the group axiom to the earlier warning about dividing congruences: canceling an arbitrary factor is not justified unless some extra arithmetic condition supplies invertibility.

The inverse of a product is

$$
(ab)^{-1}=b^{-1}a^{-1}.
$$

To verify it, compute $(ab)(b^{-1}a^{-1})=a(bb^{-1})a^{-1}=e$. Computing the product in the other order also gives $e$. Uniqueness of inverses then identifies the result. The reversal of order is essential. If you put on socks and then shoes, reversing the process requires removing shoes before socks. This analogy illustrates the order, while the displayed computation supplies the proof.

We also obtain $(a^{-1})^{-1}=a$, since $a$ is an inverse for $a^{-1}$. The identity has inverse $e$. If $a^2=e$, then $a=a^{-1}$; such an element need not itself be the identity. The element $-1$ in $\{1,-1\}$ gives the smallest example. Distinguishing a self-inverse element from an identity prevents several later mistakes with reflections and transpositions.

## 5. Solving equations without commuting everything

Consider the equation $ax=b$ in an arbitrary group. Multiplying on the left by $a^{-1}$ gives the unique solution $x=a^{-1}b$. For $xa=b$, the solution is $x=ba^{-1}$. These two answers need not be equal. The location of the unknown determines which side is used to undo the known factor.

For a slightly longer example, solve $axb=c$. First multiply on the left by $a^{-1}$ to obtain $xb=a^{-1}c$. Then multiply on the right by $b^{-1}$:

$$
x=a^{-1}cb^{-1}.
$$

Substitution checks the result: $a(a^{-1}cb^{-1})b=(aa^{-1})c(b^{-1}b)=c$. This is safer than memorizing a phrase about moving factors across an equals sign. We perform the same valid operation on both sides, preserving the factor order throughout.

Powers simplify repeated multiplication of one element. Define $a^0=e$, define $a^m$ for positive integers by repeated multiplication, and define $a^{-m}=(a^{-1})^m$. Associativity gives $a^{r+s}=a^ra^s$ for all integers $r,s$. Consequently powers of a single element commute with each other, even in a nonabelian group.

The last sentence does not imply $(ab)^m=a^mb^m$. Already for $m=2$, the left side is $abab$ and the right side is $aabb$. They agree if $a$ and $b$ commute, but not in general. This distinction is one reason arithmetic intuition must be checked carefully when we start working with symmetries.

In additive notation, powers become integer multiples: $ma$ means adding $a$ to itself $m$ times, with the usual extension to zero and negative integers. The identity is then written $0$, and the inverse is $-a$. Writing $a^{-1}$ in an additive group would obscure the operation. The underlying axioms are the same; notation is a guide to the example, not a change in logic.

## 6. The square as a complete nonabelian example

Place a square with vertices labeled $0,1,2,3$ in clockwise order. A symmetry is a rigid motion taking the square to itself. Because it sends vertices to vertices and preserves adjacency, a symmetry is determined by the destination of vertex $0$ and the choice of which adjacent vertex receives vertex $1$. There are four choices for the first destination and two for the second. This gives exactly eight symmetries.

Let $r$ be the clockwise quarter-turn, so $r$ sends each vertex label $j$ to $j+1$ modulo $4$. Let $s$ be the reflection sending $j$ to $-j$ modulo $4$. The composition $fg$ means first apply $g$, then apply $f$. This right-to-left convention matches function composition and will be used throughout the course.

The eight symmetries are

$$
e,\ r,\ r^2,\ r^3,\ s,\ rs,\ r^2s,\ r^3s.
$$

We denote this group by $D_8$, with the subscript indicating its order, eight. Some books use a different subscript convention, so the stated order is what matters. Rotations form the first four elements, and reflections form the last four. Composition is associative because it is function composition; the identity does nothing, and reversing a rigid motion supplies its inverse.

We have $r^4=e$, $s^2=e$, and

$$
sr=r^{-1}s.
$$

Check the third relation on a vertex $j$. The left side sends $j$ first to $j+1$, then to $-j-1$. The right side sends $j$ first to $-j$, then to $-j-1$. The two functions agree on every vertex and therefore describe the same symmetry.

The relation says that a reflection changes the direction in which rotations are interpreted. It yields $sr^k=r^{-k}s$ for each integer $k$, by repeating the calculation. We can use it to simplify products. For example,

$$
(r^2s)(r^3s)=r^2(sr^3)s=r^2r^{-3}s^2=r^{-1}=r^3.
$$

Two reflections can combine to a rotation. That is a mathematical conclusion from the relation, not an appeal to a drawing alone.

The group is nonabelian because $sr\ne rs$. For instance, $sr$ sends vertex $0$ to $3$, while $rs$ sends it to $1$. Finding a single pair with unequal products disproves commutativity. Proving a group abelian would require checking every pair or giving a structural argument that covers every pair.

A convenient coordinate description writes an element as $r^is^\varepsilon$, where $i$ is taken modulo $4$ and $\varepsilon$ modulo $2$. Multiplication becomes

$$
(r^is^\varepsilon)(r^js^\delta)
 =r^{\,i+(-1)^\varepsilon j}s^{\,\varepsilon+\delta}.
$$

The sign appears because a reflection reverses a following rotation. You need not memorize this formula, but deriving it gives practice translating a geometric fact into an algebraic calculation. It also offers a concrete way to generate the full multiplication table without guessing.

## 7. Subgroups: preserving a group inside itself

A subset $H$ of a group $G$ is a **subgroup** if it becomes a group using the same operation as $G$. We write $H\le G$. The phrase same operation is essential. We are not allowed to invent a different operation on the subset and then call it a subgroup of the original group.

The easiest example is $2\mathbb Z$, the set of even integers, inside $(\mathbb Z,+)$. Adding even integers stays even, $0$ is even, and the negative of an even integer is even. Associativity is inherited from integer addition. Thus $(2\mathbb Z,+)$ is a subgroup. The odd integers are not: adding two odd integers gives an even integer, so closure fails.

Every group has at least the trivial subgroup $\{e\}$ and the whole group $G$. They may be the same if $G$ has only one element. A **proper subgroup** is a subgroup different from $G$. A **nontrivial subgroup** is one different from $\{e\}$. Neither adjective changes the subgroup axioms; each merely excludes a boundary case.

It is inefficient to recheck associativity for a subset of an existing group. The operation already satisfies that identity on all triples in $G$, hence on triples in $H$. The real work is checking that the subset contains the identity and is closed under products and inverses.

Here is a useful condensed test. A nonempty subset $H\subseteq G$ is a subgroup if, whenever $x,y\in H$, the element $xy^{-1}$ belongs to $H$.

To prove it, choose $h\in H$. Taking $x=y=h$ gives $e\in H$. Now take $x=e$ and any $y\in H$; the test gives $y^{-1}\in H$. Finally, if $x,z\in H$, then $z^{-1}\in H$, so applying the test to $x$ and $z^{-1}$ gives $x(z^{-1})^{-1}=xz\in H$. Thus identity, inverses, and products all remain inside $H$.

The converse is immediate from the subgroup axioms: if $H$ is a group, then $y^{-1}\in H$ and multiplying it by $x$ stays in $H$. In additive notation the test reads $x-y\in H$. For $m\mathbb Z$, subtracting $ma$ and $mb$ gives $m(a-b)$, so every set of multiples of an integer is an additive subgroup.

## 8. Detecting subgroups in examples

In $D_8$, the rotations $R=\{e,r,r^2,r^3\}$ form a subgroup. Products add rotation exponents modulo $4$, inverses negate them, and $e$ is included. The set $\{e,s\}$ also forms a subgroup because $s^2=e$. More generally, each reflection together with the identity forms a subgroup of order two.

The set $\{e,r,s\}$ is not a subgroup. The product $r\cdot r=r^2$ is missing. Adding $r^2$ alone will still not finish the repair: products involving $r$ and $s$ demand further elements. In fact, a subgroup containing both $r$ and $s$ must contain all eight displayed elements of $D_8$. A small generating set can force a much larger subgroup.

The positive rational numbers are a multiplicative subgroup of the nonzero rationals. The negative rational numbers are not, because multiplying two negatives gives a positive. The rationals of the form $2^k$, where $k\in\mathbb Z$, form another multiplicative subgroup. Its inverses correspond exactly to replacing $k$ by $-k$.

A finite nonempty subset closed under multiplication is automatically a subgroup. This statement requires finiteness. Let $H$ be such a subset and choose $h\in H$. The powers $h,h^2,h^3,\ldots$ all lie in $H$. Since $H$ is finite, two powers repeat: $h^i=h^j$ with $1\le i<j$. Cancellation in the ambient group gives $h^{j-i}=e$, so $e\in H$.

The same equality provides an inverse: $h^{j-i-1}$ lies in $H$ when the exponent is positive, and when it is zero the inverse is $e$, already shown to belong to $H$. Thus every $h$ has its inverse in $H$. Closure was assumed and associativity is inherited, completing the proof.

Without finiteness, positive powers need not repeat. The nonnegative integers form a nonempty subset of $(\mathbb Z,+)$ closed under addition, yet they are not a subgroup. This is a useful model for reading hypotheses: the finite assumption was used at a specific line of the proof, and the infinite counterexample shows why it cannot simply be deleted.

## 9. Intersections and generated subgroups

If $H$ and $K$ are subgroups of $G$, their intersection $H\cap K$ is a subgroup. It contains $e$. If $x,y$ belong to the intersection, then $xy^{-1}$ belongs to $H$ and also to $K$, so it belongs to the intersection. The same proof works for the intersection of any nonempty family of subgroups. By convention, the intersection of an empty family of subsets of $G$ is $G$, which is also a subgroup.

Unions behave differently. In the additive group of integers, both $2\mathbb Z$ and $3\mathbb Z$ are subgroups. Their union contains $2$ and $3$ but not $5$, so it is not closed under addition. The difficulty is that one input can come from one subgroup and the other from another; neither subgroup's closure statement controls that mixed pair.

Given a subset $S\subseteq G$, the **subgroup generated by $S$**, written $\langle S\rangle$, is the smallest subgroup of $G$ containing $S$. We can define it rigorously as the intersection of all subgroups containing $S$. There is at least one such subgroup, namely $G$, so this definition is meaningful. The intersection result proves it is a subgroup.

There is also a concrete description. The generated subgroup consists of all finite products of elements of $S$ and their inverses, including the empty product $e$. This set contains $S$, and combining or inverting such words gives another such word. Any subgroup containing $S$ must contain every word of this form, proving the description agrees with the smallest-subgroup definition.

For a single element $a$, we write $\langle a\rangle$ in place of $\langle\{a\}\rangle$. Its elements are exactly the integer powers $a^k$. This subgroup is called cyclic. Chapter 7 develops cyclic groups systematically; here the important point is that generation is a closure process whose output includes every consequence of the required operations.

For example, $\langle6,10\rangle$ inside the additive integers contains all numbers $6u+10v$ with $u,v\in\mathbb Z$. Each such number is even. Conversely, Bezout's identity gives $2=2\cdot6-10$, so the generated subgroup contains every multiple of $2$. Therefore $\langle6,10\rangle=2\mathbb Z$. The gcd has reappeared as a structural description of a subgroup, linking the language of this chapter to Euclid's algorithm.

## 10. Products, centers, and the role of structure

If $G$ and $H$ are groups, their **direct product** $G\times H$ uses coordinatewise multiplication:

$$
(g_1,h_1)(g_2,h_2)=(g_1g_2,h_1h_2).
$$

Associativity holds in each coordinate. The identity is $(e_G,e_H)$, and $(g,h)^{-1}=(g^{-1},h^{-1})$. This construction lets us build new groups while keeping two independent operations in separate coordinates. It does not mean that $g$ can be multiplied by $h$; those elements may belong to entirely unrelated sets.

In additive notation, $\mathbb Z/2\mathbb Z\times\mathbb Z/2\mathbb Z$ has four elements. Every nonidentity element added to itself gives $(0,0)$. By contrast, $\mathbb Z/4\mathbb Z$ has an element $[1]$ whose repeated additions pass through all four elements. Both groups contain four elements, yet their internal behavior differs. Later we will formalize when two groups count as structurally the same.

The **center** of $G$ is the subset

$$
Z(G)=\{z\in G:zg=gz\text{ for every }g\in G\}.
$$

It consists of elements commuting with the entire group. To see that it is a subgroup, suppose $x,y\in Z(G)$. From $yg=gy$, multiplying appropriately by $y^{-1}$ shows $y^{-1}g=gy^{-1}$. Then $(xy^{-1})g=x(gy^{-1})=(xg)y^{-1}=(gx)y^{-1}=g(xy^{-1})$. The subgroup test applies.

For $D_8$, the center is $\{e,r^2\}$. A half-turn commutes with a reflection because $sr^2=r^{-2}s=r^2s$. Quarter-turns do not commute with $s$. No reflection commutes with $r$, because the relation reverses $r$ and $r\ne r^{-1}$. This argument checks every type of element in the eight-element list, so it establishes the full center rather than merely finding two examples.

These constructions illustrate how group theory proceeds. We define a useful pattern, prove it persists under certain operations, and use it to organize concrete examples. The power of an abstraction appears when one proof simultaneously explains integers, modular arithmetic, and symmetry calculations.

## 11. A complete subgroup classification in the integers

We already know that $m\mathbb Z$ is a subgroup of $(\mathbb Z,+)$ for every nonnegative integer $m$. In fact, these are all its subgroups. This is the first classification theorem in our group-theoretic development, and its proof uses the well-ordering principle introduced in Chapter 1.

Let $H\le\mathbb Z$. If $H=\{0\}$, then $H=0\mathbb Z$. Otherwise $H$ contains a nonzero integer. Because it is closed under negatives, it contains a positive integer. Let $m$ be its smallest positive element. We claim $H=m\mathbb Z$.

Every integer multiple of $m$ belongs to $H$, so $m\mathbb Z\subseteq H$. For the reverse inclusion, take $h\in H$. Integer division gives $h=qm+r$ with $0\le r<m$. Since $h$ and $qm$ belong to $H$, their difference $r=h-qm$ belongs to $H$. If $r$ were positive, it would contradict the minimality of $m$. Hence $r=0$, which says $h\in m\mathbb Z$.

The proof combines three ideas from earlier chapters: a least positive element, division with remainder, and closure under subtraction. None of those ideas disappears when we start studying groups. Instead, the subgroup definition tells us exactly which arithmetic manipulations are permitted.

As an application, consider the subgroup generated by integers $a$ and $b$, not both zero. The classification gives $\langle a,b\rangle=d\mathbb Z$ for a positive integer $d$. Since $a,b\in d\mathbb Z$, the integer $d$ divides both. Since every common divisor divides every integer combination of $a$ and $b$, it divides $d$ itself. Thus $d=\gcd(a,b)$. Bezout's theorem and subgroup classification are two views of the same underlying structure.

## Reversibility as a statement about functions

There is a general example behind the square. Let $X$ be any set, and let $S_X$ be the set of all bijections from $X$ to itself. A bijection is a function that is both injective and surjective: different inputs have different outputs, and every desired output is attained. Composition gives a binary operation on $S_X$. We should justify each part of that statement, because doing so explains why the group definition captures reversible transformations.

Take bijections $f$ and $g$. If $f(g(x))=f(g(y))$, injectivity of $f$ gives $g(x)=g(y)$, and injectivity of $g$ gives $x=y$. Thus their composite is injective. For any target $z$, surjectivity of $f$ gives a value $w$ with $f(w)=z$, and surjectivity of $g$ gives $x$ with $g(x)=w$. Consequently $f(g(x))=z$, proving surjectivity. The composite is again a bijection, establishing closure.

Associativity is checked by evaluating both parenthesizations on an arbitrary input. We get $((fg)h)(x)=f(g(h(x)))$ and $(f(gh))(x)=f(g(h(x)))$. Two functions with the same values on every input are equal. The identity function sends $x$ to $x$. For a bijection $f$, every output has exactly one input, so the rule assigning that input defines an inverse function. The equations $ff^{-1}=f^{-1}f=\operatorname{id}_X$ follow from its construction. We have now checked every group axiom rather than merely saying that functions behave well.

Why insist on bijections? On the integers, the map $x\mapsto2x$ is injective but does not reach odd integers. It has no inverse function defined on all integers with values in the integers. On the other hand, the map $x\mapsto x^2$ on the real numbers is neither injective nor surjective onto the real numbers: $1$ and $-1$ have the same image, and negative targets are missed. Failure to recover an input uniquely is exactly failure of reversibility.

For a finite set, injectivity and surjectivity are equivalent, because distinct images of all elements already fill the set. This equivalence can fail on an infinite set. The map $n\mapsto n+1$ on nonnegative integers is injective but misses $0$. Conversely, the map sending $0$ to $0$ and each positive integer $n$ to $n-1$ is surjective but not injective. These examples explain why the definition of a bijection retains both conditions even though one would suffice for a finite square's vertices.

Not every bijection of the square's four vertices is a rigid symmetry of the square. A bijection can send adjacent vertices to opposite vertices. The rigid symmetries form a subgroup of the larger group of all vertex permutations because composing adjacency-preserving rigid motions and reversing them again produces such motions. This distinction between an ambient permutation group and a geometric subgroup will matter in Chapter 10.

There is also an abstract reason that group elements act like bijections. For each $a\in G$, define left translation $L_a:G\to G$ by $L_a(x)=ax$. Its inverse is $L_{a^{-1}}$, so it is bijective. Furthermore, $L_aL_b=L_{ab}$, since both sides send $x$ to $abx$. Distinct elements give distinct translations because $L_a(e)=a$. Thus the multiplication in any group can be represented faithfully by reversible functions on its own underlying set. We will name this relationship after introducing homomorphisms, but the calculation already explains why transformations are a central model rather than just one isolated example.

## 12. How to check an unfamiliar example reliably

Start by naming the set and operation precisely. If the objects are transformations, say what they act on and what composition means. If the objects are residue classes, say which modulus is fixed. If the set is described by a formula, check that different descriptions do not create ambiguity in the operation.

Next check closure. A single missing product ends the group test. Then identify the identity and verify it on both sides. After that, find inverses inside the set, again checking both sides unless a previously proved theorem supplies the missing direction. Associativity often comes from an ambient operation, such as integer addition or function composition; explain that inheritance rather than assuming that every operation is associative.

For a subgroup question, use the ambient group's structure to reduce the work. The one-step subgroup test is frequently efficient, but it still requires nonemptiness. Saying that $xy^{-1}\in H$ whenever $x,y\in H$ does not rule out the empty set, since that implication is vacuously true there. Explicitly producing $e$ or any other element handles this logical boundary case.

When trying to disprove a claim, look for the smallest obstruction. To disprove closure, display one pair. To disprove commutativity, display one noncommuting pair. To disprove an alleged inverse, multiply it out. To disprove equality of transformations, find one input with different outputs. Concrete counterexamples are often more illuminating than vague statements that an axiom fails.

In the [browser companion](../companion/index.html), the `units` experiment lets you examine invertible residue classes and their multiplication. Regard its finite tables as examples of group behavior, not as a substitute for the axiomatic proofs above. Chapter 9 explains why the listed classes are precisely the invertible ones and how their group controls modular exponentiation.

## 13. Optional exercises

Each problem has hints and a complete reference solution in [the separate solution file](../solutions/06-solutions.md). Try examples before proving a universal statement, and keep the distinction between the ambient group and the proposed subgroup explicit.

1. Show that the nonzero real numbers under multiplication form an abelian group, while all real numbers under multiplication do not. Identify exactly which axiom fails in the second case.
2. In an arbitrary group solve $axb=c$ and $xax^{-1}=b$ for the consequences that are actually justified. For the second equation, show that a solution implies $x a^m x^{-1}=b^m$ for every integer $m$; do not assume a solution always exists.
3. Prove that a group in which $g^2=e$ for every element is abelian. Explain why the hypothesis on every element matters.
4. List the elements of $\langle r^2,s\rangle$ inside $D_8$, prove that the list is closed, and determine whether this subgroup is abelian.
5. Prove that the union of two subgroups is a subgroup if and only if one subgroup contains the other.
6. Find the subgroup of $(\mathbb Z,+)$ generated by $84$ and $30$. Give an explicit integer combination producing its smallest positive element.
7. Let $a\in G$. Prove that the set $C_G(a)=\{g\in G:ga=ag\}$ is a subgroup. Explain the difference between $C_G(a)$ and $Z(G)$.
8. A nonempty finite subset $H$ of a group is closed under multiplication. Give a second proof that it is a subgroup by considering the injective map $x\mapsto hx$ on $H$.

## 14. What the new language has earned

A group packages reversible operations. Associativity lets us regroup calculations, the identity gives a reference point, and inverses justify cancellation and equation solving. Commutativity is optional, so the order of factors must be respected. Subgroups preserve these properties inside a larger example, and generated subgroups record everything forced by selected elements.

The integers already reveal that these ideas have arithmetic content: the subgroup generated by $a$ and $b$ is the set of multiples of their gcd. The square reveals behavior that ordinary addition does not: composition can depend on order. In Chapter 7 we will study repeated application of a single element and then partition an arbitrary group into cosets. That partition will connect the number of elements in a finite group to divisibility, bringing number theory directly into the structure of groups.

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](05-linear-congruences-and-crt.md) · [Next chapter](07-cyclic-groups-and-lagrange.md) · [Hints and solutions](../solutions/06-solutions.md)
