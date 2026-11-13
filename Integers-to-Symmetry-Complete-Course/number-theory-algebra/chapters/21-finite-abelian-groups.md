# Chapter 21 — Finite abelian groups, modules and Smith normal form

A clock with twelve positions and a pair of clocks with six and two positions both have twelve possible states. Are they the same mathematical object? Counting states does not settle the question. On the twelve-position clock, one step generates every state. On the pair of clocks, repeating any single state returns to zero after at most six repetitions. The two systems have the same size but different internal structures.

Our problem is to describe every finite abelian group using clocks, and to determine when two descriptions give the same group. The answer will connect the Chinese remainder theorem to a systematic version of the Euclidean algorithm performed on integer matrices. Along the way we introduce the small amount of linear algebra that makes this connection understandable.

The prerequisites are subgroups, quotients, homomorphisms, cyclic groups, the Chinese remainder theorem, and integer divisibility. We use additive notation throughout this chapter. Thus the identity is $0$, the inverse of $a$ is $-a$, and $ka$ means repeated addition, with the usual extension to negative integers. Commutativity is essential: it allows us to rearrange sums and treat integer coefficients like coordinates.

## 1. Combining clocks and detecting their behavior

For abelian groups $A$ and $B$, their direct product $A\times B$ consists of pairs $(a,b)$, with addition performed separately in the two coordinates. The identity is $(0,0)$. If $A$ and $B$ have respectively $r$ and $s$ elements, there are $rs$ pairs. This is a count of elements, not yet a claim about cyclicity.

If $a$ has order $r$ and $b$ has order $s$, then $(a,b)$ has order $\operatorname{lcm}(r,s)$. Indeed,

$$
k(a,b)=(0,0)\quad\Longleftrightarrow\quad ka=0\text{ and }kb=0.
$$

The order of an element divides every exponent that kills it, so the right side means that both $r$ and $s$ divide $k$. The least positive such $k$ is their least common multiple. Notice how a statement about repeated addition turns into a divisibility problem.

Write $C_n=\mathbb Z/n\mathbb Z$ as an additive group. In $C_4\times C_3$, the element $(1,1)$ has order twelve. Because the whole group has twelve elements, this one element generates the group. In $C_6\times C_2$, every element has order dividing six. Therefore no element generates all twelve states. This proves the distinction in the opening example without listing every possible isomorphism.

More generally,

$$
C_r\times C_s\cong C_{rs}\quad\Longleftrightarrow\quad \gcd(r,s)=1.
$$

For the forward implication, a generator in a cyclic group of order $rs$ must correspond to an element of order $rs$ in the product. But all product orders divide $\operatorname{lcm}(r,s)=rs/\gcd(r,s)$. For the reverse implication, $(1,1)$ has order $rs$ when the gcd is one. This is the group-theoretic form of integer CRT.

An isomorphism is more informative than the phrase “these look similar.” For coprime $r,s$, the reduction map

$$
\mathbb Z/(rs)\mathbb Z\longrightarrow C_r\times C_s,\qquad [x]_{rs}\longmapsto([x]_r,[x]_s)
$$

is an explicit isomorphism. Its injectivity follows because an integer divisible by both coprime integers is divisible by their product. Its surjectivity follows from CRT. The two proofs of cyclicity are consistent: the class of $1$ maps to $(1,1)$.

We will use two invariants repeatedly. The order $|A|$ counts all elements. The exponent $\exp(A)$ is the least positive integer $e$ satisfying $ea=0$ for every $a\in A$. For $C_{n_1}\times\cdots\times C_{n_t}$, its exponent is the least common multiple of the $n_i$. Order and exponent are useful but do not classify all abelian groups. For example, $C_4\times C_4$ and $C_4\times C_2\times C_2$ both have exponent four, but different orders. Larger examples can share both invariants and still differ; we will eventually need more detailed information.

## 2. Separating one prime at a time

A prime number $p$ suggests a subgroup

$$
A_p=\{a\in A:p^k a=0\text{ for some integer }k\geq0\}.
$$

The exponent $k$ may depend on $a$. If $p^i a=0$ and $p^j b=0$, then $p^{\max(i,j)}(a-b)=0$. Thus $A_p$ is a subgroup. It collects the elements whose orders are powers of $p$, including the identity, whose order is one.

Why should these subgroups recover the whole group? Suppose first that an integer $N=uv$ kills every element of $A$, where $\gcd(u,v)=1$. Bezout provides integers $r,s$ with

$$
ru+sv=1.
$$

For any $a\in A$, write $a=rua+sva$. The first summand is killed by $v$ because $v(rua)=rNa=0$; the second is killed by $u$. This is a decomposition into parts with coprime annihilators. If an element is killed by both $u$ and $v$, Bezout shows that it is zero. Consequently the decomposition is unique.

Every finite group element has order dividing $|A|$ by Lagrange's theorem. In an abelian group we may therefore take $N=|A|$. Apply the preceding argument repeatedly to its distinct prime-power factors. It follows that

$$
A\cong\prod_{p\mid |A|}A_p.
$$

The product is finite, so there is no distinction here between direct product and direct sum. The isomorphism sends a tuple of prime-power parts to their sum. Surjectivity is the Bezout decomposition. Injectivity follows because a prime-power component cannot simultaneously have order dividing an integer coprime to that prime.

For a numerical example, take $C_{12}$. Since $12=4\cdot3$ and $1=4-3$, every class $a$ decomposes as $4a+(-3a)$. The term $4a$ is killed by three and the term $-3a$ is killed by four. At $a=1$, these are $4$ and $9$ modulo twelve, and $4+9=1$. The subgroup of elements killed by a power of two is $\{0,3,6,9\}$, isomorphic to $C_4$. The three-primary subgroup is $\{0,4,8\}$, isomorphic to $C_3$.

This decomposition is canonical: an isomorphism preserves element orders and therefore carries $A_p$ to the corresponding $p$-primary subgroup in the other group. The individual generators chosen inside $A_p$ will not be canonical. Distinguishing an intrinsic subgroup from a convenient coordinate choice prevents a common conceptual mistake.

For $C_{12}\times C_{18}$, first separate the cyclic factors:

$$
C_{12}\times C_{18}\cong(C_4\times C_3)\times(C_2\times C_9).
$$

Rearranging coordinates, which is allowed in a direct product, gives $(C_4\times C_2)\times(C_3\times C_9)$. The first parenthesis is the two-primary part; the second is the three-primary part. We have reduced a mixed-prime classification problem to two prime-power problems.

## 3. The simplest prime-power groups are vector spaces

Suppose $pa=0$ for every $a\in A$, where $p$ is prime. Integer multiplication of $a$ then depends only on the integer modulo $p$. Define $[k]_p\,a=ka$. This is well-defined: changing $k$ by a multiple of $p$ changes $ka$ by zero. The scalars now belong to the field $\mathbb F_p$.

This structure is a vector space. A vector space over a field $F$ is an abelian group under addition together with scalar multiplication satisfying distributivity, compatibility $(rs)v=r(sv)$, and $1v=v$. The familiar arrows in the plane are one example. A group killed by $p$ is a different example, with the same algebraic rules and finitely many scalar choices.

A list $v_1,\ldots,v_d$ spans a vector space if every vector can be written as $a_1v_1+\cdots+a_dv_d$ using scalars in the field. It is linearly independent if the equation $a_1v_1+\cdots+a_dv_d=0$ forces every scalar to be zero. A basis is a list satisfying both conditions. Spanning gives existence of coordinates; independence gives uniqueness.

In a finite vector space, a basis can be built by starting with no vectors and adding a vector outside the span of those already selected. Each addition strictly enlarges the span, so the process terminates. Independence is preserved: a relation involving the new vector with a nonzero coefficient would express that vector using the old ones, because nonzero field elements can be divided out.

If $v_1,\ldots,v_d$ is a basis over $\mathbb F_p$, there are $p$ choices for each coordinate, hence $p^d$ vectors. Moreover,

$$
A\cong C_p^d
$$

as additive groups. For instance, $C_2\times C_2\times C_2$ is a three-dimensional vector space over $\mathbb F_2$. Its nonzero elements all have order two. It is not cyclic despite having eight elements.

This discussion is useful even when $A$ is not killed by $p$. For a finite abelian $p$-group, the quotient $A/pA$ is killed by $p$, where $pA=\{pa:a\in A\}$. Therefore $A/pA$ is an $\mathbb F_p$-vector space. Its dimension measures how many independent generators remain after multiples of $p$ are ignored.

For $A=C_8\times C_4\times C_2$, the quotient $A/2A$ has one binary coordinate from each factor, so it has dimension three. But $C_8\times C_8$ has quotient dimension two. Both groups have order sixty-four, but this invariant distinguishes them. We are beginning to see why a single number such as order or exponent is insufficient.

## 4. Why integer modules appear naturally

A vector space allows division by every nonzero scalar. An abelian group generally does not. In $C_6$, the equation $2x=1$ has no solution, while $2x=0$ has more than one. It would be incorrect to pretend that every abelian group is a vector space over the integers: the integers are not a field.

The appropriate generalization is a module. An $R$-module over a commutative ring $R$ is an abelian group with scalar multiplication by elements of $R$, satisfying the same formal distributive and compatibility laws as a vector space. Division is not included among those laws. Every abelian group is a $\mathbb Z$-module by repeated addition, and every $\mathbb Z$-module is an abelian group. These are two descriptions of the same structure.

The free abelian group $\mathbb Z^r$ consists of integer coordinate vectors. Its standard vectors $e_1,\ldots,e_r$ have one coordinate equal to one and all others zero. Every vector has a unique expression $n_1e_1+\cdots+n_re_r$. “Free” means precisely that no nontrivial integer relation exists among these chosen generators.

If $A$ is generated by $a_1,\ldots,a_r$, there is a surjective homomorphism

$$
\pi:\mathbb Z^r\longrightarrow A,\qquad(n_1,\ldots,n_r)\longmapsto n_1a_1+\cdots+n_ra_r.
$$

Its kernel $L$ consists of all relations among the generators. The first isomorphism theorem gives $A\cong\mathbb Z^r/L$. We have converted a group into integer vectors modulo a subgroup of relations.

For $C_4\times C_2$, choose its two coordinate generators. The relations are generated by $(4,0)$ and $(0,2)$. Thus the group is $\mathbb Z^2$ modulo the integer span of these two vectors. For a less transparent presentation, consider generators $a,b$ satisfying $4a+2b=0$ and $2a+4b=0$. The relation matrix, with relations as columns, is

$$
M=\begin{pmatrix}4&2\\2&4\end{pmatrix}.
$$

The quotient is $\mathbb Z^2/M\mathbb Z^2$. Our task is to change coordinates until the relations become separate clock relations.

## 5. Matrices as records of coordinate operations

A matrix is a rectangular array of numbers. Multiplying a matrix by a coordinate column means taking, in each output coordinate, the indicated linear combination of input coordinates. With the preceding $M$, the column $(u,v)$ is sent to $(4u+2v,2u+4v)$. Hence its image is exactly the set of relations generated by the columns.

Only certain integer coordinate changes are reversible over the integers. Swapping two coordinates is reversible. Negating one coordinate is reversible. Adding an integer multiple of one coordinate to another is reversible because we can subtract the same multiple afterward. A square integer matrix obtained from such operations is unimodular: it has an integer inverse. Equivalently its determinant is $1$ or $-1$, although we do not need determinant theory to justify the operations.

Row operations change the coordinates of the ambient free group $\mathbb Z^r$. Column operations replace a list of relation generators by another list spanning exactly the same relation subgroup. Both preserve the isomorphism type of the presented quotient. But arbitrary operations that divide a row by two do not preserve that type. The quotient of $\mathbb Z$ by $2\mathbb Z$ has two elements; replacing the relation $2$ by $1$ would destroy the group.

Now reduce the example. Swap the two rows of $M$, obtaining

$$
\begin{pmatrix}2&4\\4&2\end{pmatrix}.
$$

Subtract twice the first row from the second to obtain $\begin{pmatrix}2&4\\0&-6\end{pmatrix}$. Subtract twice the first column from the second, obtaining $\begin{pmatrix}2&0\\0&-6\end{pmatrix}$. Negate the second row. The final matrix is $\operatorname{diag}(2,6)$, where “diag” means the diagonal matrix with the displayed diagonal entries and zeros elsewhere.

We conclude that the presented group is $C_2\times C_6$. Its order is twelve, and its exponent is six. This also provides a check against an erroneous guess of $C_{12}$. The calculation is a two-dimensional Euclidean algorithm: remainders replace large entries until independent divisibility relations remain.

For a diagonal relation matrix $\operatorname{diag}(d_1,\ldots,d_r)$ with positive entries, the quotient is

$$
\mathbb Z^r/(d_1\mathbb Z\times\cdots\times d_r\mathbb Z)\cong C_{d_1}\times\cdots\times C_{d_r}.
$$

A diagonal entry one gives a trivial factor and can be omitted. A zero diagonal entry gives an unrestricted copy of $\mathbb Z$, so the group is infinite. This distinction will explain why full rank is necessary in a finite presentation.

## 6. Smith normal form: an algorithm with a proof

The Smith normal form theorem says that every integer matrix can be transformed by reversible integer row and column operations into a diagonal rectangular matrix whose nonzero diagonal entries are positive and satisfy

$$
d_1\mid d_2\mid\cdots\mid d_t.
$$

There may also be zero rows or columns. The divisibility chain is the feature that makes the result a canonical classification tool, rather than merely a diagonalization trick.

Here is an existence proof that also describes an algorithm. If every entry is zero, there is nothing to do. Otherwise move a nonzero entry into the upper-left corner, and negate its row if needed to make the entry positive. Call this pivot $a$. Use integer division on entries below it: subtract suitable multiples of the first row so each entry in the first column has remainder between zero and $a-1$. If a nonzero remainder occurs, swap its row to the top. The positive pivot has strictly decreased.

Perform the analogous process across the first row, now using column operations. A nonzero remainder again produces a smaller positive pivot. Because a strictly decreasing sequence of positive integers cannot continue forever, eventually the pivot divides every entry in its row and column. Clear that row and column by subtraction, leaving a block form

$$
\begin{pmatrix}a&0\\0&B\end{pmatrix}.
$$

This is not yet enough. Perhaps $a$ fails to divide an entry $b$ of the lower-right block $B$. Add the row containing $b$ to the first row. The first coordinate of that row remains $a$, since entries below the pivot in the first column are zero, while the first row now contains $b$ in the relevant column. Divide that entry by $a$ using a column operation. Because $a\nmid b$, the nonzero remainder is smaller than $a$, and swapping columns yields a smaller pivot.

Restart the reduction. Each restart decreases a positive integer, so eventually the cleared pivot divides every entry of the remaining block. Apply the same procedure inductively to $B$. Row and column operations within that block keep every entry divisible by $a$. Therefore each new diagonal entry is divisible by $a$. The induction produces the whole divisibility chain.

This proof uses only integer division, well-ordering, and reversible changes of generators. The apparent complication about entries in the remaining block is essential. A diagonal matrix $\operatorname{diag}(2,3)$ is diagonal, but it is not Smith normal form because two does not divide three. Indeed its quotient is $C_2\times C_3\cong C_6$, whose Smith form has entries $1,6$.

One can detect the diagonal entries without recording every operation. The gcd of all entries is unchanged by reversible row and column operations, so it equals $d_1$. For a two-by-two full-rank matrix, the absolute determinant is unchanged and equals $d_1d_2$. Thus $d_2=|\det M|/d_1$. Here $\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc$. For our example, the gcd of entries is two and the absolute determinant is twelve, giving $d_1=2,d_2=6$.

For larger matrices, gcds of minors play the analogous role. A minor of size $k$ is the determinant of a square submatrix formed from $k$ selected rows and columns. The gcd of all such minors equals $d_1\cdots d_k$ when $k\leq t$. This useful general fact follows from the determinant expansion under row and column operations; we state it here as an optional computational extension rather than relying on an unintroduced general determinant proof.

## 7. Why every finite abelian group has such a presentation

Every finite abelian group is finitely generated: in the worst case, list all its elements. We already have a surjection $\mathbb Z^r\to A$. To apply an integer matrix algorithm to the kernel, we must know that the kernel itself has finitely many generators. This is not automatic for arbitrary algebraic structures, so it deserves a proof.

In fact every subgroup $L\leq\mathbb Z^r$ is free abelian of rank at most $r$. We prove this by induction on $r$. For $r=1$, every subgroup of $\mathbb Z$ is $d\mathbb Z$, including $d=0$; this follows by choosing the least positive element and using division. Now project $L\leq\mathbb Z^r$ onto its first coordinate. The image is a subgroup $d\mathbb Z$.

If $d=0$, every element has first coordinate zero, and induction applies inside the remaining $r-1$ coordinates. If $d>0$, choose $v\in L$ whose first coordinate is $d$. Every $w\in L$ has first coordinate $kd$ for an integer $k$, so $w-kv$ has first coordinate zero. Let $L_0$ be the subgroup of $L$ with first coordinate zero. By induction, it has a basis $w_1,\ldots,w_s$. Therefore $v,w_1,\ldots,w_s$ span $L$.

They are independent: in a relation $nv+\sum n_iw_i=0$, the first coordinate is $nd$, so $n=0$; independence of the $w_i$ then forces all other coefficients to vanish. This establishes the induction and supplies a finite basis for the relation subgroup.

Put these relation basis vectors into the columns of a matrix and apply Smith normal form. The quotient becomes a product of finite cyclic factors and possibly free copies of $\mathbb Z$. Since our original $A$ is finite, no unrestricted coordinate can remain. Consequently every finite abelian group has an invariant-factor decomposition

$$
A\cong C_{d_1}\times\cdots\times C_{d_r},\qquad 1<d_1\mid d_2\mid\cdots\mid d_r.
$$

The name “invariant factor” emphasizes that, although we changed generators repeatedly, these numbers ultimately depend only on the group. Existence has now been proved. Uniqueness needs a separate argument; an algorithm that can produce an answer does not by itself show that different paths produce the same answer.

## 8. Recovering the factors from intrinsic information

First use CRT to split each invariant factor into prime-power factors. We obtain an elementary-divisor form

$$
A\cong\prod_p\prod_{j=1}^{r_p}C_{p^{\lambda_{p,j}}},
$$

where each $\lambda_{p,j}$ is a positive integer. For a fixed prime, put the exponents in decreasing order. We will show that the multiset of these exponents is recoverable without knowing any chosen coordinates.

For a finite abelian $p$-group $P$, consider

$$
p^{k-1}P/p^kP\qquad(k\geq1).
$$

This quotient is killed by $p$, so it is a vector space over $\mathbb F_p$. Let its dimension be $b_k$. In a single cyclic factor $C_{p^\lambda}$, multiplication by $p$ removes one available base-$p$ digit at a time. Therefore the quotient $p^{k-1}C_{p^\lambda}/p^kC_{p^\lambda}$ has dimension one if $\lambda\geq k$ and zero otherwise.

For a product, dimensions add, giving

$$
b_k=\#\{j:\lambda_{p,j}\geq k\}.
$$

Thus $b_k-b_{k+1}$ counts the cyclic factors whose exponent is exactly $p^k$. These dimensions are intrinsic because an isomorphism carries $p^kP$ to the corresponding subgroup in the other group. They determine every elementary divisor, proving uniqueness.

For $P=C_8\times C_4\times C_2$, the sequence is $b_1=3,b_2=2,b_3=1,b_4=0$. The successive differences are one, one, one: exactly one factor of each order $2,4,8$. For $C_8\times C_8$, the sequence is $2,2,2,0$, revealing two factors of order eight. This is a proof-oriented use of vector-space dimensions, rather than an unsupported classification slogan.

To convert elementary divisors to invariant factors, align each prime's exponents in increasing order and pad the beginning with zeros until all rows have equal length. Multiply the prime powers in each column. The resulting column products form a divisibility chain. For $C_4\times C_2\times C_3\times C_9$, the aligned rows are $(2,4)$ and $(3,9)$, giving $C_6\times C_{36}$. Its order is $216$, matching $4\cdot2\cdot3\cdot9$, and its exponent is thirty-six.

## 9. Classifying groups of a given order

Let us classify abelian groups of order seventy-two. Factor $72=2^3\cdot3^2$. The two-primary part has order eight. Its possible elementary-divisor forms correspond to partitions of three:

$$
C_8,\qquad C_4\times C_2,\qquad C_2\times C_2\times C_2.
$$

The three-primary part has order nine, so it is $C_9$ or $C_3\times C_3$. Choosing independently gives six groups. In invariant-factor form they are

| Two-primary part | Three-primary part | Invariant factors |
|---|---|---|
| $C_8$ | $C_9$ | $C_{72}$ |
| $C_8$ | $C_3\times C_3$ | $C_3\times C_{24}$ |
| $C_2\times C_4$ | $C_9$ | $C_2\times C_{36}$ |
| $C_2\times C_4$ | $C_3\times C_3$ | $C_6\times C_{12}$ |
| $C_2^3$ | $C_9$ | $C_2\times C_2\times C_{18}$ |
| $C_2^3$ | $C_3^2$ | $C_2\times C_6\times C_6$ |

The uniqueness theorem says this list has no duplicates and misses no finite abelian group of the specified order. It says nothing about nonabelian groups of order seventy-two. The hypothesis “abelian” was used in treating generators as integer coordinates, rearranging relations, and describing subgroups $pA$ as images of homomorphisms.

As a number-theoretic example, consider $(\mathbb Z/45\mathbb Z)^\times$. Ring CRT gives a product of unit groups modulo nine and five. The element two has order six modulo nine, so the first group is $C_6$. The element two has order four modulo five, so the second is $C_4$. Hence

$$
(\mathbb Z/45\mathbb Z)^\times\cong C_6\times C_4\cong C_2\times C_{12}.
$$

There are twenty-four units, but no primitive root modulo forty-five, since the exponent is twelve. This is a structural explanation of a phenomenon that might otherwise look like a failure to search far enough.

## 10. From structural coordinates to actual calculations

Let us slow down and use the decomposition to answer a question that is harder to see from a multiplication table. How many homomorphisms are there from $C_m$ to $C_n$? A homomorphism is determined by the image $x$ of the class of one, because the image of the class of $k$ must be $kx$. However, the source relation $m[1]=0$ requires $mx=0$ in the target. Conversely, any target element satisfying this relation defines a well-defined homomorphism. Thus there are exactly $\gcd(m,n)$ homomorphisms.

For example, a homomorphism $C_6\to C_4$ can send one only to zero or two. Sending one to one would violate the source relation, since six times one is two modulo four. Sending one to two works because six times two is zero modulo four. This is a simple instance of the general principle that maps out of a presentation are specified by generator images satisfying every relation.

For products, specify the image of each source generator independently, subject to its order relation. Thus the number of homomorphisms from $C_{m_1}\times\cdots\times C_{m_r}$ to $C_{n_1}\times\cdots\times C_{n_s}$ is

$$
\prod_{i=1}^{r}\prod_{j=1}^{s}\gcd(m_i,n_j).
$$

Why may we choose the images independently? The target is abelian, so all commutativity relations in the source are automatically respected. Without target commutativity, arbitrary images of the source generators might fail to commute. Again a hypothesis that looks like background bookkeeping is doing real work.

Consider maps from $C_2\times C_4$ to itself. The first source generator has two choices in each target coordinate, because the equations $2x=0$ have two solutions both in $C_2$ and in $C_4$. It therefore has four possible images. The second source generator has two choices in $C_2$ and four in $C_4$, giving eight possible images. There are thirty-two endomorphisms in total. An endomorphism is a homomorphism from a group to itself; it need not be invertible. The zero map is one of these thirty-two and certainly is not an automorphism.

We can also read off the least number of generators. For a finite abelian $p$-group with $r_p$ cyclic prime-power factors, its quotient by $p$ times the group is an $r_p$-dimensional vector space. A generating list must map to a spanning list there, so it needs at least $r_p$ members. This supplies a lower bound for every generating list of the original mixed-prime group. Taking the maximum over primes gives a lower bound of $\max_p r_p$.

The invariant-factor decomposition realizes that bound: it has exactly the maximum number of factors after the prime rows are padded and aligned, and one generator for each factor generates the product. Therefore the minimum number of generators is $\max_p r_p$, not the sum of the numbers for all primes. The group $C_2\times C_3$ requires only one generator because the prime components can be synchronized by CRT. The group $C_2\times C_2\times C_3$ requires two.

Here is a pair for which both order and exponent fail to distinguish groups. Let $A=C_4\times C_4\times C_4$ and $B=C_4\times C_4\times C_2\times C_2$. Both have sixty-four elements and exponent four. In $A$, the equation $2a=0$ has $2^3=8$ solutions. In $B$, it has $2^4=16$ solutions. An isomorphism would preserve this equation and its solution set, so no isomorphism exists. The vector-space quotients $A/2A$ and $B/2B$ have dimensions three and four, respectively, describing the same difference conceptually.

It is worth keeping straight two closely related vector spaces: $P/pP$ and $P[p]=\{x:px=0\}$. They have the same dimension for a finite abelian $p$-group, because each cyclic prime-power factor contributes one dimension to each. They are nevertheless different constructions. The former is a quotient by a subgroup; the latter is a subgroup. In $C_8$, the first consists of two cosets modulo the even elements, whereas the second consists of the elements zero and four. An abstract isomorphism between them does not identify their elements in a canonical way.

The classification also makes quotient calculations manageable when the subgroup is given by relations. Suppose $A=C_{12}\times C_{18}$ and we additionally impose that the two coordinate generators are equal. Introduce generators $a,b$ with relations $12a=0$, $18b=0$, and $a-b=0$. Substituting $b=a$ reduces the relations to $12a=18a=0$. Bezout then gives $6a=0$. Conversely the relation $6a=0$ implies both original torsion relations. The quotient is therefore $C_6$. Merely dividing the order of $A$ by the order of a guessed subgroup would not identify its structure.

Finally, consider the distinction between a theorem of existence and an efficient computation. Enumerating all elements of a group given by a large relation matrix may be impossible in practice. Smith reduction can still simplify the matrix using integer arithmetic. Conversely, a naive Smith algorithm may make intermediate entries large even when the final factors are small. The proof establishes termination and correctness, not a sharp bound on running time. Practical implementations choose pivots carefully and control coefficient growth. Those engineering choices do not change which operations are mathematically legal.

These calculations show what classification buys us: we can count maps, determine generator requirements, count solutions of equations, and simplify additional relations. Each problem reduces to divisibility in cyclic factors, while the proof of classification explains why that reduction applies to every finite abelian group.

## 11. Using the classification responsibly

A classification theorem is a tool for turning a large question into smaller calculations. It does not make every subgroup or homomorphism automatic. For example, a subgroup of $C_4\times C_4$ need not be the product of subgroups of the two displayed coordinates. The diagonal subgroup $\{(a,a):a\in C_4\}$ couples the coordinates. Its abstract isomorphism type is $C_4$, but its placement inside the ambient group contains additional information.

Likewise, an abstract isomorphism need not preserve a chosen coordinate. A relation-matrix calculation may mix the original generators. If a problem asks what happens to a particular element, record the row and column operations, not just the final diagonal entries. The Smith form identifies the abstract quotient; the transformation matrices identify coordinates of distinguished elements.

A useful check is to count solutions of $ka=0$. In $C_n$, there are $\gcd(k,n)$ solutions, since $kx\equiv0\pmod n$ is a linear congruence. Therefore in $A=C_{n_1}\times\cdots\times C_{n_r}$ the number is $\prod_i\gcd(k,n_i)$. Such counts are isomorphism invariants and can expose an incorrect decomposition even when total orders agree.

A particularly useful bridge to the next chapters is the behavior of multiplicative groups inside fields. In a general finite abelian group, many independent factors can have orders involving the same prime. Field multiplication imposes an additional restriction: a polynomial of degree $d$ has at most $d$ roots. If a finite multiplicative subgroup has exponent $e$, every member solves $X^e-1=0$. Hence the subgroup has at most $e$ elements. The classification supplies an element of order exactly the exponent, so the subgroup also has at least $e$ elements. These bounds force equality and cyclicity. The argument becomes a complete proof in Exercise 7.

This is a striking example of number theory and algebra interacting. Finite abelian classification alone allows $C_2\times C_2$ as a group of order four. Such a group cannot occur as a multiplicative subgroup of a field, because its four elements would all satisfy $X^2-1=0$. A nonzero quadratic cannot have four roots in a field. In contrast, the units modulo eight do form $C_2\times C_2$: the four units are $1,3,5,7$, and each squares to one. There is no contradiction because $\mathbb Z/8\mathbb Z$ is not a field. Polynomial root bounds over arbitrary rings can fail when zero divisors are present.

When applying this bridge, do not replace “finite subgroup of field units” by “finite subgroup of ring units.” The latter includes the modulo-eight counterexample. Nor should one conclude that the additive group of a finite field is cyclic. Its addition is controlled by its characteristic and vector-space dimension; its nonzero multiplication is constrained by the root bound. The same set supports two operations with very different group structures. Keeping the operation visible is one of the most reliable habits in abstract algebra.

The [browser companion](../companion/index.html) includes an abelian-group lab for comparing cyclic decompositions and element-order information. Use it to check small examples after doing the reasoning. A finite calculation can refute an incorrect guess; the classification theorem explains all finite abelian groups, including sizes too large to enumerate.

In this chapter, integer factorization separated prime components, vector spaces measured layers, and the Euclidean algorithm simplified relations. These are not three unrelated tricks. They are ways of finding coordinates adapted to divisibility. The next chapter changes the scalars from integers to fields and asks how adjoining a new number enlarges a space of possible coordinates.

## Optional exercises

1. Determine whether $C_{15}\times C_4$ is cyclic. Give an explicit generator if it is.
2. Find the order and exponent of $C_{12}\times C_{18}$, and convert it to invariant-factor form.
3. Find the Smith form of $\begin{pmatrix}6&4\\2&8\end{pmatrix}$ using reversible operations or the two-by-two gcd and determinant rule. Identify the quotient group.
4. List all abelian groups of order thirty-six, in invariant-factor form, and explain why the list is complete.
5. For $A=C_8\times C_4\times C_2$, compute the number of solutions to $2a=0$ and $4a=0$.
6. Explain why $C_4\times C_4$ and $C_8\times C_2$ are not isomorphic using both exponents and the dimensions of prime-power layers.
7. Prove that every finite subgroup of the multiplicative group of a field is cyclic, assuming the polynomial root bound from Chapter 15 and the finite abelian classification. This will be used for finite fields.
8. A group has two generators with relations $2a+4b=0$ and $6a+8b=0$. Identify its isomorphism type and decide whether it is cyclic.

[Hints and complete worked solutions](../solutions/21-solutions.md).

<!-- course-navigation -->

---

[Course index](../README.md) · [Previous chapter](20-diophantine-and-continued-fractions.md) · [Next chapter](22-field-extensions.md) · [Hints and solutions](../solutions/21-solutions.md)
